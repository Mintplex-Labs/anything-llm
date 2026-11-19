import { useEffect, useState } from "react";

const DEFAULT_DELAY_MS = 300;

/**
 * Returns true once `active` has stayed true for `delayMs`, and false again
 * as soon as `active` turns false. Use it to show a loader only for slow work.
 * @param {boolean} active
 * @param {number} [delayMs=300]
 * @returns {boolean}
 */
export default function useDelayedFlag(active, delayMs = DEFAULT_DELAY_MS) {
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    if (!active) {
      setElapsed(false);
      return;
    }
    const timer = setTimeout(() => setElapsed(true), delayMs);
    return () => clearTimeout(timer);
  }, [active, delayMs]);
  return active && elapsed;
}
