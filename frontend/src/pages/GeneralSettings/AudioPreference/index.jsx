import React, { useEffect, useState } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import SpeechToTextProvider from "./stt";
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
    <>
      {loading ? (
        <div className="relative md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-auto p-4 md:p-0">
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div className="relative md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-auto p-4 md:p-0">
          <SpeechToTextProvider settings={settings} />
          <TextToSpeechProvider settings={settings} />
        </div>
      )}
    </>
  );
}
