import type {
  ActiveFocusSession,
  FocusAppId,
  FocusIntervention,
  FocusReason,
  FocusSessionRecord,
} from '@/types';

const MINUTE_MS = 60_000;

export interface NewFocusInput {
  apps: FocusAppId[];
  plannedMin: number;
  goal: string;
}

export interface FocusStats {
  total: number;
  completed: number;
  cancelled: number;
  completionRate: number | null;
  totalFocusMs: number;
}

export function createActiveSession(input: NewFocusInput, now: number): ActiveFocusSession {
  return {
    id: `f${now}`,
    goal: input.goal,
    plannedMin: input.plannedMin,
    apps: input.apps,
    startedAt: now,
    pausedAt: null,
    pausedTotalMs: 0,
    interventions: [],
  };
}

export function elapsedActiveMs(session: ActiveFocusSession, now: number): number {
  const end = session.pausedAt ?? now;
  return Math.max(0, end - session.startedAt - session.pausedTotalMs);
}

export function plannedMs(session: ActiveFocusSession): number {
  return session.plannedMin * MINUTE_MS;
}

export function remainingMs(session: ActiveFocusSession, now: number): number {
  return Math.max(0, plannedMs(session) - elapsedActiveMs(session, now));
}

export function scheduledEndAt(session: ActiveFocusSession): number {
  return session.startedAt + session.pausedTotalMs + plannedMs(session);
}

export function buildFocusRecord(
  session: ActiveFocusSession,
  status: 'completed' | 'cancelled',
  endedAt: number,
  cancelReason: FocusReason | null,
  interventions: FocusIntervention[],
): FocusSessionRecord {
  const actualMs = status === 'completed'
    ? plannedMs(session)
    : Math.min(elapsedActiveMs(session, endedAt), plannedMs(session));
  return {
    id: session.id,
    goal: session.goal,
    plannedMin: session.plannedMin,
    apps: session.apps,
    startedAt: session.startedAt,
    endedAt,
    actualMs,
    status,
    cancelReason,
    interventions,
    feeling: null,
  };
}

export function computeFocusStats(records: FocusSessionRecord[]): FocusStats {
  let completed = 0;
  let cancelled = 0;
  let totalFocusMs = 0;
  for (const r of records) {
    if (r.status === 'completed') completed++;
    else cancelled++;
    totalFocusMs += r.actualMs;
  }
  const total = records.length;
  return {
    total,
    completed,
    cancelled,
    completionRate: total === 0 ? null : Math.round((completed / total) * 100),
    totalFocusMs,
  };
}

export function formatClock(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatFocusTotal(ms: number): string {
  const totalMin = Math.round(ms / MINUTE_MS);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function parseCustomMinutes(text: string, max: number): number | null {
  if (!/^\d+$/.test(text.trim())) return null;
  const n = Number(text.trim());
  return n >= 1 && n <= max ? n : null;
}
