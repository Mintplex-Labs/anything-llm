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
    const approvedUsers = this.config.approved_users || [];
    const userIndex = approvedUsers.findIndex(
      (item) => item.open_id === String(userId)
    );
    if (userIndex === -1) throw new Error("User is not approved");
    const user = { ...approvedUsers[userIndex] };
    if (Object.hasOwn(updates, "workspaceSlug"))
      user.active_workspace = updates.workspaceSlug;
    if (Object.hasOwn(updates, "threadSlug"))
      user.active_thread = updates.threadSlug;
    const updatedUsers = approvedUsers.map((item, index) =>
      index === userIndex ? user : item
    );
    const result = await ExternalCommunicationConnector.updateConfig(
      this.connectorType,
      {
        approved_users: updatedUsers,
      }
    );
    if (result.error) throw new Error(result.error);
    this.config.approved_users = updatedUsers;
    return this.get(userId);
  }
}

module.exports = { ChannelStateStore };
