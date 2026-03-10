import Toggle from "@/components/lib/Toggle";

export default function SkillRow({
  name,
  enabled,
  onToggle,
  highlighted = false,
  disabled = false,
}) {
  let classNames = "flex items-center justify-between px-2 py-1 rounded";
  if (highlighted) classNames += " bg-zinc-700/50 light:bg-slate-100";
  else classNames += " hover:bg-zinc-700/50 light:hover:bg-slate-100";

  if (disabled) classNames += " opacity-60 cursor-not-allowed";
  else classNames += " cursor-pointer";
  return (
    <div
      className={classNames}
      data-tooltip-id={disabled ? "agent-skill-disabled-tooltip" : undefined}
    >
      <span className="text-xs text-white light:text-slate-900">{name}</span>
      <Toggle
        size="sm"
        enabled={enabled}
        onChange={onToggle}
        disabled={disabled}
      />
    </div>
  );
}
