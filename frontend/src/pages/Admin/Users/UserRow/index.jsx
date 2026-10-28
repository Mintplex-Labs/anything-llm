import moment from "moment";
import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import MobileConnection from "@/models/mobile";
import PreLoader from "@/components/Preloader";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import EditUserModal from "./EditUserModal";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/lib/Modal";

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
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [qrError, setQrError] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const openUserQr = async () => {
    setQrOpen(true);
    setQrLoading(true);
    setQrError(null);
    setQrUrl(null);
    const result = await MobileConnection.getConnectionInfoForUser(user.id);
    try {
      if (!result || result.error || !result.connectionUrl)
        throw new Error(result?.error || "Could not generate a pairing QR code.");
      const url = result.connectionUrl.startsWith("http")
        ? result.connectionUrl
        : new URL(result.connectionUrl, window.location.origin).toString();
      const parsed = new URL(url);
      if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname))
        throw new Error("Open this page using the server's reachable hostname or IP address before pairing the phone.");
      setQrUrl(url);
    } catch (error) {
      setQrError(error.message);
    } finally {
      setQrLoading(false);
    }
  };
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
        className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
      >
        <th scope="row" className="px-6 whitespace-nowrap">
          {user.username}
        </th>
        <td className="px-6">{titleCase(user.role)}</td>
        <td className="px-6">{moment(user.createdAt).format("lll")}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-2">
          {currUser?.role === "admin" && (
            <button
              onClick={openUserQr}
              className="text-xs font-medium text-white/80 light:text-black/80 rounded-lg hover:text-white hover:light:text-gray-500 px-2 py-1 hover:bg-white hover:bg-opacity-10"
              disabled={Boolean(user.suspended)}
              title={user.suspended ? "Unsuspend the user before pairing a device" : "Generate a QR code for this user"}
            >
              Mobile QR
            </button>
          )}
          {canModify && (
            <button
              onClick={openModal}
              className="text-xs font-medium text-white/80 light:text-black/80 rounded-lg hover:text-white hover:light:text-gray-500 px-2 py-1 hover:bg-white hover:bg-opacity-10"
            >
              Edit
            </button>
          )}
          {currUser?.id !== user.id && canModify && (
            <>
              <button
                onClick={handleSuspend}
                className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-orange-500 hover:text-orange-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-orange-50 hover:bg-opacity-10"
              >
                {suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={handleDelete}
                className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
      <Modal isOpen={qrOpen} onClose={() => setQrOpen(false)}>
        <div className="p-6 flex flex-col items-center gap-4 max-w-sm">
          <h2 className="text-lg font-bold text-theme-text-primary">Mobile pairing for {user.username}</h2>
          <p className="text-sm text-theme-text-secondary text-center">Scan this code in AnythingLLM Mobile. The registered device will be assigned to this account.</p>
          {qrLoading ? <PreLoader /> : qrError ? <p className="text-sm text-red-500">{qrError}</p> : qrUrl ? <div className="bg-white p-3 rounded-lg"><QRCodeSVG value={qrUrl} size={240} level="L" /></div> : null}
          <button onClick={() => setQrOpen(false)} className="px-4 py-2 rounded-lg bg-theme-button text-white">Close</button>
        </div>
      </Modal>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <EditUserModal
          currentUser={currUser}
          user={user}
          closeModal={closeModal}
        />
      </Modal>
    </>
  );
}
