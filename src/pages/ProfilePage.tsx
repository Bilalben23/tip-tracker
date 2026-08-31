import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, DollarSign, Lock, LogOut,
  TrendingUp, CheckCircle2, Coins, Edit3, Save, X, BookOpen, ChevronRight,
  Download, Upload, Database, AlertTriangle, Smile,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useLang } from '../contexts/LanguageContext';
import { entriesLib } from '../lib/entries';
import { bonusesLib } from '../lib/bonuses';
import { storage } from '../lib/storage';
import type { DayEntry, Language, MonthlyBonus, Page } from '../types';

const EMOJIS = [
  '😎','🤩','🥳','🤑','😏','😜','🧐','🤓','😇','🥰','😤','🤣',
  '👑','⭐','🔥','💪','✨','💫','💰','💸','🏆','🎯','🎪','🦸',
  '👨‍🍳','👩‍🍳','🧑‍🍳','🍕','🍷','☕','🍔','🍣','🥗','🍝','🎂','🧆',
  '🦁','🐯','🦊','🦝','🐺','🦅','🐬','🦋','🌟','🌈','🍀','🌺',
];

interface BackupFile {
  version: number;
  exportedAt: string;
  username: string;
  entries: DayEntry[];
  bonuses: MonthlyBonus[];
}

const CURRENCIES = [
  { symbol: 'DH', label: 'MAD — درهم' },
  { symbol: '€', label: 'EUR — €' },
  { symbol: '$', label: 'USD — $' },
  { symbol: '£', label: 'GBP — £' },
];

const LANGS: { code: Language; flag: string; name: string }[] = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'ar', flag: '🇲🇦', name: 'العربية' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
];

interface Props { onNavigate: (page: Page) => void }

export function ProfilePage({ onNavigate }: Props) {
  const { user, logout, updateUser } = useAuth();
  const { t, lang, setLang } = useLang();

  const [editingSalary, setEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState('');
  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(false);

  const [pickingAvatar, setPickingAvatar] = useState(false);

  // Backup / Restore
  const fileRef = useRef<HTMLInputElement>(null);
  const [restorePhase, setRestorePhase] = useState<'idle' | 'confirm' | 'done' | 'error'>('idle');
  const [restoreMsg, setRestoreMsg] = useState('');
  const [pending, setPending] = useState<BackupFile | null>(null);

  if (!user) return null;

  const allEntries = entriesLib.getAll(user.id);
  const worked = allEntries.filter(e => e.worked);
  const allTips = worked.reduce((s, e) => s + e.tips, 0);
  const allBonus = bonusesLib.getAll(user.id).reduce((s, b) => s + b.amount, 0);
  const avgTips = worked.length > 0 ? allTips / worked.length : 0;
  const cur = user.currency;
  const initials = user.username.slice(0, 2).toUpperCase();

  const saveSalary = () => {
    updateUser({ salary: parseFloat(salaryInput) || 0 });
    setEditingSalary(false);
  };

  const exportBackup = () => {
    const data: BackupFile = {
      version: 1,
      exportedAt: new Date().toISOString(),
      username: user.username,
      entries: entriesLib.getAll(user.id),
      bonuses: bonusesLib.getAll(user.id),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `tiptracker-${user.username}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as BackupFile;
        if (!data.version || !Array.isArray(data.entries) || !Array.isArray(data.bonuses)) {
          setRestoreMsg(t.profile.backupErrFormat);
          setRestorePhase('error');
          return;
        }
        if (data.username !== user.username) {
          setRestoreMsg(t.profile.backupErrUser.replace('{u}', data.username));
          setRestorePhase('error');
          return;
        }
        setPending(data);
        setRestorePhase('confirm');
      } catch {
        setRestoreMsg(t.profile.backupErrFormat);
        setRestorePhase('error');
      }
    };
    reader.readAsText(file);
  };

  const confirmRestore = () => {
    if (!pending) return;
    storage.saveEntries(user.id, pending.entries);
    storage.saveBonuses(user.id, pending.bonuses);
    setPending(null);
    setRestoreMsg(t.profile.backupRestored
      .replace('{e}', String(pending.entries.length))
      .replace('{b}', String(pending.bonuses.length)));
    setRestorePhase('done');
    setTimeout(() => setRestorePhase('idle'), 4000);
  };

  const savePassword = () => {
    setPwError('');
    if (oldPw !== user.password) { setPwError(t.profile.wrongPassword); return; }
    if (newPw.length < 4) { setPwError(t.auth.errPasswordShort); return; }
    updateUser({ password: newPw });
    setEditingPassword(false); setOldPw(''); setNewPw('');
    setPwSuccess(true);
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28">
      <div className="bg-slate-900 border-b border-slate-800 px-5 pt-14 pb-5">
        <h1 className="text-white text-xl font-black">{t.profile.title}</h1>
        <p className="text-slate-400 text-sm mt-0.5">{t.profile.subtitle}</p>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {/* Avatar */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
          <div className="flex items-center gap-4">
            {/* Tappable avatar */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setPickingAvatar(p => !p)}
              className="relative shrink-0 group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0 transition-colors ${
                user.avatar
                  ? 'bg-slate-800 text-4xl'
                  : 'bg-linear-to-br from-amber-500 to-orange-600 text-slate-900 text-xl font-black shadow-amber-900/30'
              }`}>
                {user.avatar ?? initials}
              </div>
              {/* Edit hint */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                <Smile size={11} className="text-amber-400" />
              </div>
            </motion.button>

            <div>
              <h2 className="text-white text-xl font-black">{user.username}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{t.profile.worker}</p>
              <button
                onClick={() => setPickingAvatar(p => !p)}
                className="text-amber-400 text-xs font-semibold mt-1 active:opacity-70"
              >
                {pickingAvatar ? '✕ ' : '✏ '}{t.profile.avatarPick}
              </button>
            </div>
          </div>

          {/* Emoji grid */}
          <AnimatePresence>
            {pickingAvatar && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-8 gap-1.5">
                  {EMOJIS.map(e => (
                    <motion.button
                      key={e}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => { updateUser({ avatar: e }); setPickingAvatar(false); }}
                      className={`text-2xl aspect-square flex items-center justify-center rounded-xl transition-colors ${
                        user.avatar === e
                          ? 'bg-amber-500/25 ring-2 ring-amber-500'
                          : 'bg-slate-800 active:bg-slate-700'
                      }`}
                    >
                      {e}
                    </motion.button>
                  ))}
                  {/* Remove / reset to initials */}
                  {user.avatar && (
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => { updateUser({ avatar: undefined }); setPickingAvatar(false); }}
                      className="text-xs aspect-square flex items-center justify-center rounded-xl bg-slate-800 text-slate-500 active:bg-slate-700 col-span-1"
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* All-time stats */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-amber-400" />
            <p className="text-slate-300 text-sm font-semibold">{t.profile.allTimeStats}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <StatCard label={t.profile.totalTips} value={`${cur} ${allTips.toFixed(2)}`} color="text-amber-400"
              icon={<Coins size={13} className="text-amber-400" />} />
            <StatCard label={t.profile.daysWorked} value={worked.length.toString()} color="text-emerald-400"
              icon={<CheckCircle2 size={13} className="text-emerald-400" />} />
            <StatCard label={t.profile.avgTips} value={`${cur} ${avgTips.toFixed(2)}`} color="text-sky-400"
              icon={<TrendingUp size={13} className="text-sky-400" />} />
            <StatCard label={t.profile.totalBonus} value={`${cur} ${allBonus.toFixed(2)}`} color="text-purple-400"
              icon={<DollarSign size={13} className="text-purple-400" />} />
          </div>
        </div>

        {/* Language */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <p className="text-slate-300 text-sm font-semibold mb-3">{t.profile.languageLabel}</p>
          <div className="flex gap-2">
            {LANGS.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${lang === l.code ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-400'
                  }`}>
                <span className="text-xl">{l.flag}</span>
                <span className="text-xs">{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Salary */}
        <Setting label={t.profile.salaryLabel} icon={<Briefcase size={15} className="text-blue-400" />}
          onEdit={() => { setSalaryInput(user.salary.toString()); setEditingSalary(true); }}
          editing={editingSalary}>
          {editingSalary ? (
            <div className="mt-3 space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">{cur}</span>
                <input type="number" value={salaryInput} onChange={e => setSalaryInput(e.target.value)}
                  min="0" step="1" autoFocus
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white font-bold focus:outline-none focus:border-amber-500" />
              </div>
              <ActionRow onCancel={() => setEditingSalary(false)} onSave={saveSalary} t={t} />
            </div>
          ) : (
            <p className="text-blue-400 text-2xl font-black mt-1">
              {cur} {user.salary.toFixed(2)} <span className="text-blue-400/60 text-sm font-bold">{t.summary.perDay}</span>
            </p>
          )}
        </Setting>

        {/* Currency */}
        <Setting label={t.profile.currencyLabel} icon={<DollarSign size={15} className="text-amber-400" />}
          onEdit={() => setEditingCurrency(true)} editing={editingCurrency}>
          {editingCurrency ? (
            <div className="mt-3 space-y-2">
              {CURRENCIES.map(c => (
                <button key={c.symbol} onClick={() => { updateUser({ currency: c.symbol }); setEditingCurrency(false); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${user.currency === c.symbol ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-300'
                    }`}>
                  <span className="font-semibold">{c.label}</span>
                  {user.currency === c.symbol && <CheckCircle2 size={16} className="text-amber-400" />}
                </button>
              ))}
              <button onClick={() => setEditingCurrency(false)}
                className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold">
                {t.profile.cancel}
              </button>
            </div>
          ) : (
            <p className="text-amber-400 text-2xl font-black mt-1">{user.currency}</p>
          )}
        </Setting>

        {/* Password */}
        <Setting label={t.profile.changePassword} icon={<Lock size={15} className="text-slate-400" />}
          onEdit={() => setEditingPassword(true)} editing={editingPassword}>
          {editingPassword ? (
            <div className="mt-3 space-y-3">
              <input type="password" value={oldPw} onChange={e => setOldPw(e.target.value)}
                placeholder={t.profile.currentPassword}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder={t.profile.newPassword}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500" />
              {pwError && <p className="text-red-400 text-sm">{pwError}</p>}
              <ActionRow onCancel={() => { setEditingPassword(false); setOldPw(''); setNewPw(''); setPwError(''); }}
                onSave={savePassword} saveLabel={t.profile.update} t={t} />
            </div>
          ) : (
            <p className="text-slate-500 text-sm mt-1">{pwSuccess ? <span className="text-emerald-400">{t.profile.passwordUpdated}</span> : '••••••••'}</p>
          )}
        </Setting>

        {/* Guide */}
        <button onClick={() => onNavigate('guide')}
          className="w-full flex items-center gap-3 bg-slate-900 rounded-2xl border border-slate-800 px-5 py-4 active:border-slate-600 transition-colors">
          <div className="w-10 h-10 rounded-full bg-sky-900/40 flex items-center justify-center text-sky-400 shrink-0">
            <BookOpen size={18} />
          </div>
          <span className="text-white font-semibold text-sm">{t.profile.guideBtn}</span>
          <ChevronRight_ isRTL={false} />
        </button>

        {/* Backup & Restore */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Database size={15} className="text-sky-400" />
            <p className="text-slate-300 text-sm font-semibold">{t.profile.backupTitle}</p>
          </div>
          <p className="text-slate-500 text-xs mb-3">{t.profile.backupSubtitle}</p>

          <div className="flex gap-2">
            <button
              onClick={exportBackup}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-sky-600/20 border border-sky-600/40 text-sky-400 rounded-xl text-sm font-bold active:bg-sky-600/30 transition-colors"
            >
              <Download size={14} /> {t.profile.backupExport}
            </button>
            <button
              onClick={() => { setRestorePhase('idle'); fileRef.current?.click(); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-sm font-bold active:bg-slate-700 transition-colors"
            >
              <Upload size={14} /> {t.profile.backupImport}
            </button>
          </div>

          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileSelect} />

          {/* Confirm */}
          {restorePhase === 'confirm' && (
            <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-amber-300 text-xs font-semibold leading-snug">
                  {t.profile.backupConfirm
                    .replace('{e}', String(pending?.entries.length ?? 0))
                    .replace('{b}', String(pending?.bonuses.length ?? 0))}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRestorePhase('idle')}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold">
                  {t.profile.cancel}
                </button>
                <button onClick={confirmRestore}
                  className="flex-1 py-2 bg-amber-500 text-slate-900 rounded-lg text-xs font-black">
                  {t.profile.backupConfirmBtn}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {restorePhase === 'done' && (
            <p className="mt-2 text-emerald-400 text-xs font-semibold">✓ {restoreMsg}</p>
          )}

          {/* Error */}
          {restorePhase === 'error' && (
            <p className="mt-2 text-red-400 text-xs font-semibold">⚠ {restoreMsg}</p>
          )}
        </div>

        {/* Account info */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
          <p className="text-slate-300 text-sm font-semibold mb-2">{t.profile.accountLabel}</p>
          <p className="text-slate-500 text-sm">
            {t.profile.memberSince} {new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}
          </p>
          <p className="text-slate-600 text-xs mt-1">{t.dataLocal}</p>
        </div>

        {/* Logout */}
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 border border-red-900/50 active:bg-red-900/20 text-red-400 rounded-2xl font-bold transition-colors">
          <LogOut size={18} /> {t.profile.logout}
        </button>
      </div>
    </div>
  );
}

function ChevronRight_({ isRTL }: { isRTL: boolean }) {
  return <span className={`ml-auto text-slate-600 ${isRTL ? 'rotate-180' : ''}`}><ChevronRight size={18} /></span>;
}

function Setting({ label, icon, onEdit, editing, children }: {
  label: string; icon: React.ReactNode; onEdit: () => void; editing: boolean; children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-slate-300 text-sm font-semibold">{label}</p>
        </div>
        {!editing && (
          <button onClick={onEdit} className="text-slate-500 hover:text-amber-400 active:text-amber-300 p-1 transition-colors">
            <Edit3 size={17} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ActionRow({ onCancel, onSave, saveLabel, t }: {
  onCancel: () => void; onSave: () => void; saveLabel?: string;
  t: ReturnType<typeof useLang>['t'];
}) {
  return (
    <div className="flex gap-2">
      <button onClick={onCancel}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold">
        <X size={15} /> {t.profile.cancel}
      </button>
      <button onClick={onSave}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-amber-500 text-slate-900 rounded-xl text-sm font-black">
        <Save size={15} /> {saveLabel ?? t.profile.save}
      </button>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-800 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">{icon}<p className="text-slate-400 text-xs">{label}</p></div>
      <p className={`${color} font-black text-lg`}>{value}</p>
    </div>
  );
}
