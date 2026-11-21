import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Pause, Play, X } from 'lucide-react';
import { useFocusT } from '@/focusI18n';
import FocusIntervention from '@/components/focus/FocusIntervention';
import {
  buildFocusRecord,
  elapsedActiveMs,
  formatClock,
  plannedMs,
  remainingMs,
  scheduledEndAt,
} from '@/focusSession';
import type { ActiveFocusSession, FocusDecision, FocusReason, FocusSessionRecord } from '@/types';

const RING_RADIUS = 88;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

interface Props {
  session: ActiveFocusSession;
  onUpdate: (session: ActiveFocusSession) => void;
  onFinish: (record: FocusSessionRecord) => void;
}

export default function FocusActive({ session, onUpdate, onFinish }: Props) {
  const f = useFocusT();
  const [now, setNow] = useState(() => Date.now());
  const [step, setStep] = useState<'idle' | 'reason' | 'decision'>('idle');
  const [reason, setReason] = useState<FocusReason | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const id = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  const paused = session.pausedAt !== null;
  const remaining = remainingMs(session, now);
  const progress = Math.min(1, elapsedActiveMs(session, now) / plannedMs(session));
  const expired = !paused && remaining === 0;

  useEffect(() => {
    if (!expired || finishedRef.current) return;
    finishedRef.current = true;
    onFinish(buildFocusRecord(session, 'completed', scheduledEndAt(session), null, session.interventions));
  }, [expired, session, onFinish]);

  const resume = (at: number, interventions: ActiveFocusSession['interventions']) => {
    onUpdate({
      ...session,
      pausedAt: null,
      pausedTotalMs: session.pausedTotalMs + (at - (session.pausedAt ?? at)),
      interventions,
    });
  };

  const pickDecision = (decision: FocusDecision) => {
    if (!reason) return;
    const at = Date.now();
    const interventions = [...session.interventions, { at, reason, decision }];
    if (decision === 'end') {
      onFinish(buildFocusRecord(session, 'cancelled', at, reason, interventions));
      return;
    }
    if (decision === 'break') {
      onUpdate({ ...session, pausedAt: at, interventions });
    } else if (paused) {
      resume(at, interventions);
    } else {
      onUpdate({ ...session, interventions });
    }
    setNow(at);
    setStep('idle');
    setReason(null);
  };

  const manualResume = () => resume(Date.now(), session.interventions);

  const ringColor = paused ? '#C084FC' : '#C084FC';

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            paused ? 'bg-[#C084FC]/10 text-[#C084FC]' : 'bg-[#A855F7]/10 text-[#A855F7]'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${paused ? 'bg-[#C084FC]' : 'bg-[#A855F7] animate-pulse'}`} />
          {paused ? f.statusBreak : f.statusRunning}
        </span>

        <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-6">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r={RING_RADIUS} fill="none" stroke="#1E1E28" strokeWidth="8" />
            <circle
              cx="100"
              cy="100"
              r={RING_RADIUS}
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={RING_CIRC}
              strokeDashoffset={RING_CIRC * progress}
              className="transition-[stroke-dashoffset,stroke] duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold font-display tabular-nums tracking-tight">{formatClock(remaining)}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#6B6B7B] mt-2">{f.timeLeft}</span>
          </div>
        </div>

        {paused && <p className="text-sm text-[#C084FC] mb-4 max-w-sm">{f.breakBanner}</p>}

        {step === 'idle' && (
          <div className="w-full max-w-sm flex flex-col sm:flex-row gap-2">
            {paused ? (
              <button
                type="button"
                onClick={manualResume}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#A855F7] text-[#08080D] text-sm font-bold hover:bg-[#A855F7]/85 transition-colors active:scale-[0.99]"
              >
                <Play className="w-4 h-4" fill="currentColor" /> {f.resumeButton}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep('reason')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#C084FC]/40 bg-[#C084FC]/10 text-[#C084FC] text-sm font-semibold hover:bg-[#C084FC]/15 transition-colors active:scale-[0.99]"
              >
                <Pause className="w-4 h-4" /> {f.stopButton}
              </button>
            )}
            {paused && (
              <button
                type="button"
                onClick={() => setStep('reason')}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#A855F7]/40 text-[#A855F7] text-sm font-semibold hover:bg-[#A855F7]/10 transition-colors active:scale-[0.99]"
              >
                <X className="w-4 h-4" /> {f.endButton}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#6B6B7B] mb-2">{f.goalLabel}</p>
          <p className="text-sm font-medium">{session.goal || f.noGoal}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#6B6B7B] mb-2">{f.avoidingLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {session.apps.map((id) => (
              <span key={id} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#C084FC]/10 text-[#C084FC] border border-[#C084FC]/25">
                {f.apps[id]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step !== 'idle' && (
          <FocusIntervention
            key={step}
            step={step}
            paused={paused}
            onPickReason={(r) => {
              setReason(r);
              setStep('decision');
            }}
            onPickDecision={pickDecision}
            onBack={() => {
              if (step === 'decision') setStep('reason');
              else setStep('idle');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
