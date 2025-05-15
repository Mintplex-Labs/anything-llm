// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "欢迎使用",
      getStarted: "开始",
    },
    llm: {
      title: "LLM 偏好",
      description:
        "AnythingLLM 可以与多家 LLM 提供商合作。这将是处理聊天的服务。",
    },
    userSetup: {
      title: "用户设置",
      description: "配置你的用户设置。",
      howManyUsers: "将有多少用户使用此实例？",
      justMe: "只有我",
      myTeam: "我的团队",
      instancePassword: "实例密码",
      setPassword: "你想要设置密码吗？",
      passwordReq: "密码必须至少包含 8 个字符。",
      passwordWarn: "保存此密码很重要，因为没有恢复方法。",
      adminUsername: "管理员账户用户名",
      adminUsernameReq:
        "用户名必须至少为 6 个字符，并且只能包含小写字母、数字、下划线和连字符，不含空格。",
      adminPassword: "管理员账户密码",
      adminPasswordReq: "密码必须至少包含 8 个字符。",
      teamHint:
        "默认情况下，你将是唯一的管理员。完成初始设置后，你可以创建和邀请其他人成为用户或管理员。不要丢失你的密码，因为只有管理员可以重置密码。",
    },
    data: {
      title: "数据处理与隐私",
      description: "我们致力于在涉及你的个人数据时提供透明度和控制权。",
      settingsHint: "这些设置可以随时在设置中重新配置。",
    },
    survey: {
      title: "欢迎使用 AnythingLLM",
      description: "帮助我们为你的需求打造 AnythingLLM。可选。",
      email: "你的电子邮件是什么？",
      useCase: "你将如何使用 AnythingLLM？",
      useCaseWork: "用于工作",
      useCasePersonal: "用于个人使用",
      useCaseOther: "其他",
      comment: "你是如何听说 AnythingLLM 的？",
      commentPlaceholder:
        "Reddit，Twitter，GitHub，YouTube 等 - 让我们知道你是如何找到我们的！",
      skip: "跳过调查",
      thankYou: "感谢你的反馈！",
    },
    workspace: {
      title: "创建你的第一个工作区",
      description: "创建你的第一个工作区并开始使用 AnythingLLM。",
    },
  },
  common: {
    "workspaces-name": "工作区名称",
    error: "错误",
    success: "成功",
    user: "用户",
    selection: "模型选择",
    save: "保存更改",
    saving: "保存中...",
    previous: "上一页",
    next: "下一页",
    optional: "可选",
    yes: "是",
    no: "否",
  },
  settings: {
    title: "设置",
    system: "系统",
    invites: "邀请",
    users: "用户",
    workspaces: "工作区",
    "workspace-chats": "对话历史记录",
    customization: "外观",
    interface: "界面偏好",
    branding: "品牌与白标签化",
    chat: "聊天",
    "api-keys": "开发者API",
    llm: "大语言模型（LLM）",
    transcription: "转录模型",
    embedder: "嵌入器（Embedder）",
    "text-splitting": "文本分割",
    "voice-speech": "语音和讲话",
    "vector-database": "向量数据库",
    embeds: "嵌入式对话",
    "embed-chats": "嵌入式对话历史记录",
    security: "用户与安全",
    "event-logs": "事件日志",
    privacy: "隐私与数据",
    "ai-providers": "人工智能提供商",
    "agent-skills": "代理技能",
    admin: "管理员",
    tools: "工具",
    "experimental-features": "实验功能",
    contact: "联系支持",
    "browser-extension": "浏览器扩展",
    "system-prompt-variables": "系统提示变量",
  },
  login: {
    "multi-user": {
      welcome: "欢迎！",
      "placeholder-username": "请输入用户名",
      "placeholder-password": "请输入密码",
      login: "登录",
      validating: "正在验证...",
      "forgot-pass": "忘记密码",
      reset: "重置",
    },
    "sign-in": {
      start: "登录你的",
      end: "账户",
    },
    "password-reset": {
      title: "重置密码",
      description: "请提供以下必要信息以重置你的密码。",
      "recovery-codes": "恢复代码",
      "recovery-code": "恢复代码 {{index}}",
      "back-to-login": "返回登录",
    },
  },
  welcomeMessage: {
    part1:
      "欢迎使用 AnythingLLM，这是由 Mintplex Labs 开发的开源 AI 工具，可以将任何东西转换为你可以查询和聊天的训练有素的聊天机器人。AnythingLLM 是一款 BYOK（自带密钥）软件，因此除了你想使用的服务外，此软件不收取订阅费、费用或其他费用。",
    part2:
      "AnythingLLM 是将强大的 AI 产品（如 OpenAi、GPT-4、LangChain、PineconeDB、ChromaDB 等）整合在一个整洁的包中而无需繁琐操作的最简单方法，可以将你的生产力提高 100 倍。",
    part3:
      "AnythingLLM 可以完全在你的本地计算机上运行，几乎没有开销，你甚至不会注意到它的存在！无需 GPU。也可以进行云端和本地安装。\nAI 工具生态系统每天都在变得更强大。AnythingLLM 使其易于使用。",
    githubIssue: "在 GitHub 上创建问题",
    user1: "我该如何开始?!",
    part4:
      "很简单。所有集合都组织成我们称之为“工作区”的桶。工作区是文件、文档、图像、PDF 和其他文件的存储桶，这些文件将被转换为 LLM 可以理解和在对话中使用的内容。\n\n你可以随时添加和删除文件。",
    createWorkspace: "创建你的第一个工作区",
    user2: "这像是一个 AI Dropbox 吗？那么聊天呢？它是一个聊天机器人，不是吗？",
    part5:
      "AnythingLLM 不仅仅是一个更智能的 Dropbox。\n\nAnythingLLM 提供了两种与你的数据交流的方式：\n\n<i>查询：</i> 你的聊天将返回在你的工作区中访问的文档中找到的数据或推论。向工作区添加更多文档会使其更智能！\n\n<i>对话：</i> 你的文档和正在进行的聊天记录同时为 LLM 知识做出贡献。非常适合添加基于文本的实时信息或纠正 LLM 可能存在的误解。\n\n你可以在聊天过程中 <i>切换模式！</i>",
    user3: "哇，这听起来很棒，让我马上试试！",
    part6: "玩得开心！",
    starOnGitHub: "在 GitHub 上加星",
    contact: "联系 Mintplex Labs",
  },
  "main-page": {
    noWorkspaceError: "请在开始聊天前创建一个工作区。",
    checklist: {
      title: "入门指南",
      tasksLeft: "剩余任务",
      completed: "你正在成为AnythingLLM专家的路上！",
      dismiss: "关闭",
      tasks: {
        create_workspace: {
          title: "创建工作区",
          description: "创建你的第一个工作区以开始使用",
          action: "创建",
        },
        send_chat: {
          title: "发送聊天",
          description: "开始与你的AI助手对话",
          action: "聊天",
        },
        embed_document: {
          title: "嵌入文档",
          description: "添加你的第一个文档到工作区",
          action: "嵌入",
        },
        setup_system_prompt: {
          title: "设置系统提示",
          description: "配置你的AI助手的行为",
          action: "设置",
        },
        define_slash_command: {
          title: "定义斜杠命令",
          description: "为你的助手创建自定义命令",
          action: "定义",
        },
        visit_community: {
          title: "访问社区中心",
          description: "探索社区资源和模板",
          action: "浏览",
        },
      },
    },
    quickLinks: {
      title: "快捷链接",
      sendChat: "发送聊天",
      embedDocument: "嵌入文档",
      createWorkspace: "创建工作区",
    },
    exploreMore: {
      title: "探索更多功能",
      features: {
        customAgents: {
          title: "自定义AI代理",
          description: "无需编程即可构建强大的AI代理和自动化流程。",
          primaryAction: "使用@agent聊天",
          secondaryAction: "构建代理流程",
        },
        slashCommands: {
          title: "斜杠命令",
          description: "使用自定义斜杠命令节省时间并注入提示。",
          primaryAction: "创建斜杠命令",
          secondaryAction: "在中心探索",
        },
        systemPrompts: {
          title: "系统提示",
          description: "修改系统提示以自定义工作区的AI回复。",
          primaryAction: "修改系统提示",
          secondaryAction: "管理提示变量",
        },
      },
    },
    announcements: {
      title: "更新与公告",
    },
    resources: {
      title: "资源",
      links: {
        docs: "文档",
        star: "在Github上加星标",
      },
    },
  },
  "new-workspace": {
    title: "新工作区",
    placeholder: "我的工作区",
  },
  "workspaces—settings": {
    general: "通用设置",
    chat: "聊天设置",
    vector: "向量数据库",
    members: "成员",
    agent: "代理配置",
  },
  general: {
    vector: {
      title: "向量数量",
      description: "向量数据库中的总向量数。",
    },
    names: {
      description: "这只会更改工作区的显示名称。",
    },
    message: {
      title: "建议的聊天消息",
      description: "自定义将向你的工作区用户建议的消息。",
      add: "添加新消息",
      save: "保存消息",
      heading: "向我解释",
      body: "AnythingLLM 的好处",
    },
    pfp: {
      title: "助理头像",
      description: "为此工作区自定义助手的个人资料图像。",
      image: "工作区图像",
      remove: "移除工作区图像",
    },
    delete: {
      title: "删除工作区",
      description: "删除此工作区及其所有数据。这将删除所有用户的工作区。",
      delete: "删除工作区",
      deleting: "正在删除工作区...",
      "confirm-start": "你即将删除整个",
      "confirm-end":
        "工作区。这将删除矢量数据库中的所有矢量嵌入。\n\n原始源文件将保持不变。此操作是不可逆转的。",
    },
  },
  chat: {
    llm: {
      title: "工作区 LLM 提供者",
      description:
        "将用于此工作区的特定 LLM 提供商和模型。默认情况下，它使用系统 LLM 提供程序和设置。",
      search: "搜索所有 LLM 提供商",
    },
    model: {
      title: "工作区聊天模型",
      description:
        "将用于此工作区的特定聊天模型。如果为空，将使用系统 LLM 首选项。",
      wait: "-- 等待模型 --",
    },
    mode: {
      title: "聊天模式",
      chat: {
        title: "聊天",
        "desc-start": "将提供 LLM 的一般知识",
        and: "和",
        "desc-end": "找到的文档上下文的答案。",
      },
      query: {
        title: "查询",
        "desc-start": "将会提供答案",
        only: "仅当",
        "desc-end": "找到文档上下文时。",
      },
    },
    history: {
      title: "聊天历史记录",
      "desc-start": "将包含在响应的短期记忆中的先前聊天的数量。",
      recommend: "推荐 20。",
      "desc-end":
        "任何超过 45 的值都可能导致连续聊天失败，具体取决于消息大小。",
    },
    prompt: {
      title: "系统提示词",
      description:
        "将在此工作区上使用的提示词。定义 AI 生成响应的上下文和指令。你应该提供精心设计的提示，以便人工智能可以生成相关且准确的响应。",
      history: {
        title: "系统提示词历史",
        clearAll: "全部清除",
        noHistory: "没有可用的系统提示词历史记录",
        restore: "恢复",
        delete: "删除",
        deleteConfirm: "您确定要删除此历史记录吗？",
        clearAllConfirm: "您确定要清除所有历史记录吗？此操作无法撤消。",
        expand: "展开",
      },
    },
    refusal: {
      title: "查询模式拒绝响应",
      "desc-start": "当处于",
      query: "查询",
      "desc-end": "模式时，当未找到上下文时，你可能希望返回自定义拒绝响应。",
    },
    temperature: {
      title: "LLM 温度",
      "desc-start": "此设置控制你的 LLM 回答的“创意”程度",
      "desc-end":
        "数字越高越有创意。对于某些模型，如果设置得太高，可能会导致响应不一致。",
      hint: "大多数 LLM 都有各种可接受的有效值范围。请咨询你的LLM提供商以获取该信息。",
    },
  },
  "vector-workspace": {
    identifier: "向量数据库标识符",
    snippets: {
      title: "最大上下文片段",
      description:
        "此设置控制每次聊天或查询将发送到 LLM 的上下文片段的最大数量。",
      recommend: "推荐: 4",
    },
    doc: {
      title: "文档相似性阈值",
      description:
        "源被视为与聊天相关所需的最低相似度分数。数字越高，来源与聊天就越相似。",
      zero: "无限制",
      low: "低（相似度分数 ≥ .25）",
      medium: "中（相似度分数 ≥ .50）",
      high: "高（相似度分数 ≥ .75）",
    },
    reset: {
      reset: "重置向量数据库",
      resetting: "清除向量...",
      confirm:
        "你将重置此工作区的矢量数据库。这将删除当前嵌入的所有矢量嵌入。\n\n原始源文件将保持不变。此操作是不可逆转的。",
      success: "向量数据库已重置。",
      error: "无法重置工作区向量数据库！",
    },
  },
  agent: {
    "performance-warning":
      "不明确支持工具调用的 LLMs 的性能高度依赖于模型的功能和准确性。有些能力可能受到限制或不起作用。",
    provider: {
      title: "工作区代理 LLM 提供商",
      description: "将用于此工作区的 @agent 代理的特定 LLM 提供商和模型。",
    },
    mode: {
      chat: {
        title: "工作区代理聊天模型",
        description: "将用于此工作区的 @agent 代理的特定聊天模型。",
      },
      title: "工作区代理模型",
      description: "将用于此工作区的 @agent 代理的特定 LLM 模型。",
      wait: "-- 等待模型 --",
    },
    skill: {
      title: "默认代理技能",
      description:
        "使用这些预构建的技能提高默认代理的自然能力。此设置适用于所有工作区。",
      rag: {
        title: "检索增强生成和长期记忆",
        description:
          '允许代理利用你的本地文档来回答查询，或要求代理"记住"长期记忆检索的内容片段。',
      },
      view: {
        title: "查看和总结文档",
        description: "允许代理列出和总结当前嵌入的工作区文件的内容。",
      },
      scrape: {
        title: "抓取网站",
        description: "允许代理访问和抓取网站的内容。",
      },
      generate: {
        title: "生成图表",
        description: "使默认代理能够从提供的数据或聊天中生成各种类型的图表。",
      },
      save: {
        title: "生成并保存文件到浏览器",
        description:
          "使默认代理能够生成并写入文件，这些文件可以保存并在你的浏览器中下载。",
      },
      web: {
        title: "实时网络搜索和浏览",
        "desc-start":
          "通过连接到网络搜索（搜索结果页）提供者，使你的代理能够搜索网络以回答你的问题。",
        "desc-end": "在代理会话期间，网络搜索将不起作用，直到此设置完成。",
      },
    },
  },
  recorded: {
    title: "工作区聊天历史记录",
    description: "这些是用户发送的所有聊天记录和消息，按创建日期排序。",
    export: "导出",
    table: {
      id: "编号",
      by: "发送者",
      workspace: "工作区",
      prompt: "提示词",
      response: "响应",
      at: "发送时间",
    },
  },
  customization: {
    interface: {
      title: "界面偏好设置",
      description: "设置您的 AnythingLLM 界面偏好。",
    },
    branding: {
      title: "品牌与白标设置",
      description: "使用自定义品牌对白标您的 AnythingLLM 实例。",
    },
    chat: {
      title: "聊天",
      description: "设置您的 AnythingLLM 聊天偏好。",
      auto_submit: {
        title: "自动提交语音输入",
        description: "在静音一段时间后自动提交语音输入",
      },
      auto_speak: {
        title: "自动语音回复",
        description: "自动朗读 AI 的回复内容",
      },
      spellcheck: {
        title: "启用拼写检查",
        description: "在聊天输入框中启用或禁用拼写检查",
      },
    },
    items: {
      theme: {
        title: "主题",
        description: "选择您偏好的应用配色主题。",
      },
      "show-scrollbar": {
        title: "显示滚动条",
        description: "启用或禁用聊天窗口中的滚动条。",
      },
      "support-email": {
        title: "客服邮箱",
        description: "设置用户在需要帮助时可联系的客服邮箱地址。",
      },
      "app-name": {
        title: "名称",
        description: "设置所有用户在登录页面看到的名称。",
      },
      "chat-message-alignment": {
        title: "聊天消息对齐方式",
        description: "选择在聊天界面中使用的消息对齐模式。",
      },
      "display-language": {
        title: "显示语言",
        description: "选择显示 AnythingLLM 界面所用的语言（若有翻译可用）。",
      },
      logo: {
        title: "品牌标志",
        description: "上传您的自定义标志以在所有页面展示。",
        add: "添加自定义标志",
        recommended: "推荐尺寸：800 x 200",
        remove: "移除",
        replace: "替换",
      },
      "welcome-messages": {
        title: "欢迎信息",
        description: "自定义显示给用户的欢迎信息。仅非管理员用户可见这些信息。",
        new: "新建",
        system: "系统",
        user: "用户",
        message: "信息",
        assistant: "AnythingLLM 聊天助手",
        "double-click": "双击进行编辑...",
        save: "保存信息",
      },
      "browser-appearance": {
        title: "浏览器外观",
        description: "自定义应用打开时浏览器标签和标题的外观。",
        tab: {
          title: "标题",
          description: "设置应用在浏览器中打开时的自定义标签标题。",
        },
        favicon: {
          title: "网站图标",
          description: "为浏览器标签使用自定义网站图标。",
        },
      },
      "sidebar-footer": {
        title: "侧边栏底部项目",
        description: "自定义显示在侧边栏底部的项目。",
        icon: "图标",
        link: "链接",
      },
    },
  },
  api: {
    title: "API 密钥",
    description: "API 密钥允许持有者以编程方式访问和管理此 AnythingLLM 实例。",
    link: "阅读 API 文档",
    generate: "生成新的 API 密钥",
    table: {
      key: "API 密钥",
      by: "创建者",
      created: "创建时间",
    },
  },
  llm: {
    title: "LLM 首选项",
    description:
      "这些是你首选的 LLM 聊天和嵌入提供商的凭据和设置。重要的是，确保这些密钥是最新的和正确的，否则 AnythingLLM 将无法正常运行。",
    provider: "LLM 提供商",
  },
  transcription: {
    title: "转录模型首选项",
    description:
      "这些是你的首选转录模型提供商的凭据和设置。重要的是这些密钥是最新且正确的，否则媒体文件和音频将无法转录。",
    provider: "转录提供商",
    "warn-start":
      "在 RAM 或 CPU 有限的计算机上使用本地耳语模型可能会在处理媒体文件时停止 AnythingLLM。",
    "warn-recommend": "我们建议至少 2GB RAM 并上传 <10Mb 的文件。",
    "warn-end": "内置模型将在首次使用时自动下载。",
  },
  embedding: {
    title: "嵌入首选项",
    "desc-start":
      "当使用本身不支持嵌入引擎的 LLM 时，你可能需要额外指定用于嵌入文本的凭据。",
    "desc-end":
      "嵌入是将文本转换为矢量的过程。需要这些凭据才能将你的文件和提示转换为 AnythingLLM 可以用来处理的格式。",
    provider: {
      title: "嵌入引擎提供商",
      description: "使用 AnythingLLM 的本机嵌入引擎时不需要设置。",
    },
  },
  text: {
    title: "文本拆分和分块首选项",
    "desc-start":
      "有时，你可能希望更改新文档在插入到矢量数据库之前拆分和分块的默认方式。",
    "desc-end": "只有在了解文本拆分的工作原理及其副作用时，才应修改此设置。",
    "warn-start": "此处的更改仅适用于",
    "warn-center": "新嵌入的文档",
    "warn-end": "，而不是现有文档。",
    size: {
      title: "文本块大小",
      description: "这是单个向量中可以存在的字符的最大长度。",
      recommend: "嵌入模型的最大长度为",
    },
    overlap: {
      title: "文本块重叠",
      description: "这是在两个相邻文本块之间分块期间发生的最大字符重叠。",
    },
  },
  vector: {
    title: "向量数据库",
    description:
      "这些是 AnythingLLM 实例如何运行的凭据和设置。重要的是，这些密钥是最新的和正确的。",
    provider: {
      title: "向量数据库提供商",
      description: "LanceDB 不需要任何配置。",
    },
  },
  embeddable: {
    title: "可嵌入的聊天小部件",
    description:
      "可嵌入的聊天小部件是与单个工作区绑定的面向公众的聊天界面。这些允许你构建工作区，然后你可以将其发布到全世界。",
    create: "创建嵌入式对话",
    table: {
      workspace: "工作区",
      chats: "已发送聊天",
      Active: "活动域",
    },
  },
  "embed-chats": {
    title: "嵌入的聊天历史纪录",
    export: "导出",
    description: "这些是你发布的任何嵌入的所有记录的聊天和消息。",
    table: {
      embed: "嵌入",
      sender: "发送者",
      message: "消息",
      response: "响应",
      at: "发送时间",
    },
  },
  multi: {
    title: "多用户模式",
    description: "通过激活多用户模式来设置你的实例以支持你的团队。",
    enable: {
      "is-enable": "多用户模式已启用",
      enable: "启用多用户模式",
      description:
        "默认情况下，你将是唯一的管理员。作为管理员，你需要为所有新用户或管理员创建账户。不要丢失你的密码，因为只有管理员用户可以重置密码。",
      username: "管理员账户用户名",
      password: "管理员账户密码",
    },
    password: {
      title: "密码保护",
      description:
        "用密码保护你的AnythingLLM实例。如果你忘记了密码，那么没有恢复方法，所以请确保保存这个密码。",
    },
    instance: {
      title: "实例密码保护",
      description:
        "默认情况下，你将是唯一的管理员。作为管理员，你需要为所有新用户或管理员创建账户。不要丢失你的密码，因为只有管理员用户可以重置密码。",
      password: "实例密码",
    },
  },
  event: {
    title: "事件日志",
    description: "查看此实例上发生的所有操作和事件以进行监控。",
    clear: "清除事件日志",
    table: {
      type: "事件类型",
      user: "用户",
      occurred: "发生时间",
    },
  },
  privacy: {
    title: "隐私和数据处理",
    description:
      "这是你对如何处理连接的第三方提供商和AnythingLLM的数据的配置。",
    llm: "LLM 选择",
    embedding: "嵌入首选项",
    vector: "向量数据库",
    anonymous: "启用匿名遥测",
  },
  connectors: {
    "search-placeholder": "搜索数据连接器",
    "no-connectors": "未找到数据连接器。",
    github: {
      name: "GitHub 仓库",
      description: "一键导入整个公共或私有的 GitHub 仓库。",
      URL: "GitHub 仓库链接",
      URL_explained: "您希望收集的 GitHub 仓库链接。",
      token: "GitHub 访问令牌",
      optional: "可选",
      token_explained: "用于避免速率限制的访问令牌。",
      token_explained_start: "如果没有 ",
      token_explained_link1: "个人访问令牌",
      token_explained_middle:
        "，由于 GitHub API 的速率限制，可能无法收集所有文件。您可以 ",
      token_explained_link2: "创建临时访问令牌",
      token_explained_end: " 来避免此问题。",
      ignores: "文件忽略列表",
      git_ignore:
        ".gitignore 格式的列表，用于在收集过程中忽略特定文件。输入后按回车保存每一项。",
      task_explained: "完成后，所有文件将可用于在文档选择器中嵌入至工作区。",
      branch: "您希望收集文件的分支。",
      branch_loading: "-- 正在加载可用分支 --",
      branch_explained: "您希望收集文件的分支。",
      token_information:
        "如果未填写 <b>GitHub 访问令牌</b>，由于 GitHub 的公共 API 限制，此数据连接器将只能收集仓库的 <b>顶层</b> 文件。",
      token_personal: "在此处使用 GitHub 账户获取免费的个人访问令牌。",
    },
    gitlab: {
      name: "GitLab 仓库",
      description: "一键导入整个公共或私有的 GitLab 仓库。",
      URL: "GitLab 仓库链接",
      URL_explained: "您希望收集的 GitLab 仓库链接。",
      token: "GitLab 访问令牌",
      optional: "可选",
      token_explained: "用于避免速率限制的访问令牌。",
      token_description: "选择要从 GitLab API 获取的额外实体。",
      token_explained_start: "如果没有 ",
      token_explained_link1: "个人访问令牌",
      token_explained_middle:
        "，由于 GitLab API 的速率限制，可能无法收集所有文件。您可以 ",
      token_explained_link2: "创建临时访问令牌",
      token_explained_end: " 来避免此问题。",
      fetch_issues: "将问题作为文档获取",
      ignores: "文件忽略列表",
      git_ignore:
        ".gitignore 格式的列表，用于在收集过程中忽略特定文件。输入后按回车保存每一项。",
      task_explained: "完成后，所有文件将可用于在文档选择器中嵌入至工作区。",
      branch: "您希望收集文件的分支",
      branch_loading: "-- 正在加载可用分支 --",
      branch_explained: "您希望收集文件的分支。",
      token_information:
        "如果未填写 <b>GitLab 访问令牌</b>，由于 GitLab 的公共 API 限制，此数据连接器将只能收集仓库的 <b>顶层</b> 文件。",
      token_personal: "在此处使用 GitLab 账户获取免费的个人访问令牌。",
    },
    youtube: {
      name: "YouTube 字幕",
      description: "通过链接导入整个 YouTube 视频的转录内容。",
      URL: "YouTube 视频链接",
      URL_explained_start:
        "输入任何 YouTube 视频的链接以获取其转录内容。视频必须启用 ",
      URL_explained_link: "隐藏字幕",
      URL_explained_end: " 功能。",
      task_explained: "完成后，转录内容将可用于在文档选择器中嵌入至工作区。",
      language: "字幕语言",
      language_explained: "选择您希望收集的字幕语言。",
      loading_languages: "-- 正在加载可用语言 --",
    },
    "website-depth": {
      name: "批量链接爬虫",
      description: "爬取一个网站及其指定深度的子链接。",
      URL: "网站链接",
      URL_explained: "您希望爬取的网站链接。",
      depth: "爬取深度",
      depth_explained: "这是爬虫从起始链接向下跟踪的子链接层级数量。",
      max_pages: "最大页面数",
      max_pages_explained: "要爬取的最大链接数。",
      task_explained:
        "完成后，所有抓取的内容将可用于在文档选择器中嵌入至工作区。",
    },
    confluence: {
      name: "Confluence",
      description: "一键导入整个 Confluence 页面。",
      deployment_type: "Confluence 部署类型",
      deployment_type_explained:
        "判断您的 Confluence 实例是部署在 Atlassian 云端还是自托管。",
      base_url: "Confluence 基础链接",
      base_url_explained: "这是您 Confluence 空间的基础链接。",
      space_key: "Confluence 空间标识",
      space_key_explained:
        "您将使用的 Confluence 实例空间标识，通常以 ~ 开头。",
      username: "Confluence 用户名",
      username_explained: "您的 Confluence 用户名",
      auth_type: "Confluence 认证方式",
      auth_type_explained: "选择您希望用于访问 Confluence 页面内容的认证方式。",
      auth_type_username: "用户名和访问令牌",
      auth_type_personal: "个人访问令牌",
      token: "Confluence 访问令牌",
      token_explained_start:
        "您需要提供访问令牌用于认证。您可以在此生成访问令牌",
      token_explained_link: "此处",
      token_desc: "用于认证的访问令牌",
      pat_token: "Confluence 个人访问令牌",
      pat_token_explained: "您的 Confluence 个人访问令牌。",
      task_explained: "完成后，页面内容将可用于在文档选择器中嵌入至工作区。",
    },
    manage: {
      documents: "文档",
      "data-connectors": "数据连接器",
      "desktop-only":
        "这些设置只能在桌面设备上编辑。请使用桌面访问此页面以继续操作。",
      dismiss: "关闭",
      editing: "正在编辑",
    },
    directory: {
      "my-documents": "我的文档",
      "new-folder": "新建文件夹",
      "search-document": "搜索文档",
      "no-documents": "暂无文档",
      "move-workspace": "移动到工作区",
      name: "名称",
      "delete-confirmation":
        "您确定要删除这些文件和文件夹吗？\n这将从系统中移除这些文件，并自动将其从所有关联工作区中移除。\n此操作无法撤销。",
      "removing-message":
        "正在删除 {{count}} 个文档和 {{folderCount}} 个文件夹，请稍候。",
      "move-success": "成功移动了 {{count}} 个文档。",
      date: "日期",
      type: "类型",
      no_docs: "暂无文档",
      select_all: "全选",
      deselect_all: "取消全选",
      remove_selected: "移除所选",
      costs: "*嵌入时一次性费用",
      save_embed: "保存并嵌入",
    },
    upload: {
      "processor-offline": "文档处理器不可用",
      "processor-offline-desc":
        "当前文档处理器离线，无法上传文件。请稍后再试。",
      "click-upload": "点击上传或拖放文件",
      "file-types": "支持文本文件、CSV、电子表格、音频文件等！",
      "or-submit-link": "或提交链接",
      "placeholder-link": "https://example.com",
      fetching: "正在获取...",
      "fetch-website": "获取网站",
      "privacy-notice":
        "这些文件将被上传到此 AnythingLLM 实例上的文档处理器。这些文件不会发送或共享给第三方。",
    },
    pinning: {
      what_pinning: "什么是文档固定？",
      pin_explained_block1:
        "当您在 AnythingLLM 中<b>固定</b>一个文档时，我们会将整个文档内容注入到您的提示窗口中，让 LLM 能够完全理解它。",
      pin_explained_block2:
        "这在 <b>大上下文模型</b> 或关键的小文件中效果最佳。",
      pin_explained_block3:
        "如果默认情况下无法从 AnythingLLM 获取满意的答案，固定文档是提高答案质量的好方法。",
      accept: "好的，知道了",
    },
    watching: {
      what_watching: "什么是监控文档？",
      watch_explained_block1:
        "当您在 AnythingLLM 中<b>监控</b>一个文档时，我们会<i>自动</i>按定期间隔从其原始来源同步文档内容。系统会自动更新在所有使用该文档的工作区中的内容。",
      watch_explained_block2:
        "此功能当前仅支持在线内容，不适用于手动上传的文档。",
      watch_explained_block3_start: "您可以在 ",
      watch_explained_block3_link: "文件管理器",
      watch_explained_block3_end: " 管理视图中管理被监控的文档。",
      accept: "好的，知道了",
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
    welcome: "欢迎来到你的新工作区。",
    get_started: "开始使用，请先",
    get_started_default: "开始使用",
    upload: "上传文档",
    or: "或",
    send_chat: "发送一条对话。",
    send_message: "发送消息",
    attach_file: "向此对话附加文件",
    slash: "查看所有可用的聊天斜杠命令。",
    agents: "查看所有可用的聊天助手。",
    text_size: "更改文字大小。",
    microphone: "语音输入你的提示。",
    send: "将提示消息发送到工作区",
    attachments_processing: null,
  },
  profile_settings: {
    edit_account: "编辑帐户",
    profile_picture: "头像",
    remove_profile_picture: "移除头像",
    username: "用户名",
    username_description:
      "用户名必须仅包含小写字母、数字、下划线和连字符，且不能包含空格",
    new_password: "新密码",
    passwort_description: "密码长度必须至少为 8 个字符",
    cancel: "取消",
    update_account: "更新帐号",
    theme: "主题偏好",
    language: "语言偏好",
  },
};

export default TRANSLATIONS;
