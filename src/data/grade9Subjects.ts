
export interface Grade9Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  chapters: string[];
  category: 'Natural Sciences' | 'Social Sciences' | 'Mathematics' | 'Languages' | 'Other';
}

export const grade9Subjects: Grade9Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: 'Calculator',
    description: 'Fundamental mathematics including algebra, geometry, and statistics',
    chapters: [
      'Unit 1: Further on Sets',
      'Unit 2: The Number System',
      'Unit 3: Solving Equations',
      'Unit 4: Solving Inequalities',
      'Unit 5: Introduction to Trigonometry',
      'Unit 6: Regular Polygons',
      'Unit 7: Congruency and Similarity',
      'Unit 8: Vectors in Two Dimensions',
      'Unit 9: Statistics and Probability'
    ],
    category: 'Mathematics'
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    description: 'Introduction to mechanics, heat, waves, and electricity',
    chapters: [
      'Unit 1: Physics and Human Society',
      'Unit 2: Physical Quantities',
      'Unit 3: Motion in a Straight Line',
      'Unit 4: Force, Work, Energy, and Power',
      'Unit 5: Simple Machines',
      'Unit 6: Mechanical Oscillation and Sound Wave',
      'Unit 7: Temperature and Thermometer'
    ],
    category: 'Natural Sciences'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'Flask',
    description: 'Introduction to chemistry, matter, and chemical reactions',
    chapters: [
      'Unit 1: Chemistry And Its Importance',
      'Unit 2: Measurements And Scientific Methods',
      'Unit 3: Structure Of The Atom',
      'Unit 4: Periodic Classification Of Elements',
      'Unit 5: Chemical Bonding'
    ],
    category: 'Natural Sciences'
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: 'Leaf',
    description: 'Cell biology, genetics, human body systems, and ecology',
    chapters: [
      'Unit 1: Introduction to Biology',
      'Unit 2: Characteristics and Classification of Organisms',
      'Unit 3: Cells',
      'Unit 4: Reproduction',
      'Unit 5: Human Health, Nutrition, and Disease',
      'Unit 6: Ecology'
    ],
    category: 'Natural Sciences'
  },
  {
    id: 'english',
    name: 'English',
    icon: 'BookOpen',
    description: 'English language skills, reading comprehension, and writing',
    chapters: [
      'Unit 1: Living in Urban Areas',
      'Unit 2: Study Skills',
      'Unit 3: Traffic Accident',
      'Unit 4: National Parks',
      'Unit 5: Horticulture',
      'Unit 6: Poverty in Ethiopia',
      'Unit 7: Community Services',
      'Unit 8: Communicable Diseases',
      'Unit 9: Fairness and Equity',
      'Unit 10: The Internet'
    ],
    category: 'Languages'
  },
  {
    id: 'geography',
    name: 'Geography',
    icon: 'Globe',
    description: 'Physical geography, climate, population, and economic activities',
    chapters: [
      'Unit 1: Geological History And Topography Of Ethiopia',
      'Unit 2: Climate Of Ethiopia',
      'Unit 3: Natural Resource Base Of Ethiopia',
      'Unit 4: Population And Demographic Characteristics Of Ethiopia',
      'Unit 5: Major Economic And Cultural Activities In Ethiopia',
      'Unit 6: Human – Natural Environment Interactions In Ethiopia',
      'Unit 7: Contemporary Geographic Issues And Public Concerns In Ethiopia',
      'Unit 8: Geographic Inquiry Skills And Techniques'
    ],
    category: 'Social Sciences'
  },
  {
    id: 'history',
    name: 'History',
    icon: 'Clock',
    description: 'Ethiopian history, world civilizations, and historical analysis',
    chapters: [
      'Unit 1: The Discipline of History and Human Evolution',
      'Unit 2: Ancient World Civilizations up to c. 500 AD',
      'Unit 3: Peoples and States in Ethiopia and the Horn to the End of 13th Century',
      'Unit 4: The Middle Ages and Early Modern World, C. 500 to 1750s',
      'Unit 5: Peoples and States of Africa to 1500',
      'Unit 6: Africa and the Outside World 1500-1880s',
      'Unit 7: States, Principalities, Population Movements & Interactions in Ethiopia 13th to Mid-16th C.',
      'Unit 8: Political, Social, and Economic Processes in Ethiopia Mid-16th to Mid-19th C.',
      'Unit 9: The Age of Revolutions 1750s to 1815'
    ],
    category: 'Social Sciences'
  },
  {
    id: 'civics',
    name: 'Civic Education',
    icon: 'Scale',
    description: 'Civic and ethical education, democracy, and human rights',
    chapters: [
      'Unit 1: Ethical Values',
      'Unit 2: The Culture Of Using Digital Technology',
      'Unit 3: Constitution And Constitutionalism',
      'Unit 4: Understanding Indigenous Knowledge',
      'Unit 5: Multiculturalism In Ethiopia',
      'Unit 6: National Unity Through Diversity',
      'Unit 7: Problem-Solving Skills',
      'Unit 8: Ethiopia\'s Foreign Relations In East Africa'
    ],
    category: 'Social Sciences'
  },
  {
    id: 'amharic',
    name: 'Amharic',
    icon: 'Type',
    description: 'Amharic language, grammar, literature, and composition',
    chapters: [
      'ምዕራፍ 1: ቋንቋ',
      'ምዕራፍ 2: ግብር',
      'ምዕራፍ 3: ማዕድን ማውጣት',
      'ምዕራፍ 4: ልቦለድ',
      'ምዕራፍ 5: ቃላዊ ስነፅሑፍ',
      'ምዕራፍ 6: ግጥም',
      'ምዕራፍ 7: ኮቪድ -19 (ኮሮና)',
      'ምዕራፍ 8: ተውኔት',
      'ምዕራፍ 9: ማህበራዊ መገናኛ ብዙኃን እና ተግባቦት'
    ],
    category: 'Languages'
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: 'TrendingUp',
    description: 'Introduction to economic principles, markets, and entrepreneurship',
    chapters: [
      'Unit 1: Introducing Economics',
      'Unit 2: The Basic Economic Problems and Economic Systems',
      'Unit 3: Economic Resources and Markets',
      'Unit 4: Introduction to Demand and Supply',
      'Unit 5: Introduction to Production and Cost',
      'Unit 6: Introduction to Money',
      'Unit 7: Introduction to Macroeconomics',
      'Unit 8: Basic Entrepreneurship'
    ],
    category: 'Social Sciences'
  }
];
