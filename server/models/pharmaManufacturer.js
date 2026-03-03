const prisma = require("../utils/prisma");

const PharmaManufacturer = {
  /**
   * Create a new pharma manufacturer for a workspace.
   * @param {Object} data
   * @param {number} data.workspaceId
   * @param {string} data.name
   * @param {string} [data.country]
   * @param {string} [data.address]
   * @param {string} [data.contactEmail]
   * @param {string} [data.contactPhone]
   */
  create: async function (data = {}) {
    try {
      const manufacturer = await prisma.pharma_manufacturers.create({
        data: {
          workspaceId: Number(data.workspaceId),
          name: String(data.name),
          country: data.country || "Germany",
          address: data.address || null,
          contactEmail: data.contactEmail || null,
          contactPhone: data.contactPhone || null,
        },
      });
      return { manufacturer, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE PHARMA MANUFACTURER.", error.message);
      return { manufacturer: null, error: error.message };
    }
  },

  /**
   * Get a single manufacturer by clause.
   * @param {Object} clause
   */
  get: async function (clause = {}) {
    try {
      const manufacturer = await prisma.pharma_manufacturers.findFirst({
        where: clause,
      });
      return manufacturer || null;
    } catch (error) {
      console.error("FAILED TO GET PHARMA MANUFACTURER.", error.message);
      return null;
    }
  },

  /**
   * Find many manufacturers.
   * @param {Object} clause
   * @param {number|null} limit
   * @param {Object|null} orderBy
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const manufacturers = await prisma.pharma_manufacturers.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return manufacturers;
    } catch (error) {
      console.error("FAILED TO QUERY PHARMA MANUFACTURERS.", error.message);
      return [];
    }
  },

  /**
   * Update a manufacturer by id.
   * @param {number} id
   * @param {Object} updates
   */
  update: async function (id = null, updates = {}) {
    if (!id) throw new Error("No pharma manufacturer id provided for update");

    try {
      const manufacturer = await prisma.pharma_manufacturers.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { manufacturer, error: null };
    } catch (error) {
      console.error("FAILED TO UPDATE PHARMA MANUFACTURER.", error.message);
      return { manufacturer: null, error: error.message };
    }
  },

  /**
   * Delete manufacturers matching clause.
   * @param {Object} clause
   */
  delete: async function (clause = {}) {
    try {
      await prisma.pharma_manufacturers.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error("FAILED TO DELETE PHARMA MANUFACTURERS.", error.message);
      return false;
    }
  },
};

module.exports = { PharmaManufacturer };

