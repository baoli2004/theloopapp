import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, Brain, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '@/store';
import { useLang } from '@/lang';
import type { ReasonKey } from '@/i18n';

type Phase = 'idle' | 'simulating' | 'countdown' | 'choice' | 'reason';

const reasonKeys: ReasonKey[] = ['Curious', 'Bored', 'Habit'];

export default function PatternInterrupt({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pushToast, logSession, setFocusState, goal } = useApp();
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(15);
  const [simCount, setSimCount] = useState(0);

  const reset = useCallback(() => {
    setPhase('idle');
    setCount(15);
    setSimCount(0);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  // Simulated scroll session (2s fake video feed)
  useEffect(() => {
    if (!open) return;
    setPhase('simulating');
    setSimCount(0);
    const interval = setInterval(() => setSimCount((c) => c + 1), 80);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPhase('countdown');
      setCount(15);
    }, 2000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [open]);

  // 15-second frictional countdown
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count <= 0) {
      setPhase('choice');
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  const handleBreak = () => {
    logSession({ outcome: 'break' });
    setFocusState('mindful');
    pushToast({ text: t.toastLoopBroken, variant: 'success' });
    handleClose();
  };

  const handleContinue = () => {
    setPhase('reason');
  };

  const handleReason = (reason: ReasonKey) => {
    logSession({ outcome: 'continue', reason });
    setFocusState('in_loop');
    pushToast({ text: t.toastReason(t.reasons[reason]), variant: 'warn' });
    handleClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Blurred backdrop simulating the feed */}
        <div className="absolute inset-0 bg-[#0a0d14]">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 backdrop-blur-2xl bg-[#0a0d14]/80" />
        </div>

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="relative w-full max-w-md mx-4"
        >
          <div className="glass rounded-3xl p-8 border border-[#232a3d] shadow-2xl">
            <AnimatePresence mode="wait">
              {/* SIMULATING */}
              {phase === 'simulating' && (
                <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                  <div className="relative mx-auto w-24 h-32 rounded-2xl bg-gradient-to-b from-[#232a3d] to-[#11151f] border border-[#232a3d] overflow-hidden mb-6">
                    <motion.div
                      animate={{ y: [0, -120, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-x-0 top-0 space-y-1 p-2"
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 rounded-lg bg-gradient-to-br from-[#232a3d] to-[#171c2a]" />
                      ))}
                    </motion.div>
                  </div>
                  <p className="text-sm text-[#9aa4bd]">{t.simulatingScroll}</p>
                  <p className="text-xs text-[#5c6680] mt-1">{t.videosSwiped(simCount)}</p>
                </motion.div>
              )}

              {/* COUNTDOWN */}
              {phase === 'countdown' && (
                <motion.div key="cd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Brain className="w-5 h-5 text-[#22d3ee]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#22d3ee]">{t.system2}</span>
                  </div>
                  <div className="relative mx-auto w-32 h-32 mb-6">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#232a3d" strokeWidth="6" />
                      <motion.circle
                        cx="60" cy="60" r="52" fill="none" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={327}
                        animate={{ strokeDashoffset: 327 - (327 * count) / 15 }}
                        transition={{ duration: 1, ease: 'linear' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        key={count}
                        initial={{ scale: 1.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-bold font-display text-[#22d3ee]"
                      >
                        {count}
                      </motion.span>
                      {/* Breathing cue */}
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-2 h-2 rounded-full bg-[#22d3ee] mt-1"
                      />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium font-display leading-snug px-2"
                  >
                    {goal.customGoal ? t.nudgeWithGoal(goal.customGoal) : t.nudgeMessage}
                  </motion.p>
                  <p className="text-xs text-[#5c6680] mt-3">{t.takeBreath}</p>
                  {/* Breathing guide text */}
                  <motion.p
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[11px] text-[#22d3ee]/60 mt-2"
                  >
                    Breathe in · Breathe out
                  </motion.p>
                </motion.div>
              )}

              {/* CHOICE */}
              {phase === 'choice' && (
                <motion.div key="choice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#4ade80]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#4ade80]">{t.yourCall}</span>
                  </div>
                  <h2 className="text-xl font-bold font-display mb-2">{t.whatToDo}</h2>
                  <p className="text-sm text-[#9aa4bd] mb-6">{t.noJudgment}</p>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBreak}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-[#fb7185]/10 border border-[#fb7185]/30 hover:bg-[#fb7185]/15 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#4ade80]/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-[#4ade80]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#4ade80]">{t.breakLoop}</p>
                          <p className="text-xs text-[#9aa4bd]">{t.breakLoopSub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#4ade80]/50" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinue}
                      className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-[#22d3ee]/8 border border-[#22d3ee]/25 hover:bg-[#22d3ee]/12 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/15 flex items-center justify-center">
                          <ArrowLeft className="w-5 h-5 text-[#fbbf24]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#fbbf24]">{t.continueWatching}</p>
                          <p className="text-xs text-[#9aa4bd]">{t.continueSub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#22d3ee]/50" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* REASON */}
              {phase === 'reason' && (
                <motion.div key="reason" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-[#fbbf24]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#fbbf24]">{t.quickCheck}</span>
                  </div>
                  <h2 className="text-xl font-bold font-display mb-2">{t.whatPulling}</h2>
                  <p className="text-sm text-[#9aa4bd] mb-6">{t.oneTap}</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {reasonKeys.map((r, i) => (
                      <motion.button
                        key={r}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleReason(r)}
                        className="px-3 py-5 rounded-2xl bg-[#171c2a] border border-[#232a3d] hover:border-[#22d3ee]/40 transition-colors"
                      >
                        <span className="text-sm font-medium">{t.reasons[r]}</span>
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-xs text-[#5c6680] mt-5">{t.checkBackSooner}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {phase === 'countdown' && (
              <p className="text-center text-[10px] text-[#5c6680] mt-4">{t.buttonsUnlock(count)}</p>
            )}

            {phase !== 'countdown' && phase !== 'simulating' && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[#5c6680] hover:text-[#9aa4bd] hover:bg-[#232a3d]/50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
