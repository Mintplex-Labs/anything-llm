const TRANSLATIONS = {
  common: {
    "workspaces-name": "Nombre de espacios de trabajo",
    error: "error",
    success: "éxito",
    user: "Usuario",
    selection: "Selección de modelo",
    saving: "Guardando...",
    save: "Guardar cambios",
    previous: "Página anterior",
    next: "Página siguiente",
  },

  settings: {
    title: "Configuración de instancia",
    system: "Preferencias del sistema",
    invites: "Invitación",
    users: "Usuarios",
    workspaces: "Espacios de trabajo",
    "workspace-chats": "Chat del espacio de trabajo",
    customization: "Apariencia",
    "api-keys": "Claves API",
    llm: "Preferencia de LLM",
    transcription: "Modelo de transcripción",
    embedder: "Preferencias de incrustación",
    "text-splitting": "Divisor y fragmentación de texto",
    "voice-speech": "Voz y Habla",
    "vector-database": "Base de datos de vectores",
    embeds: "Widgets de chat incrustados",
    "embed-chats": "Historial de chats incrustados",
    security: "Seguridad",
    "event-logs": "Registros de eventos",
    privacy: "Privacidad y datos",
    "ai-providers": "Proveedores de IA",
    "agent-skills": "Habilidades del agente",
    admin: "Administrador",
    tools: "Herramientas",
    "experimental-features": "Funciones Experimentales",
    contact: "Contactar Soporte",
    "browser-extension": "Extensión del navegador",
  },

  login: {
    "multi-user": {
      welcome: "Bienvenido a",
      "placeholder-username": "Nombre de usuario",
      "placeholder-password": "Contraseña",
      login: "Iniciar sesión",
      validating: "Validando...",
      "forgot-pass": "Olvidé mi contraseña",
      reset: "Restablecer",
    },
    "sign-in": {
      start: "Iniciar sesión en tu",
      end: "cuenta.",
    },
    "password-reset": {
      title: "Restablecer la contraseña",
      description:
        "Proporcione la información necesaria a continuación para restablecer su contraseña.",
      "recovery-codes": "Códigos de recuperación",
      "recovery-code": "Código de recuperación {{index}}",
      "back-to-login": "Volver al inicio de sesión",
    },
  },

  welcomeMessage: {
    part1:
      "Bienvenido a AnythingLLM, una herramienta de inteligencia artificial de código abierto creada por Mintplex Labs que convierte cualquier cosa en un chatbot entrenado con el que puedes consultar y conversar. AnythingLLM es un software BYOK (bring-your-own-keys), por lo que no hay suscripciones, tarifas ni cargos por este software, salvo por los servicios que deseas utilizar.",
    part2:
      "AnythingLLM es la forma más sencilla de integrar productos de inteligencia artificial potentes como OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB y otros servicios en un paquete ordenado, sin complicaciones, para aumentar tu productividad en un 100x.",
    part3:
      "AnythingLLM puede ejecutarse completamente en tu máquina local con poco impacto, ¡ni siquiera notarás que está ahí! No se necesita GPU. También está disponible la instalación en la nube y en instalaciones locales.\nEl ecosistema de herramientas de inteligencia artificial se vuelve más poderoso cada día. AnythingLLM facilita su uso.",
    githubIssue: "Crear un problema en Github",
    user1: "¿Cómo empiezo?!",
    part4:
      'Es simple. Todas las colecciones se organizan en contenedores que llamamos "Workspaces". Los Workspaces son contenedores de archivos, documentos, imágenes, PDFs y otros archivos que se transformarán en algo que los LLM puedan entender y usar en una conversación.\n\nPuedes agregar y eliminar archivos en cualquier momento.',
    createWorkspace: "Crea tu primer workspace",
    user2:
      "¿Es esto como un Dropbox de IA o algo así? ¿Qué hay de chatear? ¿Es un chatbot, no?",
    part5:
      "AnythingLLM es más que un Dropbox más inteligente.\n\nAnythingLLM ofrece dos formas de interactuar con tus datos:\n\n<i>Consulta:</i> Tus chats devolverán datos o inferencias encontradas con los documentos en tu workspace al que tiene acceso. ¡Agregar más documentos al workspace lo hace más inteligente! \n\n<i>Conversacional:</i> Tus documentos y tu historial de chat en curso contribuyen al conocimiento del LLM al mismo tiempo. Ideal para agregar información en tiempo real basada en texto o correcciones y malentendidos que el LLM pueda tener.\n\n¡Puedes alternar entre ambos modos <i>en medio de una conversación!</i>",
    user3: "¡Vaya, esto suena increíble, déjame probarlo ya!",
    part6: "¡Diviértete!",
    starOnGithub: "Estrella en GitHub",
    contact: "Contactar a Mintplex Labs",
  },

  "new-workspace": {
    title: "Nuevo Espacio de Trabajo",
    placeholder: "Mi Espacio de Trabajo",
  },

  "workspaces—settings": {
    general: "Configuración general",
    chat: "Configuración de chat",
    vector: "Base de datos de vectores",
    members: "Miembros",
    agent: "Configuración del agente",
  },

  general: {
    vector: {
      title: "Conteo de vectores",
      description: "Número total de vectores en tu base de datos de vectores.",
    },
    names: {
      description:
        "Esto solo cambiará el nombre de visualización de tu espacio de trabajo.",
    },
    message: {
      title: "Mensajes de chat sugeridos",
      description:
        "Personaliza los mensajes que se sugerirán a los usuarios de tu espacio de trabajo.",
      add: "Agregar nuevo mensaje",
      save: "Guardar mensajes",
      heading: "Explícame",
      body: "los beneficios de AnythingLLM",
    },
    pfp: {
      title: "Imagen de perfil del asistente",
      description:
        "Personaliza la imagen de perfil del asistente para este espacio de trabajo.",
      image: "Imagen del espacio de trabajo",
      remove: "Eliminar imagen del espacio de trabajo",
    },
    delete: {
      title: "Eliminar Espacio de Trabajo",
      description:
        "Eliminar este espacio de trabajo y todos sus datos. Esto eliminará el espacio de trabajo para todos los usuarios.",
      delete: "Eliminar espacio de trabajo",
      deleting: "Eliminando espacio de trabajo...",
      "confirm-start": "Estás a punto de eliminar tu",
      "confirm-end":
        "espacio de trabajo. Esto eliminará todas las incrustaciones de vectores en tu base de datos de vectores.\n\nLos archivos de origen originales permanecerán intactos. Esta acción es irreversible.",
    },
  },

  chat: {
    llm: {
      title: "Proveedor LLM del espacio de trabajo",
      description:
        "El proveedor y modelo LLM específico que se utilizará para este espacio de trabajo. Por defecto, utiliza el proveedor y configuración del sistema LLM.",
      search: "Buscar todos los proveedores LLM",
    },
    model: {
      title: "Modelo de chat del espacio de trabajo",
      description:
        "El modelo de chat específico que se utilizará para este espacio de trabajo. Si está vacío, se utilizará la preferencia LLM del sistema.",
      wait: "-- esperando modelos --",
    },
    mode: {
      title: "Modo de chat",
      chat: {
        title: "Chat",
        "desc-start":
          "proporcionará respuestas con el conocimiento general del LLM",
        and: "y",
        "desc-end": "el contexto del documento que se encuentre.",
      },
      query: {
        title: "Consulta",
        "desc-start": "proporcionará respuestas",
        only: "solo",
        "desc-end": "si se encuentra el contexto del documento.",
      },
    },
    history: {
      title: "Historial de chat",
      "desc-start":
        "El número de chats anteriores que se incluirán en la memoria a corto plazo de la respuesta.",
      recommend: "Recomendar 20. ",
      "desc-end":
        "Cualquier cosa más de 45 probablemente conducirá a fallos continuos en el chat dependiendo del tamaño del mensaje.",
    },
    prompt: {
      title: "Prompt",
      description:
        "El prompt que se utilizará en este espacio de trabajo. Define el contexto y las instrucciones para que la IA genere una respuesta. Debes proporcionar un prompt cuidadosamente elaborado para que la IA pueda generar una respuesta relevante y precisa.",
    },
    refusal: {
      title: "Respuesta de rechazo en modo consulta",
      "desc-start": "Cuando esté en",
      query: "consulta",
      "desc-end":
        "modo, es posible que desees devolver una respuesta de rechazo personalizada cuando no se encuentre contexto.",
    },
    temperature: {
      title: "Temperatura de LLM",
      "desc-start":
        'Esta configuración controla cuán "creativas" serán las respuestas de tu LLM.',
      "desc-end":
        "Cuanto mayor sea el número, más creativas serán las respuestas. Para algunos modelos, esto puede llevar a respuestas incoherentes cuando se establece demasiado alto.",
      hint: "La mayoría de los LLM tienen varios rangos aceptables de valores válidos. Consulta a tu proveedor de LLM para obtener esa información.",
    },
  },

  "vector-workspace": {
    identifier: "Identificador de la base de datos de vectores",
    snippets: {
      title: "Máximo de fragmentos de contexto",
      description:
        "Esta configuración controla la cantidad máxima de fragmentos de contexto que se enviarán al LLM por chat o consulta.",
      recommend: "Recomendado: 4",
    },
    doc: {
      title: "Umbral de similitud de documentos",
      description:
        "La puntuación mínima de similitud requerida para que una fuente se considere relacionada con el chat. Cuanto mayor sea el número, más similar debe ser la fuente al chat.",
      zero: "Sin restricción",
      low: "Bajo (puntuación de similitud ≥ .25)",
      medium: "Medio (puntuación de similitud ≥ .50)",
      high: "Alto (puntuación de similitud ≥ .75)",
    },
    reset: {
      reset: "Restablecer la base de datos de vectores",
      resetting: "Borrando vectores...",
      confirm:
        "Estás a punto de restablecer la base de datos de vectores de este espacio de trabajo. Esto eliminará todas las incrustaciones de vectores actualmente incrustadas.\n\nLos archivos de origen originales permanecerán intactos. Esta acción es irreversible.",
      error:
        "¡No se pudo restablecer la base de datos de vectores del espacio de trabajo!",
      success:
        "¡La base de datos de vectores del espacio de trabajo fue restablecida!",
    },
  },

  agent: {
    "performance-warning":
      "El rendimiento de los LLM que no admiten explícitamente la llamada de herramientas depende en gran medida de las capacidades y la precisión del modelo. Algunas habilidades pueden estar limitadas o no funcionar.",
    provider: {
      title: "Proveedor de LLM del agente del espacio de trabajo",
      description:
        "El proveedor y modelo LLM específico que se utilizará para el agente @agent de este espacio de trabajo.",
    },
    mode: {
      chat: {
        title: "Modelo de chat del agente del espacio de trabajo",
        description:
          "El modelo de chat específico que se utilizará para el agente @agent de este espacio de trabajo.",
      },
      title: "Modelo del agente del espacio de trabajo",
      description:
        "El modelo LLM específico que se utilizará para el agente @agent de este espacio de trabajo.",
      wait: "-- esperando modelos --",
    },

    skill: {
      title: "Habilidades predeterminadas del agente",
      description:
        "Mejora las habilidades naturales del agente predeterminado con estas habilidades preconstruidas. Esta configuración se aplica a todos los espacios de trabajo.",
      rag: {
        title: "RAG y memoria a largo plazo",
        description:
          'Permitir que el agente aproveche tus documentos locales para responder a una consulta o pedirle al agente que "recuerde" piezas de contenido para la recuperación de memoria a largo plazo.',
      },
      view: {
        title: "Ver y resumir documentos",
        description:
          "Permitir que el agente enumere y resuma el contenido de los archivos del espacio de trabajo actualmente incrustados.",
      },
      scrape: {
        title: "Rastrear sitios web",
        description:
          "Permitir que el agente visite y rastree el contenido de sitios web.",
      },
      generate: {
        title: "Generar gráficos",
        description:
          "Habilitar al agente predeterminado para generar varios tipos de gráficos a partir de datos proporcionados o dados en el chat.",
      },
      save: {
        title: "Generar y guardar archivos en el navegador",
        description:
          "Habilitar al agente predeterminado para generar y escribir archivos que se guarden y puedan descargarse en tu navegador.",
      },
      web: {
        title: "Búsqueda en vivo en la web y navegación",
        "desc-start":
          "Permitir que tu agente busque en la web para responder tus preguntas conectándose a un proveedor de búsqueda en la web (SERP).",
        "desc-end":
          "La búsqueda en la web durante las sesiones del agente no funcionará hasta que esto esté configurado.",
      },
    },
  },

  recorded: {
    title: "Chats del espacio de trabajo",
    description:
      "Estos son todos los chats y mensajes grabados que han sido enviados por los usuarios ordenados por su fecha de creación.",
    export: "Exportar",
    table: {
      id: "Id",
      by: "Enviado por",
      workspace: "Espacio de trabajo",
      prompt: "Prompt",
      response: "Respuesta",
      at: "Enviado a",
    },
  },

  appearance: {
    title: "Apariencia",
    description: "Personaliza la configuración de apariencia de tu plataforma.",
    logo: {
      title: "Personalizar logotipo",
      description:
        "Sube tu logotipo personalizado para hacer que tu chatbot sea tuyo.",
      add: "Agregar un logotipo personalizado",
      recommended: "Tamaño recomendado: 800 x 200",
      remove: "Eliminar",
      replace: "Reemplazar",
    },
    message: {
      title: "Personalizar mensajes",
      description:
        "Personaliza los mensajes automáticos que se muestran a tus usuarios.",
      new: "Nuevo",
      system: "sistema",
      user: "usuario",
      message: "mensaje",
      assistant: "Asistente de chat AnythingLLM",
      "double-click": "Haz doble clic para editar...",
      save: "Guardar mensajes",
    },
    icons: {
      title: "Iconos de pie de página personalizados",
      description:
        "Personaliza los iconos de pie de página que se muestran en la parte inferior de la barra lateral.",
      icon: "Icono",
      link: "Enlace",
    },
  },

  api: {
    title: "Claves API",
    description:
      "Las claves API permiten al titular acceder y gestionar programáticamente esta instancia de AnythingLLM.",
    link: "Leer la documentación de la API",
    generate: "Generar nueva clave API",
    table: {
      key: "Clave API",
      by: "Creado por",
      created: "Creado",
    },
  },

  llm: {
    title: "Preferencia de LLM",
    description:
      "Estas son las credenciales y configuraciones para tu proveedor preferido de chat y incrustación de LLM. Es importante que estas claves estén actualizadas y correctas, de lo contrario AnythingLLM no funcionará correctamente.",
    provider: "Proveedor de LLM",
  },

  transcription: {
    title: "Preferencia de modelo de transcripción",
    description:
      "Estas son las credenciales y configuraciones para tu proveedor preferido de modelo de transcripción. Es importante que estas claves estén actualizadas y correctas, de lo contrario los archivos multimedia y de audio no se transcribirán.",
    provider: "Proveedor de transcripción",
    "warn-start":
      "El uso del modelo local Whisper en máquinas con RAM o CPU limitadas puede bloquear AnythingLLM al procesar archivos multimedia.",
    "warn-recommend":
      "Recomendamos al menos 2GB de RAM y subir archivos <10Mb.",
    "warn-end":
      "El modelo incorporado se descargará automáticamente en el primer uso.",
  },

  embedding: {
    title: "Preferencia de incrustación",
    "desc-start":
      "Cuando uses un LLM que no admita de forma nativa un motor de incrustación, es posible que necesites especificar credenciales adicionales para incrustar texto.",
    "desc-end":
      "La incrustación es el proceso de convertir texto en vectores. Estas credenciales son necesarias para convertir tus archivos y prompts en un formato que AnythingLLM pueda usar para procesar.",
    provider: {
      title: "Proveedor de incrustación",
      description:
        "No se requiere configuración cuando se utiliza el motor de incrustación nativo de AnythingLLM.",
    },
  },

  text: {
    title: "Preferencias de división y fragmentación de texto",
    "desc-start":
      "A veces, es posible que desees cambiar la forma predeterminada en que los nuevos documentos se dividen y fragmentan antes de ser insertados en tu base de datos de vectores.",
    "desc-end":
      "Solo debes modificar esta configuración si entiendes cómo funciona la división de texto y sus efectos secundarios.",
    "warn-start": "Los cambios aquí solo se aplicarán a",
    "warn-center": "documentos recién incrustados",
    "warn-end": ", no a los documentos existentes.",
    size: {
      title: "Tamaño del fragmento de texto",
      description:
        "Esta es la longitud máxima de caracteres que puede estar presente en un solo vector.",
      recommend: "La longitud máxima del modelo de incrustación es",
    },

    overlap: {
      title: "Superposición de fragmentos de texto",
      description:
        "Esta es la superposición máxima de caracteres que ocurre durante la fragmentación entre dos fragmentos de texto adyacentes.",
    },
  },

  vector: {
    title: "Base de datos de vectores",
    description:
      "Estas son las credenciales y configuraciones para cómo funcionará tu instancia de AnythingLLM. Es importante que estas claves estén actualizadas y correctas.",
    provider: {
      title: "Proveedor de base de datos de vectores",
      description: "No se necesita configuración para LanceDB.",
    },
  },

  embeddable: {
    title: "Widgets de chat incrustables",
    description:
      "Los widgets de chat incrustables son interfaces de chat de cara al público que están vinculadas a un solo espacio de trabajo. Esto te permite crear espacios de trabajo que luego puedes publicar al mundo.",
    create: "Crear incrustación",
    table: {
      workspace: "Espacio de trabajo",
      chats: "Chats enviados",
      Active: "Dominios activos",
    },
  },

  "embed-chats": {
    title: "Incrustar chats",
    export: "Exportar",
    description:
      "Estos son todos los chats y mensajes grabados de cualquier incrustación que hayas publicado.",
    table: {
      embed: "Incrustar",
      sender: "Remitente",
      message: "Mensaje",
      response: "Respuesta",
      at: "Enviado a",
    },
  },

  multi: {
    title: "Modo multiusuario",
    description:
      "Configura tu instancia para admitir a tu equipo activando el modo multiusuario.",
    enable: {
      "is-enable": "El modo multiusuario está habilitado",
      enable: "Habilitar modo multiusuario",
      description:
        "Por defecto, serás el único administrador. Como administrador, necesitarás crear cuentas para todos los nuevos usuarios o administradores. No pierdas tu contraseña ya que solo un usuario administrador puede restablecer las contraseñas.",
      username: "Nombre de usuario de la cuenta de administrador",
      password: "Contraseña de la cuenta de administrador",
    },
    password: {
      title: "Protección con contraseña",
      description:
        "Protege tu instancia de AnythingLLM con una contraseña. Si olvidas esta contraseña, no hay método de recuperación, así que asegúrate de guardar esta contraseña.",
    },
    instance: {
      title: "Proteger instancia con contraseña",
      description:
        "Por defecto, serás el único administrador. Como administrador, necesitarás crear cuentas para todos los nuevos usuarios o administradores. No pierdas tu contraseña ya que solo un usuario administrador puede restablecer las contraseñas.",
      password: "Contraseña de la instancia",
    },
  },

  event: {
    title: "Registros de eventos",
    description:
      "Ver todas las acciones y eventos que ocurren en esta instancia para monitoreo.",
    clear: "Borrar registros de eventos",
    table: {
      type: "Tipo de evento",
      user: "Usuario",
      occurred: "Ocurrido a",
    },
  },

  privacy: {
    title: "Privacidad y manejo de datos",
    description:
      "Esta es tu configuración para cómo los proveedores de terceros conectados y AnythingLLM manejan tus datos.",
    llm: "Selección de LLM",
    embedding: "Preferencia de incrustación",
    vector: "Base de datos de vectores",
    anonymous: "Telemetría anónima habilitada",
  },
  
  connectors: {
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    github: {
      name: "GitHub Repo",
      description: "Import an entire public or private Github repository in a single click.",
      URL: "GitHub Repo URL",
      URL_explained: "Url of the GitHub repo you wish to collect.",
      token: "Github Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", the GitHub API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      ignores: "File Ignores",
      git_ignore: "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained: "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from.",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information: "Without filling out the <b>Github Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitHub's public API rate-limits.",
      token_personal: "Get a free Personal Access Token with a GitHub account here."
    },
    gitlab: {
      name: "GitLab Repo",
      description: "Import an entire public or private GitLab repository in a single click.",
      URL: "GitLab Repo URL",
      URL_explained: "URL of the GitLab repo you wish to collect.",
      token: "GitLab Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_description: "Select additional entities to fetch from the GitLab API.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", the GitLab API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      fetch_issues: "Fetch Issues as Documents",
      ignores: "File Ignores",
      git_ignore: "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained: "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information: "Without filling out the <b>GitLab Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitLab's public API rate-limits.",
      token_personal: "Get a free Personal Access Token with a GitLab account here."
    },
    youtube: {
      name: "YouTube Transcript",
      description: "Import the transcription of an entire YouTube video from a link.",
      URL: "YouTube Video URL",
      URL_explained_start: "Enter the URL of any YouTube video to fetch its transcript. The video must have ",
      URL_explained_link: "closed captions",
      URL_explained_end: " available.",
      task_explained: "Once complete, the transcript will be available for embedding into workspaces in the document picker.",
      language: "Transcript Language",
      language_explained: "Select the language of the transcript you want to collect.",
      loading_languages: "-- loading available languages --"
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description: "Scrape a website and its sub-links up to a certain depth.",
      URL: "Website URL",
      URL_explained: "URL of the website you want to scrape.",
      depth: "Crawl Depth",
      depth_explained: "This is the number of child-links that the worker should follow from the origin URL.",
      max_pages: "Maximum Pages",
      max_pages_explained: "Maximum number of links to scrape.",
      task_explained: "Once complete, all scraped content will be available for embedding into workspaces in the document picker."
    },
    confluence: {
      name: "Confluence",
      description: "Import an entire Confluence page in a single click.",
      deployment_type: "Confluence deployment type",
      deployment_type_explained: "Determine if your Confluence instance is hosted on Atlassian cloud or self-hosted.",
      base_url: "Confluence base URL",
      base_url_explained: "This is the base URL of your Confluence space.",
      space_key: "Confluence space key",
      space_key_explained: "This is the spaces key of your confluence instance that will be used. Usually begins with ~",
      username: "Confluence Username",
      username_explained: "Your Confluence username.",
      token: "Confluence API Token",
      token_explained_start: "A ",
      token_explained_link1: "Personal API Token",
      token_explained_middle: " is required to access Confluence pages. You can ",
      token_explained_link2: "create an API Token here",
      token_explained_end: ".",
      token_desc: "Access token for authentication.",
      task_explained: "Once complete, the page content will be available for embedding into workspaces in the document picker."
    },

    manage: {
      documents: "Documents",
      "data-connectors": "Data Connectors",
      "desktop-only": "Editing these settings are only available on a desktop device. Please access this page on your desktop to continue.",
      dismiss: "Dismiss",
      editing: "Editing",
    },
    directory: {
      "my-documents": "My Documents",
      "new-folder": "New Folder",
      "search-document": "Search for document",
      "no-documents": "No Documents",
      "move-workspace": "Move to Workspace",
      name: "Name",
      "delete-confirmation": "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible.",
      "removing-message": "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Successfully moved {{count}} documents.",
      date: "Date",
      type: "Type",
      no_docs: "No Documents",
      select_all:"Select All",
      deselect_all:"Deselect All",
      remove_selected: "Remove Selected",
      costs: "*One time cost for embeddings",
      save_embed: "Save and Embed",
    },
    upload: {
      "processor-offline": "Document Processor Unavailable",
      "processor-offline-desc": "We can't upload your files right now because the document processor is offline. Please try again later.",
      "click-upload": "Click to upload or drag and drop",
      "file-types": "supports text files, csv's, spreadsheets, audio files, and more!",
      "or-submit-link": "or submit a link",
      "placeholder-link": "https://example.com",
      "fetching": "Fetching...",
      "fetch-website": "Fetch website",
      "privacy-notice": "These files will be uploaded to the document processor running on this AnythingLLM instance. These files are not sent or shared with a third party.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1: "When you <b>pin</b> a document in AnythingLLM we will inject the entire content of the document into your prompt window for your LLM to fully comprehend.", 
      pin_explained_block2: "This works best with <b>large-context models</b> or small files that are critical to its knowledge-base.",
      pin_explained_block3: "If you are not getting the answers you desire from AnythingLLM by default then pinning is a great way to get higher quality answers in a click.",
      accept: "Okay, got it"
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1: "When you <b>watch</b> a document in AnythingLLM we will <i>automatically</i> sync your document content from it's original source on regular intervals. This will automatically update the content in every workspace where this file is managed.", 
      watch_explained_block2: "This feature currently supports online-based content and will not be available for manually uploaded documents.",
      watch_explained_block3_start: "You can manage what documents are watched from the ",
      watch_explained_block3_link: "File manager",
      watch_explained_block3_end: " admin view.",
      accept: "Okay, got it"
    }
  },

  chat_window:{
    welcome: "Welcome to your new workspace.",
    get_started: "To get started either",
    get_started_default: "To get started",
    upload: "upload a document",
    or: "or",
    send_chat: "send a chat.",
    send_message: "Send a message",
    attach_file: "Attach a file to this chat",
    slash: "View all available slash commands for chatting.",
    agents: "View all available agents you can use for chatting.",
    text_size: "Change text size.",
    microphone: "Speak your prompt.",
    send: "Send prompt message to workspace",
  },

  profile_settings:{
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_description: "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
    new_password: "New Password",
    passwort_description: "Password must be at least 8 characters long",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Theme Preference",
    language: "Preferred language",
  },
};

export default TRANSLATIONS;
