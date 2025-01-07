import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { TagsInput } from "react-tag-input-component";
import Embed from "@/models/embed";

export function enforceSubmissionSchema(form) {
  const data = {};
  for (var [key, value] of form.entries()) {
    if (!value || value === null) continue;
    data[key] = value;
    if (value === "on") data[key] = true;
  }

  // Always set value on nullable keys since empty or off will not send anything from form element.
  if (!data.hasOwnProperty("allowlist_domains")) data.allowlist_domains = null;
  if (!data.hasOwnProperty("allow_model_override"))
    data.allow_model_override = false;
  if (!data.hasOwnProperty("allow_temperature_override"))
    data.allow_temperature_override = false;
  if (!data.hasOwnProperty("allow_prompt_override"))
    data.allow_prompt_override = false;
  return data;
}

export default function NewEmbedModal({ closeModal }) {
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const data = enforceSubmissionSchema(form);
    const { embed, error } = await Embed.newEmbed(data);
    if (!!embed) window.location.reload();
    setError(error);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Create new embed for workspace
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
        <div className="px-7 py-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <WorkspaceSelection />
              <ChatModeSelection />
              <PermittedDomains />
              <NumberInput
                name="max_chats_per_day"
                title="Max chats per day"
                hint="Limit the amount of chats this embedded chat can process in a 24 hour period. Zero is unlimited."
              />
              <NumberInput
                name="max_chats_per_session"
                title="Max chats per session"
                hint="Limit the amount of chats a session user can send with this embed in a 24 hour period. Zero is unlimited."
              />
              <BooleanInput
                name="allow_model_override"
                title="Enable dynamic model use"
                hint="Allow setting of the preferred LLM model to override the workspace default."
              />
              <BooleanInput
                name="allow_temperature_override"
                title="Enable dynamic LLM temperature"
                hint="Allow setting of the LLM temperature to override the workspace default."
              />
              <BooleanInput
                name="allow_prompt_override"
                title="Enable Prompt Override"
                hint="Allow setting of the system prompt to override the workspace default."
              />

              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
              <p className="text-white text-opacity-60 text-xs md:text-sm">
                After creating an embed you will be provided a link that you can
                publish on your website with a simple
                <code className="light:bg-stone-300 bg-stone-900 text-white mx-1 px-1 rounded-sm">
                  &lt;script&gt;
                </code>{" "}
                tag.
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Create embed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const WorkspaceSelection = ({ defaultValue = null }) => {
  const [workspaces, setWorkspaces] = useState([]);
  useEffect(() => {
    async function fetchWorkspaces() {
      const _workspaces = await Workspace.all();
      setWorkspaces(_workspaces);
    }
    fetchWorkspaces();
  }, []);

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          htmlFor="workspace_id"
          className="block  text-sm font-medium text-white"
        >
          Workspace
        </label>
        <p className="text-theme-text-secondary text-xs">
          This is the workspace your chat window will be based on. All defaults
          will be inherited from the workspace unless overridden by this config.
        </p>
      </div>
      <select
        name="workspace_id"
        required={true}
        defaultValue={defaultValue}
        className="min-w-[15rem] rounded-lg bg-theme-settings-input-bg px-4 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
      >
        {workspaces.map((workspace) => {
          return (
            <option
              selected={defaultValue === workspace.id}
              value={workspace.id}
            >
              {workspace.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const ChatModeSelection = ({ defaultValue = null }) => {
  const [chatMode, setChatMode] = useState(defaultValue ?? "query");

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          className="block text-sm font-medium text-white"
          htmlFor="chat_mode"
        >
          Allowed chat method
        </label>
        <p className="text-theme-text-secondary text-xs">
          Set how your chatbot should operate. Query means it will only respond
          if a document helps answer the query.
          <br />
          Chat opens the chat to even general questions and can answer totally
          unrelated queries to your workspace.
        </p>
      </div>
      <div className="mt-2 gap-y-3 flex flex-col">
        <label
          className={`transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
            chatMode === "chat"
              ? "border-theme-sidebar-item-workspace-active bg-theme-bg-secondary"
              : "border-theme-sidebar-border hover:border-theme-sidebar-border hover:bg-theme-bg-secondary"
          } `}
        >
          <input
            type="radio"
            name="chat_mode"
            value={"chat"}
            checked={chatMode === "chat"}
            onChange={(e) => setChatMode(e.target.value)}
            className="hidden"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 border-theme-sidebar-border mr-2 ${
              chatMode === "chat"
                ? "bg-[var(--theme-sidebar-item-workspace-active)]"
                : ""
            }`}
          ></div>
          <div className="text-theme-text-primary text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
            Chat: Respond to all questions regardless of context
          </div>
        </label>
        <label
          className={`transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
            chatMode === "query"
              ? "border-theme-sidebar-item-workspace-active bg-theme-bg-secondary"
              : "border-theme-sidebar-border hover:border-theme-sidebar-border hover:bg-theme-bg-secondary"
          } `}
        >
          <input
            type="radio"
            name="chat_mode"
            value={"query"}
            checked={chatMode === "query"}
            onChange={(e) => setChatMode(e.target.value)}
            className="hidden"
          />
          <div
            className={`w-4 h-4 rounded-full border-2 border-theme-sidebar-border mr-2 ${
              chatMode === "query"
                ? "bg-[var(--theme-sidebar-item-workspace-active)]"
                : ""
            }`}
          ></div>
          <div className="text-theme-text-primary text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
            Query: Only respond to chats related to documents in workspace
          </div>
        </label>
      </div>
    </div>
  );
};

export const PermittedDomains = ({ defaultValue = [] }) => {
  const [domains, setDomains] = useState(defaultValue);
  const handleChange = (data) => {
    const validDomains = data
      .map((input) => {
        let url = input;
        if (!url.includes("http://") && !url.includes("https://"))
          url = `https://${url}`;
        try {
          new URL(url);
          return url;
        } catch {
          return null;
        }
      })
      .filter((u) => !!u);
    setDomains(validDomains);
  };

  const handleBlur = (event) => {
    const currentInput = event.target.value;
    if (!currentInput) return;

    const validDomains = [...domains, currentInput].map((input) => {
      let url = input;
      if (!url.includes("http://") && !url.includes("https://"))
        url = `https://${url}`;
      try {
        new URL(url);
        return url;
      } catch {
        return null;
      }
    });
    event.target.value = "";
    setDomains(validDomains);
  };

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          htmlFor="allowlist_domains"
          className="block text-sm font-medium text-white"
        >
          Restrict requests from domains
        </label>
        <p className="text-theme-text-secondary text-xs">
          This filter will block any requests that come from a domain other than
          the list below.
          <br />
          Leaving this empty means anyone can use your embed on any site.
        </p>
      </div>
      <input type="hidden" name="allowlist_domains" value={domains.join(",")} />
      <TagsInput
        value={domains}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="https://mysite.com, https://anythingllm.com"
        classNames={{
          tag: "bg-theme-settings-input-bg light:bg-black/10 bg-blue-300/10 text-zinc-800",
          input:
            "flex p-1 !bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none",
        }}
      />
    </div>
  );
};

export const NumberInput = ({ name, title, hint, defaultValue = 0 }) => {
  return (
    <div>
      <div className="flex flex-col mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {title}
        </label>
        <p className="text-theme-text-secondary text-xs">{hint}</p>
      </div>
      <input
        type="number"
        name={name}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[15rem] p-2.5"
        min={0}
        defaultValue={defaultValue}
        onScroll={(e) => e.target.blur()}
      />
    </div>
  );
};

export const BooleanInput = ({ name, title, hint, defaultValue = null }) => {
  const [status, setStatus] = useState(defaultValue ?? false);

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label htmlFor={name} className="block text-sm font-medium text-white">
          {title}
        </label>
        <p className="text-theme-text-secondary text-xs">{hint}</p>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          name={name}
          type="checkbox"
          onClick={() => setStatus(!status)}
          checked={status}
          className="peer sr-only pointer-events-none"
        />
        <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
      </label>
    </div>
  );
};
