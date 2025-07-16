// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Willkommen bei",
      getStarted: "Jetzt starten",
    },
    llm: {
      title: "LLM-Einstellung",
      description:
        "AnythingLLM ist mit vielen LLM-Anbietern kompatibel. Der ausgewählte Dienst wird für die Chats verwendet.",
    },
    userSetup: {
      title: "Benutzer Setup",
      description: "Konfigurieren Sie Ihre Benutzereinstellungen.",
      howManyUsers: "Wie viele Benutzer werden diese Instanz verwenden?",
      justMe: "Nur ich",
      myTeam: "Mein Team",
      instancePassword: "Passwort für diese Instanz",
      setPassword: "Möchten Sie ein Passwort einrichten?",
      passwordReq: "Das Passwort muss mindestens 8 Zeichen enthalten.",
      passwordWarn:
        "Dieses Passwort sollte sicher aufbewahrt werden, da Wiederherstellung nicht möglich ist.",
      adminUsername: "Benutzername des Admin-Accounts",
      adminUsernameReq:
        "Der Benutzername muss aus mindestens 6 Zeichen bestehen und darf ausschließlich Kleinbuchstaben, Ziffern, Unter- und Bindestriche enthalten – keine Leerzeichen",
      adminPassword: "Passwort des Admin-Accounts",
      adminPasswordReq: "Das Passwort muss mindestens 8 Zeichen enthalten.",
      teamHint:
        "Zu Beginn sind Sie der einzige Admin. Nach der Einrichtung können Sie weitere Benutzer oder Admins einladen. Verlieren Sie Ihr Passwort nicht – nur Admins können Passwörter zurücksetzen.",
    },
    data: {
      title: "Datenverarbeitung & Datenschutz",
      description:
        "Wir setzen uns für Transparenz und Kontrolle im Umgang mit Ihren persönlichen Daten ein.",
      settingsHint:
        "Diese Einstellungen können jederzeit in den Einstellungen angepasst werden.",
    },
    survey: {
      title: "Willkommen bei AnythingLLM",
      description:
        "Helfen Sie uns, AnythingLLM an Ihre Bedürfnisse anzupassen. (Optional)",
      email: "Wie lautet Ihre E-Mail-Adresse?",
      useCase: "Wofür möchten Sie AnythingLLM verwenden?",
      useCaseWork: "Beruflich",
      useCasePersonal: "Privat",
      useCaseOther: "Sonstiges",
      comment: "Wie haben Sie von AnythingLLM erfahren?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. – Teilen Sie uns mit, wie Sie uns entdeckt haben!",
      skip: "Umfrage überspringen",
      thankYou: "Vielen Dank für Ihr Feedback!",
    },
    workspace: {
      title: "Ersten Workspace erstellen",
      description:
        "Erstellen Sie Ihren ersten Workspace und starten Sie AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Namen der Workspaces",
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
    search: null,
  },
  settings: {
    title: "Instanzeinstellungen",
    system: "Allgemeine Einstellungen",
    invites: "Einladungen",
    users: "Benutzer",
    workspaces: "Workspaces",
    "workspace-chats": "Workspace-Chats",
    customization: "Personalisierung",
    interface: "UI-Einstellungen",
    branding: "Branding & Whitelabeling",
    chat: "Chat",
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
    "browser-extension": "Browser-Extension",
    "system-prompt-variables": "Systempromptvariablen",
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
      'Es ist einfach. Alle Sammlungen sind in Behältern organisiert, die wir "Workspaces" nennen. Workspaces sind Behälter für Dateien, Dokumente, Bilder, PDFs und andere Dateien, die in etwas umgewandelt werden, das LLMs verstehen und in Gesprächen verwenden können.\n\nSie können jederzeit Dateien hinzufügen und entfernen.',
    createWorkspace: "Erstellen Sie Ihren ersten Workspace",
    user2:
      "Ist das so eine Art KI-Dropbox oder so? Was ist mit dem Chatten? Es ist doch ein Chatbot, oder?",
    part5:
      "AnythingLLM ist mehr als eine intelligentere Dropbox.\n\nAnythingLLM bietet zwei Möglichkeiten, mit Ihren Daten zu sprechen:\n\n<i>Abfrage:</i> Ihre Chats geben Daten oder Schlussfolgerungen zurück, die in den Dokumenten Ihres Workspaces gefunden wurden, auf die es Zugriff hat. Je mehr Dokumente Sie dem Workspace hinzufügen, desto intelligenter wird er! \n\n<i>Konversation:</i> Ihre Dokumente + Ihr laufender Chat-Verlauf tragen gleichzeitig zum LLM-Wissen bei. Großartig für das Anhängen von Echtzeit-Textinformationen oder Korrekturen und Missverständnissen, die das LLM haben könnte. \n\nSie können zwischen beiden Modi wechseln \n<i>mitten im Chatten!</i>",
    user3: "Wow, das klingt erstaunlich, lass es mich gleich ausprobieren!",
    part6: "Viel Spaß!",
    starOnGitHub: "Stern auf GitHub",
    contact: "Kontaktieren Sie Mintplex Labs",
  },
  "main-page": {
    noWorkspaceError:
      "Bitte erstellen Sie einen Workspace, bevor Sie einen Chat beginnen.",
    checklist: {
      title: "Erste Schritte",
      tasksLeft: "Aufgaben übrig",
      completed: "Sie sind auf dem Weg, ein AnythingLLM-Experte zu werden!",
      dismiss: "schließen",
      tasks: {
        create_workspace: {
          title: "Einen Workspace erstellen",
          description: "Erstellen Sie Ihren ersten Workspace, um zu beginnen",
          action: "Erstellen",
        },
        send_chat: {
          title: "Einen Chat senden",
          description: "Starten Sie ein Gespräch mit Ihrem KI-Assistenten",
          action: "Chat",
        },
        embed_document: {
          title: "Ein Dokument einbetten",
          description: "Fügen Sie Ihr erstes Dokument zu Ihrem Workspace hinzu",
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
      createWorkspace: "Workspace erstellen",
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
          title: "System-Prompts",
          description:
            "Ändern Sie die System-Eingabeaufforderung, um die KI-Antworten eines Workspaces anzupassen.",
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
      keyboardShortcuts: "Tastaturkürzel",
    },
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
      description: "Gesamtanzahl der Vektoren in Ihrer Vektordatenbank.",
    },
    names: {
      description: "Dies ändert nur den Anzeigenamen Ihres Workspace.",
    },
    message: {
      title: "Vorgeschlagene Chat-Nachrichten",
      description:
        "Passen Sie die Nachrichten an, die Ihren Workspace-Benutzern vorgeschlagen werden.",
      add: "Neue Nachricht hinzufügen",
      save: "Nachrichten speichern",
      heading: "Erkläre mir",
      body: "die Vorteile von AnythingLLM",
    },
    pfp: {
      title: "Assistent-Profilbild",
      description:
        "Passen Sie das Profilbild des Assistenten für diesen Workspace an.",
      image: "Workspace-Bild",
      remove: "Workspace-Bild entfernen",
    },
    delete: {
      title: "Workspace löschen",
      description:
        "Löschen Sie diesen Workspace und alle seine Daten. Dies löscht den Workspace für alle Benutzer.",
      delete: "Workspace löschen",
      deleting: "Workspace wird gelöscht...",
      "confirm-start": "Sie sind dabei, Ihren gesamten",
      "confirm-end":
        "Workspace zu löschen. Dies entfernt alle Vektoreinbettungen in Ihrer Vektordatenbank.\n\nDie ursprünglichen Quelldateien bleiben unberührt. Diese Aktion ist irreversibel.",
    },
  },
  chat: {
    llm: {
      title: "Workspace-LLM-Anbieter",
      description:
        "Der spezifische LLM-Anbieter und das Modell, das für diesen Workspace verwendet wird. Standardmäßig wird der System-LLM-Anbieter und dessen Einstellungen verwendet.",
      search: "Durchsuchen Sie alle LLM-Anbieter",
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
        "Der Prompt, der in diesem Workspace verwendet wird. Definieren Sie den Kontext und die Anweisungen für die KI, um eine Antwort zu generieren. Sie sollten einen sorgfältig formulierten Prompt bereitstellen, damit die KI eine relevante und genaue Antwort generieren kann.",
      history: {
        title: "Systemprompt-Historie",
        clearAll: "Alles löschen",
        noHistory: "Keine Einträge im Verlauf vorhanden",
        restore: "Wiederherstellen",
        delete: "Löschen",
        publish: "Im Community Hub veröffentlichen",
        deleteConfirm: "Möchten Sie diesen Eintrag wirklich löschen?",
        clearAllConfirm:
          "Möchten Sie wirklich alle Einträge löschen? Diese Aktion ist unwiderruflich.",
        expand: "Ausklappen",
      },
    },
    refusal: {
      title: "Abfragemodus-Ablehnungsantwort",
      "desc-start": "Wenn im",
      query: "Abfrage",
      "desc-end":
        "modus, möchten Sie vielleicht eine benutzerdefinierte Ablehnungsantwort zurückgeben, wenn kein Kontext gefunden wird.",
      "tooltip-title": null,
      "tooltip-description": null,
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
        "Sie sind dabei, die Vektordatenbank dieses Workspace zurückzusetzen. Dies entfernt alle derzeit eingebetteten Vektoreinbettungen.\n\nDie ursprünglichen Quelldateien bleiben unberührt. Diese Aktion ist irreversibel.",
      error: "Die Workspace-Vektordatenbank konnte nicht zurückgesetzt werden!",
      success: "Die Workspace-Vektordatenbank wurde zurückgesetzt!",
    },
  },
  agent: {
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
        "Verbessern Sie die natürlichen Fähigkeiten des Standard-Agenten mit diesen vorgefertigten Fähigkeiten. Diese Einrichtung gilt für alle Workspaces.",
      rag: {
        title: "RAG & Langzeitgedächtnis",
        description:
          'Erlauben Sie dem Agenten, Ihre lokalen Dokumente zu nutzen, um eine Abfrage zu beantworten oder bitten Sie den Agenten, Inhalte für den Langzeitabruf zu "merken".',
      },
      view: {
        title: "Dokumente anzeigen & zusammenfassen",
        description:
          "Erlauben Sie dem Agenten, den Inhalt der aktuell eingebetteten Workspace-Dateien aufzulisten und zusammenzufassen.",
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
    "performance-warning": null,
  },
  recorded: {
    title: "Workspace-Chats",
    description:
      "Dies sind alle aufgezeichneten Chats und Nachrichten, die von Benutzern gesendet wurden, geordnet nach ihrem Erstellungsdatum.",
    export: "Exportieren",
    table: {
      id: "Id",
      by: "Gesendet von",
      workspace: "Workspace",
      prompt: "Prompt",
      response: "Antwort",
      at: "Gesendet am",
    },
  },
  customization: {
    interface: {
      title: "UI Einstellungen",
      description: "Passen Sie die Benutzeroberfläche von AnythingLLM an.",
    },
    branding: {
      title: "Branding & Whitelabeling“",
      description:
        "Individualisieren Sie Ihre AnythingLLM-Instanz durch eigenes Branding.",
    },
    chat: {
      title: "Chat",
      description: "Passen Sie Ihre Chat-Einstellungen für AnythingLLM an.",
      auto_submit: {
        title: "Spracheingaben automatisch senden",
        description:
          "Automatische Übermittlung der Spracheingabe nach einer Sprechpause.",
      },
      auto_speak: {
        title: "Antworten automatisch vorlesen",
        description: "Antworten der KI automatisch vorlesen lassen",
      },
      spellcheck: {
        title: "Rechtschreibprüfung aktivieren",
        description:
          "Aktivieren oder deaktivieren Sie die Rechtschreibprüfung im Chat-Eingabefeld.",
      },
    },
    items: {
      theme: {
        title: "Farbschema",
        description: "Wählen Sie Ihr bevorzugtes Farbschema für die Anwendung.",
      },
      "show-scrollbar": {
        title: "Scrollbar anzeigen",
        description:
          "Aktivieren oder deaktivieren Sie die Scrollbar im Chat-Fenster.",
      },
      "support-email": {
        title: "Support-E-Mail",
        description: "Legen Sie die E-Mail-Adresse für den Kundensupport fest.",
      },
      "app-name": {
        title: "Name",
        description:
          "Geben Sie einen Anwendungsnamen ein, der auf der Login-Seite erscheint.",
      },
      "chat-message-alignment": {
        title: "Nachrichtenanordnung im Chatd",
        description:
          "Bestimmen Sie den Ausrichtungsmodus der Chat-Nachrichten.",
      },
      "display-language": {
        title: "Sprache",
        description:
          "Wählen Sie die bevorzugte Sprache für die Benutzeroberfläche.",
      },
      logo: {
        title: "Eigenes Logo",
        description:
          "Laden Sie Ihr eigenes Logo hoch, das auf allen Seiten angezeigt wird.",
        add: "Eigenes Logo hinzufügen",
        recommended: "Empfohlene Größe: 800 x 200",
        remove: "Löschen",
        replace: "Ersetzen",
      },
      "welcome-messages": {
        title: "Willkommensnachrichten",
        description:
          "Individualisieren Sie die angezeigten Willkommensmitteilungen für Ihre Benutzer. Diese Mitteilungen sehen nur Nicht-Administratoren.",
        new: "Neue Nachricht",
        system: "System",
        user: "Benutzer",
        message: "Nachricht",
        assistant: "AnythingLLM Chat-Assistent",
        "double-click": "Zum Bearbeiten doppelklicken",
        save: "Nachrichten speichern",
      },
      "browser-appearance": {
        title: "Browser-Ansicht",
        description:
          "Individualisieren Sie die Ansicht von Browser-Tab und -Titel, während die App geöffnet ist.",
        tab: {
          title: "Titel",
          description:
            "Bestimmen Sie einen individuellen Tab-Titel, wenn die App im Browser geöffnet ist.",
        },
        favicon: {
          title: "Tab-Icon",
          description: "Nutzen Sie ein eigenes Icon für den Tab im Browser.",
        },
      },
      "sidebar-footer": {
        title: "Fußzeilenelemente der Seitenleiste",
        description:
          "Individualisieren Sie die Elemente in der Fußzeile am unteren Ende der Seitenleiste.",
        icon: "Icon",
        link: "Link",
      },
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
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure-Service-Endpoint",
        api_key: "API-Schlüssel",
        chat_deployment_name: "Name der Chat-Deployment",
        chat_model_token_limit: "Chat-Modell Token-Begrenzung",
        model_type: "Art des Modells",
        default: "Standard",
        reasoning: "Reasoning",
      },
    },
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
      "Einbettbare Chat-Widgets sind öffentlich zugängliche Chat-Schnittstellen, die an einen einzelnen Workspace gebunden sind. Diese ermöglichen es Ihnen, Workspaces zu erstellen, die Sie dann weltweit veröffentlichen können.",
    create: "Einbettung erstellen",
    table: {
      workspace: "Workspace",
      chats: "Gesendete Chats",
      active: "Aktive Domains",
      created: "Erstellt",
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
    obsidian: {
      name: "Obsidian",
      description: "Mit einem Klick Obsidian-Vault importieren.",
      vault_location: "Ort des Vaults",
      vault_description:
        "Ordner des Obsidian-Vaults auswählen, um sämtliche Notizen inkl. Verknüpfungen zu importieren.",
      selected_files: "{{count}} Markdown-Dateien gefunden",
      importing: "Vault wird importiert...",
      import_vault: "Vault importieren",
      processing_time: "Dies kann je nach Größe Ihres Vaults etwas dauern",
      vault_warning:
        "Bitte schließen Sie Ihr Obsidian-Vault, um mögliche Konflikte zu vermeiden.",
    },
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
        "Sobald der Vorgang abgeschlossen ist, sind alle Dateien im Dokumenten-Picker zur Einbettung in Workspaces verfügbar.",
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
        "Sobald der Vorgang abgeschlossen ist, sind alle Dateien im Dokumenten-Picker zur Einbettung in Workspaces verfügbar.",
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
        "Sobald der Vorgang abgeschlossen ist, ist das Transkript im Dokumenten-Picker zur Einbettung in Workspaces verfügbar.",
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
        "Sobald der Vorgang abgeschlossen ist, sind alle gesammelten Inhalte im Dokumenten-Picker zur Einbettung in Workspaces verfügbar.",
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
        "Sobald der Vorgang abgeschlossen ist, ist der Seiteninhalt im Dokumenten-Picker zur Einbettung in Workspaces verfügbar.",
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
      "move-workspace": "In Workspace verschieben",
      name: "Name",
      "delete-confirmation":
        "Sind Sie sicher, dass Sie diese Dateien und Ordner löschen möchten?\nDies wird die Dateien vom System entfernen und sie automatisch aus allen vorhandenen Workspaces entfernen.\nDiese Aktion kann nicht rückgängig gemacht werden.",
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
        "Wenn du ein Dokument <b>beobachtest,</b> werden wir <i>automatisch</i> das Dokument von der Datenquelle in regelmäßigen Abständen aktualisieren. Dadurch wird der Inhalt automatisch in allen Workspaces aktualisiert, wo sich das Dokument befindet.",
      watch_explained_block2:
        "Diese Funktion unterstützt aktuell nur Online-Quellen und ist somit nicht verfügbar für selbst hochgeladene Dokumente",
      watch_explained_block3_start: "Du kannst im ",
      watch_explained_block3_link: "Dateimanager",
      watch_explained_block3_end:
        " entscheiden, welche Dokumente du beobachten möchtest.",
      accept: "Alles klar, ich habe es verstanden.",
    },
  },
  chat_window: {
    welcome: "Willkommen zu deinem Workspace.",
    get_started: "Starte mit ",
    get_started_default: "Starte mit ",
    upload: "dem Upload von Dokumenten",
    or: " oder ",
    attachments_processing: "Anhänge werden verarbeitet. Bitte warten...",
    send_chat: " schreibe im Chat.",
    send_message: "Schreibe eine Nachricht",
    attach_file: "Füge eine Datei zum Chat hinzu",
    slash: "Schau dir alle verfügbaren Slash Befehle für den Chat an.",
    agents: "Schau dir alle verfugbaren Agentenfähigkeiten für den Chat an.",
    text_size: "Ändere die Größe des Textes.",
    microphone: "Spreche deinen Prompt ein.",
    send: "Versende den Prompt an den Workspace.",
    tts_speak_message: "Nachricht vorlesen (TTS)",
    copy: "Kopieren",
    regenerate: "Neu generieren",
    regenerate_response: "Antwort neu generieren",
    good_response: "Gute Antwort",
    more_actions: "Weitere Aktionen",
    hide_citations: "Quellenangaben ausblenden",
    show_citations: "Quellenangaben anzeigen",
    pause_tts_speech_message: "Nachrichtenvorlesung pausieren",
    fork: "Abzweigen",
    delete: "Löschen",
    save_submit: "Speichern und Senden",
    cancel: "Abbrechen",
    edit_prompt: "Prompt bearbeiten",
    edit_response: "Antwort bearbeiten",
    at_agent: "@agent",
    default_agent_description: "– Standardagent für diesen Workspace.",
    custom_agents_coming_soon: "Eigene Agenten bald verfügbar!",
    slash_reset: "/reset",
    preset_reset_description: "hatverlauf löschen und neuen Chat starten",
    add_new_preset: "Neues Preset anlegen",
    command: "Befehl",
    your_command: "dein-befehl",
    placeholder_prompt: "Dieser Text wird vor deinem Prompt eingefügt.",
    description: "Beschreibung",
    placeholder_description: "Antwortet mit einem Gedicht über LLMs.",
    save: "Speichern",
    small: "Klein",
    normal: "Standard",
    large: "Groß",
    workspace_llm_manager: {
      search: "LLM-Provider durchsuchen",
      loading_workspace_settings: "Workspace-Einstellungen werden geladen",
      available_models: "Verfügbare Modelle von {{provider}}",
      available_models_description:
        "Wählen Sie ein Modell für diesen Workspace",
      save: "Modell verwenden",
      saving: "Standardmodell für Workspace wird eingestellt...",
      missing_credentials: "Für diesen Anbieter fehlen Anmeldedaten!",
      missing_credentials_description: "Klicken, um Zugangsdaten einzurichten",
    },
  },
  profile_settings: {
    edit_account: "Account bearbeiten",
    profile_picture: "Profilbild",
    remove_profile_picture: "Profilbild entfernen",
    username: "Nutzername",
    username_description:
      "Der Nutzername darf nur kleine Buchstaben, Zahlen, Unterstrich und Bindestriche ohne Leerzeichen.",
    new_password: "Neues Passwort",
    password_description: "Das Passwort muss mindestens 8 Zeichen haben.",
    cancel: "Abbrechen",
    update_account: "Account updaten",
    theme: "Bevozugtes Design",
    language: "Bevorzugte Sprache",
    failed_upload: "Profilbild konnte nicht hochgeladen werden: {{error}}",
    upload_success: "Profilbild hochgeladen.",
    failed_remove: "Profilbild konnte nicht entfernt werden: {{error}}",
    profile_updated: "Profil wurde aktualisiert.",
    failed_update_user: "Benutzer konnte nicht aktualisiert werden: {{error}}",
    account: "Account",
    support: "Support",
    signout: "Abmelden",
  },
  "keyboard-shortcuts": {
    title: "Tastaturkürzel",
    shortcuts: {
      settings: "Einstellungen öffnen",
      workspaceSettings: "Workspace Einstellungen öffnen",
      home: "Zur Startseite",
      workspaces: "Workspaces verwalten",
      apiKeys: "API-Schlüssel Einstellungen",
      llmPreferences: "LLM-Einstellungen",
      chatSettings: "Chat Einstellungen",
      help: "Tastenkürzel Hilfe anzeigen",
      showLLMSelector: "LLM-Auswahl für Workspace zeigen",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        submit: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
      agent_flow: {
        public_description: null,
        private_description: null,
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        publish_button: null,
        submitting: null,
        submit: null,
        privacy_note: null,
      },
      generic: {
        unauthenticated: {
          title: null,
          description: null,
          button: null,
        },
      },
      slash_command: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        command_label: null,
        command_description: null,
        command_placeholder: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
    },
  },
};

export default TRANSLATIONS;
