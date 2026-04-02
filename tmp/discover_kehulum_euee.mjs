/**
 * Lists EUEE exam base URLs from Kehulum year index pages (natural + social, 2013–2017).
 * Rate-limited. Run: node tmp/discover_kehulum_euee.mjs [--json]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const YEARS = [2017, 2016, 2015, 2014, 2013];
const STREAMS = [
  { key: "natural", path: "natural-science" },
  { key: "social", path: "social-science" },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function normalizeExamBaseUrl(rawPath, year, slug) {
  const pathNorm = rawPath.replace(/%20/gi, " ").replace(/\s+/g, " ").trim();
  const compact = pathNorm.replace(/\s+/g, "-");
  const segment = compact.includes("natural") ? "natural-science" : "social-science";
  return `https://kehulum.com/entrance-exam/${segment}/${year}/${slug}`;
}

function extractExamLinks(html, year, streamKey) {
  const links = [];
  // JSON-LD escapes slashes as \/; paths may be "social science" (space) or "social-science"
  const flat = html.replace(/\\\//g, "/");
  const re =
    /https:\/\/kehulum\.com\/entrance-exam\/([^/]+)\/(\d{4})\/([a-z0-9-]+)/gi;
  let m;
  while ((m = re.exec(flat))) {
    const rawPath = m[1];
    const y = parseInt(m[2], 10);
    const slug = m[3];
    if (y !== year) continue;
    const p = rawPath.toLowerCase();
    if (streamKey === "natural" && !p.includes("natural")) continue;
    if (streamKey === "social" && !/social/.test(p)) continue;
    if (streamKey === "social" && !p.includes("science")) continue;
    const baseUrl = normalizeExamBaseUrl(rawPath, year, slug);
    links.push({ stream: streamKey, year, slug, baseUrl });
  }
  return links;
}

async function main() {
  const asJson = process.argv.includes("--json");
  const outPath = process.argv.find((a) => a.startsWith("--out="))?.slice(6);
  /** @type {{ stream: string; year: number; slug: string; baseUrl: string }[]} */
  const all = [];

  for (const stream of STREAMS) {
    for (const year of YEARS) {
      const indexUrl = `https://kehulum.com/entrance-exam/${stream.path}/${year}`;
      try {
        const html = await fetchText(indexUrl);
        const found = extractExamLinks(html, year, stream.key);
        const seen = new Set();
        for (const item of found) {
          const k = item.baseUrl;
          if (seen.has(k)) continue;
          seen.add(k);
          all.push(item);
        }
        console.error(`OK ${stream.key} ${year}: ${seen.size} exams`);
      } catch (e) {
        console.error(`FAIL ${stream.key} ${year}:`, e.message);
      }
      await delay(400);
    }
  }

  all.sort((a, b) => b.year - a.year || a.stream.localeCompare(b.stream) || a.slug.localeCompare(b.slug));

  if (asJson || outPath) {
    const json = JSON.stringify(all, null, 2);
    if (outPath) {
      fs.writeFileSync(path.join(root, outPath), json, "utf8");
      console.error(`Wrote ${outPath} (${all.length} rows)`);
    } else if (asJson) {
      console.log(json);
    }
  } else {
    for (const row of all) {
      console.log(`${row.stream}\t${row.year}\t${row.slug}\t${row.baseUrl}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
