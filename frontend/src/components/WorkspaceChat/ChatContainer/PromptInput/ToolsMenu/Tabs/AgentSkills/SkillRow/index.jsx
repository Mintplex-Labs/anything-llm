import { useRef, useEffect } from "react";
import { SimpleToggleSwitch } from "@/components/lib/Toggle";

export default function SkillRow({
  name,
  enabled,
  onToggle,
  highlighted = false,
  disabled = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  let classNames =
    "border-none bg-transparent w-full flex items-center justify-between px-2 py-1 rounded";
  if (highlighted) classNames += " bg-zinc-700/50 light:bg-slate-100";
  else classNames += " hover:bg-zinc-700/50 light:hover:bg-slate-100";

  if (disabled) classNames += " opacity-60 cursor-not-allowed";
  else classNames += " cursor-pointer";
  return (
    <button
      ref={ref}
      type="button"
      className={classNames}
      onClick={() => !disabled && onToggle()}
      data-tooltip-id={disabled ? "agent-skill-disabled-tooltip" : undefined}
    >
      <span className="text-xs text-white light:text-slate-900">{name}</span>
      <div className="pointer-events-none" aria-hidden="true">
        <SimpleToggleSwitch size="sm" enabled={enabled} />
      </div>
    </button>
  );
}
