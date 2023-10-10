import React, { useEffect, useState } from "react";
import System from "../../../../../models/system";

// Multi-user mode step
export default function StepSix({ nextStep }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    setValid(username.length >= 6 && password.length >= 8);
  }, [username, password]);

  const handleSubmit = async () => {
    const data = {
      username: username,
      password: password,
    };

    const { success, error } = await System.setupMultiUser(data);
    if (success) {
      nextStep();
    } else {
      alert(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col w-full md:px-8 py-12">
        <form onSubmit={handleSubmit}>
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
                  name="name"
                  type="text"
                  className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Your admin username"
                  minLength={4}
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
                  name="name"
                  type="text"
                  className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Your admin password"
                  minLength={4}
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
        </form>
      </div>
      <div className="flex w-full justify-between items-center p-6 space-x-6 border-t rounded-b border-gray-500/50">
        <div className="w-96 text-white text-opacity-80 text-xs font-base">
          By default, you will be th eonly admin. As an admin you will need to
          create accounts for all new users or admins. Do not lose your password
          as only admins can reset passwords.
        </div>
        <div className="flex gap-2">
          <button
            onClick={nextStep}
            type="button"
            className="px-4 py-2 rounded-lg text-white hover:bg-sidebar transition-all duration-300"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
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
