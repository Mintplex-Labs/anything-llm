const { v4 } = require("uuid");
const { SystemSettings } = require("./systemSettings");

const Telemetry = {
  // Write-only key. It can't read events or any of your other data, so it's safe to use in public apps.
  pubkey: "phc_9qu7QLpV8L84P3vFmEiZxL020t2EqIubP7HHHxrSsqS",
  stubDevelopmentEvents: true, // [DO NOT TOUCH] Core team only.
  label: "telemetry_id",

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

  sendTelemetry: async function (
    event,
    eventProperties = {},
    subUserId = null
  ) {
    try {
      const { client, distinctId: systemId } = await this.connect();
      if (!client) return;
      const distinctId = !!subUserId ? `${systemId}::${subUserId}` : systemId;
      const properties = { ...eventProperties, runtime: this.runtime() };
      console.log(`\x1b[32m[TELEMETRY SENT]\x1b[0m`, {
        event,
        distinctId,
        properties,
      });
      client.capture({
        event,
        distinctId,
        properties,
      });
    } catch {
      return;
    }
  },

  flush: async function () {
    const client = this.client();
    if (!client) return;
    await client.shutdownAsync();
  },

  setUid: async function () {
    const newId = v4();
    await SystemSettings.updateSettings({ [this.label]: newId });
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
