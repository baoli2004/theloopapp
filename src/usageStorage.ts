import type { UsageRecord } from '@/types';

const STORAGE_KEY = 'theloop_usage_records';

export function loadRecords(): UsageRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as UsageRecord[];
  } catch {
    return [];
  }
}

export function saveRecords(records: UsageRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage may be full or unavailable
  }
}

export function upsertRecord(records: UsageRecord[], record: UsageRecord): UsageRecord[] {
  const idx = records.findIndex((r) => r.date === record.date);
  if (idx >= 0) {
    const updated = [...records];
    updated[idx] = record;
    return updated;
  }
  return [...records, record];
}

export function deleteRecord(records: UsageRecord[], date: string): UsageRecord[] {
  return records.filter((r) => r.date !== date);
}

export function getRecordByDate(records: UsageRecord[], date: string): UsageRecord | null {
  return records.find((r) => r.date === date) ?? null;
}

export function getPreviousDayRecord(records: UsageRecord[], date: string): UsageRecord | null {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  const prevDate = formatDateKey(d);
  return getRecordByDate(records, prevDate);
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return formatDateKey(new Date());
}

export function getLast7Days(records: UsageRecord[]): { date: string; total: number | null }[] {
  const result: { date: string; total: number | null }[] = [];
  const today = new Date(todayKey() + 'T00:00:00');
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const rec = getRecordByDate(records, dateStr);
    result.push({ date: dateStr, total: rec ? rec.totalMinutes : null });
  }
  return result;
}

export function formatDateDisplay(dateStr: string, lang: 'en' | 'vi'): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (lang === 'vi') {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateLong(dateStr: string, lang: 'en' | 'vi'): string {
  const d = new Date(dateStr + 'T00:00:00');
  if (lang === 'vi') {
    return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
