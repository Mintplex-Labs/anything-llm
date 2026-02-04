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
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      <QuickActionButton label="Create an Agent" onClick={onCreateAgent} />
      <QuickActionButton label="Edit Workspace" onClick={onEditWorkspace} />
      <QuickActionButton label="Upload a Document" onClick={onUploadDocument} />
    </div>
  );
}

function QuickActionButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 rounded-full bg-theme-bg-chat-input text-white/80 text-sm font-normal leading-5 hover:bg-white/5 transition-colors"
    >
      {label}
    </button>
  );
}
