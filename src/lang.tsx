import { createContext, useContext, useState, type ReactNode } from 'react';
import { dictionaries, type Dict, type Lang } from '@/i18n';

interface LangState {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangState | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  return (
    <Ctx.Provider value={{ lang, t: dictionaries[lang], setLang }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
