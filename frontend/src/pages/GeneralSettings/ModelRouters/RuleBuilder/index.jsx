import { useState } from "react";
import {
  PlusCircle,
  Trash,
  PencilSimple,
  DotsSixVertical,
} from "@phosphor-icons/react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import ModelRouterAPI from "@/models/modelRouter";
import showToast from "@/utils/toast";
import RuleForm from "./RuleForm";

const COMPARATOR_LABELS = {
  contains: "contains",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
  neq: "!=",
};

export default function RuleBuilder({ routerId, rules, onRulesChanged }) {
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
    if (!window.confirm(`Delete rule "${rule.title}"?`)) return;
    const { success } = await ModelRouterAPI.deleteRule(routerId, rule.id);
    if (success) {
      showToast("Rule deleted", "info");
      onRulesChanged();
    } else {
      showToast("Failed to delete rule", "error");
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
      showToast("Failed to reorder rules", "error");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between pb-4 border-b border-white/20 light:border-slate-300">
        <div>
          <p className="text-base font-semibold text-white light:text-slate-900">
            Routing Rules
          </p>
          <p className="text-xs text-zinc-400 light:text-slate-600 mt-1">
            Rules are evaluated top-to-bottom by priority. Drag to reorder.
            First match wins.
          </p>
        </div>
        {!showForm && !editingRule && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-x-1.5 text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg h-9 px-5 hover:opacity-90 transition-opacity duration-200"
          >
            <PlusCircle className="h-4 w-4" weight="bold" />
            Add Rule
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
            No rules yet. Add a rule to start routing.
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

function RuleRow({
  rule,
  isEditing,
  onEdit,
  onDelete,
  onToggle,
  dragHandleProps,
}) {
  const comparatorLabel = COMPARATOR_LABELS[rule.comparator] || rule.comparator;

  return (
    <div
      className={`flex items-center border rounded-xl p-3 ${
        isEditing
          ? "border-blue-500/50"
          : rule.enabled
            ? "border-zinc-700 light:border-slate-200"
            : "border-zinc-800 light:border-slate-100 opacity-50"
      }`}
    >
      <div {...dragHandleProps} className="cursor-grab mr-2 shrink-0">
        <DotsSixVertical
          size={18}
          weight="bold"
          className="text-zinc-500 light:text-slate-400"
        />
      </div>
      <div className="flex flex-col gap-y-1 flex-1 min-w-0">
        <div className="flex items-center gap-x-2">
          <span className="text-xs font-mono text-zinc-400 light:text-slate-500">
            #{rule.priority}
          </span>
          <span className="text-sm font-semibold text-white light:text-slate-900 truncate">
            {rule.title}
          </span>
          {rule.type === "llm" && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 light:bg-purple-100 light:text-purple-700">
              LLM
            </span>
          )}
        </div>
        {rule.type === "llm" ? (
          <p className="text-xs text-zinc-300 light:text-slate-700 truncate">
            MATCH{" "}
            <span className="font-mono text-purple-400 light:text-purple-500">
              &quot;{rule.description}&quot;
            </span>{" "}
            THEN{" "}
            <span className="font-medium text-white light:text-slate-900">
              {rule.route_provider} / {rule.route_model}
            </span>
          </p>
        ) : (
          <p className="text-xs text-zinc-300 light:text-slate-700">
            IF{" "}
            <span className="font-mono text-blue-400 light:text-blue-500">
              {rule.property}
            </span>{" "}
            <span className="font-medium">{comparatorLabel}</span>{" "}
            <span className="font-mono text-blue-400 light:text-blue-500">
              &quot;{rule.value}&quot;
            </span>{" "}
            THEN{" "}
            <span className="font-medium text-white light:text-slate-900">
              {rule.route_provider} / {rule.route_model}
            </span>
          </p>
        )}
      </div>
      <div className="flex items-center gap-x-3 ml-4 shrink-0">
        <SimpleToggleSwitch
          enabled={rule.enabled}
          onChange={onToggle}
          size="md"
        />
        <button
          onClick={onEdit}
          className="text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
        >
          <PencilSimple className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
