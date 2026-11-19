import type { MirrorRecord, FollowUpStatus, FollowUpIntervalMin } from '@/types';
import { SAMPLE_MIRROR_RECORDS } from '@/types';

const STORAGE_KEY = 'theloop_mirror_records';

export function loadMirrorRecords(): MirrorRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as MirrorRecord[];
  } catch {
    return [];
  }
}

export function saveMirrorRecord(record: MirrorRecord): MirrorRecord[] {
  const existing = loadMirrorRecords();
  const updated = [...existing, record];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // storage may be unavailable
  }
  return updated;
}

export function setMirrorRecords(records: MirrorRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage may be unavailable
  }
}

export function updateMirrorFollowUp(
  id: string,
  followUp: { intervalMin: FollowUpIntervalMin; dueAt: number }
): MirrorRecord[] {
  const records = loadMirrorRecords();
  const updated = records.map((r) =>
    r.id === id ? { ...r, followUp: { ...followUp, status: 'pending' as FollowUpStatus } } : r
  );
  setMirrorRecords(updated);
  return updated;
}

export function completeMirrorFollowUp(
  id: string,
  status: FollowUpStatus,
  note?: string
): MirrorRecord[] {
  const records = loadMirrorRecords();
  const updated = records.map((r) =>
    r.id === id && r.followUp
      ? { ...r, followUp: { ...r.followUp, status, note: note?.trim() || undefined, reportedAt: Date.now() } }
      : r
  );
  setMirrorRecords(updated);
  return updated;
}

export function getPendingFollowUps(): MirrorRecord[] {
  const records = loadMirrorRecords();
  const now = Date.now();
  return records.filter(
    (r) => r.followUp && r.followUp.status === 'pending' && r.followUp.dueAt <= now
  );
}

export function clearAllMirrorRecords(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage may be unavailable
  }
}

export function loadSampleMirrorRecords(): MirrorRecord[] {
  const existing = loadMirrorRecords();
  const withoutSamples = existing.filter((r) => !r.isSample);
  const updated = [...withoutSamples, ...SAMPLE_MIRROR_RECORDS];
  setMirrorRecords(updated);
  return updated;
}

export function clearSampleMirrorRecords(): MirrorRecord[] {
  const existing = loadMirrorRecords();
  const withoutSamples = existing.filter((r) => !r.isSample);
  setMirrorRecords(withoutSamples);
  return withoutSamples;
}
