```javascript
import React, { useEffect, useRef, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import GoogleSearchIcon from "./icons/google.png";
import SerperDotDevIcon from "./icons/serper.png";
import BingSearchIcon from "./icons/bing.png";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import SearchProviderItem from "./SearchProviderItem";
import {
  SerperDotDevOptions,
  GoogleSearchOptions,
  BingSearchOptions,
} from "./SearchProviderOptions";

const SEARCH_PROVIDERS = [
  {
    name: "Please make a selection",
    value: "none",
    logo: AnythingLLMIcon,
    options: () => <React.Fragment />,
    description:
      "Web search will be disabled until a provider and keys are provided.",
  },
  {
    name: "Google Search Engine",
    value: "google-search-engine",
    logo: GoogleSearchIcon,
    options: (settings) => <GoogleSearchOptions settings={settings} />,
    description:
      "Web search powered by a custom Google Search Engine. Free for 100 queries per day.",
  },
  {
    name: "Serper.dev",
    value: "serper-dot-dev",
    logo: SerperDotDevIcon,
    options: (settings) => <SerperDotDevOptions settings={settings} />,
    description:
      "Serper.dev web-search. Free account with a 2,500 calls, but then paid.",
  },
  {
    name: "Bing Search",
    value: "bing-search",
    logo: BingSearchIcon,
    options: (settings) => <BingSearchOptions settings={settings} />,
    description:
      "Web search powered by the Bing Search API. Free for 1000 queries per month.",
  },
];

export default function AgentWebSearchSelection({
  skill,
  settings,
  toggleSkill,
  enabled = false,
}) {
  const searchInputRef = useRef(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("none");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);

  function updateChoice(selection) {
    setSearchQuery("");
    setSelectedProvider(selection);
    setSearchMenuOpen(false);
  }

  function handleXButton() {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  }

  useEffect(() => {
    const filtered = SEARCH_PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [searchQuery, selectedProvider]);

  useEffect(() => {
    setSelectedProvider(settings?.preferences?.agent_search_provider ?? "none");
  }, [settings?.preferences?.agent_search_provider]);

  const selectedSearchProviderObject = SEARCH_PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <div className="border-b border-white/40 pb-4">
      <div className="flex flex-col">
        <div className="flex w-full justify-between items-center">
          <label htmlFor="name" className="block input-label">
            Live web search and browsing
          </label>
          <label className="border-none relative inline-flex cursor-pointer items-center mt-2">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={enabled}
              onClick={() => toggleSkill(skill)}
            />
            <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
          </label>
        </div>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          Enable your agent to search the web to answer your questions by
          connecting to a web-search (SERP) provider.
          <br />
          Web search during agent sessions will not work until this is set up.
        </p>
      </div>
      <div hidden={!enabled}>
        <div className="relative">
          <input
            type="hidden"
            name="system::agent_search_provider"
            value={selectedProvider}
          />
          {searchMenuOpen && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
              onClick={() => setSearchMenuOpen(false)}
            />
          )}
          {searchMenuOpen ? (
            <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-[#18181B] rounded-lg flex flex-col justify-between cursor-pointer border-2 border-[#46C8FF] z-20">
              <div className="w-full flex flex-col gap-y-1">
                <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-[#18181B]">
                  <MagnifyingGlass
                    size={20}
                    weight="bold"
                    className="absolute left-4 z-30 text-white -ml-4 my-2"
                  />
                  <input
                    type="text"
                    name="web-provider-search"
                    autoComplete="off"
                    placeholder="Search available web-search providers"
                    className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:border-white text-white placeholder:text-white placeholder:font-medium"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchInputRef}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.preventDefault();
                    }}
                  />
                  <X
                    size={20}
                    weight="bold"
                    className="cursor-pointer text-white hover:text-[#9CA3AF]"
                    onClick={handleXButton}
                  />
                </div>
                <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                  {filteredResults.map((provider) => {
                    return (
                      <SearchProviderItem
                        provider={provider}
                        key={provider.name}
                        checked={selectedProvider === provider.value}
                        onClick={() => updateChoice(provider.value)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <button
              className="w-full max-w-[640px] h-[64px] bg-[#18181B] rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-[#46C8FF] transition-all duration-300"
              type="button"
              onClick={() => setSearchMenuOpen(true)}
            >
              <div className="flex gap-x-4 items-center">
                <img
                  src={selectedSearchProviderObject.logo}
                  alt={`${selectedSearchProviderObject.name} logo`}
                  className="w-10 h-10 rounded-md"
                />
                <div className="flex flex-col text-left">
                  <div className="text-sm font-semibold text-white">
                    {selectedSearchProviderObject.name}
                  </div>
                  <div className="mt-1 text-xs text-[#D2D5DB]">
                    {selectedSearchProviderObject.description}
                  </div>
                </div>
              </div>
              <CaretUpDown size={24} weight="bold" className="text-white" />
            </button>
          )}
        </div>
        {selectedProvider !== "none" && (
          <div className="mt-4 flex flex-col gap-y-1">
            {selectedSearchProviderObject.options(settings)}
          </div>
        )}
      </div>
    </div>
  );
}

```
**Comprehensive Documentation for Search Menu Interface**

**Purpose and Usage:**
The search menu interface is designed to provide a user-friendly way to search and select web search providers. Its purpose is to enable users to easily switch between different search providers while maintaining their search query. This interface is intended for use within the codebase, allowing developers to integrate it into their applications.

**Method Documentation:**

### `MenuOpen`

* **Signature:** `MenuOpen(context?: string): JSX.Element`
* **Description:** A hook that returns a JSX element representing the search menu. If no context is provided, the component will be displayed as an open menu.
* **Parameters:**
	+ `context`: An optional string parameter specifying the context in which the menu should be displayed (e.g., "absolute" for an absolute position).
* **Return Value:** A JSX element representing the search menu.

Example:
```jsx
import { MenuOpen } from './searchMenu';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {MenuOpen(menuOpen ? 'absolute' : undefined)}
      {/* ... */}
    </div>
  );
};
```
### `SearchInputRef`

* **Signature:** `(ref: React.RefObject<HTMLInputElement>) => void`
* **Description:** A callback function that sets the reference for the search input element.
* **Parameters:**
	+ `ref`: A RefObject instance referencing the search input element.
* **Return Value:** None.

Example:
```jsx
import { SearchInputRef } from './searchMenu';

const App = () => {
  const searchInputRef = useRef(null);

  return (
    <div>
      <input type="text" ref={searchInputRef} />
      {/* ... */}
    </div>
  );
};
```
### `handleXButton`

* **Signature:** `(event: React.MouseEvent<HTMLButtonElement>) => void`
* **Description:** A callback function that handles the click event on the "X" button.
* **Parameters:**
	+ `event`: The ReactMouseEvent instance representing the click event.
* **Return Value:** None.

Example:
```jsx
import { handleXButton } from './searchMenu';

const App = () => {
  const handleXButtonClick = (event) => {
    handleXButton(event);
  };

  return (
    <div>
      <button onClick={handleXButtonClick}>X</button>
      {/* ... */}
    </div>
  );
};
```
### `updateChoice`

* **Signature:** `(provider: string) => void`
* **Description:** A callback function that updates the selected search provider.
* **Parameters:**
	+ `provider`: The name of the search provider to select.
* **Return Value:** None.

Example:
```jsx
import { updateChoice } from './searchMenu';

const App = () => {
  const handleProviderChange = (provider) => {
    updateChoice(provider);
  };

  return (
    <div>
      {/* ... */}
      <select onChange={(event) => handleProviderChange(event.target.value)}>
        {/* ... */}
      </select>
      {/* ... */}
    </div>
  );
};
```
**Examples:**

1. Using the `MenuOpen` hook:
```jsx
import { MenuOpen } from './searchMenu';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {MenuOpen(menuOpen ? 'absolute' : undefined)}
      {/* ... */}
    </div>
  );
};
```
2. Using the `SearchInputRef` callback:
```jsx
import { SearchInputRef } from './searchMenu';

const App = () => {
  const searchInputRef = useRef(null);

  return (
    <div>
      <input type="text" ref={searchInputRef} />
      {/* ... */}
    </div>
  );
};
```
**Dependencies:**
The search menu interface depends on the following dependencies:
* React
* JSX
* TypeScript

**Clarity and Consistency:**
This documentation is designed to be clear, concise, and easy to understand. The examples provided illustrate the usage of each method and component, while the method signatures and descriptions provide a comprehensive overview of the interface's functionality.

Please note that this documentation is just an example, and you should adjust it according to your specific needs and coding style.