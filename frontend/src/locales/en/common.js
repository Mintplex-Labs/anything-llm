const TRANSLATIONS = {
  common: {
    "workspaces-name": "Workspaces Name",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "Instance Settings",
    system: "System Preferences",
    invites: "Invitation",
    users: "Users",
    workspaces: "Workspaces",
    "workspace-chats": "Workspace Chat",
    appearance: "Appearance",
    "api-keys": "API Keys",
    llm: "LLM Preference",
    transcription: "Transcription Model",
    embedder: "Embedding Preferences",
    "text-splitting": "Text Splitter & Chunking",
    "vector-database": "Vector Database",
    embeds: "Embedded Chat",
    "embed-chats": "Embedded Chat History",
    security: "Security",
    "event-logs": "Event Logs",
    privacy: "Privacy & Data",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "Welcome to",
      "forgot-pass": "Forgot password",
      reset: "Reset",
    },
    "sign-in": "Sign in to your AnythingLLM account.",
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
      description: "This will only change the display name of your workspace."
    },
    message: {
      title: "Suggested Chat Messages",
      description: "Customize the messages that will be suggested to your workspace users.",
      add: "Add new message",
      save: "Save Messages",
      heading: "Explain to me",
      body: "the benefits of AnythingLLM",
    },
    pfp: {
      title: "Assistant Profile Image",
      description: "Customize the profile image of the assistant for this workspace.",
      image: "Workspace Image",
      remove: "Remove Workspace Image",
    },
    delete: {
      delete: "Delete Workspace",
      deleting: "Deleting Workspace...",
      "confirm-start": "You are about to delete your entire",
      "confirm-end": "workspace. This will remove all vector embeddings in your vector database.\n\nThe original source files will remain untouched. This action is irreversible."
    }
  },

  // Chat Settings
  chat: {
    llm: {
      title: "Workspace LLM Provider",
      description: "The specific LLM provider & model that will be used for this workspace. By default, it uses the system LLM provider and settings.",
      search: "Search all LLM providers",
    },
    model: {
      title:"Workspace Chat model",
      description: "The specific chat model that will be used for this workspace. If empty, will use the system LLM preference.",
      wait:"-- waiting for models --"
    },
    mode:{
      title: "Chat mode",
      chat:{
        title: "Chat",
        "desc-start": "will provide answers with the LLM's general knowledge",
        and: "and",
        "desc-end": "document context that is found.",
      },
      query:{
        title: "Query",
        "desc-start": "will provide answers",
        only: "only",
        "desc-end": "if document context is found.",
      }
    },
    history:{
      title: "Chat History",
      "desc-start": "The number of previous chats that will be included in the response&apos;s short-term memory.",
      recommend : "Recommend 20. ",
      "desc-end": "AAnything more than 45 is likely to lead to continuous chat failures depending on message size."
    },
    prompt:{
      title: "Prompt",
      description: "The prompt that will be used on this workspace. Define the context and instructions for the AI to generate a response. You should to provide a carefully crafted prompt so the AI can generate a relevant and accurate response.",
    },
    refusal:{
      title:"Query mode refusal response",
      "desc-start": "When in",
      query: "query",
      "desc-end": "mode, you may want to return a custom refusal response when no context is found.",
    },
    temperature:{
      title: "LLM Temperature",
      "desc-start": 'This setting controls how "random" or dynamic your chat responses will be.',
      "desc-end": "The higher the number (1.0 maximum) the more random and incoherent.",
      "recommend": "Recommended:",
    }
  }
};

export default TRANSLATIONS;
