import fs from 'fs';

const filePath = 'src/data/matric2015SocialScholasticAptitudeQuestions.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Reset all correctAnswer to -1 and clear explanations
let updatedContent = content;

// Reset correctAnswer for all 60 questions
for (let i = 1; i <= 60; i++) {
  // Reset correctAnswer to -1
  updatedContent = updatedContent.replace(
    new RegExp(`(\"id\": \"m2015-social-sat-${i}\"[\\s\\S]*?\"correctAnswer\": )\\d+`, 'g'),
    `$1-1`
  );
  
  // Clear explanation
  updatedContent = updatedContent.replace(
    new RegExp(`(\"id\": \"m2015-social-sat-${i}\"[\\s\\S]*?\"explanation\": )\"[^\"]*\"`, 'g'),
    `$1""`
  );
}

// Remove sectionGroupTitle, sectionTitle, sectionDirection fields that were added incorrectly
updatedContent = updatedContent.replace(/,\n\s*"sectionGroupTitle": "[^"]*"/g, '');
updatedContent = updatedContent.replace(/,\n\s*"sectionTitle": "[^"]*"/g, '');
updatedContent = updatedContent.replace(/,\n\s*"sectionDirection": "[^"]*"/g, '');

fs.writeFileSync(filePath, updatedContent);
console.log('Reset all 60 SAT 2015 questions - answers cleared for manual entry');
