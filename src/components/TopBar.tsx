import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, BarChart3, Home, GraduationCap, BookOpen, Briefcase, FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.12] bg-purple-950/90 px-4 py-2 shadow-[0_10px_35px_rgba(10,10,30,0.35)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
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
        </div>

        {/* Mobile Collapsible Menu */}
        <div className="md:hidden">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/85 hover:bg-white/12 hover:text-white"
              >
                {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                <span className="ml-1.5">Menu</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 flex flex-col gap-1 pb-2">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`justify-start ${
                      isActive(item.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/85 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-1.5" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
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
