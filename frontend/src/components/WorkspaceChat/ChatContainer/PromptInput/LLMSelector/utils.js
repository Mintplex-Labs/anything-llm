import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { DISABLED_PROVIDERS } from "@/hooks/useGetProvidersModels";

export function autoScrollToSelectedLLMProvider(
  selectedLLMProvider,
  timeout = 500
) {
  setTimeout(() => {
    const selectedButton = document.querySelector(
      `[data-llm-value="${selectedLLMProvider}"]`
    );
    if (!selectedButton) return;
    selectedButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, timeout);
}

/**
 * Validates the model selection by checking if the model is in the select option in the available models
 * dropdown. If the model is not in the dropdown, it will return the first model in the dropdown.
 *
 * This exists when the user swaps providers, but did not select a model in the new provider's dropdown
 * and assumed the first model in the picker was OK. This prevents invalid provider<>model selection issues
 * @param {string} model - The model to validate
 * @returns {string} - The validated model
 */
export function validatedModelSelection(model) {
  try {
    // If the entire select element is not found, return the model as is and cross our fingers
    const selectOption = document.getElementById(`workspace-llm-model-select`);
    if (!selectOption) return model;

    // If the model is not in the dropdown, return the first model in the dropdown
    // to prevent invalid provider<>model selection issues
    const selectedOption = selectOption.querySelector(
      `option[value="${model}"]`
    );
    if (!selectedOption) return selectOption.querySelector(`option`).value;

    // If the model is in the dropdown, return the model as is
    return model;
  } catch (error) {
    return null; // If the dropdown was empty or something else went wrong, return null to abort the save
  }
}

export function hasMissingCredentials(settings, provider) {
  const providerEntry = AVAILABLE_LLM_PROVIDERS.find(
    (p) => p.value === provider
  );
  if (!providerEntry) return false;

  for (const requiredKey of providerEntry.requiredConfig) {
    if (!settings.hasOwnProperty(requiredKey)) return true;
    if (!settings[requiredKey]) return true;
  }
  return false;
}

export const WORKSPACE_LLM_PROVIDERS = AVAILABLE_LLM_PROVIDERS.filter(
  (provider) => !DISABLED_PROVIDERS.includes(provider.value)
);

/**
 * Filters workspace LLM providers based on an optional allowlist.
 * Useful for deployments that want to limit visible providers in the UI.
 * @param {string|null} allowedList - Comma-separated provider values (e.g., "generic-openai,openai")
 * @returns {Array} - Filtered provider list, or all providers if allowlist is empty/null
 */
export function getFilteredWorkspaceProviders(allowedList) {
  if (!allowedList || allowedList.trim() === "") {
    return WORKSPACE_LLM_PROVIDERS;
  }

  const allowedProviders = allowedList
    .split(",")
    .map((p) => p.trim().toLowerCase());

  return WORKSPACE_LLM_PROVIDERS.filter((provider) =>
    allowedProviders.includes(provider.value.toLowerCase())
  );
}
