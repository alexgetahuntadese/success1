import { matricCatalog } from "./matricCatalog";

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
  questionCount: number;
  questions?: MatricExamQuestion[];
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

type MatricQuestionModule = {
  [key: string]: unknown;
};

const questionModules = import.meta.glob<MatricQuestionModule>("./matric20*.ts");
const questionCache = new Map<string, Promise<MatricExamQuestion[]>>();

const getYearMeta = (year: number) => matricCatalog.find((entry) => entry.year === year);

const getStreamMeta = (year: number, stream: string) =>
  getYearMeta(year)?.streams.find((entry) => entry.key === stream);

const getSubjectMeta = (year: number, stream: string, subject: string) =>
  getStreamMeta(year, stream)?.subjects.find((entry) => entry.subject === subject);

const toStreamSummary = (year: number): MatricExamStream[] =>
  getYearMeta(year)?.streams.map((stream) => ({
    key: stream.key,
    label: stream.label,
    subjects: stream.subjects.map((subject) => ({
      subject: subject.subject,
      questionCount: subject.questionCount,
    })),
  })) ?? [];

export const getMatricYears = () => matricCatalog.map((entry) => entry.year);

export const getMatricStreamsForYear = (year: number) => toStreamSummary(year);

export const getMatricSubjectsForYear = (year: number, stream: string) =>
  getStreamMeta(year, stream)?.subjects
    .filter((subject) => subject.questionCount > 0)
    .map((subject) => ({
      subject: subject.subject,
      questionCount: subject.questionCount,
    })) ?? [];

export const getMatricQuestions = async (
  year: number,
  stream: string,
  subject: string,
) => {
  const source = getSubjectMeta(year, stream, subject);

  if (!source?.modulePath) {
    return [];
  }

  const cached = questionCache.get(source.modulePath);
  if (cached) {
    return cached;
  }

  const loader = questionModules[source.modulePath];
  if (!loader) {
    throw new Error(`Missing matric question module: ${source.modulePath}`);
  }

  const promise = loader().then((module) => {
    const exportName = source.modulePath?.split("/").pop()?.replace(/\.ts$/, "");

    if (!exportName || !(exportName in module)) {
      throw new Error(`Missing export ${exportName} in ${source.modulePath}`);
    }

    return module[exportName as keyof typeof module] as MatricExamQuestion[];
  });

  questionCache.set(source.modulePath, promise);
  return promise;
};

export const getMatricSubjectIndex = (year: number, stream: string, subject: string) =>
  getMatricSubjectsForYear(year, stream).findIndex((entry) => entry.subject === subject);
