import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useLang } from '@/lang';
import type { Buddy, SessionLog, ToastMsg, PeerNudge, FocusState } from '@/types';
import {
  computeStats,
  loadFocusState,
  loadSessionLogs,
  saveFocusState,
  saveSessionLogs,
  type RealStats,
} from '@/stats';

interface DailyGoal {
  screenTimeLimit: number;
  focusSessions: number;
  customGoal: string;
}

const GOAL_KEY = 'theloop_goal';

function loadGoal(): DailyGoal {
  try {
    const raw = localStorage.getItem(GOAL_KEY);
    if (!raw) return { screenTimeLimit: 60, focusSessions: 3, customGoal: '' };
    const parsed = JSON.parse(raw);
    return {
      screenTimeLimit: parsed.screenTimeLimit ?? 60,
      focusSessions: parsed.focusSessions ?? 3,
      customGoal: parsed.customGoal ?? '',
    };
  } catch {
    return { screenTimeLimit: 60, focusSessions: 3, customGoal: '' };
  }
}

interface AppState {
  focusState: FocusState;
  setFocusState: (s: FocusState) => void;
  teamStreak: number;
  focusRate: number;
  sessionLogs: SessionLog[];
  winsToday: number;
  interruptsToday: number;
  completedFocusToday: number;
  totalFocusSessions: number;
  totalCompletedFocus: number;
  usageMin: number;
  buddies: Buddy[];
  toasts: ToastMsg[];
  pushToast: (t: Omit<ToastMsg, 'id'>) => void;
  dismissToast: (id: string) => void;
  logSession: (log: Omit<SessionLog, 'id' | 'timestamp'>) => void;
  nudgePeer: (buddyId: string) => void;
  nudges: PeerNudge[];
  totalScore: number;
  goal: DailyGoal;
  setGoal: (g: DailyGoal) => void;
  refreshStats: () => void;
}

const Ctx = createContext<AppState | null>(null);

const initialBuddies: Buddy[] = [
  { id: 'b1', name: 'Minh', avatarColor: '#22d3ee', status: 'off_screen', todayFocusMin: 142, streak: 4 },
  { id: 'b2', name: 'An', avatarColor: '#fb7185', status: 'needs_nudge', todayFocusMin: 38, streak: 1 },
  { id: 'b3', name: 'Linh', avatarColor: '#4ade80', status: 'focused', todayFocusMin: 95, streak: 6 },
  { id: 'b4', name: 'Khoa', avatarColor: '#fbbf24', status: 'focused', todayFocusMin: 110, streak: 3 },
];

let idc = 0;
const uid = () => `g${++idc}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [focusState, setFocusStateRaw] = useState<FocusState>(() => loadFocusState());
  const [stats, setStats] = useState<RealStats>(() => computeStats());
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>(() => loadSessionLogs());
  const [buddies, setBuddies] = useState<Buddy[]>(initialBuddies);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [nudges, setNudges] = useState<PeerNudge[]>([]);
  const [goal, setGoalState] = useState<DailyGoal>(() => loadGoal());

  const refreshStats = useCallback(() => {
    setStats(computeStats());
    setSessionLogs(loadSessionLogs());
  }, []);

  useEffect(() => {
    const handler = () => refreshStats();
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
    };
  }, [refreshStats]);

  const setFocusState = useCallback((s: FocusState) => {
    setFocusStateRaw(s);
    saveFocusState(s);
  }, []);

  const pushToast = useCallback((t: Omit<ToastMsg, 'id'>) => {
    const id = uid();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3400);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const logSession = useCallback((log: Omit<SessionLog, 'id' | 'timestamp'>) => {
    setSessionLogs((prev) => {
      const updated = [...prev, { ...log, id: uid(), timestamp: Date.now() }];
      saveSessionLogs(updated);
      return updated;
    });
    setStats(computeStats());
  }, []);

  const setGoal = useCallback((g: DailyGoal) => {
    setGoalState(g);
    try { localStorage.setItem(GOAL_KEY, JSON.stringify(g)); } catch { /* ignore */ }
  }, []);

  const nudgePeer = useCallback((buddyId: string) => {
    const b = buddies.find((x) => x.id === buddyId);
    if (!b) return;
    setNudges((prev) => [...prev, { id: uid(), buddyId, buddyName: b.name, sentAt: Date.now() }]);
    setBuddies((prev) =>
      prev.map((x) => (x.id === buddyId ? { ...x, status: 'needs_nudge' as const } : x))
    );
    pushToast({ text: t.toastNudge(b.name), variant: 'info' });
  }, [buddies, pushToast, t]);

  return (
    <Ctx.Provider value={{
      focusState, setFocusState,
      teamStreak: stats.teamStreak,
      focusRate: stats.focusRate,
      totalScore: stats.totalScore,
      winsToday: stats.winsToday,
      interruptsToday: stats.interruptsToday,
      completedFocusToday: stats.completedFocusToday,
      totalFocusSessions: stats.totalFocusSessions,
      totalCompletedFocus: stats.totalCompletedFocus,
      sessionLogs,
      usageMin: stats.usageMinToday,
      buddies, toasts, pushToast, dismissToast, logSession,
      nudgePeer, nudges, goal, setGoal, refreshStats,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
