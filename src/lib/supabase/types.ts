import type { Session } from "@supabase/supabase-js";

import type { Json, Tables } from "@/integrations/supabase/types";

export type UserProfile = Tables<"users">;
export type PaymentSubmission = Tables<"payment_submissions">;
export type SavedQuestion = Tables<"saved_questions">;
export type SearchHistory = Tables<"search_history">;
export type UserPreferences = Json;
export type AppSession = Session;

export type QuestionDataPayload = {
  id?: string;
  [key: string]: Json | undefined;
};

export type StudentSignUpInput = {
  fullName: string;
  phone: string;
  password: string;
};
