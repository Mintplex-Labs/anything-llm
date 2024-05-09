import { CircleNotch, PaperPlaneRight } from "@phosphor-icons/react";
import React, { useState, useRef, useEffect } from "react";

export default function PromptInput({
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
}) {
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
    element.style.height =
      event.target.value.length !== 0 ? element.scrollHeight + "px" : "auto";
  };

  return (
    <div className="w-full sticky bottom-0 z-10 flex justify-center items-center px-5 bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-1 rounded-t-lg w-full items-center justify-center"
      >
        <div className="flex items-center w-full">
          <div className="bg-white border-[1.5px] border-[#22262833]/20 rounded-2xl flex flex-col px-4 overflow-hidden w-full">
            <div className="flex items-center w-full">
              <textarea
                ref={textareaRef}
                onKeyUp={adjustTextArea}
                onKeyDown={captureEnter}
                onChange={onChange}
                required={true}
                disabled={inputDisabled}
                onFocus={() => setFocused(true)}
                onBlur={(e) => {
                  setFocused(false);
                  adjustTextArea(e);
                }}
                value={message}
                className="cursor-text max-h-[100px] text-[14px] mx-2 py-2 w-full text-black bg-transparent placeholder:text-slate-800/60 resize-none active:outline-none focus:outline-none flex-grow"
                placeholder={"Send a message"}
                id="message-input"
              />
              <button
                ref={formRef}
                type="submit"
                disabled={buttonDisabled}
                className="inline-flex justify-center rounded-2xl cursor-pointer text-black group ml-4"
                id="send-message-button"
                aria-label="Send message"
              >
                {buttonDisabled ? (
                  <CircleNotch className="w-4 h-4 animate-spin" />
                ) : (
                  <PaperPlaneRight
                    size={24}
                    className="my-3 text-[#22262899]/60 group-hover:text-[#22262899]/90"
                    weight="fill"
                  />
                )}
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
