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
          <div className="w-8 h-8 rounded-xl bg-[#A855F7]/15 flex items-center justify-center">
            <Brain className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.insReflectionTitle}</h3>
            <p className="text-xs text-[#6B6B7B] mt-0.5">{record.date}</p>
          </div>
        </div>

        {/* Reflection question */}
        <p className="text-sm text-[#F8F7FC] font-medium leading-snug mb-3">
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
                    ? 'bg-[#A855F7]/10 border-[#A855F7]/30 text-[#F8F7FC]'
                    : 'bg-[#101016]/60 border-[#1E1E28] text-[#A1A1AA] hover:border-[#1E1E28]/80'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border ${selected ? 'bg-[#A855F7] border-[#A855F7]' : 'border-[#1E1E28]'}`}>
                  {selected && <Check className="w-3 h-3 text-[#08080D]" strokeWidth={3} />}
                </span>
                {t.insReflectionReasons[r]}
              </button>
            );
          })}
        </div>

        {/* Optional reflection text */}
        <div className="mb-4">
          <label className="text-xs text-[#A1A1AA] block mb-2">{t.insReflectionText}</label>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder={t.insReflectionPlaceholder}
            rows={3}
            maxLength={300}
            className="w-full px-3 py-2.5 rounded-xl bg-[#101016] border border-[#1E1E28] text-sm text-[#F8F7FC] placeholder:text-[#6B6B7B] focus:border-[#C084FC]/40 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Intention question */}
        <div className="mb-4">
          <p className="text-sm text-[#F8F7FC] font-medium leading-snug mb-2 flex items-start gap-2">
            <Heart className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
            {t.insIntentionQ}
          </p>
          <input
            type="text"
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={t.insIntentionPlaceholder}
            maxLength={120}
            className="w-full px-3 py-2.5 rounded-xl bg-[#101016] border border-[#1E1E28] text-sm text-[#F8F7FC] placeholder:text-[#6B6B7B] focus:border-[#A855F7]/40 focus:outline-none transition-colors"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onDone}
            className="flex-1 px-4 py-3 rounded-xl bg-[#1E1E28]/40 text-[#A1A1AA] text-sm font-medium hover:bg-[#1E1E28]/60 transition-colors"
          >
            {t.insSkipReflection}
          </button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={save}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7] text-sm font-semibold hover:bg-[#A855F7]/15 transition-colors"
          >
            <Check className="w-4 h-4" />
            {t.insSaveReflection}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
