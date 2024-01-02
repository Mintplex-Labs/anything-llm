import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { lazy, useState } from "react";
const OnboardingSteps = {
  home: lazy(() => import("./Home")),
  "llm-preference": lazy(() => import("./LLMPreference")),
  survey: lazy(() => import("./Survey")),
  "custom-logo": lazy(() => import("./CustomLogo")),
  "user-setup": lazy(() => import("./UserSetup")),
  "data-handling": lazy(() => import("./DataHandling")),
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

  return (
    <div className="w-screen h-screen bg-[#2C2F35] md:bg-main-gradient flex items-center justify-center overflow-hidden">
      <div className="flex w-1/5 h-screen justify-center items-center">
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

      <div className="w-full md:w-3/5 relative h-full py-10">
        <div className="flex flex-col w-fit mx-auto gap-y-1 mb-[55px]">
          <h1 className="text-white font-semibold text-center text-2xl">
            {header.title}
          </h1>
          <p className="text-zinc-400 text-base text-center">
            {header.description}
          </p>
        </div>
        {children(setHeader, setBackBtn, setForwardBtn)}
      </div>

      <div className="flex w-1/5 h-screen justify-center items-center">
        {forwardBtn.showing && (
          <button
            disabled={forwardBtn.disabled}
            onClick={forwardBtn.onClick}
            className="group p-2 rounded-lg border-2 border-zinc-300 disabled:border-zinc-600 h-fit w-fit disabled:not-allowed hover:bg-zinc-100 disabled:hover:bg-transparent"
          >
            <ArrowRight
              className="text-white group-hover:text-black group-disabled:text-gray-500"
              size={30}
            />
          </button>
        )}
      </div>
    </div>
  );
}
