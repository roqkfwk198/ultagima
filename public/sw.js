/**
 * 얼타지마 Service Worker
 * - 부재 알림 스케줄링 (2h / 5h / 7h)
 * - 알림 클릭 시 앱 포커스
 */

const notificationTimers = [];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/** 메인 앱에서 SCHEDULE_NOTIFICATIONS 메시지를 받아 타이머 등록 */
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    // 기존 타이머 초기화
    notificationTimers.forEach((id) => clearTimeout(id));
    notificationTimers.length = 0;

    const { notifications } = event.data;
    notifications.forEach(({ delay, title, body, icon, tag }) => {
      const id = setTimeout(() => {
        self.registration.showNotification(title, {
          body,
          icon,
          badge: '/icons/stage0.png',
          tag: tag || `ultagima-${delay}`,
          requireInteraction: true,
          vibrate: [200, 100, 200],
          data: { url: '/' },
        });
      }, delay);
      notificationTimers.push(id);
    });

    console.log('[SW] Notifications scheduled:', notifications.length);
  }

  if (event.data.type === 'CANCEL_NOTIFICATIONS') {
    notificationTimers.forEach((id) => clearTimeout(id));
    notificationTimers.length = 0;
    console.log('[SW] Notifications cancelled');
  }
});

/** 알림 클릭 → 앱 포커스 또는 열기 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow('/');
      })
  );
});
