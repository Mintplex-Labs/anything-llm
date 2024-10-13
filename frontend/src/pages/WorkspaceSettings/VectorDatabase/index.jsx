import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useRef, useState } from "react";
import VectorDBIdentifier from "./VectorDBIdentifier";
import MaxContextSnippets from "./MaxContextSnippets";
import DocumentSimilarityThreshold from "./DocumentSimilarityThreshold";
import ResetDatabase from "./ResetDatabase";
import VectorCount from "./VectorCount";
import { useTranslation } from "react-i18next";

export default function VectorDatabase({ workspace }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const formEl = useRef(null);
  const { t } = useTranslation();

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!!updatedWorkspace) {
      showToast(t("workspace.vectorDatabase.updateSuccess"), "success", {
        clear: true,
      });
    } else {
      showToast(`${t("workspace.vectorDatabase.error")}: ${message}`, "error", {
        clear: true,
      });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace) return null;
  return (
    <form
      ref={formEl}
      onSubmit={handleUpdate}
      className="w-1/2 flex flex-col gap-y-6"
    >
      <div className="flex items-start gap-x-5">
        <VectorDBIdentifier workspace={workspace} />
        <VectorCount reload={true} workspace={workspace} />
      </div>
      <MaxContextSnippets workspace={workspace} setHasChanges={setHasChanges} />
      <DocumentSimilarityThreshold
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
      <ResetDatabase workspace={workspace} />
      {hasChanges && (
        <button
          type="submit"
          className="w-fit transition-all duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          {saving
            ? t("workspace.vectorDatabase.updating")
            : t("workspace.vectorDatabase.updateButton")}
        </button>
      )}
    </form>
  );
}
