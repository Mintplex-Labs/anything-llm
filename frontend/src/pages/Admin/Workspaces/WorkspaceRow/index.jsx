import { useRef } from "react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import EditWorkspaceUsersModal from "./EditWorkspaceUsersModal";
import { DotsThreeOutline, LinkSimple, Trash } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";

export default function WorkspaceRow({ workspace, users }) {
  const rowRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();
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
        <td className="px-6 py-4">{workspace.userIds?.length}</td>
        <td className="px-6 py-4">{workspace.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={openModal}
            className="font-medium rounded-lg hover:text-white hover:text-opacity-60 px-2 py-1 hover:bg-white hover:bg-opacity-10"
          >
            <DotsThreeOutline weight="fill" className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="font-medium text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
      <ModalWrapper isOpen={isOpen}>
        <EditWorkspaceUsersModal
          workspace={workspace}
          users={users}
          closeModal={closeModal}
        />
      </ModalWrapper>
    </>
  );
}
