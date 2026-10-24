import { useTranslation } from "react-i18next";
import { ClockCounterClockwise } from "@phosphor-icons/react";
import { nFormatter } from "@/utils/numbers";

/** "12 steps · 81k tokens", plus " · Continued from a previous session" for a resumed one. */
export default function UsageLabel({ session }) {
  const { t } = useTranslation();
  const tokens = session.tokens || {};
  return (
    <span className="flex items-center gap-x-1 text-xs text-zinc-400 light:text-slate-500 whitespace-nowrap">
      {t("browserUse.card.usage", {
        steps: session.stepCount || 0,
        tokens: `${tokens.estimated ? "~" : ""}${nFormatter(tokens.total || 0)}`,
      })}
      {session.resumedFrom?.id && (
        <>
          <span>·</span>
          <ClockCounterClockwise size={12} className="flex-shrink-0" />
          <span>{t("browserUse.resume.continuedFromPrevious")}</span>
        </>
      )}
    </span>
  );
}
