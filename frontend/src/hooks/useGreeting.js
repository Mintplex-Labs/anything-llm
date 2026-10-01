import { useState } from "react";
import { useTranslation } from "react-i18next";

function timeOfDay() {
  const hour = new Date().getHours();
  if (hour < 4 || hour >= 23) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/**
 * Picks the headline for an empty chat from `main-page.greetings` - the current
 * time of day lines share a pool with the `anytime` ones so it doesn't feel
 * repetitive. Picked once per mount, so each visit to an empty chat can differ.
 * @returns {string}
 */
export default function useGreeting() {
  const { t } = useTranslation();
  const [seed] = useState(Math.random);

  const options = [timeOfDay(), "anytime"].flatMap((bucket) => {
    const lines = t(`main-page.greetings.${bucket}`, { returnObjects: true });
    // A missing key hands back the key string instead of the object of lines,
    // and untranslated lines are null - either way fall back to `greeting`.
    return lines && typeof lines === "object"
      ? Object.values(lines).filter(Boolean)
      : [];
  });

  return options.length
    ? options[Math.floor(seed * options.length)]
    : t("main-page.greeting");
}
