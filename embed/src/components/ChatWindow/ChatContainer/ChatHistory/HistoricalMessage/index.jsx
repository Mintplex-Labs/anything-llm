import React, { memo, forwardRef } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";
import { formatDate } from "@/utils/date";

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = forwardRef(
  (
    { uuid = v4(), message, role, sources = [], error = false, sentAt },
    ref
  ) => {
    return (
      <div className="py-[5px]">
        {role === "assistant" && (
          <div
            className={`text-[10px] font-medium text-gray-400 ml-[54px] mr-6 mb-2 text-left`}
          >
            AnythingLLM Chat Assistant
          </div>
        )}
        <div
          key={uuid}
          ref={ref}
          className={`flex items-start w-full h-fit ${
            role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {role === "assistant" && (
            <img
              src={AnythingLLMIcon}
              alt="Anything LLM Icon"
              className="w-9 h-9 flex-shrink-0 ml-2 mt-2"
            />
          )}
          <div
            style={{ wordBreak: "break-word" }}
            className={`py-[11px] px-4 flex flex-col ${
              error
                ? "bg-red-200 rounded-lg mr-[37px] ml-[9px]"
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
          </div>
        </div>

        {sentAt && (
          <div
            className={`text-[10px] font-medium text-gray-400 ml-[54px] mr-6 mt-2 ${role === "user" ? "text-right" : "text-left"}`}
          >
            {formatDate(sentAt)}
          </div>
        )}
      </div>
    );
  }
);

export default memo(HistoricalMessage);
