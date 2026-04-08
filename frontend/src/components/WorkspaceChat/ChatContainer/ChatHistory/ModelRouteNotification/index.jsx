import { ArrowsLeftRight } from "@phosphor-icons/react";

/**
 * Ephemeral notification shown during streaming when the model router
 * switches to a different model via a matched rule. Disappears on page refresh.
 * @param {Object} props
 * @param {Object} props.routedTo - { model, ruleTitle, routerName }
 * @param {boolean} [props.isStreaming] - whether the response is still streaming
 */
export default function ModelRouteNotification({ routedTo, isStreaming }) {
  if (!routedTo) return null;

  return (
    <div className="flex w-full my-2">
      <div className="relative rounded-full p-[1.5px] overflow-hidden">
        {isStreaming && (
          <div className="absolute inset-0 h-full w-full rounded-full bg-[conic-gradient(from_0deg,transparent,#0ea5e9_10%,transparent_20%)] animate-border-spin" />
        )}
        <div className="relative rounded-full bg-zinc-800 light:bg-slate-100 px-3 py-1.5 flex items-center gap-2">
          <ArrowsLeftRight
            className="w-3.5 h-3.5 text-sky-400 light:text-sky-600 flex-shrink-0"
            weight="bold"
          />
          <span className="text-xs text-zinc-300 light:text-slate-600 whitespace-nowrap">
            Routed to{" "}
            <span className="font-semibold text-white light:text-slate-900">
              {routedTo.model}
            </span>
            {routedTo.ruleTitle && (
              <span className="text-zinc-400 light:text-slate-500">
                {" "}
                via {routedTo.ruleTitle}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
