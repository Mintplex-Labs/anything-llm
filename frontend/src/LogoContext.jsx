import { createContext, useEffect, useState } from "react";
import RaiqaAssistant from "./media/logo/raiqa-health.png";
import DefaultLoginLogo from "./media/illustrations/login-logo.svg";
import System from "./models/system";

export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");
  const [loginLogo, setLoginLogo] = useState("");
  const [isCustomLogo, setIsCustomLogo] = useState(false);

  useEffect(() => {
    async function fetchInstanceLogo() {
      try {
        const { isCustomLogo, logoURL } = await System.fetchLogo();
        if (logoURL) {
          setLogo(logoURL);
          setLoginLogo(isCustomLogo ? logoURL : DefaultLoginLogo);
          setIsCustomLogo(isCustomLogo);
        } else {
          setLogo(RaiqaAssistant);
          setLoginLogo(DefaultLoginLogo);
          setIsCustomLogo(false);
        }
      } catch (err) {
        setLogo(RaiqaAssistant);
        setLoginLogo(DefaultLoginLogo);
        setIsCustomLogo(false);
        console.error("Failed to fetch logo:", err);
      }
    }

    fetchInstanceLogo();
  }, []);

  return (
    <LogoContext.Provider value={{ logo, setLogo, loginLogo, isCustomLogo }}>
      {children}
    </LogoContext.Provider>
  );
}
