import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '../contexts/LanguageContext';

interface Props { onBack: () => void }

export function GuidePage({ onBack }: Props) {
  const { t, isRTL } = useLang();

  const BackIcon = isRTL ? <ArrowRight size={22} /> : <ArrowLeft size={22} />;

  return (
    <div className="min-h-screen bg-slate-950 pb-10">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-5 pt-14 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 active:bg-slate-700 transition-colors shrink-0">
            {BackIcon}
          </button>
          <div>
            <h1 className="text-white text-xl font-black">{t.guide.title}</h1>
            <p className="text-slate-400 text-sm">{t.guide.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Hero card */}
        <div className="bg-linear-to-br from-amber-600 via-amber-700 to-orange-900 rounded-3xl p-6 text-center">
          <div className="text-5xl mb-3">🍽️</div>
          <h2 className="text-white text-xl font-black">{t.appName}</h2>
          <p className="text-amber-200 text-sm mt-1">{t.tagline}</p>
        </div>

        {/* Steps */}
        {t.guide.steps.map((step, i) => (
          <div key={i} className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shrink-0">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-white font-bold text-base leading-tight">{step.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Footer tip */}
        <div className="bg-sky-900/20 border border-sky-800/30 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl shrink-0">💡</span>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.dataLocal}
          </p>
        </div>

        <button onClick={onBack}
          className="w-full py-4 bg-amber-500 active:bg-amber-600 text-slate-900 font-black rounded-2xl text-base transition-colors">
          {t.guide.back}
        </button>
      </div>
    </div>
  );
}
