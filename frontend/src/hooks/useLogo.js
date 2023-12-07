import { useEffect, useState } from "react";
import System from "@/models/system";
import AnythingLLM from "@/media/logo/anything-llm.png";

export default function useLogo() {
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

  return { logo };
}
