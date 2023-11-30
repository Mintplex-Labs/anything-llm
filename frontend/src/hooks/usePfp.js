import { useEffect, useState } from "react";
import System from "../models/system";
import useUser from "./useUser";

export default function usePfp() {
  const [pfp, setPfp] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    async function fetchPfp() {
      try {
        const pfpUrl = await System.fetchPfp(user.id);
        setPfp(pfpUrl);
      } catch (err) {
        setPfp(null);
        console.error("Failed to fetch pfp:", err);
      }
    }
    fetchPfp();
  }, []);

  return { pfp };
}
