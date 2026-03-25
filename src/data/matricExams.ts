import { matric2016MathQuestions } from "./matric2016MathQuestions";

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
    year: 2016,
    subjects: [
      { subject: "Mathematics", questions: matric2016MathQuestions },
      { subject: "Physics", questions: [] },
      { subject: "Chemistry", questions: [] },
      { subject: "Biology", questions: [] },
      { subject: "English", questions: [] },
      { subject: "Civics", questions: [] },
    ],
  },
  {
    year: 2015,
    subjects: [
      { subject: "Mathematics", questions: [] },
      { subject: "Physics", questions: [] },
      { subject: "Chemistry", questions: [] },
      { subject: "Biology", questions: [] },
      { subject: "English", questions: [] },
      { subject: "Civics", questions: [] },
    ],
  },
  {
    year: 2014,
    subjects: [
      { subject: "Mathematics", questions: [] },
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
