// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Sākt darbu",
      welcome: "Laipni lūdzam",
    },
    llm: {
      title: "LLM preferences",
      description:
        "AnythingLLM var strādāt ar daudziem LLM pakalpojumu sniedzējiem. Šis būs pakalpojums, kas apstrādās sarunas.",
    },
    userSetup: {
      title: "Lietotāja iestatīšana",
      description: "Konfigurējiet savus lietotāja iestatījumus.",
      howManyUsers: "Cik daudz lietotāju izmantos šo instanci?",
      justMe: "Tikai es",
      myTeam: "Mana komanda",
      instancePassword: "Instances parole",
      setPassword: "Vai vēlaties iestatīt paroli?",
      passwordReq: "Parolēm jābūt vismaz 8 rakstzīmes garām.",
      passwordWarn: "Svarīgi saglabāt šo paroli, jo nav atjaunošanas metodes.",
      adminUsername: "Administratora konta lietotājvārds",
      adminPassword: "Administratora konta parole",
      adminPasswordReq: "Parolēm jābūt vismaz 8 rakstzīmes garām.",
      teamHint:
        "Pēc noklusējuma jūs būsiet vienīgais administrators. Kad ievadīšana būs pabeigta, jūs varēsiet izveidot un uzaicināt citus būt par lietotājiem vai administratoriem. Neaizmirstiet savu paroli, jo tikai administratori var atiestatīt paroles.",
    },
    data: {
      title: "Datu apstrāde un privātums",
      description:
        "Mēs esam apņēmušies nodrošināt caurskatāmību un kontroli pār jūsu personīgajiem datiem.",
      settingsHint:
        "Šos iestatījumus var pārkonfigurēt jebkurā laikā iestatījumos.",
    },
    survey: {
      title: "Laipni lūgti AnythingLLM",
      description:
        "Palīdziet mums veidot AnythingLLM atbilstoši jūsu vajadzībām. Neobligāti.",
      email: "Kāds ir jūsu e-pasts?",
      useCase: "Kam izmantosiet AnythingLLM?",
      useCaseWork: "Darbam",
      useCasePersonal: "Personīgai lietošanai",
      useCaseOther: "Citam nolūkam",
      comment: "Kā jūs uzzinājāt par AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube utt. - Ļaujiet mums zināt, kā jūs mūs atradāt!",
      skip: "Izlaist aptauju",
      thankYou: "Paldies par jūsu atsauksmi!",
    },
  },
  common: {
    "workspaces-name": "Darba telpas nosaukums",
    selection: "Modeļa izvēle",
    saving: "Saglabā...",
    save: "Saglabāt izmaiņas",
    previous: "Iepriekšējā lapa",
    next: "Nākamā lapa",
    optional: "Neobligāti",
    yes: "Jā",
    no: "Nē",
    search: "Meklēšana",
    username_requirements:
      "Lietotājvārdam jābūt 2–32 rakstzīmju garam, jāsākas ar mazo burtu un jāsatur tikai mazie burti, cipari, apakšsvītras, domuzīmes un punkti.",
    on: "Par",
    none: "Nav",
    stopped: "Apstājās",
    loading: "Ielāde",
    refresh: "Atjaunot",
  },
  settings: {
    title: "Instances iestatījumi",
    invites: "Ielūgumi",
    users: "Lietotāji",
    workspaces: "Darba telpas",
    "workspace-chats": "Darba telpas sarunas",
    customization: "Pielāgošana",
    interface: "UI preferences",
    branding: "Zīmolraide un identitāte",
    chat: "Sarunas",
    "api-keys": "Izstrādātāja API",
    llm: "LLM",
    transcription: "Transkripcija",
    embedder: "Embedder",
    "text-splitting": "Teksta sadalītājs un sadrumstalošana",
    "voice-speech": "Balss un runa",
    "vector-database": "Vektoru datubāze",
    embeds: "Sarunas ietvere",
    security: "Drošība",
    "event-logs": "Notikumu žurnāli",
    privacy: "Privātums un dati",
    "ai-providers": "AI pakalpojumu sniedzēji",
    "agent-skills": "Aģenta prasmes",
    admin: "Administrators",
    tools: "Rīki",
    "system-prompt-variables": "Sistēmas uzvednes mainīgie",
    "experimental-features": "Eksperimentālās funkcijas",
    contact: "Sazināties ar atbalstu",
    "browser-extension": "Pārlūka paplašinājums",
    "mobile-app": "AnythingLLM mobilā versija",
    "community-hub": {
      title: "Sabiedriskais centrs",
      trending: "Izpētiet populārākās",
      "your-account": "Jūsu konts",
      "import-item": "Importētā prece",
    },
    channels: "Kanāli",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Laipni lūgti",
      "placeholder-username": "Lietotājvārds",
      "placeholder-password": "Parole",
      login: "Ielogoties",
      validating: "Validē...",
      "forgot-pass": "Aizmirsi paroli",
      reset: "Atiestatīt",
    },
    "sign-in": "Piesakieties savā {{appName}} kontā.",
    "password-reset": {
      title: "Paroles atiestatīšana",
      description:
        "Sniedziet nepieciešamo informāciju zemāk, lai atiestatītu savu paroli.",
      "recovery-codes": "Atjaunošanas kodi",
      "back-to-login": "Atpakaļ uz pieteikšanos",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Izveidot aģentu",
      editWorkspace: "Rediģēt darba telpu",
      uploadDocument: "August failu",
    },
    greeting: "Kā es varu jums šodien palīdzēt?",
  },
  "new-workspace": {
    title: "Jauna darba telpa",
    placeholder: "Mana darba telpa",
  },
  "workspaces—settings": {
    general: "Vispārīgie iestatījumi",
    chat: "Sarunas iestatījumi",
    vector: "Vektoru datubāze",
    members: "Dalībnieki",
    agent: "Aģenta konfigurācija",
  },
  general: {
    vector: {
      title: "Vektoru skaits",
      description: "Kopējais vektoru skaits jūsu vektoru datubāzē.",
    },
    names: {
      description: "Tas mainīs tikai jūsu darba telpas attēlojamo nosaukumu.",
    },
    message: {
      title: "Ieteiktās sarunas ziņas",
      description:
        "Pielāgojiet ziņas, kas tiks ieteiktas jūsu darba telpas lietotājiem.",
      add: "Pievienot jaunu ziņu",
      save: "Saglabāt ziņas",
      heading: "Izskaidro man",
      body: "AnythingLLM priekšrocības",
    },
    delete: {
      title: "Dzēst darba telpu",
      description:
        "Dzēst šo darba telpu un visus tās datus. Tas dzēsīs darba telpu visiem lietotājiem.",
      delete: "Dzēst darba telpu",
      deleting: "Dzēš darba telpu...",
      "confirm-start": "Jūs gatavojaties dzēst visu savu",
      "confirm-end":
        "darba telpu. Tas noņems visus vektoru iegulšanas jūsu vektoru datubāzē.\n\nOriģinālie avota faili paliks neskartie. Šī darbība ir neatgriezeniska.",
    },
  },
  chat: {
    llm: {
      title: "Darba telpas LLM pakalpojumu sniedzējs",
      description:
        "Konkrētais LLM pakalpojumu sniedzējs un modelis, kas tiks izmantots šai darba telpai. Pēc noklusējuma tas izmanto sistēmas LLM pakalpojumu sniedzēju un iestatījumus.",
      search: "Meklēt visus LLM pakalpojumu sniedzējus",
    },
    model: {
      title: "Darba telpas sarunas modelis",
      description:
        "Konkrētais sarunas modelis, kas tiks izmantots šai darba telpai. Ja tukšs, izmantos sistēmas LLM preferences.",
    },
    mode: {
      title: "Sarunas režīms",
      chat: {
        title: "Saruna",
        description:
          'sniedz atbildes, izmantojot LLM vispārīgo zināšanu <b> un </b> dokumenta kontekstu, kas ir pieejams. Lai izmantotu rīkus, jums jāizmantojat komandu "@agent".',
      },
      query: {
        title: "Vaicājums",
        description:
          'sniedz atbildes <b>tikai__, </b>ja dokumenta konteksts ir atrasts.<br />Lai izmantotu rīkus, jums būs jāizmanto komanda "@agent".',
      },
      automatic: {
        title: "Automobiļs",
        description:
          'automātiski izmantos rīkus, ja modelis un sniedzējs atbalsta vietējo rīku izmantošanu. <br />Ja vietējā rīku izmantošana nav atbalstīta, jums būs jāizmantojat "@agent" komandu, lai izmantotu rīkus.',
      },
    },
    history: {
      title: "Sarunu vēsture",
      "desc-start":
        "Iepriekšējo sarunu skaits, kas tiks iekļauts atbildes īslaicīgajā atmiņā.",
      recommend: "Ieteicams 20. ",
      "desc-end":
        "Vairāk nekā 45 var novest pie nepārtrauktām sarunu kļūmēm atkarībā no ziņojuma izmēra.",
    },
    prompt: {
      title: "Sistēmas uzvedne",
      description:
        "Uzvedne, kas tiks izmantota šajā darba telpā. Definējiet kontekstu un instrukcijas AI, lai ģenerētu atbildi. Jums vajadzētu nodrošināt rūpīgi izstrādātu uzvedni, lai AI varētu ģenerēt atbilstošu un precīzu atbildi.",
      history: {
        title: "Sistēmas uzvednes vēsture",
        clearAll: "Notīrīt visu",
        noHistory: "Nav pieejama sistēmas uzvednes vēsture",
        restore: "Atjaunot",
        delete: "Dzēst",
        deleteConfirm: "Vai tiešām vēlaties dzēst šo vēstures ierakstu?",
        clearAllConfirm:
          "Vai tiešām vēlaties nodzēst visu vēsturi? Šo darbību nevar atsaukt.",
        expand: "Paplašināt",
        publish: "Publicē savu saturu Community Hub.",
      },
    },
    refusal: {
      title: "Vaicājuma režīma atteikuma atbilde",
      "desc-start": "Kad",
      query: "vaicājuma",
      "desc-end":
        "režīmā, jūs varētu vēlēties atgriezt pielāgotu atteikuma atbildi, kad konteksts nav atrasts.",
      "tooltip-title": "Kāpēc es to redzu?",
      "tooltip-description":
        "Jūs atrodaties meklēšanas režīmā, kas izmanto tikai informāciju no jūsu dokumentiem. Izmantojiet runas režīmu, lai nodrošinātu elastīgākas sarunas, vai noklikšķiniet šeit, lai apmeklētu mūsu dokumentāciju un iegūtu vairāk informācijas par runas režīmiem.",
    },
    temperature: {
      title: "LLM Temperatūra",
      "desc-start":
        'Šis iestatījums kontrolē, cik "radošas" būs jūsu LLM atbildes.',
      "desc-end":
        "Jo lielāks skaitlis, jo radošākas atbildes. Dažiem modeļiem tas var novest pie nesaprotamām atbildēm, ja iestatīts pārāk augsts.",
      hint: "Lielākajai daļai LLM ir dažādi pieņemami derīgo vērtību diapazoni. Konsultējieties ar savu LLM pakalpojumu sniedzēju par šo informāciju.",
    },
  },
  "vector-workspace": {
    identifier: "Vektoru datubāzes identifikators",
    snippets: {
      title: "Maksimālie konteksta fragmenti",
      description:
        "Šis iestatījums kontrolē maksimālo konteksta fragmentu skaitu, kas tiks nosūtīti LLM katrai sarunai vai vaicājumam.",
      recommend: "Ieteicams: 4",
    },
    doc: {
      title: "Dokumentu līdzības slieksnis",
      description:
        "Minimālais līdzības rādītājs, kas nepieciešams, lai avots tiktu uzskatīts par saistītu ar sarunu. Jo lielāks skaitlis, jo līdzīgākam avotam jābūt sarunai.",
      zero: "Bez ierobežojuma",
      low: "Zems (līdzības vērtējums ≥ .25)",
      medium: "Vidējs (līdzības vērtējums ≥ .50)",
      high: "Augsts (līdzības vērtējums ≥ .75)",
    },
    reset: {
      reset: "Atiestatīt vektoru datubāzi",
      resetting: "Notīra vektorus...",
      confirm:
        "Jūs gatavojaties atiestatīt šīs darba telpas vektoru datubāzi. Tas noņems visas pašlaik iegultās vektoru iegulšanas.\n\nOriģinālie avota faili paliks neskartie. Šī darbība ir neatgriezeniska.",
      error: "Darba telpas vektoru datubāzi nevarēja atiestatīt!",
      success: "Darba telpas vektoru datubāze tika atiestatīta!",
    },
  },
  agent: {
    "performance-warning":
      "LLM, kas tieši neatbalsta rīku izsaukumus, veiktspēja ir ļoti atkarīga no modeļa iespējām un precizitātes. Dažas iespējas var būt ierobežotas vai nefunkcionālas.",
    provider: {
      title: "Darba telpas aģenta LLM pakalpojumu sniedzējs",
      description:
        "Konkrētais LLM pakalpojumu sniedzējs un modelis, kas tiks izmantots šīs darba telpas @agent aģentam.",
    },
    mode: {
      chat: {
        title: "Darba telpas aģenta sarunas modelis",
        description:
          "Konkrētais sarunas modelis, kas tiks izmantots šīs darba telpas @agent aģentam.",
      },
      title: "Darba telpas aģenta modelis",
      description:
        "Konkrētais LLM modelis, kas tiks izmantots šīs darba telpas @agent aģentam.",
      wait: "-- gaida modeļus --",
    },
    skill: {
      rag: {
        title: "RAG un ilgtermiņa atmiņa",
        description:
          'Ļaujiet aģentam izmantot jūsu lokālos dokumentus, lai atbildētu uz vaicājumu, vai lūdziet aģentu "atcerēties" satura daļas ilgtermiņa atmiņas izguvei.',
      },
      view: {
        title: "Skatīt un apkopot dokumentus",
        description:
          "Ļaujiet aģentam uzskaitīt un apkopot pašlaik iegulto darba telpas failu saturu.",
      },
      scrape: {
        title: "Iegūt tīmekļa vietnes",
        description: "Ļaujiet aģentam apmeklēt un iegūt tīmekļa vietņu saturu.",
      },
      generate: {
        title: "Ģenerēt diagrammas",
        description:
          "Iespējot noklusējuma aģentam ģenerēt dažāda veida diagrammas no sarunā sniegtajiem vai dotajiem datiem.",
      },
      web: {
        title: "Tiešsaistes tīmekļa meklēšana un pārlūkošana",
        description:
          "Iegādājieties iespēju, lai jūsu aģents varētu meklēt informāciju internetā, lai atbildētu uz jūsu jautājumiem, pieslēdzoties tīmekļa meklēšanas (SERP) pakalpojuma sniedzējam.",
      },
      sql: {
        title: "SQL savienotājs",
        description:
          "Ļauj savam pārstāvim izmantot SQL, lai atbildētu uz jūsu jautājumiem, savienojoties ar dažādiem SQL datubāzes sniedzējiem.",
      },
      default_skill:
        "Par iestatījumu, šī spēja ir aktivizēta, taču jūs varat to izslēgt, ja nevēlaties, lai tā būtu pieejama aģentam.",
      filesystem: {
        title: "Failu sistēmas piekļuves tiesības",
        description:
          "Iespējiet, lai jūsu pārstāvis varētu lasīt, rakstīt, meklēt un pārvaldīt failus noteiktā direktorijā. Atbalsta failu rediģēšanu, direktoriju navigāciju un satura meklēšanu.",
        learnMore: "Uzziniet vairāk par to, kā izmantot šo prasmi",
        configuration: "Konfigurācija",
        readActions: "Lasīt",
        writeActions: "Rīcības",
        warning:
          "Pieejums failu sistēmai var būt bīstams, jo tas var mainīt vai dzēst failus. Lūdzu, konsultējieties ar <link>dokumentāciju</link> pirms aktivizēšanas.",
        skills: {
          "read-text-file": {
            title: "Atvērt failu",
            description:
              "Izlasiet failu saturu (tekstus, kodu, PDF failus, attēlus utt.)",
          },
          "read-multiple-files": {
            title: "Izlasīt vairākus failus",
            description: "Lasi vairākus failus vienlaikus.",
          },
          "list-directory": {
            title: "Saraksta direktorijs",
            description:
              "Izveidot failu un direktoru sarakstu ievietotajā mapē",
          },
          "search-files": {
            title: "Meklēt failus",
            description: "Meklē failus pēc nosaukuma vai satura",
          },
          "get-file-info": {
            title: "Iegūst faila informāciju",
            description: "Iesaļojiet detalizētus failu metadatus",
          },
          "edit-file": {
            title: "Rediģēt failu",
            description:
              "Veiciet teksta failu rediģēšanu, izmantojot rindu bāzes metodi.",
          },
          "create-directory": {
            title: "Izveidot direktoriju",
            description: "Izveidot jaunas direktorijas",
          },
          "move-file": {
            title: "Pārvietot/Vārdēt failu",
            description: "Vāc vai pārdzen failus un direktorijus",
          },
          "copy-file": {
            title: "Kopēt failu",
            description: "Kopēt failus un direktorus",
          },
          "write-text-file": {
            title: "Izveidot teksta failu",
            description:
              "Izveidot jaunas teksta failus vai pārrakstīt esošos teksta failus.",
          },
        },
      },
      createFiles: {
        title: "Dokumentu izveide",
        description:
          "Ļauj savam pārstāvim izveidot binārus dokumentu formātus, piemēram, PowerPoint prezentācijas, Excel tabulas, Word dokumentus un PDF failus. Failus var lejupielādēt tieši no čata.",
        configuration: "Pieejamās dokumentu veidas",
        skills: {
          "create-text-file": {
            title: "Teksta faili",
            description:
              "Izveidot teksta failus ar jebkuru saturu un izplejumu (.txt, .md, .json, .csv utt.)",
          },
          "create-pptx": {
            title: "PowerPoint prezentācijas",
            description:
              "Izveidot jaunas PowerPoint prezentācijas ar slaidiem, nosaukumiem un punktiem.",
          },
          "create-pdf": {
            title: "PDF dokumenti",
            description:
              "Izveidot PDF dokumentus no Markdown vai vienkāršas teksta, izmantojot pamata formāciju.",
          },
          "create-xlsx": {
            title: "Excel tabulas",
            description:
              "Izveidot Excel dokumentus ar tabulas datiem, kas ietver lapas un stila iespējas.",
          },
          "create-docx": {
            title: "Vārdu dokumenti",
            description:
              "Izveidot Word dokumentus ar pamata stils un formātēšanu",
          },
        },
      },
      gmail: {
        title: "GMail savienojums",
        description:
          "Ļauj savam pārstāvim interaktīvi strādāt ar Gmail – meklēt e-pastus, lasīt diskusijas, veidot projekte, nosūtīt e-pastus un pārvaldīt savu e-pasta kārtojumu. <a>Izlasiet dokumentāciju</a>.",
        multiUserWarning:
          "Gmail integrācija nav pieejama, kad izmantojat vairākus lietotājus, jo tas ir saistīts ar drošības apsvērumiem. Lūdzu, atslēgt vairāku lietotāju režimu, lai izmantotu šo funkciju.",
        configuration: "Gmail konfigurācija",
        deploymentId: "Ieraksta ID",
        deploymentIdHelp:
          "Jūsu Google Apps Script veidotās web lietojamās lietojamās ID",
        apiKey: "API atslēga",
        apiKeyHelp:
          "API atslēga, ko jūs konfigurējāt savā Google Apps Script instalēšanā.",
        configurationRequired:
          'Lūdzu, konfigurējiet "Deployment ID" un API atslēgu, lai aktivizētu Gmail funkcijas.',
        configured: "Ierobežots",
        searchSkills: "Meklēšanas prasmes...",
        noSkillsFound: "Neatrodītas atbilstības jūsu meklējumiem.",
        categories: {
          search: {
            title: "Meklē un lasiet e-pastus",
            description:
              "Meklējiet un lasiet e-pasta vēstnes no jūsu Gmail ievakā.",
          },
          drafts: {
            title: "Pamatraksti e-pasta vēstījumiem",
            description: "Izveidot, rediģēt un pārvaldīt e-pasta rakstus",
          },
          send: {
            title: "Sūtiet un atbildiet uz e-pasta vēstījumiem",
            description:
              "Nosūtiet e-pasta ziņojus un atbildiet uz diskusiju tēriņiem nekavējoties.",
          },
          threads: {
            title: "Aizgrieziet e-pasta sarunas",
            description:
              "Aizvadīt e-pasta sarunas – atzīmēt kā lasītu/neizlasītu, glabāt arhīvā, atrast atkritumos",
          },
          account: {
            title: "Integrācijas statistika",
            description:
              "Apspriediet pasta skapja statistiku un konta informāciju.",
          },
        },
        skills: {
          search: {
            title: "Meklē e-pastus",
            description:
              "Meklēt e-pasta vēstures, izmantojot Gmail meklēšanas sintaksi",
          },
          readThread: {
            title: "Izlasīt tēmu",
            description: "Izlasiet pilnu e-pasta sarunu, izmantojot ID",
          },
          createDraft: {
            title: "Izveidot izstrādi",
            description: "Izveidot jaunu e-pasta rakstu",
          },
          createDraftReply: {
            title: "Izveidot atbildes projekta",
            description: "Izveidot atbildes projekta par esošu tematu.",
          },
          updateDraft: {
            title: "Pārredzētās versijas",
            description: "Atjaunini esošā e-pasta projekta",
          },
          getDraft: {
            title: "Saņemiet projekta versiju",
            description: "Atgūt specifisku dokumentu pēc identifikatora",
          },
          listDrafts: {
            title: "Pamatdarba projekti",
            description:
              "Izveidot sarakstu ar visiem izstrādātajiem e-pasta vēstījumiem",
          },
          deleteDraft: {
            title: "Dzēst projekta versiju",
            description: "Dzēst izstrādāto e-pastu",
          },
          sendDraft: {
            title: "Nosūtīt projekta versiju",
            description: "Nosūtiet esošo e-pasta projekta vēstuli",
          },
          sendEmail: {
            title: "Sūtiet e-pastu",
            description: "Sūtiet e-pastu nekavējoties",
          },
          replyToThread: {
            title: "Atbildēt uz tēmu",
            description: "Atbildiet uz e-pasta sarunu nekavējoties",
          },
          markRead: {
            title: "Mark Reads",
            description: "Atzīmējiet tēmu kā lasītu.",
          },
          markUnread: {
            title: "Mark – neizlasīts",
            description: "Atzīmējiet tēmu kā neizlasītu.",
          },
          moveToTrash: {
            title: "Aizvest uz atkritumu konteineru",
            description: "Pārvietojiet tēmu uz atkritumu failu",
          },
          moveToArchive: {
            title: "Arhivs",
            description: "Saglabāt tēmu",
          },
          moveToInbox: {
            title: 'Pārvietot uz "Ienākošās"',
            description: "Pārvietojiet tēmu uz e-pasta skatīšanās rindā",
          },
          getMailboxStats: {
            title: "Pasta kastes statistika",
            description:
              "Iesaļojiet neskaitītās e-pasta ziņojumu un e-pasta kastes statistikas",
          },
          getInbox: {
            title: "Atsvēdināt e-pasta skatīšanās rindu",
            description: "Efektīvs veids, kā saņemt e-pastus no Gmail konta",
          },
        },
      },
      outlook: {
        title: "Outlook savienojums",
        description:
          "Ļaujiet savam pārstāvim interaktīvi darboties ar Microsoft Outlook – meklēt e-pasta ziņojus, lasīt diskusijas, veidot projektejus, nosūtīt e-pasta ziņojus un pārvaldīt savu e-pasta skapis, izmantojot Microsoft Graph API. <a>Izlasiet dokumentāciju</a>.",
        multiUserWarning:
          '"Outlook integrācija nav pieejama vairāku lietotāju režīmā, lai nodrošinātu drošību. Lūdzu, atgrieziet multilietotāju režīmu, lai izmantotu šo funkciju."',
        configuration: "Outlook iestatījumu konfigurēšana",
        authType: "Aģenta veids",
        authTypeHelp:
          'Izvēlieties, kādas Microsoft kontu tipus var autentificēt. "Visas kontas" atbalsta gan personiskus, gan darba/skolas kontus. "Tikai personiskie konti" ierobežo izmantošanu tikai ar personiskiem Microsoft kontiem. "Tikai organizācijas konti" ierobežo izmantošanu tikai ar darba/skolas kontiem no konkrēta Azure AD klienta.',
        authTypeCommon: "Visas kontas (personālās un darba/skolas)",
        authTypeConsumers: "Personiskas Microsoft kontas tikai",
        authTypeOrganization:
          "Tikai organizācijas konti (nepieciešams īpašnieka ID)",
        clientId: "Pieteikuma (Klienta) ID",
        clientIdHelp:
          "Pieteikuma (klienta) ID no jūsu Azure AD lietojamās programmas reģistrācijas",
        tenantId: "Reģistrācijas numurs (īres lietotājs)",
        tenantIdHelp:
          '"Klienta" ID no jūsu Azure AD lietojumprogrammas reģistrācijas. Nepieciešams tikai, ja tiek izmantota tikai organizācijas autentifikācija.',
        clientSecret: "Klienta slepšvārds",
        clientSecretHelp:
          "Klienta slepenas vērtība, kas iegūta no jūsu Azure AD lietojamās programmas reģistrācijas",
        configurationRequired:
          "Lūdzu, konfigurējiet klienta ID un klienta sleptu atslēgu, lai iespējotu Outlook funkcijas.",
        authRequired:
          "Pirms sākat, saglabājiet savus autentifikācijas datus, un pēc tam veiciet autentifikāciju, lai pabeigtu konfigurēšanu.",
        authenticateWithMicrosoft: "Autentizējieties ar Microsoft",
        authenticated: "Izdevīgi sarakstījies ar Microsoft Outlook.",
        revokeAccess: "Atcel piekļuvi",
        configured: "Ierādīts",
        searchSkills: "Meklēšanas prasmes...",
        noSkillsFound: "Neatrastas atbilstošas prasmes jūsu meklējumiem.",
        categories: {
          search: {
            title: "Meklē un lasiet e-pastus",
            description:
              "Meklējiet un lasiet e-pasta ziņojus no jūsu Outlook skapis",
          },
          drafts: {
            title: "Pamatraksti e-pasta vēstījumiem",
            description: "Izveidot, rediģēt un pārvaldīt e-pasta rakstus",
          },
          send: {
            title: "Nosūtīt e-pastus",
            description:
              "Sūtiet jaunas e-pasta vēstules vai atbildiet uz saņemtajām vēstnēm nekavējoties.",
          },
          account: {
            title: "Integrācijas statistika",
            description:
              "Apskatiet pasta kastes statistiku un konta informāciju.",
          },
        },
        skills: {
          getInbox: {
            title: "Atsvērt e-pasta skatīšanās reklāžu",
            description:
              "Iegūstiet jaunākos e-pasta ziņojus no jūsu Outlook skapis",
          },
          search: {
            title: "Meklē e-pastus",
            description:
              "Meklē e-pasta ziņojus, izmantojot Microsoft meklēšanas sintaksi",
          },
          readThread: {
            title: "Izlasiet sarunu",
            description: "Izlasiet pilnu e-pasta sarunu",
          },
          createDraft: {
            title: "Izveidot projekta versiju",
            description:
              "Izveidot jaunu e-pasta projekta rakstu vai atbildes projektu esošam ziņojumam.",
          },
          updateDraft: {
            title: "Pēcmājas projekts",
            description: "Atjaunināt esošo e-pasta projekta",
          },
          listDrafts: {
            title: "Izstrādāto variantu saraksts",
            description:
              "Izveidot sarakstu ar visiem izstrādātajiem e-pasta vēstījumiem",
          },
          deleteDraft: {
            title: "Dzēst projekta versiju",
            description: "Dzēst izstrādāto e-pastu",
          },
          sendDraft: {
            title: "Nosūtīt projekta versiju",
            description: "Nosūtiet esošā e-pasta projekta versiju",
          },
          sendEmail: {
            title: "Sūtīt e-pastu",
            description:
              "Sūtiet jaunu e-pastu vai atbildiet uz esošu ziņu nekavējoties.",
          },
          getMailboxStats: {
            title: "Pasta kastes statistika",
            description:
              "Iesaļojiet mapeņu skaitu un e-pasta kontu statistiku.",
          },
        },
      },
      googleCalendar: {
        title: "Google Kalendāra integrācija",
        description:
          "Ļauj savam pārstāvim interaktīvi darboties ar Google Kalendāru – skatīt kalendārus, iegūt pasākumus, izveidot un atjaunot pasākumus, kā arī pārvaldīt reģistrāciju. <a>Lasiet dokumentāciju</a>.",
        multiUserWarning:
          "Google Kalendāra integrācija nav pieejama vairāku lietotāju režīmā, lai nodrošinātu drošību. Lūdzu, atgrieziet multilietotāju režīmu, lai izmantotu šo funkciju.",
        configuration: "Google kalendāra konfigurācija",
        deploymentId: "Ierīces identifikators",
        deploymentIdHelp: "Jūsu Google Apps Script veidlapas ID",
        apiKey: "API atslēga",
        apiKeyHelp:
          "API atslēga, ko jūs konfigurējāt savā Google Apps Script instalācijā",
        configurationRequired:
          'Lūdzu, konfigurējiet "Deployment ID" un API atslēgu, lai aktivizētu Google Kalendāra funkcijas.',
        configured: "Ierīkots",
        searchSkills: "Meklēšanas prasmes...",
        noSkillsFound: "Neatrodītas atbilstības jūsu meklējumiem.",
        categories: {
          calendars: {
            title: "Kalendāri",
            description: "Skatiet un pārvaldiet savus Google kalendārus.",
          },
          readEvents: {
            title: "Lasīt pasākumus",
            description: "Skatiet un meklējiet kalendāra notikumus",
          },
          writeEvents: {
            title: "Izveidot un atjaunināt pasākumus",
            description: "Izveidot jaunas pasākumus un mainīt esošos",
          },
          rsvp: {
            title: "Piedalīšanās reģistrācija",
            description: "Pārvaldiet savu atbildes statusu pasākumiem",
          },
        },
        skills: {
          listCalendars: {
            title: "Kalendāri",
            description:
              "Izveidojot sarakstu, norādi visus kalendārus, ko tu īpašoj un uz kuriem esi reģistrējies.",
          },
          getCalendar: {
            title: "Iegūstiet kalendāra informāciju",
            description: "Iesaļojiet detalizētus datus par konkrētu kalendāru.",
          },
          getEvent: {
            title: "Iegūstiet pasākuma informāciju",
            description:
              "Iesaļojiet detalizētu informāciju par konkrētu pasākumu",
          },
          getEventsForDay: {
            title: "Ieskats uz pasākumiem šajā dienā",
            description:
              "Ieskaitiet visus pasākumus, kas plānoti konkrētā datumā",
          },
          getEvents: {
            title: "Iegūstiet pasākumus (datu diapazons)",
            description:
              "Iegūt pasākumus, kas notiek konkrētā datuma diapazonā",
          },
          getUpcomingEvents: {
            title: "Uznāciet nākamo pasākumu",
            description:
              "Atrodiet pasākumus šodien, šajā nedēļā vai šajā mēnesī, izmantojot vienkāržus atslēvvadus.",
          },
          quickAdd: {
            title: "Ātri pievienot pasākumu",
            description:
              'Izveidot pasākumu, izmantojot dabas valodu (piemēram, "Sanākšana rīt plkst. 15:00")',
          },
          createEvent: {
            title: "Izveidot pasākumu",
            description:
              "Izveidot jaunu pasākumu, nodrošinot pilnu kontroli pār visām tās īpašībām.",
          },
          updateEvent: {
            title: "Pasākuma atjauninājums",
            description: "Atjaunināt esošas kalendāra notikuma informāciju",
          },
          setMyStatus: {
            title: "Norādiet atbildes statusu",
            description: "Atzīst, atgrūst vai temporāri apstiprināt pasākumu",
          },
        },
      },
    },
    mcp: {
      title: "MCP serveri",
      "loading-from-config": "Ielādot MCP serverus no konfigūrācijas faila",
      "learn-more": "Uzziniet vairāk par MCP serveriem.",
      "no-servers-found": "Neizdevās atrast kādus MCP serverus.",
      "tool-warning":
        "Lai nodrošinātu optimālu darbību, apsveriet iespēju atspēlot nevajadzīgus rīkus, lai saglabātu kontekstu.",
      "stop-server": "Aizvert MCP serveri",
      "start-server": "Sākt MCP serveri",
      "delete-server": "Dzēst MCP serveri",
      "tool-count-warning":
        "Šis MCP servers ir aktivizētas <b> instrumenti, kas izmantos kontekstu katrā sarunā.</b> Iespējams, ir labāk deaktivizēt nevēlamus instrumentus, lai saglabātu kontekstu.",
      "startup-command": "Sākuma komanda",
      command: "Instrukcijas",
      arguments: "Pamatatpersonas",
      "not-running-warning":
        "Šis MCP servers darbojas – iespējams, tas ir izslēgts vai piedzīvo kļūdu, kad tiek ieslēgts.",
      "tool-call-arguments": "Parametri, kas tiek nosūtīti rīkam",
      "tools-enabled": "rīki atļauti",
    },
    settings: {
      title: "Aģenta spēju iestatījumi",
      "max-tool-calls": {
        title: "Maksimālais rēķinu skaits vienam atbildē",
        description:
          "Maksimālais rīku skaits, ko aģents var apvienot, lai ģenerētu vienu atbildi. Tas novērina neierobežotu rīku izmantošanu un beidzoties.",
      },
      "intelligent-skill-selection": {
        title: "Izglītības un prasmu izvēle, kas balstota uz spējām",
        "beta-badge": "Beta",
        description:
          'Ievērojiet neierobežotu rīku un "cut token" izmantošanas samazinājumu līdz 80% uz katru pieprasījumu – AnythingLLM automātiski izvēlas piemērotākās prasmes katram pieprasījumam.',
        "max-tools": {
          title: "Max Tools",
          description:
            "Maksimālais rīku skaits, kas var tikt izvēlts katrai meklēšanai. Mēs iesakām iestatīt šo vērtību, lai iegūtu lielāku kontekstu modelus.",
        },
      },
    },
  },
  recorded: {
    title: "Darba telpas sarunas",
    description:
      "Šīs ir visas ierakstītās sarunas un ziņas, ko lietotāji ir nosūtījuši, sakārtotas pēc to izveides datuma.",
    export: "Eksportēt",
    table: {
      id: "ID",
      by: "Nosūtīja",
      workspace: "Darba telpa",
      prompt: "Uzvedne",
      response: "Atbilde",
      at: "Nosūtīts",
    },
  },
  customization: {
    interface: {
      title: "UI preferences",
      description: "Iestatiet savas UI preferences AnythingLLM.",
    },
    branding: {
      title: "Zīmolrade un identitāte",
      description:
        "Pielāgojiet savu AnythingLLM instanci ar pielāgotu zīmolradi.",
    },
    chat: {
      title: "Saruna",
      description: "Iestatiet savas sarunas preferences AnythingLLM.",
      auto_submit: {
        title: "Automātiski iesniegt runas ievadi",
        description: "Automātiski iesniegt runas ievadi pēc klusuma perioda",
      },
      auto_speak: {
        title: "Automātiski runāt atbildes",
        description: "Automātiski runāt atbildes no AI",
      },
      spellcheck: {
        title: "Iespējot pareizrakstības pārbaudi",
        description:
          "Iespējot vai atspējot pareizrakstības pārbaudi sarunas ievades laukā",
      },
    },
    items: {
      theme: {
        title: "Tēma",
        description: "Izvēlieties vēlamo krāsu tēmu lietotnei.",
      },
      "show-scrollbar": {
        title: "Rādīt ritjoslu",
        description: "Iespējot vai atspējot ritjoslu sarunas logā.",
      },
      "support-email": {
        title: "Atbalsta e-pasts",
        description:
          "Iestatiet atbalsta e-pasta adresi, kam lietotājiem jābūt pieejamam, kad viņiem nepieciešama palīdzība.",
      },
      "app-name": {
        title: "Nosaukums",
        description:
          "Iestatiet nosaukumu, kas tiek rādīts pieteikšanās lapā visiem lietotājiem.",
      },
      "display-language": {
        title: "Displeja valoda",
        description:
          "Izvēlieties vēlamo valodu AnythingLLM lietotāja saskarnei - kad pieejami tulkojumi.",
      },
      logo: {
        title: "Zīmola logotips",
        description:
          "Augšupielādējiet savu pielāgoto logotipu, lai to rādītu visās lapās.",
        add: "Pievienot pielāgotu logotipu",
        recommended: "Ieteicamais izmērs: 800 x 200",
        remove: "Noņemt",
        replace: "Aizvietot",
      },
      "browser-appearance": {
        title: "Pārlūkprogrammas izskats",
        description:
          "Pielāgojiet pārlūkprogrammas cilnes izskatu un nosaukumu, kad lietotne ir atvērta.",
        tab: {
          title: "Nosaukums",
          description:
            "Iestatiet pielāgotu cilnes nosaukumu, kad lietotne ir atvērta pārlūkprogrammā.",
        },
        favicon: {
          title: "Favicon",
          description: "Izmantojiet pielāgotu favicon pārlūkprogrammas cilnei.",
        },
      },
      "sidebar-footer": {
        title: "Sānu joslas kājenes vienumi",
        description:
          "Pielāgojiet kājenes vienumus, kas tiek attēloti sānu joslas apakšā.",
        icon: "Ikona",
        link: "Saite",
      },
      "render-html": {
        title: "Izveidot HTML saturu, ko var izmantot čatā.",
        description:
          "Ievietojiet HTML atbildes palīdzības atbildēs.\nTas var novērst daudz augstāku atbildes kvalitātes līmeni, taču arī var radīt potenciālas drošības riskus.",
      },
    },
  },
  api: {
    title: "API atslēgas",
    description:
      "API atslēgas ļauj to īpašniekam programmatiski piekļūt un pārvaldīt šo AnythingLLM instanci.",
    link: "Lasīt API dokumentāciju",
    generate: "Ģenerēt jaunu API atslēgu",
    empty: "API atslēgas nav atrastas",
    actions: "Darbības",
    messages: {
      error: "Kļūda: {{error}}",
    },
    modal: {
      title: "Izveidot jaunu API atslēgu",
      cancel: "Atcelt",
      close: "Aizvērt",
      create: "Izveidot API atslēgu",
      helper:
        "Pēc izveides API atslēgu var izmantot, lai programmatiski piekļūtu šai AnythingLLM instancei un to konfigurētu.",
      name: {
        label: "Nosaukums",
        placeholder: "Produkcijas integrācija",
        helper:
          "Nav obligāti. Izmantojiet saprotamu nosaukumu, lai vēlāk šo atslēgu būtu viegli atpazīt.",
      },
    },
    row: {
      copy: "Kopēt API atslēgu",
      copied: "Nokopēts",
      unnamed: "--",
      deleteConfirm:
        "Vai tiešām vēlaties deaktivizēt šo API atslēgu?\nPēc tam to vairs nevarēs izmantot.\n\nŠo darbību nevar atsaukt.",
    },
    table: {
      name: "Nosaukums",
      key: "API atslēga",
      by: "Izveidoja",
      created: "Izveidots",
    },
  },
  llm: {
    title: "LLM preferences",
    description:
      "Šie ir akreditācijas dati un iestatījumi jūsu vēlamajam LLM čata un iegulšanas pakalpojuma sniedzējam. Ir svarīgi, lai šīs atslēgas būtu aktuālas un pareizas, pretējā gadījumā AnythingLLM nedarbosies pareizi.",
    provider: "LLM pakalpojuma sniedzējs",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure pakalpojuma gala punkts",
        api_key: "API atslēņa",
        chat_deployment_name: "Izvietošanas nosaukums",
        chat_model_token_limit:
          'Žurnāla "The Guardian" raksts "How to build a sustainable city" ("Kā izveidot ilgtspējīgu pilsētu")\n\n\nŽurnāla "The Guardian" raksts "How to build a sustainable city" ("Kā izveidot ilgtspējīgu pilsētu")',
        model_type: "Modeļa veids",
        default: "Standarta",
        reasoning: "Pamatojums",
        model_type_tooltip:
          'Ja jūsu lietojums izmanto loģiskā modelī (o1, o1-mini, o3-mini utt.), norādiet, ka tas ir "Loģisks". Citi gadījumā jūsu sarunu pieprasījumi var neizpildīties.',
      },
    },
  },
  transcription: {
    title: "Transkripcijas modeļa preferences",
    description:
      "Šie ir akreditācijas dati un iestatījumi jūsu vēlamajam transkripcijas modeļa pakalpojuma sniedzējam. Ir svarīgi, lai šīs atslēgas būtu aktuālas un pareizas, pretējā gadījumā multivides faili un audio netiks transkribēti.",
    provider: "Transkripcijas pakalpojuma sniedzējs",
    "warn-start":
      "Izmantojot lokālo whisper modeli iekārtās ar ierobežotu RAM vai CPU var apstādināt AnythingLLM, apstrādājot multivides failus.",
    "warn-recommend":
      "Mēs iesakām vismaz 2GB RAM un augšupielādēt failus <10Mb.",
    "warn-end":
      "Iebūvētais modelis automātiski lejupielādēsies pirmajā lietošanas reizē.",
  },
  embedding: {
    title: "Iegulšanas preferences",
    "desc-start":
      "Izmantojot LLM, kas neatbalsta iebūvētu iegulšanas dzinēju - jums var būt nepieciešams papildus norādīt akreditācijas datus teksta iegulšanai.",
    "desc-end":
      "Iegulšana ir process, ar kuru teksts tiek pārveidots vektoros. Šie akreditācijas dati ir nepieciešami, lai pārveidotu jūsu failus un vaicājumus formātā, kuru AnythingLLM var izmantot apstrādei.",
    provider: {
      title: "Iegulšanas pakalpojuma sniedzējs",
    },
  },
  text: {
    title: "Teksta sadalīšanas un sagatavošanas preferences",
    "desc-start":
      "Dažreiz jūs, iespējams, vēlēsieties mainīt noklusējuma veidu, kā jauni dokumenti tiek sadalīti un sagatavoti pirms ievietošanas vektoru datubāzē.",
    "desc-end":
      "Jums vajadzētu mainīt šo iestatījumu tikai tad, ja saprotat, kā darbojas teksta sadalīšana un tās blakusefekti.",
    size: {
      title: "Teksta gabala izmērs",
      description:
        "Šis ir maksimālais rakstzīmju skaits, kas var būt vienā vektorā.",
      recommend: "Iegult modeļa maksimālo garumu ir",
    },
    overlap: {
      title: "Teksta gabalu pārklāšanās",
      description:
        "Šī ir maksimālā rakstzīmju pārklāšanās, kas notiek sadalīšanas laikā starp diviem blakus esošiem teksta gabaliem.",
    },
  },
  vector: {
    title: "Vektoru datubāze",
    description:
      "Šie ir akreditācijas dati un iestatījumi tam, kā darbosies jūsu AnythingLLM instance. Ir svarīgi, lai šīs atslēgas būtu aktuālas un pareizas.",
    provider: {
      title: "Vektoru datubāzes pakalpojuma sniedzējs",
      description: "LanceDB nav nepieciešama konfigurācija.",
    },
  },
  embeddable: {
    title: "Iegulstāmie čata logrīki",
    description:
      "Iegulstāmie čata logrīki ir publiskas saziņas saskarnes, kas ir piesaistītas vienam darbam. Tie ļauj izveidot darba vietas, kuras pēc tam varat publicēt pasaulē.",
    create: "Izveidot iegulumu",
    table: {
      workspace: "Darba vieta",
      chats: "Nosūtītie čati",
      active: "Aktīvie domēni",
      created: "Izveidotais",
    },
  },
  "embed-chats": {
    title: "Iegulto čatu saraksts",
    export: "Eksportēt",
    description:
      "Šie ir visi ierakstītie čati un ziņojumi no jebkura iegultā logrīka, ko esat publicējis.",
    table: {
      embed: "Iegultais",
      sender: "Sūtītājs",
      message: "Ziņojums",
      response: "Atbilde",
      at: "Nosūtīts",
    },
  },
  event: {
    title: "Notikumu žurnāli",
    description:
      "Skatiet visas darbības un notikumus, kas notiek šajā instancē uzraudzības nolūkos.",
    clear: "Notīrīt notikumu žurnālus",
    table: {
      type: "Notikuma veids",
      user: "Lietotājs",
      occurred: "Notika",
    },
  },
  privacy: {
    title: "Privātums un datu apstrāde",
    description:
      "Šī ir jūsu konfigurācija tam, kā savienotie trešo pušu pakalpojumu sniedzēji un AnythingLLM apstrādā jūsu datus.",
    anonymous: "Anonīmā telemetrija iespējota",
  },
  connectors: {
    "search-placeholder": "Meklēt datu savienotājus",
    "no-connectors": "Nav atrasti datu savienotāji.",
    obsidian: {
      vault_location: "Krātuves atrašanās vieta",
      vault_description:
        "Atlasiet savu Obsidian krātuves mapi, lai importētu visas piezīmes un to savienojumus.",
      selected_files: "Atrasti {{count}} markdown faili",
      importing: "Notiek krātuves importēšana...",
      import_vault: "Importēt krātuvi",
      processing_time:
        "Tas var aizņemt laiku atkarībā no jūsu krātuves lieluma.",
      vault_warning:
        "Lai izvairītos no konfliktiem, pārliecinieties, ka jūsu Obsidian krātuve pašlaik nav atvērta.",
    },
    github: {
      name: "GitHub repozitorijs",
      description:
        "Importējiet visu publisku vai privātu GitHub repozitoriju ar vienu klikšķi.",
      URL: "GitHub repozitorija URL",
      URL_explained: "GitHub repozitorija URL, kuru vēlaties savākt.",
      token: "GitHub piekļuves tokens",
      optional: "neobligāts",
      token_explained: "Piekļuves tokens, lai novērstu ātruma ierobežojumus.",
      token_explained_start: "Bez ",
      token_explained_link1: "personiskā piekļuves tokena",
      token_explained_middle:
        ", GitHub API var ierobežot savācamo failu skaitu ātruma ierobežojumu dēļ. Jūs varat ",
      token_explained_link2: "izveidot pagaidu piekļuves tokenu",
      token_explained_end: ", lai izvairītos no šīs problēmas.",
      ignores: "Failu ignorēšana",
      git_ignore:
        "Saraksts .gitignore formātā, lai ignorētu konkrētus failus savākšanas laikā. Nospiediet enter pēc katra ieraksta, kuru vēlaties saglabāt.",
      task_explained:
        "Kad tas būs pabeigts, visi faili būs pieejami iegulšanai darba vietās dokumentu atlasītājā.",
      branch: "Zars, no kura vēlaties savākt failus.",
      branch_loading: "-- notiek pieejamo zaru ielāde --",
      branch_explained: "Zars, no kura vēlaties savākt failus.",
      token_information:
        "Bez <b>GitHub piekļuves tokena</b> aizpildīšanas šis datu savienotājs varēs savākt tikai <b>augšējā līmeņa</b> failus repozitorijā GitHub publiskā API ātruma ierobežojumu dēļ.",
      token_personal:
        "Iegūstiet bezmaksas personisko piekļuves tokenu ar GitHub kontu šeit.",
    },
    gitlab: {
      name: "GitLab repozitorijs",
      description:
        "Importējiet visu publisku vai privātu GitLab repozitoriju ar vienu klikšķi.",
      URL: "GitLab repozitorija URL",
      URL_explained: "GitLab repozitorija URL, kuru vēlaties savākt.",
      token: "GitLab piekļuves tokens",
      optional: "neobligāts",
      token_description: "Atlasiet papildu entītijas, ko iegūt no GitLab API.",
      token_explained_start: "Bez ",
      token_explained_link1: "personiskā piekļuves tokena",
      token_explained_middle:
        ", GitLab API var ierobežot savācamo failu skaitu ātruma ierobežojumu dēļ. Jūs varat ",
      token_explained_link2: "izveidot pagaidu piekļuves tokenu",
      token_explained_end: ", lai izvairītos no šīs problēmas.",
      fetch_issues: "Iegūt problēmas kā dokumentus",
      ignores: "Failu ignorēšana",
      git_ignore:
        "Saraksts .gitignore formātā, lai ignorētu konkrētus failus savākšanas laikā. Nospiediet enter pēc katra ieraksta, kuru vēlaties saglabāt.",
      task_explained:
        "Kad tas būs pabeigts, visi faili būs pieejami iegulšanai darba vietās dokumentu atlasītājā.",
      branch: "Zars, no kura vēlaties savākt failus",
      branch_loading: "-- notiek pieejamo zaru ielāde --",
      branch_explained: "Zars, no kura vēlaties savākt failus.",
      token_information:
        "Bez <b>GitLab piekļuves tokena</b> aizpildīšanas šis datu savienotājs varēs savākt tikai <b>augšējā līmeņa</b> failus repozitorijā GitLab publiskā API ātruma ierobežojumu dēļ.",
      token_personal:
        "Iegūstiet bezmaksas personisko piekļuves tokenu ar GitLab kontu šeit.",
    },
    youtube: {
      name: "YouTube transkripcija",
      description: "Importējiet visa YouTube video transkripciju no saites.",
      URL: "YouTube video URL",
      URL_explained_start:
        "Ievadiet jebkura YouTube video URL, lai iegūtu tā transkripciju. Video ir jābūt pieejamiem ",
      URL_explained_link: "slēgtajiem parakstiem",
      URL_explained_end: ".",
      task_explained:
        "Kad tas būs pabeigts, transkripcija būs pieejama iegulšanai darba vietās dokumentu atlasītājā.",
    },
    "website-depth": {
      name: "Vairāku saišu skrāpētājs",
      description:
        "Skrāpējiet vietni un tās apakšsaites līdz noteiktam dziļumam.",
      URL: "Vietnes URL",
      URL_explained: "URL vietnei, kuru vēlaties skrāpēt.",
      depth: "Pārmeklēšanas dziļums",
      depth_explained:
        "Šis ir bērnu saišu skaits, kurām darbiniekam būtu jāseko no sākotnējā URL.",
      max_pages: "Maksimālais lapu skaits",
      max_pages_explained: "Maksimālais skrāpējamo saišu skaits.",
      task_explained:
        "Kad tas būs pabeigts, viss skrāpētais saturs būs pieejams iegulšanai darba vietās dokumentu atlasītājā.",
    },
    confluence: {
      name: "Confluence",
      description: "Importējiet visu Confluence lapu ar vienu klikšķi.",
      deployment_type: "Confluence izvietošanas veids",
      deployment_type_explained:
        "Nosakiet, vai jūsu Confluence instance ir izvietota Atlassian mākonī vai pašu uzturētā.",
      base_url: "Confluence pamata URL",
      base_url_explained: "Šis ir jūsu Confluence telpas pamata URL.",
      space_key: "Confluence telpas atslēga",
      space_key_explained:
        "Šī ir jūsu confluence instances telpas atslēga, kas tiks izmantota. Parasti sākas ar ~",
      username: "Confluence lietotājvārds",
      username_explained: "Jūsu Confluence lietotājvārds",
      auth_type: "Confluence autentifikācijas veids",
      auth_type_explained:
        "Atlasiet autentifikācijas veidu, kuru vēlaties izmantot, lai piekļūtu savām Confluence lapām.",
      auth_type_username: "Lietotājvārds un piekļuves tokens",
      auth_type_personal: "Personiskais piekļuves tokens",
      token: "Confluence piekļuves tokens",
      token_explained_start:
        "Jums ir jānodrošina piekļuves tokens autentifikācijai. Jūs varat ģenerēt piekļuves tokenu",
      token_explained_link: "šeit",
      token_desc: "Piekļuves tokens autentifikācijai",
      pat_token: "Confluence personiskais piekļuves tokens",
      pat_token_explained: "Jūsu Confluence personiskais piekļuves tokens.",
      task_explained:
        "Kad tas būs pabeigts, lapas saturs būs pieejams iegulšanai darba vietās dokumentu atlasītājā.",
      bypass_ssl: "Aizvest SSL sertifikāta validācijas",
      bypass_ssl_explained:
        "Aktivizējiet šo opciju, lai pārliecinajas no SSL sertifikāta validācijas, izmantojot pašizveidotā sertifikātu, konfluensā, kas ir pašizveidots.",
    },
    manage: {
      documents: "Dokumenti",
      "data-connectors": "Datu savienotāji",
      "desktop-only":
        "Šo iestatījumu rediģēšana ir pieejama tikai galddatora ierīcē. Lūdzu, piekļūstiet šai lapai savā galddatorā, lai turpinātu.",
      dismiss: "Noraidīt",
      editing: "Rediģēšana",
    },
    directory: {
      "my-documents": "Mani dokumenti",
      "new-folder": "Jauna mape",
      "search-document": "Meklēt dokumentu",
      "no-documents": "Nav dokumentu",
      "move-workspace": "Pārvietot uz darba vietu",
      "delete-confirmation":
        "Vai tiešām vēlaties dzēst šos failus un mapes?\nTas noņems failus no sistēmas un automātiski noņems tos no visām esošajām darba vietām.\nŠī darbība nav atgriezeniska.",
      "removing-message":
        "Notiek {{count}} dokumentu un {{folderCount}} mapju noņemšana. Lūdzu, uzgaidiet.",
      "move-success": "Veiksmīgi pārvietoti {{count}} dokumenti.",
      no_docs: "Nav dokumentu",
      select_all: "Atlasīt visu",
      deselect_all: "Atcelt visu atlasi",
      remove_selected: "Noņemt atlasītos",
      save_embed: "Saglabāt un iegult",
      "total-documents_one": "{{count}} dokumenta",
      "total-documents_other": "{{count}} dokumenti",
    },
    upload: {
      "processor-offline": "Dokumentu apstrādātājs nav pieejams",
      "processor-offline-desc":
        "Mēs nevaram augšupielādēt jūsu failus, jo dokumentu apstrādātājs ir bezsaistē. Lūdzu, mēģiniet vēlāk.",
      "click-upload":
        "Noklikšķiniet, lai augšupielādētu, vai velciet un nometiet",
      "file-types":
        "atbalsta teksta failus, csv, izklājlapas, audio failus un vēl vairāk!",
      "or-submit-link": "vai iesniedziet saiti",
      "placeholder-link": "https://example.com",
      fetching: "Iegūst...",
      "fetch-website": "Iegūt vietni",
      "privacy-notice":
        "Šie faili tiks augšupielādēti dokumentu apstrādātājā, kas darbojas šajā AnythingLLM instancē. Šie faili netiek nosūtīti vai kopīgoti ar trešo pusi.",
    },
    pinning: {
      what_pinning: "Kas ir dokumentu piespraušana?",
      pin_explained_block1:
        "Kad jūs <b>piespraudiet</b> dokumentu AnythingLLM, mēs ievietosim visu dokumenta saturu jūsu uzvednes logā, lai jūsu LLM to pilnībā saprastu.",
      pin_explained_block2:
        "Tas vislabāk darbojas ar <b>liela konteksta modeļiem</b> vai maziem failiem, kas ir kritiski tā zināšanu bāzei.",
      pin_explained_block3:
        "Ja jūs nesaņemat vēlamās atbildes no AnythingLLM pēc noklusējuma, tad piespraušana ir lielisks veids, kā iegūt kvalitatīvākas atbildes ar vienu klikšķi.",
      accept: "Labi, sapratu",
    },
    watching: {
      what_watching: "Ko dara dokumenta novērošana?",
      watch_explained_block1:
        "Kad jūs <b>novērojat</b> dokumentu AnythingLLM, mēs <i>automātiski</i> sinhronizēsim jūsu dokumenta saturu no tā sākotnējā avota regulāros intervālos. Tas automātiski atjauninās saturu katrā darba vietā, kur šis fails tiek pārvaldīts.",
      watch_explained_block2:
        "Šī funkcija pašlaik atbalsta tiešsaistes saturu un nebūs pieejama manuāli augšupielādētiem dokumentiem.",
      watch_explained_block3_start:
        "Jūs varat pārvaldīt, kuri dokumenti tiek novēroti no ",
      watch_explained_block3_link: "Failu pārvaldnieka",
      watch_explained_block3_end: " administratora skata.",
      accept: "Labi, sapratu",
    },
  },
  chat_window: {
    send_message: "Sūtīt ziņojumu",
    attach_file: "Pievienot failu šim čatam",
    text_size: "Mainīt teksta izmēru.",
    microphone: "Izrunājiet savu uzvedni.",
    send: "Nosūtīt uzvednes ziņojumu uz darba vietu",
    attachments_processing: "Faili tiek apstrādāti. Lūdzu, paceliet.",
    tts_speak_message: "TTS run message",
    copy: "Kopēt",
    regenerate: "Atjaunot",
    regenerate_response: "Atjaunot atbildi",
    good_response: "Laba atbilde",
    more_actions: "Vairāk darbību",
    fork: "Klūtis",
    delete: "Dzēst",
    cancel: "Atcelt",
    edit_prompt: "Ieslēgt",
    edit_response: "Rediģēt atbildi",
    preset_reset_description:
      "Izdzēsiet savu pastā veidoتو sarunu vēsturi un sāciet jaunu sarunu.",
    add_new_preset: "Pievienot jaunu iepriekšējo",
    command: "Ordere",
    your_command: "Jūsu komanda",
    placeholder_prompt:
      "Šis ir saturs, kas tiks ievietots pirms jūsu pieprasījuma.",
    description: "Apraksts",
    placeholder_description: "Atbild ar dzeju par lielajiem valodu modeļiem.",
    save: "Saglabāt",
    small: "Mazs.",
    normal: "Normāls",
    large: "Liels",
    workspace_llm_manager: {
      search: "Izmeklē LLM sniedzējus",
      loading_workspace_settings: "Ielāde darba vidējās iestatījumi...",
      available_models: "Pieejamās modeļi: {{provider}}",
      available_models_description:
        "Izvēlieties modeli, ko izmantot šim darba zonai.",
      save: "Izmantojiet šo modeli.",
      saving: "Iestata modeli kā noklusēto darba vietai...",
      missing_credentials:
        "Šim pakalpojuma sniedzējam nav sniegta nekur dokumentēta informācija.",
      missing_credentials_description:
        "Noklikšķiniet, lai konfigurētu autentifikācijas datus",
    },
    submit: "Iesniegt",
    edit_info_user:
      '"Sūtīt" atjauno AI atbildi. "Saglabāt" atjauno tikai jūsu ziņu.',
    edit_info_assistant:
      "Jūsu izmaiņas tiks automātiski saglabātas šajā atbildē.",
    see_less: "Skatīt mazāk",
    see_more: "Skatīt vairāk",
    tools: "Rīki",
    text_size_label: "Teksta izmērs",
    select_model: "Izvēlieties modeli",
    sources: "Avotus",
    document: "Dokuments",
    similarity_match: "spēle",
    source_count_one: "{{count}} – atsauce",
    source_count_other: "Atsauces uz {{count}}",
    preset_exit_description: "Aizust klientu sesiju",
    add_new: "Pievienot jaunu",
    edit: "Rediģēt",
    publish: "Publicēt",
    stop_generating: "Atsauciet atbildes ģenerēšanu",
    slash_commands: "Īs termini komandās",
    agent_skills: "Aģenta prasmes",
    manage_agent_skills: "Iesaista aģenta prasmes",
    agent_skills_disabled_in_session:
      "Nav iespējams mainīt prasmes aktīvā lietotāja sesijā. Pirmais, jāizmanto komandu `/exit`, lai beigtu sesiju.",
    start_agent_session: "Sākt aģenta sesiju",
    use_agent_session_to_use_tools:
      'Jūs varat izmantot rīkus čatā, sākot aģenta sesiju, ievietojot "@agent" jūsu iniciālajā tekstā.',
    agent_invocation: {
      model_wants_to_call: "Modeļa vēlējas izrunāt",
      approve: "Aizmaksā, apstiprināts",
      reject: "Atgrūst",
      always_allow: "Vienmēr nodrošiniet {{skillName}}",
      tool_call_was_approved: "Instrumentu pieprasījums tika apstiprināts.",
      tool_call_was_rejected:
        "Pieprasījums par instrumenta izmantošanu tika atgrūstīts.",
    },
    custom_skills: "Pielāgotas prasmes",
    agent_flows: "Aģentu plūsmas",
    no_tools_found: "Neatradusies atbilstošas instrumentus",
    loading_mcp_servers: "Ielāde MCP serverus...",
    app_integrations: "Dienvidligzdas integrācijas",
    sub_skills: "Īpašās prasmes",
  },
  profile_settings: {
    edit_account: "Rediģēt kontu",
    profile_picture: "Profila attēls",
    remove_profile_picture: "Noņemt profila attēlu",
    username: "Lietotājvārds",
    new_password: "Jauna parole",
    password_description: "Parolei jābūt vismaz 8 rakstzīmes garai",
    cancel: "Atcelt",
    update_account: "Atjaunināt kontu",
    theme: "Tēmas preference",
    language: "Vēlamā valoda",
    failed_upload: "Neizdevās augsēt profilas attēlu: {{error}}",
    upload_success: "Profila attēls ir augšupielādēts.",
    failed_remove: "Neizdevās noņemt profilbildi: {{error}}",
    profile_updated: "Profils atjaunināts.",
    failed_update_user: "Neizdevās atjaunināt lietotāju: {{error}}",
    account: "Konta",
    support: "Atbalsts",
    signout: "Iziet",
  },
  "keyboard-shortcuts": {
    title: "Taustiņu atvieglojumi",
    shortcuts: {
      settings: "Atvērt iestatījumus",
      workspaceSettings: "Atvērt pašreizējās darba vides iestatījumus",
      home: "Pārvietojieties uz sākuma lapu",
      workspaces: "Administrējiet darba vietas",
      apiKeys: "API atslēgas – iestatījumi",
      llmPreferences: "LLM prioritātes",
      chatSettings: "Pieskaites iestatījumi",
      help: "Rādīt tastatūras atvērto palīdzības",
      showLLMSelector: "LLM izvēles rīks",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Veiksmi!",
        success_description:
          'Jūsu sistēmas iniciatīva ir publicēta "Community Hub" platformā!',
        success_thank_you: "Paldies par dalīšanos ar komunitāti!",
        view_on_hub: "Skatīt Community Hub",
        modal_title: "Publicēšanas sistēmas iniciatīva",
        name_label: "Jānis",
        name_description: "Šis ir jūsu sistēmas komandas nosaukums.",
        name_placeholder: "Mana sistēmas iniciatīva",
        description_label: "Apraksts",
        description_description:
          "Šis ir jūsu sistēmas iniciatīvas apraksts. Izmantojiet to, lai aprakstītu jūsu sistēmas iniciatīvas mērķi.",
        tags_label: "Atzīmes",
        tags_description:
          "Atzīmes tiek izmantotas, lai atzīmētu jūsu sistēmas iniciatīvu, lai to vieglāk atrastu. Jūs varat pievienot vairākas atzīmes. Maks 5 atzīmes. Katrai atzīmei – maksimāli 20 raksti.",
        tags_placeholder:
          'Ievietojiet tekstu un nospiediet "Enter", lai pievienotu atzīmes',
        visibility_label: "Redzamība",
        public_description: "Vispārējās sistēmas aicinājumi ir redzami visiem.",
        private_description:
          "Privātā sistēmas paziņojumi ir redzami tikai jums.",
        publish_button: "Publicē savu saturu Community Hub.",
        submitting: "Izdevniecība...",
        prompt_label: "Ieslēgt",
        prompt_description:
          "Šis ir tiešais sistēmas prompts, kas tiks izmantots, lai vadītu LLM.",
        prompt_placeholder: "Ievietojiet savu sistēmas komandu šeit...",
      },
      agent_flow: {
        success_title: "Veiksmi!",
        success_description:
          'Jūsu "Agent Flow" ir publicēts "Community Hub" platformā!',
        success_thank_you: "Paldies par dalīšanos ar kopienu!",
        view_on_hub: "Skatīt Community Hub",
        modal_title: "Publicēšanas aģenta darbības",
        name_label: "Jānis",
        name_description: "Šis ir jūsu aģenta darbības norises nosaukums.",
        name_placeholder: "Mana aģenta darbība",
        description_label: "Apraksts",
        description_description:
          "Šis ir jūsu aģenta darbības apraksts. Izmantojiet to, lai aprakstītu jūsu aģenta darbības mērķi.",
        tags_label: "Atzīmes",
        tags_description:
          "Atzīmes tiek izmantotas, lai atzīmētu jūsu aģenta darbplūsmu, lai to būtu vieglāk atrast. Jūs varat pievienot vairākas atzīmes. Maks 5 atzīmes. Katrai atzīmei – maksimāli 20 raksti.",
        tags_placeholder:
          'Ievietojiet tekstu un nospiediet "Enter", lai pievienotu atzīmes',
        visibility_label: "Redzamība",
        submitting: "Izdevniecība...",
        submit: "Publicē savu saturu Community Hub.",
        privacy_note:
          'Dati tiek augšupielādēti kā privāti, lai aizsargātu jebkādus citus datus. Pēc publicēšanas varat mainīt redzamības iestatījumus "Sabiedrības centrā". Lūdzu, pārliecinieties, ka jūsu dati nesatur nevienu citu vai privātu informāciju, pirms publicēšanas.',
      },
      generic: {
        unauthenticated: {
          title: "Nepieciešama autentifikācija",
          description:
            'Pirms satura publicēšanas ir jāiespējo autentifikācija "AnythingLLM" sabiedrības centrā.',
          button: "Pievienojieties sabiedrības centram",
        },
      },
      slash_command: {
        success_title: "Veiksmi!",
        success_description:
          'Jūsu "Slash Command" ir publicēts "Community Hub"!',
        success_thank_you: "Paldies par dalīšanos ar kopienu!",
        view_on_hub: "Skatīt Community Hub",
        modal_title: "Publicējiet Slash komandu",
        name_label: "Jānis",
        name_description: "Šis ir jūsu komandas nosaukums.",
        name_placeholder: "Mana Slash komanda",
        description_label: "Apraksts",
        description_description:
          "Šis ir jūsu komandas apraksts. Izmantojiet to, lai aprakstītu jūsu komandas mērķi.",
        tags_label: "Atzīmes",
        tags_description:
          "Atzīmes tiek izmantotas, lai atzīmētu jūsu komandu, kas ļauj vieglāk meklēt. Jūs varat pievienot vairākas atzīmes. Maks 5 atzīmes. Katrai atzīmei – maksimāli 20 raksti.",
        tags_placeholder:
          "Ierakstiet un nospiediet Enter, lai pievienotu atzīmes",
        visibility_label: "Redzamība",
        public_description: "Vispārīgie komandas vārdi ir redzami visiem.",
        private_description: "Vietiski komandu komandās var redzēt tikai jūs.",
        publish_button: "Publicē savu saturu Community Hub.",
        submitting: "Izdevniecība...",
        prompt_label: "Ieslēgt",
        prompt_description:
          "Šis ir komandu, kas tiks izmantots, kad tiks aktivizēta slashes komanda.",
        prompt_placeholder: "Ievietojiet savu pieprasījumu šeit...",
      },
    },
  },
  security: {
    title: "Drošība",
    multiuser: {
      title: "Vairāklietotāju režīms",
      description:
        "Iestatiet savu instanci, lai atbalstītu jūsu komandu, aktivizējot vairāklietotāju režīmu.",
      enable: {
        "is-enable": "Vairāklietotāju režīms ir iespējots",
        enable: "Iespējot vairāklietotāju režīmu",
        description:
          "Pēc noklusējuma jūs būsiet vienīgais administrators. Kā administrators jums būs jāizveido konti visiem jaunajiem lietotājiem vai administratoriem. Nezaudējiet savu paroli, jo tikai administratora lietotājs var atiestatīt paroles.",
        username: "Administratora konta lietotājvārds",
        password: "Administratora konta parole",
      },
    },
    password: {
      title: "Aizsardzība ar paroli",
      description:
        "Aizsargājiet savu AnythingLLM instanci ar paroli. Ja aizmirsīsiet šo paroli, nav atgūšanas metodes, tāpēc pārliecinieties, ka saglabājat šo paroli.",
      "password-label": "Instances paroles",
    },
  },
  home: {
    welcome: "Laipni lūgti",
    chooseWorkspace: "Izvēlies darba vietu, lai sāktu čatu!",
    notAssigned:
      "Jūs nav piešķirts nevienai darba vietai.\nLūdzu, sazinieties ar savu administratoru, lai pieprasītu piekļuvi darba vietai.",
    goToWorkspace: 'Pāriet uz darba vietu "{{workspace}}"',
  },
  telegram: {
    title: "Telegram bot",
    description:
      "Iespējiet savu AnythingLLM instanci, lai varētu tikt savienots ar Telegram, un tāpēc varēsat runāt ar saviem darba grupām no jebkura ierīces.",
    setup: {
      step1: {
        title: "1. darbība: Izveidot savu Telegram botu",
        description:
          "Atveriet `@BotFather` Telegramā, nosūtiet `/newbot` un ievietojiet to adresē <code>@BotFather</code>, sekojiet norādījumiem un kopējiet API atslēgu.",
        "open-botfather": "Atvērt BotFather",
        "instruction-1": "1. Atveriet saiti vai skenējiet QR kodu",
        "instruction-2":
          "2. Nosūtiet <code>/newbot</code> uz <code>@BotFather</code>",
        "instruction-3":
          "3. Izvēlieties nosaukumu un lietotājvārdu savam botam",
        "instruction-4": "4. Kopējiet API atslēgu, ko saņemat",
      },
      step2: {
        title: "2. darbība: Pievienojiet savu botu",
        description:
          "Ievietojiet API atslēgu, ko saņēsit no @BotFather, un izvēlieties nokārtotā darba telpu, kuras jūsu bots varēs veikt sazi.",
        "bot-token": "Bots tokens",
        connecting: "Savienojums...",
        "connect-bot": "Saistītais bot",
      },
      security: {
        title: "Ieteicamās drošības iestatījumi",
        description:
          "Lai nodrošinātu papildu drošību, konfigurējiet šos iestatījumus, izmantojot @BotFather.",
        "disable-groups": "— Novērst, lai boti tiktu pievienoti grupām",
        "disable-inline":
          "— Novērst, lai bots tiktu izmantoti tiešajā meklēšanā.",
        "obscure-username":
          "Izmantojiet neparādu botu lietotāju vārdu, lai samazinātu atklājamo iespēju.",
      },
      "toast-enter-token": "Lūdzu, ievadiet bot tokenu.",
      "toast-connect-failed": "Neizdevās pievienot botu.",
    },
    connected: {
      status: "Saistīts",
      "status-disconnected":
        "Atvienots — tokens var būt nolaidēts vai nederīgs",
      "placeholder-token": "Ievietojiet jaunu bot tokenu...",
      reconnect: "Atjaunot sazi",
      workspace: "Darba telpa",
      "bot-link": "Bots saite",
      "voice-response": "Balss atbildes",
      disconnecting: "Atvienojot...",
      disconnect: "Izslēgt",
      "voice-text-only": "Tikai teksts",
      "voice-mirror":
        "Atspoguļošana (atbildēt ar balsi, kad lietotājs nosauc balsi)",
      "voice-always":
        "Vienmēr pievienojiet audio (sūtiet audio ar katru atbildi).",
      "toast-disconnect-failed": "Neizdevās izslēgt botu.",
      "toast-reconnect-failed": "Neizdevās atjaunot saikni ar botu.",
      "toast-voice-failed": "Neizdevās atjaunināt balsī noteiktās režimas.",
      "toast-approve-failed": "Nespēja apstiprināt lietotāju.",
      "toast-deny-failed": "Nespēja atspējot lietotāju.",
      "toast-revoke-failed": "Neizdevās atcelt lietotāja tiesības.",
    },
    users: {
      "pending-description":
        "Izmantotāji, kas gaida apstiprinājumu. Salīdziniet šeit norādīto koda numuru ar to, kas redzams viņu Telegram sarunā.",
      unknown: "Nezināms",
    },
  },
};

export default TRANSLATIONS;
