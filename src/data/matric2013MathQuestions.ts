import { MatricExamQuestion } from "./matricExams";

export const matric2013MathQuestions: MatricExamQuestion[] = [
  {
    id: "m2013-math-1",
    question: "Given two vectors u = (1, 3) and v = (-3, 5) in the plane. Then 6u + 2v is equal to",
    options: ["(0, 18)", "(3, 3)", "(2, 28)", "(0, 28)"],
    correctAnswer: 3,
    explanation: "6u = 6(1, 3) = (6, 18) and 2v = 2(-3, 5) = (-6, 10). So 6u + 2v = (6 + (-6), 18 + 10) = (0, 28)",
  },
  {
    id: "m2013-math-2",
    question: "Which one of the following is the standard form of the equation of the circle centered at (2, -3) and radius 5?",
    options: [
      "(x - 2)² + (y - 3)² = 25",
      "(x - 2)² + (y + 3)² = 25",
      "(x + 2)² + (y + 3)² = 5",
      "(x + 2)² + (y - 3)² = 25",
    ],
    correctAnswer: 1,
    explanation: "The standard form of a circle is (x - h)² + (y - k)² = r² where (h, k) is the center. For center (2, -3) and radius 5: (x - 2)² + (y + 3)² = 25",
  },
  {
    id: "m2013-math-3",
    question: "If f is a continuous function on [a, b] and F is its anti-derivative, then which of the following is true?",
    options: [
      "∫[a,b] F'(x)dx = f(b) - f(a)",
      "∫[a,b] F(x)dx = f(b) - f(a)",
      "∫[a,b] f(x)dx = F(b) - F(a)",
      "∫[a,b] f'(x)dx = F(b) - F(a)",
    ],
    correctAnswer: 2,
    explanation: "By the Fundamental Theorem of Calculus, if F is an anti-derivative of f, then ∫[a,b] f(x)dx = F(b) - F(a)",
  },
  {
    id: "m2013-math-4",
    question: "Which of the following defines the equation of a sphere whose center is at (0, -1, 2) and radius 6 units?",
    options: [
      "x² + (y+1)² + (z-2)² = 36",
      "x² + (y-1)² + (z-2)² = 36",
      "x² + (y+1)² + (z-2)² = 12",
      "x² + (y+1)² + (z+2)² = 36",
    ],
    correctAnswer: 0,
    explanation: "The standard form of a sphere is (x - h)² + (y - k)² + (z - l)² = r². For center (0, -1, 2) and radius 6: x² + (y + 1)² + (z - 2)² = 36",
  },
  {
    id: "m2013-math-5",
    question: "Which of the following represents the vector (3, -5, 7) in the space using the standard unit vectors i, j and k?",
    options: [
      "3i - 5j - 7k",
      "3i + 5j + 7k",
      "3i - 5j + 7k",
      "-3i - 5j - 7k",
    ],
    correctAnswer: 2,
    explanation: "The vector (a, b, c) = ai + bj + ck. So (3, -5, 7) = 3i - 5j + 7k",
  },
  {
    id: "m2013-math-6",
    question: "Which one of the following is the scalar (dot) product of the vectors (2, -4, 6) and (-2, -1, 0)?",
    options: ["0", "-8", "8", "-4"],
    correctAnswer: 0,
    explanation: "The dot product of (2, -4, 6) and (-2, -1, 0) = 2(-2) + (-4)(-1) + 6(0) = -4 + 4 + 0 = 0",
  },
  {
    id: "m2013-math-7",
    question: "What are the domain and range of the function f(x) = 2x^(3/4) respectively?",
    options: [
      "ℝ and [0,∞)",
      "[0,∞) and ℝ",
      "[0,∞) and ℝ",
      "[0,∞) and [0,∞)",
    ],
    correctAnswer: 3,
    explanation: "For f(x) = 2x^(3/4), the domain requires x ≥ 0 (since we have a fourth root). The range is also [0,∞) since x^(3/4) ≥ 0 for x ≥ 0",
  },
  {
    id: "m2013-math-8",
    question: "Which one of the following defines a one-to-one function?",
    options: [
      "f = {(x, y): x is a sister of y}",
      "f = {(x, y): y = 3x - 1}",
      "f = {(x, y): y = x² + 1}",
      "f = {(x, y): y is a father of x}",
    ],
    correctAnswer: 1,
    explanation: "y = 3x - 1 is a linear function with non-zero slope, making it one-to-one. The other options are not one-to-one because: sister relationship can have multiple sisters, father relationship can have multiple children, and y = x² + 1 has y(-1) = y(1) = 2",
  },
  {
    id: "m2013-math-9",
    question: "The equation of a circle is given by (x-3)²+(y+2)²=9. What are the center and the radius of the circle respectively?",
    options: [
      "(3, -2) and 3",
      "(3, 2) and 3",
      "(3, -2) and 9",
      "(3, 2) and 9",
    ],
    correctAnswer: 0,
    explanation: "The standard form (x - h)² + (y - k)² = r² has center (h, k) and radius r. From (x-3)²+(y+2)²=9, we get center (3, -2) and radius √9 = 3",
  },
];
