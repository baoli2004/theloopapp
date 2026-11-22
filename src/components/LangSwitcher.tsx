import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLang } from '@/lang';
import { availableLangs } from '@/i18n';

export default function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = availableLangs.find((l) => l.code === lang)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#9aa4bd] hover:text-[#f1f4fb] hover:bg-[#232a3d]/50 transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 z-50 glass rounded-xl border border-[#232a3d] overflow-hidden min-w-[140px]"
          >
            {availableLangs.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                  l.code === lang ? 'text-[#22d3ee] bg-[#22d3ee]/10' : 'text-[#9aa4bd] hover:text-[#f1f4fb] hover:bg-[#232a3d]/40'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-6 text-center text-[#5c6680]">{l.flag}</span>
                  {l.label}
                </span>
                {l.code === lang && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
