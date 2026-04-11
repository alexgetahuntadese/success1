import type { User as FirebaseUser } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateEmail,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, firebaseConfigError, firebaseReady, firestore } from "@/lib/firebase/client";
import type { AppSession, Json, UserProfile, RegisterInput, UpdateProfileInput } from "@/lib/auth/types";

const USERS_COLLECTION = "users";
const PHONE_EMAIL_DOMAIN = "simple-road.firebaseapp.local";

const requireFirebase = () => {
  if (!firebaseReady || !auth || !firestore) {
    throw new Error(firebaseConfigError || "Firebase is not configured.");
  }
};

export const normalizePhoneNumber = (phone: string) => phone.trim().replace(/[^\d+]/g, "");

const phoneToEmail = (phone: string) => `${normalizePhoneNumber(phone).replace(/[^\d]/g, "")}@${PHONE_EMAIL_DOMAIN}`;

const blankProfile = (authId: string, phone: string, email: string | null): UserProfile => ({
  id: authId,
  auth_id: authId,
  name: null,
  mobile: phone,
  email,
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

const mapFirebaseUserToAuthUser = (user: FirebaseUser) => ({
  id: user.uid,
  phone: user.phoneNumber || user.displayName || "",
  email: user.email,
  user_metadata: {
    name: user.displayName || null,
    mobile: user.phoneNumber || null,
  },
});

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
  const snapshot = await getDoc(userDoc(userId));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data() as UserProfile;
};

const saveProfile = async (profile: UserProfile) => {
  requireFirebase();
  await setDoc(userDoc(profile.id), {
    ...profile,
    updated_at: new Date().toISOString(),
  }, { merge: true });
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
    const now = new Date().toISOString();
    const currentProfile = (await readProfileSnapshot(profile.id)) ?? blankProfile(profile.id, profile.phone || "", profile.email || null);
    const nextProfile: UserProfile = {
      ...currentProfile,
      ...profile,
      auth_id: profile.auth_id ?? currentProfile.auth_id,
      updated_at: now,
      created_at: currentProfile.created_at || now,
      last_login: profile.last_login ?? currentProfile.last_login,
      preferences: profile.preferences ?? currentProfile.preferences,
    };

    await setDoc(userDoc(profile.id), nextProfile, { merge: true });
    return nextProfile;
  },

  async updateLastLogin(authId?: string) {
    requireFirebase();
    const targetUserId = authId || auth.currentUser?.uid;
    if (!targetUserId) {
      return null;
    }

    const snapshot = await getDoc(userDoc(targetUserId));
    if (!snapshot.exists()) {
      return null;
    }

    const profile = snapshot.data() as UserProfile;
    const nextProfile = {
      ...profile,
      last_login: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(userDoc(targetUserId), nextProfile, { merge: true });
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
    requireFirebase();
    return auth.currentUser;
  },

  async getSession() {
    requireFirebase();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return { session: null, profile: null };
    }

    const session = await mapFirebaseUserToSession(currentUser);
    const profile = await userProfileService.getUserProfile(currentUser.uid);

    return { session, profile };
  },

  async signIn(input: { phone: string; password: string }) {
    requireFirebase();
    const credential = await signInWithEmailAndPassword(auth!, phoneToEmail(input.phone), input.password);
    const profile = await userProfileService.getUserProfile(credential.user.uid);
    if (profile) {
      await userProfileService.updateLastLogin(profile.id);
    }
    return this.getSession();
  },

  async register(input: RegisterInput) {
    requireFirebase();
    const email = phoneToEmail(input.phone);
    const credential = await createUserWithEmailAndPassword(auth!, email, input.password);

    await firebaseUpdateProfile(credential.user, {
      displayName: input.fullName?.trim() || input.phone,
    });

    const nextProfile = await userProfileService.upsertProfile({
      id: credential.user.uid,
      auth_id: credential.user.uid,
      name: input.fullName?.trim() || null,
      mobile: input.phone.trim() || null,
      email,
      phone: normalizePhoneNumber(input.phone),
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
    requireFirebase();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    if (input.email && input.email !== currentUser.email) {
      await updateEmail(currentUser, input.email);
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
      email: input.email ?? currentProfile.email,
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
    requireFirebase();
    await firebaseSignOut(auth!);
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

export const formatAuthError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return message || "An unexpected auth error occurred.";
};

