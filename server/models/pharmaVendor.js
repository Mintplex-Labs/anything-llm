const prisma = require("../utils/prisma");

const PharmaVendor = {
  /**
   * Create a new pharma vendor for a workspace.
   * @param {Object} data
   * @param {number} data.workspaceId
   * @param {string} data.name
   * @param {number} [data.userId]
   * @param {string} [data.country]
   * @param {string} [data.licenseId]
   * @param {string} [data.address]
   * @param {string} [data.contactEmail]
   * @param {string} [data.contactPhone]
   */
  create: async function (data = {}) {
    try {
      const vendor = await prisma.pharma_vendors.create({
        data: {
          workspaceId: Number(data.workspaceId),
          name: String(data.name),
          userId: data.userId ? Number(data.userId) : null,
          country: data.country || "Nigeria",
          licenseId: data.licenseId || null,
          address: data.address || null,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
        },
      });
      return { vendor, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE PHARMA VENDOR.", error.message);
      return { vendor: null, error: error.message };
    }
  },

  /**
   * Get a single vendor by clause.
   * @param {Object} clause
   */
  get: async function (clause = {}) {
    try {
      const vendor = await prisma.pharma_vendors.findFirst({
        where: clause,
      });
      return vendor || null;
    } catch (error) {
      console.error("FAILED TO GET PHARMA VENDOR.", error.message);
      return null;
    }
  },

  /**
   * Ensure there is a vendor record for the given workspace/user combo.
   * If none exists, a minimal vendor linked to the user will be created.
   * @param {number} workspaceId
   * @param {{id:number, username?:string}|null} user
   */
  ensureForUser: async function (workspaceId, user = null) {
    if (!workspaceId || !user?.id) return null;

    const existing = await this.get({
      workspaceId: Number(workspaceId),
      userId: Number(user.id),
    });
    if (existing) return existing;

    const name = user.username
      ? `Vendor - ${user.username}`
      : `Vendor-${user.id}`;
    const { vendor, error } = await this.create({
      workspaceId,
      userId: user.id,
      name,
    });
    if (error) return null;
    return vendor;
  },

  /**
   * Find many vendors.
   * @param {Object} clause
   * @param {number|null} limit
   * @param {Object|null} orderBy
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const vendors = await prisma.pharma_vendors.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return vendors;
    } catch (error) {
      console.error("FAILED TO QUERY PHARMA VENDORS.", error.message);
      return [];
    }
  },

  /**
   * Update a vendor by id.
   * @param {number} id
   * @param {Object} updates
   */
  update: async function (id = null, updates = {}) {
    if (!id) throw new Error("No pharma vendor id provided for update");

    try {
      const vendor = await prisma.pharma_vendors.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { vendor, error: null };
    } catch (error) {
      console.error("FAILED TO UPDATE PHARMA VENDOR.", error.message);
      return { vendor: null, error: error.message };
    }
  },

  /**
   * Delete vendors matching clause.
   * @param {Object} clause
   */
  delete: async function (clause = {}) {
    try {
      await prisma.pharma_vendors.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error("FAILED TO DELETE PHARMA VENDORS.", error.message);
      return false;
    }
  },
};

module.exports = { PharmaVendor };

