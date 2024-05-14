import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import Sidebar from "@/components/SettingsSidebar";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import TextToSpeechProvider from "./tts";

export default function AudioPreference() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          {/* Why no STT support for Electron? https://stackoverflow.com/a/74114170 */}
          {/* <SpeechToTextProvider settings={settings} /> */}
          <TextToSpeechProvider settings={settings} />
        </div>
      )}
    </div>
  );
}
