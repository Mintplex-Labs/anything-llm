import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import paths from "../../../../../utils/paths";
import Workspace from "../../../../../models/workspace";

function CreateFirstWorkspace() {
  const navigate = useNavigate();

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
      alert(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="flex flex-col w-full">
        <div className="flex flex-col w-full md:px-8 py-12">
          <div className="space-y-6 flex h-full w-96">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Workspace name
                </label>
                <input
                  name="name"
                  type="text"
                  className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="My workspace"
                  minLength={4}
                  required={true}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end items-center px-6 py-4 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            type="submit"
            className="border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
          >
            Finish
          </button>
        </div>
      </form>
    </div>
  );
}
export default memo(CreateFirstWorkspace);
