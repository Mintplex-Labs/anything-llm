import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUUpLeft, Eye, PushPin } from "@phosphor-icons/react";
import PreLoader from "@/components/Preloader";
import EmbeddingFileRow from "@/components/EmbeddingFileRow";
import MobileWorkspaceFileRow from "./MobileWorkspaceFileRow";
import MobileSheet, { MobileSheetOption } from "../../MobileSheet";
import MobileActionBar, { MobileActionButton } from "../../MobileActionBar";

/**
 * Touch layout of the workspace documents panel. Selection, removal, and
 * saving are owned by `WorkspaceDirectory`; this stays presentational.
 *
 * @param {Object} props
 * @param {Array<{item: object, folder: object}>} props.orderedFiles
 * @param {Record<string, object>|null} props.embeddingProgress
 * @param {Record<string, boolean>} props.selectedItems
 * @param {(ids: string[]) => void} props.onRemoveItems
 */
export default function MobileWorkspaceDirectory({
  workspace,
  orderedFiles,
  loading,
  loadingMessage,
  embeddingProgress,
  onRemoveQueued,
  hasChanges,
  movedItems,
  selectedItems,
  allSelected,
  onToggleItem,
  onToggleSelectAll,
  onRemoveItems,
  onSave,
}) {
  const { t } = useTranslation();
  const [actions, setActions] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const selectedIds = Object.keys(selectedItems);

  if (loading)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-y-4 px-8">
        <PreLoader />
        <p className="text-sm font-medium text-center animate-pulse text-slate-50 light:text-slate-900">
          {loadingMessage}
        </p>
      </div>
    );

  if (embeddingProgress)
    return (
      <div className="relative flex flex-col flex-1 min-h-0">
        <div
          className={`flex-1 min-h-0 overflow-y-auto px-2 ${
            hasChanges ? "pb-40" : "pb-6"
          }`}
        >
          {Object.entries(embeddingProgress).map(([filename, fileStatus]) => (
            <EmbeddingFileRow
              key={filename}
              filename={filename}
              status={fileStatus}
              onRemove={
                fileStatus.status === "pending"
                  ? () => onRemoveQueued(filename)
                  : null
              }
            />
          ))}
        </div>
        <MobileActionBar
          show={hasChanges && movedItems.length > 0}
          label={t("connectors.directory.ready-to-embed", {
            count: movedItems.length,
          })}
        >
          <MobileActionButton onClick={onSave}>
            {t("connectors.directory.add-to-queue")}
          </MobileActionButton>
        </MobileActionBar>
      </div>
    );

  const openActions = (rowActions) => {
    setActions(rowActions);
    setShowActions(true);
  };
  const runAction = (action) => {
    setShowActions(false);
    action();
  };

  return (
    <div className="relative flex flex-col flex-1 min-h-0">
      <div className="shrink-0 flex items-center justify-between h-9 px-4 text-xs text-zinc-400 light:text-slate-500">
        <p>
          {t("connectors.directory.total-documents", {
            count: orderedFiles.length,
          })}
        </p>
        {!hasChanges && orderedFiles.length > 0 && (
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="border-none bg-transparent h-9 -mr-2 px-2 text-xs font-semibold text-sky-400 light:text-sky-700"
          >
            {allSelected
              ? t("connectors.directory.deselect_all")
              : t("connectors.directory.select_all")}
          </button>
        )}
      </div>

      <div
        className={`flex-1 min-h-0 overflow-y-auto px-2 select-none ${
          hasChanges || selectedIds.length > 0 ? "pb-40" : "pb-6"
        }`}
      >
        {orderedFiles.length === 0 && (
          <p className="h-full flex items-center justify-center text-sm text-zinc-400 light:text-slate-500">
            {t("connectors.directory.no_docs")}
          </p>
        )}
        {orderedFiles.map(({ item, folder }) => (
          <MobileWorkspaceFileRow
            key={item.id}
            item={item}
            folderName={folder.name}
            workspace={workspace}
            staged={movedItems.some((moved) => moved.id === item.id)}
            selected={!!selectedItems[item.id]}
            selectable={!hasChanges}
            onToggle={onToggleItem}
            onOpenActions={openActions}
          />
        ))}
      </div>

      <MobileActionBar
        show={hasChanges}
        label={t("connectors.directory.ready-to-embed", {
          count: movedItems.length,
        })}
      >
        <MobileActionButton onClick={onSave}>
          {t("connectors.directory.save_embed")}
        </MobileActionButton>
      </MobileActionBar>
      <MobileActionBar
        show={!hasChanges && selectedIds.length > 0}
        label={t("connectors.directory.selected-count", {
          count: selectedIds.length,
        })}
      >
        <MobileActionButton
          variant="danger"
          onClick={() => onRemoveItems(selectedIds)}
        >
          {t("connectors.directory.remove_selected")}
        </MobileActionButton>
      </MobileActionBar>

      <MobileSheet
        open={showActions}
        onClose={() => setShowActions(false)}
        title={actions?.item.title}
      >
        {actions && (
          <>
            <MobileSheetOption
              icon={PushPin}
              label={
                actions.pinned
                  ? t("connectors.directory.unpin")
                  : t("connectors.directory.pin")
              }
              onClick={() => runAction(actions.togglePin)}
            />
            {actions.item.canWatch && (
              <MobileSheetOption
                icon={Eye}
                label={
                  actions.watched
                    ? t("connectors.directory.unwatch")
                    : t("connectors.directory.watch")
                }
                onClick={() => runAction(actions.toggleWatch)}
              />
            )}
            <MobileSheetOption
              danger
              icon={ArrowUUpLeft}
              label={t("connectors.directory.remove-from-workspace")}
              onClick={() => runAction(() => onRemoveItems([actions.item.id]))}
            />
          </>
        )}
      </MobileSheet>
    </div>
  );
}
