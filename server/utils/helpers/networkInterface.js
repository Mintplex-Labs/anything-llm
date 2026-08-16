const ZERO_MAC = "00:00:00:00:00:00";

// Adapter names that belong to hypervisors, containers or VPN clients.
const VIRTUAL_ADAPTER_FRAGMENTS = [
  "vethernet",
  "hyper-v",
  "virtualbox",
  "vmware",
  "vmnet",
  "bridge1",
  "loopback",
  "bluetooth",
  "nordlynx",
  "tap-windows",
  "wintun",
  "openvpn",
  "wireguard",
  "tailscale",
  "zerotier",
  "anyconnect",
  "pangp",
  "pulse secure",
  "zscaler",
  "forticlient",
  "docker",
  "virbr",
  "vboxnet",
];

// Matched as a prefix on device-style names only - too short for a substring
// match, which would catch descriptive names like "TAPS Industrial NIC".
const VIRTUAL_ADAPTER_PREFIXES = [
  "tun",
  "tap",
  "utun",
  "ppp",
  "veth",
  "br-",
  "wg",
];

function isVirtualAdapter(name = "") {
  const adapter = String(name).toLowerCase();
  if (VIRTUAL_ADAPTER_FRAGMENTS.some((fragment) => adapter.includes(fragment)))
    return true;
  if (/\s/.test(adapter)) return false;
  return VIRTUAL_ADAPTER_PREFIXES.some((prefix) => adapter.startsWith(prefix));
}

// Private ranges are not ordered against each other - a real LAN is as likely
// to be on 10.x as on 192.168.x, so only private-over-public is ranked.
function addressRank(address = "") {
  if (address.startsWith("192.168.")) return 0;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) return 0;
  if (address.startsWith("10.")) return 0;
  return 1;
}

function compareCandidates(a, b) {
  const rankDiff = addressRank(a.address) - addressRank(b.address);
  if (rankDiff !== 0) return rankDiff;
  // Tunnel adapters report an all-zero MAC while physical NICs do not.
  return (a.mac === ZERO_MAC ? 1 : 0) - (b.mac === ZERO_MAC ? 1 : 0);
}

/**
 * Finds the LAN address of this machine so other devices on the same network
 * can reach the instance. Virtual, container and VPN adapters are skipped since
 * their addresses are not reachable from the LAN.
 * @returns {string|null} The IPv4 address, or null when there is no usable one.
 */
function getLocalNetworkAddress() {
  const os = require("os");
  try {
    const candidates = [];
    for (const [name, addresses] of Object.entries(
      os.networkInterfaces() || {}
    )) {
      for (const config of addresses || []) {
        if (!config?.address || !String(config.address).trim()) continue;
        if (config.internal === true) continue;
        if (config.family !== "IPv4" && config.family !== 4) continue;
        if (config.address.startsWith("169.254.")) continue; // APIPA/link-local
        candidates.push({ name, address: config.address, mac: config.mac });
      }
    }
    if (candidates.length === 0) return null;

    const physical = candidates.filter(
      (candidate) => !isVirtualAdapter(candidate.name)
    );
    if (physical.length === 0) return candidates[0].address;
    return physical.sort(compareCandidates)[0].address;
  } catch {
    return null;
  }
}

module.exports = {
  getLocalNetworkAddress,
};
