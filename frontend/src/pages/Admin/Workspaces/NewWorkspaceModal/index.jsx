import React, { useState } from "react";
import Admin from "@/models/admin";
import { useTranslation } from "react-i18next";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalInput,
} from "@/components/lib/Modal";

export default function NewWorkspaceModal({ closeModal }) {
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Admin.newWorkspace(form.get("name"));
    if (!!workspace) window.location.reload();
    setError(error);
  };

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="Create new workspace" onClose={closeModal} />
      <ModalBody>
        <ModalInput
          label={t("common.workspaces-name")}
          name="name"
          type="text"
          placeholder="My workspace"
          minLength={4}
          required={true}
          autoComplete="off"
        />
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        <p className="text-zinc-400 light:text-slate-600 text-xs md:text-sm">
          After creating this workspace only admins will be able to see it. You
          can add users after it has been created.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Create workspace</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}
