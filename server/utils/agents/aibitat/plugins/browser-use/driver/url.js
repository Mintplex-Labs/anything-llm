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
 *
 * Same check as the collector's validURL (collector/utils/url), and the same COLLECTOR_ALLOW_ANY_IP switch turns it off.
 */

const VALID_PROTOCOLS = ["https:", "http:"];
const INVALID_OCTETS = [192, 172, 10, 127, 169];
const IP_PATTERN =
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/i;

/**
 * An internal/private IP address typed straight into the address. Not a security feature - it only keeps the
 * agent from wandering onto internal services by accident. Bypassed with COLLECTOR_ALLOW_ANY_IP=true.
 * @param {URL} url
 * @returns {boolean}
 */
function isInvalidIp({ hostname }) {
  if (process.env.COLLECTOR_ALLOW_ANY_IP === "true") return false;
  if (!IP_PATTERN.test(hostname)) return false;
  // Allow localhost loopback and 0.0.0.0 for locally hosted services or websites.
  if (["127.0.0.1", "0.0.0.0"].includes(hostname)) return false;
  return INVALID_OCTETS.includes(Number(hostname.split(".")[0]));
}

/**
 * Whether the browser may open this address: http(s) and not a private IP.
 * @param {string} url
 * @returns {boolean}
 */
function allowedURL(url) {
  try {
    const destination = new URL(url);
    if (!VALID_PROTOCOLS.includes(destination.protocol)) return false;
    return !isInvalidIp(destination);
  } catch {
    return false;
  }
}

module.exports = { allowedURL };
