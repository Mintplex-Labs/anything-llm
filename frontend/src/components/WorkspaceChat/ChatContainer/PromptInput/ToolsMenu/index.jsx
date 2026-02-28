import { useState, useRef, useEffect } from "react";
import AgentSkillsTab from "./Tabs/AgentSkills";
import SlashCommandsTab from "./Tabs/SlashCommands";

const TABS = {
  AGENT_SKILLS: "agent-skills",
  SLASH_COMMANDS: "slash-commands",
};

const VIEWPORT_PADDING = 16;
const GAP = 8;
const TABS_HEIGHT = 44; // approximate height of tab bar + gap

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
  const menuRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TABS.AGENT_SKILLS);
  const [style, setStyle] = useState({});

  // Position the menu relative to the Tools button and clamp to viewport
  useEffect(() => {
    if (!showing) return;
    const btn = document.getElementById("tools-btn");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    // Use the chat box container's top edge so the popup sits above the whole input
    const chatBox = btn.closest("[class*='rounded-[20px]']");
    const boxRect = chatBox ? chatBox.getBoundingClientRect() : rect;
    const pos = { left: rect.left };

    if (centered) {
      pos.top = rect.bottom + GAP;
      pos.maxHeight = window.innerHeight - pos.top - VIEWPORT_PADDING;
    } else {
      pos.bottom = window.innerHeight - boxRect.top + GAP;
      pos.maxHeight = boxRect.top - GAP - VIEWPORT_PADDING;
    }

    setStyle(pos);
  }, [showing, centered]);

  useEffect(() => {
    if (!showing) return;
    function handleClickOutside(e) {
      if (e.target.closest("#tools-btn")) return;
      // Don't close if clicking inside a modal overlay (portaled modals)
      if (document.querySelector(".backdrop-blur-sm")) return;
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowing(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showing]);

  if (!showing) return null;

  const contentMaxHeight = style.maxHeight
    ? style.maxHeight - TABS_HEIGHT - 24
    : 300;

  return (
    <div
      ref={menuRef}
      style={style}
      className="fixed z-50 bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg p-3 w-[400px] flex flex-col gap-2.5 shadow-lg"
    >
      <div className="flex gap-2.5 items-center">
        <TabButton
          active={activeTab === TABS.AGENT_SKILLS}
          onClick={() => setActiveTab(TABS.AGENT_SKILLS)}
        >
          Agent Skills
        </TabButton>
        <TabButton
          active={activeTab === TABS.SLASH_COMMANDS}
          onClick={() => setActiveTab(TABS.SLASH_COMMANDS)}
        >
          Slash Commands
        </TabButton>
      </div>

      <div
        className="flex flex-col gap-1 overflow-y-auto no-scroll"
        style={{ maxHeight: contentMaxHeight }}
      >
        {activeTab === TABS.AGENT_SKILLS && <AgentSkillsTab />}
        {activeTab === TABS.SLASH_COMMANDS && (
          <SlashCommandsTab
            sendCommand={sendCommand}
            setShowing={setShowing}
            promptRef={promptRef}
          />
        )}
      </div>
    </div>
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
