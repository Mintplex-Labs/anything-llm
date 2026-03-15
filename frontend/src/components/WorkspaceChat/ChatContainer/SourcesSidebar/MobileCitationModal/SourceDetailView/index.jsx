import { CaretLeft, X } from "@phosphor-icons/react";
import truncate from "truncate";
import SourceDetailBody from "../../SourceDetailBody";

export default function SourceDetailView({
  source,
  workspaceSlug = null,
  threadSlug = null,
  onBack,
  onClose,
}) {
  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="text-white/60 light:text-infinite-night/40 hover:text-white light:hover:text-slate-900 transition-colors"
        >
          <CaretLeft size={20} weight="bold" />
        </button>
        <p className="font-semibold text-base leading-6 text-white light:text-slate-900 truncate px-2">
          {truncate(source.title, 30)}
        </p>
        <button
          onClick={onClose}
          type="button"
          className="text-white/60 light:text-infinite-night/40 hover:text-white light:hover:text-slate-900 transition-colors"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
      <div className="flex flex-col overflow-y-auto no-scroll pt-4">
        <SourceDetailBody
          source={source}
          workspaceSlug={workspaceSlug}
          threadSlug={threadSlug}
        />
      </div>
    </>
  );
}
