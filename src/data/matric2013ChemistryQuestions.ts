import { MatricExamQuestion } from "./matricExams";

export const matric2013ChemistryQuestions: MatricExamQuestion[] = [
  {
    id: "m2013-chem-1",
    question: "From the magnitude of the equilibrium constant, Keq one can deduce that",
    options: [
      "large Keq value indicates that the reaction reaches equilibrium with very little reactants remaining.",
      "Small Keq values indicate the reaction yields very higher amounts of products near equilibrium.",
      "Keq will be larger when we have higher amounts of reactants over products.",
      "Intermediate Keq value indicates that the reaction does proceed in the forward direction.",
    ],
    correctAnswer: 0,
    explanation: "A large Keq value indicates that at equilibrium, the reaction favors products, meaning very little reactants remain.",
  },
  {
    id: "m2013-chem-2",
    question: "The statement 'If a system at equilibrium is subjected to a stress, the system will readjust itself to reduce the effects of the stress' is known as",
    options: [
      "Avogadro's principle.",
      "Faradays law.",
      "Le-Chatelier's principle.",
      "Boyle's law.",
    ],
    correctAnswer: 2,
    explanation: "Le Chatelier's Principle states that if a system at equilibrium is subjected to a stress, the system will shift to counteract that stress.",
  },
  {
    id: "m2013-chem-3",
    question: "The law of mass action states that",
    options: [
      "The Keq expression is the ratio of the concentrations of reactants to the products raised to their coefficients.",
      "The rate of a reaction is directly proportional to the product of the concentration of reactants raised to the power of their respective coefficients in the balanced equation.",
      "For a reaction at equilibrium, the reaction quotient, Q is always less than the equilibrium constant, Keq.",
      "A chemical equilibrium is attained only when the reaction is started with reactants.",
    ],
    correctAnswer: 1,
    explanation: "The Law of Mass Action states that the rate of a reaction is proportional to the product of the concentrations of reactants raised to their stoichiometric coefficients.",
  },
  {
    id: "m2013-chem-4",
    question: "For the reaction between gaseous NO and O2 to form NO2(g), what will be the equilibrium constant expression, 2NO(g) + O2(g) ↔ 2NO2(g)",
    options: [
      "Kp=(PNO2)/(PNO)(PO2)",
      "Kc=(NO2)2/(NO)2(O2)",
      "Kp=(PNO2)2(PO2)/(PNO2)",
      "Kp=(PNO2)2/(PNO)2(PO2)",
    ],
    correctAnswer: 3,
    explanation: "For the reaction 2NO(g) + O2(g) ↔ 2NO2(g), the equilibrium constant Kp = (PNO2)²/((PNO)²(PO2)), with products in numerator and reactants in denominator, raised to their coefficients.",
  },
  {
    id: "m2013-chem-5",
    question: "The equilibrium constant Kp for the reaction 2SO2(g) ⇌ 2SO3(g) + O2(g) is 3.8 × 10⁻³ at 227°C. What is the value of Kc for the reaction at the same temperature?",
    options: [
      "4.6 × 10⁻⁴ mol m⁻³",
      "1.8 × 10⁻³ mol m⁻³",
      "2.3 × 10⁻⁴ mol m⁻³",
      "9.1 × 10⁻⁴ mol m⁻³",
    ],
    correctAnswer: 0,
    explanation: "Using Kp = Kc(RT)^Δn where Δn = (2+1) - 2 = 1, we can solve for Kc.",
  },
  {
    id: "m2013-chem-6",
    question: "In the Galvanic cell given in the diagram, identify the component parts correctly labelled for the letters a, b, c, d respectively",
    options: [
      "Copper anode, Zinc cathode, voltmeter, salt bridge",
      "Zinc cathode, Copper cathode, Zinc anode, Copper cathode",
      "Copper anode, Zinc anode, CuSO4(sol), voltmeter",
      "Zinc anode, Copper cathode, ZnSO4(sol), salt bridge",
    ],
    correctAnswer: 3,
    explanation: "In a typical Galvanic cell with Zinc and Copper, Zinc acts as the anode (oxidation) and Copper as the cathode (reduction). The cell contains ZnSO4 solution and a salt bridge.",
  },
  {
    id: "m2013-chem-7",
    question: "Which one of the following is true about nuclear reactions?",
    options: [
      "The rate of nuclear reaction is affected by catalysts.",
      "They are accompanied by relatively small energy changes.",
      "New elements are often formed as products.",
      "The nuclei are unaffected by chemical reactions.",
    ],
    correctAnswer: 2,
    explanation: "Nuclear reactions often produce new elements (transmutation), unlike chemical reactions which only rearrange atoms.",
  },
  {
    id: "m2013-chem-8",
    question: "What type of intermolecular forces exist in liquid CCl4?",
    options: [
      "Dipole-dipole attraction",
      "Hydrogen bonding",
      "London dispersion forces",
      "Ion-dipole attraction",
    ],
    correctAnswer: 2,
    explanation: "CCl4 is a nonpolar molecule, so it only exhibits London dispersion forces (also called van der Waals forces).",
  },
  {
    id: "m2013-chem-9",
    question: "One of the following is NOT a common application of silicon",
    options: [
      "in the control of the frequency of television transmissions",
      "in the construction of transistors and microprocessors",
      "in coating iron to prevent it from rusting",
      "in the production of polish body parts cars",
    ],
    correctAnswer: 2,
    explanation: "Silicon is a semiconductor used in electronics (transistors, microprocessors), not for coating iron to prevent rusting (that's typically zinc or paint).",
  },
];
