import { useIsAgentSessionActive } from "@/utils/chat/agent";
import { useTranslation } from "react-i18next";

export default function EndAgentSession({ setShowing, sendCommand }) {
  const { t } = useTranslation();
  const isActiveAgentSession = useIsAgentSessionActive();
  if (!isActiveAgentSession) return null;

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/exit", true);
      }}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/exit</div>
        <div className="text-white text-opacity-60 text-sm">
          {t("endAgentSession.haltSession")}
        </div>
      </div>
    </button>
  );
}
