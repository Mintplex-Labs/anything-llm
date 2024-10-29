import { Trash } from "@phosphor-icons/react";
import { useState } from "react";
import showToast from "@/utils/toast";
import Hub from "@/models/hub";

export default function HubItemRow({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    const success = await Hub.deleteItem(item.id);
    if (!success) {
      showToast("Failed to delete item", "error");
      setDeleting(false);
      return;
    }
    showToast("Item deleted successfully", "success");
    onDelete(item.id);
  };

  return (
    <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium">
      <td className="px-6 py-4">{item.name}</td>
      <td className="px-6 py-4 capitalize">{item.type}</td>
      <td className="px-6 py-4">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 cursor-pointer">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="transition-all duration-300 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
        >
          <Trash className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
