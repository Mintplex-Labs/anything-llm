import React, { useRef, useState } from "react";
import Admin from "../../../../../models/admin";
import { useNavigate } from "react-router-dom";
import paths from "../../../../../utils/paths";

// Create workspace step
export default function StepSeven() {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Admin.newWorkspace(form.get("name"));
    if (!!workspace) {
      navigate(paths.home());
    } else {
      alert(error);
    }
  };

  const handleSubmit = () => {
    formRef.current?.submit();
  };

  return (
    <div>
      <div className="flex flex-col w-full md:px-8 py-12">
        <form onSubmit={handleCreate}>
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
        </form>
      </div>
      <div className="flex w-full justify-end items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
        <button
          onClick={handleSubmit}
          type="button"
          className="transition-all duration-200 border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
