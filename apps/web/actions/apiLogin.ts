'use server';

import { cookies, headers } from 'next/headers';
import { INTERNAL_API_HOST } from '../config/env';
import { LoginApiResponse } from '../types/login';
import { jsonToBase64 } from '../utils/encoding';
import { log } from '../utils/logger';

export async function apiLogin(formData: FormData): Promise<LoginApiResponse> {
  const forwardIP = (await headers()).get('x-forwarded-for');
  const ua = (await headers()).get('user-agent');
  const host = (await headers()).get('host');

  // Safely extract and convert FormData values
  const isRememberValue = formData.get('remember');
  const usernameValue = formData.get('username');
  const passwordValue = formData.get('password');

  const isRememberStr =
    isRememberValue instanceof File
      ? 'false'
      : String(isRememberValue || 'false');
  const usernameStr =
    usernameValue instanceof File ? '' : String(usernameValue || '');
  const passwordStr =
    passwordValue instanceof File ? '' : String(passwordValue || '');

  const expiresDate =
    isRememberStr === 'true'
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : undefined;

  try {
    const response = await fetch(`${INTERNAL_API_HOST}/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: usernameStr,
        password: passwordStr,
      }),
      headers: {
        'content-type': 'application/json',
        'x-user-agent': ua ?? '',
        'x-forwarded-for': forwardIP ?? '',
      },
      cache: 'no-cache',
    });

    log(`LOGIN >> ${usernameStr}: ${response.status} ${response.statusText}`);

    const json = await response.json();

    if (response.ok && json.accessToken) {
      const cookieStore = cookies();

      log('🍪 Setting cookies for host: ' + (host || 'unknown'));
      log(
        '🔑 Access token: ' +
          (json.accessToken as string).substring(0, 20) +
          '...'
      );

      if (isRememberStr === 'true') {
        (await cookieStore).set(`${host}:re`, isRememberStr, {
          httpOnly: true,
          expires: expiresDate,
        });
      }
      (await cookieStore).set(`${host}:at`, json.accessToken, {
        httpOnly: true,
        expires: expiresDate,
      });
      (await cookieStore).set(`${host}:rt`, json.refreshToken, {
        httpOnly: true,
        expires: expiresDate,
      });
      (await cookieStore).set(`${host}:ut`, jsonToBase64(json.profile), {
        httpOnly: true,
        expires: expiresDate,
      });

      log('✅ Cookies set successfully');

      // Return user data instead of redirecting
      return {
        success: true,
        user: json.profile,
        accessToken: json.accessToken,
      };
    } else {
      return {
        success: false,
        error: json.message || 'Đăng nhập thất bại',
      };
    }
  } catch (error) {
    log(
      'Login API error: ' +
        (error instanceof Error ? error.message : String(error))
    );
    return {
      success: false,
      error: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
    };
  }
}
