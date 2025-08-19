import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { useState } from "react";

export default function LibraryToggle({ enabled = false, onToggle }) {
  const [status, setStatus] = useState(enabled);

  async function toggleFeatureFlag() {
    const updated = await Admin.updateSystemPreferences({
      library: status ? "disabled" : "enabled",
    });
    if (!updated?.success) {
      showToast("Failed to update status of feature.", "error", {
        clear: true,
      });
      return;
    }
    setStatus(!status);
    showToast(
      `Document Library has been ${!status ? "enabled" : "disabled"}.`,
      "success",
      { clear: true }
    );
    onToggle?.();
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between max-w-[500px]">
        <h2 className="text-theme-text-primary text-md font-bold">
          Document Library
        </h2>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            onClick={toggleFeatureFlag}
            checked={status}
            className="peer sr-only pointer-events-none"
          />
          <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-card after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
      <p className="mt-6 text-theme-text-secondary text-sm max-w-[500px]">
        Enable an organization-wide Library to store documents outside
        individual workspaces.
      </p>
    </div>
  );
}
