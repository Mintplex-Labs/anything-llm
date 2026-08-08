import { createContext, useEffect, useState } from "react";
import AnythingLLM from "./media/logo/anything-llm.png";
import AnythingLLMDark from "./media/logo/anything-llm-dark.png";
import DefaultLoginLogoLight from "./media/illustrations/login-logo.svg";
import DefaultLoginLogoDark from "./media/illustrations/login-logo-light.svg";
import System from "./models/system";

export const REFETCH_LOGO_EVENT = "refetch-logo";

function isLightMode() {
  return document.documentElement.getAttribute("data-theme") === "light";
}
export const LogoContext = createContext();

export function LogoProvider({ children }) {
  const [logo, setLogo] = useState("");
  const [loginLogo, setLoginLogo] = useState("");
  const [isCustomLogo, setIsCustomLogo] = useState(false);
  const [isCustomLoginLogo, setIsCustomLoginLogo] = useState(false);

  async function fetchInstanceLogo() {
    const DefaultLoginLogo = isLightMode()
      ? DefaultLoginLogoDark
      : DefaultLoginLogoLight;
    try {
      const { isCustomLogo: _isCustom, logoURL } = await System.fetchLogo();
      if (logoURL) {
        setLogo(logoURL);
        setIsCustomLogo(_isCustom);
      } else {
        isLightMode() ? setLogo(AnythingLLMDark) : setLogo(AnythingLLM);
        setIsCustomLogo(false);
      }

      const { isCustomLogo: _isCustomLogin, logoURL: loginLogoURL } =
        await System.fetchLoginLogo();
      if (loginLogoURL) {
        setLoginLogo(loginLogoURL);
        setIsCustomLoginLogo(_isCustomLogin);
      } else {
        setLoginLogo(DefaultLoginLogo);
        setIsCustomLoginLogo(false);
      }
    } catch (err) {
      isLightMode() ? setLogo(AnythingLLMDark) : setLogo(AnythingLLM);
      setLoginLogo(DefaultLoginLogo);
      setIsCustomLogo(false);
      setIsCustomLoginLogo(false);
      console.error("Failed to fetch logo:", err);
    }
  }

  useEffect(() => {
    fetchInstanceLogo();
    window.addEventListener(REFETCH_LOGO_EVENT, fetchInstanceLogo);
    return () => {
      window.removeEventListener(REFETCH_LOGO_EVENT, fetchInstanceLogo);
    };
  }, []);

  return (
    <LogoContext.Provider
      value={{
        logo,
        setLogo,
        loginLogo,
        isCustomLogo,
        isCustomLoginLogo,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
}
