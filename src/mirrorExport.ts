import type { MirrorRecord } from '@/types';

function csvEscape(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportMirrorCSV(records: MirrorRecord[]): void {
  const headers = [
    'DateTime',
    'Reason',
    'Action',
    'FollowUpIntervalMin',
    'FollowUpDueAt',
    'FollowUpStatus',
    'FollowUpNote',
    'FollowUpReportedAt',
    'DataType',
  ];

  const lines: string[] = [headers.join(',')];

  const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);

  for (const r of sorted) {
    const row = [
      new Date(r.timestamp).toISOString(),
      r.reason,
      r.choice,
      r.followUp?.intervalMin ?? '',
      r.followUp ? new Date(r.followUp.dueAt).toISOString() : '',
      r.followUp?.status ?? '',
      r.followUp?.note ?? '',
      r.followUp?.reportedAt ? new Date(r.followUp.reportedAt).toISOString() : '',
      r.isSample ? 'sample' : 'user',
    ];

    lines.push(row.map(csvEscape).join(','));
  }

  const csv = lines.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'theloop_mirror_sessions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
