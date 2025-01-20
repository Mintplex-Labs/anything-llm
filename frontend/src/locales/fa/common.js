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
      title: "تعداد بردارها",
      description: "تعداد کل بردارها در پایگاه داده برداری شما.",
    },
    names: {
      description: "این فقط نام نمایشی فضای کاری شما را تغییر خواهد داد.",
    },
    message: {
      title: "پیام‌های گفتگوی پیشنهادی",
      description: "پیام‌هایی که به کاربران فضای کاری پیشنهاد می‌شود را شخصی‌سازی کنید.",
      add: "افزودن پیام جدید",
      save: "ذخیره پیام‌ها",
      heading: "برایم توضیح بده",
      body: "مزایای AnythingLLM را",
    },
    pfp: {
      title: "تصویر پروفایل دستیار",
      description: "تصویر پروفایل دستیار را برای این فضای کاری شخصی‌سازی کنید.",
      image: "تصویر فضای کاری",
      remove: "حذف تصویر فضای کاری",
    },
    delete: {
      title: "حذف فضای کاری",
      description: "این فضای کاری و تمام داده‌های آن را حذف کنید. این کار فضای کاری را برای همه کاربران حذف خواهد کرد.",
      delete: "حذف فضای کاری",
      deleting: "در حال حذف فضای کاری...",
      "confirm-start": "شما در حال حذف کامل",
      "confirm-end": "فضای کاری هستید. این کار تمام جاسازی‌های برداری را از پایگاه داده برداری شما حذف خواهد کرد.\n\nفایل‌های اصلی منبع دست نخورده باقی خواهند ماند. این عمل برگشت‌ناپذیر است.",
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
    title: "گفتگوهای فضای کاری",
    description:
      "این‌ها تمام گفتگوها و پیام‌های ثبت شده هستند که توسط کاربران ارسال شده‌اند و بر اساس تاریخ ایجاد مرتب شده‌اند.",
    export: "خروجی‌گیری",
    table: {
      id: "شناسه",
      by: "ارسال شده توسط",
      workspace: "فضای کاری",
      prompt: "درخواست",
      response: "پاسخ",
      at: "زمان ارسال",
    },
  },

  // Appearance
  appearance: {
    title: "ظاهر",
    description: "تنظیمات ظاهری پلتفرم خود را شخصی‌سازی کنید.",
    logo: {
      title: "شخصی‌سازی لوگو",
      description: "لوگوی سفارشی خود را برای شخصی‌سازی ربات گفتگو آپلود کنید.",
      add: "افزودن لوگوی سفارشی",
      recommended: "اندازه پیشنهادی: 800 x 200",
      remove: "حذف",
      replace: "جایگزینی",
    },
    message: {
      title: "شخصی‌سازی پیام‌ها",
      description: "پیام‌های خودکار نمایش داده شده به کاربران را شخصی‌سازی کنید.",
      new: "جدید",
      system: "سیستم",
      user: "کاربر",
      message: "پیام",
      assistant: "دستیار گفتگوی AnythingLLM",
      "double-click": "برای ویرایش دوبار کلیک کنید...",
      save: "ذخیره پیام‌ها",
    },
    icons: {
      title: "آیکون‌های سفارشی پاورقی",
      description: "آیکون‌های نمایش داده شده در پایین نوار کناری را شخصی‌سازی کنید.",
      icon: "آیکون",
      link: "لینک",
    },
  },

  // API Keys
  api: {
    title: "کلیدهای API",
    description:
      "کلیدهای API به دارنده آن‌ها اجازه می‌دهند به صورت برنامه‌نویسی به این نمونه AnythingLLM دسترسی داشته و آن را مدیریت کنند.",
    link: "مطالعه مستندات API",
    generate: "ایجاد کلید API جدید",
    table: {
      key: "کلید API",
      by: "ایجاد شده توسط",
      created: "تاریخ ایجاد",
    },
  },

  llm: {
    title: "ترجیحات مدل زبانی",
    description: "این‌ها اعتبارنامه‌ها و تنظیمات ارائه‌دهنده مدل زبانی و جاسازی انتخابی شما هستند. مهم است که این کلیدها به‌روز و صحیح باشند در غیر این صورت AnythingLLM به درستی کار نخواهد کرد.",
    provider: "ارائه‌دهنده مدل زبانی",
  },

  transcription: {
    title: "ترجیحات مدل رونویسی",
    description: "این‌ها اعتبارنامه‌ها و تنظیمات ارائه‌دهنده مدل رونویسی انتخابی شما هستند. مهم است که این کلیدها به‌روز و صحیح باشند در غیر این صورت فایل‌های رسانه و صوتی رونویسی نخواهند شد.",
    provider: "ارائه‌دهنده رونویسی",
    "warn-start": "استفاده از مدل محلی Whisper روی دستگاه‌هایی با RAM یا CPU محدود می‌تواند هنگام پردازش فایل‌های رسانه‌ای باعث توقف AnythingLLM شود.",
    "warn-recommend": "ما حداقل ۲ گیگابایت RAM و آپلود فایل‌های کمتر از ۱۰ مگابایت را توصیه می‌کنیم.",
    "warn-end": "مدل داخلی در اولین استفاده به صورت خودکار دانلود خواهد شد.",
  },

  embedding: {
    title: "ترجیحات جاسازی",
    "desc-start": "هنگام استفاده از یک LLM که به طور پیش‌فرض از موتور جاسازی پشتیبانی نمی‌کند - ممکن است نیاز به تعیین اعتبارنامه‌های اضافی برای جاسازی متن داشته باشید.",
    "desc-end": "جاسازی فرآیند تبدیل متن به بردارها است. این اعتبارنامه‌ها برای تبدیل فایل‌ها و درخواست‌های شما به فرمتی که AnythingLLM بتواند پردازش کند، ضروری هستند.",
    provider: {
      title: "ارائه‌دهنده جاسازی",
      description: "هنگام استفاده از موتور جاسازی داخلی AnythingLLM نیازی به تنظیمات نیست.",
    },
  },

  text: {
    title: "تقسیم متن و تکه‌بندی",
    "desc-start": "تقسیم متن به شما امکان می‌دهد اسناد بزرگ را به بخش‌های کوچک‌تر تقسیم کنید که برای جاسازی و پردازش مناسب‌تر هستند.",
    "desc-end": "سعی کنید تعادلی بین اندازه بخش و همپوشانی ایجاد کنید تا از دست رفتن اطلاعات را به حداقل برسانید.",
    "warn-start": "تغییر این مقادیر نیاز به",
    "warn-center": "پردازش مجدد تمام اسناد",
    "warn-end": "خواهد داشت.",
    size: {
      title: "حداکثر اندازه بخش",
      description: "این حداکثر تعداد کاراکترهایی است که می‌تواند در یک بردار وجود داشته باشد.",
      recommend: "حداکثر طول مدل جاسازی",
    },
    overlap: {
      title: "همپوشانی بخش‌های متن",
      description: "این حداکثر همپوشانی کاراکترها است که در هنگام تکه‌بندی بین دو بخش متن مجاور رخ می‌دهد.",
    },
  },

  // Vector Database
  vector: {
    title: "پایگاه داده برداری",
    description: "این‌ها اعتبارنامه‌ها و تنظیمات نحوه عملکرد نمونه AnythingLLM شما هستند. مهم است که این کلیدها به‌روز و صحیح باشند.",
    provider: {
      title: "ارائه‌دهنده پایگاه داده برداری",
      description: "برای LanceDB نیازی به پیکربندی نیست.",
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
