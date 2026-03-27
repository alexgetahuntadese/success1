
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Index from "./pages/Index";
import GradeSelection from "./pages/GradeSelection";
import GradesPage from "./pages/GradesPage";
import SubjectsPage from "./pages/SubjectsPage";
import ChaptersPage from "./pages/ChaptersPage";
import QuizPage from "./pages/QuizPage";
import CareerSimulatorPage from "./pages/CareerSimulatorPage";
import PerformancePage from "./pages/PerformancePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import MatricExamPage from "./pages/MatricExamPage";
import MatricStreamPage from "./pages/MatricStreamPage";
import MatricYearPage from "./pages/MatricYearPage";
import MatricQuizPage from "./pages/MatricQuizPage";
import NotesPage from "./pages/NotesPage";
import NotesSubjectsPage from "./pages/NotesSubjectsPage";
import NotesChaptersPage from "./pages/NotesChaptersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/grade/:grade" element={<GradeSelection />} />
              <Route path="/grade/:grade/subjects" element={<SubjectsPage />} />
              <Route
                path="/grade/:grade/subject/:subject"
                element={<Navigate to="chapters" replace />}
              />
              <Route path="/grade/:grade/subject/:subject/chapters" element={<ChaptersPage />} />
              <Route path="/grade/:grade/subject/:subject/chapter/:chapterId/difficulty/:difficulty/quiz" element={<QuizPage />} />
              <Route path="/career-simulator" element={<CareerSimulatorPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/matric" element={<MatricExamPage />} />
              <Route path="/matric/:year" element={<MatricStreamPage />} />
              <Route path="/matric/:year/:stream" element={<MatricYearPage />} />
              <Route path="/matric/:year/:stream/:subject" element={<MatricQuizPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/:grade" element={<NotesSubjectsPage />} />
              <Route path="/notes/:grade/:subject" element={<NotesChaptersPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
