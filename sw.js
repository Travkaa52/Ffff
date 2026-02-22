const CACHE_NAME = 'love-corner-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './phrases.json',
    './myy.png'
];

// Установка: Кэшируем файлы для работы без интернета
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Работа в офлайне: Отдаем файлы из кэша
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Уведомления (твой код)
self.addEventListener('push', (event) => {
    let data = { title: "Наш Уголок ❤️", body: "Я тебя люблю! ✨" };
    if (event.data) {
        try {
            const json = event.data.json();
            data = { ...data, ...json };
        } catch (e) {
            data.body = event.data.text();
        }
    }
    const options = {
        body: data.body,
        icon: "myy.png",
        badge: "myy.png",
        vibrate: [200, 100, 200],
        data: { url: self.location.origin }
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow('/');
        })
    );
});
