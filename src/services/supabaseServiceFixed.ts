export { supabase } from "@/lib/supabase/client";
export {
  authService,
  checkAuthStatus,
  formatAuthError,
  normalizePhoneNumber,
  userProfileService,
  userService,
} from "@/lib/supabase/account";
export { savedQuestionsService, searchHistoryService } from "@/lib/supabase/content";
export { userAdminService } from "@/lib/supabase/admin";
export { careerSimulatorService } from "@/lib/supabase/functions";
export type {
  AppSession,
  QuestionDataPayload,
  SavedQuestion,
  SearchHistory,
  StudentSignUpInput,
  UserProfile,
} from "@/lib/supabase/types";
