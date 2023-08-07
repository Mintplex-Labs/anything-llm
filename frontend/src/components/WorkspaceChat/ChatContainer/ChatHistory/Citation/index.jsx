import { memo, useState } from "react";
import { Maximize2, Minimize2 } from "react-feather";
import { v4 } from "uuid";
import { decode as HTMLDecode } from "he";

function combineLikeSources(sources) {
  const combined = {};
  sources.forEach((source) => {
    const { id, title, text } = source;
    if (combined.hasOwnProperty(title)) {
      combined[title].text += `\n\n ---- Chunk ${id || ""} ---- \n\n${text}`;
      combined[title].references += 1;
    } else {
      combined[title] = { title, text, references: 1 };
    }
  });
  return Object.values(combined);
}

export default function Citations({ sources = [] }) {
  if (sources.length === 0) return null;

  return (
    <div className="flex flex-col mt-4 justify-left">
      <div className="flex flex-col justify-left overflow-x-scroll ">
        <div className="w-full flex overflow-x-scroll items-center gap-4 mt-1 doc__source">
          {combineLikeSources(sources).map((source) => (
            <Citation id={source?.id || v4()} source={source} />
          ))}
        </div>
      </div>
      <p className="w-fit text-gray-700 dark:text-stone-400 text-xs mt-1">
        *citations may not be relevant to end result.
      </p>
    </div>
  );
}

const Citation = memo(({ source, id }) => {
  const [maximized, setMaximized] = useState(false);
  const { references = 0, title, text } = source;
  if (title?.length === 0 || text?.length === 0) return null;
  const handleMinMax = () => {
    setMaximized(!maximized);
    Array.from(
      document?.querySelectorAll(
        `div[data-citation]:not([data-citation="${id}"])`
      )
    ).forEach((el) => {
      const func = maximized ? "remove" : "add";
      el.classList[func]("hidden");
    });
  };

  return (
    <div
      key={id || v4()}
      data-citation={id || v4()}
      className={`transition-all duration-300 relative flex flex-col w-full md:w-80 h-40 bg-gray-100 dark:bg-stone-800 border border-gray-700 dark:border-stone-800 rounded-lg shrink-0 ${
        maximized ? "md:w-full h-fit pb-4" : ""
      }`}
    >
      <div className="rounded-t-lg bg-gray-300 dark:bg-stone-900 px-4 py-2 w-full h-fit flex items-center justify-between">
        <p className="text-base text-gray-800 dark:text-slate-400 italic truncate w-3/4">
          {title}
        </p>
        <button
          onClick={handleMinMax}
          className="hover:dark:bg-stone-800 hover:bg-gray-200 dark:text-slate-400 text-gray-800 rounded-full p-1"
        >
          {maximized ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
      <div
        className={`overflow-hidden relative w-full ${
          maximized ? "overflow-y-scroll" : ""
        }`}
      >
        <p className="px-2 py-1 text-xs whitespace-pre-line text-gray-800 dark:text-slate-300 italic">
          {references > 1 && (
            <p className="text-xs text-gray-500 dark:text-slate-500 mb-2">
              referenced {references} times.
            </p>
          )}
          {HTMLDecode(text)}
        </p>
        <div
          className={`absolute bottom-0 flex w-full h-[20px] fade-up-border rounded-b-lg ${
            maximized ? "hidden" : ""
          }`}
        />
      </div>
    </div>
  );
});
