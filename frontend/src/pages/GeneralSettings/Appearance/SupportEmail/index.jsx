import useUser from "@/hooks/useUser";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
export default function SupportEmail() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(supportEmail.email || "");
      setOriginalEmail(supportEmail.email || "");
      setLoading(false);
    };
    fetchSupportEmail();
  }, []);

  const updateSupportEmail = async (e, newValue = null) => {
    e.preventDefault();
    let support_email = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      support_email = form.get("supportEmail");
    }

    const { success, error } = await Admin.updateSystemPreferences({
      support_email,
    });

    if (!success) {
      showToast(t("supportEmail.updateFailed", { error }), "error");
      return;
    } else {
      showToast(t("supportEmail.updateSuccess"), "success");
      window.localStorage.removeItem(System.cacheKeys.supportEmail);
      setSupportEmail(support_email);
      setOriginalEmail(support_email);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setSupportEmail(e.target.value);
    setHasChanges(true);
  };

  if (loading || !user?.role) return null;
  return (
    <form className="mb-6" onSubmit={updateSupportEmail}>
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          {t("supportEmail.title")}
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          {t("supportEmail.description")}
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <input
          name="supportEmail"
          type="email"
          className="bg-zinc-900 mt-3 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-[275px] placeholder:text-white/20"
          placeholder="support@mycompany.com"
          required={true}
          autoComplete="off"
          onChange={handleChange}
          value={supportEmail}
        />
        {originalEmail !== "" && (
          <button
            type="button"
            onClick={(e) => updateSupportEmail(e, "")}
            className="mt-4 text-white text-base font-medium hover:text-opacity-60"
          >
            {t("supportEmail.clearButton")}
          </button>
        )}
      </div>
      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-6 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          {t("supportEmail.saveButton")}
        </button>
      )}
    </form>
  );
}
