import type { UsageRecord } from '@/types';

function csvEscape(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportCSV(records: UsageRecord[], anonymous: boolean): void {
  const headers = anonymous
    ? ['Date', 'TikTok_min', 'Facebook_min', 'YouTube_min', 'Instagram_min', 'OtherApps_min', 'Total_min', 'DailyGoal_min', 'GoalDiff_min', 'ReflectionReasons', 'ReflectionText', 'NextDayIntention', 'DataType']
    : ['Date', 'TikTok_min', 'Facebook_min', 'YouTube_min', 'Instagram_min', 'OtherApps_min', 'Total_min', 'DailyGoal_min', 'GoalDiff_min', 'ReflectionReasons', 'ReflectionText', 'NextDayIntention', 'DataType'];

  const lines: string[] = [headers.join(',')];

  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));

  for (const r of sorted) {
    const appMap: Record<string, number> = {};
    for (const a of r.apps) {
      appMap[a.appName] = a.minutes;
    }

    const row = [
      r.date,
      appMap['TikTok'] ?? '',
      appMap['Facebook'] ?? '',
      appMap['YouTube'] ?? '',
      appMap['Instagram'] ?? '',
      appMap['Other Apps'] ?? '',
      r.totalMinutes,
      r.dailyGoalMin,
      r.goalDiffMin,
      r.reflectionReasons.join('; '),
      r.reflectionText,
      r.nextDayIntention,
      r.isSample ? 'sample' : 'user',
    ];

    lines.push(row.map(csvEscape).join(','));
  }

  const csv = lines.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const filename = anonymous ? 'theloop_usage_anonymous.csv' : 'theloop_usage_full.csv';
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
