/**
 * Bottom sheet for the mobile document picker. Stays mounted so it can slide
 * out as well as in.
 */
export default function MobileSheet({ open, onClose, title, children }) {
  return (
    <div
      className={`fixed inset-0 z-10 transition-[visibility] ${
        open ? "visible duration-200" : "invisible duration-150"
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          open ? "opacity-100 duration-200" : "opacity-0 duration-150"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute bottom-0 inset-x-0 max-h-[70vh] flex flex-col rounded-t-2xl bg-zinc-900 light:bg-white border-t border-zinc-800 light:border-slate-200 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform ${
          open
            ? "translate-y-0 duration-200 ease-out"
            : "translate-y-full duration-150 ease-in"
        }`}
      >
        {title && (
          <p className="px-5 pt-5 pb-2 text-sm font-semibold text-slate-50 light:text-slate-900 truncate">
            {title}
          </p>
        )}
        <div className="overflow-y-auto px-2 pt-1">{children}</div>
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {boolean} [props.danger] - Red treatment for destructive actions
 */
export function MobileSheetOption({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-none bg-transparent w-full h-12 px-3 flex items-center gap-x-3 rounded-xl text-left text-sm font-medium active:bg-zinc-800 light:active:bg-slate-100 ${
        danger
          ? "text-red-400 light:text-red-600"
          : "text-slate-50 light:text-slate-900"
      }`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}
