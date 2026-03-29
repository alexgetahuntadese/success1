import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'tmp', 'eng2015html');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html')).sort((a,b)=>{
  const na = parseInt(a.match(/(\d+)/)?.[0]||0,10);
  const nb = parseInt(b.match(/(\d+)/)?.[0]||0,10);
  return na - nb;
});

function cleanText(s){
  return s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
}

const questions = [];

for(const f of files){
  const text = fs.readFileSync(path.join(dir,f),'utf8');
  const re = /<h3[^>]*>\s*Question\s*(\d+)[^<]*<\/h3>([\s\S]*?)(?=<h3[^>]*>\s*Question\s*\d+|$)/g;
  let m;
  while((m = re.exec(text))){
    const num = parseInt(m[1],10);
    let block = m[2];
    block = block.replace(/Show Explanation/g,'');
    // choice divs
    const opts = [];
    const optDivRe = /<div[^>]*class=["'][^"']*cho-item[^"']*["'][^>]*>([\s\S]*?)<\/div>/g;
    let om;
    while((om = optDivRe.exec(block))){
      const txt = cleanText(om[1]).replace(/^[A-D]\s*/,'').trim();
      if(txt) opts.push(txt);
    }
    if(opts.length === 0){
      const optRe = /([A-D])([^A-D]+)/g;
      while((om = optRe.exec(cleanText(block)))){
        opts.push(om[2].trim());
      }
    }
    let firstOptIndex = null;
    const firstMatch = block.search(/<div[^>]*class=["'][^"']*cho-item[^"']*["'][^>]*>/);
    if(firstMatch>=0) firstOptIndex = firstMatch;
    let questionText = block;
    if(firstOptIndex!==null) questionText = block.slice(0, firstOptIndex);
    questionText = cleanText(questionText).replace(/^(Share This Question)/i,'').trim();

    questions.push({
      id: `m2015-social-eng-${num}`,
      question: questionText,
      options: opts,
      correctAnswer: -1,
      explanation: '',
    });
  }
}

questions.sort((a,b)=>parseInt(a.id.split('-').pop(),10)-parseInt(b.id.split('-').pop(),10));

const out = `import { MatricExamQuestion } from "./matricExams";

export const matric2015SocialEnglishQuestions: MatricExamQuestion[] = ${JSON.stringify(questions,null,2)};
`;

fs.writeFileSync('src/data/matric2015SocialEnglishQuestions.ts', out);
console.log('Wrote src/data/matric2015SocialEnglishQuestions.ts with', questions.length, 'items');
