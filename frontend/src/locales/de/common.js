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
    "workspaces-name": "Name der Arbeitsbereiche",
    error: "Fehler",
    success: "Erfolg",
    user: "Benutzer",
    selection: "Modellauswahl",
    saving: "Speichern...",
    save: "Änderungen speichern",
    previous: "Vorherige Seite",
    next: "Nächste Seite",
    optional: null,
    yes: null,
    no: null,
  },
  settings: {
    title: "Instanzeinstellungen",
    system: "Allgemeine Einstellungen",
    invites: "Einladungen",
    users: "Benutzer",
    workspaces: "Arbeitsbereiche",
    "workspace-chats": "Arbeitsbereich-Chats",
    customization: "Anpassung",
    "api-keys": "Entwickler-API",
    llm: "LLM",
    transcription: "Transkription",
    embedder: "Einbettung",
    "text-splitting": "Textsplitting & Chunking",
    "voice-speech": "Sprache & Sprachausgabe",
    "vector-database": "Vektordatenbank",
    embeds: "Chat-Einbettung",
    "embed-chats": "Chat-Einbettungsverlauf",
    security: "Sicherheit",
    "event-logs": "Ereignisprotokolle",
    privacy: "Datenschutz & Datenverarbeitung",
    "ai-providers": "KI-Anbieter",
    "agent-skills": "Agentenfähigkeiten",
    admin: "Administrator",
    tools: "Werkzeuge",
    "experimental-features": "Experimentelle Funktionen",
    contact: "Support kontaktieren",
    "browser-extension": "Browser-Erweiterung",
    "system-prompt-variables": null,
    interface: null,
    branding: null,
    chat: null,
  },
  login: {
    "multi-user": {
      welcome: "Willkommen bei",
      "placeholder-username": "Benutzername",
      "placeholder-password": "Passwort",
      login: "Anmelden",
      validating: "Überprüfung...",
      "forgot-pass": "Passwort vergessen",
      reset: "Zurücksetzen",
    },
    "sign-in": {
      start: "Melden Sie sich bei Ihrem",
      end: "Konto an.",
    },
    "password-reset": {
      title: "Passwort zurücksetzen",
      description:
        "Geben Sie die erforderlichen Informationen unten ein, um Ihr Passwort zurückzusetzen.",
      "recovery-codes": "Wiederherstellungscodes",
      "recovery-code": "Wiederherstellungscode {{index}}",
      "back-to-login": "Zurück zur Anmeldung",
    },
  },
  welcomeMessage: {
    part1:
      "Willkommen bei AnythingLLM, AnythingLLM ist ein Open-Source-KI-Tool von Mintplex Labs, das alles in einen trainierten Chatbot verwandelt, den Sie abfragen und mit dem Sie chatten können. AnythingLLM ist eine BYOK-Software (Bring-Your-Own-Keys), daher gibt es keine Abonnements, Gebühren oder Kosten für diese Software außerhalb der Dienste, die Sie damit nutzen möchten.",
    part2:
      "AnythingLLM ist der einfachste Weg, leistungsstarke KI-Produkte wie OpenAI, GPT-4, LangChain, PineconeDB, ChromaDB und andere Dienste in einem übersichtlichen Paket ohne Aufwand zusammenzufassen, um Ihre Produktivität um das 100-fache zu steigern.",
    part3:
      "AnythingLLM kann vollständig lokal auf Ihrem Computer mit geringem Overhead laufen - Sie werden nicht einmal bemerken, dass es da ist! Keine GPU erforderlich. Cloud- und On-Premises-Installation ist ebenfalls verfügbar.\nDas KI-Tool-Ökosystem wird jeden Tag leistungsfähiger. AnythingLLM macht es einfach, es zu nutzen.",
    githubIssue: "Erstellen Sie ein Problem auf GitHub",
    user1: "Wie fange ich an?!",
    part4:
      'Es ist einfach. Alle Sammlungen sind in Behältern organisiert, die wir "Arbeitsbereiche" nennen. Arbeitsbereiche sind Behälter für Dateien, Dokumente, Bilder, PDFs und andere Dateien, die in etwas umgewandelt werden, das LLMs verstehen und in Gesprächen verwenden können.\n\nSie können jederzeit Dateien hinzufügen und entfernen.',
    createWorkspace: "Erstellen Sie Ihren ersten Arbeitsbereich",
    user2:
      "Ist das so eine Art KI-Dropbox oder so? Was ist mit dem Chatten? Es ist doch ein Chatbot, oder?",
    part5:
      "AnythingLLM ist mehr als eine intelligentere Dropbox.\n\nAnythingLLM bietet zwei Möglichkeiten, mit Ihren Daten zu sprechen:\n\n<i>Abfrage:</i> Ihre Chats geben Daten oder Schlussfolgerungen zurück, die in den Dokumenten Ihres Arbeitsbereichs gefunden wurden, auf die es Zugriff hat. Je mehr Dokumente Sie dem Arbeitsbereich hinzufügen, desto intelligenter wird er! \n\n<i>Konversation:</i> Ihre Dokumente + Ihr laufender Chat-Verlauf tragen gleichzeitig zum LLM-Wissen bei. Großartig für das Anhängen von Echtzeit-Textinformationen oder Korrekturen und Missverständnissen, die das LLM haben könnte. \n\nSie können zwischen beiden Modi wechseln \n<i>mitten im Chatten!</i>",
    user3: "Wow, das klingt erstaunlich, lass es mich gleich ausprobieren!",
    part6: "Viel Spaß!",
    starOnGitHub: "Stern auf GitHub",
    contact: "Kontaktieren Sie Mintplex Labs",
  },
  "new-workspace": {
    title: "Neuer Arbeitsbereich",
    placeholder: "Mein Arbeitsbereich",
  },
  "workspaces—settings": {
    general: "Allgemeine Einstellungen",
    chat: "Chat-Einstellungen",
    vector: "Vektordatenbank",
    members: "Mitglieder",
    agent: "Agentenkonfiguration",
  },
  general: {
    vector: {
      title: "Vektoranzahl",
      description: "Gesamtanzahl der Vektoren in Ihrer Vektordatenbank.",
    },
    names: {
      description: "Dies ändert nur den Anzeigenamen Ihres Arbeitsbereichs.",
    },
    message: {
      title: "Vorgeschlagene Chat-Nachrichten",
      description:
        "Passen Sie die Nachrichten an, die Ihren Arbeitsbereich-Benutzern vorgeschlagen werden.",
      add: "Neue Nachricht hinzufügen",
      save: "Nachrichten speichern",
      heading: "Erkläre mir",
      body: "die Vorteile von AnythingLLM",
    },
    pfp: {
      title: "Assistent-Profilbild",
      description:
        "Passen Sie das Profilbild des Assistenten für diesen Arbeitsbereich an.",
      image: "Arbeitsbereich-Bild",
      remove: "Arbeitsbereich-Bild entfernen",
    },
    delete: {
      title: "Arbeitsbereich löschen",
      description:
        "Löschen Sie diesen Arbeitsbereich und alle seine Daten. Dies löscht den Arbeitsbereich für alle Benutzer.",
      delete: "Arbeitsbereich löschen",
      deleting: "Arbeitsbereich wird gelöscht...",
      "confirm-start": "Sie sind dabei, Ihren gesamten",
      "confirm-end":
        "Arbeitsbereich zu löschen. Dies entfernt alle Vektoreinbettungen in Ihrer Vektordatenbank.\n\nDie ursprünglichen Quelldateien bleiben unberührt. Diese Aktion ist irreversibel.",
    },
  },
  chat: {
    llm: {
      title: "Arbeitsbereich-LLM-Anbieter",
      description:
        "Der spezifische LLM-Anbieter und das Modell, das für diesen Arbeitsbereich verwendet wird. Standardmäßig wird der System-LLM-Anbieter und dessen Einstellungen verwendet.",
      search: "Durchsuchen Sie alle LLM-Anbieter",
    },
    model: {
      title: "Arbeitsbereich-Chat-Modell",
      description:
        "Das spezifische Chat-Modell, das für diesen Arbeitsbereich verwendet wird. Wenn leer, wird die System-LLM-Präferenz verwendet.",
      wait: "-- warte auf Modelle --",
    },
    mode: {
      title: "Chat-Modus",
      chat: {
        title: "Chat",
        "desc-start": "wird Antworten mit dem allgemeinen Wissen des LLM",
        and: "und",
        "desc-end": "gefundenem Dokumentenkontext liefern.",
      },
      query: {
        title: "Abfrage",
        "desc-start": "wird Antworten",
        only: "nur",
        "desc-end": "liefern, wenn Dokumentenkontext gefunden wird.",
      },
    },
    history: {
      title: "Chat-Verlauf",
      "desc-start":
        "Die Anzahl der vorherigen Chats, die in das Kurzzeitgedächtnis der Antwort einbezogen werden.",
      recommend: "Empfohlen 20. ",
      "desc-end":
        "Alles über 45 führt wahrscheinlich zu kontinuierlichen Chat-Ausfällen, abhängig von der Nachrichtengröße.",
    },
    prompt: {
      title: "Prompt",
      description:
        "Der Prompt, der in diesem Arbeitsbereich verwendet wird. Definieren Sie den Kontext und die Anweisungen für die KI, um eine Antwort zu generieren. Sie sollten einen sorgfältig formulierten Prompt bereitstellen, damit die KI eine relevante und genaue Antwort generieren kann.",
      history: {
        title: null,
        clearAll: null,
        noHistory: null,
        restore: null,
        delete: null,
        deleteConfirm: null,
        clearAllConfirm: null,
        expand: null,
      },
    },
    refusal: {
      title: "Abfragemodus-Ablehnungsantwort",
      "desc-start": "Wenn im",
      query: "Abfrage",
      "desc-end":
        "modus, möchten Sie vielleicht eine benutzerdefinierte Ablehnungsantwort zurückgeben, wenn kein Kontext gefunden wird.",
    },
    temperature: {
      title: "LLM-Temperatur",
      "desc-start":
        'Diese Einstellung steuert, wie "kreativ" Ihre LLM-Antworten sein werden.',
      "desc-end":
        "Je höher die Zahl, desto kreativer. Bei einigen Modellen kann dies zu unverständlichen Antworten führen, wenn sie zu hoch eingestellt ist.",
      hint: "Die meisten LLMs haben verschiedene akzeptable Bereiche gültiger Werte. Konsultieren Sie Ihren LLM-Anbieter für diese Informationen.",
    },
  },
  "vector-workspace": {
    identifier: "Vektordatenbank-Identifikator",
    snippets: {
      title: "Maximale Kontext-Snippets",
      description:
        "Diese Einstellung steuert die maximale Anzahl von Kontext-Snippets, die pro Chat oder Abfrage an das LLM gesendet werden.",
      recommend: "Empfohlen: 4",
    },
    doc: {
      title: "Dokumentähnlichkeitsschwelle",
      description:
        "Der minimale Ähnlichkeitswert, der erforderlich ist, damit eine Quelle als relevant für den Chat betrachtet wird. Je höher die Zahl, desto ähnlicher muss die Quelle dem Chat sein.",
      zero: "Keine Einschränkung",
      low: "Niedrig (Ähnlichkeitswert ≥ .25)",
      medium: "Mittel (Ähnlichkeitswert ≥ .50)",
      high: "Hoch (Ähnlichkeitswert ≥ .75)",
    },
    reset: {
      reset: "Vektordatenbank zurücksetzen",
      resetting: "Vektoren werden gelöscht...",
      confirm:
        "Sie sind dabei, die Vektordatenbank dieses Arbeitsbereichs zurückzusetzen. Dies entfernt alle derzeit eingebetteten Vektoreinbettungen.\n\nDie ursprünglichen Quelldateien bleiben unberührt. Diese Aktion ist irreversibel.",
      error:
        "Die Arbeitsbereich-Vektordatenbank konnte nicht zurückgesetzt werden!",
      success: "Die Arbeitsbereich-Vektordatenbank wurde zurückgesetzt!",
    },
  },
  agent: {
    "performance-warning":
      "Die Leistung von LLMs, die Werkzeugaufrufe nicht explizit unterstützen, hängt stark von den Fähigkeiten und der Genauigkeit des Modells ab. Einige Fähigkeiten können eingeschränkt oder nicht funktionsfähig sein.",
    provider: {
      title: "Arbeitsbereich-Agent LLM-Anbieter",
      description:
        "Der spezifische LLM-Anbieter und das Modell, das für den @agent-Agenten dieses Arbeitsbereichs verwendet wird.",
    },
    mode: {
      chat: {
        title: "Arbeitsbereich-Agent Chat-Modell",
        description:
          "Das spezifische Chat-Modell, das für den @agent-Agenten dieses Arbeitsbereichs verwendet wird.",
      },
      title: "Arbeitsbereich-Agent-Modell",
      description:
        "Das spezifische LLM-Modell, das für den @agent-Agenten dieses Arbeitsbereichs verwendet wird.",
      wait: "-- warte auf Modelle --",
    },
    skill: {
      title: "Standard-Agentenfähigkeiten",
      description:
        "Verbessern Sie die natürlichen Fähigkeiten des Standard-Agenten mit diesen vorgefertigten Fähigkeiten. Diese Einrichtung gilt für alle Arbeitsbereiche.",
      rag: {
        title: "RAG & Langzeitgedächtnis",
        description:
          'Erlauben Sie dem Agenten, Ihre lokalen Dokumente zu nutzen, um eine Abfrage zu beantworten oder bitten Sie den Agenten, Inhalte für den Langzeitabruf zu "merken".',
      },
      view: {
        title: "Dokumente anzeigen & zusammenfassen",
        description:
          "Erlauben Sie dem Agenten, den Inhalt der aktuell eingebetteten Arbeitsbereichsdateien aufzulisten und zusammenzufassen.",
      },
      scrape: {
        title: "Websites durchsuchen",
        description:
          "Erlauben Sie dem Agenten, Websites zu besuchen und deren Inhalt zu extrahieren.",
      },
      generate: {
        title: "Diagramme generieren",
        description:
          "Aktivieren Sie den Standard-Agenten, um verschiedene Arten von Diagrammen aus bereitgestellten oder im Chat gegebenen Daten zu generieren.",
      },
      save: {
        title: "Dateien generieren & im Browser speichern",
        description:
          "Aktivieren Sie den Standard-Agenten, um Dateien zu generieren und zu schreiben, die gespeichert und in Ihrem Browser heruntergeladen werden können.",
      },
      web: {
        title: "Live-Websuche und -Browsing",
        "desc-start":
          "Ermöglichen Sie Ihrem Agenten, das Web zu durchsuchen, um Ihre Fragen zu beantworten, indem Sie eine Verbindung zu einem Websuche-Anbieter (SERP) herstellen.",
        "desc-end":
          "Die Websuche während Agentensitzungen funktioniert erst, wenn dies eingerichtet ist.",
      },
    },
  },
  recorded: {
    title: "Arbeitsbereich-Chats",
    description:
      "Dies sind alle aufgezeichneten Chats und Nachrichten, die von Benutzern gesendet wurden, geordnet nach ihrem Erstellungsdatum.",
    export: "Exportieren",
    table: {
      id: "Id",
      by: "Gesendet von",
      workspace: "Arbeitsbereich",
      prompt: "Prompt",
      response: "Antwort",
      at: "Gesendet am",
    },
  },
  api: {
    title: "API-Schlüssel",
    description:
      "API-Schlüssel ermöglichen es dem Besitzer, programmatisch auf diese AnythingLLM-Instanz zuzugreifen und sie zu verwalten.",
    link: "Lesen Sie die API-Dokumentation",
    generate: "Neuen API-Schlüssel generieren",
    table: {
      key: "API-Schlüssel",
      by: "Erstellt von",
      created: "Erstellt",
    },
  },
  llm: {
    title: "LLM-Präferenz",
    description:
      "Dies sind die Anmeldeinformationen und Einstellungen für Ihren bevorzugten LLM-Chat- und Einbettungsanbieter. Es ist wichtig, dass diese Schlüssel aktuell und korrekt sind, sonst wird AnythingLLM nicht richtig funktionieren.",
    provider: "LLM-Anbieter",
  },
  transcription: {
    title: "Transkriptionsmodell-Präferenz",
    description:
      "Dies sind die Anmeldeinformationen und Einstellungen für Ihren bevorzugten Transkriptionsmodellanbieter. Es ist wichtig, dass diese Schlüssel aktuell und korrekt sind, sonst werden Mediendateien und Audio nicht transkribiert.",
    provider: "Transkriptionsanbieter",
    "warn-start":
      "Die Verwendung des lokalen Whisper-Modells auf Maschinen mit begrenztem RAM oder CPU kann AnythingLLM bei der Verarbeitung von Mediendateien zum Stillstand bringen.",
    "warn-recommend":
      "Wir empfehlen mindestens 2 GB RAM und das Hochladen von Dateien <10 MB.",
    "warn-end":
      "Das eingebaute Modell wird bei der ersten Verwendung automatisch heruntergeladen.",
  },
  embedding: {
    title: "Einbettungspräferenz",
    "desc-start":
      "Bei der Verwendung eines LLM, das keine native Unterstützung für eine Einbettungs-Engine bietet, müssen Sie möglicherweise zusätzlich Anmeldeinformationen für die Texteinbettung angeben.",
    "desc-end":
      "Einbettung ist der Prozess, Text in Vektoren umzuwandeln. Diese Anmeldeinformationen sind erforderlich, um Ihre Dateien und Prompts in ein Format umzuwandeln, das AnythingLLM zur Verarbeitung verwenden kann.",
    provider: {
      title: "Einbettungsanbieter",
      description:
        "Bei Verwendung der nativen Einbettungs-Engine von AnythingLLM ist keine Einrichtung erforderlich.",
    },
  },
  text: {
    title: "Textsplitting & Chunking-Präferenzen",
    "desc-start":
      "Manchmal möchten Sie vielleicht die Standardmethode ändern, wie neue Dokumente gesplittet und gechunkt werden, bevor sie in Ihre Vektordatenbank eingefügt werden.",
    "desc-end":
      "Sie sollten diese Einstellung nur ändern, wenn Sie verstehen, wie Textsplitting funktioniert und welche Nebenwirkungen es hat.",
    "warn-start": "Änderungen hier gelten nur für",
    "warn-center": "neu eingebettete Dokumente",
    "warn-end": ", nicht für bestehende Dokumente.",
    size: {
      title: "Textchunk-Größe",
      description:
        "Dies ist die maximale Länge der Zeichen, die in einem einzelnen Vektor vorhanden sein können.",
      recommend: "Die maximale Länge des Einbettungsmodells beträgt",
    },
    overlap: {
      title: "Textchunk-Überlappung",
      description:
        "Dies ist die maximale Überlappung von Zeichen, die während des Chunkings zwischen zwei benachbarten Textchunks auftritt.",
    },
  },
  vector: {
    title: "Vektordatenbank",
    description:
      "Dies sind die Anmeldeinformationen und Einstellungen für die Funktionsweise Ihrer AnythingLLM-Instanz. Es ist wichtig, dass diese Schlüssel aktuell und korrekt sind.",
    provider: {
      title: "Vektordatenbankanbieter",
      description: "Für LanceDB ist keine Konfiguration erforderlich.",
    },
  },
  embeddable: {
    title: "Einbettbare Chat-Widgets",
    description:
      "Einbettbare Chat-Widgets sind öffentlich zugängliche Chat-Schnittstellen, die an einen einzelnen Arbeitsbereich gebunden sind. Diese ermöglichen es Ihnen, Arbeitsbereiche zu erstellen, die Sie dann weltweit veröffentlichen können.",
    create: "Einbettung erstellen",
    table: {
      workspace: "Arbeitsbereich",
      chats: "Gesendete Chats",
      Active: "Aktive Domains",
    },
  },
  "embed-chats": {
    title: "Eingebettete Chats",
    export: "Exportieren",
    description:
      "Dies sind alle aufgezeichneten Chats und Nachrichten von jeder Einbettung, die Sie veröffentlicht haben.",
    table: {
      embed: "Einbettung",
      sender: "Absender",
      message: "Nachricht",
      response: "Antwort",
      at: "Gesendet am",
    },
  },
  multi: {
    title: "Mehrbenutzer-Modus",
    description:
      "Richten Sie Ihre Instanz ein, um Ihr Team zu unterstützen, indem Sie den Mehrbenutzer-Modus aktivieren.",
    enable: {
      "is-enable": "Mehrbenutzer-Modus ist aktiviert",
      enable: "Mehrbenutzer-Modus aktivieren",
      description:
        "Standardmäßig sind Sie der einzige Administrator. Als Administrator müssen Sie Konten für alle neuen Benutzer oder Administratoren erstellen. Verlieren Sie Ihr Passwort nicht, da nur ein Administrator-Benutzer Passwörter zurücksetzen kann.",
      username: "Administrator-Kontoname",
      password: "Administrator-Kontopasswort",
    },
    password: {
      title: "Passwortschutz",
      description:
        "Schützen Sie Ihre AnythingLLM-Instanz mit einem Passwort. Wenn Sie dieses vergessen, gibt es keine Wiederherstellungsmethode, also stellen Sie sicher, dass Sie dieses Passwort speichern.",
    },
    instance: {
      title: "Instanz mit Passwort schützen",
      description:
        "Standardmäßig sind Sie der einzige Administrator. Als Administrator müssen Sie Konten für alle neuen Benutzer oder Administratoren erstellen. Verlieren Sie Ihr Passwort nicht, da nur ein Administrator-Benutzer Passwörter zurücksetzen kann.",
      password: "Instanz-Passwort",
    },
  },
  event: {
    title: "Ereignisprotokolle",
    description:
      "Sehen Sie alle Aktionen und Ereignisse, die auf dieser Instanz zur Überwachung stattfinden.",
    clear: "Ereignisprotokolle löschen",
    table: {
      type: "Ereignistyp",
      user: "Benutzer",
      occurred: "Aufgetreten am",
    },
  },
  privacy: {
    title: "Datenschutz & Datenverarbeitung",
    description:
      "Dies ist Ihre Konfiguration dafür, wie verbundene Drittanbieter und AnythingLLM Ihre Daten behandeln.",
    llm: "LLM-Auswahl",
    embedding: "Einbettungspräferenz",
    vector: "Vektordatenbank",
    anonymous: "Anonyme Telemetrie aktiviert",
  },
  connectors: {
    "search-placeholder": "Datenverbindungen durchsuchen",
    "no-connectors": "Keine Datenverbindungen gefunden.",
    github: {
      name: "GitHub Repository",
      description:
        "Importieren Sie ein öffentliches oder privates GitHub-Repository mit einem einzigen Klick.",
      URL: "GitHub Repo URL",
      URL_explained: "URL des GitHub-Repositories, das Sie sammeln möchten.",
      token: "GitHub Zugriffstoken",
      optional: "optional",
      token_explained: "Zugriffstoken um Ratenlimits zu vermeiden.",
      token_explained_start: "Ohne einen ",
      token_explained_link1: "persönlichen Zugriffstoken",
      token_explained_middle:
        " kann die GitHub-API aufgrund von Ratenlimits die Anzahl der abrufbaren Dateien einschränken. Sie können ",
      token_explained_link2: "einen temporären Zugriffstoken erstellen",
      token_explained_end: ", um dieses Problem zu vermeiden.",
      ignores: "Datei-Ausschlüsse",
      git_ignore:
        "Liste im .gitignore-Format, um bestimmte Dateien während der Sammlung zu ignorieren. Drücken Sie Enter nach jedem Eintrag, den Sie speichern möchten.",
      task_explained:
        "Sobald der Vorgang abgeschlossen ist, sind alle Dateien im Dokumenten-Picker zur Einbettung in Arbeitsbereiche verfügbar.",
      branch: "Branch, von dem Sie Dateien sammeln möchten.",
      branch_loading: "-- lade verfügbare Branches --",
      branch_explained: "Branch, von dem Sie Dateien sammeln möchten.",
      token_information:
        "Ohne Angabe des <b>GitHub Zugriffstokens</b> kann dieser Datenkonnektor aufgrund der öffentlichen API-Ratenlimits von GitHub nur die <b>Top-Level</b>-Dateien des Repositories sammeln.",
      token_personal:
        "Holen Sie sich hier einen kostenlosen persönlichen Zugriffstoken mit einem GitHub-Konto.",
    },
    gitlab: {
      name: "GitLab Repository",
      description:
        "Importieren Sie ein öffentliches oder privates GitLab-Repository mit einem einzigen Klick.",
      URL: "GitLab Repo URL",
      URL_explained: "URL des GitLab-Repositories, das Sie sammeln möchten.",
      token: "GitLab Zugriffstoken",
      optional: "optional",
      token_explained: "Zugriffstoken zur Vermeidung von Ratenlimits.",
      token_description:
        "Wählen Sie zusätzliche Entitäten aus, die von der GitLab-API abgerufen werden sollen.",
      token_explained_start: "Ohne einen ",
      token_explained_link1: "persönlichen Zugriffstoken",
      token_explained_middle:
        " kann die GitLab-API aufgrund von Ratenlimits die Anzahl der abrufbaren Dateien einschränken. Sie können ",
      token_explained_link2: "einen temporären Zugriffstoken erstellen",
      token_explained_end: ", um dieses Problem zu vermeiden.",
      fetch_issues: "Issues als Dokumente abrufen",
      ignores: "Datei-Ausschlüsse",
      git_ignore:
        "Liste im .gitignore-Format, um bestimmte Dateien während der Sammlung zu ignorieren. Drücken Sie Enter nach jedem Eintrag, den Sie speichern möchten.",
      task_explained:
        "Sobald der Vorgang abgeschlossen ist, sind alle Dateien im Dokumenten-Picker zur Einbettung in Arbeitsbereiche verfügbar.",
      branch: "Branch, von dem Sie Dateien sammeln möchten",
      branch_loading: "-- lade verfügbare Branches --",
      branch_explained: "Branch, von dem Sie Dateien sammeln möchten.",
      token_information:
        "Ohne Angabe des <b>GitLab Zugriffstokens</b> kann dieser Datenkonnektor aufgrund der öffentlichen API-Ratenlimits von GitLab nur die <b>Top-Level</b>-Dateien des Repositories sammeln.",
      token_personal:
        "Holen Sie sich hier einen kostenlosen persönlichen Zugriffstoken mit einem GitLab-Konto.",
    },
    youtube: {
      name: "YouTube Transkript",
      description:
        "Importieren Sie die Transkription eines YouTube-Videos über einen Link.",
      URL: "YouTube Video URL",
      URL_explained_start:
        "Geben Sie die URL eines beliebigen YouTube-Videos ein, um dessen Transkript abzurufen. Das Video muss über ",
      URL_explained_link: "Untertitel",
      URL_explained_end: " verfügen.",
      task_explained:
        "Sobald der Vorgang abgeschlossen ist, ist das Transkript im Dokumenten-Picker zur Einbettung in Arbeitsbereiche verfügbar.",
      language: "Transkriptsprache",
      language_explained:
        "Wählen Sie die Sprache des Transkripts aus, das Sie sammeln möchten.",
      loading_languages: "-- lade verfügbare Sprachen --",
    },
    "website-depth": {
      name: "Massen-Link-Scraper",
      description:
        "Durchsuchen Sie eine Website und ihre Unterlinks bis zu einer bestimmten Tiefe.",
      URL: "Website URL",
      URL_explained:
        "Geben Sie die Start-URL der Website ein, die Sie durchsuchen möchten.",
      depth: "Durchsuchungstiefe",
      depth_explained:
        "Das ist die Menge an Unterseiten, die abhängig der originalen URL durchsucht werden sollen.",
      max_pages: "Maximale Seitenanzahl",
      max_pages_explained: "Maximale Anzahl der zu durchsuchenden Seiten.",
      task_explained:
        "Sobald der Vorgang abgeschlossen ist, sind alle gesammelten Inhalte im Dokumenten-Picker zur Einbettung in Arbeitsbereiche verfügbar.",
    },
    confluence: {
      name: "Confluence",
      description:
        "Importieren Sie eine komplette Confluence-Seite mit einem einzigen Klick.",
      deployment_type: "Confluence Bereitstellungstyp",
      deployment_type_explained:
        "Bestimmen Sie, ob Ihre Confluence-Instanz in der Atlassian Cloud oder selbst gehostet ist.",
      base_url: "Confluence Basis-URL",
      base_url_explained: "Dies ist die Basis-URL Ihres Confluence-Bereichs.",
      space_key: "Confluence Space-Key",
      space_key_explained:
        "Dies ist der Space-Key Ihrer Confluence-Instanz, der verwendet wird. Beginnt normalerweise mit ~",
      username: "Confluence Benutzername",
      username_explained: "Ihr Confluence Benutzername.",
      auth_type: "Confluence Authentifizierungstyp",
      auth_type_explained:
        "Wählen Sie den Authentifizierungstyp, den Sie verwenden möchten, um auf Ihre Confluence-Seiten zuzugreifen.",
      auth_type_username: "Benutzername und Zugriffstoken",
      auth_type_personal: "Persönliches Zugriffstoken",
      token: "Confluence API-Token",
      token_explained_start:
        "Sie müssen ein Zugriffstoken für die Authentifizierung bereitstellen. Sie können ein Zugriffstoken",
      token_explained_link: "hier",
      token_desc: "Zugriffstoken für die Authentifizierung.",
      pat_token: "Confluence persönliches Zugriffstoken",
      pat_token_explained: "Ihr Confluence persönliches Zugriffstoken.",
      task_explained:
        "Sobald der Vorgang abgeschlossen ist, ist der Seiteninhalt im Dokumenten-Picker zur Einbettung in Arbeitsbereiche verfügbar.",
    },
    manage: {
      documents: "Dokumente",
      "data-connectors": "Datenverbindungen",
      "desktop-only":
        "Diese Einstellungen können nur auf einem Desktop-Gerät bearbeitet werden. Bitte rufen Sie diese Seite auf Ihrem Desktop auf, um fortzufahren.",
      dismiss: "Schließen",
      editing: "Bearbeite",
    },
    directory: {
      "my-documents": "Meine Dokumente",
      "new-folder": "Neuer Ordner",
      "search-document": "Dokument suchen",
      "no-documents": "Keine Dokumente",
      "move-workspace": "In Arbeitsbereich verschieben",
      name: "Name",
      "delete-confirmation":
        "Sind Sie sicher, dass Sie diese Dateien und Ordner löschen möchten?\nDies wird die Dateien vom System entfernen und sie automatisch aus allen vorhandenen Arbeitsbereichen entfernen.\nDiese Aktion kann nicht rückgängig gemacht werden.",
      "removing-message":
        "Entferne {{count}} Dokumente und {{folderCount}} Ordner. Bitte warten.",
      "move-success": "{{count}} Dokumente erfolgreich verschoben.",
      date: "Datum",
      type: "Typ",
      select_all: "Alle auswählen",
      deselect_all: "Auswahl abbrechen",
      no_docs: "Keine Dokumente vorhanden.",
      remove_selected: "Ausgewähltes entfernen",
      costs: "*Einmalige Kosten für das Einbetten",
      save_embed: "Speichern und Einbetten",
    },
    upload: {
      "processor-offline": "Dokumentenprozessor nicht verfügbar",
      "processor-offline-desc":
        "Wir können Ihre Dateien momentan nicht hochladen, da der Dokumentenprozessor offline ist. Bitte versuchen Sie es später erneut.",
      "click-upload":
        "Klicken Sie zum Hochladen oder ziehen Sie Dateien per Drag & Drop",
      "file-types":
        "unterstützt Textdateien, CSVs, Tabellenkalkulationen, Audiodateien und mehr!",
      "or-submit-link": "oder einen Link einreichen",
      "placeholder-link": "https://beispiel.de",
      fetching: "Wird abgerufen...",
      "fetch-website": "Website abrufen",
      "privacy-notice":
        "Diese Dateien werden zum Dokumentenprozessor hochgeladen, der auf dieser AnythingLLM-Instanz läuft. Diese Dateien werden nicht an Dritte gesendet oder geteilt.",
    },
    pinning: {
      what_pinning: "Was bedeutet es Dokumente anzuheften?",
      pin_explained_block1:
        "Wenn du ein Dokument <b>anheftest</b>, wird den kompletten Inhalt des Dokuments mit deinem Prompt versendet, wodurch das LLM den vollen Kontext besitzt",
      pin_explained_block2:
        "Das funktioniert am besten bei <b>sehr großen Dokumenten</b> sowie für kleine Dokumenten, dessen Inhalt für die Wissensbasis absolut wichtig sind.",
      pin_explained_block3:
        "Wenn du nicht standardmäßig die erwünschten Ergebnisse bekommst, kann das anheften eine gute Methode sein, um Antworten mit einer besseren Qualität mit nur einem Klick zu erhalten.",
      accept: "Alles klar, ich habe es verstanden.",
    },
    watching: {
      what_watching: "Was bedeutet es ein Dokument zu beobachten?",
      watch_explained_block1:
        "Wenn du ein Dokument <b>beobachtest,</b> werden wir <i>automatisch</i> das Dokument von der Datenquelle in regelmäßigen Abständen aktualisieren. Dadurch wird der Inhalt automatisch in allen Arbeitsbereichen aktualisiert, wo sich das Dokument befindet.",
      watch_explained_block2:
        "Diese Funktion unterstützt aktuell nur Online-Quellen und ist somit nicht verfügbar für selbst hochgeladene Dokumente",
      watch_explained_block3_start: "Du kannst im ",
      watch_explained_block3_link: "Dateimanager",
      watch_explained_block3_end:
        " entscheiden, welche Dokumente du beobachten möchtest.",
      accept: "Alles klar, ich habe es verstanden.",
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
    welcome: "Willkommen zu deinem Arbeitsbereich.",
    get_started: "Starte mit ",
    get_started_default: "Starte mit ",
    upload: "dem Upload von Dokumenten",
    or: " oder ",
    send_chat: " schreibe im Chat.",
    send_message: "Schreibe eine Nachricht",
    attach_file: "Füge eine Datei zum Chat hinzu",
    slash: "Schau dir alle verfügbaren Slash Befehle für den Chat an.",
    agents: "Schau dir alle verfugbaren Agentenfähigkeiten für den Chat an.",
    text_size: "Ändere die Größe des Textes.",
    microphone: "Spreche deinen Prompt ein.",
    send: "Versende den Prompt an den Arbeitsbereich.",
    attachments_processing: null,
  },
  profile_settings: {
    edit_account: "Account bearbeiten",
    profile_picture: "Profilbild",
    remove_profile_picture: "Profilbild entfernen",
    username: "Nutzername",
    username_description:
      "Der Nutzername darf nur kleine Buchstaben, Zahlen, Unterstrich und Bindestriche ohne Leerzeichen.",
    new_password: "Neues Passwort",
    passwort_description: "Das Passwort muss mindestens 8 Zeichen haben.",
    cancel: "Abbrechen",
    update_account: "Account updaten",
    theme: "Bevozugtes Design",
    language: "Bevorzugte Sprache",
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
    noWorkspaceError:
      "Bitte erstellen Sie einen Arbeitsbereich, bevor Sie einen Chat beginnen.",
    checklist: {
      title: "Erste Schritte",
      tasksLeft: "Aufgaben übrig",
      completed: "Sie sind auf dem Weg, ein AnythingLLM-Experte zu werden!",
      dismiss: "schließen",
      tasks: {
        create_workspace: {
          title: "Einen Arbeitsbereich erstellen",
          description:
            "Erstellen Sie Ihren ersten Arbeitsbereich, um zu beginnen",
          action: "Erstellen",
        },
        send_chat: {
          title: "Einen Chat senden",
          description: "Starten Sie ein Gespräch mit Ihrem KI-Assistenten",
          action: "Chat",
        },
        embed_document: {
          title: "Ein Dokument einbetten",
          description:
            "Fügen Sie Ihr erstes Dokument zu Ihrem Arbeitsbereich hinzu",
          action: "Einbetten",
        },
        setup_system_prompt: {
          title: "Ein System-Prompt einrichten",
          description: "Konfigurieren Sie das Verhalten Ihres KI-Assistenten",
          action: "Einrichten",
        },
        define_slash_command: {
          title: "Einen Slash-Befehl definieren",
          description:
            "Erstellen Sie benutzerdefinierte Befehle für Ihren Assistenten",
          action: "Definieren",
        },
        visit_community: {
          title: "Community Hub besuchen",
          description: "Entdecken Sie Community-Ressourcen und Vorlagen",
          action: "Stöbern",
        },
      },
    },
    quickLinks: {
      title: "Schnellzugriffe",
      sendChat: "Chat senden",
      embedDocument: "Dokument einbetten",
      createWorkspace: "Arbeitsbereich erstellen",
    },
    exploreMore: {
      title: "Weitere Funktionen erkunden",
      features: {
        customAgents: {
          title: "Benutzerdefinierte KI-Agenten",
          description:
            "Erstellen Sie leistungsstarke KI-Agenten und Automatisierungen ohne Code.",
          primaryAction: "Chatten mit @agent",
          secondaryAction: "Einen Agenten-Flow erstellen",
        },
        slashCommands: {
          title: "Slash-Befehle",
          description:
            "Sparen Sie Zeit und fügen Sie Eingabeaufforderungen mit benutzerdefinierten Slash-Befehlen ein.",
          primaryAction: "Einen Slash-Befehl erstellen",
          secondaryAction: "Im Hub erkunden",
        },
        systemPrompts: {
          title: "System-Eingabeaufforderungen",
          description:
            "Ändern Sie die System-Eingabeaufforderung, um die KI-Antworten eines Arbeitsbereichs anzupassen.",
          primaryAction: "Eine System-Eingabeaufforderung ändern",
          secondaryAction: "Eingabevariablen verwalten",
        },
      },
    },
    announcements: {
      title: "Updates & Ankündigungen",
    },
    resources: {
      title: "Ressourcen",
      links: {
        docs: "Dokumentation",
        star: "Auf Github mit Stern versehen",
      },
    },
  },
};

export default TRANSLATIONS;
