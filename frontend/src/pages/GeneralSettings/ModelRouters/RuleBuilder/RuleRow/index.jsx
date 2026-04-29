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
  between: "between",
};

export default function RuleRow({
  rule,
  isEditing,
  onEdit,
  onDelete,
  onToggle,
  dragHandleProps,
}) {
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
          <LLMRuleBody rule={rule} />
        ) : (
          <CalculatedRuleBody rule={rule} />
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

function LLMRuleBody({ rule }) {
  return (
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
  );
}

function CalculatedRuleBody({ rule }) {
  const conditions = Array.isArray(rule.conditions) ? rule.conditions : [];
  const routeTo = (
    <span className="text-zinc-200 light:text-slate-700">
      {rule.route_provider}/{rule.route_model}
    </span>
  );

  if (conditions.length === 0) {
    return (
      <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
        No conditions — route to {routeTo}
      </p>
    );
  }

  if (conditions.length === 1) {
    return (
      <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
        If <ConditionText condition={conditions[0]} /> then route to {routeTo}
      </p>
    );
  }

  const quantifier = rule.condition_logic === "OR" ? "ANY" : "ALL";
  return (
    <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
      If {quantifier} of{" "}
      {conditions.map((c, i) => (
        <span key={i}>
          <ConditionText condition={c} />
          {i < conditions.length - 1 ? ", " : ""}
        </span>
      ))}{" "}
      then route to {routeTo}
    </p>
  );
}

function ConditionText({ condition }) {
  const label = COMPARATOR_LABELS[condition.comparator] || condition.comparator;
  return (
    <>
      <span className="font-mono text-blue-400 light:text-blue-500">
        {condition.property}
      </span>{" "}
      {label}{" "}
      <span className="font-mono text-blue-400 light:text-blue-500">
        &quot;{condition.value}&quot;
      </span>
    </>
  );
}
