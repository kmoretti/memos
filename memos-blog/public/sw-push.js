// Custom push event handler for @nuxtjs/pwa service worker
// This file extends the generated sw.js

self.addEventListener('push', function (event) {
  if (!event.data) return

  try {
    const data = event.data.json()

    const options = {
      body: data.body || '新动态',
      icon: data.icon || '/icon.png',
      badge: data.badge || '/icon.png',
      tag: 'memos-notification',
      renotify: true,
      data: { url: data.url || '/' },
    }

    event.waitUntil(
      self.registration.showNotification(data.title || '克喵的朋友圈', options)
    )
  } catch (e) {
    console.error('Push event handler error:', e)
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Focus existing window if possible
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
