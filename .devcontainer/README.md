# AnythingLLM Development Container Setup

Welcome to the AnythingLLM development container configuration, designed to create a seamless and feature-rich development environment for this project.

<center><h1><b>PLEASE READ THIS</b></h1></center>

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code extension

## Features

- **Base Image**: Built on `mcr.microsoft.com/devcontainers/javascript-node:1-18-bookworm`, thus Node.JS LTS v18.
- **Additional Tools**: Includes `hadolint`, and essential apt-packages such as `curl`, `gnupg`, and more.
- **Ports**: Configured to auto-forward ports `3000` (Frontend) and `3001` (Backend).
- **Environment Variables**: Sets `NODE_ENV` to `development` and `ESLINT_USE_FLAT_CONFIG` to `true`.
- **VS Code Extensions**: A suite of extensions such as `Prettier`, `Docker`, `ESLint`, and more are automatically installed. Please revise if you do not agree with any of these extensions. AI-powered extensions and time trackers are (for now) not included to avoid any privacy concerns, but you can install them later in your own environment.

## Getting Started

1. Using Github Codepaces. Just select to create a new workspace, and the devcontainer will be created for you.

2. Using your Local VSCode (Release or Insiders). We suggest you first make a fork of the repo and then clone it to your local machine using VSCode tools. Then open the project folder in VSCode, which will prompt you to open the project in a devcontainer. Select yes, and the devcontainer will be created for you. If this does not happen, you can open the command palette and select "Remote-Containers: Reopen in Container".

## On Creation:

When the container is built for the first time, it will automatically run `yarn setup` to ensure everything is in place for the Collector, Server and Frontend. This command is expected to be automatically re-run if there is a content change on next reboot.

## Work in the Container:

Once the container is up, be patient. Some extensions may complain because dependencies are still being installed, and in the Extensions tab, some may ask you to "Reload" the project. Don't do that yet. First, wait until all settle down for the first time. We suggest you create a new VSCode profile for this devcontainer, so any configuration and extensions you change, won't affect your default profile.

Checklist:

- [ ] The usual message asking you to start the Server and Frontend in different windows are now "hidden" in the building process of the devcontainer. Don't forget to do as suggested.
- [ ] Open a JavaScript file, for example "server/index.js" and check if `eslint` is working. It will complain that `'err' is defined but never used.`. This means it is working.
- [ ] Open a React File, for example, "frontend/src/main.jsx," and check if `eslint` complains about `Fast refresh only works when a file has exports. Move your component(s) to a separate file.`. Again, it means `eslint` is working. Now check at the status bar if the `Prettier` has a double checkmark :heavy_check_mark: (double). It means Prettier is working. You will see a nice extension `Formatting:`:heavy_check_mark: that can be used to disable the `Format on Save` feature temporarily. 
- [ ] Check if, on the left pane, you have the NPM Scripts (this may be disabled; look at the "Explorer" tree-dots up-right). There will be scripts inside the `package.json` files. You will basically need to run the `dev:collector`, `dev:server` and the `dev:frontend` in this order. When the frontend finishes starting, a window browser will open **inside** the VSCode. Still, you can open it outside.

:warning: **Important for all developers** :warning:

- [ ] Whe you are using the `NODE_ENV=development` the server will not store the configurations you set for security reasons. Please set the proper config on file `.env.development`. The side-effect if you don't, everytime you restart the server, you will be sent to the "Onboarding" page again.

:warning: **Important for Github Codespaces** :warning:

- [ ] When running the "Server" for the first time, its port will be automatically forward, but privately. Read the content of the `.env` file on the frontend folder about this, and make sure the port "Visibility" is set to "Public", so the frontend can reach the backend. Again, this is only needed for developing on Github Codespaces. We appreciate to know if you have a better solution.

**For the Collector:**

- [x] In the past, the Collector dwelled within the Python domain, but now it has journeyed to the splendid realm of Node.JS. Consequently, the configuration complexities of bygone versions are no longer a concern.

### Now it is ready to start

In the status bar you will see three shortcuts names `Collector`, `Server` and `Frontend`. Just click-and-wait on that order (don't forget to set the Server port 3001 to Public if you are using GH Codespaces **_before_** starting the Frontend).

Now you can enjoy your time developing instead of reconfiguring everything.

## Debugging with the devcontainers

### For debugging the collector, server and frontend

First, make sure the built-in extension (ms-vscode.js-debug) is active (I don't know why it would not be, but just in case). If you want, you can install the nightly version (ms-vscode.js-debug-nightly)

Then, in the "Run and Debug" tab (Ctrl+shift+D), you can select on the menu:

- Collector debug. This will start the collector in debug mode and attach the debugger. Works very well.
- Server debug. This will start the server in debug mode and attach the debugger. Works very well.
- Frontend debug. This will start the frontend in debug mode and attach the debugger. I am still struggling with this one. I don't know if VSCode can handle the .jsx files seamlessly as the pure .js on the server. Maybe there is a need for a particular configuration for Vite or React. Anyway, it starts. Another two configurations launch Chrome and Edge, and I think we could add breakpoints on .jsx files somehow. The best scenario would be always to use the embedded browser. WIP.

Please leave comments on the Issues tab or the [![](https://img.shields.io/discord/1114740394715004990?logo=Discord&logoColor=white&label=Discord&labelColor=%235568ee&color=%2355A2DD&link=https%3A%2F%2Fdiscord.gg%2F6UyHPeGZAC)]("https://discord.gg/6UyHPeGZAC")
