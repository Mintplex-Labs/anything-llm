// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
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
};

export default TRANSLATIONS;
