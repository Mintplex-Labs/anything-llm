import { useRef, useState } from "react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { LinkSimple, Trash, Users } from "@phosphor-icons/react";
import ManageUsersModal from "./ManageUsersModal";

export default function WorkspaceRow({ workspace, users }) {
  const rowRef = useRef(null);
  const [showManageUsers, setShowManageUsers] = useState(false);

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
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
      >
        <th scope="row" className="px-6 whitespace-nowrap">
          {workspace.name}
        </th>
        <td className="px-6 flex items-center">
          <a
            href={paths.workspace.chat(workspace.slug)}
            target="_blank"
            rel="noreferrer"
            className="text-white flex items-center hover:underline"
          >
            <LinkSimple className="mr-2 w-4 h-4" /> {workspace.slug}
          </a>
        </td>
        <td className="px-6">
          <button
            onClick={() => setShowManageUsers(true)}
            className="text-white flex items-center underline hover:text-blue-300"
            title="Manage workspace users"
          >
            {workspace.userIds?.length || 0}
          </button>
        </td>
        <td className="px-6">{workspace.createdAt}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={() => setShowManageUsers(true)}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:text-blue-300 rounded-lg px-2 py-1 hover:bg-white hover:bg-opacity-10"
            title="Manage users"
          >
            <Users className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
      {showManageUsers && (
        <ManageUsersModal
          workspace={workspace}
          users={users}
          closeModal={() => setShowManageUsers(false)}
        />
      )}
    </>
  );
}
