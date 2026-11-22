import { registerPlugin } from '@capacitor/core';

export interface AppInfo {
  packageName: string;
  name: string;
  iconBase64: string | null;
}

export interface UsageStatEntry {
  packageName: string;
  appName: string;
  totalTimeMs: number;
  lastTimeUsed: number;
}

export interface DailyUsageSummary {
  date: string;
  totalMs: number;
  perApp: UsageStatEntry[];
}

export interface FocusSessionConfig {
  durationMin: number;
  restrictedPackages: string[];
  goal: string;
}

export interface ActiveSessionInfo {
  id: string;
  startedAt: number;
  durationMin: number;
  remainingMs: number;
  restrictedPackages: string[];
  paused: boolean;
}

export interface UsageTrackerPlugin {
  hasUsageAccess(): Promise<{ granted: boolean }>;
  openUsageAccessSettings(): Promise<void>;
  getDailyUsage(date: string): Promise<DailyUsageSummary>;
  getWeeklyUsage(): Promise<{ weekly: DailyUsageSummary[] }>;
  getInstalledApps(): Promise<{ apps: AppInfo[] }>;
}

export interface AppSelectorPlugin {
  getLaunchableApps(): Promise<{ apps: AppInfo[] }>;
  getSelectedApps(): Promise<{ packages: string[] }>;
  setSelectedApps(packages: string[]): Promise<void>;
}

export interface FocusLockPlugin {
  hasAccessibilityPermission(): Promise<{ granted: boolean }>;
  openAccessibilitySettings(): Promise<void>;
  startSession(config: FocusSessionConfig): Promise<{ session: ActiveSessionInfo }>;
  stopSession(): Promise<void>;
  pauseSession(): Promise<void>;
  resumeSession(): Promise<void>;
  getActiveSession(): Promise<{ session: ActiveSessionInfo | null }>;
  isAppRestricted(packageName: string): Promise<{ restricted: boolean }>;
}

export const UsageTracker = registerPlugin<UsageTrackerPlugin>('UsageTracker');
export const AppSelector = registerPlugin<AppSelectorPlugin>('AppSelector');
export const FocusLockNative = registerPlugin<FocusLockPlugin>('FocusLockNative');
