import { useEffect, useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "@/models/admin";
import { Trash } from "@phosphor-icons/react";

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
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <td scope="row" className="px-6 py-4 whitespace-nowrap">
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
                className="border-none font-medium text-blue-300 rounded-lg hover:text-blue-400 hover:underline"
              >
                {copied ? "Copied" : "Copy Invite Link"}
              </button>
              <td className="px-6 py-4 flex items-center gap-x-6">
                <button
                  onClick={handleDelete}
                  className="border-none font-medium text-theme-text-primary hover:text-red-500 px-2 py-1 rounded-lg"
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
