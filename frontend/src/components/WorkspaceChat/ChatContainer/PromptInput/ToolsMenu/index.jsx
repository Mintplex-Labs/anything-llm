import { useState, useRef, useEffect } from "react";
import { DotsThree, Plus, SquaresFour } from "@phosphor-icons/react";
import System from "@/models/system";
import Admin from "@/models/admin";
import AgentPlugins from "@/models/experimental/agentPlugins";
import AgentFlows from "@/models/agentFlows";
import { useModal } from "@/hooks/useModal";
import AddPresetModal from "../SlashCommands/SlashPresets/AddPresetModal";
import EditPresetModal from "../SlashCommands/SlashPresets/EditPresetModal";
import PublishEntityModal from "@/components/CommunityHub/PublishEntityModal";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import showToast from "@/utils/toast";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import Toggle from "@/components/lib/Toggle";

const TABS = {
  AGENT_SKILLS: "agent-skills",
  SLASH_COMMANDS: "slash-commands",
  TEXT_SIZE: "text-size",
};

// Default skills are enabled by default; toggling adds to disabled_agent_skills
const DEFAULT_SKILL_NAMES = [
  "rag-memory",
  "document-summarizer",
  "web-scraping",
];

// All built-in skills with display names
const ALL_SKILLS = {
  "rag-memory": "RAG & long-term memory",
  "document-summarizer": "View & summarize documents",
  "web-scraping": "Scrape websites",
  "save-file-to-browser": "Generate & save files",
  "create-chart": "Generate charts",
  "web-browsing": "Web Search",
  "sql-agent": "SQL Connector",
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
        <TabButton
          active={activeTab === TABS.TEXT_SIZE}
          onClick={() => setActiveTab(TABS.TEXT_SIZE)}
        >
          Text Size
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
        {activeTab === TABS.TEXT_SIZE && <TextSizeTab />}
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

function BrowseButton({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 h-6 rounded cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100"
    >
      <SquaresFour size={12} className="text-white light:text-slate-900" />
      <span className="text-xs text-white light:text-slate-900">Browse</span>
    </div>
  );
}

function SkillRow({ name, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-700/50 light:hover:bg-slate-100">
      <span className="text-xs text-white light:text-slate-900">{name}</span>
      <Toggle size="sm" enabled={enabled} onChange={onToggle} />
    </div>
  );
}

function AgentSkillsTab() {
  const [disabledDefaults, setDisabledDefaults] = useState([]);
  const [enabledConfigurable, setEnabledConfigurable] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkillSettings();
  }, []);

  async function fetchSkillSettings() {
    try {
      const [prefs, flowsRes] = await Promise.all([
        Admin.systemPreferencesByFields([
          "disabled_agent_skills",
          "default_agent_skills",
          "imported_agent_skills",
        ]),
        AgentFlows.listFlows(),
      ]);

      if (prefs?.settings) {
        setDisabledDefaults(prefs.settings.disabled_agent_skills ?? []);
        setEnabledConfigurable(prefs.settings.default_agent_skills ?? []);
        setImportedSkills(prefs.settings.imported_agent_skills ?? []);
      }
      if (flowsRes?.flows) setFlows(flowsRes.flows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function isSkillEnabled(skillName) {
    if (DEFAULT_SKILL_NAMES.includes(skillName))
      return !disabledDefaults.includes(skillName);
    return enabledConfigurable.includes(skillName);
  }

  async function toggleSkill(skillName) {
    let newDisabled = [...disabledDefaults];
    let newEnabled = [...enabledConfigurable];

    if (DEFAULT_SKILL_NAMES.includes(skillName)) {
      if (newDisabled.includes(skillName))
        newDisabled = newDisabled.filter((s) => s !== skillName);
      else newDisabled.push(skillName);
    } else {
      if (newEnabled.includes(skillName))
        newEnabled = newEnabled.filter((s) => s !== skillName);
      else newEnabled.push(skillName);
    }

    setDisabledDefaults(newDisabled);
    setEnabledConfigurable(newEnabled);

    await Admin.updateSystemPreferences({
      disabled_agent_skills: newDisabled.join(","),
      default_agent_skills: newEnabled.join(","),
    });
  }

  async function toggleImportedSkill(skill) {
    const newActive = !skill.active;
    setImportedSkills((prev) =>
      prev.map((s) =>
        s.hubId === skill.hubId ? { ...s, active: newActive } : s
      )
    );
    await AgentPlugins.toggleFeature(skill.hubId, newActive);
  }

  async function toggleFlow(flow) {
    const newActive = !flow.active;
    setFlows((prev) =>
      prev.map((f) => (f.uuid === flow.uuid ? { ...f, active: newActive } : f))
    );
    await AgentFlows.toggleFlow(flow.uuid, newActive);
  }

  if (loading) return null;

  return (
    <>
      {Object.entries(ALL_SKILLS).map(([key, name]) => (
        <SkillRow
          key={key}
          name={name}
          enabled={isSkillEnabled(key)}
          onToggle={() => toggleSkill(key)}
        />
      ))}
      {importedSkills.map((skill) => (
        <SkillRow
          key={skill.hubId}
          name={skill.name}
          enabled={skill.active}
          onToggle={() => toggleImportedSkill(skill)}
        />
      ))}
      {flows.map((flow) => (
        <SkillRow
          key={flow.uuid}
          name={flow.name}
          enabled={flow.active}
          onToggle={() => toggleFlow(flow)}
        />
      ))}
      <BrowseButton onClick={() => navigate(paths.communityHub.trending())} />
    </>
  );
}

function SlashCommandsTab({ sendCommand, setShowing, promptRef }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  const navigate = useNavigate();
  const {
    isOpen: isAddModalOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const {
    isOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: isPublishModalOpen,
    openModal: openPublishModal,
    closeModal: closePublishModal,
  } = useModal();
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [presetToPublish, setPresetToPublish] = useState(null);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    const presets = await System.getSlashCommandPresets();
    setPresets(presets);
  };

  const handleUseCommand = (text, autoSubmit = false) => {
    setShowing(false);
    sendCommand({ text, autoSubmit });
    promptRef?.current?.focus();
  };

  const handleSavePreset = async (preset) => {
    const { error } = await System.createSlashCommandPreset(preset);
    if (error) {
      showToast(error, "error");
      return false;
    }
    fetchPresets();
    closeAddModal();
    return true;
  };

  const handleEditPreset = (preset) => {
    setSelectedPreset(preset);
    openEditModal();
  };

  const handleUpdatePreset = async (updatedPreset) => {
    const { error } = await System.updateSlashCommandPreset(
      updatedPreset.id,
      updatedPreset
    );
    if (error) {
      showToast(error, "error");
      return;
    }
    fetchPresets();
    closeEditModal();
    setSelectedPreset(null);
  };

  const handleDeletePreset = async (presetId) => {
    await System.deleteSlashCommandPreset(presetId);
    fetchPresets();
    closeEditModal();
    setSelectedPreset(null);
  };

  const handlePublishPreset = (preset) => {
    setPresetToPublish({
      name: preset.command.slice(1),
      description: preset.description,
      command: preset.command,
      prompt: preset.prompt,
    });
    openPublishModal();
  };

  return (
    <>
      {/* Built-in /reset command */}
      {!isActiveAgentSession && (
        <SlashCommandRow
          command="/reset"
          description="Clear your chat history and begin a new chat"
          onClick={() => handleUseCommand("/reset", true)}
        />
      )}

      {/* Built-in /exit command (only during agent session) */}
      {isActiveAgentSession && (
        <SlashCommandRow
          command="/exit"
          description="Halt the current agent session"
          onClick={() => handleUseCommand("/exit", true)}
        />
      )}

      {/* User presets */}
      {presets.map((preset) => (
        <SlashCommandRow
          key={preset.id}
          command={preset.command}
          description={preset.description}
          onClick={() => handleUseCommand(`${preset.command} `)}
          onEdit={() => handleEditPreset(preset)}
          onPublish={() => handlePublishPreset(preset)}
          showMenu
        />
      ))}

      {/* Add new */}
      {!isActiveAgentSession && (
        <div
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100"
        >
          <Plus
            size={12}
            weight="bold"
            className="text-white light:text-slate-900"
          />
          <span className="text-xs text-white light:text-slate-900">
            Add new
          </span>
        </div>
      )}

      {/* Browse community hub */}
      <BrowseButton onClick={() => navigate(paths.communityHub.trending())} />

      {/* Modals */}
      <AddPresetModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSavePreset}
      />
      {selectedPreset && (
        <EditPresetModal
          isOpen={isEditModalOpen}
          onClose={() => {
            closeEditModal();
            setSelectedPreset(null);
          }}
          onSave={handleUpdatePreset}
          onDelete={handleDeletePreset}
          preset={selectedPreset}
        />
      )}
      <PublishEntityModal
        show={isPublishModalOpen}
        onClose={closePublishModal}
        entityType="slash-command"
        entity={presetToPublish}
      />
    </>
  );
}

function SlashCommandRow({
  command,
  description,
  onClick,
  onEdit,
  onPublish,
  showMenu = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-2 py-1 rounded cursor-pointer hover:bg-zinc-700/50 light:hover:bg-slate-100 group relative"
    >
      <div className="flex gap-1.5 items-center text-xs min-w-0 flex-1">
        <span className="text-white light:text-slate-900 shrink-0">
          {command}
        </span>
        <span className="text-zinc-400 light:text-slate-500 italic truncate">
          {description}
        </span>
      </div>

      {showMenu && (
        <div className="relative shrink-0 ml-1">
          <button
            ref={menuBtnRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="border-none cursor-pointer text-zinc-400 light:text-slate-500 p-0.5 hover:text-white light:hover:text-slate-900 rounded opacity-0 group-hover:opacity-100"
          >
            <DotsThree size={16} weight="bold" />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full z-50 bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-lg shadow-lg min-w-[120px] flex flex-col overflow-hidden"
            >
              <button
                type="button"
                className="border-none px-3 py-1.5 text-xs text-white light:text-slate-900 hover:bg-zinc-700 light:hover:bg-slate-100 cursor-pointer text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit?.();
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="border-none px-3 py-1.5 text-xs text-white light:text-slate-900 hover:bg-zinc-700 light:hover:bg-slate-100 cursor-pointer text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onPublish?.();
                }}
              >
                Publish
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TextSizeTab() {
  const [selectedSize, setSelectedSize] = useState(
    window.localStorage.getItem("anythingllm_text_size") || "normal"
  );

  function handleTextSizeChange(size) {
    setSelectedSize(size);
    window.localStorage.setItem("anythingllm_text_size", size);
    window.dispatchEvent(new CustomEvent("textSizeChange", { detail: size }));
  }

  const sizes = [
    { key: "small", label: "Small", textClass: "text-xs" },
    { key: "normal", label: "Normal", textClass: "text-sm" },
    { key: "large", label: "Large", textClass: "text-base" },
  ];

  return (
    <>
      {sizes.map(({ key, label, textClass }) => (
        <div
          key={key}
          onClick={() => handleTextSizeChange(key)}
          className={`flex items-center px-2 py-1 rounded cursor-pointer ${
            selectedSize === key
              ? "bg-zinc-700 light:bg-slate-200"
              : "hover:bg-zinc-700/50 light:hover:bg-slate-100"
          }`}
        >
          <span className={`${textClass} text-white light:text-slate-900`}>
            {label}
          </span>
        </div>
      ))}
    </>
  );
}
