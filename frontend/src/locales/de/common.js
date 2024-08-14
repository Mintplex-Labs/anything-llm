const TRANSLATIONS = {
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
      start: "Melde dich bei deinem",
      end: "Konto an.",
    },
    "password-reset": {
      title: "Passwort zurücksetzen",
      description:
        "Gebe die erforderlichen Informationen unten ein, um dein Passwort zurückzusetzen.",
      "recovery-codes": "Wiederherstellungscodes",
      "recovery-code": "Wiederherstellungscode {{index}}",
      "back-to-login": "Zurück zur Anmeldung",
    },
  },

  welcomeMessage: {
    part1:
      "Herzlich Willkommen bei der ITSC-K.I. Testumgebung!",
    part2:
      "",
    part3:
      "",
    user1: "Alles klar! Wie fange ich an?",
    part4:
      'Es ist einfach. Alle Sammlungen sind in "Arbeitsbereichen" organisiert, die wir Workspaces nennen. Workspaces sind Behälter für Dateien, Dokumente, Bilder, PDFs und vieles mehr, die in etwas umgewandelt werden, welche die ITSC-K.I. verstehen und in Gesprächen verwenden kann.\n\nSie können jederzeit Dateien hinzufügen und entfernen.',
    createWorkspace: "Erstelle deinen ersten Workspace",
    user2:
      "Bist du so eine Art KI-Dropbox? Was ist mit dem Chatten? Du bist doch ein Chatbot, oder?",
    part5:
      "Ich bin mehr als eine intelligentere Dropbox.\n\nSo biete ich dir zwei Möglichkeiten an, wie du mit deinen Dateien interagieren kannst:\n\n<i>Abfrage:</i> Die Chats geben Daten oder Schlussfolgerungen zurück, die Ich in den Dokumenten deines Workspace gefunden habe, auf die ich Zugriff habe. Je mehr Dokumente du einem Workspace hinzufügst, desto intelligenter werde ich in diesem Workspace! \n\n<i>Konversation:</i> Deine Dokumente und der Chat-Verlauf tragen gleichzeitig zu meinem Wissen bei. So hast du die Möglichkeit, Korrekturen oder zusätzliche Informationen im Falle von Missverständnissen, die Ich haben könnte, anzuhängen. \n\nDu kannst zwischen beiden Modi wechseln \n<i>mitten im Chatten!</i>",
    user3: "Wow, das klingt spannend! Lass es mich gleich ausprobieren!",
    part6: "Viel Spaß!"
  },

  "new-workspace": {
    title: "Neuer Workspace",
    placeholder: "Mein Workspace",
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
      description: "Gesamtanzahl der Vektoren in der Vektordatenbank.",
    },
    names: {
      description: "Dies ändert nur den Anzeigenamen des Workspace.",
    },
    message: {
      title: "Vorgeschlagene Chat-Nachrichten",
      description:
        "Passe die Nachrichten an, die deinen Workspace-Benutzern vorgeschlagen werden.",
      add: "Neue Nachricht hinzufügen",
      save: "Nachrichten speichern",
      heading: "Erkläre mir",
      body: "die Vorteile der ITSC-K.I.",
    },
    pfp: {
      title: "Workspace-Bild",
      description:
        "Passe das Profilbild des Workspace an.",
      image: "Workspace-Bild",
      remove: "Workspace-Bild entfernen",
    },
    delete: {
      title: "Workspace löschen",
      description:
        "Löschen des Workspace und alle darin enthaltenen Daten. Achtung! Dies löscht den Workspace für alle Benutzer.",
      delete: "Workspace löschen",
      deleting: "Workspace wird gelöscht...",
      "confirm-start": "Du bist dabei, deinen gesamten",
      "confirm-end":
        "Workspace zu löschen. Dies entfernt alle Einbettungen, die in diesem Workspace gespeichert sind.\n\nDie ursprünglichen Quelldateien bleiben unberührt. Diese Aktion ist irreversibel.",
    },
  },

  chat: {
    llm: {
      title: "Workspace-LLM-Anbieter",
      description:
        "Der spezifische LLM-Anbieter und das Modell, das für diesen Arbeitsbereich verwendet wird. Standardmäßig wird der System-LLM-Anbieter und dessen Einstellungen verwendet.",
      search: "Durchsuche alle LLM-Anbieter",
    },
    model: {
      title: "Workspace-Chat-Modell",
      description:
        "Das spezifische Chat-Modell, das für diesen Workspace verwendet wird. Wenn leer, wird die System-LLM-Präferenz verwendet.",
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
        "Der Prompt, der in diesem Arbeitsbereich verwendet wird. Definiere den Kontext und die Anweisungen für die KI, um eine Antwort zu generieren. Du solltest einen sorgfältig formulierten Prompt bereitstellen, damit die KI eine relevante und genaue Antwort generieren kann.",
    },
    refusal: {
      title: "Abfragemodus-Ablehnungsantwort",
      "desc-start": "Wenn im",
      query: "Abfrage",
      "desc-end":
        "modus, möchtest du vielleicht eine benutzerdefinierte Ablehnungsantwort zurückgeben, wenn kein Kontext gefunden wird.",
    },
    temperature: {
      title: "LLM-Temperatur",
      "desc-start":
        'Diese Einstellung steuert, wie "kreativ" Ihre LLM-Antworten sein werden.',
      "desc-end":
        "Je höher die Zahl, desto kreativer. Bei einigen Modellen kann dies zu unverständlichen Antworten führen, wenn sie zu hoch eingestellt ist.",
      hint: "Die meisten LLMs haben verschiedene akzeptable Bereiche gültiger Werte. Konsultiere deinen LLM-Anbieter für diese Informationen.",
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
      title: "Workspace-Agent LLM-Anbieter",
      description:
        "Der spezifische LLM-Anbieter und das Modell, das für den @agent-Agenten dieses Workspace verwendet wird.",
    },
    mode: {
      chat: {
        title: "Workspace-Agent Chat-Modell",
        description:
          "Das spezifische Chat-Modell, das für den @agent-Agenten dieses Workspace verwendet wird.",
      },
      title: "Workspace-Agent-Modell",
      description:
        "Das spezifische LLM-Modell, das für den @agent-Agenten dieses Workspace verwendet wird.",
      wait: "-- warte auf Modelle --",
    },

    skill: {
      title: "Standard-Agentenfähigkeiten",
      description:
        "Verbessern der natürlichen Fähigkeiten des Standard-Agenten mit diesen vorgefertigten Fähigkeiten. Diese Einrichtung gilt für alle Arbeitsbereiche.",
      rag: {
        title: "RAG & Langzeitgedächtnis",
        description:
          'Erlaube dem Agenten, deine lokalen Dokumente zu nutzen, um eine Abfrage zu beantworten oder bitten Sie den Agenten, Inhalte für den Langzeitabruf zu "merken".',
      },
      view: {
        title: "Dokumente anzeigen & zusammenfassen",
        description:
          "Erlaube dem Agenten, den Inhalt der aktuell eingebetteten Workspace-Dateien aufzulisten und zusammenzufassen.",
      },
      scrape: {
        title: "Websites durchsuchen",
        description:
          "Erlaube dem Agenten, Websites zu besuchen und deren Inhalt zu extrahieren.",
      },
      generate: {
        title: "Diagramme generieren",
        description:
          "Aktiviere den Standard-Agenten, um verschiedene Arten von Diagrammen aus bereitgestellten oder im Chat gegebenen Daten zu generieren.",
      },
      save: {
        title: "Dateien generieren & im Browser speichern",
        description:
          "Aktiviere den Standard-Agenten, um Dateien zu generieren und zu schreiben, die gespeichert und in deinem Browser heruntergeladen werden können.",
      },
      web: {
        title: "Live-Websuche und -Browsing",
        "desc-start":
          "Ermögliche deinen Agenten, das Web zu durchsuchen, um deine Fragen zu beantworten, indem Sie eine Verbindung zu einem Websuche-Anbieter (SERP) herstellen.",
        "desc-end":
          "Die Websuche während Agentensitzungen funktioniert erst, wenn dies eingerichtet ist.",
      },
    },
  },

  recorded: {
    title: "Workspace-Chats",
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

  appearance: {
    title: "Erscheinungsbild",
    description: "Passe die Erscheinungseinstellungen Ihrer Plattform an.",
    logo: {
      title: "Logo anpassen",
      description:
        "Lade dein eigenes Logo hoch, um deinen Chatbot zu personalisieren.",
      add: "Benutzerdefiniertes Logo hinzufügen",
      recommended: "Empfohlene Größe: 800 x 200",
      remove: "Entfernen",
      replace: "Ersetzen",
    },
    message: {
      title: "Nachrichten anpassen",
      description:
        "Passen Sie die automatischen Nachrichten an, die Ihren Benutzern angezeigt werden.",
      new: "Neu",
      system: "System",
      user: "Benutzer",
      message: "Nachricht",
      assistant: "ITSC K.I. Chat-Assistent",
      "double-click": "Doppelklicken zum Bearbeiten...",
      save: "Nachrichten speichern",
    },
    icons: {
      title: "Benutzerdefinierte Fußzeilen-Icons",
      description:
        "Passen die Fußzeilen-Icons an, die am unteren Rand der Seitenleiste angezeigt werden.",
      icon: "Icon",
      link: "Link",
    },
  },

  api: {
    title: "API-Schlüssel",
    description:
      "API-Schlüssel ermöglichen es dem Besitzer, programmatisch auf diese Instanz zuzugreifen und sie zu verwalten.",
    link: "API-Dokumentation lesen",
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
      "Dies sind die Anmeldeinformationen und Einstellungen für deinen bevorzugten LLM-Chat- und Einbettungsanbieter. Es ist wichtig, dass diese Schlüssel aktuell und korrekt sind.",
    provider: "LLM-Anbieter",
  },

  transcription: {
    title: "Transkriptionsmodell-Präferenz",
    description:
      "Dies sind die Anmeldeinformationen und Einstellungen für Ihren bevorzugten Transkriptionsmodellanbieter. Es ist wichtig, dass diese Schlüssel aktuell und korrekt sind, sonst werden Mediendateien und Audio nicht transkribiert.",
    provider: "Transkriptionsanbieter",
    "warn-start":
      "Die Verwendung des lokalen Whisper-Modells auf Maschinen mit begrenztem RAM oder CPU kann bei der Verarbeitung von Mediendateien zum Stillstand bringen.",
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
      "Einbettung ist der Prozess, Text in Vektoren umzuwandeln. Diese Anmeldeinformationen sind erforderlich, um Ihre Dateien und Prompts in ein Format umzuwandeln, das zur Verarbeitung verwendet werden kann.",
    provider: {
      title: "Einbettungsanbieter",
      description:
        "Bei Verwendung der nativen Einbettungs-Engine von ITSC K.I. ist keine Einrichtung erforderlich.",
    },
  },

  text: {
    title: "Textsplitting & Chunking-Präferenzen",
    "desc-start":
      "Manchmal möchtest du vielleicht die Standardmethode ändern, wie neue Dokumente gesplittet und gechunkt werden, bevor sie in deine Vektordatenbank eingefügt werden.",
    "desc-end":
      "Du solltest diese Einstellung nur ändern, wenn du verstehst, wie Textsplitting funktioniert und welche Nebenwirkungen es hat.",
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
      "Dies sind die Anmeldeinformationen und Einstellungen für die Funktionsweise Ihrer Instanz. Es ist wichtig, dass diese Schlüssel aktuell und korrekt sind.",
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
    description:
      "Dies sind alle aufgezeichneten Chats und Nachrichten von jeder Einbettung, die du veröffentlicht hast.",
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
      "Richte die Instanz ein, um dein Team zu unterstützen, indem du den Mehrbenutzer-Modus aktivierst.",
    enable: {
      "is-enable": "Mehrbenutzer-Modus ist aktiviert",
      enable: "Mehrbenutzer-Modus aktivieren",
      description:
        "Standardmäßig sind der einzige Administrator. Als Administrator müssen Sie Konten für alle neuen Benutzer oder Administratoren erstellen. Verlieren Sie Ihr Passwort nicht, da nur ein Administrator-Benutzer Passwörter zurücksetzen kann.",
      username: "Administrator-Kontoname",
      password: "Administrator-Kontopasswort",
    },
    password: {
      title: "Passwortschutz",
      description:
        "Schütze die Instanz mit einem Passwort. Wenn du dieses vergessen hast, gibt es keine Wiederherstellungsmethode, also stelle sicher, dass du dieses Passwort speicherst.",
    },
    instance: {
      title: "Instanz mit Passwort schützen",
      description:
        "Standardmäßig bist du der einzige Administrator. Als Administrator müssen Sie Konten für alle neuen Benutzer oder Administratoren erstellen. Verlieren Sie Ihr Passwort nicht, da nur ein Administrator-Benutzer Passwörter zurücksetzen kann.",
      password: "Instanz-Passwort",
    },
  },

  event: {
    title: "Ereignisprotokolle",
    description:
      "Anzeigen aller Aktionen und Ereignisse, die auf dieser Instanz zur Überwachung stattfinden.",
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
      "Dies ist deine Konfiguration dafür, wie die ITSC K.I., AnythingLLM und verbundene Drittanbieter die Daten behandeln.",
    llm: "LLM-Auswahl",
    embedding: "Einbettungspräferenz",
    vector: "Vektordatenbank",
    anonymous: "Anonyme Telemetrie aktiviert",
  },
};

export default TRANSLATIONS;
