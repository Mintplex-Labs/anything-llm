import { useEffect, useState } from "react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import AddPresetModal from "./AddPresetModal";
import EditPresetModal from "./EditPresetModal";
import { useModal } from "@/hooks/useModal";
import System from "@/models/system";
import { DotsThree, Plus } from "@phosphor-icons/react";
import showToast from "@/utils/toast";

export const CMD_REGEX = new RegExp(/[^a-zA-Z0-9_-]/g);
export default function SlashPresets({ setShowing, sendCommand }) {
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
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    fetchPresets();
  }, []);
  if (isActiveAgentSession) return null;

  const fetchPresets = async () => {
    const presets = await System.getSlashCommandPresets();
    setPresets(presets);
  };

  const handleSavePreset = async (preset) => {
    const { error } = await System.createSlashCommandPreset(preset);
    if (!!error) {
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

    if (!!error) {
      showToast(error, "error");
      return;
    }

    fetchPresets();
    closeEditModalAndResetPreset();
  };

  const handleDeletePreset = async (presetId) => {
    await System.deleteSlashCommandPreset(presetId);
    fetchPresets();
    closeEditModalAndResetPreset();
  };

  const closeEditModalAndResetPreset = () => {
    closeEditModal();
    setSelectedPreset(null);
  };

  return (
    <>
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => {
            setShowing(false);
            sendCommand(`${preset.command} `, false);
          }}
          className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-row justify-start"
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-white text-sm font-bold">{preset.command}</div>
            <div className="text-white text-opacity-60 text-sm">
              {preset.description}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditPreset(preset);
            }}
            className="text-white text-sm p-1 hover:cursor-pointer hover:bg-zinc-900 rounded-full mt-1"
          >
            <DotsThree size={24} weight="bold" />
          </button>
        </button>
      ))}
      <button
        onClick={openAddModal}
        className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded-xl flex flex-col justify-start"
      >
        <div className="w-full flex-row flex pointer-events-none items-center gap-2">
          <Plus size={24} weight="fill" fill="white" />
          <div className="text-white text-sm font-medium">Add New Preset </div>
        </div>
      </button>
      <AddPresetModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSave={handleSavePreset}
      />
      {selectedPreset && (
        <EditPresetModal
          isOpen={isEditModalOpen}
          onClose={closeEditModalAndResetPreset}
          onSave={handleUpdatePreset}
          onDelete={handleDeletePreset}
          preset={selectedPreset}
        />
      )}
    </>
  );
}
