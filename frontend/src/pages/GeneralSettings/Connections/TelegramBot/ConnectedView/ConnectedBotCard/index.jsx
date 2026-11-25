import { TelegramLogo } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function ConnectedBotCard({ config }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-[18px]">
      <p className="text-base font-semibold text-white light:text-slate-900">
        Connected Bot
      </p>
      <div className="flex items-start gap-x-1 border border-zinc-700 light:border-slate-200 rounded-xl p-3 w-[700px]">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#00ADEC] shrink-0">
          <TelegramLogo className="h-5 w-5 !text-white" weight="fill" />
        </div>
        <div className="flex flex-col gap-y-1 ml-1">
          <p className="text-sm font-semibold text-white light:text-slate-900">
            @{config.bot_username}
          </p>
          <p className="text-xs text-zinc-400 light:text-slate-600">
            {t("telegram.connected.status")}
          </p>
        </div>
      </div>
    </div>
  );
}
