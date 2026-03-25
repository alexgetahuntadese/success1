
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import GradeSelection from "./pages/GradeSelection";
import GradesPage from "./pages/GradesPage";
import SubjectsPage from "./pages/SubjectsPage";
import ChaptersPage from "./pages/ChaptersPage";
import QuizPage from "./pages/QuizPage";
import CareerSimulatorPage from "./pages/CareerSimulatorPage";
import PerformancePage from "./pages/PerformancePage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import MatricExamPage from "./pages/MatricExamPage";
import MatricYearPage from "./pages/MatricYearPage";
import MatricQuizPage from "./pages/MatricQuizPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/grades" element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
                <Route path="/grade/:grade" element={<ProtectedRoute><GradeSelection /></ProtectedRoute>} />
                <Route path="/grade/:grade/subjects" element={<ProtectedRoute><SubjectsPage /></ProtectedRoute>} />
                <Route path="/grade/:grade/subject/:subject/chapters" element={<ProtectedRoute><ChaptersPage /></ProtectedRoute>} />
                <Route path="/grade/:grade/subject/:subject/chapter/:chapterId/difficulty/:difficulty/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                <Route path="/career-simulator" element={<ProtectedRoute><CareerSimulatorPage /></ProtectedRoute>} />
                <Route path="/performance" element={<ProtectedRoute><PerformancePage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/matric" element={<ProtectedRoute><MatricExamPage /></ProtectedRoute>} />
                <Route path="/matric/:year" element={<ProtectedRoute><MatricYearPage /></ProtectedRoute>} />
                <Route path="/matric/:year/:subject" element={<ProtectedRoute><MatricQuizPage /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
