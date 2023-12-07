import { createContext, useEffect, useState } from "react";
import AnythingLLM from "./media/logo/anything-llm.png";
import System from "./models/system";

export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");

  useEffect(() => {
    async function fetchInstanceLogo() {
      try {
        const logoURL = await System.fetchLogo();
        logoURL ? setLogo(logoURL) : setLogo(AnythingLLM);
      } catch (err) {
        setLogo(AnythingLLM);
        console.error("Failed to fetch logo:", err);
      }
    }
    fetchInstanceLogo();
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
