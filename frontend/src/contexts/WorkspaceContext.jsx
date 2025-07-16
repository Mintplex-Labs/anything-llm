import React, { createContext, useContext, useState } from "react";
import Workspace from "@/models/workspace";

const WorkspaceContext = createContext();

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshWorkspace = async () => {
    if (!currentWorkspace) return;
    
    setLoading(true);
    try {
      const { workspace } = await Workspace.bySlug(currentWorkspace.slug);
      if (workspace) {
        setCurrentWorkspace(workspace);
      }
    } catch (error) {
      console.error("Failed to refresh workspace:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
  };

  const value = {
    currentWorkspace,
    loading,
    refreshWorkspace,
    updateWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceContext; 