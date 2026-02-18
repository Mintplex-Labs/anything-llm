import { useEffect } from "react";
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const PUSH_PUBKEY_URL = `${API_BASE}/web-push/pubkey`;
const PUSH_USER_SUBSCRIBE_URL = `${API_BASE}/web-push/subscribe`;

// If you update the service worker, increment this version or else
// the service worker will not be updated with new changes -
// Its version ID is independent of the app version to prevent reloading
// or cache busting when not needed.
const SW_VERSION = "1.0.0";

function log(message, ...args) {
  if (typeof message === "object") message = JSON.stringify(message, null, 2);
  console.log(`[useWebPushNotifications] ${message}`, ...args);
}

/**
 * Subscribes to push notifications for the current client - can be called multiple times without re-subscribing
 * or generating infinite tokens.
 * @returns {void}
 */
export async function subscribeToPushNotifications() {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      log("Push notifications not supported");
      return;
    }

    // Check current permission status
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
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

    const swReg = await navigator.serviceWorker.register(
      `/service-workers/push-notifications.js?v=${SW_VERSION}`
    );

    // Check for updates
    swReg.addEventListener("updatefound", () => {
      const newWorker = swReg.installing;
      log("Service worker update found");

      newWorker.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          // New service worker is installed and ready
          log("New service worker installed, ready to activate");

          // Optionally show a notification to the user
          if (confirm("A new version is available. Reload to update?")) {
            window.location.reload();
          }
        }
      });
    });

    // Handle service worker updates
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      log("Service worker controller changed");
    });

    if (swReg.installing) {
      await new Promise((resolve) => {
        swReg.installing.addEventListener("statechange", () => {
          if (swReg.installing?.state === "activated") resolve();
        });
      });
    } else if (swReg.waiting) {
      await new Promise((resolve) => {
        swReg.waiting.addEventListener("statechange", () => {
          if (swReg.waiting?.state === "activated") resolve();
        });
      });
    }

    const subscription = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    await fetch(PUSH_USER_SUBSCRIBE_URL, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: baseHeaders(),
    });
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
