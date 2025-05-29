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
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
      <div className="card-hemp max-w-[600px] w-full">
        <form
          onSubmit={handleCreate}
          className="flex flex-col items-center gap-y-6"
        >
          <img
            src={illustration}
            alt="Create workspace"
            className="w-32 h-32 object-contain"
          />
          <div className="w-full">
            <label
              htmlFor="name"
              className="block mb-3 text-sm font-medium text-hemp-text"
            >
              {t("common.workspaces-name")}
            </label>
            <input
              name="name"
              type="text"
              className="input-hemp"
              placeholder="My Workspace"
              required={true}
              autoComplete="off"
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
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
