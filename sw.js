self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: "Привет!", body: "Новое сообщение для тебя ❤️" };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "myy.png",
            badge: "myy.png"
        })
    );
});
