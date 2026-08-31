const TRANSLATIONS = {
  onboarding: {
    home: {
      welcome: "Välkommen",
      getStarted: "Kom igång",
    },
    llm: {
      title: "LLM-inställning",
      description:
        "AnythingLLM fungerar med många LLM-leverantörer. Den här tjänsten hanterar chattningen.",
    },
    userSetup: {
      title: "Användarinställning",
      description: "Konfigurera dina användarinställningar.",
      howManyUsers: "Hur många användare ska använda denna instans?",
      justMe: "Bara jag",
      myTeam: "Mitt team",
      instancePassword: "Instanslösenord",
      setPassword: "Vill du ställa in ett lösenord?",
      passwordReq: "Lösenord måste innehålla minst 8 tecken.",
      passwordWarn:
        "Det är viktigt att spara lösenordet eftersom det inte går att återställa.",
      adminUsername: "Användarnamn för administratörskontot",
      adminPassword: "Lösenord för administratörskontot",
      adminPasswordReq: "Lösenord måste innehålla minst 8 tecken.",
      teamHint:
        "Som standard är du den enda administratören. När introduktionen är klar kan du skapa och bjuda in andra som användare eller administratörer. Tappa inte bort lösenordet, eftersom endast administratörer kan återställa lösenord.",
    },
    data: {
      title: "Datahantering och integritet",
      description:
        "Vi arbetar för insyn och kontroll över dina personuppgifter.",
      settingsHint:
        "Du kan när som helst ändra de här inställningarna i inställningarna.",
    },
    survey: {
      title: "Välkommen till AnythingLLM",
      description:
        "Hjälp oss att utveckla AnythingLLM för dina behov. Valfritt.",
      email: "Vad är din e-postadress?",
      useCase: "Vad ska du använda AnythingLLM till?",
      useCaseWork: "Arbete",
      useCasePersonal: "Personligt bruk",
      useCaseOther: "Annat",
      comment: "Hur fick du höra talas om AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube med mera – berätta gärna hur du hittade oss!",
      skip: "Hoppa över enkäten",
      thankYou: "Tack för din återkoppling!",
    },
  },
  common: {
    "workspaces-name": "Arbetsytans namn",
    selection: "Välj modell",
    saving: "Sparar …",
    save: "Spara ändringar",
    previous: "Föregående sida",
    next: "Nästa sida",
    optional: "Valfritt",
    yes: "Ja",
    no: "Nej",
    on: "På",
    none: "Ingen",
    stopped: "Stoppad",
    search: "Sök",
    username_requirements:
      "Användarnamnet måste bestå av 2–64 tecken, börja med en liten bokstav och endast innehålla små bokstäver, siffror, understreck, bindestreck och punkter.",
    loading: "Läser in",
    refresh: "Uppdatera",
  },
  home: {
    welcome: "Välkommen",
    chooseWorkspace: "Välj en arbetsyta för att börja chatta!",
    notAssigned:
      "Du är inte tilldelad någon arbetsyta just nu.\nKontakta administratören för att begära åtkomst till en arbetsyta.",
    goToWorkspace: 'Gå till "{{workspace}}"',
  },
  settings: {
    title: "Instansinställningar",
    invites: "Inbjudningar",
    users: "Användare",
    workspaces: "Arbetsytor",
    "workspace-chats": "Arbetsytechattar",
    customization: "Anpassning",
    interface: "Gränssnittsinställningar",
    branding: "Varumärke och vitmärkning",
    chat: "Chatt",
    "api-keys": "Utvecklar-API",
    llm: "LLM",
    transcription: "Transkribering",
    embedder: "Inbäddningsmodell",
    "text-splitting": "Textdelning och segmentering",
    "image-generation": "Bildgenerering",
    "voice-speech": "Röst och tal",
    "vector-database": "Vektordatabas",
    embeds: "Inbäddad chatt",
    security: "Säkerhet",
    "event-logs": "Händelseloggar",
    "scheduled-jobs": "Schemalagda jobb",
    privacy: "Integritet och data",
    "ai-providers": "AI-leverantörer",
    "agent-skills": "Agentfärdigheter",
    "model-router": "Modellrouter",
    "community-hub": {
      title: "Community Hub",
      trending: "Utforska populärt",
      "your-account": "Ditt konto",
      "import-item": "Importera objekt",
    },
    admin: "Administration",
    tools: "Verktyg",
    "system-prompt-variables": "Variabler i systemprompt",
    "experimental-features": "Experimentella funktioner",
    contact: "Kontakta supporten",
    "browser-extension": "Webbläsartillägg",
    "mobile-app": "AnythingLLM Mobile",
    channels: "Kanaler",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Välkommen",
      "placeholder-username": "Användarnamn",
      "placeholder-password": "Lösenord",
      login: "Logga in",
      validating: "Validerar …",
      "forgot-pass": "Glömt lösenordet",
      reset: "Återställ",
    },
    "sign-in":
      "Ange användarnamn och lösenord för att komma åt din {{appName}}-instans.",
    "password-reset": {
      title: "Återställ lösenord",
      description: "Ange uppgifterna nedan för att återställa lösenordet.",
      "recovery-codes": "Återställningskoder",
      "back-to-login": "Tillbaka till inloggning",
    },
  },
  "main-page": {
    greeting: "Hur kan jag hjälpa dig i dag?",
    quickActions: {
      createAgent: "Skapa en agent",
      editWorkspace: "Redigera arbetsyta",
      uploadDocument: "Ladda upp ett dokument",
    },
  },
  "new-workspace": {
    title: "Ny arbetsyta",
    placeholder: "Min arbetsyta",
  },
  "workspaces—settings": {
    general: "Allmänna inställningar",
    chat: "Chattinställningar",
    vector: "Vektordatabas",
    members: "Medlemmar",
    agent: "Agentkonfiguration",
  },
  general: {
    vector: {
      title: "Antal vektorer",
      description: "Totalt antal vektorer i vektordatabasen.",
    },
    names: {
      description: "Detta ändrar endast arbetsytans visningsnamn.",
    },
    message: {
      title: "Föreslagna chattmeddelanden",
      description:
        "Anpassa de meddelanden som föreslås för arbetsytans användare.",
      add: "Lägg till meddelande",
      save: "Spara meddelanden",
      heading: "Förklara för mig",
      body: "fördelarna med AnythingLLM",
    },
    delete: {
      title: "Ta bort arbetsyta",
      description:
        "Ta bort den här arbetsytan och alla dess data. Arbetsytan tas då bort för alla användare.",
      delete: "Ta bort arbetsyta",
      deleting: "Tar bort arbetsyta …",
      "confirm-start": "Du håller på att ta bort hela din",
      "confirm-end":
        "arbetsyta. Detta tar bort alla vektorinbäddningar i vektordatabasen.\n\nDe ursprungliga källfilerna lämnas orörda. Åtgärden går inte att ångra.",
    },
  },
  chat: {
    llm: {
      title: "LLM-leverantör för arbetsytan",
      description:
        "Den specifika LLM-leverantör och modell som används för denna arbetsyta. Som standard används systemets LLM-leverantör och inställningar.",
      search: "Sök bland alla LLM-leverantörer",
    },
    model: {
      title: "Chattmodell för arbetsytan",
      description:
        "Den specifika chattmodell som används för arbetsytan. Om fältet lämnas tomt används systemets LLM-inställning.",
    },
    mode: {
      title: "Chattläge",
      automatic: {
        title: "Agent",
        description:
          "använder automatiskt verktyg om modellen och leverantören stöder inbyggda verktygsanrop.<br />Om inbyggda verktyg inte stöds behöver du använda kommandot @agent för att använda verktyg.",
      },
      chat: {
        title: "Chat",
        description:
          "ger svar med LLM:ens allmänna kunskap <b>och</b> det dokumentkontext som hittas.<br />Du behöver använda kommandot @agent för att använda verktyg.",
      },
      query: {
        title: "Fråga",
        description:
          "ger svar <b>endast</b> om dokumentkontext hittas.<br />Du behöver använda kommandot @agent för att använda verktyg.",
      },
    },
    history: {
      title: "Chatthistorik",
      "desc-start":
        "Antalet tidigare chattar som inkluderas i svarets korttidsminne.",
      recommend: "Rekommenderat: 20. ",
    },
    prompt: {
      title: "Systemprompt",
      description:
        "Prompten som används i denna arbetsyta. Ange kontext och instruktioner för att AI:n ska kunna skapa ett svar. Formulera prompten noggrant för att AI:n ska kunna ge ett relevant och korrekt svar.",
      history: {
        title: "Historik för systemprompt",
        clearAll: "Rensa allt",
        noHistory: "Ingen historik för systemprompt finns",
        restore: "Återställ",
        delete: "Ta bort",
        publish: "Publicera på Community Hub",
        deleteConfirm:
          "Är du säker på att du vill ta bort detta historikobjekt?",
        clearAllConfirm:
          "Är du säker på att du vill rensa all historik? Åtgärden går inte att ångra.",
        expand: "Expandera",
      },
    },
    refusal: {
      title: "Avvisningssvar i frågeläge",
      "desc-start": "I",
      query: "fråge",
      "desc-end":
        "läge kanske du vill returnera ett anpassat avvisningssvar när ingen kontext hittas.",
      "tooltip-title": "Varför visas detta?",
      "tooltip-description":
        "Du är i frågeläge, som endast använder information från dina dokument. Byt till chattläge för mer flexibla samtal, eller klicka här för att läsa mer om chattlägen i dokumentationen.",
    },
    temperature: {
      title: "LLM-temperatur",
      "desc-end":
        "Ju högre värde, desto mer kreativa blir svaren. För vissa modeller kan ett alltför högt värde ge osammanhängande svar.",
    },
  },
  "vector-workspace": {
    identifier: "Identifierare för vektordatabas",
    snippets: {
      title: "Maximalt antal kontextutdrag",
      description:
        "Den här inställningen styr det högsta antal kontextutdrag som skickas till LLM:en per chatt eller fråga.",
      recommend: "Rekommenderat: 4",
    },
    doc: {
      title: "Tröskelvärde för dokumentlikhet",
      description:
        "Lägsta likhetspoäng som krävs för att en källa ska anses höra ihop med chatten. Ju högre värde, desto mer lik chatten måste källan vara.",
      zero: "Ingen begränsning",
      low: "Låg (likhetspoäng ≥ 0,25)",
      medium: "Medel (likhetspoäng ≥ 0,50)",
      high: "Hög (likhetspoäng ≥ 0,75)",
    },
    reset: {
      reset: "Återställ vektordatabas",
      resetting: "Rensar vektorer …",
      confirm:
        "Du håller på att återställa arbetsytans vektordatabas. Detta tar bort alla aktuella vektorinbäddningar.\n\nDe ursprungliga källfilerna lämnas orörda. Åtgärden går inte att ångra.",
      error: "Det gick inte att återställa arbetsytans vektordatabas!",
      success: "Arbetsytans vektordatabas har återställts!",
    },
  },
  agent: {
    "performance-warning":
      "Prestandan hos LLM:er utan uttryckligt stöd för verktygsanrop beror starkt på modellens förmåga och noggrannhet. Vissa funktioner kan vara begränsade eller inte fungera.",
    provider: {
      title: "LLM-leverantör för arbetsytans agent",
      description:
        "Den specifika LLM-leverantör och modell som används av arbetsytans @agent-agent.",
    },
    mode: {
      chat: {
        title: "Chattmodell för arbetsytans agent",
        description:
          "Den specifika chattmodell som används av arbetsytans @agent-agent.",
      },
      title: "Modell för arbetsytans agent",
      description:
        "Den specifika LLM-modell som används av arbetsytans @agent-agent.",
      wait: "-- väntar på modeller --",
    },
    skill: {
      rag: {
        title: "RAG och långtidsminne",
        description:
          "Låt agenten använda dina lokala dokument för att besvara en fråga eller be agenten att ”komma ihåg” innehåll för hämtning från långtidsminnet.",
      },
      view: {
        title: "Visa och sammanfatta dokument",
        description:
          "Låt agenten lista och sammanfatta innehållet i arbetsytans för närvarande inbäddade filer.",
      },
      scrape: {
        title: "Hämta innehåll från webbplatser",
        description: "Låt agenten besöka webbplatser och hämta deras innehåll.",
      },
      generate: {
        title: "Skapa diagram",
        description:
          "Låt standardagenten skapa olika typer av diagram från data som tillhandahålls eller anges i chatten.",
      },
      web: {
        title: "Webbsökning",
        description:
          "Låt agenten söka på webben för att besvara dina frågor genom anslutning till en webbsökleverantör (SERP).",
      },
      sql: {
        title: "SQL-anslutning",
        description:
          "Låt agenten använda SQL för att besvara dina frågor genom anslutning till olika SQL-databasleverantörer.",
      },
      scheduledJob: {
        title: "Skapa schemalagda jobb",
        description:
          "Låt agenten skapa återkommande schemalagda jobb från chatten (till exempel ”sammanfatta min inkorg och mejla mig varje vardag klockan 9”). Endast tillgängligt i enanvändarläge.",
      },
      filesystem: {
        title: "Filsystemåtkomst",
        description:
          "Låt agenten läsa, skriva, söka och hantera filer i en angiven katalog. Stöder filredigering, katalognavigering och innehållssökning.",
        learnMore: "Läs mer om hur denna färdighet används",
        configuration: "Konfiguration",
        readActions: "Läsåtgärder",
        writeActions: "Skrivåtgärder",
        warning:
          "Filsystemåtkomst kan vara farlig eftersom den kan ändra eller ta bort filer. Läs <a>dokumentationen</a> innan du aktiverar den.",
        skills: {
          "read-text-file": {
            title: "Läs fil",
            description:
              "Läs innehållet i filer (text, kod, PDF, bilder med mera)",
          },
          "read-multiple-files": {
            title: "Läs flera filer",
            description: "Läs flera filer samtidigt",
          },
          "list-directory": {
            title: "Lista katalog",
            description: "Lista filer och kataloger i en mapp",
          },
          "search-files": {
            title: "Sök filer",
            description: "Sök efter filer efter namn eller innehåll",
          },
          "get-file-info": {
            title: "Hämta filinformation",
            description: "Hämta detaljerade metadata om filer",
          },
          "write-text-file": {
            title: "Skriv textfil",
            description:
              "Skapa nya textfiler eller skriv över befintliga textfiler",
          },
          "edit-file": {
            title: "Redigera fil",
            description: "Gör radbaserade ändringar i textfiler",
          },
          "create-directory": {
            title: "Skapa katalog",
            description: "Skapa nya kataloger",
          },
          "copy-file": {
            title: "Kopiera fil",
            description: "Kopiera filer och kataloger",
          },
          "move-file": {
            title: "Flytta eller byt namn på fil",
            description: "Flytta eller byt namn på filer och kataloger",
          },
        },
      },
      createFiles: {
        title: "Skapa dokument",
        description:
          "Låt agenten skapa binära dokumentformat som PowerPoint-presentationer, Excel-kalkylblad, Word-dokument och PDF:er. Filer kan hämtas direkt från chattfönstret.",
        configuration: "Tillgängliga dokumenttyper",
        skills: {
          "create-text-file": {
            title: "Textfiler",
            description:
              "Skapa textfiler med valfritt innehåll och filnamnstillägg (.txt, .md, .json, .csv med mera)",
          },
          "create-pptx": {
            title: "PowerPoint-presentationer",
            description:
              "Skapa nya PowerPoint-presentationer med bilder, rubriker och punktlistor",
          },
          "create-pdf": {
            title: "PDF-dokument",
            description:
              "Skapa PDF-dokument från Markdown eller oformaterad text med grundläggande formatering",
          },
          "create-xlsx": {
            title: "Excel-kalkylblad",
            description:
              "Skapa Excel-dokument för tabelldata med blad och formatering",
          },
          "create-docx": {
            title: "Word-dokument",
            description: "Skapa Word-dokument med grundläggande formatering",
          },
        },
      },
      gmail: {
        title: "GMail",
        description:
          "Låt agenten interagera med Gmail – söka i e-post, läsa trådar, skapa utkast, skicka e-post och hantera inkorgen. <a>Läs dokumentationen</a>.",
        multiUserWarning:
          "Gmail-integreringen är av säkerhetsskäl inte tillgänglig i fleranvändarläge. Stäng av fleranvändarläge för att använda funktionen.",
        configuration: "Gmail-konfiguration",
        deploymentId: "Distributions-id",
        deploymentIdHelp:
          "Distributions-id:t från din Google Apps Script-webbapp",
        apiKey: "API-nyckel",
        apiKeyHelp:
          "API-nyckeln som du konfigurerade i din Google Apps Script-distribution",
        configurationRequired:
          "Konfigurera distributions-id och API-nyckel för att aktivera Gmail-färdigheter.",
        configured: "Konfigurerad",
        searchSkills: "Sök färdigheter …",
        noSkillsFound: "Inga färdigheter matchar sökningen.",
        categories: {
          search: {
            title: "Sök och läs e-post",
            description: "Sök och läs e-post i din Gmail-inkorg",
          },
          drafts: {
            title: "E-postutkast",
            description: "Skapa, redigera och hantera e-postutkast",
          },
          send: {
            title: "Skicka och svara på e-post",
            description: "Skicka e-post och svara direkt på trådar",
          },
          threads: {
            title: "Hantera e-posttrådar",
            description:
              "Hantera e-posttrådar – markera som lästa/olästa, arkivera och kasta",
          },
          account: {
            title: "Integreringsstatistik",
            description: "Visa postlådestatistik och kontoinformation",
          },
        },
        skills: {
          getInbox: {
            title: "Hämta inkorg",
            description:
              "Ett förenklat sätt att hämta inkorgens e-post från Gmail",
          },
          search: {
            title: "Sök e-post",
            description: "Sök i e-post med Gmails frågesyntax",
          },
          readThread: {
            title: "Läs tråd",
            description: "Läs en hel e-posttråd med dess id",
          },
          createDraft: {
            title: "Skapa utkast",
            description: "Skapa ett nytt e-postutkast",
          },
          createDraftReply: {
            title: "Skapa svarsutkast",
            description: "Skapa ett svarsutkast till en befintlig tråd",
          },
          updateDraft: {
            title: "Uppdatera utkast",
            description: "Uppdatera ett befintligt e-postutkast",
          },
          getDraft: {
            title: "Hämta utkast",
            description: "Hämta ett specifikt utkast med dess id",
          },
          listDrafts: {
            title: "Lista utkast",
            description: "Lista alla e-postutkast",
          },
          deleteDraft: {
            title: "Ta bort utkast",
            description: "Ta bort ett e-postutkast",
          },
          sendDraft: {
            title: "Skicka utkast",
            description: "Skicka ett befintligt e-postutkast",
          },
          sendEmail: {
            title: "Skicka e-post",
            description: "Skicka ett e-postmeddelande direkt",
          },
          replyToThread: {
            title: "Svara på tråd",
            description: "Svara direkt på en e-posttråd",
          },
          markRead: {
            title: "Markera som läst",
            description: "Markera en tråd som läst",
          },
          markUnread: {
            title: "Markera som oläst",
            description: "Markera en tråd som oläst",
          },
          moveToTrash: {
            title: "Flytta till papperskorgen",
            description: "Flytta en tråd till papperskorgen",
          },
          moveToArchive: {
            title: "Arkivera",
            description: "Arkivera en tråd",
          },
          moveToInbox: {
            title: "Flytta till inkorgen",
            description: "Flytta en tråd till inkorgen",
          },
          getMailboxStats: {
            title: "Postlådestatistik",
            description: "Hämta antal olästa och postlådestatistik",
          },
        },
      },
      googleCalendar: {
        title: "Google Calendar",
        description:
          "Låt agenten interagera med Google Kalender – visa kalendrar, hämta händelser, skapa och uppdatera händelser samt hantera OSA-svar. <a>Läs dokumentationen</a>.",
        multiUserWarning:
          "Google Kalender-integreringen är av säkerhetsskäl inte tillgänglig i fleranvändarläge. Stäng av fleranvändarläge för att använda funktionen.",
        configuration: "Google Kalender-konfiguration",
        deploymentId: "Distributions-id",
        deploymentIdHelp:
          "Distributions-id:t från din Google Apps Script-webbapp",
        apiKey: "API-nyckel",
        apiKeyHelp:
          "API-nyckeln som du konfigurerade i din Google Apps Script-distribution",
        configurationRequired:
          "Konfigurera distributions-id och API-nyckel för att aktivera Google Kalender-färdigheter.",
        configured: "Konfigurerad",
        searchSkills: "Sök färdigheter …",
        noSkillsFound: "Inga färdigheter matchar sökningen.",
        categories: {
          calendars: {
            title: "Kalendrar",
            description: "Visa och hantera dina Google-kalendrar",
          },
          readEvents: {
            title: "Läs händelser",
            description: "Visa och sök kalenderhändelser",
          },
          writeEvents: {
            title: "Skapa och uppdatera händelser",
            description: "Skapa nya händelser och ändra befintliga",
          },
          rsvp: {
            title: "Hantera OSA",
            description: "Hantera din svarsstatus för händelser",
          },
        },
        skills: {
          listCalendars: {
            title: "Lista kalendrar",
            description:
              "Lista alla kalendrar som du äger eller prenumererar på",
          },
          getCalendar: {
            title: "Hämta kalenderuppgifter",
            description: "Hämta detaljerad information om en viss kalender",
          },
          getEvent: {
            title: "Hämta händelse",
            description: "Hämta detaljerad information om en viss händelse",
          },
          getEventsForDay: {
            title: "Hämta händelser för dag",
            description:
              "Hämta alla händelser som är planerade för en viss dag",
          },
          getEvents: {
            title: "Hämta händelser (datumintervall)",
            description: "Hämta händelser inom ett anpassat datumintervall",
          },
          getUpcomingEvents: {
            title: "Hämta kommande händelser",
            description:
              "Hämta händelser för i dag, denna vecka eller denna månad med enkla nyckelord",
          },
          quickAdd: {
            title: "Lägg snabbt till händelse",
            description:
              "Skapa en händelse från naturligt språk (till exempel ”Möte i morgon klockan 15”)",
          },
          createEvent: {
            title: "Skapa händelse",
            description:
              "Skapa en ny händelse med full kontroll över alla egenskaper",
          },
          updateEvent: {
            title: "Uppdatera händelse",
            description: "Uppdatera en befintlig kalenderhändelse",
          },
          setMyStatus: {
            title: "Ange OSA-status",
            description:
              "Acceptera, avböj eller acceptera preliminärt en händelse",
          },
        },
      },
      outlook: {
        title: "Outlook",
        description:
          "Låt agenten interagera med Microsoft Outlook – söka i e-post, läsa trådar, skapa utkast, skicka e-post och hantera inkorgen via Microsoft Graph API. <a>Läs dokumentationen</a>.",
        multiUserWarning:
          "Outlook-integreringen är av säkerhetsskäl inte tillgänglig i fleranvändarläge. Stäng av fleranvändarläge för att använda funktionen.",
        configuration: "Outlook-konfiguration",
        authType: "Kontotyp",
        authTypeHelp:
          "Välj vilka typer av Microsoft-konton som får autentisera. ”Alla konton” stöder både personliga konton och arbets- eller skolkonto. ”Endast personliga” begränsar till personliga Microsoft-konton. ”Endast organisation” begränsar till arbets- eller skolkonton från en specifik Azure AD-tenant.",
        authTypeCommon: "Alla konton (personliga och arbets-/skolkonton)",
        authTypeConsumers: "Endast personliga Microsoft-konton",
        authTypeOrganization: "Endast organisationskonton (kräver tenant-id)",
        clientId: "Program-id (klient-id)",
        clientIdHelp:
          "Program-id:t (klient-id:t) från din Azure AD-appregistrering",
        tenantId: "Katalog-id (tenant-id)",
        tenantIdHelp:
          "Katalog-id:t (tenant-id:t) från din Azure AD-appregistrering. Krävs endast för autentisering med enbart organisationskonton.",
        clientSecret: "Klienthemlighet",
        clientSecretHelp:
          "Värdet för klienthemligheten från din Azure AD-appregistrering",
        configurationRequired:
          "Konfigurera klient-id och klienthemlighet för att aktivera Outlook-färdigheter.",
        authRequired:
          "Spara först dina autentiseringsuppgifter och autentisera sedan med Microsoft för att slutföra konfigurationen.",
        authenticateWithMicrosoft: "Autentisera med Microsoft",
        authenticated: "Autentisering med Microsoft Outlook lyckades.",
        revokeAccess: "Återkalla åtkomst",
        configured: "Konfigurerad",
        searchSkills: "Sök färdigheter …",
        noSkillsFound: "Inga färdigheter matchar sökningen.",
        categories: {
          search: {
            title: "Sök och läs e-post",
            description: "Sök och läs e-post i din Outlook-inkorg",
          },
          drafts: {
            title: "E-postutkast",
            description: "Skapa, redigera och hantera e-postutkast",
          },
          send: {
            title: "Skicka e-post",
            description: "Skicka ny e-post eller svara direkt på meddelanden",
          },
          account: {
            title: "Integreringsstatistik",
            description: "Visa postlådestatistik och kontoinformation",
          },
        },
        skills: {
          getInbox: {
            title: "Hämta inkorg",
            description: "Hämta nylig e-post från din Outlook-inkorg",
          },
          search: {
            title: "Sök e-post",
            description: "Sök i e-post med Microsoft Search-syntax",
          },
          readThread: {
            title: "Läs konversation",
            description: "Läs en hel e-postkonversation",
          },
          createDraft: {
            title: "Skapa utkast",
            description:
              "Skapa ett nytt e-postutkast eller svarsutkast till ett befintligt meddelande",
          },
          updateDraft: {
            title: "Uppdatera utkast",
            description: "Uppdatera ett befintligt e-postutkast",
          },
          listDrafts: {
            title: "Lista utkast",
            description: "Lista alla e-postutkast",
          },
          deleteDraft: {
            title: "Ta bort utkast",
            description: "Ta bort ett e-postutkast",
          },
          sendDraft: {
            title: "Skicka utkast",
            description: "Skicka ett befintligt e-postutkast",
          },
          sendEmail: {
            title: "Skicka e-post",
            description:
              "Skicka ny e-post eller svara direkt på ett befintligt meddelande",
          },
          getMailboxStats: {
            title: "Postlådestatistik",
            description: "Hämta antal i mappar och postlådestatistik",
          },
        },
      },
      default_skill:
        "Som standard är denna färdighet aktiverad, men du kan stänga av den om du inte vill att den ska vara tillgänglig för agenten.",
    },
    mcp: {
      title: "MCP-servrar",
      "loading-from-config": "Läser in MCP-servrar från konfigurationsfil",
      "learn-more": "Läs mer om MCP-servrar.",
      "no-servers-found": "Inga MCP-servrar hittades",
      "tool-warning":
        "För bästa prestanda bör du stänga av oönskade verktyg för att spara kontext.",
      "tools-enabled": "verktyg aktiverade",
      "stop-server": "Stoppa MCP-server",
      "start-server": "Starta MCP-server",
      "delete-server": "Ta bort MCP-server",
      "tool-count-warning":
        "Den här MCP-servern har <b>{{count}} verktyg aktiverade</b>, vilket förbrukar kontext i varje chatt.<br />Överväg att stänga av oönskade verktyg för att spara kontext.",
      "startup-command": "Startkommando",
      command: "Kommando",
      arguments: "Argument",
      "not-running-warning":
        "Den här MCP-servern körs inte – den kan vara stoppad eller ha råkat ut för ett fel vid start.",
      "tool-call-arguments": "Argument för verktygsanrop",
    },
    settings: {
      title: "Inställningar för agentfärdigheter",
      "max-tool-calls": {
        title: "Högsta antal verktygsanrop per svar",
        description:
          "Högsta antal verktyg som en agent kan kedja för att skapa ett enda svar. Detta förhindrar skenande verktygsanrop och oändliga slingor.",
      },
      "intelligent-skill-selection": {
        title: "Intelligent val av färdigheter",
        description:
          "Aktivera obegränsat antal verktyg och minska tokenanvändningen med upp till 80 % per fråga – AnythingLLM väljer automatiskt rätt färdigheter för varje prompt.",
        "max-tools": {
          title: "Högsta antal verktyg",
          description:
            "Högsta antal verktyg att välja för varje fråga. Högre värden passar bättre för modeller med större kontext.",
        },
      },
      "clarifying-questions": {
        title: "Låt agenten ställa förtydligande frågor",
        "beta-badge": "BETA",
        description:
          "När funktionen är aktiverad kan agenter pausa för att ställa korta förtydligande frågor om prompten är tvetydig.",
        "max-per-turn": {
          title: "Högsta antal frågor per tur",
          description:
            "Hur många förtydligande frågor agenten får ställa i en enda omgång.",
        },
      },
    },
  },
  recorded: {
    title: "Arbetsytechattar",
    description:
      "Detta är alla sparade chattar och meddelanden som har skickats av användare, ordnade efter skapandedatum.",
    export: "Exportera",
    table: {
      id: "ID",
      by: "Skickat av",
      workspace: "Arbetsyta",
      prompt: "Prompt",
      response: "Svar",
      at: "Skickat den",
    },
  },
  customization: {
    interface: {
      title: "Gränssnittsinställningar",
      description: "Ange dina gränssnittsinställningar för AnythingLLM.",
    },
    branding: {
      title: "Varumärke och vitmärkning",
      description: "Vitmärka din AnythingLLM-instans med anpassad profilering.",
    },
    chat: {
      title: "Chatt",
      description: "Ange dina chattinställningar för AnythingLLM.",
      auto_submit: {
        title: "Skicka röstinmatning automatiskt",
        description: "Skicka röstinmatning automatiskt efter en stunds tystnad",
      },
      auto_speak: {
        title: "Läs upp svar automatiskt",
        description: "Läs automatiskt upp svar från AI:n",
      },
      spellcheck: {
        title: "Aktivera stavningskontroll",
        description:
          "Aktivera eller inaktivera stavningskontroll i chattens inmatningsfält",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Välj önskat färgtema för programmet.",
      },
      "show-scrollbar": {
        title: "Visa rullningslist",
        description:
          "Aktivera eller inaktivera rullningslisten i chattfönstret.",
      },
      "disable-auto-scroll": {
        title: "Inaktivera automatisk rullning",
        description:
          "Inaktivera automatisk rullning längst ned i chatten när nya meddelanden tas emot.",
      },
      "support-email": {
        title: "E-postadress för support",
        description:
          "Ange den e-postadress för support som användare kan nå när de behöver hjälp.",
      },
      "app-name": {
        title: "Namn",
        description:
          "Ange ett namn som visas på inloggningssidan för alla användare.",
      },
      "display-language": {
        title: "Visningsspråk",
        description:
          "Välj det språk som AnythingLLM:s gränssnitt ska visas på när översättningar finns tillgängliga.",
      },
      logo: {
        title: "Varumärkeslogotyp",
        description: "Ladda upp en egen logotyp som visas på alla sidor.",
        add: "Lägg till egen logotyp",
        recommended: "Rekommenderad storlek: 800 × 200",
        remove: "Ta bort",
        replace: "Ersätt",
      },
      "browser-appearance": {
        title: "Webbläsarutseende",
        description:
          "Anpassa webbläsarflikens utseende och rubrik när appen är öppen.",
        tab: {
          title: "Rubrik",
          description:
            "Ange en egen flikrubrik när appen är öppen i en webbläsare.",
        },
        favicon: {
          title: "Favicon",
          description: "Använd en egen favicon för webbläsarfliken.",
        },
      },
      "sidebar-footer": {
        title: "Objekt i sidofältets sidfot",
        description: "Anpassa objekten i sidfoten längst ned i sidofältet.",
        icon: "Ikon",
        link: "Länk",
      },
      "render-html": {
        title: "Rendera HTML i chatten",
        description:
          "Rendera HTML-svar i assistentens svar.\nDet kan ge avsevärt bättre återgivning, men kan också medföra säkerhetsrisker.",
      },
    },
  },
  api: {
    title: "API-nycklar",
    description:
      "API-nycklar ger innehavaren programmatisk åtkomst till och möjlighet att hantera denna AnythingLLM-instans.",
    link: "Läs API-dokumentationen",
    generate: "Skapa ny API-nyckel",
    empty: "Inga API-nycklar hittades",
    actions: "Åtgärder",
    messages: {
      error: "Fel: {{error}}",
    },
    modal: {
      title: "Skapa ny API-nyckel",
      cancel: "Avbryt",
      close: "Stäng",
      create: "Skapa API-nyckel",
      helper:
        "När API-nyckeln har skapats kan den användas för att programmässigt komma åt och konfigurera denna AnythingLLM-instans.",
      name: {
        label: "Namn",
        placeholder: "Produktionsintegrering",
        helper:
          "Valfritt. Använd ett beskrivande namn så att du kan identifiera nyckeln senare.",
      },
    },
    row: {
      copy: "Kopiera API-nyckel",
      copied: "Kopierad",
      unnamed: "--",
      deleteConfirm:
        "Är du säker på att du vill inaktivera denna API-nyckel?\nEfter det kan den inte längre användas.\n\nÅtgärden går inte att ångra.",
    },
    table: {
      name: "Namn",
      key: "API-nyckel",
      by: "Skapad av",
      created: "Skapad",
    },
  },
  llm: {
    title: "LLM-inställning",
    description:
      "Här finns autentiseringsuppgifter och inställningar för din valda LLM-leverantör för chatt och inbäddning. Det är viktigt att nycklarna är aktuella och korrekta, annars fungerar inte AnythingLLM som det ska.",
    provider: "LLM-leverantör",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure-tjänstslutpunkt",
        api_key: "API-nyckel",
        chat_deployment_name: "Namn på chattdistribution",
        chat_model_token_limit: "Tokengräns för chattmodell",
        model_type: "Modelltyp",
        model_type_tooltip:
          "Om distributionen använder en resonemangsmodell (o1, o1-mini, o3-mini med flera), ställ in detta till ”Resonemang”. Annars kan chattförfrågningarna misslyckas.",
        default: "Standard",
        reasoning: "Resonemang",
      },
    },
  },
  "model-router": {
    title: "Modellroutrar",
    description:
      "Med modellroutrar kan du ange regler som automatiskt styr chattmeddelanden till olika LLM-leverantörer och modeller utifrån villkor.",
    table: {
      name: "Namn",
      fallback: "Reservval",
      rules: "Regler",
      workspaces: "Arbetsytor",
    },
    "no-routers": "Inga modellroutrar ännu",
    "empty-description":
      "Inga modellroutrar har konfigurerats ännu. Skapa en för att komma igång.",
    "new-router-button": "Ny router",
    "delete-confirm":
      'Är du säker på att du vill ta bort routern "{{name}}"?\nDetta tar bort alla dess regler och kopplar loss alla arbetsytor som använder den.\n\nÅtgärden går inte att ångra.',
    "toast-deleted": "Router borttagen",
    "toast-delete-failed": "Det gick inte att ta bort routern: {{error}}",
    "new-router": {
      title: "Skapa ny modellrouter",
      name: "Namn",
      "name-placeholder": "t.ex. Kostnadsoptimering",
      description: "Beskrivning",
      "description-placeholder": "Valfri beskrivning",
      "fallback-label": "Primär leverantör och modell",
      "fallback-description":
        "Används när ingen routningsregel matchar. Används även för att utvärdera LLM-klassificerade regler.",
      "cooldown-label": "Väntetid för cache (sekunder)",
      "cooldown-help":
        "Hur länge ett routningsbeslut lagras i cache innan reglerna utvärderas igen. Ange 0 för att stänga av cachelagring.",
      "name-required": "Namn krävs.",
      "fallback-required": "Primär leverantör och modell krävs.",
      cancel: "Avbryt",
      create: "Skapa router",
    },
    "edit-router": {
      "back-to-routers": "Tillbaka till modellroutrar",
      title: "Redigera router: {{name}}",
      save: "Spara ändringar",
      "toast-update-failed": "Det gick inte att uppdatera routern",
    },
    rules: {
      title: "Routningsregler",
      "title-with-name": "Routerregler: {{name}}",
      description:
        "Ange regler som avgör när och hur chattmeddelanden går till vissa leverantörer och modeller.",
      "add-rule": "Lägg till regel",
      "delete-confirm": 'Ta bort regeln "{{title}}"?',
      "toast-delete-failed": "Det gick inte att ta bort regeln",
      "toast-reorder-failed": "Det gick inte att ordna om reglerna",
      "no-rules": "Inga regler ännu",
      "empty-description":
        "Lägg till en regel för att börja styra chattmeddelanden till vissa leverantörer och modeller.",
      "new-rule-button": "Ny regel",
      "calculated-section-label":
        "Beräknade regler – utvärderas först i prioritetsordning",
      "llm-section-label":
        "LLM-regler – utvärderas som en grupp om ingen beräknad regel matchade",
      "llm-rule-body":
        'Matcha <desc>"{{description}}"</desc> och dirigera sedan till <route>{{route}}</route>',
      "calculated-no-conditions":
        "Inga villkor – dirigera till <route>{{route}}</route>",
      "calculated-single-condition":
        'Om <prop>{{property}}</prop> {{comparator}} <val>"{{value}}"</val>, dirigera till <route>{{route}}</route>',
      "calculated-multi-condition":
        "Om {{quantifier}} av <cond>{{conditions}}</cond>, dirigera till <route>{{route}}</route>",
      "comparator-contains": "innehåller",
      "comparator-matches": "matchar",
      "comparator-between": "ligger mellan",
      "badge-llm": "LLM",
      "badge-calculated": "Beräknad",
      "aria-drag-to-reorder": "Dra för att ändra ordning",
      "aria-edit-rule": "Redigera regel",
      "aria-delete-rule": "Ta bort regel",
      "quantifier-any": "NÅGOT",
      "quantifier-all": "ALLA",
    },
    "rule-form": {
      "title-label": "Rubrik",
      "rule-type": "Regeltyp",
      "property-label": "Egenskap",
      "property-select": "Välj",
      "comparator-label": "Jämförelseoperator",
      "comparator-select": "Välj",
      "value-label": "Värde",
      "add-condition": "Lägg till villkor",
      "remove-condition": "Ta bort villkor",
      "conditions-incomplete":
        "Villkor {{index}} är inte fullständigt – fyll i egenskap, jämförelseoperator och värde.",
      "match-description-label": "Matchningsbeskrivning",
      "match-description-placeholder":
        "t.ex. Användaren frågar om juridiska ämnen, avtal eller regelefterlevnad",
      "match-description-help":
        "Beskriv situationen där du vill att regeln ska matcha. Din LLM utvärderar detta för att avgöra om regeln ska användas.",
      "route-to-label": "Dirigera till leverantör och modell",
      "route-to-description":
        "När regeln matchar används denna leverantör/modell",
      cancel: "Avbryt",
      saving: "Sparar …",
      "update-rule": "Uppdatera regel",
      "create-rule": "Skapa regel",
      "title-required": "Rubrik krävs",
      "toast-save-failed": "Det gick inte att spara regeln",
      "type-calculated-label": "Beräknad",
      "type-calculated-description":
        "Matcha utifrån meddelandeegenskaper som innehåll, antal token eller tid på dagen.",
      "type-llm-label": "LLM-klassificerad",
      "type-llm-description":
        "Använd en LLM för att klassificera meddelandet utifrån en beskrivning som du anger.",
      "prop-prompt-content": "Promptinnehåll",
      "prop-token-count": "Antal token i konversationen",
      "prop-message-count": "Antal meddelanden i konversationen",
      "prop-current-hour": "Aktuell timme (0–23)",
      "prop-has-image": "Har bildbilaga",
      "cmp-contains": "innehåller",
      "cmp-matches-regex": "matchar (regex)",
      "cmp-equals": "är lika med",
      "cmp-not-equals": "är inte lika med",
      "cmp-greater-than": "är större än",
      "cmp-greater-than-or-equal": "är större än eller lika med",
      "cmp-less-than": "är mindre än",
      "cmp-less-than-or-equal": "är mindre än eller lika med",
      "cmp-between": "ligger mellan (inklusive)",
      "placeholder-between-hour": "t.ex. 9,17 (kl. 9 till 17)",
      "placeholder-between-numeric": "t.ex. 10,50",
      "placeholder-hour": "t.ex. 18 (0–23)",
      "placeholder-message-count": "t.ex. 10",
      "placeholder-numeric": "t.ex. 4000",
      "placeholder-contains": "t.ex. kod, python, rust",
      "placeholder-matches": "t.ex. /\\bpython\\b/i",
      "placeholder-default": "t.ex. kod",
      "help-contains":
        "Kommaseparerad lista – matchar om prompten innehåller något av värdena (skiftlägesokänsligt).",
      "help-matches":
        "Regex-mönster. Använd /mönster/flaggor för skiftlägeskänslighet (standard är skiftlägesokänsligt).",
      "bool-true": "Sant",
      "bool-false": "Falskt",
    },
    "provider-picker": {
      "select-provider": "Välj leverantör",
      "setup-required": "(konfiguration krävs)",
      "loading-models": "Läser in modeller …",
      "select-model": "Välj modell",
      "enter-model": "Ange modellnamn",
      "select-provider-first": "Välj först en leverantör",
      "configure-to-continue": "Konfigurera {{name}} för att fortsätta",
      "configure-provider": "Konfigurera {{name}}",
      "setup-credentials":
        "Ange de autentiseringsuppgifter som krävs för att använda {{name}} som routningsmål.",
      cancel: "Avbryt",
      "save-settings": "Spara inställningar",
      "toast-save-failed": "Det gick inte att spara inställningarna: {{error}}",
    },
    "router-selection": {
      "loading-routers": "Läser in anpassade routrar …",
      "no-routers-prefix-settings":
        "Inga modellroutrar har konfigurerats ännu.",
      "no-routers-prefix-workspace": "Inga modellroutrar har konfigurerats.",
      "no-routers-link": "Skapa en i modellrouterinställningarna",
      "model-router-label": "Modellrouter",
      "select-router": "Välj en router",
      "select-description":
        "Välj vilken router som ska användas för arbetsytan.",
      "no-routers-chat":
        "Inga routrar har konfigurerats. Skapa en under Inställningar > AI-leverantörer > Modellrouter.",
      "rule-count": "({{count}} regler)",
    },
    metrics: {
      "model-router-default": "Modellrouter",
    },
    chat: {
      "select-router-error": "Välj en router",
      "invalid-model": "Ogiltigt modellval",
      "routed-to": "Dirigerad till <route>{{model}}</route>",
      "routed-to-rule":
        "Dirigerad till <route>{{model}}</route> via <rule>{{ruleTitle}}</rule>",
    },
  },
  transcription: {
    title: "Inställning för transkriberingsmodell",
    description:
      "Här finns autentiseringsuppgifter och inställningar för din valda leverantör av transkriberingsmodell. Det är viktigt att nycklarna är aktuella och korrekta, annars kan mediefiler och ljud inte transkriberas.",
    provider: "Leverantör av transkribering",
    "warn-start":
      "Att använda den lokala Whisper-modellen på datorer med begränsat RAM eller CPU kan göra att AnythingLLM hänger sig när mediefiler behandlas.",
    "warn-recommend": "Vi rekommenderar minst 2 GB RAM och filer under 10 MB.",
    "warn-end":
      "Den inbyggda modellen hämtas automatiskt vid första användningen.",
  },
  embedding: {
    title: "Inställning för inbäddning",
    "desc-start":
      "När du använder en LLM som inte har inbyggt stöd för en inbäddningsmotor kan du behöva ange separata autentiseringsuppgifter för textinbäddning.",
    "desc-end":
      "Inbäddning är processen att omvandla text till vektorer. Dessa autentiseringsuppgifter behövs för att omvandla dina filer och promptar till ett format som AnythingLLM kan behandla.",
    provider: {
      title: "Leverantör av inbäddning",
    },
  },
  imageGeneration: {
    title: "Inställning för bildgenerering",
    description:
      "Konfigurera den leverantör som används för att skapa bilder från chattkommandot /img.",
    provider: "Leverantör av bildgenerering",
    card: {
      "failed-to-load": "Det gick inte att läsa in bilden",
      "alt-text": "Genererad bild",
      edit: "Redigera",
      download: "Hämta",
    },
    pending: {
      heading: "Genererar din bild …",
      description:
        "Detta kan ta en stund. Bilden visas här så snart den är klar.",
      aborted: "Bildgenereringen avbröts",
    },
  },
  text: {
    title: "Inställningar för textdelning och segmentering",
    "desc-start":
      "Ibland vill du kanske ändra standardsättet som nya dokument delas upp och segmenteras på innan de läggs in i vektordatabasen.",
    "desc-end":
      "Du bör bara ändra denna inställning om du förstår hur textdelning fungerar och vilka bieffekter den har.",
    size: {
      title: "Storlek på textsegment",
      description:
        "Detta är högsta antal tecken som kan finnas i en enskild vektor.",
      recommend: "Inbäddningsmodellens högsta längd är",
    },
    overlap: {
      title: "Överlappning mellan textsegment",
      description:
        "Detta är högsta antal överlappande tecken mellan två intilliggande textsegment under segmenteringen.",
    },
  },
  vector: {
    title: "Vektordatabas",
    description:
      "Här finns autentiseringsuppgifter och inställningar för hur AnythingLLM-instansen fungerar. Det är viktigt att nycklarna är aktuella och korrekta.",
    provider: {
      title: "Leverantör av vektordatabas",
      description: "LanceDB kräver ingen konfiguration.",
    },
  },
  embeddable: {
    title: "Inbäddningsbara chattwidgetar",
    description:
      "Inbäddningsbara chattwidgetar är offentliga chattgränssnitt som är knutna till en arbetsyta. Med dem kan du skapa arbetsytor och sedan publicera dem.",
    create: "Skapa inbäddning",
    table: {
      workspace: "Arbetsyta",
      chats: "Skickade chattar",
      active: "Aktiva domäner",
      created: "Skapad",
    },
  },
  "embed-chats": {
    title: "Historik för inbäddad chatt",
    export: "Exportera",
    description:
      "Detta är alla sparade chattar och meddelanden från alla inbäddningar du har publicerat.",
    table: {
      embed: "Inbäddning",
      sender: "Avsändare",
      message: "Meddelande",
      response: "Svar",
      at: "Skickat den",
    },
  },
  telegram: {
    title: "Telegram-bot",
    description:
      "Anslut din AnythingLLM-instans till Telegram så att du kan chatta med arbetsytorna från vilken enhet som helst.",
    setup: {
      step1: {
        title: "Steg 1: Skapa din Telegram-bot",
        description:
          "Öppna @BotFather i Telegram, skicka <code>/newbot</code> till <code>@BotFather</code>, följ instruktionerna och kopiera API-tokenen.",
        "open-botfather": "Öppna BotFather",
        "instruction-1": "1. Öppna länken eller skanna QR-koden",
        "instruction-2":
          "2. Skicka <code>/newbot</code> till <code>@BotFather</code>",
        "instruction-3": "3. Välj namn och användarnamn för boten",
        "instruction-4": "4. Kopiera API-tokenen som du får",
      },
      step2: {
        title: "Steg 2: Anslut boten",
        description:
          "Klistra in API-tokenen du fick från @BotFather för att ansluta boten.",
        "bot-token": "Bot-token",
        connecting: "Ansluter …",
        "connect-bot": "Anslut bot",
      },
      security: {
        title: "Rekommenderade säkerhetsinställningar",
        description:
          "För extra säkerhet, konfigurera dessa inställningar i @BotFather.",
        "disable-groups": "– Förhindra att boten läggs till i grupper",
        "disable-inline": "– Förhindra att boten används i infogad sökning",
        "obscure-username":
          "Använd ett svårgissat användarnamn för boten för att minska upptäckbarheten",
      },
      "toast-enter-token": "Ange en bot-token.",
      "toast-connect-failed": "Det gick inte att ansluta boten.",
    },
    connected: {
      status: "Ansluten",
      "status-disconnected":
        "Frånkopplad – token kan ha gått ut eller vara ogiltig",
      "placeholder-token": "Klistra in ny bot-token …",
      reconnect: "Anslut igen",
      workspace: "Arbetsyta",
      "bot-link": "Botlänk",
      "voice-response": "Röstsvar",
      disconnecting: "Kopplar från …",
      disconnect: "Koppla från",
      "voice-text-only": "Endast text",
      "voice-mirror": "Spegla (svara med röst när användaren skickar röst)",
      "voice-always": "Alltid röst (skicka ljud med varje svar)",
      "toast-disconnect-failed": "Det gick inte att koppla från boten.",
      "toast-reconnect-failed": "Det gick inte att ansluta boten igen.",
      "toast-voice-failed": "Det gick inte att uppdatera röstläget.",
      "toast-approve-failed": "Det gick inte att godkänna användaren.",
      "toast-deny-failed": "Det gick inte att neka användaren.",
      "toast-revoke-failed": "Det gick inte att återkalla användarens åtkomst.",
    },
    users: {
      "pending-description":
        "Användare som väntar på verifiering. Matcha parkopplingskoden som visas här med den som visas i deras Telegram-chatt.",
      unknown: "Okänd",
    },
  },
  security: {
    title: "Säkerhet",
    multiuser: {
      title: "Fleranvändarläge",
      description:
        "Konfigurera instansen för ditt team genom att aktivera fleranvändarläge.",
      enable: {
        "is-enable": "Fleranvändarläge är aktiverat",
        enable: "Aktivera fleranvändarläge",
        description:
          "Som standard är du den enda administratören. Som administratör behöver du skapa konton för alla nya användare och administratörer. Tappa inte bort lösenordet, eftersom endast en administratör kan återställa lösenord.",
        username: "Användarnamn för administratörskontot",
        password: "Lösenord för administratörskontot",
      },
    },
    password: {
      title: "Lösenordsskydd",
      description:
        "Skydda AnythingLLM-instansen med ett lösenord. Om du glömmer det går det inte att återställa, så se till att spara lösenordet.",
      "password-label": "Instanslösenord",
    },
  },
  event: {
    title: "Händelseloggar",
    description:
      "Visa alla åtgärder och händelser på denna instans för övervakning.",
    clear: "Rensa händelseloggar",
    table: {
      type: "Händelsetyp",
      user: "Användare",
      occurred: "Inträffade",
    },
  },
  privacy: {
    title: "Integritet och datahantering",
    description:
      "Här konfigurerar du hur anslutna tredjepartsleverantörer och AnythingLLM hanterar dina data.",
    anonymous: "Anonym telemetri är aktiverad",
  },
  connectors: {
    "search-placeholder": "Sök datakopplingar",
    "no-connectors": "Inga datakopplingar hittades.",
    obsidian: {
      vault_location: "Valvplats",
      vault_description:
        "Välj din Obsidian-valvmapp för att importera alla anteckningar och deras länkar.",
      selected_files: "Hittade {{count}} Markdown-filer",
      importing: "Importerar valv …",
      import_vault: "Importera valv",
      processing_time: "Detta kan ta en stund beroende på valvets storlek.",
      vault_warning:
        "Undvik konflikter genom att se till att Obsidian-valvet inte är öppet just nu.",
    },
    github: {
      name: "GitHub Repo",
      description:
        "Importera ett helt offentligt eller privat GitHub-arkiv med ett klick.",
      URL: "GitHub-arkivets URL",
      URL_explained: "URL till GitHub-arkivet som du vill hämta.",
      token: "GitHub-åtkomsttoken",
      optional: "valfritt",
      token_explained: "Åtkomsttoken för att undvika hastighetsbegränsning.",
      token_explained_start: "Utan en ",
      token_explained_link1: "personlig åtkomsttoken",
      token_explained_middle:
        ", kan GitHub API begränsa antalet filer som kan hämtas på grund av hastighetsgränser. Du kan ",
      token_explained_link2: "skapa en tillfällig åtkomsttoken",
      token_explained_end: " för att undvika problemet.",
      ignores: "Ignorerade filer",
      git_ignore:
        "Lista i .gitignore-format för att ignorera vissa filer vid hämtningen. Tryck på Retur efter varje post du vill spara.",
      task_explained:
        "När hämtningen är klar blir alla filer tillgängliga för inbäddning i arbetsytor i dokumentväljaren.",
      branch: "Gren som du vill hämta filer från.",
      branch_loading: "-- läser in tillgängliga grenar --",
      branch_explained: "Gren som du vill hämta filer från.",
      token_information:
        "Utan en <b>GitHub-åtkomsttoken</b> kan denna datakoppling, på grund av GitHubs begränsningar i det offentliga API:t, endast hämta arkivets <b>översta nivå</b>.",
      token_personal:
        "Skaffa en kostnadsfri personlig åtkomsttoken med ett GitHub-konto här.",
    },
    gitlab: {
      name: "GitLab Repo",
      description:
        "Importera ett helt offentligt eller privat GitLab-arkiv med ett klick.",
      URL: "GitLab-arkivets URL",
      URL_explained: "URL till GitLab-arkivet som du vill hämta.",
      token: "GitLab-åtkomsttoken",
      optional: "valfritt",
      token_description: "Välj ytterligare objekt att hämta från GitLab API.",
      token_explained_start: "Utan en ",
      token_explained_link1: "personlig åtkomsttoken",
      token_explained_middle:
        ", kan GitLab API begränsa antalet filer som kan hämtas på grund av hastighetsgränser. Du kan ",
      token_explained_link2: "skapa en tillfällig åtkomsttoken",
      token_explained_end: " för att undvika problemet.",
      fetch_issues: "Hämta ärenden som dokument",
      ignores: "Ignorerade filer",
      git_ignore:
        "Lista i .gitignore-format för att ignorera vissa filer vid hämtningen. Tryck på Retur efter varje post du vill spara.",
      task_explained:
        "När hämtningen är klar blir alla filer tillgängliga för inbäddning i arbetsytor i dokumentväljaren.",
      branch: "Gren som du vill hämta filer från",
      branch_loading: "-- läser in tillgängliga grenar --",
      branch_explained: "Gren som du vill hämta filer från.",
      token_information:
        "Utan en <b>GitLab-åtkomsttoken</b> kan denna datakoppling, på grund av GitLabs begränsningar i det offentliga API:t, endast hämta arkivets <b>översta nivå</b>.",
      token_personal:
        "Skaffa en kostnadsfri personlig åtkomsttoken med ett GitLab-konto här.",
    },
    gitea: {
      name: "Gitea Repo",
      description:
        "Importera ett helt offentligt eller privat arkiv från valfri Gitea-instans med ett klick.",
      URL: "Gitea-arkivets URL",
      URL_explained:
        "URL till arkivet som du vill hämta från din Gitea-instans – självhostade instanser stöds.",
      token: "Gitea-åtkomsttoken",
      optional: "valfritt",
      token_explained:
        "Åtkomsttoken krävs för att hämta privata arkiv eller arkiv på instanser som kräver autentisering.",
      token_explained_start: "Utan en ",
      token_explained_link1: "åtkomsttoken",
      token_explained_end:
        ", kan endast arkiv som Gitea-instansen exponerar offentligt hämtas.",
      ignores: "Ignorerade filer",
      git_ignore:
        "Lista i .gitignore-format för att ignorera vissa filer vid hämtningen. Tryck på Retur efter varje post du vill spara.",
      task_explained:
        "När hämtningen är klar blir alla filer tillgängliga för inbäddning i arbetsytor i dokumentväljaren.",
      branch: "Gren som du vill hämta filer från.",
      branch_loading: "-- läser in tillgängliga grenar --",
      branch_explained: "Gren som du vill hämta filer från.",
      token_information:
        "Utan en <b>Gitea-åtkomsttoken</b> kan denna datakoppling endast hämta filer från arkiv som är <b>offentligt läsbara</b> på din Gitea-instans.",
    },
    youtube: {
      name: "YouTube-transkription",
      description:
        "Importera transkriptionen av en hel YouTube-video från en länk.",
      URL: "URL till YouTube-video",
      URL_explained_start:
        "Ange URL:en till valfri YouTube-video för att hämta dess transkription. Videon måste ha ",
      URL_explained_link: "undertexter",
      URL_explained_end: " tillgängliga.",
      task_explained:
        "När hämtningen är klar blir transkriptionen tillgänglig för inbäddning i arbetsytor i dokumentväljaren.",
    },
    "website-depth": {
      name: "Masshämtning av länkar",
      description:
        "Hämta innehåll från en webbplats och dess underlänkar till ett visst djup.",
      URL: "Webbplatsens URL",
      URL_explained: "URL till webbplatsen som du vill hämta innehåll från.",
      depth: "Genomsökningsdjup",
      depth_explained:
        "Detta är antalet underlänkar som arbetaren ska följa från ursprungsadressen.",
      max_pages: "Högsta antal sidor",
      max_pages_explained: "Högsta antal länkar att hämta innehåll från.",
      task_explained:
        "När hämtningen är klar blir allt hämtat innehåll tillgängligt för inbäddning i arbetsytor i dokumentväljaren.",
    },
    confluence: {
      name: "Confluence",
      description: "Importera en hel Confluence-sida med ett klick.",
      deployment_type: "Typ av Confluence-distribution",
      deployment_type_explained:
        "Avgör om Confluence-instansen är värdbaserad i Atlassian-molnet eller självhostad.",
      base_url: "Bas-URL för Confluence",
      base_url_explained: "Detta är bas-URL:en för din Confluence-yta.",
      space_key: "Nyckel för Confluence-yta",
      space_key_explained:
        "Detta är nyckeln för den Confluence-yta som ska användas. Den börjar vanligtvis med ~",
      username: "Confluence-användarnamn",
      username_explained: "Ditt Confluence-användarnamn",
      auth_type: "Typ av Confluence-autentisering",
      auth_type_explained:
        "Välj den autentiseringstyp du vill använda för att komma åt Confluence-sidorna.",
      auth_type_username: "Användarnamn och åtkomsttoken",
      auth_type_personal: "Personlig åtkomsttoken",
      token: "Confluence-åtkomsttoken",
      token_explained_start:
        "Du måste ange en åtkomsttoken för autentisering. Du kan skapa en åtkomsttoken",
      token_explained_link: "här",
      token_desc: "Åtkomsttoken för autentisering",
      pat_token: "Personlig Confluence-åtkomsttoken",
      pat_token_explained: "Din personliga Confluence-åtkomsttoken.",
      bypass_ssl: "Kringgå validering av SSL-certifikat",
      bypass_ssl_explained:
        "Aktivera detta alternativ för att kringgå SSL-certifikatvalidering för självhostade Confluence-instanser med självsignerat certifikat",
      task_explained:
        "När hämtningen är klar blir sidinnehållet tillgängligt för inbäddning i arbetsytor i dokumentväljaren.",
    },
    manage: {
      documents: "Dokument",
      "data-connectors": "Datakopplingar",
      "desktop-only":
        "Det går endast att redigera dessa inställningar på en dator. Öppna denna sida på datorn för att fortsätta.",
      dismiss: "Stäng",
      editing: "Redigering",
    },
    directory: {
      "my-documents": "Mina dokument",
      "new-folder": "Ny mapp",
      "total-documents_one": "{{count}} dokument",
      "total-documents_other": "{{count}} dokument",
      "search-results_one": "{{count}} resultat",
      "search-results_other": "{{count}} resultat",
      "search-document": "Sök efter dokument",
      "no-documents": "Inga dokument",
      "move-workspace": "Flytta till arbetsyta",
      "delete-confirmation":
        "Är du säker på att du vill ta bort dessa filer och mappar?\nFilerna tas bort från systemet och tas automatiskt bort från alla befintliga arbetsytor.\nÅtgärden går inte att ångra.",
      "removing-message":
        "Tar bort {{count}} dokument och {{folderCount}} mappar. Vänta.",
      "move-success": "{{count}} dokument har flyttats.",
      no_docs: "Inga dokument",
      select_all: "Markera alla",
      deselect_all: "Avmarkera alla",
      remove_selected: "Ta bort markerade",
      save_embed: "Spara och bädda in",
    },
    upload: {
      "processor-offline": "Dokumentprocessorn är inte tillgänglig",
      "processor-offline-desc":
        "Det går inte att ladda upp dina filer just nu eftersom dokumentprocessorn är offline. Försök igen senare.",
      "click-upload": "Klicka för att ladda upp eller dra och släpp",
      "file-types":
        "stöder textfiler, CSV-filer, kalkylblad, ljudfiler med mera!",
      "or-submit-link": "eller ange en länk",
      "placeholder-link": "https://example.com",
      fetching: "Hämtar …",
      "fetch-website": "Hämta webbplats",
      "privacy-notice":
        "Dessa filer laddas upp till dokumentprocessorn som körs på denna AnythingLLM-instans. Filerna skickas inte till eller delas med tredje part.",
    },
    pinning: {
      what_pinning: "Vad är fästning av dokument?",
      pin_explained_block1:
        "När du <b>fäster</b> ett dokument i AnythingLLM infogas hela dokumentinnehållet i promptfönstret så att LLM:en kan förstå det fullt ut.",
      pin_explained_block2:
        "Detta fungerar bäst med <b>modeller med stor kontext</b> eller små filer som är viktiga för kunskapsbasen.",
      pin_explained_block3:
        "Om du inte får önskade svar från AnythingLLM som standard är fästning ett enkelt sätt att få svar av högre kvalitet.",
      accept: "Okej, jag förstår",
    },
    watching: {
      what_watching: "Vad innebär det att bevaka ett dokument?",
      watch_explained_block1:
        "När du <b>bevakar</b> ett dokument i AnythingLLM synkroniseras dokumentinnehållet <i>automatiskt</i> från ursprungskällan med jämna mellanrum. Detta uppdaterar automatiskt innehållet i varje arbetsyta där filen hanteras.",
      watch_explained_block2:
        "Denna funktion stöder för närvarande nätbaserat innehåll och är inte tillgänglig för manuellt uppladdade dokument.",
      watch_explained_block3_start:
        "Du kan hantera vilka dokument som bevakas i administratörsvyn för ",
      watch_explained_block3_link: "filhanteraren",
      watch_explained_block3_end: ".",
      accept: "Okej, jag förstår",
    },
  },
  chat_window: {
    attachments_processing: "Bilagor bearbetas. Vänta …",
    generating_response: "Genererar svar",
    thought_in_progress: "Modellen tänker …",
    thoughts: "Tankar",
    response_failed: "Det gick inte att svara på meddelandet.",
    response_failed_reason: "Orsak: {{reason}}",
    send_message: "Skicka ett meddelande",
    attach_file: "Bifoga en fil till denna chatt",
    text_size: "Ändra textstorlek.",
    export: "Exportera chatt som …",
    exporting: "Exporterar …",
    microphone: "Säg din prompt.",
    stt_unsupported: "Mikrofonåtkomst stöds inte i denna webbläsare.",
    stt_mic_denied:
      "Det gick inte att komma åt mikrofonen. Ge behörighet och försök igen.",
    stt_transcription_failed: "Transkriberingen misslyckades: {{error}}",
    send: "Skicka promptmeddelande till arbetsyta",
    tts_speak_message: "Läs upp meddelande med TTS",
    copy: "Kopiera",
    regenerate: "Generera på nytt",
    regenerate_response: "Generera svar på nytt",
    good_response: "Bra svar",
    more_actions: "Fler åtgärder",
    sources: "Källor",
    source_count_one: "{{count}} referens",
    source_count_other: "{{count}} referenser",
    document: "Dokument",
    similarity_match: "träff",
    fork: "Förgrena",
    delete: "Ta bort",
    cancel: "Avbryt",
    submit: "Skicka",
    edit_prompt: "Redigera prompt",
    edit_response: "Redigera svar",
    edit_info_user:
      "”Skicka” genererar AI-svaret på nytt. ”Spara” uppdaterar endast ditt meddelande.",
    edit_info_assistant: "Dina ändringar sparas direkt i detta svar.",
    see_less: "Visa mindre",
    see_more: "Visa mer",
    preset_reset_description: "Rensa chatthistoriken och börja en ny chatt",
    preset_img_description: "Generera en bild från en textprompt",
    add_new_preset: " Lägg till ny förinställning",
    add_new: "Lägg till",
    edit: "Redigera",
    publish: "Publicera",
    stop_generating: "Sluta generera svar",
    command: "Kommando",
    your_command: "your-command",
    placeholder_prompt: "Detta innehåll infogas före din prompt.",
    description: "Beskrivning",
    placeholder_description: "Svarar med en dikt om LLM:er.",
    save: "Spara",
    small: "Liten",
    normal: "Normal",
    large: "Stor",
    tools: "Verktyg",
    text_size_label: "Textstorlek",
    select_model: "Välj modell",
    slash_commands: "Snedstreckskommandon",
    agent_skills: "Agentfärdigheter",
    manage_agent_skills: "Hantera agentfärdigheter",
    app_integrations: "Appintegreringar",
    custom_skills: "Anpassade färdigheter",
    agent_flows: "Agentflöden",
    sub_skills: "Underfärdigheter",
    no_tools_found: "Inga matchande verktyg hittades",
    loading_mcp_servers: "Läser in MCP-servrar …",
    start_agent_session: "Starta agentsession",
    agent_skills_disabled_in_session:
      "Det går inte att ändra färdigheter under en aktiv agentsession. Använd först /exit för att avsluta sessionen.",
    use_agent_session_to_use_tools:
      "Du kan använda verktyg i chatten genom att starta en agentsession med ”@agent” i början av prompten.",
    workspace_llm_manager: {
      search: "Sök",
      loading_workspace_settings: "Läser in arbetsyteinställningar …",
      available_models: "Tillgängliga modeller för {{provider}}",
      available_models_description:
        "Välj en modell som ska användas för arbetsytan.",
      save: "Använd denna modell",
      saving: "Anger modellen som arbetsytans standard …",
      missing_credentials: "Denna leverantör saknar autentiseringsuppgifter!",
      missing_credentials_description: "Konfigurera nu",
    },
    agent_invocation: {
      model_wants_to_call: "Modellen vill anropa",
      approve: "Godkänn",
      reject: "Avvisa",
      always_allow: "Tillåt alltid {{skillName}}",
      tool_call_was_approved: "Verktygsanropet godkändes",
      tool_call_was_rejected: "Verktygsanropet avvisades",
      clarifying_skip: "Låt agenten avgöra",
      clarifying_submit: "Skicka",
      clarifying_skipped: "Du lät agenten avgöra.",
      clarifying_timeout: "Inget svar skickades i tid.",
      clarifying_pagination: "{{current}} av {{total}}",
      clarifying_prev_aria: "Föregående fråga",
      clarifying_next_aria: "Nästa fråga",
      clarifying_close_aria: "Stäng och hoppa över",
      clarifying_other: "Annat",
      clarifying_other_placeholder: "Skriv ditt svar",
      batch_progress: "{{answered}} av {{total}} besvarade",
      batch_skip_this: "Hoppa över",
      batch_submit_all: "Skicka alla",
      batch_next: "Nästa",
      answer_skipped: "[användaren hoppade över]",
    },
    memories: {
      title: "Minnen",
      empty:
        "Inga minnen ännu. När du använder chattboten kan fler minnen skapas, eller så kan du",
      empty_cta: "skapa ett nytt minne",
      tab_workspace: "Arbetsyta",
      tab_global: "Globalt",
      toggle: {
        label: "Aktivera personanpassning",
        description:
          "Låt assistenten komma ihåg fakta om dig eller denna arbetsyta och använda dem i samtal",
      },
      auto_extraction: {
        label: "Automatiska minnen",
        description: "Låt assistenten automatiskt skapa minnen i bakgrunden",
      },
      menu: {
        edit: "Redigera",
        delete: "Ta bort",
        move_to_global: "Flytta till globalt",
        move_to_workspace: "Flytta till arbetsyta",
      },
      modal: {
        create_title: "Skapa minne",
        edit_title: "Redigera minne",
        create_description:
          "Minnen bör vara ett enda kort påstående, t.ex. ”Användaren föredrar Python framför JavaScript”.",
        edit_description: "Uppdatera innehållet i detta minne.",
        label: "Minne",
        placeholder:
          "t.ex. Användaren heter Kim, användaren arbetar med AnythingLLM osv.",
        create: "Skapa",
        save: "Spara",
        cancel: "Avbryt",
      },
    },
    leave_generating: {
      title: "Sluta generera svar?",
      description:
        "Du håller på att lämna chatten. Det stoppar modellen från att generera svaret och svaret kan inte återställas.",
      cancel: "Avbryt",
      confirm: "Fortsätt",
    },
  },
  profile_settings: {
    edit_account: "Redigera konto",
    profile_picture: "Profilbild",
    remove_profile_picture: "Ta bort profilbild",
    username: "Användarnamn",
    new_password: "Nytt lösenord",
    password_description: "Lösenordet måste innehålla minst 8 tecken",
    cancel: "Avbryt",
    update_account: "Uppdatera konto",
    theme: "Temainställning",
    language: "Föredraget språk",
    failed_upload: "Det gick inte att ladda upp profilbilden: {{error}}",
    upload_success: "Profilbilden har laddats upp.",
    failed_remove: "Det gick inte att ta bort profilbilden: {{error}}",
    profile_updated: "Profilen har uppdaterats.",
    failed_update_user: "Det gick inte att uppdatera användaren: {{error}}",
    account: "Konto",
    support: "Support",
    signout: "Logga ut",
  },
  "keyboard-shortcuts": {
    title: "Tangentbordsgenvägar",
    shortcuts: {
      settings: "Öppna inställningar",
      workspaceSettings: "Öppna inställningar för aktuell arbetsyta",
      home: "Gå till startsidan",
      workspaces: "Hantera arbetsytor",
      apiKeys: "Inställningar för API-nycklar",
      llmPreferences: "LLM-inställningar",
      chatSettings: "Chattinställningar",
      help: "Visa hjälp för tangentbordsgenvägar",
      showLLMSelector: "Visa LLM-väljare för arbetsytan",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Klart!",
        success_description:
          "Din systemprompt har publicerats på Community Hub!",
        success_thank_you: "Tack för att du delar med communityn!",
        view_on_hub: "Visa på Community Hub",
        modal_title: "Publicera systemprompt",
        name_label: "Namn",
        name_description: "Detta är visningsnamnet för systemprompten.",
        name_placeholder: "Min systemprompt",
        description_label: "Beskrivning",
        description_description:
          "Detta är beskrivningen av systemprompten. Använd den för att beskriva systempromptens syfte.",
        tags_label: "Taggar",
        tags_description:
          "Taggar används för att märka systemprompten så att den blir lättare att söka efter. Du kan lägga till flera taggar. Högst 5 taggar och högst 20 tecken per tagg.",
        tags_placeholder: "Skriv och tryck på Retur för att lägga till taggar",
        visibility_label: "Synlighet",
        public_description: "Offentliga systempromptar är synliga för alla.",
        private_description:
          "Privata systempromptar är endast synliga för dig.",
        publish_button: "Publicera på Community Hub",
        submitting: "Publicerar …",
        prompt_label: "Prompt",
        prompt_description:
          "Detta är den faktiska systemprompt som används för att vägleda LLM:en.",
        prompt_placeholder: "Ange systemprompten här …",
      },
      agent_flow: {
        success_title: "Klart!",
        success_description:
          "Ditt agentflöde har publicerats på Community Hub!",
        success_thank_you: "Tack för att du delar med communityn!",
        view_on_hub: "Visa på Community Hub",
        modal_title: "Publicera agentflöde",
        name_label: "Namn",
        name_description: "Detta är visningsnamnet för agentflödet.",
        name_placeholder: "Mitt agentflöde",
        description_label: "Beskrivning",
        description_description:
          "Detta är beskrivningen av agentflödet. Använd den för att beskriva agentflödets syfte.",
        tags_label: "Taggar",
        tags_description:
          "Taggar används för att märka agentflödet så att det blir lättare att söka efter. Du kan lägga till flera taggar. Högst 5 taggar och högst 20 tecken per tagg.",
        tags_placeholder: "Skriv och tryck på Retur för att lägga till taggar",
        visibility_label: "Synlighet",
        submitting: "Publicerar …",
        submit: "Publicera på Community Hub",
        privacy_note:
          "Agentflöden laddas alltid upp som privata för att skydda känsliga data. Du kan ändra synligheten i Community Hub efter publiceringen. Kontrollera att flödet inte innehåller känslig eller privat information innan du publicerar.",
      },
      slash_command: {
        success_title: "Klart!",
        success_description:
          "Ditt snedstreckskommando har publicerats på Community Hub!",
        success_thank_you: "Tack för att du delar med communityn!",
        view_on_hub: "Visa på Community Hub",
        modal_title: "Publicera snedstreckskommando",
        name_label: "Namn",
        name_description: "Detta är visningsnamnet för snedstreckskommandot.",
        name_placeholder: "Mitt snedstreckskommando",
        description_label: "Beskrivning",
        description_description:
          "Detta är beskrivningen av snedstreckskommandot. Använd den för att beskriva dess syfte.",
        tags_label: "Taggar",
        tags_description:
          "Taggar används för att märka snedstreckskommandot så att det blir lättare att söka efter. Du kan lägga till flera taggar. Högst 5 taggar och högst 20 tecken per tagg.",
        tags_placeholder: "Skriv och tryck på Retur för att lägga till taggar",
        visibility_label: "Synlighet",
        public_description:
          "Offentliga snedstreckskommandon är synliga för alla.",
        private_description:
          "Privata snedstreckskommandon är endast synliga för dig.",
        publish_button: "Publicera på Community Hub",
        submitting: "Publicerar …",
        prompt_label: "Prompt",
        prompt_description:
          "Detta är prompten som används när snedstreckskommandot utlöses.",
        prompt_placeholder: "Ange prompten här …",
      },
      generic: {
        unauthenticated: {
          title: "Autentisering krävs",
          description:
            "Du måste autentisera med AnythingLLM Community Hub innan du publicerar objekt.",
          button: "Anslut till Community Hub",
        },
      },
    },
  },
  scheduledJobs: {
    title: "Schemalagda jobb",
    enableNotifications: "Aktivera webbläsaraviseringar för jobbresultat",
    description:
      "Skapa återkommande AI-uppgifter som körs enligt ett schema. Varje jobb kör en prompt med valfria verktyg och sparar resultatet för granskning.",
    newJob: "Nytt jobb",
    loading: "Läser in …",
    emptyTitle: "Inga schemalagda jobb ännu",
    emptySubtitle: "Skapa ett för att komma igång.",
    table: {
      name: "Namn",
      schedule: "Schema",
      status: "Status",
      lastRun: "Senaste körning",
      nextRun: "Nästa körning",
      actions: "Åtgärder",
    },
    confirmDelete: "Är du säker på att du vill ta bort detta schemalagda jobb?",
    status: {
      completed: "Slutfört",
      failed: "Misslyckades",
      timed_out: "Tidsgränsen överskreds",
      running: "Körs",
      queued: "Köat",
    },
    toast: {
      deleted: "Jobbet har tagits bort",
      triggered: "Jobbet startades",
      triggerFailed: "Det gick inte att starta jobbet",
      triggerSkipped: "En körning pågår redan för detta jobb",
      killed: "Jobbet stoppades",
      killFailed: "Det gick inte att stoppa jobbet",
    },
    row: {
      neverRun: "Har aldrig körts",
      viewRuns: "Visa körningar",
      runNow: "Kör nu",
      enable: "Aktivera",
      disable: "Inaktivera",
      edit: "Redigera",
      delete: "Ta bort",
    },
    modal: {
      titleEdit: "Redigera schemalagt jobb",
      titleNew: "Nytt schemalagt jobb",
      nameLabel: "Namn",
      namePlaceholder: "t.ex. Daglig nyhetssammanfattning",
      promptLabel: "Prompt",
      promptPlaceholder: "Instruktionen som ska köras vid varje körning …",
      scheduleLabel: "Schema",
      modeBuilder: "Byggare",
      modeCustom: "Anpassat",
      cronPlaceholder: "Cron-uttryck (t.ex. 0 9 * * *)",
      currentSchedule: "Aktuellt schema:",
      toolsLabel: "Verktyg (valfritt)",
      toolsDescription:
        "Välj vilka agentverktyg jobbet får använda. Om inga väljs körs jobbet utan verktyg.",
      toolsSearch: "Sök",
      toolsNoResults: "Inga verktyg matchar",
      required: "Krävs",
      requiredFieldsBanner:
        "Fyll i alla obligatoriska fält för att skapa jobbet.",
      cancel: "Avbryt",
      saving: "Sparar …",
      updateJob: "Uppdatera jobb",
      createJob: "Skapa jobb",
      jobUpdated: "Jobbet har uppdaterats",
      jobCreated: "Jobbet har skapats",
    },
    builder: {
      fallbackWarning:
        "Detta uttryck kan inte redigeras visuellt. Växla till Anpassat för att behålla det, eller ändra något nedan för att skriva över det.",
      run: "Kör",
      frequency: {
        minute: "varje minut",
        hour: "varje timme",
        day: "dagligen",
        week: "varje vecka",
        month: "varje månad",
      },
      every: "Varje",
      minuteOne: "1 minut",
      minuteOther: "{{count}} minuter",
      atMinute: "Vid minut",
      pastEveryHour: "efter varje timme",
      at: "Klockan",
      on: "På",
      onDay: "På dag",
      ofEveryMonth: "varje månad",
      weekdays: {
        sun: "Sön",
        mon: "Mån",
        tue: "Tis",
        wed: "Ons",
        thu: "Tor",
        fri: "Fre",
        sat: "Lör",
      },
    },
    runHistory: {
      back: "Tillbaka till jobb",
      title: "Körningshistorik: {{name}}",
      schedule: "Schema:",
      emptyTitle: "Inga körningar för detta jobb ännu",
      emptySubtitle: "Kör jobbet nu för att se dess resultat.",
      runNow: "Kör nu",
      stopJob: "Stoppa jobb",
      table: {
        status: "Status",
        started: "Startade",
        duration: "Varaktighet",
        error: "Fel",
      },
    },
    runDetail: {
      loading: "Läser in körningsuppgifter …",
      notFound: "Körningen hittades inte.",
      back: "Tillbaka",
      unknownJob: "Okänt jobb",
      runHeading: "{{name}} – körning #{{id}}",
      duration: "Varaktighet: {{value}}",
      continueInThread: "Fortsätt i chatt",
      creating: "Skapar …",
      threadFailed: "Det gick inte att skapa tråden",
      stopJob: "Stoppa jobb",
      killing: "Stoppar …",
      sections: {
        prompt: "Prompt",
        error: "Fel",
        thinking: "Tankar ({{count}})",
        toolCalls: "Verktygsanrop ({{count}})",
        files: "Filer ({{count}})",
        response: "Svar",
        metrics: "Mått",
      },
      metrics: {
        promptTokens: "Prompttoken:",
        completionTokens: "Slutförandetoken:",
      },
    },
    toolCall: {
      arguments: "Argument:",
      showResult: "Visa resultat",
      hideResult: "Dölj resultat",
    },
    file: {
      unknown: "Okänd fil",
      download: "Hämta",
      downloadFailed: "Det gick inte att hämta filen",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF-dokument",
        word: "Word-dokument",
        spreadsheet: "Kalkylblad",
        generic: "Fil",
      },
    },
  },
};

export default TRANSLATIONS;
