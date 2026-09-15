const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");

class ChannelStateStore {
  constructor({ connectorType, config }) {
    this.connectorType = connectorType;
    this.config = config;
  }

  get(userId) {
    const user = (this.config.approved_users || []).find(
      (item) => item.open_id === String(userId)
    );
    if (!user) return null;
    return {
      workspaceSlug: user.active_workspace || this.config.default_workspace,
      threadSlug: user.active_thread || null,
    };
  }

  async set(userId, updates) {
    const user = (this.config.approved_users || []).find(
      (item) => item.open_id === String(userId)
    );
    if (!user) throw new Error("User is not approved");
    if (Object.hasOwn(updates, "workspaceSlug"))
      user.active_workspace = updates.workspaceSlug;
    if (Object.hasOwn(updates, "threadSlug")) user.active_thread = updates.threadSlug;
    await ExternalCommunicationConnector.updateConfig(this.connectorType, {
      approved_users: this.config.approved_users,
    });
    return this.get(userId);
  }
}

module.exports = { ChannelStateStore };
