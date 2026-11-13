import { Check, Minus } from "@phosphor-icons/react";

/**
 * @param {Object} props
 * @param {"none"|"some"|"all"} [props.state="none"] - Unchecked, mixed, or checked
 * @param {() => void} [props.onToggle] - Makes the box its own tap target; without it the row handles the tap
 * @param {string} [props.label] - Accessible label when the box is interactive
 */
export default function MobileCheckbox({ state = "none", onToggle, label }) {
  const box = (
    <span
      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors duration-150 ${
        state === "none"
          ? "border-2 border-zinc-600 light:border-slate-300"
          : "bg-sky-500 text-white"
      }`}
    >
      {state === "all" && <Check size={12} weight="bold" />}
      {state === "some" && <Minus size={12} weight="bold" />}
    </span>
  );

  if (!onToggle)
    return (
      <span className="w-11 h-11 shrink-0 flex items-center justify-center">
        {box}
      </span>
    );

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state === "some" ? "mixed" : state === "all"}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className="border-none bg-transparent w-11 h-11 shrink-0 flex items-center justify-center"
    >
      {box}
    </button>
  );
}
