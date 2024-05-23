import { useContext } from "react";
import { LogoContext } from "../LogoContext";

export default function useLogo() {
  const { logo, setLogo, loginLogo, isCustomLogo } = useContext(LogoContext);
  return { logo, setLogo, loginLogo, isCustomLogo };
}
