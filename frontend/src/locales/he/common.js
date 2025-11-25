// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "ברוכים הבאים ל",
      getStarted: "להתחלה",
    },
    llm: {
      title: "העדפות מודל שפה (LLM)",
      description:
        "AnythingLLM יכול לעבוד עם ספקי מודלי שפה (LLM) רבים. זה יהיה השירות שיטפל בצ'אט.",
    },
    userSetup: {
      title: "הגדרת משתמש",
      description: "הגדר את הגדרות המשתמש שלך.",
      howManyUsers: "כמה משתמשים ישתמשו במופע זה?",
      justMe: "רק אני",
      myTeam: "הצוות שלי",
      instancePassword: "סיסמת מופע",
      setPassword: "האם תרצה להגדיר סיסמה?",
      passwordReq: "סיסמאות חייבות להכיל לפחות 8 תווים.",
      passwordWarn: "חשוב לשמור סיסמה זו מכיוון שאין שיטת שחזור.",
      adminUsername: "שם משתמש של חשבון מנהל",
      adminUsernameReq:
        "שם המשתמש חייב להכיל לפחות 6 תווים ויכול לכלול רק אותיות קטנות, מספרים, קווים תחתונים ומקפים, ללא רווחים.",
      adminPassword: "סיסמת חשבון מנהל",
      adminPasswordReq: "סיסמאות חייבות להכיל לפחות 8 תווים.",
      teamHint:
        "כברירת מחדל, אתה תהיה המנהל היחיד. לאחר סיום ההצטרפות תוכל ליצור ולהזמין אחרים להיות משתמשים או מנהלים. אל תאבד את סיסמתך, מכיוון שרק מנהלים יכולים לאפס סיסמאות.",
    },
    data: {
      title: "טיפול בנתונים ופרטיות",
      description: "אנו מחויבים לשקיפות ושליטה בכל הנוגע לנתונים האישיים שלך.",
      settingsHint: "ניתן להגדיר מחדש הגדרות אלה בכל עת בהגדרות.",
    },
    survey: {
      title: "ברוכים הבאים ל-AnythingLLM",
      description:
        "עזרו לנו לבנות את AnythingLLM כך שיתאים לצרכים שלכם. אופציונלי.",
      email: "מה האימייל שלך?",
      useCase: "לאיזו מטרה תשתמש ב-AnythingLLM?",
      useCaseWork: "לעבודה",
      useCasePersonal: "לשימוש אישי",
      useCaseOther: "אחר",
      comment: "איך שמעת על AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, וכו' - ספר לנו איך מצאת אותנו!",
      skip: "דלג על הסקר",
      thankYou: "תודה על המשוב!",
    },
    workspace: {
      title: "צור את סביבת העבודה הראשונה שלך",
      description:
        "צור את סביבת העבודה הראשונה שלך והתחל לעבוד עם AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "שם סביבת העבודה",
    error: "שגיאה",
    success: "הצלחה",
    user: "משתמש",
    selection: "בחירת מודל",
    saving: "שומר...",
    save: "שמור שינויים",
    previous: "עמוד קודם",
    next: "עמוד הבא",
    optional: "אופציונלי",
    yes: "כן",
    no: "לא",
    search: "חיפוש",
  },
  settings: {
    title: "הגדרות מופע",
    system: "הגדרות כלליות",
    invites: "הזמנות",
    users: "משתמשים",
    workspaces: "סביבות עבודה",
    "workspace-chats": "צ'אטים של סביבות עבודה",
    customization: "התאמה אישית",
    interface: "העדפות ממשק משתמש",
    branding: "מיתוג והתאמה אישית (Whitelabeling)",
    chat: "צ'אט",
    "api-keys": "מפתחות API למפתחים",
    llm: "מודל שפה (LLM)",
    transcription: "תמלול",
    embedder: "מטמיע (Embedder)",
    "text-splitting": "פיצול טקסט וחלוקה למקטעים (Chunking)",
    "voice-speech": "קול ודיבור",
    "vector-database": "מסד נתונים וקטורי",
    embeds: "הטמעות צ'אט (Embeds)",
    "embed-chats": "היסטוריית הטמעות צ'אט",
    security: "אבטחה",
    "event-logs": "יומני אירועים",
    privacy: "פרטיות ונתונים",
    "ai-providers": "ספקי בינה מלאכותית",
    "agent-skills": "כישורי סוכן",
    admin: "מנהל",
    tools: "כלים",
    "system-prompt-variables": "משתני הנחיית מערכת",
    "experimental-features": "תכונות ניסיוניות",
    contact: "צור קשר עם התמיכה",
    "browser-extension": "תוסף דפדפן",
  },
  login: {
    "multi-user": {
      welcome: "ברוכים הבאים ל",
      "placeholder-username": "שם משתמש",
      "placeholder-password": "סיסמה",
      login: "התחברות",
      validating: "מאמת...",
      "forgot-pass": "שכחת סיסמה",
      reset: "איפוס",
    },
    "sign-in": {
      start: "התחבר ל",
      end: "חשבונך.",
    },
    "password-reset": {
      title: "איפוס סיסמה",
      description: "ספק את המידע הדרוש למטה כדי לאפס את סיסמתך.",
      "recovery-codes": "קודיי שחזור",
      "recovery-code": "קוד שחזור {{index}}",
      "back-to-login": "חזרה להתחברות",
    },
  },
  "main-page": {
    noWorkspaceError: "אנא צור סביבת עבודה לפני התחלת צ'אט.",
    checklist: {
      title: "תחילת עבודה",
      tasksLeft: "משימות נותרו",
      completed: "אתה בדרך להפוך למומחה AnythingLLM!",
      dismiss: "סגור",
      tasks: {
        create_workspace: {
          title: "צור סביבת עבודה",
          description: "צור את סביבת העבודה הראשונה שלך כדי להתחיל",
          action: "צור",
        },
        send_chat: {
          title: "שלח צ'אט",
          description: "התחל שיחה עם עוזר ה-AI שלך",
          action: "צ'אט",
        },
        embed_document: {
          title: "הטמע מסמך",
          description: "הוסף את המסמך הראשון שלך לסביבת העבודה",
          action: "הטמע",
        },
        setup_system_prompt: {
          title: "הגדר הנחיית מערכת",
          description: "הגדר את התנהגות עוזר ה-AI שלך",
          action: "הגדר",
        },
        define_slash_command: {
          title: "הגדר פקודת סלאש",
          description: "צור פקודות מותאמות אישית עבור העוזר שלך",
          action: "הגדר",
        },
        visit_community: {
          title: "בקר במרכז הקהילה",
          description: "גלה משאבים ותבניות מהקהילה",
          action: "עיין",
        },
      },
    },
    quickLinks: {
      title: "קישורים מהירים",
      sendChat: "שלח צ'אט",
      embedDocument: "הטמע מסמך",
      createWorkspace: "צור סביבת עבודה",
    },
    exploreMore: {
      title: "גלה תכונות נוספות",
      features: {
        customAgents: {
          title: "סוכני AI מותאמים אישית",
          description: "בנה סוכני AI ואוטומציות חזקות ללא קוד.",
          primaryAction: "צ'אט באמצעות @agent",
          secondaryAction: "בנה זרימת סוכן",
        },
        slashCommands: {
          title: "פקודות סלאש",
          description:
            "חסוך זמן והזרק הנחיות באמצעות פקודות סלאש מותאמות אישית.",
          primaryAction: "צור פקודת סלאש",
          secondaryAction: "גלה במרכז הקהילה",
        },
        systemPrompts: {
          title: "הנחיות מערכת",
          description:
            "שנה את הנחיית המערכת כדי להתאים אישית את תשובות ה-AI של סביבת עבודה.",
          primaryAction: "שנה הנחיית מערכת",
          secondaryAction: "נהל משתני הנחיה",
        },
      },
    },
    announcements: {
      title: "עדכונים והודעות",
    },
    resources: {
      title: "משאבים",
      links: {
        docs: "תיעוד",
        star: "סמן בכוכב ב-Github",
      },
      keyboardShortcuts: "קיצורי מקלדת",
    },
  },
  "new-workspace": {
    title: "סביבת עבודה חדשה",
    placeholder: "סביבת העבודה שלי",
  },
  "workspaces—settings": {
    general: "הגדרות כלליות",
    chat: "הגדרות צ'אט",
    vector: "מסד נתונים וקטורי",
    members: "חברים",
    agent: "תצורת סוכן",
  },
  general: {
    vector: {
      title: "ספירת וקטורים",
      description: "המספר הכולל של וקטורים במסד הנתונים הווקטורי שלך.",
    },
    names: {
      description: "זה ישנה רק את שם התצוגה של סביבת העבודה שלך.",
    },
    message: {
      title: "הודעות צ'אט מוצעות",
      description: "התאם אישית את ההודעות שיוצעו למשתמשי סביבת העבודה שלך.",
      add: "הוסף הודעה חדשה",
      save: "שמור הודעות",
      heading: "הסבר לי",
      body: "את היתרונות של AnythingLLM",
    },
    pfp: {
      title: "תמונת פרופיל של העוזר",
      description: "התאם אישית את תמונת הפרופיל של העוזר עבור סביבת עבודה זו.",
      image: "תמונת סביבת עבודה",
      remove: "הסר תמונת סביבת עבודה",
    },
    delete: {
      title: "מחק סביבת עבודה",
      description:
        "מחק סביבת עבודה זו ואת כל הנתונים שלה. פעולה זו תמחק את סביבת העבודה עבור כל המשתמשים.",
      delete: "מחק סביבת עבודה",
      deleting: "מוחק סביבת עבודה...",
      "confirm-start": "אתה עומד למחוק את כל",
      "confirm-end":
        "סביבת העבודה שלך. פעולה זו תסיר את כל הטמעות הווקטורים ממסד הנתונים הווקטורי שלך.\n\nקבצי המקור המקוריים יישארו ללא שינוי. פעולה זו אינה הפיכה.",
    },
  },
  chat: {
    llm: {
      title: "ספק מודל שפה (LLM) של סביבת העבודה",
      description:
        "ספק ומודל ה-LLM הספציפיים שישמשו עבור סביבת עבודה זו. כברירת מחדל, הוא משתמש בספק ובהגדרות ה-LLM של המערכת.",
      search: "חפש בכל ספקי ה-LLM",
    },
    model: {
      title: "מודל צ'אט של סביבת העבודה",
      description:
        "מודל הצ'אט הספציפי שישמש עבור סביבת עבודה זו. אם ריק, ישתמש בהעדפת ה-LLM של המערכת.",
      wait: "-- ממתין למודלים --",
    },
    mode: {
      title: "מצב צ'אט",
      chat: {
        title: "צ'אט",
        "desc-start": "יספק תשובות עם הידע הכללי של מודל השפה",
        and: "וכן",
        "desc-end": "מהקשר המסמכים שנמצא.",
      },
      query: {
        title: "שאילתה",
        "desc-start": "יספק תשובות",
        only: "רק",
        "desc-end": "אם נמצא הקשר במסמכים.",
      },
    },
    history: {
      title: "היסטוריית צ'אט",
      "desc-start": "מספר הצ'אטים הקודמים שייכללו בזיכרון לטווח קצר של התגובה.",
      recommend: "מומלץ 20. ",
      "desc-end":
        "יותר מ-45 צפוי להוביל לכשלים רציפים בצ'אט, תלוי בגודל ההודעה.",
    },
    prompt: {
      title: "הנחיית מערכת",
      description:
        "ההנחיה שתשמש בסביבת עבודה זו. הגדר את ההקשר וההוראות לבינה המלאכותית כדי ליצור תגובה. עליך לספק הנחיה מנוסחת בקפידה כדי שה-AI יוכל ליצור תגובה רלוונטית ומדויקת.",
      history: {
        title: "היסטוריית הנחיות מערכת",
        clearAll: "נקה הכל",
        noHistory: "אין היסטוריית הנחיות מערכת זמינה",
        restore: "שחזר",
        delete: "מחק",
        publish: "פרסם במרכז הקהילה",
        deleteConfirm: "האם אתה בטוח שברצונך למחוק פריט היסטוריה זה?",
        clearAllConfirm:
          "האם אתה בטוח שברצונך לנקות את כל ההיסטוריה? לא ניתן לבטל פעולה זו.",
        expand: "הרחב",
      },
    },
    refusal: {
      title: "תגובת סירוב במצב שאילתה",
      "desc-start": "כאשר במצב",
      query: "שאילתה",
      "desc-end":
        ", ייתכן שתרצה להחזיר תגובת סירוב מותאמת אישית כאשר לא נמצא הקשר.",
      "tooltip-title": "למה אני רואה את זה?",
      "tooltip-description":
        "אתה נמצא במצב שאילתה, אשר משתמש רק במידע מהמסמכים שלך. עבור למצב צ'אט לשיחות גמישות יותר, או לחץ כאן כדי לבקר בתיעוד שלנו וללמוד עוד על מצבי צ'אט.",
    },
    temperature: {
      title: "טמפרטורת LLM",
      "desc-start": 'הגדרה זו שולטת במידת ה"יצירתיות" של תגובות מודל השפה שלך.',
      "desc-end":
        "ככל שהמספר גבוה יותר, כך התגובה יצירתית יותר. עבור מודלים מסוימים, הדבר עלול להוביל לתגובות לא קוהרנטיות כאשר הערך גבוה מדי.",
      hint: "לרוב מודלי ה-LLM יש טווחי ערכים קבילים שונים. עיין במידע של ספק ה-LLM שלך.",
    },
  },
  "vector-workspace": {
    identifier: "מזהה מסד נתונים וקטורי",
    snippets: {
      title: "מקטעי הקשר מרביים",
      description:
        "הגדרה זו שולטת בכמות המרבית של מקטעי הקשר שיישלחו למודל השפה עבור כל צ'אט או שאילתה.",
      recommend: "מומלץ: 4",
    },
    doc: {
      title: "סף דמיון מסמכים",
      description:
        "ציון הדמיון המינימלי הנדרש כדי שמקור ייחשב קשור לצ'אט. ככל שהמספר גבוה יותר, כך המקור חייב להיות דומה יותר לצ'אט.",
      zero: "ללא הגבלה",
      low: "נמוך (ציון דמיון ≥ 0.25)",
      medium: "בינוני (ציון דמיון ≥ 0.50)",
      high: "גבוה (ציון דמיון ≥ 0.75)",
    },
    reset: {
      reset: "אפס מסד נתונים וקטורי",
      resetting: "מנקה וקטורים...",
      confirm:
        "אתה עומד לאפס את מסד הנתונים הווקטורי של סביבת עבודה זו. פעולה זו תסיר את כל הטמעות הווקטורים הקיימות.\n\nקבצי המקור המקוריים יישארו ללא שינוי. פעולה זו אינה הפיכה.",
      error: "לא ניתן היה לאפס את מסד הנתונים הווקטורי של סביבת העבודה!",
      success: "מסד הנתונים הווקטורי של סביבת העבודה אופס!",
    },
  },
  agent: {
    "performance-warning":
      "הביצועים של מודלי שפה שאינם תומכים במפורש בקריאת כלים (tool-calling) תלויים מאוד ביכולות ובדיוק של המודל. ייתכן שיכולות מסוימות יהיו מוגבלות או לא פונקציונליות.",
    provider: {
      title: "ספק מודל שפה (LLM) של סוכן סביבת העבודה",
      description:
        "ספק ומודל ה-LLM הספציפיים שישמשו עבור סוכן ה-@agent של סביבת עבודה זו.",
    },
    mode: {
      chat: {
        title: "מודל צ'אט של סוכן סביבת העבודה",
        description:
          "מודל הצ'אט הספציפי שישמש עבור סוכן ה-@agent של סביבת עבודה זו.",
      },
      title: "מודל סוכן של סביבת העבודה",
      description:
        "מודל ה-LLM הספציפי שישמש עבור סוכן ה-@agent של סביבת עבודה זו.",
      wait: "-- ממתין למודלים --",
    },
    skill: {
      title: "כישורי סוכן ברירת מחדל",
      description:
        "שפר את היכולות הטבעיות של סוכן ברירת המחדל עם כישורים מובנים אלה. הגדרה זו חלה על כל סביבות העבודה.",
      rag: {
        title: "RAG וזיכרון לטווח ארוך",
        description:
          'אפשר לסוכן למנף את המסמכים המקומיים שלך כדי לענות על שאילתות או בקש מהסוכן "לזכור" חלקי תוכן לאחזור זיכרון לטווח ארוך.',
      },
      view: {
        title: "צפייה וסיכום מסמכים",
        description:
          "אפשר לסוכן לרשום ולסכם את התוכן של קבצי סביבת העבודה המוטמעים כעת.",
      },
      scrape: {
        title: "גירוד אתרי אינטרנט",
        description: "אפשר לסוכן לבקר ולגרד את התוכן של אתרי אינטרנט.",
      },
      generate: {
        title: "יצירת תרשימים",
        description:
          "אפשר לסוכן ברירת המחדל ליצור סוגים שונים של תרשימים מנתונים שסופקו או ניתנו בצ'אט.",
      },
      save: {
        title: "יצירה ושמירה של קבצים לדפדפן",
        description:
          "אפשר לסוכן ברירת המחדל ליצור ולכתוב לקבצים שנשמרים וניתנים להורדה בדפדפן שלך.",
      },
      web: {
        title: "חיפוש וגלישה באינטרנט בזמן אמת",
        "desc-start":
          "אפשר לסוכן שלך לחפש באינטרנט כדי לענות על שאלותיך על ידי התחברות לספק חיפוש אינטרנטי (SERP).",
        "desc-end":
          "חיפוש אינטרנטי במהלך סשנים של סוכן לא יעבוד עד שהגדרה זו תבוצע.",
      },
    },
  },
  recorded: {
    title: "צ'אטים של סביבת עבודה",
    description:
      "אלה כל הצ'אטים וההודעות המוקלטים שנשלחו על ידי משתמשים, מסודרים לפי תאריך יצירתם.",
    export: "יצא",
    table: {
      id: "מזהה",
      by: "נשלח על ידי",
      workspace: "סביבת עבודה",
      prompt: "הנחיה",
      response: "תגובה",
      at: "נשלח ב",
    },
  },
  customization: {
    interface: {
      title: "העדפות ממשק משתמש",
      description: "הגדר את העדפות ממשק המשתמש שלך עבור AnythingLLM.",
    },
    branding: {
      title: "מיתוג והתאמה אישית (Whitelabeling)",
      description: "התאם אישית את מופע ה-AnythingLLM שלך עם מיתוג מותאם אישית.",
    },
    chat: {
      title: "צ'אט",
      description: "הגדר את העדפות הצ'אט שלך עבור AnythingLLM.",
      auto_submit: {
        title: "שליחה אוטומטית של קלט קולי",
        description: "שלח אוטומטית קלט קולי לאחר פרק זמן של שקט",
      },
      auto_speak: {
        title: "הקראה אוטומטית של תגובות",
        description: "הקרא אוטומטית תגובות מה-AI",
      },
      spellcheck: {
        title: "הפעל בדיקת איות",
        description: "הפעל או השבת בדיקת איות בשדה הקלט של הצ'אט",
      },
    },
    items: {
      theme: {
        title: "ערכת נושא",
        description: "בחר את ערכת הצבעים המועדפת עליך ליישום.",
      },
      "show-scrollbar": {
        title: "הצג פס גלילה",
        description: "הפעל או השבת את פס הגלילה בחלון הצ'אט.",
      },
      "support-email": {
        title: "אימייל תמיכה",
        description:
          "הגדר את כתובת האימייל לתמיכה שתהיה נגישה למשתמשים כאשר הם זקוקים לעזרה.",
      },
      "app-name": {
        title: "שם",
        description: "הגדר שם שיוצג בדף ההתחברות לכל המשתמשים.",
      },
      "chat-message-alignment": {
        title: "יישור הודעות צ'אט",
        description: "בחר את מצב יישור ההודעות בעת שימוש בממשק הצ'אט.",
      },
      "display-language": {
        title: "שפת תצוגה",
        description:
          "בחר את השפה המועדפת להצגת ממשק המשתמש של AnythingLLM - כאשר תרגומים זמינים.",
      },
      logo: {
        title: "לוגו מותג",
        description: "העלה את הלוגו המותאם אישית שלך להצגה בכל העמודים.",
        add: "הוסף לוגו מותאם אישית",
        recommended: "גודל מומלץ: 800x200",
        remove: "הסר",
        replace: "החלף",
      },
      "welcome-messages": {
        title: "הודעות פתיחה",
        description:
          "התאם אישית את הודעות הפתיחה המוצגות למשתמשים שלך. רק משתמשים שאינם מנהלים יראו הודעות אלה.",
        new: "חדש",
        system: "מערכת",
        user: "משתמש",
        message: "הודעה",
        assistant: "עוזר הצ'אט של AnythingLLM",
        "double-click": "לחץ פעמיים לעריכה...",
        save: "שמור הודעות",
      },
      "browser-appearance": {
        title: "מראה הדפדפן",
        description:
          "התאם אישית את מראה לשונית הדפדפן והכותרת כשהאפליקציה פתוחה.",
        tab: {
          title: "כותרת",
          description:
            "הגדר כותרת לשונית מותאמת אישית כשהאפליקציה פתוחה בדפדפן.",
        },
        favicon: {
          title: "סמל אתר (Favicon)",
          description: "השתמש בסמל אתר מותאם אישית עבור לשונית הדפדפן.",
        },
      },
      "sidebar-footer": {
        title: "פריטי כותרת תחתונה בסרגל הצד",
        description:
          "התאם אישית את פריטי הכותרת התחתונה המוצגים בתחתית סרגל הצד.",
        icon: "סמל",
        link: "קישור",
      },
      "render-html": {
        title: null,
        description: null,
      },
    },
  },
  api: {
    title: "מפתחות API",
    description:
      "מפתחות API מאפשרים למחזיק בהם לגשת ולנהל באופן תכנותי את מופע AnythingLLM זה.",
    link: "קרא את תיעוד ה-API",
    generate: "צור מפתח API חדש",
    table: {
      key: "מפתח API",
      by: "נוצר על ידי",
      created: "נוצר",
    },
  },
  llm: {
    title: "העדפות מודל שפה (LLM)",
    description:
      "אלה האישורים וההגדרות עבור ספק הצ'אט וההטמעה המועדף עליך. חשוב שמפתחות אלה יהיו עדכניים ונכונים, אחרת AnythingLLM לא יפעל כראוי.",
    provider: "ספק LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "נקודת קצה של שירות Azure",
        api_key: "מפתח API",
        chat_deployment_name: "שם פריסת צ'אט",
        chat_model_token_limit: "מגבלת אסימוני מודל צ'אט",
        model_type: "סוג מודל",
        default: "ברירת מחדל",
        reasoning: "היגיון",
      },
    },
  },
  transcription: {
    title: "העדפות מודל תמלול",
    description:
      "אלה האישורים וההגדרות עבור ספק מודל התמלול המועדף עליך. חשוב שמפתחות אלה יהיו עדכניים ונכונים, אחרת קובצי מדיה ושמע לא יתומללו.",
    provider: "ספק תמלול",
    "warn-start":
      "שימוש במודל ה-whisper המקומי על מכונות עם זיכרון RAM או מעבד מוגבלים עלול לגרום להאטה של AnythingLLM בעת עיבוד קובצי מדיה.",
    "warn-recommend":
      "אנו ממליצים על לפחות 2GB של זיכרון RAM והעלאת קבצים קטנים מ-10Mb.",
    "warn-end": "המודל המובנה יורד אוטומטית בשימוש הראשון.",
  },
  embedding: {
    title: "העדפות הטמעה (Embedding)",
    "desc-start":
      "בעת שימוש במודל שפה שאינו תומך באופן מובנה במנוע הטמעה - ייתכן שתצטרך לציין בנוסף אישורים להטמעת טקסט.",
    "desc-end":
      "הטמעה היא תהליך של הפיכת טקסט לווקטורים. אישורים אלה נדרשים כדי להפוך את הקבצים וההנחיות שלך לפורמט ש-AnythingLLM יכול להשתמש בו לעיבוד.",
    provider: {
      title: "ספק הטמעה",
    },
  },
  text: {
    title: "העדפות פיצול טקסט וחלוקה למקטעים (Chunking)",
    "desc-start":
      "לפעמים, ייתכן שתרצה לשנות את הדרך ברירת המחדל שבה מסמכים חדשים מפוצלים ומחולקים למקטעים לפני הכנסתם למסד הנתונים הווקטורי שלך.",
    "desc-end":
      "עליך לשנות הגדרה זו רק אם אתה מבין כיצד פועל פיצול טקסט ואת תופעות הלוואי שלו.",
    size: {
      title: "גודל מקטע טקסט",
      description: "זוהי הכמות המרבית של תווים שיכולה להיות בווקטור יחיד.",
      recommend: "אורך מרבי של מודל הטמעה הוא",
    },
    overlap: {
      title: "חפיפת מקטעי טקסט",
      description:
        "זוהי החפיפה המרבית של תווים המתרחשת במהלך חלוקה למקטעים בין שני מקטעי טקסט סמוכים.",
    },
  },
  vector: {
    title: "מסד נתונים וקטורי",
    description:
      "אלה האישורים וההגדרות לאופן פעולת מופע ה-AnythingLLM שלך. חשוב שמפתחות אלה יהיו עדכניים ונכונים.",
    provider: {
      title: "ספק מסד נתונים וקטורי",
      description: "אין צורך בתצורה עבור LanceDB.",
    },
  },
  embeddable: {
    title: "ווידג'טים של צ'אט להטמעה",
    description:
      "ווידג'טים של צ'אט להטמעה הם ממשקי צ'אט ציבוריים הקשורים לסביבת עבודה אחת. הם מאפשרים לך לבנות סביבות עבודה שתוכל לפרסם לעולם.",
    create: "צור הטמעה",
    table: {
      workspace: "סביבת עבודה",
      chats: "צ'אטים שנשלחו",
      active: "דומיינים פעילים",
      created: "נוצר",
    },
  },
  "embed-chats": {
    title: "היסטוריית צ'אט מוטמע",
    export: "יצא",
    description: "אלה כל הצ'אטים וההודעות המוקלטים מכל הטמעה שפרסמת.",
    table: {
      embed: "הטמעה",
      sender: "שולח",
      message: "הודעה",
      response: "תגובה",
      at: "נשלח ב",
    },
  },
  event: {
    title: "יומני אירועים",
    description: "צפה בכל הפעולות והאירועים המתרחשים במופע זה לצורך ניטור.",
    clear: "נקה יומני אירועים",
    table: {
      type: "סוג אירוע",
      user: "משתמש",
      occurred: "התרחש ב",
    },
  },
  privacy: {
    title: "פרטיות וטיפול בנתונים",
    description:
      "זוהי התצורה שלך לאופן שבו ספקים צד שלישי מחוברים ו-AnythingLLM מטפלים בנתונים שלך.",
    llm: "בחירת מודל שפה (LLM)",
    embedding: "העדפות הטמעה",
    vector: "מסד נתונים וקטורי",
    anonymous: "טלמטריה אנונימית מופעלת",
  },
  connectors: {
    "search-placeholder": "חפש מחברי נתונים",
    "no-connectors": "לא נמצאו מחברי נתונים.",
    obsidian: {
      name: "Obsidian",
      description: "ייבא כספת Obsidian בלחיצה אחת.",
      vault_location: "מיקום כספת",
      vault_description:
        "בחר את תיקיית כספת ה-Obsidian שלך כדי לייבא את כל ההערות והחיבורים ביניהן.",
      selected_files: "נמצאו {{count}} קבצי markdown",
      importing: "מייבא כספת...",
      import_vault: "ייבא כספת",
      processing_time: "זה עשוי לקחת זמן מה, תלוי בגודל הכספת שלך.",
      vault_warning:
        "כדי למנוע התנגשויות, ודא שכספת ה-Obsidian שלך אינה פתוחה כעת.",
    },
    github: {
      name: "מאגר GitHub",
      description: "ייבא מאגר GitHub ציבורי או פרטי שלם בלחיצה אחת.",
      URL: "כתובת URL של מאגר GitHub",
      URL_explained: "כתובת ה-URL של מאגר ה-GitHub שברצונך לאסוף.",
      token: "אסימון גישה של GitHub",
      optional: "אופציונלי",
      token_explained: "אסימון גישה למניעת הגבלת קצב.",
      token_explained_start: "ללא ",
      token_explained_link1: "אסימון גישה אישי",
      token_explained_middle:
        ", ה-API של GitHub עשוי להגביל את מספר הקבצים שניתן לאסוף עקב הגבלות קצב. תוכל ",
      token_explained_link2: "ליצור אסימון גישה זמני",
      token_explained_end: " כדי למנוע בעיה זו.",
      ignores: "התעלמות מקבצים",
      git_ignore:
        "רשום בפורמט .gitignore כדי להתעלם מקבצים ספציפיים במהלך האיסוף. הקש אנטר לאחר כל ערך שברצונך לשמור.",
      task_explained:
        "לאחר השלמה, כל הקבצים יהיו זמינים להטמעה בסביבות עבודה בבורר המסמכים.",
      branch: "ענף שממנו ברצונך לאסוף קבצים.",
      branch_loading: "-- טוען ענפים זמינים --",
      branch_explained: "ענף שממנו ברצונך לאסוף קבצים.",
      token_information:
        "ללא מילוי <b>אסימון הגישה של GitHub</b>, מחבר נתונים זה יוכל לאסוף רק את הקבצים ב<b>רמה העליונה</b> של המאגר עקב הגבלות הקצב של ה-API הציבורי של GitHub.",
      token_personal: "קבל אסימון גישה אישי בחינם עם חשבון GitHub כאן.",
    },
    gitlab: {
      name: "מאגר GitLab",
      description: "ייבא מאגר GitLab ציבורי או פרטי שלם בלחיצה אחת.",
      URL: "כתובת URL של מאגר GitLab",
      URL_explained: "כתובת ה-URL של מאגר ה-GitLab שברצונך לאסוף.",
      token: "אסימון גישה של GitLab",
      optional: "אופציונלי",
      token_explained: "אסימון גישה למניעת הגבלת קצב.",
      token_description: "בחר ישויות נוספות לאחזור מה-API של GitLab.",
      token_explained_start: "ללא ",
      token_explained_link1: "אסימון גישה אישי",
      token_explained_middle:
        ", ה-API של GitLab עשוי להגביל את מספר הקבצים שניתן לאסוף עקב הגבלות קצב. תוכל ",
      token_explained_link2: "ליצור אסימון גישה זמני",
      token_explained_end: " כדי למנוע בעיה זו.",
      fetch_issues: "אחזר בעיות (Issues) כמסמכים",
      ignores: "התעלמות מקבצים",
      git_ignore:
        "רשום בפורמט .gitignore כדי להתעלם מקבצים ספציפיים במהלך האיסוף. הקש אנטר לאחר כל ערך שברצונך לשמור.",
      task_explained:
        "לאחר השלמה, כל הקבצים יהיו זמינים להטמעה בסביבות עבודה בבורר המסמכים.",
      branch: "ענף שממנו ברצונך לאסוף קבצים",
      branch_loading: "-- טוען ענפים זמינים --",
      branch_explained: "ענף שממנו ברצונך לאסוף קבצים.",
      token_information:
        "ללא מילוי <b>אסימון הגישה של GitLab</b>, מחבר נתונים זה יוכל לאסוף רק את הקבצים ב<b>רמה העליונה</b> של המאגר עקב הגבלות הקצב של ה-API הציבורי של GitLab.",
      token_personal: "קבל אסימון גישה אישי בחינם עם חשבון GitLab כאן.",
    },
    youtube: {
      name: "תמלול YouTube",
      description: "ייבא את התמלול של סרטון YouTube שלם מקישור.",
      URL: "כתובת URL של סרטון YouTube",
      URL_explained_start:
        "הזן את כתובת ה-URL של כל סרטון YouTube כדי לאחזר את התמלול שלו. לסרטון חייבות להיות ",
      URL_explained_link: "כתוביות סגורות",
      URL_explained_end: " זמינות.",
      task_explained:
        "לאחר השלמה, התמלול יהיה זמין להטמעה בסביבות עבודה בבורר המסמכים.",
      language: "שפת התמלול",
      language_explained: "בחר את שפת התמלול שברצונך לאסוף.",
      loading_languages: "-- טוען שפות זמינות --",
    },
    "website-depth": {
      name: "גרדן קישורים המוני",
      description: "גרד אתר ואת קישורי המשנה שלו עד לעומק מסוים.",
      URL: "כתובת אתר אינטרנט",
      URL_explained: "כתובת ה-URL של האתר שברצונך לגרד.",
      depth: "עומק זחילה",
      depth_explained:
        "זהו מספר קישורי הילד שהעובד יעקוב אחריהם מכתובת ה-URL המקורית.",
      max_pages: "מספר עמודים מרבי",
      max_pages_explained: "המספר המרבי של קישורים לגירוד.",
      task_explained:
        "לאחר השלמה, כל התוכן שנגרד יהיה זמין להטמעה בסביבות עבודה בבורר המסמכים.",
    },
    confluence: {
      name: "Confluence",
      description: "ייבא עמוד Confluence שלם בלחיצה אחת.",
      deployment_type: "סוג פריסת Confluence",
      deployment_type_explained:
        "קבע אם מופע ה-Confluence שלך מתארח בענן של Atlassian או באירוח עצמי.",
      base_url: "כתובת בסיס של Confluence",
      base_url_explained: "זוהי כתובת הבסיס של מרחב ה-Confluence שלך.",
      space_key: "מפתח מרחב של Confluence",
      space_key_explained:
        "זהו מפתח המרחבים של מופע ה-Confluence שלך שישמש. בדרך כלל מתחיל ב-~",
      username: "שם משתמש ב-Confluence",
      username_explained: "שם המשתמש שלך ב-Confluence",
      auth_type: "סוג אימות Confluence",
      auth_type_explained:
        "בחר את סוג האימות שבו ברצונך להשתמש כדי לגשת לדפי ה-Confluence שלך.",
      auth_type_username: "שם משתמש ואסימון גישה",
      auth_type_personal: "אסימון גישה אישי",
      token: "אסימון גישה של Confluence",
      token_explained_start:
        "עליך לספק אסימון גישה לאימות. תוכל ליצור אסימון גישה",
      token_explained_link: "כאן",
      token_desc: "אסימון גישה לאימות",
      pat_token: "אסימון גישה אישי של Confluence",
      pat_token_explained: "אסימון הגישה האישי שלך ב-Confluence.",
      task_explained:
        "לאחר השלמה, תוכן העמוד יהיה זמין להטמעה בסביבות עבודה בבורר המסמכים.",
    },
    manage: {
      documents: "מסמכים",
      "data-connectors": "מחברי נתונים",
      "desktop-only":
        "עריכת הגדרות אלה זמינה רק במחשב שולחני. אנא גש לדף זה משולחן העבודה שלך כדי להמשיך.",
      dismiss: "התעלם",
      editing: "עורך",
    },
    directory: {
      "my-documents": "המסמכים שלי",
      "new-folder": "תיקייה חדשה",
      "search-document": "חפש מסמך",
      "no-documents": "אין מסמכים",
      "move-workspace": "העבר לסביבת עבודה",
      name: "שם",
      "delete-confirmation":
        "האם אתה בטוח שברצונך למחוק קבצים ותיקיות אלה?\nפעולה זו תסיר את הקבצים מהמערכת ותסיר אותם אוטומטית מכל סביבת עבודה קיימת.\nפעולה זו אינה הפיכה.",
      "removing-message":
        "מסיר {{count}} מסמכים ו-{{folderCount}} תיקיות. אנא המתן.",
      "move-success": "{{count}} מסמכים הועברו בהצלחה.",
      date: "תאריך",
      type: "סוג",
      no_docs: "אין מסמכים",
      select_all: "בחר הכל",
      deselect_all: "בטל בחירת הכל",
      remove_selected: "הסר נבחרים",
      costs: "*עלות חד פעמית להטמעות",
      save_embed: "שמור והטמע",
    },
    upload: {
      "processor-offline": "מעבד המסמכים אינו זמין",
      "processor-offline-desc":
        "אין באפשרותנו להעלות את הקבצים שלך כרגע מכיוון שמעבד המסמכים אינו מקוון. אנא נסה שוב מאוחר יותר.",
      "click-upload": "לחץ להעלאה או גרור ושחרר",
      "file-types": "תומך בקבצי טקסט, csv, גיליונות אלקטרוניים, קבצי שמע ועוד!",
      "or-submit-link": "או שלח קישור",
      "placeholder-link": "https://example.com",
      fetching: "מאחזר...",
      "fetch-website": "אחזר אתר אינטרנט",
      "privacy-notice":
        "קבצים אלה יועלו למעבד המסמכים הפועל במופע זה של AnythingLLM. קבצים אלה אינם נשלחים או משותפים עם צד שלישי.",
    },
    pinning: {
      what_pinning: "מהי הצמדת מסמכים?",
      pin_explained_block1:
        "כאשר אתה <b>מצמיד</b> מסמך ב-AnythingLLM, אנו נזריק את כל תוכן המסמך לחלון ההנחיה שלך כדי שמודל השפה שלך יבין אותו במלואו.",
      pin_explained_block2:
        "זה עובד בצורה הטובה ביותר עם <b>מודלים בעלי הקשר רחב</b> או קבצים קטנים שהם קריטיים לבסיס הידע שלו.",
      pin_explained_block3:
        "אם אינך מקבל את התשובות הרצויות מ-AnythingLLM כברירת מחדל, הצמדה היא דרך מצוינת לקבל תשובות איכותיות יותר בלחיצה אחת.",
      accept: "אוקיי, הבנתי",
    },
    watching: {
      what_watching: "מה עושה מעקב אחר מסמך?",
      watch_explained_block1:
        "כאשר אתה <b>עוקב</b> אחר מסמך ב-AnythingLLM, אנו נסנכרן <i>אוטומטית</i> את תוכן המסמך שלך ממקורו המקורי במרווחי זמן קבועים. זה יעדכן אוטומטית את התוכן בכל סביבת עבודה שבה קובץ זה מנוהל.",
      watch_explained_block2:
        "תכונה זו תומכת כיום בתוכן מבוסס-אינטרנט ולא תהיה זמינה עבור מסמכים שהועלו ידנית.",
      watch_explained_block3_start:
        "תוכל לנהל אילו מסמכים נמצאים במעקב מתוך תצוגת ",
      watch_explained_block3_link: "מנהל הקבצים",
      watch_explained_block3_end: " של המנהל.",
      accept: "אוקיי, הבנתי",
    },
  },
  chat_window: {
    welcome: "ברוכים הבאים לסביבת העבודה החדשה שלך.",
    get_started: "כדי להתחיל, או",
    get_started_default: "כדי להתחיל",
    upload: "העלה מסמך",
    or: "או",
    attachments_processing: "קבצים מצורפים בעיבוד. אנא המתן...",
    send_chat: "שלח צ'אט.",
    send_message: "שלח הודעה",
    attach_file: "צרף קובץ לצ'אט זה",
    slash: "הצג את כל פקודות הסלאש הזמינות לצ'אט.",
    agents: "הצג את כל הסוכנים הזמינים שתוכל להשתמש בהם לצ'אט.",
    text_size: "שנה גודל טקסט.",
    microphone: "אמור את ההנחיה שלך.",
    send: "שלח הודעת הנחיה לסביבת העבודה",
    tts_speak_message: "הקרא הודעה (TTS)",
    copy: "העתק",
    regenerate: "צור מחדש",
    regenerate_response: "צור תגובה מחדש",
    good_response: "תגובה טובה",
    more_actions: "פעולות נוספות",
    hide_citations: "הסתר ציטוטים",
    show_citations: "הצג ציטוטים",
    pause_tts_speech_message: "השהה הקראת הודעה (TTS)",
    fork: "פצל (Fork)",
    delete: "מחק",
    save_submit: "שמור ושלח",
    cancel: "בטל",
    edit_prompt: "ערוך הנחיה",
    edit_response: "ערוך תגובה",
    at_agent: "@סוכן",
    default_agent_description: " - סוכן ברירת המחדל עבור סביבת עבודה זו.",
    custom_agents_coming_soon: "סוכנים מותאמים אישית יגיעו בקרוב!",
    slash_reset: "/איפוס",
    preset_reset_description: "נקה את היסטוריית הצ'אט שלך והתחל צ'אט חדש",
    add_new_preset: " הוסף הגדרה קבועה חדשה",
    command: "פקודה",
    your_command: "הפקודה-שלך",
    placeholder_prompt: "זהו התוכן שיוזרק לפני ההנחיה שלך.",
    description: "תיאור",
    placeholder_description: "מגיב עם שיר על מודלי שפה.",
    save: "שמור",
    small: "קטן",
    normal: "רגיל",
    large: "גדול",
    workspace_llm_manager: {
      search: "חפש ספקי LLM",
      loading_workspace_settings: "טוען הגדרות סביבת עבודה...",
      available_models: "מודלים זמינים עבור {{provider}}",
      available_models_description: "בחר מודל לשימוש בסביבת עבודה זו.",
      save: "השתמש במודל זה",
      saving: "מגדיר מודל כברירת מחדל של סביבת העבודה...",
      missing_credentials: "חסרים אישורים לספק זה!",
      missing_credentials_description: "לחץ להגדרת אישורים",
    },
  },
  profile_settings: {
    edit_account: "ערוך חשבון",
    profile_picture: "תמונת פרופיל",
    remove_profile_picture: "הסר תמונת פרופיל",
    username: "שם משתמש",
    username_description:
      "שם המשתמש חייב להכיל רק אותיות קטנות, מספרים, קווים תחתונים ומקפים, ללא רווחים",
    new_password: "סיסמה חדשה",
    password_description: "הסיסמה חייבת להכיל לפחות 8 תווים",
    cancel: "בטל",
    update_account: "עדכן חשבון",
    theme: "העדפת ערכת נושא",
    language: "שפה מועדפת",
    failed_upload: "העלאת תמונת הפרופיל נכשלה: {{error}}",
    upload_success: "תמונת הפרופיל הועלתה.",
    failed_remove: "הסרת תמונת הפרופיל נכשלה: {{error}}",
    profile_updated: "הפרופיל עודכן.",
    failed_update_user: "עדכון המשתמש נכשל: {{error}}",
    account: "חשבון",
    support: "תמיכה",
    signout: "התנתק",
  },
  "keyboard-shortcuts": {
    title: "קיצורי מקלדת",
    shortcuts: {
      settings: "פתח הגדרות",
      workspaceSettings: "פתח הגדרות סביבת עבודה נוכחית",
      home: "עבור לדף הבית",
      workspaces: "נהל סביבות עבודה",
      apiKeys: "הגדרות מפתחות API",
      llmPreferences: "העדפות מודל שפה (LLM)",
      chatSettings: "הגדרות צ'אט",
      help: "הצג עזרה לקיצורי מקלדת",
      showLLMSelector: "הצג בורר מודלי שפה לסביבת עבודה",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "הצלחה!",
        success_description: "הנחיית המערכת שלך פורסמה במרכז הקהילה!",
        success_thank_you: "תודה על השיתוף בקהילה!",
        view_on_hub: "צפה במרכז הקהילה",
        modal_title: "פרסם הנחיית מערכת",
        name_label: "שם",
        name_description: "זהו שם התצוגה של הנחיית המערכת שלך.",
        name_placeholder: "הנחיית המערכת שלי",
        description_label: "תיאור",
        description_description:
          "זהו התיאור של הנחיית המערכת שלך. השתמש בזה כדי לתאר את מטרת ההנחיה.",
        tags_label: "תגיות",
        tags_description:
          "תגיות משמשות לתיוג הנחיית המערכת שלך לחיפוש קל יותר. ניתן להוסיף מספר תגיות. עד 5 תגיות. עד 20 תווים לתגית.",
        tags_placeholder: "הקלד והקש אנטר להוספת תגיות",
        visibility_label: "נראות",
        public_description: "הנחיות מערכת ציבוריות נראות לכולם.",
        private_description: "הנחיות מערכת פרטיות נראות רק לך.",
        publish_button: "פרסם במרכז הקהילה",
        submitting: "מפרסם...",
        submit: "פרסם במרכז הקהילה",
        prompt_label: "הנחיה",
        prompt_description: "זוהי הנחיית המערכת בפועל שתשמש להנחיית מודל השפה.",
        prompt_placeholder: "הזן את הנחיית המערכת שלך כאן...",
      },
      agent_flow: {
        public_description: "זרימות סוכן ציבוריות נראות לכולם.",
        private_description: "זרימות סוכן פרטיות נראות רק לך.",
        success_title: "הצלחה!",
        success_description: "זרימת הסוכן שלך פורסמה במרכז הקהילה!",
        success_thank_you: "תודה על השיתוף בקהילה!",
        view_on_hub: "צפה במרכז הקהילה",
        modal_title: "פרסם זרימת סוכן",
        name_label: "שם",
        name_description: "זהו שם התצוגה של זרימת הסוכן שלך.",
        name_placeholder: "זרימת הסוכן שלי",
        description_label: "תיאור",
        description_description:
          "זהו התיאור של זרימת הסוכן שלך. השתמש בזה כדי לתאר את מטרת הזרימה.",
        tags_label: "תגיות",
        tags_description:
          "תגיות משמשות לתיוג זרימת הסוכן שלך לחיפוש קל יותר. ניתן להוסיף מספר תגיות. עד 5 תגיות. עד 20 תווים לתגית.",
        tags_placeholder: "הקלד והקש אנטר להוספת תגיות",
        visibility_label: "נראות",
        publish_button: "פרסם במרכז הקהילה",
        submitting: "מפרסם...",
        submit: "פרסם במרכז הקהילה",
        privacy_note:
          "זרימות סוכן תמיד מועלות כפרטיות כדי להגן על נתונים רגישים. תוכל לשנות את הנראות במרכז הקהילה לאחר הפרסום. אנא ודא שהזרימה שלך אינה מכילה מידע רגיש או פרטי לפני הפרסום.",
      },
      slash_command: {
        success_title: "הצלחה!",
        success_description: "פקודת הסלאש שלך פורסמה במרכז הקהילה!",
        success_thank_you: "תודה על השיתוף בקהילה!",
        view_on_hub: "צפה במרכז הקהילה",
        modal_title: "פרסם פקודת סלאש",
        name_label: "שם",
        name_description: "זהו שם התצוגה של פקודת הסלאש שלך.",
        name_placeholder: "פקודת הסלאש שלי",
        description_label: "תיאור",
        description_description:
          "זהו התיאור של פקודת הסלאש שלך. השתמש בזה כדי לתאר את מטרת הפקודה.",
        command_label: "פקודה",
        command_description:
          "זוהי פקודת הסלאש שמשתמשים יקלידו כדי להפעיל הגדרה קבועה זו.",
        command_placeholder: "הפקודה-שלי",
        tags_label: "תגיות",
        tags_description:
          "תגיות משמשות לתיוג פקודת הסלאש שלך לחיפוש קל יותר. ניתן להוסיף מספר תגיות. עד 5 תגיות. עד 20 תווים לתגית.",
        tags_placeholder: "הקלד והקש אנטר להוספת תגיות",
        visibility_label: "נראות",
        public_description: "פקודות סלאש ציבוריות נראות לכולם.",
        private_description: "פקודות סלאש פרטיות נראות רק לך.",
        publish_button: "פרסם במרכז הקהילה",
        submitting: "מפרסם...",
        prompt_label: "הנחיה",
        prompt_description: "זוהי ההנחיה שתשמש כאשר פקודת הסלאש תופעל.",
        prompt_placeholder: "הזן את ההנחיה שלך כאן...",
      },
      generic: {
        unauthenticated: {
          title: "נדרש אימות",
          description:
            "עליך להתאמת עם מרכז הקהילה של AnythingLLM לפני פרסום פריטים.",
          button: "התחבר למרכז הקהילה",
        },
      },
    },
  },
  security: {
    title: "אבטחה",
    multiuser: {
      title: "מצב ריבוי משתמשים",
      description:
        "הגדר את המופע שלך לתמיכה בצוות שלך על ידי הפעלת מצב ריבוי משתמשים.",
      enable: {
        "is-enable": "מצב ריבוי משתמשים מופעל",
        enable: "הפעל מצב ריבוי משתמשים",
        description:
          "כברירת מחדל, אתה תהיה המנהל היחיד. כמנהל תצטרך ליצור חשבונות לכל המשתמשים או המנהלים החדשים. אל תאבד את סיסמתך, מכיוון שרק משתמש מנהל יכול לאפס סיסמאות.",
        username: "שם משתמש של חשבון מנהל",
        password: "סיסמת חשבון מנהל",
      },
    },
    password: {
      title: "הגנת סיסמה",
      description:
        "הגן על מופע ה-AnythingLLM שלך באמצעות סיסמה. אם תשכח אותה, אין שיטת שחזור, אז ודא שאתה שומר סיסמה זו.",
      "password-label": "סיסמת מופע",
    },
  },
  home: {
    welcome: "ברוכים הבאים",
    chooseWorkspace: "בחר סביבת עבודה כדי להתחיל לשוחח!",
    notAssigned:
      "אינך מוקצה לכל סביבת עבודה.\nיש ליצור קשר עם המנהל שלך כדי לבקש גישה לסביבת עבודה.",
    goToWorkspace: 'עבור לסביבת עבודה "{{workspace}}"',
  },
};

export default TRANSLATIONS;
