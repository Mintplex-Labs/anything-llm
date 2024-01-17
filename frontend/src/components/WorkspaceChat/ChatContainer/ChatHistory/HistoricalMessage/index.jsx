import React, { memo, forwardRef, useState } from "react";
import { Copy, Warning, Check } from "@phosphor-icons/react";
import Jazzicon from "../../../../UserIcon";
import renderMarkdown from "@/utils/chat/markdown";
import { userFromStorage } from "@/utils/request";
import Citations from "../Citation";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);

const HistoricalMessage = forwardRef(
  (
    { uuid = v4(), message, role, workspace, sources = [], error = false },
    ref
  ) => {
    const [hasCopied, setHasCopied] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleCopy = async () => {
      await navigator.clipboard.writeText(message);
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
        setShowTooltip(false);
      }, 2500);
    };

    return (
      <div
        key={uuid}
        ref={ref}
        className={`flex justify-center items-end w-full ${
          role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
        }`}
      >
        <div
          className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon
              size={36}
              user={{
                uid:
                  role === "user"
                    ? userFromStorage()?.username
                    : workspace.slug,
              }}
              role={role}
            />

            {error ? (
              <span
                className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}
              >
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
            ) : (
              <div>
                <span
                  className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(renderMarkdown(message)),
                  }}
                />
                {role === "assistant" && (
                  <div className="mt-4 relative">
                    <button
                      className="text-white"
                      onClick={handleCopy}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      {hasCopied ? (
                        <Check
                          className="text-green-300 h-4 w-4 mb-1 inline-block"
                          weight="bold"
                        />
                      ) : (
                        <Copy
                          className="h-4 w-4 mb-1 inline-block"
                          weight={showTooltip ? "fill" : "bold"}
                        />
                      )}
                    </button>
                    {(showTooltip || hasCopied) && (
                      <span className="absolute top-full -translate-x-1/2 mt-3 bg-black text-white text-xs py-1 px-3 rounded-md -translate-y-2">
                        {hasCopied ? "Copied!" : "Copy"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {role === "assistant" && <Citations sources={sources} />}
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);
