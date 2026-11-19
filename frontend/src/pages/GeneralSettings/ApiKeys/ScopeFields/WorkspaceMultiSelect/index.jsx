import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

/**
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {{id: number, name: string}[]} props.workspaces
 * @param {number[]} props.selected - Selected workspace ids
 * @param {(ids: number[]) => void} props.onChange
 */
export default function WorkspaceMultiSelect({
  visible,
  workspaces,
  selected,
  onChange,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  if (!visible) return null;

  const toggle = (id) => {
    if (selected.includes(id))
      return onChange(selected.filter((i) => i !== id));
    onChange([...selected, id]);
  };

  return (
    <div className="flex flex-col gap-y-1.5 w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border-none flex items-center justify-between w-full h-[34px] px-3.5 text-sm rounded-lg bg-zinc-800 text-zinc-100 light:bg-white light:text-slate-900 light:outline light:outline-1 light:outline-slate-300"
      >
        <span className="truncate">
          <SelectionLabel workspaces={workspaces} selected={selected} />
        </span>
        <CaretDown
          size={14}
          weight="bold"
          className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="flex flex-col max-h-[160px] overflow-y-auto rounded-lg bg-zinc-800 light:bg-white light:outline light:outline-1 light:outline-slate-300 py-1">
          {workspaces.length === 0 && (
            <p className="px-3.5 py-1.5 text-sm text-zinc-400 light:text-slate-600">
              {t("api.modal.workspaces.empty")}
            </p>
          )}
          {workspaces.map((workspace) => (
            <label
              key={workspace.id}
              className="flex items-center gap-x-2 px-3.5 py-1.5 text-sm text-zinc-100 light:text-slate-900 cursor-pointer hover:bg-zinc-700 light:hover:bg-slate-100"
            >
              <input
                type="checkbox"
                checked={selected.includes(workspace.id)}
                onChange={() => toggle(workspace.id)}
              />
              <span className="truncate">{workspace.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectionLabel({ workspaces, selected }) {
  const { t } = useTranslation();
  const names = workspaces
    .filter((workspace) => selected.includes(workspace.id))
    .map((workspace) => workspace.name);
  if (names.length === 0)
    return (
      <span className="text-zinc-400 light:text-slate-400">
        {t("api.modal.workspaces.placeholder")}
      </span>
    );
  return names.join(", ");
}
