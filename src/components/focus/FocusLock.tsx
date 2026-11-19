import { useState } from 'react';
import { AlertTriangle, RotateCw } from 'lucide-react';
import { useFocusT } from '@/focusI18n';
import { useApp } from '@/store';
import FocusSetup from '@/components/focus/FocusSetup';
import FocusActive from '@/components/focus/FocusActive';
import FocusResult from '@/components/focus/FocusResult';
import FocusHistory from '@/components/focus/FocusHistory';
import { createActiveSession, type NewFocusInput } from '@/focusSession';
import {
  appendFocusRecord,
  clearActiveFocus,
  loadActiveFocus,
  loadFocusHistory,
  saveActiveFocus,
  setFocusFeeling,
} from '@/focusStorage';
import type { ActiveFocusSession, FocusFeeling, FocusSessionRecord } from '@/types';

type View = 'setup' | 'history';

interface FocusState {
  active: ActiveFocusSession | null;
  history: FocusSessionRecord[];
  error: boolean;
}

function readStoredState(): FocusState {
  try {
    return { active: loadActiveFocus(), history: loadFocusHistory(), error: false };
  } catch {
    return { active: null, history: [], error: true };
  }
}

function tryWrite(write: () => void, onFail: () => void) {
  try {
    write();
  } catch {
    onFail();
  }
}

export default function FocusLock() {
  const f = useFocusT();
  const { refreshStats } = useApp();
  const [state, setState] = useState<FocusState>(readStoredState);
  const [view, setView] = useState<View>('setup');
  const [result, setResult] = useState<FocusSessionRecord | null>(null);

  const markStorageError = () => setState((s) => ({ ...s, error: true }));

  const handleStart = (input: NewFocusInput) => {
    const session = createActiveSession(input, Date.now());
    tryWrite(() => saveActiveFocus(session), markStorageError);
    setResult(null);
    setState((s) => ({ ...s, active: session }));
  };

  const handleUpdate = (session: ActiveFocusSession) => {
    tryWrite(() => saveActiveFocus(session), markStorageError);
    setState((s) => ({ ...s, active: session }));
  };

  const handleFinish = (record: FocusSessionRecord) => {
    let saveFailed = false;
    try {
      const history = appendFocusRecord(record);
      setState((s) => ({ ...s, history }));
    } catch {
      saveFailed = true;
    }
    tryWrite(clearActiveFocus, () => {
      saveFailed = true;
    });
    setState((s) => ({ ...s, active: null, error: s.error || saveFailed }));
    setResult(record);
    refreshStats();
  };

  const handleFeeling = (feeling: FocusFeeling) => {
    if (!result) return;
    tryWrite(() => {
      const history = setFocusFeeling(result.id, feeling);
      setState((s) => ({ ...s, history }));
    }, markStorageError);
    setResult({ ...result, feeling });
    refreshStats();
  };

  const handleDone = () => {
    setResult(null);
    setView('setup');
  };

  const retry = () => setState(readStoredState());

  const showingLive = !result && !state.active;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display">{f.pageTitle}</h2>
        <p className="text-sm text-[#9aa4bd] mt-1.5 leading-relaxed max-w-2xl">{f.pageSubtitle}</p>
      </div>

      {state.error && (
        <div role="alert" className="flex items-start gap-3 px-4 py-3 rounded-xl border border-[#fb7185]/30 bg-[#fb7185]/10">
          <AlertTriangle className="w-4 h-4 text-[#fb7185] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#fecdd3] leading-relaxed flex-1">{f.storageError}</p>
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fb7185]/15 text-[#fb7185] text-xs font-semibold hover:bg-[#fb7185]/25 transition-colors flex-shrink-0"
          >
            <RotateCw className="w-3.5 h-3.5" /> {f.retry}
          </button>
        </div>
      )}

      {showingLive && (
        <div className="inline-flex p-1 rounded-xl bg-[#11151f] border border-[#232a3d]/50">
          <ViewTab active={view === 'setup'} onClick={() => setView('setup')}>{f.viewNew}</ViewTab>
          <ViewTab active={view === 'history'} onClick={() => setView('history')}>{f.viewHistory}</ViewTab>
        </div>
      )}

      {result ? (
        <FocusResult record={result} onFeeling={handleFeeling} onDone={handleDone} />
      ) : state.active ? (
        <FocusActive key={state.active.id} session={state.active} onUpdate={handleUpdate} onFinish={handleFinish} />
      ) : view === 'history' ? (
        <FocusHistory records={state.history} />
      ) : (
        <FocusSetup onStart={handleStart} />
      )}

      <p className="text-[11px] text-[#5c6680] leading-relaxed">{f.localNote}</p>
    </div>
  );
}

function ViewTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        active ? 'bg-[#232a3d]/80 text-[#f1f4fb]' : 'text-[#5c6680] hover:text-[#9aa4bd]'
      }`}
    >
      {children}
    </button>
  );
}
