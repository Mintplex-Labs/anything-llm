import React, { useState, useEffect } from "react";
import { Loader } from "react-feather";
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

              {/* <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200"
                  >
                    {name}
                  </label>
                  <input
                    type="text"
                    name=
                    className="border border-white text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
                    defaultValue={value}
                    required={true}
                    autoComplete="off"
                  />

                </div>
              </form> */}
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

function ShowKey({ name, env, value, valid, allowDebug = true }) {
  const [isValid, setIsValid] = useState(valid);
  const [debug, setDebug] = useState(false);
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { newValues, error } = await System.updateSystem(data);
    if (!!error) {
      alert(error);
      setSaving(false);
      setIsValid(false);
      return;
    }

    setSaving(false);
    setDebug(false);
    setIsValid(true);
  };

  if (!isValid) {
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="error"
            className="block mb-2 text-sm font-medium text-red-700 dark:text-red-500"
          >
            {name}
          </label>
          <input
            type="text"
            id="error"
            name={env}
            disabled={!debug}
            className="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
            placeholder={name}
            defaultValue={value}
            required={true}
            autoComplete="off"
          />
          <div className="flex items-center justify-between">
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              Need setup in .env file.
            </p>
            {allowDebug && (
              <>
                {debug ? (
                  <div className="flex items-center gap-x-2 mt-2">
                    {saving ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 text-slate-300 dark:text-slate-500" />
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setDebug(false)}
                          className="text-xs text-slate-300 dark:text-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-xs text-blue-300 dark:text-blue-500"
                        >
                          Save
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDebug(true)}
                    className="mt-2 text-xs text-slate-300 dark:text-slate-500"
                  >
                    Debug
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <label
          htmlFor="success"
          className="block mb-2 text-sm font-medium text-gray-800 dark:text-slate-200"
        >
          {name}
        </label>
        <input
          type="text"
          id="success"
          name={env}
          disabled={!debug}
          className="border border-white text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          defaultValue={value}
          required={true}
          autoComplete="off"
        />
        {allowDebug && (
          <div className="flex items-center justify-end">
            {debug ? (
              <div className="flex items-center gap-x-2 mt-2">
                {saving ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 text-slate-300 dark:text-slate-500" />
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setDebug(false)}
                      className="text-xs text-slate-300 dark:text-slate-500"
                    >
                      Cancel
                    </button>
                    <button className="text-xs text-blue-300 dark:text-blue-500">
                      Save
                    </button>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setDebug(true)}
                className="mt-2 text-xs text-slate-300 dark:text-slate-500"
              >
                Debug
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
