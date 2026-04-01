// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "시작하기",
      welcome: "환영합니다",
    },
    llm: {
      title: "LLM 기본 설정",
      description:
        "AnythingLLM은 다양한 LLM 제공자와 연동할 수 있습니다. 여기서 선택한 서비스가 채팅을 담당하게 됩니다.",
    },
    userSetup: {
      title: "사용자 설정",
      description: "사용자 설정을 구성하세요.",
      howManyUsers: "이 인스턴스를 사용할 사용자는 몇 명인가요?",
      justMe: "나만 사용",
      myTeam: "팀 사용",
      instancePassword: "인스턴스 비밀번호",
      setPassword: "비밀번호를 설정하시겠습니까?",
      passwordReq: "비밀번호는 최소 8자 이상이어야 합니다.",
      passwordWarn: "이 비밀번호는 복구 방법이 없으니 꼭 안전하게 보관하세요.",
      adminUsername: "관리자 계정 사용자명",
      adminPassword: "관리자 계정 비밀번호",
      adminPasswordReq: "비밀번호는 최소 8자 이상이어야 합니다.",
      teamHint:
        "기본적으로 본인이 유일한 관리자가 됩니다. 온보딩이 완료되면 다른 사용자를 초대하거나 관리자로 지정할 수 있습니다. 비밀번호를 분실하면 관리자만 비밀번호를 재설정할 수 있으니 꼭 기억해 두세요.",
    },
    data: {
      title: "데이터 처리 및 개인정보 보호",
      description:
        "AnythingLLM은 여러분의 개인정보에 대한 투명성과 제어권을 최우선으로 생각합니다.",
      settingsHint: "이 설정은 언제든지 설정 메뉴에서 다시 변경할 수 있습니다.",
    },
    survey: {
      title: "AnythingLLM에 오신 것을 환영합니다",
      description:
        "여러분의 필요에 맞는 AnythingLLM을 만들 수 있도록 도와주세요. (선택 사항)",
      email: "이메일을 입력해 주세요",
      useCase: "AnythingLLM을 어떤 용도로 사용하실 예정인가요?",
      useCaseWork: "업무용",
      useCasePersonal: "개인용",
      useCaseOther: "기타",
      comment: "AnythingLLM을 어떻게 알게 되셨나요?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube 등 - 어떻게 알게 되셨는지 알려주세요!",
      skip: "설문 건너뛰기",
      thankYou: "소중한 의견 감사합니다!",
    },
  },
  common: {
    "workspaces-name": "워크스페이스 이름",
    selection: "모델 선택",
    saving: "저장 중...",
    save: "저장",
    previous: "이전",
    next: "다음",
    optional: "선택 사항",
    yes: "예",
    no: "아니오",
    search: "검색",
    username_requirements:
      "사용자 이름은 2-32자여야 하고, 소문자로 시작해야 하며, 소문자, 숫자, 밑줄, 하이픈, 마침표만 포함할 수 있습니다.",
    on: "~에 대해",
    none: "없음",
    stopped: "멈춤",
    loading: "로딩 중",
    refresh: "새롭게",
  },
  settings: {
    title: "인스턴스 설정",
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
    "system-prompt-variables": "System Prompt Variables",
    interface: "UI 환경 설정",
    branding: "브랜딩 및 화이트라벨링",
    chat: "채팅",
    "mobile-app": "AnythingLLM 모바일",
    "community-hub": {
      title: "지역 커뮤니티 허브",
      trending: "인기 트렌드 탐색",
      "your-account": "당신의 계정",
      "import-item": "수입 품목",
    },
    channels: "채널",
    "available-channels": {
      telegram: "텔레그램",
    },
  },
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
    "sign-in": "{{appName}}에 로그인하세요.",
    "password-reset": {
      title: "비밀번호 재설정",
      description: "비밀번호를 재설정하려면 아래에 필요한 정보를 입력하세요.",
      "recovery-codes": "복구 코드",
      "back-to-login": "로그인으로 돌아가기",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "에이전트 생성",
      editWorkspace: "워크스페이스 편집",
      uploadDocument: "문서 업로드",
    },
    greeting: "오늘 어떻게 도와드릴까요?",
  },
  "new-workspace": {
    title: "새 워크스페이스",
    placeholder: "내 워크스페이스",
  },
  "workspaces—settings": {
    general: "일반 설정",
    chat: "채팅 설정",
    vector: "벡터 데이터베이스",
    members: "구성원",
    agent: "에이전트 구성",
  },
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
    },
    mode: {
      title: "채팅 모드",
      chat: {
        title: "채팅",
        description:
          "LLM의 일반적인 지식과 문서 컨텍스트를 활용하여 답변을 제공합니다. 도구를 사용하려면 @agent 명령을 사용해야 합니다.",
      },
      query: {
        title: "쿼리",
        description:
          "문서의 맥락이 발견되면 답변만 제공합니다.<b>필요한 경우, @agent 명령어를 사용하여 도구를 사용해야 합니다.</b>",
      },
      automatic: {
        title: "자동",
        description:
          "모델과 제공업체가 네이티브 도구 호출을 지원하는 경우, 자동으로 도구를 사용합니다. <br />네이티브 도구 호출이 지원되지 않는 경우, 도구를 사용하려면 @agent 명령을 사용해야 합니다.",
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
      title: "시스템 프롬프트",
      description:
        "이 워크스페이스에서 사용할 프롬프트입니다. AI가 응답을 생성하기 위해 문맥과 지침을 정의합니다. AI가 질문에 대하여 정확한 응답을 생성할 수 있도록 신중하게 프롬프트를 제공해야 합니다.",
      history: {
        title: "시스템 프롬프트 기록",
        clearAll: "전체 삭제",
        noHistory: "저장된 시스템 프롬프트 기록이 없습니다",
        restore: "복원",
        delete: "삭제",
        publish: "커뮤니티 허브에 게시",
        deleteConfirm: "이 기록 항목을 삭제하시겠습니까?",
        clearAllConfirm:
          "모든 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
        expand: "확장",
      },
    },
    refusal: {
      title: "쿼리 모드 거부 응답 메시지",
      "desc-start": "쿼리 모드에서",
      query: "응답에 사용할 수 있는",
      "desc-end": "컨텍스트를 찾을 수 없을 때 거부 응답 내용을 작성합니다.",
      "tooltip-title": "왜 이 메시지가 표시되나요?",
      "tooltip-description":
        "현재 쿼리 모드에서는 문서의 정보만을 사용합니다. 더 자유로운 대화를 원하시면 채팅 모드로 전환하거나, 채팅 모드에 대한 자세한 내용은 문서를 참고하세요.",
    },
    temperature: {
      title: "LLM 온도",
      "desc-start": '이 설정은 LLM 응답이 얼마나 "창의적"일지를 제어합니다.',
      "desc-end":
        "숫자가 높을수록 창의적입니다. 일부 모델에서는 너무 높게 설정하면 일관성 없는 응답이 나올 수 있습니다.",
      hint: "대부분의 LLM은 유효한 값의 다양한 허용 범위를 가지고 있습니다. 해당 정보는 LLM 제공자에게 문의하세요.",
    },
  },
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
      web: {
        title: "실시간 웹 검색 및 탐색",
        description:
          "웹 검색 (SERP) 제공업체와 연결하여 에이전트가 웹을 검색하고 질문에 답변하도록 설정합니다.",
      },
      sql: {
        title: "SQL 연결기",
        description:
          "여러 SQL 데이터베이스 제공업체에 연결하여 에이전트가 SQL을 활용하여 질문에 답변할 수 있도록 지원합니다.",
      },
      default_skill:
        "기본적으로 이 기능은 활성화되어 있지만, 에이전트에게 이 기능을 사용하지 않도록 설정할 수도 있습니다.",
      filesystem: {
        title: "파일 시스템 접근",
        description:
          "제 에이전트가 지정된 디렉토리 내에서 파일을 읽고, 쓰고, 검색하고, 관리할 수 있도록 합니다. 파일 편집, 디렉토리 탐색, 콘텐츠 검색을 지원합니다.",
        learnMore: "이 기술을 사용하는 방법에 대해 자세히 알아보세요.",
        configuration: "구성",
        readActions: "실행 내용 보기",
        writeActions: "실행 내용",
        warning:
          "파일 시스템 접근은 위험할 수 있습니다. 왜냐하면 파일 내용을 변경하거나 삭제할 수 있기 때문입니다. 사용하기 전에 반드시 <link>문서</link>를 참조하십시오.",
        skills: {
          "read-text-file": {
            title: "파일 읽기",
            description:
              "파일(텍스트, 코드, PDF, 이미지 등)의 내용을 읽습니다.",
          },
          "read-multiple-files": {
            title: "여러 파일을 읽기",
            description: "여러 파일을 한 번에 읽기",
          },
          "list-directory": {
            title: "디렉토리 목록",
            description: "폴더 내의 파일 및 디렉터리 목록 보기",
          },
          "search-files": {
            title: "파일 검색",
            description: "이름 또는 내용으로 파일을 검색",
          },
          "get-file-info": {
            title: "파일 정보 확인",
            description: "파일에 대한 자세한 메타데이터를 얻으세요.",
          },
          "edit-file": {
            title: "파일 편집",
            description: "텍스트 파일에 줄 단위로 편집",
          },
          "create-directory": {
            title: "디렉토리 생성",
            description: "새로운 디렉토리를 생성합니다.",
          },
          "move-file": {
            title: "파일 이동/이름 변경",
            description: "파일 및 폴더를 이동하거나 이름을 변경합니다.",
          },
          "copy-file": {
            title: "파일 복사",
            description: "파일 및 디렉터리를 복사",
          },
          "write-text-file": {
            title: "텍스트 파일 작성",
            description:
              "새로운 텍스트 파일을 생성하거나 기존 텍스트 파일을 덮어쓰기",
          },
        },
      },
      createFiles: {
        title: "문서 생성",
        description:
          "에이전트가 파워포인트 프레젠테이션, 엑셀 스프레드시트, 워드 문서, PDF 등 이진 파일 형식의 문서를 생성할 수 있도록 지원합니다. 파일은 채팅 창에서 직접 다운로드할 수 있습니다.",
        configuration: "사용 가능한 문서 유형",
        skills: {
          "create-text-file": {
            title: "텍스트 파일",
            description:
              "원하는 내용과 확장자(.txt, .md, .json, .csv 등)를 사용하여 텍스트 파일을 생성합니다.",
          },
          "create-pptx": {
            title: "파워포인트 프레젠테이션",
            description:
              "슬라이드, 제목, 마크다운 등을 포함하여 새로운 파워포인트 프레젠테이션을 만드세요.",
          },
          "create-pdf": {
            title: "PDF 문서",
            description:
              "기본 스타일을 적용하여 마크다운 또는 일반 텍스트에서 PDF 문서를 생성합니다.",
          },
          "create-xlsx": {
            title: "엑셀 스프레드시트",
            description:
              "표와 스타일을 포함한 표 형태의 데이터를 위한 엑셀 문서를 만드세요.",
          },
          "create-docx": {
            title: "워드 문서",
            description:
              "기본적인 스타일과 서식을 사용하여 워드 문서를 만드세요.",
          },
        },
      },
    },
    mcp: {
      title: "MCP 서버",
      "loading-from-config": "구성 파일에서 MCP 서버 로드",
      "learn-more": "MCP 서버에 대해 더 자세히 알아보세요.",
      "no-servers-found": "MCP 서버를 찾을 수 없습니다.",
      "tool-warning":
        "최상의 성능을 위해, 불필요한 도구를 비활성화하여 컨텍스트를 보존하는 것을 고려해 보세요.",
      "stop-server": "MCP 서버 중단",
      "start-server": "MCP 서버 시작",
      "delete-server": "MCP 서버 삭제",
      "tool-count-warning":
        "이 MCP 서버에는 <b>에 설정된 {{count}} 도구가 있으며, 이는 모든 채팅에서 컨텍스트를 소비합니다. </b> 불필요한 도구를 비활성화하여 컨텍스트를 절약하는 것을 고려해 보세요.",
      "startup-command": "시작 명령어",
      command: "명령",
      arguments: "논쟁",
      "not-running-warning":
        "이 MCP 서버는 현재 실행 상태가 아닙니다. 중단되었거나, 시작 시 오류가 발생했을 수 있습니다.",
      "tool-call-arguments": "툴 호출 인자",
      "tools-enabled": "도구 사용 기능 활성화",
    },
    settings: {
      title: "에이전트 스킬 설정",
      "max-tool-calls": {
        title: "응답당 최대 툴 호출 횟수",
        description:
          "에이전트가 단일 응답을 생성하기 위해 사용할 수 있는 최대 툴의 개수입니다. 이를 통해 불필요한 툴 호출과 무한 루프를 방지합니다.",
      },
      "intelligent-skill-selection": {
        title: "지능형 기술 선택",
        "beta-badge": "베타",
        description:
          "쿼리당 무제한의 도구 사용 및 컷 토큰 사용량을 최대 80%까지 줄일 수 있습니다 – AnythingLLM은 모든 프롬프트에 적합한 기술을 자동으로 선택합니다.",
        "max-tools": {
          title: "맥스 툴스",
          description:
            "각 쿼리에 사용할 수 있는 최대 도구 수입니다. 큰 컨텍스트 모델의 경우, 이 값을 더 높은 값으로 설정하는 것을 권장합니다.",
        },
      },
    },
  },
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
  customization: {
    interface: {
      title: "UI 환경 설정",
      description: "AnythingLLM의 UI 환경을 원하는 대로 설정하세요.",
    },
    branding: {
      title: "브랜딩 및 화이트라벨링",
      description:
        "AnythingLLM 인스턴스에 맞춤 브랜딩을 적용해 화이트라벨링할 수 있습니다.",
    },
    chat: {
      title: "채팅",
      description: "AnythingLLM의 채팅 환경을 원하는 대로 설정하세요.",
      auto_submit: {
        title: "음성 입력 자동 전송",
        description:
          "일정 시간 동안 음성이 감지되지 않으면 음성 입력을 자동으로 전송합니다.",
      },
      auto_speak: {
        title: "응답 자동 음성 출력",
        description: "AI의 응답을 자동으로 음성으로 들려줍니다.",
      },
      spellcheck: {
        title: "맞춤법 검사 활성화",
        description: "채팅 입력란에서 맞춤법 검사를 켜거나 끌 수 있습니다.",
      },
    },
    items: {
      theme: {
        title: "테마",
        description: "애플리케이션의 색상 테마를 선택하세요.",
      },
      "show-scrollbar": {
        title: "스크롤바 표시",
        description: "채팅 창에서 스크롤바를 표시하거나 숨길 수 있습니다.",
      },
      "support-email": {
        title: "지원 이메일",
        description:
          "사용자가 도움이 필요할 때 접근할 수 있는 지원 이메일 주소를 설정하세요.",
      },
      "app-name": {
        title: "이름",
        description:
          "로그인 페이지에 모든 사용자에게 표시될 애플리케이션 이름을 설정하세요.",
      },
      "display-language": {
        title: "표시 언어",
        description:
          "AnythingLLM의 UI에 사용할 언어를 선택하세요. 번역이 제공되는 경우에만 적용됩니다.",
      },
      logo: {
        title: "브랜드 로고",
        description: "모든 페이지에 표시할 맞춤 로고를 업로드하세요.",
        add: "맞춤 로고 추가",
        recommended: "권장 크기: 800 x 200",
        remove: "제거",
        replace: "교체",
      },
      "browser-appearance": {
        title: "브라우저 표시 설정",
        description:
          "앱이 열려 있을 때 브라우저 탭과 제목의 표시 방식을 맞춤 설정하세요.",
        tab: {
          title: "탭 제목",
          description:
            "앱이 브라우저에서 열려 있을 때 사용할 맞춤 탭 제목을 설정하세요.",
        },
        favicon: {
          title: "파비콘",
          description: "브라우저 탭에 사용할 맞춤 파비콘을 지정하세요.",
        },
      },
      "sidebar-footer": {
        title: "사이드바 하단 항목",
        description: "사이드바 하단에 표시될 푸터 항목을 맞춤 설정하세요.",
        icon: "아이콘",
        link: "링크",
      },
      "render-html": {
        title: "채팅에서 HTML 렌더링",
        description:
          "어시스턴트 응답에 HTML 응답을 표시합니다.\n이는 응답 품질의 훨씬 더 높은 수준을 달성할 수 있지만, 잠재적인 보안 위험으로 이어질 수도 있습니다.",
      },
    },
  },
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
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure 서비스 엔드포인트",
        api_key: "API 키",
        chat_deployment_name: "채팅 배포 이름",
        chat_model_token_limit: "채팅 모델 토큰 한도",
        model_type: "모델 유형",
        default: "기본값",
        reasoning: "추론",
        model_type_tooltip:
          '만약 귀하의 배포가 추론 모델(o1, o1-mini, o3-mini 등)을 사용한다면, 이 옵션을 "추론"으로 설정하십시오. 그렇지 않으면, 챗봇 요청이 실패할 수 있습니다.',
      },
    },
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
    },
  },
  text: {
    title: "텍스트 분할 및 청킹 기본 설정",
    "desc-start":
      "새 문서를 벡터 데이터베이스에 삽입하기 전에 기본 텍스트 분할 방식을 변경할 수 있습니다.",
    "desc-end":
      "텍스트 분할 방식과 그 영향을 이해하고 있는 경우에만 이 설정을 변경해야 합니다.",
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
  vector: {
    title: "벡터 데이터베이스",
    description:
      "이것은 AnythingLLM 인스턴스가 벡터 데이터베이스 사용을 위한 인증 설정입니다. 이 키가 활성 상태이고 정확해야 합니다.",
    provider: {
      title: "벡터 데이터베이스 제공자",
      description: "LanceDB를 선택하면 설정이 필요 없습니다.",
    },
  },
  embeddable: {
    title: "임베드 가능한 채팅 위젯",
    description:
      "임베드 가능한 채팅 위젯은 하나의 워크스페이스에 연결된 공개용 채팅방입니다. 이를 통해 워크스페이스 설정이 적용된 채팅방을 일반인들에게 공개할 수 있습니다.",
    create: "임베드 생성",
    table: {
      workspace: "워크스페이스",
      chats: "보낸 채팅",
      active: "활성 도메인",
      created: "생성일",
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
  privacy: {
    title: "개인정보와 데이터 처리",
    description:
      "연결된 타사 제공자와 AnythingLLM이 데이터를 처리하는 방식을 구성합니다.",
    anonymous: "익명 원격 분석 활성화",
  },
  connectors: {
    "search-placeholder": "데이터 커넥터 검색",
    "no-connectors": "데이터 커넥터를 찾을 수 없습니다.",
    obsidian: {
      vault_location: "볼트 위치",
      vault_description:
        "모든 노트와 연결을 가져오려면 Obsidian 볼트 폴더를 선택하세요.",
      selected_files: "{{count}}개의 마크다운 파일을 찾았습니다",
      importing: "볼트 가져오는 중...",
      import_vault: "볼트 가져오기",
      processing_time: "볼트 크기에 따라 시간이 다소 소요될 수 있습니다.",
      vault_warning:
        "충돌을 방지하려면 Obsidian 볼트가 현재 열려 있지 않은지 확인하세요.",
    },
    github: {
      name: "GitHub 저장소",
      description:
        "공개 또는 비공개 GitHub 저장소 전체를 한 번의 클릭으로 가져옵니다.",
      URL: "GitHub 저장소 URL",
      URL_explained: "가져오려는 GitHub 저장소의 URL을 입력하세요.",
      token: "GitHub 액세스 토큰",
      optional: "선택 사항",
      token_explained: "요청 제한을 방지하기 위한 액세스 토큰입니다.",
      token_explained_start: "무엇보다 중요한 것은,",
      token_explained_link1: "개인 액세스 토큰",
      token_explained_middle:
        "이 없으면 GitHub API의 요청 제한으로 인해 가져올 수 있는 파일 수가 제한될 수 있습니다. ",
      token_explained_link2: "임시 액세스 토큰을 생성",
      token_explained_end: "하여 이 문제를 피할 수 있습니다.",
      ignores: "파일 무시 목록",
      git_ignore:
        "수집 중 무시할 파일을 .gitignore 형식으로 입력하세요. 저장하려면 각 항목 입력 후 엔터를 누르세요.",
      task_explained:
        "가져오기가 완료되면 모든 파일이 문서 선택기에서 워크스페이스에 임베딩할 수 있도록 제공됩니다.",
      branch: "가져올 브랜치",
      branch_loading: "-- 사용 가능한 브랜치 불러오는 중 --",
      branch_explained: "가져오려는 브랜치를 선택하세요.",
      token_information:
        "<b>GitHub 액세스 토큰</b>을 입력하지 않으면 GitHub의 공개 API 요청 제한으로 인해 이 데이터 커넥터는 저장소의 <b>최상위</b> 파일만 수집할 수 있습니다.",
      token_personal:
        "여기에서 GitHub 계정으로 무료 개인 액세스 토큰을 발급받을 수 있습니다.",
    },
    gitlab: {
      name: "GitLab 저장소",
      description:
        "공개 또는 비공개 GitLab 저장소 전체를 한 번의 클릭으로 가져옵니다.",
      URL: "GitLab 저장소 URL",
      URL_explained: "가져오려는 GitLab 저장소의 URL을 입력하세요.",
      token: "GitLab 액세스 토큰",
      optional: "선택 사항",
      token_description: "GitLab API에서 추가로 가져올 엔터티를 선택하세요.",
      token_explained_start: "무엇보다 중요한 것은,",
      token_explained_link1: "개인 액세스 토큰",
      token_explained_middle:
        "이 없으면 GitLab API의 요청 제한으로 인해 가져올 수 있는 파일 수가 제한될 수 있습니다. ",
      token_explained_link2: "임시 액세스 토큰을 생성",
      token_explained_end: "하여 이 문제를 피할 수 있습니다.",
      fetch_issues: "이슈를 문서로 가져오기",
      ignores: "파일 무시 목록",
      git_ignore:
        "수집 중 무시할 파일을 .gitignore 형식으로 입력하세요. 저장하려면 각 항목 입력 후 엔터를 누르세요.",
      task_explained:
        "가져오기가 완료되면 모든 파일이 문서 선택기에서 워크스페이스에 임베딩할 수 있도록 제공됩니다.",
      branch: "가져올 브랜치",
      branch_loading: "-- 사용 가능한 브랜치 불러오는 중 --",
      branch_explained: "가져오려는 브랜치를 선택하세요.",
      token_information:
        "<b>GitLab 액세스 토큰</b>을 입력하지 않으면 GitLab의 공개 API 요청 제한으로 인해 이 데이터 커넥터는 저장소의 <b>최상위</b> 파일만 수집할 수 있습니다.",
      token_personal:
        "여기에서 GitLab 계정으로 무료 개인 액세스 토큰을 발급받을 수 있습니다.",
    },
    youtube: {
      name: "YouTube 자막 가져오기",
      description: "링크를 통해 YouTube 동영상 전체의 자막을 가져옵니다.",
      URL: "YouTube 동영상 URL",
      URL_explained_start:
        "자막을 가져올 YouTube 동영상의 URL을 입력하세요. 동영상에는 반드시 ",
      URL_explained_link: "자막(Closed Captions)",
      URL_explained_end: " 이 활성화되어 있어야 합니다.",
      task_explained:
        "가져오기가 완료되면 자막이 문서 선택기에서 워크스페이스에 임베딩할 수 있도록 제공됩니다.",
    },
    "website-depth": {
      name: "웹사이트 대량 링크 수집",
      description:
        "웹사이트와 하위 링크를 지정한 깊이까지 크롤링하여 수집합니다.",
      URL: "웹사이트 URL",
      URL_explained: "수집하려는 웹사이트의 URL을 입력하세요.",
      depth: "크롤링 깊이",
      depth_explained:
        "시작 URL에서 몇 단계의 하위 링크까지 따라가서 수집할지 지정합니다.",
      max_pages: "최대 페이지 수",
      max_pages_explained: "수집할 최대 링크(페이지) 개수를 설정합니다.",
      task_explained:
        "수집이 완료되면 모든 크롤링된 콘텐츠가 문서 선택기에서 워크스페이스에 임베딩할 수 있도록 제공됩니다.",
    },
    confluence: {
      name: "Confluence",
      description: "한 번의 클릭으로 전체 Confluence 페이지를 가져옵니다.",
      deployment_type: "Confluence 배포 유형",
      deployment_type_explained:
        "Confluence 인스턴스가 Atlassian 클라우드에 호스팅되어 있는지, 자체 서버에 설치되어 있는지 선택하세요.",
      base_url: "Confluence 기본 URL",
      base_url_explained: "Confluence 공간의 기본 URL을 입력하세요.",
      space_key: "Confluence 스페이스 키",
      space_key_explained:
        "가져올 Confluence 스페이스의 키입니다. 보통 ~로 시작합니다.",
      username: "Confluence 사용자명",
      username_explained: "Confluence 계정의 사용자명을 입력하세요.",
      auth_type: "Confluence 인증 방식",
      auth_type_explained:
        "Confluence 페이지에 접근할 때 사용할 인증 방식을 선택하세요.",
      auth_type_username: "사용자명 + 액세스 토큰",
      auth_type_personal: "개인 액세스 토큰",
      token: "Confluence 액세스 토큰",
      token_explained_start:
        "인증을 위해 액세스 토큰이 필요합니다. 액세스 토큰은",
      token_explained_link: "여기에서 생성할 수 있습니다",
      token_desc: "인증용 액세스 토큰",
      pat_token: "Confluence 개인 액세스 토큰",
      pat_token_explained: "Confluence 계정의 개인 액세스 토큰입니다.",
      task_explained:
        "가져오기가 완료되면 페이지 내용이 문서 선택기에서 워크스페이스에 임베딩할 수 있도록 제공됩니다.",
      bypass_ssl: "SSL 인증서 유효성 검사 우회",
      bypass_ssl_explained:
        "자체 서명된 인증서를 사용하는 자체 호스팅 Confluence 인스턴스에 대해 SSL 인증서 유효성 검사를 우회하기 위해 이 옵션을 활성화합니다.",
    },
    manage: {
      documents: "문서 관리",
      "data-connectors": "데이터 커넥터",
      "desktop-only":
        "이 설정은 데스크톱 환경에서만 편집할 수 있습니다. 계속하려면 데스크톱에서 이 페이지에 접속해 주세요.",
      dismiss: "닫기",
      editing: "편집 중",
    },
    directory: {
      "my-documents": "내 문서",
      "new-folder": "새 폴더",
      "search-document": "문서 검색",
      "no-documents": "문서 없음",
      "move-workspace": "워크스페이스로 이동",
      "delete-confirmation":
        "이 파일과 폴더를 삭제하시겠습니까?\n삭제 시 시스템에서 완전히 제거되며, 기존 워크스페이스에서도 자동으로 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.",
      "removing-message":
        "{{count}}개의 문서와 {{folderCount}}개의 폴더를 삭제하는 중입니다. 잠시만 기다려 주세요.",
      "move-success": "{{count}}개의 문서를 성공적으로 이동했습니다.",
      no_docs: "문서 없음",
      select_all: "전체 선택",
      deselect_all: "전체 선택 해제",
      remove_selected: "선택 항목 삭제",
      save_embed: "저장 및 임베딩",
      "total-documents_one": "{{count}} 문서",
      "total-documents_other": "{{count}} 관련 문서",
    },
    upload: {
      "processor-offline": "문서 처리기가 오프라인 상태입니다",
      "processor-offline-desc":
        "현재 문서 처리기가 오프라인이어서 파일을 업로드할 수 없습니다. 잠시 후 다시 시도해 주세요.",
      "click-upload": "클릭하여 업로드하거나 파일을 끌어다 놓으세요",
      "file-types":
        "텍스트 파일, CSV, 스프레드시트, 오디오 파일 등 다양한 파일을 지원합니다!",
      "or-submit-link": "또는 링크 제출",
      "placeholder-link": "https://example.com",
      fetching: "가져오는 중...",
      "fetch-website": "웹사이트 가져오기",
      "privacy-notice":
        "이 파일들은 이 AnythingLLM 인스턴스에서 실행 중인 문서 처리기로 업로드됩니다. 파일은 제3자에게 전송되거나 공유되지 않습니다.",
    },
    pinning: {
      what_pinning: "문서 고정이란 무엇인가요?",
      pin_explained_block1:
        "AnythingLLM에서 문서를 <b>고정</b>하면 해당 문서의 전체 내용을 프롬프트 창에 삽입하여 LLM이 완전히 이해할 수 있도록 합니다.",
      pin_explained_block2:
        "이 기능은 <b>대용량 컨텍스트 모델</b>이나 지식 기반에 중요한 소형 파일에 가장 적합합니다.",
      pin_explained_block3:
        "기본 설정만으로 원하는 답변을 얻지 못할 때, 문서 고정은 한 번의 클릭으로 더 높은 품질의 답변을 얻을 수 있는 좋은 방법입니다.",
      accept: "확인했습니다",
    },
    watching: {
      what_watching: "문서 감시는 무엇을 하나요?",
      watch_explained_block1:
        "AnythingLLM에서 문서를 <b>감시</b>하면 원본 소스에서 정기적으로 문서 내용을 <i>자동으로</i> 동기화합니다. 이 파일이 관리되는 모든 워크스페이스의 내용이 자동으로 업데이트됩니다.",
      watch_explained_block2:
        "이 기능은 현재 온라인 기반 콘텐츠만 지원하며, 수동으로 업로드한 문서에는 사용할 수 없습니다.",
      watch_explained_block3_start: "감시 중인 문서는 ",
      watch_explained_block3_link: "파일 관리자",
      watch_explained_block3_end: " 관리자 화면에서 관리할 수 있습니다.",
      accept: "확인했습니다",
    },
  },
  chat_window: {
    attachments_processing:
      "첨부 파일을 처리 중입니다. 잠시만 기다려 주세요...",
    send_message: "메시지 보내기",
    attach_file: "이 채팅에 파일 첨부",
    text_size: "텍스트 크기 변경",
    microphone: "프롬프트를 음성으로 입력",
    send: "프롬프트 메시지를 워크스페이스로 전송",
    tts_speak_message: "TTS로 메시지 읽기",
    copy: "복사",
    regenerate: "다시 생성",
    regenerate_response: "응답 다시 생성",
    good_response: "좋은 답변",
    more_actions: "더 많은 작업",
    fork: "포크",
    delete: "삭제",
    cancel: "취소",
    edit_prompt: "프롬프트 수정",
    edit_response: "응답 수정",
    preset_reset_description: "채팅 기록을 초기화하고 새 채팅을 시작합니다",
    add_new_preset: "새 프리셋 추가",
    command: "명령어",
    your_command: "your-command",
    placeholder_prompt: "이 내용이 프롬프트 앞에 삽입됩니다.",
    description: "설명",
    placeholder_description: "LLM에 대한 시로 응답합니다.",
    save: "저장",
    small: "작게",
    normal: "보통",
    large: "크게",
    workspace_llm_manager: {
      search: "LLM 제공자 검색",
      loading_workspace_settings: "워크스페이스 설정을 불러오는 중...",
      available_models: "{{provider}}의 사용 가능한 모델",
      available_models_description:
        "이 워크스페이스에서 사용할 모델을 선택하세요.",
      save: "이 모델 사용하기",
      saving: "모델을 워크스페이스 기본값으로 설정 중...",
      missing_credentials: "이 제공자의 인증 정보가 없습니다!",
      missing_credentials_description: "클릭하여 인증 정보를 설정하세요",
    },
    submit: "제출",
    edit_info_user:
      '"제출"은 AI 응답을 다시 생성합니다. "저장"은 사용자 메시지만 업데이트합니다.',
    edit_info_assistant: "당신이 변경한 내용은 바로 이 답변에 저장됩니다.",
    see_less: "더 보기",
    see_more: "더 보기",
    tools: "도구",
    text_size_label: "글자 크기",
    select_model: "모델 선택",
    sources: "출처",
    document: "문서",
    similarity_match: "경쟁",
    source_count_one: "{{count}} 참조",
    source_count_other: "{{count}} 관련 참고 자료",
    preset_exit_description: "현재 에이전트 세션을 중단",
    add_new: "새로운 항목 추가",
    edit: "수정",
    publish: "출판",
    stop_generating: "응답 생성 중단",
    slash_commands: "슬래시 명령어",
    agent_skills: "에이전트의 역량",
    manage_agent_skills: "에이전트 역량 관리",
    agent_skills_disabled_in_session:
      "활성 에이전트 세션 중에 기술을 변경할 수 없습니다. 먼저 /exit 명령을 사용하여 세션을 종료하십시오.",
    start_agent_session: "에이전트 세션 시작",
    use_agent_session_to_use_tools:
      "채팅에서 도구를 사용하려면, 프롬프트의 시작 부분에 '@agent'을 사용하여 에이전트 세션을 시작할 수 있습니다.",
    agent_invocation: {
      model_wants_to_call: "모델이 통화하고 싶어",
      approve: "승인",
      reject: "거부",
      always_allow: "항상 {{skillName}}을 허용",
      tool_call_was_approved: "도구 사용 승인",
      tool_call_was_rejected: "도구 호출이 거부되었습니다.",
    },
  },
  profile_settings: {
    edit_account: "계정 정보 수정",
    profile_picture: "프로필 사진",
    remove_profile_picture: "프로필 사진 삭제",
    username: "사용자명",
    new_password: "새 비밀번호",
    password_description: "비밀번호는 최소 8자 이상이어야 합니다.",
    cancel: "취소",
    update_account: "계정 정보 업데이트",
    theme: "테마 설정",
    language: "선호 언어",
    failed_upload: "프로필 사진 업로드 실패: {{error}}",
    upload_success: "프로필 사진이 업로드되었습니다.",
    failed_remove: "프로필 사진 삭제 실패: {{error}}",
    profile_updated: "프로필이 업데이트되었습니다.",
    failed_update_user: "사용자 정보 업데이트 실패: {{error}}",
    account: "계정",
    support: "지원",
    signout: "로그아웃",
  },
  "keyboard-shortcuts": {
    title: "단축키 안내",
    shortcuts: {
      settings: "설정 열기",
      workspaceSettings: "현재 워크스페이스 설정 열기",
      home: "홈으로 이동",
      workspaces: "워크스페이스 관리",
      apiKeys: "API 키 설정",
      llmPreferences: "LLM 기본 설정",
      chatSettings: "채팅 설정",
      help: "단축키 도움말 보기",
      showLLMSelector: "워크스페이스 LLM 선택기 열기",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "성공!",
        success_description:
          "시스템 프롬프트가 커뮤니티 허브에 성공적으로 게시되었습니다!",
        success_thank_you: "커뮤니티에 공유해주셔서 감사합니다!",
        view_on_hub: "커뮤니티 허브에서 보기",
        modal_title: "시스템 프롬프트 게시",
        name_label: "이름",
        name_description: "시스템 프롬프트의 표시 이름입니다.",
        name_placeholder: "나의 시스템 프롬프트",
        description_label: "설명",
        description_description:
          "시스템 프롬프트의 목적이나 용도를 설명해 주세요.",
        tags_label: "태그",
        tags_description:
          "태그를 추가하면 시스템 프롬프트를 더 쉽게 검색할 수 있습니다. 여러 개의 태그를 추가할 수 있습니다. 최대 5개, 태그당 20자 이내로 입력해 주세요.",
        tags_placeholder: "태그 입력 후 Enter를 눌러 추가",
        visibility_label: "공개 범위",
        public_description: "공개 시스템 프롬프트는 모든 사용자에게 보입니다.",
        private_description: "비공개 시스템 프롬프트는 본인만 볼 수 있습니다.",
        publish_button: "커뮤니티 허브에 게시",
        submitting: "게시 중...",
        prompt_label: "프롬프트",
        prompt_description:
          "실제로 LLM을 안내하는 데 사용될 시스템 프롬프트를 입력하세요.",
        prompt_placeholder: "여기에 시스템 프롬프트를 입력하세요...",
      },
      agent_flow: {
        success_title: "성공!",
        success_description:
          "에이전트 플로우가 커뮤니티 허브에 성공적으로 게시되었습니다!",
        success_thank_you: "커뮤니티에 공유해주셔서 감사합니다!",
        view_on_hub: "커뮤니티 허브에서 보기",
        modal_title: "에이전트 플로우 게시",
        name_label: "이름",
        name_description: "에이전트 플로우의 표시 이름입니다.",
        name_placeholder: "나의 에이전트 플로우",
        description_label: "설명",
        description_description:
          "에이전트 플로우의 목적이나 용도를 설명해 주세요.",
        tags_label: "태그",
        tags_description:
          "태그를 추가하면 에이전트 플로우를 더 쉽게 검색할 수 있습니다. 여러 개의 태그를 추가할 수 있습니다. 최대 5개, 태그당 20자 이내로 입력해 주세요.",
        tags_placeholder: "태그 입력 후 Enter를 눌러 추가",
        visibility_label: "공개 범위",
        submitting: "게시 중...",
        submit: "커뮤니티 허브에 게시",
        privacy_note:
          "에이전트 플로우는 민감한 데이터를 보호하기 위해 항상 비공개로 업로드됩니다. 게시 후 커뮤니티 허브에서 공개 범위를 변경할 수 있습니다. 게시 전에 플로우에 민감하거나 개인 정보가 포함되어 있지 않은지 꼭 확인해 주세요.",
      },
      slash_command: {
        success_title: "성공!",
        success_description:
          "슬래시 커맨드가 커뮤니티 허브에 성공적으로 게시되었습니다!",
        success_thank_you: "커뮤니티에 공유해주셔서 감사합니다!",
        view_on_hub: "커뮤니티 허브에서 보기",
        modal_title: "슬래시 커맨드 게시",
        name_label: "이름",
        name_description: "슬래시 커맨드의 표시 이름입니다.",
        name_placeholder: "나의 슬래시 커맨드",
        description_label: "설명",
        description_description:
          "슬래시 커맨드의 목적이나 용도를 설명해 주세요.",
        tags_label: "태그",
        tags_description:
          "태그를 추가하면 슬래시 커맨드를 더 쉽게 검색할 수 있습니다. 여러 개의 태그를 추가할 수 있습니다. 최대 5개, 태그당 20자 이내로 입력해 주세요.",
        tags_placeholder: "태그 입력 후 Enter를 눌러 추가",
        visibility_label: "공개 범위",
        public_description: "공개 슬래시 커맨드는 모든 사용자에게 보입니다.",
        private_description: "비공개 슬래시 커맨드는 본인만 볼 수 있습니다.",
        publish_button: "커뮤니티 허브에 게시",
        submitting: "게시 중...",
        prompt_label: "프롬프트",
        prompt_description: "슬래시 커맨드가 실행될 때 사용될 프롬프트입니다.",
        prompt_placeholder: "여기에 프롬프트를 입력하세요...",
      },
      generic: {
        unauthenticated: {
          title: "인증 필요",
          description:
            "항목을 게시하려면 AnythingLLM 커뮤니티 허브에 인증해야 합니다.",
          button: "커뮤니티 허브에 연결",
        },
      },
    },
  },
  security: {
    title: "보안",
    multiuser: {
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
    },
    password: {
      title: "비밀번호 보호",
      description:
        "AnythingLLM 인스턴스를 비밀번호로 보호하십시오. 이 비밀번호를 잊어버리면 복구 방법이 없으므로 반드시 저장하세요.",
      "password-label": "인스턴스 비밀번호",
    },
  },
  home: {
    welcome: "환영합니다",
    chooseWorkspace: "워크스페이스를 선택하여 채팅을 시작하세요!",
    notAssigned:
      "현재 워크스페이스에 할당되지 않았습니다.\n워크스페이스에 대한 접근을 요청하려면 관리자에게 문의하세요.",
    goToWorkspace: '워크스페이스로 이동 "{{workspace}}"',
  },
  telegram: {
    title: "텔레그램 봇",
    description:
      "AnyLLM 인스턴스를 Telegram과 연결하여, 어떤 기기에서든 워크스페이스와 채팅할 수 있도록 합니다.",
    setup: {
      step1: {
        title: "1단계: 텔레그램 봇을 만드세요",
        description:
          "텔레그램에서 @BotFather를 열고, <code>/newbot</code>를 <code>@BotFather</code>에게 보내고, 안내에 따라 진행하여 API 토큰을 복사합니다.",
        "open-botfather": "BotFather 시작",
        "instruction-1": "1. 링크를 열거나 QR 코드를 스캔",
        "instruction-2":
          "2. <code>/newbot</code>를 <code>@BotFather</code>에게 전송",
        "instruction-3": "3. 봇의 이름과 사용자 이름을 선택하세요.",
        "instruction-4": "4. 받은 API 토큰을 복사합니다.",
      },
      step2: {
        title: "2단계: 봇을 연결합니다.",
        description:
          "@BotFather로부터 받은 API 토큰을 복사하여, 봇이 채팅할 기본 워크스페이스를 선택하세요.",
        "bot-token": "봇 토큰",
        "default-workspace": "기본 워크스페이스",
        "no-workspace":
          "사용 가능한 작업 공간이 없습니다. 새로운 작업 공간이 생성될 것입니다.",
        connecting: "연결 중...",
        "connect-bot": "연결 봇",
      },
      security: {
        title: "권장 보안 설정",
        description:
          "추가적인 보안을 위해, @BotFather에서 다음 설정을 구성해 주세요.",
        "disable-groups": "— 그룹에 봇 추가 방지",
        "disable-inline": "— 인라인 검색에서 봇 사용을 방지",
        "obscure-username":
          "자명한 봇 사용자 이름을 피하고, 발견 가능성을 줄이기 위해",
      },
      "toast-enter-token": "봇 토큰을 입력해 주세요.",
      "toast-connect-failed": "봇 연결에 실패했습니다.",
    },
    connected: {
      status: "연결된",
      "status-disconnected":
        "연결되지 않음 – 토큰이 만료되었거나 유효하지 않을 수 있습니다",
      "placeholder-token": "새로운 봇 토큰을 붙여넣으세요...",
      reconnect: "재 연결",
      workspace: "업무 공간",
      "bot-link": "봇 링크",
      "voice-response": "음성 응답",
      disconnecting: "연결 해제 중...",
      disconnect: "연결 해제",
      "voice-text-only": "텍스트만",
      "voice-mirror": "(사용자가 음성으로 응답하면, 음성으로 답변)",
      "voice-always": "항상 음성 메시지 (답변과 함께 오디오 전송)",
      "toast-disconnect-failed": "봇과의 연결을 해제하는 데 실패했습니다.",
      "toast-reconnect-failed": "봇과의 연결에 실패했습니다.",
      "toast-voice-failed": "음성 모드 업데이트에 실패했습니다.",
      "toast-approve-failed": "사용자 승인에 실패했습니다.",
      "toast-deny-failed": "사용자에게 거부 권한을 부여하지 못함.",
      "toast-revoke-failed": "사용자 계정 삭제에 실패했습니다.",
    },
    users: {
      "pending-title": "승인 대기 중",
      "pending-description":
        "승인 대기 중인 사용자. 여기 표시된 매칭 코드를 자신의 Telegram 채팅에서 표시된 코드로 일치시켜 주세요.",
      "approved-title": "승인된 사용자",
      "approved-description": "당신의 봇과 대화할 수 있도록 승인된 사용자.",
      user: "사용자",
      "pairing-code": "코드 매칭",
      "no-pending": "처리 중인 요청이 없습니다.",
      "no-approved": "승인된 사용자가 없습니다",
      unknown: "알 수 없음",
      approve: "승인",
      deny: "부인",
      revoke: "취소",
    },
  },
};

export default TRANSLATIONS;
