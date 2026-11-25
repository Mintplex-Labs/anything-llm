import { useState } from "react";
import {
  CircleNotch,
  Eye,
  EyeSlash,
  TelegramLogo,
} from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import CreateBotSection from "./CreateBotSection";
import { useTranslation } from "react-i18next";

export default function SetupView({ onConnected }) {
  const { t } = useTranslation();
  const [botToken, setBotToken] = useState("");
  const [connecting, setConnecting] = useState(false);

  async function handleConnect(e) {
    e.preventDefault();
    if (!botToken.trim())
      return showToast(t("telegram.setup.toast-enter-token"), "error");

    setConnecting(true);
    const res = await Telegram.connect(botToken.trim());
    setConnecting(false);

    if (!res.success) {
      showToast(res.error || t("telegram.setup.toast-connect-failed"), "error");
      return;
    }

    const configRes = await Telegram.getConfig();
    onConnected(configRes?.config);
  }

  return (
    <div className="flex flex-col gap-y-8 mt-8">
      <CreateBotSection />
      <form onSubmit={handleConnect} className="flex flex-col gap-y-[18px]">
        <div className="flex flex-col gap-y-2">
          <p className="text-sm light:text-base font-semibold text-white light:text-slate-900">
            {t("telegram.setup.step2.title")}
          </p>
          <p className="text-xs text-zinc-400 light:text-slate-600 max-w-[700px]">
            {t("telegram.setup.step2.description")}
          </p>
        </div>
        <BotTokenInput botToken={botToken} setBotToken={setBotToken} />
        <button
          type="submit"
          disabled={connecting}
          className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 w-fit hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {connecting ? (
            <>
              <CircleNotch className="h-4 w-4 animate-spin" />
              {t("telegram.setup.step2.connecting")}
            </>
          ) : (
            <>
              <TelegramLogo className="h-5 w-5" weight="fill" />
              {t("telegram.setup.step2.connect-bot")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function BotTokenInput({ botToken, setBotToken }) {
  const { t } = useTranslation();
  const [showToken, setShowToken] = useState(false);
  const Icon = showToken ? Eye : EyeSlash;

  return (
    <div className="flex flex-col gap-y-1.5 w-[320px]">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {t("telegram.setup.step2.bot-token")}
      </label>
      <div className="bg-zinc-800 light:bg-white light:border light:border-slate-300 h-8 rounded-lg px-3.5 flex items-center gap-x-2">
        <button
          type="button"
          onClick={() => setShowToken(!showToken)}
          className="text-zinc-400 light:text-slate-500 hover:text-zinc-300 light:hover:text-slate-700 transition-colors shrink-0"
        >
          <Icon className="h-4 w-4" />
        </button>
        <input
          type={showToken ? "text" : "password"}
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          placeholder="123456:ABC-DEF123ghlkl-zyx57W2v"
          className="bg-transparent flex-1 text-sm text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 outline-none min-w-0"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
