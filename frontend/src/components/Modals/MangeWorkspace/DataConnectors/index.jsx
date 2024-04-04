import ConnectorImages from "@/components/DataConnectorOption/media";
import { MagnifyingGlass } from "@phosphor-icons/react";
import GithubOptions from "./Connectors/Github";
import YoutubeOptions from "./Connectors/Youtube";
import { useState } from "react";

export default function DataConnectors() {
  const [selectedConnector, setSelectedConnector] = useState("github");
  const [searchQuery, setSearchQuery] = useState("");

  const DATA_CONNECTORS = {
    github: {
      name: "GitHub Repo",
      image: ConnectorImages.github,
      description:
        "Import an entire public or private Github repository in a single click.",
      link: "https://github.com",
      options: <GithubOptions />,
    },
    "youtube-transcript": {
      name: "YouTube Transcript",
      image: ConnectorImages.youtube,
      description:
        "Import the transcription of an entire YouTube video from a link.",
      link: "https://youtube.com",
      options: <YoutubeOptions />,
    },
  };

  const filteredConnectors = Object.keys(DATA_CONNECTORS).filter((slug) =>
    DATA_CONNECTORS[slug].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex upload-modal -mt-10 min-h-[400px]">
      <div className="w-full p-4 top-0 backdrop-blur-sm z-20">
        <div className="w-full flex items-center sticky top-0 z-50 min-w-[500px]">
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-4 z-30 text-white"
          />
          <input
            type="text"
            placeholder="Search data connectors"
            className="bg-zinc-600 z-20 pl-10 h-[38px] rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Render options */}
        <div className="mt-2">
          {filteredConnectors.length > 0 ? (
            filteredConnectors.map((slug, index) => (
              <button
                onClick={() => setSelectedConnector(slug)}
                key={index}
                className="flex text-left gap-x-3.5 items-center py-2 px-4 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <img
                  src={DATA_CONNECTORS[slug].image}
                  alt={DATA_CONNECTORS[slug].name}
                  className="w-[40px] h-[40px] rounded-md"
                />
                <div className="flex flex-col">
                  <div className="text-white font-bold text-[14px]">
                    {DATA_CONNECTORS[slug].name}
                  </div>
                  <div>
                    <p className="text-[12px] text-white/60">
                      {DATA_CONNECTORS[slug].description}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-white text-center mt-4">
              No data connectors found.
            </div>
          )}
        </div>
      </div>
      <div className="w-[1px] bg-white mx-4 z-40"></div>
      {/* Options */}
      <div className="w-full p-4 top-0 backdrop-blur-sm text-white min-w-[500px]">
        {DATA_CONNECTORS[selectedConnector].options}
      </div>
    </div>
  );
}
