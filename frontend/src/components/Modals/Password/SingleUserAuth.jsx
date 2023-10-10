import React, { useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN } from "../../../utils/constants";
import useLogo from "../../../hooks/useLogo";
import paths from "../../../utils/paths";

export default function SingleUserAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logo: _initLogo } = useLogo();
  const handleLogin = async (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    const data = {};

    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { valid, token, message } = await System.requestToken(data);
    if (valid && !!token) {
      window.localStorage.setItem(AUTH_TOKEN, token);
      window.location = paths.home();
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col justify-center items-center relative bg-white rounded-2xl shadow dark:bg-stone-700 border-2 border-slate-300 border-opacity-20 w-[400px] login-input-gradient">
        <div className="flex items-start justify-between pt-11 pb-9 rounded-t dark:border-gray-600">
          <div className="flex items-center flex-col">
            <h3 className="text-md md:text-2xl font-bold text-gray-900 dark:text-white text-center">
              Sign In
            </h3>
          </div>
        </div>
        <div className="px-12 space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="bg-neutral-800 bg-opacity-40 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-[#222628] dark:bg-opacity-40 dark:placeholder-[#FFFFFF99] dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={true}
                autoComplete="off"
              />
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">
                Error: {error}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center p-12 space-x-2 border-gray-200 rounded-b dark:border-gray-600 w-full">
          <button
            disabled={loading}
            type="submit"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-white text-sm font-bold px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-white dark:text-neutral-700 dark:border-white dark:hover:text-white dark:hover:bg-slate-600 dark:focus:ring-gray-600 w-full"
          >
            {loading ? "Validating..." : "Login"}
          </button>
        </div>
      </div>
    </form>
  );
}
