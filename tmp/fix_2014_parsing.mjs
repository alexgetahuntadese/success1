import fs from 'fs';
import path from 'path';

// Clean up malformed 2014 files and re-parse properly
const filesToFix = [
  { file: 'matric2014PhysicsQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/natural-science/2014/physics-159', stream: 'nat', subject: 'physics' },
  { file: 'matric2014EnglishQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/natural-science/2014/english-160', stream: 'nat', subject: 'english' },
  { file: 'matric2014CivicsQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/natural-science/2014/civics-and-ethical-education-157', stream: 'nat', subject: 'civics' },
  { file: 'matric2014SatQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/natural-science/2014/scholastic-aptitude-test-158', stream: 'nat', subject: 'sat' },
  { file: 'matric2014SocialCivicsQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/social-science/2014/civics-and-ethical-education-165', stream: 'soc', subject: 'civics' },
  { file: 'matric2014SocialEnglishQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/social-science/2014/english-163', stream: 'soc', subject: 'english' },
  { file: 'matric2014SocialGeographyQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/social-science/2014/geography-164', stream: 'soc', subject: 'geography' },
  { file: 'matric2014SocialHistoryQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/social-science/2014/history-162', stream: 'soc', subject: 'history' },
  { file: 'matric2014SocialMathQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/social-science/2014/mathematics-167', stream: 'soc', subject: 'math' },
  { file: 'matric2014SocialSatQuestions.ts', baseUrl: 'https://kehulum.com/entrance-exam/social-science/2014/scholastic-aptitude-test-166', stream: 'soc', subject: 'sat' },
];

function cleanText(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function parseExam(baseUrl, subject, stream) {
  const pages = Array.from({ length: 12 }, (_, i) => `${baseUrl}/${i + 1}`);
  const questions = [];

  for (const url of pages) {
    try {
      const text = await fetchPage(url);
      
      // Better extraction - look for cho-item divs more carefully
      const questionBlocks = text.split(/<h3[^>]*>\s*Question\s*(\d+)[^<]*<\/h3>/);
      
      for (let i = 1; i < questionBlocks.length; i += 2) {
        const num = parseInt(questionBlocks[i], 10);
        const block = questionBlocks[i + 1] || '';
        
        // Extract options more carefully - only get text from cho-item divs
        const opts = [];
        const optDivRe = /<div[^>]*class=["'][^"']*cho-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
        let om;
        
        while ((om = optDivRe.exec(block))) {
          let optText = om[1];
          // Remove any inner HTML tags
          optText = optText.replace(/<[^>]+>/g, ' ');
          optText = cleanText(optText);
          // Remove leading A, B, C, D if present
          optText = optText.replace(/^[A-D][\.\s]*/, '').trim();
          // Skip if it's junk text
          if (optText && 
              !optText.includes('No explanation') && 
              !optText.includes('omments') && 
              !optText.includes('Login') &&
              !optText.includes('ccount') &&
              !optText.includes('dd your') &&
              optText.length > 0) {
            opts.push(optText);
          }
        }
        
        // Extract question text
        let questionText = block.substring(0, block.indexOf('<div') > -1 ? block.indexOf('<div') : block.length);
        questionText = cleanText(questionText)
          .replace(/^Share This Question/i, '')
          .replace(/^Share Share This Question/i, '')
          .trim();
        
        // Skip if no valid question or options
        if (!questionText || opts.length === 0 || opts.length > 4) continue;
        
        questions.push({
          id: `m2014-${stream}-${subject}-${num}`,
          question: questionText,
          options: opts.slice(0, 4), // Take only first 4 valid options
          correctAnswer: -1,
          explanation: '',
        });
      }
    } catch (err) {
      console.error('fetch error', url, err.message);
    }
  }

  // sort by numeric id
  questions.sort((a, b) => {
    const na = parseInt(a.id.split('-').pop(), 10);
    const nb = parseInt(b.id.split('-').pop(), 10);
    return na - nb;
  });

  return questions;
}

async function main() {
  for (const exam of filesToFix) {
    console.log(`Re-parsing ${exam.file}...`);
    
    const questions = await parseExam(exam.baseUrl, exam.subject, exam.stream);
    
    if (questions.length === 0) {
      console.log(`No questions found for ${exam.file}, skipping`);
      continue;
    }
    
    const varName = exam.file.replace('.ts', '');
    const out = `import { MatricExamQuestion } from "./matricExams";

export const ${varName}: MatricExamQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
    
    fs.writeFileSync(`src/data/${exam.file}`, out);
    console.log(`Fixed ${exam.file} with ${questions.length} valid questions`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
