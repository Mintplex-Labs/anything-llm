import React, { useState } from "react";
import FineTuningSteps, { FineTuningCreationLayout } from "./Steps";
import { CheckCircle, Circle, Sparkle } from "@phosphor-icons/react";
import { isMobile } from "react-device-detect";

function SideBarSelection({ setStep, currentStep }) {
  const currentIndex = Object.keys(FineTuningSteps).indexOf(currentStep);
  return (
    <div
      className={`bg-white/5 text-white rounded-xl ${
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
              "py-3 px-4 flex items-center justify-between transition-all duration-300",
              isSelected ? "rounded-t-xl" : "",
              isLast ? "" : "border-b border-white/10",
            ].join(" ")}
          >
            {isDone ? (
              <button
                onClick={() => setStep(stepKey)}
                className="border-none hover:underline text-white/40 text-sm font-light"
              >
                {props.name}
              </button>
            ) : (
              <div className="text-sm font-light">{props.name}</div>
            )}
            <div className="flex items-center gap-x-2">
              {isDone ? (
                <CheckCircle className={`text-green-300`} />
              ) : (
                <Circle
                  className={`text-white-800 ${
                    isSelected ? "animate-pulse" : "opacity-10"
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
