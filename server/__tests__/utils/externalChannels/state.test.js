jest.mock("../../../models/externalCommunicationConnector", () => ({
  ExternalCommunicationConnector: { updateConfig: jest.fn() },
}));

const {
  ExternalCommunicationConnector,
} = require("../../../models/externalCommunicationConnector");
const {
  ChannelStateStore,
} = require("../../../utils/externalChannels/state");

describe("ChannelStateStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ExternalCommunicationConnector.updateConfig.mockResolvedValue({
      connector: {},
      error: null,
    });
  });

  test("persists a separate workspace and thread for each approved user", async () => {
    const config = {
      default_workspace: "general",
      approved_users: [
        { open_id: "ou_1", name: "Ada" },
        { open_id: "ou_2", name: "Lin" },
      ],
    };
    const store = new ChannelStateStore({ connectorType: "lark", config });
    await store.set("ou_1", { workspaceSlug: "research", threadSlug: "paper" });
    expect(store.get("ou_1")).toEqual({
      workspaceSlug: "research",
      threadSlug: "paper",
    });
    expect(store.get("ou_2")).toEqual({
      workspaceSlug: "general",
      threadSlug: null,
    });
    expect(ExternalCommunicationConnector.updateConfig).toHaveBeenCalledWith(
      "lark",
      {
        approved_users: [
          {
            open_id: "ou_1",
            name: "Ada",
            active_workspace: "research",
            active_thread: "paper",
          },
          { open_id: "ou_2", name: "Lin" },
        ],
      }
    );
  });

  test("rejects state updates for users without approval", async () => {
    const store = new ChannelStateStore({
      connectorType: "lark",
      config: { approved_users: [] },
    });

    await expect(store.set("ou_unknown", { workspaceSlug: "research" })).rejects.toThrow(
      "User is not approved"
    );
  });

  test("keeps user routing unchanged when persistence resolves an error", async () => {
    const config = {
      default_workspace: "general",
      approved_users: [{ open_id: "ou_1", name: "Ada" }],
    };
    const store = new ChannelStateStore({ connectorType: "lark", config });
    ExternalCommunicationConnector.updateConfig.mockResolvedValue({
      connector: null,
      error: "database unavailable",
    });

    await expect(
      store.set("ou_1", { workspaceSlug: "research", threadSlug: "paper" })
    ).rejects.toThrow("database unavailable");
    expect(store.get("ou_1")).toEqual({
      workspaceSlug: "general",
      threadSlug: null,
    });
  });
});
