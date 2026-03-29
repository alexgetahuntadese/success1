import fs from 'fs';
import path from 'path';

const dataDir = 'src/data';

// Files to clean up - remove junk text from options
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

// Patterns to remove from options
const junkPatterns = [
  'No explanation yet',
  'share your knowledge',
  'omments',
  'No comments yet',
  'Add your answer',
  'start the discussion',
  'Please Login',
  'Create Account',
  'ccount',
  'dd your',
  'dd Comment',
  'dd',
  'nswer',
  'omment Or',
  'reate',
  'ogin',
  'eturn to',
  'kehulum',
];

for (const file of filesToClean) {
  const filePath = path.join(dataDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Fix malformed JSON by removing junk from options array
  // Pattern: match options arrays and clean them up
  content = content.replace(
    /"options":\s*\[[\s\S]*?\]/g,
    (match) => {
      // Remove junk patterns
      let cleaned = match;
      junkPatterns.forEach(pattern => {
        cleaned = cleaned.replace(new RegExp(`\\s*"${pattern}[^"]*"\\s*,?\\s*`, 'gi'), '');
      });
      // Remove empty strings
      cleaned = cleaned.replace(/"",?\s*/g, '');
      // Fix trailing commas in arrays
      cleaned = cleaned.replace(/,\s*\]/g, ']');
      return cleaned;
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned ${file}`);
}

console.log('All 2014 files cleaned of junk text');
