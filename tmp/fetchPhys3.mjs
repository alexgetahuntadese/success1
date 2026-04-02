const t = await (
  await fetch("https://kehulum.com/entrance-exam/natural-science/2013/physics-172/1", {
    headers: { "User-Agent": "Mozilla/5.0" },
  })
).text();
const start = t.indexOf("answer-4452");
console.log(t.slice(start, start + 2500));
