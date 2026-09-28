import type { AuthCredentials } from '../types';

const STORAGE_KEY = 'greenApiCredentials';

export function saveCredentials(credentials: AuthCredentials): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function getCredentials(): AuthCredentials | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthCredentials;
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  localStorage.removeItem(STORAGE_KEY);
}