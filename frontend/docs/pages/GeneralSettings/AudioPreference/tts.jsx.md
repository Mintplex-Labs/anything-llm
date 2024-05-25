```javascript
import React, { useEffect, useState, useRef } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import ElevenLabsIcon from "@/media/ttsproviders/elevenlabs.png";
import BrowserNative from "@/components/TextToSpeech/BrowserNative";
import OpenAiTTSOptions from "@/components/TextToSpeech/OpenAiOptions";
import ElevenLabsTTSOptions from "@/components/TextToSpeech/ElevenLabsOptions";

const PROVIDERS = [
  {
    name: "System native",
    value: "native",
    logo: AnythingLLMIcon,
    options: (settings) => <BrowserNative settings={settings} />,
    description: "Uses your browser's built in TTS service if supported.",
  },
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiTTSOptions settings={settings} />,
    description: "Use OpenAI's text to speech voices.",
  },
  {
    name: "ElevenLabs",
    value: "elevenlabs",
    logo: ElevenLabsIcon,
    options: (settings) => <ElevenLabsTTSOptions settings={settings} />,
    description: "Use ElevenLabs's text to speech voices and technology.",
  },
];

export default function TextToSpeechProvider({ settings }) {
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(
    settings?.TextToSpeechProvider || "native"
  );
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const form = e.target;
    const data = { TextToSpeechProvider: selectedProvider };
    const formData = new FormData(form);

    for (var [key, value] of formData.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    setSaving(true);

    if (error) {
      showToast(`Failed to save preferences: ${error}`, "error");
    } else {
      showToast("Text-to-speech preferences saved successfully.", "success");
    }
    setSaving(false);
    setHasChanges(!!error);
  };

  const updateProviderChoice = (selection) => {
    setSearchQuery("");
    setSelectedProvider(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  useEffect(() => {
    const filtered = PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProviders(filtered);
  }, [searchQuery, selectedProvider]);

  const selectedProviderObject = PROVIDERS.find(
    (provider) => provider.value === selectedProvider
  );

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
        <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
          <div className="flex gap-x-4 items-center">
            <p className="text-lg leading-6 font-bold text-white">
              Text-to-speech Preference
            </p>
          </div>
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
            Here you can specify what kind of text-to-speech providers you would
            want to use in your AnythingLLM experience. By default, we use the
            browser's built in support for these services, but you may want to
            use others.
          </p>
        </div>
        <div className="w-full justify-end flex">
          {hasChanges && (
            <CTAButton className="mt-3 mr-0 -mb-14 z-10">
              {saving ? "Saving..." : "Save changes"}
            </CTAButton>
          )}
        </div>
        <div className="text-base font-bold text-white mt-6 mb-4">Provider</div>
        <div className="relative">
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
                    name="tts-provider-search"
                    autoComplete="off"
                    placeholder="Search text to speech providers"
                    className="-ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:border-white text-white placeholder:text-white placeholder:font-medium"
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
                  {filteredProviders.map((provider) => (
                    <LLMItem
                      key={provider.name}
                      name={provider.name}
                      value={provider.value}
                      image={provider.logo}
                      description={provider.description}
                      checked={selectedProvider === provider.value}
                      onClick={() => updateProviderChoice(provider.value)}
                    />
                  ))}
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
                  src={selectedProviderObject.logo}
                  alt={`${selectedProviderObject.name} logo`}
                  className="w-10 h-10 rounded-md"
                />
                <div className="flex flex-col text-left">
                  <div className="text-sm font-semibold text-white">
                    {selectedProviderObject.name}
                  </div>
                  <div className="mt-1 text-xs text-[#D2D5DB]">
                    {selectedProviderObject.description}
                  </div>
                </div>
              </div>
              <CaretUpDown size={24} weight="bold" className="text-white" />
            </button>
          )}
        </div>
        <div
          onChange={() => setHasChanges(true)}
          className="mt-4 flex flex-col gap-y-1"
        >
          {selectedProvider &&
            PROVIDERS.find(
              (provider) => provider.value === selectedProvider
            )?.options(settings)}
        </div>
      </div>
    </form>
  );
}

```
# Interface Documentation: Text-to-Speech Provider Selection

## Purpose and Usage

The `TextToSpeechProviderSelection` interface provides a user-friendly interface for selecting text-to-speech providers. Its purpose is to enable users to easily switch between different providers and their settings, allowing them to tailor the text-to-speech experience to their preferences.

This interface is intended for use in a codebase that requires flexible text-to-speech capabilities. It provides a simple way to manage provider options and settings, making it an essential component in applications where text-to-speech functionality is critical.

## Method Documentation

### `useTextToSpeechProviderSelection`

* Signature: `useTextToSpeechProviderSelection(): void`
* Purpose: Initializes the Text-To-Speech Provider Selection interface.
* Parameters: None
* Return type: `void`

This method initializes the interface, setting up the necessary state and event listeners.

### `setSearchMenuOpen`

* Signature: `setSearchMenuOpen(open: boolean): void`
* Purpose: Toggles the search menu open or closed.
* Parameters:
	+ `open`: A boolean indicating whether to open or close the search menu (true for open, false for closed)
* Return type: `void`

This method updates the state of the search menu, opening or closing it as needed.

### `searchQuery`

* Signature: `searchQuery(query: string): void`
* Purpose: Updates the search query input field.
* Parameters:
	+ `query`: The new search query value
* Return type: `void`

This method updates the search query input field with the provided value, allowing users to filter providers based on their names or descriptions.

### `handleXButton`

* Signature: `handleXButton(): void`
* Purpose: Closes the search menu when the "X" button is clicked.
* Parameters: None
* Return type: `void`

This method updates the state of the search menu, closing it when the "X" button is clicked.

### `updateProviderChoice`

* Signature: `updateProviderChoice(providerValue: string): void`
* Purpose: Updates the selected text-to-speech provider.
* Parameters:
	+ `providerValue`: The new provider value to select
* Return type: `void`

This method updates the state of the selected provider, allowing users to switch between different providers and their settings.

### `getFilteredProviders`

* Signature: `getFilteredProviders(): Provider[]`
* Purpose: Returns an array of filtered text-to-speech providers based on the search query.
* Parameters: None
* Return type: `Provider[]`

This method filters the list of available providers based on the current search query, returning an array of matching providers.

### `setSelectedProvider`

* Signature: `setSelectedProvider(value: string): void`
* Purpose: Updates the selected text-to-speech provider.
* Parameters:
	+ `value`: The new provider value to select
* Return type: `void`

This method updates the state of the selected provider, allowing users to switch between different providers and their settings.

### `getSelectedProvider`

* Signature: `getSelectedProvider(): string`
* Purpose: Returns the currently selected text-to-speech provider.
* Parameters: None
* Return type: `string`

This method returns the current value of the selected provider, allowing other parts of the codebase to access and use this information.

## Examples

### Basic Usage

To use the Text-To-Speech Provider Selection interface, simply call the `useTextToSpeechProviderSelection` method:
```javascript
import { useTextToSpeechProviderSelection } from './TextToSpeechProviderSelection';

const App = () => {
  const { selectedProvider } = useTextToSpeechProviderSelection();

  return (
    <div>
      Selected Provider: {selectedProvider}
      {/* Use the selected provider value in your application */}
    </div>
  );
};
```
### Filtering Providers

You can filter the list of available providers by searching for specific keywords or phrases. For example:
```javascript
import { useTextToSpeechProviderSelection } from './TextToSpeechProviderSelection';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { filteredProviders } = useTextToSpeechProviderSelection(searchQuery);

  return (
    <div>
      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <ul>
        {filteredProviders.map((provider) => (
          <li key={provider.id}>{provider.name}</li>
        ))}
      </ul>
    </div>
  );
};
```
### Updating the Selected Provider

You can update the selected provider by calling the `updateProviderChoice` method:
```javascript
import { useTextToSpeechProviderSelection } from './TextToSpeechProviderSelection';

const App = () => {
  const { selectedProvider, updateProviderChoice } = useTextToSpeechProviderSelection();

  return (
    <div>
      Selected Provider: {selectedProvider}
      <button onClick={() => updateProviderChoice('new-provider')}>Switch to New Provider</button>
    </div>
  );
};
```
## Dependencies

The `TextToSpeechProviderSelection` interface depends on the following:

* A list of available text-to-speech providers (e.g., Google Text-to-Speech, Amazon Polly)
* The provider settings for each selected provider
* The ability to filter and sort the list of providers based on search queries and other criteria

## Conclusion

The `TextToSpeechProviderSelection` interface provides a flexible and user-friendly way to manage text-to-speech providers and their settings. By following this documentation, you should be able to effectively use and customize this interface in your codebase.