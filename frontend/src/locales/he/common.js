const TRANSLATIONS = {
  common: {
    "workspaces-name": "שם סביבת העבודה",
    error: "שגיאה",
    success: "הצלחה",
    user: "משתמש",
    selection: "בחירת מודל",
    saving: "שמירה...",
    save: "שמור שינויים",
    previous: "עמוד קודם",
    next: "עמוד הבא",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "הגדרות מופע",
    system: "הגדרות כלליות",
    invites: "הזמנות",
    users: "משתמשים",
    workspaces: "סביבות עבודה",
    "workspace-chats": "שיחות סביבת עבודה",
    customization: "התאמה אישית",
    "api-keys": "מפתח API למפתחים",
    llm: "LLM",
    transcription: "העתקה",
    embedder: "הטמעה",
    "text-splitting": "מפריד טקסט וחלוקה",
    "voice-speech": "קול ודיבור",
    "vector-database": "בסיס נתונים וקטור",
    embeds: "הטמעת צ'אט",
    "embed-chats": "היסטוריית הטמעת צ'אט",
    security: "אבטחה",
    "event-logs": "יומני אירועים",
    privacy: "פרטיות ונתונים",
    "ai-providers": "ספקי AI",
    "agent-skills": "כישורי סוכן",
    admin: "מנהל",
    tools: "כלים",
    "experimental-features": "תכונות ניסיוניות",
    contact: "צור קשר עם התמיכה",
    "browser-extension": "תוסף דפדפן",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "ברוכים הבאים ל-",
      "placeholder-username": "שם משתמש",
      "placeholder-password": "סיסמה",
      login: "התחבר",
      validating: "מאמת...",
      "forgot-pass": "שכחת סיסמה?",
      reset: "איפוס",
    },
    "sign-in": {
      start: "התחבר לחשבון שלך ב-",
      end: ".",
    },
    "password-reset": {
      title: "איפוס סיסמה",
      description: "ספק את המידע הדרוש להלן כדי לאפס את הסיסמה שלך.",
      "recovery-codes": "קודי שחזור",
      "recovery-code": "קוד שחזור {{index}}",
      "back-to-login": "חזרה להתחברות",
    },
  },

  welcomeMessage: {
    part1:
      "ברוכים הבאים ל-AnythingLLM, AnythingLLM היא כלי AI קוד פתוח מאת Mintplex Labs שהופך כל דבר לצ'אטבוט מאומן שאפשר לשאול אותו ולקיים איתו שיחה. AnythingLLM הוא תוכנה מסוג BYOK (הביא את המפתחות שלך) כך שאין מנוי, עמלה או חיובים עבור התוכנה הזו מלבד השירותים שאתה רוצה להשתמש בהם.",
    part2:
      "AnythingLLM היא הדרך הקלה ביותר לשלב מוצרים חזקים של AI כמו OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB ושירותים אחרים בחבילה אחת ללא מאמץ כדי להגדיל את הפרודוקטיביות שלך פי 100.",
    part3:
      "AnythingLLM יכול לפעול באופן מקומי לחלוטין על המחשב שלך עם מעט עלויות ביצוע שאתה אפילו לא תבחין בהן! לא נדרש GPU. התקנה בענן ובמקום היא זמינה גם כן.\nמערכת הכלים של AI הופכת חזקה יותר מדי יום. AnythingLLM הופכת את השימוש בה פשוט.",
    githubIssue: "צור בעיה ב-Github",
    user1: "איך אני מתחיל?!",
    part4:
      "זה פשוט. כל אוסף מאורגן לדליים שאנחנו קוראים להם 'סביבות עבודה'. סביבות עבודה הן דליים של קבצים, מסמכים, תמונות, PDF וקבצים אחרים שיהפכו למשהו ש-LLM יכולות להבין ולעשות איתו שימוש בשיחה.\n\nתוכל להוסיף ולהסיר קבצים בכל עת.",
    createWorkspace: "צור את סביבת העבודה הראשונה שלך",
    user2: "האם זה כמו Dropbox AI או משהו כזה? מה לגבי צ'אט? זה צ'אטבוט לא?",
    part5:
      "AnythingLLM היא יותר מ-Dropbox חכם יותר.\n\nAnythingLLM מציעה שתי דרכים לשוחח עם הנתונים שלך:\n\n<i>שאילתה:</i> השיחות שלך יחזירו נתונים או מסקנות שנמצאות במסמכים בסביבת העבודה שלך אליה יש לה גישה. הוספת עוד מסמכים לסביבת העבודה הופכת אותה לחכמה יותר! \n\n<i>שיחה:</i> המסמכים שלך + היסטוריית השיחה הנוכחית שלך תורמות יחד לידע של LLM בו זמנית. נהדר להוספת מידע טקסטואלי בזמן אמת או תיקונים וחוסר הבנות שאולי יהיו ל-LLM.\n\nאתה יכול לעבור בין שני המצבים \n<i>אפילו באמצע שיחה!</i>",
    user3: "וואו, זה נשמע מדהים, תן לי לנסות את זה כבר!",
    part6: "תהנה!",
    starOnGithub: "שים כוכב ב-GitHub",
    contact: "צור קשר עם Mintplex Labs",
  },

  "new-workspace": {
    title: "סביבת עבודה חדשה",
    placeholder: "סביבת העבודה שלי",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "הגדרות כלליות",
    chat: "הגדרות צ'אט",
    vector: "בסיס נתונים וקטור",
    members: "חברים",
    agent: "קונפיגורציה של סוכן",
  },

  // General Appearance
  general: {
    vector: {
      title: "ספירת וקטורים",
      description: "מספר הווקטורים הכולל בבסיס הנתונים הווקטורי שלך.",
    },
    names: {
      description: "זה ישנה רק את שם התצוגה של סביבת העבודה שלך.",
    },
    message: {
      title: "הודעות הצ'אט המוצעות",
      description: "התאם אישית את ההודעות שיוצעו למשתמשי סביבת העבודה שלך.",
      add: "הוסף הודעה חדשה",
      save: "שמור הודעות",
      heading: "הסבר לי",
      body: "את היתרונות של AnythingLLM",
    },
    pfp: {
      title: "תמונת פרופיל של עוזר",
      description:
        "התאם אישית את תמונת הפרופיל של העוזר עבור סביבת העבודה הזו.",
      image: "תמונת סביבת עבודה",
      remove: "הסר תמונת סביבת עבודה",
    },
    delete: {
      title: "מחק סביבת עבודה",
      description:
        "מחק סביבת עבודה זו וכל הנתונים שלה. זה ימחק את סביבת העבודה עבור כל המשתמשים.",
      delete: "מחק סביבת עבודה",
      deleting: "מוחק סביבת עבודה...",
      "confirm-start": "אתה עומד למחוק את כל",
      "confirm-end":
        "סביבת העבודה שלך. זה ימחק את כל הטבעות הווקטוריות בבסיס הנתונים הווקטורי שלך.\n\nקבצי המקור המקוריים יישארו ללא שינוי. פעולה זו היא בלתי הפיכה.",
    },
  },

  // Chat Settings
  chat: {
    llm: {
      title: "ספק LLM של סביבת עבודה",
      description:
        "ספק LLM ספציפי ודגם שייעשה בו שימוש עבור סביבת העבודה הזו. כברירת מחדל, הוא משתמש בספק LLM ובהגדרות של המערכת.",
      search: "חפש בכל ספקי LLM",
    },
    model: {
      title: "דגם צ'אט של סביבת עבודה",
      description:
        "דגם הצ'אט הספציפי שייעשה בו שימוש עבור סביבת העבודה הזו. אם הוא ריק, ייעשה שימוש בהעדפת LLM של המערכת.",
      wait: "-- מחכה לדגמים --",
    },
    mode: {
      title: "מצב צ'אט",
      chat: {
        title: "צ'אט",
        "desc-start": "יספק תשובות עם הידע הכללי של LLM",
        and: "ו-",
        "desc-end": "הקשר של המסמך שנמצא.",
      },
      query: {
        title: "שאילתה",
        "desc-start": "יספק תשובות",
        only: "רק",
        "desc-end": "אם נמצא הקשר של מסמך.",
      },
    },
    history: {
      title: "היסטוריית צ'אט",
      "desc-start": "מספר הצ'אטים הקודמים שייכללו בזכרון קצר הטווח של התגובה.",
      recommend: "מומלץ: 20. ",
      "desc-end":
        "כל דבר מעל 45 עשוי להוביל לכשלים רציפים בצ'אט תלוי בגודל ההודעה.",
    },
    prompt: {
      title: "בקשה",
      description:
        "הבקשה שתיעשה שימוש בה בסביבת העבודה הזו. הגדר את ההקשר וההוראות עבור ה-AI כדי ליצור תגובה. עליך לספק בקשה מעוצבת בקפידה כדי שה-AI יוכל ליצור תגובה רלוונטית ומדויקת.",
    },
    refusal: {
      title: "תגובת סירוב במצב שאילתה",
      "desc-start": "כשאתה במצב",
      query: "שאילתה",
      "desc-end":
        "אתה עשוי לרצות להחזיר תגובת סירוב מותאמת אישית כאשר לא נמצא הקשר.",
    },
    temperature: {
      title: "טמפרטורה של LLM",
      "desc-start":
        'הגדרה זו שולטת באיזה מידה תגובות ה-LLM שלך יהיו "יצירתיות".',
      "desc-end":
        "ככל שהמספר גבוה יותר כך ה-LLM יצירתי יותר. עבור חלק מהדגמים זה יכול להוביל לתגובות לא קוהרנטיות כאשר הוא מוגדר גבוה מדי.",
      hint: "לרוב ה-LLM יש טווחים שונים של ערכים תקפים. התייעץ עם ספק ה-LLM שלך לקבלת מידע.",
    },
  },

  // Vector Database
  "vector-workspace": {
    identifier: "מזהה בסיס נתונים וקטור",
    snippets: {
      title: "קטעי קשר מרביים",
      description:
        "הגדרה זו שולטת בכמות המרבית של קטעי קשר שיישלחו ל-LLM עבור כל צ'אט או שאילתה.",
      recommend: "מומלץ: 4",
    },
    doc: {
      title: "סף דמיון מסמכים",
      description:
        "ציון הדמיון המינימלי הנדרש כדי שמקור ייחשב כקשור לצ'אט. ככל שהמספר גבוה יותר, כך המקור חייב להיות דומה יותר לצ'אט.",
      zero: "ללא הגבלה",
      low: "נמוך (ציון דמיון ≥ .25)",
      medium: "בינוני (ציון דמיון ≥ .50)",
      high: "גבוה (ציון דמיון ≥ .75)",
    },
    reset: {
      reset: "אפס בסיס נתונים וקטור",
      resetting: "מנקה וקטורים...",
      confirm:
        "אתה עומד לאפס את בסיס הנתונים הווקטורי של סביבת העבודה הזו. זה ימחק את כל הטבעות הווקטוריות שקיימות כעת.\n\nקבצי המקור המקוריים יישארו ללא שינוי. פעולה זו היא בלתי הפיכה.",
      error: "לא ניתן היה לאפס את בסיס הנתונים הווקטורי של סביבת העבודה!",
      success: "בסיס הנתונים הווקטורי של סביבת העבודה איפס!",
    },
  },

  // Agent Configuration
  agent: {
    "performance-warning":
      "ביצועי LLM שאינם תומכים באופן מפורש בקריאות כלים תלויים מאוד ביכולות ובדיוק של הדגם. חלק מהיכולות עשויות להיות מוגבלות או לא פונקציונליות.",
    provider: {
      title: "ספק LLM של סוכן סביבת עבודה",
      description:
        "ספק LLM ספציפי ודגם שייעשה בו שימוש עבור סוכן @agent של סביבת העבודה הזו.",
    },
    mode: {
      chat: {
        title: "דגם צ'אט של סוכן סביבת עבודה",
        description:
          "דגם הצ'אט הספציפי שייעשה בו שימוש עבור סוכן @agent של סביבת העבודה הזו.",
      },
      title: "דגם של סוכן סביבת עבודה",
      description:
        "דגם LLM ספציפי שייעשה בו שימוש עבור סוכן @agent של סביבת העבודה הזו.",
      wait: "-- מחכה לדגמים --",
    },

    skill: {
      title: "כישורי סוכן ברירת מחדל",
      description:
        "שפר את היכולות הטבעיות של הסוכן ברירת המחדל עם כישורים מובנים אלה. הגדרה זו חלה על כל סביבות העבודה.",
      rag: {
        title: "RAG וזכרון ארוך טווח",
        description:
          'אפשר לסוכן לנצל את המסמכים המקומיים שלך כדי לענות על שאילתה או לבקש מהסוכן "לזכור" חלקים מתוכן עבור אחזור זכרון ארוך טווח.',
      },
      view: {
        title: "הצג ותמצת מסמכים",
        description:
          "אפשר לסוכן לרשום ולמצת את תוכן קבצי סביבת העבודה שהוטמעו כעת.",
      },
      scrape: {
        title: "גרד אתרי אינטרנט",
        description: "אפשר לסוכן לבקר ולגרד את תוכן אתרי האינטרנט.",
      },
      generate: {
        title: "צור תרשימים",
        description:
          "אפשר לסוכן ברירת המחדל ליצור סוגים שונים של תרשימים מנתונים שסופקו או ניתנו בצ'אט.",
      },
      save: {
        title: "צור ושמור קבצים בדפדפן",
        description:
          "אפשר לסוכן ברירת המחדל ליצור ולכתוב לקבצים שניתן לשמור ולהוריד בדפדפן שלך.",
      },
      web: {
        title: "חיפוש אינטרנט חי וניווט",
        "desc-start":
          "אפשר לסוכן שלך לחפש באינטרנט כדי לענות על השאלות שלך על ידי חיבור לספק חיפוש באינטרנט (SERP).",
        "desc-end": "חיפוש באינטרנט במהלך מפגשי סוכן לא יעבוד עד שתגדיר זאת.",
      },
    },
  },

  // Workspace Chats
  recorded: {
    title: "שיחות סביבת עבודה",
    description:
      "אלה כל השיחות וההודעות שנרשמו שנשלחו על ידי משתמשים לפי תאריך יצירתן.",
    export: "ייצוא",
    table: {
      id: "Id",
      by: "נשלח על ידי",
      workspace: "סביבת עבודה",
      prompt: "בקשה",
      response: "תגובה",
      at: "נשלח ב-",
    },
  },

  // Appearance
  appearance: {
    title: "מראה",
    description: "התאם אישית את הגדרות המראה של הפלטפורמה שלך.",
    logo: {
      title: "התאם אישית את הלוגו",
      description:
        "העלה את הלוגו המותאם אישית שלך כדי להפוך את הצ'אטבוט שלך לשלך.",
      add: "הוסף לוגו מותאם אישית",
      recommended: "גודל מומלץ: 800 x 200",
      remove: "הסר",
      replace: "החלף",
    },
    message: {
      title: "התאם אישית הודעות",
      description: "התאם אישית את ההודעות האוטומטיות המוצגות למשתמשים שלך.",
      new: "חדש",
      system: "מערכת",
      user: "משתמש",
      message: "הודעה",
      assistant: "AnythingLLM Chat Assistant",
      "double-click": "לחץ פעמיים כדי לערוך...",
      save: "שמור הודעות",
    },
    icons: {
      title: "סמלי כותרת תחתונה מותאמים אישית",
      description: "התאם אישית את סמלי כותרת התחתונה המוצגים בתחתית סרגל הצד.",
      icon: "סמל",
      link: "קישור",
    },
  },

  // API Keys
  api: {
    title: "מפתחות API",
    description:
      "מפתחות API מאפשרים לבעלים לגשת ולתפעל מופע AnythingLLM זה באופן תכנותי.",
    link: "קרא את תיעוד ה-API",
    generate: "צור מפתח API חדש",
    table: {
      key: "מפתח API",
      by: "נוצר על ידי",
      created: "נוצר",
    },
  },

  llm: {
    title: "העדפת LLM",
    description:
      "אלה אישורי ההרשאה וההגדרות עבור ספק צ'אט והטבעה LLM המועדף עליך. חשוב שאישורי ההרשאה יהיו עדכניים ונכונים אחרת AnythingLLM לא תוכל לפעול כראוי.",
    provider: "ספק LLM",
  },

  transcription: {
    title: "העדפת דגם תמלול",
    description:
      "אלה אישורי ההרשאה וההגדרות עבור ספק דגם התמלול המועדף עליך. חשוב שאישורי ההרשאה יהיו עדכניים ונכונים אחרת קבצי מדיה ואודיו לא יעברו תמלול.",
    provider: "ספק התמלול",
    "warn-start":
      "שימוש בדגם Whisper מקומי במחשבים עם זיכרון RAM או מעבד מוגבלים יכול לעצור את AnythingLLM בעת עיבוד קבצי מדיה.",
    "warn-recommend":
      "אנו ממליצים על לפחות 2GB של זיכרון RAM והעלאת קבצים <10Mb.",
    "warn-end": "הדגם המובנה יתורגם אוטומטית בפעם הראשונה שבה תשתמש בו.",
  },

  embedding: {
    title: "העדפת הטבעה",
    "desc-start":
      "בעת שימוש ב-LLM שאינו תומך באופן מקורי במנוע הטבעה - ייתכן שתצטרך לציין אישורי הרשאה נוספים להטבעת טקסט.",
    "desc-end":
      "הטבעה היא תהליך הפיכת טקסט לווקטורים. אישורי הרשאה אלה נדרשים כדי להפוך את הקבצים והבקשות שלך לפורמט ש-AnythingLLM יכול להשתמש בו לעיבוד.",
    provider: {
      title: "ספק הטבעה",
      description:
        "אין צורך בהגדרה בעת שימוש במנוע ההטבעה המקורי של AnythingLLM.",
    },
  },

  text: {
    title: "הגדרות חלוקת טקסט וחלוקה",
    "desc-start":
      "לפעמים, ייתכן שתרצה לשנות את הדרך ברירת המחדל שבה מסמכים חדשים מחולקים ומופרדים לפני שהם מוכנסים לבסיס הנתונים הווקטורי שלך.",
    "desc-end":
      "עליך לשנות הגדרה זו רק אם אתה מבין כיצד חלוקת טקסט פועלת והשפעותיה.",
    "warn-start": "שינויים כאן יחולו רק על",
    "warn-center": "מסמכים שהוטמעו לאחרונה",
    "warn-end": ", לא על מסמכים קיימים.",
    size: {
      title: "גודל קטע טקסט",
      description: "זהו אורך הדמויות המרבי שיכול להיות נוכח בקטור יחיד.",
      recommend: "אורך מרבי של דגם ההטבעה הוא",
    },

    overlap: {
      title: "חפיפה של קטע טקסט",
      description:
        "זו החפיפה המרבית של הדמויות המתרחשת במהלך החלוקה בין שני קטעי טקסט סמוכים.",
    },
  },

  // Vector Database
  vector: {
    title: "בסיס נתונים וקטור",
    description:
      "אלה אישורי ההרשאה וההגדרות עבור אופן פעולתו של מופע AnythingLLM שלך. חשוב שאישורי ההרשאה יהיו עדכניים ונכונים.",
    provider: {
      title: "ספק בסיס נתונים וקטור",
      description: "אין צורך בקונפיגורציה עבור LanceDB.",
    },
  },

  // Embeddable Chat Widgets
  embeddable: {
    title: "כלי צ'אט ניתנים להטמעה",
    description:
      "כלי צ'אט ניתנים להטמעה הם ממשקי צ'אט פומביים הקשורים לסביבת עבודה אחת. אלה מאפשרים לך לבנות סביבות עבודה שתוכל לפרסם לעולם.",
    create: "צור הטמעה",
    table: {
      workspace: "סביבת עבודה",
      chats: "שיחות שנשלחו",
      Active: "תחומים פעילים",
    },
  },

  "embed-chats": {
    title: "הטמעת שיחות",
    export: "ייצוא",
    description: "אלה כל השיחות וההודעות שנרשמו מכל הטמעה שפרסמת.",
    table: {
      embed: "הטמעה",
      sender: "שולח",
      message: "הודעה",
      response: "תגובה",
      at: "נשלח ב-",
    },
  },

  multi: {
    title: "מצב משתמשים מרובים",
    description:
      "הגדר את המופע שלך כדי לתמוך בצוות שלך על ידי הפעלת מצב משתמשים מרובים.",
    enable: {
      "is-enable": "מצב משתמשים מרובים מופעל",
      enable: "הפעלת מצב משתמשים מרובים",
      description:
        "כברירת מחדל, אתה תהיה המנהל היחיד. כמנהל תצטרך ליצור חשבונות לכל משתמש או מנהל חדש. אל תאבד את הסיסמה שלך מכיוון שרק משתמש מנהל יכול לאפס סיסמאות.",
      username: "שם משתמש של חשבון מנהל",
      password: "סיסמת חשבון מנהל",
    },
    password: {
      title: "הגנה באמצעות סיסמה",
      description:
        "הגן על מופע AnythingLLM שלך באמצעות סיסמה. אם תשכח את הסיסמה הזו אין שום דרך להחזיר אותה אז וודא שאתה שומר את הסיסמה הזו.",
    },
    instance: {
      title: "הגן על המופע באמצעות סיסמה",
      description:
        "כברירת מחדל, אתה תהיה המנהל היחיד. כמנהל תצטרך ליצור חשבונות לכל משתמש או מנהל חדש. אל תאבד את הסיסמה שלך מכיוון שרק משתמש מנהל יכול לאפס סיסמאות.",
      password: "סיסמת מופע",
    },
  },

  // Event Logs
  event: {
    title: "יומני אירועים",
    description: "הצג את כל הפעולות והאירועים שקורים במופע זה לצורך ניטור.",
    clear: "נקה יומני אירועים",
    table: {
      type: "סוג אירוע",
      user: "משתמש",
      occurred: "התרחש ב-",
    },
  },

  // Privacy & Data-Handling
  privacy: {
    title: "פרטיות וטיפול בנתונים",
    description:
      "זו הקונפיגורציה שלך עבור אופן הטיפול בנתונים שלך על ידי ספקי צד שלישי מחוברים ו-AnythingLLM.",
    llm: "בחירת LLM",
    embedding: "העדפת הטבעה",
    vector: "בסיס נתונים וקטור",
    anonymous: "טלמטריה אנונימית מופעלת",
  },

  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    github: {
      name: "GitHub Repo",
      description: "Import an entire public or private Github repository in a single click.",
      URL: "GitHub Repo URL",
      URL_explained: "Url of the GitHub repo you wish to collect.",
      token: "Github Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", the GitHub API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      ignores: "File Ignores",
      git_ignore: "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained: "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from.",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information: "Without filling out the <b>Github Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitHub's public API rate-limits.",
      token_personal: "Get a free Personal Access Token with a GitHub account here."
    },
    gitlab: {
      name: "GitLab Repo",
      description: "Import an entire public or private GitLab repository in a single click.",
      URL: "GitLab Repo URL",
      URL_explained: "URL of the GitLab repo you wish to collect.",
      token: "GitLab Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_description: "Select additional entities to fetch from the GitLab API.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", the GitLab API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      fetch_issues: "Fetch Issues as Documents",
      ignores: "File Ignores",
      git_ignore: "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained: "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information: "Without filling out the <b>GitLab Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitLab's public API rate-limits.",
      token_personal: "Get a free Personal Access Token with a GitLab account here."
    },
    youtube: {
      name: "YouTube Transcript",
      description: "Import the transcription of an entire YouTube video from a link.",
      URL: "YouTube Video URL",
      URL_explained_start: "Enter the URL of any YouTube video to fetch its transcript. The video must have ",
      URL_explained_link: "closed captions",
      URL_explained_end: " available.",
      task_explained: "Once complete, the transcript will be available for embedding into workspaces in the document picker.",
      language: "Transcript Language",
      language_explained: "Select the language of the transcript you want to collect.",
      loading_languages: "-- loading available languages --"
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description: "Scrape a website and its sub-links up to a certain depth.",
      URL: "Website URL",
      URL_explained: "URL of the website you want to scrape.",
      depth: "Crawl Depth",
      depth_explained: "This is the number of child-links that the worker should follow from the origin URL.",
      max_pages: "Maximum Pages",
      max_pages_explained: "Maximum number of links to scrape.",
      task_explained: "Once complete, all scraped content will be available for embedding into workspaces in the document picker."
    },
    confluence: {
      name: "Confluence",
      description: "Import an entire Confluence page in a single click.",
      deployment_type: "Confluence deployment type",
      deployment_type_explained: "Determine if your Confluence instance is hosted on Atlassian cloud or self-hosted.",
      base_url: "Confluence base URL",
      base_url_explained: "This is the base URL of your Confluence space.",
      space_key: "Confluence space key",
      space_key_explained: "This is the spaces key of your confluence instance that will be used. Usually begins with ~",
      username: "Confluence Username",
      username_explained: "Your Confluence username.",
      token: "Confluence API Token",
      token_explained_start: "A ",
      token_explained_link1: "Personal API Token",
      token_explained_middle: " is required to access Confluence pages. You can ",
      token_explained_link2: "create an API Token here",
      token_explained_end: ".",
      token_desc: "Access token for authentication.",
      task_explained: "Once complete, the page content will be available for embedding into workspaces in the document picker."
    },

    manage: {
      documents: "Documents",
      "data-connectors": "Data Connectors",
      "desktop-only": "Editing these settings are only available on a desktop device. Please access this page on your desktop to continue.",
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
      "delete-confirmation": "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible.",
      "removing-message": "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Successfully moved {{count}} documents.",
      date: "Date",
      type: "Type",
      no_docs: "No Documents",
      select_all:"Select All",
      deselect_all:"Deselect All",
      remove_selected: "Remove Selected",
      costs: "*One time cost for embeddings",
      save_embed: "Save and Embed",
    },
    upload: {
      "processor-offline": "Document Processor Unavailable",
      "processor-offline-desc": "We can't upload your files right now because the document processor is offline. Please try again later.",
      "click-upload": "Click to upload or drag and drop",
      "file-types": "supports text files, csv's, spreadsheets, audio files, and more!",
      "or-submit-link": "or submit a link",
      "placeholder-link": "https://example.com",
      "fetching": "Fetching...",
      "fetch-website": "Fetch website",
      "privacy-notice": "These files will be uploaded to the document processor running on this AnythingLLM instance. These files are not sent or shared with a third party.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1: "When you <b>pin</b> a document in AnythingLLM we will inject the entire content of the document into your prompt window for your LLM to fully comprehend.", 
      pin_explained_block2: "This works best with <b>large-context models</b> or small files that are critical to its knowledge-base.",
      pin_explained_block3: "If you are not getting the answers you desire from AnythingLLM by default then pinning is a great way to get higher quality answers in a click.",
      accept: "Okay, got it"
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1: "When you <b>watch</b> a document in AnythingLLM we will <i>automatically</i> sync your document content from it's original source on regular intervals. This will automatically update the content in every workspace where this file is managed.", 
      watch_explained_block2: "This feature currently supports online-based content and will not be available for manually uploaded documents.",
      watch_explained_block3_start: "You can manage what documents are watched from the ",
      watch_explained_block3_link: "File manager",
      watch_explained_block3_end: " admin view.",
      accept: "Okay, got it"
    }
  },

  chat_window:{
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

  profile_settings:{
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_description: "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
    new_password: "New Password",
    passwort_description: "Password must be at least 8 characters long",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Theme Preference",
    language: "Preferred language",
  },
};

export default TRANSLATIONS;
