// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Bem-vindo ao",
      getStarted: "Começar",
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
      adminUsernameReq:
        "O nome deve ter pelo menos 6 caracteres e conter apenas letras minúsculas, números, sublinhados e hífens, sem espaços.",
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
    workspace: {
      title: "Crie seu primeiro workspace",
      description: "Crie seu primeiro workspace e comece a usar o AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Nome do Workspace",
    error: "erro",
    success: "sucesso",
    user: "Usuário",
    selection: "Seleção de Modelo",
    saving: "Salvando...",
    save: "Salvar alterações",
    previous: "Página Anterior",
    next: "Próxima Página",
    optional: "Opcional",
    yes: "Sim",
    no: "Não",
  },
  settings: {
    title: "Configurações da Instância",
    system: "Configurações Gerais",
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
    "embed-chats": "Histórico de vínculos",
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
    "sign-in": {
      start: "Acesse sua",
      end: "conta.",
    },
    "password-reset": {
      title: "Redefinição de Senha",
      description:
        "Forneça as informações necessárias para redefinir sua senha.",
      "recovery-codes": "Códigos de Recuperação",
      "recovery-code": "Código de Recuperação {{index}}",
      "back-to-login": "Voltar ao Login",
    },
  },
  welcomeMessage: {
    part1:
      "Bem-vindo ao AnythingLLM, uma ferramenta de IA open-source da Mintplex Labs que transforma qualquer conteúdo em um chatbot treinado. AnythingLLM é um software BYOK (bring-your-own-keys), sem taxas ou assinaturas.",
    part2:
      "AnythingLLM é a maneira mais fácil de integrar poderosas ferramentas de IA como OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB e outros serviços em um pacote simples.",
    part3:
      "AnythingLLM pode rodar localmente na sua máquina com baixo consumo de recursos. Sem GPU necessária. Disponível para instalação na nuvem ou on-premises.\nO ecossistema de IA evolui rapidamente. AnythingLLM facilita seu uso.",
    githubIssue: "Criar issue no GitHub",
    user1: "Como começar?!",
    part4:
      'É simples. As coleções são organizadas em "Workspaces". Workspaces são grupos de arquivos, documentos, imagens, PDFs e outros arquivos que serão transformados em algo que os LLMs possam entender e usar em conversas.\n\nVocê pode adicionar ou remover arquivos a qualquer momento.',
    createWorkspace: "Crie seu primeiro workspace",
    user2: "Isso é como um Dropbox com IA? E os chats? É um chatbot, certo?",
    part5:
      "AnythingLLM é mais que um Dropbox inteligente.\n\nAnythingLLM oferece duas formas de interagir com seus dados:\n\n<i>Consulta:</i> Seus chats retornarão dados encontrados nos documentos do workspace.\n\n<i>Conversacional:</i> Seus documentos + histórico de chat contribuem para o conhecimento do LLM em tempo real.\n\nVocê pode alternar entre os modos <i>durante o chat!</i>",
    user3: "Uau, isso parece incrível, quero testar agora!",
    part6: "Divirta-se!",
    starOnGitHub: "Estrelar no GitHub",
    contact: "Contate a Mintplex Labs",
  },
  "main-page": {
    noWorkspaceError: "Por favor, crie um workspace antes de iniciar um chat.",
    checklist: {
      title: "Primeiros Passos",
      tasksLeft: "tarefas restantes",
      completed:
        "Você está no caminho para se tornar um expert em AnythingLLM!",
      dismiss: "fechar",
      tasks: {
        create_workspace: {
          title: "Criar workspace",
          description: "Crie seu primeiro workspace para começar",
          action: "Criar",
        },
        send_chat: {
          title: "Enviar chat",
          description: "Inicie uma conversa com seu assistente de IA",
          action: "Chat",
        },
        embed_document: {
          title: "Inserir documento",
          description: "Adicione seu primeiro documento ao workspace",
          action: "Inserir",
        },
        setup_system_prompt: {
          title: "Configurar prompt",
          description: "Defina o comportamento do seu assistente de IA",
          action: "Configurar",
        },
        define_slash_command: {
          title: "Definir comando",
          description: "Crie comandos personalizados para seu assistente",
          action: "Definir",
        },
        visit_community: {
          title: "Visitar Comunidade",
          description: "Explore recursos e templates da comunidade",
          action: "Explorar",
        },
      },
    },
    quickLinks: {
      title: "Links Rápidos",
      sendChat: "Enviar Chat",
      embedDocument: "Vincular Documento",
      createWorkspace: "Criar Workspace",
    },
    exploreMore: {
      title: "Explore mais recursos",
      features: {
        customAgents: {
          title: "Agentes Personalizados",
          description: "Crie agentes de IA poderosos sem código.",
          primaryAction: "Chat com @agent",
          secondaryAction: "Criar fluxo de agente",
        },
        slashCommands: {
          title: "Comandos de Barra",
          description: "Economize tempo com comandos personalizados de barra.",
          primaryAction: "Criar Comando",
          secondaryAction: "Explorar no Hub",
        },
        systemPrompts: {
          title: "Prompts de Sistema",
          description:
            "Modifique o prompt para personalizar as respostas da IA.",
          primaryAction: "Modificar Prompt",
          secondaryAction: "Gerenciar variáveis",
        },
      },
    },
    announcements: {
      title: "Atualizações e Anúncios",
    },
    resources: {
      title: "Recursos",
      links: {
        docs: "Documentação",
        star: "Avalie-nos no Github",
      },
      keyboardShortcuts: null,
    },
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
    pfp: {
      title: "Imagem do Assistente",
      description: "Personalize a imagem do assistente para este workspace.",
      image: "Imagem do Workspace",
      remove: "Remover Imagem",
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
      wait: "-- aguardando modelos --",
    },
    mode: {
      title: "Modo de Chat",
      chat: {
        title: "Chat",
        "desc-start": "fornecerá respostas com conhecimento geral do LLM",
        and: "e",
        "desc-end": "contexto dos documentos encontrados.",
      },
      query: {
        title: "Consulta",
        "desc-start": "fornecerá respostas",
        only: "apenas",
        "desc-end": "se contexto for encontrado nos documentos.",
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
        publish: null,
      },
    },
    refusal: {
      title: "Modo Resposta de recusa",
      "desc-start": "Quando",
      query: "consulta",
      "desc-end":
        "modo, você pode definir uma resposta personalizada quando nenhum contexto for encontrado.",
      "tooltip-title": null,
      "tooltip-description": null,
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
      title: "Habilidades padrão do agente",
      description:
        "Melhore as habilidades naturais do agente com estas funções pré-configuradas. Aplica-se a todos os workspaces.",
      rag: {
        title: "RAG & memória longa duraçào",
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
          "Permite ao agent padrão gerar diversos tipos de gráficos a partir de dados armazenados ou informados no chat.",
      },
      save: {
        title: "Gerar & salvar arquivos",
        description: "Permite ao agente gerar e salvar arquivos no navegador.",
      },
      web: {
        title: "Busca na web",
        "desc-start":
          "Permite ao agente pesquisar na web para responder perguntas conectando-se a um provedor de busca.",
        "desc-end":
          "Buscas na web durante sessões de agente não funcionarão até que isso seja configurado.",
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
      "chat-message-alignment": {
        title: "Alinhamento de Mensagens",
        description: "Selecione o alinhamento das mensagens no chat.",
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
      "welcome-messages": {
        title: "Mensagens de Boas-vindas",
        description:
          "Personalize as mensagens exibidas aos usuários que não são administradores.",
        new: "Novo",
        system: "sistema",
        user: "usuário",
        message: "mensagem",
        assistant: "Assistente de Chat",
        "double-click": "Clique duas vezes para editar...",
        save: "Salvar Mensagens",
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
      description:
        "Nenhuma configuração é necessária ao usar o mecanismo nativo do AnythingLLM.",
    },
  },
  text: {
    title: "Preferências de Divisão de Texto",
    "desc-start":
      "Você pode alterar a forma como novos documentos são divididos antes de serem inseridos no banco de dados vetorial.",
    "desc-end": "Modifique apenas se entender os efeitos da divisão de texto.",
    "warn-start": "Alterações afetarão apenas",
    "warn-center": "documentos novos",
    "warn-end": ", não os existentes.",
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
      created: null,
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
  multi: {
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
    password: {
      title: "Proteção por Senha",
      description:
        "Proteja sua instância com uma senha. Não há recuperação, então salve esta senha.",
    },
    instance: {
      title: "Proteger Instância",
      description:
        "Por padrão, você será o único administrador. Como administrador, você precisará criar contas para novos usuários. Não perca sua senha, pois apenas administradores podem redefini-la.",
      password: "Senha da instância",
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
    llm: "Seleção de LLM",
    embedding: "Preferência de Vínculo",
    vector: "Banco de Dados Vetorial",
    anonymous: "Telemetria Anônima Ativa",
  },
  connectors: {
    "search-placeholder": "Buscar conectores",
    "no-connectors": "Nenhum conector encontrado.",
    obsidian: {
      name: "Obsidian",
      description: "Importe um vault do Obsidian com um clique.",
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
      token_explained: "Token para evitar limitação de taxa.",
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
      language: "Idioma da Transcrição",
      language_explained:
        "Selecione o idioma da transcrição que deseja coletar.",
      loading_languages: "-- carregando idiomas --",
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
      name: "Nome",
      "delete-confirmation":
        "Tem certeza que deseja excluir estes arquivos e pastas?\nIsso removerá os arquivos do sistema e de todos os workspaces automaticamente.\nEsta ação é irreversível.",
      "removing-message":
        "Removendo {{count}} documentos e {{folderCount}} pastas. Aguarde.",
      "move-success": "{{count}} documentos movidos com sucesso.",
      date: "Data",
      type: "Tipo",
      no_docs: "Nenhum Documento",
      select_all: "Selecionar Tudo",
      deselect_all: "Desmarcar Tudo",
      remove_selected: "Remover Selecionados",
      costs: "*Custo único para vínculos",
      save_embed: "Salvar e Inserir",
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
    welcome: "Bem-vindo ao novo workspace.",
    get_started: "Para começar,",
    get_started_default: "Para começar",
    upload: "envie um documento",
    or: "ou",
    attachments_processing: "Anexos em processamento. Aguarde...",
    send_chat: "envie uma mensagem.",
    send_message: "Enviar mensagem",
    attach_file: "Anexar arquivo ao chat",
    slash: "Veja todos os comandos disponíveis.",
    agents: "Veja todos os agentes disponíveis.",
    text_size: "Alterar tamanho do texto.",
    microphone: "Fale seu prompt.",
    send: "Enviar prompt para o workspace",
    tts_speak_message: "Leitura em voz alta da mensagem",
    copy: "Copiar",
    regenerate: "Regerar",
    regenerate_response: "Regerar resposta",
    good_response: "Resposta satisfatória",
    more_actions: "Mais ações",
    hide_citations: "Esconder citações",
    show_citations: "Exibir citações",
    pause_tts_speech_message: "Pausar a leitura em voz alta",
    fork: "Fork",
    delete: "Excluir",
    save_submit: "Alterar",
    cancel: "Cancelar",
    edit_prompt: "Editar prompt",
    edit_response: "Editar resposta",
    at_agent: "@agente",
    default_agent_description: " - o agente padrão deste workspace.",
    custom_agents_coming_soon: "mais agentes personalizados em breve!",
    slash_reset: "/reset",
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
    edit_account: "Editar conta",
    profile_picture: "Foto de perfil",
    remove_profile_picture: "Remover foto de perfil",
    username: "Nome de usuário",
    username_description:
      "Somente letras minúsculas, números, sublinhados e hífens. Sem espaços.",
    new_password: "Nova senha",
    passwort_description: "A senha deve ter no mínimo 8 caracteres",
    cancel: "Cancelar",
    update_account: "Atualizar conta",
    theme: "Preferência de tema",
    language: "Idioma preferido",
    failed_upload: null,
    upload_success: null,
    failed_remove: null,
    profile_updated: null,
    failed_update_user: null,
    account: null,
    support: null,
    signout: null,
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
