import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession } from '@/lib/auth';
import { logWithContext } from '@/lib/observability';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify password
    if (!verifyAdminPassword(password)) {
      logWithContext.warn('Failed admin login attempt', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });

      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create session
    await createAdminSession();

    logWithContext.info('Admin login successful', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    logWithContext.error('Login error', error as Error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
