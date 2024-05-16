// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  common: {
    "workspaces-name": "工作区名称",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "设置",
    system: "系统",
    invites: "邀请",
    users: "用户",
    workspaces: "工作区",
    "workspace-chats": "对话历史记录", //  "workspace-chats" should be  "对话历史记录", means "chat history",or "chat history records"
    appearance: "外观",
    "api-keys": "API 密钥",
    llm: "LLM 首选项",
    transcription: "Transcription 模型",
    embedder: "Embedder 首选项",
    "text-splitting": "文本分割",
    "vector-database": "向量数据库",
    embeds: "嵌入式对话",
    "embed-chats": "嵌入式对话历史",
    security: "用户与安全",
    "event-logs": "事件日志",
    privacy: "隐私与数据",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "欢迎！",
      "forgot-pass": "忘记密码",
      reset: "重置",
    },
    "sign-in": "登录",
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
      description: "这只会更改工作区的显示名称。"
    },
    message: {
      title: "建议的聊天消息",
      description: "自定义将向您的工作区用户建议的消息。",
      add: "添加新消息",
      save: "保存消息",
      heading: "向我解释",
      body: "AnythingLLM的好处",
    },
    pfp: {
      title: "助理头像",
      description: "为此工作区自定义助手的个人资料图像。",
      image: "工作区图像",
      remove: "移除工作区图像",
    },
    delete:{
      delete: "删除工作区",
      deleting: "正在删除工作区...",
      "confirm-start": "您即将删除整个",
      "confirm-end": "工作区。这将删除矢量数据库中的所有矢量嵌入。\n\n原始源文件将保持不变。此操作是不可逆转的。"
    }
  },

  // Chat Settings
  chat: {
    llm: {
      title: "工作区LLM提供者",
      description: "将用于此工作区的特定 LLM 提供商和模型。默认情况下，它使用系统 LLM 提供程序和设置。",
      search: "搜索所有 LLM 提供商",
    },
    model: {
      title: "工作区聊天模型",
      description: "将用于此工作区的特定聊天模型。如果为空，将使用系统LLM首选项。",
      wait:"-- 等待模型 --",
    },
    mode:{
      title: "聊天模式",
      chat:{
        title: "聊天",
        "desc-start": "将提供法学硕士的一般知识",
        and: "和",
        "desc-end": "找到的文档上下文的答案。",
      },
      query:{
        title: "查询",
        "desc-start": "将",
        only: "仅",
        "desc-end": "提供找到的文档上下文的答案。",
      }
    },
    history:{
      title: "聊天历史记录",
      "desc-start": "将包含在响应的短期记忆中的先前聊天的数量。",
      recommend: "推荐 20。",
      "desc-end": "任何超过 45 的值都可能导致连续聊天失败，具体取决于消息大小。",
    },
    prompt:{
      title: "聊天提示",
      description: "将在此工作区上使用的提示。定义 AI 生成响应的上下文和指令。您应该提供精心设计的提示，以便人工智能可以生成相关且准确的响应。",
    },
    refusal:{
      title:"查询模式拒绝响应",
      "desc-start": "当处于",
      query: "查询",
      "desc-end": "模式时，当未找到上下文时，您可能希望返回自定义拒绝响应。",
    },
    temperature:{
      title: "LLM Temperature",
      "desc-start": '此设置控制您的聊天响应的"随机"或动态程度。',
      "desc-end": "数字越高（最大为 1.0），随机性和不连贯性就越强。",
      recommend: "推荐:",
    },
  },
};

export default TRANSLATIONS;
  