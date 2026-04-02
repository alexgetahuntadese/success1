import fs from 'fs';
import path from 'path';

const dataDir = 'src/data';

// Files to clean up
const filesToClean = [
  'matric2014PhysicsQuestions.ts',
  'matric2014EnglishQuestions.ts',
  'matric2014CivicsQuestions.ts',
  'matric2014SatQuestions.ts',
  'matric2014SocialCivicsQuestions.ts',
  'matric2014SocialEnglishQuestions.ts',
  'matric2014SocialGeographyQuestions.ts',
  'matric2014SocialHistoryQuestions.ts',
  'matric2014SocialMathQuestions.ts',
  'matric2014SocialSatQuestions.ts',
];

for (const file of filesToClean) {
  const filePath = path.join(dataDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove "Share Share This Question " prefix from questions
  content = content.replace(/Share Share This Question /g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned ${file}`);
}

console.log('All 2014 files cleaned successfully');
