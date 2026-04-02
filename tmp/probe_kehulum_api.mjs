const u = "https://kehulum.com/entrance-exam/natural-science/2013/biology-148/1";
const t = await (await fetch(u)).text();
const re = /src=["']([^"']+\.js[^"']*)["']/g;
const scripts = [];
let m;
while ((m = re.exec(t))) scripts.push(m[1]);
const unique = [...new Set(scripts)];
for (const s of unique.slice(0, 25)) {
  console.log(s);
}
