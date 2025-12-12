import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { isMobile } from "react-device-detect";
import Home from "./Home";
import LLMPreference from "./LLMPreference";
import UserSetup from "./UserSetup";
import DataHandling from "./DataHandling";
import Survey from "./Survey";
import CreateWorkspace from "./CreateWorkspace";

import RippleImg from "./ripple.webm";
import BgImg from "./flowbg.mp4";
import { useTheme } from "@/hooks/useTheme";

const OnboardingSteps = {
  home: Home,
  "llm-preference": LLMPreference,
  "user-setup": UserSetup,
  "data-handling": DataHandling,
  survey: Survey,
  "create-workspace": CreateWorkspace,
};

export default OnboardingSteps;

export function OnboardingLayout({ children }) {
  const [header, setHeader] = useState({
    title: "",
    description: "",
  });
  const [backBtn, setBackBtn] = useState({
    showing: false,
    disabled: true,
    onClick: () => null,
  });
  const [forwardBtn, setForwardBtn] = useState({
    showing: false,
    disabled: true,
    onClick: () => null,
  });

  if (isMobile) {
    return (
      <div
        data-layout="onboarding"
        className="w-screen h-screen overflow-y-auto bg-theme-bg-primary overflow-hidden"
      >
        <div className="flex flex-col">
          <div className="w-full relative py-10 px-2">
            <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
              <h1 className="text-theme-text-primary font-semibold text-center text-2xl">
                {header.title}
              </h1>
              <p className="text-theme-text-secondary text-base text-center">
                {header.description}
              </p>
            </div>
            {children(setHeader, setBackBtn, setForwardBtn)}
          </div>
          <div className="flex w-full justify-center gap-x-4 pb-20">
            <div className="flex justify-center items-center">
              {backBtn.showing && (
                <button
                  disabled={backBtn.disabled}
                  onClick={backBtn.onClick}
                  className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent"
                >
                  <ArrowLeft
                    className="text-white group-hover:text-black group-disabled:text-gray-500"
                    size={30}
                  />
                </button>
              )}
            </div>

            <div className="flex justify-center items-center">
              {forwardBtn.showing && (
                <button
                  disabled={forwardBtn.disabled}
                  onClick={forwardBtn.onClick}
                  className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-teal disabled:hover:bg-transparent"
                >
                  <ArrowRight
                    className="text-white group-hover:text-teal group-disabled:text-gray-500"
                    size={30}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackgroundLayers />
      <div
        data-layout="onboarding"
        className="w-screen overflow-y-auto flex justify-center overflow-hidden"
      >
        <div className="flex w-1/5 h-screen justify-center items-center z-10">
          {backBtn.showing && (
            <button
              disabled={backBtn.disabled}
              onClick={backBtn.onClick}
              className="group p-2 rounded-lg border-2 border-theme-sidebar-border h-fit w-fit disabled:cursor-not-allowed hover:bg-theme-bg-secondary disabled:hover:bg-transparent"
              aria-label="Back"
            >
              <ArrowLeft
                className="text-theme-text-secondary group-hover:text-theme-text-primary group-disabled:text-gray-500"
                size={30}
              />
            </button>
          )}
        </div>

        <div className="w-full md:w-3/5 relative h-screen flex flex-col justify-center items-center z-10">
          <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
            <h1 className="text-theme-text-primary font-semibold text-center text-2xl">
              {header.title}
            </h1>
            <p className="text-theme-text-secondary text-base text-center">
              {header.description}
            </p>
          </div>
          {children(setHeader, setBackBtn, setForwardBtn)}
        </div>

        <div className="flex w-1/5 h-screen justify-center items-center z-10">
          {forwardBtn.showing && (
            <button
              disabled={forwardBtn.disabled}
              onClick={forwardBtn.onClick}
              className="group p-2 rounded-lg border-2 border-theme-sidebar-border h-fit w-fit disabled:cursor-not-allowed hover:bg-teal disabled:hover:bg-transparent"
              aria-label="Continue"
            >
              <ArrowRight
                className="text-theme-text-secondary group-hover:text-white group-disabled:text-gray-500"
                size={30}
              />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const IMG_SRCSET = {
  default: {
    ripple: RippleImg,
    bg: BgImg,
  },
};

function BackgroundLayers() {
  /** @type {React.RefObject<HTMLVideoElement>} */
  const backgroundVideoRef = useRef(null);
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const { theme } = useTheme();
  const srcSet = IMG_SRCSET?.[theme] || IMG_SRCSET.default;

  useEffect(() => {
    const bgVideo = backgroundVideoRef.current;
    if (!bgVideo) return;

    const handleLoadedMetadata = () => {
      bgVideo.playbackRate = 0.50;
      bgVideo.play();
    };

    if (bgVideo.readyState >= 1) handleLoadedMetadata();
    else bgVideo.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => bgVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setHasMouseMoved(true);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex overflow-hidden pointer-events-none">
      <video ref={backgroundVideoRef} autoPlay={false} loop={true} muted={true} className="fixed top-0 left-0 w-full h-full object-cover -z-2">
        <source src={srcSet.bg} type="video/mp4" />
      </video>
      <Ripple animate={hasMouseMoved} />
    </div>
  );
}

function Ripple({ animate = false }) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <svg 
        className="w-full h-full"
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="blur-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>

        <style jsx>{`
          .ripple-base {
            cx: 50;
            cy: 50;
            fill: none;
            stroke: rgba(255, 255, 255, 0.5); 
            stroke-width: 3;
            opacity: 0;
            transform-origin: center;
            filter: url(#blur-filter);
          }

          .ripple {
            animation: ripple-soft 3s linear forwards;
          }

          .soft-ripple {
            animation: light-ripple-soft 3s linear forwards;
          }

          @keyframes light-ripple-soft {
            0% {
              r: 0;
              opacity: 0.25;
              stroke-width: 1;
            }
            100% {
              r: 35;
              opacity: 0;
              stroke-width: 0.5;
            }
          }

          @keyframes ripple-soft {
            0% {
              r: 0;
              opacity: 0.6;
              stroke-width: 2;
            }
            100% {
              r: 35;
              opacity: 0;
              stroke-width: 0.5;
            }
          }

          .delay-1 { animation-delay: 0s; }
          .delay-2 { animation-delay: 400ms; }
          .delay-3 { animation-delay: 900ms; }
        `}</style>
        <circle className={`ripple-base delay-1 ${animate ? 'ripple' : ''}`} />
        <circle className={`ripple-base delay-2 ${animate ? 'ripple' : ''}`} />
        <circle className={`ripple-base delay-3 ${animate ? 'soft-ripple' : ''}`} />
      </svg>
    </div>
  );
}