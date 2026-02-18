// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Laipni lūgti",
      getStarted: "Sākt darbu",
    },
    llm: {
      title: "LLM preferences",
      description:
        "AnythingLLM var strādāt ar daudziem LLM pakalpojumu sniedzējiem. Šis būs pakalpojums, kas apstrādās sarunas.",
    },
    userSetup: {
      title: "Lietotāja iestatīšana",
      description: "Konfigurējiet savus lietotāja iestatījumus.",
      howManyUsers: "Cik daudz lietotāju izmantos šo instanci?",
      justMe: "Tikai es",
      myTeam: "Mana komanda",
      instancePassword: "Instances parole",
      setPassword: "Vai vēlaties iestatīt paroli?",
      passwordReq: "Parolēm jābūt vismaz 8 rakstzīmes garām.",
      passwordWarn: "Svarīgi saglabāt šo paroli, jo nav atjaunošanas metodes.",
      adminUsername: "Administratora konta lietotājvārds",
      adminPassword: "Administratora konta parole",
      adminPasswordReq: "Parolēm jābūt vismaz 8 rakstzīmes garām.",
      teamHint:
        "Pēc noklusējuma jūs būsiet vienīgais administrators. Kad ievadīšana būs pabeigta, jūs varēsiet izveidot un uzaicināt citus būt par lietotājiem vai administratoriem. Neaizmirstiet savu paroli, jo tikai administratori var atiestatīt paroles.",
    },
    data: {
      title: "Datu apstrāde un privātums",
      description:
        "Mēs esam apņēmušies nodrošināt caurskatāmību un kontroli pār jūsu personīgajiem datiem.",
      settingsHint:
        "Šos iestatījumus var pārkonfigurēt jebkurā laikā iestatījumos.",
    },
    survey: {
      title: "Laipni lūgti AnythingLLM",
      description:
        "Palīdziet mums veidot AnythingLLM atbilstoši jūsu vajadzībām. Neobligāti.",
      email: "Kāds ir jūsu e-pasts?",
      useCase: "Kam izmantosiet AnythingLLM?",
      useCaseWork: "Darbam",
      useCasePersonal: "Personīgai lietošanai",
      useCaseOther: "Citam nolūkam",
      comment: "Kā jūs uzzinājāt par AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube utt. - Ļaujiet mums zināt, kā jūs mūs atradāt!",
      skip: "Izlaist aptauju",
      thankYou: "Paldies par jūsu atsauksmi!",
    },
    workspace: {
      title: "Izveidojiet savu pirmo darba telpu",
      description:
        "Izveidojiet savu pirmo darba telpu un sāciet darbu ar AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Darba telpas nosaukums",
    error: "kļūda",
    success: "veiksmīgi",
    user: "Lietotājs",
    selection: "Modeļa izvēle",
    saving: "Saglabā...",
    save: "Saglabāt izmaiņas",
    previous: "Iepriekšējā lapa",
    next: "Nākamā lapa",
    optional: "Neobligāti",
    yes: "Jā",
    no: "Nē",
    search: "Meklēšana",
    username_requirements:
      "Lietotājvārdam jābūt 2–32 rakstzīmju garam, jāsākas ar mazo burtu un jāsatur tikai mazie burti, cipari, apakšsvītras, domuzīmes un punkti.",
  },
  settings: {
    title: "Instances iestatījumi",
    system: "Vispārīgie iestatījumi",
    invites: "Ielūgumi",
    users: "Lietotāji",
    workspaces: "Darba telpas",
    "workspace-chats": "Darba telpas sarunas",
    customization: "Pielāgošana",
    interface: "UI preferences",
    branding: "Zīmolraide un identitāte",
    chat: "Sarunas",
    "api-keys": "Izstrādātāja API",
    llm: "LLM",
    transcription: "Transkripcija",
    embedder: "Embedder",
    "text-splitting": "Teksta sadalītājs un sadrumstalošana",
    "voice-speech": "Balss un runa",
    "vector-database": "Vektoru datubāze",
    embeds: "Sarunas ietvere",
    "embed-chats": "Sarunas ietveres vēsture",
    security: "Drošība",
    "event-logs": "Notikumu žurnāli",
    privacy: "Privātums un dati",
    "ai-providers": "AI pakalpojumu sniedzēji",
    "agent-skills": "Aģenta prasmes",
    admin: "Administrators",
    tools: "Rīki",
    "system-prompt-variables": "Sistēmas uzvednes mainīgie",
    "experimental-features": "Eksperimentālās funkcijas",
    contact: "Sazināties ar atbalstu",
    "browser-extension": "Pārlūka paplašinājums",
    "mobile-app": "AnythingLLM mobilā versija",
  },
  login: {
    "multi-user": {
      welcome: "Laipni lūgti",
      "placeholder-username": "Lietotājvārds",
      "placeholder-password": "Parole",
      login: "Ielogoties",
      validating: "Validē...",
      "forgot-pass": "Aizmirsi paroli",
      reset: "Atiestatīt",
    },
    "sign-in": "Piesakieties savā {{appName}} kontā.",
    "password-reset": {
      title: "Paroles atiestatīšana",
      description:
        "Sniedziet nepieciešamo informāciju zemāk, lai atiestatītu savu paroli.",
      "recovery-codes": "Atjaunošanas kodi",
      "recovery-code": "Atjaunošanas kods {{index}}",
      "back-to-login": "Atpakaļ uz pieteikšanos",
    },
  },
  "main-page": {
    noWorkspaceError: "Lūdzu izveidojiet darba telpu pirms sarunas sākšanas.",
    checklist: {
      title: "Darba sākšana",
      tasksLeft: "atlikušie uzdevumi",
      completed: "Jūs esat ceļā, lai kļūtu par AnythingLLM ekspertu!",
      dismiss: "aizvērt",
      tasks: {
        create_workspace: {
          title: "Izveidot darba telpu",
          description: "Izveidojiet savu pirmo darba telpu, lai sāktu",
          action: "Izveidot",
        },
        send_chat: {
          title: "Nosūtīt sarunu",
          description: "Sāciet sarunu ar savu AI asistentu",
          action: "Saruna",
        },
        embed_document: {
          title: "Iegult dokumentu",
          description: "Pievienojiet savu pirmo dokumentu darba telpai",
          action: "Iegult",
        },
        setup_system_prompt: {
          title: "Iestatīt sistēmas uzvedni",
          description: "Konfigurējiet sava AI asistenta uzvedību",
          action: "Iestatīt",
        },
        define_slash_command: {
          title: "Definēt slīpsvītras komandu",
          description: "Izveidojiet pielāgotas komandas savam asistentam",
          action: "Definēt",
        },
        visit_community: {
          title: "Apmeklēt kopienas centru",
          description: "Izpētiet kopienas resursus un veidnes",
          action: "Pārlūkot",
        },
      },
    },
    quickLinks: {
      title: "Ātrās saites",
      sendChat: "Sūtīt sarunu",
      embedDocument: "Iegult dokumentu",
      createWorkspace: "Izveidot darba telpu",
    },
    exploreMore: {
      title: "Izpētiet vairāk funkciju",
      features: {
        customAgents: {
          title: "Pielāgoti AI aģenti",
          description:
            "Veidojiet spēcīgus AI aģentus un automatizācijas bez koda.",
          primaryAction: "Sarunāties izmantojot @agent",
          secondaryAction: "Veidot aģenta plūsmu",
        },
        slashCommands: {
          title: "Slīpsvītras komandas",
          description:
            "Ietaupiet laiku un ievietojiet uzvednes izmantojot pielāgotas slīpsvītras komandas.",
          primaryAction: "Izveidot slīpsvītras komandu",
          secondaryAction: "Izpētīt centrā",
        },
        systemPrompts: {
          title: "Sistēmas uzvednes",
          description:
            "Modificējiet sistēmas uzvedni, lai pielāgotu AI atbildes darba telpā.",
          primaryAction: "Modificēt sistēmas uzvedni",
          secondaryAction: "Pārvaldīt uzvednes mainīgos",
        },
      },
    },
    announcements: {
      title: "Atjauninājumi un paziņojumi",
    },
    resources: {
      title: "Resursi",
      links: {
        docs: "Dokumentācija",
        star: "Zvaigzne GitHub",
      },
      keyboardShortcuts: "Taustiņu atvieglojumi",
    },
  },
  "new-workspace": {
    title: "Jauna darba telpa",
    placeholder: "Mana darba telpa",
  },
  "workspaces—settings": {
    general: "Vispārīgie iestatījumi",
    chat: "Sarunas iestatījumi",
    vector: "Vektoru datubāze",
    members: "Dalībnieki",
    agent: "Aģenta konfigurācija",
  },
  general: {
    vector: {
      title: "Vektoru skaits",
      description: "Kopējais vektoru skaits jūsu vektoru datubāzē.",
    },
    names: {
      description: "Tas mainīs tikai jūsu darba telpas attēlojamo nosaukumu.",
    },
    message: {
      title: "Ieteiktās sarunas ziņas",
      description:
        "Pielāgojiet ziņas, kas tiks ieteiktas jūsu darba telpas lietotājiem.",
      add: "Pievienot jaunu ziņu",
      save: "Saglabāt ziņas",
      heading: "Izskaidro man",
      body: "AnythingLLM priekšrocības",
    },
    pfp: {
      title: "Asistenta profila attēls",
      description: "Pielāgojiet asistenta profila attēlu šai darba telpai.",
      image: "Darba telpas attēls",
      remove: "Noņemt darba telpas attēlu",
    },
    delete: {
      title: "Dzēst darba telpu",
      description:
        "Dzēst šo darba telpu un visus tās datus. Tas dzēsīs darba telpu visiem lietotājiem.",
      delete: "Dzēst darba telpu",
      deleting: "Dzēš darba telpu...",
      "confirm-start": "Jūs gatavojaties dzēst visu savu",
      "confirm-end":
        "darba telpu. Tas noņems visus vektoru iegulšanas jūsu vektoru datubāzē.\n\nOriģinālie avota faili paliks neskartie. Šī darbība ir neatgriezeniska.",
    },
  },
  chat: {
    llm: {
      title: "Darba telpas LLM pakalpojumu sniedzējs",
      description:
        "Konkrētais LLM pakalpojumu sniedzējs un modelis, kas tiks izmantots šai darba telpai. Pēc noklusējuma tas izmanto sistēmas LLM pakalpojumu sniedzēju un iestatījumus.",
      search: "Meklēt visus LLM pakalpojumu sniedzējus",
    },
    model: {
      title: "Darba telpas sarunas modelis",
      description:
        "Konkrētais sarunas modelis, kas tiks izmantots šai darba telpai. Ja tukšs, izmantos sistēmas LLM preferences.",
      wait: "-- gaida modeļus --",
    },
    mode: {
      title: "Sarunas režīms",
      chat: {
        title: "Saruna",
        "desc-start": "sniegs atbildes ar LLM vispārējām zināšanām",
        and: "un",
        "desc-end": "dokumentu kontekstu, kas tiek atrasts.",
      },
      query: {
        title: "Vaicājums",
        "desc-start": "sniegs atbildes",
        only: "tikai",
        "desc-end": "ja tiek atrasts dokumentu konteksts.",
      },
    },
    history: {
      title: "Sarunu vēsture",
      "desc-start":
        "Iepriekšējo sarunu skaits, kas tiks iekļauts atbildes īslaicīgajā atmiņā.",
      recommend: "Ieteicams 20. ",
      "desc-end":
        "Vairāk nekā 45 var novest pie nepārtrauktām sarunu kļūmēm atkarībā no ziņojuma izmēra.",
    },
    prompt: {
      title: "Sistēmas uzvedne",
      description:
        "Uzvedne, kas tiks izmantota šajā darba telpā. Definējiet kontekstu un instrukcijas AI, lai ģenerētu atbildi. Jums vajadzētu nodrošināt rūpīgi izstrādātu uzvedni, lai AI varētu ģenerēt atbilstošu un precīzu atbildi.",
      history: {
        title: "Sistēmas uzvednes vēsture",
        clearAll: "Notīrīt visu",
        noHistory: "Nav pieejama sistēmas uzvednes vēsture",
        restore: "Atjaunot",
        delete: "Dzēst",
        deleteConfirm: "Vai tiešām vēlaties dzēst šo vēstures ierakstu?",
        clearAllConfirm:
          "Vai tiešām vēlaties nodzēst visu vēsturi? Šo darbību nevar atsaukt.",
        expand: "Paplašināt",
        publish: "Publicē savu saturu Community Hub.",
      },
    },
    refusal: {
      title: "Vaicājuma režīma atteikuma atbilde",
      "desc-start": "Kad",
      query: "vaicājuma",
      "desc-end":
        "režīmā, jūs varētu vēlēties atgriezt pielāgotu atteikuma atbildi, kad konteksts nav atrasts.",
      "tooltip-title": "Kāpēc es to redzu?",
      "tooltip-description":
        "Jūs atrodaties meklēšanas režīmā, kas izmanto tikai informāciju no jūsu dokumentiem. Izmantojiet runas režīmu, lai nodrošinātu elastīgākas sarunas, vai noklikšķiniet šeit, lai apmeklētu mūsu dokumentāciju un iegūtu vairāk informācijas par runas režīmiem.",
    },
    temperature: {
      title: "LLM Temperatūra",
      "desc-start":
        'Šis iestatījums kontrolē, cik "radošas" būs jūsu LLM atbildes.',
      "desc-end":
        "Jo lielāks skaitlis, jo radošākas atbildes. Dažiem modeļiem tas var novest pie nesaprotamām atbildēm, ja iestatīts pārāk augsts.",
      hint: "Lielākajai daļai LLM ir dažādi pieņemami derīgo vērtību diapazoni. Konsultējieties ar savu LLM pakalpojumu sniedzēju par šo informāciju.",
    },
  },
  "vector-workspace": {
    identifier: "Vektoru datubāzes identifikators",
    snippets: {
      title: "Maksimālie konteksta fragmenti",
      description:
        "Šis iestatījums kontrolē maksimālo konteksta fragmentu skaitu, kas tiks nosūtīti LLM katrai sarunai vai vaicājumam.",
      recommend: "Ieteicams: 4",
    },
    doc: {
      title: "Dokumentu līdzības slieksnis",
      description:
        "Minimālais līdzības rādītājs, kas nepieciešams, lai avots tiktu uzskatīts par saistītu ar sarunu. Jo lielāks skaitlis, jo līdzīgākam avotam jābūt sarunai.",
      zero: "Bez ierobežojuma",
      low: "Zems (līdzības vērtējums ≥ .25)",
      medium: "Vidējs (līdzības vērtējums ≥ .50)",
      high: "Augsts (līdzības vērtējums ≥ .75)",
    },
    reset: {
      reset: "Atiestatīt vektoru datubāzi",
      resetting: "Notīra vektorus...",
      confirm:
        "Jūs gatavojaties atiestatīt šīs darba telpas vektoru datubāzi. Tas noņems visas pašlaik iegultās vektoru iegulšanas.\n\nOriģinālie avota faili paliks neskartie. Šī darbība ir neatgriezeniska.",
      error: "Darba telpas vektoru datubāzi nevarēja atiestatīt!",
      success: "Darba telpas vektoru datubāze tika atiestatīta!",
    },
  },
  agent: {
    "performance-warning":
      "LLM, kas tieši neatbalsta rīku izsaukumus, veiktspēja ir ļoti atkarīga no modeļa iespējām un precizitātes. Dažas iespējas var būt ierobežotas vai nefunkcionālas.",
    provider: {
      title: "Darba telpas aģenta LLM pakalpojumu sniedzējs",
      description:
        "Konkrētais LLM pakalpojumu sniedzējs un modelis, kas tiks izmantots šīs darba telpas @agent aģentam.",
    },
    mode: {
      chat: {
        title: "Darba telpas aģenta sarunas modelis",
        description:
          "Konkrētais sarunas modelis, kas tiks izmantots šīs darba telpas @agent aģentam.",
      },
      title: "Darba telpas aģenta modelis",
      description:
        "Konkrētais LLM modelis, kas tiks izmantots šīs darba telpas @agent aģentam.",
      wait: "-- gaida modeļus --",
    },
    skill: {
      title: "Noklusējuma aģenta prasmes",
      description:
        "Uzlabojiet noklusējuma aģenta dabiskās spējas ar šīm iepriekš izveidotajām prasmēm. Šis uzstādījums attiecas uz visām darba telpām.",
      rag: {
        title: "RAG un ilgtermiņa atmiņa",
        description:
          'Ļaujiet aģentam izmantot jūsu lokālos dokumentus, lai atbildētu uz vaicājumu, vai lūdziet aģentu "atcerēties" satura daļas ilgtermiņa atmiņas izguvei.',
      },
      view: {
        title: "Skatīt un apkopot dokumentus",
        description:
          "Ļaujiet aģentam uzskaitīt un apkopot pašlaik iegulto darba telpas failu saturu.",
      },
      scrape: {
        title: "Iegūt tīmekļa vietnes",
        description: "Ļaujiet aģentam apmeklēt un iegūt tīmekļa vietņu saturu.",
      },
      generate: {
        title: "Ģenerēt diagrammas",
        description:
          "Iespējot noklusējuma aģentam ģenerēt dažāda veida diagrammas no sarunā sniegtajiem vai dotajiem datiem.",
      },
      save: {
        title: "Ģenerēt un saglabāt failus pārlūkā",
        description:
          "Iespējot noklusējuma aģentam ģenerēt un rakstīt failus, kas saglabājas un var tikt lejupielādēti jūsu pārlūkā.",
      },
      web: {
        title: "Tiešsaistes tīmekļa meklēšana un pārlūkošana",
        "desc-start":
          "Ļaujiet savam aģentam meklēt tīmeklī, lai atbildētu uz jūsu jautājumiem, savienojoties ar tīmekļa meklēšanas (SERP) pakalpojumu sniedzēju.",
        "desc-end":
          "Tīmekļa meklēšana aģenta sesijās nedarbosies, līdz tas nebūs iestatīts.",
      },
    },
  },
  recorded: {
    title: "Darba telpas sarunas",
    description:
      "Šīs ir visas ierakstītās sarunas un ziņas, ko lietotāji ir nosūtījuši, sakārtotas pēc to izveides datuma.",
    export: "Eksportēt",
    table: {
      id: "ID",
      by: "Nosūtīja",
      workspace: "Darba telpa",
      prompt: "Uzvedne",
      response: "Atbilde",
      at: "Nosūtīts",
    },
  },
  customization: {
    interface: {
      title: "UI preferences",
      description: "Iestatiet savas UI preferences AnythingLLM.",
    },
    branding: {
      title: "Zīmolrade un identitāte",
      description:
        "Pielāgojiet savu AnythingLLM instanci ar pielāgotu zīmolradi.",
    },
    chat: {
      title: "Saruna",
      description: "Iestatiet savas sarunas preferences AnythingLLM.",
      auto_submit: {
        title: "Automātiski iesniegt runas ievadi",
        description: "Automātiski iesniegt runas ievadi pēc klusuma perioda",
      },
      auto_speak: {
        title: "Automātiski runāt atbildes",
        description: "Automātiski runāt atbildes no AI",
      },
      spellcheck: {
        title: "Iespējot pareizrakstības pārbaudi",
        description:
          "Iespējot vai atspējot pareizrakstības pārbaudi sarunas ievades laukā",
      },
    },
    items: {
      theme: {
        title: "Tēma",
        description: "Izvēlieties vēlamo krāsu tēmu lietotnei.",
      },
      "show-scrollbar": {
        title: "Rādīt ritjoslu",
        description: "Iespējot vai atspējot ritjoslu sarunas logā.",
      },
      "support-email": {
        title: "Atbalsta e-pasts",
        description:
          "Iestatiet atbalsta e-pasta adresi, kam lietotājiem jābūt pieejamam, kad viņiem nepieciešama palīdzība.",
      },
      "app-name": {
        title: "Nosaukums",
        description:
          "Iestatiet nosaukumu, kas tiek rādīts pieteikšanās lapā visiem lietotājiem.",
      },
      "chat-message-alignment": {
        title: "Sarunas ziņu līdzinājums",
        description:
          "Izvēlieties ziņu līdzinājuma režīmu, izmantojot sarunas saskarni.",
      },
      "display-language": {
        title: "Displeja valoda",
        description:
          "Izvēlieties vēlamo valodu AnythingLLM lietotāja saskarnei - kad pieejami tulkojumi.",
      },
      logo: {
        title: "Zīmola logotips",
        description:
          "Augšupielādējiet savu pielāgoto logotipu, lai to rādītu visās lapās.",
        add: "Pievienot pielāgotu logotipu",
        recommended: "Ieteicamais izmērs: 800 x 200",
        remove: "Noņemt",
        replace: "Aizvietot",
      },
      "welcome-messages": {
        title: "Sveiciena ziņojumi",
        description:
          "Pielāgojiet sveiciena ziņojumus, kas tiek rādīti lietotājiem. Tikai ne-administratori redzēs šos ziņojumus.",
        new: "Jauns",
        system: "sistēma",
        user: "lietotājs",
        message: "ziņojums",
        assistant: "AnythingLLM čata asistents",
        "double-click": "Dubultklikšķis, lai rediģētu...",
        save: "Saglabāt ziņojumus",
      },
      "browser-appearance": {
        title: "Pārlūkprogrammas izskats",
        description:
          "Pielāgojiet pārlūkprogrammas cilnes izskatu un nosaukumu, kad lietotne ir atvērta.",
        tab: {
          title: "Nosaukums",
          description:
            "Iestatiet pielāgotu cilnes nosaukumu, kad lietotne ir atvērta pārlūkprogrammā.",
        },
        favicon: {
          title: "Favicon",
          description: "Izmantojiet pielāgotu favicon pārlūkprogrammas cilnei.",
        },
      },
      "sidebar-footer": {
        title: "Sānu joslas kājenes vienumi",
        description:
          "Pielāgojiet kājenes vienumus, kas tiek attēloti sānu joslas apakšā.",
        icon: "Ikona",
        link: "Saite",
      },
      "render-html": {
        title: "Izveidot HTML saturu, ko var izmantot čatā.",
        description:
          "Ievietojiet HTML atbildes palīdzības atbildēs.\nTas var novērst daudz augstāku atbildes kvalitātes līmeni, taču arī var radīt potenciālas drošības riskus.",
      },
    },
  },
  api: {
    title: "API atslēgas",
    description:
      "API atslēgas ļauj to īpašniekam programmatiski piekļūt un pārvaldīt šo AnythingLLM instanci.",
    link: "Lasīt API dokumentāciju",
    generate: "Ģenerēt jaunu API atslēgu",
    table: {
      key: "API atslēga",
      by: "Izveidoja",
      created: "Izveidots",
    },
  },
  llm: {
    title: "LLM preferences",
    description:
      "Šie ir akreditācijas dati un iestatījumi jūsu vēlamajam LLM čata un iegulšanas pakalpojuma sniedzējam. Ir svarīgi, lai šīs atslēgas būtu aktuālas un pareizas, pretējā gadījumā AnythingLLM nedarbosies pareizi.",
    provider: "LLM pakalpojuma sniedzējs",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure pakalpojuma gala punkts",
        api_key: "API atslēņa",
        chat_deployment_name: "Izvietošanas nosaukums",
        chat_model_token_limit:
          'Žurnāla "The Guardian" raksts "How to build a sustainable city" ("Kā izveidot ilgtspējīgu pilsētu")\n\n\nŽurnāla "The Guardian" raksts "How to build a sustainable city" ("Kā izveidot ilgtspējīgu pilsētu")',
        model_type: "Modeļa veids",
        default: "Standarta",
        reasoning: "Pamatojums",
        model_type_tooltip:
          'Ja jūsu lietojums izmanto loģiskā modelī (o1, o1-mini, o3-mini utt.), norādiet, ka tas ir "Loģisks". Citi gadījumā jūsu sarunu pieprasījumi var neizpildīties.',
      },
    },
  },
  transcription: {
    title: "Transkripcijas modeļa preferences",
    description:
      "Šie ir akreditācijas dati un iestatījumi jūsu vēlamajam transkripcijas modeļa pakalpojuma sniedzējam. Ir svarīgi, lai šīs atslēgas būtu aktuālas un pareizas, pretējā gadījumā multivides faili un audio netiks transkribēti.",
    provider: "Transkripcijas pakalpojuma sniedzējs",
    "warn-start":
      "Izmantojot lokālo whisper modeli iekārtās ar ierobežotu RAM vai CPU var apstādināt AnythingLLM, apstrādājot multivides failus.",
    "warn-recommend":
      "Mēs iesakām vismaz 2GB RAM un augšupielādēt failus <10Mb.",
    "warn-end":
      "Iebūvētais modelis automātiski lejupielādēsies pirmajā lietošanas reizē.",
  },
  embedding: {
    title: "Iegulšanas preferences",
    "desc-start":
      "Izmantojot LLM, kas neatbalsta iebūvētu iegulšanas dzinēju - jums var būt nepieciešams papildus norādīt akreditācijas datus teksta iegulšanai.",
    "desc-end":
      "Iegulšana ir process, ar kuru teksts tiek pārveidots vektoros. Šie akreditācijas dati ir nepieciešami, lai pārveidotu jūsu failus un vaicājumus formātā, kuru AnythingLLM var izmantot apstrādei.",
    provider: {
      title: "Iegulšanas pakalpojuma sniedzējs",
    },
  },
  text: {
    title: "Teksta sadalīšanas un sagatavošanas preferences",
    "desc-start":
      "Dažreiz jūs, iespējams, vēlēsieties mainīt noklusējuma veidu, kā jauni dokumenti tiek sadalīti un sagatavoti pirms ievietošanas vektoru datubāzē.",
    "desc-end":
      "Jums vajadzētu mainīt šo iestatījumu tikai tad, ja saprotat, kā darbojas teksta sadalīšana un tās blakusefekti.",
    size: {
      title: "Teksta gabala izmērs",
      description:
        "Šis ir maksimālais rakstzīmju skaits, kas var būt vienā vektorā.",
      recommend: "Iegult modeļa maksimālo garumu ir",
    },
    overlap: {
      title: "Teksta gabalu pārklāšanās",
      description:
        "Šī ir maksimālā rakstzīmju pārklāšanās, kas notiek sadalīšanas laikā starp diviem blakus esošiem teksta gabaliem.",
    },
  },
  vector: {
    title: "Vektoru datubāze",
    description:
      "Šie ir akreditācijas dati un iestatījumi tam, kā darbosies jūsu AnythingLLM instance. Ir svarīgi, lai šīs atslēgas būtu aktuālas un pareizas.",
    provider: {
      title: "Vektoru datubāzes pakalpojuma sniedzējs",
      description: "LanceDB nav nepieciešama konfigurācija.",
    },
  },
  embeddable: {
    title: "Iegulstāmie čata logrīki",
    description:
      "Iegulstāmie čata logrīki ir publiskas saziņas saskarnes, kas ir piesaistītas vienam darbam. Tie ļauj izveidot darba vietas, kuras pēc tam varat publicēt pasaulē.",
    create: "Izveidot iegulumu",
    table: {
      workspace: "Darba vieta",
      chats: "Nosūtītie čati",
      active: "Aktīvie domēni",
      created: "Izveidotais",
    },
  },
  "embed-chats": {
    title: "Iegulto čatu saraksts",
    export: "Eksportēt",
    description:
      "Šie ir visi ierakstītie čati un ziņojumi no jebkura iegultā logrīka, ko esat publicējis.",
    table: {
      embed: "Iegultais",
      sender: "Sūtītājs",
      message: "Ziņojums",
      response: "Atbilde",
      at: "Nosūtīts",
    },
  },
  event: {
    title: "Notikumu žurnāli",
    description:
      "Skatiet visas darbības un notikumus, kas notiek šajā instancē uzraudzības nolūkos.",
    clear: "Notīrīt notikumu žurnālus",
    table: {
      type: "Notikuma veids",
      user: "Lietotājs",
      occurred: "Notika",
    },
  },
  privacy: {
    title: "Privātums un datu apstrāde",
    description:
      "Šī ir jūsu konfigurācija tam, kā savienotie trešo pušu pakalpojumu sniedzēji un AnythingLLM apstrādā jūsu datus.",
    llm: "LLM izvēle",
    embedding: "Iegulšanas preferences",
    vector: "Vektoru datubāze",
    anonymous: "Anonīmā telemetrija iespējota",
  },
  connectors: {
    "search-placeholder": "Meklēt datu savienotājus",
    "no-connectors": "Nav atrasti datu savienotāji.",
    obsidian: {
      name: "Obsidian",
      description: "Importējiet Obsidian krātuvi ar vienu klikšķi.",
      vault_location: "Krātuves atrašanās vieta",
      vault_description:
        "Atlasiet savu Obsidian krātuves mapi, lai importētu visas piezīmes un to savienojumus.",
      selected_files: "Atrasti {{count}} markdown faili",
      importing: "Notiek krātuves importēšana...",
      import_vault: "Importēt krātuvi",
      processing_time:
        "Tas var aizņemt laiku atkarībā no jūsu krātuves lieluma.",
      vault_warning:
        "Lai izvairītos no konfliktiem, pārliecinieties, ka jūsu Obsidian krātuve pašlaik nav atvērta.",
    },
    github: {
      name: "GitHub repozitorijs",
      description:
        "Importējiet visu publisku vai privātu GitHub repozitoriju ar vienu klikšķi.",
      URL: "GitHub repozitorija URL",
      URL_explained: "GitHub repozitorija URL, kuru vēlaties savākt.",
      token: "GitHub piekļuves tokens",
      optional: "neobligāts",
      token_explained: "Piekļuves tokens, lai novērstu ātruma ierobežojumus.",
      token_explained_start: "Bez ",
      token_explained_link1: "personiskā piekļuves tokena",
      token_explained_middle:
        ", GitHub API var ierobežot savācamo failu skaitu ātruma ierobežojumu dēļ. Jūs varat ",
      token_explained_link2: "izveidot pagaidu piekļuves tokenu",
      token_explained_end: ", lai izvairītos no šīs problēmas.",
      ignores: "Failu ignorēšana",
      git_ignore:
        "Saraksts .gitignore formātā, lai ignorētu konkrētus failus savākšanas laikā. Nospiediet enter pēc katra ieraksta, kuru vēlaties saglabāt.",
      task_explained:
        "Kad tas būs pabeigts, visi faili būs pieejami iegulšanai darba vietās dokumentu atlasītājā.",
      branch: "Zars, no kura vēlaties savākt failus.",
      branch_loading: "-- notiek pieejamo zaru ielāde --",
      branch_explained: "Zars, no kura vēlaties savākt failus.",
      token_information:
        "Bez <b>GitHub piekļuves tokena</b> aizpildīšanas šis datu savienotājs varēs savākt tikai <b>augšējā līmeņa</b> failus repozitorijā GitHub publiskā API ātruma ierobežojumu dēļ.",
      token_personal:
        "Iegūstiet bezmaksas personisko piekļuves tokenu ar GitHub kontu šeit.",
    },
    gitlab: {
      name: "GitLab repozitorijs",
      description:
        "Importējiet visu publisku vai privātu GitLab repozitoriju ar vienu klikšķi.",
      URL: "GitLab repozitorija URL",
      URL_explained: "GitLab repozitorija URL, kuru vēlaties savākt.",
      token: "GitLab piekļuves tokens",
      optional: "neobligāts",
      token_explained: "Piekļuves tokens, lai novērstu ātruma ierobežojumus.",
      token_description: "Atlasiet papildu entītijas, ko iegūt no GitLab API.",
      token_explained_start: "Bez ",
      token_explained_link1: "personiskā piekļuves tokena",
      token_explained_middle:
        ", GitLab API var ierobežot savācamo failu skaitu ātruma ierobežojumu dēļ. Jūs varat ",
      token_explained_link2: "izveidot pagaidu piekļuves tokenu",
      token_explained_end: ", lai izvairītos no šīs problēmas.",
      fetch_issues: "Iegūt problēmas kā dokumentus",
      ignores: "Failu ignorēšana",
      git_ignore:
        "Saraksts .gitignore formātā, lai ignorētu konkrētus failus savākšanas laikā. Nospiediet enter pēc katra ieraksta, kuru vēlaties saglabāt.",
      task_explained:
        "Kad tas būs pabeigts, visi faili būs pieejami iegulšanai darba vietās dokumentu atlasītājā.",
      branch: "Zars, no kura vēlaties savākt failus",
      branch_loading: "-- notiek pieejamo zaru ielāde --",
      branch_explained: "Zars, no kura vēlaties savākt failus.",
      token_information:
        "Bez <b>GitLab piekļuves tokena</b> aizpildīšanas šis datu savienotājs varēs savākt tikai <b>augšējā līmeņa</b> failus repozitorijā GitLab publiskā API ātruma ierobežojumu dēļ.",
      token_personal:
        "Iegūstiet bezmaksas personisko piekļuves tokenu ar GitLab kontu šeit.",
    },
    youtube: {
      name: "YouTube transkripcija",
      description: "Importējiet visa YouTube video transkripciju no saites.",
      URL: "YouTube video URL",
      URL_explained_start:
        "Ievadiet jebkura YouTube video URL, lai iegūtu tā transkripciju. Video ir jābūt pieejamiem ",
      URL_explained_link: "slēgtajiem parakstiem",
      URL_explained_end: ".",
      task_explained:
        "Kad tas būs pabeigts, transkripcija būs pieejama iegulšanai darba vietās dokumentu atlasītājā.",
      language: "Transkripcijas valoda",
      language_explained:
        "Atlasiet transkripcijas valodu, kuru vēlaties savākt.",
      loading_languages: "-- notiek pieejamo valodu ielāde --",
    },
    "website-depth": {
      name: "Vairāku saišu skrāpētājs",
      description:
        "Skrāpējiet vietni un tās apakšsaites līdz noteiktam dziļumam.",
      URL: "Vietnes URL",
      URL_explained: "URL vietnei, kuru vēlaties skrāpēt.",
      depth: "Pārmeklēšanas dziļums",
      depth_explained:
        "Šis ir bērnu saišu skaits, kurām darbiniekam būtu jāseko no sākotnējā URL.",
      max_pages: "Maksimālais lapu skaits",
      max_pages_explained: "Maksimālais skrāpējamo saišu skaits.",
      task_explained:
        "Kad tas būs pabeigts, viss skrāpētais saturs būs pieejams iegulšanai darba vietās dokumentu atlasītājā.",
    },
    confluence: {
      name: "Confluence",
      description: "Importējiet visu Confluence lapu ar vienu klikšķi.",
      deployment_type: "Confluence izvietošanas veids",
      deployment_type_explained:
        "Nosakiet, vai jūsu Confluence instance ir izvietota Atlassian mākonī vai pašu uzturētā.",
      base_url: "Confluence pamata URL",
      base_url_explained: "Šis ir jūsu Confluence telpas pamata URL.",
      space_key: "Confluence telpas atslēga",
      space_key_explained:
        "Šī ir jūsu confluence instances telpas atslēga, kas tiks izmantota. Parasti sākas ar ~",
      username: "Confluence lietotājvārds",
      username_explained: "Jūsu Confluence lietotājvārds",
      auth_type: "Confluence autentifikācijas veids",
      auth_type_explained:
        "Atlasiet autentifikācijas veidu, kuru vēlaties izmantot, lai piekļūtu savām Confluence lapām.",
      auth_type_username: "Lietotājvārds un piekļuves tokens",
      auth_type_personal: "Personiskais piekļuves tokens",
      token: "Confluence piekļuves tokens",
      token_explained_start:
        "Jums ir jānodrošina piekļuves tokens autentifikācijai. Jūs varat ģenerēt piekļuves tokenu",
      token_explained_link: "šeit",
      token_desc: "Piekļuves tokens autentifikācijai",
      pat_token: "Confluence personiskais piekļuves tokens",
      pat_token_explained: "Jūsu Confluence personiskais piekļuves tokens.",
      task_explained:
        "Kad tas būs pabeigts, lapas saturs būs pieejams iegulšanai darba vietās dokumentu atlasītājā.",
      bypass_ssl: "Aizvest SSL sertifikāta validācijas",
      bypass_ssl_explained:
        "Aktivizējiet šo opciju, lai pārliecinajas no SSL sertifikāta validācijas, izmantojot pašizveidotā sertifikātu, konfluensā, kas ir pašizveidots.",
    },
    manage: {
      documents: "Dokumenti",
      "data-connectors": "Datu savienotāji",
      "desktop-only":
        "Šo iestatījumu rediģēšana ir pieejama tikai galddatora ierīcē. Lūdzu, piekļūstiet šai lapai savā galddatorā, lai turpinātu.",
      dismiss: "Noraidīt",
      editing: "Rediģēšana",
    },
    directory: {
      "my-documents": "Mani dokumenti",
      "new-folder": "Jauna mape",
      "search-document": "Meklēt dokumentu",
      "no-documents": "Nav dokumentu",
      "move-workspace": "Pārvietot uz darba vietu",
      name: "Nosaukums",
      "delete-confirmation":
        "Vai tiešām vēlaties dzēst šos failus un mapes?\nTas noņems failus no sistēmas un automātiski noņems tos no visām esošajām darba vietām.\nŠī darbība nav atgriezeniska.",
      "removing-message":
        "Notiek {{count}} dokumentu un {{folderCount}} mapju noņemšana. Lūdzu, uzgaidiet.",
      "move-success": "Veiksmīgi pārvietoti {{count}} dokumenti.",
      date: "Datums",
      type: "Veids",
      no_docs: "Nav dokumentu",
      select_all: "Atlasīt visu",
      deselect_all: "Atcelt visu atlasi",
      remove_selected: "Noņemt atlasītos",
      costs: "*Vienreizējas izmaksas iegulšanai",
      save_embed: "Saglabāt un iegult",
    },
    upload: {
      "processor-offline": "Dokumentu apstrādātājs nav pieejams",
      "processor-offline-desc":
        "Mēs nevaram augšupielādēt jūsu failus, jo dokumentu apstrādātājs ir bezsaistē. Lūdzu, mēģiniet vēlāk.",
      "click-upload":
        "Noklikšķiniet, lai augšupielādētu, vai velciet un nometiet",
      "file-types":
        "atbalsta teksta failus, csv, izklājlapas, audio failus un vēl vairāk!",
      "or-submit-link": "vai iesniedziet saiti",
      "placeholder-link": "https://example.com",
      fetching: "Iegūst...",
      "fetch-website": "Iegūt vietni",
      "privacy-notice":
        "Šie faili tiks augšupielādēti dokumentu apstrādātājā, kas darbojas šajā AnythingLLM instancē. Šie faili netiek nosūtīti vai kopīgoti ar trešo pusi.",
    },
    pinning: {
      what_pinning: "Kas ir dokumentu piespraušana?",
      pin_explained_block1:
        "Kad jūs <b>piespraudiet</b> dokumentu AnythingLLM, mēs ievietosim visu dokumenta saturu jūsu uzvednes logā, lai jūsu LLM to pilnībā saprastu.",
      pin_explained_block2:
        "Tas vislabāk darbojas ar <b>liela konteksta modeļiem</b> vai maziem failiem, kas ir kritiski tā zināšanu bāzei.",
      pin_explained_block3:
        "Ja jūs nesaņemat vēlamās atbildes no AnythingLLM pēc noklusējuma, tad piespraušana ir lielisks veids, kā iegūt kvalitatīvākas atbildes ar vienu klikšķi.",
      accept: "Labi, sapratu",
    },
    watching: {
      what_watching: "Ko dara dokumenta novērošana?",
      watch_explained_block1:
        "Kad jūs <b>novērojat</b> dokumentu AnythingLLM, mēs <i>automātiski</i> sinhronizēsim jūsu dokumenta saturu no tā sākotnējā avota regulāros intervālos. Tas automātiski atjauninās saturu katrā darba vietā, kur šis fails tiek pārvaldīts.",
      watch_explained_block2:
        "Šī funkcija pašlaik atbalsta tiešsaistes saturu un nebūs pieejama manuāli augšupielādētiem dokumentiem.",
      watch_explained_block3_start:
        "Jūs varat pārvaldīt, kuri dokumenti tiek novēroti no ",
      watch_explained_block3_link: "Failu pārvaldnieka",
      watch_explained_block3_end: " administratora skata.",
      accept: "Labi, sapratu",
    },
  },
  chat_window: {
    welcome: "Laipni lūgti jūsu jaunajā darba vietā.",
    get_started: "Lai sāktu, vai nu",
    get_started_default: "Lai sāktu",
    upload: "augšupielādējiet dokumentu",
    or: "vai",
    send_chat: "sūtiet čatu.",
    send_message: "Sūtīt ziņojumu",
    attach_file: "Pievienot failu šim čatam",
    slash: "Skatīt visas pieejamās slīpsvītras komandas čatošanai.",
    agents: "Skatīt visus pieejamos aģentus, kurus varat izmantot čatošanai.",
    text_size: "Mainīt teksta izmēru.",
    microphone: "Izrunājiet savu uzvedni.",
    send: "Nosūtīt uzvednes ziņojumu uz darba vietu",
    attachments_processing: "Faili tiek apstrādāti. Lūdzu, paceliet.",
    tts_speak_message: "TTS run message",
    copy: "Kopēt",
    regenerate: "Atjaunot",
    regenerate_response: "Atjaunot atbildi",
    good_response: "Laba atbilde",
    more_actions: "Vairāk darbību",
    hide_citations: "Izvākt atsaukmes",
    show_citations: "Rādīt atsauces",
    pause_tts_speech_message: "Pārtrauciet tekstā iekļauto balss tulkošanu.",
    fork: "Klūtis",
    delete: "Dzēst",
    save_submit: "Saglabāt un iesūt",
    cancel: "Atcelt",
    edit_prompt: "Ieslēgt",
    edit_response: "Rediģēt atbildi",
    at_agent: "@agent",
    default_agent_description: "- noklusējuma aģents šim darba telpai.",
    custom_agents_coming_soon:
      "Nedaudz drīzumā būs pieejami individuāli pakalpojumi!",
    slash_reset: "/reset",
    preset_reset_description:
      "Izdzēsiet savu pastā veidoتو sarunu vēsturi un sāciet jaunu sarunu.",
    add_new_preset: "Pievienot jaunu iepriekšējo",
    command: "Ordere",
    your_command: "Jūsu komanda",
    placeholder_prompt:
      "Šis ir saturs, kas tiks ievietots pirms jūsu pieprasījuma.",
    description: "Apraksts",
    placeholder_description: "Atbild ar dzeju par lielajiem valodu modeļiem.",
    save: "Saglabāt",
    small: "Mazs.",
    normal: "Normāls",
    large: "Liels",
    workspace_llm_manager: {
      search: "Izmeklē LLM sniedzējus",
      loading_workspace_settings: "Ielāde darba vidējās iestatījumi...",
      available_models: "Pieejamās modeļi: {{provider}}",
      available_models_description:
        "Izvēlieties modeli, ko izmantot šim darba zonai.",
      save: "Izmantojiet šo modeli.",
      saving: "Iestata modeli kā noklusēto darba vietai...",
      missing_credentials:
        "Šim pakalpojuma sniedzējam nav sniegta nekur dokumentēta informācija.",
      missing_credentials_description:
        "Noklikšķiniet, lai konfigurētu autentifikācijas datus",
    },
  },
  profile_settings: {
    edit_account: "Rediģēt kontu",
    profile_picture: "Profila attēls",
    remove_profile_picture: "Noņemt profila attēlu",
    username: "Lietotājvārds",
    new_password: "Jauna parole",
    password_description: "Parolei jābūt vismaz 8 rakstzīmes garai",
    cancel: "Atcelt",
    update_account: "Atjaunināt kontu",
    theme: "Tēmas preference",
    language: "Vēlamā valoda",
    failed_upload: "Neizdevās augsēt profilas attēlu: {{error}}",
    upload_success: "Profila attēls ir augšupielādēts.",
    failed_remove: "Neizdevās noņemt profilbildi: {{error}}",
    profile_updated: "Profils atjaunināts.",
    failed_update_user: "Neizdevās atjaunināt lietotāju: {{error}}",
    account: "Konta",
    support: "Atbalsts",
    signout: "Iziet",
  },
  "keyboard-shortcuts": {
    title: "Taustiņu atvieglojumi",
    shortcuts: {
      settings: "Atvērt iestatījumus",
      workspaceSettings: "Atvērt pašreizējās darba vides iestatījumus",
      home: "Pārvietojieties uz sākuma lapu",
      workspaces: "Administrējiet darba vietas",
      apiKeys: "API atslēgas – iestatījumi",
      llmPreferences: "LLM prioritātes",
      chatSettings: "Pieskaites iestatījumi",
      help: "Rādīt tastatūras atvērto palīdzības",
      showLLMSelector: "LLM izvēles rīks",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Veiksmi!",
        success_description:
          'Jūsu sistēmas iniciatīva ir publicēta "Community Hub" platformā!',
        success_thank_you: "Paldies par dalīšanos ar komunitāti!",
        view_on_hub: "Skatīt Community Hub",
        modal_title: "Publicēšanas sistēmas iniciatīva",
        name_label: "Jānis",
        name_description: "Šis ir jūsu sistēmas komandas nosaukums.",
        name_placeholder: "Mana sistēmas iniciatīva",
        description_label: "Apraksts",
        description_description:
          "Šis ir jūsu sistēmas iniciatīvas apraksts. Izmantojiet to, lai aprakstītu jūsu sistēmas iniciatīvas mērķi.",
        tags_label: "Atzīmes",
        tags_description:
          "Atzīmes tiek izmantotas, lai atzīmētu jūsu sistēmas iniciatīvu, lai to vieglāk atrastu. Jūs varat pievienot vairākas atzīmes. Maks 5 atzīmes. Katrai atzīmei – maksimāli 20 raksti.",
        tags_placeholder:
          'Ievietojiet tekstu un nospiediet "Enter", lai pievienotu atzīmes',
        visibility_label: "Redzamība",
        public_description: "Vispārējās sistēmas aicinājumi ir redzami visiem.",
        private_description:
          "Privātā sistēmas paziņojumi ir redzami tikai jums.",
        publish_button: "Publicē savu saturu Community Hub.",
        submitting: "Izdevniecība...",
        submit: "Publicē savu saturu Community Hub.",
        prompt_label: "Ieslēgt",
        prompt_description:
          "Šis ir tiešais sistēmas prompts, kas tiks izmantots, lai vadītu LLM.",
        prompt_placeholder: "Ievietojiet savu sistēmas komandu šeit...",
      },
      agent_flow: {
        public_description: "Visiem redzamas sabiedrības aģentu darbības.",
        private_description: "Privātās aģenta darbības ir redzamas tikai jums.",
        success_title: "Veiksmi!",
        success_description:
          'Jūsu "Agent Flow" ir publicēts "Community Hub" platformā!',
        success_thank_you: "Paldies par dalīšanos ar kopienu!",
        view_on_hub: "Skatīt Community Hub",
        modal_title: "Publicēšanas aģenta darbības",
        name_label: "Jānis",
        name_description: "Šis ir jūsu aģenta darbības norises nosaukums.",
        name_placeholder: "Mana aģenta darbība",
        description_label: "Apraksts",
        description_description:
          "Šis ir jūsu aģenta darbības apraksts. Izmantojiet to, lai aprakstītu jūsu aģenta darbības mērķi.",
        tags_label: "Atzīmes",
        tags_description:
          "Atzīmes tiek izmantotas, lai atzīmētu jūsu aģenta darbplūsmu, lai to būtu vieglāk atrast. Jūs varat pievienot vairākas atzīmes. Maks 5 atzīmes. Katrai atzīmei – maksimāli 20 raksti.",
        tags_placeholder:
          'Ievietojiet tekstu un nospiediet "Enter", lai pievienotu atzīmes',
        visibility_label: "Redzamība",
        publish_button: "Publicē savu saturu Community Hub.",
        submitting: "Izdevniecība...",
        submit: "Publicē savu saturu Community Hub.",
        privacy_note:
          'Dati tiek augšupielādēti kā privāti, lai aizsargātu jebkādus citus datus. Pēc publicēšanas varat mainīt redzamības iestatījumus "Sabiedrības centrā". Lūdzu, pārliecinieties, ka jūsu dati nesatur nevienu citu vai privātu informāciju, pirms publicēšanas.',
      },
      generic: {
        unauthenticated: {
          title: "Nepieciešama autentifikācija",
          description:
            'Pirms satura publicēšanas ir jāiespējo autentifikācija "AnythingLLM" sabiedrības centrā.',
          button: "Pievienojieties sabiedrības centram",
        },
      },
      slash_command: {
        success_title: "Veiksmi!",
        success_description:
          'Jūsu "Slash Command" ir publicēts "Community Hub"!',
        success_thank_you: "Paldies par dalīšanos ar kopienu!",
        view_on_hub: "Skatīt Community Hub",
        modal_title: "Publicējiet Slash komandu",
        name_label: "Jānis",
        name_description: "Šis ir jūsu komandas nosaukums.",
        name_placeholder: "Mana Slash komanda",
        description_label: "Apraksts",
        description_description:
          "Šis ir jūsu komandas apraksts. Izmantojiet to, lai aprakstītu jūsu komandas mērķi.",
        command_label: "Ordere",
        command_description:
          "Šis ir komandu, ko lietotāji ievadīs, lai aktivizētu šo iepriekš noteikto.",
        command_placeholder: "manas komanda",
        tags_label: "Atzīmes",
        tags_description:
          "Atzīmes tiek izmantotas, lai atzīmētu jūsu komandu, kas ļauj vieglāk meklēt. Jūs varat pievienot vairākas atzīmes. Maks 5 atzīmes. Katrai atzīmei – maksimāli 20 raksti.",
        tags_placeholder:
          "Ierakstiet un nospiediet Enter, lai pievienotu atzīmes",
        visibility_label: "Redzamība",
        public_description: "Vispārīgie komandas vārdi ir redzami visiem.",
        private_description: "Vietiski komandu komandās var redzēt tikai jūs.",
        publish_button: "Publicē savu saturu Community Hub.",
        submitting: "Izdevniecība...",
        prompt_label: "Ieslēgt",
        prompt_description:
          "Šis ir komandu, kas tiks izmantots, kad tiks aktivizēta slashes komanda.",
        prompt_placeholder: "Ievietojiet savu pieprasījumu šeit...",
      },
    },
  },
  security: {
    title: "Drošība",
    multiuser: {
      title: "Vairāklietotāju režīms",
      description:
        "Iestatiet savu instanci, lai atbalstītu jūsu komandu, aktivizējot vairāklietotāju režīmu.",
      enable: {
        "is-enable": "Vairāklietotāju režīms ir iespējots",
        enable: "Iespējot vairāklietotāju režīmu",
        description:
          "Pēc noklusējuma jūs būsiet vienīgais administrators. Kā administrators jums būs jāizveido konti visiem jaunajiem lietotājiem vai administratoriem. Nezaudējiet savu paroli, jo tikai administratora lietotājs var atiestatīt paroles.",
        username: "Administratora konta lietotājvārds",
        password: "Administratora konta parole",
      },
    },
    password: {
      title: "Aizsardzība ar paroli",
      description:
        "Aizsargājiet savu AnythingLLM instanci ar paroli. Ja aizmirsīsiet šo paroli, nav atgūšanas metodes, tāpēc pārliecinieties, ka saglabājat šo paroli.",
      "password-label": "Instances paroles",
    },
  },
  home: {
    welcome: "Laipni lūgti",
    chooseWorkspace: "Izvēlies darba vietu, lai sāktu čatu!",
    notAssigned:
      "Jūs nav piešķirts nevienai darba vietai.\nLūdzu, sazinieties ar savu administratoru, lai pieprasītu piekļuvi darba vietai.",
    goToWorkspace: 'Pāriet uz darba vietu "{{workspace}}"',
  },
};

export default TRANSLATIONS;
