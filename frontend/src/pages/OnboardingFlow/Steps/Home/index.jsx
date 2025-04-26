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
    <div className="relative w-screen h-screen flex overflow-hidden bg-white text-[#003A63]">


      {/* 中央內容 */}
      <div className="relative flex justify-center items-center m-auto px-6 text-center">
        <div className="flex flex-col items-center gap-4 max-w-xl">
          <img
            src={AnythingLLMLogo}

            alt="華新麗華 AI 助手"

            className="h-[60px] mb-2"
          />

          <h1 className="text-3xl font-bold text-[#0074A2]">
            歡迎使用華新麗華 AI 助手
          </h1>
          <p className="text-gray-600">
            可比對 ASTM / JIS / EN
            鋼材標準，協助您快速找到合適鋼種與相關資料。
          </p>

      
        </div>
      </div>
    </div>
  );
}
