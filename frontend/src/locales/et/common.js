// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Alusta",
      welcome: "Tere tulemast",
    },
    llm: {
      title: "LLM-i eelistus",
      description:
        "AnythingLLM töötab paljude LLM-teenusepakkujatega. See teenus haldab vestlust.",
    },
    userSetup: {
      title: "Kasutaja seadistus",
      description: "Seadista oma kasutajasätted.",
      howManyUsers: "Mitu kasutajat seda instantsi kasutab?",
      justMe: "Ainult mina",
      myTeam: "Minu meeskond",
      instancePassword: "Instantsi parool",
      setPassword: "Kas soovid parooli seadistada?",
      passwordReq: "Parool peab olema vähemalt 8 märki.",
      passwordWarn:
        "Salvesta see parool hoolikalt, sest taastamisvõimalust ei ole.",
      adminUsername: "Admini kasutajanimi",
      adminPassword: "Admini parool",
      adminPasswordReq: "Parool peab olema vähemalt 8 märki.",
      teamHint:
        "Vaikimisi oled ainus administraator. Pärast häälestust saad luua ning kutsuda teisi kasutajaid või administreerida neid. Parooli kaotamisel saab paroole lähtestada vaid administraator.",
    },
    data: {
      title: "Andmetöötlus ja privaatsus",
      description:
        "Oleme pühendunud läbipaistvusele ning kontrollile sinu andmete osas.",
      settingsHint: "Neid sätteid saab igal ajal seadetes muuta.",
    },
    survey: {
      title: "Tere tulemast AnythingLLM-i",
      description:
        "Aita meil AnythingLLM sinu vajadustele vastavaks kujundada. Valikuline.",
      email: "Mis on su e-post?",
      useCase: "Milleks kasutad AnythingLLM-i?",
      useCaseWork: "Töö jaoks",
      useCasePersonal: "Isiklikuks kasutuseks",
      useCaseOther: "Muu",
      comment: "Kust kuulsid AnythingLLM-ist?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube jne – anna meile teada!",
      skip: "Jäta vahele",
      thankYou: "Aitäh tagasiside eest!",
    },
  },
  common: {
    "workspaces-name": "Tööruumide nimi",
    selection: "Mudeli valik",
    saving: "Salvestan…",
    save: "Salvesta muudatused",
    previous: "Eelmine leht",
    next: "Järgmine leht",
    optional: "Valikuline",
    yes: "Jah",
    no: "Ei",
    search: "otsing",
    username_requirements:
      "Kasutajanimi peab olema 2–32 tähemärki, algama väiketähega ning sisaldama ainult väiketähti, numbreid, alakriipse, sidekriipse ja punkte.",
    on: "On",
    none: "Ei",
    stopped: "Peatas",
    loading: "Laadimine",
    refresh: "Värskendada",
  },
  settings: {
    title: "Instantsi seaded",
    invites: "Kutsed",
    users: "Kasutajad",
    workspaces: "Tööruumid",
    "workspace-chats": "Tööruumi vestlused",
    customization: "Kohandamine",
    interface: "Kasutajaliidese eelistused",
    branding: "Bränding ja valgesildistamine",
    chat: "Vestlus",
    "api-keys": "Arendaja API",
    llm: "LLM",
    transcription: "Transkriptsioon",
    embedder: "Embeddija",
    "text-splitting": "Teksti lõikamine ja tükeldus",
    "voice-speech": "Hääle ja kõne seaded",
    "vector-database": "Vektoriandmebaas",
    embeds: "Vestluse embed",
    security: "Turvalisus",
    "event-logs": "Sündmuste logid",
    privacy: "Privaatsus ja andmed",
    "ai-providers": "AI-pakkujad",
    "agent-skills": "Agendi oskused",
    admin: "Admin",
    tools: "Tööriistad",
    "system-prompt-variables": "Süsteemprompti muutujad",
    "experimental-features": "Eksperimentaalsed funktsioonid",
    contact: "Tugi",
    "browser-extension": "Brauserilaiend",
    "mobile-app": "AnythingLLM mobiilversioon",
    "community-hub": {
      title: "Kogukonna keskpunkt",
      trending: "Avasta populaarseid",
      "your-account": "Teie konto",
      "import-item": "Importeeritud toode",
    },
    channels: "Kaasavad",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Planeeritud tööd",
  },
  login: {
    "multi-user": {
      welcome: "Tere tulemast",
      "placeholder-username": "Kasutajanimi",
      "placeholder-password": "Parool",
      login: "Logi sisse",
      validating: "Kontrollin…",
      "forgot-pass": "Unustasid parooli",
      reset: "Lähtesta",
    },
    "sign-in": "Logi sisse oma {{appName}} kontosse.",
    "password-reset": {
      title: "Parooli lähtestamine",
      description: "Sisesta all vajalik info, et parool lähtestada.",
      "recovery-codes": "Taastamiskoodid",
      "back-to-login": "Tagasi sisselogimisele",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Loo agent",
      editWorkspace: "Redige tööruum",
      uploadDocument: "Lae fail üles",
    },
    greeting: "Kuidas saan teid täna aidata?",
  },
  "new-workspace": {
    title: "Uus tööruum",
    placeholder: "Minu tööruum",
  },
  "workspaces—settings": {
    general: "Üldseaded",
    chat: "Vestluse seaded",
    vector: "Vektoriandmebaas",
    members: "Liikmed",
    agent: "Agendi konfiguratsioon",
  },
  general: {
    vector: {
      title: "Vektorite arv",
      description: "Vektorite koguarv sinu vektoriandmebaasis.",
    },
    names: {
      description: "See muudab ainult tööruumi kuvatavat nime.",
    },
    message: {
      title: "Soovitatud vestlussõnumid",
      description: "Kohanda sõnumeid, mida tööruumi kasutajatele soovitatakse.",
      add: "Lisa uus sõnum",
      save: "Salvesta sõnumid",
      heading: "Selgita mulle",
      body: "AnythingLLM eeliseid",
    },
    delete: {
      title: "Kustuta tööruum",
      description:
        "Kustuta see tööruum ja kõik selle andmed. See eemaldab tööruumi kõikidele kasutajatele.",
      delete: "Kustuta tööruum",
      deleting: "Kustutan tööruumi…",
      "confirm-start": "Oled kustutamas kogu",
      "confirm-end":
        "tööruumi. See eemaldab kõik vektorid vektoriandmebaasist.\n\nAlgseid faile ei puudutata. Tegevust ei saa tagasi võtta.",
    },
  },
  chat: {
    llm: {
      title: "Tööruumi LLM-pakkuja",
      description:
        "LLM-pakkuja ja mudel, mida selles tööruumis kasutatakse. Vaikimisi kasutatakse süsteemi LLM-seadeid.",
      search: "Otsi LLM-pakkujaid",
    },
    model: {
      title: "Tööruumi vestlusmudel",
      description:
        "Vestlusmudel, mida tööruumis kasutatakse. Kui tühi, kasutatakse süsteemi LLM-eelistust.",
    },
    mode: {
      title: "Vestlusrežiim",
      chat: {
        title: "Vestlus",
        description:
          "teenab vastuseid, kasutades LLM-i üldist teadmist ja dokumenti konteksti, mis on leitav.<br /> Selleks peate kasutama @agent käsku, et kasutada erinevaid tööriime.",
      },
      query: {
        title: "Päring",
        description:
          'teenib vastuseid <b> ainult__, kui dokumendi kontekst on leitav.</b> Vajate kasutama käitu "@agent", et kasutada tööriime.',
      },
      automatic: {
        description:
          'kasutab automaatselt tööriistu, kui mudel ja pakkuja toetavad native töörieste kasutamist. <br />Kui native töörieste kasutamine ei toeta, peate kasutama käsku "@agent", et tööriiste kasutada.',
        title: "Esindaja",
      },
    },
    history: {
      title: "Vestlusajalugu",
      "desc-start": "Eelmiste sõnumite arv, mis kaasatakse vastuse lühimällu.",
      recommend: "Soovitatav 20. ",
      "desc-end": "Üle 45 võib sõltuvalt sõnumi suurusest põhjustada tõrkeid.",
    },
    prompt: {
      title: "Süsteemprompt",
      description:
        "Prompt, mida tööruumis kasutatakse. Määra kontekst ja juhised, et AI toodaks asjakohase vastuse.",
      history: {
        title: "Süsteempromptide ajalugu",
        clearAll: "Tühjenda kõik",
        noHistory: "Ajalugu puudub",
        restore: "Taasta",
        delete: "Kustuta",
        publish: "Avalda kogukonnas",
        deleteConfirm: "Kas oled kindel, et soovid selle kirje kustutada?",
        clearAllConfirm:
          "Kas oled kindel, et soovid kogu ajaloo tühjendada? Tegevus on pöördumatu.",
        expand: "Laienda",
      },
    },
    refusal: {
      title: "Päringurežiimi keeldumisteade",
      "desc-start": "Kui ollakse",
      query: "päringu",
      "desc-end":
        "režiimis, võib määrata kohandatud vastuse, kui konteksti ei leita.",
      "tooltip-title": "Miks ma seda näen?",
      "tooltip-description":
        "Olete küsimise režiimis, mis kasutab ainult teie dokumentidest saadavat teavet. Valige vestlemise režiim, et pidada paindlikumaid vestlusi, või klõpsake siin, et külastada meie dokumentatsiooni ja saada lisateavet vestlemise režiimide kohta.",
    },
    temperature: {
      title: "LLM-i temperatuur",
      "desc-start": 'Määrab, kui "loovad" vastused on.',
      "desc-end":
        "Kõrgem väärtus = loovam, ent liiga kõrge võib tekitada ebaühtlasi vastuseid.",
      hint: "Kontrolli pakkujalt lubatud vahemikke.",
    },
  },
  "vector-workspace": {
    identifier: "Vektoriandmebaasi identifikaator",
    snippets: {
      title: "Maksimaalne konteksti lõikude arv",
      description:
        "Maksimaalne lõikude arv, mis saadetakse LLM-ile ühe vestluse/päringu kohta.",
      recommend: "Soovitatav: 4",
    },
    doc: {
      title: "Dokumendi sarnasuse lävi",
      description:
        "Minimaalne sarnasusskoor, et allikas oleks vestlusega seotud. Mida kõrgem, seda sarnasem peab allikas olema.",
      zero: "Piirang puudub",
      low: "Madal (≥ 0,25)",
      medium: "Keskmine (≥ 0,50)",
      high: "Kõrge (≥ 0,75)",
    },
    reset: {
      reset: "Lähtesta vektoriandmebaas",
      resetting: "Puhastan vektoreid…",
      confirm:
        "Lähtestad selle tööruumi vektoriandmebaasi. Kõik vektorid eemaldatakse.\n\nAlgseid faile ei puudutata. Tegevus on pöördumatu.",
      error: "Vektoriandmebaasi lähtestamine ebaõnnestus!",
      success: "Vektoriandmebaas lähtestati!",
    },
  },
  agent: {
    "performance-warning":
      "Mudelite, mis ei toeta tööriistakutsumisi, jõudlus sõltub tugevalt mudeli võimest. Mõned funktsioonid võivad olla piiratud.",
    provider: {
      title: "Tööruumi agendi LLM-pakkuja",
      description:
        "LLM-pakkuja ja mudel, mida kasutatakse @agent agendi jaoks.",
    },
    mode: {
      chat: {
        title: "Tööruumi agendi vestlusmudel",
        description: "Vestlusmudel, mida @agent agendi jaoks kasutatakse.",
      },
      title: "Tööruumi agendi mudel",
      description: "LLM-mudel, mida @agent agendi jaoks kasutatakse.",
      wait: "-- laadib mudeleid --",
    },
    skill: {
      rag: {
        title: "RAG ja pikaajaline mälu",
        description:
          'Lubab agendil kasutada kohalikke dokumente vastamiseks või "meelde jätmiseks".',
      },
      view: {
        title: "Vaata ja kokkuvõtlikusta dokumente",
        description:
          "Lubab agendil loetleda ja kokku võtta praegu põimitud faile.",
      },
      scrape: {
        title: "Kraabi veebilehti",
        description: "Lubab agendil külastada ja kraapida veebisisu.",
      },
      generate: {
        title: "Loo diagramme",
        description: "Lubab agendil luua erinevaid diagramme antud andmetest.",
      },
      web: {
        title: "Reaalajas veebihaku tugi",
        description:
          "Lisage oma esindajale võimalus veebis otsida, et vastata teie küsimustele, ühendades selle veebiotsingu (SERP) teenusega.",
      },
      sql: {
        title: "SQL-i ühendus",
        description:
          "Tagage, et teie esindaja saaks kasutada SQL-i, et vastata teie küsimustele, ühendades erinevate SQL andmebaasiteenustega.",
      },
      default_skill:
        "Vaikimisi on see funktsioon lubatud, kuid saate seda välja lülitada, kui ei soovi, et see oleks saadaval kaagentile.",
      filesystem: {
        title: "Failisüsteemi juurdepääs",
        description:
          "Lisage oma agentile võimalus lugeda, kirjutada, otsida ja hallata faili, mis asub kindlalt määratud kaustas. Toetab failide redakteerimist, kaustade navigeerimist ja sisu otsimist.",
        learnMore: "Lisateabe saamiseks, kuidas seda oskust kasutada",
        configuration: "Konfiguratsioon",
        readActions: "Leia toimingud",
        writeActions: "Toimingud",
        warning:
          "Failisüsteemi juurimine võib olla ohtlik, kuna see võib muuta või kustutada faile. Enne selle aktiveerimist, palun vaadake <a>dokumentatsiooni</a>.",
        skills: {
          "read-text-file": {
            title: "Ava fail",
            description:
              "Leia failide sisu (tekst, kood, PDF-failid, pildid jne)",
          },
          "read-multiple-files": {
            title: "Lugege mitut faili",
            description: "Lugege mitut faili üheaegselt",
          },
          "list-directory": {
            title: "Loend",
            description: "Looge failide ja kaustade loend ühes kaustas",
          },
          "search-files": {
            title: "Failide otsimine",
            description: "Leidke failid nime või sisu järgi",
          },
          "get-file-info": {
            title: "Hankige faili teave",
            description: "Hankige üksikasjalik teavet failide kohta",
          },
          "edit-file": {
            title: "Faili redigeerimine",
            description: "Muuda teksti failide sisu rida- järgselt.",
          },
          "create-directory": {
            title: "Loo kaust",
            description: "Loo uusi kahteid",
          },
          "move-file": {
            title: "Faili liiguta/nime muuda",
            description: "Liigu või nime muuta failid ja kaardid",
          },
          "copy-file": {
            title: "Kopeeri fail",
            description: "Kopeeri failid ja kaardi",
          },
          "write-text-file": {
            title: "Loo teksti fail",
            description:
              "Loo uusi teksti faili või asenda olemasolevaid teksti faile",
          },
        },
      },
      createFiles: {
        title: "Dokumendi koostamine",
        description:
          "Laske oma esindajal luua binaarsed dokumendiformaadid, näiteks PowerPointi esitlused, Exceli lehed, Wordi dokumendid ja PDF-failid. Failid saab alla laadida otse vestlusaknast.",
        configuration: "Saadaval olevad dokumendi tüübid",
        skills: {
          "create-text-file": {
            title: "Tekstifailid",
            description:
              "Loo teksti failid, milles on mis tahes sisu ja laiendus (esimärkid .txt, .md, .json, .csv jne).",
          },
          "create-pptx": {
            title: "PowerPointi esitlused",
            description:
              "Loo uusi PowerPointi esitlusi, mis sisaldavad slaidide, pealkirjade ja punktide.",
          },
          "create-pdf": {
            title: "PDF-failid",
            description:
              "Loo PDF-failid Markdown- või tavaline tekstist, kasutades lihtsaid stiilid",
          },
          "create-xlsx": {
            title: "Excel-i lehed",
            description:
              "Loo Excel-failid, mis sisaldavad tabeli andmeid, lehtede ja stiilidega.",
          },
          "create-docx": {
            title: "Microsoft Word-failid",
            description:
              "Loo Microsoft Wordi dokumende, kasutades põhise stiili ja vormistuse",
          },
        },
      },
      gmail: {
        title: "GMail-iga ühendamine",
        description:
          "Lase oma esindajal interakteeruda Gmailiga – otsida e-kirju, lugeda teemasid, luua esialgseid versioone, saatada e-kirju ja hallata oma postkasti. <a>Vaata dokumentatsiooni</a>.",
        multiUserWarning:
          "Gmaili integreerimine ei ole saadaval mitme kasutaja režiimis turvalisuse huvides. Palun deaktiveerige mitme kasutaja režiim, et kasutada seda funktsiooni.",
        configuration: "Gmaili seadmine",
        deploymentId: "Paigaldamis ID",
        deploymentIdHelp: "Veebirakenduse Google Apps Scripti ID",
        apiKey: "API võti",
        apiKeyHelp:
          "API võti, mida olete konfigureerinud oma Google Apps Scripti rakenduses.",
        configurationRequired:
          'Palun konfigureerige "Deployment ID" ja API võti, et Gmaili funktsionaalsus oleks aktiivne.',
        configured: "Konfigureeritud",
        searchSkills: "otsinguteadused...",
        noSkillsFound: "Leidke ei leitud sobivaid oskusi teie otsingu põhjal.",
        categories: {
          search: {
            title: "Leia ja luge e-kirju",
            description: "Kutsutage ja looge Gmaili postkasti olevad e-kirjad",
          },
          drafts: {
            title: "Esimesed kirjad",
            description: "Loo, muuda ja hallata e-kirjade projekte",
          },
          send: {
            title: "Saada ja vastata e-kirjadele",
            description: "Saada e-kirju ja vastata teemades kohe",
          },
          threads: {
            title: "Hallata e-kirjade seeriaid",
            description:
              "Hallata e-posti vestlusi – märgistada kui lugemata/lugemata, salvestada, kustutada",
          },
          account: {
            title: "Integreerimise statistika",
            description: "Vaata postkasti statistikat ja konto teavet.",
          },
        },
        skills: {
          search: {
            title: "E-kirjade otsing",
            description: "Kutse e-kirju Gmaili küsimismängu sintaksiga",
          },
          readThread: {
            title: "Loe teemat",
            description: "Vaata kogu e-kirjade sarja ID järgi",
          },
          createDraft: {
            title: "Loo esialgne versioon",
            description: "Loo uus e-posti eelnäide",
          },
          createDraftReply: {
            title: "Loo esialgne vastus",
            description: "Loo esialgne vastus olemasolevale teemale.",
          },
          updateDraft: {
            title: "Väljaanne",
            description: "Värskendada olemasolevat e-kirja projekti",
          },
          getDraft: {
            title: "Vaata esialgne versioon",
            description: "Taasta konkreetne versioon ID-täringuga",
          },
          listDrafts: {
            title: "Esialgne versioon",
            description: "Loeda kõik e-kirjade plaani",
          },
          deleteDraft: {
            title: "Hüvata projekti",
            description: "Hüvata e-kirja, mis on loodud",
          },
          sendDraft: {
            title: "Saada projekti",
            description: "Saada olemasolev e-kirja esialgne versioon",
          },
          sendEmail: {
            title: "Saatke e-kiri",
            description: "Saatke e-kiri kohe",
          },
          replyToThread: {
            title: "Vastata teemale",
            description: "Vasta e-posti teemale kohe",
          },
          markRead: {
            title: "Mark Read",
            description: "Märki, et teema on lugemata.",
          },
          markUnread: {
            title: "Märgi kui vaatamata",
            description: "Märki, et teema on lugemata",
          },
          moveToTrash: {
            title: "Saada jäätmeteks",
            description: "Liigu teema prügikasti",
          },
          moveToArchive: {
            title: "Arhiiv",
            description: "Salvatage teema",
          },
          moveToInbox: {
            title: "Liiguta postkasti",
            description: 'Liiga "Saadud" pildile',
          },
          getMailboxStats: {
            title: "Postkasti statistika",
            description:
              "Vaata, mitu ebakirjutatud kirja on, ning postkasti statistikat.",
          },
          getInbox: {
            title: "Ava postkasti",
            description:
              "Lihtne viis, kuidas saada Gmailist oma postkasti e-kirjad.",
          },
        },
      },
      outlook: {
        title: "Outlooki ühineja",
        description:
          "Laske oma agentil interakteeruda Microsoft Outlookiga – otsida e-kirju, lugeda teemasid, luua esialgseid versioone, saata e-kirju ja hallata oma postkasti Microsoft Graph API kaudu. <a>Vaata dokumentatsiooni</a>.",
        multiUserWarning:
          "Outlooki integratsioon ei ole saadaval mitme kasutaja režiimis turvalisuse huvides. Palun deaktiveeri mitme kasutaja režiim, et kasutada seda funktsiooni.",
        configuration: "Outlooki seadistamine",
        authType: "Kontoti tüüp",
        authTypeHelp:
          'Valige, milliseid Microsofti kontode tüüpe saab autentida. "Kõik kontod" toetab nii isiklikke kui ka töö- või kooli kontode. " ainult isiklikud kontod" piirab kasutamise ainult isikliktega Microsofti kontodega. " ainult organisatsioonile kuuluvad kontod" piirab kasutamise ainult töö- või kooli kontodega, mis kuuluvad konkreetsele Azure AD kliendile.',
        authTypeCommon: "Kõik kontod (personaalsed ja töö/kooli kontod)",
        authTypeConsumers: "V ainult isiklikud Microsofti kontod",
        authTypeOrganization:
          "Vain organisatsioonide kontod (vajalik Rentniku ID)",
        clientId: "Rakenduse (kliendi) ID",
        clientIdHelp:
          "Rakenduse (kliendi) ID, mis on teie Azure AD rakenduse registreerimisel saadud",
        tenantId: "Kinnitusnumber (kasutaja)",
        tenantIdHelp:
          '"Kinnitusnumber (kasutaja) teie Azure AD rakenduse registreerimise kohta. Nii on vaja ainult organisatsioonide enda autentimiseks."',
        clientSecret: "Klientide andmetest saadava teabe turvaandlik kood",
        clientSecretHelp:
          "Klientide andmevara, mis on saadaval teie Azure AD rakenduse registreerimisel",
        configurationRequired:
          "Palun konfigureerige kliendi ID ja kliendi salavai, et Outlooki funktsioonid oleksid saadaval.",
        authRequired:
          "Esiteks salvestage oma andmed, seejärel käivitage Microsoftiga autentimine, et lõpule viia seadistamine.",
        authenticateWithMicrosoft:
          "Veenduge, et olete Microsoftiga sisselogitud",
        authenticated: "Eduka autentimine Microsoft Outlook-iga.",
        revokeAccess: "Tõsta juurdepääsu kaotamine",
        configured: "Konfigureeritud",
        searchSkills: "otsinguteadused...",
        noSkillsFound: "Sellele andmetele ei leitud sobivaid tulemusi.",
        categories: {
          search: {
            title: "Abi otsimiseks ja e-kirjade lugemiseks",
            description: "Kavatu ja loe oma Outlooki postkasti e-kirju",
          },
          drafts: {
            title: "Esimesed kirjad",
            description: "Loo, muuda ja hallata e-kirjade plaane",
          },
          send: {
            title: "Saada e-kirju",
            description: "Saada uusi e-kirju või vastata teatele kohe",
          },
          account: {
            title: "Integreerimise statistika",
            description: "Vaata postkasti statistikat ja kontoinformatsiooni",
          },
        },
        skills: {
          getInbox: {
            title: "Ava postkasti",
            description: "Vaata viimaseid e-kirju oma Outlook postkasti",
          },
          search: {
            title: "E-kirjade otsing",
            description: "Kõnede otsimiseks kasutage Microsofti otsingusünkt.",
          },
          readThread: {
            title: "Loe vestluse",
            description: "Vaata kogu e-kirjade vestluse täisteksti",
          },
          createDraft: {
            title: "Loo esialgne versioon",
            description:
              "Loo uus e-kirja versioon või uus vastamine olemasolevale kirja kohta.",
          },
          updateDraft: {
            title: "Versiooni uuendamine",
            description: "Värskendada olemasolevat e-kirja versiooni",
          },
          listDrafts: {
            title: "Esialgne versioon",
            description: "Loeda kõik eelnevate kirjade nimekiri",
          },
          deleteDraft: {
            title: "Hüvata projekti",
            description: "Hüvida kirjalik e-kiri",
          },
          sendDraft: {
            title: "Saada esialgne versioon",
            description: "Saada olemasolev e-kirja esialgne versioon",
          },
          sendEmail: {
            title: "Saada e-kiri",
            description:
              "Saada uus e-kiri või vastata olemasolevale sõnule kohe",
          },
          getMailboxStats: {
            title: "Postkasti statistika",
            description: "Vaata kaustade arvu ja postkasti statistikat",
          },
        },
      },
      googleCalendar: {
        title: "Google Kalendri ühendaja",
        description:
          "Lisage oma esindajale võimalus interakteeruda Google Kalendriga – vaadake kalendreid, hankige sündmusi, looge ja uuendage sündmusi ning hallake vastuvõtuid. <a>Vaadake dokumentatsiooni</a>.",
        multiUserWarning:
          "Google Kalendri integreerimine ei ole saadaval mitme kasutaja režiimis turvalisuse huvides. Palun deaktiveeri mitme kasutaja režiim, et kasutada seda funktsiooni.",
        configuration: "Google Kalendri seadistamine",
        deploymentId: "Paigutuse ID",
        deploymentIdHelp: "Veebirakenduse Google Apps Scripti ID",
        apiKey: "API võtme",
        apiKeyHelp:
          "API võti, mida olete konfigureerinud oma Google Apps Scripti rakenduses.",
        configurationRequired:
          'Palun konfigureerige "Deployment ID" ja API võti, et Google Calendar funktsionaalsus oleks aktiivne.',
        configured: "Konfigureeritud",
        searchSkills: "otsinguteadused...",
        noSkillsFound: "Sellele andmetele ei leitud sobivaid tulemusi.",
        categories: {
          calendars: {
            title: "Kalendrid",
            description: "Vaata ja hallata oma Google kalendeid",
          },
          readEvents: {
            title: "Vaata üritusi",
            description: "Vaata ja otsi kalendri sündmusi",
          },
          writeEvents: {
            title: "Loo ja uuenda üritusi",
            description: "Loo uusi üritusi ja muuda olemasolevaid",
          },
          rsvp: {
            title: "Vabatahtlikkuse registreerimise juhtimine",
            description: "Halda oma vastuse staatuse sündmustele",
          },
        },
        skills: {
          listCalendars: {
            title: "Kalendrid",
            description:
              "Loole kõik kalendrid, mille te omate või millele olete registreeritud.",
          },
          getCalendar: {
            title: "Hankige kalendri üksikasjad",
            description:
              "Hankige üksikasjalikke andmeid konkreetse kalendri kohta",
          },
          getEvent: {
            title: "Saada ürituse info",
            description:
              "Hankige üksikasjalikku teavet konkreetse ürituse kohta",
          },
          getEventsForDay: {
            title: "Leidke üritused selle päeva jaoks",
            description:
              "Vaata kõiki üritusi, mis on planeeritud konkreetsele päeval",
          },
          getEvents: {
            title: "Leia üritused (aegraadi)",
            description: "Võtke kokku sündmused spetsifitse ajaskaala pikkusel",
          },
          getUpcomingEvents: {
            title: "Vaata tulevasi üritusi",
            description:
              "Leidke sündmused täna, selle nädala või selle kuuga, kasutades lihtsaid sõnu",
          },
          quickAdd: {
            title: "Kiirelt sisse lisada",
            description:
              'Loo üritus loomuliku keele alusel (nt "Koosolek homme kell 15:00")',
          },
          createEvent: {
            title: "Loo üritus",
            description:
              "Loo uus üritus, mis võimaldab kontrollida kõiki selle atribuute.",
          },
          updateEvent: {
            title: "Täiendav info",
            description: "Muuda olemasoleva kalendri sündmuse",
          },
          setMyStatus: {
            title: "Määrake vastuvõtu staatus",
            description:
              "Mõne sündmuse kinnitamise, kehtestamise või esialgse kinnitamise.",
          },
        },
      },
    },
    mcp: {
      title: "MCP-serverid",
      "loading-from-config": "MCP-serverid laaditakse konfiguraadifailist",
      "learn-more": "Lisateabe saamiseks tutvuge MCP-serveridega.",
      "no-servers-found": "MCP-servereid ei leitud.",
      "tool-warning":
        "Parima tulemuse saavutamiseks, võtke kaalutluseks, et välja lülitada tarbetud vahendid, et säilitada kontekst.",
      "stop-server": "Lülitage MCP-server välja",
      "start-server": "Alusta MCP-serverit",
      "delete-server": "Kasuta MCP-serveri kustutamise funktsiooni",
      "tool-count-warning":
        "See MCP server on lubanud <b>_, mis tarbivad konteksti igas vestluses.</b> Selle asemel võid soovimatuid tööriistu välja lülitada, et säästa konteksti.",
      "startup-command": "Alustamine",
      command: "Juhendamine",
      arguments: "Argumentid",
      "not-running-warning":
        "See MCP-server ei tööta – see võib olla peatatud või alguses võib tekkida viga.",
      "tool-call-arguments": '"Tooli käivitamise argumentid"',
      "tools-enabled": "vahendid on lubatud",
    },
    settings: {
      title: "Agenti oskuste seaded",
      "max-tool-calls": {
        title: "Maximaalne töö-kõned vastuse kohta",
        description:
          "Максимаalne arv, mis agent võib ühendada, et genereerida ühe vastuse. See takistab liigse töö tegevuse ja lõpmatute ringide tekkimist.",
      },
      "intelligent-skill-selection": {
        title: "Nutikad oskuste valiku meetodid",
        "beta-badge": "Beeta",
        description:
          "Lubage piiramatu hulga tööriistade kasutamist ning vähendage küsimuse kohta kasutatavate tokenide arv kuni 80% – AnythingLLM valib automaatselt iga küsimuse jaoks sobivad oskused.",
        "max-tools": {
          title: "Max Tools",
          description:
            "Maksimaalne arv tööriistu, mida saab valida igale küsimusele. Soovitame seada see väärtus suuremate kontekstmudelite jaoks suuremaks.",
        },
      },
    },
  },
  recorded: {
    title: "Tööruumi vestlused",
    description:
      "Kõik salvestatud vestlused ja sõnumid kuvatakse loomise aja järgi.",
    export: "Ekspordi",
    table: {
      id: "ID",
      by: "Saatja",
      workspace: "Tööruum",
      prompt: "Päring",
      response: "Vastus",
      at: "Saadetud",
    },
  },
  customization: {
    interface: {
      title: "Kasutajaliidese eelistused",
      description: "Sea AnythingLLM-i UI eelistused.",
    },
    branding: {
      title: "Bränding ja valgesildistamine",
      description: "Valgesildista oma AnythingLLM kohandatud brändinguga.",
    },
    chat: {
      title: "Vestlus",
      description: "Sea vestluse eelistused.",
      auto_submit: {
        title: "Automaatselt esita kõnesisend",
        description: "Saada kõnesisend ära pärast vaikuse perioodi",
      },
      auto_speak: {
        title: "Loe vastused ette",
        description: "AI loeb vastused automaatselt ette",
      },
      spellcheck: {
        title: "Luba õigekirjakontroll",
        description: "Lülita vestlusväljale õigekirjakontroll sisse/välja",
      },
    },
    items: {
      theme: {
        title: "Teema",
        description: "Vali rakenduse värviteema.",
      },
      "show-scrollbar": {
        title: "Kuva kerimisriba",
        description: "Kuva või peida vestlusakna kerimisriba.",
      },
      "support-email": {
        title: "Toe e-post",
        description:
          "Määra e-posti aadress, kuhu kasutajad saavad abi saamiseks pöörduda.",
      },
      "app-name": {
        title: "Nimi",
        description:
          "Nimi, mis kuvatakse kõigile kasutajatele sisselogimislehel.",
      },
      "display-language": {
        title: "Kuvakeel",
        description:
          "Vali keel, milles AnythingLLM UI kuvatakse (kui tõlge on olemas).",
      },
      logo: {
        title: "Brändi logo",
        description: "Laadi üles kohandatud logo, mis kuvatakse kõikjal.",
        add: "Lisa logo",
        recommended: "Soovituslik suurus: 800 × 200",
        remove: "Eemalda",
        replace: "Asenda",
      },
      "browser-appearance": {
        title: "Brauseri välimus",
        description: "Kohanda brauseri vahekaardi pealkirja ja ikooni.",
        tab: {
          title: "Pealkiri",
          description:
            "Sea kohandatud vahekaardi pealkiri, kui rakendus on avatud.",
        },
        favicon: {
          title: "Favicon",
          description: "Kasuta kohandatud faviconi brauseri vahekaardil.",
        },
      },
      "sidebar-footer": {
        title: "Külgriba jaluse elemendid",
        description: "Kohanda külgriba allosas kuvatavaid linke/ikooni.",
        icon: "Ikoon",
        link: "Link",
      },
      "render-html": {
        title: "Renderi HTML-koodi veebisaidil",
        description:
          "HTML-vastuste kuvamine abivasside vastustes.\nSee võib viia suurema vastuste kvaliteedi, kuid võib ka põhjustada potentsiaalseid turvaohusid.",
      },
    },
  },
  api: {
    title: "API võtmed",
    description:
      "API võtmed võimaldavad programmipõhiselt hallata seda AnythingLLM instantsi.",
    link: "Loe API dokumentatsiooni",
    generate: "Genereeri uus API võti",
    empty: "API võtmeid ei leitud",
    actions: "Toimingud",
    messages: {
      error: "Viga: {{error}}",
    },
    modal: {
      title: "Loo uus API võti",
      cancel: "Tühista",
      close: "Sulge",
      create: "Loo API võti",
      helper:
        "Pärast loomist saab API võtit kasutada sellele AnythingLLM-i instantsile programmiga ligi pääsemiseks ja selle seadistamiseks.",
      name: {
        label: "Nimi",
        placeholder: "Tootmiskeskkonna integratsioon",
        helper:
          "Valikuline. Kasuta sõbralikku nime, et saaksid võtme hiljem hõlpsasti ära tunda.",
      },
    },
    row: {
      copy: "Kopeeri API võti",
      copied: "Kopeeritud",
      unnamed: "--",
      deleteConfirm:
        "Kas soovite selle API võtme kindlasti deaktiveerida?\nPärast seda ei saa seda enam kasutada.\n\nSeda toimingut ei saa tagasi võtta.",
    },
    table: {
      name: "Nimi",
      key: "API võti",
      by: "Loonud",
      created: "Loodud",
    },
  },
  llm: {
    title: "LLM-i eelistus",
    description:
      "Siin on sinu valitud LLM-teenusepakkuja võtmed ja seaded. Need peavad olema õiged, vastasel juhul AnythingLLM ei tööta.",
    provider: "LLM-pakkuja",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure teenuse lõpp-punkt",
        api_key: "API võti",
        chat_deployment_name: "Vestluse deploy nimi",
        chat_model_token_limit: "Mudeli tokeni limiit",
        model_type: "Mudeli tüüp",
        default: "Vaikimisi",
        reasoning: "Põhjendus",
        model_type_tooltip:
          'Kui teie rakendus kasutab loogika mudelit (o1, o1-mini, o3-mini jne), siis määrake see väärtuseks "Loogika". Muu korral võivad teie vestlussõnumid ebaõiglas.',
      },
    },
  },
  transcription: {
    title: "Transkriptsiooni mudeli eelistus",
    description:
      "Siin on sinu valitud transkriptsioonimudeli pakkuja seaded. Vale seadistuse korral heli- ja meediafaile ei transkribeerita.",
    provider: "Transkriptsiooni pakkuja",
    "warn-start":
      "Kohaliku Whisper-mudeli kasutamine vähese RAM-i või CPU-ga masinal võib faili töötlemise ummistada.",
    "warn-recommend": "Soovitame vähemalt 2 GB RAM-i ning <10 MB faile.",
    "warn-end":
      "Sisseehitatud mudel laaditakse alla esmakasutusel automaatselt.",
  },
  embedding: {
    title: "Embedding-i eelistus",
    "desc-start":
      "Kui kasutad LLM-i, mis ei sisalda embedding-mootorit, tuleb määrata täiendavad võtmed.",
    "desc-end":
      "Embedding muudab teksti vektoriteks. Need võtmed on vajalikud, et AnythingLLM saaks sinu failid ja päringud töödelda.",
    provider: {
      title: "Embedding-i pakkuja",
    },
  },
  text: {
    title: "Teksti lõikamise ja tükeldamise seaded",
    "desc-start":
      "Vahel soovid muuta, kuidas uued dokumendid enne vektoriandmebaasi lisamist tükeldatakse.",
    "desc-end": "Muuda seda ainult siis, kui mõistad tekstilõike mõju.",
    size: {
      title: "Tekstitüki suurus",
      description: "Maksimaalne märgipikkus ühes vektoris.",
      recommend: "Embed-mudeli maks pikkus on",
    },
    overlap: {
      title: "Tekstitüki kattuvus",
      description: "Maksimaalne märkide kattuvus kahe kõrvuti tüki vahel.",
    },
  },
  vector: {
    title: "Vektoriandmebaas",
    description:
      "Siin on seaded, kuidas AnythingLLM töötab. Vale seadistus võib põhjustada tõrkeid.",
    provider: {
      title: "Vektoriandmebaasi pakkuja",
      description: "LanceDB puhul seadistust pole vaja.",
    },
  },
  embeddable: {
    title: "Embed-vestlusvidinad",
    description:
      "Avalikkusele suunatud vestlusliidesed, mis on seotud ühe tööruumiga.",
    create: "Loo embed",
    table: {
      workspace: "Tööruum",
      chats: "Saadetud vestlused",
      active: "Aktiivsed domeenid",
      created: "Loodud",
    },
  },
  "embed-chats": {
    title: "Embed-vestluste ajalugu",
    export: "Ekspordi",
    description: "Kõik embed-ide salvestatud vestlused ja sõnumid.",
    table: {
      embed: "Embed",
      sender: "Saatja",
      message: "Sõnum",
      response: "Vastus",
      at: "Saadetud",
    },
  },
  event: {
    title: "Sündmuste logid",
    description: "Vaata instantsis toimuvaid tegevusi ja jälgi sündmusi.",
    clear: "Tühjenda logid",
    table: {
      type: "Sündmuse tüüp",
      user: "Kasutaja",
      occurred: "Toimus",
    },
  },
  privacy: {
    title: "Privaatsus ja andmetöötlus",
    description:
      "Konfiguratsioon kolmandate osapoolte ja AnythingLLM-i andmekäitluse kohta.",
    anonymous: "Anonüümne telemeetria lubatud",
  },
  connectors: {
    "search-placeholder": "Otsi andmepistikuid",
    "no-connectors": "Andmepistikuid ei leitud.",
    obsidian: {
      vault_location: "Vaulti asukoht",
      vault_description:
        "Vali oma Obsidiani vaulti kaust, et importida kõik märkmed ja nende seosed.",
      selected_files: "Leiti {{count}} Markdown-faili",
      importing: "Vaulti importimine…",
      import_vault: "Impordi vault",
      processing_time: "See võib võtta aega sõltuvalt vaulti suurusest.",
      vault_warning:
        "Konfliktide vältimiseks veendu, et Obsidiani vault ei oleks praegu avatud.",
    },
    github: {
      name: "GitHubi repo",
      description:
        "Impordi kogu avalik või privaatne GitHubi repo ühe klõpsuga.",
      URL: "GitHubi repo URL",
      URL_explained: "Repo URL, mida soovid koguda.",
      token: "GitHubi juurdepääsuvõti",
      optional: "valikuline",
      token_explained: "Võti API piirangute vältimiseks.",
      token_explained_start: "Ilma ",
      token_explained_link1: "isikliku juurdepääsuvõtmeta",
      token_explained_middle:
        " võib GitHubi API piirata kogutavate failide hulka. Sa võid ",
      token_explained_link2: "luua ajutise juurdepääsuvõtme",
      token_explained_end: " selle vältimiseks.",
      ignores: "Faili välistused",
      git_ignore:
        ".gitignore formaadis nimekiri failidest, mida kogumisel ignoreerida. Vajuta Enter iga kirje järel.",
      task_explained:
        "Kui valmis, on failid dokumentide valijas tööruumidesse põimimiseks saadaval.",
      branch: "Haru, kust faile koguda",
      branch_loading: "-- harude laadimine --",
      branch_explained: "Haru, kust faile koguda.",
      token_information:
        "Ilma <b>GitHubi juurdepääsuvõtmeta</b> saab pistik koguda ainult repo <b>juurtaseme</b> faile GitHubi API piirangute tõttu.",
      token_personal: "Hangi tasuta isiklik juurdepääsuvõti GitHubist siit.",
    },
    gitlab: {
      name: "GitLabi repo",
      description:
        "Impordi kogu avalik või privaatne GitLabi repo ühe klõpsuga.",
      URL: "GitLabi repo URL",
      URL_explained: "Repo URL, mida soovid koguda.",
      token: "GitLabi juurdepääsuvõti",
      optional: "valikuline",
      token_description: "Vali täiendavad objektid, mida GitLabi API-st tuua.",
      token_explained_start: "Ilma ",
      token_explained_link1: "isikliku juurdepääsuvõtmeta",
      token_explained_middle:
        " võib GitLabi API piirata kogutavate failide hulka. Sa võid ",
      token_explained_link2: "luua ajutise juurdepääsuvõtme",
      token_explained_end: " selle vältimiseks.",
      fetch_issues: "Tõmba Issues dokumendina",
      ignores: "Faili välistused",
      git_ignore:
        ".gitignore formaadis nimekiri failidest, mida kogumisel ignoreerida. Vajuta Enter iga kirje järel.",
      task_explained:
        "Kui valmis, on failid dokumentide valijas tööruumidesse põimimiseks saadaval.",
      branch: "Haru, kust faile koguda",
      branch_loading: "-- harude laadimine --",
      branch_explained: "Haru, kust faile koguda.",
      token_information:
        "Ilma <b>GitLabi juurdepääsuvõtmeta</b> saab pistik koguda ainult repo <b>juurtaseme</b> faile GitLabi API piirangute tõttu.",
      token_personal: "Hangi tasuta isiklik juurdepääsuvõti GitLabist siit.",
    },
    youtube: {
      name: "YouTube'i transkript",
      description: "Impordi YouTube'i video täielik transkript lingi abil.",
      URL: "YouTube'i video URL",
      URL_explained_start:
        "Sisesta ükskõik millise YouTube'i video URL, et tuua selle transkript. Videol peavad olema ",
      URL_explained_link: "subtiitrid",
      URL_explained_end: " saadaval.",
      task_explained:
        "Kui valmis, on transkript dokumentide valijas tööruumidesse põimimiseks saadaval.",
    },
    "website-depth": {
      name: "Massiline linkide kraapija",
      description: "Kraabi veebisaiti ja selle alamlinke määratud sügavuseni.",
      URL: "Veebisaidi URL",
      URL_explained: "Veebisaidi URL, mida soovid kraapida.",
      depth: "Kraapimissügavus",
      depth_explained: "Alamlinkide arv, mida töötaja alg-URL-ist järgib.",
      max_pages: "Maksimaalne lehtede arv",
      max_pages_explained: "Maksimaalne linkide arv, mida kraapida.",
      task_explained:
        "Kui valmis, on kogu kraabitud sisu dokumentide valijas tööruumidesse põimimiseks saadaval.",
    },
    confluence: {
      name: "Confluence",
      description: "Impordi kogu Confluence'i leht ühe klõpsuga.",
      deployment_type: "Confluence'i tüüp",
      deployment_type_explained:
        "Määra, kas Confluence töötab Atlassiani pilves või on isemajutatud.",
      base_url: "Confluence'i baas-URL",
      base_url_explained: "Sinu Confluence'i ruumi baas-URL.",
      space_key: "Confluence'i space key",
      space_key_explained:
        "Space key, mida kasutatakse (tavaliselt algab ~ märgiga).",
      username: "Confluence'i kasutajanimi",
      username_explained: "Sinu Confluence'i kasutajanimi.",
      auth_type: "Autentimise tüüp",
      auth_type_explained:
        "Vali autentimise tüüp, millega Confluence'i lehtedele ligi pääseda.",
      auth_type_username: "Kasutajanimi + juurdepääsuvõti",
      auth_type_personal: "Isiklik juurdepääsuvõti",
      token: "Confluence'i juurdepääsuvõti",
      token_explained_start:
        "Autentimiseks on vajalik juurdepääsuvõti. Saad selle genereerida",
      token_explained_link: "siin",
      token_desc: "Juurdepääsuvõti autentimiseks",
      pat_token: "Confluence'i PAT-võti",
      pat_token_explained: "Sinu isiklik juurdepääsuvõti.",
      task_explained:
        "Kui valmis, on lehe sisu dokumentide valijas tööruumidesse põimimiseks saadaval.",
      bypass_ssl: "SSL-sertifikaadi valideerimise ümber",
      bypass_ssl_explained:
        "Selle valiku aktiveerimine võimaldab SSL sertifikaadi valideerimise ületada, kui kasutate enda hallatud Confluence instantsi, millel on enda välja antud sertifikaat.",
    },
    manage: {
      documents: "Dokumendid",
      "data-connectors": "Andmepistikud",
      "desktop-only":
        "Neid sätteid saab muuta ainult lauaarvutis. Ava see leht töölaual.",
      dismiss: "Sulge",
      editing: "Muudan",
    },
    directory: {
      "my-documents": "Minu dokumendid",
      "new-folder": "Uus kaust",
      "search-document": "Otsi dokumenti",
      "no-documents": "Dokumendid puuduvad",
      "move-workspace": "Liiguta tööruumi",
      "delete-confirmation":
        "Kas oled kindel, et soovid need failid ja kaustad kustutada?\nFailid eemaldatakse süsteemist ning kõigist tööruumidest.\nTegevust ei saa tagasi võtta.",
      "removing-message":
        "Eemaldan {{count}} dokumenti ja {{folderCount}} kausta. Palun oota.",
      "move-success": "Liigutatud edukalt {{count}} dokumenti.",
      no_docs: "Dokumendid puuduvad",
      select_all: "Vali kõik",
      deselect_all: "Tühista valik",
      remove_selected: "Eemalda valitud",
      save_embed: "Salvesta ja põimi",
      "total-documents_one": "{{count}} dokument",
      "total-documents_other": "{{count}} dokumendid",
    },
    upload: {
      "processor-offline": "Dokumenditöötleja pole saadaval",
      "processor-offline-desc":
        "Failide üleslaadimine pole võimalik, sest töötleja on offline. Proovi hiljem uuesti.",
      "click-upload": "Klõpsa või lohista failid siia",
      "file-types":
        "toetab tekstifaile, CSV-sid, arvutustabeleid, helifaile jpm!",
      "or-submit-link": "või esita link",
      "placeholder-link": "https://näide.ee",
      fetching: "Laen…",
      "fetch-website": "Tõmba veebisait",
      "privacy-notice":
        "Failid laetakse üles selle instantsi dokumenditöötlejasse ega jagata kolmandatele osapooltele.",
    },
    pinning: {
      what_pinning: "Mis on dokumendi kinnitamine?",
      pin_explained_block1:
        "Kui <b>kinnitad</b> dokumendi, lisatakse kogu selle sisu sinu päringule, et LLM mõistaks seda täielikult.",
      pin_explained_block2:
        "Sobib eriti <b>suure kontekstiga mudelitele</b> või väikestele, kuid olulistele failidele.",
      pin_explained_block3:
        "Kui vaikimisi vastused ei rahulda, on kinnitamine lihtne viis kvaliteedi tõstmiseks.",
      accept: "Selge",
    },
    watching: {
      what_watching: "Mida tähendab dokumendi jälgimine?",
      watch_explained_block1:
        "Kui <b>jälgid</b> dokumenti, sünkroniseerime selle sisu <i>automaatselt</i> allikast kindlate intervallidega, uuendades seda kõigis tööruumides.",
      watch_explained_block2:
        "Hetkel toetab see ainult veebi-põhist sisu, mitte käsitsi üleslaetud faile.",
      watch_explained_block3_start: "Saad jälgitavaid dokumente hallata ",
      watch_explained_block3_link: "Failihalduri",
      watch_explained_block3_end: " vaates.",
      accept: "Selge",
    },
  },
  chat_window: {
    attachments_processing: "Manused töötlevad. Palun oota…",
    send_message: "Saada sõnum",
    attach_file: "Lisa fail vestlusele",
    text_size: "Muuda teksti suurust.",
    microphone: "Esita päring häälega.",
    send: "Saada päring tööruumi",
    tts_speak_message: "Loe sõnum ette",
    copy: "Kopeeri",
    regenerate: "Loo uuesti",
    regenerate_response: "Loo vastus uuesti",
    good_response: "Hea vastus",
    more_actions: "Rohkem toiminguid",
    fork: "Hargnemine",
    delete: "Kustuta",
    cancel: "Tühista",
    edit_prompt: "Redigeeri päringut",
    edit_response: "Redigeeri vastust",
    preset_reset_description: "Tühjenda vestlusajalugu ja alusta uut vestlust",
    add_new_preset: " Lisa uus preset",
    command: "Käsk",
    your_command: "sinu-käsk",
    placeholder_prompt: "Sisu, mis süstitakse sinu päringu ette.",
    description: "Kirjeldus",
    placeholder_description: "Vastab luuletusega LLM-idest.",
    save: "Salvesta",
    small: "Väike",
    normal: "Tavaline",
    large: "Suur",
    workspace_llm_manager: {
      search: "Otsi LLM-pakkujaid",
      loading_workspace_settings: "Laen tööruumi seadeid…",
      available_models: "Saadaval mudelid pakkujalt {{provider}}",
      available_models_description: "Vali mudel, mida tööruumis kasutada.",
      save: "Kasuta seda mudelit",
      saving: "Määran mudelit vaikimisi…",
      missing_credentials: "Sellel pakkujal puuduvad võtmed!",
      missing_credentials_description: "Klõpsa, et määrata võtmed",
    },
    submit: "Saada",
    edit_info_user:
      '"Saada" taastab AI vastuse. "Salvesta" muudab ainult teie sõnumi.',
    edit_info_assistant: "Teie muutused salvestatakse otse sellele vastusele.",
    see_less: "Näita vähem",
    see_more: "Vaata rohkem",
    tools: "Vahendid",
    text_size_label: "Teksti suurus",
    select_model: "Valige mudel",
    sources: "Allikasid",
    document: "Dokument",
    similarity_match: "mäng",
    source_count_one: "{{count}} viidatud",
    source_count_other: "Viidatud allikad",
    preset_exit_description: "Lõpeta hetkeseisuga",
    add_new: "Lisada uus",
    edit: "Redigeerimine",
    publish: "Avaldada",
    stop_generating: "Lõpeta vastuste genereerimine",
    slash_commands: "Lihtsasti kasutatavad käsud",
    agent_skills: "Agentide oskused",
    manage_agent_skills: "Halda agentide oskusi",
    agent_skills_disabled_in_session:
      "Ei ole võimalik muuta oskusi aktiivse agenti seanssi ajal. Enne seanssi lõpetamist kasutage käsku /exit.",
    start_agent_session: "Alusta agenti sessiooni",
    use_agent_session_to_use_tools:
      "Saate kasutada vahendeid vestluses, alustades agenti sessiooni, lisades käskile '@agent' sõna.",
    agent_invocation: {
      model_wants_to_call: "Mudel soovib helistada",
      approve: "Heakskiid",
      reject: "Hüvasti, keelan",
      always_allow: "Aeg-ajalt lubage {{skillName}}",
      tool_call_was_approved: "Vahendite tellimuse kinnitati.",
      tool_call_was_rejected: "Vahendite taotlus jäeti rahuldamata.",
    },
    custom_skills: "Kohandatud oskused",
    agent_flows: "Agentide liiklus",
    no_tools_found: "Välja ei leitud sobivaid tööriistu",
    loading_mcp_servers: "MCP-serverite laadimine...",
    app_integrations: "Rakenduste integreerimine",
    sub_skills: "Alamspetsid",
  },
  profile_settings: {
    edit_account: "Muuda kontot",
    profile_picture: "Profiilipilt",
    remove_profile_picture: "Eemalda profiilipilt",
    username: "Kasutajanimi",
    new_password: "Uus parool",
    password_description: "Parool peab olema vähemalt 8 märki",
    cancel: "Tühista",
    update_account: "Uuenda kontot",
    theme: "Teema eelistus",
    language: "Eelistatud keel",
    failed_upload: "Profiilipildi üleslaadimine ebaõnnestus: {{error}}",
    upload_success: "Profiilipilt üles laaditud.",
    failed_remove: "Profiilipildi eemaldamine ebaõnnestus: {{error}}",
    profile_updated: "Profiil uuendatud.",
    failed_update_user: "Kasutaja uuendamine ebaõnnestus: {{error}}",
    account: "Konto",
    support: "Tugi",
    signout: "Logi välja",
  },
  "keyboard-shortcuts": {
    title: "Klaviatuuri otseteed",
    shortcuts: {
      settings: "Ava seaded",
      workspaceSettings: "Ava praeguse tööruumi seaded",
      home: "Mine avalehele",
      workspaces: "Halda tööruume",
      apiKeys: "API võtmete seaded",
      llmPreferences: "LLM-eelistused",
      chatSettings: "Vestluse seaded",
      help: "Näita otseteeabi",
      showLLMSelector: "Näita tööruumi LLM-valikut",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Edu!",
        success_description: "Sinu süsteemprompt avaldati Community Hubis!",
        success_thank_you: "Aitäh jagamast!",
        view_on_hub: "Vaata Hubis",
        modal_title: "Avalda süsteemprompt",
        name_label: "Nimi",
        name_description: "Süsteemprompti kuvanimi.",
        name_placeholder: "Minu süsteemprompt",
        description_label: "Kirjeldus",
        description_description:
          "Kirjeldus, mis selgitab süsteemprompti eesmärki.",
        tags_label: "Sildid",
        tags_description:
          "Lisa kuni 5 silti (kuni 20 tähemärki igaüks) otsingu lihtsustamiseks.",
        tags_placeholder: "Kirjuta ja vajuta Enter, et lisada silte",
        visibility_label: "Nähtavus",
        public_description: "Avalikud promptid on kõigile nähtavad.",
        private_description: "Privaatseid prompte näed vaid sina.",
        publish_button: "Avalda Community Hubis",
        submitting: "Avaldan…",
        prompt_label: "Prompt",
        prompt_description: "Süsteemprompt, mis juhendab LLM-i.",
        prompt_placeholder: "Sisesta süsteemprompt siia…",
      },
      agent_flow: {
        success_title: "Edu!",
        success_description: "Sinu agendi voog avaldati Community Hubis!",
        success_thank_you: "Aitäh jagamast!",
        view_on_hub: "Vaata Hubis",
        modal_title: "Avalda agendi voog",
        name_label: "Nimi",
        name_description: "Agendi voo kuvanimi.",
        name_placeholder: "Minu agendi voog",
        description_label: "Kirjeldus",
        description_description: "Kirjeldus, mis selgitab agendi voo eesmärki.",
        tags_label: "Sildid",
        tags_description:
          "Lisa kuni 5 silti (kuni 20 tähemärki) otsingu lihtsustamiseks.",
        tags_placeholder: "Kirjuta ja vajuta Enter, et lisada silte",
        visibility_label: "Nähtavus",
        submitting: "Avaldan…",
        submit: "Avalda Community Hubis",
        privacy_note:
          "Agendi vood laetakse üles alati privaatsena, et kaitsta tundlikku infot. Nähtavust saab hiljem Hubis muuta. Kontrolli, et voog ei sisaldaks privaatseid andmeid.",
      },
      slash_command: {
        success_title: "Edu!",
        success_description: "Sinu slash-käsk avaldati Community Hubis!",
        success_thank_you: "Aitäh jagamast!",
        view_on_hub: "Vaata Hubis",
        modal_title: "Avalda slash-käsk",
        name_label: "Nimi",
        name_description: "Slash-käsku kuvatav nimi.",
        name_placeholder: "Minu slash-käsk",
        description_label: "Kirjeldus",
        description_description:
          "Kirjeldus, mis selgitab slash-käsku eesmärki.",
        tags_label: "Sildid",
        tags_description:
          "Lisa kuni 5 silti (kuni 20 tähemärki) otsingu lihtsustamiseks.",
        tags_placeholder: "Kirjuta ja vajuta Enter, et lisada silte",
        visibility_label: "Nähtavus",
        public_description: "Avalikud käsud on kõigile nähtavad.",
        private_description: "Privaatseid käske näed vaid sina.",
        publish_button: "Avalda Community Hubis",
        submitting: "Avaldan…",
        prompt_label: "Prompt",
        prompt_description:
          "Prompt, mida kasutatakse, kui slash-käsk käivitub.",
        prompt_placeholder: "Sisesta prompt siia…",
      },
      generic: {
        unauthenticated: {
          title: "Autentimine vajalik",
          description: "Enne avaldamist pead Community Hubi sisselogima.",
          button: "Ühendu Community Hubiga",
        },
      },
    },
  },
  security: {
    title: "Turvalisus",
    multiuser: {
      title: "Mitme kasutaja režiim",
      description:
        "Lülita mitme kasutaja tugi sisse, et meeskond saaks instantsi kasutada.",
      enable: {
        "is-enable": "Mitme kasutaja režiim on sisse lülitatud",
        enable: "Lülita sisse",
        description:
          "Vaikimisi oled ainus administraator. Adminid loovad uued kasutajad ja paroole.",
        username: "Admini kasutajanimi",
        password: "Admini parool",
      },
    },
    password: {
      title: "Paroolikaitse",
      description:
        "Kaitse oma instantsi parooliga. Kui unustad selle, taastamisvõimalust ei ole.",
      "password-label": "Instantsi parool",
    },
  },
  home: {
    welcome: "Tere tulemast",
    chooseWorkspace: "Vali tööruum, et alustada vestlust!",
    notAssigned:
      "Sa ei ole täidetud ühtegi tööruumi.\nPäringu tööruumiks, palun pööra teie administraatorile.",
    goToWorkspace: 'Mine tööruumiks "{{workspace}}"',
  },
  telegram: {
    title: "Telegrami bot",
    description:
      "Ühendage oma AnythingLLM instants Telegramiga, et saaksite vestleda oma tööruumidega igast seadmist.",
    setup: {
      step1: {
        title: "1. samm: Looge oma Telegrami bot",
        description:
          "Ava Telegramis konto @BotFather, saat <code>/newbot</code> aadressile <code>@BotFather</code>, järgige juhiseid ja kopeerige API-token.",
        "open-botfather": "Ava BotFather",
        "instruction-1": "1. Avage link või skannige QR-kood",
        "instruction-2":
          "2. Saada <code>/newbot</code> aadressile <code>@BotFather</code>",
        "instruction-3": "3. Valige oma botile nimi ja kasutajanimi.",
        "instruction-4": "4. Kopeerige API-token, mida teile antakse.",
      },
      step2: {
        title: "2. Samuti ühendage oma bot",
        description:
          "Kleepige API-token, mis teil on saanud kasutaja @BotFatherilt, ning valige oma botile vaikimõistmine.",
        "bot-token": "Bot token",
        connecting: "Ühendamine...",
        "connect-bot": "Ühendusrobott",
      },
      security: {
        title: "Soovitavad turvameetmed",
        description:
          "Lisaks turvalisusele, konfigureerige need seaded @BotFatheris.",
        "disable-groups": "— Ennetada, et botid ei lisataks gruppi",
        "disable-inline": "— Vältida, et bot kasutaks otsingut reaalajas.",
        "obscure-username":
          "Kasutage mitteolivaid kasutajanime, et vähendada avastamise võimalust.",
      },
      "toast-enter-token": "Palun sisestage bot'i token.",
      "toast-connect-failed": "Bot ei suutnud ühendust tehes.",
    },
    connected: {
      status: "Ühendatud",
      "status-disconnected":
        "Vabandus, toet – toet võib olla kehtimatuna või kehtima lõppenud",
      "placeholder-token": "Sisestage uus bot'i token...",
      reconnect: "Taastada ühendus",
      workspace: "Tööruum",
      "bot-link": "Bot link",
      "voice-response": "Häälreaktsioon",
      disconnecting: "Ühendus katkestatud...",
      disconnect: "Ühenduse katkestamine",
      "voice-text-only": "Tekst ainult",
      "voice-mirror":
        "Helisüsteem (vastake häältega, kui kasutaja kasutab helifunktsiooni)",
      "voice-always": "Alati lisage hääl (saada helifail koos iga vastusega)",
      "toast-disconnect-failed": "Impeer ei õnnestunud seadistada.",
      "toast-reconnect-failed": "Bot ei suutnud ühendust taastada.",
      "toast-voice-failed": "Ärkimõõtmeid ei õnnestunud uuendada.",
      "toast-approve-failed": "Kasutaja kinnitamise ebaõnnestumine.",
      "toast-deny-failed": "Ei suutnud kasutaja kohta infot väita.",
      "toast-revoke-failed": "Ebaõnnestuti kasutaja konto kustutamises.",
    },
    users: {
      "pending-description":
        "Kasutajad, kes ootavad kinnitamist. Võrdige siin näidatud vastuvõtusümboli koos nende Telegrami vestluses näidatud sümboliga.",
      unknown: "Tuntud pole",
    },
  },
  scheduledJobs: {
    title: "Planeeritud tööd",
    enableNotifications: "Aktiveeri braiseri teavitused tööväljundite kohta",
    description:
      "Loo korduvad AI-ülesanded, mis töötavad eeldatud ajakavaga. Iga ülesanne käitab promp, kasutades valikuvõimalusega tööriistu, ja salvestab tulemuse kontrollimiseks.",
    newJob: "Uus töö",
    loading: "Laadimine...",
    emptyTitle: "Hetkel pole planeeritud tööde nimekirja.",
    emptySubtitle: "Loo üks, et alustada.",
    table: {
      name: "Nimi",
      schedule: "Ajavälja",
      status: "Статус",
      lastRun: "Viimne sõit",
      nextRun: "Järgmine üritus",
      actions: "Meetmed",
    },
    confirmDelete:
      "Kas olete kindel, et soovite seda planeeritud tööd kustutada?",
    toast: {
      deleted: "Töö kustutatud",
      triggered: "Töö on edukalt käivitunud.",
      triggerFailed: "Ei õnnestunud töö käivitada",
      triggerSkipped: "Töö on juba alguses.",
      killed: "Töö lõpetati edukalt",
      killFailed: "Edasi töötamist ei suutnud peatada",
    },
    row: {
      neverRun: "Ära kunagi kiirusta",
      viewRuns: "Vaatamise marsrid",
      runNow: "Alustage kohe",
      enable: "Aktiveerida",
      disable: "Välja lülitada",
      edit: "Redigeerimine",
      delete: "Hüvida",
    },
    modal: {
      titleEdit: "Muuda planeeritud tööd",
      titleNew: "Uus planeeritud töö",
      nameLabel: "Nimi",
      namePlaceholder: "nt. Päevase uudiste kokkuvõte",
      promptLabel: "Järgmis",
      promptPlaceholder:
        "Juhend, mis käsitleb programmi käivitamist iga kord, kui seda kasutatakse...",
      scheduleLabel: "Ajavälja",
      modeBuilder: "Ehitaj, ehitaja",
      modeCustom: "Kohandatud",
      cronPlaceholder: "Cron väljendus (näiteks 0 9 * * *)",
      currentSchedule: "Praegune ajakava:",
      toolsLabel: "Vahendid (valikuline)",
      toolsDescription:
        "Valige välja need agenti vahendid, mida see töö saab kasutada. Kui ühtki vahendit ei ole valitud, siis töö toimub ilma vahenditeta.",
      toolsSearch: "otsing",
      toolsNoResults: "Midagi sellist ei ole",
      required: "Nõutav",
      requiredFieldsBanner:
        "Palun täitke kõik vajalikud väljad, et töö avaldamine oleks võimalik.",
      cancel: "Katkuda",
      saving: "Säästmine...",
      updateJob: "Töö avaldamise uuendamine",
      createJob: "Loo töökoht",
      jobUpdated: "Töö on uuendatud",
      jobCreated: "Töö loodud",
    },
    builder: {
      fallbackWarning:
        'See väljend ei ole võimalik muuta visuaalselt. Valige "Custom" režiim, et seda säilitada, või muutke allolevaid elemente, et seda asendada.',
      run: "Jooksa",
      frequency: {
        minute: "iga minut",
        hour: "iga tunn",
        day: "iga päev",
        week: "iga nädal",
        month: "kuukohane",
      },
      every: "Igal",
      minuteOne: "1 minut",
      minuteOther: "{{count}} minut",
      atMinute: "Minutil",
      pastEveryHour: "iga tunni järel",
      at: "Samal ajal",
      on: "On",
      onDay: "Ühel päeval",
      ofEveryMonth: "iga kuu",
      weekdays: {
        sun: "Päev",
        mon: "Päev",
        tue: "teisipäev",
        wed: "Keskpäev",
        thu: "Reede",
        fri: "Reede",
        sat: "Laud",
      },
    },
    runHistory: {
      back: "Tagasi töökohtadele",
      title: "Täitmise ajalugu: {{name}}",
      schedule: "Ajavõrdlus:",
      emptyTitle: "Hetkel pole selle töös midagi saavutatud.",
      emptySubtitle: "Alustage tööd kohe ja vaadake selle tulemisi.",
      runNow: "Alustage kohe",
      table: {
        status: "Статус",
        started: "Algas",
        duration: "Kestvus",
        error: "Viga",
      },
      stopJob: "Töö peatamine",
    },
    runDetail: {
      loading: "Laadimise ajal saadaval on sõidu üksikasjad...",
      notFound: "Programm ei leitud.",
      back: "Tagasi",
      unknownJob: "Tuntmatu amet",
      runHeading: "{{name}} — Üritus #{{id}}",
      duration: "Kestvus: {{value}}",
      creating: "Loomine...",
      threadFailed: "Epäõnnes teema loomist",
      sections: {
        prompt: "Järgmis",
        error: "Viga",
        thinking: "Mõtisklused ({{count}})",
        toolCalls: "Vahendite kutsumised ({{count}})",
        files: "Failid ({{count}})",
        response: "Vastus",
        metrics: "Mõõdised",
      },
      metrics: {
        promptTokens: "Algatusmärgid:",
        completionTokens: "Lõpetamisandmed:",
      },
      stopJob: "Töö peatamine",
      killing: "Peatumine...",
      continueInThread: "Jätka vestluses",
    },
    toolCall: {
      arguments: "Argumentid:",
      showResult: "Näita tulemust",
      hideResult: "Peida tulemus",
    },
    file: {
      unknown: "Tuntmatu fail",
      download: "Laadige alla",
      downloadFailed: "Faili ei õnnestunud alla laadida",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF-dokumend",
        word: "Dokumend",
        spreadsheet: "Lehtaraken",
        generic: "Fail",
      },
    },
    status: {
      completed: "Lõpitatud",
      failed: "Epäõnnestunud",
      timed_out: "Aja täitunud",
      running: "Jooksmine",
      queued: "Ootel",
    },
  },
};

export default TRANSLATIONS;
