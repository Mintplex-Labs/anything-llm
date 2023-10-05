import React, { useState } from "react";
import { X } from "react-feather";
import Admin from "../../../../../models/admin";

export const EditUserModalId = (user) => `edit-user-${user.id}-modal`;

export default function EditUserModal({ user }) {
  const [error, setError] = useState(null);

  const hideModal = () => {
    document.getElementById(EditUserModalId(user)).close();
  };

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }
    const { success, error } = await Admin.updateUser(user.id, data);
    if (success) window.location.reload();
    setError(error);
  };

  return (
    <dialog id={EditUserModalId(user)} className="bg-transparent outline-none">
      <div className="relative w-[75vw] max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow dark:bg-stone-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-opacity-10">
            <h3 className="text-xl font-semibold text-white dark:text-white">
              Edit {user.username}
            </h3>
            <button
              onClick={hideModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-slate-200 hover:text-slate-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <form onSubmit={handleUpdate}>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="User's username"
                    minLength={2}
                    defaultValue={user.username}
                    required={true}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    New Password
                  </label>
                  <input
                    name="password"
                    type="text"
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder={`${user.username}'s new password`}
                    minLength={8}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-white dark:text-white"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    required={true}
                    defaultValue={user.role}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white border border-gray-500 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-200 dark:bg-stone-600"
                  >
                    <option value="default">Default</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Error: {error}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t border-gray-500 border-opacity-10 rounded-b dark:border-gray-600">
              <button
                onClick={hideModal}
                type="button"
                className="text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:hover:bg-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 dark:bg-black dark:text-slate-200 dark:border-transparent dark:hover:text-slate-200 dark:hover:bg-gray-900 dark:focus:ring-gray-800"
              >
                Update user
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
