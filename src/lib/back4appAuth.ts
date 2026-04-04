import Parse from './back4app';

export interface Back4AppUser {
  id: string;
  phone: string;
  name: string;
  email?: string;
  sessionToken: string;
  isActive: boolean;
  preferences?: Record<string, any>;
}

export interface SignUpInput {
  fullName: string;
  phone: string;
  password: string;
}

export interface SignInInput {
  phone: string;
  password: string;
}

const normalizePhoneNumber = (value: string): string => {
  const compact = value.replace(/[^\d+]/g, '');
  if (!compact) return '';
  if (compact.startsWith('+')) return compact;
  if (compact.startsWith('251')) return `+${compact}`;
  if (compact.startsWith('0')) return `+251${compact.slice(1)}`;
  return compact;
};

const mapParseUserToBack4AppUser = (user: Parse.User): Back4AppUser => {
  return {
    id: user.id || '',
    phone: user.get('phone') || '',
    name: user.get('name') || '',
    email: user.get('email') || undefined,
    sessionToken: user.get('sessionToken') || '',
    isActive: user.get('isActive') !== false,
    preferences: user.get('preferences') || {},
  };
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('studyAppAuthToken');
};

const setStoredToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('studyAppAuthToken', token);
  } else {
    localStorage.removeItem('studyAppAuthToken');
  }
};

export const back4AppAuthService = {
  async signUp(input: SignUpInput): Promise<Back4AppUser> {
    const normalizedPhone = normalizePhoneNumber(input.phone);
    
    const user = new Parse.User();
    user.set('username', normalizedPhone);
    user.set('password', input.password);
    user.set('phone', normalizedPhone);
    user.set('name', input.fullName);
    user.set('isActive', true);
    user.set('preferences', {});

    try {
      const result = await user.signUp();
      const sessionToken = result.get('sessionToken') || '';
      setStoredToken(sessionToken);
      return mapParseUserToBack4AppUser(result);
    } catch (error: any) {
      if (error.code === 202) {
        throw new Error('An account with this phone number already exists.');
      }
      throw new Error(error.message || 'Failed to create account.');
    }
  },

  async signIn(input: SignInInput): Promise<Back4AppUser> {
    const normalizedPhone = normalizePhoneNumber(input.phone);

    try {
      const user = await Parse.User.logIn(normalizedPhone, input.password);
      const sessionToken = user.get('sessionToken') || '';
      setStoredToken(sessionToken);
      return mapParseUserToBack4AppUser(user);
    } catch (error: any) {
      if (error.code === 101) {
        throw new Error('Invalid phone number or password.');
      }
      throw new Error(error.message || 'Failed to sign in.');
    }
  },

  async signOut(): Promise<void> {
    try {
      await Parse.User.logOut();
    } catch (error) {
      // Ignore logout errors
    } finally {
      setStoredToken(null);
    }
  },

  async getCurrentUser(): Promise<Back4AppUser | null> {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      // Try to restore session from token
      const token = getStoredToken();
      if (!token) return null;

      try {
        // Note: Parse doesn't have a direct "getSession" method
        // The session is automatically restored if the user was previously logged in
        const user = Parse.User.current();
        if (user) {
          return mapParseUserToBack4AppUser(user);
        }
        return null;
      } catch {
        setStoredToken(null);
        return null;
      }
    }
    return mapParseUserToBack4AppUser(currentUser);
  },

  async updateProfile(updates: { name?: string; email?: string }): Promise<Back4AppUser> {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    if (updates.name) {
      currentUser.set('name', updates.name);
    }
    if (updates.email) {
      currentUser.set('email', updates.email);
    }

    try {
      const saved = await currentUser.save();
      return mapParseUserToBack4AppUser(saved);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile.');
    }
  },

  getStoredToken,
  setStoredToken,
};

export default back4AppAuthService;
