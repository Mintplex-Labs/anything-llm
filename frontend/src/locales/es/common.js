// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Bienvenido a",
      getStarted: "Comenzar",
    },
    llm: {
      title: "Preferencia de LLM",
      description:
        "AnythingLLM puede funcionar con muchos proveedores de LLM. Este será el servicio que gestionará el chat.",
    },
    userSetup: {
      title: "Configuración de usuario",
      description: "Configura los ajustes de tu usuario.",
      howManyUsers: "¿Cuántos usuarios utilizarán esta instancia?",
      justMe: "Solo yo",
      myTeam: "Mi equipo",
      instancePassword: "Contraseña de la instancia",
      setPassword: "¿Deseas establecer una contraseña?",
      passwordReq: "Las contraseñas deben tener al menos 8 caracteres.",
      passwordWarn:
        "Es importante guardar esta contraseña porque no hay método de recuperación.",
      adminUsername: "Nombre de usuario del administrador",
      adminUsernameReq:
        "El nombre de usuario debe tener al menos 6 caracteres y solo puede contener letras minúsculas, números, guiones bajos y guiones sin espacios.",
      adminPassword: "Contraseña de la cuenta de administrador",
      adminPasswordReq: "Las contraseñas deben tener al menos 8 caracteres.",
      teamHint:
        "Por defecto, serás el único administrador. Una vez completada la incorporación, puedes crear e invitar a otros a ser usuarios o administradores. No pierdas tu contraseña, ya que solo los administradores pueden restablecer las contraseñas.",
    },
    data: {
      title: "Manejo de datos y privacidad",
      description:
        "Estamos comprometidos con la transparencia y el control en lo que respecta a tus datos personales.",
      settingsHint:
        "Estos ajustes se pueden reconfigurar en cualquier momento en la configuración.",
    },
    survey: {
      title: "Bienvenido a AnythingLLM",
      description:
        "Ayúdanos a hacer que AnythingLLM se adapte a tus necesidades. Opcional.",
      email: "¿Cuál es tu correo electrónico?",
      useCase: "¿Para qué usarás AnythingLLM?",
      useCaseWork: "Para el trabajo",
      useCasePersonal: "Para uso personal",
      useCaseOther: "Otro",
      comment: "¿Cómo te enteraste de AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - ¡Haznos saber cómo nos encontraste!",
      skip: "Omitir encuesta",
      thankYou: "¡Gracias por tus comentarios!",
    },
    workspace: {
      title: "Crea tu primer espacio de trabajo",
      description:
        "Crea tu primer espacio de trabajo y comienza a usar AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Nombre de los espacios de trabajo",
    error: "error",
    success: "éxito",
    user: "Usuario",
    selection: "Selección de modelo",
    saving: "Guardando...",
    save: "Guardar cambios",
    previous: "Página anterior",
    next: "Página siguiente",
    optional: "Opcional",
    yes: "Sí",
    no: "No",
    search: "Buscar",
  },
  settings: {
    title: "Ajustes de la instancia",
    system: "Ajustes generales",
    invites: "Invitaciones",
    users: "Usuarios",
    workspaces: "Espacios de trabajo",
    "workspace-chats": "Chats del espacio de trabajo",
    customization: "Personalización",
    interface: "Preferencias de la interfaz de usuario",
    branding: "Marca y marca blanca",
    chat: "Chat",
    "api-keys": "API de desarrollador",
    llm: "LLM",
    transcription: "Transcripción",
    embedder: "Incrustador (Embedder)",
    "text-splitting": "División de texto y fragmentación",
    "voice-speech": "Voz y habla",
    "vector-database": "Base de datos vectorial",
    embeds: "Incrustaciones de chat",
    "embed-chats": "Historial de incrustaciones de chat",
    security: "Seguridad",
    "event-logs": "Registros de eventos",
    privacy: "Privacidad y datos",
    "ai-providers": "Proveedores de IA",
    "agent-skills": "Habilidades del agente",
    admin: "Administrador",
    tools: "Herramientas",
    "system-prompt-variables": "Variables de prompt del sistema",
    "experimental-features": "Funciones experimentales",
    contact: "Contactar con soporte",
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
      start: "Inicia sesión en tu",
      end: "cuenta.",
    },
    "password-reset": {
      title: "Restablecimiento de contraseña",
      description:
        "Proporciona la información necesaria a continuación para restablecer tu contraseña.",
      "recovery-codes": "Códigos de recuperación",
      "recovery-code": "Código de recuperación {{index}}",
      "back-to-login": "Volver al inicio de sesión",
    },
  },
  "main-page": {
    noWorkspaceError:
      "Por favor, crea un espacio de trabajo antes de iniciar un chat.",
    checklist: {
      title: "Primeros pasos",
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
          description: "Agrega tu primer documento a tu espacio de trabajo",
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
          description: "Explora los recursos y plantillas de la comunidad",
          action: "Explorar",
        },
      },
    },
    quickLinks: {
      title: "Enlaces rápidos",
      sendChat: "Enviar chat",
      embedDocument: "Incrustar un documento",
      createWorkspace: "Crear espacio de trabajo",
    },
    exploreMore: {
      title: "Explorar más funciones",
      features: {
        customAgents: {
          title: "Agentes de IA personalizados",
          description:
            "Crea potentes agentes y automatizaciones de IA sin código.",
          primaryAction: "Chatear usando @agent",
          secondaryAction: "Crear un flujo de agente",
        },
        slashCommands: {
          title: "Comandos de barra",
          description:
            "Ahorra tiempo e inyecta prompts usando comandos de barra personalizados.",
          primaryAction: "Crear un comando de barra",
          secondaryAction: "Explorar en el Centro",
        },
        systemPrompts: {
          title: "Prompts del sistema",
          description:
            "Modifica el prompt del sistema para personalizar las respuestas de IA de un espacio de trabajo.",
          primaryAction: "Modificar un prompt del sistema",
          secondaryAction: "Administrar variables de prompt",
        },
      },
    },
    announcements: {
      title: "Actualizaciones y anuncios",
    },
    resources: {
      title: "Recursos",
      links: {
        docs: "Documentación",
        star: "Marcar con una estrella en Github",
      },
      keyboardShortcuts: "Atajos de teclado",
    },
  },
  "new-workspace": {
    title: "Nuevo espacio de trabajo",
    placeholder: "Mi espacio de trabajo",
  },
  "workspaces—settings": {
    general: "Ajustes generales",
    chat: "Ajustes de chat",
    vector: "Base de datos vectorial",
    members: "Miembros",
    agent: "Configuración del agente",
  },
  general: {
    vector: {
      title: "Recuento de vectores",
      description: "Número total de vectores en tu base de datos vectorial.",
    },
    names: {
      description:
        "Esto solo cambiará el nombre para mostrar de tu espacio de trabajo.",
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
      title: "Eliminar espacio de trabajo",
      description:
        "Elimina este espacio de trabajo y todos sus datos. Esto eliminará el espacio de trabajo para todos los usuarios.",
      delete: "Eliminar espacio de trabajo",
      deleting: "Eliminando espacio de trabajo...",
      "confirm-start": "Estás a punto de eliminar todo tu",
      "confirm-end":
        "espacio de trabajo. Esto eliminará todas las incrustaciones de vectores en tu base de datos vectorial.\n\nLos archivos fuente originales permanecerán intactos. Esta acción es irreversible.",
    },
  },
  chat: {
    llm: {
      title: "Proveedor de LLM del espacio de trabajo",
      description:
        "El proveedor y modelo de LLM específico que se utilizará para este espacio de trabajo. Por defecto, utiliza el proveedor y la configuración de LLM del sistema.",
      search: "Buscar todos los proveedores de LLM",
    },
    model: {
      title: "Modelo de chat del espacio de trabajo",
      description:
        "El modelo de chat específico que se utilizará para este espacio de trabajo. Si está vacío, utilizará la preferencia de LLM del sistema.",
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
        "desc-end": "si se encuentra contexto del documento.",
      },
    },
    history: {
      title: "Historial de chat",
      "desc-start":
        "El número de chats anteriores que se incluirán en la memoria a corto plazo de la respuesta.",
      recommend: "Recomendado 20.",
      "desc-end":
        "Cualquier valor superior a 45 es probable que provoque fallos continuos en el chat dependiendo del tamaño del mensaje.",
    },
    prompt: {
      title: "Prompt del sistema",
      description:
        "El prompt que se utilizará en este espacio de trabajo. Define el contexto y las instrucciones para que la IA genere una respuesta. Debes proporcionar un prompt cuidadosamente elaborado para que la IA pueda generar una respuesta relevante y precisa.",
      history: {
        title: "Historial de prompts del sistema",
        clearAll: "Borrar todo",
        noHistory: "No hay historial de prompts del sistema disponible",
        restore: "Restaurar",
        delete: "Eliminar",
        publish: "Publicar en el Centro de la Comunidad",
        deleteConfirm:
          "¿Estás seguro de que quieres eliminar este elemento del historial?",
        clearAllConfirm:
          "¿Estás seguro de que quieres borrar todo el historial? Esta acción no se puede deshacer.",
        expand: "Expandir",
      },
    },
    refusal: {
      title: "Respuesta de rechazo en modo de consulta",
      "desc-start": "Cuando estés en modo de",
      query: "consulta",
      "desc-end":
        ", es posible que desees devolver una respuesta de rechazo personalizada cuando no se encuentre contexto.",
      "tooltip-title": "¿Por qué veo esto?",
      "tooltip-description":
        "Estás en modo de consulta, que solo utiliza información de tus documentos. Cambia al modo de chat para conversaciones más flexibles, o haz clic aquí para visitar nuestra documentación y obtener más información sobre los modos de chat.",
    },
    temperature: {
      title: "Temperatura del LLM",
      "desc-start":
        'Esta configuración controla cuán "creativas" serán tus respuestas del LLM.',
      "desc-end":
        "Cuanto mayor sea el número, más creativo. Para algunos modelos, esto puede llevar a respuestas incoherentes si se establece un valor demasiado alto.",
      hint: "La mayoría de los LLM tienen varios rangos aceptables de valores válidos. Consulta a tu proveedor de LLM para obtener esa información.",
    },
  },
  "vector-workspace": {
    identifier: "Identificador de la base de datos vectorial",
    snippets: {
      title: "Fragmentos de contexto máximos",
      description:
        "Esta configuración controla la cantidad máxima de fragmentos de contexto que se enviarán al LLM por chat o consulta.",
      recommend: "Recomendado: 4",
    },
    doc: {
      title: "Umbral de similitud de documentos",
      description:
        "La puntuación de similitud mínima requerida para que una fuente se considere relacionada con el chat. Cuanto mayor sea el número, más similar debe ser la fuente al chat.",
      zero: "Sin restricción",
      low: "Bajo (puntuación de similitud ≥ .25)",
      medium: "Medio (puntuación de similitud ≥ .50)",
      high: "Alto (puntuación de similitud ≥ .75)",
    },
    reset: {
      reset: "Restablecer base de datos vectorial",
      resetting: "Borrando vectores...",
      confirm:
        "Estás a punto de restablecer la base de datos vectorial de este espacio de trabajo. Esto eliminará todas las incrustaciones de vectores actualmente incrustadas.\n\nLos archivos fuente originales permanecerán intactos. Esta acción es irreversible.",
      error:
        "¡No se pudo restablecer la base de datos vectorial del espacio de trabajo!",
      success:
        "¡La base de datos vectorial del espacio de trabajo se restableció!",
    },
  },
  agent: {
    "performance-warning":
      "El rendimiento de los LLM que no admiten explícitamente la llamada a herramientas depende en gran medida de las capacidades y la precisión del modelo. Algunas habilidades pueden ser limitadas o no funcionales.",
    provider: {
      title: "Proveedor de LLM del agente del espacio de trabajo",
      description:
        "El proveedor y modelo de LLM específico que se utilizará para el agente @agent de este espacio de trabajo.",
    },
    mode: {
      chat: {
        title: "Modelo de chat del agente del espacio de trabajo",
        description:
          "El modelo de chat específico que se utilizará para el agente @agent de este espacio de trabajo.",
      },
      title: "Modelo de agente del espacio de trabajo",
      description:
        "El modelo de LLM específico que se utilizará para el agente @agent de este espacio de trabajo.",
      wait: "-- esperando modelos --",
    },
    skill: {
      title: "Habilidades predeterminadas del agente",
      description:
        "Mejora las habilidades naturales del agente predeterminado con estas habilidades preconstruidas. Esta configuración se aplica a todos los espacios de trabajo.",
      rag: {
        title: "RAG y memoria a largo plazo",
        description:
          'Permite que el agente aproveche tus documentos locales para responder una consulta o pídele al agente que "recuerde" fragmentos de contenido para la recuperación de memoria a largo plazo.',
      },
      view: {
        title: "Ver y resumir documentos",
        description:
          "Permite que el agente liste y resuma el contenido de los archivos del espacio de trabajo actualmente incrustados.",
      },
      scrape: {
        title: "Extraer sitios web",
        description:
          "Permite que el agente visite y extraiga el contenido de los sitios web.",
      },
      generate: {
        title: "Generar gráficos",
        description:
          "Habilita al agente predeterminado para generar varios tipos de gráficos a partir de datos proporcionados o dados en el chat.",
      },
      save: {
        title: "Generar y guardar archivos en el navegador",
        description:
          "Habilita al agente predeterminado para generar y escribir en archivos que se guardan y se pueden descargar en tu navegador.",
      },
      web: {
        title: "Búsqueda y navegación web en vivo",
        "desc-start":
          "Habilita a tu agente para buscar en la web para responder tus preguntas conectándose a un proveedor de búsqueda web (SERP).",
        "desc-end":
          "La búsqueda web durante las sesiones del agente no funcionará hasta que esto esté configurado.",
      },
    },
  },
  recorded: {
    title: "Chats del espacio de trabajo",
    description:
      "Estos son todos los chats y mensajes grabados que han sido enviados por los usuarios, ordenados por su fecha de creación.",
    export: "Exportar",
    table: {
      id: "ID",
      by: "Enviado por",
      workspace: "Espacio de trabajo",
      prompt: "Prompt",
      response: "Respuesta",
      at: "Enviado el",
    },
  },
  customization: {
    interface: {
      title: "Preferencias de la interfaz de usuario",
      description:
        "Establece tus preferencias de la interfaz de usuario para AnythingLLM.",
    },
    branding: {
      title: "Marca y marca blanca",
      description:
        "Personaliza tu instancia de AnythingLLM con tu propia marca.",
    },
    chat: {
      title: "Chat",
      description: "Establece tus preferencias de chat para AnythingLLM.",
      auto_submit: {
        title: "Envío automático de entrada de voz",
        description:
          "Enviar automáticamente la entrada de voz después de un período de silencio",
      },
      auto_speak: {
        title: "Hablar respuestas automáticamente",
        description: "Hablar automáticamente las respuestas de la IA",
      },
      spellcheck: {
        title: "Habilitar corrector ortográfico",
        description:
          "Habilitar o deshabilitar el corrector ortográfico en el campo de entrada del chat",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description:
          "Selecciona tu tema de color preferido para la aplicación.",
      },
      "show-scrollbar": {
        title: "Mostrar barra de desplazamiento",
        description:
          "Habilitar o deshabilitar la barra de desplazamiento en la ventana de chat.",
      },
      "support-email": {
        title: "Correo electrónico de soporte",
        description:
          "Establece la dirección de correo electrónico de soporte a la que los usuarios pueden acceder cuando necesiten ayuda.",
      },
      "app-name": {
        title: "Nombre",
        description:
          "Establece un nombre que se mostrará en la página de inicio de sesión para todos los usuarios.",
      },
      "chat-message-alignment": {
        title: "Alineación de mensajes de chat",
        description:
          "Selecciona el modo de alineación de mensajes cuando utilices la interfaz de chat.",
      },
      "display-language": {
        title: "Idioma de visualización",
        description:
          "Selecciona el idioma preferido para renderizar la interfaz de usuario de AnythingLLM, cuando las traducciones estén disponibles.",
      },
      logo: {
        title: "Logotipo de la marca",
        description:
          "Sube tu logotipo personalizado para mostrarlo en todas las páginas.",
        add: "Agregar un logotipo personalizado",
        recommended: "Tamaño recomendado: 800 x 200",
        remove: "Eliminar",
        replace: "Reemplazar",
      },
      "welcome-messages": {
        title: "Mensajes de bienvenida",
        description:
          "Personaliza los mensajes de bienvenida que se muestran a tus usuarios. Solo los usuarios no administradores verán estos mensajes.",
        new: "Nuevo",
        system: "sistema",
        user: "usuario",
        message: "mensaje",
        assistant: "Asistente de chat de AnythingLLM",
        "double-click": "Doble clic para editar...",
        save: "Guardar mensajes",
      },
      "browser-appearance": {
        title: "Apariencia del navegador",
        description:
          "Personaliza la apariencia de la pestaña y el título del navegador cuando la aplicación está abierta.",
        tab: {
          title: "Título",
          description:
            "Establece un título de pestaña personalizado cuando la aplicación está abierta en un navegador.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Usa un favicon personalizado para la pestaña del navegador.",
        },
      },
      "sidebar-footer": {
        title: "Elementos del pie de página de la barra lateral",
        description:
          "Personaliza los elementos del pie de página que se muestran en la parte inferior de la barra lateral.",
        icon: "Icono",
        link: "Enlace",
      },
      "render-html": {
        title: null,
        description: null,
      },
    },
  },
  api: {
    title: "Claves de API",
    description:
      "Las claves de API permiten al titular acceder y administrar programáticamente esta instancia de AnythingLLM.",
    link: "Leer la documentación de la API",
    generate: "Generar nueva clave de API",
    table: {
      key: "Clave de API",
      by: "Creado por",
      created: "Creado",
    },
  },
  llm: {
    title: "Preferencia de LLM",
    description:
      "Estas son las credenciales y la configuración de tu proveedor preferido de chat e incrustación de LLM. Es importante que estas claves estén actualizadas y sean correctas, de lo contrario, AnythingLLM no funcionará correctamente.",
    provider: "Proveedor de LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Punto de conexión del servicio de Azure",
        api_key: "Clave de API",
        chat_deployment_name: "Nombre de la implementación del chat",
        chat_model_token_limit: "Límite de tokens del modelo de chat",
        model_type: "Tipo de modelo",
        default: "Predeterminado",
        reasoning: "Razonamiento",
        model_type_tooltip: null,
      },
    },
  },
  transcription: {
    title: "Preferencia del modelo de transcripción",
    description:
      "Estas son las credenciales y la configuración de tu proveedor de modelo de transcripción preferido. Es importante que estas claves estén actualizadas y sean correctas, de lo contrario, los archivos multimedia y el audio no se transcribirán.",
    provider: "Proveedor de transcripción",
    "warn-start":
      "El uso del modelo local de Whisper en máquinas con RAM o CPU limitadas puede detener AnythingLLM al procesar archivos multimedia.",
    "warn-recommend":
      "Recomendamos al menos 2 GB de RAM y subir archivos de menos de 10 MB.",
    "warn-end":
      "El modelo integrado se descargará automáticamente en el primer uso.",
  },
  embedding: {
    title: "Preferencia de incrustación",
    "desc-start":
      "Cuando se utiliza un LLM que no admite de forma nativa un motor de incrustación, es posible que debas especificar credenciales adicionales para la incrustación de texto.",
    "desc-end":
      "La incrustación es el proceso de convertir texto en vectores. Estas credenciales son necesarias para convertir tus archivos y prompts en un formato que AnythingLLM pueda usar para procesar.",
    provider: {
      title: "Proveedor de incrustación",
    },
  },
  text: {
    title: "Preferencias de división de texto y fragmentación",
    "desc-start":
      "A veces, es posible que desees cambiar la forma predeterminada en que se dividen y fragmentan los nuevos documentos antes de insertarlos en tu base de datos vectorial.",
    "desc-end":
      "Solo debes modificar esta configuración si comprendes cómo funciona la división de texto y sus efectos secundarios.",
    size: {
      title: "Tamaño del fragmento de texto",
      description:
        "Esta es la longitud máxima de caracteres que puede estar presente en un solo vector.",
      recommend: "La longitud máxima del modelo de incrustación es",
    },
    overlap: {
      title: "Superposición de fragmentos de texto",
      description:
        "Esta es la superposición máxima de caracteres que se produce durante la fragmentación entre dos fragmentos de texto adyacentes.",
    },
  },
  vector: {
    title: "Base de datos vectorial",
    description:
      "Estas son las credenciales y la configuración de cómo funcionará tu instancia de AnythingLLM. Es importante que estas claves estén actualizadas y sean correctas.",
    provider: {
      title: "Proveedor de base de datos vectorial",
      description: "No se necesita configuración para LanceDB.",
    },
  },
  embeddable: {
    title: "Widgets de chat incrustables",
    description:
      "Los widgets de chat incrustables son interfaces de chat de cara al público que están vinculadas a un único espacio de trabajo. Estos te permiten crear espacios de trabajo que luego puedes publicar para todo el mundo.",
    create: "Crear incrustación",
    table: {
      workspace: "Espacio de trabajo",
      chats: "Chats enviados",
      active: "Dominios activos",
      created: "Creado",
    },
  },
  "embed-chats": {
    title: "Historial de chat incrustado",
    export: "Exportar",
    description:
      "Estos son todos los chats y mensajes grabados de cualquier incrustación que hayas publicado.",
    table: {
      embed: "Incrustación",
      sender: "Remitente",
      message: "Mensaje",
      response: "Respuesta",
      at: "Enviado el",
    },
  },
  event: {
    title: "Registros de eventos",
    description:
      "Ve todas las acciones y eventos que ocurren en esta instancia para su supervisión.",
    clear: "Borrar registros de eventos",
    table: {
      type: "Tipo de evento",
      user: "Usuario",
      occurred: "Ocurrido el",
    },
  },
  privacy: {
    title: "Privacidad y manejo de datos",
    description:
      "Esta es tu configuración sobre cómo los proveedores de terceros conectados y AnythingLLM manejan tus datos.",
    llm: "Selección de LLM",
    embedding: "Preferencia de incrustación",
    vector: "Base de datos vectorial",
    anonymous: "Telemetría anónima habilitada",
  },
  connectors: {
    "search-placeholder": "Buscar conectores de datos",
    "no-connectors": "No se encontraron conectores de datos.",
    obsidian: {
      name: "Obsidian",
      description: "Importa el vault de Obsidian con un solo clic.",
      vault_location: "Ubicación del vault",
      vault_description:
        "Selecciona la carpeta de tu vault de Obsidian para importar todas las notas y sus conexiones.",
      selected_files: "Se encontraron {{count}} archivos markdown",
      importing: "Importando vault...",
      import_vault: "Importar vault",
      processing_time:
        "Esto puede llevar un tiempo dependiendo del tamaño de tu vault.",
      vault_warning:
        "Para evitar conflictos, asegúrate de que tu vault de Obsidian no esté abierto actualmente.",
    },
    github: {
      name: "Repositorio de GitHub",
      description:
        "Importa un repositorio completo de GitHub, público o privado, con un solo clic.",
      URL: "URL del repositorio de GitHub",
      URL_explained: "URL del repositorio de GitHub que deseas recopilar.",
      token: "Token de acceso de GitHub",
      optional: "opcional",
      token_explained:
        "Token de acceso para evitar la limitación de velocidad.",
      token_explained_start: "Sin un ",
      token_explained_link1: "Token de acceso personal",
      token_explained_middle:
        ", la API de GitHub puede limitar el número de archivos que se pueden recopilar debido a los límites de velocidad. Puedes ",
      token_explained_link2: "crear un token de acceso temporal",
      token_explained_end: " para evitar este problema.",
      ignores: "Archivos ignorados",
      git_ignore:
        "Lista en formato .gitignore para ignorar archivos específicos durante la recopilación. Presiona Intro después de cada entrada que quieras guardar.",
      task_explained:
        "Una vez completado, todos los archivos estarán disponibles para incrustar en los espacios de trabajo en el selector de documentos.",
      branch: "Rama de la que deseas recopilar archivos.",
      branch_loading: "-- cargando ramas disponibles --",
      branch_explained: "Rama de la que deseas recopilar archivos.",
      token_information:
        "Sin completar el <b>Token de acceso de GitHub</b>, este conector de datos solo podrá recopilar los archivos de <b>nivel superior</b> del repositorio debido a los límites de velocidad de la API pública de GitHub.",
      token_personal:
        "Obtén un token de acceso personal gratuito con una cuenta de GitHub aquí.",
    },
    gitlab: {
      name: "Repositorio de GitLab",
      description:
        "Importa un repositorio completo de GitLab, público o privado, con un solo clic.",
      URL: "URL del repositorio de GitLab",
      URL_explained: "URL del repositorio de GitLab que deseas recopilar.",
      token: "Token de acceso de GitLab",
      optional: "opcional",
      token_explained:
        "Token de acceso para evitar la limitación de velocidad.",
      token_description:
        "Selecciona entidades adicionales para obtener de la API de GitLab.",
      token_explained_start: "Sin un ",
      token_explained_link1: "Token de acceso personal",
      token_explained_middle:
        ", la API de GitLab puede limitar el número de archivos que se pueden recopilar debido a los límites de velocidad. Puedes ",
      token_explained_link2: "crear un token de acceso temporal",
      token_explained_end: " para evitar este problema.",
      fetch_issues: "Obtener issues como documentos",
      ignores: "Archivos ignorados",
      git_ignore:
        "Lista en formato .gitignore para ignorar archivos específicos durante la recopilación. Presiona Intro después de cada entrada que quieras guardar.",
      task_explained:
        "Una vez completado, todos los archivos estarán disponibles para incrustar en los espacios de trabajo en el selector de documentos.",
      branch: "Rama de la que deseas recopilar archivos",
      branch_loading: "-- cargando ramas disponibles --",
      branch_explained: "Rama de la que deseas recopilar archivos.",
      token_information:
        "Sin completar el <b>Token de acceso de GitLab</b>, este conector de datos solo podrá recopilar los archivos de <b>nivel superior</b> del repositorio debido a los límites de velocidad de la API pública de GitLab.",
      token_personal:
        "Obtén un token de acceso personal gratuito con una cuenta de GitLab aquí.",
    },
    youtube: {
      name: "Transcripción de YouTube",
      description:
        "Importa la transcripción de un vídeo completo de YouTube desde un enlace.",
      URL: "URL del vídeo de YouTube",
      URL_explained_start:
        "Introduce la URL de cualquier vídeo de YouTube para obtener su transcripción. El vídeo debe tener ",
      URL_explained_link: "subtítulos",
      URL_explained_end: " disponibles.",
      task_explained:
        "Una vez completada, la transcripción estará disponible para incrustar en los espacios de trabajo en el selector de documentos.",
      language: "Idioma de la transcripción",
      language_explained:
        "Selecciona el idioma de la transcripción que deseas recopilar.",
      loading_languages: "-- cargando idiomas disponibles --",
    },
    "website-depth": {
      name: "Extractor de enlaces en masa",
      description:
        "Extrae un sitio web y sus subenlaces hasta una cierta profundidad.",
      URL: "URL del sitio web",
      URL_explained: "URL del sitio web que deseas extraer.",
      depth: "Profundidad de rastreo",
      depth_explained:
        "Este es el número de enlaces secundarios que el trabajador debe seguir desde la URL de origen.",
      max_pages: "Páginas máximas",
      max_pages_explained: "Número máximo de enlaces a extraer.",
      task_explained:
        "Una vez completado, todo el contenido extraído estará disponible para incrustar en los espacios de trabajo en el selector de documentos.",
    },
    confluence: {
      name: "Confluence",
      description:
        "Importa una página completa de Confluence con un solo clic.",
      deployment_type: "Tipo de implementación de Confluence",
      deployment_type_explained:
        "Determina si tu instancia de Confluence está alojada en la nube de Atlassian o es autohospedada.",
      base_url: "URL base de Confluence",
      base_url_explained: "Esta es la URL base de tu espacio de Confluence.",
      space_key: "Clave del espacio de Confluence",
      space_key_explained:
        "Esta es la clave de los espacios de tu instancia de Confluence que se utilizará. Generalmente comienza con ~",
      username: "Nombre de usuario de Confluence",
      username_explained: "Tu nombre de usuario de Confluence",
      auth_type: "Tipo de autenticación de Confluence",
      auth_type_explained:
        "Selecciona el tipo de autenticación que deseas usar para acceder a tus páginas de Confluence.",
      auth_type_username: "Nombre de usuario y token de acceso",
      auth_type_personal: "Token de acceso personal",
      token: "Token de acceso de Confluence",
      token_explained_start:
        "Necesitas proporcionar un token de acceso para la autenticación. Puedes generar un token de acceso",
      token_explained_link: "aquí",
      token_desc: "Token de acceso para la autenticación",
      pat_token: "Token de acceso personal de Confluence",
      pat_token_explained: "Tu token de acceso personal de Confluence.",
      task_explained:
        "Una vez completado, el contenido de la página estará disponible para incrustar en los espacios de trabajo en el selector de documentos.",
      bypass_ssl: null,
      bypass_ssl_explained: null,
    },
    manage: {
      documents: "Documentos",
      "data-connectors": "Conectores de datos",
      "desktop-only":
        "La edición de esta configuración solo está disponible en un dispositivo de escritorio. Accede a esta página en tu escritorio para continuar.",
      dismiss: "Descartar",
      editing: "Editando",
    },
    directory: {
      "my-documents": "Mis documentos",
      "new-folder": "Nueva carpeta",
      "search-document": "Buscar documento",
      "no-documents": "Sin documentos",
      "move-workspace": "Mover al espacio de trabajo",
      name: "Nombre",
      "delete-confirmation":
        "¿Estás seguro de que quieres eliminar estos archivos y carpetas?\nEsto eliminará los archivos del sistema y los eliminará de cualquier espacio de trabajo existente automáticamente.\nEsta acción no es reversible.",
      "removing-message":
        "Eliminando {{count}} documentos y {{folderCount}} carpetas. Por favor, espera.",
      "move-success": "Se movieron {{count}} documentos con éxito.",
      date: "Fecha",
      type: "Tipo",
      no_docs: "Sin documentos",
      select_all: "Seleccionar todo",
      deselect_all: "Deseleccionar todo",
      remove_selected: "Eliminar seleccionados",
      costs: "*Costo único por incrustaciones",
      save_embed: "Guardar e incrustar",
    },
    upload: {
      "processor-offline": "Procesador de documentos no disponible",
      "processor-offline-desc":
        "No podemos subir tus archivos en este momento porque el procesador de documentos no está disponible. Por favor, inténtalo de nuevo más tarde.",
      "click-upload": "Haz clic para subir o arrastra y suelta",
      "file-types":
        "¡soporta archivos de texto, csv, hojas de cálculo, archivos de audio y más!",
      "or-submit-link": "o envía un enlace",
      "placeholder-link": "https://ejemplo.com",
      fetching: "Obteniendo...",
      "fetch-website": "Obtener sitio web",
      "privacy-notice":
        "Estos archivos se subirán al procesador de documentos que se ejecuta en esta instancia de AnythingLLM. Estos archivos no se envían ni se comparten con terceros.",
    },
    pinning: {
      what_pinning: "¿Qué es fijar documentos?",
      pin_explained_block1:
        "Cuando <b>fijas</b> un documento en AnythingLLM, inyectaremos todo el contenido del documento en tu ventana de prompt para que tu LLM lo comprenda por completo.",
      pin_explained_block2:
        "Esto funciona mejor con <b>modelos de gran contexto</b> o archivos pequeños que son críticos para su base de conocimientos.",
      pin_explained_block3:
        "Si no obtienes las respuestas que deseas de AnythingLLM por defecto, fijar es una excelente manera de obtener respuestas de mayor calidad con un clic.",
      accept: "Ok, entendido",
    },
    watching: {
      what_watching: "¿Qué hace observar un documento?",
      watch_explained_block1:
        "Cuando <b>observas</b> un documento en AnythingLLM, sincronizaremos <i>automáticamente</i> el contenido de tu documento desde su fuente original a intervalos regulares. Esto actualizará automáticamente el contenido en cada espacio de trabajo donde se gestione este archivo.",
      watch_explained_block2:
        "Esta función actualmente admite contenido en línea y no estará disponible para documentos subidos manualmente.",
      watch_explained_block3_start:
        "Puedes administrar qué documentos se observan desde la vista de administrador del ",
      watch_explained_block3_link: "Administrador de archivos",
      watch_explained_block3_end: ".",
      accept: "Ok, entendido",
    },
  },
  chat_window: {
    welcome: "Bienvenido a tu nuevo espacio de trabajo.",
    get_started: "Para comenzar, puedes",
    get_started_default: "Para comenzar",
    upload: "subir un documento",
    or: "o",
    attachments_processing:
      "Los archivos adjuntos se están procesando. Por favor, espera...",
    send_chat: "enviar un chat.",
    send_message: "Enviar un mensaje",
    attach_file: "Adjuntar un archivo a este chat",
    slash: "Ver todos los comandos de barra disponibles para chatear.",
    agents: "Ver todos los agentes disponibles que puedes usar para chatear.",
    text_size: "Cambiar tamaño del texto.",
    microphone: "Habla tu prompt.",
    send: "Enviar mensaje de prompt al espacio de trabajo",
    tts_speak_message: "Mensaje de voz TTS",
    copy: "Copiar",
    regenerate: "Regenerar",
    regenerate_response: "Regenerar respuesta",
    good_response: "Buena respuesta",
    more_actions: "Más acciones",
    hide_citations: "Ocultar citas",
    show_citations: "Mostrar citas",
    pause_tts_speech_message: "Pausar el mensaje de voz TTS",
    fork: "Bifurcar",
    delete: "Eliminar",
    save_submit: "Guardar y enviar",
    cancel: "Cancelar",
    edit_prompt: "Editar prompt",
    edit_response: "Editar respuesta",
    at_agent: "@agente",
    default_agent_description:
      " - el agente predeterminado para este espacio de trabajo.",
    custom_agents_coming_soon: "¡los agentes personalizados llegarán pronto!",
    slash_reset: "/reiniciar",
    preset_reset_description:
      "Borra tu historial de chat y comienza un nuevo chat",
    add_new_preset: " Agregar nuevo preajuste",
    command: "Comando",
    your_command: "tu-comando",
    placeholder_prompt:
      "Este es el contenido que se inyectará delante de tu prompt.",
    description: "Descripción",
    placeholder_description: "Responde con un poema sobre los LLMs.",
    save: "Guardar",
    small: "Pequeño",
    normal: "Normal",
    large: "Grande",
    workspace_llm_manager: {
      search: "Buscar proveedores de LLM",
      loading_workspace_settings:
        "Cargando la configuración del espacio de trabajo...",
      available_models: "Modelos disponibles para {{provider}}",
      available_models_description:
        "Selecciona un modelo para usar en este espacio de trabajo.",
      save: "Usar este modelo",
      saving:
        "Estableciendo el modelo como predeterminado del espacio de trabajo...",
      missing_credentials: "¡A este proveedor le faltan credenciales!",
      missing_credentials_description:
        "Haz clic para configurar las credenciales",
    },
  },
  profile_settings: {
    edit_account: "Editar cuenta",
    profile_picture: "Foto de perfil",
    remove_profile_picture: "Eliminar foto de perfil",
    username: "Nombre de usuario",
    username_description:
      "El nombre de usuario solo debe contener letras minúsculas, números, guiones bajos y guiones sin espacios",
    new_password: "Nueva contraseña",
    password_description: "La contraseña debe tener al menos 8 caracteres",
    cancel: "Cancelar",
    update_account: "Actualizar cuenta",
    theme: "Preferencia de tema",
    language: "Idioma preferido",
    failed_upload: "Error al subir la foto de perfil: {{error}}",
    upload_success: "Foto de perfil subida.",
    failed_remove: "Error al eliminar la foto de perfil: {{error}}",
    profile_updated: "Perfil actualizado.",
    failed_update_user: "Error al actualizar el usuario: {{error}}",
    account: "Cuenta",
    support: "Soporte",
    signout: "Cerrar sesión",
  },
  "keyboard-shortcuts": {
    title: "Atajos de teclado",
    shortcuts: {
      settings: "Abrir configuración",
      workspaceSettings: "Abrir configuración del espacio de trabajo actual",
      home: "Ir a Inicio",
      workspaces: "Administrar espacios de trabajo",
      apiKeys: "Configuración de claves de API",
      llmPreferences: "Preferencias de LLM",
      chatSettings: "Configuración del chat",
      help: "Mostrar ayuda de atajos de teclado",
      showLLMSelector: "Mostrar selector de LLM del espacio de trabajo",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "¡Éxito!",
        success_description:
          "¡Tu prompt del sistema ha sido publicado en el Centro de la Comunidad!",
        success_thank_you: "¡Gracias por compartir con la Comunidad!",
        view_on_hub: "Ver en el Centro de la Comunidad",
        modal_title: "Publicar prompt del sistema",
        name_label: "Nombre",
        name_description:
          "Este es el nombre para mostrar de tu prompt del sistema.",
        name_placeholder: "Mi prompt del sistema",
        description_label: "Descripción",
        description_description:
          "Esta es la descripción de tu prompt del sistema. Úsala para describir el propósito de tu prompt del sistema.",
        tags_label: "Etiquetas",
        tags_description:
          "Las etiquetas se utilizan para identificar tu prompt del sistema para una búsqueda más fácil. Puedes agregar varias etiquetas. Máximo 5 etiquetas. Máximo 20 caracteres por etiqueta.",
        tags_placeholder: "Escribe y presiona Enter para agregar etiquetas",
        visibility_label: "Visibilidad",
        public_description:
          "Los prompts del sistema públicos son visibles para todos.",
        private_description:
          "Los prompts del sistema privados solo son visibles para ti.",
        publish_button: "Publicar en el Centro de la Comunidad",
        submitting: "Publicando...",
        submit: "Publicar en el Centro de la Comunidad",
        prompt_label: "Prompt",
        prompt_description:
          "Este es el prompt del sistema real que se utilizará para guiar al LLM.",
        prompt_placeholder: "Ingresa tu prompt del sistema aquí...",
      },
      agent_flow: {
        public_description:
          "Los flujos de agente públicos son visibles para todos.",
        private_description:
          "Los flujos de agente privados solo son visibles para ti.",
        success_title: "¡Éxito!",
        success_description:
          "¡Tu flujo de agente ha sido publicado en el Centro de la Comunidad!",
        success_thank_you: "¡Gracias por compartir con la Comunidad!",
        view_on_hub: "Ver en el Centro de la Comunidad",
        modal_title: "Publicar flujo de agente",
        name_label: "Nombre",
        name_description:
          "Este es el nombre para mostrar de tu flujo de agente.",
        name_placeholder: "Mi flujo de agente",
        description_label: "Descripción",
        description_description:
          "Esta es la descripción de tu flujo de agente. Úsala para describir el propósito de tu flujo de agente.",
        tags_label: "Etiquetas",
        tags_description:
          "Las etiquetas se utilizan para identificar tu flujo de agente para una búsqueda más fácil. Puedes agregar varias etiquetas. Máximo 5 etiquetas. Máximo 20 caracteres por etiqueta.",
        tags_placeholder: "Escribe y presiona Enter para agregar etiquetas",
        visibility_label: "Visibilidad",
        publish_button: "Publicar en el Centro de la Comunidad",
        submitting: "Publicando...",
        submit: "Publicar en el Centro de la Comunidad",
        privacy_note:
          "Los flujos de agente siempre se suben como privados para proteger cualquier dato sensible. Puedes cambiar la visibilidad en el Centro de la Comunidad después de publicar. Por favor, verifica que tu flujo no contenga ninguna información sensible o privada antes de publicar.",
      },
      slash_command: {
        success_title: "¡Éxito!",
        success_description:
          "¡Tu comando de barra ha sido publicado en el Centro de la Comunidad!",
        success_thank_you: "¡Gracias por compartir con la Comunidad!",
        view_on_hub: "Ver en el Centro de la Comunidad",
        modal_title: "Publicar comando de barra",
        name_label: "Nombre",
        name_description:
          "Este es el nombre para mostrar de tu comando de barra.",
        name_placeholder: "Mi comando de barra",
        description_label: "Descripción",
        description_description:
          "Esta es la descripción de tu comando de barra. Úsala para describir el propósito de tu comando de barra.",
        command_label: "Comando",
        command_description:
          "Este es el comando de barra que los usuarios escribirán para activar este preajuste.",
        command_placeholder: "mi-comando",
        tags_label: "Etiquetas",
        tags_description:
          "Las etiquetas se utilizan para identificar tu comando de barra para una búsqueda más fácil. Puedes agregar varias etiquetas. Máximo 5 etiquetas. Máximo 20 caracteres por etiqueta.",
        tags_placeholder: "Escribe y presiona Enter para agregar etiquetas",
        visibility_label: "Visibilidad",
        public_description:
          "Los comandos de barra públicos son visibles para todos.",
        private_description:
          "Los comandos de barra privados solo son visibles para ti.",
        publish_button: "Publicar en el Centro de la Comunidad",
        submitting: "Publicando...",
        prompt_label: "Prompt",
        prompt_description:
          "Este es el prompt que se utilizará cuando se active el comando de barra.",
        prompt_placeholder: "Ingresa tu prompt aquí...",
      },
      generic: {
        unauthenticated: {
          title: "Se requiere autenticación",
          description:
            "Necesitas autenticarte con el Centro de la Comunidad de AnythingLLM antes de publicar elementos.",
          button: "Conectar al Centro de la Comunidad",
        },
      },
    },
  },
  security: {
    title: "Seguridad",
    multiuser: {
      title: "Modo multiusuario",
      description:
        "Configura tu instancia para que sea compatible con tu equipo activando el modo multiusuario.",
      enable: {
        "is-enable": "El modo multiusuario está habilitado",
        enable: "Habilitar modo multiusuario",
        description:
          "Por defecto, serás el único administrador. Como administrador, deberás crear cuentas para todos los nuevos usuarios o administradores. No pierdas tu contraseña, ya que solo un usuario administrador puede restablecer las contraseñas.",
        username: "Nombre de usuario de la cuenta de administrador",
        password: "Contraseña de la cuenta de administrador",
      },
    },
    password: {
      title: "Protección con contraseña",
      description:
        "Protege tu instancia de AnythingLLM con una contraseña. Si la olvidas, no hay método de recuperación, así que asegúrate de guardar esta contraseña.",
      "password-label": "Contraseña de la instancia",
    },
  },
  home: {
    welcome: "Bienvenido",
    chooseWorkspace: "Elige un espacio de trabajo para comenzar a chatear!",
    notAssigned:
      "Actualmente no estás asignado a ningún espacio de trabajo.\nPor favor, contacta a tu administrador para solicitar acceso a un espacio de trabajo.",
    goToWorkspace: 'Ir a "{{workspace}}"',
  },
};

export default TRANSLATIONS;
