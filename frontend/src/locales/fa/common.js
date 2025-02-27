// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: null,
      useCase: null,
      useCaseWork: null,
      useCasePersonal: null,
      useCaseOther: null,
      comment: null,
      commentPlaceholder: null,
      skip: null,
      thankYou: null,
      title: null,
      description: null,
    },
    home: {
      title: null,
      getStarted: null,
    },
    llm: {
      title: null,
      description: null,
    },
    userSetup: {
      title: null,
      description: null,
      howManyUsers: null,
      justMe: null,
      myTeam: null,
      instancePassword: null,
      setPassword: null,
      passwordReq: null,
      passwordWarn: null,
      adminUsername: null,
      adminUsernameReq: null,
      adminPassword: null,
      adminPasswordReq: null,
      teamHint: null,
    },
    data: {
      title: null,
      description: null,
      settingsHint: null,
    },
    workspace: {
      title: null,
      description: null,
    },
  },
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
    optional: null,
    yes: null,
    no: null,
  },
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
    starOnGitHub: "ستاره در گیت‌هاب",
    contact: "تماس با Mintplex Labs",
  },
  "new-workspace": {
    title: "فضای کاری جدید",
    placeholder: "فضای کاری من",
  },
  "workspaces—settings": {
    general: "تنظیمات عمومی",
    chat: "تنظیمات گفتگو",
    vector: "پایگاه داده برداری",
    members: "اعضا",
    agent: "پیکربندی عامل",
  },
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
      description:
        "پیام‌هایی که به کاربران فضای کاری پیشنهاد می‌شود را شخصی‌سازی کنید.",
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
      description:
        "این فضای کاری و تمام داده‌های آن را حذف کنید. این کار فضای کاری را برای همه کاربران حذف خواهد کرد.",
      delete: "حذف فضای کاری",
      deleting: "در حال حذف فضای کاری...",
      "confirm-start": "شما در حال حذف کامل",
      "confirm-end":
        "فضای کاری هستید. این کار تمام جاسازی‌های برداری را از پایگاه داده برداری شما حذف خواهد کرد.\n\nفایل‌های اصلی منبع دست نخورده باقی خواهند ماند. این عمل برگشت‌ناپذیر است.",
    },
  },
  chat: {
    llm: {
      title: "ارائه‌دهنده LLM فضای کاری",
      description:
        "ارائه‌دهنده و مدل LLM خاصی که برای این فضای کاری استفاده خواهد شد. به طور پیش‌فرض، از ارائه‌دهنده و تنظیمات LLM سیستم استفاده می‌کند.",
      search: "جستجوی تمام ارائه‌دهندگان LLM",
    },
    model: {
      title: "مدل گفتگوی فضای کاری",
      description:
        "مدل گفتگوی خاصی که برای این فضای کاری استفاده خواهد شد. اگر خالی باشد، از ترجیحات LLM سیستم استفاده خواهد کرد.",
      wait: "-- در انتظار مدل‌ها --",
    },
    mode: {
      title: "حالت گفتگو",
      chat: {
        title: "گفتگو",
        "desc-start": "پاسخ‌ها را با دانش عمومی LLM",
        and: "و",
        "desc-end": "محتوای اسناد یافت شده ارائه می‌دهد.",
      },
      query: {
        title: "پرس‌وجو",
        "desc-start": "پاسخ‌ها را",
        only: "فقط",
        "desc-end": "در صورت یافتن محتوای اسناد ارائه می‌دهد.",
      },
    },
    history: {
      title: "تاریخچه گفتگو",
      "desc-start":
        "تعداد گفتگوهای قبلی که در حافظه کوتاه‌مدت پاسخ گنجانده خواهد شد.",
      recommend: "پیشنهاد: ۲۰. ",
      "desc-end":
        "بیش از ۴۵ احتمالاً منجر به شکست مداوم گفتگو می‌شود که به اندازه پیام‌ها بستگی دارد.",
    },
    prompt: {
      title: "پیش‌متن",
      description:
        "پیش‌متنی که در این فضای کاری استفاده خواهد شد. زمینه و دستورالعمل‌ها را برای تولید پاسخ توسط هوش مصنوعی تعریف کنید. باید یک پیش‌متن دقیق ارائه دهید تا هوش مصنوعی بتواند پاسخی مرتبط و دقیق تولید کند.",
    },
    refusal: {
      title: "پاسخ رد در حالت پرس‌وجو",
      "desc-start": "در حالت",
      query: "پرس‌وجو",
      "desc-end":
        "ممکن است بخواهید هنگامی که هیچ محتوایی یافت نمی‌شود، یک پاسخ رد سفارشی برگردانید.",
    },
    temperature: {
      title: "دمای LLM",
      "desc-start":
        'این تنظیم میزان "خلاقیت" پاسخ‌های LLM شما را کنترل می‌کند.',
      "desc-end":
        "هر چه عدد بالاتر باشد، خلاقیت بیشتر است. برای برخی مدل‌ها، تنظیم بسیار بالا می‌تواند منجر به پاسخ‌های نامفهوم شود.",
      hint: "اکثر LLMها محدوده‌های مختلفی از مقادیر معتبر را دارند. برای این اطلاعات به ارائه‌دهنده LLM خود مراجعه کنید.",
    },
  },
  "vector-workspace": {
    identifier: "شناسه پایگاه داده برداری",
    snippets: {
      title: "حداکثر قطعات متنی",
      description:
        "این تنظیم حداکثر تعداد قطعات متنی که برای هر گفتگو یا پرس‌وجو به LLM ارسال می‌شود را کنترل می‌کند.",
      recommend: "پیشنهادی: 4",
    },
    doc: {
      title: "آستانه شباهت سند",
      description:
        "حداقل امتیاز شباهت مورد نیاز برای اینکه یک منبع مرتبط با گفتگو در نظر گرفته شود. هر چه عدد بالاتر باشد، منبع باید شباهت بیشتری با گفتگو داشته باشد.",
      zero: "بدون محدودیت",
      low: "پایین (امتیاز شباهت ≥ .25)",
      medium: "متوسط (امتیاز شباهت ≥ .50)",
      high: "بالا (امتیاز شباهت ≥ .75)",
    },
    reset: {
      reset: "بازنشانی پایگاه داده برداری",
      resetting: "در حال پاک کردن بردارها...",
      confirm:
        "شما در حال بازنشانی پایگاه داده برداری این فضای کاری هستید. این کار تمام جاسازی‌های برداری فعلی را حذف خواهد کرد.\n\nفایل‌های اصلی منبع دست نخورده باقی خواهند ماند. این عمل برگشت‌ناپذیر است.",
      error: "بازنشانی پایگاه داده برداری فضای کاری امکان‌پذیر نبود!",
      success: "پایگاه داده برداری فضای کاری بازنشانی شد!",
    },
  },
  agent: {
    "performance-warning":
      "عملکرد LLMهایی که به طور صریح از فراخوانی ابزار پشتیبانی نمی‌کنند، به شدت به قابلیت‌ها و دقت مدل وابسته است. برخی توانایی‌ها ممکن است محدود یا غیرفعال باشند.",
    provider: {
      title: "ارائه‌دهنده LLM عامل فضای کاری",
      description:
        "ارائه‌دهنده و مدل LLM خاصی که برای عامل @agent این فضای کاری استفاده خواهد شد.",
    },
    mode: {
      chat: {
        title: "مدل گفتگوی عامل فضای کاری",
        description:
          "مدل گفتگوی خاصی که برای عامل @agent این فضای کاری استفاده خواهد شد.",
      },
      title: "مدل عامل فضای کاری",
      description:
        "مدل LLM خاصی که برای عامل @agent این فضای کاری استفاده خواهد شد.",
      wait: "-- در انتظار مدل‌ها --",
    },
    skill: {
      title: "مهارت‌های پیش‌فرض عامل",
      description:
        "توانایی‌های طبیعی عامل پیش‌فرض را با این مهارت‌های از پیش ساخته شده بهبود دهید. این تنظیمات برای تمام فضاهای کاری اعمال می‌شود.",
      rag: {
        title: "RAG و حافظه بلندمدت",
        description:
          'به عامل اجازه دهید از اسناد محلی شما برای پاسخ به پرس‌وجو استفاده کند یا از عامل بخواهید قطعات محتوا را برای بازیابی حافظه بلندمدت "به خاطر بسپارد".',
      },
      view: {
        title: "مشاهده و خلاصه‌سازی اسناد",
        description:
          "به عامل اجازه دهید محتوای فایل‌های جاسازی شده فعلی فضای کاری را فهرست و خلاصه کند.",
      },
      scrape: {
        title: "استخراج از وب‌سایت‌ها",
        description:
          "به عامل اجازه دهید محتوای وب‌سایت‌ها را بازدید و استخراج کند.",
      },
      generate: {
        title: "تولید نمودارها",
        description:
          "به عامل پیش‌فرض امکان تولید انواع مختلف نمودار از داده‌های ارائه شده یا داده شده در گفتگو را بدهید.",
      },
      save: {
        title: "تولید و ذخیره فایل‌ها در مرورگر",
        description:
          "به عامل پیش‌فرض امکان تولید و نوشتن در فایل‌هایی که ذخیره می‌شوند و می‌توانند در مرورگر شما دانلود شوند را بدهید.",
      },
      web: {
        title: "جستجو و مرور زنده وب",
        "desc-start":
          "با اتصال به یک ارائه‌دهنده جستجوی وب (SERP)، به عامل خود امکان جستجو در وب برای پاسخ به سؤالات خود را بدهید.",
        "desc-end":
          "جستجوی وب در طول جلسات عامل تا زمانی که این تنظیم نشود، کار نخواهد کرد.",
      },
    },
  },
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
      description:
        "پیام‌های خودکار نمایش داده شده به کاربران را شخصی‌سازی کنید.",
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
      description:
        "آیکون‌های نمایش داده شده در پایین نوار کناری را شخصی‌سازی کنید.",
      icon: "آیکون",
      link: "لینک",
    },
  },
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
    description:
      "این‌ها اعتبارنامه‌ها و تنظیمات ارائه‌دهنده مدل زبانی و جاسازی انتخابی شما هستند. مهم است که این کلیدها به‌روز و صحیح باشند در غیر این صورت AnythingLLM به درستی کار نخواهد کرد.",
    provider: "ارائه‌دهنده مدل زبانی",
  },
  transcription: {
    title: "ترجیحات مدل رونویسی",
    description:
      "این‌ها اعتبارنامه‌ها و تنظیمات ارائه‌دهنده مدل رونویسی انتخابی شما هستند. مهم است که این کلیدها به‌روز و صحیح باشند در غیر این صورت فایل‌های رسانه و صوتی رونویسی نخواهند شد.",
    provider: "ارائه‌دهنده رونویسی",
    "warn-start":
      "استفاده از مدل محلی Whisper روی دستگاه‌هایی با RAM یا CPU محدود می‌تواند هنگام پردازش فایل‌های رسانه‌ای باعث توقف AnythingLLM شود.",
    "warn-recommend":
      "ما حداقل ۲ گیگابایت RAM و آپلود فایل‌های کمتر از ۱۰ مگابایت را توصیه می‌کنیم.",
    "warn-end": "مدل داخلی در اولین استفاده به صورت خودکار دانلود خواهد شد.",
  },
  embedding: {
    title: "ترجیحات جاسازی",
    "desc-start":
      "هنگام استفاده از یک LLM که به طور پیش‌فرض از موتور جاسازی پشتیبانی نمی‌کند - ممکن است نیاز به تعیین اعتبارنامه‌های اضافی برای جاسازی متن داشته باشید.",
    "desc-end":
      "جاسازی فرآیند تبدیل متن به بردارها است. این اعتبارنامه‌ها برای تبدیل فایل‌ها و درخواست‌های شما به فرمتی که AnythingLLM بتواند پردازش کند، ضروری هستند.",
    provider: {
      title: "ارائه‌دهنده جاسازی",
      description:
        "هنگام استفاده از موتور جاسازی داخلی AnythingLLM نیازی به تنظیمات نیست.",
    },
  },
  text: {
    title: "تقسیم متن و تکه‌بندی",
    "desc-start":
      "تقسیم متن به شما امکان می‌دهد اسناد بزرگ را به بخش‌های کوچک‌تر تقسیم کنید که برای جاسازی و پردازش مناسب‌تر هستند.",
    "desc-end":
      "سعی کنید تعادلی بین اندازه بخش و همپوشانی ایجاد کنید تا از دست رفتن اطلاعات را به حداقل برسانید.",
    "warn-start": "تغییر این مقادیر نیاز به",
    "warn-center": "پردازش مجدد تمام اسناد",
    "warn-end": "خواهد داشت.",
    size: {
      title: "حداکثر اندازه بخش",
      description:
        "این حداکثر تعداد کاراکترهایی است که می‌تواند در یک بردار وجود داشته باشد.",
      recommend: "حداکثر طول مدل جاسازی",
    },
    overlap: {
      title: "همپوشانی بخش‌های متن",
      description:
        "این حداکثر همپوشانی کاراکترها است که در هنگام تکه‌بندی بین دو بخش متن مجاور رخ می‌دهد.",
    },
  },
  vector: {
    title: "پایگاه داده برداری",
    description:
      "این‌ها اعتبارنامه‌ها و تنظیمات نحوه عملکرد نمونه AnythingLLM شما هستند. مهم است که این کلیدها به‌روز و صحیح باشند.",
    provider: {
      title: "ارائه‌دهنده پایگاه داده برداری",
      description: "برای LanceDB نیازی به پیکربندی نیست.",
    },
  },
  embeddable: {
    title: "جاسازی گفتگو",
    description:
      "جاسازی گفتگو به شما امکان می‌دهد گفتگوی فضای کاری را در وب‌سایت یا برنامه خود قرار دهید.",
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
    description:
      "این لیست تمام گفتگوها و پیام‌های ثبت شده از هر جاسازی که منتشر کرده‌اید را نشان می‌دهد.",
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
    description:
      "نمونه خود را برای پشتیبانی از تیم خود با فعال‌سازی حالت چند کاربره تنظیم کنید.",
    enable: {
      "is-enable": "حالت چند کاربره فعال است",
      enable: "فعال‌سازی حالت چند کاربره",
      description:
        "به طور پیش‌فرض، شما تنها مدیر خواهید بود. به عنوان مدیر، باید برای تمام کاربران یا مدیران جدید حساب کاربری ایجاد کنید. رمز عبور خود را گم نکنید زیرا فقط یک کاربر مدیر می‌تواند رمزهای عبور را بازنشانی کند.",
      username: "نام کاربری حساب مدیر",
      password: "رمز عبور حساب مدیر",
    },
    password: {
      title: "حفاظت با رمز عبور",
      description:
        "از نمونه AnythingLLM خود با رمز عبور محافظت کنید. اگر این رمز را فراموش کنید هیچ روش بازیابی وجود ندارد، پس حتماً این رمز عبور را ذخیره کنید.",
    },
    instance: {
      title: "محافظت از نمونه با رمز عبور",
      description:
        "به طور پیش‌فرض، شما تنها مدیر خواهید بود. به عنوان مدیر، باید برای تمام کاربران یا مدیران جدید حساب کاربری ایجاد کنید. رمز عبور خود را گم نکنید زیرا فقط یک کاربر مدیر می‌تواند رمزهای عبور را بازنشانی کند.",
      password: "رمز عبور نمونه",
    },
  },
  event: {
    title: "گزارش رویدادها",
    description:
      "مشاهده تمام اقدامات و رویدادهای در حال وقوع در این نمونه برای نظارت.",
    clear: "پاک کردن گزارش رویدادها",
    table: {
      type: "نوع رویداد",
      user: "کاربر",
      occurred: "زمان وقوع",
    },
  },
  privacy: {
    title: "حریم خصوصی و مدیریت داده‌ها",
    description:
      "این پیکربندی شما برای نحوه مدیریت داده‌ها توسط ارائه‌دهندگان شخص ثالث متصل و AnythingLLM است.",
    llm: "انتخاب مدل زبانی",
    embedding: "ترجیحات جاسازی",
    vector: "پایگاه داده برداری",
    anonymous: "ارسال تله‌متری ناشناس فعال است",
  },

  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    github: {
      name: "GitHub Repo",
      description:
        "Import an entire public or private Github repository in a single click.",
      URL: "GitHub Repo URL",
      URL_explained: "Url of the GitHub repo you wish to collect.",
      token: "Github Access Token",
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
        "Without filling out the <b>Github Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitHub's public API rate-limits.",
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
      username_explained: "Your Confluence username.",
      token: "Confluence API Token",
      token_explained_start: "A ",
      token_explained_link1: "Personal API Token",
      token_explained_middle:
        " is required to access Confluence pages. You can ",
      token_explained_link2: "create an API Token here",
      token_explained_end: ".",
      token_desc: "Access token for authentication.",
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
