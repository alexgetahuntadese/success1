const t = await (
  await fetch("https://kehulum.com/entrance-exam/natural-science/2013/biology-148/1", {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122" },
  })
).text();

const re = /name=["']([^"']+)["'][^>]*value=["']([^"']*)["']/g;
let m;
const hits = [];
while ((m = re.exec(t)) && hits.length < 60) {
  if (/q|id|exam|quest|page|slug/i.test(m[1])) hits.push(`${m[1]}=${m[2]}`);
}
console.log(hits.join("\n"));

const dataIds = [...t.matchAll(/data-id=["']([^"']+)["']/g)].map((x) => x[1]);
console.log("data-id sample", [...new Set(dataIds)].slice(0, 15));
