// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Kom godt i gang",
      welcome: "Velkommen",
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
  },
  common: {
    "workspaces-name": "Navn på arbejdsområder",
    selection: "Modelvalg",
    saving: "Gemmer...",
    save: "Gem ændringer",
    previous: "Forrige side",
    next: "Næste side",
    optional: "Valgfrit",
    yes: "Ja",
    no: "Nej",
    search: "Søg",
    username_requirements:
      "Brugernavnet skal bestå af 2-32 tegn, starte med et lille bogstav, og kun indeholde små bogstaver, tal, understregninger, bindestreger og punktummer.",
    on: "Om",
    none: "Ingen",
    stopped: "Stoppet",
    loading: "Indlæsning",
    refresh: "Opfrisk",
  },
  settings: {
    title: "Instansindstillinger",
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
    "system-prompt-variables":
      "System Prompt Variables\n\nSystem Prompt Variabler",
    interface: "Brugerpræferencer",
    branding: "Brandstrategi og white-labeling",
    chat: "Chat",
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Fælleshus",
      trending: "Udforsk populære emner",
      "your-account": "Dit konti",
      "import-item": "Importeret vare",
    },
    channels: "Kanaler",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Planlagte opgaver",
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
    "sign-in": "Log ind på din {{appName}} konto.",
    "password-reset": {
      title: "Nulstilling af adgangskode",
      description:
        "Angiv de nødvendige oplysninger nedenfor for at nulstille din adgangskode.",
      "recovery-codes": "Gendannelseskoder",
      "back-to-login": "Tilbage til log ind",
    },
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
    },
    mode: {
      title: "Chat-tilstand",
      chat: {
        title: "Chat",
        description:
          'vil levere svar baseret på LLM\'s generelle viden og den relevante dokumentkontekst.<br />Du skal bruge kommandoen "@agent" for at bruge værktøjerne.',
      },
      query: {
        title: "Forespørgsel",
        description:
          "vil kun give svar <b>hvis konteksten i dokumentet er fundet.</b>Du skal bruge kommandoen @agent for at bruge værktøjerne.",
      },
      automatic: {
        description:
          'vil automatisk bruge værktøjer, hvis modellen og udbyderen understøtter native værktøjsanrop. <br />Hvis native værktøjsanrop ikke understøttes, skal du bruge kommandoen "@agent" for at bruge værktøjer.',
        title: "Mæglersk",
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
        title:
          "System Prompt History\n\nHistorikken over system prompts er gemt i en fil, der er placeret i din lokale mappe.\nDu kan få adgang til historikken ved at åbne filen og læse indholdet.\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt\n<|file_name|>system_prompt_history.txt",
        clearAll: "Ryd alt",
        noHistory: "Ingen historik over systemprompt er tilgængelig.",
        restore: "Genopret",
        delete: "Slet",
        deleteConfirm:
          "Er du sikker på, at du vil slette dette historikelement?",
        clearAllConfirm:
          "Er du sikker på, at du vil slette al historik? Denne handling kan ikke fortrydes.",
        expand: "Udvid",
        publish: "Publicer på Community Hub",
      },
    },
    refusal: {
      title: "Afvisningssvar for forespørgsels-tilstand",
      "desc-start": "Når du er i",
      query: "forespørgsels-tilstand",
      "desc-end":
        "tilstand, kan du vælge at returnere et brugerdefineret afvisningssvar, når der ikke findes nogen kontekst.",
      "tooltip-title": "Hvorfor ser jeg dette?",
      "tooltip-description":
        "Du er i forespørgselsmodus, hvilket kun bruger information fra dine dokumenter. Skift til chat-modus for mere fleksible samtaler, eller klik her for at besøge vores dokumentation og lære mere om chat-moduser.",
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
      web: {
        title: "Live web-søgning og browsing",
        description:
          "Giv din agent mulighed for at søge på internettet for at besvare dine spørgsmål ved at forbinde den til en web-søgetjeneste (SERP).",
      },
      sql: {
        title: "SQL-forbindelse",
        description:
          "Giv din agent mulighed for at bruge SQL til at besvare dine spørgsmål ved at oprette forbindelse til forskellige SQL-databaseleverandører.",
      },
      default_skill:
        "Som standard er denne funktion aktiveret, men du kan deaktivere den, hvis du ikke ønsker, at den skal være tilgængelig for agenten.",
      filesystem: {
        title: "Adgang til filsystem",
        description:
          "Giv din agent mulighed for at læse, skrive, søge og administrere filer inden for en bestemt mappe. Understøtter filredigering, mappe navigation og indholds søgning.",
        learnMore: "Lær mere om, hvordan du kan bruge denne færdighed",
        configuration: "Konfiguration",
        readActions: "Læs handlinger",
        writeActions: "Skriv handlinger",
        warning:
          "Adgang til filsystemet kan være farligt, da det kan ændre eller slette filer. Se venligst <a>dokumentationen</a> før du aktiverer denne funktion.",
        skills: {
          "read-text-file": {
            title: "Åbn fil",
            description:
              "Læs indholdet af filer (tekst, kode, PDF-filer, billeder osv.)",
          },
          "read-multiple-files": {
            title: "Læs flere filer",
            description: "Læs flere filer samtidigt",
          },
          "list-directory": {
            title: "Telefonkatalog",
            description: "Vis filer og mapper i en mappe",
          },
          "search-files": {
            title: "Søg efter filer",
            description: "Søg efter filer efter navn eller indhold",
          },
          "get-file-info": {
            title: "Få filinformation",
            description: "Få detaljerede metadata om filer",
          },
          "edit-file": {
            title: "Rediger fil",
            description: "Rediger tekstfiler baseret på linjer",
          },
          "create-directory": {
            title: "Opret mappe",
            description: "Opret nye mapper",
          },
          "move-file": {
            title: "Flyt/Omdøb fil",
            description: "Flyt eller omdøb filer og mapper",
          },
          "copy-file": {
            title: "Kopier fil",
            description: "Kopier filer og mapper",
          },
          "write-text-file": {
            title: "Opret tekstfil",
            description:
              "Opret nye tekstfiler eller overskriv eksisterende tekstfiler.",
          },
        },
      },
      createFiles: {
        title: "Dokumentoprettelse",
        description:
          "Giv din agent mulighed for at oprette binære dokumentformater som PowerPoint-præsentationer, Excel-regneark, Word-dokumenter og PDF-filer. Filerne kan downloades direkte fra chatvinduet.",
        configuration: "Tilgængelige dokumenttyper",
        skills: {
          "create-text-file": {
            title: "Tekstfiler",
            description:
              "Opret tekstfiler med enhver indhold og filtype (.txt, .md, .json, .csv osv.)",
          },
          "create-pptx": {
            title: "PowerPoint-præsentationer",
            description:
              "Opret nye PowerPoint-præsentationer med slides, overskrifter og punktlister.",
          },
          "create-pdf": {
            title: "PDF-dokumenter",
            description:
              "Opret PDF-dokumenter fra Markdown eller almindelig tekst med grundlæggende formatering.",
          },
          "create-xlsx": {
            title: "Excel-regneark",
            description:
              "Opret Excel-dokumenter med tabellerede data, inklusive ark og formatering.",
          },
          "create-docx": {
            title: "Ord-dokumenter",
            description:
              "Opret Word-dokumenter med grundlæggende formatering og stil.",
          },
        },
      },
      gmail: {
        title: "Gmail-forbindelse",
        description:
          "Giv din agent mulighed for at interagere med Gmail – søg efter e-mails, læs samtaler, oprette udkast, sende e-mails og administrere din indbakke. <a>Læs dokumentationen</a>.",
        multiUserWarning:
          "Integration med Gmail er ikke tilgængelig i multi-bruger-tilstand af sikkerhedsmæssige årsager. For at bruge denne funktion, bedes du deaktivere multi-bruger-tilstanden.",
        configuration: "Konfiguration af Gmail",
        deploymentId: "Implementerings-ID",
        deploymentIdHelp: "Deployment-ID'en fra din Google Apps Script webapp",
        apiKey: "API-nøgle",
        apiKeyHelp:
          "API-nøglen, du har konfigureret i din Google Apps Script-implementering.",
        configurationRequired:
          "Venligst konfigurer Deployment ID og API-nøglen for at aktivere Gmail-funktionaliteten.",
        configured: "Konfigureret",
        searchSkills: "Søgeteknikker...",
        noSkillsFound: "Ingen resultater fundet, der matcher din søgning.",
        categories: {
          search: {
            title: "Søg og læs e-mails",
            description: "Søg og læs e-mails fra din Gmail-indbakke",
          },
          drafts: {
            title: "Udkast til e-mails",
            description: "Opret, rediger og administrer udkast til e-mails",
          },
          send: {
            title: "Send og svar på e-mails",
            description: "Send e-mails og svar på tråde øjeblikkeligt",
          },
          threads: {
            title: "Administrer e-mailtråde",
            description:
              "Administrer e-mailtråde – marker som læst/ulæst, arkiver, slet",
          },
          account: {
            title: "Statistik for integration",
            description:
              "Se statistik for din e-postindbakke og kontoinformation.",
          },
        },
        skills: {
          search: {
            title: "Søg i e-mails",
            description:
              "Søg efter e-mails ved hjælp af Gmail's forespørgselssprog",
          },
          readThread: {
            title: "Læs tråd",
            description: "Læs hele e-mailtråden sorteret efter ID",
          },
          createDraft: {
            title: "Opret udkast",
            description: "Opret et nyt udkast til en e-mail",
          },
          createDraftReply: {
            title: "Opret udkast",
            description: "Opret et udkast til et svar på en eksisterende tråd.",
          },
          updateDraft: {
            title: "Opdateret udkast",
            description: "Opdater en eksisterende udkast til en e-mail",
          },
          getDraft: {
            title: "Få udkast",
            description: "Hent en bestemt udkast baseret på ID",
          },
          listDrafts: {
            title: "Udkast til lister",
            description: "Vis alle udkastede e-mails",
          },
          deleteDraft: {
            title: "Slet udkast",
            description: "Slet et udkast til e-mail",
          },
          sendDraft: {
            title: "Send udkast",
            description: "Send en eksisterende udkast til en e-mail",
          },
          sendEmail: {
            title: "Send e-mail",
            description: "Send en e-mail med det samme",
          },
          replyToThread: {
            title: "Svar på tråd",
            description: "Svar på en e-mailtråd med det samme",
          },
          markRead: {
            title: "Mark Read",
            description: "Marker en tråd som læst",
          },
          markUnread: {
            title: "Marker som ikke læst",
            description: "Marker en tråd som ikke læst",
          },
          moveToTrash: {
            title: "Flyt til papirkurven",
            description: "Flyt en tråd til papirkurven",
          },
          moveToArchive: {
            title: "Arkiv",
            description: "Arkiver tråden",
          },
          moveToInbox: {
            title: "Flyt til indbakken",
            description: "Flyt en tråd til indbakken",
          },
          getMailboxStats: {
            title: "Statistik for postkasse",
            description:
              "Få oplysninger om antallet af ulæste beskeder og statistik for din e-mailindbakke.",
          },
          getInbox: {
            title: "Åbn indbakken",
            description:
              "En effektiv måde at hente e-mails fra din Gmail-indbakke",
          },
        },
      },
      outlook: {
        title: "Outlook-forbindelse",
        description:
          "Giv din agent mulighed for at interagere med Microsoft Outlook – søg efter e-mails, læs samtaler, oprette udkast, sende e-mails og administrer din indbakke via Microsoft Graph API. Se dokumentationen her: <a>.",
        multiUserWarning:
          "Integration med Outlook er ikke tilgængelig i multi-bruger-tilstand af sikkerhedsmæssige årsager. For at bruge denne funktion, bedes du deaktivere multi-bruger-tilstanden.",
        configuration: "Outlook-konfiguration",
        authType: "Kontotype",
        authTypeHelp:
          'Vælg, hvilke typer af Microsoft-konti der kan godkende. "Alle konti" understøtter både personlige og arbejds-/skolekonti. "Kun personlige konti" begrænser til kun personlige Microsoft-konti. "Kun arbejds-/skolekonti" begrænser til arbejds-/skolekonti fra en specifik Azure AD-tenant.',
        authTypeCommon: "Alle konti (personlige og arbejds-/skolerelaterede)",
        authTypeConsumers: "Kun personlige Microsoft-konti",
        authTypeOrganization: "Kun organisationskonti (kræver lejer-ID)",
        clientId: "Anvendelses-ID (kunde)",
        clientIdHelp:
          "Applikations-ID (også kaldet klient-ID) fra din Azure AD applikationsregistrering",
        tenantId: "Identifikationsnummer (Lejer)",
        tenantIdHelp:
          "Identifikationsnummeret (for lejer) fra din Azure AD-applikationsregistrering. Kræves kun til autentificering, der kun er for organisationen.",
        clientSecret: "Klientens hemmelige nøgle",
        clientSecretHelp:
          "Klientens hemmelige værdi fra din Azure AD-applikationsregistrering",
        configurationRequired:
          "Vær venligst oprettet Client ID og Client Secret for at aktivere Outlook-funktionaliteten.",
        authRequired:
          "Gem dine legitimationsoplysninger først, og derefter skal du autentificere dig hos Microsoft for at fuldføre opsætningen.",
        authenticateWithMicrosoft: "Bekræft med Microsoft",
        authenticated: "Succesfuldt bekræftet med Microsoft Outlook.",
        revokeAccess: "Annullér adgang",
        configured: "Konfigureret",
        searchSkills: "Færdigheder inden for søgning...",
        noSkillsFound: "Ingen resultater fundet, der matcher din søgning.",
        categories: {
          search: {
            title: "Søg og læs e-mails",
            description: "Søg og læs e-mails fra din Outlook-indbakke",
          },
          drafts: {
            title: "Udkast til e-mails",
            description: "Opret, rediger og administrer udkast til e-mails.",
          },
          send: {
            title: "Send e-mails",
            description:
              "Send nye e-mails eller svar på beskeder med det samme.",
          },
          account: {
            title: "Statistik om integration",
            description: "Se statistik for din postkasse og kontoinformation.",
          },
        },
        skills: {
          getInbox: {
            title: "Åbn indbakken",
            description: "Få de seneste e-mails fra din Outlook-indbakke.",
          },
          search: {
            title: "Søg i e-mails",
            description:
              "Søg efter e-mails ved hjælp af Microsofts søgesyntaks",
          },
          readThread: {
            title: "Læs samtale",
            description: "Læs hele e-mail-samtaletråden",
          },
          createDraft: {
            title: "Opret udkast",
            description:
              "Opret et nyt udkast til en e-mail eller et udkast til et svar på en eksisterende besked.",
          },
          updateDraft: {
            title: "Opdateret udkast",
            description: "Opdater en eksisterende udkast til en e-mail",
          },
          listDrafts: {
            title: "Udkast til lister",
            description: "Vis alle udkastede e-mails",
          },
          deleteDraft: {
            title: "Slet udkast",
            description: "Slet en udkast til e-mail",
          },
          sendDraft: {
            title: "Send udkast",
            description: "Send en eksisterende udkast til en e-mail",
          },
          sendEmail: {
            title: "Send e-mail",
            description:
              "Send en ny e-mail eller svar på en eksisterende besked med det samme.",
          },
          getMailboxStats: {
            title: "Statistik for postkasse",
            description: "Få antallet af mapper og statistikker for postkasser",
          },
        },
      },
      googleCalendar: {
        title: "Google Kalender-tilslutning",
        description:
          "Giv din agent mulighed for at interagere med Google Kalender – se kalendere, få adgang til begivenheder, oprette og opdatere begivenheder, og administrere tilmeldinger. <a>Læs dokumentationen</a>.",
        multiUserWarning:
          "Integration med Google Kalender er ikke tilgængelig i multi-bruger-tilstand af sikkerhedsmæssige årsager. For at bruge denne funktion, bedes du deaktivere multi-bruger-tilstanden.",
        configuration: "Konfiguration af Google Kalender",
        deploymentId: "Identifikations-ID",
        deploymentIdHelp: "Deployment-ID fra din Google Apps Script webapp",
        apiKey: "API-nøgle",
        apiKeyHelp:
          "API-nøglen, du har konfigureret i din Google Apps Script-implementering.",
        configurationRequired:
          "Vær venligst oprettet Deployment ID og API-nøgle for at aktivere Google Calendar-funktionaliteten.",
        configured: "Konfigureret",
        searchSkills: "Søgeteknikker...",
        noSkillsFound: "Ingen resultater matcher din søgning.",
        categories: {
          calendars: {
            title: "Kalendere",
            description: "Se og administrer dine Google Kalendere",
          },
          readEvents: {
            title: "Læs begivenheder",
            description: "Se og søg efter begivenheder i kalenderen",
          },
          writeEvents: {
            title: "Opret og opdater begivenheder",
            description: "Opret nye begivenheder og rediger eksisterende.",
          },
          rsvp: {
            title: "Håndtering af bekræftelser",
            description: "Administrer status for dine svar på begivenheder",
          },
        },
        skills: {
          listCalendars: {
            title: "Kalenderlister",
            description: "Vis alle kalendere, du ejer eller er abonnent på.",
          },
          getCalendar: {
            title: "Få detaljer om kalenderen",
            description: "Få detaljerede oplysninger om en bestemt kalender",
          },
          getEvent: {
            title: "Find arrangement",
            description: "Få detaljerede oplysninger om et bestemt arrangement",
          },
          getEventsForDay: {
            title: "Find begivenheder for den pågældende dag",
            description:
              "Find alle begivenheder, der er planlagt til en bestemt dato.",
          },
          getEvents: {
            title: "Find begivenheder (datointerval)",
            description: "Find begivenheder inden for et angivet tidsinterval",
          },
          getUpcomingEvents: {
            title: "Se kommende arrangementer",
            description:
              "Find begivenheder for i dag, denne uge eller denne måned ved hjælp af enkle søgeord.",
          },
          quickAdd: {
            title: "Tilføj begivenhed hurtigt",
            description:
              'Opret et arrangement ud fra naturligt sprog (f.eks. "Møde i morgen kl. 15:00")',
          },
          createEvent: {
            title: "Opret begivenhed",
            description:
              "Opret et nyt arrangement med fuld kontrol over alle indstillinger.",
          },
          updateEvent: {
            title: "Opdatering af begivenhed",
            description: "Opdater en eksisterende kalenderbegivenhed",
          },
          setMyStatus: {
            title: "Angiv status for bekræftet deltagelse",
            description:
              "Accepter, afvise eller midlertidigt acceptere et arrangement",
          },
        },
      },
    },
    mcp: {
      title: "MCP-servere",
      "loading-from-config": "Indlæsning af MCP-servere fra konfigurationsfil",
      "learn-more": "Lær mere om MCP-servere.",
      "no-servers-found": "Ingen MCP-servere fundet",
      "tool-warning":
        "For den bedste ydeevne, overvej at deaktivere unødvendige værktøjer for at bevare konteksten.",
      "stop-server": "Afbryd MCP-serveren",
      "start-server": "Start MCP-serveren",
      "delete-server": "Slet MCP-serveren",
      "tool-count-warning":
        "Denne MCP-server har <b>aktiverede</b>værktøjer, som vil forbruge kontekst i hvert chat-session.<br />Overvej at deaktivere uønskede værktøjer for at spare på konteksten.",
      "startup-command": "Startkommando",
      command: "Instruktion",
      arguments: "Argumenter",
      "not-running-warning":
        "Denne MCP-server kører ikke – den kan være stoppet, eller den kan opleve fejl ved opstart.",
      "tool-call-arguments": "Argumenter til værktøjsopkald",
      "tools-enabled": "værktøjer er aktiveret",
    },
    settings: {
      title: "Indstillinger for agenters færdigheder",
      "max-tool-calls": {
        title: "Maksimalt antal anmodninger pr. svar",
        description:
          "Det maksimale antal værktøjer, en agent kan kæde sammen for at generere et enkelt svar. Dette forhindrer, at værktøjer kaldes unødvendigt, og undgår uendelige løkker.",
      },
      "intelligent-skill-selection": {
        title: "Intelligent valg af færdigheder",
        "beta-badge": "Beta",
        description:
          "Aktiver ubegrænsede værktøjer og reducer brugen af cut-tokens med op til 80 % pr. forespørgsel – AnythingLLM vælger automatisk de relevante færdigheder til hver forespørgsel.",
        "max-tools": {
          title: "Max Tools",
          description:
            "Det maksimale antal værktøjer, der kan vælges for hver forespørgsel. Vi anbefaler at indstille dette til højere værdier for større modeller med mere kontekst.",
        },
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
    empty: "Ingen API-nøgler fundet",
    actions: "Handlinger",
    messages: {
      error: "Fejl: {{error}}",
    },
    modal: {
      title: "Opret ny API-nøgle",
      cancel: "Annuller",
      close: "Luk",
      create: "Opret API-nøgle",
      helper:
        "Når API-nøglen er oprettet, kan den bruges til programmatisk at få adgang til og konfigurere denne AnythingLLM-instans.",
      name: {
        label: "Navn",
        placeholder: "Produktionsintegration",
        helper:
          "Valgfrit. Brug et sigende navn, så du nemt kan kende nøglen senere.",
      },
    },
    row: {
      copy: "Kopiér API-nøgle",
      copied: "Kopieret",
      unnamed: "--",
      deleteConfirm:
        "Er du sikker på, at du vil deaktivere denne API-nøgle?\nNår du gør det, kan den ikke længere bruges.\n\nDenne handling kan ikke fortrydes.",
    },
    table: {
      name: "Navn",
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
        azure_service_endpoint: "Azure Service Endpoint",
        api_key: "API-nøgle",
        chat_deployment_name: "Chat Deployment Name",
        chat_model_token_limit:
          "Chat Model Token Limit\n\nBegrænsning af antallet af tokens i en chatmodel.",
        model_type: "Modeltype",
        default: "Standard",
        reasoning: "Begrundelse",
        model_type_tooltip:
          'Hvis din implementering bruger en ræsonnementsmodel (o1, o1-mini, o3-mini osv.), skal du indstille dette til "Ræsonnement". Ellers kan dine chat-anmodninger mislykkes.',
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
    },
  },
  text: {
    title: "Præferencer for tekstopdeling & segmentering",
    "desc-start":
      "Nogle gange vil du måske ændre den standardmåde, som nye dokumenter deles og opdeles i bidder, inden de indsættes i din vektordatabase.",
    "desc-end":
      "Du bør kun ændre denne indstilling, hvis du forstår, hvordan tekstopdeling fungerer og dens bivirkninger.",
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
      created: "Oprettet",
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
      bypass_ssl: "Omgå SSL-certifikatvalidering",
      bypass_ssl_explained:
        "Aktiver denne mulighed for at omgå valideringen af SSL-certifikatet for selv-hostede Confluence-instanser med et selv-underskrevet certifikat.",
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
      "delete-confirmation":
        "Er du sikker på, at du vil slette disse filer og mapper?\nDette vil fjerne filerne fra systemet og automatisk fjerne dem fra alle eksisterende arbejdsområder.\nDenne handling kan ikke fortrydes.",
      "removing-message":
        "Fjerner {{count}} dokumenter og {{folderCount}} mapper. Vent venligst.",
      "move-success": "Flyttede {{count}} dokumenter med succes.",
      no_docs: "Ingen dokumenter",
      select_all: "Vælg alle",
      deselect_all: "Fravælg alle",
      remove_selected: "Fjern valgte",
      save_embed: "Gem og indlejr",
      "total-documents_one": "{{count}} dokument",
      "total-documents_other": "{{count}} dokumenter",
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
      vault_location: "Opbevaringssted",
      vault_description:
        "Vælg din Obsidian-mappe, som du vil importere alle noter og deres forbindelser til.",
      selected_files: "Fundet {{count}} markdown-filer",
      importing: "Importering af skattekammer...",
      import_vault: "Import Vault",
      processing_time:
        "Dette kan tage noget tid, afhængigt af størrelsen på din opbevaring.",
      vault_warning:
        "For at undgå eventuelle konflikter, skal du sørge for, at din Obsidian-mappe ikke er åben i øjeblikket.",
    },
  },
  chat_window: {
    send_message: "Send en besked",
    attach_file: "Vedhæft en fil til denne chat",
    text_size: "Ændr tekststørrelse.",
    microphone: "Tal din prompt.",
    send: "Send promptbesked til arbejdsområdet",
    attachments_processing:
      "Vedhæftede filer behandles. Vær venligst tålmodig...",
    tts_speak_message: "TTS-besked",
    copy: "Kopier",
    regenerate: "Genopbyg",
    regenerate_response: "Genopbyg svar",
    good_response: "Godt svar",
    more_actions: "Flere handlinger",
    fork: "Fork",
    delete: "Slet",
    cancel: "Annullér",
    edit_prompt: "Redigeringsanmodning",
    edit_response: "Rediger svar",
    preset_reset_description:
      "Rydd op i din chat-historik og start en ny samtale",
    add_new_preset: "Tilføj ny forudindstilling",
    command: "Kommandér",
    your_command: "dit kommando",
    placeholder_prompt:
      "Dette er indholdet, der vil blive indsat foran din forespørgsel.",
    description: "Beskrivelse",
    placeholder_description: "Svarer med et digt om LLM'er.",
    save: "Gem",
    small: "Lille",
    normal: "Normal",
    large: "Stor",
    workspace_llm_manager: {
      search: "Søg efter LLM-udbydere",
      loading_workspace_settings: "Indlæser arbejdsområdets indstillinger...",
      available_models: "Tilgængelige modeller for {{provider}}",
      available_models_description:
        "Vælg en model, der skal bruges til dette arbejdsområde.",
      save: "Brug denne model",
      saving: "Indstil modellen som standard for arbejdsområdet...",
      missing_credentials: "Denne udbyder har ikke de nødvendige beviser!",
      missing_credentials_description:
        "Klik for at oprette legitimationsoplysninger",
    },
    submit: "Indsend",
    edit_info_user:
      '"Send" genopretter AI-responsen. "Gem" opdaterer kun dit budskab.',
    edit_info_assistant:
      "Ændringerne, du laver, vil blive gemt direkte i dette svar.",
    see_less: "Se mindre",
    see_more: "Se flere",
    tools: "Værktøj",
    text_size_label: "Tekststørrelse",
    select_model: "Vælg model",
    sources: "Kilder",
    document: "Dokument",
    similarity_match: "kamp",
    source_count_one: "{{count}} henvisning",
    source_count_other: "{{count}} referencer",
    preset_exit_description: "Afslut den aktuelle agent-session",
    add_new: "Tilføj nyt",
    edit: "Rediger",
    publish: "Udgive",
    stop_generating: "Stop med at generere svar",
    slash_commands: "Kommandoer",
    agent_skills: "Agenters kompetencer",
    manage_agent_skills: "Administrer agenters kompetencer",
    agent_skills_disabled_in_session:
      "Det er ikke muligt at ændre færdigheder under en aktiv agent-session. Brug kommandoen `/exit` for at afslutte sessionen først.",
    start_agent_session: "Start Agent-session",
    use_agent_session_to_use_tools:
      "Du kan bruge værktøjer i chat ved at starte en agent-session med '@agent' i starten af din forespørgsel.",
    agent_invocation: {
      model_wants_to_call: "Modellen ønsker at ringe",
      approve: "Godkend",
      reject: "Afvise",
      always_allow: "Sørg altid for, at {{skillName}} er tilgængeligt.",
      tool_call_was_approved:
        "Anmodningen om at bruge værktøjet blev godkendt.",
      tool_call_was_rejected: "Anmodningen om at bruge værktøjet blev afvist.",
    },
    custom_skills: "Skræddersyede færdigheder",
    agent_flows: "Agentstrømme",
    no_tools_found: "Ingen matchende værktøjer fundet",
    loading_mcp_servers: "Indlæser MCP-servere...",
    app_integrations: "App-integrationer",
    sub_skills: "Specifikke færdigheder",
  },
  profile_settings: {
    edit_account: "Rediger konto",
    profile_picture: "Profilbillede",
    remove_profile_picture: "Fjern profilbillede",
    username: "Brugernavn",
    new_password: "Ny adgangskode",
    password_description: "Adgangskoden skal være mindst 8 tegn lang",
    cancel: "Annuller",
    update_account: "Opdater konto",
    theme: "Tema-præference",
    language: "Foretrukket sprog",
    failed_upload: "Kunne ikke uploade profilbillede: {{error}}",
    upload_success: "Profilbillede er uploadet.",
    failed_remove: "Kunne ikke fjerne profilbilledet: {{error}}",
    profile_updated: "Profil opdateret.",
    failed_update_user: "Mislykket med at opdatere bruger: {{error}}",
    account: "Konto",
    support: "Støtte",
    signout: "Log ud",
  },
  customization: {
    interface: {
      title: "Brugerpræferencer",
      description: "Konfigurer dine præferencer for AnythingLLM.",
    },
    branding: {
      title: 'Brandstrategi og "white label"-løsninger',
      description: "Mærk din AnythingLLM-instans med dit eget brand.",
    },
    chat: {
      title: "Chat",
      description: "Angiv dine præferencer for chat med AnythingLLM.",
      auto_submit: {
        title: "Automatisk indtastning af taleinput",
        description:
          "Automatisk afsendelse af taleinput efter en periode med stilhed",
      },
      auto_speak: {
        title: "Auto-Speak Responses\n\nAutomatiske svar",
        description: "Automatisk genererede svar fra AI'en",
      },
      spellcheck: {
        title: "Aktiver stavekontrol",
        description:
          "Aktiver eller deaktiver stavekontrollen i indtastningsfeltet",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Vælg dit foretrukne farveskema til applikationen.",
      },
      "show-scrollbar": {
        title: "Vis afrulningslinje",
        description: "Aktiver eller deaktiver scrollbaren i chatvinduet.",
      },
      "support-email": {
        title: "Støtte-e-mail",
        description:
          "Angiv e-mailadressen, der skal være tilgængelig for brugere, når de har brug for hjælp.",
      },
      "app-name": {
        title: "Navn",
        description:
          "Angiv et navn, der vises på login-siden for alle brugere.",
      },
      "display-language": {
        title: "Visningssprog",
        description:
          "Vælg det foretrukne sprog til at vise AnythingLLM's brugergrænseflade i – når oversættelser er tilgængelige.",
      },
      logo: {
        title: "Brand Logo",
        description:
          "Upload dit brugerdefinerede logo for at vise det på alle sider.",
        add: "Tilføj et brugerdefineret logo",
        recommended: "Anbefalet størrelse: 800 x 200",
        remove: "Fjern",
        replace: "Udskift",
      },
      "browser-appearance": {
        title: "Browser-udseende",
        description:
          "Tilpas udseendet af browserens fane og titel, når appen er åben.",
        tab: {
          title:
            "**Embracing the Future: A Comprehensive Guide to Sustainable Development**",
          description:
            "Angiv en brugerdefineret titel for fanen, når appen åbnes i en browser.",
        },
        favicon: {
          title: "Favikon",
          description: "Brug et brugerdefineret ikon til browserens fane.",
        },
      },
      "sidebar-footer": {
        title: "Sidefods-elementer",
        description:
          "Tilpas de elementer, der vises i fodervirket nederst i sidepanelet.",
        icon: "Ikon",
        link: "Link",
      },
      "render-html": {
        title: "Vis HTML i chat",
        description:
          "Generer HTML-svar i hjælperes svar.\nDette kan resultere i en meget højere kvalitet af svaret, men kan også føre til potentielle sikkerhedsrisici.",
      },
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Opret en agent",
      editWorkspace: "Rediger arbejdsområdet",
      uploadDocument: "Upload en fil",
    },
    greeting: "Hvordan kan jeg hjælpe dig i dag?",
  },
  "keyboard-shortcuts": {
    title: "Tastaturgenveje",
    shortcuts: {
      settings: "Åbn indstillinger",
      workspaceSettings: "Åbn aktuelle arbejdsområdesindstillinger",
      home: "Gå til Hjem",
      workspaces: "Administrer arbejdsområder",
      apiKeys: "API-nøgler: Indstillinger",
      llmPreferences: "LLM-præferencer",
      chatSettings: "Opsætningsindstillinger",
      help: "Vis hjælp til tastaturgenveje",
      showLLMSelector: "Vis arbejdsområde LLM-valg",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Succes!",
        success_description:
          "Dit systemprompt er nu tilgængeligt i Community Hub!",
        success_thank_you: "Tak for at dele med fællesskabet!",
        view_on_hub: "Se på Community Hub",
        modal_title: "Publikationssystemets prompt",
        name_label: "Navn",
        name_description: "Dette er navnet, der vises for dit systemprompt.",
        name_placeholder: "Mit systemprompt",
        description_label: "Beskrivelse",
        description_description:
          "Dette er beskrivelsen af dit systemprompt. Brug dette til at beskrive formålet med dit systemprompt.",
        tags_label: "Tags",
        tags_description:
          "Tags bruges til at mærke dine system prompts, så de er nemmere at finde. Du kan tilføje flere tags. Maksimalt 5 tags. Maksimalt 20 tegn per tag.",
        tags_placeholder: "Skriv og tryk på Enter for at tilføje tags",
        visibility_label: "Synlighed",
        public_description: "Offentlige systemmeddelelser er synlige for alle.",
        private_description: "Private system prompts er kun synlige for dig.",
        publish_button: "Publicer på Community Hub",
        submitting: "Uddrag...",
        prompt_label: "Prompt",
        prompt_description:
          "Dette er den faktiske systemprompt, der vil blive brugt til at styre LLM'en.",
        prompt_placeholder: "Indtast din systemprompt her...",
      },
      agent_flow: {
        success_title: "Succes!",
        success_description:
          "Dit Agent Flow er nu tilgængeligt i Community Hub!",
        success_thank_you: "Tak for at dele med fællesskabet!",
        view_on_hub: "Se på Community Hub",
        modal_title: "Publicer agentflow",
        name_label: "Navn",
        name_description: "Dette er navnet, der vises for din agentflow.",
        name_placeholder: "Min agent, Flow",
        description_label: "Beskrivelse",
        description_description:
          "Dette er beskrivelsen af din agentflow. Brug den til at beskrive formålet med dit agentflow.",
        tags_label: "Tags",
        tags_description:
          "Tags bruges til at mærke dine agentflows, så de er nemmere at finde. Du kan tilføje flere tags. Maksimalt 5 tags. Maksimalt 20 tegn per tag.",
        tags_placeholder: "Skriv og tryk på Enter for at tilføje tags",
        visibility_label: "Synlighed",
        submitting: "Uddrag...",
        submit: "Publicer på Community Hub",
        privacy_note:
          "Agent-strømme uploades altid som private for at beskytte enhver følsom data. Du kan ændre synligheden i Community Hub efter udgivelse. Vær venligst opmærksom på, at din strøm ikke indeholder nogen følsom eller privat information, før du udgiver den.",
      },
      generic: {
        unauthenticated: {
          title: "Krav om godkendelse",
          description:
            "Du skal verificere din identitet via AnythingLLM Community Hub, før du kan publicere indhold.",
          button: "Forbind til fællesskabscenter",
        },
      },
      slash_command: {
        success_title: "Succes!",
        success_description:
          "Din Slash-kommando er blevet offentliggjort i Community Hub!",
        success_thank_you: "Tak for at dele med fællesskabet!",
        view_on_hub: "Se på Community Hub",
        modal_title: "Udsend Slash Command",
        name_label: "Navn",
        name_description: "Dette er navnet, der vises for din kommando.",
        name_placeholder: "Mit Slash-kommando",
        description_label: "Beskrivelse",
        description_description:
          "Dette er beskrivelsen af din kommando. Brug den til at beskrive formålet med din kommando.",
        tags_label: "Tags",
        tags_description:
          "Tags bruges til at mærke dine kommandoer, så de er nemmere at finde. Du kan tilføje flere tags. Maksimalt 5 tags. Maksimalt 20 tegn pr. tag.",
        tags_placeholder: "Skriv og tryk på Enter for at tilføje tags",
        visibility_label: "Synlighed",
        public_description: "Offentlige kommandoer er synlige for alle.",
        private_description: "Private kommandoer er kun synlige for dig.",
        publish_button: "Publicer på Community Hub",
        submitting: "Uddrag...",
        prompt_label: "Prompt",
        prompt_description:
          "Dette er den kommando, der vil blive brugt, når kommandoen med skråstreg aktiveres.",
        prompt_placeholder: "Indtast din forespørgsel her...",
      },
    },
  },
  security: {
    title: "Sikkerhed",
    multiuser: {
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
    },
    password: {
      title: "Adgangskodebeskyttelse",
      description:
        "Beskyt din AnythingLLM-instans med en adgangskode. Hvis du glemmer den, findes der ingen genoprettelsesmetode, så sørg for at gemme denne adgangskode.",
      "password-label": "Instansadgangskode",
    },
  },
  home: {
    welcome: "Velkommen",
    chooseWorkspace: "Vælg et arbejdsområde for at starte at chatte!",
    notAssigned:
      "Du er ikke tildelt til nogen arbejdsområder.\nKontakt din administrator for at anmode om adgang til et arbejdsområde.",
    goToWorkspace: 'Gå til "{{workspace}}"',
  },
  telegram: {
    title: "Telegram-bot",
    description:
      "Forbind dit AnythingLLM-instans med Telegram, så du kan kommunikere med dine arbejdsområder fra enhver enhed.",
    setup: {
      step1: {
        title: "Trin 1: Opret din Telegram-bot",
        description:
          "Åbn @BotFather i Telegram, send `/newbot` til <code>@BotFather</code>, følg instruktionerne, og kopier API-tokenet.",
        "open-botfather": "Åbn BotFather",
        "instruction-1": "1. Åbn linket eller scann QR-koden",
        "instruction-2":
          "2. Send <code>/newbot</code> til <code>@BotFather</code>",
        "instruction-3": "3. Vælg et navn og et brugernavn til din bot",
        "instruction-4": "4. Kopier API-tokenet, du modtager.",
      },
      step2: {
        title: "Trin 2: Forbind din bot",
        description:
          "Indsæt API-tokenet, du modtog fra @BotFather, og vælg et standard-arbejdsområde, hvor din bot kan kommunikere.",
        "bot-token": "Bot-token",
        connecting: "Forbindes...",
        "connect-bot": "Connect Bot",
      },
      security: {
        title: "Anbefalede sikkerhedsindstillinger",
        description:
          "For yderligere sikkerhed, kan du konfigurere disse indstillinger via @BotFather.",
        "disable-groups": "— Forhindre tilføjelse af bots til grupper",
        "disable-inline":
          "— Forhindr brugen af bot i søgninger direkte i søgefeltet",
        "obscure-username":
          "Brug et brugernavn til en bot, der ikke er åbenlyst, for at reducere synligheden.",
      },
      "toast-enter-token": "Vær venligst opført et bot-token.",
      "toast-connect-failed": "Kunne ikke etablere forbindelse med botten.",
    },
    connected: {
      status: "Forbundet",
      "status-disconnected":
        "Afbrudt – tokenet kan være udløbet eller ugyldigt",
      "placeholder-token": "Indsæt nyt bot-token...",
      reconnect: "Genopslå",
      workspace: "Arbejdsområde",
      "bot-link": "Bot-link",
      "voice-response": "Stemmebesvarelse",
      disconnecting: "Afbryde...",
      disconnect: "Afbryde",
      "voice-text-only": "Kun tekst",
      "voice-mirror": "Spejl (svar med stemme, når brugeren sender en stemme)",
      "voice-always":
        "Sørg altid for at inkludere en lydbesked (send lyd sammen med hvert svar).",
      "toast-disconnect-failed": "Kunne ikke afbryde robotten.",
      "toast-reconnect-failed":
        "Kunne ikke genoprette forbindelsen med botten.",
      "toast-voice-failed": "Kunne ikke opdatere stemmemodus.",
      "toast-approve-failed": "Mislykkedes med at godkende bruger.",
      "toast-deny-failed": "Kunne ikke afvise brugeren.",
      "toast-revoke-failed": "Kunne ikke annullere brugerens adgang.",
    },
    users: {
      "pending-description":
        "Brugere, der venter på at blive verificeret. Sammenlign den kode, der vises her, med den, der vises i deres Telegram-chat.",
      unknown: "Ukendt",
    },
  },
  scheduledJobs: {
    title: "Planlagte opgaver",
    enableNotifications:
      "Aktiver notifikationer i browseren for at modtage resultater af jobsøgning",
    description:
      "Opret gentagne AI-opgaver, der kører efter en plan. Hver opgave udfører en forespørgsel med eventuelle tilgængelige værktøjer og gemmer resultatet til senere gennemgang.",
    newJob: "Ny still",
    loading: "Indlæses...",
    emptyTitle: "Ingen planlagte opgaver endnu",
    emptySubtitle: "Opret et for at komme i gang.",
    table: {
      name: "Navn",
      schedule: "Tidsplan",
      status: "Status",
      lastRun: "Sidste tur",
      nextRun: "Næste tur",
      actions: "Handlinger",
    },
    confirmDelete:
      "Er du sikker på, at du ønsker at slette denne planlagte opgave?",
    toast: {
      deleted: "Job slettet",
      triggered: "Job blev korrekt initieret.",
      triggerFailed: "Mislykkedes med at starte jobbet",
      triggerSkipped: "Arbejdet er allerede i gang.",
      killed: "Arbejdet blev afbrudt med succes.",
      killFailed: "Mislykkedes med at stoppe arbejdet",
    },
    row: {
      neverRun: "Aldrig køre",
      viewRuns: "Visning af løb",
      runNow: "Gå nu",
      enable: "Aktiver",
      disable: "Deaktiver",
      edit: "Rediger",
      delete: "Slet",
    },
    modal: {
      titleEdit: "Rediger planlagt opgave",
      titleNew: "Ny planlagt opgave",
      nameLabel: "Navn",
      namePlaceholder: "f.eks. Daglig nyhedsindsamling",
      promptLabel: "Anmodning",
      promptPlaceholder: "Instruktionen om at køre på hver eksekvering...",
      scheduleLabel: "Tidsplan",
      modeBuilder: "Bygger",
      modeCustom: "Tilpasset",
      cronPlaceholder: "Udtryk for tidsplan (f.eks. 0 9 * * *)",
      currentSchedule: "Nuværende tidsplan:",
      toolsLabel: "Værktøjer (valgfrit)",
      toolsDescription:
        "Vælg hvilke agentværktøjer denne opgave kan bruge. Hvis ingen værktøjer er valgt, vil opgaven køre uden nogen værktøjer.",
      toolsSearch: "Søg",
      toolsNoResults: "Ingen værktøjer matcher",
      required: "Nødvendigt",
      requiredFieldsBanner:
        "Venligst udfyld alle de obligatoriske felter for at oprette en stilling.",
      cancel: "Annullér",
      saving: "Spar...",
      updateJob: "Opdater stillingen",
      createJob: "Opret stilling",
      jobUpdated: "Job er opdateret",
      jobCreated: "Job blev skabt",
    },
    builder: {
      fallbackWarning:
        'Denne tekstfelt kan ikke redigeres visuelt. Vælg "Tilpas" for at bevare den, eller ændr noget nedenfor for at overskrive den.',
      run: "Løb",
      frequency: {
        minute: "hvert minut",
        hour: "per time",
        day: "dagligt",
        week: "hver uge",
        month: "månedligt",
      },
      every: "Hver",
      minuteOne: "1 minut",
      minuteOther: "{{count}} minutter",
      atMinute: "I minutter",
      pastEveryHour: "hvert time",
      at: "Her",
      on: "Om",
      onDay: "På en dag",
      ofEveryMonth: "af hver måned",
      weekdays: {
        sun: "Sol",
        mon: "Mandag",
        tue: "Tirsdag",
        wed: "Onsdag",
        thu: "Torsdag",
        fri: "Fri",
        sat: "Lørdag",
      },
    },
    runHistory: {
      back: "Tilbage til stillingsopslag",
      title: "Historik: {{name}}",
      schedule: "Tidsplan:",
      emptyTitle: "Ingen resultater endnu for denne opgave.",
      emptySubtitle: "Kør jobbet nu og se resultaterne.",
      runNow: "Start nu",
      table: {
        status: "Status",
        started: "Startede",
        duration: "Varighed",
        error: "Fejl",
      },
      stopJob: "Afbryd ansættelsen",
    },
    runDetail: {
      loading: "Indlæsning af detaljer om kørslen...",
      notFound: "Fejl: Kørsel ikke fundet.",
      back: "Tilbage",
      unknownJob: "Ukendt stilling",
      runHeading: "{{name}} — Kør #{{id}}",
      duration: "Varighed: {{value}}",
      creating: "Oprettelse...",
      threadFailed: "Kunne ikke oprette tråd",
      sections: {
        prompt: "Opfordring",
        error: "Fejl",
        thinking: "Tanker ({{count}})",
        toolCalls: "Opkald til værktøjer ({{count}})",
        files: "Filer ({{count}})",
        response: "Svar",
        metrics: "Målinger",
      },
      metrics: {
        promptTokens: "Prompt-ord:",
        completionTokens: "Afslutningsmarkører:",
      },
      stopJob: "Afslut stillingen",
      killing: "Afbryde...",
      continueInThread: "Fortsæt i chat",
    },
    toolCall: {
      arguments: "Argumenter:",
      showResult: "Vis resultat",
      hideResult: "Skjul resultat",
    },
    file: {
      unknown: "Ukendt fil",
      download: "Download",
      downloadFailed: "Kunne ikke hente filen",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF-dokument",
        word: "Ord-dokument",
        spreadsheet: "Regneark",
        generic: "Fil",
      },
    },
    status: {
      completed: "Afsluttet",
      failed: "Mislykket",
      timed_out: "Tidsudløb",
      running: "Løb",
      queued: "I venter",
    },
  },
};

export default TRANSLATIONS;
