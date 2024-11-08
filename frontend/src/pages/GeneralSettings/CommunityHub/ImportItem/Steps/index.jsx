import { isMobile } from "react-device-detect";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Introduction from "./Introduction";
import PullAndReview from "./PullAndReview";
import Completed from "./Completed";

const CommunityHubImportItemSteps = {
  itemId: {
    key: "itemId",
    name: "1. Paste in Item ID",
    next: () => "validation",
    component: ({ settings, setSettings, setStep }) => (
      <Introduction
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  validation: {
    key: "validation",
    name: "2. Review item",
    next: () => "completed",
    component: ({ settings, setSettings, setStep }) => (
      <PullAndReview
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  completed: {
    key: "completed",
    name: "3. Completed",
    component: ({ settings, setSettings, setStep }) => (
      <Completed
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
};

export function CommunityHubImportItemLayout({ setStep, children }) {
  const [settings, setSettings] = useState({
    itemId: null,
    item: null,
  });

  return (
    <div
      id="community-hub-import-item-container"
      className="w-screen h-screen overflow-hidden bg-sidebar flex md:mt-0 mt-6"
    >
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] w-full h-full flex"
      >
        {children(settings, setSettings, setStep)}
      </div>
    </div>
  );
}
export default CommunityHubImportItemSteps;
