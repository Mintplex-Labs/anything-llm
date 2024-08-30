const TRANSLATIONS = {
  common: {
    "workspaces-name": "Nome dos Workspaces",
    error: "erro",
    success: "sucesso",
    user: "Usuário",
    selection: "Seleção de Modelo",
    saving: "Salvando...",
    save: "Salvar alterações",
    previous: "Página Anterior",
    next: "Próxima Página",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "Configurações da Instância",
    system: "Configurações Gerais",
    invites: "Convites",
    users: "Usuários",
    workspaces: "Workspaces",
    "workspace-chats": "Chats do Workspace",
    customization: "Customização",
    "api-keys": "API para Desenvolvedores",
    llm: "LLM",
    transcription: "Transcrição",
    embedder: "Incorporador",
    "text-splitting": "Divisor de Texto e Fragmentação",
    "voice-speech": "Voz e Fala",
    "vector-database": "Banco de Dados Vetorial",
    embeds: "Incorporar Chat",
    "embed-chats": "Histórico de Chats Incorporados",
    security: "Segurança",
    "event-logs": "Logs de Eventos",
    privacy: "Privacidade e Dados",
    "ai-providers": "Provedores de IA",
    "agent-skills": "Habilidades do Agente",
    admin: "Admin",
    tools: "Ferramentas",
    "experimental-features": "Recursos Experimentais",
    contact: "Contato com Suporte",
    "browser-extension": "Extensão do navegador",
  },

  // Page Definitions
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
    "password-reset": {
      title: "Redefinição de Senha",
      description:
        "Forneça as informações necessárias abaixo para redefinir sua senha.",
      "recovery-codes": "Códigos de Recuperação",
      "recovery-code": "Código de Recuperação {{index}}",
      "back-to-login": "Voltar ao Login",
    },
  },

  welcomeMessage: {
    part1:
      "Bem-vindo ao AnythingLLM, AnythingLLM é uma ferramenta de IA de código aberto da Mintplex Labs que transforma qualquer coisa em um chatbot treinado que você pode consultar e conversar. AnythingLLM é um software BYOK (bring-your-own-keys | traga suas próprias chaves), portanto, não há assinatura, taxa ou cobranças para este software fora dos serviços que você deseja usar com ele.",
    part2:
      "AnythingLLM é a maneira mais fácil de reunir produtos de IA poderosos como OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB e outros serviços em um pacote organizado sem complicações para aumentar sua produtividade em 100x.",
    part3:
      "AnythingLLM pode ser executado totalmente localmente em sua máquina com pouca sobrecarga que você nem perceberá que está lá! Não é necessário GPU. A instalação em nuvem e localmente também está disponível.\nO ecossistema de ferramentas de IA fica mais poderoso a cada dia. AnythingLLM facilita o uso.",
    githubIssue: "Criar uma issue no Github",
    user1: "Como eu começo?!",
    part4:
      'É simples. Todas as coleções são organizadas em grupos que chamamos de "Workspaces". Workspaces são grupos de arquivos, documentos, imagens, PDFs e outros arquivos que serão transformados em algo que os LLMs podem entender e usar em conversas.\n\nVocê pode adicionar e remover arquivos a qualquer momento.',
    createWorkspace: "Crie seu primeiro workspace",
    user2:
      "Isso é como um Dropbox de IA ou algo assim? E quanto a conversar? Não é um chatbot?",
    part5:
      "AnythingLLM é mais do que um Dropbox mais inteligente.\n\nAnythingLLM oferece duas maneiras de conversar com seus dados:\n\n<i>Consulta:</i> Seus chats retornarão dados ou inferências encontradas com os documentos em seu workspace ao qual tem acesso. Adicionar mais documentos ao Workspace o torna mais inteligente!\n\n<i>Conversacional:</i> Seus documentos + seu histórico de chat em andamento contribuem para o conhecimento do LLM ao mesmo tempo. Ótimo para adicionar informações em tempo real baseadas em texto ou correções e mal-entendidos que o LLM possa ter.\n\nVocê pode alternar entre qualquer modo \n<i>no meio da conversa!</i>",
    user3: "Uau, isso soa incrível, deixe-me experimentar já!",
    part6: "Divirta-se!",
    starOnGithub: "Dar estrela no GitHub",
    contact: "Contato Mintplex Labs",
  },

  "new-workspace": {
    title: "Novo Workspace",
    placeholder: "Meu Workspace",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "Configurações Gerais",
    chat: "Configurações de Chat",
    vector: "Banco de Dados Vetorial",
    members: "Membros",
    agent: "Configuração do Agente",
  },

  // General Appearance
  general: {
    vector: {
      title: "Contagem de Vetores",
      description: "Número total de vetores no seu banco de dados vetorial.",
    },
    names: {
      description: "Isso mudará apenas o nome de exibição do seu workspace.",
    },
    message: {
      title: "Mensagens de Chat Sugeridas",
      description:
        "Personalize as mensagens que serão sugeridas aos usuários do seu workspace.",
      add: "Adicionar nova mensagem",
      save: "Salvar Mensagens",
      heading: "Explique para mim",
      body: "os benefícios do AnythingLLM",
    },
    pfp: {
      title: "Imagem de Perfil do Assistente",
      description:
        "Personalize a imagem de perfil do assistente para este workspace.",
      image: "Imagem do Workspace",
      remove: "Remover Imagem do Workspace",
    },
    delete: {
      title: "Excluir Workspace",
      description:
        "Excluir este workspace e todos os seus dados. Isso excluirá o workspace para todos os usuários.",
      delete: "Excluir Workspace",
      deleting: "Excluindo Workspace...",
      "confirm-start": "Você está prestes a excluir todo o seu",
      "confirm-end":
        "workspace. Isso removerá todas as incorporações vetoriais no seu banco de dados vetorial.\n\nOs arquivos de origem originais permanecerão intactos. Esta ação é irreversível.",
    },
  },

  // Chat Settings
  chat: {
    llm: {
      title: "Provedor de LLM do Workspace",
      description:
        "O provedor e modelo específico de LLM que será usado para este workspace. Por padrão, usa o provedor e as configurações do sistema LLM.",
      search: "Pesquisar todos os provedores de LLM",
    },
    model: {
      title: "Modelo de Chat do Workspace",
      description:
        "O modelo de chat específico que será usado para este workspace. Se vazio, usará a preferência do LLM do sistema.",
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
      recommend: "Recomendado: 20. ",
      "desc-end":
        "Qualquer coisa acima de 45 provavelmente levará a falhas contínuas de chat dependendo do tamanho da mensagem.",
    },
    prompt: {
      title: "Prompt",
      description:
        "O prompt que será usado neste workspace. Defina o contexto e as instruções para que a IA gere uma resposta. Você deve fornecer um prompt cuidadosamente elaborado para que a IA possa gerar uma resposta relevante e precisa.",
    },
    refusal: {
      title: "Resposta de Recusa no Modo de Consulta",
      "desc-start": "Quando estiver no modo",
      query: "consulta",
      "desc-end":
        ", você pode querer retornar uma resposta de recusa personalizada quando nenhum contexto for encontrado.",
    },
    temperature: {
      title: "Temperatura do LLM",
      "desc-start":
        'Esta configuração controla o quão "criativas" serão as respostas do seu LLM.',
      "desc-end":
        "Quanto maior o número, mais criativa será a resposta. Para alguns modelos, isso pode levar a respostas incoerentes quando configurado muito alto.",
      hint: "A maioria dos LLMs tem vários intervalos aceitáveis de valores válidos. Consulte seu provedor de LLM para essa informação.",
    },
  },

  // Vector Database
  "vector-workspace": {
    identifier: "Identificador do Banco de Dados Vetorial",
    snippets: {
      title: "Máximo de Trechos de Contexto",
      description:
        "Esta configuração controla a quantidade máxima de trechos de contexto que será enviada ao LLM por chat ou consulta.",
      recommend: "Recomendado: 4",
    },
    doc: {
      title: "Limite de Similaridade de Documentos",
      description:
        "A pontuação mínima de similaridade necessária para que uma fonte seja considerada relacionada ao chat. Quanto maior o número, mais semelhante a fonte deve ser ao chat.",
      zero: "Sem restrição",
      low: "Baixo (pontuação de similaridade ≥ 0,25)",
      medium: "Médio (pontuação de similaridade ≥ 0,50)",
      high: "Alto (pontuação de similaridade ≥ 0,75)",
    },
    reset: {
      reset: "Redefinir Banco de Dados Vetorial",
      resetting: "Limpando vetores...",
      confirm:
        "Você está prestes a redefinir o banco de dados vetorial deste workspace. Isso removerá todas as incorporações vetoriais atualmente embutidas.\n\nOs arquivos de origem originais permanecerão intactos. Esta ação é irreversível.",
      error: "O banco de dados vetorial do workspace não pôde ser redefinido!",
      success:
        "O banco de dados vetorial do workspace foi redefinido com sucesso!",
    },
  },

  // Agent Configuration
  agent: {
    "performance-warning":
      "O desempenho dos LLMs que não suportam explicitamente a chamada de ferramentas depende muito das capacidades e da precisão do modelo. Algumas habilidades podem ser limitadas ou não funcionais.",
    provider: {
      title: "Provedor de LLM do Agente do Workspace",
      description:
        "O provedor e modelo específico de LLM que será usado para o agente @agent deste workspace.",
    },
    mode: {
      chat: {
        title: "Modelo de Chat do Agente do Workspace",
        description:
          "O modelo de chat específico que será usado para o agente @agent deste workspace.",
      },
      title: "Modelo do Agente do Workspace",
      description:
        "O modelo de LLM específico que será usado para o agente @agent deste workspace.",
      wait: "-- aguardando modelos --",
    },

    skill: {
      title: "Habilidades padrão do agente",
      description:
        "Melhore as habilidades naturais do agente padrão com essas habilidades pré-construídas. Esta configuração se aplica a todos os workspaces.",
      rag: {
        title: "RAG e memória de longo prazo",
        description:
          'Permitir que o agente utilize seus documentos locais para responder a uma consulta ou pedir ao agente para "lembrar" peças de conteúdo para recuperação de memória de longo prazo.',
      },
      view: {
        title: "Visualizar e resumir documentos",
        description:
          "Permitir que o agente liste e resuma o conteúdo dos arquivos do workspace atualmente incorporados.",
      },
      scrape: {
        title: "Raspagem de sites",
        description:
          "Permitir que o agente visite e raspe o conteúdo de sites.",
      },
      generate: {
        title: "Gerar gráficos",
        description:
          "Habilitar o agente padrão para gerar vários tipos de gráficos a partir dos dados fornecidos ou dados no chat.",
      },
      save: {
        title: "Gerar e salvar arquivos no navegador",
        description:
          "Habilitar o agente padrão para gerar e gravar arquivos que podem ser salvos e baixados no seu navegador.",
      },
      web: {
        title: "Pesquisa e navegação na web ao vivo",
        "desc-start":
          "Permitir que seu agente pesquise na web para responder suas perguntas conectando-se a um provedor de pesquisa na web (SERP).",
        "desc-end":
          "A pesquisa na web durante as sessões do agente não funcionará até que isso seja configurado.",
      },
    },
  },

  // Workspace Chats
  recorded: {
    title: "Chats do Workspace",
    description:
      "Estes são todos os chats e mensagens gravados que foram enviados pelos usuários ordenados por data de criação.",
    export: "Exportar",
    table: {
      id: "Id",
      by: "Enviado Por",
      workspace: "Workspace",
      prompt: "Prompt",
      response: "Resposta",
      at: "Enviado Em",
    },
  },

  // Appearance
  appearance: {
    title: "Aparência",
    description: "Personalize as configurações de aparência da sua plataforma.",
    logo: {
      title: "Personalizar Logo",
      description:
        "Envie seu logotipo personalizado para tornar seu chatbot seu.",
      add: "Adicionar um logotipo personalizado",
      recommended: "Tamanho recomendado: 800 x 200",
      remove: "Remover",
      replace: "Substituir",
    },
    message: {
      title: "Personalizar Mensagens",
      description:
        "Personalize as mensagens automáticas exibidas aos seus usuários.",
      new: "Novo",
      system: "sistema",
      user: "usuário",
      message: "mensagem",
      assistant: "Assistente de Chat AnythingLLM",
      "double-click": "Clique duas vezes para editar...",
      save: "Salvar Mensagens",
    },
    icons: {
      title: "Ícones de Rodapé Personalizados",
      description:
        "Personalize os ícones de rodapé exibidos na parte inferior da barra lateral.",
      icon: "Ícone",
      link: "Link",
    },
  },

  // API Keys
  api: {
    title: "Chaves API",
    description:
      "As chaves API permitem que o titular acesse e gerencie programaticamente esta instância do AnythingLLM.",
    link: "Leia a documentação da API",
    generate: "Gerar Nova Chave API",
    table: {
      key: "Chave API",
      by: "Criado Por",
      created: "Criado",
    },
  },

  llm: {
    title: "Preferência de LLM",
    description:
      "Estas são as credenciais e configurações para seu provedor preferido de chat e incorporação de LLM. É importante que essas chaves estejam atualizadas e corretas, caso contrário, o AnythingLLM não funcionará corretamente.",
    provider: "Provedor de LLM",
  },

  transcription: {
    title: "Preferência de Modelo de Transcrição",
    description:
      "Estas são as credenciais e configurações para seu provedor preferido de modelo de transcrição. É importante que essas chaves estejam atualizadas e corretas, caso contrário, os arquivos de mídia e áudio não serão transcritos.",
    provider: "Provedor de Transcrição",
    "warn-start":
      "Usar o modelo whisper local em máquinas com RAM ou CPU limitados pode travar o AnythingLLM ao processar arquivos de mídia.",
    "warn-recommend":
      "Recomendamos pelo menos 2GB de RAM e upload de arquivos <10Mb.",
    "warn-end":
      "O modelo embutido será baixado automaticamente no primeiro uso.",
  },

  embedding: {
    title: "Preferência de Incorporação",
    "desc-start":
      "Ao usar um LLM que não suporta nativamente um mecanismo de incorporação - pode ser necessário especificar adicionalmente as credenciais para incorporação de texto.",
    "desc-end":
      "A incorporação é o processo de transformar texto em vetores. Essas credenciais são necessárias para transformar seus arquivos e prompts em um formato que o AnythingLLM possa usar para processar.",
    provider: {
      title: "Provedor de Incorporação",
      description:
        "Não é necessária configuração ao usar o mecanismo de incorporação nativo do AnythingLLM.",
    },
  },

  text: {
    title: "Preferências de Divisão e Fragmentação de Texto",
    "desc-start":
      "Às vezes, você pode querer alterar a maneira padrão como novos documentos são divididos e fragmentados antes de serem inseridos em seu banco de dados de vetores.",
    "desc-end":
      "Você só deve modificar esta configuração se entender como a divisão de texto funciona e seus efeitos colaterais.",
    "warn-start": "As alterações aqui se aplicarão apenas a",
    "warn-center": "documentos recém-incorporados",
    "warn-end": ", não documentos existentes.",
    size: {
      title: "Tamanho do Fragmento de Texto",
      description:
        "Este é o comprimento máximo de caracteres que pode estar presente em um único vetor.",
      recommend: "O comprimento máximo do modelo de incorporação é",
    },

    overlap: {
      title: "Sobreposição de Fragmento de Texto",
      description:
        "Esta é a sobreposição máxima de caracteres que ocorre durante a fragmentação entre dois fragmentos de texto adjacentes.",
    },
  },

  // Vector Database
  vector: {
    title: "Banco de Dados Vetorial",
    description:
      "Estas são as credenciais e configurações de como sua instância do AnythingLLM funcionará. É importante que essas chaves estejam atualizadas e corretas.",
    provider: {
      title: "Provedor de Banco de Dados Vetorial",
      description: "Não há configuração necessária para o LanceDB.",
    },
  },

  // Embeddable Chat Widgets
  embeddable: {
    title: "Widgets de Chat Incorporáveis",
    description:
      "Os widgets de chat incorporáveis são interfaces de chat públicas vinculadas a um único workspace. Eles permitem que você construa workspaces que você pode publicar para o mundo.",
    create: "Criar incorporação",
    table: {
      workspace: "Workspace",
      chats: "Chats Enviados",
      Active: "Domínios Ativos",
    },
  },

  "embed-chats": {
    title: "Incorporar Chats",
    description:
      "Estes são todos os chats e mensagens registrados de qualquer incorporação que você publicou.",
    table: {
      embed: "Incorporação",
      sender: "Remetente",
      message: "Mensagem",
      response: "Resposta",
      at: "Enviado Em",
    },
  },

  multi: {
    title: "Modo Multiusuário",
    description:
      "Configure sua instância para suportar sua equipe ativando o Modo Multiusuário.",
    enable: {
      "is-enable": "Modo Multiusuário está Ativado",
      enable: "Ativar Modo Multiusuário",
      description:
        "Por padrão, você será o único administrador. Como administrador, você precisará criar contas para todos os novos usuários ou administradores. Não perca sua senha, pois apenas um usuário Administrador pode redefinir senhas.",
      username: "Nome de usuário da conta de Administrador",
      password: "Senha da conta de Administrador",
    },
    password: {
      title: "Proteção por Senha",
      description:
        "Proteja sua instância do AnythingLLM com uma senha. Se você esquecer esta senha, não há método de recuperação, então certifique-se de salvar esta senha.",
    },
    instance: {
      title: "Proteger Instância com Senha",
      description:
        "Por padrão, você será o único administrador. Como administrador, você precisará criar contas para todos os novos usuários ou administradores. Não perca sua senha, pois apenas um usuário Administrador pode redefinir senhas.",
      password: "Senha da instância",
    },
  },

  // Event Logs
  event: {
    title: "Logs de Eventos",
    description:
      "Veja todas as ações e eventos acontecendo nesta instância para monitoramento.",
    clear: "Limpar Logs de Eventos",
    table: {
      type: "Tipo de Evento",
      user: "Usuário",
      occurred: "Ocorreu Em",
    },
  },

  // Privacy & Data-Handling
  privacy: {
    title: "Privacidade e Tratamento de Dados",
    description:
      "Esta é a sua configuração de como os provedores de terceiros conectados e o AnythingLLM tratam seus dados.",
    llm: "Seleção de LLM",
    embedding: "Preferência de Incorporação",
    vector: "Banco de Dados Vetorial",
    anonymous: "Telemetria Anônima Ativada",
  },
};

export default TRANSLATIONS;
