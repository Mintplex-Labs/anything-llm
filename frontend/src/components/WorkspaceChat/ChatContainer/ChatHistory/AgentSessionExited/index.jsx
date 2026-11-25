import { useTranslation } from "react-i18next";
import { Info } from "@phosphor-icons/react";

/**
 * Notice shown after the user ends an agent session with an exit command.
 */
export default function AgentSessionExited() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-start w-full">
      <div className="py-4 px-4 md:pl-0 flex items-center gap-x-1.5 text-xs font-mono italic text-zinc-400 light:text-slate-500">
        <Info className="h-4 w-4 shrink-0" />
        <p className="!m-0">{t("chat.agent_session_exited")}</p>
      </div>
    </div>
  );
}
