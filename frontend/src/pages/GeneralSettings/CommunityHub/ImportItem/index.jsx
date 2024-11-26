import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import CommunityHubImportItemSteps, {
  CommunityHubImportItemLayout,
} from "./Steps";

function SideBarSelection({ setStep, currentStep }) {
  const currentIndex = Object.keys(CommunityHubImportItemSteps).indexOf(
    currentStep
  );
  return (
    <div
      className={`bg-white/5 light:bg-white text-theme-text-primary rounded-xl py-1 px-4 shadow-lg ${
        isMobile ? "w-full" : "min-w-[360px] w-fit"
      }`}
    >
      {Object.entries(CommunityHubImportItemSteps).map(
        ([stepKey, props], index) => {
          const isSelected = currentStep === stepKey;
          const isLast =
            index === Object.keys(CommunityHubImportItemSteps).length - 1;
          const isDone =
            currentIndex ===
              Object.keys(CommunityHubImportItemSteps).length - 1 ||
            index < currentIndex;
          return (
            <div
              key={stepKey}
              className={[
                "py-3 flex items-center justify-between transition-all duration-300",
                isSelected ? "rounded-t-xl" : "",
                isLast
                  ? ""
                  : "border-b border-white/10 light:border-[#026AA2]/10",
              ].join(" ")}
            >
              {isDone || isSelected ? (
                <button
                  onClick={() => setStep(stepKey)}
                  className="border-none hover:underline text-sm font-medium text-theme-text-primary"
                >
                  {props.name}
                </button>
              ) : (
                <div className="text-sm text-theme-text-secondary font-medium">
                  {props.name}
                </div>
              )}
              <div className="flex items-center gap-x-2">
                {isDone ? (
                  <div className="w-[14px] h-[14px] rounded-full border border-[#32D583] flex items-center justify-center">
                    <div className="w-[5.6px] h-[5.6px] rounded-full bg-[#6CE9A6]"></div>
                  </div>
                ) : (
                  <div
                    className={`w-[14px] h-[14px] rounded-full border border-theme-text-primary ${
                      isSelected ? "animate-pulse" : "opacity-50"
                    }`}
                  />
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default function CommunityHubImportItemFlow() {
  const [step, setStep] = useState("itemId");

  const StepPage = CommunityHubImportItemSteps.hasOwnProperty(step)
    ? CommunityHubImportItemSteps[step]
    : CommunityHubImportItemSteps.itemId;

  return (
    <CommunityHubImportItemLayout setStep={setStep}>
      {(settings, setSettings, setStep) => (
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white light:border-theme-sidebar-border border-b-2 border-opacity-10">
            <div className="items-center">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                Import a Community Item
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary">
              Import items from the AnythingLLM Community Hub to enhance your
              instance with community-created prompts, skills, and commands.
            </p>
          </div>
          <div className="flex-1 flex h-full">
            <div className="flex flex-col gap-y-[18px] mt-10 w-[360px] flex-shrink-0">
              <SideBarSelection setStep={setStep} currentStep={step} />
            </div>
            <div className="overflow-y-auto pb-[200px] h-screen no-scroll">
              <div className="ml-8">
                {StepPage.component({ settings, setSettings, setStep })}
              </div>
            </div>
          </div>
        </div>
      )}
    </CommunityHubImportItemLayout>
  );
}
