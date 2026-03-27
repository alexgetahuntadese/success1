import fs from "node:fs";
import path from "node:path";

const htmlDir = path.join(process.cwd(), "tmp", "bio2014html");

const ANSWER_KEY = {
  1: [0, "Bacterial cell walls are distinguished by their peptidoglycan-based chemical composition."],
  2: [3, "Thiobacillus oxidizes hydrogen sulphide and helps return sulphate to the soil."],
  3: [1, "Salmonellosis is a classic food-poisoning disease caused by bacteria."],
  4: [1, "In the lysogenic cycle, viral DNA becomes integrated into the host DNA."],
  5: [2, "Viruses are obligate intracellular parasites and cannot reproduce independently."],
  6: [0, "Vaccines stimulate the immune system so it can respond rapidly to the real pathogen."],
  7: [1, "If no agglutination occurs with O, A, B, or AB, the unknown sample is group O."],
  8: [1, "Chancroid produces genital ulcers, and ulcerative STIs strongly increase the risk of HIV transmission."],
  9: [3, "Pasteurization uses mild heat that kills many microbes but not all of them."],
  10: [2, "In binomial nomenclature the genus starts with a capital letter and the species name is lower-case."],
  11: [0, "Gas exchange happens because oxygen and carbon dioxide diffuse down their concentration gradients."],
  12: [3, "Regular exercise improves respiratory efficiency and makes breathing more effective."],
  13: [2, "Red blood cells transport oxygen, white blood cells fight disease, and platelets help clotting."],
  14: [2, "Backflow from the ventricles to the atria occurs when the valves are damaged."],
  15: [1, "Capillaries are specialized for exchange of gases, nutrients, and wastes."],
  16: [3, "Light is refracted mainly at the cornea and then again at the lens."],
  17: [0, "Student 1 controls vision and varies smell, which is the key factor in the experiment."],
  18: [3, "Short-sightedness happens when the eye focuses too early, so a concave lens is used to diverge light."],
  19: [2, "Weight loss, sweating, and irritability are typical signs of excess thyroid activity."],
  20: [2, "Endocrine glands are ductless, so their secretions must be recognized by specific target cells."],
  21: [0, "Cold sores are caused by herpes simplex virus, which is a DNA virus."],
  22: [3, "Recycling reduces resource depletion and also lowers waste accumulation."],
  23: [2, "Rhizobium fixes atmospheric nitrogen in association with plant roots."],
  24: [0, "Pioneer species modify the habitat and make it more suitable for later communities."],
  25: [1, "The boreal forest is dominated by coniferous trees."],
  26: [0, "Plant hormones regulate growth and development, but seed dispersal is not mainly hormone-controlled."],
  27: [1, "Removing the shoot tip removes auxin's inhibitory effect on lateral buds, so the plant becomes bushy."],
  28: [1, "Those actions are all standard methods of biodiversity conservation."],
  29: [0, "Mango is not endemic to Ethiopia, unlike the native Ethiopian examples listed."],
  30: [2, "Mago National Park is known for wildlife such as elephant, lion, cheetah, and giraffe."],
  31: [1, "Coelenterates use stinging cells on their tentacles to capture prey."],
  32: [0, "Bryophytes lack true roots and vascular tissue."],
  33: [3, "Sea lions are the top consumers in the listed aquatic biomass pyramid."],
  34: [3, "A waxy cuticle reduces evaporation from leaf surfaces."],
  35: [0, "Large body size reduces heat loss by lowering the surface-area-to-volume ratio."],
  36: [2, "The biodiversity institute focuses on biological resources, not general soil conservation."],
  37: [1, "Stains mainly improve contrast so structures can be seen more clearly."],
  38: [3, "The liver provides bile for fat digestion, so liver malfunction reduces fat digestion."],
  39: [2, "In the stomach, proteins are digested by pepsin; this is the closest correct sequence in the choices."],
  40: [2, "Pulling down the rubber sheet models contraction of the diaphragm during inhalation."],
  41: [1, "Condensation of glycerol with three fatty acids forms ester bonds in a triglyceride."],
  42: [2, "The hydrophilic phosphate heads face the surrounding water."],
  43: [0, "Student B is using the emulsion test, which is the standard test for lipids."],
  44: [2, "Niacin is the vitamin precursor used to form the coenzyme NAD."],
  45: [1, "Oxidoreductases transfer hydrogen and oxygen, isomerases rearrange molecules, and ligases join molecules."],
  46: [1, "The proton gradient for ATP synthase is generated during oxidation of NADH and FADH2."],
  47: [0, "Fermentation begins when oxygen supply becomes insufficient during exercise."],
  48: [3, "In anaerobic animal cells, pyruvate is reduced to lactate."],
  49: [0, "The link reaction converts pyruvate into acetyl coenzyme A."],
  50: [1, "Neo-Darwinism combines natural selection with modern genetics."],
  51: [0, "Australopithecus afarensis is important evidence that bipedalism evolved before large brains."],
  52: [0, "Instinctive behavior is inherited and common to members of the species."],
  53: [1, "Latent learning is knowledge gained without immediate reward, such as learning the surroundings of a burrow."],
  54: [3, "A coenzyme combines with the enzyme protein part to produce catalytic activity."],
  55: [3, "Innate behavior is genetically determined, functional on first attempt, and usually not modified; learned behavior can be modified by experience."],
  56: [3, "Caring for offspring that are not one's own is a form of social behavior."],
  57: [0, "Bonds are weakened in the enzyme-substrate intermediate complex."],
  58: [3, "In the induced-fit model, the enzyme strains the substrate and helps it react."],
  59: [3, "Extreme temperature and pH can denature enzymes by disrupting their tertiary structure."],
  60: [1, "The carbon dioxide from yeast makes injera porous and gives it its typical texture."],
  61: [2, "Neurons communicate across the synapse using neurotransmitters."],
  62: [2, "Stimulation depolarizes the membrane so the inside becomes positive."],
  63: [3, "The patellar reflex is shown by tapping below the knee cap and observing the lower leg jerk upward."],
  64: [1, "One extreme phenotype is favored, so this is directional selection."],
  65: [3, "The label points to the cochlea, the snail-shaped hearing organ of the inner ear."],
  66: [2, "A core part of cell theory is that new cells arise from pre-existing cells by division."],
  67: [1, "Leukemia is classically associated with chromosomal translocation, so the corrected option is translocation."],
  68: [2, "The eternity theory states that life has always existed and has no beginning or end."],
  69: [1, "Paleontological evidence comes from fossil traces of organisms from the remote past."],
  70: [3, "Light-dependent reactions occur on the thylakoid or grana membranes, while light-independent reactions occur in the stroma."],
  71: [2, "A color-blind daughter must inherit the recessive allele from both parents, so the father must be color blind and the mother at least a carrier."],
  72: [1, "Stem cuttings are asexual reproduction, so the new plants are genetically identical clones."],
  73: [2, "During DNA replication, DNA polymerase builds a new strand using the parent strand as a template."],
  74: [0, "The genetic code is degenerate because multiple triplets can code for the same amino acid."],
  75: [0, "UGA is a stop codon, so translation terminates when it reaches the ribosome."],
  76: [2, "Menstruation happens when progesterone and estrogen levels fall."],
  77: [2, "The first incubation period is commonly described as 3 to 12 weeks with mild early symptoms."],
  78: [1, "Licking is a behavioral way of increasing heat loss by evaporation."],
  79: [1, "If blood water content is high, ADH secretion decreases so less water is reabsorbed."],
  80: [0, "Water rises mainly by transpiration pull, with losses replaced by osmosis at the roots."],
  81: [1, "A scientific report normally proceeds from title and hypothesis through prediction, method, results, conclusion, and evaluation."],
  82: [2, "A centrifuge separates materials by centrifugal force."],
  83: [2, "The first scientific step is to ask the question and identify the problem to investigate."],
  84: [0, "Water's suitable viscosity helps it function as an effective transport medium."],
  85: [1, "Water's high latent heat of vaporization slows evaporation and helps ponds persist."],
  86: [1, "ATP production from carbohydrates happens mainly in respiration organelles, not as a direct plasma-membrane function in eukaryotes."],
  87: [0, "Integral proteins are embedded in the lipid bilayer."],
  88: [1, "The corrected entries are circular DNA in prokaryotes, mitochondria present in eukaryotes, and 70S ribosomes in prokaryotes."],
  89: [3, "The cylinder in 25% sucrose loses the most water and becomes the most flaccid."],
  90: [3, "Red cells shrink in hypertonic solution, burst in hypotonic solution, and show no change in isotonic solution."],
  91: [0, "Biodiversity includes species richness together with ecological and genetic variation."],
  92: [3, "At the stationary phase, natality and mortality are approximately equal."],
  93: [1, "Intraspecific competition occurs among members of the same species for the same resources."],
  94: [3, "Drosophila is ideal partly because it has a very short life cycle, making genetic studies rapid."],
  95: [0, "Meiosis creates variation through independent assortment and crossing over."],
  96: [1, "At high temperature in C3 plants, rubisco can bind oxygen and start photorespiration."],
  97: [3, "During the Calvin cycle, GP is reduced to TP using reduced NADP."],
  98: [1, "Photosystem pigments pass excited electrons into the electron transport chain."],
  99: [2, "In CAM plants, carbon dioxide enters the Calvin cycle during the day after being released from stored organic acids."],
};

const QUESTION_FIXES = {
  67: {
    options: [
      "Duplication",
      "Translocation",
      "Inversion",
      "Deletion",
    ],
  },
  73: {
    options: [
      "DNA helicase transports nucleotides that are used to build the new DNA.",
      "the base sequence in the new DNA will be slightly changed from the parent DNA.",
      "DNA polymerase assembles new nucleotides into a new strand using the parent DNA as a template.",
      "the parent DNA will become different from the daughter DNA.",
    ],
  },
  88: {
    question: "The following table compares prokaryotes and eukaryotes.\nFeature\nProkaryotes\nEukaryotes\nDNA\nCircular\nLinear\nMitochondria\nAbsent\nPresent\nRibosomes\nPresent (70S)\nPresent (80S)\nCell membrane\nPresent\nPresent\nIn the above table, the correct entries for prokaryotic DNA, eukaryotic mitochondria, and prokaryotic ribosomes are respectively:",
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
    const questionMatch = block.match(/<div class='isQuesion w-100 mt-2'>([\s\S]*?)<\/div>\s*<\/div>/i);
    if (!questionMatch) continue;

    const questionImages = [...block.matchAll(/<img src="(https:\/\/kehulum\.com\/queimgs\/files\/[^"]+)"[^>]*>/gi)]
      .map((match) => `[Image: ${match[1]}]`);

    let question = cleanHtml(questionMatch[1]);
    if (questionImages.length > 0) {
      question = `${question}\n${questionImages.join("\n")}`;
    }

    const options = [];
    const optionRegex = /<p\s+class='cho-inner\s*'>([\s\S]*?)<\/p>/gi;
    let optionMatch;
    while ((optionMatch = optionRegex.exec(block)) && options.length < 4) {
      let optionHtml = optionMatch[1];
      optionHtml = optionHtml.replace(/<span class='choice-letter-lables\s*'>[A-D]<\/span>/i, "");

      const optionImages = [...optionHtml.matchAll(/<img src="(https:\/\/kehulum\.com\/queimgs\/files\/[^"]+)"[^>]*>/gi)]
        .map((match) => `[Image: ${match[1]}]`);

      let option = cleanHtml(optionHtml);
      if (optionImages.length > 0) {
        option = `${option} ${optionImages.join(" ")}`.trim();
      }

      options.push(option);
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
  "export const matric2014BiologyQuestions: MatricExamQuestion[] = [",
];

questions.forEach((item) => {
  const fixedItem = {
    ...item,
    ...(QUESTION_FIXES[item.number] ?? {}),
  };
  const answer = ANSWER_KEY[item.number] ?? [-1, "No explanation was provided in the source."];

  lines.push("  {");
  lines.push(`    id: "m2014-bio-${item.number}",`);
  lines.push(`    question: ${JSON.stringify(fixedItem.question)},`);
  lines.push("    options: [");
  fixedItem.options.forEach((option) => {
    lines.push(`      ${JSON.stringify(option)},`);
  });
  lines.push("    ],");
  lines.push(`    correctAnswer: ${answer[0]},`);
  lines.push(`    explanation: ${JSON.stringify(answer[1])},`);
  lines.push("  },");
});

lines.push("];");
lines.push("");

fs.writeFileSync(
  path.join(process.cwd(), "src", "data", "matric2014BiologyQuestions.ts"),
  `${lines.join("\n")}\n`,
);

console.log(`Wrote ${questions.length} questions.`);
