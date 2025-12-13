import { numberWithCommas } from "@/utils/numbers";
import React, { useEffect, useState, useContext } from "react";
import moment from "moment";
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
 * Format a unix timestamp to a readable string
 * @param {number} timestamp - unix timestamp in seconds
 * @returns {string}
 */
function formatTimestamp(timestamp) {
  try {
    if (!timestamp) return "";
    return moment.unix(timestamp).format("MMM D, h:mm A");
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
 * @param {Object} props.metrics - metrics object with duration, outputTps, and model
 * @param {number} props.sentAt - unix timestamp in seconds
 * @returns
 */
export default function RenderMetrics({ metrics = {}, sentAt = null }) {
  // Inherit the showMetricsAutomatically state from the MetricsProvider so the state is shared across all chats
  const { showMetricsAutomatically, setShowMetricsAutomatically } =
    useContext(MetricsContext);

  // Show component if we have either metrics or timestamp
  const hasMetrics = metrics?.duration && metrics?.outputTps;
  const hasTimestamp = sentAt;
  const hasModel = metrics?.model;

  if (!hasMetrics && !hasTimestamp && !hasModel) return null;

  return (
    <button
      type="button"
      onClick={() => setShowMetricsAutomatically(toggleAutoShowMetrics())}
      data-tooltip-id="metrics-visibility"
      data-tooltip-content={
        showMetricsAutomatically
          ? "Click to only show metrics when hovering"
          : "Click to show metrics as soon as they are available"
      }
      className={`border-none flex justify-end items-center gap-x-[8px] ${showMetricsAutomatically ? "opacity-100" : "opacity-0"} md:group-hover:opacity-100 transition-all duration-300`}
    >
      <p className="cursor-pointer text-xs font-mono text-theme-text-secondary opacity-50">
        {hasModel && <span>{metrics.model}</span>}
        {hasModel && (hasMetrics || hasTimestamp) && <span> · </span>}
        {hasMetrics && (
          <span>
            {formatDuration(metrics.duration)} ({formatTps(metrics.outputTps)} tok/s)
          </span>
        )}
        {hasMetrics && hasTimestamp && <span> · </span>}
        {hasTimestamp && <span>{formatTimestamp(sentAt)}</span>}
      </p>
    </button>
  );
}
