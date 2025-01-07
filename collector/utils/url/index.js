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

/**
 * If an ip address is passed in the user is attempting to collector some internal service running on internal/private IP.
 * This is not a security feature and simply just prevents the user from accidentally entering invalid IP addresses.
 * @param {URL} param0
 * @param {URL['hostname']} param0.hostname
 * @returns {boolean}
 */
function isInvalidIp({ hostname }) {
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

function validURL(url) {
  try {
    const destination = new URL(url);
    if (!VALID_PROTOCOLS.includes(destination.protocol)) return false;
    if (isInvalidIp(destination)) return false;
    return true;
  } catch {}
  return false;
}

module.exports = {
  validURL,
};
