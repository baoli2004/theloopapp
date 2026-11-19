import { useState, type FormEvent } from 'react';
import { Check, Play } from 'lucide-react';
import { useFocusT } from '@/focusI18n';
import { parseCustomMinutes, type NewFocusInput } from '@/focusSession';
import {
  FOCUS_APPS,
  FOCUS_CUSTOM_MAX_MIN,
  FOCUS_GOAL_MAX_LEN,
  FOCUS_PRESET_MINUTES,
  type FocusAppId,
} from '@/types';

type DurationChoice = number | 'custom' | null;

interface Props {
  onStart: (input: NewFocusInput) => void;
}

export default function FocusSetup({ onStart }: Props) {
  const f = useFocusT();
  const [apps, setApps] = useState<FocusAppId[]>([]);
  const [choice, setChoice] = useState<DurationChoice>(null);
  const [customText, setCustomText] = useState('');
  const [goal, setGoal] = useState('');

  const customMin = parseCustomMinutes(customText, FOCUS_CUSTOM_MAX_MIN);
  const plannedMin = choice === 'custom' ? customMin : choice;
  const customInvalid = choice === 'custom' && customText.trim() !== '' && customMin === null;
  const canStart = apps.length > 0 && plannedMin !== null;

  const toggleApp = (id: FocusAppId) => {
    setApps((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canStart || plannedMin === null) return;
    onStart({ apps, plannedMin, goal: goal.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <section className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-sm">{f.appsTitle}</h3>
        <p className="text-xs text-[#5c6680] mt-0.5 mb-4">{f.appsHint}</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FOCUS_APPS.map((id) => {
            const selected = apps.includes(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleApp(id)}
                className={`relative flex items-center justify-between gap-2 px-3 py-3 rounded-xl border text-sm font-medium transition-all active:scale-[0.98] ${
                  selected
                    ? 'border-[#22d3ee]/60 bg-[#22d3ee]/10 text-[#f1f4fb]'
                    : 'border-[#232a3d] bg-[#11151f]/60 text-[#9aa4bd] hover:border-[#2f3850]'
                }`}
              >
                <span>{f.apps[id]}</span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    selected ? 'bg-[#22d3ee] text-[#0a0d14]' : 'border border-[#2f3850]'
                  }`}
                >
                  {selected && <Check className="w-3 h-3" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-4">{f.durationTitle}</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {FOCUS_PRESET_MINUTES.map((min) => {
            const selected = choice === min;
            return (
              <button
                key={min}
                type="button"
                aria-pressed={selected}
                onClick={() => setChoice(min)}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
                  selected
                    ? 'border-[#4ade80]/60 bg-[#4ade80]/10 text-[#4ade80]'
                    : 'border-[#232a3d] bg-[#11151f]/60 text-[#9aa4bd] hover:border-[#2f3850]'
                }`}
              >
                {min} {f.minutesUnit}
              </button>
            );
          })}
          <button
            type="button"
            aria-pressed={choice === 'custom'}
            onClick={() => setChoice('custom')}
            className={`py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
              choice === 'custom'
                ? 'border-[#4ade80]/60 bg-[#4ade80]/10 text-[#4ade80]'
                : 'border-[#232a3d] bg-[#11151f]/60 text-[#9aa4bd] hover:border-[#2f3850]'
            }`}
          >
            {f.customLabel}
          </button>
        </div>
        {choice === 'custom' && (
          <div className="mt-3">
            <input
              type="text"
              inputMode="numeric"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={f.customPlaceholder}
              maxLength={3}
              aria-invalid={customInvalid}
              className="w-full px-4 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:outline-none focus:border-[#4ade80]/60"
            />
            {customInvalid && <p className="text-xs text-[#fb7185] mt-1.5">{f.customInvalid}</p>}
          </div>
        )}
      </section>

      <section className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-sm">{f.goalTitle}</h3>
        <p className="text-xs text-[#5c6680] mt-0.5 mb-3">{f.goalHint}</p>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value.slice(0, FOCUS_GOAL_MAX_LEN))}
          placeholder={f.goalPlaceholder}
          className="w-full px-4 py-2.5 rounded-xl bg-[#11151f] border border-[#232a3d] text-sm text-[#f1f4fb] placeholder:text-[#5c6680] focus:outline-none focus:border-[#22d3ee]/60"
        />
      </section>

      <div className="flex flex-col items-stretch sm:items-end gap-2">
        <button
          type="submit"
          disabled={!canStart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#22d3ee] text-[#0a0d14] text-sm font-bold tracking-wide transition-all hover:bg-[#22d3ee]/85 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          {f.startButton}
        </button>
        {!canStart && (
          <p className="text-xs text-[#5c6680] sm:text-right">
            {apps.length === 0 ? f.startNeedApps : f.startNeedDuration}
          </p>
        )}
      </div>
    </form>
  );
}
