import { ArrowsLeftRight } from "@phosphor-icons/react";

/**
 * Ephemeral notification shown during streaming when the model router
 * routes a message to a specific model. Disappears on page refresh.
 * @param {Object} props
 * @param {Object} props.routedTo - { model, ruleTitle, isFallback, routerName, fallbackModel }
 */
export default function ModelRouteNotification({ routedTo }) {
  if (!routedTo) return null;

  const label = routedTo.isFallback
    ? `Using fallback model: ${routedTo.model}`
    : `Routed to ${routedTo.model}${routedTo.ruleTitle ? ` (rule: ${routedTo.ruleTitle})` : ""}`;

  return (
    <div className="flex justify-center w-full pr-4 my-2">
      <div className="w-full">
        <div
          style={{ borderRadius: "16px" }}
          className="relative bg-zinc-800 light:bg-slate-100 p-4"
        >
          <div className="absolute top-4 left-4 w-[18px] h-[18px] flex items-center justify-center">
            <ArrowsLeftRight
              className="w-[18px] h-[18px] text-zinc-200 light:text-slate-600"
              weight="bold"
            />
          </div>
          <div className="ml-[28px]">
            <span className="text-zinc-200 light:text-slate-800 font-mono text-sm leading-[18px] block truncate">
              {label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
