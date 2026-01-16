import { useState } from "react";
import { Trash, Eye } from "@phosphor-icons/react";
import WorkspaceTemplate from "@/models/workspaceTemplate";
import showToast from "@/utils/toast";
import TemplatePreviewModal from "../TemplatePreviewModal";

export default function TemplateRow({ template, removeTemplate }) {
  const [showPreview, setShowPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the template "${template.name}"?\n\nThis action is irreversible.`
      )
    ) {
      return;
    }

    setDeleting(true);
    const success = await WorkspaceTemplate.delete(template.id);
    if (success) {
      showToast("Template deleted successfully", "success", { clear: true });
      removeTemplate(template.id);
    } else {
      showToast("Failed to delete template", "error", { clear: true });
    }
    setDeleting(false);
  };

  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10">
        <td scope="row" className="px-6 whitespace-nowrap">
          <span className="font-semibold">{template.name}</span>
        </td>
        <td className="px-6">
          {template.description || (
            <span className="italic opacity-50">No description</span>
          )}
        </td>
        <td className="px-6">{template.createdAt}</td>
        <td className="px-6 flex items-center gap-x-4 h-full mt-1">
          <button
            onClick={() => setShowPreview(true)}
            className="text-xs font-medium text-blue-300 rounded-lg hover:text-white hover:text-opacity-60 hover:underline"
          >
            Preview
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs font-medium text-white/80 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:bg-opacity-10 disabled:opacity-50"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>

      {showPreview && (
        <TemplatePreviewModal
          template={template}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
