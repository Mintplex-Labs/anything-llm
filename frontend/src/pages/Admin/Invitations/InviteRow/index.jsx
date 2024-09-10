import { useEffect, useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import { Trash } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next"; // i18n 추가

export default function InviteRow({ invite }) {
  const { t } = useTranslation(); // i18n hook 추가
  const rowRef = useRef(null);
  const [status, setStatus] = useState(invite.status);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(t("adminInvites.confirmDelete"))) return false;
    if (rowRef?.current) {
      rowRef.current.children[0].innerText = t("adminInvites.disabled");
    }
    setStatus("disabled");
    await Admin.disableInvite(invite.id);
  };

  const copyInviteLink = () => {
    if (!invite) return false;
    window.navigator.clipboard.writeText(
      `${window.location.origin}/accept-invite/${invite.code}`
    );
    setCopied(true);
  };

  useEffect(() => {
    function resetStatus() {
      if (!copied) return false;
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
    resetStatus();
  }, [copied]);

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <td scope="row" className="px-6 py-4 whitespace-nowrap">
          {titleCase(
            status === "disabled" ? t("adminInvites.disabled") : status
          )}
        </td>
        <td className="px-6 py-4">
          {invite.claimedBy
            ? invite.claimedBy?.username || t("adminInvites.deletedUser")
            : "--"}
        </td>
        <td className="px-6 py-4">
          {invite.createdBy?.username || t("adminInvites.deletedUser")}
        </td>
        <td className="px-6 py-4">{invite.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          {status === "pending" && (
            <>
              <button
                onClick={copyInviteLink}
                disabled={copied}
                className="font-medium text-blue-300 rounded-lg hover:text-white hover:text-opacity-60 hover:underline"
              >
                {copied
                  ? t("adminInvites.copied")
                  : t("adminInvites.copyInviteLink")}
              </button>
              <td className="px-6 py-4 flex items-center gap-x-6">
                <button
                  onClick={handleDelete}
                  className="font-medium text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </>
          )}
        </td>
      </tr>
    </>
  );
}
