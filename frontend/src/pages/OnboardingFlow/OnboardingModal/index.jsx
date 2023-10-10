import React, { useState } from "react";
import { X } from "react-feather";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import StepThree from "./Steps/StepThree";
import StepFour from "./Steps/StepFour";
import StepFive from "./Steps/StepFive";
import StepSix from "./Steps/StepSix";

const DIALOG_ID = "onboarding-modal";

function hideModal() {
  document.getElementById(DIALOG_ID)?.close();
}

export const OnboardingModalId = DIALOG_ID;

export default function OnboardingModal() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = {
    1: {
      title: "LLM Preference",
      description:
        "These are the credentials and settings for your preferred LLM chat & embedding provider.",
      component: <StepOne />,
      allowSkip: false,
    },
    2: {
      title: "Vector Database",
      description:
        "These are the credentials and settings for how your AnythingLLM instance will function.",
      component: <StepTwo />,
      allowSkip: false,
    },
    3: {
      title: "Appearance",
      description: "Customize the appearance of your AnythingLLM instance.",
      component: <StepThree />,
      allowSkip: true,
    },
    4: {
      title: "User Mode Setup",
      description: "Choose how many people will be using your instance.",
      component: <StepFour />,
      allowSkip: true,
    },
    5: {
      title: "Password Protect",
      description:
        "Protect your instance with a password. It is important to save this password as it cannot be recovered.",
      component: <StepFive />,
      allowSkip: true,
    },
    6: {
      title: "Create New Workspace",
      description: "To get started, create a new workspace.",
      component: <StepSix />,
      allowSkip: true,
    },
  };

  const totalSteps = 6;

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 1) return hideModal();
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <dialog id={DIALOG_ID} className="bg-transparent outline-none">
      <div className="relative max-h-full">
        <div className="relative bg-main-gradient rounded-2xl shadow border-2 border-slate-300/10">
          <div className="flex items-start justify-between p-8 border-b rounded-t border-gray-500/50">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-white">
                {steps[currentStep].title}
              </h3>
              <p className="text-sm font-base text-white text-opacity-60">
                {steps[currentStep].description || ""}
              </p>
            </div>

            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="space-y-6 flex h-full w-full justify-center">
            {steps[currentStep].component}
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            {currentStep && (
              <button
                onClick={prevStep}
                type="button"
                className="px-4 py-2 rounded-lg text-white hover:bg-sidebar transition-all duration-300"
              >
                Back
              </button>
            )}
            {currentStep < totalSteps && (
              <button
                onClick={nextStep}
                type="button"
                className="transition-all duration-200 border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
              >
                Continue
              </button>
            )}
            {currentStep === totalSteps && (
              <button
                onClick={hideModal}
                type="button"
                className="transition-all duration-200 border border-slate-200 px-4 py-2 rounded-lg text-slate-800 bg-slate-200 text-sm items-center flex gap-x-2 hover:text-white hover:bg-transparent focus:ring-gray-800 font-semibold shadow"
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
