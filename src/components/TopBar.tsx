import { useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const TopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end gap-1 px-4 py-2 bg-purple-950/80 backdrop-blur-md border-b border-white/[0.04]">
      <LanguageSwitcher />
      {user ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-white hover:text-white hover:bg-white/10 font-medium"
          >
            <User className="h-4 w-4 mr-1.5" />
            <span className="max-w-[120px] truncate">
              {user.user_metadata?.full_name || user.email?.split('@')[0]}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="text-white/50 hover:text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/auth')}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <LogIn className="h-4 w-4 mr-1" />
          Sign In
        </Button>
      )}
    </div>
  );
};

export default TopBar;
