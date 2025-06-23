import { NextRequest, NextResponse } from 'next/server';
import { INTERNAL_API_HOST } from '../../../../config/env';
import { log } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${INTERNAL_API_HOST}/api/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to send reset email' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Password reset instructions have been sent to your email.',
    });
  } catch (error) {
    log('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
