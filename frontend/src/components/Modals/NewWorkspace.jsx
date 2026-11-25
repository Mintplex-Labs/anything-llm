import React, { useRef, useState } from "react";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { REFETCH_WORKSPACES_EVENT } from "@/components/Sidebar/ActiveWorkspaces";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalInput,
} from "@/components/lib/Modal";

const noop = () => false;
export default function NewWorkspaceModal({ hideModal = noop }) {
  const navigate = useNavigate();
  const formEl = useRef(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;
    const { workspace, message } = await Workspace.new(data);
    if (!!workspace) {
      // Refresh the sidebar list and navigate via the router so
      // ActiveGenerationGuard can intercept if a response is generating.
      // If the user cancels the navigation, the workspace still exists and
      // shows in the sidebar - so close this modal either way.
      window.dispatchEvent(new CustomEvent(REFETCH_WORKSPACES_EVENT));
      hideModal();
      navigate(paths.workspace.chat(workspace.slug));
      return;
    }
    setError(message);
  };

  return (
    <Modal isOpen={true} onClose={hideModal} size="md">
      <form
        ref={formEl}
        onSubmit={handleCreate}
        className="flex flex-col gap-y-5"
      >
        <ModalHeader title={t("new-workspace.title")} onClose={hideModal} />
        <ModalBody>
          <ModalInput
            label={t("common.workspaces-name")}
            name="name"
            type="text"
            id="name"
            placeholder={t("new-workspace.placeholder")}
            required={true}
            autoComplete="off"
            autoFocus={true}
          />
          {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        </ModalBody>
        <ModalFooter className="justify-end">
          <ModalPrimaryButton type="submit">Save</ModalPrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export function useNewWorkspaceModal() {
  const [showing, setShowing] = useState(false);
  const showModal = () => {
    setShowing(true);
  };
  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
