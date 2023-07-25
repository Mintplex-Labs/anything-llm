import { useEffect, useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "../../../../models/admin";

export default function InviteRow({ invite }) {
  const rowRef = useRef(null);
  const [status, setStatus] = useState(invite.status);
  const [copied, setCopied] = useState(false);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate this invite?\nAfter you do this it will not longer be useable.\n\nThis action is irreversible.`
      )
    )
      return false;
    if (rowRef?.current) {
      rowRef.current.children[0].innerText = "Disabled";
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
      <tr ref={rowRef} className="bg-transparent">
        <td
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white font-mono"
        >
          {titleCase(status)}
        </td>
        <td className="px-6 py-4">
          {invite.claimedBy
            ? invite.claimedBy?.username || "deleted user"
            : "--"}
        </td>
        <td className="px-6 py-4">
          {invite.createdBy?.username || "deleted user"}
        </td>
        <td className="px-6 py-4">{invite.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          {status === "pending" && (
            <>
              <button
                onClick={copyInviteLink}
                disabled={copied}
                className="font-medium text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 hover:dark:bg-blue-800 hover:dark:bg-opacity-20"
              >
                {copied ? "Copied" : "Copy Invite Link"}
              </button>
              <button
                onClick={handleDelete}
                className="font-medium text-red-600 dark:text-red-300 px-2 py-1 rounded-lg hover:bg-red-50 hover:dark:bg-red-800 hover:dark:bg-opacity-20"
              >
                Deactivate
              </button>
            </>
          )}
        </td>
      </tr>
    </>
  );
}
