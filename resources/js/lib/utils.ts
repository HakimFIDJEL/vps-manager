import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setCookie = (name: string, value: string | boolean, days = 365) => {
  if (typeof document === 'undefined') {
    return;
  }
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const part = parts.pop();
    return part ? part.split(';').shift() || null : null;
  }
  return null;
};

export const clearAllCookies = (): void => {
  if (typeof document === 'undefined') {
    return;
  }
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    clearCookie(name);
  }
}

export const clearCookie = (name: string): void => {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${name}=;path=/;max-age=0;SameSite=Lax`;
};

export const isCookieConsent = (): boolean => {
  return getCookie('cookie_consent') === 'true';
};