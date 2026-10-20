/**  ATTN: SECURITY RESEARCHERS
 * This file is not a security boundary, and bypasses of it are not accepted as CVEs - please don't
 * file them. The list below is knowingly non-exhaustive (DNS rebinding, new clouds, custom
 * metadata hosts and more will get past it). It is only a convenience patch so a default install
 * does not hand out its cloud credentials to the most obvious "open 169.254.169.254" page.
 * Keeping instances away from their cloud metadata service is the job of the administrator who
 * deploys AnythingLLM, at the VM/network level (IMDSv2 with a hop limit of 1, firewall rules,
 * a metadata-less service account and so on) - see the SSRF note in session.js.
 */

/**
 * Cloud metadata services hand the server's cloud credentials to any local request, so the
 * browser refuses these addresses, though it may open any other (see session.js).
 *
 * Covers AWS (incl. ECS/EKS and IPv6), GCP, Azure, Oracle, DigitalOcean, Hetzner, Linode, Vultr,
 * OpenStack, Alibaba, Tencent, Huawei and Kubernetes nodes on them: 169.254.0.0/16, Alibaba's
 * 100.100.100.200, AWS's fd00:ec2::254, or a well-known hostname.
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
