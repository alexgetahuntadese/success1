import fs from "node:fs";
import path from "node:path";

const htmlDir = path.join(process.cwd(), "tmp", "math2014html");

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function repairMojibake(value) {
  if (!/[ÂÃâÏ]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function normalizeWhitespace(value) {
  return value
    .replace(/\r/g, "")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanHtml(value) {
  let text = value;
  text = text.replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, (_, alt) => `[Image: ${alt}]`);
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, "\n");
  text = text.replace(/<\/div>\s*<div[^>]*>/gi, "\n");
  text = text.replace(/<sup>(.*?)<\/sup>/gi, "^$1");
  text = text.replace(/<sub>(.*?)<\/sub>/gi, "$1");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeHtml(text);
  text = repairMojibake(text);
  return normalizeWhitespace(text);
}

const files = fs
  .readdirSync(htmlDir)
  .filter((name) => /^page\d+\.html$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const questions = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(htmlDir, file), "utf8");
  const blockRegex =
    /<h3 class="f-25px mb-0 font-bolder">Question (\d+)<\/h3>([\s\S]*?)(?=<h3 class="f-25px mb-0 font-bolder">Question \d+<\/h3>|$)/g;

  let blockMatch;
  while ((blockMatch = blockRegex.exec(html))) {
    const number = Number(blockMatch[1]);
    const block = blockMatch[2];
    const questionMatch = block.match(/<div class='isQuesion w-100 mt-2'><p>([\s\S]*?)<\/p><\/div>/i);
    if (!questionMatch) continue;

    const question = cleanHtml(questionMatch[1]);
    const options = [];
    const optionRegex = /<p\s+class='cho-inner\s*'>([\s\S]*?)<\/p>/gi;
    let optionMatch;
    while ((optionMatch = optionRegex.exec(block)) && options.length < 4) {
      let optionHtml = optionMatch[1];
      optionHtml = optionHtml.replace(/<span class='choice-letter-lables\s*'>[A-D]<\/span>/i, "");
      optionHtml = optionHtml.replace(/^<\/?span>/i, "").replace(/<\/span>\s*$/i, "");
      options.push(cleanHtml(optionHtml));
    }

    if (options.length === 4) {
      questions.push({ number, question, options });
    }
  }
}

questions.sort((a, b) => a.number - b.number);

const lines = [
  'import { MatricExamQuestion } from "./matricExams";',
  "",
  "export const matric2014MathQuestions: MatricExamQuestion[] = [",
];

questions.forEach((item) => {
  const id = `m2014-math-${item.number}`;

  lines.push("  {");
  lines.push(`    id: "${id}",`);
  lines.push(`    question: ${JSON.stringify(item.question)},`);
  lines.push("    options: [");
  item.options.forEach((option) => {
    lines.push(`      ${JSON.stringify(option)},`);
  });
  lines.push("    ],");
  lines.push("    correctAnswer: -1,");
  lines.push('    explanation: "No explanation was provided in the source.",');
  lines.push("  },");
});

lines.push("];");
lines.push("");

fs.writeFileSync(path.join(process.cwd(), "src", "data", "matric2014MathQuestions.ts"), `${lines.join("\n")}\n`);
console.log(`Wrote ${questions.length} questions.`);
