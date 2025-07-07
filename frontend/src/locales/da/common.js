// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Velkommen til",
      getStarted: "Kom godt i gang",
    },
    llm: {
      title: "LLM-præference",
      description:
        "AnythingLLM kan arbejde med mange LLM-udbydere. Dette vil være den tjeneste, der håndterer chat.",
    },
    userSetup: {
      title: "Brugeropsætning",
      description: "Konfigurer dine brugerindstillinger.",
      howManyUsers: "Hvor mange brugere vil benytte denne instans?",
      justMe: "Kun mig",
      myTeam: "Mit team",
      instancePassword: "Instansadgangskode",
      setPassword: "Vil du oprette en adgangskode?",
      passwordReq: "Adgangskoder skal være på mindst 8 tegn.",
      passwordWarn:
        "Det er vigtigt at gemme denne adgangskode, da der ikke findes nogen metode til genoprettelse.",
      adminUsername: "Brugernavn til admin-konto",
      adminUsernameReq:
        "Brugernavnet skal være mindst 6 tegn langt og må kun indeholde små bogstaver, tal, understregninger og bindestreger uden mellemrum.",
      adminPassword: "Adgangskode til admin-konto",
      adminPasswordReq: "Adgangskoder skal være på mindst 8 tegn.",
      teamHint:
        "Som standard vil du være den eneste administrator. Når onboarding er fuldført, kan du oprette og invitere andre til at blive brugere eller administratorer. Glem ikke din adgangskode, da kun administratorer kan nulstille adgangskoder.",
    },
    data: {
      title: "Datahåndtering & Privatliv",
      description:
        "Vi er forpligtet til gennemsigtighed og kontrol, når det gælder dine persondata.",
      settingsHint:
        "Disse indstillinger kan ændres når som helst under indstillingerne.",
    },
    survey: {
      title: "Velkommen til AnythingLLM",
      description:
        "Hjælp os med at gøre AnythingLLM tilpasset dine behov. Valgfrit.",
      email: "Hvad er din e-mail?",
      useCase: "Hvad vil du bruge AnythingLLM til?",
      useCaseWork: "Til arbejde",
      useCasePersonal: "Til personligt brug",
      useCaseOther: "Andet",
      comment: "Hvordan hørte du om AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - Fortæl os, hvordan du fandt os!",
      skip: "Spring undersøgelsen over",
      thankYou: "Tak for din feedback!",
    },
    workspace: {
      title: "Opret dit første arbejdsområde",
      description:
        "Opret dit første arbejdsområde og kom i gang med AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Navn på arbejdsområder",
    error: "fejl",
    success: "succes",
    user: "Bruger",
    selection: "Modelvalg",
    saving: "Gemmer...",
    save: "Gem ændringer",
    previous: "Forrige side",
    next: "Næste side",
    optional: "Valgfrit",
    yes: "Ja",
    no: "Nej",
  },
  settings: {
    title: "Instansindstillinger",
    system: "Generelle indstillinger",
    invites: "Invitationer",
    users: "Brugere",
    workspaces: "Arbejdsområder",
    "workspace-chats": "Arbejdsområde-chat",
    customization: "Tilpasning",
    "api-keys": "Udvikler API",
    llm: "LLM",
    transcription: "Transskription",
    embedder: "Indlejring",
    "text-splitting": "Tekst-splitter og opdeling",
    "voice-speech": "Stemme & Tale",
    "vector-database": "Vektordatabase",
    embeds: "Chat-indlejring",
    "embed-chats": "Historik for chat-indlejringer",
    security: "Sikkerhed",
    "event-logs": "Hændelseslog",
    privacy: "Privatliv & Data",
    "ai-providers": "AI-udbydere",
    "agent-skills": "Agentfærdigheder",
    admin: "Administrator",
    tools: "Værktøjer",
    "experimental-features": "Eksperimentelle funktioner",
    contact: "Kontakt support",
    "browser-extension": "Browserudvidelse",
    "system-prompt-variables": null,
    interface: null,
    branding: null,
    chat: null,
  },
  login: {
    "multi-user": {
      welcome: "Velkommen til",
      "placeholder-username": "Brugernavn",
      "placeholder-password": "Adgangskode",
      login: "Log ind",
      validating: "Validerer...",
      "forgot-pass": "Glemt adgangskode",
      reset: "Nulstil",
    },
    "sign-in": {
      start: "Log ind på din",
      end: "konto.",
    },
    "password-reset": {
      title: "Nulstilling af adgangskode",
      description:
        "Angiv de nødvendige oplysninger nedenfor for at nulstille din adgangskode.",
      "recovery-codes": "Gendannelseskoder",
      "recovery-code": "Gendannelseskode {{index}}",
      "back-to-login": "Tilbage til log ind",
    },
  },
  welcomeMessage: {
    part1:
      "Velkommen til AnythingLLM, AnythingLLM er et open source AI-værktøj fra Mintplex Labs, der forvandler alt til en trænet chatbot, som du kan spørge og chatte med. AnythingLLM er en BYOK (bring-your-own-keys) software, så der er ingen abonnement, gebyr eller omkostninger forbundet med denne software udover de tjenester, du ønsker at bruge den med.",
    part2:
      "AnythingLLM er den nemmeste måde at samle kraftfulde AI-produkter som OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB og andre tjenester i en praktisk pakke uden besvær, så du kan øge din produktivitet 100 gange.",
    part3:
      "AnythingLLM kan køre helt lokalt på din maskine med minimal overhead, så du næsten ikke bemærker, at den er der! Ingen GPU er nødvendig. Installation i skyen og on-premises er også tilgængelig.\nAI-værktøjsøkosystemet bliver mere kraftfuldt hver dag. AnythingLLM gør det nemt at bruge.",
    githubIssue: "Opret et issue på GitHub",
    user1: "Hvordan kommer jeg i gang?!",
    part4:
      "Det er enkelt. Alle samlinger er organiseret i beholdere, som vi kalder \"arbejdsområder\". Arbejdsområder er beholdere med filer, dokumenter, billeder, PDF'er og andre filer, som vil blive transformeret til noget, LLM'er kan forstå og bruge i samtale.\n\nDu kan tilføje og fjerne filer når som helst.",
    createWorkspace: "Opret dit første arbejdsområde",
    user2:
      "Er dette som en AI-dropbox eller noget? Hvad med chat? Det er jo en chatbot, ikke sandt?",
    part5:
      "AnythingLLM er mere end en smartere Dropbox.\n\nAnythingLLM tilbyder to måder at kommunikere med dine data på:\n\n<i>Forespørgsel:</i> Dine chats vil returnere data eller inferenser fundet i de dokumenter, som dit arbejdsområde har adgang til. Tilføjelse af flere dokumenter til arbejdsområdet gør det klogere! \n\n<i>Samtalende:</i> Dine dokumenter + din løbende chat-historik bidrager begge til LLM'ens viden samtidigt. Perfekt til at tilføje realtids tekstbaserede oplysninger eller rette fejl og misforståelser, som LLM'en måtte have. \n\nDu kan skifte mellem de to tilstande \n<i>midt i en samtale!</i>",
    user3: "Wow, det lyder fantastisk, lad mig prøve det med det samme!",
    part6: "Hav det sjovt!",
    starOnGitHub: "Giv en stjerne på GitHub",
    contact: "Kontakt Mintplex Labs",
  },
  "new-workspace": {
    title: "Nyt arbejdsområde",
    placeholder: "Mit arbejdsområde",
  },
  "workspaces—settings": {
    general: "Generelle indstillinger",
    chat: "Chatindstillinger",
    vector: "Vektordatabase",
    members: "Medlemmer",
    agent: "Agentkonfiguration",
  },
  general: {
    vector: {
      title: "Antal vektorer",
      description: "Samlet antal vektorer i din vektordatabase.",
    },
    names: {
      description: "Dette vil kun ændre visningsnavnet på dit arbejdsområde.",
    },
    message: {
      title: "Foreslåede chatbeskeder",
      description:
        "Tilpas de beskeder, der vil blive foreslået til brugerne af dit arbejdsområde.",
      add: "Tilføj ny besked",
      save: "Gem beskeder",
      heading: "Forklar mig",
      body: "fordelene ved AnythingLLM",
    },
    pfp: {
      title: "Assistentens profilbillede",
      description: "Tilpas assistentens profilbillede for dette arbejdsområde.",
      image: "Arbejdsområdebillede",
      remove: "Fjern arbejdsområdebillede",
    },
    delete: {
      title: "Slet arbejdsområde",
      description:
        "Slet dette arbejdsområde og alle dets data. Dette vil slette arbejdsområdet for alle brugere.",
      delete: "Slet arbejdsområde",
      deleting: "Sletter arbejdsområde...",
      "confirm-start": "Du er ved at slette dit hele",
      "confirm-end":
        "arbejdsområde. Dette vil fjerne alle vektor-indlejringer i din vektordatabase.\n\nDe oprindelige kildefiler forbliver uberørte. Denne handling kan ikke fortrydes.",
    },
  },
  chat: {
    llm: {
      title: "Arbejdsområdets LLM-udbyder",
      description:
        "Den specifikke LLM-udbyder og -model, der vil blive brugt for dette arbejdsområde. Som standard anvendes systemets LLM-udbyder og indstillinger.",
      search: "Søg blandt alle LLM-udbydere",
    },
    model: {
      title: "Arbejdsområdets chatmodel",
      description:
        "Den specifikke chatmodel, der vil blive brugt for dette arbejdsområde. Hvis tom, anvendes systemets LLM-præference.",
      wait: "-- venter på modeller --",
    },
    mode: {
      title: "Chat-tilstand",
      chat: {
        title: "Chat",
        "desc-start": "vil give svar baseret på LLM'ens generelle viden",
        and: "og",
        "desc-end": "dokumentkontekst der findes.",
      },
      query: {
        title: "Forespørgsel",
        "desc-start": "vil give svar",
        only: "kun",
        "desc-end": "hvis dokumentkontekst findes.",
      },
    },
    history: {
      title: "Chat-historik",
      "desc-start":
        "Antallet af tidligere chats, der vil blive inkluderet i svarens korttidshukommelse.",
      recommend: "Anbefal 20. ",
      "desc-end":
        "Alt over 45 kan sandsynligvis føre til gentagne chat-fejl afhængigt af beskedstørrelsen.",
    },
    prompt: {
      title: "Prompt",
      description:
        "Prompten, der vil blive brugt i dette arbejdsområde. Definér konteksten og instruktionerne til, at AI'en kan generere et svar. Du bør levere en omhyggeligt udformet prompt, så AI'en kan generere et relevant og præcist svar.",
      history: {
        title: null,
        clearAll: null,
        noHistory: null,
        restore: null,
        delete: null,
        deleteConfirm: null,
        clearAllConfirm: null,
        expand: null,
        publish: null,
      },
    },
    refusal: {
      title: "Afvisningssvar for forespørgsels-tilstand",
      "desc-start": "Når du er i",
      query: "forespørgsels-tilstand",
      "desc-end":
        "tilstand, kan du vælge at returnere et brugerdefineret afvisningssvar, når der ikke findes nogen kontekst.",
      "tooltip-title": null,
      "tooltip-description": null,
    },
    temperature: {
      title: "LLM-temperatur",
      "desc-start":
        'Denne indstilling styrer, hvor "kreative" dine LLM-svar vil være.',
      "desc-end":
        "Jo højere tallet er, desto mere kreative bliver svarene. For nogle modeller kan for høje værdier føre til usammenhængende svar.",
      hint: "De fleste LLM'er har forskellige acceptable intervaller for gyldige værdier. Konsulter din LLM-udbyder for den information.",
    },
  },
  "vector-workspace": {
    identifier: "Identifikator for vektordatabase",
    snippets: {
      title: "Maksimalt antal kontekstuddrag",
      description:
        "Denne indstilling styrer det maksimale antal kontekstuddrag, der vil blive sendt til LLM'en pr. chat eller forespørgsel.",
      recommend: "Anbefalet: 4",
    },
    doc: {
      title: "Tærskel for dokuments lighed",
      description:
        "Den minimale lighedsscore, der kræves for, at en kilde betragtes som relateret til chatten. Jo højere tallet er, desto mere lig skal kilden være chatten.",
      zero: "Ingen begrænsning",
      low: "Lav (lighedsscore ≥ 0,25)",
      medium: "Middel (lighedsscore ≥ 0,50)",
      high: "Høj (lighedsscore ≥ 0,75)",
    },
    reset: {
      reset: "Nulstil vektordatabase",
      resetting: "Rydder vektorer...",
      confirm:
        "Du er ved at nulstille dette arbejdsområdes vektordatabase. Dette vil fjerne alle vektor-indlejringer, der aktuelt er indlejret.\n\nDe oprindelige kildefiler forbliver uberørte. Denne handling kan ikke fortrydes.",
      error: "Kunne ikke nulstille arbejdsområdets vektordatabase!",
      success: "Arbejdsområdets vektordatabase blev nulstillet!",
    },
  },
  agent: {
    "performance-warning":
      "Ydeevnen for LLM'er, der ikke eksplicit understøtter værktøjskald, er i høj grad afhængig af modellens kapacitet og nøjagtighed. Nogle funktioner kan være begrænsede eller ikke-fungerende.",
    provider: {
      title: "Arbejdsområdets agent LLM-udbyder",
      description:
        "Den specifikke LLM-udbyder og -model, der vil blive brugt for dette arbejdsområdes @agent-agent.",
    },
    mode: {
      chat: {
        title: "Arbejdsområdets agent chatmodel",
        description:
          "Den specifikke chatmodel, der vil blive brugt for dette arbejdsområdes @agent-agent.",
      },
      title: "Arbejdsområdets agentmodel",
      description:
        "Den specifikke LLM-model, der vil blive brugt for dette arbejdsområdes @agent-agent.",
      wait: "-- venter på modeller --",
    },
    skill: {
      title: "Standard agentfærdigheder",
      description:
        "Forbedr standardagentens naturlige evner med disse forudbyggede færdigheder. Denne opsætning gælder for alle arbejdsområder.",
      rag: {
        title: "RAG & langtidshukommelse",
        description:
          'Giv agenten mulighed for at udnytte dine lokale dokumenter til at besvare en forespørgsel eller få agenten til at "huske" dele af indhold for langtidshukommelse.',
      },
      view: {
        title: "Se og opsummér dokumenter",
        description:
          "Giv agenten mulighed for at liste og opsummere indholdet af de filer i arbejdsområdet, der aktuelt er indlejret.",
      },
      scrape: {
        title: "Scrape hjemmesider",
        description:
          "Giv agenten mulighed for at besøge og scrape indholdet fra hjemmesider.",
      },
      generate: {
        title: "Generer diagrammer",
        description:
          "Gør det muligt for standardagenten at generere forskellige typer diagrammer fra data, der leveres eller gives i chat.",
      },
      save: {
        title: "Generer og gem filer i browseren",
        description:
          "Gør det muligt for standardagenten at generere og skrive til filer, der gemmes og kan downloades i din browser.",
      },
      web: {
        title: "Live web-søgning og browsing",
        "desc-start":
          "Gør det muligt for din agent at søge på internettet for at besvare dine spørgsmål ved at forbinde til en web-søgeudbyder (SERP).",
        "desc-end":
          "Web-søgning under agent-sessioner vil ikke fungere, før dette er opsat.",
      },
    },
  },
  recorded: {
    title: "Arbejdsområde-chat",
    description:
      "Dette er alle de optagede chats og beskeder, der er blevet sendt af brugere, sorteret efter oprettelsesdato.",
    export: "Eksporter",
    table: {
      id: "Id",
      by: "Sendt af",
      workspace: "Arbejdsområde",
      prompt: "Prompt",
      response: "Svar",
      at: "Sendt kl.",
    },
  },
  api: {
    title: "API-nøgler",
    description:
      "API-nøgler giver indehaveren mulighed for programmatisk at få adgang til og administrere denne AnythingLLM-instans.",
    link: "Læs API-dokumentationen",
    generate: "Generér ny API-nøgle",
    table: {
      key: "API-nøgle",
      by: "Oprettet af",
      created: "Oprettet",
    },
  },
  llm: {
    title: "LLM-præference",
    description:
      "Disse er legitimationsoplysningerne og indstillingerne for din foretrukne LLM chat- og indlejringsudbyder. Det er vigtigt, at disse nøgler er opdaterede og korrekte, ellers vil AnythingLLM ikke fungere korrekt.",
    provider: "LLM-udbyder",
    providers: {
      azure_openai: {
        azure_service_endpoint: null,
        api_key: null,
        chat_deployment_name: null,
        chat_model_token_limit: null,
        model_type: null,
        default: null,
        reasoning: null,
      },
    },
  },
  transcription: {
    title: "Foretrukken transskriptionsmodel",
    description:
      "Disse er legitimationsoplysningerne og indstillingerne for din foretrukne transskriptionsmodeludbyder. Det er vigtigt, at disse nøgler er opdaterede og korrekte, ellers vil mediefiler og lyd ikke blive transskriberet.",
    provider: "Transskriptionsudbyder",
    "warn-start":
      "Brug af den lokale whisper-model på maskiner med begrænset RAM eller CPU kan få AnythingLLM til at gå i stå under behandling af mediefiler.",
    "warn-recommend": "Vi anbefaler mindst 2GB RAM og upload af filer <10Mb.",
    "warn-end":
      "Den indbyggede model vil automatisk blive downloadet ved første brug.",
  },
  embedding: {
    title: "Foretrukken indlejringsmetode",
    "desc-start":
      "Når du bruger en LLM, der ikke understøtter en indlejringsmotor natively, skal du muligvis yderligere angive legitimationsoplysninger til indlejring af tekst.",
    "desc-end":
      "Indlejring er processen med at omdanne tekst til vektorer. Disse legitimationsoplysninger er nødvendige for at omdanne dine filer og prompts til et format, som AnythingLLM kan bruge til behandling.",
    provider: {
      title: "Indlejringsudbyder",
      description:
        "Ingen opsætning er nødvendig, når du bruger AnythingLLM's indbyggede indlejringsmotor.",
    },
  },
  text: {
    title: "Præferencer for tekstopdeling & segmentering",
    "desc-start":
      "Nogle gange vil du måske ændre den standardmåde, som nye dokumenter deles og opdeles i bidder, inden de indsættes i din vektordatabase.",
    "desc-end":
      "Du bør kun ændre denne indstilling, hvis du forstår, hvordan tekstopdeling fungerer og dens bivirkninger.",
    "warn-start": "Ændringer her vil kun gælde for",
    "warn-center": "nyligt indlejrede dokumenter",
    "warn-end": ", ikke eksisterende dokumenter.",
    size: {
      title: "Størrelse på tekstbidder",
      description:
        "Dette er den maksimale længde af tegn, der kan være i en enkelt vektor.",
      recommend: "Indlejringsmodellens maksimale længde er",
    },
    overlap: {
      title: "Overlap mellem tekstbidder",
      description:
        "Dette er det maksimale overlap af tegn, der forekommer ved opdeling mellem to tilstødende tekstbidder.",
    },
  },
  vector: {
    title: "Vektordatabase",
    description:
      "Disse er legitimationsoplysningerne og indstillingerne for, hvordan din AnythingLLM-instans vil fungere. Det er vigtigt, at disse nøgler er opdaterede og korrekte.",
    provider: {
      title: "Vektordatabaseudbyder",
      description: "Ingen konfiguration er nødvendig for LanceDB.",
    },
  },
  embeddable: {
    title: "Indlejrede chatwidgets",
    description:
      "Indlejrede chatwidgets er offentligt tilgængelige chatgrænseflader, der er knyttet til et enkelt arbejdsområde. Disse giver dig mulighed for at opbygge arbejdsområder, som du derefter kan offentliggøre for verden.",
    create: "Opret indlejring",
    table: {
      workspace: "Arbejdsområde",
      chats: "Sendte chats",
      active: "Aktive domæner",
      created: null,
    },
  },
  "embed-chats": {
    title: "Indlejrede chats",
    export: "Eksporter",
    description:
      "Dette er alle de optagede chats og beskeder fra enhver indlejring, du har offentliggjort.",
    table: {
      embed: "Indlejring",
      sender: "Afsender",
      message: "Besked",
      response: "Svar",
      at: "Sendt kl.",
    },
  },
  multi: {
    title: "Multi-brugertilstand",
    description:
      "Opsæt din instans til at understøtte dit team ved at aktivere multi-brugertilstand.",
    enable: {
      "is-enable": "Multi-brugertilstand er aktiveret",
      enable: "Aktivér multi-brugertilstand",
      description:
        "Som standard vil du være den eneste administrator. Som administrator skal du oprette konti til alle nye brugere eller administratorer. Glem ikke din adgangskode, da kun en administrator kan nulstille adgangskoder.",
      username: "Brugernavn til admin-konto",
      password: "Adgangskode til admin-konto",
    },
    password: {
      title: "Adgangskodebeskyttelse",
      description:
        "Beskyt din AnythingLLM-instans med en adgangskode. Hvis du glemmer den, findes der ingen genoprettelsesmetode, så sørg for at gemme denne adgangskode.",
    },
    instance: {
      title: "Adgangskodebeskyt instansen",
      description:
        "Som standard vil du være den eneste administrator. Som administrator skal du oprette konti til alle nye brugere eller administratorer. Glem ikke din adgangskode, da kun en administrator kan nulstille adgangskoder.",
      password: "Instansens adgangskode",
    },
  },
  event: {
    title: "Hændelseslog",
    description:
      "Se alle handlinger og hændelser, der sker på denne instans for overvågning.",
    clear: "Ryd hændelseslog",
    table: {
      type: "Hændelsestype",
      user: "Bruger",
      occurred: "Skete kl.",
    },
  },
  privacy: {
    title: "Privatliv & datahåndtering",
    description:
      "Dette er din konfiguration for, hvordan tilsluttede tredjepartsudbydere og AnythingLLM håndterer dine data.",
    llm: "Valg af LLM",
    embedding: "Foretrukken indlejring",
    vector: "Vektordatabase",
    anonymous: "Anonym telemetri aktiveret",
  },
  connectors: {
    "search-placeholder": "Søg efter datakonnektorer",
    "no-connectors": "Ingen datakonnektorer fundet.",
    github: {
      name: "GitHub-repository",
      description:
        "Importer et helt offentligt eller privat GitHub-repository med et enkelt klik.",
      URL: "GitHub-repository URL",
      URL_explained: "URL til det GitHub-repository, du ønsker at indsamle.",
      token: "GitHub-adgangstoken",
      optional: "valgfrit",
      token_explained: "Adgangstoken for at undgå hastighedsbegrænsning.",
      token_explained_start: "Uden en ",
      token_explained_link1: "Personlig adgangstoken",
      token_explained_middle:
        ", kan GitHub API'en begrænse antallet af filer, der kan indsamles på grund af ratebegrænsning. Du kan ",
      token_explained_link2: "oprette en midlertidig adgangstoken",
      token_explained_end: " for at undgå dette problem.",
      ignores: "Fil-ignoreringer",
      git_ignore:
        "Liste i .gitignore-format for at ignorere specifikke filer under indsamling. Tryk enter efter hver post, du vil gemme.",
      task_explained:
        "Når færdig, vil alle filer være tilgængelige for indlejring i arbejdsområder i dokumentvælgeren.",
      branch: "Den gren, du ønsker at indsamle filer fra.",
      branch_loading: "-- indlæser tilgængelige grene --",
      branch_explained: "Den gren, du ønsker at indsamle filer fra.",
      token_information:
        "Uden at udfylde <b>GitHub-adgangstoken</b> vil denne datakonnektor kun kunne indsamle <b>topniveau</b> filer fra repoet på grund af GitHubs offentlige API-ratebegrænsninger.",
      token_personal:
        "Få en gratis personlig adgangstoken med en GitHub-konto her.",
    },
    gitlab: {
      name: "GitLab-repository",
      description:
        "Importer et helt offentligt eller privat GitLab-repository med et enkelt klik.",
      URL: "GitLab-repository URL",
      URL_explained: "URL til det GitLab-repository, du ønsker at indsamle.",
      token: "GitLab-adgangstoken",
      optional: "valgfrit",
      token_explained: "Adgangstoken for at undgå ratebegrænsning.",
      token_description: "Vælg yderligere enheder at hente fra GitLab API'en.",
      token_explained_start: "Uden en ",
      token_explained_link1: "personlig adgangstoken",
      token_explained_middle:
        ", kan GitLab API'en begrænse antallet af filer, der kan indsamles på grund af ratebegrænsning. Du kan ",
      token_explained_link2: "oprette en midlertidig adgangstoken",
      token_explained_end: " for at undgå dette problem.",
      fetch_issues: "Hent issues som dokumenter",
      ignores: "Fil-ignoreringer",
      git_ignore:
        "Liste i .gitignore-format for at ignorere specifikke filer under indsamling. Tryk enter efter hver post, du vil gemme.",
      task_explained:
        "Når færdig, vil alle filer være tilgængelige for indlejring i arbejdsområder i dokumentvælgeren.",
      branch: "Den gren, du ønsker at indsamle filer fra",
      branch_loading: "-- indlæser tilgængelige grene --",
      branch_explained: "Den gren, du ønsker at indsamle filer fra.",
      token_information:
        "Uden at udfylde <b>GitLab-adgangstoken</b> vil denne datakonnektor kun kunne indsamle <b>topniveau</b> filer fra repoet på grund af GitLabs offentlige API-ratebegrænsninger.",
      token_personal:
        "Få en gratis personlig adgangstoken med en GitLab-konto her.",
    },
    youtube: {
      name: "YouTube-transskription",
      description:
        "Importer transskriptionen af en hel YouTube-video fra et link.",
      URL: "YouTube-video URL",
      URL_explained_start:
        "Indtast URL'en til en hvilken som helst YouTube-video for at hente dens transskription. Videoen skal have ",
      URL_explained_link: "undertekster",
      URL_explained_end: " tilgængelige.",
      task_explained:
        "Når færdig, vil transskriptionen være tilgængelig for indlejring i arbejdsområder i dokumentvælgeren.",
      language: "Transskript-sprog",
      language_explained:
        "Vælg det sprog, for transskriptionen, du ønsker at indsamle.",
      loading_languages: "-- indlæser tilgængelige sprog --",
    },
    "website-depth": {
      name: "Bulk link-scraper",
      description:
        "Scrape en hjemmeside og dens under-links op til en vis dybde.",
      URL: "Hjemmeside URL",
      URL_explained: "URL til den hjemmeside, du ønsker at scrape.",
      depth: "Gennemsøgningsdybde",
      depth_explained:
        "Dette er antallet af under-links, som arbejderen skal følge fra oprindelses-URL'en.",
      max_pages: "Maksimalt antal sider",
      max_pages_explained: "Maksimalt antal links, der skal scrapes.",
      task_explained:
        "Når færdig, vil alt scraped indhold være tilgængeligt for indlejring i arbejdsområder i dokumentvælgeren.",
    },
    confluence: {
      name: "Confluence",
      description: "Importer en hel Confluence-side med et enkelt klik.",
      deployment_type: "Confluence-udrulningstype",
      deployment_type_explained:
        "Bestem om din Confluence-instans er hostet på Atlassian Cloud eller selvhostet.",
      base_url: "Confluence-basis URL",
      base_url_explained: "Dette er basis-URL'en for dit Confluence-område.",
      space_key: "Confluence-områdenøgle",
      space_key_explained:
        "Dette er nøglekoden for dit Confluence-område, som vil blive brugt. Begynder typisk med ~",
      username: "Confluence-brugernavn",
      username_explained: "Dit Confluence-brugernavn",
      auth_type: "Confluence godkendelsestype",
      auth_type_explained:
        "Vælg den godkendelsestype, du ønsker at bruge for at få adgang til dine Confluence-sider.",
      auth_type_username: "Brugernavn og adgangstoken",
      auth_type_personal: "Personlig adgangstoken",
      token: "Confluence-adgangstoken",
      token_explained_start:
        "Du skal angive en adgangstoken for godkendelse. Du kan generere en adgangstoken",
      token_explained_link: "her",
      token_desc: "Adgangstoken til godkendelse",
      pat_token: "Confluence personlig adgangstoken",
      pat_token_explained: "Din personlige Confluence-adgangstoken.",
      task_explained:
        "Når færdig, vil sideindholdet være tilgængeligt for indlejring i arbejdsområder i dokumentvælgeren.",
    },
    manage: {
      documents: "Dokumenter",
      "data-connectors": "Datakonnektorer",
      "desktop-only":
        "Redigering af disse indstillinger er kun tilgængelig på en stationær enhed. Venligst tilgå denne side fra din stationære computer for at fortsætte.",
      dismiss: "Afvis",
      editing: "Redigerer",
    },
    directory: {
      "my-documents": "Mine dokumenter",
      "new-folder": "Ny mappe",
      "search-document": "Søg efter dokument",
      "no-documents": "Ingen dokumenter",
      "move-workspace": "Flyt til arbejdsområde",
      name: "Navn",
      "delete-confirmation":
        "Er du sikker på, at du vil slette disse filer og mapper?\nDette vil fjerne filerne fra systemet og automatisk fjerne dem fra alle eksisterende arbejdsområder.\nDenne handling kan ikke fortrydes.",
      "removing-message":
        "Fjerner {{count}} dokumenter og {{folderCount}} mapper. Vent venligst.",
      "move-success": "Flyttede {{count}} dokumenter med succes.",
      date: "Dato",
      type: "Type",
      no_docs: "Ingen dokumenter",
      select_all: "Vælg alle",
      deselect_all: "Fravælg alle",
      remove_selected: "Fjern valgte",
      costs: "*Engangsomkostning for indlejringer",
      save_embed: "Gem og indlejr",
    },
    upload: {
      "processor-offline": "Dokumentbehandler utilgængelig",
      "processor-offline-desc":
        "Vi kan ikke uploade dine filer lige nu, fordi dokumentbehandleren er offline. Prøv igen senere.",
      "click-upload": "Klik for at uploade eller træk og slip",
      "file-types":
        "understøtter tekstfiler, CSV-filer, regneark, lydfiler og mere!",
      "or-submit-link": "eller indsæt et link",
      "placeholder-link": "https://example.com",
      fetching: "Henter...",
      "fetch-website": "Hent hjemmeside",
      "privacy-notice":
        "Disse filer vil blive uploadet til dokumentbehandleren, der kører på denne AnythingLLM-instans. Filene sendes ikke eller deles med en tredjepart.",
    },
    pinning: {
      what_pinning: "Hvad er dokumentfastlåsning?",
      pin_explained_block1:
        "Når du <b>fastlåser</b> et dokument i AnythingLLM, vil vi indsætte hele dokumentets indhold i din prompt-vindue, så din LLM kan forstå det fuldt ud.",
      pin_explained_block2:
        "Dette fungerer bedst med <b>store kontekstmodeller</b> eller små filer, der er kritiske for dens vidensbase.",
      pin_explained_block3:
        "Hvis du ikke får de svar, du ønsker fra AnythingLLM som standard, er fastlåsning en fremragende måde at få svar af højere kvalitet med et enkelt klik.",
      accept: "Okay, jeg har forstået",
    },
    watching: {
      what_watching: "Hvad gør det at overvåge et dokument?",
      watch_explained_block1:
        "Når du <b>overvåger</b> et dokument i AnythingLLM, vil vi <i>automatisk</i> synkronisere dokumentets indhold fra dets oprindelige kilde med jævne mellemrum. Dette vil automatisk opdatere indholdet i alle arbejdsområder, hvor denne fil administreres.",
      watch_explained_block2:
        "Denne funktion understøtter i øjeblikket kun onlinebaseret indhold og vil ikke være tilgængelig for manuelt uploadede dokumenter.",
      watch_explained_block3_start:
        "Du kan administrere, hvilke dokumenter der overvåges fra ",
      watch_explained_block3_link: "Filhåndtering",
      watch_explained_block3_end: " adminvisning.",
      accept: "Okay, jeg har forstået",
    },
    obsidian: {
      name: null,
      description: null,
      vault_location: null,
      vault_description: null,
      selected_files: null,
      importing: null,
      import_vault: null,
      processing_time: null,
      vault_warning: null,
    },
  },
  chat_window: {
    welcome: "Velkommen til dit nye arbejdsområde.",
    get_started: "For at komme i gang, enten",
    get_started_default: "For at komme i gang",
    upload: "upload et dokument",
    or: "eller",
    send_chat: "send en chat.",
    send_message: "Send en besked",
    attach_file: "Vedhæft en fil til denne chat",
    slash: "Vis alle tilgængelige skråstreg-kommandoer til chat.",
    agents: "Vis alle tilgængelige agenter, du kan bruge til chat.",
    text_size: "Ændr tekststørrelse.",
    microphone: "Tal din prompt.",
    send: "Send promptbesked til arbejdsområdet",
    attachments_processing: null,
    tts_speak_message: null,
    copy: null,
    regenerate: null,
    regenerate_response: null,
    good_response: null,
    more_actions: null,
    hide_citations: null,
    show_citations: null,
    pause_tts_speech_message: null,
    fork: null,
    delete: null,
    save_submit: null,
    cancel: null,
    edit_prompt: null,
    edit_response: null,
    at_agent: null,
    default_agent_description: null,
    custom_agents_coming_soon: null,
    slash_reset: null,
    preset_reset_description: null,
    add_new_preset: null,
    command: null,
    your_command: null,
    placeholder_prompt: null,
    description: null,
    placeholder_description: null,
    save: null,
    small: null,
    normal: null,
    large: null,
    workspace_llm_manager: {
      search: null,
      loading_workspace_settings: null,
      available_models: null,
      available_models_description: null,
      save: null,
      saving: null,
      missing_credentials: null,
      missing_credentials_description: null,
    },
  },
  profile_settings: {
    edit_account: "Rediger konto",
    profile_picture: "Profilbillede",
    remove_profile_picture: "Fjern profilbillede",
    username: "Brugernavn",
    username_description:
      "Brugernavnet må kun indeholde små bogstaver, tal, understregninger og bindestreger uden mellemrum",
    new_password: "Ny adgangskode",
    passwort_description: "Adgangskoden skal være mindst 8 tegn lang",
    cancel: "Annuller",
    update_account: "Opdater konto",
    theme: "Tema-præference",
    language: "Foretrukket sprog",
    failed_upload: null,
    upload_success: null,
    failed_remove: null,
    profile_updated: null,
    failed_update_user: null,
    account: null,
    support: null,
    signout: null,
  },
  customization: {
    interface: {
      title: null,
      description: null,
    },
    branding: {
      title: null,
      description: null,
    },
    chat: {
      title: null,
      description: null,
      auto_submit: {
        title: null,
        description: null,
      },
      auto_speak: {
        title: null,
        description: null,
      },
      spellcheck: {
        title: null,
        description: null,
      },
    },
    items: {
      theme: {
        title: null,
        description: null,
      },
      "show-scrollbar": {
        title: null,
        description: null,
      },
      "support-email": {
        title: null,
        description: null,
      },
      "app-name": {
        title: null,
        description: null,
      },
      "chat-message-alignment": {
        title: null,
        description: null,
      },
      "display-language": {
        title: null,
        description: null,
      },
      logo: {
        title: null,
        description: null,
        add: null,
        recommended: null,
        remove: null,
        replace: null,
      },
      "welcome-messages": {
        title: null,
        description: null,
        new: null,
        system: null,
        user: null,
        message: null,
        assistant: null,
        "double-click": null,
        save: null,
      },
      "browser-appearance": {
        title: null,
        description: null,
        tab: {
          title: null,
          description: null,
        },
        favicon: {
          title: null,
          description: null,
        },
      },
      "sidebar-footer": {
        title: null,
        description: null,
        icon: null,
        link: null,
      },
    },
  },
  "main-page": {
    noWorkspaceError: null,
    checklist: {
      title: null,
      tasksLeft: null,
      completed: null,
      dismiss: null,
      tasks: {
        create_workspace: {
          title: null,
          description: null,
          action: null,
        },
        send_chat: {
          title: null,
          description: null,
          action: null,
        },
        embed_document: {
          title: null,
          description: null,
          action: null,
        },
        setup_system_prompt: {
          title: null,
          description: null,
          action: null,
        },
        define_slash_command: {
          title: null,
          description: null,
          action: null,
        },
        visit_community: {
          title: null,
          description: null,
          action: null,
        },
      },
    },
    quickLinks: {
      title: null,
      sendChat: null,
      embedDocument: null,
      createWorkspace: null,
    },
    exploreMore: {
      title: null,
      features: {
        customAgents: {
          title: null,
          description: null,
          primaryAction: null,
          secondaryAction: null,
        },
        slashCommands: {
          title: null,
          description: null,
          primaryAction: null,
          secondaryAction: null,
        },
        systemPrompts: {
          title: null,
          description: null,
          primaryAction: null,
          secondaryAction: null,
        },
      },
    },
    announcements: {
      title: null,
    },
    resources: {
      title: null,
      links: {
        docs: null,
        star: null,
      },
      keyboardShortcuts: null,
    },
  },
  "keyboard-shortcuts": {
    title: null,
    shortcuts: {
      settings: null,
      workspaceSettings: null,
      home: null,
      workspaces: null,
      apiKeys: null,
      llmPreferences: null,
      chatSettings: null,
      help: null,
      showLLMSelector: null,
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        submit: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
      agent_flow: {
        public_description: null,
        private_description: null,
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        publish_button: null,
        submitting: null,
        submit: null,
        privacy_note: null,
      },
      generic: {
        unauthenticated: {
          title: null,
          description: null,
          button: null,
        },
      },
      slash_command: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        command_label: null,
        command_description: null,
        command_placeholder: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
    },
  },
};

export default TRANSLATIONS;
