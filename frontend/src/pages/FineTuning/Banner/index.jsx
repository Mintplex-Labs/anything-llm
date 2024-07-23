import { useEffect, useState } from "react";
import useUser from "@/hooks/useUser";
import FineTuning from "@/models/experimental/fineTuning";
import { createPortal } from "react-dom";
import { Sparkle } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import paths from "@/utils/paths";

export function FineTuningAlert() {
  const { user } = useUser();
  const location = useLocation();
  const [className, setClassName] = useState("top-banner");
  const [isEligible, setIsEligible] = useState(false);

  function dismissAlert() {
    setClassName("rm-top-banner");
    window?.localStorage?.setItem(FineTuning.cacheKeys.dismissed_cta, "1");
    setTimeout(() => {
      setIsEligible(false);
    }, 550);
  }

  useEffect(() => {
    if (!FineTuning.canAlert(user)) return;
    if (
      location.pathname === paths.orderFineTune() ||
      location.pathname === paths.settings.chats()
    )
      return;
    FineTuning.checkEligibility()
      .then((eligible) => setIsEligible(eligible))
      .catch(() => null);
  }, [user]);

  if (!isEligible) return null;
  return createPortal(
    <div
      className={`fixed ${className} left-0 right-0 h-14 bg-orange-400 flex items-center justify-end px-4 z-[9999]`}
    >
      <Link
        onClick={dismissAlert}
        to={paths.orderFineTune()}
        className="grow w-full h-full ml-4 py-1"
      >
        <div className="flex flex-col items-center w-full">
          <div className="flex w-full justify-center items-center gap-x-2">
            <Sparkle size={20} className="text-white" />
            <p className="text-white font-medium text-lg">
              You have enough data for a fine-tune!
            </p>
          </div>
          <p className="text-xs text-white">click to learn more &rarr;</p>
        </div>
      </Link>
      <div className="flex items-center gap-x-2 shrink-0">
        <button
          onClick={dismissAlert}
          className="border-none text-white font-medium text-sm px-[10px] py-[6px] rounded-md bg-white/5 hover:bg-white/10"
        >
          Dismiss
        </button>
      </div>
    </div>,
    document.getElementById("root")
  );
}
