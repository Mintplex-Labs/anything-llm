import React, { useState } from "react";
import { X } from "react-feather";
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
      <div className="relative w-[75vw] max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit {workspace.name}
            </h3>
            <button
              onClick={hideModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                        className="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-400 group hover:bg-stone-600 cursor-pointer"
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
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 pointer-events-none"
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="pointer-events-none w-full py-4 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {titleCase(user.username)}
                        </label>
                      </div>
                    );
                  })}
                <div className="flex items-center gap-x-4">
                  <button
                    type="button"
                    className="w-full p-4 flex dark:text-slate-200 text-gray-800 items-center pl-4 border border-gray-200 rounded dark:border-gray-400 group hover:bg-stone-600 cursor-pointer"
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
                    className="w-full p-4 flex dark:text-slate-200 text-gray-800 items-center pl-4 border border-gray-200 rounded dark:border-gray-400 group hover:bg-stone-600 cursor-pointer"
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
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Error: {error}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={hideModal}
                type="button"
                className="text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:hover:bg-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-black dark:text-slate-200 dark:border-transparent dark:hover:text-slate-200 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
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
