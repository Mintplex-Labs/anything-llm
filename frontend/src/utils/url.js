/**
 * Reduces a URL to just its origin (eg: "http://localhost:13305/live" →
 * "http://localhost:13305"). Useful as a normalizeBasePath callback for
 * useProviderEndpointAutoDiscovery where the auto-detected endpoint includes a
 * trailing path segment.
 *
 * Only run on blur — running this on each keystroke makes the input impossible
 * to type into.
 * @param {string} basePath
 * @returns {string}
 */
export function originOnly(basePath = "") {
  try {
    const url = new URL(basePath);
    if (!["http:", "https:"].includes(url.protocol)) return basePath;
    return url.origin;
  } catch {
    return basePath;
  }
}
