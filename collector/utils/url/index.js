const RuntimeSettings = require("../runtimeSettings");
/**  ATTN: SECURITY RESEARCHERS
 * To Security researchers about to submit an SSRF report CVE - please don't.
 * We are aware that the code below is does not defend against any of the thousands of ways
 * you can map a hostname to another IP via tunneling, hosts editing, etc. The code below does not have intention of blocking this
 * and is simply to prevent the user from accidentally putting in non-valid websites, which is all this protects
 * since _all urls must be submitted by the user anyway_ and cannot be done with authentication and manager or admin roles.
 * If an attacker has those roles then the system is already vulnerable and this is not a primary concern.
 *
 * We have gotten this report may times, marked them as duplicate or information and continue to get them. We communicate
 * already that deployment (and security) of an instance is on the deployer and system admin deploying it. This would include
 * isolation, firewalls, and the general security of the instance.
 */

const VALID_PROTOCOLS = ["https:", "http:"];
const INVALID_OCTETS = [192, 172, 10, 127];
const runtimeSettings = new RuntimeSettings();

/**
 * If an ip address is passed in the user is attempting to collector some internal service running on internal/private IP.
 * This is not a security feature and simply just prevents the user from accidentally entering invalid IP addresses.
 * Can be bypassed via COLLECTOR_ALLOW_ANY_IP environment variable.
 * @param {URL} param0
 * @param {URL['hostname']} param0.hostname
 * @returns {boolean}
 */
function isInvalidIp({ hostname }) {
  if (runtimeSettings.get("allowAnyIp")) {
    if (!runtimeSettings.get("seenAnyIpWarning")) {
      console.log(
        "\x1b[33mURL IP local address restrictions have been disabled by administrator!\x1b[0m"
      );
      runtimeSettings.set("seenAnyIpWarning", true);
    }
    return false;
  }

  const IPRegex = new RegExp(
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  );

  // Not an IP address at all - passthrough
  if (!IPRegex.test(hostname)) return false;
  const [octetOne, ..._rest] = hostname.split(".");

  // If fails to validate to number - abort and return as invalid.
  if (isNaN(Number(octetOne))) return true;

  // Allow localhost loopback and 0.0.0.0 for scraping convenience
  // for locally hosted services or websites
  if (["127.0.0.1", "0.0.0.0"].includes(hostname)) return false;

  return INVALID_OCTETS.includes(Number(octetOne));
}

/**
 * Validates a URL strictly
 * - Checks the URL forms a valid URL
 * - Checks the URL is at least HTTP(S)
 * - Checks the URL is not an internal IP - can be bypassed via COLLECTOR_ALLOW_ANY_IP
 * @param {string} url
 * @returns {boolean}
 */
function validURL(url) {
  try {
    const destination = new URL(url);
    if (!VALID_PROTOCOLS.includes(destination.protocol)) return false;
    if (isInvalidIp(destination)) return false;
    return true;
  } catch {}
  return false;
}

/**
 * Modifies a URL to be valid:
 * - Checks the URL is at least HTTP(S) so that protocol exists
 * - Checks the URL forms a valid URL
 * @param {string} url
 * @returns {string}
 */
function validateURL(url) {
  try {
    let destination = url.trim();
    // If the URL has a protocol, just pass through
    // If the URL doesn't have a protocol, assume https://
    if (destination.includes("://"))
      destination = new URL(destination).toString();
    else destination = new URL(`https://${destination}`).toString();

    // If the URL ends with a slash, remove it
    return destination.endsWith("/") ? destination.slice(0, -1) : destination;
  } catch {
    if (typeof url !== "string") return "";
    return url.trim();
  }
}

/**
 * Validates a YouTube URL
 * @param {string} url
 * @returns {boolean}
 */
function isYouTubeUrl(url) {
  if (!url) {
    return false;
  }

  try {
    const urlObj = new URL(url.includes("://") ? url : `https://${url}`);
    const hostname = urlObj.hostname.replace(/^www\./, "");

    if (!["youtube.com", "youtu.be", "m.youtube.com"].includes(hostname)) {
      return false;
    }

    const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;

    // Handle youtu.be format
    if (hostname === "youtu.be") {
      const videoId = urlObj.pathname.slice(1).split("/")[0];
      return videoIdRegex.test(videoId);
    }

    // Handle youtube.com formats
    if (urlObj.pathname.startsWith("/watch")) {
      const videoId = urlObj.searchParams.get("v");
      return videoId && videoIdRegex.test(videoId);
    }

    const pathMatch = urlObj.pathname.match(
      /^\/(embed|v)\/([a-zA-Z0-9_-]{11})/
    );
    return pathMatch ? videoIdRegex.test(pathMatch[2]) : false;
  } catch {
    return false;
  }
}
module.exports = {
  validURL,
  validateURL,
  isYouTubeUrl,
};
