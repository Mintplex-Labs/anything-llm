jest.mock("../../../models/externalCommunicationConnector", () => ({
  ExternalCommunicationConnector: { updateConfig: jest.fn() },
}));

const {
  ExternalCommunicationConnector,
} = require("../../../models/externalCommunicationConnector");
const { PairingAccess } = require("../../../utils/externalChannels/access");

describe("PairingAccess", () => {
  beforeEach(() => jest.clearAllMocks());

  test("reuses an unexpired six-digit code and expires old requests", () => {
    let now = 1_000;
    const access = new PairingAccess({
      connectorType: "lark",
      ttlMs: 60_000,
      now: () => now,
    });
    const first = access.request({
      userId: "ou_1",
      name: "Ada",
      platform: "lark",
    });
    expect(first.code).toMatch(/^\d{6}$/);
    expect(
      access.request({ userId: "ou_1", name: "Ada", platform: "lark" }).code
    ).toBe(first.code);
    now = 61_001;
    expect(access.listPending()).toEqual([]);
  });

  test("approves a pending user with immutable id and persists the exact user list", async () => {
    const access = new PairingAccess({ connectorType: "lark" });
    const config = { approved_users: [] };
    access.request({ userId: "ou_1", name: "Ada", platform: "feishu" });

    const approved = await access.approve(config, "ou_1");

    expect(approved).toEqual({
      open_id: "ou_1",
      name: "Ada",
      platform: "feishu",
      active_workspace: null,
      active_thread: null,
    });
    expect(access.isApproved(config, "ou_1")).toBe(true);
    expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledWith(
      "lark",
      {
        approved_users: [
          {
            open_id: "ou_1",
            name: "Ada",
            platform: "feishu",
            active_workspace: null,
            active_thread: null,
          },
        ],
      }
    );
  });

  test("denies pending users and revokes approved users by immutable id", async () => {
    const access = new PairingAccess({ connectorType: "lark" });
    const config = {
      approved_users: [
        {
          open_id: "ou_1",
          name: "Ada",
          platform: "lark",
          active_workspace: null,
          active_thread: null,
        },
      ],
    };
    access.request({ userId: "ou_2", name: "Lin", platform: "lark" });

    access.deny("ou_2");
    expect(access.listPending()).toEqual([]);
    await access.revoke(config, "ou_1");

    expect(access.isApproved(config, "ou_1")).toBe(false);
    expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledWith(
      "lark",
      { approved_users: [] }
    );
  });

  test("does not approve expired pairing requests", async () => {
    let now = 1_000;
    const access = new PairingAccess({
      connectorType: "lark",
      ttlMs: 60_000,
      now: () => now,
    });
    access.request({ userId: "ou_1", name: "Ada", platform: "lark" });
    now = 61_001;

    await expect(access.approve({ approved_users: [] }, "ou_1")).resolves.toEqual(
      { error: "Pairing request expired" }
    );
  });
});
