const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Welcome to",
      getStarted: "Get Started",
    },
    llm: {
      title: "LLM Preference",
      description:
        "AnythingLLM can work with many LLM providers. This will be the service which handles chatting.",
    },
    userSetup: {
      title: "User Setup",
      description: "Configure your user settings.",
      howManyUsers: "How many users will be using this instance?",
      justMe: "Just me",
      myTeam: "My team",
      instancePassword: "Instance Password",
      setPassword: "Would you like to set up a password?",
      passwordReq: "Passwords must be at least 8 characters.",
      passwordWarn:
        "It's important to save this password because there is no recovery method.",

      adminUsername: "Admin account username",
      adminUsernameReq:
        "Username must be at least 6 characters long and only contain lowercase letters, numbers, underscores, and hyphens with no spaces.",
      adminPassword: "Admin account password",
      adminPasswordReq: "Passwords must be at least 8 characters.",
      teamHint:
        "By default, you will be the only admin. Once onboarding is completed you can create and invite others to be users or admins. Do not lose your password as only admins can reset passwords.",
    },
    data: {
      title: "Data Handling & Privacy",
      description:
        "We are committed to transparency and control when it comes to your personal data.",
      settingsHint:
        "These settings can be reconfigured at any time in the settings.",
    },
    survey: {
      title: "Welcome to AnythingLLM",
      description: "Help us make AnythingLLM built for your needs. Optional.",

      email: "What's your email?",
      useCase: "What will you use AnythingLLM for?",
      useCaseWork: "For work",
      useCasePersonal: "For personal use",
      useCaseOther: "Other",
      comment: "How did you hear about AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - Let us know how you found us!",
      skip: "Skip Survey",
      thankYou: "Thank you for your feedback!",
    },
    workspace: {
      title: "Create your first workspace",
      description:
        "Create your first workspace and get started with AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Workspaces Name",
    error: "error",
    success: "success",
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

  // Setting Sidebar menu items.
  settings: {
    title: "Instance Settings",
    system: "General Settings",
    invites: "Invites",
    users: "Users",
    workspaces: "Workspaces",
    "workspace-chats": "Workspace Chats",
    customization: "Customization",
    "api-keys": "Developer API",
    llm: "LLM",
    transcription: "Transcription",
    embedder: "Embedder",
    "text-splitting": "Text Splitter & Chunking",
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
    "experimental-features": "Experimental Features",
    contact: "Contact Support",
    "browser-extension": "Browser Extension",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "Welcome to",
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
      "Welcome to AnythingLLM, AnythingLLM is an open-source AI tool by Mintplex Labs that turns anything into a trained chatbot you can query and chat with. AnythingLLM is a BYOK (bring-your-own-keys) software so there is no subscription, fee, or charges for this software outside of the services you want to use with it.",
    part2:
      "AnythingLLM is the easiest way to put powerful AI products like OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB, and other services together in a neat package with no fuss to increase your productivity by 100x.",
    part3:
      "AnythingLLM can run totally locally on your machine with little overhead you wont even notice it's there! No GPU needed. Cloud and on-premises installation is available as well.\nThe AI tooling ecosystem gets more powerful everyday. AnythingLLM makes it easy to use.",
    githubIssue: "Create an issue on GitHub",
    user1: "How do I get started?!",
    part4:
      "It's simple. All collections are organized into buckets we call \"Workspaces\". Workspaces are buckets of files, documents, images, PDFs, and other files which will be transformed into something LLM's can understand and use in conversation.\n\nYou can add and remove files at anytime.",
    createWorkspace: "Create your first workspace",
    user2:
      "Is this like an AI dropbox or something? What about chatting? It is a chatbot isn't it?",
    part5:
      "AnythingLLM is more than a smarter Dropbox.\n\nAnythingLLM offers two ways of talking with your data:\n\n<i>Query:</i> Your chats will return data or inferences found with the documents in your workspace it has access to. Adding more documents to the Workspace make it smarter! \n\n<i>Conversational:</i> Your documents + your on-going chat history both contribute to the LLM knowledge at the same time. Great for appending real-time text-based info or corrections and misunderstandings the LLM might have. \n\nYou can toggle between either mode \n<i>in the middle of chatting!</i>",
    user3: "Wow, this sounds amazing, let me try it out already!",
    part6: "Have Fun!",
    starOnGitHub: "Star on GitHub",
    contact: "Contact Mintplex Labs",
  },

  "new-workspace": {
    title: "New Workspace",
    placeholder: "My Workspace",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "General Settings",
    chat: "Chat Settings",
    vector: "Vector Database",
    members: "Members",
    agent: "Agent Configuration",
  },

  // General Appearance
  general: {
    vector: {
      title: "Vector Count",
      description: "Total number of vectors in your vector database.",
    },
    names: {
      description: "This will only change the display name of your workspace.",
    },
    message: {
      title: "Suggested Chat Messages",
      description:
        "Customize the messages that will be suggested to your workspace users.",
      add: "Add new message",
      save: "Save Messages",
      heading: "Explain to me",
      body: "the benefits of AnythingLLM",
    },
    pfp: {
      title: "Assistant Profile Image",
      description:
        "Customize the profile image of the assistant for this workspace.",
      image: "Workspace Image",
      remove: "Remove Workspace Image",
    },
    delete: {
      title: "Delete Workspace",
      description:
        "Delete this workspace and all of its data. This will delete the workspace for all users.",
      delete: "Delete Workspace",
      deleting: "Deleting Workspace...",
      "confirm-start": "You are about to delete your entire",
      "confirm-end":
        "workspace. This will remove all vector embeddings in your vector database.\n\nThe original source files will remain untouched. This action is irreversible.",
    },
  },

  // Chat Settings
  chat: {
    llm: {
      title: "Workspace LLM Provider",
      description:
        "The specific LLM provider & model that will be used for this workspace. By default, it uses the system LLM provider and settings.",
      search: "Search all LLM providers",
    },
    model: {
      title: "Workspace Chat model",
      description:
        "The specific chat model that will be used for this workspace. If empty, will use the system LLM preference.",
      wait: "-- waiting for models --",
    },
    mode: {
      title: "Chat mode",
      chat: {
        title: "Chat",
        "desc-start": "will provide answers with the LLM's general knowledge",
        and: "and",
        "desc-end": "document context that is found.",
      },
      query: {
        title: "Query",
        "desc-start": "will provide answers",
        only: "only",
        "desc-end": "if document context is found.",
      },
    },
    history: {
      title: "Chat History",
      "desc-start":
        "The number of previous chats that will be included in the response's short-term memory.",
      recommend: "Recommend 20. ",
      "desc-end":
        "Anything more than 45 is likely to lead to continuous chat failures depending on message size.",
    },
    prompt: {
      title: "Prompt",
      description:
        "The prompt that will be used on this workspace. Define the context and instructions for the AI to generate a response. You should to provide a carefully crafted prompt so the AI can generate a relevant and accurate response.",
    },
    refusal: {
      title: "Query mode refusal response",
      "desc-start": "When in",
      query: "query",
      "desc-end":
        "mode, you may want to return a custom refusal response when no context is found.",
    },
    temperature: {
      title: "LLM Temperature",
      "desc-start":
        'This setting controls how "creative" your LLM responses will be.',
      "desc-end":
        "The higher the number the more creative. For some models this can lead to incoherent responses when set too high.",
      hint: "Most LLMs have various acceptable ranges of valid values. Consult your LLM provider for that information.",
    },
  },

  // Vector Database
  "vector-workspace": {
    identifier: "Vector database identifier",
    snippets: {
      title: "Max Context Snippets",
      description:
        "This setting controls the maximum amount of context snippets the will be sent to the LLM for per chat or query.",
      recommend: "Recommended: 4",
    },
    doc: {
      title: "Document similarity threshold",
      description:
        "The minimum similarity score required for a source to be considered related to the chat. The higher the number, the more similar the source must be to the chat.",
      zero: "No restriction",
      low: "Low (similarity score ≥ .25)",
      medium: "Medium (similarity score ≥ .50)",
      high: "High (similarity score ≥ .75)",
    },
    reset: {
      reset: "Reset Vector Database",
      resetting: "Clearing vectors...",
      confirm:
        "You are about to reset this workspace's vector database. This will remove all vector embeddings currently embedded.\n\nThe original source files will remain untouched. This action is irreversible.",
      error: "Workspace vector database could not be reset!",
      success: "Workspace vector database was reset!",
    },
  },

  // Agent Configuration
  agent: {
    "performance-warning":
      "Performance of LLMs that do not explicitly support tool-calling is highly dependent on the model's capabilities and accuracy. Some abilities may be limited or non-functional.",
    provider: {
      title: "Workspace Agent LLM Provider",
      description:
        "The specific LLM provider & model that will be used for this workspace's @agent agent.",
    },
    mode: {
      chat: {
        title: "Workspace Agent Chat model",
        description:
          "The specific chat model that will be used for this workspace's @agent agent.",
      },
      title: "Workspace Agent model",
      description:
        "The specific LLM model that will be used for this workspace's @agent agent.",
      wait: "-- waiting for models --",
    },

    skill: {
      title: "Default agent skills",
      description:
        "Improve the natural abilities of the default agent with these pre-built skills. This set up applies to all workspaces.",
      rag: {
        title: "RAG & long-term memory",
        description:
          'Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.',
      },
      view: {
        title: "View & summarize documents",
        description:
          "Allow the agent to list and summarize the content of workspace files currently embedded.",
      },
      scrape: {
        title: "Scrape websites",
        description:
          "Allow the agent to visit and scrape the content of websites.",
      },
      generate: {
        title: "Generate charts",
        description:
          "Enable the default agent to generate various types of charts from data provided or given in chat.",
      },
      save: {
        title: "Generate & save files to browser",
        description:
          "Enable the default agent to generate and write to files that save and can be downloaded in your browser.",
      },
      web: {
        title: "Live web search and browsing",
        "desc-start":
          "Enable your agent to search the web to answer your questions by connecting to a web-search (SERP) provider.",
        "desc-end":
          "Web search during agent sessions will not work until this is set up.",
      },
    },
  },

  // Workspace Chats
  recorded: {
    title: "Workspace Chats",
    description:
      "These are all the recorded chats and messages that have been sent by users ordered by their creation date.",
    export: "Export",
    table: {
      id: "Id",
      by: "Sent By",
      workspace: "Workspace",
      prompt: "Prompt",
      response: "Response",
      at: "Sent At",
    },
  },

  // Appearance
  appearance: {
    title: "Appearance",
    description: "Customize the appearance settings of your platform.",
    logo: {
      title: "Customize Logo",
      description: "Upload your custom logo to make your chatbot yours.",
      add: "Add a custom logo",
      recommended: "Recommended size: 800 x 200",
      remove: "Remove",
      replace: "Replace",
    },
    message: {
      title: "Customize Messages",
      description: "Customize the automatic messages displayed to your users.",
      new: "New",
      system: "system",
      user: "user",
      message: "message",
      assistant: "AnythingLLM Chat Assistant",
      "double-click": "Double click to edit...",
      save: "Save Messages",
    },
    icons: {
      title: "Custom Footer Icons",
      description:
        "Customize the footer icons displayed on the bottom of the sidebar.",
      icon: "Icon",
      link: "Link",
    },
  },

  // API Keys
  api: {
    title: "API Keys",
    description:
      "API keys allow the holder to programmatically access and manage this AnythingLLM instance.",
    link: "Read the API documentation",
    generate: "Generate New API Key",
    table: {
      key: "API Key",
      by: "Created By",
      created: "Created",
    },
  },

  llm: {
    title: "LLM Preference",
    description:
      "These are the credentials and settings for your preferred LLM chat & embedding provider. Its important these keys are current and correct or else AnythingLLM will not function properly.",
    provider: "LLM Provider",
  },

  transcription: {
    title: "Transcription Model Preference",
    description:
      "These are the credentials and settings for your preferred transcription model provider. Its important these keys are current and correct or else media files and audio will not transcribe.",
    provider: "Transcription Provider",
    "warn-start":
      "Using the local whisper model on machines with limited RAM or CPU can stall AnythingLLM when processing media files.",
    "warn-recommend":
      "We recommend at least 2GB of RAM and upload files <10Mb.",
    "warn-end":
      "The built-in model will automatically download on the first use.",
  },

  embedding: {
    title: "Embedding Preference",
    "desc-start":
      "When using an LLM that does not natively support an embedding engine - you may need to additionally specify credentials to for embedding text.",
    "desc-end":
      "Embedding is the process of turning text into vectors. These credentials are required to turn your files and prompts into a format which AnythingLLM can use to process.",
    provider: {
      title: "Embedding Provider",
      description:
        "There is no set up required when using AnythingLLM's native embedding engine.",
    },
  },

  text: {
    title: "Text splitting & Chunking Preferences",
    "desc-start":
      "Sometimes, you may want to change the default way that new documents are split and chunked before being inserted into your vector database.",
    "desc-end":
      "You should only modify this setting if you understand how text splitting works and it's side effects.",
    "warn-start": "Changes here will only apply to",
    "warn-center": "newly embedded documents",
    "warn-end": ", not existing documents.",
    size: {
      title: "Text Chunk Size",
      description:
        "This is the maximum length of characters that can be present in a single vector.",
      recommend: "Embed model maximum length is",
    },

    overlap: {
      title: "Text Chunk Overlap",
      description:
        "This is the maximum overlap of characters that occurs during chunking between two adjacent text chunks.",
    },
  },

  // Vector Database
  vector: {
    title: "Vector Database",
    description:
      "These are the credentials and settings for how your AnythingLLM instance will function. It's important these keys are current and correct.",
    provider: {
      title: "Vector Database Provider",
      description: "There is no configuration needed for LanceDB.",
    },
  },

  // Embeddable Chat Widgets
  embeddable: {
    title: "Embeddable Chat Widgets",
    description:
      "Embeddable chat widgets are public facing chat interfaces that are tied to a single workspace. These allow you to build workspaces that then you can publish to the world.",
    create: "Create embed",
    table: {
      workspace: "Workspace",
      chats: "Sent Chats",
      Active: "Active Domains",
    },
  },

  "embed-chats": {
    title: "Embed Chats",
    export: "Export",
    description:
      "These are all the recorded chats and messages from any embed that you have published.",
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
      "Set up your instance to support your team by activating Multi-User Mode.",
    enable: {
      "is-enable": "Multi-User Mode is Enabled",
      enable: "Enable Multi-User Mode",
      description:
        "By default, you will be the only admin. As an admin you will need to create accounts for all new users or admins. Do not lose your password as only an Admin user can reset passwords.",
      username: "Admin account username",
      password: "Admin account password",
    },
    password: {
      title: "Password Protection",
      description:
        "Protect your AnythingLLM instance with a password. If you forget this there is no recovery method so ensure you save this password.",
    },
    instance: {
      title: "Password Protect Instance",
      description:
        "By default, you will be the only admin. As an admin you will need to create accounts for all new users or admins. Do not lose your password as only an Admin user can reset passwords.",
      password: "Instance password",
    },
  },

  // Event Logs
  event: {
    title: "Event Logs",
    description:
      "View all actions and events happening on this instance for monitoring.",
    clear: "Clear Event Logs",
    table: {
      type: "Event Type",
      user: "User",
      occurred: "Occurred At",
    },
  },

  // Privacy & Data-Handling
  privacy: {
    title: "Privacy & Data-Handling",
    description:
      "This is your configuration for how connected third party providers and AnythingLLM handle your data.",
    llm: "LLM Selection",
    embedding: "Embedding Preference",
    vector: "Vector Database",
    anonymous: "Anonymous Telemetry Enabled",
  },

  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    github: {
      name: "GitHub Repo",
      description:
        "Import an entire public or private GitHub repository in a single click.",
      URL: "GitHub Repo URL",
      URL_explained: "Url of the GitHub repo you wish to collect.",
      token: "GitHub Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", the GitHub API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      ignores: "File Ignores",
      git_ignore:
        "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained:
        "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from.",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information:
        "Without filling out the <b>GitHub Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitHub's public API rate-limits.",
      token_personal:
        "Get a free Personal Access Token with a GitHub account here.",
    },
    gitlab: {
      name: "GitLab Repo",
      description:
        "Import an entire public or private GitLab repository in a single click.",
      URL: "GitLab Repo URL",
      URL_explained: "URL of the GitLab repo you wish to collect.",
      token: "GitLab Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_description:
        "Select additional entities to fetch from the GitLab API.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", the GitLab API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      fetch_issues: "Fetch Issues as Documents",
      ignores: "File Ignores",
      git_ignore:
        "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained:
        "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information:
        "Without filling out the <b>GitLab Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitLab's public API rate-limits.",
      token_personal:
        "Get a free Personal Access Token with a GitLab account here.",
    },
    youtube: {
      name: "YouTube Transcript",
      description:
        "Import the transcription of an entire YouTube video from a link.",
      URL: "YouTube Video URL",
      URL_explained_start:
        "Enter the URL of any YouTube video to fetch its transcript. The video must have ",
      URL_explained_link: "closed captions",
      URL_explained_end: " available.",
      task_explained:
        "Once complete, the transcript will be available for embedding into workspaces in the document picker.",
      language: "Transcript Language",
      language_explained:
        "Select the language of the transcript you want to collect.",
      loading_languages: "-- loading available languages --",
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description: "Scrape a website and its sub-links up to a certain depth.",
      URL: "Website URL",
      URL_explained: "URL of the website you want to scrape.",
      depth: "Crawl Depth",
      depth_explained:
        "This is the number of child-links that the worker should follow from the origin URL.",
      max_pages: "Maximum Pages",
      max_pages_explained: "Maximum number of links to scrape.",
      task_explained:
        "Once complete, all scraped content will be available for embedding into workspaces in the document picker.",
    },
    confluence: {
      name: "Confluence",
      description: "Import an entire Confluence page in a single click.",
      deployment_type: "Confluence deployment type",
      deployment_type_explained:
        "Determine if your Confluence instance is hosted on Atlassian cloud or self-hosted.",
      base_url: "Confluence base URL",
      base_url_explained: "This is the base URL of your Confluence space.",
      space_key: "Confluence space key",
      space_key_explained:
        "This is the spaces key of your confluence instance that will be used. Usually begins with ~",
      username: "Confluence Username",
      username_explained: "Your Confluence username",
      auth_type: "Confluence Auth Type",
      auth_type_explained:
        "Select the authentication type you want to use to access your Confluence pages.",
      auth_type_username: "Username and Access Token",
      auth_type_personal: "Personal Access Token",
      token: "Confluence Access Token",
      token_explained_start:
        "You need to provide an access token for authentication. You can generate an access token",
      token_explained_link: "here",
      token_desc: "Access token for authentication",
      pat_token: "Confluence Personal Access Token",
      pat_token_explained: "Your Confluence personal access token.",
      task_explained:
        "Once complete, the page content will be available for embedding into workspaces in the document picker.",
    },

    manage: {
      documents: "Documents",
      "data-connectors": "Data Connectors",
      "desktop-only":
        "Editing these settings are only available on a desktop device. Please access this page on your desktop to continue.",
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
        "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible.",
      "removing-message":
        "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Successfully moved {{count}} documents.",
      date: "Date",
      type: "Type",
      no_docs: "No Documents",
      select_all: "Select All",
      deselect_all: "Deselect All",
      remove_selected: "Remove Selected",
      costs: "*One time cost for embeddings",
      save_embed: "Save and Embed",
    },
    upload: {
      "processor-offline": "Document Processor Unavailable",
      "processor-offline-desc":
        "We can't upload your files right now because the document processor is offline. Please try again later.",
      "click-upload": "Click to upload or drag and drop",
      "file-types":
        "supports text files, csv's, spreadsheets, audio files, and more!",
      "or-submit-link": "or submit a link",
      "placeholder-link": "https://example.com",
      fetching: "Fetching...",
      "fetch-website": "Fetch website",
      "privacy-notice":
        "These files will be uploaded to the document processor running on this AnythingLLM instance. These files are not sent or shared with a third party.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1:
        "When you <b>pin</b> a document in AnythingLLM we will inject the entire content of the document into your prompt window for your LLM to fully comprehend.",
      pin_explained_block2:
        "This works best with <b>large-context models</b> or small files that are critical to its knowledge-base.",
      pin_explained_block3:
        "If you are not getting the answers you desire from AnythingLLM by default then pinning is a great way to get higher quality answers in a click.",
      accept: "Okay, got it",
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1:
        "When you <b>watch</b> a document in AnythingLLM we will <i>automatically</i> sync your document content from it's original source on regular intervals. This will automatically update the content in every workspace where this file is managed.",
      watch_explained_block2:
        "This feature currently supports online-based content and will not be available for manually uploaded documents.",
      watch_explained_block3_start:
        "You can manage what documents are watched from the ",
      watch_explained_block3_link: "File manager",
      watch_explained_block3_end: " admin view.",
      accept: "Okay, got it",
    },
  },

  chat_window: {
    welcome: "Welcome to your new workspace.",
    get_started: "To get started either",
    get_started_default: "To get started",
    upload: "upload a document",
    or: "or",
    send_chat: "send a chat.",
    send_message: "Send a message",
    attach_file: "Attach a file to this chat",
    slash: "View all available slash commands for chatting.",
    agents: "View all available agents you can use for chatting.",
    text_size: "Change text size.",
    microphone: "Speak your prompt.",
    send: "Send prompt message to workspace",
  },

  profile_settings: {
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_description:
      "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
    new_password: "New Password",
    passwort_description: "Password must be at least 8 characters long",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Theme Preference",
    language: "Preferred language",
  },
};

export default TRANSLATIONS;
