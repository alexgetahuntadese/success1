'use client';

import { usePathname } from 'next/navigation';
import { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Navigate, RouterProvider } from '@/lib/router';
import { LanguageProvider } from '@/i18n/LanguageContext';
import AuthProvider from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import PageLoader from '@/components/PageLoader';
import AuthDebug from '@/components/debug/AuthDebug';
import PaymentDebug from '@/components/debug/PaymentDebug';

const Index = lazy(() => import('./screens/Index'));
const LoginPage = lazy(() => import('./screens/LoginPage'));
const SignUpPage = lazy(() => import('./screens/SignUpPage'));
const PaymentPage = lazy(() => import('./screens/PaymentPage'));
const GradesPage = lazy(() => import('./screens/GradesPage'));
const SubjectsPage = lazy(() => import('./screens/SubjectsPage'));
const ChaptersPage = lazy(() => import('./screens/ChaptersPage'));
const DashboardPage = lazy(() => import('./screens/DashboardPage'));
const GradeSelection = lazy(() => import('./screens/GradeSelection'));
const QuizPage = lazy(() => import('./screens/QuizPage'));
const CareerSimulatorPage = lazy(() => import('./screens/CareerSimulatorPage'));
const PerformancePage = lazy(() => import('./screens/PerformancePage'));
const ProfilePage = lazy(() => import('./screens/ProfilePage'));
const MatricExamPage = lazy(() => import('./screens/MatricExamPage'));
const MatricStreamPage = lazy(() => import('./screens/MatricStreamPage'));
const MatricYearPage = lazy(() => import('./screens/MatricYearPage'));
const MatricQuizPage = lazy(() => import('./screens/MatricQuizPage'));
const NotesPage = lazy(() => import('./screens/NotesPage'));
const NotesSubjectsPage = lazy(() => import('./screens/NotesSubjectsPage'));
const NotesChaptersPage = lazy(() => import('./screens/NotesChaptersPage'));
const BooksPage = lazy(() => import('./screens/BooksPage'));
const BookSubjectsPage = lazy(() => import('./screens/BookSubjectsPage'));
const HostPage = lazy(() => import('./screens/HostPage'));
const JoinPage = lazy(() => import('./screens/JoinPage'));
const SessionPage = lazy(() => import('./screens/SessionPage'));
const MatricStudyRoomPage = lazy(() => import('./screens/MatricStudyRoomPage'));
const MatricExamSessionPage = lazy(() => import('./screens/MatricExamSessionPage'));

type Params = Record<string, string>;

type AppRoute = {
  pattern: string;
  guard?: 'protected' | 'public';
  component?: LazyExoticComponent<ComponentType>;
  redirectTo?: string | ((params: Params) => string);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      networkMode: 'online',
    },
    mutations: {
      networkMode: 'online',
    },
  },
});

const DebugAuthPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-slate-950 pt-14 px-4">
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Auth Debug</h1>
      <AuthDebug />
      <PaymentDebug />
    </div>
  </div>
);

const routes: AppRoute[] = [
  { pattern: '/', component: Index },
  { pattern: '/grades', guard: 'protected', component: GradesPage },
  { pattern: '/grade/:grade', guard: 'protected', component: GradeSelection },
  {
    pattern: '/grade/:grade/subject/:subject',
    redirectTo: ({ grade, subject }) => `/grade/${grade}/subject/${subject}/chapters`,
  },
  { pattern: '/grade/:grade/subjects', guard: 'protected', component: SubjectsPage },
  { pattern: '/grade/:grade/subject/:subject/chapters', guard: 'protected', component: ChaptersPage },
  {
    pattern: '/grade/:grade/subject/:subject/chapter/:chapterId/difficulty/:difficulty/quiz',
    guard: 'protected',
    component: QuizPage,
  },
  { pattern: '/career-simulator', guard: 'protected', component: CareerSimulatorPage },
  { pattern: '/dashboard', guard: 'protected', component: DashboardPage },
  { pattern: '/performance', guard: 'protected', component: PerformancePage },
  { pattern: '/profile', guard: 'protected', component: ProfilePage },
  { pattern: '/matric', guard: 'protected', component: MatricExamPage },
  { pattern: '/matric/:year', guard: 'protected', component: MatricStreamPage },
  { pattern: '/matric/:year/:stream', guard: 'protected', component: MatricYearPage },
  { pattern: '/matric/:year/:stream/:subject', guard: 'protected', component: MatricQuizPage },
  { pattern: '/matric/:year/quiz/:subject', guard: 'protected', component: MatricQuizPage },
  { pattern: '/matric/room', guard: 'protected', component: MatricStudyRoomPage },
  { pattern: '/matric/room/:roomId', guard: 'protected', component: MatricStudyRoomPage },
  { pattern: '/matric/session/:roomId', guard: 'protected', component: MatricExamSessionPage },
  { pattern: '/notes', guard: 'protected', component: NotesPage },
  { pattern: '/notes/:grade', guard: 'protected', component: NotesSubjectsPage },
  { pattern: '/notes/:grade/:subject', guard: 'protected', component: NotesChaptersPage },
  { pattern: '/books', guard: 'protected', component: BooksPage },
  { pattern: '/books/:grade', guard: 'protected', component: BookSubjectsPage },
  { pattern: '/payment', guard: 'protected', component: PaymentPage },
  { pattern: '/host', guard: 'protected', component: HostPage },
  { pattern: '/join', guard: 'protected', component: JoinPage },
  { pattern: '/session/:sessionCode', guard: 'protected', component: SessionPage },
  { pattern: '/debug/auth', guard: 'protected', component: lazy(async () => ({ default: DebugAuthPage })) },
  { pattern: '/login', guard: 'public', component: LoginPage },
  { pattern: '/signup', guard: 'public', component: SignUpPage },
];

const splitPath = (path: string) => {
  if (path === '/') {
    return [];
  }

  return path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
};

const matchRoute = (pathname: string) => {
  const pathSegments = splitPath(pathname);

  for (const route of routes) {
    const routeSegments = splitPath(route.pattern);
    if (routeSegments.length !== pathSegments.length) {
      continue;
    }

    const params: Params = {};
    let isMatch = true;

    for (let index = 0; index < routeSegments.length; index += 1) {
      const routeSegment = routeSegments[index];
      const pathSegment = pathSegments[index];

      if (routeSegment.startsWith(':')) {
        params[routeSegment.slice(1)] = decodeURIComponent(pathSegment);
        continue;
      }

      if (routeSegment !== pathSegment) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return { route, params };
    }
  }

  return null;
};

const App = () => {
  const pathname = usePathname() ?? '/';
  const match = matchRoute(pathname);

  let content = <Navigate to="/" replace />;
  let params: Params = {};

  if (match) {
    params = match.params;

    if (match.route.redirectTo) {
      const target =
        typeof match.route.redirectTo === 'function'
          ? match.route.redirectTo(match.params)
          : match.route.redirectTo;
      content = <Navigate to={target} replace />;
    } else if (match.route.component) {
      const Screen = match.route.component;
      const screenElement = (
        <Suspense fallback={<PageLoader />}>
          <Screen />
        </Suspense>
      );

      if (match.route.guard === 'protected') {
        content = <ProtectedRoute>{screenElement}</ProtectedRoute>;
      } else if (match.route.guard === 'public') {
        content = <PublicRoute>{screenElement}</PublicRoute>;
      } else {
        content = screenElement;
      }
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <RouterProvider params={params}>{content}</RouterProvider>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
