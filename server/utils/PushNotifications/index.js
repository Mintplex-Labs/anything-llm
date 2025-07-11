const webpush = require("web-push");
const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../../utils/http");

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
    const { User } = require("../../models/user");
    const { SystemSettings } = require("../../models/systemSettings");

    const isMultiUserMode = await SystemSettings.isMultiUserMode();
    if (isMultiUserMode) {
      const users = await User._where({ web_push_subscription_config: { not: null } });
      for (const user of users) {
        const subscription = safeJsonParse(user.web_push_subscription_config, null);
        if (subscription) this.#subscriptions.set(user.id, subscription);
      }
      this.#log(`Loaded ${this.#subscriptions.size} existing subscriptions.`);
      return;
    }

    this.#log('Loading single user mode subscriptions...');
    if (!fs.existsSync(this.primarySubscriptionPath)) return;
    const subscription = JSON.parse(fs.readFileSync(this.primarySubscriptionPath, "utf8"));
    if (subscription) this.#subscriptions.set('primary', subscription);
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
    let userId = user?.id || 'primary';
    this.#subscriptions.set(userId, subscription);

    // If this was a real user, write the subscriptions to the database
    if (!!user) {
      const { User } = require("../../models/user");
      await User._update(user.id, { web_push_subscription_config: JSON.stringify(subscription) });
      this.#log(`Registered subscription for user - ${user.id}`);
    } else {
      if (!fs.existsSync(this.primarySubscriptionPath)) fs.mkdirSync(this.primarySubscriptionPath, { recursive: true });
      fs.writeFileSync(this.primarySubscriptionPath, JSON.stringify(subscription, null, 2));
      this.#log(`Registered primary user's subscription.`);
    }
    return this;
  }

  /**
   * Send a push notification to all subscribed clients.
   * @param {"all"|number} to - The subscription to send the notification to. "all" sends to all subscriptions, a number sends subscription to specific user
   * @param {Object} payload - The payload to send to the clients.
   * @returns {void}
   */
  sendNotification(to = null, payload = {}) {
    // this.pushService.sendNotification(to || this.subscriptions, payload);
  }

  /**
   * Setup the push notification service.
   * This will generate new VAPID keys if they don't exist and save them to the storage path.
   */
  static async setupPushNotificationService() {
    const instance = PushNotifications.instance;
    const existingVapidKeys = instance.existingVapidKeys;
    if (existingVapidKeys.publicKey && existingVapidKeys.privateKey) {
      instance.pushService;
      return;
    }

    instance.#log("Generating new VAPID keys...");
    const vapidKeys = webpush.generateVAPIDKeys();
    instance.#vapidKeys.publicKey = vapidKeys.publicKey;
    instance.#vapidKeys.privateKey = vapidKeys.privateKey;
    instance.#log(`New VAPID keys generated!`);
    if (!fs.existsSync(instance.storagePath)) fs.mkdirSync(instance.storagePath, { recursive: true });
    fs.writeFileSync(
      path.resolve(instance.storagePath, `vapid-keys.json`),
      JSON.stringify(vapidKeys, null, 2)
    );


    const isMultiUserMode = await SystemSettings.isMultiUserMode();
    if (isMultiUserMode) {
      const users = await User.where({ web_push_subscription_config: { not: null } });
      // for (const user of users) {
      //   const subscription = JSON.parse(user.web_push_subscription_config);
      //   if (subscription) instance.registerSubscription(user, subscription);
      // }
    } else {

    }

    instance.pushService;
    return;
  }
}

module.exports = {
  pushNotificationService: new PushNotifications(),
  PushNotifications,
};
