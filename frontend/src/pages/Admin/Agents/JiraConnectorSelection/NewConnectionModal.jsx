import { useState } from "react";
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { X, ListChecks } from "@phosphor-icons/react";

export default function NewJiraConnection({ isOpen, closeModal, onSubmit }) {
  const [config, setConfig] = useState({
    instance_name: "",
    instance_url: "",
    username: "",
    api_token: "",
    instance_id: "",
  });

  if (!isOpen) return null;

  function handleClose() {
    // Reset form state
    setConfig({
      instance_name: "",
      instance_url: "",
      username: "",
      api_token: "",
      instance_id: "",
    });
    closeModal();
  }

  function onFormChange() {
    const form = new FormData(document.getElementById("jira-connection-form"));
    const instance_url = form.get("instance_url").trim();
    
    // Generate an instance_id from the URL if not already set
    let instance_id = form.get("instance_id").trim();
    if (!instance_id && instance_url) {
      try {
        const url = new URL(instance_url);
        instance_id = url.hostname.replace(/\./g, "-");
      } catch (e) {
        instance_id = "";
      }
    }
    
    setConfig({
      instance_name: form.get("instance_name").trim(),
      instance_url: instance_url,
      username: form.get("username").trim(),
      api_token: form.get("api_token").trim(),
      instance_id: instance_id,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const form = new FormData(e.target);
    let instance_id = form.get("instance_id").trim();
    const instance_url = form.get("instance_url").trim();
    
    // If no instance_id was provided, generate one from the URL
    if (!instance_id && instance_url) {
      try {
        const url = new URL(instance_url);
        instance_id = url.hostname.replace(/\./g, "-");
      } catch (e) {
        instance_id = "jira-" + Date.now();
      }
    }
    
    const newConnection = {
      instance_name: form.get("instance_name"),
      instance_url: instance_url,
      username: form.get("username"),
      api_token: form.get("api_token"),
      instance_id: instance_id,
    };
    
    // Submit the new connection to parent
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
                New Jira Connection
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
            id="jira-connection-form"
            onSubmit={handleUpdate}
            onChange={onFormChange}
          >
            <div className="px-7 py-6">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                <p className="text-sm text-white/60">
                  Add connection information for your Jira instance to allow the agent to interact with issues and projects.
                </p>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-600 p-2 rounded-md">
                    <ListChecks size={48} weight="fill" className="text-white" />
                  </div>
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Connection Name
                  </label>
                  <input
                    type="text"
                    name="instance_name"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="My Company Jira"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Jira URL
                  </label>
                  <input
                    type="url"
                    name="instance_url"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="https://mycompany.atlassian.net"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Jira Email/Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="your.email@company.com"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    API Token
                  </label>
                  <input
                    type="password"
                    name="api_token"
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="Jira API token"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <p className="mt-1 text-xs text-white/60">
                    Create a token at Atlassian account settings → Security → Create and manage API tokens
                  </p>
                </div>

                <div className="flex flex-col w-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Instance ID (optional)
                  </label>
                  <input
                    type="text"
                    name="instance_id"
                    value={config.instance_id}
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="Auto-generated from URL if left blank"
                    autoComplete="off"
                    spellCheck={false}
                    onChange={e => setConfig({...config, instance_id: e.target.value})}
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
                form="jira-connection-form"
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