import { useEffect } from "react";
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const PUSH_PUBKEY_URL = `${API_BASE}/utils/web-push/pubkey`;
const PUSH_USER_SUBSCRIBE_URL = `${API_BASE}/utils/web-push/subscribe`;

function log(message, ...args) {
  if (typeof message === 'object') message = JSON.stringify(message, null, 2);
  console.log(`[useWebPushNotifications] ${message}`, ...args);
}

/**
 * Subscribes to push notifications for the current client - can be called multiple times without re-subscribing
 * or generating infinite tokens.
 * @returns {void}
 */
export async function subscribeToPushNotifications() {
  try {
    if (sessionStorage.getItem("push-notifications-subscribed")) {
      log("Push notifications already subscribed for this session");
      return;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      log("Push notifications not supported");
      return;
    }

    // Check current permission status
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      log("Notification permission not granted");
      return;
    }

    const publicKey = await fetch(PUSH_PUBKEY_URL, { headers: baseHeaders() })
      .then((res) => res.json())
      .then(({ publicKey }) => {
        if (!publicKey) throw new Error("No public key found or generated");
        return publicKey;
      })
      .catch(() => null);

    if (!publicKey) return log("No public key found or generated");

    const swReg = await navigator.serviceWorker.register("/service-workers/push-notifications.js");

    log({
      installing: swReg.installing,
      waiting: swReg.waiting,
      active: swReg.active,
    })

    if (swReg.installing) {
      await new Promise((resolve) => {
        swReg.installing.addEventListener('statechange', () => {
          if (swReg.installing?.state === 'activated') resolve();
        });
      });
    } else if (swReg.waiting) {
      await new Promise((resolve) => {
        swReg.waiting.addEventListener('statechange', () => {
          if (swReg.waiting?.state === 'activated') resolve();
        });
      });
    }

    log({ isactive: swReg.active, hasPushManager: !!swReg.pushManager });

    const subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch(PUSH_USER_SUBSCRIBE_URL, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: baseHeaders(),
    });

    sessionStorage.setItem("push-notifications-subscribed", "true");
  } catch (error) {
    log("Error subscribing to push notifications", error);
  }
}

/**
 * Hook that registers a service worker for push notifications.
 * @returns {void}
 */
export default function useWebPushNotifications() {
  useEffect(() => {
    subscribeToPushNotifications();
  }, []);
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}