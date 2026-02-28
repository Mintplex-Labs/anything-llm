import { useState, useEffect } from "react";
import { Plus } from "@phosphor-icons/react";
import System from "@/models/system";
import { useModal } from "@/hooks/useModal";
import AddPresetModal from "../../../SlashCommands/SlashPresets/AddPresetModal";
import EditPresetModal from "../../../SlashCommands/SlashPresets/EditPresetModal";
import PublishEntityModal from "@/components/CommunityHub/PublishEntityModal";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import SlashCommandRow from "./SlashCommandRow";
import BrowseButton from "../../BrowseButton";

export default function SlashCommandsTab({
  sendCommand,
  setShowing,
  promptRef,
}) {
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
      <BrowseButton link={paths.communityHub.trending()} />

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
