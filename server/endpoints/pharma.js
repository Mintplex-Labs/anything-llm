const {
  reqBody,
  multiUserMode,
  userFromSession,
} = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { PharmaProduct } = require("../models/pharmaProduct");
const { PharmaOrder } = require("../models/pharmaOrder");
const { PharmaVendor } = require("../models/pharmaVendor");
const {
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function pharmaEndpoints(app) {
  if (!app) return;

  /**
   * List all active pharma products for a workspace.
   */
  app.get(
    "/workspace/:slug/pharma/products",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug })
          : await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const products = await PharmaProduct.where(
          {
            workspaceId: workspace.id,
            isActive: true,
          },
          null,
          { name: "asc" }
        );
        response.status(200).json({ products });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * List all orders for the current vendor (user) in a workspace.
   */
  app.get(
    "/workspace/:slug/pharma/orders",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug })
          : await Workspace.get({ slug });

        if (!workspace || !user) {
          response.status(200).json({ orders: [] });
          return;
        }

        const vendor = await PharmaVendor.get({
          workspaceId: workspace.id,
          userId: user.id,
        });
        if (!vendor) {
          response.status(200).json({ orders: [] });
          return;
        }

        const orders = await PharmaOrder.where(
          {
            workspaceId: workspace.id,
            vendorId: vendor.id,
          },
          null,
          { createdAt: "desc" }
        );
        response.status(200).json({ orders });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  /**
   * Create a new pharma order for the current vendor (user) in a workspace.
   * Body: { items: [{ productId, quantity }], shippingAddress?, destinationCountry?, notes? }
   */
  app.post(
    "/workspace/:slug/pharma/orders",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug })
          : await Workspace.get({ slug });

        if (!workspace || !user) {
          response
            .status(400)
            .json({ error: "Invalid workspace or user context." });
          return;
        }

        const body = reqBody(request);
        const items = Array.isArray(body.items) ? body.items : [];
        if (items.length === 0) {
          response
            .status(400)
            .json({ error: "At least one order item is required." });
          return;
        }

        const vendor = await PharmaVendor.ensureForUser(workspace.id, user);
        if (!vendor) {
          response
            .status(500)
            .json({ error: "Failed to resolve vendor for this user." });
          return;
        }

        const { order, error } = await PharmaOrder.createWithItems({
          workspaceId: workspace.id,
          vendorId: vendor.id,
          items,
          currency: body.currency || "EUR",
          shippingAddress: body.shippingAddress || null,
          destinationCountry: body.destinationCountry || "Nigeria",
          notes: body.notes || null,
        });

        if (error || !order) {
          response.status(400).json({ error });
          return;
        }

        response.status(201).json({ order });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).json({ error: "Failed to create order." });
      }
    }
  );
}

module.exports = { pharmaEndpoints };

