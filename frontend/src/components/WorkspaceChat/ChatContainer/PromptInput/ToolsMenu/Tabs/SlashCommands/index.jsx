import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import { useModal } from "@/hooks/useModal";
import AddPresetModal from "./SlashPresets/AddPresetModal";
import EditPresetModal from "./SlashPresets/EditPresetModal";
import PublishEntityModal from "@/components/CommunityHub/PublishEntityModal";
import showToast from "@/utils/toast";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import { PROMPT_INPUT_EVENT } from "@/components/WorkspaceChat/ChatContainer/PromptInput";
import useToolsMenuItems from "../../useToolsMenuItems";
import SlashCommandRow from "./SlashCommandRow";

export default function SlashCommandsTab({
  sendCommand,
  setShowing,
  promptRef,
  highlightedIndex = -1,
  registerItemCount,
}) {
  const { t } = useTranslation();
  const isActiveAgentSession = useIsAgentSessionActive();
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

  // Build the list of selectable items for keyboard navigation and rendering
  // Command names must stay as static English strings since the backend
  // matches against exact "/reset" and "/exit" commands.
  const items = useMemo(() => {
    const builtIn = isActiveAgentSession
      ? {
          command: "/exit",
          description: t("chat_window.preset_exit_description"),
          autoSubmit: true,
        }
      : {
          command: "/reset",
          description: t("chat_window.preset_reset_description"),
          autoSubmit: true,
        };

    return [
      builtIn,
      ...presets.map((preset) => ({
        command: preset.command,
        description: preset.description,
        autoSubmit: false,
        preset,
      })),
    ];
  }, [isActiveAgentSession, presets]);

  const handleUseCommand = useCallback(
    (command, autoSubmit = false) => {
      setShowing(false);

      // Auto-submit commands (/reset, /exit) fire immediately
      if (autoSubmit) {
        sendCommand({ text: command, autoSubmit: true });
        promptRef?.current?.focus();
        return;
      }

      // Insert the command at the cursor, replacing a trailing "/" if present
      const textarea = promptRef?.current;
      if (!textarea) return;
      const cursor = textarea.selectionStart;
      const value = textarea.value;
      const charBefore = cursor > 0 ? value[cursor - 1] : "";
      const insertStart = charBefore === "/" ? cursor - 1 : cursor;
      const newValue =
        value.slice(0, insertStart) + command + value.slice(cursor);

      window.dispatchEvent(
        new CustomEvent(PROMPT_INPUT_EVENT, {
          detail: { messageContent: newValue },
        })
      );
      textarea.focus();
      const newCursor = insertStart + command.length;
      setTimeout(() => textarea.setSelectionRange(newCursor, newCursor), 0);
    },
    [sendCommand, setShowing, promptRef]
  );

  useToolsMenuItems({
    items,
    highlightedIndex,
    onSelect: (item) => {
      const text = item.preset ? `${item.command} ` : item.command;
      handleUseCommand(text, item.autoSubmit);
    },
    registerItemCount,
  });

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
      {items.map((item, index) => (
        <SlashCommandRow
          key={item.preset?.id ?? item.command}
          command={item.command}
          description={item.description}
          onClick={() =>
            handleUseCommand(
              item.preset ? `${item.command} ` : item.command,
              item.autoSubmit
            )
          }
          onEdit={item.preset ? () => handleEditPreset(item.preset) : undefined}
          onPublish={
            item.preset ? () => handlePublishPreset(item.preset) : undefined
          }
          showMenu={!!item.preset}
          highlighted={highlightedIndex === index}
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
            {t("chat_window.add_new")}
          </span>
        </div>
      )}

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
