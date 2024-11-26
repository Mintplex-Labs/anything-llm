import { useEffect, useState } from "react";
import CommunityHub from "@/models/communityHub";
import paths from "@/utils/paths";
import HubItemCard from "./HubItemCard";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { readableType, typeToPath } from "../../utils";

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
        <p className="text-base font-semibold text-theme-text-primary">
          Recently Added on AnythingLLM Community Hub
        </p>
        <p className="text-xs text-theme-text-secondary">
          Explore the latest additions to the AnythingLLM Community Hub
        </p>
      </div>
      <HubCategory loading={loading} exploreItems={exploreItems} />
    </div>
  );
}

function HubCategory({ loading, exploreItems }) {
  if (loading) return <HubItemCardSkeleton />;
  return (
    <div className="flex flex-col gap-4">
      {Object.keys(exploreItems).map((type) => {
        const path = typeToPath(type);
        if (exploreItems[type].items.length === 0) return null;
        return (
          <div key={type} className="rounded-lg w-full">
            <div className="flex justify-between items-center">
              <h3 className="text-theme-text-primary capitalize font-medium mb-3">
                {readableType(type)}
              </h3>
              {exploreItems[type].hasMore && (
                <a
                  href={paths.communityHub.viewMoreOfType(path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-button hover:text-primary-button/80 text-sm"
                >
                  Explore More →
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
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

export function HubItemCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg w-full">
        <div className="flex justify-between items-center">
          <Skeleton.default
            height="40px"
            width="300px"
            highlightColor="var(--theme-settings-input-active)"
            baseColor="var(--theme-settings-input-bg)"
            count={1}
          />
        </div>
        <Skeleton.default
          height="200px"
          width="300px"
          highlightColor="var(--theme-settings-input-active)"
          baseColor="var(--theme-settings-input-bg)"
          count={4}
          className="rounded-lg"
          containerClassName="flex flex-wrap gap-2 mt-1"
        />
      </div>
      <div className="rounded-lg w-full">
        <div className="flex justify-between items-center">
          <Skeleton.default
            height="40px"
            width="300px"
            highlightColor="var(--theme-settings-input-active)"
            baseColor="var(--theme-settings-input-bg)"
            count={1}
          />
        </div>
        <Skeleton.default
          height="200px"
          width="300px"
          highlightColor="var(--theme-settings-input-active)"
          baseColor="var(--theme-settings-input-bg)"
          count={4}
          className="rounded-lg"
          containerClassName="flex flex-wrap gap-2 mt-1"
        />
      </div>
    </div>
  );
}
