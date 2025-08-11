// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Bine ai venit la",
      getStarted: "Începe",
    },
    llm: {
      title: "Preferința LLM",
      description:
        "AnythingLLM poate funcționa cu mulți furnizori LLM. Acesta va fi serviciul care gestionează conversațiile.",
    },
    userSetup: {
      title: "Configurare Utilizator",
      description: "Configurează setările utilizatorului tău.",
      howManyUsers: "Câți utilizatori vor folosi această instanță?",
      justMe: "Doar eu",
      myTeam: "Echipa mea",
      instancePassword: "Parola Instanței",
      setPassword: "Dorești să setezi o parolă?",
      passwordReq: "Parolele trebuie să aibă cel puțin 8 caractere.",
      passwordWarn:
        "Este important să salvezi această parolă deoarece nu există metodă de recuperare.",
      adminUsername: "Numele contului de administrator",
      adminUsernameReq:
        "Numele de utilizator trebuie să aibă cel puțin 6 caractere și să conțină numai litere mici, cifre, underscore și liniuțe fără spații.",
      adminPassword: "Parola contului de administrator",
      adminPasswordReq: "Parolele trebuie să aibă cel puțin 8 caractere.",
      teamHint:
        "Implicit, vei fi singurul administrator. După finalizarea configurării inițiale, poți crea și invita alți utilizatori sau administratori. Nu pierde parola, deoarece doar administratorii pot reseta parolele.",
    },
    data: {
      title: "Gestionarea datelor & Confidențialitate",
      description:
        "Suntem dedicați transparenței și controlului asupra datelor tale personale.",
      settingsHint:
        "Aceste setări pot fi reconfigurate oricând în setările aplicației.",
    },
    survey: {
      title: "Bun venit la AnythingLLM",
      description:
        "Ajută-ne să facem AnythingLLM potrivit pentru nevoile tale. Opțional.",
      email: "Care este adresa ta de email?",
      useCase: "Pentru ce vei folosi AnythingLLM?",
      useCaseWork: "Pentru muncă",
      useCasePersonal: "Pentru uz personal",
      useCaseOther: "Altele",
      comment: "De unde ai aflat despre AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - Spune-ne cum ne-ai găsit!",
      skip: "Sari peste sondaj",
      thankYou: "Îți mulțumim pentru feedback!",
    },
    workspace: {
      title: "Creează primul tău spațiu de lucru",
      description:
        "Creează primul tău spațiu de lucru și începe să folosești AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Numele spațiilor de lucru",
    error: "eroare",
    success: "succes",
    user: "Utilizator",
    selection: "Selecția modelului",
    saving: "Se salvează...",
    save: "Salvează modificările",
    previous: "Pagina anterioară",
    next: "Pagina următoare",
    optional: "Opțional",
    yes: "Da",
    no: "Nu",
    search: "Caută",
  },
  settings: {
    title: "Setările instanței",
    system: "Setări generale",
    invites: "Invitații",
    users: "Utilizatori",
    workspaces: "Spații de lucru",
    "workspace-chats": "Conversațiile spațiului de lucru",
    customization: "Personalizare",
    interface: "Preferințe UI",
    branding: "Branding & White-label",
    chat: "Chat",
    "api-keys": "API pentru dezvoltatori",
    llm: "LLM",
    transcription: "Transcriere",
    embedder: "Embedder",
    "text-splitting": "Împărțirea și segmentarea textului",
    "voice-speech": "Voce & Vorbire",
    "vector-database": "Baza de date vectorială",
    embeds: "Chat Embed",
    "embed-chats": "Istoricul chat embed",
    security: "Securitate",
    "event-logs": "Jurnale de evenimente",
    privacy: "Confidențialitate & Date",
    "ai-providers": "Furnizori AI",
    "agent-skills": "Abilități agent",
    admin: "Administrator",
    tools: "Instrumente",
    "system-prompt-variables": "Variabile system prompt",
    "experimental-features": "Funcții experimentale",
    contact: "Contact suport",
    "browser-extension": "Extensie browser",
  },
  login: {
    "multi-user": {
      welcome: "Bine ai venit la",
      "placeholder-username": "Nume utilizator",
      "placeholder-password": "Parolă",
      login: "Autentifică-te",
      validating: "Se validează...",
      "forgot-pass": "Ai uitat parola",
      reset: "Resetează",
    },
    "sign-in": {
      start: "Autentifică-te în",
      end: "cont.",
    },
    "password-reset": {
      title: "Resetare parolă",
      description:
        "Introdu informațiile necesare mai jos pentru a reseta parola.",
      "recovery-codes": "Coduri de recuperare",
      "recovery-code": "Cod de recuperare {{index}}",
      "back-to-login": "Înapoi la autentificare",
    },
  },
  welcomeMessage: {
    part1:
      "Bine ai venit la AnythingLLM, AnythingLLM este un instrument AI open-source creat de Mintplex Labs care transformă orice într-un chatbot antrenat cu care poți interacționa. AnythingLLM este un software BYOK (bring-your-own-keys) fără abonamente sau taxe în afară de serviciile pe care dorești să le folosești.",
    part2:
      "AnythingLLM este cea mai simplă modalitate de a combina produse AI puternice precum OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB și alte servicii într-un pachet ordonat care îți crește productivitatea de 100x.",
    part3:
      "AnythingLLM poate rula complet local pe calculatorul tău cu un consum redus de resurse, pe care nici nu îl vei observa! Nu este necesar GPU. Instalarea în cloud sau local este, de asemenea, disponibilă.\nEcosistemul de unelte AI devine tot mai puternic zilnic. AnythingLLM face aceste tehnologii ușor de folosit.",
    githubIssue: "Creează un issue pe GitHub",
    user1: "Cum încep?!",
    part4:
      'Este simplu. Toate colecțiile sunt organizate în bucket-uri pe care le numim "Spații de Lucru". Acestea sunt containere de fișiere, documente, imagini, PDF-uri și alte fișiere care vor fi transformate într-un format pe care LLM-urile îl pot înțelege și folosi în conversație.\n\nPoți adăuga și elimina fișiere oricând.',
    createWorkspace: "Creează primul tău spațiu de lucru",
    user2:
      "Este ca un Dropbox AI sau ceva de genul? Dar ce fac cu chat-ul? Este un chatbot, nu?",
    part5:
      "AnythingLLM este mai mult decât un Dropbox mai inteligent.\n\nAnythingLLM oferă două moduri de a discuta cu datele tale:\n\nQuery: Chaturile tale vor returna date sau inferențe găsite în documentele din spațiul de lucru accesat. Adăugarea mai multor documente face sistemul mai inteligent! \n\nConversational: Documentele tale + istoricul conversațiilor contribuie împreună la cunoașterea LLM-ului în timp real. Ideal pentru a adăuga corecții și informații textuale în timp real.\n\nPoți comuta între cele două moduri chiar în timpul conversației!",
    user3: "Wow, sună uimitor, hai să încerc acum!",
    part6: "Distracție plăcută!",
    starOnGitHub: "Dă stea pe GitHub",
    contact: "Contactează Mintplex Labs",
  },
  "main-page": {
    noWorkspaceError:
      "Te rugăm să creezi un spațiu de lucru înainte să începi o conversație.",
    checklist: {
      title: "Început rapid",
      tasksLeft: "sarcini rămase",
      completed: "Ești pe drumul să devii expert AnythingLLM!",
      dismiss: "închide",
      tasks: {
        create_workspace: {
          title: "Creează un spațiu de lucru",
          description: "Creează primul tău spațiu de lucru pentru a începe",
          action: "Creează",
        },
        send_chat: {
          title: "Trimite un chat",
          description: "Începe o conversație cu asistentul AI",
          action: "Chat",
        },
        embed_document: {
          title: "Inserați un document",
          description: "Adaugă primul tău document în spațiul de lucru",
          action: "Include",
        },
        setup_system_prompt: {
          title: "Configurează un sistem prompt",
          description: "Configurează comportamentul asistentului AI",
          action: "Configurează",
        },
        define_slash_command: {
          title: "Definește o comandă slash",
          description: "Creează comenzi personalizate pentru asistent",
          action: "Definește",
        },
        visit_community: {
          title: "Vizitează Comunitatea",
          description: "Explorează resursele și șabloanele comunității",
          action: "Răsfoiește",
        },
      },
    },
    quickLinks: {
      title: "Link-uri rapide",
      sendChat: "Trimite Chat",
      embedDocument: "Include Document",
      createWorkspace: "Creează Spațiu de lucru",
    },
    exploreMore: {
      title: "Explorează mai multe funcții",
      features: {
        customAgents: {
          title: "Agenți AI personalizați",
          description:
            "Construiește agenți AI puternici și automatizări fără cod.",
          primaryAction: "Chatează cu @agent",
          secondaryAction: "Construiește un flux agent",
        },
        slashCommands: {
          title: "Comenzi Slash",
          description:
            "Economisește timp și folosește prompturi cu comenzi personalizate.",
          primaryAction: "Creează o comandă slash",
          secondaryAction: "Explorează pe Hub",
        },
        systemPrompts: {
          title: "System Prompts",
          description:
            "Modifică system prompt pentru a personaliza răspunsurile AI ale unui spațiu de lucru.",
          primaryAction: "Modifică un prompt system",
          secondaryAction: "Gestionează variabilele promptului",
        },
      },
    },
    announcements: {
      title: "Actualizări & Anunțuri",
    },
    resources: {
      title: "Resurse",
      links: {
        docs: "Documentație",
        star: "Stea pe Github",
      },
      keyboardShortcuts: "Scurtături de tastatură",
    },
  },
  "new-workspace": {
    title: "Spațiu de lucru nou",
    placeholder: "Spațiul meu de lucru",
  },
  "workspaces—settings": {
    general: "Setări generale",
    chat: "Setări chat",
    vector: "Baza de date vectorială",
    members: "Membri",
    agent: "Configurare agent",
  },
  general: {
    vector: {
      title: "Număr vectori",
      description: "Numărul total de vectori în baza ta de date vectorială.",
    },
    names: {
      description:
        "Aceasta va schimba doar numele afișat al spațiului de lucru.",
    },
    message: {
      title: "Mesaje sugerate pentru chat",
      description:
        "Personalizează mesajele care vor fi sugerate utilizatorilor spațiului de lucru.",
      add: "Adaugă mesaj nou",
      save: "Salvează mesajele",
      heading: "Explică-mi",
      body: "beneficiile AnythingLLM",
    },
    pfp: {
      title: "Imagine profil asistent",
      description:
        "Personalizează imaginea de profil a asistentului pentru acest spațiu de lucru.",
      image: "Imagine spațiu de lucru",
      remove: "Șterge imaginea spațiului de lucru",
    },
    delete: {
      title: "Șterge spațiul de lucru",
      description:
        "Șterge acest spațiu de lucru și toate datele sale. Aceasta va șterge spațiul de lucru pentru toți utilizatorii.",
      delete: "Șterge spațiul de lucru",
      deleting: "Se șterge spațiul de lucru...",
      "confirm-start": "Ești pe cale să ștergi întregul tău",
      "confirm-end":
        "spațiu de lucru. Aceasta va elimina toate vectorii integrați în baza vectorială.\n\nFișierele originale rămân neatinse. Această acțiune este ireversibilă.",
    },
  },
  chat: {
    llm: {
      title: "Furnizor LLM pentru spațiu de lucru",
      description:
        "Furnizorul LLM și modelul specific folosit pentru acest spațiu de lucru. Implicit, folosește setările și furnizorul sistemului.",
      search: "Caută toți furnizorii LLM",
    },
    model: {
      title: "Modelul de chat al spațiului de lucru",
      description:
        "Modelul specific chat folosit de acest spațiu de lucru. Dacă e gol, folosește preferința LLM a sistemului.",
      wait: "-- așteptare modele --",
    },
    mode: {
      title: "Mod chat",
      chat: {
        title: "Chat",
        "desc-start":
          "oferă răspunsuri bazate pe cunoștințele generale ale LLM-ului",
        and: "și",
        "desc-end": "context document care este găsit.",
      },
      query: {
        title: "Interogare",
        "desc-start": "oferă răspuns doar",
        only: "doar",
        "desc-end": "dacă contextul documentului este găsit.",
      },
    },
    history: {
      title: "Istoric chat",
      "desc-start":
        "Numărul conversațiilor anterioare care vor fi incluse în memoria pe termen scurt a răspunsului.",
      recommend: "Recomandat: 20.",
      "desc-end":
        "Mai mult de 45 poate duce la erori în conversații în funcție de mărimea mesajelor.",
    },
    prompt: {
      title: "System Prompt",
      description:
        "Promptul folosit în acest spațiu de lucru. Definește contextul și instrucțiunile pentru AI să genereze răspunsuri relevante și precise.",
      history: {
        title: "Istoricul system prompt",
        clearAll: "Șterge tot",
        noHistory: "Nu există istoric disponibil",
        restore: "Restaurează",
        delete: "Șterge",
        publish: "Publică în Comunitate",
        deleteConfirm: "Sigur dorești să ștergi acest istoric?",
        clearAllConfirm:
          "Sigur dorești să ștergi tot istoricul? Această acțiune nu poate fi anulată.",
        expand: "Extinde",
      },
    },
    refusal: {
      title: "Răspuns refuz în modul interogare",
      "desc-start": "Atunci când ești în",
      query: "modul interogare",
      "desc-end": ", poți personaliza răspunsul când nu se găsește context.",
      "tooltip-title": "De ce văd asta?",
      "tooltip-description":
        "Ești în modul interogare, care folosește doar informațiile din documente. Treci la chat pentru conversații mai flexibile sau vizitează documentația pentru mai multe detalii.",
    },
    temperature: {
      title: "Temperatura LLM",
      "desc-start":
        'Această setare controlează cât de "creativ" va fi răspunsul LLM-ului.',
      "desc-end":
        "Cu cât numărul e mai mare, cu atât mai creativ. Pentru unele modele poate duce la răspunsuri incoerente la valori mari.",
      hint: "Majoritatea LLM-urilor au un interval valid specific. Consultă furnizorul tău LLM pentru detalii.",
    },
  },
  vector: {
    title: "Baza de date vectorială",
    description:
      "Acestea sunt credențialele și setările pentru modul în care funcționează instanța ta AnythingLLM. Este important să fie corecte și actuale.",
    provider: {
      title: "Furnizor baza de date vectorială",
      description: "Nu este necesară configurarea pentru LanceDB.",
    },
  },
  embeddable: {
    title: "Widget-uri chat embeddable",
    description:
      "Widget-urile chat embeddable sunt interfețe chat destinate publicului, legate de un singur spațiu de lucru. Acestea îți permit să construiești spații de lucru pe care apoi le poți publica în lume.",
    create: "Creează embed",
    table: {
      workspace: "Spațiu de lucru",
      chats: "Chaturi trimise",
      active: "Domenii active",
      created: "Creat",
    },
  },
  "embed-chats": {
    title: "Istoric chat embed",
    export: "Exportă",
    description:
      "Acestea sunt toate chat-urile și mesajele înregistrate din orice embed pe care l-ai publicat.",
    table: {
      embed: "Embed",
      sender: "Expeditor",
      message: "Mesaj",
      response: "Răspuns",
      at: "Trimis la",
    },
  },
  multi: {
    title: "Mod multi-utilizator",
    description:
      "Configurează instanța ta să suporte echipa activând modul multi-utilizator.",
    enable: {
      "is-enable": "Modul multi-utilizator este activat",
      enable: "Activează modul multi-utilizator",
      description:
        "Implicit, vei fi singurul administrator. Ca administrator, va trebui să creezi conturi pentru toți utilizatorii sau administratorii noi. Nu pierde parola, deoarece doar un utilizator administrator poate reseta parolele.",
      username: "Numele contului de administrator",
      password: "Parola contului de administrator",
    },
    password: {
      title: "Protecție prin parolă",
      description:
        "Protejează instanța AnythingLLM cu o parolă. Dacă o uiți, nu există metode de recuperare, deci asigură-te că o salvezi.",
      "password-label": "Parola instanței",
    },
  },
  event: {
    title: "Jurnale de evenimente",
    description:
      "Vizualizează toate acțiunile și evenimentele care au loc pe această instanță pentru monitorizare.",
    clear: "Șterge jurnalele",
    table: {
      type: "Tip eveniment",
      user: "Utilizator",
      occurred: "S-a întâmplat la",
    },
  },
  privacy: {
    title: "Confidențialitate & Gestionarea datelor",
    description:
      "Aceasta este configurația ta pentru modul în care furnizorii terți conectați și AnythingLLM gestionează datele tale.",
    llm: "Selecția LLM",
    embedding: "Preferința embedding",
    vector: "Baza de date vectorială",
    anonymous: "Telemetrie anonimă activată",
  },
  connectors: {
    "search-placeholder": "Caută conectori de date",
    "no-connectors": "Nu au fost găsiți conectori de date.",
    obsidian: {
      name: "Obsidian",
      description: "Importă un vault Obsidian cu un singur click.",
      vault_location: "Locația vault-ului",
      vault_description:
        "Selectează folderul vault-ului Obsidian pentru a importa toate notițele și conexiunile lor.",
      selected_files: "Au fost găsite {{count}} fișiere markdown",
      importing: "Import vault în curs...",
      import_vault: "Importă Vault",
      processing_time:
        "Aceasta poate dura ceva timp în funcție de dimensiunea vault-ului.",
      vault_warning:
        "Pentru a evita conflictele, asigură-te că vault-ul Obsidian nu este deschis în acest moment.",
    },
    github: {
      name: "Repo GitHub",
      description:
        "Importă un întreg repository public sau privat GitHub cu un singur click.",
      URL: "URL repository GitHub",
      URL_explained:
        "URL-ul repository-ului GitHub pe care dorești să îl colectezi.",
      token: "Token de acces GitHub",
      optional: "opțional",
      token_explained: "Token de acces pentru a preveni limitările de rată.",
      token_explained_start: "Fără un ",
      token_explained_link1: "Token de acces personal",
      token_explained_middle:
        ", API-ul GitHub poate limita numărul de fișiere ce pot fi colectate din cauza limitărilor. Poți ",
      token_explained_link2: "crea un token de acces temporar",
      token_explained_end: " pentru a evita această problemă.",
      ignores: "Fișiere ignorate",
      git_ignore:
        "Listează în format .gitignore fișierele de ignorat la colectare. Apasă enter după fiecare intrare pentru a salva.",
      task_explained:
        "Odată complet, toate fișierele vor fi disponibile pentru embedding în spații de lucru în selectorul de documente.",
      branch: "Ramura din care dorești să colectezi fișiere.",
      branch_loading: "-- încărcare ramuri disponibile --",
      branch_explained: "Ramura din care dorești să colectezi fișiere.",
      token_information:
        "Fără token-ul de acces GitHub completat, acest conector va putea colecta doar fișierele de top datorită limitărilor API-ului public GitHub.",
      token_personal:
        "Obține un token de acces personal gratuit aici cu un cont GitHub.",
    },
    gitlab: {
      name: "Repo GitLab",
      description:
        "Importă un întreg repository public sau privat GitLab cu un singur click.",
      URL: "URL repository GitLab",
      URL_explained:
        "URL-ul repository-ului GitLab pe care dorești să îl colectezi.",
      token: "Token de acces GitLab",
      optional: "opțional",
      token_explained: "Token de acces pentru a preveni limitările de rată.",
      token_description:
        "Selectează entitățile suplimentare de preluat din API-ul GitLab.",
      token_explained_start: "Fără un ",
      token_explained_link1: "Token de acces personal",
      token_explained_middle:
        ", API-ul GitLab poate limita numărul de fișiere ce pot fi colectate din cauza limitărilor. Poți ",
      token_explained_link2: "crea un token de acces temporar",
      token_explained_end: " pentru a evita această problemă.",
      fetch_issues: "Preia issue-uri ca documente",
      ignores: "Fișiere ignorate",
      git_ignore:
        "Listează în format .gitignore fișierele de ignorat la colectare. Apasă enter după fiecare intrare pentru a salva.",
      task_explained:
        "Odată complet, toate fișierele vor fi disponibile pentru embedding în spații de lucru în selectorul de documente.",
      branch: "Ramura din care dorești să colectezi fișiere.",
      branch_loading: "-- încărcare ramuri disponibile --",
      branch_explained: "Ramura din care dorești să colectezi fișiere.",
      token_information:
        "Fără token-ul de acces GitLab completat, acest conector va putea colecta doar fișierele de top datorită limitărilor API-ului public GitLab.",
      token_personal:
        "Obține un token de acces personal gratuit aici cu un cont GitLab.",
    },
    youtube: {
      name: "Transcriere YouTube",
      description: "Importă transcrierea unui videoclip YouTube dintr-un link.",
      URL: "URL videoclip YouTube",
      URL_explained_start:
        "Introdu URL-ul oricărui videoclip YouTube pentru a-i prelua textul. Videoclipul trebuie să aibă ",
      URL_explained_link: "subtitrări închise",
      URL_explained_end: " disponibile.",
      task_explained:
        "Odată complet, transcrierea va fi disponibilă pentru embedding în spații de lucru în selectorul de documente.",
      language: "Limba transcrierii",
      language_explained:
        "Selectează limba transcrierii pe care dorești să o colectezi.",
      loading_languages: "-- încărcare limbi disponibile --",
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description:
        "Culege o pagină web și link-urile sale din subpaginile până la o anumită adâncime.",
      URL: "URL site web",
      URL_explained: "URL-ul site-ului pe care dorești să îl culegi.",
      depth: "Adâncime crawl",
      depth_explained:
        "Numărul de link-uri de copii pe care workerul trebuie să le urmărească din URL-ul originar.",
      max_pages: "Număr maxim pagini",
      max_pages_explained: "Numărul maxim de link-uri de colectat.",
      task_explained:
        "Odată complet, tot conținutul cules va fi disponibil pentru embedding în spații de lucru în selectorul de documente.",
    },
    confluence: {
      name: "Confluence",
      description: "Importă o pagină Confluence cu un singur click.",
      deployment_type: "Tip implementare Confluence",
      deployment_type_explained:
        "Determină dacă instanța ta Confluence este găzduită în cloud Atlassian sau self-hosted.",
      base_url: "URL de bază Confluence",
      base_url_explained:
        "Acesta este URL-ul de bază al spațiului tău Confluence.",
      space_key: "Cheie spațiu Confluence",
      space_key_explained:
        "Cheia spațiului din instanța ta Confluence care va fi folosită. De obicei începe cu ~",
      username: "Nume utilizator Confluence",
      username_explained: "Numele tău de utilizator Confluence",
      auth_type: "Tip autentificare Confluence",
      auth_type_explained:
        "Selectează tipul de autentificare pentru accesarea paginilor Confluence.",
      auth_type_username: "Nume utilizator și token de acces",
      auth_type_personal: "Token de acces personal",
      token: "Token de acces Confluence",
      token_explained_start:
        "Trebuie să furnizezi un token de acces pentru autentificare. Poți genera un token de acces ",
      token_explained_link: "aici",
      token_desc: "Token de acces pentru autentificare",
      pat_token: "Token de acces personal Confluence",
      pat_token_explained: "Token-ul tău personal de acces Confluence.",
      task_explained:
        "Odată complet, conținutul paginii va fi disponibil pentru embedding în spații de lucru în selectorul de documente.",
    },
    manage: {
      documents: null,
      "data-connectors": null,
      "desktop-only": null,
      dismiss: null,
      editing: null,
    },
    directory: {
      "my-documents": null,
      "new-folder": null,
      "search-document": null,
      "no-documents": null,
      "move-workspace": null,
      name: null,
      "delete-confirmation": null,
      "removing-message": null,
      "move-success": null,
      date: null,
      type: null,
      no_docs: null,
      select_all: null,
      deselect_all: null,
      remove_selected: null,
      costs: null,
      save_embed: null,
    },
    upload: {
      "processor-offline": null,
      "processor-offline-desc": null,
      "click-upload": null,
      "file-types": null,
      "or-submit-link": null,
      "placeholder-link": null,
      fetching: null,
      "fetch-website": null,
      "privacy-notice": null,
    },
    pinning: {
      what_pinning: null,
      pin_explained_block1: null,
      pin_explained_block2: null,
      pin_explained_block3: null,
      accept: null,
    },
    watching: {
      what_watching: null,
      watch_explained_block1: null,
      watch_explained_block2: null,
      watch_explained_block3_start: null,
      watch_explained_block3_link: null,
      watch_explained_block3_end: null,
      accept: null,
    },
  },
  chat_window: {
    welcome: "Bine ai venit în noul tău spațiu de lucru.",
    get_started: "Pentru a începe, fie",
    get_started_default: "Pentru a începe",
    upload: "încarcă un document",
    or: "sau",
    attachments_processing:
      "Fișierele atașate se procesează. Te rugăm să aștepți...",
    send_chat: "trimite un chat.",
    send_message: "Trimite mesaj",
    attach_file: "Atașează un fișier la acest chat",
    slash: "Vizualizează toate comenzile slash disponibile pentru chat.",
    agents: "Vezi toți agenții disponibili pentru chat.",
    text_size: "Schimbă dimensiunea textului.",
    microphone: "Vorbește promptul tău.",
    send: "Trimite prompt către spațiul de lucru",
    tts_speak_message: "Rostește mesajul TTS",
    copy: "Copiază",
    regenerate: "Regenerare",
    regenerate_response: "Regenerare răspuns",
    good_response: "Răspuns bun",
    more_actions: "Mai multe acțiuni",
    hide_citations: "Ascunde citările",
    show_citations: "Arată citările",
    pause_tts_speech_message: "Pauză rostire mesaj TTS",
    fork: "Fork",
    delete: "Șterge",
    save_submit: "Salvează & Trimite",
    cancel: "Anulează",
    edit_prompt: "Editează prompt",
    edit_response: "Editează răspuns",
    at_agent: "@agent",
    default_agent_description:
      " - agentul implicit pentru acest spațiu de lucru.",
    custom_agents_coming_soon: "agenții personalizați vin în curând!",
    slash_reset: "/reset",
    preset_reset_description:
      "Șterge istoricul chatului și începe o conversație nouă",
    add_new_preset: " Adaugă preset nou",
    command: "Comandă",
    your_command: "comanda-ta",
    placeholder_prompt:
      "Acesta este conținutul care va fi injectat înaintea promptului tău.",
    description: "Descriere",
    placeholder_description: "Răspunde cu o poezie despre LLM-uri.",
    save: "Salvează",
    small: "Mic",
    normal: "Normal",
    large: "Mare",
    workspace_llm_manager: {
      search: "Caută furnizori LLM",
      loading_workspace_settings: "Se încarcă setările spațiului de lucru...",
      available_models: "Modele disponibile pentru {{provider}}",
      available_models_description:
        "Selectează un model pentru acest spațiu de lucru.",
      save: "Folosește acest model",
      saving: "Setez modelul ca implicit pentru spațiu de lucru...",
      missing_credentials: "Acest furnizor lipsește credențiale!",
      missing_credentials_description: "Click pentru a configura credențialele",
    },
  },
  profile_settings: {
    edit_account: "Editează contul",
    profile_picture: "Poză profil",
    remove_profile_picture: "Șterge poza profil",
    username: "Nume utilizator",
    username_description:
      "Numele de utilizator trebuie să conțină doar litere mici, cifre, underscore și liniuțe fără spații",
    new_password: "Parolă nouă",
    password_description: "Parola trebuie să aibă cel puțin 8 caractere",
    cancel: "Anulează",
    update_account: "Actualizează contul",
    theme: "Preferință temă",
    language: "Limba preferată",
    failed_upload: "Încărcarea pozei de profil a eșuat: {{error}}",
    upload_success: "Poză de profil încărcată.",
    failed_remove: "Ștergerea pozei de profil a eșuat: {{error}}",
    profile_updated: "Profil actualizat.",
    failed_update_user: "Actualizarea utilizatorului a eșuat: {{error}}",
    account: "Cont",
    support: "Suport",
    signout: "Deconectare",
  },
  "keyboard-shortcuts": {
    title: "Scurtături de tastatură",
    shortcuts: {
      settings: "Deschide setările",
      workspaceSettings: "Deschide setările spațiului curent de lucru",
      home: "Mergi la pagina principală",
      workspaces: "Gestionează spațiile de lucru",
      apiKeys: "Setările API Keys",
      llmPreferences: "Preferințe LLM",
      chatSettings: "Setări chat",
      help: "Arată ajutor pentru scurtături de tastatură",
      showLLMSelector: "Arată selectorul LLM pentru spațiu de lucru",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Succes!",
        success_description:
          "Promptul sistemului tău a fost publicat în Comunitate!",
        success_thank_you: "Mulțumim pentru contribuția ta!",
        view_on_hub: "Vezi pe Community Hub",
        modal_title: "Publică prompt sistem",
        name_label: "Nume",
        name_description: "Acesta este numele afișat al promptului tău sistem.",
        name_placeholder: "Promptul meu sistem",
        description_label: "Descriere",
        description_description: "Descrie scopul promptului tău sistem.",
        tags_label: "Etichete",
        tags_description:
          "Etichetele ajută la căutarea promptului. Max 5 etichete, max 20 caractere fiecare.",
        tags_placeholder: "Tastează și apasă Enter pentru a adăuga etichete",
        visibility_label: "Vizibilitate",
        public_description: "Prompturile publice sunt vizibile tuturor.",
        private_description: "Prompturile private sunt vizibile doar ție.",
        publish_button: "Publică pe Community Hub",
        submitting: "Se publică...",
        submit: "Publică pe Community Hub",
        prompt_label: "Prompt",
        prompt_description:
          "Acesta este promptul efectiv folosit pentru a ghida LLM-ul.",
        prompt_placeholder: "Introdu promptul sistemului aici...",
      },
      agent_flow: {
        public_description: "Fluxurile agent publice sunt vizibile tuturor.",
        private_description: "Fluxurile agent private sunt vizibile doar ție.",
        success_title: "Succes!",
        success_description:
          "Fluxul agentului tău a fost publicat în Comunitate!",
        success_thank_you: "Mulțumim pentru contribuția ta!",
        view_on_hub: "Vezi pe Community Hub",
        modal_title: "Publică flux agent",
        name_label: "Nume",
        name_description: "Acesta este numele afișat al fluxului tău agent.",
        name_placeholder: "Fluxul meu agent",
        description_label: "Descriere",
        description_description: "Descrie scopul fluxului tău agent.",
        tags_label: "Etichete",
        tags_description:
          "Etichetele ajută la găsirea fluxului agent. Max 5 etichete, max 20 caractere fiecare.",
        tags_placeholder: "Tastează și apasă Enter pentru a adăuga etichete",
        visibility_label: "Vizibilitate",
        publish_button: "Publică pe Community Hub",
        submitting: "Se publică...",
        submit: "Publică pe Community Hub",
        privacy_note:
          "Fluxurile agent sunt întotdeauna încărcate privat pentru a proteja datele sensibile. Poți schimba vizibilitatea după publicare. Verifică că nu conține informații sensibile înainte să publici.",
      },
      slash_command: {
        success_title: "Succes!",
        success_description: "Comanda slash ta a fost publicată în Comunitate!",
        success_thank_you: "Mulțumim pentru contribuția ta!",
        view_on_hub: "Vezi pe Community Hub",
        modal_title: "Publică comandă slash",
        name_label: "Nume",
        name_description: "Acesta este numele afișat al comenzii tale slash.",
        name_placeholder: "Comanda mea slash",
        description_label: "Descriere",
        description_description: "Descrie scopul comenzii tale slash.",
        command_label: "Comandă",
        command_description:
          "Aceasta este comanda slash pe care utilizatorii o vor scrie pentru a o activa.",
        command_placeholder: "comanda-mea",
        tags_label: "Etichete",
        tags_description:
          "Etichetele ajută la găsirea comenzii. Max 5 etichete, max 20 caractere fiecare.",
        tags_placeholder: "Tastează și apasă Enter pentru a adăuga etichete",
        visibility_label: "Vizibilitate",
        public_description: "Comenzile slash publice sunt vizibile tuturor.",
        private_description: "Comenzile slash private sunt vizibile doar ție.",
        publish_button: "Publică pe Community Hub",
        submitting: "Se publică...",
        prompt_label: "Prompt",
        prompt_description:
          "Acesta este promptul folosit când se declanșează comanda slash.",
        prompt_placeholder: "Introdu promptul aici...",
      },
      generic: {
        unauthenticated: {
          title: null,
          description: null,
          button: null,
        },
      },
    },
  },
  "vector-workspace": {
    identifier: null,
    snippets: {
      title: null,
      description: null,
      recommend: null,
    },
    doc: {
      title: null,
      description: null,
      zero: null,
      low: null,
      medium: null,
      high: null,
    },
    reset: {
      reset: null,
      resetting: null,
      confirm: null,
      error: null,
      success: null,
    },
  },
  agent: {
    "performance-warning": null,
    provider: {
      title: null,
      description: null,
    },
    mode: {
      chat: {
        title: null,
        description: null,
      },
      title: null,
      description: null,
      wait: null,
    },
    skill: {
      title: null,
      description: null,
      rag: {
        title: null,
        description: null,
      },
      view: {
        title: null,
        description: null,
      },
      scrape: {
        title: null,
        description: null,
      },
      generate: {
        title: null,
        description: null,
      },
      save: {
        title: null,
        description: null,
      },
      web: {
        title: null,
        "desc-start": null,
        "desc-end": null,
      },
    },
  },
  recorded: {
    title: null,
    description: null,
    export: null,
    table: {
      id: null,
      by: null,
      workspace: null,
      prompt: null,
      response: null,
      at: null,
    },
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
  api: {
    title: null,
    description: null,
    link: null,
    generate: null,
    table: {
      key: null,
      by: null,
      created: null,
    },
  },
  llm: {
    title: null,
    description: null,
    provider: null,
    providers: {
      azure_openai: {
        azure_service_endpoint: null,
        api_key: null,
        chat_deployment_name: null,
        chat_model_token_limit: null,
        model_type: null,
        default: null,
        reasoning: null,
      },
    },
  },
  transcription: {
    title: null,
    description: null,
    provider: null,
    "warn-start": null,
    "warn-recommend": null,
    "warn-end": null,
  },
  embedding: {
    title: null,
    "desc-start": null,
    "desc-end": null,
    provider: {
      title: null,
    },
  },
  text: {
    title: null,
    "desc-start": null,
    "desc-end": null,
    size: {
      title: null,
      description: null,
      recommend: null,
    },
    overlap: {
      title: null,
      description: null,
    },
  },
};

export default TRANSLATIONS;
