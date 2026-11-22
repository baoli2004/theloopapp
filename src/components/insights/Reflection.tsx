import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Check, Heart, ArrowRight } from 'lucide-react';
import { useLang } from '@/lang';
import { useApp } from '@/store';
import type { UsageRecord, ReflectionReason } from '@/types';
import { REFLECTION_REASONS } from '@/types';

interface Props {
  record: UsageRecord;
  records: UsageRecord[];
  setRecords: (r: UsageRecord[]) => void;
  onDone: () => void;
}

export default function Reflection({ record, records, setRecords, onDone }: Props) {
  const { t } = useLang();
  const { pushToast } = useApp();
  const [selectedReasons, setSelectedReasons] = useState<Set<ReflectionReason>>(
    new Set(record.reflectionReasons)
  );
  const [reflectionText, setReflectionText] = useState(record.reflectionText);
  const [intention, setIntention] = useState(record.nextDayIntention);

  function toggleReason(r: ReflectionReason) {
    setSelectedReasons((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });
  }

  function save() {
    const updated: UsageRecord = {
      ...record,
      reflectionReasons: Array.from(selectedReasons),
      reflectionText: reflectionText.trim(),
      nextDayIntention: intention.trim(),
      updatedAt: Date.now(),
    };
    const newRecords = records.map((r) => (r.date === record.date ? updated : r));
    setRecords(newRecords);
    pushToast({ text: t.insReflectionSaved, variant: 'success' });
    onDone();
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#4ade80]/15 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#4ade80]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.insReflectionTitle}</h3>
            <p className="text-xs text-[#5c6680] mt-0.5">{record.date}</p>
          </div>
        </div>

        {/* Reflection question */}
        <p className="text-sm text-[#f1f4fb] font-medium leading-snug mb-3">
          {t.insReflectionQ}
        </p>
        <div className="space-y-2 mb-4">
          {REFLECTION_REASONS.map((r) => {
            const selected = selectedReasons.has(r);
            return (
              <button
                key={r}
                onClick={() => toggleReason(r)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left text-sm transition-colors ${
                  selected
                    ? 'bg-[#4ade80]/10 border-[#4ade80]/30 text-[#f1f4fb]'
                    : 'bg-[#11151f]/60 border-[#232a3d] text-[#9aa4bd] hover:border-[#232a3d]/80'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${selected ? 'bg-[#4ade80] border-[#4ade80]' : 'border-[#232a3d]'}`}>
                  {selected && <Check className="w-3 h-3 text-[#0a0d14]" strokeWidth={3} />}
                </span>
                {t.insReflectionReasons[r]}
              </button>
            );
          })}
        </div>

        {/* Optional reflection text */}
        <div className="mb-4">
          <label className="text-xs text-[#9aa4bd] block mb-2">{t.insReflectionText}</label>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder={t.insReflectionPlaceholder}
            rows={3}
            maxLength={300}
            className="w-full px-3 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:border-[#22d3ee]/40 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Intention question */}
        <div className="mb-4">
          <p className="text-sm text-[#f1f4fb] font-medium leading-snug mb-2 flex items-start gap-2">
            <Heart className="w-4 h-4 text-[#fb7185] flex-shrink-0 mt-0.5" />
            {t.insIntentionQ}
          </p>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={t.insIntentionPlaceholder}
            maxLength={120}
            className="w-full px-3 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:border-[#4ade80]/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDone}
            className="flex-1 px-4 py-3 rounded-xl bg-[#232a3d]/40 text-[#9aa4bd] text-sm font-medium hover:bg-[#232a3d]/60 transition-colors"
          >
            {t.insSkipReflection}
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={save}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#fb7185]/10 border border-[#fb7185]/30 text-[#fb7185] text-sm font-semibold hover:bg-[#fb7185]/15 transition-colors"
          >
            <Check className="w-4 h-4" />
            {t.insSaveReflection}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
