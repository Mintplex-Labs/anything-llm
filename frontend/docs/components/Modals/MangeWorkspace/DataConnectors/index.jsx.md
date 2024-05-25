```javascript
import ConnectorImages from "@/components/DataConnectorOption/media";
import { MagnifyingGlass } from "@phosphor-icons/react";
import GithubOptions from "./Connectors/Github";
import YoutubeOptions from "./Connectors/Youtube";
import ConfluenceOptions from "./Connectors/Confluence";
import { useState } from "react";
import ConnectorOption from "./ConnectorOption";
import WebsiteDepthOptions from "./Connectors/WebsiteDepth";

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
            className="border-none bg-zinc-600 z-20 pl-10 h-[38px] rounded-full w-full px-4 py-1 text-sm border-2 border-slate-300/40 outline-none focus:border-white text-white"
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

```
**DataConnectors Interface Documentation**

### Purpose and Usage

The DataConnectors interface provides a comprehensive list of data connectors that can be used to import various types of data into your application. This interface is designed to make it easy for users to browse and select the desired data connector, allowing them to easily integrate external data sources into their workflow.

### Methods

#### `DATA_CONNECTORS`

* **Signature:** `export const DATA_CONNECTORS = { ... };`
* **Purpose:** The `DATA_CONNECTORS` object provides a list of available data connectors.
* **Return Type:** An object containing the names, images, and descriptions of the available data connectors.

Example:
```json
{
  "github": {
    "name": "GitHub Repo",
    "image": ConnectorImages.github,
    "description": "Import an entire public or private Github repository in a single click.",
    "options": <GithubOptions />
  },
  "youtube-transcript": {
    "name": "YouTube Transcript",
    "image": ConnectorImages.youtube,
    "description": "Import the transcription of an entire YouTube video from a link.",
    "options": <YoutubeOptions />
  },
  ...
}
```
#### `DataConnectors`

* **Signature:** `export default function DataConnectors() { ... };`
* **Purpose:** The `DataConnectors` function renders a UI component that allows users to browse and select data connectors.
* **Return Type:** A React component that displays a list of available data connectors and their corresponding options.

Example:
```jsx
import { useState } from 'react';
import ConnectorOption from './ConnectorOption';

function DataConnectors() {
  const [selectedConnector, setSelectedConnector] = useState('github');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConnectors = Object.keys(DATA_CONNECTORS).filter((slug) => 
    DATA_CONNECTORS[slug].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex upload-modal -mt-10 relative min-h-[80vh] w-[70vw]">
      ...
    </div>
  );
}
```
### Examples

To use the `DataConnectors` interface, simply import it into your React application and render the `DataConnectors` component:
```jsx
import React from 'react';
import DataConnectors from './DataConnectors';

const App = () => {
  return (
    <div>
      <DataConnectors />
    </div>
  );
};
```
### Dependencies

The `DataConnectors` interface depends on the following dependencies:

* `@phosphor-icons/react`: provides icons for the UI component
* `react`: used to render the UI component
* `useState`: used to manage state in the `DataConnectors` function

### Clarity and Consistency

The documentation has been written to be clear, concise, and consistent in style and terminology. The interface is designed to be easy to use and understand, with a focus on providing a comprehensive list of data connectors that can be easily integrated into your application.