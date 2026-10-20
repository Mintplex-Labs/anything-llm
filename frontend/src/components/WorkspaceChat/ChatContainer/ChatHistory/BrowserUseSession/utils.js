// A stop or reply the server never acknowledges must not leave the controls disabled forever.
export const ACK_TIMEOUT_MS = 30_000;

/** "950" / "8.1k" / "81k" */
export function formatTokens(count = 0) {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(count < 10_000 ? 1 : 0)}k`;
}

/** @returns {string|null} the URL's host, or null when it is not a URL */
export function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
