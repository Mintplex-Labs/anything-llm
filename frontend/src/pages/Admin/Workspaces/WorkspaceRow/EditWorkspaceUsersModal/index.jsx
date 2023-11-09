import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "../../../../../models/admin";
import { titleCase } from "text-case";

export const EditWorkspaceUsersModalId = (workspace) =>
  `edit-workspace-${workspace.id}-modal`;

export default function EditWorkspaceUsersModal({ workspace, users }) {
  const [error, setError] = useState(null);

  const hideModal = () => {
    document.getElementById(EditWorkspaceUsersModalId(workspace)).close();
  };

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {
      userIds: [],
    };
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (key.includes("user-") && value === "yes") {
        const [_, id] = key.split(`-`);
        data.userIds.push(+id);
      }
    }
    const { success, error } = await Admin.updateUsersInWorkspace(
      workspace.id,
      data.userIds
    );
    if (success) window.location.reload();
    setError(error);
  };

  return (
    <dialog
      id={EditWorkspaceUsersModalId(workspace)}
      className="bg-transparent outline-none"
    >
      <div className="relative w-[500px] max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">
              Edit {workspace.name}
            </h3>
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                {users
                  .filter((user) => user.role !== "admin")
                  .map((user) => {
                    return (
                      <div
                        key={`workspace-${workspace.id}-user-${user.id}`}
                        data-workspace={workspace.id}
                        className="flex items-center pl-4 border border-gray-500/50 rounded group hover:bg-stone-900 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          document
                            .getElementById(
                              `workspace-${workspace.id}-user-${user.id}`
                            )
                            ?.click();
                        }}
                      >
                        <input
                          id={`workspace-${workspace.id}-user-${user.id}`}
                          defaultChecked={workspace.userIds.includes(user.id)}
                          type="checkbox"
                          value="yes"
                          name={`user-${user.id}`}
                          className="w-4 h-4 text-blue-600 bg-zinc-900 border border-gray-500/50 rounded focus:ring-blue-500 focus:border-blue-500 pointer-events-none"
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="pointer-events-none w-full py-4 ml-2 text-sm font-medium text-white"
                        >
                          {titleCase(user.username)}
                        </label>
                      </div>
                    );
                  })}
                <div className="flex items-center gap-x-4">
                  <button
                    type="button"
                    className="w-full p-4 flex text-white items-center pl-4 border border-gray-500/50 rounded group hover:bg-stone-900 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      document
                        .getElementById(`workspace-${workspace.id}-select-all`)
                        ?.click();
                      Array.from(
                        document.querySelectorAll(
                          `[data-workspace='${workspace.id}']`
                        )
                      ).forEach((el) => {
                        if (!el.firstChild.checked) el.firstChild.click();
                      });
                    }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    className="w-full p-4 flex text-white items-center pl-4 border border-gray-500/50 rounded group hover:bg-stone-900 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      document
                        .getElementById(`workspace-${workspace.id}-select-all`)
                        ?.click();
                      Array.from(
                        document.querySelectorAll(
                          `[data-workspace='${workspace.id}']`
                        )
                      ).forEach((el) => {
                        if (el.firstChild.checked) el.firstChild.click();
                      });
                    }}
                  >
                    Deselect All
                  </button>
                </div>
                {error && (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
              <button
                onClick={hideModal}
                type="button"
                className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                Update workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
