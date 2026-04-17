export {
  authService,
  checkAuthStatus,
  formatAuthError,
  getAuthErrorDetails,
  getAuthErrorCategory,
  shouldRetryAuthError,
  isPhoneAlreadyRegisteredError,
  normalizePhoneNumber,
  userProfileService,
  userService,
  type AuthErrorCategory,
  type AuthErrorDetails,
} from "@/lib/firebase/auth";
export { paymentAdminService, paymentService } from "@/lib/back4app/payments";
export { careerSimulatorService } from "@/lib/firebase/functions";
export type {
  AppSession,
  Json,
  PaymentSubmission,
  PaymentSubmissionWithReceiptUrl,
  QuestionDataPayload,
  SavedQuestion,
  SearchHistory,
  UserProfile,
} from "@/lib/firebase/types";
export type {
  PaymentMethod,
  PaymentSubmissionStatus,
} from "@/lib/back4app/payments";
