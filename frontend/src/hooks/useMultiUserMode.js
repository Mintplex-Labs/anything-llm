import { createContext, useContext } from "react";

// Provided by the route wrappers in components/PrivateRoute, which resolve
// multi user mode before rendering the page.
export const MultiUserModeContext = createContext(false);

export default function useMultiUserMode() {
  return useContext(MultiUserModeContext);
}
