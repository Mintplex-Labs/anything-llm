import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { RoleHintDisplay } from "../..";

export default function EditUserModal({ currentUser, user, closeModal }) {
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState(null);
  const [messageLimit, setMessageLimit] = useState({
    enabled: user.dailyMessageLimit !== null,
    limit: user.dailyMessageLimit || 10,
  });

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }
    if (messageLimit.enabled) {
      data.dailyMessageLimit = messageLimit.limit;
    } else {
      data.dailyMessageLimit = null;
    }

    const { success, error } = await Admin.updateUser(user.id, data);
    if (success) window.location.reload();
    setError(error);
  };

  return (
    <div className="relative w-[500px] max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            Edit {user.username}
          </h3>
          <button
            onClick={closeModal}
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
                  className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="User's username"
                  defaultValue={user.username}
                  minLength={2}
                  required={true}
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-white/60">
                  Username must only contain lowercase letters, numbers,
                  underscores, and hyphens with no spaces
                </p>
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
                  className="bg-zinc-900 placeholder:text-white/20 border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder={`${user.username}'s new password`}
                  autoComplete="off"
                  minLength={8}
                />
                <p className="mt-2 text-xs text-white/60">
                  Password must be at least 8 characters long
                </p>
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
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white border-gray-500 focus:ring-blue-500 focus:border-blue-500 w-full"
                >
                  <option value="default">Default</option>
                  <option value="manager">Manager</option>
                  {currentUser?.role === "admin" && (
                    <option value="admin">Administrator</option>
                  )}
                </select>
                <RoleHintDisplay role={role} />
              </div>
              <div className="mt-4 mb-8">
                <div className="flex flex-col gap-y-1">
                  <h2 className="text-base leading-6 font-bold text-white">
                    Limit messages per day
                  </h2>
                  <p className="text-xs leading-[18px] font-base text-white/60">
                    Restrict this user to a number of successful queries or
                    chats within a 24 hour window.
                  </p>
                  <div className="mt-2">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="limit_user_messages"
                        checked={messageLimit.enabled}
                        onChange={(e) => {
                          setMessageLimit({
                            ...messageLimit,
                            enabled: e.target.checked,
                          });
                        }}
                        className="peer sr-only"
                      />
                      <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
                    </label>
                  </div>
                </div>
                {messageLimit.enabled && (
                  <div className="mt-4">
                    <label className="text-white text-sm font-semibold block mb-4">
                      Message limit per day
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="number"
                        name="daily_message_limit"
                        onScroll={(e) => e.target.blur()}
                        onChange={(e) => {
                          setMessageLimit({
                            enabled: true,
                            limit: Number(e?.target?.value || 0),
                          });
                        }}
                        value={messageLimit.limit}
                        min={1}
                        className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-60 p-2.5"
                      />
                    </div>
                  </div>
                )}
              </div>
              {error && <p className="text-red-400 text-sm">Error: {error}</p>}
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button
              onClick={closeModal}
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
  );
}
