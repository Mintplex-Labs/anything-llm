import React, { useState } from "react";
import { X } from "react-feather";
import LLMSelection from "./Steps/LLMSelection";
import VectorDatabaseConnection from "./Steps/VectorDatabaseConnection";
import AppearanceSetup from "./Steps/AppearanceSetup";
import UserModeSelection from "./Steps/UserModeSelection";
import PasswordProtection from "./Steps/PasswordProtection";
import MultiUserSetup from "./Steps/MultiUserSetup";
import CreateFirstWorkspace from "./Steps/CreateFirstWorkspace";

const DIALOG_ID = "onboarding-modal";

function hideModal() {
  document.getElementById(DIALOG_ID)?.close();
}

export const OnboardingModalId = DIALOG_ID;
export default function OnboardingModal() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 1) return hideModal();
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  const steps = {
    1: {
      title: "LLM Preference",
      description:
        "These are the credentials and settings for your preferred LLM chat & embedding provider.",
      component: (
        <LLMSelection
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
        />
      ),
    },
    2: {
      title: "Vector Database",
      description:
        "These are the credentials and settings for how your AnythingLLM instance will function.",
      component: (
        <VectorDatabaseConnection
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
        />
      ),
    },
    3: {
      title: "Appearance",
      description: "Customize the appearance of your AnythingLLM instance.",
      component: (
        <AppearanceSetup
          nextStep={nextStep}
          prevStep={prevStep}
          currentStep={currentStep}
        />
      ),
    },
    4: {
      title: "User Mode Setup",
      description: "Choose how many people will be using your instance.",
      component: <UserModeSelection goToStep={goToStep} prevStep={prevStep} />,
    },
    5: {
      title: "Password Protect",
      description:
        "Protect your instance with a password. It is important to save this password as it cannot be recovered.",
      component: <PasswordProtection prevStep={prevStep} goToStep={goToStep} />,
    },
    6: {
      title: "Multi-User Mode",
      description:
        "Setup your instance to support your team by activating multi-user mode.",
      component: (
        <MultiUserSetup prevStep={() => goToStep(4)} nextStep={nextStep} />
      ),
    },
    7: {
      title: "Create Workspace",
      description: "To get started, create a new workspace.",
      component: <CreateFirstWorkspace />,
    },
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
              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="space-y-6 flex h-full w-full justify-center">
            {steps[currentStep].component}
          </div>
        </div>
      </div>
    </dialog>
  );
}
