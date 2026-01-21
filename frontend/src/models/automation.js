import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Automation = {
  /**
   * Get all automation categories
   * @returns {Promise<Array>}
   */
  categories: async function () {
    const categories = await fetch(`${API_BASE}/automations/categories`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res.categories || [])
      .catch(() => []);

    return categories;
  },

  /**
   * Get automations by category
   * @param {string} categorySlug - The category slug (business, marketing, sales, hr)
   * @returns {Promise<Object>}
   */
  byCategory: async function (categorySlug = "") {
    const data = await fetch(
      `${API_BASE}/automations/category/${categorySlug}`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .then((res) => ({
        automations: res.automations || [],
        metrics: res.metrics || null,
      }))
      .catch(() => ({
        automations: [],
        metrics: null,
      }));

    return data;
  },

  /**
   * Get a single automation by ID
   * @param {string} automationId - The automation ID
   * @returns {Promise<Object|null>}
   */
  get: async function (automationId = "") {
    const automation = await fetch(
      `${API_BASE}/automations/${automationId}`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .then((res) => res.automation)
      .catch(() => null);

    return automation;
  },

  /**
   * Toggle automation active status
   * @param {string} automationId - The automation ID
   * @param {boolean} active - The active status
   * @returns {Promise<boolean>}
   */
  toggleActive: async function (automationId, active) {
    const result = await fetch(
      `${API_BASE}/automations/${automationId}/toggle`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ active }),
      }
    )
      .then((res) => res.ok)
      .catch(() => false);

    return result;
  },

  /**
   * Get metrics for a specific category
   * @param {string} categorySlug - The category slug
   * @returns {Promise<Object|null>}
   */
  metrics: async function (categorySlug = "") {
    const metrics = await fetch(
      `${API_BASE}/automations/category/${categorySlug}/metrics`,
      {
        method: "GET",
        headers: baseHeaders(),
      }
    )
      .then((res) => res.json())
      .then((res) => res.metrics)
      .catch(() => null);

    return metrics;
  },
};

export default Automation;
