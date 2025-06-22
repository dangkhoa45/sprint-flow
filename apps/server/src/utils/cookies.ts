/**
 * Utility functions for working with cookies on server-side
 */

export function parseCookies(cookieString?: string): Record<string, string> {
  if (!cookieString) return {};

  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=');
        if (key && value) {
          try {
            acc[key] = decodeURIComponent(value);
          } catch {
            // If decoding fails, use the raw value
            acc[key] = value;
          }
        }
        return acc;
      },
      {} as Record<string, string>,
    );
}

export function getAccessTokenFromRequest(request: any): string | undefined {
  const host = request.headers?.host;
  const userAgent = request.headers?.['user-agent'];

  console.log('🔍 AuthGuard: Extracting token from request');
  console.log('🌐 Host:', host);
  console.log('🖥️ User-Agent:', userAgent?.substring(0, 50) + '...');

  // Check for Authorization header first (most reliable)
  if (request.headers?.authorization) {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      console.log('✅ Found Bearer token in Authorization header');
      return token;
    }
  }

  // Check for session token
  if (request.session?.token) {
    console.log('✅ Found token in session');
    return request.session.token;
  }

  // Check for access token in cookies
  if (request.headers?.cookie) {
    console.log('🍪 Raw cookies:', request.headers.cookie);
    const cookies = parseCookies(request.headers.cookie);
    console.log('🍪 Parsed cookies keys:', Object.keys(cookies));

    // Try different cookie key formats
    const possibleKeys = [
      `${host}:at`,
      `localhost:8000:at`,
      'localhost:8000:at',
      'at',
    ];

    for (const key of possibleKeys) {
      if (cookies[key]) {
        console.log('✅ Found access token with key:', key);
        return cookies[key];
      }
    }

    console.log('❌ No access token found in cookies');
    console.log('🔍 Tried keys:', possibleKeys);
  } else {
    console.log('❌ No cookies found in request');
  }

  console.log('❌ No token found anywhere');
  return undefined;
}
