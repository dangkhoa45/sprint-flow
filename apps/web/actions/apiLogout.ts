'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { INTERNAL_API_HOST } from '../config/env';
import { log } from '../utils/logger';

export async function apiLogout() {
  try {
    const host = (await headers()).get('host');
    const cookieStore = await cookies();

    if (!host) {
      throw new Error('Host header not found');
    }

    // Get access token for server-side logout if available
    const accessToken = cookieStore.get(`${host}:at`)?.value;

    // Call server logout API to invalidate session
    if (accessToken) {
      try {
        const response = await fetch(`${INTERNAL_API_HOST}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          cache: 'no-cache',
        });

        if (!response.ok) {
          log('Server logout failed with status: ' + response.status);
        }
      } catch (serverError) {
        log(
          'Server logout failed, continuing with client logout: ' +
            (serverError instanceof Error
              ? serverError.message
              : String(serverError))
        );
      }
    }

    // Clear all authentication cookies
    cookieStore.delete(`${host}:ut`); // user token
    cookieStore.delete(`${host}:at`); // access token
    cookieStore.delete(`${host}:rt`); // refresh token
    cookieStore.delete(`${host}:re`); // remember me

    // Clear any other session-related cookies
    cookieStore.delete(`${host}:session`);

    log('User logged out successfully');
  } catch (error) {
    log(
      'Logout error: ' +
        (error instanceof Error ? error.message : String(error))
    );
    // Even if there's an error, we should still try to clear cookies
    try {
      const host = (await headers()).get('host');
      const cookieStore = await cookies();
      if (host) {
        cookieStore.delete(`${host}:ut`);
        cookieStore.delete(`${host}:at`);
        cookieStore.delete(`${host}:rt`);
        cookieStore.delete(`${host}:re`);
        cookieStore.delete(`${host}:session`);
      }
    } catch (cleanupError) {
      log(
        'Cookie cleanup error: ' +
          (cleanupError instanceof Error
            ? cleanupError.message
            : String(cleanupError))
      );
    }
    throw error; // Re-throw to let the caller handle it
  }

  // Redirect to login page
  redirect('/login');
}
