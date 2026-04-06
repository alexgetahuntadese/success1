import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import AuthProvider from "@/contexts/AuthContext";
import RequireAuth from "@/components/auth/RequireAuth";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy load components for code splitting
const Index = lazy(() => import("./pages/Index"));
const GradeSelection = lazy(() => import("./pages/GradeSelection"));
const GradesPage = lazy(() => import("./pages/GradesPage"));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage"));
const ChaptersPage = lazy(() => import("./pages/ChaptersPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const CareerSimulatorPage = lazy(() => import("./pages/CareerSimulatorPage"));
const PerformancePage = lazy(() => import("./pages/PerformancePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MatricExamPage = lazy(() => import("./pages/MatricExamPage"));
const MatricStreamPage = lazy(() => import("./pages/MatricStreamPage"));
const MatricYearPage = lazy(() => import("./pages/MatricYearPage"));
const MatricQuizPage = lazy(() => import("./pages/MatricQuizPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const NotesSubjectsPage = lazy(() => import("./pages/NotesSubjectsPage"));
const NotesChaptersPage = lazy(() => import("./pages/NotesChaptersPage"));
const BooksPage = lazy(() => import("./pages/BooksPage"));
const BookSubjectsPage = lazy(() => import("./pages/BookSubjectsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

// Redirect component for auth fallback
const LoginRedirect = () => <Navigate to="/login" replace />;
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
    <div className="flex flex-col items-center gap-4 text-white">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-sm">Loading...</span>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Analytics />
              <SpeedInsights />
              <Routes>
                <Route path="/" element={
                  <Suspense fallback={<PageLoader />}>
                    <Index />
                  </Suspense>
                } />
                <Route path="/grades" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <GradesPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/grade/:grade" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <GradeSelection />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/grade/:grade/subjects" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <SubjectsPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route
                  path="/grade/:grade/subject/:subject"
                  element={<Navigate to="chapters" replace />}
                />
                <Route path="/grade/:grade/subject/:subject/chapters" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <ChaptersPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/grade/:grade/subject/:subject/chapter/:chapterId/difficulty/:difficulty/quiz" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <QuizPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/career-simulator" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <CareerSimulatorPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/performance" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <PerformancePage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/profile" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <ProfilePage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/matric" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <MatricExamPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/matric/:year" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <MatricStreamPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/matric/:year/:stream" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <MatricYearPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/matric/:year/:stream/:subject" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <MatricQuizPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/notes" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <NotesPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/notes/:grade" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <NotesSubjectsPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/notes/:grade/:subject" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <NotesChaptersPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/books" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <BooksPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/books/:grade" element={
                  <RequireAuth fallback={<LoginRedirect />}>
                    <Suspense fallback={<PageLoader />}>
                      <BookSubjectsPage />
                    </Suspense>
                  </RequireAuth>
                } />
                <Route path="/login" element={
                  <Suspense fallback={<PageLoader />}>
                    <LoginPage />
                  </Suspense>
                } />
                <Route path="/signup" element={
                  <Suspense fallback={<PageLoader />}>
                    <SignUpPage />
                  </Suspense>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
