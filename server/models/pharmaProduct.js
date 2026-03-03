const prisma = require("../utils/prisma");

const PharmaProduct = {
  /**
   * Create a new pharma product.
   * @param {Object} data
   * @param {number} data.workspaceId
   * @param {number} data.manufacturerId
   * @param {string} data.name
   * @param {string} data.sku
   * @param {number} data.unitPrice
   * @param {string} [data.currency]
   * @param {string} [data.description]
   * @param {number} [data.availableQuantity]
   */
  create: async function (data = {}) {
    try {
      const product = await prisma.pharma_products.create({
        data: {
          workspaceId: Number(data.workspaceId),
          manufacturerId: Number(data.manufacturerId),
          name: String(data.name),
          sku: String(data.sku),
          unitPrice: Number(data.unitPrice),
          currency: data.currency || "EUR",
          description: data.description || null,
          availableQuantity:
            typeof data.availableQuantity === "number"
              ? data.availableQuantity
              : null,
        },
      });
      return { product, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE PHARMA PRODUCT.", error.message);
      return { product: null, error: error.message };
    }
  },

  /**
   * Get a single product by clause.
   * @param {Object} clause
   */
  get: async function (clause = {}) {
    try {
      const product = await prisma.pharma_products.findFirst({
        where: clause,
      });
      return product || null;
    } catch (error) {
      console.error("FAILED TO GET PHARMA PRODUCT.", error.message);
      return null;
    }
  },

  /**
   * Find many products.
   * @param {Object} clause
   * @param {number|null} limit
   * @param {Object|null} orderBy
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const products = await prisma.pharma_products.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return products;
    } catch (error) {
      console.error("FAILED TO QUERY PHARMA PRODUCTS.", error.message);
      return [];
    }
  },

  /**
   * Update a product by id.
   * @param {number} id
   * @param {Object} updates
   */
  update: async function (id = null, updates = {}) {
    if (!id) throw new Error("No pharma product id provided for update");

    try {
      const product = await prisma.pharma_products.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { product, error: null };
    } catch (error) {
      console.error("FAILED TO UPDATE PHARMA PRODUCT.", error.message);
      return { product: null, error: error.message };
    }
  },
};

module.exports = { PharmaProduct };

