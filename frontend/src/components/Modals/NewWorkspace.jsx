import React, { useRef, useState } from "react";
import { X } from "react-feather";
import Workspace from "../../models/workspace";

const noop = () => false;
export default function NewWorkspaceModal({ hideModal = noop }) {
  const formEl = useRef(null);
  const [error, setError] = useState(null);
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;
    const { workspace, message } = await Workspace.new(data);
    if (!!workspace) window.location.reload();
    setError(message);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="flex fixed top-0 left-0 right-0 w-full h-full"
        onClick={hideModal}
      />
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create a New Workspace
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
          <form ref={formEl} onSubmit={handleCreate}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Workspace Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="My Workspace"
                    required={true}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Error: {error}
                  </p>
                )}
                <p className="text-gray-800 dark:text-slate-200 text-xs md:text-sm">
                  After creating a workspace you will be able to add and remove
                  documents from it.
                </p>
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
                Create Workspace
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
