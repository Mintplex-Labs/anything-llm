import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));
  if (response.ok) return data;
  return {
    success: false,
    ...data,
    message: data?.message || fallbackMessage,
  };
}

const SwarmsyOnboarding = {
  status: async function () {
    return await fetch(`${API_BASE}/swarmsy/onboarding/status`, {
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(response, "Failed to resolve SWARMSY onboarding status.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to resolve SWARMSY onboarding status.",
      }));
  },
  createHive: async function () {
    return await fetch(`${API_BASE}/swarmsy/onboarding/create-hive`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(response, "Failed to create SWARMSY HIVE.")
      )
      .catch(() => ({
        success: false,
        message: "Failed to create SWARMSY HIVE.",
      }));
  },
  ingestRequiredDocs: async function () {
    return await fetch(`${API_BASE}/swarmsy/onboarding/ingest-required-docs`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((response) =>
        parseResponse(
          response,
          "Failed to ingest SWARMSY required doctrine docs."
        )
      )
      .catch(() => ({
        success: false,
        message: "Failed to ingest SWARMSY required doctrine docs.",
      }));
  },
};

export default SwarmsyOnboarding;
