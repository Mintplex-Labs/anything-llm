import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {function} props.onSubmit - Called with (content)
 * @param {string} [props.initialContent] - Pre-filled content for editing
 * @param {"create"|"edit"} [props.mode]
 */
export default function MemoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialContent = "",
  mode = "create",
}) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    if (isOpen) setContent(initialContent);
  }, [isOpen, initialContent]);
  const isCreate = mode === "create";
  const title = isCreate ? "Create Memory" : "Edit Memory";
  const submitLabel = isCreate ? "Create" : "Save";
  const description = isCreate
    ? "This memory will be saved and used to personalize future responses."
    : "Update the content of this memory.";

  function handleSubmit() {
    if (!content.trim()) return;
    onSubmit(content.trim());
    onClose();
  }

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="bg-zinc-900 light:bg-white border border-zinc-800 light:border-slate-300 rounded-lg p-6 w-[400px] flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between">
            <p className="font-semibold text-base leading-6 text-zinc-50 light:text-slate-800">
              {title}
            </p>
            <button
              onClick={onClose}
              type="button"
              className="text-zinc-400 light:text-slate-400 hover:text-zinc-50 light:hover:text-slate-900 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
          <p className="text-xs leading-4 text-zinc-400 light:text-slate-500">
            {description}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-200 light:text-slate-700">
            Memory
          </label>
          <textarea
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter a description..."
            rows={4}
            className="w-full bg-zinc-800 light:bg-white text-zinc-50 light:border light:border-slate-300 light:text-slate-700 placeholder:text-zinc-500 light:placeholder:text-slate-400 text-sm rounded-lg p-3 resize-none outline-none focus:border-zinc-500 light:focus:border-slate-400"
          />
        </div>
        <div className="flex items-start justify-between">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-5 rounded-lg border border-zinc-500 light:border-slate-600 bg-transparent text-zinc-50 light:text-slate-900 text-sm font-medium cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="h-9 px-5 rounded-lg border-none bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white text-sm font-medium cursor-pointer hover:bg-white light:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
