// 工作流节点类型定义
// 参考 xxx.html 中的完整节点配置

export const NODE_TYPES = {
  // ==================== LLM 节点 ====================
  "llm-deepseek": {
    title: "DeepSeek V3",
    type: "llm",
    icon: "🧠",
    color: "bg-indigo-500",
    inputs: ["input"],
    outputs: ["output"],
    config: {
      model: "deepseek-v3",
      systemPrompt: "你是一个有帮助的AI助手。",
      temperature: 0.7,
      maxTokens: 2048,
    },
  },
  "llm-gemini": {
    title: "Gemini Flash",
    type: "llm",
    icon: "✨",
    color: "bg-blue-500",
    inputs: ["input"],
    outputs: ["output"],
    config: {
      model: "gemini-2.5-flash-all",
      systemPrompt: "你是一个有帮助的AI助手。",
      temperature: 0.7,
      maxTokens: 2048,
    },
  },
  "llm-qwen": {
    title: "通义千问",
    type: "llm",
    icon: "🌟",
    color: "bg-purple-500",
    inputs: ["input"],
    outputs: ["output"],
    config: {
      model: "qwen-max",
      systemPrompt: "你是一个有帮助的AI助手。",
      temperature: 0.7,
      maxTokens: 2048,
    },
  },

  // ==================== NLP 节点 ====================
  "nlp-semantic": {
    title: "NLP语义分析",
    type: "nlp",
    icon: "🔬",
    color: "bg-teal-500",
    inputs: ["text"],
    outputs: ["analysis"],
    config: {
      model: "deepseek-v3",
      analysisType: "comprehensive",
    },
  },
  "personality-analysis": {
    title: "人格分析",
    type: "personality",
    icon: "👤",
    color: "bg-pink-500",
    inputs: ["text"],
    outputs: ["profile"],
    config: {
      model: "deepseek-v3",
      framework: "5-degree",
    },
  },

  // ==================== 算法节点 ====================
  "algo-latex-ai": {
    title: "LaTeX生成",
    type: "algo",
    icon: "📐",
    color: "bg-orange-500",
    inputs: ["input"],
    outputs: ["latex"],
    config: {
      model: "deepseek-v3",
      promptTemplate: "请生成以下数学概念的LaTeX公式：\\n输入: ${input}",
    },
  },
  "algo-formula": {
    title: "公式执行",
    type: "algo",
    icon: "𝑓",
    color: "bg-yellow-500",
    inputs: ["input"],
    outputs: ["result"],
    config: {
      model: "deepseek-v3",
      promptTemplate: "请执行以下数学公式计算：\\n${output}",
    },
  },
  "algo-chart": {
    title: "图表可视化",
    type: "algo-visual",
    icon: "📈",
    color: "bg-cyan-500",
    inputs: ["data"],
    outputs: ["chart"],
    config: {
      library: "echarts",
      chartType: "bar",
      title: "数据可视化图表",
      style: "modern",
      useAI: true,
    },
  },

  // ==================== RAG 节点 ====================
  "rag-upload": {
    title: "文档上传",
    type: "rag",
    icon: "📤",
    color: "bg-green-500",
    inputs: [],
    outputs: ["documents"],
    config: {
      chunkSize: 500,
      chunkOverlap: 50,
    },
  },
  "rag-query": {
    title: "知识检索",
    type: "rag",
    icon: "🔍",
    color: "bg-emerald-500",
    inputs: ["query", "documents"],
    outputs: ["context"],
    config: {
      topK: 3,
      threshold: 0.7,
    },
  },

  // ==================== 图片节点 ====================
  "image-generation": {
    title: "图片生成",
    type: "image",
    icon: "🖼️",
    color: "bg-violet-500",
    inputs: ["prompt"],
    outputs: ["images"],
    config: {
      model: "jimeng-4.0",
      size: "1024x1024",
      n: 4,
      prompt: "",
    },
  },

  // ==================== 过滤节点 ====================
  "llm-filter": {
    title: "大模型过滤器",
    type: "filter",
    icon: "🧹",
    color: "bg-amber-500",
    inputs: ["text", "context"],
    outputs: ["filtered", "rules"],
    config: {
      mode: "ai",
      filterType: "clean",
      aiPrompt: "请清洗以下文本，去除无关内容，保留关键信息：",
      regexPattern: "",
    },
  },

  // ==================== 输入输出节点 ====================
  "input-text": {
    title: "文本输入",
    type: "input",
    icon: "📝",
    color: "bg-slate-500",
    inputs: [],
    outputs: ["text"],
    config: {
      placeholder: "请输入...",
      defaultValue: "",
    },
  },
  "output-text": {
    title: "文本输出",
    type: "output",
    icon: "📤",
    color: "bg-slate-600",
    inputs: ["text"],
    outputs: [],
    config: {},
  },
  "output-save": {
    title: "保存结果",
    type: "output",
    icon: "💾",
    color: "bg-gray-500",
    inputs: ["data"],
    outputs: [],
    config: {
      filename: "result",
      format: "json",
    },
  },

  // ==================== 代码节点 ====================
  "code-js": {
    title: "JavaScript",
    type: "code",
    icon: "⚡",
    color: "bg-yellow-600",
    inputs: ["input"],
    outputs: ["output"],
    config: {
      code: "// 输入数据在 input 变量中\n// 返回处理后的结果\nreturn input;",
    },
  },
  "code-python": {
    title: "Python",
    type: "code",
    icon: "🐍",
    color: "bg-blue-600",
    inputs: ["input"],
    outputs: ["output"],
    config: {
      code: "# 输入数据在 input 变量中\n# 返回处理后的结果\nresult = input",
    },
  },

  // ==================== 逻辑节点 ====================
  condition: {
    title: "条件判断",
    type: "logic",
    icon: "⚖️",
    color: "bg-orange-600",
    inputs: ["input"],
    outputs: ["true", "false"],
    config: {
      condition: "",
      description: "",
    },
  },
  loop: {
    title: "循环",
    type: "logic",
    icon: "🔄",
    color: "bg-red-500",
    inputs: ["input"],
    outputs: ["item", "done"],
    config: {
      maxIterations: 10,
    },
  },
  merge: {
    title: "合并",
    type: "logic",
    icon: "🔀",
    color: "bg-fuchsia-500",
    inputs: ["input1", "input2"],
    outputs: ["output"],
    config: {
      mergeType: "concat",
    },
  },

  // ==================== 触发器节点 ====================
  "trigger-manual": {
    title: "手动触发",
    type: "trigger",
    icon: "▶️",
    color: "bg-green-600",
    inputs: [],
    outputs: ["output"],
    config: {},
  },
  "trigger-schedule": {
    title: "定时触发",
    type: "trigger",
    icon: "⏰",
    color: "bg-blue-600",
    inputs: [],
    outputs: ["output"],
    config: {
      cron: "0 0 * * *",
      timezone: "Asia/Shanghai",
    },
  },
  "trigger-webhook": {
    title: "Webhook",
    type: "trigger",
    icon: "🌐",
    color: "bg-purple-600",
    inputs: [],
    outputs: ["output"],
    config: {
      path: "/webhook",
      method: "POST",
    },
  },

  // ==================== HTTP 节点 ====================
  "http-request": {
    title: "HTTP请求",
    type: "http",
    icon: "🌍",
    color: "bg-sky-500",
    inputs: ["input"],
    outputs: ["response"],
    config: {
      method: "GET",
      url: "",
      headers: {},
      body: "",
    },
  },

  // ==================== 数据库节点 ====================
  "db-query": {
    title: "数据库查询",
    type: "database",
    icon: "🗄️",
    color: "bg-stone-500",
    inputs: ["query"],
    outputs: ["result"],
    config: {
      type: "mysql",
      query: "SELECT * FROM table",
    },
  },

  // ==================== 对话节点 ====================
  chat: {
    title: "对话节点",
    type: "chat",
    icon: "💬",
    color: "bg-rose-500",
    inputs: ["input"],
    outputs: ["output"],
    config: {
      model: "deepseek-v3",
      maxMessages: 10,
    },
  },
};

// 节点分类
export const NODE_CATEGORIES = [
  {
    id: "triggers",
    name: "触发器",
    icon: "▶️",
    nodes: ["trigger-manual", "trigger-schedule", "trigger-webhook"],
  },
  {
    id: "llm",
    name: "大语言模型",
    icon: "🧠",
    nodes: ["llm-deepseek", "llm-gemini", "llm-qwen", "chat"],
  },
  {
    id: "nlp",
    name: "NLP分析",
    icon: "🔬",
    nodes: ["nlp-semantic", "personality-analysis", "llm-filter"],
  },
  {
    id: "rag",
    name: "知识库",
    icon: "📚",
    nodes: ["rag-upload", "rag-query"],
  },
  {
    id: "algo",
    name: "算法与可视化",
    icon: "📊",
    nodes: ["algo-latex-ai", "algo-formula", "algo-chart"],
  },
  {
    id: "image",
    name: "图片处理",
    icon: "🖼️",
    nodes: ["image-generation"],
  },
  {
    id: "code",
    name: "代码执行",
    icon: "💻",
    nodes: ["code-js", "code-python"],
  },
  {
    id: "logic",
    name: "逻辑控制",
    icon: "⚙️",
    nodes: ["condition", "loop", "merge"],
  },
  {
    id: "io",
    name: "输入输出",
    icon: "📋",
    nodes: ["input-text", "output-text", "output-save"],
  },
  {
    id: "integration",
    name: "集成",
    icon: "🔌",
    nodes: ["http-request", "db-query"],
  },
];

export default NODE_TYPES;
