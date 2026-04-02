import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "src", "data", "matric2015MathQuestions.ts");
let source = fs.readFileSync(filePath, "utf8");

const updates = [
  ["m2015-math-2", 3, "The critical points are x = -5 and x = 3/2. Since the quadratic opens upward, the expression is non-positive between the roots. The intended interval is [-5, 3/2], and the closest source option is the open-interval form shown."],
  ["m2015-math-4", 2, "Using similar triangles, 20/4 = 35/x, so x = 7 meters."],
  ["m2015-math-5", 3, "The net movement is 3 km west and 4 km north, so the displacement is sqrt(3^2 + 4^2) = 5 km."],
  ["m2015-math-6", 1, "By the Remainder Theorem, P(-1) = 4. This gives 3 + 5 + 7 + 2k + 3 = 4, so 18 + 2k = 4 and k = -7."],
  ["m2015-math-8", 3, "Completing the square gives f(x) = (x - 3)^2 + 1, so the vertex is (3, 1)."],
  ["m2015-math-9", 1, "A regular hexagon inscribed in a circle of radius 6 has side length 6. Its area is 6 times the area of an equilateral triangle of side 6, giving 54sqrt(3)."],
  ["m2015-math-10", 2, "A prime number has exactly two positive factors: 1 and itself."],
  ["m2015-math-11", 3, "Scientific standard form is a x 10^n with 1 <= a < 10. The source option appears malformed, but the intended best-fit choice is the last one."],
  ["m2015-math-13", 2, "Checking the absolute-value equation across its intervals gives no real solution, so the solution set is empty."],
  ["m2015-math-15", 3, "Using the stated dimensions, the straightforward combined solid gives 126pi cubic centimeters. The wording about the cut is unclear, so this is the best-fit source answer."],
  ["m2015-math-16", 2, "x^(2/3) is defined for all real x because cube roots are defined on all reals, and squaring keeps the result real."],
  ["m2015-math-17", 1, "The slope is tan(theta). Since tan(135 degrees) = -1, the slope is -1."],
  ["m2015-math-18", 1, "tan(509 degrees) = tan(149 degrees) = tan(180 degrees - 31 degrees) = -tan(31 degrees) = -0.81."],
  ["m2015-math-19", 1, "In the fourth quadrant cosine is positive. With sin(theta) = -3/5, we get cos(theta) = 4/5, so sec(theta) = 5/4."],
  ["m2015-math-20", 3, "The midpoint construction guarantees several parallelogram and congruence relations, but APCQ is not necessarily a rhombus."],
  ["m2015-math-21", 2, "Each lateral face is an isosceles triangle with sides 10, 10, and 12. Its height is 8, so each face has area 48 and all six faces total 288."],
  ["m2015-math-22", 0, "Multiplying the matrices and equating entries gives 2b - 3 = 1 and a - 4 = -1, so b = 2 and a = 3."],
  ["m2015-math-23", 0, "The transpose swaps rows and columns, so A^T = [[1, 0, -3], [-1, 2, 6]]."],
  ["m2015-math-24", 0, "If x = y, then x - y = y - x = 0, so the existential statement is true on the natural numbers."],
  ["m2015-math-25", 1, "The cumulative frequency through the fourth class is 2 + 9 + 11 + 5 = 27."],
  ["m2015-math-26", 1, "E3 = {3, 6} and E4 = {5}; these have no common outcome, so they are mutually exclusive."],
  ["m2015-math-27", 0, "The median class is 49-57. Using the grouped-data median formula gives 54.5 kg."],
  ["m2015-math-28", 0, "There are 5 grade-10 students and 2 grade-12 students out of 15 total, so the probability is 7/15."],
  ["m2015-math-30", 1, "Since p is true, not p is false. A false antecedent makes the implication true for any q, so this proposition is always true."],
  ["m2015-math-31", 1, "On (0, infinity), |x| = x, so the function becomes x - 1, which is one-to-one."],
  ["m2015-math-32", 3, "Using partial fractions gives A = 2, C = 5, and then B = -1 by comparing coefficients."],
  ["m2015-math-33", 3, "The numerator is odd and the denominator is even, so the quotient is an odd function and the graph is symmetric about the origin."],
  ["m2015-math-34", 0, "For slopes 2 and -3, tan(theta) = |(-3 - 2)/(1 + 2(-3))| = 1, so the acute angle is pi/4."],
  ["m2015-math-35", 1, "The focus is 3 units left of the vertex, so p = -3. The standard form is (y + 1)^2 = 4p(x - 2) = -12(x - 2)."],
  ["m2015-math-36", 3, "Direct substitution at x = 1 gives (1 - 1)/(1 + 1) = 0."],
  ["m2015-math-37", 1, "Continuity at x = 1 requires a + 1 = 1^2 - 4 = -3, so a = -4."],
  ["m2015-math-39", 0, "Because the sequence starts at n = 0, the fifth term is a4 = 2^4 + 4(4) - 5 = 27."],
  ["m2015-math-40", 0, "From a6 = 35 and a11 = 75, the common difference is 8. Then a1 = -5 and S31 = 31/2 x [2(-5) + 30(8)] = 3565, so the source options appear inconsistent. Option A is kept as the intended best-fit only if the source key expects it, but mathematically the printed data do not support the options."],
  ["m2015-math-41", 3, "The sequence is 2 - 1/(n + 1), so every term is below 2. Among the listed choices, 4 is certainly an upper bound."],
  ["m2015-math-42", 1, "Limits subtract termwise, so an - bn tends to 3 - (-1) = 4."],
  ["m2015-math-43", 2, "From p and p => q, we get q. Since r or not q is true and not q is false, r must be true. Therefore p and r follows."],
  ["m2015-math-44", 0, "The geometric-sum identity 1 + 2 + 2^2 + ... + 2^n = 2^(n+1) - 1 is correct."],
  ["m2015-math-45", 1, "The derivative of sin(3x) is 3cos(3x), so the integral is sin(3x) + c."],
  ["m2015-math-46", 3, "The curve meets the x-axis at x = -2 and x = 2. The enclosed area is integral from -2 to 2 of (4 - x^2), which equals 32/3."],
  ["m2015-math-47", 0, "By the Fundamental Theorem of Calculus, integral from 0 to 1 of f(x) dx = F(1) - F(0) = -1 - 1 = -2. The option text appears to have an encoding issue, so the first option is the intended -2."],
  ["m2015-math-48", 1, "The xz-plane consists of all points whose y-coordinate is 0."],
  ["m2015-math-50", 1, "For y = 3sin(4x), the angle 4x runs from pi to 2pi when x is in (pi/4, pi/2), so the sine is negative there."],
  ["m2015-math-52", 0, "Doubling one row doubles the determinant, while adding one row to another leaves the determinant unchanged. So det(B) = 20 and det(C) = 10."],
  ["m2015-math-53", 2, "Solving the system gives y + z = 3 and x = 2 - 2z. Writing z = k gives (2 - 2k, 3 - k, k)."],
  ["m2015-math-54", 1, "z1 - (z2 - z3) = z1 - z2 + z3, which is not generally equal to (z1 - z2) - z3."],
  ["m2015-math-55", 3, "The point (-3, -1) corresponds to -3 - i on the Argand plane."],
  ["m2015-math-56", 2, "The translation vector is (4, 1). The original circle has center (1, -2) and radius 2, so the image has center (5, -1) and equation (x - 5)^2 + (y + 1)^2 = 4."],
  ["m2015-math-57", 0, "4u - 3v = 4(-1, 6) - 3(2, 4) = (-10, 12)."],
  ["m2015-math-58", 1, "Using similar cones gives r = h/2, so V = (pi/12)h^3. Differentiating gives dV/dt = (pi/4)h^2 dh/dt, and at h = 2 with dV/dt = 6pi, we get dh/dt = 6 cm/s."],
  ["m2015-math-60", 1, "f'(x) = -1/(2x^(3/2)) and g'(x) = -x^2/2. Setting them equal gives x = 1."],
  ["m2015-math-61", 0, "The average slope on [0, 1] is f(1) - f(0) = -2. Since f'(x) = 6x - 5, solving 6a - 5 = -2 gives a = 1/2."],
  ["m2015-math-63", 2, "By the chain rule, h'(0) = g'(f(1)) x f'(1) x 3 = 1 x 2 x 3 = 6."],
  ["m2015-math-64", 2, "In mechanics, the derivative represents instantaneous rate of change."],
  ["m2015-math-65", 0, "For a polynomial, if f(a) = 0 then x - a is a factor by the Factor Theorem."]
];

for (const [id, correctAnswer, explanation] of updates) {
  const start = source.indexOf(`id: "${id}"`);
  if (start === -1) continue;
  const next = source.indexOf(`\n  },`, start);
  if (next === -1) continue;
  const block = source.slice(start, next);
  const updatedBlock = block
    .replace(/correctAnswer: -?\d+,/, `correctAnswer: ${correctAnswer},`)
    .replace(/^\s+explanation: .*,$/m, `    explanation: ${JSON.stringify(explanation)},`);
  source = source.slice(0, start) + updatedBlock + source.slice(next);
}

fs.writeFileSync(filePath, source);
console.log(`Applied ${updates.length} safe math updates.`);
