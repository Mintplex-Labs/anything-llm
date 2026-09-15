const crypto = require("crypto");
const {
  ExternalCommunicationConnector,
} = require("../../models/externalCommunicationConnector");

const DEFAULT_TTL_MS = 10 * 60 * 1000;
const MAX_PENDING_PAIRINGS = 10;

class PairingAccess {
  constructor({
    connectorType,
    pendingPairings = new Map(),
    ttlMs = DEFAULT_TTL_MS,
    now = () => Date.now(),
  }) {
    this.connectorType = connectorType;
    this.pendingPairings = pendingPairings;
    this.ttlMs = ttlMs;
    this.now = now;
  }

  request(user) {
    this.purgeExpired();

    const userId = String(user.userId);
    const existing = this.pendingPairings.get(userId);
    if (existing) return { ...existing };

    this.enforcePendingCap();
    const pending = {
      userId,
      code: String(crypto.randomInt(0, 1_000_000)).padStart(6, "0"),
      name: user.name,
      platform: user.platform,
      requestedAt: this.now(),
    };
    this.pendingPairings.set(userId, pending);
    return { ...pending };
  }

  listPending() {
    this.purgeExpired();
    return [...this.pendingPairings.values()].map((pending) => ({ ...pending }));
  }

  isApproved(config, userId) {
    return (config.approved_users || []).some(
      (user) => user.open_id === String(userId)
    );
  }

  async approve(config, userId) {
    this.purgeExpired();
    const id = String(userId);
    const pending = this.pendingPairings.get(id);
    if (!pending) return { error: "Pairing request expired" };

    const approvedUsers = [...(config.approved_users || [])];
    let approved = approvedUsers.find((user) => user.open_id === id);
    if (!approved) {
      approved = {
        open_id: id,
        name: pending.name,
        platform: pending.platform,
        active_workspace: null,
        active_thread: null,
      };
      approvedUsers.push(approved);
      const result = await ExternalCommunicationConnector.updateConfig(
        this.connectorType,
        {
          approved_users: approvedUsers,
        }
      );
      if (result.error) return { error: result.error };
      config.approved_users = approvedUsers;
    }

    this.pendingPairings.delete(id);
    return approved;
  }

  deny(userId) {
    this.pendingPairings.delete(String(userId));
  }

  async revoke(config, userId) {
    const approvedUsers = (config.approved_users || []).filter(
      (user) => user.open_id !== String(userId)
    );
    const result = await ExternalCommunicationConnector.updateConfig(
      this.connectorType,
      {
        approved_users: approvedUsers,
      }
    );
    if (result.error) return { error: result.error };
    config.approved_users = approvedUsers;
  }

  purgeExpired() {
    const currentTime = this.now();
    for (const [userId, pending] of this.pendingPairings.entries()) {
      if (currentTime - pending.requestedAt >= this.ttlMs) {
        this.pendingPairings.delete(userId);
      }
    }
  }

  enforcePendingCap() {
    if (this.pendingPairings.size < MAX_PENDING_PAIRINGS) return;

    const oldest = [...this.pendingPairings.entries()].sort(
      ([, first], [, second]) => first.requestedAt - second.requestedAt
    )[0];
    if (oldest) this.pendingPairings.delete(oldest[0]);
  }
}

module.exports = { PairingAccess };
