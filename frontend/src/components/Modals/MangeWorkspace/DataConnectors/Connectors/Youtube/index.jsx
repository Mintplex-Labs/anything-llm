import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function BulkYoutubeOptions() {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState(''); // State to store the comma-separated URLs
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0); // State to keep track of the current URL being processed
  const [errors, setErrors] = useState([]); // State to store errors for each URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlsArray = urls.split(',').filter(url => url); // Split and filter out any empty strings

    if (urlsArray.length > 200) {
      showToast("Error: Please limit to 200 YouTube links.", "error", {
        clear: true,
        autoClose: false,
      });
      return;
    }

    processUrls(urlsArray);
  };

  const processUrls = async (urls) => {
    setLoading(true);
    showToast("Fetching transcripts for YouTube videos.", "info", {
      clear: true,
      autoClose: false,
    });

    for (const url of urls) {
      try {
        const { data, error } = await System.dataConnectors.youtube.transcribe({
          url: url,
        });

        if (!!error) {
          setErrors(prevErrors => [...prevErrors, error]); // Add error to the errors array
        } else {
          showToast(
            `${data.title} by ${data.author} transcription completed. Output folder is ${data.destination}.`,
            "success",
            { clear: true }
          );
        }
      } catch (e) {
        console.error(e);
        setErrors(prevErrors => [...prevErrors, e.message]); // Add error to the errors array
      } finally {
        if (currentUrlIndex < urls.length - 1) {
          setCurrentUrlIndex(currentUrlIndex + 1); // Move to the next URL
        } else {
          setLoading(false);
          showToast('All transcripts processed.', 'info');
        }
      }

      // Wait for 2 seconds before processing the next URL
      await new Promise(resolve => setTimeout(resolve, 2000));
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
                    YouTube Video URLs (Comma separated)
                  </label>
                  <p className="text-xs font-normal text-white/50">
                    Enter the URLs of the YouTube videos you wish to transcribe, separated by commas.
                  </p>
                </div>
                <textarea
                  name="urls"
                  className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5 h-32"
                  placeholder="Enter YouTube URLs here"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => setUrls(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            {loading && (
              <p className="text-xs text-white/50 max-w-sm">
                Processing transcripts. Please wait...
              </p>
            )}
            {urls.length > 0 && !loading && (
              <button
                type="submit"
                className="mt-2 w-full border border-slate-200 px-4 py-2 rounded-lg text-[#222628] text-sm font-bold items-center flex gap-x-2 bg-slate-200 hover:bg-slate-300 hover:text-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Process transcripts
              </button>
            )}
            {errors.length > 0 && (
              <ul className="text-red-500 list-disc">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
