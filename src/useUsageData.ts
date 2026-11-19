import { useState, useEffect, useCallback } from 'react';
import type { UsageRecord } from '@/types';
import { loadRecords, getRecordByDate, todayKey } from '@/usageStorage';

export function useUsageData() {
  const [records, setRecordsState] = useState<UsageRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setRecordsState(loadRecords());
    setLoaded(true);

    const handler = () => {
      setRecordsState(loadRecords());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const refresh = useCallback(() => {
    setRecordsState(loadRecords());
  }, []);

  const todayRecord = loaded ? getRecordByDate(records, todayKey()) : null;
  const todayUsageMin = todayRecord ? todayRecord.totalMinutes : 0;
  const hasTodayData = !!todayRecord;

  return { records, todayUsageMin, hasTodayData, todayRecord, loaded, refresh };
}
