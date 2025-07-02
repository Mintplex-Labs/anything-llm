import { useState, useEffect } from "react";
import CommunityHub from "@/models/communityHub";

/**
 * Hook to check if the user is authenticated with the community hub by checking
 * the user defined connection key in the settings.
 * @returns {{isAuthenticated: boolean, loading: boolean}} An object containing the authentication status and loading state.
 */
export function useCommunityHubAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkCommunityHubAuth() {
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
    checkCommunityHubAuth();
  }, []);

  return { isAuthenticated, loading };
}
