// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
    onboarding: {
      survey: {
        email: "이메일 주소를 입력하세요.",
        useCase: "A-Insight를 어떤 용도로 사용하시나요?",
        useCaseWork: "업무용",
        useCasePersonal: "개인용",
        useCaseOther: "기타",
        comment: "A-Insight를 어떻게 알게 되셨나요?",
        commentPlaceholder: "Reddit, Twitter, GitHub, YouTube 등 - 어떻게 찾았는지 알려주세요",
        skip: "설문조사 건너뛰기",
        thankYou: "피드백을 제공해 주셔서 감사합니다!",
        title: "A-Insight에 오신 것을 환영합니다.",
        description: "A-Insight를 사용자 맞춤형으로 개선할 수 있도록 합니다.(선택 사항)",
      },
      home: {
        title: "환영합니다",
        getStarted: "시작하기",
      },
      llm: {
        title: "LLM 환경 설정",
        description: "A-Insight는 다양한 LLM 제공자와 함께 작동할 수 있습니다. 이 서비스는 채팅을 처리하는 역할을 합니다.",
      },
      userSetup: {
        title: "사용자 설정",
        description: "사용자 설정을 구성하세요.",
        howManyUsers: "이 인스턴스를 몇 명이 사용할 예정인가요?",
        justMe: "개인",
        myTeam: "팀",
        instancePassword: "인스턴스 비밀번호",
        setPassword: "비밀번호를 설정하시겠습니까?",
        passwordReq: "비밀번호는 최소 8자 이상이어야 합니다.",
        passwordWarn: "비밀번호는 복구할 수 없으므로 반드시 저장하세요.",
        adminUsername: "관리자 계정 사용자 이름",
        adminUsernameReq: "사용자 이름은 최소 6자 이상이어야 하며 소문자, 숫자, 밑줄(_), 하이픈(-)만 포함할 수 있으며 공백이 없어야 합니다.",
        adminPassword: "관리자 계정 비밀번호",
        adminPasswordReq: "비밀번호는 최소 8자 이상이어야 합니다.",
        teamHint: "당신은 기본 관리자가 됩니다. 온보딩 완료 후 다른 사람을 사용자 또는 관리자로 만들고 초대할 수 있습니다. 비밀번호를 잃어버리면 관리자만 비밀번호를 재설정할 수 있습니다.",
      },
      data: {
        title: "데이터 처리 및 개인정보 보호",
        description: "당사는 개인 데이터의 투명성과 제어에 최선을 다하고 있습니다.",
        settingsHint: "이 설정은 언제든지 설정에서 다시 구성할 수 있습니다.",
      },
      workspace: {
        title: "첫 번째 워크스페이스 생성",
        description: "첫 번째 워크스페이스를 만들고 A-Insight를 시작하세요.",
      },
    },
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
      optional: "선택 사항",
      yes: "예",
      no: "아니요",
      cancel: "취소",
    },
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
      save: "저장"
    },
    "workspaces—settings": {
      general: "일반 설정",
      chat: "채팅 설정",
      vector: "벡터 데이터베이스",
      members: "구성원",
      agent: "에이전트 구성",
    },
    thread: {
      rename: "이름 변경",
      thread_rename: "이 스레드의 이름을 무엇으로 바꾸시겠습니까?",
      delete: "스레드 삭제",
      deleted: "삭제된 스레드",
      delete_confirm: "이 스레드를 정말 삭제하시겠습니까? 모든 대화가 삭제됩니다. 이 작업은 취소할 수 없습니다.",
      creating: "스레드 생성 중...",
      add: "새 스레드 생성",
    },
    welcomeMessage: {
      part1:
        "A-Insight에 오신 것을 환영합니다. A-Insight은 Mintplex Labs에서 개발한 오픈 소스 AI 도구로, 어떤 것이든 훈련된 챗봇으로 변환하여 쿼리하고 대화할 수 있습니다. A-Insight은 BYOK(Bring Your Own Key) 소프트웨어이므로 사용하려는 서비스 외에는 구독료나 기타 비용이 없습니다.",
      part2:
        "A-Insight은 OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB 등 강력한 AI 제품을 번거로움 없이 깔끔하게 패키지로 묶어 생산성을 100배 향상시키는 가장 쉬운 방법입니다.",
      part3:
        "A-Insight은 로컬 컴퓨터에서 완전히 작동하며, 거의 리소스를 사용하지 않으므로 존재조차 느끼지 못할 것입니다! GPU가 필요하지 않습니다. 클라우드 및 온프레미스 설치도 가능합니다.\nAI 도구 생태계는 날로 강력해지고 있습니다. A-Insight은 이를 쉽게 사용할 수 있게 해줍니다.",
      githubIssue: "GitHub에 이슈 생성하기",
      user1: "어떻게 시작하나요?!",
      part4:
        '간단합니다. 모든 컬렉션은 "워크스페이스"라고 부르는 버킷으로 구성됩니다. 워크스페이스는 문서, 이미지, PDF 및 기타 파일의 버킷으로, LLM이 이해하고 대화에서 사용할 수 있는 형태로 변환합니다.\n\n언제든지 파일을 추가하고 삭제할 수 있습니다.',
      createWorkspace: "첫 번째 워크스페이스 생성하기",
      user2:
        "이것은 AI 드롭박스와 같은 건가요? 채팅은 어떤가요? 이건 챗봇 아닌가요?",
      part5:
        "A-Insight은 더 스마트한 Dropbox 이상의 것입니다.\n\nA-Insight은 데이터와 대화할 수 있는 두 가지 방법을 제공합니다:\n\n<i>쿼리:</i> 워크스페이스 내 문서에서 찾아낸 데이터나 추론 결과만 채팅으로 제공합니다. 워크스페이스에 문서를 더 많이 추가할수록 더 똑똑해집니다!\n\n<i>대화:</i> 문서와 실시간 채팅 기록이 동시에 LLM의 지식에 기여합니다. 실시간 텍스트 정보나 LLM의 오해를 바로잡는 데 매우 유용합니다.\n\n채팅 중간에 <i>모드를 전환할 수 있습니다!</i>",
      user3: "와, 이거 정말 놀랍네요, 당장 사용해보고 싶어요!",
      part6: "즐기세요!",
      starOnGitHub: "GitHub에 별표 달기",
      contact: "Mintplex Labs에 연락하기",
    },
    general: {
      vector: {
        title: "벡터 수",
        description: "벡터 데이터베이스에 있는 총 벡터 수입니다.",
      },
      names: {
        description: "이것은 워크스페이스의 표시 이름만 변경합니다.",
        placeholder: "내 워크스페이스",
        updating: "업데이트 중...",
        update: "워크스페이스 업데이트"
      },
      message: {
        title: "제안된 채팅 메시지",
        description: "워크스페이스 사용자가 사용할 메시지를 수정합니다.",
        add: "새 메시지 추가",
        save: "메시지 저장",
        heading: "저에게 설명해주세요",
        body: "A-Insight의 장점",
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
          "워크스페이스 전체를 삭제합니다. 이 작업은 벡터 데이터베이스에 있는 모든 벡터 임베딩을 제거합니다.\n\n원본 소스 파일은 그대로 유지됩니다. 이 작업은 취소할 수 없습니다.",
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
          "이 워크스페이스의 벡터 데이터베이스를 재설정하려고 합니다. 현재 임베딩된 모든 벡터 임베딩을 제거합니다.\n\n원본 소스 파일은 그대로 유지됩니다. 이 작업은 취소할 수 없습니다.",
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
    recorded: {
      title: "워크스페이스 채팅",
      description:
        "이것들은 사용자들이 보낸 모든 채팅과 메시지입니다. 생성 날짜별로 정렬되어 있습니다.",
      export: "내보내기",
      clear: "대화 삭제",
      clear_confirm: "모든 대화를 삭제하시겠습니까?\n\n이 작업은 취소할 수 없습니다.",
      table: {
        id: "ID",
        by: "보낸 사람",
        workspace: "워크스페이스",
        prompt: "프롬프트",
        response: "응답",
        at: "보낸 시각",
      },
      next: "다음 페이지",
      previous: "이전 페이지",
      delete: "이 채팅을 정말 삭제하시겠습니까?\n\n이 작업은 취소할 수 없습니다."
    },

    stt: {
      title: "STT(Speech-to-text) 기본 설정",
      description: "A-Insight에서 사용할 TTS 및 STT 제공자를 지정할 수 있습니다. 기본적으로 브라우저에 내장된 기능을 사용하지만 다른 서비스를 사용할 수도 있습니다.",
      provider: {
        title: "제공자",
        system_native: {
          description: "지원되는 경우 브라우저에 내장된 STT 서비스를 사용합니다.",
          explained: "이 제공자를 사용할 때는 별도의 설정이 필요하지 않습니다."
        }
      },
      save: "변경 사항 저장",
      saving: "저장 중...",
      search: "STT 제공자 검색"
    },
    tts: {
      title: "TTS(Text-to-speech) 설정",
      description: "A-Insight에서 사용할 TTS 제공자를 지정할 수 있습니다. 기본적으로 브라우저에 내장된 기능을 사용하지만 다른 서비스를 선택하여 사용할 수도 있습니다.",
      provider: {
        title: "제공자",
        system_native: {
          description: "지원되는 경우 브라우저에 내장된 TTS 서비스를 사용합니다.",
          explained: "이 제공자를 사용할 때는 별도의 설정이 필요하지 않습니다.",
        },
        openai: {
          description: "OpenAI의 TTS 음성을 사용합니다.",
          api: "API 키",
          voice: "음성 모델"
        },
        elevenlabs: {
          description: "ElevenLabs의 TTS 음성과 기술을 사용합니다.",
          api: "API 키",
          chat: "채팅 모델 선택"
        },
        pipertts: {
          description: "브라우저에서 로컬로 TTS 모델을 비공개로 실행합니다.",
          explained : "모든 PiperTTS 모델은 브라우저에서 로컬로 실행됩니다. 저사양 기기에서는 리소스를 많이 사용할 수 있습니다.",
          voice: "음성 모델 선택",
          play: "샘플 재생",
          loading: "음성 로딩 중",
          stop: "데모 중지"
        },
        openai_compatible: {
          description: "로컬 또는 원격으로 실행되는 OpenAI 호환 TTS 서비스와 연결합니다.",        
          base_url: "기본 URL",
          base_url_explained: "이 URL은 TTS 응답을 생성할 OpenAI compatible TTS 서비스의 기본 URL 이어야 합니다.",
          api: "API 키",
          api_explained: "일부 TTS 서비스는 TTS 응답을 생성하기 위해 API 키가 필요하지만, 서비스에 키가 필요하지 않은 경우에는 선택 사항입니다.",
          voice: "음성 모델",
          voice_placeholder: "음성 모델 식별자",
          voice_explained: "대부분의 TTS 서비스는 여러 음성 모델을 제공합니다. 사용하려는 음성 모델의 식별자를 입력하세요."
        }
      },
      save: "변경 사항 저장",
      saving: "저장 중...",
      search: "TTS 제공자 검색",
    },

    appearance: {
      title: "외관",
      description: "플랫폼의 외관 설정을 수정합니다.",
      theme: {
        title: "테마",
        description: "애플리케이션에서 선호하는 테마를 선택합니다.",
        default: "기본",
        light: "라이트"
      },
      language: {
        title: "언어 설정",
        description: "A-Insight의 기본 언어를 선택합니다."
      },
      align: {
        title: "채팅 메시지 정렬",
        description: "채팅방에서 메시지 정렬 방식을 선택합니다.",
        left_explained: "사용자 및 AI 메시지가 왼쪽에 정렬됩니다(기본값)",
        left_right_explained: "사용자와 AI 메시지가 좌우로 번갈아 가며 정렬됩니다."
      },
      scrollbar: {
        title: "채팅 창 스크롤바 표시",
        description: "채팅방에서 스크롤바를 활성화하거나 비활성화합니다."
      },  
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
        assistant: "A-Insight 채팅 어시스턴트",
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
    api: {
      title: "API 키",
      description:
        "API 키는 소유자가 프로그래밍 방식으로 이 A-Insight 인스턴스에 액세스하고 관리할 수 있도록 합니다.",
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
        "이것은 채팅과 임베딩을 하기 위한 선호하는 LLM 제공자의 인증입니다. 이 키가 현재 활성 상태이고 정확해야 A-Insight이 제대로 작동합니다.",
      provider: "LLM 제공자",
    },
    transcription: {
      title: "텍스트 변환 모델 기본 설정",
      description:
        "이것은 선호하는 텍스트 변환 모델 제공자의 인증입니다. 이 키가 현재 활성 상태이고 정확해야 미디어 파일 및 오디오가 텍스트 변환됩니다.",
      provider: "텍스트 변환 제공자",
      "warn-start":
        "RAM 또는 CPU 성능이 제한된 머신에서 로컬 위스퍼 모델을 사용하면 미디어 파일을 처리할 때 A-Insight이 중단될 수 있습니다.",
      "warn-recommend": "최소 2GB RAM과 10Mb 보다 작은 파일 업로드를 권장합니다.",
      "warn-end": "내장된 모델은 첫 번째 사용 시 자동으로 다운로드됩니다.",
    },
    embedding: {
      title: "임베딩 기본 설정",
      "desc-start":
        "임베딩 엔진을 지원하지 않는 LLM을 사용할 때 텍스트를 임베딩하는 데 다른 임베딩 엔진 제공자의 인증이 필요할 수 있습니다.",
      "desc-end":
        "임베딩은 텍스트를 벡터로 변환하는 과정입니다. 파일과 프롬프트를 A-Insight이 처리할 수 있는 형식으로 변환하려면 이러한 인증이 필요합니다.",
      provider: {
        title: "임베딩 제공자",
        description:
          "A-Insight의 기본 임베딩 엔진을 사용할 때는 설정이 필요하지 않습니다.",
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
    vector: {
      title: "벡터 데이터베이스",
      description:
        "이것은 A-Insight 인스턴스가 벡터 데이터베이스 사용을 위한 인증 설정입니다. 이 키가 활성 상태이고 정확해야 합니다.",
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
        username_placeholder: "관리자 사용자 이름",
        password: "관리자 계정 비밀번호",
        password_placeholder: "관리자 비밀번호"
      },
      password: {
        title: "비밀번호 보호",
        description:
          "A-Insight 인스턴스를 비밀번호로 보호하십시오. 이 비밀번호를 잊어버리면 복구 방법이 없으므로 반드시 저장하세요.",
      },
      instance: {
        title: "인스턴스 비밀번호 보호",
        description:
          "당신은 기본 관리자가 됩니다. 관리자로서 모든 신규 사용자 또는 관리자의 계정을 생성해야 합니다. 비밀번호를 잃어버리면 관리자만 비밀번호를 재설정할 수 있습니다.",
        password: "인스턴스 비밀번호",
        password_placeholder: "인스턴스 비밀번호"
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

    dnd_upload: {
      anything: "파일 추가",
      image: "이미지 추가",
      file_upload_explained_start: "여기에 파일을 끌어다 놓으면",
      file_upload_explained_end: "자동으로 워크스페이스에 추가됩니다.",
      image_upload_explained_start: "여기에 이미지 파일을 업로드하면",
      image_upload_explained_end: "자동으로 채팅이 시작됩니다."
    },

    preset: {
      reset_explained: "채팅 기록을 삭제하고 새 채팅 시작하기",
      add: "새 프리셋 추가하기",
      edit: "프리셋 편집하기",
      
      fields: {
        command: {
          title: "커맨드",
          placeholder: "커맨드"
        },
        prompt: {
          title: "프롬프트",
          placeholder: "프롬프트 앞에 입력되는 내용입니다."
        },
        description: {
          title: "설명",
          placeholder: "LLM에 대한 내용으로 응답합니다."
        }
      },
      delete: "삭제",
      deleting: "삭제 중...",
      delete_confirm: "프리셋을 삭제하시겠습니까?"
    },

    new_folder: {
      title: "새 폴더 생성",
      folder: "폴더 이름",
      placeholder: "폴더명을 입력하세요.",
      create: "폴더 생성"
    },

    privacy: {
      title: "개인정보와 데이터 처리",
      description:
        "연결된 타사 제공자와 A-Insight이 데이터를 처리하는 방식을 구성합니다.",
      llm: "LLM 선택",
      embedding: "임베딩 기본 설정",
      vector: "벡터 데이터베이스",
      anonymous: "익명 원격 분석 활성화",
    },
    connectors: {
      "search-placeholder": "데이터 커넥터 검색",
      "no-connectors": "데이터 커넥터를 찾을 수 없습니다.",
      github: {
        name: "Github 저장소",
        description: "단 한 번의 클릭으로 전체 공개 또는 비공개 GitHub 저장소를 가져옵니다.",
        URL: "GitHub 저장소 URL",
        URL_explained: "수집하려는 GitHub 저장소의 URL입니다.",
        token: "GitHub 액세스 토큰",
        optional: "선택 사항",
        token_explained: "속도 제한을 방지하기 위한 액세스 토큰입니다.",
        token_explained_start: "",
        token_explained_link1: "개인 액세스 토큰",
        token_explained_middle: "이 없으면, GitHub API가 파일 수집을 제한할 수 있습니다.",
        token_explained_link2: "임시 액세스 토큰을 생성",
        token_explained_end: "하여 이 문제를 방지할 수 있습니다.",
        ignores: "무시할 파일",
        git_ignore: ".gitignore 형식으로 특정 파일을 수집에서 제외합니다. 저장하려면 각 항목 입력 후 Enter를 누르세요.",
        task_explained: "수집이 완료되면 모든 파일이 문서 선택기에서 워크스페이스에 삽입할 수 있도록 제공됩니다.",
        branch: "파일을 수집할 브랜치를 선택하세요.",
        branch_loading: "-- 사용 가능한 브랜치를 불러오는 중 --",
        branch_explained: "파일을 수집할 브랜치를 선택하세요.",
        token_information: "<b>GitHub 액세스 토큰</b>을 입력하지 않으면, GitHub의 공용 API 속도 제한으로 인해 저장소의 <b>최상위</b> 파일만 수집할 수 있습니다.",
        token_personal: "여기에서 GitHub 계정으로 무료 개인 액세스 토큰을 얻을 수 있습니다.",
      },
      gitlab: {
        name: "GitLab 저장소",
        description: "단 한 번의 클릭으로 전체 공개 또는 비공개 GitLab 저장소를 가져옵니다.",
        URL: "GitLab 저장소 URL",
        URL_explained: "수집하려는 GitLab 저장소의 URL입니다.",
        token: "GitLab 액세스 토큰",
        optional: "선택 사항",
        token_explained: "속도 제한을 방지하기 위한 액세스 토큰입니다.",
        token_description: "GitLab API에서 추가로 가져올 항목을 선택합니다.",
        token_explained_start: "",
        token_explained_link1: "개인 액세스 토큰",
        token_explained_middle: "이 없으면, GitLab API가 파일 수집을 제한할 수 있습니다.",
        token_explained_link2: "임시 액세스 토큰을 생성",
        token_explained_end: "하여 이 문제를 방지할 수 있습니다.",
        fetch_issues: "이슈를 문서로 가져오기",
        ignores: "무시할 파일",
        git_ignore: ".gitignore 형식으로 특정 파일을 수집에서 제외합니다. 저장하려면 각 항목 입력 후 Enter를 누르세요.",
        task_explained: "수집이 완료되면 모든 파일이 문서 선택기에서 워크스페이스에 삽입할 수 있도록 제공됩니다.",
        branch: "파일을 수집할 브랜치를 선택하세요.",
        branch_loading: "-- 사용 가능한 브랜치를 불러오는 중 --",
        branch_explained: "파일을 수집할 브랜치를 선택하세요.",
        token_information: "<b>GitLab 액세스 토큰</b>을 입력하지 않으면, GitLab의 공용 API 속도 제한으로 인해 저장소의 <b>최상위</b> 파일만 수집할 수 있습니다.",
        token_personal: "여기에서 GitLab 계정으로 무료 개인 액세스 토큰을 얻을 수 있습니다.",
      },
      youtube: {
        name: "YouTube 자막 가져오기",
        description: "YouTube 동영상의 전체 자막을 링크로 가져옵니다.",
        URL: "YouTube 동영상 URL",
        URL_explained_start: "YouTube 동영상의 URL을 입력하세요. 동영상에는 ",
        URL_explained_link: "자동 자막",
        URL_explained_end: "이 활성화되어 있어야 합니다.",
        task_explained:
          "수집이 완료되면, 문서 선택기에서 워크스페이스에 삽입할 수 있도록 제공됩니다.",
        language: "자막 언어",
        language_explained: "수집하려는 자막의 언어를 선택하세요.",
        loading_languages: "-- 사용 가능한 언어 불러오는 중 --",
      },
      "website-depth": {
        name: "대량 링크 스크래퍼",
        description: "웹사이트와 해당 하위 링크를 특정 깊이까지 스크랩합니다.",
        URL: "웹사이트 URL",
        URL_explained: "스크랩할 웹사이트의 URL입니다.",
        depth: "크롤링 깊이",
        depth_explained: "원본 URL에서 팔로우해야 하는 하위 링크 수입니다.",
        max_pages: "최대 페이지 수",
        max_pages_explained: "스크랩할 최대 링크 수입니다.",
        task_explained: "스크랩이 완료되면 모든 콘텐츠가 문서 선택기에서 워크스페이스에 삽입할 수 있도록 제공됩니다.",
      },
      confluence: {
        name: "Confluence",
        description: "단 한 번의 클릭으로 전체 Confluence 페이지를 가져옵니다.",
        deployment_type: "Confluence 배포 유형",
        deployment_type_explained:
          "사용 중인 Confluence 인스턴스가 Atlassian 클라우드에 호스팅되어 있는지, 또는 자체 호스팅인지 선택하세요.",
        base_url: "Confluence 기본 URL",
        base_url_explained: "Confluence 스페이스의 기본 URL입니다.",
        space_key: "Confluence 스페이스 키",
        space_key_explained: "Confluence 인스턴스의 스페이스 키로 사용됩니다. 일반적으로 ~로 시작합니다.",
        username: "Confluence 사용자 이름",
        username_explained: "Confluence 사용자 이름입니다.",
        auth_type: "Confluence 인증 유형",
        auth_type_explained: "Confluence 페이지에 액세스하는데 사용할 인증 유형을 선택하세요.",
        auth_type_username: "사용자 이름 및 액세스 토큰",
        auth_type_personal: "개인 액세스 토큰",
        token: "Confluence 액세스 토큰",
        token_explained_start: "인증을 위해 액세스 토큰이 필요합니다. ",
        token_explained_link: "여기서",
        token_desc: "인증을 위한 액세스 토큰입니다.",
        pat_token: "Confluence 개인 액세스 토큰",
        pat_token_explained: "Confluence 개인 액세스 토큰입니다.",
        task_explained:
          "수집이 완료되면 문서 선택기에서 워크스페이스에 삽입할 수 있도록 제공됩니다.",
      },
      manage: {
        documents: "문서",
        "data-connectors": "데이터 커넥터",
        "desktop-only":
          "이 설정을 편집하려면 데스크톱 기기에서 접속해야 합니다. 계속하려면 데스크톱에서 이 페이지를 열어주세요.",
        dismiss: "닫기",
        editing: "편집 중",
      },
      directory: {
        "my-documents": "내 문서",
        "new-folder": "새 폴더",
        "search-document": "문서 검색",
        "no-documents": "문서 없음",
        "move-workspace": "워크스페이스로 이동",
        name: "이름",
        "delete-confirmation":
          "이 파일 및 폴더를 삭제하시겠습니까?\n이 작업을 수행하면 시스템에서 파일이 제거되며, 기존 워크스페이스에서도 자동으로 삭제됩니다.\n이 작업은 취소할 수 없습니다.",
        "removing-message":
          "{{count}}개의 문서 및 {{folderCount}}개의 폴더를 삭제하는 중입니다. 잠시만 기다려 주세요.",
        "move-success": "{{count}}개의 문서를 성공적으로 이동했습니다.",
        date: "날짜",
        type: "유형",
        no_docs: "문서 없음",
        select_all: "전체 선택",
        deselect_all: "전체 선택 해제",
        remove_selected: "선택 항목 삭제",
        costs: "*한 번만 부과되는 임베딩 비용",
        save_embed: "저장 및 임베딩",
      },
      upload: {
        "processor-offline": "문서 프로세서를 사용할 수 없습니다.",
        "processor-offline-desc":
          "문서 처리기가 오프라인 상태이므로 지금 파일을 업로드할 수 없습니다. 나중에 다시 시도해 주세요.",
        "click-upload": "클릭하여 업로드하거나 파일을 끌어다 놓으세요",
        "file-types":
          "텍스트 파일, CSV, 스프레드시트, 오디오 파일 등을 지원합니다.",
        "or-submit-link": "또는 링크 제출",
        "placeholder-link": "https://example.com",
        fetching: "가져오는 중...",
        "fetch-website": "웹사이트 가져오기",
        scraping: "링크에서 스크랩 중...",
        "privacy-notice":
          "이 파일들은 A-Insight 인스턴스에서 실행 중인 문서 프로세서에 업로드되며, 타사에 전송되거나 공유되지 않습니다.",
      },
      pinning: {
        what_pinning: "문서 고정이란?",
        pin: "워크스페이스에 고정",
        unpin: "워크스페이스에 고정 해제",
        pin_explained_block1:
          "A-Insight에 문서를 <b>고정</b>하면 LLM이 완전히 이해할 수 있도록 문서의 전체 내용을 프롬프트 창에 삽입합니다.",
        pin_explained_block2:
          "이는 <b>대규모 컨텍스트 모델</b>이나 작은 파일에서 가장 잘 작동합니다.",
        pin_explained_block3:
          "기본적으로 A-Insight에서 원하는 답변을 얻지 못하는 경우, 문서를 고정하면 한 번의 클릭으로 더 정확한 답변을 받을 수 있습니다.",
        accept: "확인했습니다",
        remove: "워크스페이스에서 문서 제거"
      },
      watching: {
        what_watching: "문서 모니터링이란?",
        watch_explained_block1:
          "A-Insight에서 문서를 <b>모니터링</b>하면 해당 원본 문서에서 주기적으로 문서 내용을 <i>자동으로</i> 동기화합니다. 이렇게 하면 해당 파일이 관리되는 모든 워크스페이스가 자동으로 업데이트됩니다.",
        watch_explained_block2:
          "이 기능은 현재 온라인 기반 콘텐츠만 지원하며, 수동으로 업로드한 문서에는 사용할 수 없습니다.",
        watch_explained_block3_start:
          "모니터링 중인 문서는 ",
        watch_explained_block3_link: "파일 관리자",
        watch_explained_block3_end: "에서 관리할 수 있습니다.",
        accept: "확인했습니다",
      },
    },
    chat_window: {
      welcome: "새 워크스페이스에 오신 것을 환영합니다.",
      get_started: "시작하려면",
      get_started_default: "시작하려면",
      upload: "문서를 업로드",
      or: "하거나",
      send_chat: "채팅을 시작하세요.",
      send_message: "메시지 보내기",
      attach_file: "파일 업로드",
      slash: "사용 가능한 슬래시 명령어 보기",
      agents: "사용 가능한 채팅 에이전트 보기",
      text_size: "글씨 크기 변경",
      microphone: "음성 입력",
      micro_alert: "A-Insight는 마이크에 액세스할 수 없습니다. 해당 사이트에서 이 기능을 사용하도록 설정해 주세요.",
      send: "워크스페이스에 프롬프트 전송",
    },
    action: {
      copy: "복사",
      edit: "수정",
      response: "응답",
      prompt: "프롬프트",
      good: "좋은 응답",
      regenerate: "응답 다시 생성",
      stop_regenerate: "응답 생성 중지",
      save: "저장 및 제출",
      cancel: "취소",
      more: "추가 작업",
      fork: "포크",
      delete: "삭제",
      show_citations: "인용 표시",
      hide_citations: "인용 숨기기",
      tts: "음성으로 듣기",
      tts_stop: "음성으로 듣기 중지",
      hover_to_show: "마우스를 올리면 메트릭이 표시되도록 설정하려면 클릭하세요",
      auto_show: "메트릭을 즉시 표시하려면 클릭하세요",
      hide_sidebar: "사이드바 숨기기",
      show_sidebar: "사이드바 표시",
      setting_page: "설정으로 이동",
      workspace_page: "워크스페이스로 이동"
    },
    text_size: {
      small: "작게",
      normal: "보통",
      large: "크게"
    },
    profile_settings: {
      edit_account: "계정 수정",
      profile_picture: "프로필 사진",
      remove_profile_picture: "프로필 사진 삭제",
      username: "사용자 이름",
      username_description: "사용자 이름은 소문자, 숫자, 밑줄(_), 하이픈(-)만 포함할 수 있으며, 공백 없이 입력해야 합니다.",
      new_password: "새 비밀번호",
      passwort_description: "비밀번호는 최소 8자 이상이어야 합니다.",
      cancel: "취소",
      update_account: "계정 업데이트",
      theme: "테마",
      language: "선호하는 언어",
    }
  };
  
  export default TRANSLATIONS;
  