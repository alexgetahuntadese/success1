import Parse from '@/integrations/parse/parseConfig';
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

// Helper to convert Parse User to AuthUser
const parseUserToAuthUser = (parseUser: Parse.User): AuthUser => ({
  id: parseUser.id || '',
  phone: parseUser.get('username') || '',
  email: parseUser.get('email') || null,
  user_metadata: {
    name: parseUser.get('name') || null,
    mobile: parseUser.get('username') || null,
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
    profile.set('isActive', true);
    profile.set('preferences', {});
    await profile.save();
  }
  
  return parseObjectToUserProfile(profile, parseUser);
};

export const parseAuthService = {
  async getSession(): Promise<AuthSessionResponse> {
    try {
      const currentUser = Parse.User.current();
      
      if (!currentUser) {
        return {
          session: null,
          profile: null,
        };
      }
      
      // Refresh the user to get latest data
      await currentUser.fetch();
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
      console.error('Parse getSession error:', error);
      // Clear invalid session
      try {
        Parse.User.logOut();
      } catch {}
      return {
        session: null,
        profile: null,
      };
    }
  },

  async register(input: RegisterInput): Promise<AuthSessionResponse> {
    try {
      const user = new Parse.User();
      user.set('username', input.phone);
      user.set('password', input.password);
      user.set('name', input.fullName);
      
      const parseUser = await user.signUp();
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
    try {
      const parseUser = await Parse.User.logIn(input.phone, input.password);
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
    try {
      const currentUser = Parse.User.current();
      
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
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
        await profile.save();
      }
      
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
    try {
      await Parse.User.logOut();
    } catch (error: any) {
      console.error('Parse signOut error:', error);
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await Parse.User.requestPasswordReset(email);
    } catch (error: any) {
      console.error('Parse password reset error:', error);
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const currentUser = Parse.User.current();
      
      if (!currentUser) {
        throw new Error('No authenticated user');
      }
      
      await Parse.User.logIn(currentUser.get('username'), oldPassword);
      currentUser.setPassword(newPassword);
      await currentUser.save();
    } catch (error: any) {
      console.error('Parse change password error:', error);
      throw new Error(error.message || 'Password change failed');
    }
  },
};

export default parseAuthService;
