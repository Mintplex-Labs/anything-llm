const TRANSLATIONS = {
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
  },

  // Setting Sidebar menu items.
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

  // Page Definitions
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
    githubIssue: "Maak een probleem aan op Github",
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
    starOnGithub: "Ster op GitHub",
    contact: "Contact Mintplex Labs",
  },

  "new-workspace": {
    title: "Nieuwe Werkruimte",
    placeholder: "Mijn Werkruimte",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "Algemene Instellingen",
    chat: "Chat Instellingen",
    vector: "Vector Database",
    members: "Leden",
    agent: "Agent Configuratie",
  },

  // General Appearance
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

  // Chat Settings
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

  // Vector Database
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

  // Agent Configuration
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

  // Workspace Chats
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

  // Appearance
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

  // API Keys
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

  // Vector Database
  vector: {
    title: "Vector Database",
    description:
      "Dit zijn de inloggegevens en instellingen voor hoe je AnythingLLM-instantie zal functioneren. Het is belangrijk dat deze sleutels actueel en correct zijn.",
    provider: {
      title: "Vector Database Provider",
      description: "Er is geen configuratie nodig voor LanceDB.",
    },
  },

  // Embeddable Chat Widgets
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

  // Event Logs
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

  // Privacy & Data-Handling
  privacy: {
    title: "Privacy & Gegevensverwerking",
    description:
      "Dit is je configuratie voor hoe verbonden derden en AnythingLLM je gegevens verwerken.",
    llm: "LLM Selectie",
    embedding: "Inbedding Voorkeur",
    vector: "Vector Database",
    anonymous: "Anonieme Telemetrie Ingeschakeld",
  },
};

export default TRANSLATIONS;
