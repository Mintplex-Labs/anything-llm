import React, { useState, memo } from "react";
import System from "@/models/system";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import debounce from "lodash.debounce";

// Multi-user mode step
function MultiUserSetup({ nextStep, prevStep }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    const { success, error } = await System.setupMultiUser(data);
    if (!success) {
      alert(error);
      return;
    }

    // Auto-request token with credentials that was just set so they
    // are not redirected to login after completion.
    const { user, token } = await System.requestToken(data);
    window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
    window.localStorage.setItem(AUTH_TOKEN, token);
    window.localStorage.removeItem(AUTH_TIMESTAMP);

    nextStep("data_handling");
  };

  const setNewUsername = (e) => setUsername(e.target.value);
  const setNewPassword = (e) => setPassword(e.target.value);
  const handleUsernameChange = debounce(setNewUsername, 500);
  const handlePasswordChange = debounce(setNewPassword, 500);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full md:px-8 py-4">
          <div className="space-y-6 flex h-full w-96">
            <div className="w-full flex flex-col gap-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Admin account username
                </label>
                <input
                  name="username"
                  type="text"
                  className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Your admin username"
                  minLength={6}
                  required={true}
                  autoComplete="off"
                  onChange={handleUsernameChange}
                />
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Admin account password
                </label>
                <input
                  name="password"
                  type="password"
                  className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Your admin password"
                  minLength={8}
                  required={true}
                  autoComplete="off"
                  onChange={handlePasswordChange}
                />
              </div>
              <p className="w-96 text-white text-opacity-80 text-xs font-base">
                Username must be at least 6 characters long. Password must be at
                least 8 characters long.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center px-6 py-4 space-x-6 border-t rounded-b border-gray-500/50">
          <div className="w-96 text-white text-opacity-80 text-xs font-base">
            By default, you will be the only admin. As an admin you will need to
            create accounts for all new users or admins. Do not lose your
            password as only admins can reset passwords.
          </div>
          <div className="flex gap-2">
            <button
              onClick={prevStep}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
            >
              Back
            </button>
            <button
              type="submit"
              className="border px-4 py-2 rounded-lg text-sm items-center flex gap-x-2
              border-slate-200 text-slate-800 bg-slate-200 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow
              disabled:border-gray-400 disabled:text-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!(!!username && !!password)}
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default memo(MultiUserSetup);
