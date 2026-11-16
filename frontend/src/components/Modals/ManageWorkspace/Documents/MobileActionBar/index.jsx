/**
 * Action bar docked to the bottom of its `relative` parent. Stays mounted so
 * it can slide out as well as in.
 *
 * @param {Object} props
 * @param {import("react").ReactNode} props.label - Status line above the actions
 */
export default function MobileActionBar({ show, label, children }) {
  return (
    <div
      className={`absolute bottom-0 inset-x-0 z-[5] flex flex-col gap-y-3 px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] bg-zinc-900 light:bg-white border-t border-zinc-800 light:border-slate-200 transition-[transform,visibility] ${
        show
          ? "translate-y-0 visible duration-200 ease-out"
          : "translate-y-full invisible duration-150 ease-in"
      }`}
    >
      <p className="text-sm font-medium text-slate-50 light:text-slate-900">
        {label}
      </p>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {"primary"|"danger"} [props.variant="primary"]
 */
export function MobileActionButton({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const colors =
    variant === "danger"
      ? "bg-red-500 light:bg-red-600 text-white"
      : "bg-zinc-50 light:bg-slate-900 text-zinc-950 light:text-white";
  return (
    <button
      type="button"
      {...props}
      className={`border-none flex-1 h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-center transition-transform duration-100 active:scale-[0.97] disabled:opacity-50 ${colors} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * @param {Object} props
 * @param {string} props.label - Accessible label
 */
export function MobileActionIconButton({ label, danger, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      className={`border-none w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-zinc-800 light:bg-slate-100 transition-transform duration-100 active:scale-[0.97] disabled:opacity-50 ${
        danger
          ? "text-red-400 light:text-red-600"
          : "text-slate-50 light:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}
