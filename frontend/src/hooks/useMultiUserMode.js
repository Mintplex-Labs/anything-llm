import { useEffect, useState } from "react";
import System from "@/models/system";

export default function useMultiUserMode() {
  const [multiUserMode, setMultiUserMode] = useState(false);

  useEffect(() => {
    async function fetchMultiUserMode() {
      const enabled = await System.isMultiUserMode();
      setMultiUserMode(!!enabled);
    }
    fetchMultiUserMode();
  }, []);

  return multiUserMode;
}
