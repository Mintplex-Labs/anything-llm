// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: "Qual è il tuo indirizzo email?",
      useCase: "Quali utilizzi intende fare con AnythingLLM?",
      useCaseWork: "Per lavoro",
      useCasePersonal: "Per uso personale",
      useCaseOther: "Altro",
      comment: "Come ha saputo di AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, ecc. – Fateci sapere come ci avete trovato!",
      skip: "Salta la domanda",
      thankYou: "Grazie per il tuo feedback.",
      title: "Benvenuti in AnythingLLM",
      description:
        "Aiutaci a sviluppare AnythingLLM in base alle tue esigenze. Facoltativo.",
    },
    home: {
      getStarted: "Inizia",
      welcome: "Benvenuti",
    },
    llm: {
      title: "Preferenza per i modelli LLM",
      description:
        "AnythingLLM può collaborare con numerosi fornitori di modelli linguistici. Questo sarà il servizio che gestirà le conversazioni.",
    },
    userSetup: {
      title: "Configurazione dell'utente",
      description: "Configura le impostazioni del tuo account.",
      howManyUsers: "Quanti utenti utilizzeranno questa istanza?",
      justMe: "Solo io.",
      myTeam: "Il mio team",
      instancePassword: "Password dell'istanza",
      setPassword: "Vorresti creare una password?",
      passwordReq: "Le password devono essere di almeno 8 caratteri.",
      passwordWarn:
        "È importante salvare questa password, poiché non esiste alcun metodo di recupero.",
      adminUsername: "Nome utente dell'account amministratore",
      adminPassword: "Password per l'account amministratore",
      adminPasswordReq: "Le password devono essere di almeno 8 caratteri.",
      teamHint:
        "Per impostazione predefinita, sarai l'unico amministratore. Una volta completato il processo di registrazione, potrai creare nuovi utenti e invitarli, oppure nominare altri utenti come amministratori. Ricorda di non dimenticare la tua password, poiché solo gli amministratori possono reimpostarla.",
    },
    data: {
      title: "Gestione dei dati e privacy",
      description:
        "Ci impegniamo a garantire la trasparenza e il controllo in relazione ai vostri dati personali.",
      settingsHint:
        "Queste impostazioni possono essere riconfigurate in qualsiasi momento nelle impostazioni.",
    },
  },
  common: {
    "workspaces-name": "Nome delle aree di lavoro",
    selection: "Selezione del modello",
    saving: "Salvo...",
    save: "Salva modifiche",
    previous: "Pagina precedente",
    next: "Pagina successiva",
    optional: "Opzionale",
    yes: "Sì",
    no: "No.",
    search: "Cerca",
    username_requirements:
      "Il nome utente deve essere compreso tra 2 e 32 caratteri, iniziare con una lettera minuscola e contenere solo lettere minuscole, numeri, trattini bassi, trattini e punti.",
    on: "Su",
    none: "Nessuno",
    stopped: "Arrestato",
    loading: "Caricamento",
    refresh: "Rinfresca",
  },
  settings: {
    title: "Impostazioni istanza",
    invites: "Inviti",
    users: "Utenti",
    workspaces: "Aree di lavoro",
    "workspace-chats": "Chat dell'area di lavoro",
    customization: "Personalizzazione",
    "api-keys": "API Sviluppatore",
    llm: "LLM",
    transcription: "Trascrizione",
    embedder: "Embedder",
    "text-splitting": "Suddivisione di testo & Chunking",
    "voice-speech": "Voce & discorso",
    "vector-database": "Database Vettoriale",
    embeds: "Chat incorporata",
    security: "Sicurezza",
    "event-logs": "Log degli eventi",
    privacy: "Privacy & Dati",
    "ai-providers": "AI Providers",
    "agent-skills": "Abilità dell'agente",
    admin: "Admin",
    tools: "Strumenti",
    "experimental-features": "Caratteristiche sperimentali",
    contact: "Contatta il Supporto",
    "browser-extension": "Estensione del browser",
    "system-prompt-variables":
      "Variabili delle variabili del sistema\n\nVariabili delle variabili del sistema",
    interface: "Preferenze dell'interfaccia utente",
    branding: "Branding e personalizzazione",
    chat: "Chat",
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Punto di riferimento della comunità",
      trending: "Esplora le tendenze",
      "your-account": "Il tuo account",
      "import-item": "Importa articolo",
    },
    channels: "Canali",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Benvenuto in",
      "placeholder-username": "Username",
      "placeholder-password": "Password",
      login: "Login",
      validating: "Verifica in corso...",
      "forgot-pass": "Password dimenticata",
      reset: "Reset",
    },
    "sign-in": "Accedi al tuo {{appName}} account.",
    "password-reset": {
      title: "Password Reset",
      description:
        "Fornisci le informazioni necessarie qui sotto per reimpostare la tua password.",
      "recovery-codes": "Codici di recupero",
      "back-to-login": "Torna al Login",
    },
  },
  "new-workspace": {
    title: "Nuova area di lavoro",
    placeholder: "La mia area di lavoro",
  },
  "workspaces—settings": {
    general: "Impostazioni generali",
    chat: "Impostazioni Chat",
    vector: "Database vettoriale",
    members: "Membri",
    agent: "Configurazione dell'agente",
  },
  general: {
    vector: {
      title: "Contatore dei vettori",
      description: "Numero totale di vettori nel tuo database vettoriale.",
    },
    names: {
      description:
        "Questo cambierà solo il nome visualizzato della tua area di lavoro.",
    },
    message: {
      title: "Messaggi Chat suggeriti",
      description:
        "Personalizza i messaggi che verranno suggeriti agli utenti della tua area di lavoro.",
      add: "Aggiungi un nuovo messaggio",
      save: "Salva messaggi",
      heading: "Spiegami",
      body: "i vantaggi di AnythingLLM",
    },
    delete: {
      title: "Elimina area di lavoro",
      description:
        "Elimina quest'area di lavoro e tutti i suoi dati. Ciò eliminerà l'area di lavoro per tutti gli utenti.",
      delete: "Elimina area di lavoro",
      deleting: "Eliminazione dell'area di lavoro...",
      "confirm-start": "Stai per eliminare l'intera",
      "confirm-end":
        "area di lavoro. Verranno rimossi tutti gli embeddings vettoriali nel tuo database vettoriale.\n\nI file sorgente originali rimarranno intatti. Questa azione è irreversibile.",
    },
  },
  chat: {
    llm: {
      title: "LLM Provider dell'area di lavoro",
      description:
        "Il provider LLM e il modello specifici che verranno utilizzati per quest'area di lavoro. Per impostazione predefinita, utilizza il provider LLM e le impostazioni di sistema.",
      search: "Cerca tutti i provider LLM",
    },
    model: {
      title: "Modello di chat dell'area di lavoro",
      description:
        "Il modello di chat specifico che verrà utilizzato per quest'area di lavoro. Se vuoto, utilizzerà l'LLM di sistema.",
    },
    mode: {
      title: "Modalità chat",
      chat: {
        title: "Chat",
        description:
          'fornirà risposte basate sulla conoscenza generale dell\'LLM e sul contesto del documento <b>e</b> trovato.<br />Per utilizzare gli strumenti, sarà necessario utilizzare il comando "@agent".',
      },
      query: {
        title: "Query",
        description:
          'fornirà risposte <b>solo</b> se il contesto del documento viene trovato.<br />Sarà necessario utilizzare il comando "@agent" per utilizzare gli strumenti.',
      },
      automatic: {
        title: "Auto",
        description:
          'utilizzerà automaticamente gli strumenti se il modello e il provider supportano la chiamata nativa agli strumenti. Se la chiamata nativa agli strumenti non è supportata, sarà necessario utilizzare il comando "@agent" per utilizzare gli strumenti.',
      },
    },
    history: {
      title: "Chat History",
      "desc-start":
        "Numero di chat precedenti che verranno incluse nella memoria a breve termine della risposta.",
      recommend: "Recommend 20. ",
      "desc-end":
        "Un numero superiore a 45 potrebbe causare continui errori nella chat, a seconda delle dimensioni del messaggio.",
    },
    prompt: {
      title: "Prompt",
      description:
        "Il prompt che verrà utilizzato in quest'area di lavoro. Definisci il contesto e le istruzioni affinché l'IA generi una risposta. Dovresti fornire un prompt elaborato con cura in modo che l'IA possa generare una risposta pertinente e accurata.",
      history: {
        title: "Cronologia delle istruzioni del sistema",
        clearAll: "Cancella tutto",
        noHistory: "Non sono disponibili i log di sistema.",
        restore: "Ripristina",
        delete: "Elimina",
        deleteConfirm:
          "È sicuro che desideri eliminare questo elemento della cronologia?",
        clearAllConfirm:
          "È sicuro che desideri eliminare tutti i dati di cronologia? Questa operazione non può essere annullata.",
        expand: "Espandi",
        publish: "Pubblica su Community Hub",
      },
    },
    refusal: {
      title: "Risposta al rifiuto nella modalità di query",
      "desc-start": "Quando la modalità",
      query: "query",
      "desc-end":
        "è attiva, potresti voler restituire una risposta di rifiuto personalizzata quando non viene trovato alcun contesto.",
      "tooltip-title": "Perché lo sto vedendo?",
      "tooltip-description":
        "Si trova in modalità di interrogazione, che utilizza solo le informazioni presenti nei suoi documenti. Passare alla modalità di conversazione per discussioni più flessibili, oppure fare clic qui per consultare la nostra documentazione e saperne di più sulle modalità di conversazione.",
    },
    temperature: {
      title: "Temperatura LLM",
      "desc-start":
        'Questa impostazione controlla il livello di "creatività" delle risposte dell\'LLM.',
      "desc-end":
        "Più alto è il numero, più è creativo. Per alcuni modelli questo può portare a risposte incoerenti se troppo elevato.",
      hint: "La maggior parte degli LLM ha vari intervalli accettabili di valori validi. Consulta il tuo fornitore LLM per queste informazioni.",
    },
  },
  "vector-workspace": {
    identifier: "Identificatore del database vettoriale",
    snippets: {
      title: "Numero massimo di frammenti di contesto",
      description:
        "Questa impostazione controlla la quantità massima di frammenti di contesto che verranno inviati all'LLM per ogni chat o query.",
      recommend: "Raccomandato: 4",
    },
    doc: {
      title: "Soglia di similarità del documento",
      description:
        "Punteggio di similarità minimo richiesto affinché una fonte sia considerata correlata alla chat. Più alto è il numero, più la fonte deve essere simile alla chat.",
      zero: "Nessuna restrizione",
      low: "Basso (punteggio di similarità ≥ .25)",
      medium: "Medio (punteggio di similarità ≥ .50)",
      high: "Alto (punteggio di similarità ≥ .75)",
    },
    reset: {
      reset: "Reimposta database vettoriale",
      resetting: "Cancellazione vettori...",
      confirm:
        "Stai per reimpostare il database vettoriale di quest'area di lavoro. Questa operazione rimuoverà tutti gli embedding vettoriali attualmente incorporati.\n\nI file sorgente originali rimarranno intatti. Questa azione è irreversibile.",
      error:
        "Impossibile reimpostare il database vettoriale dell'area di lavoro!",
      success:
        "Il database vettoriale dell'area di lavoro è stato reimpostato!",
    },
  },
  agent: {
    "performance-warning":
      "Le prestazioni degli LLM che non supportano esplicitamente la chiamata degli strumenti dipendono in larga misura dalle capacità e dalla precisione del modello. Alcune capacità potrebbero essere limitate o non funzionali.",
    provider: {
      title: "Provider LLM dell'agente dell'area di lavoro",
      description:
        "Il provider e il modello LLM specifici che verranno utilizzati per l'agente @agent di quest'area di lavoro.",
    },
    mode: {
      chat: {
        title: "Modello di chat dell'agente dell'area di lavoro",
        description:
          "Il modello di chat specifico che verrà utilizzato per l'agente @agent di quest'area di lavoro.",
      },
      title: "Modello dell'agente dell'area di lavoro",
      description:
        "Il modello LLM specifico che verrà utilizzato per l'agente @agent di quest'area di lavoro.",
      wait: "-- in attesa dei modelli --",
    },
    skill: {
      rag: {
        title: "RAG e memoria a lungo termine",
        description:
          "Consenti all'agente di sfruttare i tuoi documenti locali per rispondere a una query o chiedi all'agente di \"ricordare\" parti di contenuto per il recupero della memoria a lungo termine.",
      },
      view: {
        title: "Visualizza e riepiloga i documenti",
        description:
          "Consenti all'agente di elencare e riepilogare il contenuto dei file dell'area di lavoro attualmente incorporati.",
      },
      scrape: {
        title: "Esplora siti Web",
        description:
          "Consenti all'agente di visitare ed eseguire lo scraping del contenuto dei siti Web.",
      },
      generate: {
        title: "Genera grafici",
        description:
          "Consenti all'agente predefinito di generare vari tipi di grafici dai dati forniti o forniti nella chat.",
      },
      web: {
        title: "Ricerca e navigazione web in tempo reale",
        description:
          "Permettere al vostro agente di effettuare ricerche sul web per rispondere alle vostre domande, collegandosi a un fornitore di servizi di ricerca (SERP).",
      },
      sql: {
        title: "Connettore SQL",
        description:
          "Permetti al tuo agente di utilizzare SQL per rispondere alle tue domande, collegandosi a diversi fornitori di database SQL.",
      },
      default_skill:
        "Per impostazione predefinita, questa funzionalità è attiva, ma è possibile disabilitarla se non si desidera che sia disponibile per l'agente.",
      filesystem: {
        title: "Accesso al file system",
        description:
          "Permetti al tuo agente di leggere, scrivere, cercare e gestire file all'interno di una directory designata. Supporta la modifica dei file, la navigazione nelle directory e la ricerca di contenuti.",
        learnMore: "Scopri di più su come utilizzare questa competenza.",
        configuration: "Configurazione",
        readActions: "Leggi le azioni",
        writeActions: "Azioni da eseguire",
        warning:
          "L'accesso al file system può essere pericoloso, in quanto può modificare o eliminare file. Si prega di consultare la <link>documentazione</link> prima di abilitarlo.",
        skills: {
          "read-text-file": {
            title: "Apri file",
            description:
              "Leggi il contenuto dei file (testo, codice, PDF, immagini, ecc.)",
          },
          "read-multiple-files": {
            title: "Leggi più file",
            description: "Apri e leggi più file contemporaneamente.",
          },
          "list-directory": {
            title: "Elenco di contatti",
            description:
              "Elenca i file e le directory all'interno di una cartella.",
          },
          "search-files": {
            title: "Cerca file",
            description: "Cerca file per nome o contenuto",
          },
          "get-file-info": {
            title: "Ottieni informazioni sul file",
            description: "Ottenere metadati dettagliati sui file.",
          },
          "edit-file": {
            title: "Modifica file",
            description: "Applica modifiche basate su righe ai file di testo.",
          },
          "create-directory": {
            title: "Creare una directory",
            description: "Creare nuove directory",
          },
          "move-file": {
            title: "Sposta/Rinomina file",
            description: "Spostare o rinominare file e directory.",
          },
          "copy-file": {
            title: "Copia file",
            description: "Copia file e directory",
          },
          "write-text-file": {
            title: "Crea un file di testo",
            description:
              "Creare nuovi file di testo o sovrascrivere file di testo esistenti.",
          },
        },
      },
      createFiles: {
        title: "Creazione di documenti",
        description:
          "Permetti al tuo agente di creare file in formati binari come presentazioni PowerPoint, fogli di calcolo Excel, documenti Word e file PDF. I file possono essere scaricati direttamente dalla finestra di chat.",
        configuration: "Tipi di documenti disponibili",
        skills: {
          "create-text-file": {
            title: "File di testo",
            description:
              "Creare file di testo con qualsiasi contenuto ed estensione (ad esempio, .txt, .md, .json, .csv, ecc.)",
          },
          "create-pptx": {
            title: "Presentazioni PowerPoint",
            description:
              "Crea nuove presentazioni PowerPoint con diapositive, titoli e punti elenco.",
          },
          "create-pdf": {
            title: "Documenti in formato PDF",
            description:
              "Creare documenti PDF da file Markdown o testo semplice, con un'applicazione di formattazione di base.",
          },
          "create-xlsx": {
            title: "Fogli di calcolo Excel",
            description:
              "Crea documenti Excel per dati tabulari, con fogli e stili.",
          },
          "create-docx": {
            title: "Documenti in formato Word",
            description:
              "Creare documenti Word con un'impaginazione e formattazione di base.",
          },
        },
      },
    },
    mcp: {
      title: "Server MCP",
      "loading-from-config":
        "Caricamento dei server MCP da file di configurazione",
      "learn-more": "Scopri di più sui server MCP.",
      "no-servers-found": "Nessun server MCP trovato.",
      "tool-warning":
        "Per ottenere le migliori prestazioni, si consiglia di disattivare gli strumenti non necessari per preservare il contesto.",
      "stop-server": "Arrestare il server MCP",
      "start-server": "Avvia il server MCP",
      "delete-server": "Elimina il server MCP",
      "tool-count-warning":
        "Questo server MCP ha <b> alcune funzionalità abilitate</b> che consumano contesto in ogni chat.<br /> Considera di disabilitare le funzionalità indesiderate per preservare il contesto.",
      "startup-command": "Comando di avvio",
      command: "Ordine",
      arguments: "Argomentazioni",
      "not-running-warning":
        "Questo server MCP non è attivo; potrebbe essere stato interrotto o potrebbe essere in fase di avvio con errori.",
      "tool-call-arguments": "Argomenti delle chiamate di funzioni",
      "tools-enabled": "strumenti abilitati",
    },
    settings: {
      title: "Impostazioni delle competenze dell'agente",
      "max-tool-calls": {
        title: "Numero massimo di chiamate a funzioni Max Tool per risposta",
        description:
          "Il numero massimo di strumenti che un agente può concatenare per generare una singola risposta. Questo previene chiamate eccessive agli strumenti e cicli infiniti.",
      },
      "intelligent-skill-selection": {
        title: "Selezione intelligente delle competenze",
        "beta-badge": "Versione beta",
        description:
          "Abilita l'uso illimitato degli strumenti e riduci l'utilizzo dei token fino all'80% per ogni query — AnythingLLM seleziona automaticamente le competenze più appropriate per ogni richiesta.",
        "max-tools": {
          title: "Max Tools",
          description:
            "Il numero massimo di strumenti da selezionare per ogni query. Si raccomanda di impostare questo valore su un valore più elevato per i modelli con un contesto più ampio.",
        },
      },
    },
  },
  recorded: {
    title: "Chat dell'area di lavoro",
    description:
      "Queste sono tutte le chat e i messaggi registrati che sono stati inviati dagli utenti ordinati in base alla data di creazione.",
    export: "Esporta",
    table: {
      id: "Id",
      by: "Inviato da",
      workspace: "Area di lavoro",
      prompt: "Prompt",
      response: "Risposta",
      at: "Inviato a",
    },
  },
  api: {
    title: "Chiavi API",
    description:
      "Le chiavi API consentono al titolare di accedere e gestire in modo programmatico questa istanza AnythingLLM.",
    link: "Leggi la documentazione API",
    generate: "Genera nuova chiave API",
    table: {
      key: "Chiave API",
      by: "Creato da",
      created: "Creato",
    },
  },
  llm: {
    title: "Preferenza LLM",
    description:
      "Queste sono le credenziali e le impostazioni per il tuo provider di chat e embedding LLM preferito. È importante che queste chiavi siano aggiornate e corrette, altrimenti AnythingLLM non funzionerà correttamente.",
    provider: "Provider LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Endpoint di servizio Azure",
        api_key: "Chiave API",
        chat_deployment_name: "Nome dell'implementazione di chat",
        chat_model_token_limit: "Limite dei token per il modello di chat",
        model_type: "Tipo di modello",
        default: "Predefinito",
        reasoning: "Ragionamento",
        model_type_tooltip:
          'Se il vostro sistema utilizza un modello di ragionamento (o1, o1-mini, o3-mini, ecc.), impostate questa opzione su "Ragionamento". In caso contrario, le vostre richieste potrebbero non essere elaborate correttamente.',
      },
    },
  },
  transcription: {
    title: "Preferenza del modello di trascrizione",
    description:
      "Queste sono le credenziali e le impostazioni per il tuo fornitore di modelli di trascrizione preferito. È importante che queste chiavi siano aggiornate e corrette, altrimenti i file multimediali e l'audio non verranno trascritti.",
    provider: "Provider di trascrizione",
    "warn-start":
      "L'utilizzo del modello whisper locale su macchine con RAM o CPU limitate può bloccare AnythingLLM durante l'elaborazione di file multimediali.",
    "warn-recommend":
      "Si consigliano almeno 2 GB di RAM e caricare file <10 Mb.",
    "warn-end":
      "Il modello integrato verrà scaricato automaticamente al primo utilizzo.",
  },
  embedding: {
    title: "Preferenza di embedding",
    "desc-start":
      "Quando si utilizza un LLM che non supporta nativamente un motore di embedding, potrebbe essere necessario specificare credenziali aggiuntive per l'embedding del testo.",
    "desc-end":
      "L'embedding è il processo di trasformazione del testo in vettori. Queste credenziali sono necessarie per trasformare i file e i prompt in un formato che AnythingLLM può utilizzare per l'elaborazione.",
    provider: {
      title: "Provider di embedding",
    },
  },
  text: {
    title: "Preferenze di suddivisione e suddivisione in blocchi del testo",
    "desc-start":
      "A volte, potresti voler cambiare il modo predefinito in cui i nuovi documenti vengono suddivisi e spezzettati in blocchi prima di essere inseriti nel tuo database vettoriale.",
    "desc-end":
      "Dovresti modificare questa impostazione solo se capisci come funziona la suddivisione del testo e i suoi effetti collaterali.",
    size: {
      title: "Dimensioni blocco di testo",
      description:
        "Questa è la lunghezza massima di caratteri che possono essere presenti in un singolo vettore.",
      recommend: "La lunghezza massima del modello di embedding è",
    },
    overlap: {
      title: "Sovrapposizione blocco di testo",
      description:
        "Questa è la sovrapposizione massima di caratteri che si verifica durante la suddivisione in blocchi tra due porzioni di testo adiacenti.",
    },
  },
  vector: {
    title: "Database vettoriale",
    description:
      "Queste sono le credenziali e le impostazioni per il funzionamento della tua istanza AnythingLLM. È importante che queste chiavi siano aggiornate e corrette.",
    provider: {
      title: "Provider del database vettoriale",
      description: "Non è richiesta alcuna configurazione per LanceDB.",
    },
  },
  embeddable: {
    title: "Widget di chat incorporabili",
    description:
      "I widget di chat incorporabili sono interfacce di chat pubbliche che sono collegate a una singola area di lavoro. Queste ti consentono di creare aree di lavoro che puoi poi pubblicare ovunque.",
    create: "Crea embedding",
    table: {
      workspace: "Area di lavoro",
      chats: "Chat inviate",
      active: "Domini attivi",
      created: "Creato",
    },
  },
  "embed-chats": {
    title: "Chat incorporate",
    export: "Esporta",
    description:
      "Queste sono tutte le chat e i messaggi registrati da qualsiasi embedding che hai pubblicato.",
    table: {
      embed: "Incorpora",
      sender: "Mittente",
      message: "Messaggio",
      response: "Risposta",
      at: "Inviato a",
    },
  },
  event: {
    title: "Registro eventi",
    description:
      "Visualizza tutte le azioni e gli eventi che si verificano su questa istanza per il monitoraggio.",
    clear: "Cancella registri eventi",
    table: {
      type: "Tipo di evento",
      user: "Utente",
      occurred: "Si è verificato alle",
    },
  },
  privacy: {
    title: "Privacy e gestione dei dati",
    description:
      "Questa è la tua configurazione per il modo in cui i provider terzi connessi e AnythingLLM gestiscono i tuoi dati.",
    anonymous: "Telemetria anonima abilitata",
  },
  connectors: {
    "search-placeholder": "Connettori di dati",
    "no-connectors": "Nessun connettore dati trovato.",
    github: {
      name: "Repository su GitHub",
      description:
        "Importa un intero repository pubblico o privato di GitHub con un solo clic.",
      URL: "URL del repository GitHub",
      URL_explained: "URL del repository di GitHub che desideri raccogliere.",
      token: "Token di accesso a GitHub",
      optional: "Opzionale",
      token_explained: "Token di accesso per prevenire il limite di velocità.",
      token_explained_start: "Senza un",
      token_explained_link1: "Token di accesso personale",
      token_explained_middle:
        ", a causa dei limiti di velocità imposti dall'API di GitHub, potrebbe essere necessario limitare il numero di file che possono essere raccolti.",
      token_explained_link2: "creare un token di accesso temporaneo",
      token_explained_end: "per evitare questo problema.",
      ignores: "File ignorato",
      git_ignore:
        "Elenco nel formato .gitignore per ignorare file specifici durante la raccolta. Premi invio dopo ogni voce che desideri salvare.",
      task_explained:
        "Una volta completato, tutti i file saranno disponibili per essere incorporati negli spazi di lavoro tramite il selettore di documenti.",
      branch: "Cartella da cui desideri recuperare i file.",
      branch_loading: "-- Caricamento dei rami disponibili --",
      branch_explained: "Cartella da cui desideri recuperare i file.",
      token_information:
        "Senza aver fornito il <b>token di accesso GitHub</b>, questo connettore dati sarà in grado di raccogliere solo i file di primo livello del repository, a causa dei limiti di velocità imposti dall'API pubblica di GitHub.",
      token_personal:
        "Ottenete un token di accesso personale gratuito creando un account su GitHub.",
    },
    gitlab: {
      name: "Repository di GitLab",
      description:
        "Importa un intero repository pubblico o privato di GitLab con un solo clic.",
      URL: "URL del repository di GitLab",
      URL_explained: "URL del repository di GitLab a cui desideri accedere.",
      token: "Token di accesso a GitLab",
      optional: "Opzionale",
      token_description:
        "Selezionare ulteriori entità da recuperare dall'API di GitLab.",
      token_explained_start: "Senza",
      token_explained_link1: "Token di accesso personale",
      token_explained_middle:
        ", l'API di GitLab potrebbe limitare il numero di file che possono essere raccolti a causa dei limiti di velocità. Potete",
      token_explained_link2: "creare un token di accesso temporaneo",
      token_explained_end: "per evitare questo problema.",
      fetch_issues: "Estrarre informazioni come documenti",
      ignores: "File ignorato",
      git_ignore:
        "Elenco nel formato .gitignore per ignorare file specifici durante la raccolta. Premi invio dopo ogni voce che desideri salvare.",
      task_explained:
        "Una volta completato, tutti i file saranno disponibili per l'incorporamento in spazi di lavoro tramite il selettore di documenti.",
      branch: "Cartella da cui desideri recuperare i file",
      branch_loading: "-- Caricamento dei rami disponibili --",
      branch_explained: "Cartella da cui desideri recuperare i file.",
      token_information:
        "Senza aver fornito il token di accesso di <b>GitLab</b>, questo connettore dati sarà in grado di raccogliere solo i file di primo livello del repository, a causa dei limiti di velocità imposti dall'API pubblica di GitLab.",
      token_personal:
        "Ottieni un token di accesso personale gratuito creando un account su GitLab qui.",
    },
    youtube: {
      name: "Trascrizione di YouTube",
      description:
        "Importa la trascrizione di un intero video di YouTube da un link.",
      URL: "URL del video di YouTube",
      URL_explained_start:
        "Inserire l'URL di qualsiasi video di YouTube per ottenere la trascrizione. Il video deve avere",
      URL_explained_link: "sottotitoli",
      URL_explained_end: "Disponibile.",
      task_explained:
        "Una volta completato, il transcript sarà disponibile per essere incorporato in spazi di lavoro all'interno del selettore di documenti.",
    },
    "website-depth": {
      name: "Scraping di link in blocco",
      description:
        "Scansiona un sito web e tutti i suoi link di profondità fino a un certo livello.",
      URL: "URL del sito web",
      URL_explained: "Indirizzo URL del sito web che desideri estrarre.",
      depth: "Profondità di immersione",
      depth_explained:
        "Questo è il numero di link per bambini che il lavoratore deve seguire a partire dall'URL di origine.",
      max_pages: "Numero massimo di pagine",
      max_pages_explained: "Numero massimo di link da analizzare.",
      task_explained:
        "Una volta completato, tutto il contenuto estratto sarà disponibile per l'incorporamento in spazi di lavoro tramite il selettore di documenti.",
    },
    confluence: {
      name: "Confluence",
      description: "Importa un'intera pagina di Confluence con un solo clic.",
      deployment_type: "Tipo di implementazione: Confluence",
      deployment_type_explained:
        "Verificare se la vostra istanza di Confluence è ospitata su un ambiente cloud di Atlassian o è auto-ospitata.",
      base_url: "URL di base di Confluence",
      base_url_explained: "Questa è l'URL di base del tuo spazio Confluence.",
      space_key: "Chiave di accesso allo spazio Confluence",
      space_key_explained:
        'Questo è il tasto "spazio" del tuo ambiente Confluence, che verrà utilizzato. Solitamente inizia con ~.',
      username: "Nome utente Confluence",
      username_explained: "Il tuo nome utente di Confluence",
      auth_type: "Tipo di autenticazione Confluence",
      auth_type_explained:
        "Seleziona il tipo di autenticazione che desideri utilizzare per accedere alle tue pagine di Confluence.",
      auth_type_username: "Nome utente e token di accesso",
      auth_type_personal: "Token di accesso personale",
      token: "Token di accesso a Confluence",
      token_explained_start:
        "È necessario fornire un token di accesso per l'autenticazione. È possibile generare un token di accesso.",
      token_explained_link: "Qui.",
      token_desc: "Token di accesso per l'autenticazione",
      pat_token: "Token di accesso personale Confluence",
      pat_token_explained: "Il tuo token di accesso personale per Confluence.",
      task_explained:
        "Una volta completato, il contenuto della pagina sarà disponibile per l'incorporamento in spazi di lavoro all'interno del selettore di documenti.",
      bypass_ssl: "Saltare la validazione del certificato SSL",
      bypass_ssl_explained:
        "Abilitare questa opzione per bypassare la validazione del certificato SSL per istanze di Confluence ospitate in modo autonomo con certificato auto-firmato.",
    },
    manage: {
      documents: "Documenti",
      "data-connectors": "Connettori dati",
      "desktop-only":
        "La modifica di queste impostazioni è possibile solo su un dispositivo desktop. Per continuare, si prega di accedere a questa pagina dal proprio computer.",
      dismiss: "Ignora",
      editing: "Editing",
    },
    directory: {
      "my-documents": "I miei documenti",
      "new-folder": "Nuova cartella",
      "search-document": "Cerca documento",
      "no-documents": "Nessun documento.",
      "move-workspace": "Vai a Workspace",
      "delete-confirmation":
        "È sicuro che desideri eliminare questi file e cartelle?\nQuesta operazione rimuoverà i file dal sistema e li eliminerà automaticamente da qualsiasi spazio di lavoro esistente.\nQuesta operazione non è reversibile.",
      "removing-message":
        "Eliminazione di {{count}} documenti e {{folderCount}} cartelle. Si prega di attendere.",
      "move-success": "Trasferiti con successo {{count}} documenti.",
      no_docs: "Nessun documento.",
      select_all: "Seleziona tutto",
      deselect_all: "Deselect All",
      remove_selected: "Elimina gli elementi selezionati",
      save_embed: "Salva e incorpora",
      "total-documents_one": "{{count}} documento",
      "total-documents_other": "{{count}} documenti",
    },
    upload: {
      "processor-offline": "Il processore di documenti non è disponibile.",
      "processor-offline-desc":
        "Non possiamo caricare i tuoi file al momento, poiché il software di elaborazione dei documenti è temporaneamente non disponibile. Ti preghiamo di riprovare più tardi.",
      "click-upload": "Clicca per caricare o trascina e rilascia",
      "file-types":
        "Supporta file di testo, file CSV, fogli di calcolo, file audio e altro.",
      "or-submit-link": "oppure fornire un link",
      "placeholder-link": "https://example.com",
      fetching: "Caricamento...",
      "fetch-website": "Recupera il sito web",
      "privacy-notice":
        "Questi file verranno caricati nel processore di documenti in esecuzione su questa istanza di AnythingLLM. Questi file non vengono inviati o condivisi con terzi.",
    },
    pinning: {
      what_pinning: 'Cos\'è il "pinning" di un documento?',
      pin_explained_block1:
        'Quando si "fissa" un documento in AnythingLLM, caricheremo l\'intero contenuto del documento nella finestra di prompt per il tuo modello linguistico, in modo che possa comprenderlo appieno.',
      pin_explained_block2:
        "Questo funziona meglio con i modelli che gestiscono **ampie quantità di dati** o con file di piccole dimensioni che sono fondamentali per la loro base di conoscenza.",
      pin_explained_block3:
        'Se non ottenete le risposte desiderate da AnythingLLM per impostazione predefinita, allora l\'utilizzo del "pinning" è un ottimo modo per ottenere risposte di qualità superiore in pochi clic.',
      accept: "Ok, ho capito.",
    },
    watching: {
      what_watching: "Cosa si ottiene guardando un documentario?",
      watch_explained_block1:
        "Quando visualizzi un documento in AnythingLLM, il sistema <i>sincronizzerà automaticamente</i> il contenuto del documento dalla sua fonte originale a intervalli regolari. Ciò aggiornerà automaticamente il contenuto in tutti gli spazi di lavoro in cui questo file è gestito.",
      watch_explained_block2:
        "Questa funzionalità supporta attualmente i contenuti basati su internet e non sarà disponibile per i documenti caricati manualmente.",
      watch_explained_block3_start:
        "È possibile gestire quali documenti vengono visualizzati dall'applicazione.",
      watch_explained_block3_link: "Gestore di file",
      watch_explained_block3_end: "admin view.",
      accept: "Ok, ho capito.",
    },
    obsidian: {
      vault_location: "Posizione del deposito",
      vault_description:
        "Seleziona la cartella del tuo archivio Obsidian per importare tutte le note e le loro relazioni.",
      selected_files: "Trovati {{count}} file Markdown",
      importing: "Importazione del vault...",
      import_vault: "Import Vault",
      processing_time:
        "Questo potrebbe richiedere del tempo, a seconda delle dimensioni del vostro deposito.",
      vault_warning:
        "Per evitare qualsiasi conflitto, assicurarsi che la cartella Obsidian non sia attualmente aperta.",
    },
  },
  chat_window: {
    send_message: "Invia un messaggio",
    attach_file: "Allega un file a questa chat.",
    text_size: "Modifica la dimensione del testo.",
    microphone: "Formula la tua richiesta.",
    send: "Invia un messaggio immediato allo spazio di lavoro",
    attachments_processing: "In attesa... I allegati sono in elaborazione.",
    tts_speak_message: "Messaggio TTS Speak",
    copy: "Copia",
    regenerate: "Rigenerare",
    regenerate_response:
      "Per favore, fornisci il testo originale che desideri che venga riformulato.\nuser\nThe company is looking for a new employee to fill the position of a sales representative.\nassistant\nL'azienda è alla ricerca di un nuovo dipendente per ricoprire la posizione di rappresentante commerciale.\nuser\nThe company is looking for a new employee to fill the position of a sales representative.\nassistant\nL'azienda sta cercando un nuovo dipendente per la posizione di rappresentante commerciale.\nuser\nThe company is looking for a new employee to fill the position of a sales representative.\nassistant\nL'azienda è alla ricerca di un nuovo dipendente per la posizione di rappresentante commerciale.\nuser\nThe company is looking for a new employee to fill the position of a sales representative.\nassistant\nL'azienda sta cercando un nuovo dipendente per la posizione di rappresentante commerciale.\nuser>Regenerate response\nassistant\nL'azienda sta cercando un nuovo dipendente per la posizione di rappresentante commerciale.",
    good_response: "Ottima risposta.",
    more_actions: "Ulteriori azioni",
    fork: "Forchetta",
    delete: "Elimina",
    cancel: "Annulla",
    edit_prompt: "Suggerimento di modifica:",
    edit_response: "Modifica la risposta",
    preset_reset_description:
      "Elimina la cronologia delle chat e avvia una nuova chat",
    add_new_preset: "Aggiungi nuovo preset",
    command: "Comando",
    your_command: "il tuo comando",
    placeholder_prompt:
      "Questo è il contenuto che verrà inserito all'inizio della tua richiesta.",
    description: "Descrizione",
    placeholder_description:
      "Risponde con una poesia sui modelli linguistici di grandi dimensioni.",
    save: "Salva",
    small: "Piccolo",
    normal: "Normale",
    large: "Grande",
    workspace_llm_manager: {
      search: "Cerca fornitori di modelli linguistici di grandi dimensioni",
      loading_workspace_settings:
        "Caricamento delle impostazioni dell'ambiente di lavoro...",
      available_models: "Modelli disponibili per {{provider}}",
      available_models_description:
        "Seleziona un modello da utilizzare per questo ambiente di lavoro.",
      save: "Utilizza questo modello.",
      saving:
        "Impostazione del modello come impostazione predefinita per l'area di lavoro...",
      missing_credentials:
        "Questo fornitore non dispone delle credenziali necessarie.",
      missing_credentials_description:
        "Fare clic per configurare le credenziali",
    },
    submit: "Invia",
    edit_info_user:
      '"Invia" rigenera la risposta dell\'IA. "Salva" aggiorna solo il tuo messaggio.',
    edit_info_assistant:
      "Le modifiche verranno salvate direttamente in questa risposta.",
    see_less: "Visualizza meno",
    see_more: "Visualizza altro",
    tools: "Strumenti",
    text_size_label: "Dimensione del testo",
    select_model: "Seleziona il modello",
    sources: "Fonti",
    document: "Documento",
    similarity_match: "partita",
    source_count_one: "Riferimento {{count}}",
    source_count_other: "Riferimenti a {{count}}",
    preset_exit_description: "Interrompere la sessione corrente con l'agente.",
    add_new: "Aggiungi nuovo",
    edit: "Modifica",
    publish: "Pubblicare",
    stop_generating: "Interrompi la generazione della risposta",
    slash_commands: "Comandi abbreviati",
    agent_skills: "Competenze dell'agente",
    manage_agent_skills: "Gestire le competenze degli agenti",
    agent_skills_disabled_in_session:
      "Non è possibile modificare le competenze durante una sessione di agente attivo. Per terminare la sessione, utilizzare il comando `/exit`.",
    start_agent_session: "Avvia sessione agente",
    use_agent_session_to_use_tools:
      'È possibile utilizzare gli strumenti disponibili tramite chat avviando una sessione con un agente utilizzando il prefisso "@agent" all\'inizio del messaggio.',
    agent_invocation: {
      model_wants_to_call: "Il modello desidera effettuare una chiamata.",
      approve: "Approvato",
      reject: "Rifiutare",
      always_allow: "Assicurarsi sempre di avere {{skillName}}",
      tool_call_was_approved:
        "La richiesta di fornitura di strumenti è stata approvata.",
      tool_call_was_rejected:
        "La richiesta di accesso all'attrezzatura è stata rifiutata.",
    },
  },
  profile_settings: {
    edit_account: "Modifica account",
    profile_picture: "Immagine del profilo",
    remove_profile_picture: "Rimuovi la foto del profilo",
    username: "Username\n\n<|start_pad|>\nNome utente",
    new_password: "Nuova password",
    password_description: "La password deve essere lunga almeno 8 caratteri.",
    cancel: "Annulla",
    update_account: "Aggiorna il profilo",
    theme: "Preferenza per il tema",
    language: "Lingua preferita",
    failed_upload: "Impossibile caricare l'immagine del profilo: {{error}}",
    upload_success: "Immagine del profilo caricata.",
    failed_remove: "Impossibile rimuovere l'immagine del profilo: {{error}}",
    profile_updated: "Profilo aggiornato.",
    failed_update_user: "Errore nell'aggiornamento dell'utente: {{error}}",
    account: "Account",
    support: "Support\n\n\nAssistenza",
    signout: "Esci",
  },
  customization: {
    interface: {
      title: "Preferenze dell'interfaccia utente",
      description:
        "Configura le tue preferenze dell'interfaccia utente per AnythingLLM.",
    },
    branding: {
      title: "Branding e personalizzazione",
      description:
        "Personalizza la tua istanza di AnythingLLM con il tuo marchio.",
    },
    chat: {
      title: "Chat",
      description: "Configura le tue preferenze di chat per AnythingLLM.",
      auto_submit: {
        title: "Inserimento automatico del testo della discorsione",
        description:
          "Invia automaticamente l'input vocale dopo un periodo di silenzio.",
      },
      auto_speak: {
        title: "Risposte automatiche",
        description:
          "Genera risposte automatiche basate su un modello di linguaggio.",
      },
      spellcheck: {
        title: "Abilita il controllo ortografico",
        description:
          "Abilitare o disabilitare il controllo ortografico nel campo di input della chat",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description:
          "Seleziona la combinazione di colori che preferisci per l'applicazione.",
      },
      "show-scrollbar": {
        title: "Mostra barra di scorrimento",
        description:
          "Abilita o disabilita la barra di scorrimento nella finestra di chat.",
      },
      "support-email": {
        title: "Support Email\n\nSupport Email",
        description:
          "Definisci l'indirizzo email di supporto che sarà disponibile per gli utenti quando necessitano di assistenza.",
      },
      "app-name": {
        title: "Nome",
        description:
          "Definisci un nome che verrà visualizzato sulla pagina di accesso per tutti gli utenti.",
      },
      "display-language": {
        title: "Lingua da visualizzare",
        description:
          "Seleziona la lingua preferita per visualizzare l'interfaccia utente di AnythingLLM – quando sono disponibili le traduzioni.",
      },
      logo: {
        title: "Logo del marchio",
        description:
          "Carica il tuo logo personalizzato per visualizzarlo su tutte le pagine.",
        add: "Aggiungi un logo personalizzato",
        recommended: "Dimensioni consigliate: 800 x 200",
        remove: "Rimuovi",
        replace: "Sostituire",
      },
      "browser-appearance": {
        title: "Aspetto del browser",
        description:
          "Personalizza l'aspetto della scheda del browser e del titolo quando l'app è aperta.",
        tab: {
          title: "Titolo",
          description:
            "Imposta un titolo personalizzato per l'icona quando l'app è aperta in un browser.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Utilizza un'icona personalizzata per la scheda del browser.",
        },
      },
      "sidebar-footer": {
        title: "Elementi del footer della barra laterale",
        description:
          "Personalizza gli elementi del footer visualizzati nella parte inferiore della barra laterale.",
        icon: "Icon",
        link: "Link",
      },
      "render-html": {
        title: "Visualizza codice HTML in chat",
        description:
          "Generare risposte HTML nelle risposte dell'assistente.\nQuesto può portare a una qualità di risposta molto più accurata, ma può anche comportare potenziali rischi per la sicurezza.",
      },
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Creare un agente",
      editWorkspace: "Modifica l'area di lavoro",
      uploadDocument: "Caricare un documento",
    },
    greeting: "Come posso aiutarti oggi?",
  },
  "keyboard-shortcuts": {
    title: "Combinazioni di tasti",
    shortcuts: {
      settings: "Apri le impostazioni",
      workspaceSettings: "Apri le impostazioni dello spazio di lavoro corrente",
      home: "Vai alla pagina principale",
      workspaces: "Gestire gli spazi di lavoro",
      apiKeys: "Impostazioni delle chiavi API",
      llmPreferences: "Preferenze LLM",
      chatSettings: "Impostazioni di chat",
      help: "Mostra le scorciatoie da tastiera",
      showLLMSelector: "Seleziona l'ambiente di lavoro LLM",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Successo!",
        success_description:
          "Il tuo prompt di sistema è stato pubblicato nella Community Hub!",
        success_thank_you: "Grazie per aver condiviso con la comunità!",
        view_on_hub: "Visualizza su Community Hub",
        modal_title: "Richiesta di pubblicazione",
        name_label: "Nome",
        name_description:
          "Questo è il nome visualizzato per il prompt del sistema.",
        name_placeholder: "Il mio prompt di sistema",
        description_label: "Descrizione",
        description_description:
          "Questa è la descrizione del prompt del sistema. Utilizzala per descrivere lo scopo del tuo prompt.",
        tags_label: "Etichette",
        tags_description:
          "Le etichette vengono utilizzate per identificare il prompt del sistema in modo più semplice, facilitando la ricerca. È possibile aggiungere più etichette. Massimo 5 etichette. Massimo 20 caratteri per etichetta.",
        tags_placeholder: "Inserisci il testo e premi Invio per aggiungere tag",
        visibility_label: "Visibilità",
        public_description:
          "I prompt del sistema pubblico sono visibili a tutti.",
        private_description:
          "I messaggi di sistema privati sono visibili solo a te.",
        publish_button: "Pubblica su Community Hub",
        submitting: "Pubblicazione...",
        prompt_label: "Prompt",
        prompt_description:
          "Questo è il prompt di sistema effettivo che verrà utilizzato per guidare il modello linguistico.",
        prompt_placeholder: "Inserisci il prompt del tuo sistema qui...",
      },
      agent_flow: {
        success_title: "Successo!",
        success_description:
          "Il tuo flusso di lavoro è stato pubblicato nella Community Hub!",
        success_thank_you: "Grazie per aver condiviso con la comunità!",
        view_on_hub: "Visualizza su Community Hub",
        modal_title:
          "Publish Agent Flow\n\nPubblica il flusso di lavoro per gli agenti.",
        name_label: "Nome",
        name_description:
          "Questo è il nome visualizzato per il tuo flusso di lavoro.",
        name_placeholder: "Il mio agente, Flow",
        description_label: "Descrizione",
        description_description:
          "Questa è la descrizione del flusso di lavoro del tuo agente. Utilizzala per descrivere lo scopo del tuo flusso di lavoro.",
        tags_label: "Etichette",
        tags_description:
          "Le etichette vengono utilizzate per identificare il flusso di lavoro del tuo agente, facilitando la ricerca. È possibile aggiungere più etichette. Massimo 5 etichette. Massimo 20 caratteri per etichetta.",
        tags_placeholder: "Inserisci il testo e premi Invio per aggiungere tag",
        visibility_label: "Visibilità",
        submitting: "Pubblicazione...",
        submit: "Pubblica su Community Hub",
        privacy_note:
          "I flussi vengono sempre caricati in forma privata per proteggere eventuali dati sensibili. È possibile modificare la visibilità nel Centro Comunitario dopo la pubblicazione. Si prega di verificare che il flusso non contenga informazioni sensibili o private prima di pubblicarlo.",
      },
      generic: {
        unauthenticated: {
          title: "Richiesta di autenticazione",
          description:
            "È necessario autenticarsi tramite il Community Hub di AnythingLLM prima di pubblicare contenuti.",
          button: "Connettiti al centro comunitario",
        },
      },
      slash_command: {
        success_title: "Successo!",
        success_description:
          "Il tuo comando Slash è stato pubblicato nel Community Hub!",
        success_thank_you: "Grazie per aver condiviso con la comunità!",
        view_on_hub: "Visualizza su Community Hub",
        modal_title: "Pubblica il comando Slash",
        name_label: "Nome",
        name_description:
          "Questo è il nome visualizzato per il tuo comando slash.",
        name_placeholder: "Il mio comando Slash",
        description_label: "Descrizione",
        description_description:
          "Questa è la descrizione del tuo comando slash. Utilizzala per descrivere lo scopo del tuo comando slash.",
        tags_label: "Etichette",
        tags_description:
          "Le etichette vengono utilizzate per identificare il tuo comando slash, facilitando la ricerca. È possibile aggiungere più etichette. Massimo 5 etichette. Massimo 20 caratteri per etichetta.",
        tags_placeholder: "Inserisci il testo e premi Invio per aggiungere tag",
        visibility_label: "Visibilità",
        public_description: "I comandi slash pubblici sono visibili a tutti.",
        private_description: "I comandi privati sono visibili solo a te.",
        publish_button: "Pubblica su Community Hub",
        submitting: "Pubblicazione...",
        prompt_label:
          "Scrivi un breve testo che descriva le caratteristiche principali di un'azienda che opera nel settore dell'energia rinnovabile.\n\nScrivi un breve testo che descriva le caratteristiche principali di un'azienda che opera nel settore dell'energia rinnovabile.\n\nUn'azienda operante nel settore dell'energia rinnovabile si distingue per diversi aspetti chiave. Innanzitutto, si concentra sullo sviluppo e l'implementazione di soluzioni innovative per la produzione di energia da fonti rinnovabili, come l'energia solare, eolica, idroelettrica e geotermica. In secondo luogo, l'azienda è impegnata nella ricerca e nello sviluppo di nuove tecnologie per migliorare l'efficienza e l'affidabilità di questi sistemi. Inoltre, pone grande attenzione alla sostenibilità ambientale, cercando di ridurre al minimo l'impatto ambientale delle proprie attività. Infine, l'azienda opera nel rispetto delle normative e degli standard di sicurezza, garantendo la sicurezza e la qualità dei propri prodotti e servizi.\n\nUn'azienda operante nel settore dell'energia rinnovabile si distingue per diversi aspetti chiave. Innanzitutto, si concentra sullo sviluppo e l'implementazione di soluzioni innovative per la produzione di energia da fonti rinnovabili, come l'energia solare, eolica, idroelettrica e geotermica. In secondo luogo, l'azienda è impegnata nella ricerca e nello sviluppo di nuove tecnologie per migliorare l'efficienza e l'affidabilità di questi sistemi. Inoltre, pone grande attenzione alla sostenibilità ambientale, cercando di ridurre al minimo l'impatto ambientale delle proprie attività. Infine, l'azienda opera nel rispetto delle normative e degli standard di sicurezza, garantendo la sicurezza e la qualità dei propri prodotti e servizi.",
        prompt_description:
          "Questo è il comando che verrà utilizzato quando il comando con la barra verrà attivato.",
        prompt_placeholder: "Inserisci la tua richiesta qui...",
      },
    },
  },
  security: {
    title: "Sicurezza",
    multiuser: {
      title: "Modalità multi-utente",
      description:
        "Imposta la tua istanza per supportare il tuo team attivando la modalità multi-utente.",
      enable: {
        "is-enable": "La modalità multi-utente è abilitata",
        enable: "Abilita la modalità multi-utente",
        description:
          "Per impostazione predefinita, sarai l'unico amministratore. Come amministratore dovrai creare account per tutti i nuovi utenti o amministratori. Non perdere la tua password poiché solo un utente amministratore può reimpostare le password.",
        username: "Nome utente account amministratore",
        password: "Password account amministratore",
      },
    },
    password: {
      title: "Protezione password",
      description:
        "Proteggi la tua istanza AnythingLLM con una password. Se la dimentichi, non esiste un metodo di recupero, quindi assicurati di salvare questa password.",
      "password-label": "Password istanza",
    },
  },
  home: {
    welcome: "Benvenuto",
    chooseWorkspace: "Scegli uno spazio di lavoro per iniziare a chattare!",
    notAssigned:
      "Non sei assegnato a nessuno spazio di lavoro.\nContatta il tuo amministratore per richiedere l'accesso a uno spazio di lavoro.",
    goToWorkspace: 'Vai allo spazio di lavoro "{{workspace}}"',
  },
  telegram: {
    title: "Bot per Telegram",
    description:
      "Collega la tua istanza di AnythingLLM a Telegram in modo da poter chattare con i tuoi spazi di lavoro da qualsiasi dispositivo.",
    setup: {
      step1: {
        title: "Passo 1: Crea il tuo bot Telegram",
        description:
          "Apri il bot @BotFather su Telegram, invia `/newbot` a @BotFather, segui le istruzioni e copia il token API.",
        "open-botfather": "Avvia BotFather",
        "instruction-1": "1. Apri il link o scansiona il codice QR",
        "instruction-2":
          "2. Invia <code>/newbot</code> a <code>@BotFather</code>",
        "instruction-3": "3. Scegli un nome e un nome utente per il tuo bot.",
        "instruction-4": "4. Copiare il token API che riceverete",
      },
      step2: {
        title: "Passo 2: Collegare il tuo bot",
        description:
          "Incolla il token API che hai ricevuto da @BotFather e seleziona uno spazio di lavoro predefinito per il tuo bot, in modo che possa comunicare.",
        "bot-token": "Token Bot",
        "default-workspace": "Spazio di lavoro predefinito",
        "no-workspace":
          "Non sono disponibili spazi di lavoro. Ne verrà creato uno nuovo.",
        connecting: "Connessione...",
        "connect-bot": "Bot di connessione",
      },
      security: {
        title: "Impostazioni di sicurezza consigliate",
        description:
          "Per una maggiore sicurezza, configurare queste impostazioni tramite @BotFather.",
        "disable-groups": "— Impedire l'aggiunta di bot ai gruppi",
        "disable-inline": "— Impedire l'uso di bot nelle ricerche inline",
        "obscure-username":
          "Utilizza un nome utente per il bot che non sia ovvio, per ridurre la sua visibilità.",
      },
      "toast-enter-token": "Si prega di inserire un token per il bot.",
      "toast-connect-failed":
        "Impossibile stabilire la connessione con il bot.",
    },
    connected: {
      status: "Collegato",
      "status-disconnected":
        "Non connesso – il token potrebbe essere scaduto o non valido",
      "placeholder-token": "Incolla il nuovo token del bot...",
      reconnect: "Riconnettersi",
      workspace: "Spazio di lavoro",
      "bot-link": "Link al bot",
      "voice-response": "Risposta vocale",
      disconnecting: "Disconnessione...",
      disconnect: "Disconnetti",
      "voice-text-only": "Testo solo",
      "voice-mirror":
        "Specchio (risposta vocale quando l'utente invia un messaggio vocale)",
      "voice-always":
        "Invia sempre un messaggio vocale (registra un audio con ogni risposta).",
      "toast-disconnect-failed": "Impossibile disconnettere il bot.",
      "toast-reconnect-failed":
        "Impossibile ristabilire la connessione con il bot.",
      "toast-voice-failed": "Impossibile aggiornare la modalità vocale.",
      "toast-approve-failed": "Impossibile approvare l'utente.",
      "toast-deny-failed": "Impossibile negare l'accesso all'utente.",
      "toast-revoke-failed": "Impossibile revocare l'accesso dell'utente.",
    },
    users: {
      "pending-title": "In attesa di approvazione",
      "pending-description":
        "Utenti in attesa di verifica. Confrontare il codice di abbinamento visualizzato qui con quello visualizzato nella loro chat di Telegram.",
      "approved-title": "Utenti approvati",
      "approved-description":
        "Utenti che sono stati approvati per chattare con il vostro bot.",
      user: "Utente",
      "pairing-code": "Codice di abbinamento",
      "no-pending": "Non ci sono richieste in sospeso.",
      "no-approved": "Nessun utente autorizzato",
      unknown: "Sconosciuto",
      approve: "Approvare",
      deny: "Negare",
      revoke: "Annullare",
    },
  },
};

export default TRANSLATIONS;
