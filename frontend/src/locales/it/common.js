const TRANSLATIONS = {
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
    },
  
    // Setting Sidebar menu items.
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
    },
  
    // Page Definitions
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
      githubIssue: "Apri una issue su Github",
      user1: "Come posso iniziare?!",
      part4:
        "È semplice. Tutte le raccolte sono organizzate in contenitori che chiamiamo \"Aree di lavoro\". Le aree di lavoro sono contenitori di file, documenti, immagini, PDF e altri file che verranno trasformati in qualcosa che gli LLM possono comprendere e utilizzare nella conversazione.\n\nPuoi aggiungere e rimuovere file in qualsiasi momento.",
      createWorkspace: "Crea la tua prima area di lavoro",
      user2:
        "È come Dropbox AI o qualcosa del genere? E le chat? È un chatbot, non è vero?",
      part5:
       "AnythingLLM è migliore di un Dropbox più smart.\n\nAnythingLLM offre due modi di comunicare con i tuoi dati:\n\n<i>Query:</i> Le tue chat restituiranno dati o inferenze trovate con i documenti nella tua area di lavoro a cui ha accesso. Aggiungere più documenti all'area di lavoro lo rende più intelligente! \n\n<i>Conversazionale:</i> i tuoi documenti + la cronologia delle chat in corso contribuiscono entrambi alla conoscenza dell'LLM allo stesso tempo. Ottimo per aggiungere informazioni basate su testo in tempo reale o correzioni e incomprensioni che l'LLM potrebbe avere. \n\nPuoi passare da una modalità all'altra \n<i>nel mezzo della chat!</i>",
      user3: "Wow, sembra fantastico, fammi provare!",
      part6: "Divertiti!",
      starOnGithub: "Metti una stella su GitHub",
      contact: "Contatta Mintplex Labs",
    },
  
    "new-workspace": {
      title: "Nuova area di lavoro",
      placeholder: "La mia area di lavoro",
    },
  
    // Workspace Settings menu items
    "workspaces—settings": {
      general: "Impostazioni generali",
      chat: "Impostazioni Chat",
      vector: "Database vettoriale",
      members: "Membri",
      agent: "Configurazione dell'agente",
    },
  
    // General Appearance
    general: {
      vector: {
        title: "Contatore dei vettori",
        description: "Numero totale di vettori nel tuo database vettoriale.",
      },
      names: {
        description: "Questo cambierà solo il nome visualizzato della tua area di lavoro.",
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
  
    // Chat Settings
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
  
    // Vector Database
    "vector-workspace": {
      identifier: "Identificatore del database vettoriale",
      snippets: {
        title: "Numero massimo di frammenti di contesto",
        description: "Questa impostazione controlla la quantità massima di frammenti di contesto che verranno inviati all\'LLM per ogni chat o query.",
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
        error: "Impossibile reimpostare il database vettoriale dell'area di lavoro!",
        success: "Il database vettoriale dell'area di lavoro è stato reimpostato!",
        },
    },
  
    // Agent Configuration
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
        'Consenti all\'agente di sfruttare i tuoi documenti locali per rispondere a una query o chiedi all\'agente di "ricordare" parti di contenuto per il recupero della memoria a lungo termine.',
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
  
    // Workspace Chats
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
  
    // Appearance
    appearance: {
        title: "Aspetto",
        description: "Personalizza le impostazioni di aspetto della tua piattaforma.",
        logo: {
        title: "Personalizza logo",
        description: "Carica il tuo logo personalizzato per rendere tuo il chatbot.",
        add: "Aggiungi un logo personalizzato",
        recommended: "Dimensioni consigliate: 800 x 200",
        remove: "Rimuovi",
        replace: "Sostituisci",
        },
        message: {
        title: "Personalizza messaggi",
        description: "Personalizza i messaggi automatici visualizzati dai tuoi utenti.",
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
  
    // API Keys
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
  
    // Vector Database
    vector: {
        title: "Database vettoriale",
        description:
        "Queste sono le credenziali e le impostazioni per il funzionamento della tua istanza AnythingLLM. È importante che queste chiavi siano aggiornate e corrette.",
        provider: {
        title: "Provider del database vettoriale",
        description: "Non è richiesta alcuna configurazione per LanceDB.",
      },
    },
  
    // Embeddable Chat Widgets
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
  
    // Event Logs
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
  
    // Privacy & Data-Handling
    privacy: {
        title: "Privacy e gestione dei dati",
        description:
        "Questa è la tua configurazione per il modo in cui i provider terzi connessi e AnythingLLM gestiscono i tuoi dati.",
        llm: "Selezione LLM",
        embedding: "Preferenza di embedding",
        vector: "Database vettoriale",
        anonymous: "Telemetria anonima abilitata",
    },
  };
  
  export default TRANSLATIONS;
  