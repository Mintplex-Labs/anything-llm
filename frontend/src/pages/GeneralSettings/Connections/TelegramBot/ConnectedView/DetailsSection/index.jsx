import { useState } from "react";
import { CircleNotch } from "@phosphor-icons/react";
import Telegram from "@/models/telegram";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function DetailsSection({ config, onDisconnected }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-[18px]">
      <p className="text-base font-semibold text-white light:text-slate-900">
        Details
      </p>
      <div className="border border-zinc-700 light:border-slate-200 rounded-xl p-4 w-[700px]">
        <div className="flex flex-col gap-y-4 text-sm">
          <DetailRow
            label={t("telegram.connected.workspace")}
            value={config.default_workspace}
          />
          <DetailRow label="Thread" value={config.active_thread_name} />
          <DetailRow label="Model" value={config.chat_model} />
          <DetailRow
            label={t("telegram.connected.bot-link")}
            value={
              <Link
                to={`https://t.me/${config.bot_username}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 light:text-blue-500 underline"
              >
                t.me/{config.bot_username}
              </Link>
            }
          />
        </div>
      </div>
      <DisconnectButton onDisconnected={onDisconnected} />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between">
      <span className="font-medium text-white light:text-slate-900">
        {label}
      </span>
      <span className="text-zinc-300 light:text-slate-700">{value}</span>
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
      className="flex items-center justify-center gap-x-2 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-950 light:text-white rounded-lg h-9 px-5 w-fit hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
