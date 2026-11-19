import type { ActiveFocusSession, FocusSessionRecord } from '@/types';

const HISTORY_KEY = 'theloop_focus_sessions';
const ACTIVE_KEY = 'theloop_focus_active';

const STATUSES = ['completed', 'cancelled'];

function isRecord(x: unknown): x is FocusSessionRecord {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Partial<FocusSessionRecord>;
  return typeof r.id === 'string' && typeof r.startedAt === 'number' && typeof r.actualMs === 'number'
    && typeof r.status === 'string' && STATUSES.includes(r.status) && Array.isArray(r.apps);
}

function isActive(x: unknown): x is ActiveFocusSession {
  if (typeof x !== 'object' || x === null) return false;
  const s = x as Partial<ActiveFocusSession>;
  return typeof s.id === 'string' && typeof s.startedAt === 'number' && typeof s.plannedMin === 'number'
    && Array.isArray(s.apps) && typeof s.pausedTotalMs === 'number' && Array.isArray(s.interventions);
}

export function loadFocusHistory(): FocusSessionRecord[] {
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('Focus history is malformed');
  return parsed.filter(isRecord);
}

function writeHistory(records: FocusSessionRecord[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

export function appendFocusRecord(record: FocusSessionRecord): FocusSessionRecord[] {
  const next = [record, ...loadFocusHistory().filter((r) => r.id !== record.id)];
  writeHistory(next);
  return next;
}

export function setFocusFeeling(id: string, feeling: FocusSessionRecord['feeling']): FocusSessionRecord[] {
  const next = loadFocusHistory().map((r) => (r.id === id ? { ...r, feeling } : r));
  writeHistory(next);
  return next;
}

export function loadActiveFocus(): ActiveFocusSession | null {
  const raw = localStorage.getItem(ACTIVE_KEY);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  return isActive(parsed) ? parsed : null;
}

export function saveActiveFocus(session: ActiveFocusSession): void {
  localStorage.setItem(ACTIVE_KEY, JSON.stringify(session));
}

export function clearActiveFocus(): void {
  localStorage.removeItem(ACTIVE_KEY);
}
