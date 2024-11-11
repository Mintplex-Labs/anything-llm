import { useState, useEffect } from "react";
import CommunityHub from "@/models/communityHub";

const DEFAULT_USER_ITEMS = {
  createdByMe: {
    agentSkills: { items: [] },
    systemPrompts: { items: [] },
    slashCommands: { items: [] },
  },
  teamItems: [],
};

export function useUserItems({ connectionKey }) {
  const [loading, setLoading] = useState(true);
  const [userItems, setUserItems] = useState(DEFAULT_USER_ITEMS);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching user items", connectionKey);
      if (!connectionKey) return;
      setLoading(true);
      try {
        const { success, createdByMe, teamItems } =
          await CommunityHub.fetchUserItems();
        if (success) {
          setUserItems({ createdByMe, teamItems });
        }
      } catch (error) {
        console.error("Error fetching user items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [connectionKey]);

  return { loading, userItems };
}
