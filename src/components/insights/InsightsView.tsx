import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Plus, Download } from 'lucide-react';
import { useLang } from '@/lang';
import type { UsageRecord } from '@/types';
import { loadRecords, saveRecords } from '@/usageStorage';
import UsageEntry from '@/components/insights/UsageEntry';
import InsightsDashboard from '@/components/insights/InsightsDashboard';
import Reflection from '@/components/insights/Reflection';
import ExportData from '@/components/insights/ExportData';

type SubView = 'dashboard' | 'entry' | 'reflection' | 'export';

export default function InsightsView() {
  const { t } = useLang();
  const [records, setRecordsState] = useState<UsageRecord[]>([]);
  const [subView, setSubView] = useState<SubView>('dashboard');
  const [entryDate, setEntryDate] = useState<string | null>(null);
  const [reflectionRecord, setReflectionRecord] = useState<UsageRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setRecordsState(loadRecords());
    setLoaded(true);
  }, []);

  // Persist to localStorage whenever records change
  const setRecords = useCallback((r: UsageRecord[]) => {
    setRecordsState(r);
    saveRecords(r);
  }, []);

  function handleSaved(record: UsageRecord) {
    setReflectionRecord(record);
    setSubView('reflection');
  }

  function handleEnterData(date: string) {
    setEntryDate(date);
    setSubView('entry');
  }

  function handleReflectionDone() {
    setReflectionRecord(null);
    setSubView('dashboard');
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#232a3d] border-t-[#22d3ee] rounded-full animate-spin" />
      </div>
    );
  }

  const subTabs: { key: SubView; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: t.insDashboardTitle, icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { key: 'entry', label: t.insEntryTitle, icon: <Plus className="w-3.5 h-3.5" /> },
    { key: 'export', label: t.insExportTitle, icon: <Download className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Sub-navigation */}
      <div className="flex items-center gap-1 bg-[#11151f] rounded-xl p-1 border border-[#232a3d]/50 w-fit">
        {subTabs.map((st) => (
          <button
            key={st.key}
            onClick={() => {
              setSubView(st.key);
              setEntryDate(null);
            }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              subView === st.key ? 'text-[#f1f4fb]' : 'text-[#5c6680] hover:text-[#9aa4bd]'
            }`}
          >
            {subView === st.key && (
              <motion.div
                layoutId="insights-tab-bg"
                className="absolute inset-0 bg-[#232a3d]/70 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {st.icon}
              {st.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={subView + (entryDate ?? '')}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {subView === 'dashboard' && (
            <InsightsDashboard
              records={records}
              setRecords={setRecords}
              onEnterData={handleEnterData}
            />
          )}

          {subView === 'entry' && (
            <UsageEntry
              records={records}
              setRecords={setRecords}
              onSaved={handleSaved}
              editDate={entryDate}
            />
          )}

          {subView === 'reflection' && reflectionRecord && (
            <Reflection
              record={reflectionRecord}
              records={records}
              setRecords={setRecords}
              onDone={handleReflectionDone}
            />
          )}

          {subView === 'export' && (
            <ExportData records={records} setRecords={setRecords} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
