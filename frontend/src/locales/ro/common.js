// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Începe",
      welcome: "Bine ați venit",
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
  },
  common: {
    "workspaces-name": "Numele spațiilor de lucru",
    selection: "Selecția modelului",
    saving: "Se salvează...",
    save: "Salvează modificările",
    previous: "Pagina anterioară",
    next: "Pagina următoare",
    optional: "Opțional",
    yes: "Da",
    no: "Nu",
    search: "Caută",
    username_requirements:
      "Numele de utilizator trebuie să aibă între 2 și 32 de caractere, să înceapă cu o literă mică și să conțină doar litere mici, cifre, liniuțe de subliniere, cratime și puncte.",
    on: "În",
    none: "Niciunul",
    stopped: "Oprit",
    loading: "Încărcare",
    refresh: "Reîmprospătează",
  },
  settings: {
    title: "Setările instanței",
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
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Centru comunitar",
      trending: "Descoperă tendințele",
      "your-account": "Contul dumneavoastră",
      "import-item": "Importați articolul",
    },
    channels: "Canale",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Sarcini programate",
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
    "sign-in": "Autentifică-te în {{appName}} cont.",
    "password-reset": {
      title: "Resetare parolă",
      description:
        "Introdu informațiile necesare mai jos pentru a reseta parola.",
      "recovery-codes": "Coduri de recuperare",
      "back-to-login": "Înapoi la autentificare",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Creați un agent",
      editWorkspace: "Modifică spațiul de lucru",
      uploadDocument: "Încărcați un document",
    },
    greeting: "Cu ce vă pot ajuta astăzi?",
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
    },
    mode: {
      title: "Mod chat",
      chat: {
        title: "Chat",
        description:
          'va oferi răspunsuri folosind cunoștințele generale ale LLM și contextul documentului, așa cum este disponibil.<br />Va trebui să utilizați comanda "@agent" pentru a utiliza instrumentele.',
      },
      query: {
        title: "Interogare",
        description:
          "vor oferi răspunsuri doar dacă contextul documentului este identificat.<b>Veți avea nevoie să utilizați comanda @agent pentru a utiliza instrumentele.",
      },
      automatic: {
        description:
          'va utiliza automat instrumentele, dacă modelul și furnizorul suportă apelarea nativă a instrumentelor.<br />Dacă apelarea nativă a instrumentelor nu este suportată, veți avea nevoie să utilizați comanda "@agent" pentru a utiliza instrumentele.',
        title: "Agent",
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
    anonymous: "Telemetrie anonimă activată",
  },
  connectors: {
    "search-placeholder": "Caută conectori de date",
    "no-connectors": "Nu au fost găsiți conectori de date.",
    obsidian: {
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
      bypass_ssl: "Ocolirea validării certificatului SSL",
      bypass_ssl_explained:
        "Activați această opțiune pentru a ocoli validarea certificatului SSL pentru instanțele Confluence găzduite de utilizator, cu un certificat semnat de utilizator.",
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
      "delete-confirmation":
        "Ești sigur că vrei să ștergi aceste fișiere și foldere?\nAcest lucru va elimina fișierele din sistem și le va elimina automat din orice spațiu de lucru existent.\nAceastă acțiune este ireversibilă.",
      "removing-message":
        "Se elimină {{count}} documente și {{folderCount}} foldere. Te rugăm să aștepți.",
      "move-success": "S-au mutat cu succes {{count}} documente.",
      no_docs: "Niciun document",
      select_all: "Selectează tot",
      deselect_all: "Deselectează tot",
      remove_selected: "Elimină selectate",
      save_embed: "Salvează și încorporează",
      "total-documents_one": "{{count}}",
      "total-documents_other": "{{count}} documente",
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
    attachments_processing:
      "Fișierele atașate se procesează. Te rugăm să aștepți...",
    send_message: "Trimite mesaj",
    attach_file: "Atașează un fișier la acest chat",
    text_size: "Schimbă dimensiunea textului.",
    microphone: "Vorbește promptul tău.",
    send: "Trimite prompt către spațiul de lucru",
    tts_speak_message: "Rostește mesajul TTS",
    copy: "Copiază",
    regenerate: "Regenerare",
    regenerate_response: "Regenerare răspuns",
    good_response: "Răspuns bun",
    more_actions: "Mai multe acțiuni",
    fork: "Fork",
    delete: "Șterge",
    cancel: "Anulează",
    edit_prompt: "Editează prompt",
    edit_response: "Editează răspuns",
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
    submit: "Trimite",
    edit_info_user:
      "„Trimite” recreează răspunsul generat de inteligența artificială. „Salvează” actualizează doar mesajul dumneavoastră.",
    edit_info_assistant:
      "Modificările pe care le faceți vor fi salvate direct în acest răspuns.",
    see_less: "Vezi mai puțin",
    see_more: "Vezi mai multe",
    tools: "Unelte",
    text_size_label: "Dimensiunea textului",
    select_model: "Selectați modelul",
    sources: "Surse",
    document: "Document",
    similarity_match: "meci",
    source_count_one: "{{count}} – referință",
    source_count_other: "Referințe către {{count}}",
    preset_exit_description: "Întrerupeți sesiunea actuală a agentului",
    add_new: "Adaugă",
    edit: "Editează",
    publish: "Publica",
    stop_generating: "Opriți generarea răspunsului",
    slash_commands: "Comenzi scurte",
    agent_skills: "Abilități ale agentului",
    manage_agent_skills: "Gestionarea competențelor agenților",
    agent_skills_disabled_in_session:
      "Nu este posibil să modificați abilitățile în timpul unei sesiuni cu un agent activ. Pentru a încheia sesiunea, utilizați comanda /exit.",
    start_agent_session: "Începe sesiunea de agent",
    use_agent_session_to_use_tools:
      'Puteți utiliza instrumentele disponibile în chat, inițiind o sesiune cu un agent, începând mesajul cu "@agent".',
    agent_invocation: {
      model_wants_to_call: "Persoana respectivă dorește să facă o telefonare.",
      approve: "Aprobă",
      reject: "Refuz",
      always_allow: "Asigurați-vă întotdeauna că {{skillName}}",
      tool_call_was_approved: "Cererea de achiziție a fost aprobată.",
      tool_call_was_rejected:
        "Cererea de utilizare a instrumentului a fost respinsă.",
    },
    custom_skills: "Abilități personalizate",
    agent_flows: "Fluxuri de agenți",
    no_tools_found: "Nu au fost găsite instrumente corespunzătoare.",
    loading_mcp_servers: "Încărcare servere MCP...",
    app_integrations: "Integrarea aplicațiilor",
    sub_skills: "Abilități specifice",
  },
  profile_settings: {
    edit_account: "Editează contul",
    profile_picture: "Poză profil",
    remove_profile_picture: "Șterge poza profil",
    username: "Nume utilizator",
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
        name_placeholder: "Asistentul meu",
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
        prompt_label: "Prompt",
        prompt_description:
          "Acesta este promptul efectiv folosit pentru a ghida LLM-ul.",
        prompt_placeholder: "Introdu System Prompt-ul aici...",
      },
      agent_flow: {
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
      web: {
        title: "Căutare și navigare web live",
        description:
          "Permite-i agentului tău să caute pe internet pentru a răspunde la întrebările tale, conectându-l la un furnizor de servicii de căutare web (SERP).",
      },
      sql: {
        title: "Conector SQL",
        description:
          "Permite-ți agentului să utilizeze SQL pentru a răspunde la întrebările tale, conectându-se la diverși furnizori de baze de date SQL.",
      },
      default_skill:
        "Implicit, această funcție este activată, dar puteți dezactiva-o dacă nu doriți ca agentul să o utilizeze.",
      filesystem: {
        title: "Acces la sistemul de fișiere",
        description:
          "Permite reprezentantului dumneavoastră să citească, să scrie, să caute și să gestioneze fișiere într-un director specific. Suportă editarea fișierelor, navigarea în director și căutarea conținutului.",
        learnMore:
          "Aflați mai multe despre cum să utilizați această abilitate.",
        configuration: "Configurare",
        readActions: "Cite",
        writeActions: "Acțiuni",
        warning:
          "Accesul la sistemul de fișiere poate fi periculos, deoarece poate modifica sau șterge fișiere. Vă rugăm să consultați documentația <a>înainte de a-l activa.",
        skills: {
          "read-text-file": {
            title: "Citește fișierul",
            description:
              "Citează conținutul fișierelor (text, cod, PDF, imagini, etc.)",
          },
          "read-multiple-files": {
            title: "Citește mai multe fișiere",
            description: "Citiți mai multe fișiere simultan",
          },
          "list-directory": {
            title: "Lista de contacte",
            description: "Enumeră fișierele și directoarele dintr-un folder",
          },
          "search-files": {
            title: "Caută fișiere",
            description: "Căutați fișiere după nume sau conținut",
          },
          "get-file-info": {
            title: "Obține informații despre fișier",
            description: "Obțineți metadate detaliate despre fișiere.",
          },
          "edit-file": {
            title: "Modifică fișierul",
            description: "Realizați modificări pe linii în fișierele de text.",
          },
          "create-directory": {
            title: "Creați o directoare",
            description: "Creați noi directoare",
          },
          "move-file": {
            title: "Mută/Redenumirea fișierului",
            description: "Mută sau redenumește fișierele și directoarele.",
          },
          "copy-file": {
            title: "Copiază fișier",
            description: "Copiați fișiere și directoare",
          },
          "write-text-file": {
            title: "Creați un fișier de text",
            description:
              "Creați fișiere de text noi sau suprascrieți fișierele de text existente.",
          },
        },
      },
      createFiles: {
        title: "Crearea de documente",
        description:
          "Permite-ți agentului să creeze formate de documente binare, cum ar fi prezentări PowerPoint, fișe Excel, documente Word și fișiere PDF. Fișierele pot fi descărcate direct din fereastra de chat.",
        configuration: "Tipuri de documente disponibile",
        skills: {
          "create-text-file": {
            title: "Fișiere text",
            description:
              "Creați fișiere text cu orice conținut și extensie (de exemplu, .txt, .md, .json, .csv, etc.)",
          },
          "create-pptx": {
            title: "Prezentări PowerPoint",
            description:
              "Creați prezentări noi în PowerPoint, cu diapozitive, titluri și puncte.",
          },
          "create-pdf": {
            title: "Documente în format PDF",
            description:
              "Creați documente PDF din fișiere Markdown sau text simplu, cu un stil de formatare de bază.",
          },
          "create-xlsx": {
            title: "Fișe Excel",
            description:
              "Creați fișiere Excel pentru date tabulare, cu foi și stilizare.",
          },
          "create-docx": {
            title: "Fișiere în format Word",
            description:
              "Creați documente Word cu un stil și formatare de bază.",
          },
        },
      },
      gmail: {
        title: "Conectorul GMail",
        description:
          "Permite-i agentului tău să interacționeze cu Gmail: caută e-mailuri, citește conversații, redactează proiecte, trimite e-mailuri și gestionează folderul tău de e-mail. Consultă documentația disponibilă aici.",
        multiUserWarning:
          "Integrarea cu Gmail nu este disponibilă în modul multi-utilizator, din motive de securitate. Vă rugăm să dezactivați modul multi-utilizator pentru a utiliza această funcție.",
        configuration: "Configurarea contului Gmail",
        deploymentId: "Identificator de implementare",
        deploymentIdHelp:
          "ID-ul de implementare al aplicației web Google Apps Script",
        apiKey: "Cheie API",
        apiKeyHelp:
          "Cheia API pe care ați configurat în mediul de implementare Google Apps Script",
        configurationRequired:
          "Vă rugăm să configurați ID-ul de implementare și cheia API pentru a activa funcționalitățile Gmail.",
        configured: "Configurat",
        searchSkills: "Abilități de căutare...",
        noSkillsFound:
          "Nu s-au găsit rezultate care să corespundă criteriilor dumneavoastră de căutare.",
        categories: {
          search: {
            title: "Căutați și citiți e-mailuri",
            description:
              "Căutați și citiți e-mailuri din folderul dumneavoastră Gmail",
          },
          drafts: {
            title: "Propuneri de e-mail",
            description: "Creați, editați și gestionați schițele de e-mail.",
          },
          send: {
            title: "Trimite și răspunde la e-mailuri",
            description: "Trimite e-mailuri și răspunde imediat la discuții",
          },
          threads: {
            title: "Gestionați conversațiile prin e-mail",
            description:
              "Gestionați corespondența prin e-mail: marcați ca fiind citite/nepuse în evidență, arhivați, eliminați",
          },
          account: {
            title: "Statistici privind integrarea",
            description:
              "Vizualizați statistici privind cutia poștală și informații despre cont",
          },
        },
        skills: {
          search: {
            title: "Căutați în e-mailuri",
            description:
              "Căutați în e-mailuri folosind sintaxa de interogare a Gmail",
          },
          readThread: {
            title: "Citește thread-ul",
            description:
              "Citește întregul fir de e-mail, folosind un identificator (ID).",
          },
          createDraft: {
            title: "Creează o schiță",
            description: "Creați un proiect nou de e-mail",
          },
          createDraftReply: {
            title: "Creează un răspuns preliminar",
            description: "Creați un proiect de răspuns la un thread existent.",
          },
          updateDraft: {
            title: "Actualizare proiect",
            description: "Actualizați un e-mail existent, draft",
          },
          getDraft: {
            title: "Obține versiunea preliminară",
            description: "Recuperați un proiect specific folosind ID-ul său",
          },
          listDrafts: {
            title: "Propuneri",
            description: "Enumerați toate e-mailurile draft",
          },
          deleteDraft: {
            title: "Șterge proiectul",
            description: "Șterge un proiect de email",
          },
          sendDraft: {
            title: "Trimite versiunea preliminară",
            description: "Trimiteți o versiune existentă a unui e-mail",
          },
          sendEmail: {
            title: "Trimite e-mail",
            description: "Trimiteți un e-mail imediat.",
          },
          replyToThread: {
            title: "Răspunde la discuție",
            description: "Răspundeți imediat la un fir de e-mail",
          },
          markRead: {
            title: "Mark Read",
            description: "Marcați un fir ca fiind citit",
          },
          markUnread: {
            title: "Marchează ca necitit",
            description: "Marcați un thread ca fiind necitit",
          },
          moveToTrash: {
            title: "Mută în coșul de gunoi",
            description: "Mută un fir în coșul de gunoi",
          },
          moveToArchive: {
            title: "Arhivă",
            description: "Arhivează un thread",
          },
          moveToInbox: {
            title: "Mută în Inbox",
            description: "Mută un fir în folderul „Intrări”",
          },
          getMailboxStats: {
            title: "Statistici cutie poștală",
            description:
              "Obține numărul de e-mailuri necitite și statistici privind cutia poștală.",
          },
          getInbox: {
            title: 'Accesează folderul "Inbox"',
            description:
              "O modalitate eficientă de a accesa e-mailurile din inbox-ul Gmail.",
          },
        },
      },
      outlook: {
        title: "Conector Outlook",
        description:
          "Permiteți-i agentului dumneavoastră să interacționeze cu Microsoft Outlook – să caute e-mailuri, să citească conversații, să redacteze proiecte, să trimită e-mailuri și să gestioneze folderul de intrare, folosind Microsoft Graph API. Consultați documentația aici.",
        multiUserWarning:
          "Integrarea cu Outlook nu este disponibilă în modul pentru utilizatori multipli, din motive de securitate. Vă rugăm să dezactivați modul pentru utilizatori multipli pentru a utiliza această funcție.",
        configuration: "Configurarea Outlook-ului",
        authType: "Tip de cont",
        authTypeHelp:
          "Selectați ce tipuri de conturi Microsoft pot fi utilizate pentru autentificare. Opțiunea „Toate conturile” permite autentificarea atât pentru conturi personale, cât și pentru conturi de lucru/școlare. Opțiunea „Doar conturi personale” limitează autentificarea la conturi Microsoft personale. Opțiunea „Doar conturi de organizație” limitează autentificarea la conturi de lucru/școlare dintr-un anumit tenant Azure AD.",
        authTypeCommon:
          "Toate conturile (personale și cele legate de muncă/școală)",
        authTypeConsumers: "Conturile personale Microsoft sunt acceptate.",
        authTypeOrganization:
          "Conturi pentru organizații (necesită ID-ul chiriașului)",
        clientId: "Identificator (pentru client)",
        clientIdHelp:
          "Identificatorul aplicației (Client) din înregistrarea aplicației dumneavoastră Azure AD",
        tenantId: "Codul identificator (pentru chiriaș)",
        tenantIdHelp:
          "ID-ul din director (pentru chiriaș) din înregistrarea aplicației dumneavoastră Azure AD. Este necesar doar pentru autentificare, utilizată exclusiv de organizație.",
        clientSecret: "Confidențialitatea clientului",
        clientSecretHelp:
          "Valoarea secretă a clientului, obținută în urma înregistrării aplicației dvs. în Azure AD",
        configurationRequired:
          "Vă rugăm să configurați ID-ul clientului și Secretul clientului pentru a activa funcționalitățile Outlook.",
        authRequired:
          "În primul rând, salvați-vă datele de autentificare, apoi autentificați-vă cu Microsoft pentru a finaliza configurarea.",
        authenticateWithMicrosoft: "Autentificați-vă cu Microsoft",
        authenticated: "Autentificare reușită cu Microsoft Outlook.",
        revokeAccess: "Anula accesul",
        configured: "Configurat",
        searchSkills: "Abilități de căutare...",
        noSkillsFound:
          "Nu s-au găsit rezultate care să corespundă criteriilor dumneavoastră de căutare.",
        categories: {
          search: {
            title: "Caută și citește e-mailuri",
            description:
              "Căutați și citiți e-mailuri din folderul dumneavoastră Outlook",
          },
          drafts: {
            title: "Propuneri de e-mail",
            description: "Creați, editați și gestionați schițele de e-mail.",
          },
          send: {
            title: "Trimite e-mailuri",
            description:
              "Trimiteți e-mailuri noi sau răspundeți imediat la mesajele primite.",
          },
          account: {
            title: "Statistici privind integrarea",
            description:
              "Vizualizați statistici privind cutia poștală și informații despre cont",
          },
        },
        skills: {
          getInbox: {
            title: "Accesați inbox-ul",
            description:
              "Accesați email-urile recente din dosarul dvs. Outlook.",
          },
          search: {
            title: "Căutați în e-mailuri",
            description:
              "Căutați în e-mailuri folosind sintaxa de căutare Microsoft",
          },
          readThread: {
            title: "Citește conversația",
            description: "Citește întreaga corespondență prin e-mail.",
          },
          createDraft: {
            title: "Creați o versiune preliminară",
            description:
              "Creați un e-mail nou sau un răspuns la un e-mail existent.",
          },
          updateDraft: {
            title: "Actualizare proiect",
            description: "Actualizați un e-mail existent, draft",
          },
          listDrafts: {
            title: "Propuneri",
            description: "Enumerați toate e-mailurile draft",
          },
          deleteDraft: {
            title: "Șterge schița",
            description: "Șterge un proiect de e-mail",
          },
          sendDraft: {
            title: "Trimite versiunea preliminară",
            description: "Trimite un e-mail existent, draft",
          },
          sendEmail: {
            title: "Trimite e-mail",
            description:
              "Trimiteți un nou e-mail sau răspundeți imediat la un mesaj existent.",
          },
          getMailboxStats: {
            title: "Statistici cutie poștală",
            description:
              "Obține numărul de foldere și statisticile pentru cutiile de e-mail.",
          },
        },
      },
      googleCalendar: {
        title: "Conector Google Calendar",
        description:
          "Permite-ți agentului să interacționeze cu Google Calendar – vizualizează calendare, obține evenimente, creează și actualizează evenimente, și gestionează răspunsurile la invitații. Consultă documentația<a>.",
        multiUserWarning:
          "Integrarea cu Google Calendar nu este disponibilă în modul multi-utilizator, din motive de securitate. Vă rugăm să dezactivați modul multi-utilizator pentru a utiliza această funcție.",
        configuration: "Configurarea calendarului Google",
        deploymentId: "ID de implementare",
        deploymentIdHelp:
          "ID-ul de implementare al aplicației web Google Apps Script",
        apiKey: "Cheia API",
        apiKeyHelp:
          "Cheia API pe care ați configurat în implementarea dumneavoastră de Google Apps Script",
        configurationRequired:
          "Vă rugăm să configurați ID-ul de implementare și cheia API pentru a activa funcționalitățile Google Calendar.",
        configured: "Configurat",
        searchSkills: "Abilități de căutare...",
        noSkillsFound:
          "Nu s-au găsit rezultate care să corespundă criteriilor dumneavoastră de căutare.",
        categories: {
          calendars: {
            title: "Calendare",
            description: "Vizualizați și gestionați calendarele Google.",
          },
          readEvents: {
            title: "Vezi evenimente",
            description: "Vizualizați și căutați evenimentele din calendar",
          },
          writeEvents: {
            title: "Creați și actualizați evenimente",
            description:
              "Creați evenimente noi și modificați evenimentele existente.",
          },
          rsvp: {
            title: "Gestionarea răspunsurilor",
            description:
              "Gestionați starea răspunsului dumneavoastră pentru evenimente",
          },
        },
        skills: {
          listCalendars: {
            title: "Liste de calendare",
            description:
              "Enumerați toate calendarele pe care le dețineți sau pentru care aveți abonament.",
          },
          getCalendar: {
            title: "Obțineți detalii despre calendar",
            description:
              "Obțineți informații detaliate despre un calendar specific.",
          },
          getEvent: {
            title: "Obține evenimentul",
            description:
              "Obțineți informații detaliate despre un eveniment specific.",
          },
          getEventsForDay: {
            title: "Obține evenimente pentru ziua respectivă",
            description:
              "Obțineți toate evenimentele programate pentru o anumită dată.",
          },
          getEvents: {
            title: "Obține evenimente (interval de date)",
            description: "Obține evenimente într-un interval de date specific",
          },
          getUpcomingEvents: {
            title: "Vezi evenimentele viitoare",
            description:
              "Găsiți evenimente pentru ziua de azi, pentru această săptămână sau pentru acest lună, folosind cuvinte cheie simple.",
          },
          quickAdd: {
            title: "Adaugă eveniment rapid",
            description:
              "Creați un eveniment folosind limbaj natural (de exemplu, „Întâlnire mâine la ora 15:00”)",
          },
          createEvent: {
            title: "Creați eveniment",
            description:
              "Creați un eveniment nou, având control complet asupra tuturor proprietăților.",
          },
          updateEvent: {
            title: "Actualizare eveniment",
            description: "Modificați un eveniment existent din calendar",
          },
          setMyStatus: {
            title: "Stare confirmare participare",
            description: "Acceptă, refuză sau acceptă cu rezerve evenimentul",
          },
        },
      },
    },
    mcp: {
      title: "Servere MCP",
      "loading-from-config":
        "Încărcarea serverelor MCP din fișierul de configurare",
      "learn-more": "Aflați mai multe despre serverele MCP.",
      "no-servers-found": "Nu au fost găsite servere MCP.",
      "tool-warning":
        "Pentru cele mai bune rezultate, luați în considerare dezactivarea instrumentelor nedorite, pentru a economisi resurse.",
      "stop-server": "Închideți serverul MCP",
      "start-server": "Pornește serverul MCP",
      "delete-server": "Șterge serverul MCP",
      "tool-count-warning":
        "Acest server MCP are activate<b> instrumentele menționate</b>, care vor consuma context în fiecare sesiune de chat.<br />Luați în considerare dezactivarea instrumentelor nedorite pentru a economisi context.",
      "startup-command": "Comanda de pornire",
      command: "Ordine",
      arguments: "Argumente",
      "not-running-warning":
        "Acest server MCP nu este în funcționare – ar putea fi oprit sau ar putea întâmpina o eroare la pornire.",
      "tool-call-arguments": "Argumente pentru apelarea unei funcții",
      "tools-enabled": "instrumentele sunt activate",
    },
    settings: {
      title: "Setări pentru abilitățile agenților",
      "max-tool-calls": {
        title:
          "Numărul maxim de solicitări de instrument (Max Tool Calls Per Response)",
        description:
          "Numărul maxim de instrumente pe care un agent le poate utiliza în mod consecutiv pentru a genera un singur răspuns. Această funcție previne apelurile inutile ale instrumentelor și buclele infinite.",
      },
      "intelligent-skill-selection": {
        title: "Selecție inteligentă a abilităților",
        "beta-badge": "Beta",
        description:
          "Permite utilizarea nelimitată a instrumentelor și reduce utilizarea token-urilor cu până la 80% pentru fiecare interogare – AnythingLLM selectează automat abilitățile potrivite pentru fiecare solicitare.",
        "max-tools": {
          title: "Max Tools",
          description:
            "Numărul maxim de instrumente care pot fi selectate pentru fiecare interogare. Recomandăm stabilirea acestui parametru la valori mai mari pentru modelele cu un context mai amplu.",
        },
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
        title: "Redarea HTML în chat",
        description:
          "Afișarea răspunsurilor HTML în răspunsurile asistentului.\nAcest lucru poate duce la o calitate a răspunsurilor mult mai bună, dar poate și la riscuri potențiale de securitate.",
      },
    },
  },
  api: {
    title: "Chei API",
    description:
      "Cheile API permit deținătorului să acceseze și să gestioneze programatic această instanță AnythingLLM.",
    link: "Citește documentația API",
    generate: "Generează o nouă cheie API",
    empty: "Nu au fost găsite chei API",
    actions: "Acțiuni",
    messages: {
      error: "Eroare: {{error}}",
    },
    modal: {
      title: "Creează o cheie API nouă",
      cancel: "Anulează",
      close: "Închide",
      create: "Creează cheia API",
      helper:
        "După creare, cheia API poate fi folosită pentru a accesa și configura programatic această instanță AnythingLLM.",
      name: {
        label: "Nume",
        placeholder: "Integrare de producție",
        helper:
          "Opțional. Folosește un nume clar pentru a putea identifica această cheie mai târziu.",
      },
    },
    row: {
      copy: "Copiază cheia API",
      copied: "Copiată",
      unnamed: "--",
      deleteConfirm:
        "Sigur doriți să dezactivați această cheie API?\nDupă aceea nu va mai putea fi folosită.\n\nAceastă acțiune este ireversibilă.",
    },
    table: {
      name: "Nume",
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
        model_type_tooltip:
          "Dacă implementarea dvs. utilizează un model de raționament (o1, o1-mini, o3-mini, etc.), setați această opțiune la „Raționament”. În caz contrar, cererile dvs. de chat pot eșua.",
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
  telegram: {
    title: "Bot pentru Telegram",
    description:
      "Conectați instanța dumneavoastră AnythingLLM cu Telegram, astfel încât să puteți interacționa cu spațiile de lucru de pe orice dispozitiv.",
    setup: {
      step1: {
        title: "Pasul 1: Creați botul dumneavoastră Telegram",
        description:
          "Deschide chatul cu @BotFather pe Telegram, trimite mesajul `/newbot` către <code>@BotFather</code>, urmează instrucțiunile și copiază token-ul API.",
        "open-botfather": "Deschide aplicația BotFather",
        "instruction-1": "1. Deschideți link-ul sau scanați codul QR",
        "instruction-2":
          "2. Trimite <code>/newbot</code> către <code>@BotFather</code>",
        "instruction-3":
          "3. Alege un nume și un nume de utilizator pentru botul tău.",
        "instruction-4": "4. Copiați token-ul API pe care îl primiți.",
      },
      step2: {
        title: "Pasul 2: Conectați-vă bot-ul",
        description:
          "Lipește token-ul API pe care l-ați primit de la @BotFather și selectați un spațiu de lucru implicit pentru ca botul dumneavoastră să poată interacționa.",
        "bot-token": "Token Bot",
        connecting: "Conectare...",
        "connect-bot": "Conectare automată",
      },
      security: {
        title: "Recomandări privind setările de securitate",
        description:
          "Pentru o securitate suplimentară, configurați aceste setări în contul @BotFather.",
        "disable-groups": "— Preveniți adăugarea de bot-uri în grupuri",
        "disable-inline":
          "— Previne utilizarea bot-urilor în căutările directe",
        "obscure-username":
          "Utilizați un nume de utilizator pentru bot, care nu este evident, pentru a reduce vizibilitatea acestuia.",
      },
      "toast-enter-token": "Vă rugăm să introduceți un token pentru bot.",
      "toast-connect-failed": "Nu a reușit să se conecteze bot-ul.",
    },
    connected: {
      status: "Conectat",
      "status-disconnected":
        "Deconectat – token-ul poate fi expirat sau invalid",
      "placeholder-token": "Creați un nou token pentru bot...",
      reconnect: "Restabilește conexiunea",
      workspace: "Spațiu de lucru",
      "bot-link": "Link către bot",
      "voice-response": "Răspuns vocal",
      disconnecting: "Deconectare...",
      disconnect: "Dezactivează",
      "voice-text-only": "Doar text",
      "voice-mirror":
        "Reflectare (răspunde cu voce atunci când utilizatorul trimite înregistrare audio)",
      "voice-always":
        "Asigurați-vă întotdeauna că includeți un mesaj audio (trimiteți înregistrarea audio împreună cu fiecare răspuns).",
      "toast-disconnect-failed": "Nu s-a reușit deconectarea bot-ului.",
      "toast-reconnect-failed": "Nu a reușit să se reconecteze.",
      "toast-voice-failed": "Nu a reușit să actualizeze modul de voce.",
      "toast-approve-failed": "Nu a fost posibilă aprobarea utilizatorului.",
      "toast-deny-failed": "Nu a reușit să respingă cererea utilizatorului.",
      "toast-revoke-failed":
        "Nu a fost posibil să se anuleze contul utilizatorului.",
    },
    users: {
      "pending-description":
        "Utilizatorii care așteaptă să fie verificați. Potrivirea codului de asociere afișat aici cu cel afișat în chat-ul lor de pe Telegram.",
      unknown: "Necunoscut",
    },
  },
  scheduledJobs: {
    title: "Sarcini programate",
    enableNotifications:
      "Activați notificările din browser pentru rezultatele căutării de locuri de muncă.",
    description:
      "Creați sarcini AI repetitive, care rulează conform unui program. Fiecare sarcină execută un prompt, folosind opțional anumite instrumente, și salvează rezultatul pentru a fi revizuit ulterior.",
    newJob: "Loc de muncă nou",
    loading: "Se încarcă...",
    emptyTitle: "Momentan, nu există sarcini programate.",
    emptySubtitle: "Creați unul pentru a începe.",
    table: {
      name: "Nume",
      schedule: "Program",
      status: "Stare",
      lastRun: "Ultima cursă",
      nextRun: "Următoarea cursă",
      actions: "Acțiuni",
    },
    confirmDelete:
      "Sunteți sigur că doriți să eliminați această sarcină programată?",
    toast: {
      deleted: "Locul de muncă a fost șters",
      triggered: "Job-ul a fost executat cu succes.",
      triggerFailed: "Nu a reușit să declanșeze execuția.",
      triggerSkipped:
        "Procesul de licitație pentru acest proiect este deja în desfășurare.",
      killed: "Procesul de angajare s-a încheiat cu succes.",
      killFailed: "Nu am reușit să opresc activitatea.",
    },
    row: {
      neverRun: "Nu alerga",
      viewRuns: "Rute disponibile",
      runNow: "Începeți acum",
      enable: "Activează",
      disable: "Dezactivează",
      edit: "Editează",
      delete: "Șterge",
    },
    modal: {
      titleEdit: "Modifică programarea unei sarcini",
      titleNew: "Job nou programat",
      nameLabel: "Nume",
      namePlaceholder: "de exemplu, „Rezumatul zilnic de știri”",
      promptLabel: "Solicitare",
      promptPlaceholder: "Instrucțiunea de a rula la fiecare execuție...",
      scheduleLabel: "Program",
      modeBuilder: "Constructor",
      modeCustom: "Personalizat",
      cronPlaceholder: "Expresia cron (de exemplu, 0 9 * * *)",
      currentSchedule: "Programul actual:",
      toolsLabel: "Unelte (opționale)",
      toolsDescription:
        "Selectați instrumentele disponibile pentru acest job. Dacă niciun instrument nu este selectat, job-ul va rula fără a utiliza niciun instrument.",
      toolsSearch: "Caută",
      toolsNoResults: "Nu există unelte potrivite.",
      required: "Necesare",
      requiredFieldsBanner:
        "Vă rugăm să completați toate câmpurile obligatorii pentru a crea o ofertă de loc de muncă.",
      cancel: "Anula",
      saving: "Economisire...",
      updateJob: "Actualizare post",
      createJob: "Creați o nouă poziție",
      jobUpdated: "Postul a fost actualizat",
      jobCreated: "Loc de muncă creat",
    },
    builder: {
      fallbackWarning:
        'Această expresie nu poate fi modificată vizual. Selectați "Personalizat" pentru a o păstra, sau modificați orice element de mai jos pentru a o suprascrie.',
      run: "Alătura",
      frequency: {
        minute: "în fiecare minut",
        hour: "pe oră",
        day: "zilnic",
        week: "săptămânal",
        month: "lunar",
      },
      every: "Fiecare",
      minuteOne: "1 minut",
      minuteOther: "{{count}} minute(s)",
      atMinute: "La minut",
      pastEveryHour: "în fiecare oră",
      at: "La",
      on: "În",
      onDay: "Într-o zi",
      ofEveryMonth: "pentru fiecare lună",
      weekdays: {
        sun: "Soare",
        mon: "O singură",
        tue: "Marți",
        wed: "Miercuri",
        thu: "Joi",
        fri: "Ziua de vineri",
        sat: "Sat",
      },
    },
    runHistory: {
      back: "Înapoi la anunțuri de angajare",
      title: "Istoric de rulare: {{name}}",
      schedule: "Program:",
      emptyTitle: "Nu am obținut încă rezultate pentru acest proiect.",
      emptySubtitle: "Executați sarcina acum și verificați rezultatele.",
      runNow: "Începeți acum",
      table: {
        status: "Stare",
        started: "A început",
        duration: "Durată",
        error: "Eroare",
      },
      stopJob: "Întrerupeți activitatea",
    },
    runDetail: {
      loading: "Încărcare detalii despre rulare...",
      notFound: "Nu s-a găsit.",
      back: "Înapoi",
      unknownJob: "Loc de muncă necunoscut",
      runHeading: "{{name}} — Executarea #{{id}}",
      duration: "Durată: {{value}}",
      creating: "Crearea...",
      threadFailed: "Nu a reușit să creeze thread-ul.",
      sections: {
        prompt: "Solicitare",
        error: "Eroare",
        thinking: "Gânduri ({{count}})",
        toolCalls: "Apeluri către instrumente ({{count}})",
        files: "Fișiere ({{count}})",
        response: "Răspuns",
        metrics: "Indicatori",
      },
      metrics: {
        promptTokens: "Cuvinte-cheie:",
        completionTokens: "Token-uri de finalizare:",
      },
      stopJob: "Încetarea activității",
      killing: "Oprire...",
      continueInThread: "Continuă în chat",
    },
    toolCall: {
      arguments: "Argumente:",
      showResult: "Afișează rezultatul",
      hideResult: "Ascunde rezultatul",
    },
    file: {
      unknown: "Fișier necunoscut",
      download: "Descarcă",
      downloadFailed: "Nu a reușit să descarce fișierul",
      types: {
        powerpoint: "PowerPoint",
        pdf: "Fișier PDF",
        word: "Fișier Word",
        spreadsheet: "Fișă de calcul",
        generic: "Fișier",
      },
    },
    status: {
      completed: "Finalizat",
      failed: "Eșuat",
      timed_out: "Timpul a expirat",
      running: "Cursa",
      queued: "În așteptare",
    },
  },
};

export default TRANSLATIONS;
