import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "src", "data", "matric2015MathQuestions.ts");
let source = fs.readFileSync(filePath, "utf8");

const updates = {
  "m2015-math-2": [3, "The critical points are x = -5 and x = 3/2. Since the quadratic opens upward, (2x - 3)(x + 5) is less than or equal to zero between the roots, so the solution is from -5 to 3/2. The source option omits the closed brackets."],
  "m2015-math-4": [2, "Using similar triangles, 20/4 = 35/x, so x = 7 meters."],
  "m2015-math-5": [3, "The net movement is 3 km west and 4 km north, so the displacement from the start is sqrt(3^2 + 4^2) = 5 km."],
  "m2015-math-6": [1, "By the Remainder Theorem, P(-1) = 4. That gives 3 + 5 + 7 + 2k + 3 = 4, so 18 + 2k = 4 and k = -7."],
  "m2015-math-8": [3, "Completing the square gives f(x) = (x - 3)^2 + 1, so the vertex is (3, 1). The parabola opens upward."],
  "m2015-math-9": [1, "A regular hexagon inscribed in a circle of radius 6 has side length 6. Its area is 6 times the area of an equilateral triangle of side 6: 6 x (sqrt(3)/4 x 36) = 54sqrt(3)."],
  "m2015-math-10": [2, "A prime number is defined as a positive integer with exactly two positive factors: 1 and itself."],
  "m2015-math-11": [3, "Standard form means a x 10^n with 1 <= a < 10. The source appears to have a typo in option D, but it is the only one intended to match standard form."],
  "m2015-math-13": [2, "Solving the absolute-value equation by intervals gives no value of x that satisfies it, so the solution set is empty."],
  "m2015-math-15": [3, "Using the given dimensions, the full cylinder-plus-hemisphere would give 126pi cubic centimeters. The printed description looks incomplete around the cut, so option D is the best-fit source answer."],
  "m2015-math-16": [2, "x^(2/3) is defined for every real x because cube roots are defined for negative and positive numbers, and squaring keeps the value real."],
  "m2015-math-17": [1, "The slope of a line that makes angle theta with the positive x-axis is tan(theta). Since tan(135 degrees) = -1, the slope is -1."],
  "m2015-math-18": [1, "tan(509 degrees) = tan(149 degrees) = tan(180 degrees - 31 degrees) = -tan(31 degrees) = -0.81."],
  "m2015-math-19": [1, "In quadrant IV, cosine is positive. With sin(theta) = -3/5, we get cos(theta) = 4/5, so sec(theta) = 5/4."],
  "m2015-math-20": [3, "Using coordinates for a general parallelogram shows APCQ is always a parallelogram, but not necessarily a rhombus. The other relations follow from midpoint and parallelogram properties."],
  "m2015-math-21": [2, "Each lateral face is an isosceles triangle with sides 10, 10, and 12. Its height is sqrt(10^2 - 6^2) = 8, so one face has area 1/2 x 12 x 8 = 48. With 6 faces, the lateral area is 288 square centimeters."],
  "m2015-math-22": [0, "Matrix multiplication gives [[3, 2b - 3], [a - 4, ab + 12]] = [[3, 1], [-1, 18]]. So 2b - 3 = 1 gives b = 2 and a - 4 = -1 gives a = 3."],
  "m2015-math-23": [0, "The transpose swaps rows and columns, so A^T = [[1, 0, -3], [-1, 2, 6]]."],
  "m2015-math-24": [0, "If x = y, then x - y = y - x = 0, so the existential statement is true on the natural numbers."],
  "m2015-math-25": [1, "The cumulative frequency of the fourth class is 2 + 9 + 11 + 5 = 27."],
  "m2015-math-26": [1, "E3 = {3, 6} and E4 = {5} have no common outcomes, so they are mutually exclusive."],
  "m2015-math-27": [0, "The cumulative frequencies are 8, 26, 33, 38, 40, so the median class is 49-57. Using class boundary 48.5 and the grouped-data formula gives 54.5 kg."],
  "m2015-math-28": [0, "The favorable students are from grade 10 or 12, so 5 + 2 = 7 out of a total of 15. The probability is 7/15."],
  "m2015-math-30": [1, "Since p is true, not p is false. Then (not p and q) implies q is always true because a false antecedent makes the implication true for any q."],
  "m2015-math-31": [1, "On (0, infinity), |x| = x, so the function is x - 1, which is one-to-one. The other relations are not injective."],
  "m2015-math-32": [3, "Using partial fractions and substituting x = -2 gives A = 2, substituting x = 1 gives C = 5, and comparing coefficients gives B = -1."],
  "m2015-math-33": [3, "The numerator x^3 - 3x is odd and the denominator x^2 - 6 is even, so the quotient is an odd function. Therefore the graph is symmetric about the origin."],
  "m2015-math-34": [0, "For slopes 2 and -3, tan(theta) = |(m2 - m1)/(1 + m1m2)| = |-5/(-5)| = 1, so the acute angle is pi/4."],
  "m2015-math-35": [1, "The vertex is (2, -1) and the focus is 3 units left of the vertex, so p = -3. The standard form is (y + 1)^2 = 4p(x - 2) = -12(x - 2)."],
  "m2015-math-36": [3, "Substituting x = 1 directly gives (1 - 1)/(1 + 1) = 0."],
  "m2015-math-37": [1, "Continuity at x = 1 requires the two pieces to agree there. From the left, 1^2 - 4 = -3; from the right, a(1) + 1 = a + 1. So a + 1 = -3 and a = -4."],
  "m2015-math-39": [0, "Because the sequence starts at n = 0, the fifth term is a4 = 2^4 + 4(4) - 5 = 16 + 16 - 5 = 27."],
  "m2015-math-41": [3, "The sequence is 2 - 1/(n + 1), so every term is less than 2. Since 4 is larger than all terms, it is an upper bound among the choices given."],
  "m2015-math-42": [1, "If an converges to 3 and bn converges to -1, then an - bn converges to 3 - (-1) = 4."],
  "m2015-math-43": [2, "From p and p implies q, we get q. Since r or not q is true and not q is false, r must be true. Therefore p and r follows."],
  "m2015-math-44": [0, "The geometric sum 1 + 2 + 2^2 + ... + 2^n = 2^(n+1) - 1 is the correct statement. The others fail for standard values of n."],
  "m2015-math-45": [1, "The integral of 3cos(3x) is sin(3x) + c because the derivative of sin(3x) is 3cos(3x)."],
  "m2015-math-46": [3, "The curve y = x^2 - 4 meets the x-axis at x = -2 and x = 2. The required area is integral from -2 to 2 of (4 - x^2), which equals 32/3."],
  "m2015-math-47": [0, "By the Fundamental Theorem of Calculus, integral from 0 to 1 of f(x) dx = F(1) - F(0) = -1 - 1 = -2. The source appears to have an encoding error, so option A is the intended -2."],
  "m2015-math-48": [1, "The xz-plane consists of all points with y = 0."],
  "m2015-math-50": [1, "The period of y = 3sin(4x) is pi/2. On (pi/4, pi/2), the angle 4x runs from pi to 2pi, where sine is negative, so the graph lies below the x-axis there."],
  "m2015-math-52": [0, "Multiplying one row by 2 doubles the determinant, so det(B) = 20. Adding one row to another does not change determinant, so det(C) = 10."],
  "m2015-math-53": [2, "Solving the system gives y + z = 3 and x = 2 - 2z. Writing z = k gives (x, y, z) = (2 - 2k, 3 - k, k)."],
  "m2015-math-54": [1, "Subtraction is not associative in that form: z1 - (z2 - z3) = z1 - z2 + z3, which is not generally equal to (z1 - z2) - z3."],
  "m2015-math-55": [3, "The point (-3, -1) corresponds to the complex number -3 - i in the Argand plane."],
  "m2015-math-56": [2, "The translation vector is (4, 1). The original circle has center (1, -2) and radius 2, so the image has center (5, -1) and equation (x - 5)^2 + (y + 1)^2 = 4."],
  "m2015-math-57": [0, "4u - 3v = 4(-1, 6) - 3(2, 4) = (-4, 24) - (6, 12) = (-10, 12)."],
  "m2015-math-58": [1, "For the cone, r/h = 5/10 = 1/2 so r = h/2. Then V = (1/3)pi r^2 h = (pi/12)h^3, and differentiating gives dV/dt = (pi/4)h^2 dh/dt. Substituting dV/dt = 6pi and h = 2 gives dh/dt = 6 cm/sec."],
  "m2015-math-60": [1, "f'(x) = -1/(2x^(3/2)) and g'(x) = -x^2/2. Setting them equal gives 1/x^(3/2) = x^2, so x^(7/2) = 1 and x = 1."],
  "m2015-math-61": [0, "By the Mean Value Theorem, f'(a) = (f(1) - f(0))/(1 - 0). For f(x) = 3x^2 - 5x + 1, this average slope is -2 and f'(x) = 6x - 5, so 6a - 5 = -2 and a = 1/2."],
  "m2015-math-63": [2, "Using the chain rule, h'(x) = g'(f(3x + 1)) x f'(3x + 1) x 3. At x = 0 this becomes g'(f(1)) x f'(1) x 3 = 1 x 2 x 3 = 6."],
  "m2015-math-64": [2, "In mechanics, derivative represents instantaneous rate of change, such as instantaneous velocity."],
  "m2015-math-65": [0, "If f(a) = 0, then x - a is a factor of the polynomial by the Factor Theorem."],
};

for (const [id, [correctAnswer, explanation]] of Object.entries(updates)) {
  const pattern = new RegExp(`(id: "${id}",[\\s\\S]*?correctAnswer: )-?\\d+,([\\r\\n]+\\s+explanation: )"[^"]*"`, "m");
  source = source.replace(pattern, (_, p1, p2) => `${p1}${correctAnswer},${p2}${JSON.stringify(explanation)}`);
}

fs.writeFileSync(filePath, source);
console.log(`Updated ${Object.keys(updates).length} questions.`);
