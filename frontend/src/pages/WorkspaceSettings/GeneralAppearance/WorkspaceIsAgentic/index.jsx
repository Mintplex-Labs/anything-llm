import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function WorkspaceIsAgentic({ workspace, setHasChanges }) {
  const [isAgentic, setIsAgentic] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (workspace?.agentic !== undefined) {
      setIsAgentic(Boolean(workspace.agentic));
    }
  }, [workspace?.agentic]);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsAgentic(newValue);
    setHasChanges(true);
  };

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("common.workspaces_is_agentic")}
      </p>
      <p className="text-xs text-white/60">
        {t("common.workspaces_is_agentic_is_agentic_description")}
      </p>
      <div className="flex items-center gap-x-4">
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            id="agentic"
            type="checkbox"
            name="agentic"
            value="yes"
            checked={isAgentic}
            onChange={handleChange}
            className="peer sr-only"
          />
          <div className="pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
        </label>
      </div>
    </div>
  );
}
