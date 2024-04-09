import React, { useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import useLogo from "../../../hooks/useLogo";
import paths from "../../../utils/paths";

export default function MultiUserAuth() {
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
    const { valid, user, token, message } = await System.requestToken(data);
    if (valid && !!token && !!user) {
      window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
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
      <div className="flex flex-col justify-center items-center relative rounded-2xl w-[400px] bg-login-gradient shadow-[0_4px_14px_rgba(0,0,0,0.25)]">
        <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
          <div className="flex items-center flex-col gap-y-4">
            <h3 className="text-md md:text-2xl font-bold text-white text-center">
              Welcome
            </h3>
            <p className="text-sm text-white/90 text-center">
              Sign in to your AnythingLLM account.
            </p>
          </div>
        </div>
        <div className="px-12 space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div>
              <input
                name="username"
                type="text"
                placeholder="Username"
                className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
                required={true}
                autoComplete="off"
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="bg-zinc-900 text-white placeholder-white/20 text-sm rounded-md p-2.5 w-[300px] h-[34px]"
                required={true}
                autoComplete="off"
              />
            </div>

            {error && <p className="text-red-400 text-sm">Error: {error}</p>}
          </div>
        </div>
        <div className="flex items-center p-12 space-x-2 border-gray-600 w-full">
          <button
            disabled={loading}
            type="submit"
            className="text-[#46C8FF] text-sm font-bold focus:ring-4 focus:outline-none rounded-md border-[1.5px] border-[#46C8FF] h-[34px] hover:text-white hover:bg-[#46C8FF] focus:z-10 w-full"
          >
            {loading ? "Validating..." : "Login"}
          </button>
        </div>
      </div>
    </form>
  );
}
