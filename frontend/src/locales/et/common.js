// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Tere tulemast",
      getStarted: "Alusta",
    },
    llm: {
      title: "LLM-i eelistus",
      description:
        "AnythingLLM töötab paljude LLM-teenusepakkujatega. See teenus haldab vestlust.",
    },
    userSetup: {
      title: "Kasutaja seadistus",
      description: "Seadista oma kasutajasätted.",
      howManyUsers: "Mitu kasutajat seda instantsi kasutab?",
      justMe: "Ainult mina",
      myTeam: "Minu meeskond",
      instancePassword: "Instantsi parool",
      setPassword: "Kas soovid parooli seadistada?",
      passwordReq: "Parool peab olema vähemalt 8 märki.",
      passwordWarn:
        "Salvesta see parool hoolikalt, sest taastamisvõimalust ei ole.",
      adminUsername: "Admini kasutajanimi",
      adminUsernameReq:
        "Kasutajanimi peab olema vähemalt 6 märki ning võib sisaldada ainult väiketähti, numbreid, alakriipse ja sidekriipse.",
      adminPassword: "Admini parool",
      adminPasswordReq: "Parool peab olema vähemalt 8 märki.",
      teamHint:
        "Vaikimisi oled ainus administraator. Pärast häälestust saad luua ning kutsuda teisi kasutajaid või administreerida neid. Parooli kaotamisel saab paroole lähtestada vaid administraator.",
    },
    data: {
      title: "Andmetöötlus ja privaatsus",
      description:
        "Oleme pühendunud läbipaistvusele ning kontrollile sinu andmete osas.",
      settingsHint: "Neid sätteid saab igal ajal seadetes muuta.",
    },
    survey: {
      title: "Tere tulemast AnythingLLM-i",
      description:
        "Aita meil AnythingLLM sinu vajadustele vastavaks kujundada. Valikuline.",
      email: "Mis on su e-post?",
      useCase: "Milleks kasutad AnythingLLM-i?",
      useCaseWork: "Töö jaoks",
      useCasePersonal: "Isiklikuks kasutuseks",
      useCaseOther: "Muu",
      comment: "Kust kuulsid AnythingLLM-ist?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube jne – anna meile teada!",
      skip: "Jäta vahele",
      thankYou: "Aitäh tagasiside eest!",
    },
    workspace: {
      title: "Loo oma esimene tööruum",
      description: "Loo esimene tööruum ja alusta AnythingLLM-iga.",
    },
  },
  common: {
    "workspaces-name": "Tööruumide nimi",
    error: "viga",
    success: "õnnestus",
    user: "Kasutaja",
    selection: "Mudeli valik",
    saving: "Salvestan…",
    save: "Salvesta muudatused",
    previous: "Eelmine leht",
    next: "Järgmine leht",
    optional: "Valikuline",
    yes: "Jah",
    no: "Ei",
  },
  settings: {
    title: "Instantsi seaded",
    system: "Üldseaded",
    invites: "Kutsed",
    users: "Kasutajad",
    workspaces: "Tööruumid",
    "workspace-chats": "Tööruumi vestlused",
    customization: "Kohandamine",
    interface: "Kasutajaliidese eelistused",
    branding: "Bränding ja valgesildistamine",
    chat: "Vestlus",
    "api-keys": "Arendaja API",
    llm: "LLM",
    transcription: "Transkriptsioon",
    embedder: "Embeddija",
    "text-splitting": "Teksti lõikamine ja tükeldus",
    "voice-speech": "Hääle ja kõne seaded",
    "vector-database": "Vektoriandmebaas",
    embeds: "Vestluse embed",
    "embed-chats": "Embed-vestluste ajalugu",
    security: "Turvalisus",
    "event-logs": "Sündmuste logid",
    privacy: "Privaatsus ja andmed",
    "ai-providers": "AI-pakkujad",
    "agent-skills": "Agendi oskused",
    admin: "Admin",
    tools: "Tööriistad",
    "system-prompt-variables": "Süsteemprompti muutujad",
    "experimental-features": "Eksperimentaalsed funktsioonid",
    contact: "Tugi",
    "browser-extension": "Brauserilaiend",
  },
  login: {
    "multi-user": {
      welcome: "Tere tulemast",
      "placeholder-username": "Kasutajanimi",
      "placeholder-password": "Parool",
      login: "Logi sisse",
      validating: "Kontrollin…",
      "forgot-pass": "Unustasid parooli",
      reset: "Lähtesta",
    },
    "sign-in": {
      start: "Logi sisse oma",
      end: "kontosse.",
    },
    "password-reset": {
      title: "Parooli lähtestamine",
      description: "Sisesta all vajalik info, et parool lähtestada.",
      "recovery-codes": "Taastamiskoodid",
      "recovery-code": "Taastamiskood {{index}}",
      "back-to-login": "Tagasi sisselogimisele",
    },
  },
  welcomeMessage: {
    part1:
      "Tere tulemast AnythingLLM-i! See on Mintplex Labsi avatud lähtekoodiga AI-tööriist, mis muudab kõik failid koolitatud juturobotiks, kellega saad vestelda. AnythingLLM on BYOK-tarkvara, seega puudub igasugune tellimus- või litsentsitasu, välja arvatud kasutatavate teenuste kulud.",
    part2:
      "AnythingLLM on lihtsaim viis kombineerida võimsad AI-teenused nagu OpenAI, GPT-4, LangChain, PineconeDB, ChromaDB jpt ilma vaevata, tõstes sinu produktiivsust kordades.",
    part3:
      "AnythingLLM võib töötada täielikult lokaalselt sinu masinas minimaalse ressursikasutusega – GPU-d pole vaja. Samuti on saadaval pilve- ja kohapealsed paigaldised.\nAI-ökosüsteem muutub iga päevaga võimekamaks ja AnythingLLM teeb selle kasutamise lihtsaks.",
    githubIssue: "Loo GitHubis probleem",
    user1: "Kuidas alustada?!",
    part4:
      'Lihtne. Kõik kogud on korraldatud "Tööruumideks". Tööruum on kaust failidest (dokumendid, pildid, PDF-id jm), mis teisendatakse LLM-ile mõistetavaks vestluskontekstiks.\n\nFailide lisamine ja eemaldamine on võimalik igal ajal.',
    createWorkspace: "Loo esimene tööruum",
    user2:
      "Kas see on nagu AI-Dropbox? Aga vestlus – see peaks ju chatbot olema?",
    part5:
      "AnythingLLM on enamat kui nutikam Dropbox.\n\nAnythingLLM pakub kahte viisi oma andmetega suhtlemiseks:\n\n<i>Päring:</i> Vestlus tagastab andmed või järeldused olemasolevatest dokumentidest tööruumis. Mida rohkem faile lisad, seda nutikamaks see muutub!\n\n<i>Vestluslik:</i> Sinu dokumendid + käimasolev vestlus mõjutavad vastuseid samaaegselt. Sobib reaalajas info lisamiseks või LLM-i arusaamade parandamiseks.\n\nVõid režiime vahetada <i>keset vestlust!</i>",
    user3: "Võimas! Las ma proovin kohe ära!",
    part6: "Head kasutamist!",
    starOnGitHub: "Tähista GitHubis",
    contact: "Võta ühendust Mintplex Labsiga",
  },
  "main-page": {
    noWorkspaceError: "Enne vestlust loo tööruum.",
    checklist: {
      title: "Alustamine",
      tasksLeft: "ülesannet jäänud",
      completed: "Oled teel AnythingLLM-i eksperdiks saama!",
      dismiss: "sulge",
      tasks: {
        create_workspace: {
          title: "Loo tööruum",
          description: "Loo esimene tööruum alustamiseks",
          action: "Loo",
        },
        send_chat: {
          title: "Saada vestlus",
          description: "Alusta vestlust oma AI-abilisega",
          action: "Vestle",
        },
        embed_document: {
          title: "Põimi dokument",
          description: "Lisa esimene dokument oma tööruumi",
          action: "Põimi",
        },
        setup_system_prompt: {
          title: "Seadista süsteemprompt",
          description: "Määra AI-abilise käitumine",
          action: "Seadista",
        },
        define_slash_command: {
          title: "Loo kaldkriipskäsk",
          description: "Tee oma abilise jaoks kohandatud käsud",
          action: "Loo",
        },
        visit_community: {
          title: "Külasta kogukonna keskust",
          description: "Uuri kogukonna ressursse ja malle",
          action: "Sirvi",
        },
      },
    },
    quickLinks: {
      title: "Kiirlingid",
      sendChat: "Saada vestlus",
      embedDocument: "Põimi dokument",
      createWorkspace: "Loo tööruum",
    },
    exploreMore: {
      title: "Avasta rohkem funktsioone",
      features: {
        customAgents: {
          title: "Kohandatud AI-agendid",
          description: "Ehita võimsaid agente ja automatsioone ilma koodita.",
          primaryAction: "Vestle @agent abil",
          secondaryAction: "Loo agendivoog",
        },
        slashCommands: {
          title: "Kaldkriipskäsklused",
          description: "Säästa aega ja lisa käske kohandatud käskudega.",
          primaryAction: "Loo kaldkriipskäsk",
          secondaryAction: "Sirvi Hubs",
        },
        systemPrompts: {
          title: "Süsteempromptid",
          description:
            "Muuda süsteemprompti, et kohandada AI vastuseid tööruumis.",
          primaryAction: "Muuda süsteemprompti",
          secondaryAction: "Halda prompt-muutujaid",
        },
      },
    },
    announcements: {
      title: "Uuendused ja teadaanded",
    },
    resources: {
      title: "Ressursid",
      links: {
        docs: "Dokumentatsioon",
        star: "GitHubi tärn",
      },
      keyboardShortcuts: "Klaviatuuri otseteed",
    },
  },
  "new-workspace": {
    title: "Uus tööruum",
    placeholder: "Minu tööruum",
  },
  "workspaces—settings": {
    general: "Üldseaded",
    chat: "Vestluse seaded",
    vector: "Vektoriandmebaas",
    members: "Liikmed",
    agent: "Agendi konfiguratsioon",
  },
  general: {
    vector: {
      title: "Vektorite arv",
      description: "Vektorite koguarv sinu vektoriandmebaasis.",
    },
    names: {
      description: "See muudab ainult tööruumi kuvatavat nime.",
    },
    message: {
      title: "Soovitatud vestlussõnumid",
      description: "Kohanda sõnumeid, mida tööruumi kasutajatele soovitatakse.",
      add: "Lisa uus sõnum",
      save: "Salvesta sõnumid",
      heading: "Selgita mulle",
      body: "AnythingLLM eeliseid",
    },
    pfp: {
      title: "Abilise profiilipilt",
      description: "Kohanda selle tööruumi abilise profiilipilti.",
      image: "Tööruumi pilt",
      remove: "Eemalda tööruumi pilt",
    },
    delete: {
      title: "Kustuta tööruum",
      description:
        "Kustuta see tööruum ja kõik selle andmed. See eemaldab tööruumi kõikidele kasutajatele.",
      delete: "Kustuta tööruum",
      deleting: "Kustutan tööruumi…",
      "confirm-start": "Oled kustutamas kogu",
      "confirm-end":
        "tööruumi. See eemaldab kõik vektorid vektoriandmebaasist.\n\nAlgseid faile ei puudutata. Tegevust ei saa tagasi võtta.",
    },
  },
  chat: {
    llm: {
      title: "Tööruumi LLM-pakkuja",
      description:
        "LLM-pakkuja ja mudel, mida selles tööruumis kasutatakse. Vaikimisi kasutatakse süsteemi LLM-seadeid.",
      search: "Otsi LLM-pakkujaid",
    },
    model: {
      title: "Tööruumi vestlusmudel",
      description:
        "Vestlusmudel, mida tööruumis kasutatakse. Kui tühi, kasutatakse süsteemi LLM-eelistust.",
      wait: "-- laadib mudeleid --",
    },
    mode: {
      title: "Vestlusrežiim",
      chat: {
        title: "Vestlus",
        "desc-start": "annab vastuseid LLM-i üldteadmistest",
        and: "ja",
        "desc-end": "leitud dokumendikontekstist.",
      },
      query: {
        title: "Päring",
        "desc-start": "annab vastuseid",
        only: "ainult",
        "desc-end": "kui leitakse dokumendikontekst.",
      },
    },
    history: {
      title: "Vestlusajalugu",
      "desc-start": "Eelmiste sõnumite arv, mis kaasatakse vastuse lühimällu.",
      recommend: "Soovitatav 20. ",
      "desc-end": "Üle 45 võib sõltuvalt sõnumi suurusest põhjustada tõrkeid.",
    },
    prompt: {
      title: "Süsteemprompt",
      description:
        "Prompt, mida tööruumis kasutatakse. Määra kontekst ja juhised, et AI toodaks asjakohase vastuse.",
      history: {
        title: "Süsteempromptide ajalugu",
        clearAll: "Tühjenda kõik",
        noHistory: "Ajalugu puudub",
        restore: "Taasta",
        delete: "Kustuta",
        publish: "Avalda kogukonnas",
        deleteConfirm: "Kas oled kindel, et soovid selle kirje kustutada?",
        clearAllConfirm:
          "Kas oled kindel, et soovid kogu ajaloo tühjendada? Tegevus on pöördumatu.",
        expand: "Laienda",
      },
    },
    refusal: {
      title: "Päringurežiimi keeldumisteade",
      "desc-start": "Kui ollakse",
      query: "päringu",
      "desc-end":
        "režiimis, võib määrata kohandatud vastuse, kui konteksti ei leita.",
      "tooltip-title": null,
      "tooltip-description": null,
    },
    temperature: {
      title: "LLM-i temperatuur",
      "desc-start": 'Määrab, kui "loovad" vastused on.',
      "desc-end":
        "Kõrgem väärtus = loovam, ent liiga kõrge võib tekitada ebaühtlasi vastuseid.",
      hint: "Kontrolli pakkujalt lubatud vahemikke.",
    },
  },
  "vector-workspace": {
    identifier: "Vektoriandmebaasi identifikaator",
    snippets: {
      title: "Maksimaalne konteksti lõikude arv",
      description:
        "Maksimaalne lõikude arv, mis saadetakse LLM-ile ühe vestluse/päringu kohta.",
      recommend: "Soovitatav: 4",
    },
    doc: {
      title: "Dokumendi sarnasuse lävi",
      description:
        "Minimaalne sarnasusskoor, et allikas oleks vestlusega seotud. Mida kõrgem, seda sarnasem peab allikas olema.",
      zero: "Piirang puudub",
      low: "Madal (≥ 0,25)",
      medium: "Keskmine (≥ 0,50)",
      high: "Kõrge (≥ 0,75)",
    },
    reset: {
      reset: "Lähtesta vektoriandmebaas",
      resetting: "Puhastan vektoreid…",
      confirm:
        "Lähtestad selle tööruumi vektoriandmebaasi. Kõik vektorid eemaldatakse.\n\nAlgseid faile ei puudutata. Tegevus on pöördumatu.",
      error: "Vektoriandmebaasi lähtestamine ebaõnnestus!",
      success: "Vektoriandmebaas lähtestati!",
    },
  },
  agent: {
    "performance-warning":
      "Mudelite, mis ei toeta tööriistakutsumisi, jõudlus sõltub tugevalt mudeli võimest. Mõned funktsioonid võivad olla piiratud.",
    provider: {
      title: "Tööruumi agendi LLM-pakkuja",
      description:
        "LLM-pakkuja ja mudel, mida kasutatakse @agent agendi jaoks.",
    },
    mode: {
      chat: {
        title: "Tööruumi agendi vestlusmudel",
        description: "Vestlusmudel, mida @agent agendi jaoks kasutatakse.",
      },
      title: "Tööruumi agendi mudel",
      description: "LLM-mudel, mida @agent agendi jaoks kasutatakse.",
      wait: "-- laadib mudeleid --",
    },
    skill: {
      title: "Agendi vaikimisi oskused",
      description:
        "Paranda vaikimisi agendi loomulikke oskusi nende eelnevalt ehitatud võimetega. Kehtib kõikidele tööruumidele.",
      rag: {
        title: "RAG ja pikaajaline mälu",
        description:
          'Lubab agendil kasutada kohalikke dokumente vastamiseks või "meelde jätmiseks".',
      },
      view: {
        title: "Vaata ja kokkuvõtlikusta dokumente",
        description:
          "Lubab agendil loetleda ja kokku võtta praegu põimitud faile.",
      },
      scrape: {
        title: "Kraabi veebilehti",
        description: "Lubab agendil külastada ja kraapida veebisisu.",
      },
      generate: {
        title: "Loo diagramme",
        description: "Lubab agendil luua erinevaid diagramme antud andmetest.",
      },
      save: {
        title: "Loo ja salvesta faile brauserisse",
        description:
          "Lubab agendil luua faile, mis salvestatakse ja allalaaditakse brauseris.",
      },
      web: {
        title: "Reaalajas veebihaku tugi",
        "desc-start":
          "Lubab agendil kasutada veebiotsingut küsimustele vastamiseks, ühendudes SERP-teenusega.",
        "desc-end": "Veebiotsing ei tööta enne, kui seadistus on tehtud.",
      },
    },
  },
  recorded: {
    title: "Tööruumi vestlused",
    description:
      "Kõik salvestatud vestlused ja sõnumid kuvatakse loomise aja järgi.",
    export: "Ekspordi",
    table: {
      id: "ID",
      by: "Saatja",
      workspace: "Tööruum",
      prompt: "Päring",
      response: "Vastus",
      at: "Saadetud",
    },
  },
  customization: {
    interface: {
      title: "Kasutajaliidese eelistused",
      description: "Sea AnythingLLM-i UI eelistused.",
    },
    branding: {
      title: "Bränding ja valgesildistamine",
      description: "Valgesildista oma AnythingLLM kohandatud brändinguga.",
    },
    chat: {
      title: "Vestlus",
      description: "Sea vestluse eelistused.",
      auto_submit: {
        title: "Automaatselt esita kõnesisend",
        description: "Saada kõnesisend ära pärast vaikuse perioodi",
      },
      auto_speak: {
        title: "Loe vastused ette",
        description: "AI loeb vastused automaatselt ette",
      },
      spellcheck: {
        title: "Luba õigekirjakontroll",
        description: "Lülita vestlusväljale õigekirjakontroll sisse/välja",
      },
    },
    items: {
      theme: {
        title: "Teema",
        description: "Vali rakenduse värviteema.",
      },
      "show-scrollbar": {
        title: "Kuva kerimisriba",
        description: "Kuva või peida vestlusakna kerimisriba.",
      },
      "support-email": {
        title: "Toe e-post",
        description:
          "Määra e-posti aadress, kuhu kasutajad saavad abi saamiseks pöörduda.",
      },
      "app-name": {
        title: "Nimi",
        description:
          "Nimi, mis kuvatakse kõigile kasutajatele sisselogimislehel.",
      },
      "chat-message-alignment": {
        title: "Vestlussõnumite joondus",
        description: "Vali sõnumite joondus vestlusliideses.",
      },
      "display-language": {
        title: "Kuvakeel",
        description:
          "Vali keel, milles AnythingLLM UI kuvatakse (kui tõlge on olemas).",
      },
      logo: {
        title: "Brändi logo",
        description: "Laadi üles kohandatud logo, mis kuvatakse kõikjal.",
        add: "Lisa logo",
        recommended: "Soovituslik suurus: 800 × 200",
        remove: "Eemalda",
        replace: "Asenda",
      },
      "welcome-messages": {
        title: "Tervitussõnumid",
        description:
          "Kohanda sõnumeid, mida kasutajad näevad sisselogimisel. Ainult mitte-adminid näevad neid.",
        new: "Uus",
        system: "süsteem",
        user: "kasutaja",
        message: "sõnum",
        assistant: "AnythingLLM vestlusabi",
        "double-click": "Topeltklõps muutmiseks…",
        save: "Salvesta sõnumid",
      },
      "browser-appearance": {
        title: "Brauseri välimus",
        description: "Kohanda brauseri vahekaardi pealkirja ja ikooni.",
        tab: {
          title: "Pealkiri",
          description:
            "Sea kohandatud vahekaardi pealkiri, kui rakendus on avatud.",
        },
        favicon: {
          title: "Favicon",
          description: "Kasuta kohandatud faviconi brauseri vahekaardil.",
        },
      },
      "sidebar-footer": {
        title: "Külgriba jaluse elemendid",
        description: "Kohanda külgriba allosas kuvatavaid linke/ikooni.",
        icon: "Ikoon",
        link: "Link",
      },
    },
  },
  api: {
    title: "API võtmed",
    description:
      "API võtmed võimaldavad programmipõhiselt hallata seda AnythingLLM instantsi.",
    link: "Loe API dokumentatsiooni",
    generate: "Genereeri uus API võti",
    table: {
      key: "API võti",
      by: "Loonud",
      created: "Loodud",
    },
  },
  llm: {
    title: "LLM-i eelistus",
    description:
      "Siin on sinu valitud LLM-teenusepakkuja võtmed ja seaded. Need peavad olema õiged, vastasel juhul AnythingLLM ei tööta.",
    provider: "LLM-pakkuja",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure teenuse lõpp-punkt",
        api_key: "API võti",
        chat_deployment_name: "Vestluse deploy nimi",
        chat_model_token_limit: "Mudeli tokeni limiit",
        model_type: "Mudeli tüüp",
        default: "Vaikimisi",
        reasoning: "Põhjendus",
      },
    },
  },
  transcription: {
    title: "Transkriptsiooni mudeli eelistus",
    description:
      "Siin on sinu valitud transkriptsioonimudeli pakkuja seaded. Vale seadistuse korral heli- ja meediafaile ei transkribeerita.",
    provider: "Transkriptsiooni pakkuja",
    "warn-start":
      "Kohaliku Whisper-mudeli kasutamine vähese RAM-i või CPU-ga masinal võib faili töötlemise ummistada.",
    "warn-recommend": "Soovitame vähemalt 2 GB RAM-i ning <10 MB faile.",
    "warn-end":
      "Sisseehitatud mudel laaditakse alla esmakasutusel automaatselt.",
  },
  embedding: {
    title: "Embedding-i eelistus",
    "desc-start":
      "Kui kasutad LLM-i, mis ei sisalda embedding-mootorit, tuleb määrata täiendavad võtmed.",
    "desc-end":
      "Embedding muudab teksti vektoriteks. Need võtmed on vajalikud, et AnythingLLM saaks sinu failid ja päringud töödelda.",
    provider: {
      title: "Embedding-i pakkuja",
      description:
        "AnythingLLM-i sisseehitatud embedding-mootor ei vaja seadistust.",
    },
  },
  text: {
    title: "Teksti lõikamise ja tükeldamise seaded",
    "desc-start":
      "Vahel soovid muuta, kuidas uued dokumendid enne vektoriandmebaasi lisamist tükeldatakse.",
    "desc-end": "Muuda seda ainult siis, kui mõistad tekstilõike mõju.",
    "warn-start": "Muudatused kehtivad ainult",
    "warn-center": "uutele dokumentidele",
    "warn-end": ", mitte olemasolevatele.",
    size: {
      title: "Tekstitüki suurus",
      description: "Maksimaalne märgipikkus ühes vektoris.",
      recommend: "Embed-mudeli maks pikkus on",
    },
    overlap: {
      title: "Tekstitüki kattuvus",
      description: "Maksimaalne märkide kattuvus kahe kõrvuti tüki vahel.",
    },
  },
  vector: {
    title: "Vektoriandmebaas",
    description:
      "Siin on seaded, kuidas AnythingLLM töötab. Vale seadistus võib põhjustada tõrkeid.",
    provider: {
      title: "Vektoriandmebaasi pakkuja",
      description: "LanceDB puhul seadistust pole vaja.",
    },
  },
  embeddable: {
    title: "Embed-vestlusvidinad",
    description:
      "Avalikkusele suunatud vestlusliidesed, mis on seotud ühe tööruumiga.",
    create: "Loo embed",
    table: {
      workspace: "Tööruum",
      chats: "Saadetud vestlused",
      active: "Aktiivsed domeenid",
      created: "Loodud",
    },
  },
  "embed-chats": {
    title: "Embed-vestluste ajalugu",
    export: "Ekspordi",
    description: "Kõik embed-ide salvestatud vestlused ja sõnumid.",
    table: {
      embed: "Embed",
      sender: "Saatja",
      message: "Sõnum",
      response: "Vastus",
      at: "Saadetud",
    },
  },
  multi: {
    title: "Mitme kasutaja režiim",
    description:
      "Lülita mitme kasutaja tugi sisse, et meeskond saaks instantsi kasutada.",
    enable: {
      "is-enable": "Mitme kasutaja režiim on sisse lülitatud",
      enable: "Lülita sisse",
      description:
        "Vaikimisi oled ainus administraator. Adminid loovad uued kasutajad ja paroole.",
      username: "Admini kasutajanimi",
      password: "Admini parool",
    },
    password: {
      title: "Paroolikaitse",
      description:
        "Kaitse oma instantsi parooliga. Kui unustad selle, taastamisvõimalust ei ole.",
    },
    instance: {
      title: "Kaitse instants parooliga",
      description:
        "Adminid peavad looma kontod uutele kasutajatele. Parooli kaotus = taastada saab vaid admin.",
      password: "Instantsi parool",
    },
  },
  event: {
    title: "Sündmuste logid",
    description: "Vaata instantsis toimuvaid tegevusi ja jälgi sündmusi.",
    clear: "Tühjenda logid",
    table: {
      type: "Sündmuse tüüp",
      user: "Kasutaja",
      occurred: "Toimus",
    },
  },
  privacy: {
    title: "Privaatsus ja andmetöötlus",
    description:
      "Konfiguratsioon kolmandate osapoolte ja AnythingLLM-i andmekäitluse kohta.",
    llm: "LLM-i valik",
    embedding: "Embedding-i eelistus",
    vector: "Vektoriandmebaas",
    anonymous: "Anonüümne telemeetria lubatud",
  },
  connectors: {
    "search-placeholder": "Otsi andmepistikuid",
    "no-connectors": "Andmepistikuid ei leitud.",
    obsidian: {
      name: "Obsidian",
      description: "Impordi Obsidiani vault ühe klõpsuga.",
      vault_location: "Vaulti asukoht",
      vault_description:
        "Vali oma Obsidiani vaulti kaust, et importida kõik märkmed ja nende seosed.",
      selected_files: "Leiti {{count}} Markdown-faili",
      importing: "Vaulti importimine…",
      import_vault: "Impordi vault",
      processing_time: "See võib võtta aega sõltuvalt vaulti suurusest.",
      vault_warning:
        "Konfliktide vältimiseks veendu, et Obsidiani vault ei oleks praegu avatud.",
    },
    github: {
      name: "GitHubi repo",
      description:
        "Impordi kogu avalik või privaatne GitHubi repo ühe klõpsuga.",
      URL: "GitHubi repo URL",
      URL_explained: "Repo URL, mida soovid koguda.",
      token: "GitHubi juurdepääsuvõti",
      optional: "valikuline",
      token_explained: "Võti API piirangute vältimiseks.",
      token_explained_start: "Ilma ",
      token_explained_link1: "isikliku juurdepääsuvõtmeta",
      token_explained_middle:
        " võib GitHubi API piirata kogutavate failide hulka. Sa võid ",
      token_explained_link2: "luua ajutise juurdepääsuvõtme",
      token_explained_end: " selle vältimiseks.",
      ignores: "Faili välistused",
      git_ignore:
        ".gitignore formaadis nimekiri failidest, mida kogumisel ignoreerida. Vajuta Enter iga kirje järel.",
      task_explained:
        "Kui valmis, on failid dokumentide valijas tööruumidesse põimimiseks saadaval.",
      branch: "Haru, kust faile koguda",
      branch_loading: "-- harude laadimine --",
      branch_explained: "Haru, kust faile koguda.",
      token_information:
        "Ilma <b>GitHubi juurdepääsuvõtmeta</b> saab pistik koguda ainult repo <b>juurtaseme</b> faile GitHubi API piirangute tõttu.",
      token_personal: "Hangi tasuta isiklik juurdepääsuvõti GitHubist siit.",
    },
    gitlab: {
      name: "GitLabi repo",
      description:
        "Impordi kogu avalik või privaatne GitLabi repo ühe klõpsuga.",
      URL: "GitLabi repo URL",
      URL_explained: "Repo URL, mida soovid koguda.",
      token: "GitLabi juurdepääsuvõti",
      optional: "valikuline",
      token_explained: "Võti API piirangute vältimiseks.",
      token_description: "Vali täiendavad objektid, mida GitLabi API-st tuua.",
      token_explained_start: "Ilma ",
      token_explained_link1: "isikliku juurdepääsuvõtmeta",
      token_explained_middle:
        " võib GitLabi API piirata kogutavate failide hulka. Sa võid ",
      token_explained_link2: "luua ajutise juurdepääsuvõtme",
      token_explained_end: " selle vältimiseks.",
      fetch_issues: "Tõmba Issues dokumendina",
      ignores: "Faili välistused",
      git_ignore:
        ".gitignore formaadis nimekiri failidest, mida kogumisel ignoreerida. Vajuta Enter iga kirje järel.",
      task_explained:
        "Kui valmis, on failid dokumentide valijas tööruumidesse põimimiseks saadaval.",
      branch: "Haru, kust faile koguda",
      branch_loading: "-- harude laadimine --",
      branch_explained: "Haru, kust faile koguda.",
      token_information:
        "Ilma <b>GitLabi juurdepääsuvõtmeta</b> saab pistik koguda ainult repo <b>juurtaseme</b> faile GitLabi API piirangute tõttu.",
      token_personal: "Hangi tasuta isiklik juurdepääsuvõti GitLabist siit.",
    },
    youtube: {
      name: "YouTube'i transkript",
      description: "Impordi YouTube'i video täielik transkript lingi abil.",
      URL: "YouTube'i video URL",
      URL_explained_start:
        "Sisesta ükskõik millise YouTube'i video URL, et tuua selle transkript. Videol peavad olema ",
      URL_explained_link: "subtiitrid",
      URL_explained_end: " saadaval.",
      task_explained:
        "Kui valmis, on transkript dokumentide valijas tööruumidesse põimimiseks saadaval.",
      language: "Transkripti keel",
      language_explained: "Vali transkripti keel, mida soovid koguda.",
      loading_languages: "-- keelte laadimine --",
    },
    "website-depth": {
      name: "Massiline linkide kraapija",
      description: "Kraabi veebisaiti ja selle alamlinke määratud sügavuseni.",
      URL: "Veebisaidi URL",
      URL_explained: "Veebisaidi URL, mida soovid kraapida.",
      depth: "Kraapimissügavus",
      depth_explained: "Alamlinkide arv, mida töötaja alg-URL-ist järgib.",
      max_pages: "Maksimaalne lehtede arv",
      max_pages_explained: "Maksimaalne linkide arv, mida kraapida.",
      task_explained:
        "Kui valmis, on kogu kraabitud sisu dokumentide valijas tööruumidesse põimimiseks saadaval.",
    },
    confluence: {
      name: "Confluence",
      description: "Impordi kogu Confluence'i leht ühe klõpsuga.",
      deployment_type: "Confluence'i tüüp",
      deployment_type_explained:
        "Määra, kas Confluence töötab Atlassiani pilves või on isemajutatud.",
      base_url: "Confluence'i baas-URL",
      base_url_explained: "Sinu Confluence'i ruumi baas-URL.",
      space_key: "Confluence'i space key",
      space_key_explained:
        "Space key, mida kasutatakse (tavaliselt algab ~ märgiga).",
      username: "Confluence'i kasutajanimi",
      username_explained: "Sinu Confluence'i kasutajanimi.",
      auth_type: "Autentimise tüüp",
      auth_type_explained:
        "Vali autentimise tüüp, millega Confluence'i lehtedele ligi pääseda.",
      auth_type_username: "Kasutajanimi + juurdepääsuvõti",
      auth_type_personal: "Isiklik juurdepääsuvõti",
      token: "Confluence'i juurdepääsuvõti",
      token_explained_start:
        "Autentimiseks on vajalik juurdepääsuvõti. Saad selle genereerida",
      token_explained_link: "siin",
      token_desc: "Juurdepääsuvõti autentimiseks",
      pat_token: "Confluence'i PAT-võti",
      pat_token_explained: "Sinu isiklik juurdepääsuvõti.",
      task_explained:
        "Kui valmis, on lehe sisu dokumentide valijas tööruumidesse põimimiseks saadaval.",
    },
    manage: {
      documents: "Dokumendid",
      "data-connectors": "Andmepistikud",
      "desktop-only":
        "Neid sätteid saab muuta ainult lauaarvutis. Ava see leht töölaual.",
      dismiss: "Sulge",
      editing: "Muudan",
    },
    directory: {
      "my-documents": "Minu dokumendid",
      "new-folder": "Uus kaust",
      "search-document": "Otsi dokumenti",
      "no-documents": "Dokumendid puuduvad",
      "move-workspace": "Liiguta tööruumi",
      name: "Nimi",
      "delete-confirmation":
        "Kas oled kindel, et soovid need failid ja kaustad kustutada?\nFailid eemaldatakse süsteemist ning kõigist tööruumidest.\nTegevust ei saa tagasi võtta.",
      "removing-message":
        "Eemaldan {{count}} dokumenti ja {{folderCount}} kausta. Palun oota.",
      "move-success": "Liigutatud edukalt {{count}} dokumenti.",
      date: "Kuupäev",
      type: "Tüüp",
      no_docs: "Dokumendid puuduvad",
      select_all: "Vali kõik",
      deselect_all: "Tühista valik",
      remove_selected: "Eemalda valitud",
      costs: "*Ühekordne embeddingu kulu",
      save_embed: "Salvesta ja põimi",
    },
    upload: {
      "processor-offline": "Dokumenditöötleja pole saadaval",
      "processor-offline-desc":
        "Failide üleslaadimine pole võimalik, sest töötleja on offline. Proovi hiljem uuesti.",
      "click-upload": "Klõpsa või lohista failid siia",
      "file-types":
        "toetab tekstifaile, CSV-sid, arvutustabeleid, helifaile jpm!",
      "or-submit-link": "või esita link",
      "placeholder-link": "https://näide.ee",
      fetching: "Laen…",
      "fetch-website": "Tõmba veebisait",
      "privacy-notice":
        "Failid laetakse üles selle instantsi dokumenditöötlejasse ega jagata kolmandatele osapooltele.",
    },
    pinning: {
      what_pinning: "Mis on dokumendi kinnitamine?",
      pin_explained_block1:
        "Kui <b>kinnitad</b> dokumendi, lisatakse kogu selle sisu sinu päringule, et LLM mõistaks seda täielikult.",
      pin_explained_block2:
        "Sobib eriti <b>suure kontekstiga mudelitele</b> või väikestele, kuid olulistele failidele.",
      pin_explained_block3:
        "Kui vaikimisi vastused ei rahulda, on kinnitamine lihtne viis kvaliteedi tõstmiseks.",
      accept: "Selge",
    },
    watching: {
      what_watching: "Mida tähendab dokumendi jälgimine?",
      watch_explained_block1:
        "Kui <b>jälgid</b> dokumenti, sünkroniseerime selle sisu <i>automaatselt</i> allikast kindlate intervallidega, uuendades seda kõigis tööruumides.",
      watch_explained_block2:
        "Hetkel toetab see ainult veebi-põhist sisu, mitte käsitsi üleslaetud faile.",
      watch_explained_block3_start: "Saad jälgitavaid dokumente hallata ",
      watch_explained_block3_link: "Failihalduri",
      watch_explained_block3_end: " vaates.",
      accept: "Selge",
    },
  },
  chat_window: {
    welcome: "Tere tulemast oma uude tööruumi.",
    get_started: "Alustamiseks",
    get_started_default: "Alustamiseks",
    upload: "laadi dokument üles",
    or: "või",
    attachments_processing: "Manused töötlevad. Palun oota…",
    send_chat: "saada vestlus.",
    send_message: "Saada sõnum",
    attach_file: "Lisa fail vestlusele",
    slash: "Vaata kõiki slash-käske.",
    agents: "Vaata kõiki agente, keda saad kasutada.",
    text_size: "Muuda teksti suurust.",
    microphone: "Esita päring häälega.",
    send: "Saada päring tööruumi",
    tts_speak_message: "Loe sõnum ette",
    copy: "Kopeeri",
    regenerate: "Loo uuesti",
    regenerate_response: "Loo vastus uuesti",
    good_response: "Hea vastus",
    more_actions: "Rohkem toiminguid",
    hide_citations: "Peida viited",
    show_citations: "Näita viiteid",
    pause_tts_speech_message: "Pausi TTS kõne",
    fork: "Hargnemine",
    delete: "Kustuta",
    save_submit: "Salvesta ja saada",
    cancel: "Tühista",
    edit_prompt: "Redigeeri päringut",
    edit_response: "Redigeeri vastust",
    at_agent: "@agent",
    default_agent_description: " – selle tööruumi vaikimisi agent.",
    custom_agents_coming_soon: "kohandatud agendid tulekul!",
    slash_reset: "/reset",
    preset_reset_description: "Tühjenda vestlusajalugu ja alusta uut vestlust",
    add_new_preset: " Lisa uus preset",
    command: "Käsk",
    your_command: "sinu-käsk",
    placeholder_prompt: "Sisu, mis süstitakse sinu päringu ette.",
    description: "Kirjeldus",
    placeholder_description: "Vastab luuletusega LLM-idest.",
    save: "Salvesta",
    small: "Väike",
    normal: "Tavaline",
    large: "Suur",
    workspace_llm_manager: {
      search: "Otsi LLM-pakkujaid",
      loading_workspace_settings: "Laen tööruumi seadeid…",
      available_models: "Saadaval mudelid pakkujalt {{provider}}",
      available_models_description: "Vali mudel, mida tööruumis kasutada.",
      save: "Kasuta seda mudelit",
      saving: "Määran mudelit vaikimisi…",
      missing_credentials: "Sellel pakkujal puuduvad võtmed!",
      missing_credentials_description: "Klõpsa, et määrata võtmed",
    },
  },
  profile_settings: {
    edit_account: "Muuda kontot",
    profile_picture: "Profiilipilt",
    remove_profile_picture: "Eemalda profiilipilt",
    username: "Kasutajanimi",
    username_description:
      "Kasutajanimi võib sisaldada ainult väiketähti, numbreid, alakriipse ja sidekriipse, ilma tühikuteta",
    new_password: "Uus parool",
    passwort_description: "Parool peab olema vähemalt 8 märki",
    cancel: "Tühista",
    update_account: "Uuenda kontot",
    theme: "Teema eelistus",
    language: "Eelistatud keel",
    failed_upload: "Profiilipildi üleslaadimine ebaõnnestus: {{error}}",
    upload_success: "Profiilipilt üles laaditud.",
    failed_remove: "Profiilipildi eemaldamine ebaõnnestus: {{error}}",
    profile_updated: "Profiil uuendatud.",
    failed_update_user: "Kasutaja uuendamine ebaõnnestus: {{error}}",
    account: "Konto",
    support: "Tugi",
    signout: "Logi välja",
  },
  "keyboard-shortcuts": {
    title: "Klaviatuuri otseteed",
    shortcuts: {
      settings: "Ava seaded",
      workspaceSettings: "Ava praeguse tööruumi seaded",
      home: "Mine avalehele",
      workspaces: "Halda tööruume",
      apiKeys: "API võtmete seaded",
      llmPreferences: "LLM-eelistused",
      chatSettings: "Vestluse seaded",
      help: "Näita otseteeabi",
      showLLMSelector: "Näita tööruumi LLM-valikut",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Edu!",
        success_description: "Sinu süsteemprompt avaldati Community Hubis!",
        success_thank_you: "Aitäh jagamast!",
        view_on_hub: "Vaata Hubis",
        modal_title: "Avalda süsteemprompt",
        name_label: "Nimi",
        name_description: "Süsteemprompti kuvanimi.",
        name_placeholder: "Minu süsteemprompt",
        description_label: "Kirjeldus",
        description_description:
          "Kirjeldus, mis selgitab süsteemprompti eesmärki.",
        tags_label: "Sildid",
        tags_description:
          "Lisa kuni 5 silti (kuni 20 tähemärki igaüks) otsingu lihtsustamiseks.",
        tags_placeholder: "Kirjuta ja vajuta Enter, et lisada silte",
        visibility_label: "Nähtavus",
        public_description: "Avalikud promptid on kõigile nähtavad.",
        private_description: "Privaatseid prompte näed vaid sina.",
        publish_button: "Avalda Community Hubis",
        submitting: "Avaldan…",
        submit: "Avalda Community Hubis",
        prompt_label: "Prompt",
        prompt_description: "Süsteemprompt, mis juhendab LLM-i.",
        prompt_placeholder: "Sisesta süsteemprompt siia…",
      },
      agent_flow: {
        public_description: "Avalikud agendi vood on kõigile nähtavad.",
        private_description: "Privaatseid agendi vooge näed vaid sina.",
        success_title: "Edu!",
        success_description: "Sinu agendi voog avaldati Community Hubis!",
        success_thank_you: "Aitäh jagamast!",
        view_on_hub: "Vaata Hubis",
        modal_title: "Avalda agendi voog",
        name_label: "Nimi",
        name_description: "Agendi voo kuvanimi.",
        name_placeholder: "Minu agendi voog",
        description_label: "Kirjeldus",
        description_description: "Kirjeldus, mis selgitab agendi voo eesmärki.",
        tags_label: "Sildid",
        tags_description:
          "Lisa kuni 5 silti (kuni 20 tähemärki) otsingu lihtsustamiseks.",
        tags_placeholder: "Kirjuta ja vajuta Enter, et lisada silte",
        visibility_label: "Nähtavus",
        publish_button: "Avalda Community Hubis",
        submitting: "Avaldan…",
        submit: "Avalda Community Hubis",
        privacy_note:
          "Agendi vood laetakse üles alati privaatsena, et kaitsta tundlikku infot. Nähtavust saab hiljem Hubis muuta. Kontrolli, et voog ei sisaldaks privaatseid andmeid.",
      },
      slash_command: {
        success_title: "Edu!",
        success_description: "Sinu slash-käsk avaldati Community Hubis!",
        success_thank_you: "Aitäh jagamast!",
        view_on_hub: "Vaata Hubis",
        modal_title: "Avalda slash-käsk",
        name_label: "Nimi",
        name_description: "Slash-käsku kuvatav nimi.",
        name_placeholder: "Minu slash-käsk",
        description_label: "Kirjeldus",
        description_description:
          "Kirjeldus, mis selgitab slash-käsku eesmärki.",
        command_label: "Käsk",
        command_description:
          "Käsk, mille kasutajad sisestavad selle preseti käivitamiseks.",
        command_placeholder: "minu-käsk",
        tags_label: "Sildid",
        tags_description:
          "Lisa kuni 5 silti (kuni 20 tähemärki) otsingu lihtsustamiseks.",
        tags_placeholder: "Kirjuta ja vajuta Enter, et lisada silte",
        visibility_label: "Nähtavus",
        public_description: "Avalikud käsud on kõigile nähtavad.",
        private_description: "Privaatseid käske näed vaid sina.",
        publish_button: "Avalda Community Hubis",
        submitting: "Avaldan…",
        prompt_label: "Prompt",
        prompt_description:
          "Prompt, mida kasutatakse, kui slash-käsk käivitub.",
        prompt_placeholder: "Sisesta prompt siia…",
      },
      generic: {
        unauthenticated: {
          title: "Autentimine vajalik",
          description: "Enne avaldamist pead Community Hubi sisselogima.",
          button: "Ühendu Community Hubiga",
        },
      },
    },
  },
};

export default TRANSLATIONS;
