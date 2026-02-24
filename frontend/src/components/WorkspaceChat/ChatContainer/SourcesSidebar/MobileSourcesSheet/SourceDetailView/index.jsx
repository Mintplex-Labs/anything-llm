import { CaretLeft, X } from "@phosphor-icons/react";
import { decode as HTMLDecode } from "he";
import truncate from "truncate";
import { omitChunkHeader } from "../../../ChatHistory/Citation";

export default function SourceDetailView({ source, onBack, onClose }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="text-white/60 light:text-slate-400 hover:text-white light:hover:text-slate-900 transition-colors"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <p className="font-semibold text-base leading-6 text-white light:text-slate-900 truncate px-2">
          {truncate(source.title, 30)}
        </p>
        <button
          onClick={onClose}
          type="button"
          className="text-white/60 light:text-slate-400 hover:text-white light:hover:text-slate-900 transition-colors"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto no-scroll">
        {source.chunks.map((chunk, idx) => (
          <p
            key={idx}
            className="text-sm leading-[20px] text-white light:text-slate-900"
          >
            {HTMLDecode(omitChunkHeader(chunk.text))}
          </p>
        ))}
      </div>
    </>
  );
}
