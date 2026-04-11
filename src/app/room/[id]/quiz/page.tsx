'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import QuizInterface from '@/components/QuizInterface';
import { getMatricQuestions, type MatricExamQuestion } from '@/data/matricExams';

interface RoomMeta {
  year: string;
  stream: string;
  subject: string;
}

const mapMatricQuestion = (question: MatricExamQuestion) => ({
  id: question.id,
  question: question.question,
  options: question.options,
  correct: question.options[question.correctAnswer] ?? question.options[0] ?? '',
  explanation: question.explanation || '',
});

const RoomQuizPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [roomMeta, setRoomMeta] = useState<RoomMeta | null>(null);
  const [questions, setQuestions] = useState<ReturnType<typeof mapMatricQuestion>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    try {
      const stored = localStorage.getItem(`roomMeta:${id}`);
      if (stored) {
        setRoomMeta(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to read room metadata from storage', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!roomMeta) return;

    let active = true;
    setLoading(true);
    setLoadError(null);

    getMatricQuestions(parseInt(roomMeta.year, 10), roomMeta.stream, roomMeta.subject)
      .then((items) => {
        if (!active) return;
        setQuestions(items.map(mapMatricQuestion));
      })
      .catch((error) => {
        console.error('Failed to load matric questions', error);
        if (!active) return;
        setLoadError('Unable to load room quiz questions.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [roomMeta]);

  const quiz = useMemo(() => {
    if (roomMeta) {
      return {
        id: id ?? 'unknown-room-quiz',
        title: `${roomMeta.subject} room quiz`,
        subject: roomMeta.subject,
        difficulty: 'Medium' as const,
        duration: 10,
        questions: questions?.length ?? 10,
        chapters: [roomMeta.subject],
      };
    }

    return {
      id: id ?? 'unknown-room-quiz',
      title: 'Room quiz challenge',
      subject: 'Mathematics',
      difficulty: 'Medium' as const,
      duration: 10,
      questions: 8,
      chapters: ['chapter1', 'chapter2'],
    };
  }, [id, roomMeta, questions]);

  const user = useMemo(() => ({ name: 'Participant' }), []);

  const onComplete = useCallback((result: unknown) => {
    console.log('Quiz completed for room', id, result);
    router.push(`/room/${id}`);
  }, [id, router]);

  const onBack = useCallback(() => {
    router.push(`/room/${id}`);
  }, [id, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Room quiz</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{quiz.title}</h1>
            <p className="mt-1 text-sm text-slate-400">Room ID: {id}</p>
            {roomMeta && (
              <p className="text-sm text-slate-500">{roomMeta.year} E.C. · {roomMeta.stream}</p>
            )}
          </div>
          <Link
            href={`/room/${id}`}
            className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Back to room
          </Link>
        </div>

        {loadError ? (
          <div className="rounded-3xl border border-rose-600 bg-rose-950/10 p-6 text-rose-200">
            <p className="text-lg font-semibold">{loadError}</p>
            <p className="mt-2 text-sm text-rose-300">You can still take the default room quiz or return to the room.</p>
          </div>
        ) : loading ? (
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 text-center">
            <p className="text-lg text-white">Loading room quiz...</p>
          </div>
        ) : (
          <QuizInterface quiz={quiz} user={user} questions={questions ?? undefined} onComplete={onComplete} onBack={onBack} />
        )}
      </div>
    </div>
  );
};

export default RoomQuizPage;
