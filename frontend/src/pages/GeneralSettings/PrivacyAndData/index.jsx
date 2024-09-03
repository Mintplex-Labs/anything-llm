import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import showToast from "@/utils/toast";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import {
  LLM_LOGOS,
  VECTOR_LOGOS,
  EMBEDDING_LOGOS,
} from "@/pages/OnboardingFlow/Steps/DataHandling";
import { useTranslation } from "react-i18next";

export default function PrivacyAndDataHandling() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const settings = await System.keys();
      setSettings(settings);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                {t("privacy.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {t("privacy.description")}
            </p>
          </div>
          {loading ? (
            <div className="h-1/2 transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] p-[18px] h-full overflow-y-scroll">
              <div className="w-full h-full flex justify-center items-center">
                <PreLoader />
              </div>
            </div>
          ) : (
            <>
              <ThirdParty settings={settings} />
              <TelemetryLogs settings={settings} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ThirdParty({ settings }) {
  const llmChoice = settings?.LLMProvider || "openai";
  const embeddingEngine = settings?.EmbeddingEngine || "openai";
  const vectorDb = settings?.VectorDB || "lancedb";
  const { t } = useTranslation();
  const llmName = t(`handlingPrivacy.llmSelectionPrivacy.${llmChoice}.name`);
  const llmDescription = t(
    `handlingPrivacy.llmSelectionPrivacy.${llmChoice}.description`,
    {
      returnObjects: true,
    }
  );
  const llmLogo = LLM_LOGOS[llmChoice];
  const vectorName = t(`handlingPrivacy.vectorDbPrivacy.${vectorDb}.name`);
  const vectorDescription = t(
    `handlingPrivacy.vectorDbPrivacy.${vectorDb}.description`,
    {
      returnObjects: true,
    }
  );
  const vectorLogo = VECTOR_LOGOS[vectorDb];
  const embaddingName = t(
    `handlingPrivacy.embeddingEnginePrivacy.${embeddingEngine}.name`
  );
  const embaddingDescription = t(
    `handlingPrivacy.embeddingEnginePrivacy.${embeddingEngine}.description`,
    {
      returnObjects: true,
    }
  );
  const embeddingLogo = EMBEDDING_LOGOS[embeddingEngine];
  return (
    <div className="py-8 w-full flex items-start justify-center flex-col gap-y-6 border-b-2 border-white/10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">
            {t("privacy.llm")}
          </div>
          <div className="flex items-center gap-2.5">
            <img src={llmLogo} alt="LLM Logo" className="w-8 h-8 rounded" />
            <p className="text-white text-sm font-bold">{llmName}</p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {llmDescription.map((desc, index) => (
              <li key={index} className="text-white/90 text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-y-2 border-b border-zinc-500/50 pb-4">
          <div className="text-white text-base font-bold">
            {t("privacy.embedding")}
          </div>
          <div className="flex items-center gap-2.5">
            <img
              src={embeddingLogo}
              alt="LLM Logo"
              className="w-8 h-8 rounded"
            />
            <p className="text-white text-sm font-bold">{embaddingName}</p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {embaddingDescription.map((desc, index) => (
              <li key={index} className="text-white/90 text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 pb-4">
          <div className="text-white text-base font-bold">
            {t("privacy.vector")}
          </div>
          <div className="flex items-center gap-2.5">
            <img src={vectorLogo} alt="LLM Logo" className="w-8 h-8 rounded" />
            <p className="text-white text-sm font-bold">{vectorName}</p>
          </div>
          <ul className="flex flex-col list-disc ml-4">
            {vectorDescription.map((desc, index) => (
              <li key={index} className="text-white/90 text-sm">
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TelemetryLogs({ settings }) {
  const [telemetry, setTelemetry] = useState(
    settings?.DisableTelemetry !== "true"
  );
  const { t } = useTranslation();
  async function toggleTelemetry() {
    await System.updateSystem({
      DisableTelemetry: !telemetry ? "false" : "true",
    });
    setTelemetry(!telemetry);
    const message = telemetry
      ? t("privacy.disabledMessage")
      : t("privacy.enabledMessage");
    showToast(message, "info", { clear: true });
  }

  return (
    <div className="relative w-full max-h-full">
      <div className="relative rounded-lg">
        <div className="flex items-start justify-between px-6 py-4"></div>
        <div className="space-y-6 flex h-full w-full">
          <div className="w-full flex flex-col gap-y-4">
            <div className="">
              <label className="mb-2.5 block font-medium text-white">
                {t("privacy.anonymous")}
              </label>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  onClick={toggleTelemetry}
                  checked={telemetry}
                  className="peer sr-only pointer-events-none"
                />
                <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-left space-y-2">
          <p
            className="text-white/80 text-xs rounded-lg w-96"
            dangerouslySetInnerHTML={{ __html: t("privacy.info1") }}
          ></p>
          <p
            className="text-white/80 text-xs rounded-lg w-96"
            dangerouslySetInnerHTML={{ __html: t("privacy.info2") }}
          ></p>
        </div>
      </div>
    </div>
  );
}
