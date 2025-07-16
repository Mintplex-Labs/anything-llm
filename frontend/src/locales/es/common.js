// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: null,
      useCase: null,
      useCaseWork: null,
      useCasePersonal: null,
      useCaseOther: null,
      comment: null,
      commentPlaceholder: null,
      skip: null,
      thankYou: null,
      title: null,
      description: null,
    },
    home: {
      title: null,
      getStarted: null,
    },
    llm: {
      title: null,
      description: null,
    },
    userSetup: {
      title: null,
      description: null,
      howManyUsers: null,
      justMe: null,
      myTeam: null,
      instancePassword: null,
      setPassword: null,
      passwordReq: null,
      passwordWarn: null,
      adminUsername: null,
      adminUsernameReq: null,
      adminPassword: null,
      adminPasswordReq: null,
      teamHint: null,
    },
    data: {
      title: null,
      description: null,
      settingsHint: null,
    },
    workspace: {
      title: null,
      description: null,
    },
  },
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
    optional: null,
    yes: null,
    no: null,
    search: null,
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
    "system-prompt-variables": null,
    interface: null,
    branding: null,
    chat: null,
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
    githubIssue: "Crear un problema en GitHub",
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
    starOnGitHub: "Estrella en GitHub",
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
      history: {
        title: null,
        clearAll: null,
        noHistory: null,
        restore: null,
        delete: null,
        deleteConfirm: null,
        clearAllConfirm: null,
        expand: null,
        publish: null,
      },
    },
    refusal: {
      title: "Respuesta de rechazo en modo consulta",
      "desc-start": "Cuando esté en",
      query: "consulta",
      "desc-end":
        "modo, es posible que desees devolver una respuesta de rechazo personalizada cuando no se encuentre contexto.",
      "tooltip-title": null,
      "tooltip-description": null,
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
      active: "Dominios activos",
      created: null,
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
    "search-placeholder": null,
    "no-connectors": null,
    github: {
      name: null,
      description: null,
      URL: null,
      URL_explained: null,
      token: null,
      optional: null,
      token_explained: null,
      token_explained_start: null,
      token_explained_link1: null,
      token_explained_middle: null,
      token_explained_link2: null,
      token_explained_end: null,
      ignores: null,
      git_ignore: null,
      task_explained: null,
      branch: null,
      branch_loading: null,
      branch_explained: null,
      token_information: null,
      token_personal: null,
    },
    gitlab: {
      name: null,
      description: null,
      URL: null,
      URL_explained: null,
      token: null,
      optional: null,
      token_explained: null,
      token_description: null,
      token_explained_start: null,
      token_explained_link1: null,
      token_explained_middle: null,
      token_explained_link2: null,
      token_explained_end: null,
      fetch_issues: null,
      ignores: null,
      git_ignore: null,
      task_explained: null,
      branch: null,
      branch_loading: null,
      branch_explained: null,
      token_information: null,
      token_personal: null,
    },
    youtube: {
      name: null,
      description: null,
      URL: null,
      URL_explained_start: null,
      URL_explained_link: null,
      URL_explained_end: null,
      task_explained: null,
      language: null,
      language_explained: null,
      loading_languages: null,
    },
    "website-depth": {
      name: null,
      description: null,
      URL: null,
      URL_explained: null,
      depth: null,
      depth_explained: null,
      max_pages: null,
      max_pages_explained: null,
      task_explained: null,
    },
    confluence: {
      name: null,
      description: null,
      deployment_type: null,
      deployment_type_explained: null,
      base_url: null,
      base_url_explained: null,
      space_key: null,
      space_key_explained: null,
      username: null,
      username_explained: null,
      auth_type: null,
      auth_type_explained: null,
      auth_type_username: null,
      auth_type_personal: null,
      token: null,
      token_explained_start: null,
      token_explained_link: null,
      token_desc: null,
      pat_token: null,
      pat_token_explained: null,
      task_explained: null,
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
    obsidian: {
      name: null,
      description: null,
      vault_location: null,
      vault_description: null,
      selected_files: null,
      importing: null,
      import_vault: null,
      processing_time: null,
      vault_warning: null,
    },
  },
  chat_window: {
    welcome: null,
    get_started: null,
    get_started_default: null,
    upload: null,
    or: null,
    send_chat: null,
    send_message: null,
    attach_file: null,
    slash: null,
    agents: null,
    text_size: null,
    microphone: null,
    send: null,
    attachments_processing: null,
    tts_speak_message: null,
    copy: null,
    regenerate: null,
    regenerate_response: null,
    good_response: null,
    more_actions: null,
    hide_citations: null,
    show_citations: null,
    pause_tts_speech_message: null,
    fork: null,
    delete: null,
    save_submit: null,
    cancel: null,
    edit_prompt: null,
    edit_response: null,
    at_agent: null,
    default_agent_description: null,
    custom_agents_coming_soon: null,
    slash_reset: null,
    preset_reset_description: null,
    add_new_preset: null,
    command: null,
    your_command: null,
    placeholder_prompt: null,
    description: null,
    placeholder_description: null,
    save: null,
    small: null,
    normal: null,
    large: null,
    workspace_llm_manager: {
      search: null,
      loading_workspace_settings: null,
      available_models: null,
      available_models_description: null,
      save: null,
      saving: null,
      missing_credentials: null,
      missing_credentials_description: null,
    },
  },
  profile_settings: {
    edit_account: null,
    profile_picture: null,
    remove_profile_picture: null,
    username: null,
    username_description: null,
    new_password: null,
    password_description: null,
    cancel: null,
    update_account: null,
    theme: null,
    language: null,
    failed_upload: null,
    upload_success: null,
    failed_remove: null,
    profile_updated: null,
    failed_update_user: null,
    account: null,
    support: null,
    signout: null,
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
  "main-page": {
    noWorkspaceError:
      "Por favor, crea un espacio de trabajo antes de iniciar un chat.",
    checklist: {
      title: "Comenzando",
      tasksLeft: "tareas restantes",
      completed:
        "¡Estás en camino de convertirte en un experto en AnythingLLM!",
      dismiss: "cerrar",
      tasks: {
        create_workspace: {
          title: "Crear un espacio de trabajo",
          description: "Crea tu primer espacio de trabajo para comenzar",
          action: "Crear",
        },
        send_chat: {
          title: "Enviar un chat",
          description: "Inicia una conversación con tu asistente de IA",
          action: "Chatear",
        },
        embed_document: {
          title: "Incrustar un documento",
          description: "Añade tu primer documento a tu espacio de trabajo",
          action: "Incrustar",
        },
        setup_system_prompt: {
          title: "Configurar un prompt del sistema",
          description: "Configura el comportamiento de tu asistente de IA",
          action: "Configurar",
        },
        define_slash_command: {
          title: "Definir un comando de barra",
          description: "Crea comandos personalizados para tu asistente",
          action: "Definir",
        },
        visit_community: {
          title: "Visitar el Centro de la Comunidad",
          description: "Explora recursos y plantillas de la comunidad",
          action: "Explorar",
        },
      },
    },
    quickLinks: {
      title: "Enlaces Rápidos",
      sendChat: "Enviar Chat",
      embedDocument: "Incrustar un Documento",
      createWorkspace: "Crear Espacio de Trabajo",
    },
    exploreMore: {
      title: "Explora más características",
      features: {
        customAgents: {
          title: "Agentes de IA Personalizados",
          description:
            "Crea poderosos agentes de IA y automatizaciones sin código.",
          primaryAction: "Chatear usando @agente",
          secondaryAction: "Crear un flujo de agente",
        },
        slashCommands: {
          title: "Comandos de Barra",
          description:
            "Ahorra tiempo e inyecta prompts utilizando comandos de barra personalizados.",
          primaryAction: "Crear un Comando de Barra",
          secondaryAction: "Explorar en el Hub",
        },
        systemPrompts: {
          title: "Prompts del Sistema",
          description:
            "Modifica el prompt del sistema para personalizar las respuestas de IA de un espacio de trabajo.",
          primaryAction: "Modificar un Prompt del Sistema",
          secondaryAction: "Gestionar variables de prompt",
        },
      },
    },
    announcements: {
      title: "Actualizaciones y Anuncios",
    },
    resources: {
      title: "Recursos",
      links: {
        docs: "Documentación",
        star: "Destacar en Github",
      },
      keyboardShortcuts: null,
    },
  },
  "keyboard-shortcuts": {
    title: null,
    shortcuts: {
      settings: null,
      workspaceSettings: null,
      home: null,
      workspaces: null,
      apiKeys: null,
      llmPreferences: null,
      chatSettings: null,
      help: null,
      showLLMSelector: null,
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        submit: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
      agent_flow: {
        public_description: null,
        private_description: null,
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        publish_button: null,
        submitting: null,
        submit: null,
        privacy_note: null,
      },
      generic: {
        unauthenticated: {
          title: null,
          description: null,
          button: null,
        },
      },
      slash_command: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        command_label: null,
        command_description: null,
        command_placeholder: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
    },
  },
};

export default TRANSLATIONS;
