const { PharmaProduct } = require("../../../../models/pharmaProduct");
const { PharmaOrder } = require("../../../../models/pharmaOrder");
const { PharmaVendor } = require("../../../../models/pharmaVendor");

const pharmaTools = {
  name: "pharma-tools",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: "pharma_ordering_tool",
          description:
            "Interact with the pharma ordering system for this workspace. Use this to list available products and place pre-structured orders between Nigerian vendors and German manufacturers.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              action: {
                type: "string",
                description:
                  "The action to perform: 'list_products' or 'create_order'.",
                enum: ["list_products", "create_order"],
              },
              search: {
                type: "string",
                description:
                  "Optional free-text filter to narrow products by name or SKU when listing.",
              },
              productSku: {
                type: "string",
                description:
                  "SKU of the product to order when action is 'create_order'.",
              },
              quantity: {
                type: "integer",
                description:
                  "Quantity of the product to order when action is 'create_order'.",
              },
              shippingAddress: {
                type: "string",
                description:
                  "Shipping address in Nigeria for the order when action is 'create_order'.",
              },
            },
            required: ["action"],
            additionalProperties: false,
          },
          handler: async function ({
            action,
            search = "",
            productSku = "",
            quantity = 0,
            shippingAddress = "",
          }) {
            try {
              const invocation = this.super?.handlerProps?.invocation;
              if (!invocation?.workspace_id) {
                return "Pharma tooling is unavailable because no workspace context was found.";
              }

              const workspaceId = invocation.workspace_id;
              const userId = invocation.user_id || null;

              if (action === "list_products") {
                const whereClause = {
                  workspaceId,
                  isActive: true,
                };
                const products = await PharmaProduct.where(
                  whereClause,
                  null,
                  { name: "asc" }
                );

                const filtered = (products || []).filter((p) => {
                  if (!search) return true;
                  const q = String(search).toLowerCase();
                  return (
                    String(p.name).toLowerCase().includes(q) ||
                    String(p.sku).toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return "No pharma products were found matching this search in the current workspace.";
                }

                return JSON.stringify(
                  filtered.map((p) => ({
                    id: p.id,
                    name: p.name,
                    sku: p.sku,
                    unitPrice: p.unitPrice,
                    currency: p.currency,
                    availableQuantity: p.availableQuantity,
                  }))
                );
              }

              if (action === "create_order") {
                if (!userId) {
                  return "Cannot place an order because there is no authenticated user linked to this agent invocation.";
                }
                if (!productSku || !quantity || quantity <= 0) {
                  return "To create an order you must provide a valid productSku and a positive quantity.";
                }

                const product = await PharmaProduct.get({
                  workspaceId,
                  sku: String(productSku),
                  isActive: true,
                });
                if (!product) {
                  return `No active pharma product was found for SKU '${productSku}' in this workspace.`;
                }

                const vendor = await PharmaVendor.ensureForUser(
                  workspaceId,
                  { id: userId }
                );
                if (!vendor) {
                  return "Failed to resolve a vendor record for this user in the pharma system.";
                }

                const { order, error } = await PharmaOrder.createWithItems({
                  workspaceId,
                  vendorId: vendor.id,
                  items: [
                    {
                      productId: product.id,
                      quantity: Number(quantity),
                    },
                  ],
                  shippingAddress: shippingAddress || null,
                  destinationCountry: "Nigeria",
                });

                if (error || !order) {
                  return `Failed to create pharma order. ${error || ""}`.trim();
                }

                return JSON.stringify({
                  id: order.id,
                  status: order.status,
                  totalAmount: order.totalAmount,
                  currency: order.currency,
                  createdAt: order.createdAt,
                  items: order.items.map((i) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    unitPrice: i.unitPrice,
                    totalPrice: i.totalPrice,
                  })),
                });
              }

              return "Unsupported pharma action. Use 'list_products' or 'create_order'.";
            } catch (error) {
              return `There was an error while calling the pharma ordering tool. Let the user know this was the error: ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  pharmaTools,
};

