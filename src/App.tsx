import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { AppProvider } from '@/store';
import { LangProvider } from '@/lang';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import PeerMatrix from '@/components/PeerMatrix';
import InsightsView from '@/components/insights/InsightsView';
import PatternInterrupt from '@/components/PatternInterrupt';
import LoopMirror from '@/components/LoopMirror';
import FocusLock from '@/components/focus/FocusLock';
import ToastStack from '@/components/ToastStack';

function AppInner() {
  const [tab, setTab] = useState<'dashboard' | 'peers' | 'insights' | 'focus'>('dashboard');
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [mirrorOpen, setMirrorOpen] = useState(false);
  const [checkInRecordId, setCheckInRecordId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#08080D] text-[#F8F7FC]">
      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#A855F7]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C084FC]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <Header tab={tab} setTab={setTab} onSimulate={() => setOverlayOpen(true)} />

        <main className="max-w-5xl mx-auto px-5 py-6 pb-28 sm:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'dashboard' && (
                <Dashboard
                  onOpenMirror={() => setMirrorOpen(true)}
                  onCheckIn={(id) => {
                    setCheckInRecordId(id);
                    setMirrorOpen(true);
                  }}
                />
              )}
              {tab === 'peers' && <PeerMatrix />}
              {tab === 'insights' && <InsightsView />}
              {tab === 'focus' && <FocusLock />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating simulate button (mobile) */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOverlayOpen(true)}
          className="sm:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-[#C084FC] text-[#08080D] flex items-center justify-center shadow-lg shadow-[#C084FC]/30 glow-violet"
        >
          <Zap className="w-6 h-6" />
        </motion.button>

        <PatternInterrupt open={overlayOpen} onClose={() => setOverlayOpen(false)} />
        <LoopMirror
          open={mirrorOpen}
          checkInRecordId={checkInRecordId}
          onClose={() => {
            setMirrorOpen(false);
            setCheckInRecordId(null);
          }}
        />
        <ToastStack />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </LangProvider>
  );
}
