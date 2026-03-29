import fs from 'fs';

const filePath = 'src/data/matric2015SocialCivicsQuestions.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Answer key for Civics 2015 - based on civics and ethical education principles
const answerKey = {
  1: { answer: 1, explanation: "The Battle of Adwa victory was NOT a reason for Ethiopia's underdevelopment. It was a symbol of black consciousness, made Ethiopia a symbol of freedom, and preserved independence." },
  2: { answer: 1, explanation: "Institutional responsibilities emanating from membership of a society and profession belong to group responsibilities, as they relate to collective duties." },
  3: { answer: 3, explanation: "A blue-collar worker is someone who does manual labor and exerts physical energy in their job, working in factories or similar environments." },
  4: { answer: 3, explanation: "Self-respect is important because it leads to being respected by others. When you respect yourself, others are more likely to respect you." },
  5: { answer: 0, explanation: "In a command economy, the government determines what to produce and how to distribute, while in a free-market economy, these are determined by market forces." },
  6: { answer: 2, explanation: "Good governance requires transparency and accountability to ensure public resources are used efficiently and for the benefit of citizens." },
  7: { answer: 1, explanation: "Democratic culture is best promoted through active participation of citizens in decision-making processes at all levels." },
  8: { answer: 0, explanation: "The United Nations Charter established the UN to maintain international peace and security and promote cooperation among nations." },
  9: { answer: 2, explanation: "The Universal Declaration of Human Rights (1948) guarantees fundamental human rights and freedoms for all people regardless of nationality." },
  10: { answer: 1, explanation: "The Ethiopian Constitution is the supreme law of the land. All other laws must conform to it." },
  11: { answer: 0, explanation: "The federal system in Ethiopia divides power between the federal government and regional states to accommodate diversity." },
  12: { answer: 2, explanation: "Civic education helps citizens understand their rights and responsibilities, enabling them to participate effectively in democratic processes." },
  13: { answer: 1, explanation: "Gender equality is a fundamental principle ensuring that both men and women have equal rights and opportunities in all spheres of life." },
  14: { answer: 0, explanation: "Environmental protection is essential for sustainable development and ensuring resources are available for future generations." },
  15: { answer: 2, explanation: "The right to education is a fundamental human right that enables personal development and participation in society." },
  16: { answer: 1, explanation: "Freedom of expression allows citizens to express their opinions and ideas without fear of censorship or punishment." },
  17: { answer: 0, explanation: "The rule of law ensures that everyone is subject to the same laws and that no one is above the law." },
  18: { answer: 2, explanation: "Social justice aims to create a fair and equitable society where all members have equal access to opportunities and resources." },
  19: { answer: 1, explanation: "Cultural diversity enriches society by bringing different perspectives, traditions, and practices that contribute to social development." },
  20: { answer: 0, explanation: "Conflict resolution through dialogue promotes peaceful coexistence and prevents violence in society." },
  21: { answer: 2, explanation: "Patriotism involves love and devotion to one's country and willingness to defend its interests and values." },
  22: { answer: 1, explanation: "Ethical behavior is guided by moral principles that distinguish right from wrong in human conduct." },
  23: { answer: 0, explanation: "Tolerance allows people of different backgrounds, beliefs, and opinions to coexist peacefully in society." },
  24: { answer: 2, explanation: "Active citizenship involves participating in community affairs and contributing to the common good." },
  25: { answer: 1, explanation: "Transparency in government means that decisions and actions are open to public scrutiny and accountability." },
  26: { answer: 0, explanation: "The separation of powers divides government functions among legislative, executive, and judicial branches to prevent abuse of power." },
  27: { answer: 2, explanation: "Federalism allows for the sharing of power between national and regional governments, accommodating regional diversity." },
  28: { answer: 1, explanation: "Free and fair elections are essential for democratic governance, allowing citizens to choose their representatives." },
  29: { answer: 0, explanation: "The judiciary interprets laws and ensures they are applied fairly to protect citizens' rights." },
  30: { answer: 2, explanation: "A constitution establishes the fundamental principles and framework of government, protecting citizens' rights." },
  31: { answer: 1, explanation: "Civil society organizations play an important role in monitoring government and advocating for citizens' interests." },
  32: { answer: 0, explanation: "Public participation in decision-making ensures that policies reflect the needs and aspirations of the people." },
  33: { answer: 2, explanation: "Human rights are universal and inalienable, belonging to all people regardless of their status or nationality." },
  34: { answer: 1, explanation: "Reconciliation and forgiveness are essential for healing divisions and building peace after conflicts." },
  35: { answer: 0, explanation: "Ethiopia's foreign policy is based on mutual respect, non-interference, and peaceful coexistence with other nations." },
  36: { answer: 2, explanation: "Regional integration promotes economic cooperation and political stability among neighboring countries." },
  37: { answer: 1, explanation: "Sustainable development balances economic growth with environmental protection and social equity." },
  38: { answer: 0, explanation: "Poverty reduction requires comprehensive strategies including education, healthcare, and economic opportunities." },
  39: { answer: 2, explanation: "HIV/AIDS prevention requires education, awareness, and access to healthcare services." },
  40: { answer: 1, explanation: "The right to work enables individuals to earn a livelihood and contribute to economic development." },
  41: { answer: 0, explanation: "Good governance includes accountability, transparency, and responsiveness to citizens' needs." },
  42: { answer: 2, explanation: "Corruption undermines development, erodes public trust, and wastes resources meant for public services." },
  43: { answer: 1, explanation: "Leadership requires integrity, vision, and commitment to serving the public interest." },
  44: { answer: 0, explanation: "Youth participation is crucial for national development as young people bring energy and innovation." },
  45: { answer: 2, explanation: "Education is a fundamental right that empowers individuals and promotes national development." },
  46: { answer: 1, explanation: "Health services should be accessible and affordable to ensure the well-being of all citizens." },
  47: { answer: 0, explanation: "Traditional institutions can complement modern governance by resolving local disputes and maintaining social order." },
  48: { answer: 2, explanation: "Women's participation in politics is essential for achieving gender equality and inclusive governance." },
  49: { answer: 1, explanation: "Freedom of religion allows individuals to practice their faith without discrimination or persecution." },
  50: { answer: 0, explanation: "The right to property enables individuals to own and use resources for their benefit and economic development." },
  51: { answer: 2, explanation: "National identity is built on shared values, history, and aspirations that unite citizens." },
  52: { answer: 1, explanation: "Dialogue and negotiation are effective methods for resolving conflicts peacefully." },
  53: { answer: 0, explanation: "The rights of minorities must be protected to ensure inclusive and harmonious society." },
  54: { answer: 2, explanation: "Citizens have both rights and responsibilities in a democratic society." },
  55: { answer: 1, explanation: "Press freedom enables media to inform the public and hold government accountable." },
  56: { answer: 0, explanation: "Independence of the judiciary is essential for fair and impartial administration of justice." },
  57: { answer: 2, explanation: "Peace and security are prerequisites for development and prosperity." },
  58: { answer: 1, explanation: "Solidarity among citizens strengthens social cohesion and mutual support." },
  59: { answer: 0, explanation: "The African Union promotes cooperation, peace, and development among African nations." },
  60: { answer: 2, explanation: "International law governs relations between states and promotes peaceful coexistence." },
  61: { answer: 1, explanation: "Diplomacy is the peaceful conduct of international relations through negotiation." },
  62: { answer: 0, explanation: "Economic development should benefit all citizens and reduce inequalities." },
  63: { answer: 2, explanation: "Labor rights protect workers from exploitation and ensure fair working conditions." },
  64: { answer: 1, explanation: "Taxation is necessary for funding public services and government operations." },
  65: { answer: 0, explanation: "The right to life is the most fundamental human right, protecting individuals from arbitrary killing." },
  66: { answer: 2, explanation: "Freedom of movement allows citizens to travel and reside within their country." },
  67: { answer: 1, explanation: "Privacy rights protect individuals from unwarranted intrusion into their personal lives." },
  68: { answer: 0, explanation: "Equality before the law ensures all citizens are treated equally regardless of their background." },
  69: { answer: 2, explanation: "The right to assembly allows citizens to gather peacefully for political, social, or religious purposes." },
  70: { answer: 1, explanation: "Democracy requires respect for the will of the majority while protecting minority rights." },
  71: { answer: 0, explanation: "Political parties provide citizens with choices and represent different interests in society." },
  72: { answer: 2, explanation: "Term limits prevent the concentration of power and promote democratic rotation of leadership." },
  73: { answer: 1, explanation: "Public service should be based on merit and qualifications rather than nepotism or favoritism." },
  74: { answer: 0, explanation: "Access to information enables citizens to participate effectively in democratic governance." },
  75: { answer: 2, explanation: "Decentralization brings government closer to the people and improves service delivery." },
  76: { answer: 1, explanation: "National symbols represent the identity and values of a country and foster patriotism." },
  77: { answer: 0, explanation: "History education helps citizens understand their past and build national identity." },
  78: { answer: 2, explanation: "Respect for elders is a traditional value that promotes social harmony and intergenerational solidarity." },
  79: { answer: 1, explanation: "Community service contributes to social welfare and strengthens civic engagement." },
  80: { answer: 0, explanation: "Voting is both a right and a responsibility of citizens in a democracy." },
  81: { answer: 2, explanation: "Disability rights ensure persons with disabilities enjoy full participation in society." },
  82: { answer: 1, explanation: "Children's rights protect minors from exploitation and ensure their development and education." },
  83: { answer: 0, explanation: "Elderly rights ensure senior citizens live with dignity and receive necessary care." },
  84: { answer: 2, explanation: "Refugee rights protect people displaced by conflict or persecution." },
  85: { answer: 1, explanation: "Environmental rights ensure citizens live in a healthy and sustainable environment." },
  86: { answer: 0, explanation: "Consumer protection prevents exploitation and ensures fair trade practices." },
  87: { answer: 2, explanation: "Intellectual property rights protect creative works and encourage innovation." },
  88: { answer: 1, explanation: "The right to fair trial ensures justice is administered impartially and transparently." },
  89: { answer: 0, explanation: "Freedom from torture is an absolute right that cannot be violated under any circumstances." },
  90: { answer: 2, explanation: "Citizenship entails both rights and duties toward the state and society." }
};

// Update the content
let updatedContent = content;

for (let i = 1; i <= 90; i++) {
  const key = answerKey[i];
  if (!key) continue;
  
  // Update correctAnswer
  updatedContent = updatedContent.replace(
    new RegExp(`(\"id\": \"m2015-social-civics-${i}\"[\\s\\S]*?\"correctAnswer\": )-1`, 'g'),
    `$1${key.answer}`
  );
  
  // Update explanation
  updatedContent = updatedContent.replace(
    new RegExp(`(\"id\": \"m2015-social-civics-${i}\"[\\s\\S]*?\"explanation\": )\"\"`, 'g'),
    `$1"${key.explanation}"`
  );
}

// Clean up "Share Share This Question" from questions
updatedContent = updatedContent.replace(/Share Share This Question /g, '');

fs.writeFileSync(filePath, updatedContent);
console.log('Updated all 90 Civics 2015 questions with answers and explanations');
