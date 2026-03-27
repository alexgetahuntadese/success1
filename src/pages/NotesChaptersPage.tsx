import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, GraduationCap, NotebookPen, Sparkles } from "lucide-react";
import TopBar from "@/components/TopBar";
import StarField from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFocusNote, getNotesSubject } from "@/lib/notesData";

const NotesChaptersPage = () => {
  const navigate = useNavigate();
  const { grade, subject } = useParams();
  const gradeNumber = Number(grade);
  const decodedSubject = decodeURIComponent(subject || "");
  const subjectData = getNotesSubject(gradeNumber, decodedSubject);

  if (!subjectData) {
    return <Navigate to={`/notes/${gradeNumber}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-8 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={40} shootingCount={4} />
      <TopBar />

      <div className="max-w-5xl mx-auto relative z-10">
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/5 mb-8 transition-colors"
          onClick={() => navigate(`/notes/${gradeNumber}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Subjects
        </Button>

        <div className="text-center mb-12 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-6">
            <GraduationCap className="h-4 w-4" />
            Grade {gradeNumber} • {decodedSubject}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Chapter Notes
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Short revision notes only, organized on a dedicated page and kept separate from the quiz flow.
          </p>
        </div>

        <div className="space-y-5">
          {subjectData.chapters.map((chapter, index) => (
            <div
              key={chapter}
              className="group relative opacity-0 animate-fade-in"
              style={{ animationDelay: `${0.08 + index * 0.04}s`, animationFillMode: "forwards" }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 md:p-7 transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/[0.15] shadow-2xl">
                <Sparkles className="absolute top-4 right-4 h-4 w-4 text-white/10 group-hover:text-white/30 transition-colors duration-500" />
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg ring-4 ring-white/10 shrink-0">
                    <NotebookPen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge className="bg-white/10 text-white border-0">Grade {gradeNumber}</Badge>
                      <Badge variant="outline" className="text-white/60 border-white/15">{decodedSubject}</Badge>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-white mb-2">{chapter}</h2>
                    <p className="text-sm md:text-base text-white/55 leading-7">
                      {getFocusNote(decodedSubject, chapter)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            onClick={() => navigate(`/grade/${gradeNumber}/subject/${encodeURIComponent(decodedSubject)}/chapters`)}
            className="bg-white text-slate-950 hover:bg-white/90 rounded-xl"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Open Quiz Chapters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotesChaptersPage;
