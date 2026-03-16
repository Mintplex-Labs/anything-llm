import { useEffect, useState, useCallback } from "react";
import {
  ArrowSquareOut,
  CircleNotch,
  TelegramLogo,
} from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import UsersTable from "./UsersTable";

export default function ConnectedView({
  config,
  workspaces,
  onDisconnected,
  onReconnected,
}) {
  const connected = config.connected;
  const [disconnecting, setDisconnecting] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const workspaceName =
    workspaces.find((ws) => ws.slug === config.default_workspace)?.name ||
    config.default_workspace;

  const fetchUsers = useCallback(async () => {
    const [pending, approved] = await Promise.all([
      Telegram.getPendingUsers(),
      Telegram.getApprovedUsers(),
    ]);
    setPendingUsers(pending?.users || []);
    setApprovedUsers(approved?.users || []);
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5_000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  async function handleDisconnect() {
    setDisconnecting(true);
    const res = await Telegram.disconnect();
    setDisconnecting(false);

    if (!res.success) {
      showToast(res.error || "Failed to disconnect bot.", "error");
      return;
    }

    showToast("Telegram bot disconnected.", "success");
    onDisconnected();
  }

  async function handleReconnect(e) {
    e.preventDefault();
    if (!newToken.trim())
      return showToast("Please enter a bot token.", "error");

    setReconnecting(true);
    const res = await Telegram.connect(
      newToken.trim(),
      config.default_workspace
    );
    setReconnecting(false);

    if (!res.success) {
      showToast(res.error || "Failed to reconnect bot.", "error");
      return;
    }

    showToast("Telegram bot reconnected!", "success");
    setNewToken("");
    onReconnected({
      active: true,
      connected: true,
      bot_username: res.bot_username,
      default_workspace: config.default_workspace,
    });
  }

  async function handleApprove(chatId) {
    const res = await Telegram.approveUser(chatId);
    if (!res.success) {
      showToast(res.error || "Failed to approve user.", "error");
      return;
    }
    showToast("User approved.", "success");
    fetchUsers();
  }

  async function handleDeny(chatId) {
    const res = await Telegram.denyUser(chatId);
    if (!res.success) {
      showToast(res.error || "Failed to deny user.", "error");
      return;
    }
    showToast("User denied.", "info");
    fetchUsers();
  }

  async function handleRevoke(chatId) {
    const res = await Telegram.revokeUser(chatId);
    if (!res.success) {
      showToast(res.error || "Failed to revoke user.", "error");
      return;
    }
    showToast("User access revoked.", "info");
    fetchUsers();
  }

  return (
    <div className="mt-6 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4 max-w-[480px]">
        {connected ? (
          <div className="flex items-center gap-x-3 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
              <TelegramLogo className="h-5 w-5 text-green-400" weight="fill" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-theme-text-primary">
                @{config.bot_username}
              </p>
              <p className="text-xs text-green-400">Connected</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                <TelegramLogo className="h-5 w-5 text-red-400" weight="fill" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-theme-text-primary">
                  @{config.bot_username}
                </p>
                <p className="text-xs text-red-400">
                  Disconnected — token may be expired or invalid
                </p>
              </div>
            </div>
            <form onSubmit={handleReconnect} className="flex items-end gap-x-2">
              <input
                type="password"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                placeholder="Paste new bot token..."
                className="flex-1 bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={reconnecting}
                className="flex items-center gap-x-2 text-sm font-medium text-white bg-primary-button hover:bg-primary-button/80 rounded-lg px-4 py-2.5 whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reconnecting ? (
                  <CircleNotch className="h-4 w-4 animate-spin" />
                ) : (
                  "Reconnect"
                )}
              </button>
            </form>
          </div>
        )}
        {connected && (
          <div className="flex flex-col gap-y-2 rounded-lg bg-theme-bg-primary p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-theme-text-secondary">
                Workspace
              </span>
              <span className="text-xs text-theme-text-primary font-medium">
                {workspaceName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-theme-text-secondary">
                Bot Link
              </span>
              <a
                href={`https://t.me/${config.bot_username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary-button hover:underline flex items-center gap-x-1"
              >
                t.me/{config.bot_username}
                <ArrowSquareOut className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="flex items-center justify-center gap-x-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2.5 w-fit transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disconnecting ? (
            <>
              <CircleNotch className="h-4 w-4 animate-spin" />
              Disconnecting...
            </>
          ) : (
            "Disconnect"
          )}
        </button>
      </div>

      <UsersTable
        title="Pending Approval"
        description="Users waiting to be verified. Match the pairing code shown here with the one displayed in their Telegram chat."
        users={pendingUsers}
        isPending
        onApprove={handleApprove}
        onDeny={handleDeny}
      />

      <UsersTable
        title="Approved Users"
        description="Users who have been approved to chat with your bot."
        users={approvedUsers}
        onRevoke={handleRevoke}
      />
    </div>
  );
}
