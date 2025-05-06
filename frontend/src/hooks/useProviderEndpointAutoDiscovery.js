import { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function useProviderEndpointAutoDiscovery({
  provider = null,
  initialBasePath = "",
  initialAuthToken = null,
  ENDPOINTS = [],
}) {
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState(initialBasePath);
  const [basePathValue, setBasePathValue] = useState(initialBasePath);

  const [authToken, setAuthToken] = useState(initialAuthToken);
  const [authTokenValue, setAuthTokenValue] = useState(initialAuthToken);
  const [autoDetectAttempted, setAutoDetectAttempted] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(true);

  async function autoDetect(isInitialAttempt = false) {
    setLoading(true);
    setAutoDetectAttempted(true);
    const possibleEndpoints = [];
    ENDPOINTS.forEach((endpoint) => {
      possibleEndpoints.push(
        new Promise((resolve, reject) => {
          System.customModels(provider, authTokenValue, endpoint, 2_000)
            .then((results) => {
              if (!results?.models || results.models.length === 0)
                throw new Error("No models");
              resolve({ endpoint, models: results.models });
            })
            .catch(() => {
              reject(`${provider} @ ${endpoint} did not resolve.`);
            });
        })
      );
    });

    const { endpoint, models } = await Promise.any(possibleEndpoints)
      .then((resolved) => resolved)
      .catch(() => {
        console.error("All endpoints failed to resolve.");
        return { endpoint: null, models: null };
      });

    if (models !== null) {
      setBasePath(endpoint);
      setBasePathValue(endpoint);
      setLoading(false);
      showToast("Provider endpoint discovered automatically.", "success", {
        clear: true,
      });
      setShowAdvancedControls(false);
      return;
    }

    setLoading(false);
    setShowAdvancedControls(true);
    showToast(
      "Couldn't automatically discover the provider endpoint. Please enter it manually.",
      "info",
      { clear: true }
    );
  }

  function handleAutoDetectClick(e) {
    e.preventDefault();
    autoDetect();
  }

  function handleBasePathChange(e) {
    const value = e.target.value;
    setBasePathValue(value);
  }

  function handleBasePathBlur() {
    setBasePath(basePathValue);
  }

  function handleAuthTokenChange(e) {
    const value = e.target.value;
    setAuthTokenValue(value);
  }

  function handleAuthTokenBlur() {
    setAuthToken(authTokenValue);
  }

  useEffect(() => {
    if (!initialBasePath && !autoDetectAttempted) autoDetect(true);
  }, [initialBasePath, initialAuthToken, autoDetectAttempted]);

  return {
    autoDetecting: loading,
    autoDetectAttempted,
    showAdvancedControls,
    setShowAdvancedControls,
    basePath: {
      value: basePath,
      set: setBasePathValue,
      onChange: handleBasePathChange,
      onBlur: handleBasePathBlur,
    },
    basePathValue: {
      value: basePathValue,
      set: setBasePathValue,
    },
    authToken: {
      value: authToken,
      set: setAuthTokenValue,
      onChange: handleAuthTokenChange,
      onBlur: handleAuthTokenBlur,
    },
    authTokenValue: {
      value: authTokenValue,
      set: setAuthTokenValue,
    },
    handleAutoDetectClick,
    runAutoDetect: autoDetect,
  };
}
