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
        rootName: prettify(rootId),
        standalone: false,
        subTools: [],
      });
    }
    groups.get(rootId).subTools.push({
      id: tool.id,
      name: prettify(subName),
    });
  }
  return Array.from(groups.values());
}

function prettify(id) {
  return id
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function Checkbox({ state }) {
  const filled = state === "checked" || state === "indeterminate";
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center size-4 rounded border shrink-0 transition-colors ${
        filled ? "bg-sky-500 border-sky-700" : "bg-zinc-800 border-zinc-600"
      }`}
    >
      {state === "checked" && (
        <Check size={12} weight="bold" className="text-white" />
      )}
      {state === "indeterminate" && (
        <Minus size={12} weight="bold" className="text-white" />
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
        if (group.rootName.toLowerCase().includes(q)) return group;
        const subTools = group.subTools.filter((s) =>
          s.name.toLowerCase().includes(q)
        );
        return subTools.length ? { ...group, subTools } : null;
      })
      .filter(Boolean);
  }, [groups, search]);

  const groupState = (group) => {
    const count = group.subTools.filter((s) =>
      selectedTools.includes(s.id)
    ).length;
    if (count === 0) return "unchecked";
    if (count === group.subTools.length) return "checked";
    return "indeterminate";
  };

  const toggleGroup = (group) => {
    const ids = group.subTools.map((s) => s.id);
    if (groupState(group) === "checked") {
      onChange(selectedTools.filter((id) => !ids.includes(id)));
    } else {
      onChange([...new Set([...selectedTools, ...ids])]);
    }
  };

  const toggleSubTool = (id) => {
    onChange(
      selectedTools.includes(id)
        ? selectedTools.filter((x) => x !== id)
        : [...selectedTools, id]
    );
  };

  const removeTool = (id) => onChange(selectedTools.filter((x) => x !== id));

  const labelFor = (id) =>
    availableTools.find((tool) => tool.id === id)?.name || id;

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
              filteredGroups.map((group) => (
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
                    <Checkbox state={groupState(group)} />
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
                            selectedTools.includes(sub.id)
                              ? "checked"
                              : "unchecked"
                          }
                        />
                      </button>
                    ))}
                </div>
              ))
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
              <span className="whitespace-nowrap">{labelFor(id)}</span>
              <button
                type="button"
                onClick={() => removeTool(id)}
                aria-label={`Remove ${labelFor(id)}`}
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
