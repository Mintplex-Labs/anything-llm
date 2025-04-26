import React from "react";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";

import AnythingLLMLogo from "@/media/logo/anything-llm.png";

export default function WelcomePane() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex items-center justify-center bg-white text-[#003A63]">
      <div className="px-6 text-center max-w-xl flex flex-col items-center gap-4">
        <img
          src={AnythingLLMLogo}
          alt="華新麗華 AI 助手"
          className="h-[60px] mb-2"
        />

        <h1 className="text-3xl font-bold text-[#0074A2]">
          歡迎使用華新麗華 AI 助手
        </h1>

        <p className="text-gray-600 leading-relaxed">
          可比對 ASTM / JIS / EN 鋼材標準，協助您快速找到合適鋼種與相關資料。
        </p>

        {/* <button
          onClick={() => navigate(paths.onboarding?.createWorkspace?.() ?? "/")}
          className="mt-6 px-6 py-3 bg-[#0074A2] text-white rounded-lg hover:bg-[#005d84] transition font-semibold"
        >
          開始建立工作區
        </button> */}
      </div>
    </div>
  );
}
