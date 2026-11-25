import { useEffect, useRef, useState } from "react";

/**
 * Drives a count-down progress bar for time-bounded UI prompts (tool-approval
 * card, clarifying-question survey, etc).
 *
 * Returns a `progressPercent` (0–100) that drains from 100 toward 0 as the
 * timeout approaches. When the timeout elapses while still `active`, the
 * `onTimeout` callback fires once.
 *
 * @param {number|null} timeoutMs - Total timeout in milliseconds. Null/0 disables the timer.
 * @param {{ active?: boolean, onTimeout?: () => void, intervalMs?: number }} [options]
 * @param {boolean} [options.active=true] - When false, the timer pauses (e.g. user has already responded).
 * @param {() => void} [options.onTimeout] - Called once when the timer reaches zero while active.
 * @param {number} [options.intervalMs=100] - Tick frequency for progress updates.
 * @returns {number} progressPercent from 100 (full) down to 0 (elapsed).
 */
export default function useTimeoutProgress(
  timeoutMs,
  { active = true, onTimeout, intervalMs = 100 } = {}
) {
  const [progressPercent, setProgressPercent] = useState(100);
  const startTimeRef = useRef(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (!timeoutMs || !active) return;
    if (startTimeRef.current === null) startTimeRef.current = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setProgressPercent((remaining / timeoutMs) * 100);
      if (remaining <= 0) {
        clearInterval(intervalId);
        onTimeoutRef.current?.();
      }
    }, intervalMs);
    return () => clearInterval(intervalId);
  }, [timeoutMs, active, intervalMs]);

  return progressPercent;
}
