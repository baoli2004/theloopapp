import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, AlertCircle, X, Clock, Download, History, ChevronRight } from 'lucide-react';
import { useLang } from '@/lang';
import { useApp } from '@/store';
import type { MirrorRecord, MirrorChoice, FollowUpStatus } from '@/types';
import { loadMirrorRecords } from '@/mirrorStorage';
import { exportMirrorCSV } from '@/mirrorExport';

const choiceIcon: Record<MirrorChoice, React.ReactNode> = {
  return: <Clock className="w-3.5 h-3.5 text-[#C084FC]" />,
  break: <Activity className="w-3.5 h-3.5 text-[#A855F7]" />,
  continue: <CheckCircle2 className="w-3.5 h-3.5 text-[#C084FC]" />,
};

const followUpStatusIcon: Record<FollowUpStatus, React.ReactNode> = {
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-[#A855F7]" />,
  partial: <AlertCircle className="w-3.5 h-3.5 text-[#C084FC]" />,
  not_completed: <X className="w-3.5 h-3.5 text-[#A855F7]" />,
  pending: <Clock className="w-3.5 h-3.5 text-[#6B6B7B]" />,
};

function reasonShort(t: ReturnType<typeof useLang>['t'], r: string): string {
  const map: Record<string, string> = {
    bored: t.mirrorReasonBored,
    stressed: t.mirrorReasonStressed,
    fomo: t.mirrorReasonFomo,
    habit: t.mirrorReasonHabit,
    connect: t.mirrorReasonConnect,
    other: t.mirrorReasonOther,
  };
  return map[r] ?? r;
}

function choiceShort(t: ReturnType<typeof useLang>['t'], c: MirrorChoice): string {
  switch (c) {
    case 'return': return t.mirrorChoiceReturn;
    case 'break': return t.mirrorChoiceBreak;
    case 'continue': return t.mirrorChoiceContinue;
  }
}

function followUpStatusShort(t: ReturnType<typeof useLang>['t'], s: FollowUpStatus): string {
  switch (s) {
    case 'completed': return t.followUpStatusCompleted;
    case 'partial': return t.followUpStatusPartial;
    case 'not_completed': return t.followUpStatusNotCompleted;
    case 'pending': return t.followUpPending;
  }
}

interface ActionResultsProps {
  onCheckIn: (recordId: string) => void;
}

export default function ActionResults({ onCheckIn }: ActionResultsProps) {
  const { t } = useLang();
  const { pushToast } = useApp();
  const [records, setRecords] = useState<MirrorRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const refresh = useCallback(() => {
    setRecords(loadMirrorRecords());
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refresh]);

  // Refresh when component becomes visible (e.g. after mirror closes)
  useEffect(() => {
    refresh();
  }, [refresh]);

  const realRecords = records.filter((r) => !r.isSample);
  const reportableRecords = realRecords.filter((r) => r.followUp && r.followUp.status !== 'pending');

  const totalCheckIns = reportableRecords.length;
  const completed = reportableRecords.filter((r) => r.followUp!.status === 'completed').length;
  const partial = reportableRecords.filter((r) => r.followUp!.status === 'partial').length;
  const notCompleted = reportableRecords.filter((r) => r.followUp!.status === 'not_completed').length;

  const pendingDue = realRecords.filter(
    (r) => r.followUp && r.followUp.status === 'pending' && r.followUp.dueAt <= Date.now()
  );

  function handleExport() {
    if (realRecords.length === 0) {
      pushToast({ text: t.actionExportNoData, variant: 'warn' });
      return;
    }
    exportMirrorCSV(realRecords);
    pushToast({ text: t.insSaved, variant: 'success' });
  }

  const sortedHistory = [...realRecords].sort((a, b) => b.timestamp - a.timestamp);

  if (!loaded) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#A855F7]/15 flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.actionResultsTitle}</h3>
            <p className="text-xs text-[#6B6B7B] mt-0.5">{t.actionResultsSubtitle}</p>
          </div>
        </div>
        <button
          onClick={() => setShowHistory((s) => !s)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
            showHistory ? 'text-[#C084FC] bg-[#C084FC]/10' : 'text-[#A1A1AA] hover:text-[#F8F7FC] hover:bg-[#1E1E28]/50'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          {t.actionHistoryTitle}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sortedHistory.length === 0 ? (
              <p className="text-sm text-[#6B6B7B] py-6 text-center">{t.actionHistoryEmpty}</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                {sortedHistory.map((rec, i) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="py-2.5 px-3 rounded-lg bg-[#101016]/60"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {choiceIcon[rec.choice]}
                        <span className="text-xs text-[#F8F7FC] font-medium">{reasonShort(t, rec.reason)}</span>
                      </div>
                      <span className="text-[10px] text-[#6B6B7B]">
                        {new Date(rec.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        {' · '}
                        {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#6B6B7B]">
                      <span>{choiceShort(t, rec.choice)}</span>
                      {rec.followUp && (
                        <>
                          <span>·</span>
                          <span
                            className="flex items-center gap-1"
                            style={{ color: rec.followUp.status === 'pending' ? '#6B6B7B' : undefined }}
                          >
                            {followUpStatusIcon[rec.followUp.status]}
                            {followUpStatusShort(t, rec.followUp.status)}
                          </span>
                          {rec.followUp.status === 'pending' && rec.followUp.dueAt <= Date.now() && (
                            <button
                              onClick={() => onCheckIn(rec.id)}
                              className="ml-auto flex items-center gap-1 px-2 py-1 rounded-md bg-[#C084FC]/10 text-[#C084FC] text-[10px] font-semibold hover:bg-[#C084FC]/15 transition-colors"
                            >
                              {t.followUpCheckInNow}
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    {rec.followUp?.note && (
                      <p className="text-[11px] text-[#A1A1AA] mt-1 italic leading-snug">"{rec.followUp.note}"</p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <button
              onClick={handleExport}
              disabled={realRecords.length === 0}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C084FC]/10 border border-[#C084FC]/20 text-[#C084FC] text-xs font-semibold hover:bg-[#C084FC]/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              {t.actionExportCSV}
            </button>

            <button
              onClick={() => setShowHistory(false)}
              className="mt-3 w-full text-center text-xs text-[#6B6B7B] hover:text-[#A1A1AA] transition-colors"
            >
              {t.mirrorBack}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {totalCheckIns === 0 && pendingDue.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl bg-[#1E1E28]/40 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-[#6B6B7B]" />
                </div>
                <p className="text-sm font-medium text-[#A1A1AA] mb-1">{t.actionNoData}</p>
                <p className="text-xs text-[#6B6B7B] leading-relaxed px-4">{t.actionNoDataDesc}</p>
              </div>
            ) : (
              <>
                {/* Pending check-in banner */}
                {pendingDue.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-[#C084FC]/8 border border-[#C084FC]/20">
                    <p className="text-xs text-[#C084FC] font-medium mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {pendingDue.length > 1
                        ? `${pendingDue.length} ${t.followUpOverdue}`
                        : t.followUpOverdue}
                    </p>
                    <div className="space-y-1.5">
                      {pendingDue.slice(0, 3).map((rec) => (
                        <button
                          key={rec.id}
                          onClick={() => onCheckIn(rec.id)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#101016]/60 hover:bg-[#15151D] transition-colors text-left"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {choiceIcon[rec.choice]}
                            <span className="text-xs text-[#F8F7FC] truncate">
                              {t.followUpBanner(choiceShort(t, rec.choice))}
                            </span>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#C084FC] flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ResultStat
                    label={t.actionTotalCheckins}
                    value={totalCheckIns}
                    icon={<Activity className="w-3.5 h-3.5" />}
                    accent="#C084FC"
                  />
                  <ResultStat
                    label={t.actionCompleted}
                    value={completed}
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    accent="#A855F7"
                  />
                  <ResultStat
                    label={t.actionPartial}
                    value={partial}
                    icon={<AlertCircle className="w-3.5 h-3.5" />}
                    accent="#C084FC"
                  />
                  <ResultStat
                    label={t.actionNotCompleted}
                    value={notCompleted}
                    icon={<X className="w-3.5 h-3.5" />}
                    accent="#A855F7"
                  />
                </div>

                <button
                  onClick={handleExport}
                  disabled={realRecords.length === 0}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C084FC]/10 border border-[#C084FC]/20 text-[#C084FC] text-xs font-semibold hover:bg-[#C084FC]/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.actionExportCSV}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultStat({ label, value, icon, accent }: { label: string; value: number; icon: React.ReactNode; accent: string }) {
  return (
    <div className="rounded-xl bg-[#101016]/60 p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </span>
        <span className="text-[10px] text-[#6B6B7B] uppercase tracking-wide leading-tight">{label}</span>
      </div>
      <span className="text-lg font-bold font-display">{value}</span>
    </div>
  );
}
