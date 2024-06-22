// This component differs from the main LLMItem in that it shows if a provider is
// "ready for use" and if not - will then highjack the click handler to show a modal
// of the provider options that must be saved to continue.
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { X } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function WorkspaceLLM({
  llm,
  availableLLMs,
  settings,
  checked,
  onClick,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const { name, value, logo, description } = llm;

  function handleProviderSelection() {
    // Determine if provider needs additional setup because its minimum required keys are
    // not yet set in settings.
    const requiresAdditionalSetup = (llm.requiredConfig || []).some(
      (key) => !settings[key]
    );
    if (requiresAdditionalSetup) {
      openModal();
      return;
    }
    onClick(value);
  }

  return (
    <>
      <div
        onClick={handleProviderSelection}
        className={`w-full p-2 rounded-md hover:cursor-pointer hover:bg-white/10 ${
          checked ? "bg-white/10" : ""
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
        <div className="flex gap-x-4 items-center">
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-10 h-10 rounded-md"
          />
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-white">{name}</div>
            <div className="mt-1 text-xs text-description">{description}</div>
          </div>
        </div>
      </div>
      <SetupProvider
        availableLLMs={availableLLMs}
        isOpen={isOpen}
        provider={value}
        closeModal={closeModal}
        postSubmit={onClick}
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
      <div className="relative w-fit max-w-1/2 max-h-full">
        <div className="relative bg-main-gradient rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">
              Setup {LLMOption.name}
            </h3>
            <button
              onClick={closeModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>

          <form id="provider-form" onSubmit={handleUpdate}>
            <div className="py-[17px] px-[20px] flex flex-col gap-y-6">
              <p className="text-sm text-white">
                To use {LLMOption.name} as this workspace's LLM you need to set
                it up first.
              </p>
              <div>{LLMOption.options({ credentialsOnly: true })}</div>
            </div>
            <div className="flex w-full justify-between items-center p-3 space-x-2 border-t rounded-b border-gray-500/50">
              <button
                type="button"
                onClick={closeModal}
                className="text-xs px-2 py-1 font-semibold rounded-lg bg-white hover:bg-transparent border-2 border-transparent hover:border-white hover:text-white h-[32px] w-fit -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="provider-form"
                className="text-xs px-2 py-1 font-semibold rounded-lg bg-primary-button hover:bg-secondary border-2 border-transparent hover:border-[#46C8FF] hover:text-white h-[32px] w-fit -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              >
                Save {LLMOption.name} settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>,
    document.getElementById("workspace-chat-settings-container")
  );
}
