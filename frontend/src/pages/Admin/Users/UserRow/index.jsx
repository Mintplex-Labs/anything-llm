import { useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import EditUserModal from "./EditUserModal";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useTranslation } from "react-i18next"; // i18n hook 추가

const ModMap = {
  admin: ["admin", "manager", "default"],
  manager: ["manager", "default"],
  default: [],
};

export default function UserRow({ currUser, user }) {
  const { t } = useTranslation(); // i18n hook 추가
  const rowRef = useRef(null);
  const canModify = ModMap[currUser?.role || "default"].includes(user.role);
  const [suspended, setSuspended] = useState(user.suspended === 1);
  const { isOpen, openModal, closeModal } = useModal();

  const handleSuspend = async () => {
    if (
      !window.confirm(
        t("adminUsers.suspendConfirm", { username: user.username })
      )
    )
      return false;

    const { success, error } = await Admin.updateUser(user.id, {
      suspended: suspended ? 0 : 1,
    });
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      showToast(
        suspended
          ? t("adminUsers.unsuspendSuccess")
          : t("adminUsers.suspendSuccess"),
        "success",
        { clear: true }
      );
      setSuspended(!suspended);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        t("adminUsers.deleteConfirm", { username: user.username })
      )
    )
      return false;
    const { success, error } = await Admin.deleteUser(user.id);
    if (!success) showToast(error, "error", { clear: true });
    if (success) {
      rowRef?.current?.remove();
      showToast(t("adminUsers.deleteSuccess"), "success", { clear: true });
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
              className="text-sm font-medium text-white/80 rounded-lg hover:text-white px-2 py-1 hover:bg-white hover:bg-opacity-10"
            >
              {t("adminUsers.edit")}
            </button>
          )}
          {currUser?.id !== user.id && canModify && (
            <>
              <button
                onClick={handleSuspend}
                className="text-sm font-medium text-white/80 hover:text-orange-300 rounded-lg px-2 py-1 hover:bg-white hover:bg-opacity-10"
              >
                {suspended
                  ? t("adminUsers.unsuspend")
                  : t("adminUsers.suspend")}
              </button>
              <button
                onClick={handleDelete}
                className="text-sm font-medium text-white/80 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
              >
                {t("adminUsers.delete")}
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
