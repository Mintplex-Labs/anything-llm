// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Добро пожаловать в",
      getStarted: "Начать",
    },
    llm: {
      title: "Предпочитаемые LLM",
      description:
        "AnythingLLM может работать с различными провайдерами LLM. Этот сервис будет обеспечивать обработку чата.",
    },
    userSetup: {
      title: "Настройка пользователя",
      description: "Настройте параметры пользователя.",
      howManyUsers: "Сколько пользователей будут использовать этот экземпляр?",
      justMe: "Только я",
      myTeam: "Моя команда",
      instancePassword: "Пароль экземпляра",
      setPassword: "Хотите установить пароль?",
      passwordReq: "Пароль должен содержать не менее 8 символов.",
      passwordWarn:
        "Важно сохранить этот пароль, так как способа его восстановления не существует.",
      adminUsername: "Имя пользователя для учётной записи администратора",
      adminUsernameReq:
        "Имя пользователя должно состоять не менее чем из 6 символов и содержать только строчные буквы, цифры, символы подчеркивания и дефисы без пробелов.",
      adminPassword: "Пароль для учётной записи администратора",
      adminPasswordReq: "Пароль должен содержать не менее 8 символов.",
      teamHint:
        "По умолчанию, вы будете единственным администратором. После завершения настройки вы сможете создавать учётные записи и приглашать других пользователей или администраторов. Не потеряйте пароль, так как только администраторы могут его сбросить.",
    },
    data: {
      title: "Обработка данных и конфиденциальность",
      description:
        "Мы стремимся обеспечить прозрачность и контроль в отношении ваших персональных данных.",
      settingsHint: "Эти настройки можно изменить в любое время в настройках.",
    },
    survey: {
      title: "Добро пожаловать в AnythingLLM",
      description:
        "Помогите нам сделать AnythingLLM, созданным с учётом ваших потребностей (необязательно).",
      email: "Какой у вас адрес электронной почты?",
      useCase: "Для чего вы будете использовать AnythingLLM?",
      useCaseWork: "Для работы",
      useCasePersonal: "Для личного использования",
      useCaseOther: "Другое",
      comment: "Откуда вы узнали о AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube и т.д. — сообщите, где вы о нас узнали!",
      skip: "Пропустить опрос",
      thankYou: "Спасибо за ваш отзыв!",
    },
    workspace: {
      title: "Создайте ваше первое рабочее пространство",
      description:
        "Создайте ваше первое рабочее пространство и начните работу с AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Имя рабочих пространств",
    error: "ошибка",
    success: "успех",
    user: "Пользователь",
    selection: "Выбор модели",
    saving: "Сохранение...",
    save: "Сохранить изменения",
    previous: "Предыдущая страница",
    next: "Следующая страница",
    optional: "Необязательный",
    yes: "Да",
    no: "Нет",
    search: null,
  },
  settings: {
    title: "Настройки экземпляра",
    system: "Системные настройки",
    invites: "Приглашение",
    users: "Пользователи",
    workspaces: "Рабочие пространства",
    "workspace-chats": "Чат рабочего пространства",
    customization: "Внешний вид",
    "api-keys": "API ключи",
    llm: "Предпочтение LLM",
    transcription: "Модель транскрипции",
    embedder: "Настройки встраивания",
    "text-splitting": "Разделение и сегментация текста",
    "voice-speech": "Голос и Речь",
    "vector-database": "Векторная база данных",
    embeds: "Виджеты встраивания чата",
    "embed-chats": "История встраивания чатов",
    security: "Безопасность",
    "event-logs": "Журналы событий",
    privacy: "Конфиденциальность и данные",
    "ai-providers": "Поставщики ИИ",
    "agent-skills": "Навыки агента",
    admin: "Администратор",
    tools: "Инструменты",
    "experimental-features": "Экспериментальные функции",
    contact: "Связаться с Поддержкой",
    "browser-extension": "Расширение браузера",
    "system-prompt-variables": "Переменные системного запроса",
    interface: null,
    branding: null,
    chat: null,
  },
  login: {
    "multi-user": {
      welcome: "Добро пожаловать в",
      "placeholder-username": "Имя пользователя",
      "placeholder-password": "Пароль",
      login: "Войти",
      validating: "Проверка...",
      "forgot-pass": "Забыли пароль",
      reset: "Сбросить",
    },
    "sign-in": {
      start: "Войти в ваш",
      end: "аккаунт.",
    },
    "password-reset": {
      title: "Сброс пароля",
      description:
        "Предоставьте необходимую информацию ниже, чтобы сбросить ваш пароль.",
      "recovery-codes": "Коды восстановления",
      "recovery-code": "Код восстановления {{index}}",
      "back-to-login": "Вернуться к входу",
    },
  },
  welcomeMessage: {
    part1:
      "Добро пожаловать в AnythingLLM, открытый инструмент искусственного интеллекта от Mintplex Labs, который превращает что угодно в обученный чат-бот, с которым вы можете общаться и задавать вопросы. AnythingLLM - это ПО BYOK (принеси свои собственные ключи), поэтому за использование этого ПО нет подписки, платы или других сборов, кроме тех, что вы хотите использовать.",
    part2:
      "AnythingLLM - это самый простой способ объединить мощные продукты ИИ, такие как OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB и другие сервисы, в аккуратный пакет без лишних хлопот, чтобы повысить вашу продуктивность в 100 раз.",
    part3:
      "AnythingLLM может работать полностью локально на вашем компьютере с минимальной нагрузкой, вы даже не заметите его присутствия! GPU не требуется. Также доступна установка в облаке и на локальных серверах.\nЭкосистема инструментов ИИ становится мощнее с каждым днем. AnythingLLM упрощает их использование.",
    githubIssue: "Создать задачу на GitHub",
    user1: "Как начать?!",
    part4:
      'Это просто. Все коллекции организованы в корзины, которые мы называем "Workspaces". Workspaces - это корзины файлов, документов, изображений, PDF и других файлов, которые будут преобразованы в нечто, что LLM сможет понять и использовать в беседе.\n\nВы можете добавлять и удалять файлы в любое время.',
    createWorkspace: "Создайте свою первую workspace",
    user2:
      "Это что-то вроде ИИ-дропбокса? А как насчет чата? Это ведь чат-бот, верно?",
    part5:
      "AnythingLLM - это больше, чем просто умный Dropbox.\n\nAnythingLLM предлагает два способа общения с вашими данными:\n\n<i>Запрос:</i> Ваши чаты будут возвращать данные или выводы, найденные в документах в вашем workspace, к которому у него есть доступ. Добавление большего количества документов в workspace делает его умнее!\n\n<i>Беседа:</i> Ваши документы и история чатов вместе способствуют знаниям LLM одновременно. Отлично подходит для добавления информации в реальном времени на основе текста или исправления и недоразумений, которые может иметь LLM.\n\nВы можете переключаться между режимами <i>прямо во время чата!</i>",
    user3: "Вау, это звучит потрясающе, дайте попробовать прямо сейчас!",
    part6: "Веселитесь!",
    starOnGitHub: "Звезда на GitHub",
    contact: "Связаться с Mintplex Labs",
  },
  "new-workspace": {
    title: "Новая Рабочая Область",
    placeholder: "Моя Рабочая Область",
  },
  "workspaces—settings": {
    general: "Общие настройки",
    chat: "Настройки чата",
    vector: "Векторная база данных",
    members: "Участники",
    agent: "Конфигурация агента",
  },
  general: {
    vector: {
      title: "Количество векторов",
      description: "Общее количество векторов в вашей векторной базе данных.",
    },
    names: {
      description:
        "Это изменит только отображаемое имя вашего рабочего пространства.",
    },
    message: {
      title: "Предлагаемые сообщения чата",
      description:
        "Настройте сообщения, которые будут предложены пользователям вашего рабочего пространства.",
      add: "Добавить новое сообщение",
      save: "Сохранить сообщения",
      heading: "Объясните мне",
      body: "преимущества AnythingLLM",
    },
    pfp: {
      title: "Изображение профиля помощника",
      description:
        "Настройте изображение профиля помощника для этого рабочего пространства.",
      image: "Изображение рабочего пространства",
      remove: "Удалить изображение рабочего пространства",
    },
    delete: {
      title: "Удалить Рабочее Пространство",
      description:
        "Удалите это рабочее пространство и все его данные. Это удалит рабочее пространство для всех пользователей.",
      delete: "Удалить рабочее пространство",
      deleting: "Удаление рабочего пространства...",
      "confirm-start": "Вы собираетесь удалить весь ваш",
      "confirm-end":
        "рабочее пространство. Это удалит все векторные встраивания в вашей векторной базе данных.\n\nОригинальные исходные файлы останутся нетронутыми. Это действие необратимо.",
    },
  },
  chat: {
    llm: {
      title: "Поставщик LLM рабочего пространства",
      description:
        "Конкретный поставщик и модель LLM, которые будут использоваться для этого рабочего пространства. По умолчанию используется системный поставщик и настройки LLM.",
      search: "Искать всех поставщиков LLM",
    },
    model: {
      title: "Модель чата рабочего пространства",
      description:
        "Конкретная модель чата, которая будет использоваться для этого рабочего пространства. Если пусто, будет использоваться системное предпочтение LLM.",
      wait: "-- ожидание моделей --",
    },
    mode: {
      title: "Режим чата",
      chat: {
        title: "Чат",
        "desc-start": "будет предоставлять ответы с общей информацией LLM",
        and: "и",
        "desc-end": "найденный контекст документов.",
      },
      query: {
        title: "Запрос",
        "desc-start": "будет предоставлять ответы",
        only: "только",
        "desc-end": "если найден контекст документов.",
      },
    },
    history: {
      title: "История чата",
      "desc-start":
        "Количество предыдущих чатов, которые будут включены в краткосрочную память ответа.",
      recommend: "Рекомендуем 20.",
      "desc-end":
        "Любое количество более 45 может привести к непрерывным сбоям чата в зависимости от размера сообщений.",
    },
    prompt: {
      title: "Подсказка",
      description:
        "Подсказка, которая будет использоваться в этом рабочем пространстве. Определите контекст и инструкции для AI для создания ответа. Вы должны предоставить тщательно разработанную подсказку, чтобы AI мог генерировать релевантный и точный ответ.",
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
      title: "Ответ об отказе в режиме запроса",
      "desc-start": "В режиме",
      query: "запроса",
      "desc-end":
        "вы можете вернуть пользовательский ответ об отказе, если контекст не найден.",
      "tooltip-title": null,
      "tooltip-description": null,
    },
    temperature: {
      title: "Температура LLM",
      "desc-start":
        "Этот параметр контролирует, насколько 'креативными' будут ответы вашего LLM.",
      "desc-end":
        "Чем выше число, тем более креативные ответы. Для некоторых моделей это может привести к несвязным ответам при слишком высоких настройках.",
      hint: "Большинство LLM имеют различные допустимые диапазоны значений. Проконсультируйтесь с вашим поставщиком LLM для получения этой информации.",
    },
  },
  "vector-workspace": {
    identifier: "Идентификатор векторной базы данных",
    snippets: {
      title: "Максимальное количество контекстных фрагментов",
      description:
        "Этот параметр контролирует максимальное количество контекстных фрагментов, которые будут отправлены LLM для каждого чата или запроса.",
      recommend: "Рекомендуемое количество: 4",
    },
    doc: {
      title: "Порог сходства документов",
      description:
        "Минимальная оценка сходства, необходимая для того, чтобы источник считался связанным с чатом. Чем выше число, тем более схожим должен быть источник с чатом.",
      zero: "Без ограничений",
      low: "Низкий (оценка сходства ≥ .25)",
      medium: "Средний (оценка сходства ≥ .50)",
      high: "Высокий (оценка сходства ≥ .75)",
    },
    reset: {
      reset: "Сброс векторной базы данных",
      resetting: "Очистка векторов...",
      confirm:
        "Вы собираетесь сбросить векторную базу данных этого рабочего пространства. Это удалит все текущие векторные встраивания.\n\nОригинальные исходные файлы останутся нетронутыми. Это действие необратимо.",
      error: "Не удалось сбросить векторную базу данных рабочего пространства!",
      success: "Векторная база данных рабочего пространства была сброшена!",
    },
  },
  agent: {
    "performance-warning":
      "Производительность LLM, не поддерживающих вызовы инструментов, сильно зависит от возможностей и точности модели. Некоторые способности могут быть ограничены или не функционировать.",
    provider: {
      title: "Поставщик LLM агента рабочего пространства",
      description:
        "Конкретный поставщик и модель LLM, которые будут использоваться для агента @agent этого рабочего пространства.",
    },
    mode: {
      chat: {
        title: "Модель чата агента рабочего пространства",
        description:
          "Конкретная модель чата, которая будет использоваться для агента @agent этого рабочего пространства.",
      },
      title: "Модель агента рабочего пространства",
      description:
        "Конкретная модель LLM, которая будет использоваться для агента @agent этого рабочего пространства.",
      wait: "-- ожидание моделей --",
    },
    skill: {
      title: "Навыки агента по умолчанию",
      description:
        "Улучшите естественные способности агента по умолчанию с помощью этих предустановленных навыков. Эта настройка применяется ко всем рабочим пространствам.",
      rag: {
        title: "RAG и долговременная память",
        description:
          "Позвольте агенту использовать ваши локальные документы для ответа на запрос или попросите агента 'запомнить' части контента для долгосрочного извлечения из памяти.",
      },
      view: {
        title: "Просмотр и резюмирование документов",
        description:
          "Позвольте агенту перечислять и резюмировать содержание файлов рабочего пространства, которые в данный момент встроены.",
      },
      scrape: {
        title: "Сбор данных с веб-сайтов",
        description:
          "Позвольте агенту посещать и собирать содержимое веб-сайтов.",
      },
      generate: {
        title: "Создание диаграмм",
        description:
          "Включите возможность создания различных типов диаграмм из предоставленных данных или данных, указанных в чате.",
      },
      save: {
        title: "Создание и сохранение файлов в браузер",
        description:
          "Включите возможность создания и записи файлов, которые можно сохранить и загрузить в вашем браузере.",
      },
      web: {
        title: "Поиск в Интернете и просмотр в реальном времени",
        "desc-start":
          "Позвольте вашему агенту искать в Интернете для ответа на ваши вопросы, подключаясь к поставщику поиска (SERP).",
        "desc-end":
          "Поиск в Интернете во время сессий агента не будет работать, пока это не настроено.",
      },
    },
  },
  recorded: {
    title: "Чаты рабочего пространства",
    description:
      "Это все записанные чаты и сообщения, отправленные пользователями, упорядоченные по дате создания.",
    export: "Экспорт",
    table: {
      id: "Идентификатор",
      by: "Отправлено",
      workspace: "Рабочее пространство",
      prompt: "Подсказка",
      response: "Ответ",
      at: "Отправлено в",
    },
  },
  api: {
    title: "API ключи",
    description:
      "API ключи позволяют владельцу программно получать доступ к этому экземпляру AnythingLLM и управлять им.",
    link: "Прочитать документацию по API",
    generate: "Создать новый API ключ",
    table: {
      key: "API ключ",
      by: "Создано",
      created: "Создано",
    },
  },
  llm: {
    title: "Предпочтение LLM",
    description:
      "Это учетные данные и настройки для вашего предпочтительного поставщика чата и встраивания LLM. Важно, чтобы эти ключи были актуальными и правильными, иначе AnythingLLM не будет работать должным образом.",
    provider: "Поставщик LLM",
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
    title: "Предпочтение модели транскрипции",
    description:
      "Это учетные данные и настройки для вашего предпочтительного поставщика моделей транскрипции. Важно, чтобы эти ключи были актуальными и правильными, иначе медиафайлы и аудио не будут транскрибироваться.",
    provider: "Поставщик транскрипции",
    "warn-start":
      "Использование локальной модели whisper на машинах с ограниченной оперативной памятью или процессором может привести к зависанию AnythingLLM при обработке медиафайлов.",
    "warn-recommend":
      "Мы рекомендуем минимум 2ГБ оперативной памяти и загружать файлы <10МБ.",
    "warn-end":
      "Встроенная модель будет автоматически загружена при первом использовании.",
  },
  embedding: {
    title: "Настройки встраивания",
    "desc-start":
      "При использовании LLM, который не поддерживает встроенный механизм встраивания - возможно, потребуется дополнительно указать учетные данные для встраивания текста.",
    "desc-end":
      "Встраивание - это процесс превращения текста в векторы. Эти учетные данные необходимы для превращения ваших файлов и подсказок в формат, который AnythingLLM может использовать для обработки.",
    provider: {
      title: "Поставщик встраивания",
      description:
        "Нет необходимости в настройке при использовании встроенного механизма встраивания AnythingLLM.",
    },
  },
  text: {
    title: "Настройки разделения и сегментации текста",
    "desc-start":
      "Иногда может понадобиться изменить стандартный способ разделения и сегментации новых документов перед их вставкой в векторную базу данных.",
    "desc-end":
      "Следует изменять этот параметр только при полном понимании работы разделения текста и его побочных эффектов.",
    "warn-start": "Изменения здесь будут применяться только к",
    "warn-center": "новым встроенным документам",
    "warn-end": ", а не к существующим документам.",
    size: {
      title: "Размер сегмента текста",
      description:
        "Это максимальная длина символов, которые могут присутствовать в одном векторе.",
      recommend: "Максимальная длина модели встраивания составляет",
    },
    overlap: {
      title: "Перекрытие сегментов текста",
      description:
        "Это максимальное перекрытие символов, которое происходит при сегментации между двумя смежными сегментами текста.",
    },
  },
  vector: {
    title: "Векторная база данных",
    description:
      "Это учетные данные и настройки для того, как будет функционировать ваш экземпляр AnythingLLM. Важно, чтобы эти ключи были актуальными и правильными.",
    provider: {
      title: "Поставщик векторной базы данных",
      description: "Настройка для LanceDB не требуется.",
    },
  },
  embeddable: {
    title: "Встраиваемые виджеты чата",
    description:
      "Встраиваемые виджеты чата - это интерфейсы чата, ориентированные на публичное использование и привязанные к одному рабочему пространству. Они позволяют создавать рабочие пространства, которые затем можно публиковать в Интернете.",
    create: "Создать встраивание",
    table: {
      workspace: "Рабочее пространство",
      chats: "Отправленные чаты",
      active: "Активные домены",
      created: null,
    },
  },
  "embed-chats": {
    title: "Встраивание чатов",
    export: "Экспорт",
    description:
      "Это все записанные чаты и сообщения от любого встраивания, которое вы опубликовали.",
    table: {
      embed: "Встраивание",
      sender: "Отправитель",
      message: "Сообщение",
      response: "Ответ",
      at: "Отправлено в",
    },
  },
  multi: {
    title: "Многопользовательский режим",
    description:
      "Настройте ваш экземпляр для поддержки вашей команды, активировав многопользовательский режим.",
    enable: {
      "is-enable": "Многопользовательский режим включен",
      enable: "Включить многопользовательский режим",
      description:
        "По умолчанию, вы будете единственным администратором. Как администратор, вы должны будете создавать учетные записи для всех новых пользователей или администраторов. Не теряйте ваш пароль, так как только администратор может сбросить пароли.",
      username: "Имя пользователя учетной записи администратора",
      password: "Пароль учетной записи администратора",
    },
    password: {
      title: "Защита паролем",
      description:
        "Защитите ваш экземпляр AnythingLLM паролем. Если вы забудете его, метода восстановления не существует, поэтому убедитесь, что вы сохранили этот пароль.",
    },
    instance: {
      title: "Защитить экземпляр паролем",
      description:
        "По умолчанию, вы будете единственным администратором. Как администратор, вы должны будете создавать учетные записи для всех новых пользователей или администраторов. Не теряйте ваш пароль, так как только администратор может сбросить пароли.",
      password: "Пароль экземпляра",
    },
  },
  event: {
    title: "Журналы событий",
    description:
      "Просматривайте все действия и события, происходящие в этом экземпляре для мониторинга.",
    clear: "Очистить журналы событий",
    table: {
      type: "Тип события",
      user: "Пользователь",
      occurred: "Произошло в",
    },
  },
  privacy: {
    title: "Конфиденциальность и обработка данных",
    description:
      "Это ваша конфигурация для того, как подключенные сторонние поставщики и AnythingLLM обрабатывают ваши данные.",
    llm: "Выбор LLM",
    embedding: "Предпочтение встраивания",
    vector: "Векторная база данных",
    anonymous: "Анонимная телеметрия включена",
  },
  connectors: {
    "search-placeholder": "Поиск коннекторов данных",
    "no-connectors": "Коннекторы данных не найдены.",
    github: {
      name: "Репозиторий GitHub",
      description:
        "Импортируйте весь публичный или приватный репозиторий GitHub одним кликом.",
      URL: "URL репозитория GitHub",
      URL_explained: "URL репозитория GitHub, который вы хотите собрать.",
      token: "Токен доступа GitHub",
      optional: "необязательно",
      token_explained: "Токен доступа для предотвращения ограничения запросов.",
      token_explained_start: "Без ",
      token_explained_link1: "личного токена доступа",
      token_explained_middle:
        ", API GitHub может ограничить количество файлов для сбора из-за лимитов запросов. Вы можете ",
      token_explained_link2: "создать временный токен доступа",
      token_explained_end: ", чтобы избежать этой проблемы.",
      ignores: "Игнорирование файлов",
      git_ignore:
        "Список в формате .gitignore для исключения определённых файлов при сборе. Нажмите Enter после каждой записи, которую хотите сохранить.",
      task_explained:
        "После завершения все файлы будут доступны для внедрения в рабочие пространства через выбор документов.",
      branch: "Ветка, из которой нужно собрать файлы.",
      branch_loading: "-- загрузка доступных веток --",
      branch_explained: "Ветка, из которой нужно собрать файлы.",
      token_information:
        "Если не заполнить поле <b>Токен доступа GitHub</b>, этот коннектор данных сможет собрать только <b>файлы верхнего уровня</b> репозитория из-за ограничений публичного API GitHub.",
      token_personal:
        "Получите бесплатный личный токен доступа с аккаунтом GitHub здесь.",
    },
    gitlab: {
      name: "Репозиторий GitLab",
      description:
        "Импортируйте весь публичный или приватный репозиторий GitLab одним кликом.",
      URL: "URL репозитория GitLab",
      URL_explained: "URL репозитория GitLab, который вы хотите собрать.",
      token: "Токен доступа GitLab",
      optional: "необязательно",
      token_explained: "Токен доступа для предотвращения ограничения запросов.",
      token_description:
        "Выберите дополнительные сущности для получения через API GitLab.",
      token_explained_start: "Без ",
      token_explained_link1: "личного токена доступа",
      token_explained_middle:
        ", API GitLab может ограничить количество файлов для сбора из-за лимитов запросов. Вы можете ",
      token_explained_link2: "создать временный токен доступа",
      token_explained_end: ", чтобы избежать этой проблемы.",
      fetch_issues: "Получать задачи как документы",
      ignores: "Игнорирование файлов",
      git_ignore:
        "Список в формате .gitignore для исключения определённых файлов при сборе. Нажмите Enter после каждой записи, которую хотите сохранить.",
      task_explained:
        "После завершения все файлы будут доступны для внедрения в рабочие пространства через выбор документов.",
      branch: "Ветка, из которой нужно собрать файлы",
      branch_loading: "-- загрузка доступных веток --",
      branch_explained: "Ветка, из которой нужно собрать файлы.",
      token_information:
        "Если не заполнить поле <b>Токен доступа GitLab</b>, этот коннектор данных сможет собрать только <b>файлы верхнего уровня</b> репозитория из-за ограничений публичного API GitLab.",
      token_personal:
        "Получите бесплатный личный токен доступа с аккаунтом GitLab здесь.",
    },
    youtube: {
      name: "Транскрипция YouTube",
      description:
        "Импортируйте транскрипцию целого видео с YouTube по ссылке.",
      URL: "URL видео на YouTube",
      URL_explained_start:
        "Введите URL любого видео с YouTube для получения транскрипции. Видео должно иметь ",
      URL_explained_link: "субтитры",
      URL_explained_end: " (закрытые титры).",
      task_explained:
        "После завершения транскрипция будет доступна для внедрения в рабочие пространства через выбор документов.",
      language: "Язык транскрипции",
      language_explained: "Выберите язык транскрипции, которую хотите собрать.",
      loading_languages: "-- загрузка доступных языков --",
    },
    "website-depth": {
      name: "Сбор ссылок с сайта",
      description: "Соберите сайт и его подстраницы до заданной глубины.",
      URL: "URL сайта",
      URL_explained: "URL сайта, который вы хотите собрать.",
      depth: "Глубина обхода",
      depth_explained:
        "Количество уровней вложенных ссылок, которое следует пройти от исходного URL.",
      max_pages: "Максимальное количество страниц",
      max_pages_explained: "Максимальное число ссылок для сбора.",
      task_explained:
        "После завершения весь собранный контент будет доступен для внедрения в рабочие пространства через выбор документов.",
    },
    confluence: {
      name: "Confluence",
      description: "Импортируйте целую страницу Confluence одним кликом.",
      deployment_type: "Тип развертывания Confluence",
      deployment_type_explained:
        "Укажите, размещён ли ваш Confluence в облаке Atlassian или на собственном сервере.",
      base_url: "Базовый URL Confluence",
      base_url_explained: "Это базовый URL вашего пространства Confluence.",
      space_key: "Ключ пространства Confluence",
      space_key_explained:
        "Это ключ вашего пространства Confluence, который будет использоваться. Обычно начинается с ~",
      username: "Имя пользователя Confluence",
      username_explained: "Ваше имя пользователя в Confluence",
      auth_type: "Тип аутентификации Confluence",
      auth_type_explained:
        "Выберите тип аутентификации для доступа к страницам Confluence.",
      auth_type_username: "Имя пользователя и токен доступа",
      auth_type_personal: "Личный токен доступа",
      token: "Токен доступа Confluence",
      token_explained_start:
        "Необходимо предоставить токен доступа для аутентификации. Вы можете сгенерировать его ",
      token_explained_link: "здесь",
      token_desc: "Токен доступа для аутентификации",
      pat_token: "Личный токен доступа Confluence",
      pat_token_explained: "Ваш личный токен доступа для Confluence.",
      task_explained:
        "После завершения содержимое страницы будет доступно для внедрения в рабочие пространства через выбор документов.",
    },
    manage: {
      documents: "Документы",
      "data-connectors": "Коннекторы данных",
      "desktop-only":
        "Редактирование этих настроек доступно только на настольном устройстве. Пожалуйста, перейдите на ПК для продолжения.",
      dismiss: "Закрыть",
      editing: "Редактирование",
    },
    directory: {
      "my-documents": "Мои документы",
      "new-folder": "Новая папка",
      "search-document": "Поиск документа",
      "no-documents": "Нет документов",
      "move-workspace": "Переместить в рабочее пространство",
      name: "Название",
      "delete-confirmation":
        "Вы уверены, что хотите удалить эти файлы и папки?\nЭто действие удалит файлы из системы и автоматически уберёт их из всех рабочих пространств.\nЭто действие необратимо.",
      "removing-message":
        "Удаляется {{count}} документов и {{folderCount}} папок. Пожалуйста, подождите.",
      "move-success": "Успешно перемещено {{count}} документов.",
      date: "Дата",
      type: "Тип",
      no_docs: "Нет документов",
      select_all: "Выбрать всё",
      deselect_all: "Снять выбор со всех",
      remove_selected: "Удалить выбранные",
      costs: "*Единоразовая стоимость за внедрение",
      save_embed: "Сохранить и внедрить",
    },
    upload: {
      "processor-offline": "Процессор документов недоступен",
      "processor-offline-desc":
        "Мы не можем загрузить ваши файлы, так как процессор документов недоступен. Пожалуйста, попробуйте позже.",
      "click-upload": "Нажмите для загрузки или перетащите файл",
      "file-types":
        "поддерживаются текстовые файлы, CSV, таблицы, аудиофайлы и другое!",
      "or-submit-link": "или отправьте ссылку",
      "placeholder-link": "https://example.com",
      fetching: "Загрузка...",
      "fetch-website": "Получить сайт",
      "privacy-notice":
        "Эти файлы будут загружены в процессор документов на этом экземпляре AnythingLLM. Файлы не отправляются и не передаются третьим лицам.",
    },
    pinning: {
      what_pinning: "Что такое закрепление документа?",
      pin_explained_block1:
        "Когда вы <b>закрепляете</b> документ в AnythingLLM, мы вставляем всё его содержимое в окно запроса, чтобы LLM мог полностью его понять.",
      pin_explained_block2:
        "Это работает лучше всего с <b>моделями с большим контекстом</b> или небольшими файлами, критичными для базы знаний.",
      pin_explained_block3:
        "Если по умолчанию ответы AnythingLLM вас не удовлетворяют, закрепление — отличный способ получить более качественные ответы одним кликом.",
      accept: "Хорошо, понял",
    },
    watching: {
      what_watching: "Что делает функция наблюдения за документом?",
      watch_explained_block1:
        "Когда вы <b>наблюдаете</b> за документом в AnythingLLM, мы <i>автоматически</i> синхронизируем его содержимое с оригинальным источником через регулярные интервалы. Это автоматически обновляет содержимое во всех рабочих пространствах, где используется этот файл.",
      watch_explained_block2:
        "Эта функция поддерживает только онлайн-контент и недоступна для документов, загруженных вручную.",
      watch_explained_block3_start:
        "Вы можете управлять наблюдением за документами через ",
      watch_explained_block3_link: "Файловый менеджер",
      watch_explained_block3_end: " в режиме администратора.",
      accept: "Хорошо, понял",
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
    welcome: "Добро пожаловать в ваше новое рабочее пространство.",
    get_started: "Чтобы начать, либо",
    get_started_default: "Чтобы начать",
    upload: "загрузите документ",
    or: "или",
    send_chat: "отправьте сообщение в чате.",
    send_message: "Отправить сообщение",
    attach_file: "Прикрепить файл к чату",
    slash: "Просмотреть все доступные слэш-команды для чата.",
    agents: "Просмотреть всех доступных агентов для чата.",
    text_size: "Изменить размер текста.",
    microphone: "Произнесите ваш запрос.",
    send: "Отправить запрос в рабочее пространство",
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
    edit_account: "Редактировать учётную запись",
    profile_picture: "Изображение профиля",
    remove_profile_picture: "Удалить изображение профиля",
    username: "Имя пользователя",
    username_description:
      "Имя пользователя должно состоять только из строчных букв, цифр, символов подчеркивания и дефисов без пробелов",
    new_password: "Новый пароль",
    password_description: "Пароль должен содержать не менее 8 символов",
    cancel: "Отмена",
    update_account: "Обновить учётную запись",
    theme: "Предпочтения темы",
    language: "Предпочитаемый язык",
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
    noWorkspaceError: null,
    checklist: {
      title: null,
      tasksLeft: null,
      completed: null,
      dismiss: null,
      tasks: {
        create_workspace: {
          title: null,
          description: null,
          action: null,
        },
        send_chat: {
          title: null,
          description: null,
          action: null,
        },
        embed_document: {
          title: null,
          description: null,
          action: null,
        },
        setup_system_prompt: {
          title: null,
          description: null,
          action: null,
        },
        define_slash_command: {
          title: null,
          description: null,
          action: null,
        },
        visit_community: {
          title: null,
          description: null,
          action: null,
        },
      },
    },
    quickLinks: {
      title: null,
      sendChat: null,
      embedDocument: null,
      createWorkspace: null,
    },
    exploreMore: {
      title: null,
      features: {
        customAgents: {
          title: null,
          description: null,
          primaryAction: null,
          secondaryAction: null,
        },
        slashCommands: {
          title: null,
          description: null,
          primaryAction: null,
          secondaryAction: null,
        },
        systemPrompts: {
          title: null,
          description: null,
          primaryAction: null,
          secondaryAction: null,
        },
      },
    },
    announcements: {
      title: null,
    },
    resources: {
      title: null,
      links: {
        docs: null,
        star: null,
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
