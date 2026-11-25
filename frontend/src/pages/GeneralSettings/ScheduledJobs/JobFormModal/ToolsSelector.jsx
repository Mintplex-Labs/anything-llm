import { useEffect, useMemo, useRef, useState } from "react";
import {
  CaretDown,
  CaretRight,
  Check,
  MagnifyingGlass,
  Minus,
  Warning,
  X,
} from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";

/**
 * Build a flat lookup map from categorized tools for quick label resolution.
 * @param {Array} categories - Categorized tools from backend
 * @returns {Map<string, { name: string, active: boolean, description?: string }>}
 */
function buildToolLookup(categories) {
  const lookup = new Map();
  for (const cat of categories) {
    for (const item of cat.items || []) {
      lookup.set(item.id, item);
    }
  }
  return lookup;
}

function Checkbox({ state, disabled = false }) {
  const filled = state === "checked" || state === "indeterminate";
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center size-4 rounded border shrink-0 transition-colors ${
        disabled
          ? "bg-zinc-700 border-zinc-600 opacity-50"
          : filled
            ? "bg-sky-500 border-sky-700 light:bg-sky-600 light:border-sky-800"
            : "bg-zinc-800 border-zinc-600 light:bg-white light:border-zinc-600"
      }`}
    >
      {state === "checked" && (
        <Check
          size={12}
          weight="bold"
          className="text-white light:text-white"
        />
      )}
      {state === "indeterminate" && (
        <Minus
          size={12}
          weight="bold"
          className="text-white light:text-white"
        />
      )}
    </span>
  );
}

export default function ToolsSelector({
  availableTools,
  selectedTools,
  onChange,
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom");
  const [expandedCategories, setExpandedCategories] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const POPOVER_MAX_HEIGHT = 320;
    const updatePlacement = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setPlacement(
        spaceBelow < POPOVER_MAX_HEIGHT && spaceAbove > spaceBelow
          ? "top"
          : "bottom"
      );
    };
    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [open]);

  const toolLookup = useMemo(
    () => buildToolLookup(availableTools),
    [availableTools]
  );

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return availableTools;
    return availableTools
      .map((cat) => {
        if (cat.name.toLowerCase().includes(q)) return cat;
        const items = (cat.items || []).filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q)
        );
        return items.length ? { ...cat, items } : null;
      })
      .filter(Boolean);
  }, [availableTools, search]);

  const isCategoryExpanded = (catId) =>
    search.trim() || expandedCategories[catId];

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const categoryState = (cat) => {
    const ids = (cat.items || []).map((i) => i.id);
    const count = ids.filter((id) => selectedTools.includes(id)).length;
    if (count === 0) return "unchecked";
    if (count === ids.length) return "checked";
    return "indeterminate";
  };

  const toggleCategorySelection = (cat, e) => {
    e.stopPropagation();
    const ids = (cat.items || []).map((i) => i.id);
    if (categoryState(cat) === "checked") {
      onChange(selectedTools.filter((id) => !ids.includes(id)));
    } else {
      onChange([...new Set([...selectedTools, ...ids])]);
    }
  };

  const toggleTool = (id) => {
    onChange(
      selectedTools.includes(id)
        ? selectedTools.filter((x) => x !== id)
        : [...selectedTools, id]
    );
  };

  const removeTool = (id) => onChange(selectedTools.filter((x) => x !== id));
  const labelFor = (id) => toolLookup.get(id)?.name || id;

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-50 light:text-slate-700">
        {t("scheduledJobs.modal.toolsLabel", "Tools (Optional)")}
      </label>
      <p className="text-xs text-zinc-400 light:text-slate-600 mt-1 mb-3">
        {t(
          "scheduledJobs.modal.toolsDescription",
          "Select which agent tools this job can use. If none are selected, the job runs without any tools."
        )}
      </p>

      <div className="relative" ref={containerRef}>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            placeholder={t("scheduledJobs.modal.toolsSearch", "Search tools")}
            className="border border-transparent light:border-slate-300 bg-zinc-800 light:bg-white text-zinc-300 light:text-slate-700 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg focus:outline-sky-500 outline-none block w-full px-3.5 py-2.5 pr-9"
          />
          <MagnifyingGlass
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 light:text-slate-500 pointer-events-none"
          />
        </div>

        {open && (
          <div
            className={`absolute left-0 right-0 z-20 max-h-80 overflow-y-auto p-1.5 bg-zinc-800 light:bg-white rounded-lg flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.35)] border border-zinc-700 light:border-slate-300 ${
              placement === "top" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {filteredCategories.length === 0 ? (
              <p className="text-xs text-zinc-400 light:text-slate-500 px-2 py-3 text-center">
                {t("scheduledJobs.modal.toolsNoResults", "No tools match")}
              </p>
            ) : (
              filteredCategories.map((cat) => {
                const expanded = isCategoryExpanded(cat.category);
                const state = categoryState(cat);
                const enabledCount = (cat.items || []).filter((i) =>
                  selectedTools.includes(i.id)
                ).length;

                return (
                  <div key={cat.category} className="mb-0.5">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.category)}
                      className="border-none flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm font-medium text-zinc-50 light:text-slate-700 bg-zinc-700/50 light:bg-slate-100 hover:bg-zinc-700 light:hover:bg-slate-200 transition-colors"
                    >
                      {expanded ? (
                        <CaretDown size={12} weight="bold" />
                      ) : (
                        <CaretRight size={12} weight="bold" />
                      )}
                      <span className="flex-1 text-left truncate flex items-center gap-1.5">
                        {cat.name}
                        {cat.requiresSetup && (
                          <a
                            href={paths.settings.agentSkills()}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 light:bg-amber-100 light:text-amber-700 hover:bg-amber-500/30 light:hover:bg-amber-200 transition-colors"
                            title={t(
                              "scheduledJobs.modal.needsSetup",
                              "This skill requires configuration before use"
                            )}
                          >
                            <Warning size={10} weight="fill" />
                            {t(
                              "scheduledJobs.modal.needsSetupLabel",
                              "Needs Setup"
                            )}
                          </a>
                        )}
                      </span>
                      <span className="text-xs text-zinc-400 light:text-slate-500 mr-1">
                        {enabledCount}/{(cat.items || []).length}
                      </span>
                      <span
                        onClick={(e) =>
                          !cat.requiresSetup && toggleCategorySelection(cat, e)
                        }
                        className={
                          cat.requiresSetup
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      >
                        <Checkbox state={state} disabled={cat.requiresSetup} />
                      </span>
                    </button>

                    {expanded && (
                      <div className="ml-2 border-l border-zinc-700 light:border-slate-200 pl-2 mt-0.5">
                        {(cat.items || []).map((item) => {
                          const isSelected = selectedTools.includes(item.id);
                          const itemNeedsSetup =
                            item.requiresSetup || cat.requiresSetup;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                !itemNeedsSetup && toggleTool(item.id)
                              }
                              disabled={itemNeedsSetup}
                              title={item.description || undefined}
                              className={`border-none flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-zinc-300 light:text-slate-600 transition-colors ${
                                itemNeedsSetup
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:bg-zinc-700/60 light:hover:bg-slate-100"
                              }`}
                            >
                              <div className="flex-1 text-left">
                                <span className="flex items-center gap-1.5 truncate">
                                  {item.name}
                                  {item.requiresSetup && !cat.requiresSetup && (
                                    <a
                                      href={paths.settings.agentSkills()}
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 light:bg-amber-100 light:text-amber-700 hover:bg-amber-500/30 light:hover:bg-amber-200 transition-colors"
                                      title={t(
                                        "scheduledJobs.modal.needsSetup",
                                        "This skill requires configuration before use"
                                      )}
                                    >
                                      <Warning size={10} weight="fill" />
                                      {t(
                                        "scheduledJobs.modal.needsSetupLabel",
                                        "Needs Setup"
                                      )}
                                    </a>
                                  )}
                                </span>
                                {item.description && (
                                  <span className="block text-xs text-zinc-500 light:text-slate-400 truncate">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                              <Checkbox
                                state={isSelected ? "checked" : "unchecked"}
                                disabled={itemNeedsSetup}
                              />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedTools.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedTools.map((id) => (
            <div
              key={id}
              className="bg-zinc-800 light:bg-slate-200 flex gap-1.5 h-[26px] items-center justify-center px-3.5 py-0.5 rounded-full text-sm text-zinc-300 light:text-slate-700"
            >
              <span className="whitespace-nowrap">{labelFor(id)}</span>
              <button
                type="button"
                onClick={() => removeTool(id)}
                aria-label={`Remove ${labelFor(id)}`}
                className="border-none text-zinc-400 light:text-slate-500 hover:text-zinc-50 light:hover:text-slate-900 transition-colors"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
