import { motion } from "framer-motion";
import { useNavigate } from "@/lib/router";
import { ArrowRight, FileText, ShieldCheck } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-500 text-slate-950 shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Simple Road</p>
              <p className="text-sm text-slate-400">Ethiopian exam preparation</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Login
          </button>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_0.8fr] lg:items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              Ethiopian exam preparation, simplified.
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Practice Ethiopian matric and entrance exam questions with one clear study path.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Focus on real exam preparation: past questions, subject quizzes, and textbook support organized by grade.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/matric")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Start exam practice
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-10 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 text-slate-300">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">What you get</p>
              <ul className="mt-4 space-y-3 text-base leading-7 text-slate-300">
                <li>• Past matric and entrance exam questions by year.</li>
                <li>• Ethiopian subject quizzes designed for real exam topics.</li>
                <li>• One focused study path without marketing noise.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-700 bg-slate-900/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.6)]">
            <div className="flex items-center gap-4 text-slate-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Exam practice</p>
                <p className="mt-2 text-lg font-semibold text-white">One clear focus: practice the questions that matter.</p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-slate-300">
              <p>
                Jump straight into Ethiopian exam practice with a dedicated flow for matric and university entrance questions.
              </p>
              <p>
                No extra product messaging, just the study tools students need to prepare confidently.
              </p>
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Index;
