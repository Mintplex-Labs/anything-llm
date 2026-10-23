// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      welcome: "Üdvözöljük",
      getStarted: "Kezdés",
    },
    llm: {
      title: "LLM beállítás",
      description:
        "Az AnythingLLM számos LLM-szolgáltatóval képes együttműködni. Ez lesz a csevegést kezelő szolgáltatás.",
    },
    userSetup: {
      title: "Felhasználói beállítások",
      description: "Állítsa be a felhasználói beállításait.",
      howManyUsers: "Hány felhasználó fogja használni ezt a példányt?",
      justMe: "Csak én",
      myTeam: "A csapatom",
      instancePassword: "Példány jelszava",
      setPassword: "Szeretne jelszót beállítani?",
      passwordReq: "A jelszónak legalább 8 karakter hosszúnak kell lennie.",
      passwordWarn:
        "Fontos, hogy elmentse ezt a jelszót, mert nincs mód a visszaállítására.",
      adminUsername: "Adminisztrátori fiók felhasználóneve",
      adminPassword: "Adminisztrátori fiók jelszava",
      adminPasswordReq:
        "A jelszónak legalább 8 karakter hosszúnak kell lennie.",
      teamHint:
        "Alapértelmezés szerint Ön lesz az egyetlen adminisztrátor. A beállítás befejezése után létrehozhat és meghívhat másokat felhasználóként vagy adminisztrátorként. Ne veszítse el a jelszavát, mert jelszót csak adminisztrátor állíthat vissza.",
    },
    data: {
      title: "Adatkezelés és adatvédelem",
      description:
        "Elkötelezettek vagyunk az átláthatóság és az Ön személyes adatai feletti kontroll mellett.",
      settingsHint:
        "Ezek a beállítások bármikor módosíthatók a beállításokban.",
    },
    survey: {
      title: "Üdvözli az AnythingLLM",
      description:
        "Segítsen nekünk az AnythingLLM-et az Ön igényeihez igazítani. Nem kötelező.",
      email: "Mi az e-mail-címe?",
      useCase: "Mire fogja használni az AnythingLLM-et?",
      useCaseWork: "Munkára",
      useCasePersonal: "Személyes használatra",
      useCaseOther: "Egyéb",
      comment: "Honnan hallott az AnythingLLM-ről?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube stb. – Ossza meg velünk, hogyan talált ránk!",
      skip: "Kérdőív kihagyása",
      thankYou: "Köszönjük a visszajelzését!",
    },
  },
  common: {
    "workspaces-name": "Munkaterület neve",
    selection: "Modellválasztás",
    saving: "Mentés...",
    saved: "Mentve",
    save: "Módosítások mentése",
    previous: "Előző oldal",
    next: "Következő oldal",
    optional: "Nem kötelező",
    yes: "Igen",
    no: "Nem",
    on: "Be",
    none: "Nincs",
    stopped: "Leállítva",
    search: "Keresés",
    username_requirements:
      "A felhasználónév 2–64 karakter hosszú lehet, kisbetűvel kell kezdődnie, és csak kisbetűket, számokat, aláhúzásjelet, kötőjelet és pontot tartalmazhat.",
    loading: "Betöltés",
    refresh: "Frissítés",
    noResults: "Nincs találat",
  },
  home: {
    welcome: "Üdvözöljük",
    chooseWorkspace: "Válasszon egy munkaterületet a csevegés megkezdéséhez!",
    notAssigned:
      "Jelenleg egyetlen munkaterülethez sincs hozzárendelve.\nA hozzáféréshez forduljon az adminisztrátorhoz.",
    goToWorkspace: "Ugrás ide: „{{workspace}}”",
  },
  settings: {
    title: "Példánybeállítások",
    invites: "Meghívók",
    users: "Felhasználók",
    workspaces: "Munkaterületek",
    "workspace-chats": "Munkaterület-csevegések",
    customization: "Testreszabás",
    interface: "Felület beállításai",
    branding: "Arculat és egyedi márkázás",
    chat: "Csevegés",
    "api-keys": "Fejlesztői API",
    llm: "LLM",
    transcription: "Átirat",
    embedder: "Beágyazó",
    "text-splitting": "Szövegfelosztás és darabolás",
    "image-generation": "Képgenerálás",
    "voice-speech": "Hang és beszéd",
    "vector-database": "Vektoradatbázis",
    embeds: "Beágyazható csevegés",
    security: "Biztonság",
    "event-logs": "Eseménynaplók",
    "scheduled-jobs": "Ütemezett feladatok",
    privacy: "Adatvédelem és adatok",
    "ai-providers": "MI-szolgáltatók",
    "agent-skills": "Ügynökképességek",
    "model-router": "Modellútválasztó",
    "community-hub": {
      title: "Közösségi központ",
      trending: "Népszerű elemek",
      "your-account": "Az Ön fiókja",
      "import-item": "Elem importálása",
    },
    admin: "Adminisztráció",
    tools: "Eszközök",
    "system-prompt-variables": "Rendszerprompt-változók",
    "experimental-features": "Kísérleti funkciók",
    contact: "Kapcsolat a támogatással",
    "browser-extension": "Böngészőbővítmény",
    "mobile-app": "AnythingLLM Mobile",
    channels: "Csatornák",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Üdvözöljük",
      "placeholder-username": "Felhasználónév",
      "placeholder-password": "Jelszó",
      login: "Bejelentkezés",
      validating: "Ellenőrzés...",
      "forgot-pass": "Elfelejtett jelszó",
      reset: "Visszaállítás",
    },
    "sign-in":
      "Adja meg felhasználónevét és jelszavát a(z) {{appName}} példány eléréséhez.",
    "password-reset": {
      title: "Jelszó visszaállítása",
      description: "Adja meg az alábbi adatokat a jelszava visszaállításához.",
      "recovery-codes": "Helyreállítási kódok",
      "back-to-login": "Vissza a bejelentkezéshez",
    },
  },
  "main-page": {
    greeting: "Miben segíthetek ma?",
    greetings: {
      anytime: {
        working_on: "Min dolgozunk?",
        on_your_mind: "Mi jár a fejében?",
        where_to_start: "Hol kezdjük?",
        ready: "Készen állok, amikor Ön is.",
        think_it_through: "Gondoljuk végig együtt.",
      },
      morning: {
        good_morning: "Jó reggelt",
        first_today: "Jó reggelt! Mivel kezdjük a napot?",
        fresh_start: "Tiszta lap. Hol kezdjük?",
      },
      afternoon: {
        good_afternoon: "Jó napot",
        tackling: "Jó napot! Mibe vágunk bele?",
        next_on_list: "Mi a következő a listán?",
        keep_moving: "Haladjunk tovább.",
      },
      evening: {
        good_evening: "Jó estét",
        finish_strong: "Jó estét! Fejezzük be lendületesen.",
      },
      night: {
        midnight_oil: "Éjszakai műszak?",
        late_one: "Késő van? Gondoljuk végig együtt.",
        still_up: "Még ébren? Készen állok.",
      },
    },
    quickActions: {
      createAgent: "Ügynök létrehozása",
      editWorkspace: "Munkaterület szerkesztése",
      uploadDocument: "Dokumentum feltöltése",
    },
  },
  "new-workspace": {
    title: "Új munkaterület",
    placeholder: "Saját munkaterület",
  },
  "workspaces—settings": {
    general: "Általános beállítások",
    chat: "Csevegési beállítások",
    vector: "Vektoradatbázis",
    members: "Tagok",
    agent: "Ügynök konfigurációja",
  },
  general: {
    vector: {
      title: "Vektorok száma",
      description: "A vektoradatbázisban lévő vektorok teljes száma.",
    },
    names: {
      description: "Ez csak a munkaterület megjelenített nevét módosítja.",
    },
    message: {
      title: "Javasolt csevegőüzenetek",
      description:
        "Szabja testre a munkaterület felhasználóinak javasolt üzeneteket.",
      add: "Új üzenet hozzáadása",
      save: "Üzenetek mentése",
      heading: "Magyarázd el nekem",
      body: "az AnythingLLM előnyeit",
    },
    delete: {
      title: "Munkaterület törlése",
      description:
        "A munkaterület és minden adatának törlése. A munkaterület minden felhasználó számára törlődik.",
      delete: "Munkaterület törlése",
      deleting: "Munkaterület törlése...",
      "confirm-start": "Ön a teljes",
      "confirm-end":
        "munkaterület törlésére készül. Ez a vektoradatbázisból minden vektoros beágyazást eltávolít.\n\nAz eredeti forrásfájlok érintetlenek maradnak. Ez a művelet nem vonható vissza.",
    },
  },
  chat: {
    llm: {
      title: "Munkaterület LLM-szolgáltatója",
      description:
        "Az ehhez a munkaterülethez használt konkrét LLM-szolgáltató és modell. Alapértelmezés szerint a rendszerszintű LLM-szolgáltatót és -beállításokat használja.",
      search: "Keresés az összes LLM-szolgáltató között",
    },
    model: {
      title: "Munkaterület csevegőmodellje",
      description:
        "Az ehhez a munkaterülethez használt konkrét csevegőmodell. Ha üres, a rendszerszintű LLM-beállítást használja.",
    },
    mode: {
      title: "Csevegési mód",
      automatic: {
        title: "Ügynök",
        description:
          "automatikusan használja az eszközöket, ha a modell és a szolgáltató támogatja a natív eszközhívást.<br />Ha a natív eszközhívás nem támogatott, az eszközök használatához az @agent parancsot kell használnia.",
      },
      chat: {
        title: "Csevegés",
        description:
          "az LLM általános tudása <b>és</b> a talált dokumentumkontextus alapján válaszol.<br />Az eszközök használatához az @agent parancsot kell használnia.",
      },
      query: {
        title: "Lekérdezés",
        description:
          "<b>csak</b> akkor válaszol, ha talál dokumentumkontextust.<br />Az eszközök használatához az @agent parancsot kell használnia.",
      },
    },
    history: {
      title: "Csevegési előzmények",
      "desc-start":
        "A válasz rövid távú memóriájába bevont korábbi üzenetváltások száma.",
      recommend: "Ajánlott: 20. ",
    },
    prompt: {
      title: "Rendszerprompt",
      description:
        "Az ezen a munkaterületen használt prompt. Adja meg a kontextust és az utasításokat, amelyek alapján az MI a választ előállítja. Gondosan megfogalmazott promptot érdemes megadni, hogy az MI releváns és pontos választ adhasson.",
      history: {
        title: "Rendszerprompt-előzmények",
        clearAll: "Összes törlése",
        noHistory: "Nincsenek rendszerprompt-előzmények",
        restore: "Visszaállítás",
        delete: "Törlés",
        publish: "Közzététel a közösségi központban",
        deleteConfirm: "Biztosan törli ezt az előzményelemet?",
        clearAllConfirm:
          "Biztosan törli az összes előzményt? Ez a művelet nem vonható vissza.",
        expand: "Kibontás",
      },
    },
    refusal: {
      title: "Elutasító válasz lekérdezés módban",
      "desc-start": "Ha",
      query: "lekérdezés",
      "desc-end":
        "módban van, egyéni elutasító választ adhat vissza arra az esetre, ha nem található kontextus.",
      "tooltip-title": "Miért látom ezt?",
      "tooltip-description":
        "Ön lekérdezés módban van, amely csak a dokumentumaiban lévő információkat használja. Rugalmasabb beszélgetéshez váltson csevegés módra, vagy kattintson ide, és a dokumentációban többet megtudhat a csevegési módokról.",
    },
    token_limit_reached:
      "A válasz elérte a kimeneti tokenek maximális számát. Hosszabb válaszokhoz növelje a modell maximális kimeneti tokenszámát.",
    temperature: {
      title: "LLM hőmérséklet",
      "desc-end":
        "Minél nagyobb az érték, annál kreatívabb a válasz. Egyes modelleknél a túl magas érték összefüggéstelen válaszokhoz vezethet. Hagyja üresen a modellszolgáltató alapértelmezésének használatához.",
      placeholder: "Szolgáltató alapértelmezése",
    },
    reasoning_effort: {
      title: "Gondolkodási ráfordítás",
      default: "Szolgáltató alapértelmezése",
      cannot_disable: "Ennél a modellnél a gondolkodás nem kapcsolható ki.",
      levels: {
        off: "Ki",
        on: "Be",
        minimal: "Minimális",
        low: "Alacsony",
        medium: "Közepes",
        high: "Magas",
        xhigh: "Nagyon magas",
        max: "Maximális",
      },
    },
  },
  "vector-workspace": {
    identifier: "Vektoradatbázis-azonosító",
    snippets: {
      title: "Kontextusrészletek maximális száma",
      description:
        "Ez a beállítás szabályozza, hogy csevegésenként vagy lekérdezésenként legfeljebb hány kontextusrészlet kerüljön elküldésre az LLM-nek.",
      recommend: "Ajánlott: 4",
    },
    doc: {
      title: "Dokumentum-hasonlósági küszöb",
      description:
        "Az a minimális hasonlósági pontszám, amely felett egy forrás a csevegéshez kapcsolódónak számít. Minél nagyobb az érték, annál jobban kell hasonlítania a forrásnak a csevegéshez.",
      zero: "Nincs korlátozás",
      low: "Alacsony (hasonlósági pontszám ≥ 0,25)",
      medium: "Közepes (hasonlósági pontszám ≥ 0,50)",
      high: "Magas (hasonlósági pontszám ≥ 0,75)",
    },
    reset: {
      reset: "Vektoradatbázis alaphelyzetbe állítása",
      resetting: "Vektorok törlése...",
      confirm:
        "Ön a munkaterület vektoradatbázisának alaphelyzetbe állítására készül. Ez minden jelenleg beágyazott vektort eltávolít.\n\nAz eredeti forrásfájlok érintetlenek maradnak. Ez a művelet nem vonható vissza.",
      error:
        "A munkaterület vektoradatbázisát nem sikerült alaphelyzetbe állítani!",
      success: "A munkaterület vektoradatbázisa alaphelyzetbe állítva!",
    },
  },
  agent: {
    "performance-warning":
      "Az eszközhívást kifejezetten nem támogató LLM-ek teljesítménye nagyban függ a modell képességeitől és pontosságától. Egyes funkciók korlátozottak vagy működésképtelenek lehetnek.",
    provider: {
      title: "Munkaterület ügynökének LLM-szolgáltatója",
      description:
        "A munkaterület @agent ügynökéhez használt konkrét LLM-szolgáltató és modell.",
    },
    mode: {
      chat: {
        title: "Munkaterület ügynökének csevegőmodellje",
        description:
          "A munkaterület @agent ügynökéhez használt konkrét csevegőmodell.",
      },
      title: "Munkaterület ügynökmodellje",
      description:
        "A munkaterület @agent ügynökéhez használt konkrét LLM-modell.",
      wait: "-- várakozás a modellekre --",
    },
    skill: {
      rag: {
        title: "RAG és hosszú távú memória",
        description:
          "Lehetővé teszi, hogy az ügynök a helyi dokumentumait használja a válaszadáshoz, illetve megkérheti, hogy tartalomrészleteket „jegyezzen meg” a hosszú távú memóriában.",
      },
      view: {
        title: "Dokumentumok megtekintése és összefoglalása",
        description:
          "Lehetővé teszi, hogy az ügynök listázza és összefoglalja a munkaterület jelenleg beágyazott fájljainak tartalmát.",
      },
      scrape: {
        title: "Weboldalak letöltése",
        description:
          "Lehetővé teszi, hogy az ügynök felkeressen weboldalakat és kinyerje azok tartalmát.",
      },
      generate: {
        title: "Diagramok készítése",
        description:
          "Lehetővé teszi, hogy az alapértelmezett ügynök különféle diagramokat készítsen a megadott vagy a csevegésben szereplő adatokból.",
      },
      generateImage: {
        title: "Képek készítése",
        description:
          "Lehetővé teszi, hogy az ügynök képeket készítsen a csevegésből, vagy szerkessze a beszélgetéshez csatolt képeket a beállított képgeneráló szolgáltatóval.",
      },
      web: {
        title: "Webes keresés",
        description:
          "Lehetővé teszi, hogy az ügynök egy webes kereső (SERP) szolgáltatóhoz csatlakozva a weben keressen a kérdései megválaszolásához.",
      },
      sql: {
        title: "SQL-összekötő",
        description:
          "Lehetővé teszi, hogy az ügynök különféle SQL-adatbázisokhoz csatlakozva SQL segítségével válaszoljon a kérdéseire.",
      },
      scheduledJob: {
        title: "Ütemezett feladatok létrehozása",
        description:
          "Lehetővé teszi, hogy az ügynök ismétlődő ütemezett feladatokat hozzon létre a csevegésből (pl. „minden hétköznap reggel 9-kor foglald össze a beérkezett leveleimet, és küldd el e-mailben”). Csak egyfelhasználós módban érhető el.",
      },
      filesystem: {
        title: "Fájlrendszer-hozzáférés",
        description:
          "Lehetővé teszi, hogy az ügynök fájlokat olvasson, írjon, keressen és kezeljen egy kijelölt könyvtáron belül. Támogatja a fájlszerkesztést, a könyvtárak bejárását és a tartalomban való keresést.",
        learnMore: "Tudjon meg többet a képesség használatáról",
        configuration: "Konfiguráció",
        readActions: "Olvasási műveletek",
        writeActions: "Írási műveletek",
        warning:
          "A fájlrendszer-hozzáférés veszélyes lehet, mert fájlokat módosíthat vagy törölhet. Engedélyezés előtt olvassa el a <a>dokumentációt</a>.",
        skills: {
          "read-text-file": {
            title: "Fájl olvasása",
            description:
              "Fájlok tartalmának olvasása (szöveg, kód, PDF, képek stb.)",
          },
          "read-multiple-files": {
            title: "Több fájl olvasása",
            description: "Több fájl egyidejű olvasása",
          },
          "list-directory": {
            title: "Könyvtár listázása",
            description: "Egy mappa fájljainak és könyvtárainak listázása",
          },
          "search-files": {
            title: "Fájlok keresése",
            description: "Fájlok keresése név vagy tartalom alapján",
          },
          "get-file-info": {
            title: "Fájladatok lekérése",
            description: "Részletes metaadatok lekérése fájlokról",
          },
          "write-text-file": {
            title: "Szövegfájl írása",
            description: "Új szövegfájlok létrehozása vagy meglévők felülírása",
          },
          "edit-file": {
            title: "Fájl szerkesztése",
            description: "Soralapú módosítások szövegfájlokban",
          },
          "create-directory": {
            title: "Könyvtár létrehozása",
            description: "Új könyvtárak létrehozása",
          },
          "copy-file": {
            title: "Fájl másolása",
            description: "Fájlok és könyvtárak másolása",
          },
          "move-file": {
            title: "Fájl áthelyezése/átnevezése",
            description: "Fájlok és könyvtárak áthelyezése vagy átnevezése",
          },
        },
      },
      createFiles: {
        title: "Dokumentumkészítés",
        description:
          "Lehetővé teszi, hogy az ügynök bináris dokumentumformátumokat hozzon létre, például PowerPoint-bemutatókat, Excel-táblázatokat, Word-dokumentumokat és PDF-eket. A fájlok közvetlenül a csevegőablakból letölthetők.",
        configuration: "Elérhető dokumentumtípusok",
        skills: {
          "create-text-file": {
            title: "Szövegfájlok",
            description:
              "Szövegfájlok létrehozása tetszőleges tartalommal és kiterjesztéssel (.txt, .md, .json, .csv stb.)",
          },
          "create-pptx": {
            title: "PowerPoint-bemutatók",
            description:
              "Új PowerPoint-bemutatók létrehozása diákkal, címekkel és felsorolásokkal",
          },
          "create-pdf": {
            title: "PDF-dokumentumok",
            description:
              "PDF-dokumentumok létrehozása Markdown vagy egyszerű szöveg alapján, alapvető formázással",
          },
          "create-xlsx": {
            title: "Excel-táblázatok",
            description:
              "Excel-dokumentumok létrehozása táblázatos adatokhoz, munkalapokkal és formázással",
          },
          "create-docx": {
            title: "Word-dokumentumok",
            description:
              "Word-dokumentumok létrehozása alapvető stílusokkal és formázással",
          },
        },
      },
      gmail: {
        title: "GMail",
        description:
          "Lehetővé teszi, hogy az ügynök a Gmaillel dolgozzon: levelek keresése, levélszálak olvasása, piszkozatok írása, levelek küldése és a postafiók kezelése. <a>Olvassa el a dokumentációt</a>.",
        multiUserWarning:
          "A Gmail-integráció biztonsági okokból többfelhasználós módban nem érhető el. A funkció használatához kapcsolja ki a többfelhasználós módot.",
        configuration: "Gmail konfiguráció",
        deploymentId: "Telepítési azonosító (Deployment ID)",
        deploymentIdHelp:
          "A Google Apps Script webalkalmazás telepítési azonosítója",
        apiKey: "API-kulcs",
        apiKeyHelp: "A Google Apps Script telepítésben beállított API-kulcs",
        configurationRequired:
          "A Gmail-képességek engedélyezéséhez adja meg a telepítési azonosítót és az API-kulcsot.",
        configured: "Beállítva",
        searchSkills: "Képességek keresése...",
        noSkillsFound: "Nincs a keresésnek megfelelő képesség.",
        categories: {
          search: {
            title: "Levelek keresése és olvasása",
            description: "Levelek keresése és olvasása a Gmail postafiókban",
          },
          drafts: {
            title: "Levélpiszkozatok",
            description:
              "Levélpiszkozatok létrehozása, szerkesztése és kezelése",
          },
          send: {
            title: "Levelek küldése és megválaszolása",
            description:
              "Levelek küldése és levélszálak azonnali megválaszolása",
          },
          threads: {
            title: "Levélszálak kezelése",
            description:
              "Levélszálak kezelése – olvasottnak/olvasatlannak jelölés, archiválás, kukába helyezés",
          },
          account: {
            title: "Integrációs statisztikák",
            description: "Postafiók-statisztikák és fiókadatok megtekintése",
          },
        },
        skills: {
          getInbox: {
            title: "Beérkezett levelek lekérése",
            description: "A Gmail beérkezett leveleinek egyszerű lekérése",
          },
          search: {
            title: "Levelek keresése",
            description: "Levelek keresése a Gmail lekérdezési szintaxisával",
          },
          readThread: {
            title: "Levélszál olvasása",
            description: "Teljes levélszál olvasása azonosító alapján",
          },
          createDraft: {
            title: "Piszkozat létrehozása",
            description: "Új levélpiszkozat létrehozása",
          },
          createDraftReply: {
            title: "Válaszpiszkozat létrehozása",
            description: "Válaszpiszkozat létrehozása egy meglévő levélszálra",
          },
          updateDraft: {
            title: "Piszkozat frissítése",
            description: "Meglévő levélpiszkozat frissítése",
          },
          getDraft: {
            title: "Piszkozat lekérése",
            description: "Adott piszkozat lekérése azonosító alapján",
          },
          listDrafts: {
            title: "Piszkozatok listázása",
            description: "Az összes levélpiszkozat listázása",
          },
          deleteDraft: {
            title: "Piszkozat törlése",
            description: "Levélpiszkozat törlése",
          },
          sendDraft: {
            title: "Piszkozat elküldése",
            description: "Meglévő levélpiszkozat elküldése",
          },
          sendEmail: {
            title: "Levél küldése",
            description: "Levél azonnali elküldése",
          },
          replyToThread: {
            title: "Válasz levélszálra",
            description: "Levélszál azonnali megválaszolása",
          },
          markRead: {
            title: "Olvasottnak jelölés",
            description: "Levélszál megjelölése olvasottként",
          },
          markUnread: {
            title: "Olvasatlannak jelölés",
            description: "Levélszál megjelölése olvasatlanként",
          },
          moveToTrash: {
            title: "Áthelyezés a kukába",
            description: "Levélszál áthelyezése a kukába",
          },
          moveToArchive: {
            title: "Archiválás",
            description: "Levélszál archiválása",
          },
          moveToInbox: {
            title: "Áthelyezés a beérkezett levelek közé",
            description: "Levélszál áthelyezése a beérkezett levelek közé",
          },
          getMailboxStats: {
            title: "Postafiók-statisztikák",
            description:
              "Olvasatlan levelek száma és postafiók-statisztikák lekérése",
          },
        },
      },
      googleCalendar: {
        title: "Google Naptár",
        description:
          "Lehetővé teszi, hogy az ügynök a Google Naptárral dolgozzon: naptárak megtekintése, események lekérése, létrehozása és frissítése, valamint visszajelzések kezelése. <a>Olvassa el a dokumentációt</a>.",
        multiUserWarning:
          "A Google Naptár-integráció biztonsági okokból többfelhasználós módban nem érhető el. A funkció használatához kapcsolja ki a többfelhasználós módot.",
        configuration: "Google Naptár konfiguráció",
        deploymentId: "Telepítési azonosító (Deployment ID)",
        deploymentIdHelp:
          "A Google Apps Script webalkalmazás telepítési azonosítója",
        apiKey: "API-kulcs",
        apiKeyHelp: "A Google Apps Script telepítésben beállított API-kulcs",
        configurationRequired:
          "A Google Naptár-képességek engedélyezéséhez adja meg a telepítési azonosítót és az API-kulcsot.",
        configured: "Beállítva",
        searchSkills: "Képességek keresése...",
        noSkillsFound: "Nincs a keresésnek megfelelő képesség.",
        categories: {
          calendars: {
            title: "Naptárak",
            description: "Google-naptárak megtekintése és kezelése",
          },
          readEvents: {
            title: "Események olvasása",
            description: "Naptáresemények megtekintése és keresése",
          },
          writeEvents: {
            title: "Események létrehozása és frissítése",
            description: "Új események létrehozása és meglévők módosítása",
          },
          rsvp: {
            title: "Visszajelzések kezelése",
            description: "Részvételi visszajelzések kezelése az eseményekhez",
          },
        },
        skills: {
          listCalendars: {
            title: "Naptárak listázása",
            description: "Az összes saját vagy feliratkozott naptár listázása",
          },
          getCalendar: {
            title: "Naptár részleteinek lekérése",
            description: "Részletes információk lekérése egy adott naptárról",
          },
          getEvent: {
            title: "Esemény lekérése",
            description: "Részletes információk lekérése egy adott eseményről",
          },
          getEventsForDay: {
            title: "Napi események lekérése",
            description: "Egy adott napra ütemezett összes esemény lekérése",
          },
          getEvents: {
            title: "Események lekérése (dátumtartomány)",
            description: "Események lekérése egyéni dátumtartományban",
          },
          getUpcomingEvents: {
            title: "Közelgő események lekérése",
            description:
              "A mai, heti vagy havi események lekérése egyszerű kulcsszavakkal",
          },
          quickAdd: {
            title: "Esemény gyors hozzáadása",
            description:
              "Esemény létrehozása természetes nyelvű leírásból (pl. „Megbeszélés holnap 15 órakor”)",
          },
          createEvent: {
            title: "Esemény létrehozása",
            description:
              "Új esemény létrehozása az összes tulajdonság teljes körű megadásával",
          },
          updateEvent: {
            title: "Esemény frissítése",
            description: "Meglévő naptáresemény frissítése",
          },
          setMyStatus: {
            title: "Visszajelzés beállítása",
            description:
              "Esemény elfogadása, elutasítása vagy feltételes elfogadása",
          },
        },
      },
      outlook: {
        title: "Outlook",
        description:
          "Lehetővé teszi, hogy az ügynök a Microsoft Outlookkal dolgozzon a Microsoft Graph API-n keresztül: levelek keresése, levélszálak olvasása, piszkozatok írása, levelek küldése és a postafiók kezelése. <a>Olvassa el a dokumentációt</a>.",
        multiUserWarning:
          "Az Outlook-integráció biztonsági okokból többfelhasználós módban nem érhető el. A funkció használatához kapcsolja ki a többfelhasználós módot.",
        configuration: "Outlook konfiguráció",
        authType: "Fióktípus",
        authTypeHelp:
          "Válassza ki, milyen típusú Microsoft-fiókok hitelesíthetnek. Az „Összes fiók” a személyes és a munkahelyi/iskolai fiókokat is támogatja. A „Csak személyes” a személyes Microsoft-fiókokra korlátoz. A „Csak szervezeti” egy adott Azure AD-bérlő munkahelyi/iskolai fiókjaira korlátoz.",
        authTypeCommon: "Összes fiók (személyes és munkahelyi/iskolai)",
        authTypeConsumers: "Csak személyes Microsoft-fiókok",
        authTypeOrganization:
          "Csak szervezeti fiókok (bérlőazonosító szükséges)",
        clientId: "Alkalmazás- (ügyfél-) azonosító",
        clientIdHelp:
          "Az Azure AD alkalmazásregisztráció alkalmazás- (ügyfél-) azonosítója",
        tenantId: "Címtár- (bérlő-) azonosító",
        tenantIdHelp:
          "Az Azure AD alkalmazásregisztráció címtár- (bérlő-) azonosítója. Csak a kizárólag szervezeti hitelesítéshez szükséges.",
        clientSecret: "Ügyfélkulcs (Client Secret)",
        clientSecretHelp:
          "Az Azure AD alkalmazásregisztráció ügyfélkulcsának értéke",
        configurationRequired:
          "Az Outlook-képességek engedélyezéséhez adja meg az ügyfél-azonosítót és az ügyfélkulcsot.",
        authRequired:
          "Először mentse a hitelesítő adatokat, majd a beállítás befejezéséhez jelentkezzen be a Microsofttal.",
        authenticateWithMicrosoft: "Bejelentkezés Microsofttal",
        authenticated: "Sikeres hitelesítés a Microsoft Outlookkal.",
        revokeAccess: "Hozzáférés visszavonása",
        configured: "Beállítva",
        searchSkills: "Képességek keresése...",
        noSkillsFound: "Nincs a keresésnek megfelelő képesség.",
        categories: {
          search: {
            title: "Levelek keresése és olvasása",
            description: "Levelek keresése és olvasása az Outlook postafiókban",
          },
          drafts: {
            title: "Levélpiszkozatok",
            description:
              "Levélpiszkozatok létrehozása, szerkesztése és kezelése",
          },
          send: {
            title: "Levelek küldése",
            description:
              "Új levelek küldése vagy üzenetek azonnali megválaszolása",
          },
          account: {
            title: "Integrációs statisztikák",
            description: "Postafiók-statisztikák és fiókadatok megtekintése",
          },
        },
        skills: {
          getInbox: {
            title: "Beérkezett levelek lekérése",
            description: "A legutóbbi levelek lekérése az Outlook postafiókból",
          },
          search: {
            title: "Levelek keresése",
            description: "Levelek keresése a Microsoft Search szintaxisával",
          },
          readThread: {
            title: "Beszélgetés olvasása",
            description: "Teljes levelezési szál olvasása",
          },
          createDraft: {
            title: "Piszkozat létrehozása",
            description:
              "Új levélpiszkozat vagy válaszpiszkozat létrehozása egy meglévő üzenetre",
          },
          updateDraft: {
            title: "Piszkozat frissítése",
            description: "Meglévő levélpiszkozat frissítése",
          },
          listDrafts: {
            title: "Piszkozatok listázása",
            description: "Az összes levélpiszkozat listázása",
          },
          deleteDraft: {
            title: "Piszkozat törlése",
            description: "Levélpiszkozat törlése",
          },
          sendDraft: {
            title: "Piszkozat elküldése",
            description: "Meglévő levélpiszkozat elküldése",
          },
          sendEmail: {
            title: "Levél küldése",
            description:
              "Új levél küldése vagy meglévő üzenet azonnali megválaszolása",
          },
          getMailboxStats: {
            title: "Postafiók-statisztikák",
            description:
              "Mappánkénti darabszámok és postafiók-statisztikák lekérése",
          },
        },
      },
    },
    mcp: {
      title: "MCP-kiszolgálók",
      "loading-from-config":
        "MCP-kiszolgálók betöltése a konfigurációs fájlból",
      "learn-more": "Tudjon meg többet az MCP-kiszolgálókról.",
      "no-servers-found": "Nem található MCP-kiszolgáló",
      "tool-warning":
        "A legjobb teljesítmény érdekében érdemes kikapcsolni a nem kívánt eszközöket, hogy kíméljük a kontextust.",
      "tools-enabled": "eszköz engedélyezve",
      "stop-server": "MCP-kiszolgáló leállítása",
      "start-server": "MCP-kiszolgáló indítása",
      "delete-server": "MCP-kiszolgáló törlése",
      "tool-count-warning":
        "Ezen az MCP-kiszolgálón <b>{{count}} eszköz van engedélyezve</b>, amelyek minden csevegésben kontextust foglalnak.<br />A kontextus kímélése érdekében érdemes kikapcsolni a nem kívánt eszközöket.",
      "startup-command": "Indítási parancs",
      command: "Parancs",
      arguments: "Argumentumok",
      "not-running-warning":
        "Ez az MCP-kiszolgáló nem fut – lehet, hogy le van állítva, vagy hiba történt az indításakor.",
      "tool-call-arguments": "Eszközhívás argumentumai",
    },
    settings: {
      title: "Ügynökképességek beállításai",
      "max-tool-calls": {
        title: "Eszközhívások maximális száma válaszonként",
        description:
          "Az eszközök maximális száma, amelyet az ügynök egyetlen válasz előállításához egymás után hívhat. Ez megakadályozza az elszabadult eszközhívásokat és a végtelen ciklusokat.",
      },
      "intelligent-skill-selection": {
        title: "Intelligens képességválasztás",
        description:
          "Korlátlan számú eszköz, akár 80%-kal kevesebb tokenfelhasználás lekérdezésenként – az AnythingLLM minden prompthoz automatikusan kiválasztja a megfelelő képességeket.",
        "max-tools": {
          title: "Eszközök maximális száma",
          description:
            "A lekérdezésenként kiválasztható eszközök maximális száma. Nagyobb kontextusú modelleknél magasabb érték ajánlott.",
        },
      },
      "clarifying-questions": {
        title: "Pontosító kérdések engedélyezése az ügynöknek",
        "beta-badge": "BÉTA",
        description:
          "Ha engedélyezve van, az ügynök megállhat, és rövid pontosító kérdéseket tehet fel, ha a prompt nem egyértelmű.",
        "max-per-turn": {
          title: "Kérdések maximális száma körönként",
          description:
            "Hány pontosító kérdést tehet fel az ügynök egyetlen kérdéssorban.",
        },
      },
    },
  },
  recorded: {
    title: "Munkaterület-csevegések",
    description:
      "A felhasználók által küldött összes rögzített csevegés és üzenet, létrehozási dátum szerint rendezve.",
    export: "Exportálás",
    table: {
      id: "Azonosító",
      by: "Küldő",
      workspace: "Munkaterület",
      prompt: "Prompt",
      response: "Válasz",
      at: "Küldés ideje",
    },
  },
  customization: {
    interface: {
      title: "Felület beállításai",
      description: "Az AnythingLLM felületének beállításai.",
    },
    branding: {
      title: "Arculat és egyedi márkázás",
      description: "Az AnythingLLM-példány egyedi arculattal való ellátása.",
      tabs: {
        identity: "Identitás",
        colors: "Színek",
        sidebar: "Oldalsáv",
        browser: "Böngésző",
      },
    },
    chat: {
      title: "Csevegés",
      description: "Az AnythingLLM csevegési beállításai.",
      auto_submit: {
        title: "Hangbevitel automatikus elküldése",
        description: "A hangbevitel automatikus elküldése egy rövid csend után",
      },
      auto_speak: {
        title: "Válaszok automatikus felolvasása",
        description: "Az MI válaszainak automatikus felolvasása",
      },
      spellcheck: {
        title: "Helyesírás-ellenőrzés",
        description:
          "Helyesírás-ellenőrzés be- vagy kikapcsolása a csevegés beviteli mezőjében",
      },
    },
    items: {
      theme: {
        title: "Téma",
        description: "Válassza ki az alkalmazás kívánt színtémáját.",
      },
      "show-scrollbar": {
        title: "Görgetősáv megjelenítése",
        description: "A görgetősáv be- vagy kikapcsolása a csevegőablakban.",
      },
      "disable-auto-scroll": {
        title: "Automatikus görgetés kikapcsolása",
        description:
          "Új üzenet érkezésekor ne görgessen automatikusan a csevegés aljára.",
      },
      "support-email": {
        title: "Támogatási e-mail-cím",
        description:
          "Az a támogatási e-mail-cím, amelyet a felhasználók segítség esetén elérhetnek.",
      },
      "app-name": {
        title: "Név",
        description:
          "A bejelentkezési oldalon minden felhasználónak megjelenő név.",
      },
      "display-language": {
        title: "Megjelenítési nyelv",
        description:
          "Válassza ki, milyen nyelven jelenjen meg az AnythingLLM felülete – ha elérhető fordítás.",
      },
      logo: {
        title: "Logó",
        description:
          "Töltse fel egyedi logóját, amely minden oldalon megjelenik.",
        add: "Egyedi logó hozzáadása",
        recommended: "Ajánlott méret: 800 x 200",
        remove: "Eltávolítás",
        replace: "Csere",
      },
      "browser-appearance": {
        title: "Megjelenés a böngészőben",
        description:
          "A böngészőfül és a cím megjelenésének testreszabása, amikor az alkalmazás meg van nyitva.",
        tab: {
          title: "Cím",
          description:
            "Egyedi fülcím megadása, amikor az alkalmazás böngészőben van megnyitva.",
        },
        favicon: {
          title: "Favicon",
          description: "Egyedi favicon használata a böngészőfülön.",
        },
      },
      "sidebar-footer": {
        title: "Oldalsáv láblécelemei",
        description: "Az oldalsáv alján megjelenő láblécelemek testreszabása.",
        icon: "Ikon",
        link: "Hivatkozás",
      },
      "render-html": {
        title: "HTML megjelenítése a csevegésben",
        description:
          "HTML-válaszok megjelenítése az asszisztens válaszaiban.\nEz jóval hűbb megjelenítést eredményezhet, de biztonsági kockázatokkal is járhat.",
      },
      palette: {
        title: "Színpaletta",
        description:
          "Válassz egy színpalettát. Ez a világos és a sötét módra is vonatkozik.",
        enforced:
          "A rendszergazda beállította a színpalettát ehhez a példányhoz.",
        "default-badge": "Alapértelmezett",
      },
      "instance-palettes": {
        title: "Színpaletták",
        description:
          "Kattints egy palettára, hogy ez legyen az alapértelmezett mindenki számára ebben a példányban. Az egyéni paletták egy fő színből állnak, amely a hátteret, az oldalsávot és a tartalmat színezi, valamint egy kiemelőszínből a gombokhoz és linkekhez.",
        new: "Új paletta",
        edit: "Paletta szerkesztése",
        delete: "Paletta törlése",
        name: "Paletta neve",
        "name-required": "Adj egy nevet a színpalettának.",
        colors: {
          main: "Fő szín",
          accent: "Kiemelőszín",
        },
        "preview-note":
          "A változások az egész alkalmazásban előnézetben láthatók, és a „Kész” gombra kattintva mentődnek.",
        done: "Kész",
        cancel: "Mégse",
        enforce: "Alapértelmezett paletta kényszerítése",
        "enforce-description":
          "Ebben a példányban mindenki az alapértelmezett palettát használja, és nem módosíthatja.",
        "save-failed": "Nem sikerült a színpalettákat menteni: {{error}}",
      },
    },
  },
  api: {
    title: "API-kulcsok",
    description:
      "Az API-kulcsok birtokosa programozottan érheti el és kezelheti ezt az AnythingLLM-példányt.",
    link: "API-dokumentáció megtekintése",
    generate: "Új API-kulcs létrehozása",
    empty: "Nem található API-kulcs",
    actions: "Műveletek",
    messages: {
      error: "Hiba: {{error}}",
    },
    modal: {
      title: "Új API-kulcs létrehozása",
      cancel: "Mégse",
      close: "Bezárás",
      create: "API-kulcs létrehozása",
      helper:
        "Létrehozás után az API-kulccsal programozottan érhető el és konfigurálható ez az AnythingLLM-példány.",
      name: {
        label: "Név",
        placeholder: "Éles integráció",
        helper:
          "Nem kötelező. Adjon beszédes nevet, hogy később azonosítani tudja a kulcsot.",
      },
    },
    row: {
      copy: "API-kulcs másolása",
      copied: "Másolva",
      unnamed: "--",
      deleteConfirm:
        "Biztosan inaktiválja ezt az API-kulcsot?\nEzt követően a kulcs nem használható tovább.\n\nEz a művelet nem vonható vissza.",
    },
    table: {
      name: "Név",
      key: "API-kulcs",
      by: "Létrehozta",
      created: "Létrehozva",
    },
  },
  llm: {
    title: "LLM beállítás",
    description:
      "Ezek a választott LLM csevegő- és beágyazási szolgáltató hitelesítő adatai és beállításai. Fontos, hogy a kulcsok érvényesek és helyesek legyenek, különben az AnythingLLM nem fog megfelelően működni.",
    provider: "LLM-szolgáltató",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure szolgáltatásvégpont",
        api_key: "API-kulcs",
        chat_deployment_name: "Csevegési telepítés neve",
        chat_model_token_limit: "Csevegőmodell tokenkorlátja",
        model_type: "Modelltípus",
        model_type_tooltip:
          "Ha a telepítés gondolkodó modellt használ (o1, o1-mini, o3-mini stb.), állítsa ezt „Gondolkodó” értékre. Ellenkező esetben a csevegési kérések sikertelenek lehetnek.",
        default: "Alapértelmezett",
        reasoning: "Gondolkodó",
      },
    },
  },
  "model-router": {
    title: "Modellútválasztók",
    description:
      "A modellútválasztókkal szabályokat adhat meg, amelyek feltételek alapján automatikusan különböző LLM-szolgáltatókhoz és modellekhez irányítják a csevegőüzeneteket.",
    table: {
      name: "Név",
      fallback: "Tartalék",
      rules: "Szabályok",
      workspaces: "Munkaterületek",
    },
    "no-routers": "Még nincs modellútválasztó",
    "empty-description":
      "Még nincs beállított modellútválasztó. A kezdéshez hozzon létre egyet.",
    "new-router-button": "Új útválasztó",
    "delete-confirm":
      "Biztosan törli a(z) „{{name}}” útválasztót?\nEz az összes szabályát eltávolítja, és leválasztja az azt használó munkaterületeket.\n\nEz a művelet nem vonható vissza.",
    "toast-deleted": "Útválasztó törölve",
    "toast-delete-failed": "Nem sikerült törölni az útválasztót: {{error}}",
    "new-router": {
      title: "Új modellútválasztó létrehozása",
      name: "Név",
      "name-placeholder": "pl. Költségoptimalizáló",
      description: "Leírás",
      "description-placeholder": "Nem kötelező leírás",
      "fallback-label": "Elsődleges szolgáltató és modell",
      "fallback-description":
        "Akkor használatos, ha egyik útválasztási szabály sem illeszkedik. Az LLM által osztályozott szabályok kiértékelésére is ezt használja.",
      "cooldown-label": "Gyorsítótár lejárati ideje (másodperc)",
      "cooldown-help":
        "Mennyi ideig marad gyorsítótárban egy útválasztási döntés a szabályok újbóli kiértékeléséig. A 0 érték kikapcsolja a gyorsítótárazást.",
      "name-required": "A név megadása kötelező.",
      "fallback-required":
        "Az elsődleges szolgáltató és modell megadása kötelező.",
      cancel: "Mégse",
      create: "Útválasztó létrehozása",
    },
    "edit-router": {
      "back-to-routers": "Vissza a modellútválasztókhoz",
      title: "Útválasztó szerkesztése: {{name}}",
      save: "Módosítások mentése",
      "toast-update-failed": "Nem sikerült frissíteni az útválasztót",
    },
    rules: {
      title: "Útválasztási szabályok",
      "title-with-name": "Útválasztó szabályai: {{name}}",
      description:
        "Adja meg azokat a szabályokat, amelyek meghatározzák, mikor és hogyan jussanak el a csevegőüzenetek az egyes szolgáltatókhoz és modellekhez.",
      "add-rule": "Szabály hozzáadása",
      "delete-confirm": "Törli a(z) „{{title}}” szabályt?",
      "toast-delete-failed": "Nem sikerült törölni a szabályt",
      "toast-reorder-failed": "Nem sikerült átrendezni a szabályokat",
      "no-rules": "Még nincsenek szabályok",
      "empty-description":
        "Adjon hozzá egy szabályt, hogy a csevegőüzeneteket adott szolgáltatókhoz és modellekhez irányítsa.",
      "new-rule-button": "Új szabály",
      "calculated-section-label":
        "Számított szabályok – elsőként, prioritási sorrendben kiértékelve",
      "llm-section-label":
        "LLM-szabályok – együttesen kiértékelve, ha egyik számított szabály sem illeszkedett",
      "llm-rule-body":
        "Ha illeszkedik: <desc>„{{description}}”</desc>, akkor irányítás ide: <route>{{route}}</route>",
      "calculated-no-conditions":
        "Nincs feltétel – irányítás ide: <route>{{route}}</route>",
      "calculated-single-condition":
        "Ha <prop>{{property}}</prop> {{comparator}} <val>„{{value}}”</val>, akkor irányítás ide: <route>{{route}}</route>",
      "calculated-multi-condition":
        "Ha {{quantifier}} teljesül ezek közül: <cond>{{conditions}}</cond>, akkor irányítás ide: <route>{{route}}</route>",
      "comparator-contains": "tartalmazza",
      "comparator-matches": "illeszkedik",
      "comparator-between": "között",
      "badge-llm": "LLM",
      "badge-calculated": "Számított",
      "aria-drag-to-reorder": "Húzza az átrendezéshez",
      "aria-edit-rule": "Szabály szerkesztése",
      "aria-delete-rule": "Szabály törlése",
      "quantifier-any": "BÁRMELYIK",
      "quantifier-all": "MINDEGYIK",
    },
    "rule-form": {
      "title-label": "Cím",
      "rule-type": "Szabálytípus",
      "property-label": "Tulajdonság",
      "property-select": "Válasszon",
      "comparator-label": "Összehasonlítás",
      "comparator-select": "Válasszon",
      "value-label": "Érték",
      "add-condition": "Feltétel hozzáadása",
      "remove-condition": "Feltétel eltávolítása",
      "conditions-incomplete":
        "A(z) {{index}}. feltétel hiányos – adja meg a tulajdonságot, az összehasonlítást és az értéket.",
      "match-description-label": "Illeszkedés leírása",
      "match-description-placeholder":
        "pl. A felhasználó jogi témákról, szerződésekről vagy megfelelőségről kérdez",
      "match-description-help":
        "Írja le azt a helyzetet, amikor a szabálynak illeszkednie kell. Ezt az LLM értékeli ki annak eldöntésére, hogy alkalmazza-e a szabályt.",
      "route-to-label": "Irányítás szolgáltatóhoz és modellhez",
      "route-to-description":
        "Ha a szabály illeszkedik, ezt a szolgáltatót/modellt használja",
      cancel: "Mégse",
      saving: "Mentés...",
      "update-rule": "Szabály frissítése",
      "create-rule": "Szabály létrehozása",
      "title-required": "A cím megadása kötelező",
      "toast-save-failed": "Nem sikerült menteni a szabályt",
      "type-calculated-label": "Számított",
      "type-calculated-description":
        "Illeszkedés az üzenet tulajdonságai alapján, például tartalom, tokenszám vagy napszak.",
      "type-llm-label": "LLM által osztályozott",
      "type-llm-description":
        "Egy LLM osztályozza az üzenetet az Ön által megadott leírás alapján.",
      "prop-prompt-content": "Prompt tartalma",
      "prop-token-count": "Beszélgetés tokenszáma",
      "prop-message-count": "Beszélgetés üzeneteinek száma",
      "prop-current-hour": "Aktuális óra (0–23)",
      "prop-has-image": "Van csatolt képe",
      "cmp-contains": "tartalmazza",
      "cmp-matches-regex": "illeszkedik (regex)",
      "cmp-equals": "egyenlő",
      "cmp-not-equals": "nem egyenlő",
      "cmp-greater-than": "nagyobb, mint",
      "cmp-greater-than-or-equal": "nagyobb vagy egyenlő",
      "cmp-less-than": "kisebb, mint",
      "cmp-less-than-or-equal": "kisebb vagy egyenlő",
      "cmp-between": "között (határokat is beleértve)",
      "placeholder-between-hour": "pl. 9,17 (9 és 17 óra között)",
      "placeholder-between-numeric": "pl. 10,50",
      "placeholder-hour": "pl. 18 (0–23)",
      "placeholder-message-count": "pl. 10",
      "placeholder-numeric": "pl. 4000",
      "placeholder-contains": "pl. kód, python, rust",
      "placeholder-matches": "pl. /\\bpython\\b/i",
      "placeholder-default": "pl. kód",
      "help-contains":
        "Vesszővel elválasztott lista – akkor illeszkedik, ha a prompt bármelyik értéket tartalmazza (kis- és nagybetűtől függetlenül).",
      "help-matches":
        "Reguláris kifejezés. A kis- és nagybetűk megkülönböztetéséhez használja a /minta/jelzők formát (alapértelmezés szerint nem különbözteti meg).",
      "bool-true": "Igaz",
      "bool-false": "Hamis",
    },
    "provider-picker": {
      "select-provider": "Szolgáltató kiválasztása",
      "setup-required": "(beállítás szükséges)",
      "loading-models": "Modellek betöltése...",
      "select-model": "Modell kiválasztása",
      "enter-model": "Adja meg a modell nevét",
      "select-provider-first": "Először válasszon szolgáltatót",
      "configure-to-continue": "A folytatáshoz állítsa be: {{name}}",
      "configure-provider": "{{name}} beállítása",
      "setup-credentials":
        "Adja meg a szükséges hitelesítő adatokat, hogy a(z) {{name}} útválasztási célként használható legyen.",
      cancel: "Mégse",
      "save-settings": "Beállítások mentése",
      "toast-save-failed": "Nem sikerült menteni a beállításokat: {{error}}",
    },
    "router-selection": {
      "loading-routers": "Egyéni útválasztók betöltése...",
      "no-routers-prefix-settings": "Még nincs beállított modellútválasztó.",
      "no-routers-prefix-workspace": "Nincs beállított modellútválasztó.",
      "no-routers-link": "Hozzon létre egyet a Modellútválasztó beállításaiban",
      "model-router-label": "Modellútválasztó",
      "select-router": "Útválasztó kiválasztása",
      "select-description":
        "Válassza ki, melyik útválasztót használja ez a munkaterület.",
      "no-routers-chat":
        "Nincs beállított útválasztó. Hozzon létre egyet itt: Beállítások > MI-szolgáltatók > Modellútválasztó.",
      "rule-count": "({{count}} szabály)",
    },
    metrics: {
      "model-router-default": "Modellútválasztó",
    },
    chat: {
      "select-router-error": "Válasszon útválasztót",
      "invalid-model": "Érvénytelen modellválasztás",
      "routed-to": "Irányítva ide: <route>{{model}}</route>",
      "routed-to-rule":
        "Irányítva ide: <route>{{model}}</route>, a következő szabály alapján: <rule>{{ruleTitle}}</rule>",
    },
  },
  transcription: {
    title: "Átiratmodell beállítása",
    description:
      "Ezek a választott átiratmodell-szolgáltató hitelesítő adatai és beállításai. Fontos, hogy a kulcsok érvényesek és helyesek legyenek, különben a médiafájlok és hangfelvételek átirata nem készül el.",
    provider: "Átirat-szolgáltató",
    "warn-start":
      "A helyi Whisper-modell használata kevés RAM-mal vagy gyenge CPU-val rendelkező gépeken a médiafájlok feldolgozásakor megakaszthatja az AnythingLLM-et.",
    "warn-recommend":
      "Legalább 2 GB RAM és 10 MB-nál kisebb feltöltött fájlok ajánlottak.",
    "warn-end":
      "A beépített modell az első használatkor automatikusan letöltődik.",
  },
  embedding: {
    title: "Beágyazási beállítás",
    "desc-start":
      "Ha olyan LLM-et használ, amely natívan nem támogat beágyazómotort, előfordulhat, hogy külön hitelesítő adatokat kell megadnia a szöveg beágyazásához.",
    "desc-end":
      "A beágyazás a szöveg vektorokká alakításának folyamata. Ezek a hitelesítő adatok szükségesek ahhoz, hogy a fájlok és promptok az AnythingLLM által feldolgozható formátumba kerüljenek.",
    provider: {
      title: "Beágyazási szolgáltató",
    },
  },
  imageGeneration: {
    title: "Képgenerálási beállítás",
    description:
      "Az /img csevegési paranccsal történő képgeneráláshoz használt szolgáltató beállítása.",
    provider: "Képgenerálási szolgáltató",
    card: {
      "failed-to-load": "A képet nem sikerült betölteni",
      "alt-text": "Generált kép",
      edit: "Szerkesztés",
      download: "Letöltés",
    },
    pending: {
      heading: "A kép készül…",
      description:
        "Ez eltarthat egy ideig. Amint elkészül, itt fog megjelenni.",
      aborted: "A képgenerálás megszakadt",
    },
  },
  text: {
    title: "Szövegfelosztási és darabolási beállítások",
    "desc-start":
      "Előfordulhat, hogy módosítani szeretné, hogyan legyenek az új dokumentumok felosztva és feldarabolva, mielőtt a vektoradatbázisba kerülnek.",
    "desc-end":
      "Csak akkor módosítsa ezt a beállítást, ha érti a szövegfelosztás működését és mellékhatásait.",
    size: {
      title: "Szövegdarab mérete",
      description: "Egyetlen vektorban szereplő karakterek maximális száma.",
      recommend: "A beágyazómodell maximális hossza:",
    },
    overlap: {
      title: "Szövegdarabok átfedése",
      description:
        "A darabolás során két szomszédos szövegdarab közötti átfedés maximális karakterszáma.",
    },
  },
  vector: {
    title: "Vektoradatbázis",
    description:
      "Ezek az AnythingLLM-példány működését meghatározó hitelesítő adatok és beállítások. Fontos, hogy a kulcsok érvényesek és helyesek legyenek.",
    provider: {
      title: "Vektoradatbázis-szolgáltató",
      description: "A LanceDB-hez nincs szükség konfigurációra.",
    },
  },
  embeddable: {
    title: "Beágyazható csevegőmodulok",
    description:
      "A beágyazható csevegőmodulok nyilvánosan elérhető csevegőfelületek, amelyek egyetlen munkaterülethez kapcsolódnak. Segítségükkel olyan munkaterületeket építhet, amelyeket aztán nyilvánosan közzétehet.",
    create: "Beágyazás létrehozása",
    table: {
      workspace: "Munkaterület",
      chats: "Elküldött csevegések",
      active: "Aktív domainek",
      created: "Létrehozva",
    },
  },
  "embed-chats": {
    title: "Beágyazott csevegések előzményei",
    export: "Exportálás",
    description:
      "Az összes közzétett beágyazásból rögzített csevegés és üzenet.",
    table: {
      embed: "Beágyazás",
      sender: "Küldő",
      message: "Üzenet",
      response: "Válasz",
      at: "Küldés ideje",
    },
  },
  telegram: {
    title: "Telegram-bot",
    description:
      "Csatlakoztassa AnythingLLM-példányát a Telegramhoz, hogy bármilyen eszközről csevegni tudjon a munkaterületeivel.",
    setup: {
      step1: {
        title: "1. lépés: Telegram-bot létrehozása",
        description:
          "Nyissa meg a @BotFather-t a Telegramban, küldje el a <code>/newbot</code> parancsot a <code>@BotFather</code> részére, kövesse az utasításokat, majd másolja ki az API-tokent.",
        "open-botfather": "BotFather megnyitása",
        "instruction-1":
          "1. Nyissa meg a hivatkozást, vagy olvassa be a QR-kódot",
        "instruction-2":
          "2. Küldje el a <code>/newbot</code> parancsot a <code>@BotFather</code> részére",
        "instruction-3": "3. Adjon nevet és felhasználónevet a botnak",
        "instruction-4": "4. Másolja ki a kapott API-tokent",
      },
      step2: {
        title: "2. lépés: A bot csatlakoztatása",
        description:
          "A bot csatlakoztatásához illessze be a @BotFather-től kapott API-tokent.",
        "bot-token": "Bot-token",
        connecting: "Csatlakozás...",
        "connect-bot": "Bot csatlakoztatása",
      },
      security: {
        title: "Ajánlott biztonsági beállítások",
        description:
          "A nagyobb biztonság érdekében állítsa be ezeket a @BotFather-ben.",
        "disable-groups": "— A bot csoportokhoz adásának tiltása",
        "disable-inline":
          "— A bot inline keresésben való használatának tiltása",
        "obscure-username":
          "Használjon nehezen kitalálható bot-felhasználónevet, hogy a bot nehezebben legyen megtalálható",
      },
      "toast-enter-token": "Adja meg a bot-tokent.",
      "toast-connect-failed": "Nem sikerült csatlakoztatni a botot.",
    },
    connected: {
      status: "Csatlakoztatva",
      "status-disconnected":
        "Lecsatlakozva – a token lejárt vagy érvénytelen lehet",
      "placeholder-token": "Illessze be az új bot-tokent...",
      reconnect: "Újracsatlakozás",
      workspace: "Munkaterület",
      "bot-link": "Bot hivatkozása",
      "voice-response": "Hangos válasz",
      disconnecting: "Lecsatlakozás...",
      disconnect: "Lecsatlakozás",
      "voice-text-only": "Csak szöveg",
      "voice-mirror": "Tükrözés (hangüzenetre hanggal válaszol)",
      "voice-always": "Mindig hang (minden válaszhoz hangot küld)",
      "toast-disconnect-failed": "Nem sikerült lecsatlakoztatni a botot.",
      "toast-reconnect-failed": "Nem sikerült újracsatlakoztatni a botot.",
      "toast-voice-failed": "Nem sikerült frissíteni a hangmódot.",
      "toast-approve-failed": "Nem sikerült jóváhagyni a felhasználót.",
      "toast-deny-failed": "Nem sikerült elutasítani a felhasználót.",
      "toast-revoke-failed":
        "Nem sikerült visszavonni a felhasználó hozzáférését.",
    },
    users: {
      "pending-description":
        "Ellenőrzésre váró felhasználók. Vesse össze az itt látható párosítókódot a felhasználó Telegram-csevegésében megjelenő kóddal.",
      unknown: "Ismeretlen",
    },
  },
  security: {
    title: "Biztonság",
    multiuser: {
      title: "Többfelhasználós mód",
      description:
        "A többfelhasználós mód bekapcsolásával csapata számára is használhatóvá teheti a példányt.",
      enable: {
        "is-enable": "A többfelhasználós mód be van kapcsolva",
        enable: "Többfelhasználós mód bekapcsolása",
        description:
          "Alapértelmezés szerint Ön lesz az egyetlen adminisztrátor. Adminisztrátorként Önnek kell fiókot létrehoznia minden új felhasználó vagy adminisztrátor számára. Ne veszítse el a jelszavát, mert jelszót csak adminisztrátor állíthat vissza.",
        username: "Adminisztrátori fiók felhasználóneve",
        password: "Adminisztrátori fiók jelszava",
      },
    },
    password: {
      title: "Jelszavas védelem",
      description:
        "Védje AnythingLLM-példányát jelszóval. Ha elfelejti, nincs mód a visszaállítására, ezért mindenképp mentse el ezt a jelszót.",
      "password-label": "Példány jelszava",
    },
  },
  event: {
    title: "Eseménynaplók",
    description:
      "A példányon zajló összes művelet és esemény megtekintése megfigyelési célból.",
    clear: "Eseménynaplók törlése",
    table: {
      type: "Eseménytípus",
      user: "Felhasználó",
      occurred: "Időpont",
    },
  },
  privacy: {
    title: "Adatvédelem és adatkezelés",
    description:
      "Itt látható, hogyan kezelik adatait a csatlakoztatott külső szolgáltatók és az AnythingLLM.",
    anonymous: "Névtelen telemetria bekapcsolva",
  },
  connectors: {
    "search-placeholder": "Adatösszekötők keresése",
    "no-connectors": "Nem található adatösszekötő.",
    obsidian: {
      vault_location: "Tároló helye",
      vault_description:
        "Válassza ki az Obsidian-tároló (vault) mappáját az összes jegyzet és kapcsolataik importálásához.",
      selected_files: "{{count}} Markdown-fájl található",
      importing: "Tároló importálása...",
      import_vault: "Tároló importálása",
      processing_time: "Ez a tároló méretétől függően eltarthat egy ideig.",
      vault_warning:
        "Az ütközések elkerülése érdekében győződjön meg róla, hogy az Obsidian-tároló jelenleg nincs megnyitva.",
    },
    github: {
      name: "GitHub-tároló",
      description:
        "Teljes nyilvános vagy privát GitHub-tároló importálása egyetlen kattintással.",
      URL: "GitHub-tároló URL-je",
      URL_explained: "Az összegyűjteni kívánt GitHub-tároló URL-je.",
      token: "GitHub hozzáférési token",
      optional: "nem kötelező",
      token_explained: "Hozzáférési token a lekérési korlátozás elkerüléséhez.",
      token_explained_start: "Egy ",
      token_explained_link1: "személyes hozzáférési token",
      token_explained_middle:
        " nélkül a GitHub API a lekérési korlátok miatt korlátozhatja az összegyűjthető fájlok számát. A probléma elkerüléséhez ",
      token_explained_link2: "létrehozhat egy ideiglenes hozzáférési tokent",
      token_explained_end: ".",
      ignores: "Kihagyott fájlok",
      git_ignore:
        "Adja meg .gitignore formátumban a gyűjtés során kihagyandó fájlokat. Minden bejegyzés után nyomjon Entert a mentéshez.",
      task_explained:
        "A folyamat végén az összes fájl elérhető lesz a dokumentumválasztóban a munkaterületekbe való beágyazáshoz.",
      branch: "Az ág, amelyből a fájlokat gyűjteni szeretné.",
      branch_loading: "-- elérhető ágak betöltése --",
      branch_explained: "Az ág, amelyből a fájlokat gyűjteni szeretné.",
      token_information:
        "A <b>GitHub hozzáférési token</b> megadása nélkül ez az adatösszekötő a GitHub nyilvános API-jának korlátai miatt csak a tároló <b>legfelső szintű</b> fájljait tudja összegyűjteni.",
      token_personal:
        "Ingyenes személyes hozzáférési tokent itt kérhet GitHub-fiókjával.",
    },
    gitlab: {
      name: "GitLab-tároló",
      description:
        "Teljes nyilvános vagy privát GitLab-tároló importálása egyetlen kattintással.",
      URL: "GitLab-tároló URL-je",
      URL_explained: "Az összegyűjteni kívánt GitLab-tároló URL-je.",
      token: "GitLab hozzáférési token",
      optional: "nem kötelező",
      token_description:
        "Válassza ki, milyen további elemeket kérjen le a GitLab API-ból.",
      token_explained_start: "Egy ",
      token_explained_link1: "személyes hozzáférési token",
      token_explained_middle:
        " nélkül a GitLab API a lekérési korlátok miatt korlátozhatja az összegyűjthető fájlok számát. A probléma elkerüléséhez ",
      token_explained_link2: "létrehozhat egy ideiglenes hozzáférési tokent",
      token_explained_end: ".",
      fetch_issues: "Issue-k lekérése dokumentumként",
      ignores: "Kihagyott fájlok",
      git_ignore:
        "Adja meg .gitignore formátumban a gyűjtés során kihagyandó fájlokat. Minden bejegyzés után nyomjon Entert a mentéshez.",
      task_explained:
        "A folyamat végén az összes fájl elérhető lesz a dokumentumválasztóban a munkaterületekbe való beágyazáshoz.",
      branch: "Az ág, amelyből a fájlokat gyűjteni szeretné",
      branch_loading: "-- elérhető ágak betöltése --",
      branch_explained: "Az ág, amelyből a fájlokat gyűjteni szeretné.",
      token_information:
        "A <b>GitLab hozzáférési token</b> megadása nélkül ez az adatösszekötő a GitLab nyilvános API-jának korlátai miatt csak a tároló <b>legfelső szintű</b> fájljait tudja összegyűjteni.",
      token_personal:
        "Ingyenes személyes hozzáférési tokent itt kérhet GitLab-fiókjával.",
    },
    gitea: {
      name: "Gitea-tároló",
      description:
        "Teljes nyilvános vagy privát tároló importálása bármely Gitea-példányból egyetlen kattintással.",
      URL: "Gitea-tároló URL-je",
      URL_explained:
        "Az összegyűjteni kívánt tároló URL-je a Gitea-példányon – saját üzemeltetésű példányok is támogatottak.",
      token: "Gitea hozzáférési token",
      optional: "nem kötelező",
      token_explained:
        "Privát tárolók, illetve hitelesítést igénylő példányokon lévő tárolók gyűjtéséhez hozzáférési token szükséges.",
      token_explained_start: "",
      token_explained_link1: "Hozzáférési token",
      token_explained_end:
        " nélkül csak a Gitea-példány által nyilvánosan elérhetővé tett tárolók gyűjthetők.",
      ignores: "Kihagyott fájlok",
      git_ignore:
        "Adja meg .gitignore formátumban a gyűjtés során kihagyandó fájlokat. Minden bejegyzés után nyomjon Entert a mentéshez.",
      task_explained:
        "A folyamat végén az összes fájl elérhető lesz a dokumentumválasztóban a munkaterületekbe való beágyazáshoz.",
      branch: "Az ág, amelyből a fájlokat gyűjteni szeretné.",
      branch_loading: "-- elérhető ágak betöltése --",
      branch_explained: "Az ág, amelyből a fájlokat gyűjteni szeretné.",
      token_information:
        "A <b>Gitea hozzáférési token</b> megadása nélkül ez az adatösszekötő csak a Gitea-példányon <b>nyilvánosan olvasható</b> tárolók fájljait tudja összegyűjteni.",
    },
    youtube: {
      name: "YouTube-átirat",
      description:
        "Egy teljes YouTube-videó átiratának importálása hivatkozás alapján.",
      URL: "YouTube-videó URL-je",
      URL_explained_start:
        "Adja meg bármely YouTube-videó URL-jét az átirat lekéréséhez. A videóhoz elérhetőnek kell lennie ",
      URL_explained_link: "feliratnak",
      URL_explained_end: ".",
      task_explained:
        "A folyamat végén az átirat elérhető lesz a dokumentumválasztóban a munkaterületekbe való beágyazáshoz.",
    },
    "website-depth": {
      name: "Tömeges hivatkozásletöltő",
      description:
        "Egy weboldal és alhivatkozásainak letöltése adott mélységig.",
      URL: "Weboldal URL-je",
      URL_explained: "A letölteni kívánt weboldal URL-je.",
      depth: "Bejárási mélység",
      depth_explained:
        "Ennyi szint mélységig követi a folyamat a kiinduló URL-ről nyíló hivatkozásokat.",
      max_pages: "Oldalak maximális száma",
      max_pages_explained: "A letöltendő hivatkozások maximális száma.",
      task_explained:
        "A folyamat végén a letöltött tartalom elérhető lesz a dokumentumválasztóban a munkaterületekbe való beágyazáshoz.",
    },
    confluence: {
      name: "Confluence",
      description: "Teljes Confluence-oldal importálása egyetlen kattintással.",
      deployment_type: "Confluence telepítési típusa",
      deployment_type_explained:
        "Adja meg, hogy a Confluence-példány az Atlassian felhőjében fut vagy saját üzemeltetésű.",
      base_url: "Confluence alap-URL",
      base_url_explained: "A Confluence-tér alap-URL-je.",
      space_key: "Confluence-tér kulcsa",
      space_key_explained:
        "A használni kívánt Confluence-tér kulcsa. Általában ~ jellel kezdődik",
      username: "Confluence-felhasználónév",
      username_explained: "Az Ön Confluence-felhasználóneve",
      auth_type: "Confluence hitelesítési típusa",
      auth_type_explained:
        "Válassza ki, milyen hitelesítéssel szeretné elérni a Confluence-oldalakat.",
      auth_type_username: "Felhasználónév és hozzáférési token",
      auth_type_personal: "Személyes hozzáférési token",
      token: "Confluence hozzáférési token",
      token_explained_start:
        "A hitelesítéshez hozzáférési tokent kell megadnia. Hozzáférési tokent itt hozhat létre:",
      token_explained_link: "itt",
      token_desc: "Hozzáférési token a hitelesítéshez",
      pat_token: "Confluence személyes hozzáférési token",
      pat_token_explained: "Az Ön Confluence személyes hozzáférési tokenje.",
      bypass_ssl: "SSL-tanúsítvány ellenőrzésének kihagyása",
      bypass_ssl_explained:
        "Kapcsolja be ezt az opciót, ha saját üzemeltetésű, önaláírt tanúsítványt használó Confluence-példánynál ki szeretné hagyni az SSL-tanúsítvány ellenőrzését",
      task_explained:
        "A folyamat végén az oldal tartalma elérhető lesz a dokumentumválasztóban a munkaterületekbe való beágyazáshoz.",
    },
    manage: {
      documents: "Dokumentumok",
      "data-connectors": "Adatösszekötők",
      "desktop-only":
        "Ezek a beállítások csak asztali eszközön szerkeszthetők. A folytatáshoz nyissa meg ezt az oldalt asztali gépen.",
      dismiss: "Elvetés",
      editing: "Szerkesztés",
    },
    directory: {
      "my-documents": "Saját dokumentumok",
      "new-folder": "Új mappa",
      "total-documents_one": "{{count}} dokumentum",
      "total-documents_other": "{{count}} dokumentum",
      "search-results_one": "{{count}} találat",
      "search-results_other": "{{count}} találat",
      "search-document": "Dokumentum keresése",
      "no-documents": "Nincsenek dokumentumok",
      "move-workspace": "Áthelyezés munkaterületre",
      "delete-confirmation":
        "Biztosan törli ezeket a fájlokat és mappákat?\nA fájlok törlődnek a rendszerből, és automatikusan eltávolításra kerülnek minden meglévő munkaterületről.\nEz a művelet nem vonható vissza.",
      "removing-message":
        "{{count}} dokumentum és {{folderCount}} mappa eltávolítása folyamatban. Kérjük, várjon.",
      "move-success": "{{count}} dokumentum sikeresen áthelyezve.",
      no_docs: "Nincsenek dokumentumok",
      select_all: "Összes kijelölése",
      deselect_all: "Kijelölés megszüntetése",
      remove_selected: "Kijelöltek eltávolítása",
      save_embed: "Mentés és beágyazás",
    },
    upload: {
      "processor-offline": "A dokumentumfeldolgozó nem érhető el",
      "processor-offline-desc":
        "A fájlokat most nem lehet feltölteni, mert a dokumentumfeldolgozó nem érhető el. Próbálja újra később.",
      "click-upload": "Kattintson a feltöltéshez, vagy húzza ide a fájlokat",
      "file-types":
        "támogatja a szövegfájlokat, CSV-ket, táblázatokat, hangfájlokat és még sok mást!",
      "or-submit-link": "vagy adjon meg egy hivatkozást",
      "placeholder-link": "https://example.com",
      fetching: "Lekérés...",
      "fetch-website": "Weboldal lekérése",
      "privacy-notice":
        "A fájlok az ezen az AnythingLLM-példányon futó dokumentumfeldolgozóba kerülnek feltöltésre. A fájlokat nem küldjük el és nem osztjuk meg harmadik féllel.",
    },
    pinning: {
      what_pinning: "Mit jelent a dokumentum rögzítése?",
      pin_explained_block1:
        "Ha az AnythingLLM-ben <b>rögzít</b> egy dokumentumot, annak teljes tartalmát beillesztjük a promptba, hogy az LLM teljes egészében értelmezhesse.",
      pin_explained_block2:
        "Ez <b>nagy kontextusú modellekkel</b>, illetve a tudásbázis szempontjából kulcsfontosságú kis fájlokkal működik a legjobban.",
      pin_explained_block3:
        "Ha alapbeállítással nem kapja meg a kívánt válaszokat az AnythingLLM-től, a rögzítéssel egy kattintással jobb minőségű válaszokat kaphat.",
      accept: "Rendben, értem",
    },
    watching: {
      what_watching: "Mit jelent a dokumentum figyelése?",
      watch_explained_block1:
        "Ha az AnythingLLM-ben <b>figyel</b> egy dokumentumot, annak tartalmát rendszeres időközönként <i>automatikusan</i> szinkronizáljuk az eredeti forrásból. Ez minden olyan munkaterületen automatikusan frissíti a tartalmat, ahol a fájl szerepel.",
      watch_explained_block2:
        "Ez a funkció jelenleg online tartalmakat támogat, kézzel feltöltött dokumentumokhoz nem érhető el.",
      watch_explained_block3_start: "A figyelt dokumentumokat a(z) ",
      watch_explained_block3_link: "Fájlkezelő",
      watch_explained_block3_end: " adminisztrátori nézetben kezelheti.",
      accept: "Rendben, értem",
    },
  },
  chat_window: {
    attachments_processing:
      "A mellékletek feldolgozása folyamatban. Kérjük, várjon...",
    generating_response: "Válasz készítése",
    thought_in_progress: "A modell gondolkodik...",
    thoughts: "Gondolatmenet",
    response_failed: "Nem sikerült válaszolni az üzenetre.",
    response_failed_reason: "Ok: {{reason}}",
    send_message: "Írjon üzenetet",
    attach_file: "Fájl csatolása a csevegéshez",
    text_size: "Szövegméret módosítása.",
    export: "Csevegés exportálása...",
    exporting: "Exportálás...",
    microphone: "Mondja el a promptot.",
    stt_unsupported: "Ez a böngésző nem támogatja a mikrofon-hozzáférést.",
    stt_mic_denied:
      "Nem sikerült hozzáférni a mikrofonhoz. Adjon engedélyt, és próbálja újra.",
    stt_transcription_failed: "Az átirat készítése sikertelen: {{error}}",
    send: "Prompt elküldése a munkaterületnek",
    tts_speak_message: "Üzenet felolvasása",
    copy: "Másolás",
    regenerate: "Újragenerálás",
    regenerate_response: "Válasz újragenerálása",
    good_response: "Jó válasz",
    more_actions: "További műveletek",
    sources: "Források",
    source_count_one: "{{count}} hivatkozás",
    source_count_other: "{{count}} hivatkozás",
    document: "Dokumentum",
    similarity_match: "egyezés",
    fork: "Elágaztatás",
    delete: "Törlés",
    cancel: "Mégse",
    submit: "Küldés",
    edit_prompt: "Prompt szerkesztése",
    edit_response: "Válasz szerkesztése",
    edit_info_user:
      "A „Küldés” újragenerálja az MI válaszát. A „Mentés” csak az Ön üzenetét frissíti.",
    edit_info_assistant:
      "A módosítások közvetlenül ebbe a válaszba kerülnek mentésre.",
    see_less: "Kevesebb",
    see_more: "Továbbiak",
    preset_reset_description:
      "Csevegési előzmények törlése és új csevegés indítása",
    preset_img_description: "Kép generálása szöveges prompt alapján",
    add_new_preset: " Új sablon hozzáadása",
    add_new: "Új hozzáadása",
    edit: "Szerkesztés",
    publish: "Közzététel",
    stop_generating: "Válaszgenerálás leállítása",
    command: "Parancs",
    your_command: "sajat-parancs",
    placeholder_prompt: "Ez a tartalom kerül a prompt elé.",
    description: "Leírás",
    placeholder_description: "Egy verssel válaszol az LLM-ekről.",
    save: "Mentés",
    small: "Kicsi",
    normal: "Normál",
    large: "Nagy",
    tools: "Eszközök",
    text_size_label: "Szövegméret",
    select_model: "Modell kiválasztása",
    slash_commands: "Perjeles parancsok",
    agent_skills: "Ügynökképességek",
    manage_agent_skills: "Ügynökképességek kezelése",
    app_integrations: "Alkalmazás-integrációk",
    custom_skills: "Egyéni képességek",
    agent_flows: "Ügynökfolyamatok",
    sub_skills: "Alképességek",
    no_tools_found: "Nincs megfelelő eszköz",
    loading_mcp_servers: "MCP-kiszolgálók betöltése...",
    start_agent_session: "Ügynökmunkamenet indítása",
    agent_skills_disabled_in_session:
      "Aktív ügynökmunkamenet közben a képességek nem módosíthatók. Előbb zárja le a munkamenetet az /exit paranccsal.",
    use_agent_session_to_use_tools:
      "A csevegésben úgy használhat eszközöket, hogy a prompt elejére írt „@agent” paranccsal ügynökmunkamenetet indít.",
    workspace_llm_manager: {
      search: "Keresés",
      loading_workspace_settings: "Munkaterület-beállítások betöltése...",
      available_models: "Elérhető modellek – {{provider}}",
      available_models_description:
        "Válassza ki a munkaterületen használandó modellt.",
      save: "Modell használata",
      saving: "Modell beállítása a munkaterület alapértelmezettjeként...",
      missing_credentials:
        "Ehhez a szolgáltatóhoz hiányoznak a hitelesítő adatok!",
      missing_credentials_description: "Beállítás most",
    },
    agent_invocation: {
      model_wants_to_call: "A modell a következőt szeretné meghívni:",
      approve: "Jóváhagyás",
      reject: "Elutasítás",
      always_allow: "{{skillName}} engedélyezése mindig",
      tool_call_was_approved: "Az eszközhívás jóváhagyva",
      tool_call_was_rejected: "Az eszközhívás elutasítva",
      clarifying_skip: "Döntsön az ügynök",
      clarifying_submit: "Küldés",
      clarifying_skipped: "Az ügynökre bízta a döntést.",
      clarifying_timeout: "Nem érkezett válasz időben.",
      clarifying_pagination: "{{current}} / {{total}}",
      clarifying_prev_aria: "Előző kérdés",
      clarifying_next_aria: "Következő kérdés",
      clarifying_close_aria: "Bezárás és kihagyás",
      clarifying_other: "Egyéb",
      clarifying_other_placeholder: "Írja be a válaszát",
      batch_progress: "{{total}} kérdésből {{answered}} megválaszolva",
      batch_skip_this: "Kihagyás",
      batch_submit_all: "Összes elküldése",
      batch_next: "Következő",
      answer_skipped: "[a felhasználó kihagyta]",
    },
    memories: {
      title: "Emlékek",
      empty:
        "Még nincsenek emlékek. Ahogy többet használja a csevegőt, újabb emlékek jönnek létre, vagy",
      empty_cta: "hozzon létre egy új emléket",
      tab_workspace: "Munkaterület",
      tab_global: "Globális",
      toggle: {
        label: "Személyre szabás bekapcsolása",
        description:
          "Lehetővé teszi, hogy az asszisztens megjegyezzen tényeket Önről vagy erről a munkaterületről, és felhasználja őket a beszélgetésekben",
      },
      auto_extraction: {
        label: "Automatikus emlékek",
        description:
          "Az asszisztens a háttérben automatikusan hoz létre emlékeket",
      },
      menu: {
        edit: "Szerkesztés",
        delete: "Törlés",
        move_to_global: "Áthelyezés a globálisak közé",
        move_to_workspace: "Áthelyezés a munkaterülethez",
      },
      modal: {
        create_title: "Emlék létrehozása",
        edit_title: "Emlék szerkesztése",
        create_description:
          "Egy emlék egyetlen, tömör állítás legyen. Pl. „A felhasználó a Pythont előnyben részesíti a JavaScripttel szemben”",
        edit_description: "Az emlék tartalmának frissítése.",
        label: "Emlék",
        placeholder:
          "pl. A felhasználó neve József, a felhasználó az AnythingLLM-en dolgozik stb.",
        create: "Létrehozás",
        save: "Mentés",
        cancel: "Mégse",
      },
    },
    leave_generating: {
      title: "Leállítja a válaszgenerálást?",
      description:
        "Ha elhagyja ezt a csevegést, a modell leállítja a válasz generálását, és az nem állítható helyre.",
      cancel: "Mégse",
      confirm: "Folytatás",
    },
  },
  profile_settings: {
    edit_account: "Fiók szerkesztése",
    profile_picture: "Profilkép",
    remove_profile_picture: "Profilkép eltávolítása",
    username: "Felhasználónév",
    new_password: "Új jelszó",
    password_description:
      "A jelszónak legalább 8 karakter hosszúnak kell lennie",
    cancel: "Mégse",
    update_account: "Fiók frissítése",
    theme: "Téma",
    language: "Előnyben részesített nyelv",
    failed_upload: "Nem sikerült feltölteni a profilképet: {{error}}",
    upload_success: "Profilkép feltöltve.",
    failed_remove: "Nem sikerült eltávolítani a profilképet: {{error}}",
    profile_updated: "Profil frissítve.",
    failed_update_user: "Nem sikerült frissíteni a felhasználót: {{error}}",
    account: "Fiók",
    support: "Támogatás",
    signout: "Kijelentkezés",
  },
  "keyboard-shortcuts": {
    title: "Billentyűparancsok",
    shortcuts: {
      settings: "Beállítások megnyitása",
      workspaceSettings: "Aktuális munkaterület beállításainak megnyitása",
      home: "Ugrás a kezdőlapra",
      workspaces: "Munkaterületek kezelése",
      apiKeys: "API-kulcsok beállításai",
      llmPreferences: "LLM beállítások",
      chatSettings: "Csevegési beállítások",
      help: "Billentyűparancsok súgójának megjelenítése",
      showLLMSelector: "Munkaterület LLM-választójának megjelenítése",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Sikerült!",
        success_description:
          "A rendszerprompt megjelent a közösségi központban!",
        success_thank_you: "Köszönjük, hogy megosztotta a közösséggel!",
        view_on_hub: "Megtekintés a közösségi központban",
        modal_title: "Rendszerprompt közzététele",
        name_label: "Név",
        name_description: "A rendszerprompt megjelenített neve.",
        name_placeholder: "Saját rendszerprompt",
        description_label: "Leírás",
        description_description:
          "A rendszerprompt leírása. Írja le benne a rendszerprompt célját.",
        tags_label: "Címkék",
        tags_description:
          "A címkék a rendszerprompt könnyebb kereshetőségét szolgálják. Több címkét is megadhat, legfeljebb 5-öt, címkénként legfeljebb 20 karakterrel.",
        tags_placeholder: "Írja be, majd nyomjon Entert a címke hozzáadásához",
        visibility_label: "Láthatóság",
        public_description: "A nyilvános rendszerpromptokat mindenki láthatja.",
        private_description: "A privát rendszerpromptokat csak Ön láthatja.",
        publish_button: "Közzététel a közösségi központban",
        submitting: "Közzététel...",
        prompt_label: "Prompt",
        prompt_description:
          "Maga a rendszerprompt, amely az LLM működését irányítja.",
        prompt_placeholder: "Írja ide a rendszerpromptot...",
      },
      agent_flow: {
        success_title: "Sikerült!",
        success_description:
          "Az ügynökfolyamat megjelent a közösségi központban!",
        success_thank_you: "Köszönjük, hogy megosztotta a közösséggel!",
        view_on_hub: "Megtekintés a közösségi központban",
        modal_title: "Ügynökfolyamat közzététele",
        name_label: "Név",
        name_description: "Az ügynökfolyamat megjelenített neve.",
        name_placeholder: "Saját ügynökfolyamat",
        description_label: "Leírás",
        description_description:
          "Az ügynökfolyamat leírása. Írja le benne az ügynökfolyamat célját.",
        tags_label: "Címkék",
        tags_description:
          "A címkék az ügynökfolyamat könnyebb kereshetőségét szolgálják. Több címkét is megadhat, legfeljebb 5-öt, címkénként legfeljebb 20 karakterrel.",
        tags_placeholder: "Írja be, majd nyomjon Entert a címke hozzáadásához",
        visibility_label: "Láthatóság",
        submitting: "Közzététel...",
        submit: "Közzététel a közösségi központban",
        privacy_note:
          "Az ügynökfolyamatok az esetleges érzékeny adatok védelme érdekében mindig privátként kerülnek feltöltésre. A láthatóságot közzététel után a közösségi központban módosíthatja. Közzététel előtt ellenőrizze, hogy a folyamat nem tartalmaz érzékeny vagy személyes információt.",
      },
      slash_command: {
        success_title: "Sikerült!",
        success_description:
          "A perjeles parancs megjelent a közösségi központban!",
        success_thank_you: "Köszönjük, hogy megosztotta a közösséggel!",
        view_on_hub: "Megtekintés a közösségi központban",
        modal_title: "Perjeles parancs közzététele",
        name_label: "Név",
        name_description: "A perjeles parancs megjelenített neve.",
        name_placeholder: "Saját perjeles parancs",
        description_label: "Leírás",
        description_description:
          "A perjeles parancs leírása. Írja le benne a perjeles parancs célját.",
        tags_label: "Címkék",
        tags_description:
          "A címkék a perjeles parancs könnyebb kereshetőségét szolgálják. Több címkét is megadhat, legfeljebb 5-öt, címkénként legfeljebb 20 karakterrel.",
        tags_placeholder: "Írja be, majd nyomjon Entert a címke hozzáadásához",
        visibility_label: "Láthatóság",
        public_description:
          "A nyilvános perjeles parancsokat mindenki láthatja.",
        private_description: "A privát perjeles parancsokat csak Ön láthatja.",
        publish_button: "Közzététel a közösségi központban",
        submitting: "Közzététel...",
        prompt_label: "Prompt",
        prompt_description:
          "Ez a prompt kerül felhasználásra, amikor a perjeles parancsot meghívják.",
        prompt_placeholder: "Írja ide a promptot...",
      },
      generic: {
        unauthenticated: {
          title: "Hitelesítés szükséges",
          description:
            "Elemek közzététele előtt hitelesítenie kell magát az AnythingLLM közösségi központban.",
          button: "Csatlakozás a közösségi központhoz",
        },
      },
    },
  },
  scheduledJobs: {
    title: "Ütemezett feladatok",
    enableNotifications:
      "Böngészőértesítések bekapcsolása a feladatok eredményeiről",
    description:
      "Ütemezetten, ismétlődően futó MI-feladatok létrehozása. Minden feladat egy promptot futtat, opcionálisan eszközökkel, és az eredményt elmenti áttekintésre.",
    newJob: "Új feladat",
    loading: "Betöltés...",
    emptyTitle: "Még nincsenek ütemezett feladatok",
    emptySubtitle: "A kezdéshez hozzon létre egyet.",
    table: {
      name: "Név",
      schedule: "Ütemezés",
      status: "Állapot",
      lastRun: "Utolsó futás",
      nextRun: "Következő futás",
      actions: "Műveletek",
    },
    confirmDelete: "Biztosan törli ezt az ütemezett feladatot?",
    status: {
      completed: "Befejezve",
      failed: "Sikertelen",
      timed_out: "Időtúllépés",
      running: "Fut",
      queued: "Sorban áll",
    },
    toast: {
      deleted: "Feladat törölve",
      triggered: "A feladat sikeresen elindítva",
      triggerFailed: "Nem sikerült elindítani a feladatot",
      triggerSkipped: "Ennek a feladatnak már fut egy példánya",
      killed: "A feladat sikeresen leállítva",
      killFailed: "Nem sikerült leállítani a feladatot",
    },
    row: {
      neverRun: "Még nem futott",
      viewRuns: "Futások megtekintése",
      runNow: "Futtatás most",
      enable: "Engedélyezés",
      disable: "Letiltás",
      edit: "Szerkesztés",
      delete: "Törlés",
    },
    modal: {
      titleEdit: "Ütemezett feladat szerkesztése",
      titleNew: "Új ütemezett feladat",
      nameLabel: "Név",
      namePlaceholder: "pl. Napi hírösszefoglaló",
      promptLabel: "Prompt",
      promptPlaceholder: "Az utasítás, amely minden futáskor végrehajtódik...",
      scheduleLabel: "Ütemezés",
      modeBuilder: "Varázsló",
      modeCustom: "Egyéni",
      cronPlaceholder: "Cron-kifejezés (pl. 0 9 * * *)",
      currentSchedule: "Jelenlegi ütemezés:",
      toolsLabel: "Eszközök (nem kötelező)",
      toolsDescription:
        "Válassza ki, mely ügynökeszközöket használhatja a feladat. Ha egyet sem választ, a feladat eszközök nélkül fut.",
      toolsSearch: "Keresés",
      toolsNoResults: "Nincs megfelelő eszköz",
      required: "Kötelező",
      requiredFieldsBanner:
        "A feladat létrehozásához töltse ki az összes kötelező mezőt.",
      cancel: "Mégse",
      saving: "Mentés...",
      updateJob: "Feladat frissítése",
      createJob: "Feladat létrehozása",
      jobUpdated: "Feladat frissítve",
      jobCreated: "Feladat létrehozva",
    },
    builder: {
      fallbackWarning:
        "Ez a kifejezés vizuálisan nem szerkeszthető. A megtartásához váltson Egyéni módra, vagy módosítson bármit alább a felülírásához.",
      run: "Futtatás",
      frequency: {
        minute: "percenként",
        hour: "óránként",
        day: "naponta",
        week: "hetente",
        month: "havonta",
      },
      every: "Gyakoriság:",
      minuteOne: "1 perc",
      minuteOther: "{{count}} perc",
      atMinute: "Minden óra",
      pastEveryHour: "percében",
      at: "Időpont:",
      on: "Napok:",
      onDay: "Minden hónap",
      ofEveryMonth: "napján",
      weekdays: {
        sun: "V",
        mon: "H",
        tue: "K",
        wed: "Sze",
        thu: "Cs",
        fri: "P",
        sat: "Szo",
      },
    },
    runHistory: {
      back: "Vissza a feladatokhoz",
      title: "Futási előzmények: {{name}}",
      schedule: "Ütemezés:",
      emptyTitle: "Ez a feladat még nem futott",
      emptySubtitle:
        "Futtassa most a feladatot, és tekintse meg az eredményét.",
      runNow: "Futtatás most",
      stopJob: "Feladat leállítása",
      table: {
        status: "Állapot",
        started: "Indítva",
        duration: "Időtartam",
        error: "Hiba",
      },
    },
    runDetail: {
      loading: "Futás részleteinek betöltése...",
      notFound: "A futás nem található.",
      back: "Vissza",
      unknownJob: "Ismeretlen feladat",
      runHeading: "{{name}} – #{{id}}. futás",
      duration: "Időtartam: {{value}}",
      continueInThread: "Folytatás csevegésben",
      creating: "Létrehozás...",
      threadFailed: "Nem sikerült létrehozni a szálat",
      stopJob: "Feladat leállítása",
      killing: "Leállítás...",
      sections: {
        prompt: "Prompt",
        error: "Hiba",
        thinking: "Gondolatmenet ({{count}})",
        toolCalls: "Eszközhívások ({{count}})",
        files: "Fájlok ({{count}})",
        response: "Válasz",
        metrics: "Mérőszámok",
      },
      metrics: {
        promptTokens: "Prompt tokenek:",
        completionTokens: "Válasz tokenek:",
      },
    },
    toolCall: {
      arguments: "Argumentumok:",
      showResult: "Eredmény megjelenítése",
      hideResult: "Eredmény elrejtése",
    },
    file: {
      unknown: "Ismeretlen fájl",
      download: "Letöltés",
      downloadFailed: "Nem sikerült letölteni a fájlt",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF-dokumentum",
        word: "Word-dokumentum",
        spreadsheet: "Táblázat",
        generic: "Fájl",
      },
    },
  },
};

export default TRANSLATIONS;
