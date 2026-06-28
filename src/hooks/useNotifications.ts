import { useEffect } from 'react';
import { useLang } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { entriesLib } from '../lib/entries';
import { idbSet, idbGet } from '../lib/idb';

const THROTTLE_MS = 20 * 60 * 60 * 1000; // don't re-notify within 20 h

export function useNotifications() {
  const { lang, t } = useLang();
  const { user } = useAuth();

  // Keep IDB lang in sync so the SW uses the right language
  useEffect(() => {
    idbSet('lang', lang).catch(() => {});
  }, [lang]);

  useEffect(() => {
    if (!user) return;
    void setup(user.id, t);
  }, [user, t]);
}

async function setup(
  userId: string,
  t: { appName: string; notification?: { title: string; body: string } }
) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

  // Request permission (only prompts if still 'default')
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }
  if (Notification.permission !== 'granted') return;

  // Sync current last-entry date into IDB so the SW can read it
  const entries = entriesLib.getAll(userId);
  if (entries.length) {
    const lastDate = entries.map(e => e.date).sort().at(-1)!;
    await idbSet('lastEntryDate', lastDate);
  }

  // Register Periodic Background Sync (Android Chrome only)
  const sw = await navigator.serviceWorker.ready;
  if ('periodicSync' in sw) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sw as any).periodicSync.register('tip-reminder', {
        minInterval: 24 * 60 * 60 * 1000,
      });
    } catch {
      // Browser denied periodicSync — on-open check below is the fallback
    }
  }

  // On-open fallback check (works on all platforms including iOS)
  const lastDate = await idbGet('lastEntryDate');
  if (!lastDate) return; // never logged anything — don't nag

  // Already logged today → nothing to do
  const today = new Date().toISOString().slice(0, 10);
  if (lastDate >= today) return;

  const lastNotified = await idbGet('lastNotified');
  if (lastNotified && Date.now() - parseInt(lastNotified) < THROTTLE_MS) return;

  await sw.showNotification(t.appName, {
    body: buildBody(await idbGet('lang') ?? 'en'),
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    tag: 'tip-reminder',
  });
  await idbSet('lastNotified', String(Date.now()));
}

function buildBody(lang: string): string {
  if (lang === 'fr') return "N'oublie pas de saisir tes pourboires du jour ! 💰";
  if (lang === 'ar') return 'لا تنسَ تسجيل بقشيش اليوم! 💰';
  return "Don't forget to log today's tips! 💰";
}
