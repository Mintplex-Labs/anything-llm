import CommunityHubImportItemSteps from "..";
import CTAButton from "@/components/lib/CTAButton";

export default function Completed({ settings, setSettings, setStep }) {
  return (
    <div className="flex-[2] flex flex-col gap-y-[18px] mt-10">
      <div className="bg-theme-bg-secondary rounded-xl flex-1 p-6">
        <div className="w-full flex flex-col gap-y-2 max-w-[700px]">
          <h2 className="text-base text-theme-text-primary font-semibold">
            Community Hub Item Imported
          </h2>
          <div className="flex flex-col gap-y-[25px] text-theme-text-secondary text-sm">
            <p>
              The "{settings.item.name}" {settings.item.itemType} has been
              imported successfully! It is now available in your AnythingLLM
              instance.
            </p>
            <p>
              Any changes you make to this {settings.item.itemType} will not be
              reflected in the community hub. You can now modify as needed.
            </p>
          </div>
          <CTAButton
            className="text-dark-text w-full mt-[18px] h-[34px] hover:bg-accent"
            onClick={() => {
              setSettings({ item: null, itemId: null });
              setStep(CommunityHubImportItemSteps.itemId.key);
            }}
          >
            Import another item
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
