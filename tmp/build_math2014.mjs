import fs from "node:fs";
import path from "node:path";

const htmlDir = path.join(process.cwd(), "tmp", "math2014html");

const ANSWER_KEY = {
  1: {
    correctAnswer: 2,
    explanation: "An ellipse is the set of all points in a plane for which the sum of the distances from two fixed points is constant.",
  },
  2: {
    correctAnswer: 0,
    explanation: "Convert 120 degrees to radians: 120 x pi / 180 = 2pi/3.",
  },
  3: {
    correctAnswer: 3,
    explanation: "The surface area of a sphere is 4pi r^2. With r = 6, the area is 4pi(36) = 144pi cm^2.",
  },
  4: {
    correctAnswer: 3,
    explanation: "Each exterior angle of a regular 10-sided polygon is 360/10 = 36 degrees.",
  },
  5: {
    correctAnswer: 1,
    explanation: "Use V = (1/3)pi r^2 h. With radius 4 and volume 64pi, we get 64pi = (1/3)pi(16)h, so h = 12 cm.",
  },
  6: {
    correctAnswer: 0,
    explanation: "Since 75 = 20 x 3 + 15, the quotient is 3 and the remainder is 15.",
  },
  7: {
    correctAnswer: 1,
    explanation: "f(0) = 1 and f(1) = p + 2. Opposite signs require p + 2 < 0, so p < -2. Among the options, -2 is the best-fit boundary value shown in the source.",
  },
  8: {
    correctAnswer: 0,
    explanation: "A fair die has 6 equally likely outcomes. Favorable outcomes for 3 or 5 are 2, so the probability is 2/6 = 1/3.",
  },
  9: {
    correctAnswer: 2,
    explanation: "The arccosine function accepts inputs from -1 to 1, so its domain is [-1, 1].",
  },
  10: {
    correctAnswer: 1,
    explanation: "Using tan 30 degrees = opposite/adjacent, the height difference is adjacent x tan 30 degrees. The source appears to have a typo in the horizontal distance, but the intended option matches h = 10 + 40/sqrt(3).",
  },
  11: {
    correctAnswer: 0,
    explanation: "The inverse relation swaps x and y. The condition y <= 5 becomes x <= 5, while the symmetric x^2 + y^2 part stays the same. The source shows duplicate options, so the first matching one is used.",
  },
  12: {
    correctAnswer: 3,
    explanation: "Subtract entrywise: A - B = [[2-1, 0-3, 5-0], [3-6, 1-5, 4-2], [0-9, 6-7, -2-0]] = [[1, -3, 5], [-3, -4, 2], [-9, -1, -2]].",
  },
  13: {
    correctAnswer: 1,
    explanation: "Starting at the origin gives (-5, 0, 0), then (-5, 5, 0), then (-5, 5, -5).",
  },
  14: {
    correctAnswer: 0,
    explanation: "Weight has both magnitude and direction, so it is a vector quantity.",
  },
  15: {
    correctAnswer: 0,
    explanation: "d/dx(tan x) = sec^2 x and d/dx(3^x) = 3^x ln 3. The source option appears to have a typo, but the intended matching choice is the first one.",
  },
  16: {
    correctAnswer: 1,
    explanation: "Points inside x^2 + y^2 + z^2 = 5 must satisfy x^2 + y^2 + z^2 < 5. For (1, 1, 1), the sum is 3, so it lies inside the sphere.",
  },
  17: {
    correctAnswer: 0,
    explanation: "For z = 2 - 2sqrt(3)i, the modulus is 4 and the argument is 5pi/3. The first option gives 4(cos 5pi/3 + i sin 5pi/3).",
  },
  18: {
    correctAnswer: 1,
    explanation: "a + 2b = (4, 3, 2) + 2(1, 2, -3) = (6, 7, -4), so the option claiming a different first coordinate is the incorrect one.",
  },
  19: {
    correctAnswer: 2,
    explanation: "Multiply: (2 - 3i)(5 + 2i) = 10 + 4i - 15i - 6i^2 = 16 - 11i.",
  },
  20: {
    correctAnswer: 0,
    explanation: "The arithmetic mean is sensitive to very large or very small outliers, so it is affected by extreme values.",
  },
  21: {
    correctAnswer: 3,
    explanation: "Using Heron's formula with sides 10, 14, and 8 gives s = 16 and area = sqrt(16 x 6 x 2 x 8) = 8sqrt(15). The source options were corrupted, so the corrected matching option is 8sqrt(15).",
  },
  22: {
    correctAnswer: 1,
    explanation: "Integrate term by term: integral of x^(-1/2) is 2sqrt(x), integral of -e^(-3x) is e^(-3x)/3, and integral of 5x^(-2) is -5/x. That matches the second option.",
  },
  23: {
    correctAnswer: 1,
    explanation: "From the graph, the shaded region extends leftward up to x = 2, so the domain is {x | x <= 2}. The two boundary rays spread without bound as x decreases, so the range is all real numbers.",
  },
  24: {
    correctAnswer: 2,
    explanation: "For definite integrals, the interval-addition rule is integral from a to b = integral from a to c plus integral from c to b. The source uses a minus sign, so that statement is the false one.",
  },
  25: {
    correctAnswer: 3,
    explanation: "Using integration by parts, integral of x e^x dx = (x - 1)e^x + C. Evaluating from 0 to 1 gives 0 - (-1) = 1.",
  },
  26: {
    correctAnswer: 2,
    explanation: "Simplify radicals: sqrt(20) = 2sqrt(5), sqrt(45) = 3sqrt(5), and sqrt(75) = 5sqrt(3). The expression becomes (12sqrt(5) - 9sqrt(5)) / (15sqrt(3)) = sqrt(15)/15 = 1/5.",
  },
  27: {
    correctAnswer: 2,
    explanation: "The symmetric difference keeps elements that are in exactly one set. Removing the common elements 5 and 8 gives {1, 2, 3, 6, 10, 11}.",
  },
  28: {
    correctAnswer: 1,
    explanation: "The mean is 4.2. The population variance is ((2-4.2)^2 + (3-4.2)^2 + (4-4.2)^2 + (5-4.2)^2 + (7-4.2)^2) / 5 = 2.96.",
  },
  29: {
    correctAnswer: 1,
    explanation: "Without replacement, the first draw changes the probabilities for the second draw, so the events are dependent.",
  },
  30: {
    correctAnswer: 0,
    explanation: "Use limit laws directly: (6 - (-9)) / (2 x 6 - 7) = 15/5 = 3.",
  },
  31: {
    correctAnswer: 1,
    explanation: "If a function is differentiable at a point, then it is continuous there. The intended true statement is the second one.",
  },
  32: {
    correctAnswer: 1,
    explanation: "Continuity at x = 1 requires a(1) + 3 = 1^2 - 2(1) + 3 = 2. So a = -1.",
  },
  33: {
    correctAnswer: 2,
    explanation: "Differentiate f(x) = x e^x sec x. At x = 0, the factor x makes the last two product-rule terms vanish, leaving f'(0) = e^0 sec 0 = 1.",
  },
  34: {
    correctAnswer: 3,
    explanation: "By the monotone convergence theorem, every bounded monotone sequence converges.",
  },
  35: {
    correctAnswer: 1,
    explanation: "If g(x) = f(2x + 3), then g''(x) = 4f''(2x + 3). Using f''(3) = 5 gives g''(0) = 4f''(3) = 20.",
  },
  36: {
    correctAnswer: 2,
    explanation: "A quotient f/g can fail to be continuous where g(a) = 0, even when f and g are each continuous at a.",
  },
  37: {
    correctAnswer: 0,
    explanation: "If an absolute maximum is attained at a critical number, then nearby function values cannot exceed it, so it is also a local maximum. The other statements are not always true.",
  },
  38: {
    correctAnswer: 2,
    explanation: "With a3 = -4 and common difference 5, the seventh term is a7 = a3 + 4d = -4 + 20 = 16.",
  },
  39: {
    correctAnswer: 1,
    explanation: "With perimeter 120, we have l + w = 60. A rectangle with fixed perimeter has maximum area when it is a square, so l = w = 30 m.",
  },
  40: {
    correctAnswer: 1,
    explanation: "Use S_n = a(1-r^n)/(1-r). With a = 3/10, r = 1/10, and n = 8, this becomes (1/3)((10^8 - 1)/10^8).",
  },
  41: {
    correctAnswer: 3,
    explanation: "By Rolle's theorem, if f is continuous on [a, b], differentiable on (a, b), and f(a) = f(b), then there exists c in (a, b) with f'(c) = 0. So the graph has a horizontal tangent there.",
  },
  42: {
    correctAnswer: 2,
    explanation: "Distance from (x0, y0) to Ax + By + C = 0 is |Ax0 + By0 + C| / sqrt(A^2 + B^2). Here it is |3(3) + 4(4) - 5| / 5 = 20/5 = 4.",
  },
  43: {
    correctAnswer: 1,
    explanation: "The chord through the center and perpendicular to the major axis is the minor axis.",
  },
  44: {
    correctAnswer: 2,
    explanation: "For a 3 x 3 matrix, det(kA) = k^3 det(A). So det(2A) = 2^3 x 5 = 40.",
  },
  45: {
    correctAnswer: 3,
    explanation: "Write the coefficients and constants row by row: [2 1 3 | 4], [1 0 -1 | 1], and [-4 1 0 | 3].",
  },
  46: {
    correctAnswer: 0,
    explanation: "Validity applies to the logical form of an argument, not to a truth value being 'false'. So the first statement is the one that is not true.",
  },
  47: {
    correctAnswer: 0,
    explanation: "The converse of 'If 6 is prime, then 4 is even' is 'If 4 is even, then 6 is prime,' which is false. The other converses are true because they have false hypotheses or true conclusions.",
  },
  48: {
    correctAnswer: 1,
    explanation: "Since x > 1 for log(x - 1), rewrite 2log(x - 1) as log((x - 1)^2). Then x^2 - 3 = (x - 1)^2 gives x = 2.",
  },
  49: {
    correctAnswer: 3,
    explanation: "sin(120 degrees) = sin(180 degrees - 60 degrees) = sin 60 degrees.",
  },
  50: {
    correctAnswer: 1,
    explanation: "Factor x^2 - 5x + 6 = (x - 2)(x - 3). Since the parabola opens upward, the expression is non-positive on [2, 3].",
  },
  51: {
    correctAnswer: 0,
    explanation: "A point dividing PQ in the ratio 2:3 from P is P + (2/5)(Q - P) = (0,1) + (2/5)(5,5) = (2,3).",
  },
  52: {
    correctAnswer: 1,
    explanation: "cos(-120 degrees) = cos(120 degrees) because cosine is even, and cos(120 degrees) = -1/2.",
  },
  53: {
    correctAnswer: 0,
    explanation: "sqrt(x^2) = |x| takes every real x to a value in [0, infinity), and every nonnegative value is reached, so it is onto that codomain.",
  },
  54: {
    correctAnswer: 2,
    explanation: "Factor 4x^4 - 64 = 4(x^4 - 16) = 4(x - 2)(x + 2)(x^2 + 4). Dividing by 2 - x = -(x - 2) gives -4(x + 2)(x^2 + 4).",
  },
  55: {
    correctAnswer: 2,
    explanation: "Monthly growth is 1 + 0.12/12 = 1.01. Doubling requires 1.01^n = 2, so n = ln 2 / ln 1.01 about 69.66 months, which is about 5.81 years.",
  },
  56: {
    correctAnswer: 3,
    explanation: "Delete row 1 and column 1 to get the minor of entry 1: det([[4, 2], [7, 0]]) = 4(0) - 2(7) = -14. Its cofactor is also -14 because the sign in position (1,1) is positive.",
  },
  57: {
    correctAnswer: 0,
    explanation: "With the corrected point B = (1, 0), vector AB = (3, -1) and vector CD = (0, 2). Their sum is a + b = (3, 1).",
  },
  58: {
    correctAnswer: 0,
    explanation: "For vertices A(0, 0), B(6, 0), and C(0, 4), the centroid is the average of the coordinates: ((0 + 6 + 0)/3, (0 + 0 + 4)/3) = (2, 4/3).",
  },
  59: {
    correctAnswer: 2,
    explanation: "The center (-2, 2) rotated by pi/6 becomes (-sqrt(3) - 1, sqrt(3) - 1). The radius stays 1, so the image is (x + (sqrt(3) + 1))^2 + (y - (sqrt(3) - 1))^2 = 1.",
  },
  60: {
    correctAnswer: 2,
    explanation: "Compute the dot product: (1, 2) dot (-2, 4) = 1(-2) + 2(4) = 6.",
  },
  61: {
    correctAnswer: 0,
    explanation: "For the corrected integrand, divide first: (x^3 + x^2 - x)/(x^2 + x - 2) = x + x/((x - 1)(x + 2)). Then x/((x - 1)(x + 2)) = 1/(3(x - 1)) + 2/(3(x + 2)), which integrates to the first option.",
  },
  62: {
    correctAnswer: 3,
    explanation: "For the corrected equation 5x^2 - 9x + 16 = 0, Vieta's formulas give r1 + r2 = -(-9)/5 = 9/5, so the fourth option is true.",
  },
  63: {
    correctAnswer: 3,
    explanation: "There are 95 students, so Q1 is at position 95/4 = 23.75. That falls in the 26-31 class. Using class boundary 25.5, width 6, frequency 25, and cumulative frequency before the class 15 gives Q1 = 25.5 + ((23.75 - 15)/25) x 6 = 27.6, so 27.5 is the best-fit option.",
  },
  64: {
    correctAnswer: 3,
    explanation: "A conditional statement is logically equivalent to its disjunction form: p => q is equivalent to not p or q. So the corrected fourth option is the tautology.",
  },
  65: {
    correctAnswer: 0,
    explanation: "For x >= 0, f(x) = 5 + x/(x + 1) = 6 - 1/(x + 1), so y = 6 is a horizontal asymptote. For x < 0, f(x) = 5 - x/(x + 1) = 4 + 1/(x + 1), so y = 4 is the other horizontal asymptote. Therefore the only false statement is the oblique asymptote claim.",
  },
};

const QUESTION_FIXES = {
  21: {
    options: [
      "10√6 square unit",
      "16√6 square unit",
      "16√3 square unit",
      "8√15 square unit",
    ],
  },
  35: {
    question: "Suppose f is a twice continuously differentiable function and f''(3) = 5. If g(x) = f(2x + 3), then the second derivative of g at 0 is equal to:",
  },
  38: {
    question: "What is the seventh term of an arithmetic sequence whose third term is -4 and common difference is 5?",
  },
  58: {
    question: "What is the point of intersection of the medians of ΔABC whose vertices are given by A(0, 0), B(6, 0) and C(0, 4)?",
  },
  25: {
    question: "What is the value of $$\\int_0^1 x e^x dx$$",
  },
  57: {
    question: "Consider the points A(-2, 1), B(1, 0), C(1, -1) and D(1, 1) in xy-plane. If a = AB and b = CD, then which one of the following is equal to a + b?",
  },
  61: {
    question: "\\[ \\int \\frac{x^3 + x^2 - x}{x^2 + x - 2} \\, dx \\quad \\text{is equal to:}\\]",
  },
  62: {
    question: "If r₁ and r₂ are the roots of the equation 5x² - 9x + 16 = 0, which one of the following is true?",
  },
  64: {
    options: [
      "(p ∨ q) ≡ p",
      "(p ⇒ q) ≡ p",
      "(p ∧ q) ≡ p",
      "(p ⇒ q) ≡ (¬p ∨ q)",
    ],
  },
  65: {
    options: [
      "y = 5 + x is its oblique asymptote.",
      "y = 6 is its horizontal asymptote of f.",
      "y = 4 is its horizontal asymptote.",
      "x = -1 is its vertical asymptote of f.",
    ],
  },
};

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function repairMojibake(value) {
  if (!/[ÂÃâÏ]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
}

function normalizeWhitespace(value) {
  return value
    .replace(/\r/g, "")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanHtml(value) {
  let text = value;
  text = text.replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, (_, alt) => `[Image: ${alt}]`);
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, "\n");
  text = text.replace(/<\/div>\s*<div[^>]*>/gi, "\n");
  text = text.replace(/<sup>(.*?)<\/sup>/gi, "^$1");
  text = text.replace(/<sub>(.*?)<\/sub>/gi, "$1");
  text = text.replace(/<[^>]+>/g, "");
  text = decodeHtml(text);
  text = repairMojibake(text);
  return normalizeWhitespace(text);
}

const files = fs
  .readdirSync(htmlDir)
  .filter((name) => /^page\d+\.html$/.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const questions = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(htmlDir, file), "utf8");
  const blockRegex =
    /<h3 class="f-25px mb-0 font-bolder">Question (\d+)<\/h3>([\s\S]*?)(?=<h3 class="f-25px mb-0 font-bolder">Question \d+<\/h3>|$)/g;

  let blockMatch;
  while ((blockMatch = blockRegex.exec(html))) {
    const number = Number(blockMatch[1]);
    const block = blockMatch[2];
    const questionMatch = block.match(/<div class='isQuesion w-100 mt-2'><p>([\s\S]*?)<\/p><\/div>/i);
    if (!questionMatch) continue;

    const question = cleanHtml(questionMatch[1]);
    const options = [];
    const optionRegex = /<p\s+class='cho-inner\s*'>([\s\S]*?)<\/p>/gi;
    let optionMatch;
    while ((optionMatch = optionRegex.exec(block)) && options.length < 4) {
      let optionHtml = optionMatch[1];
      optionHtml = optionHtml.replace(/<span class='choice-letter-lables\s*'>[A-D]<\/span>/i, "");
      optionHtml = optionHtml.replace(/^<\/?span>/i, "").replace(/<\/span>\s*$/i, "");
      options.push(cleanHtml(optionHtml));
    }

    if (options.length === 4) {
      questions.push({ number, question, options });
    }
  }
}

questions.sort((a, b) => a.number - b.number);

const lines = [
  'import { MatricExamQuestion } from "./matricExams";',
  "",
  "export const matric2014MathQuestions: MatricExamQuestion[] = [",
];

questions.forEach((item) => {
  const fixedItem = {
    ...item,
    ...(QUESTION_FIXES[item.number] ?? {}),
  };
  const id = `m2014-math-${item.number}`;

  lines.push("  {");
  lines.push(`    id: "${id}",`);
  lines.push(`    question: ${JSON.stringify(fixedItem.question)},`);
  lines.push("    options: [");
  fixedItem.options.forEach((option) => {
    lines.push(`      ${JSON.stringify(option)},`);
  });
  lines.push("    ],");
    const answer = ANSWER_KEY[item.number] ?? {
      correctAnswer: -1,
      explanation: "No explanation was provided in the source.",
    };
    lines.push(`    correctAnswer: ${answer.correctAnswer},`);
    lines.push(`    explanation: ${JSON.stringify(answer.explanation)},`);
    lines.push("  },");
});

lines.push("];");
lines.push("");

fs.writeFileSync(path.join(process.cwd(), "src", "data", "matric2014MathQuestions.ts"), `${lines.join("\n")}\n`);
console.log(`Wrote ${questions.length} questions.`);
