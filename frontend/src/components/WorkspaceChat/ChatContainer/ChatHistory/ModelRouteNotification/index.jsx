import { Shuffle } from "@phosphor-icons/react";
import RouterAnimation from "@/media/animations/router-animation.webm";
import { Trans } from "react-i18next";

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
      <div className="rounded-[20px] border border-zinc-700 light:border-slate-300 px-4 py-2 flex items-center gap-2">
        <RouterIcon isStreaming={isStreaming} />
        <span className="text-sm text-zinc-400 light:text-slate-600 whitespace-nowrap">
          {routedTo.ruleTitle ? (
            <Trans
              i18nKey="model-router.chat.routed-to-rule"
              values={{
                model: routedTo.model,
                ruleTitle: routedTo.ruleTitle,
              }}
              components={{
                route: <span className="text-zinc-50 light:text-slate-950" />,
                rule: <span />,
              }}
            />
          ) : (
            <Trans
              i18nKey="model-router.chat.routed-to"
              values={{
                model: routedTo.model,
              }}
              components={{
                route: <span className="text-zinc-50 light:text-slate-950" />,
              }}
            />
          )}
        </span>
      </div>
    </div>
  );
}

function RouterIcon({ isStreaming }) {
  if (!isStreaming)
    return (
      <Shuffle className="w-4 h-4 text-zinc-50 light:text-slate-950 flex-shrink-0" />
    );

  return (
    <video
      autoPlay
      muted
      playsInline
      className="w-4 h-4 flex-shrink-0 scale-[134%] invert light:invert-0"
      aria-label="Routing to model..."
    >
      <source src={RouterAnimation} type="video/webm" />
    </video>
  );
}
