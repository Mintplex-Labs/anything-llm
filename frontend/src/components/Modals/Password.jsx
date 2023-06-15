import React, { useState, useEffect, useRef } from "react";
import System from "../../models/system";

export default function PasswordModal() {
  const [loading, setLoading] = useState(false);
  const formEl = useRef(null);
  const [error, setError] = useState(null);
  const handleLogin = async (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    const data = {};

    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;
    const { valid, token, message } = await System.requestToken(data);
    if (valid && !!token) {
      window.localStorage.setItem("anythingllm_authtoken", token);
      window.location.reload();
    } else {
      setError(message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="flex fixed top-0 left-0 right-0 w-full h-full" />
      <div className="relative w-full max-w-2xl max-h-full">
        <form ref={formEl} onSubmit={handleLogin}>
          <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                This workspace is password protected.
              </h3>
            </div>
            <div className="p-6 space-y-6 flex h-full w-full">
              <div className="w-full flex flex-col gap-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Workspace Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required={true}
                    autoComplete="off"
                  />
                </div>
                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Error: {error}
                  </p>
                )}
                <p className="text-gray-800 dark:text-slate-200 text-sm">
                  You will only have to enter this password once. After
                  successful login it will be stored in your browser.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                disabled={loading}
                type="submit"
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                {loading ? "Validating..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function usePasswordModal() {
  const [requiresAuth, setRequiresAuth] = useState(null);
  useEffect(() => {
    async function checkAuthReq() {
      if (!window) return;
      if (import.meta.env.DEV) {
        setRequiresAuth(false);
      } else {
        const currentToken = window.localStorage.getItem(
          "anythingllm_authtoken"
        );
        const settings = await System.keys();
        const requiresAuth = settings?.RequiresAuth || false;

        // If Auth is disabled - skip check
        if (!requiresAuth) {
          setRequiresAuth(requiresAuth);
          return;
        }

        if (!!currentToken) {
          const valid = await System.checkAuth(currentToken);
          if (!valid) {
            setRequiresAuth(true);
            window.localStorage.removeItem("anythingllm_authtoken");
            return;
          } else {
            setRequiresAuth(false);
            return;
          }
        }
        setRequiresAuth(true);
      }
    }
    checkAuthReq();
  }, []);

  return { requiresAuth };
}
