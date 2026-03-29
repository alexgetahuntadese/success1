import fs from 'fs';

const base = 'https://kehulum.com/entrance-exam/social%20science/2015/scholastic-aptitude-test-196';
const pages = Array.from({ length: 10 }, (_, i) => `${base}/${i + 1}`);

function cleanText(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function main() {
  const questions = [];
  let currentSection = '';
  let currentDirection = '';

  for (const url of pages) {
    try {
      const text = await fetchPage(url);
      
      // Extract section headers and directions
      const sectionRe = /#####\s*([^<]+)/g;
      let sectionMatch;
      while ((sectionMatch = sectionRe.exec(text))) {
        const sectionText = cleanText(sectionMatch[1]);
        if (sectionText.includes('Direction')) {
          currentDirection = sectionText;
        } else {
          currentSection = sectionText;
        }
      }
      
      // extract question blocks
      const re = /<h3[^>]*>\s*Question\s*(\d+)[^<]*<\/h3>([\s\S]*?)(?=<h3[^>]*>\s*Question\s*\d+|$)/g;
      let m;
      while ((m = re.exec(text))) {
        const num = parseInt(m[1], 10);
        let block = m[2].trim();
        block = block.replace(/Show Explanation/g, '');
        
        // extract option blocks (Kehulum uses divs for choices)
        const opts = [];
        const optDivRe = /<div[^>]*class=["'][^"']*cho-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/g;
        let om;
        let firstOptIndex = null;
        while ((om = optDivRe.exec(block))) {
          if (firstOptIndex === null) firstOptIndex = om.index;
          const txt = cleanText(om[1]);
          // remove any leading letters like A, B, C, D
          const cleaned = txt.replace(/^[A-D]\s*/,'').trim();
          if (cleaned) opts.push(cleaned);
        }

        // fallback: if no opt divs found, try letter markers
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

        // Determine question type based on section
        let questionType = 'verbal';
        if (currentSection.toLowerCase().includes('quantitative') || currentDirection.toLowerCase().includes('numerical')) {
          questionType = 'quantitative';
        }

        questions.push({
          id: `m2015-social-sat-${num}`,
          question: questionText,
          options: opts.map(cleanText),
          correctAnswer: -1,
          explanation: '',
          sectionGroupTitle: currentSection,
          sectionTitle: questionType,
          sectionDirection: currentDirection,
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

  const out = `import { MatricExamQuestion } from "./matricExams";

export const matric2015SocialScholasticAptitudeQuestions: MatricExamQuestion[] = ${JSON.stringify(
    questions,
    null,
    2
  )};
`;

  fs.writeFileSync('src/data/matric2015SocialScholasticAptitudeQuestions.ts', out);
  console.log('Wrote src/data/matric2015SocialScholasticAptitudeQuestions.ts with', questions.length, 'items');
}

main().catch((e) => { console.error(e); process.exit(1); });
