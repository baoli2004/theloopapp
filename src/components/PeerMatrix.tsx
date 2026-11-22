import { motion } from 'framer-motion';
import { Send, Circle, Flame, Clock, EyeOff, Focus, AlertCircle, Info } from 'lucide-react';
import { useApp } from '@/store';
import { useLang } from '@/lang';
import type { Buddy, BuddyStatus } from '@/types';

const statusIcons: Record<BuddyStatus, { color: string; icon: React.ReactNode }> = {
  off_screen: { color: '#4ade80', icon: <EyeOff className="w-3.5 h-3.5" /> },
  focused: { color: '#22d3ee', icon: <Focus className="w-3.5 h-3.5" /> },
  needs_nudge: { color: '#22d3ee', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  scrolling: { color: '#fb7185', icon: <Circle className="w-3.5 h-3.5" /> },
};

const statusOrder: BuddyStatus[] = ['off_screen', 'focused', 'needs_nudge', 'scrolling'];

export default function PeerMatrix() {
  const { buddies, nudgePeer, nudges } = useApp();
  const { t } = useLang();

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="font-semibold text-sm mb-1">{t.peerMatrix}</h3>
        <p className="text-xs text-[#5c6680] mb-4">{t.peerSubtitle}</p>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          {statusOrder.map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[#9aa4bd]">
              <span className="w-2 h-2 rounded-full" style={{ background: statusIcons[s].color }} />
              {t.buddyStatus[s]}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-3">
        {buddies.map((b, i) => (
          <BuddyCard key={b.id} buddy={b} delay={i * 0.08} onNudge={() => nudgePeer(b.id)} nudged={nudges.some((n) => n.buddyId === b.id)} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="font-semibold text-sm mb-3">{t.howPauseWorks}</h3>
        <div className="space-y-2.5 text-sm text-[#9aa4bd]">
          <p className="flex gap-2.5"><span className="text-[#22d3ee] font-semibold">1.</span> {t.pauseStep1}</p>
          <p className="flex gap-2.5"><span className="text-[#22d3ee] font-semibold">2.</span> {t.pauseStep2}</p>
          <p className="flex gap-2.5"><span className="text-[#22d3ee] font-semibold">3.</span> {t.pauseStep3}</p>
        </div>
      </motion.div>

      {/* Demo disclaimer */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#11151f]/40 border border-[#232a3d]/40">
        <Info className="w-4 h-4 text-[#5c6680] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#5c6680] leading-relaxed">{t.peerDemoNote}</p>
      </div>
    </div>
  );
}

function BuddyCard({ buddy, delay, onNudge, nudged }: { buddy: Buddy; delay: number; onNudge: () => void; nudged: boolean }) {
  const { t } = useLang();
  const iconCfg = statusIcons[buddy.status];
  const statusLabel = t.buddyStatus[buddy.status];
  const canNudge = buddy.status === 'scrolling' || buddy.status === 'needs_nudge';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-[#0a0d14] text-sm"
              style={{ background: buddy.avatarColor }}
            >
              {buddy.name[0]}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#171c2a]"
              style={{ background: iconCfg.color }}
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{buddy.name}</p>
            <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: iconCfg.color }}>
              {iconCfg.icon}
              {t.buddyIsCurrently(buddy.name, statusLabel)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1 text-[#9aa4bd]">
          <Clock className="w-3.5 h-3.5 text-[#5c6680]" />
          {t.minFocused(buddy.todayFocusMin)}
        </span>
        <span className="flex items-center gap-1 text-[#9aa4bd]">
          <Flame className="w-3.5 h-3.5 text-[#fb7185]" />
          {t.dayStreak(buddy.streak)}
        </span>
      </div>

      <motion.button
        whileHover={canNudge ? { scale: 1.01 } : undefined}
        whileTap={canNudge ? { scale: 0.99 } : undefined}
        onClick={onNudge}
        disabled={!canNudge || nudged}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          nudged
            ? 'bg-[#232a3d]/40 text-[#5c6680] cursor-not-allowed'
            : canNudge
            ? 'bg-[#22d3ee]/10 text-[#22d3ee] hover:bg-[#22d3ee]/15 border border-[#22d3ee]/20'
            : 'bg-[#232a3d]/30 text-[#5c6680] cursor-not-allowed'
        }`}
      >
        <Send className="w-3.5 h-3.5" />
        {nudged ? t.pauseSent : canNudge ? t.sendPeerPause : t.allGood}
      </motion.button>
    </motion.div>
  );
}
