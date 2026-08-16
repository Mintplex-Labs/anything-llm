/* eslint-env jest */

/**
 * Tests for the LAN address lookup used to build the mobile pairing QR code.
 * The address must belong to the physical Ethernet/Wi-Fi adapter and not to a
 * VPN tunnel or hypervisor switch, which are not reachable from other devices.
 *
 * Related issue: https://github.com/Mintplex-Labs/anything-llm/issues/6129
 */

jest.mock("os");

// A Windows machine running NordVPN, WSL and VMware - the setup from the issue.
const WINDOWS_INTERFACES = {
  "Loopback Pseudo-Interface 1": [
    { address: "127.0.0.1", family: "IPv4", mac: "00:00:00:00:00:00", internal: true },
  ],
  "vEthernet (WSL)": [
    { address: "172.28.240.1", family: "IPv4", mac: "00:15:5d:01:02:03", internal: false },
  ],
  "vEthernet (Default Switch)": [
    { address: "172.19.128.1", family: "IPv4", mac: "00:15:5d:04:05:06", internal: false },
  ],
  NordLynx: [
    { address: "10.5.0.2", family: "IPv4", mac: "00:00:00:00:00:00", internal: false },
  ],
  "VMware Network Adapter VMnet1": [
    { address: "192.168.74.1", family: "IPv4", mac: "00:50:56:c0:00:01", internal: false },
  ],
  "Wi-Fi": [
    { address: "169.254.11.4", family: "IPv4", mac: "a0:51:0b:11:22:33", internal: false },
  ],
  Ethernet: [
    { address: "fe80::2e98:466b:a898:5caa", family: "IPv6", mac: "74:56:3c:c2:9f:a9", internal: false },
    { address: "192.168.1.42", family: "IPv4", mac: "74:56:3c:c2:9f:a9", internal: false },
  ],
};

const ethernet = (address = "192.168.1.42") => [
  { address, family: "IPv4", mac: "74:56:3c:c2:9f:a9", internal: false },
];

function resolveAddress(interfaces) {
  const os = require("os");
  os.networkInterfaces.mockReturnValue(interfaces);
  const {
    getLocalNetworkAddress,
  } = require("../../../utils/helpers/networkInterface");
  return getLocalNetworkAddress();
}

describe("getLocalNetworkAddress", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("physical adapter selection", () => {
    test("returns the physical Ethernet address on a VPN + WSL + VMware machine", () => {
      expect(resolveAddress(WINDOWS_INTERFACES)).toBe("192.168.1.42");
    });

    test("never returns a virtual, link-local, loopback or IPv6 address", () => {
      const result = resolveAddress(WINDOWS_INTERFACES);
      expect(result).not.toBe("172.28.240.1");
      expect(result).not.toBe("172.19.128.1");
      expect(result).not.toBe("10.5.0.2");
      expect(result).not.toBe("192.168.74.1");
      expect(result).not.toBe("169.254.11.4");
      expect(result).not.toBe("127.0.0.1");
      expect(result).not.toContain(":");
    });

    test("ignores IPv4 reported with the legacy numeric family", () => {
      expect(
        resolveAddress({
          Ethernet: [{ address: "192.168.1.42", family: 4, mac: "74:56:3c:c2:9f:a9", internal: false }],
        })
      ).toBe("192.168.1.42");
    });
  });

  describe("virtual adapter exclusion", () => {
    const excludedAdapters = [
      "vEthernet (nat)",
      "Hyper-V Virtual Ethernet Adapter",
      "VirtualBox Host-Only Network",
      "VMware Network Adapter VMnet8",
      "Bluetooth Network Connection",
      "Tailscale",
      "ZeroTier One",
      "OpenVPN TAP-Windows6",
      "vmnet8",
      "bridge100",
      "PANGP Virtual Ethernet Adapter",
      "Surfshark Wintun Tunnel",
      "tun0",
      "utun3",
      "docker0",
      "br-1a2b3c",
      "ppp0",
    ];

    // A real MAC and a private address, so only the name can rule it out.
    test.each(excludedAdapters)("skips %s in favor of the real adapter", (name) => {
      expect(
        resolveAddress({
          [name]: [{ address: "10.99.0.5", family: "IPv4", mac: "0a:11:22:33:44:55", internal: false }],
          Ethernet: ethernet(),
        })
      ).toBe("192.168.1.42");
    });

    test("matches adapter names case-insensitively", () => {
      expect(
        resolveAddress({
          NORDLYNX: [{ address: "10.5.0.2", family: "IPv4", mac: "0a:11:22:33:44:55", internal: false }],
          Ethernet: ethernet(),
        })
      ).toBe("192.168.1.42");
    });
  });

  describe("does not exclude real adapters that merely contain a short fragment", () => {
    const realAdapters = [
      "Neptune Ethernet Controller",
      "NETGEAR WG311 Wireless Adapter",
      "Datapath Gigabit Ethernet",
      "TAPS Industrial NIC",
      "Thunderbolt Bridge",
      "bridge0",
      "br0",
    ];

    // The VPN is listed first so a wrongly excluded name loses to the fallback.
    test.each(realAdapters)("keeps %s", (name) => {
      expect(
        resolveAddress({
          NordLynx: [{ address: "10.5.0.2", family: "IPv4", mac: "00:00:00:00:00:00", internal: false }],
          [name]: ethernet("192.168.1.77"),
        })
      ).toBe("192.168.1.77");
    });
  });

  describe("ranking", () => {
    test("keeps enumeration order between equally private adapters", () => {
      expect(
        resolveAddress({
          "Ethernet 2": [{ address: "10.1.2.3", family: "IPv4", mac: "74:56:3c:c2:9f:aa", internal: false }],
          Ethernet: ethernet(),
        })
      ).toBe("10.1.2.3");
    });

    test("prefers a private address over a public one", () => {
      expect(
        resolveAddress({
          "Ethernet 2": [{ address: "203.0.113.7", family: "IPv4", mac: "74:56:3c:c2:9f:aa", internal: false }],
          Ethernet: ethernet("10.1.2.3"),
        })
      ).toBe("10.1.2.3");
    });

    test("treats 172.32 as public since it is outside the private range", () => {
      expect(
        resolveAddress({
          "Ethernet 2": [{ address: "172.32.0.1", family: "IPv4", mac: "74:56:3c:c2:9f:aa", internal: false }],
          Ethernet: ethernet("10.1.2.3"),
        })
      ).toBe("10.1.2.3");
    });

    test("returns a 10.x address when it is the only private candidate", () => {
      expect(resolveAddress({ Ethernet: ethernet("10.1.2.3") })).toBe("10.1.2.3");
    });

    test("prefers a real MAC over an all-zero MAC when otherwise tied", () => {
      expect(
        resolveAddress({
          "Ethernet 2": [{ address: "192.168.1.10", family: "IPv4", mac: "00:00:00:00:00:00", internal: false }],
          Ethernet: ethernet(),
        })
      ).toBe("192.168.1.42");
    });
  });

  describe("fallbacks and error cases", () => {
    test("falls back to the first non-internal IPv4 when every adapter is excluded", () => {
      expect(
        resolveAddress({
          "Loopback Pseudo-Interface 1": [
            { address: "127.0.0.1", family: "IPv4", mac: "00:00:00:00:00:00", internal: true },
          ],
          NordLynx: [{ address: "10.5.0.2", family: "IPv4", mac: "00:00:00:00:00:00", internal: false }],
          "vEthernet (WSL)": [
            { address: "172.28.240.1", family: "IPv4", mac: "00:15:5d:01:02:03", internal: false },
          ],
        })
      ).toBe("10.5.0.2");
    });

    test("returns null when only loopback is present", () => {
      expect(
        resolveAddress({
          "Loopback Pseudo-Interface 1": [
            { address: "127.0.0.1", family: "IPv4", mac: "00:00:00:00:00:00", internal: true },
          ],
        })
      ).toBeNull();
    });

    test("returns null when only IPv6 addresses are present", () => {
      expect(
        resolveAddress({
          Ethernet: [
            { address: "fe80::2e98:466b:a898:5caa", family: "IPv6", mac: "74:56:3c:c2:9f:a9", internal: false },
          ],
        })
      ).toBeNull();
    });

    test("returns null when there are no interfaces at all", () => {
      expect(resolveAddress({})).toBeNull();
    });

    test("returns null when os.networkInterfaces throws", () => {
      const os = require("os");
      os.networkInterfaces.mockImplementation(() => {
        throw new Error("EPERM");
      });
      const {
        getLocalNetworkAddress,
      } = require("../../../utils/helpers/networkInterface");
      expect(() => getLocalNetworkAddress()).not.toThrow();
      expect(getLocalNetworkAddress()).toBeNull();
    });

    test("ignores malformed entries and still returns the good address", () => {
      expect(
        resolveAddress({
          "Broken Adapter": null,
          "Empty Adapter": [],
          "Partial Adapter": [{ family: "IPv4", internal: false }, { address: "  ", family: "IPv4", internal: false }],
          Ethernet: ethernet(),
        })
      ).toBe("192.168.1.42");
    });
  });
});
