// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Bem-vindo ao",
      getStarted: "Começar",
      welcome: "Bem-vindo",
    },
    llm: {
      title: "Preferência de LLM",
      description:
        "AnythingLLM funciona com vários provedores de LLM. Este será o serviço que lidará com os chats.",
    },
    userSetup: {
      title: "Configuração do Usuário",
      description: "Configure suas preferências de usuário.",
      howManyUsers: "Quantos usuários usarão esta instância?",
      justMe: "Apenas eu",
      myTeam: "Minha equipe",
      instancePassword: "Senha da Instância",
      setPassword: "Deseja configurar uma senha?",
      passwordReq: "Senhas devem ter pelo menos 8 caracteres.",
      passwordWarn:
        "É importante salvar esta senha pois não há método de recuperação.",
      adminUsername: "Nome de usuário admin",
      adminPassword: "Senha de admin",
      adminPasswordReq: "Senhas devem ter pelo menos 8 caracteres.",
      teamHint:
        "Por padrão, você será o único admin. Após a configuração, você poderá convidar outros usuários ou admins. Não perca sua senha, pois apenas admins podem redefini-la.",
    },
    data: {
      title: "Privacidade de Dados",
      description:
        "Estamos comprometidos com transparência e controle sobre seus dados pessoais.",
      settingsHint:
        "Estas configurações podem ser alteradas a qualquer momento.",
    },
    survey: {
      title: "Bem-vindo ao AnythingLLM",
      description: "Ajude-nos a melhorar o AnythingLLM. Opcional.",
      email: "Qual seu email?",
      useCase: "Como você usará o AnythingLLM?",
      useCaseWork: "Para trabalho",
      useCasePersonal: "Uso pessoal",
      useCaseOther: "Outro",
      comment: "Como você conheceu o AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, etc. - Conte como nos encontrou!",
      skip: "Pular Pesquisa",
      thankYou: "Obrigado pelo seu feedback!",
    },
  },
  common: {
    "workspaces-name": "Nome do Workspace",
    selection: "Seleção de Modelo",
    saving: "Salvando...",
    save: "Salvar alterações",
    previous: "Página Anterior",
    next: "Próxima Página",
    optional: "Opcional",
    yes: "Sim",
    no: "Não",
    search: "Pesquisar",
    username_requirements:
      "O nome de usuário deve ter de 2 a 32 caracteres, começar com uma letra minúscula e conter apenas letras minúsculas, números, sublinhados, hífens e pontos.",
    on: "Sobre",
    none: "Nenhum",
    stopped: "Parado",
    loading: "Carregando",
    refresh: "Atualizar",
  },
  settings: {
    title: "Configurações da Instância",
    invites: "Convites",
    users: "Usuários",
    workspaces: "Workspaces",
    "workspace-chats": "Chats do Workspace",
    customization: "Personalização",
    interface: "Preferências de UI",
    branding: "Marca e Etiqueta Branca",
    chat: "Chat",
    "api-keys": "API de Desenvolvedor",
    llm: "LLM",
    transcription: "Transcrição",
    embedder: "Vinculador",
    "text-splitting": "Divisor de Texto",
    "voice-speech": "Voz e Fala",
    "vector-database": "Banco de Dados Vetorial",
    embeds: "Vinculador de Chat",
    security: "Segurança",
    "event-logs": "Logs de Eventos",
    privacy: "Privacidade e Dados",
    "ai-providers": "Provedores de IA",
    "agent-skills": "Habilidades de Agente",
    admin: "Admin",
    tools: "Ferramentas",
    "system-prompt-variables": "Variáveis de Prompt",
    "experimental-features": "Recursos Experimentais",
    contact: "Suporte",
    "browser-extension": "Extensão de Navegador",
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Centro Comunitário",
      trending: "Explore as tendências",
      "your-account": "Sua Conta",
      "import-item": "Importar Item",
    },
    channels: "Canais",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Bem-vindo ao",
      "placeholder-username": "Nome de usuário",
      "placeholder-password": "Senha",
      login: "Login",
      validating: "Validando...",
      "forgot-pass": "Esqueci a senha",
      reset: "Redefinir",
    },
    "sign-in": "Acesse sua {{appName}} conta.",
    "password-reset": {
      title: "Redefinição de Senha",
      description:
        "Forneça as informações necessárias para redefinir sua senha.",
      "recovery-codes": "Códigos de Recuperação",
      "back-to-login": "Voltar ao Login",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Criar um Agente",
      editWorkspace: "Editar o Espaço de Trabalho",
      uploadDocument: "Enviar um documento",
    },
    greeting: "Como posso ajudá-lo hoje?",
  },
  "new-workspace": {
    title: "Novo Workspace",
    placeholder: "Meu Workspace",
  },
  "workspaces—settings": {
    general: "Configurações Gerais",
    chat: "Configurações de Chat",
    vector: "Banco de Dados Vetorial",
    members: "Membros",
    agent: "Configuração de Agente",
  },
  general: {
    vector: {
      title: "Contagem de Vetores",
      description: "Número total de vetores no seu banco de dados.",
    },
    names: {
      description: "Isso altera apenas o nome exibido do seu workspace.",
    },
    message: {
      title: "Sugestões de Chat",
      description:
        "Personalize as mensagens sugeridas aos usuários do workspace.",
      add: "Adicionar mensagem",
      save: "Salvar Mensagens",
      heading: "Explique para mim",
      body: "os benefícios do AnythingLLM",
    },
    delete: {
      title: "Excluir Workspace",
      description:
        "Exclua este workspace e todos seus dados. Isso afetará todos os usuários.",
      delete: "Excluir Workspace",
      deleting: "Excluindo Workspace...",
      "confirm-start": "Você está prestes a excluir todo o",
      "confirm-end":
        "workspace. Isso removerá todos os vetores do banco de dados.\n\nOs arquivos originais permanecerão intactos. Esta ação é irreversível.",
    },
  },
  chat: {
    llm: {
      title: "Provedor de LLM",
      description:
        "O provedor e modelo específico que será usado neste workspace. Por padrão, usa as configurações do sistema.",
      search: "Buscar todos provedores",
    },
    model: {
      title: "Modelo de Chat",
      description:
        "O modelo específico para este workspace. Se vazio, usará a preferência do sistema.",
    },
    mode: {
      title: "Modo de Chat",
      chat: {
        title: "Chat",
        description:
          'fornecerá respostas com base no conhecimento geral do LLM e no contexto do documento encontrado.<br />Você precisará usar o comando "@agent" para utilizar as ferramentas.',
      },
      query: {
        title: "Consulta",
        description:
          "fornecerá respostas <b>apenas</b>, caso o contexto do documento seja encontrado.<br />Você precisará usar o comando @agent para utilizar as ferramentas.",
      },
      automatic: {
        title: "Automóvel",
        description:
          'usará automaticamente as ferramentas, caso o modelo e o provedor suportem a chamada de ferramentas nativas.<br />Se a chamada de ferramentas nativas não for suportada, você precisará usar o comando "@agent" para utilizar as ferramentas.',
      },
    },
    history: {
      title: "Histórico de Chat",
      "desc-start":
        "Número de chats anteriores que serão incluídos na memória de curto prazo.",
      recommend: "Recomendado: 20. ",
      "desc-end":
        "Valores acima de 45 podem causar falhas dependendo do tamanho das mensagens.",
    },
    prompt: {
      title: "Prompt de Sistema",
      description:
        "O prompt usado neste workspace. Defina o contexto e instruções para a IA gerar respostas relevantes e precisas.",
      history: {
        title: "Histórico de Prompts",
        clearAll: "Limpar Tudo",
        noHistory: "Nenhum histórico disponível",
        restore: "Restaurar",
        delete: "Excluir",
        deleteConfirm: "Tem certeza que deseja excluir este item?",
        clearAllConfirm:
          "Tem certeza que deseja limpar todo o histórico? Esta ação é irreversível.",
        expand: "Expandir",
        publish: "Publicar no Hub",
      },
    },
    refusal: {
      title: "Modo Resposta de recusa",
      "desc-start": "Quando",
      query: "consulta",
      "desc-end":
        "modo, você pode definir uma resposta personalizada quando nenhum contexto for encontrado.",
      "tooltip-title": "Resposta de Recusa",
      "tooltip-description":
        "Configure uma mensagem personalizada quando o sistema não conseguir responder baseado no contexto disponível.",
    },
    temperature: {
      title: "Temperatura do LLM",
      "desc-start": 'Controla o nível de "criatividade" das respostas.',
      "desc-end":
        "Valores mais altos geram respostas mais criativas, mas para alguns modelos podem se tornar incoerentes.",
      hint: "Cada modelo LLM tem faixas de valores válidos. Consulte seu provedor.",
    },
  },
  "vector-workspace": {
    identifier: "Identificador do banco de dados",
    snippets: {
      title: "Máximo de Trechos",
      description:
        "Controla a quantidade máxima de trechos de contexto enviados ao LLM por chat.",
      recommend: "Recomendado: 4",
    },
    doc: {
      title: "Limiar de similaridade",
      description:
        "Pontuação mínima para uma fonte ser considerada relevante para o chat. Valores mais altos exigem maior similaridade.",
      zero: "Sem restrição",
      low: "Baixo (≥ .25)",
      medium: "Médio (≥ .50)",
      high: "Alto (≥ .75)",
    },
    reset: {
      reset: "Resetar Banco de Dados",
      resetting: "Limpando vetores...",
      confirm:
        "Você está prestes a resetar o banco de dados deste workspace. Isso removerá todos os vetores atuais.\n\nOs arquivos originais permanecerão intactos. Esta ação é irreversível.",
      error: "Falha ao resetar o banco de dados!",
      success: "Banco de dados resetado com sucesso!",
    },
  },
  agent: {
    "performance-warning":
      "O desempenho de LLMs sem suporte a tool-calling varia conforme as capacidades do modelo. Algumas funcionalidades podem ser limitadas.",
    provider: {
      title: "Provedor LLM de Agente de Workspace",
      description:
        "O provedor LLM e modelo específico que será usado por este agente @agent deste workspace.",
    },
    mode: {
      chat: {
        title: "Modelo de Chat para Agente de workspace",
        description:
          "O modelo de chat específico para o agente @agent deste workspace.",
      },
      title: "Modelo para Agente de workspace",
      description:
        "O modelo LLM específico que será usado pelo agente @agent deste workspace.",
      wait: "-- aguardando modelos --",
    },
    skill: {
      rag: {
        title: "RAG & memória longa duração",
        description:
          'Permite ao agente usar documentos locais para responder suas perguntas ou perguntar ao agente "lembrar" conteúdos de sua memória de longa duração.',
      },
      view: {
        title: "Visualizar & resumir",
        description:
          "Permite ao agente listar e resumir conteúdos guardados dos arquivos do workspace.",
      },
      scrape: {
        title: "Extrair sites",
        description:
          "Permite ao agente visitar e extrair conteúdo de websites.",
      },
      generate: {
        title: "Gerar gráficos",
        description:
          "Permite ao agente padrão gerar diversos tipos de gráficos a partir de dados armazenados ou informados no chat.",
      },
      save: {
        title: "Gerar & salvar arquivos",
        description: "Permite ao agente gerar e salvar arquivos no navegador.",
      },
      web: {
        title: "Busca na web",
        description:
          "Permita que seu agente acesse a web para responder às suas perguntas, conectando-se a um provedor de pesquisa na web (SERP).",
      },
      sql: {
        title: "Conector SQL",
        description:
          "Permita que seu agente utilize o SQL para responder às suas perguntas, conectando-se a diversos provedores de bancos de dados SQL.",
      },
      default_skill:
        "Por padrão, essa habilidade está ativada, mas você pode desativá-la se não quiser que ela esteja disponível para o agente.",
      filesystem: {
        title: "Acesso ao Sistema de Arquivos",
        description:
          "Permita que seu agente leia, grave, procure e gerencie arquivos dentro de um diretório específico. Suporta a edição de arquivos, a navegação em diretórios e a pesquisa de conteúdo.",
        learnMore: "Saiba mais sobre como utilizar esta habilidade.",
        configuration: "Configuração",
        readActions: "Ler ações",
        writeActions: "Ações a serem executadas",
        warning:
          "O acesso ao sistema de arquivos pode ser perigoso, pois pode modificar ou excluir arquivos. Por favor, consulte a <link>documentação</link> antes de habilitar.",
        skills: {
          "read-text-file": {
            title: "Abrir arquivo",
            description:
              "Ler o conteúdo de arquivos (texto, código, PDF, imagens, etc.)",
          },
          "read-multiple-files": {
            title: "Ler Vários Arquivos",
            description: "Leia vários arquivos simultaneamente.",
          },
          "list-directory": {
            title: "Lista de diretórios",
            description: "Liste os arquivos e diretórios em uma pasta.",
          },
          "search-files": {
            title: "Pesquisar arquivos",
            description: "Pesquise arquivos por nome ou conteúdo.",
          },
          "get-file-info": {
            title: "Obter informações do arquivo",
            description: "Obtenha metadados detalhados sobre os arquivos.",
          },
          "write-file": {
            title: "Criar arquivo",
            description:
              "Criar novos arquivos ou substituir arquivos existentes.",
          },
          "edit-file": {
            title: "Editar arquivo",
            description:
              "Realize edições baseadas em linhas em arquivos de texto.",
          },
          "create-directory": {
            title: "Criar Diretório",
            description: "Criar novas pastas/diretórios",
          },
          "move-file": {
            title: "Mover/Renomear arquivo",
            description: "Mova ou renomeie arquivos e diretórios.",
          },
          "copy-file": {
            title: "Copiar arquivo",
            description: "Copie arquivos e diretórios",
          },
        },
      },
    },
    mcp: {
      title: "Servidores MCP",
      "loading-from-config":
        "Carregar servidores MCP a partir do arquivo de configuração",
      "learn-more": "Saiba mais sobre os servidores MCP.",
      "no-servers-found": "Nenhum servidor MCP encontrado.",
      "tool-warning":
        "Para obter o melhor desempenho, considere desativar as ferramentas desnecessárias para preservar o contexto.",
      "stop-server": "Pare o servidor MCP",
      "start-server": "Iniciar o servidor MCP",
      "delete-server": "Excluir o servidor MCP",
      "tool-count-warning":
        "Este servidor MCP tem as seguintes ferramentas habilitadas: {{count}}, que consumirão contexto em cada conversa.</b> Considere desativar as ferramentas indesejadas para economizar contexto.",
      "startup-command": "Comando de inicialização",
      command: "Ordem",
      arguments: "Argumentos",
      "not-running-warning":
        "Este servidor MCP não está em funcionamento – pode estar parado ou estar apresentando um erro durante a inicialização.",
      "tool-call-arguments": "Argumentos de chamada de ferramenta",
      "tools-enabled": "ferramentas ativadas",
    },
    settings: {
      title: "Configurações de Habilidades do Agente",
      "max-tool-calls": {
        title: "Número máximo de chamadas de ferramenta por resposta",
        description:
          "O número máximo de ferramentas que um agente pode encadear para gerar uma única resposta. Isso evita chamadas excessivas de ferramentas e loops infinitos.",
      },
      "intelligent-skill-selection": {
        title: "Seleção Inteligente de Habilidades",
        "beta-badge": "Beta",
        description:
          "Permita o uso ilimitado de ferramentas e reduza o consumo de tokens em até 80% por consulta — O AnythingLLM seleciona automaticamente as habilidades mais adequadas para cada solicitação.",
        "max-tools": {
          title: "Ferramentas Max",
          description:
            "O número máximo de ferramentas que podem ser selecionadas para cada consulta. Recomendamos definir este valor para modelos com contextos maiores.",
        },
      },
    },
  },
  recorded: {
    title: "Chats do Workspace",
    description:
      "Todos os chats registrados enviados por usuários, ordenados por data de criação.",
    export: "Exportar",
    table: {
      id: "ID",
      by: "Enviado Por",
      workspace: "Workspace",
      prompt: "Prompt",
      response: "Resposta",
      at: "Enviado Em",
    },
  },
  customization: {
    interface: {
      title: "Preferências de UI",
      description: "Defina suas preferências de interface.",
    },
    branding: {
      title: "Marca & Etiqueta Branca",
      description: "Personalize sua instância do AnythingLLM com sua marca.",
    },
    chat: {
      title: "Chat",
      description: "Defina preferências de chat.",
      auto_submit: {
        title: "Envio Automático",
        description: "Envia automaticamente entrada de voz após silêncio.",
      },
      auto_speak: {
        title: "Falar Respostas",
        description: "Fala automaticamente as respostas da IA.",
      },
      spellcheck: {
        title: "Verificação Ortográfica",
        description: "Ativa/desativa verificação ortográfica no chat.",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Selecione seu tema de cores preferido.",
      },
      "show-scrollbar": {
        title: "Mostrar Barra",
        description: "Ativa/desativa barra de rolagem no chat.",
      },
      "support-email": {
        title: "Email de Suporte",
        description: "Defina o email de suporte acessível aos usuários.",
      },
      "app-name": {
        title: "Nome",
        description:
          "Defina um nome exibido na página de login para todos os usuários.",
      },
      "display-language": {
        title: "Idioma",
        description:
          "Selecione o idioma preferido para a interface - quando houver traduções.",
      },
      logo: {
        title: "Logo",
        description: "Envie seu logo personalizado.",
        add: "Adicionar logo",
        recommended: "Tamanho recomendado: 800 x 200",
        remove: "Remover",
        replace: "Substituir",
      },
      "browser-appearance": {
        title: "Aparência no Navegador",
        description: "Personalize a aparência da aba e título no navegador.",
        tab: {
          title: "Título",
          description: "Defina um título personalizado para a aba.",
        },
        favicon: {
          title: "Favicon",
          description: "Use um favicon personalizado.",
        },
      },
      "sidebar-footer": {
        title: "Itens do Rodapé",
        description:
          "Personalize os itens exibidos no rodapé da barra lateral.",
        icon: "Ícone",
        link: "Link",
      },
      "render-html": {
        title: "Renderizar HTML no chat",
        description:
          "Renderizar respostas HTML nas respostas do assistente.\nIsso pode resultar em uma qualidade de resposta muito maior, mas também pode levar a riscos potenciais de segurança.",
      },
    },
  },
  api: {
    title: "Chaves API",
    description: "Chaves API permitem acesso programático a esta instância.",
    link: "Leia a documentação da API",
    generate: "Gerar Nova Chave",
    table: {
      key: "Chave API",
      by: "Criado Por",
      created: "Criado Em",
    },
  },
  llm: {
    title: "Preferência de LLM",
    description:
      "Credenciais e configurações do seu provedor de LLM. Essas chaves devem estar corretas para o funcionamento adequado.",
    provider: "Provedor de LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Endpoint do Serviço Azure",
        api_key: "Chave da API",
        chat_deployment_name: "Nome do Deployment de Chat",
        chat_model_token_limit: "Limite de Tokens do Modelo de Chat",
        model_type: "Tipo do Modelo",
        default: "Padrão",
        reasoning: "Raciocínio",
        model_type_tooltip:
          'Se o seu ambiente de uso utiliza um modelo de raciocínio (o1, o1-mini, o3-mini, etc.), defina esta opção como "Raciocínio". Caso contrário, suas solicitações de chat podem falhar.',
      },
    },
  },
  transcription: {
    title: "Preferência de Transcrição",
    description:
      "Credenciais e configurações do seu provedor de transcrição. Essas chaves devem estar corretas para processar arquivos de mídia.",
    provider: "Provedor de Transcrição",
    "warn-start":
      "Usar o modelo local whisper em máquinas com RAM ou CPU limitada pode travar o AnythingLLM.",
    "warn-recommend": "Recomendamos pelo menos 2GB de RAM e arquivos <10Mb.",
    "warn-end":
      "O modelo interno será baixado automaticamente no primeiro uso.",
  },
  embedding: {
    title: "Preferência de Vínculo",
    "desc-start":
      "Ao usar um LLM sem suporte nativo a vínculo, você pode precisar especificar credenciais adicionais.",
    "desc-end":
      "Vínculo é o processo de transformar texto em vetores. Essas credenciais são necessárias para processar arquivos e prompts.",
    provider: {
      title: "Provedor de Vínculo",
    },
  },
  text: {
    title: "Preferências de Divisão de Texto",
    "desc-start":
      "Você pode alterar a forma como novos documentos são divididos antes de serem inseridos no banco de dados vetorial.",
    "desc-end": "Modifique apenas se entender os efeitos da divisão de texto.",
    size: {
      title: "Tamanho dos Trechos",
      description: "Comprimento máximo de caracteres em um único vetor.",
      recommend: "Tamanho máximo do modelo de vínculo é",
    },
    overlap: {
      title: "Sobreposição de Trechos",
      description:
        "Sobreposição máxima de caracteres entre dois trechos adjacentes.",
    },
  },
  vector: {
    title: "Banco de Dados Vetorial",
    description:
      "Credenciais e configurações do seu banco de dados vetorial. Essas chaves devem estar corretas para o funcionamento adequado.",
    provider: {
      title: "Provedor do Banco",
      description: "Nenhuma configuração necessária para LanceDB.",
    },
  },
  embeddable: {
    title: "Widgets de Chat vinculado",
    description:
      "Widgets de chat vinculadas são interfaces de chats públicos ligadas a um único workspace. Isto permite construir workspaces e publicá-los na web.",
    create: "Criar vínculo",
    table: {
      workspace: "Workspace",
      chats: "Chats Enviados",
      active: "Domínios Ativos",
      created: "Criado Em",
    },
  },
  "embed-chats": {
    title: "Chats Vinculados",
    export: "Exportar",
    description: "Todos os chats registrados de qualquer vínculo publicado.",
    table: {
      embed: "Vínculo",
      sender: "Remetente",
      message: "Mensagem",
      response: "Resposta",
      at: "Enviado Em",
    },
  },
  event: {
    title: "Logs de Eventos",
    description:
      "Visualize todas as ações e eventos nesta instância para monitoramento.",
    clear: "Limpar Logs de eventos",
    table: {
      type: "Tipo de Evento",
      user: "Usuário",
      occurred: "Ocorrido Em",
    },
  },
  privacy: {
    title: "Privacidade & Dados",
    description:
      "Configurações de como provedores terceiros e o AnythingLLM lidam com seus dados.",
    anonymous: "Telemetria Anônima Ativa",
  },
  connectors: {
    "search-placeholder": "Buscar conectores",
    "no-connectors": "Nenhum conector encontrado.",
    obsidian: {
      vault_location: "Local do Cofre",
      vault_description:
        "Selecione sua pasta do Obsidian para importar todas as notas.",
      selected_files: "Encontrados {{count}} arquivos markdown",
      importing: "Importando cofre...",
      import_vault: "Importar Cofre",
      processing_time: "Pode levar algum tempo dependendo do tamanho do cofre.",
      vault_warning:
        "Para evitar conflitos, certifique-se que seu cofre Obsidian não está aberto.",
    },
    github: {
      name: "Repositório GitHub",
      description:
        "Importe um repositório GitHub público ou privado com um clique.",
      URL: "URL do Repositório",
      URL_explained: "URL do repositório que deseja coletar.",
      token: "Token de Acesso",
      optional: "opcional",
      token_explained: "Token para evitar limitação de taxa.",
      token_explained_start: "Sem um ",
      token_explained_link1: "Token de Acesso Pessoal",
      token_explained_middle:
        ", a API do GitHub pode limitar o número de arquivos coletados. Você pode ",
      token_explained_link2: "criar um Token Temporário",
      token_explained_end: " para evitar isso.",
      ignores: "Arquivos Ignorados",
      git_ignore:
        "Liste no formato .gitignore para ignorar arquivos específicos. Pressione enter após cada entrada.",
      task_explained:
        "Após conclusão, todos os arquivos estarão disponíveis para vínculo.",
      branch: "Branch",
      branch_loading: "-- carregando branches --",
      branch_explained: "Branch para coletar arquivos.",
      token_information:
        "Sem preencher o <b>Token de Acesso</b>, este conector só poderá coletar arquivos <b>do nível superior</b> devido a limitações da API pública.",
      token_personal: "Obtenha um Token de Acesso Pessoal gratuito aqui.",
    },
    gitlab: {
      name: "Repositório GitLab",
      description:
        "Importe um repositório GitLab público ou privado com um clique.",
      URL: "URL do Repositório",
      URL_explained: "URL do repositório que deseja coletar.",
      token: "Token de Acesso",
      optional: "opcional",
      token_description: "Selecione entidades adicionais para buscar na API.",
      token_explained_start: "Sem um ",
      token_explained_link1: "Token de Acesso Pessoal",
      token_explained_middle:
        ", a API do GitLab pode limitar o número de arquivos coletados. Você pode ",
      token_explained_link2: "criar um Token Temporário",
      token_explained_end: " para evitar isso.",
      fetch_issues: "Buscar Issues como Documentos",
      ignores: "Arquivos Ignorados",
      git_ignore:
        "Liste no formato .gitignore para ignorar arquivos específicos. Pressione enter após cada entrada.",
      task_explained:
        "Após conclusão, todos os arquivos estarão disponíveis para vínculo.",
      branch: "Branch",
      branch_loading: "-- carregando branches --",
      branch_explained: "Branch para coletar arquivos.",
      token_information:
        "Sem preencher o <b>Token de Acesso</b>, este conector só poderá coletar arquivos <b>do nível superior</b> devido a limitações da API pública.",
      token_personal: "Obtenha um Token de Acesso Pessoal gratuito aqui.",
    },
    youtube: {
      name: "Transcrição do YouTube",
      description:
        "Importe a transcrição de um vídeo do YouTube a partir de um link.",
      URL: "URL do Vídeo",
      URL_explained_start:
        "Insira a URL de qualquer vídeo do YouTube para buscar sua transcrição. O vídeo deve ter ",
      URL_explained_link: "legendas",
      URL_explained_end: " disponíveis.",
      task_explained:
        "Após conclusão, a transcrição estará disponível para vínculo.",
    },
    "website-depth": {
      name: "Coletor de Links",
      description:
        "Extraia um site e seus sublinks até uma certa profundidade.",
      URL: "URL do Site",
      URL_explained: "URL do site que deseja extrair.",
      depth: "Profundidade",
      depth_explained:
        "Número de links filhos que o coletor deve seguir a partir da URL original.",
      max_pages: "Máximo de Páginas",
      max_pages_explained: "Número máximo de links para extrair.",
      task_explained:
        "Após conclusão, todo o conteúdo estará disponível para vínculo.",
    },
    confluence: {
      name: "Confluence",
      description: "Importe uma página do Confluence com um clique.",
      deployment_type: "Tipo de instalação",
      deployment_type_explained:
        "Determine se sua instância é hospedada na nuvem ou auto-hospedada.",
      base_url: "URL Base",
      base_url_explained: "URL base do seu espaço no Confluence.",
      space_key: "Chave do Espaço",
      space_key_explained:
        "Chave do espaço no Confluence que será usada. Geralmente começa com ~",
      username: "Nome de Usuário",
      username_explained: "Seu nome de usuário no Confluence",
      auth_type: "Tipo de Autenticação",
      auth_type_explained:
        "Selecione o tipo de autenticação para acessar suas páginas.",
      auth_type_username: "Usuário e Token",
      auth_type_personal: "Token Pessoal",
      token: "Token de Acesso",
      token_explained_start:
        "Forneça um token de acesso para autenticação. Você pode gerar um token",
      token_explained_link: "aqui",
      token_desc: "Token para autenticação",
      pat_token: "Token Pessoal",
      pat_token_explained: "Seu token pessoal de acesso.",
      task_explained:
        "Após conclusão, o conteúdo da página estará disponível para vínculo.",
      bypass_ssl: "Desviar a validação do certificado SSL",
      bypass_ssl_explained:
        "Habilite esta opção para contornar a validação do certificado SSL para instâncias do Confluence hospedadas por si mesmo, com certificado autoassinado.",
    },
    manage: {
      documents: "Documentos",
      "data-connectors": "Conectores de Dados",
      "desktop-only":
        "Editar estas configurações só está disponível em dispositivos desktop. Acesse esta página em seu desktop para continuar.",
      dismiss: "Ignorar",
      editing: "Editando",
    },
    directory: {
      "my-documents": "Meus Documentos",
      "new-folder": "Nova Pasta",
      "search-document": "Buscar documento",
      "no-documents": "Nenhum Documento",
      "move-workspace": "Mover para Workspace",
      "delete-confirmation":
        "Tem certeza que deseja excluir estes arquivos e pastas?\nIsso removerá os arquivos do sistema e de todos os workspaces automaticamente.\nEsta ação é irreversível.",
      "removing-message":
        "Removendo {{count}} documentos e {{folderCount}} pastas. Aguarde.",
      "move-success": "{{count}} documentos movidos com sucesso.",
      no_docs: "Nenhum Documento",
      select_all: "Selecionar Tudo",
      deselect_all: "Desmarcar Tudo",
      remove_selected: "Remover Selecionados",
      costs: "*Custo único para vínculos",
      save_embed: "Salvar e Inserir",
      "total-documents_one": "{{count}} documento",
      "total-documents_other": "{{count}} documentos",
    },
    upload: {
      "processor-offline": "Processador de documentos Indisponível",
      "processor-offline-desc":
        "Não é possível enviar arquivos agora. O processador de documentos está offline. Tente mais tarde.",
      "click-upload": "Clique para enviar ou arraste e solte",
      "file-types": "suporta textos, csv, planilhas, áudios e mais!",
      "or-submit-link": "ou envie um link",
      "placeholder-link": "https://exemplo.com",
      fetching: "Buscando...",
      "fetch-website": "Buscar site",
      "privacy-notice":
        "Esses arquivos são enviados ao processador local do AnythingLLM. Não são compartilhados com terceiros.",
    },
    pinning: {
      what_pinning: "O que é fixar documento?",
      pin_explained_block1:
        "Ao <b>fixar</b> um documento, o conteúdo será injetado na janela do prompt para o LLM entender.",
      pin_explained_block2:
        "Funciona melhor com <b>modelos de contexto grande</b> ou arquivos pequenos e importantes.",
      pin_explained_block3:
        "Se não tiver boas respostas, fixar pode melhorar a qualidade com um clique.",
      accept: "Ok, entendi",
    },
    watching: {
      what_watching: "O que é monitorar um documento?",
      watch_explained_block1:
        "Ao <b>monitorar</b>, o conteúdo será <i>sincronizado</i> com a fonte em intervalos regulares.",
      watch_explained_block2:
        "Funciona apenas com conteúdo online, não com uploads manuais.",
      watch_explained_block3_start:
        "Você pode gerenciar documentos monitorados no ",
      watch_explained_block3_link: "Gerenciador de arquivos",
      watch_explained_block3_end: " na visão de admin.",
      accept: "Ok, entendi",
    },
  },
  chat_window: {
    attachments_processing: "Anexos em processamento. Aguarde...",
    send_message: "Enviar mensagem",
    attach_file: "Anexar arquivo ao chat",
    text_size: "Alterar tamanho do texto.",
    microphone: "Fale seu prompt.",
    send: "Enviar prompt para o workspace",
    tts_speak_message: "Leitura em voz alta da mensagem",
    copy: "Copiar",
    regenerate: "Regerar",
    regenerate_response: "Regerar resposta",
    good_response: "Resposta satisfatória",
    more_actions: "Mais ações",
    fork: "Fork",
    delete: "Excluir",
    cancel: "Cancelar",
    edit_prompt: "Editar prompt",
    edit_response: "Editar resposta",
    preset_reset_description: "Limpa o histórico do seu chat e inicia um novo",
    add_new_preset: " Insere um novo Preset",
    command: "Comando",
    your_command: "seu-comando",
    placeholder_prompt:
      "Este é o conteúdo que será injetado a frente do seu prompt.",
    description: "Descrição",
    placeholder_description: "Responde como um poema sobre LLMs.",
    save: "Salvar",
    small: "Pequeno",
    normal: "Normal",
    large: "Grande",
    workspace_llm_manager: {
      search: "Buscar provedores de LLM",
      loading_workspace_settings: "Carregando configurações do workspace...",
      available_models: "Modelos Disponíveis",
      available_models_description: "Selecione um modelo para este workspace",
      save: "Salvar modelo do workspace",
      saving: "Salvando...",
      missing_credentials: "Credenciais em falta",
      missing_credentials_description:
        "Configure as credenciais do LLM primeiro",
    },
    submit: "Enviar",
    edit_info_user:
      '"Enviar" recria a resposta da IA. "Salvar" atualiza apenas sua mensagem.',
    edit_info_assistant:
      "Suas alterações serão salvas diretamente nesta resposta.",
    see_less: "Ver menos",
    see_more: "Ver mais",
    tools: "Ferramentas",
    text_size_label: "Tamanho do texto",
    select_model: "Selecione o modelo",
    sources: "Fontes",
    document: "Documento",
    similarity_match: "jogo",
    source_count_one: "Referência a {{count}}",
    source_count_other: "Referências a {{count}}",
    preset_exit_description: "Interrompa a sessão atual do agente",
    add_new: "Adicionar novo",
    edit: "Editar",
    publish: "Publicar",
    stop_generating: "Pare de gerar respostas",
    slash_commands: "Comandos Rápidos",
    agent_skills: "Habilidades do Agente",
    manage_agent_skills: "Gerenciar as habilidades dos agentes",
    agent_skills_disabled_in_session:
      "Não é possível modificar as habilidades durante uma sessão de agente ativa. Utilize o comando `/exit` para encerrar a sessão primeiro.",
    start_agent_session: "Iniciar Sessão de Agente",
    use_agent_session_to_use_tools:
      'Você pode utilizar as ferramentas disponíveis no chat iniciando uma sessão com um agente, adicionando "@agent" no início da sua mensagem.',
    agent_invocation: {
      model_wants_to_call: "O modelo deseja fazer uma ligação.",
      approve: "Aprovar",
      reject: "Rejeitar",
      always_allow:
        "Certifique-se sempre de que {{skillName}} esteja disponível.",
      tool_call_was_approved: "A solicitação de ferramentas foi aprovada.",
      tool_call_was_rejected:
        "A solicitação de acesso à ferramenta foi rejeitada.",
    },
  },
  profile_settings: {
    edit_account: "Editar conta",
    profile_picture: "Foto de perfil",
    remove_profile_picture: "Remover foto de perfil",
    username: "Nome de usuário",
    new_password: "Nova senha",
    password_description: "A senha deve ter no mínimo 8 caracteres",
    cancel: "Cancelar",
    update_account: "Atualizar conta",
    theme: "Preferência de tema",
    language: "Idioma preferido",
    failed_upload: "Falha no upload da foto de perfil",
    upload_success: "Foto de perfil atualizada com sucesso",
    failed_remove: "Falha ao remover foto de perfil",
    profile_updated: "Perfil atualizado com sucesso",
    failed_update_user: "Falha ao atualizar perfil do usuário",
    account: "Conta",
    support: "Suporte",
    signout: "Sair",
  },
  "keyboard-shortcuts": {
    title: "Atalhos de Teclado",
    shortcuts: {
      settings: "Ajustes",
      workspaceSettings: "Abrir os ajustes do workspace",
      home: "Ir para a página inicial",
      workspaces: "Gerenciar workspaces",
      apiKeys: "Ajustes das chaves da API",
      llmPreferences: "Preferências do LLM",
      chatSettings: "Ajustes do chat",
      help: "Exibe ajuda e atalhos",
      showLLMSelector: "Exibir seletor de LLM",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Prompt de sistema publicado!",
        success_description:
          "Seu prompt de sistema foi publicado com sucesso no Hub da Comunidade.",
        success_thank_you: "Obrigado por contribuir!",
        view_on_hub: "Ver no Hub",
        modal_title: "Publicar prompt de sistema",
        name_label: "Nome",
        name_description: "Nome único para seu prompt de sistema",
        name_placeholder: "Meu prompt de sistema incrível",
        description_label: "Descrição",
        description_description: "Descreva o que seu prompt de sistema faz",
        tags_label: "Tags",
        tags_description:
          "Adicione tags para ajudar outros a encontrar seu prompt",
        tags_placeholder: "prompt, assistente, produtividade",
        visibility_label: "Visibilidade",
        public_description: "Qualquer pessoa pode ver e usar este prompt",
        private_description: "Apenas você pode ver e usar este prompt",
        publish_button: "Publicar prompt de sistema",
        submitting: "Publicando...",
        prompt_label: "Prompt de sistema",
        prompt_description: "O conteúdo do seu prompt de sistema",
        prompt_placeholder: "Você é um assistente útil que...",
      },
      agent_flow: {
        success_title: "Fluxo de agente publicado!",
        success_description:
          "Seu fluxo de agente foi publicado com sucesso no Hub da Comunidade.",
        success_thank_you: "Obrigado por contribuir!",
        view_on_hub: "Ver no Hub",
        modal_title: "Publicar fluxo de agente",
        name_label: "Nome",
        name_description: "Nome único para seu fluxo de agente",
        name_placeholder: "Meu fluxo de agente incrível",
        description_label: "Descrição",
        description_description: "Descreva o que seu fluxo de agente faz",
        tags_label: "Tags",
        tags_description:
          "Adicione tags para ajudar outros a encontrar seu fluxo",
        tags_placeholder: "agente, automação, fluxo de trabalho",
        visibility_label: "Visibilidade",
        submitting: "Publicando...",
        submit: "Publicar",
        privacy_note:
          "Nota: dados sensíveis serão removidos antes da publicação",
      },
      generic: {
        unauthenticated: {
          title: "Faça login para publicar",
          description:
            "Você precisa estar logado para publicar no Hub da Comunidade",
          button: "Fazer login",
        },
      },
      slash_command: {
        success_title: "Comando de barra publicado!",
        success_description:
          "Seu comando de barra foi publicado com sucesso no Hub da Comunidade.",
        success_thank_you: "Obrigado por contribuir!",
        view_on_hub: "Ver no Hub",
        modal_title: "Publicar comando de barra",
        name_label: "Nome",
        name_description: "Nome único para seu comando de barra",
        name_placeholder: "Meu comando incrível",
        description_label: "Descrição",
        description_description: "Descreva o que seu comando faz",
        tags_label: "Tags",
        tags_description:
          "Adicione tags para ajudar outros a encontrar seu comando",
        tags_placeholder: "comando, produtividade, útil",
        visibility_label: "Visibilidade",
        public_description: "Qualquer pessoa pode ver e usar este comando",
        private_description: "Apenas você pode ver e usar este comando",
        publish_button: "Publicar comando de barra",
        submitting: "Publicando...",
        prompt_label: "Prompt",
        prompt_description:
          "O prompt que será executado quando o comando for usado",
        prompt_placeholder: "Responda como um especialista em...",
      },
    },
  },
  security: {
    title: "Segurança",
    multiuser: {
      title: "Modo Multi-Usuário",
      description:
        "Configure sua instância para suportar sua equipe ativando o modo multi-usuário.",
      enable: {
        "is-enable": "Modo Multi-Usuário Ativo",
        enable: "Ativar Modo Multi-Usuário",
        description:
          "Por padrão, você será o único administrador. Como administrador, você precisará criar contas para novos usuários. Não perca sua senha, pois apenas administradores podem redefini-la.",
        username: "Nome de usuário admin",
        password: "Senha de admin",
      },
    },
    password: {
      title: "Proteção por Senha",
      description:
        "Proteja sua instância com uma senha. Não há recuperação, então salve esta senha.",
      "password-label": "Senha da instância",
    },
  },
  home: {
    welcome: "Bem-vindo",
    chooseWorkspace: "Escolha um espaço de trabalho para começar a conversar!",
    notAssigned:
      "Você ainda não está atribuído a nenhum espaço de trabalho.\nEntre em contato com seu administrador para solicitar acesso a um espaço de trabalho.",
    goToWorkspace: 'Ir para o espaço de trabalho "{{workspace}}"',
  },
  telegram: {
    title: "Bot do Telegram",
    description:
      "Conecte sua instância do AnythingLLM ao Telegram para que possa conversar com seus espaços de trabalho a partir de qualquer dispositivo.",
    setup: {
      step1: {
        title: "Passo 1: Crie seu bot do Telegram",
        description:
          "Abra o @BotFather no Telegram, envie /newbot</code> para <code>@BotFather</code>, siga as instruções e copie o token da API.",
        "open-botfather": "Iniciar o BotFather",
        "instruction-1": "1. Abra o link ou escaneie o código QR.",
        "instruction-2":
          "2. Envie <code>/newbot</code> para <code>@BotFather</code>",
        "instruction-3":
          "3. Escolha um nome e um nome de usuário para o seu bot.",
        "instruction-4": "4. Copie o token da API que você receber.",
      },
      step2: {
        title: "Passo 2: Conecte seu bot",
        description:
          "Cole o token da API que recebeu do @BotFather e selecione um espaço de trabalho padrão para que seu bot possa conversar.",
        "bot-token": "Token do Bot",
        "default-workspace": "Espaço de Trabalho Padrão",
        "no-workspace":
          "Não há espaços de trabalho disponíveis. Um novo será criado.",
        connecting: "Conectando...",
        "connect-bot": "Bot de Conexão",
      },
      security: {
        title: "Configurações de segurança recomendadas",
        description:
          "Para maior segurança, configure estas opções no @BotFather.",
        "disable-groups": "— Impedir a adição de bots a grupos",
        "disable-inline": "— Impedir que o bot seja usado na pesquisa inline.",
        "obscure-username":
          "Utilize um nome de usuário de bot menos óbvio para reduzir a sua visibilidade.",
      },
      "toast-enter-token": "Por favor, insira um token de bot.",
      "toast-connect-failed": "Falhou a conexão com o bot.",
    },
    connected: {
      status: "Conectado",
      "status-disconnected":
        "Desconectado — o token pode ter expirado ou ser inválido",
      "placeholder-token": "Cole o novo token do bot...",
      reconnect: "Reconectar",
      workspace: "Espaço de trabalho",
      "bot-link": "Link do bot",
      "voice-response": "Resposta por voz",
      disconnecting: "Desconectando...",
      disconnect: "Desconectar",
      "voice-text-only": "Apenas texto",
      "voice-mirror":
        "Espelho (responder com voz quando o usuário enviar uma mensagem de voz)",
      "voice-always":
        "Sempre inclua uma gravação de áudio (envie um áudio com cada resposta).",
      "toast-disconnect-failed": "Falhou ao desconectar o bot.",
      "toast-reconnect-failed": "Falha ao tentar reconectar o bot.",
      "toast-voice-failed": "Falhou ao atualizar o modo de voz.",
      "toast-approve-failed": "Falhou ao aprovar o usuário.",
      "toast-deny-failed": "Não foi possível negar o acesso ao usuário.",
      "toast-revoke-failed": "Falhou ao revogar o acesso do usuário.",
    },
    users: {
      "pending-title": "Aguardando Aprovação",
      "pending-description":
        "Usuários aguardando a verificação. Compare o código de pareamento exibido aqui com o que aparece em seu chat do Telegram.",
      "approved-title": "Usuários Aprovados",
      "approved-description":
        "Usuários que foram aprovados para conversar com o seu bot.",
      user: "Usuário",
      "pairing-code": "Código de emparelhamento",
      "no-pending": "Não há solicitações pendentes.",
      "no-approved": "Sem usuários autorizados",
      unknown: "Desconhecido",
      approve: "Aprovar",
      deny: "Negar",
      revoke: "Anular",
    },
  },
};

export default TRANSLATIONS;
