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

  const isAdminUser = (slug) => ADMIN_SLUGS.includes(slug);

  const filteredConnectors = Object.keys(DATA_CONNECTORS).filter((slug) => {
    if (isAdminUser(slug)) {
      return true; // Admin users see all connectors
    } else {
      return (
        DATA_CONNECTORS[slug].name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        slug !== 'github' &&
        slug !== 'confluence'
      ); // Non-admin users do not see github and confluence
    }
  });

  return (
    <div className="flex flex-col">
      <div className="w-full p-4">
        <div className="w-full flex items-center sticky top-0 p-4 z-10 bg-white">
          <MagnifyingGlass size={16} weight="bold" className="mr-2" />
          <input
            type="text"
            placeholder="Search data connectors"
            className="border p-2 w-full"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-4">
          {filteredConnectors.length > 0 ? (
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
          ) : (
            <p>No connectors found.</p>
          )}
        </div>
      </div>
      <div className="xl:block hidden absolute left-1/2 top-0 bottom-0 p-8">
        {DATA_CONNECTORS[selectedConnector].options}
      </div>
    </div>
  );
}
