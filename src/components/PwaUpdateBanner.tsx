import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

export function PwaUpdateBanner() {
  const { t } = useLang();
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.button
          initial={{ y: -72, opacity: 0, scale: 0.9 }}
          animate={{ y: 0,   opacity: 1, scale: 1 }}
          exit={{    y: -72, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={() => updateServiceWorker(true)}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-amber-400 text-slate-900 font-black text-sm px-5 py-2.5 rounded-full shadow-xl shadow-amber-900/40 whitespace-nowrap"
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="inline-flex"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={14} />
          </motion.span>
          {t.pwaUpdate} · {t.pwaUpdateBtn}

          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-amber-400 opacity-30 pointer-events-none" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
