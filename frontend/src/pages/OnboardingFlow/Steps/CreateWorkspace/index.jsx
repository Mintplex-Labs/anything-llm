import React, { useEffect, useRef, useState } from "react";
import illustration from "@/media/illustrations/create-workspace.png";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

const TITLE = "Create your first workspace";
const DESCRIPTION =
  "Create your first workspace and get started with AnythingLLM.";

export default function CreateWorkspace({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const [workspaceName, setWorkspaceName] = useState("");
  const navigate = useNavigate();
  const createWorkspaceRef = useRef();
  const { t } = useTranslation();

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
    <form
      onSubmit={handleCreate}
      className="w-full flex items-center justify-center flex-col gap-y-2"
    >
      <img src={illustration} alt="Create workspace" />
      <div className="flex flex-col gap-y-4 w-full max-w-[600px]">
        {" "}
        <div className="w-full mt-4">
          <label
            htmlFor="name"
            className="block mb-3 text-sm font-medium text-white"
          >
            {t("common.workspaces-name")}
          </label>
          <input
            name="name"
            type="text"
            className="border-none bg-theme-settings-input-bg text-white focus:outline-primary-button active:outline-primary-button placeholder:text-theme-settings-input-placeholder outline-none text-sm rounded-lg block w-full p-2.5"
            placeholder="My Workspace"
            required={true}
            autoComplete="off"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
      </div>
      <button
        type="submit"
        ref={createWorkspaceRef}
        hidden
        aria-hidden="true"
      ></button>
    </form>
  );
}
