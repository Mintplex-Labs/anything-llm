import React, { useEffect, useState } from "react";
import Workspace from "@/models/workspace";
import { TagsInput } from "react-tag-input-component";
import Embed from "@/models/embed";
import Toggle from "@/components/lib/Toggle";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalLabel,
  ModalHint,
} from "@/components/lib/Modal";

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
  if (!data.hasOwnProperty("message_limit")) data.message_limit = 20;
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
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader
        title="Create new embed for workspace"
        onClose={closeModal}
      />
      <ModalBody>
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
        <NumberInput
          name="message_limit"
          title="Message History Limit"
          hint="The number of previous messages to include in the chat context. Default is 20."
          defaultValue={20}
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
        <p className="text-xs text-zinc-400 light:text-slate-600">
          After creating an embed you will be provided a link that you can
          publish on your website with a simple
          <code className="light:bg-stone-300 bg-stone-900 text-white mx-1 px-1 rounded-sm">
            &lt;script&gt;
          </code>{" "}
          tag.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Create embed</ModalPrimaryButton>
      </ModalFooter>
    </form>
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
        <ModalLabel htmlFor="workspace_id">Workspace</ModalLabel>
        <ModalHint>
          This is the workspace your chat window will be based on. All defaults
          will be inherited from the workspace unless overridden by this config.
        </ModalHint>
      </div>
      <select
        name="workspace_id"
        required={true}
        defaultValue={defaultValue}
        className="min-w-[15rem] rounded-lg bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 px-4 py-2 text-sm text-zinc-100 light:text-slate-900 focus:ring-blue-500 focus:border-blue-500"
      >
        {workspaces.map((workspace) => {
          return (
            <option
              key={workspace.id}
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
        <ModalLabel htmlFor="chat_mode">Allowed chat method</ModalLabel>
        <ModalHint>
          Set how your chatbot should operate. Query means it will only respond
          if a document helps answer the query.
          <br />
          Chat opens the chat to even general questions and can answer totally
          unrelated queries to your workspace.
        </ModalHint>
      </div>
      <div className="mt-2 gap-y-3 flex flex-col">
        <label
          className={`transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
            chatMode === "chat"
              ? "border-sky-500 bg-zinc-800 light:bg-slate-100"
              : "border-zinc-800 light:border-slate-300 hover:bg-zinc-800 light:hover:bg-slate-100"
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
            className={`w-4 h-4 rounded-full border-2 border-zinc-700 light:border-slate-400 mr-2 ${
              chatMode === "chat" ? "bg-sky-500" : ""
            }`}
          ></div>
          <div className="text-zinc-100 light:text-slate-900 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
            Chat: Respond to all questions regardless of context
          </div>
        </label>
        <label
          className={`transition-all duration-300 w-full h-11 p-2.5 rounded-lg flex justify-start items-center gap-2.5 cursor-pointer border ${
            chatMode === "query"
              ? "border-sky-500 bg-zinc-800 light:bg-slate-100"
              : "border-zinc-800 light:border-slate-300 hover:bg-zinc-800 light:hover:bg-slate-100"
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
            className={`w-4 h-4 rounded-full border-2 border-zinc-700 light:border-slate-400 mr-2 ${
              chatMode === "query" ? "bg-sky-500" : ""
            }`}
          ></div>
          <div className="text-zinc-100 light:text-slate-900 text-sm font-medium font-['Plus Jakarta Sans'] leading-tight">
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
        <ModalLabel htmlFor="allowlist_domains">
          Restrict requests from domains
        </ModalLabel>
        <ModalHint>
          This filter will block any requests that come from a domain other than
          the list below.
          <br />
          Leaving this empty means anyone can use your embed on any site.
        </ModalHint>
      </div>
      <input type="hidden" name="allowlist_domains" value={domains.join(",")} />
      <TagsInput
        value={domains}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="https://mysite.com, https://anythingllm.com"
        classNames={{
          tag: "!bg-zinc-700 light:!bg-slate-200 !text-zinc-100 light:!text-slate-800",
          input:
            "flex !bg-transparent text-zinc-100 light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm outline-none",
        }}
      />
    </div>
  );
};

export const NumberInput = ({ name, title, hint, defaultValue = 0 }) => {
  return (
    <div>
      <div className="flex flex-col mb-2">
        <ModalLabel htmlFor={name}>{title}</ModalLabel>
        <ModalHint>{hint}</ModalHint>
      </div>
      <input
        type="number"
        name={name}
        className="border border-zinc-800 light:border-slate-300 bg-zinc-800 light:bg-white text-zinc-100 light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-400 text-sm rounded-lg focus:border-sky-500 light:focus:border-sky-500 outline-none block w-[15rem] p-2.5"
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
    <Toggle
      name={name}
      size="md"
      variant="horizontal"
      label={title}
      description={hint}
      value="on"
      enabled={status}
      onChange={(checked) => setStatus(checked)}
    />
  );
};
