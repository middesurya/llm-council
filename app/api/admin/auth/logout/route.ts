import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';
import { logWithContext } from '@/lib/observability';

export async function POST() {
  try {
    await clearAdminSession();

    logWithContext.info('Admin logout successful');

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logWithContext.error('Logout error', error as Error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
