import { useState } from "react";
import {
  Trash,
  PencilSimple,
  Star,
  StarHalf,
  Flask,
} from "@phosphor-icons/react";
import moment from "moment";

export default function ConnectionRow({
  connection,
  onEdit,
  onDelete,
  onSetDefault,
  onTest,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the connection "${connection.name}"?`
      )
    )
      return;

    setIsDeleting(true);
    await onDelete(connection.id);
    setIsDeleting(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    await onTest(connection.id);
    setIsTesting(false);
  };

  return (
    <tr className="bg-transparent text-theme-text-primary text-xs border-white/10 border-b">
      <td className="px-6 py-4 font-medium whitespace-nowrap text-theme-text-primary">
        {connection.name}
      </td>
      <td className="px-6 py-4 text-theme-text-primary">
        <span className="capitalize">{connection.provider}</span>
      </td>
      <td className="px-6 py-4">
        {connection.isDefault ? (
          <Star className="h-4 w-4 text-yellow-500" weight="fill" />
        ) : (
          <button
            onClick={() => onSetDefault(connection.id)}
            className="text-theme-text-secondary hover:text-yellow-500 transition-colors"
            title="Set as default"
          >
            <StarHalf className="h-4 w-4" />
          </button>
        )}
      </td>
      <td className="px-6 py-4 text-theme-text-secondary">
        {connection.createdAt
          ? moment(connection.createdAt).format("lll")
          : "Unknown"}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-x-2">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="text-theme-text-secondary hover:text-blue-300 transition-colors disabled:opacity-50"
            title="Test connection"
          >
            <Flask className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(connection)}
            className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
            title="Edit connection"
          >
            <PencilSimple className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || connection.isDefault}
            className="text-theme-text-secondary hover:text-red-400 transition-colors disabled:opacity-50"
            title={
              connection.isDefault
                ? "Cannot delete default connection"
                : "Delete connection"
            }
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
