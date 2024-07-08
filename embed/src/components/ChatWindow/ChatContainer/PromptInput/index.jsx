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
    <div className="allm-w-full allm-sticky allm-bottom-0 allm-z-10 allm-flex allm-justify-center allm-items-center allm-bg-white">
      <form
        onSubmit={handleSubmit}
        className="allm-flex allm-flex-col allm-gap-y-1 allm-rounded-t-lg allm-w-full allm-items-center allm-justify-center"
      >
        <div className="allm-flex allm-items-center allm-w-full">
          <div className="allm-bg-white allm-flex allm-flex-col allm-px-4 allm-overflow-hidden allm-w-full">
            <div
              style={{ border: "1.5px solid #22262833" }}
              className="allm-flex allm-items-center allm-w-full allm-rounded-2xl"
            >
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
                className="allm-font-sans allm-border-none allm-cursor-text allm-max-h-[100px] allm-text-[14px] allm-mx-2 allm-py-2 allm-w-full allm-text-black allm-bg-transparent placeholder:allm-text-slate-800/60 allm-resize-none active:allm-outline-none focus:allm-outline-none allm-flex-grow"
                placeholder={"Send a message"}
                id="message-input"
              />
              <button
                ref={formRef}
                type="submit"
                disabled={buttonDisabled}
                className="allm-bg-transparent allm-border-none allm-inline-flex allm-justify-center allm-rounded-2xl allm-cursor-pointer allm-text-black group"
                id="send-message-button"
                aria-label="Send message"
              >
                {buttonDisabled ? (
                  <CircleNotch className="allm-w-4 allm-h-4 allm-animate-spin" />
                ) : (
                  <PaperPlaneRight
                    size={24}
                    className="allm-my-3 allm-text-[#22262899]/60 group-hover:allm-text-[#22262899]/90"
                    weight="fill"
                  />
                )}
                <span className="allm-sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
