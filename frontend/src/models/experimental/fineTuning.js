import { API_BASE } from "@/utils/constants";
import { baseHeaders, safeJsonParse } from "@/utils/request";

const FineTuning = {
  cacheKeys: {
    dismissed_cta: "anythingllm_dismissed_fine_tune_notif",
    eligibility: "anythingllm_can_fine_tune",
  },

  /**
   * Get the information for the Fine-tuning product to display in various frontends
   * @returns {Promise<{
   *  productDetails: {
   *    name: string,
   *    description: string,
   *    icon: string,
   *    active: boolean,
   *  },
   *  pricing: {
   *    usd: number,
   *  },
   *  availableBaseModels: string[]
   * }>}
   */
  info: async function () {
    return await fetch(`${API_BASE}/experimental/fine-tuning/info`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not get model info.");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  datasetStat: async function ({ slugs = [], feedback = null }) {
    return await fetch(`${API_BASE}/experimental/fine-tuning/dataset`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ slugs, feedback }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not get dataset info.");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return { count: null };
      });
  },
  /**
   * Generates Fine-Tuning order.
   * @param {{email:string, baseModel:string, modelName: string, trainingData: {slugs:string[], feedback:boolean|null}}} param0
   * @returns {Promise<{checkoutUrl:string, jobId:string}|null>}
   */
  createOrder: async function ({ email, baseModel, modelName, trainingData }) {
    return await fetch(`${API_BASE}/experimental/fine-tuning/order`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({
        email,
        baseModel,
        modelName,
        trainingData,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not order fine-tune.");
        return res.json();
      })
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });
  },

  /**
   * Determine if a user should see the CTA alert. In general this alert
   * Can only render if the user is empty (single user) or is an admin role.
   * @returns {boolean}
   */
  canAlert: function (user = null) {
    if (!!user && user.role !== "admin") return false;
    return !window?.localStorage?.getItem(this.cacheKeys.dismissed_cta);
  },
  checkEligibility: async function () {
    const cache = window.localStorage.getItem(this.cacheKeys.eligibility);
    if (!!cache) {
      const { data, lastFetched } = safeJsonParse(cache, {
        data: null,
        lastFetched: 0,
      });
      if (!!data && Date.now() - lastFetched < 1.8e7)
        // 5 hours
        return data.eligible;
    }

    return await fetch(`${API_BASE}/experimental/fine-tuning/check-eligible`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not check if eligible.");
        return res.json();
      })
      .then((res) => {
        window.localStorage.setItem(
          this.cacheKeys.eligibility,
          JSON.stringify({
            data: { eligible: res.eligible },
            lastFetched: Date.now(),
          })
        );
        return res.eligible;
      })
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
};

export default FineTuning;
