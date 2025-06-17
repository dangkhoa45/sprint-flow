/**
 * Utility functions for working with cookies
 */

export function parseCookies(cookieString?: string): Record<string, string> {
  if (!cookieString) return {};
  
  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
}

export function getAccessTokenFromCookies(host?: string): string | undefined {
  if (typeof window === 'undefined' || !host) {
    console.log('⚠️ Cannot get cookies: window undefined or no host');
    return undefined;
  }
  
  const cookies = parseCookies(document.cookie);
  const tokenKey = `${host}:at`;
  const token = cookies[tokenKey];
  
  console.log('🍪 Available cookies:', Object.keys(cookies));
  console.log('🔍 Looking for token key:', tokenKey);
  console.log('🔑 Token found:', token ? token.substring(0, 20) + '...' : 'None');
  
  return token;
}

export function getCookieValue(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const cookies = parseCookies(document.cookie);
  return cookies[name];
}
