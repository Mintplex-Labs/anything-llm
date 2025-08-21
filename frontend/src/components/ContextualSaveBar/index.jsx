import { Warning } from "@phosphor-icons/react";

export default function ContextualSaveBar({
  showing = false,
  onSave,
  onCancel,
}) {
  if (!showing) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-dark-input flex items-center justify-end px-4 z-[999]">
      <div className="absolute ml-4 left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center gap-x-2">
        <Warning size={18} className="text-[#FFFFFF]" />
        <p className="text-[#FFFFFF] font-medium text-xs">Unsaved Changes</p>
      </div>
      <div className="flex items-center gap-x-2">
        <button
          className="border-none text-theme-text-primary font-medium text-sm px-[10px] py-[6px] rounded-md bg-theme-bg-secondary hover:bg-theme-bg-primary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="border-none text-theme-text-primary font-medium text-sm px-[10px] py-[6px] rounded-md bg-primary-button hover:bg-primary-button-hover"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  );
}
