import moment from "moment";
import { Trash } from "@phosphor-icons/react";
import System from "@/models/system";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import { useModal } from "@/hooks/useModal";
import MarkdownRenderer from "../MarkdownRenderer";
import { safeJsonParse } from "@/utils/request";
import useMultiUserMode from "@/hooks/useMultiUserMode";
import { useTranslation } from "react-i18next";
import {
  THOUGHT_REGEX_COMPLETE,
  THOUGHT_REGEX_OPEN,
} from "@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer";

// Longest text put in a preview cell. CSS cuts it to one line; this only keeps
// very long prompts and responses out of the DOM.
const PREVIEW_MAX_CHARS = 300;

/**
 * Single-line preview of a chat response without its reasoning: complete
 * <think>-style blocks are removed and an unclosed one (reasoning that never
 * finished) is cut off. The response modal still shows the full text.
 * @param {string} text
 * @returns {string}
 */
function responsePreview(text) {
  if (typeof text !== "string") return "";
  let visible = text.replace(new RegExp(THOUGHT_REGEX_COMPLETE, "g"), "");
  const unclosed = visible.search(THOUGHT_REGEX_OPEN);
  if (unclosed !== -1) visible = visible.slice(0, unclosed);
  return visible.trim().slice(0, PREVIEW_MAX_CHARS);
}

export default function ChatRow({ chat, onDelete, formatCost }) {
  const multiUserMode = useMultiUserMode();
  const {
    isOpen: isPromptOpen,
    openModal: openPromptModal,
    closeModal: closePromptModal,
  } = useModal();
  const {
    isOpen: isResponseOpen,
    openModal: openResponseModal,
    closeModal: closeResponseModal,
  } = useModal();

  const response = safeJsonParse(chat.response, {});

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this chat?\n\nThis action is irreversible.`
      )
    )
      return false;
    await System.deleteChat(chat.id);
    onDelete(chat.id);
  };

  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10">
        <td className="px-6 font-medium whitespace-nowrap text-white">
          {chat.id}
        </td>
        {multiUserMode && (
          <td className="px-6 font-medium whitespace-nowrap text-white">
            {chat.user?.username}
          </td>
        )}
        <td className="px-6">{chat.workspace?.name}</td>
        <ModelCell metrics={response?.metrics} />
        <td
          onClick={openPromptModal}
          className="px-6 border-transparent cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          <div className="max-w-[220px] truncate">
            {chat.prompt?.slice(0, PREVIEW_MAX_CHARS)}
          </div>
        </td>
        <td
          onClick={openResponseModal}
          className="px-6 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          <div className="max-w-[220px] truncate">
            {responsePreview(response?.text) || "—"}
          </div>
        </td>
        <CostCell metrics={response?.metrics} formatCost={formatCost} />
        <td className="px-6">{moment(chat.createdAt).format("lll")}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
      <Modal isOpen={isPromptOpen} onClose={closePromptModal}>
        <TextPreview text={chat.prompt} closeModal={closePromptModal} />
      </Modal>
      <Modal isOpen={isResponseOpen} onClose={closeResponseModal}>
        <TextPreview
          text={<MarkdownRenderer content={response?.text} />}
          closeModal={closeResponseModal}
        />
      </Modal>
    </>
  );
}
const TextPreview = ({ text, closeModal }) => {
  return (
    <form className="flex flex-col gap-y-5">
      <ModalHeader title="Viewing Text" onClose={closeModal} />
      <ModalBody>
        <pre className="w-full h-[200px] py-2 px-4 whitespace-pre-line overflow-auto rounded-lg bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 text-zinc-100 light:text-slate-900 text-sm">
          {text}
        </pre>
      </ModalBody>
    </form>
  );
};

/**
 * The provider class and model that produced the response, on one line.
 * Chats recorded without metrics show a dash.
 */
function ModelCell({ metrics }) {
  const label = [metrics?.provider, metrics?.model]
    .filter((part) => typeof part === "string" && part)
    .join(" / ");
  if (!label) return <td className="px-6 whitespace-nowrap">—</td>;

  return (
    <td className="px-6" title={label}>
      <div className="max-w-[200px] truncate">{label}</div>
    </td>
  );
}

function CostCell({ metrics, formatCost }) {
  const { t } = useTranslation();
  if (typeof metrics?.totalCost !== "number")
    return <td className="px-6 whitespace-nowrap">—</td>;

  return (
    <td
      className="px-6 whitespace-nowrap"
      title={t("recorded.table.cost-breakdown", {
        total: formatCost(metrics.totalCost, "full"),
        input: formatCost(metrics.inputCost, "full"),
        output: formatCost(metrics.outputCost, "full"),
      })}
    >
      {formatCost(metrics.totalCost, "significant")}
    </td>
  );
}
