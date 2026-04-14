import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MagnifyingGlass, Minus, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * Tool IDs from the backend are either a bare identifier (e.g. "rag-memory",
 * "@@mcp_something") or a `root#sub` identifier (e.g.
 * "filesystem-agent#filesystem-read-text-file") where `root` is the parent
 * plugin and `sub` is a sub-tool. We group by `root` to render categories
 * with nested sub-tools.
 */
function groupTools(tools) {
  const groups = new Map();
  for (const tool of tools) {
    const hashIdx = tool.id.indexOf("#");
    if (hashIdx === -1) {
      if (!groups.has(tool.id)) {
        groups.set(tool.id, {
          rootId: tool.id,
          rootName: tool.name,
          standalone: true,
          subTools: [{ id: tool.id, name: tool.name }],
        });
      }
      continue;
    }

    const rootId = tool.id.slice(0, hashIdx);
    const subName = tool.id.slice(hashIdx + 1);
    if (!groups.has(rootId)) {
      groups.set(rootId, {
        rootId,
        rootName: prettifyRoot(rootId),
        standalone: false,
        subTools: [],
      });
    }
    groups.get(rootId).subTools.push({
      id: tool.id,
      name: prettifySubTool(subName),
    });
  }
  return Array.from(groups.values());
}

function prettifyRoot(id) {
  return id
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function prettifySubTool(name) {
  return name
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function Checkbox({ state, onClick }) {
  const checked = state === "checked";
  const indeterminate = state === "indeterminate";
  const filled = checked || indeterminate;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-checked={checked ? "true" : indeterminate ? "mixed" : "false"}
      role="checkbox"
      className={`relative flex items-center justify-center size-4 rounded border transition-colors shrink-0 ${
        filled
          ? "bg-sky-500 border-sky-700"
          : "bg-zinc-800 border-zinc-600 hover:border-zinc-400"
      }`}
    >
      {checked && <Check size={12} weight="bold" className="text-white" />}
      {indeterminate && (
        <Minus size={12} weight="bold" className="text-white" />
      )}
    </button>
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

  const groups = useMemo(() => groupTools(availableTools), [availableTools]);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => {
        const rootMatches = group.rootName.toLowerCase().includes(q);
        if (rootMatches) return group;
        const subTools = group.subTools.filter((s) =>
          s.name.toLowerCase().includes(q)
        );
        return subTools.length ? { ...group, subTools } : null;
      })
      .filter(Boolean);
  }, [groups, search]);

  const selectedSet = useMemo(() => new Set(selectedTools), [selectedTools]);

  const toolLabelById = useMemo(() => {
    const map = new Map();
    for (const tool of availableTools) map.set(tool.id, tool.name);
    return map;
  }, [availableTools]);

  const removeTool = (id) => {
    onChange((prev) => prev.filter((x) => x !== id));
  };

  const groupState = (group) => {
    const total = group.subTools.length;
    const count = group.subTools.reduce(
      (n, s) => n + (selectedSet.has(s.id) ? 1 : 0),
      0
    );
    if (count === 0) return "unchecked";
    if (count === total) return "checked";
    return "indeterminate";
  };

  const toggleGroup = (group) => {
    const state = groupState(group);
    const ids = group.subTools.map((s) => s.id);
    onChange((prev) => {
      const next = new Set(prev);
      if (state === "checked") {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return Array.from(next);
    });
  };

  const toggleSubTool = (id) => {
    onChange((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-50">
        {t("scheduledJobs.modal.toolsLabel", "Tools (Optional)")}
      </label>
      <p className="text-xs text-zinc-400 mt-1 mb-3">
        {t(
          "scheduledJobs.modal.toolsDescription",
          "Select which agent tools this job can use. Leave empty to use all enabled tools."
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
            placeholder={t("scheduledJobs.modal.toolsSearch", "Search")}
            className="border-none bg-zinc-800 text-zinc-300 placeholder:text-zinc-400 text-sm rounded-lg focus:outline-sky-500 outline-none block w-full px-3.5 py-2.5 pr-9"
          />
          <MagnifyingGlass
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-full mt-1 z-20 max-h-64 overflow-y-auto p-1.5 bg-zinc-800 rounded-lg flex flex-col shadow-[0px_4px_12px_0px_rgba(0,0,0,0.35)] border border-zinc-700">
            {filteredGroups.length === 0 ? (
              <p className="text-xs text-zinc-400 px-2 py-3 text-center">
                {t("scheduledJobs.modal.toolsNoResults", "No tools match")}
              </p>
            ) : (
              filteredGroups.map((group) => {
                const state = groupState(group);
                return (
                  <div key={group.rootId}>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group)}
                      className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-zinc-50 hover:bg-zinc-700/60 transition-colors ${
                        !group.standalone ? "bg-zinc-700 font-medium" : ""
                      }`}
                    >
                      <span className="flex-1 text-left truncate">
                        {group.rootName}
                      </span>
                      <Checkbox
                        state={state}
                        onClick={() => toggleGroup(group)}
                      />
                    </button>

                    {!group.standalone &&
                      group.subTools.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => toggleSubTool(sub.id)}
                          className="flex items-center gap-2 w-full pl-5 pr-2 py-1.5 rounded-md text-sm text-zinc-300 hover:bg-zinc-700/60 transition-colors"
                        >
                          <span className="flex-1 text-left truncate">
                            {sub.name}
                          </span>
                          <Checkbox
                            state={
                              selectedSet.has(sub.id) ? "checked" : "unchecked"
                            }
                            onClick={() => toggleSubTool(sub.id)}
                          />
                        </button>
                      ))}
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
              className="bg-zinc-800 flex gap-1.5 h-[26px] items-center justify-center px-3.5 py-0.5 rounded-full text-sm text-zinc-300"
            >
              <span className="whitespace-nowrap">
                {toolLabelById.get(id) || id}
              </span>
              <button
                type="button"
                onClick={() => removeTool(id)}
                aria-label={`Remove ${toolLabelById.get(id) || id}`}
                className="text-zinc-400 hover:text-zinc-50 transition-colors"
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
