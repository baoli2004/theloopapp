import { motion } from 'framer-motion';
import { ArrowLeft, Coffee, Play, X } from 'lucide-react';
import { useFocusT } from '@/focusI18n';
import { FOCUS_REASONS, type FocusDecision, type FocusReason } from '@/types';

interface Props {
  step: 'reason' | 'decision';
  paused: boolean;
  onPickReason: (reason: FocusReason) => void;
  onPickDecision: (decision: FocusDecision) => void;
  onBack: () => void;
}

export default function FocusIntervention({ step, paused, onPickReason, onPickDecision, onBack }: Props) {
  const f = useFocusT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-2xl p-5 border border-[#22d3ee]/25"
      role="dialog"
      aria-label={f.mirrorQuestion}
    >
      {step === 'reason' ? (
        <>
          <p className="text-base font-semibold font-display leading-snug">{f.mirrorQuestion}</p>
          <p className="text-xs text-[#5c6680] mt-1 mb-4">{f.reasonsTitle}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FOCUS_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onPickReason(r)}
                className="px-3 py-3 rounded-xl border border-[#232a3d] bg-[#11151f]/60 text-sm text-[#f1f4fb] hover:border-[#22d3ee]/50 hover:bg-[#22d3ee]/5 transition-colors active:scale-[0.98]"
              >
                {f.reasons[r]}
              </button>
            ))}
          </div>
          <button type="button" onClick={onBack} className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#9aa4bd] hover:text-[#f1f4fb] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {f.back}
          </button>
        </>
      ) : (
        <>
          <p className="text-base font-semibold font-display">{f.decisionTitle}</p>
          <div className="mt-4 space-y-2">
            <DecisionOption
              icon={<Play className="w-4 h-4" fill="currentColor" />}
              tone="#4ade80"
              title={paused ? f.resumeButton : f.decisionContinue}
              desc={f.decisionContinueDesc}
              onClick={() => onPickDecision('continue')}
            />
            {!paused && (
              <DecisionOption
                icon={<Coffee className="w-4 h-4" />}
                tone="#22d3ee"
                title={f.decisionBreak}
                desc={f.decisionBreakDesc}
                onClick={() => onPickDecision('break')}
              />
            )}
            <DecisionOption
              icon={<X className="w-4 h-4" />}
              tone="#4ade80"
              title={f.decisionEnd}
              desc={f.decisionEndDesc}
              onClick={() => onPickDecision('end')}
            />
          </div>
          <button type="button" onClick={onBack} className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#9aa4bd] hover:text-[#f1f4fb] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {f.back}
          </button>
        </>
      )}
    </motion.div>
  );
}

function DecisionOption({ icon, tone, title, desc, onClick }: { icon: React.ReactNode; tone: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3.5 rounded-xl border border-[#232a3d] bg-[#11151f]/60 text-left hover:bg-[#171c2a] transition-colors active:scale-[0.99]"
    >
      <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${tone}18`, color: tone }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[#f1f4fb]">{title}</span>
        <span className="block text-xs text-[#9aa4bd] mt-0.5 leading-relaxed">{desc}</span>
      </span>
    </button>
  );
}
