import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Info, Save, AlertCircle } from 'lucide-react';
import { useLang } from '@/lang';
import { useApp } from '@/store';
import { DEFAULT_APPS, type AppUsageEntry, type UsageRecord } from '@/types';
import { upsertRecord, getRecordByDate, todayKey, formatDateKey } from '@/usageStorage';

interface Props {
  records: UsageRecord[];
  setRecords: (r: UsageRecord[]) => void;
  onSaved: (record: UsageRecord) => void;
  editDate?: string | null;
}

export default function UsageEntry({ records, setRecords, onSaved, editDate }: Props) {
  const { t } = useLang();
  const { pushToast } = useApp();

  const [date, setDate] = useState(editDate ?? todayKey());
  const [apps, setApps] = useState<AppUsageEntry[]>(
    DEFAULT_APPS.map((name) => ({ appName: name, minutes: 0 }))
  );
  const [customAppName, setCustomAppName] = useState('');
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [error, setError] = useState('');
  const [loadedExisting, setLoadedExisting] = useState(false);

  function handleDateChange(newDate: string) {
    setDate(newDate);
    const existing = getRecordByDate(records, newDate);
    if (existing) {
      setApps(existing.apps.map((a) => ({ ...a })));
      setLoadedExisting(true);
    } else {
      setApps(DEFAULT_APPS.map((name) => ({ appName: name, minutes: 0 })));
      setLoadedExisting(false);
    }
    setError('');
  }

  function updateMinutes(idx: number, raw: string) {
    const val = raw === '' ? 0 : parseInt(raw, 10);
    if (isNaN(val) || val < 0) {
      setError(t.insInvalidInput);
      return;
    }
    setError('');
    setApps((prev) => prev.map((a, i) => (i === idx ? { ...a, minutes: val } : a)));
  }

  function updateAppName(idx: number, name: string) {
    setApps((prev) => prev.map((a, i) => (i === idx ? { ...a, appName: name } : a)));
  }

  function removeApp(idx: number) {
    setApps((prev) => prev.filter((_, i) => i !== idx));
  }

  function addCustomApp() {
    const name = customAppName.trim();
    if (!name) return;
    if (apps.some((a) => a.appName.toLowerCase() === name.toLowerCase())) {
      setCustomAppName('');
      return;
    }
    setApps((prev) => [...prev, { appName: name, minutes: 0 }]);
    setCustomAppName('');
  }

  function validate(): { valid: boolean; total: number } {
    setError('');
    for (const a of apps) {
      if (a.minutes < 0 || !Number.isInteger(a.minutes)) {
        setError(t.insInvalidInput);
        return { valid: false, total: 0 };
      }
    }
    const hasData = apps.some((a) => a.minutes > 0);
    if (!hasData) {
      setError(t.insNoAppsEntered);
      return { valid: false, total: 0 };
    }
    const total = apps.reduce((sum, a) => sum + a.minutes, 0);
    return { valid: true, total };
  }

  function doSave() {
    const { valid, total } = validate();
    if (!valid) return;

    const existing = getRecordByDate(records, date);
    if (existing && !showOverwrite) {
      setShowOverwrite(true);
      return;
    }

    const record: UsageRecord = {
      date,
      apps: apps.filter((a) => a.appName.trim() !== ''),
      totalMinutes: total,
      dailyGoalMin: existing?.dailyGoalMin ?? null,
      goalDiffMin: existing?.dailyGoalMin != null ? total - existing.dailyGoalMin : null,
      reflectionReasons: existing?.reflectionReasons ?? [],
      reflectionText: existing?.reflectionText ?? '',
      nextDayIntention: existing?.nextDayIntention ?? '',
      updatedAt: Date.now(),
      isSample: false,
    };

    const updated = upsertRecord(records, record);
    setRecords(updated);
    setShowOverwrite(false);
    pushToast({ text: t.insSaved, variant: 'success' });
    onSaved(record);
  }

  const existingRecord = getRecordByDate(records, date);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#22d3ee]/15 flex items-center justify-center">
            <Save className="w-4 h-4 text-[#22d3ee]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.insEntryTitle}</h3>
            <p className="text-xs text-[#5c6680] mt-0.5">{t.insEntrySubtitle}</p>
          </div>
        </div>

        {/* Date selector */}
        <div className="mb-4">
          <label className="text-xs text-[#9aa4bd] flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" />
            {t.insSelectDate}
          </label>
          <input
            type="date"
            value={date}
            max={todayKey()}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] focus:border-[#22d3ee]/50 focus:outline-none transition-colors"
          />
          {existingRecord && (
            <p className="text-[11px] text-[#fbbf24] mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {t.insOverwriteTitle}
            </p>
          )}
        </div>

        {/* App usage inputs */}
        <div className="space-y-2.5">
          {apps.map((app, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <input
                type="text"
                value={app.appName}
                onChange={(e) => updateAppName(idx, e.target.value)}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] focus:border-[#22d3ee]/40 focus:outline-none transition-colors"
                placeholder={t.insAppName}
              />
              <div className="relative w-28 flex-shrink-0">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={app.minutes || ''}
                  onChange={(e) => updateMinutes(idx, e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-right text-[#f1f4fb] focus:border-[#22d3ee]/40 focus:outline-none transition-colors"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#5c6680]">{t.insMinShort}</span>
              </div>
              {idx >= DEFAULT_APPS.length && (
                <button
                  onClick={() => removeApp(idx)}
                  className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[#5c6680] hover:text-[#fb7185] hover:bg-[#fb7185]/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add custom app */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            value={customAppName}
            onChange={(e) => setCustomAppName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomApp())}
            placeholder={t.insAddAppNamePlaceholder}
            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:border-[#22d3ee]/40 focus:outline-none transition-colors"
          />
          <button
            onClick={addCustomApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#232a3d]/60 text-[#9aa4bd] text-xs font-medium hover:bg-[#232a3d] hover:text-[#f1f4fb] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.insAddApp}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#fb7185]/10 border border-[#fb7185]/20">
            <AlertCircle className="w-4 h-4 text-[#fb7185] flex-shrink-0" />
            <p className="text-xs text-[#fb7185]">{error}</p>
          </div>
        )}

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={doSave}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-sm font-semibold hover:bg-[#4ade80]/15 transition-colors"
        >
          <Save className="w-4 h-4" />
          {t.insSaveData}
        </motion.button>

        {/* Overwrite confirmation */}
        {showOverwrite && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 rounded-xl bg-[#fbbf24]/8 border border-[#fbbf24]/25"
          >
            <p className="text-sm font-medium text-[#fbbf24] mb-1">{t.insOverwriteTitle}</p>
            <p className="text-xs text-[#9aa4bd] mb-3">{t.insOverwriteBody}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowOverwrite(false)}
                className="flex-1 px-3 py-2 rounded-lg bg-[#232a3d]/60 text-[#9aa4bd] text-xs font-medium hover:bg-[#232a3d] transition-colors"
              >
                {t.insCancel}
              </button>
              <button
                onClick={doSave}
                className="flex-1 px-3 py-2 rounded-lg bg-[#fbbf24]/15 text-[#fbbf24] text-xs font-semibold hover:bg-[#fbbf24]/20 transition-colors"
              >
                {t.insConfirm}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Data source info */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#5c6680] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-[#9aa4bd] mb-1">{t.insDataSource}</p>
            <p className="text-xs text-[#5c6680] leading-relaxed">{t.insDataSourceText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
