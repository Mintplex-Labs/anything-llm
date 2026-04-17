import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ModelRouterAPI from "@/models/modelRouter";
import { useModal } from "@/hooks/useModal";
import showToast from "@/utils/toast";
import RuleForm from "./RuleForm";
import RuleRow from "./RuleRow";

export default function RuleBuilder({
  routerId,
  routerName,
  rules,
  onRulesChanged,
}) {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();
  const [editingRule, setEditingRule] = useState(null);

  const openCreate = () => {
    setEditingRule(null);
    openModal();
  };

  const openEdit = (rule) => {
    setEditingRule(rule);
    openModal();
  };

  const handleModalClose = () => {
    closeModal();
    setEditingRule(null);
  };

  const handleDelete = async (rule) => {
    if (
      !window.confirm(
        t("model-router.rules.delete-confirm", { title: rule.title })
      )
    )
      return;
    const { success } = await ModelRouterAPI.deleteRule(routerId, rule.id);
    if (success) {
      showToast(t("model-router.rules.toast-deleted"), "info");
      onRulesChanged();
    } else {
      showToast(t("model-router.rules.toast-delete-failed"), "error");
    }
  };

  const handleToggle = async (rule) => {
    const { rule: updated } = await ModelRouterAPI.updateRule(
      routerId,
      rule.id,
      { enabled: !rule.enabled }
    );
    if (updated) onRulesChanged();
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(rules);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const ruleUpdates = reordered.map((rule, index) => ({
      id: rule.id,
      priority: index + 1,
    }));

    const { success } = await ModelRouterAPI.reorderRules(
      routerId,
      ruleUpdates
    );
    if (success) {
      onRulesChanged();
    } else {
      showToast(t("model-router.rules.toast-reorder-failed"), "error");
    }
  };

  const hasRules = rules && rules.length > 0;

  return (
    <div className="mt-8">
      <div className="flex items-end justify-between pb-6 border-b border-white/20 light:border-slate-300">
        <div className="flex flex-col gap-y-2">
          <p className="text-lg font-semibold leading-7 text-white light:text-slate-900">
            {routerName
              ? t("model-router.rules.title-with-name", { name: routerName })
              : t("model-router.rules.title")}
          </p>
          <p className="text-xs leading-4 text-zinc-400 light:text-slate-600 max-w-[700px]">
            {t("model-router.rules.description")}
          </p>
        </div>
        {hasRules && (
          <button
            onClick={openCreate}
            className="shrink-0 flex items-center justify-center h-9 px-5 py-2.5 rounded-lg bg-slate-50 text-zinc-950 text-sm font-medium leading-5 hover:opacity-90 transition-opacity duration-200"
          >
            {t("model-router.rules.add-rule")}
          </button>
        )}
      </div>

      {hasRules ? (
        <div className="mt-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="rules">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-y-2"
                >
                  {rules.map((rule, index) => (
                    <Draggable
                      key={rule.id}
                      draggableId={rule.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? "opacity-60" : ""}
                        >
                          <RuleRow
                            rule={rule}
                            isEditing={editingRule?.id === rule.id}
                            onEdit={() => openEdit(rule)}
                            onDelete={() => handleDelete(rule)}
                            onToggle={() => handleToggle(rule)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8 py-28">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="text-base font-semibold leading-6 text-zinc-50 light:text-slate-900">
              {t("model-router.rules.no-rules")}
            </p>
            <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 max-w-[370px]">
              {t("model-router.rules.empty-description")}
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center h-9 px-5 py-2.5 rounded-lg bg-slate-50 text-zinc-950 text-sm font-medium leading-5 hover:opacity-90 transition-opacity duration-200"
          >
            {t("model-router.rules.new-rule-button")}
          </button>
        </div>
      )}

      <RuleForm
        key={editingRule?.id ?? "new"}
        isOpen={isOpen}
        closeModal={handleModalClose}
        routerId={routerId}
        existingRule={editingRule}
        nextPriority={(rules?.length || 0) + 1}
        onSaved={onRulesChanged}
      />
    </div>
  );
}
