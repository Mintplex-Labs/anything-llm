import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const FineTuning = {
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
};

export default FineTuning;
