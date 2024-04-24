import React from "react";
import OnboardingSteps, { OnboardingLayout } from "./Steps";
import { useParams } from "react-router-dom";

export default function OnboardingFlow() {
  const { step } = useParams();
  const StepPage = OnboardingSteps[step || "home"];
  if (step === "home" || !step) return <StepPage />;

  return (
    <OnboardingLayout>
      {(setHeader, setBackBtn, setForwardBtn) => (
        <StepPage
          setHeader={setHeader}
          setBackBtn={setBackBtn}
          setForwardBtn={setForwardBtn}
        />
      )}
    </OnboardingLayout>
  );
}
