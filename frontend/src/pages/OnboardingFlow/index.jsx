import React from "react";
import OnboardingModal, { OnboardingModalId } from "./OnboardingModal";
import useLogo from "../../hooks/useLogo";

export default function OnboardingFlow() {
  const { logo } = useLogo();

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex items-center justify-center">
      <div className="w-fit p-20 py-24 border-2 border-slate-300/10 rounded-2xl bg-main-gradient shadow-lg">
        <div className="text-white text-2xl font-base text-center">
          Welcome to
        </div>
        <img src={logo} alt="logo" className="w-80 mx-auto m-3 mb-11" />
        <div className="flex justify-center items-center">
          <button
            className="bg-white text-neutral-800 text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-300 hover:invert animate-pulse"
            onClick={() =>
              document?.getElementById(OnboardingModalId)?.showModal()
            }
          >
            Get Started
          </button>
        </div>
      </div>
      <OnboardingModal />
    </div>
  );
}
