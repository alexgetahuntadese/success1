import fs from 'fs';

// 2014 Natural Science Exams
const naturalScience2014 = [
  { subject: 'physics', id: 'physics-159', code: 'nat' },
  { subject: 'english', id: 'english-160', code: 'nat' },
  { subject: 'civics', id: 'civics-and-ethical-education-157', code: 'nat' },
  { subject: 'sat', id: 'scholastic-aptitude-test-158', code: 'nat' },
];

// 2014 Social Science Exams
const socialScience2014 = [
  { subject: 'civics', id: 'civics-and-ethical-education-165', code: 'soc' },
  { subject: 'english', id: 'english-163', code: 'soc' },
  { subject: 'geography', id: 'geography-164', code: 'soc' },
  { subject: 'history', id: 'history-162', code: 'soc' },
  { subject: 'math', id: 'mathematics-167', code: 'soc' },
  { subject: 'sat', id: 'scholastic-aptitude-test-166', code: 'soc' },
];

function cleanText(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function parseExam(baseUrl, subject, examId, stream) {
  const pages = Array.from({ length: 12 }, (_, i) => `${baseUrl}/${i + 1}`);
  const questions = [];

  for (const url of pages) {
    try {
      const text = await fetchPage(url);
      // extract question blocks
      const re = /<h3[^>]*>\s*Question\s*(\d+)[^<]*<\/h3>([\s\S]*?)(?=<h3[^>]*>\s*Question\s*\d+|$)/g;
      let m;
      while ((m = re.exec(text))) {
        const num = parseInt(m[1], 10);
        let block = m[2].trim();
        block = block.replace(/Show Explanation/g, '');
        // extract option blocks
        const opts = [];
        const optDivRe = /<div[^>]*class=["'][^"']*cho-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/g;
        let om;
        let firstOptIndex = null;
        while ((om = optDivRe.exec(block))) {
          if (firstOptIndex === null) firstOptIndex = om.index;
          const txt = cleanText(om[1]);
          const cleaned = txt.replace(/^[A-D]\s*/,'').trim();
          if (cleaned) opts.push(cleaned);
        }

        // fallback
        if (opts.length === 0) {
          const optRe = /([A-D])([^A-D]+)/g;
          while ((om = optRe.exec(cleanText(block)))) {
            if (firstOptIndex === null) firstOptIndex = om.index;
            opts.push(om[2].trim());
          }
        }

        let questionText = block;
        if (firstOptIndex !== null) questionText = block.slice(0, firstOptIndex);
        questionText = cleanText(questionText).replace(/^(Share This Question)/i, '').trim();

        if (questionText && opts.length > 0) {
          questions.push({
            id: `m2014-${stream}-${subject}-${num}`,
            question: questionText,
            options: opts.map(cleanText),
            correctAnswer: -1,
            explanation: '',
          });
        }
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
  // Parse Natural Science exams
  for (const exam of naturalScience2014) {
    const baseUrl = `https://kehulum.com/entrance-exam/natural-science/2014/${exam.id}`;
    console.log(`Fetching Natural Science 2014 ${exam.subject}...`);
    
    const questions = await parseExam(baseUrl, exam.subject, exam.id, 'nat');
    
    const varName = `matric2014${exam.subject.charAt(0).toUpperCase() + exam.subject.slice(1)}Questions`;
    const out = `import { MatricExamQuestion } from "./matricExams";

export const ${varName}: MatricExamQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
    
    fs.writeFileSync(`src/data/${varName}.ts`, out);
    console.log(`Wrote src/data/${varName}.ts with ${questions.length} items`);
  }

  // Parse Social Science exams
  for (const exam of socialScience2014) {
    const baseUrl = `https://kehulum.com/entrance-exam/social-science/2014/${exam.id}`;
    console.log(`Fetching Social Science 2014 ${exam.subject}...`);
    
    const questions = await parseExam(baseUrl, exam.subject, exam.id, 'soc');
    
    const varName = `matric2014Social${exam.subject.charAt(0).toUpperCase() + exam.subject.slice(1)}Questions`;
    const out = `import { MatricExamQuestion } from "./matricExams";

export const ${varName}: MatricExamQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
    
    fs.writeFileSync(`src/data/${varName}.ts`, out);
    console.log(`Wrote src/data/${varName}.ts with ${questions.length} items`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
