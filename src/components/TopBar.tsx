import { useNavigate } from 'react-router-dom';
import { User, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getPerformanceData } from '@/lib/performanceUtils';

const TopBar = () => {
  const navigate = useNavigate();
  const studentName = getPerformanceData().profile.student_name || 'Profile';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end gap-1 border-b border-white/[0.12] bg-purple-950/90 px-4 py-2 shadow-[0_10px_35px_rgba(10,10,30,0.35)] backdrop-blur-xl">
      <LanguageSwitcher />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/performance')}
        className="text-white/85 hover:bg-white/12 hover:text-white"
      >
        <BarChart3 className="h-4 w-4 mr-1.5" />
        Performance
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/profile')}
        className="font-medium text-white/95 hover:bg-white/12 hover:text-white"
      >
        <User className="h-4 w-4 mr-1.5" />
        <span className="max-w-[120px] truncate">{studentName}</span>
      </Button>
    </div>
  );
};

export default TopBar;
