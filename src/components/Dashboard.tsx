import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Clock, AlertCircle, TrendingUp, Target, Brain, Info, Coffee, RotateCcw, Sparkles } from 'lucide-react';
import { useApp } from '@/store';
import { useLang } from '@/lang';
import type { ReasonKey } from '@/i18n';
import type { MirrorRecord, MirrorChoice } from '@/types';
import GoalCard from '@/components/GoalCard';
import ActionResults from '@/components/ActionResults';
import { useUsageData } from '@/useUsageData';
import { getLast7Days, formatDateDisplay } from '@/usageStorage';
import { loadMirrorRecords } from '@/mirrorStorage';

const mirrorChoiceIcon: Record<MirrorChoice, React.ReactNode> = {
  return: <RotateCcw className="w-4 h-4 text-[#C084FC]" />,
  break: <Coffee className="w-4 h-4 text-[#A855F7]" />,
  continue: <Sparkles className="w-4 h-4 text-[#C084FC]" />,
};

type ActivityItem = {
  id: string;
  timestamp: number;
  type: 'session' | 'mirror';
  label: string;
  icon: React.ReactNode;
  isSample?: boolean;
};

export default function Dashboard({ onOpenMirror, onCheckIn }: { onOpenMirror: () => void; onCheckIn: (recordId: string) => void }) {
  const { focusState, teamStreak, focusRate, winsToday, interruptsToday, totalScore, sessionLogs } = useApp();
  const { t } = useLang();
  const { todayUsageMin, hasTodayData, records } = useUsageData();
  const mindful = focusState === 'mindful';

  const screenTimeDisplay = hasTodayData ? `${todayUsageMin}m` : '—';
  const screenTimeSub = hasTodayData ? t.today : t.dashboardNoUsageData;

  // Build unified activity timeline from session logs + mirror records
  const mirrorRecords = loadMirrorRecords();
  const activityItems: ActivityItem[] = [
    ...sessionLogs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp,
      type: 'session' as const,
      label: log.outcome === 'break'
        ? t.brokeLoop
        : `${t.continued}${log.reason ? t.reasons[log.reason as ReasonKey] : ''}`,
      icon: log.outcome === 'break'
        ? <CheckCircle2 className="w-4 h-4 text-[#A855F7]" />
        : <AlertCircle className="w-4 h-4 text-[#C084FC]" />,
    })),
    ...mirrorRecords.map((rec: MirrorRecord) => ({
      id: rec.id,
      timestamp: rec.timestamp,
      type: 'mirror' as const,
      label: `${t.mirrorRecentSession} · ${rec.reason} → ${rec.choice}`,
      icon: mirrorChoiceIcon[rec.choice],
      isSample: rec.isSample,
    })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Status Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-6 border ${mindful ? 'border-[#A855F7]/30 bg-gradient-to-br from-[#A855F7]/8 to-transparent' : 'border-[#C084FC]/30 bg-gradient-to-br from-[#C084FC]/8 to-transparent'}`}
      >
        <div className="grid-bg absolute inset-0 opacity-20" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B6B7B] mb-2">{t.currentStatus}</p>
            <div className="flex items-center gap-3">
              {mindful ? (
                <CheckCircle2 className="w-9 h-9 text-[#A855F7]" />
              ) : (
                <AlertCircle className="w-9 h-9 text-[#C084FC]" />
              )}
              <div>
                <h2 className="text-2xl font-bold font-display">
                  {mindful ? t.statusMindful : t.statusInLoop}
                </h2>
                <p className="text-sm text-[#A1A1AA] mt-0.5">
                  {mindful ? t.mindfulMsg : t.inLoopMsg}
                </p>
              </div>
            </div>
          </div>
          <div className={`relative ${mindful ? 'glow-mint' : 'glow-amber'}`}>
            <div className={`w-16 h-16 rounded-full ${mindful ? 'bg-[#A855F7]/15' : 'bg-[#C084FC]/15'} flex items-center justify-center`}>
              <div className={`w-8 h-8 rounded-full ${mindful ? 'bg-[#A855F7]' : 'bg-[#C084FC]'} relative`}>
                <div className={`absolute inset-0 rounded-full ${mindful ? 'bg-[#A855F7]' : 'bg-[#C084FC]'} pulse-ring`} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label={t.statTeamStreak} value={`${teamStreak} ${t.statDays}`} accent="#C084FC" delay={0.05} />
        <StatCard icon={<Target className="w-4 h-4" />} label={t.statFocusRate} value={`${focusRate}%`} accent="#A855F7" delay={0.1} sub={t.today} />
        <StatCard icon={<Zap className="w-4 h-4" />} label={t.statInterrupts} value={`${interruptsToday}`} accent="#C084FC" delay={0.15} sub={t.today} />
        <StatCard icon={<Clock className="w-4 h-4" />} label={t.statScreenTime} value={screenTimeDisplay} accent="#A855F7" delay={0.2} sub={screenTimeSub} />
      </div>

      {/* THE LOOP MIRROR entry */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        whileTap={{ scale: 0.99 }}
        onClick={onOpenMirror}
        className="w-full relative overflow-hidden rounded-2xl p-5 border border-[#C084FC]/25 bg-gradient-to-br from-[#C084FC]/8 to-[#A855F7]/5 hover:border-[#C084FC]/40 transition-colors text-left"
      >
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C084FC] to-[#A855F7] flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-[#08080D]" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold font-display">{t.mirrorTitle}</h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">{t.mirrorSubtitle}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[#C084FC]/15 text-[#C084FC] text-xs font-semibold flex-shrink-0">
            {t.mirrorOpen}
          </div>
        </div>
      </motion.button>

      {/* Goal Card */}
      <GoalCard />

      {/* Manual data disclaimer */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#101016]/40 border border-[#1E1E28]/40">
        <Info className="w-4 h-4 text-[#6B6B7B] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#6B6B7B] leading-relaxed">{t.dashboardManualNote}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">{t.chartTitle}</h3>
              <p className="text-xs text-[#6B6B7B] mt-0.5">{t.chartSubtitle}</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#A855F7]"><span className="w-2 h-2 rounded-sm bg-[#A855F7]" />{t.chartUsage}</span>
              <span className="flex items-center gap-1 text-[#C084FC]"><span className="w-2 h-2 rounded-sm bg-[#C084FC]" />{t.chartInterrupts}</span>
            </div>
          </div>
          <UsageChart records={records} sessionLogs={sessionLogs} />
        </motion.div>

        {/* Score + Wins */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 flex flex-col"
        >
          <h3 className="font-semibold text-sm mb-1">{t.groupScore}</h3>
          <p className="text-xs text-[#6B6B7B] mb-4">{t.scoreSubtitle}</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1E1E28" strokeWidth="10" />
                <motion.circle
                  cx="60" cy="60" r="50" fill="none" stroke="#A855F7" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={314}
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (314 * Math.min(totalScore, 100)) / 100 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-display">{totalScore}</span>
                <span className="text-[10px] text-[#6B6B7B] uppercase tracking-wide">{t.points}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1E1E28]/60 flex items-center justify-between text-sm">
            <span className="text-[#A1A1AA]">{t.winsToday}</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#A855F7]">
              <CheckCircle2 className="w-4 h-4" /> {winsToday}
            </span>
          </div>
        </motion.div>
      </div>

      <ActionResults onCheckIn={onCheckIn} />

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="font-semibold text-sm mb-3">{t.recentSessions}</h3>
        {activityItems.length === 0 ? (
          <p className="text-sm text-[#6B6B7B] py-6 text-center">{t.noInterrupts}</p>
        ) : (
          <div className="space-y-2">
            {activityItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#101016]/60"
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span className="text-sm">
                    {item.type === 'mirror'
                      ? `${t.mirrorRecentSession}: ${item.label.split(' · ')[1] ?? ''}`
                      : item.label}
                  </span>
                  {item.isSample && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#C084FC]/15 text-[#C084FC]">{t.mirrorDemoBadge}</span>
                  )}
                </div>
                <span className="text-xs text-[#6B6B7B]">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value, accent, sub, delay }: { icon: React.ReactNode; label: string; value: string; accent: string; sub?: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
          {icon}
        </span>
        <span className="text-[11px] text-[#6B6B7B] uppercase tracking-wide">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold font-display">{value}</span>
        {sub && <span className="text-[10px] text-[#6B6B7B]">{sub}</span>}
      </div>
    </motion.div>
  );
}

function UsageChart({ records, sessionLogs }: { records: import('@/types').UsageRecord[]; sessionLogs: import('@/types').SessionLog[] }) {
  const { lang } = useLang();

  const weekUsage = getLast7Days(records);
  const today = new Date();
  const weekDates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    weekDates.push(`${y}-${m}-${day}`);
  }

  const weekInterrupts = weekDates.map((dateStr) => {
    const dayStart = new Date(dateStr + 'T00:00:00').getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    return sessionLogs.filter((l) => l.timestamp >= dayStart && l.timestamp < dayEnd).length;
  });

  const allValues = [...weekUsage.map((d) => d.total ?? 0), ...weekInterrupts, 1];
  const maxUsage = Math.max(...allValues, 30);
  const maxInt = Math.max(...weekInterrupts, 3);

  return (
    <div className="flex items-end justify-between gap-2 h-44 px-1">
      {weekUsage.map((d, i) => {
        const usageVal = d.total ?? 0;
        const intVal = weekInterrupts[i];
        const hasData = d.total !== null;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="w-full flex items-end justify-center gap-1 h-full">
              {hasData ? (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(usageVal / maxUsage) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 120 }}
                  className="w-3 rounded-t bg-gradient-to-t from-[#A855F7]/40 to-[#A855F7]"
                />
              ) : (
                <div className="w-3 h-full flex items-end">
                  <div className="w-full border-t-2 border-dashed border-[#1E1E28] rounded-t" />
                </div>
              )}
              {intVal > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(intVal / maxInt) * 100}%` }}
                  transition={{ delay: 0.35 + i * 0.06, type: 'spring', stiffness: 120 }}
                  className="w-3 rounded-t bg-gradient-to-t from-[#C084FC]/40 to-[#C084FC]"
                />
              )}
            </div>
            <span className="text-[10px] text-[#6B6B7B]">{formatDateDisplay(d.date, lang)}</span>
          </div>
        );
      })}
    </div>
  );
}
