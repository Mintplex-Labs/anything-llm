// A stop or reply the server never acknowledges must not leave the controls disabled forever.
export const ACK_TIMEOUT_MS = 30_000;

/** @returns {string|null} the URL's host, or null when it is not a URL */
export function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
