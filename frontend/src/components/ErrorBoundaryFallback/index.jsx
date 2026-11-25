import { NavLink } from "react-router-dom";
import { House, ArrowClockwise, Copy, Check } from "@phosphor-icons/react";
import { useState } from "react";

export default function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  const [copied, setCopied] = useState(false);

  const copyErrorDetails = async () => {
    const details = {
      url: window.location.href,
      error: error?.name || "Unknown Error",
      message: error?.message || "No message available",
      stack: error?.stack || "No stack trace available",
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    const formattedDetails = `
Error Report
============
Timestamp: ${details.timestamp}
URL: ${details.url}
User Agent: ${details.userAgent}

Error: ${details.error}
Message: ${details.message}

Stack Trace:
${details.stack}
    `.trim();

    try {
      await navigator.clipboard.writeText(formattedDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error details:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-theme-bg-primary text-theme-text-primary gap-4 p-4 md:p-8 w-full">
      <h1 className="text-xl md:text-2xl font-bold text-center">
        An error occurred.
      </h1>
      <p className="text-theme-text-secondary text-center px-4">
        {error?.message}
      </p>
      {import.meta.env.DEV && (
        <div className="w-full max-w-4xl">
          <div className="flex justify-end mb-2">
            <button
              onClick={copyErrorDetails}
              className="flex items-center gap-2 px-3 py-1.5 bg-theme-bg-secondary text-theme-text-primary rounded hover:bg-theme-sidebar-item-hover transition-all duration-200 text-xs font-medium"
              title="Copy error details"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" weight="bold" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Details
                </>
              )}
            </button>
          </div>
          <pre className="w-full text-xs md:text-sm text-theme-text-secondary bg-theme-bg-secondary p-4 md:p-6 rounded-lg overflow-x-auto overflow-y-auto max-h-[60vh] md:max-h-[70vh] whitespace-pre-wrap break-words font-mono border border-theme-border shadow-sm">
            {error?.stack}
          </pre>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-4 w-full md:w-auto">
        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-theme-bg-secondary text-theme-text-primary rounded-lg hover:bg-theme-sidebar-item-hover transition-all duration-300 w-full md:w-auto"
        >
          <ArrowClockwise className="w-4 h-4" />
          Reset
        </button>
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-theme-bg-secondary text-theme-text-primary rounded-lg hover:bg-theme-sidebar-item-hover transition-all duration-300 w-full md:w-auto"
        >
          <House className="w-4 h-4" />
          Home
        </NavLink>
      </div>
    </div>
  );
}
