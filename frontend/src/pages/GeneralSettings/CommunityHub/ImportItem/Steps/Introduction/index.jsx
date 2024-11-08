import CommunityHubImportItemSteps from "..";
import CTAButton from "@/components/lib/CTAButton";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useState } from "react";

export default function Introduction({ settings, setSettings, setStep }) {
  const [itemId, setItemId] = useState(settings.itemId);
  const handleContinue = () => {
    if (!itemId) return showToast("Please enter an item ID", "error");
    setSettings((prev) => ({ ...prev, itemId }));
    setStep(CommunityHubImportItemSteps.itemId.next());
  };

  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-[#303237] text-white rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-2 max-w-[700px]">
          <h2 className="text-base text-white font-semibold">
            Import an item from the community hub
          </h2>
          <div className="flex flex-col gap-y-[25px] text-white/80 text-sm">
            <p>
              The community hub is a place where you can find, share, and import
              agent-skills, system prompts, slash commands, and more!
            </p>
            <p>
              These items are created by the AnythingLLM team and community, and
              are a great way to get started with AnythingLLM as well as extend
              AnythingLLM in a way that is customized to your needs.
            </p>
            <p>
              There are both <b>private</b> and <b>public</b> items in the
              community hub. Private items are only visible to you, while public
              items are visible to everyone.
            </p>

            <p className="p-4 bg-yellow-800/30 rounded-lg border border-yellow-500 text-yellow-500">
              If you are pulling in a private item, make sure it is{" "}
              <b>shared with a team</b> you belong to, and you have added a{" "}
              <a
                href={paths.communityHub.authentication()}
                className="underline text-yellow-100"
              >
                Connection Key.
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-y-2 text-white/80 text-sm mt-4">
            <div className="w-full flex flex-col gap-y-4">
              <div className="flex flex-col w-full">
                <label className="text-white text-sm font-semibold block mb-3">
                  Community Hub Item Import ID
                </label>
                <input
                  type="text"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder="allm-community-id:agent-skill:1234567890"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-[#46C8FF] active:outline-[#46C8FF] outline-none block w-full p-2.5"
                />
              </div>
            </div>
          </div>
          <CTAButton
            className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            onClick={handleContinue}
          >
            Continue with import &rarr;
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
