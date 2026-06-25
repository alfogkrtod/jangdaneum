export type EventType = 'fixed' | 'flexible' | 'optimized';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  description?: string;
  category?: string;
}

export type MoodType = 'peace' | 'energy' | 'focus' | 'rest' | 'cloudy';

export interface DiaryEntry {
  id: string;
  date: string;
  text: string;
  mood: MoodType;
  photoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  motto: string;
  avatar: string;
  streak: number;
  avgFlowTime: number;
  isPremium: boolean;
  googleSynced: boolean;
  appleSynced: boolean;
  language?: 'ko' | 'en' | 'ja';
  theme?: 'organic' | 'dark' | 'warm';
}

export type RebalanceProposal = 'balanced' | 'sprint' | 'recovery';
