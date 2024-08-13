import React, { useState, createContext, useEffect } from "react";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import System from "./models/system";

export const AuthContext = createContext(null);
export function ContextWrapper(props) {
  const localUser = localStorage.getItem(AUTH_USER);
  const localAuthToken = localStorage.getItem(AUTH_TOKEN);
  const [azureADClientId, setAzureADClientId] = useState(null);
  const [azureADRedirectUri, setAzureADRedirectUri] = useState(null);
  const [azureADTenantId, setAzureADTenantId] = useState(null);
  const [store, setStore] = useState({
    user: localUser ? JSON.parse(localUser) : null,
    authToken: localAuthToken ? localAuthToken : null,
  });

  const [actions] = useState({
    updateUser: (user, authToken = "") => {
      localStorage.setItem(AUTH_USER, JSON.stringify(user));
      localStorage.setItem(AUTH_TOKEN, authToken);
      setStore({ user, authToken });
    },
    unsetUser: () => {
      localStorage.removeItem(AUTH_USER);
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem(AUTH_TIMESTAMP);
      setStore({ user: null, authToken: null });
    },
  });

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setAzureADClientId(_settings?.AzureADClientId);
      setAzureADRedirectUri(_settings?.AzureADRedirectUri);
      setAzureADTenantId(_settings?.AzureADTenantId);
    }
    fetchSettings();
  }, []);

  const msalConfig = {
    auth: {
      clientId: azureADClientId,
      authority: "https://login.microsoftonline.com/"+azureADTenantId,
      redirectUri: azureADRedirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
  }

  const pca = new PublicClientApplication(msalConfig);
  console.log("azureADTenantId",azureADTenantId);
  console.log("msalconfig",msalConfig);

  return (
    <MsalProvider instance={pca}>
      <AuthContext.Provider value={{ store, actions }}>
        {props.children}
      </AuthContext.Provider>
    </MsalProvider>
  );
}
