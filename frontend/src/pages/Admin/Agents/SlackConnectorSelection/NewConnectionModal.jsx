import { useState } from "react";
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { X, SlackLogo } from "@phosphor-icons/react";

export default function NewSlackConnection({ isOpen, closeModal, onSubmit }) {
  const [config, setConfig] = useState({
    workspace_name: "",
    workspace_id: "",
    bot_token: "",
    signing_secret: "",
  });

  if (!isOpen) return null;

  function handleClose() {
    setConfig({
      workspace_name: "",
      workspace_id: "",
      bot_token: "",
      signing_secret: "",
    });
    closeModal();
  }

  function onFormChange() {
    const form = new FormData(document.getElementById("slack-connection-form"));
    setConfig({
      workspace_name: form.get("workspace_name").trim(),
      workspace_id: form.get("workspace_id").trim(),
      bot_token: form.get("bot_token").trim(),
      signing_secret: form.get("signing_secret").trim(),
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();

    const form = new FormData(e.target);
    const newConnection = {
      workspace_name: form.get("workspace_name"),
      workspace_id: form.get("workspace_id"),
      bot_token: form.get("bot_token"),
      signing_secret: form.get("signing_secret"),
    };

    onSubmit(newConnection);
    handleClose();
    return false;
  }

  return createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
          <div className="relative p-6 border-b rounded-t border-theme-modal-border">
            <div className="w-full flex gap-x-2 items-center">
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                New Slack Workspace Connection
              </h3>
            </div>
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={24} weight="bold" className="text-white" />
            </button>
          </div>
          <form
            id="slack-connection-form"
            onSubmit={handleUpdate}
            onChange={onFormChange}
          >
            <div className="px-7 py-6">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <p className="text-sm text-white/60">
                  Add the connection information for your Slack workspace so the agent can interact with it.
                </p>
                <div className="flex items-center justify-center mb-4">
                  <SlackLogo size={48} weight="fill" className="text-[#4A154B]" />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    name="workspace_name"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="My Company Slack"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Workspace ID
                  </label>
                  <input
                    type="text"
                    name="workspace_id"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="T12345678"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Bot Token
                  </label>
                  <input
                    type="text"
                    name="bot_token"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="xoxb-..."
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <p className="mt-1 text-xs text-white/60">
                    Bot tokens start with 'xoxb-'. You can find this in the Slack API dashboard.
                  </p>
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Signing Secret
                  </label>
                  <input
                    type="text"
                    name="signing_secret"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="your signing secret from the Slack API dashboard"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border px-7 pb-6">
              <button
                type="button"
                onClick={handleClose}
                className="transition-all duration-300 text-white hover:bg-zinc-700 light:hover:bg-theme-bg-primary px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="slack-connection-form"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Save connection
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>,
    document.body
  );
}