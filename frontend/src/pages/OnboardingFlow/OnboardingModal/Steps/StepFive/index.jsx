import React, { useState } from "react";
import System from "../../../../../models/system";

// Password Protect Step
export default function StepFive({ goToStep, prevStep }) {
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setValid(event.target.value.length >= 8);
  };

  const handleSetPassword = async () => {
    const { error } = await System.updateSystemPassword(password);
    if (error) {
      alert(`Failed to set password: ${error}`, "error");
    } else {
      goToStep(7);
    }
  };

  const handleSkip = () => {
    // Go to step 7 to skip password protection
    goToStep(7);
  };
  return (
    <div className="w-full">
      <div className="flex flex-col w-full px-1 md:px-8 py-12">
        <div className="w-full flex flex-col gap-y-2 my-5">
          <div className="w-80">
            <label
              htmlFor="password"
              className="block mb-3 font-medium text-white"
            >
              New Password
            </label>
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
          className="px-4 py-2 rounded-lg text-white hover:bg-sidebar transition-all duration-300"
        >
          Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleSkip}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar transition-all duration-300"
          >
            Skip
          </button>
          <button
            onClick={handleSetPassword}
            type="button"
            className={`transition-all duration-200 border px-4 py-2 rounded-lg text-sm items-center flex gap-x-2 ${
              valid
                ? "border-slate-200 text-slate-800 bg-slate-200 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
                : "border-gray-400 text-slate-800 bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!valid}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
