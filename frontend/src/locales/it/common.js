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
    "workspaces-name": "Nome delle aree di lavoro",
    error: "errore",
    success: "successo",
    user: "Utente",
    selection: "Selezione del modello",
    saving: "Salvo...",
    save: "Salva modifiche",
    previous: "Pagina precedente",
    next: "Pagina successiva",
    optional: null,
    yes: null,
    no: null,
  },
  settings: {
    title: "Impostazioni istanza",
    system: "Impostazioni generali",
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
    "embed-chats": "Storico chat incorporata",
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
    "sign-in": {
      start: "Accedi al tuo",
      end: "account.",
    },
    "password-reset": {
      title: "Password Reset",
      description:
        "Fornisci le informazioni necessarie qui sotto per reimpostare la tua password.",
      "recovery-codes": "Codici di recupero",
      "recovery-code": "Codice di recupero {{index}}",
      "back-to-login": "Torna al Login",
    },
  },
  welcomeMessage: {
    part1:
      "Benvenuti in AnythingLLM, AnythingLLM è uno strumento di intelligenza artificiale open source di Mintplex Labs che trasforma qualsiasi cosa in un chatbot addestrato con cui puoi effettuare query e chattare. AnythingLLM è un software BYOK (bring-your-own-keys), quindi non ci sono abbonamenti, commissioni o costi per questo software al di fuori dei servizi che vuoi utilizzare.",
    part2:
      "AnythingLLM è il modo più semplice per mettere insieme potenti prodotti di intelligenza artificiale come OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB e altri servizi in un pacchetto ordinato e senza problemi per aumentare la tua produttività di 100 volte.",
    part3:
      "AnythingLLM può essere eseguito completamente in locale sulla tua macchina con un overhead minimo, non ti accorgerai nemmeno che c'è! Non serve GPU. Sono disponibili anche installazioni cloud e on-premise.\nL'ecosistema degli strumenti di intelligenza artificiale diventa ogni giorno più potente. AnythingLLM lo rende facile da usare.",
    githubIssue: "Apri una issue su GitHub",
    user1: "Come posso iniziare?!",
    part4:
      'È semplice. Tutte le raccolte sono organizzate in contenitori che chiamiamo "Aree di lavoro". Le aree di lavoro sono contenitori di file, documenti, immagini, PDF e altri file che verranno trasformati in qualcosa che gli LLM possono comprendere e utilizzare nella conversazione.\n\nPuoi aggiungere e rimuovere file in qualsiasi momento.',
    createWorkspace: "Crea la tua prima area di lavoro",
    user2:
      "È come Dropbox AI o qualcosa del genere? E le chat? È un chatbot, non è vero?",
    part5:
      "AnythingLLM è migliore di un Dropbox più smart.\n\nAnythingLLM offre due modi di comunicare con i tuoi dati:\n\n<i>Query:</i> Le tue chat restituiranno dati o inferenze trovate con i documenti nella tua area di lavoro a cui ha accesso. Aggiungere più documenti all'area di lavoro lo rende più intelligente! \n\n<i>Conversazionale:</i> i tuoi documenti + la cronologia delle chat in corso contribuiscono entrambi alla conoscenza dell'LLM allo stesso tempo. Ottimo per aggiungere informazioni basate su testo in tempo reale o correzioni e incomprensioni che l'LLM potrebbe avere. \n\nPuoi passare da una modalità all'altra \n<i>nel mezzo della chat!</i>",
    user3: "Wow, sembra fantastico, fammi provare!",
    part6: "Divertiti!",
    starOnGitHub: "Metti una stella su GitHub",
    contact: "Contatta Mintplex Labs",
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
    pfp: {
      title: "Immagine del profilo dell'assistente",
      description:
        "Personalizza l'immagine del profilo dell'assistente per quest'area di lavoro.",
      image: "Immagine dell'area di lavoro",
      remove: "Rimuovi immagine dell'area di lavoro",
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
      wait: "-- in attesa dei modelli --",
    },
    mode: {
      title: "Modalità chat",
      chat: {
        title: "Chat",
        "desc-start": "fornirà risposte con la conoscenza generale dell'LLM",
        and: "e",
        "desc-end": "contesto documentale associato.",
      },
      query: {
        title: "Query",
        "desc-start": "fornirà risposte",
        only: "solo",
        "desc-end": "se sarà presente un contesto documentale",
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
    },
    refusal: {
      title: "Risposta al rifiuto nella modalità di query",
      "desc-start": "Quando la modalità",
      query: "query",
      "desc-end":
        "è attiva, potresti voler restituire una risposta di rifiuto personalizzata quando non viene trovato alcun contesto.",
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
      title: "Abilità predefinite dell'agente",
      description:
        "Migliora le capacità naturali dell'agente predefinito con queste abilità predefinite. Questa configurazione si applica a tutte le aree di lavoro.",
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
      save: {
        title: "Genera e salva file nel browser",
        description:
          "Abilita l'agente predefinito per generare e scrivere su file che possono essere salvati e scaricati nel tuo browser.",
      },
      web: {
        title: "Ricerca e navigazione web in tempo reale",
        "desc-start":
          "Abilita il tuo agente a cercare sul web per rispondere alle tue domande connettendosi a un provider di ricerca web (SERP).",
        "desc-end":
          "La ricerca web durante le sessioni dell'agente non funzionerà finché non verrà impostata.",
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
  appearance: {
    title: "Aspetto",
    description:
      "Personalizza le impostazioni di aspetto della tua piattaforma.",
    logo: {
      title: "Personalizza logo",
      description:
        "Carica il tuo logo personalizzato per rendere tuo il chatbot.",
      add: "Aggiungi un logo personalizzato",
      recommended: "Dimensioni consigliate: 800 x 200",
      remove: "Rimuovi",
      replace: "Sostituisci",
    },
    message: {
      title: "Personalizza messaggi",
      description:
        "Personalizza i messaggi automatici visualizzati dai tuoi utenti.",
      new: "Nuovo",
      system: "sistema",
      user: "utente",
      message: "messaggio",
      assistant: "Assistente chat AnythingLLM",
      "double-click": "Fai doppio clic per modificare...",
      save: "Salva messaggi",
    },
    icons: {
      title: "Icone a piè di pagina personalizzate",
      description:
        "Personalizza le icone a piè di pagina visualizzate nella parte inferiore della barra laterale.",
      icon: "Icona",
      link: "Collegamento",
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
      description:
        "Non è richiesta alcuna configurazione quando si utilizza il motore di embedding nativo di AnythingLLM.",
    },
  },
  text: {
    title: "Preferenze di suddivisione e suddivisione in blocchi del testo",
    "desc-start":
      "A volte, potresti voler cambiare il modo predefinito in cui i nuovi documenti vengono suddivisi e spezzettati in blocchi prima di essere inseriti nel tuo database vettoriale.",
    "desc-end":
      "Dovresti modificare questa impostazione solo se capisci come funziona la suddivisione del testo e i suoi effetti collaterali.",
    "warn-start": "Le modifiche qui si applicheranno solo a",
    "warn-center": "nuovi documenti incorporati",
    "warn-end": ", non documenti esistenti.",
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
      Active: "Domini attivi",
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
  multi: {
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
    password: {
      title: "Protezione password",
      description:
        "Proteggi la tua istanza AnythingLLM con una password. Se la dimentichi, non esiste un metodo di recupero, quindi assicurati di salvare questa password.",
    },
    instance: {
      title: "Protezione password istanza",
      description:
        "Per impostazione predefinita, sarai l'unico amministratore. Come amministratore dovrai creare account per tutti i nuovi utenti o amministratori. Non perdere la tua password poiché solo un utente amministratore può reimpostare le password.",
      password: "Password istanza",
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
    llm: "Selezione LLM",
    embedding: "Preferenza di embedding",
    vector: "Database vettoriale",
    anonymous: "Telemetria anonima abilitata",
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
