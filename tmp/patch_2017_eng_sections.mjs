import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const filePath = path.join(root, "src", "data", "matric2017EnglishQuestions.ts");

const headers = {
  passage1: `    sectionGroupTitle: "I. COMPREHENSION",
    sectionTitle: "Section One: Reading Passage I",
    sectionDirection: "Directions: There are two passages in this section. Read each of them carefully and answer questions 1 - 18 according to the information given. From the four choices A-D given for each question, choose the correct answer.",
`,
  passage2: `    sectionGroupTitle: "I. COMPREHENSION",
    sectionTitle: "Section Two: Reading Passage II",
    sectionDirection: "Directions: Read Passage II carefully and answer questions 10 - 18 according to the information given.",
`,
  vocabWordFill: `    sectionGroupTitle: "II. VOCABULARY AND SENTENCE SKILLS",
    sectionTitle: "Section One: Word Meaning",
    sectionDirection: "Instructions: For questions 19 - 30, choose the word or phrase (A-D) that best completes each sentence.",
`,
  vocabUnderlined: `    sectionGroupTitle: "II. VOCABULARY AND SENTENCE SKILLS",
    sectionTitle: "Section Three: Word Meaning",
    sectionDirection: "Instructions: For questions 26 - 30, choose the word or phrase (A-D) that is closest in meaning to the underlined word or phrase in each sentence.",
`,
  analogy: `    sectionGroupTitle: "II. VOCABULARY AND SENTENCE SKILLS",
    sectionTitle: "Section Two: Analogy",
    sectionDirection: "Instructions: For questions 31 and 32, two pairs of words are given. Look at the relationship between the two words in each pair and choose the word which forms a similar relationship with the word given next to each pair.",
`,
  sentenceComp: `    sectionGroupTitle: "II. VOCABULARY AND SENTENCE SKILLS",
    sectionTitle: "Section Three: Sentence Comprehension",
    sectionDirection: "Instructions: For questions 33 and 34, choose the sentence with the closest meaning to the head sentence from the four alternatives given.",
`,
  grammar: `    sectionGroupTitle: "II. VOCABULARY AND SENTENCE SKILLS",
    sectionTitle: "Section Four: Grammar and Usage",
    sectionDirection: "Instructions: For questions 35 - 62, choose the most appropriate answer (A-D) to complete each sentence.",
`,
  spelling: `    sectionGroupTitle: "II. VOCABULARY AND SENTENCE SKILLS",
    sectionTitle: "Section Five: Spelling, Punctuation and Sentence Arrangement",
    sectionDirection: "Instructions: For questions 63 - 70, choose the correct answer on spelling, punctuation/capitalization, and sentence arrangement.",
`,
  paraOrg: `    sectionGroupTitle: "III. WRITING SKILLS",
    sectionTitle: "Section One: Paragraph Organization",
    sectionDirection: "Instructions: For questions 71 - 74, choose the best order for the given sentences.",
`,
  paraType: `    sectionGroupTitle: "III. WRITING SKILLS",
    sectionTitle: "Section Two: Paragraph Type Identification",
    sectionDirection: "Instructions: For questions 75 - 77, choose the paragraph type that best matches each text.",
`,
  letter: `    sectionGroupTitle: "III. WRITING SKILLS",
    sectionTitle: "Section Three: Letter Components",
    sectionDirection: "Instructions: For questions 78 - 80, choose the correct part of the letter referred to in each item.",
`,
  dialogue: `    sectionGroupTitle: "IV. COMMUNICATIVE ACTIVITIES",
    sectionTitle: "Section One: Dialogue Completion",
    sectionDirection: "Directions: Questions 81 - 95 are presented in the form of conversations. Choose the alternative (A-D) that best completes each dialogue.",
`,
};

/** @type {Record<string, keyof typeof headers>} */
const idToHeader = {};
for (let n = 2; n <= 9; n++) idToHeader[`m2017-eng-${n}`] = "passage1";
for (let n = 11; n <= 18; n++) idToHeader[`m2017-eng-${n}`] = "passage2";
for (let n = 20; n <= 25; n++) idToHeader[`m2017-eng-${n}`] = "vocabWordFill";
for (let n = 27; n <= 30; n++) idToHeader[`m2017-eng-${n}`] = "vocabUnderlined";
idToHeader["m2017-eng-32"] = "analogy";
idToHeader["m2017-eng-34"] = "sentenceComp";
for (let n = 36; n <= 62; n++) idToHeader[`m2017-eng-${n}`] = "grammar";
for (let n = 64; n <= 70; n++) idToHeader[`m2017-eng-${n}`] = "spelling";
for (let n = 72; n <= 74; n++) idToHeader[`m2017-eng-${n}`] = "paraOrg";
for (let n = 76; n <= 77; n++) idToHeader[`m2017-eng-${n}`] = "paraType";
for (let n = 79; n <= 80; n++) idToHeader[`m2017-eng-${n}`] = "letter";
for (let n = 82; n <= 95; n++) idToHeader[`m2017-eng-${n}`] = "dialogue";

let text = fs.readFileSync(filePath, "utf8");

for (const [id, key] of Object.entries(idToHeader)) {
  const needle = `    id: "${id}",\n`;
  const idx = text.indexOf(needle);
  if (idx === -1) throw new Error(`Missing ${id}`);
  // Short lookahead only — a long window can include the *next* question's section header and skip wrongly.
  const rest = text.slice(idx + needle.length, idx + needle.length + 120);
  if (rest.includes("sectionGroupTitle:")) continue;
  const header = headers[key];
  text = text.replace(needle, needle + header);
}

fs.writeFileSync(filePath, text, "utf8");
console.log("Patched matric2017EnglishQuestions.ts with section headers.");
