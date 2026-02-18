import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import System from "@/models/system";
import paths from "@/utils/paths";

export default function useRedirectToHomeOnOnboardingComplete() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkOnboardingComplete() {
      const onboardingComplete = await System.isOnboardingComplete();
      if (onboardingComplete === false) return;
      navigate(paths.home());
    }
    checkOnboardingComplete();
  }, []);
}
