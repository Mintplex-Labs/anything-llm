const TRANSLATIONS = {
  common: {
    "workspaces-name": "نام فضای کار",
    error: "خطا",
    success: "موفق",
    user: "کاربر",
    selection: "انتخاب مدل",
    saving: "در حال ذخیره...",
    save: "ذخیره تغییرات",
    previous: "صفحه قبلی",
    next: "صفحه بعدی",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "تنظیمات سامانه",
    system: "تنظیمات عمومی",
    invites: "دعوت‌نامه‌ها",
    users: "کاربران",
    workspaces: "فضاهای کاری",
    "workspace-chats": "گفتگوهای فضای کاری",
    customization: "شخصی‌سازی",
    "api-keys": "API توسعه‌دهندگان",
    llm: "مدل زبانی",
    transcription: "رونویسی",
    embedder: "جاسازی",
    "text-splitting": "تقسیم متن و تکه‌بندی",
    "voice-speech": "صدا و گفتار",
    "vector-database": "پایگاه داده برداری",
    embeds: "جاسازی گفتگو",
    "embed-chats": "تاریخچه گفتگوهای جاسازی شده",
    security: "امنیت",
    "event-logs": "گزارش رویدادها",
    privacy: "حریم خصوصی و داده‌ها",
    "ai-providers": "ارائه‌دهندگان هوش مصنوعی",
    "agent-skills": "مهارت‌های عامل",
    admin: "مدیریت",
    tools: "ابزارها",
    "experimental-features": "ویژگی‌های آزمایشی",
    contact: "تماس با پشتیبانی",
    "browser-extension": "افزونه مرورگر",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "خوش آمدید به",
      "placeholder-username": "نام کاربری",
      "placeholder-password": "رمز عبور",
      login: "ورود",
      validating: "در حال اعتبارسنجی...",
      "forgot-pass": "فراموشی رمز عبور",
      reset: "بازنشانی",
    },
    "sign-in": {
      start: "ورود به حساب",
      end: "کاربری شما.",
    },
    "password-reset": {
      title: "بازنشانی رمز عبور",
      description: "برای بازنشانی رمز عبور خود، اطلاعات لازم را وارد کنید.",
      "recovery-codes": "کدهای بازیابی",
      "recovery-code": "کد بازیابی {{index}}",
      "back-to-login": "بازگشت به صفحه ورود",
    },
  },

  welcomeMessage: {
    part1:
      "به AnythingLLM خوش آمدید. AnythingLLM یک ابزار هوش مصنوعی متن‌باز توسط Mintplex Labs است که هر چیزی را به یک ربات گفتگوی آموزش‌دیده تبدیل می‌کند که می‌توانید با آن گفتگو و پرس‌وجو کنید. AnythingLLM یک نرم‌افزار BYOK (آوردن کلیدهای خودتان) است، بنابراین هیچ اشتراک، هزینه یا مبلغی برای این نرم‌افزار خارج از سرویس‌هایی که می‌خواهید با آن استفاده کنید، وجود ندارد.",
    part2:
      "AnythingLLM ساده‌ترین راه برای کنار هم قرار دادن محصولات قدرتمند هوش مصنوعی مانند OpenAI، GPT-4، LangChain، PineconeDB، ChromaDB و سایر سرویس‌ها در یک بسته منظم و بدون دردسر برای افزایش بهره‌وری شما تا ۱۰۰ برابر است.",
    part3:
      "AnythingLLM می‌تواند کاملاً به صورت محلی روی دستگاه شما با حداقل مصرف منابع اجرا شود، طوری که حتی متوجه حضور آن نخواهید شد! نیازی به GPU نیست. نصب ابری و درون‌سازمانی نیز در دسترس است.\nاکوسیستم ابزارهای هوش مصنوعی هر روز قدرتمندتر می‌شود. AnythingLLM استفاده از آن را آسان می‌کند.",
    githubIssue: "ایجاد مسئله در گیت‌هاب",
    user1: "چطور شروع کنم؟!",
    part4:
      "خیلی ساده است. تمام مجموعه‌ها در سطل‌هایی که ما «فضای کاری» می‌نامیم سازماندهی شده‌اند. فضاهای کاری، سطل‌هایی از فایل‌ها، اسناد، تصاویر، PDF‌ها و سایر فایل‌ها هستند که به چیزی تبدیل می‌شوند که LLM‌ها می‌توانند درک کنند و در مکالمه استفاده کنند.\n\nشما می‌توانید در هر زمان فایل‌ها را اضافه و حذف کنید.",
    createWorkspace: "ایجاد اولین فضای کاری",
    user2:
      "آیا این مثل یک دراپ‌باکس هوشمند است یا چیز دیگری؟ پس گفتگو چی؟ مگر این یک ربات گفتگو نیست؟",
    part5:
      "AnythingLLM بیشتر از یک دراپ‌باکس هوشمند است.\n\nAnythingLLM دو روش برای صحبت با داده‌های شما ارائه می‌دهد:\n\n<i>پرس‌وجو:</i> گفتگوهای شما داده‌ها یا استنباط‌های یافت شده در اسناد فضای کاری که به آن دسترسی دارد را برمی‌گرداند. افزودن اسناد بیشتر به فضای کاری آن را هوشمندتر می‌کند!\n\n<i>مکالمه‌ای:</i> اسناد شما + تاریخچه گفتگوی جاری شما هر دو همزمان به دانش LLM کمک می‌کنند. برای افزودن اطلاعات متنی بلادرنگ یا اصلاح اشتباهات و سوءتفاهم‌هایی که LLM ممکن است داشته باشد، عالی است.\n\nشما می‌توانید بین هر دو حالت \n<i>در وسط گفتگو!</i> جابجا شوید.",
    user3: "وای، این عالی به نظر می‌رسد، بگذارید همین حالا امتحانش کنم!",
    part6: "خوش بگذره!",
    starOnGithub: "ستاره در گیت‌هاب",
    contact: "تماس با Mintplex Labs",
  },

  "new-workspace": {
    title: "فضای کاری جدید",
    placeholder: "فضای کاری من",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "تنظیمات عمومی",
    chat: "تنظیمات گفتگو",
    vector: "پایگاه داده برداری",
    members: "اعضا",
    agent: "پیکربندی عامل",
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
    title: "جاسازی گفتگو",
    description: "جاسازی گفتگو به شما امکان می‌دهد گفتگوی فضای کاری را در وب‌سایت یا برنامه خود قرار دهید.",
    create: "ایجاد جاسازی جدید",
    table: {
      workspace: "فضای کاری",
      chats: "گفتگوهای ارسال شده",
      Active: "دامنه‌های فعال",
    },
  },

  "embed-chats": {
    title: "گفتگوهای جاسازی شده",
    export: "خروجی‌گیری",
    description: "این لیست تمام گفتگوها و پیام‌های ثبت شده از هر جاسازی که منتشر کرده‌اید را نشان می‌دهد.",
    table: {
      embed: "جاسازی",
      sender: "فرستنده",
      message: "پیام",
      response: "پاسخ",
      at: "زمان ارسال",
    },
  },

  multi: {
    title: "حالت چند کاربره",
    description: "نمونه خود را برای پشتیبانی از تیم خود با فعال‌سازی حالت چند کاربره تنظیم کنید.",
    enable: {
      "is-enable": "حالت چند کاربره فعال است",
      enable: "فعال‌سازی حالت چند کاربره",
      description: "به طور پیش‌فرض، شما تنها مدیر خواهید بود. به عنوان مدیر، باید برای تمام کاربران یا مدیران جدید حساب کاربری ایجاد کنید. رمز عبور خود را گم نکنید زیرا فقط یک کاربر مدیر می‌تواند رمزهای عبور را بازنشانی کند.",
      username: "نام کاربری حساب مدیر",
      password: "رمز عبور حساب مدیر",
    },
    password: {
      title: "حفاظت با رمز عبور",
      description: "از نمونه AnythingLLM خود با رمز عبور محافظت کنید. اگر این رمز را فراموش کنید هیچ روش بازیابی وجود ندارد، پس حتماً این رمز عبور را ذخیره کنید.",
    },
    instance: {
      title: "محافظت از نمونه با رمز عبور",
      description: "به طور پیش‌فرض، شما تنها مدیر خواهید بود. به عنوان مدیر، باید برای تمام کاربران یا مدیران جدید حساب کاربری ایجاد کنید. رمز عبور خود را گم نکنید زیرا فقط یک کاربر مدیر می‌تواند رمزهای عبور را بازنشانی کند.",
      password: "رمز عبور نمونه",
    },
  },

  // Event Logs
  event: {
    title: "گزارش رویدادها",
    description: "مشاهده تمام اقدامات و رویدادهای در حال وقوع در این نمونه برای نظارت.",
    clear: "پاک کردن گزارش رویدادها",
    table: {
      type: "نوع رویداد",
      user: "کاربر",
      occurred: "زمان وقوع",
    },
  },

  // Privacy & Data-Handling
  privacy: {
    title: "حریم خصوصی و مدیریت داده‌ها",
    description: "این پیکربندی شما برای نحوه مدیریت داده‌ها توسط ارائه‌دهندگان شخص ثالث متصل و AnythingLLM است.",
    llm: "انتخاب مدل زبانی",
    embedding: "ترجیحات جاسازی",
    vector: "پایگاه داده برداری",
    anonymous: "ارسال تله‌متری ناشناس فعال است",
  },
};

export default TRANSLATIONS;
