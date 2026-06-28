/// <reference lib="WebWorker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ── Types for Periodic Background Sync (not yet in TS stdlib) ────────────────
interface PeriodicSyncEvent extends ExtendableEvent {
  tag: string;
}

// ── Notification click → open / focus the app ─────────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        const existing = clients.find(c => c.url.startsWith(self.location.origin));
        if (existing) return existing.focus();
        return self.clients.openWindow('/');
      })
  );
});

// ── Periodic Background Sync (Android Chrome) ─────────────────────────────
self.addEventListener('periodicsync', (event: Event) => {
  const e = event as PeriodicSyncEvent;
  if (e.tag === 'tip-reminder') {
    e.waitUntil(checkAndNotify());
  }
});

// ── Check IDB and fire notification if 3+ days without an entry ──────────
async function checkAndNotify() {
  const db = await openDB();
  const lastDate = await getMeta(db, 'lastEntryDate');
  if (!lastDate) return; // never logged anything — don't nag

  // Already logged today → nothing to do
  const today = new Date().toISOString().slice(0, 10);
  if (lastDate >= today) return;

  // Don't send more than once per 20 hours
  const lastNotified = await getMeta(db, 'lastNotified');
  if (lastNotified && Date.now() - parseInt(lastNotified) < 72_000_000) return;

  const lang = (await getMeta(db, 'lang')) ?? 'en';

  const messages: Record<string, { title: string; body: string }> = {
    en: { title: 'TipTracker', body: "Don't forget to log today's tips! 💰" },
    fr: { title: 'TipTracker', body: "N'oublie pas de saisir tes pourboires du jour ! 💰" },
    ar: { title: 'TipTracker', body: 'لا تنسَ تسجيل بقشيش اليوم! 💰' },
  };
  const msg = messages[lang] ?? messages['en'];

  await self.registration.showNotification(msg.title, {
    body: msg.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    tag: 'tip-reminder',
  } as NotificationOptions);

  await setMeta(db, 'lastNotified', String(Date.now()));
}

// ── Minimal IDB helpers (duplicated here; SW can't import from /src/lib) ──
const DB_NAME = 'tiptracker-meta';
const STORE   = 'meta';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function getMeta(db: IDBDatabase, key: string): Promise<string | null> {
  return new Promise(resolve => {
    const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror   = () => resolve(null);
  });
}

function setMeta(db: IDBDatabase, key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}
