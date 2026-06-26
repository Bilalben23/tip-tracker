import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LogDayPage } from './pages/LogDayPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { GuidePage } from './pages/GuidePage';
import { BottomNav } from './components/BottomNav';
import type { Page } from './types';

function AppContent() {
  const { user } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');
  const [logDate, setLogDate] = useState<string | undefined>();

  if (!user) return <AuthPage />;

  const navigate = (to: Page, date?: string) => {
    setPage(to);
    setLogDate(to === 'log' ? date : undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-md mx-auto relative min-h-screen">
      {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
      {page === 'log'       && <LogDayPage initialDate={logDate} key={logDate ?? 'today'} />}
      {page === 'history'   && <HistoryPage onNavigate={navigate} />}
      {page === 'profile'   && <ProfilePage onNavigate={navigate} />}
      {page === 'guide'     && <GuidePage onBack={() => navigate('profile')} />}
      {page !== 'guide' && <BottomNav current={page} onNavigate={p => navigate(p)} />}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
