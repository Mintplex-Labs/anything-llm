const webpush = require("web-push");
const fs = require("fs");
const path = require("path");
const { User } = require("../../models/user");
const { SystemSettings } = require("../../models/systemSettings");
const { safeJsonParse } = require("../http");

/**
 * For more options, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#options
 * @typedef {Object} PushNotificationPayload
 * @property {string} title - The title of the notification.
 * @property {string} body - The message of the notification.
 * @property {Object} data - Unstructured data for the notification. Use this for anything non-standard.
 * @property {string} [data.onClickUrl] - The URL to open when the notification is clicked. Note: Can be relative or absolute.
 * @property {Object[]} actions - The actions for the notification.
 * @property {string} [actions[].action] - The action to perform when the notification is clicked. Handled in the service worker.
 * @property {string} [actions[].title] - The title of the action to show in the Options dropdown
 * @property {string} image - A string containing the URL of an image to be displayed in the notification.
 */

class PushNotifications {
  static mailTo = "anythingllm@localhost";
  /**
   * @type {PushNotifications}
   */
  static instance = null;

  /**
   * The VAPID keys for the push notification service.
   * @type {{publicKey: string | null, privateKey: string | null}}
   */
  #vapidKeys = {
    publicKey: null,
    privateKey: null,
  };

  /**
   * The subscriptions for the push notification service.
   * @type {Map<string, Object>}
   */
  #subscriptions = new Map();

  constructor() {
    if (PushNotifications.instance) return PushNotifications.instance;
    PushNotifications.instance = this;
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[PushNotifications]\x1b[0m ${text}`, ...args);
  }

  get pushService() {
    try {
      const vapidKeys = this.existingVapidKeys;
      if (!vapidKeys.publicKey || !vapidKeys.privateKey)
        throw new Error(
          "VAPID keys not found. Make sure they are generated in the main process first."
        );
      webpush.setVapidDetails(
        `mailto:${this.mailTo}`,
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
      return webpush;
    } catch (e) {
      console.error("Failed to set VAPID details", e);
      return null;
    }
  }

  get storagePath() {
    return process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage`, "push-notifications")
      : path.resolve(process.env.STORAGE_DIR, "push-notifications");
  }

  get primarySubscriptionPath() {
    return path.resolve(this.storagePath, `primary-subscription.json`);
  }

  get existingVapidKeys() {
    // Already loaded and binded to the instance
    if (this.#vapidKeys.publicKey && this.#vapidKeys.privateKey)
      return this.#vapidKeys;

    const vapidKeysPath = path.resolve(this.storagePath, `vapid-keys.json`);
    if (!fs.existsSync(vapidKeysPath))
      return { publicKey: null, privateKey: null };

    const existingVapidKeys = JSON.parse(
      fs.readFileSync(vapidKeysPath, "utf8")
    );
    this.#log(`Loaded existing VAPID keys!`);
    this.#vapidKeys.publicKey = existingVapidKeys.publicKey;
    this.#vapidKeys.privateKey = existingVapidKeys.privateKey;
    return this.#vapidKeys;
  }

  get publicVapidKey() {
    return this.existingVapidKeys.publicKey;
  }

  /**
   * Load the subscriptions for the push notification service.
   * In single user mode, the subscription is stored in the primary-subscription.json file.
   * In multi user mode, the subscriptions are stored in the database so we grab them from there
   * and store them in the #subscriptions map for reference later.
   * @returns {Promise<void>}
   */
  async loadSubscriptions() {
    const isMultiUserMode = await SystemSettings.isMultiUserMode();
    if (isMultiUserMode) {
      const users = await User._where({
        web_push_subscription_config: { not: null },
      });
      for (const user of users) {
        const subscription = safeJsonParse(
          user.web_push_subscription_config,
          null
        );
        if (subscription) this.#subscriptions.set(user.id, subscription);
      }
      this.#log(`Loaded ${this.#subscriptions.size} existing subscriptions.`);
      return;
    }

    this.#log("Loading single user mode subscriptions...");
    if (!fs.existsSync(this.primarySubscriptionPath)) return;
    const subscription = JSON.parse(
      fs.readFileSync(this.primarySubscriptionPath, "utf8")
    );
    if (subscription) this.#subscriptions.set("primary", subscription);
    this.#log(`Loaded primary user's existing subscription.`);
  }

  /**
   * Register a new subscription for a user.
   * In single user mode, the userId is mapped to "primary"
   * In multi user mode, the userId is the user's id in the database
   *
   * @param {Object|null} user - The user to register the subscription for.
   * @param {Object} subscription - The subscription to register.
   * @returns {Promise<PushNotifications>}
   */
  async registerSubscription(user = null, subscription) {
    let userId = user?.id || "primary";
    this.#subscriptions.set(userId, subscription);

    // If this was a real user, write the subscription to the database
    if (!!user) {
      await User._update(user.id, {
        web_push_subscription_config: JSON.stringify(subscription),
      });
      this.#log(`Registered or updated subscription for user - ${user.id}`);
    } else {
      if (!fs.existsSync(this.storagePath))
        fs.mkdirSync(this.storagePath, { recursive: true });
      fs.writeFileSync(
        this.primarySubscriptionPath,
        JSON.stringify(subscription, null, 2)
      );
      this.#log(`Registered or updated primary user's subscription.`);
    }
    return this;
  }

  /**
   * Send a push notification to all subscribed clients.
   * @param {Object} options - The options for the notification.
   * @param {"primary"|number} [options.to] - The subscription to send the notification to. "all" sends to all subscriptions, "primary" sends to the primary user (single user mode only), a number sends subscription to specific user
   * @param {PushNotificationPayload} [options.payload] - The payload to send to the clients.
   * @returns {void}
   */
  sendNotification({ to = "primary", payload = {} } = {}) {
    if (this.#subscriptions.size === 0)
      return this.#log(".sendNotification() - No subscriptions found");
    if (!this.#subscriptions.has(to))
      return this.#log(
        `.sendNotification() - Subscription for user ${to} not found`
      );
    this.#log(`.sendNotification() - Sending notification to user ${to}`);
    this.pushService.sendNotification(
      this.#subscriptions.get(to),
      JSON.stringify(payload)
    );
  }

  /**
   * Setup the push notification service.
   * This will generate new VAPID keys if they don't exist and save them to the storage path.
   * It will also load the subscriptions from the database or the primary-subscription.json file.
   * @returns {Promise<void>}
   */
  static async setupPushNotificationService() {
    const instance = PushNotifications.instance;
    const existingVapidKeys = instance.existingVapidKeys;

    if (!existingVapidKeys.publicKey || !existingVapidKeys.privateKey) {
      instance.#log("Generating new VAPID keys...");
      const vapidKeys = webpush.generateVAPIDKeys();
      instance.#vapidKeys.publicKey = vapidKeys.publicKey;
      instance.#vapidKeys.privateKey = vapidKeys.privateKey;
      instance.#log(`New VAPID keys generated!`);
      if (!fs.existsSync(instance.storagePath))
        fs.mkdirSync(instance.storagePath, { recursive: true });
      fs.writeFileSync(
        path.resolve(instance.storagePath, `vapid-keys.json`),
        JSON.stringify(vapidKeys, null, 2)
      );
    }

    await instance.loadSubscriptions();
    instance.pushService;
    return;
  }
}

module.exports = {
  pushNotificationService: new PushNotifications(),
  PushNotifications,
};
