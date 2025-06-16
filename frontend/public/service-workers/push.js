function parseEventData(event) {
  try {
    return event.data.json();
  } catch (e) {
    console.error('Failed to parse event data - is payload valid? .text():\n', event.data.text());
    return null
  }
}

self.addEventListener('push', function (event) {
  const data = parseEventData(event);
  if (!data) return;
  self.registration.showNotification(data.title || 'AnythingLLM', {
    body: data.message,
    icon: '/favicon.png',
    ...data,
  });
});