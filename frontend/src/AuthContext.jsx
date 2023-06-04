import React, { useState, createContext } from "react";

export const AuthContext = createContext(null);
export function ContextWrapper(props) {
  const localUser = localStorage.getItem("anythingllm_user");
  const localAuthToken = localStorage.getItem("anythingllm_authToken");
  const [store, setStore] = useState({
    user: localUser ? JSON.parse(localUser) : null,
    authToken: localAuthToken ? localAuthToken : null,
  });

  const [actions] = useState({
    updateUser: (user, authToken = "") => {
      localStorage.setItem("anythingllm_user", JSON.stringify(user));
      localStorage.setItem("anythingllm_authToken", authToken);
      setStore({ user, authToken });
    },
    unsetUser: () => {
      localStorage.removeItem("anythingllm_user");
      localStorage.removeItem("anythingllm_authToken");
      setStore({ user: null, authToken: null });
    },
  });

  return (
    <AuthContext.Provider value={{ store, actions }}>
      {props.children}
    </AuthContext.Provider>
  );
}
