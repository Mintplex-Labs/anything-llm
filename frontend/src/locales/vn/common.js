const TRANSLATIONS = {
  common: {
    "workspaces-name": "Tên không gian làm việc",
    error: "Lỗi",
    success: "Thành công",
    user: "Người dùng",
    selection: "Lựa chọn mô hình",
    saving: "Đang lưu...",
    save: "Lưu thay đổi",
    previous: "Trang trước",
    next: "Trang tiếp theo",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "Cài đặt hệ thống",
    system: "Cài đặt chung",
    invites: "Lời mời",
    users: "Người dùngs",
    workspaces: "Không gian làm việc",
    "workspace-chats": "Hội thoại không gian làm việc",
    customization: "Tùy chỉnh",
    "api-keys": "API nhà phát triển",
    llm: "LLM",
    transcription: "Chuyển đổi giọng nói",
    embedder: "Nhúng dữ liệu",
    "text-splitting": "Chia nhỏ & Tách văn bản",
    "voice-speech": "Giọng nói & Phát âm",
    "vector-database": "Cơ sở dữ liệu Vector",
    embeds: "Nhúng hội thoại",
    "embed-chats": "Nhúng hội thoại History",
    security: "Bảo mật",
    "event-logs": "Nhật ký sự kiện",
    privacy: "Quyền riêng tư & Dữ liệu",
    "ai-providers": "Nhà cung cấp AI",
    "agent-skills": "Kỹ năng của Agent",
    admin: "Quản trị viên",
    tools: "Công cụ",
    "experimental-features": "Tính năng thử nghiệm",
    contact: "Liên hệ hỗ trợ",
    "browser-extension": "Tiện ích trình duyệt",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "Chào mừng đến với",
      "placeholder-username": "Người dùngname",
      "placeholder-password": "Mật khẩu",
      login: "Đăng nhập",
      validating: "Đang xác thực...",
      "forgot-pass": "Quên mật khẩu",
      reset: "Đặt lại",
    },
    "sign-in": {
      start: "Đăng nhập vào",
      end: "tài khoản của bạn.",
    },
    "password-reset": {
      title: "Mật khẩu Đặt lại",
      description: "Cung cấp thông tin cần thiết dưới đây để đặt lại mật khẩu.",
      "recovery-codes": "Mã khôi phục",
      "recovery-code": "Mã khôi phục {{index}}",
      "back-to-login": "Back to Đăng nhập",
    },
  },

  welcomeMessage: {
    part1:
      "Chào mừng đến với AnythingLLM, AnythingLLM is an open-source AI tool by Mintplex Labs that turns anything into a trained chatbot you can query and chat with. AnythingLLM is a BYOK (bring-your-own-keys) software so there is no subscription, fee, or charges for this software outside of the services you want to use with it.",
    part2:
      "AnythingLLM is the easiest way to put powerful AI products like OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB, and other services together in a neat package with no fuss to increase your productivity by 100x.",
    part3:
      "AnythingLLM can run totally locally on your machine with little overhead you wont even notice it's there! No GPU needed. Cloud and on-premises installation is available as well.\nThe AI tooling ecosystem gets more powerful everyday. AnythingLLM makes it easy to use.",
    githubIssue: "Create an issue on Github",
    user1: "How do I get started?!",
    part4:
      "It's simple. All collections are organized into buckets we call \"Không gian làm việc\". Không gian làm việc are buckets of files, documents, images, PDFs, and other files which will be transformed into something LLM's can understand and use in conversation.\n\nYou can add and remove files at anytime.",
    createWorkspace: "Create your first workspace",
    user2:
      "Is this like an AI dropbox or something? What about chatting? It is a chatbot isn't it?",
    part5:
      "AnythingLLM is more than a smarter Dropbox.\n\nAnythingLLM offers two ways of talking with your data:\n\n<i>Query:</i> Your chats will return data or inferences found with the documents in your workspace it has access to. Adding more documents to the Workspace make it smarter! \n\n<i>Conversational:</i> Your documents + your on-going chat history both contribute to the LLM knowledge at the same time. Great for appending real-time text-based info or corrections and misunderstandings the LLM might have. \n\nYou can toggle between either mode \n<i>in the middle of chatting!</i>",
    user3: "Wow, this sounds amazing, let me try it out already!",
    part6: "Have Fun!",
    starOnGithub: "Star on GitHub",
    contact: "Contact Mintplex Labs",
  },

  "new-workspace": {
    title: "Không gian làm việc mới",
    placeholder: "Không gian làm việc của tôi",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "Cài đặt chung",
    chat: "Chat Settings",
    vector: "Cơ sở dữ liệu Vector",
    members: "Members",
    agent: "Agent Configuration",
  },

  // General Giao diện
  general: {
    vector: {
      title: "Vector Count",
      description: "Total number of vectors in your vector database.",
    },
    names: {
      description: "This will only change the display name of your workspace.",
    },
    message: {
      title: "Tin nhắn trò chuyện được gợi ý",
      description:
        "Customize the messages that will be suggested to your workspace users.",
      add: "Add new message",
      save: "Save Messages",
      heading: "Explain to me",
      body: "the benefits of AnythingLLM",
    },
    pfp: {
      title: "Hình đại diện trợ lý",
      description:
        "Customize the profile image of the assistant for this workspace.",
      image: "Workspace Image",
      remove: "Remove Workspace Image",
    },
    delete: {
      title: "Xóa không gian làm việc",
      description:
        "Delete this workspace and all of its data. This will delete the workspace for all users.",
      delete: "Xóa không gian làm việc",
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

  // Cơ sở dữ liệu Vector
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
      reset: "Đặt lại Cơ sở dữ liệu Vector",
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

  // Hội thoại không gian làm việc
  recorded: {
    title: "Hội thoại không gian làm việc",
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

  // Giao diện
  appearance: {
    title: "Giao diện",
    description: "Customize the appearance settings of your platform.",
    logo: {
      title: "Tùy chỉnh logo",
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

  // Khóa API
  api: {
    title: "Khóa API",
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
    title: "Chuyển đổi giọng nói Model Preference",
    description:
      "These are the credentials and settings for your preferred transcription model provider. Its important these keys are current and correct or else media files and audio will not transcribe.",
    provider: "Chuyển đổi giọng nói Provider",
    "warn-start":
      "Using the local whisper model on machines with limited RAM or CPU can stall AnythingLLM when processing media files.",
    "warn-recommend":
      "We recommend at least 2GB of RAM and upload files <10Mb.",
    "warn-end":
      "The built-in model will automatically download on the first use.",
  },

  embedding: {
    title: "Tùy chọn nhúng",
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
    title: "Tùy chọn chia nhỏ và tách văn bản",
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

  // Cơ sở dữ liệu Vector
  vector: {
    title: "Cơ sở dữ liệu Vector",
    description:
      "These are the credentials and settings for how your AnythingLLM instance will function. It's important these keys are current and correct.",
    provider: {
      title: "Cơ sở dữ liệu Vector Provider",
      description: "There is no configuration needed for LanceDB.",
    },
  },

  // Tiện ích hội thoại nhúng
  embeddable: {
    title: "Tiện ích hội thoại nhúng",
    description:
      "Embeddable chat widgets are public facing chat interfaces that are tied to a single workspace. These allow you to build workspaces that then you can publish to the world.",
    create: "Tạo nhúng",
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
    title: "Multi-Người dùng Mode",
    description:
      "Set up your instance to support your team by activating Multi-Người dùng Mode.",
    enable: {
      "is-enable": "Multi-Người dùng Mode is Enabled",
      enable: "Enable Multi-Người dùng Mode",
      description:
        "By default, you will be the only admin. As an admin you will need to create accounts for all new users or admins. Do not lose your password as only an Quản trị viên user can reset passwords.",
      username: "Quản trị viên account username",
      password: "Quản trị viên account password",
    },
    password: {
      title: "Mật khẩu Protection",
      description:
        "Protect your AnythingLLM instance with a password. If you forget this there is no recovery method so ensure you save this password.",
    },
    instance: {
      title: "Mật khẩu Protect Instance",
      description:
        "By default, you will be the only admin. As an admin you will need to create accounts for all new users or admins. Do not lose your password as only an Quản trị viên user can reset passwords.",
      password: "Instance password",
    },
  },

  // Nhật ký sự kiện
  event: {
    title: "Nhật ký sự kiện",
    description:
      "View all actions and events happening on this instance for monitoring.",
    clear: "Clear Nhật ký sự kiện",
    table: {
      type: "Event Type",
      user: "Người dùng",
      occurred: "Occurred At",
    },
  },

  // Quyền riêng tư & Dữ liệu-Handling
  privacy: {
    title: "Quyền riêng tư & Dữ liệu-Handling",
    description:
      "This is your configuration for how connected third party providers and AnythingLLM handle your data.",
    llm: "LLM Selection",
    embedding: "Tùy chọn nhúng",
    vector: "Cơ sở dữ liệu Vector",
    anonymous: "Anonymous Telemetry Enabled",
  },
};

export default TRANSLATIONS;
