import Toggle from "@/components/lib/Toggle";

export default function SkillRow({ name, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-zinc-700/50 light:hover:bg-slate-100">
      <span className="text-xs text-white light:text-slate-900">{name}</span>
      <Toggle size="sm" enabled={enabled} onChange={onToggle} />
    </div>
  );
}
