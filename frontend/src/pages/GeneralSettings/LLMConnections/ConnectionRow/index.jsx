import { useState } from "react";
import {
  Trash,
  PencilSimple,
  Star,
  StarHalf,
  FlaskConical,
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
    <tr className="bg-transparent text-theme-text-primary text-sm font-medium">
      <td className="px-6 py-4 font-medium whitespace-nowrap text-theme-text-primary">
        {connection.name}
      </td>
      <td className="px-6 py-4">
        <span className="capitalize">{connection.provider}</span>
      </td>
      <td className="px-6 py-4">
        {connection.isDefault ? (
          <Star className="h-5 w-5 text-yellow-500" weight="fill" />
        ) : (
          <button
            onClick={() => onSetDefault(connection.id)}
            className="text-theme-text-secondary hover:text-yellow-500 transition-colors"
            title="Set as default"
          >
            <StarHalf className="h-5 w-5" />
          </button>
        )}
      </td>
      <td className="px-6 py-4">
        {connection.createdAt
          ? moment(connection.createdAt).format("lll")
          : "Unknown"}
      </td>
      <td className="px-6 py-4 flex items-center gap-x-2">
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="text-theme-text-secondary hover:text-blue-500 transition-colors disabled:opacity-50"
          title="Test connection"
        >
          <FlaskConical className="h-5 w-5" />
        </button>
        <button
          onClick={() => onEdit(connection)}
          className="text-theme-text-secondary hover:text-theme-text-primary transition-colors"
          title="Edit connection"
        >
          <PencilSimple className="h-5 w-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting || connection.isDefault}
          className="text-theme-text-secondary hover:text-red-500 transition-colors disabled:opacity-50"
          title={
            connection.isDefault
              ? "Cannot delete default connection"
              : "Delete connection"
          }
        >
          <Trash className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}
