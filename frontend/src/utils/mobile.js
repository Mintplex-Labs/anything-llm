// This helper util is for forcing more mobile styling at a higher breakpoint
// since we relied previously on the isMobile from 'react-device-detect' which works
// fine for mobile but in contexts which the screen is simply smaller or a viewport cannot be determined
// we should simply rely on the window innerWidth as isMobile will not render and the mobile UI does enable
// a better experience for smaller screens.
import debounce from "lodash.debounce";
import { isMobile as deviceMobile } from "react-device-detect";

export var isMobile = calculateIsMobile();
function calculateIsMobile(breakpoint = 960) {
  const _isMobile = deviceMobile || window.innerWidth <= breakpoint;
  if (window.hasOwnProperty("isMobile") && window.isMobile !== _isMobile)
    return window.location.reload();
  isMobile = _isMobile;
  window.isMobile = _isMobile;
  return _isMobile;
}

const debounceResize = debounce(() => calculateIsMobile(), 800);
export function listenForWindowResize() {
  if (!window) return;
  window.removeEventListener("resize", debounceResize);
  window.addEventListener("resize", debounceResize);
}
