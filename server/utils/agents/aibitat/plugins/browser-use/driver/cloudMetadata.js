/**
 * Cloud instance metadata services. They hand out the server's own cloud credentials to any request
 * from the machine, with no sign-in - so the browser never reaches them, even though it may open any
 * other address (see the note in session.js). A page that tells the agent to "open
 * http://169.254.169.254/..." gets an error, not the keys.
 *
 * Covered: AWS (incl. ECS/EKS task metadata and IPv6), GCP, Azure, Oracle, DigitalOcean, Hetzner,
 * Linode, Vultr, OpenStack, Alibaba, Tencent and Huawei clouds, and Kubernetes nodes on them. They
 * all live in IPv4 link-local space (169.254.0.0/16), at Alibaba's 100.100.100.200, at AWS's
 * fd00:ec2::254, or behind a well-known hostname.
 */

const METADATA_HOSTS = [
  "metadata.google.internal",
  "metadata.goog",
  "metadata",
  "instance-data",
  "instance-data.ec2.internal",
  "metadata.tencentyun.com",
  "metadata.platformequinix.com",
];
const METADATA_IPV4 = ["100.100.100.200"];
const METADATA_IPV6 = ["fd00:ec2::254"];

/**
 * Request interception patterns for every page and frame (CDP Fetch.enable). Chromium matches them
 * against the canonical URL, so "http://2852039166/" and "http://0xa9fea9fe/" are caught as
 * 169.254.169.254. A paused request is checked again with isCloudMetadataUrl before it is failed.
 */
const BLOCKED_URL_PATTERNS = [
  "*://169.254.*",
  "*://[::ffff:a9fe:*",
  "*://[fe80:*",
  "*://[fd00:ec2::254]*",
  ...METADATA_IPV4.map((ip) => `*://${ip}*`),
  ...METADATA_HOSTS.flatMap((host) => [`*://${host}/*`, `*://${host}:*`]),
];

/** @returns {boolean} whether the URL points at a cloud metadata service */
function isCloudMetadataUrl(url) {
  let host;
  try {
    host = new URL(String(url)).hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return false;
  }
  if (METADATA_HOSTS.includes(host)) return true;
  return isCloudMetadataIp(host.replace(/^\[|\]$/g, ""));
}

/**
 * @param {string} ip - as CDP reports a response's remoteIPAddress, or a URL's hostname
 * @returns {boolean} whether the address belongs to a cloud metadata service
 */
function isCloudMetadataIp(ip) {
  const address = String(ip || "")
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  if (/^169\.254\.\d+\.\d+$/.test(address)) return true;
  if (METADATA_IPV4.includes(address)) return true;
  if (METADATA_IPV6.includes(address) || /^fe[89ab][0-9a-f]?:/.test(address))
    return true;
  // An IPv4 address written as IPv6 (::ffff:169.254.169.254 or ::ffff:a9fe:a9fe).
  const mapped = address.match(/^::ffff:(.+)$/)?.[1];
  if (!mapped) return false;
  if (mapped.includes(".")) return isCloudMetadataIp(mapped);
  const [high, low] = mapped.split(":").map((part) => parseInt(part, 16));
  if (Number.isNaN(high) || Number.isNaN(low)) return false;
  return isCloudMetadataIp(
    [high >> 8, high & 255, low >> 8, low & 255].join(".")
  );
}

module.exports = {
  BLOCKED_URL_PATTERNS,
  isCloudMetadataUrl,
  isCloudMetadataIp,
};
