import React, { createContext, useContext, useMemo } from "react";

const AvailableVariablesContext = createContext([]);

export function AvailableVariablesProvider({ blocks, children }) {
  const variables = useMemo(() => {
    const startBlock = blocks.find((b) => b.type === "start");
    return startBlock?.config?.variables?.filter((v) => v.name) || [];
  }, [blocks]);

  return (
    <AvailableVariablesContext.Provider value={variables}>
      {children}
    </AvailableVariablesContext.Provider>
  );
}

export function useAvailableVariables() {
  return useContext(AvailableVariablesContext);
}
