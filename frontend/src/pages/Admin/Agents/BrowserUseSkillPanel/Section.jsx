/** A titled block of the panel, with an optional action (like "Clear history") on the right. */
export default function Section({
  title,
  description,
  children,
  action = null,
}) {
  return (
    <div className="flex flex-col gap-y-2 pt-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-theme-text-primary">{title}</p>
        {action}
      </div>
      {description && (
        <p className="text-xs text-theme-text-secondary">{description}</p>
      )}
      {children}
    </div>
  );
}

/** Placeholder for a list with nothing in it yet. */
export function EmptyState({ Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-2 px-4 py-8 rounded-lg bg-theme-bg-primary light:bg-theme-settings-input-bg text-center">
      <Icon size={28} className="text-theme-text-secondary opacity-60" />
      <p className="text-sm text-theme-text-secondary">{text}</p>
    </div>
  );
}
