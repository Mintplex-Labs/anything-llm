import { useState } from "react";
import {
  CaretDown,
  CaretRight,
  CheckCircle,
  Copy,
} from "@phosphor-icons/react";
import { copyMarkdownAsRichText } from "@/utils/clipboard";

// Generic expand/collapse panel used by the run-detail page to wrap each
// trace section (thinking, tool calls, response, files).
export default function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  copyableContent = null,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-700 light:border-slate-400 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="border-none flex-1 h-12 flex items-center gap-2 px-[18px] hover:bg-white/5 light:hover:bg-slate-100 transition-colors text-left"
        >
          {open ? (
            <CaretDown className="h-4 w-4 text-zinc-50 light:text-slate-950" />
          ) : (
            <CaretRight className="h-4 w-4 text-zinc-50 light:text-slate-950" />
          )}
          <Icon className="h-4 w-4 text-zinc-50 light:text-slate-950" />
          <span className="text-sm font-medium text-zinc-50 light:text-slate-950">
            {title}
          </span>
        </button>
        {copyableContent && <CopyButton content={copyableContent} />}
      </div>
      {open && (
        <div className="px-[18px] py-3 border-t border-zinc-700 light:border-slate-400">
          {children}
        </div>
      )}
    </div>
  );
}

function CopyButton({ content }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    await copyMarkdownAsRichText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      disabled={copied}
      className="h-12 px-4 flex items-center hover:bg-white/5 light:hover:bg-slate-100 transition-colors"
    >
      {copied ? (
        <CheckCircle size={20} className="text-green-500" />
      ) : (
        <Copy size={20} className="text-zinc-50 light:text-slate-950" />
      )}
    </button>
  );
}
