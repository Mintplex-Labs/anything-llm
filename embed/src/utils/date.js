export function formatDate(sentAt) {
  const date = new Date(sentAt * 1000);
  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return timeString;
}
