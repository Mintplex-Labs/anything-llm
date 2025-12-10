import React, { useState, createContext, useEffect } from "react";
import {
  API_BASE,
  AUTH_TIMESTAMP,
  AUTH_TOKEN,
  AUTH_USER,
  USER_PROMPT_INPUT_MAP,
} from "@/utils/constants";
import { baseHeaders } from "./utils/request";
import System from "./models/system";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);
export function AuthProvider(props) {
  const localUser = localStorage.getItem(AUTH_USER);
  const localAuthToken = localStorage.getItem(AUTH_TOKEN);
  const [store, setStore] = useState({
    user: localUser ? JSON.parse(localUser) : null,
    authToken: localAuthToken ? localAuthToken : null,
  });

  const navigate = useNavigate();

  /* NOTE:
   * 1. There's no reason for these helper functions to be stateful. They could
   * just be fucntion declarations or methods on a basic object
   * 2. These actions are not being invoked anywhere in the
   * codebase, dead code.
   */
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
      localStorage.removeItem(USER_PROMPT_INPUT_MAP);
      setStore({ user: null, authToken: null });
    },
  });

  // On initial mount and whenever the token changes fetch a new user object
  useEffect(() => {
    if (store.authToken) {
      System.refreshUser()
        .then(({ user }) => {
          localStorage.setItem(AUTH_USER, JSON.stringify(user));
          setStore((prev) => ({
            ...prev,
            user,
          }));
        })
        .catch(() => {
          localStorage.removeItem(AUTH_USER);
          localStorage.removeItem(AUTH_TOKEN);
          localStorage.removeItem(AUTH_TIMESTAMP);
          localStorage.removeItem(USER_PROMPT_INPUT_MAP);
          setStore({ user: null, authToken: null });
          navigate("/login");
        });
    }
  }, [store.authToken]);

  return (
    <AuthContext.Provider value={{ store, actions }}>
      {props.children}
    </AuthContext.Provider>
  );
}
