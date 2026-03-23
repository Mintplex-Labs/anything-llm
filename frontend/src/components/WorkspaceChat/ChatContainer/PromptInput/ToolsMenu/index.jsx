import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useUser from "@/hooks/useUser";
import AgentSkillsTab from "./Tabs/AgentSkills";
import SlashCommandsTab from "./Tabs/SlashCommands";

export const TOOLS_MENU_KEYBOARD_EVENT = "tools-menu-keyboard";
function getTabs(t, user) {
  const tabs = [
    {
      key: "slash-commands",
      label: t("chat_window.slash_commands"),
      component: SlashCommandsTab,
    },
  ];

  // Only show agent skills tab for admins or when multiuser mode is off
  const canSeeAgentSkills =
    !user?.hasOwnProperty("role") || user.role === "admin";
  if (canSeeAgentSkills) {
    tabs.push({
      key: "agent-skills",
      label: t("chat_window.agent_skills"),
      component: AgentSkillsTab,
    });
  }

  return tabs;
}

/**
 * @param {Workspace} props.workspace - the workspace object
 * @param {boolean} props.showing
 * @param {function} props.setShowing
 * @param {function} props.sendCommand
 * @param {object} props.promptRef
 * @param {boolean} [props.centered] - when true, popup opens below the input
 */
export default function ToolsMenu({
  workspace,
  showing,
  setShowing,
  sendCommand,
  promptRef,
  centered = false,
  highlightedIndexRef,
}) {
  const { t } = useTranslation();
  const { user } = useUser();
  const TABS = useMemo(() => getTabs(t, user), [t, user]);
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const itemCountRef = useRef(0);

  // Always open to the slash commands
  useEffect(() => {
    if (showing) setActiveTab(TABS[0].key);
  }, [showing]);

  // Reset highlight when switching tabs or closing
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [activeTab, showing]);

  // Keep the parent ref in sync so PromptInput can check it on Enter
  useEffect(() => {
    if (highlightedIndexRef) highlightedIndexRef.current = highlightedIndex;
  }, [highlightedIndex]);

  const registerItemCount = useCallback((count) => {
    itemCountRef.current = count;
  }, []);

  useEffect(() => {
    if (!showing) return;

    function handleKeyboard(e) {
      const { key } = e.detail;

      if (key === "ArrowLeft" || key === "ArrowRight") {
        const currentIdx = TABS.findIndex((tab) => tab.key === activeTab);
        const nextIdx =
          key === "ArrowLeft"
            ? (currentIdx - 1 + TABS.length) % TABS.length
            : (currentIdx + 1) % TABS.length;
        setActiveTab(TABS[nextIdx].key);
        return;
      }

      if (key === "ArrowUp" || key === "ArrowDown") {
        const count = itemCountRef.current;
        if (count === 0) return;
        setHighlightedIndex((prev) => {
          if (key === "ArrowDown") {
            return prev < count - 1 ? prev + 1 : 0;
          }
          return prev > 0 ? prev - 1 : count - 1;
        });
        return;
      }

      // Enter is handled by the tab components via highlightedIndex
    }

    window.addEventListener(TOOLS_MENU_KEYBOARD_EVENT, handleKeyboard);
    return () =>
      window.removeEventListener(TOOLS_MENU_KEYBOARD_EVENT, handleKeyboard);
  }, [showing, activeTab]);

  if (!showing) return null;

  const { component: ActiveTab } = TABS.find((tab) => tab.key === activeTab);

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShowing(false)}
      />
      <div
        onMouseDown={(e) => {
          // Prevents prompt textarea from losing focus when clicking inside the menu.
          // Skip for portaled modals so their inputs can still receive focus.
          if (e.currentTarget.contains(e.target)) e.preventDefault();
        }}
        className={`absolute left-2 right-2 md:left-14 md:right-auto md:w-[400px] z-50 bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg p-3 flex flex-col gap-2.5 shadow-lg overflow-hidden ${
          centered
            ? "top-full mt-2 max-h-[min(360px,calc(100dvh-25rem))]"
            : "bottom-full mb-2 max-h-[min(360px,calc(100dvh-11rem))]"
        }`}
      >
        <div className="flex shrink-0 gap-2.5 items-center">
          {TABS.map((tab) => (
            <TabButton
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto no-scroll flex-1 min-h-0">
          <ActiveTab
            sendCommand={sendCommand}
            setShowing={setShowing}
            promptRef={promptRef}
            highlightedIndex={highlightedIndex}
            registerItemCount={registerItemCount}
            workspace={workspace}
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
      className={`border-none cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-center whitespace-nowrap ${
        active
          ? "bg-zinc-700 text-white light:bg-slate-200 light:text-slate-800"
          : "text-zinc-400 light:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
