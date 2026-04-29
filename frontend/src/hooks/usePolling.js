import { useEffect, useRef } from "react";

/**
 * Polls a callback on an interval, but only while the tab is visible.
 * Automatically pauses when the user switches away and resumes on return.
 *
 * @param {() => void | Promise<void>} callback - The function to invoke on each tick
 * @param {number} intervalMs - Polling interval in milliseconds
 * @param {boolean} [enabled=true] - When false, polling is suspended
 */
export default function usePolling(callback, intervalMs, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !intervalMs) return;

    let timerId = null;

    const start = () => {
      if (timerId) return;
      timerId = setInterval(() => savedCallback.current(), intervalMs);
    };

    const stop = () => {
      if (!timerId) return;
      clearInterval(timerId);
      timerId = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Fire immediately on return so the UI feels fresh, then resume interval
        savedCallback.current();
        start();
      } else {
        stop();
      }
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs, enabled]);
}
