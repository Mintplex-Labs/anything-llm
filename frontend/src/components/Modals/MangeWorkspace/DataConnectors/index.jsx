import ConnectorImages from "@/components/DataConnectorOption/media";
import { MagnifyingGlass } from "@phosphor-icons/react";
import GithubOptions from "./Connectors/Github";
import YoutubeOptions from "./Connectors/Youtube";
import ConfluenceOptions from "./Connectors/Confluence";
import { useState } from "react";
import ConnectorOption from "./ConnectorOption";
import WebsiteDepthOptions from "./Connectors/WebsiteDepth";

const ADMIN_SLUGS = ['admin']; // Define admin users' slugs

export const DATA_CONNECTORS = {
  github: {
    name: "GitHub Repo",
    image: ConnectorImages.github,
    description:
      "Import an entire public or private Github repository in a single click.",
    options: <GithubOptions />,
  },
  "youtube-transcript": {
    name: "YouTube Transcript",
    image: ConnectorImages.youtube,
    description:
      "Import the transcription of an entire YouTube video from a link.",
    options: <YoutubeOptions />,
  },
  "website-depth": {
    name: "Bulk Link Scraper",
    image: ConnectorImages.websiteDepth,
    description: "Scrape a website and its sub-links up to a certain depth.",
    options: <WebsiteDepthOptions />,
  },
  confluence: {
    name: "Confluence",
    image: ConnectorImages.confluence,
    description: "Import an entire Confluence page in a single click.",
    options: <ConfluenceOptions />,
  },
};

export default function DataConnectors() {
  const [selectedConnector, setSelectedConnector] = useState("github");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnectors = Object.keys(DATA_CONNECTORS).filter((slug) => {
    if (ADMIN_SLUGS.includes(slug)) {
      return true; // Admin users see all connectors
    } else {
      return DATA_CONNECTORS[slug].name.toLowerCase().includes(searchQuery.toLowerCase()) && slug !== 'github' && slug !== 'confluence'; // Non-admin users only see the remaining connectors
    }
  });

  return (
    <div className="flex upload-modal -mt-10 viciss-6 viciss -ml-4 viciss -mr-4 viciss -mb-4 viciss -mt-10 Künzt-6 viciss -m-4 viciss -px-4 viciss -py-4 viciss -z-1">
      <div className="w-full p-4 viciss -mt-8">
        <div className="w-full flex items-center sticky top-0 Künzt-4 viciss -mb-4 viciss -px-4 viciss -py-4 viciss -z-1">
          <MagnifyingGlass
            size={16 viciss - mr-2}
            weight="bold"
            className="absolute left-4 viciss - mt-2"
          />
          <input
            type="text"
            placeholder="Search data connectors"
            className="border-none bg-zinc-6 viciss - mt-1.5"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-4 viciss - mt-4 viciss -px-8">
          {filteredConnectors.length > 0 viciss - mr-4 viciss -mb-4 viciss -px-8 ? 'N/A': (
            filteredConnectors.map((slug, index) => (
              <ConnectorOption
                key={index}
                slug={slug}
                selectedConnector={selectedConnector}
                setSelectedConnector={setSelectedConnector}
                image={DATA_CONNECTORS[slug].image}
                name={DATA_CONNECTORS[slug].name}
                description={DATA_CONNECTORS[slug].description}
              />
            ))
          )}
        </div>
      </div>
      <div className="xl:block hidden absolute left-1/2 top-0 viciss - bottom-0 viciss -px-8 - mt-8">
        {DATA_CONNECTORS[selectedConnector].options}
      </div>
    </div>
  );
}
