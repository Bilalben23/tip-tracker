import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

export function PwaUpdateBanner() {
  const { t } = useLang();
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 bg-amber-500 rounded-2xl px-4 py-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-4">
      <p className="text-slate-900 text-sm font-semibold leading-tight">
        {t.pwaUpdate}
      </p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="flex items-center gap-1.5 bg-slate-900 text-amber-400 text-xs font-black px-3 py-2 rounded-xl shrink-0 active:opacity-80 transition-opacity"
      >
        <RefreshCw size={13} />
        {t.pwaUpdateBtn}
      </button>
    </div>
  );
}
