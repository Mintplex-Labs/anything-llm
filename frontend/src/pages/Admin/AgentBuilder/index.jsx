import React, { useState } from 'react';
import { Plus, X, Globe, Browser, File, Code, CaretDown, CaretUp } from "@phosphor-icons/react";

const BLOCK_TYPES = {
  START: 'start',
  API_CALL: 'apiCall',
  WEBSITE: 'website',
  FILE: 'file',
  CODE: 'code',
};

const BLOCK_INFO = {
  [BLOCK_TYPES.START]: {
    label: 'Agent Start',
    icon: <Plus className="w-5 h-5 text-theme-text-primary" />,
    description: 'Configure agent variables and settings',
    getSummary: (config) => {
      const varCount = config.variables?.filter(v => v.name)?.length || 0;
      return `${varCount} variable${varCount !== 1 ? 's' : ''} defined`;
    }
  },
  [BLOCK_TYPES.API_CALL]: {
    label: 'API Call',
    icon: <Globe className="w-5 h-5 text-theme-text-primary" />,
    description: 'Make an HTTP request',
    defaultConfig: {
      url: '',
      method: 'GET',
      headers: {},
      body: '',
      responseVariable: '',
    },
    getSummary: (config) => `${config.method || 'GET'} ${config.url || '(no URL)'}`
  },
  [BLOCK_TYPES.WEBSITE]: {
    label: 'Open Website',
    icon: <Browser className="w-5 h-5 text-theme-text-primary" />,
    description: 'Navigate to a URL',
    defaultConfig: {
      url: '',
      selector: '',
      action: 'read',
      value: '',
      resultVariable: '',
    },
    getSummary: (config) => `${config.action || 'read'} from ${config.url || '(no URL)'}`
  },
  [BLOCK_TYPES.FILE]: {
    label: 'Open File',
    icon: <File className="w-5 h-5 text-theme-text-primary" />,
    description: 'Read or write to a file',
    defaultConfig: {
      path: '',
      operation: 'read',
      content: '',
      resultVariable: '',
    },
    getSummary: (config) => `${config.operation || 'read'} ${config.path || '(no path)'}`
  },
  [BLOCK_TYPES.CODE]: {
    label: 'Code Execution',
    icon: <Code className="w-5 h-5 text-theme-text-primary" />,
    description: 'Execute code snippets',
    defaultConfig: {
      language: 'javascript',
      code: '',
      resultVariable: '',
    },
    getSummary: (config) => `Run ${config.language || 'javascript'} code`
  },
};

export default function AgentBuilder() {
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [blocks, setBlocks] = useState([
    {
      id: 'start',
      type: BLOCK_TYPES.START,
      config: {
        variables: [{ name: '', value: '' }],
      },
      isExpanded: true,
    },
  ]);
  const [selectedBlock, setSelectedBlock] = useState('start');
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const addBlock = (type) => {
    const newBlock = {
      id: `block_${blocks.length}`,
      type,
      config: { ...BLOCK_INFO[type].defaultConfig },
      isExpanded: true,
    };
    setBlocks([...blocks, newBlock]);
    setShowBlockMenu(false);
  };

  const updateBlockConfig = (blockId, config) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, config: { ...block.config, ...config } } : block
    ));
  };

  const removeBlock = (blockId) => {
    if (blockId === 'start') return;
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (selectedBlock === blockId) {
      setSelectedBlock('start');
    }
  };

  const generateJson = () => {
    const json = {
      name: agentName,
      description: agentDescription,
      steps: blocks.map(block => ({
        type: block.type,
        config: block.config,
      })),
    };
    console.log(json);
  };

  // Get all available variables from the start block
  const getAvailableVariables = () => {
    const startBlock = blocks.find(b => b.type === BLOCK_TYPES.START);
    return startBlock?.config?.variables?.filter(v => v.name) || [];
  };

  const renderVariableSelect = (value, onChange, placeholder = "Select variable") => (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
    >
      <option value="">{placeholder}</option>
      {getAvailableVariables().map(v => (
        <option key={v.name} value={v.name}>{v.name}</option>
      ))}
    </select>
);

  const renderBlockConfig = (block) => {
  switch (block.type) {
    case BLOCK_TYPES.START:
      return (
        <div className="space-y-4">
          <h3 className="text-theme-text-primary font-medium">Variables</h3>
          {block.config.variables.map((variable, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Variable name"
                value={variable.name}
                onChange={(e) => {
                  const newVars = [...block.config.variables];
                  newVars[index].name = e.target.value;
                    updateBlockConfig(block.id, { variables: newVars });
                }}
                className="flex-1 p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
              />
              <input
                type="text"
                placeholder="Initial value"
                value={variable.value}
                onChange={(e) => {
                  const newVars = [...block.config.variables];
                  newVars[index].value = e.target.value;
                    updateBlockConfig(block.id, { variables: newVars });
                }}
                className="flex-1 p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
              />
              {index === block.config.variables.length - 1 && (
                <button
                  onClick={() => {
                    const newVars = [...block.config.variables, { name: '', value: '' }];
                      updateBlockConfig(block.id, { variables: newVars });
                  }}
                  className="p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary hover:bg-theme-bg-hover"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      );
    case BLOCK_TYPES.API_CALL:
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-theme-text-secondary">URL</label>
            <input
              type="text"
              placeholder="https://api.example.com/endpoint"
              value={block.config.url}
                onChange={(e) => updateBlockConfig(block.id, { url: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            />
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">Method</label>
            <select
              value={block.config.method}
                onChange={(e) => updateBlockConfig(block.id, { method: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            >
              {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">Store Response In</label>
            {renderVariableSelect(
              block.config.responseVariable,
                (value) => updateBlockConfig(block.id, { responseVariable: value }),
              "Select or create variable"
            )}
          </div>
        </div>
      );
    case BLOCK_TYPES.WEBSITE:
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-theme-text-secondary">URL</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={block.config.url}
                onChange={(e) => updateBlockConfig(block.id, { url: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            />
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">Action</label>
            <select
              value={block.config.action}
                onChange={(e) => updateBlockConfig(block.id, { action: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            >
              <option value="read">Read Content</option>
              <option value="click">Click Element</option>
              <option value="type">Type Text</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">CSS Selector</label>
            <input
              type="text"
              placeholder="#element-id or .class-name"
              value={block.config.selector}
                onChange={(e) => updateBlockConfig(block.id, { selector: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            />
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">Store Result In</label>
            {renderVariableSelect(
              block.config.resultVariable,
                (value) => updateBlockConfig(block.id, { resultVariable: value }),
              "Select or create variable"
            )}
          </div>
        </div>
      );
    case BLOCK_TYPES.FILE:
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-theme-text-secondary">Operation</label>
            <select
              value={block.config.operation}
                onChange={(e) => updateBlockConfig(block.id, { operation: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            >
              <option value="read">Read File</option>
              <option value="write">Write File</option>
              <option value="append">Append to File</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">File Path</label>
            <input
              type="text"
              placeholder="/path/to/file"
              value={block.config.path}
                onChange={(e) => updateBlockConfig(block.id, { path: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            />
          </div>
          {block.config.operation !== 'read' && (
            <div>
              <label className="text-sm text-theme-text-secondary">Content</label>
              <textarea
                placeholder="File content..."
                value={block.config.content}
                  onChange={(e) => updateBlockConfig(block.id, { content: e.target.value })}
                className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
                rows={3}
              />
            </div>
          )}
          <div>
            <label className="text-sm text-theme-text-secondary">Store Result In</label>
            {renderVariableSelect(
              block.config.resultVariable,
                (value) => updateBlockConfig(block.id, { resultVariable: value }),
              "Select or create variable"
            )}
          </div>
        </div>
      );
    case BLOCK_TYPES.CODE:
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-theme-text-secondary">Language</label>
            <select
              value={block.config.language}
                onChange={(e) => updateBlockConfig(block.id, { language: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="shell">Shell</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">Code</label>
            <textarea
              placeholder="Enter code..."
              value={block.config.code}
                onChange={(e) => updateBlockConfig(block.id, { code: e.target.value })}
              className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary font-mono"
              rows={5}
            />
          </div>
          <div>
            <label className="text-sm text-theme-text-secondary">Store Result In</label>
            {renderVariableSelect(
              block.config.resultVariable,
                (value) => updateBlockConfig(block.id, { resultVariable: value }),
              "Select or create variable"
            )}
          </div>
        </div>
      );
    default:
      return <div>Configuration options coming soon...</div>;
  }
  };

  const toggleBlockExpansion = (blockId) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, isExpanded: !block.isExpanded } : block
    ));
  };

  return (
    <div className="w-full h-screen flex bg-theme-bg-primary">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-theme-sidebar-border bg-theme-bg-secondary p-6 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-theme-text-primary mb-6">Agent Builder</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Agent Name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Agent Description"
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <button
            onClick={generateJson}
            className="w-full p-2 bg-theme-bg-primary hover:bg-theme-bg-hover border border-theme-sidebar-border rounded text-theme-text-primary flex items-center justify-center gap-2"
          >
            Generate JSON
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          {/* Blocks */}
          <div className="space-y-1">
            {blocks.map((block, index) => (
              <div key={block.id} className="flex flex-col">
                <div
                  className={`bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg overflow-hidden transition-all duration-200 ${
                    block.isExpanded ? 'w-full' : 'w-[280px] mx-auto'
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
                      {block.id !== 'start' && (
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
                      block.isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-theme-sidebar-border p-4 bg-theme-bg-primary">
                      {renderBlockConfig(block)}
                    </div>
                  </div>
                </div>
                {index < blocks.length - 1 && (
                  <div className="flex justify-center my-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-theme-text-secondary">
                      <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Block Button */}
          <div className="relative mt-4 w-[280px] mx-auto">
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="w-full p-3 bg-theme-bg-secondary hover:bg-theme-bg-hover border border-theme-sidebar-border rounded-lg text-theme-text-primary flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Block
              <CaretDown className="w-4 h-4" />
            </button>
            {showBlockMenu && (
              <div className="absolute left-0 right-0 mt-2 bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg shadow-lg overflow-hidden z-10">
                {Object.entries(BLOCK_INFO).map(([type, info]) => (
                  type !== BLOCK_TYPES.START && (
                    <button
                      key={type}
                      onClick={() => {
                        addBlock(type);
                        setShowBlockMenu(false);
                      }}
                      className="w-full p-3 flex items-center gap-3 hover:bg-theme-bg-hover text-theme-text-primary"
                    >
                      <div className="w-8 h-8 rounded-lg bg-theme-bg-primary flex items-center justify-center border border-theme-sidebar-border">
                        {info.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{info.label}</div>
                        <div className="text-sm text-theme-text-secondary">{info.description}</div>
                      </div>
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}