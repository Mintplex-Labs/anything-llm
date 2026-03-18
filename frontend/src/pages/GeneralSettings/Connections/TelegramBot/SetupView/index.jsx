import { useState } from "react";
import { CircleNotch, TelegramLogo } from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import CreateBotSection from "./CreateBotSection";
import { useTranslation } from "react-i18next";

export default function SetupView({ workspaces, onConnected }) {
  const { t } = useTranslation();
  const [botToken, setBotToken] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(
    workspaces[0]?.slug || ""
  );
  const [connecting, setConnecting] = useState(false);

  async function handleConnect(e) {
    e.preventDefault();
    if (!botToken.trim())
      return showToast(t("telegram.setup.toast-enter-token"), "error");
    if (!selectedWorkspace)
      return showToast(t("telegram.setup.toast-select-workspace"), "error");

    setConnecting(true);
    const res = await Telegram.connect(botToken.trim(), selectedWorkspace);
    setConnecting(false);

    if (!res.success) {
      showToast(res.error || t("telegram.setup.toast-connect-failed"), "error");
      return;
    }

    showToast(t("telegram.setup.toast-connect-success"), "success");
    onConnected({
      active: true,
      connected: true,
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
            {t("telegram.setup.step2.title")}
          </p>
          <p className="text-xs text-theme-text-secondary">
            {t("telegram.setup.step2.description")}
          </p>
        </div>
        <div className="flex flex-col gap-y-4 max-w-[480px]">
          <div className="flex flex-col gap-y-1">
            <label className="text-xs font-medium text-theme-text-secondary">
              {t("telegram.setup.step2.bot-token")}
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
              {t("telegram.setup.step2.default-workspace")}
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
                {t("telegram.setup.step2.connecting")}
              </>
            ) : (
              <>
                <TelegramLogo className="h-4 w-4" weight="bold" />
                {t("telegram.setup.step2.connect-bot")}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
