self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'Для тебя ❤️', body: 'Новое сообщение!' };
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', // Иконка
        badge: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', // Маленький значок
        vibrate: [200, 100, 200]
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
