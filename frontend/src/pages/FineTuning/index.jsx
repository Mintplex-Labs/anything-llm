import React, { useState } from "react";
import FineTuningSteps, { FineTuningCreationLayout } from "./Steps";
import { Sparkle } from "@phosphor-icons/react";
import { isMobile } from "react-device-detect";

function SideBarSelection({ setStep, currentStep }) {
  const currentIndex = Object.keys(FineTuningSteps).indexOf(currentStep);
  return (
    <div
      className={`bg-white/5 text-white rounded-xl py-1 px-4 ${
        isMobile ? "w-full" : "min-w-[360px] w-fit"
      }`}
    >
      {Object.entries(FineTuningSteps).map(([stepKey, props], index) => {
        const isSelected = currentStep === stepKey;
        const isLast = index === Object.keys(FineTuningSteps).length - 1;
        const isDone =
          currentIndex === Object.keys(FineTuningSteps).length - 1 ||
          index < currentIndex;
        return (
          <div
            key={stepKey}
            className={[
              "py-3 flex items-center justify-between transition-all duration-300",
              isSelected ? "rounded-t-xl" : "",
              isLast ? "" : "border-b border-white/10",
            ].join(" ")}
          >
            {isDone || isSelected ? (
              <button
                onClick={() => setStep(stepKey)}
                className="border-none hover:underline text-sm font-medium"
              >
                {props.name}
              </button>
            ) : (
              <div className="text-sm text-white/40 font-medium">
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
                  className={`w-[14px] h-[14px] rounded-full border border-white ${
                    isSelected ? "animate-pulse" : "opacity-50"
                  }`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function FineTuningFlow() {
  const [step, setStep] = useState("intro");
  const StepPage = FineTuningSteps.hasOwnProperty(step)
    ? FineTuningSteps[step]
    : FineTuningSteps.intro;

  return (
    <FineTuningCreationLayout setStep={setStep}>
      {(settings, setSettings, setStep) => (
        <div className="flex-1 flex gap-x-6 p-4 mt-10">
          <div className="flex flex-col gap-y-[18px]">
            <div className="text-white flex items-center gap-x-2">
              <Sparkle size={24} />
              <p className="text-lg font-medium">Custom Fine-Tuned Model</p>
            </div>
            <SideBarSelection setStep={setStep} currentStep={step} />
          </div>
          {StepPage.component({ settings, setSettings, setStep })}
        </div>
      )}
    </FineTuningCreationLayout>
  );
}
