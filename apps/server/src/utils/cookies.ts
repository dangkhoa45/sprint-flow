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
  // Check for Authorization header first (most reliable)
  if (request.headers?.authorization) {
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }
  }

  // Check for session token
  if (request.session?.token) {
    return request.session.token;
  }

  // Check for access token in cookies
  if (request.headers?.cookie) {
    const cookies = parseCookies(request.headers.cookie);
    // Try different cookie key formats
    const host = request.headers?.host;
    const possibleKeys = [
      `${host}:at`,
      `localhost:8000:at`,
      'localhost:8000:at',
      'at',
    ];

    for (const key of possibleKeys) {
      if (cookies[key]) {
        return cookies[key];
      }
    }
  }

  return undefined;
}
