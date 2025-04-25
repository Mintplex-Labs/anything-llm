import { SlackLogo, X } from "@phosphor-icons/react";

export default function SlackConnection({ connection, onRemove, setHasChanges }) {
  const { workspace_id, workspace_name } = connection;

  function removeConfirmation() {
    if (
      !window.confirm(
        `Delete ${workspace_name} from the list of available Slack connections? This cannot be undone.`
      )
    ) {
      return false;
    }

    // Call the parent's onRemove handler
    onRemove(workspace_id);
  }

  return (
    <div className="flex gap-x-4 items-center">
      <SlackLogo size={28} weight="fill" className="text-[#4A154B]" />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white">{workspace_name}</div>
          <div className="mt-1 text-xs text-description">Workspace ID: {workspace_id}</div>
        </div>
        <button
          type="button"
          onClick={removeConfirmation}
          className="border-none text-white hover:text-red-500"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}