import React, { useState, useEffect, useRef } from "react";
import { chatPrompt } from "@/utils/chat";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import showToast from "@/utils/toast";
import VariableAutoComplete from "./VariableAutoComplete";

// Helper function to find all variable matches in text
function findVariableMatches(text, variables) {
  const matches = [];
  const regex = /\{([^}]+)\}/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const isValid = variables.some(v => v.key === match[1]);
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      value: match[0],
      isValid
    });
  }
  return matches;
}

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  const [showVariables, setShowVariables] = useState(false);
  const [variables, setVariables] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [promptValue, setPromptValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef(null);
  const measureRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    if (showVariables) {
      updateCursorPosition();
      requestAnimationFrame(updateCursorPosition);
    }
  }, [showVariables]);

  // Sync overlay scroll with textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;
    if (!textarea || !overlay) return;

    const syncScroll = () => {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    };

    textarea.addEventListener('scroll', syncScroll);
    return () => textarea.removeEventListener('scroll', syncScroll);
  }, []);

  const updateCursorPosition = () => {
    if (!textareaRef.current || !showVariables || !measureRef.current) return;

    const textarea = textareaRef.current;
    const measure = measureRef.current;
    const { selectionStart } = textarea;
    const text = textarea.value.substring(0, selectionStart);
    const textBeforeCursor = text.split("\n").pop() || "";

    // Update the measuring span with the text
    measure.textContent = textBeforeCursor;

    // Get positions
    const textareaRect = textarea.getBoundingClientRect();
    const measureRect = measure.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight =
      parseInt(computedStyle.lineHeight) ||
      parseInt(computedStyle.fontSize) * 1.2;

    // Calculate the number of lines
    const lines = text.split("\n");
    const currentLineIndex = lines.length - 1;

    setCursorPosition({
      top:
        textareaRect.top + currentLineIndex * lineHeight - textarea.scrollTop,
      left: textareaRect.left + measureRect.width,
    });
  };

  const handleKeyDown = (e) => {
    if (
      showVariables &&
      ["ArrowUp", "ArrowDown", "Enter", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return; // Let the menu handle these keys
    }

    if (e.key === "{") {
      e.preventDefault();
      const textarea = e.target;
      const { selectionStart } = textarea;

      // Insert the bracket
      const textBeforeCursor = textarea.value.substring(0, selectionStart);
      const newValue =
        textBeforeCursor + "{" + textarea.value.substring(selectionStart);
      setPromptValue(newValue);
      setShowVariables(true);
      setSearchTerm("");
    } else if (e.key === "Escape") {
      setShowVariables(false);
    } else if (showVariables && e.key !== "Enter" && e.key !== "Tab") {
      requestAnimationFrame(() => {
        const textarea = e.target;
        const cursorPos = textarea.selectionStart;
        const textBefore = textarea.value.substring(0, cursorPos);
        const lastOpenBrace = textBefore.lastIndexOf("{");
        if (lastOpenBrace >= 0) {
          const newSearchTerm = textBefore.substring(lastOpenBrace + 1);
          setSearchTerm(newSearchTerm);
        }
        updateCursorPosition();
      });
    }
  };

  const handleChange = (e) => {
    setPromptValue(e.target.value);
    setHasChanges(true);
    if (showVariables) {
      requestAnimationFrame(updateCursorPosition);
    }
  };

  const handleVariableSelect = (variable) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);
    const textAfter = textarea.value.substring(cursorPos);
    const lastOpenBrace = textBefore.lastIndexOf("{");

    // Replace from the last open brace to cursor with the selected variable
    const newValue =
      textBefore.substring(0, lastOpenBrace) + `{${variable.key}}` + textAfter;

    setPromptValue(newValue);
    setHasChanges(true);
    setShowVariables(false);

    // Set cursor position after the inserted variable
    const newCursorPos = lastOpenBrace + variable.key.length + 2;
    textarea.selectionStart = newCursorPos;
    textarea.selectionEnd = newCursorPos;
    textarea.focus();
  };

  // Create highlighted content
  const renderHighlightedContent = () => {
    const matches = findVariableMatches(promptValue, variables);
    if (matches.length === 0) return promptValue;

    let lastIndex = 0;
    const elements = [];

    matches.forEach((match, i) => {
      // Add text before the match
      if (match.start > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>
            {promptValue.slice(lastIndex, match.start)}
          </span>
        );
      }

      // Add the highlighted variable
      elements.push(
        <span
          key={`var-${i}`}
          className={`whitespace-pre ${
            match.isValid
              ? "bg-white text-black rounded"
              : "bg-red-500/30 text-white border border-red-500 rounded"
          }`}
        >
          {match.value}
        </span>
      );

      lastIndex = match.end;
    });

    // Add any remaining text
    if (lastIndex < promptValue.length) {
      elements.push(
        <span key="text-end">
          {promptValue.slice(lastIndex)}
        </span>
      );
    }

    return elements;
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
        <p className="text-white text-opacity-60 text-xs font-medium mb-2">
          Type &ldquo;&#123;&rdquo; to insert variables like:{" "}
          {variables.slice(0, 3).map((v, i) => (
            <span
              key={v.key}
              className="bg-theme-settings-input-bg px-1 py-0.5 rounded mx-1"
            >
              {`{${v.key}}`}
            </span>
          ))}
          {variables.length > 3 && (
            <span>and {variables.length - 3} more...</span>
          )}
        </p>
      </div>

      <div className="relative">
        <span
          ref={measureRef}
          aria-hidden="true"
          className="absolute invisible whitespace-pre text-sm"
          style={{
            padding: "0",
            border: "0",
            font: "inherit",
            whiteSpace: "pre",
            overflow: "hidden",
          }}
        />

        <div className="relative mt-2">
          <div className="relative bg-theme-settings-input-bg rounded-lg">
            <div
              ref={overlayRef}
              className="absolute inset-0 text-white text-sm whitespace-pre-wrap break-words pointer-events-none p-2.5 overflow-hidden"
              style={{
                font: 'inherit',
                zIndex: 1
              }}
            >
              {renderHighlightedContent()}
            </div>

            <textarea
              ref={textareaRef}
              name="openAiPrompt"
              rows={5}
              value={promptValue}
              className="border-none bg-transparent placeholder:text-theme-settings-input-placeholder text-transparent text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
              required={true}
              wrap="soft"
              autoComplete="off"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={{
                caretColor: 'white'
              }}
            />
          </div>
        </div>

        {showVariables && cursorPosition && (
          <VariableAutoComplete
            variables={variables}
            onSelect={handleVariableSelect}
            position={cursorPosition}
            onClose={() => setShowVariables(false)}
            searchTerm={searchTerm}
          />
        )}
      </div>
    </div>
  );
}
