import { useEffect } from "react";
import { API_BASE } from "../utils/constants";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * Subscribes to push notifications for the current client - can be called multiple times without re-subscribing
 * or generating infinite tokens.
 * @returns {void}
 */
export async function subscribeToPushNotifications() {
  try {
    if (sessionStorage.getItem("push-notifications-subscribed"))
      return console.log(
        "useWebPushNotifications: Push notifications already subscribed for this session"
      );

    const { publicKey } = await fetch(`${API_BASE}/push-public-key`).then(
      (res) => res.json()
    );
    if (!publicKey)
      return console.log(
        "useWebPushNotifications: No public key found or generated"
      );
    navigator.serviceWorker
      .register("/service-workers/push-notifications.js")
      .then((swReg) => {
        swReg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          })
          .then((subscription) => {
            fetch(`${API_BASE}/subscribe`, {
              method: "POST",
              body: JSON.stringify(subscription),
              headers: {
                "Content-Type": "application/json",
              },
            });
            sessionStorage.setItem("push-notifications-subscribed", "true");
          });
      });
  } catch (error) {
    console.error(
      "useWebPushNotifications: Error subscribing to push notifications",
      error
    );
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
