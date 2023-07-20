import React, { useState, useEffect } from "react";
import System from "../../../../models/system";

const noop = () => false;
export default function PasswordProtection({ hideModal = noop }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [usePassword, setUsePassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const form = new FormData(e.target);
    const data = {
      usePassword,
      newPassword: form.get("password"),
    };

    const { success, error } = await System.updateSystemPassword(data);
    if (success) {
      setSuccess(true);
      setSaving(false);
      setTimeout(() => {
        window.localStorage.removeItem("anythingllm_authToken");
        window.location.reload();
      }, 2_000);
      return;
    }

    setError(error);
    setSaving(false);
  };

  useEffect(() => {
    async function fetchKeys() {
      const settings = await System.keys();
      setUsePassword(settings?.RequiresAuth);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
            Protect your AnythingLLM instance with a password. If you forget
            this there is no recovery method so ensure you save this password.
          </p>
        </div>
        {(error || success) && (
          <div className="w-full flex px-6">
            {error && (
              <div className="w-full bg-red-300 text-red-800 font-semibold px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="w-full bg-green-300 text-green-800 font-semibold px-4 py-2 rounded-lg">
                Your page will refresh in a few seconds.
              </div>
            )}
          </div>
        )}
        <div className="p-6 space-y-6 flex h-full w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-800 dark:text-gray-200 text-base">
                loading system settings
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-y-4">
              <form onSubmit={handleSubmit}>
                <div className="">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Password Protect Instance
                  </label>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      name="use_password"
                      onClick={() => setUsePassword(!usePassword)}
                      checked={usePassword}
                      className="peer sr-only pointer-events-none"
                    />
                    <div className="pointer-events-none peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-stone-400 dark:peer-focus:ring-blue-800"></div>
                  </label>
                </div>
                <div className="w-full flex flex-col gap-y-2 my-2">
                  {usePassword && (
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        New Password
                      </label>
                      <input
                        name="password"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Your Instance Password"
                        minLength={8}
                        required={true}
                        autoComplete="off"
                      />
                    </div>
                  )}
                  <button
                    disabled={saving}
                    type="submit"
                    className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            onClick={hideModal}
            type="button"
            className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
