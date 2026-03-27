import { matric2014MathQuestions } from "./matric2014MathQuestions";
import { matric2015BiologyQuestions } from "./matric2015BiologyQuestions";
import { matric2015EnglishQuestions } from "./matric2015EnglishQuestions";
import { matric2015MathQuestions } from "./matric2015MathQuestions";
import { matric2015PhysicsQuestions } from "./matric2015PhysicsQuestions";
import { matric2016BiologyQuestions } from "./matric2016BiologyQuestions";
import { matric2016ChemistryQuestions } from "./matric2016ChemistryQuestions";
import { matric2016EnglishQuestions } from "./matric2016EnglishQuestions";
import { matric2016MathQuestions } from "./matric2016MathQuestions";
import { matric2016PhysicsQuestions } from "./matric2016PhysicsQuestions";
import { matric2016ScholasticAptitudeQuestions } from "./matric2016ScholasticAptitudeQuestions";
import { matric2017BiologyQuestions } from "./matric2017BiologyQuestions";
import { matric2017ChemistryQuestions } from "./matric2017ChemistryQuestions";
import { matric2017EnglishQuestions } from "./matric2017EnglishQuestions";
import { matric2017MathQuestions } from "./matric2017MathQuestions";
import { matric2017PhysicsQuestions } from "./matric2017PhysicsQuestions";
import { matric2017ScholasticAptitudeQuestions } from "./matric2017ScholasticAptitudeQuestions";

export interface MatricExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface MatricExamSubject {
  subject: string;
  questions: MatricExamQuestion[];
}

export interface MatricExamYear {
  year: number;
  subjects: MatricExamSubject[];
}

export const matricExams: MatricExamYear[] = [
  {
    year: 2017,
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
    year: 2016,
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
    year: 2015,
    subjects: [
      { subject: "Mathematics", questions: matric2015MathQuestions },
      { subject: "Physics", questions: matric2015PhysicsQuestions },
      { subject: "Chemistry", questions: [] },
      { subject: "Biology", questions: matric2015BiologyQuestions },
      { subject: "English", questions: matric2015EnglishQuestions },
      { subject: "Civics", questions: [] },
    ],
  },
  {
    year: 2014,
    subjects: [
      { subject: "Mathematics", questions: matric2014MathQuestions },
      { subject: "Physics", questions: [] },
      { subject: "Chemistry", questions: [] },
      { subject: "Biology", questions: [] },
      { subject: "English", questions: [] },
      { subject: "Civics", questions: [] },
    ],
  },
  {
    year: 2013,
    subjects: [
      { subject: "Mathematics", questions: [] },
      { subject: "Physics", questions: [] },
      { subject: "Chemistry", questions: [] },
      { subject: "Biology", questions: [] },
      { subject: "English", questions: [] },
      { subject: "Civics", questions: [] },
    ],
  },
];

export const getMatricYears = () => matricExams.map((e) => e.year);

export const getMatricSubjectsForYear = (year: number) =>
  matricExams.find((e) => e.year === year)?.subjects ?? [];

export const getMatricQuestions = (year: number, subject: string) =>
  matricExams
    .find((e) => e.year === year)
    ?.subjects.find((s) => s.subject === subject)
    ?.questions ?? [];
