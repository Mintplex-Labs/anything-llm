import React, { useRef, useState } from "react";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";

const noop = () => false;
export default function NewThreadModal({ hideModal = noop, workspace, thread = null }) {
  const formEl = useRef(null);
  const [error, setError] = useState(null);
  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;

    const { thread, message } = await Workspace.newThread(workspace, data);
    if (!!thread) {
      window.location.href = paths.workspace.thread(workspace, thread.id);
    }
    setError(message);
  };

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;

    const { thread: updatedThread, message } = await Workspace.updateThread(workspace, thread, data);
    hideModal(updatedThread);
    setError(message);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="flex fixed top-0 left-0 right-0 w-full h-full"
        onClick={hideModal}
      />
      <div className="relative w-[500px] max-h-full">
        <div className="relative bg-modal-gradient rounded-lg shadow-md border-2 border-accent">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-white/10">
            <h3 className="text-xl font-semibold text-white">{thread ? "Update thread" : "New Thread"}</h3>
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form ref={formEl} onSubmit={thread ? handleUpdate : handleCreate}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Thread Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    className="bg-zinc-900 w-full text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="My thread name"
                    required={true}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-white/10 rounded-b">
              <button
                type="submit"
                className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function useNewThreadModal() {
  const [showing, setShowing] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [thread, setThread] = useState(null);
  const [callback, setCallback] = useState(() => (_thread) => {});

  const showCreateModal = (workspace, onExit = () => {}) => {
    setShowing(true);
    setThread(null);
    setWorkspace(workspace);
    setCallback(() => onExit);
  };
  const hideModal = (thread = null) => {
    setShowing(false);
    setThread(null);
    setWorkspace(null);

    if (callback) {
      callback(thread);
    }
  };

  const showUpdateModal = (workspace, thread, onExit = (_thread) => {}) => {
    setShowing(true);
    setWorkspace(workspace);
    setThread(thread);
    setCallback(() => onExit);
  }

  return { showing, workspace, thread, showCreateModal, showUpdateModal, hideModal };
}
