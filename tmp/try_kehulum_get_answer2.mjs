const examUrl =
  "https://kehulum.com/entrance-exam/natural-science/2013/biology-148/1";

const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

const c = await fetch(examUrl, {
  headers: { "User-Agent": ua, Accept: "text/html" },
});

const html = await c.text();
const cookies = c.headers.getSetCookie?.() ?? [];
const cookieStr = cookies.map((x) => x.split(";")[0]).join("; ");
console.log("cookies", cookieStr.slice(0, 120));

const tokenM = html.match(/csrfMagicToken\s*=\s*["']([^"']+)["']/);
const nameM = html.match(/csrfMagicName\s*=\s*["']([^"']+)["']/);
const csrfName = nameM?.[1] ?? "";
const csrfToken = tokenM?.[1] ?? "";

const bodies = [
  new URLSearchParams({ [csrfName]: csrfToken, question_id: "2628" }),
  new URLSearchParams({ [csrfName]: csrfToken, qid: "2628" }),
  new URLSearchParams({ [csrfName]: csrfToken, id: "2628" }),
];

for (const body of bodies) {
  const r = await fetch("https://kehulum.com/api/exam/get-answer", {
    method: "POST",
    headers: {
      "User-Agent": ua,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: examUrl,
      Origin: "https://kehulum.com",
      Cookie: cookieStr,
      "X-Requested-With": "XMLHttpRequest",
    },
    body,
  });
  const txt = await r.text();
  console.log("try", [...body.keys()].filter((k) => k !== csrfName), "->", r.status, txt.slice(0, 200));
}
