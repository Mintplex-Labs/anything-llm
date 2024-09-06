const TRANSLATIONS = {
  common: {
    "workspaces-name": "워크스페이스 이름",
    error: "오류",
    success: "성공",
    user: "사용자",
    selection: "모델 선택",
    saving: "저장 중...",
    save: "저장",
    previous: "이전",
    next: "다음",
  },

  // Setting Sidebar menu items.
  settings: {
    title: "인스턴스 설정",
    system: "일반 설정",
    invites: "초대",
    users: "사용자",
    workspaces: "워크스페이스",
    "workspace-chats": "워크스페이스 채팅",
    customization: "사용자 정의",
    "api-keys": "개발자 API",
    llm: "LLM",
    transcription: "텍스트 변환",
    embedder: "임베더",
    "text-splitting": "텍스트 분할과 청킹",
    "voice-speech": "음성과 말하기",
    "vector-database": "벡터 데이터베이스",
    embeds: "채팅 임베드",
    "embed-chats": "채팅 임베드 기록",
    security: "보안",
    "event-logs": "이벤트 로그",
    privacy: "사생활 보호와 데이터",
    "ai-providers": "AI 제공자",
    "agent-skills": "에이전트 스킬",
    admin: "관리자",
    tools: "도구",
    "experimental-features": "실험적 기능",
    contact: "지원팀 연락",
  },

  // Page Definitions
  login: {
    "multi-user": {
      welcome: "웰컴!",
      "placeholder-username": "사용자 이름",
      "placeholder-password": "비밀번호",
      login: "로그인",
      validating: "유효성 검사 중...",
      "forgot-pass": "비밀번호를 잊으셨나요",
      reset: "재설정",
    },
    "sign-in": {
      start: "사용자 계정으로 ",
      end: "에 로그인하세요.",
    },
    "password-reset": {
      title: "비밀번호 재설정",
      description: "비밀번호를 재설정하려면 아래에 필요한 정보를 입력하세요.",
      "recovery-codes": "복구 코드",
      "recovery-code": "복구 코드 {{index}}",
      "back-to-login": "로그인으로 돌아가기",
    },
  },

  "new-workspace": {
    title: "새 워크스페이스",
    placeholder: "내 워크스페이스",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "일반 설정",
    chat: "채팅 설정",
    vector: "벡터 데이터베이스",
    members: "구성원",
    agent: "에이전트 구성",
  },

  welcomeMessage: {
    part1:
      "AnythingLLM에 오신 것을 환영합니다. AnythingLLM은 Mintplex Labs에서 개발한 오픈 소스 AI 도구로, 어떤 것이든 훈련된 챗봇으로 변환하여 쿼리하고 대화할 수 있습니다. AnythingLLM은 BYOK(Bring Your Own Key) 소프트웨어이므로 사용하려는 서비스 외에는 구독료나 기타 비용이 없습니다.",
    part2:
      "AnythingLLM은 OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB 등 강력한 AI 제품을 번거로움 없이 깔끔하게 패키지로 묶어 생산성을 100배 향상시키는 가장 쉬운 방법입니다.",
    part3:
      "AnythingLLM은 로컬 컴퓨터에서 완전히 작동하며, 거의 리소스를 사용하지 않으므로 존재조차 느끼지 못할 것입니다! GPU가 필요하지 않습니다. 클라우드 및 온프레미스 설치도 가능합니다.\nAI 도구 생태계는 날로 강력해지고 있습니다. AnythingLLM은 이를 쉽게 사용할 수 있게 해줍니다.",
    githubIssue: "Github에 이슈 생성하기",
    user1: "어떻게 시작하나요?!",
    part4:
      '간단합니다. 모든 컬렉션은 "워크스페이스"라고 부르는 버킷으로 구성됩니다. 워크스페이스는 문서, 이미지, PDF 및 기타 파일의 버킷으로, LLM이 이해하고 대화에서 사용할 수 있는 형태로 변환합니다.\n\n언제든지 파일을 추가하고 삭제할 수 있습니다.',
    createWorkspace: "첫 번째 워크스페이스 생성하기",
    user2:
      "이것은 AI 드롭박스와 같은 건가요? 채팅은 어떤가요? 이건 챗봇 아닌가요?",
    part5:
      "AnythingLLM은 더 스마트한 Dropbox 이상의 것입니다.\n\nAnythingLLM은 데이터와 대화할 수 있는 두 가지 방법을 제공합니다:\n\n<i>쿼리:</i> 워크스페이스 내 문서에서 찾아낸 데이터나 추론 결과만 채팅으로 제공합니다. 워크스페이스에 문서를 더 많이 추가할수록 더 똑똑해집니다!\n\n<i>대화:</i> 문서와 실시간 채팅 기록이 동시에 LLM의 지식에 기여합니다. 실시간 텍스트 정보나 LLM의 오해를 바로잡는 데 매우 유용합니다.\n\n채팅 중간에 <i>모드를 전환할 수 있습니다!</i>",
    user3: "와, 이거 정말 놀랍네요, 당장 사용해보고 싶어요!",
    part6: "즐기세요!",
    starOnGithub: "GitHub에 별표 달기",
    contact: "Mintplex Labs에 연락하기",
  },

  // General Appearance
  general: {
    vector: {
      title: "벡터 수",
      description: "벡터 데이터베이스에 있는 총 벡터 수입니다.",
    },
    names: {
      description: "이것은 워크스페이스의 표시 이름만 변경합니다.",
    },
    message: {
      title: "제안된 채팅 메시지",
      description: "워크스페이스 사용자가 사용할 메시지를 수정합니다.",
      add: "새 메시지 추가",
      save: "메시지 저장",
      heading: "저에게 설명해주세요",
      body: "AnythingLLM의 장점",
    },
    pfp: {
      title: "어시스턴트 프로필 이미지",
      description: "이 워크스페이스의 어시스턴트 프로필 이미지를 수정합니다.",
      image: "워크스페이스 이미지",
      remove: "워크스페이스 이미지 제거",
    },
    delete: {
      title: "워크스페이스 삭제",
      description:
        "이 워크스페이스와 모든 데이터를 삭제합니다. 이 작업은 모든 사용자에 대해 워크스페이스를 삭제합니다.",
      delete: "워크스페이스 삭제",
      deleting: "워크스페이스 삭제 중...",
      "confirm-start": "이 작업은",
      "confirm-end":
        "워크스페이스 전체를 삭제합니다. 이 작업은 벡터 데이터베이스에 있는 모든 벡터 임베딩을 제거합니다.\n\n원본 소스 파일은 그대로 유지됩니다. 이 작업은 되돌릴 수 없습니다.",
    },
  },

  // Chat Settings
  chat: {
    llm: {
      title: "워크스페이스 LLM 제공자",
      description:
        "이 워크스페이스에서 사용할 특정 LLM 제공자와 모델입니다. 기본적으로 시스템 LLM 제공자와 설정을 사용합니다.",
      search: "모든 LLM 제공자 검색",
    },
    model: {
      title: "워크스페이스 채팅 모델",
      description:
        "이 워크스페이스에서 사용할 특정 채팅 모델입니다. 비어 있으면 시스템 LLM 기본 설정을 사용합니다.",
      wait: "-- 모델 기다리는 중 --",
    },
    mode: {
      title: "채팅 모드",
      chat: {
        title: "채팅",
        "desc-start": "문서 내용을 찾습니다.",
        and: "그리고",
        "desc-end": "LLM의 일반 지식을 같이 사용하여 답변을 제공합니다",
      },
      query: {
        title: "쿼리",
        "desc-start": "문서 컨텍스트를 찾을 ",
        only: "때만",
        "desc-end": "답변을 제공합니다.",
      },
    },
    history: {
      title: "채팅 기록",
      "desc-start": "응답의 단기 메모리에 포함될 이전 채팅의 수입니다.",
      recommend: "추천 20개 ",
      "desc-end":
        " 45개 이상은 메시지 크기에 따라 채팅 실패가 발생할 수 있습니다.",
    },
    prompt: {
      title: "프롬프트",
      description:
        "이 워크스페이스에서 사용할 프롬프트입니다. AI가 응답을 생성하기 위해 문맥과 지침을 정의합니다. AI가 질문에 대하여 정확한 응답을 생성할 수 있도록 신중하게 프롬프트를 제공해야 합니다.",
    },
    refusal: {
      title: "쿼리 모드 거부 응답 메시지",
      "desc-start": "쿼리 모드에서",
      query: "응답에 사용할 수 있는",
      "desc-end": "컨텍스트를 찾을 수 없을 때 거부 응답 내용을 작성합니다.",
    },
    temperature: {
      title: "LLM 온도",
      "desc-start": '이 설정은 LLM 응답이 얼마나 "창의적"일지를 제어합니다.',
      "desc-end":
        "숫자가 높을수록 창의적입니다. 일부 모델에서는 너무 높게 설정하면 일관성 없는 응답이 나올 수 있습니다.",
      hint: "대부분의 LLM은 유효한 값의 다양한 허용 범위를 가지고 있습니다. 해당 정보는 LLM 제공자에게 문의하세요.",
    },
  },

  // Vector Database
  "vector-workspace": {
    identifier: "벡터 데이터베이스 식별자",
    snippets: {
      title: "최대 문맥 조각",
      description:
        "이 설정은 채팅 또는 쿼리당 LLM에 전송될 최대 문맥 조각 수를 제어합니다.",
      recommend: "추천: 4",
    },
    doc: {
      title: "문서 유사성 임계값",
      description:
        "채팅과 관련이 있다고 판단되는 문서의 유사성 점수입니다. 숫자가 높을수록 질문에 대한 문서의 내용이 유사합니다.",
      zero: "제한 없음",
      low: "낮음 (유사성 점수 ≥ .25)",
      medium: "중간 (유사성 점수 ≥ .50)",
      high: "높음 (유사성 점수 ≥ .75)",
    },
    reset: {
      reset: "벡터 데이터베이스 재설정",
      resetting: "벡터 지우는 중...",
      confirm:
        "이 워크스페이스의 벡터 데이터베이스를 재설정하려고 합니다. 현재 임베딩된 모든 벡터 임베딩을 제거합니다.\n\n원본 소스 파일은 그대로 유지됩니다. 이 작업은 되돌릴 수 없습니다.",
      error: "워크스페이스 벡터 데이터베이스를 재설정할 수 없습니다!",
      success: "워크스페이스 벡터 데이터베이스가 재설정되었습니다!",
    },
  },

  // Agent Configuration
  agent: {
    "performance-warning":
      "도구 호출을 명시적으로 지원하지 않는 LLM의 성능은 모델의 기능과 정확도에 크게 좌우됩니다. 일부 기능은 제한되거나 작동하지 않을 수 있습니다.",
    provider: {
      title: "워크스페이스 에이전트 LLM 제공자",
      description:
        "이 워크스페이스의 @agent 에이전트에 사용할 특정 LLM 제공자 및 모델입니다.",
    },
    mode: {
      chat: {
        title: "워크스페이스 에이전트 채팅 모델",
        description:
          "이 워크스페이스의 @agent 에이전트에 사용할 특정 채팅 모델입니다.",
      },
      title: "워크스페이스 에이전트 모델",
      description:
        "이 워크스페이스의 @agent 에이전트에 사용할 특정 LLM 모델입니다.",
      wait: "-- 모델 기다리는 중 --",
    },

    skill: {
      title: "기본 에이전트 스킬",
      description:
        "기본 에이전트의 능력을 사전 정의된 스킬을 사용하여 향상시킵니다. 이 설정은 모든 워크스페이스에 적용됩니다.",
      rag: {
        title: "RAG와 장기 메모리",
        description:
          '에이전트가 제공된 문서를 활용하여 쿼리에 답변하거나 에이전트에게 "기억"할 내용을 요청하여 장기 메모리 검색을 허용합니다.',
      },
      view: {
        title: "문서 보기 및 요약",
        description:
          "에이전트가 현재 임베딩된 워크스페이스의 문서 내용을 나열하고 요약할 수 있도록 합니다.",
      },
      scrape: {
        title: "웹사이트 스크래핑",
        description:
          "에이전트가 웹사이트를 방문하고 내용을 스크래핑할 수 있도록 합니다.",
      },
      generate: {
        title: "차트 생성",
        description:
          "기본 에이전트가 채팅에서 제공된 데이터를 이용하여 다양한 유형의 차트를 생성할 수 있도록 합니다.",
      },
      save: {
        title: "브라우저에서 파일 생성과 저장",
        description:
          "기본 에이전트가 브라우저에서 파일을 생성하고 다운로드할 수 있도록 합니다.",
      },
      web: {
        title: "실시간 웹 검색 및 탐색",
        "desc-start":
          "에이전트가 웹을 검색하여 질문에 답변할 수 있도록 허용합니다.",
        "desc-end":
          "에이전트 세션 중 웹 검색은 설정되지 않으면 작동하지 않습니다.",
      },
    },
  },

  // Workspace Chats
  recorded: {
    recorded: {
      title: "워크스페이스 채팅",
      description:
        "이것들은 사용자들이 보낸 모든 채팅과 메시지입니다. 생성 날짜별로 정렬되어 있습니다.",
      export: "내보내기",
      exportSuccess: "{{name}} 형식으로 채팅이 성공적으로 내보내졌습니다.",
      exportError: "채팅 내보내기에 실패했습니다.",
      clearChats: "채팅 삭제",
      confirmClear:
        "모든 채팅을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.",
      clearSuccess: "모든 채팅이 삭제되었습니다.",
      table: {
        id: "ID",
        by: "보낸 사람",
        workspace: "워크스페이스",
        prompt: "프롬프트",
        response: "응답",
        at: "보낸 시각",
      },
      previous: "이전 페이지",
      next: "다음 페이지",
    },
  },

  // Appearance
  appearance: {
    title: "외관",
    description: "플랫폼의 외관 설정을 수정합니다.",
    logo: {
      title: "사용자 로고",
      description:
        "사용자의 로고를 업로드하여 챗봇을 자신의 것으로 만드십시오.",
      add: "사용자 로고 추가",
      recommended: "추천 크기: 800 x 200",
      remove: "제거",
      replace: "교체",
    },
    message: {
      title: "사용자 메시지",
      description: "사용자에게 표시되는 자동 메시지를 작성합니다.",
      new: "새로운",
      system: "시스템",
      user: "사용자",
      message: "메시지",
      assistant: "AnythingLLM 채팅 어시스턴트",
      "double-click": "더블 클릭하여 편집...",
      save: "메시지 저장",
    },
    icons: {
      title: "맞춤형 바닥글 아이콘",
      description: "사이드바 하단에 표시되는 아이콘을 수정합니다.",
      icon: "아이콘",
      link: "링크",
    },
  },

  // API Keys
  api: {
    title: "API 키",
    description:
      "API 키는 소유자가 프로그래밍 방식으로 이 AnythingLLM 인스턴스에 액세스하고 관리할 수 있도록 합니다.",
    link: "API 문서 읽기",
    generate: "새 API 키 생성",
    table: {
      key: "API 키",
      by: "생성한 사람",
      created: "생성일",
    },
  },

  llm: {
    title: "LLM 기본 설정",
    description:
      "선호하는 LLM 채팅과 임베딩 제공자에 대한 인증 키 설정입니다. 이 키가 현재 활성 상태이고 정확해야 AnythingLLM이 제대로 작동합니다.",
    provider: "LLM 제공자",
    searchPlaceholder: "사용 가능한 LLM 제공자 검색",
    noneSelected: "선택되지 않음",
    selectLLM: "LLM을 선택해야 합니다",
    saving: "저장 중...",
    saveChanges: "변경 사항 저장",
    saveSuccess: "LLM 선호도가 성공적으로 저장되었습니다.",
    saveError: "LLM 설정을 저장하지 못했습니다: {{error}}",
    providers: {
      defaultName: "시스템 기본값",
      defaultDescription:
        "이 워크스페이스에 시스템 기본 설정 LLM을 사용합니다.",
      apiKeyLabel: "{{provider}} API 키",
      apiKeyPlaceholder: "{{provider}} API 키",
      modelLabel: "채팅 모델 선택",
      openai: "가장 인기있는 LLM 표준 옵션입니다.",
      azure: "Azure 서비스에서 호스팅되는 OpenAI의 엔터프라이즈 옵션입니다.",
      anthropic: "Anthropic에서 호스팅하는 친숙한 AI 어시스턴트입니다.",
      gemini: "Google의 가장 크고 능력 있는 AI 모델입니다.",
      huggingface:
        "150,000개 이상의 오픈 소스 LLM과 전세계 AI 커뮤니티에 접근하십시오.",
      ollama: "자신의 머신에서 LLM을 로컬로 실행합니다.",
      lmstudio:
        "몇 번의 클릭만으로 수천 개의 최첨단 LLM을 발견, 다운로드하고 실행합니다.",
      localai: "자신의 머신에서 LLM을 로컬로 실행합니다.",
      togetherai: "Together AI의 오픈 소스 모델을 실행합니다.",
      mistral: "Mistral AI의 오픈 소스 모델을 실행합니다.",
      perplexity:
        "Perplexity AI에서 호스팅하는 강력하고 인터넷에 연결된 모델을 실행합니다.",
      openrouter: "LLM을 위한 통합 인터페이스입니다.",
      groq: "실시간 AI 응용 프로그램을 위한 가장 빠른 LLM 추론을 제공합니다.",
      koboldcpp: "koboldcpp를 사용하여 로컬 LLM을 실행합니다.",
      textgenwebui:
        "Oobabooga의 텍스트 생성 웹 UI를 사용하여 로컬 LLM을 실행합니다.",
      cohere: "Cohere의 강력한 Command 모델을 실행합니다.",
      litellm: "여러 LLM을 위한 LiteLLM의 OpenAI 호환 프록시를 실행합니다.",
      genericopenai: "맞춤 구성을 통해 OpenAi 호환 서비스를 연결합니다.",
      native:
        "TeamplGPT 인스턴스에서 채팅하기 위해 다운로드한 맞춤형 Llama 모델을 사용합니다.",
      safetyLabel: "안전 설정",
      safety: {
        none: "없음",
        blockFew: "조금 차단",
        blockSome: "일부 차단 (기본값)",
        blockMost: "대부분 차단",
      },
      baseUrl: "기본 URL",
      tokenContextWindow: "토큰 컨텍스트 창",
      loadingModels: "-- 사용 가능한 모델 로드 중 --",
      waitingForUrl: "-- URL 대기 중 --",
      waitingForAPI: "-- API 대기 중 --",
      apiKey: "API 키",
      loadedModels: "로드된 모델",
    },
  },

  azure: {
    serviceEndpoint: "Azure 서비스 엔드포인트",
    chatDeploymentName: "채팅 배포 이름",
    chatDeploymentNamePlaceholder: "Azure OpenAI 채팅 모델 배포 이름",
    chatModelTokenLimit: "채팅 모델 토큰 제한",
    embeddingDeploymentName: "임베딩 배포 이름",
    embeddingDeploymentNamePlaceholder: "Azure OpenAI 임베딩 모델 배포 이름",
  },

  huggingface: {
    inferenceEndpoint: "HuggingFace 추론 엔드포인트",
    accessToken: "HuggingFace 액세스 토큰",
    accessTokenPlaceholder: "HuggingFace 액세스 토큰",
    tokenLimit: "모델 토큰 제한",
  },

  genericOpenAi: {
    baseUrl: "기본 URL",
    chatModelName: "채팅 모델 이름",
    chatModelNamePlaceholder: "채팅 요청에 사용되는 모델 ID",
    tokenContextWindow: "토큰 컨텍스트 윈도우",
    tokenContextWindowPlaceholder: "컨텍스트 윈도우 제한 (예: 4096)",
    maxTokens: "최대 토큰 수",
    maxTokensPlaceholder: "요청당 최대 토큰 수 (예: 1024)",
  },

  ollama: {
    maxTokens: "최대 토큰 수",
    maxTokensDescription: "컨텍스트 및 응답의 최대 토큰 수.",
    hideManualInput: "수동 엔드포인트 입력 숨기기",
    showManualInput: "수동 엔드포인트 입력 표시",
    baseUrl: "Ollama 기본 URL",
    baseUrlDescription: "Ollama가 실행 중인 URL을 입력하세요.",
    autoDetect: "자동 감지",
    enterUrlFirst: "먼저 Ollama URL을 입력하세요",
    model: "Ollama 모델",
    modelDescription:
      "사용하려는 Ollama 모델을 선택하세요. 유효한 Ollama URL을 입력한 후 모델이 로드됩니다.",
    maxChunkLength: "최대 임베딩 청크 길이",
    maxChunkLengthDescription: "임베딩을 위한 텍스트 청크의 최대 길이.",
  },

  lmstudio: {
    alertMessage:
      "LMStudio를 LLM으로 사용하려면 임베딩 서비스를 설정해야 합니다.",
    manageEmbedding: "임베딩 관리 →",
    maxTokens: "최대 토큰 수",
    maxTokensDescription: "컨텍스트 및 응답의 최대 토큰 수.",
    hideManualInput: "수동 엔드포인트 입력 숨기기",
    showManualInput: "수동 엔드포인트 입력 표시",
    baseUrl: "LM Studio 기본 URL",
    baseUrlDescription: "LM Studio가 실행 중인 URL을 입력하세요.",
    autoDetect: "자동 감지",
    enterUrlFirst: "먼저 LM Studio URL을 입력하세요",
    model: "LM Studio 모델",
    modelDescription:
      "사용하려는 LM Studio 모델을 선택하세요. 유효한 LM Studio URL을 입력한 후 모델이 로드됩니다.",
    maxChunkLength: "최대 임베딩 청크 길이",
    maxChunkLengthDescription: "임베딩을 위한 텍스트 청크의 최대 길이.",
  },

  localai: {
    alertMessage:
      "LocalAI를 LLM으로 사용하려면 임베딩 서비스를 설정해야 합니다.",
    manageEmbedding: "임베딩 관리 →",
    baseUrl: "Local AI 기본 URL",
    tokenContextWindow: "토큰 컨텍스트 윈도우",
    apiKey: "Local AI API 키",
    modelSelection: "채팅 모델 선택",
    optional: "선택 사항",
  },

  textgenwebui: {
    baseUrl: "기본 URL",
    tokenContextWindow: "토큰 컨텍스트 윈도우",
    tokenContextWindowPlaceholder: "컨텍스트 윈도우 제한 (예: 4096)",
    apiKeyOptional: "API 키 (선택 사항)",
  },

  nativellm: {
    experimentalWarning:
      "로컬에서 호스팅되는 LLM 사용은 실험적입니다. 주의해서 사용하세요.",
    modelSelection: "모델 선택",
    waitingForModels: "-- 모델을 기다리는 중 --",
    tokenContextWindow: "토큰 컨텍스트 윈도우",
  },

  transcription: {
    title: "텍스트 변환 모델 기본 설정",
    description:
      "선호하는 텍스트 변환 모델 제공자의 인증입니다. 이 키가 현재 활성 상태이고 정확해야 미디어 파일 및 오디오가 텍스트 변환됩니다.",
    provider: "텍스트 변환 제공자",
    "warn-start":
      "RAM 또는 CPU 성능이 제한된 머신에서 로컬 위스퍼 모델을 사용하면 미디어 파일을 처리할 때 AnythingLLM이 중단될 수 있습니다.",
    "warn-recommend": "최소 2GB RAM과 10Mb 보다 작은 파일 업로드를 권장합니다.",
    "warn-end": "내장된 모델은 첫 번째 사용 시 자동으로 다운로드됩니다.",
    searchPlaceholder: "텍스트 변환 제공자를 검색하십시오",
    error: "환경 설정 저장 실패: {{error}}",
    success: "텍스트 변환 기본 설정이 성공적으로 저장되었습니다.",
    saving: "저장 중...",
    saveChanges: "변경 사항 저장",
    providers: {
      openai: "API 키를 사용하여 OpenAI Whisper-large 모델을 활용합니다.",
      local: "이 인스턴스에서 로컬로 위스퍼 모델을 실행합니다.",
    },
  },

  embedding: {
    title: "임베딩 기본 설정",
    "desc-start":
      "임베딩 엔진을 지원하지 않는 LLM을 사용할 때 다른 임베딩 엔진 제공자의 인증이 필요할 수 있습니다.",
    "desc-end":
      "임베딩은 텍스트를 벡터로 변환하는 과정입니다. 이 인증은 파일과 프롬프트를 AnythingLLM이 처리할 수 있는 형식으로 변환하기 위해 필요합니다.",
    provider: {
      title: "임베딩 제공자",
      description:
        "AnythingLLM의 기본 임베딩 엔진을 사용할 때는 설정이 필요하지 않습니다.",
    },
    error: "임베딩 설정을 저장하지 못했습니다: {{error}}",
    success: "임베딩 기본 설정이 성공적으로 저장되었습니다.",
    searchPlaceholder: "모든 임베딩 제공자를 검색하십시오",
    modalWarning:
      "임베딩 모델을 변경하면 채팅에서 이전에 임베딩된 문서가 작동하지 않게 됩니다. 모든 작업 공간에서 문서를 임베딩 해제하고 완전히 제거한 후 새 임베딩 모델로 다시 업로드해야 합니다.",
    providers: {
      native:
        "AnythingLLM을 위한 기본 임베딩 제공자를 사용합니다. 설정이 필요하지 않습니다.",
      openai: "비상업적 사용에 적합한 표준 옵션입니다.",
      azure: "Azure 서비스에서 호스팅되는 OpenAI의 엔터프라이즈 옵션입니다.",
      localai: "자신의 머신에서 임베딩 모델을 로컬로 실행합니다.",
      ollama: "자신의 머신에서 임베딩 모델을 로컬로 실행합니다.",
      lmstudio:
        "수천 개의 최신 LLM을 몇 번의 클릭만으로 발견, 다운로드, 실행하십시오.",
      cohere: "Cohere에서 강력한 임베딩 모델을 실행합니다.",
      voyageai: "Voyage AI에서 강력한 임베딩 모델을 실행합니다.",
      litellm: "LiteLLM에서 강력한 임베딩 모델을 실행합니다.",
      "generic-openai":
        "모든 OpenAI 호환 API 서비스에서 임베딩 모델을 실행합니다.",
    },
  },

  text: {
    title: "텍스트 분할 및 청킹 기본 설정",
    "desc-start":
      "새 문서를 벡터 데이터베이스에 삽입하기 전에 기본 텍스트 분할 방식을 변경할 수 있습니다.",
    "desc-end":
      "텍스트 분할 방식과 그 영향을 이해하고 있는 경우에만 이 설정을 변경해야 합니다.",
    "warn-start": "여기의 변경 사항은",
    "warn-center": "새로 임베딩되는 문서",
    "warn-end": "에만 적용됩니다. 기존 문서에는 적용되지 않습니다.",
    size: {
      title: "텍스트 청크 크기",
      description: "단일 벡터에 들어갈 수 있는 최대 문자 길이입니다.",
      recommend: "임베드 모델 최대 길이는",
    },

    overlap: {
      title: "텍스트 청크 겹침",
      description:
        "청킹 동안 두 인접 텍스트 청크 간에 겹칠 수 있는 최대 문자 수입니다.",
    },
  },

  // Vector Database
  vector: {
    title: "벡터 데이터베이스",
    description:
      "이것은 AnythingLLM 인스턴스가 벡터 데이터베이스 사용을 위한 인증 설정입니다. 이 키가 활성 상태이고 정확해야 합니다.",
    provider: {
      title: "벡터 데이터베이스 제공자",
      description: "LanceDB를 선택하면 설정이 필요 없습니다.",
      searchPlaceholder: "모든 벡터 데이터베이스 제공자 검색",
    },
    providers: {
      lancedb:
        "AnythingLLM과 동일한 인스턴스에서 실행되는 100% 로컬 벡터 DB입니다.",
      chroma:
        "오픈 소스 벡터 데이터베이스로 직접 호스팅하거나 클라우드에서 사용할 수 있습니다.",
      pinecone:
        "기업 사용 사례에 적합한 100% 클라우드 기반 벡터 데이터베이스입니다.",
      zilliz:
        "SOC 2 준수를 갖춘 엔터프라이즈용 클라우드 호스팅 벡터 데이터베이스입니다.",
      qdrant: "로컬 및 분산 클라우드용 오픈 소스 벡터 데이터베이스입니다.",
      weaviate:
        "로컬 및 클라우드에서 호스팅되는 멀티모달 오픈 소스 벡터 데이터베이스입니다.",
      milvus:
        "오픈 소스, 고도로 확장 가능하며 매우 빠른 벡터 데이터베이스입니다.",
      astra: "실제 GenAI 응용 프로그램을 위한 벡터 검색을 제공합니다.",
    },
    changeWarning:
      "벡터 데이터베이스를 변경하면 이전에 임베딩된 문서와 향후 유사성 검색 결과가 무시됩니다. 각 워크스페이스에 다시 추가해야 합니다.",
  },

  //common
  common: {
    save: "저장",
    saving: "저장 중...",
  },

  //stt
  stt: {
    title: "음성-텍스트 변환 기본 설정",
    description:
      "여기에서 AnythingLLM 경험에 사용할 텍스트 변환 및 음성-텍스트 변환 제공자를 지정할 수 있습니다. 기본적으로 브라우저의 내장 서비스를 사용하지만 다른 서비스를 사용할 수도 있습니다.",
    provider: "제공자",
    searchPlaceholder: "음성-텍스트 변환 제공자를 검색하십시오",
    error: "환경 설정을 저장하지 못했습니다: {{error}}",
    success: "음성-텍스트 변환 기본 설정이 성공적으로 저장되었습니다.",
    providers: {
      native: "브라우저의 내장 STT 서비스를 지원하는 경우 사용합니다.",
    },
  },

  // Embeddable Chat Widgets
  embeddable: {
    title: "임베드 가능한 채팅 위젯",
    description:
      "임베드 가능한 채팅 위젯은 하나의 워크스페이스에 연결된 공개용 채팅방입니다. 이를 통해 워크스페이스 설정이 적용된 채팅방을 일반인들에게 공개할 수 있습니다.",
    create: "임베드 생성",
    table: {
      workspace: "워크스페이스",
      chats: "보낸 채팅",
      Active: "활성 도메인",
    },
  },

  "embed-chats": {
    title: "임베드 채팅",
    description: "게시한 임베드에서의 모든 채팅과 메시지의 기록입니다.",
    table: {
      embed: "임베드",
      sender: "보낸 사람",
      message: "메시지",
      response: "응답",
      at: "보낸 시각",
    },
  },

  multi: {
    title: "다중 사용자 모드",
    description:
      "다중 사용자 모드를 활성화하여 인스턴스가 팀 사용을 지원하도록 설정합니다.",
    enable: {
      "is-enable": "다중 사용자 모드가 활성화되었습니다",
      enable: "다중 사용자 모드 활성화",
      description:
        "당신은 기본 관리자가 됩니다. 관리자로서 모든 신규 사용자 또는 관리자의 계정을 생성해야 합니다. 비밀번호를 잃어버리면 관리자만 비밀번호를 재설정할 수 있습니다.",
      username: "관리자 계정 사용자 이름",
      password: "관리자 계정 비밀번호",
    },
    password: {
      title: "비밀번호 보호",
      description:
        "AnythingLLM 인스턴스를 비밀번호로 보호하십시오. 이 비밀번호를 잊어버리면 복구 방법이 없으므로 반드시 저장하세요.",
    },
    instance: {
      title: "인스턴스 비밀번호 보호",
      description:
        "당신은 기본 관리자가 됩니다. 관리자로서 모든 신규 사용자 또는 관리자의 계정을 생성해야 합니다. 비밀번호를 잃어버리면 관리자만 비밀번호를 재설정할 수 있습니다.",
      password: "인스턴스 비밀번호",
    },
  },

  // Event Logs
  event: {
    title: "이벤트 로그",
    description:
      "모니터링을 위해 이 인스턴스에서 발생하는 모든 작업과 이벤트를 확인합니다.",
    clear: "이벤트 로그 지우기",
    table: {
      type: "이벤트 유형",
      user: "사용자",
      occurred: "발생 시각",
    },
  },

  // Privacy & Data-Handling
  privacy: {
    title: "개인정보와 데이터 처리",
    description:
      "연결된 타사 제공자와 AnythingLLM이 데이터를 처리하는 방식을 구성합니다.",
    llm: "LLM 선택",
    embedding: "임베딩 기본 설정",
    vector: "벡터 데이터베이스",
    anonymous: "익명 원격 분석 활성화",
    info1:
      "모든 이벤트는 IP 주소를 기록하지 않으며 <b>식별 가능한</b> 콘텐츠, 설정, 채팅 또는 기타 비사용 기반 정보를 포함하지 않습니다. 수집된 이벤트 태그 목록을 보려면 <a href='https://github.com/search?q=repo%3AMintplex-Labs%2Fanything-llm%20.sendTelemetry(&type=code' target='_blank' class='underline text-blue-400'>여기에서 Github</a>를 확인하세요.",
    info2:
      "오픈 소스 프로젝트로서 우리는 귀하의 개인정보 보호 권리를 존중합니다. 우리는 AI와 문서를 비공개 및 안전하게 통합할 수 있는 최고의 솔루션을 제공하는 데 전념하고 있습니다. 텔레메트리를 끄기로 결정하셨다면, 저희에게 피드백과 의견을 보내주시길 바랍니다. <a href='mailto:team@mintplexlabs.com' class='underline text-blue-400' target='_blank'>team@mintplexlabs.com</a>.",
    enabledMessage: "익명 원격 분석이 활성화되었습니다.",
    disabledMessage: "익명 원격 분석이 비활성화되었습니다.",
  },

  //Data Handling & Privacy
  handlingPrivacy: {
    title: "데이터 처리 및 개인정보 보호",
    description:
      "귀하의 개인 데이터에 대해 투명성과 통제권을 제공하는 데 전념하고 있습니다.",
    setting: "이 설정은 언제든지 설정에서 재구성할 수 있습니다.",
    llmSelectionPrivacy: {
      openai: {
        name: "OpenAI",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 OpenAI에 표시됩니다.",
        ],
      },
      azure: {
        name: "Azure OpenAI",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "귀하의 텍스트 및 임베딩 텍스트는 OpenAI 또는 Microsoft에 표시되지 않습니다.",
        ],
      },
      anthropic: {
        name: "Anthropic",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 Anthropic에 표시됩니다.",
        ],
      },
      gemini: {
        name: "Google Gemini",
        description: [
          "귀하의 채팅은 익명화되어 훈련에 사용됩니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 Google에 표시됩니다.",
        ],
      },
      lmstudio: {
        name: "LMStudio",
        description: [
          "모델과 채팅은 LMStudio를 실행하는 서버에서만 액세스할 수 있습니다.",
        ],
      },
      localai: {
        name: "LocalAI",
        description: [
          "모델과 채팅은 LocalAI를 실행하는 서버에서만 액세스할 수 있습니다.",
        ],
      },
      ollama: {
        name: "Ollama",
        description: [
          "모델과 채팅은 Ollama 모델을 실행하는 기기에서만 액세스할 수 있습니다.",
        ],
      },
      native: {
        name: "Custom Llama Model",
        description: [
          "모델과 채팅은 이 AnythingLLM 인스턴스에서만 액세스할 수 있습니다.",
        ],
      },
      togetherai: {
        name: "TogetherAI",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 TogetherAI에 표시됩니다.",
        ],
      },
      mistral: {
        name: "Mistral",
        description: [
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 Mistral에 표시됩니다.",
        ],
      },
      huggingface: {
        name: "HuggingFace",
        description: [
          "응답에 사용된 프롬프트와 문서 텍스트는 귀하의 HuggingFace 관리 엔드포인트로 전송됩니다.",
        ],
      },
      perplexity: {
        name: "Perplexity AI",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 Perplexity AI에 표시됩니다.",
        ],
      },
      openrouter: {
        name: "OpenRouter",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 OpenRouter에 표시됩니다.",
        ],
      },
      groq: {
        name: "Groq",
        description: [
          "귀하의 채팅은 훈련에 사용되지 않습니다.",
          "응답 생성에 사용된 프롬프트와 문서 텍스트는 Groq에 표시됩니다.",
        ],
      },
      koboldcpp: {
        name: "KoboldCPP",
        description: [
          "모델과 채팅은 KoboldCPP를 실행하는 서버에서만 액세스할 수 있습니다.",
        ],
      },
      textgenwebui: {
        name: "Oobabooga Web UI",
        description: [
          "모델과 채팅은 Oobabooga 텍스트 생성 웹 UI를 실행하는 서버에서만 액세스할 수 있습니다.",
        ],
      },
      "generic-openai": {
        name: "Generic OpenAI compatible service",
        description: [
          "데이터는 귀하의 일반 엔드포인트 제공업체의 서비스 약관에 따라 공유됩니다.",
        ],
      },
      cohere: {
        name: "Cohere",
        description: [
          "데이터는 cohere.com의 서비스 약관 및 귀하의 지역 개인정보 보호법에 따라 공유됩니다.",
        ],
      },
      litellm: {
        name: "LiteLLM",
        description: [
          "모델과 채팅은 LiteLLM을 실행하는 서버에서만 액세스할 수 있습니다.",
        ],
      },
    },
    vectorDbPrivacy: {
      chroma: {
        name: "Chroma",
        description: [
          "벡터와 문서 텍스트는 Chroma 인스턴스에 저장됩니다.",
          "인스턴스 접근은 귀하가 관리합니다.",
        ],
      },
      pinecone: {
        name: "Pinecone",
        description: [
          "벡터와 문서 텍스트는 Pinecone의 서버에 저장됩니다.",
          "귀하의 데이터 접근은 Pinecone이 관리합니다.",
        ],
      },
      qdrant: {
        name: "Qdrant",
        description: [
          "벡터와 문서 텍스트는 귀하의 Qdrant 인스턴스(클라우드 또는 자체 호스팅)에 저장됩니다.",
        ],
      },
      weaviate: {
        name: "Weaviate",
        description: [
          "벡터와 문서 텍스트는 귀하의 Weaviate 인스턴스(클라우드 또는 자체 호스팅)에 저장됩니다.",
        ],
      },
      milvus: {
        name: "Milvus",
        description: [
          "벡터와 문서 텍스트는 귀하의 Milvus 인스턴스(클라우드 또는 자체 호스팅)에 저장됩니다.",
        ],
      },
      zilliz: {
        name: "Zilliz Cloud",
        description: [
          "벡터와 문서 텍스트는 귀하의 Zilliz 클라우드 클러스터에 저장됩니다.",
        ],
      },
      astra: {
        name: "AstraDB",
        description: [
          "벡터와 문서 텍스트는 귀하의 클라우드 AstraDB 데이터베이스에 저장됩니다.",
        ],
      },
      lancedb: {
        name: "LanceDB",
        description: [
          "벡터와 문서 텍스트는 이 AnythingLLM 인스턴스에 비공개로 저장됩니다.",
        ],
      },
    },
    embeddingEnginePrivacy: {
      native: {
        name: "AnythingLLM Embedder",
        description: [
          "문서 텍스트는 이 AnythingLLM 인스턴스에서 비공개로 임베딩됩니다.",
        ],
      },
      openai: {
        name: "OpenAI",
        description: [
          "문서 텍스트는 OpenAI 서버로 전송됩니다.",
          "문서는 훈련에 사용되지 않습니다.",
        ],
      },
      azure: {
        name: "Azure OpenAI",
        description: [
          "문서 텍스트는 Microsoft Azure 서비스로 전송됩니다.",
          "문서는 훈련에 사용되지 않습니다.",
        ],
      },
      localai: {
        name: "LocalAI",
        description: [
          "문서 텍스트는 LocalAI를 실행하는 서버에서 비공개로 임베딩됩니다.",
        ],
      },
      ollama: {
        name: "Ollama",
        description: [
          "문서 텍스트는 Ollama를 실행하는 서버에서 비공개로 임베딩됩니다.",
        ],
      },
      lmstudio: {
        name: "LMStudio",
        description: [
          "문서 텍스트는 LMStudio를 실행하는 서버에서 비공개로 임베딩됩니다.",
        ],
      },
      cohere: {
        name: "Cohere",
        description: [
          "데이터는 cohere.com의 서비스 약관 및 귀하의 지역 개인정보 보호법에 따라 공유됩니다.",
        ],
      },
      voyageai: {
        name: "Voyage AI",
        description: [
          "데이터는 voyageai.com의 서비스 약관에 따라 Voyage AI의 서버로 전송됩니다.",
        ],
      },
      litellm: {
        name: "LiteLLM",
        description: [
          "문서 텍스트는 LiteLLM을 실행하는 서버에서만 접근할 수 있으며, LiteLLM에 설정된 공급자에게만 전달됩니다.",
        ],
      },
      "generic-openai": {
        name: "Generic OpenAI compatible service",
        description: [
          "데이터는 귀하의 일반 엔드포인트 제공업체의 서비스 약관에 따라 공유됩니다.",
        ],
      },
    },
  },
  //language preference
  displayLanguage: {
    title: "언어 설정",
    description: "AnythingLLM의 UI에서 사용할 언어를 선택하세요.",
  },

  //supportEmail
  supportEmail: {
    title: "지원 이메일",
    description:
      "이 인스턴스에 로그인한 동안 사용자 메뉴에 표시될 지원 이메일 주소를 설정하세요.",
    clearButton: "지우기",
    saveButton: "저장",
    updateFailed: "지원 이메일을 업데이트하지 못했습니다: {{error}}",
    updateSuccess: "지원 이메일이 성공적으로 업데이트되었습니다.",
  },

  //customAppName
  customAppName: {
    title: "앱 이름 설정",
    description: "로그인 페이지에 표시될 앱 이름을 설정하세요.",
    placeholder: "AnythingLLM",
    clearButton: "지우기",
    saveButton: "저장",
    updateFailed: "앱 이름 업데이트 실패: {{error}}",
    updateSuccess: "앱 이름이 성공적으로 업데이트되었습니다.",
  },

  //Agentskills
  agentSkills: {
    "rag-memory": {
      title: "RAG & 장기 기억",
      description:
        "에이전트가 로컬 문서를 활용하여 쿼리에 응답하거나, 장기 기억 검색을 위해 특정 콘텐츠를 '기억'하도록 요청할 수 있습니다.",
    },
    "view-summarize": {
      title: "문서 보기 및 요약",
      description:
        "에이전트가 현재 임베디드된 작업 공간 파일의 내용을 나열하고 요약할 수 있습니다.",
    },
    "scrape-websites": {
      title: "웹사이트 스크래핑",
      description:
        "에이전트가 웹사이트를 방문하고 그 내용을 스크랩하도록 허용합니다.",
    },
    "save-file-to-browser": {
      title: "파일 생성 및 브라우저에 저장",
      description:
        "기본 에이전트가 파일을 생성하고 컴퓨터에 저장할 수 있도록 허용합니다.",
      skill: "save-file-to-browser",
    },
    "create-chart": {
      title: "차트 생성",
      description:
        "기본 에이전트가 제공된 데이터 또는 채팅에서 받은 데이터를 바탕으로 다양한 차트를 생성할 수 있도록 허용합니다.",
      skill: "create-chart",
    },
    "web-browsing": {
      title: "웹 검색",
      skill: "web-browsing",
    },
    "sql-agent": {
      title: "SQL 커넥터",
      skill: "sql-agent",
    },
    saveFailed: "에이전트 설정 저장에 실패했습니다.",
    saveSuccess: "에이전트 설정이 성공적으로 저장되었습니다.",
    title: "에이전트 스킬",
    description: "에이전트 스킬을 선택하세요",
    default: "기본",
  },

  //contextSaveBar
  contextSaveBar: {
    unsaved: "저장되지 않은 변경 사항",
    cancel: "취소",
    save: "저장",
  },

  //agentDbConnection
  agentDbConnection: {
    title: "SQL 에이전트",
    confirmDelete:
      "{{database_id}}을(를) 사용 가능한 SQL 연결 목록에서 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    description:
      "에이전트가 다양한 SQL 데이터베이스 제공자에 연결하여 질문에 답변할 수 있도록 SQL을 활용할 수 있게 합니다.",
    connection: "데이터베이스 연결 목록",
    add: "새 SQL 연결",
    fillOutFields: "모든 필드를 작성해 주세요.",
    addDescription:
      "아래에 데이터베이스 연결 정보를 추가하면, 이후 SQL 에이전트 호출 시 사용할 수 있습니다.",
    warningMessage: `
    <b>경고:</b> SQL 에이전트는 <i>비수정</i> 쿼리만 수행하도록 설정되었습니다. 
    하지만 이 설정은 예기치 않은 동작으로 인해 데이터가 삭제되는 것을 <b>방지하지 못합니다</b>. 
    반드시 <b>READ_ONLY</b> 권한이 있는 사용자로만 연결하세요.
  `,
    selectEngine: "SQL 엔진 선택",
    connectionName: "연결 이름",
    namePlaceholder: "이 SQL 연결을 식별할 고유 이름",
    username: "데이터베이스 사용자",
    password: "데이터베이스 비밀번호",
    host: "서버 엔드포인트",
    hostPlaceholder: "데이터베이스의 호스트 이름 또는 엔드포인트",
    port: "포트",
    database: "데이터베이스",
    databasePlaceholder: "에이전트가 상호작용할 데이터베이스",
    cancel: "취소",
    saveConnection: "연결 저장",
  },

  //searchProvidesOption
  searchProviders: {
    none: {
      name: "선택해 주세요",
      description: "웹 검색이 제공자와 키가 설정될 때까지 비활성화됩니다.",
    },
    googleSearch: {
      name: "구글 검색 엔진",
      description:
        "사용자 지정 구글 검색 엔진을 통한 웹 검색. 하루 100회 무료 검색 가능.",
    },
    serperDotDev: {
      name: "Serper.dev",
      description: "Serper.dev 웹 검색. 2,500회 무료 사용, 이후 유료 전환.",
    },
    bingSearch: {
      name: "빙 검색",
      description:
        "빙 검색 API로 구동되는 웹 검색. 한 달에 1,000회 무료 검색 가능.",
    },
    serply: {
      name: "Serply.io",
      description: "Serply.io 웹 검색. 월 100회 무료 검색 제공.",
    },
    searxng: {
      name: "SearXNG",
      description:
        "개인 정보 추적 없이 사용할 수 있는 무료 오픈 소스 메타 검색 엔진.",
    },
    title: "실시간 웹 검색 및 탐색",
    description:
      " 에이전트가 웹 검색 엔진(SERP)과 연결되어 웹에서 정보를 검색하고 질문에 답할 수 있도록 설정하세요. 이 설정을 완료하지 않으면 에이전트가 웹 검색을 수행할 수 없습니다.",
    searchPlaceholder: "사용 가능한 웹 검색 제공자를 검색하세요",
  },
  //searchProvidesOption
  searchProvidesOption: {
    googleSearch: {
      description:
        '무료 검색 엔진과 API 키를 <a href="https://programmablesearchengine.google.com/controlpanel/create" target="_blank" rel="noreferrer" class="text-blue-300 underline">여기에서 구글로부터 받을 수 있습니다.</a>',
      searchEngineId: "검색 엔진 ID",
      apiKey: "프로그래매틱 액세스 API 키",
      placeholderEngineId: "구글 검색 엔진 ID",
      placeholderApiKey: "구글 검색 엔진 API 키",
    },
    serperDotDev: {
      description:
        '무료 API 키를 <a href="https://serper.dev" target="_blank" rel="noreferrer" class="text-blue-300 underline">Serper.dev에서 받을 수 있습니다.</a>',
      apiKey: "API 키",
      placeholderApiKey: "Serper.dev API 키",
    },
    bingSearch: {
      description:
        'Bing 웹 검색 API 구독 키를 <a href="https://portal.azure.com/" target="_blank" rel="noreferrer" class="text-blue-300 underline">Azure 포털에서 받을 수 있습니다.</a>',
      apiKey: "API 키",
      placeholderApiKey: "Bing 웹 검색 API 키",
      setupDescription: "Bing 웹 검색 API 구독 설정 방법:",
      steps: {
        step1:
          'Azure 포털로 이동: <a href="https://portal.azure.com/" target="_blank" rel="noreferrer" class="text-blue-300 underline">https://portal.azure.com/</a>',
        step2: "새로운 Azure 계정을 만들거나 기존 계정으로 로그인하세요.",
        step3: '"리소스 생성" 섹션으로 이동하여 "Bing Search v7"을 검색하세요.',
        step4: '"Bing Search v7" 리소스를 선택하고 새 구독을 만드세요.',
        step5: "필요한 요금제를 선택하세요 (무료 요금제 사용 가능).",
        step6: "Bing 웹 검색 구독에 대한 API 키를 받으세요.",
      },
    },
    serply: {
      description:
        '무료 API 키를 <a href="https://serply.io" target="_blank" rel="noreferrer" class="text-blue-300 underline">Serply.io에서 받을 수 있습니다.</a>',
      apiKey: "API 키",
      placeholderApiKey: "Serply API 키",
    },
    searxng: {
      baseUrl: "SearXNG API 기본 URL",
      placeholderUrl: "SearXNG API 키",
    },
  },
};
export default TRANSLATIONS;
