import { matric2014MathQuestions } from "./matric2014MathQuestions";
import { matric2014BiologyQuestions } from "./matric2014BiologyQuestions";
import { matric2014ChemistryQuestions } from "./matric2014ChemistryQuestions";
import { matric2014PhysicsQuestions } from "./matric2014PhysicsQuestions";
import { matric2014EnglishQuestions } from "./matric2014EnglishQuestions";
import { matric2014CivicsQuestions } from "./matric2014CivicsQuestions";
import { matric2014SatQuestions } from "./matric2014SatQuestions";
import { matric2014SocialCivicsQuestions } from "./matric2014SocialCivicsQuestions";
import { matric2014SocialEnglishQuestions } from "./matric2014SocialEnglishQuestions";
import { matric2014SocialGeographyQuestions } from "./matric2014SocialGeographyQuestions";
import { matric2014SocialHistoryQuestions } from "./matric2014SocialHistoryQuestions";
import { matric2014SocialMathQuestions } from "./matric2014SocialMathQuestions";
import { matric2014SocialSatQuestions } from "./matric2014SocialSatQuestions";
import { matric2015BiologyQuestions } from "./matric2015BiologyQuestions";
import { matric2015ChemistryQuestions } from "./matric2015ChemistryQuestions";
import { matric2015CivicsQuestions } from "./matric2015CivicsQuestions";
import { matric2015EnglishQuestions } from "./matric2015EnglishQuestions";
import { matric2015SocialEnglishQuestions } from "./matric2015SocialEnglishQuestions";
import { matric2015SocialGeographyQuestions } from "./matric2015SocialGeographyQuestions";
import { matric2015SocialHistoryQuestions } from "./matric2015SocialHistoryQuestions";
import { matric2015SocialScholasticAptitudeQuestions } from "./matric2015SocialScholasticAptitudeQuestions";
import { matric2015MathQuestions } from "./matric2015MathQuestions";
import { matric2015PhysicsQuestions } from "./matric2015PhysicsQuestions";
import { matric2016BiologyQuestions } from "./matric2016BiologyQuestions";
import { matric2016ChemistryQuestions } from "./matric2016ChemistryQuestions";
import { matric2016EnglishQuestions } from "./matric2016EnglishQuestions";
import { matric2016MathQuestions } from "./matric2016MathQuestions";
import { matric2016PhysicsQuestions } from "./matric2016PhysicsQuestions";
import { matric2016SocialEconomicsQuestions } from "./matric2016SocialEconomicsQuestions";
import { matric2016SocialEnglishQuestions } from "./matric2016SocialEnglishQuestions";
import { matric2016SocialGeographyQuestions } from "./matric2016SocialGeographyQuestions";
import { matric2016SocialHistoryQuestions } from "./matric2016SocialHistoryQuestions";
import { matric2016SocialMathQuestions } from "./matric2016SocialMathQuestions";
import { matric2016SocialScholasticAptitudeQuestions } from "./matric2016SocialScholasticAptitudeQuestions";
import { matric2016ScholasticAptitudeQuestions } from "./matric2016ScholasticAptitudeQuestions";
import { matric2017BiologyQuestions } from "./matric2017BiologyQuestions";
import { matric2017ChemistryQuestions } from "./matric2017ChemistryQuestions";
import { matric2017EnglishQuestions } from "./matric2017EnglishQuestions";
import { matric2017MathQuestions } from "./matric2017MathQuestions";
import { matric2017PhysicsQuestions } from "./matric2017PhysicsQuestions";
import { matric2017SocialEconomicsQuestions } from "./matric2017SocialEconomicsQuestions";
import { matric2017SocialEnglishQuestions } from "./matric2017SocialEnglishQuestions";
import { matric2017SocialGeographyQuestions } from "./matric2017SocialGeographyQuestions";
import { matric2017SocialHistoryQuestions } from "./matric2017SocialHistoryQuestions";
import { matric2017SocialMathQuestions } from "./matric2017SocialMathQuestions";
import { matric2017SocialScholasticAptitudeQuestions } from "./matric2017SocialScholasticAptitudeQuestions";
import { matric2017ScholasticAptitudeQuestions } from "./matric2017ScholasticAptitudeQuestions";
import { matric2013MathQuestions } from "./matric2013MathQuestions";
import { matric2013PhysicsQuestions } from "./matric2013PhysicsQuestions";
import { matric2013ChemistryQuestions } from "./matric2013ChemistryQuestions";
import { matric2013BiologyQuestions } from "./matric2013BiologyQuestions";
import { matric2013EnglishQuestions } from "./matric2013EnglishQuestions";
import { matric2013CivicsQuestions } from "./matric2013CivicsQuestions";
import { matric2013SocialCivicsQuestions } from "./matric2013SocialCivicsQuestions";
import { matric2013SocialEnglishQuestions } from "./matric2013SocialEnglishQuestions";
import { matric2013SocialMathQuestions } from "./matric2013SocialMathQuestions";

export interface MatricExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  sectionGroupTitle?: string;
  sectionTitle?: string;
  sectionDirection?: string;
}

export interface MatricExamSubject {
  subject: string;
  questions: MatricExamQuestion[];
}

export interface MatricExamStream {
  key: string;
  label: string;
  subjects: MatricExamSubject[];
}

export interface MatricExamYear {
  year: number;
  streams: MatricExamStream[];
}

export const matricExams: MatricExamYear[] = [
  {
    year: 2017,
    streams: [
      {
        key: "natural",
        label: "Natural Science",
        subjects: [
          { subject: "Mathematics", questions: matric2017MathQuestions },
          { subject: "Physics", questions: matric2017PhysicsQuestions },
          { subject: "Chemistry", questions: matric2017ChemistryQuestions },
          { subject: "Biology", questions: matric2017BiologyQuestions },
          { subject: "English", questions: matric2017EnglishQuestions },
          { subject: "Scholastic Aptitude Test", questions: matric2017ScholasticAptitudeQuestions },
          { subject: "Civics", questions: [] },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questions: matric2017SocialMathQuestions },
          { subject: "English", questions: matric2017SocialEnglishQuestions },
          { subject: "Civics", questions: [] },
          { subject: "History", questions: matric2017SocialHistoryQuestions },
          { subject: "Geography", questions: matric2017SocialGeographyQuestions },
          { subject: "Economics", questions: matric2017SocialEconomicsQuestions },
          { subject: "Scholastic Aptitude Test", questions: matric2017SocialScholasticAptitudeQuestions },
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
          { subject: "Mathematics", questions: matric2016MathQuestions },
          { subject: "Physics", questions: matric2016PhysicsQuestions },
          { subject: "Chemistry", questions: matric2016ChemistryQuestions },
          { subject: "Biology", questions: matric2016BiologyQuestions },
          { subject: "English", questions: matric2016EnglishQuestions },
          { subject: "Scholastic Aptitude Test", questions: matric2016ScholasticAptitudeQuestions },
          { subject: "Civics", questions: [] },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questions: matric2016SocialMathQuestions },
          { subject: "English", questions: matric2016SocialEnglishQuestions },
          { subject: "Civics", questions: [] },
          { subject: "History", questions: matric2016SocialHistoryQuestions },
          { subject: "Geography", questions: matric2016SocialGeographyQuestions },
          { subject: "Economics", questions: matric2016SocialEconomicsQuestions },
          { subject: "Scholastic Aptitude Test", questions: matric2016SocialScholasticAptitudeQuestions },
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
          { subject: "Mathematics", questions: matric2015MathQuestions },
          { subject: "Physics", questions: matric2015PhysicsQuestions },
          { subject: "Chemistry", questions: matric2015ChemistryQuestions },
          { subject: "Biology", questions: matric2015BiologyQuestions },
          { subject: "English", questions: matric2015EnglishQuestions },
          { subject: "Civics", questions: matric2015CivicsQuestions },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questions: matric2015MathQuestions },
          { subject: "English", questions: matric2015SocialEnglishQuestions },
          { subject: "Civics", questions: matric2015CivicsQuestions },
          { subject: "History", questions: matric2015SocialHistoryQuestions },
          { subject: "Geography", questions: matric2015SocialGeographyQuestions },
          { subject: "Economics", questions: [] },
          { subject: "Scholastic Aptitude Test", questions: matric2015SocialScholasticAptitudeQuestions },
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
          { subject: "Mathematics", questions: matric2014MathQuestions },
          { subject: "Physics", questions: matric2014PhysicsQuestions },
          { subject: "Chemistry", questions: matric2014ChemistryQuestions },
          { subject: "Biology", questions: matric2014BiologyQuestions },
          { subject: "English", questions: matric2014EnglishQuestions },
          { subject: "Civics", questions: matric2014CivicsQuestions },
          { subject: "Scholastic Aptitude Test", questions: matric2014SatQuestions },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questions: matric2014SocialMathQuestions },
          { subject: "English", questions: matric2014SocialEnglishQuestions },
          { subject: "Civics", questions: matric2014SocialCivicsQuestions },
          { subject: "History", questions: matric2014SocialHistoryQuestions },
          { subject: "Geography", questions: matric2014SocialGeographyQuestions },
          { subject: "Economics", questions: [] },
          { subject: "Scholastic Aptitude Test", questions: matric2014SocialSatQuestions },
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
          { subject: "Mathematics", questions: matric2013MathQuestions },
          { subject: "Physics", questions: matric2013PhysicsQuestions },
          { subject: "Chemistry", questions: matric2013ChemistryQuestions },
          { subject: "Biology", questions: matric2013BiologyQuestions },
          { subject: "English", questions: matric2013EnglishQuestions },
          { subject: "Civics", questions: matric2013CivicsQuestions },
        ],
      },
      {
        key: "social",
        label: "Social Science",
        subjects: [
          { subject: "Mathematics", questions: matric2013SocialMathQuestions },
          { subject: "English", questions: matric2013SocialEnglishQuestions },
          { subject: "Civics", questions: matric2013SocialCivicsQuestions },
          { subject: "History", questions: [] },
          { subject: "Geography", questions: [] },
          { subject: "Economics", questions: [] },
        ],
      },
    ],
  },
];

export const getMatricYears = () => matricExams.map((e) => e.year);

export const getMatricStreamsForYear = (year: number) =>
  matricExams.find((e) => e.year === year)?.streams ?? [];

export const getMatricSubjectsForYear = (year: number, stream: string) =>
  matricExams
    .find((e) => e.year === year)
    ?.streams.find((s) => s.key === stream)
    ?.subjects.filter((subject) => subject.questions.length > 0) ?? [];

export const getMatricQuestions = (year: number, stream: string, subject: string) =>
  matricExams
    .find((e) => e.year === year)
    ?.streams.find((s) => s.key === stream)
    ?.subjects.find((s) => s.subject === subject)
    ?.questions ?? [];
