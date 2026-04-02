/**
 * Fetch one Kehulum EUEE subject (all pages) and write src/data/<varName>.ts
 *
 * Usage:
 *   node tmp/import_kehulum_matric.mjs <baseUrl> <exportVarName> <idPrefix> [--merge=src/data/Existing.ts]
 *
 * Example:
 *   node tmp/import_kehulum_matric.mjs https://kehulum.com/entrance-exam/social-science/2017/geography-397 matric2017SocialGeographyQuestions m2017-social-geo- --merge=src/data/matric2017SocialGeographyQuestions.ts
 *
 * --merge: if the existing file defines `const answerKey`, those indices are applied to matching question ids.
 *
 * Do not use this to refresh files that keep answers in `answerKey` / `explanationById` maps and a `.map()`
 * export — it overwrites with a flat JSON array and drops those maps unless you restore them manually.
 */
import fs from "fs";
import nodePath from "path";
import { fileURLToPath } from "url";
import {
  parseExam,
  writeMatricTsFile,
  extractAnswerKeyRecord,
  applyAnswerKey,
} from "./lib/kehulumParseExam.mjs";

const __dirname = nodePath.dirname(fileURLToPath(import.meta.url));
const root = nodePath.join(__dirname, "..");

function parseArgs() {
  const pos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const mergeArg = process.argv.find((a) => a.startsWith("--merge="));
  const mergePath = mergeArg ? mergeArg.slice(8) : null;
  if (pos.length < 3) {
    console.error(
      "Usage: node tmp/import_kehulum_matric.mjs <baseUrl> <exportVarName> <idPrefix> [--merge=path/to/existing.ts]"
    );
    process.exit(1);
  }
  return { baseUrl: pos[0], varName: pos[1], idPrefix: pos[2], mergePath };
}

async function main() {
  const { baseUrl, varName, idPrefix, mergePath } = parseArgs();
  console.error("Fetching:", baseUrl);
  let questions = await parseExam(baseUrl, idPrefix);

  if (mergePath) {
    const full = nodePath.join(root, mergePath);
    const raw = fs.readFileSync(full, "utf8");
    const key = extractAnswerKeyRecord(raw);
    if (key) {
      questions = applyAnswerKey(questions, key);
      console.error(`Merged answerKey (${Object.keys(key).length} ids) from ${mergePath}`);
    } else {
      console.error(`No answerKey block found in ${mergePath}; skipped merge`);
    }
  }

  const out = writeMatricTsFile(fs, nodePath, root, varName, questions);
  console.error(`Wrote ${questions.length} questions -> ${nodePath.relative(root, out)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
