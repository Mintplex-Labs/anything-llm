import paths from "@/utils/paths";
import AnythingLLMLogo from "@/media/logo/anything-llm.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OnboardingHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
      <div className="relative flex justify-center items-center m-auto z-10">
        <div className="flex flex-col justify-center items-center z-10">
          <p className="text-theme-text-primary font-thin text-[24px]">
            {t("onboarding.home.title")}
          </p>
          <img
            src={AnythingLLMLogo}
            alt="AnythingLLM"
            className="md:h-[50px] flex-shrink-0 max-w-[300px] light:invert"
          />
          <button
            onClick={() => navigate(paths.onboarding.llmPreference())}
            className="border-[2px] border-theme-text-primary animate-pulse light:animate-none w-full md:max-w-[350px] md:min-w-[300px] text-center py-3 bg-theme-button-primary hover:bg-theme-bg-secondary text-theme-text-primary font-semibold text-sm my-10 rounded-md "
          >
            {t("onboarding.home.getStarted")}
          </button>
        </div>
      </div>
  );
}
