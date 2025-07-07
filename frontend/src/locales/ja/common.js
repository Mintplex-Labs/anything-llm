// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "ようこそ",
      getStarted: "はじめる",
    },
    llm: {
      title: "LLMの設定",
      description:
        "AnythingLLMは多くのLLMプロバイダーと連携できます。これがチャットを処理するサービスになります。",
    },
    userSetup: {
      title: "ユーザー設定",
      description: "ユーザー設定を構成します。",
      howManyUsers: "このインスタンスを使用するユーザー数は？",
      justMe: "自分だけ",
      myTeam: "チーム",
      instancePassword: "インスタンスパスワード",
      setPassword: "パスワードを設定しますか？",
      passwordReq: "パスワードは8文字以上である必要があります。",
      passwordWarn:
        "このパスワードを保存することが重要です。回復方法はありません。",
      adminUsername: "管理者アカウントのユーザー名",
      adminUsernameReq:
        "ユーザー名は6文字以上で、小文字の英字、数字、アンダースコア、ハイフンのみを含む必要があります。スペースは使用できません。",
      adminPassword: "管理者アカウントのパスワード",
      adminPasswordReq: "パスワードは8文字以上である必要があります。",
      teamHint:
        "デフォルトでは、あなたが唯一の管理者になります。オンボーディングが完了した後、他のユーザーや管理者を作成して招待できます。パスワードを紛失しないでください。管理者のみがパスワードをリセットできます。",
    },
    data: {
      title: "データ処理とプライバシー",
      description:
        "個人データに関して透明性とコントロールを提供することをお約束します。",
      settingsHint: "これらの設定は、設定画面でいつでも再構成できます。",
    },
    survey: {
      title: "AnythingLLMへようこそ",
      description:
        "AnythingLLMをあなたのニーズに合わせて構築するためにご協力ください。任意です。",
      email: "メールアドレスは何ですか？",
      useCase: "AnythingLLMを何に使用しますか？",
      useCaseWork: "仕事用",
      useCasePersonal: "個人用",
      useCaseOther: "その他",
      comment: "AnythingLLMをどのように知りましたか？",
      commentPlaceholder:
        "Reddit、Twitter、GitHub、YouTubeなど - どのように見つけたか教えてください！",
      skip: "アンケートをスキップ",
      thankYou: "フィードバックありがとうございます！",
    },
    workspace: {
      title: "最初のワークスペースを作成する",
      description:
        "最初のワークスペースを作成して、AnythingLLMを始めましょう。",
    },
  },
  common: {
    "workspaces-name": "ワークスペース名",
    error: "エラー",
    success: "成功",
    user: "ユーザー",
    selection: "モデル選択",
    saving: "保存中...",
    save: "変更を保存",
    previous: "前のページ",
    next: "次のページ",
    optional: "任意",
    yes: "はい",
    no: "いいえ",
  },
  settings: {
    title: "インスタンス設定",
    system: "一般設定",
    invites: "招待",
    users: "ユーザー",
    workspaces: "ワークスペース",
    "workspace-chats": "ワークスペースチャット",
    customization: "カスタマイズ",
    "api-keys": "開発者API",
    llm: "LLM",
    transcription: "文字起こし",
    embedder: "埋め込みエンジン",
    "text-splitting": "テキスト分割とチャンク化",
    "voice-speech": "音声とスピーチ",
    "vector-database": "ベクターデータベース",
    embeds: "チャット埋め込み",
    "embed-chats": "チャット埋め込み履歴",
    security: "セキュリティ",
    "event-logs": "イベントログ",
    privacy: "プライバシーとデータ",
    "ai-providers": "AIプロバイダー",
    "agent-skills": "エージェントスキル",
    admin: "管理者",
    tools: "ツール",
    "system-prompt-variables": "システムプロンプト変数",
    "experimental-features": "実験的機能",
    contact: "サポートに連絡",
    "browser-extension": "ブラウザ拡張",
    interface: null,
    branding: null,
    chat: null,
  },
  login: {
    "multi-user": {
      welcome: "ようこそ",
      "placeholder-username": "ユーザー名",
      "placeholder-password": "パスワード",
      login: "ログイン",
      validating: "検証中...",
      "forgot-pass": "パスワードを忘れた",
      reset: "リセット",
    },
    "sign-in": {
      start: "サインインして",
      end: "アカウントにアクセスします。",
    },
    "password-reset": {
      title: "パスワードリセット",
      description:
        "以下に必要な情報を入力してパスワードをリセットしてください。",
      "recovery-codes": "回復コード",
      "recovery-code": "回復コード {{index}}",
      "back-to-login": "ログイン画面に戻る",
    },
  },
  welcomeMessage: {
    part1:
      "AnythingLLMへようこそ。AnythingLLMはMintplex LabsによるオープンソースのAIツールで、あらゆるものをトレーニングされたチャットボットに変換し、クエリやチャットが可能です。AnythingLLMはBYOK（Bring-Your-Own-Keys）ソフトウェアであり、このソフトウェアを使用するためのサブスクリプション、料金、または費用はありません。",
    part2:
      "AnythingLLMは、OpenAi、GPT-4、LangChain、PineconeDB、ChromaDBなどの強力なAI製品を簡単に統合し、手間をかけずに生産性を100倍に向上させる最も簡単な方法です。",
    part3:
      "AnythingLLMは、あなたのマシン上で完全にローカルで動作し、ほとんど負荷をかけません。GPUは必要ありません。クラウドおよびオンプレミスでのインストールも可能です。\nAIツールエコシステムは日々強力になっています。AnythingLLMはそれを簡単に利用できるようにします。",
    githubIssue: "GitHubで問題を作成",
    user1: "どうやって始めればいいの？",
    part4:
      "簡単です。すべてのコレクションは「ワークスペース」と呼ばれるバケットに整理されています。ワークスペースは、ファイル、ドキュメント、画像、PDFなどを含むバケットで、これらがLLMが理解し、会話で使用できるものに変換されます。\n\nいつでもファイルを追加および削除できます。",
    createWorkspace: "最初のワークスペースを作成",
    user2:
      "これはAI版のDropboxみたいなもの？チャットはどうなの？チャットボットなんでしょ？",
    part5:
      "AnythingLLMは単なるスマートなDropbox以上のものです。\n\nAnythingLLMはデータと対話する2つの方法を提供します：\n\n<i>クエリ：</i> チャットは、ワークスペース内のドキュメントで見つかったデータや推論を返します。ワークスペースにドキュメントを追加することで、より賢くなります！\n\n<i>会話：</i> ドキュメントと進行中のチャット履歴の両方が同時にLLMの知識に貢献します。リアルタイムのテキストベースの情報や修正を追加するのに最適です。\n\nチャット中にどちらのモードにも切り替えることができます。",
    user3: "すごい、試してみたい！",
    part6: "楽しんでください！",
    starOnGitHub: "GitHubでスターを付ける",
    contact: "Mintplex Labsに連絡",
  },
  "new-workspace": {
    title: "新しいワークスペース",
    placeholder: "マイワークスペース",
  },
  "workspaces—settings": {
    general: "一般設定",
    chat: "チャット設定",
    vector: "ベクターデータベース",
    members: "メンバー",
    agent: "エージェント構成",
  },
  general: {
    vector: {
      title: "ベクター数",
      description: "ベクターデータベース内のベクターの総数。",
    },
    names: {
      description: "これはワークスペースの表示名のみを変更します。",
    },
    message: {
      title: "提案されたチャットメッセージ",
      description:
        "ワークスペースユーザーに提案されるメッセージをカスタマイズします。",
      add: "新しいメッセージを追加",
      save: "メッセージを保存",
      heading: "説明してください",
      body: "AnythingLLMの利点",
    },
    pfp: {
      title: "アシスタントのプロフィール画像",
      description:
        "このワークスペースのアシスタントのプロフィール画像をカスタマイズします。",
      image: "ワークスペース画像",
      remove: "ワークスペース画像を削除",
    },
    delete: {
      title: "ワークスペースを削除",
      description:
        "このワークスペースとそのすべてのデータを削除します。これにより、すべてのユーザーのワークスペースが削除されます。",
      delete: "ワークスペースを削除",
      deleting: "ワークスペースを削除中...",
      "confirm-start": "ワークスペース全体を削除しようとしています",
      "confirm-end":
        "ワークスペース。この操作により、ベクターデータベース内のすべてのベクター埋め込みが削除されます。\n\n元のソースファイルはそのまま残ります。この操作は元に戻せません。",
    },
  },
  chat: {
    llm: {
      title: "ワークスペースLLMプロバイダー",
      description:
        "このワークスペースで使用するLLMプロバイダーとモデルを指定します。デフォルトではシステムのLLMプロバイダーと設定が使用されます。",
      search: "すべてのLLMプロバイダーを検索",
    },
    model: {
      title: "ワークスペースチャットモデル",
      description:
        "このワークスペースで使用するチャットモデルを指定します。空の場合はシステムのLLM設定が使用されます。",
      wait: "-- waiting for models --",
    },
    mode: {
      title: "チャットモード",
      chat: {
        title: "チャット",
        "desc-start": "LLMの一般知識で回答します",
        and: "および",
        "desc-end": "見つかったドキュメントコンテキストを使用します。",
      },
      query: {
        title: "クエリ",
        "desc-start": "回答を提供します",
        only: "のみ",
        "desc-end": "ドキュメントコンテキストが見つかった場合のみ。",
      },
    },
    history: {
      title: "チャット履歴",
      "desc-start": "応答の短期記憶に含まれる過去のチャット数。",
      recommend: "推奨値: 20",
      "desc-end":
        "45以上にすると、メッセージサイズによっては継続的なチャット失敗が発生する可能性があります。",
    },
    prompt: {
      title: "プロンプト",
      description:
        "このワークスペースで使用するプロンプトです。AIが適切な応答を生成できるよう、コンテキストや指示を定義してください。",
      history: {
        title: null,
        clearAll: null,
        noHistory: null,
        restore: null,
        delete: null,
        deleteConfirm: null,
        clearAllConfirm: null,
        expand: null,
        publish: null,
      },
    },
    refusal: {
      title: "クエリモード拒否応答",
      "desc-start": "モードが",
      query: "クエリ",
      "desc-end":
        "の場合、コンテキストが見つからないときにカスタム拒否応答を返すことができます。",
      "tooltip-title": null,
      "tooltip-description": null,
    },
    temperature: {
      title: "LLM温度",
      "desc-start": "この設定はLLMの応答の創造性を制御します。",
      "desc-end":
        "数値が高いほど創造的になりますが、高すぎると一部のモデルでは一貫性のない応答になる場合があります。",
      hint: "多くのLLMには有効な値の範囲があります。詳細はLLMプロバイダーの情報を参照してください。",
    },
  },
  "vector-workspace": {
    identifier: "ベクターデータベース識別子",
    snippets: {
      title: "最大コンテキストスニペット数",
      description:
        "この設定は、チャットやクエリごとにLLMへ送信される最大コンテキストスニペット数を制御します。",
      recommend: "推奨値: 4",
    },
    doc: {
      title: "ドキュメント類似度しきい値",
      description:
        "チャットに関連すると見なされるために必要な最小類似度スコアです。数値が高いほど、より類似したソースのみが対象となります。",
      zero: "制限なし",
      low: "低（類似度スコア ≥ 0.25）",
      medium: "中（類似度スコア ≥ 0.50）",
      high: "高（類似度スコア ≥ 0.75）",
    },
    reset: {
      reset: "ベクターデータベースをリセット",
      resetting: "ベクターをクリア中...",
      confirm:
        "このワークスペースのベクターデータベースをリセットしようとしています。これにより、現在埋め込まれているすべてのベクターが削除されます。\n\n元のソースファイルはそのまま残ります。この操作は元に戻せません。",
      error: "ワークスペースのベクターデータベースをリセットできませんでした！",
      success: "ワークスペースのベクターデータベースがリセットされました！",
    },
  },
  agent: {
    "performance-warning":
      "ツール呼び出しに対応していないLLMの性能は、モデルの能力や精度に大きく依存します。一部の機能が制限されたり、正しく動作しない場合があります。",
    provider: {
      title: "ワークスペースエージェントのLLMプロバイダー",
      description:
        "このワークスペースの@agentで使用するLLMプロバイダーとモデルを指定します。",
    },
    mode: {
      chat: {
        title: "ワークスペースエージェントのチャットモデル",
        description:
          "このワークスペースの@agentで使用するチャットモデルを指定します。",
      },
      title: "ワークスペースエージェントのモデル",
      description:
        "このワークスペースの@agentで使用するLLMモデルを指定します。",
      wait: "-- モデルを読み込み中 --",
    },
    skill: {
      title: "デフォルトエージェントのスキル",
      description:
        "これらのスキルでデフォルトエージェントの能力を強化できます。設定はすべてのワークスペースに適用されます。",
      rag: {
        title: "RAGと長期記憶",
        description:
          "エージェントがローカルドキュメントを活用して質問に答えたり、内容を「記憶」して長期的に参照できるようにします。",
      },
      view: {
        title: "ドキュメントの閲覧と要約",
        description:
          "エージェントがワークスペース内のファイルを一覧表示し、内容を要約できるようにします。",
      },
      scrape: {
        title: "ウェブサイトの取得",
        description:
          "エージェントがウェブサイトを訪問し、内容を取得できるようにします。",
      },
      generate: {
        title: "チャートの生成",
        description:
          "デフォルトエージェントがチャットやデータからさまざまなチャートを作成できるようにします。",
      },
      save: {
        title: "ファイルの生成と保存",
        description:
          "デフォルトエージェントがファイルを生成し、ブラウザからダウンロードできるようにします。",
      },
      web: {
        title: "ウェブ検索と閲覧",
        "desc-start":
          "エージェントがウェブ検索プロバイダーに接続し、質問に答えるためにウェブ検索できるようにします。",
        "desc-end":
          "この設定を行うまで、エージェントセッション中のウェブ検索は利用できません。",
      },
    },
  },
  recorded: {
    title: "ワークスペースチャット履歴",
    description:
      "ユーザーが送信したすべてのチャットとメッセージの履歴です。作成日時順に表示されます。",
    export: "エクスポート",
    table: {
      id: "ID",
      by: "送信者",
      workspace: "ワークスペース",
      prompt: "プロンプト",
      response: "応答",
      at: "送信日時",
    },
  },
  api: {
    title: "APIキー",
    description:
      "APIキーにより、プログラム経由でこのAnythingLLMインスタンスにアクセスおよび管理できます。",
    link: "APIドキュメントを読む",
    generate: "新しいAPIキーを生成",
    table: {
      key: "APIキー",
      by: "作成者",
      created: "作成日",
    },
  },
  llm: {
    title: "LLMの設定",
    description:
      "これは、お好みのLLMチャットおよび埋め込みプロバイダー用の認証情報と設定です。これらのキーが最新かつ正確でない場合、AnythingLLMは正しく動作しません。",
    provider: "LLMプロバイダー",
    providers: {
      azure_openai: {
        azure_service_endpoint: null,
        api_key: null,
        chat_deployment_name: null,
        chat_model_token_limit: null,
        model_type: null,
        default: null,
        reasoning: null,
      },
    },
  },
  transcription: {
    title: "文字起こしモデルの設定",
    description:
      "これは、お好みの文字起こしモデルプロバイダー用の認証情報と設定です。これらのキーが最新かつ正確でない場合、メディアファイルや音声が正しく文字起こしされません。",
    provider: "文字起こしプロバイダー",
    "warn-start":
      "RAMやCPUが限られたマシンでローカルのWhisperモデルを使用すると、メディアファイルの処理中にAnythingLLMが停止する可能性があります。",
    "warn-recommend":
      "少なくとも2GBのRAMが推奨され、ファイルサイズは10Mb未満であることをお勧めします。",
    "warn-end": "組み込みモデルは初回使用時に自動的にダウンロードされます。",
  },
  embedding: {
    title: "埋め込み設定",
    "desc-start":
      "LLMがネイティブに埋め込みエンジンをサポートしていない場合、テキストの埋め込み用に追加の認証情報を指定する必要がある場合があります。",
    "desc-end":
      "埋め込みとは、テキストをベクトルに変換するプロセスです。これらの認証情報は、ファイルやプロンプトをAnythingLLMが処理できるフォーマットに変換するために必要です。",
    provider: {
      title: "埋め込みプロバイダー",
      description:
        "AnythingLLMのネイティブ埋め込みエンジンを使用する場合、特に設定は必要ありません。",
    },
  },
  text: {
    title: "テキスト分割とチャンク化の設定",
    "desc-start":
      "新しいドキュメントがベクトルデータベースに挿入される前に、どのように分割およびチャンク化されるかのデフォルトの方法を変更する場合があります。",
    "desc-end":
      "テキスト分割の仕組みとその副作用を理解している場合にのみ、この設定を変更するべきです。",
    "warn-start": "ここでの変更は、",
    "warn-center": "新しく埋め込まれるドキュメントにのみ適用されます",
    "warn-end": "、既存のドキュメントには適用されません。",
    size: {
      title: "テキストチャンクサイズ",
      description: "1つのベクトルに含まれる最大の文字数です。",
      recommend: "埋め込みモデルの最大長は",
    },
    overlap: {
      title: "テキストチャンクの重複",
      description: "隣接するテキストチャンク間に発生する最大の重複文字数です。",
    },
  },
  vector: {
    title: "ベクターデータベース設定",
    description:
      "これは、AnythingLLMインスタンスの動作方法用の認証情報と設定です。これらのキーが最新で正確であることが重要です。",
    provider: {
      title: "ベクターデータベースプロバイダー",
      description: "LanceDBの場合、特に設定は必要ありません。",
    },
  },
  embeddable: {
    title: "埋め込みチャットウィジェット",
    description:
      "埋め込みチャットウィジェットは、特定のワークスペースに紐付けられた公開用チャットインターフェースです。これにより、ワークスペースを構築し、そのチャットを外部に公開できます。",
    create: "埋め込みチャットウィジェットを作成",
    table: {
      workspace: "ワークスペース",
      chats: "送信済みチャット",
      active: "有効なドメイン",
      created: null,
    },
  },
  "embed-chats": {
    title: "埋め込みチャット履歴",
    export: "エクスポート",
    description:
      "これは、公開された埋め込みウィジェットから送信された全てのチャットとメッセージの記録です。",
    table: {
      embed: "埋め込み",
      sender: "送信者",
      message: "メッセージ",
      response: "応答",
      at: "送信日時",
    },
  },
  multi: {
    title: "マルチユーザーモード",
    description:
      "マルチユーザーモードを有効にして、チームをサポートするようにインスタンスを設定します。",
    enable: {
      "is-enable": "マルチユーザーモードが有効です",
      enable: "マルチユーザーモードを有効にする",
      description:
        "デフォルトでは、あなたが唯一の管理者になります。管理者として、すべての新しいユーザーまたは管理者のアカウントを作成する必要があります。管理者ユーザーのみがパスワードをリセットできるため、パスワードを紛失しないでください。",
      username: "管理者アカウントのユーザー名",
      password: "管理者アカウントのパスワード",
    },
    password: {
      title: "パスワード保護",
      description:
        "AnythingLLMインスタンスをパスワードで保護します。これを忘れた場合、回復方法はないため、このパスワードを必ず保存してください。",
    },
    instance: {
      title: "インスタンスのパスワード保護",
      description:
        "デフォルトでは、あなたが唯一の管理者になります。管理者として、すべての新しいユーザーまたは管理者のアカウントを作成する必要があります。管理者ユーザーのみがパスワードをリセットできるため、パスワードを紛失しないでください。",
      password: "インスタンスパスワード",
    },
  },
  event: {
    title: "イベントログ",
    description:
      "監視のために、このインスタンスで発生しているすべてのアクションとイベントを表示します。",
    clear: "イベントログをクリア",
    table: {
      type: "イベントタイプ",
      user: "ユーザー",
      occurred: "発生日時",
    },
  },
  privacy: {
    title: "プライバシーとデータ処理",
    description:
      "これは、接続されているサードパーティプロバイダーとAnythingLLMがデータをどのように処理するかの設定です。",
    llm: "LLM選択",
    embedding: "埋め込み設定",
    vector: "ベクターデータベース",
    anonymous: "匿名テレメトリが有効",
  },
  connectors: {
    "search-placeholder": "データコネクタを検索",
    "no-connectors": "データコネクタが見つかりません。",
    github: {
      name: "GitHubリポジトリ",
      description:
        "ワンクリックで公開・非公開のGitHubリポジトリ全体をインポートできます。",
      URL: "GitHubリポジトリURL",
      URL_explained: "収集したいGitHubリポジトリのURLです。",
      token: "GitHubアクセストークン",
      optional: "任意",
      token_explained: "レート制限を回避するためのアクセストークンです。",
      token_explained_start: "アクセストークンがない場合、",
      token_explained_link1: "パーソナルアクセストークン",
      token_explained_middle:
        "がないと、GitHub APIのレート制限により収集できるファイル数が制限される場合があります。 ",
      token_explained_link2: "一時的なアクセストークンを作成",
      token_explained_end: "してこの問題を回避できます。",
      ignores: "無視するファイル",
      git_ignore:
        ".gitignore形式で収集時に無視したいファイルをリストしてください。エンターキーで各エントリを保存します。",
      task_explained:
        "完了後、すべてのファイルがドキュメントピッカーからワークスペースに埋め込めるようになります。",
      branch: "収集したいブランチ",
      branch_loading: "-- 利用可能なブランチを読み込み中 --",
      branch_explained: "収集したいブランチを指定します。",
      token_information:
        "<b>GitHubアクセストークン</b>を入力しない場合、GitHubの公開APIのレート制限により<b>トップレベル</b>のファイルのみ収集可能です。",
      token_personal:
        "無料のパーソナルアクセストークンはこちらから取得できます。",
    },
    gitlab: {
      name: "GitLabリポジトリ",
      description:
        "ワンクリックで公開・非公開のGitLabリポジトリ全体をインポートできます。",
      URL: "GitLabリポジトリURL",
      URL_explained: "収集したいGitLabリポジトリのURLです。",
      token: "GitLabアクセストークン",
      optional: "任意",
      token_explained: "レート制限を回避するためのアクセストークンです。",
      token_description: "GitLab APIから取得する追加エンティティを選択します。",
      token_explained_start: "アクセストークンがない場合、",
      token_explained_link1: "パーソナルアクセストークン",
      token_explained_middle:
        "がないと、GitLab APIのレート制限により収集できるファイル数が制限される場合があります。 ",
      token_explained_link2: "一時的なアクセストークンを作成",
      token_explained_end: "してこの問題を回避できます。",
      fetch_issues: "Issueをドキュメントとして取得",
      ignores: "無視するファイル",
      git_ignore:
        ".gitignore形式で収集時に無視したいファイルをリストしてください。エンターキーで各エントリを保存します。",
      task_explained:
        "完了後、すべてのファイルがドキュメントピッカーからワークスペースに埋め込めるようになります。",
      branch: "収集したいブランチ",
      branch_loading: "-- 利用可能なブランチを読み込み中 --",
      branch_explained: "収集したいブランチを指定します。",
      token_information:
        "<b>GitLabアクセストークン</b>を入力しない場合、GitLabの公開APIのレート制限により<b>トップレベル</b>のファイルのみ収集可能です。",
      token_personal:
        "無料のパーソナルアクセストークンはこちらから取得できます。",
    },
    youtube: {
      name: "YouTube文字起こし",
      description: "YouTube動画の文字起こしをリンクからインポートできます。",
      URL: "YouTube動画URL",
      URL_explained_start:
        "文字起こしを取得したいYouTube動画のURLを入力してください。動画には",
      URL_explained_link: "クローズドキャプション",
      URL_explained_end: "が必要です。",
      task_explained:
        "完了後、文字起こしがドキュメントピッカーからワークスペースに埋め込めるようになります。",
      language: "文字起こしの言語",
      language_explained: "取得したい文字起こしの言語を選択してください。",
      loading_languages: "-- 利用可能な言語を読み込み中 --",
    },
    "website-depth": {
      name: "ウェブサイト一括スクレイパー",
      description: "ウェブサイトとその下層リンクを指定した深さまで取得します。",
      URL: "ウェブサイトURL",
      URL_explained: "取得したいウェブサイトのURLです。",
      depth: "クロール深度",
      depth_explained: "元のURLからたどる子リンクの数です。",
      max_pages: "最大ページ数",
      max_pages_explained: "取得する最大リンク数です。",
      task_explained:
        "完了後、すべての取得内容がドキュメントピッカーからワークスペースに埋め込めるようになります。",
    },
    confluence: {
      name: "Confluence",
      description: "ワンクリックでConfluenceページ全体をインポートできます。",
      deployment_type: "Confluenceデプロイタイプ",
      deployment_type_explained:
        "ConfluenceインスタンスがAtlassianクラウドかセルフホストかを選択します。",
      base_url: "ConfluenceベースURL",
      base_url_explained: "ConfluenceスペースのベースURLです。",
      space_key: "Confluenceスペースキー",
      space_key_explained:
        "使用するConfluenceインスタンスのスペースキーです。通常は~で始まります。",
      username: "Confluenceユーザー名",
      username_explained: "Confluenceのユーザー名です。",
      auth_type: "Confluence認証タイプ",
      auth_type_explained:
        "Confluenceページへアクセスするための認証タイプを選択してください。",
      auth_type_username: "ユーザー名とアクセストークン",
      auth_type_personal: "パーソナルアクセストークン",
      token: "Confluenceアクセストークン",
      token_explained_start:
        "認証用のアクセストークンを入力してください。アクセストークンは",
      token_explained_link: "こちら",
      token_desc: "認証用アクセストークン",
      pat_token: "Confluenceパーソナルアクセストークン",
      pat_token_explained: "Confluenceのパーソナルアクセストークンです。",
      task_explained:
        "完了後、ページ内容がドキュメントピッカーからワークスペースに埋め込めるようになります。",
    },
    manage: {
      documents: "ドキュメント",
      "data-connectors": "データコネクタ",
      "desktop-only":
        "これらの設定の編集はデスクトップ端末のみ対応しています。デスクトップでこのページにアクセスしてください。",
      dismiss: "閉じる",
      editing: "編集中",
    },
    directory: {
      "my-documents": "マイドキュメント",
      "new-folder": "新しいフォルダー",
      "search-document": "ドキュメントを検索",
      "no-documents": "ドキュメントがありません",
      "move-workspace": "ワークスペースへ移動",
      name: "名前",
      "delete-confirmation":
        "これらのファイルやフォルダーを削除してもよろしいですか？\nシステムから削除され、既存のワークスペースからも自動的に削除されます。\nこの操作は元に戻せません。",
      "removing-message":
        "{{count}}件のドキュメントと{{folderCount}}件のフォルダーを削除中です。しばらくお待ちください。",
      "move-success": "{{count}}件のドキュメントを移動しました。",
      date: "日付",
      type: "種類",
      no_docs: "ドキュメントがありません",
      select_all: "すべて選択",
      deselect_all: "すべて選択解除",
      remove_selected: "選択したものを削除",
      costs: "※埋め込みには一度だけ費用がかかります",
      save_embed: "保存して埋め込む",
    },
    upload: {
      "processor-offline": "ドキュメント処理機能が利用できません",
      "processor-offline-desc":
        "ドキュメント処理機能がオフラインのため、ファイルをアップロードできません。後でもう一度お試しください。",
      "click-upload":
        "クリックしてアップロード、またはドラッグ＆ドロップしてください",
      "file-types":
        "テキストファイル、CSV、スプレッドシート、音声ファイルなどに対応しています！",
      "or-submit-link": "またはリンクを入力",
      "placeholder-link": "https://example.com",
      fetching: "取得中...",
      "fetch-website": "ウェブサイトを取得",
      "privacy-notice":
        "これらのファイルは、このAnythingLLMインスタンス上のドキュメント処理機能にアップロードされます。第三者に送信・共有されることはありません。",
    },
    pinning: {
      what_pinning: "ドキュメントのピン留めとは？",
      pin_explained_block1:
        "AnythingLLMでドキュメントを<b>ピン留め</b>すると、その内容全体がプロンプトウィンドウに挿入され、LLMがしっかり理解できるようになります。",
      pin_explained_block2:
        "<b>大きなコンテキストを持つモデル</b>や、重要な小さなファイルで特に効果的です。",
      pin_explained_block3:
        "デフォルトのままでは満足できる回答が得られない場合、ピン留めを活用するとより高品質な回答が得られます。",
      accept: "わかりました",
    },
    watching: {
      what_watching: "ドキュメントのウォッチとは？",
      watch_explained_block1:
        "AnythingLLMでドキュメントを<b>ウォッチ</b>すると、元のソースから定期的に内容が<i>自動的に</i>同期されます。管理しているすべてのワークスペースで内容が自動更新されます。",
      watch_explained_block2:
        "この機能は現在オンラインベースのコンテンツのみ対応しており、手動アップロードしたドキュメントには利用できません。",
      watch_explained_block3_start: "ウォッチしているドキュメントの管理は",
      watch_explained_block3_link: "ファイルマネージャー",
      watch_explained_block3_end: "管理画面から行えます。",
      accept: "わかりました",
    },
    obsidian: {
      name: null,
      description: null,
      vault_location: null,
      vault_description: null,
      selected_files: null,
      importing: null,
      import_vault: null,
      processing_time: null,
      vault_warning: null,
    },
  },
  chat_window: {
    welcome: "新しいワークスペースへようこそ。",
    get_started: "まずはじめに、",
    get_started_default: "はじめに",
    upload: "ドキュメントをアップロード",
    or: "または",
    send_chat: "チャットを送信",
    send_message: "メッセージを送信",
    attach_file: "このチャットにファイルを添付",
    slash: "チャットで使えるスラッシュコマンドをすべて表示",
    agents: "利用可能なエージェントをすべて表示",
    text_size: "テキストサイズを変更",
    microphone: "プロンプトを音声入力",
    send: "ワークスペースにプロンプトメッセージを送信",
    attachments_processing: null,
    tts_speak_message: null,
    copy: null,
    regenerate: null,
    regenerate_response: null,
    good_response: null,
    more_actions: null,
    hide_citations: null,
    show_citations: null,
    pause_tts_speech_message: null,
    fork: null,
    delete: null,
    save_submit: null,
    cancel: null,
    edit_prompt: null,
    edit_response: null,
    at_agent: null,
    default_agent_description: null,
    custom_agents_coming_soon: null,
    slash_reset: null,
    preset_reset_description: null,
    add_new_preset: null,
    command: null,
    your_command: null,
    placeholder_prompt: null,
    description: null,
    placeholder_description: null,
    save: null,
    small: null,
    normal: null,
    large: null,
    workspace_llm_manager: {
      search: null,
      loading_workspace_settings: null,
      available_models: null,
      available_models_description: null,
      save: null,
      saving: null,
      missing_credentials: null,
      missing_credentials_description: null,
    },
  },
  profile_settings: {
    edit_account: "アカウントを編集",
    profile_picture: "プロフィール画像",
    remove_profile_picture: "プロフィール画像を削除",
    username: "ユーザー名",
    username_description:
      "ユーザー名は小文字の英字、数字、アンダースコア、ハイフンのみ使用でき、スペースは使えません",
    new_password: "新しいパスワード",
    passwort_description: "パスワードは8文字以上である必要があります",
    cancel: "キャンセル",
    update_account: "アカウントを更新",
    theme: "テーマ設定",
    language: "優先言語",
    failed_upload: null,
    upload_success: null,
    failed_remove: null,
    profile_updated: null,
    failed_update_user: null,
    account: null,
    support: null,
    signout: null,
  },
  customization: {
    interface: {
      title: null,
      description: null,
    },
    branding: {
      title: null,
      description: null,
    },
    chat: {
      title: null,
      description: null,
      auto_submit: {
        title: null,
        description: null,
      },
      auto_speak: {
        title: null,
        description: null,
      },
      spellcheck: {
        title: null,
        description: null,
      },
    },
    items: {
      theme: {
        title: null,
        description: null,
      },
      "show-scrollbar": {
        title: null,
        description: null,
      },
      "support-email": {
        title: null,
        description: null,
      },
      "app-name": {
        title: null,
        description: null,
      },
      "chat-message-alignment": {
        title: null,
        description: null,
      },
      "display-language": {
        title: null,
        description: null,
      },
      logo: {
        title: null,
        description: null,
        add: null,
        recommended: null,
        remove: null,
        replace: null,
      },
      "welcome-messages": {
        title: null,
        description: null,
        new: null,
        system: null,
        user: null,
        message: null,
        assistant: null,
        "double-click": null,
        save: null,
      },
      "browser-appearance": {
        title: null,
        description: null,
        tab: {
          title: null,
          description: null,
        },
        favicon: {
          title: null,
          description: null,
        },
      },
      "sidebar-footer": {
        title: null,
        description: null,
        icon: null,
        link: null,
      },
    },
  },
  "main-page": {
    noWorkspaceError:
      "チャットを開始する前にワークスペースを作成してください。",
    checklist: {
      title: "はじめに",
      tasksLeft: "残りのタスク",
      completed: "AnythingLLMの達人への道を進んでいます！",
      dismiss: "閉じる",
      tasks: {
        create_workspace: {
          title: "ワークスペースを作成する",
          description: "始めるには最初のワークスペースを作成してください",
          action: "作成",
        },
        send_chat: {
          title: "チャットを送信する",
          description: "AIアシスタントとの会話を開始する",
          action: "チャット",
        },
        embed_document: {
          title: "ドキュメントを埋め込む",
          description: "ワークスペースに最初のドキュメントを追加する",
          action: "埋め込む",
        },
        setup_system_prompt: {
          title: "システムプロンプトを設定する",
          description: "AIアシスタントの動作を設定する",
          action: "設定",
        },
        define_slash_command: {
          title: "スラッシュコマンドを定義する",
          description: "アシスタント用のカスタムコマンドを作成する",
          action: "定義",
        },
        visit_community: {
          title: "コミュニティハブを訪問する",
          description: "コミュニティリソースとテンプレートを探索する",
          action: "閲覧",
        },
      },
    },
    quickLinks: {
      title: "クイックリンク",
      sendChat: "チャットを送信",
      embedDocument: "ドキュメントを埋め込む",
      createWorkspace: "ワークスペースを作成",
    },
    exploreMore: {
      title: "その他の機能を探索",
      features: {
        customAgents: {
          title: "カスタムAIエージェント",
          description: "コードなしで強力なAIエージェントと自動化を構築。",
          primaryAction: "@agentを使用してチャット",
          secondaryAction: "エージェントフローを構築",
        },
        slashCommands: {
          title: "スラッシュコマンド",
          description:
            "カスタムスラッシュコマンドで時間を節約しプロンプトを挿入。",
          primaryAction: "スラッシュコマンドを作成",
          secondaryAction: "ハブで探索",
        },
        systemPrompts: {
          title: "システムプロンプト",
          description:
            "システムプロンプトを変更してワークスペースのAI返答をカスタマイズ。",
          primaryAction: "システムプロンプトを変更",
          secondaryAction: "プロンプト変数を管理",
        },
      },
    },
    announcements: {
      title: "更新とお知らせ",
    },
    resources: {
      title: "リソース",
      links: {
        docs: "ドキュメント",
        star: "Githubでスター",
      },
      keyboardShortcuts: null,
    },
  },
  "keyboard-shortcuts": {
    title: null,
    shortcuts: {
      settings: null,
      workspaceSettings: null,
      home: null,
      workspaces: null,
      apiKeys: null,
      llmPreferences: null,
      chatSettings: null,
      help: null,
      showLLMSelector: null,
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        submit: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
      agent_flow: {
        public_description: null,
        private_description: null,
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        publish_button: null,
        submitting: null,
        submit: null,
        privacy_note: null,
      },
      generic: {
        unauthenticated: {
          title: null,
          description: null,
          button: null,
        },
      },
      slash_command: {
        success_title: null,
        success_description: null,
        success_thank_you: null,
        view_on_hub: null,
        modal_title: null,
        name_label: null,
        name_description: null,
        name_placeholder: null,
        description_label: null,
        description_description: null,
        command_label: null,
        command_description: null,
        command_placeholder: null,
        tags_label: null,
        tags_description: null,
        tags_placeholder: null,
        visibility_label: null,
        public_description: null,
        private_description: null,
        publish_button: null,
        submitting: null,
        prompt_label: null,
        prompt_description: null,
        prompt_placeholder: null,
      },
    },
  },
};

export default TRANSLATIONS;
