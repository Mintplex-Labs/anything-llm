export function formatDate(sentAt) {
  const date = new Date(sentAt * 1000);
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return timeString;
}
