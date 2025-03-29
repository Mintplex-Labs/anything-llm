import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import { useRef, useState } from "react";
import VectorDBIdentifier from "./VectorDBIdentifier";
import MaxContextSnippets from "./MaxContextSnippets";
import DocumentSimilarityThreshold from "./DocumentSimilarityThreshold";
import ResetDatabase from "./ResetDatabase";
import VectorCount from "./VectorCount";
import VectorSearchMode from "./VectorSearchMode";
import CTAButton from "@/components/lib/CTAButton";

export default function VectorDatabase({ workspace }) {
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const formEl = useRef(null);

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
      showToast("Workspace updated!", "success", { clear: true });
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
    setHasChanges(false);
  };

  if (!workspace) return null;
  return (
    <div className="w-full relative">
      <form
        ref={formEl}
        onSubmit={handleUpdate}
        className="w-1/2 flex flex-col gap-y-6"
      >
        {hasChanges && (
          <div className="absolute top-0 right-0">
            <CTAButton type="submit">
              {saving ? "Updating..." : "Update Workspace"}
            </CTAButton>
          </div>
        )}
        <div className="flex items-start gap-x-5">
          <VectorDBIdentifier workspace={workspace} />
          <VectorCount reload={true} workspace={workspace} />
        </div>
        <VectorSearchMode workspace={workspace} setHasChanges={setHasChanges} />
        <MaxContextSnippets
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <DocumentSimilarityThreshold
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
        <ResetDatabase workspace={workspace} />
      </form>
    </div>
  );
}
