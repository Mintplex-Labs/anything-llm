import { Trash, PencilSimple, DotsSixVertical } from "@phosphor-icons/react";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";

const COMPARATOR_LABELS = {
  contains: "contains",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
  neq: "!=",
};

export default function RuleRow({
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
