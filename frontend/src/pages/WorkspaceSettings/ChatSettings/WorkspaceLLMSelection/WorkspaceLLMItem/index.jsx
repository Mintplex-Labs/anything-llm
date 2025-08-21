// This component differs from the main LLMItem in that it shows if a provider is
// "ready for use" and if not - will then highjack the click handler to show a modal
// of the provider options that must be saved to continue.
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { X, Gear } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";

const NO_SETTINGS_NEEDED = ["default"];
export default function WorkspaceLLM({
  llm,
  availableLLMs,
  settings,
  checked,
  onClick,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const { name, value, logo, description } = llm;
  const [currentSettings, setCurrentSettings] = useState(settings);

  useEffect(() => {
    async function getSettings() {
      if (isOpen) {
        const _settings = await System.keys();
        setCurrentSettings(_settings ?? {});
      }
    }
    getSettings();
  }, [isOpen]);

  function handleProviderSelection() {
    // Determine if provider needs additional setup because its minimum required keys are
    // not yet set in settings.
    if (!checked) {
      const requiresAdditionalSetup = (llm.requiredConfig || []).some(
        (key) => !currentSettings[key]
      );
      if (requiresAdditionalSetup) {
        openModal();
        return;
      }
      onClick(value);
    }
  }

  return (
    <>
      <div
        onClick={handleProviderSelection}
        className={`w-full p-2 rounded-md hover:cursor-pointer hover:bg-theme-bg-secondary ${
          checked ? "bg-theme-bg-secondary" : ""
        }`}
      >
        <input
          type="checkbox"
          value={value}
          className="peer hidden"
          checked={checked}
          readOnly={true}
          formNoValidate={true}
        />
        <div className="flex gap-x-4 items-center justify-between">
          <div className="flex gap-x-4 items-center">
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-10 h-10 rounded-md"
            />
            <div className="flex flex-col">
              <div className="text-sm font-semibold text-white">{name}</div>
              <div className="mt-1 text-xs text-white/60">{description}</div>
            </div>
          </div>
          {checked && !NO_SETTINGS_NEEDED.includes(value) && (
            <button
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
              className="p-2 text-white/60 hover:text-white hover:bg-theme-bg-hover rounded-md transition-all duration-300"
              title="Edit Settings"
            >
              <Gear size={20} weight="bold" />
            </button>
          )}
        </div>
      </div>
      <SetupProvider
        availableLLMs={availableLLMs}
        isOpen={isOpen}
        provider={value}
        closeModal={closeModal}
        postSubmit={onClick}
        settings={currentSettings}
      />
    </>
  );
}

function SetupProvider({
  availableLLMs,
  isOpen,
  provider,
  closeModal,
  postSubmit,
  settings,
}) {
  if (!isOpen) return null;
  const LLMOption = availableLLMs.find((llm) => llm.value === provider);
  if (!LLMOption) return null;

  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save ${LLMOption.name} settings: ${error}`, "error");
      return;
    }

    closeModal();
    postSubmit();
    return false;
  }

  // Cannot do nested forms, it will cause all sorts of issues, so we portal this out
  // to the parent container form so we don't have nested forms.
  return createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
          <div className="relative p-6 border-b rounded-t border-theme-modal-border">
            <div className="w-full flex gap-x-2 items-center">
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                {LLMOption.name} Settings
              </h3>
            </div>
            <button
              onClick={closeModal}
              type="button"
              className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={24} weight="bold" className="text-white" />
            </button>
          </div>
          <form id="provider-form" onSubmit={handleUpdate}>
            <div className="px-7 py-6">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
                <p className="text-sm text-white/60">
                  To use {LLMOption.name} as this workspace's LLM you need to
                  set it up first.
                </p>
                <div>
                  {LLMOption.options(settings, { credentialsOnly: true })}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border px-7 pb-6">
              <button
                type="button"
                onClick={closeModal}
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="provider-form"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Save settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>,
    document.getElementById("workspace-chat-settings-container")
  );
}
