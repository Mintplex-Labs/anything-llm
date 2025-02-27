import React, { useState, useEffect, useRef } from "react";
import { chatPrompt } from "@/utils/chat";
import { useTranslation } from "react-i18next";
import { Plus } from "@phosphor-icons/react";
import VariableAutocomplete from "@/components/VariableAutocomplete";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  const [showVariables, setShowVariables] = useState(false);
  const [variables, setVariables] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [promptValue, setPromptValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    // Initialize prompt value
    setPromptValue(chatPrompt(workspace));
  }, [workspace]);

  useEffect(() => {
    async function fetchVariables() {
      try {
        const { variables } = await System.getSystemVariables();
        setVariables(variables || []);
      } catch (error) {
        console.error("Error fetching variables:", error);
        showToast("Failed to load variables", "error");
      }
    }
    fetchVariables();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "{") {
      const rect = e.target.getBoundingClientRect();
      const selectionStart = e.target.selectionStart;
      const textBeforeCursor = e.target.value.substring(0, selectionStart);
      const lastLineBreak = textBeforeCursor.lastIndexOf("\n");
      const currentLineText = textBeforeCursor.substring(lastLineBreak + 1);

      // Calculate position for the autocomplete popup
      const lineHeight = 20; // Approximate line height
      const lineCount = (textBeforeCursor.match(/\n/g) || []).length;
      const top = rect.top + lineCount * lineHeight + 30; // 30px offset for padding
      const left = rect.left + currentLineText.length * 8; // 8px per character (approximate)

      setCursorPosition({ top, left });
      setShowVariables(true);
    } else if (e.key === "Escape") {
      setShowVariables(false);
    }
  };

  const handleVariableSelect = (variable) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);

    // Insert the variable at cursor position
    const newValue = `${textBefore}{${variable.key}}${textAfter}`;
    textarea.value = newValue;
    setPromptValue(newValue);

    // Update cursor position after the inserted variable
    const newCursorPos = cursorPos + variable.key.length + 2; // +2 for the braces
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;

    // Focus back on textarea and trigger change event
    textarea.focus();
    setHasChanges(true);
    setShowVariables(false);
  };

  const handleChange = (e) => {
    setPromptValue(e.target.value);
    setHasChanges(true);
  };

  // Function to highlight variables in the displayed text
  const getHighlightedText = () => {
    if (!promptValue) return "";

    // Replace variables with highlighted spans
    return promptValue.replace(/\{([^}]+)\}/g, (match, variable) => {
      const isKnownVariable = variables.some(v => v.key === variable);
      const className = isKnownVariable
        ? "bg-primary-button/20 text-primary-button"
        : "bg-yellow-500/20 text-yellow-500";

      return `<span class="${className} px-1 rounded">${match}</span>`;
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat.prompt.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat.prompt.description")}
        </p>
        <div className="text-white text-opacity-60 text-xs font-medium mb-2">
          <span>Available variables: </span>
          {variables.slice(0, 3).map((v, i) => (
            <span key={v.key} className="bg-theme-settings-input-bg px-1 py-0.5 rounded mx-1">
              {`{${v.key}}`}
            </span>
          ))}
          {variables.length > 3 && <span>and {variables.length - 3} more...</span>}
          <button
            className="ml-2 text-primary-button hover:text-primary-button-hover"
            onClick={() => {
              setCursorPosition({ top: 100, left: 100 });
              setShowVariables(true);
            }}
          >
            <Plus size={14} className="inline" /> Insert variable
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          name="openAiPrompt"
          rows={5}
          value={promptValue}
          className="border-none bg-theme-settings-input-bg placeholder:text-theme-settings-input-placeholder text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 mt-2"
          placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
          required={true}
          wrap="soft"
          autoComplete="off"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        {/* Overlay to show highlighted variables */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none p-2.5 mt-2 text-sm"
          dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
        />
      </div>

      {showVariables && (
        <VariableAutocomplete
          variables={variables}
          onSelect={handleVariableSelect}
          position={cursorPosition}
          onClose={() => setShowVariables(false)}
        />
      )}
    </div>
  );
}
