import { ListChecks, X } from "@phosphor-icons/react";

export default function JiraConnection({ connection, onRemove }) {
  const { instance_id, instance_name, instance_url } = connection;

  function removeConfirmation() {
    if (
      !window.confirm(
        `Delete ${instance_name} from the list of available Jira connections? This cannot be undone.`
      )
    ) {
      return false;
    }

    // Call the parent's onRemove handler
    onRemove(instance_id);
  }

  return (
    <div className="flex gap-x-4 items-center">
      <div className="bg-blue-600 p-1 rounded-md flex items-center justify-center w-10 h-10">
        <ListChecks size={24} weight="fill" className="text-white" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white">{instance_name}</div>
          <div className="mt-1 text-xs text-description">{instance_url}</div>
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