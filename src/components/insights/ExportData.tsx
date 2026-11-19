import { motion } from 'framer-motion';
import { Download, FileText, ShieldOff, Database, Trash2, FlaskConical, Lock } from 'lucide-react';
import { useLang } from '@/lang';
import { useApp } from '@/store';
import type { UsageRecord } from '@/types';
import { exportCSV } from '@/csvExport';
import { formatDateDisplay } from '@/usageStorage';

interface Props {
  records: UsageRecord[];
  setRecords: (r: UsageRecord[]) => void;
}

const sampleRecords: UsageRecord[] = [
  {
    date: getOffsetDate(6),
    apps: [
      { appName: 'TikTok', minutes: 52 },
      { appName: 'Facebook', minutes: 18 },
      { appName: 'YouTube', minutes: 30 },
      { appName: 'Instagram', minutes: 25 },
      { appName: 'Other Apps', minutes: 10 },
    ],
    totalMinutes: 135,
    dailyGoalMin: 60,
    goalDiffMin: 75,
    reflectionReasons: ['bored', 'habit'],
    reflectionText: 'Opened TikTok without thinking after lunch.',
    nextDayIntention: 'Take a 10-min walk after lunch instead.',
    updatedAt: Date.now(),
    isSample: true,
  },
  {
    date: getOffsetDate(5),
    apps: [
      { appName: 'TikTok', minutes: 38 },
      { appName: 'Facebook', minutes: 12 },
      { appName: 'YouTube', minutes: 45 },
      { appName: 'Instagram', minutes: 15 },
      { appName: 'Other Apps', minutes: 5 },
    ],
    totalMinutes: 115,
    dailyGoalMin: 60,
    goalDiffMin: 55,
    reflectionReasons: ['stressed'],
    reflectionText: 'Had a test and kept opening apps to avoid studying.',
    nextDayIntention: 'Use the 25-5 study timer method.',
    updatedAt: Date.now(),
    isSample: true,
  },
  {
    date: getOffsetDate(4),
    apps: [
      { appName: 'TikTok', minutes: 20 },
      { appName: 'Facebook', minutes: 8 },
      { appName: 'YouTube', minutes: 15 },
      { appName: 'Instagram', minutes: 10 },
      { appName: 'Other Apps', minutes: 0 },
    ],
    totalMinutes: 53,
    dailyGoalMin: 60,
    goalDiffMin: -7,
    reflectionReasons: ['connect'],
    reflectionText: 'Used YouTube to watch a study video, felt good.',
    nextDayIntention: 'Keep using YouTube for studying only.',
    updatedAt: Date.now(),
    isSample: true,
  },
  {
    date: getOffsetDate(3),
    apps: [
      { appName: 'TikTok', minutes: 45 },
      { appName: 'Facebook', minutes: 22 },
      { appName: 'YouTube', minutes: 28 },
      { appName: 'Instagram', minutes: 30 },
      { appName: 'Other Apps', minutes: 8 },
    ],
    totalMinutes: 133,
    dailyGoalMin: 60,
    goalDiffMin: 73,
    reflectionReasons: ['fomo', 'habit'],
    reflectionText: '',
    nextDayIntention: 'Turn off notifications before study time.',
    updatedAt: Date.now(),
    isSample: true,
  },
  {
    date: getOffsetDate(2),
    apps: [
      { appName: 'TikTok', minutes: 15 },
      { appName: 'Facebook', minutes: 5 },
      { appName: 'YouTube', minutes: 20 },
      { appName: 'Instagram', minutes: 8 },
      { appName: 'Other Apps', minutes: 3 },
    ],
    totalMinutes: 51,
    dailyGoalMin: 60,
    goalDiffMin: -9,
    reflectionReasons: ['connect'],
    reflectionText: 'Mostly messaging friends, not scrolling.',
    nextDayIntention: 'Keep it up, maybe set a stricter goal.',
    updatedAt: Date.now(),
    isSample: true,
  },
  {
    date: getOffsetDate(1),
    apps: [
      { appName: 'TikTok', minutes: 60 },
      { appName: 'Facebook', minutes: 30 },
      { appName: 'YouTube', minutes: 40 },
      { appName: 'Instagram', minutes: 35 },
      { appName: 'Other Apps', minutes: 15 },
    ],
    totalMinutes: 180,
    dailyGoalMin: 60,
    goalDiffMin: 120,
    reflectionReasons: ['bored', 'stressed', 'habit'],
    reflectionText: 'Long day, kept opening apps when I felt tired.',
    nextDayIntention: 'Put phone in drawer while doing homework.',
    updatedAt: Date.now(),
    isSample: true,
  },
];

function getOffsetDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function ExportData({ records, setRecords }: Props) {
  const { t, lang } = useLang();
  const { pushToast } = useApp();

  const userData = records.filter((r) => !r.isSample);
  const sampleData = records.filter((r) => r.isSample);
  const hasData = userData.length > 0;

  function handleExport(anonymous: boolean) {
    if (userData.length === 0) {
      pushToast({ text: t.insExportNoData, variant: 'warn' });
      return;
    }
    exportCSV(userData, anonymous);
    pushToast({ text: t.insSaved, variant: 'success' });
  }

  function loadSample() {
    // Remove existing sample data, add fresh
    const withoutSamples = records.filter((r) => !r.isSample);
    setRecords([...withoutSamples, ...sampleRecords]);
    pushToast({ text: t.insSaved, variant: 'info' });
  }

  function clearSample() {
    setRecords(records.filter((r) => !r.isSample));
    pushToast({ text: t.insSaved, variant: 'info' });
  }

  function clearAll() {
    if (window.confirm(t.insDeleteConfirm)) {
      setRecords([]);
      pushToast({ text: t.insSaved, variant: 'info' });
    }
  }

  return (
    <div className="space-y-4">
      {/* Export */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#22d3ee]/15 flex items-center justify-center">
            <Download className="w-4 h-4 text-[#22d3ee]" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t.insExportTitle}</h3>
            <p className="text-xs text-[#5c6680] mt-0.5">{t.insExportDesc}</p>
          </div>
        </div>

        {!hasData && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#fbbf24]/8 border border-[#fbbf24]/20 mb-3">
            <FileText className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
            <p className="text-xs text-[#fbbf24]">{t.insExportNoData}</p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => handleExport(true)}
            disabled={!hasData}
            className="flex flex-col items-start gap-1 p-4 rounded-xl bg-[#11151f]/60 border border-[#232a3d] hover:border-[#4ade80]/30 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[#4ade80]">
              <ShieldOff className="w-4 h-4" />
              {t.insExportAnon}
            </span>
            <span className="text-xs text-[#5c6680]">{t.insExportAnonDesc}</span>
          </button>

          <button
            onClick={() => handleExport(false)}
            disabled={!hasData}
            className="flex flex-col items-start gap-1 p-4 rounded-xl bg-[#11151f]/60 border border-[#232a3d] hover:border-[#22d3ee]/30 transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-[#22d3ee]">
              <Download className="w-4 h-4" />
              {t.insExportFull}
            </span>
            <span className="text-xs text-[#5c6680]">{t.insExportFullDesc}</span>
          </button>
        </div>

        {/* Data summary */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#9aa4bd] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#22d3ee]" />
              {t.insRealData}
            </span>
            <span className="text-[#f1f4fb] font-medium">{userData.length} {lang === 'vi' ? 'bản ghi' : 'records'}</span>
          </div>
          {sampleData.length > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#fbbf24] flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5" />
                {t.insSampleData}
              </span>
              <span className="text-[#fbbf24] font-medium">{sampleData.length} {lang === 'vi' ? 'bản ghi' : 'records'}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sample data + clear */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-4 h-4 text-[#fbbf24]" />
          <h3 className="font-semibold text-sm">{t.insSampleData}</h3>
        </div>
        <p className="text-xs text-[#5c6680] mb-3 leading-relaxed">{t.insSampleDataDesc}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadSample}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24] text-xs font-medium hover:bg-[#fbbf24]/15 transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            {t.insLoadSample}
          </button>
          {sampleData.length > 0 && (
            <button
              onClick={clearSample}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#232a3d]/40 text-[#9aa4bd] text-xs font-medium hover:bg-[#232a3d]/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.insClearSample}
            </button>
          )}
          {userData.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#fb7185]/8 text-[#fb7185] text-xs font-medium hover:bg-[#fb7185]/12 transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.insClearAll}
            </button>
          )}
        </div>
      </motion.div>

      {/* Privacy note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#5c6680] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-[#9aa4bd] mb-1">{t.insPrivacyNote}</p>
            <p className="text-xs text-[#5c6680] leading-relaxed">{t.insPrivacyNoteText}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
