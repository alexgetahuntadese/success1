import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, BarChart3, Home, GraduationCap, BookOpen, Briefcase, FileText, Menu, X, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getPerformanceData } from '@/lib/performanceUtils';

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentName = getPerformanceData().profile.student_name || 'Profile';
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/grades', icon: GraduationCap, label: 'Grades' },
    { path: '/matric', icon: FileText, label: 'Matric' },
    { path: '/notes', icon: BookOpen, label: 'Notes' },
    { path: '/career-simulator', icon: Briefcase, label: 'Career' },
    { path: '/payment', icon: CreditCard, label: 'Payment' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.12] bg-purple-950/90 px-4 py-2 shadow-[0_10px_35px_rgba(10,10,30,0.35)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {/* Mobile Sheet Navigation */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/85 hover:bg-white/12 hover:text-white"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-purple-950 border-white/10 p-0">
              <SheetHeader className="border-b border-white/10 p-4">
                <SheetTitle className="text-white text-left">Menu</SheetTitle>
                <SheetClose className="absolute right-4 top-4 text-white/70 hover:text-white">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col p-2">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`justify-start h-12 text-base ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/85 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation - only on large screens */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate(item.path)}
              className={`${
                isActive(item.path)
                  ? 'bg-white/20 text-white'
                  : 'text-white/85 hover:bg-white/12 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4 mr-1.5" />
              {item.label}
            </Button>
          ))}
        </nav>
        {/* Right side - Profile & Performance */}
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <Button
            variant={isActive('/performance') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/performance')}
            className={`${
              isActive('/performance')
                ? 'bg-white/20 text-white'
                : 'text-white/85 hover:bg-white/12 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Performance
          </Button>
          <Button
            variant={isActive('/profile') ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => navigate('/profile')}
            className={`font-medium ${
              isActive('/profile')
                ? 'bg-white/20 text-white'
                : 'text-white/95 hover:bg-white/12 hover:text-white'
            }`}
          >
            <User className="h-4 w-4 mr-1.5" />
            <span className="max-w-[120px] truncate">{studentName}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
