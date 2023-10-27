# AnythingLLM Development Container Setup

Welcome to the AnythingLLM development container configuration, designed to create a seamless and feature-rich development environment for this project.

<center><h1><b>PLEASE READ THIS</b></h1></center>

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VS Code extension

## Features

- **Base Image**: Built on `mcr.microsoft.com/devcontainers/javascript-node:1-18-bookworm`, thus Node.JS LTS v18.
- **Python**: Comes with Python 3.11 (aligned with PEP 664) and related tools.
- **Additional Tools**: Includes `tailscale`, `hadolint`, `pandoc`, and essential apt-packages such as `curl`, `gnupg`, and more.
- **Ports**: Configured to auto-forward ports `3000` (Frontend) and `3001` (Backend).
- **Environment Variables**: Sets `NODE_ENV` to `development` and `ESLINT_USE_FLAT_CONFIG` to `true`.
- **VS Code Extensions**: A suite of extensions such as `Prettier`, `Docker`, `Python`, `Pylance`, `ESLint`, and more are automatically installed. Please revise if you do not agree with any of these extensions. AI-powered extensions and time trackers are (for now) not included to avoid any privacy concerns, but you can install them later in your own environment.

## Getting Started

1. Using Github Codepaces. Just select to create a new workspace, and the devcontainer will be created for you.

2. Using your Local VSCode (Release or Insiders). We suggest you first make a fork of the repo and then clone it to your local machine using VSCode tools. Then open the project folder in VSCode, which will prompt you to open the project in a devcontainer. Select yes, and the devcontainer will be created for you. If this does not happen, you can open the command palette and select "Remote-Containers: Reopen in Container".

## Post Creation:

After the container is built for the first time, it will automatically run `yarn run setup` to ensure everything is in place for the Server/Frontend part of the project. This means the Collector side project still needs to be configured manually. The initial setup will only create the bare `v-env` inside the collector's folder. Below, we will give some instructions on configuring and running the collector.

## Work in the Container:

Once the container is up, wait a little. Some extensions may complain because dependencies are still being installed, and in the Extensions tab, some may ask you to "Reload" the project. First, wait until all settle down for the first time.

Checklist:

- [ ] Check if, in the Terminal window, the script has finished asking you to start the Server and Frontend in different windows. If not, wait until it does.
- [ ] Open a JavaScript file, for example "server/index.js" and check if `eslint` is working. It will complain that `'err' is defined but never used.`. This means it is working.
- [ ] Open a React File, for example, "frontend/src/main.jsx," and check if `eslint` complains about `Fast refresh only works when a file has exports. Move your component(s) to a separate file.`. Again, it means `eslint` is working. Now check at the status bar if the `Prettier` has a double checkmark :heavy_check_mark: (double). It means Prettier is working.
- [ ] Check if, on the left pane, you have the NPM Scripts (this may be disabled; look at the "Explorer" tree-dots up-right). There will be scripts inside the `package.json` files. You will basically need to run the `dev:server` and the `dev:frontend`. When the frontend finishes starting, a window browser will open **inside** the VSCode. Still, you can open outside.

:warning: **Important for Github Codespaces** :warning:

- [ ] When running the "Server" for the first time, its port will be automatically forward. Read the content of the `.env` file on the frontend folder about this, and make sure the port "Visibility" is set to "Public", so the frontend can reach the backend. Again, this is only needed for developing on Github Codespaces. We appreciate to know if you have a better solution.

### For the Collector:

- [ ] Open any file inside the Collector folder. A new option in the status bar (on the left) will appear, colored yellow, called `install deps`. Click on it whenever you want to be sure the v-env is installed and up-to-date.
- [ ] To run the Collector, click the `run` option in the status bar. It will open a new terminal and run the collector. You can also run the collector from the terminal, but you must activate the v-env first if the VSCode doesn't do so automatically. To do so, run `source v-env/bin/activate` inside the collector folder and then run the collector with `python watch.py`.

### For the Collector again:

If you plan to develop the collector, currently (maybe not in a few months), you'll need to install the `pre-release` versions of the extensions to work as they should since MS is moving features around their extensions.

Make sure you have installed the following extensions as `pre-release`:

- Python (ms-python.python)
- Pylance (ms-python.vscode-pylance)
- Pylint (ms-python.pylint)
- Black formatter (ms-python.black-formatter)
- Python Debugger (ms-python.debugpy)

> These are the only extensions required to be installed as `pre-release` (on October 2023). The rest can be installed as you prefer.

## Debugging with the devcontainers

### For debugging the server and frontend

First, make sure the built-in extension (ms-vscode.js-debug) is active (I don't know why it would not be, but just in case). If you want, you can install the nightly version (ms-vscode.js-debug-nightly)

Then, in the "Run and Debug" tab (Ctrl+shift+D), you can select on the menu:

- Server debug. This will start the server in debug mode and attach the debugger. Works very well.
- Frontend debug. This will start the frontend in debug mode and attach the debugger. I am still struggling with this one. I don't know if VSCode can handle the .jsx files seamlessly as the pure .js on the server. Maybe there is a need for a particular configuration for Vite or React. Anyway, it starts. Another two configurations launch Chrome and Edge, and I think we could add breakpoints on .jsx files somehow. The best scenario would be always to use the embedded browser. WIP.

### For debugging the collector

- That is easy; just go to the "Run and Debug" tab (Ctrl+shift+D), and select "Python Debugger: Collector watch" and run. It will start the collector in debug mode and attach the debugger to it. Works very well.

Please leave comments on the Issues tab or the [![](https://img.shields.io/discord/1114740394715004990?logo=Discord&logoColor=white&label=Discord&labelColor=%235568ee&color=%2355A2DD&link=https%3A%2F%2Fdiscord.gg%2F6UyHPeGZAC)]("https://discord.gg/6UyHPeGZAC")
