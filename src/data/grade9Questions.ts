import { grade9Subjects } from "./grade9Subjects";

export interface Grade9Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  example: string;
  difficulty: "Easy" | "Medium" | "Hard";
  chapter: string;
  subject: string;
}

type Descriptor = {
  concept: string;
  skill: string;
  application: string;
  evidence: string;
  misconception: string;
  tool: string;
};

const cleanTitle = (chapter: string) =>
  chapter
    .replace(/^Unit\s+\d+:\s*/i, "")
    .replace(/^Chapter\s+\d+:\s*/i, "")
    .replace(/^ምዕራፍ\s*[^:]+:\s*/i, "")
    .trim();

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const rotate = (items: string[], seed: number) => {
  const shift = seed % items.length;
  return [...items.slice(shift), ...items.slice(0, shift)];
};

const makeOptions = (correct: string, distractors: string[], seed: number) =>
  rotate([correct, ...distractors.filter((item) => item !== correct)].slice(0, 4), seed);

const inferDescriptor = (subject: string, chapter: string): Descriptor => {
  const title = cleanTitle(chapter).toLowerCase();

  const pick = (
    concept: string,
    skill: string,
    application: string,
    evidence: string,
    misconception: string,
    tool: string,
  ): Descriptor => ({ concept, skill, application, evidence, misconception, tool });

  if (subject === "Mathematics") {
    if (title.includes("set")) return pick("set notation and operations", "classify and compare grouped items", "organizing information with Venn diagrams", "symbols, sets, and worked examples", "confusing union with intersection", "Venn diagrams");
    if (title.includes("number")) return pick("number systems and numerical relationships", "compare and operate on numbers accurately", "estimating and reasoning with quantities", "number lines and examples", "treating all number types as identical", "number lines");
    if (title.includes("equation")) return pick("solving equations with inverse operations", "find unknown values step by step", "working out missing quantities", "balanced algebraic steps", "changing one side without balancing the other", "worked solutions");
    if (title.includes("inequalit")) return pick("solving and interpreting inequalities", "reason about solution sets", "describing limits and allowed values", "sign rules and number-line models", "forgetting to reverse the sign after multiplying by a negative", "number lines");
    if (title.includes("trigon")) return pick("trigonometric ratios in right triangles", "relate sides to angles", "measuring heights and distances", "triangle diagrams and ratio work", "mixing up opposite and adjacent sides", "triangle diagrams");
    if (title.includes("polygon")) return pick("regular polygon properties", "analyze angles and symmetry", "recognizing shape patterns in designs", "geometric diagrams and formulas", "assuming all polygons are regular", "shape diagrams");
    if (title.includes("similarity") || title.includes("congru")) return pick("congruence and similarity", "compare shapes by size and angle relationships", "scaling and matching shapes", "labeled figures and proportions", "treating similar shapes as congruent", "diagram markings");
    if (title.includes("vector")) return pick("vectors as magnitude and direction", "represent directed quantities clearly", "describing displacement and force", "vector arrows and examples", "ignoring direction", "vector sketches");
    return pick("statistics and probability", "interpret data and chance", "reading graphs and predicting outcomes", "tables, graphs, and simple events", "treating probability as certainty", "graphs");
  }

  if (subject === "Physics") {
    if (title.includes("society")) return pick("physics in daily life and society", "connect science to technology", "explaining how physics helps people", "local technology examples", "thinking physics is only theory", "case studies");
    if (title.includes("quantit")) return pick("measurement and physical quantities", "use correct units and instruments", "recording observations accurately", "SI units and measurements", "mixing units", "measuring instruments");
    if (title.includes("motion")) return pick("straight-line motion", "relate distance, speed, and time", "analyzing journeys and movement", "graphs and motion formulas", "confusing speed with acceleration", "motion graphs");
    if (title.includes("force") || title.includes("energy")) return pick("force, work, and energy", "connect force to movement", "explaining lifting, pushing, and motion", "force diagrams and examples", "thinking work happens whenever force exists", "force diagrams");
    if (title.includes("machine")) return pick("simple machines and mechanical advantage", "explain how machines reduce effort", "using levers and pulleys", "machine diagrams and examples", "thinking machines remove all work", "machine models");
    if (title.includes("sound") || title.includes("oscillation")) return pick("sound and oscillation", "describe vibration and wave behavior", "explaining music and communication", "wave examples and diagrams", "confusing loudness with pitch", "wave diagrams");
    return pick("temperature and thermometry", "measure and compare thermal states", "reading thermometers and explaining heat effects", "temperature scales and readings", "treating heat and temperature as the same", "thermometers");
  }

  if (subject === "Chemistry") {
    if (title.includes("importance")) return pick("chemistry in everyday life", "identify chemical change around us", "linking chemistry to materials and health", "daily-life chemical examples", "thinking chemistry only belongs in labs", "material samples");
    if (title.includes("measurement") || title.includes("scientific")) return pick("measurement and scientific method", "plan accurate chemical investigations", "taking careful observations in experiments", "units, apparatus, and procedure steps", "ignoring accuracy", "lab procedures");
    if (title.includes("atom")) return pick("atomic structure", "describe particles inside atoms", "explaining why substances differ", "particle models and diagrams", "treating atoms as solid unchanging balls", "particle diagrams");
    if (title.includes("periodic")) return pick("periodic classification", "group elements by similar properties", "using the periodic table to predict behavior", "groups, periods, and examples", "assuming nearby elements are identical", "periodic table");
    return pick("chemical bonding", "explain why atoms join", "connecting bond type to material properties", "electron arrangements and compounds", "thinking atoms bond randomly", "electron-dot models");
  }

  if (subject === "Biology") {
    if (title.includes("classification") || title.includes("organisms")) return pick("classification of living organisms", "group organisms by their features", "identifying living things in the environment", "traits, examples, and tables", "grouping only by appearance", "classification charts");
    if (title.includes("cell")) return pick("cells as the basic unit of life", "link structure to function", "explaining growth and repair", "cell diagrams and organelles", "thinking all cells are identical", "cell diagrams");
    if (title.includes("reproduction")) return pick("reproduction and continuity of life", "explain how organisms produce offspring", "understanding life cycles and heredity", "reproductive processes and examples", "confusing reproduction with growth", "life-cycle charts");
    if (title.includes("health") || title.includes("nutrition") || title.includes("disease")) return pick("human health, nutrition, and disease prevention", "connect body needs to healthy living", "making informed health choices", "food groups and prevention examples", "thinking medicine alone creates health", "health charts");
    if (title.includes("ecology")) return pick("ecology and environmental relationships", "explain how organisms interact with surroundings", "understanding ecosystems and conservation", "food chains and habitat examples", "seeing organisms as isolated", "ecosystem diagrams");
    return pick("biology as the study of life", "describe what biology explains", "connecting life science to health and environment", "examples from living organisms", "thinking biology is only about animals", "observation tasks");
  }

  if (subject === "English") {
    if (title.includes("study")) return pick("study skills in English", "use reading and note-taking strategies", "improving school learning habits", "notes, summaries, and text analysis", "thinking studying means rereading only", "study plans");
    if (title.includes("traffic")) return pick("traffic accidents and safety language", "discuss causes and prevention clearly", "sharing road-safety ideas", "cause-effect language and examples", "describing accidents without discussing prevention", "discussion prompts");
    if (title.includes("park")) return pick("national parks and conservation themes", "describe nature and protected areas", "talking about wildlife and tourism", "descriptive vocabulary and passages", "treating parks only as recreation spaces", "reading passages");
    if (title.includes("horticulture")) return pick("horticulture and plant-based livelihoods", "read and write about production and farming", "describing crops and gardens", "topic vocabulary and informational texts", "treating horticulture as decoration only", "topic vocabulary");
    if (title.includes("poverty")) return pick("poverty and social issues", "express causes, effects, and solutions", "writing about development challenges", "opinion writing and examples", "listing problems without analysis", "paragraph outlines");
    if (title.includes("community")) return pick("community service and responsibility", "describe support and cooperation", "talking about service projects", "dialogues and reports", "seeing service as unimportant", "report writing");
    if (title.includes("disease")) return pick("communicable diseases and prevention messages", "use health vocabulary in context", "sharing advice about public health", "health texts and warnings", "treating prevention as optional", "awareness posters");
    if (title.includes("equity")) return pick("fairness and equity", "express balanced opinions on justice", "discussing equal treatment in society", "discussion prompts and persuasive language", "confusing fairness with identical treatment", "debate notes");
    if (title.includes("internet")) return pick("the internet and digital communication", "analyze benefits and risks of online life", "talking about technology in society", "technology texts and vocabulary", "seeing the internet as only entertainment", "ICT vocabulary");
    return pick("urban life and city experiences", "read and discuss community life clearly", "describing services and opportunities in towns", "theme vocabulary and reading passages", "memorizing vocabulary without using it", "reading passages");
  }

  if (subject === "Amharic") {
    if (title.includes("ቋንቋ")) return pick("የአማርኛ ቋንቋ አወቃቀርና አጠቃቀም", "ሀሳብ በቋንቋ እንዴት እንደሚገለጽ በአውድ መተንተን", "ቃላትንና ዓረፍተ ነገሮችን በትክክል በንግግርና በጽሑፍ መጠቀም", "ጽሑፎች፣ ሰዋሰው እና አውዳዊ ምሳሌዎች", "የቋንቋ ትምህርትን የተነጠሉ ቃላት ማስታወስ ብቻ መሆኑን መመልከት", "ንባብና ጽሑፍ ልምምድ");
    if (title.includes("ሥራ")) return pick("በሥራ እና በትጋት ዙሪያ የሚያተኩር ቋንቋ", "ጽሑፎች ሥራን፣ ኃላፊነትንና አስተዋጽኦን እንዴት እንደሚያቀርቡ መተንተን", "በአማርኛ የሥራ ባህልና ማህበራዊ ኃላፊነትን መግለጽ", "አጫጭር ጽሑፎች፣ ቃላት እና ተግባራዊ ጽሑፍ", "ምዕራፉን የሥራ ስሞች ዝርዝር ብቻ መመልከት", "መመሪያ ያለው ድርሰት");
    if (title.includes("ማዕድን")) return pick("ስለ ማዕድንና የተፈጥሮ ሀብት የሚናገሩ የአማርኛ ጽሑፎች", "ቋንቋ ሀብትን፣ ማውጣትንና ማህበራዊ ተፅእኖን እንዴት እንደሚያብራራ መተንተን", "ልማትንና የሀብት አጠቃቀምን በግልጽ አማርኛ መወያየት", "መረጃ ሰጪ ጽሑፎችና ርእሰ ጉዳይ ቃላት", "ጉዳዩን ሳይረዱ በቃላት ላይ ብቻ ማተኮር", "የርእስ ጉዳይ ንባብ");
    if (title.includes("ልቦለድ")) return pick("የልቦለድ ጥናት", "ገጸ ባህሪ፣ ጭብጥና ተረት አቀራረብን መተንተን", "ሥነ ጽሑፋዊ ጽሑፎችን መተርጎም", "የተረት አወቃቀርና ምሳሌዎች", "ትርጓሜ ሳይሰጥ ተረቱን ብቻ መድገም", "ሥነ ጽሑፍ ትንተና");
    if (title.includes("ቃላዊ")) return pick("የቃላዊ ሥነ ጽሑፍ ጥናት", "ምሳሌዎችን፣ ተረቶችንና የአፍ ሥነ ጽሑፍ አቀራረብን በአውድ መተንተን", "የቃል ሥነ ጽሑፍን ከባህልና ከዕለት ተዕለት ሕይወት ጋር ማገናኘት", "ምሳሌዎች፣ ተረቶችና የአቀራረብ ምሳሌዎች", "የቃላዊ ሥነ ጽሑፍን ትርጉም የሌለው መዝናኛ ብቻ ማየት", "የአፍ ጽሑፍ ትንተና");
    if (title.includes("ግጥም")) return pick("የግጥም ጥናት", "ምስልና ጭብጥን መተርጎም", "ለግጥሞች በአስተዋይነት ምላሽ መስጠት", "ዘይቤያዊ አገላለጽና የስንኝ ትንተና", "ግጥምን ቀጥተኛ ትርጉም ብቻ በመስጠት መንበብ", "የግጥም ትንተና");
    if (title.includes("ድራማ")) return pick("የድራማ እና የትዕይንት ጥናት", "ውይይትና ግጭትን መተንተን", "የመድረክ እንቅስቃሴንና ሚናን መረዳት", "ትዕይንት ምሳሌዎችና ስክሪፕቶች", "ድራማን እንደ ተራ ትረካ ማንበብ", "የስክሪፕት ጥናት");
    if (title.includes("ማህበራዊ ሚዲያ") || title.includes("ተግባቦት")) return pick("ማህበራዊ ሚዲያና ተግባቦት", "ቋንቋን በዲጂታል አውድ በኃላፊነት መጠቀም", "በመስመር ላይ መድረኮች ላይ ሥነ ምግባራዊ መልዕክት መላክ", "የመልዕክት ምሳሌዎችና የተቀባይ ግንዛቤ", "የመስመር ላይ ቋንቋ አጠቃቀም ተፅእኖ የለውም ብሎ መመልከት", "ዲጂታል ጽሑፎች");
    if (title.includes("ኮቪድ") || title.includes("ኮሮና")) return pick("የጤና መረጃ አቀራረብ በአማርኛ", "ግልጽ የህዝብ ግንዛቤ መልዕክቶችን ማቅረብ", "መከላከልንና እንክብካቤን መግለጽ", "የጤና ማስጠንቀቂያዎችና ምሳሌዎች", "የህዝብ ግንዛቤ መልዕክትን ከቋንቋ ትምህርት ውጭ መቆጠር", "መረጃ ሰጪ ጽሑፎች");
    return pick(`${cleanTitle(chapter)} በአማርኛ`, "ቋንቋንና አገላለጽን በአውድ መተርጎም", "የቋንቋ ትምህርትን ከማህበራዊ ሕይወት ጋር ማገናኘት", "ጽሑፎች፣ ቃላትና ምሳሌዎች", "የቋንቋ ትምህርትን ማስታወስ ብቻ እንደሆነ መመልከት", "ንባብና ጽሑፍ ልምምድ");
  }

  if (subject === "Geography") {
    if (title.includes("topography") || title.includes("geological")) return pick("Ethiopia's landforms and geological history", "describe major physical features", "explaining mountains, valleys, and rift systems", "maps and landform examples", "treating topography as unchanging", "relief maps");
    if (title.includes("climate")) return pick("the climate of Ethiopia", "explain climatic patterns and controls", "relating altitude to weather differences", "climate graphs and regional examples", "confusing weather with climate", "climate maps");
    if (title.includes("resource")) return pick("Ethiopia's natural resources", "identify major resources and their uses", "linking resources to development", "resource examples and maps", "seeing resources only as materials to extract", "resource maps");
    if (title.includes("population")) return pick("population and demographic patterns", "interpret distribution and change", "understanding migration and settlement", "population maps and data", "assuming people are evenly distributed", "population data");
    if (title.includes("economic") || title.includes("cultural")) return pick("economic and cultural activities", "connect place to livelihood", "explaining farming, trade, and culture", "regional examples and case studies", "separating culture completely from geography", "regional case studies");
    if (title.includes("interaction")) return pick("human-natural environment interaction", "explain how people use and change environments", "analyzing land use and adaptation", "environmental examples and maps", "seeing humans and environment as unrelated", "local examples");
    if (title.includes("issues") || title.includes("concerns")) return pick("contemporary geographic issues", "analyze current environmental and spatial challenges", "discussing drought, erosion, or urban growth", "issue-based examples and maps", "thinking geographic issues are only physical", "issue case studies");
    return pick("geographic inquiry skills", "collect and interpret geographic information", "using maps and data accurately", "symbols, scale, and observations", "ignoring map scale and symbols", "map work");
  }

  if (subject === "History") {
    if (title.includes("discipline") || title.includes("evolution")) return pick("history as evidence-based study and human evolution", "use sources to understand the past", "building timelines from evidence", "historical sources and milestones", "thinking history is only memorizing dates", "source analysis");
    if (title.includes("ancient")) return pick("ancient world civilizations", "compare early civilizations and contributions", "explaining writing, trade, and state formation", "timelines and civilization examples", "treating all civilizations as identical", "comparative tables");
    if (title.includes("ethiopia") || title.includes("horn")) return pick("peoples and states in Ethiopia and the Horn", "trace political and social development", "connecting local history to regional change", "maps, kingdoms, and timelines", "isolating Ethiopian history from the region", "regional timelines");
    if (title.includes("middle ages") || title.includes("early modern")) return pick("the middle ages and early modern world", "identify major global transformations", "explaining religion, trade, and power shifts", "timelines and key events", "seeing the period as static", "timelines");
    if (title.includes("africa")) return pick("African peoples, states, and outside relations", "analyze African historical development", "discussing trade, contact, and power", "African case studies and maps", "studying Africa only through outside influence", "regional case studies");
    return pick("the age of revolutions", "explain causes and impacts of revolutionary change", "connecting ideas, power, and social transformation", "cause-effect charts and timelines", "reducing revolutions to single events", "cause-effect charts");
  }

  if (subject === "Citizenship Education") {
    if (title.includes("ethical")) return pick("ethical values and responsible behavior", "judge actions using civic values", "making responsible choices in school and society", "case studies and examples", "treating ethics as opinion only", "reflection tasks");
    if (title.includes("digital")) return pick("digital citizenship and responsible technology use", "apply citizenship values online", "using media safely and respectfully", "digital scenarios and examples", "thinking online actions have no civic impact", "digital scenarios");
    if (title.includes("constitution")) return pick("constitution and constitutionalism", "explain how constitutions guide society", "connecting rights to institutions", "rights-and-duties examples", "thinking a constitution matters only to leaders", "rights charts");
    if (title.includes("indigenous")) return pick("indigenous knowledge in civic life", "recognize local knowledge as valuable", "respecting traditional practices and solutions", "community examples", "treating indigenous knowledge as outdated", "community case studies");
    if (title.includes("multicultural")) return pick("multiculturalism in Ethiopia", "respect diversity while supporting inclusion", "living peacefully in diverse communities", "dialogue examples and case studies", "thinking diversity weakens unity automatically", "dialogue tasks");
    if (title.includes("unity")) return pick("national unity through diversity", "balance common identity with difference", "building cooperation across communities", "shared-value examples", "confusing unity with uniformity", "discussion tasks");
    if (title.includes("problem-solving")) return pick("problem-solving in civic life", "analyze issues and choose solutions", "handling school and community conflicts", "decision steps and examples", "reacting without analysis", "decision frameworks");
    return pick("foreign relations in East Africa", "explain cooperation among neighboring states", "understanding diplomacy and regional peace", "regional examples and maps", "thinking foreign relations never affect ordinary people", "regional case studies");
  }

  if (subject === "Economics") {
    if (title.includes("introducing")) return pick("basic economic ideas and choice", "use economic terms correctly", "thinking about needs, wants, and scarcity", "daily-life decision examples", "thinking economics is only money", "decision charts");
    if (title.includes("system")) return pick("basic economic problems and systems", "compare how societies organize production", "explaining what, how, and for whom to produce", "system comparisons and examples", "assuming all economies work the same way", "comparison charts");
    if (title.includes("resource") || title.includes("market")) return pick("economic resources and markets", "identify factors of production", "linking land, labor, capital, and enterprise to output", "market examples and roles", "thinking markets are only physical places", "market examples");
    if (title.includes("demand") || title.includes("supply")) return pick("demand and supply", "explain how prices and quantities change", "interpreting buyer and seller behavior", "graphs and market examples", "thinking demand and supply move for the same reason", "graphs");
    if (title.includes("cost") || title.includes("production")) return pick("production and cost", "relate inputs, output, and expense", "understanding business choices", "cost examples and production cases", "assuming more production always means more profit", "cost tables");
    if (title.includes("money")) return pick("money and its functions", "explain why money is useful", "comparing barter and exchange", "functions of money and transactions", "thinking money is only paper and coins", "exchange examples");
    if (title.includes("macro")) return pick("basic macroeconomics", "describe economy-wide performance", "discussing growth, inflation, and employment", "national indicators and examples", "confusing personal finance with macroeconomics", "indicator charts");
    return pick("entrepreneurship and innovation", "identify opportunity and planning", "starting small businesses and solving problems", "business ideas and examples", "thinking entrepreneurship is only for the wealthy", "business planning");
  }

  if (subject === "Health and Physical Education") {
    if (title.includes("society")) return pick("sport and society", "connect physical activity to social values", "understanding teamwork and discipline", "examples from school and community sport", "seeing sport as entertainment only", "case studies");
    if (title.includes("fitness")) return pick("health and physical fitness", "explain components of fitness", "planning exercise and wellness habits", "fitness routines and health examples", "equating fitness only with body size", "fitness routines");
    if (title.includes("athletics")) return pick("athletics skills and events", "understand running, jumping, and throwing", "improving performance through technique", "event rules and drills", "thinking speed alone is enough", "skill drills");
    if (title.includes("football")) return pick("football skills and teamwork", "apply game rules and techniques", "passing and moving in team play", "match situations and drills", "treating football as individual play only", "match scenarios");
    if (title.includes("volleyball")) return pick("volleyball skills and rotation", "explain serving, passing, and teamwork", "working together in a court game", "court positions and examples", "watching the ball without understanding rotation", "court diagrams");
    if (title.includes("basketball")) return pick("basketball fundamentals", "understand dribbling, passing, and shooting", "making quick decisions in play", "court movement and drills", "thinking scoring is the only goal", "game scenarios");
    if (title.includes("handball")) return pick("handball techniques and coordination", "apply passing and shooting ideas", "moving effectively in a fast team game", "team-play examples", "confusing handball with unrelated games", "basic drills");
    return pick("self-defense and sport ethics", "connect safety, discipline, and fair play", "using physical skill responsibly", "ethical scenarios and safety rules", "thinking self-defense encourages aggression", "scenario analysis");
  }

  if (subject === "Information Technology") {
    if (title.includes("file")) return pick("file and folder organization", "store and retrieve files efficiently", "managing school documents properly", "folder structures and naming examples", "saving files without organization", "folder systems");
    if (title.includes("network")) return pick("computer networks", "explain how devices connect and share data", "understanding local networks and the internet", "network diagrams and components", "thinking all networks are the same", "network diagrams");
    if (title.includes("software")) return pick("application software", "choose software for specific tasks", "using digital tools for school work", "software categories and examples", "confusing application software with the operating system", "task matching");
    if (title.includes("image") || title.includes("multimedia")) return pick("image processing and multimedia", "create and interpret digital media", "combining text, sound, and visuals", "media examples and editing tasks", "thinking multimedia is only entertainment", "editing tasks");
    if (title.includes("security")) return pick("information and computer security", "identify threats and safe practices", "protecting passwords, devices, and data", "security scenarios and examples", "thinking security is only for experts", "security checklists");
    return pick("programming fundamentals", "break problems into clear instructions", "using logic to solve simple tasks", "algorithms, flowcharts, and examples", "thinking programming is only memorizing code", "flowcharts");
  }

  return pick(`${cleanTitle(chapter).toLowerCase()} in Grade 9 ${subject.toLowerCase()}`, `explain the key ideas in ${cleanTitle(chapter).toLowerCase()}`, `connecting ${cleanTitle(chapter).toLowerCase()} to everyday learning`, "clear examples and guided practice", `memorizing ${cleanTitle(chapter).toLowerCase()} without understanding it`, "notes and examples");
};

const peersFor = (subjectName: string, chapter: string) => {
  const subject = grade9Subjects.find((item) => item.name === subjectName);
  return (subject?.chapters || [])
    .filter((item) => item !== chapter)
    .map((item) => ({ chapter: item, title: cleanTitle(item), descriptor: inferDescriptor(subjectName, item) }));
};

const otherSubjectsFor = (subjectName: string) =>
  grade9Subjects.filter((item) => item.name !== subjectName).map((item) => item.name);

const buildChapterQuestions = (subject: string, chapter: string): Grade9Question[] => {
  const title = cleanTitle(chapter);
  const descriptor = inferDescriptor(subject, chapter);
  const peers = peersFor(subject, chapter);
  const peer = (index: number) => peers[index % peers.length];
  const others = otherSubjectsFor(subject);

  const make = (
    difficulty: "Easy" | "Medium" | "Hard",
    num: number,
    question: string,
    correct: string,
    distractors: string[],
    explanation: string,
    example: string,
  ): Grade9Question => ({
    id: `${slugify(subject)}-${slugify(chapter)}-${difficulty.toLowerCase()}-${num}`,
    question,
    options: makeOptions(correct, distractors, num),
    correct,
    explanation,
    example,
    difficulty,
    chapter,
    subject,
  });

  if (subject === "Amharic") {
    return [
      make("Easy", 1, `"${title}" የሚገኘው በየትኛው የ9ኛ ክፍል ትምህርት ነው?`, subject, others, `"${title}" በ9ኛ ክፍል አማርኛ ትምህርት ውስጥ ይገኛል።`),
      make("Easy", 2, `"${title}" ዋና ትኩረቱ ምንድን ነው?`, descriptor.concept, peers.map((item) => item.descriptor.concept), `ይህ ምዕራፍ በዋናነት ${descriptor.concept} ላይ ያተኩራል።`),
      make("Easy", 3, `"${title}" ጋር በትክክል የሚስማማው የመማር ግብ የቱ ነው?`, descriptor.skill, peers.map((item) => item.descriptor.skill), `ተማሪዎች በዚህ ምዕራፍ ${descriptor.skill} እንዲችሉ ይማራሉ።`),
      make("Easy", 4, `"${title}" ጋር በተግባር በጣም የሚገናኘው ሁኔታ የቱ ነው?`, descriptor.application, peers.map((item) => item.descriptor.application), `ይህ ምዕራፍ በተግባር ${descriptor.application} ጋር ይዛመዳል።`),
      make("Easy", 5, `"${title}" ለመከለስ በጣም የሚረዳው መሣሪያ የቱ ነው?`, descriptor.tool, peers.map((item) => item.descriptor.tool), `${descriptor.tool} ይህን ምዕራፍ ለመከለስ ጥሩ መነሻ ነው።`),
      make("Easy", 6, `"${title}" በአጭሩ በጣም የሚገልጸው ዓረፍተ ነገር የቱ ነው?`, `${descriptor.concept} እንዲገባ ያግዛል።`, peers.slice(0, 3).map((item) => `${item.descriptor.concept} እንዲገባ ያግዛል።`), `ይህ ምዕራፉን በትክክል የሚገልጽ መልስ ነው።`, ""),
      make("Easy", 7, `"${title}" በደንብ የተማረ ተማሪ ምን ማድረግ መቻል አለበት?`, descriptor.skill, peers.map((item) => item.descriptor.skill), `ይህ ምዕራፍ ተማሪዎችን ${descriptor.skill} እንዲችሉ ያዘጋጃል።`, ""),
      make("Easy", 8, `"${title}" ውስጥ በብዛት የሚታየው የማስረጃ አይነት የቱ ነው?`, descriptor.evidence, peers.map((item) => item.descriptor.evidence), `${descriptor.evidence} የምዕራፉን ግንዛቤ ይደግፋል።`, ""),
      make("Easy", 9, `${peer(0).descriptor.concept} ላይ የበለጠ የሚያተኩረው ከአንድ ትምህርት ውስጥ የትኛው ሌላ ምዕራፍ ነው?`, peer(0).title, [peer(1).title, peer(2).title, title], `"${peer(0).title}" ለዚያ ትኩረት የበለጠ ይስማማል።`, ""),
      make("Easy", 10, `"${title}" ላይ የሚከሰት የተለመደ ስህተት የቱ ነው?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `ይህ ስህተት ከምዕራፉ ዋና ሐሳብ ጋር ይጋጫል።`, ""),

      make("Medium", 1, `አንድ ተማሪ ${descriptor.application} ማድረግ ይፈልጋል። መጀመሪያ የትኛውን ምዕራፍ ሊከልስ ይገባል?`, title, [peer(0).title, peer(1).title, peer(2).title], `"${title}" በቀጥታ ${descriptor.concept} ላይ ስለሚያተኩር ተገቢ ነው።`),
      make("Medium", 2, `"${title}" ጋር በተሻለ ሁኔታ የሚስማማው የክለሳ እቅድ የቱ ነው?`, `${descriptor.evidence} በመማር ${descriptor.skill} መለማመድ`, peers.map((item) => `${item.descriptor.evidence} በመማር ${item.descriptor.skill} መለማመድ`), `ይህ እቅድ እውቀትንና ተግባርን አንድ ላይ ያዋህዳል።`),
      make("Medium", 3, `ትክክለኛው ንጽጽር የቱ ነው?`, `"${title}" በ${descriptor.concept} ላይ ያተኩራል፣ "${peer(0).title}" ደግሞ በ${peer(0).descriptor.concept} ላይ ያተኩራል።`, [`"${title}" እና "${peer(0).title}" ሙሉ በሙሉ አንድ ናቸው።`, `"${title}" የ${subject} አይደለም።`, `"${peer(0).title}" ከ${subject} ጋር ግንኙነት የለውም።`], `ሁለቱም ተያያዥ ቢሆኑም ትኩረታቸው አይመሳሰልም።`),
      make("Medium", 4, `"${title}" ውስጥ ከፍ ያለ ውጤት የሚያስመጣ መልስ የቱ ይሆናል?`, `${descriptor.evidence} በመጠቀም ${descriptor.skill} የሚያሳይ መልስ`, peers.map((item) => `${item.descriptor.evidence} በመጠቀም ${item.descriptor.skill} የሚያሳይ መልስ`), `ጠንካራ መልሶች ከምዕራፉ ትኩረት ጋር የሚስማማ ማስረጃ ይጠቀማሉ።`),
      make("Medium", 5, `አንድ ተማሪ "${title}" ን ቢያስታውስም በተግባር ማዋል ካልቻለ የጎደለው ምንድን ነው?`, "ተግባራዊ ግንዛቤና ምክንያታዊ አስተሳሰብ", ["ተጨማሪ መቅዳት", "የምዕራፉ ርዕስ ብቻ", "ተጨማሪ ገጾች"], `ይህ ምዕራፍ ማስታወስ ብቻ ሳይሆን መረዳትና መተግበር ይጠይቃል።`),
      make("Medium", 6, `ከትምህርት ቤት ሥራዎች ውስጥ ከ"${title}" ጋር በተሻለ ሁኔታ የሚስማማው የቱ ነው?`, `${descriptor.tool} በመጠቀም ${descriptor.skill} የሚያሳይ ሥራ`, peers.map((item) => `${item.descriptor.tool} በመጠቀም ${item.descriptor.skill} የሚያሳይ ሥራ`), `ተገቢ የክፍል ሥራ የምዕራፉን ዘዴና ውጤት አንድ ላይ ያዛል።`),
      make("Medium", 7, `"${title}" ዓላማውን በተሻለ ሁኔታ የሚገልጸው የቱ ነው?`, `${descriptor.concept} በ${descriptor.evidence} በመጠቀም እንዲጠቀሙ ያግዛል።`, peers.map((item) => `${item.descriptor.concept} በ${item.descriptor.evidence} በመጠቀም እንዲጠቀሙ ያግዛል።`), `ይህ አላማንና ዘዴን አንድ ላይ ያሳያል።`),
      make("Medium", 8, `ከ"${title}" ጋር የተያያዘ ያልተረዳ አስተሳሰብን የሚያሳይ የቱ ነው?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `ይህ ስህተት በምዕራፉ ውስጥ ደካማ መልስ ያስከትላል።`),
      make("Medium", 9, `"${title}" ጋር በቀጥታ የሚዛመደው ውጤት የቱ ነው?`, `ተማሪዎች ${descriptor.skill} በተግባራዊ ሁኔታ ሊያሳዩ ይችላሉ።`, peers.map((item) => `ተማሪዎች ${item.descriptor.skill} በተግባራዊ ሁኔታ ሊያሳዩ ይችላሉ።`), `ዋናው ውጤት እውቀትን በተግባር ማሳየት ነው።`),
      make("Medium", 10, `"${title}" ውስጥ በብዛት ሊቀርብ የሚችል ጥያቄ የቱ ነው?`, `${descriptor.concept} በ${descriptor.application} እንዴት እንጠቀማለን?`, peers.map((item) => `${item.descriptor.concept} በ${item.descriptor.application} እንዴት እንጠቀማለን?`), `ይህ ጥያቄ ከምዕራፉ ዋና ሐሳብ ጋር በቀጥታ ይዛመዳል።`),

      make("Hard", 1, `አንድ ተማሪ "${title}" ማለት እውነታዎችን ማስታወስ ብቻ ነው ይላል። ከሚከተሉት ውስጥ በጣም ጠንካራው ምላሽ የቱ ነው?`, `አይደለም። ${descriptor.skill} ማድረግን እና ሀሳቦችን ከ${descriptor.application} ጋር ማገናኘትንም ይጠይቃል።`, [`አዎ። ማስታወስ ብቻ በቂ ነው።`, `አዎ። "${title}" ተግባራዊ ዋጋ የለውም።`, `አይደለም። ምዕራፉን መተው ይሻላል።`], `ጥሩ ውጤት ለማምጣት መረዳትና ተግባራዊ አጠቃቀም አስፈላጊ ናቸው።`),
      make("Hard", 2, `"${title}" ጥልቅ ግንዛቤ እንዳለ ለመለካት በጣም የሚመጥነው የፈተና አይነት የቱ ነው?`, `${descriptor.evidence} በመጠቀም ${descriptor.skill} እንደሚችሉ እንዲያሳዩ መጠየቅ`, peers.map((item) => `${item.descriptor.evidence} በመጠቀም ${item.descriptor.skill} እንደሚችሉ እንዲያሳዩ መጠየቅ`), `ይህ ስራ ማስታወስ ብቻ ሳይሆን እውነተኛ ግንዛቤን ይመለከታል።`),
      make("Hard", 3, `"${title}" ዓላማውን በማጠቃለል በጣም የሚገልጸው የቱ ነው?`, `ተማሪዎች ከትርጉም መግለጫ ወደ ${descriptor.concept} በተግባር መጠቀም ሊሸጋገሩ አለባቸው።`, peers.map((item) => `ተማሪዎች ከትርጉም መግለጫ ወደ ${item.descriptor.concept} በተግባር መጠቀም ሊሸጋገሩ አለባቸው።`), `ይህ ምዕራፉ የሚፈልገውን ከእውቀት ወደ ተግባር ሽግግር ይገልጻል።`),
      make("Hard", 4, `"${title}" ላይ የተመሠረተ መልስን በጣም የሚያዳክም የምክንያት ስህተት የቱ ነው?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `ይህ ስህተት የምዕራፉን ትክክለኛ ግንዛቤ በቀጥታ ያበላሻል።`),
      make("Hard", 5, `"${title}" ን ከተማሪዎች ዕለታዊ ሕይወት ጋር ለማገናኘት በጣም የሚመጥነው የፕሮጀክት አይነት የቱ ነው?`, `ተማሪዎች ${descriptor.skill} በ${descriptor.application} እንዲያሳዩ የሚያግዙ የአካባቢ ምሳሌዎችን መጠቀም`, peers.map((item) => `ተማሪዎች ${item.descriptor.skill} በ${item.descriptor.application} እንዲያሳዩ የሚያግዙ የአካባቢ ምሳሌዎችን መጠቀም`), `ጠንካራ ፕሮጀክት ምዕራፉን ተግባራዊና የአካባቢ ልምድ ጋር ያገናኛል።`),
      make("Hard", 6, `ለምን "${descriptor.tool}" ከበደንብ መቅዳት ይልቅ ለ"${title}" የበለጠ ይጠቅማል?`, `ምክንያቱም ይህ ምዕራፍ ተማሪዎች ${descriptor.skill} እንዲያደርጉ ይፈልጋል፣ ማስታወስ ብቻን አይደለም።`, [`ምክንያቱም መቅዳት ሁልጊዜ ግንዛቤን ያረጋግጣል።`, `ምክንያቱም መሣሪያዎች በ9ኛ ክፍል አያስፈልጉም።`, `ምክንያቱም "${title}" የምክንያት ጥያቄዎች የሉትም።`], `ይህ ምዕራፍ ንቁ አጠቃቀምን ይፈልጋል እንጂ ተራ መቅዳትን አይደለም።`),
      make("Hard", 7, `በጣም ትክክለኛው ንጽጽር የቱ ነው?`, `"${title}" በ${descriptor.concept} ላይ ያተኩራል፣ "${peer(1).title}" ደግሞ በ${peer(1).descriptor.concept} ላይ ያተኩራል።`, [`"${title}" እና "${peer(1).title}" ሁልጊዜ አንድ አይነት መልስ ይፈልጋሉ።`, `"${peer(1).title}" የ${subject} አይደለም።`, `"${title}" ግልጽ ትኩረት የለውም።`], `ጠንካራ ተማሪዎች ተያያዥ ምዕራፎችን በትክክል ይለያያሉ።`),
      make("Hard", 8, `"${title}" ላይ ያለ ያልተረዳ አስተሳሰብን ለማጋለጥ በጣም የሚረዳው የመምህር ጥያቄ የቱ ነው?`, `${descriptor.concept} ከ${peer(2).descriptor.concept} እንዴት ይለያል?`, [`የምዕራፉን ርዕስ በደንብ ጻፍ።`, `የገጹን ቁጥር ብቻ ተናገር።`, `የትምህርቱን ስም ብቻ ጥራ።`], `የንጽጽር ጥያቄዎች ተማሪው የሀሳቦችን ወሰን በትክክል እንደተረዳ ያሳያሉ።`),
      make("Hard", 9, `"${title}" በ9ኛ ክፍል ሥርዓተ ትምህርት ውስጥ መኖሩ ለምን አስፈላጊ ነው?`, `ተማሪዎች ${descriptor.skill} እንዲችሉ እና ትምህርታቸውን ከክፍል ውጭ እንዲጠቀሙበት ያግዛል።`, [`የምዕራፎችን ብዛት ለመጨመር ብቻ ነው።`, `ለፈተና ብቻ ነው የሚጠቅመው።`, `ጥልቅ ግንዛቤ ሳይሰጥ ቃላትን ብቻ ያክላል።`], `ዋናው ጥቅም ተላላፊ የሆነ ግንዛቤን ማበረታታት ነው።`),
      make("Hard", 10, `"${title}" የሚያቀርበውን ችግኝ በተሻለ ሁኔታ የሚመልሰው መልስ የቱ ነው?`, `${descriptor.evidence} እና ${descriptor.tool} በመጠቀም ተማሪዎች ${descriptor.skill} እንደሚችሉ ማሳየት`, peers.map((item) => `${item.descriptor.evidence} እና ${item.descriptor.tool} በመጠቀም ተማሪዎች ${item.descriptor.skill} እንደሚችሉ ማሳየት`), `ይህ መልስ ዘዴን፣ ማስረጃን እና ውጤትን አንድ ላይ ያቀርባል።`),
    ];
  }

  if (subject === "Mathematics" && title.includes("Further on Sets")) {
    return [
      make("Easy", 1, `Which Grade 9 subject includes the chapter "${title}"?`, subject, others, `"${title}" is part of Grade 9 ${subject}.`, "Example: Set theory is fundamental in Mathematics curriculum."),
      make("Easy", 2, `What is the main focus of "${title}"?`, descriptor.concept, peers.map((item) => item.descriptor.concept), `This chapter mainly teaches ${descriptor.concept}.`, "Example: Learning to use set notation symbols like ∈, ⊂, ∪, ∩"),
      make("Easy", 3, `Which learning goal best matches "${title}"?`, descriptor.skill, peers.map((item) => item.descriptor.skill), `Students study this chapter to ${descriptor.skill}.`, "Example: Students should be able to classify numbers as elements or subsets of sets"),
      make("Easy", 4, `Which real-life context best connects with "${title}"?`, descriptor.application, peers.map((item) => item.descriptor.application), `The chapter connects best with ${descriptor.application}.`, "Example: Using Venn diagrams to organize survey data about student preferences"),
      make("Easy", 5, `Which resource is most useful when revising "${title}"?`, descriptor.tool, peers.map((item) => item.descriptor.tool), `${descriptor.tool} is a strong starting point for this chapter.`, "Example: Drawing Venn diagrams to visualize set relationships"),
      make("Easy", 6, `Which statement best summarizes "${title}"?`, `It develops understanding of ${descriptor.concept}.`, peers.slice(0, 3).map((item) => `It develops understanding of ${item.descriptor.concept}.`), `That option best captures the chapter theme.`, "Example: The chapter builds foundation for abstract mathematical thinking"),
      make("Easy", 7, `A student who studies "${title}" well should be able to:`, descriptor.skill, peers.map((item) => item.descriptor.skill), `The chapter is designed to help learners ${descriptor.skill}.`, "Example: Create Venn diagrams showing relationships between different number sets"),
      make("Easy", 8, `Which kind of evidence appears most often in "${title}"?`, descriptor.evidence, peers.map((item) => item.descriptor.evidence), `${descriptor.evidence} supports understanding in this chapter.`, "Example: Worked problems showing step-by-step set operations"),
      make("Easy", 9, `Which chapter from the same subject focuses more on ${peer(0).descriptor.concept}?`, peer(0).title, [peer(1).title, peer(2).title, title], `"${peer(0).title}" is the better match for that focus.`, "Example: Number systems chapter builds on set concepts from this chapter"),
      make("Easy", 10, `What is a common mistake in "${title}"?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `That misconception directly conflicts with the chapter's main ideas.`, "Example: Students often confuse union (∪) with intersection (∩) operations"),

      make("Medium", 1, `A learner wants to ${descriptor.application}. Which chapter should they revise first?`, title, [peer(0).title, peer(1).title, peer(2).title], `"${title}" is the best chapter because it focuses on ${descriptor.concept}.`, "Example: To organize data into categories, start with set theory basics"),
      make("Medium", 2, `Which revision plan best fits "${title}"?`, `Study ${descriptor.evidence} and practice how to ${descriptor.skill}.`, peers.map((item) => `Study ${item.descriptor.evidence} and practice how to ${item.descriptor.skill}.`), `This plan combines knowledge and application.`, "Example: Review set notation rules, then practice drawing Venn diagrams"),
      make("Medium", 3, `Which comparison is correct?`, `"${title}" focuses on ${descriptor.concept}, while "${peer(0).title}" focuses on ${peer(0).descriptor.concept}.`, [`"${title}" and "${peer(0).title}" focus on exactly the same idea.`, `"${title}" is not part of ${subject}.`, `"${peer(0).title}" is unrelated to ${subject}.`], `The two chapters are related but not identical.`, "Example: Sets deal with grouping, while equations deal with solving unknowns"),
      make("Medium", 4, `Which answer would most likely score well in "${title}"?`, `An answer that uses ${descriptor.evidence} to ${descriptor.skill}.`, peers.map((item) => `An answer that uses ${item.descriptor.evidence} to ${item.descriptor.skill}.`), `Strong answers use the right evidence for the chapter focus.`, "Example: Using proper set notation and Venn diagrams in solutions"),
      make("Medium", 5, `If a student memorizes "${title}" but cannot apply it, what is missing?`, "Application and reasoning", ["Only more copying", "Only a longer title", "Only more page numbers"], `The chapter expects understanding in use, not memorization alone.`, "Example: Student knows symbols but can't solve real set problems"),
      make("Medium", 6, `Which school task best fits "${title}"?`, `A task that helps students ${descriptor.skill} using ${descriptor.tool}.`, peers.map((item) => `A task that helps students ${item.descriptor.skill} using ${item.descriptor.tool}.`), `The best tasks match both the chapter method and outcome.`, "Example: Survey class on hobbies and create Venn diagram of results"),
      make("Medium", 7, `Which statement best explains the purpose of "${title}"?`, `It helps students use ${descriptor.concept} through ${descriptor.evidence}.`, peers.map((item) => `It helps students use ${item.descriptor.concept} through ${item.descriptor.evidence}.`), `That statement captures the purpose and method together.`, "Example: Teaching logical thinking through set operations"),
      make("Medium", 8, `Which mistake shows misunderstanding of "${title}"?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `That mistake would lead to weak answers in this chapter.`, "Example: Writing A ∪ B when A ∩ B is required"),
      make("Medium", 9, `Which outcome belongs most directly to "${title}"?`, `Learners can ${descriptor.skill} in realistic situations.`, peers.map((item) => `Learners can ${item.descriptor.skill} in realistic situations.`), `The strongest outcome is applied understanding.`, "Example: Students can organize real data using set theory"),
      make("Medium", 10, `Which chapter question is most likely in "${title}"?`, `How can we use ${descriptor.concept} in ${descriptor.application}?`, peers.map((item) => `How can we use ${item.descriptor.concept} in ${item.descriptor.application}?`), `That question stays closest to the chapter's core idea.`, "Example: How can set theory help organize survey data?"),

      make("Hard", 1, `A student says "${title}" is only about memorizing facts. Which reply is strongest?`, `No. It also requires students to ${descriptor.skill} and connect ideas to ${descriptor.application}.`, [`Yes. Memorization alone is enough for this chapter.`, `Yes. "${title}" has no practical value.`, `No. The chapter should be skipped entirely.`], `Good performance requires understanding and application together.`, "Example: Set theory is used in computer science, statistics, and logic"),
      make("Hard", 2, `Which assessment would measure deep understanding of "${title}"?`, `Ask students to use ${descriptor.evidence} to show how they can ${descriptor.skill}.`, peers.map((item) => `Ask students to use ${item.descriptor.evidence} to show how they can ${item.descriptor.skill}.`), `That task checks real understanding rather than recall alone.`, "Example: Given a real-world problem, design a set-based solution"),
      make("Hard", 3, `Which conclusion best synthesizes the purpose of "${title}"?`, `Students should move from definitions to using ${descriptor.concept} in order to ${descriptor.application}.`, peers.map((item) => `Students should move from definitions to using ${item.descriptor.concept} in order to ${item.descriptor.application}.`), `This is the strongest synthesis of the chapter's goal.`, "Example: Progress from learning symbols to applying set logic"),
      make("Hard", 4, `Which reasoning error would weaken an answer from "${title}" most?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `That error directly blocks accurate reasoning in the chapter.`, "Example: Assuming all set operations are commutative without verification"),
      make("Hard", 5, `Which project best connects "${title}" to student life?`, `Use local examples that help learners ${descriptor.skill} through ${descriptor.application}.`, peers.map((item) => `Use local examples that help learners ${item.descriptor.skill} through ${item.descriptor.application}.`), `The strongest project makes the chapter practical and local.`, "Example: Analyze school club memberships using set theory"),
      make("Hard", 6, `Why is "${descriptor.tool}" better than rote copying for "${title}"?`, `Because the chapter expects students to ${descriptor.skill}, not only repeat notes.`, [`Because copying always proves understanding.`, `Because tools never matter in Grade 9.`, `Because "${title}" has no reasoning tasks.`], `This chapter needs active use of ideas, not passive repetition.`, "Example: Drawing Venn diagrams builds visual and logical thinking"),
      make("Hard", 7, `Which contrast is most accurate?`, `"${title}" builds ${descriptor.concept}, while "${peer(1).title}" develops ${peer(1).descriptor.concept}.`, [`"${title}" and "${peer(1).title}" always require identical answers.`, `"${peer(1).title}" is not part of ${subject}.`, `"${title}" has no clear focus.`], `Strong learners distinguish neighboring chapters by exact focus.`, "Example: Sets group objects, while equations find unknown values"),
      make("Hard", 8, `Which teacher prompt would best reveal misunderstanding in "${title}"?`, `Explain how ${descriptor.concept} differs from ${peer(2).descriptor.concept}.`, [`Copy the chapter title neatly.`, `State the page number only.`, `Name the subject without explanation.`], `Comparison questions expose whether learners really understand boundaries between ideas.`, "Example: How do set operations differ from arithmetic operations?"),
      make("Hard", 9, `What is the strongest reason to keep "${title}" in the Grade 9 curriculum?`, `It helps students ${descriptor.skill} and apply learning beyond the classroom.`, [`It only increases the number of units.`, `It matters only for exams.`, `It adds vocabulary without deeper understanding.`], `The chapter matters because it develops transferable understanding.`, "Example: Set theory foundation helps in computer programming and data analysis"),
      make("Hard", 10, `Which answer best responds to the challenge of "${title}"?`, `Use ${descriptor.evidence} and ${descriptor.tool} to show how learners can ${descriptor.skill}.`, peers.map((item) => `Use ${item.descriptor.evidence} and ${item.descriptor.tool} to show how learners can ${item.descriptor.skill}.`), `That answer combines method, evidence, and outcome.`, "Example: Combine Venn diagrams with set notation to solve classification problems"),
    ];
  }

  return [
    make("Easy", 1, `Which Grade 9 subject includes the chapter "${title}"?`, subject, others, `"${title}" is part of Grade 9 ${subject}.`, ""),
    make("Easy", 2, `What is the main focus of "${title}"?`, descriptor.concept, peers.map((item) => item.descriptor.concept), `This chapter mainly teaches ${descriptor.concept}.`, ""),
    make("Easy", 3, `Which learning goal best matches "${title}"?`, descriptor.skill, peers.map((item) => item.descriptor.skill), `Students study this chapter to ${descriptor.skill}.`, ""),
    make("Easy", 4, `Which real-life context best connects with "${title}"?`, descriptor.application, peers.map((item) => item.descriptor.application), `The chapter connects best with ${descriptor.application}.`, ""),
    make("Easy", 5, `Which resource is most useful when revising "${title}"?`, descriptor.tool, peers.map((item) => item.descriptor.tool), `${descriptor.tool} is a strong starting point for this chapter.`, ""),
    make("Easy", 6, `Which statement best summarizes "${title}"?`, `It develops understanding of ${descriptor.concept}.`, peers.slice(0, 3).map((item) => `It develops understanding of ${item.descriptor.concept}.`), `That option best captures the chapter theme.`, ""),
    make("Easy", 7, `A student who studies "${title}" well should be able to:`, descriptor.skill, peers.map((item) => item.descriptor.skill), `The chapter is designed to help learners ${descriptor.skill}.`, ""),
    make("Easy", 8, `Which kind of evidence appears most often in "${title}"?`, descriptor.evidence, peers.map((item) => item.descriptor.evidence), `${descriptor.evidence} supports understanding in this chapter.`, ""),
    make("Easy", 9, `Which chapter from the same subject focuses more on ${peer(0).descriptor.concept}?`, peer(0).title, [peer(1).title, peer(2).title, title], `"${peer(0).title}" is the better match for that focus.`, ""),
    make("Easy", 10, `What is a common mistake in "${title}"?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `That misconception directly conflicts with the chapter's main ideas.`, ""),

    make("Medium", 1, `A learner wants to ${descriptor.application}. Which chapter should they revise first?`, title, [peer(0).title, peer(1).title, peer(2).title], `"${title}" is the best chapter because it focuses on ${descriptor.concept}.`, ""),
    make("Medium", 2, `Which revision plan best fits "${title}"?`, `Study ${descriptor.evidence} and practice how to ${descriptor.skill}.`, peers.map((item) => `Study ${item.descriptor.evidence} and practice how to ${item.descriptor.skill}.`), `This plan combines knowledge and application.`, ""),
    make("Medium", 3, `Which comparison is correct?`, `"${title}" focuses on ${descriptor.concept}, while "${peer(0).title}" focuses on ${peer(0).descriptor.concept}.`, [`"${title}" and "${peer(0).title}" focus on exactly the same idea.`, `"${title}" is not part of ${subject}.`, `"${peer(0).title}" is unrelated to ${subject}.`], `The two chapters are related but not identical.`, ""),
    make("Medium", 4, `Which answer would most likely score well in "${title}"?`, `An answer that uses ${descriptor.evidence} to ${descriptor.skill}.`, peers.map((item) => `An answer that uses ${item.descriptor.evidence} to ${item.descriptor.skill}.`), `Strong answers use the right evidence for the chapter focus.`, ""),
    make("Medium", 5, `If a student memorizes "${title}" but cannot apply it, what is missing?`, "Application and reasoning", ["Only more copying", "Only a longer title", "Only more page numbers"], `The chapter expects understanding in use, not memorization alone.`, ""),
    make("Medium", 6, `Which school task best fits "${title}"?`, `A task that helps students ${descriptor.skill} using ${descriptor.tool}.`, peers.map((item) => `A task that helps students ${item.descriptor.skill} using ${item.descriptor.tool}.`), `The best tasks match both the chapter method and outcome.`, ""),
    make("Medium", 7, `Which statement best explains the purpose of "${title}"?`, `It helps students use ${descriptor.concept} through ${descriptor.evidence}.`, peers.map((item) => `It helps students use ${item.descriptor.concept} through ${item.descriptor.evidence}.`), `That statement captures the purpose and method together.`, ""),
    make("Medium", 8, `Which mistake shows misunderstanding of "${title}"?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `That mistake would lead to weak answers in this chapter.`, ""),
    make("Medium", 9, `Which outcome belongs most directly to "${title}"?`, `Learners can ${descriptor.skill} in realistic situations.`, peers.map((item) => `Learners can ${item.descriptor.skill} in realistic situations.`), `The strongest outcome is applied understanding.`, ""),
    make("Medium", 10, `Which chapter question is most likely in "${title}"?`, `How can we use ${descriptor.concept} in ${descriptor.application}?`, peers.map((item) => `How can we use ${item.descriptor.concept} in ${item.descriptor.application}?`), `That question stays closest to the chapter's core idea.`, ""),

    make("Hard", 1, `A student says "${title}" is only about memorizing facts. Which reply is strongest?`, `No. It also requires students to ${descriptor.skill} and connect ideas to ${descriptor.application}.`, [`Yes. Memorization alone is enough for this chapter.`, `Yes. "${title}" has no practical value.`, `No. The chapter should be skipped entirely.`], `Good performance requires understanding and application together.`, ""),
    make("Hard", 2, `Which assessment would measure deep understanding of "${title}"?`, `Ask students to use ${descriptor.evidence} to show how they can ${descriptor.skill}.`, peers.map((item) => `Ask students to use ${item.descriptor.evidence} to show how they can ${item.descriptor.skill}.`), `That task checks real understanding rather than recall alone.`, ""),
    make("Hard", 3, `Which conclusion best synthesizes the purpose of "${title}"?`, `Students should move from definitions to using ${descriptor.concept} in order to ${descriptor.application}.`, peers.map((item) => `Students should move from definitions to using ${item.descriptor.concept} in order to ${item.descriptor.application}.`), `This is the strongest synthesis of the chapter's goal.`, ""),
    make("Hard", 4, `Which reasoning error would weaken an answer from "${title}" most?`, descriptor.misconception, peers.map((item) => item.descriptor.misconception), `That error directly blocks accurate reasoning in the chapter.`, ""),
    make("Hard", 5, `Which project best connects "${title}" to student life?`, `Use local examples that help learners ${descriptor.skill} through ${descriptor.application}.`, peers.map((item) => `Use local examples that help learners ${item.descriptor.skill} through ${item.descriptor.application}.`), `The strongest project makes the chapter practical and local.`, ""),
    make("Hard", 6, `Why is "${descriptor.tool}" better than rote copying for "${title}"?`, `Because the chapter expects students to ${descriptor.skill}, not only repeat notes.`, [`Because copying always proves understanding.`, `Because tools never matter in Grade 9.`, `Because "${title}" has no reasoning tasks.`], `This chapter needs active use of ideas, not passive repetition.`, ""),
    make("Hard", 7, `Which contrast is most accurate?`, `"${title}" builds ${descriptor.concept}, while "${peer(1).title}" develops ${peer(1).descriptor.concept}.`, [`"${title}" and "${peer(1).title}" always require identical answers.`, `"${peer(1).title}" is not part of ${subject}.`, `"${title}" has no clear focus.`], `Strong learners distinguish neighboring chapters by exact focus.`, ""),
    make("Hard", 8, `Which teacher prompt would best reveal misunderstanding in "${title}"?`, `Explain how ${descriptor.concept} differs from ${peer(2).descriptor.concept}.`, [`Copy the chapter title neatly.`, `State the page number only.`, `Name the subject without explanation.`], `Comparison questions expose whether learners really understand boundaries between ideas.`, ""),
    make("Hard", 9, `What is the strongest reason to keep "${title}" in the Grade 9 curriculum?`, `It helps students ${descriptor.skill} and apply learning beyond the classroom.`, [`It only increases the number of units.`, `It matters only for exams.`, `It adds vocabulary without deeper understanding.`], `The chapter matters because it develops transferable understanding.`, ""),
    make("Hard", 10, `Which answer best responds to the challenge of "${title}"?`, `Use ${descriptor.evidence} and ${descriptor.tool} to show how learners can ${descriptor.skill}.`, peers.map((item) => `Use ${item.descriptor.evidence} and ${item.descriptor.tool} to show how learners can ${item.descriptor.skill}.`), `That answer combines method, evidence, and outcome.`, ""),
  ];
};

const bank: Record<string, Record<string, Grade9Question[]>> = Object.fromEntries(
  grade9Subjects.map((subject) => [
    subject.name,
    Object.fromEntries(subject.chapters.map((chapter) => [chapter, buildChapterQuestions(subject.name, chapter)])),
  ]),
) as Record<string, Record<string, Grade9Question[]>>;

export const getGrade9ChapterQuestionCounts = (subjectName: string, chapter: string) => {
  const questions = bank[subjectName]?.[chapter] || [];
  return {
    easy: questions.filter((q) => q.difficulty === "Easy").length,
    medium: questions.filter((q) => q.difficulty === "Medium").length,
    hard: questions.filter((q) => q.difficulty === "Hard").length,
  };
};

export const getGrade9Questions = (
  subjectName: string,
  chapter: string,
  difficulty: "easy" | "medium" | "hard",
  count = 10,
) => {
  const map = { easy: "Easy", medium: "Medium", hard: "Hard" } as const;
  return (bank[subjectName]?.[chapter] || []).filter((q) => q.difficulty === map[difficulty]).slice(0, count);
};
