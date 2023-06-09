import React, { useState, useRef } from "react";
import { Loader, Menu, Send, X } from "react-feather";

export default function PromptInput({
  workspace,
  message,
  submit,
  onChange,
  inputDisabled,
  buttonDisabled,
}) {
  const [showMenu, setShowMenu] = useState(false);
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
    element.style.height = "1px";
    element.style.height =
      event.target.value.length !== 0
        ? 25 + element.scrollHeight + "px"
        : "1px";
  };

  const setTextCommand = (command = "") => {
    onChange({ target: { value: `${command} ${message}` } });
  };

  return (
    <div className="w-full fixed md:absolute bottom-0 left-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-1 bg-transparentrounded-t-lg w-3/4 mx-auto"
      >
        <div className="flex items-center py-2 px-4 rounded-lg">
          {/* Toggle selector? */}
          {/* <button
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            className="p-2 text-slate-200 bg-transparent rounded-md hover:bg-gray-50 dark:hover:bg-stone-500">
            <Menu className="w-4 h-4 md:h-6 md:w-6" />
          </button> */}
          <textarea
            onKeyUp={adjustTextArea}
            onKeyDown={captureEnter}
            onChange={onChange}
            required={true}
            maxLength={240}
            disabled={inputDisabled}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              adjustTextArea(e);
            }}
            value={message}
            className="cursor-text max-h-[100px] md:min-h-[40px] block mx-2 md:mx-4 p-2.5 w-full text-[16px] md:text-sm rounded-lg border bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-stone-600 dark:border-stone-700 dark:placeholder-stone-400"
            placeholder="Shift + Enter for newline. Enter to submit."
          />
          <button
            ref={formRef}
            type="submit"
            disabled={buttonDisabled}
            className="inline-flex justify-center p-0 md:p-2 rounded-full cursor-pointer text-black-900 dark:text-slate-200 hover:bg-gray-600 dark:hover:bg-stone-500"
          >
            {buttonDisabled ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <svg
                aria-hidden="true"
                className="w-6 h-6 rotate-45"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            )}
            <span className="sr-only">Send message</span>
          </button>
        </div>
        <Tracking />
      </form>
    </div>
  );
}

const Tracking = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center gap-y-2 mb-2 px-4 mx:px-0">
      <p className="text-slate-400 text-xs">
        Responses from system may produce inaccurate or invalid responses - use
        with caution.
      </p>
    </div>
  );
};
