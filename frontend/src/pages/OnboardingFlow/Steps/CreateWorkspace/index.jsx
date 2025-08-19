import React, { useEffect, useRef, useState } from "react";
import illustration from "@/media/illustrations/create-workspace.png";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

export default function CreateWorkspace({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const { t } = useTranslation();
  const [workspaceName, setWorkspaceName] = useState("");
  const navigate = useNavigate();
  const createWorkspaceRef = useRef();
  const TITLE = t("onboarding.workspace.title");
  const DESCRIPTION = t("onboarding.workspace.description");

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    if (workspaceName.length > 0) {
      setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    } else {
      setForwardBtn({ showing: true, disabled: true, onClick: handleForward });
    }
  }, [workspaceName]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Workspace.new({
      name: form.get("name"),
      onboardingComplete: true,
    });
    if (!!workspace) {
      showToast(
        "Workspace created successfully! Taking you to home...",
        "success"
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(paths.home());
    } else {
      showToast(`Failed to create workspace: ${error}`, "error");
    }
  };

  function handleForward() {
    createWorkspaceRef.current.click();
  }

  function handleBack() {
    navigate(paths.onboarding.survey());
  }

  return (
    <div className="onenew-page p-6 flex items-center justify-center">
      <div className="onenew-card flex flex-col items-center gap-y-4 w-full max-w-[600px]">
        <img src={illustration} alt="Create workspace" />
        <form onSubmit={handleCreate} className="w-full flex flex-col gap-y-2">
          <div className="w-full mt-4">
            <label htmlFor="name" className="block mb-3 text-sm font-medium">
              {t("common.workspaces-name")}
            </label>
            <input
              name="name"
              type="text"
              className="onenew-input w-full"
              placeholder="My Workspace"
              required={true}
              autoComplete="off"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <p className="text-theme-text-secondary text-xs mt-2">
              {t("onboarding.workspace.adminWarning")}
            </p>
          </div>
          <button
            type="submit"
            ref={createWorkspaceRef}
            hidden
            aria-hidden="true"
          ></button>
        </form>
      </div>
    </div>
  );
}
