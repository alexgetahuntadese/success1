import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "src", "data", "matric2016ScholasticAptitudeQuestions.ts");
let text = fs.readFileSync(filePath, "utf8");

const fixes = new Map([
  ["m2016-sat-11", [3, "\"Devastate\" means destroy badly, so the contrasting choice is \"renovate.\""]],
  ["m2016-sat-12", [3, "\"Priceless\" means extremely valuable, so \"invaluable\" is the closest match."]],
  ["m2016-sat-13", [3, "Laughter can show delight in the same way that a complaint can show discontent."]],
  ["m2016-sat-14", [3, "You describe a place and explain an idea."]],
  ["m2016-sat-15", [1, "An apple is a kind of fruit just as wheat is a kind of cereal."]],
  ["m2016-sat-16", [0, "The relation is opposites: common is the opposite of extraordinary, just as slight is the opposite of severe."]],
  ["m2016-sat-17", [2, "A kitchen is part of a house just as a classroom is part of a school."]],
  ["m2016-sat-23", [1, "The best response is to reduce migration pressure by creating opportunities where migrants originally live."]],
  ["m2016-sat-24", [2, "The passage supports that education helps people develop and use their talents, even though it is not the only path to success."]],
  ["m2016-sat-25", [3, "From the clues, the only consistent order is G/Egziabher, Sileshi, Solomon, Haile, Kenenisa, so Solomon finishes third."]],
  ["m2016-sat-26", [2, "The examples show both young and old successful leaders, so age and leadership quality are not necessarily linked."]],
  ["m2016-sat-27", [3, "From the price statements, C is cheapest, A is next, and B is highest, so B is the most expensive. The fuel information in the source is partly inconsistent, but this price conclusion is still clear."]],
  ["m2016-sat-28", [1, "The sentence means that liars are what Sara hates most."]],
  ["m2016-sat-29", [0, "Since most French people are friendly and fair but some are biased, we can only say Nicola may be friendly, not that he must be."]],
  ["m2016-sat-30", [3, "Based on the places and language exposure described, the strongest safe conclusion is that Zeberga could speak at least three languages."]],
  ["m2016-sat-36", [-1, "This graph item remains source-limited. The available HTML includes the option text but not a reliable machine-readable interpretation of the shaded graph, so it is left unverified rather than guessed."]],
  ["m2016-sat-37", [2, "If hens and sheep total 200 heads and 500 legs, then h + s = 200 and 2h + 4s = 500. Solving gives s = 150 sheep."]],
  ["m2016-sat-38", [1, "From x - y + 1 = 0 we get x - y = -1, and from -x - y + 2 = 0 we get x + y = 2. Solving gives x = 1/2 and y = 3/2."]],
  ["m2016-sat-39", [1, "The ratio parts add to 1 + 2 + 3 = 6. Grade 12 is 3/6 of 30, which is 15 students."]],
  ["m2016-sat-40", [3, "Testing the options in both inequalities, only (-1, 1) satisfies -2x + y >= 0 and 3x + 2y <= 6."]],
  ["m2016-sat-41", [0, "The x^3 terms come from x^3(-1), (-20x^2)(-2x), (4x)(x^2), and 2(15x^3). Their sum is -1 + 40 + 4 + 30 = 73."]],
  ["m2016-sat-42", [3, "Multiplying the divisor and quotient and comparing coefficients gives b = 4 and then c = 2."]],
]);

for (const [id, [correctAnswer, explanation]] of fixes) {
  const pattern = new RegExp(`(id: "${id}",[\\s\\S]*?correctAnswer: )-?\\d+(,[\\s\\S]*?explanation: )"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`, "m");
  text = text.replace(pattern, `$1${correctAnswer}$2${JSON.stringify(explanation)}`);
}

fs.writeFileSync(filePath, text);
console.log(`Aligned ${fixes.size} SAT items.`);
