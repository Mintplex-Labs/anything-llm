import { useEffect, useState } from "react";
import CommunityHub from "@/models/communityHub";
import paths from "@/utils/paths";
import HubItemCard from "./HubItemCard";

function readableType(type) {
  switch (type) {
    case "agentSkills":
    case "agentSkill":
      return "Agent Skills";
    case "systemPrompt":
    case "systemPrompts":
      return "System Prompts";
    case "slashCommand":
    case "slashCommands":
      return "Slash Commands";
  }
}

function typeToPath(type) {
  switch (type) {
    case "agentSkill":
    case "agentSkills":
      return "agent-skills";
    case "systemPrompt":
    case "systemPrompts":
      return "system-prompts";
    case "slashCommand":
    case "slashCommands":
      return "slash-commands";
  }
}

const DEFAULT_EXPLORE_ITEMS = {
  agentSkills: { items: [], hasMore: false, totalCount: 0 },
  systemPrompts: { items: [], hasMore: false, totalCount: 0 },
  slashCommands: { items: [], hasMore: false, totalCount: 0 },
};

function useCommunityHubExploreItems() {
  const [loading, setLoading] = useState(true);
  const [exploreItems, setExploreItems] = useState(DEFAULT_EXPLORE_ITEMS);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { success, result } = await CommunityHub.fetchExploreItems();
        if (success) setExploreItems(result || DEFAULT_EXPLORE_ITEMS);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { loading, exploreItems };
}

export default function HubItems() {
  const { loading, exploreItems } = useCommunityHubExploreItems();
  return (
    <div className="w-full flex flex-col gap-y-1 pb-6 pt-6">
      <div className="flex flex-col gap-y-2 mb-4">
        <p className="text-base font-semibold text-white">
          Recently Added on AnythingLLM Community Hub
        </p>
        <p className="text-xs text-white/60">
          Explore the latest additions to the AnythingLLM Community Hub or
          import an item via its import link directly.
        </p>
      </div>
      <HubCategory exploreItems={exploreItems} />
    </div>
  );
}

function HubCategory({ exploreItems }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.keys(exploreItems).map((type) => {
        const path = typeToPath(type);
        if (exploreItems[type].items.length === 0) return null;
        return (
          <div key={type} className="bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white capitalize font-medium mb-3">
                {readableType(type)}
              </h3>
              {exploreItems[type].hasMore && (
                <a
                  href={paths.communityHub.viewMoreOfType(path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-button hover:text-primary-button/80 text-xs"
                >
                  Explore More →
                </a>
              )}
            </div>
            <div className="space-y-2">
              {exploreItems[type].items.map((item) => (
                <HubItemCard key={item.id} type={type} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
