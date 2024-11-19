import { useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import EditUserModal from "./EditUserModal";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";

const ModMap = {
  admin: ["admin", "manager", "default"],
  manager: ["manager", "default"],
  default: [],
};

export default function UserRow({ currUser, user }) {
  const rowRef = useRef(null);
  const canModify = ModMap[currUser?.role || "default"].includes(user.role);
  const [suspended, setSuspended] = useState(user.suspended === 1);
  const { isOpen, openModal, closeModal } = useModal();
  const handleSuspend = async () => {
    if (
      !window.confirm(
        `Are you sure you want to suspend ${user.username}?\nAfter you do this they will be logged out and unable to log back into this instance of AnythingLLM until unsuspended by an admin.`
      )
    )
      return false;

    const { success, error } = await Admin.updateUser(user.id, {
      suspended: suspended ? 0 : 1,
    });
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      showToast(
        `User ${!suspended ? "has been suspended" : "is no longer suspended"}.`,
        "success",
        { clear: true }
      );
      setSuspended(!suspended);
    }
  };
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.username}?\nAfter you do this they will be logged out and unable to use this instance of AnythingLLM.\n\nThis action is irreversible.`
      )
    )
      return false;
    const { success, error } = await Admin.deleteUser(user.id);
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      rowRef?.current?.remove();
      showToast("User deleted from system.", "success", { clear: true });
    }
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <th scope="row" className="px-6 py-4 whitespace-nowrap">
          {user.username}
        </th>
        <td className="px-6 py-4">{titleCase(user.role)}</td>
        <td className="px-6 py-4">{user.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          {canModify && (
            <button
              onClick={openModal}
              className="text-sm font-medium text-white/80 light:text-black/80 rounded-lg hover:text-white hover:light:text-gray-500 px-2 py-1 hover:bg-white hover:bg-opacity-10"
            >
              Edit
            </button>
          )}
          {currUser?.id !== user.id && canModify && (
            <>
              <button
                onClick={handleSuspend}
                className="text-sm font-medium text-white/80 light:text-black/80 hover:light:text-orange-500 hover:text-orange-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-orange-50 hover:bg-opacity-10"
              >
                {suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
      <ModalWrapper isOpen={isOpen}>
        <EditUserModal
          currentUser={currUser}
          user={user}
          closeModal={closeModal}
        />
      </ModalWrapper>
    </>
  );
}
