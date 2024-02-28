import React, { useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import { DATA_CONNECTORS } from "@/components/DataConnectorOption";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function YouTubeTranscriptConnectorSetup() {
  const { image } = DATA_CONNECTORS["youtube-transcript"];
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast("Fetching transcript for YouTube video.", "info", {
        clear: true,
        autoClose: false,
      });
      const { data, error } = await System.dataConnectors.youtube.transcribe({
        url: form.get("url"),
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `${data.title} by ${data.author} transcription completed. Output folder is ${data.destination}.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setLoading(false);
      return;
    } catch (e) {
      console.error(e);
      showToast(e.message, "error", { clear: true });
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        <div className="flex w-full">
          <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
            <div className="flex w-full gap-x-4 items-center  pb-6 border-white border-b-2 border-opacity-10">
              <img src={image} alt="YouTube" className="rounded-lg h-16 w-16" />
              <div className="w-full flex flex-col gap-y-1">
                <div className="items-center flex gap-x-4">
                  <p className="text-2xl font-semibold text-white">
                    Import YouTube transcription
                  </p>
                </div>
                <p className="text-sm font-base text-white text-opacity-60">
                  From a youtube link, import the entire transcript of that
                  video for embedding.
                </p>
              </div>
            </div>

            <form className="w-full" onSubmit={handleSubmit}>
              <div className="w-full flex flex-col py-2">
                <div className="w-full flex items-center gap-4">
                  <div className="flex flex-col w-60">
                    <div className="flex flex-col gap-y-1 mb-4">
                      <label className="text-white text-sm font-semibold block">
                        YouTube video URL
                      </label>
                    </div>
                    <input
                      type="url"
                      name="url"
                      className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                      placeholder="https://youtube.com/watch?v=abc123"
                      required={true}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-y-2 w-fit">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 text-lg w-fit border border-slate-200 px-4 py-1 rounded-lg text-slate-200 items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:bg-slate-200 disabled:text-slate-800"
                >
                  {loading ? "Collecting transcript..." : "Collect transcript"}
                </button>
                {loading && (
                  <p className="text-xs text-zinc-300">
                    Once complete, the transcription will be available for
                    embedding into workspaces in the document picker.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
