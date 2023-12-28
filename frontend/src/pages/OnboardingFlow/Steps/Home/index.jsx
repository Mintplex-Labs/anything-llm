import paths from "@/utils/paths";
import LGroupImg from "./l_group.png";
import RGroupImg from "./r_group.png";
import AnythingLLMLogo from "@/media/logo/anything-llm.png";

export default function OnboardingHome() {
  return (
    <div className="w-screen h-screen bg-[#2C2F35] md:bg-main-gradient flex items-center justify-center overflow-hidden">
      <div className="hidden md:block relative w-1/5 h-screen">
        <img src={LGroupImg} className="absolute bottom-[6%] px-[9%] w-full" />
      </div>
      <div className="w-full md:w-3/5 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="text-zinc-300 font-thin text-[24px]">Welcome to</p>
          <img src={AnythingLLMLogo} alt="AnythingLLM" className="h-[50px]" />
          <a
            href={paths.onboarding.llmPreference()}
            className="w-full md:min-w-[300px] text-center py-3 bg-white text-black font-semibold text-sm my-10 rounded-md hover:bg-gray-200"
          >
            Get started
          </a>
        </div>
      </div>
      <div className="hidden md:block relative w-1/5 h-screen relative p-4">
        <img src={RGroupImg} className="absolute top-[6%] px-[9%] w-full" />
      </div>
    </div>
  );
}
