import React from "react";
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

const BLOCK_INFO = {
  [BLOCK_TYPES.FLOW_INFO]: {
    label: "Flow Information",
    icon: <Info className="w-5 h-5 text-theme-text-primary" />,
    description: "Basic flow information",
    defaultConfig: {
      name: "",
      description: "",
    },
    getSummary: (config) => config.name || "Untitled Flow",
  },
  [BLOCK_TYPES.START]: {
    label: "Flow Variables",
    icon: <BracketsCurly className="w-5 h-5 text-theme-text-primary" />,
    description: "Configure agent variables and settings",
    getSummary: (config) => {
      const varCount = config.variables?.filter((v) => v.name)?.length || 0;
      return `${varCount} variable${varCount !== 1 ? "s" : ""} defined`;
    },
  },
  [BLOCK_TYPES.API_CALL]: {
    label: "API Call",
    icon: <Globe className="w-5 h-5 text-theme-text-primary" />,
    description: "Make an HTTP request",
    defaultConfig: {
      url: "",
      method: "GET",
      headers: [],
      bodyType: "json",
      body: "",
      formData: [],
      responseVariable: "",
    },
    getSummary: (config) =>
      `${config.method || "GET"} ${config.url || "(no URL)"}`,
  },
  // TODO: Implement website, file, and code blocks
  /* [BLOCK_TYPES.WEBSITE]: {
    label: "Open Website",
    icon: <Browser className="w-5 h-5 text-theme-text-primary" />,
    description: "Navigate to a URL",
    defaultConfig: {
      url: "",
      selector: "",
      action: "read",
      value: "",
      resultVariable: "",
    },
    getSummary: (config) =>
      `${config.action || "read"} from ${config.url || "(no URL)"}`,
  },
  [BLOCK_TYPES.FILE]: {
    label: "Open File",
    icon: <File className="w-5 h-5 text-theme-text-primary" />,
    description: "Read or write to a file",
    defaultConfig: {
      path: "",
      operation: "read",
      content: "",
      resultVariable: "",
    },
    getSummary: (config) =>
      `${config.operation || "read"} ${config.path || "(no path)"}`,
  },
  [BLOCK_TYPES.CODE]: {
    label: "Code Execution",
    icon: <Code className="w-5 h-5 text-theme-text-primary" />,
    description: "Execute code snippets",
    defaultConfig: {
      language: "javascript",
      code: "",
      resultVariable: "",
    },
    getSummary: (config) => `Run ${config.language || "javascript"} code`,
  },
  */
  [BLOCK_TYPES.LLM_INSTRUCTION]: {
    label: "LLM Instruction",
    icon: <Brain className="w-5 h-5 text-theme-text-primary" />,
    description: "Process data using LLM instructions",
    defaultConfig: {
      instruction: "",
      inputVariable: "",
      resultVariable: "",
    },
    getSummary: (config) => config.instruction || "No instruction",
  },
  [BLOCK_TYPES.WEB_SCRAPING]: {
    label: "Web Scraping",
    icon: <Browser className="w-5 h-5 text-theme-text-primary" />,
    description: "Scrape content from a webpage",
    defaultConfig: {
      url: "",
      captureAs: "text",
      querySelector: "",
      resultVariable: "",
    },
    getSummary: (config) => config.url || "No URL specified",
  },
  [BLOCK_TYPES.FINISH]: {
    label: "Flow Complete",
    icon: <Flag className="w-4 h-4" />,
    description: "End of agent flow",
    getSummary: () => "Flow will end here",
    defaultConfig: {},
    renderConfig: () => null,
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
  const renderBlockConfig = (block) => {
    const props = {
      config: block.config,
      onConfigChange: (config) => updateBlockConfig(block.id, config),
      renderVariableSelect,
      onDeleteVariable,
    };

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
        return <div>Configuration options coming soon...</div>;
    }
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, index) => (
        <div key={block.id} className="flex flex-col">
          <div
            className={`bg-theme-action-menu-bg border border-white/10 rounded-lg overflow-hidden transition-all duration-300 ${
              block.isExpanded ? "w-full" : "w-[280px] mx-auto"
            }`}
          >
            <div
              onClick={() => toggleBlockExpansion(block.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-theme-action-menu-item-hover transition-colors duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 light:bg-white flex items-center justify-center">
                  {React.cloneElement(BLOCK_INFO[block.type].icon, {
                    className: "w-4 h-4 text-white",
                  })}
                </div>
                <div className="flex-1 text-left min-w-0 max-w-[115px]">
                  <span className="text-sm font-medium text-white block">
                    {BLOCK_INFO[block.type].label}
                  </span>
                  {!block.isExpanded && (
                    <p className="text-xs text-white/60 truncate">
                      {BLOCK_INFO[block.type].getSummary(block.config)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
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
                          data-tooltip-content="Move block up"
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
                          data-tooltip-content="Move block down"
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
                        data-tooltip-content="Delete block"
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
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-white/10 p-4 bg-theme-bg-secondary rounded-b-lg">
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
      ))}
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
