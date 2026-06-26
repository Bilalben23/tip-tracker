import React from 'react';
import { Home, PlusCircle, CalendarDays, User } from 'lucide-react';
import type { Page } from '../types';
import { useLang } from '../contexts/LanguageContext';

interface Props {
  current: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ current, onNavigate }: Props) {
  const { t } = useLang();

  const tabs: { page: Page; icon: React.ReactNode; label: string }[] = [
    { page: 'dashboard', icon: <Home size={22} />, label: t.nav.home },
    { page: 'log',       icon: <PlusCircle size={22} />, label: t.nav.log },
    { page: 'history',   icon: <CalendarDays size={22} />, label: t.nav.history },
    { page: 'profile',   icon: <User size={22} />, label: t.nav.profile },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 flex pb-safe">
      {tabs.map(({ page, icon, label }) => {
        const active = current === page || (current === 'guide' && page === 'profile');
        return (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 transition-colors min-h-[60px] ${
              active ? 'text-amber-400' : 'text-slate-500 active:text-slate-300'
            }`}
          >
            {icon}
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
