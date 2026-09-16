import { createContext, useContext } from "react";

export const SystemReasoningEffortContext = createContext();

export function useSystemReasoningEffort() {
  return useContext(SystemReasoningEffortContext);
}
