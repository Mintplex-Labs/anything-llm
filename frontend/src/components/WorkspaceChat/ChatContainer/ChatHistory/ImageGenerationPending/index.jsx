import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CircleNotch, XCircle } from "@phosphor-icons/react";

/**
 * Placeholder shown while an `/img` generation is in progress, or after it was
 * aborted by the user. When `aborted` is true the spinner is replaced with a
 * static notice so the card doesn't stay in a loading state forever.
 */
function ImageGenerationPending({ aborted = false }) {
  const { t } = useTranslation();

  if (aborted) {
    return (
      <div className="my-2">
        <div className="w-full max-w-[280px]">
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 light:from-slate-200 light:via-slate-300 light:to-slate-100" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-3 text-center px-5">
              <XCircle
                size={32}
                weight="bold"
                className="text-white/60 light:text-slate-500"
              />
              <p className="text-white/70 light:text-slate-600 text-sm font-medium">
                {t("imageGeneration.pending.aborted")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-2">
      <div className="w-full max-w-[280px]">
        <div className="relative rounded-xl overflow-hidden aspect-square">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-600 via-zinc-800 to-zinc-900 light:from-slate-200 light:via-slate-300 light:to-slate-100 blur-2xl animate-pulse" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-3 text-center px-5">
            <CircleNotch
              size={32}
              weight="bold"
              className="animate-spin text-white light:text-slate-700"
            />
            <p className="text-white light:text-slate-800 text-sm font-semibold">
              {t("imageGeneration.pending.heading")}
            </p>
            <p className="text-white/70 light:text-slate-600 text-xs leading-relaxed">
              {t("imageGeneration.pending.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ImageGenerationPending);
