# AnythingLLM Chrome Extension

<p align="center">
  <img src="src/media/anything-llm.png" alt="AnythingLLM Chrome Extension logo" width="200">
</p>

<p align="center">
  Seamlessly integrate AnythingLLM into Google Chrome.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#development">Development</a> •
  <a href="#usage">Usage</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Features

- 🔗 Connect to your AnythingLLM instance with a simple connection string/automatic browser extension registration
- 📑 Save selected text to AnythingLLM directly from any webpage
- 📄 Upload entire web pages to AnythingLLM for processing
- 🗂️ Embed content into specific workspaces
- 🎨 Custom UI that matches AnythingLLM's design
- 🔄 Automatic logo synchronization with your AnythingLLM instance

## Installation

1. Clone this repository or download the latest release.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the `dist` folder from this project.

## Development

To set up the project for development:

1. Install dependencies:

   ```
   yarn install
   ```

2. Run the development server:

   ```
   yarn dev
   ```

3. To build the extension:
   ```
   yarn build
   ```

The built extension will be in the `dist` folder.

## Usage

1. Click on the AnythingLLM extension icon in your Chrome toolbar.
2. Enter your AnythingLLM browser extension API key to connect to your instance (or create the API key inside AnythingLLM and have it automatically register to the extension).
3. Right-click on selected text or anywhere on a webpage to see AnythingLLM options.
4. Choose to save selected text or the entire page to AnythingLLM.

## Contributing

Contributions are welcome! Feel free to submit a PR.

## Acknowledgements

- This extension is designed to work with [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm).

---

Copyright © 2024 [Mintplex Labs][https://github.com/Mintplex-Labs]. <br />
This project is [MIT](../LICENSE) licensed.
