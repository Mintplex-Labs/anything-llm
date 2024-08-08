// This helper util is for forcing more mobile styling at a higher breakpoint
// since we relied previously on the isMobile from 'react-device-detect' which works
// fine for mobile but in contexts which the screen is simply smaller or a viewport cannot be determined
// we should simply rely on the window innerWidth as isMobile will not render and the mobile UI does enable
// a better experience for smaller screens.

import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { isMobile as deviceMobile } from "react-device-detect";

const BREAKPOINT = 960;

function calculateIsMobile(breakpoint = BREAKPOINT) {
  if (typeof window === "undefined") return false;
  return deviceMobile || window.innerWidth <= breakpoint;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(calculateIsMobile());

  useEffect(() => {
    const handleResize = debounce(() => {
      const newIsMobile = calculateIsMobile();
      setIsMobile(newIsMobile);
      window.isMobile = newIsMobile;
    }, 800);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export const isMobile = calculateIsMobile();
window.isMobile = isMobile;

export function listenForWindowResize() {
  if (typeof window === "undefined") return;

  const handleResize = debounce(() => {
    window.isMobile = calculateIsMobile();
  }, 800);

  window.addEventListener("resize", handleResize);
}
