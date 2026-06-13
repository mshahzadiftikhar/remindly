export type ReminderCategory =
  | 'document'
  | 'subscription'
  | 'warranty'
  | 'insurance'
  | 'custom';

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  category: ReminderCategory;
  expiryDate: string;
  remindDaysBefore: number[];
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  notificationEmail: string | null;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
