export interface UserProgress {
  totalExercises: number;
  completedExercises: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: 'student' | 'instructor' | 'admin';
  avatar: string | null;
  progress: UserProgress;
  preferences: {
    language: string;
    theme: string;
  };
  completionRate: number;
  lastLoginAt: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
