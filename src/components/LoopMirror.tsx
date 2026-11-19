import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, ArrowRight, Heart, Coffee, RotateCcw, Sparkles, Lock, History, Trash2, FlaskConical, BarChart3, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLang } from '@/lang';
import { useApp } from '@/store';
import { MIRROR_REASONS, FOLLOWUP_INTERVALS, type MirrorReason, type MirrorChoice, type MirrorRecord, type FollowUpIntervalMin, type FollowUpStatus } from '@/types';
import {
  saveMirrorRecord,
  loadMirrorRecords,
  clearAllMirrorRecords,
  loadSampleMirrorRecords,
  clearSampleMirrorRecords,
  updateMirrorFollowUp,
  completeMirrorFollowUp,
} from '@/mirrorStorage';

type Phase = 'question' | 'reflect' | 'done' | 'followup_schedule' | 'followup_checkin' | 'history';

const choiceIcon: Record<MirrorChoice, React.ReactNode> = {
  return: <RotateCcw className="w-5 h-5 text-[#22d3ee]" />,
  break: <Coffee className="w-5 h-5 text-[#4ade80]" />,
  continue: <Sparkles className="w-5 h-5 text-[#fbbf24]" />,
};

const choiceAccent: Record<MirrorChoice, string> = {
  return: '#22d3ee',
  break: '#4ade80',
  continue: '#fbbf24',
};

const choiceOrder: MirrorChoice[] = ['return', 'break', 'continue'];

const followUpStatusIcon: Record<FollowUpStatus, React.ReactNode> = {
  completed: <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />,
  partial: <AlertCircle className="w-4 h-4 text-[#fbbf24]" />,
  not_completed: <X className="w-4 h-4 text-[#fb7185]" />,
  pending: <Clock className="w-4 h-4 text-[#5c6680]" />,
};

const followUpStatusAccent: Record<FollowUpStatus, string> = {
  completed: '#4ade80',
  partial: '#fbbf24',
  not_completed: '#fb7185',
  pending: '#5c6680',
};

function choiceLabel(t: ReturnType<typeof useLang>['t'], c: MirrorChoice): string {
  switch (c) {
    case 'return': return t.mirrorChoiceReturn;
    case 'break': return t.mirrorChoiceBreak;
    case 'continue': return t.mirrorChoiceContinue;
  }
}

function choiceFullLabel(t: ReturnType<typeof useLang>['t'], c: MirrorChoice): string {
  return t.mirrorChoices[c];
}

function reasonLabel(t: ReturnType<typeof useLang>['t'], r: MirrorReason): string {
  switch (r) {
    case 'bored': return t.mirrorReasonBored;
    case 'stressed': return t.mirrorReasonStressed;
    case 'fomo': return t.mirrorReasonFomo;
    case 'habit': return t.mirrorReasonHabit;
    case 'connect': return t.mirrorReasonConnect;
    case 'other': return t.mirrorReasonOther;
  }
}

function followUpStatusLabel(t: ReturnType<typeof useLang>['t'], s: FollowUpStatus): string {
  switch (s) {
    case 'completed': return t.followUpStatusCompleted;
    case 'partial': return t.followUpStatusPartial;
    case 'not_completed': return t.followUpStatusNotCompleted;
    case 'pending': return t.followUpPending;
  }
}

function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

interface LoopMirrorProps {
  open: boolean;
  onClose: () => void;
  checkInRecordId?: string | null;
}

export default function LoopMirror({ open, onClose, checkInRecordId }: LoopMirrorProps) {
  const { t } = useLang();
  const { pushToast } = useApp();
  const [phase, setPhase] = useState<Phase>('question');
  const [reason, setReason] = useState<MirrorReason | null>(null);
  const [choice, setChoice] = useState<MirrorChoice | null>(null);
  const [lastRecordId, setLastRecordId] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<FollowUpIntervalMin>(10);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState<FollowUpStatus | null>(null);
  const [checkInRecord, setCheckInRecord] = useState<MirrorRecord | null>(null);
  const [records, setRecords] = useState<MirrorRecord[]>([]);

  useEffect(() => {
    if (open) {
      const loaded = loadMirrorRecords();
      setRecords(loaded);

      if (checkInRecordId) {
        const rec = loaded.find((r) => r.id === checkInRecordId);
        if (rec && rec.followUp && rec.followUp.status === 'pending') {
          setCheckInRecord(rec);
          setPhase('followup_checkin');
          setFollowUpNote('');
          setFollowUpStatus(null);
          return;
        }
      }

      setPhase('question');
      setReason(null);
      setChoice(null);
      setLastRecordId(null);
      setFollowUpNote('');
      setFollowUpStatus(null);
      setCheckInRecord(null);
    }
  }, [open, checkInRecordId]);

  const reset = useCallback(() => {
    setPhase('question');
    setReason(null);
    setChoice(null);
    setLastRecordId(null);
    setFollowUpNote('');
    setFollowUpStatus(null);
    setCheckInRecord(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  function selectReason(r: MirrorReason) {
    setReason(r);
    setPhase('reflect');
  }

  function selectChoice(c: MirrorChoice) {
    setChoice(c);
    if (reason) {
      const record: MirrorRecord = {
        id: `m${Date.now()}`,
        timestamp: Date.now(),
        reason,
        choice: c,
      };
      try {
        const updated = saveMirrorRecord(record);
        setRecords(updated);
        setLastRecordId(record.id);
        pushToast({ text: t.mirrorSaved, variant: 'success' });
      } catch {
        // storage unavailable
      }
    }
    setPhase('followup_schedule');
  }

  function scheduleFollowUp() {
    if (!lastRecordId) return;
    const dueAt = Date.now() + selectedInterval * 60_000;
    const updated = updateMirrorFollowUp(lastRecordId, {
      intervalMin: selectedInterval,
      dueAt,
    });
    setRecords(updated);
    pushToast({ text: t.followUpSetToast, variant: 'success' });
    setPhase('done');
  }

  function skipFollowUp() {
    pushToast({ text: t.followUpSkipped, variant: 'info' });
    setPhase('done');
  }

  function submitCheckIn() {
    if (!checkInRecord || !followUpStatus) return;
    const updated = completeMirrorFollowUp(
      checkInRecord.id,
      followUpStatus,
      followUpNote
    );
    setRecords(updated);
    pushToast({ text: t.followUpSubmitted, variant: 'success' });
    handleClose();
  }

  function handleLoadSample() {
    const updated = loadSampleMirrorRecords();
    setRecords(updated);
    pushToast({ text: t.sampleLoaded, variant: 'info' });
  }

  function handleClearSample() {
    const updated = clearSampleMirrorRecords();
    setRecords(updated);
    pushToast({ text: t.sampleCleared, variant: 'info' });
  }

  function handleClearAll() {
    if (window.confirm(t.mirrorClearAllConfirm)) {
      clearAllMirrorRecords();
      setRecords([]);
      pushToast({ text: t.dataCleared, variant: 'warn' });
    }
  }

  if (!open) return null;

  const realRecords = records.filter((r) => !r.isSample);
  const sampleRecords = records.filter((r) => r.isSample);
  const todayCount = records.filter((r) => isToday(r.timestamp)).length;
  const recentRecords = [...records].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-[#0a0d14]/90 backdrop-blur-xl" />

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="relative w-full max-w-md max-h-[85vh] overflow-y-auto"
        >
          <div className="glass rounded-3xl p-6 sm:p-8 border border-[#232a3d] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22d3ee] to-[#4ade80] flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#0a0d14]" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-display">{t.mirrorTitle}</h2>
                  <p className="text-[10px] text-[#5c6680]">{t.mirrorSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPhase('history')}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${phase === 'history' ? 'text-[#22d3ee] bg-[#22d3ee]/10' : 'text-[#5c6680] hover:text-[#9aa4bd] hover:bg-[#232a3d]/50'}`}
                >
                  <History className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5c6680] hover:text-[#9aa4bd] hover:bg-[#232a3d]/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* PHASE 1: Question */}
              {phase === 'question' && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Quick stats */}
                  {records.length > 0 && (
                    <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#22d3ee]/8 border border-[#22d3ee]/15">
                      <BarChart3 className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="text-xs text-[#9aa4bd]">{t.mirrorSessionsToday}: <span className="text-[#22d3ee] font-medium">{todayCount}</span></span>
                      <span className="text-xs text-[#5c6680]">·</span>
                      <span className="text-xs text-[#9aa4bd]">{t.mirrorHistory}: <span className="text-[#f1f4fb] font-medium">{records.length}</span></span>
                    </div>
                  )}

                  <p className="text-base font-medium font-display leading-snug mb-5 px-1">
                    {t.mirrorQuestion}
                  </p>
                  <div className="space-y-2.5">
                    {MIRROR_REASONS.map((r, i) => (
                      <motion.button
                        key={r}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectReason(r)}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-[#11151f] border border-[#232a3d] hover:border-[#22d3ee]/40 hover:bg-[#171c2a] transition-colors text-left text-sm"
                      >
                        <span className="text-[#f1f4fb]">{t.mirrorReasons[r]}</span>
                        <ArrowRight className="w-4 h-4 text-[#5c6680] flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PHASE 2: Reflection + Choices */}
              {phase === 'reflect' && reason && (
                <motion.div
                  key="reflect"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Selected reason chip */}
                  <div className="mb-4 px-3 py-2 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/20">
                    <p className="text-xs text-[#22d3ee] font-medium">{t.mirrorReasons[reason]}</p>
                  </div>

                  {/* Supportive reflection */}
                  <div className="mb-5 p-4 rounded-xl bg-[#11151f]/60 border border-[#232a3d]/60">
                    <div className="flex items-start gap-2.5">
                      <Heart className="w-4 h-4 text-[#fb7185] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#9aa4bd] leading-relaxed">
                        {t.mirrorReflections[reason]}
                      </p>
                    </div>
                  </div>

                  {/* What now */}
                  <p className="text-base font-medium font-display leading-snug mb-4 px-1">
                    {t.mirrorWhatNow}
                  </p>
                  <div className="space-y-2.5">
                    {choiceOrder.map((c, i) => (
                      <motion.button
                        key={c}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectChoice(c)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#11151f] border border-[#232a3d] hover:border-[#232a3d]/80 transition-colors text-left"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${choiceAccent[c]}15` }}
                        >
                          {choiceIcon[c]}
                        </div>
                        <span className="text-sm text-[#f1f4fb] flex-1">{t.mirrorChoices[c]}</span>
                        <ArrowRight className="w-4 h-4 text-[#5c6680] flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Back button */}
                  <button
                    onClick={() => setPhase('question')}
                    className="mt-4 w-full text-center text-xs text-[#5c6680] hover:text-[#9aa4bd] transition-colors"
                  >
                    {t.mirrorBack}
                  </button>
                </motion.div>
              )}

              {/* PHASE 3: Follow-up scheduling */}
              {phase === 'followup_schedule' && choice && (
                <motion.div
                  key="followup_schedule"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {/* Selected choice chip */}
                  <div className="mb-4 px-3 py-2 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center gap-2">
                    <div style={{ color: choiceAccent[choice] }}>{choiceIcon[choice]}</div>
                    <p className="text-xs text-[#f1f4fb] font-medium">{choiceFullLabel(t, choice)}</p>
                  </div>

                  <p className="text-base font-medium font-display leading-snug mb-4 px-1">
                    {t.followUpPrompt}
                  </p>

                  <div className="mb-4 p-4 rounded-xl bg-[#11151f]/60 border border-[#232a3d]/60">
                    <p className="text-sm text-[#9aa4bd] leading-relaxed">
                      {t.followUpQuestion(choiceFullLabel(t, choice))}
                    </p>
                  </div>

                  {/* Interval selection */}
                  <label className="text-xs text-[#9aa4bd] block mb-2">{t.followUpInterval}</label>
                  <p className="text-[11px] text-[#5c6680] mb-3">{t.followUpIntervalDesc}</p>
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {FOLLOWUP_INTERVALS.map((iv) => (
                      <button
                        key={iv}
                        onClick={() => setSelectedInterval(iv)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-colors ${
                          selectedInterval === iv
                            ? 'bg-[#22d3ee]/15 border border-[#22d3ee]/40 text-[#22d3ee]'
                            : 'bg-[#11151f] border border-[#232a3d] text-[#9aa4bd] hover:border-[#232a3d]/80'
                        }`}
                      >
                        {iv}m
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={skipFollowUp}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#232a3d]/40 text-[#9aa4bd] text-sm font-medium hover:bg-[#232a3d]/60 transition-colors"
                    >
                      {t.followUpSkip}
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={scheduleFollowUp}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-sm font-semibold hover:bg-[#22d3ee]/15 transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                      {t.followUpSet}
                    </motion.button>
                  </div>

                  {/* Privacy note */}
                  <div className="mt-5 flex items-start gap-2 px-2">
                    <Lock className="w-3 h-3 text-[#5c6680] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#5c6680] leading-relaxed text-left">
                      {t.mirrorPrivacyNote}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PHASE 4: Follow-up check-in */}
              {phase === 'followup_checkin' && checkInRecord && (
                <motion.div
                  key="followup_checkin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-4 px-3 py-2 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center gap-2">
                    <div style={{ color: choiceAccent[checkInRecord.choice] }}>{choiceIcon[checkInRecord.choice]}</div>
                    <p className="text-xs text-[#f1f4fb] font-medium">{choiceFullLabel(t, checkInRecord.choice)}</p>
                  </div>

                  <p className="text-base font-medium font-display leading-snug mb-2 px-1">
                    {t.followUpCheckInQ}
                  </p>
                  <p className="text-xs text-[#5c6680] mb-5 px-1 flex items-start gap-1.5">
                    <Lock className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    {t.followUpSelfReported}
                  </p>

                  {/* Status selection */}
                  <div className="space-y-2.5 mb-4">
                    {(['completed', 'partial', 'not_completed'] as FollowUpStatus[]).map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFollowUpStatus(s)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors ${
                          followUpStatus === s
                            ? 'border-[#22d3ee]/40 bg-[#22d3ee]/10'
                            : 'border-[#232a3d] bg-[#11151f] hover:border-[#232a3d]/80'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${followUpStatusAccent[s]}15` }}
                        >
                          {followUpStatusIcon[s]}
                        </div>
                        <span className="text-sm text-[#f1f4fb] flex-1">{followUpStatusLabel(t, s)}</span>
                        {followUpStatus === s && (
                          <CheckCircle2 className="w-4 h-4 text-[#22d3ee] flex-shrink-0" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Optional note */}
                  <div className="mb-4">
                    <label className="text-xs text-[#9aa4bd] block mb-2">{t.followUpNoteLabel}</label>
                    <textarea
                      value={followUpNote}
                      onChange={(e) => setFollowUpNote(e.target.value)}
                      placeholder={t.followUpNotePlaceholder}
                      rows={2}
                      maxLength={200}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:border-[#22d3ee]/40 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={submitCheckIn}
                    disabled={!followUpStatus}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-sm font-semibold hover:bg-[#4ade80]/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.followUpSubmit}
                  </motion.button>
                </motion.div>
              )}

              {/* PHASE 5: Encouragement */}
              {phase === 'done' && choice && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: `${choiceAccent[choice]}15` }}
                  >
                    <div style={{ color: choiceAccent[choice] }}>
                      {choiceIcon[choice]}
                    </div>
                  </motion.div>

                  <p className="text-base font-medium leading-relaxed text-[#f1f4fb] mb-6 px-2">
                    {t.mirrorEncouragement[choice]}
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-sm font-semibold hover:bg-[#4ade80]/15 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {t.mirrorReturn}
                  </motion.button>

                  {/* Privacy note */}
                  <div className="mt-5 flex items-start gap-2 px-2">
                    <Lock className="w-3 h-3 text-[#5c6680] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#5c6680] leading-relaxed text-left">
                      {t.mirrorPrivacyNote}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PHASE 6: History */}
              {phase === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <h3 className="text-sm font-bold font-display mb-1">{t.mirrorHistory}</h3>

                  {/* Data summary */}
                  <div className="mb-4 flex items-center gap-3 text-xs">
                    <span className="text-[#9aa4bd]">{t.mirrorSessionsToday}: <span className="text-[#22d3ee] font-medium">{todayCount}</span></span>
                    <span className="text-[#5c6680]">·</span>
                    <span className="text-[#9aa4bd]">{t.mirrorHistory}: <span className="text-[#f1f4fb] font-medium">{records.length}</span></span>
                  </div>

                  {records.length === 0 ? (
                    <div className="py-8 text-center">
                      <History className="w-8 h-8 text-[#232a3d] mx-auto mb-3" />
                      <p className="text-sm text-[#5c6680]">{t.mirrorHistoryEmpty}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-4">
                      {recentRecords.map((rec, i) => (
                        <motion.div
                          key={rec.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-[#11151f]/60"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${choiceAccent[rec.choice]}15` }}
                          >
                            <div style={{ color: choiceAccent[rec.choice] }}>
                              {choiceIcon[rec.choice]}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-[#f1f4fb] font-medium">{reasonLabel(t, rec.reason)}</span>
                              {rec.isSample && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#fbbf24]/15 text-[#fbbf24]">{t.mirrorDemoBadge}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#5c6680]">{choiceLabel(t, rec.choice)}</span>
                              {rec.followUp && rec.followUp.status !== 'pending' && (
                                <span className="flex items-center gap-1 text-[10px]" style={{ color: followUpStatusAccent[rec.followUp.status] }}>
                                  · {followUpStatusIcon[rec.followUp.status]}
                                  {followUpStatusLabel(t, rec.followUp.status)}
                                </span>
                              )}
                              {rec.followUp && rec.followUp.status === 'pending' && (
                                <span className="flex items-center gap-1 text-[10px] text-[#5c6680]">
                                  · <Clock className="w-3 h-3" />
                                  {t.followUpPending}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-[#5c6680] flex-shrink-0">
                            {new Date(rec.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            <br />
                            {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Demo data controls */}
                  <div className="pt-4 border-t border-[#232a3d]/60 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {sampleRecords.length === 0 ? (
                        <button
                          onClick={handleLoadSample}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-xs font-medium hover:bg-[#fbbf24]/15 transition-colors"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          {t.mirrorLoadSample}
                        </button>
                      ) : (
                        <button
                          onClick={handleClearSample}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#232a3d]/40 text-[#9aa4bd] text-xs font-medium hover:bg-[#232a3d]/60 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t.mirrorClearSample}
                        </button>
                      )}
                      {realRecords.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#fb7185]/8 text-[#fb7185] text-xs font-medium hover:bg-[#fb7185]/12 transition-colors ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t.mirrorClearAll}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Privacy note */}
                  <div className="mt-4 flex items-start gap-2">
                    <Lock className="w-3 h-3 text-[#5c6680] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-[#5c6680] leading-relaxed">
                      {t.mirrorPrivacyNote}
                    </p>
                  </div>

                  <button
                    onClick={() => setPhase('question')}
                    className="mt-4 w-full text-center text-xs text-[#5c6680] hover:text-[#9aa4bd] transition-colors"
                  >
                    {t.mirrorBack}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
