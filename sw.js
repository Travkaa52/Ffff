self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    let data = { 
        title: "Наш Уголок ❤️", 
        body: "Помни, что я тебя очень люблю! ✨" 
    };

    if (event.data) {
        try {
            // Пытаемся распарсить как JSON
            const json = event.data.json();
            data.title = json.title || data.title;
            data.body = json.body || data.body;
        } catch (e) {
            // Если пришел просто текст, используем его как тело сообщения
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: "myy.png",   // Проверь, чтобы файл лежал в корне
        badge: "myy.png",  // Маленькая иконка для строки состояния
        vibrate: [200, 100, 200], // Виброотклик
        data: {
            url: self.location.origin // Запоминаем адрес сайта
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Добавляем реакцию на клик по уведомлению
self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Закрываем уведомление

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Если сайт уже открыт — переключаемся на него
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Если закрыт — открываем заново
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
