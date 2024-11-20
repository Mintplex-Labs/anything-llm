const TRANSLATIONS = {
  common: {
    "workspaces-name": "工作區名稱",
    error: "錯誤",
    success: "成功",
    user: "使用者",
    selection: "模型選擇",
    saving: "儲存中...",
    save: "儲存修改",
    previous: "上一頁",
    next: "下一頁",
  },

  // 設定側邊欄選單項目
  settings: {
    title: "系統設定",
    system: "一般設定",
    invites: "邀請管理",
    users: "使用者管理",
    workspaces: "工作區管理",
    "workspace-chats": "工作區對話紀錄",
    customization: "介面自訂",
    "api-keys": "開發者 API",
    llm: "大型語言模型 (LLM)",
    transcription: "語音轉錄",
    embedder: "向量嵌入器",
    "text-splitting": "文字分割與區塊化",
    "voice-speech": "語音與發音",
    "vector-database": "向量資料庫",
    embeds: "對話嵌入",
    "embed-chats": "對話嵌入紀錄",
    security: "安全性設定",
    "event-logs": "事件記錄",
    privacy: "隱私與資料",
    "ai-providers": "AI 服務提供者",
    "agent-skills": "智慧代理人技能",
    admin: "系統管理",
    tools: "工具",
    "experimental-features": "實驗性功能",
    contact: "聯絡支援",
    "browser-extension": "瀏覽器擴充功能",
  },

  // 頁面定義
  login: {
    "multi-user": {
      welcome: "歡迎使用",
      "placeholder-username": "使用者名稱",
      "placeholder-password": "密碼",
      login: "登入",
      validating: "驗證中...",
      "forgot-pass": "忘記密碼",
      reset: "重設",
    },
    "sign-in": {
      start: "登入您的",
      end: "帳號。",
    },
    "password-reset": {
      title: "重設密碼",
      description: "請在下方提供必要資訊以重設您的密碼。",
      "recovery-codes": "復原碼",
      "recovery-code": "復原碼 {{index}}",
      "back-to-login": "返回登入頁面",
    },
  },

  welcomeMessage: {
    part1:
      "歡迎使用 AnythingLLM，AnythingLLM 是由 Mintplex Labs 開發的開源 AI 工具，它能將任何內容轉換成可供查詢和對話的訓練模型對話機器人。AnythingLLM 採用 BYOK（自備金鑰）軟體模式，除了您想使用的服務之外，本軟體不收取任何訂閱費、費用或其他費用。",
    part2:
      "AnythingLLM 是將 OpenAI、GPT-4、LangChain、PineconeDB、ChromaDB 和其他強大 AI 產品整合在一起的最簡單方法，它能透過簡潔的套件，輕鬆地將您的生產力提高 100 倍。",
    part3:
      "AnythingLLM 可以完全在您的本機電腦上執行，而且使用極少的資源，您甚至不會注意到它的存在！不需要 GPU。同時也支援雲端和企業內部部署。\nAI 工具生態系統日新月異，AnythingLLM 讓使用變得更加簡單。",
    githubIssue: "在 GitHub 上建立 issue ",
    user1: "我該如何開始？",
    part4:
      "很簡單。所有資料集都組織成我們稱之為「工作區」的儲存區。工作區是檔案、文件、圖片、PDF 和其他檔案的儲存區，這些檔案將會被轉換成 LLM 可以理解並在對話中使用的格式。\n\n您可以隨時新增和移除檔案。",
    createWorkspace: "建立您的第一個工作區",
    user2: "這像是 AI Dropbox 之類的嗎？那對話功能呢？它是一個對話機器人嗎？",
    part5:
      "AnythingLLM 不僅是一個更聰明的 Dropbox。\n\nAnythingLLM 提供兩種與您的資料互動的方式：\n\n<i>查詢：</i> 您的對話將會根據工作區中可存取的文件內容，傳回資料或推論。新增更多文件到工作區會讓它變得更聰明！\n\n<i>對話：</i> 您的文件加上持續進行中的對話紀錄，兩者會同時貢獻給 LLM 的知識庫。這非常適合用於附加即時的文字資訊，或是修正 LLM 可能產生的誤解。\n\n您可以在<i>對話過程中</i>隨時切換這兩種模式！",
    user3: "哇，這聽起來很棒，讓我馬上試試看！",
    part6: "祝您使用愉快！",
    starOnGithub: "在 GitHub 上給我們星星",
    contact: "聯絡 Mintplex Labs",
  },

  "new-workspace": {
    title: "新增工作區",
    placeholder: "我的工作區",
  },

  // 工作區設定選單項目
  "workspaces—settings": {
    general: "一般設定",
    chat: "對話設定",
    vector: "向量資料庫",
    members: "成員管理",
    agent: "智慧代理人設定",
  },

  // 一般外觀
  general: {
    vector: {
      title: "向量計數",
      description: "向量資料庫中的向量總數。",
    },
    names: {
      description: "這只會修改您工作區的顯示名稱。",
    },
    message: {
      title: "建議對話訊息",
      description: "自訂要建議給工作區使用者的訊息。",
      add: "新增訊息",
      save: "儲存訊息",
      heading: "請向我說明",
      body: "AnythingLLM 的優點",
    },
    pfp: {
      title: "助理個人檔案圖片",
      description: "自訂此工作區助理的個人檔案圖片。",
      image: "工作區圖片",
      remove: "移除工作區圖片",
    },
    delete: {
      title: "刪除工作區",
      description: "刪除此工作區及其所有資料。這將會為所有使用者刪除該工作區。",
      delete: "刪除工作區",
      deleting: "正在刪除工作區...",
      "confirm-start": "您即將刪除整個",
      "confirm-end":
        "工作區。這將會移除向量資料庫中的所有向量嵌入。\n\n原始檔案將保持不變。此動作無法復原。",
    },
  },

  // 對話設定
  chat: {
    llm: {
      title: "工作區 LLM 提供者",
      description:
        "此工作區將使用的特定 LLM 提供者與模型。預設情況下，它會使用系統 LLM 提供者和設定。",
      search: "搜尋所有 LLM 提供者",
    },
    model: {
      title: "工作區對話模型",
      description:
        "此工作區將使用的特定對話模型。如果空白，將使用系統 LLM 偏好設定。",
      wait: "-- 等待模型中 --",
    },
    mode: {
      title: "對話模式",
      chat: {
        title: "對話",
        "desc-start": "將會利用 LLM 的一般知識",
        and: "和",
        "desc-end": "找到的文件內容來提供答案。",
      },
      query: {
        title: "查詢",
        "desc-start": "將",
        only: "僅",
        "desc-end": "在找到文件內容時提供答案。",
      },
    },
    history: {
      title: "對話紀錄",
      "desc-start": "先前對話訊息數量，將會包含在回應的短期記憶體中。",
      recommend: "建議 20。",
      "desc-end": "根據訊息大小，任何超過 45 的數值都可能會導致對話持續失敗。",
    },
    prompt: {
      title: "提示詞",
      description:
        "將在此工作區中使用的提示詞。定義 AI 產生回應的上下文和指示。您應該提供精心設計的提示詞，以便 AI 可以產生相關且準確的回應。",
    },
    refusal: {
      title: "查詢模式拒絕回應",
      "desc-start": "在",
      query: "查詢",
      "desc-end": "模式下，當找不到內容時，您可能需要傳回自訂的拒絕回應。",
    },
    temperature: {
      title: "LLM 溫度值",
      "desc-start": "此設定控制 LLM 回應的「創意度」。",
      "desc-end":
        "數值越高，創意度越高。對於某些模型，設定過高可能會導致不連貫的回應。",
      hint: "大多數 LLM 都有各種可接受的有效值範圍。請查詢您的 LLM 提供者以取得該資訊。",
    },
  },

  // 向量資料庫
  "vector-workspace": {
    identifier: "向量資料庫識別碼",
    snippets: {
      title: "最大內容片段數",
      description:
        "此設定控制每次對話或查詢時，將傳送至 LLM 的最大內容片段數量。",
      recommend: "建議值：4",
    },
    doc: {
      title: "文件相似度門檻",
      description:
        "來源被視為與對話相關所需的最低相似度。數值越高，來源與對話的相似度就必須越高。",
      zero: "無限制",
      low: "低 (相似度 ≥ .25)",
      medium: "中 (相似度 ≥ .50)",
      high: "高 (相似度 ≥ .75)",
    },
    reset: {
      reset: "重設向量資料庫",
      resetting: "清除向量中...",
      confirm:
        "您即將重設此工作區的向量資料庫。這將會移除目前所有已嵌入的向量。\n\n原始檔案將保持不變。此動作無法復原。",
      error: "無法重設工作區向量資料庫！",
      success: "工作區向量資料庫已重設！",
    },
  },

  // 智慧代理人設定
  agent: {
    "performance-warning":
      "不直接支援工具呼叫的 LLM 的效能，高度取決於模型的功能和精確度。某些功能可能受限或無法使用。",
    provider: {
      title: "工作區智慧代理人 LLM 提供者",
      description: "此工作區 @agent 智慧代理人將使用的特定 LLM 提供者與模型。",
    },
    mode: {
      chat: {
        title: "工作區智慧代理人對話模型",
        description: "此工作區 @agent 智慧代理人將使用的特定對話模型。",
      },
      title: "工作區智慧代理人模型",
      description: "此工作區 @agent 智慧代理人將使用的特定 LLM 模型。",
      wait: "-- 等待模型中 --",
    },

    skill: {
      title: "預設智慧代理人技能",
      description:
        "使用這些預先建置的技能來強化預設智慧代理人的自然能力。此設定適用於所有工作區。",
      rag: {
        title: "RAG 與長期記憶體",
        description:
          "允許智慧代理人利用您的本機文件來回答查詢，或要求智慧代理人「記住」內容片段，以利長期記憶體擷取。",
      },
      view: {
        title: "檢視與摘要文件",
        description: "允許智慧代理人列出並摘要目前已嵌入的工作區檔案內容。",
      },
      scrape: {
        title: "擷取網站",
        description: "允許智慧代理人瀏覽並擷取網站內容。",
      },
      generate: {
        title: "產生圖表",
        description:
          "讓預設智慧代理人能夠根據提供的資料或對話中給定的資料來產生各種圖表。",
      },
      save: {
        title: "產生並儲存檔案到瀏覽器",
        description:
          "讓預設智慧代理人能夠產生並寫入檔案，這些檔案會儲存並可以從您的瀏覽器下載。",
      },
      web: {
        title: "即時網路搜尋與瀏覽",
        "desc-start":
          "讓您的智慧代理人能夠透過連線到網路搜尋 (SERP) 提供者來搜尋網路以回答您的問題。",
        "desc-end":
          "在設定完成之前，智慧代理人工作階段期間的網路搜尋將無法運作。",
      },
    },
  },

  // 工作區對話紀錄
  recorded: {
    title: "工作區對話紀錄",
    description: "這些是所有已記錄的對話和訊息，依建立日期排序。",
    export: "匯出",
    table: {
      id: "編號",
      by: "傳送者",
      workspace: "工作區",
      prompt: "提示詞",
      response: "回應",
      at: "傳送時間",
    },
  },

  // 外觀
  appearance: {
    title: "外觀",
    description: "自訂平台的外觀設定。",
    logo: {
      title: "自訂 Logo",
      description: "上傳您的自訂 Logo，讓您的對話機器人更具個人特色。",
      add: "新增自訂 Logo",
      recommended: "建議尺寸：800 x 200",
      remove: "移除",
      replace: "取代",
    },
    message: {
      title: "自訂訊息",
      description: "自訂顯示給使用者的自動訊息。",
      new: "新增",
      system: "系統",
      user: "使用者",
      message: "訊息",
      assistant: "AnythingLLM 對話助理",
      "double-click": "點兩下以編輯...",
      save: "儲存訊息",
    },
    icons: {
      title: "自訂頁尾圖示",
      description: "自訂顯示在側邊欄底端的頁尾圖示。",
      icon: "圖示",
      link: "連結",
    },
  },

  // API 金鑰
  api: {
    title: "API 金鑰",
    description:
      "API 金鑰允許持有者以程式化方式存取和管理此 AnythingLLM 系統。",
    link: "閱讀 API 文件",
    generate: "產生新的 API 金鑰",
    table: {
      key: "API 金鑰",
      by: "建立者",
      created: "建立時間",
    },
  },

  llm: {
    title: "LLM 偏好設定",
    description:
      "這些是您偏好的 LLM 對話與嵌入提供者的憑證和設定。確保這些金鑰是最新且正確的，否則 AnythingLLM 將無法正常運作。",
    provider: "LLM 提供者",
  },

  transcription: {
    title: "語音轉錄模型偏好設定",
    description:
      "這些是您偏好的語音轉錄模型提供者的憑證和設定。確保這些金鑰是最新且正確的，否則媒體檔案和音訊將無法轉錄。",
    provider: "語音轉錄提供者",
    "warn-start":
      "在記憶體或處理器資源有限的電腦上使用本機 Whisper 模型，處理媒體檔案時可能會造成 AnythingLLM 停頓。",
    "warn-recommend": "我們建議至少 2GB 的記憶體，並且上傳小於 10MB 的檔案。",
    "warn-end": "內建模型將會在第一次使用時自動下載。",
  },

  embedding: {
    title: "向量嵌入偏好設定",
    "desc-start":
      "當使用原生不支援嵌入引擎的 LLM 時，您可能需要額外指定用於嵌入文字的憑證。",
    "desc-end":
      "嵌入是將文字轉換成向量的過程。這些憑證是用於將您的檔案和提示詞轉換成 AnythingLLM 可以處理的格式。",
    provider: {
      title: "向量嵌入提供者",
      description: "使用 AnythingLLM 的原生嵌入引擎時，不需要任何設定。",
    },
  },

  text: {
    title: "文字分割與區塊化偏好設定",
    "desc-start":
      "有時您可能需要修改新文件在插入向量資料庫之前的預設分割和區塊化方式。",
    "desc-end":
      "只有在了解文字分割的運作方式及其副作用的情況下，才應該修改此設定。",
    "warn-start": "此處的修改只會套用至",
    "warn-center": "新嵌入的文件",
    "warn-end": "，而不會套用至現有文件。",
    size: {
      title: "文字區塊大小",
      description: "這是單一向量中可包含的最大字元長度。",
      recommend: "嵌入模型的最大長度為",
    },

    overlap: {
      title: "文字區塊重疊",
      description: "這是區塊化過程中，兩個相鄰文字區塊之間的最大字元重疊數。",
    },
  },

  // 向量資料庫
  vector: {
    title: "向量資料庫",
    description:
      "這些是您的 AnythingLLM 系統運作方式的憑證和設定。確保這些金鑰是最新且正確的，這點非常重要。",
    provider: {
      title: "向量資料庫提供者",
      description: "使用 LanceDB 不需要任何設定。",
    },
  },

  // 可嵌入對話小工具
  embeddable: {
    title: "可嵌入對話小工具",
    description:
      "可嵌入對話小工具是與單一工作區連結的公開對話介面。這讓您可以建置工作區，然後發布到全世界。",
    create: "建立嵌入",
    table: {
      workspace: "工作區",
      chats: "已傳送對話",
      Active: "已啟用網域",
    },
  },

  "embed-chats": {
    title: "嵌入對話",
    export: "匯出",
    description: "這些是來自您已發布的任何嵌入內容的所有已記錄對話和訊息。",
    table: {
      embed: "嵌入",
      sender: "傳送者",
      message: "訊息",
      response: "回應",
      at: "傳送時間",
    },
  },

  multi: {
    title: "多使用者模式",
    description: "透過啟用多使用者模式來設定您的系統，以支援您的團隊。",
    enable: {
      "is-enable": "多使用者模式已啟用",
      enable: "啟用多使用者模式",
      description:
        "預設情況下，您將是唯一的管理員。身為管理員，您需要為所有新使用者或管理員建立帳號。請勿遺失您的密碼，因為只有管理員使用者可以重設密碼。",
      username: "管理員帳號使用者名稱",
      password: "管理員帳號密碼",
    },
    password: {
      title: "密碼保護",
      description:
        "使用密碼保護您的 AnythingLLM 系統。如果您忘記這個密碼，將沒有復原方法，因此請務必儲存此密碼。",
    },
    instance: {
      title: "系統密碼保護",
      description:
        "預設情況下，您將是唯一的管理員。身為管理員，您需要為所有新使用者或管理員建立帳號。請勿遺失您的密碼，因為只有管理員使用者可以重設密碼。",
      password: "系統密碼",
    },
  },

  // 事件記錄
  event: {
    title: "事件記錄",
    description: "檢視此系統上發生的所有動作和事件，以進行監控。",
    clear: "清除事件記錄",
    table: {
      type: "事件類型",
      user: "使用者",
      occurred: "發生時間",
    },
  },

  // 隱私與資料處理
  privacy: {
    title: "隱私與資料處理",
    description:
      "這是您針對已連線的第三方供應商和 AnythingLLM 如何處理您的資料的設定。",
    llm: "LLM 選擇",
    embedding: "向量嵌入偏好設定",
    vector: "向量資料庫",
    anonymous: "已啟用匿名統計資訊",
  },
};

export default TRANSLATIONS;
