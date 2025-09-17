/**
 * Normalizes a base URL by removing trailing slashes for consistent URL construction
 * @param {string|null} baseUrl - The base URL to normalize
 * @returns {string|null} - The normalized base URL without trailing slash
 */
function normalizeBaseUrl(baseUrl) {
  if (!baseUrl) return null;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

module.exports = {
  normalizeBaseUrl,
};
