import { useRef } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import EditVariableModal from "./EditVariableModal";
import { titleCase } from "text-case";
import truncate from "truncate";
import { Trash } from "@phosphor-icons/react";

/**
 * A row component for displaying a system prompt variable
 * @param {{id: number|null, key: string, value: string, description: string, type: string}} variable - The system prompt variable to display
 * @param {Function} onRefresh - A function to call when the variable is refreshed
 * @returns {JSX.Element} A JSX element for displaying the variable
 */
export default function VariableRow({ variable, onRefresh }) {
  const rowRef = useRef(null);
  const { isOpen, openModal, closeModal } = useModal();

  const handleDelete = async () => {
    if (!variable.id) return;
    if (
      !window.confirm(
        `Are you sure you want to delete the variable "${variable.key}"?\nThis action is irreversible.`
      )
    )
      return false;

    try {
      await System.promptVariables.delete(variable.id);
      rowRef?.current?.remove();
      showToast("Variable deleted successfully", "success", { clear: true });
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting variable:", error);
      showToast("Failed to delete variable", "error", { clear: true });
    }
  };

  const getTypeColorTheme = (type) => {
    switch (type) {
      case "system":
        return {
          bg: "bg-blue-600/20",
          text: "text-blue-400 light:text-blue-800",
        };
      case "dynamic":
        return {
          bg: "bg-green-600/20",
          text: "text-green-400 light:text-green-800",
        };
      default:
        return {
          bg: "bg-yellow-600/20",
          text: "text-yellow-400 light:text-yellow-800",
        };
    }
  };

  const colorTheme = getTypeColorTheme(variable.type);

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
      >
        <th scope="row" className="px-4 py-2 whitespace-nowrap">
          {variable.key}
        </th>
        <td className="px-4 py-2">
          {typeof variable.value === "function"
            ? variable.value()
            : truncate(variable.value, 50)}
        </td>
        <td className="px-4 py-2">
          {truncate(variable.description || "-", 50)}
        </td>
        <td className="px-4 py-2">
          <span
            className={`rounded-full ${colorTheme.bg} px-2 py-0.5 text-xs leading-5 font-semibold ${colorTheme.text} shadow-sm`}
          >
            {titleCase(variable.type)}
          </span>
        </td>
        <td className="px-4 py-2 flex items-center justify-end gap-x-4">
          {variable.type === "static" && (
            <>
              <button
                onClick={openModal}
                className="text-xs font-medium text-white/80 light:text-black/80 rounded-lg hover:text-white hover:light:text-gray-500 px-2 py-1 hover:bg-white hover:bg-opacity-10"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
              >
                <Trash className="h-4 w-4" />
              </button>
            </>
          )}
        </td>
      </tr>
      <ModalWrapper isOpen={isOpen}>
        <EditVariableModal
          variable={variable}
          closeModal={closeModal}
          onRefresh={onRefresh}
        />
      </ModalWrapper>
    </>
  );
}
