import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { TagsInput } from "react-tag-input-component";
import Embed from "@/models/embed";
import Toggle from "@/components/lib/Toggle";
import { useTranslation } from "react-i18next";

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
  if (!data.hasOwnProperty("chat_retention_days")) data.chat_retention_days = null;
  return data;
}

export default function NewEmbedModal({ closeModal }) {
  const { t } = useTranslation();
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
              {t("embed-modal.create-title")}
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
            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
              <WorkspaceSelection />
              <ChatModeSelection />
              <PermittedDomains />
              <NumberInput
                name="max_chats_per_day"
                title={t("embed-modal.max-chats-day.label")}
                hint={t("embed-modal.max-chats-day.hint")}
              />
              <NumberInput
                name="max_chats_per_session"
                title={t("embed-modal.max-chats-session.label")}
                hint={t("embed-modal.max-chats-session.hint")}
              />
              <NumberInput
                name="message_limit"
                title={t("embed-modal.message-limit.label")}
                hint={t("embed-modal.message-limit.hint")}
                defaultValue={20}
              />
              <div>
                <div className="flex flex-col mb-2">
                  <label className="text-white text-sm font-semibold">
                    {t("embed-modal.chat-retention.label")}
                  </label>
                  <p className="text-theme-text-secondary text-xs">
                    {t("embed-modal.chat-retention.hint")}
                  </p>
                </div>
                <select
                  name="chat_retention_days"
                  defaultValue=""
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[15rem] p-2.5"
                >
                  <option value="">
                    {t("embed-modal.chat-retention.never")}
                  </option>
                  <option value="7">
                    7 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="30">
                    30 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="90">
                    90 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="180">
                    180 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="365">
                    365 {t("embed-modal.chat-retention.days")}
                  </option>
                </select>
              </div>
              <BooleanInput
                name="allow_model_override"
                title={t("embed-modal.model-override.label")}
                hint={t("embed-modal.model-override.hint")}
              />
              <BooleanInput
                name="allow_temperature_override"
                title={t("embed-modal.temperature-override.label")}
                hint={t("embed-modal.temperature-override.hint")}
              />
              <BooleanInput
                name="allow_prompt_override"
                title={t("embed-modal.prompt-override.label")}
                hint={t("embed-modal.prompt-override.hint")}
              />

              {error && (
                <p className="text-red-400 text-sm">
                  {t("common.error")}: {error}
                </p>
              )}
              <p
                className="text-white text-opacity-60 text-xs md:text-sm"
                dangerouslySetInnerHTML={{
                  __html: t("embed-modal.script-info"),
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                {t("embed-modal.cancel")}
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                {t("embed-modal.create-button")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const WorkspaceSelection = ({ defaultValue = null }) => {
  const { t } = useTranslation();
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
          {t("embed-modal.workspace.label")}
        </label>
        <p className="text-theme-text-secondary text-xs">
          {t("embed-modal.workspace.hint")}
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
  const { t } = useTranslation();
  const [chatMode, setChatMode] = useState(defaultValue ?? "query");

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label
          className="block text-sm font-medium text-white"
          htmlFor="chat_mode"
        >
          {t("embed-modal.chat-mode.label")}
        </label>
        <p className="text-theme-text-secondary text-xs">
          {t("embed-modal.chat-mode.hint")}
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
            {t("embed-modal.chat-mode.chat")}
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
            {t("embed-modal.chat-mode.query")}
          </div>
        </label>
      </div>
    </div>
  );
};

export const PermittedDomains = ({ defaultValue = [] }) => {
  const { t } = useTranslation();
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
          {t("embed-modal.domains.label")}
        </label>
        <p className="text-theme-text-secondary text-xs">
          {t("embed-modal.domains.hint")}
        </p>
      </div>
      <input type="hidden" name="allowlist_domains" value={domains.join(",")} />
      <TagsInput
        value={domains}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={t("embed-modal.domains.placeholder")}
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
    <Toggle
      name={name}
      size="md"
      variant="horizontal"
      label={title}
      description={hint}
      enabled={status}
      onChange={(checked) => setStatus(checked)}
    />
  );
};
