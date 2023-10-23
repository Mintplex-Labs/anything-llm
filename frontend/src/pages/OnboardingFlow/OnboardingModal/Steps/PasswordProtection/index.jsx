import React, { memo, useState } from "react";
import System from "../../../../../models/system";
import {
  AUTH_TIMESTAMP,
  AUTH_TOKEN,
  AUTH_USER,
} from "../../../../../utils/constants";
import debounce from "lodash.debounce";

function PasswordProtection({ goToStep, prevStep }) {
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { error } = await System.updateSystemPassword({
      usePassword: true,
      newPassword: formData.get("password"),
    });

    if (error) {
      alert(`Failed to set password: ${error}`, "error");
      return;
    }

    // Auto-request token with password that was just set so they
    // are not redirected to login after completion.
    const { token } = await System.requestToken({
      password: formData.get("password"),
    });
    window.localStorage.removeItem(AUTH_USER);
    window.localStorage.removeItem(AUTH_TIMESTAMP);
    window.localStorage.setItem(AUTH_TOKEN, token);

    goToStep(7);
    return;
  };

  const handleSkip = () => {
    goToStep(7);
  };

  const setNewPassword = (e) => setPassword(e.target.value);
  const handlePasswordChange = debounce(setNewPassword, 500);
  return (
    <div className="w-full">
      <form className="flex flex-col w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col w-full px-1 md:px-8 py-12">
          <div className="w-full flex flex-col gap-y-2 my-5">
            <div className="w-80">
              <div className="flex flex-col mb-3 ">
                <label
                  htmlFor="password"
                  className="block font-medium text-white"
                >
                  New Password
                </label>
                <p className="text-slate-300 text-xs">
                  must be at least 8 characters.
                </p>
              </div>
              <input
                onChange={handlePasswordChange}
                name="password"
                type="text"
                className="bg-zinc-900 text-white text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 placeholder-white placeholder-opacity-60 focus:ring-blue-500"
                placeholder="Your Instance Password"
                minLength={8}
                required={true}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
          <button
            onClick={prevStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
          >
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-sidebar"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={!password}
              className="border px-4 py-2 rounded-lg text-sm items-center flex gap-x-2 
              border-slate-200 text-slate-800 bg-slate-200 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow
              disabled:border-gray-400 disabled:text-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default memo(PasswordProtection);
