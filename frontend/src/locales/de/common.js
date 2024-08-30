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
    "browser-extension": "Browser-Erweiterung",
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
    githubIssue: "Erstellen Sie ein Problem auf Github",
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
    starOnGithub: "Stern auf GitHub",
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

  appearance: {
    title: "Erscheinungsbild",
    description: "Passen Sie die Erscheinungseinstellungen Ihrer Plattform an.",
    logo: {
      title: "Logo anpassen",
      description:
        "Laden Sie Ihr eigenes Logo hoch, um Ihren Chatbot zu personalisieren.",
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
      assistant: "AnythingLLM Chat-Assistent",
      "double-click": "Doppelklicken zum Bearbeiten...",
      save: "Nachrichten speichern",
    },
    icons: {
      title: "Benutzerdefinierte Fußzeilen-Icons",
      description:
        "Passen Sie die Fußzeilen-Icons an, die am unteren Rand der Seitenleiste angezeigt werden.",
      icon: "Icon",
      link: "Link",
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
};

export default TRANSLATIONS;
