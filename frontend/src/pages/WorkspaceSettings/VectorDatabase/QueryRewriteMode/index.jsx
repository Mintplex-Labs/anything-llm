import { useEffect, useState } from "react";
import Admin from "@/models/admin";

const hint = {
  systemDefault: {
    description:
      "Use the system-wide default configured by your administrator.",
  },
  off: {
    description:
      "Follow-up queries are sent to vector search as-is.",
  },
  on: {
    description:
      "Follow-up queries are rewritten into standalone search queries using chat history, improving RAG results in multi-turn conversations.",
  },
};

export default function QueryRewriteMode({ workspace, setHasChanges }) {
  const rawValue = workspace?.queryRewriteModeRaw;
  const [selection, setSelection] = useState(rawValue ?? "systemDefault");
  const [systemDefault, setSystemDefault] = useState(null);

  useEffect(() => {
    async function fetchSystemDefault() {
      const result = await Admin.systemPreferencesByFields([
        "query_rewrite_default",
      ]);
      setSystemDefault(result?.settings?.query_rewrite_default ?? "off");
    }
    fetchSystemDefault();
  }, []);

  const systemLabel =
    systemDefault === "on" ? "On" : systemDefault === "off" ? "Off" : "...";

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="queryRewriteMode" className="block input-label">
          Query Rewriting
        </label>
      </div>
      <select
        name="queryRewriteMode"
        value={selection}
        className="border-none bg-theme-settings-input-bg text-white text-sm mt-2 rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        onChange={(e) => {
          setSelection(e.target.value);
          setHasChanges(true);
        }}
        required={true}
      >
        <option value="systemDefault">
          System default ({systemLabel})
        </option>
        <option value="on">On</option>
        <option value="off">Off</option>
      </select>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        {hint[selection]?.description}
      </p>
    </div>
  );
}
