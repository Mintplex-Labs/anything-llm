import { useState } from "react";
import { useTranslation } from "react-i18next";
import AgentSkillsTab from "./Tabs/AgentSkills";
import SlashCommandsTab from "./Tabs/SlashCommands";

const TABS = [
  {
    key: "slash-commands",
    labelKey: "chat_window.slash_commands",
    component: SlashCommandsTab,
  },
  {
    key: "agent-skills",
    labelKey: "chat_window.agent_skills",
    component: AgentSkillsTab,
  },
];

/**
 * @param {boolean} props.showing
 * @param {function} props.setShowing
 * @param {function} props.sendCommand
 * @param {object} props.promptRef
 * @param {boolean} [props.centered] - when true, popup opens below the input
 */
export default function ToolsMenu({
  showing,
  setShowing,
  sendCommand,
  promptRef,
  centered = false,
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  if (!showing) return null;

  const { component: ActiveTab } = TABS.find((tab) => tab.key === activeTab);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setShowing(false)} />
      <div
        className={`absolute left-2 right-2 md:left-14 md:right-auto md:w-[400px] z-50 bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg p-3 flex flex-col gap-2.5 shadow-lg overflow-hidden ${
          centered
            ? "top-full mt-2 max-h-[min(360px,calc(100dvh-25rem))]"
            : "bottom-full mb-2 max-h-[min(360px,calc(100dvh-11rem))]"
        }`}
      >
        <div className="flex shrink-0 gap-2.5 items-center">
          {TABS.map(({ key, labelKey }) => (
            <TabButton
              key={key}
              active={activeTab === key}
              onClick={() => setActiveTab(key)}
            >
              {t(labelKey)}
            </TabButton>
          ))}
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto no-scroll flex-1 min-h-0">
          <ActiveTab
            sendCommand={sendCommand}
            setShowing={setShowing}
            promptRef={promptRef}
          />
        </div>
      </div>
    </>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-none cursor-pointer px-1.5 py-0.5 rounded text-[10px] font-medium text-center whitespace-nowrap ${
        active
          ? "bg-zinc-700 text-white light:bg-slate-200 light:text-slate-800"
          : "text-zinc-400 light:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
