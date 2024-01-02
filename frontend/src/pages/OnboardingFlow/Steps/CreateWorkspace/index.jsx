import React, { useEffect } from "react";
const TITLE = "Create a workspace";
const DESCRIPTION =
  "Create your first workspace and get started with AnythingLLM.";

export default function CreateWorkspace({ setHeader, setForwardBtn }) {
  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setForwardBtn({ showing: true, disabled: false, onClick: handleForward });
  }, []);

  function handleForward() {
    console.log("Go forward");
  }

  return (
    <div className="w-full flex items-center justify-center flex-col gap-y-6">
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
            minLength={6}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
