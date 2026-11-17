import React, { useEffect, useState } from "react";
import { Copy, Check } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { userFromStorage } from "@/utils/request";
import System from "@/models/system";
import { useTranslation } from "react-i18next";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
  ModalLabel,
  ModalHint,
} from "@/components/lib/Modal";
import WorkspaceMultiSelect from "./WorkspaceMultiSelect";

const getScopes = (t) => ({
  full: {
    label: t("api.scopes.full"),
    hint: t("api.modal.scope.helper.full"),
  },
  workspace: {
    label: t("api.scopes.workspace"),
    hint: t("api.modal.scope.helper.workspace"),
  },
  user: {
    label: t("api.scopes.user"),
    hint: t("api.modal.scope.helper.user"),
  },
});

export default function NewApiKeyModal({ closeModal, onSuccess, workspaces }) {
  const { t } = useTranslation();
  const [apiKey, setApiKey] = useState(null);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("full");
  const [workspaceIds, setWorkspaceIds] = useState([]);
  const [creating, setCreating] = useState(false);
  const missingWorkspaces = scope === "workspace" && workspaceIds.length === 0;
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    if (creating || missingWorkspaces) return;
    setCreating(true);
    const user = userFromStorage();
    const Model = !!user ? Admin : System;

    const { apiKey: newApiKey, error } = await Model.generateApiKey({
      name,
      scope,
      workspaceIds: scope === "workspace" ? workspaceIds : [],
    });
    setCreating(false);
    if (!!newApiKey) {
      setApiKey(newApiKey);
      onSuccess();
    }
    setError(error);
  };

  const copyApiKey = () => {
    if (!apiKey) return false;
    window.navigator.clipboard.writeText(apiKey.secret);
    setCopied(true);
  };

  useEffect(() => {
    function resetStatus() {
      if (!copied) return false;
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    resetStatus();
  }, [copied]);

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title={t("api.modal.title")} onClose={closeModal} />
      <ModalBody>
        {error && (
          <p className="text-red-400 text-sm">
            {t("api.messages.error", { error })}
          </p>
        )}
        {!apiKey && (
          <ModalInput
            label={t("api.modal.name.label")}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("api.modal.name.placeholder")}
            hint={t("api.modal.name.helper")}
          />
        )}
        <ScopeSelect visible={!apiKey} scope={scope} onChange={setScope} />
        <WorkspaceMultiSelect
          visible={!apiKey && scope === "workspace"}
          workspaces={workspaces}
          selected={workspaceIds}
          onChange={setWorkspaceIds}
        />
        {apiKey && (
          <div className="relative">
            <input
              type="text"
              defaultValue={`${apiKey.secret}`}
              disabled={true}
              className="border-none bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 light:bg-white light:text-slate-900 light:placeholder:text-slate-400 text-sm rounded-lg outline-none block w-full p-2.5 pr-10"
            />
            <button
              type="button"
              onClick={copyApiKey}
              disabled={copied}
              className="border-none absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md bg-transparent hover:bg-zinc-800 light:hover:bg-slate-100 transition-all duration-300"
            >
              {copied ? (
                <Check size={20} className="text-green-400" weight="bold" />
              ) : (
                <Copy
                  size={20}
                  className="text-slate-50 light:text-slate-900"
                  weight="bold"
                />
              )}
            </button>
          </div>
        )}
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {t("api.modal.helper")}
        </p>
        <a
          href={paths.apiDocs()}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:underline"
        >
          Read the API documentation &rarr;
        </a>
      </ModalBody>
      <ModalFooter className={apiKey ? "justify-end" : undefined}>
        {!apiKey ? (
          <>
            <ModalSecondaryButton onClick={closeModal} type="button">
              {t("api.modal.cancel")}
            </ModalSecondaryButton>
            <ModalPrimaryButton
              type="submit"
              disabled={creating || missingWorkspaces}
            >
              {t("api.modal.create")}
            </ModalPrimaryButton>
          </>
        ) : (
          <ModalSecondaryButton onClick={closeModal} type="button">
            {t("api.modal.close")}
          </ModalSecondaryButton>
        )}
      </ModalFooter>
    </form>
  );
}

function ScopeSelect({ visible, scope, onChange }) {
  const { t } = useTranslation();
  const scopes = getScopes(t);
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-y-1.5 w-full">
      <ModalLabel htmlFor="scope">{t("api.modal.scope.label")}</ModalLabel>
      <select
        id="scope"
        value={scope}
        onChange={(e) => onChange(e.target.value)}
        className="border-none w-full h-[34px] px-3 text-sm rounded-lg outline-none bg-zinc-800 text-zinc-100 light:bg-white light:text-slate-900 light:outline light:outline-1 light:outline-slate-300"
      >
        {Object.entries(scopes).map(([value, { label }]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <ModalHint>{scopes[scope].hint}</ModalHint>
    </div>
  );
}
