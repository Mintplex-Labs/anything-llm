import React, { useState } from "react";
import System from "../../../models/system";
import { AUTH_TOKEN, AUTH_USER } from "../../../utils/constants";
import useLogo from "../../../hooks/useLogo";
import paths from "../../../utils/paths";

export default function MultiUserAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logo: _initLogo } = useLogo();
  const [showResetModal, setShowResetModal] = useState(false);
  const [recoveryCodeInputs, setRecoveryCodeInputs] = useState(Array(2).fill(""));

  const handleLogin = async (e) => {
    setError(null);
    setLoading(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { valid, user, token, message, recoveryCodes } = await System.requestToken(data);
    if (recoveryCodes) {
      alert(`Recovery Codes: ${recoveryCodes}`);
    }
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

  const handleResetPassword = (e) => {
    e.preventDefault();
    setShowResetModal(true);
  };

  const handleRecoveryCodeChange = (index, value) => {
    const updatedCodes = [...recoveryCodeInputs];
    updatedCodes[index] = value;
    setRecoveryCodeInputs(updatedCodes);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const recoveryCodes = recoveryCodeInputs.filter((code) => code.trim() !== "");
    console.log("Recovery Codes:", recoveryCodes);
    // Add your password reset logic here
    setShowResetModal(false);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col justify-center items-center relative rounded-2xl shadow border-2 border-slate-300 border-opacity-20 w-[400px] login-input-gradient">
          <div className="flex items-start justify-between pt-11 pb-9 rounded-t">
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
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="bg-opacity-40 border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-[#222628] placeholder-[#FFFFFF99] text-white focus:ring-blue-500 focus:border-blue-500"
                  required={true}
                  autoComplete="off"
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="bg-opacity-40 border-gray-300 text-sm rounded-lg block w-full p-2.5 bg-[#222628] placeholder-[#FFFFFF99] text-white focus:ring-blue-500 focus:border-blue-500"
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
          <div className="flex flex-col gap-y-2 items-center p-12 space-x-2 border-gray-200 rounded-b dark:border-gray-600 w-full">
            <button
              disabled={loading}
              type="submit"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-white text-sm font-bold px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-white dark:text-neutral-700 dark:border-white dark:hover:text-white dark:hover:bg-slate-600 dark:focus:ring-gray-600 w-full"
            >
              {loading ? "Validating..." : "Login"}
            </button>
            <button
              onClick={handleResetPassword}
              className="px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Reset Password
            </button>
          </div>
        </div>
      </form>
      {showResetModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowResetModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <form onSubmit={handleResetSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Reset Password
                  </h3>
                  {recoveryCodeInputs.map((code, index) => (
                    <div key={index} className="mt-4">
                      <label
                        htmlFor={`recoveryCode${index + 1}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Recovery Code {index + 1}
                      </label>
                      <input
                        type="text"
                        name={`recoveryCode${index + 1}`}
                        id={`recoveryCode${index + 1}`}
                        value={code}
                        onChange={(e) => handleRecoveryCodeChange(index, e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Reset Password
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={(e) => {e.preventDefault();
                      setShowResetModal(false)}}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}