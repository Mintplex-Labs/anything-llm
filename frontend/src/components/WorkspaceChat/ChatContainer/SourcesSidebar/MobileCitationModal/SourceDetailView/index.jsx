import { Fragment } from "react";
import { CaretLeft, Info, X } from "@phosphor-icons/react";
import { decode as HTMLDecode } from "he";
import truncate from "truncate";
import { useTranslation } from "react-i18next";
import { omitChunkHeader } from "../../../ChatHistory/Citation";
import { toPercentString } from "@/utils/numbers";

export default function SourceDetailView({ source, onBack, onClose }) {
  const { t } = useTranslation();
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
      <div className="flex flex-col overflow-y-auto no-scroll">
        {source.chunks.map(({ text, score }, idx) => (
          <Fragment key={idx}>
            <div className="flex flex-col gap-y-1 py-4">
              <p className="text-sm leading-[20px] text-white light:text-slate-900">
                {HTMLDecode(omitChunkHeader(text))}
              </p>
              {!!score && (
                <div className="flex items-center text-xs text-white/60 light:text-slate-500 gap-x-1">
                  <Info size={14} />
                  <p>
                    {toPercentString(score)} {t("chat_window.similarity_match")}
                  </p>
                </div>
              )}
            </div>
            {idx !== source.chunks.length - 1 && (
              <hr className="border-zinc-700 light:border-slate-300" />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
}
