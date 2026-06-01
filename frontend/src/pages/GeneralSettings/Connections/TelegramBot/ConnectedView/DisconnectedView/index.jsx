import { useState } from "react";
import {
  CircleNotch,
  Eye,
  EyeSlash,
  TelegramLogo,
} from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function DisconnectedView({
  config,
  onReconnected,
  newToken,
  setNewToken,
}) {
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
    const configRes = await Telegram.getConfig();
    onReconnected(configRes?.config);
  }

  return (
    <div className="flex flex-col gap-y-8 mt-8">
      <div className="flex flex-col gap-y-[18px]">
        <p className="text-base font-semibold text-white light:text-slate-900">
          Connected Bot
        </p>
        <div className="flex items-start gap-x-1 border border-red-500/30 light:border-red-300 rounded-xl p-3 w-[700px]">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-500/20 shrink-0">
            <TelegramLogo
              className="h-5 w-5 text-red-400 light:text-red-500"
              weight="fill"
            />
          </div>
          <div className="flex flex-col gap-y-1 ml-1">
            <p className="text-sm font-semibold text-white light:text-slate-900">
              @{config.bot_username}
            </p>
            <p className="text-xs text-red-400 light:text-red-500">
              {t("telegram.connected.status-disconnected")}
            </p>
          </div>
        </div>
        <form
          onSubmit={handleReconnect}
          className="flex items-end gap-x-2 w-[700px]"
        >
          <div className="bg-zinc-800 light:bg-white light:border light:border-slate-300 h-8 rounded-lg px-3.5 flex items-center gap-x-2 flex-1">
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-zinc-400 light:text-slate-500 hover:text-zinc-300 light:hover:text-slate-700 transition-colors shrink-0"
            >
              <Icon className="h-4 w-4" />
            </button>
            <input
              type={showToken ? "text" : "password"}
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder={t("telegram.connected.placeholder-token")}
              className="bg-transparent flex-1 text-sm text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 outline-none min-w-0"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={reconnecting}
            className="flex items-center justify-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-8 px-5 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
