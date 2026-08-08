import { User } from '../types';
import { USER_AVATAR } from '../data/mockData';

const USERS_STORAGE_KEY = 'packpal_registered_users';
const CURRENT_USER_STORAGE_KEY = 'packpal_active_user';

export const DEFAULT_DEMO_USER: User = {
  id: 'user-demo-alex',
  name: 'Alex Vance',
  identifier: 'alex.vance@packpal.app',
  identifierType: 'email',
  password: 'password123',
  avatar: USER_AVATAR,
  joinedYear: '2024',
  preferredUnits: 'metric',
  notifications: true,
};

// Normalize identifier for comparison (e.g., lowercasing email or cleaning mobile number)
export function normalizeIdentifier(input: string): string {
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  // For mobile number, strip spaces, dashes, and parens
  return trimmed.replace(/[\s\-\(\)]/g, '');
}

export function detectIdentifierType(input: string): 'email' | 'mobile' {
  return input.includes('@') ? 'email' : 'mobile';
}

// Get all stored users
export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEFAULT_DEMO_USER];
    }
    return parsed;
  } catch (e) {
    return [DEFAULT_DEMO_USER];
  }
}

// Get currently logged-in user
export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (!raw) {
      // Default initial login session to Alex Vance for instant usability
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_USER));
      return DEFAULT_DEMO_USER;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_DEMO_USER;
  }
}

// Set active user session
export function setCurrentUserSession(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set current user session', e);
  }
}

// Save updated user list
export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

// Register a new user
export function registerUser(data: {
  name: string;
  identifier: string;
  password: string;
}): { success: boolean; message?: string; errorType?: 'EXISTS' | 'INVALID'; user?: User } {
  const cleanId = normalizeIdentifier(data.identifier);
  if (!cleanId) {
    return { success: false, message: 'Please enter a valid email or mobile number.', errorType: 'INVALID' };
  }
  if (!data.password || data.password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters long.', errorType: 'INVALID' };
  }

  const users = getStoredUsers();
  const existing = users.find((u) => normalizeIdentifier(u.identifier) === cleanId);

  if (existing) {
    const typeLabel = detectIdentifierType(data.identifier) === 'email' ? 'email address' : 'mobile number';
    return {
      success: false,
      errorType: 'EXISTS',
      message: `An account with this ${typeLabel} already exists. Please sign in instead.`,
    };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name.trim() || 'Traveler',
    identifier: data.identifier.trim(),
    identifierType: detectIdentifierType(data.identifier),
    password: data.password,
    avatar: undefined,
    joinedYear: new Date().getFullYear().toString(),
    preferredUnits: 'metric',
    notifications: true,
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);
  setCurrentUserSession(newUser);

  return { success: true, user: newUser };
}

// Authenticate existing user
export function authenticateUser(data: {
  identifier: string;
  password: string;
}): { success: boolean; message?: string; errorType?: 'NOT_FOUND' | 'WRONG_PASSWORD' | 'INVALID'; user?: User } {
  const cleanId = normalizeIdentifier(data.identifier);
  if (!cleanId) {
    return { success: false, message: 'Please enter your registered email or mobile number.', errorType: 'INVALID' };
  }

  const users = getStoredUsers();
  const foundUser = users.find((u) => normalizeIdentifier(u.identifier) === cleanId);

  if (!foundUser) {
    return {
      success: false,
      errorType: 'NOT_FOUND',
      message: 'No account found with this email or mobile number. Please check your credentials or Sign Up for a new account.',
    };
  }

  if (foundUser.password !== data.password) {
    return {
      success: false,
      errorType: 'WRONG_PASSWORD',
      message: 'Incorrect password. Please verify your password and try again.',
    };
  }

  setCurrentUserSession(foundUser);
  return { success: true, user: foundUser };
}

// Update current user details
export function updateUserData(updatedUser: User): void {
  const users = getStoredUsers();
  const newUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
  saveStoredUsers(newUsers);
  setCurrentUserSession(updatedUser);
}
