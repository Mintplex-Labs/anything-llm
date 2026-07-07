const TRANSLATIONS = {
  onboarding: {
    home: {
      welcome: "Welcome",
      getStarted: "Get Started",
    },
    llm: {
      title: "LLM Preference",
      description:
        "GOV AI VN168 can work with many LLM providers. This will be the service which handles chatting.",
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
      title: "Welcome to GOV AI VN168",
      description: "Help us make GOV AI VN168 built for your needs. Optional.",
      email: "What's your email?",
      useCase: "What will you use GOV AI VN168 for?",
      useCaseWork: "For work",
      useCasePersonal: "For personal use",
      useCaseOther: "Other",
      comment: "How did you hear about GOV AI VN168?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - Let us know how you found us!",
      skip: "Skip Survey",
      thankYou: "Thank you for your feedback!",
    },
  },
  common: {
    "workspaces-name": "Workspace Name",
    selection: "Model Selection",
    saving: "Saving...",
    save: "Save changes",
    previous: "Previous Page",
    next: "Next Page",
    optional: "Optional",
    yes: "Yes",
    no: "No",
    on: "On",
    none: "None",
    stopped: "Stopped",
    search: "Search",
    username_requirements:
      "Username must be 2-32 characters, start with a lowercase letter, and only contain lowercase letters, numbers, underscores, hyphens, and periods.",
    loading: "Loading",
    refresh: "Refresh",
    "new-thread": "New Thread",
    "starting-thread": "Starting Thread...",
  },
  home: {
    welcome: "Welcome",
    chooseWorkspace: "Choose a workspace to start chatting!",
    notAssigned:
      "You currently aren't assigned to any workspaces.\nPlease contact your administrator to request access to a workspace.",
    goToWorkspace: 'Go to "{{workspace}}"',
  },
  settings: {
    title: "Instance Settings",
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
    "voice-speech": "Voice & Speech",
    "vector-database": "Vector Database",
    embeds: "Chat Embed",
    security: "Security",
    "event-logs": "Event Logs",
    "scheduled-jobs": "Scheduled Jobs",
    privacy: "Privacy & Data",
    "ai-providers": "AI Providers",
    "agent-skills": "Agent Skills",
    "model-router": "Model Router",
    "community-hub": {
      title: "Community Hub",
      trending: "Explore Trending",
      "your-account": "Your Account",
      "import-item": "Import Item",
    },
    admin: "Admin",
    tools: "Tools",
    "system-prompt-variables": "System Prompt Variables",
    "default-system-prompt": "Default System Prompt",
    "experimental-features": "Experimental Features",
    contact: "Contact Support",
    "browser-extension": "Browser Extension",
    "mobile-app": "GOV AI VN168 Mobile",
    channels: "Channels",
    "available-channels": {
      telegram: "Telegram",
    },
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
    "sign-in":
      "Enter your username and password to access your {{appName}} instance.",
    "password-reset": {
      title: "Password Reset",
      description:
        "Provide the necessary information below to reset your password.",
      "recovery-codes": "Recovery Codes",
      "back-to-login": "Back to Login",
    },
  },
  "main-page": {
    greeting: "How can I help you today?",
    quickActions: {
      createAgent: "Create an Agent",
      editWorkspace: "Edit Workspace",
      uploadDocument: "Upload a Document",
    },
  },
  "new-workspace": {
    title: "New Workspace",
    placeholder: "My Workspace",
    createTitle: "Create new workspace",
    createButton: "Create workspace",
    cancel: "Cancel",
    description:
      "After creating this workspace only admins will be able to see it. You can add users after it has been created.",
    error: "Error: {{error}}",
  },
  "workspaces—settings": {
    general: "General Settings",
    chat: "Chat Settings",
    vector: "Vector Database",
    members: "Members",
    agent: "Agent Configuration",
  },
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
      body: "the benefits of GOV AI VN168",
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
    },
    mode: {
      title: "Chat mode",
      automatic: {
        title: "Agent",
        description:
          "will automatically use tools if the model and provider support native tool calling.<br />If native tooling is not supported, you will need to use the @agent command to use tools.",
      },
      chat: {
        title: "Chat",
        description:
          "will provide answers with the LLM's general knowledge <b>and</b> document context that is found.<br />You will need to use the @agent command to use tools.",
      },
      query: {
        title: "Query",
        description:
          "will provide answers <b>only</b> if document context is found.<br />You will need to use the @agent command to use tools.",
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
      web: {
        title: "Web Search",
        description:
          "Enable your agent to search the web to answer your questions by connecting to a web-search (SERP) provider.",
      },
      sql: {
        title: "SQL Connector",
        description:
          "Enable your agent to be able to leverage SQL to answer you questions by connecting to various SQL database providers.",
      },
      filesystem: {
        title: "File System Access",
        description:
          "Enable your agent to read, write, search, and manage files within a designated directory. Supports file editing, directory navigation, and content search.",
        learnMore: "Learn more about this how to use this skill",
        configuration: "Configuration",
        readActions: "Read Actions",
        writeActions: "Write Actions",
        warning:
          "Filesystem access can be dangerous as it can modify or delete files. Please consult the <a>documentation</a> before enabling.",
        skills: {
          "read-text-file": {
            title: "Read File",
            description:
              "Read contents of files (text, code, PDF, images, etc.)",
          },
          "read-multiple-files": {
            title: "Read Multiple Files",
            description: "Read multiple files at once",
          },
          "list-directory": {
            title: "List Directory",
            description: "List files and directories in a folder",
          },
          "search-files": {
            title: "Search Files",
            description: "Search for files by name or content",
          },
          "get-file-info": {
            title: "Get File Info",
            description: "Get detailed metadata about files",
          },
          "write-text-file": {
            title: "Write Text File",
            description:
              "Create new text files or overwrite existing text files",
          },
          "edit-file": {
            title: "Edit File",
            description: "Make line-based edits to text files",
          },
          "create-directory": {
            title: "Create Directory",
            description: "Create new directories",
          },
          "copy-file": {
            title: "Copy File",
            description: "Copy files and directories",
          },
          "move-file": {
            title: "Move/Rename File",
            description: "Move or rename files and directories",
          },
        },
      },
      createFiles: {
        title: "Document Creation",
        description:
          "Enable your agent to create binary document formats like PowerPoint presentations, Excel spreadsheets, Word documents, and PDFs. Files can be downloaded directly from the chat window.",
        configuration: "Available Document Types",
        skills: {
          "create-text-file": {
            title: "Text Files",
            description:
              "Create text files with any content and extension (.txt, .md, .json, .csv, etc.)",
          },
          "create-pptx": {
            title: "PowerPoint Presentations",
            description:
              "Create new PowerPoint presentations with slides, titles, and bullet points",
          },
          "create-pdf": {
            title: "PDF Documents",
            description:
              "Create PDF documents from markdown or plain text with basic styling",
          },
          "create-xlsx": {
            title: "Excel Spreadsheets",
            description:
              "Create Excel documents for tabular data with sheets and styling",
          },
          "create-docx": {
            title: "Word Documents",
            description:
              "Create Word documents with basic styling and formatting",
          },
        },
      },
      gmail: {
        title: "GMail",
        description:
          "Enable your agent to interact with Gmail - search emails, read threads, compose drafts, send emails, and manage your inbox. <a>Read the documentation</a>.",
        multiUserWarning:
          "Gmail integration is not available in multi-user mode for security reasons. Please disable multi-user mode to use this feature.",
        configuration: "Gmail Configuration",
        deploymentId: "Deployment ID",
        deploymentIdHelp:
          "The deployment ID from your Google Apps Script web app",
        apiKey: "API Key",
        apiKeyHelp:
          "The API key you configured in your Google Apps Script deployment",
        configurationRequired:
          "Please configure the Deployment ID and API Key to enable Gmail skills.",
        configured: "Configured",
        searchSkills: "Search skills...",
        noSkillsFound: "No skills match your search.",
        categories: {
          search: {
            title: "Search & Read Emails",
            description: "Search and read emails from your Gmail inbox",
          },
          drafts: {
            title: "Draft Emails",
            description: "Create, edit, and manage email drafts",
          },
          send: {
            title: "Send & Reply to Emails",
            description: "Send emails and reply to threads immediately",
          },
          threads: {
            title: "Manage Email Threads",
            description:
              "Manage email threads - mark read/unread, archive, trash",
          },
          account: {
            title: "Integration Statistics",
            description: "View mailbox statistics and account information",
          },
        },
        skills: {
          getInbox: {
            title: "Get Inbox",
            description: "Streamlined way to get the inbox emails from Gmail",
          },
          search: {
            title: "Search Emails",
            description: "Search emails using Gmail query syntax",
          },
          readThread: {
            title: "Read Thread",
            description: "Read a full email thread by ID",
          },
          createDraft: {
            title: "Create Draft",
            description: "Create a new draft email",
          },
          createDraftReply: {
            title: "Create Draft Reply",
            description: "Create a draft reply to an existing thread",
          },
          updateDraft: {
            title: "Update Draft",
            description: "Update an existing draft email",
          },
          getDraft: {
            title: "Get Draft",
            description: "Retrieve a specific draft by ID",
          },
          listDrafts: {
            title: "List Drafts",
            description: "List all draft emails",
          },
          deleteDraft: {
            title: "Delete Draft",
            description: "Delete a draft email",
          },
          sendDraft: {
            title: "Send Draft",
            description: "Send an existing draft email",
          },
          sendEmail: {
            title: "Send Email",
            description: "Send an email immediately",
          },
          replyToThread: {
            title: "Reply to Thread",
            description: "Reply to an email thread immediately",
          },
          markRead: {
            title: "Mark Read",
            description: "Mark a thread as read",
          },
          markUnread: {
            title: "Mark Unread",
            description: "Mark a thread as unread",
          },
          moveToTrash: {
            title: "Move to Trash",
            description: "Move a thread to trash",
          },
          moveToArchive: {
            title: "Archive",
            description: "Archive a thread",
          },
          moveToInbox: {
            title: "Move to Inbox",
            description: "Move a thread to inbox",
          },
          getMailboxStats: {
            title: "Mailbox Stats",
            description: "Get unread counts and mailbox statistics",
          },
        },
      },
      googleCalendar: {
        title: "Google Calendar",
        description:
          "Enable your agent to interact with Google Calendar - view calendars, get events, create and update events, and manage RSVPs. <a>Read the documentation</a>.",
        multiUserWarning:
          "Google Calendar integration is not available in multi-user mode for security reasons. Please disable multi-user mode to use this feature.",
        configuration: "Google Calendar Configuration",
        deploymentId: "Deployment ID",
        deploymentIdHelp:
          "The deployment ID from your Google Apps Script web app",
        apiKey: "API Key",
        apiKeyHelp:
          "The API key you configured in your Google Apps Script deployment",
        configurationRequired:
          "Please configure the Deployment ID and API Key to enable Google Calendar skills.",
        configured: "Configured",
        searchSkills: "Search skills...",
        noSkillsFound: "No skills match your search.",
        categories: {
          calendars: {
            title: "Calendars",
            description: "View and manage your Google Calendars",
          },
          readEvents: {
            title: "Read Events",
            description: "View and search calendar events",
          },
          writeEvents: {
            title: "Create & Update Events",
            description: "Create new events and modify existing ones",
          },
          rsvp: {
            title: "RSVP Management",
            description: "Manage your response status for events",
          },
        },
        skills: {
          listCalendars: {
            title: "List Calendars",
            description: "List all calendars you own or are subscribed to",
          },
          getCalendar: {
            title: "Get Calendar Details",
            description: "Get detailed information about a specific calendar",
          },
          getEvent: {
            title: "Get Event",
            description: "Get detailed information about a specific event",
          },
          getEventsForDay: {
            title: "Get Events for Day",
            description: "Get all events scheduled for a specific day",
          },
          getEvents: {
            title: "Get Events (Date Range)",
            description: "Get events within a custom date range",
          },
          getUpcomingEvents: {
            title: "Get Upcoming Events",
            description:
              "Get events for today, this week, or this month using simple keywords",
          },
          quickAdd: {
            title: "Quick Add Event",
            description:
              "Create an event from natural language (e.g., 'Meeting tomorrow at 3pm')",
          },
          createEvent: {
            title: "Create Event",
            description:
              "Create a new event with full control over all properties",
          },
          updateEvent: {
            title: "Update Event",
            description: "Update an existing calendar event",
          },
          setMyStatus: {
            title: "Set RSVP Status",
            description: "Accept, decline, or tentatively accept an event",
          },
        },
      },
      outlook: {
        title: "Outlook",
        description:
          "Enable your agent to interact with Microsoft Outlook - search emails, read threads, compose drafts, send emails, and manage your inbox via Microsoft Graph API. <a>Read the documentation</a>.",
        multiUserWarning:
          "Outlook integration is not available in multi-user mode for security reasons. Please disable multi-user mode to use this feature.",
        configuration: "Outlook Configuration",
        authType: "Account Type",
        authTypeHelp:
          "Choose which types of Microsoft accounts can authenticate. 'All accounts' supports both personal and work/school accounts. 'Personal only' restricts to personal Microsoft accounts. 'Organization only' restricts to work/school accounts from a specific Azure AD tenant.",
        authTypeCommon: "All accounts (personal & work/school)",
        authTypeConsumers: "Personal Microsoft accounts only",
        authTypeOrganization: "Organization accounts only (requires Tenant ID)",
        clientId: "Application (Client) ID",
        clientIdHelp:
          "The Application (Client) ID from your Azure AD app registration",
        tenantId: "Directory (Tenant) ID",
        tenantIdHelp:
          "The Directory (Tenant) ID from your Azure AD app registration. Required only for organization-only authentication.",
        clientSecret: "Client Secret",
        clientSecretHelp:
          "The client secret value from your Azure AD app registration",
        configurationRequired:
          "Please configure the Client ID and Client Secret to enable Outlook skills.",
        authRequired:
          "Save your credentials first, then authenticate with Microsoft to complete the setup.",
        authenticateWithMicrosoft: "Authenticate with Microsoft",
        authenticated: "Successfully authenticated with Microsoft Outlook.",
        revokeAccess: "Revoke Access",
        configured: "Configured",
        searchSkills: "Search skills...",
        noSkillsFound: "No skills match your search.",
        categories: {
          search: {
            title: "Search & Read Emails",
            description: "Search and read emails from your Outlook inbox",
          },
          drafts: {
            title: "Draft Emails",
            description: "Create, edit, and manage email drafts",
          },
          send: {
            title: "Send Emails",
            description: "Send new emails or reply to messages immediately",
          },
          account: {
            title: "Integration Statistics",
            description: "View mailbox statistics and account information",
          },
        },
        skills: {
          getInbox: {
            title: "Get Inbox",
            description: "Get recent emails from your Outlook inbox",
          },
          search: {
            title: "Search Emails",
            description: "Search emails using Microsoft Search syntax",
          },
          readThread: {
            title: "Read Conversation",
            description: "Read a full email conversation thread",
          },
          createDraft: {
            title: "Create Draft",
            description:
              "Create a new draft email or draft reply to an existing message",
          },
          updateDraft: {
            title: "Update Draft",
            description: "Update an existing draft email",
          },
          listDrafts: {
            title: "List Drafts",
            description: "List all draft emails",
          },
          deleteDraft: {
            title: "Delete Draft",
            description: "Delete a draft email",
          },
          sendDraft: {
            title: "Send Draft",
            description: "Send an existing draft email",
          },
          sendEmail: {
            title: "Send Email",
            description:
              "Send a new email or reply to an existing message immediately",
          },
          getMailboxStats: {
            title: "Mailbox Stats",
            description: "Get folder counts and mailbox statistics",
          },
        },
      },
      default_skill:
        "By default, this skill is enabled, but you can disable it if you don't want it to be available to the agent.",
      imported: {
        noSkillsFound: "No imported skills found",
        on: "On",
        off: "Off",
      },
    },
    mcp: {
      title: "MCP Servers",
      "loading-from-config": "Loading MCP Servers from configuration file",
      "learn-more": "Learn more about MCP Servers.",
      "no-servers-found": "No MCP servers found",
      "tool-warning":
        "For the best performance, consider disabling unwanted tools to conserve context.",
      "tools-enabled": "tools enabled",
      "stop-server": "Stop MCP Server",
      "start-server": "Start MCP Server",
      "delete-server": "Delete MCP Server",
      "tool-count-warning":
        "This MCP server has <b>{{count}} tools enabled</b> that will consume context in every chat.<br />Consider disabling unwanted tools to conserve context.",
      "startup-command": "Startup Command",
      command: "Command",
      arguments: "Arguments",
      "not-running-warning":
        "This MCP server is not running - it may be stopped or experiencing an error on startup.",
      "tool-call-arguments": "Tool call arguments",
    },
    settings: {
      title: "Agent Skill Settings",
      "max-tool-calls": {
        title: "Max Tool Calls Per Response",
        description:
          "The maximum number of tools an agent can chain to generate a single response. This prevents runaway tool calls and infinite loops.",
      },
      "intelligent-skill-selection": {
        title: "Intelligent Skill Selection",
        "beta-badge": "Beta",
        description:
          "Enable unlimited tools and cut token usage by up to 80% per query — GOV AI VN168 automatically selects the right skills for every prompt.",
        "max-tools": {
          title: "Max Tools",
          description:
            "The maximum number of tools to select for each query. We recommend setting this to higher values for larger context models.",
        },
      },
      "clarifying-questions": {
        title: "Allow agent to ask clarifying questions",
        "beta-badge": "BETA",
        description:
          "When enabled, agents can pause to ask short clarifying questions if your prompt is ambiguous.",
        "max-per-turn": {
          title: "Max questions per turn",
          description:
            "How many clarifying questions the agent may ask in a single survey.",
        },
      },
    },
    admin: {
      agentSkills: "Agent Skills",
      appIntegrations: "App Integrations",
      customSkills: "Custom Skills",
      agentFlows: "Agent Flows",
      selectPrompt: "Select an Agent Skill, Agent Flow, or MCP Server",
      createFlow: "Create Flow",
      openBuilder: "Open Builder",
      saveSuccess: "Agent preferences saved successfully.",
      saveError: "Agent preferences failed to save.",
      toggleToolError: "Failed to toggle tool.",
      back: "Back",
      on: "On",
      off: "Off",
      noFlowsFound: "No agent flows found",
    },
  },
  recorded: {
    title: "Workspace Chats",
    description:
      "These are all the recorded chats and messages that have been sent by users ordered by their creation date.",
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
      description: "Set your UI preferences for GOV AI VN168.",
    },
    branding: {
      title: "Branding & Whitelabeling",
      description:
        "White-label your GOV AI VN168 instance with custom branding.",
    },
    chat: {
      title: "Chat",
      description: "Set your chat preferences for GOV AI VN168.",
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
      "display-language": {
        title: "Display Language",
        description:
          "Select the preferred language to render GOV AI VN168's UI in - when translations are available.",
      },
      logo: {
        title: "Brand Logo",
        description: "Upload your custom logo to showcase on all pages.",
        add: "Add a custom logo",
        recommended: "Recommended size: 800 x 200",
        remove: "Remove",
        replace: "Replace",
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
  api: {
    title: "API Keys",
    description:
      "API keys allow the holder to programmatically access and manage this GOV AI VN168 instance.",
    link: "Read the API documentation",
    generate: "Generate New API Key",
    empty: "No API keys found",
    actions: "Actions",
    messages: {
      error: "Error: {{error}}",
    },
    modal: {
      title: "Create new API key",
      cancel: "Cancel",
      close: "Close",
      create: "Create API Key",
      helper:
        "Once created the API key can be used to programmatically access and configure this GOV AI VN168 instance.",
      name: {
        label: "Name",
        placeholder: "Production integration",
        helper:
          "Optional. Use a friendly name so you can identify this key later.",
      },
    },
    row: {
      copy: "Copy API Key",
      copied: "Copied",
      unnamed: "--",
      deleteConfirm:
        "Are you sure you want to deactivate this api key?\nAfter you do this it will not longer be useable.\n\nThis action is irreversible.",
    },
    table: {
      name: "Name",
      key: "API Key",
      by: "Created By",
      created: "Created",
    },
  },
  browserExtensionApi: {
    title: "Browser Extension API Keys",
    description:
      "Manage API keys for browser extensions connecting to your GOV AI VN168 instance.",
    generate: "Generate New API Key",
    empty: "No API keys found",
    actions: "Actions",
    messages: {
      error: "Error: {{error}}",
      fetchError: "Failed to fetch API keys",
    },
    table: {
      connectionString: "Extension Connection String",
      by: "Created By",
      created: "Created At",
    },
    modal: {
      title: "New Browser Extension API Key",
      cancel: "Cancel",
      create: "Create API Key",
      copy: "Copy API Key",
      copied: "API Key Copied!",
      multiUserWarning:
        "Warning: You are in multi-user mode, this API key will allow access to all workspaces associated with your account. Please share it cautiously.",
      autoConnectHint:
        'After clicking "Create API Key", GOV AI VN168 will attempt to connect to your browser extension automatically.',
      connectionHint:
        'If you see "Connected to GOV AI VN168" in the extension, the connection was successful. If not, please copy the connection string and paste it into the extension manually.',
    },
  },
  llm: {
    title: "LLM Preference",
    description:
      "These are the credentials and settings for your preferred LLM chat & embedding provider. It is important that these keys are current and correct, or else GOV AI VN168 will not function properly.",
    provider: "LLM Provider",
    searchPlaceholder: "Search all LLM providers",
    logoAlt: "{{name}} logo",
    noneSelected: "None selected",
    needSelect: "You need to select an LLM",
    messages: {
      saveSuccess: "LLM preferences saved successfully.",
      saveError: "Failed to save LLM settings: {{error}}",
    },
    providers: {
      "anythingllm-router": {
        name: "Model Router",
        description:
          "Route messages to different LLM providers based on rules you define.",
      },
      openai: {
        name: "OpenAI",
        description: "The standard option for most non-commercial use.",
      },
      azure: {
        name: "Azure OpenAI",
        description:
          "The enterprise option of OpenAI hosted on Azure services.",
      },
      anthropic: {
        name: "Anthropic",
        description: "A friendly AI Assistant hosted by Anthropic.",
      },
      gemini: {
        name: "Gemini",
        description: "Google's largest and most capable AI model",
      },
      "nvidia-nim": {
        name: "NVIDIA NIM",
        description:
          "Run full parameter LLMs directly on your NVIDIA RTX GPU using NVIDIA NIM.",
      },
      ollama: {
        name: "Ollama",
        description: "Run LLMs locally on your own machine.",
      },
      lmstudio: {
        name: "LM Studio",
        description:
          "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
      },
      "docker-model-runner": {
        name: "Docker Model Runner",
        description: "Run LLMs using Docker Model Runner.",
      },
      lemonade: {
        name: "Lemonade",
        description:
          "Run local LLMs, ASR, TTS, and more in a single unified AI runtime.",
      },
      sambanova: {
        name: "SambaNova",
        description: "Run open source models from SambaNova.",
      },
      localai: {
        name: "Local AI",
        description: "Run LLMs locally on your own machine.",
      },
      togetherai: {
        name: "Together AI",
        description: "Run open source models from Together AI.",
      },
      fireworksai: {
        name: "Fireworks AI",
        description:
          "The fastest and most efficient inference engine to build production-ready, compound AI systems.",
      },
      mistral: {
        name: "Mistral",
        description: "Run open source models from Mistral AI.",
      },
      perplexity: {
        name: "Perplexity AI",
        description:
          "Run powerful and internet-connected models hosted by Perplexity AI.",
      },
      openrouter: {
        name: "OpenRouter",
        description: "A unified interface for LLMs.",
      },
      groq: {
        name: "Groq",
        description:
          "The fastest LLM inferencing available for real-time AI applications.",
      },
      koboldcpp: {
        name: "KoboldCPP",
        description: "Run local LLMs using koboldcpp.",
      },
      textgenwebui: {
        name: "Oobabooga Web UI",
        description:
          "Run local LLMs using Oobabooga's Text Generation Web UI.",
      },
      cohere: {
        name: "Cohere",
        description: "Run Cohere's powerful Command models.",
      },
      litellm: {
        name: "LiteLLM",
        description:
          "Run LiteLLM's OpenAI compatible proxy for various LLMs.",
      },
      deepseek: {
        name: "DeepSeek",
        description: "Run DeepSeek's powerful LLMs.",
      },
      ppio: {
        name: "PPIO",
        description:
          "Run stable and cost-efficient open-source LLM APIs, such as DeepSeek, Llama, Qwen etc.",
      },
      bedrock: {
        name: "AWS Bedrock",
        description:
          "Run powerful foundation models privately with AWS Bedrock.",
      },
      apipie: {
        name: "APIpie",
        description: "A unified API of AI services from leading providers",
      },
      moonshotai: {
        name: "Moonshot AI",
        description: "Run Moonshot AI's powerful LLMs.",
      },
      privatemode: {
        name: "Privatemode",
        description: "Run LLMs with end-to-end encryption.",
      },
      novita: {
        name: "Novita AI",
        description:
          "Reliable, Scalable, and Cost-Effective for LLMs from Novita AI",
      },
      cometapi: {
        name: "CometAPI",
        description: "500+ AI Models all in one API.",
      },
      foundry: {
        name: "Microsoft Foundry Local",
        description: "Run Microsoft's Foundry models locally.",
      },
      xai: {
        name: "xAI",
        description: "Run xAI's powerful LLMs like Grok-2 and more.",
      },
      zai: {
        name: "Z.AI",
        description: "Run Z.AI's powerful GLM models.",
      },
      giteeai: {
        name: "GiteeAI",
        description: "Run GiteeAI's powerful LLMs.",
      },
      minimax: {
        name: "Minimax",
        description: "Run Minimax's powerful M2 LLMs.",
      },
      cerebras: {
        name: "Cerebras",
        description: "Run models at instant speed on Cerebras inference.",
      },
      "generic-openai": {
        name: "Generic OpenAI",
        description:
          "Connect to any OpenAi-compatible service via a custom configuration",
      },
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
  "model-router": {
    title: "Model Routers",
    description:
      "Model routers let you define rules to automatically route chat messages to different LLM providers and models based on conditions.",
    table: {
      name: "Name",
      fallback: "Fallback",
      rules: "Rules",
      workspaces: "Workspaces",
    },
    "no-routers": "No model routers yet",
    "empty-description":
      "No model routers configured yet. Create one to get started.",
    "new-router-button": "New Router",
    "delete-confirm":
      'Are you sure you want to delete the router "{{name}}"?\nThis will remove all its rules and unlink any workspaces using it.\n\nThis action is irreversible.',
    "toast-deleted": "Router deleted",
    "toast-delete-failed": "Failed to delete router: {{error}}",
    "new-router": {
      title: "Create New Model Router",
      name: "Name",
      "name-placeholder": "e.g. Cost Optimizer",
      description: "Description",
      "description-placeholder": "Optional description",
      "fallback-label": "Primary Provider & Model",
      "fallback-description":
        "Used when no routing rule matches. Also used to evaluate LLM-classified rules.",
      "cooldown-label": "Cache Cooldown (seconds)",
      "cooldown-help":
        "How long a routing decision is cached before re-evaluating rules. Set to 0 to disable caching.",
      "name-required": "Name is required.",
      "fallback-required": "Primary provider and model are required.",
      cancel: "Cancel",
      create: "Create Router",
    },
    "edit-router": {
      "back-to-routers": "Back to Model Routers",
      title: "Edit Router: {{name}}",
      save: "Save Changes",
      "toast-update-failed": "Failed to update router",
    },
    rules: {
      title: "Routing Rules",
      "title-with-name": "Router Rules: {{name}}",
      description:
        "Define the rules that determine when and how chat messages go to specific providers and models.",
      "add-rule": "Add Rule",
      "delete-confirm": 'Delete rule "{{title}}"?',
      "toast-delete-failed": "Failed to delete rule",
      "toast-reorder-failed": "Failed to reorder rules",
      "no-rules": "No rules yet",
      "empty-description":
        "Add a rule to start routing chat messages to specific providers and models.",
      "new-rule-button": "New Rule",
      "calculated-section-label":
        "Calculated rules — evaluated first, in priority order",
      "llm-section-label":
        "LLM rules — evaluated as a batch if no calculated rule matched",
      "llm-rule-body":
        'Match <desc>"{{description}}"</desc> then route to <route>{{route}}</route>',
      "calculated-no-conditions":
        "No conditions — route to <route>{{route}}</route>",
      "calculated-single-condition":
        'If <prop>{{property}}</prop> {{comparator}} <val>"{{value}}"</val> then route to <route>{{route}}</route>',
      "calculated-multi-condition":
        "If {{quantifier}} of <cond>{{conditions}}</cond> then route to <route>{{route}}</route>",
      "comparator-contains": "contains",
      "comparator-matches": "matches",
      "comparator-between": "between",
      "badge-llm": "LLM",
      "badge-calculated": "Calculated",
      "aria-drag-to-reorder": "Drag to reorder",
      "aria-edit-rule": "Edit rule",
      "aria-delete-rule": "Delete rule",
      "quantifier-any": "ANY",
      "quantifier-all": "ALL",
    },
    "rule-form": {
      "title-label": "Title",
      "rule-type": "Rule Type",
      "property-label": "Property",
      "property-select": "Select",
      "comparator-label": "Comparator",
      "comparator-select": "Select",
      "value-label": "Value",
      "add-condition": "Add condition",
      "remove-condition": "Remove condition",
      "conditions-incomplete":
        "Condition {{index}} is incomplete — fill in property, comparator, and value.",
      "match-description-label": "Match Description",
      "match-description-placeholder":
        "e.g. The user is asking about legal topics, contracts, or compliance",
      "match-description-help":
        "Describe the situation when you want this rule to match. This is evaluated by your LLM to determine if it should be used.",
      "route-to-label": "Route to Provider & Model",
      "route-to-description": "When this rule matches, use this provider/model",
      cancel: "Cancel",
      saving: "Saving...",
      "update-rule": "Update Rule",
      "create-rule": "Create Rule",
      "title-required": "Title is required",
      "toast-save-failed": "Failed to save rule",
      "type-calculated-label": "Calculated",
      "type-calculated-description":
        "Match based on message properties like content, token count, or time of day.",
      "type-llm-label": "LLM Classified",
      "type-llm-description":
        "Use an LLM to classify the message based on a description you provide.",
      "prop-prompt-content": "Prompt Content",
      "prop-token-count": "Conversation Token Count",
      "prop-message-count": "Conversation Message Count",
      "prop-current-hour": "Current Hour (0-23)",
      "prop-has-image": "Has Image Attachment",
      "cmp-contains": "contains",
      "cmp-matches-regex": "matches (regex)",
      "cmp-equals": "equals",
      "cmp-not-equals": "not equals",
      "cmp-greater-than": "greater than",
      "cmp-greater-than-or-equal": "greater than or equal",
      "cmp-less-than": "less than",
      "cmp-less-than-or-equal": "less than or equal",
      "cmp-between": "between (inclusive)",
      "placeholder-between-hour": "e.g. 9,17 (9am to 5pm)",
      "placeholder-between-numeric": "e.g. 10,50",
      "placeholder-hour": "e.g. 18 (0-23)",
      "placeholder-message-count": "e.g. 10",
      "placeholder-numeric": "e.g. 4000",
      "placeholder-contains": "e.g. code, python, rust",
      "placeholder-matches": "e.g. /\\bpython\\b/i",
      "placeholder-default": "e.g. code",
      "help-contains":
        "Comma-separated list — matches if the prompt contains any of the values (case-insensitive).",
      "help-matches":
        "Regex pattern. Use /pattern/flags for case sensitivity (defaults to case-insensitive).",
      "bool-true": "True",
      "bool-false": "False",
    },
    "provider-picker": {
      "select-provider": "Select provider",
      "setup-required": "(setup required)",
      "loading-models": "Loading models...",
      "select-model": "Select model",
      "enter-model": "Enter model name",
      "select-provider-first": "Select a provider first",
      "configure-to-continue": "Configure {{name}} to continue",
      "configure-provider": "Configure {{name}}",
      "setup-credentials":
        "Enter the required credentials to use {{name}} as a routing target.",
      cancel: "Cancel",
      "save-settings": "Save settings",
      "toast-save-failed": "Failed to save settings: {{error}}",
    },
    "router-selection": {
      "loading-routers": "Loading custom routers...",
      "no-routers-prefix-settings": "No model routers configured yet.",
      "no-routers-prefix-workspace": "No model routers configured.",
      "no-routers-link": "Create one in Model Router settings",
      "model-router-label": "Model Router",
      "select-router": "Select a router",
      "select-description": "Select which router to use for this workspace.",
      "no-routers-chat":
        "No routers configured. Create one in Settings > AI Providers > Model Router.",
      "rule-count": "({{count}} rules)",
    },
    metrics: {
      "model-router-default": "Model Router",
    },
    chat: {
      "select-router-error": "Select a router",
      "invalid-model": "Invalid model selection",
      "routed-to": "Routed to <route>{{model}}</route>",
      "routed-to-rule":
        "Routed to <route>{{model}}</route> via <rule>{{ruleTitle}}</rule>",
    },
  },
  transcription: {
    title: "Transcription Model Preference",
    description:
      "These are the credentials and settings for your preferred transcription model provider. Its important these keys are current and correct or else media files and audio will not transcribe.",
    provider: "Transcription Provider",
    searchPlaceholder: "Search audio transcription providers",
    messages: {
      saveError: "Failed to save preferences: {{error}}",
      saveSuccess: "Transcription preferences saved successfully.",
    },
    providers: {
      openai: {
        name: "OpenAI",
        description:
          "Leverage the OpenAI Whisper-large model using your API key.",
      },
      local: {
        name: "GOV AI VN168 Built-In",
        description: "Run a built-in whisper model on this instance privately.",
      },
    },
    "warn-start":
      "Using the local whisper model on machines with limited RAM or CPU can stall GOV AI VN168 when processing media files.",
    "warn-recommend":
      "We recommend at least 2GB of RAM and upload files <10Mb.",
    "warn-end":
      "The built-in model will automatically download on the first use.",
  },
  audioPreference: {
    stt: {
      title: "Speech-to-text Preference",
      description:
        "Here you can specify what kind of text-to-speech and speech-to-text providers you would want to use in your GOV AI VN168 experience. By default, we use the browser's built in support for these services, but you may want to use others.",
      provider: "Provider",
      searchPlaceholder: "Search speech to text providers",
      messages: {
        saveError: "Failed to save preferences: {{error}}",
        saveSuccess: "Speech-to-text preferences saved successfully.",
      },
      providers: {
        native: {
          name: "System native",
          description:
            "Uses your browser's built in STT service if supported.",
        },
        openai: {
          name: "OpenAI",
          description:
            "Use OpenAI's Whisper API to transcribe speech to text.",
        },
        lemonade: {
          name: "Lemonade",
          description: "Transcribe speech via your local Lemonade server.",
        },
        deepgram: {
          name: "Deepgram",
          description:
            "Transcribe speech using Deepgram's hosted Nova models.",
        },
        groq: {
          name: "Groq",
          description: "Transcribe speech using Groq's hosted models.",
        },
        "generic-openai": {
          name: "Generic OpenAI",
          description:
            "Connect to any OpenAI-compatible STT service via a custom configuration.",
        },
      },
    },
    tts: {
      title: "Text-to-speech Preference",
      description:
        "Here you can specify what kind of text-to-speech providers you would want to use in your GOV AI VN168 experience. By default, we use the browser's built in support for these services, but you may want to use others.",
      provider: "Provider",
      searchPlaceholder: "Search text to speech providers",
      messages: {
        saveError: "Failed to save preferences: {{error}}",
        saveSuccess: "Text-to-speech preferences saved successfully.",
      },
      providers: {
        native: {
          name: "System native",
          description:
            "Uses your browser's built in TTS service if supported.",
        },
        openai: {
          name: "OpenAI",
          description: "Use OpenAI's text to speech voices.",
        },
        elevenlabs: {
          name: "ElevenLabs",
          description:
            "Use ElevenLabs's text to speech voices and technology.",
        },
        piper_local: {
          name: "PiperTTS",
          description: "Run TTS models locally in your browser privately.",
        },
        kokoro: {
          name: "Kokoro",
          description:
            "Connect to a self-hosted kokoro-fastapi server for high-quality open-source voices.",
        },
        "generic-openai": {
          name: "OpenAI Compatible",
          description:
            "Connect to an OpenAI compatible TTS service running locally or remotely.",
        },
      },
    },
    noConfig: "There is no configuration needed for this provider.",
  },
  subAgents: {
    title: "Multi-Agent Orchestration",
    description:
      "Configure specialized Sub-Agents that the Manager Agent (`@agent`) can delegate tasks to dynamically.",
    addButton: "Add Sub-Agent",
    empty: {
      title: "No Sub-Agents Defined",
      description:
        "Create sub-agents for specialized tasks like creating images, synthesising voice, or deep analysis.",
      getStarted: "Get Started",
    },
    card: {
      noDescription: "No description provided.",
      input: "Input",
      output: "Output",
      modelPreference: "Model Preference:",
      edit: "Edit Agent",
      delete: "Delete Agent",
    },
    messages: {
      deleteConfirm: "Are you sure you want to delete this sub-agent?",
      deleted: "Sub-agent deleted successfully",
      deleteError: "Error deleting sub-agent: {{error}}",
      fillRequired: "Please fill in the Name and select a Model",
      updated: "Sub-agent updated successfully",
      updateError: "Error updating sub-agent: {{error}}",
      created: "Sub-agent created successfully",
      createError: "Error creating sub-agent: {{error}}",
    },
    modal: {
      createTitle: "Create New Sub-Agent",
      editTitle: "Edit Sub-Agent: {{name}}",
      agentName: "Agent Name",
      agentNamePlaceholder: "e.g. ImageGenerator",
      description:
        "Description (How/when the Manager should use this agent)",
      descriptionPlaceholder:
        "e.g. Generates high-quality images. Use this agent when the user asks to draw or visualize things.",
      inputType: "Input Type",
      outputType: "Output Type",
      modelProvider: "Model Provider",
      model: "Model",
      selectModel: "Select a Model",
      noMatchingModels:
        "No matching OpenRouter models found for this input/output type combination.",
      systemPrompt: "System Prompt (Instructions for this agent)",
      systemPromptPlaceholder:
        "e.g. You are a professional painter. When given a request, write a detailed and concise Stable Diffusion prompt to generate that visual. ONLY reply with the generated Stable Diffusion prompt, nothing else.",
      cancel: "Cancel",
      save: "Save Agent",
    },
    inputTypes: {
      text: "Text Only",
      "text+image": "Text + Image (No Vision)",
      "text+audio": "Text + Audio",
      video: "Video",
    },
    outputTypes: {
      text: "Text/Analysis",
      image: "Generated Image",
      audio: "Synthesized Audio",
      video: "Generated Video",
    },
    providers: {
      ollama: "Ollama (Local)",
    },
  },
  systemPromptVariables: {
    title: "System Prompt Variables",
    description:
      "System prompt variables are used to store configuration values that can be referenced in your system prompt to enable dynamic content in your prompts.",
    addButton: "Add Variable",
    empty: "No variables found",
    messages: {
      fetchError: "No variables found",
    },
    table: {
      key: "Key",
      value: "Value",
      description: "Description",
      type: "Type",
    },
    modal: {
      add: {
        title: "Add New Variable",
        create: "Create variable",
      },
      cancel: "Cancel",
      keyPlaceholder: "e.g., company_name",
      keyHelper:
        "Key must be unique and will be used in prompts as '{key}'. Only letters, numbers and underscores are allowed.",
      valuePlaceholder: "e.g., Acme Corp",
      descriptionPlaceholder: "Optional description",
      error: "Error: {{error}}",
      messages: {
        required: "Key and value are required",
        created: "Variable created successfully",
        createError: "Failed to create variable",
      },
    },
  },
  agentBuilder: {
    flowInfo: {
      flowName: "Flow Name",
      flowNameHint:
        "It is important to give your flow a name that an LLM can easily understand.",
      flowNameExamples:
        '"SendMessageToDiscord", "CheckStockPrice", "CheckWeather"',
      flowNamePlaceholder: "Enter flow name",
      description: "Description",
      descriptionHint:
        "It is equally important to give your flow a description that an LLM can easily understand. Be sure to include the purpose of the flow, the context it will be used in, and any other relevant information.",
      descriptionPlaceholder: "Enter flow description",
    },
  },
  embedding: {
    title: "Embedding Preference",
    "desc-start":
      "When using an LLM that does not natively support an embedding engine - you may need to additionally specify credentials for embedding text.",
    "desc-end":
      "Embedding is the process of turning text into vectors. These credentials are required to turn your files and prompts into a format which GOV AI VN168 can use to process.",
    provider: {
      title: "Embedding Provider",
    },
    searchPlaceholder: "Search all embedding providers",
    logoAlt: "{{name}} logo",
    switchWarning:
      "Switching the embedding model will reset all previously embedded documents in all workspaces.\n\nConfirming will clear all embeddings from your vector database and remove all documents from your workspaces. Your uploaded documents will not be deleted, they will be available for re-embedding.",
    messages: {
      saveSuccess: "Embedding preferences saved successfully.",
      saveError: "Failed to save embedding settings: {{error}}",
    },
    providers: {
      native: {
        name: "AnythingLLM Embedder",
        description:
          "Use the built-in embedding provider for AnythingLLM. Zero setup!",
      },
      openai: {
        name: "OpenAI",
        description: "The standard option for most non-commercial use.",
      },
      azure: {
        name: "Azure OpenAI",
        description:
          "The enterprise option of OpenAI hosted on Azure services.",
      },
      gemini: {
        name: "Gemini",
        description: "Run powerful embedding models from Google AI.",
      },
      localai: {
        name: "Local AI",
        description: "Run embedding models locally on your own machine.",
      },
      ollama: {
        name: "Ollama",
        description: "Run embedding models locally on your own machine.",
      },
      lmstudio: {
        name: "LM Studio",
        description:
          "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
      },
      lemonade: {
        name: "Lemonade",
        description:
          "Run embedding models locally on your own machine using Lemonade.",
      },
      openrouter: {
        name: "OpenRouter",
        description: "Run embedding models from OpenRouter.",
      },
      litellm: {
        name: "LiteLLM",
        description: "Run powerful embedding models from LiteLLM.",
      },
      cohere: {
        name: "Cohere",
        description: "Run powerful embedding models from Cohere.",
      },
      voyageai: {
        name: "Voyage AI",
        description: "Run powerful embedding models from Voyage AI.",
      },
      mistral: {
        name: "Mistral AI",
        description: "Run powerful embedding models from Mistral AI.",
      },
      "generic-openai": {
        name: "Generic OpenAI",
        description:
          "Run embedding models from any OpenAI compatible API service.",
      },
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
  vector: {
    title: "Vector Database",
    description:
      "These are the credentials and settings for how your GOV AI VN168 instance will function. It's important these keys are current and correct.",
    provider: {
      title: "Vector Database Provider",
      description: "There is no configuration needed for LanceDB.",
    },
    searchPlaceholder: "Search all vector database providers",
    logoAlt: "{{name}} logo",
    switchWarning:
      "Switching the vector database will reset all previously embedded documents in all workspaces.\n\nConfirming will clear all embeddings from your vector database and remove all documents from your workspaces. Your uploaded documents will not be deleted, they will be available for re-embedding.",
    messages: {
      saveSuccess: "Vector database preferences saved successfully.",
      saveError: "Failed to save vector database settings: {{error}}",
    },
    providers: {
      lancedb: {
        name: "LanceDB",
        description:
          "100% local vector DB that runs on the same instance as AnythingLLM.",
      },
      pgvector: {
        name: "PGVector",
        description: "Vector search powered by PostgreSQL.",
      },
      chroma: {
        name: "Chroma",
        description:
          "Open source vector database you can host yourself or on the cloud.",
      },
      chromacloud: {
        name: "Chroma Cloud",
        description:
          "Fully managed Chroma cloud service with enterprise features and support.",
      },
      pinecone: {
        name: "Pinecone",
        description:
          "100% cloud-based vector database for enterprise use cases.",
      },
      zilliz: {
        name: "Zilliz Cloud",
        description:
          "Cloud hosted vector database built for enterprise with SOC 2 compliance.",
      },
      qdrant: {
        name: "QDrant",
        description:
          "Open source local and distributed cloud vector database.",
      },
      weaviate: {
        name: "Weaviate",
        description:
          "Open source local and cloud hosted multi-modal vector database.",
      },
      milvus: {
        name: "Milvus",
        description: "Open-source, highly scalable, and blazing fast.",
      },
      astra: {
        name: "AstraDB",
        description: "Vector Search for Real-world GenAI.",
      },
    },
  },
  embeddable: {
    title: "Embeddable Chat Widgets",
    pageTitle: "Chat Embed",
    widgets: "Widgets",
    history: "History",
    back: "Back",
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
  "embed-chats": {
    title: "Embed Chat History",
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
  telegram: {
    title: "Telegram Bot",
    description:
      "Connect your GOV AI VN168 instance to Telegram so you can chat with your workspaces from any device.",
    setup: {
      step1: {
        title: "Step 1: Create your Telegram bot",
        description:
          "Open @BotFather in Telegram, send <code>/newbot</code> to <code>@BotFather</code>, follow the prompts, and copy the API token.",
        "open-botfather": "Open BotFather",
        "instruction-1": "1. Open the link or scan the QR code",
        "instruction-2":
          "2. Send <code>/newbot</code> to <code>@BotFather</code>",
        "instruction-3": "3. Choose a name and username for your bot",
        "instruction-4": "4. Copy the API token you receive",
      },
      step2: {
        title: "Step 2: Connect your bot",
        description:
          "Paste the API token you received from @BotFather to connect your bot.",
        "bot-token": "Bot Token",
        connecting: "Connecting...",
        "connect-bot": "Connect Bot",
      },
      security: {
        title: "Recommended Security Settings",
        description:
          "For additional security, configure these settings in @BotFather.",
        "disable-groups": "— Prevent adding bot to groups",
        "disable-inline": "— Prevent bot from being used in inline search",
        "obscure-username":
          "Use a non-obvious bot handle username to reduce discoverability",
      },
      "toast-enter-token": "Please enter a bot token.",
      "toast-connect-failed": "Failed to connect bot.",
    },
    connected: {
      status: "Connected",
      "status-disconnected": "Disconnected — token may be expired or invalid",
      "placeholder-token": "Paste new bot token...",
      reconnect: "Reconnect",
      workspace: "Workspace",
      "bot-link": "Bot Link",
      "voice-response": "Voice Response",
      disconnecting: "Disconnecting...",
      disconnect: "Disconnect",
      "voice-text-only": "Text only",
      "voice-mirror": "Mirror (reply with voice when user sends voice)",
      "voice-always": "Always voice (send audio with every reply)",
      "toast-disconnect-failed": "Failed to disconnect bot.",
      "toast-reconnect-failed": "Failed to reconnect bot.",
      "toast-voice-failed": "Failed to update voice mode.",
      "toast-approve-failed": "Failed to approve user.",
      "toast-deny-failed": "Failed to deny user.",
      "toast-revoke-failed": "Failed to revoke user.",
    },
    users: {
      "pending-description":
        "Users waiting to be verified. Match the pairing code shown here with the one displayed in their Telegram chat.",
      unknown: "Unknown",
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
        "Protect your GOV AI VN168 instance with a password. If you forget this there is no recovery method so ensure you save this password.",
      "password-label": "Instance Password",
    },
  },
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
  privacy: {
    title: "Privacy & Data-Handling",
    description:
      "This is your configuration for how connected third party providers and GOV AI VN168 handle your data.",
    anonymous: "Anonymous Telemetry Enabled",
  },
  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    obsidian: {
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
      "total-documents_one": "{{count}} document",
      "total-documents_other": "{{count}} documents",
      "search-document": "Search for document",
      "no-documents": "No Documents",
      "move-workspace": "Move to Workspace",
      "delete-confirmation":
        "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible.",
      "removing-message":
        "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Successfully moved {{count}} documents.",
      no_docs: "No Documents",
      select_all: "Select All",
      deselect_all: "Deselect All",
      remove_selected: "Remove Selected",
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
        "These files will be uploaded to the document processor running on this GOV AI VN168 instance. These files are not sent or shared with a third party.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1:
        "When you <b>pin</b> a document in GOV AI VN168 we will inject the entire content of the document into your prompt window for your LLM to fully comprehend.",
      pin_explained_block2:
        "This works best with <b>large-context models</b> or small files that are critical to its knowledge-base.",
      pin_explained_block3:
        "If you are not getting the answers you desire from GOV AI VN168 by default then pinning is a great way to get higher quality answers in a click.",
      accept: "Okay, got it",
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1:
        "When you <b>watch</b> a document in GOV AI VN168 we will <i>automatically</i> sync your document content from it's original source on regular intervals. This will automatically update the content in every workspace where this file is managed.",
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
    attachments_processing: "Attachments are processing. Please wait...",
    send_message: "Send a message",
    attach_file: "Attach a file to this chat",
    text_size: "Change text size.",
    export: "Export chat as...",
    exporting: "Exporting...",
    microphone: "Speak your prompt.",
    stt_unsupported: "Microphone access is not supported in this browser.",
    stt_mic_denied:
      "Could not access the microphone. Please grant permission and try again.",
    stt_transcription_failed: "Transcription failed: {{error}}",
    send: "Send prompt message to workspace",
    tts_speak_message: "TTS Speak message",
    copy: "Copy",
    regenerate: "Regenerate",
    regenerate_response: "Regenerate response",
    good_response: "Good response",
    more_actions: "More actions",
    sources: "Sources",
    source_count_one: "{{count}} reference",
    source_count_other: "{{count}} references",
    document: "Document",
    similarity_match: "match",
    fork: "Fork",
    delete: "Delete",
    cancel: "Cancel",
    submit: "Submit",
    edit_prompt: "Edit prompt",
    edit_response: "Edit response",
    edit_info_user:
      '"Submit" regenerates the AI response. "Save" updates your message only.',
    edit_info_assistant:
      "Your changes will be saved directly to this response.",
    see_less: "See Less",
    see_more: "See More",
    preset_reset_description: "Clear your chat history and begin a new chat",
    add_new_preset: " Add New Preset",
    add_new: "Add new",
    edit: "Edit",
    publish: "Publish",
    stop_generating: "Stop generating response",
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
    tools: "Tools",
    text_size_label: "Text Size",
    select_model: "Select Model",
    slash_commands: "Slash Commands",
    agent_skills: "Agent Skills",
    manage_agent_skills: "Manage Agent Skills",
    app_integrations: "App Integrations",
    custom_skills: "Custom Skills",
    agent_flows: "Agent Flows",
    sub_skills: "Sub-skills",
    no_tools_found: "No matching tools found",
    loading_mcp_servers: "Loading MCP servers...",
    start_agent_session: "Start Agent Session",
    agent_skills_disabled_in_session:
      "Can't modify skills during an active agent session. Use /exit to end the session first.",
    use_agent_session_to_use_tools:
      "You can use tools in chat by starting an agent session with '@agent' at the beginning of your prompt.",
    workspace_llm_manager: {
      search: "Search",
      loading_workspace_settings: "Loading workspace settings...",
      available_models: "Available Models for {{provider}}",
      available_models_description: "Select a model to use for this workspace.",
      save: "Use this model",
      saving: "Setting model as workspace default...",
      missing_credentials: "This provider is missing credentials!",
      missing_credentials_description: "Set up now",
    },
    agent_invocation: {
      model_wants_to_call: "Model wants to call",
      approve: "Approve",
      reject: "Reject",
      always_allow: "Always allow {{skillName}}",
      tool_call_was_approved: "Tool call was approved",
      tool_call_was_rejected: "Tool call was rejected",
      clarifying_skip: "Let agent decide",
      clarifying_submit: "Submit",
      clarifying_skipped: "You let the agent decide.",
      clarifying_timeout: "No response submitted in time.",
      clarifying_pagination: "{{current}} of {{total}}",
      clarifying_prev_aria: "Previous question",
      clarifying_next_aria: "Next question",
      clarifying_close_aria: "Close and skip",
      clarifying_other: "Other",
      clarifying_other_placeholder: "Type your answer",
      batch_progress: "{{answered}} of {{total}} answered",
      batch_skip_this: "Skip",
      batch_submit_all: "Submit all",
      batch_next: "Next",
      answer_skipped: "[user skipped]",
    },
    memories: {
      title: "Memories",
      empty:
        "No memories so far. After you interact with the chatbot more memories will fill in or",
      empty_cta: "create a new memory",
      tab_workspace: "Workspace",
      tab_global: "Global",
      toggle: {
        label: "Enable Personalization",
        description:
          "Allow your assistant to recall facts about you or this workspace and use them in conversations",
      },
      auto_extraction: {
        label: "Automatic Memories",
        description:
          "Have your assistant automatically create memories in the background",
      },
      menu: {
        edit: "Edit",
        delete: "Delete",
        move_to_global: "Move to Global",
        move_to_workspace: "Move to Workspace",
      },
      modal: {
        create_title: "Create Memory",
        edit_title: "Edit Memory",
        create_description:
          'Memories should be a single, concise statement. e.g. "User prefers Python over JavaScript"',
        edit_description: "Update the content of this memory.",
        label: "Memory",
        placeholder: "e.g. User's name is Joe, User works on GOV AI VN168, etc.",
        create: "Create",
        save: "Save",
        cancel: "Cancel",
      },
    },
  },
  profile_settings: {
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_placeholder: "User's username",
    new_password: "New Password",
    password_placeholder: "{{username}}'s new password",
    password_description: "Password must be at least 8 characters long",
    bio: "Bio",
    bio_placeholder: "Tell us about yourself...",
    profile_picture_alt: "User profile picture",
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
        prompt_label: "Prompt",
        prompt_description:
          "This is the actual system prompt that will be used to guide the LLM.",
        prompt_placeholder: "Enter your system prompt here...",
      },
      agent_flow: {
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
            "You need to authenticate with the GOV AI VN168 Community Hub before publishing items.",
          button: "Connect to Community Hub",
        },
      },
    },
  },
  scheduledJobs: {
    title: "Scheduled Jobs",
    enableNotifications: "Enable browser notifications for job results",
    description:
      "Create recurring AI tasks that run on a schedule. Each job runs a prompt with optional tools and saves the result for review.",
    newJob: "New Job",
    loading: "Loading...",
    emptyTitle: "No Scheduled Jobs yet",
    emptySubtitle: "Create one to get started.",
    table: {
      name: "Name",
      schedule: "Schedule",
      status: "Status",
      lastRun: "Last Run",
      nextRun: "Next Run",
      actions: "Actions",
    },
    confirmDelete: "Are you sure you want to delete this scheduled job?",
    status: {
      completed: "Completed",
      failed: "Failed",
      timed_out: "Timed out",
      running: "Running",
      queued: "Queued",
    },
    toast: {
      deleted: "Job deleted",
      triggered: "Job triggered successfully",
      triggerFailed: "Failed to trigger job",
      triggerSkipped: "A run is already in progress for this job",
      killed: "Job stopped successfully",
      killFailed: "Failed to stop job",
    },
    row: {
      neverRun: "Never run",
      viewRuns: "View runs",
      runNow: "Run now",
      enable: "Enable",
      disable: "Disable",
      edit: "Edit",
      delete: "Delete",
    },
    modal: {
      titleEdit: "Edit Scheduled Job",
      titleNew: "New Scheduled Job",
      nameLabel: "Name",
      namePlaceholder: "e.g. Daily News Digest",
      promptLabel: "Prompt",
      promptPlaceholder: "The instruction to run on each execution...",
      scheduleLabel: "Schedule",
      modeBuilder: "Builder",
      modeCustom: "Custom",
      cronPlaceholder: "Cron expression (e.g. 0 9 * * *)",
      currentSchedule: "Current schedule:",
      toolsLabel: "Tools (Optional)",
      toolsDescription:
        "Select which agent tools this job can use. If none are selected, the job runs without any tools.",
      toolsSearch: "Search",
      toolsNoResults: "No tools match",
      required: "Required",
      requiredFieldsBanner:
        "Please fill out all required fields in order to create job.",
      cancel: "Cancel",
      saving: "Saving...",
      updateJob: "Update Job",
      createJob: "Create Job",
      jobUpdated: "Job updated",
      jobCreated: "Job created",
    },
    builder: {
      fallbackWarning:
        "This expression can't be edited visually. Switch to Custom to keep it, or change anything below to overwrite it.",
      run: "Run",
      frequency: {
        minute: "every minute",
        hour: "hourly",
        day: "daily",
        week: "weekly",
        month: "monthly",
      },
      every: "Every",
      minuteOne: "1 minute",
      minuteOther: "{{count}} minutes",
      atMinute: "At minute",
      pastEveryHour: "past every hour",
      at: "At",
      on: "On",
      onDay: "On day",
      ofEveryMonth: "of every month",
      weekdays: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
      },
    },
    runHistory: {
      back: "Back to jobs",
      title: "Run History: {{name}}",
      schedule: "Schedule:",
      emptyTitle: "No runs yet for this job",
      emptySubtitle: "Run the job now and view its results.",
      runNow: "Run Now",
      stopJob: "Stop job",
      table: {
        status: "Status",
        started: "Started",
        duration: "Duration",
        error: "Error",
      },
    },
    runDetail: {
      loading: "Loading run details...",
      notFound: "Run not found.",
      back: "Back",
      unknownJob: "Unknown Job",
      runHeading: "{{name}} — Run #{{id}}",
      duration: "Duration: {{value}}",
      continueInThread: "Continue in Chat",
      creating: "Creating...",
      threadFailed: "Failed to create thread",
      stopJob: "Stop Job",
      killing: "Stopping...",
      sections: {
        prompt: "Prompt",
        error: "Error",
        thinking: "Thoughts ({{count}})",
        toolCalls: "Tool Calls ({{count}})",
        files: "Files ({{count}})",
        response: "Response",
        metrics: "Metrics",
      },
      metrics: {
        promptTokens: "Prompt tokens:",
        completionTokens: "Completion tokens:",
      },
    },
    toolCall: {
      arguments: "Arguments:",
      showResult: "Show result",
      hideResult: "Hide result",
    },
    file: {
      unknown: "Unknown file",
      download: "Download",
      downloadFailed: "Failed to download file",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF Document",
        word: "Word Document",
        spreadsheet: "Spreadsheet",
        generic: "File",
      },
    },
  },
  defaultSystemPrompt: {
    title: "Default System Prompt",
    description: "This is the default system prompt that will be used for new workspaces.",
    label: "System Prompt",
    help1: "A system prompt provides instructions that shape the AI’s responses and behavior. This prompt will be automatically applied to all newly created workspaces. To change the system prompt of a",
    help2: "specific workspace",
    help3: "edit the prompt in the",
    help4: "workspace settings",
    help5: "To restore the system prompt to our sane default, leave this field empty and save changes.",
    variables: "You can insert",
    variablesLink: "system prompt variables",
    variablesLike: "like:",
    variablesMore: "more...",
    placeholder: "You are an AI assistant that can answer questions and help with tasks.",
    saveSuccess: "Default system prompt updated successfully.",
    saveFailed: "Failed to update default system prompt:",
  },
};

export default TRANSLATIONS;
