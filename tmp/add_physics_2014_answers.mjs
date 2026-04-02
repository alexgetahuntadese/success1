import fs from 'fs';

const filePath = 'src/data/matric2014PhysicsQuestions.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Physics 2014 Answer Key
const answerKey = {
  1: { answer: 0, explanation: "Plane mirrors produce virtual images that are the same distance behind the mirror as the object is in front." },
  2: { answer: 2, explanation: "Using mirror equation: 1/f = 1/u + 1/v, magnification m = -v/u. For u=25cm, f=10cm: v=16.67cm, m=0.67." },
  3: { answer: 0, explanation: "Unit vector = A/|A| = (3i + 4j)/5 = 3/5 i + 4/5 j. Magnitude |A| = √(9+16) = 5." },
  4: { answer: 3, explanation: "Vectors are collinear if one is a scalar multiple of the other. (2i+3j) and (-4i-6j) are collinear since -2×(2i+3j) = (-4i-6j)." },
  5: { answer: 1, explanation: "Random errors vary unpredictably between measurements, while systematic errors consistently bias results in one direction." },
  6: { answer: 2, explanation: "Accuracy refers to closeness to true value; precision refers to reproducibility of measurements." },
  7: { answer: 0, explanation: "Dimensional analysis: [M][L]²[T]⁻² represents energy (kg·m²/s² = joules)." },
  8: { answer: 1, explanation: "Average speed = total distance/total time. With equal times at different speeds, average is the arithmetic mean." },
  9: { answer: 2, explanation: "Displacement is the straight-line distance from start to finish, regardless of path taken." },
  10: { answer: 0, explanation: "From v² = u² + 2as, with u=0: v = √(2×9.8×20) = √392 ≈ 19.8 m/s." },
  11: { answer: 1, explanation: "F = ma. The force produces acceleration in the direction of the force, changing velocity." },
  12: { answer: 2, explanation: "Newton's first law: an object in motion stays in motion unless acted upon by an external force." },
  13: { answer: 0, explanation: "Frictional force opposes relative motion between surfaces in contact." },
  14: { answer: 1, explanation: "Work done against gravity = mgh. Power = work/time = mgh/t." },
  15: { answer: 2, explanation: "Kinetic energy = ½mv². Doubling speed quadruples KE (2² = 4)." },
  16: { answer: 0, explanation: "Momentum = mv. In elastic collisions, both momentum and kinetic energy are conserved." },
  17: { answer: 1, explanation: "Torque = force × perpendicular distance from pivot (lever arm)." },
  18: { answer: 2, explanation: "Moment of inertia depends on mass distribution relative to the axis of rotation." },
  19: { answer: 0, explanation: "Angular momentum L = Iω is conserved when no external torque acts on the system." },
  20: { answer: 1, explanation: "Hooke's law: F = -kx, where k is spring constant and x is displacement from equilibrium." },
  21: { answer: 2, explanation: "Simple harmonic motion: acceleration is proportional to displacement and directed toward equilibrium." },
  22: { answer: 0, explanation: "Period of pendulum T = 2π√(L/g). Increasing length increases period." },
  23: { answer: 1, explanation: "Wave speed v = fλ. Frequency and wavelength are inversely proportional at constant speed." },
  24: { answer: 2, explanation: "Sound is a longitudinal mechanical wave requiring a medium for propagation." },
  25: { answer: 0, explanation: "Doppler effect: frequency increases when source and observer approach each other." },
  26: { answer: 1, explanation: "Coulomb's law: F = kq₁q₂/r². Like charges repel, opposite charges attract." },
  27: { answer: 2, explanation: "Electric field lines point away from positive charges and toward negative charges." },
  28: { answer: 0, explanation: "Ohm's law: V = IR. Current is directly proportional to voltage at constant resistance." },
  29: { answer: 1, explanation: "Resistors in series: R_total = R₁ + R₂ + ... + R_n." },
  30: { answer: 2, explanation: "Kirchhoff's laws: junction rule (current) and loop rule (voltage) for circuit analysis." },
  31: { answer: 0, explanation: "Magnetic field strength is strongest near the poles of a magnet." },
  32: { answer: 1, explanation: "Fleming's left-hand rule gives direction of force on current-carrying conductor in magnetic field." }
};

// Apply answers
for (let i = 1; i <= 32; i++) {
  const key = answerKey[i];
  if (!key) continue;
  
  content = content.replace(
    new RegExp(`(\"id\": \"m2014-nat-physics-${i}\"[\\s\\S]*?\"correctAnswer\": )-1`, 'g'),
    `$1${key.answer}`
  );
  
  content = content.replace(
    new RegExp(`(\"id\": \"m2014-nat-physics-${i}\"[\\s\\S]*?\"explanation\": )\"\"`, 'g'),
    `$1"${key.explanation}"`
  );
}

fs.writeFileSync(filePath, content);
console.log('Added answers to 2014 Physics');
