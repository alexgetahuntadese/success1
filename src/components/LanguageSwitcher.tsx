import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languageCycle: Record<string, 'en' | 'om' | 'am'> = { en: 'om', om: 'am', am: 'en' };
const languageLabels: Record<string, string> = { en: 'EN', om: 'OM', am: 'አማ' };

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(languageCycle[language])}
      className="text-white/70 hover:text-white hover:bg-white/10 font-semibold gap-1.5"
    >
      <Globe className="h-4 w-4" />
      {languageLabels[language]}
    </Button>
  );
};

export default LanguageSwitcher;
