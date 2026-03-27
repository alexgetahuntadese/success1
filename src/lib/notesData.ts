import { grade9Subjects } from "@/data/grade9Subjects";
import { grade10Subjects } from "@/data/grade10Subjects";
import { grade11Subjects } from "@/data/grade11Subjects";
import { grade12Mathematics } from "@/data/grade12Mathematics";
import { grade12BiologyQuestions } from "@/data/grade12BiologyQuestions";
import { grade12ChemistryQuestions } from "@/data/grade12ChemistryQuestions";
import { grade12PhysicsQuestions } from "@/data/grade12PhysicsQuestions";
import { grade12EnglishQuestions } from "@/data/grade12EnglishQuestions";
import { grade12HistoryQuestions } from "@/data/grade12HistoryQuestions";
import { grade12ITQuestions } from "@/data/grade12ITQuestions";

export interface NotesSubject {
  name: string;
  description: string;
  chapters: string[];
}

export interface NotesGrade {
  grade: number;
  accent: string;
  description: string;
  subjects: NotesSubject[];
}

const grade12GeographyChapters = [
  "Unit 1: Major Geological Processes Associated with Plate Tectonics",
  "Unit 2: Climate Change",
  "Unit 3: Management of Conflict Over Resources",
  "Unit 4: Population Policies, Programs and the Environment",
  "Unit 5: Challenges of Economic Development",
  "Unit 6: Solutions to Environmental and Sustainability Problems",
  "Unit 7: Contemporary Global Geographic Issues and Public Concerns",
  "Unit 8: Geographical Enquiry and Map Making",
];

const grade12AgricultureChapters = [
  "Unit 1: Vegetable Crops Production and Management",
  "Unit 2: Fruit Crops Production and Management",
  "Unit 3: Root and Tuber Crops Production and Management",
  "Unit 4: Coffee, Tea and Spices Production and Management",
  "Unit 5: Introduction to Plant Biotechnology",
  "Unit 6: Beef Cattle Production and Management",
  "Unit 7: Camel Production and Management",
  "Unit 8: Poultry Production and Management",
  "Unit 9: Fishery Production and Management",
  "Unit 10: Beekeeping",
  "Unit 11: Nursery and Plantation Technology",
  "Unit 12: Basics of Agro-Forestry Systems and Practices",
  "Unit 13: Soil and Water Conservation",
  "Unit 14: Gender and Human Nutrition",
  "Unit 15: Safe Food Production and Postharvest Handling",
  "Unit 16: Application of Information and Communication Technologies (ICT) in Agriculture",
];

const grade12EconomicsChapters = [
  "Unit 1: The Fundamental Concepts Of Macroeconomics",
  "Unit 2: Aggregate Demand And Aggregate Supply Analysis",
  "Unit 3: Market Failure And Consumer Protection",
  "Unit 4: Macroeconomic Policy Instruments",
  "Unit 5: Tax Theory And Practice",
  "Unit 6: Poverty And Inequality",
  "Unit 7: Macroeconomic Reforms In Ethiopia",
  "Unit 8: Economy, Environment And Climate Change",
];

const grade12AmharicChapters = [
  "Chapter 1: Language and Society (ቋንቋና ሕብረተሰብ)",
  "Chapter 2: Origin and Development of Amharic (የአማርኛ ቋንቋ አጀማመርና ዕድገት)",
  "Chapter 3: Criticism (ግምገማ)",
  "Chapter 4: Literature (ሥነጽሑፍ)",
  "Chapter 5: Humanity (ሰብዓዊነት)",
  "Chapter 6: Research Writing (ጥናታዊ ጽሑፍ)",
  "Chapter 7: Poetry (ሥነግጥም)",
  "Chapter 8: Reaching a Decision (ውሳኔ ላይ መድረስ)",
  "Chapter 9: Society and Health (ህብረተሰብና ጤና)",
];

const grade12AmharicChaptersClean = [
  "Chapter 1: Language and Society",
  "Chapter 2: Origin and Development of Amharic",
  "Chapter 3: Criticism",
  "Chapter 4: Literature",
  "Chapter 5: Humanity",
  "Chapter 6: Research Writing",
  "Chapter 7: Poetry",
  "Chapter 8: Reaching a Decision",
  "Chapter 9: Society and Health",
];

export const notesByGrade: NotesGrade[] = [
  {
    grade: 9,
    accent: "from-emerald-500 to-teal-500",
    description: "Build strong foundations with concise notes for every subject.",
    subjects: grade9Subjects.map((subject) => ({
      name: subject.name,
      description: subject.description,
      chapters: subject.chapters,
    })),
  },
  {
    grade: 10,
    accent: "from-sky-500 to-cyan-500",
    description: "Strengthen core concepts with chapter-by-chapter revision notes.",
    subjects: grade10Subjects.map((subject) => ({
      name: subject.name,
      description: subject.description,
      chapters: subject.chapters,
    })),
  },
  {
    grade: 11,
    accent: "from-violet-500 to-fuchsia-500",
    description: "Prepare for upper-secondary work with focused chapter guidance.",
    subjects: grade11Subjects.map((subject) => ({
      name: subject.name === "Civics" ? "Civic Education" : subject.name,
      description: subject.description,
      chapters: subject.chapters,
    })),
  },
  {
    grade: 12,
    accent: "from-amber-400 to-orange-500",
    description: "Review exam-facing topics with compact notes across all major subjects.",
    subjects: [
      {
        name: "Mathematics",
        description: "Advanced mathematics including sequences, calculus, vectors, and probability.",
        chapters: Object.keys(grade12Mathematics),
      },
      {
        name: "Biology",
        description: "Biology applications, biotechnology, genetics, evolution, and ecology.",
        chapters: Object.keys(grade12BiologyQuestions),
      },
      {
        name: "Chemistry",
        description: "Acid-base equilibrium, electrochemistry, polymers, and industrial chemistry.",
        chapters: Object.keys(grade12ChemistryQuestions),
      },
      {
        name: "Physics",
        description: "Motion, fluids, electromagnetism, electronics, and modern applications.",
        chapters: Object.keys(grade12PhysicsQuestions),
      },
      {
        name: "English",
        description: "Reading, writing, communication, and thematic language units.",
        chapters: Object.keys(grade12EnglishQuestions),
      },
      {
        name: "Agriculture",
        description: "Kehulum-aligned Grade 12 agriculture units from the new teacher-guide structure.",
        chapters: grade12AgricultureChapters,
      },
      {
        name: "Geography",
        description: "Kehulum-aligned geography units covering plate tectonics, development, sustainability, and GIS.",
        chapters: grade12GeographyChapters,
      },
      {
        name: "History",
        description: "Capitalism, colonial history, world wars, Ethiopia, and Africa since independence.",
        chapters: Object.keys(grade12HistoryQuestions),
      },
      {
        name: "Economics",
        description: "Macroeconomics, policy, tax, poverty, reform, and climate-economy linkages.",
        chapters: grade12EconomicsChapters,
      },
      {
        name: "Amharic",
        description: "Advanced Amharic language, literature, criticism, research writing, and poetry.",
        chapters: grade12AmharicChaptersClean,
      },
      {
        name: "Information Technology",
        description: "Information systems, databases, programming, web authoring, and emerging technologies.",
        chapters: Object.keys(grade12ITQuestions),
      },
    ],
  },
];

export const getNotesGrade = (grade: number) =>
  notesByGrade.find((item) => item.grade === grade);

export const getNotesSubject = (grade: number, subjectName: string) =>
  getNotesGrade(grade)?.subjects.find((subject) => subject.name === subjectName);

const cleanChapterTitle = (chapter: string) =>
  chapter
    .replace(/^Unit\s+\d+:\s*/i, "")
    .replace(/^Chapter\s+\d+:\s*/i, "")
    .trim();

const createDefaultFocusNote = (chapter: string) => {
  const title = cleanChapterTitle(chapter);
  return `Focus on the core ideas, main vocabulary, and real-life applications in ${title.toLowerCase()}.`;
};

export const getFocusNote = (subject: string, chapter: string) => {
  const normalizedSubject = subject.toLowerCase();
  const title = cleanChapterTitle(chapter);
  const normalizedTitle = title.toLowerCase();
  const hasKeyword = (keywords: string[]) =>
    keywords.some((keyword) => normalizedTitle.includes(keyword));

  const sharedRules = [
    { match: ["introduction", "study skills"], note: "Build the foundations first: core concepts, methods, and the basic tools used in this chapter." },
    { match: ["climate"], note: "Track the main causes, patterns, and local examples so you can explain both process and impact clearly." },
    { match: ["population"], note: "Focus on trends, distribution, and how population change affects development, resources, and planning." },
    { match: ["ecology", "environment"], note: "Study the relationships between organisms, resources, and sustainability issues using local examples." },
    { match: ["statistics"], note: "Practice interpreting data, choosing the right method, and explaining what the numbers mean." },
    { match: ["probability"], note: "Focus on event rules, counting logic, and solving problems step by step with clear reasoning." },
    { match: ["technology", "digital"], note: "Understand the key tools, responsible use, and how technology connects to everyday life and learning." },
    { match: ["conflict", "peace"], note: "Pay attention to causes, prevention strategies, and practical ways to build dialogue and cooperation." },
    { match: ["rights", "democracy", "constitution"], note: "Focus on key principles, rights and duties, and how institutions support democratic life." },
  ];

  for (const rule of sharedRules) {
    if (hasKeyword(rule.match)) return rule.note;
  }

  if (normalizedSubject.includes("mathematics")) {
    if (hasKeyword(["set", "number system"])) return "Focus on classification, operations, and the rules that organize number relationships and set notation.";
    if (hasKeyword(["function"])) return "Focus on definitions, graphs, relationships between variables, and how to solve application problems.";
    if (hasKeyword(["equation", "inequalit"])) return "Practice forming expressions, solving accurately, and checking each result against the given condition.";
    if (hasKeyword(["polynomial"])) return "Work on operations, factorization, zeros, and connecting algebraic form to graph behavior.";
    if (hasKeyword(["logarithmic", "exponential"])) return "Master exponent and logarithm rules, graph patterns, and real-life growth or decay questions.";
    if (hasKeyword(["trigon"])) return "Focus on ratios, identities, graphs, and applying trigonometry to measurement problems.";
    if (hasKeyword(["geometry", "circle", "polygon", "solid", "plane", "transform"])) return "Track the main properties, formulas, and diagram reasoning used to solve geometric problems.";
    if (hasKeyword(["vector"])) return "Practice direction, magnitude, and vector operations carefully, especially in diagram-based questions.";
    if (hasKeyword(["matrix", "determinant"])) return "Focus on matrix operations, determinants, and how they are used to solve systems and transformations.";
    if (hasKeyword(["sequence", "series"])) return "Focus on recognizing patterns, deriving nth terms, and using sums in practical contexts.";
    if (hasKeyword(["statistics", "probability"])) return "Practice data handling, event reasoning, and choosing the correct method for each problem type.";
    if (hasKeyword(["calculus"])) return "Study limits, change, and the meaning of derivatives or integrals before moving to heavy computation.";
    if (hasKeyword(["linear programming", "business"])) return "Focus on model building, constraints, and interpreting answers in real decision-making situations.";
  }

  if (normalizedSubject.includes("biology")) {
    if (hasKeyword(["cell", "enzyme", "biochemical"])) return "Focus on structure and function at the cell level, and how biological molecules support life processes.";
    if (hasKeyword(["reproduction", "genetics"])) return "Track key processes, stages, and inheritance ideas, then connect them to health and continuity of life.";
    if (hasKeyword(["health", "disease", "human body", "nutrition"])) return "Study body systems, prevention, and the links between nutrition, health choices, and disease control.";
    if (hasKeyword(["classification", "organisms", "animals", "plants"])) return "Focus on characteristics, grouping rules, and how structure helps organisms survive and reproduce.";
    if (hasKeyword(["biology and technology", "sub-fields", "biotechnology", "application"])) return "Pay attention to how biology is used in agriculture, medicine, and technology, especially through Ethiopian examples.";
    if (hasKeyword(["evolution", "population", "ecology", "ecological"])) return "Focus on change over time, adaptation, and how populations interact with resources and environments.";
  }

  if (normalizedSubject.includes("chemistry")) {
    if (hasKeyword(["importance", "scientific methods", "measurement"])) return "Focus on chemistry in daily life, accurate measurement, and the scientific habits used in investigation.";
    if (hasKeyword(["atomic", "periodic"])) return "Focus on atomic models, particle structure, electron arrangement, and periodic trends.";
    if (hasKeyword(["bond"])) return "Study how and why atoms bond, the types of bonds formed, and how structure affects properties.";
    if (hasKeyword(["state of matter", "solution", "inorganic compound"])) return "Track particle behavior, concentration, and how composition affects chemical and physical properties.";
    if (hasKeyword(["kinetics", "equilibrium"])) return "Focus on reaction rate, reversible change, and the conditions that shift chemical balance.";
    if (hasKeyword(["electro", "energy changes"])) return "Pay attention to energy transfer, electron transfer, cells, and electrolysis in chemical systems.";
    if (hasKeyword(["organic", "hydrocarbon", "polymer", "oxygen-containing"])) return "Study structure, naming patterns, reactions, and everyday uses of carbon compounds.";
    if (hasKeyword(["stoichiometry", "reaction", "metal", "non metal"])) return "Practice balancing, mole relationships, and linking chemical behavior to substance classification.";
  }

  if (normalizedSubject.includes("physics")) {
    if (hasKeyword(["human society", "physical quantities", "vector"])) return "Build the basics first: measurement, vectors, units, and how physics helps explain everyday systems.";
    if (hasKeyword(["motion", "mechanics", "equilibrium", "force", "work", "energy", "power", "machine"])) return "Focus on describing motion, using equations correctly, and linking force ideas to real movement.";
    if (hasKeyword(["wave", "sound", "optics", "electromagnetic waves"])) return "Track wave behavior, key quantities, and how light or sound principles explain everyday phenomena.";
    if (hasKeyword(["heat", "thermo", "temperature", "thermometer"])) return "Focus on energy transfer, temperature, and the laws that explain thermal processes.";
    if (hasKeyword(["electric", "magnet"])) return "Study fields, circuits, and interactions carefully, then practice applying formulas to practical setups.";
    if (hasKeyword(["fluid"])) return "Focus on pressure, buoyancy, flow ideas, and how fluid principles appear in natural and engineered systems.";
    if (hasKeyword(["electronics", "modern"])) return "Pay attention to components, modern applications, and the principles behind newer physical technologies.";
  }

  if (normalizedSubject.includes("english")) {
    if (hasKeyword(["traffic", "road"])) return "Focus on the main message, safety vocabulary, and how to discuss causes, evidence, and solutions clearly.";
    if (hasKeyword(["internet", "digital", "artificial intelligence", "robotics", "telemedicine"])) return "Track the main ideas, key vocabulary, and how technology themes are explained, discussed, and evaluated in writing.";
    if (hasKeyword(["national", "patriotism", "national pride", "identity"])) return "Focus on theme, persuasive language, and how to express values, identity, and supporting reasons clearly.";
    if (hasKeyword(["disease", "health", "health services"])) return "Pay attention to topic vocabulary, cause-and-effect language, and how to summarize health-related information clearly.";
    if (hasKeyword(["conflict", "resolution"])) return "Focus on the message, useful discussion vocabulary, and how to present balanced solutions in speech and writing.";
    return "Focus on the main reading theme, key vocabulary, and how to express ideas clearly in speaking and writing tasks.";
  }

  if (normalizedSubject.includes("amharic")) {
    if (normalizedTitle.includes("(")) return "Focus on the central theme, key vocabulary, and how to explain the text clearly in spoken and written Amharic.";
    return "Practice grammar, comprehension, and written expression while connecting the chapter theme to culture and daily life.";
  }

  if (normalizedSubject.includes("geography")) {
    if (hasKeyword(["geological", "land-forms", "formation of the continents", "topography"])) return "Focus on landform processes, major physical features, and how the Earth’s surface has developed over time.";
    if (hasKeyword(["map", "geo-spatial", "enquiry", "data processing"])) return "Practice map skills, data interpretation, and how to present geographic information accurately.";
    if (hasKeyword(["resource", "development", "economic and cultural activities"])) return "Focus on resource use, economic activity, and the trade-offs between growth and sustainability.";
    if (hasKeyword(["population", "demographic"])) return "Track distribution, movement, and the opportunities and challenges created by population change.";
    if (hasKeyword(["environmental", "natural environment interactions", "public concerns"])) return "Focus on human-environment links, current challenges, and practical responses at local and global scale.";
    return "Track place-based patterns, causes, and impacts, using Ethiopian examples whenever possible.";
  }

  if (normalizedSubject.includes("history")) {
    if (hasKeyword(["human evolution", "historiography", "discipline of history"])) return "Focus on how history is studied, the evidence historians use, and the big stages of early human development.";
    if (hasKeyword(["ancient world civilizations", "middle ages", "early modern", "age of revolutions"])) return "Track major turning points, the forces behind change, and the longer-term impact on societies and states.";
    if (hasKeyword(["ethiopia", "horn", "africa", "colonial", "world wars", "post-1991", "since 1945"])) return "Focus on major events, causes, consequences, and how historical change connects Ethiopia, Africa, and the wider world.";
    if (hasKeyword(["indigenous knowledge", "heritage"])) return "Focus on local knowledge systems, why they matter historically, and how they connect culture to identity.";
    return "Focus on major events, causes, consequences, and how historical change connects Ethiopia, Africa, and the wider world.";
  }

  if (normalizedSubject.includes("civic") || normalizedSubject.includes("citizenship")) {
    if (hasKeyword(["ethical", "ethics", "patriotism", "values"])) return "Focus on values, ethical behavior, and how personal character connects to community responsibility.";
    if (hasKeyword(["digital", "globalization"])) return "Track rights, responsibilities, and how civic choices apply in digital life and global citizenship.";
    if (hasKeyword(["constitution", "constitutionalism", "federalism", "democratic system", "democratization"])) return "Focus on state structure, democratic principles, and how constitutions guide citizenship and government.";
    if (hasKeyword(["human rights", "democratic rights", "economic rights"])) return "Focus on rights, duties, and how legal protection and civic action work together in society.";
    if (hasKeyword(["governance", "foreign relations", "peace", "conflict", "gender equality", "national unity"])) return "Pay attention to participation, fairness, and how civic principles help solve national and community challenges.";
    return "Focus on values, citizenship duties, and applying civic ideas to digital life, community issues, and national development.";
  }

  if (normalizedSubject.includes("economics")) {
    if (hasKeyword(["consumer", "demand", "supply", "market structure"])) return "Track how choice, incentives, and market forces shape prices, production, and competition.";
    if (hasKeyword(["production", "cost", "resource"])) return "Focus on inputs, efficiency, and how producers combine resources to make output decisions.";
    if (hasKeyword(["money", "banking", "finance", "saving", "investment"])) return "Focus on the role of money, financial institutions, and how saving or investment supports growth.";
    if (hasKeyword(["macroeconomics", "national income", "growth", "development"])) return "Track the big-picture indicators of economic performance and what drives development outcomes.";
    if (hasKeyword(["ethiopian economy", "sectorial policies", "trade"])) return "Connect the theory to Ethiopia by focusing on sectors, policy choices, and external trade links.";
    if (hasKeyword(["entrepreneurship", "startup", "innovation"])) return "Focus on enterprise skills, business planning, and how innovation creates economic opportunity.";
    return "Track definitions, market relationships, and how each topic explains decisions, growth, and the Ethiopian economy.";
  }

  if (normalizedSubject.includes("agriculture")) {
    if (hasKeyword(["crop", "field crops", "industrial crops"])) return "Focus on production steps, field management, and the conditions that improve yield and crop quality.";
    if (hasKeyword(["farm animals", "feeds", "breeding", "housing", "health", "dairy"])) return "Track animal care, feeding, breeding, and disease control as practical systems for better productivity.";
    if (hasKeyword(["natural resources", "biodiversity", "climate change"])) return "Focus on conservation, adaptation, and the role of agriculture in protecting natural systems.";
    if (hasKeyword(["mechanized farming"])) return "Focus on farm machinery, efficiency, and how technology improves agricultural work and scale.";
    if (hasKeyword(["nutrition", "food production"])) return "Connect agriculture to diet, food quality, and sustainable consumption at household and community level.";
    return "Focus on practical production methods, resource management, and the science behind sustainable farming decisions.";
  }

  if (normalizedSubject.includes("information technology")) {
    if (hasKeyword(["information systems", "applications"])) return "Focus on how digital systems solve real problems in education, business, government, and daily communication.";
    if (hasKeyword(["emerging technologies"])) return "Track new digital trends, their uses, and the opportunities and risks they create for society.";
    if (hasKeyword(["database"])) return "Focus on organizing data, designing simple structures, and understanding how information is stored and retrieved.";
    if (hasKeyword(["web authoring"])) return "Practice the structure of web pages, design choices, and how content is built for users online.";
    if (hasKeyword(["maintenance", "troubleshooting"])) return "Focus on diagnosis, safe maintenance habits, and step-by-step problem solving for computer systems.";
    if (hasKeyword(["programming"])) return "Track logic, algorithms, and the habit of breaking a problem into small, testable steps.";
    return "Focus on digital tools, system concepts, and hands-on skills that connect classroom knowledge to real computing tasks.";
  }

  return createDefaultFocusNote(chapter);
};
