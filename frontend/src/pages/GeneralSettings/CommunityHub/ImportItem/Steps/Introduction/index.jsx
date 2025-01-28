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
      <div className="bg-theme-bg-secondary rounded-xl flex-1 p-6 custom-theme-bg-secondary">
        <div className="w-full flex flex-col gap-y-2 max-w-[700px]">
          <h2 className="text-base text-theme-text-primary font-semibold custom-text-secondary">
            Import an item from the community hub
          </h2>
          <div className="flex flex-col gap-y-[25px] text-theme-text-secondary text-sm custom-text-secondary">
            <p>
              The community hub is a place where you can find, share, and import
              agent-skills, system prompts, slash commands, and more!
            </p>
            <p>
              These items are created by the {process.env.APPLICATION_FALLBACK_NAME} team and community, and
              are a great way to get started with {process.env.APPLICATION_FALLBACK_NAME} as well as extend
              {process.env.APPLICATION_FALLBACK_NAME} in a way that is customized to your needs.
            </p>
            <p>
              There are both <b>private</b> and <b>public</b> items in the
              community hub. Private items are only visible to you, while public
              items are visible to everyone.
            </p>

            <p className="p-4 light:text-orange-500 light:border-orange-500 rounded-lg border border-yellow-500 text-yellow-500">
              If you are pulling in a private item, make sure it is{" "}
              <b>shared with a team</b> you belong to, and you have added a{" "}
              <a
                href={paths.communityHub.authentication()}
                className="underline text-yellow-100 light:text-orange-500 font-semibold custom-text-secondary"
              >
                Connection Key.
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-y-2 mt-4">
            <div className="w-full flex flex-col gap-y-4">
              <div className="flex flex-col w-full">
                <label className="text-theme-text-primary text-sm font-semibold block mb-3 custom-text-secondary">
                  Community Hub Item Import ID
                </label>
                <input
                  type="text"
                  value={itemId}
                  onChange={(e) => setItemId(e.target.value)}
                  placeholder="allm-community-id:agent-skill:1234567890"
                  className="border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
                />
              </div>
            </div>
          </div>
          <CTAButton
            className="text-dark-text w-full mt-[18px] h-[34px] custom-theme-bg-quad custom-theme-color-quad"
            onClick={handleContinue}
          >
            Continue with import &rarr;
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
