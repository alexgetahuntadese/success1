import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "src", "data", "matric2016ScholasticAptitudeQuestions.ts");
let text = fs.readFileSync(filePath, "utf8");

const updates = new Map([
  ["m2016-sat-4", [2, "The passage says over 20% can read and write, but not up to the required standard."]],
  ["m2016-sat-5", [0, "The passage points to effective communication skills as the key requirement for many graduate positions."]],
  ["m2016-sat-18", [1, "The passage says a predator can consume only a finite number of eggs or chicks, so it may not have time to devour all it finds."]],
  ["m2016-sat-19", [0, "Paragraph five describes several social benefits, so the broad inference is that animals can benefit from living together with their own kind."]],
  ["m2016-sat-20", [2, "The passage says larger groups of male frogs attract more females per male, so being in the group broadens the male's chance of finding a mate."]],
  ["m2016-sat-21", [1, "Simultaneous hatching reduces the chance that any one chick is eaten, helping the colony's young survive better overall."]],
  ["m2016-sat-22", [0, "The passage states that adult elephants surround all their young, giving them added protection."]],
  ["m2016-sat-43", [2, "If the sale price is 80% of the original price, then original price = 40,000 / 0.8 = 50,000 Birr."]],
  ["m2016-sat-44", [3, "Set h(t) = 0: -5t^2 + 7t + 90 = 0. Solving gives the positive root t = 5 seconds."]],
  ["m2016-sat-45", [0, "To find f(2), set (2/3)x - 4/3 = 2, which gives x = 5. Then f(2) = 5(5^3) + 16(5^2) + 2(5) + 1 = 1036, which is greater than 600."]],
  ["m2016-sat-46", [2, "Shop 1 rises from 20,000 to 30,000, a 50% increase. Shop 2 rises from 10,000 to 15,000, also a 50% increase."]],
  ["m2016-sat-47", [3, "There are 36 total outcomes. Sum 5 has 4 outcomes and sum 10 has 3, so neither 5 nor 10 has 36 - 7 = 29 outcomes, giving 29/36."]],
  ["m2016-sat-48", [1, "With 5 girls and 4 boys alternating on 9 chairs, the pattern must be G-B-G-B-G-B-G-B-G. This gives 5! x 4! = 2880 arrangements."]],
  ["m2016-sat-49", [3, "Using the street clues, the only consistent arrangement leaves S4 at the opposite corner from S1."]],
  ["m2016-sat-50", [2, "The valid arrangement places S3 and S4 three homes apart, with exactly three houses between them."]],
  ["m2016-sat-51", [1, "C1 above 50% is 380 and C6 exactly 50% is 189. The increase is (380 - 189) / 189 x 100 ≈ 101.1%."]],
  ["m2016-sat-52", [3, "C2 has 346 + 182 + 204 = 732 students. The total number scoring exactly 50% is 223 + 182 + 367 + 205 + 298 + 189 = 1464, so the ratio is 732:1464 = 1:2. The source formats this as option '1.2'."]],
  ["m2016-sat-53", [0, "Average exactly 50% = 1464/6 = 244, while average above 50% = (380 + 346 + 265 + 186 + 107 + 78)/6 = 227. The difference is 17."]],
  ["m2016-sat-54", [3, "Using the table values, 186 is about 202.2% of 92. The closest listed option is 201.1%, so the source appears to have a small table or option inconsistency and option D is the intended match."]],
  ["m2016-sat-55", [1, "Compute Below/Above for each listed country: C1 = 190/380 = 0.50, C2 ≈ 0.59, C3 = 130/265 ≈ 0.49, C4 ≈ 0.88. The least ratio is for C3."]],
  ["m2016-sat-56", [0, "Let the first term be a and common ratio be r. Since ar^3 = 125 and ar^9 = 125/64, we get r^6 = 1/64, so r = 1/2 and the first four terms are 1000, 500, 250, 125."]],
  ["m2016-sat-57", [1, "The nth term is 24 + (n - 1)6. Setting this equal to 204 gives n = 31."]],
  ["m2016-sat-58", [2, "Multiplying the first equation by -2 gives -6x + 8y = -4, which contradicts -6x + 8y = -10, so the system has no solution."]],
  ["m2016-sat-59", [3, "This is an arithmetic sequence with first term -2 and common difference 7/2. Using S16 = 16/2 [2(-2) + 15(7/2)] gives 388."]],
  ["m2016-sat-60", [0, "The infinite geometric sum is r/(1-r) = 1/2 with r = 3^-alpha. Solving gives r = 1/3, so 3^-alpha = 3^-1 and alpha = 1."]],
]);

for (const [id, [correctAnswer, explanation]] of updates) {
  const pattern = new RegExp(`(id: "${id}",[\\s\\S]*?correctAnswer: )-?\\d+(,[\\s\\S]*?explanation: )"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"`, "m");
  text = text.replace(pattern, `$1${correctAnswer}$2${JSON.stringify(explanation)}`);
}

fs.writeFileSync(filePath, text);
console.log(`Updated ${updates.size} SAT items.`);
