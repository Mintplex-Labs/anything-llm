import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import LLMSelection from "./Steps/LLMSelection";
import VectorDatabaseConnection from "./Steps/VectorDatabaseConnection";
import AppearanceSetup from "./Steps/AppearanceSetup";
import UserModeSelection from "./Steps/UserModeSelection";
import PasswordProtection from "./Steps/PasswordProtection";
import MultiUserSetup from "./Steps/MultiUserSetup";
import CreateFirstWorkspace from "./Steps/CreateFirstWorkspace";
import EmbeddingSelection from "./Steps/EmbeddingSelection";
import DataHandling from "./Steps/DataHandling";

const DIALOG_ID = "onboarding-modal";

function hideModal() {
  document.getElementById(DIALOG_ID)?.close();
}

const STEPS = {
  llm_preference: {
    title: "LLM Preference",
    description:
      "These are the credentials and settings for your preferred LLM chat & embedding provider.",
    component: LLMSelection,
  },
  vector_database: {
    title: "Vector Database",
    description:
      "These are the credentials and settings for how your AnythingLLM instance will function.",
    component: VectorDatabaseConnection,
  },
  appearance: {
    title: "Appearance",
    description:
      "Customize the appearance of your AnythingLLM instance.\nFind more customization options on the appearance settings page.",
    component: AppearanceSetup,
  },
  user_mode_setup: {
    title: "User Mode Setup",
    description: "Choose how many people will be using your instance.",
    component: UserModeSelection,
  },
  password_protection: {
    title: "Password Protect",
    description:
      "Protect your instance with a password. It is important to save this password as it cannot be recovered.",
    component: PasswordProtection,
  },
  multi_user_mode: {
    title: "Multi-User Mode",
    description:
      "Setup your instance to support your team by activating multi-user mode.",
    component: MultiUserSetup,
  },
  data_handling: {
    title: "Data Handling",
    description:
      "We are committed to transparency and control when it comes to your personal data.",
    component: DataHandling,
  },
  create_workspace: {
    title: "Create Workspace",
    description: "To get started, create a new workspace.",
    component: CreateFirstWorkspace,
  },
  embedding_preferences: {
    title: "Embedding Preference",
    description: "Choose a provider for embedding files and text.",
    component: EmbeddingSelection,
  },
};

export const OnboardingModalId = DIALOG_ID;
export default function OnboardingModal() {
  const [currentStep, setCurrentStep] = useState("llm_preference");
  const [history, setHistory] = useState(["llm_preference"]);

  const nextStep = (stepKey) => {
    setCurrentStep(stepKey);
    setHistory([...history, stepKey]);
  };

  const prevStep = () => {
    const currentStepIdx = history.indexOf(currentStep);
    if (currentStepIdx === -1 || currentStepIdx === 0) {
      setCurrentStep("llm_preference");
      setHistory(["llm_preference"]);
      return hideModal();
    }

    const prevStep = history[currentStepIdx - 1];
    const _history = [...history].slice(0, currentStepIdx);
    setCurrentStep(prevStep);
    setHistory(_history);
  };

  const { component: StepComponent, ...step } = STEPS[currentStep];
  return (
    <dialog id={DIALOG_ID} className="bg-transparent outline-none">
      <div className="relative max-h-full">
        <div className="relative bg-main-gradient rounded-2xl shadow border-2 border-slate-300/10">
          <div className="flex items-start justify-between p-8 border-b rounded-t border-gray-500/50">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-sm font-base text-white text-opacity-60 whitespace-pre">
                {step.description || ""}
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
            <StepComponent
              currentStep={currentStep}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}
