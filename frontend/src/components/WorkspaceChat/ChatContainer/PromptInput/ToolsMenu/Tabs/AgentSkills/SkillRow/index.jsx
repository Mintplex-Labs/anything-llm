import Toggle from "@/components/lib/Toggle";

export default function SkillRow({
  name,
  enabled,
  onToggle,
  highlighted = false,
  disabled = false,
  disabledTooltipId = null,
  disabledTooltip = null,
}) {
  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded ${
        highlighted
          ? "bg-zinc-700/50 light:bg-slate-100"
          : "hover:bg-zinc-700/50 light:hover:bg-slate-100"
      }`}
      data-tooltip-id={disabled ? disabledTooltipId : undefined}
      data-tooltip-content={disabledTooltip}
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
