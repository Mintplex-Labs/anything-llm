// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: null,
      useCase: null,
      useCaseWork: null,
      useCasePersonal: null,
      useCaseOther: null,
      comment: null,
      commentPlaceholder: null,
      skip: null,
      thankYou: null,
      title: null,
      description: null,
    },
    home: {
      title: null,
      getStarted: null,
    },
    llm: {
      title: null,
      description: null,
    },
    userSetup: {
      title: null,
      description: null,
      howManyUsers: null,
      justMe: null,
      myTeam: null,
      instancePassword: null,
      setPassword: null,
      passwordReq: null,
      passwordWarn: null,
      adminUsername: null,
      adminUsernameReq: null,
      adminPassword: null,
      adminPasswordReq: null,
      teamHint: null,
    },
    data: {
      title: null,
      description: null,
      settingsHint: null,
    },
    workspace: {
      title: null,
      description: null,
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
    optional: null,
    yes: null,
    no: null,
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
    "sign-in": {
      start: "Meld je aan bij je",
      end: "account.",
    },
    "password-reset": {
      title: "Wachtwoord Resetten",
      description:
        "Geef de benodigde informatie hieronder om je wachtwoord te resetten.",
      "recovery-codes": "Herstelcodes",
      "recovery-code": "Herstelcode {{index}}",
      "back-to-login": "Terug naar Inloggen",
    },
  },
  welcomeMessage: {
    part1:
      "Welkom bij AnythingLLM, AnythingLLM is een open-source AI-tool van Mintplex Labs die alles omzet in een getrainde chatbot waarmee je kunt vragen en chatten. AnythingLLM is een BYOK (bring-your-own-keys) software, dus er is geen abonnement, vergoeding of kosten voor deze software buiten de diensten die je ermee wilt gebruiken.",
    part2:
      "AnythingLLM is de eenvoudigste manier om krachtige AI-producten zoals OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB en andere diensten samen te voegen in een net pakket zonder gedoe om je productiviteit met 100x te verhogen.",
    part3:
      "AnythingLLM kan volledig lokaal op je machine draaien met weinig overhead, je merkt niet eens dat het er is! Geen GPU nodig. Cloud en on-premises installatie is ook beschikbaar.\nHet AI-tooling ecosysteem wordt elke dag krachtiger. AnythingLLM maakt het gemakkelijk te gebruiken.",
    githubIssue: "Maak een probleem aan op GitHub",
    user1: "Hoe kan ik beginnen?",
    part4:
      "Het is simpel. Alle verzamelingen zijn georganiseerd in buckets die we \"Werkruimten\" noemen. Werkruimten zijn buckets van bestanden, documenten, afbeeldingen, PDF's en andere bestanden die worden omgezet in iets wat LLM's kunnen begrijpen en gebruiken in gesprekken.\n\nJe kunt op elk moment bestanden toevoegen en verwijderen.",
    createWorkspace: "Maak je eerste werkruimte",
    user2:
      "Is dit als een AI-dropbox of zoiets? Hoe zit het met chatten? Het is toch een chatbot?",
    part5:
      "AnythingLLM is meer dan een slimmere Dropbox.\n\nAnythingLLM biedt twee manieren om met je gegevens te praten:\n\n<i>Query:</i> Je chats zullen gegevens of inferenties retourneren die zijn gevonden met de documenten in je werkruimte waar het toegang toe heeft. Meer documenten toevoegen aan de Werkruimte maakt het slimmer! \n\n<i>Conversational:</i> Je documenten + je lopende chatgeschiedenis dragen beide tegelijkertijd bij aan de LLM-kennis. Geweldig voor het toevoegen van realtime tekstgebaseerde informatie of correcties en misverstanden die de LLM kan hebben. \n\nJe kunt tijdens het chatten tussen beide modi schakelen \n<i>in het midden van de chat!</i>",
    user3: "Wauw, dit klinkt geweldig, laat me het al proberen!",
    part6: "Veel Plezier!",
    starOnGitHub: "Ster op GitHub",
    contact: "Contact Mintplex Labs",
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
    },
    refusal: {
      title: "Afwijzingsreactie in Querymodus",
      "desc-start": "Wanneer in",
      query: "query",
      "desc-end":
        "modus, wil je wellicht een aangepaste afwijzingsreactie geven wanneer er geen context wordt gevonden.",
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
  appearance: {
    title: "Verschijning",
    description: "Pas de verschijningsinstellingen van je platform aan.",
    logo: {
      title: "Logo Aanpassen",
      description: "Upload je aangepaste logo om je chatbot eigen te maken.",
      add: "Voeg een aangepast logo toe",
      recommended: "Aanbevolen grootte: 800 x 200",
      remove: "Verwijderen",
      replace: "Vervangen",
    },
    message: {
      title: "Berichten Aanpassen",
      description:
        "Pas de automatische berichten aan die aan je gebruikers worden weergegeven.",
      new: "Nieuw",
      system: "systeem",
      user: "gebruiker",
      message: "bericht",
      assistant: "AnythingLLM Chat Assistent",
      "double-click": "Dubbelklik om te bewerken...",
      save: "Berichten Opslaan",
    },
    icons: {
      title: "Aangepaste Voettekstpictogrammen",
      description:
        "Pas de voettekstpictogrammen aan die onder aan de zijbalk worden weergegeven.",
      icon: "Pictogram",
      link: "Link",
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
      description:
        "Er is geen instelling vereist bij gebruik van de ingebouwde inbeddingengine van AnythingLLM.",
    },
  },
  text: {
    title: "Tekst Splitsen & Chunking Voorkeuren",
    "desc-start":
      "Soms wil je misschien de standaard manier wijzigen waarop nieuwe documenten worden gesplitst en gechunkt voordat ze in je vector database worden ingevoerd.",
    "desc-end":
      "Je moet deze instelling alleen wijzigen als je begrijpt hoe tekstsplitsing werkt en de bijbehorende effecten.",
    "warn-start": "Wijzigingen hier zijn alleen van toepassing op",
    "warn-center": "nieuw ingebedde documenten",
    "warn-end": ", niet op bestaande documenten.",
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
      Active: "Actieve Domeinen",
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
  multi: {
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
    password: {
      title: "Wachtwoordbeveiliging",
      description:
        "Bescherm je AnythingLLM-instantie met een wachtwoord. Als je dit vergeet, is er geen herstelmethode, dus zorg ervoor dat je dit wachtwoord opslaat.",
    },
    instance: {
      title: "Instantie Wachtwoord Beveiligen",
      description:
        "Standaard ben je de enige beheerder. Als beheerder moet je accounts aanmaken voor alle nieuwe gebruikers of beheerders. Verlies je wachtwoord niet, want alleen een beheerdersgebruiker kan wachtwoorden resetten.",
      password: "Instantie wachtwoord",
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
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    github: {
      name: "GitHub Repo",
      description:
        "Import an entire public or private Github repository in a single click.",
      URL: "GitHub Repo URL",
      URL_explained: "Url of the GitHub repo you wish to collect.",
      token: "Github Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", the GitHub API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      ignores: "File Ignores",
      git_ignore:
        "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained:
        "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from.",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information:
        "Without filling out the <b>Github Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitHub's public API rate-limits.",
      token_personal:
        "Get a free Personal Access Token with a GitHub account here.",
    },
    gitlab: {
      name: "GitLab Repo",
      description:
        "Import an entire public or private GitLab repository in a single click.",
      URL: "GitLab Repo URL",
      URL_explained: "URL of the GitLab repo you wish to collect.",
      token: "GitLab Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_description:
        "Select additional entities to fetch from the GitLab API.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", the GitLab API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      fetch_issues: "Fetch Issues as Documents",
      ignores: "File Ignores",
      git_ignore:
        "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained:
        "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information:
        "Without filling out the <b>GitLab Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitLab's public API rate-limits.",
      token_personal:
        "Get a free Personal Access Token with a GitLab account here.",
    },
    youtube: {
      name: "YouTube Transcript",
      description:
        "Import the transcription of an entire YouTube video from a link.",
      URL: "YouTube Video URL",
      URL_explained_start:
        "Enter the URL of any YouTube video to fetch its transcript. The video must have ",
      URL_explained_link: "closed captions",
      URL_explained_end: " available.",
      task_explained:
        "Once complete, the transcript will be available for embedding into workspaces in the document picker.",
      language: "Transcript Language",
      language_explained:
        "Select the language of the transcript you want to collect.",
      loading_languages: "-- loading available languages --",
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description: "Scrape a website and its sub-links up to a certain depth.",
      URL: "Website URL",
      URL_explained: "URL of the website you want to scrape.",
      depth: "Crawl Depth",
      depth_explained:
        "This is the number of child-links that the worker should follow from the origin URL.",
      max_pages: "Maximum Pages",
      max_pages_explained: "Maximum number of links to scrape.",
      task_explained:
        "Once complete, all scraped content will be available for embedding into workspaces in the document picker.",
    },
    confluence: {
      name: "Confluence",
      description: "Import an entire Confluence page in a single click.",
      deployment_type: "Confluence deployment type",
      deployment_type_explained:
        "Determine if your Confluence instance is hosted on Atlassian cloud or self-hosted.",
      base_url: "Confluence base URL",
      base_url_explained: "This is the base URL of your Confluence space.",
      space_key: "Confluence space key",
      space_key_explained:
        "This is the spaces key of your confluence instance that will be used. Usually begins with ~",
      username: "Confluence Username",
      username_explained: "Your Confluence username.",
      token: "Confluence API Token",
      token_explained_start: "A ",
      token_explained_link1: "Personal API Token",
      token_explained_middle:
        " is required to access Confluence pages. You can ",
      token_explained_link2: "create an API Token here",
      token_explained_end: ".",
      token_desc: "Access token for authentication.",
      task_explained:
        "Once complete, the page content will be available for embedding into workspaces in the document picker.",
    },

    manage: {
      documents: "Documents",
      "data-connectors": "Data Connectors",
      "desktop-only":
        "Editing these settings are only available on a desktop device. Please access this page on your desktop to continue.",
      dismiss: "Dismiss",
      editing: "Editing",
    },
    directory: {
      "my-documents": "My Documents",
      "new-folder": "New Folder",
      "search-document": "Search for document",
      "no-documents": "No Documents",
      "move-workspace": "Move to Workspace",
      name: "Name",
      "delete-confirmation":
        "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible.",
      "removing-message":
        "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Successfully moved {{count}} documents.",
      date: "Date",
      type: "Type",
      no_docs: "No Documents",
      select_all: "Select All",
      deselect_all: "Deselect All",
      remove_selected: "Remove Selected",
      costs: "*One time cost for embeddings",
      save_embed: "Save and Embed",
    },
    upload: {
      "processor-offline": "Document Processor Unavailable",
      "processor-offline-desc":
        "We can't upload your files right now because the document processor is offline. Please try again later.",
      "click-upload": "Click to upload or drag and drop",
      "file-types":
        "supports text files, csv's, spreadsheets, audio files, and more!",
      "or-submit-link": "or submit a link",
      "placeholder-link": "https://example.com",
      fetching: "Fetching...",
      "fetch-website": "Fetch website",
      "privacy-notice":
        "These files will be uploaded to the document processor running on this AnythingLLM instance. These files are not sent or shared with a third party.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1:
        "When you <b>pin</b> a document in AnythingLLM we will inject the entire content of the document into your prompt window for your LLM to fully comprehend.",
      pin_explained_block2:
        "This works best with <b>large-context models</b> or small files that are critical to its knowledge-base.",
      pin_explained_block3:
        "If you are not getting the answers you desire from AnythingLLM by default then pinning is a great way to get higher quality answers in a click.",
      accept: "Okay, got it",
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1:
        "When you <b>watch</b> a document in AnythingLLM we will <i>automatically</i> sync your document content from it's original source on regular intervals. This will automatically update the content in every workspace where this file is managed.",
      watch_explained_block2:
        "This feature currently supports online-based content and will not be available for manually uploaded documents.",
      watch_explained_block3_start:
        "You can manage what documents are watched from the ",
      watch_explained_block3_link: "File manager",
      watch_explained_block3_end: " admin view.",
      accept: "Okay, got it",
    },
  },

  chat_window: {
    welcome: "Welcome to your new workspace.",
    get_started: "To get started either",
    get_started_default: "To get started",
    upload: "upload a document",
    or: "or",
    send_chat: "send a chat.",
    send_message: "Send a message",
    attach_file: "Attach a file to this chat",
    slash: "View all available slash commands for chatting.",
    agents: "View all available agents you can use for chatting.",
    text_size: "Change text size.",
    microphone: "Speak your prompt.",
    send: "Send prompt message to workspace",
  },

  profile_settings: {
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_description:
      "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
    new_password: "New Password",
    passwort_description: "Password must be at least 8 characters long",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Theme Preference",
    language: "Preferred language",
  },
};

export default TRANSLATIONS;
