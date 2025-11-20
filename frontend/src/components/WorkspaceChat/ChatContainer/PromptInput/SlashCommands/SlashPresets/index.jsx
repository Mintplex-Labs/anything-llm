import { useEffect, useState, useRef } from "react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";
import AddPresetModal from "./AddPresetModal";
import EditPresetModal from "./EditPresetModal";
import { useModal } from "@/hooks/useModal";
import System from "@/models/system";
import { DotsThree, Plus } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublishEntityModal from "@/components/CommunityHub/PublishEntityModal";

export const CMD_REGEX = new RegExp(/[^a-zA-Z0-9_-]/g);
export default function SlashPresets({ setShowing, sendCommand, promptRef }) {
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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchPresets();
  }, []);

  /*
   * @checklist-item
   * If the URL has the slash-commands param, open the add modal for the user
   * automatically when the component mounts.
   */
  useEffect(() => {
    if (
      searchParams.get("action") === "open-new-slash-command-modal" &&
      !isAddModalOpen
    )
      openAddModal();
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
      {presets.map((preset) => (
        <PresetItem
          key={preset.id}
          preset={preset}
          onUse={() => {
            setShowing(false);
            sendCommand({ text: `${preset.command} ` });
            promptRef?.current?.focus();
          }}
          onEdit={handleEditPreset}
          onPublish={handlePublishPreset}
        />
      ))}
      <button
        onClick={openAddModal}
        className="border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-1 rounded-xl flex flex-col justify-start"
      >
        <div className="w-full flex-row flex pointer-events-none items-center gap-2">
          <Plus size={24} weight="fill" className="text-theme-text-primary" />
          <div className="text-theme-text-primary text-sm font-medium">
            {t("chat_window.add_new_preset")}
          </div>
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
      <PublishEntityModal
        show={isPublishModalOpen}
        onClose={closePublishModal}
        entityType="slash-command"
        entity={presetToPublish}
      />
    </>
  );
}

function PresetItem({ preset, onUse, onEdit, onPublish }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <button
      type="button"
      data-slash-command={preset.command}
      onClick={onUse}
      className="border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-2 rounded-xl flex flex-row justify-start items-center relative"
    >
      <div className="flex-col text-left flex pointer-events-none flex-1 min-w-0">
        <div className="text-theme-text-primary text-sm font-bold truncate">
          {preset.command}
        </div>
        <div className="text-theme-text-secondary text-sm truncate">
          {preset.description}
        </div>
      </div>
      <button
        ref={menuButtonRef}
        type="button"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="border-none text-theme-text-primary text-sm p-1 hover:cursor-pointer hover:bg-theme-action-menu-item-hover rounded-full ml-2 flex-shrink-0 z-20"
        aria-label="More actions"
      >
        <DotsThree size={24} weight="bold" />
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-10 bg-theme-bg-popup-menu rounded-lg z-50 min-w-[160px] shadow-lg border border-theme-modal-border flex flex-col"
        >
          <button
            type="button"
            className="px-[10px] py-[6px] text-sm text-white hover:bg-theme-sidebar-item-hover rounded-t-lg cursor-pointer border-none w-full text-left whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onEdit(preset);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="px-[10px] py-[6px] text-sm text-white hover:bg-theme-sidebar-item-hover rounded-b-lg cursor-pointer border-none w-full text-left whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onPublish(preset);
            }}
          >
            Publish
          </button>
        </div>
      )}
    </button>
  );
}
