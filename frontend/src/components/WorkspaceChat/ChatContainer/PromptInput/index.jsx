import React, { useState, useRef, memo, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { Loader, Menu, X } from "react-feather";

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
    if (isMobile) return false;
    const element = event.target;
    element.style.height = "1px";
    element.style.height =
      event.target.value.length !== 0
        ? 25 + element.scrollHeight + "px"
        : "1px";
  };

  const setTextCommand = (command = "") => {
    const storageKey = `workspace_chat_mode_${workspace.slug}`;
    if (command === "/query") {
      window.localStorage.setItem(storageKey, "query");
      window.dispatchEvent(new Event("workspace_chat_mode_update"));
      return;
    } else if (command === "/conversation") {
      window.localStorage.setItem(storageKey, "chat");
      window.dispatchEvent(new Event("workspace_chat_mode_update"));
      return;
    }

    onChange({ target: { value: `${command} ${message}` } });
  };

  return (
    <div className="w-full fixed md:absolute bottom-0 left-0 z-10 md:z-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-1 bg-white dark:bg-black-900 md:bg-transparent rounded-t-lg md:w-3/4 w-full mx-auto"
      >
        <div className="flex items-center py-2 px-4 rounded-lg">
          <CommandMenu
            workspace={workspace}
            show={showMenu}
            handleClick={setTextCommand}
            hide={() => setShowMenu(false)}
          />
          <button
            onClick={() => setShowMenu(!showMenu)}
            type="button"
            className="p-2 text-slate-500 bg-transparent rounded-md hover:bg-gray-200 dark:hover:bg-stone-500 dark:hover:text-slate-200"
          >
            <Menu className="w-4 h-4 md:h-6 md:w-6" />
          </button>
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
            placeholder={
              isMobile
                ? "Enter your message here."
                : "Shift + Enter for newline. Enter to submit."
            }
          />
          <button
            ref={formRef}
            type="submit"
            disabled={buttonDisabled}
            className="inline-flex justify-center p-0 md:p-2 rounded-full cursor-pointer text-black-900 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-stone-500 group"
          >
            {buttonDisabled ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : (
              <svg
                aria-hidden="true"
                className="w-6 h-6 rotate-45 fill-gray-500 dark:fill-slate-500 group-hover:dark:fill-slate-200"
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
        <Tracking workspaceSlug={workspace.slug} />
      </form>
    </div>
  );
}

const Tracking = memo(({ workspaceSlug }) => {
  const storageKey = `workspace_chat_mode_${workspaceSlug}`;
  const [chatMode, setChatMode] = useState(
    window.localStorage.getItem(storageKey) ?? "chat"
  );

  useEffect(() => {
    function watchForChatModeChange() {
      if (!workspaceSlug) return;
      window.addEventListener(`workspace_chat_mode_update`, () => {
        try {
          const chatMode = window.localStorage.getItem(storageKey);
          setChatMode(chatMode);
        } catch {}
      });
    }
    watchForChatModeChange();
  }, [workspaceSlug]);

  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-center gap-2 mb-2 px-4 mx:px-0">
      <p className="bg-gray-200 dark:bg-stone-600 text-gray-800 dark:text-slate-400 text-xs px-2 rounded-lg font-mono text-center">
        Chat mode: {chatMode}
      </p>
      <p className="text-slate-400 text-xs text-center">
        Responses from system may produce inaccurate or invalid responses - use
        with caution.
      </p>
    </div>
  );
});

function CommandMenu({ workspace, show, handleClick, hide }) {
  if (!show) return null;
  const COMMANDS = [
    {
      cmd: "/conversation",
      description: "- switch to chat mode (remembers recent chat history) .",
    },
    {
      cmd: "/query",
      description: "- switch to query mode (does not remember previous chats).",
    },
    { cmd: "/reset", description: "- clear current chat history." },
  ];

  return (
    <div className="absolute top-[-25vh] md:top-[-23vh] min-h-[200px] flex flex-col rounded-lg border border-slate-400 p-2 pt-4 bg-gray-50 dark:bg-stone-600">
      <div className="flex justify-between items-center border-b border-slate-400 px-2 py-1 ">
        <p className="text-gray-800 dark:text-slate-200">Available Commands</p>
        <button
          type="button"
          onClick={hide}
          className="p-2 rounded-lg hover:bg-gray-200 hover:dark:bg-slate-500 rounded-full text-gray-800 dark:text-slate-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col">
        {COMMANDS.map((item, i) => {
          const { cmd, description } = item;
          return (
            <div className="border-b border-slate-400 p-1">
              <button
                key={i}
                type="button"
                onClick={() => {
                  handleClick(cmd);
                  hide();
                }}
                className="w-full px-4 py-2 flex items-center rounded-lg hover:bg-gray-300 hover:dark:bg-slate-500 gap-x-1 disabled:cursor-not-allowed"
              >
                <p className="text-gray-800 dark:text-slate-200 font-semibold">
                  {cmd}
                </p>
                <p className="text-gray-800 dark:text-slate-300 text-sm">
                  {description}
                </p>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
