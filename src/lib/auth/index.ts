import { cookies } from 'next/headers';

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  // Simple password-based authentication (for production, use proper auth system like NextAuth.js)
  adminPassword: process.env.ADMIN_PASSWORD || 'admin123', // Default password, change in production!

  // Cookie settings
  cookieName: 'llm_council_admin_session',
  sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

/**
 * Session data structure
 */
interface AdminSession {
  authenticated: boolean;
  timestamp: number;
}

/**
 * Verify admin password
 */
export function verifyAdminPassword(password: string): boolean {
  return password === AUTH_CONFIG.adminPassword;
}

/**
 * Create admin session
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  const session: AdminSession = {
    authenticated: true,
    timestamp: Date.now(),
  };

  cookieStore.set({
    name: AUTH_CONFIG.cookieName,
    value: JSON.stringify(session),
    httpOnly: true,
    path: '/', // Use root path so cookie is sent to API routes too
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_CONFIG.sessionDuration / 1000, // Convert to seconds
  });
}

/**
 * Clear admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: AUTH_CONFIG.cookieName,
    path: '/', // Use root path to match the session cookie
  });
}

/**
 * Check if user is authenticated
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get(AUTH_CONFIG.cookieName);

  if (!sessionCookie) {
    return false;
  }

  try {
    const session: AdminSession = JSON.parse(sessionCookie.value);

    // Check if session is still valid
    if (!session.authenticated) {
      return false;
    }

    const sessionAge = Date.now() - session.timestamp;
    if (sessionAge > AUTH_CONFIG.sessionDuration) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[Auth] Failed to parse session cookie:', error);
    return false;
  }
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAdminAuth(): Promise<void> {
  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}
