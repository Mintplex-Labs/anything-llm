import React, { useState, useRef, useEffect } from "react";
import SlashCommandsButton, {
  SlashCommands,
  useSlashCommands,
} from "./SlashCommands";
import debounce from "lodash.debounce";
import { PaperPlaneRight } from "@phosphor-icons/react";
import StopGenerationButton from "./StopGenerationButton";
import AvailableAgentsButton, {
  AvailableAgents,
  useAvailableAgents,
} from "./AgentMenu";
import TextSizeButton from "./TextSizeMenu";
import SpeechToText from "./SpeechToText";
import { Tooltip } from "react-tooltip";
import AttachmentManager from "./Attachments";
import AttachItem from "./AttachItem";
import { PASTE_ATTACHMENT_EVENT } from "../DnDWrapper";

export const PROMPT_INPUT_EVENT = "set_prompt_input";
export default function PromptInput({
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
  sendCommand,
  attachments = [],
}) {
  const [promptInput, setPromptInput] = useState("");
  const { showAgents, setShowAgents } = useAvailableAgents();
  const { showSlashCommand, setShowSlashCommand } = useSlashCommands();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);

  // To prevent too many re-renders we remotely listen for updates from the parent
  // via an event cycle. Otherwise, using message as a prop leads to a re-render every
  // change on the input.
  function handlePromptUpdate(e) {
    setPromptInput(e?.detail ?? "");
  }

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  useEffect(() => {
    if (!inputDisabled && textareaRef.current) {
      textareaRef.current.focus();
    }
    resetTextAreaHeight();
  }, [inputDisabled]);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
  };

  const resetTextAreaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const checkForSlash = (e) => {
    const input = e.target.value;
    if (input === "/") setShowSlashCommand(true);
    if (showSlashCommand) setShowSlashCommand(false);
    return;
  };

  const checkForAt = (e) => {
    const input = e.target.value;
    if (input === "@") return setShowAgents(true);
    if (showAgents) return setShowAgents(false);
  };

  const captureEnter = (event) => {
    if (event.keyCode == 13) {
      if (!event.shiftKey) {
        submit(event);
      }
    }
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const handlePasteEvent = (e) => {
    e.preventDefault();
    if (e.clipboardData.items.length === 0) return false;

    // paste any clipboard items that are images.
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        window.dispatchEvent(
          new CustomEvent(PASTE_ATTACHMENT_EVENT, {
            detail: { files: [file] },
          })
        );
        continue;
      }

      // handle files specifically that are not images as uploads
      if (item.kind === "file") {
        const file = item.getAsFile();
        window.dispatchEvent(
          new CustomEvent(PASTE_ATTACHMENT_EVENT, {
            detail: { files: [file] },
          })
        );
        continue;
      }
    }

    const pasteText = e.clipboardData.getData("text/plain");
    if (pasteText) setPromptInput(pasteText.trim());
    return;
  };

  const watchForSlash = debounce(checkForSlash, 300);
  const watchForAt = debounce(checkForAt, 300);

  return (
    <div className="w-full fixed md:absolute bottom-0 left-0 z-10 md:z-0 flex justify-center items-center">
      <SlashCommands
        showing={showSlashCommand}
        setShowing={setShowSlashCommand}
        sendCommand={sendCommand}
      />
      <AvailableAgents
        showing={showAgents}
        setShowing={setShowAgents}
        sendCommand={sendCommand}
        promptRef={textareaRef}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-1 rounded-t-lg md:w-3/4 w-full mx-auto max-w-xl items-center"
      >
        <div className="flex items-center rounded-lg md:mb-4">
          <div className="w-[95vw] md:w-[635px] bg-main-gradient shadow-2xl border border-white/50 rounded-2xl flex flex-col px-4 overflow-hidden">
            <AttachmentManager attachments={attachments} />
            <div className="flex items-center w-full border-b-2 border-gray-500/50">
              <textarea
                ref={textareaRef}
                onChange={(e) => {
                  onChange(e);
                  watchForSlash(e);
                  watchForAt(e);
                  adjustTextArea(e);
                  setPromptInput(e.target.value);
                }}
                onKeyDown={captureEnter}
                onPaste={handlePasteEvent}
                required={true}
                disabled={inputDisabled}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={promptInput}
                className="cursor-text max-h-[50vh] md:max-h-[350px] md:min-h-[40px] mx-2 md:mx-0 py-2 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none flex-grow"
                placeholder={"Send a message"}
              />
              {buttonDisabled ? (
                <StopGenerationButton />
              ) : (
                <>
                  <button
                    ref={formRef}
                    type="submit"
                    className="inline-flex justify-center rounded-2xl cursor-pointer text-white/60 hover:text-white group ml-4"
                    data-tooltip-id="send-prompt"
                    data-tooltip-content="Send prompt message to workspace"
                    aria-label="Send prompt message to workspace"
                  >
                    <PaperPlaneRight className="w-7 h-7 my-3" weight="fill" />
                    <span className="sr-only">Send message</span>
                  </button>
                  <Tooltip
                    id="send-prompt"
                    place="bottom"
                    delayShow={300}
                    className="tooltip !text-xs z-99"
                  />
                </>
              )}
            </div>
            <div className="flex justify-between py-3.5">
              <div className="flex gap-x-2">
                <AttachItem />
                <SlashCommandsButton
                  showing={showSlashCommand}
                  setShowSlashCommand={setShowSlashCommand}
                />
                <AvailableAgentsButton
                  showing={showAgents}
                  setShowAgents={setShowAgents}
                />
                <TextSizeButton />
              </div>
              <div className="flex gap-x-2">
                <SpeechToText sendCommand={sendCommand} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
