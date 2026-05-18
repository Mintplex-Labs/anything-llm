process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();
const DEFAULT_COLLECTOR_PORT = 8888;

function reqBody(request) {
  return typeof request.body === "string"
    ? JSON.parse(request.body)
    : request.body;
}

function queryParams(request) {
  return request.query;
}

/**
 * Validates if the provided baseUrl is a valid URL at all.
 * - Does not validate if the URL is reachable or accessible.
 * - Does not do any further validation of the URL like `validURL` in `utils/url/index.js`
 * @param {string} baseUrl
 * @returns {boolean}
 */
function validBaseUrl(baseUrl) {
  try {
    new URL(baseUrl);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the collector port from the environment variables.
 * If the port is not set, it will fall back to the default port.
 * If the port is invalid, it will log a warning and return the default port.
 * @returns {number}
 */
function getCollectorPort() {
  if (!("COLLECTOR_PORT" in process.env)) return DEFAULT_COLLECTOR_PORT;
  const port = Number(process.env.COLLECTOR_PORT);
  if (Number.isInteger(port) && port > 0 && port <= 65535) return port;

  console.warn(
    `Invalid COLLECTOR_PORT "${process.env.COLLECTOR_PORT}". Falling back to ${DEFAULT_COLLECTOR_PORT}.`
  );
  return DEFAULT_COLLECTOR_PORT;
}

module.exports = {
  reqBody,
  queryParams,
  validBaseUrl,
  getCollectorPort,
};
