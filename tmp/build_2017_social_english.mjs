/**
 * Rebuilds matric2017SocialEnglishQuestions.ts from matric2017EnglishQuestions.ts:
 * - Reading passages, directions, and question stems (Kehulum / natural layout)
 * - Keeps social file options, correctAnswer, explanation only
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const natPath = path.join(root, "src", "data", "matric2017EnglishQuestions.ts");
const socPath = path.join(root, "src", "data", "matric2017SocialEnglishQuestions.ts");

function extractQuestionBlock(src, idPrefix, engNum) {
  const re = new RegExp(
    `  \\{\\r?\\n    id: "${idPrefix}${engNum}",([\\s\\S]*?)\\r?\\n  \\},\\r?\\n`,
    "m"
  );
  const m = src.match(re);
  if (!m) throw new Error(`Block missing for ${idPrefix}${engNum}`);
  return m[1];
}

/** `\n    question: "...."` only (escaped quotes inside). */
function sliceQuestionField(inner) {
  const marker = "\n    question: ";
  const qStart = inner.indexOf(marker);
  if (qStart === -1) throw new Error("question field not found");
  let j = qStart + marker.length;
  if (inner[j] !== '"') throw new Error("question is not a string literal");
  j++;
  while (j < inner.length) {
    const c = inner[j];
    if (c === "\\") {
      j += 2;
      continue;
    }
    if (c === '"') {
      j++;
      break;
    }
    j++;
  }
  return {
    head: inner.slice(0, qStart),
    questionField: inner.slice(qStart, j),
  };
}

/** From `\n    options:` through `\n    explanation: "..."` end quote. */
function sliceSocialAnswerTail(inner) {
  const oi = inner.indexOf("\n    options:");
  if (oi === -1) throw new Error("options not found in social inner");
  let j = inner.indexOf("\n    explanation: ", oi);
  if (j === -1) throw new Error("explanation not found");
  j += "\n    explanation: ".length;
  if (inner[j] !== '"') throw new Error("explanation not string");
  j++;
  while (j < inner.length) {
    const c = inner[j];
    if (c === "\\") {
      j += 2;
      continue;
    }
    if (c === '"') {
      j++;
      break;
    }
    j++;
  }
  return inner.slice(oi, j);
}

const dialogue96 = `    sectionGroupTitle: "IV. COMMUNICATIVE ACTIVITIES",
    sectionTitle: "Section Two: Dialogue Completion",
    sectionDirection: "Directions: Questions 96 - 100 are presented in the form of conversations. Choose the alternative (A-D) that best completes each dialogue.",
`;

const nat = fs.readFileSync(natPath, "utf8").replace(/\r\n/g, "\n");
const soc = fs.readFileSync(socPath, "utf8").replace(/\r\n/g, "\n");

const outBlocks = [];

for (let n = 1; n <= 95; n++) {
  const natInner = extractQuestionBlock(nat, "m2017-eng-", n);
  const { head, questionField } = sliceQuestionField(natInner);

  const socInner = extractQuestionBlock(soc, "m2017-social-eng-", n);
  const answerTail = sliceSocialAnswerTail(socInner);

  const idLine = `    id: "m2017-social-eng-${n}",`;
  const mergedInner = `${idLine}${head}${questionField},\n${answerTail}`;
  outBlocks.push(`  {\n${mergedInner}\n  },`);
}

for (let n = 96; n <= 100; n++) {
  const socInner = extractQuestionBlock(soc, "m2017-social-eng-", n);
  let inner = socInner.trimStart();
  if (!inner.startsWith("sectionGroupTitle")) {
    inner = dialogue96 + inner.replace(/^/, "    ");
  }
  outBlocks.push(`  {\n    id: "m2017-social-eng-${n}",\n${inner}\n  },`);
}

const header = `import { MatricExamQuestion } from "./matricExams";

export const matric2017SocialEnglishQuestions: MatricExamQuestion[] = [
`;

const footer = `
];
`;

fs.writeFileSync(socPath, header + "\n" + outBlocks.join("\n") + footer, "utf8");
console.log("Wrote matric2017SocialEnglishQuestions.ts");
