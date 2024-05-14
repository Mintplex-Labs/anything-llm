import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function BulkYoutubeOptions() {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState(''); // State to store the comma-separated URLs
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0); // State to keep track of the current URL being processed
  const [errors, setErrors] = useState([]); // State to store errors for each URL
  const [backoffDelay, setBackoffDelay] = useState(2000); // Initial delay for backoff

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
    let retryCount = 0; // Counter for retry attempts
    let lastError = null; // Last error encountered

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
        // Check if the error is due to rate limiting
        if (e.message.includes('Rate limit')) {
          const retryAfter = parseInt(e.headers['retry-after'] || '60', 10); // Parse the 'Retry-After' header if present
          const newDelay = Math.min(backoffDelay * 2, retryAfter * 1000); // Calculate the new delay, capped at twice the backoff delay or the 'Retry-After' value multiplied by 10
          setBackoffDelay(newDelay); // Update the backoff delay for the next time for the next attempt
          showToast(`Rate limit exceeded. Retrying after ${newDelay / 1000} seconds...`, "warning", {
            clear: true,
            autoClose: true,
          });
          retryCount++;
          lastError = e;
          if (retryCount < 5) { // Implement a maximum number of retries
            await new Promise(resolve => setTimeout(resolve, newDelay));
            continue; // Retry after the delay
          } else {
            throw new Error(`Failed to process URL after ${retryCount}retries} retries: ${lastError.message}`);
          }
        } else {
          console.error(e);
          setErrors(prevErrors => [...prevErrors, e.message]); // Add error to the errors array
        }
      } finally {
        if (currentUrlIndex < urls.length - 1) {
          setCurrentUrlIndex(currentUrlIndex + 1); // Move to the next URL
        } else {
          setLoading(false);
          showToast('All transcripts processed.', 'info');
          setBackoffDelay(2000); // Reset the backoff delay for the next batch of URLs
        }
      }

      // Wait for 2 seconds before processing the next URL
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
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

