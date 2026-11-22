import { useFocusT } from '@/focusI18n';
import { computeFocusStats, formatFocusTotal } from '@/focusSession';
import type { FocusSessionRecord } from '@/types';

const RECENT_LIMIT = 10;

export default function FocusHistory({ records }: { records: FocusSessionRecord[] }) {
  const f = useFocusT();
  const stats = computeFocusStats(records);
  const recent = records.slice(0, RECENT_LIMIT);

  if (records.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="font-semibold">{f.historyEmpty}</p>
        <p className="text-sm text-[#5c6680] mt-1.5 max-w-sm mx-auto">{f.historyEmptyDesc}</p>
      </div>
    );
  }

  const statCards = [
    { label: f.historyTotal, value: `${stats.total}`, accent: '#22d3ee' },
    { label: f.historyCompleted, value: `${stats.completed}`, accent: '#4ade80' },
    { label: f.historyCancelled, value: `${stats.cancelled}`, accent: '#4ade80' },
    { label: f.historyRate, value: stats.completionRate === null ? '—' : `${stats.completionRate}%`, accent: '#22d3ee' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="glass rounded-xl p-4">
            <p className="text-[11px] text-[#5c6680] uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-bold font-display mt-2" style={{ color: card.accent }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-4 flex items-center justify-between">
        <p className="text-[11px] text-[#5c6680] uppercase tracking-wide">{f.historyFocusTime}</p>
        <p className="text-xl font-bold font-display text-[#22d3ee]">{formatFocusTotal(stats.totalFocusMs)}</p>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-3">{f.historyRecent}</h3>
        <ul className="space-y-2">
          {recent.map((r) => {
            const completed = r.status === 'completed';
            return (
              <li key={r.id} className="px-4 py-3 rounded-xl bg-[#11151f]/60 border border-[#232a3d]/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.goal || f.noGoal}</p>
                    <p className="text-xs text-[#5c6680] mt-0.5">
                      {new Date(r.startedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {' · '}
                      {r.apps.map((id) => f.apps[id]).join(', ')}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0"
                    style={{
                      background: completed ? '#4ade8018' : '#4ade8018',
                      color: completed ? '#4ade80' : '#4ade80',
                    }}
                  >
                    {completed ? f.statusCompleted : f.statusCancelled}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-[#9aa4bd]">
                  <span>{f.resultPlanned}: {r.plannedMin} {f.minutesUnit}</span>
                  <span>{f.resultActual}: {formatFocusTotal(r.actualMs)}</span>
                  {!completed && r.cancelReason && <span>{f.resultCancelReason}: {f.reasons[r.cancelReason]}</span>}
                  <span>{r.feeling ? f.feelings[r.feeling] : f.feelingNotAnswered}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
