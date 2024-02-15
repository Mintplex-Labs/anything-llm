import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";

export default function SupportEmail() {
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(supportEmail.email || "");
      setLoading(false);
    };
    fetchSupportEmail();
  }, []);

  const updateSupportEmail = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const supportEmail = form.get("supportEmail");
    const { success, error } = await Admin.updateSystemPreferences({
      support_email: supportEmail,
    });

    if (!success) {
      showToast(`Failed to update support email: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated support email.", "success");
      window.localStorage.removeItem(System.cacheKeys.supportEmail);
      setHasChanges(false);
    }
  };

  const removeEmail = async (e) => {
    e.preventDefault();
    const { success, error } = await Admin.updateSystemPreferences({
      support_email: null,
    });

    if (!success) {
      showToast(`Failed to remove support email: ${error}`, "error");
      return;
    } else {
      setSupportEmail("");
      showToast("Successfully removed support email.", "success");
      window.localStorage.removeItem(System.cacheKeys.supportEmail);
      setHasChanges(false);
    }
  };

  const onEmailChange = (e) => {
    setSupportEmail(e.target.value);
    setHasChanges(true);
  };

  if (loading) return null;

  return (
    <form className="mb-6" onSubmit={updateSupportEmail}>
      <div className="flex flex-col gap-y-2">
        <h2 className="leading-tight font-medium text-white">Support Email</h2>
        <p className="text-sm font-base text-white/60">
          Set the support email address that shows up in the user menu.
        </p>
      </div>
      <div className="flex items-center gap-x-6">
        <input
          name="supportEmail"
          type="email"
          minLength={2}
          maxLength={80}
          className="bg-zinc-900 mt-4 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 max-w-[275px]"
          placeholder="support@mycompany.com"
          required={true}
          autoComplete="off"
          onChange={onEmailChange}
          value={supportEmail}
        />
        {supportEmail !== "" && (
          <button
            type="button"
            onClick={removeEmail}
            className="text-white text-base font-medium hover:text-opacity-60"
          >
            Remove
          </button>
        )}
      </div>

      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-6 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save
        </button>
      )}
    </form>
  );
}
