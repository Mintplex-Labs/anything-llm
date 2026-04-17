import { Trash, PencilSimple, DotsSixVertical } from "@phosphor-icons/react";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";

const COMPARATOR_LABELS = {
  contains: "contains",
  matches: "matches",
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
  const isDisabled = !rule.enabled;

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800 light:bg-slate-100 transition-colors ${
        isEditing ? "ring-1 ring-blue-500/60" : ""
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      <div
        {...dragHandleProps}
        className="cursor-grab shrink-0 text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-700 transition-colors"
        aria-label="Drag to reorder"
      >
        <DotsSixVertical size={24} weight="bold" />
      </div>
      <p className="shrink-0 text-sm font-semibold text-zinc-400 light:text-slate-500 tabular-nums">
        #{rule.priority}
      </p>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-5 text-white light:text-slate-900 truncate">
            {rule.title}
          </span>
          {rule.type === "llm" ? (
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400 light:bg-fuchsia-100 light:text-fuchsia-700">
              LLM
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 light:bg-blue-100 light:text-blue-700">
              Calculated
            </span>
          )}
        </div>
        {rule.type === "llm" ? (
          <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
            Match{" "}
            <span className="font-mono text-fuchsia-400 light:text-fuchsia-500">
              &quot;{rule.description}&quot;
            </span>{" "}
            then route to{" "}
            <span className="text-zinc-200 light:text-slate-700">
              {rule.route_provider}/{rule.route_model}
            </span>
          </p>
        ) : (
          <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
            If{" "}
            <span className="font-mono text-blue-400 light:text-blue-500">
              {rule.property}
            </span>{" "}
            {comparatorLabel}{" "}
            <span className="font-mono text-blue-400 light:text-blue-500">
              &quot;{rule.value}&quot;
            </span>{" "}
            then route to{" "}
            <span className="text-zinc-200 light:text-slate-700">
              {rule.route_provider}/{rule.route_model}
            </span>
          </p>
        )}
      </div>
      <div className="flex items-center gap-x-3 shrink-0">
        <SimpleToggleSwitch
          enabled={rule.enabled}
          onChange={onToggle}
          size="md"
        />
        <button
          onClick={onEdit}
          className="border-none text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-colors"
          aria-label="Edit rule"
        >
          <PencilSimple size={16} weight="bold" />
        </button>
        <button
          onClick={onDelete}
          className="border-none text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors"
          aria-label="Delete rule"
        >
          <Trash size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
