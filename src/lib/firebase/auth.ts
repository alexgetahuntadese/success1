import type { User as FirebaseUser } from "firebase/auth";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, firebaseConfigError, firebaseReady, firestore } from "@/lib/firebase/client";
import type { AppSession, Json, UserProfile, RegisterInput, UpdateProfileInput } from "@/lib/auth/types";

const USERS_COLLECTION = "users";
const PHONE_EMAIL_DOMAIN = "simple-road.firebaseapp.local";
let authInitializationPromise: Promise<void> | null = null;
let firestoreAvailable = true;

const requireFirebase = () => {
  if (!firebaseReady || !auth || !firestore) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }
};

const ensureAuthInitialized = async () => {
  requireFirebase();

  if (!authInitializationPromise) {
    authInitializationPromise = setPersistence(auth!, browserLocalPersistence).catch((error) => {
      authInitializationPromise = null;
      throw error;
    });
  }

  await authInitializationPromise;
};

export const normalizePhoneNumber = (phone: string) => phone.trim().replace(/[^\d+]/g, "");

const sanitizePhoneDigits = (phone: string) => normalizePhoneNumber(phone).replace(/[^\d]/g, "");

const phoneToEmail = (phone: string) => `${sanitizePhoneDigits(phone)}@${PHONE_EMAIL_DOMAIN}`;

const emailToPhone = (email: string | null | undefined) => {
  if (!email) {
    return "";
  }

  const suffix = `@${PHONE_EMAIL_DOMAIN}`;
  return email.endsWith(suffix) ? email.slice(0, -suffix.length) : "";
};

const isInternalPhoneEmail = (email: string | null | undefined) =>
  Boolean(email && email.endsWith(`@${PHONE_EMAIL_DOMAIN}`));

const sanitizeProfileEmail = (email: string | null | undefined) =>
  isInternalPhoneEmail(email) ? null : email?.trim() || null;

const isFirestoreUnavailableError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("Database '(default)' not found");
};

const markFirestoreUnavailable = (error: unknown) => {
  if (isFirestoreUnavailableError(error)) {
    firestoreAvailable = false;
  }
};

const blankProfile = (authId: string, phone: string, email: string | null): UserProfile => ({
  id: authId,
  auth_id: authId,
  name: null,
  mobile: phone,
  email: sanitizeProfileEmail(email),
  phone,
  grade: null,
  school: null,
  profile_image_url: null,
  date_of_birth: null,
  gender: null,
  preferences: { role: "student" } as Json,
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login: new Date().toISOString(),
});

const userDoc = (userId: string) => doc(firestore!, USERS_COLLECTION, userId);

const fallbackProfileFromUser = (user: FirebaseUser): UserProfile => {
  const resolvedPhone = user.phoneNumber || emailToPhone(user.email) || "";
  return blankProfile(user.uid, resolvedPhone, sanitizeProfileEmail(user.email));
};

const mapFirebaseUserToAuthUser = (user: FirebaseUser) => {
  const resolvedPhone = user.phoneNumber || emailToPhone(user.email) || "";

  return {
    id: user.uid,
    phone: resolvedPhone,
    email: user.email,
    user_metadata: {
      name: user.displayName || null,
      mobile: resolvedPhone || null,
    },
  };
};

const mapFirebaseUserToSession = async (user: FirebaseUser): Promise<AppSession> => {
  const tokenResult = await getIdTokenResult(user, false);

  return {
    accessToken: tokenResult.token,
    expiresAt: tokenResult.expirationTime,
    user: mapFirebaseUserToAuthUser(user),
  };
};

const readProfileSnapshot = async (userId: string) => {
  requireFirebase();
  if (!firestoreAvailable) {
    return null;
  }

  try {
  const snapshot = await getDoc(userDoc(userId));
  if (!snapshot.exists()) {
    return null;
  }
  const profile = snapshot.data() as UserProfile;
  return {
    ...profile,
    email: sanitizeProfileEmail(profile.email),
  };
  } catch (error) {
    markFirestoreUnavailable(error);
    if (isFirestoreUnavailableError(error)) {
      return null;
    }
    throw error;
  }
};

const saveProfile = async (profile: UserProfile) => {
  requireFirebase();
  if (!firestoreAvailable) {
    return profile;
  }

  try {
    await setDoc(userDoc(profile.id), {
      ...profile,
      updated_at: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    markFirestoreUnavailable(error);
    if (!isFirestoreUnavailableError(error)) {
      throw error;
    }
  }
  return profile;
};

export const userProfileService = {
  async getUserProfile(authId?: string): Promise<UserProfile | null> {
    requireFirebase();
    const targetUserId = authId || auth.currentUser?.uid;
    if (!targetUserId) {
      return null;
    }

    return readProfileSnapshot(targetUserId);
  },

  async upsertProfile(profile: Partial<UserProfile> & { id: string; auth_id?: string | null }) {
    requireFirebase();
    if (!firestoreAvailable) {
      const now = new Date().toISOString();
      return {
        ...blankProfile(profile.id, profile.phone || "", profile.email || null),
        ...profile,
        auth_id: profile.auth_id ?? profile.id,
        email: sanitizeProfileEmail(profile.email),
        updated_at: now,
        created_at: now,
        last_login: now,
        preferences: profile.preferences ?? ({ role: "student" } as Json),
      } as UserProfile;
    }

    const now = new Date().toISOString();
    const currentProfile = (await readProfileSnapshot(profile.id)) ?? blankProfile(profile.id, profile.phone || "", profile.email || null);
    const nextProfile: UserProfile = {
      ...currentProfile,
      ...profile,
      auth_id: profile.auth_id ?? currentProfile.auth_id,
      email: sanitizeProfileEmail(profile.email ?? currentProfile.email),
      updated_at: now,
      created_at: currentProfile.created_at || now,
      last_login: profile.last_login ?? currentProfile.last_login,
      preferences: profile.preferences ?? currentProfile.preferences,
    };

    try {
      await setDoc(userDoc(profile.id), nextProfile, { merge: true });
    } catch (error) {
      markFirestoreUnavailable(error);
      if (isFirestoreUnavailableError(error)) {
        return nextProfile;
      }
      throw error;
    }
    return nextProfile;
  },

  async updateLastLogin(authId?: string) {
    requireFirebase();
    if (!firestoreAvailable) {
      return null;
    }

    const targetUserId = authId || auth.currentUser?.uid;
    if (!targetUserId) {
      return null;
    }

    let snapshot;
    try {
      snapshot = await getDoc(userDoc(targetUserId));
    } catch (error) {
      markFirestoreUnavailable(error);
      if (isFirestoreUnavailableError(error)) {
        return null;
      }
      throw error;
    }

    if (!snapshot.exists()) {
      return null;
    }

    const profile = snapshot.data() as UserProfile;
    const nextProfile = {
      ...profile,
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await setDoc(userDoc(targetUserId), nextProfile, { merge: true });
    } catch (error) {
      markFirestoreUnavailable(error);
      if (isFirestoreUnavailableError(error)) {
        return nextProfile;
      }
      throw error;
    }
    return nextProfile;
  },
};

export const userService = {
  async listUsers(): Promise<UserProfile[]> {
    requireFirebase();
    const snapshot = await getDocs(collection(firestore!, USERS_COLLECTION));
    return snapshot.docs.map((entry) => entry.data() as UserProfile);
  },

  async updateUser(userId: string, changes: Partial<UserProfile>) {
    requireFirebase();
    await updateDoc(userDoc(userId), {
      ...changes,
      updated_at: new Date().toISOString(),
    });
  },

  async deleteUser(userId: string) {
    requireFirebase();
    await deleteDoc(userDoc(userId));
  },
};

export const authService = {
  async getCurrentUser() {
    await ensureAuthInitialized();
    return auth.currentUser;
  },

  async getSession() {
    await ensureAuthInitialized();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { session: null, profile: null };
    }

    const session = await mapFirebaseUserToSession(currentUser);
    const profile = (await userProfileService.getUserProfile(currentUser.uid)) ?? fallbackProfileFromUser(currentUser);

    return { session, profile };
  },

  async signIn(input: { phone: string; password: string }) {
    await ensureAuthInitialized();
    const credential = await signInWithEmailAndPassword(auth!, phoneToEmail(input.phone), input.password);
    // Skip profile fetching for faster sign-in - let AuthContext handle it
    return this.getSession();
  },

  async register(input: RegisterInput) {
    await ensureAuthInitialized();
    const normalizedPhone = normalizePhoneNumber(input.phone);
    const email = phoneToEmail(normalizedPhone);
    const credential = await createUserWithEmailAndPassword(auth!, email, input.password);

    await firebaseUpdateProfile(credential.user, {
      displayName: input.fullName?.trim() || normalizedPhone,
    });

    const nextProfile = await userProfileService.upsertProfile({
      id: credential.user.uid,
      auth_id: credential.user.uid,
      name: input.fullName?.trim() || null,
      mobile: normalizedPhone || null,
      email: null,
      phone: normalizedPhone,
      is_active: true,
      preferences: { role: "student" } as Json,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      grade: null,
      school: null,
      profile_image_url: null,
      date_of_birth: null,
      gender: null,
    });

    return { session: await mapFirebaseUserToSession(credential.user), profile: nextProfile };
  },

  async updateProfile(input: UpdateProfileInput) {
    await ensureAuthInitialized();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    if (input.name) {
      await firebaseUpdateProfile(currentUser, { displayName: input.name });
    }

    const currentProfile = (await userProfileService.getUserProfile(currentUser.uid)) ?? blankProfile(currentUser.uid, currentUser.phoneNumber || "", currentUser.email || null);
    const nextProfile = await userProfileService.upsertProfile({
      ...currentProfile,
      id: currentUser.uid,
      auth_id: currentUser.uid,
      name: input.name ?? currentProfile.name,
      email: sanitizeProfileEmail(input.email ?? currentProfile.email),
      grade: input.grade ?? currentProfile.grade,
      school: input.school ?? currentProfile.school,
      gender: input.gender ?? currentProfile.gender,
      date_of_birth: input.date_of_birth ?? currentProfile.date_of_birth,
      profile_image_url: input.profile_image_url ?? currentProfile.profile_image_url,
      phone: currentProfile.phone || normalizePhoneNumber(currentUser.phoneNumber || ""),
    });

    return { session: await mapFirebaseUserToSession(currentUser), profile: nextProfile };
  },

  async signOut() {
    await ensureAuthInitialized();
    await firebaseSignOut(auth!);
  },

  onAuthStateChanged(
    callback: (value: { session: AppSession | null; profile: UserProfile | null }) => void | Promise<void>,
  ) {
    requireFirebase();

    void ensureAuthInitialized();

    return onAuthStateChanged(auth!, async (currentUser) => {
      if (!currentUser) {
        await callback({ session: null, profile: null });
        return;
      }

      const session = await mapFirebaseUserToSession(currentUser);
      const profile = (await userProfileService.getUserProfile(currentUser.uid)) ?? fallbackProfileFromUser(currentUser);
      await callback({ session, profile });
    });
  },
};

export const checkAuthStatus = async (): Promise<{ session: AppSession | null; profile: UserProfile | null }> => {
  requireFirebase();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return { session: null, profile: null };
  }

  return {
    session: await mapFirebaseUserToSession(currentUser),
    profile: await userProfileService.getUserProfile(currentUser.uid),
  };
};

export type AuthErrorCategory =
  | "invalid-credentials"
  | "user-not-found"
  | "user-disabled"
  | "email-in-use"
  | "weak-password"
  | "network-error"
  | "too-many-requests"
  | "invalid-email"
  | "wrong-password"
  | "requires-recent-login"
  | "unauthorized-domain"
  | "internal-error"
  | "unknown";

export interface AuthErrorDetails {
  category: AuthErrorCategory;
  message: string;
  userMessage: string;
  shouldRetry: boolean;
  canContactSupport: boolean;
}

const getErrorCategory = (message: string): AuthErrorCategory => {
  if (message.includes("auth/invalid-credential")) return "invalid-credentials";
  if (message.includes("auth/user-not-found")) return "user-not-found";
  if (message.includes("auth/user-disabled")) return "user-disabled";
  if (message.includes("auth/email-already-in-use")) return "email-in-use";
  if (message.includes("auth/weak-password")) return "weak-password";
  if (message.includes("auth/network-request-failed")) return "network-error";
  if (message.includes("auth/too-many-requests")) return "too-many-requests";
  if (message.includes("auth/invalid-email")) return "invalid-email";
  if (message.includes("auth/wrong-password")) return "wrong-password";
  if (message.includes("auth/requires-recent-login")) return "requires-recent-login";
  if (message.includes("auth/unauthorized-domain")) return "unauthorized-domain";
  if (message.includes("auth/internal-error")) return "internal-error";
  return "unknown";
};

const getErrorDetails = (category: AuthErrorCategory, originalMessage: string): AuthErrorDetails => {
  const details: Record<AuthErrorCategory, AuthErrorDetails> = {
    "invalid-credentials": {
      category,
      message: originalMessage,
      userMessage: "The mobile number or password you entered is incorrect. Please check and try again.",
      shouldRetry: true,
      canContactSupport: false,
    },
    "user-not-found": {
      category,
      message: originalMessage,
      userMessage: "No account found with this mobile number. Please sign up to create an account.",
      shouldRetry: false,
      canContactSupport: false,
    },
    "user-disabled": {
      category,
      message: originalMessage,
      userMessage: "This account has been disabled. Please contact support at alexgetahuntadese@gmail.com or 0992010092.",
      shouldRetry: false,
      canContactSupport: true,
    },
    "email-in-use": {
      category,
      message: originalMessage,
      userMessage: "This mobile number is already registered. Please sign in instead.",
      shouldRetry: false,
      canContactSupport: false,
    },
    "weak-password": {
      category,
      message: originalMessage,
      userMessage: "Password must be at least 6 characters long. Please choose a stronger password.",
      shouldRetry: true,
      canContactSupport: false,
    },
    "network-error": {
      category,
      message: originalMessage,
      userMessage: "Unable to connect. Please check your internet connection and try again.",
      shouldRetry: true,
      canContactSupport: false,
    },
    "too-many-requests": {
      category,
      message: originalMessage,
      userMessage: "Too many attempts. Please wait a few minutes before trying again.",
      shouldRetry: false,
      canContactSupport: false,
    },
    "invalid-email": {
      category,
      message: originalMessage,
      userMessage: "Please enter a valid mobile number.",
      shouldRetry: true,
      canContactSupport: false,
    },
    "wrong-password": {
      category,
      message: originalMessage,
      userMessage: "Incorrect password. Please try again or reset your password if you've forgotten it.",
      shouldRetry: true,
      canContactSupport: false,
    },
    "requires-recent-login": {
      category,
      message: originalMessage,
      userMessage: "For security reasons, please sign in again to continue.",
      shouldRetry: false,
      canContactSupport: false,
    },
    "unauthorized-domain": {
      category,
      message: originalMessage,
      userMessage: "This domain is not authorized. Please contact support at alexgetahuntadese@gmail.com.",
      shouldRetry: false,
      canContactSupport: true,
    },
    "internal-error": {
      category,
      message: originalMessage,
      userMessage: "Something went wrong on our end. Please try again in a moment.",
      shouldRetry: true,
      canContactSupport: true,
    },
    "unknown": {
      category,
      message: originalMessage,
      userMessage: "An unexpected error occurred. Please try again or contact support if the problem continues.",
      shouldRetry: true,
      canContactSupport: true,
    },
  };

  return details[category];
};

export const getAuthErrorDetails = (error: unknown): AuthErrorDetails => {
  const message = error instanceof Error ? error.message : String(error);
  const category = getErrorCategory(message);
  return getErrorDetails(category, message);
};

export const formatAuthError = (error: unknown): string => {
  return getAuthErrorDetails(error).userMessage;
};

export const shouldRetryAuthError = (error: unknown): boolean => {
  return getAuthErrorDetails(error).shouldRetry;
};

export const getAuthErrorCategory = (error: unknown): AuthErrorCategory => {
  return getAuthErrorDetails(error).category;
};

export const isPhoneAlreadyRegisteredError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("auth/email-already-in-use");
};
