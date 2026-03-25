import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Star, 
  Play, 
  LogOut, 
  TrendingUp,
  Award,
  Target,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  Calculator,
  Microscope,
  Globe,
  Users,
  Atom,
  Dna,
  FlaskConical,
  Zap,
  Ruler,
  MapPin,
  Clock8,
  DollarSign,
  Briefcase,
  BookA,
  Scale,
  Activity,
  Laptop,
  Languages
} from 'lucide-react';
import SubjectSection from './SubjectSection';
import SubjectCard from './SubjectCard';
import { useIsMobile } from '../hooks/useIsMobile';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  questions: number;
  completed: boolean;
  score: number | null;
  grade: number;
  chapters: string[];
}

interface Subject {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    chapters?: string[];
    topics?: string[];

}

interface QuizDashboardProps {
  user: { name: string; grade: string; school?: string };
  onLogout: () => void;
  onSelectQuiz: (quiz: Quiz) => void;
}

const QuizDashboard = ({ user, onLogout, onSelectQuiz }: QuizDashboardProps) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [expandedGrades, setExpandedGrades] = useState<number[]>([]);
  const isMobile = useIsMobile();

  const toggleGrade = (gradeNumber: number) => {
    setExpandedGrades(prev => 
      prev.includes(gradeNumber) 
        ? prev.filter(g => g !== gradeNumber)
        : [...prev, gradeNumber]
    );
  };

  const gradeCards = [
    {
      grade: 9,
      title: 'Grade 9',
      description: 'Foundation courses for secondary education',
      subjects: 11,
      quizzes: 45,
      progress: 75,
      color: 'from-blue-500 to-purple-500'
    },
    {
      grade: 10,
      title: 'Grade 10',
      description: 'Advanced secondary education preparation',
      subjects: 11,
      quizzes: 52,
      progress: 60,
      color: 'from-green-500 to-blue-500'
    },
    {
      grade: 11,
      title: 'Grade 11',
      description: 'Pre-university level studies',
      subjects: 14,
      quizzes: 38,
      progress: 40,
      color: 'from-purple-500 to-pink-500'
    },
    {
      grade: 12,
      title: 'Grade 12',
      description: 'University entrance preparation',
      subjects: 14,
      quizzes: 42,
      progress: 25,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const mathTopics = {
    9: ['Algebra Basics', 'Linear Equations', 'Geometry Fundamentals', 'Number Systems'],
    10: ['Quadratic Functions', 'Trigonometry', 'Statistics', 'Probability'],
    11: ['Advanced Algebra', 'Calculus Introduction', 'Matrices', 'Sequences & Series'],
    12: ['Sequence and Series', 'Introduction to Calculus', 'Statistics', 'Introduction to linear programming', 'Mathematical Application in Business']
  };

  const grade9Subjects = [
    { name: 'English', icon: BookA, topics: ['Basic Grammar', 'Reading Comprehension', 'Writing Skills', 'Literature Introduction'] },
    { name: 'Amharic', icon: Languages, topics: ['Grammar', 'Literature', 'Composition', 'Language Skills'] },
    { name: 'Mathematics', icon: Calculator, topics: ['Algebra Basics', 'Linear Equations', 'Geometry Fundamentals', 'Number Systems'] },
    { name: 'Information Technology (ICT)', icon: Laptop, topics: ['Computer Basics', 'Software Applications', 'Internet Fundamentals', 'Digital Literacy'] },
    { name: 'Civics & Ethical Education', icon: Scale, topics: ['Citizenship', 'Ethics', 'Human Rights', 'Government Basics'] },
    { name: 'Biology', icon: Dna, topics: ['Cell Biology', 'Plant Biology', 'Human Body Systems', 'Basic Genetics'] },
    { name: 'Chemistry', icon: FlaskConical, topics: ['Matter & Elements', 'Chemical Reactions', 'Atomic Structure', 'Basic Compounds'] },
    { name: 'Physics', icon: Zap, topics: ['Motion & Forces', 'Energy', 'Heat & Temperature', 'Light & Sound'] },
    { name: 'Geography', icon: MapPin, topics: ['Physical Geography', 'Climate & Weather', 'Maps & Location', 'Human Geography'] },
    { name: 'History', icon: Clock8, topics: ['World History', 'Ethiopian History', 'Ancient Civilizations', 'Historical Thinking'] },
    { name: 'Physical Education', icon: Activity, topics: ['Sports & Games', 'Health Education', 'Physical Fitness', 'Body Systems'] }
  ];

  const grade10Subjects = [
    { name: 'English', icon: BookA, topics: ['Literature Analysis', 'Advanced Grammar', 'Essay Writing', 'Communication Skills'] },
    { name: 'Amharic', icon: Languages, topics: ['Advanced Grammar', 'Literature Study', 'Creative Writing', 'Language Arts'] },
    { name: 'Mathematics', icon: Calculator, topics: ['Quadratic Functions', 'Trigonometry', 'Statistics', 'Probability'] },
    { name: 'Information Technology (ICT)', icon: Laptop, topics: ['Programming Basics', 'Database Fundamentals', 'Web Development', 'Computer Networks'] },
    { name: 'Civics & Ethical Education', icon: Scale, topics: ['Democracy', 'Constitutional Law', 'Social Ethics', 'Global Citizenship'] },
    { name: 'Biology', icon: Dna, topics: ['Advanced Cell Biology', 'Genetics', 'Evolution', 'Ecology Basics'] },
    { name: 'Chemistry', icon: FlaskConical, topics: ['Chemical Bonding', 'Organic Chemistry', 'Acids & Bases', 'Stoichiometry'] },
    { name: 'Physics', icon: Zap, topics: ['Waves & Optics', 'Electricity', 'Magnetism', 'Thermodynamics'] },
    { name: 'Geography', icon: MapPin, topics: ['Regional Geography', 'Environmental Geography', 'Economic Geography', 'Cartography'] },
    { name: 'History', icon: Clock8, topics: ['Modern History', 'African History', 'Social Movements', 'Historical Analysis'] },
    { name: 'Physical Education', icon: Activity, topics: ['Advanced Sports', 'Exercise Science', 'Health & Wellness', 'Team Leadership'] }
  ];

  const grade11Subjects = {
    naturalScience: [
      { name: 'Biology', icon: Dna, chapters: ['Cell Biology', 'Genetics', 'Ecology', 'Human Biology'] },
      { name: 'Chemistry', icon: FlaskConical, chapters: ['Organic Chemistry', 'Physical Chemistry', 'Chemical Bonding', 'Reactions'] },
      { name: 'Physics', icon: Zap, chapters: ['Mechanics', 'Waves', 'Electricity', 'Optics'] },
      { name: 'Technical Drawing', icon: Ruler, chapters: ['Engineering Drawing', '3D Modeling', 'Geometric Construction', 'Technical Skills'] }
    ],
    socialScience: [
      { name: 'Geography', icon: MapPin, chapters: ['Physical Geography', 'Human Geography', 'Climate Studies', 'Regional Geography'] },
      { name: 'History', icon: Clock8, chapters: ['World History', 'Ethiopian History', 'Ancient Civilizations', 'Modern History'] },
      { name: 'Economics', icon: DollarSign, chapters: ['Microeconomics', 'Macroeconomics', 'Market Systems', 'Economic Theory'] },
      { name: 'General Business', icon: Briefcase, chapters: ['Business Fundamentals', 'Marketing Basics', 'Accounting Principles', 'Management'] }
    ],
    common: [
      { name: 'English', icon: BookA, chapters: ['Literature', 'Grammar', 'Writing Skills', 'Reading Comprehension'] },
      { name: 'Civics', icon: Scale, chapters: ['Government Systems', 'Constitution', 'Human Rights', 'Citizenship'] },
      { name: 'Physical Education', icon: Activity, chapters: ['Sports', 'Health Education', 'Fitness', 'Body Systems'] },
      { name: 'Mathematics', icon: Calculator, chapters: ['Advanced Algebra', 'Calculus Introduction', 'Matrices', 'Sequences & Series'] },
      { name: 'IT', icon: Laptop, chapters: ['Computer Basics', 'Programming Introduction', 'Database Fundamentals', 'Internet Technology'] },
      { name: 'National Language', icon: Languages, chapters: ['Amharic Literature', 'Grammar', 'Composition', 'Language Skills'] }
    ]
  };

  const grade12Subjects = {
    naturalScience: [
      { 
        name: 'Biology', 
        icon: Dna, 
        chapters: [
          'Unit 1: Application of Biology',
          'Unit 2: Microorganisms',
          'Unit 3: Energy transformation',
          'Unit 4: Evolution',
          'Unit 5: Human Body System',
          'Unit 6: Climate Change'
        ]
      },
      { 
        name: 'Chemistry', 
        icon: FlaskConical, 
        chapters: [
          'Chapter 1: Atomic Structure and Periodic Properties',
          'Chapter 2: Chemical Bonding',
          'Chapter 3: States of Matter',
          'Chapter 4: Solutions',
          'Chapter 5: Chemical Kinetics',
          'Chapter 6: Chemical Equilibrium',
          'Chapter 7: Acids and Bases',
          'Chapter 8: Redox Reactions and Electrochemistry',
          'Chapter 9: Organic Chemistry'
        ]
      },
      { 
        name: 'Physics', 
        icon: Zap, 
        chapters: [
          'Chapter 1: Mechanics',
          'Chapter 2: Thermal Physics',
          'Chapter 3: Oscillations and Waves',
          'Chapter 4: Electricity and Magnetism',
          'Chapter 5: Electromagnetic Induction',
          'Chapter 6: Alternating Current',
          'Chapter 7: Electromagnetic Waves',
          'Chapter 8: Optics',
          'Chapter 9: Modern Physics'
        ]
      },
      { 
        name: 'Technical Drawing', 
        icon: Ruler, 
        chapters: [
          'Chapter 1: Introduction to Technical Drawing',
          'Chapter 2: Geometric Construction',
          'Chapter 3: Orthographic Projection',
          'Chapter 4: Isometric Drawing',
          'Chapter 5: Sectional Views',
          'Chapter 6: Working Drawings',
          'Chapter 7: Computer-Aided Design (CAD)'
        ]
      },
      { 
        name: 'Agriculture', 
        icon: Microscope, 
        chapters: [
          'Unit 1: Crop Production',
          'Unit 2: Livestock Management',
          'Unit 3: Soil Science and Fertility',
          'Unit 4: Agricultural Economics',
          'Unit 5: Agricultural Technology',
          'Unit 6: Sustainable Agriculture'
        ]
      }
    ],
    socialScience: [
      { 
        name: 'Geography', 
        icon: MapPin, 
        chapters: [
          'Chapter 1: Physical Geography of the World',
          'Chapter 2: Population and Settlement',
          'Chapter 3: Economic Geography',
          'Chapter 4: Political Geography',
          'Chapter 5: Environmental Geography',
          'Chapter 6: Regional Geography of Africa',
          'Chapter 7: Geography of Ethiopia and the Horn',
          'Chapter 8: Geographic Information Systems (GIS)'
        ]
      },
      { 
        name: 'History', 
        icon: Clock8, 
        chapters: [
          'Chapter 1: The Ancient World',
          'Chapter 2: Medieval Period',
          'Chapter 3: The Modern World (1500-1800)',
          'Chapter 4: Age of Revolution and Nationalism',
          'Chapter 5: The 20th Century World',
          'Chapter 6: Contemporary World',
          'Chapter 7: African History',
          'Chapter 8: Ethiopian History'
        ]
      },
      { 
        name: 'Economics', 
        icon: DollarSign, 
        chapters: [
          'Chapter 1: Introduction to Economics',
          'Chapter 2: Demand, Supply and Market Equilibrium',
          'Chapter 3: Consumer Behavior and Demand Analysis',
          'Chapter 4: Production and Cost Analysis',
          'Chapter 5: Market Structure and Pricing',
          'Chapter 6: Factor Markets',
          'Chapter 7: National Income and Economic Growth',
          'Chapter 8: Money, Banking and Monetary Policy',
          'Chapter 9: International Trade and Finance'
        ]
      },
      { 
        name: 'General Business', 
        icon: Briefcase, 
        chapters: [
          'Chapter 1: Introduction to Business',
          'Chapter 2: Business Organization and Management',
          'Chapter 3: Marketing Management',
          'Chapter 4: Financial Management',
          'Chapter 5: Human Resource Management',
          'Chapter 6: Production and Operations Management',
          'Chapter 7: Business Ethics and Social Responsibility',
          'Chapter 8: Entrepreneurship and Small Business'
        ]
      }
    ],
    common: [
      { 
        name: 'English', 
        icon: BookA, 
        chapters: [
          'Chapter 1: Reading Comprehension and Critical Analysis',
          'Chapter 2: Grammar and Language Usage',
          'Chapter 3: Writing Skills and Composition',
          'Chapter 4: Literature and Literary Analysis',
          'Chapter 5: Speaking and Listening Skills',
          'Chapter 6: Research and Academic Writing'
        ]
      },
      { 
        name: 'Civics', 
        icon: Scale, 
        chapters: [
          'Chapter 1: Principles of Democracy',
          'Chapter 2: Constitutional Government',
          'Chapter 3: Rule of Law and Human Rights',
          'Chapter 4: Citizenship and Civic Participation',
          'Chapter 5: Political Parties and Elections',
          'Chapter 6: International Relations and Organizations'
        ]
      },
      { 
        name: 'Physical Education', 
        icon: Activity, 
        chapters: [
          'Chapter 1: Health and Wellness',
          'Chapter 2: Exercise Physiology',
          'Chapter 3: Sports and Games',
          'Chapter 4: Physical Fitness and Training',
          'Chapter 5: Sports Psychology',
          'Chapter 6: Sports Management and Organization'
        ]
      },
      { 
        name: 'Mathematics', 
        icon: Calculator, 
        chapters: [
          'Unit 1: Sequence and Series',
          'Unit 2: Introduction to Calculus',
          'Unit 3: Statistics',
          'Unit 4: Introduction to Linear Programming',
          'Unit 5: Mathematical Application in Business'
        ]
      },
      { 
        name: 'IT', 
        icon: Laptop, 
        chapters: [
          'Chapter 1: Computer Systems and Architecture',
          'Chapter 2: Operating Systems',
          'Chapter 3: Programming Fundamentals',
          'Chapter 4: Database Management Systems',
          'Chapter 5: Computer Networks and Internet',
          'Chapter 6: Web Development',
          'Chapter 7: Computer Security',
          'Chapter 8: Emerging Technologies'
        ]
      },
      { 
        name: 'National Language', 
        icon: Languages, 
        chapters: [
          'Chapter 1: Amharic Grammar and Syntax',
          'Chapter 2: Classical Amharic Literature',
          'Chapter 3: Modern Amharic Literature',
          'Chapter 4: Poetry and Prose Analysis',
          'Chapter 5: Creative Writing',
          'Chapter 6: Cultural and Historical Context'
        ]
      }
    ]
  };

  const getSubjectProgress = (subjectName: string) => {
    const mockData = {
      'Mathematics': { completed: 8, total: 12, percentage: 67 },
      'Physics': { completed: 6, total: 9, percentage: 67 },
      'Chemistry': { completed: 7, total: 9, percentage: 78 },
      'Biology': { completed: 5, total: 7, percentage: 71 },
      'Technical Drawing': { completed: 4, total: 7, percentage: 57 },
      'Geography': { completed: 6, total: 8, percentage: 75 },
      'History': { completed: 7, total: 8, percentage: 88 },
      'Economics': { completed: 5, total: 9, percentage: 56 },
      'General Business': { completed: 6, total: 8, percentage: 75 },
      'English': { completed: 5, total: 6, percentage: 83 },
      'Civics': { completed: 4, total: 6, percentage: 67 },
      'Physical Education': { completed: 5, total: 6, percentage: 83 },
      'IT': { completed: 6, total: 8, percentage: 75 },
      'National Language': { completed: 4, total: 6, percentage: 67 },
      'Agriculture': { completed: 4, total: 6, percentage: 67 }
    };
    return mockData[subjectName as keyof typeof mockData] || { completed: 0, total: 10, percentage: 0 };
  };

  const createQuiz = (subject: Subject, grade: number, difficulty: 'Easy' | 'Medium' | 'Hard'): Quiz => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: `${subject.name} - Grade ${grade} (${difficulty})`,
      subject: subject.name.toLowerCase().replace(/\s+/g, '_'),
      difficulty: difficulty,
      duration: difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 60,
      questions: difficulty === 'Easy' ? 15 : difficulty === 'Medium' ? 20 : 25,
      completed: false,
      score: null,
      grade: grade,
      chapters: subject.chapters || subject.topics || []
    };
  };

  const quizzes = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      subject: 'mathematics',
      difficulty: 'Medium',
      duration: 30,
      questions: 20,
      completed: false,
      score: null
    },
    {
      id: 2,
      title: 'Motion and Forces',
      subject: 'physics',
      difficulty: 'Hard',
      duration: 45,
      questions: 25,
      completed: true,
      score: 85
    },
    {
      id: 3,
      title: 'Chemical Bonds',
      subject: 'chemistry',
      difficulty: 'Medium',
      duration: 35,
      questions: 22,
      completed: true,
      score: 92
    },
    {
      id: 4,
      title: 'Cell Structure',
      subject: 'biology',
      difficulty: 'Easy',
      duration: 25,
      questions: 18,
      completed: false,
      score: null
    }
  ];

  const stats = [
    { icon: Trophy, label: 'Quizzes Completed', value: '23', color: 'text-yellow-500' },
    { icon: Star, label: 'Average Score', value: '87%', color: 'text-blue-500' },
    { icon: Target, label: 'Best Score', value: '96%', color: 'text-green-500' },
    { icon: TrendingUp, label: 'This Week', value: '+5', color: 'text-purple-500' }
  ];

  const filteredQuizzes = quizzes;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGrade11Content = () => (
    <Card className="bg-white/5 border-white/20 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-purple-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold">Grade 11 Subjects</h4>
              <p className="text-sm text-gray-400">Pre-university level studies with interactive cards</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            14 subjects
          </Badge>
        </div>
        
        {/* Natural Science Stream */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold text-white">📘 Natural Science Stream</h5>
            <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800">
              {grade11Subjects.naturalScience.length} subjects
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grade11Subjects.naturalScience.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject.name)}
                grade={11}
                onSelectQuiz={onSelectQuiz}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Social Science Stream */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold text-white">📗 Social Science Stream</h5>
            <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800">
              {grade11Subjects.socialScience.length} subjects
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grade11Subjects.socialScience.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject.name)}
                grade={11}
                onSelectQuiz={onSelectQuiz}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Common Courses */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold text-white">📙 Common Courses</h5>
            <Badge variant="secondary" className="ml-3 bg-yellow-100 text-yellow-800">
              {grade11Subjects.common.length} subjects
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grade11Subjects.common.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject.name)}
                grade={11}
                onSelectQuiz={onSelectQuiz}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderGrade12Content = () => (
    <Card className="bg-white/5 border-white/20 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-orange-500">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold">Grade 12 Subjects</h4>
              <p className="text-sm text-gray-400">University entrance preparation with interactive cards</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            14 subjects
          </Badge>
        </div>
        
        {/* Natural Science Stream */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold text-white">📘 Natural Science Stream</h5>
            <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800">
              {grade12Subjects.naturalScience.length} subjects
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grade12Subjects.naturalScience.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject.name)}
                grade={12}
                onSelectQuiz={onSelectQuiz}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Social Science Stream */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold text-white">📗 Social Science Stream</h5>
            <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800">
              {grade12Subjects.socialScience.length} subjects
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grade12Subjects.socialScience.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject.name)}
                grade={12}
                onSelectQuiz={onSelectQuiz}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Common Courses */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h5 className="text-lg font-semibold text-white">📙 Common Courses</h5>
            <Badge variant="secondary" className="ml-3 bg-yellow-100 text-yellow-800">
              {grade12Subjects.common.length} subjects
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grade12Subjects.common.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                progress={getSubjectProgress(subject.name)}
                grade={12}
                onSelectQuiz={onSelectQuiz}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-yellow-500 text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-gray-400">Grade {user.grade} • {user.school}</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/5 border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Grade Cards Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Grade Levels</h2>
            <div className="space-y-4">
              {gradeCards.map((grade) => (
                <Collapsible 
                  key={grade.grade} 
                  open={expandedGrades.includes(grade.grade)}
                  onOpenChange={() => toggleGrade(grade.grade)}
                >
                  <CollapsibleTrigger asChild>
                    <Card className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${grade.color}`}>
                            <GraduationCap className="h-6 w-6 text-white" />
                          </div>
                          {expandedGrades.includes(grade.grade) ? 
                            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" /> :
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                          }
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{grade.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">{grade.description}</p>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Subjects:</span>
                            <span className="font-medium">{grade.subjects}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Quizzes:</span>
                            <span className="font-medium">{grade.quizzes}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Progress:</span>
                              <span className="font-medium">{grade.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-blue-500" 
                                style={{ width: `${grade.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="space-y-4">
                    <div className="ml-8 mt-4">
                      {grade.grade === 11 ? renderGrade11Content() : null}
                      {grade.grade === 12 ? renderGrade12Content() : null}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;
