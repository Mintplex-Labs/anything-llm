const prisma = require("../utils/prisma");
const { uuidAPIKey } = require("uuid-apikey");

const Invite = {
  makeCode: () => {
    return uuidAPIKey.create().apiKey;
  },

  create: async function (createdByUserId = 0) {
    try {
      const invite = await prisma.invites.create({
        data: {
          code: this.makeCode(),
          createdBy: createdByUserId,
        },
      });
      return { invite, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE INVITE.", error.message);
      return { invite: null, error: error.message };
    }
  },

  deactivate: async function (inviteId = null) {
    try {
      const invite = await prisma.invites.update({
        where: { id: inviteId },
        data: { status: "disabled" },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  markClaimed: async function (inviteId = null, user) {
    try {
      const invite = await prisma.invites.update({
        where: { id: inviteId },
        data: { status: "claimed", claimedBy: user.id },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  get: async function (params) {
    try {
      const invite = await prisma.invites.findFirst({ where: params });
      return invite || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  count: async function (params = {}) {
    try {
      const count = await prisma.invites.count({ where: params });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (params) {
    try {
      await prisma.invites.delete({ where: params });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (params = {}, limit = null) {
    try {
      const invites = await prisma.invites.findMany({
        where: params,
        take: limit || undefined,
      });
      return invites;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  whereWithUsers: async function (params = {}, limit = null) {
    const { User } = require("./user");
    try {
      const invites = await this.where(params, limit);
      for (const invite of invites) {
        if (invite.claimedBy) {
          const acceptedUser = await User.get({ id: invite.claimedBy });
          invite.claimedBy = {
            id: acceptedUser?.id,
            username: acceptedUser?.username,
          };
        }

        if (invite.createdBy) {
          const createdUser = await User.get({ id: invite.createdBy });
          invite.createdBy = {
            id: createdUser?.id,
            username: createdUser?.username,
          };
        }
      }
      return invites;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { Invite };
