// Demo/Test user seeder for development
// Run this in browser console: await seedDemoUser()

import { parseAuthService } from '@/integrations/parse/parseAuth';

export const DEMO_USER = {
  phone: '0911111111',
  password: 'demo123',
  fullName: 'Demo Student',
};

export const seedDemoUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Try to sign in first (user might already exist)
    try {
      await parseAuthService.signIn({
        phone: DEMO_USER.phone,
        password: DEMO_USER.password,
      });
      return {
        success: true,
        message: `Demo user already exists. Login with:\nPhone: ${DEMO_USER.phone}\nPassword: ${DEMO_USER.password}`,
      };
    } catch {
      // User doesn't exist, create it
    }

    // Create the demo user
    await parseAuthService.register({
      fullName: DEMO_USER.fullName,
      phone: DEMO_USER.phone,
      password: DEMO_USER.password,
    });

    // Sign out after creation (so they can log in properly)
    await parseAuthService.signOut();

    return {
      success: true,
      message: `Demo user created!\nPhone: ${DEMO_USER.phone}\nPassword: ${DEMO_USER.password}`,
    };
  } catch (error: any) {
    // Handle "already registered" error
    if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
      return {
        success: true,
        message: `Demo user already exists. Login with:\nPhone: ${DEMO_USER.phone}\nPassword: ${DEMO_USER.password}`,
      };
    }

    return {
      success: false,
      message: `Failed to create demo user: ${error.message || 'Unknown error'}`,
    };
  }
};

// Auto-export for console access
if (typeof window !== 'undefined') {
  (window as any).seedDemoUser = seedDemoUser;
  (window as any).DEMO_USER = DEMO_USER;
}

export default seedDemoUser;
