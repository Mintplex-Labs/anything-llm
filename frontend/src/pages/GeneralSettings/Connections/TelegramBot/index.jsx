import { useEffect, useState, useCallback } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowSquareOut,
  CircleNotch,
  TelegramLogo,
} from "@phosphor-icons/react";
import Logo from "@/media/logo/anything-llm-infinity.png";
import Workspace from "@/models/workspace";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";

const BOTFATHER_URL = "https://t.me/BotFather";

export default function TelegramBotSettings() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [configRes, allWorkspaces] = await Promise.all([
        Telegram.getConfig(),
        Workspace.all(),
      ]);
      setConfig(configRes?.config || null);
      setWorkspaces(allWorkspaces || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleConnected = (newConfig) => setConfig(newConfig);
  const handleDisconnected = () => setConfig(null);

  if (loading) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6">
        <Sidebar />
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="flex items-center justify-center h-full">
            <CircleNotch className="h-8 w-8 text-theme-text-secondary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const hasConfig = config?.active && config?.bot_username;

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex md:mt-0 mt-6">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Telegram Bot
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              Connect your AnythingLLM instance to Telegram so you can chat with
              your workspaces from any device.
            </p>
          </div>

          {hasConfig ? (
            <ConnectedView
              config={config}
              workspaces={workspaces}
              onDisconnected={handleDisconnected}
              onReconnected={handleConnected}
            />
          ) : (
            <SetupView workspaces={workspaces} onConnected={handleConnected} />
          )}
        </div>
      </div>
    </div>
  );
}

function SetupView({ workspaces, onConnected }) {
  const [botToken, setBotToken] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(
    workspaces[0]?.slug || ""
  );
  const [connecting, setConnecting] = useState(false);

  async function handleConnect(e) {
    e.preventDefault();
    if (!botToken.trim())
      return showToast("Please enter a bot token.", "error");
    if (!selectedWorkspace)
      return showToast("Please select a workspace.", "error");

    setConnecting(true);
    const res = await Telegram.connect(botToken.trim(), selectedWorkspace);
    setConnecting(false);

    if (!res.success) {
      showToast(res.error || "Failed to connect bot.", "error");
      return;
    }

    showToast("Telegram bot connected successfully!", "success");
    onConnected({
      active: true,
      bot_username: res.bot_username,
      default_workspace: selectedWorkspace,
    });
  }

  return (
    <div className="flex flex-col gap-y-6 mt-6">
      <CreateBotSection />
      <form onSubmit={handleConnect} className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <p className="text-sm font-semibold text-theme-text-primary">
            Step 2: Connect your bot
          </p>
          <p className="text-xs text-theme-text-secondary">
            Paste the API token you received from @BotFather and select a
            default workspace for your bot to chat with.
          </p>
        </div>
        <div className="flex flex-col gap-y-4 max-w-[480px]">
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-medium text-theme-text-secondary">
              Bot Token
            </label>
            <input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v..."
              className="bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-medium text-theme-text-secondary">
              Default Workspace
            </label>
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              className="bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            >
              {workspaces.map((ws) => (
                <option key={ws.slug} value={ws.slug}>
                  {ws.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={connecting}
            className="flex items-center justify-center gap-x-2 text-sm font-medium text-white bg-primary-button hover:bg-primary-button/80 rounded-lg px-4 py-2.5 w-fit transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {connecting ? (
              <>
                <CircleNotch className="h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <TelegramLogo className="h-4 w-4" weight="bold" />
                Connect Bot
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConnectedView({ config, workspaces, onDisconnected, onReconnected }) {
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

      {pendingUsers.length > 0 && (
        <UsersTable
          title="Pending Approval"
          description="Users waiting to be verified. Match the pairing code shown here with the one displayed in their Telegram chat."
          users={pendingUsers}
          isPending
          onApprove={handleApprove}
          onDeny={handleDeny}
        />
      )}

      <UsersTable
        title="Approved Users"
        description="Users who have been approved to chat with your bot."
        users={approvedUsers}
        onRevoke={handleRevoke}
      />
    </div>
  );
}

function UsersTable({
  title,
  description,
  users = [],
  isPending = false,
  onApprove,
  onDeny,
  onRevoke,
}) {
  const colCount = isPending ? 4 : 3;

  return (
    <div className="flex flex-col gap-y-2">
      <p className="text-sm font-semibold text-theme-text-primary">{title}</p>
      <p className="text-xs text-theme-text-secondary">{description}</p>
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-xs text-left rounded-lg min-w-[480px] border-spacing-0">
          <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Chat ID
              </th>
              {isPending && (
                <th scope="col" className="px-6 py-3">
                  Pairing Code
                </th>
              )}
              <th scope="col" className="px-6 py-3">
                {" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="bg-transparent text-theme-text-secondary text-sm font-medium">
                <td colSpan={colCount} className="px-6 py-4 text-center">
                  {isPending ? "No pending requests" : "No approved users"}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const chatId = typeof user === "string" ? user : user.chatId;
                const username = user.telegramUsername || user.username || null;
                const firstName = user.firstName || null;
                const displayName = username
                  ? `@${username}`
                  : firstName || "Unknown";
                const code = user.code;
                return (
                  <tr
                    key={chatId}
                    className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
                  >
                    <td className="px-6 whitespace-nowrap">
                      <span className="text-sm text-theme-text-primary">
                        {displayName}
                      </span>
                    </td>
                    <td className="px-6 whitespace-nowrap">
                      <span className="text-sm text-theme-text-secondary">
                        {chatId}
                      </span>
                    </td>
                    {isPending && (
                      <td className="px-6 whitespace-nowrap">
                        <code className="bg-theme-bg-primary px-2 py-1 rounded text-theme-text-primary font-mono text-sm">
                          {code}
                        </code>
                      </td>
                    )}
                    <td className="px-6 flex items-center gap-x-6 h-full mt-1">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => onApprove(chatId)}
                            className="border-none flex items-center justify-center text-xs font-medium text-white/80 light:text-black/80 rounded-lg p-1 hover:bg-white hover:bg-opacity-10 hover:light:bg-green-50 hover:light:text-green-500 hover:text-green-300"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onDeny(chatId)}
                            className="border-none flex items-center justify-center text-xs font-medium text-white/80 light:text-black/80 rounded-lg p-1 hover:bg-white hover:bg-opacity-10 hover:light:bg-red-50 hover:light:text-red-500 hover:text-red-300"
                          >
                            Deny
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onRevoke(chatId)}
                          className="border-none flex items-center justify-center text-xs font-medium text-white/80 light:text-black/80 rounded-lg p-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateBotSection() {
  const qrSize = 180;
  const logoSize = { width: 35 * 1.2, height: 22 * 1.2 };

  return (
    <div className="flex flex-col gap-y-1">
      <p className="text-sm font-semibold text-theme-text-primary">
        Step 1: Create your Telegram bot
      </p>
      <p className="text-xs text-theme-text-secondary mb-3">
        Open @BotFather in Telegram, send{" "}
        <code className="bg-theme-bg-primary px-1 py-0.5 rounded text-theme-text-primary">
          /newbot
        </code>
        , follow the prompts, and copy the API token.
      </p>
      <div className="flex items-start gap-x-6 flex-wrap gap-y-4">
        <div className="flex flex-col items-center gap-y-2">
          <div className="bg-white/10 rounded-lg p-4 flex items-center justify-center">
            <QRCodeSVG
              value={BOTFATHER_URL}
              size={qrSize}
              bgColor="transparent"
              fgColor="white"
              level="L"
              imageSettings={{
                src: Logo,
                x: qrSize / 2 - logoSize.width / 2,
                y: qrSize / 2 - logoSize.height / 2,
                height: logoSize.height,
                width: logoSize.width,
                excavate: true,
              }}
            />
          </div>
          <p className="text-[10px] text-theme-text-secondary text-center">
            Scan to open @BotFather
          </p>
        </div>
        <div className="flex flex-col gap-y-3 pt-2">
          <a
            href={BOTFATHER_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-x-2 text-sm font-medium text-white bg-[#2AABEE] hover:bg-[#229ED9] rounded-lg px-4 py-2.5 w-fit transition-colors duration-200"
          >
            <TelegramLogo className="h-4 w-4" weight="fill" />
            Open BotFather
            <ArrowSquareOut className="h-3.5 w-3.5" />
          </a>
          <div className="flex flex-col gap-y-1.5 text-xs text-theme-text-secondary">
            <p>1. Open the link or scan the QR code</p>
            <p>
              2. Send{" "}
              <code className="bg-theme-bg-primary px-1 py-0.5 rounded text-theme-text-primary">
                /newbot
              </code>{" "}
              to @BotFather
            </p>
            <p>3. Choose a name and username for your bot</p>
            <p>4. Copy the API token you receive</p>
          </div>
        </div>
      </div>
    </div>
  );
}
