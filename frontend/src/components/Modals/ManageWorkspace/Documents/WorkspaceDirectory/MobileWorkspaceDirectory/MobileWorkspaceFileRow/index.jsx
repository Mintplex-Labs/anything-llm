import { useTranslation } from "react-i18next";
import { DotsThreeVertical, Eye, File, PushPin } from "@phosphor-icons/react";
import { middleTruncate } from "@/utils/directories";
import MobileCheckbox from "../../../MobileCheckbox";
import usePinDocument from "../../../hooks/usePinDocument";
import useWatchDocument from "../../../hooks/useWatchDocument";

/**
 * @param {Object} props
 * @param {boolean} props.staged - Moved in but not embedded yet
 * @param {boolean} props.selectable - False while staged changes are unsaved
 */
export default function MobileWorkspaceFileRow({
  item,
  folderName,
  workspace,
  staged,
  selected,
  selectable,
  onToggle,
  onOpenActions,
}) {
  const { t } = useTranslation();
  const docPath = `${folderName}/${item.name}`;
  const { pinned, togglePin } = usePinDocument({ workspace, docPath, item });
  const { watched, toggleWatch } = useWatchDocument({
    workspace,
    docPath,
    item,
  });

  return (
    <div
      onClick={selectable ? () => onToggle(item) : undefined}
      className={`flex items-center min-h-[56px] rounded-xl transition-colors duration-150 active:bg-zinc-800 light:active:bg-slate-100 ${
        selectable ? "cursor-pointer" : "pl-3"
      }`}
    >
      {selectable && <MobileCheckbox state={selected ? "all" : "none"} />}
      <File
        weight="fill"
        className="w-5 h-5 shrink-0 text-zinc-500 light:text-slate-400"
      />
      <div className="flex-1 min-w-0 ml-3 py-1.5">
        <p className="text-sm truncate text-slate-50 light:text-slate-900">
          {middleTruncate(item.title, 40)}
        </p>
        <RowStatus
          staged={staged}
          folderName={folderName}
          pinned={pinned}
          watched={watched}
        />
      </div>
      {selectable ? (
        <button
          type="button"
          aria-label={t("chat_window.more_actions")}
          onClick={(event) => {
            event.stopPropagation();
            onOpenActions({
              item,
              pinned,
              togglePin,
              watched,
              toggleWatch,
            });
          }}
          className="border-none bg-transparent w-11 h-11 shrink-0 flex items-center justify-center rounded-xl text-zinc-400 light:text-slate-500 active:bg-zinc-700 light:active:bg-slate-200"
        >
          <DotsThreeVertical size={20} weight="bold" />
        </button>
      ) : (
        <div className="w-3 shrink-0" />
      )}
    </div>
  );
}

function RowStatus({ staged, folderName, pinned, watched }) {
  const { t } = useTranslation();

  if (staged)
    return (
      <p className="text-xs font-medium text-sky-400 light:text-sky-700">
        {t("connectors.directory.staged")}
      </p>
    );

  return (
    <p className="flex items-center gap-x-1.5 text-xs text-zinc-400 light:text-slate-500 min-w-0">
      <span className="truncate">{folderName}</span>
      {pinned && (
        <span className="flex items-center gap-x-0.5 shrink-0 text-sky-400 light:text-sky-700">
          <PushPin size={12} weight="fill" />
          {t("connectors.directory.pinned")}
        </span>
      )}
      {watched && (
        <span className="flex items-center gap-x-0.5 shrink-0 text-sky-400 light:text-sky-700">
          <Eye size={12} weight="fill" />
          {t("connectors.directory.watching")}
        </span>
      )}
    </p>
  );
}
