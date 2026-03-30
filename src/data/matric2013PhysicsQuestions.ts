import { MatricExamQuestion } from "./matricExams";

export const matric2013PhysicsQuestions: MatricExamQuestion[] = [
  {
    id: "m2013-phys-1",
    question: "Which of the following is the correct unit for electric field?",
    options: ["N/C", "V/m", "Both A and B", "N/m"],
    correctAnswer: 2,
    explanation: "The electric field can be measured in N/C (Newtons per Coulomb) or V/m (Volts per meter), as both are equivalent units.",
  },
  {
    id: "m2013-phys-2",
    question: "A body moving with constant speed in a circular path has",
    options: [
      "constant velocity",
      "constant acceleration",
      "acceleration of constant magnitude but varying direction",
      "no acceleration",
    ],
    correctAnswer: 2,
    explanation: "In circular motion, the speed is constant but velocity changes due to changing direction. The acceleration (centripetal) has constant magnitude but always points toward the center, so its direction continuously changes.",
  },
  {
    id: "m2013-phys-3",
    question: "The work done by a conservative force between two points depends on",
    options: [
      "the path taken between the points",
      "only the end points",
      "the time taken to move between the points",
      "the speed of the object",
    ],
    correctAnswer: 1,
    explanation: "Conservative forces are path-independent. The work done depends only on the initial and final positions, not the path taken.",
  },
  {
    id: "m2013-phys-4",
    question: "According to Newton's third law of motion, action and reaction forces",
    options: [
      "act on the same body",
      "act on different bodies",
      "always cancel each other",
      "are always in the same direction",
    ],
    correctAnswer: 1,
    explanation: "Newton's third law states that action and reaction forces act on different bodies, which is why they don't cancel each other.",
  },
  {
    id: "m2013-phys-5",
    question: "The internal energy of an ideal gas depends on",
    options: [
      "volume only",
      "pressure only",
      "temperature only",
      "both pressure and volume",
    ],
    correctAnswer: 2,
    explanation: "For an ideal gas, internal energy depends only on temperature. This is because ideal gases have no intermolecular forces, so no potential energy - only kinetic energy which depends on temperature.",
  },
  {
    id: "m2013-phys-6",
    question: "Total internal reflection occurs when light travels from",
    options: [
      "air to glass",
      "glass to air",
      "air to water",
      "any medium to a denser medium",
    ],
    correctAnswer: 1,
    explanation: "Total internal reflection occurs when light travels from a denser medium to a rarer medium (e.g., glass to air) at an angle greater than the critical angle.",
  },
  {
    id: "m2013-phys-7",
    question: "Which of the following electromagnetic waves has the highest frequency?",
    options: ["Radio waves", "Microwaves", "X-rays", "Gamma rays"],
    correctAnswer: 3,
    explanation: "Gamma rays have the highest frequency in the electromagnetic spectrum, followed by X-rays, microwaves, and radio waves.",
  },
  {
    id: "m2013-phys-8",
    question: "The energy stored in a charged capacitor is given by",
    options: ["Q²/2C", "CV²", "Q/V", "C/V²"],
    correctAnswer: 0,
    explanation: "The energy stored in a capacitor is U = Q²/(2C) = (1/2)CV² = (1/2)QV. All three forms are equivalent.",
  },
  {
    id: "m2013-phys-9",
    question: "What is the advantage of using alternating current in transmission of electric energy?",
    options: [
      "It enables to reach the consumers at very high voltage.",
      "It enables a transformer to increase or decrease the voltage as required.",
      "It completely avoids energy loss due to heating.",
      "It uses very high current in the transmission line.",
    ],
    correctAnswer: 1,
    explanation: "AC voltage can be easily stepped up or down using transformers, which allows efficient long-distance transmission at high voltages and safe distribution at lower voltages.",
  },
];
