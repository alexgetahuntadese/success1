import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function cleanText(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function parseExam(baseUrl, idPrefix) {
  const questions = [];
  const seen = new Set();

  for (let page = 1; page <= 30; page++) {
    const url = `${baseUrl}/${page}`;
    let text;
    try {
      text = await fetchPage(url);
    } catch {
      break;
    }

    const re =
      /<h3[^>]*>\s*Question\s*(\d+)[^<]*<\/h3>([\s\S]*?)(?=<h3[^>]*>\s*Question\s*\d+|$)/g;
    let m;
    let pageCount = 0;
    while ((m = re.exec(text))) {
      const num = parseInt(m[1], 10);
      let block = m[2].trim();
      block = block.replace(/Show Explanation/g, "");
      const opts = [];
      const optDivRe =
        /<div[^>]*class=["'][^"']*cho-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/g;
      let om;
      let firstOptIndex = null;
      while ((om = optDivRe.exec(block))) {
        if (firstOptIndex === null) firstOptIndex = om.index;
        const inner = om[1];
        const spanMatch = inner.match(
          /class=['"]choice-letter-lables[^'"]*['"][^>]*>[\s\S]*?<\/span><span>([\s\S]*?)<\/span>/i
        );
        const txt = spanMatch
          ? cleanText(spanMatch[1])
          : cleanText(inner).replace(/^[A-D]\s*/, "").trim();
        if (txt) opts.push(txt);
      }

      if (opts.length === 0) {
        const optRe = /([A-D])([^A-D]+)/g;
        while ((om = optRe.exec(cleanText(block)))) {
          if (firstOptIndex === null) firstOptIndex = om.index;
          opts.push(om[2].trim());
        }
      }

      let questionText = block;
      if (firstOptIndex !== null) questionText = block.slice(0, firstOptIndex);
      const qMatch = questionText.match(
        /class=['"]isQuesion[^'']*['"][^>]*>([\s\S]*?)<\/div>/i
      );
      if (qMatch) questionText = qMatch[1];
      questionText = cleanText(questionText)
        .replace(/^(Share This Question)/i, "")
        .trim();

      if (questionText && opts.length >= 2) {
        const id = `${idPrefix}${num}`;
        if (!seen.has(id)) {
          seen.add(id);
          pageCount++;
          questions.push({
            id,
            question: questionText,
            options: opts.map(cleanText),
            correctAnswer: -1,
            explanation: "",
          });
        }
      }
    }

    if (pageCount === 0 && page > 1) break;
    await new Promise((r) => setTimeout(r, 250));
  }

  const tailNum = (id) => {
    const m = String(id).match(/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };
  questions.sort((a, b) => tailNum(a.id) - tailNum(b.id));

  return questions;
}

function writeTs(varName, questions) {
  const out = `import { MatricExamQuestion } from "./matricExams";

export const ${varName}: MatricExamQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  fs.writeFileSync(path.join(root, "src", "data", `${varName}.ts`), out);
  console.log(`Wrote ${varName}.ts (${questions.length} questions)`);
}

const natural = [
  { slug: "biology-148", varName: "matric2013BiologyQuestions", idPrefix: "m2013-bio-" },
  { slug: "chemistry-154", varName: "matric2013ChemistryQuestions", idPrefix: "m2013-chem-" },
  {
    slug: "civics-and-ethical-education-171",
    varName: "matric2013CivicsQuestions",
    idPrefix: "m2013-civ-",
  },
  { slug: "english-169", varName: "matric2013EnglishQuestions", idPrefix: "m2013-eng-" },
  { slug: "mathematics-198", varName: "matric2013MathQuestions", idPrefix: "m2013-math-" },
  { slug: "physics-172", varName: "matric2013PhysicsQuestions", idPrefix: "m2013-phys-" },
];

const social = [
  {
    slug: "civics-and-ethical-education-171",
    varName: "matric2013SocialCivicsQuestions",
    idPrefix: "m2013-soc-civ-",
  },
  {
    slug: "english-169",
    varName: "matric2013SocialEnglishQuestions",
    idPrefix: "m2013-soc-english-",
  },
  {
    slug: "mathematics-199",
    varName: "matric2013SocialMathQuestions",
    idPrefix: "m2013-soc-math-",
  },
];

async function main() {
  for (const exam of natural) {
    const base = `https://kehulum.com/entrance-exam/natural-science/2013/${exam.slug}`;
    console.log("Fetching natural", exam.slug, "...");
    const questions = await parseExam(base, exam.idPrefix);
    writeTs(exam.varName, questions);
  }

  for (const exam of social) {
    const base = `https://kehulum.com/entrance-exam/social-science/2013/${exam.slug}`;
    console.log("Fetching social", exam.slug, "...");
    const questions = await parseExam(base, exam.idPrefix);
    writeTs(exam.varName, questions);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
