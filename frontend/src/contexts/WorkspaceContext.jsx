import React, { createContext, useContext, useState } from "react";

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  const refreshWorkspace = async () => {
    // This function will be implemented to refresh workspace data
    // For now, it's a placeholder to prevent errors
    console.log("Refreshing workspace...");
  };

  const value = {
    workspaces,
    setWorkspaces,
    currentWorkspace,
    setCurrentWorkspace,
    refreshWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
} 