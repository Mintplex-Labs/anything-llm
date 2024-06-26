import React, { useEffect, useState } from "react";
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
    <div
      style={{ height: "calc(100vh - 40px)" }}
      className="w-screen overflow-hidden bg-sidebar flex"
    >
      <Sidebar />
      {loading ? (
        <div className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full overflow-y-scroll border-2 border-outline h-[calc(100vh-72px)]">
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full overflow-y-scroll border-2 border-outline h-[calc(100vh-72px)]">
          {/* Why no STT support for Electron? https://stackoverflow.com/a/74114170 */}
          {/* <SpeechToTextProvider settings={settings} /> */}
          <TextToSpeechProvider settings={settings} />
        </div>
      )}
    </div>
  );
}
