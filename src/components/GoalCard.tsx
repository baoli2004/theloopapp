import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Pencil, Check, Clock, Zap, Flag } from 'lucide-react';
import { useApp } from '@/store';
import { useLang } from '@/lang';
import { useUsageData } from '@/useUsageData';

export default function GoalCard() {
  const { goal, setGoal, winsToday, completedFocusToday, pushToast } = useApp();
  const { t } = useLang();
  const { todayUsageMin, hasTodayData } = useUsageData();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal);

  const usageMin = hasTodayData ? todayUsageMin : 0;
  const over = hasTodayData && usageMin > goal.screenTimeLimit;
  const remaining = Math.abs(goal.screenTimeLimit - usageMin);
  const screenPct = hasTodayData ? Math.min(100, (usageMin / goal.screenTimeLimit) * 100) : 0;
  const focusSessionsDone = winsToday + completedFocusToday;
  const sessionPct = Math.min(100, (focusSessionsDone / Math.max(1, goal.focusSessions)) * 100);

  const save = () => {
    setGoal(draft);
    setEditing(false);
    const willBeOver = hasTodayData && todayUsageMin > draft.screenTimeLimit;
    pushToast({ text: willBeOver ? t.goalSavedOver : t.goalSavedOnTrack, variant: willBeOver ? 'warn' : 'success' });
  };

  const startEdit = () => {
    setDraft(goal);
    setEditing(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#4ade80]/15 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#4ade80]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.myGoal}</h3>
            <p className="text-xs text-[#5c6680] mt-0.5">{t.goalSubtitle}</p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#9aa4bd] hover:text-[#f1f4fb] hover:bg-[#232a3d]/50 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            {t.editGoal}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Screen time slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#9aa4bd] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fb7185]" />
                  {t.screenTimeLimit}
                </label>
                <span className="text-sm font-semibold font-display">{draft.screenTimeLimit} {t.minutes}</span>
              </div>
              <input
                type="range"
                min={15}
                max={180}
                step={5}
                value={draft.screenTimeLimit}
                onChange={(e) => setDraft({ ...draft, screenTimeLimit: Number(e.target.value) })}
                className="w-full accent-[#fb7185]"
              />
              <div className="flex justify-between text-[10px] text-[#5c6680] mt-1">
                <span>15m</span><span>180m</span>
              </div>
            </div>

            {/* Focus sessions slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#9aa4bd] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                  {t.focusSessionsGoal}
                </label>
                <span className="text-sm font-semibold font-display">{draft.focusSessions}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={draft.focusSessions}
                onChange={(e) => setDraft({ ...draft, focusSessions: Number(e.target.value) })}
                className="w-full accent-[#fbbf24]"
              />
              <div className="flex justify-between text-[10px] text-[#5c6680] mt-1">
                <span>1</span><span>10</span>
              </div>
            </div>

            {/* Custom goal text */}
            <div>
              <label className="text-xs text-[#9aa4bd] flex items-center gap-1.5 mb-2">
                <Flag className="w-3.5 h-3.5 text-[#22d3ee]" />
                {t.personalGoal}
              </label>
              <input
                type="text"
                value={draft.customGoal}
                placeholder={t.personalGoalPlaceholder}
                onChange={(e) => setDraft({ ...draft, customGoal: e.target.value })}
                maxLength={60}
                className="w-full px-3 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:border-[#22d3ee]/50 focus:outline-none transition-colors"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={save}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-sm font-semibold hover:bg-[#4ade80]/15 transition-colors"
            >
              <Check className="w-4 h-4" />
              {t.saveGoal}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Screen time progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9aa4bd] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fb7185]" />
                  {t.screenTimeLimit}
                </span>
                <span className={`text-xs font-medium ${over ? 'text-[#fb7185]' : hasTodayData ? 'text-[#4ade80]' : 'text-[#5c6680]'}`}>
                  {hasTodayData
                    ? (over ? t.goalOverBy(remaining) : t.goalRemaining(remaining))
                    : t.dashboardNoUsageData}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#232a3d] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${screenPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${over ? 'bg-gradient-to-r from-[#fb7185] to-[#fb7185]/70' : 'bg-gradient-to-r from-[#4ade80] to-[#4ade80]/70'}`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#5c6680] mt-1.5">
                <span>{hasTodayData ? `${usageMin}m` : '—'}</span>
                <span>{goal.screenTimeLimit}m</span>
              </div>
            </div>

            {/* Focus sessions progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#9aa4bd] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                  {t.focusSessionsGoal}
                </span>
                <span className="text-xs font-medium text-[#fbbf24]">
                  {t.sessionsProgress(focusSessionsDone, goal.focusSessions)}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#232a3d] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sessionPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#fbbf24] to-[#fbbf24]/70"
                />
              </div>
            </div>

            {/* Custom goal display */}
            {goal.customGoal && (
              <div className="flex items-start gap-2 pt-3 border-t border-[#232a3d]/60">
                <Flag className="w-3.5 h-3.5 text-[#22d3ee] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#f1f4fb] leading-snug">{goal.customGoal}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
