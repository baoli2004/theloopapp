import type { FocusSessionRecord, MirrorRecord, SessionLog, UsageRecord } from '@/types';
import { loadFocusHistory } from '@/focusStorage';
import { loadMirrorRecords } from '@/mirrorStorage';
import { loadRecords, getRecordByDate, todayKey, formatDateKey } from '@/usageStorage';

const LOGS_KEY = 'theloop_session_logs';
const FOCUS_STATE_KEY = 'theloop_focus_state';

const MINUTE_MS = 60_000;

export interface DailyActivity {
  date: string;
  interrupts: number;
  breaks: number;
  mirrorSessions: number;
  focusSessions: number;
  focusCompleted: number;
  focusMin: number;
  usageMin: number | null;
}

export interface RealStats {
  teamStreak: number;
  focusRate: number;
  totalScore: number;
  winsToday: number;
  interruptsToday: number;
  completedFocusToday: number;
  totalFocusSessions: number;
  totalCompletedFocus: number;
  usageMinToday: number;
  hasTodayUsage: boolean;
}

export function loadSessionLogs(): SessionLog[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessionLogs(logs: SessionLog[]): void {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  } catch {
    // storage unavailable
  }
}

export function loadFocusState(): 'mindful' | 'in_loop' {
  try {
    const raw = localStorage.getItem(FOCUS_STATE_KEY);
    return raw === 'in_loop' ? 'in_loop' : 'mindful';
  } catch {
    return 'mindful';
  }
}

export function saveFocusState(state: 'mindful' | 'in_loop'): void {
  try {
    localStorage.setItem(FOCUS_STATE_KEY, state);
  } catch {
    // storage unavailable
  }
}

function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
}

function dayKeyFromTs(ts: number): string {
  const d = new Date(ts);
  return formatDateKey(d);
}

function countDistinctActiveDays(): number {
  const days = new Set<string>();
  for (const log of loadSessionLogs()) days.add(dayKeyFromTs(log.timestamp));
  for (const r of loadMirrorRecords()) if (!r.isSample) days.add(dayKeyFromTs(r.timestamp));
  for (const f of loadFocusHistory()) days.add(dayKeyFromTs(f.startedAt));
  for (const u of loadRecords()) if (u.totalMinutes > 0) days.add(u.date);
  return days.size;
}

export function computeStreak(): number {
  const days = new Set<string>();
  for (const log of loadSessionLogs()) days.add(dayKeyFromTs(log.timestamp));
  for (const r of loadMirrorRecords()) if (!r.isSample) days.add(dayKeyFromTs(r.timestamp));
  for (const f of loadFocusHistory()) days.add(dayKeyFromTs(f.startedAt));
  for (const u of loadRecords()) if (u.totalMinutes > 0) days.add(u.date);
  if (days.size === 0) return 0;

  let streak = 0;
  const cursor = new Date(todayKey() + 'T00:00:00');
  for (let i = 0; i < 365; i++) {
    const key = formatDateKey(cursor);
    if (days.has(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (i === 0) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function computeStats(): RealStats {
  const logs = loadSessionLogs();
  const mirrors = loadMirrorRecords().filter((r) => !r.isSample);
  const focus = loadFocusHistory();
  const usage = loadRecords();

  const winsToday = logs.filter((l) => l.outcome === 'break' && isToday(l.timestamp)).length;
  const interruptsToday = logs.filter((l) => isToday(l.timestamp)).length;
  const completedFocusToday = focus.filter((f) => f.status === 'completed' && isToday(f.startedAt)).length;
  const totalFocusSessions = focus.length;
  const totalCompletedFocus = focus.filter((f) => f.status === 'completed').length;

  const todayUsage = getRecordByDate(usage, todayKey());
  const usageMinToday = todayUsage ? todayUsage.totalMinutes : 0;
  const hasTodayUsage = !!todayUsage;

  const streak = computeStreak();
  const activeDays = Math.max(1, countDistinctActiveDays());

  const breakCount = logs.filter((l) => l.outcome === 'break').length;
  const focusRate = logs.length === 0
    ? (totalFocusSessions === 0 ? 0 : Math.round((totalCompletedFocus / Math.max(1, totalFocusSessions)) * 100))
    : Math.round((breakCount / logs.length) * 100);

  const distinctMirrorDays = new Set(mirrors.map((m) => dayKeyFromTs(m.timestamp))).size;
  const totalScore = Math.min(100,
    winsToday * 10
    + completedFocusToday * 8
    + streak * 5
    + distinctMirrorDays * 3
    + Math.round(totalCompletedFocus / Math.max(1, activeDays) * 2),
  );

  return {
    teamStreak: streak,
    focusRate,
    totalScore,
    winsToday,
    interruptsToday,
    completedFocusToday,
    totalFocusSessions,
    totalCompletedFocus,
    usageMinToday,
    hasTodayUsage,
  };
}

export function buildDailyActivity(days: number): DailyActivity[] {
  const logs = loadSessionLogs();
  const mirrors = loadMirrorRecords().filter((r) => !r.isSample);
  const focus = loadFocusHistory();
  const usage = loadRecords();

  const result: DailyActivity[] = [];
  const today = new Date(todayKey() + 'T00:00:00');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const dayStart = new Date(dateStr + 'T00:00:00').getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;

    const dayLogs = logs.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd);
    const dayFocus = focus.filter((f) => f.startedAt >= dayStart && f.startedAt < dayEnd);
    const dayMirrors = mirrors.filter((m) => m.timestamp >= dayStart && m.timestamp < dayEnd);
    const usageRec = getRecordByDate(usage, dateStr);

    result.push({
      date: dateStr,
      interrupts: dayLogs.length,
      breaks: dayLogs.filter((l) => l.outcome === 'break').length,
      mirrorSessions: dayMirrors.length,
      focusSessions: dayFocus.length,
      focusCompleted: dayFocus.filter((f) => f.status === 'completed').length,
      focusMin: Math.round(dayFocus.reduce((sum, f) => sum + f.actualMs, 0) / MINUTE_MS),
      usageMin: usageRec ? usageRec.totalMinutes : null,
    });
  }
  return result;
}
