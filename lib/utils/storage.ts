import { type UserProfile } from '../types/userProfile';

export const storage = {
  getUser: (): UserProfile | null => {
    try {
      const stored = localStorage.getItem('userProfile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  
  setUser: (user: UserProfile): void => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  },
  
  removeUser: (): void => {
    localStorage.removeItem('userProfile');
  },
  
  hasUser: (): boolean => {
    return !!localStorage.getItem('userProfile');
  }
};