export type FocusState = 'mindful' | 'in_loop';

export type BuddyStatus = 'off_screen' | 'focused' | 'needs_nudge' | 'scrolling';

export interface Buddy {
  id: string;
  name: string;
  avatarColor: string;
  status: BuddyStatus;
  todayFocusMin: number;
  streak: number;
}

export interface SessionLog {
  id: string;
  timestamp: number;
  outcome: 'break' | 'continue';
  reason?: 'Curious' | 'Bored' | 'Habit';
  isSample?: boolean;
}

export interface ToastMsg {
  id: string;
  text: string;
  variant: 'success' | 'info' | 'warn';
}

export interface PeerNudge {
  id: string;
  buddyId: string;
  buddyName: string;
  sentAt: number;
}

// ── Usage Insights types ──

export interface AppUsageEntry {
  appName: string;
  minutes: number;
}

export type ReflectionReason =
  | 'bored'
  | 'stressed'
  | 'fomo'
  | 'habit'
  | 'connect'
  | 'other';

export interface UsageRecord {
  date: string; // YYYY-MM-DD
  apps: AppUsageEntry[];
  totalMinutes: number;
  dailyGoalMin: number | null;
  goalDiffMin: number | null; // positive = over goal
  reflectionReasons: ReflectionReason[];
  reflectionText: string;
  nextDayIntention: string;
  updatedAt: number;
  isSample?: boolean;
}

export const REFLECTION_REASONS: ReflectionReason[] = [
  'bored',
  'stressed',
  'fomo',
  'habit',
  'connect',
  'other',
];

export const DEFAULT_APPS = ['TikTok', 'Facebook', 'YouTube', 'Instagram', 'Other Apps'];

// ── THE LOOP MIRROR types ──

export type MirrorReason = 'bored' | 'stressed' | 'fomo' | 'habit' | 'connect' | 'other';
export type MirrorChoice = 'return' | 'break' | 'continue';
export type FollowUpStatus = 'completed' | 'partial' | 'not_completed' | 'pending';
export type FollowUpIntervalMin = 5 | 10 | 15 | 30;

export interface MirrorRecord {
  id: string;
  timestamp: number;
  reason: MirrorReason;
  choice: MirrorChoice;
  isSample?: boolean;
  followUp?: {
    intervalMin: FollowUpIntervalMin;
    dueAt: number;
    status: FollowUpStatus;
    note?: string;
    reportedAt?: number;
  };
}

export const MIRROR_REASONS: MirrorReason[] = ['bored', 'stressed', 'fomo', 'habit', 'connect', 'other'];

export const FOLLOWUP_INTERVALS: FollowUpIntervalMin[] = [5, 10, 15, 30];

// ── FOCUS LOCK types ──

export type FocusAppId = 'tiktok' | 'facebook' | 'instagram' | 'youtube' | 'other';
export type FocusReason = 'boredom' | 'stress' | 'curiosity' | 'fomo' | 'urgent' | 'other';
export type FocusDecision = 'continue' | 'break' | 'end';
export type FocusFeeling = 'great' | 'good' | 'neutral' | 'hard';

export interface FocusIntervention {
  at: number;
  reason: FocusReason;
  decision: FocusDecision;
}

export interface ActiveFocusSession {
  id: string;
  goal: string;
  plannedMin: number;
  apps: FocusAppId[];
  startedAt: number;
  pausedAt: number | null;
  pausedTotalMs: number;
  interventions: FocusIntervention[];
}

export interface FocusSessionRecord {
  id: string;
  goal: string;
  plannedMin: number;
  apps: FocusAppId[];
  startedAt: number;
  endedAt: number;
  actualMs: number;
  status: 'completed' | 'cancelled';
  cancelReason: FocusReason | null;
  interventions: FocusIntervention[];
  feeling: FocusFeeling | null;
}

export const FOCUS_APPS: FocusAppId[] = ['tiktok', 'facebook', 'instagram', 'youtube', 'other'];
export const FOCUS_REASONS: FocusReason[] = ['boredom', 'stress', 'curiosity', 'fomo', 'urgent', 'other'];
export const FOCUS_PRESET_MINUTES: number[] = [5, 10, 15, 25, 30, 45];
export const FOCUS_CUSTOM_MAX_MIN = 180;
export const FOCUS_GOAL_MAX_LEN = 120;
export const FOCUS_FEELINGS: FocusFeeling[] = ['great', 'good', 'neutral', 'hard'];

export const SAMPLE_MIRROR_RECORDS: MirrorRecord[] = [
  { id: 'sample-m1', timestamp: Date.now() - 3600_000 * 6, reason: 'bored', choice: 'continue', isSample: true },
  { id: 'sample-m2', timestamp: Date.now() - 3600_000 * 4, reason: 'habit', choice: 'break', isSample: true },
  { id: 'sample-m3', timestamp: Date.now() - 3600_000 * 2, reason: 'stressed', choice: 'return', isSample: true },
];
