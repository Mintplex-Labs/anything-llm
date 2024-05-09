import React, { useState, createContext, useEffect } from "react";
import { AUTH_TIMESTAMP, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import { GoogleOAuthProvider } from "@react-oauth/google";
import System from "./models/system";

export const AuthContext = createContext(null);
export function ContextWrapper(props) {
  const localUser = localStorage.getItem(AUTH_USER);
  const localAuthToken = localStorage.getItem(AUTH_TOKEN);
  const [googleAuthClientId, setGoogleAuthClientId] = useState(null);
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
      setGoogleAuthClientId(_settings?.GoogleAuthClientId);
    }
    fetchSettings();
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleAuthClientId}>
      <AuthContext.Provider value={{ store, actions }}>
        {props.children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
