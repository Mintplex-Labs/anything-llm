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
    search: "Søg",
    username_requirements:
      "Brugernavnet skal bestå af 2-32 tegn, starte med et lille bogstav, og kun indeholde små bogstaver, tal, understregninger, bindestreger og punktummer.",
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
    "system-prompt-variables":
      "System Prompt Variables\n\nSystem Prompt Variabler",
    interface: "Brugerpræferencer",
    branding: "Brandstrategi og white-labeling",
    chat: "Chat",
    "mobile-app": "AnythingLLM Mobile",
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
      "recovery-code": "Gendannelseskode {{index}}",
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
      name: "Obsidian",
      description: "Importer Obsidian-arkiv med ét klik.",
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
    attachments_processing:
      "Vedhæftede filer behandles. Vær venligst tålmodig...",
    tts_speak_message: "TTS-besked",
    copy: "Kopier",
    regenerate: "Genopbyg",
    regenerate_response: "Genopbyg svar",
    good_response: "Godt svar",
    more_actions: "Flere handlinger",
    hide_citations: "Skjul henvisninger",
    show_citations: "Vis henvisninger",
    pause_tts_speech_message: "Pause TTS speech of message",
    fork: "Fork",
    delete: "Slet",
    save_submit: "Gem og indsende",
    cancel: "Annullér",
    edit_prompt: "Redigeringsanmodning",
    edit_response: "Rediger svar",
    at_agent: "@agent",
    default_agent_description: "- standardagenten for dette arbejdsområde.",
    custom_agents_coming_soon: "Specialagenter kommer snart!",
    slash_reset: "/reset",
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
      "chat-message-alignment": {
        title: "Sammenstillet samtale",
        description: "Vælg alignmentsmoden, når du bruger chat-grænsefladen.",
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
      "welcome-messages": {
        title: "Velkomstbeskeder",
        description:
          "Tilpas de velkomstbeskeder, der vises til dine brugere. Kun ikke-administratorer vil se disse beskeder.",
        new: "Ny",
        system: "system",
        user: "Jeg er en stor sprogmodel, trænet af Google.",
        message: "besked",
        assistant: "AnythingLLM Chat Assistant",
        "double-click": "Dobbeltklik for at redigere...",
        save: "Gem beskeder",
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
    noWorkspaceError:
      "Vær venligst oprettet et arbejdsområde, før du starter en samtale.",
    checklist: {
      title: "Sådan kommer du i gang",
      tasksLeft: "Udførte opgaver\n\nUdførte opgaver",
      completed: "Du er på vej til at blive en ekspert i AnythingLLM!",
      dismiss: "luk",
      tasks: {
        create_workspace: {
          title: "Opret et arbejdsområde",
          description: "Opret dit første arbejdsområde for at komme i gang.",
          action: "Opret",
        },
        send_chat: {
          title: "Send en besked",
          description:
            "Start a conversation with your AI assistant\n\nStart en samtale med din AI-assistent",
          action: "Chat",
        },
        embed_document: {
          title: "Indsæt et dokument",
          description: "Tilføj dit første dokument til dit arbejdsområde.",
          action: "Indlejre",
        },
        setup_system_prompt: {
          title: "Opret et system prompt",
          description: "Konfigurer din AI-assistent's adfærd",
          action: "Opsætning",
        },
        define_slash_command: {
          title: "Definér en kommando med et skråtegn",
          description: "Opret brugerdefinerede kommandoer til din assistent",
          action: "Definér",
        },
        visit_community: {
          title: "Besøg Community Hub",
          description: "Udforsk lokale ressourcer og skabeloner",
          action: "Udforsk",
        },
      },
    },
    quickLinks: {
      title: "Hurtige links",
      sendChat: "Send chat",
      embedDocument: "Indsæt et dokument",
      createWorkspace: "Opret arbejdsområde",
    },
    exploreMore: {
      title: "Udforsk flere funktioner",
      features: {
        customAgents: {
          title:
            "Skræddersyede AI-agenter\n\nCustom AI Agents\n\nSkræddersyede AI-agenter",
          description:
            "Opret kraftfulde AI-agenter og automatiseringer uden kode.",
          primaryAction:
            "Brug chatfunktionen til at kommunikere med agenten.\n\nBrug chatfunktionen til at kommunikere med agenten.",
          secondaryAction: "Opret en agentflow",
        },
        slashCommands: {
          title: "Slash-kommandoer",
          description:
            "Spar tid og indsæt kommandoer ved hjælp af brugerdefinerede kommandoer.",
          primaryAction: "Opret en Slash-kommando",
          secondaryAction: "Udforsk på Hub",
        },
        systemPrompts: {
          title: "System Prompts\n\nSystem prompts",
          description:
            "Tilpas systemprompten for at tilpasse AI's svar i et arbejdsområde.",
          primaryAction: "Rediger en systemprompt",
          secondaryAction: "Administrer variabler",
        },
      },
    },
    announcements: {
      title: "Opdateringer og meddelelser",
    },
    resources: {
      title: "Ressourcer",
      links: {
        docs: "Dokumenter",
        star: "Stjerne på GitHub",
      },
      keyboardShortcuts: "Tastaturgenveje",
    },
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
        submit: "Publicer på Community Hub",
        prompt_label: "Prompt",
        prompt_description:
          "Dette er den faktiske systemprompt, der vil blive brugt til at styre LLM'en.",
        prompt_placeholder: "Indtast din systemprompt her...",
      },
      agent_flow: {
        public_description: "Offentlige agentstrømme er synlige for alle.",
        private_description: "Private agent flows er kun synlige for dig.",
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
        publish_button: "Publicer på Community Hub",
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
        command_label: "Kommandér",
        command_description:
          "Dette er kommandoen, som brugerne vil indtaste for at aktivere denne forudindstillede funktion.",
        command_placeholder: "mit-kommando",
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
};

export default TRANSLATIONS;
