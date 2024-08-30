import React, { useState, createContext, useEffect } from "react";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import System from "./models/system";

export const AuthContext = createContext(null);
export function ContextWrapper(props) {
  const localUser = localStorage.getItem(AUTH_USER);
  const localAuthToken = localStorage.getItem(AUTH_TOKEN);
  const [store, setStore] = useState({
    user: localUser ? JSON.parse(localUser) : null,
    authToken: localAuthToken ? localAuthToken : null,
  });
  const [settings, setSettings] = useState(null);
  const [msalInstanceSetup, setMsalInstanceSetup] = useState(null);
  const [msalInstance, setMsalInstance] = useState(null);

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
      setSettings(_settings);
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.AzureADClientId && settings?.AzureADRedirectUri && settings?.AzureADTenantId) {
      const msalConfig = {
        auth: {
          clientId: settings?.AzureADClientId,
          authority: `https://login.microsoftonline.com/${settings?.AzureADTenantId}`,
          redirectUri: settings?.AzureADRedirectUri,
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: false,
        },
      };
      setMsalInstance(new PublicClientApplication(msalConfig));
    }
    setMsalInstanceSetup("Done");
  }, [settings]);

  if (!msalInstanceSetup) {
    return <div>Loading...</div>; // or return null
  }

  if (msalInstance) {
    return (
      <MsalProvider instance={msalInstance}>
        <AuthContext.Provider value={{ store, actions }}>
          {props.children}
        </AuthContext.Provider>
      </MsalProvider>
    );
  } else {
    return (
      <AuthContext.Provider value={{ store, actions }}>
        {props.children}
      </AuthContext.Provider>
    );
  }
}
