/**
 * Parse paginated Kehulum EUEE HTML into MatricExamQuestion-shaped objects.
 * Correct answers are usually not in public HTML; callers default to -1.
 */

export function cleanText(s) {
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

export async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

/**
 * @param {string} baseUrl - e.g. https://kehulum.com/entrance-exam/social-science/2017/geography-397 (no trailing /page)
 * @param {string} idPrefix - e.g. m2017-social-geo-
 * @param {{ delayMs?: number, maxPages?: number }} [opts]
 */
export async function parseExam(baseUrl, idPrefix, opts = {}) {
  const delayMs = opts.delayMs ?? 350;
  const maxPages = opts.maxPages ?? 40;
  const questions = [];
  const seen = new Set();
  const base = baseUrl.replace(/\/$/, "");

  for (let page = 1; page <= maxPages; page++) {
    const url = `${base}/${page}`;
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
      const optsArr = [];
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
        if (txt) optsArr.push(txt);
      }

      if (optsArr.length === 0) {
        const optRe = /([A-D])([^A-D]+)/g;
        while ((om = optRe.exec(cleanText(block)))) {
          if (firstOptIndex === null) firstOptIndex = om.index;
          optsArr.push(om[2].trim());
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

      if (questionText && optsArr.length >= 2) {
        const id = `${idPrefix}${num}`;
        if (!seen.has(id)) {
          seen.add(id);
          pageCount++;
          questions.push({
            id,
            question: questionText,
            options: optsArr.map(cleanText),
            correctAnswer: -1,
            explanation: "",
          });
        }
      }
    }

    if (pageCount === 0 && page > 1) break;
    await new Promise((r) => setTimeout(r, delayMs));
  }

  const tailNum = (id) => {
    const m = String(id).match(/(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };
  questions.sort((a, b) => tailNum(a.id) - tailNum(b.id));

  return questions;
}

/**
 * Read `const answerKey: Record<string, number> = { ... }` from a matric data file (if present).
 */
export function extractAnswerKeyRecord(tsContent) {
  const m = tsContent.match(/const\s+answerKey\s*:\s*Record<[^>]+>\s*=\s*\{([\s\S]*?)\n\};/);
  if (!m) return null;
  /** @type {Record<string, number>} */
  const rec = {};
  const lineRe = /"([^"]+)":\s*(-?\d+)/g;
  let lm;
  while ((lm = lineRe.exec(m[1]))) {
    rec[lm[1]] = parseInt(lm[2], 10);
  }
  return Object.keys(rec).length ? rec : null;
}

export function applyAnswerKey(questions, answerKey) {
  if (!answerKey) return questions;
  return questions.map((q) => ({
    ...q,
    correctAnswer: answerKey[q.id] ?? q.correctAnswer,
  }));
}

export function writeMatricTsFile(fs, pathMod, rootDir, varName, questions) {
  const out = `import { MatricExamQuestion } from "./matricExams";

export const ${varName}: MatricExamQuestion[] = ${JSON.stringify(questions, null, 2)};
`;
  const outPath = pathMod.join(rootDir, "src", "data", `${varName}.ts`);
  fs.writeFileSync(outPath, out);
  return outPath;
}
