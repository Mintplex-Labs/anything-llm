import React from "react";
import {
  X,
  CaretUp,
  CaretDown,
  Plus,
  Globe,
  Browser,
  File,
  Code,
} from "@phosphor-icons/react";
import StartNode from "../nodes/StartNode";
import ApiCallNode from "../nodes/ApiCallNode";
import WebsiteNode from "../nodes/WebsiteNode";
import FileNode from "../nodes/FileNode";
import CodeNode from "../nodes/CodeNode";

const BLOCK_TYPES = {
  START: "start",
  API_CALL: "apiCall",
  WEBSITE: "website",
  FILE: "file",
  CODE: "code",
};

const BLOCK_INFO = {
  [BLOCK_TYPES.START]: {
    label: "Agent Start",
    icon: <Plus className="w-5 h-5 text-theme-text-primary" />,
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
      headers: {},
      body: "",
      responseVariable: "",
    },
    getSummary: (config) =>
      `${config.method || "GET"} ${config.url || "(no URL)"}`,
  },
  [BLOCK_TYPES.WEBSITE]: {
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
};

export default function BlockList({
  blocks,
  updateBlockConfig,
  removeBlock,
  toggleBlockExpansion,
  renderVariableSelect,
}) {
  const renderBlockConfig = (block) => {
    const props = {
      config: block.config,
      onConfigChange: (config) => updateBlockConfig(block.id, config),
      renderVariableSelect,
    };

    switch (block.type) {
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
      default:
        return <div>Configuration options coming soon...</div>;
    }
  };

  return (
    <div className="space-y-1">
      {blocks.map((block, index) => (
        <div key={block.id} className="flex flex-col">
          <div
            className={`bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg overflow-hidden transition-all duration-200 ${
              block.isExpanded ? "w-full" : "w-[280px] mx-auto"
            }`}
          >
            <button
              onClick={() => toggleBlockExpansion(block.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-theme-bg-hover transition-colors duration-200 group"
            >
              <div className="flex items-center gap-3 min-h-[32px]">
                <div className="w-8 h-8 rounded-lg bg-theme-bg-primary flex items-center justify-center border border-theme-sidebar-border">
                  {BLOCK_INFO[block.type].icon}
                </div>
                <div>
                  <span className="font-medium text-theme-text-primary block">
                    {BLOCK_INFO[block.type].label}
                  </span>
                  {!block.isExpanded && (
                    <p className="text-sm text-theme-text-secondary">
                      {BLOCK_INFO[block.type].getSummary(block.config)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {block.id !== "start" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBlock(block.id);
                    }}
                    className="p-1 text-theme-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 rounded transition-opacity duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <div className="w-4 flex items-center justify-center">
                  {block.isExpanded ? (
                    <CaretUp className="w-4 h-4 text-theme-text-secondary" />
                  ) : (
                    <CaretDown className="w-4 h-4 text-theme-text-secondary" />
                  )}
                </div>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                block.isExpanded
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-theme-sidebar-border p-4 bg-theme-bg-primary">
                {renderBlockConfig(block)}
              </div>
            </div>
          </div>
          {index < blocks.length - 1 && (
            <div className="flex justify-center my-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-theme-text-secondary"
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
    </div>
  );
}

export { BLOCK_TYPES, BLOCK_INFO };
