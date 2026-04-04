export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  image?: string;
  category: EventCategory;
  speaker?: string;
  registrationRequired: boolean;
  attendees?: number;
  maxAttendees?: number;
}

export type EventCategory =
  | 'service'
  | 'prayer'
  | 'youth'
  | 'worship'
  | 'seminar'
  | 'charity'
  | 'fellowship'
  | 'kids';

export interface HomeGroup {
  id: string;
  name: string;
  leader: string;
  leaderPhoto?: string;
  description: string;
  district: string;
  address: string;
  day: string;
  time: string;
  membersCount: number;
  maxMembers: number;
  image?: string;
}

export interface Person {
  id: string;
  name: string;
  role: string | { ua: string; ru: string; en: string };
  photo?: string;
  description?: string | { ua: string; ru: string; en: string };
  phone?: string;
  telegram?: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  day: DayOfWeek;
  time: string;
  endTime?: string;
  type: ScheduleType;
  location: string;
  recurring: boolean;
  description?: string;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type ScheduleType = 'service' | 'prayer' | 'youth' | 'kids' | 'study' | 'worship' | 'other';

export interface ScriptureQuote {
  text: string;
  reference: string;
}

export interface DonationGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Donation {
  id: string;
  amount: number;
  goalId: string;
  date: string;
}
