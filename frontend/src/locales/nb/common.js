// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Velkommen til",
      getStarted: "Kom i gang",
    },
    llm: {
      title: "LLM Preferanse",
      description:
        "Lovora kan fungere med mange LLM-leverandører. Dette vil være tjenesten som håndterer chatting.",
    },
    userSetup: {
      title: "Brukeroppsett",
      description: "Konfigurer brukerinnstillingene dine.",
      howManyUsers: "Hvor mange brukere vil bruke denne forekomsten?",
      justMe: "Bare meg",
      myTeam: "Laget mitt",
      instancePassword: "Forekomstpassord",
      setPassword: "Vil du sette opp et passord?",
      passwordReq: "Passord må være på minst 8 tegn.",
      passwordWarn:
        "Det er viktig å lagre dette passordet fordi det ikke finnes noen gjenopprettingsmetode.",
      adminUsername: "Brukernavn for administratorkontoen",
      adminPassword: "Admin konto passord",
      adminPasswordReq: "Passord må være på minst 8 tegn.",
      teamHint:
        "Som standard vil du være den eneste administratoren. Når introduksjonen er fullført, kan du opprette og invitere andre til å være brukere eller administratorer. Ikke mist passordet ditt, siden bare administratorer kan tilbakestille passord.",
    },
    data: {
      title: "Datahåndtering og personvern",
      description:
        "Vi er forpliktet til åpenhet og kontroll når det gjelder dine personopplysninger.",
      settingsHint:
        "Disse innstillingene kan rekonfigureres når som helst i innstillingene.",
    },
    survey: {
      title: "Velkommen til Lovora",
      description: "Hjelp oss med å forme Lovora for dine behov. Valgfritt.",
      email: "Hva er e-posten din?",
      useCase: "Hva skal du bruke Lovora til?",
      useCaseWork: "For jobb",
      useCasePersonal: "Til personlig bruk",
      useCaseOther: "Annen",
      comment: "Hvordan hørte du om Lovora?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube osv. - Fortell oss hvordan du fant oss!",
      skip: "Hopp over undersøkelsen",
      thankYou: "Takk for tilbakemeldingen!",
    },
    workspace: {
      title: "Lag ditt første arbeidsområde",
      description: "Lag ditt første arbeidsområde og kom i gang med Lovora.",
    },
  },
  common: {
    "workspaces-name": "Navn på arbeidsområde",
    error: "feil",
    success: "suksess",
    user: "Bruker",
    selection: "Modellvalg",
    saving: "Lagrer...",
    save: "Lagre endringer",
    previous: "Forrige side",
    next: "Neste side",
    optional: "Valgfritt",
    yes: "Ja",
    no: "Nei",
    search: "Søk",
    username_requirements:
      "Brukernavnet må bestå av 2-32 tegn, begynne med en liten bokstav, og kun inneholde små bokstaver, tall, understrek, bindestreker og punktum.",
  },
  home: {
    welcome: "Velkommen",
    chooseWorkspace: "Velg et arbeidsområde for å begynne å chatte!",
    notAssigned:
      "Du er for øyeblikket ikke tilordnet noen arbeidsområder.\nKontakt administratoren din for å be om tilgang til et arbeidsområde.",
    goToWorkspace: 'Gå til "{{workspace}}"',
  },
  settings: {
    title: "Forekomstinnstillinger",
    system: "Generelle innstillinger",
    invites: "Invitasjoner",
    users: "Brukere",
    workspaces: "Arbeidsområder",
    "workspace-chats": "Arbeidsområdechatter",
    customization: "Tilpasning",
    interface: "UI-innstillinger",
    branding: "Merkevarebygging og hvitmerking",
    chat: "Chat",
    "api-keys": "Utvikler API",
    llm: "LLM",
    transcription: "Transkripsjon",
    embedder: "Embedder",
    "text-splitting": "Tekstsplitter og chunking",
    "voice-speech": "Stemme og tale",
    "vector-database": "Vektordatabase",
    embeds: "Innebygd chat",
    "embed-chats": "Historikk for innebygde chatter",
    security: "Sikkerhet",
    "event-logs": "Hendelseslogger",
    privacy: "Personvern og data",
    "ai-providers": "AI-leverandører",
    "agent-skills": "Agentferdigheter",
    "community-hub": {
      title: "Community Hub",
      trending: "Utforsk populære",
      "your-account": "Din konto",
      "import-item": "Importer element",
    },
    admin: "Admin",
    tools: "Verktøy",
    "system-prompt-variables": "Systempromptvariabler",
    "experimental-features": "Eksperimentelle funksjoner",
    contact: "Kontakt kundestøtte",
    "browser-extension": "Nettleserutvidelse",
    "mobile-app": "Lovora Mobil",
  },
  login: {
    "multi-user": {
      welcome: "Velkommen",
      "placeholder-username": "Brukernavn",
      "placeholder-password": "Passord",
      login: "Logg inn",
      validating: "Validerer...",
      "forgot-pass": "Glemt passord",
      reset: "Tilbakestill",
    },
    "sign-in":
      "Skriv inn brukernavn og passord for å få tilgang til {{appName}}-forekomsten.",
    "password-reset": {
      title: "Tilbakestill passord",
      description:
        "Oppgi den nødvendige informasjonen nedenfor for å tilbakestille passordet ditt.",
      "recovery-codes": "Gjenopprettingskoder",
      "recovery-code": "Gjenopprettingskode {{index}}",
      "back-to-login": "Tilbake til pålogging",
    },
  },
  "main-page": {
    greeting: "Hvordan kan jeg hjelpe deg i dag?",
    noWorkspaceError: "Opprett et arbeidsområde før du starter en chat.",
    checklist: {
      title: "Komme i gang",
      tasksLeft: "oppgaver igjen",
      completed: "Du er på vei til å bli en Lovora-ekspert!",
      dismiss: "lukk",
      tasks: {
        create_workspace: {
          title: "Lag et arbeidsområde",
          description: "Lag ditt første arbeidsområde for å komme i gang",
          action: "Opprett",
        },
        send_chat: {
          title: "Send en chat",
          description: "Start en samtale med AI-assistenten din",
          action: "Chat",
        },
        embed_document: {
          title: "Bygg inn et dokument",
          description: "Legg til ditt første dokument på arbeidsområdet ditt",
          action: "Bygg inn",
        },
        setup_system_prompt: {
          title: "Sett opp en systemforespørsel",
          description: "Konfigurer AI-assistentens oppførsel",
          action: "Sett opp",
        },
        define_slash_command: {
          title: "Definer en skråstrek-kommando",
          description: "Lag egendefinerte kommandoer for assistenten din",
          action: "Definer",
        },
        visit_community: {
          title: "Besøk Community Hub",
          description: "Utforsk fellesskapsressurser og maler",
          action: "Bla gjennom",
        },
      },
    },
    quickActions: {
      createAgent: "Opprett en agent",
      editWorkspace: "Rediger arbeidsområde",
      uploadDocument: "Last opp et dokument",
    },
    quickLinks: {
      title: "Hurtigkoblinger",
      sendChat: "Send chat",
      embedDocument: "Bygg inn et dokument",
      createWorkspace: "Opprett arbeidsområde",
    },
    exploreMore: {
      title: "Utforsk flere funksjoner",
      features: {
        customAgents: {
          title: "Egendefinerte AI-agenter",
          description:
            "Bygg kraftige AI-agenter og automatiseringer uten kode.",
          primaryAction: "Chat med @agent",
          secondaryAction: "Bygg en agentflyt",
        },
        slashCommands: {
          title: "Slash-kommandoer",
          description:
            "Spar tid og injiser forespørsler ved å bruke tilpassede skråstrekkommandoer.",
          primaryAction: "Opprett en skråstrek-kommando",
          secondaryAction: "Utforsk på Hub",
        },
        systemPrompts: {
          title: "Systemmeldinger",
          description:
            "Endre systemmeldingen for å tilpasse AI-svarene til et arbeidsområde.",
          primaryAction: "Endre en systemmelding",
          secondaryAction: "Administrer ledetekstvariabler",
        },
      },
    },
    announcements: {
      title: "Oppdateringer og kunngjøringer",
    },
    resources: {
      title: "Ressurser",
      links: {
        docs: "Dokumentasjon",
        star: "Stjernemerk på GitHub",
      },
      keyboardShortcuts: "Tastatursnarveier",
    },
  },
  "new-workspace": {
    title: "Nytt arbeidsområde",
    placeholder: "Mitt arbeidsområde",
  },
  "workspaces—settings": {
    general: "Generelle innstillinger",
    chat: "Chat-innstillinger",
    vector: "Vektordatabase",
    members: "Medlemmer",
    agent: "Agentkonfigurasjon",
  },
  general: {
    vector: {
      title: "Vektortelling",
      description: "Totalt antall vektorer i vektordatabasen din.",
    },
    names: {
      description:
        "Dette vil bare endre visningsnavnet på arbeidsområdet ditt.",
    },
    message: {
      title: "Foreslåtte chatmeldinger",
      description:
        "Tilpass meldingene som vil bli foreslått til brukerne av arbeidsområdet.",
      add: "Legg til ny melding",
      save: "Lagre meldinger",
      heading: "Forklar meg",
      body: "fordelene med Lovora",
    },
    pfp: {
      title: "Assistent-profilbilde",
      description:
        "Tilpass profilbildet til assistenten for dette arbeidsområdet.",
      image: "Arbeidsområdebilde",
      remove: "Fjern arbeidsområdebilde",
    },
    delete: {
      title: "Slett arbeidsområde",
      description:
        "Slett dette arbeidsområdet og alle dets data. Dette vil slette arbeidsområdet for alle brukere.",
      delete: "Slett arbeidsområde",
      deleting: "Sletter arbeidsområde …",
      "confirm-start": "Du er i ferd med å slette hele",
      "confirm-end":
        "arbeidsområde. Dette vil fjerne alle vektorinnbygginger i vektordatabasen din.\n\nDe originale kildefilene forblir urørt. Denne handlingen er irreversibel.",
    },
  },
  chat: {
    llm: {
      title: "Arbeidsområde LLM Leverandør",
      description:
        "Den spesifikke LLM-leverandøren og modellen som skal brukes for dette arbeidsområdet. Som standard bruker den systemets LLM-leverandør og -innstillinger.",
      search: "Søk i alle LLM-leverandører",
    },
    model: {
      title: "Workspace Chat-modell",
      description:
        "Den spesifikke chat-modellen som vil bli brukt for dette arbeidsområdet. Hvis tom, vil systemets LLM-preferanse brukes.",
      wait: "-- venter på modeller --",
    },
    mode: {
      title: "Chat-modus",
      chat: {
        title: "Chat",
        "desc-start": "vil gi svar med LLMs generelle kunnskap",
        and: "og",
        "desc-end": "dokumentkontekst som er funnet.",
      },
      query: {
        title: "Spørsmål",
        "desc-start": "vil gi svar",
        only: "bare",
        "desc-end": "hvis dokumentkontekst er funnet.",
      },
    },
    history: {
      title: "Chat historie",
      "desc-start":
        "Antall tidligere chatter som vil bli inkludert i svarets korttidsminne.",
      recommend: "Anbefaler 20.",
      "desc-end":
        "Alt mer enn 45 vil sannsynligvis føre til kontinuerlige chat-feil avhengig av meldingsstørrelse.",
    },
    prompt: {
      title: "Systemmelding",
      description:
        "Spørsmålet som skal brukes på dette arbeidsområdet. Definer konteksten og instruksjonene for AI for å generere et svar. Du bør gi en nøye utformet melding slik at AI kan generere et relevant og nøyaktig svar.",
      history: {
        title: "Systemmeldingshistorikk",
        clearAll: "Fjern alle",
        noHistory: "Ingen systemmeldingshistorikk tilgjengelig",
        restore: "Restaurere",
        delete: "Slett",
        publish: "Publiser til Community Hub",
        deleteConfirm:
          "Er du sikker på at du vil slette dette historieelementet?",
        clearAllConfirm:
          "Er du sikker på at du vil slette all historikk? Denne handlingen kan ikke angres.",
        expand: "Utvide",
      },
    },
    refusal: {
      title: "Svar på avslag i spørringsmodus",
      "desc-start": "Når du er inne",
      query: "spørsmål",
      "desc-end":
        "modus, vil du kanskje returnere et tilpasset avslagssvar når ingen kontekst er funnet.",
      "tooltip-title": "Hvorfor ser jeg dette?",
      "tooltip-description":
        "Du er i spørringsmodus, som kun bruker informasjon fra dokumentene dine. Bytt til chat-modus for mer fleksible samtaler, eller klikk her for å besøke dokumentasjonen vår for å lære mer om chat-moduser.",
    },
    temperature: {
      title: "LLM Temperatur",
      "desc-start":
        'Denne innstillingen kontrollerer hvor "kreative" LLM-svarene dine vil være.',
      "desc-end":
        "Jo høyere tall, jo mer kreativt. For noen modeller kan dette føre til usammenhengende svar når det er satt for høyt.",
      hint: "De fleste LLM-er har forskjellige akseptable områder av gyldige verdier. Kontakt leverandøren LLM for denne informasjonen.",
    },
  },
  "vector-workspace": {
    identifier: "Vektordatabaseidentifikator",
    snippets: {
      title: "Maks kontekstbiter",
      description:
        "Denne innstillingen kontrollerer det maksimale antallet kontekstbiter som sendes til LLM for per chat eller spørring.",
      recommend: "Anbefalt: 4",
    },
    doc: {
      title: "Terskel for dokumentlikhet",
      description:
        "Minste likhetspoeng som kreves for at en kilde skal anses relatert til chatten. Jo høyere tall, jo mer lik må kilden være chatten.",
      zero: "Ingen begrensning",
      low: "Lav (likhetspoeng ≥ 0,25)",
      medium: "Middels (likhetspoeng ≥ 0,50)",
      high: "Høy (likhetspoeng ≥ 0,75)",
    },
    reset: {
      reset: "Tilbakestill vektordatabase",
      resetting: "Fjerner vektorer...",
      confirm:
        "Du er i ferd med å tilbakestille dette arbeidsområdets vektordatabase. Dette vil fjerne alle vektorinnbygginger som for øyeblikket er innebygd.\n\nDe originale kildefilene forblir urørt. Denne handlingen er irreversibel.",
      error: "Workspace vektordatabase kunne ikke tilbakestilles!",
      success: "Workspace vektordatabase ble tilbakestilt!",
    },
  },
  agent: {
    "performance-warning":
      "Ytelsen til LLM-er som ikke eksplisitt støtter verktøykalling er svært avhengig av modellens muligheter og nøyaktighet. Noen evner kan være begrensede eller ikke-funksjonelle.",
    provider: {
      title: "Arbeidsområdeagent LLM Leverandør",
      description:
        "Den spesifikke LLM-leverandøren og modellen som skal brukes for dette arbeidsområdets @agent-agent.",
    },
    mode: {
      chat: {
        title: "Workspace Agent Chat-modell",
        description:
          "Den spesifikke chattemodellen som skal brukes for dette arbeidsområdets @agent-agent.",
      },
      title: "Workspace Agent-modell",
      description:
        "Den spesifikke LLM-modellen som skal brukes for dette arbeidsområdets @agent-agent.",
      wait: "-- venter på modeller --",
    },
    skill: {
      title: "Standard agent ferdigheter",
      description:
        "Forbedre de naturlige evnene til standardagenten med disse forhåndsbygde ferdighetene. Dette oppsettet gjelder alle arbeidsområder.",
      rag: {
        title: "RAG & langtidsminne",
        description:
          'La agenten bruke de lokale dokumentene dine til å svare på et spørsmål, eller be agenten om å "huske" deler av innholdet for gjenfinning av langtidsminnet.',
      },
      view: {
        title: "Se og oppsummer dokumenter",
        description:
          "La agenten liste og oppsummere innholdet i arbeidsområdefiler som er innebygd for øyeblikket.",
      },
      scrape: {
        title: "Skrap nettsider",
        description: "La agenten besøke og skrape innholdet på nettsteder.",
      },
      generate: {
        title: "Generer diagrammer",
        description:
          "Aktiver standardagenten for å generere ulike typer diagrammer fra data gitt eller gitt i chat.",
      },
      save: {
        title: "Generer og lagre filer",
        description:
          "Aktiver standardagenten for å generere og skrive til filer som kan lagres på datamaskinen din.",
      },
      web: {
        title: "Nettsøk",
        description:
          "Aktiver agenten din til å søke på nettet for å svare på spørsmålene dine ved å koble til en leverandør av nettsøk (SERP).",
      },
      sql: {
        title: "SQL kobling",
        description:
          "Aktiver agenten din for å kunne utnytte SQL for å svare på spørsmål ved å koble til ulike SQL-databaseleverandører.",
      },
      default_skill:
        "Som standard er denne ferdigheten aktivert, men du kan deaktivere den hvis du ikke vil at den skal være tilgjengelig for agenten.",
    },
  },
  recorded: {
    title: "Arbeidsområdechatter",
    description:
      "Dette er alle de innspilte chattene og meldingene som er sendt av brukere sortert etter opprettelsesdatoen.",
    export: "Eksport",
    table: {
      id: "ID",
      by: "Sendt av",
      workspace: "Arbeidsområde",
      prompt: "Spør",
      response: "Svar",
      at: "Sendt kl",
    },
  },
  customization: {
    interface: {
      title: "UI-innstillinger",
      description: "Angi UI-preferansene dine for Lovora.",
    },
    branding: {
      title: "Merkevarebygging og hvitmerking",
      description:
        "Hvitmerk Lovora-forekomsten din med tilpasset merkevarebygging.",
    },
    chat: {
      title: "Chat",
      description: "Angi chatpreferansene dine for Lovora.",
      auto_submit: {
        title: "Auto-send taleinndata",
        description:
          "Send automatisk inn taleinndata etter en periode med stillhet",
      },
      auto_speak: {
        title: "Autoles svar",
        description: "Les svar fra AI automatisk",
      },
      spellcheck: {
        title: "Aktiver stavekontroll",
        description:
          "Aktiver eller deaktiver stavekontroll i chat-inndatafeltet",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Velg ditt foretrukne fargetema for applikasjonen.",
      },
      "show-scrollbar": {
        title: "Vis rullefelt",
        description: "Aktiver eller deaktiver rullefeltet i chattevinduet.",
      },
      "support-email": {
        title: "E-post til støtte",
        description:
          "Angi støtte-e-postadressen som skal være tilgjengelig for brukere når de trenger hjelp.",
      },
      "app-name": {
        title: "Navn",
        description:
          "Angi et navn som vises på påloggingssiden til alle brukere.",
      },
      "chat-message-alignment": {
        title: "Samtalemeldingsjustering",
        description:
          "Velg meldingsjusteringsmodus når du bruker chat-grensesnittet.",
      },
      "display-language": {
        title: "Visningsspråk",
        description:
          "Velg det foretrukne språket for å gjengi Lovoras brukergrensesnitt på - når oversettelser er tilgjengelige.",
      },
      logo: {
        title: "Merkevarelogo",
        description:
          "Last opp din egendefinerte logo for å vise frem på alle sider.",
        add: "Legg til en tilpasset logo",
        recommended: "Anbefalt størrelse: 800 x 200",
        remove: "Fjerne",
        replace: "Bytt ut",
      },
      "welcome-messages": {
        title: "Velkomstmeldinger",
        description:
          "Tilpass velkomstmeldingene som vises til brukerne dine. Bare ikke-administratorbrukere vil se disse meldingene.",
        new: "Ny",
        system: "system",
        user: "bruker",
        message: "beskjed",
        assistant: "Lovora Chat-assistent",
        "double-click": "Dobbeltklikk for å redigere...",
        save: "Lagre meldinger",
      },
      "browser-appearance": {
        title: "Nettleserutseende",
        description:
          "Tilpass utseendet til nettleserfanen og tittelen når appen er åpen.",
        tab: {
          title: "Tittel",
          description:
            "Angi en egendefinert fanetittel når appen er åpen i en nettleser.",
        },
        favicon: {
          title: "Favorittikon",
          description: "Bruk et tilpasset favorittikon for nettleserfanen.",
        },
      },
      "sidebar-footer": {
        title: "Sidebar-bunntekstelementer",
        description:
          "Tilpass bunntekstelementene som vises nederst på sidefeltet.",
        icon: "Ikon",
        link: "Link",
      },
      "render-html": {
        title: "Gjengi HTML i chat",
        description:
          "Gjengi HTML-svar i assistentsvar.\nDette kan resultere i en mye høyere responskvalitet, men kan også føre til potensielle sikkerhetsrisikoer.",
      },
    },
  },
  api: {
    title: "API nøkler",
    description:
      "API-nøkler lar innehaveren programmessig få tilgang til og administrere denne Lovora-forekomsten.",
    link: "Les API-dokumentasjonen",
    generate: "Generer ny API nøkkel",
    table: {
      key: "API Nøkkel",
      by: "Laget av",
      created: "Opprettet",
    },
  },
  llm: {
    title: "LLM Preferanse",
    description:
      "Dette er legitimasjonen og innstillingene for din foretrukne LLM chat- og innebyggingsleverandør. Det er viktig at disse tastene er oppdaterte og korrekte, ellers vil ikke Lovora fungere ordentlig.",
    provider: "LLM Leverandør",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure Tjenesteendepunkt",
        api_key: "API Nøkkel",
        chat_deployment_name: "Navn på chatdistribusjon",
        chat_model_token_limit: "Chat Model Token Limit",
        model_type: "Modelltype",
        model_type_tooltip:
          'Hvis distribusjonen din bruker en resonneringsmodell (o1, o1-mini, o3-mini, etc.), sett denne til "Reasoning". Ellers kan chat-forespørslene dine mislykkes.',
        default: "Misligholde",
        reasoning: "Argumentasjon",
      },
    },
  },
  transcription: {
    title: "Preferanse for transkripsjonsmodell",
    description:
      "Dette er legitimasjonen og innstillingene for din foretrukne transkripsjonsmodellleverandør. Det er viktig at disse tastene er aktuelle og korrekte, ellers vil ikke mediefiler og lyd transkriberes.",
    provider: "Transkripsjonsleverandør",
    "warn-start":
      "Bruk av den lokale hviskemodellen på maskiner med begrenset RAM eller CPU kan stoppe Lovora ved behandling av mediefiler.",
    "warn-recommend": "Vi anbefaler minst 2 GB RAM og last opp filer <10 Mb.",
    "warn-end":
      "Den innebygde modellen vil automatisk lastes ned ved første gangs bruk.",
  },
  embedding: {
    title: "Innebyggingspreferanse",
    "desc-start":
      "Når du bruker en LLM som ikke støtter en innebyggingsmotor - kan det hende du må spesifisere legitimasjon for innebygging av tekst.",
    "desc-end":
      "Innebygging er prosessen med å gjøre tekst om til vektorer. Disse legitimasjonene kreves for å gjøre filene og meldingene dine om til et format som Lovora kan bruke til å behandle.",
    provider: {
      title: "Innebyggingsleverandør",
    },
  },
  text: {
    title: "Innstillinger for tekstdeling og deling",
    "desc-start":
      "Noen ganger kan det være lurt å endre standardmåten som nye dokumenter deles og deles på før de settes inn i vektordatabasen.",
    "desc-end":
      "Du bør bare endre denne innstillingen hvis du forstår hvordan tekstdeling fungerer og dets bivirkninger.",
    size: {
      title: "Tekstbitstørrelse",
      description:
        "Dette er den maksimale lengden på tegn som kan være til stede i en enkelt vektor.",
      recommend: "Legg inn modell maksimal lengde er",
    },
    overlap: {
      title: "Tekstdeloverlapping",
      description:
        "Dette er den maksimale overlappingen av tegn som oppstår under chunking mellom to tilstøtende tekstbiter.",
    },
  },
  vector: {
    title: "Vektordatabase",
    description:
      "Dette er legitimasjonen og innstillingene for hvordan Lovora-forekomsten din vil fungere. Det er viktig at disse nøklene er aktuelle og korrekte.",
    provider: {
      title: "Leverandør av vektordatabase",
      description: "Det er ingen konfigurasjon nødvendig for LanceDB.",
    },
  },
  embeddable: {
    title: "Innbyggbare chat-widgeter",
    description:
      "Innebyggbare chat-widgeter er offentlig vendte chat-grensesnitt som er knyttet til ett enkelt arbeidsområde. Disse lar deg bygge arbeidsområder som du deretter kan publisere til verden.",
    create: "Opprett innebygging",
    table: {
      workspace: "Arbeidsområde",
      chats: "Sendte chatter",
      active: "Aktive domener",
      created: "Opprettet",
    },
  },
  "embed-chats": {
    title: "Bygg inn chattehistorikk",
    export: "Eksport",
    description:
      "Dette er alle de innspilte chattene og meldingene fra alle innbygginger du har publisert.",
    table: {
      embed: "Bygg inn",
      sender: "Avsender",
      message: "Beskjed",
      response: "Svar",
      at: "Sendt kl",
    },
  },
  security: {
    title: "Sikkerhet",
    multiuser: {
      title: "Flerbrukermodus",
      description:
        "Sett opp instansen din for å støtte teamet ditt ved å aktivere flerbrukermodus.",
      enable: {
        "is-enable": "Multi-User Mode er aktivert",
        enable: "Aktiver flerbrukermodus",
        description:
          "Som standard vil du være den eneste administratoren. Som administrator må du opprette kontoer for alle nye brukere eller administratorer. Ikke mist passordet ditt, siden bare en Admin-bruker kan tilbakestille passord.",
        username: "Brukernavn for administratorkontoen",
        password: "Admin konto passord",
      },
    },
    password: {
      title: "Passordbeskyttelse",
      description:
        "Beskytt Lovora-forekomsten din med et passord. Hvis du glemmer dette, er det ingen gjenopprettingsmetode, så sørg for at du lagrer dette passordet.",
      "password-label": "Forekomstpassord",
    },
  },
  event: {
    title: "Hendelseslogger",
    description:
      "Se alle handlinger og hendelser som skjer på denne forekomsten for overvåking.",
    clear: "Fjern hendelseslogger",
    table: {
      type: "Hendelsestype",
      user: "Bruker",
      occurred: "Oppstod kl",
    },
  },
  privacy: {
    title: "Personvern og datahåndtering",
    description:
      "Dette er din konfigurasjon for hvordan tilkoblede tredjepartsleverandører og Lovora håndterer dataene dine.",
    llm: "LLM Leverandør",
    embedding: "Innebyggingspreferanse",
    vector: "Vektordatabase",
    anonymous: "Anonym telemetri aktivert",
  },
  connectors: {
    "search-placeholder": "Søk etter datakoblinger",
    "no-connectors": "Fant ingen datakoblinger.",
    obsidian: {
      name: "Obsidian",
      description: "Importer Obsidian hvelv med ett enkelt klikk.",
      vault_location: "Hvelvplassering",
      vault_description:
        "Velg Obsidian hvelvmappen for å importere alle notater og deres tilkoblinger.",
      selected_files: "Fant {{count}} nedmerkingsfiler",
      importing: "Importerer hvelv...",
      import_vault: "Importer hvelv",
      processing_time:
        "Dette kan ta en stund avhengig av størrelsen på hvelvet ditt.",
      vault_warning:
        "For å unngå konflikter, sørg for at Obsidian-hvelvet ikke er åpent for øyeblikket.",
    },
    github: {
      name: "GitHub Rep",
      description:
        "Importer et helt offentlig eller privat GitHub-lager med ett enkelt klikk.",
      URL: "GitHub Repo URL",
      URL_explained: "Nettadressen til GitHub repoen du ønsker å samle inn.",
      token: "GitHub Tilgangstoken",
      optional: "valgfri",
      token_explained: "Tilgangstoken for å forhindre hastighetsbegrensning.",
      token_explained_start: "Uten en",
      token_explained_link1: "Personlig tilgangstoken",
      token_explained_middle:
        ", kan GitHub API begrense antallet filer som kan samles på grunn av hastighetsgrenser. Du kan",
      token_explained_link2: "opprette et midlertidig tilgangstoken",
      token_explained_end: "for å unngå dette problemet.",
      ignores: "Filen ignoreres",
      git_ignore:
        "List i .gitignore-format for å ignorere spesifikke filer under innsamling. Trykk enter etter hver oppføring du vil lagre.",
      task_explained:
        "Når de er fullført, vil alle filene være tilgjengelige for innbygging i arbeidsområder i dokumentvelgeren.",
      branch: "Filial du ønsker å samle filer fra.",
      branch_loading: "-- lasting av tilgjengelige grener --",
      branch_explained: "Filial du ønsker å samle filer fra.",
      token_information:
        "Uten å fylle ut <b>GitHub Access Token</b> vil denne datakoblingen kun kunne samle <b>toppnivå</b> filene til repoen på grunn av GitHubs offentlige API takstgrenser.",
      token_personal:
        "Få et gratis personlig tilgangstoken med en GitHub konto her.",
    },
    gitlab: {
      name: "GitLab Rep",
      description:
        "Importer et helt offentlig eller privat GitLab-lager med ett enkelt klikk.",
      URL: "GitLab Repo URL",
      URL_explained: "URL til GitLab repo du ønsker å samle inn.",
      token: "GitLab Tilgangstoken",
      optional: "valgfri",
      token_explained: "Tilgangstoken for å forhindre hastighetsbegrensning.",
      token_description: "Velg flere enheter å hente fra GitLab API.",
      token_explained_start: "Uten en",
      token_explained_link1: "Personlig tilgangstoken",
      token_explained_middle:
        ", kan GitLab API begrense antallet filer som kan samles på grunn av hastighetsgrenser. Du kan",
      token_explained_link2: "opprette et midlertidig tilgangstoken",
      token_explained_end: "for å unngå dette problemet.",
      fetch_issues: "Hent problemer som dokumenter",
      ignores: "Filen ignoreres",
      git_ignore:
        "List i .gitignore-format for å ignorere spesifikke filer under innsamling. Trykk enter etter hver oppføring du vil lagre.",
      task_explained:
        "Når de er fullført, vil alle filene være tilgjengelige for innbygging i arbeidsområder i dokumentvelgeren.",
      branch: "Filial du ønsker å samle filer fra",
      branch_loading: "-- lasting av tilgjengelige grener --",
      branch_explained: "Filial du ønsker å samle filer fra.",
      token_information:
        "Uten å fylle ut <b>GitLab Access Token</b> vil denne datakoblingen kun kunne samle <b>toppnivå</b> filene til repoen på grunn av GitLabs offentlige API takstgrenser.",
      token_personal:
        "Få et gratis personlig tilgangstoken med en GitLab konto her.",
    },
    youtube: {
      name: "YouTube Transkripsjon",
      description:
        "Importer transkripsjonen av en hel YouTube video fra en kobling.",
      URL: "YouTube Video-URL",
      URL_explained_start:
        "Skriv inn nettadressen til en hvilken som helst YouTube video for å hente transkripsjonen. Videoen må ha",
      URL_explained_link: "lukkede bildetekster",
      URL_explained_end: "tilgjengelig.",
      task_explained:
        "Når det er fullført, vil transkripsjonen være tilgjengelig for innebygging i arbeidsområder i dokumentvelgeren.",
      language: "Transkripsjonsspråk",
      language_explained: "Velg språket for utskriften du vil samle inn.",
      loading_languages: "-- laster tilgjengelige språk --",
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description:
        "Skrap et nettsted og dets underlenker opp til en viss dybde.",
      URL: "Nettstedets URL",
      URL_explained: "URL til nettstedet du vil skrape.",
      depth: "Krypdybde",
      depth_explained:
        "Dette er antallet underordnede lenker som arbeideren skal følge fra opprinnelses-URLen.",
      max_pages: "Maksimalt antall sider",
      max_pages_explained: "Maksimalt antall lenker å skrape.",
      task_explained:
        "Når det er fullført, vil alt utskrapet innhold være tilgjengelig for innebygging i arbeidsområder i dokumentvelgeren.",
    },
    confluence: {
      name: "Confluence",
      description: "Importer en hel Confluence-side med ett enkelt klikk.",
      deployment_type: "Confluence distribusjonstype",
      deployment_type_explained:
        "Finn ut om Confluence-forekomsten din er vert for Atlassian-skyen eller selv-vert.",
      base_url: "Confluence basis-URL",
      base_url_explained: "Dette er basis-URLen til Confluence-området ditt.",
      space_key: "Confluence mellomromstast",
      space_key_explained:
        "Dette er mellomromsnøkkelen til din sammenløpsforekomst som vil bli brukt. Begynner vanligvis med ~",
      username: "Confluence Brukernavn",
      username_explained: "Ditt Confluence brukernavn",
      auth_type: "Confluence Auth Type",
      auth_type_explained:
        "Velg autentiseringstypen du vil bruke for å få tilgang til Confluence-sidene dine.",
      auth_type_username: "Brukernavn og tilgangstoken",
      auth_type_personal: "Personlig tilgangstoken",
      token: "Confluence Tilgangstoken",
      token_explained_start:
        "Du må oppgi et tilgangstoken for autentisering. Du kan generere et tilgangstoken",
      token_explained_link: "her",
      token_desc: "Tilgangstoken for autentisering",
      pat_token: "Confluence Personlig tilgangstoken",
      pat_token_explained: "Ditt Confluence personlige tilgangstoken.",
      bypass_ssl: "Omgå SSL-sertifikatvalidering",
      bypass_ssl_explained:
        "Aktiver dette alternativet for å omgå SSL-sertifikatvalidering for selvvertsbaserte sammenløpsforekomster med selvsignert sertifikat",
      task_explained:
        "Når det er fullført, vil sideinnholdet være tilgjengelig for innbygging i arbeidsområder i dokumentvelgeren.",
    },
    manage: {
      documents: "Dokumenter",
      "data-connectors": "Datakoblinger",
      "desktop-only":
        "Redigering av disse innstillingene er bare tilgjengelig på en stasjonær enhet. Gå til denne siden på skrivebordet for å fortsette.",
      dismiss: "Lukk",
      editing: "Redigering",
    },
    directory: {
      "my-documents": "Mine dokumenter",
      "new-folder": "Ny mappe",
      "search-document": "Søk etter dokument",
      "no-documents": "Ingen dokumenter",
      "move-workspace": "Flytt til Workspace",
      name: "Navn",
      "delete-confirmation":
        "Er du sikker på at du vil slette disse filene og mappene?\nDette vil fjerne filene fra systemet og fjerne dem fra eksisterende arbeidsområder automatisk.\nDenne handlingen er ikke reversibel.",
      "removing-message":
        "Fjerner {{count}} dokumenter og {{folderCount}} mapper. Vennligst vent.",
      "move-success": "Flyttet {{count}} dokumenter.",
      date: "Dato",
      type: "Type",
      no_docs: "Ingen dokumenter",
      select_all: "Velg alle",
      deselect_all: "Fjern merket for Alle",
      remove_selected: "Fjern valgte",
      costs: "*Engangskostnad for innbygging",
      save_embed: "Lagre og bygg inn",
    },
    upload: {
      "processor-offline": "Dokumentbehandler utilgjengelig",
      "processor-offline-desc":
        "Vi kan ikke laste opp filene dine akkurat nå fordi dokumentbehandleren er frakoblet. Vennligst prøv igjen senere.",
      "click-upload": "Klikk for å laste opp eller dra og slipp",
      "file-types": "støtter tekstfiler, csv-er, regneark, lydfiler og mer!",
      "or-submit-link": "eller send inn en lenke",
      "placeholder-link": "https://example.com",
      fetching: "Henter...",
      "fetch-website": "Hent nettsted",
      "privacy-notice":
        "Disse filene vil bli lastet opp til dokumentbehandleren som kjører på denne Lovora-forekomsten. Disse filene sendes eller deles ikke med en tredjepart.",
    },
    pinning: {
      what_pinning: "Hva er dokumentfesting?",
      pin_explained_block1:
        "Når du <b>fester</b> et dokument i Lovora, injiserer vi hele innholdet i dokumentet i forespørselsvinduet ditt slik at LLM kan forstå det fullt ut.",
      pin_explained_block2:
        "Dette fungerer best med <b>modeller med stor kontekst</b> eller små filer som er kritiske for kunnskapsbasen.",
      pin_explained_block3:
        "Hvis du ikke får svarene du ønsker fra Lovora som standard, er festing en fin måte å få svar av høyere kvalitet med et klikk.",
      accept: "Ok, skjønner det",
    },
    watching: {
      what_watching: "Hva gjør det å se et dokument?",
      watch_explained_block1:
        "Når du <b>ser</b> et dokument i Lovora vil vi <i>automatisk</i> synkronisere dokumentinnholdet ditt fra den opprinnelige kilden med jevne mellomrom. Dette vil automatisk oppdatere innholdet i hvert arbeidsområde der denne filen administreres.",
      watch_explained_block2:
        "Denne funksjonen støtter for øyeblikket nettbasert innhold og vil ikke være tilgjengelig for manuelt opplastede dokumenter.",
      watch_explained_block3_start:
        "Du kan administrere hvilke dokumenter som overvåkes fra",
      watch_explained_block3_link: "Filbehandler",
      watch_explained_block3_end: "administratorvisning.",
      accept: "Ok, skjønner det",
    },
  },
  chat_window: {
    welcome: "Velkommen til ditt nye arbeidsområde.",
    get_started: "For å komme i gang kan du enten",
    get_started_default: "For å komme i gang",
    upload: "laste opp et dokument",
    or: "eller",
    attachments_processing: "Vedlegg behandles. Vennligst vent...",
    send_chat: "send en chat.",
    send_message: "Send en melding",
    attach_file: "Legg ved en fil i denne chatten",
    slash: "Se alle tilgjengelige skråstrekkommandoer for chatting.",
    agents: "Se alle tilgjengelige agenter du kan bruke til å chatte.",
    text_size: "Endre tekststørrelse.",
    microphone: "Si spørsmålet ditt.",
    send: "Send melding til arbeidsområdet",
    tts_speak_message: "Les opp melding",
    copy: "Kopier",
    regenerate: "Regenerer",
    regenerate_response: "Generer svaret på nytt",
    good_response: "Bra svar",
    more_actions: "Flere handlinger",
    hide_citations: "Skjul sitater",
    show_citations: "Vis sitater",
    sources: "Kilder",
    source_count_one: "{{count}} referanse",
    source_count_other: "{{count}} referanser",
    document: "Dokument",
    similarity_match: "treff",
    pause_tts_speech_message: "Pause TTS-tale for melding",
    fork: "Forgren",
    delete: "Slett",
    save_submit: "Lagre og send",
    cancel: "Avbryt",
    submit: "Send",
    edit_prompt: "Rediger melding",
    edit_response: "Rediger svaret",
    edit_info_user:
      '"Send" genererer AI-svaret på nytt. "Lagre" oppdaterer bare meldingen din.',
    edit_info_assistant: "Endringene dine lagres direkte i dette svaret.",
    see_less: "Se mindre",
    see_more: "Se mer",
    at_agent: "@agent",
    default_agent_description: "- standardagenten for dette arbeidsområdet.",
    custom_agents_coming_soon: "tilpassede agenter kommer snart!",
    preset_reset_description: "Tøm chathistorikken og start en ny chat",
    preset_exit_description: "Stopp gjeldende agentøkt",
    add_new_preset: "Legg til ny forhåndsinnstilling",
    add_new: "Legg til ny",
    edit: "Rediger",
    publish: "Publiser",
    stop_generating: "Stopp generering av svar",
    command: "Kommando",
    your_command: "din-kommando",
    placeholder_prompt:
      "Dette er innholdet som legges inn foran meldingen din.",
    description: "Beskrivelse",
    placeholder_description: "Svarer med et dikt om LLM-er.",
    save: "Lagre",
    small: "Liten",
    normal: "Normal",
    large: "Stor",
    tools: "Verktøy",
    slash_commands: "Slash-kommandoer",
    agent_skills: "Agentferdigheter",
    manage_agent_skills: "Administrer agentferdigheter",
    agent_skills_disabled_in_session:
      "Kan ikke endre ferdigheter under en aktiv agentøkt. Bruk /exit for å avslutte økten først.",
    browse: "Bla gjennom",
    text_size_label: "Tekststørrelse",
    select_model: "Velg modell",
    workspace_llm_manager: {
      search: "Søk",
      loading_workspace_settings: "Laster arbeidsområdeinnstillinger...",
      available_models: "Tilgjengelige modeller for {{provider}}",
      available_models_description:
        "Velg en modell du vil bruke for dette arbeidsområdet.",
      save: "Bruk denne modellen",
      saving: "Setter modellen som standard for arbeidsområdet...",
      missing_credentials: "Denne leverandøren mangler legitimasjon!",
      missing_credentials_description: "Sett opp nå",
    },
  },
  profile_settings: {
    edit_account: "Rediger konto",
    profile_picture: "Profilbilde",
    remove_profile_picture: "Fjern profilbilde",
    username: "Brukernavn",
    new_password: "Nytt passord",
    password_description: "Passordet må være minst 8 tegn langt",
    cancel: "Avbryt",
    update_account: "Oppdater konto",
    theme: "Temapreferanse",
    language: "Foretrukket språk",
    failed_upload: "Kunne ikke laste opp profilbilde: {{error}}",
    upload_success: "Profilbilde lastet opp.",
    failed_remove: "Kunne ikke fjerne profilbildet: {{error}}",
    profile_updated: "Profilen er oppdatert.",
    failed_update_user: "Kunne ikke oppdatere bruker: {{error}}",
    account: "Konto",
    support: "Støtte",
    signout: "Logg ut",
  },
  "keyboard-shortcuts": {
    title: "Tastatursnarveier",
    shortcuts: {
      settings: "Åpne innstillinger",
      workspaceSettings: "Åpne gjeldende arbeidsområdeinnstillinger",
      home: "Gå til hjem",
      workspaces: "Administrer arbeidsområder",
      apiKeys: "API-nøkkelinnstillinger",
      llmPreferences: "LLM-innstillinger",
      chatSettings: "Chat-innstillinger",
      help: "Vis hjelp for tastatursnarveier",
      showLLMSelector: "Vis LLM-velger for arbeidsområdet",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Suksess!",
        success_description:
          "Systemforespørselen din har blitt publisert til fellesskapshuben!",
        success_thank_you: "Takk for at du deler med fellesskapet!",
        view_on_hub: "Se på Community Hub",
        modal_title: "Publiser systemforespørsel",
        name_label: "Navn",
        name_description: "Dette er visningsnavnet på systemforespørselen.",
        name_placeholder: "Min systemmelding",
        description_label: "Beskrivelse",
        description_description:
          "Dette er beskrivelsen av systemmeldingen. Bruk denne for å beskrive formålet med systemforespørselen.",
        tags_label: "Tagger",
        tags_description:
          "Tagger brukes til å merke systemforespørselen for enklere søk. Du kan legge til flere tagger. Maks 5 tagger. Maks 20 tegn per tag.",
        tags_placeholder: "Skriv inn og trykk Enter for å legge til tagger",
        visibility_label: "Synlighet",
        public_description:
          "Offentlige systemoppfordringer er synlige for alle.",
        private_description:
          "Private systemforespørsler er bare synlige for deg.",
        publish_button: "Publiser til Community Hub",
        submitting: "Publiserer...",
        submit: "Publiser til Community Hub",
        prompt_label: "Spør",
        prompt_description:
          "Dette er den faktiske systemmeldingen som vil bli brukt til å veilede LLM.",
        prompt_placeholder: "Skriv inn systemforespørselen din her...",
      },
      agent_flow: {
        public_description: "Offentlige agentstrømmer er synlige for alle.",
        private_description: "Private agentflyter er kun synlige for deg.",
        success_title: "Suksess!",
        success_description:
          "Agentflyten din har blitt publisert til fellesskapshuben!",
        success_thank_you: "Takk for at du deler med fellesskapet!",
        view_on_hub: "Se på Community Hub",
        modal_title: "Publiser Agent Flow",
        name_label: "Navn",
        name_description: "Dette er visningsnavnet på agentflyten din.",
        name_placeholder: "Min Agent Flow",
        description_label: "Beskrivelse",
        description_description:
          "Dette er beskrivelsen av agentflyten din. Bruk dette til å beskrive formålet med agentflyten din.",
        tags_label: "Tagger",
        tags_description:
          "Tagger brukes til å merke agentflyten din for enklere søk. Du kan legge til flere tagger. Maks 5 tagger. Maks 20 tegn per tag.",
        tags_placeholder: "Skriv inn og trykk Enter for å legge til tagger",
        visibility_label: "Synlighet",
        publish_button: "Publiser til Community Hub",
        submitting: "Publiserer...",
        submit: "Publiser til Community Hub",
        privacy_note:
          "Agentflyter lastes alltid opp som private for å beskytte eventuelle sensitive data. Du kan endre synligheten i Community Hub etter publisering. Kontroller at flyten din ikke inneholder sensitiv eller privat informasjon før publisering.",
      },
      slash_command: {
        success_title: "Suksess!",
        success_description:
          "Din Slash-kommando har blitt publisert til Community Hub!",
        success_thank_you: "Takk for at du deler med fellesskapet!",
        view_on_hub: "Se på Community Hub",
        modal_title: "Publiser Slash Command",
        name_label: "Navn",
        name_description: "Dette er visningsnavnet på skråstrekkommandoen.",
        name_placeholder: "Min Slash Command",
        description_label: "Beskrivelse",
        description_description:
          "Dette er beskrivelsen av skråstrek-kommandoen din. Bruk denne for å beskrive formålet med skråstrek-kommandoen.",
        command_label: "Kommando",
        command_description:
          "Dette er skråstrekkommandoen som brukere vil skrive for å utløse denne forhåndsinnstillingen.",
        command_placeholder: "min-kommando",
        tags_label: "Tagger",
        tags_description:
          "Tagger brukes til å merke skråstrekkommandoen for enklere søk. Du kan legge til flere tagger. Maks 5 tagger. Maks 20 tegn per tag.",
        tags_placeholder: "Skriv inn og trykk Enter for å legge til tagger",
        visibility_label: "Synlighet",
        public_description:
          "Offentlige skråstrekkommandoer er synlige for alle.",
        private_description:
          "Private skråstrekkommandoer er bare synlige for deg.",
        publish_button: "Publiser til Community Hub",
        submitting: "Publiserer...",
        prompt_label: "Spør",
        prompt_description:
          "Dette er ledeteksten som vil bli brukt når skråstrek-kommandoen utløses.",
        prompt_placeholder: "Skriv inn spørsmålet ditt her...",
      },
      generic: {
        unauthenticated: {
          title: "Autentisering kreves",
          description:
            "Du må autentisere med Lovora Community Hub før du publiserer elementer.",
          button: "Koble til Community Hub",
        },
      },
    },
  },
};

export default TRANSLATIONS;
