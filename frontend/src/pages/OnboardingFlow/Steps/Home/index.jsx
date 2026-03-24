import paths from "@/utils/paths";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import useRedirectToHomeOnOnboardingComplete from "@/hooks/useOnboardingComplete";

function OnboardingLogoSVG({ isLight }) {
  return (
    <svg
      viewBox="0 0 818 514"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-[818px]"
    >
      <g filter="url(#filter0_i_onboarding)">
        <path
          d="M817.643 77.9966V435.862C817.643 478.86 782.656 513.847 739.646 513.847H598.7C575.046 513.847 552.952 503.3 538.072 484.907L478.122 410.756C470.908 401.84 470.837 389.328 477.943 380.329L499.609 352.901C504.264 347.009 511.228 343.628 518.739 343.628C526.251 343.628 533.143 346.973 537.798 352.818L595.593 425.47C598.391 428.969 602.557 430.981 607.033 430.981H715.243C726.004 430.981 734.766 422.22 734.766 411.458V102.4C734.766 91.627 726.004 82.8773 715.243 82.8773H606.938C602.462 82.8773 598.295 84.8773 595.498 88.3771L279.643 484.479C264.75 503.145 242.525 513.847 218.657 513.847H77.9847C34.9866 513.847 0 478.86 0 435.862V77.9966C0 34.9866 34.9866 0 77.9847 0H219.681C243.716 0 266.036 10.8329 280.928 29.7249L338.426 103.115C345.437 112.019 345.425 124.435 338.39 133.328L316.57 160.898C311.927 166.767 304.963 170.147 297.463 170.147C289.964 170.147 283.059 166.802 278.405 160.957L220.764 88.3771C217.979 84.8773 213.812 82.8773 209.336 82.8773H102.388C91.627 82.8773 82.8654 91.627 82.8654 102.4V411.458C82.8654 422.22 91.627 430.981 102.388 430.981H209.289C213.765 430.981 217.931 428.969 220.717 425.482L536.727 29.3559C551.607 10.7019 573.832 0 597.7 0H739.646C782.656 0 817.643 34.9866 817.643 77.9966Z"
          fill="url(#paint0_linear_onboarding)"
          fillOpacity={isLight ? 0.5 : 0.28}
        />
      </g>
      <defs>
        <filter
          id="filter0_i_onboarding"
          x="0"
          y="0"
          width="817.643"
          height="525.847"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="12" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        </filter>
        <linearGradient
          id="paint0_linear_onboarding"
          x1="15.9568"
          y1="-4.97115"
          x2="720.527"
          y2="514.346"
          gradientUnits="userSpaceOnUse"
        >
          {isLight ? (
            <>
              <stop stopColor="#B0BAC5" />
              <stop offset="0.538462" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="1" stopColor="#A8B0BE" />
            </>
          ) : (
            <>
              <stop stopColor="#3C5769" />
              <stop
                offset="0.538462"
                stopColor="#9FA5C2"
                stopOpacity="0.253846"
              />
              <stop offset="1" stopColor="#40435E" />
            </>
          )}
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function OnboardingHome() {
  const navigate = useNavigate();
  useRedirectToHomeOnOnboardingComplete();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const isLight =
    theme === "light" ||
    (theme === "system" &&
      window.matchMedia?.("(prefers-color-scheme: light)").matches);

  return (
    <div className="relative w-screen h-screen flex flex-col overflow-hidden bg-zinc-950 light:bg-white">
      {/* Dark mode background gradient */}
      <div
        className="absolute inset-0 light:hidden"
        style={{
          background:
            "radial-gradient(ellipse 160% 100% at 50% 0%, rgba(130, 152, 178, 0.45) 0%, rgba(60, 87, 105, 0.25) 45%, transparent 90%)",
        }}
      />

      <div className="relative z-10 flex justify-center pt-8">
        <p className="text-white/80 light:text-zinc-800 text-sm italic font-light tracking-[0.15em]">
          AnythingLLM
        </p>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-8">
        <div className="absolute flex items-center justify-center w-full px-4 md:px-0 md:w-[65%] lg:w-[55%]">
          <OnboardingLogoSVG isLight={isLight} />
        </div>

        <h1 className="relative font-medium text-white light:text-zinc-800 text-[64px] md:text-[96px] lg:text-[100px]  leading-none select-none">
          Welcome
        </h1>

        <button
          onClick={() => navigate(paths.onboarding.llmPreference())}
          className="relative mt-8 px-16 py-3 rounded-full text-sm font-medium transition-colors border border-white/20 text-white bg-transparent hover:bg-white/10 light:border-transparent light:bg-zinc-900 light:text-white light:hover:bg-zinc-800"
        >
          {t("onboarding.home.getStarted")}
        </button>
      </div>
    </div>
  );
}
