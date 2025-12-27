export type DomainColor =
  | "lime"
  | "blue"
  | "purple"
  | "emerald"
  | "orange"
  | "red"
  | "pink"
  | "cyan"
  | "amber"
  | "indigo";

/**
 * A life area or category that users track (e.g., Career, Learning, Exercise).
 * Represents a single trackable aspect of life that the user wants to monitor and improve.
 */
export interface Domain {
  id: string;
  name: string;
  color: DomainColor;
  emoji: string;
  createdAt: string;
  totalCompletions: number;
  currentStreak: number;
}

/**
 * A daily checkmark indicating the user completed their habit in a specific domain on a specific date.
 * This is the core tracking mechanism—a simple binary "did it" or "didn't do it" record.
 */
export interface Completion {
  id: string;
  domainId: string;
  date: string;
}

/**
 * A weekly target for a domain (e.g., "5 out of 7 days").
 * Optional and can be set, updated, or removed at any time.
 */
export interface Goal {
  id: string;
  domainId: string;
  targetDays: number;
  totalDays: number;
}

/**
 * Tracking data for a domain showing current consecutive weeks hitting the weekly goal,
 * plus the longest streak ever achieved.
 */
export interface Streak {
  id: string;
  domainId: string;
  currentStreak: number;
  longestStreak: number;
}

/**
 * User account information
 */
export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Template domains that users can choose from when getting started
 */
export interface DomainTemplate {
  name: string;
  emoji: string;
  color: DomainColor;
}

/**
 * Form data for creating or editing a domain
 */
export interface DomainFormData {
  name: string;
  emoji: string;
  color: DomainColor;
}
