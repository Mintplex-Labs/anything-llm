import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "../../../../../models/admin";
import { RoleHintDisplay } from "../..";

export const EditUserModalId = (user) => `edit-user-${user.id}-modal`;

export default function EditUserModal({ currentUser, user }) {
  const [role, setRole] = useState(user.role);
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
      <div className="relative w-[500px] max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">
              Edit {user.username}
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
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    New Password
                  </label>
                  <input
                    name="password"
                    type="text"
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={`${user.username}'s new password`}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Role
                  </label>
                  <select
                    name="role"
                    required={true}
                    defaultValue={user.role}
                    onChange={(e) => setRole(e.target.value)}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white border border-gray-500 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="default">Default</option>
                    <option value="manager">Manager</option>
                    {currentUser?.role === "admin" && (
                      <option value="admin">Administrator</option>
                    )}
                  </select>
                  <RoleHintDisplay role={role} />
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
                Update user
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
