import React, { useMemo } from "react";
import {
  X,
  CaretUp,
  CaretDown,
  Globe,
  Browser,
  Brain,
  Flag,
  Info,
  BracketsCurly,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import Toggle from "@/components/lib/Toggle";
import StartNode from "../nodes/StartNode";
import ApiCallNode from "../nodes/ApiCallNode";
import WebsiteNode from "../nodes/WebsiteNode";
import FileNode from "../nodes/FileNode";
import CodeNode from "../nodes/CodeNode";
import LLMInstructionNode from "../nodes/LLMInstructionNode";
import FinishNode from "../nodes/FinishNode";
import WebScrapingNode from "../nodes/WebScrapingNode";
import FlowInfoNode from "../nodes/FlowInfoNode";

const BLOCK_TYPES = {
  FLOW_INFO: "flowInfo",
  START: "start",
  API_CALL: "apiCall",
  // WEBSITE: "website", // Temporarily disabled
  // FILE: "file", // Temporarily disabled
  // CODE: "code", // Temporarily disabled
  LLM_INSTRUCTION: "llmInstruction",
  WEB_SCRAPING: "webScraping",
  FINISH: "finish",
};

/**
 * Static block metadata (icons + default configs).
 * Labels/descriptions/summaries are resolved via getBlockInfo(t).
 */
const BLOCK_STATIC = {
  [BLOCK_TYPES.FLOW_INFO]: {
    icon: <Info className="w-5 h-5 text-theme-text-primary" />,
    defaultConfig: {
      name: "",
      description: "",
    },
  },
  [BLOCK_TYPES.START]: {
    icon: <BracketsCurly className="w-5 h-5 text-theme-text-primary" />,
  },
  [BLOCK_TYPES.API_CALL]: {
    icon: <Globe className="w-5 h-5 text-theme-text-primary" />,
    defaultConfig: {
      url: "",
      method: "GET",
      headers: [],
      bodyType: "json",
      body: "",
      formData: [],
      responseVariable: "",
      directOutput: false,
      streamChunks: false,
    },
  },
  [BLOCK_TYPES.LLM_INSTRUCTION]: {
    icon: <Brain className="w-5 h-5 text-theme-text-primary" />,
    defaultConfig: {
      instruction: "",
      resultVariable: "",
      directOutput: false,
    },
  },
  [BLOCK_TYPES.WEB_SCRAPING]: {
    icon: <Browser className="w-5 h-5 text-theme-text-primary" />,
    defaultConfig: {
      url: "",
      captureAs: "text",
      querySelector: "",
      resultVariable: "",
      directOutput: false,
    },
  },
  [BLOCK_TYPES.FINISH]: {
    icon: <Flag className="w-4 h-4" />,
    defaultConfig: {},
    renderConfig: () => null,
  },
};

/**
 * Build localized block info for UI rendering.
 * @param {Function} t - i18n translate function
 */
export function getBlockInfo(t) {
  return {
    [BLOCK_TYPES.FLOW_INFO]: {
      ...BLOCK_STATIC[BLOCK_TYPES.FLOW_INFO],
      label: t("agentBuilder.blocks.flowInfo.label"),
      description: t("agentBuilder.blocks.flowInfo.description"),
      getSummary: (config) =>
        config.name || t("agentBuilder.untitledFlow"),
    },
    [BLOCK_TYPES.START]: {
      ...BLOCK_STATIC[BLOCK_TYPES.START],
      label: t("agentBuilder.blocks.start.label"),
      description: t("agentBuilder.blocks.start.description"),
      getSummary: (config) => {
        const varCount = config.variables?.filter((v) => v.name)?.length || 0;
        const key =
          varCount === 1
            ? "agentBuilder.blocks.start.summary"
            : "agentBuilder.blocks.start.summary_other";
        return t(key, { count: varCount });
      },
    },
    [BLOCK_TYPES.API_CALL]: {
      ...BLOCK_STATIC[BLOCK_TYPES.API_CALL],
      label: t("agentBuilder.blocks.apiCall.label"),
      description: t("agentBuilder.blocks.apiCall.description"),
      getSummary: (config) =>
        `${config.method || "GET"} ${config.url || t("agentBuilder.blocks.apiCall.noUrl")}`,
    },
    [BLOCK_TYPES.LLM_INSTRUCTION]: {
      ...BLOCK_STATIC[BLOCK_TYPES.LLM_INSTRUCTION],
      label: t("agentBuilder.blocks.llmInstruction.label"),
      description: t("agentBuilder.blocks.llmInstruction.description"),
      getSummary: (config) =>
        config.instruction ||
        t("agentBuilder.blocks.llmInstruction.noInstruction"),
    },
    [BLOCK_TYPES.WEB_SCRAPING]: {
      ...BLOCK_STATIC[BLOCK_TYPES.WEB_SCRAPING],
      label: t("agentBuilder.blocks.webScraping.label"),
      description: t("agentBuilder.blocks.webScraping.description"),
      getSummary: (config) =>
        config.url || t("agentBuilder.blocks.webScraping.noUrl"),
    },
    [BLOCK_TYPES.FINISH]: {
      ...BLOCK_STATIC[BLOCK_TYPES.FINISH],
      label: t("agentBuilder.blocks.finish.label"),
      description: t("agentBuilder.blocks.finish.description"),
      getSummary: () => t("agentBuilder.blocks.finish.summary"),
    },
  };
}

/** English fallback for consumers that don't pass `t` (e.g. defaultConfig lookups). */
const BLOCK_INFO = {
  [BLOCK_TYPES.FLOW_INFO]: {
    ...BLOCK_STATIC[BLOCK_TYPES.FLOW_INFO],
    label: "Flow Information",
    description: "Basic flow information",
    getSummary: (config) => config.name || "Untitled Flow",
  },
  [BLOCK_TYPES.START]: {
    ...BLOCK_STATIC[BLOCK_TYPES.START],
    label: "Flow Variables",
    description: "Configure agent variables and settings",
    getSummary: (config) => {
      const varCount = config.variables?.filter((v) => v.name)?.length || 0;
      return `${varCount} variable${varCount !== 1 ? "s" : ""} defined`;
    },
  },
  [BLOCK_TYPES.API_CALL]: {
    ...BLOCK_STATIC[BLOCK_TYPES.API_CALL],
    label: "API Call",
    description: "Make an HTTP request",
    getSummary: (config) =>
      `${config.method || "GET"} ${config.url || "(no URL)"}`,
  },
  [BLOCK_TYPES.LLM_INSTRUCTION]: {
    ...BLOCK_STATIC[BLOCK_TYPES.LLM_INSTRUCTION],
    label: "LLM Instruction",
    description: "Process data using LLM instructions",
    getSummary: (config) => config.instruction || "No instruction",
  },
  [BLOCK_TYPES.WEB_SCRAPING]: {
    ...BLOCK_STATIC[BLOCK_TYPES.WEB_SCRAPING],
    label: "Web Scraping",
    description: "Scrape content from a webpage",
    getSummary: (config) => config.url || "No URL specified",
  },
  [BLOCK_TYPES.FINISH]: {
    ...BLOCK_STATIC[BLOCK_TYPES.FINISH],
    label: "Flow Complete",
    description: "End of agent flow",
    getSummary: () => "Flow will end here",
  },
};

export default function BlockList({
  blocks,
  updateBlockConfig,
  removeBlock,
  toggleBlockExpansion,
  renderVariableSelect,
  onDeleteVariable,
  moveBlock,
  refs,
}) {
  const { t } = useTranslation();
  const blockInfo = useMemo(() => getBlockInfo(t), [t]);

  const renderBlockConfig = (block) => {
    const isLastConfigurableBlock = blocks[blocks.length - 2]?.id === block.id;
    const props = {
      config: block.config,
      onConfigChange: (config) => updateBlockConfig(block.id, config),
      renderVariableSelect,
      onDeleteVariable,
    };

    // Direct output switch to the last configurable block before finish
    if (
      isLastConfigurableBlock &&
      block.type !== BLOCK_TYPES.START &&
      block.type !== BLOCK_TYPES.FLOW_INFO
    ) {
      return (
        <div className="space-y-4">
          {renderBlockConfigContent(block, props)}
          <div className="pt-4 border-t border-white/10">
            <Toggle
              size="md"
              variant="horizontal"
              label={t("agentBuilder.directOutput.label")}
              description={t("agentBuilder.directOutput.description")}
              enabled={props.config.directOutput || false}
              onChange={(checked) =>
                props.onConfigChange({
                  ...props.config,
                  directOutput: checked,
                })
              }
            />
          </div>
        </div>
      );
    }

    return renderBlockConfigContent(block, props);
  };

  const renderBlockConfigContent = (block, props) => {
    switch (block.type) {
      case BLOCK_TYPES.FLOW_INFO:
        return <FlowInfoNode {...props} ref={refs} />;
      case BLOCK_TYPES.START:
        return <StartNode {...props} />;
      case BLOCK_TYPES.API_CALL:
        return <ApiCallNode {...props} />;
      case BLOCK_TYPES.WEBSITE:
        return <WebsiteNode {...props} />;
      case BLOCK_TYPES.FILE:
        return <FileNode {...props} />;
      case BLOCK_TYPES.CODE:
        return <CodeNode {...props} />;
      case BLOCK_TYPES.LLM_INSTRUCTION:
        return <LLMInstructionNode {...props} />;
      case BLOCK_TYPES.WEB_SCRAPING:
        return <WebScrapingNode {...props} />;
      case BLOCK_TYPES.FINISH:
        return <FinishNode />;
      default:
        return (
          <div className="text-sm text-theme-text-secondary">
            {t("agentBuilder.configComingSoon")}
          </div>
        );
    }
  };

  return (
    <div className="space-y-1 w-full">
      {blocks.map((block, index) => {
        const info = blockInfo[block.type] || BLOCK_INFO[block.type];
        if (!info) return null;

        return (
          <div key={block.id} className="flex flex-col w-full">
            <div
              className={`bg-theme-action-menu-bg border border-white/10 rounded-lg overflow-hidden transition-all duration-300 ${
                block.isExpanded
                  ? "w-full"
                  : "w-full max-w-[320px] sm:max-w-[280px] mx-auto"
              }`}
            >
              <div
                onClick={() => toggleBlockExpansion(block.id)}
                className="w-full p-3 sm:p-4 flex items-center justify-between gap-2 hover:bg-theme-action-menu-item-hover transition-colors duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-white/10 light:bg-white flex items-center justify-center">
                    {React.cloneElement(info.icon, {
                      className: "w-4 h-4 text-white",
                    })}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-sm font-medium text-white block truncate">
                      {info.label}
                    </span>
                    {!block.isExpanded && (
                      <p className="text-xs text-white/60 truncate">
                        {info.getSummary(block.config)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center shrink-0">
                  {block.id !== "start" &&
                    block.type !== BLOCK_TYPES.FINISH &&
                    block.type !== BLOCK_TYPES.FLOW_INFO && (
                      <div className="flex items-center gap-1">
                        {index > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(index, index - 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                            data-tooltip-id="block-action"
                            data-tooltip-content={t("agentBuilder.moveBlockUp")}
                          >
                            <CaretUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {index < blocks.length - 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(index, index + 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                            data-tooltip-id="block-action"
                            data-tooltip-content={t(
                              "agentBuilder.moveBlockDown"
                            )}
                          >
                            <CaretDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(block.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-theme-bg-primary border border-white/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors duration-300"
                          data-tooltip-id="block-action"
                          data-tooltip-content={t("agentBuilder.deleteBlock")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                </div>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  block.isExpanded
                    ? "max-h-[5000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-white/10 p-3 sm:p-4 bg-theme-bg-secondary rounded-b-lg overflow-x-auto">
                  {renderBlockConfig(block)}
                </div>
              </div>
            </div>
            {index < blocks.length - 1 && (
              <div className="flex justify-center my-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white/40 light:invert"
                >
                  <path
                    d="M12 4L12 20M12 20L6 14M12 20L18 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      <Tooltip
        id="block-action"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

export { BLOCK_TYPES, BLOCK_INFO };
