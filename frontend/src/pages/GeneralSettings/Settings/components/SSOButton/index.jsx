import useUser from "@/hooks/useUser";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function SSOButton() {
  const [canCustomize, setCanCustomize] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [ssoButton, setssoButton] = useState("");
  const [ssobool, setSSObool] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchssoButton = async () => {
      const ssoButton = await System.fetchssoButton();
      setssoButton(ssoButton.url || "");
      setSSObool(ssoButton.url || "");
      setCanCustomize(true);
      setLoading(false);
    };
    fetchssoButton();
  }, []);

  const updatessoButton = async (e, newValue = null) => {
    e.preventDefault();
    let sso_url = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      sso_url = form.get("ssoButton");
    }

    const { success, error } = await Admin.updateSystemPreferences({
      sso_url,
    });

    if (!success) {
      showToast(`Failed to update sso url: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated sso url.", "success");
      window.localStorage.removeItem(System.cacheKeys.ssoButton);
      setssoButton(sso_url);
      setSSObool(sso_url);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setssoButton(e.target.value);
    setHasChanges(true);
  };

  if (!canCustomize || loading) return null;
  return (
    <form
      className="flex flex-col gap-y-0.5 mt-4"
      onSubmit={updatessoButton}
    >
      <h2 className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.sso-button.title")}
      </h2>
      <p className="text-xs text-white/60">
        {t("customization.items.sso-button.description")}
      </p>
      <div className="flex items-center gap-x-4">
        <input
          name="ssoButton"
          type="text"
          className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
          placeholder="https://anythingllm.com/ssologin"
          required={true}
          autoComplete="off"
          onChange={handleChange}
          value={ssoButton}
        />
        {ssobool !== "" && (
          <button
            type="button"
            onClick={(e) => updatessoButton(e, "")}
            className="text-white text-base font-medium hover:text-opacity-60"
          >
            Clear
          </button>
        )}
      </div>
      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-2 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save
        </button>
      )}
    </form>
  );
}
