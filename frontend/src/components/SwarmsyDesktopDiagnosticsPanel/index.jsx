import { sortDiagnostics } from "@/utils/desktopDiagnostics";

function SeverityIcon({ severity }) {
  if (severity === "error") return <span aria-hidden="true">✕</span>;
  if (severity === "warning") return <span aria-hidden="true">⚠</span>;
  return <span aria-hidden="true">ℹ</span>;
}

function severityBadgeClasses(severity) {
  if (severity === "error") {
    return "border-red-500/30 bg-red-500/10 text-red-200 light:text-red-800";
  }
  if (severity === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200 light:text-amber-800";
  }
  return "border-sky-500/30 bg-sky-500/10 text-sky-200 light:text-sky-800";
}

function severityLabel(severity) {
  if (severity === "error") return "Error";
  if (severity === "warning") return "Warning";
  return "Info";
}

function DiagnosticCard({ diagnostic }) {
  const { severity, title, code, description, action } = diagnostic;
  const badgeClasses = severityBadgeClasses(severity);

  return (
    <li
      className={`rounded-lg border p-4 ${badgeClasses}`}
      data-testid="diagnostic-card"
      data-severity={severity}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 shrink-0 text-base font-bold"
          aria-label={severityLabel(severity)}
        >
          <SeverityIcon severity={severity} />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold leading-5">{title}</p>
          <p className="font-mono text-xs opacity-70">{code}</p>
          <p className="text-sm leading-5">{description}</p>
          <p className="text-xs font-medium leading-5">
            <span className="opacity-70">Suggested action: </span>
            {action}
          </p>
        </div>
      </div>
    </li>
  );
}

/**
 * SwarmsyDesktopDiagnosticsPanel
 *
 * Displays a sorted list of desktop diagnostic entries (errors first,
 * warnings second, info last). Safe to render when the diagnostics array
 * is empty or undefined — renders nothing in that case unless
 * `showWhenEmpty` is true.
 *
 * @param {Object}  props
 * @param {import("@/utils/desktopDiagnostics").DiagnosticEntry[]} [props.diagnostics]
 * @param {boolean} [props.isLoading]       - show loading skeleton
 * @param {boolean} [props.showWhenEmpty]   - render an empty-state row instead of hiding
 * @param {string}  [props.className]
 */
export default function SwarmsyDesktopDiagnosticsPanel({
  diagnostics,
  isLoading = false,
  showWhenEmpty = false,
  className = "",
}) {
  const sorted = sortDiagnostics(diagnostics);
  const hasEntries = sorted.length > 0;

  if (!hasEntries && !isLoading && !showWhenEmpty) return null;

  return (
    <div
      className={`rounded-xl border border-theme-sidebar-border bg-theme-bg-secondary p-4 ${className}`}
      data-testid="desktop-diagnostics-panel"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-theme-text-secondary">
        Desktop Diagnostics
      </p>

      {isLoading && (
        <div
          className="py-4 text-center text-sm text-theme-text-secondary"
          data-testid="diagnostics-loading"
        >
          Checking diagnostics…
        </div>
      )}

      {!isLoading && !hasEntries && (
        <div
          className="py-4 text-center text-sm text-theme-text-secondary"
          data-testid="diagnostics-empty"
        >
          No diagnostics to report.
        </div>
      )}

      {!isLoading && hasEntries && (
        <ul
          className="space-y-3"
          aria-label="Desktop diagnostics"
          data-testid="diagnostics-list"
        >
          {sorted.map((diagnostic, index) => (
            <DiagnosticCard
              key={`${diagnostic.code}-${index}`}
              diagnostic={diagnostic}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
