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
};

export default TRANSLATIONS;
