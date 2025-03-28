import React, { useState, useEffect } from "react";
import GetStarted from "./GetStarted";
import ExploreFeatures from "./ExploreFeatures";
import Updates from "./Updates";
import Resources from "./Resources";
import Checklist from "./Checklist";
import Sidebar, { SidebarMobileHeader } from "@/components/Sidebar";
import { isMobile } from "react-device-detect";
import WelcomeChecklist from "../WelcomeChecklist";

const WELCOME_CHECKLIST_SEEN = "anythingllm_welcome_checklist_seen";

export default function Home() {
  const [showWelcomeChecklist, setShowWelcomeChecklist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenChecklist = window.localStorage.getItem(
      WELCOME_CHECKLIST_SEEN
    );
    setShowWelcomeChecklist(!hasSeenChecklist);
    setLoading(false);
  }, []);

  const handleSkipChecklist = () => {
    window.localStorage.setItem(WELCOME_CHECKLIST_SEEN, "true");
    setShowWelcomeChecklist(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {!isMobile ? <Sidebar /> : <SidebarMobileHeader />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-container w-full h-full"
      >
        <div className="w-full h-full flex flex-col items-center overflow-y-auto">
          {loading ? (
            <></>
          ) : showWelcomeChecklist ? (
            <WelcomeChecklist onSkip={handleSkipChecklist} />
          ) : (
            <div className="w-full max-w-[1200px] flex flex-col gap-y-[50px] p-4 pt-16 md:p-12">
              <Checklist />
              <GetStarted />
              <ExploreFeatures />
              <Updates />
              <Resources />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
