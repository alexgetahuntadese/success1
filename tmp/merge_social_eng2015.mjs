import fs from 'node:fs';
import path from 'node:path';

const srcDir = path.join(process.cwd(), 'src', 'data');
const socialPath = path.join(srcDir, 'matric2015SocialEnglishQuestions.ts');
const engPath = path.join(srcDir, 'matric2015EnglishQuestions.ts');

function extractQuestions(fileContent) {
  const entries = [];
  const itemRegex = /\{[\s\S]*?id:\s*"([^"]+)",[\s\S]*?question:\s*([\s\S]*?),\n\s*options:\s*\[([\s\S]*?)\],[\s\S]*?correctAnswer:\s*([\-0-9]+),[\s\S]*?explanation:\s*"([\s\S]*?)"\s*\}/g;
  let m;
  while ((m = itemRegex.exec(fileContent))) {
    const id = m[1];
    const question = JSON.parse(m[2].trim().replace(/,$/, ''));
    const optionsBlock = m[3];
    const options = [];
    const optRegex = /"([\s\S]*?)"/g;
    let o;
    while ((o = optRegex.exec(optionsBlock))) options.push(o[1]);
    const correctAnswer = Number(m[4]);
    const explanation = m[5];
    entries.push({ id, question, options, correctAnswer, explanation });
  }
  return entries;
}

const socialSrc = fs.readFileSync(socialPath, 'utf8');
const engSrc = fs.readFileSync(engPath, 'utf8');

const socialEntries = extractQuestions(socialSrc);
const engEntries = extractQuestions(engSrc);

// Keep social entries 1-53 (id ends with number <=53)
const head = socialEntries.filter(e => {
  const m = e.id.match(/m2015-social-eng-(\d+)$/);
  return m && Number(m[1]) <= 53;
});

// Map engEntries by number
const engMap = new Map();
engEntries.forEach(e => {
  const m = e.id.match(/m2015-eng-(\d+)$/);
  if (m) engMap.set(Number(m[1]), e);
});

const merged = [...head];
// Append questions 54..107 from engMap
for (let n = 54; n <= 107; n++) {
  const e = engMap.get(n);
  if (e) {
    merged.push({
      id: `m2015-social-eng-${n}`,
      question: e.question,
      options: e.options,
      correctAnswer: e.correctAnswer ?? -1,
      explanation: e.explanation || 'No explanation was provided in the source.',
    });
  } else {
    merged.push({
      id: `m2015-social-eng-${n}`,
      question: `[Placeholder] Question ${n} text to be added`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: -1,
      explanation: 'Placeholder — source not yet added.',
    });
  }
}
// Keep placeholders for 108..120
for (let n = 108; n <= 120; n++) {
  merged.push({
    id: `m2015-social-eng-${n}`,
    question: `[Placeholder] Question ${n} text to be added`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: -1,
    explanation: 'Placeholder — source not yet added.',
  });
}

// Build output file
const out = [];
out.push('import { MatricExamQuestion } from "./matricExams";\n');
out.push('export const matric2015SocialEnglishQuestions: MatricExamQuestion[] = [');
merged.forEach(item => {
  out.push('  {');
  out.push(`    id: "${item.id}",`);
  // Quote question and escape backslashes
  out.push(`    question: ${JSON.stringify(item.question)},`);
  out.push('    options: [');
  item.options.forEach(opt => out.push(`      ${JSON.stringify(opt)},`));
  out.push('    ],');
  out.push(`    correctAnswer: ${item.correctAnswer},`);
  out.push(`    explanation: ${JSON.stringify(item.explanation)},`);
  out.push('  },');
});
out.push('];\n');

fs.writeFileSync(socialPath, out.join('\n'));
console.log('Wrote merged social English questions to', socialPath);
