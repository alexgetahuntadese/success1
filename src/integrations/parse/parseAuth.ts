import Parse, { isParseConfigured } from '@/integrations/parse/parseConfig';
import { syncLatestPaymentStatusForUser } from '@/integrations/parse/parsePayments';
import type {
  AuthSessionResponse,
  AuthUser,
  RegisterInput,
  SignInInput,
  UpdateProfileInput,
  UserProfile,
} from '@/lib/auth/types';

// Parse User class for extended user data
const UserProfileClass = 'UserProfile';
const StudentsClass = 'Students';

const isParseReady = () => Boolean(isParseConfigured && Parse?.User && Parse?.Query && Parse?.Object);

const normalizePhoneNumber = (value: string) => {
  const compact = value.replace(/[^\d+]/g, "");

  if (!compact) {
    return "";
  }

  if (compact.startsWith("+")) {
    return compact;
  }

  if (compact.startsWith("251")) {
    return `+${compact}`;
  }

  if (compact.startsWith("0")) {
    return `+251${compact.slice(1)}`;
  }

  return compact;
};

// Helper to convert Parse User to AuthUser
const parseUserToAuthUser = (parseUser: Parse.User): AuthUser => ({
  id: parseUser.id || '',
  phone: parseUser.get('username') || parseUser.get('phone') || '',
  email: parseUser.get('email') || null,
  user_metadata: {
    name: parseUser.get('name') || null,
    mobile: parseUser.get('username') || parseUser.get('phone') || null,
  },
});

// Helper to convert Parse Object to UserProfile
const parseObjectToUserProfile = (obj: Parse.Object, parseUser: Parse.User): UserProfile => ({
  id: obj.id || '',
  auth_id: parseUser.id,
  name: obj.get('name') || parseUser.get('name') || null,
  mobile: parseUser.get('username') || null,
  email: obj.get('email') || parseUser.get('email') || null,
  phone: parseUser.get('username') || '',
  grade: obj.get('grade') || null,
  school: obj.get('school') || null,
  profile_image_url: obj.get('profileImageUrl') || null,
  date_of_birth: obj.get('dateOfBirth') || null,
  gender: obj.get('gender') || null,
  preferences: obj.get('preferences') || {},
  is_active: obj.get('isActive') !== false,
  created_at: obj.createdAt?.toISOString() || new Date().toISOString(),
  updated_at: obj.updatedAt?.toISOString() || new Date().toISOString(),
  last_login: obj.get('lastLogin') || null,
});

const upsertStudentRecord = async (parseUser: Parse.User, preferredName?: string | null) => {
  const query = new Parse.Query(StudentsClass);
  query.equalTo('user', parseUser);

  let student = await query.first();
  if (!student) {
    const Student = Parse.Object.extend(StudentsClass);
    student = new Student();
    student.set('user', parseUser);
  }

  const mobile = parseUser.get('username') || parseUser.get('phone') || '';
  student.set('mobile', mobile);
  student.set('phone', mobile);
  student.set('name', preferredName?.trim() || parseUser.get('name') || mobile);
  student.set('isActive', true);
  student.set('lastLogin', new Date().toISOString());

  await student.save();
  return student;
};

// Get or create user profile
const getUserProfile = async (parseUser: Parse.User): Promise<UserProfile> => {
  const query = new Parse.Query(UserProfileClass);
  query.equalTo('user', parseUser);
  
  let profile = await query.first();
  
  if (!profile) {
    // Create new profile
    const ProfileClass = Parse.Object.extend(UserProfileClass);
    profile = new ProfileClass();
    profile.set('user', parseUser);
    profile.set('name', parseUser.get('name') || '');
    profile.set('email', parseUser.get('email') || '');
    profile.set('phone', parseUser.get('username') || '');
    profile.set('mobile', parseUser.get('username') || '');
    profile.set('isActive', true);
    profile.set('preferences', {});
    await profile.save();
  }
  
  return parseObjectToUserProfile(profile, parseUser);
};

export const parseAuthService = {
  async getSession(): Promise<AuthSessionResponse> {
    if (!isParseReady()) {
      return {
        session: null,
        profile: null,
      };
    }

    const currentUser = Parse.User.current();
    
    if (!currentUser) {
      return {
        session: null,
        profile: null,
      };
    }
    
    try {
      // Refresh the user to get latest data
      await currentUser.fetch();
      await upsertStudentRecord(currentUser);
      await syncLatestPaymentStatusForUser(currentUser);
      const userProfile = await getUserProfile(currentUser);
      const authUser = parseUserToAuthUser(currentUser);
      
      return {
        session: {
          user: authUser,
          accessToken: currentUser.getSessionToken(),
          expiresAt: null,
        },
        profile: userProfile,
      };
    } catch (error) {
      console.error('Parse getSession error:', error);
      // Clear invalid session
      if (Parse?.User?.logOut) {
        await Parse.User.logOut();
      }
      return {
        session: null,
        profile: null,
      };
    }
  },

  async register(input: RegisterInput): Promise<AuthSessionResponse> {
    if (!isParseReady()) {
      throw new Error('Authentication is not configured. Please set Back4App environment keys.');
    }

    const normalizedPhone = normalizePhoneNumber(input.phone);
    if (!normalizedPhone) {
      throw new Error('Please enter a valid mobile number');
    }

    const user = new Parse.User();
    user.set('username', normalizedPhone);
    user.set('phone', normalizedPhone);
    user.set('password', input.password);
    user.set('name', input.fullName?.trim() || normalizedPhone);
    
    try {
      const parseUser = await user.signUp();
      await upsertStudentRecord(parseUser, input.fullName || null);
      const userProfile = await getUserProfile(parseUser);
      const authUser = parseUserToAuthUser(parseUser);
      
      return {
        session: {
          user: authUser,
          accessToken: parseUser.getSessionToken(),
          expiresAt: null,
        },
        profile: userProfile,
      };
    } catch (error: any) {
      console.error('Parse register error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  async signIn(input: SignInInput): Promise<AuthSessionResponse> {
    if (!isParseReady()) {
      throw new Error('Authentication is not configured. Please set Back4App environment keys.');
    }

    const normalizedPhone = normalizePhoneNumber(input.phone);
    if (!normalizedPhone) {
      throw new Error('Please enter a valid mobile number');
    }

    try {
      const parseUser = await Parse.User.logIn(normalizedPhone, input.password);
      await upsertStudentRecord(parseUser);
      await syncLatestPaymentStatusForUser(parseUser);
      const userProfile = await getUserProfile(parseUser);
      const authUser = parseUserToAuthUser(parseUser);
      
      // Update last login
      const query = new Parse.Query(UserProfileClass);
      query.equalTo('user', parseUser);
      const profile = await query.first();
      if (profile) {
        profile.set('lastLogin', new Date().toISOString());
        await profile.save();
      }
      
      return {
        session: {
          user: authUser,
          accessToken: parseUser.getSessionToken(),
          expiresAt: null,
        },
        profile: userProfile,
      };
    } catch (error: any) {
      console.error('Parse signIn error:', error);
      throw new Error(error.message || 'Invalid phone or password');
    }
  },

  async updateProfile(input: UpdateProfileInput): Promise<AuthSessionResponse> {
    if (!isParseReady()) {
      throw new Error('Authentication is not configured. Please set Back4App environment keys.');
    }

    const currentUser = Parse.User.current();
    
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      // Update Parse User
      if (input.name) {
        currentUser.set('name', input.name);
      }
      if (input.email !== undefined) {
        currentUser.set('email', input.email);
      }
      await currentUser.save();
      
      // Update UserProfile
      const query = new Parse.Query(UserProfileClass);
      query.equalTo('user', currentUser);
      const profile = await query.first();
      
      if (profile) {
        if (input.name) {
          profile.set('name', input.name);
        }
        if (input.email !== undefined) {
          profile.set('email', input.email);
        }
        if (input.grade !== undefined) {
          profile.set('grade', input.grade);
        }
        if (input.school !== undefined) {
          profile.set('school', input.school);
        }
        if (input.gender !== undefined) {
          profile.set('gender', input.gender);
        }
        if (input.date_of_birth !== undefined) {
          profile.set('dateOfBirth', input.date_of_birth);
        }
        if (input.profile_image_url !== undefined) {
          profile.set('profileImageUrl', input.profile_image_url);
        }
        await profile.save();
      }

      await upsertStudentRecord(currentUser, input.name);
      
      const userProfile = await getUserProfile(currentUser);
      const authUser = parseUserToAuthUser(currentUser);
      
      return {
        session: {
          user: authUser,
          accessToken: currentUser.getSessionToken(),
          expiresAt: null,
        },
        profile: userProfile,
      };
    } catch (error: any) {
      console.error('Parse updateProfile error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  },

  async signOut(): Promise<void> {
    if (!isParseReady()) {
      return;
    }

    try {
      await Parse.User.logOut();
    } catch (error: any) {
      console.error('Parse signOut error:', error);
      // Still clear local session even if server logout fails
    }
  },

  // Additional Parse-specific methods
  async requestPasswordReset(email: string): Promise<void> {
    if (!isParseReady()) {
      throw new Error('Authentication is not configured. Please set Back4App environment keys.');
    }

    try {
      await Parse.User.requestPasswordReset(email);
    } catch (error: any) {
      console.error('Parse password reset error:', error);
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    if (!isParseReady()) {
      throw new Error('Authentication is not configured. Please set Back4App environment keys.');
    }

    const currentUser = Parse.User.current();
    
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    try {
      // Re-authenticate with old password
      await Parse.User.logIn(currentUser.get('username'), oldPassword);
      
      // Set new password
      currentUser.setPassword(newPassword);
      await currentUser.save();
    } catch (error: any) {
      console.error('Parse change password error:', error);
      throw new Error(error.message || 'Password change failed');
    }
  },
};

export default parseAuthService;
