import { useEffect, useState, useCallback } from "react";
import {
  ArrowSquareOut,
  CircleNotch,
  Eye,
  EyeSlash,
  TelegramLogo,
} from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import UsersTable from "./UsersTable";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ConnectedView({
  config,
  workspaces,
  onDisconnected,
  onReconnected,
}) {
  const { t } = useTranslation();
  const connected = config.connected;
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

  if (!connected) {
    return (
      <DisconnectedView
        config={config}
        onReconnected={onReconnected}
        newToken={newToken}
        setNewToken={setNewToken}
      />
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4 max-w-[480px]">
        <div className="flex items-center gap-x-3 rounded-lg border border-green-500/20 bg-green-500/5 light:border-green-700/20 light:bg-green-500/10 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
            <TelegramLogo
              className="h-5 w-5 text-green-400 light:text-green-700"
              weight="fill"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-theme-text-primary">
              @{config.bot_username}
            </p>
            <p className="text-xs text-green-400 light:text-green-700">
              {t("telegram.connected.status")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 rounded-lg bg-black light:bg-black/5 light:border light:border-black/10 p-4">
          <WorkspaceName name={workspaceName} />
          <BotLink username={config.bot_username} />
          {/*
           Disabled for now - works fine, but I am not sure we want to enabled this feature. 
           How many people really need a REPLY with voice mode? Even then, we should support on device TTS
           and more it out the frontend so people can do voice gen without having to pay for it.
           */}
          {/* <VoiceModeSelector config={config} /> */}
          <DisconnectButton onDisconnected={onDisconnected} />
        </div>
      </div>
      <UsersTable
        title={t("telegram.users.pending-title")}
        description={t("telegram.users.pending-description")}
        users={pendingUsers}
        isPending
        fetchUsers={fetchUsers}
      />

      <UsersTable
        title={t("telegram.users.approved-title")}
        description={t("telegram.users.approved-description")}
        users={approvedUsers}
        fetchUsers={fetchUsers}
      />
    </div>
  );
}

function BotLink({ username }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white">
        {t("telegram.connected.bot-link")}
      </span>
      <Link
        to={`https://t.me/${username}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-sky-500 light:text-sky-600 hover:underline flex items-center gap-x-1"
      >
        t.me/{username}
        <ArrowSquareOut className="h-3 w-3" />
      </Link>
    </div>
  );
}

function DisconnectButton({ onDisconnected }) {
  const { t } = useTranslation();
  const [disconnecting, setDisconnecting] = useState(false);

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
    onDisconnected();
  }

  return (
    <button
      onClick={handleDisconnect}
      disabled={disconnecting}
      className="flex items-center justify-center gap-x-2 text-sm font-medium text-white bg-red-800 hover:bg-red-700 light:bg-red-600 light:hover:bg-red-500 light:text-white rounded-lg px-4 py-0.5 w-fit transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}

function WorkspaceName({ name }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white">
        {t("telegram.connected.workspace")}
      </span>
      <span className="text-xs text-white font-medium">{name}</span>
    </div>
  );
}

function DisconnectedView({ config, onReconnected, newToken, setNewToken }) {
  const { t } = useTranslation();
  const [reconnecting, setReconnecting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const Icon = showToken ? Eye : EyeSlash;

  async function handleReconnect(e) {
    e.preventDefault();
    if (!newToken.trim()) return;
    setReconnecting(true);
    const res = await Telegram.connect(
      newToken.trim(),
      config.default_workspace
    );
    setReconnecting(false);
    if (!res.success)
      return showToast(
        res.error || t("telegram.connected.toast-reconnect-failed"),
        "error"
      );

    setNewToken("");
    onReconnected({
      active: true,
      connected: true,
      bot_username: res.bot_username,
      default_workspace: config.default_workspace,
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4 max-w-[480px]">
        <div className="flex flex-col gap-y-3">
          <div className="flex items-center gap-x-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <TelegramLogo className="h-5 w-5 text-red-400" weight="fill" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-white">
                @{config.bot_username}
              </p>
              <p className="text-xs text-red-400">
                {t("telegram.connected.status-disconnected")}
              </p>
            </div>
          </div>
          <form onSubmit={handleReconnect} className="flex items-end gap-x-2">
            <div className="relative w-full">
              <input
                type={showToken ? "text" : "password"}
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                placeholder={t("telegram.connected.placeholder-token")}
                className="w-[99%] bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 pr-10"
                autoComplete="off"
              />
              {newToken.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={reconnecting}
              className="flex items-center gap-x-2 text-sm font-medium !text-white bg-sky-500 hover:bg-sky-600 rounded-lg px-4 py-2.5 whitespace-nowrap transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reconnecting ? (
                <CircleNotch className="h-4 w-4 animate-spin" />
              ) : (
                t("telegram.connected.reconnect")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
This code is disabled for now - works fine, but I am not sure we want to enabled this feature. 
How many people really need a REPLY with voice mode? Even then, we should support on device TTS
and more it out the frontend so people can do voice gen without having to pay for it.

When we do enabled this, we should uncomment this code and remove the disabled comment.

const getVoiceModeOptions = (t) => {
  return [
    { value: "text_only", label: t("telegram.connected.voice-text-only") },
    { value: "mirror", label: t("telegram.connected.voice-mirror") },
    { value: "always_voice", label: t("telegram.connected.voice-always") },
  ];
};

function VoiceModeSelector({ config }) {
  const { t } = useTranslation();
  const [voiceMode, setVoiceMode] = useState(
    config.voice_response_mode || "text_only"
  );

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

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white">
        {t("telegram.connected.voice-response")}
      </span>
      <select
        value={voiceMode}
        onChange={handleVoiceModeChange}
        className="text-xs text-right bg-transparent text-white rounded-md px-2 py-1 outline-none max-w-[260px]"
      >
        {getVoiceModeOptions(t).map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

*/
