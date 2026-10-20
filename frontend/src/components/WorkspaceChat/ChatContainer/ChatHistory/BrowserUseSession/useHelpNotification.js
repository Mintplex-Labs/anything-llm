import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const supported = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  window.isSecureContext;

const notLooking = () =>
  document.visibilityState === "hidden" || !document.hasFocus();

/**
 * A browser notification when the agent asks for help while this tab is not in front, since a
 * session can run long and then wait up to 15 minutes. Clicking it brings back this tab and the
 * card - the session lives on this tab's socket, so a new tab would not reach it.
 *
 * Permission is first asked when the first help request arrives, never before. Browsers that only
 * ask on a click (Firefox, Safari) get asked on the person's first click in the card instead.
 * @param {Object} session - the live session snapshot
 * @param {string} cardId - id of the card element to scroll to
 * @returns {() => void} call from a click in the card, to ask where asking needs one
 */
export default function useHelpNotification(session, cardId) {
  const { t } = useTranslation();
  const needsHelp = session.status === "needs-help";
  const shown = useRef(null);
  // The latest snapshot, for a permission answer that arrives after the question changed.
  const latest = useRef(session);
  useEffect(() => {
    latest.current = session;
  });

  const notify = () => {
    if (!supported() || Notification.permission !== "granted") return;
    if (!notLooking() || latest.current.status !== "needs-help") return;
    shown.current?.close();
    const notification = new Notification(t("browserUse.card.needsHelp"), {
      body: String(latest.current.question || "").slice(0, 200),
      icon: "/favicon.png",
      tag: `browser-use-${latest.current.sessionId}`,
      requireInteraction: true,
    });
    notification.onclick = () => {
      window.focus();
      document
        .getElementById(cardId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      notification.close();
    };
    shown.current = notification;
  };

  const askPermission = () => {
    if (!supported() || Notification.permission !== "default") return;
    Notification.requestPermission()
      .then((permission) => permission === "granted" && notify())
      .catch(() => {});
  };

  useEffect(() => {
    if (!needsHelp) return;
    askPermission();
    notify();
    return () => {
      shown.current?.close();
      shown.current = null;
    };
  }, [needsHelp]);

  return askPermission;
}
