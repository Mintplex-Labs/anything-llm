import React, { useEffect, useRef } from "react";
import illustration from "@/media/illustrations/create-workspace.png";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
const TITLE = "Create a workspace";
const DESCRIPTION =
  "Create your first workspace and get started with AnythingLLM.";

export default function CreateWorkspace({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const navigate = useNavigate();
  const createWorkspaceRef = useRef();

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
    setBackBtn({ showing: true, disabled: false, onClick: handleBack });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Workspace.new({
      name: form.get("name"),
      onboardingComplete: true,
    });
    if (!!workspace) {
      navigate(paths.home());
    } else {
      showToast(`Failed to create workspace: ${error}`, "error");
    }
  };

  function handleForward() {
    createWorkspaceRef.current.click();
  }

  function handleBack() {
    window.location.href = paths.onboarding.dataHandling();
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
            Workspace Name
          </label>
          <input
            name="name"
            type="text"
            className="bg-zinc-900 text-white text-sm rounded-lg block w-full p-2.5"
            placeholder="My Workspace"
            minLength={4}
            required={true}
            autoComplete="off"
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
