process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

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
  } catch (e) {
    return false;
  }
}

module.exports = {
  reqBody,
  queryParams,
  validBaseUrl,
};
