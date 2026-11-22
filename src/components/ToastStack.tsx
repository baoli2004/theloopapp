import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '@/store';

export default function ToastStack() {
  const { toasts, dismissToast } = useApp();

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />,
    info: <Info className="w-4 h-4 text-[#22d3ee]" />,
    warn: <AlertCircle className="w-4 h-4 text-[#22d3ee]" />,
  };

  const borders = {
    success: 'border-[#4ade80]/30',
    info: 'border-[#22d3ee]/30',
    warn: 'border-[#22d3ee]/30',
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 items-end max-w-xs">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`glass rounded-xl px-4 py-3 border ${borders[t.variant]} flex items-center gap-2.5 shadow-lg`}
          >
            {icons[t.variant]}
            <span className="text-sm text-[#f1f4fb] flex-1">{t.text}</span>
            <button onClick={() => dismissToast(t.id)} className="text-[#5c6680] hover:text-[#9aa4bd]">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
