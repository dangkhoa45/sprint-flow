/**
 * Utility functions for working with cookies
 */

import { log } from './logger';

export function parseCookies(cookieString?: string): Record<string, string> {
  if (!cookieString) return {};

  return cookieString
    .split(';')
    .map(cookie => cookie.trim())
    .reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split('=');
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      },
      {} as Record<string, string>
    );
}

export function getAccessTokenFromCookies(host?: string): string | undefined {
  if (typeof window === 'undefined' || !host) {
    log('⚠️ Cannot get cookies: window undefined or no host');
    return undefined;
  }

  const cookies = parseCookies(document.cookie);
  const tokenKey = `${host}:at`;
  const token = cookies[tokenKey];

  log('🍪 Available cookies:', Object.keys(cookies));
  log('🔍 Looking for token key:', tokenKey);
  log('🔑 Token found:', token ? token.substring(0, 20) + '...' : 'None');

  return token;
}

export function getCookieValue(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const cookies = parseCookies(document.cookie);
  return cookies[name];
}

export function setCookie(name: string, value: string, days = 7) {
  try {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  } catch (error) {
    log('Error setting cookie:', error);
  }
}

export function getCookie(name: string): string | null {
  try {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.startsWith(' ')) c = c.substring(1, c.length);
      if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (error) {
    log('Error getting cookie:', error);
    return null;
  }
}

export function deleteCookie(name: string) {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  } catch (error) {
    log('Error deleting cookie:', error);
  }
}
