import ConnectorImages from "@/components/DataConnectorOption/media";
import { MagnifyingGlass } from "@phosphor-icons/react";
import GithubOptions from "./Connectors/Github";
import GitlabOptions from "./Connectors/Gitlab";
import YoutubeOptions from "./Connectors/Youtube";
import ConfluenceOptions from "./Connectors/Confluence";
import GoogleDocsOptions from "./Connectors/GoogleDocs";
import { useState } from "react";
import ConnectorOption from "./ConnectorOption";
import WebsiteDepthOptions from "./Connectors/WebsiteDepth";

const createConnectorOptions = (workspace) => ({
  github: {
    name: "GitHub Repo",
    image: ConnectorImages.github,
    description:
      "Import an entire public or private Github repository in a single click.",
    options: <GithubOptions workspace={workspace} />,
  },
  gitlab: {
    name: "GitLab Repo",
    image: ConnectorImages.gitlab,
    description:
      "Import an entire public or private GitLab repository in a single click.",
    options: <GitlabOptions workspace={workspace} />,
  },
  "youtube-transcript": {
    name: "YouTube Transcript",
    image: ConnectorImages.youtube,
    description:
      "Import the transcription of an entire YouTube video from a link.",
    options: <YoutubeOptions workspace={workspace} />,
  },
  "website-depth": {
    name: "Bulk Link Scraper",
    image: ConnectorImages.websiteDepth,
    description: "Scrape a website and its sub-links up to a certain depth.",
    options: <WebsiteDepthOptions workspace={workspace} />,
  },
  confluence: {
    name: "Confluence",
    image: ConnectorImages.confluence,
    description: "Import an entire Confluence page in a single click.",
    options: <ConfluenceOptions workspace={workspace} />,
  },
  googledocs: {
    name: "Google Documents",
    image: ConnectorImages.googledocs,
    description: "Import documents directly from your Google Drive.",
    options: <GoogleDocsOptions workspace={workspace} />,
  },
});

export default function DataConnectors({ workspace, systemSettings }) {
  const [selectedConnector, setSelectedConnector] = useState("github");
  const [searchQuery, setSearchQuery] = useState("");

  // Return early if no workspace is provided
  if (!workspace) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <p className="text-white text-opacity-80">Loading workspace...</p>
      </div>
    );
  }

  const DATA_CONNECTORS = createConnectorOptions(workspace);

  const filteredConnectors = Object.keys(DATA_CONNECTORS).filter((slug) =>
    DATA_CONNECTORS[slug].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex upload-modal -mt-10 relative min-h-[80vh] w-[70vw]">
      <div className="w-full p-4 top-0 z-20">
        <div className="w-full flex items-center sticky top-0 z-50">
          <MagnifyingGlass
            size={16}
            weight="bold"
            className="absolute left-4 z-30 text-white"
          />
          <input
            type="text"
            placeholder="Search data connectors"
            className="border-none z-20 pl-10 h-[38px] rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-settings-input-placeholder text-white bg-theme-settings-input-bg"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-2 flex flex-col gap-y-2">
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
            <div className="text-white text-center mt-4">
              No data connectors found.
            </div>
          )}
        </div>
      </div>
      <div className="xl:block hidden absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-white/20 -translate-x-1/2"></div>
      <div className="w-full p-4 top-0 text-white min-w-[500px]">
        {DATA_CONNECTORS[selectedConnector].options}
      </div>
    </div>
  );
}
