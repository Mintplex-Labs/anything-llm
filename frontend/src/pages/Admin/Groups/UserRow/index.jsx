import { useRef } from "react";
import EditGroupModal from "../EditGroupModal";
import DeleteGroupModal from "../DeleteGroupModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";

// const ModMap = {
//   admin: ["admin", "manager", "default"],
//   manager: ["manager", "default"],
//   default: [],
// };

export default function UserRow({ group, fetchData = () => {} }) {
  const rowRef = useRef(null);
  // const canModify = ModMap[currUser?.role || "default"].includes(group.role);
  const canModify = true;
  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {group?.groupname || "-"}
        </th>
        <td className="px-6 py-4">{group?.createdBy || "-"}</td>
        <td className="px-6 py-4">{group?.createdAt || "-"}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          {canModify && (
            <button
              onClick={openModal}
              className="text-sm font-medium text-white/80 light:text-black/80 rounded-lg px-2 py-1 hover:bg-opacity-10"
            >
              Edit
            </button>
          )}
          {canModify && (
            <>
              <button
                onClick={openDeleteModal}
                className="text-sm font-medium text-white/80 light:text-black/80 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-orange-50 hover:bg-opacity-10"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
      <ModalWrapper isOpen={isOpen}>
        <EditGroupModal
          closeModal={closeModal}
          fetchData={() => fetchData()}
          _group={group}
        />
      </ModalWrapper>

      <ModalWrapper isOpen={isDeleteOpen}>
        <DeleteGroupModal
          closeModal={closeDeleteModal}
          fetchData={() => fetchData()}
          _group={group}
        />
      </ModalWrapper>
    </>
  );
}
