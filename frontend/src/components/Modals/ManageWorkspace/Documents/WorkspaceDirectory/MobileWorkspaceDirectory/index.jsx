import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUUpLeft, Eye, PushPin } from "@phosphor-icons/react";
import PreLoader from "@/components/Preloader";
import EmbeddingFileRow from "@/components/EmbeddingFileRow";
import MobileWorkspaceFileRow from "./MobileWorkspaceFileRow";
import MobileSheet, { MobileSheetOption } from "../../MobileSheet";
import MobileActionBar, { MobileActionButton } from "../../MobileActionBar";

/**
 * Touch layout of the workspace documents panel. State and mutations come from `WorkspaceDirectory`.
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

  const embedding = Object.entries(embeddingProgress ?? {});
  const embeddedFiles = orderedFiles.filter(
    ({ item, folder }) => !embeddingProgress?.[`${folder.name}/${item.name}`]
  );
  const selectable = !hasChanges && embedding.length === 0;

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
            count: embeddedFiles.length,
          })}
        </p>
        {selectable && embeddedFiles.length > 0 && (
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
        {embedding.length > 0 && (
          <div className="mb-2 rounded-xl bg-zinc-800 light:bg-slate-100">
            {embedding.map(([filename, fileStatus]) => (
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
        )}
        {embeddedFiles.length === 0 && embedding.length === 0 && (
          <p className="h-full flex items-center justify-center text-sm text-zinc-400 light:text-slate-500">
            {t("connectors.directory.no_docs")}
          </p>
        )}
        {embeddedFiles.map(({ item, folder }) => (
          <MobileWorkspaceFileRow
            key={item.id}
            item={item}
            folderName={folder.name}
            workspace={workspace}
            staged={movedItems.some((moved) => moved.id === item.id)}
            selected={!!selectedItems[item.id]}
            selectable={selectable}
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
          {embedding.length > 0
            ? t("connectors.directory.add-to-queue")
            : t("connectors.directory.save_embed")}
        </MobileActionButton>
      </MobileActionBar>
      <MobileActionBar
        show={selectable && selectedIds.length > 0}
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
