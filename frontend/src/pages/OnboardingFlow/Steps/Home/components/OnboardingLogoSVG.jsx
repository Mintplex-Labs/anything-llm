import { useTheme } from "@/hooks/useTheme";

export function OnboardingLogoSVG() {
  const { isLight } = useTheme();
  return (
    <svg
      viewBox="0 0 818 514"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
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
