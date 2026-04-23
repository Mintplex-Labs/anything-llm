// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "开始",
      welcome: "欢迎",
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
  },
  common: {
    "workspaces-name": "工作区名称",
    selection: "模型选择",
    save: "保存更改",
    saving: "保存中...",
    previous: "上一页",
    next: "下一页",
    optional: "可选",
    yes: "是",
    no: "否",
    search: "搜索",
    username_requirements:
      "用户名必须为 2-32 个字符，以小写字母开头，只能包含小写字母、数字、下划线、连字符和句点。",
    on: "关于",
    none: "没有",
    stopped: "停止",
    loading: "正在加载…",
    refresh: "重新开始；更新",
  },
  settings: {
    title: "设置",
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
    "mobile-app": "AnythingLLM 移动版",
    "community-hub": {
      title: "社区中心",
      trending: "探索热门",
      "your-account": "您的账户",
      "import-item": "进口商品",
    },
    channels: "频道",
    "available-channels": {
      telegram: "电报",
    },
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
    "sign-in": "登录你的 {{appName}} 账户",
    "password-reset": {
      title: "重置密码",
      description: "请提供以下必要信息以重置你的密码。",
      "recovery-codes": "恢复代码",
      "back-to-login": "返回登录",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "创建代理",
      editWorkspace: "编辑工作区",
      uploadDocument: "上传文件",
    },
    greeting: "今天我能帮您什么？",
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
    },
    mode: {
      title: "聊天模式",
      chat: {
        title: "聊天",
        description:
          "将提供答案，利用LLM的通用知识和提供的文档内容<b>和</b>。您需要使用@agent命令来使用工具。",
      },
      query: {
        title: "查询",
        description:
          "将在找到文档上下文时，仅提供答案 <b>。您需要使用 @agent 命令来使用工具。",
      },
      automatic: {
        title: "自动",
        description:
          "如果模型和提供者都支持原生工具调用，则会自动使用这些工具。<br />如果不支持原生工具调用，您需要使用 `@agent` 命令来使用工具。",
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
        publish: "发布到社区中心",
      },
    },
    refusal: {
      title: "查询模式拒绝响应",
      "desc-start": "当处于",
      query: "查询",
      "desc-end": "模式时，当未找到上下文时，你可能希望返回自定义拒绝响应。",
      "tooltip-title": "我为什麽会看到这个?",
      "tooltip-description":
        "您处于查询模式，此模式仅使用您文件中的信息。切换到聊天模式以进行更灵活的对话，或点击此处访问我们的文件以了解更多关于聊天模式的信息。",
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
      web: {
        title: "实时网络搜索和浏览",
        description:
          "通过连接到搜索引擎（SERP）提供商，让您的代理能够搜索互联网来回答您的问题。",
      },
      sql: {
        title: "SQL 连接器",
        description:
          "让您的代理能够利用 SQL 来回答您的问题，只需连接到各种 SQL 数据库提供商即可。",
      },
      default_skill:
        "默认情况下，这项技能已启用。但是，如果您不想让该技能被代理使用，您可以将其禁用。",
      filesystem: {
        title: "文件系统访问",
        description:
          "允许您的代理能够读取、写入、搜索和管理指定目录中的文件。 支持文件编辑、目录导航和内容搜索功能。",
        learnMore: "了解更多关于如何使用这项技能的信息。",
        configuration: "配置",
        readActions: "阅读操作",
        writeActions: "编写操作",
        warning:
          "访问文件系统可能存在风险，因为它可能修改或删除文件。在启用之前，请务必查阅<link>文档</link>。",
        skills: {
          "read-text-file": {
            title: "读取文件",
            description: "读取文件内容（包括文本、代码、PDF、图像等）",
          },
          "read-multiple-files": {
            title: "读取多个文件",
            description: "同时读取多个文件",
          },
          "list-directory": {
            title: "目录",
            description: "列出文件夹中的文件和目录",
          },
          "search-files": {
            title: "搜索文件",
            description: "按文件名或内容搜索文件",
          },
          "get-file-info": {
            title: "获取文件信息",
            description: "获取有关文件的详细元数据",
          },
          "edit-file": {
            title: "编辑文件",
            description: "对文本文件进行基于行的编辑。",
          },
          "create-directory": {
            title: "创建目录",
            description: "创建新的目录",
          },
          "move-file": {
            title: "移动/重命名文件",
            description: "移动或重命名文件和目录",
          },
          "copy-file": {
            title: "复制文件",
            description: "复制文件和目录",
          },
          "write-text-file": {
            title: "创建文本文件",
            description: "创建新的文本文件，或覆盖现有的文本文件。",
          },
        },
      },
      createFiles: {
        title: "文档创建",
        description:
          "允许您的代理创建二进制文档格式，例如PowerPoint演示文稿、Excel电子表格、Word文档和PDF文件。文件可以直接从聊天窗口下载。",
        configuration: "可用的文件类型",
        skills: {
          "create-text-file": {
            title: "文本文件",
            description:
              "创建包含任何内容和扩展名的文本文件（如 .txt、.md、.json、.csv 等）。",
          },
          "create-pptx": {
            title: "PowerPoint 演示文稿",
            description: "创建新的幻灯片演示文稿，包括幻灯片、标题和项目符号。",
          },
          "create-pdf": {
            title: "PDF 文档",
            description:
              "使用 Markdown 或纯文本，并进行基本的排版，创建 PDF 文档。",
          },
          "create-xlsx": {
            title: "Excel电子表格",
            description: "创建包含表格数据、工作表和样式的 Excel 文档。",
          },
          "create-docx": {
            title: "Word 文档",
            description: "创建包含基本样式和格式的 Word 文档",
          },
        },
      },
      gmail: {
        title: "Gmail 连接器",
        description:
          "让您的代理能够与Gmail互动：搜索邮件、阅读邮件线程、撰写草稿、发送邮件以及管理您的收件箱。请参考相关文档。",
        multiUserWarning:
          "为了安全原因，在多用户模式下无法使用 Gmail 集成功能。请先禁用多用户模式，然后才能使用此功能。",
        configuration: "Gmail 设置",
        deploymentId: "部署 ID",
        deploymentIdHelp: "您的 Google Apps Script 网页应用的部署 ID",
        apiKey: "API 密钥",
        apiKeyHelp: "您在 Google Apps Script 部署中配置的 API 密钥。",
        configurationRequired: "请配置部署 ID 和 API 密钥，以启用 Gmail 功能。",
        configured: "已配置",
        searchSkills: "搜索技巧...",
        noSkillsFound: "未找到与您的搜索条件匹配的技能。",
        categories: {
          search: {
            title: "搜索和阅读电子邮件",
            description: "搜索并阅读您 Gmail 收件箱中的邮件。",
          },
          drafts: {
            title: "草稿邮件",
            description: "创建、编辑和管理电子邮件草稿",
          },
          send: {
            title: "发送和回复电子邮件",
            description: "立即发送电子邮件并回复讨论串",
          },
          threads: {
            title: "管理电子邮件线程",
            description: "管理邮件线程 - 标记为已读/未读，归档，删除",
          },
          account: {
            title: "集成统计",
            description: "查看邮件收件箱统计数据和账户信息",
          },
        },
        skills: {
          search: {
            title: "搜索邮件",
            description: "使用 Gmail 的查询语法搜索电子邮件",
          },
          readThread: {
            title: "阅读此主题",
            description: "阅读由ID发起的完整邮件往来",
          },
          createDraft: {
            title: "创建草稿",
            description: "创建一个新的电子邮件草稿",
          },
          createDraftReply: {
            title: "创建草稿回复",
            description: "创建一个针对现有主题的回应草稿",
          },
          updateDraft: {
            title: "更新草稿",
            description: "更新已有的电子邮件草稿",
          },
          getDraft: {
            title: "获取草稿",
            description: "通过ID检索特定草稿",
          },
          listDrafts: {
            title: "草稿清单",
            description: "列出所有草稿邮件",
          },
          deleteDraft: {
            title: "删除草稿",
            description: "删除草稿邮件",
          },
          sendDraft: {
            title: "发送草稿",
            description: "发送已有的电子邮件草稿",
          },
          sendEmail: {
            title: "发送电子邮件",
            description: "立即发送一封电子邮件",
          },
          replyToThread: {
            title: "回复主题",
            description: "立即回复邮件线程",
          },
          markRead: {
            title: "马克·瑞德",
            description: "将某个主题标记为已阅读",
          },
          markUnread: {
            title: "标记为未读",
            description: "将某个主题标记为未读",
          },
          moveToTrash: {
            title: "移动到垃圾箱",
            description: "将某个主题归档到垃圾箱",
          },
          moveToArchive: {
            title: "存档",
            description: "存档该主题",
          },
          moveToInbox: {
            title: "移动到收件箱",
            description: "将某个主题移动到收件箱",
          },
          getMailboxStats: {
            title: "邮箱统计",
            description: "获取未读邮件数量和邮箱统计信息",
          },
          getInbox: {
            title: "查看收件箱",
            description: "一种便捷的方式，可以从 Gmail 中获取收件邮件。",
          },
        },
      },
      outlook: {
        title: "Outlook 连接器",
        description:
          "让您的代理通过 Microsoft Graph API 与 Microsoft Outlook 交互——搜索邮件、阅读邮件线程、撰写草稿、发送邮件以及管理您的收件箱。请查阅相关文档。",
        multiUserWarning:
          "由于安全原因，在多用户模式下无法使用 Outlook 集成功能。请先关闭多用户模式，然后再使用此功能。",
        configuration: "Outlook 设置",
        authType: "账户类型",
        authTypeHelp:
          '选择哪些类型的 Microsoft 账户可以进行身份验证。 "所有账户" 支持个人账户和工作/学校账户。 "仅限个人账户" 仅限于个人 Microsoft 账户。 "仅限工作/学校账户" 仅限于特定 Azure AD 租户的工作/学校账户。',
        authTypeCommon: "所有账户（包括个人账户和工作/学习账户）",
        authTypeConsumers: "仅限个人 Microsoft 账户",
        authTypeOrganization: "仅限组织账户 (需要租户 ID)",
        clientId: "申请人（客户）ID",
        clientIdHelp: "您 Azure AD 应用程序注册的应用程序 ID",
        tenantId: "租户 ID",
        tenantIdHelp:
          "您的 Azure AD 应用注册的“租户 ID”。仅在组织内部身份验证时需要。",
        clientSecret: "客户端密钥",
        clientSecretHelp: "您的 Azure AD 应用程序注册的客户端机密值",
        configurationRequired:
          "请配置客户端 ID 和客户端密钥，以便启用 Outlook 相关功能。",
        authRequired:
          "首先保存您的凭据，然后通过 Microsoft 进行身份验证以完成设置。",
        authenticateWithMicrosoft: "使用 Microsoft 身份验证",
        authenticated: "已成功与 Microsoft Outlook 认证。",
        revokeAccess: "撤销权限",
        configured: "已配置",
        searchSkills: "搜索技巧...",
        noSkillsFound: "未找到与您的搜索条件匹配的技能。",
        categories: {
          search: {
            title: "搜索和阅读电子邮件",
            description: "搜索并阅读您 Outlook 收件箱中的电子邮件。",
          },
          drafts: {
            title: "草稿邮件",
            description: "创建、编辑和管理电子邮件草稿",
          },
          send: {
            title: "发送电子邮件",
            description: "立即发送新邮件或回复消息",
          },
          account: {
            title: "集成统计",
            description: "查看邮件收件箱统计数据和账户信息",
          },
        },
        skills: {
          getInbox: {
            title: "查看收件箱",
            description: "从您的 Outlook 收件箱获取最近的邮件",
          },
          search: {
            title: "搜索邮件",
            description: "使用 Microsoft 搜索语法搜索电子邮件",
          },
          readThread: {
            title: "阅读对话",
            description: "阅读完整的电子邮件对话记录",
          },
          createDraft: {
            title: "创建草稿",
            description: "创建一个新的电子邮件草稿，或回复一个已存在的邮件。",
          },
          updateDraft: {
            title: "更新草稿",
            description: "更新已有的电子邮件草稿",
          },
          listDrafts: {
            title: "草稿清单",
            description: "列出所有草稿邮件",
          },
          deleteDraft: {
            title: "删除草稿",
            description: "删除草稿邮件",
          },
          sendDraft: {
            title: "发送草稿",
            description: "发送已有的邮件草稿",
          },
          sendEmail: {
            title: "发送电子邮件",
            description: "立即发送一封新的电子邮件，或回复已存在的消息。",
          },
          getMailboxStats: {
            title: "邮件收件统计",
            description: "获取文件夹数量和邮箱统计信息",
          },
        },
      },
      googleCalendar: {
        title: "Google 日历连接器",
        description:
          "让您的代理能够与 Google 日历互动：查看日历、获取活动、创建和更新活动，以及管理确认回复。请参考相关文档。",
        multiUserWarning:
          "由于安全原因，在多用户模式下无法使用 Google 日历集成功能。请先禁用多用户模式，然后再使用此功能。",
        configuration: "谷歌日历配置",
        deploymentId: "部署ID",
        deploymentIdHelp: "您的 Google Apps Script 网页应用的部署 ID",
        apiKey: "API 密钥",
        apiKeyHelp: "您在 Google Apps Script 部署中配置的 API 密钥。",
        configurationRequired:
          "请配置部署 ID 和 API 密钥，以启用 Google 日历功能。",
        configured: "已配置",
        searchSkills: "搜索技巧...",
        noSkillsFound: "未找到与您搜索条件匹配的技能。",
        categories: {
          calendars: {
            title: "日历",
            description: "查看和管理您的 Google 日历",
          },
          readEvents: {
            title: "查看活动",
            description: "查看和搜索日历活动",
          },
          writeEvents: {
            title: "创建和更新活动",
            description: "创建新的活动，并修改现有的活动。",
          },
          rsvp: {
            title: "请回复确认",
            description: "管理您对活动的响应状态",
          },
        },
        skills: {
          listCalendars: {
            title: "日历列表",
            description: "列出您拥有的或订阅的全部日历。",
          },
          getCalendar: {
            title: "获取日历详情",
            description: "获取有关特定日历的详细信息",
          },
          getEvent: {
            title: "获取活动",
            description: "获取有关特定活动的详细信息",
          },
          getEventsForDay: {
            title: "获取当日活动",
            description: "获取指定日期的所有活动",
          },
          getEvents: {
            title: "获取活动（日期范围）",
            description: "获取指定日期范围内的活动",
          },
          getUpcomingEvents: {
            title: "查看即将举办的活动",
            description: "使用简单的关键词，查找今天、本周或本月的活动",
          },
          quickAdd: {
            title: "快速添加活动",
            description: "从自然语言（例如“明天下午3点开会”）创建一个活动。",
          },
          createEvent: {
            title: "创建活动",
            description: "创建一个新的活动，并完全控制所有属性。",
          },
          updateEvent: {
            title: "活动更新",
            description: "更新现有的日历事件",
          },
          setMyStatus: {
            title: "设置回复状态",
            description: "接受、拒绝或表示初步接受某个活动",
          },
        },
      },
    },
    mcp: {
      title: "MCP 服务器",
      "loading-from-config": "从配置文件加载 MCP 服务器",
      "learn-more": "了解更多关于 MCP 服务器的信息。",
      "no-servers-found": "未找到任何 MCP 服务器",
      "tool-warning": "为了获得最佳性能，建议禁用不必要的工具，以节省上下文。",
      "stop-server": "停止 MCP 服务器",
      "start-server": "启动 MCP 服务器",
      "delete-server": "删除 MCP 服务器",
      "tool-count-warning":
        "这个 MCP 服务器启用了 <b> 工具，这些工具会在每次聊天中使用上下文信息。</b> 建议禁用不需要的工具，以节省上下文。<br />",
      "startup-command": "启动命令",
      command: "命令",
      arguments: "争论",
      "not-running-warning":
        "这个 MCP 服务器目前处于停止状态，可能是因为在启动时出现了错误或被手动停止。",
      "tool-call-arguments": "工具调用的参数",
      "tools-enabled": "工具已启用",
    },
    settings: {
      title: "代理技能设置",
      "max-tool-calls": {
        title: "每个回复的最大请求次数",
        description:
          "单个代理可以使用的最大工具数量，用于生成单个响应。 这样可以防止工具调用数量过多，从而避免无限循环。",
      },
      "intelligent-skill-selection": {
        title: "智能技能选择",
        "beta-badge": "β 版本",
        description:
          "实现无限工具和按查询减少高达 80% 的 Token 使用量——AnythingLLM 能够自动选择最合适的技能，以应对每个提示。",
        "max-tools": {
          title: "麦克斯工具",
          description:
            "可以选取的工具的最大数量，用于每个查询。我们建议将此值设置为较高的值，以便在处理大型上下文模型时。",
        },
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
      "render-html": {
        title: "在聊天中渲染 HTML",
        description:
          "在助手回复中呈现 HTML 响应。\n这可以显著提高回复的质量，但也可能带来潜在的安全风险。",
      },
    },
  },
  api: {
    title: "API 密钥",
    description: "API 密钥允许持有者以编程方式访问和管理此 AnythingLLM 实例。",
    link: "阅读 API 文档",
    generate: "生成新的 API 密钥",
    empty: "未找到 API 密钥",
    actions: "操作",
    messages: {
      error: "错误：{{error}}",
    },
    modal: {
      title: "创建新的 API 密钥",
      cancel: "取消",
      close: "关闭",
      create: "创建 API 密钥",
      helper: "创建后，API 密钥可用于以编程方式访问并配置此 AnythingLLM 实例。",
      name: {
        label: "名称",
        placeholder: "生产环境集成",
        helper: "可选。使用一个易于识别的名称，以便之后识别此密钥。",
      },
    },
    row: {
      copy: "复制 API 密钥",
      copied: "已复制",
      unnamed: "--",
      deleteConfirm:
        "确定要停用此 API 密钥吗？\n停用后将无法再使用。\n\n此操作不可撤销。",
    },
    table: {
      name: "名称",
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
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure 服务端点",
        api_key: "API 密钥",
        chat_deployment_name: "聊天部署名称",
        chat_model_token_limit: "聊天模型令牌限制",
        model_type: "模型类型",
        default: "预设",
        reasoning: "推理",
        model_type_tooltip:
          "如果您的部署使用了推理模型（例如 o1、o1-mini、o3-mini 等），请将此选项设置为“推理”。否则，您的聊天请求可能会失败。",
      },
    },
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
    },
  },
  text: {
    title: "文本拆分和分块首选项",
    "desc-start":
      "有时，你可能希望更改新文档在插入到矢量数据库之前拆分和分块的默认方式。",
    "desc-end": "只有在了解文本拆分的工作原理及其副作用时，才应修改此设置。",
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
      active: "活动域",
      created: "建立",
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
      bypass_ssl: "绕过 SSL 证书验证",
      bypass_ssl_explained:
        "启用此选项以绕过对自托管 Confluence 实例的 SSL 证书验证，特别是使用自签名证书的情况。",
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
      "delete-confirmation":
        "您确定要删除这些文件和文件夹吗？\n这将从系统中移除这些文件，并自动将其从所有关联工作区中移除。\n此操作无法撤销。",
      "removing-message":
        "正在删除 {{count}} 个文档和 {{folderCount}} 个文件夹，请稍候。",
      "move-success": "成功移动了 {{count}} 个文档。",
      no_docs: "暂无文档",
      select_all: "全选",
      deselect_all: "取消全选",
      remove_selected: "移除所选",
      save_embed: "保存并嵌入",
      "total-documents_one": "{{count}} 文件",
      "total-documents_other": "{{count}} 类型的文件",
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
      vault_location: "仓库位置",
      vault_description:
        "选择你的 Obsidian 仓库文件夹，以导入所有笔记及其关联。",
      selected_files: "找到 {{count}} 个 Markdown 文件",
      importing: "正在导入保险库…",
      import_vault: "导入保险库",
      processing_time: "根据你的仓库大小，这可能需要一些时间。",
      vault_warning: "为避免冲突，请确保你的 Obsidian 仓库当前未被打开。",
    },
  },
  chat_window: {
    send_message: "发送消息",
    attach_file: "向此对话附加文件",
    text_size: "更改文字大小。",
    microphone: "语音输入你的提示。",
    send: "将提示消息发送到工作区",
    attachments_processing: "附件正在处理，请稍候……",
    tts_speak_message: "TTS 播报消息",
    copy: "复制",
    regenerate: "重新",
    regenerate_response: "重新回应",
    good_response: "反应良好",
    more_actions: "更多操作",
    fork: "分叉",
    delete: "删除",
    cancel: "取消",
    edit_prompt: "编辑问题",
    edit_response: "编辑回应",
    preset_reset_description: "清除聊天纪录并开始新的聊天",
    add_new_preset: "新增预设",
    command: "指令",
    your_command: "你的指令",
    placeholder_prompt: "提示范例",
    description: "描述",
    placeholder_description: "描述范例",
    save: "保存",
    small: "小",
    normal: "一般",
    large: "大",
    workspace_llm_manager: {
      search: "搜索",
      loading_workspace_settings: "正在载入工作区设置",
      available_models: "可用模型",
      available_models_description: "可用模型说明",
      save: "保存",
      saving: "正在保存",
      missing_credentials: "缺少凭证",
      missing_credentials_description: "缺少凭证说明",
    },
    submit: "提交",
    edit_info_user: "“提交”会重新生成 AI 的回复。 “保存”只会更新您的消息。",
    edit_info_assistant: "您所做的修改将直接保存到此处。",
    see_less: "查看更多",
    see_more: "查看更多",
    tools: "工具",
    text_size_label: "字体大小",
    select_model: "选择型号",
    sources: "来源",
    document: "文件",
    similarity_match: "比赛",
    source_count_one: "{{count}} 参考",
    source_count_other: "{{count}} 相关资料",
    preset_exit_description: "停止当前的代理会话",
    add_new: "添加新",
    edit: "编辑",
    publish: "出版",
    stop_generating: "停止生成回复",
    slash_commands: "快捷命令",
    agent_skills: "代理人技能",
    manage_agent_skills: "管理代理人技能",
    agent_skills_disabled_in_session:
      "在活动会话期间，无法修改技能。首先使用 /exit 命令结束会话。",
    start_agent_session: "开始代理会",
    use_agent_session_to_use_tools:
      "您可以通过在提示词的开头使用'@agent'来启动与代理的聊天，从而使用聊天工具。",
    agent_invocation: {
      model_wants_to_call: "该型号希望进行通话。",
      approve: "批准",
      reject: "拒绝",
      always_allow: "请务必留出 {{skillName}}",
      tool_call_was_approved: "工具使用申请已获得批准。",
      tool_call_was_rejected: "请求获取工具已被拒绝。",
    },
    custom_skills: "定制技能",
    agent_flows: "代理人流动",
    no_tools_found: "未找到匹配的工具",
    loading_mcp_servers: "正在加载 MCP 服务器…",
    app_integrations: "应用程序集成",
    sub_skills: "基本技能",
  },
  profile_settings: {
    edit_account: "编辑帐户",
    profile_picture: "头像",
    remove_profile_picture: "移除头像",
    username: "用户名",
    new_password: "新密码",
    password_description: "密码长度必须至少为 8 个字符",
    cancel: "取消",
    update_account: "更新帐号",
    theme: "主题偏好",
    language: "语言偏好",
    failed_upload: "上传个人资料图片失败：{{error}}",
    upload_success: "个人资料图片已上传。",
    failed_remove: "移除个人资料图片失败：{{error}}",
    profile_updated: "个人资料已更新。",
    failed_update_user: "更新使用者失败：{{error}}",
    account: "帐户",
    support: "支援",
    signout: "登出",
  },
  "keyboard-shortcuts": {
    title: "键盘快捷键",
    shortcuts: {
      settings: "打开设置",
      workspaceSettings: "打开目前工作区设置",
      home: "前往首页",
      workspaces: "管理工作区",
      apiKeys: "API 密钥设定",
      llmPreferences: "LLM 偏好设置",
      chatSettings: "聊天设置",
      help: "显示键盘快捷键说明",
      showLLMSelector: "显示工作区 LLM 选择器",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "成功！",
        success_description: "您的系统提示已发布到社区中心！",
        success_thank_you: "感谢您分享到社群！",
        view_on_hub: "在社区中心查看",
        modal_title: "发布系统提示",
        name_label: "名称",
        name_description: "这是您系统提示的显示名称。",
        name_placeholder: "我的系统提示",
        description_label: "描述",
        description_description:
          "这是您系统提示的描述。用它来描述您系统提示的目的。",
        tags_label: "标签",
        tags_description:
          "标签用于标记您的系统提示，以便于搜索。您可以添加多个标签。最多 5 个标签。每个标签最多 20 个字符。",
        tags_placeholder: "输入并按 Enter 键添加标签",
        visibility_label: "可见性",
        public_description: "公共系统提示对所有人可见。",
        private_description: "私人系统提示仅对您可见。",
        publish_button: "发布到社区中心",
        submitting: "发布中...",
        prompt_label: "提示",
        prompt_description: "这是将用于引导 LLM 的实际系统提示。",
        prompt_placeholder: "在此输入您的系统提示...",
      },
      agent_flow: {
        success_title: "成功！",
        success_description: "您的代理流程已发布到社区中心！",
        success_thank_you: "感谢您分享到社群！",
        view_on_hub: "在社区中心查看",
        modal_title: "发布代理流程",
        name_label: "名称",
        name_description: "这是您代理流程的显示名称。",
        name_placeholder: "我的代理流程",
        description_label: "描述",
        description_description:
          "这是您代理流程的描述。用它来描述您代理流程的目的。",
        tags_label: "标签",
        tags_description:
          "标签用于标记您的代理流程，以便于搜索。您可以添加多个标签。最多 5 个标签。每个标签最多 20 个字符。",
        tags_placeholder: "输入并按 Enter 键添加标签",
        visibility_label: "可见性",
        submitting: "发布中...",
        submit: "发布到社区中心",
        privacy_note:
          "代理流程始终以上传为私有，以保护任何敏感资料。您可以在发布后在社区中心更改可见性。请在发布前验证您的流程不包含任何敏感或私人信息。",
      },
      generic: {
        unauthenticated: {
          title: "需要验证",
          description:
            "在发布项目之前，您需要通过 AnythingLLM 社区中心进行验证。",
          button: "连接到社区中心",
        },
      },
      slash_command: {
        success_title: "成功！",
        success_description: "您的斜线指令已发布到社区中心！",
        success_thank_you: "感谢您分享到社群！",
        view_on_hub: "在社区中心查看",
        modal_title: "发布斜线指令",
        name_label: "名称",
        name_description: "这是您斜线指令的显示名称。",
        name_placeholder: "我的斜线指令",
        description_label: "描述",
        description_description:
          "这是您斜线指令的描述。用它来描述您斜线指令的目的。",
        tags_label: "标签",
        tags_description:
          "标签用于标记您的斜线指令，以便于搜索。您可以添加多个标签。最多 5 个标签。每个标签最多 20 个字符。",
        tags_placeholder: "输入并按 Enter 键添加标签",
        visibility_label: "可见性",
        public_description: "公共斜线指令对所有人可见。",
        private_description: "私人斜线指令仅对您可见。",
        publish_button: "发布到社区中心",
        submitting: "发布中...",
        prompt_label: "提示",
        prompt_description: "这是触发斜线指令时将使用的提示。",
        prompt_placeholder: "在此输入您的提示...",
      },
    },
  },
  security: {
    title: "用户与安全",
    multiuser: {
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
    },
    password: {
      title: "密码保护",
      description:
        "用密码保护你的AnythingLLM实例。如果你忘记了密码，那么没有恢复方法，所以请确保保存这个密码。",
      "password-label": "实例密码",
    },
  },
  home: {
    welcome: "欢迎",
    chooseWorkspace: "选择一个工作区开始聊天！",
    notAssigned:
      "你目前还没有分配到任何工作区。\n请联系你的管理员请求访问一个工作区。",
    goToWorkspace: '前往 "{{workspace}}"',
  },
  telegram: {
    title: "Telegram 机器人",
    description:
      "将您的 AnythingLLM 实例与 Telegram 连接起来，这样您就可以从任何设备与您的工作空间进行聊天。",
    setup: {
      step1: {
        title: "第一步：创建您的 Telegram 机器人",
        description:
          "打开 Telegram 上的 @BotFather，发送 `/newbot` 到 <code>@BotFather</code>，按照提示操作，并复制 API 令牌。",
        "open-botfather": "启动 BotFather",
        "instruction-1": "1. 打开链接或扫描二维码",
        "instruction-2":
          "2. 将 <code>/newbot</code> 发送给 <code>@BotFather</code>",
        "instruction-3": "3. 为您的机器人选择一个名称和用户名",
        "instruction-4": "4. 复制您收到的 API 令牌",
      },
      step2: {
        title: "步骤 2：连接您的机器人",
        description:
          "将您从 @BotFather 获得的 API 令牌粘贴到指定位置，并选择一个默认的工作区，以便您的机器人可以进行对话。",
        "bot-token": "机器人代币",
        connecting: "正在连接...",
        "connect-bot": "连接机器人",
      },
      security: {
        title: "推荐的安全设置",
        description: "为了进一步增强安全性，请在 @BotFather 中配置这些设置。",
        "disable-groups": "— 阻止机器人加入群组",
        "disable-inline": "— 阻止机器人被用于内联搜索",
        "obscure-username":
          "使用一个不显眼的机器人用户名，以降低其被发现的可能性。",
      },
      "toast-enter-token": "请您输入一个机器人令牌。",
      "toast-connect-failed": "未能连接机器人。",
    },
    connected: {
      status: "连接",
      "status-disconnected": "未连接—— 令牌可能已过期或无效",
      "placeholder-token": "粘贴新的机器人令牌...",
      reconnect: "重新连接",
      workspace: "工作空间",
      "bot-link": "机器人链接",
      "voice-response": "语音响应",
      disconnecting: "断开连接...",
      disconnect: "断开",
      "voice-text-only": "仅提供文字",
      "voice-mirror": "回声（当用户发送语音时，会以语音形式回复）",
      "voice-always": "请务必在回复中添加语音（发送音频）。",
      "toast-disconnect-failed": "未能成功断开机器人。",
      "toast-reconnect-failed": "机器人连接失败。",
      "toast-voice-failed": "无法更新语音模式。",
      "toast-approve-failed": "未能批准用户。",
      "toast-deny-failed": "未能拒绝用户请求。",
      "toast-revoke-failed": "未能撤销用户权限。",
    },
    users: {
      "pending-description":
        "等待验证的用户。请将此处显示的配对代码与他们在 Telegram 聊天中显示的配对代码进行匹配。",
      unknown: "未知",
    },
  },
};

export default TRANSLATIONS;
