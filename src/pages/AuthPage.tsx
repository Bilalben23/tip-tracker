import React, { useState } from 'react';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import type { Language } from '../types';

const CURRENCIES = [
  { symbol: 'DH', label: 'MAD — درهم' },
  { symbol: '€',  label: 'EUR — €' },
  { symbol: '$',  label: 'USD — $' },
  { symbol: '£',  label: 'GBP — £' },
];

const LANGS: { code: Language; flag: string; name: string }[] = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'ar', flag: '🇲🇦', name: 'العربية' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
];

export function AuthPage() {
  const { login, register } = useAuth();
  const { t, lang, setLang } = useLang();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('DH');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = login(username.trim(), password);
    if (err) setError(t.auth.errInvalid);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError(t.auth.errMismatch); return; }
    const err = register(username.trim(), password, parseFloat(salary) || 0, currency);
    if (err) {
      if (err.includes('taken')) setError(t.auth.errTaken);
      else if (err.includes('2 char')) setError(t.auth.errUsernameShort);
      else if (err.includes('4 char')) setError(t.auth.errPasswordShort);
      else setError(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-5">
      {/* Language picker */}
      <div className="flex gap-2 mb-8">
        {LANGS.map(l => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              lang === l.code
                ? 'bg-amber-500 border-amber-500 text-slate-900'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.name}</span>
          </button>
        ))}
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-7">
        <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-amber-900/40">
          <UtensilsCrossed size={38} className="text-slate-900" />
        </div>
        <h1 className="text-white text-3xl font-black">{t.appName}</h1>
        <p className="text-slate-400 text-sm mt-1">{t.tagline}</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-slate-800">
        {/* Tabs */}
        <div className="flex rounded-2xl bg-slate-800 p-1 mb-6">
          {(['login', 'register'] as const).map(tb => (
            <button
              key={tb}
              onClick={() => { setTab(tb); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                tab === tb ? 'bg-amber-500 text-slate-900' : 'text-slate-400'
              }`}
            >
              {tb === 'login' ? t.auth.login : t.auth.register}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label={t.auth.username}>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder={t.auth.usernamePlaceholder} required
                className={inputCls}
              />
            </Field>
            <PasswordField label={t.auth.password} value={password} onChange={setPassword}
              placeholder={t.auth.passwordPlaceholder} show={showPw} toggle={() => setShowPw(!showPw)} />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className={primaryBtn}>{t.auth.login}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label={t.auth.username}>
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder={t.auth.usernamePlaceholder} required
                className={inputCls}
              />
            </Field>
            <PasswordField label={t.auth.password} value={password} onChange={setPassword}
              placeholder={t.auth.passwordPlaceholder} show={showPw} toggle={() => setShowPw(!showPw)} />
            <Field label={t.auth.confirmPassword}>
              <input
                type={showPw ? 'text' : 'password'} value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder={t.auth.confirmPasswordPlaceholder} required
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.auth.monthlySalary}>
                <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
                  placeholder="0" min="0" step="1" className={inputCls} />
              </Field>
              <Field label={t.auth.currency}>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputCls}>
                  {CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
                </select>
              </Field>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className={primaryBtn}>{t.auth.createAccount}</button>
          </form>
        )}
      </div>

      <p className="text-slate-600 text-xs mt-5">{t.dataLocal}</p>
    </div>
  );
}

const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors text-base';
const primaryBtn = 'w-full bg-amber-500 active:bg-amber-600 text-slate-900 font-black py-4 rounded-xl transition-colors text-base mt-1';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-semibold block mb-2 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, show, toggle }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; show: boolean; toggle: () => void;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} required className={inputCls + ' pr-12'} />
        <button type="button" onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 p-1">
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </Field>
  );
}
