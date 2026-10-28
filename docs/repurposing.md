# Repurposing this fork

Rebranding, extending, and keeping up with upstream. For setup, see
[configuration.md](configuration.md).

## License

- The code is MIT licensed (`LICENSE`). You can use, change, sell and
  sublicense it, as long as the copyright and permission notice stays in copies
  of the software.
- The license covers the code, not the AnythingLLM name or logos. If you ship
  this as your own product, rebrand it. This is a plain reading of the license,
  not legal advice.
- `TERMS_SELF_HOSTED.md` is Mintplex Labs' privacy statement for their
  self-hosted product. Replace it with your own if you distribute this.

## Pulling in upstream updates

Upstream ships often. To merge a release:

```bash
git remote add upstream https://github.com/Mintplex-Labs/anything-llm.git
```

```bash
git fetch upstream --tags
```

```bash
git merge upstream/master
```

- Fork-specific work lives in new files (`deploy/`, `docs/`, two test files),
  so it does not conflict. The three edited upstream files are listed in
  [README.md](README.md#changes-compared-with-upstream); check them after each
  merge.
- After merging: reinstall dependencies in `server`, `collector` and
  `frontend`, run `npx prisma migrate deploy` in `server` (Docker does this on
  start), rebuild the frontend, and compare `docker/.env.example` with
  `deploy/openrouter.env.example` for new variables.
- Merging a release tag (for example `v1.19.1`) instead of `master` gives you
  a known version.
- Keep future changes the same way where you can: new files over edits, small
  edits over rewrites.

## Rebranding

### Without code

Under **Settings > Customization > Branding & Whitelabeling**:

| Setting | What it changes |
|---|---|
| Logo | The logo in the app and on the login page |
| App name | Only one sentence on the login page; it can be edited only when login is enabled |
| Footer links | Up to 3 links with icons, replacing the GitHub, docs and Discord icons |
| Support email | The "contact support" links |
| Page title and favicon | Browser tab, installed-app name and link previews (production only; the favicon must be an absolute URL) |
| Color palettes | Up to 20 palettes, one of which can be enforced for everyone |

Browsers cache the footer links, support email and app name for an hour, so
other users may see old values for a while.

### With code, most visible first

1. **Browser tab and link previews.** `server/utils/boot/MetaGenerator.js` holds
   the production defaults. The title and favicon settings above do not change
   the `og:url`, `og:image`, `og:description` or Twitter tags there.
   `frontend/index.html` holds the development version. Also replace
   `frontend/public/favicon.png`, `favicon.ico` and `manifest.json`.
2. **Logos.** Server defaults are `server/storage/assets/anything-llm.png` and
   `anything-llm-invert.png`. Frontend fallbacks are
   `frontend/src/media/logo/anything-llm.png` and `anything-llm-dark.png`. The
   login page mark is `frontend/src/media/illustrations/login-logo.svg` and
   `login-logo-light.svg`. Replacing only the server files still leaves the
   AnythingLLM mark on the login page, so either upload a logo in the UI or
   replace both sets. `frontend/public/anything-llm-dark.png` and
   `anything-llm-light.png` are unused but share names with built assets;
   replace or delete them too.
3. **Login and first-run wizard.** The "AnythingLLM" fallback name in
   `frontend/src/components/Modals/Password/` (`MultiUserAuth.jsx`,
   `SingleUserAuth.jsx`), the wizard's wordmark and logo in
   `frontend/src/pages/OnboardingFlow/Steps/Home/`,
   and the survey (text, the `onboarding.anythingllm.com` URL in
   `frontend/src/utils/constants.js`, and a mailto link).
4. **Sidebar.** Default footer icons (`frontend/src/components/Footer/index.jsx`,
   `frontend/src/utils/paths.js`), and the version label that links to
   Mintplex's GitHub releases (`frontend/src/components/SettingsSidebar/index.jsx`).
5. **UI text.** `frontend/src/locales/en/common.js` has 27 mentions. Edit
   English first, then the other 31 languages (`yarn translations:verify` checks
   them; `extras/translator` can regenerate them with a local model through
   Ollama).
6. **Hard-coded text and icons elsewhere.** Provider privacy blurbs
   (`frontend/src/components/ProviderPrivacy/constants.js`), export file names,
   confirmation dialogs, the privacy page
   (`frontend/src/pages/GeneralSettings/PrivacyAndData/index.jsx`), the
   Community Hub pages, and the icons `anything-llm-icon.png` and
   `anything-llm-infinity.png` in `frontend/src/media/logo/`. In total the
   frontend source outside the locale files has about 240 mentions of
   AnythingLLM or Mintplex across 82 files; about 70 are user-facing text.
7. **Links.** docs.anythingllm.com, hub.anythingllm.com, Discord and GitHub in
   `frontend/src/utils/paths.js`, plus a few inline links (for example on the MCP
   page).
8. **Outside the main UI.**
   - The embed widget (`frontend/public/embed/anythingllm-chat-widget.min.js`,
     built from the `embed` submodule) says "Powered by AnythingLLM". Each site
     can override its text with `data-*` attributes on the script tag.
   - Files the agent creates (`server/utils/agents/aibitat/plugins/create-files/`)
     carry AnythingLLM logos and metadata.
   - The chat export header (`server/utils/chats/exportChatToFile.js`), the push
     notification title (`frontend/public/service-workers/push-notifications.js`)
     and the Telegram bot's messages (`server/utils/telegramBot/`).
   - The server's User-Agent, `AnythingLLM/<version>` (`server/endpoints/utils.js`).
9. **How the app identifies itself to OpenRouter.** See the patch list below.

### Leave these names alone

They are identifiers, not branding. Renaming them breaks things:

- `anythingllm_*` localStorage keys (renaming logs every user out)
- the `anythingllm-router` provider value
- the `anythingllm` key in the MCP config file
- `anythingllm.db`, the embed widget's file name, and `@mintplex-labs/*` packages

## Building on it

- **Your own frontend or integration.** Use the developer API under `/api/v1`
  with a key from **Settings > Tools > Developer API**, sent as
  `Authorization: Bearer <key>`. The OpenAPI spec is `server/swagger/openapi.json`
  (also browsable at `/api/docs` when `DISABLE_SWAGGER_DOCS` is not `"true"`).
  `/api/v1/openai/*` speaks the OpenAI chat API, with the workspace slug as the
  model name, so OpenAI-compatible tools can talk to a workspace directly.
- **Custom agent skills without touching core code.** A folder in
  `storage/plugins/agent-skills/<name>/` with a `plugin.json` and a `handler.js`.
  The manifest format is in `server/utils/agents/imported-manifest.schema.json`.
  Skills run inside the server process with full access.
- **No-code tools.** Agent flows (**Settings > Agent Skills**, flow builder) chain
  API calls, web scraping and LLM steps. MCP servers add tools from any MCP
  package.
- **A new LLM provider.** Only needed for an API that is not OpenAI-compatible;
  otherwise use the Generic OpenAI provider. Files to touch:
  - `server/utils/AiProviders/<name>/index.js`: the class. Copy the OpenRouter
    one for the method list (`constructPrompt`, `getChatCompletion`,
    `streamGetChatCompletion`, `handleStream`, `promptWindowLimit`,
    `compressMessages` and the embedder pass-throughs).
  - `server/utils/helpers/index.js`: add it to `getLLMProviderConnector`,
    `getLLMProviderClass` and `getBaseLLMProviderModel`.
  - `server/utils/helpers/updateENV.js`: its env keys in `KEY_MAPPING`, and its
    name in `supportedLLM`.
  - `server/models/systemSettings.js`: expose its settings in `currentSettings()`.
  - For agents: `server/utils/agents/aibitat/providers/<name>.js`, the
    `providers/index.js` export, `server/utils/agents/aibitat/index.js`
    (provider construction) and `server/utils/agents/index.js` (key checks and
    default model).
  - Frontend: an options component in `frontend/src/components/LLMSelection/`,
    entries in `frontend/src/pages/GeneralSettings/LLMPreference/index.jsx`, the
    onboarding list, and a logo in `frontend/src/media/llmprovider/`.
- **A new vector database.** Extend `server/utils/vectorDbProviders/base.js`,
  then register it in `getVectorDbClass` and `supportedVectorDB`.
- **A new data connector.** Collector side in `collector/utils/extensions/` and
  `collector/extensions/index.js`; server pass-through in
  `server/endpoints/extensions/`; frontend client in
  `frontend/src/models/dataConnector.js` plus its UI.

## Optional patches worth considering

None of these are needed to run the app. Each is a small change with the
location given.

| Change | Where | Why |
|---|---|---|
| Send your own app name and URL to OpenRouter | `HTTP-Referer` and `X-Title` headers in `server/utils/AiProviders/openRouter/index.js`, `server/utils/EmbeddingEngines/openRouter/index.js`, `server/utils/agents/aibitat/providers/openrouter.js`, `server/utils/agents/aibitat/providers/ai-provider.js`, `server/utils/ImageGenerators/openRouter/index.js` | Usage currently shows up as AnythingLLM on OpenRouter. If made configurable through new env vars, also add them to the `protectedKeys` list in `dumpENV` (`updateENV.js`) or the first UI save drops them |
| Default new workspaces to Query or Chat mode | `server/models/workspace.js` (the `chatMode` set when creating a workspace) | Agent mode does not guarantee retrieval |
| Turn telemetry off in code | `server/models/telemetry.js` (the client setup), then remove `posthog-node` | Removes reliance on the env var |
| Remove the Community Hub | `communityHubEndpoints` in `server/index.js`, and the menu entries | It has no off switch |
| Stop Google favicon lookups for cited links | `frontend/src/components/WorkspaceChat/ChatContainer/ChatHistory/Citation/index.jsx` | The browser tells Google which sites were cited |
| Self-host model downloads | The `cdn.anythingllm.com` fallback hosts in `server/utils/EmbeddingEngines/native/index.js` and `server/utils/EmbeddingRerankers/native/index.js` | For air-gapped or strict networks |

## Upstream issues found while reviewing

Found by reading the code at v1.19.0, not reported upstream by us:

- `WorkspaceChats.upsert` returns `chat: undefined`, because it destructures a
  field Prisma's result does not have (`server/models/workspaceChats.js`). The
  final stream message then carries no chat id.
- A workspace chat history length of 0 is read as 20 (`|| 20` in
  `server/utils/chats/stream.js` and `apiChatHandler.js`).
- When a model asks for several tools at once, only the first one runs
  (`server/utils/agents/aibitat/providers/helpers/tooled.js`).
- Single-user password mode runs two bcrypt operations on every API request,
  synchronously (`server/utils/middleware/validatedRequest.js`). Multi-user mode
  avoids this.
- The memory extraction interval defaults to 3 hours in code, but the env
  examples say 15 minutes.
- The env examples suggest `create-word-file` for `AGENT_AUTO_APPROVED_SKILLS`;
  the tool is called `create-docx-file`.
- The doc comment in `server/utils/agents/aibitat/providers/openrouter.js` says
  native tool calling has to be turned on by env var. It is on by default.

## Repository housekeeping

- **GitHub Actions.** Check whether Actions are enabled for this repo. If they
  are, or before you turn them on, disable these in the Actions tab (disabling
  keeps the files, so upstream merges stay clean):
  - `sponsors.yaml` and `cleanup-qa-tag.yaml` need Mintplex's secrets.
  - `build-and-push-image.yaml` builds amd64 and arm64 images on every push to
    `master` and pushes them to `ghcr.io/<owner>/<repo>`. Keep it only if you
    want that.
  - The lint and test workflows run on pull requests and need no secrets.
- `.github/FUNDING.yml` points the Sponsor button at Mintplex, and
  `.github/ISSUE_TEMPLATE/config.yml` links to their Discord.
- The `embed` and `browser-extension` submodules point at Mintplex repos and are
  empty in this checkout. Nothing in the build needs them; the built embed
  widget is already in `frontend/public/embed/`.
- The templates in `cloud-deployments/` (AWS, GCP, DigitalOcean, Kubernetes,
  Hugging Face Spaces, Helm) run upstream's `mintplexlabs/anythingllm` image,
  not this fork, and only Helm turns telemetry off. To deploy the fork, build
  and push your own image and point them at it.
