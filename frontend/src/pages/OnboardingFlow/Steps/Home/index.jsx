import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OnboardingHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative w-screen h-screen flex overflow-hidden bg-gradient-to-b from-hemp-warm via-hemp-neutral to-white">
      <div className="relative flex justify-center items-center m-auto z-10">
        <div className="flex flex-col justify-center items-center text-center px-5">
          <h2 className="font-light text-xl mb-2 tracking-wide text-hemp-earth">
            Welcome to
          </h2>
          <h1 className="text-6xl md:text-7xl font-bold mb-10 tracking-tight text-hemp-primary leading-none">
            HempGPT
          </h1>
          <button
            onClick={() => navigate(paths.onboarding.llmPreference())}
            className="btn-hemp px-8 py-4 text-lg font-semibold tracking-wide transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
