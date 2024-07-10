const TRANSLATIONS = {
  common: {
    "workspaces-name": "Nome do Ambiente",
    error: "Erro",
    success: "Sucesso",
    user: "Usuário",
    selection: "Seleção do Modelo",
    saving: "Salvando...",
    save: "Salvar alterações",
    previous: "Página Anterior",
    next: "Próxima Página",
  },

  // Itens do menu lateral de configurações.
  settings: {
    title: "Configurações da Instância",
    system: "Preferências do Sistema",
    invites: "Convites",
    users: "Usuários",
    workspaces: "Ambientes",
    "workspace-chats": "Chat do Ambiente",
    appearance: "Aparência",
    "api-keys": "Chaves de API",
    llm: "Preferência de LLM",
    transcription: "Modelo de Transcrição",
    embedder: "Preferências de Embedding",
    "text-splitting": "Divisão e Agrupamento de Texto",
    "vector-database": "Banco de Dados Vetorial",
    embeds: "Widgets de Incorporação de Chat",
    "embed-chats": "Histórico de Incorporação de Chat",
    security: "Segurança",
    "event-logs": "Logs de Eventos",
    privacy: "Privacidade & Dados",
  },

  // Definições de Páginas
  login: {
    "multi-user": {
      welcome: "Bem-vindo ao",
      "placeholder-username": "Nome de Usuário",
      "placeholder-password": "Senha",
      login: "Entrar",
      validating: "Validando...",
      "forgot-pass": "Esqueceu a senha",
      reset: "Redefinir",
    },
    "sign-in": {
      start: "Faça login na sua",
      end: "conta.",
    },
  },

  // Itens do menu de configurações do ambiente
  "workspaces—settings": {
    general: "Configurações Gerais",
    chat: "Configurações de Chat",
    vector: "Banco de Dados Vetorial",
    members: "Membros",
    agent: "Configuração do Agente",
  },

  // Aparência Geral
  general: {
    vector: {
      title: "Contagem de Vetores",
      description: "Número total de vetores no seu banco de dados vetorial.",
    },
    names: {
      description: "Isso só mudará o nome de exibição do seu ambiente.",
    },
    message: {
      title: "Mensagens de Chat Sugeridas",
      description:
        "Personalize as mensagens que serão sugeridas aos usuários do seu ambiente.",
      add: "Adicionar nova mensagem",
      save: "Salvar Mensagens",
      heading: "Explique para mim",
      body: "os benefícios do AnythingLLM",
    },
    pfp: {
      title: "Imagem de Perfil do Assistente",
      description:
        "Personalize a imagem de perfil do assistente para este ambiente.",
      image: "Imagem do Ambiente",
      remove: "Remover Imagem do Ambiente",
    },
    delete: {
      title: "Deletar Ambiente",
      description:
        "Exclua este ambiente e todos os seus dados. Isso excluirá o ambiente para todos os usuários.",
      delete: "Deletar Ambiente",
      deleting: "Excluindo Ambiente...",
      "confirm-start": "Você está prestes a excluir todo o seu",
      "confirm-end":
        "ambiente. Isso removerá todas as embeddings vetoriais no seu banco de dados vetorial.\n\nOs arquivos de origem originais permanecerão intocados. Esta ação é irreversível.",
    },
  },

  // Configurações de Chat
  chat: {
    llm: {
      title: "Provedor de LLM do Ambiente",
      description:
        "O provedor de LLM específico e o modelo que será usado para este ambiente. Por padrão, usa o provedor e as configurações do sistema.",
      search: "Pesquisar todos os provedores de LLM",
    },
    model: {
      title: "Modelo de Chat do Ambiente",
      description:
        "O modelo de chat específico que será usado para este ambiente. Se vazio, usará a preferência de LLM do sistema.",
      wait: "-- aguardando modelos --",
    },
    mode: {
      title: "Modo de Chat",
      chat: {
        title: "Chat",
        "desc-start": "fornecerá respostas com o conhecimento geral do LLM",
        and: "e",
        "desc-end": "contexto do documento encontrado.",
      },
      query: {
        title: "Consulta",
        "desc-start": "fornecerá respostas",
        only: "somente",
        "desc-end": "se o contexto do documento for encontrado.",
      },
    },
    history: {
      title: "Histórico de Chat",
      "desc-start":
        "O número de chats anteriores que serão incluídos na memória de curto prazo da resposta.",
      recommend: "Recomenda-se 20.",
      "desc-end":
        "Qualquer valor acima de 45 pode levar a falhas contínuas no chat, dependendo do tamanho da mensagem.",
    },
    prompt: {
      title: "Prompt",
      description:
        "O prompt que será usado neste ambiente. Defina o contexto e as instruções para que a IA gere uma resposta. Você deve fornecer um prompt bem elaborado para que a IA possa gerar uma resposta relevante e precisa.",
    },
    refusal: {
      title: "Resposta de Recusa no Modo de Consulta",
      "desc-start": "Quando no modo de",
      query: "consulta",
      "desc-end":
        ", você pode querer retornar uma resposta de recusa personalizada quando nenhum contexto for encontrado.",
    },
    temperature: {
      title: "Temperatura do LLM",
      "desc-start":
        "Esta configuração controla o quão 'criativas' serão as respostas do seu LLM.",
      "desc-end":
        "Quanto maior o número, mais criativa será a resposta. Para alguns modelos, isso pode levar a respostas incoerentes se configurado muito alto.",
      hint: "A maioria dos LLMs tem vários intervalos aceitáveis de valores válidos. Consulte o seu provedor de LLM para essa informação.",
    },
  },

  // Banco de Dados Vetorial
  "vector-workspace": {
    identifier: "Identificador do banco de dados vetorial",
    snippets: {
      title: "Máximo de Trechos de Contexto",
      description:
        "Esta configuração controla a quantidade máxima de trechos de contexto que serão enviados ao LLM por chat ou consulta.",
      recommend: "Recomendado: 4",
    },
    doc: {
      title: "Limite de Similaridade do Documento",
      description:
        "A pontuação mínima de similaridade necessária para que uma fonte seja considerada relacionada ao chat. Quanto maior o número, mais semelhante a fonte deve ser ao chat.",
      zero: "Sem restrição",
      low: "Baixa (pontuação de similaridade ≥ .25)",
      medium: "Média (pontuação de similaridade ≥ .50)",
      high: "Alta (pontuação de similaridade ≥ .75)",
    },
    reset: {
      reset: "Redefinir Banco de Dados Vetorial",
      resetting: "Limpando vetores...",
      confirm:
        "Você está prestes a redefinir o banco de dados vetorial deste ambiente. Isso removerá todas as embeddings vetoriais atualmente embutidas.\n\nOs arquivos de origem originais permanecerão intocados. Esta ação é irreversível.",
      error: "O banco de dados vetorial do ambiente não pôde ser redefinido!",
      success: "O banco de dados vetorial do ambiente foi redefinido!",
    },
  },

  // Configuração do Agente
  agent: {
    "performance-warning":
      "O desempenho dos LLMs que não suportam explicitamente a chamada de ferramentas depende muito das capacidades e da precisão do modelo. Algumas habilidades podem ser limitadas ou não funcionais.",
    provider: {
      title: "Provedor de LLM do Agente do Ambiente",
      description:
        "O provedor de LLM específico e o modelo que será usado para o agente @agent deste ambiente.",
    },
    mode: {
      chat: {
        title: "Modelo de Chat do Agente do Ambiente",
        description:
          "O modelo de chat específico que será usado para o agente @agent deste ambiente.",
      },
      title: "Modelo do Agente do Ambiente",
      description:
        "O modelo LLM específico que será usado para o agente @agent deste ambiente.",
      wait: "-- aguardando modelos --",
    },

    skill: {
      title: "Habilidades Padrão do Agente",
      description:
        "Melhore as habilidades naturais do agente padrão com essas habilidades pré-construídas. Esta configuração se aplica a todos os ambientes.",
      rag: {
        title: "RAG & memória de longo prazo",
        description:
          "Permita que o agente utilize seus documentos locais para responder a uma consulta ou peça ao agente para 'lembrar' de partes do conteúdo para recuperação de memória de longo prazo.",
      },
      view: {
        title: "Visualizar & resumir documentos",
        description:
          "Permita que o agente liste e resuma o conteúdo dos arquivos do ambiente atualmente embutidos.",
      },
      scrape: {
        title: "Raspar websites",
        description:
          "Permita que o agente visite e raspe o conteúdo de websites.",
      },
      generate: {
        title: "Gerar gráficos & imagens",
        description:
          "Permita que o agente utilize plugins para gerar gráficos e imagens.",
      },
      save: {
        title: null,
        description: null,
      },
      web: {
        title: null,
        "desc-start": null,
        "desc-end": null,
      },
    },
  },

  // Workspace Chats
  recorded: {
    title: null,
    description: null,
    export: null,
    table: {
      id: null,
      by: null,
      workspace: null,
      prompt: null,
      response: null,
      at: null,
    },
  },

  // Appearance
  appearance: {
    title: null,
    description: null,
    logo: {
      title: null,
      description: null,
      add: null,
      recommended: null,
      remove: null,
      replace: null,
    },
    message: {
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
    icons: {
      title: null,
      description: null,
      icon: null,
      link: null,
    },
  },

  // API Keys
  api: {
    title: null,
    description: null,
    link: null,
    generate: null,
    table: {
      key: null,
      by: null,
      created: null,
    },
  },

  llm: {
    title: null,
    description: null,
    provider: null,
  },

  transcription: {
    title: null,
    description: null,
    provider: null,
    "warn-start": null,
    "warn-recommend": null,
    "warn-end": null,
  },

  embedding: {
    title: null,
    "desc-start": null,
    "desc-end": null,
    provider: {
      title: null,
      description: null,
    },
  },

  text: {
    title: null,
    "desc-start": null,
    "desc-end": null,
    "warn-start": null,
    "warn-center": null,
    "warn-end": null,
    size: {
      title: null,
      description: null,
      recommend: null,
    },
    overlap: {
      title: null,
      description: null,
    },
  },

  vector: {
    title: null,
    description: null,
    provider: {
      title: null,
      description: null,
    },
  },

  embeddable: {
    title: null,
    description: null,
    create: null,
    table: {
      workspace: null,
      chats: null,
      Active: null,
    },
  },

  "embed-chats": {
    title: null,
    description: null,
    table: {
      embed: null,
      sender: null,
      message: null,
      response: null,
      at: null,
    },
  },

  multi: {
    title: null,
    description: null,
    enable: {
      "is-enable": null,
      enable: null,
      description: null,
      username: null,
      password: null,
    },
    password: {
      title: null,
      description: null,
    },
    instance: {
      title: null,
      description: null,
      password: null,
    },
  },

  event: {
    title: null,
    description: null,
    clear: null,
    table: {
      type: null,
      user: null,
      occurred: null,
    },
  },

  privacy: {
    title: null,
    description: null,
    llm: null,
    embedding: null,
    vector: null,
    anonymous: null,
  },
};
export default TRANSLATIONS;
