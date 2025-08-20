import React, { useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";
import ModalWrapper from "@/components/ModalWrapper";

const noop = () => false;
export default function NewWorkspaceModal({ hideModal = noop }) {
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
      window.location.href = paths.workspace.chat(workspace.slug);
    }
    setError(message);
  };

  return (
    <ModalWrapper isOpen={true} onClose={hideModal}>
      <div className="onenew-card p-5 shadow-2xl max-w-lg w-[90vw]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-foreground overflow-hidden overflow-ellipsis whitespace-nowrap">
            {t("new-workspace.title")}
          </h3>
          <button onClick={hideModal} type="button" className="onenew-btn">
            <X size={24} weight="bold" className="text-foreground" />
          </button>
        </div>
        <div
          className="h-full w-full overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <form ref={formEl} onSubmit={handleCreate}>
            <div className="space-y-2 flex-col">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-foreground"
                  >
                    {t("common.workspaces-name")}
                  </label>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    className="onenew-input w-full"
                    placeholder={t("new-workspace.placeholder")}
                    required={true}
                    autoComplete="off"
                    autoFocus={true}
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end items-center mt-6">
              <button type="submit" className="onenew-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>
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
