import { useTranslation } from "react-i18next";

/**
 * Quick action buttons for home and empty workspace states.
 * @param {Object} props
 * @param {Function} props.onCreateAgent - Handler for "Create an Agent" action
 * @param {Function} props.onEditWorkspace - Handler for "Edit Workspace" action
 * @param {Function} props.onUploadDocument - Handler for "Upload a Document" action
 */
export default function QuickActions({
  onCreateAgent,
  onEditWorkspace,
  onUploadDocument,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <QuickActionButton
        label={t("main-page.quickActions.createAgent")}
        onClick={onCreateAgent}
      />
      <QuickActionButton
        label={t("main-page.quickActions.editWorkspace")}
        onClick={onEditWorkspace}
      />
      <QuickActionButton
        label={t("main-page.quickActions.uploadDocument")}
        onClick={onUploadDocument}
      />
    </div>
  );
}

function QuickActionButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full bg-theme-bg-chat-input text-white/80 text-sm font-normal leading-5 hover:bg-zinc-700 light:hover:bg-black/20 transition-colors light:text-theme-text-primary"
    >
      {label}
    </button>
  );
}
