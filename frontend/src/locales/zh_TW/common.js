// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "開始使用",
      welcome: "歡迎",
    },
    llm: {
      title: "LLM 偏好",
      description:
        "AnythingLLM 可搭配多種 LLM 提供者使用。這項服務會負責處理對話。",
    },
    userSetup: {
      title: "使用者設定",
      description: "設定使用者偏好。",
      howManyUsers: "這套系統會有多少位使用者？",
      justMe: "只有我",
      myTeam: "我的團隊",
      instancePassword: "系統密碼",
      setPassword: "要設定密碼嗎？",
      passwordReq: "密碼必須至少包含 8 個字元。",
      passwordWarn: "請務必妥善保存此密碼，因為目前沒有復原方式。",
      adminUsername: "管理員帳號使用者名稱",
      adminPassword: "管理員帳號密碼",
      adminPasswordReq: "密碼必須至少包含 8 個字元。",
      teamHint:
        "預設只有您擁有管理員權限。完成初始設定後，即可建立帳號並邀請其他人成為使用者或管理員。請勿遺失密碼，因為只有管理員能重設密碼。",
    },
    data: {
      title: "資料處理與隱私",
      description: "對於個人資料的處理方式，我們致力於提供透明度與控制權。",
      settingsHint: "這些設定之後都可以在設定頁面重新調整。",
    },
    survey: {
      title: "歡迎使用 AnythingLLM",
      description: "協助我們打造更符合需求的 AnythingLLM。此問卷為選填。",
      email: "您的電子郵件是什麼？",
      useCase: "您將如何使用 AnythingLLM？",
      useCaseWork: "用於工作",
      useCasePersonal: "用於個人使用",
      useCaseOther: "其他",
      comment: "您是從哪裡知道 AnythingLLM 的？",
      commentPlaceholder:
        "例如 Reddit、Twitter、GitHub、YouTube 等，告訴我們您是怎麼找到 AnythingLLM 的！",
      skip: "略過問卷",
      thankYou: "感謝您的回饋！",
    },
  },
  common: {
    "workspaces-name": "工作區名稱",
    selection: "模型選擇",
    saving: "儲存中...",
    save: "儲存變更",
    previous: "上一頁",
    next: "下一頁",
    optional: "選填",
    yes: "是",
    no: "否",
    search: "搜尋",
    username_requirements:
      "使用者名稱必須為 2-32 個字元，以小寫字母開頭，且只能包含小寫字母、數字、底線、連字號和句點。",
    on: "關於",
    none: "沒有",
    stopped: "停止",
    loading: "載入",
    refresh: "重新整理",
  },
  settings: {
    title: "系統設定",
    invites: "邀請",
    users: "使用者",
    workspaces: "工作區",
    "workspace-chats": "工作區對話紀錄",
    customization: "自訂",
    "api-keys": "開發者 API",
    llm: "大型語言模型 (LLM)",
    transcription: "語音轉錄",
    embedder: "向量嵌入器",
    "text-splitting": "文字分割與切塊",
    "voice-speech": "語音與發音",
    "vector-database": "向量資料庫",
    embeds: "對話嵌入",
    security: "安全性",
    "event-logs": "事件記錄",
    privacy: "隱私與資料",
    "ai-providers": "AI 服務提供者",
    "agent-skills": "智慧代理人技能",
    admin: "管理",
    tools: "工具",
    "experimental-features": "實驗性功能",
    contact: "聯絡支援",
    "browser-extension": "瀏覽器擴充功能",
    "system-prompt-variables": "系統提示變數",
    interface: "介面偏好",
    branding: "品牌與白標設定",
    chat: "對話",
    "mobile-app": "AnythingLLM 行動版",
    "community-hub": {
      title: "社群中心",
      trending: "探索熱門",
      "your-account": "您的帳戶",
      "import-item": "匯入項目",
    },
    channels: "頻道",
    "available-channels": {
      telegram: "電訊",
    },
  },
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
    "sign-in": "輸入使用者名稱與密碼，以存取您的 {{appName}} 系統。",
    "password-reset": {
      title: "重設密碼",
      description: "請在下方提供必要資訊以重設您的密碼。",
      "recovery-codes": "復原碼",
      "back-to-login": "返回登入",
    },
  },
  "new-workspace": {
    title: "新增工作區",
    placeholder: "我的工作區",
  },
  "workspaces—settings": {
    general: "一般設定",
    chat: "對話設定",
    vector: "向量資料庫",
    members: "成員",
    agent: "智慧代理人設定",
  },
  general: {
    vector: {
      title: "向量計數",
      description: "向量資料庫中的向量總數。",
    },
    names: {
      description: "只會變更工作區的顯示名稱。",
    },
    message: {
      title: "建議對話訊息",
      description: "自訂要推薦給工作區使用者的訊息。",
      add: "新增訊息",
      save: "儲存訊息",
      heading: "請向我說明",
      body: "AnythingLLM 的優點",
    },
    delete: {
      title: "刪除工作區",
      description: "刪除此工作區及其所有資料。所有使用者都會失去這個工作區。",
      delete: "刪除工作區",
      deleting: "正在刪除工作區...",
      "confirm-start": "您即將刪除整個",
      "confirm-end":
        "工作區。這會移除向量資料庫中的所有向量嵌入內容。\n\n原始來源檔案不會受影響。此動作無法復原。",
    },
  },
  chat: {
    llm: {
      title: "工作區 LLM 提供者",
      description:
        "這個工作區要使用的 LLM 提供者與模型。預設會沿用系統層級的 LLM 提供者與設定。",
      search: "搜尋所有 LLM 提供者",
    },
    model: {
      title: "工作區對話模型",
      description:
        "這個工作區要使用的對話模型。若留空，會沿用系統層級的 LLM 偏好設定。",
    },
    mode: {
      title: "對話模式",
      chat: {
        title: "對話",
        description:
          "將提供答案，並利用 LLM 的通用知識和相關文件內容。您需要使用 @agent 命令來使用工具。",
      },
      query: {
        title: "查詢",
        description:
          "將提供答案，但僅在確認文件內容時.<b>您需要使用 `@agent` 命令來使用工具。",
      },
      automatic: {
        title: "自動",
        description:
          "如果模型和供應商支援原生工具調用，則系統會自動使用這些工具。<br />如果原生工具調用不受支援，您需要使用 `@agent` 命令來使用工具。",
      },
    },
    history: {
      title: "對話紀錄",
      "desc-start": "會納入回應短期記憶的過往對話訊息數量。",
      recommend: "建議值為 20。",
      "desc-end": "若超過 45，依訊息大小不同，很可能持續發生對話失敗。",
    },
    prompt: {
      title: "系統提示詞",
      description:
        "這是此工作區會使用的提示詞，用來定義 AI 產生回應時的脈絡與指示。請提供經過仔細設計的提示詞，讓 AI 能產生相關且準確的回應。",
      history: {
        title: "系統提示詞歷史記錄",
        clearAll: "清除全部",
        noHistory: "目前沒有系統提示詞歷史記錄",
        restore: "復原",
        delete: "刪除",
        deleteConfirm: "您確定要刪除此歷史記錄項目嗎？",
        clearAllConfirm: "您確定要刪除所有歷史記錄嗎？此操作無法復原。",
        expand: "展開",
        publish: "發布到社群中心",
      },
    },
    refusal: {
      title: "查詢模式拒絕訊息",
      "desc-start": "在",
      query: "查詢",
      "desc-end": "模式下，若找不到內容，您可以設定自訂的拒絕回應。",
      "tooltip-title": "我為什麼會看到這個？",
      "tooltip-description":
        "目前處於查詢模式，這個模式只會使用文件中的資訊。若想進行更彈性的對話，請切換到對話模式；或點選這裡前往文件，進一步了解對話模式。",
    },
    temperature: {
      title: "LLM 溫度",
      "desc-start": "這項設定會控制 LLM 回應的「創意程度」。",
      "desc-end":
        "數值越高，創意度越高。對於某些模型，設定過高可能會導致不連貫的回應。",
      hint: "大多數 LLM 都有各自可接受的有效值範圍，請向 LLM 提供者查詢。",
    },
  },
  "vector-workspace": {
    identifier: "向量資料庫識別碼",
    snippets: {
      title: "最大內容片段數",
      description: "這項設定會控制每次對話或查詢送給 LLM 的內容片段上限。",
      recommend: "建議值：4",
    },
    doc: {
      title: "文件相似度門檻",
      description:
        "來源至少要達到這個相似度分數，才會被視為與對話相關。數值越高，代表來源必須越接近對話內容。",
      zero: "不限制",
      low: "低（相似度分數 ≥ .25）",
      medium: "中（相似度分數 ≥ .50）",
      high: "高（相似度分數 ≥ .75）",
    },
    reset: {
      reset: "重設向量資料庫",
      resetting: "正在清除向量...",
      confirm:
        "您即將重設這個工作區的向量資料庫。這會移除目前所有已嵌入的向量。\n\n原始來源檔案不會受影響。此動作無法復原。",
      error: "無法重設工作區向量資料庫！",
      success: "工作區向量資料庫已重設！",
    },
  },
  agent: {
    "performance-warning":
      "對於未明確支援工具呼叫的 LLM，其效能高度仰賴模型本身的能力與準確度。部分功能可能受限，甚至無法使用。",
    provider: {
      title: "工作區智慧代理人 LLM 提供者",
      description: "這個工作區的 @agent 會使用的 LLM 提供者與模型。",
    },
    mode: {
      chat: {
        title: "工作區 @agent 對話模型",
        description: "這個工作區的 @agent 會使用的對話模型。",
      },
      title: "工作區 @agent 模型",
      description: "這個工作區的 @agent 會使用的 LLM 模型。",
      wait: "-- 正在等待模型 --",
    },
    skill: {
      rag: {
        title: "RAG 與長期記憶體",
        description:
          "讓智慧代理人可運用本機文件回答問題，也能要求智慧代理人「記住」特定內容片段，以供長期記憶擷取。",
      },
      view: {
        title: "檢視並摘要文件",
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
      web: {
        title: "網頁搜尋",
        description:
          "透過連接網頁搜尋 (SERP) 提供者，讓智慧代理人能搜尋網路並回答問題。",
      },
      sql: {
        title: "SQL 連接器",
        description:
          "讓您的智慧代理人能夠利用 SQL 查詢來回答您的問題，只需連接到不同的 SQL 資料庫提供者即可。",
      },
      default_skill: "這項技能預設為啟用；若不希望智慧代理人使用，也可以停用。",
      filesystem: {
        title: "檔案系統存取",
        description:
          "允許您的代理程式在指定目錄中讀取、寫入、搜尋和管理檔案。支援檔案編輯、目錄導航和內容搜尋功能。",
        learnMore: "了解更多關於如何運用這項技能的資訊",
        configuration: "設定",
        readActions: "閱讀行動",
        writeActions: "撰寫動作",
        warning:
          "訪問檔案系統可能存在風險，因為它可能會修改或刪除檔案。在啟用之前，請務必查閱相關<link>文件</link>。",
        skills: {
          "read-text-file": {
            title: "開啟檔案",
            description: "閱讀檔案內容（包括文字、程式碼、PDF 文件、圖片等）",
          },
          "read-multiple-files": {
            title: "閱讀多個檔案",
            description: "同時讀取多個檔案",
          },
          "list-directory": {
            title: "名錄索引",
            description: "列出指定資料夾中的檔案和目錄",
          },
          "search-files": {
            title: "搜尋檔案",
            description: "按檔案名稱或內容來搜尋",
          },
          "get-file-info": {
            title: "取得檔案資訊",
            description: "獲取關於檔案的詳細元數據",
          },
          "edit-file": {
            title: "編輯檔案",
            description: "能夠對文字檔案進行行別編輯。",
          },
          "create-directory": {
            title: "建立資料夾",
            description: "建立新的資料夾",
          },
          "move-file": {
            title: "移動/更名檔案",
            description: "移動或更名檔案和資料夾",
          },
          "copy-file": {
            title: "複製檔案",
            description: "複製檔案和目錄",
          },
          "write-text-file": {
            title: "撰寫文字檔案",
            description: "建立新的文字檔，或覆蓋現有的文字檔。",
          },
        },
      },
      createFiles: {
        title: "文件建立",
        description:
          "允許您的代理創建二元文件格式，例如PowerPoint簡報、Excel電子表格、Word文件和PDF文件。 文件可以直接從聊天窗口下載。",
        configuration: "可用的文件類型",
        skills: {
          "create-text-file": {
            title: "文字檔",
            description:
              "能夠創建包含任何內容和檔案擴展名（例如：.txt、.md、.json、.csv 等）的文字檔案。",
          },
          "create-pptx": {
            title: "PowerPoint 簡報",
            description: "創建新的 PowerPoint 簡報，包含幻燈片、標題和要點",
          },
          "create-pdf": {
            title: "PDF 文件",
            description:
              "能夠從 Markdown 或純文字檔案中，使用基本的格式設定，創建 PDF 文件。",
          },
          "create-xlsx": {
            title: "Excel 試算表",
            description: "建立包含表格資料、工作表和樣式的 Excel 文件",
          },
          "create-docx": {
            title: "Word 格式的文件",
            description: "建立包含基本樣式和格式的 Word 文件",
          },
        },
      },
    },
    mcp: {
      title: "MCP 伺服器",
      "loading-from-config": "從設定檔中載入 MCP 伺服器",
      "learn-more": "了解更多關於 MCP 伺服器的資訊。",
      "no-servers-found": "未找到任何 MCP 伺服器",
      "tool-warning": "為了獲得最佳效能，建議關閉不必要的工具，以節省資源。",
      "stop-server": "停止 MCP 伺服器",
      "start-server": "啟動 MCP 伺服器",
      "delete-server": "刪除 MCP 伺服器",
      "tool-count-warning":
        "這個 MCP 伺服器已啟用 <b> 工具，這些工具會消耗聊天中的語境 </b>。建議停用不需要的工具，以節省語境。",
      "startup-command": "啟動指令",
      command: "指令",
      arguments: "辯論",
      "not-running-warning":
        "這個 MCP 伺服器目前處於停止狀態，可能是因為已停止運作，或是啟動時出現錯誤。",
      "tool-call-arguments": "工具呼叫的參數",
      "tools-enabled": "已啟用工具",
    },
    settings: {
      title: "代理人技能設定",
      "max-tool-calls": {
        title: "每次回應的最大工具呼叫次數",
        description:
          "這設定了代理可以串聯使用的最大工具數量，以確保每次回應只會呼叫有限的工具，並避免無限循環。",
      },
      "intelligent-skill-selection": {
        title: "智能技能選擇",
        "beta-badge": "β 版本",
        description:
          "啟用無限多個工具，並將每個查詢的 token 使用量最多降低 80% — AnythingLLM 能夠自動選擇最適合的技能，以處理每一個提示。",
        "max-tools": {
          title: "馬克斯工具",
          description:
            "可選取的工具的最大數量，適用於每個查詢。我們建議將此值設定為較高的值，以適用於較大的模型。",
        },
      },
    },
  },
  recorded: {
    title: "工作區對話紀錄",
    description: "這裡列出所有已記錄的對話與訊息，依建立時間排序。",
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
  api: {
    title: "API 金鑰",
    description:
      "API 金鑰可讓持有人透過程式方式存取並管理這個 AnythingLLM 系統。",
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
      "這裡設定偏好的 LLM 對話與嵌入提供者之認證資訊與參數。請確認金鑰保持最新且正確，否則 AnythingLLM 可能無法正常運作。",
    provider: "LLM 提供者",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure 服務端點",
        api_key: "API 金鑰",
        chat_deployment_name: "對話部署名稱",
        chat_model_token_limit: "對話模型 Token 上限",
        model_type: "模型類型",
        default: "預設",
        reasoning: "推理",
        model_type_tooltip:
          "如果您的部署使用推理模型（例如 o1、o1-mini、o3-mini 等），請將此設定設為「推理」。否則，您的對話請求可能會失敗。",
      },
    },
  },
  transcription: {
    title: "語音轉錄模型偏好設定",
    description:
      "這裡設定偏好的語音轉錄模型提供者之認證資訊與參數。請確認金鑰保持最新且正確，否則媒體檔與音訊可能無法完成轉錄。",
    provider: "語音轉錄提供者",
    "warn-start":
      "在記憶體或 CPU 資源有限的電腦上使用本機 Whisper 模型時，處理媒體檔案可能會讓 AnythingLLM 卡住。",
    "warn-recommend": "建議至少保留 2 GB 記憶體，且上傳檔案小於 10 MB。",
    "warn-end": "內建模型將會在第一次使用時自動下載。",
  },
  embedding: {
    title: "嵌入模型偏好設定",
    "desc-start":
      "使用原生不支援嵌入引擎的 LLM 時，可能需要另外提供文字嵌入的認證資訊。",
    "desc-end":
      "嵌入是把文字轉成向量的過程。這些認證資訊用來把檔案與提示詞轉成 AnythingLLM 可處理的格式。",
    provider: {
      title: "向量嵌入提供者",
    },
  },
  text: {
    title: "文字分割與切塊偏好設定",
    "desc-start":
      "有時您可能想調整新文件在寫入向量資料庫前的預設分割與切塊方式。",
    "desc-end":
      "只有在清楚了解文字分割的運作方式及其副作用時，才建議調整此設定。",
    size: {
      title: "文字區塊大小",
      description: "單一向量可包含的最大字元長度。",
      recommend: "嵌入模型的最大長度為",
    },
    overlap: {
      title: "文字切塊重疊",
      description: "切塊時兩個相鄰文字區塊之間允許的最大重疊字元數。",
    },
  },
  vector: {
    title: "向量資料庫",
    description:
      "這裡設定 AnythingLLM 系統運作所需的認證資訊與參數。請務必確認金鑰保持最新且正確。",
    provider: {
      title: "向量資料庫提供者",
      description: "使用 LanceDB 不需要任何設定。",
    },
  },
  embeddable: {
    title: "可嵌入對話元件",
    description:
      "可嵌入對話元件是綁定單一工作區、可對外公開的對話介面。您可以建立工作區，再將它發布給外部使用。",
    create: "建立嵌入元件",
    table: {
      workspace: "工作區",
      chats: "已傳送對話",
      active: "啟用中的網域",
      created: "建立",
    },
  },
  "embed-chats": {
    title: "嵌入對話記錄",
    export: "匯出",
    description: "這裡列出所有來自已發布嵌入元件的對話與訊息紀錄。",
    table: {
      embed: "嵌入",
      sender: "傳送者",
      message: "訊息",
      response: "回應",
      at: "傳送時間",
    },
  },
  event: {
    title: "事件記錄",
    description: "檢視這套系統上發生的所有動作與事件，以便監控。",
    clear: "清除事件記錄",
    table: {
      type: "事件類型",
      user: "使用者",
      occurred: "發生時間",
    },
  },
  privacy: {
    title: "隱私與資料處理",
    description: "這裡設定已連線的第三方提供者與 AnythingLLM 會如何處理資料。",
    anonymous: "已啟用匿名遙測",
  },
  connectors: {
    "search-placeholder": "搜尋資料連接器",
    "no-connectors": "未找到資料連接器。",
    github: {
      name: "GitHub 儲存庫",
      description: "一鍵匯入整個公開或私有的 GitHub 儲存庫。",
      URL: "GitHub 儲存庫網址",
      URL_explained: "您希望收集的 GitHub 儲存庫網址。",
      token: "GitHub 存取權杖",
      optional: "可選",
      token_explained: "存取權杖以防止速率限制。",
      token_explained_start: "若沒有 ",
      token_explained_link1: "個人存取權杖",
      token_explained_middle:
        "，GitHub API 可能會因為速率限制而限制可收集的檔案數量。您可以 ",
      token_explained_link2: "建立一個臨時的存取權杖",
      token_explained_end: " 來避免此問題。",
      ignores: "忽略檔案",
      git_ignore:
        "以 .gitignore 格式列出以忽略特定檔案。每輸入一個條目後按 Enter 鍵儲存。",
      task_explained: "完成後，所有檔案將可供嵌入到工作區中的檔案選擇器。",
      branch: "您希望收集檔案的分支。",
      branch_loading: "-- 載入可用分支 --",
      branch_explained: "您希望收集檔案的分支。",
      token_information:
        "若未填寫 <b>GitHub 存取權杖</b>，此資料連接器僅能收集儲存庫的 <b>頂層</b> 檔案，因 GitHub 的公開 API 速率限制。",
      token_personal: "在此獲取免費的 GitHub 個人存取權杖。",
    },
    gitlab: {
      name: "GitLab 儲存庫",
      description: "一鍵匯入整個公開或私有的 GitLab 儲存庫。",
      URL: "GitLab 儲存庫網址",
      URL_explained: "您希望收集的 GitLab 儲存庫網址。",
      token: "GitLab 存取權杖",
      optional: "可選",
      token_description: "選擇要從 GitLab API 中擷取的其他實體。",
      token_explained_start: "若沒有 ",
      token_explained_link1: "個人存取權杖",
      token_explained_middle:
        "，GitLab API 可能會因為速率限制而限制可收集的檔案數量。您可以 ",
      token_explained_link2: "建立一個臨時的存取權杖",
      token_explained_end: " 來避免此問題。",
      fetch_issues: "擷取問題作為文件",
      ignores: "忽略檔案",
      git_ignore:
        "以 .gitignore 格式列出以忽略特定檔案。每輸入一個條目後按 Enter 鍵儲存。",
      task_explained: "完成後，所有檔案將可供嵌入到工作區中的檔案選擇器。",
      branch: "您希望收集檔案的分支",
      branch_loading: "-- 載入可用分支 --",
      branch_explained: "您希望收集檔案的分支。",
      token_information:
        "若未填寫 <b>GitLab 存取權杖</b>，此資料連接器僅能收集儲存庫的 <b>頂層</b> 檔案，因 GitLab 的公開 API 速率限制。",
      token_personal: "在此獲取免費的 GitLab 個人存取權杖。",
    },
    youtube: {
      name: "YouTube 文字稿",
      description: "從連結匯入整個 YouTube 影片的文字稿。",
      URL: "YouTube 影片網址",
      URL_explained_start:
        "輸入任何 YouTube 影片的網址以擷取其文字稿。該影片必須擁有 ",
      URL_explained_link: "字幕",
      URL_explained_end: " 來提供文字稿。",
      task_explained: "完成後，文字稿將可供嵌入到工作區中的檔案選擇器。",
    },
    "website-depth": {
      name: "批次連結擷取器",
      description: "擷取網站及其子連結，直到指定深度。",
      URL: "網站網址",
      URL_explained: "您希望擷取的網站網址。",
      depth: "擷取深度",
      depth_explained: "系統會從起始網址往下追蹤的子連結層數。",
      max_pages: "最大頁數",
      max_pages_explained: "最大擷取連結數量。",
      task_explained:
        "完成後，所有擷取的內容將可供嵌入到工作區中的檔案選擇器。",
    },
    confluence: {
      name: "Confluence",
      description: "一鍵匯入整個 Confluence 頁面。",
      deployment_type: "Confluence 部署類型",
      deployment_type_explained:
        "確認 Confluence 環境是託管於 Atlassian 雲端，還是自行託管。",
      base_url: "Confluence 基本網址",
      base_url_explained: "這是您的 Confluence 空間的基本網址。",
      space_key: "Confluence 空間金鑰",
      space_key_explained:
        "這是 Confluence 環境要使用的空間金鑰，通常會以 ~ 開頭。",
      username: "Confluence 使用者名稱",
      username_explained: "請輸入 Confluence 使用者名稱。",
      auth_type: "Confluence 認證類型",
      auth_type_explained: "選擇您希望用來存取 Confluence 頁面的認證類型。",
      auth_type_username: "使用者名稱和存取權杖",
      auth_type_personal: "個人存取權杖",
      token: "Confluence 存取權杖",
      token_explained_start: "需要提供存取權杖才能完成驗證。您可以在 ",
      token_explained_link: "這裡",
      token_desc: "用於認證的存取權杖",
      pat_token: "Confluence 個人存取權杖",
      pat_token_explained: "您的 Confluence 個人存取權杖。",
      task_explained: "完成後，頁面內容將可供嵌入到工作區中的檔案選擇器。",
      bypass_ssl: "跳過 SSL 憑證驗證",
      bypass_ssl_explained:
        "若是使用自簽憑證的自行託管 Confluence 環境，可啟用此選項略過 SSL 憑證驗證。",
    },
    manage: {
      documents: "文件",
      "data-connectors": "資料連接器",
      "desktop-only":
        "編輯這些設定僅在桌面裝置上可用。請在桌面上開啟此頁面以繼續。",
      dismiss: "忽略",
      editing: "編輯中",
    },
    directory: {
      "my-documents": "我的文件",
      "new-folder": "新資料夾",
      "search-document": "搜尋文件",
      "no-documents": "無文件",
      "move-workspace": "移動到工作區",
      "delete-confirmation":
        "您確定要刪除這些檔案和資料夾嗎？\n這將從系統中刪除這些檔案並自動從任何現有工作區中移除它們。\n此操作無法還原。",
      "removing-message":
        "正在刪除 {{count}} 份文件和 {{folderCount}} 個資料夾，請稍候。",
      "move-success": "已成功移動 {{count}} 份文件。",
      no_docs: "無文件",
      select_all: "全選",
      deselect_all: "取消全選",
      remove_selected: "移除選擇的項目",
      save_embed: "儲存並嵌入",
      "total-documents_one": "{{count}} 文件",
      "total-documents_other": "{{count}} 文件",
    },
    upload: {
      "processor-offline": "文件處理器無法使用",
      "processor-offline-desc":
        "目前無法上傳檔案，因為文件處理器已離線。請稍後再試。",
      "click-upload": "點選以上傳，或直接拖放檔案",
      "file-types": "支援文字檔、CSV、試算表、音訊檔等格式！",
      "or-submit-link": "或貼上連結",
      "placeholder-link": "https://example.com",
      fetching: "正在擷取...",
      "fetch-website": "擷取網站",
      "privacy-notice":
        "這些檔案會上傳到此 AnythingLLM 系統上的文件處理器，不會傳送給或分享給第三方。",
    },
    pinning: {
      what_pinning: "什麼是文件釘選？",
      pin_explained_block1:
        "當您在 AnythingLLM 中<b>釘選</b>文件時，系統會把整份文件的內容注入提示詞輸入區，讓 LLM 能完整理解。",
      pin_explained_block2:
        "這最適合搭配<b>大上下文模型</b>，或對知識庫很重要的小型文件。",
      pin_explained_block3:
        "如果 AnythingLLM 在預設情況下給不出想要的答案，釘選文件是快速提升回答品質的好方法。",
      accept: "好的，明白了",
    },
    watching: {
      what_watching: "追蹤文件有何作用？",
      watch_explained_block1:
        "當您在 AnythingLLM 中<b>追蹤</b>文件時，系統會<i>自動</i>定期從原始來源同步內容，並更新所有管理這份文件的工作區。",
      watch_explained_block2:
        "目前這項功能只支援線上來源內容，手動上傳的文件無法使用。",
      watch_explained_block3_start: "您可以從 ",
      watch_explained_block3_link: "檔案管理器",
      watch_explained_block3_end: " 管理頁面查看及管理追蹤中的文件。",
      accept: "好的，明白了",
    },
    obsidian: {
      vault_location: "Vault 位置",
      vault_description:
        "選擇您的 Obsidian Vault 資料夾以匯入所有筆記及其連結。",
      selected_files: "找到 {{count}} 個 Markdown 檔案",
      importing: "正在匯入 Vault...",
      import_vault: "匯入 Vault",
      processing_time: "這可能需要一段時間，具體取決於您的 Vault 大小。",
      vault_warning: "為避免任何衝突，請確保您的 Obsidian Vault 目前未開啟。",
    },
  },
  chat_window: {
    send_message: "傳送訊息",
    attach_file: "將檔案附加到這段對話",
    text_size: "調整文字大小。",
    microphone: "以語音輸入提示詞。",
    send: "將提示詞送到工作區",
    attachments_processing: "附件正在處理中，請稍後...",
    tts_speak_message: "朗讀訊息",
    copy: "複製",
    regenerate: "重新產生",
    regenerate_response: "重新產生回應",
    good_response: "標記為優質回應",
    more_actions: "更多操作",
    fork: "分支對話",
    delete: "刪除",
    cancel: "取消",
    edit_prompt: "編輯提示詞",
    edit_response: "編輯回應",
    preset_reset_description: "清除聊天紀錄並開始新的聊天",
    add_new_preset: "新增預設",
    command: "指令",
    your_command: "your-command",
    placeholder_prompt: "這段內容會插入在提示詞前方。",
    description: "描述",
    placeholder_description: "回應一首關於 LLM 的詩。",
    save: "儲存",
    small: "小",
    normal: "一般",
    large: "大",
    workspace_llm_manager: {
      search: "搜尋 LLM 提供者",
      loading_workspace_settings: "正在載入工作區設定...",
      available_models: "{{provider}} 可用模型",
      available_models_description: "選擇要在此工作區使用的模型。",
      save: "使用此模型",
      saving: "正在將模型設為工作區預設值...",
      missing_credentials: "此提供者缺少憑證！",
      missing_credentials_description: "點選以設定認證資訊",
    },
    submit: "送出",
    edit_info_user: "「送出」會重新產生 AI 回應。「儲存」只會更新訊息內容。",
    edit_info_assistant: "您的修改將直接儲存到此處。",
    see_less: "顯示較少",
    see_more: "查看更多",
    tools: "工具",
    text_size_label: "文字大小",
    select_model: "選擇模型",
    sources: "來源",
    document: "文件",
    similarity_match: "相符度",
    source_count_one: "{{count}} 筆參考資料",
    source_count_other: "{{count}} 筆參考資料",
    preset_exit_description: "暫停目前的智慧代理人工作階段",
    add_new: "新增",
    edit: "編輯",
    publish: "發佈",
    stop_generating: "停止產生回應",
    slash_commands: "斜線指令",
    agent_skills: "智慧代理人技能",
    manage_agent_skills: "管理智慧代理人技能",
    agent_skills_disabled_in_session:
      "啟用智慧代理人工作階段時無法修改技能。請先使用 /exit 指令結束目前工作階段。",
    start_agent_session: "開始智慧代理人工作階段",
    use_agent_session_to_use_tools:
      "若要在對話中使用工具，請在提示詞開頭加上 '@agent'，即可開始智慧代理人工作階段。",
    agent_invocation: {
      model_wants_to_call: "模型想要撥打電話",
      approve: "批准",
      reject: "拒絕",
      always_allow: "請務必確保 {{skillName}}",
      tool_call_was_approved: "工具請求已獲得批准。",
      tool_call_was_rejected: "請求已遭拒絕",
    },
  },
  profile_settings: {
    edit_account: "編輯帳戶",
    profile_picture: "個人資料圖片",
    remove_profile_picture: "移除個人資料圖片",
    username: "使用者名稱",
    new_password: "新密碼",
    password_description: "密碼長度必須至少為 8 個字元",
    cancel: "取消",
    update_account: "更新帳戶",
    theme: "主題偏好",
    language: "慣用語言",
    failed_upload: "上傳個人資料圖片失敗：{{error}}",
    upload_success: "個人資料圖片已上傳。",
    failed_remove: "移除個人資料圖片失敗：{{error}}",
    profile_updated: "個人資料已更新。",
    failed_update_user: "更新使用者資料失敗：{{error}}",
    account: "帳戶",
    support: "支援",
    signout: "登出",
  },
  customization: {
    interface: {
      title: "介面偏好設定",
      description: "設定 AnythingLLM 的介面偏好。",
    },
    branding: {
      title: "品牌與白標設定",
      description: "透過自訂品牌元素，將 AnythingLLM 白標化。",
    },
    chat: {
      title: "對話",
      description: "設定 AnythingLLM 的對話偏好。",
      auto_submit: {
        title: "語音輸入自動送出",
        description: "在一段靜默後自動送出語音輸入",
      },
      auto_speak: {
        title: "自動語音回應",
        description: "自動朗讀 AI 的回應內容",
      },
      spellcheck: {
        title: "啟用拼字檢查",
        description: "在對話輸入框中啟用或停用拼字檢查",
      },
    },
    items: {
      theme: {
        title: "主題",
        description: "選擇偏好的應用程式色彩主題。",
      },
      "show-scrollbar": {
        title: "顯示捲軸",
        description: "在對話視窗中啟用或停用捲軸。",
      },
      "support-email": {
        title: "支援信箱",
        description: "設定當使用者需要協助時可聯絡的支援電子郵件地址。",
      },
      "app-name": {
        title: "名稱",
        description: "設定顯示在登入頁面、讓所有使用者都看得到的名稱。",
      },
      "display-language": {
        title: "顯示語言",
        description: "選擇 AnythingLLM 介面的顯示語言；若已有翻譯就會套用。",
      },
      logo: {
        title: "品牌標誌",
        description: "上傳自訂標誌，顯示於所有頁面。",
        add: "新增自訂標誌",
        recommended: "建議尺寸：800 x 200",
        remove: "移除",
        replace: "更換",
      },
      "browser-appearance": {
        title: "瀏覽器外觀",
        description: "自訂應用程式在瀏覽器分頁中的外觀與標題。",
        tab: {
          title: "分頁標題",
          description: "當應用程式在瀏覽器中開啟時設定自訂的分頁標題。",
        },
        favicon: {
          title: "網站圖示 (Favicon)",
          description: "為瀏覽器分頁設定自訂網站圖示。",
        },
      },
      "sidebar-footer": {
        title: "側邊欄頁尾項目",
        description: "自訂側邊欄底部顯示的項目。",
        icon: "圖示",
        link: "連結",
      },
      "render-html": {
        title: "在對話中渲染 HTML",
        description:
          "在助理回應中渲染 HTML 內容。\n這能顯著提升呈現精細度，但也可能帶來潛在安全風險。",
      },
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "建立智慧代理人",
      editWorkspace: "編輯工作區",
      uploadDocument: "上傳文件",
    },
    greeting: "今天想做什麼？",
  },
  "keyboard-shortcuts": {
    title: "鍵盤快速鍵",
    shortcuts: {
      settings: "開啟設定",
      workspaceSettings: "開啟目前工作區設定",
      home: "前往首頁",
      workspaces: "管理工作區",
      apiKeys: "API 金鑰設定",
      llmPreferences: "LLM 偏好設定",
      chatSettings: "對話設定",
      help: "顯示快速鍵說明",
      showLLMSelector: "顯示工作區 LLM 選擇器",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "成功！",
        success_description: "您的系統提示詞已發布到社群中心！",
        success_thank_you: "感謝您分享到社群！",
        view_on_hub: "在社群中心查看",
        modal_title: "發布系統提示詞",
        name_label: "名稱",
        name_description: "這是系統提示詞的顯示名稱。",
        name_placeholder: "我的系統提示詞",
        description_label: "描述",
        description_description: "這是系統提示詞的描述，可用來說明用途。",
        tags_label: "標籤",
        tags_description:
          "標籤用來標示系統提示詞，方便搜尋。可新增多個標籤，最多 5 個，每個標籤最多 20 個字元。",
        tags_placeholder: "輸入並按 Enter 鍵添加標籤",
        visibility_label: "可見範圍",
        public_description: "公開的系統提示詞對所有人都可見。",
        private_description: "私人系統提示詞只有您看得到。",
        publish_button: "發布到社群中心",
        submitting: "發布中...",
        prompt_label: "提示詞",
        prompt_description: "這是實際會用來引導 LLM 的系統提示詞。",
        prompt_placeholder: "在此輸入系統提示詞...",
      },
      agent_flow: {
        success_title: "成功！",
        success_description: "您的代理流程已發布到社群中心！",
        success_thank_you: "感謝您分享到社群！",
        view_on_hub: "在社群中心查看",
        modal_title: "發布代理流程",
        name_label: "名稱",
        name_description: "這是代理流程的顯示名稱。",
        name_placeholder: "我的代理流程",
        description_label: "描述",
        description_description: "這是代理流程的描述，可用來說明用途。",
        tags_label: "標籤",
        tags_description:
          "標籤用來標示代理流程，方便搜尋。可新增多個標籤，最多 5 個，每個標籤最多 20 個字元。",
        tags_placeholder: "輸入並按 Enter 鍵添加標籤",
        visibility_label: "可見範圍",
        submitting: "發布中...",
        submit: "發布到社群中心",
        privacy_note:
          "代理流程一律會先以私人方式上傳，以保護敏感資料。發布後可再到社群中心調整可見範圍。發布前請先確認流程中不含任何敏感或私人資訊。",
      },
      generic: {
        unauthenticated: {
          title: "需要驗證",
          description: "發布項目前，需先完成 AnythingLLM 社群中心驗證。",
          button: "連接到社群中心",
        },
      },
      slash_command: {
        success_title: "成功！",
        success_description: "您的斜線指令已發布到社群中心！",
        success_thank_you: "感謝您分享到社群！",
        view_on_hub: "在社群中心查看",
        modal_title: "發布斜線指令",
        name_label: "名稱",
        name_description: "這是斜線指令的顯示名稱。",
        name_placeholder: "我的斜線指令",
        description_label: "描述",
        description_description: "這是斜線指令的描述，可用來說明用途。",
        tags_label: "標籤",
        tags_description:
          "標籤用來標示斜線指令，方便搜尋。可新增多個標籤，最多 5 個，每個標籤最多 20 個字元。",
        tags_placeholder: "輸入並按 Enter 鍵添加標籤",
        visibility_label: "可見範圍",
        public_description: "公開的斜線指令對所有人都可見。",
        private_description: "私人斜線指令只有您看得到。",
        publish_button: "發布到社群中心",
        submitting: "發布中...",
        prompt_label: "提示詞",
        prompt_description: "這是觸發斜線指令時會使用的提示詞。",
        prompt_placeholder: "在此輸入提示詞...",
      },
    },
  },
  security: {
    title: "安全性設定",
    multiuser: {
      title: "多使用者模式",
      description: "啟用多使用者模式，讓這套系統支援團隊使用。",
      enable: {
        "is-enable": "多使用者模式已啟用",
        enable: "啟用多使用者模式",
        description:
          "預設只有您具備管理員權限。身為管理員，您需要為所有新使用者或管理員建立帳號。請勿遺失密碼，因為只有管理員可以重設密碼。",
        username: "管理員帳號使用者名稱",
        password: "管理員帳號密碼",
      },
    },
    password: {
      title: "密碼保護",
      description:
        "使用密碼保護 AnythingLLM 系統。若忘記此密碼，將無法復原，請務必妥善保存。",
      "password-label": "系統密碼",
    },
  },
  home: {
    welcome: "歡迎",
    chooseWorkspace: "選擇一個工作區開始對話！",
    notAssigned:
      "您目前尚未被分配到任何工作區。\n請聯絡您的管理員以申請工作區的存取權限。",
    goToWorkspace: '前往 "{{workspace}}"',
  },
  telegram: {
    title: "Telegram 機器人",
    description:
      "將您的 AnythingLLM 實例連接到 Telegram，以便您可以在任何裝置上與您的工作空間進行對話。",
    setup: {
      step1: {
        title: "第一步：建立您的 Telegram 機器人",
        description:
          '在 Telegram 中開啟 @BotFather，將 "<code>/newbot" 訊息發送至 <code>@BotFather</code>，按照指示操作，並複製 API 令牌。',
        "open-botfather": "開啟 BotFather",
        "instruction-1": "1. 點擊連結或掃描 QR 碼",
        "instruction-2":
          "2. 將 <code>/newbot</code> 傳送至 <code>@BotFather</code>",
        "instruction-3": "3. 為您的機器人選擇一個名稱和使用者名稱。",
        "instruction-4": "4. 複製您收到的 API 令牌",
      },
      step2: {
        title: "步驟 2：連接您的機器人",
        description:
          "請將您從 @BotFather 處獲得的 API 令牌複製並貼上，然後選擇一個預設的工作空間，讓您的機器人與其對話。",
        "bot-token": "機器人代幣",
        "default-workspace": "預設工作空間",
        "no-workspace": "目前沒有可用的工作空間。將會創建一個新的工作空間。",
        connecting: "正在連接...",
        "connect-bot": "連線機器人",
      },
      security: {
        title: "建議的安全設定",
        description: "為了額外保障，請在 @BotFather 中設定這些選項。",
        "disable-groups": "— 阻止自動程式加入群組",
        "disable-inline": "— 阻止機器人被用於內嵌式搜尋",
        "obscure-username":
          "使用一個不顯眼的機器人帳號名稱，以降低被發現的機會。",
      },
      "toast-enter-token": "請輸入機器人憑證。",
      "toast-connect-failed": "無法連接機器人。",
    },
    connected: {
      status: "連接",
      "status-disconnected": "無法連接 — 可能是 token 已經過期或無效",
      "placeholder-token": "黏貼新的機器人代碼...",
      reconnect: "重新建立聯繫",
      workspace: "工作空間",
      "bot-link": "機器人連結",
      "voice-response": "語音回應",
      disconnecting: "斷線...",
      disconnect: "斷開連接",
      "voice-text-only": "僅提供文字",
      "voice-mirror": "語音回覆 (使用者發送語音時，系統會回覆語音)",
      "voice-always": "請務必在回覆中加入語音 (發送音訊)。",
      "toast-disconnect-failed": "未能成功斷開機器人。",
      "toast-reconnect-failed": "無法重新連線機器人。",
      "toast-voice-failed": "無法更新語音模式。",
      "toast-approve-failed": "無法驗證使用者。",
      "toast-deny-failed": "未能阻止使用者。",
      "toast-revoke-failed": "未能取消使用者權限。",
    },
    users: {
      "pending-title": "待審核",
      "pending-description":
        "等待驗證的使用者。請將這裡顯示的配對碼與他們在 Telegram 聊天中顯示的配對碼對齊。",
      "approved-title": "已授權的使用者",
      "approved-description": "已獲得批准，可以與您的機器人進行對話的使用者。",
      user: "使用者",
      "pairing-code": "編碼組合",
      "no-pending": "目前沒有待處理的請求",
      "no-approved": "目前沒有已授權的使用者",
      unknown: "未知的",
      approve: "批准",
      deny: "拒絕",
      revoke: "撤銷",
    },
  },
};

export default TRANSLATIONS;
