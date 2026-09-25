import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { castToType } from "@/utils/types";
import AutosaveForm from "@/components/AutosaveForm";
import VectorDBIdentifier from "./VectorDBIdentifier";
import MaxContextSnippets from "./MaxContextSnippets";
import DocumentSimilarityThreshold from "./DocumentSimilarityThreshold";
import ResetDatabase from "./ResetDatabase";
import VectorCount from "./VectorCount";
import VectorSearchMode from "./VectorSearchMode";

export default function VectorDatabase({ workspace }) {
  const handleUpdate = async (formEl) => {
    const data = {};
    const form = new FormData(formEl);
    for (var [key, value] of form.entries()) data[key] = castToType(key, value);
    const { workspace: updatedWorkspace, message } = await Workspace.update(
      workspace.slug,
      data
    );
    if (!updatedWorkspace)
      showToast(`Error: ${message}`, "error", { clear: true });
    return !!updatedWorkspace;
  };

  if (!workspace) return null;
  return (
    <div className="w-full relative">
      <AutosaveForm
        onSave={handleUpdate}
        className="w-1/2 flex flex-col gap-y-[32px]"
      >
        <div className="flex items-start gap-x-5">
          <VectorDBIdentifier workspace={workspace} />
          <VectorCount reload={true} workspace={workspace} />
        </div>
        <VectorSearchMode workspace={workspace} />
        <MaxContextSnippets workspace={workspace} />
        <DocumentSimilarityThreshold workspace={workspace} />
        <ResetDatabase workspace={workspace} />
      </AutosaveForm>
    </div>
  );
}
