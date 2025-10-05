import { useState, useEffect } from "react";
import Workspace from "@/models/workspace";
import useUser from "@/hooks/useUser";

export default function useWorkspaceAccess() {
  const [hasAccess, setHasAccess] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function checkWorkspaceAccess() {
      try {
        setLoading(true);
        const userWorkspaces = await Workspace.all();
        setWorkspaces(userWorkspaces);
        setHasAccess(userWorkspaces.length > 0);
      } catch (error) {
        console.error("Error checking workspace access:", error);
        setHasAccess(false);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    }

    checkWorkspaceAccess();
  }, [user]);

  return {
    hasAccess,
    workspaces,
    loading,
  };
}
