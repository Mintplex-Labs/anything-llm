import React, { memo, forwardRef } from "react";
import { Warning } from "@phosphor-icons/react";
// import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = forwardRef(
  ({ uuid = v4(), message, role, sources = [], error = false }, ref) => {
    return (
      <div
        key={uuid}
        ref={ref}
        className={`flex items-end w-full h-fit ${
          role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        {role === "assistant" && (
          <img
            src={AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="w-9 h-9 flex-shrink-0 ml-2"
          />
        )}
        <div
          style={{ wordBreak: "break-word" }}
          className={`py-[11px] px-4 flex flex-col ${
            error
              ? "bg-red-200"
              : role === "user"
                ? embedderSettings.USER_STYLES
                : embedderSettings.ASSISTANT_STYLES
          } shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
        >
          <div className="flex">
            {error ? (
              <div className="p-2 rounded-lg bg-red-50 text-red-500">
                <span className={`inline-block `}>
                  <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                  respond to message.
                </span>
                <p className="text-xs font-mono mt-2 border-l-2 border-red-500 pl-2 bg-red-300 p-2 rounded-sm">
                  {error}
                </p>
              </div>
            ) : (
              <span
                className={`whitespace-pre-line font-medium flex flex-col gap-y-1 text-sm leading-[20px]`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(renderMarkdown(message)),
                }}
              />
            )}
          </div>
          {/* {role === "assistant" && !error && (
            <div className="flex gap-x-5">
              <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
              <Actions message={DOMPurify.sanitize(message)} />
            </div>
          )} */}
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);
