import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Calendar, TrendingUp, TrendingDown, Minus, Target, Trash2, AlertCircle, Plus } from 'lucide-react';
import { useLang } from '@/lang';
import { useApp } from '@/store';
import type { UsageRecord } from '@/types';
import {
  getRecordByDate,
  getPreviousDayRecord,
  getLast7Days,
  formatDateDisplay,
  formatDateLong,
  todayKey,
  formatDateKey,
} from '@/usageStorage';

interface Props {
  records: UsageRecord[];
  setRecords: (r: UsageRecord[]) => void;
  onEnterData: (date: string) => void;
}

export default function InsightsDashboard({ records, setRecords, onEnterData }: Props) {
  const { t, lang } = useLang();
  const { pushToast } = useApp();
  const [selectedDate, setSelectedDate] = useState(todayKey());

  const record = getRecordByDate(records, selectedDate);
  const prevRecord = getPreviousDayRecord(records, selectedDate);
  const weekData = getLast7Days(records);
  const maxWeekly = Math.max(...weekData.map((d) => d.total ?? 0), 1);

  const diff = prevRecord && record ? record.totalMinutes - prevRecord.totalMinutes : null;
  const goalDiff = record?.dailyGoalMin != null && record ? record.totalMinutes - record.dailyGoalMin : null;

  function handleDelete() {
    if (!record) return;
    if (window.confirm(t.insDeleteConfirm)) {
      const updated = records.filter((r) => r.date !== record.date);
      setRecords(updated);
      pushToast({ text: t.insSaved, variant: 'info' });
    }
  }

  function handleSetGoal() {
    const input = window.prompt(t.insSetGoal, record?.dailyGoalMin?.toString() ?? '60');
    if (input === null) return;
    const val = parseInt(input, 10);
    if (isNaN(val) || val < 0) {
      pushToast({ text: t.insInvalidInput, variant: 'warn' });
      return;
    }
    if (!record) return;
    const updated: UsageRecord = {
      ...record,
      dailyGoalMin: val,
      goalDiffMin: record.totalMinutes - val,
      updatedAt: Date.now(),
    };
    const newRecords = records.map((r) => (r.date === record.date ? updated : r));
    setRecords(newRecords);
    pushToast({ text: t.insSaved, variant: 'success' });
  }

  const hasRecord = !!record;

  return (
    <div className="space-y-4">
      {/* Date selector + total */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#C084FC]/15 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#C084FC]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t.insDashboardTitle}</h3>
              <p className="text-xs text-[#6B6B7B] mt-0.5">{formatDateLong(selectedDate, lang)}</p>
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            max={todayKey()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#101016] border border-[#1E1E28] text-xs text-[#F8F7FC] focus:border-[#C084FC]/40 focus:outline-none transition-colors"
          />
        </div>

        {hasRecord ? (
          <>
            {/* Total + comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-[#101016]/60 p-4">
                <p className="text-[10px] uppercase tracking-wide text-[#6B6B7B] mb-1.5">{t.insTotalToday}</p>
                <p className="text-2xl font-bold font-display text-[#F8F7FC]">{record!.totalMinutes}<span className="text-sm text-[#6B6B7B] ml-1">{t.insMinShort}</span></p>
              </div>
              <div className="rounded-xl bg-[#101016]/60 p-4">
                <p className="text-[10px] uppercase tracking-wide text-[#6B6B7B] mb-1.5">{t.insVsYesterday}</p>
                {diff === null ? (
                  <p className="text-sm text-[#6B6B7B] flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {t.insNoPrevData}
                  </p>
                ) : diff === 0 ? (
                  <p className="text-sm text-[#A1A1AA] flex items-center gap-1.5 mt-2">
                    <Minus className="w-4 h-4" />
                    {t.insSameAs}
                  </p>
                ) : diff > 0 ? (
                  <p className="text-sm font-semibold text-[#A855F7] flex items-center gap-1.5 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    {t.insMoreThan(diff)}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-[#A855F7] flex items-center gap-1.5 mt-1">
                    <TrendingDown className="w-4 h-4" />
                    {t.insLessThan(Math.abs(diff))}
                  </p>
                )}
              </div>
            </div>

            {/* Goal tracking */}
            <div className="rounded-xl bg-[#101016]/60 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#A855F7]" />
                  {t.insDailyGoal}
                </span>
                <button onClick={handleSetGoal} className="text-[11px] text-[#C084FC] hover:underline">
                  {t.insSetGoal}
                </button>
              </div>
              {record!.dailyGoalMin != null ? (
                <>
                  <p className={`text-sm font-semibold ${goalDiff! <= 0 ? 'text-[#A855F7]' : 'text-[#C084FC]'}`}>
                    {goalDiff === 0
                      ? t.insGoalMet
                      : goalDiff! > 0
                      ? t.insGoalAbove(goalDiff!)
                      : t.insGoalBelow(Math.abs(goalDiff!))}
                  </p>
                  <div className="h-2 rounded-full bg-[#1E1E28] overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (record!.totalMinutes / record!.dailyGoalMin) * 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-full rounded-full ${goalDiff! <= 0 ? 'bg-gradient-to-r from-[#A855F7] to-[#A855F7]/70' : 'bg-gradient-to-r from-[#C084FC] to-[#C084FC]/70'}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#6B6B7B] mt-1.5">
                    <span>{record!.totalMinutes}{t.insMinShort}</span>
                    <span>{record!.dailyGoalMin}{t.insMinShort}</span>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleSetGoal}
                  className="text-xs text-[#A1A1AA] hover:text-[#C084FC] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  {t.insSetGoal}
                </button>
              )}
            </div>

            {/* App breakdown bar chart */}
            <div className="mb-4">
              <p className="text-xs text-[#A1A1AA] mb-3">{t.insAppBreakdown}</p>
              <div className="space-y-2.5">
                {record!.apps.filter((a) => a.minutes > 0).map((app, i) => {
                  const pct = (app.minutes / record!.totalMinutes) * 100;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#F8F7FC]">{app.appName}</span>
                        <span className="text-xs text-[#6B6B7B]">{app.minutes}{t.insMinShort}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#1E1E28] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-[#C084FC] to-[#C084FC]/60"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#1E1E28]/60">
              <button
                onClick={() => onEnterData(selectedDate)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#A1A1AA] hover:text-[#F8F7FC] hover:bg-[#1E1E28]/50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.insEditData}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#6B6B7B] hover:text-[#A855F7] hover:bg-[#A855F7]/10 transition-colors ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.insDeleteRecord}
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-[#1E1E28]/40 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-[#6B6B7B]" />
            </div>
            <p className="text-sm font-medium text-[#A1A1AA] mb-1">{t.insNoData}</p>
            <p className="text-xs text-[#6B6B7B] mb-4">{t.insNoDataDesc}</p>
            <button
              onClick={() => onEnterData(selectedDate)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C084FC]/10 border border-[#C084FC]/20 text-[#C084FC] text-sm font-medium hover:bg-[#C084FC]/15 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.insEnterData}
            </button>
          </div>
        )}
      </motion.div>

      {/* Weekly summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#C084FC]" />
          <h3 className="font-semibold text-sm">{t.insWeeklySummary}</h3>
        </div>
        <div className="flex items-end justify-between gap-2 h-36">
          {weekData.map((d, i) => {
            const hasData = d.total !== null;
            const heightPct = hasData ? (d.total! / maxWeekly) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex justify-center h-full items-end">
                  {hasData ? (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 120 }}
                      className="w-4 rounded-t bg-gradient-to-t from-[#C084FC]/30 to-[#C084FC] relative group cursor-pointer"
                      onClick={() => setSelectedDate(d.date)}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-[#A1A1AA] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.total}{t.insMinShort}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="w-4 h-full flex items-end">
                      <div className="w-full border-t-2 border-dashed border-[#1E1E28] rounded-t" />
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-[#6B6B7B]">{formatDateDisplay(d.date, lang)}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-[#6B6B7B] mt-3 text-center">
          {records.filter((r) => !r.isSample).length} {lang === 'vi' ? 'ngày có dữ liệu' : 'days with data'}
        </p>
      </motion.div>

      {/* Daily history list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#C084FC]" />
          <h3 className="font-semibold text-sm">{t.insDailyHistory}</h3>
        </div>
        {records.length === 0 ? (
          <p className="text-sm text-[#6B6B7B] py-6 text-center">{t.insNoData}</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
            {[...records]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((r, i) => (
                <button
                  key={r.date}
                  onClick={() => setSelectedDate(r.date)}
                  className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors text-left ${
                    r.date === selectedDate ? 'bg-[#C084FC]/10 border border-[#C084FC]/20' : 'bg-[#101016]/60 hover:bg-[#15151D]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-[#A1A1AA]">{formatDateDisplay(r.date, lang)}</span>
                    {r.isSample && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C084FC]/15 text-[#C084FC]">
                        {t.insSampleData}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-[#F8F7FC]">{r.totalMinutes}{t.insMinShort}</span>
                </button>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
