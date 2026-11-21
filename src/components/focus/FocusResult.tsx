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
  const tone = completed ? '#A855F7' : '#A855F7';

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
            <CheckCircle2 className="w-9 h-9 text-[#A855F7] flex-shrink-0" />
          ) : (
            <XCircle className="w-9 h-9 text-[#A855F7] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-[#6B6B7B]">{f.resultTitle}</p>
            <h2 className="text-xl sm:text-2xl font-bold font-display mt-0.5">
              {completed ? f.statusCompleted : f.statusCancelled}
            </h2>
          </div>
        </div>
        <p className="text-sm text-[#A1A1AA] mt-3 leading-relaxed">
          {completed ? f.resultCompletedMsg : f.resultCancelledMsg}
        </p>

        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {rows.map((row) => (
            <div key={row.label} className="px-4 py-3 rounded-xl bg-[#101016]/60 border border-[#1E1E28]/60">
              <dt className="text-[10px] uppercase tracking-wide text-[#6B6B7B]">{row.label}</dt>
              <dd className="text-sm font-medium mt-1 break-words">{row.value}</dd>
            </div>
          ))}
          <div className="px-4 py-3 rounded-xl bg-[#101016]/60 border border-[#1E1E28]/60">
            <p className="text-[10px] uppercase tracking-wide text-[#6B6B7B]">{f.resultStatus}</p>
            <span className="inline-flex mt-1 px-2 py-0.5 rounded text-xs font-semibold" style={{ background: `${tone}18`, color: tone }}>
              {completed ? f.statusCompleted : f.statusCancelled}
            </span>
          </div>
          {!completed && record.cancelReason && (
            <div className="px-4 py-3 rounded-xl bg-[#101016]/60 border border-[#1E1E28]/60">
              <p className="text-[10px] uppercase tracking-wide text-[#6B6B7B]">{f.resultCancelReason}</p>
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
                    ? 'border-[#C084FC]/60 bg-[#C084FC]/10 text-[#C084FC]'
                    : 'border-[#1E1E28] bg-[#101016]/60 text-[#A1A1AA] hover:border-[#2A2A3A]'
                }`}
              >
                {f.feelings[key]}
              </button>
            );
          })}
        </div>
        {record.feeling && <p className="text-xs text-[#6B6B7B] mt-3">{f.feelingSaved}</p>}
      </div>

      <div className="flex justify-center sm:justify-end">
        <button
          type="button"
          onClick={onDone}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C084FC] text-[#08080D] text-sm font-bold hover:bg-[#C084FC]/85 transition-colors active:scale-[0.99]"
        >
          {f.doneButton}
        </button>
      </div>
    </motion.div>
  );
}
