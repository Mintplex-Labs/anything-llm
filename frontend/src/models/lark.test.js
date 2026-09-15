import { beforeEach, describe, expect, test, vi } from "vitest";
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";
import Lark from "./lark";

const connectPayload = {
  platform: "lark",
  app_id: "cli_1",
  app_secret: "secret",
  default_workspace: "general",
  attachment_size_limit: null,
};

const cases = [
  ["getConfig", () => Lark.getConfig(), "config", undefined, undefined],
  [
    "connect",
    () => Lark.connect(connectPayload),
    "connect",
    "POST",
    connectPayload,
  ],
  ["disconnect", () => Lark.disconnect(), "disconnect", "POST", undefined],
  ["status", () => Lark.status(), "status", undefined, undefined],
  [
    "getPendingUsers",
    () => Lark.getPendingUsers(),
    "pending-users",
    undefined,
    undefined,
  ],
  [
    "getApprovedUsers",
    () => Lark.getApprovedUsers(),
    "approved-users",
    undefined,
    undefined,
  ],
  [
    "approveUser",
    () => Lark.approveUser("ou_1"),
    "approve-user",
    "POST",
    { open_id: "ou_1" },
  ],
  [
    "denyUser",
    () => Lark.denyUser("ou_1"),
    "deny-user",
    "POST",
    { open_id: "ou_1" },
  ],
  [
    "revokeUser",
    () => Lark.revokeUser("ou_1"),
    "revoke-user",
    "POST",
    { open_id: "ou_1" },
  ],
  [
    "updateConfig",
    () => Lark.updateConfig({ attachment_size_limit: 25 }),
    "update-config",
    "POST",
    { attachment_size_limit: 25 },
  ],
];

describe("Lark API client", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    window.localStorage.clear();
  });

  test.each(cases)(
    "%s sends its Lark request with authenticated headers",
    async (_name, invoke, endpoint, method, body) => {
      fetch.mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ ok: true }),
      });

      await invoke();

      expect(fetch).toHaveBeenCalledWith(`${API_BASE}/lark/${endpoint}`, {
        ...(method ? { method } : {}),
        headers: baseHeaders(),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
    }
  );

  test("connect sends the App Secret only in its request body", async () => {
    fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await Lark.connect(connectPayload);

    expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(connectPayload));
    expect(JSON.stringify(fetch.mock.calls[0][1])).toContain("secret");
    expect(error).not.toHaveBeenCalled();
  });

  test("updateConfig excludes an accidental App Secret", async () => {
    fetch.mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    await Lark.updateConfig({
      default_workspace: "general",
      app_secret: "secret",
    });

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/lark/update-config`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ default_workspace: "general" }),
    });
  });

  test.each([
    [
      "getConfig",
      () => Lark.getConfig(),
      { config: null, error: "Unable to retrieve Lark configuration." },
    ],
    [
      "status",
      () => Lark.status(),
      {
        active: false,
        connected: false,
        connection_state: "disconnected",
        last_error: null,
        error: "Unable to retrieve Lark status.",
      },
    ],
    [
      "getPendingUsers",
      () => Lark.getPendingUsers(),
      { users: [], error: "Unable to retrieve Lark users." },
    ],
    [
      "getApprovedUsers",
      () => Lark.getApprovedUsers(),
      { users: [], error: "Unable to retrieve Lark users." },
    ],
    [
      "connect",
      () => Lark.connect(connectPayload),
      { success: false, error: "Unable to complete Lark request." },
    ],
    [
      "disconnect",
      () => Lark.disconnect(),
      { success: false, error: "Unable to complete Lark request." },
    ],
    [
      "approveUser",
      () => Lark.approveUser("ou_1"),
      { success: false, error: "Unable to complete Lark request." },
    ],
    [
      "denyUser",
      () => Lark.denyUser("ou_1"),
      { success: false, error: "Unable to complete Lark request." },
    ],
    [
      "revokeUser",
      () => Lark.revokeUser("ou_1"),
      { success: false, error: "Unable to complete Lark request." },
    ],
    [
      "updateConfig",
      () => Lark.updateConfig({}),
      { success: false, error: "Unable to complete Lark request." },
    ],
  ])(
    "%s returns a normalized safe failure without logging sensitive errors",
    async (_name, invoke, failure) => {
      fetch.mockRejectedValueOnce(new Error("secret must not be exposed"));
      const error = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(invoke()).resolves.toEqual(failure);
      expect(error).not.toHaveBeenCalled();
    }
  );
});
