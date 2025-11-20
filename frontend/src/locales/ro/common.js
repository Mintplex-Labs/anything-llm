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
        "AnythingLLM poate funcționa cu mai mulți furnizori LLM. Acesta va fi serviciul care gestionează conversațiile.",
    },
    userSetup: {
      title: "Configurare Utilizator",
      description: "Configurează setările utilizatorului tău.",
      howManyUsers: "Câți utilizatori vor folosi această resursă?",
      justMe: "Doar eu",
      myTeam: "Echipa mea",
      instancePassword: "Parola Resursei",
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
        "spațiu de lucru. Această acțiune va elimina toate încorporările vectoriale (vector embeddings) din baza dumneavoastră de date vectorială.\n\nFișierele originale rămân neatinse. Această acțiune este ireversibilă.",
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
        "Modelul specific chat folosit de acest spațiu de lucru. Dacă e lăsat gol, folosește preferința LLM a sistemului.",
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
        "desc-start": "oferă răspunsuri",
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
        "Ești în modul interogare (query), care folosește doar informațiile din documente. Treci pe modul chat pentru conversații mai flexibile sau vizitează documentația pentru mai multe detalii.",
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
    title: "Widget-uri chat integrabile (embeddable)",
    description:
      "Widgeturile de chat integrabile sunt interfețe de chat publice, asociate unui singur spațiu de lucru. Acestea vă permit să creați spații de lucru pe care le puteți apoi publica pentru întreaga lume.",
    create: "Generează cod embed",
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
  event: {
    title: "Jurnale de evenimente",
    description:
      "Vizualizează toate acțiunile și evenimentele care au loc pe această resursă pentru monitorizare.",
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
        "Extrage o pagină web și link-urile sale din subpaginile până la o anumită adâncime.",
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
        "Determină dacă resursa ta Confluence este găzduită în cloud Atlassian sau self-hosted.",
      base_url: "URL de bază Confluence",
      base_url_explained:
        "Acesta este URL-ul de bază al spațiului tău Confluence.",
      space_key: "Cheie spațiu Confluence",
      space_key_explained:
        "Cheia spațiului din resursa ta Confluence care va fi folosită. De obicei începe cu ~",
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
      documents: "Documente",
      "data-connectors": "Conectori de date",
      "desktop-only":
        "Editarea acestor setări este disponibilă doar pe un dispozitiv desktop. Te rugăm să accesezi această pagină de pe desktop pentru a continua.",
      dismiss: "Ignoră",
      editing: "Se editează",
    },
    directory: {
      "my-documents": "Documentele mele",
      "new-folder": "Folder nou",
      "search-document": "Căută document",
      "no-documents": "Niciun document",
      "move-workspace": "Mută în spațiul de lucru",
      name: "Nume",
      "delete-confirmation":
        "Ești sigur că vrei să ștergi aceste fișiere și foldere?\nAcest lucru va elimina fișierele din sistem și le va elimina automat din orice spațiu de lucru existent.\nAceastă acțiune este ireversibilă.",
      "removing-message":
        "Se elimină {{count}} documente și {{folderCount}} foldere. Te rugăm să aștepți.",
      "move-success": "S-au mutat cu succes {{count}} documente.",
      date: "Dată",
      type: "Tip",
      no_docs: "Niciun document",
      select_all: "Selectează tot",
      deselect_all: "Deselectează tot",
      remove_selected: "Elimină selectate",
      costs: "*Cost unic pentru embeddings",
      save_embed: "Salvează și încorporează",
    },
    upload: {
      "processor-offline": "Procesorul de documente este offline",
      "processor-offline-desc":
        "Nu putem încărca fișierele tale acum deoarece procesorul de documente este offline. Te rugăm să încerci din nou mai târziu.",
      "click-upload": "Clic pentru a încărca sau trage și plasa",
      "file-types":
        "suportă fișiere text, CSV-uri, foi de calcul, fișiere audio și multe altele!",
      "or-submit-link": "sau trimite un link",
      "placeholder-link": "https://exemplu.com",
      fetching: "Se preia...",
      "fetch-website": "Preluare site web",
      "privacy-notice":
        "Aceste fișiere vor fi încărcate în procesorul de documente care rulează pe această instanță AnythingLLM. Aceste fișiere nu sunt trimise sau partajate cu o terță parte.",
    },
    pinning: {
      what_pinning: "Ce este fixarea documentelor?",
      pin_explained_block1:
        "Când **fixezi** un document în AnythingLLM, vom injecta întregul conținut al documentului în fereastra de prompt pentru ca LLM-ul tău să-l înțeleagă pe deplin.",
      pin_explained_block2:
        "Acest lucru funcționează cel mai bine cu **modele cu context mare** sau fișiere mici care sunt critice pentru baza sa de cunoștințe.",
      pin_explained_block3:
        "Dacă nu obții răspunsurile dorite de la AnythingLLM în mod implicit, atunci fixarea este o modalitate excelentă de a obține răspunsuri de calitate superioară dintr-un clic.",
      accept: "Ok, am înțeles",
    },
    watching: {
      what_watching: "Ce face vizualizarea unui document?",
      watch_explained_block1:
        "Când **urmărești** un document în AnythingLLM, vom sincroniza *automat* conținutul documentului tău din sursa originală la intervale regulate. Acest lucru va actualiza automat conținutul în fiecare spațiu de lucru unde acest fișier este gestionat.",
      watch_explained_block2:
        "Această funcție suportă în prezent conținutul online și nu va fi disponibilă pentru documentele încărcate manual.",
      watch_explained_block3_start:
        "Poți gestiona ce documente sunt urmărite din vizualizarea de administrator a ",
      watch_explained_block3_link: "Managerului de fișiere",
      watch_explained_block3_end: ".",
      accept: "Ok, am înțeles",
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
        modal_title: "Publică System Prompt ",
        name_label: "Nume",
        name_description:
          "Acesta este numele afișat al System Prompt-ului tău.",
        name_placeholder: "",
        description_label: "Descriere",
        description_description: "Descrie scopul System Prompt-ului tău.",
        tags_label: "Etichete",
        tags_description:
          "Etichetele ajută la căutarea Promptului. Max 5 etichete, max 20 caractere fiecare.",
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
        prompt_placeholder: "Introdu System Prompt-ul aici...",
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
          title: "Autentificare necesară",
          description:
            "Trebuie să te autentifici cu AnythingLLM Community Hub înainte de a publica elemente.",
          button: "Conectează-te la Community Hub",
        },
      },
    },
  },
  "vector-workspace": {
    identifier: "Identificator bază de date vectorială",
    snippets: {
      title: "Număr maxim de fragmente de context",
      description:
        "Această setare controlează cantitatea maximă de fragmente de context care vor fi trimise către LLM per chat sau interogare (query).",
      recommend: "Recomandat",
    },
    doc: {
      title: "Prag de similaritate document",
      description:
        "Scorul minim de similaritate necesar pentru ca o sursă să fie considerată relevantă pentru conversație (chat). Cu cât numărul este mai mare, cu atât sursa trebuie să fie mai asemănătoare cu conversația (chat).",
      zero: "Fără restricții",
      low: "Scăzut (scor de similaritate ≥ .25)",
      medium: "Mediu (scor de similaritate ≥ .50)",
      high: "Înalt (scor de similaritate ≥ .75)",
    },
    reset: {
      reset: "Resetează baza de date vectorială",
      resetting: "Se șterg vectorii...",
      confirm:
        "Sunteți pe cale să resetați baza de date vectorială a acestui spațiu de lucru. Această acțiune va elimina toate încorporările vectoriale aflate în prezent în bază.\n\nFișierele sursă originale vor rămâne intacte. Această acțiune este ireversibilă.",
      error:
        "Baza de date vectorială a spațiului de lucru nu a putut fi resetată!",
      success: "Baza de date vectorială a spațiului de lucru a fost resetată!",
    },
  },
  agent: {
    "performance-warning":
      "Performanța LLM-urilor care nu suportă explicit apelarea de instrumente depinde în mare măsură de capabilitățile și acuratețea modelului. Unele abilități pot fi limitate sau nefuncționale.",
    provider: {
      title: "Furnizor LLM agent spațiu de lucru",
      description:
        "Furnizorul LLM și modelul specific care vor fi utilizate pentru agentul @agent al acestui spațiu de lucru.",
    },
    mode: {
      chat: {
        title: "Model de chat agent spațiu de lucru",
        description:
          "Modelul de chat specific care va fi utilizat pentru agentul @agent al acestui spațiu de lucru.",
      },
      title: "Model agent spațiu de lucru",
      description:
        "Modelul LLM specific care va fi utilizat pentru agentul @agent al acestui spațiu de lucru.",
      wait: "-- se așteaptă modele --",
    },
    skill: {
      title: "Abilități implicite ale agentului",
      description:
        "Îmbunătățește abilitățile naturale ale agentului implicit cu aceste abilități predefinite. Această configurație se aplică tuturor spațiilor de lucru.",
      rag: {
        title: "RAG & memorie pe termen lung",
        description:
          "Permite agentului să valorifice documentele dumneavoastră locale pentru a răspunde la o interogare sau cereți-i agentului să „rețină” fragmente de conținut pentru a le putea recupera ulterior din memoria pe termen lung.",
      },
      view: {
        title: "Vizualizează & rezumă documente",
        description:
          "Permite agentului să listeze și să rezume conținutul fișierelor din spațiul de lucru încorporate în prezent.",
      },
      scrape: {
        title: "Extrage date de pe site-uri web (prin web scraping)",
        description:
          "Permite agentului să viziteze și să extragă conținutul site-urilor web (prin web scraping).",
      },
      generate: {
        title: "Generează grafice",
        description:
          "Permite agentului implicit să genereze diverse tipuri de grafice din datele furnizate sau date în chat.",
      },
      save: {
        title: "Generează & salvează fișiere în browser",
        description:
          "Permite agentului implicit să genereze și să scrie fișiere care se salvează și pot fi descărcate în browserul tău.",
      },
      web: {
        title: "Căutare și navigare web live",
        "desc-start":
          "Permite-i agentului tău să caute pe web pentru a-ți răspunde la întrebări prin conectarea la un furnizor de căutare web (SERP).",
        "desc-end":
          "Căutarea web în timpul sesiunilor agentului nu va funcționa până nu este configurată.",
      },
    },
  },
  recorded: {
    title: "Conversații spațiu de lucru",
    description:
      "Acestea sunt toate conversațiile și mesajele înregistrate care au fost trimise de utilizatori, ordonate după data creării.",
    export: "Exportă",
    table: {
      id: "ID",
      by: "Trimis de",
      workspace: "Spațiu de lucru",
      prompt: "Prompt",
      response: "Răspuns",
      at: "Trimis la",
    },
  },
  customization: {
    interface: {
      title: "Preferințe UI",
      description: "Setează preferințele UI pentru AnythingLLM.",
    },
    branding: {
      title: "Branding & White-labeling",
      description:
        "Personalizează-ți instanța AnythingLLM cu branding personalizat.",
    },
    chat: {
      title: "Chat",
      description: "Setează preferințele de chat pentru AnythingLLM.",
      auto_submit: {
        title: "Trimite automat intrarea vocală",
        description:
          "Trimite automat intrarea vocală după o perioadă de liniște",
      },
      auto_speak: {
        title: "Rostește automat răspunsurile",
        description: "Rostește automat răspunsurile de la AI",
      },
      spellcheck: {
        title: "Activează verificarea ortografică",
        description:
          "Activează sau dezactivează verificarea ortografică în câmpul de introducere a chatului",
      },
    },
    items: {
      theme: {
        title: "Temă",
        description: "Selectează tema de culoare preferată pentru aplicație.",
      },
      "show-scrollbar": {
        title: "Arată bara de derulare",
        description:
          "Activează sau dezactivează bara de derulare în fereastra de chat.",
      },
      "support-email": {
        title: "Email de suport",
        description:
          "Setează adresa de email de suport care ar trebui să fie accesibilă utilizatorilor atunci când au nevoie de ajutor.",
      },
      "app-name": {
        title: "Nume aplicație",
        description:
          "Setează un nume care este afișat pe pagina de autentificare tuturor utilizatorilor.",
      },
      "chat-message-alignment": {
        title: "Alinierea mesajelor de chat",
        description:
          "Selectează modul de aliniere a mesajelor când folosești interfața de chat.",
      },
      "display-language": {
        title: "Limba de afișare",
        description:
          "Selectează limba preferată pentru a reda interfața AnythingLLM - atunci când traducerile sunt disponibile.",
      },
      logo: {
        title: "Logo brand",
        description:
          "Încarcă logo-ul tău personalizat pentru a fi afișat pe toate paginile.",
        add: "Adaugă un logo personalizat",
        recommended: "Dimensiune recomandată: 800 x 200",
        remove: "Elimină",
        replace: "Înlocuiește",
      },
      "welcome-messages": {
        title: "Mesaje de bun venit",
        description:
          "Personalizează mesajele de bun venit afișate utilizatorilor tăi. Doar utilizatorii non-admin vor vedea aceste mesaje.",
        new: "Nou",
        system: "sistem",
        user: "utilizator",
        message: "mesaj",
        assistant: "Asistent Chat AnythingLLM",
        "double-click": "Dublu clic pentru a edita...",
        save: "Salvează mesajele",
      },
      "browser-appearance": {
        title: "Aspect browser",
        description:
          "Personalizează aspectul tabului și titlului browserului când aplicația este deschisă.",
        tab: {
          title: "Titlu",
          description:
            "Setează un titlu personalizat pentru tab când aplicația este deschisă într-un browser.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Folosește un favicon personalizat pentru tabul browserului.",
        },
      },
      "sidebar-footer": {
        title: "Elemente subsol bară laterală",
        description:
          "Personalizează elementele din subsol afișate în partea de jos a barei laterale.",
        icon: "Iconiță",
        link: "Link",
      },
      "render-html": {
        title: null,
        description: null,
      },
    },
  },
  api: {
    title: "Chei API",
    description:
      "Cheile API permit deținătorului să acceseze și să gestioneze programatic această instanță AnythingLLM.",
    link: "Citește documentația API",
    generate: "Generează o nouă cheie API",
    table: {
      key: "Cheie API",
      by: "Creat de",
      created: "Creat la",
    },
  },
  llm: {
    title: "Preferința LLM",
    description:
      "Acestea sunt credențialele și setările pentru furnizorul tău preferat de chat și embedding LLM. Este important ca aceste chei să fie actuale și corecte, altfel AnythingLLM nu va funcționa corect.",
    provider: "Furnizor LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Endpoint serviciu Azure",
        api_key: "Cheie API",
        chat_deployment_name: "Nume implementare chat",
        chat_model_token_limit: "Limita token model chat",
        model_type: "Tip model",
        default: "Implicit",
        reasoning: "Raționament",
      },
    },
  },
  transcription: {
    title: "Preferința modelului de transcriere",
    description:
      "Acestea sunt credențialele și setările pentru furnizorul tău preferat de model de transcriere. Este important ca aceste chei să fie actuale și corecte, altfel fișierele media și audio nu vor fi transcrise.",
    provider: "Furnizor transcriere",
    "warn-start":
      "Utilizarea modelului local Whisper pe mașini cu RAM sau CPU limitat poate bloca AnythingLLM la procesarea fișierelor media.",
    "warn-recommend":
      "Recomandăm cel puțin 2GB de RAM și încărcarea fișierelor <10Mb.",
    "warn-end": "Modelul încorporat se va descărca automat la prima utilizare.",
  },
  embedding: {
    title: "Preferință embedding",
    "desc-start":
      "Atunci când utilizați un LLM care nu suportă nativ un motor de embedding - s-ar putea să fie necesar să specificați credențiale suplimentare pentru embedding text.",
    "desc-end":
      "Embedding-ul este procesul de transformare a textului în vectori. Aceste credențiale sunt necesare pentru a transforma fișierele și prompturile dvs. într-un format pe care AnythingLLM îl poate utiliza pentru procesare.",
    provider: {
      title: "Furnizor embedding",
    },
  },
  text: {
    title: "Preferințe de împărțire și fragmentare text",
    "desc-start":
      "Uneori, s-ar putea să doriți să modificați modul implicit în care documentele noi sunt împărțite și fragmentate înainte de a fi inserate în baza de date vectorială.",
    "desc-end":
      "Ar trebui să modificați această setare doar dacă înțelegeți cum funcționează împărțirea textului și efectele sale secundare.",
    size: {
      title: "Dimensiune fragment text",
      description:
        "Aceasta este lungimea maximă de caractere care poate fi prezentă într-un singur vector.",
      recommend: "Lungimea maximă a modelului de embedding este",
    },
    overlap: {
      title: "Suprapunere fragment text",
      description:
        "Aceasta este suprapunerea maximă de caractere care apare în timpul fragmentării între două fragmente de text adiacente.",
    },
  },
  security: {
    title: "Securitate",
    multiuser: {
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
    },
    password: {
      title: "Protecție prin parolă",
      description:
        "Protejează instanța AnythingLLM cu o parolă. Dacă o uiți, nu există metode de recuperare, deci asigură-te că o salvezi.",
      "password-label": "Parola instanței",
    },
  },
  home: {
    welcome: "Bine ai venit",
    chooseWorkspace: "Alege un spațiu de lucru pentru a începe să chatezi!",
    notAssigned:
      "Momentan nu te-ai atribuit la niciun spațiu de lucru.\nContactează-ți administratorul pentru a solicita acces la un spațiu de lucru.",
    goToWorkspace: 'Mai departe la spațiul de lucru "{{workspace}}"',
  },
};

export default TRANSLATIONS;
