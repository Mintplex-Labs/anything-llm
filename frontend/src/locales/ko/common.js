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
    "browser-extension": "브라우저 확장 프로그램",
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
    title: "워크스페이스 채팅",
    description:
      "이것들은 사용자들이 보낸 모든 채팅과 메시지입니다. 생성 날짜별로 정렬되어 있습니다.",
    export: "내보내기",
    table: {
      id: "ID",
      by: "보낸 사람",
      workspace: "워크스페이스",
      prompt: "프롬프트",
      response: "응답",
      at: "보낸 시각",
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
      "이것은 채팅과 임베딩을 하기 위한 선호하는 LLM 제공자의 인증입니다. 이 키가 현재 활성 상태이고 정확해야 AnythingLLM이 제대로 작동합니다.",
    provider: "LLM 제공자",
  },

  transcription: {
    title: "텍스트 변환 모델 기본 설정",
    description:
      "이것은 선호하는 텍스트 변환 모델 제공자의 인증입니다. 이 키가 현재 활성 상태이고 정확해야 미디어 파일 및 오디오가 텍스트 변환됩니다.",
    provider: "텍스트 변환 제공자",
    "warn-start":
      "RAM 또는 CPU 성능이 제한된 머신에서 로컬 위스퍼 모델을 사용하면 미디어 파일을 처리할 때 AnythingLLM이 중단될 수 있습니다.",
    "warn-recommend": "최소 2GB RAM과 10Mb 보다 작은 파일 업로드를 권장합니다.",
    "warn-end": "내장된 모델은 첫 번째 사용 시 자동으로 다운로드됩니다.",
  },

  embedding: {
    title: "임베딩 기본 설정",
    "desc-start":
      "임베딩 엔진을 지원하지 않는 LLM을 사용할 때 텍스트를 임베딩하는 데 다른 임베딩 엔진 제공자의 인증이 필요할 수 있습니다.",
    "desc-end":
      "임베딩은 텍스트를 벡터로 변환하는 과정입니다. 파일과 프롬프트를 AnythingLLM이 처리할 수 있는 형식으로 변환하려면 이러한 인증이 필요합니다.",
    provider: {
      title: "임베딩 제공자",
      description:
        "AnythingLLM의 기본 임베딩 엔진을 사용할 때는 설정이 필요하지 않습니다.",
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
    export: "내보내기",
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
  },
};

export default TRANSLATIONS;
