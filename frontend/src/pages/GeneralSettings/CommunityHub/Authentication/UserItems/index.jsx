import paths from "@/utils/paths";
import HubItemCard from "../../Trending/HubItems/HubItemCard";
import { useUserItems } from "../useUserItems";
import { HubItemCardSkeleton } from "../../Trending/HubItems";
import { readableType } from "../../utils";

export default function UserItems({ connectionKey }) {
  const { loading, userItems } = useUserItems({ connectionKey });
  const { createdByMe = {}, teamItems = [] } = userItems || {};

  if (loading) return <HubItemCardSkeleton />;
  const hasItems = (items) => {
    return Object.values(items).some((category) => category?.items?.length > 0);
  };

  return (
    <div className="flex flex-col gap-y-8">
      {/* Created By Me Section */}
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
        <div className="flex items-center justify-between">
          <p className="text-lg leading-6 font-bold text-white">
            Created by me
          </p>
          <a
            href={paths.communityHub.noPrivateItems()}
            target="_blank"
            rel="noreferrer"
            className="text-primary-button hover:text-primary-button/80 text-sm"
          >
            Why can't I see my private items?
          </a>
        </div>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
          Items you have created and shared publicly on the AnythingLLM
          Community Hub.
        </p>
        <div className="flex flex-col gap-4 mt-4">
          {Object.keys(createdByMe).map((type) => {
            if (!createdByMe[type]?.items?.length) return null;
            return (
              <div key={type} className="rounded-lg w-full">
                <h3 className="text-white capitalize font-medium mb-3">
                  {readableType(type)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  {createdByMe[type].items.map((item) => (
                    <HubItemCard key={item.id} type={type} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
          {!hasItems(createdByMe) && (
            <p className="text-white/60 text-xs text-center mt-4">
              You haven&apos;t created any items yet.
            </p>
          )}
        </div>
      </div>

      {/* Team Items Section */}
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
        <div className="items-center">
          <p className="text-lg leading-6 font-bold text-white">
            Items by team
          </p>
        </div>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
          Public and private items shared with teams you belong to.
        </p>
        <div className="flex flex-col gap-4 mt-4">
          {teamItems.map((team) => (
            <div key={team.teamId} className="flex flex-col gap-y-4">
              <h3 className="text-white text-sm font-medium">
                {team.teamName}
              </h3>
              {Object.keys(team.items).map((type) => {
                if (!team.items[type]?.items?.length) return null;
                return (
                  <div key={type} className="rounded-lg w-full">
                    <h3 className="text-white capitalize font-medium mb-3">
                      {readableType(type)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                      {team.items[type].items.map((item) => (
                        <HubItemCard key={item.id} type={type} item={item} />
                      ))}
                    </div>
                  </div>
                );
              })}
              {!hasItems(team.items) && (
                <p className="text-white/60 text-xs text-center mt-4">
                  No items shared with this team yet.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
