// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: "Wat is je e-mailadres?",
      useCase: "Waarvoor ga je AnythingLLM gebruiken?",
      useCaseWork: "Voor werk",
      useCasePersonal: "Voor persoonlijk gebruik",
      useCaseOther: "Anders",
      comment: "Hoe heb je over AnythingLLM gehoord?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, enz. - Laat ons weten hoe je ons gevonden hebt!",
      skip: "Enquête overslaan",
      thankYou: "Bedankt voor je feedback!",
      title: "Welkom bij AnythingLLM",
      description:
        "Help ons AnythingLLM af te stemmen op jouw behoeften. (Optioneel)",
    },
    home: {
      title: "Welkom bij",
      getStarted: "Aan de slag",
    },
    llm: {
      title: "LLM-voorkeuren",
      description:
        "AnythingLLM kan samenwerken met veel LLM-aanbieders. Deze service verzorgt de chatfunctie.",
    },
    userSetup: {
      title: "Gebruikersinstellingen",
      description: "Configureer uw gebruikersinstellingen.",
      howManyUsers: "Hoeveel gebruikers zullen deze instantie gebruiken?",
      justMe: "Alleen ik",
      myTeam: "Mijn team",
      instancePassword: "Instancewachtwoord",
      setPassword: "Wilt u een wachtwoord instellen?",
      passwordReq: "Wachtwoorden moeten minimaal 8 tekens lang zijn.",
      passwordWarn:
        "Het is belangrijk om dit wachtwoord te bewaren, omdat er geen herstelmethode is.",
      adminUsername: "Gebruikersnaam van het beheerdersaccount",
      adminPassword: "Wachtwoord van het beheerdersaccount",
      adminPasswordReq: "Wachtwoorden moeten minimaal 8 tekens lang zijn.",
      teamHint:
        "Standaard bent u de enige beheerder. Zodra de onboarding is voltooid, kunt u gebruikers of beheerders aanmaken en anderen uitnodigen. Raak uw wachtwoord niet kwijt, want alleen beheerders kunnen wachtwoorden opnieuw instellen.",
    },
    data: {
      title: "Gegevensverwerking en privacy",
      description:
        "Wij streven naar transparantie en controle als het gaat om uw persoonlijke gegevens.",
      settingsHint:
        "Deze instellingen kunnen op elk moment opnieuw worden geconfigureerd in de instellingen.",
    },
    workspace: {
      title: "Maak je eerste werkruimte aan",
      description:
        "Maak je eerste werkruimte aan en ga aan de slag met AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Werkruimten Naam",
    error: "fout",
    success: "succes",
    user: "Gebruiker",
    selection: "Model Selectie",
    saving: "Opslaan...",
    save: "Wijzigingen opslaan",
    previous: "Vorige pagina",
    next: "Volgende pagina",
    optional: "Optioneel",
    yes: "Ja",
    no: "Nee",
    search: "Zoeken",
    username_requirements:
      "De gebruikersnaam moet 2-32 tekens bevatten, beginnen met een kleine letter en mag alleen kleine letters, cijfers, underscores, koppeltekens en punten bevatten.",
  },
  settings: {
    title: "Instelling Instanties",
    system: "Algemene Instellingen",
    invites: "Uitnodigingen",
    users: "Gebruikers",
    workspaces: "Werkruimten",
    "workspace-chats": "Werkruimte Chats",
    customization: "Aanpassing",
    "api-keys": "Ontwikkelaar API",
    llm: "LLM",
    transcription: "Transcriptie",
    embedder: "Inbedder",
    "text-splitting": "Tekst Splitsen & Chunking",
    "voice-speech": "Stem & Spraak",
    "vector-database": "Vector Database",
    embeds: "Chat Inbedden",
    "embed-chats": "Ingebedde Chat Geschiedenis",
    security: "Veiligheid",
    "event-logs": "Gebeurtenislogboeken",
    privacy: "Privacy & Gegevens",
    "ai-providers": "AI Providers",
    "agent-skills": "Agent Vaardigheden",
    admin: "Beheerder",
    tools: "Hulpmiddelen",
    "experimental-features": "Experimentele Functies",
    contact: "Contact Ondersteuning",
    "browser-extension": "Browser Extensie",
    "system-prompt-variables": "Systeempromptvariabelen",
    interface: "UI-voorkeuren",
    branding: "Branding & Whitelabeling",
    chat: "Chat",
    "mobile-app": "AnythingLLM Mobiele App",
  },
  login: {
    "multi-user": {
      welcome: "Welkom bij",
      "placeholder-username": "Gebruikersnaam",
      "placeholder-password": "Wachtwoord",
      login: "Inloggen",
      validating: "Bezig met valideren...",
      "forgot-pass": "Wachtwoord vergeten",
      reset: "Reset",
    },
    "sign-in": "Meld je aan bij je {{appName}} account.",
    "password-reset": {
      title: "Wachtwoord Resetten",
      description:
        "Geef de benodigde informatie hieronder om je wachtwoord te resetten.",
      "recovery-codes": "Herstelcodes",
      "recovery-code": "Herstelcode {{index}}",
      "back-to-login": "Terug naar Inloggen",
    },
  },
  "new-workspace": {
    title: "Nieuwe Werkruimte",
    placeholder: "Mijn Werkruimte",
  },
  "workspaces—settings": {
    general: "Algemene Instellingen",
    chat: "Chat Instellingen",
    vector: "Vector Database",
    members: "Leden",
    agent: "Agent Configuratie",
  },
  general: {
    vector: {
      title: "Vector Teller",
      description: "Totaal aantal vectoren in je vector database.",
    },
    names: {
      description: "Dit zal alleen de weergavenaam van je werkruimte wijzigen.",
    },
    message: {
      title: "Voorgestelde Chatberichten",
      description:
        "Pas de berichten aan die aan je werkruimtegebruikers worden voorgesteld.",
      add: "Nieuw bericht toevoegen",
      save: "Berichten opslaan",
      heading: "Leg me uit",
      body: "de voordelen van AnythingLLM",
    },
    pfp: {
      title: "Assistent Profielfoto",
      description:
        "Pas de profielfoto van de assistent voor deze werkruimte aan.",
      image: "Werkruimte Afbeelding",
      remove: "Werkruimte Afbeelding Verwijderen",
    },
    delete: {
      title: "Werkruimte Verwijderen",
      description:
        "Verwijder deze werkruimte en al zijn gegevens. Dit zal de werkruimte voor alle gebruikers verwijderen.",
      delete: "Werkruimte Verwijderen",
      deleting: "Werkruimte Verwijderen...",
      "confirm-start": "Je staat op het punt je gehele",
      "confirm-end":
        "werkruimte te verwijderen. Dit zal alle vector inbeddingen in je vector database verwijderen.\n\nDe originele bronbestanden blijven onaangetast. Deze actie is onomkeerbaar.",
    },
  },
  chat: {
    llm: {
      title: "Werkruimte LLM Provider",
      description:
        "De specifieke LLM-provider en -model die voor deze werkruimte zal worden gebruikt. Standaard wordt de systeem LLM-provider en instellingen gebruikt.",
      search: "Zoek alle LLM-providers",
    },
    model: {
      title: "Werkruimte Chatmodel",
      description:
        "Het specifieke chatmodel dat voor deze werkruimte zal worden gebruikt. Indien leeg, wordt de systeem LLM-voorkeur gebruikt.",
      wait: "-- wachten op modellen --",
    },
    mode: {
      title: "Chatmodus",
      chat: {
        title: "Chat",
        "desc-start": "zal antwoorden geven met de algemene kennis van de LLM",
        and: "en",
        "desc-end": "documentcontext die wordt gevonden.",
      },
      query: {
        title: "Query",
        "desc-start": "zal antwoorden geven",
        only: "alleen",
        "desc-end": "als documentcontext wordt gevonden.",
      },
    },
    history: {
      title: "Chatgeschiedenis",
      "desc-start":
        "Het aantal vorige chats dat in het kortetermijngeheugen van de reactie wordt opgenomen.",
      recommend: "Aanbevolen 20. ",
      "desc-end":
        "Alles meer dan 45 leidt waarschijnlijk tot continue chatfouten, afhankelijk van de berichtgrootte.",
    },
    prompt: {
      title: "Prompt",
      description:
        "De prompt die in deze werkruimte zal worden gebruikt. Definieer de context en instructies voor de AI om een reactie te genereren. Je moet een zorgvuldig samengestelde prompt geven zodat de AI een relevante en nauwkeurige reactie kan genereren.",
      history: {
        title: "Geschiedenis van systeemprompts",
        clearAll: "Alles wissen",
        noHistory: "Geen geschiedenis van systeemprompts beschikbaar",
        restore: "Herstellen",
        delete: "Verwijderen",
        deleteConfirm:
          "Weet u zeker dat u dit geschiedenisitem wilt verwijderen?",
        clearAllConfirm:
          "Weet u zeker dat u alle geschiedenis wilt wissen? Deze actie kan niet ongedaan worden gemaakt.",
        expand: "Uitbreiden",
        publish: "Publiceren naar Community Hub",
      },
    },
    refusal: {
      title: "Afwijzingsreactie in Querymodus",
      "desc-start": "Wanneer in",
      query: "query",
      "desc-end":
        "modus, wil je wellicht een aangepaste afwijzingsreactie geven wanneer er geen context wordt gevonden.",
      "tooltip-title": "Waarom zie ik dit?",
      "tooltip-description":
        "U bevindt zich in de querymodus, die alleen informatie uit uw documenten gebruikt. Schakel over naar de chatmodus voor flexibelere gesprekken, of klik hier om onze documentatie te raadplegen voor meer informatie over chatmodi.",
    },
    temperature: {
      title: "LLM Temperatuur",
      "desc-start":
        'Deze instelling bepaalt hoe "creatief" je LLM-antwoorden zullen zijn.',
      "desc-end":
        "Hoe hoger het getal, hoe creatiever. Voor sommige modellen kan dit leiden tot onsamenhangende antwoorden als het te hoog wordt ingesteld.",
      hint: "De meeste LLM's hebben verschillende acceptabele reeksen van geldige waarden. Raadpleeg je LLM-provider voor die informatie.",
    },
  },
  "vector-workspace": {
    identifier: "Vector database-identificator",
    snippets: {
      title: "Maximale Contextfragmenten",
      description:
        "Deze instelling bepaalt het maximale aantal contextfragmenten dat per chat of query naar de LLM wordt verzonden.",
      recommend: "Aanbevolen: 4",
    },
    doc: {
      title: "Document gelijkenisdrempel",
      description:
        "De minimale gelijkenisscore die vereist is voor een bron om als gerelateerd aan de chat te worden beschouwd. Hoe hoger het getal, hoe meer vergelijkbaar de bron moet zijn met de chat.",
      zero: "Geen beperking",
      low: "Laag (gelijkenisscore ≥ .25)",
      medium: "Middel (gelijkenisscore ≥ .50)",
      high: "Hoog (gelijkenisscore ≥ .75)",
    },
    reset: {
      reset: "Vector Database Resetten",
      resetting: "Vectoren wissen...",
      confirm:
        "Je staat op het punt de vector database van deze werkruimte te resetten. Dit zal alle momenteel ingebedde vectoren verwijderen.\n\nDe originele bronbestanden blijven onaangetast. Deze actie is onomkeerbaar.",
      error: "Werkruimte vector database kon niet worden gereset!",
      success: "Werkruimte vector database is gereset!",
    },
  },
  agent: {
    "performance-warning":
      "De prestaties van LLM's die geen tool-aanroep expliciet ondersteunen, zijn sterk afhankelijk van de capaciteiten en nauwkeurigheid van het model. Sommige vaardigheden kunnen beperkt of niet-functioneel zijn.",
    provider: {
      title: "Werkruimte Agent LLM Provider",
      description:
        "De specifieke LLM-provider en -model die voor het @agent-agent van deze werkruimte zal worden gebruikt.",
    },
    mode: {
      chat: {
        title: "Werkruimte Agent Chatmodel",
        description:
          "Het specifieke chatmodel dat zal worden gebruikt voor het @agent-agent van deze werkruimte.",
      },
      title: "Werkruimte Agentmodel",
      description:
        "Het specifieke LLM-model dat voor het @agent-agent van deze werkruimte zal worden gebruikt.",
      wait: "-- wachten op modellen --",
    },
    skill: {
      title: "Standaard agentvaardigheden",
      description:
        "Verbeter de natuurlijke vaardigheden van de standaardagent met deze vooraf gebouwde vaardigheden. Deze opstelling is van toepassing op alle werkruimten.",
      rag: {
        title: "RAG & langetermijngeheugen",
        description:
          'Sta de agent toe om je lokale documenten te gebruiken om een vraag te beantwoorden of vraag de agent om stukken inhoud "te onthouden" voor langetermijngeheugenopslag.',
      },
      view: {
        title: "Documenten bekijken & samenvatten",
        description:
          "Sta de agent toe om de inhoud van momenteel ingebedde werkruimtebestanden op te sommen en samen te vatten.",
      },
      scrape: {
        title: "Websites schrapen",
        description:
          "Sta de agent toe om de inhoud van websites te bezoeken en te schrapen.",
      },
      generate: {
        title: "Grafieken genereren",
        description:
          "Sta de standaardagent toe om verschillende soorten grafieken te genereren uit verstrekte of in de chat gegeven gegevens.",
      },
      save: {
        title: "Genereren & opslaan van bestanden naar browser",
        description:
          "Sta de standaardagent toe om te genereren en te schrijven naar bestanden die worden opgeslagen en kunnen worden gedownload in je browser.",
      },
      web: {
        title: "Live web zoeken en browsen",
        "desc-start":
          "Sta je agent toe om het web te doorzoeken om je vragen te beantwoorden door verbinding te maken met een web-zoek (SERP) provider.",
        "desc-end":
          "Webzoeken tijdens agentensessies zal niet werken totdat dit is ingesteld.",
      },
    },
  },
  recorded: {
    title: "Werkruimte Chats",
    description:
      "Dit zijn alle opgenomen chats en berichten die door gebruikers zijn verzonden, gerangschikt op hun aanmaakdatum.",
    export: "Exporteren",
    table: {
      id: "Id",
      by: "Verzonden Door",
      workspace: "Werkruimte",
      prompt: "Prompt",
      response: "Response",
      at: "Verzonden Om",
    },
  },
  api: {
    title: "API-sleutels",
    description:
      "API-sleutels stellen de houder in staat om deze AnythingLLM-instantie programmatisch te openen en beheren.",
    link: "Lees de API-documentatie",
    generate: "Genereer Nieuwe API-sleutel",
    table: {
      key: "API-sleutel",
      by: "Aangemaakt Door",
      created: "Aangemaakt",
    },
  },
  llm: {
    title: "LLM Voorkeur",
    description:
      "Dit zijn de inloggegevens en instellingen voor je voorkeurs LLM-chat & inbeddingprovider. Het is belangrijk dat deze sleutels actueel en correct zijn, anders zal AnythingLLM niet goed werken.",
    provider: "LLM Provider",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure Service Endpoint",
        api_key: "API Key",
        chat_deployment_name: "Chat Deployment Naam",
        chat_model_token_limit: "Chat Model Token Limiet",
        model_type: "Model Type",
        default: "Standaard",
        reasoning: "Redeneren",
        model_type_tooltip:
          "Als uw implementatie een redeneermodel gebruikt (o1, o1-mini, o3-mini, enz.), stel dit dan in op 'Redeneren'. Anders kunnen uw chatverzoeken mislukken.",
      },
    },
  },
  transcription: {
    title: "Transcriptiemodel Voorkeur",
    description:
      "Dit zijn de inloggegevens en instellingen voor je voorkeurs transcriptiemodelprovider. Het is belangrijk dat deze sleutels actueel en correct zijn, anders worden media en audio niet getranscribeerd.",
    provider: "Transcriptieprovider",
    "warn-start":
      "Het gebruik van het lokale fluistermodel op machines met beperkte RAM of CPU kan AnythingLLM vertragen bij het verwerken van mediabestanden.",
    "warn-recommend":
      "We raden minstens 2GB RAM aan en upload bestanden <10Mb.",
    "warn-end":
      "Het ingebouwde model wordt automatisch gedownload bij het eerste gebruik.",
  },
  embedding: {
    title: "Inbedding Voorkeur",
    "desc-start":
      "Bij het gebruik van een LLM die geen ingebouwde ondersteuning voor een inbeddingengine heeft, moet je mogelijk aanvullende inloggegevens opgeven voor het inbedden van tekst.",
    "desc-end":
      "Inbedding is het proces van het omzetten van tekst in vectoren. Deze inloggegevens zijn vereist om je bestanden en prompts om te zetten naar een formaat dat AnythingLLM kan gebruiken om te verwerken.",
    provider: {
      title: "Inbedding Provider",
    },
  },
  text: {
    title: "Tekst Splitsen & Chunking Voorkeuren",
    "desc-start":
      "Soms wil je misschien de standaard manier wijzigen waarop nieuwe documenten worden gesplitst en gechunkt voordat ze in je vector database worden ingevoerd.",
    "desc-end":
      "Je moet deze instelling alleen wijzigen als je begrijpt hoe tekstsplitsing werkt en de bijbehorende effecten.",
    size: {
      title: "Tekst Chunk Grootte",
      description:
        "Dit is de maximale lengte van tekens die aanwezig kan zijn in een enkele vector.",
      recommend: "Inbed model maximale lengte is",
    },
    overlap: {
      title: "Tekst Chunk Overlap",
      description:
        "Dit is de maximale overlap van tekens die optreedt tijdens het chunking tussen twee aangrenzende tekstchunks.",
    },
  },
  vector: {
    title: "Vector Database",
    description:
      "Dit zijn de inloggegevens en instellingen voor hoe je AnythingLLM-instantie zal functioneren. Het is belangrijk dat deze sleutels actueel en correct zijn.",
    provider: {
      title: "Vector Database Provider",
      description: "Er is geen configuratie nodig voor LanceDB.",
    },
  },
  embeddable: {
    title: "Inbedbare Chat Widgets",
    description:
      "Inbedbare chatwidgets zijn openbare chatinterfaces die zijn gekoppeld aan een enkele werkruimte. Hiermee kun je werkruimten bouwen die je vervolgens kunt publiceren naar de wereld.",
    create: "Maak inbedding",
    table: {
      workspace: "Werkruimte",
      chats: "Verzonden Chats",
      active: "Actieve Domeinen",
      created: "Aangemaakt",
    },
  },
  "embed-chats": {
    title: "Inbedding Chats",
    export: "Exporteren",
    description:
      "Dit zijn alle opgenomen chats en berichten van elke inbedding die je hebt gepubliceerd.",
    table: {
      embed: "Inbedding",
      sender: "Afzender",
      message: "Bericht",
      response: "Reactie",
      at: "Verzonden Om",
    },
  },
  event: {
    title: "Gebeurtenislogboeken",
    description:
      "Bekijk alle acties en gebeurtenissen die op deze instantie plaatsvinden voor monitoring.",
    clear: "Gebeurtenislogboeken Wissen",
    table: {
      type: "Gebeurtenistype",
      user: "Gebruiker",
      occurred: "Opgetreden Op",
    },
  },
  privacy: {
    title: "Privacy & Gegevensverwerking",
    description:
      "Dit is je configuratie voor hoe verbonden derden en AnythingLLM je gegevens verwerken.",
    llm: "LLM Selectie",
    embedding: "Inbedding Voorkeur",
    vector: "Vector Database",
    anonymous: "Anonieme Telemetrie Ingeschakeld",
  },
  connectors: {
    "search-placeholder": "Zoek naar data-connectoren",
    "no-connectors": "Geen data-connectoren gevonden.",
    github: {
      name: "GitHub-repository",
      description:
        "Importeer een volledige openbare of privé GitHub-repository met één klik.",
      URL: "URL van de GitHub-repository",
      URL_explained: "URL van de GitHub-repository die u wilt verzamelen.",
      token: "GitHub-toegangstoken",
      optional: "optioneel",
      token_explained: "Toegangstoken om rate limiting te voorkomen.",
      token_explained_start: "Zonder een ",
      token_explained_link1: "Persoonlijk toegangstoken",
      token_explained_middle:
        ", kan de GitHub API het aantal bestanden dat kan worden verzameld beperken vanwege rate limiting. U kunt ",
      token_explained_link2: "een tijdelijk toegangstoken aanmaken",
      token_explained_end: " om dit probleem te voorkomen.",
      ignores: "Bestanden die genegeerd worden",
      git_ignore:
        "Lijst in .gitignore-indeling om specifieke bestanden te negeren tijdens het verzamelen. Druk op Enter na elke vermelding die u wilt opslaan.",
      task_explained:
        "Zodra de taak is voltooid, zijn alle bestanden beschikbaar om in te sluiten in werkruimtes in de documentkiezer.",
      branch: "De branch waarvan u bestanden wilt verzamelen.",
      branch_loading: "-- beschikbare branches laden --",
      branch_explained: "De branch waarvan u bestanden wilt verzamelen.",
      token_information:
        "Zonder het invullen van het <b>GitHub-toegangstoken</b> kan deze dataconnector alleen de <b>top-level</b> bestanden van de repository verzamelen vanwege de limieten voor het aantal aanvragen via de openbare API van GitHub.",
      token_personal:
        "Vraag hier een gratis persoonlijk toegangstoken aan met een GitHub-account.",
    },
    gitlab: {
      name: "GitLab-repository",
      description:
        "Importeer een volledige openbare of privé GitLab-repository met één klik.",
      URL: "URL van de GitLab-repository",
      URL_explained: "URL van de GitLab-repository die u wilt verzamelen.",
      token: "GitLab-toegangstoken",
      optional: "optioneel",
      token_explained: "Toegangstoken om rate limiting te voorkomen.",
      token_description:
        "Selecteer extra entiteiten om op te halen via de GitLab API.",
      token_explained_start: "Zonder een ",
      token_explained_link1: "Persoonlijk toegangstoken",
      token_explained_middle:
        ", kan de GitLab API het aantal bestanden dat kan worden verzameld beperken vanwege rate limiting. U kunt ",
      token_explained_link2: "een tijdelijk toegangstoken aanmaken",
      token_explained_end: " om dit probleem te voorkomen.",
      fetch_issues: "Problemen ophalen als documenten",
      ignores: "Bestanden negeren",
      git_ignore:
        "Lijst in  .gitignore-formaat om specifieke bestanden te negeren tijdens het verzamelen. Druk op Enter na elke vermelding die u wilt opslaan.",
      task_explained:
        "Zodra de taak is voltooid, zijn alle bestanden beschikbaar om in te sluiten in werkruimtes in de documentkiezer.",
      branch: "Branch waarvan u bestanden wilt verzamelen",
      branch_loading: "-- beschikbare branches laden --",
      branch_explained: "Branch waarvan u bestanden wilt verzamelen.",
      token_information:
        "Zonder het invullen van het <b>GitLab-toegangstoken</b> kan deze dataconnector alleen de <b>top-level</b> bestanden van de repository verzamelen vanwege de limieten voor het aantal aanvragen via de openbare GitLab API.",
      token_personal:
        "Vraag hier een gratis persoonlijk toegangstoken aan met een GitLab-account.",
    },
    youtube: {
      name: "YouTube-transcriptie",
      description:
        "Importeer de transcriptie van een volledige YouTube-video via een link.",
      URL: "URL van de YouTube-video",
      URL_explained_start:
        "Voer de URL van een YouTube-video in om de transcriptie ervan op te halen. De video moet ",
      URL_explained_link: "ondertiteling hebben en",
      URL_explained_end: "beschikbaar zijn.",
      task_explained:
        "Zodra de transcriptie is voltooid, kan deze worden ingesloten in werkruimtes in de documentkiezer.",
      language: "Transcriptietaal",
      language_explained:
        "Selecteer de taal van de transcriptie die u wilt verzamelen.",
      loading_languages: "-- beschikbare talen laden --",
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description:
        "Schraap een website en de bijbehorende sublinks tot een bepaalde diepte.",
      URL: "URL van de website",
      URL_explained: "URL van de website die u wilt schrapen.",
      depth: "Crawldiepte",
      depth_explained:
        "Dit is het aantal sublinks dat de tool vanaf de oorspronkelijke URL moet volgen.",
      max_pages: "Maximum aantal pagina's",
      max_pages_explained: "Maximum aantal links om te schrapen.",
      task_explained:
        "Zodra de taak is voltooid, is alle geschraapte inhoud beschikbaar om in te sluiten in werkruimtes in de documentkiezer.",
    },
    confluence: {
      name: "Confluence",
      description: "Importeer een volledige Confluence-pagina met één klik.",
      deployment_type: "Confluence-implementatietype",
      deployment_type_explained:
        "Bepaal of uw Confluence-instantie wordt gehost in de Atlassian-cloud of zelf gehost.",
      base_url: "Confluence-basis-URL",
      base_url_explained: "Dit is de basis-URL van uw Confluence-ruimte.",
      space_key: "Confluence-spacesleutel",
      space_key_explained:
        "Dit is de spacesleutel van uw Confluence-instantie die zal worden gebruikt. Begint meestal met ~",
      username: "Confluence-gebruikersnaam",
      username_explained: "Uw Confluence-gebruikersnaam",
      auth_type: "Confluence-authenticatietype",
      auth_type_explained:
        "Selecteer het authenticatietype dat u wilt gebruiken om toegang te krijgen tot uw Confluence-pagina's.",
      auth_type_username: "Gebruikersnaam en toegangstoken",
      auth_type_personal: "Persoonlijk toegangstoken",
      token: "Confluence-toegangstoken",
      token_explained_start:
        "U moet een toegangstoken opgeven voor authenticatie. U kunt ",
      token_explained_link: "hier",
      token_desc: " een toegangstoken genereren voor authenticatie",
      pat_token: "Persoonlijk Confluence-toegangstoken",
      pat_token_explained: "Uw persoonlijke Confluence-toegangstoken.",
      task_explained:
        "Zodra de taak is voltooid, is de pagina-inhoud beschikbaar om in te sluiten in werkruimtes in de documentkiezer.",
      bypass_ssl: "SSL-certificaatvalidatie overslaan",
      bypass_ssl_explained:
        "Schakel deze optie in om SSL-certificaatvalidatie te omzeilen voor zelfgehoste Confluence-instanties met een zelfondertekend certificaat",
    },
    manage: {
      documents: "Documenten",
      "data-connectors": "Gegevensconnectoren",
      "desktop-only":
        "Het bewerken van deze instellingen is alleen mogelijk op een desktopapparaat. Ga naar deze pagina op uw desktop om verder te gaan.",
      dismiss: "Afwijzen",
      editing: "Bewerken",
    },
    directory: {
      "my-documents": "Mijn documenten",
      "new-folder": "Nieuwe map",
      "search-document": "Zoek naar een document",
      "no-documents": "Geen documenten",
      "move-workspace": "Verplaatsen naar werkruimte",
      name: "Naam",
      "delete-confirmation":
        "Weet u zeker dat u deze bestanden en mappen wilt verwijderen?\nHiermee worden de bestanden automatisch uit het systeem en alle bestaande werkruimten verwijderd.\nDeze actie is niet onomkeerbaar.",
      "removing-message":
        "{{count}} documenten en {{folderCount}} mappen worden verwijderd. Even geduld alstublieft.",
      "move-success": "{{count}} documenten succesvol verplaatst.",
      date: "Datum",
      type: "Type",
      no_docs: "Geen documenten",
      select_all: "Alles selecteren",
      deselect_all: "Alles deselecteren",
      remove_selected: "Verwijderen Geselecteerd",
      costs: "*Eenmalige kosten voor embedden",
      save_embed: "Opslaan en embedden",
    },
    upload: {
      "processor-offline": "Documentverwerker niet beschikbaar",
      "processor-offline-desc":
        "We kunnen uw bestanden momenteel niet uploaden omdat de documentverwerker offline is. Probeer het later opnieuw.",
      "click-upload": "Klik om te uploaden of sleep en laat vallen",
      "file-types":
        "Ondersteunt tekstbestanden, csv's, spreadsheets, audiobestanden en meer!",
      "or-submit-link": "Of dien een link in",
      "placeholder-link": "https://example.com",
      fetching: "Bezig met ophalen...",
      "fetch-website": "Website ophalen",
      "privacy-notice":
        "Deze bestanden worden geüpload naar de documentverwerker die op deze AnythingLLM-instantie draait. Deze bestanden worden niet verzonden naar of gedeeld met derden.",
    },
    pinning: {
      what_pinning: "Wat is het vastzetten van documenten?",
      pin_explained_block1:
        "Wanneer u een document vastzet in AnythingLLM, injecteren we de volledige inhoud van het document in uw promptvenster, zodat uw LLM het volledig kan begrijpen.",
      pin_explained_block2:
        "Dit werkt het beste met modellen met een grote context of kleine bestanden die essentieel zijn voor de kennisbasis.",
      pin_explained_block3:
        "Als u standaard niet de gewenste antwoorden krijgt van AnythingLLM, is vastzetten een uitstekende manier om met één klik antwoorden van hogere kwaliteit te krijgen.",
      accept: "Oké, begrepen.",
    },
    watching: {
      what_watching: "Wat doet het volgen van een document?",
      watch_explained_block1:
        "Wanneer u een document in AnythingLLM volgt, synchroniseren we de inhoud van uw document automatisch met regelmatige tussenpozen vanuit de originele bron. Hierdoor wordt de inhoud in elke werkruimte waar dit bestand wordt beheerd automatisch bijgewerkt.",
      watch_explained_block2:
        "Deze functie ondersteunt momenteel online content en is niet beschikbaar voor handmatig geüploade documenten.",
      watch_explained_block3_start:
        "U kunt beheren welke documenten worden gevolgd vanuit de ",
      watch_explained_block3_link: "Bestandsbeheer",
      watch_explained_block3_end: " beheerdersweergave.",
      accept: "Oké, begrepen",
    },
    obsidian: {
      name: "Obsidian",
      description: "Importeer een Obsidian-kluis met één klik.",
      vault_location: "Locatie van de kluis",
      vault_description:
        "Selecteer uw Obsidian-kluismap om alle notities en hun koppelingen te importeren.",
      selected_files: "{{count}} markdown-bestanden gevonden",
      importing: "Kluis importeren...",
      import_vault: "Kluis importeren",
      processing_time:
        "Dit kan even duren, afhankelijk van de grootte van uw kluis.",
      vault_warning:
        "Zorg ervoor dat uw Obsidian-kluis niet geopend is om conflicten te voorkomen.",
    },
  },
  chat_window: {
    welcome: "Welkom in je nieuwe werkruimte.",
    get_started: "Om te beginnen, of",
    get_started_default: "Om te beginnen",
    upload: "Een document uploaden",
    or: "of",
    send_chat: "Een chatbericht verzenden.",
    send_message: "Een bericht verzenden",
    attach_file: "Een bestand aan deze chat toevoegen",
    slash: "Alle beschikbare slash-opdrachten voor chatten bekijken.",
    agents:
      "Alle beschikbare agents bekijken die je kunt gebruiken om te chatten.",
    text_size: "Tekstgrootte wijzigen.",
    microphone: "Spreek je prompt uit.",
    send: "Promptbericht naar werkruimte verzenden",
    attachments_processing:
      "Bijlagen worden verwerkt. Even geduld alstublieft...",
    tts_speak_message: "TTS-spreekbericht",
    copy: "Kopiëren",
    regenerate: "Opnieuw genereren",
    regenerate_response: "Reactie opnieuw genereren",
    good_response: "Goede reactie",
    more_actions: "Meer acties",
    hide_citations: "Citaten verbergen",
    show_citations: "Citaten weergeven",
    pause_tts_speech_message: "TTS-spraak van bericht pauzeren",
    fork: "Fork",
    delete: "Verwijderen",
    save_submit: "Opslaan en verzenden",
    cancel: "Annuleren",
    edit_prompt: "Prompt bewerken",
    edit_response: "Reactie bewerken",
    at_agent: "@agent",
    default_agent_description: " - de standaardagent voor deze werkruimte.",
    custom_agents_coming_soon: "Aangepaste agenten komen binnenkort!",
    slash_reset: "/reset",
    preset_reset_description:
      "Wis je chatgeschiedenis en begin een nieuwe chat",
    add_new_preset: "Nieuwe preset toevoegen",
    command: "Commando",
    your_command: "jouw-commando",
    placeholder_prompt: "Dit is de inhoud die wordt ingevoegd voor je prompt.",
    description: "Beschrijving",
    placeholder_description: "Reageert met een gedicht over LLM's.",
    save: "Opslaan",
    small: "Klein",
    normal: "Normaal",
    large: "Groot",
    workspace_llm_manager: {
      search: "Zoek naar LLM-aanbieders",
      loading_workspace_settings: "Werkruimte-instellingen laden...",
      available_models: "Beschikbare modellen voor {{provider}}",
      available_models_description: "Selecteer een model voor deze werkruimte.",
      save: "Gebruik dit model",
      saving: "Model instellen als standaard voor de werkruimte...",
      missing_credentials: "Deze aanbieder mist logingegevens!",
      missing_credentials_description: "Klik om logingegevens in te stellen",
    },
  },
  profile_settings: {
    edit_account: "Account bewerken",
    profile_picture: "Profielafbeelding",
    remove_profile_picture: "Profielafbeelding verwijderen",
    username: "Gebruikersnaam",
    new_password: "Nieuw wachtwoord",
    password_description: "Wachtwoord moet minimaal 8 tekens lang zijn",
    cancel: "Annuleren",
    update_account: "Account bijwerken",
    theme: "Themavoorkeur",
    language: "Voorkeurstaal",
    failed_upload: "Uploaden van profielafbeelding mislukt: {{error}}",
    upload_success: "Profielafbeelding geüpload.",
    failed_remove: "Verwijderen van profielafbeelding mislukt: {{error}}",
    profile_updated: "Profiel bijgewerkt.",
    failed_update_user: "Gebruiker bijwerken mislukt: {{error}}",
    account: "Account",
    support: "Ondersteuning",
    signout: "Afmelden",
  },
  customization: {
    interface: {
      title: "UI-voorkeuren",
      description: "Stel uw UI-voorkeuren in voor AnythingLLM.",
    },
    branding: {
      title: "Branding & Whitelabeling",
      description:
        "Geef uw AnythingLLM-instantie een whitelabel met uw eigen branding.",
    },
    chat: {
      title: "Chat",
      description: "Stel uw chatvoorkeuren in voor AnythingLLM.",
      auto_submit: {
        title: "Spraakinvoer automatisch verzenden",
        description:
          "Verzend spraakinvoer automatisch na een periode van stilte",
      },
      auto_speak: {
        title: "Antwoorden automatisch uitspreken",
        description: "Spreek antwoorden van de AI automatisch uit",
      },
      spellcheck: {
        title: "Spellingscontrole inschakelen",
        description:
          "Schakel de spellingscontrole in of uit in het chatinvoerveld",
      },
    },
    items: {
      theme: {
        title: "Thema",
        description: "Selecteer uw favoriete kleurenthema voor de applicatie.",
      },
      "show-scrollbar": {
        title: "Scrollbalk weergeven",
        description: "Schakel de scrollbalk in of uit in het chatvenster.",
      },
      "support-email": {
        title: "E-mailadres voor ondersteuning",
        description:
          "Stel het e-mailadres voor ondersteuning in dat toegankelijk moet zijn voor gebruikers wanneer ze hulp nodig hebben.",
      },
      "app-name": {
        title: "Naam",
        description:
          "Stel een naam in die op de inlogpagina voor alle gebruikers wordt weergegeven.",
      },
      "chat-message-alignment": {
        title: "Uitlijning van chatberichten",
        description:
          "Selecteer de uitlijningsmodus voor berichten bij gebruik van de chatinterface.",
      },
      "display-language": {
        title: "Weergavetaal",
        description:
          "Selecteer de gewenste taal waarin de gebruikersinterface van AnythingLLM moet worden weergegeven - wanneer vertalingen beschikbaar zijn.",
      },
      logo: {
        title: "Merklogo",
        description: "Upload uw eigen logo om op alle pagina's te tonen.",
        add: "Voeg een eigen logo toe",
        recommended: "Aanbevolen formaat: 800 x 200",
        remove: "Verwijderen",
        replace: "Vervangen",
      },
      "welcome-messages": {
        title: "Welkomstberichten",
        description:
          "Pas de welkomstberichten aan die aan uw gebruikers worden getoond. Alleen niet-beheerders zien deze berichten.",
        new: "Nieuw",
        system: "systeem",
        user: "gebruiker",
        message: "bericht",
        assistant: "AnythingLLM Chatassistent",
        "double-click": "Dubbelklik om te bewerken...",
        save: "Berichten opslaan",
      },
      "browser-appearance": {
        title: "Browserweergave",
        description:
          "Pas de weergave van het browsertabblad en de titel aan wanneer de app is geopend.",
        tab: {
          title: "Titel",
          description:
            "Stel een aangepaste tabtitel in wanneer de app in een browser wordt geopend.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Gebruik een aangepaste favicon voor het browsertabblad.",
        },
      },
      "sidebar-footer": {
        title: "Voettekst items in de zijbalk",
        description:
          "Pas de voettekst items aan die onderaan de zijbalk worden weergegeven.",
        icon: "Pictogram",
        link: "Link",
      },
      "render-html": {
        title: "HTML weergeven in chat",
        description:
          "HTML-reacties weergeven in assistentreacties.\nLet op: Dit kan resulteren in een veel hogere kwaliteit van de reacties, maar kan ook leiden tot potentiële beveiligingsrisico's.",
      },
    },
  },
  "main-page": {
    noWorkspaceError: "Maak een werkruimte aan voordat u een chat start.",
    checklist: {
      title: "Aan de slag",
      tasksLeft: "resterende taken",
      completed: "U bent op weg om een ​​AnythingLLM-expert te worden!",
      dismiss: "sluiten",
      tasks: {
        create_workspace: {
          title: "Een werkruimte aanmaken",
          description: "Maak uw eerste werkruimte aan om te beginnen",
          action: "Aanmaken",
        },
        send_chat: {
          title: "Een chatbericht verzenden",
          description: "Start een gesprek met uw AI-assistent",
          action: "Chatten",
        },
        embed_document: {
          title: "Een document embedden",
          description: "Voeg uw eerste document toe aan uw werkruimte",
          action: "Embedden",
        },
        setup_system_prompt: {
          title: "Een systeemprompt instellen",
          description: "Configureer het gedrag van uw AI-assistent",
          action: "Instellen",
        },
        define_slash_command: {
          title: "Definieer een slash-opdracht",
          description: "Maak aangepaste opdrachten voor je assistent",
          action: "Definieer",
        },
        visit_community: {
          title: "Bezoek de communityhub",
          description: "Verken communitybronnen en -sjablonen",
          action: "Bladeren",
        },
      },
    },
    quickLinks: {
      title: "Snelle links",
      sendChat: "Chat verzenden",
      embedDocument: "Een document embedden",
      createWorkspace: "Werkruimte maken",
    },
    exploreMore: {
      title: "Meer functies ontdekken",
      features: {
        customAgents: {
          title: "Aangepaste AI-agenten",
          description:
            "Bouw krachtige AI-agenten en automatiseringen zonder code.",
          primaryAction: "Chatten met @agent",
          secondaryAction: "Een agentflow bouwen",
        },
        slashCommands: {
          title: "Slash-opdrachten",
          description:
            "Bespaar tijd en voeg prompts toe met aangepaste slash-opdrachten.",
          primaryAction: "Een slash-opdracht maken",
          secondaryAction: "Verkennen op Hub",
        },
        systemPrompts: {
          title: "Systeemprompts",
          description:
            "Wijzig de systeemprompt om de AI-antwoorden van een werkruimte aan te passen.",
          primaryAction: "Een systeemprompt wijzigen",
          secondaryAction: "Promptvariabelen beheren",
        },
      },
    },
    announcements: {
      title: "Updates & aankondigingen",
    },
    resources: {
      title: "Bronnen",
      links: {
        docs: "Documentatie",
        star: "Ster op Github",
      },
      keyboardShortcuts: "Sneltoetsen",
    },
  },
  "keyboard-shortcuts": {
    title: "Sneltoetsen",
    shortcuts: {
      settings: "Instellingen openen",
      workspaceSettings: "Huidige werkruimte-instellingen openen",
      home: "Naar de startpagina gaan",
      workspaces: "Werkruimtes beheren",
      apiKeys: "Instellingen voor API-sleutels",
      llmPreferences: "LLM-voorkeuren",
      chatSettings: "Chat-instellingen",
      help: "Help voor toetsenbordsneltoetsen weergeven",
      showLLMSelector: "LLM-selector voor werkruimtes weergeven",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Geslaagd!",
        success_description:
          "Uw systeemprompt is gepubliceerd op de Community Hub!",
        success_thank_you: "Bedankt voor het delen met de community!",
        view_on_hub: "Bekijken op Community Hub",
        modal_title: "Systeemprompt publiceren",
        name_label: "Naam",
        name_description: "Dit is de weergavenaam van je systeemprompt.",
        name_placeholder: "Mijn systeemprompt",
        description_label: "Beschrijving",
        description_description:
          "Dit is de beschrijving van je systeemprompt. Gebruik dit om het doel van je systeemprompt te beschrijven.",
        tags_label: "Tags",
        tags_description:
          "Tags worden gebruikt om je systeemprompt te labelen voor gemakkelijker zoeken. Je kunt meerdere tags toevoegen. Maximaal 5 tags. Maximaal 20 tekens per tag.",
        tags_placeholder: "Typ en druk op Enter om tags toe te voegen",
        visibility_label: "Zichtbaarheid",
        public_description:
          "Openbare systeemprompts zijn voor iedereen zichtbaar.",
        private_description:
          "Privé systeemprompts zijn alleen voor jou zichtbaar.",
        publish_button: "Publiceren naar Community Hub",
        submitting: "Publiceren...",
        submit: "Publiceren naar Community Hub",
        prompt_label: "Prompt",
        prompt_description:
          "Dit is de daadwerkelijke systeemprompt die gebruikt zal worden om de LLM te begeleiden.",
        prompt_placeholder: "Voer hier uw systeemprompt in...",
      },
      agent_flow: {
        public_description: "Openbare agentflows zijn voor iedereen zichtbaar.",
        private_description: "Privé agentflows zijn alleen voor jou zichtbaar.",
        success_title: "Succes!",
        success_description:
          "Je agentflow is gepubliceerd op de Community Hub!",
        success_thank_you: "Bedankt voor het delen met de community!",
        view_on_hub: "Bekijk op de Community Hub",
        modal_title: "Agentflow publiceren",
        name_label: "Naam",
        name_description: "Dit is de weergavenaam van je agentflow.",
        name_placeholder: "Mijn agentflow",
        description_label: "Beschrijving",
        description_description:
          "Dit is de beschrijving van je agentflow. Gebruik dit om het doel van je agentflow te beschrijven.",
        tags_label: "Tags",
        tags_description:
          "Tags worden gebruikt om je agentflow te labelen voor eenvoudiger zoeken. Je kunt meerdere tags toevoegen. Maximaal 5 tags. Maximaal 20 tekens per tag.",
        tags_placeholder: "Typ en druk op Enter om tags toe te voegen",
        visibility_label: "Zichtbaarheid",
        publish_button: "Publiceren naar Community Hub",
        submitting: "Publiceren...",
        submit: "Publiceren naar Community Hub",
        privacy_note:
          "Agentflows worden altijd als privé geüpload om gevoelige gegevens te beschermen. U kunt de zichtbaarheid in de Community Hub wijzigen na publicatie. Controleer of uw flow geen gevoelige of privé-informatie bevat voordat u publiceert.",
      },
      generic: {
        unauthenticated: {
          title: "Authenticatie vereist",
          description:
            "U moet zich authenticeren bij de AnythingLLM Community Hub voordat u items kunt publiceren.",
          button: "Verbinden met Community Hub",
        },
      },
      slash_command: {
        success_title: "Succes!",
        success_description:
          "Je slash-commando is gepubliceerd op de Community Hub!",
        success_thank_you: "Bedankt voor het delen met de community!",
        view_on_hub: "Bekijk op de Community Hub",
        modal_title: "Slash-commando publiceren",
        name_label: "Naam",
        name_description: "Dit is de weergavenaam van je slash-commando.",
        name_placeholder: "Mijn slash-commando",
        description_label: "Beschrijving",
        description_description:
          "Dit is de beschrijving van je slash-commando. Gebruik dit om het doel van je slash-commando te beschrijven.",
        command_label: "Commando",
        command_description:
          "Dit is het slash-commando dat gebruikers moeten typen om deze preset te activeren.",
        command_placeholder: "mijn-commando",
        tags_label: "Tags",
        tags_description:
          "Tags worden gebruikt om je slash-commando te labelen voor eenvoudiger zoeken. Je kunt meerdere tags toevoegen. Max 5 tags. Maximaal 20 tekens per tag.",
        tags_placeholder: "Typ en druk op Enter om tags toe te voegen",
        visibility_label: "Zichtbaarheid",
        public_description:
          "Openbare slash-opdrachten zijn voor iedereen zichtbaar.",
        private_description:
          "Privé slash-opdrachten zijn alleen voor jou zichtbaar.",
        publish_button: "Publiceren naar Community Hub",
        submitting: "Publiceren...",
        prompt_label: "Prompt",
        prompt_description:
          "Dit is de prompt die wordt gebruikt wanneer de slash-opdracht wordt geactiveerd.",
        prompt_placeholder: "Voer hier je prompt in...",
      },
    },
  },
  security: {
    title: "Veiligheid",
    multiuser: {
      title: "Multi-Gebruikersmodus",
      description:
        "Stel je instantie in om je team te ondersteunen door Multi-Gebruikersmodus in te schakelen.",
      enable: {
        "is-enable": "Multi-Gebruikersmodus is Ingeschakeld",
        enable: "Schakel Multi-Gebruikersmodus In",
        description:
          "Standaard ben je de enige beheerder. Als beheerder moet je accounts aanmaken voor alle nieuwe gebruikers of beheerders. Verlies je wachtwoord niet, want alleen een beheerdersgebruiker kan wachtwoorden resetten.",
        username: "Beheerdersaccount gebruikersnaam",
        password: "Beheerdersaccount wachtwoord",
      },
    },
    password: {
      title: "Wachtwoordbeveiliging",
      description:
        "Bescherm je AnythingLLM-instantie met een wachtwoord. Als je dit vergeet, is er geen herstelmethode, dus zorg ervoor dat je dit wachtwoord opslaat.",
      "password-label": "Instances wachtwoord",
    },
  },
  home: {
    welcome: "Welkom",
    chooseWorkspace: "Kies een werkruimte om te beginnen!",
    notAssigned:
      "Je bent nog niet toegewezen aan een werkruimte.\nNeem contact op met je beheerder om toegang te vragen tot een werkruimte.",
    goToWorkspace: 'Ga naar de werkruimte "{{workspace}}"',
  },
};

export default TRANSLATIONS;
