// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      welcome: "Benvingut",
      getStarted: "Comença",
    },
    llm: {
      title: "Preferència de LLM",
      description:
        "AnythingLLM pot treballar amb molts proveïdors de LLM. Aquest serà el servei que gestionarà les converses.",
    },
    userSetup: {
      title: "Configuració d'usuari",
      description: "Configura els paràmetres d'usuari.",
      howManyUsers: "Quants usuaris faran servir aquesta instància?",
      justMe: "Només jo",
      myTeam: "El meu equip",
      instancePassword: "Contrasenya de la instància",
      setPassword: "Vols configurar una contrasenya?",
      passwordReq: "Les contrasenyes han de tenir almenys 8 caràcters.",
      passwordWarn:
        "És important guardar aquesta contrasenya, ja que no hi ha cap mètode de recuperació.",
      adminUsername: "Nom d'usuari del compte d'administrador",
      adminPassword: "Contrasenya del compte d'administrador",
      adminPasswordReq: "Les contrasenyes han de tenir almenys 8 caràcters.",
      teamHint:
        "Per defecte, seràs l'únic administrador. Un cop completat l'onboarding, podràs crear i convidar altres persones com a usuaris o administradors. No perdis la contrasenya, ja que només els administradors poden restablir contrasenyes.",
    },
    data: {
      title: "Gestió de dades i privadesa",
      description:
        "Estem compromesos amb la transparència i el control de les teves dades personals.",
      settingsHint:
        "Aquests paràmetres es poden reconfigurar en qualsevol moment a la configuració.",
    },
    survey: {
      title: "Benvingut a AnythingLLM",
      description:
        "Ajuda'ns a fer que AnythingLLM s'adapti a les teves necessitats. Opcional.",
      email: "Quin és el teu correu electrònic?",
      useCase: "Per a què faràs servir AnythingLLM?",
      useCaseWork: "Per a la feina",
      useCasePersonal: "Per a ús personal",
      useCaseOther: "Altres",
      comment: "Com has sabut d'AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - Fes-nos saber com ens has trobat!",
      skip: "Omet l'enquesta",
      thankYou: "Gràcies pels teus comentaris!",
    },
  },
  common: {
    "workspaces-name": "Nom de l'espai de treball",
    selection: "Selecció de model",
    saving: "Desant...",
    save: "Desa els canvis",
    previous: "Pàgina anterior",
    next: "Pàgina següent",
    optional: "Opcional",
    yes: "Sí",
    no: "No",
    on: "Activat",
    none: "Cap",
    stopped: "Aturat",
    search: "Cerca",
    username_requirements:
      "El nom d'usuari ha de tenir entre 2 i 32 caràcters, començar amb una lletra minúscula i només pot contenir lletres minúscules, números, guions baixos, guions i punts.",
    loading: "Carregant",
    refresh: "Actualitza",
  },
  home: {
    welcome: "Benvingut",
    chooseWorkspace: "Tria un espai de treball per començar a xatejar!",
    notAssigned:
      "Actualment no estàs assignat a cap espai de treball.\nPosa't en contacte amb el teu administrador per sol·licitar accés a un espai de treball.",
    goToWorkspace: 'Vés a "{{workspace}}"',
  },
  settings: {
    title: "Configuració de la instància",
    invites: "Invitacions",
    users: "Usuaris",
    workspaces: "Espais de treball",
    "workspace-chats": "Xats de l'espai de treball",
    customization: "Personalització",
    interface: "Preferències d'interfície",
    branding: "Marca i etiqueta blanca",
    chat: "Xat",
    "api-keys": "API per a desenvolupadors",
    llm: "LLM",
    transcription: "Transcripció",
    embedder: "Embolicador",
    "text-splitting": "Divisor i segmentador de text",
    "voice-speech": "Veu i parla",
    "vector-database": "Base de dades vectorial",
    embeds: "Widget de xat incrustat",
    security: "Seguretat",
    "event-logs": "Registres d'esdeveniments",
    privacy: "Privadesa i dades",
    "ai-providers": "Proveïdors d'IA",
    "agent-skills": "Habilitats de l'agent",
    "community-hub": {
      title: "Centre de la comunitat",
      trending: "Explora les tendències",
      "your-account": "El teu compte",
      "import-item": "Importa un element",
    },
    admin: "Administrador",
    tools: "Eines",
    "system-prompt-variables": "Variables del missatge del sistema",
    "experimental-features": "Funcions experimentals",
    contact: "Contacta el suport",
    "browser-extension": "Extensió del navegador",
    "mobile-app": "AnythingLLM Mòbil",
    channels: "Canals",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Feines programades",
  },
  login: {
    "multi-user": {
      welcome: "Benvingut",
      "placeholder-username": "Nom d'usuari",
      "placeholder-password": "Contrasenya",
      login: "Inicia sessió",
      validating: "Validant...",
      "forgot-pass": "Contrasenya oblidada",
      reset: "Restableix",
    },
    "sign-in":
      "Introdueix el teu nom d'usuari i contrasenya per accedir a la teva instància de {{appName}}.",
    "password-reset": {
      title: "Restabliment de contrasenya",
      description:
        "Proporciona la informació necessària a continuació per restablir la teva contrasenya.",
      "recovery-codes": "Codis de recuperació",
      "back-to-login": "Torna a l'inici de sessió",
    },
  },
  "main-page": {
    greeting: "Com et puc ajudar avui?",
    quickActions: {
      createAgent: "Crea un agent",
      editWorkspace: "Edita l'espai de treball",
      uploadDocument: "Puja un document",
    },
  },
  "new-workspace": {
    title: "Nou espai de treball",
    placeholder: "El meu espai de treball",
  },
  "workspaces—settings": {
    general: "Configuració general",
    chat: "Configuració del xat",
    vector: "Base de dades vectorial",
    members: "Membres",
    agent: "Configuració de l'agent",
  },
  general: {
    vector: {
      title: "Recompte de vectors",
      description: "Nombre total de vectors a la teva base de dades vectorial.",
    },
    names: {
      description:
        "Això només canviarà el nom visible del teu espai de treball.",
    },
    message: {
      title: "Missatges de xat suggerits",
      description:
        "Personalitza els missatges que es suggeriràn als usuaris del teu espai de treball.",
      add: "Afegeix un missatge nou",
      save: "Desa els missatges",
      heading: "Explica'm",
      body: "els beneficis d'AnythingLLM",
    },
    delete: {
      title: "Elimina l'espai de treball",
      description:
        "Elimina aquest espai de treball i totes les seves dades. Això eliminarà l'espai de treball per a tots els usuaris.",
      delete: "Elimina l'espai de treball",
      deleting: "Eliminant l'espai de treball...",
      "confirm-start": "Estàs a punt d'eliminar el teu",
      "confirm-end":
        "espai de treball. Això eliminarà tots els embeddings vectorials de la teva base de dades vectorial.\n\nEls fitxers originals no es modificaran. Aquesta acció és irreversible.",
    },
  },
  chat: {
    llm: {
      title: "Proveïdor de LLM de l'espai de treball",
      description:
        "El proveïdor de LLM i el model específics que s'usaran per a aquest espai de treball. Per defecte, utilitza el proveïdor i la configuració del sistema de LLM.",
      search: "Cerca tots els proveïdors de LLM",
    },
    model: {
      title: "Model de xat de l'espai de treball",
      description:
        "El model de xat específic que s'usarà per a aquest espai de treball. Si és buit, s'usarà la preferència de LLM del sistema.",
    },
    mode: {
      title: "Mode de xat",
      automatic: {
        description:
          "usarà eines automàticament si el model i el proveïdor suporten crida d'eines nativa.<br />Si no s'admet l'ús d'eines natiu, hauràs d'usar l'ordre @agent per fer servir eines.",
        title: "Agent",
      },
      chat: {
        title: "Xat",
        description:
          "proporcionarà respostes amb el coneixement general del LLM <b>i</b> el context del document trobat.<br />Hauràs d'usar l'ordre @agent per fer servir eines.",
      },
      query: {
        title: "Consulta",
        description:
          "proporcionarà respostes <b>només</b> si es troba context del document.<br />Hauràs d'usar l'ordre @agent per fer servir eines.",
      },
    },
    history: {
      title: "Historial de xat",
      "desc-start":
        "El nombre de xats anteriors que s'inclouran a la memòria a curt termini de la resposta.",
      recommend: "Es recomanen 20. ",
      "desc-end":
        "Més de 45 pot provocar errors continus al xat depenent de la mida dels missatges.",
    },
    prompt: {
      title: "Missatge del sistema",
      description:
        "El missatge que s'usarà en aquest espai de treball. Defineix el context i les instruccions perquè la IA generi una resposta. Has de proporcionar un missatge ben elaborat perquè la IA pugui generar una resposta rellevant i precisa.",
      history: {
        title: "Historial del missatge del sistema",
        clearAll: "Esborra-ho tot",
        noHistory: "No hi ha historial de missatges del sistema disponible",
        restore: "Restaura",
        delete: "Elimina",
        publish: "Publica al Centre de la comunitat",
        deleteConfirm:
          "Estàs segur que vols eliminar aquest element de l'historial?",
        clearAllConfirm:
          "Estàs segur que vols esborrar tot l'historial? Aquesta acció no es pot desfer.",
        expand: "Expandeix",
      },
    },
    refusal: {
      title: "Resposta de rebuig en mode consulta",
      "desc-start": "En mode",
      query: "consulta",
      "desc-end":
        "pot ser que vulguis retornar una resposta de rebuig personalitzada quan no es trobi context.",
      "tooltip-title": "Per què veig això?",
      "tooltip-description":
        "Estàs en mode consulta, que només usa informació dels teus documents. Canvia al mode xat per a converses més flexibles, o fes clic aquí per visitar la nostra documentació per saber més sobre els modes de xat.",
    },
    temperature: {
      title: "Temperatura del LLM",
      "desc-start":
        'Aquesta configuració controla com de "creatiu" serà el teu LLM en les respostes.',
      "desc-end":
        "Com més alt sigui el número, més creatiu serà. Per a alguns models, això pot provocar respostes incoherents si és massa alt.",
      hint: "La majoria dels LLM tenen diversos rangs acceptables de valors vàlids. Consulta el teu proveïdor de LLM per obtenir aquesta informació.",
    },
  },
  "vector-workspace": {
    identifier: "Identificador de la base de dades vectorial",
    snippets: {
      title: "Fragments de context màxims",
      description:
        "Aquesta configuració controla el nombre màxim de fragments de context que s'enviaran al LLM per cada xat o consulta.",
      recommend: "Recomanat: 4",
    },
    doc: {
      title: "Llindar de similitud del document",
      description:
        "La puntuació de similitud mínima requerida perquè una font es consideri relacionada amb el xat. Com més alt sigui el número, més similar ha de ser la font al xat.",
      zero: "Sense restricció",
      low: "Baix (puntuació de similitud ≥ .25)",
      medium: "Mitjà (puntuació de similitud ≥ .50)",
      high: "Alt (puntuació de similitud ≥ .75)",
    },
    reset: {
      reset: "Restableix la base de dades vectorial",
      resetting: "Esborrant vectors...",
      confirm:
        "Estàs a punt de restablir la base de dades vectorial d'aquest espai de treball. Això eliminarà tots els embeddings vectorials actuals.\n\nEls fitxers originals no es modificaran. Aquesta acció és irreversible.",
      error:
        "No s'ha pogut restablir la base de dades vectorial de l'espai de treball!",
      success:
        "La base de dades vectorial de l'espai de treball s'ha restablert!",
    },
  },
  agent: {
    "performance-warning":
      "El rendiment dels LLM que no suporten explícitament la crida d'eines depèn molt de les capacitats i la precisió del model. Algunes funcionalitats poden ser limitades o no funcionals.",
    provider: {
      title: "Proveïdor de LLM de l'agent de l'espai de treball",
      description:
        "El proveïdor de LLM i el model específics que s'usaran per a l'agent @agent d'aquest espai de treball.",
    },
    mode: {
      chat: {
        title: "Model de xat de l'agent de l'espai de treball",
        description:
          "El model de xat específic que s'usarà per a l'agent @agent d'aquest espai de treball.",
      },
      title: "Model de l'agent de l'espai de treball",
      description:
        "El model de LLM específic que s'usarà per a l'agent @agent d'aquest espai de treball.",
      wait: "-- esperant models --",
    },
    skill: {
      rag: {
        title: "RAG i memòria a llarg termini",
        description:
          "Permet que l'agent aprofiti els teus documents locals per respondre una consulta o demana a l'agent que \"recordi\" fragments de contingut per a la recuperació de memòria a llarg termini.",
      },
      view: {
        title: "Visualitza i resumeix documents",
        description:
          "Permet que l'agent llistegi i resumeixi el contingut dels fitxers de l'espai de treball incrustats actualment.",
      },
      scrape: {
        title: "Extreu llocs web",
        description:
          "Permet que l'agent visiti i extregui el contingut de llocs web.",
      },
      generate: {
        title: "Genera gràfics",
        description:
          "Permet que l'agent predeterminat generi diversos tipus de gràfics a partir de les dades proporcionades o donades al xat.",
      },
      web: {
        title: "Cerca web",
        description:
          "Permet que el teu agent cerqui a la web per respondre les teves preguntes connectant-se a un proveïdor de cerca web (SERP).",
      },
      sql: {
        title: "Connector SQL",
        description:
          "Permet que el teu agent pugui fer servir SQL per respondre les teves preguntes connectant-se a diversos proveïdors de bases de dades SQL.",
      },
      filesystem: {
        title: "Accés al sistema de fitxers",
        description:
          "Permet que el teu agent llegeixi, escrigui, cerqui i gestioni fitxers dins d'un directori designat. Admet l'edició de fitxers, la navegació per directoris i la cerca de contingut.",
        learnMore: "Aprèn més sobre com usar aquesta habilitat",
        configuration: "Configuració",
        readActions: "Accions de lectura",
        writeActions: "Accions d'escriptura",
        warning:
          "L'accés al sistema de fitxers pot ser perillós, ja que pot modificar o eliminar fitxers. Consulta la <a>documentació</a> abans d'activar-ho.",
        skills: {
          "read-text-file": {
            title: "Llegeix fitxer",
            description:
              "Llegeix el contingut de fitxers (text, codi, PDF, imatges, etc.)",
          },
          "read-multiple-files": {
            title: "Llegeix múltiples fitxers",
            description: "Llegeix múltiples fitxers alhora",
          },
          "list-directory": {
            title: "Llista directori",
            description: "Llista fitxers i directoris d'una carpeta",
          },
          "search-files": {
            title: "Cerca fitxers",
            description: "Cerca fitxers per nom o contingut",
          },
          "get-file-info": {
            title: "Obté informació del fitxer",
            description: "Obté metadades detallades sobre fitxers",
          },
          "write-text-file": {
            title: "Escriu fitxer de text",
            description:
              "Crea fitxers de text nous o sobreescriu fitxers de text existents",
          },
          "edit-file": {
            title: "Edita fitxer",
            description: "Fes edicions basades en línies a fitxers de text",
          },
          "create-directory": {
            title: "Crea directori",
            description: "Crea directoris nous",
          },
          "copy-file": {
            title: "Copia fitxer",
            description: "Copia fitxers i directoris",
          },
          "move-file": {
            title: "Mou/reanomena fitxer",
            description: "Mou o reanomena fitxers i directoris",
          },
        },
      },
      createFiles: {
        title: "Creació de documents",
        description:
          "Permet que el teu agent creï formats de documents binaris com presentacions de PowerPoint, fulls de càlcul d'Excel, documents de Word i PDF. Els fitxers es poden descarregar directament des de la finestra de xat.",
        configuration: "Tipus de documents disponibles",
        skills: {
          "create-text-file": {
            title: "Fitxers de text",
            description:
              "Crea fitxers de text amb qualsevol contingut i extensió (.txt, .md, .json, .csv, etc.)",
          },
          "create-pptx": {
            title: "Presentacions de PowerPoint",
            description:
              "Crea presentacions de PowerPoint noves amb diapositives, títols i punts",
          },
          "create-pdf": {
            title: "Documents PDF",
            description:
              "Crea documents PDF a partir de markdown o text pla amb estil bàsic",
          },
          "create-xlsx": {
            title: "Fulls de càlcul d'Excel",
            description:
              "Crea documents d'Excel per a dades tabulars amb fulls i estil",
          },
          "create-docx": {
            title: "Documents de Word",
            description: "Crea documents de Word amb estil i format bàsics",
          },
        },
      },
      gmail: {
        title: "Connector de Gmail",
        description:
          "Permet que el teu agent interaccioni amb Gmail: cerca correus, llegeix fils, redacta esborranys, envia correus i gestiona la teva safata d'entrada. <a>Llegeix la documentació</a>.",
        multiUserWarning:
          "La integració de Gmail no està disponible en mode multiusuari per raons de seguretat. Desactiva el mode multiusuari per usar aquesta funció.",
        configuration: "Configuració de Gmail",
        deploymentId: "ID de desplegament",
        deploymentIdHelp:
          "L'ID de desplegament de la teva aplicació web de Google Apps Script",
        apiKey: "Clau API",
        apiKeyHelp:
          "La clau API que has configurat al teu desplegament de Google Apps Script",
        configurationRequired:
          "Configura l'ID de desplegament i la clau API per activar les habilitats de Gmail.",
        configured: "Configurat",
        searchSkills: "Cerca habilitats...",
        noSkillsFound:
          "No hi ha habilitats que coincideixin amb la teva cerca.",
        categories: {
          search: {
            title: "Cerca i llegeix correus",
            description:
              "Cerca i llegeix correus de la teva safata d'entrada de Gmail",
          },
          drafts: {
            title: "Esborranys de correus",
            description: "Crea, edita i gestiona esborranys de correus",
          },
          send: {
            title: "Envia i respon correus",
            description: "Envia correus i respon a fils immediatament",
          },
          threads: {
            title: "Gestiona fils de correus",
            description:
              "Gestiona fils de correus: marca com a llegit/no llegit, arxiva, mou a la paperera",
          },
          account: {
            title: "Estadístiques d'integració",
            description:
              "Visualitza estadístiques de la safata i informació del compte",
          },
        },
        skills: {
          getInbox: {
            title: "Obté la safata d'entrada",
            description:
              "Manera simplificada d'obtenir els correus de la safata d'entrada de Gmail",
          },
          search: {
            title: "Cerca correus",
            description: "Cerca correus usant la sintaxi de consulta de Gmail",
          },
          readThread: {
            title: "Llegeix fil",
            description: "Llegeix un fil de correu complet per ID",
          },
          createDraft: {
            title: "Crea esborrany",
            description: "Crea un nou esborrany de correu",
          },
          createDraftReply: {
            title: "Crea resposta en esborrany",
            description: "Crea un esborrany de resposta a un fil existent",
          },
          updateDraft: {
            title: "Actualitza esborrany",
            description: "Actualitza un esborrany de correu existent",
          },
          getDraft: {
            title: "Obté esborrany",
            description: "Recupera un esborrany específic per ID",
          },
          listDrafts: {
            title: "Llista esborranys",
            description: "Llista tots els esborranys de correus",
          },
          deleteDraft: {
            title: "Elimina esborrany",
            description: "Elimina un esborrany de correu",
          },
          sendDraft: {
            title: "Envia esborrany",
            description: "Envia un esborrany de correu existent",
          },
          sendEmail: {
            title: "Envia correu",
            description: "Envia un correu immediatament",
          },
          replyToThread: {
            title: "Respon al fil",
            description: "Respon a un fil de correu immediatament",
          },
          markRead: {
            title: "Marca com a llegit",
            description: "Marca un fil com a llegit",
          },
          markUnread: {
            title: "Marca com a no llegit",
            description: "Marca un fil com a no llegit",
          },
          moveToTrash: {
            title: "Mou a la paperera",
            description: "Mou un fil a la paperera",
          },
          moveToArchive: {
            title: "Arxiva",
            description: "Arxiva un fil",
          },
          moveToInbox: {
            title: "Mou a la safata d'entrada",
            description: "Mou un fil a la safata d'entrada",
          },
          getMailboxStats: {
            title: "Estadístiques de la safata",
            description:
              "Obté el recompte de no llegits i estadístiques de la safata",
          },
        },
      },
      default_skill:
        "Per defecte, aquesta habilitat està activada, però pots desactivar-la si no vols que estigui disponible per a l'agent.",
      outlook: {
        title: "Connector per a Outlook",
        description:
          "Permite que el teu agent interactui amb Microsoft Outlook: cerca correus electrònics, llegeix converses, redacta drafts, envia correus electrònics i gestiona la teva caixa de correu electrònic a través de l'API de Microsoft Graph. <a>Consulteu la documentació</a>.",
        multiUserWarning:
          "La integració d'Outlook no està disponible en mode multiusuari per raons de seguretat. Per utilitzar aquesta funció, feu que el mode multiusuari estigui desactivat.",
        configuration: "Configuració d'Outlook",
        authType: "Tipus de compte",
        authTypeHelp:
          "Seleccioneu quins tipus de comptes de Microsoft poden autenticar-se. \"Tots els comptes\" admet tant comptes personals com comptes per a l'ús laboral/escolar. \"Només comptes personals\" limita l'opció a comptes personals de Microsoft. \"Només comptes d'organització\" limita l'opció a comptes per a l'ús laboral/escolar d'un tenant específic d'Azure AD.",
        authTypeCommon: "Totes les comptes (personals i laborals/escolars)",
        authTypeConsumers: "Només comptes personals de Microsoft",
        authTypeOrganization:
          "Només comptes d'organitzacions (requereix l'ID del llogater)",
        clientId: "Identificador (Client)",
        clientIdHelp:
          "L'ID de l'aplicació (Client) del vostre registre d'aplicació a Azure AD",
        tenantId: "Identificador (del llogater)",
        tenantIdHelp:
          "L'ID del \"Tenant\" (inquilí) del vostre registre d'aplicació a Azure AD. És obligatori només per a l'autenticació dins de l'organització.",
        clientSecret: "Secret del client",
        clientSecretHelp:
          "El valor secret de l'aplicació registrada a Azure AD.",
        configurationRequired:
          "Si us plau, configureu l'ID del client i el secret del client per habilitar les funcionalitats d'Outlook.",
        authRequired:
          "Primer, guarda les teves credencials, i després autentica't amb Microsoft per completar la configuració.",
        authenticateWithMicrosoft: "Autentica't amb Microsoft",
        authenticated: "He estat autentificat amb èxit amb Microsoft Outlook.",
        revokeAccess: "Revocar l'accés",
        configured: "Configurat",
        searchSkills: "Habilitats de cerca...",
        noSkillsFound:
          "No s'han trobat perfils que coincideixin amb la vostra cerca.",
        categories: {
          search: {
            title: "Cerca i llegeix correus electrònics",
            description:
              "Cerca i llegeix correus electrònics des de la teva pestanya de correus d'Outlook.",
          },
          drafts: {
            title: "Proposals de correu electrònic",
            description: "Crea, edita i gestiona els esborralls d'e-mail.",
          },
          send: {
            title: "Enviar correus electrònics",
            description:
              "Envieu correus electrònics nous o respondre als missatges immediatament.",
          },
          account: {
            title: "Estadístiques d'integració",
            description:
              "Visualitza les estadístiques de la caixa de correu i la informació del compte.",
          },
        },
        skills: {
          getInbox: {
            title: "Accedeix a la caixa de correu",
            description:
              "Obteniu els correus electrònics més recents de la vostra pestanya de correu d'Outlook.",
          },
          search: {
            title: "Cerca correus electrònics",
            description:
              "Cerca correus electrònics utilitzant la sintaxi de cerca de Microsoft",
          },
          readThread: {
            title: "Llegir la conversa",
            description:
              "Llegeix la totalitat d'una conversa per correu electrònic.",
          },
          createDraft: {
            title: "Crear un esborr",
            description:
              "Crea un nou correu electrònic o una resposta a un missatge existent.",
          },
          updateDraft: {
            title: "Versió actualitzada",
            description:
              "Actualitza un correu electrònic existent que ja està redactat",
          },
          listDrafts: {
            title: "Proposta de llistats",
            description: "Mostra totes les correus electrònics en projecte.",
          },
          deleteDraft: {
            title: "Eliminar esbor",
            description: "Eliminar un correu electrònic en projecte",
          },
          sendDraft: {
            title: "Enviar esborrany",
            description: "Envia un correu electrònic existent.",
          },
          sendEmail: {
            title: "Enviar correu electrònic",
            description:
              "Envieu un correu electrònic nou o respondreu a un missatge existent immediatament.",
          },
          getMailboxStats: {
            title: "Estadístiques de la caixa de correu",
            description:
              "Obteniu el nombre de carpetes i les estadístiques de la caixa de correu.",
          },
        },
      },
      googleCalendar: {
        title: "Connector per a Google Calendar",
        description:
          "Permite que el teu agent interactui amb Google Calendar: visualitza calendaris, obté esdeveniments, crea i actualitza esdeveniments, i gestiona les confirmacions de participació. <a>Consulteu la documentació</a>.",
        multiUserWarning:
          "La integració amb Google Calendar no està disponible en el mode multiusuari per raons de seguretat. Per utilitzar aquesta funció, feu que el mode multiusuari estigui desactivat.",
        configuration: "Configuració de Google Calendar",
        deploymentId: "Identificador de desplegament",
        deploymentIdHelp:
          "L'ID de desplegament de la vostra aplicació web de Google Apps Script",
        apiKey: "Clau API",
        apiKeyHelp:
          "La clau API que has configurat en la implementació del teu Google Apps Script",
        configurationRequired:
          "Si us plau, configureu l'ID de l'implementació i la clau API per activar les funcionalitats de Google Calendar.",
        configured: "Configurat",
        searchSkills: "Habilitats de cerca...",
        noSkillsFound:
          "No s'han trobat perfils que coincideixin amb la vostra cerca.",
        categories: {
          calendars: {
            title: "Calendari",
            description: "Visualitza i gestiona els teus calendaris de Google.",
          },
          readEvents: {
            title: "Consulta els esdeveniments",
            description: "Visualitza i cerca esdeveniments del calendari",
          },
          writeEvents: {
            title: "Crear i actualitzar esdeveniments",
            description: "Crea esdeveniments nous i modifica els existents.",
          },
          rsvp: {
            title: "Gestió de confirmacions de participació",
            description: "Gestiona l'estat de resposta per als esdeveniments.",
          },
        },
        skills: {
          listCalendars: {
            title: "Calendari de dates",
            description:
              "Enumera tots els calendaris que poseu al dia o als quals esteu subscrit.",
          },
          getCalendar: {
            title: "Obteniu detalls del calendari",
            description:
              "Obteniu informació detallada sobre un calendari específic.",
          },
          getEvent: {
            title: "Obtenir informació sobre l'esdeveniment",
            description:
              "Obteniu informació detallada sobre un esdeveniment específic.",
          },
          getEventsForDay: {
            title: "Troba esdeveniments per a un dia concret",
            description:
              "Obteniu tots els esdeveniments programats per a un dia concret.",
          },
          getEvents: {
            title: "Obtenir esdeveniments (interval de dates)",
            description:
              "Obtenir esdeveniments dins d'un interval de dates personalitzat",
          },
          getUpcomingEvents: {
            title: "Consulta els esdeveniments pròxims",
            description:
              "Troba esdeveniments per avui, aquesta setmana o aquest mes utilitzant paraules clau senzilles.",
          },
          quickAdd: {
            title: "Afegir esdeveniment de forma ràpida",
            description:
              'Crea un esdeveniment a partir d\'un text natural (per exemple, "Reunió demà a les 15:00")',
          },
          createEvent: {
            title: "Crear esdeveniment",
            description:
              "Crea un esdeveniment nou amb control total sobre totes les propietats.",
          },
          updateEvent: {
            title: "Actualització d'esdeveniments",
            description: "Actualitza un esdeveniment existent en el calendari",
          },
          setMyStatus: {
            title: "Estat de confirmació de participació",
            description:
              "Acceptar, rebutjar o acceptar de manera provisional un esdeveniment.",
          },
        },
      },
    },
    mcp: {
      title: "Servidors MCP",
      "loading-from-config":
        "Carregant servidors MCP des del fitxer de configuració",
      "learn-more": "Aprèn més sobre els servidors MCP.",
      "no-servers-found": "No s'han trobat servidors MCP",
      "tool-warning":
        "Per obtenir el millor rendiment, considera desactivar les eines no desitjades per conservar el context.",
      "tools-enabled": "eines activades",
      "stop-server": "Atura el servidor MCP",
      "start-server": "Inicia el servidor MCP",
      "delete-server": "Elimina el servidor MCP",
      "tool-count-warning":
        "Aquest servidor MCP té <b>{{count}} eines activades</b> que consumiran context en cada xat.<br />Considera desactivar les eines no desitjades per conservar el context.",
      "startup-command": "Ordre d'inici",
      command: "Ordre",
      arguments: "Arguments",
      "not-running-warning":
        "Aquest servidor MCP no s'està executant: pot estar aturat o tenir un error a l'inici.",
      "tool-call-arguments": "Arguments de la crida a l'eina",
    },
    settings: {
      title: "Configuració de les habilitats de l'agent",
      "max-tool-calls": {
        title: "Màxim de crides a eines per resposta",
        description:
          "El nombre màxim d'eines que un agent pot encadenar per generar una sola resposta. Això evita crides a eines descontrolades i bucles infinits.",
      },
      "intelligent-skill-selection": {
        title: "Selecció intel·ligent d'habilitats",
        "beta-badge": "Beta",
        description:
          "Activa eines il·limitades i redueix l'ús de tokens fins a un 80% per consulta: AnythingLLM selecciona automàticament les habilitats adequades per a cada missatge.",
        "max-tools": {
          title: "Màxim d'eines",
          description:
            "El nombre màxim d'eines a seleccionar per a cada consulta. Recomanem valors més alts per a models amb contextos més grans.",
        },
      },
    },
  },
  recorded: {
    title: "Xats de l'espai de treball",
    description:
      "Aquests són tots els xats i missatges registrats que han enviat els usuaris ordenats per data de creació.",
    export: "Exporta",
    table: {
      id: "ID",
      by: "Enviat per",
      workspace: "Espai de treball",
      prompt: "Missatge",
      response: "Resposta",
      at: "Enviat el",
    },
  },
  customization: {
    interface: {
      title: "Preferències d'interfície",
      description:
        "Estableix les teves preferències d'interfície per a AnythingLLM.",
    },
    branding: {
      title: "Marca i etiqueta blanca",
      description:
        "Personalitza la teva instància d'AnythingLLM amb una marca pròpia.",
    },
    chat: {
      title: "Xat",
      description: "Estableix les teves preferències de xat per a AnythingLLM.",
      auto_submit: {
        title: "Envia automàticament l'entrada de veu",
        description:
          "Envia automàticament l'entrada de veu després d'un període de silenci",
      },
      auto_speak: {
        title: "Llegeix les respostes automàticament",
        description: "Llegeix automàticament les respostes de la IA",
      },
      spellcheck: {
        title: "Activa la correcció ortogràfica",
        description:
          "Activa o desactiva la correcció ortogràfica al camp d'entrada del xat",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description:
          "Selecciona el teu tema de colors preferit per a l'aplicació.",
      },
      "show-scrollbar": {
        title: "Mostra la barra de desplaçament",
        description:
          "Activa o desactiva la barra de desplaçament a la finestra de xat.",
      },
      "support-email": {
        title: "Correu electrònic de suport",
        description:
          "Estableix l'adreça de correu electrònic de suport que hauran de poder consultar els usuaris quan necessitin ajuda.",
      },
      "app-name": {
        title: "Nom",
        description:
          "Estableix un nom que es mostri a la pàgina d'inici de sessió per a tots els usuaris.",
      },
      "display-language": {
        title: "Idioma de visualització",
        description:
          "Selecciona l'idioma preferit per mostrar la interfície d'AnythingLLM, quan les traduccions estiguin disponibles.",
      },
      logo: {
        title: "Logotip de la marca",
        description:
          "Puja el teu logotip personalitzat per mostrar-lo a totes les pàgines.",
        add: "Afegeix un logotip personalitzat",
        recommended: "Mida recomanada: 800 x 200",
        remove: "Elimina",
        replace: "Substitueix",
      },
      "browser-appearance": {
        title: "Aparença del navegador",
        description:
          "Personalitza l'aparença de la pestanya i el títol del navegador quan l'aplicació està oberta.",
        tab: {
          title: "Títol",
          description:
            "Estableix un títol de pestanya personalitzat quan l'aplicació està oberta en un navegador.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Usa un favicon personalitzat per a la pestanya del navegador.",
        },
      },
      "sidebar-footer": {
        title: "Elements del peu de la barra lateral",
        description:
          "Personalitza els elements del peu que es mostren a la part inferior de la barra lateral.",
        icon: "Icona",
        link: "Enllaç",
      },
      "render-html": {
        title: "Renderitza HTML al xat",
        description:
          "Renderitza respostes HTML a les respostes de l'assistent.\nAixò pot resultar en una qualitat de resposta molt més alta, però també pot comportar riscos potencials de seguretat.",
      },
    },
  },
  api: {
    title: "Claus API",
    description:
      "Les claus API permeten al titular accedir i gestionar programàticament aquesta instància d'AnythingLLM.",
    link: "Llegeix la documentació de l'API",
    generate: "Genera una nova clau API",
    empty: "No s'han trobat claus API",
    actions: "Accions",
    messages: {
      error: "Error: {{error}}",
    },
    modal: {
      title: "Crea una nova clau API",
      cancel: "Cancel·la",
      close: "Tanca",
      create: "Crea la clau API",
      helper:
        "Un cop creada, la clau API es pot usar per accedir i configurar programàticament aquesta instància d'AnythingLLM.",
      name: {
        label: "Nom",
        placeholder: "Integració de producció",
        helper:
          "Opcional. Usa un nom descriptiu perquè puguis identificar aquesta clau més tard.",
      },
    },
    row: {
      copy: "Copia la clau API",
      copied: "Copiada",
      unnamed: "--",
      deleteConfirm:
        "Estàs segur que vols desactivar aquesta clau API?\nDesprés d'això, ja no es podrà usar.\n\nAquesta acció és irreversible.",
    },
    table: {
      name: "Nom",
      key: "Clau API",
      by: "Creada per",
      created: "Creada",
    },
  },
  llm: {
    title: "Preferència de LLM",
    description:
      "Aquestes són les credencials i la configuració del teu proveïdor preferit de xat i embedding de LLM. És important que aquestes claus siguin actuals i correctes, o bé AnythingLLM no funcionarà correctament.",
    provider: "Proveïdor de LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Punt final del servei d'Azure",
        api_key: "Clau API",
        chat_deployment_name: "Nom del desplegament del xat",
        chat_model_token_limit: "Límit de tokens del model de xat",
        model_type: "Tipus de model",
        model_type_tooltip:
          'Si el teu desplegament usa un model de raonament (o1, o1-mini, o3-mini, etc.), estableix-ho com a "Raonament". En cas contrari, les teves sol·licituds de xat poden fallar.',
        default: "Per defecte",
        reasoning: "Raonament",
      },
    },
  },
  transcription: {
    title: "Preferència del model de transcripció",
    description:
      "Aquestes són les credencials i la configuració del teu proveïdor de model de transcripció preferit. És important que aquestes claus siguin actuals i correctes, o bé els fitxers multimèdia i d'àudio no es transcriuran.",
    provider: "Proveïdor de transcripció",
    "warn-start":
      "L'ús del model whisper local en màquines amb poca RAM o CPU pot bloquejar AnythingLLM en processar fitxers multimèdia.",
    "warn-recommend":
      "Recomanem almenys 2 GB de RAM i pujar fitxers de menys de 10 MB.",
    "warn-end":
      "El model integrat es descarregarà automàticament en el primer ús.",
  },
  embedding: {
    title: "Preferència d'embedding",
    "desc-start":
      "Quan s'usa un LLM que no admet de manera nativa un motor d'embedding, pot ser que hagis d'especificar adicionalment les credencials per a l'embedding de text.",
    "desc-end":
      "L'embedding és el procés de convertir text en vectors. Aquestes credencials són necessàries per convertir els teus fitxers i missatges en un format que AnythingLLM pugui processar.",
    provider: {
      title: "Proveïdor d'embedding",
    },
  },
  text: {
    title: "Preferències de divisió i segmentació de text",
    "desc-start":
      "De vegades, pot ser que vulguis canviar la manera predeterminada en què els nous documents es divideixen i segmenten abans d'inserir-se a la teva base de dades vectorial.",
    "desc-end":
      "Hauries de modificar aquesta configuració només si entens com funciona la divisió de text i els seus efectes secundaris.",
    size: {
      title: "Mida del fragment de text",
      description:
        "Aquesta és la longitud màxima de caràcters que pot tenir un únic vector.",
      recommend: "La longitud màxima del model d'embedding és",
    },
    overlap: {
      title: "Solapament del fragment de text",
      description:
        "Aquest és el solapament màxim de caràcters que es produeix durant la segmentació entre dos fragments de text adjacents.",
    },
  },
  vector: {
    title: "Base de dades vectorial",
    description:
      "Aquestes són les credencials i la configuració de com funcionarà la teva instància d'AnythingLLM. És important que aquestes claus siguin actuals i correctes.",
    provider: {
      title: "Proveïdor de la base de dades vectorial",
      description: "No cal cap configuració per a LanceDB.",
    },
  },
  embeddable: {
    title: "Widgets de xat incrustables",
    description:
      "Els widgets de xat incrustables són interfícies de xat públiques vinculades a un únic espai de treball. Permeten crear espais de treball que pots publicar al món.",
    create: "Crea un widget incrustat",
    table: {
      workspace: "Espai de treball",
      chats: "Xats enviats",
      active: "Dominis actius",
      created: "Creat",
    },
  },
  "embed-chats": {
    title: "Historial de xats incrustats",
    export: "Exporta",
    description:
      "Aquests són tots els xats i missatges registrats de qualsevol widget incrustat que hagis publicat.",
    table: {
      embed: "Widget incrustat",
      sender: "Remitent",
      message: "Missatge",
      response: "Resposta",
      at: "Enviat el",
    },
  },
  telegram: {
    title: "Bot de Telegram",
    description:
      "Connecta la teva instància d'AnythingLLM a Telegram per poder xatejar amb els teus espais de treball des de qualsevol dispositiu.",
    setup: {
      step1: {
        title: "Pas 1: Crea el teu bot de Telegram",
        description:
          "Obre @BotFather a Telegram, envia <code>/newbot</code> a <code>@BotFather</code>, segueix les instruccions i copia el token de l'API.",
        "open-botfather": "Obre BotFather",
        "instruction-1": "1. Obre l'enllaç o escaneja el codi QR",
        "instruction-2":
          "2. Envia <code>/newbot</code> a <code>@BotFather</code>",
        "instruction-3": "3. Tria un nom i un nom d'usuari per al teu bot",
        "instruction-4": "4. Copia el token de l'API que rebràs",
      },
      step2: {
        title: "Pas 2: Connecta el teu bot",
        description:
          "Enganxa el token de l'API que has rebut de @BotFather per connectar el teu bot.",
        "bot-token": "Token del bot",
        connecting: "Connectant...",
        "connect-bot": "Connecta el bot",
      },
      security: {
        title: "Configuració de seguretat recomanada",
        description:
          "Per a més seguretat, configura aquests paràmetres a @BotFather.",
        "disable-groups": "— Impedeix afegir el bot a grups",
        "disable-inline": "— Impedeix usar el bot en cerques en línia",
        "obscure-username":
          "Usa un nom d'usuari del bot no obvi per reduir la visibilitat",
      },
      "toast-enter-token": "Introdueix un token del bot.",
      "toast-connect-failed": "No s'ha pogut connectar el bot.",
    },
    connected: {
      status: "Connectat",
      "status-disconnected":
        "Desconnectat: el token pot haver caducat o ser invàlid",
      "placeholder-token": "Enganxa el nou token del bot...",
      reconnect: "Reconnecta",
      workspace: "Espai de treball",
      "bot-link": "Enllaç del bot",
      "voice-response": "Resposta de veu",
      disconnecting: "Desconnectant...",
      disconnect: "Desconnecta",
      "voice-text-only": "Només text",
      "voice-mirror": "Mirror (respon amb veu quan l'usuari envia veu)",
      "voice-always": "Sempre veu (envia àudio amb cada resposta)",
      "toast-disconnect-failed": "No s'ha pogut desconnectar el bot.",
      "toast-reconnect-failed": "No s'ha pogut reconnectar el bot.",
      "toast-voice-failed": "No s'ha pogut actualitzar el mode de veu.",
      "toast-approve-failed": "No s'ha pogut aprovar l'usuari.",
      "toast-deny-failed": "No s'ha pogut denegar l'usuari.",
      "toast-revoke-failed": "No s'ha pogut revocar l'usuari.",
    },
    users: {
      "pending-description":
        "Usuaris que esperen ser verificats. Fes coincidir el codi d'emparellament que es mostra aquí amb el que es mostra al seu xat de Telegram.",
      unknown: "Desconegut",
    },
  },
  security: {
    title: "Seguretat",
    multiuser: {
      title: "Mode multiusuari",
      description:
        "Configura la teva instància per donar suport al teu equip activant el mode multiusuari.",
      enable: {
        "is-enable": "El mode multiusuari està activat",
        enable: "Activa el mode multiusuari",
        description:
          "Per defecte, seràs l'únic administrador. Com a administrador, hauràs de crear comptes per a tots els usuaris i administradors nous. No perdis la contrasenya, ja que només un usuari administrador pot restablir contrasenyes.",
        username: "Nom d'usuari del compte d'administrador",
        password: "Contrasenya del compte d'administrador",
      },
    },
    password: {
      title: "Protecció per contrasenya",
      description:
        "Protegeix la teva instància d'AnythingLLM amb una contrasenya. Si l'oblides, no hi ha cap mètode de recuperació, per la qual cosa assegura't de guardar-la.",
      "password-label": "Contrasenya de la instància",
    },
  },
  event: {
    title: "Registres d'esdeveniments",
    description:
      "Visualitza totes les accions i esdeveniments que passen en aquesta instància per al seguiment.",
    clear: "Esborra els registres d'esdeveniments",
    table: {
      type: "Tipus d'esdeveniment",
      user: "Usuari",
      occurred: "Ocorregut el",
    },
  },
  privacy: {
    title: "Privadesa i gestió de dades",
    description:
      "Aquesta és la teva configuració de com els proveïdors de tercers connectats i AnythingLLM gestionen les teves dades.",
    anonymous: "Telemetria anònima activada",
  },
  connectors: {
    "search-placeholder": "Cerca connectors de dades",
    "no-connectors": "No s'han trobat connectors de dades.",
    obsidian: {
      vault_location: "Ubicació del dipòsit",
      vault_description:
        "Selecciona la carpeta del teu dipòsit d'Obsidian per importar totes les notes i les seves connexions.",
      selected_files: "S'han trobat {{count}} fitxers markdown",
      importing: "Important el dipòsit...",
      import_vault: "Importa el dipòsit",
      processing_time:
        "Això pot trigar una estona depenent de la mida del teu dipòsit.",
      vault_warning:
        "Per evitar conflictes, assegura't que el teu dipòsit d'Obsidian no estigui obert en aquest moment.",
    },
    github: {
      name: "Repositori de GitHub",
      description:
        "Importa un repositori públic o privat sencer de GitHub en un sol clic.",
      URL: "URL del repositori de GitHub",
      URL_explained: "URL del repositori de GitHub que vols recollir.",
      token: "Token d'accés de GitHub",
      optional: "opcional",
      token_explained: "Token d'accés per evitar limitació de velocitat.",
      token_explained_start: "Sense un ",
      token_explained_link1: "Token d'accés personal",
      token_explained_middle:
        ", l'API de GitHub pot limitar el nombre de fitxers que es poden recollir a causa de limitacions de velocitat. Pots ",
      token_explained_link2: "crear un Token d'accés temporal",
      token_explained_end: " per evitar aquest problema.",
      ignores: "Fitxers ignorats",
      git_ignore:
        "Llista en format .gitignore per ignorar fitxers específics durant la recollida. Prem Intro després de cada entrada que vulguis desar.",
      task_explained:
        "Un cop completat, tots els fitxers estaran disponibles per incrustar-los als espais de treball al selector de documents.",
      branch: "Branca des de la qual vols recollir fitxers.",
      branch_loading: "-- carregant branques disponibles --",
      branch_explained: "Branca des de la qual vols recollir fitxers.",
      token_information:
        "Sense omplir el <b>Token d'accés de GitHub</b>, aquest connector de dades només podrà recollir els fitxers del <b>nivell superior</b> del repositori a causa dels límits de velocitat de l'API pública de GitHub.",
      token_personal:
        "Obtén un Token d'accés personal gratuït amb un compte de GitHub aquí.",
    },
    gitlab: {
      name: "Repositori de GitLab",
      description:
        "Importa un repositori públic o privat sencer de GitLab en un sol clic.",
      URL: "URL del repositori de GitLab",
      URL_explained: "URL del repositori de GitLab que vols recollir.",
      token: "Token d'accés de GitLab",
      optional: "opcional",
      token_description:
        "Selecciona entitats addicionals per obtenir de l'API de GitLab.",
      token_explained_start: "Sense un ",
      token_explained_link1: "Token d'accés personal",
      token_explained_middle:
        ", l'API de GitLab pot limitar el nombre de fitxers que es poden recollir a causa de limitacions de velocitat. Pots ",
      token_explained_link2: "crear un Token d'accés temporal",
      token_explained_end: " per evitar aquest problema.",
      fetch_issues: "Obtén incidències com a documents",
      ignores: "Fitxers ignorats",
      git_ignore:
        "Llista en format .gitignore per ignorar fitxers específics durant la recollida. Prem Intro després de cada entrada que vulguis desar.",
      task_explained:
        "Un cop completat, tots els fitxers estaran disponibles per incrustar-los als espais de treball al selector de documents.",
      branch: "Branca des de la qual vols recollir fitxers",
      branch_loading: "-- carregant branques disponibles --",
      branch_explained: "Branca des de la qual vols recollir fitxers.",
      token_information:
        "Sense omplir el <b>Token d'accés de GitLab</b>, aquest connector de dades només podrà recollir els fitxers del <b>nivell superior</b> del repositori a causa dels límits de velocitat de l'API pública de GitLab.",
      token_personal:
        "Obtén un Token d'accés personal gratuït amb un compte de GitLab aquí.",
    },
    youtube: {
      name: "Transcripció de YouTube",
      description:
        "Importa la transcripció d'un vídeo sencer de YouTube des d'un enllaç.",
      URL: "URL del vídeo de YouTube",
      URL_explained_start:
        "Introdueix l'URL de qualsevol vídeo de YouTube per obtenir la seva transcripció. El vídeo ha de tenir ",
      URL_explained_link: "subtítols tancats",
      URL_explained_end: " disponibles.",
      task_explained:
        "Un cop completat, la transcripció estarà disponible per incrustar-la als espais de treball al selector de documents.",
    },
    "website-depth": {
      name: "Extractor massiu d'enllaços",
      description:
        "Extreu un lloc web i els seus subenllaços fins a una certa profunditat.",
      URL: "URL del lloc web",
      URL_explained: "URL del lloc web que vols extreure.",
      depth: "Profunditat de rastreig",
      depth_explained:
        "Aquest és el nombre d'enllaços fills que el treballador ha de seguir des de l'URL d'origen.",
      max_pages: "Màxim de pàgines",
      max_pages_explained: "Nombre màxim d'enllaços a extreure.",
      task_explained:
        "Un cop completat, tot el contingut extret estarà disponible per incrustar-lo als espais de treball al selector de documents.",
    },
    confluence: {
      name: "Confluence",
      description: "Importa una pàgina sencera de Confluence en un sol clic.",
      deployment_type: "Tipus de desplegament de Confluence",
      deployment_type_explained:
        "Determina si la teva instància de Confluence està allotjada al núvol d'Atlassian o és autogestionada.",
      base_url: "URL base de Confluence",
      base_url_explained: "Aquesta és l'URL base del teu espai de Confluence.",
      space_key: "Clau de l'espai de Confluence",
      space_key_explained:
        "Aquesta és la clau de l'espai de la teva instància de Confluence que s'usarà. Normalment comença per ~",
      username: "Nom d'usuari de Confluence",
      username_explained: "El teu nom d'usuari de Confluence",
      auth_type: "Tipus d'autenticació de Confluence",
      auth_type_explained:
        "Selecciona el tipus d'autenticació que vols usar per accedir a les teves pàgines de Confluence.",
      auth_type_username: "Nom d'usuari i token d'accés",
      auth_type_personal: "Token d'accés personal",
      token: "Token d'accés de Confluence",
      token_explained_start:
        "Has de proporcionar un token d'accés per a l'autenticació. Pots generar un token d'accés",
      token_explained_link: "aquí",
      token_desc: "Token d'accés per a l'autenticació",
      pat_token: "Token d'accés personal de Confluence",
      pat_token_explained: "El teu token d'accés personal de Confluence.",
      bypass_ssl: "Omet la validació del certificat SSL",
      bypass_ssl_explained:
        "Activa aquesta opció per ometre la validació del certificat SSL per a instàncies de Confluence autogestionades amb certificat autosignat",
      task_explained:
        "Un cop completat, el contingut de la pàgina estarà disponible per incrustar-lo als espais de treball al selector de documents.",
    },
    manage: {
      documents: "Documents",
      "data-connectors": "Connectors de dades",
      "desktop-only":
        "L'edició d'aquesta configuració només està disponible en un dispositiu d'escriptori. Accedeix a aquesta pàgina des del teu escriptori per continuar.",
      dismiss: "Descarta",
      editing: "Editant",
    },
    directory: {
      "my-documents": "Els meus documents",
      "new-folder": "Nova carpeta",
      "total-documents_one": "{{count}} document",
      "total-documents_other": "{{count}} documents",
      "search-document": "Cerca un document",
      "no-documents": "Sense documents",
      "move-workspace": "Mou a l'espai de treball",
      "delete-confirmation":
        "Estàs segur que vols eliminar aquests fitxers i carpetes?\nAixò eliminarà els fitxers del sistema i els treurà automàticament de qualsevol espai de treball existent.\nAquesta acció no és reversible.",
      "removing-message":
        "Eliminant {{count}} documents i {{folderCount}} carpetes. Si us plau, espera.",
      "move-success": "S'han mogut correctament {{count}} documents.",
      no_docs: "Sense documents",
      select_all: "Selecciona-ho tot",
      deselect_all: "Deselecciona-ho tot",
      remove_selected: "Elimina la selecció",
      save_embed: "Desa i incrusta",
    },
    upload: {
      "processor-offline": "Processador de documents no disponible",
      "processor-offline-desc":
        "No podem pujar els teus fitxers ara mateix perquè el processador de documents està desconnectat. Torna-ho a intentar més tard.",
      "click-upload": "Fes clic per pujar o arrossega i deixa anar",
      "file-types":
        "admet fitxers de text, CSV, fulls de càlcul, fitxers d'àudio i molt més!",
      "or-submit-link": "o envia un enllaç",
      "placeholder-link": "https://example.com",
      fetching: "Obtenint...",
      "fetch-website": "Obtén el lloc web",
      "privacy-notice":
        "Aquests fitxers es pujaran al processador de documents que s'executa en aquesta instància d'AnythingLLM. Aquests fitxers no s'envien ni es comparteixen amb tercers.",
    },
    pinning: {
      what_pinning: "Què és l'ancoratge de documents?",
      pin_explained_block1:
        "Quan <b>ancore</b>s un document a AnythingLLM, injectarem tot el contingut del document a la teva finestra de missatge perquè el teu LLM el comprengui completament.",
      pin_explained_block2:
        "Funciona millor amb <b>models de context gran</b> o fitxers petits que siguin crítics per a la seva base de coneixement.",
      pin_explained_block3:
        "Si per defecte no obtens les respostes que desitges d'AnythingLLM, l'ancoratge és una manera excel·lent d'obtenir respostes de major qualitat amb un sol clic.",
      accept: "D'acord, entès",
    },
    watching: {
      what_watching: "Què fa observar un document?",
      watch_explained_block1:
        "Quan <b>observes</b> un document a AnythingLLM, sincronitzarem <i>automàticament</i> el contingut del document des de la seva font original a intervals regulars. Això actualitzarà automàticament el contingut a cada espai de treball on es gestioni aquest fitxer.",
      watch_explained_block2:
        "Aquesta funció admet actualment contingut en línia i no estarà disponible per a documents pujats manualment.",
      watch_explained_block3_start:
        "Pots gestionar quins documents s'observen des de la vista d'administrador del ",
      watch_explained_block3_link: "Gestor de fitxers",
      watch_explained_block3_end: ".",
      accept: "D'acord, entès",
    },
  },
  chat_window: {
    attachments_processing:
      "Els adjunts s'estan processant. Si us plau, espera...",
    send_message: "Envia un missatge",
    attach_file: "Adjunta un fitxer a aquest xat",
    text_size: "Canvia la mida del text.",
    microphone: "Parla el teu missatge.",
    send: "Envia el missatge a l'espai de treball",
    tts_speak_message: "TTS Llegeix el missatge",
    copy: "Copia",
    regenerate: "Regenera",
    regenerate_response: "Regenera la resposta",
    good_response: "Bona resposta",
    more_actions: "Més accions",
    sources: "Fonts",
    source_count_one: "{{count}} referència",
    source_count_other: "{{count}} referències",
    document: "Document",
    similarity_match: "coincidència",
    fork: "Bifurca",
    delete: "Elimina",
    cancel: "Cancel·la",
    submit: "Envia",
    edit_prompt: "Edita el missatge",
    edit_response: "Edita la resposta",
    edit_info_user:
      '"Envia" regenera la resposta de la IA. "Desa" actualitza només el teu missatge.',
    edit_info_assistant:
      "Els teus canvis es desaran directament en aquesta resposta.",
    see_less: "Veu menys",
    see_more: "Veu més",
    preset_reset_description:
      "Esborra l'historial del xat i comença un xat nou",
    preset_exit_description: "Atura la sessió de l'agent actual",
    add_new_preset: " Afegeix una nova ordre predefinida",
    add_new: "Afegeix nou",
    edit: "Edita",
    publish: "Publica",
    stop_generating: "Atura la generació de la resposta",
    command: "Ordre",
    your_command: "la-teva-ordre",
    placeholder_prompt:
      "Aquest és el contingut que s'injectarà davant del teu missatge.",
    description: "Descripció",
    placeholder_description: "Respon amb un poema sobre LLMs.",
    save: "Desa",
    small: "Petit",
    normal: "Normal",
    large: "Gran",
    tools: "Eines",
    text_size_label: "Mida del text",
    select_model: "Selecciona el model",
    slash_commands: "Ordres de barra",
    agent_skills: "Habilitats de l'agent",
    manage_agent_skills: "Gestiona les habilitats de l'agent",
    start_agent_session: "Inicia la sessió de l'agent",
    agent_skills_disabled_in_session:
      "No es poden modificar les habilitats durant una sessió de l'agent activa. Usa /exit per acabar la sessió primer.",
    use_agent_session_to_use_tools:
      "Pots usar eines al xat iniciant una sessió de l'agent amb '@agent' al principi del teu missatge.",
    workspace_llm_manager: {
      search: "Cerca",
      loading_workspace_settings:
        "Carregant la configuració de l'espai de treball...",
      available_models: "Models disponibles per a {{provider}}",
      available_models_description:
        "Selecciona un model per usar en aquest espai de treball.",
      save: "Usa aquest model",
      saving: "Establint el model com a predeterminat de l'espai de treball...",
      missing_credentials: "Falta les credencials d'aquest proveïdor!",
      missing_credentials_description: "Configura ara",
    },
    agent_invocation: {
      model_wants_to_call: "El model vol cridar",
      approve: "Aprova",
      reject: "Rebutja",
      always_allow: "Permet sempre {{skillName}}",
      tool_call_was_approved: "La crida a l'eina ha estat aprovada",
      tool_call_was_rejected: "La crida a l'eina ha estat rebutjada",
    },
    custom_skills: "Habilitats personalitzades",
    agent_flows: "Fluxos d'agents",
    no_tools_found: "No s'han trobat eines corresponents.",
    loading_mcp_servers: "Carregant servidors MCP...",
    app_integrations: "Integracions d'aplicacions",
    sub_skills: "Habilitats específiques",
  },
  profile_settings: {
    edit_account: "Edita el compte",
    profile_picture: "Foto de perfil",
    remove_profile_picture: "Elimina la foto de perfil",
    username: "Nom d'usuari",
    new_password: "Nova contrasenya",
    password_description: "La contrasenya ha de tenir almenys 8 caràcters",
    cancel: "Cancel·la",
    update_account: "Actualitza el compte",
    theme: "Preferència de tema",
    language: "Idioma preferit",
    failed_upload: "No s'ha pogut pujar la foto de perfil: {{error}}",
    upload_success: "Foto de perfil pujada.",
    failed_remove: "No s'ha pogut eliminar la foto de perfil: {{error}}",
    profile_updated: "Perfil actualitzat.",
    failed_update_user: "No s'ha pogut actualitzar l'usuari: {{error}}",
    account: "Compte",
    support: "Suport",
    signout: "Tanca la sessió",
  },
  "keyboard-shortcuts": {
    title: "Dreceres de teclat",
    shortcuts: {
      settings: "Obre la configuració",
      workspaceSettings: "Obre la configuració de l'espai de treball actual",
      home: "Vés a l'inici",
      workspaces: "Gestiona els espais de treball",
      apiKeys: "Configuració de les claus API",
      llmPreferences: "Preferències de LLM",
      chatSettings: "Configuració del xat",
      help: "Mostra l'ajuda de dreceres de teclat",
      showLLMSelector: "Mostra el selector de LLM de l'espai de treball",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Correcte!",
        success_description:
          "El teu missatge del sistema s'ha publicat al Centre de la comunitat!",
        success_thank_you: "Gràcies per compartir amb la comunitat!",
        view_on_hub: "Visualitza al Centre de la comunitat",
        modal_title: "Publica el missatge del sistema",
        name_label: "Nom",
        name_description:
          "Aquest és el nom visible del teu missatge del sistema.",
        name_placeholder: "El meu missatge del sistema",
        description_label: "Descripció",
        description_description:
          "Aquesta és la descripció del teu missatge del sistema. Usa-la per descriure el propòsit del teu missatge del sistema.",
        tags_label: "Etiquetes",
        tags_description:
          "Les etiquetes s'usen per etiquetar el teu missatge del sistema per a una cerca més fàcil. Pots afegir múltiples etiquetes. Màxim 5 etiquetes. Màxim 20 caràcters per etiqueta.",
        tags_placeholder: "Escriu i prem Intro per afegir etiquetes",
        visibility_label: "Visibilitat",
        public_description:
          "Els missatges del sistema públics són visibles per a tothom.",
        private_description:
          "Els missatges del sistema privats només són visibles per a tu.",
        publish_button: "Publica al Centre de la comunitat",
        submitting: "Publicant...",
        prompt_label: "Missatge",
        prompt_description:
          "Aquest és el missatge del sistema real que s'usarà per guiar el LLM.",
        prompt_placeholder: "Introdueix el teu missatge del sistema aquí...",
      },
      agent_flow: {
        success_title: "Correcte!",
        success_description:
          "El teu flux d'agent s'ha publicat al Centre de la comunitat!",
        success_thank_you: "Gràcies per compartir amb la comunitat!",
        view_on_hub: "Visualitza al Centre de la comunitat",
        modal_title: "Publica el flux d'agent",
        name_label: "Nom",
        name_description: "Aquest és el nom visible del teu flux d'agent.",
        name_placeholder: "El meu flux d'agent",
        description_label: "Descripció",
        description_description:
          "Aquesta és la descripció del teu flux d'agent. Usa-la per descriure el propòsit del teu flux d'agent.",
        tags_label: "Etiquetes",
        tags_description:
          "Les etiquetes s'usen per etiquetar el teu flux d'agent per a una cerca més fàcil. Pots afegir múltiples etiquetes. Màxim 5 etiquetes. Màxim 20 caràcters per etiqueta.",
        tags_placeholder: "Escriu i prem Intro per afegir etiquetes",
        visibility_label: "Visibilitat",
        submitting: "Publicant...",
        submit: "Publica al Centre de la comunitat",
        privacy_note:
          "Els fluxos d'agent sempre es pugen com a privats per protegir qualsevol dada sensible. Pots canviar la visibilitat al Centre de la comunitat després de publicar. Verifica que el teu flux no contingui cap informació sensible o privada abans de publicar.",
      },
      slash_command: {
        success_title: "Correcte!",
        success_description:
          "La teva ordre de barra s'ha publicat al Centre de la comunitat!",
        success_thank_you: "Gràcies per compartir amb la comunitat!",
        view_on_hub: "Visualitza al Centre de la comunitat",
        modal_title: "Publica l'ordre de barra",
        name_label: "Nom",
        name_description: "Aquest és el nom visible de la teva ordre de barra.",
        name_placeholder: "La meva ordre de barra",
        description_label: "Descripció",
        description_description:
          "Aquesta és la descripció de la teva ordre de barra. Usa-la per descriure el propòsit de la teva ordre de barra.",
        tags_label: "Etiquetes",
        tags_description:
          "Les etiquetes s'usen per etiquetar la teva ordre de barra per a una cerca més fàcil. Pots afegir múltiples etiquetes. Màxim 5 etiquetes. Màxim 20 caràcters per etiqueta.",
        tags_placeholder: "Escriu i prem Intro per afegir etiquetes",
        visibility_label: "Visibilitat",
        public_description:
          "Les ordres de barra públiques són visibles per a tothom.",
        private_description:
          "Les ordres de barra privades només són visibles per a tu.",
        publish_button: "Publica al Centre de la comunitat",
        submitting: "Publicant...",
        prompt_label: "Missatge",
        prompt_description:
          "Aquest és el missatge que s'usarà quan es dispari l'ordre de barra.",
        prompt_placeholder: "Introdueix el teu missatge aquí...",
      },
      generic: {
        unauthenticated: {
          title: "Autenticació requerida",
          description:
            "Has d'autenticar-te amb el Centre de la comunitat d'AnythingLLM abans de publicar elements.",
          button: "Connecta al Centre de la comunitat",
        },
      },
    },
  },
  scheduledJobs: {
    title: "Feines programades",
    enableNotifications:
      "Activa les notificacions del navegador per als resultats de la cerca de feina.",
    description:
      "Crea tasques d'IA recurrents que s'executen segons un horari. Cada tasca executa una consulta amb eines opcionals i guarda el resultat per a la seva revisió.",
    newJob: "Nou lloc de treball",
    loading: "Cargant...",
    emptyTitle: "No hi ha tasques programades.",
    emptySubtitle: "Creeu un per començar.",
    table: {
      name: "Nom",
      schedule: "Horari",
      status: "Estat",
      lastRun: "Última sortida",
      nextRun: "Proper següent",
      actions: "Accions",
    },
    confirmDelete: "Estàs segur que vols eliminar aquesta tasca programada?",
    toast: {
      deleted: "Emple o eliminat",
      triggered: "La tasca s'ha completat amb èxit.",
      triggerFailed: "No s'ha pogut iniciar la tasca.",
      triggerSkipped: "Ja s'ha iniciat la feina per a aquest projecte.",
      killed: "La feina s'ha completat amb èxit.",
      killFailed: "No va poder evitar que es fes la feina.",
    },
    row: {
      neverRun: "Mai no corres",
      viewRuns: "Horaris de funcionament",
      runNow: "Corre ara",
      enable: "Activar",
      disable: "Desactivar",
      edit: "Editar",
      delete: "Eliminar",
    },
    modal: {
      titleEdit: "Modificar tasca programada",
      titleNew: "Nova tasca programada",
      nameLabel: "Nom",
      namePlaceholder: 'Per exemple, "Resum diari de notícies"',
      promptLabel: "Indicació",
      promptPlaceholder: "L'instrucció per executar-se en cada execució...",
      scheduleLabel: "Horari",
      modeBuilder: "Constructor",
      modeCustom: "Personalitzat",
      cronPlaceholder: "Execució de la tasca (per exemple, 0 9 * * *)",
      currentSchedule: "Horari actual:",
      toolsLabel: "Eines (opcional)",
      toolsDescription:
        "Seleccioneu quins eines d'agent pot utilitzar aquest treball. Si cap, seleccioneu, el treball es realitzarà sense cap eina.",
      toolsSearch: "Cerca",
      toolsNoResults: "No hi ha cap eina que coincideixi.",
      required: "Obligatori",
      requiredFieldsBanner:
        "Si us plau, compliu tots els camps obligatoris per crear l'oferta de treball.",
      cancel: "Cancel·lar",
      saving: "Guardant...",
      updateJob: "Actualitzar lloc de treball",
      createJob: "Crear un lloc de treball",
      jobUpdated: "Pàgina actualitzada",
      jobCreated: "Creació d'un lloc de treball",
    },
    builder: {
      fallbackWarning:
        'Aquesta expressió no es pot modificar visualment. Per mantenir-la, utilitzeu l\'opció "Personalitzat". Si voleu, podeu modificar qualsevol element de sota per sobrescribir-la.',
      run: "Corre",
      frequency: {
        minute: "cada minut",
        hour: "per hora",
        day: "diari",
        week: "setmanal",
        month: "mensal",
      },
      every: "Cada",
      minuteOne: "1 minut",
      minuteOther: "{{count}} minuts",
      atMinute: "En el moment",
      pastEveryHour: "cada hora",
      at: "A",
      on: "Sobre",
      onDay: "En un dia",
      ofEveryMonth: "de cada mes",
      weekdays: {
        sun: "Sol",
        mon: "Mon",
        tue: "Dimarts",
        wed: "Dijous",
        thu: "Dijous",
        fri: "Divendres",
        sat: "Dissabte",
      },
    },
    runHistory: {
      back: "Torna a les feines",
      title: "Històric de curses: {{name}}",
      schedule: "Horari:",
      emptyTitle: "Aún no hi ha candidats per a aquesta posició.",
      emptySubtitle: "Inicia la tasca ara i consulta els resultats.",
      runNow: "Comença ara",
      table: {
        status: "Estat",
        started: "Comencat",
        duration: "Durada",
        error: "Error",
      },
      stopJob: "Aturar la feina",
    },
    runDetail: {
      loading: "Càrrec detalls de la sessió...",
      notFound: "No s'ha trobat la sortida.",
      back: "Cap endavant",
      unknownJob: "Posició sense especificar",
      runHeading: "{{name}} — Executar la tasca {{id}}",
      duration: "Durada: {{value}}",
      creating: "Creant...",
      threadFailed: "No s'ha pogut crear el fil.",
      sections: {
        prompt: "Indicació",
        error: "Error",
        thinking: "Pensaments ({{count}})",
        toolCalls: "Crides a les eines ({{count}})",
        files: "Fitxers ({{count}})",
        response: "Resposta",
        metrics: "Mètriques",
      },
      metrics: {
        promptTokens: "Tokens de desencadenament:",
        completionTokens: "Tokens de finalització:",
      },
      stopJob: "Finalitzar feina",
      killing: "Aturar...",
      continueInThread: "Continua la conversa",
    },
    toolCall: {
      arguments: "Argumentacions:",
      showResult: "Mostrar resultat",
      hideResult: "Ocultar resultat",
    },
    file: {
      unknown: "Fitxer desconegut",
      download: "Descarregar",
      downloadFailed: "No s'ha pogut descarregar el fitxer.",
      types: {
        powerpoint: "PowerPoint",
        pdf: "Document en format PDF",
        word: "Document de text",
        spreadsheet: "Fulla de càlcul",
        generic: "Fitxer",
      },
    },
    status: {
      completed: "Complet",
      failed: "Fallit",
      timed_out: "Ha expirat el temps",
      running: "Correu",
      queued: "En la fila d'espera",
    },
  },
};

export default TRANSLATIONS;
