import { CircleNotch, PaperPlaneRight } from "@phosphor-icons/react";
import React, { useState, useRef } from "react";

export default function PromptInput({
  setttings,
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
}) {
  const formRef = useRef(null);
  const [_, setFocused] = useState(false);

  const handleSubmit = (e) => {
    setFocused(false);
    submit(e);
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
    <div className="w-full absolute left-0 bottom-[5px] z-10 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-1 rounded-t-lg w-full items-center justify-center"
      >
        <div className="flex items-center rounded-lg">
          <div className="bg-white border border-white/50 rounded-2xl flex flex-col px-4 overflow-hidden">
            <div className="flex items-center w-full">
              <textarea
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
              />
              <button
                ref={formRef}
                type="submit"
                disabled={buttonDisabled}
                className="inline-flex justify-center rounded-2xl cursor-pointer text-black group ml-4"
              >
                {buttonDisabled ? (
                  <CircleNotch className="w-4 h-4 animate-spin" />
                ) : (
                  <PaperPlaneRight className="w-4 h-4 my-3" weight="fill" />
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
