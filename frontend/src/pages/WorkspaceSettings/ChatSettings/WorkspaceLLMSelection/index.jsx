import React, { useEffect, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import WorkspaceLLMItem from "./WorkspaceLLMItem";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { useTranslation } from "react-i18next";

// 只保留 bedrock
const LLM_BEDROCK = {
  name: "AWS Bedrock",
  value: "bedrock",
  logo: AnythingLLMIcon, // 替換為 bedrock 的圖標（如果有）
  options: () => <React.Fragment />, // 根據需要定義設置表單
  description: "Use AWS Bedrock as the LLM provider for chat.",
  requiredConfig: [
    "BEDROCK_AWS_ACCESS_KEY",
    "BEDROCK_AWS_SECRET_KEY",
    "BEDROCK_AWS_REGION",
  ], // 根據實際需求設置
};

const LLMS = [
  ...AVAILABLE_LLM_PROVIDERS.filter((llm) => llm.value === "bedrock"),
];

export default function WorkspaceLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [selectedLLM, setSelectedLLM] = useState("bedrock"); // 強制默認為 bedrock
  const { t } = useTranslation();

  // 確保始終選擇 bedrock
  useEffect(() => {
    if (workspace?.chatProvider !== "bedrock") {
      setSelectedLLM("bedrock");
      setHasChanges(true);
    }
  }, [workspace, setHasChanges]);

  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM) || LLM_BEDROCK;

  return (
    <div className="border-b border-white/40 pb-8">
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat.llm.title") || "Chat LLM Provider"}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat.llm.description") || "The LLM provider for chat functionality."}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="chatProvider" value={selectedLLM} />
        {/* 直接渲染 bedrock 選項，移除下拉和搜索 */}
        <WorkspaceLLMItem
          llm={selectedLLMObject}
          availableLLMs={LLMS}
          settings={settings}
          checked={true}
          onClick={() => {}} // 禁用點擊，因為只有一個選項
        />
      </div>

      {/* 保留 bedrock 的自由輸入模型名稱功能 */}
      <FreeFormLLMInput workspace={workspace} setHasChanges={setHasChanges} />
    </div>
  );
}

function FreeFormLLMInput({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div className="mt-4 flex flex-col gap-y-1">
      <label className="block input-label">{t("chat.model.title") || "Chat Model"}</label>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        {t("chat.model.description") || "Enter the model name for AWS Bedrock."}
      </p>
      <input
        type="text"
        name="chatModel"
        defaultValue={workspace?.chatModel || ""}
        onChange={() => setHasChanges(true)}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        placeholder="Enter Bedrock model name (e.g., anthropic.claude-v2)"
      />
    </div>
  );
}