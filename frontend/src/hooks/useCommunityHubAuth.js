import { useState, useEffect } from "react";
import CommunityHub from "@/models/communityHub";

export function useCommunityHubAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      setLoading(true);
      try {
        const { connectionKey } = await CommunityHub.getSettings();
        setIsAuthenticated(!!connectionKey);
      } catch (error) {
        console.error("Error checking hub auth:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return { isAuthenticated, loading };
}
