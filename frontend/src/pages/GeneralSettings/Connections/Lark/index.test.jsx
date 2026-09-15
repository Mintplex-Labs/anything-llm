import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LarkSettings from "./index";
import Lark from "@/models/lark";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";

const { navigate, translation } = vi.hoisted(() => ({
  navigate: vi.fn(),
  translation: { t: (key) => key },
}));
vi.mock("react-router-dom", () => ({ useNavigate: () => navigate }));
vi.mock("@/components/SettingsSidebar", () => ({ default: () => null }));
vi.mock("react-i18next", () => {
  return { useTranslation: () => translation };
});
vi.mock("@/models/lark", () => ({
  default: {
    getConfig: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    status: vi.fn(),
    getPendingUsers: vi.fn(),
    getApprovedUsers: vi.fn(),
    approveUser: vi.fn(),
    denyUser: vi.fn(),
    revokeUser: vi.fn(),
    updateConfig: vi.fn(),
  },
}));
vi.mock("@/models/admin", () => ({ default: { workspaces: vi.fn() } }));
vi.mock("@/models/system", () => ({ default: { isMultiUserMode: vi.fn() } }));
vi.mock("@/utils/toast", () => ({ default: vi.fn() }));

const connected = {
  platform: "feishu",
  app_id: "cli_saved",
  has_app_secret: true,
  bot_name: "Team bot",
  bot_open_id: "ou_bot_private",
  default_workspace: "research",
  attachment_size_limit: null,
  active: true,
  connected: true,
  connection_state: "connected",
  last_error: null,
};
const pending = {
  userId: "ou_private_123456",
  name: "Lin",
  platform: "feishu",
  code: "073421",
  requestedAt: Date.parse("2026-09-15T08:00:00Z"),
};
const approved = {
  open_id: "ou_private_987654",
  name: "Jo",
  platform: "lark",
  active_workspace: "research",
  active_thread: null,
};
function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
async function setup() {
  render(<LarkSettings />);
  await screen.findByLabelText("lark.setup.app-id");
}
function fillCredentials() {
  fireEvent.change(screen.getByLabelText("lark.setup.app-id"), {
    target: { value: "cli_1" },
  });
  fireEvent.change(screen.getByLabelText("lark.setup.app-secret"), {
    target: { value: "secret" },
  });
  fireEvent.change(screen.getByLabelText("lark.setup.workspace"), {
    target: { value: "research" },
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  translation.t = (key) => key;
  System.isMultiUserMode.mockResolvedValue(false);
  Admin.workspaces.mockResolvedValue([
    { id: 1, slug: "research", name: "Research" },
  ]);
  Lark.getConfig.mockResolvedValue({ config: null });
  Lark.status.mockResolvedValue(connected);
  Lark.getPendingUsers.mockResolvedValue({ users: [] });
  Lark.getApprovedUsers.mockResolvedValue({ users: [] });
  Lark.connect.mockResolvedValue({ success: true, config: connected });
  Lark.disconnect.mockResolvedValue({ success: true });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Lark settings", () => {
  it("preserves request ownership when translations change during disconnect", async () => {
    const disconnect = deferred();
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.disconnect.mockReturnValue(disconnect.promise);
    const view = render(<LarkSettings />);
    fireEvent.click(
      await screen.findByRole("button", { name: "lark.connected.disconnect" })
    );
    translation.t = (key) => key;
    await act(async () => view.rerender(<LarkSettings />));
    expect(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    ).toBeDisabled();
    expect(Lark.getConfig).toHaveBeenCalledTimes(1);
    await act(async () => disconnect.resolve({ success: true }));
    expect(
      screen.getByRole("button", { name: "lark.setup.connect" })
    ).toBeDisabled();
  });

  it.each(["failed", "reconnecting"])(
    "can disconnect saved %s configuration without reconnecting",
    async (state) => {
      Lark.getConfig.mockResolvedValue({
        config: { ...connected, connected: false, connection_state: state },
      });
      await setup();
      fireEvent.click(
        screen.getByRole("button", { name: "lark.connected.disconnect" })
      );
      await screen.findByRole("button", { name: "lark.setup.connect" });
      expect(Lark.disconnect).toHaveBeenCalledTimes(1);
      expect(Lark.connect).not.toHaveBeenCalled();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    }
  );

  it("keeps disconnect ownership and disabled controls when an in-flight poll flips status", async () => {
    vi.useFakeTimers();
    const status = deferred();
    const disconnect = deferred();
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.status.mockReturnValue(status.promise);
    Lark.disconnect.mockReturnValue(disconnect.promise);
    render(<LarkSettings />);
    await act(async () => {});
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    fireEvent.click(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    );
    await act(async () =>
      status.resolve({
        ...connected,
        connected: false,
        connection_state: "reconnecting",
      })
    );
    expect(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "lark.connected.save" })
    ).toBeDisabled();
    expect(screen.getByLabelText("lark.setup.workspace")).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "lark.setup.reconnect" })
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    );
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    expect(Lark.disconnect).toHaveBeenCalledTimes(1);
    expect(Lark.status).toHaveBeenCalledTimes(1);
    await act(async () => disconnect.resolve({ success: true }));
    expect(
      screen.getByRole("button", { name: "lark.setup.connect" })
    ).toBeDisabled();
    expect(screen.getByLabelText("lark.setup.app-id")).toBeEnabled();
    expect(screen.queryByText("Team bot")).not.toBeInTheDocument();
  });

  it("keeps reconnect credentials and controls owned until its request settles", async () => {
    vi.useFakeTimers();
    const status = deferred();
    const connect = deferred();
    Lark.getConfig.mockResolvedValue({
      config: { ...connected, connected: false, connection_state: "failed" },
    });
    Lark.status.mockReturnValue(status.promise);
    Lark.connect.mockReturnValue(connect.promise);
    render(<LarkSettings />);
    await act(async () => {});
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    fireEvent.change(screen.getByLabelText("lark.setup.app-secret"), {
      target: { value: "replacement-secret" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "lark.setup.reconnect" })
    );
    await act(async () => status.resolve(connected));
    expect(screen.getByLabelText("lark.setup.app-secret")).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "lark.setup.connecting" })
    ).toBeDisabled();
    await act(async () =>
      connect.resolve({ success: false, error: "Could not connect to Lark." })
    );
    expect(screen.getByLabelText("lark.setup.app-secret")).toHaveValue("");
    expect(
      screen.getByRole("button", { name: "lark.setup.reconnect" })
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    ).toBeEnabled();
  });

  it("requires credentials and a workspace before connecting", async () => {
    await setup();
    expect(screen.getByLabelText("lark.setup.platform")).toHaveValue("lark");
    expect(screen.getByLabelText("lark.setup.app-secret")).toHaveAttribute(
      "type",
      "password"
    );
    const button = screen.getByRole("button", { name: "lark.setup.connect" });
    expect(button).toBeDisabled();
    fillCredentials();
    expect(button).toBeEnabled();
    fireEvent.change(screen.getByLabelText("lark.setup.app-id"), {
      target: { value: "   " },
    });
    expect(button).toBeDisabled();
  });

  it.each(["lark", "feishu"])(
    "submits explicit %s platform and clears the secret when the request completes",
    async (platform) => {
      const request = deferred();
      Lark.connect.mockReturnValue(request.promise);
      await setup();
      fillCredentials();
      fireEvent.change(screen.getByLabelText("lark.setup.platform"), {
        target: { value: platform },
      });
      fireEvent.click(
        screen.getByRole("button", { name: "lark.setup.connect" })
      );
      expect(Lark.connect).toHaveBeenCalledWith({
        platform,
        app_id: "cli_1",
        app_secret: "secret",
        default_workspace: "research",
        attachment_size_limit: null,
      });
      expect(
        screen.getByRole("button", { name: "lark.setup.connecting" })
      ).toBeDisabled();
      await act(async () =>
        request.resolve({ success: false, error: "Check app permissions." })
      );
      expect(screen.getByLabelText("lark.setup.app-secret")).toHaveValue("");
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Check app permissions."
      );
      expect(showToast).toHaveBeenCalledWith("Check app permissions.", "error");
    }
  );

  it("handles rejected requests without retaining the secret or showing raw errors", async () => {
    Lark.connect.mockRejectedValue(new Error("raw secret internal failure"));
    await setup();
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "lark.setup.connect" }));
    await waitFor(() =>
      expect(screen.getByLabelText("lark.setup.app-secret")).toHaveValue("")
    );
    expect(screen.getByRole("alert")).toHaveTextContent("lark.errors.connect");
    expect(screen.queryByText(/raw secret/)).not.toBeInTheDocument();
  });

  it("shows connected identity, masked secret, workspace and allows disconnect", async () => {
    Lark.getConfig.mockResolvedValue({ config: connected });
    render(<LarkSettings />);
    await screen.findByText("Team bot");
    expect(screen.getByText("Feishu")).toBeInTheDocument();
    expect(screen.getByText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "lark.status.connected"
    );
    expect(screen.getByLabelText("lark.setup.workspace")).toHaveValue(
      "research"
    );
    expect(
      screen.queryByLabelText("lark.setup.app-secret")
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "lark.connected.disconnect" })
    );
    await screen.findByRole("button", { name: "lark.setup.connect" });
    expect(Lark.disconnect).toHaveBeenCalledTimes(1);
  });

  it.each(["failed", "reconnecting"])(
    "renders %s and reconnects with the saved secret omitted from payload",
    async (state) => {
      Lark.getConfig.mockResolvedValue({
        config: {
          ...connected,
          connected: false,
          connection_state: state,
          last_error: {
            category: "permission_denied",
            timestamp: "2026-09-15T08:00:00.000Z",
          },
        },
      });
      await setup();
      expect(screen.getByRole("status")).toHaveTextContent(
        `lark.status.${state}`
      );
      expect(screen.getByRole("status")).toHaveTextContent(
        "lark.errors.permission_denied"
      );
      expect(screen.getByLabelText("lark.setup.app-secret")).toHaveValue("");
      fireEvent.click(
        screen.getByRole("button", { name: "lark.setup.reconnect" })
      );
      await screen.findByText("Team bot");
      expect(Lark.connect).toHaveBeenCalledWith({
        platform: "feishu",
        app_id: "cli_saved",
        default_workspace: "research",
        attachment_size_limit: null,
      });
    }
  );

  it("renders pending pairing details with only the ID suffix and expiry", async () => {
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.getPendingUsers.mockResolvedValue({ users: [pending] });
    Lark.getApprovedUsers.mockResolvedValue({ users: [approved] });
    const { container } = render(<LarkSettings />);
    await screen.findByText("Lin");
    expect(screen.getByText("073421")).toBeInTheDocument();
    expect(screen.getByText(/123456/)).toBeInTheDocument();
    expect(screen.getByText("Jo")).toBeInTheDocument();
    expect(screen.getByText(/987654/)).toBeInTheDocument();
    expect(container.innerHTML).not.toContain("ou_private");
    expect(container.querySelector("time")).toHaveAttribute(
      "datetime",
      "2026-09-15T08:10:00.000Z"
    );
  });

  it.each([
    ["approve", "approveUser"],
    ["deny", "denyUser"],
    ["revoke", "revokeUser"],
  ])(
    "disables %s during its request and refreshes user lists on success",
    async (action, method) => {
      const request = deferred();
      Lark[method].mockReturnValue(request.promise);
      Lark.getConfig.mockResolvedValue({ config: connected });
      Lark.getPendingUsers.mockResolvedValue({ users: [pending] });
      Lark.getApprovedUsers.mockResolvedValue({ users: [approved] });
      render(<LarkSettings />);
      const button = await screen.findByRole("button", {
        name: `lark.users.${action}`,
      });
      const initial = Lark.getPendingUsers.mock.calls.length;
      fireEvent.click(button);
      fireEvent.click(button);
      expect(button).toBeDisabled();
      expect(Lark[method]).toHaveBeenCalledTimes(1);
      expect(Lark[method]).toHaveBeenCalledWith(
        action === "revoke" ? "ou_private_987654" : "ou_private_123456"
      );
      Lark.getPendingUsers.mockResolvedValue({ users: [] });
      Lark.getApprovedUsers.mockResolvedValue({ users: [] });
      await act(async () => request.resolve({ success: true }));
      expect(Lark.getPendingUsers.mock.calls.length).toBeGreaterThan(initial);
      expect(screen.queryByText("Lin")).not.toBeInTheDocument();
      expect(screen.queryByText("Jo")).not.toBeInTheDocument();
    }
  );

  it("honors an explicit pending expiry and open_id when supplied", async () => {
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.getPendingUsers.mockResolvedValue({
      users: [
        {
          ...pending,
          userId: undefined,
          open_id: "ou_hidden_654321",
          expiresAt: Date.parse("2026-09-15T08:05:00Z"),
        },
      ],
    });
    const { container } = render(<LarkSettings />);
    await screen.findByText("Lin");
    expect(screen.getByText(/654321/)).toBeInTheDocument();
    expect(container.innerHTML).not.toContain("ou_hidden");
    expect(container.querySelector("time")).toHaveAttribute(
      "datetime",
      "2026-09-15T08:05:00.000Z"
    );
  });

  it("saves workspace and positive byte limits, and blank restores inheritance", async () => {
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.updateConfig.mockResolvedValue({
      success: true,
      config: { ...connected, attachment_size_limit: 1024 },
    });
    render(<LarkSettings />);
    const input = await screen.findByLabelText("lark.setup.attachment-limit");
    fireEvent.change(input, { target: { value: "0" } });
    expect(
      screen.getByRole("button", { name: "lark.connected.save" })
    ).toBeDisabled();
    fireEvent.change(input, { target: { value: "1024" } });
    fireEvent.click(
      screen.getByRole("button", { name: "lark.connected.save" })
    );
    await waitFor(() =>
      expect(Lark.updateConfig).toHaveBeenCalledWith({
        default_workspace: "research",
        attachment_size_limit: 1024,
      })
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "lark.connected.save" })
      ).toBeEnabled()
    );
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(
      screen.getByRole("button", { name: "lark.connected.save" })
    );
    await waitFor(() =>
      expect(Lark.updateConfig).toHaveBeenLastCalledWith({
        default_workspace: "research",
        attachment_size_limit: null,
      })
    );
  });

  it("polls status and users every five seconds, observes recovery and cleans up on unmount", async () => {
    vi.useFakeTimers();
    Lark.getConfig.mockResolvedValue({ config: connected });
    const view = render(<LarkSettings />);
    await act(async () => {});
    const initial = Lark.status.mock.calls.length;
    Lark.status.mockResolvedValue({
      ...connected,
      connected: false,
      connection_state: "reconnecting",
    });
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    expect(Lark.status.mock.calls.length).toBe(initial + 1);
    expect(screen.getByRole("status")).toHaveTextContent(
      "lark.status.reconnecting"
    );
    Lark.status.mockResolvedValue(connected);
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    expect(screen.getByRole("status")).toHaveTextContent(
      "lark.status.connected"
    );
    const count = Lark.status.mock.calls.length;
    view.unmount();
    await act(async () => vi.advanceTimersByTimeAsync(10000));
    expect(Lark.status).toHaveBeenCalledTimes(count);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("redirects multi-user mode home before loading channel data", async () => {
    System.isMultiUserMode.mockResolvedValue(true);
    render(<LarkSettings />);
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/"));
    expect(Lark.getConfig).not.toHaveBeenCalled();
    expect(Admin.workspaces).not.toHaveBeenCalled();
  });

  it("does not restore stale pending users when an older poll resolves after approval", async () => {
    vi.useFakeTimers();
    const stale = deferred();
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.getPendingUsers
      .mockResolvedValueOnce({ users: [pending] })
      .mockReturnValueOnce(stale.promise)
      .mockResolvedValue({ users: [] });
    Lark.approveUser.mockResolvedValue({ success: true });
    render(<LarkSettings />);
    await act(async () => {});
    await act(async () => vi.advanceTimersByTimeAsync(5000));
    await act(async () =>
      fireEvent.click(
        screen.getByRole("button", { name: "lark.users.approve" })
      )
    );
    expect(screen.queryByText("Lin")).not.toBeInTheDocument();
    await act(async () => stale.resolve({ users: [pending] }));
    expect(screen.queryByText("Lin")).not.toBeInTheDocument();
  });

  it("keeps a failed approval visible and enables retry with the safe server error", async () => {
    Lark.getConfig.mockResolvedValue({ config: connected });
    Lark.getPendingUsers.mockResolvedValue({ users: [pending] });
    Lark.approveUser.mockResolvedValue({
      success: false,
      error: "Could not update Lark user access.",
    });
    render(<LarkSettings />);
    const button = await screen.findByRole("button", {
      name: "lark.users.approve",
    });
    fireEvent.click(button);
    await waitFor(() => expect(button).toBeEnabled());
    expect(screen.getByText("Lin")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not update Lark user access."
    );
    expect(showToast).toHaveBeenCalledWith(
      "Could not update Lark user access.",
      "error"
    );
  });

  it("clears the secret on success before displaying the connected state", async () => {
    await setup();
    fillCredentials();
    fireEvent.click(screen.getByRole("button", { name: "lark.setup.connect" }));
    await screen.findByText("Team bot");
    expect(screen.queryByDisplayValue("secret")).not.toBeInTheDocument();
  });
});
