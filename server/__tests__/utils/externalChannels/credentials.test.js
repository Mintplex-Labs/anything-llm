const {
  encryptConnectorSecret,
  decryptConnectorSecret,
} = require("../../../utils/externalChannels/credentials");
const {
  ExternalCommunicationConnector,
} = require("../../../models/externalCommunicationConnector");

describe("external channel credentials", () => {
  test("round-trips an encrypted secret", () => {
    const stored = encryptConnectorSecret("secret-value");
    expect(stored).toMatch(/^enc:/);
    expect(stored).not.toContain("secret-value");
    expect(decryptConnectorSecret(stored)).toBe("secret-value");
  });

  test("accepts legacy plaintext values", () => {
    expect(decryptConnectorSecret("legacy-token")).toBe("legacy-token");
  });

  test("supports Telegram and Lark connector records", () => {
    expect(ExternalCommunicationConnector.supportedTypes).toEqual(
      expect.arrayContaining(["telegram", "lark"])
    );
  });
});
