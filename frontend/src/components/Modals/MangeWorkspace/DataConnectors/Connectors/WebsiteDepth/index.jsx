import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import pluralize from "pluralize";

export default function WebsiteDepthOptions() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      showToast(
        "Scraping website - this may take a while.",
        "info",
        { clear: true, autoClose: false }
      );

      const { data, error } = await System.dataConnectors.websiteDepth.scrape({
        url,
        depth,
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `${data.scrapedPages} ${pluralize("page", data.scrapedPages)} scraped from ${url}. Output folder is ${data.folderName}.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setLoading(false);
    } catch (e) {
      console.error(e);
      showToast(e.message, "error", { clear: true });
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pb-6 pb-16">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col py-2">
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Website URL
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    URL of the website you wish to scrape.
                  </p>
                </div>
                <input
                  type="url"
                  name="url"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  placeholder="https://example.com"
                  required={true}
                  autoComplete="off"
                  onChange={(e) => setUrl(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">Depth</label>
                  <p className="text-xs font-normal text-white/50">
                    Depth of the website scraping (number of levels to scrape).
                  </p>
                </div>
                <input
                  type="number"
                  name="depth"
                  min="1"
                  max="5"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  required={true}
                  value={depth}
                  onChange={(e) => setDepth(parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full justify-center border border-slate-200 px-4 py-2 rounded-lg text-[#222628] text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {loading ? "Scraping website..." : "Submit"}
            </button>
            {loading && (
              <p className="text-xs text-white/50">
                Once complete, all scraped pages will be available for embedding
                into workspaces in the document picker.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}