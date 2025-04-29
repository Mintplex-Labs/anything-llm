const { v4 } = require("uuid");
const { SystemSettings } = require("./systemSettings");

// Map of events and last sent time to check if the event is on cooldown
// This will be cleared on server restart - but that is fine since it is mostly to just
// prevent spamming the logs.
const TelemetryCooldown = new Map();

const Telemetry = {
  // Write-only key. It can't read events or any of your other data, so it's safe to use in public apps.
  pubkey: "phc_9qu7QLpV8L84P3vFmEiZxL020t2EqIubP7HHHxrSsqS",
  stubDevelopmentEvents: true, // [DO NOT TOUCH] Core team only.
  label: "telemetry_id",
  /* 
  Key value pairs of events that should be debounced to prevent spamming the logs.
  This should be used for events that could be triggered in rapid succession that are not useful to atomically log.
  The value is the number of seconds to debounce the event
  */
  debounced: {
    sent_chat: 1800,
    agent_chat_sent: 1800,
    agent_chat_started: 1800,
    agent_tool_call: 1800,

    // Document mgmt events
    document_uploaded: 30,
    documents_embedded_in_workspace: 30,
    link_uploaded: 30,
    raw_document_uploaded: 30,
  },

  id: async function () {
    const result = await SystemSettings.get({ label: this.label });
    return result?.value || null;
  },

  connect: async function () {
    const client = this.client();
    const distinctId = await this.findOrCreateId();
    return { client, distinctId };
  },

  isDev: function () {
    return process.env.NODE_ENV === "development" && this.stubDevelopmentEvents;
  },

  client: function () {
    if (process.env.DISABLE_TELEMETRY === "true" || this.isDev()) return null;
    const { PostHog } = require("posthog-node");
    return new PostHog(this.pubkey);
  },

  runtime: function () {
    if (process.env.ANYTHING_LLM_RUNTIME === "docker") return "docker";
    if (process.env.NODE_ENV === "production") return "production";
    return "other";
  },

  /**
   * Checks if the event is on cooldown
   * @param {string} event - The event to check
   * @returns {boolean} - True if the event is on cooldown, false otherwise
   */
  isOnCooldown: function (event) {
    // If the event is not debounced, return false
    if (!this.debounced[event]) return false;

    // If the event is not in the cooldown map, return false
    const lastSent = TelemetryCooldown.get(event);
    if (!lastSent) return false;

    // If the event is in the cooldown map, check if it has expired
    const now = Date.now();
    const cooldown = this.debounced[event] * 1000;
    return now - lastSent < cooldown;
  },

  /**
   * Marks the event as on cooldown - will check if the event is debounced first
   * @param {string} event - The event to mark
   */
  markOnCooldown: function (event) {
    if (!this.debounced[event]) return;
    TelemetryCooldown.set(event, Date.now());
  },

  sendTelemetry: async function (
    event,
    eventProperties = {},
    subUserId = null,
    silent = false
  ) {
    try {
      const { client, distinctId: systemId } = await this.connect();
      if (!client) return;
      const distinctId = !!subUserId ? `${systemId}::${subUserId}` : systemId;
      const properties = { ...eventProperties, runtime: this.runtime() };

      // If the event is on cooldown, return
      if (this.isOnCooldown(event)) return;

      // Silence some events to keep logs from being too messy in production
      // eg: Tool calls from agents spamming the logs.
      if (!silent) {
        console.log(`\x1b[32m[TELEMETRY SENT]\x1b[0m`, {
          event,
          distinctId,
          properties,
        });
      }

      client.capture({
        event,
        distinctId,
        properties,
      });
    } catch {
      return;
    } finally {
      // Mark the event as on cooldown if needed
      this.markOnCooldown(event);
    }
  },

  flush: async function () {
    const client = this.client();
    if (!client) return;
    await client.shutdownAsync();
  },

  setUid: async function () {
    const newId = v4();
    await SystemSettings._updateSettings({ [this.label]: newId });
    return newId;
  },

  findOrCreateId: async function () {
    let currentId = await this.id();
    if (currentId) return currentId;

    currentId = await this.setUid();
    return currentId;
  },
};

module.exports = { Telemetry };
