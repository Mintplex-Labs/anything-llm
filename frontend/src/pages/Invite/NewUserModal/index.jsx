import React, { useState } from "react";
import Invite from "@/models/invite";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import { AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import System from "@/models/system";

export default function NewUserModal() {
  const { code } = useParams();
  const [error, setError] = useState(null);

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { success, error } = await Invite.acceptInvite(code, data);
    if (success) {
      const { valid, user, token, message } = await System.requestToken(data);
      if (valid && !!token && !!user) {
        window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      } else {
        setError(message);
      }
      return;
    }
    setError(error);
  };

  return (
    <dialog open={true} className="bg-transparent outline-none">
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">
              Create a new account
            </h3>
          </div>
          <form onSubmit={handleCreate}>
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
                    placeholder="My username"
                    minLength={2}
                    required={true}
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Your password"
                    required={true}
                    minLength={8}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm">Error: {error}</p>
                )}
                <p className="text-slate-200 text-xs md:text-sm">
                  After creating your account you will be able to login with
                  these credentials and start using workspaces.
                </p>
              </div>
            </div>
            <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
              <button
                type="submit"
                className="w-full transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800 text-center justify-center"
              >
                Accept Invitation
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}
