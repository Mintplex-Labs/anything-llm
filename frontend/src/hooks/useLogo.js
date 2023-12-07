import { useContext } from "react";
import { LogoContext } from "../LogoContext";

export default function useLogo() {
  const { logo, setLogo } = useContext(LogoContext);
  return { logo, setLogo };
}
