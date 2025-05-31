// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: "Was ist Ihre E-Mail?",
      useCase: "Wofür werden Sie das System nutzen?",
      useCaseWork: "Für die Arbeit",
      useCasePersonal: "Für den privaten Gebrauch",
      useCaseOther: "Anderes",
      comment: "Wie haben Sie von uns erfahren?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. – Lassen Sie uns wissen, wie Sie uns gefunden haben!",
      skip: "Umfrage überspringen",
      thankYou: "Vielen Dank für Ihr Feedback!",
      title: "Willkommen",
      description:
        "Helfen Sie uns, das Tool an Ihre Bedürfnisse anzupassen (optional).",
    },
    home: {
      title: "Willkommen bei",
      getStarted: "Jetzt starten",
    },
    llm: {
      title: "LLM-Einstellungen",
      description:
        "Das System kann mit vielen LLM-Anbietern arbeiten. Der ausgewählte Dienst wird zum Chatten verwendet.",
    },
    userSetup: {
      title: "Benutzereinrichtung",
      description: "Konfigurieren Sie Ihre Benutzereinstellungen.",
      howManyUsers: "Wie viele Nutzer werden diese Instanz verwenden?",
      justMe: "Nur ich",
      myTeam: "Mein Team",
      instancePassword: "Instanz-Passwort",
      setPassword: "Möchten Sie ein Passwort einrichten?",
      passwordReq: "Passwörter müssen mindestens 8 Zeichen lang sein.",
      passwordWarn:
        "Speichern Sie dieses Passwort – es gibt keine Möglichkeit zur Wiederherstellung.",
      adminUsername: "Benutzername des Admin-Kontos",
      adminUsernameReq:
        "Der Benutzername muss mindestens 6 Zeichen lang sein und darf nur Kleinbuchstaben, Zahlen, Unterstriche und Bindestriche ohne Leerzeichen enthalten.",
      adminPassword: "Passwort des Admin-Kontos",
      adminPasswordReq: "Passwörter müssen mindestens 8 Zeichen lang sein.",
      teamHint:
        "Standardmäßig sind Sie der einzige Administrator. Nach Abschluss der Einrichtung können Sie weitere Nutzer und Admins hinzufügen. Verlieren Sie Ihr Passwort nicht – nur Administratoren können Passwörter zurücksetzen.",
    },
    data: {
      title: "Datenverarbeitung & Datenschutz",
      description:
        "Wir stehen für Transparenz und Kontrolle im Umgang mit Ihren persönlichen Daten.",
      settingsHint:
        "Diese Einstellungen können Sie später jederzeit in den Einstellungen ändern.",
    },
    workspace: {
      title: "Erstellen Sie Ihren ersten Arbeitsbereich",
      description:
        "Erstellen Sie Ihren ersten Arbeitsbereich und legen Sie direkt los.",
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
    optional: "Optional",
    yes: "Ja",
    no: "Nein",
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
    "system-prompt-variables": "System-Prompt-Variablen",
    interface: "UI-Einstellungen",
    branding: "Branding",
    chat: "Chat",
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
      "Willkommen! Dieses Open-Source-KI-Tool verwandelt beliebige Inhalte (Dateien, Dokumente, etc.) in einen Chatbot, mit dem Sie kommunizieren können. Es handelt sich um eine BYOK-Software (Bring-Your-Own-Keys) – es fallen keine Abos oder laufenden Gebühren für die Software selbst an.",
    part2:
      "Mit diesem Tool bündeln Sie ganz einfach leistungsstarke KI-Technologien wie OpenAI, GPT-4, LangChain, PineconeDB, ChromaDB und Co. in einer praktischen Lösung für mehr Produktivität.",
    part3:
      "Sie können es komplett lokal auf Ihrem Rechner ohne großen Mehraufwand betreiben – keine GPU nötig. Auch Cloud- und On-Premises-Installationen sind möglich.\nDas KI-Ökosystem entwickelt sich ständig weiter. Diese Lösung macht es Ihnen leicht nutzbar.",
    githubIssue: "GitHub-Issue erstellen",
    user1: "Wie lege ich los?!",
    part4:
      'Ganz einfach: Alle Inhalte werden in sog. "Arbeitsbereichen" organisiert. Ein Arbeitsbereich ist ein Sammelpunkt für Dateien, Dokumente, Bilder, PDFs usw., die für KIs aufbereitet werden.\n\nSie können jederzeit Dateien hinzufügen und entfernen.',
    createWorkspace: "Erstellen Sie Ihren ersten Arbeitsbereich",
    user2:
      "Ist das sowas wie Dropbox für KI? Oder kann ich damit auch chatten?",
    part5:
      "Es ist mehr als eine smarte Dropbox.\n\nSie können auf zwei Arten mit Ihren Daten chatten:\n\n<i>Abfrage:</i> Ihre Chats liefern Antworten oder Informationen aus den zugänglichen Dokumenten im Arbeitsbereich. Je mehr Dokumente, desto schlauer das System!\n\n<i>Konversation:</i> Dokumente und Chatverlauf fließen gleichzeitig in das KI-Wissen ein. Ideal auch für Korrekturen und Echtzeit-Aktualisierungen. \n\nDer Modus lässt sich <i>mittendrin wechseln!</i>",
    user3: "Klingt super, ich will es sofort ausprobieren!",
    part6: "Viel Spaß!",
    starOnGitHub: "Auf GitHub mit Stern markieren",
    contact: "Kontakt",
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
      body: "die Vorteile dieses Systems",
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
      title: "Systemprompt",
      description:
        "Der Prompt, der in diesem Arbeitsbereich verwendet wird. Definieren Sie den Kontext und die Anweisungen für die KI, um eine Antwort zu generieren. Sie sollten einen sorgfältig formulierten Prompt bereitstellen, damit die KI eine relevante und genaue Antwort generieren kann.",
      history: {
        title: "Systemprompt-Verlauf",
        clearAll: "Alles löschen",
        noHistory: "Kein Verlauf vorhanden",
        restore: "Wiederherstellen",
        delete: "Löschen",
        deleteConfirm:
          "Möchten Sie diesen Eintrag wirklich löschen?",
        clearAllConfirm:
          "Möchten Sie wirklich den gesamten Verlauf löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        expand: "Erweitern",
      },
    },
    refusal: {
      title: "Antwort bei fehlendem Kontext im Abfragemodus",
      "desc-start": "Im",
      query: "Abfrage-",
      "desc-end":
        "modus kann eine eigene Antwort gesendet werden, falls kein Kontext gefunden wird.",
    },
    temperature: {
      title: "LLM-Temperatur",
      "desc-start":
        'Diese Einstellung bestimmt, wie "kreativ" die LLM-Antworten sind.',
      "desc-end":
        "Je höher die Zahl, desto kreativer. Zu hohe Werte können zu unverständlichen Antworten führen.",
      hint: "Viele LLM-Anbieter haben verschiedene gültige Wertebereiche. Beachten Sie Hinweise Ihres Anbieters.",
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
      "API-Schlüssel ermöglichen den Zugriff und die Verwaltung dieser Instanz durch programmatische Schnittstellen.",
    link: "Siehe API-Dokumentation",
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
      "Dies sind die Zugangsdaten und Einstellungen für Ihren bevorzugten LLM-Chat- und Einbettungsanbieter. Diese Schlüssel müssen aktuell und korrekt sein, sonst funktioniert das System nicht fehlerfrei.",
    provider: "LLM-Anbieter",
  },
  transcription: {
    title: "Transkriptionsmodell-Präferenz",
    description:
      "Zugangsdaten und Einstellungen für Ihren bevorzugten Anbieter für Transkriptionsmodelle. Diese Schlüssel müssen korrekt sein, sonst werden Mediendateien und Audios nicht transkribiert.",
    provider: "Transkriptionsanbieter",
    "warn-start":
      "Die Nutzung des lokalen Whisper-Modells auf Rechnern mit wenig RAM oder CPU kann das System beim Verarbeiten von Mediendateien ausbremsen.",
    "warn-recommend":
      "Wir empfehlen mindestens 2GB RAM und Uploads <10MB.",
    "warn-end":
      "Das benötigte Modell wird bei der ersten Nutzung automatisch heruntergeladen.",
  },
  embedding: {
    title: "Einbettungspräferenz",
    "desc-start":
      "Wenn Ihr LLM keine eigene Einbettungs-Engine besitzt, müssen Sie ggf. Zugangsdaten für die Einbettung angeben.",
    "desc-end":
      "Einbetten heißt, Text in Vektoren zu verwandeln. Die Zugangsdaten werden benötigt, um Ihre Daten so zu wandeln, dass sie verarbeitet werden können.",
    provider: {
      title: "Einbettungsanbieter",
      description:
        "Wenn Sie die native Einbettungs-Engine verwenden, ist keine weitere Einrichtung notwendig.",
    },
  },
  text: {
    title: "Textaufteilung & Chunking-Präferenzen",
    "desc-start":
      "Sie können die Standardmethode anpassen, wie neue Dokumente zerlegt und als Chunks gespeichert werden.",
    "desc-end":
      "Ändern Sie dies nur, falls Sie verstehen, wie Textaufteilung und Chunking funktionieren.",
    "warn-start": "Änderungen betreffen nur",
    "warn-center": "neu eingebettete Dokumente",
    "warn-end": ", nicht bestehende Dokumente.",
    size: {
      title: "Textchunk-Größe",
      description:
        "Maximale Zeichenlänge innerhalb eines einzelnen Chunks.",
      recommend: "Maximale Länge des Embedding-Modells:",
    },
    overlap: {
      title: "Textchunk-Überlappung",
      description:
        "Maximale Überschneidung von Zeichen zwischen benachbarten Chunks.",
    },
  },
  vector: {
    title: "Vektordatenbank",
    description:
      "Das sind die Zugangsdaten und Einstellungen, wie Ihre Instanz funktioniert. Sie sollten aktuell und korrekt sein.",
    provider: {
      title: "Vektordatenbank-Anbieter",
      description: "Für LanceDB ist kein Setup notwendig.",
    },
  },
  embeddable: {
    title: "Einbettbare Chat-Widgets",
    description:
      "Einbettbare Chat-Widgets sind öffentliche Chat-Bereiche, die auf einen Arbeitsbereich zeigen. So können Sie Arbeitsbereiche erstellen und deren Chat extern verfügbar machen.",
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
      "Dies sind alle Mitschnitte und Nachrichten aus veröffentlichten Einbettungen.",
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
      "Richten Sie Ihre Instanz für Ihr Team ein, indem Sie den Mehrbenutzer-Modus aktivieren.",
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
        "Schützen Sie Ihre Instanz mit einem Passwort. Wenn dieses verloren geht, gibt es keine Wiederherstellung – speichern Sie es sicher.",
    },
    instance: {
      title: "Instanz mit Passwort schützen",
      description:
        "Standardmäßig sind Sie der einzige Administrator. Als Administrator müssen Sie Konten für alle neuen Benutzer oder Administratoren erstellen. Verlieren Sie Ihr Passwort nicht, da nur ein Administrator Passwörter zurücksetzen kann.",
      password: "Instanz-Passwort",
    },
  },
  event: {
    title: "Ereignisprotokolle",
    description:
      "Sehen Sie alle Aktionen und Ereignisse auf dieser Instanz zur Überwachung.",
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
      "Hier legen Sie fest, wie Drittanbieter und dieses System mit Ihren Daten umgehen.",
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
        "Diese Dateien werden zum Dokumentenprozessor hochgeladen, der auf dieser Instanz läuft. Ihre Dateien werden nicht an Dritte gesendet oder geteilt.",
    },
    pinning: {
      what_pinning: "Was bedeutet es Dokumente anzuheften?",
      pin_explained_block1:
        "Wenn du ein Dokument <b>anheftest</b>, wird der komplette Inhalt des Dokuments im Prompt mitgeschickt, damit die KI den vollen Kontext erhält.",
      pin_explained_block2:
        "Sinnvoll z.B. für <b>große Dokumente</b> oder kritische, kleine Dateien für die Wissensbasis.",
      pin_explained_block3:
        "Wenn du nicht standardmäßig die gewünschten Ergebnisse bekommst, kann Anheften die Qualität spürbar verbessern.",
      accept: "Alles klar, ich habe es verstanden.",
    },
    watching: {
      what_watching: "Was bedeutet es ein Dokument zu beobachten?",
      watch_explained_block1:
        "Wenn du ein Dokument <b>beobachtest,</b> wird dessen Inhalt automatisch regelmäßig von der Datenquelle aktualisiert – für alle Arbeitsbereiche, die es nutzen.",
      watch_explained_block2:
        "Unterstützt werden aktuell nur Online-Inhalte, nicht manuelle Uploads.",
      watch_explained_block3_start: "Du kannst im ",
      watch_explained_block3_link: "Dateimanager",
      watch_explained_block3_end:
        " entscheiden, welche Dokumente beobachtet werden.",
      accept: "Alles klar, ich habe es verstanden.",
    },
    obsidian: {
      name: "Obsidian",
      description: "Importieren Sie einen Obsidian-Vault mit einem Klick.",
      vault_location: "Vault-Speicherort",
      vault_description:
        "Wählen Sie Ihren Obsidian-Vault-Ordner, um alle Notizen und deren Verbindungen zu importieren.",
      selected_files: "{{count}} Markdown-Dateien gefunden",
      importing: "Vault-Import läuft...",
      import_vault: "Vault importieren",
      processing_time:
        "Die Verarbeitung kann je nach Größe Ihres Vaults etwas dauern.",
      vault_warning:
        "Achten Sie darauf, dass Ihr Obsidian Vault nicht geöffnet ist, um Konflikte zu vermeiden.",
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
    agents: "Schau dir alle verfügbaren Agentenfähigkeiten für den Chat an.",
    text_size: "Textgröße ändern.",
    microphone: "Spreche deinen Prompt ein.",
    send: "Prompt an Arbeitsbereich senden.",
    attachments_processing: "Anhänge werden verarbeitet. Bitte warten...",
    tts_speak_message: "Nachricht vorlesen (TTS)",
    copy: "Kopieren",
    regenerate: "Neu generieren",
    regenerate_response: "Antwort neu generieren",
    good_response: "Gute Antwort",
    more_actions: "Weitere Aktionen",
    hide_citations: "Quellen ausblenden",
    show_citations: "Quellen anzeigen",
    pause_tts_speech_message: "Sprachausgabe pausieren",
    fork: "Verzweigen",
    delete: "Löschen",
    save_submit: "Speichern & Absenden",
    cancel: "Abbrechen",
    edit_prompt: "Prompt bearbeiten",
    edit_response: "Antwort bearbeiten",
    at_agent: "@agent",
    default_agent_description: " – Standard-Agent für diesen Arbeitsbereich.",
    custom_agents_coming_soon: "Benutzerdefinierte Agenten folgen bald!",
    slash_reset: "/reset",
    preset_reset_description: "Löscht den Chatverlauf und startet einen neuen Chat",
    add_new_preset: " Neues Preset hinzufügen",
    command: "Befehl",
    your_command: "ihr-befehl",
    placeholder_prompt:
      "Dieser Inhalt wird vor Ihren Prompt gesetzt.",
    description: "Beschreibung",
    placeholder_description: "Antwortet mit einem Gedicht über LLMs.",
    save: "Speichern",
    small: "Klein",
    normal: "Normal",
    large: "Groß",
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
    theme: "Bevorzugtes Design",
    language: "Bevorzugte Sprache",
  },
  customization: {
    interface: {
      title: "UI-Einstellungen",
      description: "Legen Sie Ihre persönlichen UI-Vorlieben für die Anwendung fest.",
    },
    branding: {
      title: "Branding",
      description:
        "Passen Sie Ihre Instanz mit eigenem Branding an.",
    },
    chat: {
      title: "Chat",
      description: "Legen Sie Ihre persönlichen Chateinstellungen für die Anwendung fest.",
      auto_submit: {
        title: "Spracheingabe automatisch absenden",
        description:
          "Spracheingabe nach kurzer Pause automatisch absenden",
      },
      auto_speak: {
        title: "Antworten vorsprechen lassen",
        description: "Antworten der KI werden automatisch vorgesprochen",
      },
      spellcheck: {
        title: "Rechtschreibprüfung aktivieren",
        description: "Rechtschreibprüfung im Chat-Eingabefeld ein- oder ausschalten",
      },
    },
    items: {
      theme: {
        title: "Farbschema",
        description: "Wählen Sie Ihr bevorzugtes Farbschema für die App.",
      },
      "show-scrollbar": {
        title: "Scrollbar anzeigen",
        description: "Scrollleiste im Chatfenster aktivieren oder deaktivieren.",
      },
      "support-email": {
        title: "Support-E-Mail",
        description:
          "E-Mail-Adresse für den Support, die Nutzern angezeigt wird, wenn sie Hilfe benötigen.",
      },
      "app-name": {
        title: "Name",
        description:
          "Der auf der Login-Seite für alle Nutzer angezeigte Name.",
      },
      "chat-message-alignment": {
        title: "Chat-Nachrichten-Ausrichtung",
        description:
          "Wählen Sie die Textausrichtung bei der Nutzung des Chat-Fensters.",
      },
      "display-language": {
        title: "Anzeigesprache",
        description:
          "Wählen Sie die Sprache für die Benutzeroberfläche (falls verfügbar).",
      },
      logo: {
        title: "Logo",
        description: "Eigenes Logo hochladen, das überall angezeigt wird.",
        add: "Logo hinzufügen",
        recommended: "Empfohlene Größe: 800 x 200",
        remove: "Entfernen",
        replace: "Ersetzen",
      },
      "welcome-messages": {
        title: "Begrüßungsnachrichten",
        description:
          "Passen Sie die Nachrichten für neue Nutzer an. Nur Nicht-Administratoren sehen diese.",
        new: "Neu",
        system: "System",
        user: "Benutzer",
        message: "Nachricht",
        assistant: "Chat-Assistent",
        "double-click": "Doppelklick zum Bearbeiten...",
        save: "Nachrichten speichern",
      },
      "browser-appearance": {
        title: "Browser-Darstellung",
        description:
          "Aussehen des Browser-Tabs und Browser-Titels anpassen, wenn die App geöffnet ist.",
        tab: {
          title: "Titel",
          description: "Eigenen Tab-Titel festlegen, wenn die App im Browser läuft.",
        },
        favicon: {
          title: "Favicon",
          description: "Eigenes Favicon im Browser-Tab nutzen.",
        },
      },
      "sidebar-footer": {
        title: "Elemente im Seitenleisten-Footer",
        description: "Anpassen der Elemente unten in der Seitenleiste.",
        icon: "Icon",
        link: "Link",
      },
    },
  },
  "main-page": {
    noWorkspaceError:
      "Bitte erstellen Sie einen Arbeitsbereich, bevor Sie einen Chat beginnen.",
    checklist: {
      title: "Erste Schritte",
      tasksLeft: "Aufgaben übrig",
      completed: "Sie sind auf dem Weg, ein Experte für das System zu werden!",
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
          primaryAction: "Mit @agent chatten",
          secondaryAction: "Agent-Flows erstellen",
        },
        slashCommands: {
          title: "Slash-Befehle",
          description:
            "Spart Zeit und fügt Prompts mit benutzerdefinierten Slash-Befehlen ein.",
          primaryAction: "Slash-Befehl anlegen",
          secondaryAction: "Im Hub stöbern",
        },
        systemPrompts: {
          title: "System-Prompts",
          description:
            "System-Prompts anpassen, um die Antworten der KI im Arbeitsbereich fein zu steuern.",
          primaryAction: "System-Prompt bearbeiten",
          secondaryAction: "Prompt-Variablen verwalten",
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
      keyboardShortcuts: "Tastenkombinationen",
    },
  },
  "keyboard-shortcuts": {
    title: "Tastenkombinationen",
    shortcuts: {
      settings: "Einstellungen öffnen",
      workspaceSettings: "Arbeitsbereich-Einstellungen öffnen",
      home: "Zur Startseite",
      workspaces: "Arbeitsbereiche verwalten",
      apiKeys: "API-Schlüssel-Einstellungen",
      llmPreferences: "LLM-Präferenzen",
      chatSettings: "Chat-Einstellungen",
      help: "Tastenkombinationen anzeigen",
    },
  },
};

export default TRANSLATIONS;