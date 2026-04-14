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
    "workspaces-name": "Workspace Name",
    error: "error",
    success: "success",
    user: "User",
    selection: "Model Selection",
    saving: "Saving...",
    save: "Save changes",
    previous: "← Previous",
    next: "Next →",
    loading: "Loading...",
    optional: "Optional",
    yes: "Yes",
    no: "No",
    search: "Search",
    username_requirements:
      "Username must be 2-32 characters, start with a lowercase letter, and only contain lowercase letters, numbers, underscores, hyphens, and periods.",
    "save-success": "Settings saved successfully.",
    "save-error": "Failed to save settings.",
    back: "Back",
  },
  toast: {
    "workspace-updated": "Workspace updated!",
    "workspace-update-error": "Error: {{message}}",
    "workspace-delete-error": "Workspace could not be deleted!",
    "users-updated": "Users updated successfully.",
    "llm-settings-save-error":
      "Failed to save {{name}} settings: {{error}}",
    "welcome-messages-update-error":
      "Failed to update welcome messages: {{error}}",
    "welcome-messages-updated": "Successfully updated welcome messages.",
    "welcome-messages-max": "Maximum of 4 messages allowed.",
    "pfp-upload-error": "Failed to upload profile picture: {{error}}",
    "pfp-uploaded": "Profile picture uploaded.",
    "pfp-remove-error": "Failed to remove profile picture: {{error}}",
    llm: {
      "save-success": "LLM preferences saved successfully.",
      "save-error": "Failed to save LLM settings: {{error}}",
    },
    api: {
      copied: "API key copied to clipboard",
      deleted: "API Key permanently deleted",
    },
    audio: {
      "stt-saved": "Speech-to-text preferences saved successfully.",
      "stt-error": "Failed to save STT preferences: {{error}}",
      "tts-saved": "Text-to-speech preferences saved successfully.",
      "tts-error": "Failed to save TTS preferences: {{error}}",
    },
    vector: {
      "save-success": "Vector database preferences saved successfully.",
      "save-error": "Failed to save vector database settings: {{error}}",
    },
    embedding: {
      "save-success": "Embedding preferences saved successfully.",
      "save-error": "Failed to save embedding settings: {{error}}",
    },
    transcription: {
      "save-success": "Transcription preferences saved successfully.",
      "save-error": "Failed to save transcription preferences: {{error}}",
    },
    settings: {
      "app-name-success": "Successfully updated custom app name.",
      "app-name-error": "Failed to update custom app name: {{error}}",
      "welcome-messages-success": "Successfully updated welcome messages.",
      "welcome-messages-error":
        "Failed to update welcome messages: {{error}}",
      "support-email-success": "Successfully updated support email.",
      "support-email-error": "Failed to update support email: {{error}}",
      "footer-icons-success": "Successfully updated footer icons.",
      "footer-icons-error": "Failed to update footer icons: {{error}}",
      "logo-uploaded": "Image uploaded successfully.",
      "logo-upload-error": "Failed to upload logo: {{error}}",
      "logo-removed": "Image successfully removed.",
      "logo-remove-error": "Failed to remove logo: {{error}}",
    },
    security: {
      "multi-user-enabled": "Multi-User mode enabled successfully.",
      "multi-user-error": "Failed to enable Multi-User mode: {{error}}",
      "page-refresh": "Your page will refresh in a few seconds.",
      "password-error": "Failed to update password: {{error}}",
      "password-chars":
        "Your password has restricted characters in it. Allowed symbols are _,-,!,@,$,%,^,&,*,(,),;",
    },
    community: {
      "key-saved": "API key saved successfully",
      "key-error": "Failed to save API key",
      disconnected: "Disconnected from AnythingLLM Community Hub",
      "disconnect-error": "Failed to disconnect from hub",
      "enter-item-id": "Please enter an item ID",
      "applying-prompt": "Applying system prompt to workspace...",
      "apply-prompt-error": "Failed to apply system prompt. {{error}}",
      "prompt-applied": "System prompt applied to workspace.",
    },
    "browser-ext": {
      revoked: "Browser Extension API Key permanently revoked",
      "revoke-error": "Failed to revoke API Key",
      copied: "Connection string copied to clipboard",
      connecting: "Attempting to connect to browser extension...",
    },
    mobile: {
      granted: "Device access granted",
      denied: "Device access denied",
    },
    "embed-chats": {
      "export-success": "Embed chats exported successfully as {{name}}.",
      "export-error": "Failed to export embed chats.",
    },
    "text-splitter": {
      "save-success": "Text chunking strategy settings saved.",
      "save-error": "Failed to save text chunking strategy settings.",
      "overlap-error":
        "Chunk overlap cannot be larger or equal to chunk size.",
    },
    admin: {
      "agent-flow-load-error": "Failed to load available flows",
      "agent-flow-load-single-error": "Failed to load flow",
      "agent-flow-saved": "Agent flow saved successfully!",
      "agent-flow-save-error": "Failed to save agent flow. {{error}}",
      "agent-flow-name-desc-required":
        "Please provide both a name and description for your flow",
      "flow-deleted": "Flow deleted successfully.",
      "flow-delete-error": "Failed to delete flow.",
      "flow-status-updated": "Flow status updated successfully",
      "flow-toggle-error": "Failed to toggle flow",
      "skill-activated": "Skill activated.",
      "skill-deactivated": "Skill deactivated.",
      "skill-config-updated": "Skill config updated successfully.",
      "skill-deleted": "Skill deleted successfully.",
      "skill-delete-error": "Failed to delete skill.",
      "mcp-server-deleted": "MCP server deleted successfully.",
      "mcp-server-delete-error": "Failed to delete MCP server.",
      "mcp-server-toggled": "MCP server {{name}} {{state}} successfully.",
      "mcp-server-toggle-error": "Failed to toggle MCP server.",
      "default-prompt-updated":
        "Default system prompt updated successfully.",
      "default-prompt-update-error":
        "Failed to update default system prompt: {{error}}",
      "variable-updated": "Variable updated successfully",
      "variable-deleted": "Variable deleted successfully",
      "variable-delete-error": "Failed to delete variable",
      "variable-created": "Variable created successfully",
      "variables-not-found": "No variables found",
      "user-deleted": "User deleted from system.",
      "user-suspended": "User has been suspended.",
      "user-unsuspended": "User is no longer suspended.",
      "logs-cleared": "Event logs cleared successfully.",
      "logs-clear-error": "Failed to clear logs: {{error}}",
      "invite-copied": "Invite link copied to clipboard",
      "feature-update-error": "Failed to update status of feature.",
      "livesync-enabled": "Live document content sync has been enabled.",
      "livesync-disabled": "Live document content sync has been disabled.",
      back: "Back",
      permissions: "Permissions",
      "select-experimental-feature": "Select an experimental feature",
    },
    components: {
      "password-reset-success": "Password reset successful",
      "invalid-reset-token": "Invalid reset token",
      "link-uploaded": "Link uploaded successfully",
      "link-upload-error": "Error uploading link: {{error}}",
      "workspace-updating": "Updating workspace...",
      "workspace-updated": "Workspace updated successfully.",
      "workspace-update-error": "Workspace update failed: {{error}}",
      "workspace-update-msg-error": "Error: {{message}}",
      "recovery-codes-copied": "Recovery codes copied to clipboard",
      "experimental-unlocked": "Experimental feature previews unlocked!",
      "thread-update-error": "Thread could not be updated! {{message}}",
      "thread-delete-error": "Thread could not be deleted!",
      "thread-deleted": "Thread deleted successfully!",
      "workspace-reorder-error": "Failed to reorder workspaces",
      "files-embedded": "{{count}} {{fileWord}} embedded successfully",
      "files-embed-error": "Failed to embed files",
      "tts-play-error": "Failed to play TTS audio",
      "piper-voices-flushed": "All voices flushed from browser storage",
      "obsidian-importing": "Importing Obsidian vault - this may take a while.",
      "obsidian-import-success":
        "Successfully imported {{count}} files from your vault!",
      "obsidian-import-partial":
        "Imported {{successCount}} files, {{failCount}} failed",
      "website-scraping": "Scraping website - this may take a while.",
      "website-scrape-success":
        "Successfully scraped {{count}} {{pageWord}}!",
      "youtube-fetching": "Fetching transcript for YouTube video.",
      "youtube-transcription-complete":
        "{{title}} by {{author}} transcription completed. Output folder is {{destination}}.",
    },
    hooks: {
      "provider-endpoint-discovered":
        "Provider endpoint discovered automatically.",
      "provider-endpoint-manual":
        "Couldn't automatically discover the provider endpoint. Please enter it manually.",
    },
  },
  home: {
    welcome: "Welcome",
    chooseWorkspace: "Choose a workspace to start chatting!",
    notAssigned:
      "You currently aren't assigned to any workspaces.\nPlease contact your administrator to request access to a workspace.",
    goToWorkspace: 'Go to "{{workspace}}"',
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
    interface: "UI Preferences",
    branding: "Branding & Whitelabeling",
    chat: "Chat",
    "api-keys": "Developer API",
    llm: "LLM",
    transcription: "Transcription",
    embedder: "Embedder",
    "text-splitting": "Text Splitter & Chunking",
    "search-retrieval": "Search & Retrieval",
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
    "mobile-app": "AnythingLLM Mobile",
  },

  // Page Definitions
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
    "sign-in":
      "Enter your username and password to access your {{appName}} instance.",
    "password-reset": {
      title: "Password Reset",
      description:
        "Provide the necessary information below to reset your password.",
      "recovery-codes": "Recovery Codes",
      "recovery-code": "Recovery Code {{index}}",
      "back-to-login": "Back to Login",
    },
  },

  "main-page": {
    greeting: "How can I help you today?",
    noWorkspaceError: "Please create a workspace before starting a chat.",
    checklist: {
      title: "Getting Started",
      tasksLeft: "tasks left",
      completed: "You're on your way to becoming an AnythingLLM expert!",
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
    quickActions: {
      createAgent: "Create an Agent",
      editWorkspace: "Edit Workspace",
      uploadDocument: "Upload a Document",
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
          description: "Build powerful AI Agents and automations with no code.",
          primaryAction: "Chat using @agent",
          secondaryAction: "Build an agent flow",
        },
        slashCommands: {
          title: "Slash Commands",
          description:
            "Save time and inject prompts using custom slash commands.",
          primaryAction: "Create a Slash Command",
          secondaryAction: "Explore on Hub",
        },
        systemPrompts: {
          title: "System Prompts",
          description:
            "Modify the system prompt to customize the AI replies of a workspace.",
          primaryAction: "Modify a System Prompt",
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
        docs: "Docs",
        star: "Star on Github",
      },
      keyboardShortcuts: "Keyboard Shortcuts",
    },
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
      title: "System Prompt",
      description:
        "The prompt that will be used on this workspace. Define the context and instructions for the AI to generate a response. You should provide a carefully crafted prompt so the AI can generate a relevant and accurate response.",
      history: {
        title: "System Prompt History",
        clearAll: "Clear All",
        noHistory: "No system prompt history available",
        restore: "Restore",
        delete: "Delete",
        publish: "Publish to Community Hub",
        deleteConfirm: "Are you sure you want to delete this history item?",
        clearAllConfirm:
          "Are you sure you want to clear all history? This action cannot be undone.",
        expand: "Expand",
      },
    },
    refusal: {
      title: "Query mode refusal response",
      "desc-start": "When in",
      query: "query",
      "desc-end":
        "mode, you may want to return a custom refusal response when no context is found.",
      "tooltip-title": "Why am I seeing this?",
      "tooltip-description":
        "You are in query mode, which only uses information from your documents. Switch to chat mode for more flexible conversations, or click here to visit our documentation to learn more about chat modes.",
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
        "This setting controls the maximum amount of context snippets that will be sent to the LLM for per chat or query.",
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
        title: "Generate & save files",
        description:
          "Enable the default agent to generate and write to files that can be saved to your computer.",
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
    "clear-chats": "Clear Chats",
    "confirm-clear":
      "Are you sure you want to clear all chats?\n\nThis action cannot be undone.",
    "export-success": "Chats successfully exported as {format}.",
    "export-failed": "Failed to export chats.",
    "cleared-all": "All chats have been cleared.",
    "previous-page": "Previous Page",
    "next-page": "Next Page",
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
      description: "Set your UI preferences for AnythingLLM.",
    },
    branding: {
      title: "Branding & Whitelabeling",
      description:
        "White-label your AnythingLLM instance with custom branding.",
    },
    chat: {
      title: "Chat",
      description: "Set your chat preferences for AnythingLLM.",
      auto_submit: {
        title: "Auto-Submit Speech Input",
        description:
          "Automatically submit speech input after a period of silence",
      },
      auto_speak: {
        title: "Auto-Speak Responses",
        description: "Automatically speak responses from the AI",
      },
      spellcheck: {
        title: "Enable Spellcheck",
        description: "Enable or disable spellcheck in the chat input field",
      },
    },
    items: {
      theme: {
        title: "Theme",
        description: "Select your preferred color theme for the application.",
      },
      "show-scrollbar": {
        title: "Show Scrollbar",
        description: "Enable or disable the scrollbar in the chat window.",
      },
      "support-email": {
        title: "Support Email",
        description:
          "Set the support email address that should be accessible by users when they need help.",
      },
      "app-name": {
        title: "Name",
        description:
          "Set a name that is displayed on the login page to all users.",
      },
      "chat-message-alignment": {
        title: "Chat Message Alignment",
        description:
          "Select the message alignment mode when using the chat interface.",
      },
      "display-language": {
        title: "Display Language",
        description:
          "Select the preferred language to render AnythingLLM's UI in - when translations are available.",
      },
      logo: {
        title: "Brand Logo",
        description: "Upload your custom logo to showcase on all pages.",
        add: "Add a custom logo",
        recommended: "Recommended size: 800 x 200",
        remove: "Remove",
        replace: "Replace",
      },
      "welcome-messages": {
        title: "Welcome Messages",
        description:
          "Customize the welcome messages displayed to your users. Only non-admin users will see these messages.",
        new: "New",
        system: "system",
        user: "user",
        message: "message",
        assistant: "AnythingLLM Chat Assistant",
        "double-click": "Double click to edit...",
        save: "Save Messages",
      },
      "browser-appearance": {
        title: "Browser Appearance",
        description:
          "Customize the appearance of the browser tab and title when the app is open.",
        tab: {
          title: "Title",
          description:
            "Set a custom tab title when the app is open in a browser.",
        },
        favicon: {
          title: "Favicon",
          description: "Use a custom favicon for the browser tab.",
        },
      },
      "sidebar-footer": {
        title: "Sidebar Footer Items",
        description:
          "Customize the footer items displayed on the bottom of the sidebar.",
        icon: "Icon",
        link: "Link",
      },
      "render-html": {
        title: "Render HTML in chat",
        description:
          "Render HTML responses in assistant responses.\nThis can result in a much higher fidelity of response quality, but can also lead to potential security risks.",
      },
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
      "These are the credentials and settings for your preferred LLM chat & embedding provider. It is important that these keys are current and correct, or else AnythingLLM will not function properly.",
    provider: "LLM Provider",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure Service Endpoint",
        api_key: "API Key",
        chat_deployment_name: "Chat Deployment Name",
        chat_model_token_limit: "Chat Model Token Limit",
        model_type: "Model Type",
        model_type_tooltip:
          "If your deployment uses a reasoning model (o1, o1-mini, o3-mini, etc.), set this to “Reasoning”. Otherwise, your chat requests may fail.",
        default: "Default",
        reasoning: "Reasoning",
      },
    },
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
      "When using an LLM that does not natively support an embedding engine - you may need to additionally specify credentials for embedding text.",
    "desc-end":
      "Embedding is the process of turning text into vectors. These credentials are required to turn your files and prompts into a format which AnythingLLM can use to process.",
    provider: {
      title: "Embedding Provider",
    },
  },

  text: {
    title: "Text splitting & Chunking Preferences",
    "desc-start":
      "Sometimes, you may want to change the default way that new documents are split and chunked before being inserted into your vector database.",
    "desc-end":
      "You should only modify this setting if you understand how text splitting works and it's side effects.",
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

  // Search & Retrieval
  searchRetrieval: {
    title: "Search & Retrieval",
    description:
      "Configure how workspace searches are enhanced before querying the vector database.",
    queryRewrite: {
      title: "Query Rewriting",
      description:
        "When enabled, follow-up questions are rewritten into standalone search queries using chat history, improving RAG results in multi-turn conversations.",
      on: "On — rewrite follow-up queries (recommended)",
      off: "Off — send queries as-is",
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
      active: "Active Domains",
      created: "Created",
    },
  },

  "embed-row": {
    design: "Design",
    code: "Code",
    disable: "Disable",
    enable: "Enable",
    "clear-chats": "Clear Chats",
    "clear-chats-hint": "Clear all chats for this embed (GDPR)",
    delete: "Delete",
    disabled: "Embed has been disabled.",
    enabled: "Embed is active.",
    deleted: "Embed has been removed from the system.",
    "chats-cleared": "{{count}} chat(s) successfully cleared.",
    "no-chats": "No chats to clear.",
    "all-domains": "all",
    "confirm-disable":
      "Are you sure you want to disable this embed?\n\nOnce disabled, the chatbot will be hidden on your website.",
    "confirm-delete":
      "Are you sure you want to delete this embed?\n\nOnce deleted, the chatbot will no longer work on your website.\n\nThis action cannot be undone.",
    "confirm-clear-chats":
      "Are you sure you want to clear all {{count}} chat(s) for this embed?\n\nThis action cannot be undone.",
  },

  "embed-modal": {
    "update-title": "Update Embed",
    "create-title": "Create New Embed for Workspace",
    "update-success": "Embed updated successfully.",
    "no-chats": "No chats to clear.",
    "confirm-clear-chats":
      "Are you sure you want to clear all {{count}} chat(s) for this embed?\n\nThis action cannot be undone.",
    "chats-cleared": "{{count}} chat(s) successfully cleared.",
    "clear-error": "Failed to clear chats.",
    "clear-chats-hint": "Manually clear all chats for this embed.",
    "clear-chats-button": "Clear {{count}} chat(s)",
    cancel: "Cancel",
    "update-button": "Update Embed",
    "create-button": "Create Embed",
    workspace: {
      label: "Workspace",
      hint: "This is the workspace your chat window will be based on. All default settings will be inherited from the workspace unless overridden by this configuration.",
    },
    "chat-mode": {
      label: "Allowed Chat Method",
      hint: "Set how your chatbot should operate. Query means it will only respond when a document helps answer the query. Chat opens the conversation to general questions and can answer queries entirely unrelated to your workspace.",
      chat: "Chat: Respond to all questions regardless of context",
      query:
        "Query: Only respond to chats related to documents in the workspace",
    },
    domains: {
      label: "Restrict Requests by Domain",
      hint: "This filter will block any requests that come from a domain other than those listed below. Leaving this empty allows anyone to use your embed on any website.",
      placeholder: "https://mysite.com, https://anythingllm.com",
    },
    "max-chats-day": {
      label: "Max Chats per Day",
      hint: "Limit the number of chats this embedded chat can process in a 24-hour period. Zero means unlimited.",
    },
    "max-chats-session": {
      label: "Max Chats per Session",
      hint: "Limit the number of chats a session user can send with this embed in a 24-hour period. Zero means unlimited.",
    },
    "message-limit": {
      label: "Message History Limit",
      hint: "The number of previous messages to include in the chat context. Default is 20.",
    },
    "chat-retention": {
      label: "Chat Retention Period (GDPR)",
      hint: "Automatic deletion after the retention period expires. Default is unlimited retention.",
      never: "Unlimited",
      days: "Days",
    },
    "model-override": {
      label: "Enable Dynamic Model Usage",
      hint: "Allow setting the preferred LLM model to override the workspace default.",
    },
    "temperature-override": {
      label: "Enable Dynamic LLM Temperature",
      hint: "Allow setting the LLM temperature to override the workspace default.",
    },
    "prompt-override": {
      label: "Enable Prompt Override",
      hint: "Allow setting the system prompt to override the workspace default.",
    },
    "script-info":
      "After creating an embed, you will receive a link that you can publish on your website with a simple <script> tag.",
  },

  "chat-row": {
    delete: "Delete",
    "confirm-delete":
      "Are you sure you want to delete this chat?\n\nThis action cannot be undone.",
    "view-text": "View Text",
    "session-id": "Session ID:",
    username: "Username:",
    "client-ip": "Client IP Address:",
    "client-host": "Client Host URL:",
    "view-thoughts": "View Thoughts",
  },

  "embed-chats": {
    title: "Embed Chat History",
    export: "Export",
    "clear-all": "Clear All Chats",
    "clear-all-confirm":
      "Are you sure you want to clear ALL embed chats?\n\nThis action cannot be undone.",
    "clear-all-success": "{{count}} embed chats successfully cleared.",
    "clear-all-error": "Failed to clear embed chats.",
    description:
      "These are all the recorded conversations from any embed that you have published, grouped by conversation.",
    "no-conversations": "No conversations found.",
    "no-chats": "No chats found.",
    "retention-header": "GDPR data deletion active",
    "cutoff-date": "Retention {{days}} days — today's chats expire on {{date}}",
    table: {
      embed: "Embed",
      sender: "Sender",
      message: "Message",
      response: "Response",
      at: "Sent At",
    },
  },

  security: {
    title: "Security",
    multiuser: {
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
    },
    password: {
      title: "Password Protection",
      description:
        "Protect your AnythingLLM instance with a password. If you forget this there is no recovery method so ensure you save this password.",
      "password-label": "Instance Password",
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
    llm: "LLM Provider",
    embedding: "Embedding Preference",
    vector: "Vector Database",
    anonymous: "Anonymous Telemetry Enabled",
  },

  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    obsidian: {
      name: "Obsidian",
      description: "Import Obsidian vault in a single click.",
      vault_location: "Vault Location",
      vault_description:
        "Select your Obsidian vault folder to import all notes and their connections.",
      selected_files: "Found {{count}} markdown files",
      importing: "Importing vault...",
      import_vault: "Import Vault",
      processing_time:
        "This may take a while depending on the size of your vault.",
      vault_warning:
        "To avoid any conflicts, make sure your Obsidian vault is not currently open.",
    },
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
      bypass_ssl: "Bypass SSL Certificate Validation",
      bypass_ssl_explained:
        "Enable this option to bypass SSL certificate validation for self-hosted confluence instances with self-signed certificate",
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
    attachments_processing: "Attachments are processing. Please wait...",
    send_chat: "send a chat.",
    send_message: "Send a message",
    attach_file: "Attach a file to this chat",
    slash: "View all available slash commands for chatting.",
    agents: "View all available agents you can use for chatting.",
    text_size: "Change text size.",
    microphone: "Speak your prompt.",
    send: "Send prompt message to workspace",
    tts_speak_message: "TTS Speak message",
    copy: "Copy",
    regenerate: "Regenerate",
    regenerate_response: "Regenerate response",
    good_response: "Good response",
    more_actions: "More actions",
    hide_citations: "Hide citations",
    show_citations: "Show citations",
    pause_tts_speech_message: "Pause TTS speech of message",
    fork: "Fork",
    delete: "Delete",
    save_submit: "Save & Submit",
    cancel: "Cancel",
    edit_prompt: "Edit prompt",
    edit_response: "Edit response",
    at_agent: "@agent",
    default_agent_description: " - the default agent for this workspace.",
    custom_agents_coming_soon: "custom agents are coming soon!",
    slash_reset: "/reset",
    preset_reset_description: "Clear your chat history and begin a new chat",
    add_new_preset: " Add New Preset",
    command: "Command",
    your_command: "your-command",
    placeholder_prompt:
      "This is the content that will be injected in front of your prompt.",
    description: "Description",
    placeholder_description: "Responds with a poem about LLMs.",
    save: "Save",
    small: "Small",
    normal: "Normal",
    large: "Large",
    workspace_llm_manager: {
      search: "Search LLM providers",
      loading_workspace_settings: "Loading workspace settings...",
      available_models: "Available Models for {{provider}}",
      available_models_description: "Select a model to use for this workspace.",
      save: "Use this model",
      saving: "Setting model as workspace default...",
      missing_credentials: "This provider is missing credentials!",
      missing_credentials_description: "Click to set up credentials",
    },
  },

  profile_settings: {
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    new_password: "New Password",
    password_description: "Password must be at least 8 characters long",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Theme Preference",
    language: "Preferred language",
    failed_upload: "Failed to upload profile picture: {{error}}",
    upload_success: "Profile picture uploaded.",
    failed_remove: "Failed to remove profile picture: {{error}}",
    profile_updated: "Profile updated.",
    failed_update_user: "Failed to update user: {{error}}",
    account: "Account",
    support: "Support",
    signout: "Sign out",
  },

  "keyboard-shortcuts": {
    title: "Keyboard Shortcuts",
    shortcuts: {
      settings: "Open Settings",
      workspaceSettings: "Open Current Workspace Settings",
      home: "Go to Home",
      workspaces: "Manage Workspaces",
      apiKeys: "API Keys Settings",
      llmPreferences: "LLM Preferences",
      chatSettings: "Chat Settings",
      help: "Show keyboard shortcuts help",
      showLLMSelector: "Show workspace LLM Selector",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Success!",
        success_description:
          "Your System Prompt has been published to the Community Hub!",
        success_thank_you: "Thank you for sharing to the Community!",
        view_on_hub: "View on Community Hub",
        modal_title: "Publish System Prompt",
        name_label: "Name",
        name_description: "This is the display name of your system prompt.",
        name_placeholder: "My System Prompt",
        description_label: "Description",
        description_description:
          "This is the description of your system prompt. Use this to describe the purpose of your system prompt.",
        tags_label: "Tags",
        tags_description:
          "Tags are used to label your system prompt for easier searching. You can add multiple tags. Max 5 tags. Max 20 characters per tag.",
        tags_placeholder: "Type and press Enter to add tags",
        visibility_label: "Visibility",
        public_description: "Public system prompts are visible to everyone.",
        private_description: "Private system prompts are only visible to you.",
        publish_button: "Publish to Community Hub",
        submitting: "Publishing...",
        submit: "Publish to Community Hub",
        prompt_label: "Prompt",
        prompt_description:
          "This is the actual system prompt that will be used to guide the LLM.",
        prompt_placeholder: "Enter your system prompt here...",
      },
      agent_flow: {
        public_description: "Public agent flows are visible to everyone.",
        private_description: "Private agent flows are only visible to you.",
        success_title: "Success!",
        success_description:
          "Your Agent Flow has been published to the Community Hub!",
        success_thank_you: "Thank you for sharing to the Community!",
        view_on_hub: "View on Community Hub",
        modal_title: "Publish Agent Flow",
        name_label: "Name",
        name_description: "This is the display name of your agent flow.",
        name_placeholder: "My Agent Flow",
        description_label: "Description",
        description_description:
          "This is the description of your agent flow. Use this to describe the purpose of your agent flow.",
        tags_label: "Tags",
        tags_description:
          "Tags are used to label your agent flow for easier searching. You can add multiple tags. Max 5 tags. Max 20 characters per tag.",
        tags_placeholder: "Type and press Enter to add tags",
        visibility_label: "Visibility",
        publish_button: "Publish to Community Hub",
        submitting: "Publishing...",
        submit: "Publish to Community Hub",
        privacy_note:
          "Agent flows are always uploaded as private to protect any sensitive data. You can change the visibility in the Community Hub after publishing. Please verify your flow does not contain any sensitive or private information before publishing.",
      },
      slash_command: {
        success_title: "Success!",
        success_description:
          "Your Slash Command has been published to the Community Hub!",
        success_thank_you: "Thank you for sharing to the Community!",
        view_on_hub: "View on Community Hub",
        modal_title: "Publish Slash Command",
        name_label: "Name",
        name_description: "This is the display name of your slash command.",
        name_placeholder: "My Slash Command",
        description_label: "Description",
        description_description:
          "This is the description of your slash command. Use this to describe the purpose of your slash command.",
        command_label: "Command",
        command_description:
          "This is the slash command that users will type to trigger this preset.",
        command_placeholder: "my-command",
        tags_label: "Tags",
        tags_description:
          "Tags are used to label your slash command for easier searching. You can add multiple tags. Max 5 tags. Max 20 characters per tag.",
        tags_placeholder: "Type and press Enter to add tags",
        visibility_label: "Visibility",
        public_description: "Public slash commands are visible to everyone.",
        private_description: "Private slash commands are only visible to you.",
        publish_button: "Publish to Community Hub",
        submitting: "Publishing...",
        prompt_label: "Prompt",
        prompt_description:
          "This is the prompt that will be used when the slash command is triggered.",
        prompt_placeholder: "Enter your prompt here...",
      },
      generic: {
        unauthenticated: {
          title: "Authentication Required",
          description:
            "You need to authenticate with the AnythingLLM Community Hub before publishing items.",
          button: "Connect to Community Hub",
        },
      },
    },
  },
  "embed-widgets": {
    widgets: "Widgets",
    history: "History (classic)",
    analytics: "Conversations (new)",
  },
  "embed-analytics": {
    title: "Analytics Dashboard",
    "load-error": "Error loading analytics data.",
    "all-time": "All Time",
    "statistics-title": "STATISTICS",
    stats: {
      "total-chats": "AI Messages",
      conversations: "Conversations",
      "words-prompt": "Words in Requests",
      "avg-per-conv": "Avg per Conversation",
      "conversations-label": "Conversations",
      "conversations-desc": "Total number of conversations",
      "messages-label": "Messages",
      "messages-desc": "Total number of chat messages",
      "avg-messages-label": "Avg Messages",
      "avg-messages-desc": "Average messages per conversation",
      "avg-words-prompt-label": "Avg Words/Request",
      "avg-words-prompt-desc": "Average word count per user request",
      "avg-words-response-label": "Avg Words/Response",
      "avg-words-response-desc": "Average word count per AI response",
      "max-words-prompt-label": "Max Words (Request)",
      "max-words-prompt-desc": "Longest user request (outlier indicator)",
      "show-technical": "Show technical details",
    },
    "conversations-title": "CONVERSATIONS",
    "conversation-number": "Conversation #{{id}}",
    messages: "Messages",
    request: "Request",
    response: "Response",
    "no-conversations": "No conversations available.",
    "session-copied": "Session ID copied!",
    "retention-notice":
      "GDPR data deletion active — retention {{days}} days, chats expire on {{expiryDate}}",
    "select-embed": "Select embed",
    "embed-label": "Embed #{{id}} ({{workspace}})",
    conversations: {
      "seconds-ago": "a few seconds ago",
      "minutes-ago_one": "{{count}} minute ago",
      "minutes-ago_other": "{{count}} minutes ago",
      "hours-ago_one": "{{count}} hour ago",
      "hours-ago_other": "{{count}} hours ago",
      "days-ago_one": "{{count}} day ago",
      "days-ago_other": "{{count}} days ago",
      "months-ago_one": "{{count}} month ago",
      "months-ago_other": "{{count}} months ago",
      "years-ago_one": "{{count}} year ago",
      "years-ago_other": "{{count}} years ago",
      "conversation-number": "Conversation #{{number}}",
      "new-badge": "NEW",
      "no-preview": "No preview available",
      created: "Created:",
      "last-message": "Last message:",
      "message-count_one": "{{count}} message",
      "message-count_other": "{{count}} messages",
      "no-messages": "No messages found",
      "copy-id": "Copy conversation ID",
      "id-copied": "Conversation ID copied",
    },
  },
  "date-picker": {
    today: "Today",
    yesterday: "Yesterday",
    "this-week": "This Week",
    "last-week": "Last Week",
    "this-month": "This Month",
    "last-month": "Last Month",
    all: "All Time",
    apply: "Apply",
    "custom-range": "Select period",
  },
  "code-snippet-modal": {
    title: "Copy Embed Code",
    close: "Close",
    copied: "Snippet copied to clipboard!",
    "script-comment":
      "Paste this script tag into your website's <head> or <body> tag.",
    "script-tag": {
      label: "HTML Script Tag Embed Code",
      hint: "Embed your chat widget as a helpdesk chat in the corner of your website.",
      "view-options": "View all style and configuration options →",
    },
  },
  billing: {
    customer: {
      "load-error": "Usage data could not be loaded.",
      loading: "Loading usage data...",
      "your-quota": "Your Quota",
      "quota-description": "Overview of your usage in this workspace.",
      "unlimited-quota": "Unlimited Quota",
      "unlimited-description":
        "You can use this workspace without any restrictions.",
      consumed: "Consumed",
      remaining: "Remaining",
      used: "used",
      "billing-cycle": "Billing Cycle",
      "cycle-info-description":
        "Information about your current billing period.",
      "next-cycle-start": "Next Cycle Start",
      day: "day",
      days: "days",
      "cycle-duration": "Cycle Duration",
      "current-cycle": "Current Cycle",
      "quota-exhausted": "Quota Exhausted",
      "quota-exhausted-description":
        "You have reached your message limit for this period. Your quota will be renewed on",
      "quota-almost-exhausted": "Quota Almost Exhausted",
      "quota-almost-description":
        "You have already used {{percentage}}% of your quota. There are {{remaining}} messages remaining until",
      "messages-until": "renewed.",
    },
    admin: {
      "current-usage": "Current Usage",
      "usage-description":
        "Live view of customer usage for this workspace.",
      "loading-usage": "Loading usage data...",
      consumed: "Consumed",
      remaining: "Remaining",
      unlimited: "Unlimited",
      used: "used",
      "next-cycle-start": "Next Cycle Start",
      day: "day",
      days: "days",
      "cycle-duration": "Cycle Duration",
      "current-cycle": "Current Cycle",
      "no-usage-data": "No usage data available",
      "messages-limit": "Message Limit",
      "messages-limit-description":
        "Maximum number of messages per billing cycle. Leave empty for unlimited.",
      "billing-cycle": "Billing Cycle",
      "cycle-reset-description":
        "The message quota is automatically reset at the configured time.",
      "cycle-start-date": "Cycle Start Date",
      "cycle-duration-label": "Cycle Duration",
      "select-placeholder": "-- Select --",
      "next-cycle-start-label": "Next Cycle Start:",
      "save-success": "Billing settings updated!",
      "save-error": "Error: {{message}}",
      saving: "Saving...",
      "update-workspace": "Update Workspace",
      "info-title": "Note:",
      "info-text":
        "When upgrading, the start date can be set to the current date to reset the cycle immediately. The quota will then start counting from scratch.",
    },
    cycle: {
      "1-month": "1 Month",
      "2-months": "2 Months",
      "3-months": "3 Months (Quarter)",
      "4-months": "4 Months",
      "6-months": "6 Months (Half Year)",
      "12-months": "12 Months (Year)",
      months: "Months",
    },
    "messages-limit": {
      label: "Monthly Message Limit",
      description:
        "Defines the maximum number of messages per month for this workspace. The quota renews monthly.",
      "default-hint":
        "Default: Unlimited. Once the limit is exceeded, no further AI requests will be accepted until the next month.",
      "optional-hint": "Optional. Leave empty for no limit.",
      "unlimited-placeholder": "Unlimited",
    },
  },
};

export default TRANSLATIONS;
