import { useRef } from "react";
import Admin from "../../../../models/admin";
import paths from "../../../../utils/paths";
import EditWorkspaceUsersModal, {
  EditWorkspaceUsersModalId,
} from "./EditWorkspaceUsersModal";

export default function WorkspaceRow({ workspace, users }) {
  const rowRef = useRef(null);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${workspace.name}?\nAfter you do this it will be unavailable in this instance of AnythingLLM.\n\nThis action is irreversible.`
      )
    )
      return false;
    rowRef?.current?.remove();
    await Admin.deleteWorkspace(workspace.id);
  };

  return (
    <>
      <tr ref={rowRef} className="bg-transparent">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {workspace.name}
        </th>
        <td className="px-6 py-4">
          <a
            href={paths.workspace.chat(workspace.slug)}
            target="_blank"
            className="text-blue-500"
          >
            {workspace.slug}
          </a>
        </td>
        <td className="px-6 py-4">{workspace.userIds?.length}</td>
        <td className="px-6 py-4">{workspace.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={() =>
              document
                ?.getElementById(EditWorkspaceUsersModalId(workspace))
                ?.showModal()
            }
            className="font-medium text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 hover:dark:bg-blue-800 hover:dark:bg-opacity-20"
          >
            Edit Users
          </button>
          <button
            onClick={handleDelete}
            className="font-medium text-red-600 dark:text-red-300 px-2 py-1 rounded-lg hover:bg-red-50 hover:dark:bg-red-800 hover:dark:bg-opacity-20"
          >
            Delete
          </button>
        </td>
      </tr>
      <EditWorkspaceUsersModal workspace={workspace} users={users} />
    </>
  );
}
