// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Pradėti",
      welcome: "Sveiki",
    },
    llm: {
      title: "LLM pasirinkimas",
      description:
        "AnythingLLM gali dirbti su daugeliu LLM tiekėjų. Ši paslauga bus atsakinga už pokalbių valdymą.",
    },
    userSetup: {
      title: "Vartotojo nustatymas",
      description: "Konfigūruokite savo vartotojo nustatymus.",
      howManyUsers: "Kiek vartotojų naudosis šia instancija?",
      justMe: "Tik aš",
      myTeam: "Mano komanda",
      instancePassword: "Sistemos slaptažodis",
      setPassword: "Ar norėtumėte nustatyti slaptažodį?",
      passwordReq: "Slaptažodis turi būti bent 8 simbolių ilgio.",
      passwordWarn:
        "Svarbu išsisaugoti šį slaptažodį, nes nėra slaptažodžio atkūrimo būdo.",
      adminUsername: "Administratoriaus vartotojo vardas",
      adminPassword: "Administratoriaus slaptažodis",
      adminPasswordReq: "Slaptažodis turi būti bent 8 simbolių ilgio.",
      teamHint:
        "Pagal numatytuosius nustatymus jūs būsite vienintelis administratorius. Baigę pradinį nustatymą, galėsite sukurti ir pakviesti kitus vartotojus ar administratorius. Nepraraskite slaptažodžio, nes tik administratoriai gali juos nustatyti iš naujo.",
    },
    data: {
      title: "Duomenų tvarkymas ir privatumas",
      description:
        "Esame įsipareigoję užtikrinti skaidrumą ir jūsų asmeninių duomenų kontrolę.",
      settingsHint: "Šiuos nustatymus bet kada galite pakeisti nustatymuose.",
    },
    survey: {
      title: "Sveiki atvykę į AnythingLLM",
      description:
        "Padėkite mums pritaikyti AnythingLLM jūsų poreikiams. Neprivaloma.",
      email: "Koks jūsų el. pašto adresas?",
      useCase: "Kam naudosite AnythingLLM?",
      useCaseWork: "Darbui",
      useCasePersonal: "Asmeniniam naudojimui",
      useCaseOther: "Kita",
      comment: "Kaip sužinojote apie AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube ir kt. - Praneškite, kaip mus radote!",
      skip: "Praleisti apklausą",
      thankYou: "Ačiū už jūsų atsiliepimus!",
    },
  },
  common: {
    "workspaces-name": "Darbo srities pavadinimas",
    selection: "Modelio pasirinkimas",
    saving: "Saugoma...",
    save: "Išsaugoti pakeitimus",
    previous: "Ankstesnis puslapis",
    next: "Kitas puslapis",
    optional: "Neprivaloma",
    yes: "Taip",
    no: "Ne",
    on: "Įjungta",
    none: "Nėra",
    stopped: "Sustabdyta",
    search: "Paieška",
    username_requirements:
      "Vartotojo vardą turi sudaryti 2–32 simboliai, jis turi prasidėti mažąja raide ir susidėti tik iš mažųjų raidžių, skaičių, pabraukimo brūkšnių, brūkšnelių ir taškų.",
    loading: "Kraunama",
    refresh: "Atnaujinti",
  },
  home: {
    welcome: "Sveiki",
    chooseWorkspace: "Pasirinkite darbo sritį, kad pradėtumėte pokalbį!",
    notAssigned:
      "Šiuo metu nesate priskirtas jokiai darbo sričiai.\nSusisiekite su administratoriumi, kad gautumėte prieigą prie darbo srities.",
    goToWorkspace: "Eiti į „{{workspace}}“",
  },
  settings: {
    title: "Sistemos nustatymai",
    invites: "Pakvietimai",
    users: "Vartotojai",
    workspaces: "Darbo sritys",
    "workspace-chats": "Darbo srities pokalbiai",
    customization: "Pritaikymas",
    interface: "Sąsajos nustatymai",
    branding: "Prekės ženklas",
    chat: "Pokalbiai",
    "api-keys": "Programuotojų API",
    llm: "LLM",
    transcription: "Transkripcija",
    embedder: "Vektorių modelis (Embedder)",
    "text-splitting": "Teksto skaidymas ir fragmentavimas",
    "voice-speech": "Balsas ir kalba",
    "vector-database": "Vektorių duomenų bazė",
    embeds: "Pokalbių įskiepis",
    security: "Saugumas",
    "event-logs": "Įvykių žurnalas",
    privacy: "Privatumas ir duomenys",
    "ai-providers": "DI tiekėjai",
    "agent-skills": "Agento įgūdžiai",
    "community-hub": {
      title: "Bendruomenės centras",
      trending: "Naršyti populiarius",
      "your-account": "Jūsų paskyra",
      "import-item": "Importuoti elementą",
    },
    admin: "Admin",
    tools: "Įrankiai",
    "system-prompt-variables": "Sistemos užklausų kintamieji",
    "experimental-features": "Eksperimentinės funkcijos",
    contact: "Susisiekti su pagalba",
    "browser-extension": "Naršyklės plėtinys",
    "mobile-app": "AnythingLLM mobiliesiems",
    channels: "Kanalai",
    "available-channels": {
      telegram: "„Telegram“",
    },
    "scheduled-jobs": "Planuojami darbai",
  },
  login: {
    "multi-user": {
      welcome: "Sveiki",
      "placeholder-username": "Vartotojo vardas",
      "placeholder-password": "Slaptažodis",
      login: "Prisijungti",
      validating: "Tikrinama...",
      "forgot-pass": "Pamiršote slaptažodį",
      reset: "Atstatyti",
    },
    "sign-in":
      "Įveskite savo vartotojo vardą ir slaptažodį, kad pasiektumėte savo {{appName}} instanciją.",
    "password-reset": {
      title: "Slaptažodžio atstatymas",
      description: "Pateikite reikiamą informaciją slaptažodžiui atstatyti.",
      "recovery-codes": "Atkūrimo kodai",
      "back-to-login": "Grįžti į prisijungimą",
    },
  },
  "main-page": {
    greeting: "Kaip galiu jums šiandien padėti?",
    quickActions: {
      createAgent: "Sukurti agentą",
      editWorkspace: "Redaguoti darbo sritį",
      uploadDocument: "Įkelti dokumentą",
    },
  },
  "new-workspace": {
    title: "Nauja darbo sritis",
    placeholder: "Mano darbo sritis",
  },
  "workspaces—settings": {
    general: "Bendrieji nustatymai",
    chat: "Pokalbių nustatymai",
    vector: "Vektorių duomenų bazė",
    members: "Nariai",
    agent: "Agento konfigūracija",
  },
  general: {
    vector: {
      title: "Vektorių skaičius",
      description: "Bendras vektorių skaičius jūsų vektorių duomenų bazėje.",
    },
    names: {
      description: "Tai pakeis tik jūsų darbo srities rodomą pavadinimą.",
    },
    message: {
      title: "Siūlomos pokalbių žinutės",
      description:
        "Pritaikykite žinutes, kurios bus siūlomos jūsų darbo srities vartotojams.",
      add: "Pridėti naują žinutę",
      save: "Išsaugoti žinutes",
      heading: "Paaiškink man",
      body: "AnythingLLM naudą",
    },
    delete: {
      title: "Ištrinti darbo sritį",
      description:
        "Ištrinti šią darbo sritį ir visus jos duomenis. Tai ištrins darbo sritį visiems vartotojams.",
      delete: "Ištrinti darbo sritį",
      deleting: "Darbo sritis trinama...",
      "confirm-start": "Jūs ketinate ištrinti visą savo",
      "confirm-end":
        "darbo sritį. Tai pašalins visus vektorius jūsų vektorių duomenų bazėje.\n\nOriginalūs šaltinio failai liks nepaliesti. Šis veiksmas yra negrįžtamas.",
    },
  },
  chat: {
    llm: {
      title: "Darbo srities LLM tiekėjas",
      description:
        "Konkretus LLM tiekėjas ir modelis, kuris bus naudojamas šiai darbo sričiai. Pagal numatytuosius nustatymus naudojamas sistemos LLM tiekėjas ir nustatymai.",
      search: "Ieškoti visų LLM tiekėjų",
    },
    model: {
      title: "Darbo srities pokalbių modelis",
      description:
        "Konkretus pokalbių modelis, kuris bus naudojamas šiai darbo sričiai. Jei tuščia, bus naudojamas sistemos LLM pasirinkimas.",
    },
    mode: {
      title: "Pokalbio režimas",
      automatic: {
        description:
          'automatiškai naudosis įrankiais, jei modelis ir paslaugos teikėjas palaiko įrankių vadovavimą. <br />Jei įrankių vadovavimas nepaliekamas, jums reikės naudoti "@agent" komandą, kad galėtumėte naudoti įrankius.',
        title: "Agentas",
      },
      chat: {
        title: "Pokalbis",
        description:
          "pasiūlys atsakymus, remdamasis LLM bendrais žinynais ir dokumento kontekstu, kuris yra prieinamas. Norėdami naudoti įrankus, reikės naudoti @agent komandą.",
      },
      query: {
        title: "Užklausa",
        description:
          'bus teikiamos atsakomybė <b>tik</b>, jei dokumento kontekstas bus nustatytas. <br />Norėdami naudoti įrankius, jums reikės naudoti "@agent" komandą.',
      },
    },
    history: {
      title: "Pokalbių istorija",
      "desc-start":
        "Ankstesnių pokalbių skaičius, kuris bus įtrauktas į atsakymo trumpalaikę atmintį.",
      recommend: "Rekomenduojama 20. ",
      "desc-end":
        "Daugiau nei 45 pokalbiai gali lemti nuolatines klaidas priklausomai nuo žinutės dydžio.",
    },
    prompt: {
      title: "Sistemos instrukcija",
      description:
        "Instrukcija, kuri bus naudojama šioje darbo srityje. Apibrėžkite kontekstą ir nurodymus DI, kaip generuoti atsakymą. Turėtumėte pateikti kruopščiai parengtą instrukciją, kad DI galėtų sugeneruoti aktualų ir tikslų atsakymą.",
      history: {
        title: "Sistemos instrukcijų istorija",
        clearAll: "Išvalyti viską",
        noHistory: "Sistemos instrukcijų istorijos nėra",
        restore: "Atkurti",
        delete: "Ištrinti",
        publish: "Paskelbti bendruomenės centre",
        deleteConfirm: "Ar tikrai norite ištrinti šį istorijos elementą?",
        clearAllConfirm:
          "Ar tikrai norite išvalyti visą istoriją? Šis veiksmas yra negrįžtamas.",
        expand: "Išskleisti",
      },
    },
    refusal: {
      title: "Atsisakymo atsakymas užklausos režime",
      "desc-start": "Kai naudojamas",
      query: "užklausos",
      "desc-end":
        "režimas, galite nustatyti savo atsakymą, kai nerandama jokio konteksto.",
      "tooltip-title": "Kodėl tai matau?",
      "tooltip-description":
        "Esate užklausos režime, kuris naudoja tik informaciją iš jūsų dokumentų. Perjunkite į pokalbio režimą laisvesmiam bendravimui arba spustelėkite čia, kad apsilankytumėte mūsų dokumentacijoje ir sužinotumėte daugiau apie pokalbių režimus.",
    },
    temperature: {
      title: "LLM temperatūra",
      "desc-start":
        "Šis nustatymas kontroliuoja, koks „kūrybiškas“ bus jūsų LLM atsakymas.",
      "desc-end":
        "Kuo didesnis skaičius, tuo atsakymai kūrybiškesni. Kai kuriems modeliams nustačius per didelę reikšmę atsakymai gali tapti nerišlūs.",
      hint: "Dauguma LLM turi įvairius priimtinų reikšmių rėžius. Pasitarkite su savo LLM tiekėju.",
    },
  },
  "vector-workspace": {
    identifier: "Vektorių duomenų bazės identifikatorius",
    snippets: {
      title: "Maksimalus konteksto fragmentų kiekis",
      description:
        "Šis nustatymas kontroliuoja maksimalų konteksto fragmentų kiekį, kuris bus siunčiamas į LLM vieno pokalbio ar užklausos metu.",
      recommend: "Rekomenduojama: 4",
    },
    doc: {
      title: "Dokumentų panašumo slenkstis",
      description:
        "Minimalus panašumo balas, reikalingas, kad šaltinis būtų laikomas susijusiu su pokalbiu. Kuo didesnis skaičius, tuo panašesnis šaltinis turi būti į pokalbį.",
      zero: "Be apribojimų",
      low: "Žemas (panašumas ≥ .25)",
      medium: "Vidutinis (panašumas ≥ .50)",
      high: "Aukštas (panašumas ≥ .75)",
    },
    reset: {
      reset: "Atstatyti vektorių duomenų bazę",
      resetting: "Valomi vektoriai...",
      confirm:
        "Jūs ketinate atstatyti šios darbo srities vektorių duomenų bazę. Tai pašalins visus šiuo metu esančius vektorius.\n\nOriginalūs šaltinio failai liks nepaliesti. Šis veiksmas yra negrįžtamas.",
      error: "Nepavyko atstatyti darbo srities vektorių duomenų bazės!",
      success: "Darbo srities vektorių duomenų bazė buvo atstatyta!",
    },
  },
  agent: {
    "performance-warning":
      "LLM, kurie tiesiogiai nepalaiko įrankių iškvietimo (tool-calling), našumas labai priklauso nuo modelio galimybių ir tikslumo. Kai kurios funkcijos gali būti ribotos arba neveikti.",
    provider: {
      title: "Darbo srities agento LLM tiekėjas",
      description:
        "Konkretus LLM tiekėjas ir modelis, kuris bus naudojamas šios darbo srities @agent agentui.",
    },
    mode: {
      chat: {
        title: "Darbo srities agento pokalbių modelis",
        description:
          "Konkretus pokalbių modelis, kuris bus naudojamas šios darbo srities @agent agentui.",
      },
      title: "Darbo srities agento modelis",
      description:
        "Konkretus LLM modelis, kuris bus naudojamas šios darbo srities @agent agentui.",
      wait: "-- laukiama modelių --",
    },
    skill: {
      rag: {
        title: "RAG ir ilgalaikė atmintis",
        description:
          "Leidžia agentui naudoti jūsų vietinius dokumentus atsakymams arba prašyti agento „įsiminti“ informaciją ilgalaikei atminties paieškai.",
      },
      view: {
        title: "Peržiūrėti ir apibendrinti dokumentus",
        description:
          "Leidžia agentui išvardyti ir apibendrinti šiuo metu įkeltų darbo srities failų turinį.",
      },
      scrape: {
        title: "Nuskaityti svetaines",
        description:
          "Leidžia agentui lankytis svetainėse ir nuskaityti jų turinį.",
      },
      generate: {
        title: "Generuoti diagramas",
        description:
          "Leidžia numatytajam agentui generuoti įvairių tipų diagramas pagal pateiktus arba pokalbio metu gautus duomenis.",
      },
      web: {
        title: "Paieška internete",
        description:
          "Leidžia jūsų agentui ieškoti informacijos internete per interneto paieškos (SERP) tiekėją.",
      },
      sql: {
        title: "SQL jungtis",
        description:
          "Leidžia jūsų agentui naudoti SQL užklausas atsakymams per įvairius SQL duomenų bazių tiekėjus.",
      },
      default_skill:
        "Pagal numatytuosius nustatymus šis įgūdis yra įjungtas, bet galite jį išjungti, jei nenorite, kad jis būtų prieinamas agentui.",
      filesystem: {
        title: "Failų sistemos prieigos teisės",
        description:
          "Leiskite savo agentui skaityti, rašyti, ieškoti ir valdomi failus nustatytame kataloge. Paremiama failų redagavimas, katalogų navigacija ir turinio paieška.",
        learnMore: "Sužinokite daugiau apie tai, kaip naudoti šią įgūdį.",
        configuration: "Konfigūracija",
        readActions: "Veikimas",
        writeActions: "Veikimas",
        warning:
          "Failų sistemos prieigos vartymas gali būti pavojus, nes gali modifikuoti arba ištrinti failus. Prašome, prieš įgalindami, pasikonsultuoti su <a>dokumentacija</a>.",
        skills: {
          "read-text-file": {
            title: "Atidaryti failą",
            description:
              "Peržiūrėti failų turinį (tekstą, kodą, PDF, vaizdus ir kt.)",
          },
          "read-multiple-files": {
            title: "Atidarykite kelis failus",
            description: "Galia, skaitykite kelis failus vienu metu.",
          },
          "list-directory": {
            title: "Pašalinis katalogas",
            description: "Parodykite failus ir katalogus, esančius sąvade",
          },
          "search-files": {
            title: "Paieškos failus",
            description: "Paieškokite failus pagal pavadinimą arba turinį",
          },
          "get-file-info": {
            title: "Gaukite failo informaciją",
            description: "Gaukite išsamią informaciją apie failus.",
          },
          "edit-file": {
            title: "Redaguoti failą",
            description: "Atlikite teksto failų redakciją, remdamiesi eilėmis.",
          },
          "create-directory": {
            title: "Sukurti katalogą",
            description: "Sukurti naujas katalogus",
          },
          "move-file": {
            title: "Perkelti/Pavadinimą failą",
            description: "Perkelti arba pervardinti failus ir katalogus",
          },
          "copy-file": {
            title: "Kopijuoti failą",
            description: "Kopijuoti failus ir katalogus",
          },
          "write-text-file": {
            title: "Sukurti teksto failą",
            description:
              "Sukurkite naujus tekstinius failus arba pakeiskite esamus tekstinius failus.",
          },
        },
      },
      createFiles: {
        title: "Dokumento sukūrimas",
        description:
          "Įgalinkite savo agentą kurti dvigubos formos dokumentų formatus, tokius kaip „PowerPoint“ prezentacijos, „Excel“ lentelės, „Word“ dokumentai ir PDF failus. Failus galima atsisiųsti tiesiai iš pokalbio lango.",
        configuration: "Galimi dokumentų tipai",
        skills: {
          "create-text-file": {
            title: "Tekstiniai failai",
            description:
              "Sukurkite teksto failus su bet kokiu turiniu ir failų sąlypa (.txt, .md, .json, .csv ir kt.)",
          },
          "create-pptx": {
            title: "„PowerPoint“ pristatymai",
            description:
              "Sukurkite naujas PowerPoint prezentacijas, naudodami slaidus, pavadinimus ir punktų sąrašus.",
          },
          "create-pdf": {
            title: "PDF dokumentai",
            description:
              "Sukurkite PDF dokumentus iš Markdown ar paprastos teksto formato, naudodami pagrindinius stiliaus elementus.",
          },
          "create-xlsx": {
            title: "„Excel“ lentelės",
            description:
              "Sukurkite Excel dokumentus, skirtus lentelių duomenims, su lapais ir stiliaus parametrais.",
          },
          "create-docx": {
            title: "Skelbimo dokumentai",
            description:
              "Sukurkite Word dokumentus su pagrindine stiliavimo ir formavimo funkcija.",
          },
        },
      },
      gmail: {
        title: "GMail sąsaja",
        description:
          "Įgalinkite savo agentą, kad galėtų interaktuoti su Gmail – ieškoti pašto žinučių, skaityti pokalbius, kurti projekte, siųsti pašto žinučių ir valdyti savo pašto dėžę. <a>Peržiūrėkite dokumentaciją</a>.",
        multiUserWarning:
          "„Gmail“ integracija negali būti naudojama kelių vartotojų režimu dėl saugumo priežasčių. Norėdami naudoti šią funkciją, prašome išjungti kelių vartotojų režimą.",
        configuration: "Gmail konfigūracija",
        deploymentId: "Įrenginio ID",
        deploymentIdHelp: "Jūsų „Google Apps Script“ svetainės programos ID",
        apiKey: "API raktas",
        apiKeyHelp:
          "„API“ raktas, kurį konfigūruojate savo „Google Apps Script“ programoje.",
        configurationRequired:
          "Prašome nustatyti „Deployment ID“ ir API raktą, kad būtų įgalintos Gmail funkcijos.",
        configured: "Nustatytas",
        searchSkills: "Paieškos įgūdžiai...",
        noSkillsFound: "Nėra atitikčių jūsų paieškos kriterijams.",
        categories: {
          search: {
            title: "Paieškos ir skaitymas el. paštą",
            description:
              "Paieškokite ir skaitykite el. laiimus iš savo „Gmail“ sąrašo",
          },
          drafts: {
            title: "Pagalbos el. pašto rašto projektai",
            description: "Sukurkite, redaguo, ir valdykite el. pašto rašinius.",
          },
          send: {
            title: "Siųstis ir atsakyti el. pašto žinutėms",
            description:
              "Siųkite el. pašto žinutes ir atsakykite į diskusijų siužus nedelsiant.",
          },
          threads: {
            title: "Valdykite el. pašto žinias",
            description:
              "Valdykite el. pašto žinias – pažymėkite kaip „perskaityta“ arba „neperskaityta“, archyvuokite, ištrinkite.",
          },
          account: {
            title: "Integracijos statistika",
            description:
              "Peržiūrėkite pašto dėžės statistikos ir sąskaitos informaciją.",
          },
        },
        skills: {
          search: {
            title: "Paieškos el. paštu",
            description:
              "Paieškokite el. laiimus naudodami Gmail paieškos sintaksę",
          },
          readThread: {
            title: "Peržiūrėti temą",
            description: "Peržiūrėkite visą el. pašto seką pagal ID.",
          },
          createDraft: {
            title: "Sukurti projekto variantą",
            description: "Sukurkite naują el. pašto projekto variantą",
          },
          createDraftReply: {
            title: "Sukurti projekto atsakymą",
            description: "Sukurkite atsakinimo projektą esamai temai.",
          },
          updateDraft: {
            title: "Paskaitos projekto atnaujinimas",
            description: "Atnaujinti esamą el. pašto projekto",
          },
          getDraft: {
            title: "Gaukite projekto variantą",
            description: "Gauti konkretų variantą pagal ID",
          },
          listDrafts: {
            title: "Paskaitų planas",
            description: "Įrašykite visus suvestus el. pašto projektus",
          },
          deleteDraft: {
            title: "Ištrinkti projekto",
            description: "Ištrinkite projekto el. laišką",
          },
          sendDraft: {
            title: "Siųstis projekto",
            description: "Siųstis esamą el. pašto projekto",
          },
          sendEmail: {
            title: "Siųstis el. pašto laišką",
            description: "Nurodyti el. pašto žinutę nedelsiant",
          },
          replyToThread: {
            title: "Atsakymas į temą",
            description: "Atsakyti į el. pašto žinią nedelsiant",
          },
          markRead: {
            title: "Markas Redas",
            description: "Žymkite temą kaip perskaitytą",
          },
          markUnread: {
            title: "Žymėti kaip neperskaityta",
            description: "Žymkite temą kaip neperskaitytą",
          },
          moveToTrash: {
            title: "Perkelti į šiukšlių sąvartą",
            description: "Perkelkite temą į šiukšlių sąsandynę",
          },
          moveToArchive: {
            title: "Archivų",
            description: "Įrašyti temą į archyvą",
          },
          moveToInbox: {
            title: "Perkelkite į „Įvesalą“",
            description: "Perkelti temą į pašto dėžę",
          },
          getMailboxStats: {
            title: "Pašto dėžės statistika",
            description:
              "Gaukite neatsakytų žinučių skaičių ir pašto dėžės statistikos duomenis.",
          },
          getInbox: {
            title: "Peržiūrėti laiškų dėžę",
            description: "Efektyvus būdas gauti el. laiškus iš „Gmail“ sąrašo",
          },
        },
      },
      outlook: {
        title: "„Outlook“ integracija",
        description:
          "Įgalinkite savo agentą, kad galėtų bendrauti su „Microsoft Outlook“ – ieškoti pašto, skaityti pokalbį, kurti projektus, siųsti paštą ir valdyti savo pašto dėžę per „Microsoft Graph“ API. <a>Peržiūrėkite dokumentaciją</a>.",
        multiUserWarning:
          "„Outlook“ integracija negalima naudoti kelių vartotojų režimu dėl saugumo priežasčių. Norėdami naudoti šią funkciją, prašome išjungti kelių vartotojų režimą.",
        configuration: "Outlook konfigūracija",
        authType: "Sąskaitos tipas",
        authTypeHelp:
          "Pasirinkite, kokie Microsoft sąskaitos gali būti patvirtintos. „Visi“ palaiko tiek asmenines, tiek darbo/mokyklos sąskaitas. „Tik asmeninės“ riboja pasirinkimą iki asmeninių Microsoft sąskaitų. „Tik organizacijos“ riboja pasirinkimą iki darbo/mokyklos sąskaitų iš konkretaus „Azure AD“ kliento.",
        authTypeCommon: "Visos sąskaitos (asmeninės ir darbo/mokyklos)",
        authTypeConsumers: "Tiesiog asmeninės Microsoft paskyros",
        authTypeOrganization:
          "Tiesiog organizacijos sąskaitos (reikia užpildyti „Užimtojo ID“ laukelį)",
        clientId: "Programos (kliento) ID",
        clientIdHelp:
          "Programos (kliento) ID, gautas iš jūsų „Azure AD“ programos registracijos",
        tenantId: "Identifikavimo numeris (nuomininkas)",
        tenantIdHelp:
          "„Tenant“ ID iš jūsų „Azure AD“ programos registracijos. Reikalingas tik, jei autentifikacija vykdoma tik organizacijos naudotojams.",
        clientSecret: "Kliento slaptas kodas",
        clientSecretHelp:
          "Kliento paslaptas reikalas, gautas iš jūsų „Azure AD“ programos registracijos",
        configurationRequired:
          "Prašome nustatyti kliento ID ir kliento slaptažodį, kad būtų įgalintos Outlook funkcijos.",
        authRequired:
          "Pirmiausia, išsaugokite savo duomenis, o tada, kad užbaigtumėte konfigūraciją, prisijunkite prie „Microsoft“.",
        authenticateWithMicrosoft: "Patvirtinkite naudodami Microsoft",
        authenticated: "Sėkmingai prisijungta prie „Microsoft Outlook“.",
        revokeAccess: "Atšalinti prieigą",
        configured: "Nustatytas",
        searchSkills: "Paieškos įgūdžiai...",
        noSkillsFound: "Nėra atitikčių jūsų paieškai.",
        categories: {
          search: {
            title: "Paieškos ir skaitymas el. paštą",
            description:
              "Paieškokite ir skaitykite el. pašto laiškus iš savo Outlook sąrašo",
          },
          drafts: {
            title: "Pasiūlytų el. pašto laiškų",
            description: "Sukurkite, redaguo, ir valdykite el. pašto rašinius.",
          },
          send: {
            title: "Siųstis el. pašto žinutes",
            description:
              "Siųkite naujus el. laiškus arba atsakykite į pranešimus nedelskant",
          },
          account: {
            title: "Integracijos statistika",
            description:
              "Peržiūrėkite pašto dėžės statistikos ir sąskaitos informaciją.",
          },
        },
        skills: {
          getInbox: {
            title: "Peržiūrėti pašto dėžę",
            description:
              "Gaukite naujausius el. pašto laiškus iš savo Outlook sąvejos.",
          },
          search: {
            title: "Paieškos el. paštu",
            description:
              "Paieškokite el. laiškus naudodami „Microsoft Search“ sintaksę.",
          },
          readThread: {
            title: "Perskaitykite pokalbį",
            description: "Perskaitykite visą el. pašto pokalbio seką.",
          },
          createDraft: {
            title: "Sukurti projekto variantą",
            description:
              "Sukurkite naują el. pašto projekto arba atsakymo projekto į esamą pranešimą.",
          },
          updateDraft: {
            title: "Paskaitos projekto atnaujinimas",
            description: "Atnaujinkite esamą el. pašto projekto",
          },
          listDrafts: {
            title: "Paskaitų planas",
            description: "Parodykite visus projekto el. laiškus",
          },
          deleteDraft: {
            title: "Ištrinkti projekto",
            description: "Ištrinkite projekto el. laišką",
          },
          sendDraft: {
            title: "Siųstis projekto",
            description: "Siųstis jau esančią el. pašto projekto versiją",
          },
          sendEmail: {
            title: "Siųstis el. paštą",
            description:
              "Siųstinkite naują el. laišką arba atsakykite į esamą pranešimą nedelsdami.",
          },
          getMailboxStats: {
            title: "Pašto dėžės statistika",
            description:
              "Gaukite folderių skaičius ir pašto dėžutės statistikos duomenis.",
          },
        },
      },
      googleCalendar: {
        title: "„Google Kalendoriaus“ integracija",
        description:
          "Įgalinkite savo agentą, kad galėtų bendradarbiauti su „Google Calendar“ – peržiūrėti kalendorius, gauti renginių informaciją, kurti ir atnaujinti renginius bei tvarkyti patvirtimus. <a>Peržiūrėkite dokumentaciją</a>.",
        multiUserWarning:
          "„Google Kalendro“ integracija negali būti naudojama kelių vartotojų režimu dėl saugumo priežasčių. Norėdami naudoti šią funkciją, prašome išjungti kelių vartotojų režimą.",
        configuration: "„Google Kalendoriaus“ konfigūracija",
        deploymentId: "Įrenginio ID",
        deploymentIdHelp: "Jūsų „Google Apps Script“ svetainės programos ID",
        apiKey: "API raktas",
        apiKeyHelp:
          "„API raktas“, kurį konfigūravoje savo „Google Apps Script“ programoje.",
        configurationRequired:
          "Prašome nustatyti „Deployment ID“ ir API raktą, kad būtų įgalintos „Google Calendar“ funkcijos.",
        configured: "Nustatytas",
        searchSkills: "Paieškos įgūdžiai...",
        noSkillsFound: "Nėra atitikčių jūsų paieškos kriterijams.",
        categories: {
          calendars: {
            title: "Kalendoriai",
            description: "Peržiūrėkite ir valdykite savo „Google Kalendorius“.",
          },
          readEvents: {
            title: "Peržiūrėti renginius",
            description: "Peržiūrėkite ir paieškokite kalendoriaus renginių",
          },
          writeEvents: {
            title: "Sukurkite ir atnaujinkite renginius",
            description: "Sukurkite naujas renginius ir keičkite esamus",
          },
          rsvp: {
            title: "Patvirtinimų valdymas",
            description: "Valdykite savo atsakymo statusą renginiams",
          },
        },
        skills: {
          listCalendars: {
            title: "Kalendoriai",
            description:
              "Peržiūrėkite visus kalendorius, kuriuos turite arba kuriems yra prenumerata.",
          },
          getCalendar: {
            title: "Gaukite kalendoriaus detales",
            description:
              "Gaukite išsamią informaciją apie konkrečią kalendorių",
          },
          getEvent: {
            title: "Gaukite renginį",
            description: "Gaukite išsamią informaciją apie konkrečią renginį",
          },
          getEventsForDay: {
            title: "Rasti renginius šiam dienai",
            description: "Gaukite visus įvykius, numatytus konkrečią dieną.",
          },
          getEvents: {
            title: "Rodyti renginius (laiko intervalas)",
            description: "Gauti renginius už nurodytą datų intervalą",
          },
          getUpcomingEvents: {
            title: "Peržiūrėti ateinančias renginius",
            description:
              "Raskite renginius šiandien, šią savaitę arba šį mėnesį naudodami paprastus žodžius.",
          },
          quickAdd: {
            title: "Greitas renginio pridėjimas",
            description:
              "Sukurkite renginį iš natūralios kalbos (pvz., „Susitikimas rytoj 15:00 val.“)",
          },
          createEvent: {
            title: "Sukurti renginį",
            description:
              "Sukurkite naują renginį, turėdami visišką kontrolę per visas jo savybes.",
          },
          updateEvent: {
            title: "Paskelbimo atnaujinimas",
            description: "Redaguoti esamą kalendoriaus renginį",
          },
          setMyStatus: {
            title: "Nurodykite atsakymo statusą",
            description:
              "Prisitaikyti, atsisakyti arba iš esmės pritarti renginiui.",
          },
        },
      },
    },
    mcp: {
      title: "MCP serveriai",
      "loading-from-config": "MCP serveriai kraunami iš konfigūracijos failo",
      "learn-more": "Sužinokite daugiau apie MCP serverius.",
      "no-servers-found": "MCP serverių nerasta",
      "tool-warning":
        "Norėdami pasiekti geriausią našumą, apsvarstykite galimybę išjungti nereikalingus įrankius, kad tausotumėte kontekstą.",
      "tools-enabled": "įrankiai įjungti",
      "stop-server": "Sustabdyti MCP serverį",
      "start-server": "Paleisti MCP serverį",
      "delete-server": "Ištrinti MCP serverį",
      "tool-count-warning":
        "Šis MCP serveris turi <b>{{count}} įjungtus įrankius</b>, kurie naudos kontekstą kiekviename pokalbyje.<br />Apsvarstykite galimybę išjungti nereikalingus įrankius, kad tausotumėte kontekstą.",
      "startup-command": "Paleidimo komanda",
      command: "Komanda",
      arguments: "Argumentai",
      "not-running-warning":
        "Šis MCP serveris neveikia - jis gali būti sustabdytas arba įvyko klaida jį paleidžiant.",
      "tool-call-arguments": "Įrankio iškvietimo argumentai",
    },
    settings: {
      title: "Agento įgūdžių nustatymai",
      "max-tool-calls": {
        title: "Maksimalus įrankių iškvietimų kiekis vienam atsakymui",
        description:
          "Maksimalus įrankių skaičius, kurį agentas gali iškviesti paeiliui vienam atsakymui generuoti. Tai apsaugo nuo nekontroliuojamų iškvietimų ir begalinių ciklų.",
      },
      "intelligent-skill-selection": {
        title: "Išmanusis įgūdžių pasirinkimas",
        "beta-badge": "Beta",
        description:
          "Įjunkite neribotą kiekį įrankių ir sumažinkite žetonų (tokens) naudojimą iki 80 % vienai užklausai — AnythingLLM automatiškai parinks tinkamus įgūdžiai kiekvienai užklausai.",
        "max-tools": {
          title: "Maksimalus įrankių kiekis",
          description:
            "Maksimalus įrankių skaičius, kurį galima parinkti kiekvienai užklausai. Rekomenduojame nustatyti didesnes reikšmes didelio konteksto modeliams.",
        },
      },
    },
  },
  recorded: {
    title: "Darbo srities pokalbiai",
    description:
      "Tai visi įrašyti pokalbiai ir žinutės, kuriuos siuntė vartotojai, surūšiuoti pagal jų sukūrimo datą.",
    export: "Eksportuoti",
    table: {
      id: "ID",
      by: "Siuntėjas",
      workspace: "Darbo sritis",
      prompt: "Užklausa",
      response: "Atsakymas",
      at: "Išsiųsta",
    },
  },
  customization: {
    interface: {
      title: "Sąsajos nustatymai",
      description: "Nustatykite savo AnythingLLM sąsajos nustatymus.",
    },
    branding: {
      title: "Prekės ženklas",
      description:
        "Pritaikykite savo AnythingLLM instanciją naudodami savo prekės ženklą.",
    },
    chat: {
      title: "Pokalbiai",
      description: "Nustatykite savo AnythingLLM pokalbių nustatymus.",
      auto_submit: {
        title: "Automatinis balso įvesties pateikimas",
        description: "Automatiškai pateikti balso įvestį po tylos periodo",
      },
      auto_speak: {
        title: "Automatinis atsakymų įgarsinimas",
        description: "Automatiškai įgarsinti AI atsakymus",
      },
      spellcheck: {
        title: "Įjungti rašybos tikrinimą",
        description:
          "Įjungti arba išjungti rašybos tikrinimą pokalbio įvesties lauke",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Pasirinkite pageidaujamą programos spalvų temą.",
      },
      "show-scrollbar": {
        title: "Rodyti slinkties juostą",
        description: "Įjungti arba išjungti slinkties juostą pokalbio lange.",
      },
      "support-email": {
        title: "Pagalbos el. paštas",
        description:
          "Nustatykite pagalbos el. pašto adresą, kuriuo vartotojai galėtų kreiptis prireikus pagalbos.",
      },
      "app-name": {
        title: "Pavadinimas",
        description:
          "Nustatykite pavadinimą, kuris rodomas prisijungimo puslapyje visiems vartotojams.",
      },
      "display-language": {
        title: "Rodymo kalba",
        description:
          "Pasirinkite pageidaujamą AnythingLLM sąsajos kalbą (jei yra vertimai).",
      },
      logo: {
        title: "Prekės ženklo logotipas",
        description:
          "Įkelkite savo logotipą, kuris bus rodomas visuose puslapiuose.",
        add: "Pridėti logotipą",
        recommended: "Rekomenduojamas dydis: 800 x 200",
        remove: "Pašalinti",
        replace: "Pakeisti",
      },
      "browser-appearance": {
        title: "Naršyklės išvaizda",
        description:
          "Pritaikykite naršyklės kortelės išvaizdą ir pavadinimą, kai programa atidaryta.",
        tab: {
          title: "Pavadinimas",
          description:
            "Nustatykite kortelės pavadinimą, kai programa atidaryta naršyklėje.",
        },
        favicon: {
          title: "Favicon",
          description: "Naudokite savo piktogramą naršyklės kortelei.",
        },
      },
      "sidebar-footer": {
        title: "Šoninės juostos apačios elementai",
        description:
          "Pritaikykite elementus, rodomus šoninės juostos apačioje.",
        icon: "Piktograma",
        link: "Nuoroda",
      },
      "render-html": {
        title: "Atvaizduoti HTML pokalbyje",
        description:
          "Atvaizduoti HTML kodą asistento atsakymuose.\nTai gali užtikrinti geresnę atsakymų vizualinę kokybę, tačiau taip pat gali kelti saugumo riziką.",
      },
    },
  },
  api: {
    title: "API raktai",
    description:
      "API raktai leidžia programiškai pasiekti ir valdyti šią AnythingLLM instanciją.",
    link: "Skaityti API dokumentaciją",
    generate: "Generuoti naują API raktą",
    empty: "API raktų nerasta",
    actions: "Veiksmai",
    messages: {
      error: "Klaida: {{error}}",
    },
    modal: {
      title: "Sukurti naują API raktą",
      cancel: "Atšaukti",
      close: "Uždaryti",
      create: "Sukurti API raktą",
      helper:
        "Sukūrus API raktą, jį galima naudoti programiškai pasiekti ir konfigūruoti šį AnythingLLM egzempliorių.",
      name: {
        label: "Pavadinimas",
        placeholder: "Produkcinė integracija",
        helper:
          "Neprivaloma. Naudokite aiškų pavadinimą, kad vėliau lengvai atpažintumėte šį raktą.",
      },
    },
    row: {
      copy: "Kopijuoti API raktą",
      copied: "Nukopijuota",
      unnamed: "--",
      deleteConfirm:
        "Ar tikrai norite išjungti šį API raktą?\nPo to jo nebebus galima naudoti.\n\nŠio veiksmo atšaukti negalima.",
    },
    table: {
      name: "Pavadinimas",
      key: "API raktas",
      by: "Sukūrė",
      created: "Sukurta",
    },
  },
  llm: {
    title: "LLM pasirinkimas",
    description:
      "Tai jūsų pasirinkto LLM pokalbių ir vektorių kūrimo tiekėjo duomenys ir nustatymai. Svarbu, kad šie raktai būtų aktualūs ir teisingi, kitaip AnythingLLM neveiks tinkamai.",
    provider: "LLM tiekėjas",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure paslaugos galinis taškas (Endpoint)",
        api_key: "API raktas",
        chat_deployment_name: "Chat diegimo pavadinimas",
        chat_model_token_limit: "Chat modelio žetonų (Token) limitas",
        model_type: "Modelio tipas",
        model_type_tooltip:
          "Jei jūsų diegimas naudoja mąstymo modelį (o1, o1-mini, o3-mini ir kt.), nustatykite „Reasoning“. Priešingu atveju jūsų užklausos gali nepavykti.",
        default: "Numatytasis",
        reasoning: "Mąstymo (Reasoning)",
      },
    },
  },
  transcription: {
    title: "Transkripcijos modelio pasirinkimas",
    description:
      "Tai jūsų pageidaujamo transkripcijos modelio tiekėjo duomenys ir nustatymai. Svarbu, kad šie raktai būtų aktualūs ir teisingi, kitaip medijos failai ir garsas nebus transkribuojami.",
    provider: "Transkripcijos tiekėjas",
    "warn-start":
      "Naudojant vietinį Whisper modelį įrenginiuose su ribotu RAM ar CPU kiekiu, AnythingLLM gali sulėtėti apdorojant medijos failus.",
    "warn-recommend": "Rekomenduojame bent 2 GB RAM ir įkelti failus <10 MB.",
    "warn-end":
      "Integruotas modelis bus automatiškai atsisiųstas pirmo naudojimo metu.",
  },
  embedding: {
    title: "Vektorių kūrimo (Embedding) pasirinkimas",
    "desc-start":
      "Naudojant LLM, kuris natūraliai nepalaiko vektorių kūrimo variklio - jums gali tekti papildomai nurodyti duomenis tekstui paversti vektoriais.",
    "desc-end":
      "Vektorių kūrimas (embedding) yra procesas, paverčiantis tekstą skaitmeniniais vektoriais. Šie duomenys reikalingi norint paversti jūsų failus ir užklausas į formatą, kurį AnythingLLM gali apdoroti.",
    provider: {
      title: "Vektorių tiekėjas",
    },
  },
  text: {
    title: "Teksto skaidymo ir fragmentavimo nustatymai",
    "desc-start":
      "Kartais galite norėti pakeisti numatytąjį būdą, kaip nauji dokumentai skaidomi į fragmentus prieš įkeliant juos į vektorių duomenų bazę.",
    "desc-end":
      "Šį nustatymą turėtumėte keisti tik jei suprantate, kaip veikia teksto skaidymas ir kokie jo šalutiniai poveikiai.",
    size: {
      title: "Teksto fragmento dydis",
      description:
        "Tai maksimalus simbolių skaičius, kuris gali būti viename vektoriuje.",
      recommend: "Maksimalus vektorių modelio ilgis yra",
    },
    overlap: {
      title: "Teksto fragmentų persidengimas",
      description:
        "Tai maksimalus simbolių kiekis, kuris persidengia tarp dviejų gretimų teksto fragmentų.",
    },
  },
  vector: {
    title: "Vektorių duomenų bazė",
    description:
      "Tai nustatymai, kaip veiks jūsų AnythingLLM instancija. Svarbu, kad šie duomenys būtų aktualūs ir teisingi.",
    provider: {
      title: "Vektorių duomenų bazės tiekėjas",
      description: "LanceDB papildomos konfigūracijos nereikia.",
    },
  },
  embeddable: {
    title: "Įterpiami pokalbių valdikliai",
    description:
      "Įterpiami pokalbių valdikliai yra viešos pokalbių sąsajos, susietos su viena darbo sritimi. Tai leidžia kurti darbo sritis, kurias vėliau galite paskelbti pasauliui.",
    create: "Sukurti įskiepį",
    table: {
      workspace: "Darbo sritis",
      chats: "Išsiųsti pokalbiai",
      active: "Aktyvūs domenai",
      created: "Sukurta",
    },
  },
  "embed-chats": {
    title: "Įterptų valdiklių pokalbių istorija",
    export: "Eksportuoti",
    description:
      "Tai visi įrašyti pokalbiai ir žinutės iš bet kurio jūsų paskelbto įskiepio.",
    table: {
      embed: "Įskiepis",
      sender: "Siuntėjas",
      message: "Žinutė",
      response: "Atsakymas",
      at: "Išsiųsta",
    },
  },
  security: {
    title: "Saugumas",
    multiuser: {
      title: "Daugiavartotojiškas režimas",
      description:
        "Paruoškite savo instanciją komandiniam darbui įjungdami daugiavartotojišką režimą.",
      enable: {
        "is-enable": "Daugiavartotojiškas režimas įjungtas",
        enable: "Įjungti daugiavartotojišką režimą",
        description:
          "Pagal numatytuosius nustatymus būsite vienintelis administratorius. Kaip administratorius turėsite sukurti paskyras visiems naujiems vartotojams ar administratoriams. Nepraraskite slaptažodžio, nes tik administratorius gali juos atstatyti.",
        username: "Administratoriaus vartotojo vardas",
        password: "Administratoriaus slaptažodis",
      },
    },
    password: {
      title: "Apsauga slaptažodžiu",
      description:
        "Apsaugokite savo AnythingLLM instanciją slaptažodžiu. Jei jį pamiršite, atkūrimo būdo nėra, todėl būtinai jį išsisaugokite.",
      "password-label": "Sistemos slaptažodis",
    },
  },
  event: {
    title: "Įvykių žurnalas",
    description:
      "Peržiūrėkite visus šioje instancijoje vykstančius veiksmus ir įvykius stebėjimui.",
    clear: "Išvalyti įvykių žurnalą",
    table: {
      type: "Įvykio tipas",
      user: "Vartotojas",
      occurred: "Įvyko",
    },
  },
  privacy: {
    title: "Privatumas ir duomenų tvarkymas",
    description:
      "Tai jūsų konfigūracija, kaip prijungti trečiųjų šalių tiekėjai ir AnythingLLM tvarko jūsų duomenis.",
    anonymous: "Anoniminė telemetrija įjungta",
  },
  connectors: {
    "search-placeholder": "Ieškoti duomenų jungčių",
    "no-connectors": "Duomenų jungčių nerasta.",
    obsidian: {
      vault_location: "Vault vieta",
      vault_description:
        "Pasirinkite savo Obsidian vault aplanką, kad importuotumėte visus užrašus ir jų sąsajas.",
      selected_files: "Rasta {{count}} markdown failų",
      importing: "Importuojama...",
      import_vault: "Importuoti Vault",
      processing_time: "Tai gali užtrukti priklausomai nuo jūsų vault dydžio.",
      vault_warning:
        "Norėdami išvengti konfliktų, įsitikinkite, kad jūsų Obsidian vault šiuo metu nėra atidarytas.",
    },
    github: {
      name: "GitHub repozitorija",
      description:
        "Vienu spustelėjimu importuokite visą viešą arba privačią GitHub repozitoriją.",
      URL: "GitHub repozitorijos URL",
      URL_explained: "GitHub repozitorijos, kurią norite nuskaityti, adresas.",
      token: "GitHub prieigos raktas",
      optional: "neprivaloma",
      token_explained: "Prieigos raktas, skirtas išvengti užklausų limitų.",
      token_explained_start: "Be ",
      token_explained_link1: "Asmeninio prieigos rakto",
      token_explained_middle:
        ", GitHub API gali apriboti nuskaitomų failų skaičių. Galite ",
      token_explained_link2: "sukurti laikiną prieigos raktą",
      token_explained_end: " šiai problemai išspręsti.",
      ignores: "Ignoruojami failai",
      git_ignore:
        "Sąrašas .gitignore formatu, skirtas ignoruoti konkrečius failus nuskaitymo metu. Po kiekvieno įrašo paspauskite Enter.",
      task_explained:
        "Baigus, visi failai bus prieinami įkėlimui į darbo sritis per dokumentų pasirinkimo langą.",
      branch: "Šaka (branch), iš kurios norite nuskaityti failus.",
      branch_loading: "-- kraunamos prieinamos šakos --",
      branch_explained: "Šaka, iš kurios norite nuskaityti failus.",
      token_information:
        "Neužuodę <b>GitHub prieigos rakto</b> ši duomenų jungtis galės nuskaityti tik <b>aukščiausio lygio</b> repozitorijos failus dėl GitHub viešų API užklausų limitų.",
      token_personal:
        "Gaukite nemokamą asmeninį prieigos raktą savo GitHub paskyroje čia.",
    },
    gitlab: {
      name: "GitLab repozitorija",
      description:
        "Vienu spustelėjimu importuokite visą viešą arba privačią GitLab repozitoriją.",
      URL: "GitLab repozitorijos URL",
      URL_explained: "GitLab repozitorijos, kurią norite nuskaityti, adresas.",
      token: "GitLab prieigos raktas",
      optional: "neprivaloma",
      token_description:
        "Pasirinkite papildomus elementus, kuriuos norite gauti iš GitLab API.",
      token_explained_start: "Be ",
      token_explained_link1: "Asmeninio prieigos rakto",
      token_explained_middle:
        ", GitLab API gali apriboti nuskaitomų failų skaičių. Galite ",
      token_explained_link2: "sukurti laikiną prieigos raktą",
      token_explained_end: " šiai problemai išspręsti.",
      fetch_issues: "Importuoti „Issues“ kaip dokumentus",
      ignores: "Ignoruojami failai",
      git_ignore:
        "Sąrašas .gitignore formatu, skirtas ignoruoti konkrečius failus nuskaitymo metu. Po kiekvieno įrašo paspauskite Enter.",
      task_explained:
        "Baigus, visi failai bus prieinami įkėlimui į darbo sritis per dokumentų pasirinkimo langą.",
      branch: "Šaka, iš kurios norite nuskaityti failus",
      branch_loading: "-- kraunamos prieinamos šakos --",
      branch_explained: "Šaka, iš kurios norite nuskaityti failus.",
      token_information:
        "Neužuodę <b>GitLab prieigos rakto</b> ši duomenų jungtis galės nuskaityti tik <b>aukščiausio lygio</b> repozitorijos failus dėl GitLab viešų API užklausų limitų.",
      token_personal:
        "Gaukite nemokamą asmeninį prieigos raktą savo GitLab paskyroje čia.",
    },
    youtube: {
      name: "YouTube transkripcija",
      description:
        "Importuokite viso YouTube vaizdo įrašo transkripciją iš nuorodos.",
      URL: "YouTube vaizdo įrašo URL",
      URL_explained_start:
        "Įveskite bet kurio YouTube vaizdo įrašo URL transkripcijai gauti. Vaizdo įrašas privalo turėti ",
      URL_explained_link: "subtitrus",
      URL_explained_end: ".",
      task_explained:
        "Baigus, transkripcija bus prieinama įkėlimui į darbo sritis per dokumentų pasirinkimo langą.",
    },
    "website-depth": {
      name: "Masinis nuorodų nuskaitymas",
      description:
        "Nuskaitykite svetainę ir jos sub-nuorodas iki tam tikro gylio.",
      URL: "Svetainės URL",
      URL_explained: "Svetainės, kurią norite nuskaityti, URL.",
      depth: "Nuskaitymo gylis",
      depth_explained:
        "Tai yra sub-nuorodų lygių skaičius, kuriuos programa turėtų sekti nuo pradinio URL.",
      max_pages: "Maksimalus puslapių skaičius",
      max_pages_explained: "Maksimalus nuskaitomų nuorodų skaičius.",
      task_explained:
        "Baigus, visas nuskaitytas turinys bus prieinamas įkėlimui į darbo sritis per dokumentų pasirinkimo langą.",
    },
    confluence: {
      name: "Confluence",
      description: "Vienu spustelėjimu importuokite visą Confluence puslapį.",
      deployment_type: "Confluence diegimo tipas",
      deployment_type_explained:
        "Nurodykite, ar jūsų Confluence instancija yra Atlassian debesyje, ar savarankiškai talpinama.",
      base_url: "Confluence bazinis URL",
      base_url_explained: "Tai yra jūsų Confluence erdvės bazinis URL.",
      space_key: "Confluence erdvės raktas",
      space_key_explained:
        "Tai yra Confluence instancijos erdvės raktas, kuris bus naudojamas. Paprastai prasideda ~",
      username: "Confluence vartotojo vardas",
      username_explained: "Jūsų Confluence vartotojo vardas",
      auth_type: "Confluence autentifikacijos tipas",
      auth_type_explained:
        "Pasirinkite autentifikacijos tipą, kurį norite naudoti prieigai prie Confluence puslapių.",
      auth_type_username: "Vartotojo vardas ir prieigos raktas",
      auth_type_personal: "Asmeninis prieigos raktas",
      token: "Confluence prieigos raktas",
      token_explained_start:
        "Autentifikacijai turite pateikti prieigos raktą. Jį sugeneruoti galite",
      token_explained_link: "čia",
      token_desc: "Prieigos raktas autentifikacijai",
      pat_token: "Confluence asmeninis prieigos raktas",
      pat_token_explained: "Jūsų Confluence asmeninis prieigos raktas.",
      bypass_ssl: "Praleisti SSL sertifikato patikrą",
      bypass_ssl_explained:
        "Įjunkite šią parinktį, jei norite praleisti SSL sertifikato patikrą savarankiškai talpinamoms Confluence instancijoms su savarankiškai pasirašytu sertifikatu",
      task_explained:
        "Baigus, puslapio turinys bus prieinamas įkėlimui į darbo sritis per dokumentų pasirinkimo langą.",
    },
    manage: {
      documents: "Dokumentai",
      "data-connectors": "Duomenų jungtys",
      "desktop-only":
        "Šių nustatymų keitimas galimas tik kompiuteryje. Norėdami tęsti, prisijunkite prie šio puslapio per savo kompiuterį.",
      dismiss: "Uždaryti",
      editing: "Redaguojama",
    },
    directory: {
      "my-documents": "Mano dokumentai",
      "new-folder": "Naujas aplankas",
      "total-documents_one": "{{count}} dokumentas",
      "total-documents_other": "{{count}} dokumentai",
      "search-document": "Ieškoti dokumento",
      "no-documents": "Dokumentų nėra",
      "move-workspace": "Perkelti į darbo sritį",
      "delete-confirmation":
        "Ar tikrai norite ištrinti šiuos failus ir aplankus?\nTai pašalins failus iš sistemos ir automatiškai pašalins juos iš visų esamų darbo sričių.\nŠis veiksmas yra negrįžtamas.",
      "removing-message":
        "Šalinama {{count}} dokumentų ir {{folderCount}} aplankų. Palaukite.",
      "move-success": "Sėkmingai perkelta {{count}} dokumentų.",
      no_docs: "Dokumentų nėra",
      select_all: "Žymėti viską",
      deselect_all: "Atžymėti viską",
      remove_selected: "Šalinti pažymėtus",
      save_embed: "Išsaugoti ir kurti vektorius",
    },
    upload: {
      "processor-offline": "Dokumentų procesorius nepasiekiamas",
      "processor-offline-desc":
        "Šiuo metu negalime įkelti jūsų failų, nes dokumentų procesorius nepasiekiamas. Bandykite vėliau.",
      "click-upload": "Spustelėkite, kad įkeltumėte, arba įtempkite",
      "file-types":
        "palaiko tekstinius failus, csv, skaičiuokles, garso failus ir dar daugiau!",
      "or-submit-link": "arba pateikite nuorodą",
      "placeholder-link": "https://pavyzdys.lt",
      fetching: "Atsiunčiama...",
      "fetch-website": "Gauti svetainę",
      "privacy-notice":
        "Šie failai bus įkelti į dokumentų procesorių, veikiantį šioje AnythingLLM instancijoje. Šie failai nėra siunčiami ar bendrinami su trečiosiomis šalimis.",
    },
    pinning: {
      what_pinning: "Kas yra dokumento prisegimas?",
      pin_explained_block1:
        "Kai <b>prisegate</b> dokumentą AnythingLLM sistemoje, mes įtrauksime visą dokumento turinį į jūsų užklausos langą, kad jūsų LLM jį visiškai suprastų.",
      pin_explained_block2:
        "Tai geriausiai veikia su <b>didelio konteksto modeliais</b> arba mažais failais, kurie yra labai svarbūs žinių bazei.",
      pin_explained_block3:
        "Jei pagal numatytuosius nustatymus negaunate pageidaujamų atsakymų iš AnythingLLM, prisegimas yra puikus būdas gauti aukštesnės kokybės atsakymus vienu spustelėjimu.",
      accept: "Gerai, supratau",
    },
    watching: {
      what_watching: "Ką daro dokumento stebėjimas?",
      watch_explained_block1:
        "Kai <b>stebite</b> dokumentą AnythingLLM sistemoje, mes <i>automatiškai</i> sinchronizuosime jūsų dokumento turinį iš originalaus šaltinio reguliariais intervalais. Tai automatiškai atnaujins turinį kiekvienoje darbo srityje, kurioje šis failas yra valdomas.",
      watch_explained_block2:
        "Ši funkcija šiuo metu palaiko internetinį turinį ir nebus prieinama rankiniu būdu įkeltiems dokumentams.",
      watch_explained_block3_start:
        "Galite valdyti, kokie dokumentai yra stebimi, ",
      watch_explained_block3_link: "Failų vadybininko",
      watch_explained_block3_end: " administratoriaus peržiūroje.",
      accept: "Gerai, supratau",
    },
  },
  chat_window: {
    attachments_processing: "Priedai apdorojami. Palaukite...",
    send_message: "Rašyti žinutę",
    attach_file: "Pridėti failą prie šio pokalbio",
    text_size: "Keisti teksto dydį.",
    microphone: "Įgarsinti savo užklausą.",
    send: "Siųsti užklausą į darbo sritį",
    tts_speak_message: "Garsinis žinutės skaitymas",
    copy: "Kopijuoti",
    regenerate: "Sugeneruoti iš naujo",
    regenerate_response: "Sugeneruoti atsakymą iš naujo",
    good_response: "Geras atsakymas",
    more_actions: "Daugiau veiksmų",
    sources: "Šaltiniai",
    source_count_one: "{{count}} nuoroda",
    source_count_other: "{{count}} nuorodos",
    document: "Dokumentas",
    similarity_match: "atitikimas",
    fork: "Atskirti (Fork)",
    delete: "Ištrinti",
    cancel: "Atšaukti",
    submit: "Pateikti",
    edit_prompt: "Redaguoti užklausą",
    edit_response: "Redaguoti atsakymą",
    edit_info_user:
      "„Pateikti“ sugeneruoja DI atsakymą iš naujo. „Išsaugoti“ atnaujina tik jūsų žinutę.",
    edit_info_assistant:
      "Jūsų pakeitimai bus išsaugoti tiesiogiai šiame atsakyme.",
    see_less: "Rodyti mažiau",
    see_more: "Rodyti daugiau",
    preset_reset_description:
      "Išvalyti pokalbių istoriją ir pradėti naują pokalbį",
    preset_exit_description: "Sustabdyti esamą agento sesiją",
    add_new_preset: " Pridėti naują šabloną",
    add_new: "Pridėti naują",
    edit: "Redaguoti",
    publish: "Paskelbti",
    stop_generating: "Sustabdyti atsakymo generavimą",
    command: "Komanda",
    your_command: "tavo-komanda",
    placeholder_prompt:
      "Tai yra turinis, kuris bus pridėtas prieš jūsų užklausą.",
    description: "Aprašymas",
    placeholder_description: "Atsako eilėraščiu apie LLM.",
    save: "Išsaugoti",
    small: "Mažas",
    normal: "Normalus",
    large: "Didelis",
    tools: "Įrankiai",
    text_size_label: "Teksto dydis",
    select_model: "Pasirinkti modelį",
    slash_commands: "Komandos su „/“",
    agent_skills: "Agento įgūdžiai",
    manage_agent_skills: "Valdyti agento įgūdžius",
    start_agent_session: "Pradėti agento sesiją",
    agent_skills_disabled_in_session:
      "Negalima keisti įgūdžių aktyvios agento sesijos metu. Naudokite /exit, kad pirmiausia užbaigtumėte sesiją.",
    use_agent_session_to_use_tools:
      "Įrankius pokalbyje galite naudoti pradėdami agento sesiją su „@agent“ savo užklausos pradžioje.",
    workspace_llm_manager: {
      search: "Paieška",
      loading_workspace_settings: "Kraunami darbo srities nustatymai...",
      available_models: "Prieinami modeliai tiekėjui {{provider}}",
      available_models_description:
        "Pasirinkite modelį, kurį naudosite šiai darbo sričiai.",
      save: "Naudoti šį modelį",
      saving: "Nustatomas modelis kaip numatytasis darbo sričiai...",
      missing_credentials: "Šiam tiekėjui trūksta duomenų!",
      missing_credentials_description: "Nustatyti dabar",
    },
    agent_invocation: {
      model_wants_to_call: "Modelis nori paskambinti",
      approve: "Patvirtinti",
      reject: "Atmetti",
      always_allow: "Visada būkite pasiruošę {{skillName}}",
      tool_call_was_approved: "Įrankių užsakymas buvo patvirtintas.",
      tool_call_was_rejected: "Klausimas dėl įrankio buvo atmetamas.",
    },
    custom_skills: "Individualūs įgūdžiai",
    agent_flows: "Agentų srautai",
    no_tools_found: "Nėra rasti atitikusių įrankių.",
    loading_mcp_servers: "Įkrauname MCP serverius...",
    app_integrations: "Programų integracijos",
    sub_skills: "Pagrindinės įgūdžios",
  },
  profile_settings: {
    edit_account: "Redaguoti paskyrą",
    profile_picture: "Profilio nuotrauka",
    remove_profile_picture: "Pašalinti profilio nuotrauką",
    username: "Vartotojo vardas",
    new_password: "Naujas slaptažodis",
    password_description: "Slaptažodis turi būti bent 8 simbolių ilgio",
    cancel: "Atšaukti",
    update_account: "Atnaujinti paskyrą",
    theme: "Temos nustatymas",
    language: "Pageidaujama kalba",
    failed_upload: "Nepavyko įkelti profilio nuotraukos: {{error}}",
    upload_success: "Profilio nuotrauka įkelta.",
    failed_remove: "Nepavyko pašalinti profilio nuotraukos: {{error}}",
    profile_updated: "Profilis atnaujintas.",
    failed_update_user: "Nepavyko atnaujinti vartotojo: {{error}}",
    account: "Paskyra",
    support: "Pagalba",
    signout: "Atsijungti",
  },
  "keyboard-shortcuts": {
    title: "Klaviatūros trumpiniai",
    shortcuts: {
      settings: "Atidaryti nustatymus",
      workspaceSettings: "Atidaryti esamos darbo srities nustatymus",
      home: "Grįžti į pradžią",
      workspaces: "Valdyti darbo sritis",
      apiKeys: "API raktų nustatymai",
      llmPreferences: "LLM nustatymai",
      chatSettings: "Pokalbių nustatymai",
      help: "Rodyti klaviatūros trumpinių pagalbą",
      showLLMSelector: "Rodyti darbo srities LLM parinkiklį",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Pavyko!",
        success_description:
          "Jūsų sistemos instrukcija paskelbta bendruomenės centre!",
        success_thank_you: "Ačiū, kad dalinatės su bendruomene!",
        view_on_hub: "Peržiūrėti bendruomenės centre",
        modal_title: "Paskelbti sistemos instrukciją",
        name_label: "Pavadinimas",
        name_description:
          "Tai yra jūsų sistemos instrukcijos rodomas pavadinimas.",
        name_placeholder: "Mano sistemos instrukcija",
        description_label: "Aprašymas",
        description_description:
          "Tai yra jūsų sistemos instrukcijos aprašymas. Naudokite jį instrukcijos paskirčiai aprašyti.",
        tags_label: "Žymos",
        tags_description:
          "Žymos naudojamos sistemos instrukcijai ženklinti, kad būtų lengviau ieškoti. Galite pridėti kelias žymas. Maks. 5 žymos. Maks. 20 simbolių vienai žymai.",
        tags_placeholder:
          "Įrašykite ir paspauskite Enter, kad pridėtumėte žymas",
        visibility_label: "Matomumas",
        public_description: "Viešos sistemos instrukcijos matomos visiems.",
        private_description:
          "Privačios sistemos instrukcijos matomos tik jums.",
        publish_button: "Paskelbti bendruomenės centre",
        submitting: "Skelbiama...",
        prompt_label: "Instrukcija",
        prompt_description:
          "Tai yra tikroji sistemos instrukcija, kuri va bus naudojama LLM valdymui.",
        prompt_placeholder: "Įveskite savo sistemos instrukciją čia...",
      },
      agent_flow: {
        success_title: "Pavyko!",
        success_description:
          "Jūsų agento srautas paskelbtas bendruomenės centre!",
        success_thank_you: "Ačiū, kad dalinatės su bendruomene!",
        view_on_hub: "Peržiūrėti bendruomenės centre",
        modal_title: "Paskelbti agento srautą",
        name_label: "Pavadinimas",
        name_description: "Tai yra jūsų agento srauto rodomas pavadinimas.",
        name_placeholder: "Mano agento srautas",
        description_label: "Aprašymas",
        description_description:
          "Tai yra jūsų agento srauto aprašymas. Naudokite jį srauto paskirčiai aprašyti.",
        tags_label: "Žymos",
        tags_description:
          "Žymos naudojamos agento srautui ženklinti, kad būtų lengviau ieškoti. Galite pridėti kelias žymas. Maks. 5 žymos. Maks. 20 simbolių vienai žymai.",
        tags_placeholder:
          "Įrašykite ir paspauskite Enter, kad pridėtumėte žymas",
        visibility_label: "Matomumas",
        submitting: "Skelbiama...",
        submit: "Paskelbti bendruomenės centre",
        privacy_note:
          "Agentų srautai visada įkeliami kaip privatūs, kad būtų apsaugoti visi jautrūs duomenys. Matomumą bendruomenės centre galite pakeisti po paskelbimo. Prieš skelbdami patikrinkite, ar jūsų sraute nėra jokios jautrios ar privačios informacijos.",
      },
      slash_command: {
        success_title: "Pavyko!",
        success_description: "Jūsų komanda paskelbta bendruomenės centre!",
        success_thank_you: "Ačiū, kad dalinatės su bendruomene!",
        view_on_hub: "Peržiūrėti bendruomenės centre",
        modal_title: "Paskelbti „/“ komandą",
        name_label: "Pavadinimas",
        name_description: "Tai yra jūsų komandos rodomas pavadinimas.",
        name_placeholder: "Mano komanda",
        description_label: "Aprašymas",
        description_description:
          "Tai yra jūsų komandos aprašymas. Naudokite jį komandos paskirčiai aprašyti.",
        tags_label: "Žymos",
        tags_description:
          "Žymos naudojamos komandai ženklinti, kad būtų lengviau ieškoti. Galite pridėti kelias žymas. Maks. 5 žymos. Maks. 20 simbolių vienai žymai.",
        tags_placeholder:
          "Įrašykite ir paspauskite Enter, kad pridėtumėte žymas",
        visibility_label: "Matomumas",
        public_description: "Viešos komandos matomos visiems.",
        private_description: "Privačios komandos matomos tik jums.",
        publish_button: "Paskelbti bendruomenės centre",
        submitting: "Skelbiama...",
        prompt_label: "Užklausa",
        prompt_description:
          "Tai yra užklausa, kuri bus naudojama, kai komanda bus aktyvuota.",
        prompt_placeholder: "Įveskite savo užklausą čia...",
      },
      generic: {
        unauthenticated: {
          title: "Reikalinga autentifikacija",
          description:
            "Prieš skelbdami elementus, turite prisijungti prie AnythingLLM bendruomenės centro.",
          button: "Prisijungti prie bendruomenės centro",
        },
      },
    },
  },
  telegram: {
    title: "Telegram robotas",
    description:
      "Prisijunkite savo „AnythingLLM“ instanciją prie „Telegram“, kad galėtumėte kalbėti su savo darbo vietomis iš bet kurio įrenginio.",
    setup: {
      step1: {
        title: "1 žingsnis: Sukurkite savo Telegram botą",
        description:
          "Atidarykite @BotFather kanalą Telegram, atsiųskite `/newbot` į <code>@BotFather</code>, sekite instrukcijas ir kopijuokite API raktą.",
        "open-botfather": "Atidarykite „BotFather“",
        "instruction-1": "1. Atidarykite nuorodą arba nuskaitykite QR kodą",
        "instruction-2":
          "2. Siųkite <code>/newbot</code> adresą <code>@BotFather</code>",
        "instruction-3":
          "3. Pasirinkite pavadinimą ir vartotojo vardą savo botui.",
        "instruction-4": "4. Paškopuokite gautą API žymiklį.",
      },
      step2: {
        title: "2 etapas: Prisijunkite prie savo „bot“",
        description:
          "Įveskite API žymiklį, kurį gavote iš @BotFather, ir pasirinkite numatytą darbo vietą, kur jūsų bot galės kalbėti.",
        "bot-token": "„Bot Token“",
        connecting: "Prisijungiam...",
        "connect-bot": "„Connect Bot“",
      },
      security: {
        title: "Išvardytos saugos nustatymai",
        description:
          "Papildomos saugumo užtikrinimui, konfigūruokite šias ​​nustatymus @BotFather.",
        "disable-groups": "– Prieš pridėdamas botą į grupes",
        "disable-inline":
          "– Užtikrinkite, kad „bot“ negali būti naudojamas paieškoje.",
        "obscure-username":
          "Naudokite neatsinaužytą „bot“ vardą, kad sumažintumėte jo aptikimo galimybes.",
      },
      "toast-enter-token": "Prašome įvesti boto žymę.",
      "toast-connect-failed": "Nepavyko susieti robotą.",
    },
    connected: {
      status: "Susijęs",
      "status-disconnected":
        "Nusijungtas – žetonas gali būti neregistruotas arba netinkamas",
      "placeholder-token": "Įdiekite naują „bot“ žetoną…",
      reconnect: "Vykdyti ryšį",
      workspace: "Darbo zona",
      "bot-link": "„Bot Link“",
      "voice-response": "Garsas kaip atsakymas",
      disconnecting: "Atsijungimas...",
      disconnect: "Nutraukti ryšį",
      "voice-text-only": "Tik tekstas",
      "voice-mirror":
        "Atspindžio funkcija (atsakymas balsu, kai vartotojas siunčia balsą)",
      "voice-always":
        "Visada naudokite balsą (siųsdami garsą su kiekvienu atsakymu)",
      "toast-disconnect-failed": "Nepavyko atjungti robotą.",
      "toast-reconnect-failed": "Nepavyko atkurti ryšį su botu.",
      "toast-voice-failed": "Nepavyko atnaujinti balsinio režimo.",
      "toast-approve-failed": "Nepavyko patvirtinti vartotojo.",
      "toast-deny-failed": "Nepavyko užtikrinti vartotojo saugumo.",
      "toast-revoke-failed": "Nepavyko atšalinti vartotojo.",
    },
    users: {
      "pending-description":
        "Naudotojai, laukiantys patvirtinimo. Palyginkite čia pateiktą kodą su tuo, kuris rodomas jų „Telegram“ pokalbyje.",
      unknown: "Nenurodytas",
    },
  },
  scheduledJobs: {
    title: "Planuotos užduotys",
    enableNotifications:
      "Įgalinkite naršyklės pranešimus dėl darbo paieškos rezultatų",
    description:
      "Sukurkite nuolatines AI užduotis, kurios vyks pagal nustatytą grafiką. Kiekviena užduotis atliks užduotį su galimais įrankiais ir išsaugos rezultatą, kad galėtų būti peržiūrėta.",
    newJob: "Nauja darbo pozicija",
    loading: "Įkėlimas...",
    emptyTitle: "Nėra nurodytų uždučių.",
    emptySubtitle: "Sukurkite vieną, kad pradėtumėte.",
    table: {
      name: "Pavadinimas",
      schedule: "Programinė tvarka",
      status: "Statusas",
      lastRun: "Paskutinė kelionė",
      nextRun: "Kitas maršrutas",
      actions: "Veikmai",
    },
    confirmDelete:
      "Ar esate tikri, kad norite ištrinti šią užduotį, kurią įtraukėte į planą?",
    toast: {
      deleted: "Darbas ištrintas",
      triggered: "Darbas buvo sėkmingai inicijuotas.",
      triggerFailed: "Nepavyko inicijuoti užduoties",
      triggerSkipped: "Šis projektas jau pradėtas vykdyti.",
      killed: "Darbas sėkmingai baigtas",
      killFailed: "Nepavyko sustabdyti darbą",
    },
    row: {
      neverRun: "Niekada nesnydžkite",
      viewRuns: "Vaizdo įrašai",
      runNow: "Pradėkite dabar",
      enable: "Aaktyvinti",
      disable: "Išjungti",
      edit: "Redaguo",
      delete: "Ištrinkti",
    },
    modal: {
      titleEdit: "Redaguoti užplanuotą užduotį",
      titleNew: "Naujas planuojamas darbas",
      nameLabel: "Pavadinimas",
      namePlaceholder: "Pavyzdžiui, kasdieninė naujienų apžvalga",
      promptLabel: "Instrukcija",
      promptPlaceholder: "Instrukcija, kad reikia vykdyti kiekvieną kartą...",
      scheduleLabel: "Programėlė",
      modeBuilder: "Statybininkas",
      modeCustom: "Individualus",
      cronPlaceholder: "Laiko išraiška (pvz., 0 9 * * *)",
      currentSchedule: "Dabartinė tvarka:",
      toolsLabel: "Įrankės (neprivalomi)",
      toolsDescription:
        "Pasirinkite, kokius agento įrankius šiandiena gali naudoti. Jei nė vienas įrankis nėra pasirinktas, šiandiena veiks be jokių įrankių.",
      toolsSearch: "Paieška",
      toolsNoResults: "Nėra įrankių, kurie atitinka",
      required: "Reikalingas",
      requiredFieldsBanner:
        "Prašome užpildyti visus reikalingus laukelius, kad būtų galima sukurti darbo skelbimą.",
      cancel: "Anuliu",
      saving: "Taupymas...",
      updateJob: "Atnaujinti darbą",
      createJob: "Sukurti darbo poziciją",
      jobUpdated: "Darbas atnaujintas",
      jobCreated: "Sukurtas darbas",
    },
    builder: {
      fallbackWarning:
        'Šią frazę negalima redaguoti vizualiai. Norėdami ją išsaugoti, pasirinkite "Individualus" režimą, arba pakeiskite žemiau esančias ​​vertimes, kad ją pakeistumėte.',
      run: "Bėgti",
      frequency: {
        minute: "būdami kiekvieną minutę",
        hour: "valandinės",
        day: "kasdieninis",
        week: "kas savaitę",
        month: "kas mėnesį",
      },
      every: "Kiekvienas",
      minuteOne: "1 minutė",
      minuteOther: "{{count}} minučių",
      atMinute: "Minutė po minutės",
      pastEveryHour: "būdami kiekvieną valandą",
      at: "At",
      on: "Apie",
      onDay: "Jau",
      ofEveryMonth: "iš kiekvieno mėnesio",
      weekdays: {
        sun: "Saulė",
        mon: "Moneta",
        tue: "Trečiadienis",
        wed: "Trečiadienis",
        thu: "Ketvirtadienis",
        fri: "Penktadienis",
        sat: "Sekmadienis",
      },
    },
    runHistory: {
      back: "Grįžti į paieškas",
      title: "Paleidimo istorija: {{name}}",
      schedule: "Programinė tvarka:",
      emptyTitle: "Kol šis darbas nėra baigtas",
      emptySubtitle: "Atlikite šią užduotį dabar ir peržiūrėkite rezultatus.",
      runNow: "Pradėkite dabar",
      table: {
        status: "Statusas",
        started: "Pradėtas",
        duration: "Tr উপক",
        error: "Klaida",
      },
      stopJob: "Pamesti darbas",
    },
    runDetail: {
      loading: "Įkraudami važiavimo duomenis...",
      notFound: "Nepavyko rasti.",
      back: "Atgal",
      unknownJob: "Nenurodytas darbas",
      runHeading: "{{name}} – Treniruotė #{{id}}",
      duration: "Trūkumas: {{value}}",
      creating: "Kurimas...",
      threadFailed: "Nepavyko sukurti temą",
      sections: {
        prompt: "Įspūdis",
        error: "Klaida",
        thinking: "Mintys ({{count}})",
        toolCalls: "Naudojamų įrankių kvietimai ({{count}})",
        files: "Failai ({{count}})",
        response: "Atgarsas",
        metrics: "Matmenys",
      },
      metrics: {
        promptTokens: "Įspūdingos žymės:",
        completionTokens: "Baigimo žymekliai:",
      },
      stopJob: "Nutraukite darbą",
      killing: "Sustabdyti...",
      continueInThread: "Tęsti pokalbį",
    },
    toolCall: {
      arguments: "Argumentai:",
      showResult: "Parodyti rezultatą",
      hideResult: "Slėpti rezultatą",
    },
    file: {
      unknown: "Nežinomas failas",
      download: "Atsisiųsti",
      downloadFailed: "Nepavyko atsisiųsti failą",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF dokumentas",
        word: "Dokumentas, kurį galima redaguoti Microsoft Word programoje",
        spreadsheet: "Spalvotas lapas (tabelis)",
        generic: "Failas",
      },
    },
    status: {
      completed: "Baigtas",
      failed: "Nepavyko",
      timed_out: "Laikas baigėsi",
      running: "Bėgimas",
      queued: "Apsisukęs",
    },
  },
};

export default TRANSLATIONS;
