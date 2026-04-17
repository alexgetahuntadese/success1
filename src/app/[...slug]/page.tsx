'use client';

import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import PremiumRoute from '@/components/PremiumRoute';
import { Navigate } from '@/lib/router';
import AuthDebug from '@/components/debug/AuthDebug';
import PaymentDebug from '@/components/debug/PaymentDebug';
import BooksPage from '@/screens/BooksPage';
import BookSubjectsPage from '@/screens/BookSubjectsPage';
import CareerSimulatorPage from '@/screens/CareerSimulatorPage';
import ChaptersPage from '@/screens/ChaptersPage';
import DashboardPage from '@/screens/DashboardPage';
import GradeSelection from '@/screens/GradeSelection';
import GradesPage from '@/screens/GradesPage';
import HostPage from '@/screens/HostPage';
import JoinPage from '@/screens/JoinPage';
import LoginPage from '@/screens/LoginPage';
import MatricExamPage from '@/screens/MatricExamPage';
import MatricQuizPage from '@/screens/MatricQuizPage';
import MatricStreamPage from '@/screens/MatricStreamPage';
import MatricYearPage from '@/screens/MatricYearPage';
import NotesChaptersPage from '@/screens/NotesChaptersPage';
import NotesPage from '@/screens/NotesPage';
import NotesSubjectsPage from '@/screens/NotesSubjectsPage';
import PaymentPage from '@/screens/PaymentPage';
import PerformancePage from '@/screens/PerformancePage';
import ProfilePage from '@/screens/ProfilePage';
import QuizPage from '@/screens/QuizPage';
import SessionPage from '@/screens/SessionPage';
import SignUpPage from '@/screens/SignUpPage';
import SubjectsPage from '@/screens/SubjectsPage';
import WebRtcPage from '@/screens/WebRtcPage';

const routes = [
  { pattern: /^\/debug\/auth\/?$/, content: () => <AuthDebug />, access: 'protected' as const },
  { pattern: /^\/grade\/([^/]+)\/subject\/([^/]+)\/chapter\/([^/]+)\/difficulty\/([^/]+)\/quiz\/?$/, content: () => <QuizPage />, access: 'free' as const },
  { pattern: /^\/grade\/([^/]+)\/subject\/([^/]+)\/chapters\/?$/, content: () => <ChaptersPage />, access: 'free' as const },
  { pattern: /^\/grade\/([^/]+)\/subject\/([^/]+)\/?$/, redirect: (m: RegExpMatchArray) => `/grade/${m[1]}/subject/${m[2]}/chapters` },
  { pattern: /^\/grade\/([^/]+)\/subjects\/?$/, content: () => <SubjectsPage />, access: 'free' as const },
  { pattern: /^\/grade\/([^/]+)\/?$/, content: () => <GradeSelection />, access: 'free' as const },
  { pattern: /^\/grades\/?$/, content: () => <GradesPage />, access: 'free' as const },
  { pattern: /^\/career-simulator\/?$/, content: () => <CareerSimulatorPage />, access: 'protected' as const },
  { pattern: /^\/dashboard\/?$/, content: () => <DashboardPage />, access: 'protected' as const },
  { pattern: /^\/performance\/?$/, content: () => <PerformancePage />, access: 'protected' as const },
  { pattern: /^\/profile\/?$/, content: () => <ProfilePage />, access: 'protected' as const },
  { pattern: /^\/matric\/([^/]+)\/([^/]+)\/([^/]+)\/?$/, content: () => <MatricQuizPage />, access: 'premium' as const },
  { pattern: /^\/matric\/([^/]+)\/([^/]+)\/?$/, content: () => <MatricYearPage />, access: 'premium' as const },
  { pattern: /^\/matric\/([^/]+)\/?$/, content: () => <MatricStreamPage />, access: 'premium' as const },
  { pattern: /^\/matric\/?$/, content: () => <MatricExamPage />, access: 'premium' as const },
  { pattern: /^\/notes\/([^/]+)\/([^/]+)\/?$/, content: () => <NotesChaptersPage />, access: 'free' as const },
  { pattern: /^\/notes\/([^/]+)\/?$/, content: () => <NotesSubjectsPage />, access: 'free' as const },
  { pattern: /^\/notes\/?$/, content: () => <NotesPage />, access: 'free' as const },
  { pattern: /^\/books\/([^/]+)\/?$/, content: () => <BookSubjectsPage />, access: 'free' as const },
  { pattern: /^\/books\/?$/, content: () => <BooksPage />, access: 'free' as const },
  { pattern: /^\/payment\/?$/, content: () => <PaymentPage />, access: 'protected' as const },
  { pattern: /^\/host\/?$/, content: () => <HostPage />, access: 'protected' as const },
  { pattern: /^\/join\/?$/, content: () => <JoinPage />, access: 'protected' as const },
  { pattern: /^\/session\/([^/]+)\/?$/, content: () => <SessionPage />, access: 'protected' as const },
  { pattern: /^\/webrtc\/?$/, content: () => <WebRtcPage />, access: 'protected' as const },
  { pattern: /^\/login\/?$/, content: () => <LoginPage />, access: 'public' as const },
  { pattern: /^\/signup\/?$/, content: () => <SignUpPage />, access: 'public' as const },
];

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
    <div className="max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-12 text-center shadow-xl">
      <h1 className="text-4xl font-bold mb-4">Page not found</h1>
      <p className="text-slate-300 mb-6">The page you are looking for does not exist.</p>
      <a href="/" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
        Go to home
      </a>
    </div>
  </div>
);

export default function CatchAllPage() {
  const pathname = usePathname() || '/';
  const normalizedPath = pathname.replace(/\/+$|\s+$/g, '') || '/';

  for (const route of routes) {
    const match = normalizedPath.match(route.pattern);
    if (!match) continue;

    if ('redirect' in route && route.redirect) {
      return <Navigate to={route.redirect(match)} replace />;
    }

    const element = route.content();

    if (route.access === 'protected') {
      return <ProtectedRoute>{element}</ProtectedRoute>;
    }

    if (route.access === 'public') {
      return <PublicRoute>{element}</PublicRoute>;
    }

    if (route.access === 'premium') {
      return <PremiumRoute>{element}</PremiumRoute>;
    }

    return element;
  }

  return <NotFoundPage />;
}
