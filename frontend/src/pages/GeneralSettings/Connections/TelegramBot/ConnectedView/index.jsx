import { useEffect, useState, useCallback } from "react";
import {
  ArrowSquareOut,
  CircleNotch,
  TelegramLogo,
} from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import UsersTable from "./UsersTable";
import { useTranslation } from "react-i18next";

const VOICE_MODE_OPTIONS = [
  { value: "text_only", key: "telegram.connected.voice-text-only" },
  { value: "mirror", key: "telegram.connected.voice-mirror" },
  { value: "always_voice", key: "telegram.connected.voice-always" },
];

export default function ConnectedView({
  config,
  workspaces,
  onDisconnected,
  onReconnected,
}) {
  const { t } = useTranslation();
  const connected = config.connected;
  const [disconnecting, setDisconnecting] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [voiceMode, setVoiceMode] = useState(
    config.voice_response_mode || "text_only"
  );
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
      showToast(
        res.error || t("telegram.connected.toast-disconnect-failed"),
        "error"
      );
      return;
    }

    showToast(t("telegram.connected.toast-disconnect-success"), "success");
    onDisconnected();
  }

  async function handleReconnect(e) {
    e.preventDefault();
    if (!newToken.trim())
      return showToast(t("telegram.connected.toast-enter-token"), "error");

    setReconnecting(true);
    const res = await Telegram.connect(
      newToken.trim(),
      config.default_workspace
    );
    setReconnecting(false);

    if (!res.success) {
      showToast(
        res.error || t("telegram.connected.toast-reconnect-failed"),
        "error"
      );
      return;
    }

    showToast(t("telegram.connected.toast-reconnect-success"), "success");
    setNewToken("");
    onReconnected({
      active: true,
      connected: true,
      bot_username: res.bot_username,
      default_workspace: config.default_workspace,
    });
  }

  async function handleVoiceModeChange(e) {
    const mode = e.target.value;
    setVoiceMode(mode);
    const res = await Telegram.updateConfig({ voice_response_mode: mode });
    if (!res.success) {
      showToast(
        res.error || t("telegram.connected.toast-voice-failed"),
        "error"
      );
      setVoiceMode(config.voice_response_mode || "text_only");
    }
  }

  async function handleApprove(chatId) {
    const res = await Telegram.approveUser(chatId);
    if (!res.success) {
      showToast(
        res.error || t("telegram.connected.toast-approve-failed"),
        "error"
      );
      return;
    }
    showToast(t("telegram.connected.toast-approve-success"), "success");
    fetchUsers();
  }

  async function handleDeny(chatId) {
    const res = await Telegram.denyUser(chatId);
    if (!res.success) {
      showToast(
        res.error || t("telegram.connected.toast-deny-failed"),
        "error"
      );
      return;
    }
    showToast(t("telegram.connected.toast-deny-success"), "info");
    fetchUsers();
  }

  async function handleRevoke(chatId) {
    const res = await Telegram.revokeUser(chatId);
    if (!res.success) {
      showToast(
        res.error || t("telegram.connected.toast-revoke-failed"),
        "error"
      );
      return;
    }
    showToast(t("telegram.connected.toast-revoke-success"), "info");
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
              <p className="text-xs text-green-400">
                {t("telegram.connected.status")}
              </p>
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
                  {t("telegram.connected.status-disconnected")}
                </p>
              </div>
            </div>
            <form onSubmit={handleReconnect} className="flex items-end gap-x-2">
              <input
                type="password"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                placeholder={t("telegram.connected.placeholder-token")}
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
                  t("telegram.connected.reconnect")
                )}
              </button>
            </form>
          </div>
        )}
        {connected && (
          <div className="flex flex-col gap-y-2 rounded-lg bg-theme-bg-primary p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-theme-text-secondary">
                {t("telegram.connected.workspace")}
              </span>
              <span className="text-xs text-theme-text-primary font-medium">
                {workspaceName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-theme-text-secondary">
                {t("telegram.connected.bot-link")}
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
            <div className="flex items-center justify-between">
              <span className="text-xs text-theme-text-secondary">
                {t("telegram.connected.voice-response")}
              </span>
              <select
                value={voiceMode}
                onChange={handleVoiceModeChange}
                className="text-xs bg-theme-settings-input-bg text-theme-text-primary rounded-md px-2 py-1 outline-none max-w-[260px]"
              >
                {VOICE_MODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.key)}
                  </option>
                ))}
              </select>
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
              {t("telegram.connected.disconnecting")}
            </>
          ) : (
            t("telegram.connected.disconnect")
          )}
        </button>
      </div>

      <UsersTable
        title={t("telegram.users.pending-title")}
        description={t("telegram.users.pending-description")}
        users={pendingUsers}
        isPending
        onApprove={handleApprove}
        onDeny={handleDeny}
      />

      <UsersTable
        title={t("telegram.users.approved-title")}
        description={t("telegram.users.approved-description")}
        users={approvedUsers}
        onRevoke={handleRevoke}
      />
    </div>
  );
}
