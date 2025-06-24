const webpush = require("web-push");
const fs = require("fs");
const path = require("path");

class PushNotifications {
  static mailTo = 'anythingllm@localhost';
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
   * @type {Array<{Object}>}
   */
  #subscriptions = [];

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
      if (!vapidKeys.publicKey || !vapidKeys.privateKey) throw new Error('VAPID keys not found. Make sure they are generated in the main process first.');
      webpush.setVapidDetails(
        `mailto:${this.mailTo}`,
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );
      return webpush;
    } catch (e) {
      console.error('Failed to set VAPID details', e);
      return null;
    }
  }

  get storagePath() {
    return process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage`, 'push-notifications')
      : path.resolve(process.env.STORAGE_DIR, 'push-notifications');
  }

  get existingVapidKeys() {
    // Already loaded and binded to the instance
    if (this.#vapidKeys.publicKey && this.#vapidKeys.privateKey) return this.#vapidKeys;

    const vapidKeysPath = path.resolve(this.storagePath, `vapid-keys.json`);
    if (!fs.existsSync(vapidKeysPath)) return { publicKey: null, privateKey: null };

    const existingVapidKeys = JSON.parse(fs.readFileSync(vapidKeysPath, 'utf8'));
    this.#log(`Loaded existing VAPID keys!`);
    this.#vapidKeys.publicKey = existingVapidKeys.publicKey;
    this.#vapidKeys.privateKey = existingVapidKeys.privateKey;
    return this.#vapidKeys;
  }

  get publicVapidKey() {
    return this.existingVapidKeys.publicKey;
  }

  get subscriptions() {
    if (!fs.existsSync(path.resolve(this.storagePath, `subscriptions.json`))) return [];
    const currentSubscriptions = JSON.parse(fs.readFileSync(path.resolve(this.storagePath, `subscriptions.json`), 'utf8'));
    this.#subscriptions = currentSubscriptions;
    return this.#subscriptions || [];
  }

  subscribe(subscription) {
    console.log('new subscription ===================');
    console.log(subscription);
    console.log('end subscription ===================');
    this.#subscriptions.push(subscription);

    //tmp write this
    let currentSubscriptions = []
    currentSubscriptions.push(subscription);
    fs.writeFileSync(path.resolve(this.storagePath, `subscriptions.json`), JSON.stringify(currentSubscriptions, null, 2));
    this.#subscriptions = currentSubscriptions;
    return this;
  }

  /**
   * Setup the push notification service.
   * This will generate new VAPID keys if they don't exist and save them to the storage path.
   */
  static setupPushNotificationService() {
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
    fs.writeFileSync(path.resolve(instance.storagePath, `vapid-keys.json`), JSON.stringify(vapidKeys, null, 2));

    instance.pushService;
    return;
  }
}

module.exports = {
  pushNotificationService: new PushNotifications(),
  PushNotifications,
};