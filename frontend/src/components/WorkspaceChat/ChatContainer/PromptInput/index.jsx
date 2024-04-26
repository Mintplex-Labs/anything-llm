import React, { useState, useRef, useEffect } from "react";
import SlashCommandsButton, {
  SlashCommands,
  useSlashCommands,
} from "./SlashCommands";
import { isMobile } from "react-device-detect";
import debounce from "lodash.debounce";
import { PaperPlaneRight } from "@phosphor-icons/react";
import StopGenerationButton from "./StopGenerationButton";
import AvailableAgentsButton, {
  AvailableAgents,
  useAvailableAgents,
} from "./AgentMenu";
import TextSizeButton from "./TextSizeMenu";
export default function PromptInput({
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
  sendCommand,
}) {
  const { showAgents, setShowAgents } = useAvailableAgents();
  const { showSlashCommand, setShowSlashCommand } = useSlashCommands();
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const [_, setFocused] = useState(false);

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
    if (isMobile) return false;
    const element = event.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
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
        className="flex flex-col gap-y-1 rounded-t-lg md:w-3/4 w-full mx-auto max-w-xl"
      >
        <div className="flex items-center rounded-lg md:mb-4">
          <div className="w-[600px] bg-main-gradient shadow-2xl border border-white/50 rounded-2xl flex flex-col px-4 overflow-hidden">
            <div className="flex items-center w-full border-b-2 border-gray-500/50">
              <textarea
                ref={textareaRef}
                onChange={(e) => {
                  onChange(e);
                  watchForSlash(e);
                  watchForAt(e);
                  adjustTextArea(e);
                }}
                onKeyDown={captureEnter}
                required={true}
                disabled={inputDisabled}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={message}
                className="cursor-text max-h-[100px] md:min-h-[40px] mx-2 md:mx-0 py-2 w-full text-[16px] md:text-md text-white bg-transparent placeholder:text-white/60 resize-none active:outline-none focus:outline-none flex-grow"
                placeholder={"Send a message"}
              />
              {buttonDisabled ? (
                <StopGenerationButton />
              ) : (
                <button
                  ref={formRef}
                  type="submit"
                  className="inline-flex justify-center rounded-2xl cursor-pointer text-white/60 hover:text-white group ml-4"
                >
                  <PaperPlaneRight className="w-7 h-7 my-3" weight="fill" />
                  <span className="sr-only">Send message</span>
                </button>
              )}
            </div>
            <div className="flex justify-between py-3.5">
              <div className="flex gap-x-2">
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
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
