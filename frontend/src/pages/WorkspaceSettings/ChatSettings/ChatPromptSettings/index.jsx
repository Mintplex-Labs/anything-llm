import React, { useState, useEffect, useRef } from "react";
import { chatPrompt } from "@/utils/chat";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import showToast from "@/utils/toast";
import VariableAutoComplete from "./VariableAutoComplete";

export default function ChatPromptSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  const [showVariables, setShowVariables] = useState(false);
  const [variables, setVariables] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [promptValue, setPromptValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef(null);
  const measureRef = useRef(null);

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
