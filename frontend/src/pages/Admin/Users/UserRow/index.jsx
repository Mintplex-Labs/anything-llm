import { useRef, useState } from "react";
import { titleCase } from "text-case";
import Admin from "../../../../models/admin";
import EditUserModal, { EditUserModalId } from "./EditUserModal";

export default function UserRow({ currUser, user }) {
  const rowRef = useRef(null);
  const [suspended, setSuspended] = useState(user.suspended === 1);
  const handleSuspend = async () => {
    if (
      !window.confirm(
        `Are you sure you want to suspend ${user.username}?\nAfter you do this they will be logged out and unable to log back into this instance of AnythingLLM until unsuspended by an admin.`
      )
    )
      return false;
    setSuspended(!suspended);
    await Admin.updateUser(user.id, { suspended: suspended ? 0 : 1 });
  };
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.username}?\nAfter you do this they will be logged out and unable to use this instance of AnythingLLM.\n\nThis action is irreversible.`
      )
    )
      return false;
    rowRef?.current?.remove();
    await Admin.deleteUser(user.id);
  };

  return (
    <>
      <tr ref={rowRef} className="bg-transparent">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {user.username}
        </th>
        <td className="px-6 py-4">{titleCase(user.role)}</td>
        <td className="px-6 py-4">{user.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={() =>
              document?.getElementById(EditUserModalId(user))?.showModal()
            }
            className="font-medium text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 hover:dark:bg-blue-800 hover:dark:bg-opacity-20"
          >
            Edit
          </button>
          {currUser.id !== user.id && (
            <>
              <button
                onClick={handleSuspend}
                className="font-medium text-orange-600 dark:text-orange-300 px-2 py-1 rounded-lg hover:bg-orange-50 hover:dark:bg-orange-800 hover:dark:bg-opacity-20"
              >
                {suspended ? "Unsuspend" : "Suspend"}
              </button>
              <button
                onClick={handleDelete}
                className="font-medium text-red-600 dark:text-red-300 px-2 py-1 rounded-lg hover:bg-red-50 hover:dark:bg-red-800 hover:dark:bg-opacity-20"
              >
                Delete
              </button>
            </>
          )}
        </td>
      </tr>
      <EditUserModal user={user} />
    </>
  );
}
