self.addEventListener('push', function (event) {
    const data = event.data?.json() ?? {};
    event.waitUntil(
        self.registration.showNotification(data.title || "Notification", {
            body: data.body,
            icon: data.icon || "/icon.png",
            data: data.data || {},
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url || "/")
    );
});
