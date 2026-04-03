import { formatDateTimeAsMoment } from "@/utils/directories";
import { numberWithCommas } from "@/utils/numbers";
import React, { useEffect, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import RoutingDetailsModal from "./RoutingDetailsModal";
const MetricsContext = React.createContext();
const SHOW_METRICS_KEY = "anythingllm_show_chat_metrics";
const SHOW_METRICS_EVENT = "anythingllm_show_metrics_change";

/**
 * @param {number} duration - duration in milliseconds
 * @returns {string}
 */
function formatDuration(duration) {
  try {
    return duration < 1
      ? `${(duration * 1000).toFixed(0)}ms`
      : `${duration.toFixed(3)}s`;
  } catch {
    return "";
  }
}

/**
 * Format the output TPS to a string
 * @param {number} outputTps - output TPS
 * @returns {string}
 */
function formatTps(outputTps) {
  try {
    return outputTps < 1000
      ? outputTps.toFixed(2)
      : numberWithCommas(outputTps.toFixed(0));
  } catch {
    return "";
  }
}

/**
 * Get the show metrics setting from localStorage `anythingllm_show_chat_metrics` key
 * @returns {boolean}
 */
function getAutoShowMetrics() {
  return window?.localStorage?.getItem(SHOW_METRICS_KEY) === "true";
}

/**
 * Build the metrics string for a given metrics object
 * - Model name (optional, omitted when routing info is shown separately)
 * - Duration and output TPS
 * - Timestamp
 * @param {Object} metrics - { duration, outputTps, model, timestamp }
 * @param {boolean} [includeModel=true] - Whether to include the model name
 * @returns {string}
 */
function buildMetricsString(metrics = {}, includeModel = true) {
  return [
    includeModel && metrics?.model ? metrics.model : "",
    `${formatDuration(metrics.duration)} (${formatTps(metrics.outputTps)} tok/s)`,
    metrics?.timestamp
      ? formatDateTimeAsMoment(metrics.timestamp, "MMM D, h:mm A")
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

/**
 * Toggle the show metrics setting in localStorage `anythingllm_show_chat_metrics` key
 * @returns {void}
 */
function toggleAutoShowMetrics() {
  const currentValue = getAutoShowMetrics() || false;
  window?.localStorage?.setItem(SHOW_METRICS_KEY, !currentValue);
  window.dispatchEvent(
    new CustomEvent(SHOW_METRICS_EVENT, {
      detail: { showMetricsAutomatically: !currentValue },
    })
  );
  return !currentValue;
}

/**
 * Provider for the metrics context that controls the visibility of the metrics
 * per-chat based on the user's preference.
 * @param {React.ReactNode} children
 * @returns {React.ReactNode}
 */
export function MetricsProvider({ children }) {
  const [showMetricsAutomatically, setShowMetricsAutomatically] =
    useState(getAutoShowMetrics());

  useEffect(() => {
    function handleShowingMetricsEvent(e) {
      if (!e?.detail?.hasOwnProperty("showMetricsAutomatically")) return;
      setShowMetricsAutomatically(e.detail.showMetricsAutomatically);
    }
    console.log("Adding event listener for metrics visibility");
    window.addEventListener(SHOW_METRICS_EVENT, handleShowingMetricsEvent);
    return () =>
      window.removeEventListener(SHOW_METRICS_EVENT, handleShowingMetricsEvent);
  }, []);

  return (
    <MetricsContext.Provider
      value={{ showMetricsAutomatically, setShowMetricsAutomatically }}
    >
      {children}
    </MetricsContext.Provider>
  );
}

/**
 * Render the metrics for a given chat, if available
 * @param {Object} props
 * @param {Object} props.metrics - { duration, outputTps, model, timestamp }
 * @param {Object|null} [props.routedTo] - { provider, model, ruleTitle, ruleType, isFallback, routerName }
 */
export default function RenderMetrics({ metrics = {}, routedTo = null }) {
  // Inherit the showMetricsAutomatically state from the MetricsProvider so the state is shared across all chats
  const { showMetricsAutomatically, setShowMetricsAutomatically } =
    useContext(MetricsContext);
  const [showRoutingModal, setShowRoutingModal] = useState(false);
  if (!metrics?.duration || !metrics?.outputTps || isMobile) return null;

  const hasRouting = !!routedTo;
  const metricsString = buildMetricsString(metrics, !hasRouting);

  return (
    <>
      <div
        className={`border-none flex md:justify-end items-center gap-x-[8px] -ml-7 ${showMetricsAutomatically ? "opacity-100" : "opacity-0"} md:group-hover:opacity-100 transition-all duration-300`}
      >
        <p className="cursor-pointer text-xs font-mono text-zinc-400 light:text-slate-500">
          {hasRouting && (
            <span
              role="button"
              tabIndex={0}
              data-tooltip-id="routing-details"
              data-tooltip-content="View routing details"
              onClick={() => setShowRoutingModal(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setShowRoutingModal(true);
              }}
              className="hover:underline"
            >
              {routedTo.routerName || "Model Router"}
              {" → "}
              {metrics?.model || routedTo.model}
            </span>
          )}
          {hasRouting && " · "}
          <span
            role="button"
            tabIndex={0}
            data-tooltip-id="metrics-visibility"
            data-tooltip-content={
              showMetricsAutomatically
                ? "Click to only show metrics when hovering"
                : "Click to show metrics as soon as they are available"
            }
            onClick={() => setShowMetricsAutomatically(toggleAutoShowMetrics())}
          >
            {metricsString}
          </span>
        </p>
      </div>
      {showRoutingModal && (
        <RoutingDetailsModal
          routedTo={routedTo}
          metrics={metrics}
          onClose={() => setShowRoutingModal(false)}
        />
      )}
    </>
  );
}
