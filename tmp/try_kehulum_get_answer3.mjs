const examUrl =
  "https://kehulum.com/entrance-exam/natural-science/2013/biology-148/1";
const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122";

async function post(bodyObj) {
  const c = await fetch(examUrl, { headers: { "User-Agent": ua } });
  const html = await c.text();
  const cookies = c.headers.getSetCookie?.() ?? [];
  const cookieStr = cookies.map((x) => x.split(";")[0]).join("; ");
  const tokenM = html.match(/csrfMagicToken\s*=\s*["']([^"']+)["']/);
  const nameM = html.match(/csrfMagicName\s*=\s*["']([^"']+)["']/);
  const p = new URLSearchParams({ [nameM[1]]: tokenM[1], ...bodyObj });
  const r = await fetch("https://kehulum.com/api/exam/get-answer", {
    method: "POST",
    headers: {
      "User-Agent": ua,
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: examUrl,
      Origin: "https://kehulum.com",
      Cookie: cookieStr,
      "X-Requested-With": "XMLHttpRequest",
    },
    body: p,
  });
  return r.text();
}

const tries = [
  { qid: "2628" },
  { qid: "9655" },
  { qid: "16142" },
];

for (const t of tries) {
  const txt = await post(t);
  console.log(JSON.stringify(t), "->", txt.slice(0, 250));
}
