import { HandWaving } from "@phosphor-icons/react";

export default function WelcomeBanner() {
    return (
        <div className="max-w-[680px] w-full h-[60px] bg-[#142227] rounded-lg mb-6 flex items-center p-[10px]">
            <div className="bg-[#2D7593] h-10 w-10 rounded-lg flex items-center justify-center">
                <HandWaving size={24} weight="fill" className="text-white" />
            </div>
            <div className="flex flex-col ml-[21px]">
                <h1 className="text-white font-medium">Welcome to AnythingLLM</h1>
                <p className="text-[#B6B7B7] text-xs">Let's get you started with some quick steps.</p>
            </div>
        </div>
    )
}