const prisma = require("../utils/prisma");

const ORDER_STATUSES = ["pending", "approved", "rejected", "fulfilled", "cancelled"];

const PharmaOrder = {
  ORDER_STATUSES,

  /**
   * Create an order with items. Computes totals server-side.
   * @param {Object} params
   * @param {number} params.workspaceId
   * @param {number} params.vendorId
   * @param {number} [params.manufacturerId] - Optional; if omitted it will be inferred from products (all items must share the same manufacturer)
   * @param {Array<{productId:number, quantity:number}>} params.items
   * @param {string} [params.currency]
   * @param {string} [params.shippingAddress]
   * @param {string} [params.destinationCountry]
   * @param {string} [params.notes]
   */
  createWithItems: async function (params = {}) {
    const {
      workspaceId,
      vendorId,
      manufacturerId,
      items = [],
      currency = "EUR",
      shippingAddress = null,
      destinationCountry = "Nigeria",
      notes = null,
    } = params;

    if (!workspaceId || !vendorId) {
      throw new Error("workspaceId and vendorId are required");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("At least one order item is required");
    }

    try {
      // Fetch product pricing to prevent client-side tampering
      const productIds = items.map((i) => Number(i.productId));
      const products = await prisma.pharma_products.findMany({
        where: {
          id: { in: productIds },
          workspaceId: Number(workspaceId),
          isActive: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new Error("One or more products are invalid or inactive");
      }

      // Ensure all products belong to the same manufacturer and infer it if needed
      const manufacturerIds = Array.from(
        new Set(products.map((p) => p.manufacturerId))
      );
      if (manufacturerIds.length !== 1) {
        throw new Error(
          "All products in an order must belong to the same manufacturer"
        );
      }
      const inferredManufacturerId = manufacturerIds[0];

      let totalAmount = 0;
      const orderItemsData = items.map((item) => {
        const product = products.find((p) => p.id === Number(item.productId));
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(product.unitPrice);
        const totalPrice = unitPrice * quantity;
        totalAmount += totalPrice;
        return {
          productId: product.id,
          quantity,
          unitPrice,
          totalPrice,
        };
      });

      const order = await prisma.pharma_orders.create({
        data: {
          workspaceId: Number(workspaceId),
          vendorId: Number(vendorId),
          manufacturerId: Number(manufacturerId || inferredManufacturerId),
          status: "pending",
          totalAmount,
          currency,
          shippingAddress,
          destinationCountry,
          notes,
          items: {
            createMany: {
              data: orderItemsData,
            },
          },
        },
        include: {
          items: true,
        },
      });

      return { order, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE PHARMA ORDER.", error.message);
      return { order: null, error: error.message };
    }
  },

  /**
   * Get a single order (optionally including items).
   * @param {Object} clause
   * @param {boolean} [includeItems]
   */
  get: async function (clause = {}, includeItems = true) {
    try {
      const order = await prisma.pharma_orders.findFirst({
        where: clause,
        include: includeItems ? { items: true } : undefined,
      });
      return order || null;
    } catch (error) {
      console.error("FAILED TO GET PHARMA ORDER.", error.message);
      return null;
    }
  },

  /**
   * Find many orders.
   * @param {Object} clause
   * @param {number|null} limit
   * @param {Object|null} orderBy
   */
  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const orders = await prisma.pharma_orders.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        include: { items: true },
      });
      return orders;
    } catch (error) {
      console.error("FAILED TO QUERY PHARMA ORDERS.", error.message);
      return [];
    }
  },

  /**
   * Update order status or metadata.
   * @param {number} id
   * @param {Object} updates
   */
  update: async function (id = null, updates = {}) {
    if (!id) throw new Error("No pharma order id provided for update");

    if (updates.status && !ORDER_STATUSES.includes(updates.status)) {
      throw new Error(
        `Invalid order status. Allowed: ${ORDER_STATUSES.join(", ")}`
      );
    }

    try {
      const order = await prisma.pharma_orders.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { order, error: null };
    } catch (error) {
      console.error("FAILED TO UPDATE PHARMA ORDER.", error.message);
      return { order: null, error: error.message };
    }
  },
};

module.exports = { PharmaOrder };

