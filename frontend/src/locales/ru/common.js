const TRANSLATIONS = {
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
    contact: "联系支持Связаться с Поддержкой",
    "browser-extension": "Расширение браузера",
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
    githubIssue: "Создать задачу на Github",
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
    starOnGithub: "Звезда на GitHub",
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
    },
    refusal: {
      title: "Ответ об отказе в режиме запроса",
      "desc-start": "В режиме",
      query: "запроса",
      "desc-end":
        "вы можете вернуть пользовательский ответ об отказе, если контекст не найден.",
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
  appearance: {
    title: "Внешний вид",
    description: "Настройте параметры внешнего вида вашей платформы.",
    logo: {
      title: "Настроить логотип",
      description:
        "Загрузите свой логотип, чтобы персонализировать ваш чат-бот.",
      add: "Добавить пользовательский логотип",
      recommended: "Рекомендуемый размер: 800 x 200",
      remove: "Удалить",
      replace: "Заменить",
    },
    message: {
      title: "Настроить сообщения",
      description:
        "Настройте автоматические сообщения, отображаемые вашим пользователям.",
      new: "Новое",
      system: "система",
      user: "пользователь",
      message: "сообщение",
      assistant: "Чат-ассистент AnythingLLM",
      "double-click": "Дважды щелкните, чтобы редактировать...",
      save: "Сохранить сообщения",
    },
    icons: {
      title: "Пользовательские иконки в подвале",
      description:
        "Настройте иконки в подвале, отображаемые внизу боковой панели.",
      icon: "Иконка",
      link: "Ссылка",
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
      Active: "Активные домены",
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
    "search-placeholder": "Search data connectors",
    "no-connectors": "No data connectors found.",
    github: {
      name: "GitHub Repo",
      description: "Import an entire public or private Github repository in a single click.",
      URL: "GitHub Repo URL",
      URL_explained: "Url of the GitHub repo you wish to collect.",
      token: "Github Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", the GitHub API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      ignores: "File Ignores",
      git_ignore: "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained: "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from.",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information: "Without filling out the <b>Github Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitHub's public API rate-limits.",
      token_personal: "Get a free Personal Access Token with a GitHub account here."
    },
    gitlab: {
      name: "GitLab Repo",
      description: "Import an entire public or private GitLab repository in a single click.",
      URL: "GitLab Repo URL",
      URL_explained: "URL of the GitLab repo you wish to collect.",
      token: "GitLab Access Token",
      optional: "optional",
      token_explained: "Access Token to prevent rate limiting.",
      token_description: "Select additional entities to fetch from the GitLab API.",
      token_explained_start: "Without a ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", the GitLab API may limit the number of files that can be collected due to rate limits. You can ",
      token_explained_link2: "create a temporary Access Token",
      token_explained_end: " to avoid this issue.",
      fetch_issues: "Fetch Issues as Documents",
      ignores: "File Ignores",
      git_ignore: "List in .gitignore format to ignore specific files during collection. Press enter after each entry you want to save.",
      task_explained: "Once complete, all files will be available for embedding into workspaces in the document picker.",
      branch: "Branch you wish to collect files from",
      branch_loading: "-- loading available branches --",
      branch_explained: "Branch you wish to collect files from.",
      token_information: "Without filling out the <b>GitLab Access Token</b> this data connector will only be able to collect the <b>top-level</b> files of the repo due to GitLab's public API rate-limits.",
      token_personal: "Get a free Personal Access Token with a GitLab account here."
    },
    youtube: {
      name: "YouTube Transcript",
      description: "Import the transcription of an entire YouTube video from a link.",
      URL: "YouTube Video URL",
      URL_explained_start: "Enter the URL of any YouTube video to fetch its transcript. The video must have ",
      URL_explained_link: "closed captions",
      URL_explained_end: " available.",
      task_explained: "Once complete, the transcript will be available for embedding into workspaces in the document picker.",
      language: "Transcript Language",
      language_explained: "Select the language of the transcript you want to collect.",
      loading_languages: "-- loading available languages --"
    },
    "website-depth": {
      name: "Bulk Link Scraper",
      description: "Scrape a website and its sub-links up to a certain depth.",
      URL: "Website URL",
      URL_explained: "URL of the website you want to scrape.",
      depth: "Crawl Depth",
      depth_explained: "This is the number of child-links that the worker should follow from the origin URL.",
      max_pages: "Maximum Pages",
      max_pages_explained: "Maximum number of links to scrape.",
      task_explained: "Once complete, all scraped content will be available for embedding into workspaces in the document picker."
    },
    confluence: {
      name: "Confluence",
      description: "Import an entire Confluence page in a single click.",
      deployment_type: "Confluence deployment type",
      deployment_type_explained: "Determine if your Confluence instance is hosted on Atlassian cloud or self-hosted.",
      base_url: "Confluence base URL",
      base_url_explained: "This is the base URL of your Confluence space.",
      space_key: "Confluence space key",
      space_key_explained: "This is the spaces key of your confluence instance that will be used. Usually begins with ~",
      username: "Confluence Username",
      username_explained: "Your Confluence username.",
      token: "Confluence API Token",
      token_explained_start: "A ",
      token_explained_link1: "Personal API Token",
      token_explained_middle: " is required to access Confluence pages. You can ",
      token_explained_link2: "create an API Token here",
      token_explained_end: ".",
      token_desc: "Access token for authentication.",
      task_explained: "Once complete, the page content will be available for embedding into workspaces in the document picker."
    },

    manage: {
      documents: "Documents",
      "data-connectors": "Data Connectors",
      "desktop-only": "Editing these settings are only available on a desktop device. Please access this page on your desktop to continue.",
      dismiss: "Dismiss",
      editing: "Editing",
    },
    directory: {
      "my-documents": "My Documents",
      "new-folder": "New Folder",
      "search-document": "Search for document",
      "no-documents": "No Documents",
      "move-workspace": "Move to Workspace",
      name: "Name",
      "delete-confirmation": "Are you sure you want to delete these files and folders?\nThis will remove the files from the system and remove them from any existing workspaces automatically.\nThis action is not reversible.",
      "removing-message": "Removing {{count}} documents and {{folderCount}} folders. Please wait.",
      "move-success": "Successfully moved {{count}} documents.",
      date: "Date",
      type: "Type",
      no_docs: "No Documents",
      select_all:"Select All",
      deselect_all:"Deselect All",
      remove_selected: "Remove Selected",
      costs: "*One time cost for embeddings",
      save_embed: "Save and Embed",
    },
    upload: {
      "processor-offline": "Document Processor Unavailable",
      "processor-offline-desc": "We can't upload your files right now because the document processor is offline. Please try again later.",
      "click-upload": "Click to upload or drag and drop",
      "file-types": "supports text files, csv's, spreadsheets, audio files, and more!",
      "or-submit-link": "or submit a link",
      "placeholder-link": "https://example.com",
      "fetching": "Fetching...",
      "fetch-website": "Fetch website",
      "privacy-notice": "These files will be uploaded to the document processor running on this AnythingLLM instance. These files are not sent or shared with a third party.",
    },
    pinning: {
      what_pinning: "What is document pinning?",
      pin_explained_block1: "When you <b>pin</b> a document in AnythingLLM we will inject the entire content of the document into your prompt window for your LLM to fully comprehend.", 
      pin_explained_block2: "This works best with <b>large-context models</b> or small files that are critical to its knowledge-base.",
      pin_explained_block3: "If you are not getting the answers you desire from AnythingLLM by default then pinning is a great way to get higher quality answers in a click.",
      accept: "Okay, got it"
    },
    watching: {
      what_watching: "What does watching a document do?",
      watch_explained_block1: "When you <b>watch</b> a document in AnythingLLM we will <i>automatically</i> sync your document content from it's original source on regular intervals. This will automatically update the content in every workspace where this file is managed.", 
      watch_explained_block2: "This feature currently supports online-based content and will not be available for manually uploaded documents.",
      watch_explained_block3_start: "You can manage what documents are watched from the ",
      watch_explained_block3_link: "File manager",
      watch_explained_block3_end: " admin view.",
      accept: "Okay, got it"
    }
  },

  chat_window:{
    welcome: "Welcome to your new workspace.",
    get_started: "To get started either",
    get_started_default: "To get started",
    upload: "upload a document",
    or: "or",
    send_chat: "send a chat.",
    send_message: "Send a message",
    attach_file: "Attach a file to this chat",
    slash: "View all available slash commands for chatting.",
    agents: "View all available agents you can use for chatting.",
    text_size: "Change text size.",
    microphone: "Speak your prompt.",
    send: "Send prompt message to workspace",
  },

  profile_settings:{
    edit_account: "Edit Account",
    profile_picture: "Profile Picture",
    remove_profile_picture: "Remove Profile Picture",
    username: "Username",
    username_description: "Username must be only contain lowercase letters, numbers, underscores, and hyphens with no spaces",
    new_password: "New Password",
    passwort_description: "Password must be at least 8 characters long",
    cancel: "Cancel",
    update_account: "Update Account",
    theme: "Theme Preference",
    language: "Preferred language",
  },
};

export default TRANSLATIONS;
