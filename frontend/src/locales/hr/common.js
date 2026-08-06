// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      welcome: "Dobrodošli",
      getStarted: "Započni",
    },
    llm: {
      title: "LLM postavka",
      description:
        "AnythingLLM može raditi s mnogim LLM pružateljima usluga. Ovo je usluga koja će upravljati razgovorom.",
    },
    userSetup: {
      title: "Postavljanje korisnika",
      description: "Konfigurirajte svoje korisničke postavke.",
      howManyUsers: "Koliko će korisnika koristiti ovu instancu?",
      justMe: "Samo ja",
      myTeam: "Moj timu",
      instancePassword: "Lozinka instance",
      setPassword: "Želite li postaviti lozinku?",
      passwordReq: "Lozinka mora imati najmanje 8 znakova.",
      passwordWarn:
        "Važno je da spremite ovu lozinku jer ne postoji način za njezino oporavljanje.",
      adminUsername: "Korisničko ime administratorskog računa",
      adminPassword: "Lozinka administratorskog računa",
      adminPasswordReq: "Lozinka mora imati najmanje 8 znakova.",
      teamHint:
        "Prema zadanim postavkama, samo vi ćete biti administrator. Nakon završetka postavljanja moći ćete stvarati i pozivati druge korisnike ili administratore. Nemojte izgubiti svoju lozinku jer samo administratori mogu resetirati lozinke.",
    },
    data: {
      title: "Rukovanje podacima i privatnost",
      description:
        "Predani smo transparentnosti i kontroli kada je riječ o vašim osobnim podacima.",
      settingsHint:
        "Ove postavke mogu se ponovno konfigurirati u bilo kojem trenutku u postavkama.",
    },
    survey: {
      title: "Dobrodošli u AnythingLLM",
      description:
        "Pomozite nam da AnythingLLM izgradimo prema vašim potrebama. Neobavezno.",
      email: "Koja je vaša e-mail adresa?",
      useCase: "Za što ćete koristiti AnythingLLM?",
      useCaseWork: "Za posao",
      useCasePersonal: "Za osobnu upotrebu",
      useCaseOther: "Ostalo",
      comment: "Kako ste čuli za AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, itd. - Javite nam kako ste nas pronašli!",
      skip: "Preskoči anketu",
      thankYou: "Hvala vam na povratnim informacijama!",
    },
  },
  common: {
    "workspaces-name": "Naziv radnog prostora",
    selection: "Odabir modela",
    saving: "Spremanje...",
    save: "Spremi promjene",
    previous: "Prethodna stranica",
    next: "Sljedeća stranica",
    optional: "Neobavezno",
    yes: "Da",
    no: "Ne",
    on: "Uključeno",
    none: "Ništa",
    stopped: "Zaustavljeno",
    search: "Pretraži",
    username_requirements:
      "Korisničko ime mora imati 2-64 znaka, započeti malim slovom te sadržavati samo mala slova, brojeve, podvlake, crtice i točke.",
    loading: "Učitavanje",
    refresh: "Osvježi",
  },
  home: {
    welcome: "Dobrodošli",
    chooseWorkspace: "Odaberite radni prostor za početak razgovora!",
    notAssigned:
      "Trenutno niste dodijeljeni nijednom radnom prostoru.\nMolimo kontaktirajte svog administratora za pristup radnom prostoru.",
    goToWorkspace: 'Idi na "{{workspace}}"',
  },
  settings: {
    title: "Postavke instance",
    invites: "Pozivnice",
    users: "Korisnici",
    workspaces: "Radni prostori",
    "workspace-chats": "Razgovori radnog prostora",
    customization: "Prilagodba",
    interface: "Postavke sučelja",
    branding: "Brendiranje i whitelabeling",
    chat: "Razgovor",
    "api-keys": "Razvojni API",
    llm: "LLM",
    transcription: "Transkripcija",
    embedder: "Ugrađivač (embedder)",
    "text-splitting": "Djeljenje teksta i chunking",
    "voice-speech": "Glas i govor",
    "vector-database": "Vektorska baza podataka",
    embeds: "Ugrađeni razgovor",
    security: "Sigurnost",
    "event-logs": "Zapisnici događaja",
    "scheduled-jobs": "Zakazani zadaci",
    privacy: "Privatnost i podaci",
    "ai-providers": "AI pružatelji usluga",
    "agent-skills": "Vještine agenta",
    "model-router": "Usmjerivač modela",
    "community-hub": {
      title: "Community Hub",
      trending: "Istraži popularno",
      "your-account": "Vaš račun",
      "import-item": "Uvezi stavku",
    },
    admin: "Administrator",
    tools: "Alati",
    "system-prompt-variables": "Varijable sistemskog upita",
    "experimental-features": "Eksperimentalne značajke",
    contact: "Kontaktirajte podršku",
    "browser-extension": "Ekstenzija za preglednik",
    "mobile-app": "AnythingLLM mobilna aplikacija",
    channels: "Kanali",
    "available-channels": {
      telegram: "Telegram",
    },
    "image-generation": "Generiranje slika",
  },
  login: {
    "multi-user": {
      welcome: "Dobrodošli",
      "placeholder-username": "Korisničko ime",
      "placeholder-password": "Lozinka",
      login: "Prijava",
      validating: "Provjera...",
      "forgot-pass": "Zaboravljena lozinka",
      reset: "Resetiraj",
    },
    "sign-in":
      "Unesite svoje korisničko ime i lozinku za pristup svojoj {{appName}} instanci.",
    "password-reset": {
      title: "Resetiranje lozinke",
      description:
        "Unesite potrebne podatke ispod za resetiranje svoje lozinke.",
      "recovery-codes": "Kodovi za oporavak",
      "back-to-login": "Povratak na prijavu",
    },
  },
  "main-page": {
    greeting: "Kako vam mogu pomoći danas?",
    quickActions: {
      createAgent: "Stvori agenta",
      editWorkspace: "Uredi radni prostor",
      uploadDocument: "Prenesi dokument",
    },
  },
  "new-workspace": {
    title: "Novi radni prostor",
    placeholder: "Moj radni prostor",
  },
  "workspaces—settings": {
    general: "Opće postavke",
    chat: "Postavke razgovora",
    vector: "Vektorska baza podataka",
    members: "Članovi",
    agent: "Konfiguracija agenta",
  },
  general: {
    vector: {
      title: "Broj vektora",
      description: "Ukupan broj vektora u vašoj vektorskoj bazi podataka.",
    },
    names: {
      description:
        "Ovo će promijeniti samo prikazani naziv vašeg radnog prostora.",
    },
    message: {
      title: "Predložene poruke razgovora",
      description:
        "Prilagodite poruke koje će biti predložene korisnicima vašeg radnog prostora.",
      add: "Dodaj novu poruku",
      save: "Spremi poruke",
      heading: "Objasni mi",
      body: "prednosti AnythingLLM-a",
    },
    delete: {
      title: "Izbriši radni prostor",
      description:
        "Izbrišite ovaj radni prostor i sve njegove podatke. Ovo će izbrisati radni prostor za sve korisnike.",
      delete: "Izbriši radni prostor",
      deleting: "Brisanje radnog prostora...",
      "confirm-start": "Upravo ćete izbrisati cijeli svoj",
      "confirm-end":
        "radni prostor. Ovo će ukloniti sve vektorske ugrađene podatke (embeddings) u vašoj vektorskoj bazi podataka.\n\nIzvorne datoteke ostat će nepromijenjene. Ova radnja je nepovratna.",
    },
  },
  chat: {
    llm: {
      title: "LLM pružatelj usluga za radni prostor",
      description:
        "Specifični LLM pružatelj usluga i model koji će se koristiti za ovaj radni prostor. Prema zadanim postavkama koristi se sistemski LLM pružatelj usluga i postavke.",
      search: "Pretraži sve LLM pružatelje usluga",
    },
    model: {
      title: "Model razgovora radnog prostora",
      description:
        "Specifični model razgovora koji će se koristiti za ovaj radni prostor. Ako je prazno, koristit će se sistemska LLM postavka.",
    },
    mode: {
      title: "Način razgovora",
      automatic: {
        title: "Agent",
        description:
          "automatski će koristiti alate ako model i pružatelj usluga podržavaju izvorno pozivanje alata (native tool calling).<br />Ako izvorno pozivanje alata nije podržano, morat ćete koristiti naredbu @agent za korištenje alata.",
      },
      chat: {
        title: "Razgovor",
        description:
          "pružat će odgovore koristeći opće znanje LLM-a <b>i</b> kontekst pronađenih dokumenata.<br />Morat ćete koristiti naredbu @agent za korištenje alata.",
      },
      query: {
        title: "Upit",
        description:
          "pružat će odgovore <b>samo</b> ako je pronađen kontekst dokumenta.<br />Morat ćete koristiti naredbu @agent za korištenje alata.",
      },
    },
    history: {
      title: "Povijest razgovora",
      "desc-start":
        "Broj prethodnih razgovora koji će biti uključeni u kratkotrajnu memoriju odgovora.",
      recommend: "Preporučeno 20. ",
    },
    prompt: {
      title: "Sistemski upit",
      description:
        "Upit koji će se koristiti u ovom radnom prostoru. Definirajte kontekst i instrukcije za AI kako bi generirao odgovor. Trebali biste unijeti pažljivo osmišljen upit da AI može generirati relevantan i točan odgovor.",
      history: {
        title: "Povijest sistemskog upita",
        clearAll: "Obriši sve",
        noHistory: "Nema dostupne povijesti sistemskog upita",
        restore: "Vrati",
        delete: "Izbriši",
        publish: "Objavi na Community Hub",
        deleteConfirm:
          "Jeste li sigurni da želite izbrisati ovu stavku povijesti?",
        clearAllConfirm:
          "Jeste li sigurni da želite obrisati cijelu povijest? Ova radnja se ne može poništiti.",
        expand: "Proširi",
      },
    },
    refusal: {
      title: "Odgovor odbijanja u načinu upita",
      "desc-start": "Kada ste u",
      query: "upit",
      "desc-end":
        "načinu, možda ćete htjeti vratiti prilagođeni odgovor odbijanja kada nije pronađen kontekst.",
      "tooltip-title": "Zašto vidim ovo?",
      "tooltip-description":
        "Nalazite se u načinu upita, koji koristi samo informacije iz vaših dokumenata. Prebacite se na način razgovora za fleksibilnije razgovore ili kliknite ovdje da posjetite našu dokumentaciju i saznate više o načinima razgovora.",
    },
    temperature: {
      title: "LLM temperatura",
      "desc-end":
        "Što je broj veći, to je odgovor kreativniji. Kod nekih modela ovo može dovesti do nekoherentnih odgovora ako je postavljeno preveliko.",
    },
  },
  "vector-workspace": {
    identifier: "Identifikator vektorske baze podataka",
    snippets: {
      title: "Maksimalan broj isječaka konteksta",
      description:
        "Ova postavka kontrolira maksimalnu količinu isječaka konteksta koji će se slati LLM-u po razgovoru ili upitu.",
      recommend: "Preporučeno: 4",
    },
    doc: {
      title: "Granica sličnosti dokumenta",
      description:
        "Minimalna ocjena sličnosti potrebna da bi se izvor smatrao povezanim s razgovorom. Što je broj veći, izvor mora biti sličniji razgovoru.",
      zero: "Bez ograničenja",
      low: "Niska (ocjena sličnosti ≥ .25)",
      medium: "Srednja (ocjena sličnosti ≥ .50)",
      high: "Visoka (ocjena sličnosti ≥ .75)",
    },
    reset: {
      reset: "Resetiraj vektorsku bazu podataka",
      resetting: "Brisanje vektora...",
      confirm:
        "Upravo ćete resetirati vektorsku bazu podataka ovog radnog prostora. Ovo će ukloniti sve trenutno ugrađene vektorske podatke (embeddings).\n\nIzvorne datoteke ostat će nepromijenjene. Ova radnja je nepovratna.",
      error:
        "Vektorska baza podataka radnog prostora nije mogla biti resetirana!",
      success: "Vektorska baza podataka radnog prostora je resetirana!",
    },
  },
  agent: {
    "performance-warning":
      "Performanse LLM-ova koji ne podržavaju izričito pozivanje alata jako ovise o sposobnostima i točnosti modela. Neke mogućnosti mogu biti ograničene ili neispravne.",
    provider: {
      title: "LLM pružatelj usluga za agenta radnog prostora",
      description:
        "Specifični LLM pružatelj usluga i model koji će se koristiti za @agent agenta ovog radnog prostora.",
    },
    mode: {
      chat: {
        title: "Model razgovora agenta radnog prostora",
        description:
          "Specifični model razgovora koji će se koristiti za @agent agenta ovog radnog prostora.",
      },
      title: "Model agenta radnog prostora",
      description:
        "Specifični LLM model koji će se koristiti za @agent agenta ovog radnog prostora.",
      wait: "-- čekanje na modele --",
    },
    skill: {
      rag: {
        title: "RAG i dugotrajna memorija",
        description:
          'Dopustite agentu da koristi vaše lokalne dokumente za odgovaranje na upit ili zatražite od agenta da "zapamti" dijelove sadržaja za dugotrajno dohvaćanje iz memorije.',
      },
      view: {
        title: "Prikaz i sažimanje dokumenata",
        description:
          "Dopustite agentu da izlista i sažme sadržaj trenutno ugrađenih datoteka radnog prostora.",
      },
      scrape: {
        title: "Scrapanje web stranica",
        description:
          "Dopustite agentu da posjeti i scrapa sadržaj web stranica.",
      },
      generate: {
        title: "Generiranje grafikona",
        description:
          "Omogućite zadanom agentu da generira različite vrste grafikona iz podataka koji su dani ili navedeni u razgovoru.",
      },
      web: {
        title: "Pretraživanje weba",
        description:
          "Omogućite vašem agentu da pretražuje web za odgovaranje na vaša pitanja povezivanjem s pružateljem usluge pretraživanja weba (SERP).",
      },
      sql: {
        title: "SQL konektor",
        description:
          "Omogućite vašem agentu da koristi SQL za odgovaranje na vaša pitanja povezivanjem s raznim pružateljima SQL baza podataka.",
      },
      scheduledJob: {
        title: "Stvaranje zakazanih zadataka",
        description:
          'Dopustite agentu da stvara ponavljajuće zakazane zadatke iz razgovora (npr. "svaki radni dan u 9 sati sažmi mi pristiglu poštu i pošalji mi e-mail"). Dostupno samo u načinu s jednim korisnikom.',
      },
      filesystem: {
        title: "Pristup datotečnom sustavu",
        description:
          "Omogućite vašem agentu da čita, piše, pretražuje i upravlja datotekama unutar određenog direktorija. Podržava uređivanje datoteka, navigaciju direktorijima i pretraživanje sadržaja.",
        learnMore: "Saznajte više o tome kako koristiti ovu vještinu",
        configuration: "Konfiguracija",
        readActions: "Radnje čitanja",
        writeActions: "Radnje pisanja",
        warning:
          "Pristup datotečnom sustavu može biti opasan jer može mijenjati ili brisati datoteke. Molimo pogledajte <a>dokumentaciju</a> prije nego što ga aktivirate.",
        skills: {
          "read-text-file": {
            title: "Čitanje datoteke",
            description: "Čita sadržaj datoteka (tekst, kod, PDF, slike, itd.)",
          },
          "read-multiple-files": {
            title: "Čitanje više datoteka",
            description: "Čita više datoteka istovremeno",
          },
          "list-directory": {
            title: "Popis direktorija",
            description: "Ispisuje datoteke i direktorije u mapi",
          },
          "search-files": {
            title: "Pretraživanje datoteka",
            description: "Pretražuje datoteke po nazivu ili sadržaju",
          },
          "get-file-info": {
            title: "Dohvati informacije o datoteci",
            description: "Dohvaća detaljne metapodatke o datotekama",
          },
          "write-text-file": {
            title: "Pisanje tekstualne datoteke",
            description:
              "Stvara nove tekstualne datoteke ili prepisuje postojeće tekstualne datoteke",
          },
          "edit-file": {
            title: "Uređivanje datoteke",
            description: "Radi izmjene po redovima u tekstualnim datotekama",
          },
          "create-directory": {
            title: "Stvaranje direktorija",
            description: "Stvara nove direktorije",
          },
          "copy-file": {
            title: "Kopiranje datoteke",
            description: "Kopira datoteke i direktorije",
          },
          "move-file": {
            title: "Premještanje/preimenovanje datoteke",
            description: "Premješta ili preimenuje datoteke i direktorije",
          },
        },
      },
      createFiles: {
        title: "Stvaranje dokumenata",
        description:
          "Omogućite vašem agentu da stvara binarne formate dokumenata kao što su PowerPoint prezentacije, Excel proračunske tablice, Word dokumenti i PDF-ovi. Datoteke se mogu preuzeti izravno iz prozora razgovora.",
        configuration: "Dostupne vrste dokumenata",
        skills: {
          "create-text-file": {
            title: "Tekstualne datoteke",
            description:
              "Stvara tekstualne datoteke s bilo kojim sadržajem i ekstenzijom (.txt, .md, .json, .csv, itd.)",
          },
          "create-pptx": {
            title: "PowerPoint prezentacije",
            description:
              "Stvara nove PowerPoint prezentacije sa slajdovima, naslovima i točkama nabrajanja",
          },
          "create-pdf": {
            title: "PDF dokumenti",
            description:
              "Stvara PDF dokumente iz markdowna ili običnog teksta s osnovnim stiliziranjem",
          },
          "create-xlsx": {
            title: "Excel proračunske tablice",
            description:
              "Stvara Excel dokumente za tablične podatke s listovima i stiliziranjem",
          },
          "create-docx": {
            title: "Word dokumenti",
            description:
              "Stvara Word dokumente s osnovnim stiliziranjem i formatiranjem",
          },
        },
      },
      gmail: {
        title: "GMail",
        description:
          "Omogućite vašem agentu da radi s Gmailom - pretražuje e-mailove, čita niti razgovora, sastavlja nacrte, šalje e-mailove i upravlja vašom pristiglom poštom. <a>Pročitajte dokumentaciju</a>.",
        multiUserWarning:
          "Gmail integracija nije dostupna u načinu s više korisnika iz sigurnosnih razloga. Molimo isključite način s više korisnika za korištenje ove značajke.",
        configuration: "Gmail konfiguracija",
        deploymentId: "ID implementacije",
        deploymentIdHelp:
          "ID implementacije iz vaše Google Apps Script web aplikacije",
        apiKey: "API ključ",
        apiKeyHelp:
          "API ključ koji ste konfigurirali u vašoj Google Apps Script implementaciji",
        configurationRequired:
          "Molimo konfigurirajte ID implementacije i API ključ za omogućavanje Gmail vještina.",
        configured: "Konfigurirano",
        searchSkills: "Pretraži vještine...",
        noSkillsFound: "Nema vještina koje odgovaraju vašoj pretrazi.",
        categories: {
          search: {
            title: "Pretraživanje i čitanje e-mailova",
            description:
              "Pretražuje i čita e-mailove iz vaše Gmail pristigle pošte",
          },
          drafts: {
            title: "Nacrti e-mailova",
            description: "Stvara, uređuje i upravlja nacrtima e-mailova",
          },
          send: {
            title: "Slanje i odgovaranje na e-mailove",
            description: "Šalje e-mailove i odmah odgovara na niti razgovora",
          },
          threads: {
            title: "Upravljanje nitima e-mailova",
            description:
              "Upravlja nitima e-mailova - označava kao pročitano/nepročitano, arhivira, briše",
          },
          account: {
            title: "Statistika integracije",
            description:
              "Prikazuje statistiku poštanskog sandučića i informacije o računu",
          },
        },
        skills: {
          getInbox: {
            title: "Dohvati pristiglu poštu",
            description:
              "Pojednostavljen način dohvaćanja e-mailova iz Gmail pristigle pošte",
          },
          search: {
            title: "Pretraživanje e-mailova",
            description: "Pretražuje e-mailove koristeći sintaksu Gmail upita",
          },
          readThread: {
            title: "Čitanje niti razgovora",
            description: "Čita cijelu nit e-mail razgovora po ID-u",
          },
          createDraft: {
            title: "Stvaranje nacrta",
            description: "Stvara novi nacrt e-maila",
          },
          createDraftReply: {
            title: "Stvaranje nacrta odgovora",
            description: "Stvara nacrt odgovora na postojeću nit razgovora",
          },
          updateDraft: {
            title: "Ažuriranje nacrta",
            description: "Ažurira postojeći nacrt e-maila",
          },
          getDraft: {
            title: "Dohvati nacrt",
            description: "Dohvaća određeni nacrt po ID-u",
          },
          listDrafts: {
            title: "Popis nacrta",
            description: "Ispisuje sve nacrte e-mailova",
          },
          deleteDraft: {
            title: "Izbriši nacrt",
            description: "Briše nacrt e-maila",
          },
          sendDraft: {
            title: "Pošalji nacrt",
            description: "Šalje postojeći nacrt e-maila",
          },
          sendEmail: {
            title: "Pošalji e-mail",
            description: "Odmah šalje e-mail",
          },
          replyToThread: {
            title: "Odgovori na nit razgovora",
            description: "Odmah odgovara na nit e-mail razgovora",
          },
          markRead: {
            title: "Označi kao pročitano",
            description: "Označava nit razgovora kao pročitanu",
          },
          markUnread: {
            title: "Označi kao nepročitano",
            description: "Označava nit razgovora kao nepročitanu",
          },
          moveToTrash: {
            title: "Premjesti u smeće",
            description: "Premješta nit razgovora u smeće",
          },
          moveToArchive: {
            title: "Arhiviraj",
            description: "Arhivira nit razgovora",
          },
          moveToInbox: {
            title: "Premjesti u pristiglu poštu",
            description: "Premješta nit razgovora u pristiglu poštu",
          },
          getMailboxStats: {
            title: "Statistika poštanskog sandučića",
            description:
              "Dohvaća broj nepročitanih poruka i statistiku poštanskog sandučića",
          },
        },
      },
      googleCalendar: {
        title: "Google kalendar",
        description:
          "Omogućite vašem agentu da radi s Google kalendarom - pregledava kalendare, dohvaća događaje, stvara i ažurira događaje te upravlja RSVP odgovorima. <a>Pročitajte dokumentaciju</a>.",
        multiUserWarning:
          "Integracija Google kalendara nije dostupna u načinu s više korisnika iz sigurnosnih razloga. Molimo isključite način s više korisnika za korištenje ove značajke.",
        configuration: "Konfiguracija Google kalendara",
        deploymentId: "ID implementacije",
        deploymentIdHelp:
          "ID implementacije iz vaše Google Apps Script web aplikacije",
        apiKey: "API ključ",
        apiKeyHelp:
          "API ključ koji ste konfigurirali u vašoj Google Apps Script implementaciji",
        configurationRequired:
          "Molimo konfigurirajte ID implementacije i API ključ za omogućavanje vještina Google kalendara.",
        configured: "Konfigurirano",
        searchSkills: "Pretraži vještine...",
        noSkillsFound: "Nema vještina koje odgovaraju vašoj pretrazi.",
        categories: {
          calendars: {
            title: "Kalendari",
            description: "Pregledava i upravlja vašim Google kalendarima",
          },
          readEvents: {
            title: "Čitanje događaja",
            description: "Pregledava i pretražuje događaje u kalendaru",
          },
          writeEvents: {
            title: "Stvaranje i ažuriranje događaja",
            description: "Stvara nove događaje i mijenja postojeće",
          },
          rsvp: {
            title: "Upravljanje RSVP odgovorima",
            description: "Upravlja vašim statusom odgovora za događaje",
          },
        },
        skills: {
          listCalendars: {
            title: "Popis kalendara",
            description:
              "Ispisuje sve kalendare koje posjedujete ili na koje ste pretplaćeni",
          },
          getCalendar: {
            title: "Dohvati detalje kalendara",
            description: "Dohvaća detaljne informacije o određenom kalendaru",
          },
          getEvent: {
            title: "Dohvati događaj",
            description: "Dohvaća detaljne informacije o određenom događaju",
          },
          getEventsForDay: {
            title: "Dohvati događaje za dan",
            description: "Dohvaća sve događaje zakazane za određeni dan",
          },
          getEvents: {
            title: "Dohvati događaje (raspon datuma)",
            description: "Dohvaća događaje unutar prilagođenog raspona datuma",
          },
          getUpcomingEvents: {
            title: "Dohvati nadolazeće događaje",
            description:
              "Dohvaća događaje za danas, ovaj tjedan ili ovaj mjesec koristeći jednostavne ključne riječi",
          },
          quickAdd: {
            title: "Brzo dodavanje događaja",
            description:
              "Stvara događaj iz prirodnog jezika (npr. 'sastanak sutra u 15h')",
          },
          createEvent: {
            title: "Stvaranje događaja",
            description:
              "Stvara novi događaj s potpunom kontrolom nad svim svojstvima",
          },
          updateEvent: {
            title: "Ažuriranje događaja",
            description: "Ažurira postojeći događaj u kalendaru",
          },
          setMyStatus: {
            title: "Postavi RSVP status",
            description: "Prihvaća, odbija ili privremeno prihvaća događaj",
          },
        },
      },
      outlook: {
        title: "Outlook",
        description:
          "Omogućite vašem agentu da radi s Microsoft Outlookom - pretražuje e-mailove, čita niti razgovora, sastavlja nacrte, šalje e-mailove i upravlja vašom pristiglom poštom putem Microsoft Graph API-ja. <a>Pročitajte dokumentaciju</a>.",
        multiUserWarning:
          "Outlook integracija nije dostupna u načinu s više korisnika iz sigurnosnih razloga. Molimo isključite način s više korisnika za korištenje ove značajke.",
        configuration: "Outlook konfiguracija",
        authType: "Vrsta računa",
        authTypeHelp:
          "Odaberite koje vrste Microsoft računa se mogu autentificirati. 'Svi računi' podržava i osobne i poslovne/školske račune. 'Samo osobni' ograničava na osobne Microsoft račune. 'Samo organizacija' ograničava na poslovne/školske račune iz određenog Azure AD najmoprimca (tenant).",
        authTypeCommon: "Svi računi (osobni i poslovni/školski)",
        authTypeConsumers: "Samo osobni Microsoft računi",
        authTypeOrganization: "Samo računi organizacije (potreban Tenant ID)",
        clientId: "ID aplikacije (klijenta)",
        clientIdHelp:
          "ID aplikacije (klijenta) iz vaše registracije Azure AD aplikacije",
        tenantId: "ID direktorija (najmoprimca)",
        tenantIdHelp:
          "ID direktorija (najmoprimca) iz vaše registracije Azure AD aplikacije. Potrebno samo za autentikaciju koja se ograničava samo na organizaciju.",
        clientSecret: "Klijentska tajna (client secret)",
        clientSecretHelp:
          "Vrijednost klijentske tajne iz vaše registracije Azure AD aplikacije",
        configurationRequired:
          "Molimo konfigurirajte ID klijenta i klijentsku tajnu za omogućavanje Outlook vještina.",
        authRequired:
          "Prvo spremite svoje vjerodajnice, zatim se autentificirajte s Microsoftom za dovršetak postavljanja.",
        authenticateWithMicrosoft: "Autentificiraj se s Microsoftom",
        authenticated: "Uspješno ste se autentificirali s Microsoft Outlookom.",
        revokeAccess: "Opozovi pristup",
        configured: "Konfigurirano",
        searchSkills: "Pretraži vještine...",
        noSkillsFound: "Nema vještina koje odgovaraju vašoj pretrazi.",
        categories: {
          search: {
            title: "Pretraživanje i čitanje e-mailova",
            description:
              "Pretražuje i čita e-mailove iz vaše Outlook pristigle pošte",
          },
          drafts: {
            title: "Nacrti e-mailova",
            description: "Stvara, uređuje i upravlja nacrtima e-mailova",
          },
          send: {
            title: "Slanje e-mailova",
            description: "Odmah šalje nove e-mailove ili odgovara na poruke",
          },
          account: {
            title: "Statistika integracije",
            description:
              "Prikazuje statistiku poštanskog sandučića i informacije o računu",
          },
        },
        skills: {
          getInbox: {
            title: "Dohvati pristiglu poštu",
            description:
              "Dohvaća nedavne e-mailove iz vaše Outlook pristigle pošte",
          },
          search: {
            title: "Pretraživanje e-mailova",
            description:
              "Pretražuje e-mailove koristeći sintaksu Microsoft pretraživanja",
          },
          readThread: {
            title: "Čitanje razgovora",
            description: "Čita cijelu nit e-mail razgovora",
          },
          createDraft: {
            title: "Stvaranje nacrta",
            description:
              "Stvara novi nacrt e-maila ili nacrt odgovora na postojeću poruku",
          },
          updateDraft: {
            title: "Ažuriranje nacrta",
            description: "Ažurira postojeći nacrt e-maila",
          },
          listDrafts: {
            title: "Popis nacrta",
            description: "Ispisuje sve nacrte e-mailova",
          },
          deleteDraft: {
            title: "Izbriši nacrt",
            description: "Briše nacrt e-maila",
          },
          sendDraft: {
            title: "Pošalji nacrt",
            description: "Šalje postojeći nacrt e-maila",
          },
          sendEmail: {
            title: "Pošalji e-mail",
            description:
              "Odmah šalje novi e-mail ili odgovara na postojeću poruku",
          },
          getMailboxStats: {
            title: "Statistika poštanskog sandučića",
            description: "Dohvaća broj mapa i statistiku poštanskog sandučića",
          },
        },
      },
      default_skill:
        "Prema zadanim postavkama ova vještina je omogućena, ali je možete isključiti ako ne želite da bude dostupna agentu.",
    },
    mcp: {
      title: "MCP poslužitelji",
      "loading-from-config":
        "Učitavanje MCP poslužitelja iz konfiguracijske datoteke",
      "learn-more": "Saznajte više o MCP poslužiteljima.",
      "no-servers-found": "Nema pronađenih MCP poslužitelja",
      "tool-warning":
        "Za najbolje performanse, razmislite o isključivanju nepotrebnih alata radi uštede konteksta.",
      "tools-enabled": "alata omogućeno",
      "stop-server": "Zaustavi MCP poslužitelj",
      "start-server": "Pokreni MCP poslužitelj",
      "delete-server": "Izbriši MCP poslužitelj",
      "tool-count-warning":
        "Ovaj MCP poslužitelj ima <b>{{count}} omogućenih alata</b> koji će trošiti kontekst u svakom razgovoru.<br />Razmislite o isključivanju nepotrebnih alata radi uštede konteksta.",
      "startup-command": "Naredba pri pokretanju",
      command: "Naredba",
      arguments: "Argumenti",
      "not-running-warning":
        "Ovaj MCP poslužitelj ne radi - možda je zaustavljen ili ima grešku prilikom pokretanja.",
      "tool-call-arguments": "Argumenti poziva alata",
    },
    settings: {
      title: "Postavke vještina agenta",
      "max-tool-calls": {
        title: "Maksimalan broj poziva alata po odgovoru",
        description:
          "Maksimalan broj alata koje agent može lančano povezati za generiranje jednog odgovora. Ovo sprječava nekontrolirane pozive alata i beskonačne petlje.",
      },
      "intelligent-skill-selection": {
        title: "Inteligentan odabir vještina",
        description:
          "Omogućite neograničen broj alata i smanjite potrošnju tokena do 80% po upitu — AnythingLLM automatski odabire prave vještine za svaki upit.",
        "max-tools": {
          title: "Maksimalan broj alata",
          description:
            "Maksimalan broj alata koji se odabire za svaki upit. Preporučujemo postavljanje veće vrijednosti za modele s većim kontekstom.",
        },
      },
      "clarifying-questions": {
        title: "Dopusti agentu postavljanje pitanja za razjašnjenje",
        "beta-badge": "BETA",
        description:
          "Kada je omogućeno, agenti mogu zastati i postaviti kratka pitanja za razjašnjenje ako je vaš upit dvosmislen.",
        "max-per-turn": {
          title: "Maks. broj pitanja po potezu",
          description:
            "Koliko pitanja za razjašnjenje agent može postaviti u jednoj anketi.",
        },
      },
    },
  },
  recorded: {
    title: "Razgovori radnog prostora",
    description:
      "Ovo su svi snimljeni razgovori i poruke koje su korisnici poslali, poredani prema datumu stvaranja.",
    export: "Izvoz",
    table: {
      id: "ID",
      by: "Poslao",
      workspace: "Radni prostor",
      prompt: "Upit",
      response: "Odgovor",
      at: "Poslano u",
    },
  },
  customization: {
    interface: {
      title: "Postavke sučelja",
      description: "Postavite svoje postavke sučelja za AnythingLLM.",
    },
    branding: {
      title: "Brendiranje i whitelabeling",
      description:
        "Bijeli žig (white-label) vaše AnythingLLM instance s prilagođenim brendiranjem.",
    },
    chat: {
      title: "Razgovor",
      description: "Postavite svoje postavke razgovora za AnythingLLM.",
      auto_submit: {
        title: "Automatsko slanje glasovnog unosa",
        description: "Automatski pošalji glasovni unos nakon razdoblja tišine",
      },
      auto_speak: {
        title: "Automatsko izgovaranje odgovora",
        description: "Automatski izgovori odgovore od AI-a",
      },
      spellcheck: {
        title: "Omogući provjeru pravopisa",
        description:
          "Omogući ili isključi provjeru pravopisa u polju za unos razgovora",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Odaberite preferiranu temu boja za aplikaciju.",
      },
      "show-scrollbar": {
        title: "Prikaži traku za pomicanje",
        description:
          "Omogući ili isključi traku za pomicanje u prozoru razgovora.",
      },
      "support-email": {
        title: "E-mail podrške",
        description:
          "Postavite e-mail adresu podrške koja bi trebala biti dostupna korisnicima kada im je potrebna pomoć.",
      },
      "app-name": {
        title: "Naziv",
        description:
          "Postavite naziv koji se prikazuje na stranici za prijavu svim korisnicima.",
      },
      "display-language": {
        title: "Jezik prikaza",
        description:
          "Odaberite preferirani jezik za prikaz AnythingLLM sučelja - kada su prijevodi dostupni.",
      },
      logo: {
        title: "Logotip branda",
        description:
          "Prenesite svoj prilagođeni logotip za prikaz na svim stranicama.",
        add: "Dodaj prilagođeni logotip",
        recommended: "Preporučena veličina: 800 x 200",
        remove: "Ukloni",
        replace: "Zamijeni",
      },
      "browser-appearance": {
        title: "Izgled preglednika",
        description:
          "Prilagodite izgled kartice preglednika i naslova kada je aplikacija otvorena.",
        tab: {
          title: "Naslov",
          description:
            "Postavite prilagođeni naslov kartice kada je aplikacija otvorena u pregledniku.",
        },
        favicon: {
          title: "Favicon",
          description: "Koristi prilagođeni favicon za karticu preglednika.",
        },
      },
      "sidebar-footer": {
        title: "Stavke podnožja bočne trake",
        description:
          "Prilagodite stavke podnožja koje se prikazuju na dnu bočne trake.",
        icon: "Ikona",
        link: "Poveznica",
      },
      "render-html": {
        title: "Prikaži HTML u razgovoru",
        description:
          "Prikazuje HTML odgovore u odgovorima asistenta.\nOvo može rezultirati znatno višom kvalitetom prikaza odgovora, ali može dovesti i do potencijalnih sigurnosnih rizika.",
      },
      "disable-auto-scroll": {
        title: "Isključi automatsko pomicanje",
        description:
          "Isključi automatsko pomicanje na dno razgovora kada stignu nove poruke.",
      },
    },
  },
  api: {
    title: "API ključevi",
    description:
      "API ključevi omogućuju vlasniku programski pristup i upravljanje ovom AnythingLLM instancom.",
    link: "Pročitajte API dokumentaciju",
    generate: "Generiraj novi API ključ",
    empty: "Nema pronađenih API ključeva",
    actions: "Radnje",
    messages: {
      error: "Pogreška: {{error}}",
    },
    modal: {
      title: "Stvori novi API ključ",
      cancel: "Odustani",
      close: "Zatvori",
      create: "Stvori API ključ",
      helper:
        "Nakon stvaranja, API ključ se može koristiti za programski pristup i konfiguraciju ove AnythingLLM instance.",
      name: {
        label: "Naziv",
        placeholder: "Produkcijska integracija",
        helper:
          "Neobavezno. Koristite prijateljski naziv da biste kasnije lakše identificirali ovaj ključ.",
      },
    },
    row: {
      copy: "Kopiraj API ključ",
      copied: "Kopirano",
      unnamed: "--",
      deleteConfirm:
        "Jeste li sigurni da želite deaktivirati ovaj API ključ?\nNakon toga, ključ se više neće moći koristiti.\n\nOva radnja je nepovratna.",
    },
    table: {
      name: "Naziv",
      key: "API ključ",
      by: "Stvorio",
      created: "Stvoreno",
    },
  },
  llm: {
    title: "LLM postavka",
    description:
      "Ovo su vjerodajnice i postavke za vašeg preferiranog LLM pružatelja usluga razgovora i ugrađivanja (embedding). Važno je da su ovi ključevi ažurni i točni, jer inače AnythingLLM neće funkcionirati ispravno.",
    provider: "LLM pružatelj usluga",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure krajnja točka usluge (endpoint)",
        api_key: "API ključ",
        chat_deployment_name: "Naziv implementacije razgovora",
        chat_model_token_limit: "Ograničenje tokena modela razgovora",
        model_type: "Vrsta modela",
        model_type_tooltip:
          "Ako vaša implementacija koristi model za rezoniranje (o1, o1-mini, o3-mini, itd.), postavite ovo na „Rezoniranje“. Inače vaši zahtjevi razgovora mogu ne uspjeti.",
        default: "Zadano",
        reasoning: "Rezoniranje",
      },
    },
  },
  "model-router": {
    title: "Usmjerivači modela",
    description:
      "Usmjerivači modela omogućuju definiranje pravila za automatsko usmjeravanje poruka razgovora prema različitim LLM pružateljima usluga i modelima na temelju uvjeta.",
    table: {
      name: "Naziv",
      fallback: "Zamjensko rješenje (fallback)",
      rules: "Pravila",
      workspaces: "Radni prostori",
    },
    "no-routers": "Još nema usmjerivača modela",
    "empty-description":
      "Još nisu konfigurirani usmjerivači modela. Stvorite jedan za početak.",
    "new-router-button": "Novi usmjerivač",
    "delete-confirm":
      'Jeste li sigurni da želite izbrisati usmjerivač "{{name}}"?\nOvo će ukloniti sva njegova pravila i odspojiti sve radne prostore koji ga koriste.\n\nOva radnja je nepovratna.',
    "toast-deleted": "Usmjerivač izbrisan",
    "toast-delete-failed": "Brisanje usmjerivača nije uspjelo: {{error}}",
    "new-router": {
      title: "Stvori novi usmjerivač modela",
      name: "Naziv",
      "name-placeholder": "npr. Optimizator troškova",
      description: "Opis",
      "description-placeholder": "Neobavezan opis",
      "fallback-label": "Primarni pružatelj usluga i model",
      "fallback-description":
        "Koristi se kada nijedno pravilo usmjeravanja ne odgovara. Također se koristi za procjenu pravila klasificiranih putem LLM-a.",
      "cooldown-label": "Vrijeme čekanja predmemorije (sekunde)",
      "cooldown-help":
        "Koliko dugo se odluka o usmjeravanju čuva u predmemoriji prije ponovne procjene pravila. Postavite na 0 za isključivanje predmemorije.",
      "name-required": "Naziv je obavezan.",
      "fallback-required": "Primarni pružatelj usluga i model su obavezni.",
      cancel: "Odustani",
      create: "Stvori usmjerivač",
    },
    "edit-router": {
      "back-to-routers": "Povratak na usmjerivače modela",
      title: "Uredi usmjerivač: {{name}}",
      save: "Spremi promjene",
      "toast-update-failed": "Ažuriranje usmjerivača nije uspjelo",
    },
    rules: {
      title: "Pravila usmjeravanja",
      "title-with-name": "Pravila usmjerivača: {{name}}",
      description:
        "Definirajte pravila koja određuju kada i kako se poruke razgovora usmjeravaju prema određenim pružateljima usluga i modelima.",
      "add-rule": "Dodaj pravilo",
      "delete-confirm": 'Izbrisati pravilo "{{title}}"?',
      "toast-delete-failed": "Brisanje pravila nije uspjelo",
      "toast-reorder-failed": "Promjena redoslijeda pravila nije uspjela",
      "no-rules": "Još nema pravila",
      "empty-description":
        "Dodajte pravilo za početak usmjeravanja poruka razgovora prema određenim pružateljima usluga i modelima.",
      "new-rule-button": "Novo pravilo",
      "calculated-section-label":
        "Izračunata pravila — procjenjuju se prva, po prioritetu",
      "llm-section-label":
        "LLM pravila — procjenjuju se zajedno ako nijedno izračunato pravilo ne odgovara",
      "llm-rule-body":
        'Poklapanje <desc>"{{description}}"</desc> zatim usmjeri na <route>{{route}}</route>',
      "calculated-no-conditions":
        "Nema uvjeta — usmjeri na <route>{{route}}</route>",
      "calculated-single-condition":
        'Ako <prop>{{property}}</prop> {{comparator}} <val>"{{value}}"</val> zatim usmjeri na <route>{{route}}</route>',
      "calculated-multi-condition":
        "Ako {{quantifier}} od <cond>{{conditions}}</cond> zatim usmjeri na <route>{{route}}</route>",
      "comparator-contains": "sadrži",
      "comparator-matches": "odgovara",
      "comparator-between": "između",
      "badge-llm": "LLM",
      "badge-calculated": "Izračunato",
      "aria-drag-to-reorder": "Povuci za promjenu redoslijeda",
      "aria-edit-rule": "Uredi pravilo",
      "aria-delete-rule": "Izbriši pravilo",
      "quantifier-any": "BILO KOJI",
      "quantifier-all": "SVI",
    },
    "rule-form": {
      "title-label": "Naslov",
      "rule-type": "Vrsta pravila",
      "property-label": "Svojstvo",
      "property-select": "Odaberi",
      "comparator-label": "Usporedni operator",
      "comparator-select": "Odaberi",
      "value-label": "Vrijednost",
      "add-condition": "Dodaj uvjet",
      "remove-condition": "Ukloni uvjet",
      "conditions-incomplete":
        "Uvjet {{index}} je nepotpun — popunite svojstvo, usporedni operator i vrijednost.",
      "match-description-label": "Opis poklapanja",
      "match-description-placeholder":
        "npr. Korisnik pita o pravnim temama, ugovorima ili usklađenosti",
      "match-description-help":
        "Opišite situaciju u kojoj želite da se ovo pravilo primijeni. Ovo procjenjuje vaš LLM da odredi treba li se koristiti.",
      "route-to-label": "Usmjeri na pružatelja usluga i model",
      "route-to-description":
        "Kada se ovo pravilo poklapa, koristi ovog pružatelja usluga/model",
      cancel: "Odustani",
      saving: "Spremanje...",
      "update-rule": "Ažuriraj pravilo",
      "create-rule": "Stvori pravilo",
      "title-required": "Naslov je obavezan",
      "toast-save-failed": "Spremanje pravila nije uspjelo",
      "type-calculated-label": "Izračunato",
      "type-calculated-description":
        "Poklapanje na temelju svojstava poruke kao sadržaj, broj tokena ili doba dana.",
      "type-llm-label": "Klasificirano putem LLM-a",
      "type-llm-description":
        "Koristi LLM za klasifikaciju poruke na temelju opisa koji navedete.",
      "prop-prompt-content": "Sadržaj upita",
      "prop-token-count": "Broj tokena u razgovoru",
      "prop-message-count": "Broj poruka u razgovoru",
      "prop-current-hour": "Trenutni sat (0-23)",
      "prop-has-image": "Ima privitak slike",
      "cmp-contains": "sadrži",
      "cmp-matches-regex": "odgovara (regex)",
      "cmp-equals": "jednako",
      "cmp-not-equals": "nije jednako",
      "cmp-greater-than": "veće od",
      "cmp-greater-than-or-equal": "veće ili jednako",
      "cmp-less-than": "manje od",
      "cmp-less-than-or-equal": "manje ili jednako",
      "cmp-between": "između (uključivo)",
      "placeholder-between-hour": "npr. 9,17 (9h do 17h)",
      "placeholder-between-numeric": "npr. 10,50",
      "placeholder-hour": "npr. 18 (0-23)",
      "placeholder-message-count": "npr. 10",
      "placeholder-numeric": "npr. 4000",
      "placeholder-contains": "npr. kod, python, rust",
      "placeholder-matches": "npr. /\\bpython\\b/i",
      "placeholder-default": "npr. kod",
      "help-contains":
        "Popis vrijednosti odvojenih zarezom — poklapa se ako upit sadrži bilo koju od vrijednosti (bez razlike u velikim/malim slovima).",
      "help-matches":
        "Regex uzorak. Koristite /uzorak/oznake za osjetljivost na velika/mala slova (zadano je neosjetljivo).",
      "bool-true": "Istina",
      "bool-false": "Neistina",
    },
    "provider-picker": {
      "select-provider": "Odaberi pružatelja usluga",
      "setup-required": "(potrebno postavljanje)",
      "loading-models": "Učitavanje modela...",
      "select-model": "Odaberi model",
      "enter-model": "Unesi naziv modela",
      "select-provider-first": "Prvo odaberite pružatelja usluga",
      "configure-to-continue": "Konfigurirajte {{name}} za nastavak",
      "configure-provider": "Konfiguriraj {{name}}",
      "setup-credentials":
        "Unesite potrebne vjerodajnice za korištenje {{name}} kao cilja usmjeravanja.",
      cancel: "Odustani",
      "save-settings": "Spremi postavke",
      "toast-save-failed": "Spremanje postavki nije uspjelo: {{error}}",
    },
    "router-selection": {
      "loading-routers": "Učitavanje prilagođenih usmjerivača...",
      "no-routers-prefix-settings":
        "Još nisu konfigurirani usmjerivači modela.",
      "no-routers-prefix-workspace": "Nema konfiguriranih usmjerivača modela.",
      "no-routers-link": "Stvorite jedan u postavkama usmjerivača modela",
      "model-router-label": "Usmjerivač modela",
      "select-router": "Odaberi usmjerivač",
      "select-description":
        "Odaberite koji usmjerivač koristiti za ovaj radni prostor.",
      "no-routers-chat":
        "Nema konfiguriranih usmjerivača. Stvorite jedan u Postavke > AI pružatelji usluga > Usmjerivač modela.",
      "rule-count": "({{count}} pravila)",
    },
    metrics: {
      "model-router-default": "Usmjerivač modela",
    },
    chat: {
      "select-router-error": "Odaberi usmjerivač",
      "invalid-model": "Nevažeći odabir modela",
      "routed-to": "Usmjereno na <route>{{model}}</route>",
      "routed-to-rule":
        "Usmjereno na <route>{{model}}</route> putem <rule>{{ruleTitle}}</rule>",
    },
  },
  transcription: {
    title: "Postavka modela transkripcije",
    description:
      "Ovo su vjerodajnice i postavke za vašeg preferiranog pružatelja usluga modela transkripcije. Važno je da su ovi ključevi ažurni i točni, jer se u protivnom medijske datoteke i audio zapisi neće transkribirati.",
    provider: "Pružatelj usluga transkripcije",
    "warn-start":
      "Korištenje lokalnog whisper modela na uređajima s ograničenom RAM memorijom ili procesorom može zaustaviti AnythingLLM prilikom obrade medijskih datoteka.",
    "warn-recommend":
      "Preporučujemo najmanje 2 GB RAM-a i datoteke za prijenos manje od 10 MB.",
    "warn-end":
      "Ugrađeni model će se automatski preuzeti prilikom prve upotrebe.",
  },
  embedding: {
    title: "Postavka ugrađivanja (embedding)",
    "desc-start":
      "Kada koristite LLM koji izvorno ne podržava mehanizam za ugrađivanje (embedding) - možda ćete morati dodatno navesti vjerodajnice za ugrađivanje teksta.",
    "desc-end":
      "Ugrađivanje (embedding) je proces pretvaranja teksta u vektore. Ove vjerodajnice su potrebne za pretvaranje vaših datoteka i upita u format koji AnythingLLM može koristiti za obradu.",
    provider: {
      title: "Pružatelj usluga ugrađivanja",
    },
  },
  text: {
    title: "Postavke djeljenja teksta i chunkinga",
    "desc-start":
      "Ponekad ćete htjeti promijeniti zadani način na koji se novi dokumenti djele i chunkiraju prije umetanja u vašu vektorsku bazu podataka.",
    "desc-end":
      "Ovu postavku trebate mijenjati samo ako razumijete kako djeljenje teksta funkcionira i koje su njegove nuspojave.",
    size: {
      title: "Veličina chunka teksta",
      description:
        "Ovo je maksimalna duljina znakova koji mogu biti prisutni u jednom vektoru.",
      recommend: "Maksimalna duljina modela za ugrađivanje je",
    },
    overlap: {
      title: "Preklapanje chunka teksta",
      description:
        "Ovo je maksimalno preklapanje znakova koje se javlja tijekom chunkinga između dva susjedna chunka teksta.",
    },
  },
  vector: {
    title: "Vektorska baza podataka",
    description:
      "Ovo su vjerodajnice i postavke za funkcioniranje vaše AnythingLLM instance. Važno je da su ovi ključevi ažurni i točni.",
    provider: {
      title: "Pružatelj usluga vektorske baze podataka",
      description: "Za LanceDB nije potrebna nikakva konfiguracija.",
    },
  },
  embeddable: {
    title: "Ugradivi widgeti razgovora",
    description:
      "Ugradivi widgeti razgovora su javna sučelja razgovora koja su vezana za jedan radni prostor. Ovi vam omogućuju izgradnju radnih prostora koje zatim možete objaviti svima.",
    create: "Stvori ugradbu",
    table: {
      workspace: "Radni prostor",
      chats: "Poslani razgovori",
      active: "Aktivne domene",
      created: "Stvoreno",
    },
  },
  "embed-chats": {
    title: "Povijest ugrađenih razgovora",
    export: "Izvoz",
    description:
      "Ovo su svi snimljeni razgovori i poruke iz svake ugradbe koju ste objavili.",
    table: {
      embed: "Ugradba",
      sender: "Pošiljatelj",
      message: "Poruka",
      response: "Odgovor",
      at: "Poslano u",
    },
  },
  telegram: {
    title: "Telegram bot",
    description:
      "Povežite svoju AnythingLLM instancu s Telegramom da biste mogli razgovarati sa svojim radnim prostorima s bilo kojeg uređaja.",
    setup: {
      step1: {
        title: "Korak 1: Stvorite svoj Telegram bot",
        description:
          "Otvorite @BotFather u Telegramu, pošaljite <code>/newbot</code> na <code>@BotFather</code>, slijedite upute i kopirajte API token.",
        "open-botfather": "Otvori BotFather",
        "instruction-1": "1. Otvorite poveznicu ili skenirajte QR kod",
        "instruction-2":
          "2. Pošaljite <code>/newbot</code> na <code>@BotFather</code>",
        "instruction-3": "3. Odaberite naziv i korisničko ime za svoj bot",
        "instruction-4": "4. Kopirajte API token koji ste primili",
      },
      step2: {
        title: "Korak 2: Povežite svoj bot",
        description:
          "Zalijepite API token koji ste primili od @BotFather za povezivanje vašeg bota.",
        "bot-token": "Token bota",
        connecting: "Povezivanje...",
        "connect-bot": "Poveži bot",
      },
      security: {
        title: "Preporučene sigurnosne postavke",
        description:
          "Za dodatnu sigurnost, konfigurirajte ove postavke u @BotFather.",
        "disable-groups": "— Spriječi dodavanje bota u grupe",
        "disable-inline": "— Spriječi korištenje bota u inline pretraživanju",
        "obscure-username":
          "Koristite manje uočljivo korisničko ime bota za smanjenje mogućnosti pronalaska",
      },
      "toast-enter-token": "Molimo unesite token bota.",
      "toast-connect-failed": "Povezivanje bota nije uspjelo.",
    },
    connected: {
      status: "Povezano",
      "status-disconnected":
        "Odspojeno — token je možda istekao ili je nevažeći",
      "placeholder-token": "Zalijepite novi token bota...",
      reconnect: "Ponovno poveži",
      workspace: "Radni prostor",
      "bot-link": "Poveznica bota",
      "voice-response": "Glasovni odgovor",
      disconnecting: "Odspajanje...",
      disconnect: "Odspoji",
      "voice-text-only": "Samo tekst",
      "voice-mirror":
        "Zrcali (odgovori glasom kada korisnik pošalje glasovnu poruku)",
      "voice-always": "Uvijek glas (šalje audio uz svaki odgovor)",
      "toast-disconnect-failed": "Odspajanje bota nije uspjelo.",
      "toast-reconnect-failed": "Ponovno povezivanje bota nije uspjelo.",
      "toast-voice-failed": "Ažuriranje glasovnog načina nije uspjelo.",
      "toast-approve-failed": "Prihvaćanje korisnika nije uspjelo.",
      "toast-deny-failed": "Odbijanje korisnika nije uspjelo.",
      "toast-revoke-failed": "Opozivanje korisnika nije uspjelo.",
    },
    users: {
      "pending-description":
        "Korisnici koji čekaju na verifikaciju. Uskladite kod za povezivanje prikazan ovdje s onim prikazanim u njihovom Telegram razgovoru.",
      unknown: "Nepoznato",
    },
  },
  security: {
    title: "Sigurnost",
    multiuser: {
      title: "Način s više korisnika",
      description:
        "Postavite svoju instancu za podršku vašem timu aktiviranjem načina s više korisnika.",
      enable: {
        "is-enable": "Način s više korisnika je omogućen",
        enable: "Omogući način s više korisnika",
        description:
          "Prema zadanim postavkama, samo vi ćete biti administrator. Kao administrator morat ćete stvarati račune za sve nove korisnike ili administratore. Nemojte izgubiti svoju lozinku jer samo administrator može resetirati lozinke.",
        username: "Korisničko ime administratorskog računa",
        password: "Lozinka administratorskog računa",
      },
    },
    password: {
      title: "Zaštita lozinkom",
      description:
        "Zaštitite svoju AnythingLLM instancu lozinkom. Ako je zaboravite, ne postoji način oporavka, tako da svakako spremite ovu lozinku.",
      "password-label": "Lozinka instance",
    },
  },
  event: {
    title: "Zapisnici događaja",
    description:
      "Pregledajte sve radnje i događaje koji se odvijaju na ovoj instanci za potrebe praćenja.",
    clear: "Obriši zapisnike događaja",
    table: {
      type: "Vrsta događaja",
      user: "Korisnik",
      occurred: "Dogodilo se u",
    },
  },
  privacy: {
    title: "Privatnost i rukovanje podacima",
    description:
      "Ovo je vaša konfiguracija za način na koji povezani pružatelji usluga trećih strana i AnythingLLM rukuju vašim podacima.",
    anonymous: "Anonimna telemetrija omogućena",
  },
  connectors: {
    "search-placeholder": "Pretraži konektore podataka",
    "no-connectors": "Nema pronađenih konektora podataka.",
    obsidian: {
      vault_location: "Lokacija trezora",
      vault_description:
        "Odaberite mapu svog Obsidian trezora za uvoz svih bilješki i njihovih veza.",
      selected_files: "Pronađeno {{count}} markdown datoteka",
      importing: "Uvoz trezora...",
      import_vault: "Uvezi trezor",
      processing_time: "Ovo može potrajati ovisno o veličini vašeg trezora.",
      vault_warning:
        "Da biste izbjegli sukobe, provjerite da vaš Obsidian trezor trenutno nije otvoren.",
    },
    github: {
      name: "GitHub repozitorij",
      description:
        "Uvezite cijeli javni ili privatni GitHub repozitorij jednim klikom.",
      URL: "URL GitHub repozitorija",
      URL_explained: "URL GitHub repozitorija koji želite prikupiti.",
      token: "GitHub pristupni token",
      optional: "neobavezno",
      token_explained: "Pristupni token za sprječavanje ograničenja brzine.",
      token_explained_start: "Bez ",
      token_explained_link1: "osobnog pristupnog tokena",
      token_explained_middle:
        ", GitHub API može ograničiti broj datoteka koje se mogu prikupiti zbog ograničenja brzine. Možete ",
      token_explained_link2: "stvoriti privremeni pristupni token",
      token_explained_end: " da biste izbjegli ovaj problem.",
      ignores: "Zaobiđene datoteke",
      git_ignore:
        "Navedite u .gitignore formatu koje datoteke zaobići prilikom prikupljanja. Pritisnite enter nakon svakog unosa koji želite spremiti.",
      task_explained:
        "Nakon dovršetka, sve datoteke bit će dostupne za ugrađivanje u radne prostore u alatu za odabir dokumenata.",
      branch: "Grana s koje želite prikupiti datoteke.",
      branch_loading: "-- učitavanje dostupnih grana --",
      branch_explained: "Grana s koje želite prikupiti datoteke.",
      token_information:
        "Bez popunjavanja <b>GitHub pristupnog tokena</b>, ovaj konektor podataka moći će prikupiti samo datoteke na <b>najvišoj razini</b> repozitorija zbog ograničenja brzine javnog GitHub API-ja.",
      token_personal:
        "Dobijte besplatni osobni pristupni token s GitHub računom ovdje.",
    },
    gitlab: {
      name: "GitLab repozitorij",
      description:
        "Uvezite cijeli javni ili privatni GitLab repozitorij jednim klikom.",
      URL: "URL GitLab repozitorija",
      URL_explained: "URL GitLab repozitorija koji želite prikupiti.",
      token: "GitLab pristupni token",
      optional: "neobavezno",
      token_description:
        "Odaberite dodatne entitete za dohvaćanje iz GitLab API-ja.",
      token_explained_start: "Bez ",
      token_explained_link1: "osobnog pristupnog tokena",
      token_explained_middle:
        ", GitLab API može ograničiti broj datoteka koje se mogu prikupiti zbog ograničenja brzine. Možete ",
      token_explained_link2: "stvoriti privremeni pristupni token",
      token_explained_end: " da biste izbjegli ovaj problem.",
      fetch_issues: "Dohvati probleme (issues) kao dokumente",
      ignores: "Zaobiđene datoteke",
      git_ignore:
        "Navedite u .gitignore formatu koje datoteke zaobići prilikom prikupljanja. Pritisnite enter nakon svakog unosa koji želite spremiti.",
      task_explained:
        "Nakon dovršetka, sve datoteke bit će dostupne za ugrađivanje u radne prostore u alatu za odabir dokumenata.",
      branch: "Grana s koje želite prikupiti datoteke",
      branch_loading: "-- učitavanje dostupnih grana --",
      branch_explained: "Grana s koje želite prikupiti datoteke.",
      token_information:
        "Bez popunjavanja <b>GitLab pristupnog tokena</b>, ovaj konektor podataka moći će prikupiti samo datoteke na <b>najvišoj razini</b> repozitorija zbog ograničenja brzine javnog GitLab API-ja.",
      token_personal:
        "Dobijte besplatni osobni pristupni token s GitLab računom ovdje.",
    },
    youtube: {
      name: "YouTube transkript",
      description: "Uvezite transkript cijelog YouTube videa putem poveznice.",
      URL: "URL YouTube videa",
      URL_explained_start:
        "Unesite URL bilo kojeg YouTube videa za dohvaćanje njegovog transkripta. Video mora imati ",
      URL_explained_link: "titlove",
      URL_explained_end: " dostupne.",
      task_explained:
        "Nakon dovršetka, transkript će biti dostupan za ugrađivanje u radne prostore u alatu za odabir dokumenata.",
    },
    "website-depth": {
      name: "Skupno scrapanje poveznica",
      description:
        "Scrapajte web stranicu i njezine podpoveznice do određene dubine.",
      URL: "URL web stranice",
      URL_explained: "URL web stranice koju želite scrapati.",
      depth: "Dubina pretraživanja",
      depth_explained:
        "Ovo je broj podređenih poveznica koje bi worker trebao slijediti od izvorišnog URL-a.",
      max_pages: "Maksimalan broj stranica",
      max_pages_explained: "Maksimalan broj poveznica za scrapanje.",
      task_explained:
        "Nakon dovršetka, sav scrapani sadržaj bit će dostupan za ugrađivanje u radne prostore u alatu za odabir dokumenata.",
    },
    confluence: {
      name: "Confluence",
      description: "Uvezite cijelu Confluence stranicu jednim klikom.",
      deployment_type: "Vrsta implementacije Confluence",
      deployment_type_explained:
        "Odredite je li vaša Confluence instanca smještena na Atlassian oblaku ili je samostalno hostana.",
      base_url: "Osnovni URL Confluence",
      base_url_explained: "Ovo je osnovni URL vašeg Confluence prostora.",
      space_key: "Ključ prostora Confluence",
      space_key_explained:
        "Ovo je ključ prostora vaše Confluence instance koji će se koristiti. Obično počinje s ~",
      username: "Korisničko ime Confluence",
      username_explained: "Vaše korisničko ime za Confluence",
      auth_type: "Vrsta autentikacije Confluence",
      auth_type_explained:
        "Odaberite vrstu autentikacije koju želite koristiti za pristup svojim Confluence stranicama.",
      auth_type_username: "Korisničko ime i pristupni token",
      auth_type_personal: "Osobni pristupni token",
      token: "Pristupni token Confluence",
      token_explained_start:
        "Morate navesti pristupni token za autentikaciju. Možete generirati pristupni token",
      token_explained_link: "ovdje",
      token_desc: "Pristupni token za autentikaciju",
      pat_token: "Osobni pristupni token Confluence",
      pat_token_explained: "Vaš osobni pristupni token za Confluence.",
      bypass_ssl: "Zaobiđi provjeru valjanosti SSL certifikata",
      bypass_ssl_explained:
        "Omogućite ovu opciju za zaobilaženje provjere valjanosti SSL certifikata za samostalno hostane Confluence instance sa samopotpisanim certifikatom",
      task_explained:
        "Nakon dovršetka, sadržaj stranice bit će dostupan za ugrađivanje u radne prostore u alatu za odabir dokumenata.",
    },
    manage: {
      documents: "Dokumenti",
      "data-connectors": "Konektori podataka",
      "desktop-only":
        "Uređivanje ovih postavki dostupno je samo na stolnom uređaju. Molimo pristupite ovoj stranici na svom stolnom računalu za nastavak.",
      dismiss: "Odbaci",
      editing: "Uređivanje",
    },
    directory: {
      "my-documents": "Moji dokumenti",
      "new-folder": "Nova mapa",
      "total-documents_one": "{{count}} dokument",
      "total-documents_other": "{{count}} dokumenata",
      "search-document": "Pretraži dokument",
      "no-documents": "Nema dokumenata",
      "move-workspace": "Premjesti u radni prostor",
      "delete-confirmation":
        "Jeste li sigurni da želite izbrisati ove datoteke i mape?\nOvo će ukloniti datoteke iz sustava i automatski ih ukloniti iz svih postojećih radnih prostora.\nOva radnja nije povratna.",
      "removing-message":
        "Uklanjanje {{count}} dokumenata i {{folderCount}} mapa. Pričekajte.",
      "move-success": "Uspješno premješteno {{count}} dokumenata.",
      no_docs: "Nema dokumenata",
      select_all: "Odaberi sve",
      deselect_all: "Poništi odabir svih",
      remove_selected: "Ukloni odabrano",
      save_embed: "Spremi i ugradi",
      "search-results_one": "{{count}} rezultat",
      "search-results_other": "{{count}} rezultati",
    },
    upload: {
      "processor-offline": "Procesor dokumenata nije dostupan",
      "processor-offline-desc":
        "Trenutno ne možemo prenijeti vaše datoteke jer je procesor dokumenata izvan mreže. Molimo pokušajte ponovno kasnije.",
      "click-upload": "Kliknite za prijenos ili povucite i ispustite",
      "file-types":
        "podržava tekstualne datoteke, csv datoteke, proračunske tablice, audio datoteke i još mnogo toga!",
      "or-submit-link": "ili predajte poveznicu",
      "placeholder-link": "https://example.com",
      fetching: "Dohvaćanje...",
      "fetch-website": "Dohvati web stranicu",
      "privacy-notice":
        "Ove datoteke bit će prenesene u procesor dokumenata koji radi na ovoj AnythingLLM instanci. Ove datoteke se ne šalju niti dijele s trećim stranama.",
    },
    pinning: {
      what_pinning: "Što je prikvačivanje dokumenata?",
      pin_explained_block1:
        "Kada <b>prikvačite</b> dokument u AnythingLLM-u, ubacit ćemo cijeli sadržaj dokumenta u vaš prozor upita da bi ga vaš LLM potpuno razumio.",
      pin_explained_block2:
        "Ovo najbolje funkcionira s <b>modelima velikog konteksta</b> ili malim datotekama koje su ključne za njegovu bazu znanja.",
      pin_explained_block3:
        "Ako ne dobivate željene odgovore od AnythingLLM-a prema zadanim postavkama, prikvačivanje je odličan način za dobivanje kvalitetnijih odgovora jednim klikom.",
      accept: "U redu, razumijem",
    },
    watching: {
      what_watching: "Što radi praćenje dokumenta?",
      watch_explained_block1:
        "Kada <b>pratite</b> dokument u AnythingLLM-u, <i>automatski</i> ćemo sinkronizirati sadržaj vašeg dokumenta iz njegovog izvornog izvora u redovitim intervalima. Ovo će automatski ažurirati sadržaj u svakom radnom prostoru u kojem se ova datoteka upravlja.",
      watch_explained_block2:
        "Ova značajka trenutno podržava sadržaj temeljen na internetu i neće biti dostupna za ručno prenesene dokumente.",
      watch_explained_block3_start:
        "Možete upravljati kojim se dokumentima prati putem ",
      watch_explained_block3_link: "upravitelja datoteka",
      watch_explained_block3_end: " u administratorskom pregledu.",
      accept: "U redu, razumijem",
    },
    gitea: {
      name: "Repo Gitea",
      description:
        "Uvoz cijelog javnog ili privatnog repozitorija iz bilo koje instancije Gitea u samo jednom kliku.",
      URL: "URL repozitorija Gitea",
      URL_explained:
        "URL repozitorija koje želite preuzeti na vašoj instanci Gitea – podržane su i samostalno hostovane instance.",
      token: "Token za pristup Gitei",
      optional: "opcionalno",
      token_explained:
        "Za pristup privatnim repozitorijima ili repozitorijima na serverima koji zahtijevaju autentifikaciju, je potreban token.",
      token_explained_start: "Bez",
      token_explained_link1: "Token za pristup",
      token_explained_end:
        "Samo repozitoriji koje vaše Gitea instancje objavljuju javno mogu biti prikupljeni.",
      ignores: "Datoteka zanemaruje",
      git_ignore:
        'Kreirajte datoteku u formatu ".gitignore" kako biste isključili određene datoteke tijekom kopiranja. Pritisnite Enter nakon svake stavke koju želite sačuvati.',
      task_explained:
        "Nakon dovršetka, svi se datoteci bit će dostupni za umetanje u radne prostore putem izbornika dokumenata.",
      branch: "Odjel/račun s kojim želite preuzeti datoteke.",
      branch_loading: "– učitavanje dostupnih grana –",
      branch_explained: "Odjel/račun s kojim želite preuzeti datoteke.",
      token_information:
        "Bez unosa <b>Token za pristup Gitei</b>, ovaj konektor neće moći prikupljati datove samo iz repozitorija koja su <b>otvorena za čitanje</b> na vašoj instanci Gitea.",
    },
  },
  chat_window: {
    attachments_processing: "Privitci se obrađuju. Pričekajte...",
    send_message: "Pošalji poruku",
    attach_file: "Priložite datoteku ovom razgovoru",
    text_size: "Promijeni veličinu teksta.",
    export: "Izvezi razgovor kao...",
    exporting: "Izvoz u tijeku...",
    microphone: "Izgovorite svoj upit.",
    stt_unsupported: "Pristup mikrofonu nije podržan u ovom pregledniku.",
    stt_mic_denied:
      "Nije moguć pristup mikrofonu. Odobrite dozvolu i pokušajte ponovno.",
    stt_transcription_failed: "Transkripcija nije uspjela: {{error}}",
    send: "Pošalji poruku upita radnom prostoru",
    tts_speak_message: "TTS izgovori poruku",
    copy: "Kopiraj",
    regenerate: "Regeneriraj",
    regenerate_response: "Regeneriraj odgovor",
    good_response: "Dobar odgovor",
    more_actions: "Više radnji",
    sources: "Izvori",
    source_count_one: "{{count}} referenca",
    source_count_other: "{{count}} referenci",
    document: "Dokument",
    similarity_match: "poklapanje",
    fork: "Razdvoji (fork)",
    delete: "Izbriši",
    cancel: "Odustani",
    submit: "Pošalji",
    edit_prompt: "Uredi upit",
    edit_response: "Uredi odgovor",
    edit_info_user:
      '"Pošalji" ponovno generira AI odgovor. "Spremi" ažurira samo vašu poruku.',
    edit_info_assistant:
      "Vaše promjene bit će spremljene izravno u ovaj odgovor.",
    see_less: "Prikaži manje",
    see_more: "Prikaži više",
    preset_reset_description:
      "Obriši svoju povijest razgovora i započni novi razgovor",
    add_new_preset: " Dodaj novi predložak",
    add_new: "Dodaj novo",
    edit: "Uredi",
    publish: "Objavi",
    stop_generating: "Zaustavi generiranje odgovora",
    command: "Naredba",
    your_command: "vasa-naredba",
    placeholder_prompt:
      "Ovo je sadržaj koji će biti ubačen ispred vašeg upita.",
    description: "Opis",
    placeholder_description: "Odgovara pjesmom o LLM-ovima.",
    save: "Spremi",
    small: "Mala",
    normal: "Normalna",
    large: "Velika",
    tools: "Alati",
    text_size_label: "Veličina teksta",
    select_model: "Odaberi model",
    slash_commands: "Kose naredbe (slash commands)",
    agent_skills: "Vještine agenta",
    manage_agent_skills: "Upravljaj vještinama agenta",
    app_integrations: "Integracije aplikacija",
    custom_skills: "Prilagođene vještine",
    agent_flows: "Tokovi agenta",
    sub_skills: "Podvještine",
    no_tools_found: "Nema pronađenih odgovarajućih alata",
    loading_mcp_servers: "Učitavanje MCP poslužitelja...",
    start_agent_session: "Pokreni sesiju agenta",
    agent_skills_disabled_in_session:
      "Nije moguće mijenjati vještine tijekom aktivne sesije agenta. Koristite /exit da prvo zavšite sesiju.",
    use_agent_session_to_use_tools:
      "Alate možete koristiti u razgovoru pokretanjem sesije agenta s '@agent' na početku svog upita.",
    workspace_llm_manager: {
      search: "Pretraži",
      loading_workspace_settings: "Učitavanje postavki radnog prostora...",
      available_models: "Dostupni modeli za {{provider}}",
      available_models_description:
        "Odaberite model koji se koristi za ovaj radni prostor.",
      save: "Koristi ovaj model",
      saving: "Postavljanje modela kao zadanog za radni prostor...",
      missing_credentials: "Ovom pružatelju usluga nedostaju vjerodajnice!",
      missing_credentials_description: "Postavi sada",
    },
    agent_invocation: {
      model_wants_to_call: "Model želi pozvati",
      approve: "Prihvati",
      reject: "Odbij",
      always_allow: "Uvijek dopusti {{skillName}}",
      tool_call_was_approved: "Poziv alata je prihvaćen",
      tool_call_was_rejected: "Poziv alata je odbijen",
      clarifying_skip: "Neka agent odluči",
      clarifying_submit: "Pošalji",
      clarifying_skipped: "Dopustili ste agentu da odluči.",
      clarifying_timeout: "Odgovor nije poslan na vrijeme.",
      clarifying_pagination: "{{current}} od {{total}}",
      clarifying_prev_aria: "Prethodno pitanje",
      clarifying_next_aria: "Sljedeće pitanje",
      clarifying_close_aria: "Zatvori i preskoči",
      clarifying_other: "Ostalo",
      clarifying_other_placeholder: "Upišite svoj odgovor",
      batch_progress: "{{answered}} od {{total}} odgovoreno",
      batch_skip_this: "Preskoči",
      batch_submit_all: "Pošalji sve",
      batch_next: "Dalje",
      answer_skipped: "[korisnik je preskočio]",
    },
    memories: {
      title: "Memorije",
      empty:
        "Još nema memorija. Nakon što više interagirate s chatbotom, memorije će se popunjavati ili",
      empty_cta: "stvori novu memoriju",
      tab_workspace: "Radni prostor",
      tab_global: "Globalno",
      toggle: {
        label: "Omogući personalizaciju",
        description:
          "Dopustite svom asistentu da pamti činjenice o vama ili ovom radnom prostoru i koristi ih u razgovorima",
      },
      auto_extraction: {
        label: "Automatske memorije",
        description: "Neka vaš asistent automatski stvara memorije u pozadini",
      },
      menu: {
        edit: "Uredi",
        delete: "Izbriši",
        move_to_global: "Premjesti u globalno",
        move_to_workspace: "Premjesti u radni prostor",
      },
      modal: {
        create_title: "Stvori memoriju",
        edit_title: "Uredi memoriju",
        create_description:
          'Memorije bi trebale biti jedna, koncizna izjava. npr. "Korisnik preferira Python nad JavaScriptom"',
        edit_description: "Ažurirajte sadržaj ove memorije.",
        label: "Memorija",
        placeholder:
          "npr. Korisnikovo ime je Joe, korisnik radi na AnythingLLM-u, itd.",
        create: "Stvori",
        save: "Spremi",
        cancel: "Odustani",
      },
    },
    preset_img_description: "Generiraj sliku na temelju tekstualnog uputa.",
  },
  profile_settings: {
    edit_account: "Uredi račun",
    profile_picture: "Profilna slika",
    remove_profile_picture: "Ukloni profilnu sliku",
    username: "Korisničko ime",
    new_password: "Nova lozinka",
    password_description: "Lozinka mora imati najmanje 8 znakova",
    cancel: "Odustani",
    update_account: "Ažuriraj račun",
    theme: "Postavka teme",
    language: "Preferirani jezik",
    failed_upload: "Prijenos profilne slike nije uspio: {{error}}",
    upload_success: "Profilna slika je prenesena.",
    failed_remove: "Uklanjanje profilne slike nije uspjelo: {{error}}",
    profile_updated: "Profil je ažuriran.",
    failed_update_user: "Ažuriranje korisnika nije uspjelo: {{error}}",
    account: "Račun",
    support: "Podrška",
    signout: "Odjava",
  },
  "keyboard-shortcuts": {
    title: "Prečaci na tipkovnici",
    shortcuts: {
      settings: "Otvori postavke",
      workspaceSettings: "Otvori postavke trenutnog radnog prostora",
      home: "Idi na početnu",
      workspaces: "Upravljaj radnim prostorima",
      apiKeys: "Postavke API ključeva",
      llmPreferences: "LLM postavke",
      chatSettings: "Postavke razgovora",
      help: "Prikaži pomoć za prečace na tipkovnici",
      showLLMSelector: "Prikaži birač LLM-a za radni prostor",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Uspjeh!",
        success_description:
          "Vaš sistemski upit je objavljen na Community Hub!",
        success_thank_you: "Hvala vam što ste podijelili sa zajednicom!",
        view_on_hub: "Pogledaj na Community Hub",
        modal_title: "Objavi sistemski upit",
        name_label: "Naziv",
        name_description: "Ovo je prikazani naziv vašeg sistemskog upita.",
        name_placeholder: "Moj sistemski upit",
        description_label: "Opis",
        description_description:
          "Ovo je opis vašeg sistemskog upita. Koristite ovo za opisivanje svrhe vašeg sistemskog upita.",
        tags_label: "Oznake",
        tags_description:
          "Oznake se koriste za označavanje vašeg sistemskog upita radi lakšeg pretraživanja. Možete dodati više oznaka. Maks. 5 oznaka. Maks. 20 znakova po oznaci.",
        tags_placeholder: "Upišite i pritisnite Enter za dodavanje oznaka",
        visibility_label: "Vidljivost",
        public_description: "Javni sistemski upiti vidljivi su svima.",
        private_description: "Privatni sistemski upiti vidljivi su samo vama.",
        publish_button: "Objavi na Community Hub",
        submitting: "Objavljivanje...",
        prompt_label: "Upit",
        prompt_description:
          "Ovo je stvarni sistemski upit koji će se koristiti za usmjeravanje LLM-a.",
        prompt_placeholder: "Unesite svoj sistemski upit ovdje...",
      },
      agent_flow: {
        success_title: "Uspjeh!",
        success_description: "Vaš tok agenta je objavljen na Community Hub!",
        success_thank_you: "Hvala vam što ste podijelili sa zajednicom!",
        view_on_hub: "Pogledaj na Community Hub",
        modal_title: "Objavi tok agenta",
        name_label: "Naziv",
        name_description: "Ovo je prikazani naziv vašeg toka agenta.",
        name_placeholder: "Moj tok agenta",
        description_label: "Opis",
        description_description:
          "Ovo je opis vašeg toka agenta. Koristite ovo za opisivanje svrhe vašeg toka agenta.",
        tags_label: "Oznake",
        tags_description:
          "Oznake se koriste za označavanje vašeg toka agenta radi lakšeg pretraživanja. Možete dodati više oznaka. Maks. 5 oznaka. Maks. 20 znakova po oznaci.",
        tags_placeholder: "Upišite i pritisnite Enter za dodavanje oznaka",
        visibility_label: "Vidljivost",
        submitting: "Objavljivanje...",
        submit: "Objavi na Community Hub",
        privacy_note:
          "Tokovi agenta se uvijek prenose kao privatni radi zaštite osjetljivih podataka. Vidljivost možete promijeniti na Community Hub-u nakon objave. Molimo provjerite da vaš tok ne sadrži osjetljive ili privatne informacije prije objave.",
      },
      slash_command: {
        success_title: "Uspjeh!",
        success_description:
          "Vaša kosa naredba je objavljena na Community Hub!",
        success_thank_you: "Hvala vam što ste podijelili sa zajednicom!",
        view_on_hub: "Pogledaj na Community Hub",
        modal_title: "Objavi kosu naredbu",
        name_label: "Naziv",
        name_description: "Ovo je prikazani naziv vaše kose naredbe.",
        name_placeholder: "Moja kosa naredba",
        description_label: "Opis",
        description_description:
          "Ovo je opis vaše kose naredbe. Koristite ovo za opisivanje svrhe vaše kose naredbe.",
        tags_label: "Oznake",
        tags_description:
          "Oznake se koriste za označavanje vaše kose naredbe radi lakšeg pretraživanja. Možete dodati više oznaka. Maks. 5 oznaka. Maks. 20 znakova po oznaci.",
        tags_placeholder: "Upišite i pritisnite Enter za dodavanje oznaka",
        visibility_label: "Vidljivost",
        public_description: "Javne kose naredbe vidljive su svima.",
        private_description: "Privatne kose naredbe vidljive su samo vama.",
        publish_button: "Objavi na Community Hub",
        submitting: "Objavljivanje...",
        prompt_label: "Upit",
        prompt_description:
          "Ovo je upit koji će se koristiti kada se kosa naredba pokrene.",
        prompt_placeholder: "Unesite svoj upit ovdje...",
      },
      generic: {
        unauthenticated: {
          title: "Potrebna autentikacija",
          description:
            "Morate se autentificirati putem AnythingLLM Community Hub-a prije objavljivanja stavki.",
          button: "Poveži se s Community Hub-om",
        },
      },
    },
  },
  scheduledJobs: {
    title: "Zakazani zadaci",
    enableNotifications: "Omogući obavijesti preglednika za rezultate zadataka",
    description:
      "Stvorite ponavljajuće AI zadatke koji se izvode po rasporedu. Svaki zadatak izvršava upit s neobaveznim alatima i sprema rezultat za pregled.",
    newJob: "Novi zadatak",
    loading: "Učitavanje...",
    emptyTitle: "Još nema zakazanih zadataka",
    emptySubtitle: "Stvorite jedan za početak.",
    table: {
      name: "Naziv",
      schedule: "Raspored",
      status: "Status",
      lastRun: "Posljednje pokretanje",
      nextRun: "Sljedeće pokretanje",
      actions: "Radnje",
    },
    confirmDelete:
      "Jeste li sigurni da želite izbrisati ovaj zakazani zadatak?",
    status: {
      completed: "Dovršeno",
      failed: "Nije uspjelo",
      timed_out: "Isteklo vrijeme",
      running: "U izvođenju",
      queued: "U redu čekanja",
    },
    toast: {
      deleted: "Zadatak izbrisan",
      triggered: "Zadatak je uspješno pokrenut",
      triggerFailed: "Pokretanje zadatka nije uspjelo",
      triggerSkipped: "Izvođenje za ovaj zadatak je već u tijeku",
      killed: "Zadatak je uspješno zaustavljen",
      killFailed: "Zaustavljanje zadatka nije uspjelo",
    },
    row: {
      neverRun: "Nikad pokrenuto",
      viewRuns: "Pregledaj izvođenja",
      runNow: "Pokreni sada",
      enable: "Omogući",
      disable: "Isključi",
      edit: "Uredi",
      delete: "Izbriši",
    },
    modal: {
      titleEdit: "Uredi zakazani zadatak",
      titleNew: "Novi zakazani zadatak",
      nameLabel: "Naziv",
      namePlaceholder: "npr. Dnevni pregled vijesti",
      promptLabel: "Upit",
      promptPlaceholder: "Instrukcija koja se izvodi pri svakom pokretanju...",
      scheduleLabel: "Raspored",
      modeBuilder: "Kreator",
      modeCustom: "Prilagođeno",
      cronPlaceholder: "Cron izraz (npr. 0 9 * * *)",
      currentSchedule: "Trenutni raspored:",
      toolsLabel: "Alati (neobavezno)",
      toolsDescription:
        "Odaberite koje alate agenta ovaj zadatak može koristiti. Ako nijedan nije odabran, zadatak se izvodi bez alata.",
      toolsSearch: "Pretraži",
      toolsNoResults: "Nema odgovarajućih alata",
      required: "Obavezno",
      requiredFieldsBanner:
        "Molimo popunite sva obavezna polja da biste stvorili zadatak.",
      cancel: "Odustani",
      saving: "Spremanje...",
      updateJob: "Ažuriraj zadatak",
      createJob: "Stvori zadatak",
      jobUpdated: "Zadatak ažuriran",
      jobCreated: "Zadatak stvoren",
    },
    builder: {
      fallbackWarning:
        "Ovaj izraz nije moguće vizualno urediti. Prebacite se na Prilagođeno da ga zadržite, ili promijenite bilo što ispod da ga prepišete.",
      run: "Pokreni",
      frequency: {
        minute: "svake minute",
        hour: "svaki sat",
        day: "svaki dan",
        week: "svaki tjedan",
        month: "svaki mjesec",
      },
      every: "Svakih",
      minuteOne: "1 minuta",
      minuteOther: "{{count}} minuta",
      atMinute: "U minuti",
      pastEveryHour: "svakog sata",
      at: "U",
      on: "U",
      onDay: "Na dan",
      ofEveryMonth: "svakog mjeseca",
      weekdays: {
        sun: "Ned",
        mon: "Pon",
        tue: "Uto",
        wed: "Sri",
        thu: "Čet",
        fri: "Pet",
        sat: "Sub",
      },
    },
    runHistory: {
      back: "Povratak na zadatke",
      title: "Povijest izvođenja: {{name}}",
      schedule: "Raspored:",
      emptyTitle: "Još nema izvođenja za ovaj zadatak",
      emptySubtitle: "Pokrenite zadatak sada i pregledajte njegove rezultate.",
      runNow: "Pokreni sada",
      stopJob: "Zaustavi zadatak",
      table: {
        status: "Status",
        started: "Pokrenuto",
        duration: "Trajanje",
        error: "Pogreška",
      },
    },
    runDetail: {
      loading: "Učitavanje detalja izvođenja...",
      notFound: "Izvođenje nije pronađeno.",
      back: "Povratak",
      unknownJob: "Nepoznati zadatak",
      runHeading: "{{name}} — izvođenje #{{id}}",
      duration: "Trajanje: {{value}}",
      continueInThread: "Nastavi u razgovoru",
      creating: "Stvaranje...",
      threadFailed: "Stvaranje niti nije uspjelo",
      stopJob: "Zaustavi zadatak",
      killing: "Zaustavljanje...",
      sections: {
        prompt: "Upit",
        error: "Pogreška",
        thinking: "Misli ({{count}})",
        toolCalls: "Pozivi alata ({{count}})",
        files: "Datoteke ({{count}})",
        response: "Odgovor",
        metrics: "Metrike",
      },
      metrics: {
        promptTokens: "Tokeni upita:",
        completionTokens: "Tokeni dovršetka:",
      },
    },
    toolCall: {
      arguments: "Argumenti:",
      showResult: "Prikaži rezultat",
      hideResult: "Sakrij rezultat",
    },
    file: {
      unknown: "Nepoznata datoteka",
      download: "Preuzmi",
      downloadFailed: "Preuzimanje datoteke nije uspjelo",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF dokument",
        word: "Word dokument",
        spreadsheet: "Proračunska tablica",
        generic: "Datoteka",
      },
    },
  },
  imageGeneration: {
    title: "Preferirani način generiranja slike",
    description:
      "Konfigurirajte pružatelja koji se koristi za generiranje slika iz naredbe `/img`.",
    provider: "Pružatelj usluga generiranja slika",
    card: {
      "failed-to-load": "Slika nije uspjela se učitati.",
      "alt-text": "Generirana slika",
      edit: "Uredi",
      download: "Preuzmi",
    },
    pending: {
      heading: "Generiranje vaše slike…",
      description:
        "To može potrajati neko vrijeme. Bit će dostupno ovdje čim bude spremno.",
      aborted: "Generiranje slike je prekinuto.",
    },
  },
};

export default TRANSLATIONS;
