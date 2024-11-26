import { useRef } from "react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { LinkSimple, Trash } from "@phosphor-icons/react";

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
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {workspace.name}
        </th>
        <td className="px-6 py-4 flex items-center">
          <a
            href={paths.workspace.chat(workspace.slug)}
            target="_blank"
            rel="noreferrer"
            className="text-white flex items-center hover:underline"
          >
            <LinkSimple className="mr-2 w-5 h-5" /> {workspace.slug}
          </a>
        </td>
        <td className="px-6 py-4">
          <a
            href={paths.workspace.settings.members(workspace.slug)}
            className="text-white flex items-center underline"
          >
            {workspace.userIds?.length}
          </a>
        </td>
        <td className="px-6 py-4">{workspace.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={handleDelete}
            className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary hover:text-red-500"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
