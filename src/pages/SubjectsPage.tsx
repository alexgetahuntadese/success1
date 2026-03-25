
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Target, Sparkles, GraduationCap } from 'lucide-react';
import TopBar from "@/components/TopBar";
import StarField from '@/components/StarField';
import { 
  Calculator, 
  Atom, 
  Globe, 
  Book, 
  Palette, 
  Music, 
  Heart, 
  Zap,
  TreePine,
  Languages,
  Users,
  Briefcase,
  Wheat,
  ScrollText,
  Monitor
} from 'lucide-react';

const SubjectsPage = () => {
  const navigate = useNavigate();
  const { grade } = useParams();

  const subjectIcons = {
    'Mathematics': Calculator,
    'Physics': Atom,
    'Chemistry': Zap,
    'Biology': TreePine,
    'Geography': Globe,
    'History': ScrollText,
    'English': Languages,
    'Amharic': Book,
    'Art': Palette,
    'Music': Music,
    'Physical Education': Heart,
    'Civic Education': Users,
    'Economics': Briefcase,
    'General Science': Atom,
    'Agriculture': Wheat,
    'Information Technology': Monitor,
  };

  // Grade-specific subjects configuration
  const getSubjectsForGrade = (gradeNum: string) => {
    const baseSubjects = [
      {
        name: 'Mathematics',
        description: 'Numbers, algebra, geometry, and problem solving',
        chapters: 12,
        estimatedTime: '45 hours',
        difficulty: 'Advanced',
        icon: subjectIcons.Mathematics,
      },
      {
        name: 'Physics',
        description: 'Motion, forces, energy, and natural phenomena',
        chapters: 5,
        estimatedTime: '40 hours',
        difficulty: 'Advanced',
        icon: subjectIcons.Physics,
      },
      {
        name: 'Chemistry',
        description: 'Atoms, molecules, reactions, and materials',
        chapters: 9,
        estimatedTime: '35 hours',
        difficulty: 'Advanced',
        icon: subjectIcons.Chemistry,
      },
      {
        name: 'Biology',
        description: 'Living organisms, ecosystems, and life processes',
        chapters: 11,
        estimatedTime: '38 hours',
        difficulty: 'Intermediate',
        icon: subjectIcons.Biology,
      },
      {
        name: 'English',
        description: 'Reading, writing, grammar, and literature',
        chapters: 8,
        estimatedTime: '30 hours',
        difficulty: 'Intermediate',
        icon: subjectIcons.English,
      },
      {
        name: 'Geography',
        description: 'Earth science, maps, climate, and human geography',
        chapters: 7,
        estimatedTime: '25 hours',
        difficulty: 'Intermediate',
        icon: subjectIcons.Geography,
      },
      {
        name: 'History',
        description: 'Ethiopian and world history, civilizations, and cultural heritage',
        chapters: 9,
        estimatedTime: '32 hours',
        difficulty: 'Intermediate',
        icon: subjectIcons.History,
      },
      {
        name: 'Civic Education',
        description: 'Democracy, rights, responsibilities, justice, and ethical citizenship',
        chapters: 11,
        estimatedTime: '35 hours',
        difficulty: 'Intermediate',
        icon: subjectIcons['Civic Education'],
      },
    ];

    // For grades 9 and 10, add Amharic
    if (gradeNum === '9' || gradeNum === '10') {
      baseSubjects.push(
        {
          name: 'Amharic',
          description: 'Amharic language, grammar, literature, and composition',
          chapters: gradeNum === '9' ? 6 : 6,
          estimatedTime: '25 hours',
          difficulty: 'Intermediate',
          icon: subjectIcons.Amharic,
        }
      );
      if (gradeNum === '10') {
        baseSubjects.push(
          {
            name: 'Economics',
            description: 'Introduction to economics, markets, and the Ethiopian economy',
            chapters: 7,
            estimatedTime: '28 hours',
            difficulty: 'Intermediate',
            icon: subjectIcons.Economics,
          }
        );
      }
    }

    // Add grade-specific subjects
    if (gradeNum === '11') {
      baseSubjects.push(
        {
          name: 'Agriculture',
          description: 'Crop production, livestock management, natural resources, and sustainable farming practices',
          chapters: 16,
          estimatedTime: '50 hours',
          difficulty: 'Intermediate',
          icon: subjectIcons.Agriculture,
        },
        {
          name: 'Amharic',
          description: 'Amharic language, literature, poetry, and cultural heritage',
          chapters: 10,
          estimatedTime: '30 hours',
          difficulty: 'Intermediate',
          icon: subjectIcons.Amharic,
        }
      );
    }

    if (gradeNum === '12') {
      baseSubjects.push(
        {
          name: 'Agriculture',
          description: 'Crop production, livestock, soil science, and sustainable farming',
          chapters: 6,
          estimatedTime: '40 hours',
          difficulty: 'Intermediate',
          icon: subjectIcons.Agriculture,
        },
        {
          name: 'Information Technology',
          description: 'Computer systems, programming, databases, web development, and emerging technologies',
          chapters: 6,
          estimatedTime: '42 hours',
          difficulty: 'Intermediate',
          icon: subjectIcons['Information Technology'],
        }
      );
    }

    return baseSubjects;
  };

  const subjects = getSubjectsForGrade(grade || '12');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced': return 'bg-red-500 text-white';
      case 'Intermediate': return 'bg-yellow-500 text-black';
      case 'Beginner': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleSubjectSelect = (subjectName: string) => {
    navigate(`/grade/${grade}/subject/${encodeURIComponent(subjectName)}/chapters`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={40} shootingCount={4} />
      <TopBar />

      <div className="max-w-6xl mx-auto relative z-10">
        <Button
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/5 mb-8 transition-colors"
          onClick={() => navigate('/grades')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grades
        </Button>

        <div className="text-center mb-12 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-6">
            <GraduationCap className="h-4 w-4" />
            Grade {grade} • Ethiopian Curriculum
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Choose a Subject
          </h1>
          <p className="text-lg text-white/50 max-w-md mx-auto">
            Explore chapters and start learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            const IconComponent = subject.icon;
            return (
              <div
                key={subject.name}
                onClick={() => handleSubjectSelect(subject.name)}
                className="group relative cursor-pointer opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.1 + 0.08 * index}s`, animationFillMode: 'forwards' }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500" />

                <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/[0.15] group-hover:scale-[1.02] shadow-2xl h-full">
                  <Sparkles className="absolute top-4 right-4 h-4 w-4 text-white/10 group-hover:text-white/30 transition-colors duration-500" />

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:shadow-violet-500/30 transition-shadow duration-500">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{subject.name}</h3>
                      <Badge className={`${getDifficultyColor(subject.difficulty)} text-xs`}>
                        {subject.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-white/40 text-sm mb-5">{subject.description}</p>

                  <div className="flex items-center gap-4 text-white/40 text-sm mb-5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{subject.chapters} chapters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{subject.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-white/30 group-hover:text-violet-300 text-sm transition-colors duration-300">
                    <span>Explore chapters</span>
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
