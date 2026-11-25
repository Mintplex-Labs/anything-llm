function parseEventData(event) {
    try {
      return event.data.json();
    } catch (e) {
      console.error('Failed to parse event data - is payload valid? .text():\n', event.data.text());
      return null
    }
  }
  
  self.addEventListener('push', function (event) {
    const payload = parseEventData(event);
    if (!payload) return;
  
    // options: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#options
    self.registration.showNotification(payload.title || 'AnythingLLM', {
      ...payload,
      icon: '/favicon.png',
    });
  });
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const { onClickUrl = null } = event.notification.data || {};
    if (!onClickUrl) return;
    event.waitUntil(clients.openWindow(onClickUrl));
  });