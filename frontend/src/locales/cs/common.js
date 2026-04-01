// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Začít",
      welcome: "Vítejte",
    },
    llm: {
      title: "Preferovaný LLM",
      description:
        "AnythingLLM může pracovat s mnoha poskytovateli LLM. Toto bude služba, která bude zpracovávat chatování.",
    },
    userSetup: {
      title: "Nastavení uživatele",
      description: "Nakonfigurujte svá uživatelská nastavení.",
      howManyUsers: "Kolik uživatelů bude používat tuto instanci?",
      justMe: "Jen já",
      myTeam: "Můj tým",
      instancePassword: "Heslo instance",
      setPassword: "Chcete nastavit heslo?",
      passwordReq: "Hesla musí mít alespoň 8 znaků.",
      passwordWarn:
        "Je důležité toto heslo uložit, protože neexistuje způsob obnovení.",
      adminUsername: "Uživatelské jméno správce",
      adminPassword: "Heslo správce",
      adminPasswordReq: "Hesla musí mít alespoň 8 znaků.",
      teamHint:
        "Ve výchozím nastavení budete jediným správcem. Po dokončení onboardingu můžete vytvářet a zvat další uživatele nebo správce. Neztrácejte své heslo, protože pouze správci mohou resetovat hesla.",
    },
    data: {
      title: "Zpracování dat a soukromí",
      description:
        "Jsme odhodláni být transparentní a dávat vám kontrolu nad vašimi osobními údaji.",
      settingsHint:
        "Tato nastavení lze kdykoliv znovu nakonfigurovat v nastavení.",
    },
    survey: {
      title: "Vítejte v AnythingLLM",
      description:
        "Pomozte nám vybudovat AnythingLLM pro vaše potřeby. Volitelné.",
      email: "Jaký je váš e-mail?",
      useCase: "K čemu budete AnythingLLM používat?",
      useCaseWork: "Pro práci",
      useCasePersonal: "Pro osobní použití",
      useCaseOther: "Jiné",
      comment: "Jak jste se o AnythingLLM dozvěděli?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube atd. - Dejte nám vědět, jak jste nás našli!",
      skip: "Přeskočit průzkum",
      thankYou: "Děkujeme za vaši zpětnou vazbu!",
    },
  },
  common: {
    "workspaces-name": "Název pracovního prostoru",
    selection: "Výběr modelu",
    saving: "Ukládání...",
    save: "Uložit změny",
    previous: "Předchozí stránka",
    next: "Další stránka",
    optional: "Volitelné",
    yes: "Ano",
    no: "Ne",
    search: "Hledat",
    username_requirements:
      "Uživatelské jméno musí mít 2–32 znaků, začínat malým písmenem a obsahovat pouze malá písmena, číslice, podtržítka, pomlčky a tečky.",
    on: "Na",
    none: "Žádné",
    stopped: "Zastaveno",
    loading: "Načítání",
    refresh: "Obnovit",
  },
  home: {
    welcome: "Vítejte",
    chooseWorkspace: "Vyberte pracovní prostor pro začátek chatu!",
    notAssigned:
      "V současné době nemáte přiřazen žádný pracovní prostor.\nKontaktujte svého správce o žádost o přístup k pracovnímu prostoru.",
    goToWorkspace: 'Přejít na "{{workspace}}"',
  },
  settings: {
    title: "Nastavení instance",
    invites: "Pozvánky",
    users: "Uživatelé",
    workspaces: "Pracovní prostory",
    "workspace-chats": "Chaty pracovních prostorů",
    customization: "Přizpůsobení",
    interface: "Předvolby rozhraní",
    branding: "Značení a bílé označení",
    chat: "Chat",
    "api-keys": "API pro vývojáře",
    llm: "LLM",
    transcription: "Přepis",
    embedder: "Embedding",
    "text-splitting": "Rozdělení textu a chunkování",
    "voice-speech": "Hlas a řeč",
    "vector-database": "Vektorová databáze",
    embeds: "Vložený chat",
    security: "Zabezpečení",
    "event-logs": "Protokoly událostí",
    privacy: "Soukromí a data",
    "ai-providers": "Poskytovatelé AI",
    "agent-skills": "Dovednosti agenta",
    admin: "Správce",
    tools: "Nástroje",
    "system-prompt-variables": "Proměnné systémové výzvy",
    "experimental-features": "Experimentální funkce",
    contact: "Kontaktovat podporu",
    "browser-extension": "Rozšíření prohlížeče",
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Centrální místo pro komunitu",
      trending: "Prozkoumejte aktuální trendy",
      "your-account": "Váš účet",
      "import-item": "Importovat položku",
    },
    channels: "Kanály",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Vítejte v",
      "placeholder-username": "Uživatelské jméno",
      "placeholder-password": "Heslo",
      login: "Přihlásit",
      validating: "Ověřování...",
      "forgot-pass": "Zapomněli jste heslo",
      reset: "Resetovat",
    },
    "sign-in": "Přihlaste se do svého {{appName}} účtu.",
    "password-reset": {
      title: "Reset hesla",
      description: "Níže uveďte potřebné informace pro resetování hesla.",
      "recovery-codes": "Záchranné kódy",
      "back-to-login": "Zpět k přihlášení",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Vytvořte agenta",
      editWorkspace: "Upravit pracovní prostor",
      uploadDocument: "Nahrajte dokument",
    },
    greeting: "Jak vám mohu dnes pomoci?",
  },
  "new-workspace": {
    title: "Nový pracovní prostor",
    placeholder: "Můj pracovní prostor",
  },
  "workspaces—settings": {
    general: "Obecná nastavení",
    chat: "Nastavení chatu",
    vector: "Vektorová databáze",
    members: "Členové",
    agent: "Konfigurace agenta",
  },
  general: {
    vector: {
      title: "Počet vektorů",
      description: "Celkový počet vektorů ve vaší vektorové databázi.",
    },
    names: {
      description:
        "Tímto se změní pouze zobrazovaný název vašeho pracovního prostoru.",
    },
    message: {
      title: "Navrhované zprávy chatu",
      description:
        "Přizpůsobte zprávy, které budou navrhovány uživatelům vašeho pracovního prostoru.",
      add: "Přidat novou zprávu",
      save: "Uložit zprávy",
      heading: "Vysvětlit mi",
      body: "výhody AnythingLLM",
    },
    delete: {
      title: "Smazat pracovní prostor",
      description:
        "Smažte tento pracovní prostor a všechna jeho data. Toto smaže pracovní prostor pro všechny uživatele.",
      delete: "Smazat pracovní prostor",
      deleting: "Mazání pracovního prostoru...",
      "confirm-start": "Chystáte se smazat celý",
      "confirm-end":
        "pracovní prostor. Toto odstraní všechny vektorové embeddingy ve vaší vektorové databázi.\n\nPůvodní zdrojové soubory zůstanou nedotčeny. Tato akce je nevratná.",
    },
  },
  chat: {
    llm: {
      title: "Poskytovatel LLM pracovního prostoru",
      description:
        "Konkrétní poskytovatel LLM a model, který bude použit pro tento pracovní prostor. Ve výchozím nastavení používá systémového poskytovatele LLM a nastavení.",
      search: "Hledat všechny poskytovatele LLM",
    },
    model: {
      title: "Chatovací model pracovního prostoru",
      description:
        "Konkrétní chatovací model, který bude použit pro tento pracovní prostor. Pokud je prázdné, použije se systémová preference LLM.",
    },
    mode: {
      title: "Režim chatu",
      chat: {
        title: "Chat",
        description:
          "bude poskytovat odpovědi založené na obecných znalostech LLM a kontextu dokumentu, který je k dispozici. Budete muset použít příkaz `@agent` pro použití nástrojů.",
      },
      query: {
        title: "Dotaz",
        description:
          "budou poskytovat odpovědi <b>pouze__, pokud je nalezen kontext dokumentu.</b>Budete muset použít příkaz @agent pro použití nástrojů.",
      },
      automatic: {
        title: "Auto",
        description:
          "automaticky použije nástroje, pokud to podporují model a poskytovatel. <br />Pokud není podporováno nativní volání nástrojů, budete muset použít příkaz `@agent` pro použití nástrojů.",
      },
    },
    history: {
      title: "Historie chatu",
      "desc-start":
        "Počet předchozích chatů, které budou zahrnuty do krátkodobé paměti odpovědi.",
      recommend: "Doporučeno 20. ",
      "desc-end":
        "Více než 45 pravděpodobně povede k trvalým selháním chatu v závislosti na velikosti zprávy.",
    },
    prompt: {
      title: "Systémová výzva",
      description:
        "Výzva, která bude použita v tomto pracovním prostoru. Definujte kontext a pokyny pro AI k vygenerování odpovědi. Měli byste poskytnout pečlivě vytvořenou výzvu, aby AI mohla generovat relevantní a přesnou odpověď.",
      history: {
        title: "Historie systémových výzev",
        clearAll: "Vymazat vše",
        noHistory: "Žádná historie systémových výzev není k dispozici",
        restore: "Obnovit",
        delete: "Smazat",
        publish: "Publikovat do komunitního centra",
        deleteConfirm: "Jste si jisti, že chcete smazat tuto položku historie?",
        clearAllConfirm:
          "Jste si jisti, že chcete vymazat celou historii? Tato akce nelze vrátit zpět.",
        expand: "Rozbalit",
      },
    },
    refusal: {
      title: "Odpověď na odmítnutí v režimu dotazu",
      "desc-start": "V režimu",
      query: "dotazu",
      "desc-end":
        "možná budete chtít vrátit vlastní odpověď na odmítnutí, pokud není nalezen kontext.",
      "tooltip-title": "Proč to vidím?",
      "tooltip-description":
        "Jste v režimu dotazu, který používá pouze informace z vašich dokumentů. Přepněte na režim chatu pro flexibilnější konverzace, nebo klikněte sem a navštivte naši dokumentaci pro další informace o režimech chatu.",
    },
    temperature: {
      title: "Teplota LLM",
      "desc-start":
        'Toto nastavení řídí, jak "kreativní" budou odpovědi vašeho LLM.',
      "desc-end":
        "Vyšší číslo znamená kreativnější. U některých modelů to může vést k nesourodým odpovědím při nastavení příliš vysoko.",
      hint: "Většina LLM má různé přijatelné rozsahy platných hodnot. Poradťe se se svým poskytovatelem LLM pro tyto informace.",
    },
  },
  "vector-workspace": {
    identifier: "Identifikátor vektorové databáze",
    snippets: {
      title: "Maximum kontextových úryvků",
      description:
        "Toto nastavení řídí maximální množství kontextových úryvků, které budou odeslány do LLM pro každý chat nebo dotaz.",
      recommend: "Doporučeno: 4",
    },
    doc: {
      title: "Práh podobnosti dokumentů",
      description:
        "Minimální skóre podobnosti požadované pro zdroj, aby byl považován za související s chatem. Vyšší číslo znamená, že zdroj musí být více podobný chatu.",
      zero: "Žádné omezení",
      low: "Nízké (skóre podobnosti ≥ .25)",
      medium: "Střední (skóre podobnosti ≥ .50)",
      high: "Vysoké (skóre podobnosti ≥ .75)",
    },
    reset: {
      reset: "Resetovat vektorovou databázi",
      resetting: "Mazání vektorů...",
      confirm:
        "Chystáte se resetovat vektorovou databázi tohoto pracovního prostoru. Toto odstraní všechny vektorové embeddingy, které jsou momentálně vloženy.\n\nPůvodní zdrojové soubory zůstanou nedotčeny. Tato akce je nevratná.",
      error: "Vektorovou databázi pracovního prostoru se nepodařilo resetovat!",
      success: "Vektorová databáze pracovního prostoru byla resetována!",
    },
  },
  agent: {
    "performance-warning":
      "Výkon LLM, které explicitně nepodporují volání nástrojů, je silně závislý na schopnostech a přesnosti modelu. Některé schopnosti mohou být omezené nebo nefunkční.",
    provider: {
      title: "Poskytovatel LLM agenta pracovního prostoru",
      description:
        "Konkrétní poskytovatel LLM a model, který bude použit pro @agenta agenta tohoto pracovního prostoru.",
    },
    mode: {
      chat: {
        title: "Chatovací model agenta pracovního prostoru",
        description:
          "Konkrétní chatovací model, který bude použit pro @agenta agenta tohoto pracovního prostoru.",
      },
      title: "Model agenta pracovního prostoru",
      description:
        "Konkrétní model LLM, který bude použit pro @agenta agenta tohoto pracovního prostoru.",
      wait: "-- čekání na modely --",
    },
    skill: {
      rag: {
        title: "RAG a dlouhodobá paměť",
        description:
          'Umožněte agentovi využívat vaše místní dokumenty k odpovědi na dotaz nebo požádejte agenta, aby si "zapamatoval" části obsahu pro dlouhodobé načítání.',
      },
      view: {
        title: "Zobrazit a shrnout dokumenty",
        description:
          "Umožněte agentovi vypsat a shrnout obsah souborů pracovního prostoru, které jsou momentálně vloženy.",
      },
      scrape: {
        title: "Stahovat webové stránky",
        description:
          "Umožněte agentovi navštěvovat a stahovat obsah webových stránek.",
      },
      generate: {
        title: "Generovat grafy",
        description:
          "Umožněte výchozímu agentovi generovat různé typy grafů z dat poskytnutých nebo uvedených v chatu.",
      },
      web: {
        title: "Živé webové vyhledávání a prohlížení",
        description:
          "Umožněte svému agentovi, aby prohledával internet a odpovídal na vaše otázky, propojením se poskytovatelem vyhledávacího servisu (SERP).",
      },
      sql: {
        title: "Připojení k databázi SQL",
        description:
          "Umožněte svému agentovi, aby mohl využívat SQL k zodpovězení vašich otázek, a to prostřednictvím připojení k různým poskytovatelům databází.",
      },
      default_skill:
        "Výchozí nastavení je, že tato schopnost je aktivní, ale můžete ji vypnout, pokud nechcete, aby ji mohl využít zástupce.",
      filesystem: {
        title: "Přístup k souborovému systému",
        description:
          "Umožněte svému zástupci, aby četl, zapisoval, vyhledával a spravoval soubory v určeném adresáři. Podporuje úpravu souborů, navigaci v adresářích a vyhledávání obsahu.",
        learnMore: "Zjistěte více o tom, jak tuto dovednost používat.",
        configuration: "Konfigurace",
        readActions: "Činnosti",
        writeActions: "Akce",
        warning:
          "Přístup k souborovému systému může být nebezpečný, protože může upravovat nebo mazat soubory. Před zapnutím funkce prosím nahlédněte do dokumentace <link>dokumentace</link>.",
        skills: {
          "read-text-file": {
            title: "Otevřít soubor",
            description:
              "Přečtěte obsah souborů (text, kód, PDF, obrázky atd.)",
          },
          "read-multiple-files": {
            title: "Přečtěte více souborů",
            description: "Přečtěte více souborů najednou",
          },
          "list-directory": {
            title: "Seznam adres",
            description: "Zobraz seznam souborů a adresářů v daném adresáři.",
          },
          "search-files": {
            title: "Hledat soubory",
            description: "Vyhledejte soubory podle názvu nebo obsahu",
          },
          "get-file-info": {
            title: "Získejte informace o souboru",
            description: "Získejte podrobné metadatumy o souborech.",
          },
          "edit-file": {
            title: "Upravit soubor",
            description:
              "Proveďte úpravy v textových souborech na základě řádků.",
          },
          "create-directory": {
            title: "Vytvořit adresář",
            description: "Vytvořte nové adresáře",
          },
          "move-file": {
            title: "Přejmenovat/přesunout soubor",
            description: "Přesun nebo přejmenování souborů a adresářů",
          },
          "copy-file": {
            title: "Zkopírovat soubor",
            description: "Zkopírujte soubory a adresáře",
          },
          "write-text-file": {
            title: "Vytvořte soubor s textem",
            description:
              "Vytvořte nové textové soubory nebo přepsáním existujících textových souborů.",
          },
        },
      },
      createFiles: {
        title: "Vytváření dokumentů",
        description:
          "Umožněte svému zástupci vytvářet soubory ve formátech jako PowerPoint prezentace, tabulky v Excelu, dokumenty ve formátu Word a soubory ve formátu PDF. Soubory lze stahovat přímo z chatu.",
        configuration: "Dostupné typy dokumentů",
        skills: {
          "create-text-file": {
            title: "Soubory v textovém formátu",
            description:
              "Vytvořte textové soubory s libovolným obsahem a příponou (např. .txt, .md, .json, .csv atd.)",
          },
          "create-pptx": {
            title: "Prezentace v PowerPointu",
            description:
              "Vytvořte nové prezentace v programu PowerPoint, včetně slidů, nadpisů a odrážek.",
          },
          "create-pdf": {
            title: "Dokumenty ve formátu PDF",
            description:
              "Vytvořte PDF dokumenty z Markdownu nebo jednoduchého textu s základním formátováním.",
          },
          "create-xlsx": {
            title: "Tabulky v programu Excel",
            description:
              "Vytvořte tabulkové dokumenty v programu Excel, které budou obsahovat listy a stylování.",
          },
          "create-docx": {
            title: "Dokumenty ve formátu Word",
            description:
              "Vytvořte dokumenty ve formátu Word s základním formátováním a stylováním.",
          },
        },
      },
    },
    mcp: {
      title: "Servery společnosti MCP",
      "loading-from-config": "Načítání serverů MCP z konfiguračního souboru",
      "learn-more": "Zjistěte více o serverech MCP.",
      "no-servers-found": "Nebyl nalezen žádný server pro správu MCP.",
      "tool-warning":
        "Pro optimální výkon zvažte vypnutí nepoužívaných nástrojů, abyste ušetřili zdroje.",
      "stop-server": "Zastavte server MCP",
      "start-server": "Spustit server MCP",
      "delete-server": "Odstranit server MCP",
      "tool-count-warning":
        "Tento server pro správu chatů má povolené nástroje <b>{{count}}, které spotřebovávají kontext v každém chatu. </b> Zvažte vypnutí nepotřebných nástrojů, abyste ušetřili kontext.",
      "startup-command": "Příkaz pro spuštění",
      command: "Příkaz",
      arguments: "Argumenty",
      "not-running-warning":
        "Tento server pro správu MCP není aktivní – buď byl vypnut, nebo se při spuštění vyskytuje chyba.",
      "tool-call-arguments": "Argumenty pro volání nástroje",
      "tools-enabled": "nástroje jsou aktivovány",
    },
    settings: {
      title: "Nastavení dovedností agenta",
      "max-tool-calls": {
        title: "Maximální počet volání nástrojů na jednu odpověď",
        description:
          "Maximální počet nástrojů, které může agent spouštět v řetězci za účelem generování jedné odpovědi. To zabraňuje nekontrolovanému spouštění nástrojů a vytváření nekonečných smyček.",
      },
      "intelligent-skill-selection": {
        title: "Inteligentní výběr dovedností",
        "beta-badge": "Beta",
        description:
          "Umožněte použití libovolného počtu nástrojů a snížit využití tokenů až o 80 % pro každou dotaz — AnythingLLM automaticky vybírá vhodné dovednosti pro každou žádost.",
        "max-tools": {
          title: "Nástroje Max",
          description:
            "Maximální počet nástrojů, které lze vybrat pro každou dotaz. Doporučujeme nastavit tuto hodnotu na vyšší, pro modely s větším kontextem.",
        },
      },
    },
  },
  recorded: {
    title: "Chaty pracovních prostorů",
    description:
      "Toto jsou všechny zaznamenané chaty a zprávy, které odeslali uživatelé, seřazené podle data vytvoření.",
    export: "Exportovat",
    table: {
      id: "ID",
      by: "Odeslal",
      workspace: "Pracovní prostor",
      prompt: "Výzva",
      response: "Odpověď",
      at: "Odesláno v",
    },
  },
  customization: {
    interface: {
      title: "Předvolby rozhraní",
      description: "Nastavte své předvolby rozhraní pro AnythingLLM.",
    },
    branding: {
      title: "Značení a bílé označení",
      description:
        "Bílé označení instance AnythingLLM pomocí vlastního značení.",
    },
    chat: {
      title: "Chat",
      description: "Nastavte své předvolby chatu pro AnythingLLM.",
      auto_submit: {
        title: "Automatické odeslání hlasového vstupu",
        description: "Automaticky odeslat hlasový vstup po období ticha",
      },
      auto_speak: {
        title: "Automatické čtení odpovědí",
        description: "Automaticky číst odpovědi z AI",
      },
      spellcheck: {
        title: "Povolit kontrolu pravopisu",
        description:
          "Povolit nebo zakázat kontrolu pravopisu v poli vstupu chatu",
      },
    },
    items: {
      theme: {
        title: "Motiv",
        description: "Vyberte preferovaný barevný motiv pro aplikaci.",
      },
      "show-scrollbar": {
        title: "Zobrazit posuvník",
        description: "Povolit nebo zakázat posuvník v okně chatu.",
      },
      "support-email": {
        title: "E-mail podpory",
        description:
          "Nastavte e-mailovou adresu podpory, která má být přístupná uživatelům, když potřebují pomoc.",
      },
      "app-name": {
        title: "Název",
        description:
          "Nastavte název, který je zobrazen na přihlašovací stránce všem uživatelům.",
      },
      "display-language": {
        title: "Zobrazovací jazyk",
        description:
          "Vyberte preferovaný jazyk pro vykreslení rozhraní AnythingLLM - pokud jsou k dispozici překlady.",
      },
      logo: {
        title: "Logo značky",
        description:
          "Nahrajte své vlastní logo k zobrazení na všech stránkách.",
        add: "Přidat vlastní logo",
        recommended: "Doporučená velikost: 800 x 200",
        remove: "Odebrat",
        replace: "Nahradit",
      },
      "browser-appearance": {
        title: "Vzhled prohlížeče",
        description:
          "Přizpůsobte vzhled karty prohlížeče a názvu, když je aplikace otevřena.",
        tab: {
          title: "Název",
          description:
            "Nastavte vlastní název karty, když je aplikace otevřena v prohlížeči.",
        },
        favicon: {
          title: "Favicon",
          description: "Použít vlastní favicon pro kartu prohlížeče.",
        },
      },
      "sidebar-footer": {
        title: "Položky zápatí postranního panelu",
        description:
          "Přizpůsobte položky zápatí zobrazené na spodní části postranního panelu.",
        icon: "Ikona",
        link: "Odkaz",
      },
      "render-html": {
        title: "Vykreslit HTML v chatu",
        description:
          "Vykreslit HTML odpovědi v odpovědích asistenta.\nTo může vést k mnohem vyšší věrnosti kvality odpovědi, ale může také vést k potenciálním bezpečnostním rizikům.",
      },
    },
  },
  api: {
    title: "API klíče",
    description:
      "API klíče umožňují držiteli programově přistupovat a spravovat tuto instanci AnythingLLM.",
    link: "Přečíst dokumentaci API",
    generate: "Generovat nový API klíč",
    table: {
      key: "API klíč",
      by: "Vytvořil",
      created: "Vytvořeno",
    },
  },
  llm: {
    title: "Preferovaný LLM",
    description:
      "Toto jsou přihlašovací údaje a nastavení pro vašeho preferovaného poskytovatele chatu a embeddingu LLM. Je důležité, aby tyto klíče byly aktuální a správné, jinak AnythingLLM nebude fungovat správně.",
    provider: "Poskytovatel LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Koncový bod služby Azure",
        api_key: "API klíč",
        chat_deployment_name: "Název nasazení chatu",
        chat_model_token_limit: "Limit tokenů chatovacího modelu",
        model_type: "Typ modelu",
        model_type_tooltip:
          "Pokud vaše nasazení používá model uvažování (o1, o1-mini, o3-mini atd.), nastavte to na 'Uvažování'. Jinak se vaše požadavky chatu mohou selhat.",
        default: "Výchozí",
        reasoning: "Uvažování",
      },
    },
  },
  transcription: {
    title: "Preferovaný model přepisu",
    description:
      "Toto jsou přihlašovací údaje a nastavení pro vašeho preferovaného poskytovatele modelu přepisu. Je důležité, aby tyto klíče byly aktuální a správné, jinak mediální soubory a audio nebudou přepisovány.",
    provider: "Poskytovatel přepisu",
    "warn-start":
      "Použití místního modelu whisper na strojích s omezenou RAM nebo CPU může zastavit AnythingLLM při zpracování mediálních souborů.",
    "warn-recommend": "Doporučujeme alespoň 2GB RAM a nahrávat soubory <10Mb.",
    "warn-end": "Vestavěný model se automaticky stáhne při prvním použití.",
  },
  embedding: {
    title: "Preferovaný embedding",
    "desc-start":
      "Při použití LLM, který nativně nepodporuje engine embeddingu - možná budete muset additionally uvést přihlašovací údaje pro embeddingování textu.",
    "desc-end":
      "Embedding je proces převodu textu na vektory. Tyto přihlašovací údaje jsou nutné k převodu vašich souborů a výzev do formátu, který AnythingLLM může použít ke zpracování.",
    provider: {
      title: "Poskytovatel embeddingu",
    },
  },
  text: {
    title: "Předvolby rozdělení a chunkování textu",
    "desc-start":
      "Někdy můžete chtít změnit výchozí způsob, jakým jsou nové dokumenty děleny a chunkovány před vložením do vaší vektorové databáze.",
    "desc-end":
      "Měli byste toto nastavení měnit pouze tehdy, pokud rozumíte, jak funguje rozdělení textu a jeho vedlejší účinky.",
    size: {
      title: "Velikost chunku textu",
      description:
        "Toto je maximální délka znaků, která může být přítomna v jednom vektoru.",
      recommend: "Maximální délka embeddingového modelu je",
    },
    overlap: {
      title: "Překrytí chunků textu",
      description:
        "Toto je maximální překrytí znaků, ke které dochází během chunkování mezi dvěma sousedními chunky textu.",
    },
  },
  vector: {
    title: "Vektorová databáze",
    description:
      "Toto jsou přihlašovací údaje a nastavení, jak bude vaše instance AnythingLLM fungovat. Je důležité, aby tyto klíče byly aktuální a správné.",
    provider: {
      title: "Poskytovatel vektorové databáze",
      description: "Pro LanceDB není potřeba žádná konfigurace.",
    },
  },
  embeddable: {
    title: "Vložitelné widgety chatu",
    description:
      "Vložitelné widgety chatu jsou veřejně orientovaná rozhraní chatu spojená s jedním pracovním prostorem. Tyto vám umožňují vytvářet pracovní prostory, které pak můžete zveřejnit světu.",
    create: "Vytvořit vložení",
    table: {
      workspace: "Pracovní prostor",
      chats: "Odeslané chaty",
      active: "Aktivní domény",
      created: "Vytvořeno",
    },
  },
  "embed-chats": {
    title: "Historie vložených chatů",
    export: "Exportovat",
    description:
      "Toto jsou všechny zaznamenané chaty a zprávy z jakéhokoli vložení, které jste zveřejnili.",
    table: {
      embed: "Vložení",
      sender: "Odesílatel",
      message: "Zpráva",
      response: "Odpověď",
      at: "Odesláno v",
    },
  },
  security: {
    title: "Zabezpečení",
    multiuser: {
      title: "Režim více uživatelů",
      description:
        "Nastavte svou instanci pro podporu týmu aktivováním režimu více uživatelů.",
      enable: {
        "is-enable": "Režim více uživatelů je povolen",
        enable: "Povolit režim více uživatelů",
        description:
          "Ve výchozím nastavení budete jediným správcem. Jako správce budete muset vytvářet účty pro všechny nové uživatele nebo správce. Neztrácejte své heslo, protože pouze uživatel typu správce může resetovat hesla.",
        username: "Uživatelské jméno účtu správce",
        password: "Heslo účtu správce",
      },
    },
    password: {
      title: "Ochrana heslem",
      description:
        "Chraňte svou instanci AnythingLLM heslem. Pokud zapomenete, neexistuje způsob obnovení, proto se ujistěte, že heslo uložíte.",
      "password-label": "Heslo instance",
    },
  },
  event: {
    title: "Protokoly událostí",
    description:
      "Zobrazit všechny akce a události probíhající na této instanci pro sledování.",
    clear: "Vymazat protokoly událostí",
    table: {
      type: "Typ události",
      user: "Uživatel",
      occurred: "Nastalo v",
    },
  },
  privacy: {
    title: "Soukromí a zpracování dat",
    description:
      "Toto je vaše konfigurace, jak připojené třetí strany a AnythingLLM zpracovávají vaše data.",
    anonymous: "Anonymní telemetrie je povolena",
  },
  connectors: {
    "search-placeholder": "Hledat datové konektory",
    "no-connectors": "Nebyly nalezeny žádné datové konektory.",
    obsidian: {
      vault_location: "Umístění trezoru",
      vault_description:
        "Vyberte složku trezoru Obsidian pro import všech poznámek a jejich spojení.",
      selected_files: "Nalezeno {{count}} souborů markdown",
      importing: "Importování trezoru...",
      import_vault: "Importovat trezor",
      processing_time:
        "To může chvíli trvat v závislosti na velikosti vašeho trezoru.",
      vault_warning:
        "Aby se předešlo konfliktům, ujistěte se, že váš trezor Obsidian není momentálně otevřen.",
    },
    github: {
      name: "Úložiště GitHub",
      description:
        "Importovat celé veřejné nebo soukromé úložiště GitHub jedním kliknutím.",
      URL: "URL úložiště GitHub",
      URL_explained: "URL úložiště GitHub, které chcete sbírat.",
      token: "Přístupový token GitHub",
      optional: "volitelné",
      token_explained: "Přístupový token pro prevenci omezení rychlosti.",
      token_explained_start: "Bez ",
      token_explained_link1: "Osobního přístupového tokenu",
      token_explained_middle:
        ", API GitHub může omezit počet souborů, které lze sbírat kvůli limitům rychlosti. Můžete ",
      token_explained_link2: "vytvořit dočasný přístupový token",
      token_explained_end: " k vyhnutí se tomuto problému.",
      ignores: "Ignorované soubory",
      git_ignore:
        "Seznam ve formátu .gitignore k ignorování specifických souborů během sbírání. Stiskněte Enter po každé položce, kterou chcete uložit.",
      task_explained:
        "Po dokončení budou všechny soubory k dispozici pro vložení do pracovních prostorů ve výběru dokumentů.",
      branch: "Větev, ze které chcete sbírat soubory",
      branch_loading: "-- načítání dostupných větví --",
      branch_explained: "Větev, ze které chcete sbírat soubory.",
      token_information:
        "Bez vyplnění <b>Přístupového tokenu GitHub</b> bude tento datový konektor schopen sbírat pouze <b>nejvyšší úrovňové</b> soubory úložiště kvůli omezením veřejného API GitHub.",
      token_personal:
        "Získejte bezplatný osobní přístupový token s účtem GitHub zde.",
    },
    gitlab: {
      name: "Úložiště GitLab",
      description:
        "Importovat celé veřejné nebo soukromé úložiště GitLab jedním kliknutím.",
      URL: "URL úložiště GitLab",
      URL_explained: "URL úložiště GitLab, které chcete sbírat.",
      token: "Přístupový token GitLab",
      optional: "volitelné",
      token_description: "Vyberte další entity k načtení z API GitLab.",
      token_explained_start: "Bez ",
      token_explained_link1: "Osobního přístupového tokenu",
      token_explained_middle:
        ", API GitLab může omezit počet souborů, které lze sbírat kvůli limitům rychlosti. Můžete ",
      token_explained_link2: "vytvořit dočasný přístupový token",
      token_explained_end: " k vyhnutí se tomuto problému.",
      fetch_issues: "Načíst problémy jako dokumenty",
      ignores: "Ignorované soubory",
      git_ignore:
        "Seznam ve formátu .gitignore k ignorování specifických souborů během sbírání. Stiskněte Enter po každé položce, kterou chcete uložit.",
      task_explained:
        "Po dokončení budou všechny soubory k dispozici pro vložení do pracovních prostorů ve výběru dokumentů.",
      branch: "Větev, ze které chcete sbírat soubory",
      branch_loading: "-- načítání dostupných větví --",
      branch_explained: "Větev, ze které chcete sbírat soubory.",
      token_information:
        "Bez vyplnění <b>Přístupového tokenu GitLab</b> bude tento datový konektor schopen sbírat pouze <b>nejvyšší úrovňové</b> soubory úložiště kvůli omezením veřejného API GitLab.",
      token_personal:
        "Získejte bezplatný osobní přístupový token s účtem GitLab zde.",
    },
    youtube: {
      name: "Přepis YouTube",
      description: "Importovat přepis celého videa YouTube z odkazu.",
      URL: "URL videa YouTube",
      URL_explained_start:
        "Zadejte URL jakéhokoli videa YouTube pro stažení jeho přepisu. Video musí mít ",
      URL_explained_link: "uzavřené titulky",
      URL_explained_end: " k dispozici.",
      task_explained:
        "Po dokončení bude přepis k dispozici pro vložení do pracovních prostorů ve výběru dokumentů.",
    },
    "website-depth": {
      name: "Hromadný stahovač odkazů",
      description:
        "Stáhnout webovou stránku a její pododkazy až do určité hloubky.",
      URL: "URL webové stránky",
      URL_explained: "URL webové stránky, kterou chcete stáhnout.",
      depth: "Hloubka stahování",
      depth_explained:
        "Toto je počet pododkazů, které má pracovník následovat z původní URL.",
      max_pages: "Maximum stránek",
      max_pages_explained: "Maximální počet odkazů ke stažení.",
      task_explained:
        "Po dokončení bude veškerý stažený obsah k dispozici pro vložení do pracovních prostorů ve výběru dokumentů.",
    },
    confluence: {
      name: "Confluence",
      description: "Importovat celou stránku Confluence jedním kliknutím.",
      deployment_type: "Typ nasazení Confluence",
      deployment_type_explained:
        "Určete, zda je vaše instance Conference hostována na cloudu Atlassian nebo sama hostovaná.",
      base_url: "Základní URL Confluence",
      base_url_explained: "Toto je základní URL vašeho prostoru Confluence.",
      space_key: "Klíč prostoru Confluence",
      space_key_explained:
        "Toto je klíč prostoru vaší instance Confluence, který bude použit. Obvykle začíná s ~",
      username: "Uživatelské jméno Confluence",
      username_explained: "Vaše uživatelské jméno Confluence",
      auth_type: "Typ ověření Confluence",
      auth_type_explained:
        "Vyberte typ ověření, který chcete použít pro přístup ke svým stránkám Confluence.",
      auth_type_username: "Uživatelské jméno a přístupový token",
      auth_type_personal: "Osobní přístupový token",
      token: "Přístupový token Confluence",
      token_explained_start:
        "Musíte poskytnout přístupový token pro ověření. Můžete vygenerovat přístupový token",
      token_explained_link: "zde",
      token_desc: "Přístupový token pro ověření",
      pat_token: "Osobní přístupový token Confluence",
      pat_token_explained: "Váš osobní přístupový token Confluence.",
      bypass_ssl: "Obejití ověření certifikátu SSL",
      bypass_ssl_explained:
        "Povolte tuto možnost k obejití ověření certifikátu SSL pro samo-hostované instance Confluence s vlastnoručně podepsaným certifikátem",
      task_explained:
        "Po dokončení bude obsah stránky k dispozici pro vložení do pracovních prostorů ve výběru dokumentů.",
    },
    manage: {
      documents: "Dokumenty",
      "data-connectors": "Datové konektory",
      "desktop-only":
        "Úprava těchto nastavení je k dispozici pouze na stolním zařízení. Chcete-li pokračovat, přístupujte na tuto stránku na svém stolním počítači.",
      dismiss: "Odmítnout",
      editing: "Úprava",
    },
    directory: {
      "my-documents": "Mé dokumenty",
      "new-folder": "Nová složka",
      "search-document": "Hledat dokument",
      "no-documents": "Žádné dokumenty",
      "move-workspace": "Přesunout do pracovního prostoru",
      "delete-confirmation":
        "Jste si jisti, že chcete smazat tyto soubory a složky?\nToto odstraní soubory ze systému a automaticky je odstraní ze všech existujících pracovních prostorů.\nTato akce je nevratná.",
      "removing-message":
        "Odstraňování {{count}} dokumentů a {{folderCount}} složek. Prosím čekejte.",
      "move-success": "Úspěšně přesunuto {{count}} dokumentů.",
      no_docs: "Žádné dokumenty",
      select_all: "Vybrat vše",
      deselect_all: "Zrušit výběr všeho",
      remove_selected: "Odebrat vybrané",
      save_embed: "Uložit a vložit",
      "total-documents_one": "{{count}} dokument",
      "total-documents_other": "{{count}} dokumenty",
    },
    upload: {
      "processor-offline": "Procesor dokumentů nedostupný",
      "processor-offline-desc":
        "Nemůžeme nahrát vaše soubory právě teď, protože procesor dokumentů je offline. Zkuste to prosím později.",
      "click-upload": "Klikněte pro nahrání nebo přetažení a upuštění",
      "file-types":
        "podporuje textové soubory, csv, tabulky, zvukové soubory a další!",
      "or-submit-link": "nebo odeslat odkaz",
      "placeholder-link": "https://example.com",
      fetching: "Načítání...",
      "fetch-website": "Stáhnout webovou stránku",
      "privacy-notice":
        "Tyto soubory budou nahrány na procesor dokumentů běžící na této instanci AnythingLLM. Tyto soubory nejsou odesílány nebo sdíleny s třetí stranou.",
    },
    pinning: {
      what_pinning: "Co je připínání dokumentů?",
      pin_explained_block1:
        "Když <b>připnete</b> dokument v AnythingLLM, vložíme celý obsah dokumentu do vašeho okna výzvy, aby ho LLM plně pochopil.",
      pin_explained_block2:
        "To funguje nejlépe s <b>modely s velkým kontextem</b> nebo malými soubory, které jsou kritické pro jejich znalostní základ.",
      pin_explained_block3:
        "Pokud nedostáváte odpovědi, které si přejete od AnythingLLM ve výchozím nastavení, pak připínání je skvělý způsob získání kvalitnějších odpovědí jedním kliknutím.",
      accept: "OK, rozumím",
    },
    watching: {
      what_watching: "Co dělá sledování dokumentu?",
      watch_explained_block1:
        "Když <b>sledujete</b> dokument v AnythingLLM, <i>automaticky</i> synchronizujeme obsah dokumentu z jeho původního zdroje v pravidelných intervalech. Tím se automaticky aktualizuje obsah v každém pracovním prostoru, kde je tento soubor spravován.",
      watch_explained_block2:
        "Tato funkce v současné době podporuje onlineový obsah a nebude k dispozici pro ručně nahrané dokumenty.",
      watch_explained_block3_start:
        "Můžete spravovat, které dokumenty jsou sledovány z ",
      watch_explained_block3_link: "Správce souborů",
      watch_explained_block3_end: " zobrazení správce.",
      accept: "OK, rozumím",
    },
  },
  chat_window: {
    attachments_processing: "Přílohy se zpracovávají. Prosím čekejte...",
    send_message: "Odeslat zprávu",
    attach_file: "Přiložit soubor k tomuto chatu",
    text_size: "Změnit velikost textu.",
    microphone: "Mluvit svou výzvu.",
    send: "Odeslat zprávu výzvy do pracovního prostoru",
    tts_speak_message: "TTS Číst zprávu",
    copy: "Kopírovat",
    regenerate: "Regenerovat",
    regenerate_response: "Regenerovat odpověď",
    good_response: "Dobrá odpověď",
    more_actions: "Další akce",
    fork: "Rozdělit",
    delete: "Smazat",
    cancel: "Zrušit",
    edit_prompt: "Upravit výzvu",
    edit_response: "Upravit odpověď",
    preset_reset_description: "Vymazat historii chatu a začít nový chat",
    add_new_preset: " Přidat novou předvolbu",
    command: "Příkaz",
    your_command: "váš-příkaz",
    placeholder_prompt: "Toto je obsah, který bude vložen před vaší výzvou.",
    description: "Popis",
    placeholder_description: "Odpovídá básní o LLM.",
    save: "Uložit",
    small: "Malé",
    normal: "Normální",
    large: "Velké",
    workspace_llm_manager: {
      search: "Hledat poskytovatele LLM",
      loading_workspace_settings: "Načítání nastavení pracovního prostoru...",
      available_models: "Dostupné modely pro {{provider}}",
      available_models_description:
        "Vyberte model k použití pro tento pracovní prostor.",
      save: "Použít tento model",
      saving: "Nastavování modelu jako výchozího pro pracovní prostor...",
      missing_credentials: "Tomuto poskytovateli chybí přihlašovací údaje!",
      missing_credentials_description:
        "Klikněte pro nastavení přihlašovacích údajů",
    },
    submit: "Odeslat",
    edit_info_user:
      "„Odeslat“ znovu vygeneruje odpověď od AI. „Uložit“ aktualizuje pouze vaši zprávu.",
    edit_info_assistant: "Vaše změny budou uloženy přímo v tomto odpovědi.",
    see_less: "Zobrazit méně",
    see_more: "Více",
    tools: "Nářadí",
    text_size_label: "Velikost písma",
    select_model: "Vyberte model",
    sources: "Zdroje",
    document: "Dokument",
    similarity_match: "zápas",
    source_count_one: "{{count}} – odkaz",
    source_count_other: "{{count}} – odkazy",
    preset_exit_description: "Zastavte aktuální relaci s agentem",
    add_new: "Přidat nové",
    edit: "Upravit",
    publish: "Publikovat",
    stop_generating: "Zastavte generování odpovědi",
    slash_commands: "Příkazy v řádku",
    agent_skills: "Dovednosti agenta",
    manage_agent_skills: "Řízení dovedností agentů",
    agent_skills_disabled_in_session:
      "Není možné upravovat dovednosti během aktivního sezení s agentem. Nejprve použijte příkaz `/exit` pro ukončení sezení.",
    start_agent_session: "Spustit relaci s agentem",
    use_agent_session_to_use_tools:
      "Můžete využít nástroje v chatu spuštěním sezení s agentem pomocí příkazu '@agent' na začátku vašeho vstupu.",
    agent_invocation: {
      model_wants_to_call: "Model chce zavolat",
      approve: "Schválit",
      reject: "Zamítnout",
      always_allow: "Vždy dbejte na to, aby {{skillName}}",
      tool_call_was_approved: "Žádost o použití nástroje byla schválena.",
      tool_call_was_rejected: "Žádost o použití nástroje byla zamítnuta.",
    },
  },
  profile_settings: {
    edit_account: "Upravit účet",
    profile_picture: "Profilový obrázek",
    remove_profile_picture: "Odebrat profilový obrázek",
    username: "Uživatelské jméno",
    new_password: "Nové heslo",
    password_description: "Heslo musí mít délku alespoň 8 znaků",
    cancel: "Zrušit",
    update_account: "Aktualizovat účet",
    theme: "Preferovaný motiv",
    language: "Preferovaný jazyk",
    failed_upload: "Nepodařilo se nahrát profilový obrázek: {{error}}",
    upload_success: "Profilový obrázek nahrán.",
    failed_remove: "Nepodařilo se odebrat profilový obrázek: {{error}}",
    profile_updated: "Profil aktualizován.",
    failed_update_user: "Nepodařilo se aktualizovat uživatele: {{error}}",
    account: "Účet",
    support: "Podpora",
    signout: "Odhlásit",
  },
  "keyboard-shortcuts": {
    title: "Klávesové zkratky",
    shortcuts: {
      settings: "Otevřít nastavení",
      workspaceSettings: "Otevřít nastavení aktuálního pracovního prostoru",
      home: "Přejít domů",
      workspaces: "Spravovat pracovní prostory",
      apiKeys: "Nastavení API klíčů",
      llmPreferences: "Preference LLM",
      chatSettings: "Nastavení chatu",
      help: "Zobrazit nápovědu klávesových zkratek",
      showLLMSelector: "Zobrazit výběr LLM pracovního prostoru",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Úspěch!",
        success_description:
          "Vaše systémová výzva byla publikována do komunitního centra!",
        success_thank_you: "Děkujeme za sdílení s komunitou!",
        view_on_hub: "Zobrazit v komunitním centru",
        modal_title: "Publikovat systémovou výzvu",
        name_label: "Název",
        name_description: "Toto je zobrazovaný název vaší systémové výzvy.",
        name_placeholder: "Moje systémová výzva",
        description_label: "Popis",
        description_description:
          "Toto je popis vaší systémové výzvy. Použijte k popisu účelu vaší systémové výzvy.",
        tags_label: "Štítky",
        tags_description:
          "Štítky slouží k označení vaší systémové výzvy pro snadnější vyhledávání. Můžete přidat více štítků. Max 5 štítků. Max 20 znaků na štítek.",
        tags_placeholder: "Zadejte a stiskněte Enter pro přidání štítků",
        visibility_label: "Viditelnost",
        public_description: "Veřejné systémové výzvy jsou viditelné všem.",
        private_description:
          "Soukromé systémové výzvy jsou viditelné pouze vám.",
        publish_button: "Publikovat do komunitního centra",
        submitting: "Publikování...",
        prompt_label: "Výzva",
        prompt_description:
          "Toto je skutečná systémová výzva, která bude použita k vedení LLM.",
        prompt_placeholder: "Zadejte svou systémovou výzvu zde...",
      },
      agent_flow: {
        success_title: "Úspěch!",
        success_description:
          "Váš tok agenta byl publikován do komunitního centra!",
        success_thank_you: "Děkujeme za sdílení s komunitou!",
        view_on_hub: "Zobrazit v komunitním centru",
        modal_title: "Publikovat tok agenta",
        name_label: "Název",
        name_description: "Toto je zobrazovaný název vašeho toku agenta.",
        name_placeholder: "Můj tok agenta",
        description_label: "Popis",
        description_description:
          "Toto je popis vašeho toku agenta. Použijte k popisu účelu vašeho toku agenta.",
        tags_label: "Štítky",
        tags_description:
          "Štítky slouží k označení vašeho toku agenta pro snadnější vyhledávání. Můžete přidat více štítků. Max 5 štítků. Max 20 znaků na štítek.",
        tags_placeholder: "Zadejte a stiskněte Enter pro přidání štítků",
        visibility_label: "Viditelnost",
        submitting: "Publikování...",
        submit: "Publikovat do komunitního centra",
        privacy_note:
          "Toky agentů jsou vždy nahrávány jako soukromé pro ochranu jakýchkoli citlivých dat. Viditelnost můžete změnit v komunitním centru po publikování. Prosím ověřte, že váš tok neobsahuje žádné citlivé nebo soukromé informace před publikováním.",
      },
      slash_command: {
        success_title: "Úspěch!",
        success_description:
          "Váš lomítkový příkaz byl publikován do komunitního centra!",
        success_thank_you: "Děkujeme za sdílení s komunitou!",
        view_on_hub: "Zobrazit v komunitním centru",
        modal_title: "Publikovat lomítkový příkaz",
        name_label: "Název",
        name_description:
          "Toto je zobrazovaný název vašeho lomítkového příkazu.",
        name_placeholder: "Můj lomítkový příkaz",
        description_label: "Popis",
        description_description:
          "Toto je popis vašeho lomítkového příkazu. Použijte k popisu účelu vašeho lomítkového příkazu.",
        tags_label: "Štítky",
        tags_description:
          "Štítky slouží k označení vašeho lomítkového příkazu pro snadnější vyhledávání. Můžete přidat více štítků. Max 5 štítků. Max 20 znaků na štítek.",
        tags_placeholder: "Zadejte a stiskněte Enter pro přidání štítků",
        visibility_label: "Viditelnost",
        public_description: "Veřejné lomítkové příkazy jsou viditelné všem.",
        private_description:
          "Soukromé lomítkové příkazy jsou viditelné pouze vám.",
        publish_button: "Publikovat do komunitního centra",
        submitting: "Publikování...",
        prompt_label: "Výzva",
        prompt_description:
          "Toto je výzva, která bude použita při spuštění lomítkového příkazu.",
        prompt_placeholder: "Zadejte svou výzvu zde...",
      },
      generic: {
        unauthenticated: {
          title: "Vyžadováno ověření",
          description:
            "Musíte se ověřit pomocí komunitního centra AnythingLLM před publikováním položek.",
          button: "Připojit se ke komunitnímu centru",
        },
      },
    },
  },
  telegram: {
    title: "Bot pro Telegram",
    description:
      "Propojte svůj instance AnythingLLM s aplikací Telegram, abyste mohli komunikovat se svými pracovními prostory odkudkoli.",
    setup: {
      step1: {
        title: "Krok 1: Vytvořte svého Telegramového robota",
        description:
          "Otevřete aplikaci @BotFather na Telegramu, odešlete příkaz `/newbot` na adresu <code>@BotFather</code>, postupujte podle pokynů a zkopírujte API token.",
        "open-botfather": "Spusťte BotFather",
        "instruction-1": "1. Otevřete odkaz nebo naskenujte QR kód",
        "instruction-2":
          "2. Pošlete <code>/newbot</code> na adresu <code>@BotFather</code>",
        "instruction-3":
          "3. Vyberte jméno a uživatelské jméno pro svého robota.",
        "instruction-4": "4. Zkopírujte API token, který obdržíte.",
      },
      step2: {
        title: "Krok 2: Připojte svého robota",
        description:
          "Vložte API token, který jste obdrželi od účtu @BotFather, a vyberte výchozí pracovní prostor, se kterým bude váš bot komunikovat.",
        "bot-token": "Token Bot",
        "default-workspace": "Výchozí pracovní prostor",
        "no-workspace":
          "Nejsou k dispozici žádné pracovní prostory. Bude vytvořeno nové.",
        connecting: "Připojování...",
        "connect-bot": "Bot pro připojení",
      },
      security: {
        title: "Doporučené bezpečnostní nastavení",
        description:
          "Pro zvýšení bezpečnosti, nakonfigurujte tyto nastavení v účtu @BotFather.",
        "disable-groups": "— Zabránit přidávání bot do skupin",
        "disable-inline":
          "— Zabraňte použití robota při vyhledávání v reálném čase.",
        "obscure-username":
          "Použijte neobvyklé uživatelské jméno pro robota, abyste snížili jeho snadnou identifikovatelnost.",
      },
      "toast-enter-token": "Prosím, zadejte token pro robota.",
      "toast-connect-failed": "Nedaří se připojit k botovi.",
    },
    connected: {
      status: "Spojené",
      "status-disconnected": "Neaktivní – token může být prošlý nebo neplatný",
      "placeholder-token": "Vložte nový token pro robota...",
      reconnect: "Znovu se spojit",
      workspace: "Pracovní prostor",
      "bot-link": "Odkaz na robota",
      "voice-response": "Reakce na hlasový vstup",
      disconnecting: "Odpojování...",
      disconnect: "Odpojit",
      "voice-text-only": "Pouze text",
      "voice-mirror":
        "Zrcadlo (odpovězte hlasem, když uživatel pošle hlasovou zprávu)",
      "voice-always":
        "Vždy uveďte zvukový záznam (odesílejte zvukový záznam ke každé odpovědi)",
      "toast-disconnect-failed": "Nepodařilo se odpojit automat.",
      "toast-reconnect-failed": "Nedaří se znovu navázat spojení s botem.",
      "toast-voice-failed": "Nepodařilo se aktualizovat hlasový režim.",
      "toast-approve-failed": "Neúspěšné schválení uživatele.",
      "toast-deny-failed": "Nezucceededo v odmítnutí uživatele.",
      "toast-revoke-failed": "Nezdařilo se zrušit uživatelskou účet.",
    },
    users: {
      "pending-title": "Čeká na schválení",
      "pending-description":
        "Uživatelé, kteří čekají na ověření. Porovnejte kód pro spárování, který je zde uveden, s tím, který je zobrazen v jejich chatu na Telegramu.",
      "approved-title": "Schválení uživatelů",
      "approved-description":
        "Uživatelé, kteří byli schváleni pro komunikaci s vaším botem.",
      user: "Uživatel",
      "pairing-code": "Kód pro párování",
      "no-pending": "Žádné čekající požadavky",
      "no-approved": "Žádní registrovaní uživatelé",
      unknown: "Neznámé",
      approve: "Schválit",
      deny: "Odmítnout",
      revoke: "Zrušit",
    },
  },
};

export default TRANSLATIONS;
