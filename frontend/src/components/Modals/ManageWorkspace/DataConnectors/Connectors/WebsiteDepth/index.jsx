import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import pluralize from "pluralize";

export default function WebsiteDepthOptions() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    try {
      setLoading(true);
      showToast("Scraping website - this may take a while.", "info", {
        clear: true,
        autoClose: false,
      });

      const { data, error } = await System.dataConnectors.websiteDepth.scrape({
        url: form.get("url"),
        depth: parseInt(form.get("depth")),
        maxLinks: parseInt(form.get("maxLinks")),
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `Successfully scraped ${data.length} ${pluralize(
          "page",
          data.length
        )}!`,
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
                    URL of the website you want to scrape.
                  </p>
                </div>
                <input
                  type="url"
                  name="url"
                  className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  placeholder="https://example.com"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">Depth</label>
                  <p className="text-xs font-normal text-white/50">
                    This is the number of child-links that the worker should
                    follow from the origin URL.
                  </p>
                </div>
                <input
                  type="number"
                  name="depth"
                  min="1"
                  max="5"
                  className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  required={true}
                  defaultValue="1"
                />
              </div>
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Max Links
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    Maximum number of links to scrape.
                  </p>
                </div>
                <input
                  type="number"
                  name="maxLinks"
                  min="1"
                  className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                  required={true}
                  defaultValue="20"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full ${
                loading ? "cursor-not-allowed animate-pulse" : ""
              } justify-center border border-slate-200 px-4 py-2 rounded-lg text-dark-text text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed`}
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
