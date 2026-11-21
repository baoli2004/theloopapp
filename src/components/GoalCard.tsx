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
          <div className="w-8 h-8 rounded-xl bg-[#A855F7]/15 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.myGoal}</h3>
            <p className="text-xs text-[#6B6B7B] mt-0.5">{t.goalSubtitle}</p>
          </div>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#A1A1AA] hover:text-[#F8F7FC] hover:bg-[#1E1E28]/50 transition-colors"
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
                <label className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
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
                className="w-full accent-[#A855F7]"
              />
              <div className="flex justify-between text-[10px] text-[#6B6B7B] mt-1">
                <span>15m</span><span>180m</span>
              </div>
            </div>

            {/* Focus sessions slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
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
                className="w-full accent-[#C084FC]"
              />
              <div className="flex justify-between text-[10px] text-[#6B6B7B] mt-1">
                <span>1</span><span>10</span>
              </div>
            </div>

            {/* Custom goal text */}
            <div>
              <label className="text-xs text-[#A1A1AA] flex items-center gap-1.5 mb-2">
                <Flag className="w-3.5 h-3.5 text-[#C084FC]" />
                {t.personalGoal}
              </label>
              <input
                type="text"
                value={draft.customGoal}
                placeholder={t.personalGoalPlaceholder}
                onChange={(e) => setDraft({ ...draft, customGoal: e.target.value })}
                maxLength={60}
                className="w-full px-3 py-2.5 rounded-xl bg-[#101016] border border-[#1E1E28] text-sm text-[#F8F7FC] placeholder:text-[#6B6B7B] focus:border-[#C084FC]/50 focus:outline-none transition-colors"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={save}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-sm font-semibold hover:bg-[#A855F7]/15 transition-colors"
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
                <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#A855F7]" />
                  {t.screenTimeLimit}
                </span>
                <span className={`text-xs font-medium ${over ? 'text-[#A855F7]' : hasTodayData ? 'text-[#A855F7]' : 'text-[#6B6B7B]'}`}>
                  {hasTodayData
                    ? (over ? t.goalOverBy(remaining) : t.goalRemaining(remaining))
                    : t.dashboardNoUsageData}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#1E1E28] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${screenPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${over ? 'bg-gradient-to-r from-[#A855F7] to-[#A855F7]/70' : 'bg-gradient-to-r from-[#A855F7] to-[#A855F7]/70'}`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#6B6B7B] mt-1.5">
                <span>{hasTodayData ? `${usageMin}m` : '—'}</span>
                <span>{goal.screenTimeLimit}m</span>
              </div>
            </div>

            {/* Focus sessions progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#C084FC]" />
                  {t.focusSessionsGoal}
                </span>
                <span className="text-xs font-medium text-[#C084FC]">
                  {t.sessionsProgress(focusSessionsDone, goal.focusSessions)}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#1E1E28] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sessionPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-[#C084FC] to-[#C084FC]/70"
                />
              </div>
            </div>

            {/* Custom goal display */}
            {goal.customGoal && (
              <div className="flex items-start gap-2 pt-3 border-t border-[#1E1E28]/60">
                <Flag className="w-3.5 h-3.5 text-[#C084FC] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#F8F7FC] leading-snug">{goal.customGoal}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
