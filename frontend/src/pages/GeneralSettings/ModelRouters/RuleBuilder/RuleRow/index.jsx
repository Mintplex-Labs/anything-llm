import { Trans, useTranslation } from "react-i18next";
import { Trash, PencilSimple, DotsSixVertical } from "@phosphor-icons/react";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";
import truncate from "truncate";

const COMPARATOR_SYMBOLS = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  eq: "=",
  neq: "!=",
};

function createComparatorLabels(t) {
  return {
    contains: t("model-router.rules.comparator-contains"),
    matches: t("model-router.rules.comparator-matches"),
    between: t("model-router.rules.comparator-between"),
    ...COMPARATOR_SYMBOLS,
  };
}

function getComparatorLabel(t, comparator) {
  const labels = createComparatorLabels(t);
  return labels[comparator] || comparator;
}

export default function RuleRow({
  rule,
  isEditing,
  onEdit,
  onDelete,
  onToggle,
  dragHandleProps,
}) {
  const { t } = useTranslation();
  const isDisabled = !rule.enabled;

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800 light:bg-slate-100 transition-colors ${
        isEditing ? "ring-1 ring-blue-500/60" : ""
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      {dragHandleProps ? (
        <div
          {...dragHandleProps}
          className="cursor-grab shrink-0 text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-700 transition-colors"
          aria-label={t("model-router.rules.aria-drag-to-reorder")}
        >
          <DotsSixVertical size={24} weight="bold" />
        </div>
      ) : (
        <div className="shrink-0 w-6" />
      )}
      {dragHandleProps && (
        <p className="shrink-0 text-sm font-semibold text-zinc-400 light:text-slate-500 tabular-nums">
          #{rule.priority}
        </p>
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium leading-5 text-white light:text-slate-900 truncate">
            {rule.title}
          </span>
          {rule.type === "llm" ? (
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400 light:bg-fuchsia-100 light:text-fuchsia-700">
              {t("model-router.rules.badge-llm")}
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 light:bg-blue-100 light:text-blue-700">
              {t("model-router.rules.badge-calculated")}
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
          aria-label={t("model-router.rules.aria-edit-rule")}
        >
          <PencilSimple size={16} weight="bold" />
        </button>
        <button
          onClick={onDelete}
          className="border-none text-zinc-400 light:text-slate-500 hover:text-red-400 light:hover:text-red-500 transition-colors"
          aria-label={t("model-router.rules.aria-delete-rule")}
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
      <Trans
        i18nKey="model-router.rules.llm-rule-body"
        values={{
          description: truncate(rule.description, 100),
          route: `${rule.route_provider}/${rule.route_model}`,
        }}
        components={{
          desc: (
            <span className="font-mono text-fuchsia-400 light:text-fuchsia-500" />
          ),
          route: <span className="text-zinc-200 light:text-slate-700" />,
        }}
      />
    </p>
  );
}

function CalculatedRuleBody({ rule }) {
  const { t } = useTranslation();
  const conditions = Array.isArray(rule.conditions) ? rule.conditions : [];
  const route = `${rule.route_provider}/${rule.route_model}`;

  if (conditions.length === 0) {
    return (
      <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
        <Trans
          i18nKey="model-router.rules.calculated-no-conditions"
          values={{ route }}
          components={{
            route: <span className="text-zinc-200 light:text-slate-700" />,
          }}
        />
      </p>
    );
  }

  if (conditions.length === 1) {
    const c = conditions[0];
    return (
      <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
        <Trans
          i18nKey="model-router.rules.calculated-single-condition"
          values={{
            property: c.property,
            comparator: getComparatorLabel(t, c.comparator),
            value: c.value,
            route,
          }}
          components={{
            prop: (
              <span className="font-mono text-blue-400 light:text-blue-500" />
            ),
            val: (
              <span className="font-mono text-blue-400 light:text-blue-500" />
            ),
            route: <span className="text-zinc-200 light:text-slate-700" />,
          }}
        />
      </p>
    );
  }

  const quantifier = rule.condition_logic === "OR" ? "any" : "all";
  const conditionsSummary = conditions
    .map(
      (c) => `${c.property} ${getComparatorLabel(t, c.comparator)} "${c.value}"`
    )
    .join(" AND ");

  return (
    <p className="text-sm font-medium leading-5 text-zinc-400 light:text-slate-500 truncate">
      <Trans
        i18nKey="model-router.rules.calculated-multi-condition"
        values={{
          quantifier: t(`model-router.rules.quantifier-${quantifier}`),
          conditions: truncate(conditionsSummary, 100),
          route,
        }}
        components={{
          cond: (
            <span className="font-mono text-blue-400 light:text-blue-500" />
          ),
          route: <span className="text-zinc-200 light:text-slate-700" />,
        }}
      />
    </p>
  );
}
