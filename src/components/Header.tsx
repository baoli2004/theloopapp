import { motion } from 'framer-motion';
import { Activity, Users, BarChart3, Timer } from 'lucide-react';
import { useApp } from '@/store';
import { useLang } from '@/lang';
import { useFocusT } from '@/focusI18n';
import LangSwitcher from '@/components/LangSwitcher';

type TabKey = 'dashboard' | 'peers' | 'insights' | 'focus';

interface Props {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  onSimulate: () => void;
}

export default function Header({ tab, setTab, onSimulate }: Props) {
  const { focusState } = useApp();
  const { t } = useLang();
  const f = useFocusT();
  const mindful = focusState === 'mindful';

  return (
    <header className="sticky top-0 z-30 glass border-b border-[#1E1E28]/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#C084FC] flex items-center justify-center flex-shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#08080D]" strokeWidth={2.5} />
          </div>
          <div className="hidden xs:block sm:block">
            <h1 className="text-sm sm:text-base font-bold leading-none font-display">THE LOOP</h1>
            <p className="text-[9px] sm:text-[10px] text-[#6B6B7B] mt-0.5 tracking-wide uppercase">{t.appTagline}</p>
          </div>
        </div>

        <nav className="flex items-center gap-0.5 sm:gap-1 bg-[#101016] rounded-xl p-1 border border-[#1E1E28]/50 overflow-x-auto no-scrollbar flex-shrink-0">
          <TabBtn active={tab === 'dashboard'} onClick={() => setTab('dashboard')} icon={<Activity className="w-4 h-4" />}>
            {t.tabDashboard}
          </TabBtn>
          <TabBtn active={tab === 'peers'} onClick={() => setTab('peers')} icon={<Users className="w-4 h-4" />}>
            {t.tabPeers}
          </TabBtn>
          <TabBtn active={tab === 'insights'} onClick={() => setTab('insights')} icon={<BarChart3 className="w-4 h-4" />}>
            {t.tabInsights}
          </TabBtn>
          <TabBtn active={tab === 'focus'} onClick={() => setTab('focus')} icon={<Timer className="w-4 h-4" />}>
            {f.tabFocus}
          </TabBtn>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <LangSwitcher />
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${mindful ? 'bg-[#A855F7]/10 text-[#A855F7]' : 'bg-[#C084FC]/10 text-[#C084FC]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${mindful ? 'bg-[#A855F7]' : 'bg-[#C084FC]'} animate-pulse`} />
            {mindful ? t.statusMindful : t.statusInLoop}
          </div>
          <button
            onClick={onSimulate}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C084FC] text-[#08080D] text-xs font-semibold hover:bg-[#C084FC]/80 transition-colors"
          >
            {t.simulate}
          </button>
        </div>
      </div>
    </header>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition-colors ${active ? 'text-[#F8F7FC]' : 'text-[#6B6B7B] hover:text-[#A1A1AA]'}`}
    >
      {active && (
        <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#1E1E28]/70 rounded-lg" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
      )}
      <span className="relative flex items-center gap-1.5">{icon}{children}</span>
    </button>
  );
}
