import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Pharma = {
  /**
   * Fetch active pharma products for a workspace.
   * @param {string} slug
   */
  products: async function (slug) {
    return await fetch(`${API_BASE}/workspace/${slug}/pharma/products`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.products || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },

  /**
   * Fetch pharma orders for the current user (vendor) in a workspace.
   * @param {string} slug
   */
  orders: async function (slug) {
    return await fetch(`${API_BASE}/workspace/${slug}/pharma/orders`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.orders || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },

  /**
   * Create a new pharma order.
   * @param {string} slug
   * @param {{items: {productId:number, quantity:number}[], shippingAddress?:string, destinationCountry?:string, notes?:string}} payload
   */
  createOrder: async function (slug, payload = {}) {
    return await fetch(`${API_BASE}/workspace/${slug}/pharma/orders`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Failed to create order.");
        }
        return { success: true, order: data.order, error: null };
      })
      .catch((e) => {
        console.error(e);
        return { success: false, order: null, error: e.message };
      });
  },
};

export default Pharma;

