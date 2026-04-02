const u = "https://kehulum.com/entrance-exam/natural-science/2013/biology-148/1";
const r = await fetch(u);
const t = await r.text();
const m = t.match(/csrfMagicToken\s*=\s*["']([^"']+)["']/);
const n = t.match(/csrfMagicName\s*=\s*["']([^"']+)["']/);
console.log("csrf name", n?.[1], "token?", !!m?.[1]);

const cookie = r.headers.get("set-cookie");
console.log("set-cookie header", cookie?.slice(0, 200));

// Try jQuery-style POST with form body
const name = n?.[1] || "csrf_token";
const token = m?.[1] || "";
const body = new URLSearchParams({
  [name]: token,
  question_id: "2628",
  q_id: "2628",
  id: "2628",
});

const r2 = await fetch("https://kehulum.com/api/exam/get-answer", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Referer: u,
    Cookie: r.headers.get("set-cookie")?.split(";")[0] || "",
  },
  body,
});
console.log("post status", r2.status);
console.log(await r2.text());
