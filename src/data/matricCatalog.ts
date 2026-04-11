export interface MatricSubjectSource {
  modulePath?: string;
  questionCount: number;
}

export interface MatricCatalogSubject {
  subject: string;
  questionCount: number;
  modulePath?: string;
}

export interface MatricCatalogStream {
  key: string;
  label: string;
  subjects: MatricCatalogSubject[];
}

export interface MatricCatalogYear {
  year: number;
  streams: MatricCatalogStream[];
}

export const matricCatalog: MatricCatalogYear[] = [
  {
    year: 2017,
    streams: [
      {
        key: "natural",
        label: "Natural Science",
        subjects: [
          { subject: "Mathematics", questionCount: 53, modulePath: "./matric2017MathQuestions.ts" },
          { subject: "Physics", questionCount: 59, modulePath: "./matric2017PhysicsQuestions.ts" },
          { subject: "Chemistry", questionCount: 78, modulePath: "./matric2017ChemistryQuestions.ts" },
          { subject: "Biology", questionCount: 60, modulePath: "./matric2017BiologyQuestions.ts" },
          { subject: "English", questionCount: 95, modulePath: "./matric2017EnglishQuestions.ts" },
          { subject: "Scholastic Aptitude Test", questionCount: 60, modulePath: "./matric2017ScholasticAptitudeQuestions.ts" },
          { subject: "Civics", questionCount: 0 },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questionCount: 64, modulePath: "./matric2017SocialMathQuestions.ts" },
          { subject: "English", questionCount: 100, modulePath: "./matric2017SocialEnglishQuestions.ts" },
          { subject: "Civics", questionCount: 0 },
          { subject: "History", questionCount: 100, modulePath: "./matric2017SocialHistoryQuestions.ts" },
          { subject: "Geography", questionCount: 100, modulePath: "./matric2017SocialGeographyQuestions.ts" },
          { subject: "Economics", questionCount: 0 },
          { subject: "Scholastic Aptitude Test", questionCount: 60, modulePath: "./matric2017SocialScholasticAptitudeQuestions.ts" },
        ],
      },
    ],
  },
  {
    year: 2016,
    streams: [
      {
        key: "natural",
        label: "Natural Science",
        subjects: [
          { subject: "Mathematics", questionCount: 60, modulePath: "./matric2016MathQuestions.ts" },
          { subject: "Physics", questionCount: 50, modulePath: "./matric2016PhysicsQuestions.ts" },
          { subject: "Chemistry", questionCount: 80, modulePath: "./matric2016ChemistryQuestions.ts" },
          { subject: "Biology", questionCount: 100, modulePath: "./matric2016BiologyQuestions.ts" },
          { subject: "English", questionCount: 100, modulePath: "./matric2016EnglishQuestions.ts" },
          { subject: "Scholastic Aptitude Test", questionCount: 60, modulePath: "./matric2016ScholasticAptitudeQuestions.ts" },
          { subject: "Civics", questionCount: 0 },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questionCount: 52, modulePath: "./matric2016SocialMathQuestions.ts" },
          { subject: "English", questionCount: 95, modulePath: "./matric2016SocialEnglishQuestions.ts" },
          { subject: "Civics", questionCount: 0 },
          { subject: "History", questionCount: 100, modulePath: "./matric2016SocialHistoryQuestions.ts" },
          { subject: "Geography", questionCount: 100, modulePath: "./matric2016SocialGeographyQuestions.ts" },
          { subject: "Economics", questionCount: 80, modulePath: "./matric2016SocialEconomicsQuestions.ts" },
          { subject: "Scholastic Aptitude Test", questionCount: 60, modulePath: "./matric2016SocialScholasticAptitudeQuestions.ts" },
        ],
      },
    ],
  },
  {
    year: 2015,
    streams: [
      {
        key: "natural",
        label: "Natural Science",
        subjects: [
          { subject: "Mathematics", questionCount: 65, modulePath: "./matric2015MathQuestions.ts" },
          { subject: "Physics", questionCount: 50, modulePath: "./matric2015PhysicsQuestions.ts" },
          { subject: "Chemistry", questionCount: 78, modulePath: "./matric2015ChemistryQuestions.ts" },
          { subject: "Biology", questionCount: 98, modulePath: "./matric2015BiologyQuestions.ts" },
          { subject: "English", questionCount: 107, modulePath: "./matric2015EnglishQuestions.ts" },
          { subject: "Civics", questionCount: 0 },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questionCount: 65, modulePath: "./matric2015MathQuestions.ts" },
          { subject: "English", questionCount: 0 },
          { subject: "Civics", questionCount: 0 },
          { subject: "History", questionCount: 0 },
          { subject: "Geography", questionCount: 0 },
          { subject: "Economics", questionCount: 0 },
          { subject: "Scholastic Aptitude Test", questionCount: 0 },
        ],
      },
    ],
  },
  {
    year: 2014,
    streams: [
      {
        key: "natural",
        label: "Natural Science",
        subjects: [
          { subject: "Mathematics", questionCount: 65, modulePath: "./matric2014MathQuestions.ts" },
          { subject: "Physics", questionCount: 0 },
          { subject: "Chemistry", questionCount: 70, modulePath: "./matric2014ChemistryQuestions.ts" },
          { subject: "Biology", questionCount: 99, modulePath: "./matric2014BiologyQuestions.ts" },
          { subject: "English", questionCount: 0 },
          { subject: "Civics", questionCount: 0 },
          { subject: "Scholastic Aptitude Test", questionCount: 0 },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questionCount: 0 },
          { subject: "English", questionCount: 0 },
          { subject: "Civics", questionCount: 0 },
          { subject: "History", questionCount: 0 },
          { subject: "Geography", questionCount: 0 },
          { subject: "Economics", questionCount: 0 },
          { subject: "Scholastic Aptitude Test", questionCount: 0 },
        ],
      },
    ],
  },
  {
    year: 2013,
    streams: [
      {
        key: "natural",
        label: "Natural Science",
        subjects: [
          { subject: "Mathematics", questionCount: 0 },
          { subject: "Physics", questionCount: 0 },
          { subject: "Chemistry", questionCount: 0 },
          { subject: "Biology", questionCount: 0 },
          { subject: "English", questionCount: 0 },
          { subject: "Civics", questionCount: 0 },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questionCount: 0 },
          { subject: "English", questionCount: 0 },
          { subject: "Civics", questionCount: 0 },
          { subject: "History", questionCount: 0 },
          { subject: "Geography", questionCount: 0 },
          { subject: "Economics", questionCount: 0 },
        ],
      },
    ],
  },
];
