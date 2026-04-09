import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle } from "@phosphor-icons/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ModelRouterAPI from "@/models/modelRouter";
import showToast from "@/utils/toast";
import RuleForm from "./RuleForm";
import RuleRow from "./RuleRow";

export default function RuleBuilder({ routerId, rules, onRulesChanged }) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const handleRuleCreated = () => {
    setShowForm(false);
    onRulesChanged();
  };

  const handleRuleUpdated = () => {
    setEditingRule(null);
    onRulesChanged();
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

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between pb-4 border-b border-white/20 light:border-slate-300">
        <div>
          <p className="text-base font-semibold text-white light:text-slate-900">
            {t("model-router.rules.title")}
          </p>
          <p className="text-xs text-zinc-400 light:text-slate-600 mt-1">
            {t("model-router.rules.description")}
          </p>
        </div>
        {!showForm && !editingRule && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200"
          >
            <PlusCircle className="h-4 w-4" weight="bold" />
            {t("model-router.rules.add-rule")}
          </button>
        )}
      </div>

      {showForm && (
        <div className="mt-4 border border-zinc-700 light:border-slate-200 rounded-xl p-4">
          <RuleForm
            routerId={routerId}
            nextPriority={(rules?.length || 0) + 1}
            onSaved={handleRuleCreated}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingRule && (
        <div className="mt-4 border border-zinc-700 light:border-slate-200 rounded-xl p-4">
          <RuleForm
            routerId={routerId}
            existingRule={editingRule}
            onSaved={handleRuleUpdated}
            onCancel={() => setEditingRule(null)}
          />
        </div>
      )}

      <div className="mt-4">
        {(!rules || rules.length === 0) && !showForm ? (
          <p className="text-sm text-zinc-400 light:text-slate-500 py-4 text-center">
            {t("model-router.rules.no-rules")}
          </p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="rules">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col gap-y-2"
                >
                  {rules?.map((rule, index) => (
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
                            onEdit={() => {
                              setShowForm(false);
                              setEditingRule(rule);
                            }}
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
        )}
      </div>
    </div>
  );
}
