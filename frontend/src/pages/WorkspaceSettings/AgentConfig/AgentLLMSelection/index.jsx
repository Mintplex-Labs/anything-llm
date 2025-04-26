import React, { useEffect, useState } from "react";
import BedrockIcon from "@/media/llmprovider/bedrock.png";
import AgentLLMItem from "./AgentLLMItem";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import AgentModelSelection from "../AgentModelSelection";
import { useTranslation } from "react-i18next";

// 只保留 bedrock
const ENABLED_PROVIDERS = ["bedrock"];

// 移除性能警告，因為只有 bedrock
const WARN_PERFORMANCE = [];

// 定義唯一的 LLM 選項：bedrock
const LLM_BEDROCK = {
  name: "AWS Bedrock",
  value: "bedrock",
  logo: BedrockIcon, // 替換為 bedrock 的圖標（如果有）
  options: () => <React.Fragment />, // 根據需要定義設置表單
  description: "Agents will use AWS Bedrock as the LLM provider.",
  requiredConfig: [
    "BEDROCK_AWS_ACCESS_KEY",
    "BEDROCK_AWS_SECRET_KEY",
    "BEDROCK_AWS_REGION",
  ], // 根據實際需求設置
};

const LLMS = [
  ...AVAILABLE_LLM_PROVIDERS.filter((llm) =>
    ENABLED_PROVIDERS.includes(llm.value)
  ),
];

export default function AgentLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [selectedLLM, setSelectedLLM] = useState("bedrock"); // 強制默認為 bedrock
  const { t } = useTranslation();

  // 由於只有一個選項，無需動態更新
  useEffect(() => {
    if (workspace?.agentProvider !== "bedrock") {
      setSelectedLLM("bedrock");
      setHasChanges(true);
    }
  }, [workspace, setHasChanges]);

  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM) || LLM_BEDROCK;

  return (
    <div className="border-b border-white/40 pb-8">
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("agent.provider.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("agent.provider.description")}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="agentProvider" value={selectedLLM} />
        {/* 直接渲染 bedrock 選項，移除下拉和搜索 */}
        <AgentLLMItem
          llm={selectedLLMObject}
          availableLLMs={LLMS}
          settings={settings}
          checked={true}
          onClick={() => {}} // 禁用點擊，因為只有一個選項
        />
      </div>

      <div className="mt-4 flex flex-col gap-y-1">
        <AgentModelSelection
          provider={selectedLLM}
          workspace={workspace}
          setHasChanges={setHasChanges}
        />
      </div>
    </div>
  );
}