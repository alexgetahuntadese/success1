
import { supabase } from '@/integrations/supabase/client';

// Save quiz attempt to database
export const saveQuizAttemptToDb = async (attempt: {
  grade: string;
  subject: string;
  chapter: string;
  difficulty: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_spent: string;
}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: user.id,
      ...attempt,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving quiz attempt:', error);
    return null;
  }
  return data;
};

// Get quiz attempts from database
export const getQuizAttemptsFromDb = async (limit?: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .order('attempted_at', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching quiz attempts:', error);
    return [];
  }
  return data || [];
};

// Get user profile from database
export const getProfileFromDb = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

// Update user profile
export const updateProfileInDb = async (updates: { student_name?: string; avatar_url?: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data;
};

// Migrate localStorage data to database
export const migrateLocalDataToDb = async () => {
  const STORAGE_KEY = 'ethioquiz_performance';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const localData = JSON.parse(stored);
    const attempts = localData.attempts || [];

    if (attempts.length === 0) return;

    // Insert all local attempts
    const rows = attempts.map((a: any) => ({
      user_id: user.id,
      grade: a.grade || 'Unknown',
      subject: a.subject || 'Unknown',
      chapter: a.chapter || 'Unknown',
      difficulty: a.difficulty || 'medium',
      score: a.score || 0,
      correct_answers: a.correct_answers || 0,
      total_questions: a.total_questions || 0,
      time_spent: a.time_spent || '',
      attempted_at: a.attempted_at || new Date().toISOString(),
    }));

    const { error } = await supabase.from('quiz_attempts').insert(rows);
    if (!error) {
      // Update profile name if set locally
      if (localData.profile?.student_name) {
        await updateProfileInDb({ student_name: localData.profile.student_name });
      }
      localStorage.removeItem(STORAGE_KEY);
      console.log('Migrated local data to database');
    }
  } catch (e) {
    console.error('Migration error:', e);
  }
};
