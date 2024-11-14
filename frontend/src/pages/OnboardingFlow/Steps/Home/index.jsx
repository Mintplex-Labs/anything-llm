import paths from "@/utils/paths";
import LGroupImg from "./l_group.png";
import RGroupImg from "./r_group.png";
import LGroupImgLight from "./l_group-light.png";
import RGroupImgLight from "./r_group-light.png";
import AnythingLLMLogo from "@/media/logo/anything-llm.png";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

const IMG_SRCSET = {
  light: {
    l: LGroupImgLight,
    r: RGroupImgLight,
  },
  default: {
    l: LGroupImg,
    r: RGroupImg,
  },
};

export default function OnboardingHome() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const srcSet = IMG_SRCSET?.[theme] || IMG_SRCSET.default;

  return (
    <>
      <div className="relative w-screen h-screen flex overflow-hidden bg-theme-bg-primary">
        <div
          className="hidden md:block fixed bottom-10 left-10 w-[320px] h-[320px] bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${srcSet.l})` }}
        ></div>

        <div
          className="hidden md:block fixed top-10 right-10 w-[320px] h-[320px] bg-no-repeat bg-contain"
          style={{ backgroundImage: `url(${srcSet.r})` }}
        ></div>

        <div className="relative flex justify-center items-center m-auto">
          <div className="flex flex-col justify-center items-center">
            <p className="text-theme-text-primary font-thin text-[24px]">
              Welcome to
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
              Get started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
