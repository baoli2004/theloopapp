import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useFocusT } from '@/focusI18n';
import { formatFocusTotal } from '@/focusSession';
import { FOCUS_FEELINGS, type FocusFeeling, type FocusSessionRecord } from '@/types';

interface Props {
  record: FocusSessionRecord;
  onFeeling: (feeling: FocusFeeling) => void;
  onDone: () => void;
}

export default function FocusResult({ record, onFeeling, onDone }: Props) {
  const f = useFocusT();
  const completed = record.status === 'completed';
  const tone = completed ? '#4ade80' : '#fb7185';

  const rows: { label: string; value: string }[] = [
    { label: f.resultGoal, value: record.goal || f.noGoal },
    { label: f.resultPlanned, value: `${record.plannedMin} ${f.minutesUnit}` },
    { label: f.resultActual, value: formatFocusTotal(record.actualMs) },
    { label: f.resultApps, value: record.apps.map((id) => f.apps[id]).join(', ') },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3">
          {completed ? (
            <CheckCircle2 className="w-9 h-9 text-[#4ade80] flex-shrink-0" />
          ) : (
            <XCircle className="w-9 h-9 text-[#fb7185] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-[#5c6680]">{f.resultTitle}</p>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              {completed ? f.statusCompleted : f.statusCancelled}
            </h2>
          </div>
        </div>
        <p className="text-sm text-[#9aa4bd] mt-3 leading-relaxed">
          {completed ? f.resultCompletedMsg : f.resultCancelledMsg}
        </p>

        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rows.map((row) => (
            <div key={row.label} className="px-4 py-3 rounded-xl bg-[#11151f]/60 border border-[#232a3d]/60">
              <dt className="text-[10px] uppercase tracking-wide text-[#5c6680]">{row.label}</dt>
              <dd className="text-sm font-medium mt-1 break-words">{row.value}</dd>
            </div>
          ))}
          <div className="px-4 py-3 rounded-xl bg-[#11151f]/60 border border-[#232a3d]/60">
            <p className="text-[10px] uppercase tracking-wide text-[#5c6680]">{f.resultStatus}</p>
            <span className="inline-flex mt-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: `${tone}18`, color: tone }}>
              {completed ? f.statusCompleted : f.statusCancelled}
            </span>
          </div>
          {!completed && record.cancelReason && (
            <div className="px-4 py-3 rounded-xl bg-[#11151f]/60 border border-[#232a3d]/60">
              <p className="text-[10px] uppercase tracking-wide text-[#5c6680]">{f.resultCancelReason}</p>
              <p className="text-sm font-medium mt-1">{f.reasons[record.cancelReason]}</p>
            </div>
          )}
        </dl>
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold text-sm mb-4">{f.feelingQuestion}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FOCUS_FEELINGS.map((key) => {
            const selected = record.feeling === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => onFeeling(key)}
                className={`py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] ${
                  selected
                    ? 'border-[#22d3ee]/60 bg-[#22d3ee]/10 text-[#22d3ee]'
                    : 'border-[#232a3d] bg-[#11151f]/60 text-[#9aa4bd] hover:border-[#2f3850]'
                }`}
              >
                {f.feelings[key]}
              </button>
            );
          })}
        </div>
        {record.feeling && <p className="text-xs text-[#5c6680] mt-3">{f.feelingSaved}</p>}
      </div>

      <div className="flex justify-center sm:justify-end">
        <button
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#22d3ee] text-[#0a0d14] text-sm font-bold hover:bg-[#22d3ee]/85 transition-colors active:scale-[0.99]"
        >
          {f.doneButton}
        </button>
      </div>
    </motion.div>
  );
}
