import { isMobile } from "react-device-detect";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Introduction from "./Introduction";
import PrivacyPolicy from "./Privacy";
import TermsAndConditions from "./TermsAndConditions";
import Fulfillment from "./FulfillmentPolicy";
import OrderDetails from "./OrderDetails";
import DataUpload from "./DataUpload";
import Confirmation from "./Confirmation";
import OrderPlaced from "./OrderPlaced";

/**
 * @typedef OrderSettings
 * @property {string} email
 * @property {string} baseModel
 * @property {string} modelName
 * @property {boolean} agreedToTerms
 * @property {boolean} agreedToPrivacy
 * @property {string} modelName
 * @property {string|null} checkoutUrl
 * @property {string|null} jobId
 * @property {{slugs: string[], feedback: boolean|null}} trainingData
 * @property {{pricing: {usd: number}, availableBaseModels: string[]}} tuningInfo
 */

const FineTuningSteps = {
  intro: {
    name: "Introduction to Fine-Tuning",
    next: () => "privacy",
    component: ({ settings, setSettings, setStep }) => (
      <Introduction
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  privacy: {
    name: "How your data is handled",
    next: () => "tos",
    component: ({ settings, setSettings, setStep }) => (
      <PrivacyPolicy
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  tos: {
    name: "Terms of service",
    next: () => "fulfillment",
    component: ({ settings, setSettings, setStep }) => (
      <TermsAndConditions
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  fulfillment: {
    name: "Fulfillment terms",
    next: () => "order-details",
    component: ({ settings, setSettings, setStep }) => (
      <Fulfillment
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  "order-details": {
    name: "Model details & information",
    next: () => "data-selection",
    component: ({ settings, setSettings, setStep }) => (
      <OrderDetails
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  "data-selection": {
    name: "Data selection",
    next: () => "confirmation",
    component: ({ settings, setSettings, setStep }) => (
      <DataUpload
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  confirmation: {
    name: "Review and Submit",
    next: () => "done",
    component: ({ settings, setSettings, setStep }) => (
      <Confirmation
        settings={settings}
        setSettings={setSettings}
        setStep={setStep}
      />
    ),
  },
  done: {
    name: "Order placed",
    next: () => "done",
    component: ({ settings }) => <OrderPlaced settings={settings} />,
  },
};

export function FineTuningCreationLayout({ setStep, children }) {
  const [settings, setSettings] = useState({
    email: null,
    baseModel: null,
    modelName: null,
    agreedToTerms: false,
    agreedToPrivacy: false,
    data: {
      workspaceSlugs: [],
      feedback: false,
    },
    tuningInfo: {
      pricing: {
        usd: 0.0,
      },
      availableBaseModels: [],
    },
    checkoutUrl: null,
    jobId: null,
  });

  return (
    <div
      id="fine-tune-create-order-container"
      className="w-screen h-screen overflow-y-auto bg-sidebar flex"
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
export default FineTuningSteps;
