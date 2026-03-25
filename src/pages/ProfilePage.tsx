
import { useState, useEffect } from 'react';
import StarField from '@/components/StarField';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, User, Save, Trash2, Mail } from 'lucide-react';
import { getProfileFromDb, updateProfileInDb, getQuizAttemptsFromDb } from '@/lib/dbPerformanceUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { useLanguage } from '@/i18n/LanguageContext';
import TopBar from "@/components/TopBar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [quizCount, setQuizCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const profile = await getProfileFromDb();
      if (profile) {
        setName(profile.student_name || '');
      }
      const attempts = await getQuizAttemptsFromDb();
      setQuizCount(attempts.length);
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (name.trim()) {
      await updateProfileInDb({ student_name: name.trim() });
      toast.success(t('profile.profileUpdated'));
    } else {
      toast.error(t('profile.enterValidName'));
    }
  };

  const handleClearData = async () => {
    if (!user) return;
    await supabase.from('quiz_attempts').delete().eq('user_id', user.id);
    setQuizCount(0);
    toast.success(t('profile.dataCleared'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={40} shootingCount={2} />
      <TopBar />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{t('profile.studentProfile')}</h1>
            <p className="text-white/50">{t('profile.manageProfile')}</p>
          </div>
        </div>

        <Card className="bg-white/[0.04] border-white/[0.08] mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-violet-500/20 rounded-full">
                <User className="h-8 w-8 text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">{t('profile.profileSettings')}</CardTitle>
                <CardDescription className="text-white/50">
                  {t('profile.nameAppears')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {user?.email && (
              <div className="flex items-center gap-2 p-3 bg-white/[0.04] rounded-lg border border-white/[0.08]">
                <Mail className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/60">{user.email}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">{t('profile.studentName')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('host.enterName')}
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30"
              />
            </div>
            
            <Button onClick={handleSave} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              {t('profile.saveProfile')}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.04] border-white/[0.08] mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">{t('profile.performanceStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 bg-white/[0.04] rounded-lg border border-white/[0.08]">
              <span className="text-white/60">{t('profile.totalQuizzes')}</span>
              <span className="text-2xl font-bold text-white">{quizCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-500/[0.06] border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400 text-lg">{t('profile.dangerZone')}</CardTitle>
            <CardDescription className="text-white/40">
              {t('profile.cannotBeUndone')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('profile.clearAllData')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-950 border-white/[0.08]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">{t('profile.areYouSure')}</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/50">
                    {t('profile.deleteWarning')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-white/[0.04] text-white border-white/[0.08] hover:bg-white/[0.08]">
                    {t('common.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleClearData}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {t('profile.yesDelete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
