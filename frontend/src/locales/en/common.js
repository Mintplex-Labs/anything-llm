const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Welcome",
      getStarted: "Get Started",
    },
    llm: {
      title: "LLM Settings",
      description:
        "This tool works with a variety of LLM providers. The selected service will be used for chat interactions.",
    },
    userSetup: {
      title: "User Setup",
      description: "Configure your user settings.",
      howManyUsers: "How many people will use this instance?",
      justMe: "Just me",
      myTeam: "My team",
      instancePassword: "Instance Password",
      setPassword: "Would you like to set up a password?",
      passwordReq: "Passwords must be at least 8 characters.",
      passwordWarn:
        "Be sure to save this password – there is no password recovery.",
      adminUsername: "Admin account username",
      adminUsernameReq:
        "Username must have at least 6 characters and consist of lowercase letters, numbers, underscores, or hyphens (no spaces).",
      adminPassword: "Admin account password",
      adminPasswordReq: "Passwords must be at least 8 characters.",
      teamHint:
        "You will be the only admin by default. Once setup is finished, you can invite more users or admins. Don't lose your password, as only admins can reset passwords.",
    },
    data: {
      title: "Data & Privacy",
      description:
        "We value transparency and control regarding your personal data.",
      settingsHint:
        "These settings can be changed at any time in the configuration.",
    },
    survey: {
      title: "Welcome",
      description:
        "Help us tailor this tool to your needs (optional).",
      email: "What's your email?",
      useCase: "What will you use this system for?",
      useCaseWork: "For work",
      useCasePersonal: "For personal use",
      useCaseOther: "Other",
      comment: "How did you hear about this tool?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. – Let us know how you found us!",
      skip: "Skip survey",
      thankYou: "Thank you for your feedback!",
    },
    workspace: {
      title: "Create your first workspace",
      description:
        "Create your first workspace and get started right away.",
    },
  },
  common: {
    "workspaces-name": "Workspaces Name",
    error: "Error",
    success: "Success",
    user: "User",
    selection: "Model Selection",
    saving: "Saving...",
    save: "Save changes",
    previous: "Previous Page",
    next: "Next Page",
    optional: "Optional",
    yes: "Yes",
    no: "No",
  },

  settings: {
    title: "Instance Settings",
    system: "General Settings",
    invites: "Invites",
    users: "Users",
    workspaces: "Workspaces",
    "workspace-chats": "Workspace Chats",
    customization: "Customization",
    interface: "UI Preferences",
    branding: "Branding",
    chat: "Chat",
    "api-keys": "Developer API",
    llm: "LLM",
    transcription: "Transcription",
    embedder: "Embedding",
    "text-splitting": "Text Splitting & Chunking",
    "voice-speech": "Voice & Speech",
    "vector-database": "Vector Database",
    embeds: "Chat Embed",
    "embed-chats": "Chat Embed History",
    security: "Security",
    "event-logs": "Event Logs",
    privacy: "Privacy & Data",
    "ai-providers": "AI Providers",
    "agent-skills": "Agent Skills",
    admin: "Admin",
    tools: "Tools",
    "system-prompt-variables": "System Prompt Variables",
    "experimental-features": "Experimental Features",
    contact: "Contact Support",
    "browser-extension": "Browser Extension",
  },

  login: {
    "multi-user": {
      welcome: "Welcome",
      "placeholder-username": "Username",
      "placeholder-password": "Password",
      login: "Login",
      validating: "Validating...",
      "forgot-pass": "Forgot password",
      reset: "Reset",
    },
    "sign-in": {
      start: "Sign in to your",
      end: "account.",
    },
    "password-reset": {
      title: "Password Reset",
      description:
        "Provide the necessary information below to reset your password.",
      "recovery-codes": "Recovery Codes",
      "recovery-code": "Recovery Code {{index}}",
      "back-to-login": "Back to Login",
    },
  },

  welcomeMessage: {
    part1:
      "Welcome! This open-source AI tool turns all sorts of content (files, documents, etc.) into a chatbot you can interact with. It's BYOK (Bring-Your-Own-Keys) – so there are no subscriptions or ongoing charges for the tool itself.",
    part2:
      "With this tool, you can easily combine powerful AI technologies like OpenAI, GPT-4, LangChain, PineconeDB, ChromaDB, and more for increased productivity, in one convenient package.",
    part3:
      "You can run it completely locally on your computer with minimal overhead – no GPU required. Cloud and on-premises installations are possible too.\nThe AI ecosystem evolves daily. This solution makes it easily accessible.",
    githubIssue: "Create a GitHub issue",
    user1: "How do I get started?",
    part4:
      'It’s simple: Content is organized into “workspaces”. A workspace is a collection for files, documents, images, PDFs, etc. that get prepared for use by AI.\n\nYou can add and remove files at any time.',
    createWorkspace: "Create your first workspace",
    user2:
      "Is it like an AI Dropbox? Or can I chat with it as well?",
    part5:
      "It’s more than a smart Dropbox.\n\nThere are two main ways to chat with your data:\n\n<i>Query:</i> Your chats return answers or information pulled from documents in the workspace. The more documents, the smarter it gets!\n\n<i>Conversation:</i> Both documents and your ongoing chat influence AI knowledge. Great for corrections and real-time info.\n\nYou can switch modes <i>mid-conversation!</i>",
    user3: "Sounds great, I want to try it now!",
    part6: "Have fun!",
    starOnGitHub: "Star on GitHub",
    contact: "Contact",
  },

  "new-workspace": {
    title: "New Workspace",
    placeholder: "My Workspace",
  },

  "workspaces—settings": {
    general: "General Settings",
    chat: "Chat Settings",
    vector: "Vector Database",
    members: "Members",
    agent: "Agent Settings",
  },

  general: {
    vector: {
      title: "Vector Count",
      description: "Total number of vectors in your database.",
    },
    names: {
      description: "This only changes the display name of your workspace.",
    },
    message: {
      title: "Suggested Chat Messages",
      description:
        "Customize the messages suggested to users of this workspace.",
      add: "Add new message",
      save: "Save Messages",
      heading: "Explain to me",
      body: "the benefits of this tool",
    },
    pfp: {
      title: "Assistant Profile Image",
      description:
        "Customize the profile image for the assistant in this workspace.",
      image: "Workspace Image",
      remove: "Remove Workspace Image",
    },
    delete: {
      title: "Delete Workspace",
      description:
        "Delete this workspace and all contained data. This deletes the workspace for all users.",
      delete: "Delete Workspace",
      deleting: "Deleting Workspace...",
      "confirm-start": "You are about to delete your entire",
      "confirm-end":
        "workspace. This will remove all vector data in your database.\n\nOriginal files will remain untouched. This action is irreversible.",
    },
  },

  chat: {
    llm: {
      title: "Workspace LLM Provider",
      description:
        "The LLM provider and model that will be used for this workspace. By default, the instance-wide settings are used.",
      search: "Search all LLM providers",
    },
    model: {
      title: "Workspace Chat Model",
      description:
        "The chat model to use for this workspace. If empty, the default LLM will be used.",
      wait: "-- waiting for models --",
    },
    mode: {
      title: "Chat Mode",
      chat: {
        title: "Chat",
        "desc-start": "gives answers using the LLM's general knowledge",
        and: "and",
        "desc-end": "any found document context.",
      },
      query: {
        title: "Query",
        "desc-start": "gives answers",
        only: "only",
        "desc-end": "if document context is found.",
      },
    },
    history: {
      title: "Chat History",
      "desc-start":
        "The number of past chats included in short-term memory.",
      recommend: "Recommended: 20. ",
      "desc-end":
        "More than 45 may lead to failures depending on message size.",
    },
    prompt: {
      title: "System Prompt",
      description:
        "The prompt used in this workspace. Define context and instructions for the AI. Carefully craft your prompt for relevant answers.",
      history: {
        title: "System Prompt History",
        clearAll: "Clear All",
        noHistory: "No history available",
        restore: "Restore",
        delete: "Delete",
        deleteConfirm: "Do you want to delete this item?",
        clearAllConfirm:
          "Do you want to clear all history? This action cannot be undone.",
        expand: "Expand",
      },
    },
    refusal: {
      title: "Refusal response for missing context in query mode",
      "desc-start": "In",
      query: "query",
      "desc-end":
        "mode, you may return a custom message if no context is available.",
    },
    temperature: {
      title: "LLM Temperature",
      "desc-start":
        "Controls how 'creative' AI responses are.",
      "desc-end":
        "Higher values produce more creative (but possibly less reliable) answers.",
      hint: "See your LLM provider documentation for valid ranges.",
    },
  },

  "vector-workspace": {
    identifier: "Vector Database Identifier",
    snippets: {
      title: "Max Context Snippets",
      description:
        "Maximum number of context snippets to send per chat or query.",
      recommend: "Recommended: 4",
    },
    doc: {
      title: "Document similarity threshold",
      description:
        "Minimum similarity score for a source to be considered relevant. Higher means stricter relevance.",
      zero: "No restriction",
      low: "Low (score ≥ .25)",
      medium: "Medium (score ≥ .50)",
      high: "High (score ≥ .75)",
    },
    reset: {
      reset: "Reset Vector Database",
      resetting: "Clearing vectors...",
      confirm:
        "You are about to reset this workspace's database. This removes all embedded vector data.\n\nOriginal files stay untouched. This action cannot be undone.",
      error: "Database could not be reset!",
      success: "Database was reset!",
    },
  },

  agent: {
    "performance-warning":
      "Performance of LLMs without explicit tool-calling support depends on the model’s accuracy. Some skills may be limited.",
    provider: {
      title: "Workspace Agent LLM Provider",
      description:
        "LLM provider and model used for this workspace's @agent.",
    },
    mode: {
      chat: {
        title: "Workspace Agent Chat Model",
        description:
          "Chat model used for this workspace's @agent.",
      },
      title: "Workspace Agent Model",
      description:
        "LLM model used for this workspace's @agent.",
      wait: "-- waiting for models --",
    },
    skill: {
      title: "Default agent skills",
      description:
        "Enhance the base agent with these built-in skills. Applies to all workspaces.",
      rag: {
        title: "RAG & Long-term Memory",
        description:
          'Allow the agent to use local documents for answers, or to "remember" content for long-term recall.',
      },
      view: {
        title: "View & Summarize Documents",
        description:
          "Let the agent list and summarize currently embedded files.",
      },
      scrape: {
        title: "Scrape Websites",
        description:
          "Let the agent visit and scrape sites.",
      },
      generate: {
        title: "Generate Charts",
        description:
          "Let the agent create charts from provided data.",
      },
      save: {
        title: "Generate & Save Files to Browser",
        description:
          "Enable file generation and browser downloads by the agent.",
      },
      web: {
        title: "Live Web Search & Browsing",
        "desc-start":
          "Allow live web search by adding a web search (SERP) integration.",
        "desc-end":
          "Requires proper setup before using web search in agent sessions.",
      },
    },
  },

  recorded: {
    title: "Workspace Chats",
    description:
      "All recorded chats and messages sent by users, ordered by creation date.",
    export: "Export",
    table: {
      id: "ID",
      by: "Sent By",
      workspace: "Workspace",
      prompt: "Prompt",
      response: "Response",
      at: "Sent At",
    },
  },

  customization: {
    interface: {
      title: "UI Preferences",
      description: "Set your UI preferences for the application.",
    },
    branding: {
      title: "Branding",
      description: "Customize this instance with your own branding.",
    },
    chat: {
      title: "Chat",
      description: "Set your chat preferences for the application.",
      auto_submit: {
        title: "Auto-submit speech input",
        description:
          "Automatically submit speech input after a pause.",
      },
      auto_speak: {
        title: "Auto-speak responses",
        description: "Automatically speak AI responses.",
      },
      spellcheck: {
        title: "Enable Spellcheck",
        description:
          "Enable or disable spellcheck in the chat input field.",
      },
    },
    items: {
      theme: {
        title: "Theme",
        description: "Choose your preferred color theme.",
      },
      "show-scrollbar": {
        title: "Show Scrollbar",
        description: "Enable or disable the scrollbar in the chat window.",
      },
      "support-email": {
        title: "Support Email",
        description:
          "Set the support email address for users needing help.",
      },
      "app-name": {
        title: "Name",
        description: "Displayed name on the login page for all users.",
      },
      "chat-message-alignment": {
        title: "Chat Message Alignment",
        description:
          "Select text alignment mode for chat.",
      },
      "display-language": {
        title: "Display Language",
        description:
          "Choose the language for the user interface (if available).",
      },
      logo: {
        title: "Logo",
        description: "Upload a custom logo for all pages.",
        add: "Add logo",
        recommended: "Recommended size: 800 x 200",
        remove: "Remove",
        replace: "Replace",
      },
      "welcome-messages": {
        title: "Welcome Messages",
        description:
          "Set welcome messages for new users. Only non-admin users see these.",
        new: "New",
        system: "System",
        user: "User",
        message: "Message",
        assistant: "Chat Assistant",
        "double-click": "Double-click to edit...",
        save: "Save Messages",
      },
      "browser-appearance": {
        title: "Browser Appearance",
        description:
          "Customize browser tab appearance and title when the app is open.",
        tab: {
          title: "Title",
          description:
            "Set a custom tab title when the app is open in a browser.",
        },
        favicon: {
          title: "Favicon",
          description: "Use a custom favicon in the browser tab.",
        },
      },
      "sidebar-footer": {
        title: "Sidebar Footer Items",
        description:
          "Customize footer items at the bottom of the sidebar.",
        icon: "Icon",
        link: "Link",
      },
    },
  },

  api: {
    title: "API Keys",
    description:
      "API keys allow programmatic access and management of this instance.",
    link: "See the API documentation",
    generate: "Generate new API key",
    table: {
      key: "API Key",
      by: "Created By",
      created: "Created",
    },
  },

  llm: {
    title: "LLM Preference",
    description:
      "Credentials and settings for your chosen LLM chat and embedding provider. Keys must be current and correct for reliable service.",
    provider: "LLM Provider",
  },

  transcription: {
    title: "Transcription Model Preference",
    description:
      "Credentials and settings for your chosen transcription model provider. Keys must be valid, otherwise audio and media files can't be transcribed.",
    provider: "Transcription Provider",
    "warn-start":
      "Using the local whisper model with little RAM or CPU may stall processing of media files.",
    "warn-recommend":
      "Recommended: at least 2GB RAM and upload files <10MB.",
    "warn-end": "The needed model will auto-download on first use.",
  },

  embedding: {
    title: "Embedding Preference",
    "desc-start":
      "If your LLM doesn't have a built-in embedding engine, you may need to provide embedding credentials.",
    "desc-end":
      "Embedding means turning text into vectors. These credentials transform your data for processing.",
    provider: {
      title: "Embedding Provider",
      description:
        "No setup is needed when using a native embedding engine.",
    },
  },

  text: {
    title: "Text Splitting & Chunking Preferences",
    "desc-start":
      "Adjust how new documents are split and chunked before they’re inserted into your database.",
    "desc-end":
      "Edit only if you understand text-splitting and its side effects.",
    "warn-start": "Changes only affect",
    "warn-center": "newly embedded documents",
    "warn-end": ", not existing ones.",
    size: {
      title: "Text Chunk Size",
      description: "Maximum character length in a chunk.",
      recommend: "Embed model maximum length:",
    },
    overlap: {
      title: "Text Chunk Overlap",
      description: "Maximum character overlap between neighboring chunks.",
    },
  },

  vector: {
    title: "Vector Database",
    description:
      "Credentials and settings for how this instance works. Keep your keys current and correct.",
    provider: {
      title: "Vector Database Provider",
      description: "No setup needed for LanceDB.",
    },
  },

  embeddable: {
    title: "Embeddable Chat Widgets",
    description:
      "Public chat widgets linked to a specific workspace. Make workspaces publicly accessible with chat functionality.",
    create: "Create widget",
    table: {
      workspace: "Workspace",
      chats: "Sent Chats",
      Active: "Active Domains",
    },
  },

  "embed-chats": {
    title: "Embedded Chats",
    export: "Export",
    description:
      "All recorded chats and messages from your published embeds.",
    table: {
      embed: "Embed",
      sender: "Sender",
      message: "Message",
      response: "Response",
      at: "Sent At",
    },
  },

  multi: {
    title: "Multi-User Mode",
    description:
      "Set up your instance for teams by enabling multi-user mode.",
    enable: {
      "is-enable": "Multi-user mode is enabled",
      enable: "Enable multi-user mode",
      description:
        "You are the only admin by default. As admin, you set up accounts for new users and admins. Don't lose your password – only admins can reset passwords.",
      username: "Admin account username",
      password: "Admin account password",
    },
    password: {
      title: "Password Protection",
      description:
        "Protect your instance with a password. If forgotten, there is no recovery. Store it safely.",
    },
    instance: {
      title: "Password Protect Instance",
      description:
        "You are the only admin by default. As admin, create accounts for all users or admins. Do not lose your password.",
      password: "Instance Password",
    },
  },

  event: {
    title: "Event Logs",
    description:
      "See all actions and events happening in this instance, for monitoring.",
    clear: "Clear Event Logs",
    table: {
      type: "Event Type",
      user: "User",
      occurred: "Occurred At",
    },
  },

  privacy: {
    title: "Privacy & Data",
    description:
      "Set how this tool and connected providers manage your data.",
    llm: "LLM Selection",
    embedding: "Embedding Preference",
    vector: "Vector Database",
    anonymous: "Anonymous Telemetry Enabled",
  },

  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    obsidian: {
      name: "Obsidian",
      description: "Import an Obsidian vault with a single click.",
      vault_location: "Vault Location",
      vault_description:
        "Select your Obsidian vault folder to import all notes and their connections.",
      selected_files: "Found {{count}} markdown files",
      importing: "Importing vault...",
      import_vault: "Import Vault",
      processing_time:
        "This may take a while depending on the size of your vault.",
      vault_warning:
        "To avoid conflicts, make sure your Obsidian vault isn't open.",
    },
    github: {
      name: "GitHub Repo",
      description:
        "Import an entire public or private GitHub repository in one click.",
      URL: "GitHub Repo URL",
      URL_explained: "URL of the GitHub repo you want to import.",
      token: "GitHub Access Token",
      optional: "optional",
      token_explained: "Access token to avoid rate limiting.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", GitHub’s API may limit how many files can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary access token",
      token_explained_end: " to avoid this.",
      ignores: "File Ignores",
      git_ignore:
        "List in .gitignore format to ignore specific files. Press enter for each entry.",
      task_explained:
        "Once done, all files are available in the workspace document picker.",
      branch: "Branch to collect from.",
      branch_loading: "-- loading branches --",
      branch_explained: "Branch to collect files from.",
      token_information:
        "Without a <b>GitHub access token</b>, only <b>top-level</b> files can be collected due to API limits.",
      token_personal:
        "Get a free Personal Access Token from GitHub here.",
    },
    gitlab: {
      name: "GitLab Repo",
      description:
        "Import a public or private GitLab repo in one click.",
      URL: "GitLab Repo URL",
      URL_explained: "URL of the GitLab repo you want to import.",
      token: "GitLab Access Token",
      optional: "optional",
      token_explained: "Token to avoid rate limits.",
      token_description:
        "Choose extra entities to fetch from the GitLab API.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", the API may limit how many files are imported. You can ",
      token_explained_link2: "create a temporary access token",
      token_explained_end: " to avoid this.",
      fetch_issues: "Fetch Issues as Documents",
      ignores: "File Ignores",
      git_ignore:
        "List in .gitignore format to ignore specific files. Press enter after each.",
      task_explained:
        "When finished, all files are available for embedding into workspaces in the document picker.",
      branch: "Branch to collect from",
      branch_loading: "-- loading branches --",
      branch_explained: "Branch to collect files from.",
      token_information:
        "Without a <b>GitLab access token</b>, only <b>top-level</b> files can be imported.",
      token_personal:
        "Get a free Personal Access Token from GitLab here.",
    },
    youtube: {
      name: "YouTube Transcript",
      description:
        "Import a transcript from any YouTube video link.",
      URL: "YouTube Video URL",
      URL_explained_start:
        "Enter any YouTube video’s URL to fetch the transcript. The video must have ",
      URL_explained_link: "captions",
      URL_explained_end: " available.",
      task_explained:
        "When finished, the transcript is available for embedding in the document picker.",
      language: "Transcript Language",
      language_explained: "Choose the language for the transcript.",
      loading_languages: "-- loading languages --",
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description: "Scrape a website and its sub-links up to a given depth.",
      URL: "Website URL",
      URL_explained: "URL of the website to scrape.",
      depth: "Crawl Depth",
      depth_explained:
        "How many child-links to follow from the original URL.",
      max_pages: "Maximum Pages",
      max_pages_explained: "Maximum number of pages to scrape.",
      task_explained:
        "When finished, all scraped content is available for workspace embedding.",
    },
    confluence: {
      name: "Confluence",
      description: "Import a whole Confluence page with one click.",
      deployment_type: "Confluence Deployment Type",
      deployment_type_explained:
        "Select if your Confluence is Atlassian Cloud or self-hosted.",
      base_url: "Base URL",
      base_url_explained: "The base URL of your Confluence instance.",
      space_key: "Space Key",
      space_key_explained:
        "Space key for your Confluence instance, usually starts with ~.",
      username: "Username",
      username_explained: "Your Confluence username.",
      auth_type: "Auth Type",
      auth_type_explained: "Choose authentication type for access.",
      auth_type_username: "Username and access token",
      auth_type_personal: "Personal access token",
      token: "Confluence API Token",
      token_explained_start: "Provide a token for authentication. Generate one ",
      token_explained_link: "here",
      token_desc: "Token for authentication.",
      pat_token: "Personal Access Token",
      pat_token_explained: "Your personal Confluence access token.",
      task_explained:
        "When finished, the page content is available in the document picker for embedding.",
    },
    manage: {
      documents: "Documents",
      "data-connectors": "Data Connectors",
      "desktop-only":
        "Editing these settings is only available on desktop. Please access on a desktop device.",
      dismiss: "Dismiss",
      editing: "Editing",
    },
    directory: {
      "my-documents": "My Documents",
      "new-folder": "New Folder",
      "search-document": "Search for document",
      "no-documents": "No Documents",
      "move-workspace": "Move to Workspace",
      name: "Name",
      "delete-confirmation":
        "Are you sure you want to delete these files and folders?\nThey’ll be removed from the system and any related workspaces.\nThis cannot be undone.",
      "removing-message":
        "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Moved {{count}} documents.",
      date: "Date",
      type: "Type",
      select_all: "Select All",
      deselect_all: "Deselect All",
      no_docs: "No Documents",
      remove_selected: "Remove Selected",
      costs: "*One-time cost for embeddings",
      save_embed: "Save and Embed",
    },
    upload: {
      "processor-offline": "Document processor unavailable",
      "processor-offline-desc":
        "We can’t upload your files because the document processor is offline right now.",
      "click-upload": "Click to upload or drag and drop",
      "file-types": "Supports text, csv, spreadsheets, audio files, and more!",
      "or-submit-link": "or submit a link",
      "placeholder-link": "https://example.com",
      fetching: "Fetching...",
      "fetch-website": "Fetch website",
      "privacy-notice":
        "These files are uploaded to the processor on this instance. They are not sent to third parties.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1:
        "When you <b>pin</b> a document, the full document is included in your prompt, giving the AI full context.",
      pin_explained_block2:
        "Best for <b>large</b> or very important documents for your knowledge base.",
      pin_explained_block3:
        "If default answers aren’t accurate, try pinning for better results.",
      accept: "Ok, got it.",
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1:
        "When you <b>watch</b> a document, its content is auto-synced from the source at regular intervals – in all workspaces using it.",
      watch_explained_block2:
        "Currently, only online content is supported, not manual uploads.",
      watch_explained_block3_start: "You can control this in the ",
      watch_explained_block3_link: "file manager",
      watch_explained_block3_end: ".",
      accept: "Ok, got it.",
    },
  },

  chat_window: {
    welcome: "Welcome to your workspace.",
    get_started: "Get started by ",
    get_started_default: "Get started by ",
    upload: "uploading a document",
    or: " or ",
    send_chat: " chatting.",
    send_message: "Send a message",
    attach_file: "Attach a file",
    slash: "See all available slash commands.",
    agents: "See all available agent skills.",
    text_size: "Change text size.",
    microphone: "Speak your prompt.",
    send: "Send prompt to workspace.",
    attachments_processing: "Attachments are processing. Please wait...",
    tts_speak_message: "Read aloud (TTS)",
    copy: "Copy",
    regenerate: "Regenerate",
    regenerate_response: "Regenerate Response",
    good_response: "Good Response",
    more_actions: "More Actions",
    hide_citations: "Hide citations",
    show_citations: "Show citations",
    pause_tts_speech_message: "Pause speech",
    fork: "Fork",
    delete: "Delete",
    save_submit: "Save & Submit",
    cancel: "Cancel",
    edit_prompt: "Edit prompt",
    edit_response: "Edit Response",
    at_agent: "@agent",
    default_agent_description: " – default agent for this workspace.",
    custom_agents_coming_soon: "Custom agents coming soon!",
    slash_reset: "/reset",
    preset_reset_description: "Clear history and start a new chat",
    add_new_preset: " Add New Preset",
    command: "Command",
    your_command: "your-command",
    placeholder_prompt:
      "This content is prepended to your prompt.",
    description: "Description",
    placeholder_description: "Replies with a poem about LLMs.",
    save: "Save",
    small: "Small",
    normal: "Normal",
    large: "Large",
  },

  profile_settings: {
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_description:
      "Username can contain lowercase letters, numbers, underscores, and hyphens (no spaces).",
    new_password: "New Password",
    passwort_description: "Password must be at least 8 characters.",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Preferred Theme",
    language: "Preferred Language",
  },

  "main-page": {
    noWorkspaceError: "Please create a workspace before starting a chat.",
    checklist: {
      title: "Getting Started",
      tasksLeft: "tasks left",
      completed: "You’re on your way to becoming a tool expert!",
      dismiss: "close",
      tasks: {
        create_workspace: {
          title: "Create a workspace",
          description: "Create your first workspace to get started",
          action: "Create",
        },
        send_chat: {
          title: "Send a chat",
          description: "Start a conversation with your AI assistant",
          action: "Chat",
        },
        embed_document: {
          title: "Embed a document",
          description: "Add your first document to your workspace",
          action: "Embed",
        },
        setup_system_prompt: {
          title: "Set up a system prompt",
          description: "Configure your AI assistant's behavior",
          action: "Set Up",
        },
        define_slash_command: {
          title: "Define a slash command",
          description: "Create custom commands for your assistant",
          action: "Define",
        },
        visit_community: {
          title: "Visit Community Hub",
          description: "Explore community resources and templates",
          action: "Browse",
        },
      },
    },
    quickLinks: {
      title: "Quick Links",
      sendChat: "Send Chat",
      embedDocument: "Embed a Document",
      createWorkspace: "Create Workspace",
    },
    exploreMore: {
      title: "Explore more features",
      features: {
        customAgents: {
          title: "Custom AI Agents",
          description: "Build powerful AI agents and automations with no code.",
          primaryAction: "Chat using @agent",
          secondaryAction: "Build an agent flow",
        },
        slashCommands: {
          title: "Slash Commands",
          description:
            "Save time and use prompts via custom slash commands.",
          primaryAction: "Create Slash Command",
          secondaryAction: "Explore in Hub",
        },
        systemPrompts: {
          title: "System Prompts",
          description:
            "Edit system prompts to fine-tune AI answers in a workspace.",
          primaryAction: "Edit System Prompt",
          secondaryAction: "Manage prompt variables",
        },
      },
    },
    announcements: {
      title: "Updates & Announcements",
    },
    resources: {
      title: "Resources",
      links: {
        docs: "Documentation",
        star: "Star on Github",
      },
      keyboardShortcuts: "Keyboard Shortcuts",
    },
  },

  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    shortcuts: {
      settings: "Open Settings",
      workspaceSettings: "Open Workspace Settings",
      home: "Go to Home",
      workspaces: "Manage Workspaces",
      apiKeys: "API Keys Settings",
      llmPreferences: "LLM Preferences",
      chatSettings: "Chat Settings",
      help: "Show keyboard shortcuts",
    },
  },
};
export default TRANSLATIONS;
