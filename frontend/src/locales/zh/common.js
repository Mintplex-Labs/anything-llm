// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
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
  },

  // Setting Sidebar menu items.
  settings: {
    title: "设置",
    system: "系统",
    invites: "邀请",
    users: "用户",
    workspaces: "工作区",
    "workspace-chats": "对话历史记录", //  "workspace-chats" should be  "对话历史记录", means "chat history",or "chat history records"
    customization: "外观",
    "api-keys": "API 密钥",
    llm: "LLM 首选项",
    transcription: "转录模型",
    embedder: "Embedder 首选项",
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
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "欢迎！",
      "placeholder-username": "请输入用户名",
      "placeholder-password": "请输入密码",
      login: "登录",
      validating: "登录",
      "forgot-pass": "忘记密码",
      reset: "重置",
    },
    "sign-in": {
      start: "登录你的",
      end: "账户",
    },
    "password-reset": {
      title: "重置密码",
      description: "请提供以下必要信息以重置您的密码。",
      "recovery-codes": "恢复代码",
      "recovery-code": "恢复代码 {{index}}",
      "back-to-login": "返回登录",
    },
  },

  welcomeMessage: {
    part1:
      "欢迎使用 AnythingLLM，这是由 Mintplex Labs 开发的开源 AI 工具，可以将任何东西转换为您可以查询和聊天的训练有素的聊天机器人。AnythingLLM 是一款 BYOK（自带密钥）软件，因此除了您想使用的服务外，此软件不收取订阅费、费用或其他费用。",
    part2:
      "AnythingLLM 是将强大的 AI 产品（如 OpenAi、GPT-4、LangChain、PineconeDB、ChromaDB 等）整合在一个整洁的包中而无需繁琐操作的最简单方法，可以将您的生产力提高 100 倍。",
    part3:
      "AnythingLLM 可以完全在您的本地计算机上运行，几乎没有开销，您甚至不会注意到它的存在！无需 GPU。也可以进行云端和本地安装。\nAI 工具生态系统每天都在变得更强大。AnythingLLM 使其易于使用。",
    githubIssue: "在 Github 上创建问题",
    user1: "我该如何开始?!",
    part4:
      "很简单。所有集合都组织成我们称之为“工作区”的桶。工作区是文件、文档、图像、PDF 和其他文件的存储桶，这些文件将被转换为 LLM 可以理解和在对话中使用的内容。\n\n您可以随时添加和删除文件。",
    createWorkspace: "创建您的第一个工作区",
    user2: "这像是一个 AI Dropbox 吗？那么聊天呢？它是一个聊天机器人，不是吗？",
    part5:
      "AnythingLLM 不仅仅是一个更智能的 Dropbox。\n\nAnythingLLM 提供了两种与您的数据交流的方式：\n\n<i>查询：</i> 您的聊天将返回在您的工作区中访问的文档中找到的数据或推论。向工作区添加更多文档会使其更智能！\n\n<i>对话：</i> 您的文档和正在进行的聊天记录同时为 LLM 知识做出贡献。非常适合添加基于文本的实时信息或纠正 LLM 可能存在的误解。\n\n您可以在聊天过程中 <i>切换模式！</i>",
    user3: "哇，这听起来很棒，让我马上试试！",
    part6: "玩得开心！",
    starOnGithub: "在 GitHub 上加星",
    contact: "联系 Mintplex Labs",
  },

  "new-workspace": {
    title: "新工作区",
    placeholder: "我的工作区",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "通用设置",
    chat: "聊天设置",
    vector: "向量数据库",
    members: "成员",
    agent: "代理配置",
  },

  // General Appearance
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
      description: "自定义将向您的工作区用户建议的消息。",
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
      "confirm-start": "您即将删除整个",
      "confirm-end":
        "工作区。这将删除矢量数据库中的所有矢量嵌入。\n\n原始源文件将保持不变。此操作是不可逆转的。",
    },
  },

  // Chat Settings
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
        "desc-start": "将",
        only: "仅",
        "desc-end": "提供找到的文档上下文的答案。",
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
      title: "聊天提示",
      description:
        "将在此工作区上使用的提示。定义 AI 生成响应的上下文和指令。您应该提供精心设计的提示，以便人工智能可以生成相关且准确的响应。",
    },
    refusal: {
      title: "查询模式拒绝响应",
      "desc-start": "当处于",
      query: "查询",
      "desc-end": "模式时，当未找到上下文时，您可能希望返回自定义拒绝响应。",
    },
    temperature: {
      title: "LLM 温度",
      "desc-start": "此设置控制您的 LLM 回答的“创意”程度",
      "desc-end":
        "数字越高越有创意。对于某些模型，如果设置得太高，可能会导致响应不一致。",
      hint: "大多数 LLM 都有各种可接受的有效值范围。请咨询您的吗 LLM 提供商以获取该信息。",
    },
  },

  // Vector Database Settings
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
        "您将重置此工作区的矢量数据库。这将删除当前嵌入的所有矢量嵌入。\n\n原始源文件将保持不变。此操作是不可逆转的。",
      success: "向量数据库已重置。",
      error: "无法重置工作区向量数据库！",
    },
  },

  // Agent Configuration
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
        title: "RAG 和长期记忆",
        description:
          '允许代理利用您的本地文档来回答查询，或要求代理"记住"长期记忆检索的内容片段。',
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
          "使默认代理能够生成并写入文件，这些文件可以保存并在您的浏览器中下载。",
      },
      web: {
        title: "实时网络搜索和浏览",
        "desc-start":
          "通过连接到网络搜索（SERP）提供者，使您的代理能够搜索网络以回答您的问题。",
        "desc-end": "在代理会话期间，网络搜索将不起作用，直到此设置完成。",
      },
    },
  },

  // Workspace Chat
  recorded: {
    title: "工作区聊天历史记录",
    description: "这些是用户发送的所有聊天记录和消息，按创建日期排序。",
    export: "导出",
    table: {
      id: "Id",
      by: "发送者",
      workspace: "工作区",
      prompt: "提示",
      response: "响应",
      at: "发送时间",
    },
  },

  appearance: {
    title: "外观",
    description: "自定义平台的外观设置。",
    logo: {
      title: "自定义图标",
      description: "上传您的自定义图标，让您的聊天机器人成为您的。",
      add: "添加自定义图标",
      recommended: "建议尺寸：800 x 200",
      remove: "移除",
      replace: "替换",
    },
    message: {
      title: "自定义消息",
      description: "自定义向用户显示的自动消息。",
      new: "新建",
      system: "系统",
      user: "用户",
      message: "消息",
      assistant: "AnythingLLM 聊天助手",
      "double-click": "双击以编辑...",
      save: "保存消息",
    },
    icons: {
      title: "自定义页脚图标",
      description: "自定义侧边栏底部显示的页脚图标。",
      icon: "图标",
      link: "链接",
    },
  },

  // API Keys
  api: {
    title: "API 密钥",
    description: "API 密钥允许持有者以编程方式访问和管理此 AnythingLLM 实例。",
    link: "阅读 API 文档",
    generate: "生成新的 API 密钥",
    table: {
      key: "API 密钥",
      by: "创建者",
      created: "创建",
    },
  },

  // LLM Preferences
  llm: {
    title: "LLM 首选项",
    description:
      "这些是您首选的 LLM 聊天和嵌入提供商的凭据和设置。重要的是，这些密钥是最新的和正确的，否则 AnythingLLM 将无法正常运行。",
    provider: "LLM 提供商",
  },

  transcription: {
    title: "转录模型首选项",
    description:
      "这些是您的首选转录模型提供商的凭据和设置。重要的是这些密钥是最新且正确的，否则媒体文件和音频将无法转录。",
    provider: "转录提供商",
    "warn-start":
      "在 RAM 或 CPU 有限的计算机上使用本地耳语模型可能会在处理媒体文件时停止 AnythingLLM。",
    "warn-recommend": "我们建议至少 2GB RAM 并上传 <10Mb 的文件。",
    "warn-end": "内置模型将在首次使用时自动下载。",
  },

  embedding: {
    title: "嵌入首选项",
    "desc-start":
      "当使用本身不支持嵌入引擎的 LLM 时，您可能需要额外指定用于嵌入文本的凭据。",
    "desc-end":
      "嵌入是将文本转换为矢量的过程。需要这些凭据才能将您的文件和提示转换为 AnythingLLM 可以用来处理的格式。",
    provider: {
      title: "嵌入引擎提供商",
      description: "使用 AnythingLLM 的本机嵌入引擎时不需要设置。",
    },
  },

  text: {
    title: "文本拆分和分块首选项",
    "desc-start":
      "有时，您可能希望更改新文档在插入到矢量数据库之前拆分和分块的默认方式。",
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

  // Vector Database
  vector: {
    title: "向量数据库",
    description:
      "这些是 AnythingLLM 实例如何运行的凭据和设置。重要的是，这些密钥是最新的和正确的。",
    provider: {
      title: "向量数据库提供商",
      description: "LanceDB 不需要任何配置。",
    },
  },

  // Embeddable Chats
  embeddable: {
    title: "可嵌入的聊天小部件",
    description:
      "可嵌入的聊天小部件是与单个工作区绑定的面向公众的聊天界面。这些允许您构建工作区，然后您可以将其发布到全世界。",
    create: "创建嵌入式对话",
    table: {
      workspace: "工作区",
      chats: "已发送聊天",
      Active: "活动域",
    },
  },

  // Embeddable Chat History
  "embed-chats": {
    title: "嵌入的聊天历史纪录",
    export: "导出",
    description: "这些是您发布的任何嵌入的所有记录的聊天和消息。",
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
    description: "通过激活多用户模式来设置您的实例以支持您的团队。",
    enable: {
      "is-enable": "多用户模式已启用",
      enable: "启用多用户模式",
      description:
        "默认情况下，您将是唯一的管理员。作为管理员，您需要为所有新用户或管理员创建账户。不要丢失您的密码，因为只有管理员用户可以重置密码。",
      username: "管理员账户用户名",
      password: "管理员账户密码",
    },
    password: {
      title: "密码保护",
      description:
        "用密码保护您的AnythingLLM实例。如果您忘记了密码，那么没有恢复方法，所以请确保保存这个密码。",
    },
    instance: {
      title: "实例密码保护",
      description:
        "默认情况下，您将是唯一的管理员。作为管理员，您需要为所有新用户或管理员创建账户。不要丢失您的密码，因为只有管理员用户可以重置密码。",
      password: "实例密码",
    },
  },

  // Event Logs
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

  // Privacy & Data-Handling
  privacy: {
    title: "隐私和数据处理",
    description:
      "这是您对如何处理连接的第三方提供商和AnythingLLM的数据的配置。",
    llm: "LLM 选择",
    embedding: "嵌入首选项",
    vector: "向量数据库",
    anonymous: "启用匿名遥测",
  },
};

export default TRANSLATIONS;
