// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      title: "Witamy w",
      getStarted: "Rozpocznij",
    },
    llm: {
      title: "Preferencje modeli językowych",
      description:
        "AnythingLLM może współpracować z wieloma dostawcami modeli językowych",
    },
    userSetup: {
      title: "Konfiguracja użytkownika",
      description: "Skonfiguruj ustawienia użytkownika.",
      howManyUsers: "Ilu użytkowników będzie korzystać z tej instancji?",
      justMe: "Tylko ja",
      myTeam: "Mój zespół",
      instancePassword: "Hasło instancji",
      setPassword: "Czy chcesz ustawić hasło?",
      passwordReq: "Hasła muszą składać się z co najmniej 8 znaków.",
      passwordWarn:
        "Ważne jest, aby zapisać to hasło, ponieważ nie ma metody jego odzyskania.",
      adminUsername: "Nazwa użytkownika konta administratora",
      adminUsernameReq:
        "Nazwa użytkownika musi składać się z co najmniej 6 znaków i zawierać wyłącznie małe litery, cyfry, podkreślenia i myślniki bez spacji.",
      adminPassword: "Hasło konta administratora",
      adminPasswordReq: "Hasła muszą składać się z co najmniej 8 znaków.",
      teamHint:
        "Domyślnie będziesz jedynym administratorem. Po zakończeniu wdrażania możesz tworzyć i zapraszać innych użytkowników lub administratorów. Nie zgub hasła, ponieważ tylko administratorzy mogą je resetować.",
    },
    data: {
      title: "Obsługa danych i prywatność",
      description:
        "Dbamy o przejrzystość i kontrolę danych osobowych użytkowników.",
      settingsHint:
        "Ustawienia te można zmienić w dowolnym momencie w ustawieniach.",
    },
    survey: {
      title: "Witamy w AnythingLLM",
      description:
        "Pomóż nam stworzyć AnythingLLM dostosowany do Twoich potrzeb. Opcjonalnie.",
      email: "Jaki jest Twój adres e-mail?",
      useCase: "Do czego będziesz używać AnythingLLM?",
      useCaseWork: "Do pracy",
      useCasePersonal: "Do użytku osobistego",
      useCaseOther: "Inne",
      comment: "Skąd dowiedziałeś się o AnythingLLM?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube itp. - Daj nam znać, jak nas znalazłeś!",
      skip: "Pomiń ankietę",
      thankYou: "Dziękujemy za opinię!",
    },
    workspace: {
      title: "Utwórz swój pierwszy obszar roboczy",
      description:
        "Stwórz swój pierwszy obszar roboczy i zacznij korzystać z AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Nazwa obszaru roboczego",
    error: "błąd",
    success: "sukces",
    user: "Użytkownik",
    selection: "Wybór modelu",
    saving: "Zapisywanie...",
    save: "Zapisz zmiany",
    previous: "Poprzednia strona",
    next: "Następna strona",
    optional: "Opcjonalnie",
    yes: "Tak",
    no: "Nie",
    search: null,
  },
  settings: {
    title: "Ustawienia instancji",
    system: "Ustawienia ogólne",
    invites: "Zaproszenia",
    users: "Użytkownicy",
    workspaces: "Obszary robocze",
    "workspace-chats": "Czaty w obszarach roboczych",
    customization: "Personalizacja",
    interface: "Preferencje interfejsu użytkownika",
    branding: "Branding i white-labeling",
    chat: "Czat",
    "api-keys": "Interfejs API dla programistów",
    llm: "LLM",
    transcription: "Transkrypcja",
    embedder: "Embeddings",
    "text-splitting": "Dzielenie tekstu",
    "voice-speech": "Głos i mowa",
    "vector-database": "Wektorowa baza danych",
    embeds: "Osadzone czaty",
    "embed-chats": "Historia osadzonych czatów",
    security: "Bezpieczeństwo",
    "event-logs": "Dzienniki zdarzeń",
    privacy: "Prywatność i dane",
    "ai-providers": "Dostawcy AI",
    "agent-skills": "Umiejętności agenta",
    admin: "Administrator",
    tools: "Narzędzia",
    "system-prompt-variables": "Zmienne instrukcji systemowej",
    "experimental-features": "Funkcje eksperymentalne",
    contact: "Kontakt z pomocą techniczną",
    "browser-extension": "Rozszerzenie przeglądarki",
  },
  login: {
    "multi-user": {
      welcome: "Witamy w",
      "placeholder-username": "Nazwa użytkownika",
      "placeholder-password": "Hasło",
      login: "Logowanie",
      validating: "Weryfikacja...",
      "forgot-pass": "Nie pamiętam hasła",
      reset: "Reset",
    },
    "sign-in": {
      start: "Zaloguj się do",
      end: "",
    },
    "password-reset": {
      title: "Resetowanie hasła",
      description: "Podaj poniżej niezbędne informacje, aby zresetować hasło.",
      "recovery-codes": "Kody odzyskiwania",
      "recovery-code": "Kod odzyskiwania {{index}}",
      "back-to-login": "Powrót do logowania",
    },
  },
  welcomeMessage: {
    part1:
      "Witamy w AnythingLLM, to narzędzie AI o otwartym kodzie źródłowym autorstwa Mintplex Labs, które zamienia wszystko w wyszkolonego chatbota, z którym można wysyłać zapytania i rozmawiać. AnythingLLM to oprogramowanie BYOK (bring-your-own-keys), więc nie ma subskrypcji ani kosztów za to oprogramowanie poza usługami, których chcesz z nim używać.",
    part2:
      "AnythingLLM to najprostszy sposób na połączenie potężnych produktów AI, takich jak OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB i innych usług w zgrabny pakiet bez zbędnego zamieszania, aby zwiększyć produktywność 100-krotnie.",
    part3:
      "AnythingLLM może działać całkowicie lokalnie na komputerze z niewielkim narzutem, nawet nie zauważysz, że tam jest! Nie jest wymagany procesor graficzny. Dostępna jest również instalacja w chmurze i lokalna. Ekosystem narzędzi AI staje się coraz potężniejszy każdego dnia. AnythingLLM sprawia, że jest on łatwy w użyciu.",
    githubIssue: "Utwórz zgłoszenie w serwisie GitHub",
    user1: "Jak zacząć?",
    part4:
      'To proste. Wszystkie kolekcje są zorganizowane w zbiorach, które nazywamy "obszarami roboczymi". Obszary robocze to zbiory plików, dokumentów, obrazów, plików PDF i innych plików, które zostaną przekształcone w coś, co LLM może zrozumieć i wykorzystać w rozmowie. Pliki można dodawać i usuwać w dowolnym momencie.',
    createWorkspace: "Utwórz swój pierwszy obszar roboczy",
    user2:
      "Czy to coś w rodzaju Dropboxa AI? A co z czatowaniem? To jest chatbot, prawda?",
    part5:
      "AnythingLLM to coś więcej niż inteligentniejszy Dropbox. AnythingLLM oferuje dwa sposoby komunikacji z danymi: <i>Pytanie:</i> Twoje czaty zwrócą dane lub wnioski znalezione w dokumentach w obszarze roboczym, do którego ma dostęp. Dodanie większej liczby dokumentów do obszaru roboczego czyni go bardziej inteligentnym! <i>Konwersacyjny:</i> Twoje dokumenty + bieżąca historia czatów jednocześnie przyczyniają się do wiedzy LLM. Świetnie nadaje się do dodawania informacji tekstowych w czasie rzeczywistym lub poprawek i nieporozumień, które może mieć LLM. Możesz przełączać się między tymi trybami <i>w trakcie rozmowy! </i>",
    user3: "Wow, to brzmi niesamowicie, pozwól mi już to wypróbować!",
    part6: "Miłej zabawy!",
    starOnGitHub: "Star on GitHub",
    contact: "Kontakt z Mintplex Labs",
  },
  "main-page": {
    noWorkspaceError:
      "Przed rozpoczęciem czatu należy utworzyć obszar roboczy.",
    checklist: {
      title: "Pierwsze kroki",
      tasksLeft: "- zadania do wykonania",
      completed:
        "Jesteś na najlepszej drodze do zostania ekspertem AnythingLLM!",
      dismiss: "zamknij",
      tasks: {
        create_workspace: {
          title: "Utwórz obszar roboczy",
          description: "Utwórz swój pierwszy obszar roboczy, aby rozpocząć",
          action: "Utwórz",
        },
        send_chat: {
          title: "Wyślij wiadomość",
          description: "Rozpocznij rozmowę z asystentem AI",
          action: "Czat",
        },
        embed_document: {
          title: "Dodaj źródło danych",
          description: "Dodaj swoje pierwsze dane",
          action: "Dodaj",
        },
        setup_system_prompt: {
          title: "Konfiguracja instrukcji systemowej",
          description: "Konfiguracja zachowania asystenta AI",
          action: "Konfiguruj",
        },
        define_slash_command: {
          title: "Stwórz polecenie slash",
          description: "Tworzenie niestandardowych poleceń dla asystenta",
          action: "Stwórz",
        },
        visit_community: {
          title: "Odwiedź Community Hub",
          description: "Przeglądaj zasoby i szablony społeczności",
          action: "Przeglądaj",
        },
      },
    },
    quickLinks: {
      title: "Szybkie akcje",
      sendChat: "Wyślij wiadomość",
      embedDocument: "Dodaj swoje dane",
      createWorkspace: "Utwórz obszar roboczy",
    },
    exploreMore: {
      title: "Poznaj więcej funkcji",
      features: {
        customAgents: {
          title: "Niestandardowi agenci AI",
          description:
            "Twórz potężnych agentów AI i automatyzacje bez użycia kodu.",
          primaryAction: "Czat przy użyciu @agent",
          secondaryAction: "Zbuduj Agents Flow",
        },
        slashCommands: {
          title: "Polecenia slash",
          description:
            "Oszczędzaj czas i dodawaj prompty dzięki niestandardowym poleceniom slash.",
          primaryAction: "Utwórz polecenie slash",
          secondaryAction: "Przeglądaj Community Hub",
        },
        systemPrompts: {
          title: "Instrukcje systemowe",
          description:
            "Zmodyfikuj instrukcję systemową, aby dostosować odpowiedzi AI.",
          primaryAction: "Modyfikuj instrukcję systemową",
          secondaryAction: "Zarządzaj zmiennymi",
        },
      },
    },
    announcements: {
      title: "Aktualizacje i ogłoszenia",
    },
    resources: {
      title: "Zasoby",
      links: {
        docs: "Dokumenty",
        star: "Star on GitHub",
      },
      keyboardShortcuts: "Skróty klawiaturowe",
    },
  },
  "new-workspace": {
    title: "Nowy obszar roboczy",
    placeholder: "Mój obszar roboczy",
  },
  "workspaces—settings": {
    general: "Ustawienia ogólne",
    chat: "Ustawienia czatu",
    vector: "Wektorowa baza danych",
    members: "Członkowie",
    agent: "Konfiguracja agenta",
  },
  general: {
    vector: {
      title: "Liczba wektorów",
      description: "Całkowita liczba wektorów w bazie danych wektorów.",
    },
    names: {
      description:
        "Spowoduje to jedynie zmianę wyświetlanej nazwy obszaru roboczego.",
    },
    message: {
      title: "Sugerowane wiadomości na czacie",
      description: "Dostosuj wiadomości, które będą sugerowane użytkownikom.",
      add: "Dodaj nową wiadomość",
      save: "Zapisz wiadomości",
      heading: "Wyjaśnij mi",
      body: "Korzyści z AnythingLLM",
    },
    pfp: {
      title: "Logo obszaru roboczego",
      description: "Dostosuj logo asystenta dla tego obszaru roboczego.",
      image: "Logo obszaru roboczego",
      remove: "Usuń logo obszaru roboczego",
    },
    delete: {
      title: "Usuń obszar roboczy",
      description:
        "Usuń ten obszar roboczy i wszystkie jego dane. Spowoduje to usunięcie obszaru roboczego dla wszystkich użytkowników.",
      delete: "Usuń obszar roboczy",
      deleting: "Usuwanie obszaru roboczego...",
      "confirm-start": "Zamierzasz usunąć cały swój",
      "confirm-end":
        "obszar roboczy. Spowoduje to usunięcie wszystkich danych z wektorowej bazy danych. Oryginalne pliki źródłowe pozostaną nietknięte. Działanie to jest nieodwracalne.",
    },
  },
  chat: {
    llm: {
      title: "Dostawca modeli językowych dla obszaru roboczego",
      description:
        "Konkretny dostawca i model LLM, który będzie używany dla tego obszaru roboczego. Domyślnie używany jest dostawca i model z preferencji systemowych.",
      search: "Wyszukaj wszystkich dostawców LLM",
    },
    model: {
      title: "Model językowy dla obszaru roboczego",
      description:
        "Określony model, który będzie używany w tym obszarze roboczym. Jeśli pole jest puste, użyty zostanie model z preferencji systemowych.",
      wait: "-- oczekiwanie na modele",
    },
    mode: {
      title: "Tryb czatu",
      chat: {
        title: "Czat",
        "desc-start": "dostarczy odpowiedzi na podstawie wiedzy ogólnej LLM",
        and: "oraz",
        "desc-end": " znalezionym kontekście (dokumenty, źródła danych)",
      },
      query: {
        title: "Zapytanie (wyszukiwanie)",
        "desc-start": "dostarczy odpowiedzi",
        only: "tylko",
        "desc-end":
          "na podstawie znalezionego kontekstu (dokumenty, źródła danych) - w przeciwnym razie odmówi odpowiedzi.",
      },
    },
    history: {
      title: "Historia czatu",
      "desc-start":
        "Liczba poprzednich wiadomości, które zostaną uwzględnione w pamięci krótkotrwałej",
      recommend: "Zalecane: 20.",
      "desc-end":
        "Więcej niż 45 może prowadzić do problemów z działaniem czatu.",
    },
    prompt: {
      title: "Instrukcja systemowa",
      description:
        "Instrukcja, która będzie używana w tym obszarze roboczym. Zdefiniuj kontekst i instrukcje dla AI. Powinieneś dostarczyć starannie opracowaną instrukcję, aby AI mogło wygenerować odpowiednią i dokładną odpowiedź.",
      history: {
        title: "Historia instrukcji systemowych",
        clearAll: "Wyczyść wszystko",
        noHistory: "Historia instrukcji systemowych nie jest dostępna",
        restore: "Przywróć",
        delete: "Usuń",
        publish: "Opublikuj w Community Hub",
        deleteConfirm: "Czy na pewno chcesz usunąć ten element historii?",
        clearAllConfirm:
          "Czy na pewno chcesz wyczyścić całą historię? Tej czynności nie można cofnąć.",
        expand: "Rozwiń",
      },
    },
    refusal: {
      title: "Tryb zapytania - odpowiedź odmowna",
      "desc-start": "W trybie",
      query: "zapytania (wyszukiwanie)",
      "desc-end":
        "istnieje możliwość zwrócenia niestandardowej odpowiedzi odmownej, w sytuacji gdy nie znaleziono odpowiedniego kontekstu.",
      "tooltip-title": "Dlaczego to widzę?",
      "tooltip-description":
        "Jesteś w trybie zapytań, który wykorzystuje tylko informacje z Twoich dokumentów. Przełącz się do trybu czatu, aby uzyskać bardziej elastyczne rozmowy, lub kliknij tutaj, aby odwiedzić naszą dokumentację i dowiedzieć się więcej o trybach czatu.",
    },
    temperature: {
      title: "Temperatura modelu",
      "desc-start":
        'To ustawienie kontroluje, jak "kreatywne" będą odpowiedzi modelu językowego.',
      "desc-end":
        "Im wyższa liczba, tym większa kreatywność. W przypadku niektórych modeli może to prowadzić do niespójnych odpowiedzi przy zbyt wysokich ustawieniach.",
      hint: "Większość modeli językowych ma różne dopuszczalne zakresy wartości. Informacje na ten temat można uzyskać u dostawcy modelu językowego.",
    },
  },
  "vector-workspace": {
    identifier: "Identyfikator wektorowej bazy danych",
    snippets: {
      title: "Maksymalna liczba fragmentów",
      description:
        "To ustawienie kontroluje maksymalną ilość fragmentów kontekstu, które zostaną wysłane do modelu językowego.",
      recommend: "Zalecane: 4",
    },
    doc: {
      title: "Próg podobieństwa dokumentów",
      description:
        "Minimalny wynik podobieństwa wymagany do uznania źródła za powiązane z czatem. Im wyższa liczba, tym bardziej źródło musi być powiązane z czatem.",
      zero: "Brak ograniczeń",
      low: "Niski (wynik podobieństwa ≥ .25)",
      medium: "Średni (wynik podobieństwa ≥ .50)",
      high: "Wysoki (wynik podobieństwa ≥ .75)",
    },
    reset: {
      reset: "Resetuj bazę wektorową",
      resetting: "Czyszczenie wektorów...",
      confirm:
        "Baza danych wektorów tego obszaru roboczego zostanie zresetowana. Spowoduje to usunięcie wszystkich aktualnie osadzonych wektorów. Oryginalne pliki źródłowe pozostaną nietknięte. Ta czynność jest nieodwracalna.",
      error: "Nie można zresetować bazy danych wektorów obszaru roboczego!",
      success: "Baza danych wektorów obszaru roboczego została zresetowana!",
    },
  },
  agent: {
    "performance-warning":
      "Wydajność modeli LLM, które nie obsługują bezpośrednio wywoływania narzędzi, zależy w dużym stopniu od możliwości i dokładności modelu. Niektóre możliwości mogą być ograniczone lub niefunkcjonalne.",
    provider: {
      title: "Dostawca LLM dla agenta",
      description:
        "Konkretny dostawca i model LLM, który będzie używany dla agenta @agent, w tym obszarze roboczym.",
    },
    mode: {
      chat: {
        title: "Model czatu agenta",
        description:
          "Konkretny model czatu, który będzie używany dla agenta @agent tego obszaru roboczego.",
      },
      title: "Model agenta",
      description:
        "Konkretny model LLM, który będzie używany dla agenta @agent tego obszaru roboczego.",
      wait: "-- oczekiwanie na modele",
    },
    skill: {
      title: "Domyślne umiejętności agenta",
      description:
        "Ulepsz naturalne zdolności domyślnego agenta za pomocą tych gotowych umiejętności. Ta konfiguracja dotyczy wszystkich obszarów roboczych.",
      rag: {
        title: "RAG i pamięć długotrwała",
        description:
          'Pozwól agentowi wykorzystać twoje lokalne dokumenty, aby odpowiedzieć na zapytanie lub poproś agenta o "zapamiętanie" fragmentów treści w celu odzyskania pamięci długoterminowej.',
      },
      view: {
        title: "Wyświetlanie i podsumowywanie dokumentów",
        description:
          "Umożliwienie agentowi wyświetlenia listy i podsumowania zawartości aktualnie osadzonych plików obszaru roboczego.",
      },
      scrape: {
        title: "Pobieranie treści stron internetowych",
        description:
          "Zezwalaj agentowi na odwiedzanie i pobieranie zawartości stron internetowych.",
      },
      generate: {
        title: "Generowanie wykresów",
        description:
          "Pozwól domyślnemu agentowi generować różne typy wykresów na podstawie danych dostarczonych lub podanych na czacie.",
      },
      save: {
        title: "Generowanie i zapisywanie plików w przeglądarce",
        description:
          "Pozwól domyślnemu agentowi generować i zapisywać pliki, które można zapisać i pobrać w przeglądarce.",
      },
      web: {
        title: "Wyszukiwanie i przeglądanie stron internetowych na żywo",
        "desc-start":
          "Pozwól swojemu agentowi przeszukiwać Internet w celu uzyskania odpowiedzi na pytania, łącząc się z dostawcą wyszukiwania internetowego (SERP).",
        "desc-end":
          "Wyszukiwanie w sieci podczas sesji agenta nie będzie działać, dopóki nie zostanie to skonfigurowane.",
      },
    },
  },
  recorded: {
    title: "Czaty w obszarach roboczych",
    description:
      "Są to wszystkie czaty i wiadomości wysłane przez użytkowników uporządkowane według daty utworzenia.",
    export: "Eksport",
    table: {
      id: "ID",
      by: "Wysłane przez",
      workspace: "Obszar roboczy",
      prompt: "Prompt",
      response: "Odpowiedź",
      at: "Wysłane o",
    },
  },
  customization: {
    interface: {
      title: "Preferencje interfejsu użytkownika",
      description: "Ustaw preferencje interfejsu użytkownika dla AnythingLLM.",
    },
    branding: {
      title: "Branding i white-labeling",
      description:
        "Oznakuj swoją instancję AnythingLLM niestandardowym brandingiem.",
    },
    chat: {
      title: "Czat",
      description: "Ustaw preferencje czatu dla AnythingLLM.",
      auto_submit: {
        title: "Automatyczne przesyłanie mowy",
        description: "Automatyczne przesyłanie mowy po wykryciu ciszy.",
      },
      auto_speak: {
        title: "Automatyczne wypowiadanie odpowiedzi",
        description: "Automatycznie wypowiadaj odpowiedzi AI.",
      },
      spellcheck: {
        title: "Włącz sprawdzanie pisowni",
        description:
          "Włącz lub wyłącz sprawdzanie pisowni w polu wprowadzania tekstu.",
      },
    },
    items: {
      theme: {
        title: "Motyw",
        description: "Wybierz preferowany motyw kolorystyczny dla aplikacji.",
      },
      "show-scrollbar": {
        title: "Pokaż pasek przewijania",
        description: "Włącz lub wyłącz pasek przewijania w oknie czatu.",
      },
      "support-email": {
        title: "E-mail wsparcia",
        description:
          "Ustaw adres e-mail, który będzie dostępny dla użytkowników, gdy potrzebują pomocy.",
      },
      "app-name": {
        title: "Nazwa",
        description:
          "Ustawienie nazwy wyświetlanej na stronie logowania dla wszystkich użytkowników.",
      },
      "chat-message-alignment": {
        title: "Wyrównanie wiadomości czatu",
        description:
          "Wybór trybu wyrównania wiadomości podczas korzystania z interfejsu czatu.",
      },
      "display-language": {
        title: "Język",
        description:
          "Wybierz preferowany język interfejsu użytkownika AnythingLLM - jeśli dostępne są tłumaczenia.",
      },
      logo: {
        title: "Logo",
        description:
          "Prześlij swoje niestandardowe logo, aby wyświetlić je na wszystkich stronach.",
        add: "Dodaj niestandardowe logo",
        recommended: "Zalecany rozmiar: 800 x 200",
        remove: "Usuń",
        replace: "Zmień",
      },
      "welcome-messages": {
        title: "Ekran powitalny",
        description:
          "Dostosuj komunikaty wyświetlane użytkownikom na ekranie powitalnym. Będą widoczne tylko dla użytkowników, którzy nie są administratorami.",
        new: "Nowa wiadomość",
        system: "systemu",
        user: "użytkownika",
        message: "",
        assistant: "Asystent czatu AnythingLLM",
        "double-click": "Kliknij dwukrotnie, aby edytować...",
        save: "Zapisz wiadomości",
      },
      "browser-appearance": {
        title: "Wygląd przeglądarki",
        description:
          "Dostosuj wygląd karty przeglądarki, gdy aplikacja jest otwarta.",
        tab: {
          title: "Tytuł",
          description:
            "Ustawienie niestandardowego tytułu karty, gdy aplikacja jest otwarta w przeglądarce.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Użyj niestandardowej ikony favicon dla karty przeglądarki.",
        },
      },
      "sidebar-footer": {
        title: "Linki w stopce",
        description: "Dostosuj linki wyświetlane w stopce paska bocznego.",
        icon: "Ikona",
        link: "Link",
      },
    },
  },
  api: {
    title: "Klucze API",
    description:
      "Klucze API umożliwiają dostęp do instancji AnythingLLM i zarządzanie nią.",
    link: "Przeczytaj dokumentację API",
    generate: "Generuj nowy klucz API",
    table: {
      key: "Klucz API",
      by: "Utworzony przez",
      created: "Utworzony o",
    },
  },
  llm: {
    title: "Preferencje LLM",
    description:
      "Tutaj skonfigurujesz dostawcę modeli językowych używanych do czatów i embeddingów. Upewnij się, że wszystkie klucze są aktualne i poprawne - bez tego AnythingLLM nie będzie działać.",
    provider: "Dostawca LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Punkt końcowy usługi Azure",
        api_key: "Klucz API",
        chat_deployment_name: "Nazwa wdrożenia czatu",
        chat_model_token_limit: "Limit tokenów modelu czatu",
        model_type: "Typ modelu",
        default: "Domyślne",
        reasoning: "Uzasadnienie",
      },
    },
  },
  transcription: {
    title: "Preferencje modelu transkrypcji",
    description:
      "Tutaj skonfigurujesz dostawcę modeli używanych do transkrypcji plików audio i wideo. Upewnij się, że klucze są poprawne - bez tego pliki audio nie będą transkrybowane.",
    provider: "Dostawca usług transkrypcji",
    "warn-start":
      "Korzystanie z lokalnego modelu Whisper na komputerach z ograniczoną pamięcią RAM lub procesorem może spowodować przerwanie pracy AnythingLLM podczas przetwarzania plików multimedialnych.",
    "warn-recommend":
      "Zalecana konfiguracja to co najmniej 2 GB pamięci RAM, przesyłaj pliki <10 MB.",
    "warn-end":
      "Wbudowany model zostanie automatycznie pobrany przy pierwszym użyciu.",
  },
  embedding: {
    title: "Preferencje dot. embeddingów",
    "desc-start":
      "W przypadku korzystania z LLM, który nie obsługuje natywnie silnika embeddingów - może być konieczna dodatkowa konfiguracja poświadczeń.",
    "desc-end":
      "Embedding to proces przekształcania tekstu na wektory. Poświadczenia są wymagane do przekształcenia plików i tekstu za pomocą wybranego modelu.",
    provider: {
      title: "Model używany do tworzenia embeddingów",
      description:
        "Podczas korzystania z natywnego silnika osadzania AnythingLLM nie jest wymagana żadna konfiguracja.",
    },
  },
  text: {
    title: "Preferencje dot. podziału tekstu i dzielenia na fragmenty",
    "desc-start":
      "Czasami może zaistnieć potrzeba zmiany domyślnego sposobu, w jaki nowe dokumenty są dzielone i fragmentowane przed wstawieniem ich do wektorowej bazy danych.",
    "desc-end":
      "Powinieneś modyfikować to ustawienie tylko wtedy, gdy rozumiesz, jak działa dzielenie tekstu i jakie są jego skutki uboczne.",
    "warn-start": "Zmiany tutaj będą miały zastosowanie tylko do",
    "warn-center": "nowo osadzone dokumenty",
    "warn-end": "a nie istniejące dokumenty.",
    size: {
      title: "Rozmiar fragmentu tekstu",
      description:
        "Jest to maksymalna długość znaków, które mogą występować w pojedynczym wektorze.",
      recommend: "Maksymalna długość modelu osadzonego wynosi",
    },
    overlap: {
      title: "Nakładanie się fragmentów tekstu",
      description:
        "Jest to maksymalna liczba nakładających się znaków, które występuje podczas fragmentacji między dwoma sąsiednimi fragmentami tekstu.",
    },
  },
  vector: {
    title: "Wektorowa baza danych",
    description:
      "Tutaj skonfigurujesz wektorową bazę danych dla AnythingLLM. Upewnij się, że wszystkie ustawienia są poprawne.",
    provider: {
      title: "Wektorowa baza danych",
      description: "LanceDB nie wymaga żadnej konfiguracji.",
    },
  },
  embeddable: {
    title: "Osadzone widżety czatu",
    description:
      "Osadzane widżety czatu to publiczne interfejsy czatu, które są powiązane z pojedynczym obszarem roboczym. Umożliwiają one tworzenie przestrzeni roboczych, które następnie można publikować na całym świecie.",
    create: "Utwórz osadzenie",
    table: {
      workspace: "Obszar roboczy",
      chats: "Wysłane wiadomości",
      active: "Aktywne domeny",
      created: "Utworzony",
    },
  },
  "embed-chats": {
    title: "Historia czatu",
    export: "Eksport",
    description:
      "Są to wszystkie czaty i wiadomości z dowolnego opublikowanego widżetu czatu.",
    table: {
      embed: "Obszar roboczy",
      sender: "Nadawca",
      message: "Wiadomość",
      response: "Odpowiedź",
      at: "Wysłane o",
    },
  },
  multi: {
    title: "Tryb wielu użytkowników",
    description:
      "Skonfiguruj swoją instancję do obsługi zespołu, aktywując tryb wielu użytkowników.",
    enable: {
      "is-enable": "Tryb wielu użytkowników jest włączony",
      enable: "Włącz tryb wielu użytkowników",
      description:
        "Domyślnie będziesz jedynym administratorem. Jako administrator będziesz musiał utworzyć konta dla wszystkich nowych użytkowników lub administratorów. Nie zgub hasła, ponieważ tylko administrator może je zresetować.",
      username: "Nazwa użytkownika konta administratora",
      password: "Hasło konta administratora",
    },
    password: {
      title: "Ochrona hasłem",
      description:
        "Chroń swoją instancję AnythingLLM hasłem. Jeśli go zapomnisz, nie ma metody odzyskiwania, więc upewnij się, że zapisałeś to hasło.",
    },
    instance: {
      title: "Wystąpienie chronione hasłem",
      description:
        "Domyślnie będziesz jedynym administratorem. Jako administrator będziesz musiał utworzyć konta dla wszystkich nowych użytkowników lub administratorów. Nie zgub hasła, ponieważ tylko administrator może je zresetować.",
      password: "Hasło instancji",
    },
  },
  event: {
    title: "Dzienniki zdarzeń",
    description: "Wyświetl wszystkie akcje i zdarzenia.",
    clear: "Wyczyść dzienniki zdarzeń",
    table: {
      type: "Typ zdarzenia",
      user: "Użytkownik",
      occurred: "Wystąpiło o",
    },
  },
  privacy: {
    title: "Prywatność i obsługa danych",
    description:
      "Jest to konfiguracja sposobu, w jaki połączeni dostawcy zewnętrzni i AnythingLLM przetwarzają dane użytkownika.",
    llm: "Wybór LLM",
    embedding: "Preferencje dotyczące osadzania",
    vector: "Wektorowa baza danych",
    anonymous: "Włączona anonimowa telemetria",
  },
  connectors: {
    "search-placeholder": "Wyszukaj źródła danych",
    "no-connectors": "Nie znaleziono źródeł danych.",
    obsidian: {
      name: "Obsidian",
      description: "Zaimportuj folder Obsidian jednym kliknięciem.",
      vault_location: "Lokalizacja folderu Obsidian",
      vault_description:
        "Wybierz folder Obsidian, aby zaimportować wszystkie notatki i ich połączenia.",
      selected_files: "Znaleziono {{count}} plików markdown",
      importing: "Importowanie folderu Obsidian...",
      import_vault: "Importuj folder",
      processing_time:
        "Może to trochę potrwać w zależności od wielkości folderu.",
      vault_warning:
        "Aby uniknąć konfliktów, upewnij się, że folder Obsidian nie jest aktualnie otwarty.",
    },
    github: {
      name: "GitHub Repo",
      description:
        "Zaimportuj całe publiczne lub prywatne repozytorium GitHub jednym kliknięciem.",
      URL: "Adres URL repozytorium GitHub",
      URL_explained: "Adres URL repozytorium GitHub, które chcesz pobrać.",
      token: "Token dostępu GitHub",
      optional: "opcjonalny",
      token_explained: "Token dostępu, zapobiegający ograniczeniu szybkości.",
      token_explained_start: "Bez ",
      token_explained_link1: "Osobistego tokenu dostępu ",
      token_explained_middle:
        "API GitHub może ograniczać liczbę plików, które mogą zostać pobrane ze względu na limity szybkości. Utwórz",
      token_explained_link2: " tymczasowy token dostępu",
      token_explained_end: " aby uniknąć tego problemu.",
      ignores: "Ignorowane pliki",
      git_ignore:
        "Lista w formacie .gitignore. Naciśnij enter po każdym wpisie, aby go zapisać.",
      task_explained:
        "Po zakończeniu wszystkie pliki będą dostępne do osadzenia w obszarach roboczych w selektorze dokumentów.",
      branch: "Gałąź, z której mają być pobierane pliki.",
      branch_loading: "-- ładowanie dostępnych gałęzi",
      branch_explained: "Gałąź, z której mają być pobierane pliki.",
      token_information:
        "Bez wypełnienia <b>GitHub Access Token</b> ten konektor danych będzie mógł pobierać tylko pliki <b>z głównego katalogu</b> repozytorium ze względu na ograniczenia szybkości publicznego API GitHub.",
      token_personal:
        "Uzyskaj bezpłatny osobisty token dostępu do konta GitHub tutaj.",
    },
    gitlab: {
      name: "GitLab Repo",
      description:
        "Zaimportuj całe publiczne lub prywatne repozytorium GitLab jednym kliknięciem.",
      URL: "Adres URL repozytorium GitLab",
      URL_explained: "Adres URL repozytorium GitLab, które chcesz pobrać.",
      token: "Token dostępu GitLab",
      optional: "opcjonalny",
      token_explained: "Token dostępu, zapobiegający ograniczeniu szybkości.",
      token_description:
        "Wybierz dodatkowe elementy do pobrania z interfejsu API GitLab.",
      token_explained_start: "Bez ",
      token_explained_link1: "Osobistego tokenu dostępu ",
      token_explained_middle:
        "API GitLab może ograniczyć liczbę plików, które mogą zostać pobrane ze względu na limity szybkości. Utwórz",
      token_explained_link2: " tymczasowy token dostępu",
      token_explained_end: " aby uniknąć tego problemu.",
      fetch_issues: "Pobierz Issues jako Dokumenty",
      ignores: "Ignorowane pliki",
      git_ignore:
        "Lista w formacie .gitignore. Naciśnij enter po każdym wpisie, aby go zapisać.",
      task_explained:
        "Po zakończeniu wszystkie pliki będą dostępne do osadzenia w obszarach roboczych w selektorze dokumentów.",
      branch: "Gałąź, z której chcesz pobierać pliki",
      branch_loading: "-- ładowanie dostępnych gałęzi",
      branch_explained: "Gałąź, z której mają być pobierane pliki.",
      token_information:
        "Bez wypełnienia <b>GitLab Access Token</b> ten konektor danych będzie mógł pobierać tylko pliki <b>z głównego katalogu</b> repozytorium ze względu na ograniczenia szybkości publicznego API GitLab.",
      token_personal:
        "Uzyskaj bezpłatny osobisty token dostępu do konta GitLab tutaj.",
    },
    youtube: {
      name: "Transkrypcja YouTube",
      description: "Zaimportuj transkrypcję całego filmu YouTube z łącza.",
      URL: "Adres URL filmu YouTube",
      URL_explained_start:
        "Wprowadź adres URL dowolnego filmu z YouTube, aby pobrać jego transkrypcję. Film musi zawierać",
      URL_explained_link: " napisy",
      URL_explained_end: ".",
      task_explained:
        "Po zakończeniu transkrypcja będzie dostępna do osadzenia w obszarach roboczych w selektorze dokumentów.",
      language: "Język transkrypcji",
      language_explained: "Wybierz język transkrypcji, którą chcesz pobrać.",
      loading_languages: "-- wczytywanie dostępnych języków",
    },
    "website-depth": {
      name: "Masowe pobieranie zawartości web",
      description:
        "Pobiera treści ze strony internetowej wraz z jej podstronami do określonej głębokości (liczby podstron).",
      URL: "Adres URL witryny",
      URL_explained:
        "Adres URL strony internetowej, z której chcesz pobrać treści.",
      depth: "Głębokość przeszukiwania",
      depth_explained:
        "Określa ile poziomów podstron zostanie przeszukanych począwszy od głównego adresu URL.",
      max_pages: "Maksymalna liczba stron",
      max_pages_explained: "Maksymalna liczba stron do pobrania.",
      task_explained:
        "Po zakończeniu cała pobrana zawartość będzie dostępna do dodania w obszarach roboczych w oknie dodawania danych.",
    },
    confluence: {
      name: "Confluence",
      description: "Zaimportuj całą stronę Confluence jednym kliknięciem.",
      deployment_type: "Rodzaj wdrożenia Confluence",
      deployment_type_explained:
        "Określ, czy instancja Confluence jest hostowana w chmurze Atlassian, czy samodzielnie.",
      base_url: "Bazowy adres URL Confluence",
      base_url_explained: "Jest to podstawowy adres URL Confluence.",
      space_key: "Klucz przestrzeni Confluence",
      space_key_explained:
        "Jest to klucz instancji Confluence. Zwykle zaczyna się od ~",
      username: "Nazwa użytkownika Confluence",
      username_explained: "Nazwa użytkownika Confluence",
      auth_type: "Typ autoryzacji Confluence",
      auth_type_explained:
        "Wybierz typ uwierzytelniania, którego chcesz użyć do uzyskania dostępu do Confluence.",
      auth_type_username: "Nazwa użytkownika i token dostępu",
      auth_type_personal: "Osobisty token dostępu",
      token: "Token dostępu do Confluence",
      token_explained_start:
        "W celu uwierzytelnienia należy podać token dostępu. Token dostępu można wygenerować ",
      token_explained_link: "tutaj",
      token_desc: "Token dostępu",
      pat_token: "Osobisty token dostępu do Confluence",
      pat_token_explained: "Osobisty token dostępu do Confluence.",
      task_explained:
        "Po zakończeniu zawartość strony będzie dostępna do osadzenia w obszarach roboczych w selektorze dokumentów.",
    },
    manage: {
      documents: "Dokumenty",
      "data-connectors": "Źródła danych",
      "desktop-only":
        "Edycja tych ustawień jest dostępna tylko w wersji desktopowej. Aby kontynuować, przejdź do tej strony na komputerze.",
      dismiss: "Odrzuć",
      editing: "Edycja",
    },
    directory: {
      "my-documents": "Moje dokumenty",
      "new-folder": "Nowy folder",
      "search-document": "Wyszukiwanie dokumentu",
      "no-documents": "Brak dokumentów",
      "move-workspace": "Przenieś do obszaru roboczego",
      name: "Nazwa",
      "delete-confirmation":
        "Czy na pewno chcesz usunąć te pliki i foldery? Spowoduje to usunięcie plików z systemu i automatyczne usunięcie ich z istniejących obszarów roboczych. Działanie to nie jest odwracalne.",
      "removing-message":
        "Usuwanie dokumentów {{count}} i folderów {{folderCount}}. Proszę czekać.",
      "move-success": "Pomyślnie przeniesiono {{count}} dokumentów.",
      date: "Data",
      type: "Typ",
      no_docs: "Brak dokumentów",
      select_all: "Wybierz wszystko",
      deselect_all: "Odznacz wszystko",
      remove_selected: "Usuń wybrane",
      costs: "*Jednorazowy koszt dodania danych",
      save_embed: "Zapisz",
    },
    upload: {
      "processor-offline": "Procesor dokumentów niedostępny",
      "processor-offline-desc":
        "Nie możemy teraz przesłać plików, ponieważ procesor dokumentów jest w trybie offline. Spróbuj ponownie później.",
      "click-upload": "Kliknij, aby przesłać lub przeciągnij i upuść",
      "file-types":
        "obsługuje pliki tekstowe, csv, arkusze kalkulacyjne, pliki audio i wiele więcej!",
      "or-submit-link": "lub prześlij link",
      "placeholder-link": "https://example.com",
      fetching: "Pobieranie...",
      "fetch-website": "Pobierz zawartość strony",
      "privacy-notice":
        "Pliki zostaną przetworzone w obrębie danej instancji AnythingLLM. Pliki te nie będą udostępniane innym podmiotom.",
    },
    pinning: {
      what_pinning: "Czym jest przypinanie dokumentów?",
      pin_explained_block1:
        "Kiedy <b>przypinasz</b> dokument w AnythingLLM, dodamy całą zawartość dokumentu do okna promptu, aby LLM mógł w pełni zrozumieć jego treść.",
      pin_explained_block2:
        "Działa to najlepiej w przypadku <b>dużych modeli kontekstowych</b> lub małych plików, które są krytyczne dla bazy wiedzy.",
      pin_explained_block3:
        "Jeśli domyślnie nie otrzymujesz pożądanych odpowiedzi z AnythingLLM, przypinanie jest świetnym sposobem na uzyskanie wyższej jakości odpowiedzi za jednym kliknięciem.",
      accept: "Ok, rozumiem",
    },
    watching: {
      what_watching: "Do czego służy oglądanie dokumentu?",
      watch_explained_block1:
        "Podczas <b>obserwowania</b> dokumentu w AnythingLLM będziemy <i>automatycznie</i> synchronizować zawartość dokumentu z jego oryginalnym źródłem w regularnych odstępach czasu. Spowoduje to automatyczną aktualizację zawartości w każdym obszarze roboczym, w którym ten plik jest zarządzany.",
      watch_explained_block2:
        "Ta funkcja obsługuje obecnie treści online i nie będzie dostępna dla dokumentów przesyłanych ręcznie.",
      watch_explained_block3_start:
        "Możesz zarządzać obserwowanymi dokumentami z poziomu",
      watch_explained_block3_link: "Menedżer plików",
      watch_explained_block3_end: " widok administratora.",
      accept: "Ok, rozumiem",
    },
  },
  chat_window: {
    welcome: "Witamy w nowym obszarze roboczym.",
    get_started: "Aby rozpocząć",
    get_started_default: "Aby rozpocząć",
    upload: "Prześlij dokument",
    or: "lub",
    attachments_processing: "Załączniki są przetwarzane. Proszę czekać...",
    send_chat: "wyślij wiadomość.",
    send_message: "Wyślij wiadomość",
    attach_file: "Dołącz plik do tego czatu",
    slash: "Wyświetl wszystkie dostępne polecenia slash do czatowania.",
    agents: "Wyświetl wszystkich dostępnych agentów.",
    text_size: "Zmiana rozmiaru tekstu.",
    microphone: "Wypowiedz swoją prośbę.",
    send: "Wyślij wiadomość do obszaru roboczego",
    tts_speak_message: "Wypowiedz komunikat głosowo",
    copy: "Kopiuj",
    regenerate: "Generuj ponownie",
    regenerate_response: "Wygeneruj ponownie odpowiedź",
    good_response: "Dobra odpowiedź",
    more_actions: "Więcej działań",
    hide_citations: "Ukryj cytaty",
    show_citations: "Pokaż cytaty",
    pause_tts_speech_message: "Wstrzymaj głosowe wypowiadanie komunikatu",
    fork: "Utwórz rozgałęzienie",
    delete: "Usuń",
    save_submit: "Zapisz i prześlij",
    cancel: "Anuluj",
    edit_prompt: "Edytuj prompt",
    edit_response: "Edytuj odpowiedź",
    at_agent: "@agent",
    default_agent_description: " - domyślny agent dla tego obszaru roboczego.",
    custom_agents_coming_soon: "niestandardowi agenci już wkrótce!",
    slash_reset: "/reset",
    preset_reset_description: "Wyczyść historię czatu i rozpocznij nowy czat",
    add_new_preset: " Dodaj nowe polecenie slash",
    command: "Polecenie",
    your_command: "twoje-polecenie",
    placeholder_prompt: "Ta treść zostanie dodana przed Twoim pytaniem.",
    description: "Opis",
    placeholder_description: "Stwórz opis swojego polecenia slash.",
    save: "Zapisz",
    small: "Mały",
    normal: "Normalny",
    large: "Duży",
    workspace_llm_manager: {
      search: "Wyszukaj dostawców LLM",
      loading_workspace_settings: "Ładowanie ustawień obszaru roboczego...",
      available_models: "Dostępne modele dla {{provider}}",
      available_models_description:
        "Wybierz model, który będzie używany w tym obszarze roboczym.",
      save: "Użyj tego modelu",
      saving: "Ustawienie modelu jako domyślnego dla obszaru roboczego...",
      missing_credentials: "Temu dostawcy brakuje poświadczeń!",
      missing_credentials_description:
        "Kliknij, aby skonfigurować poświadczenia",
    },
  },
  profile_settings: {
    edit_account: "Edytuj konto",
    profile_picture: "Zdjęcie profilowe",
    remove_profile_picture: "Usuń zdjęcie profilowe",
    username: "Nazwa użytkownika",
    username_description:
      "Nazwa użytkownika musi zawierać tylko małe litery, cyfry, podkreślenia i myślniki bez spacji.",
    new_password: "Nowe hasło",
    password_description: null,
    cancel: "Anuluj",
    update_account: "Zaktualizuj konto",
    theme: "Preferencje dotyczące motywu",
    language: "Preferowany język",
    failed_upload: "Nie udało się przesłać zdjęcia profilowego: {{error}}.",
    upload_success: "Dodano zdjęcie profilowe.",
    failed_remove: "Nie udało się usunąć zdjęcia profilowego: {{error}}.",
    profile_updated: "Profil został zaktualizowany.",
    failed_update_user: "Nie udało się zaktualizować użytkownika: {{error}}.",
    account: "Konto",
    support: "Wsparcie",
    signout: "Wyloguj się",
  },
  "keyboard-shortcuts": {
    title: "Skróty klawiaturowe",
    shortcuts: {
      settings: "Otwórz ustawienia",
      workspaceSettings: "Otwórz ustawienia bieżącego obszaru roboczego",
      home: "Przejdź do strony głównej",
      workspaces: "Zarządzanie obszarami roboczymi",
      apiKeys: "Ustawienia kluczy API",
      llmPreferences: "Preferencje LLM",
      chatSettings: "Ustawienia czatu",
      help: "Pokaż pomoc dotyczącą skrótów klawiaturowych",
      showLLMSelector: "Pokaż selektor LLM obszaru roboczego",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Sukces!",
        success_description:
          "Twoja instrukcja systemowa została opublikowana w centrum społeczności!",
        success_thank_you: "Dziękujemy za udostępnienie społeczności!",
        view_on_hub: "Zobacz w Community Hub",
        modal_title: "Opublikuj instrukcję systemową",
        name_label: "Nazwa",
        name_description: "Jest to wyświetlana nazwa instrukcji systemowej.",
        name_placeholder: "Moja instrukcja systemowa",
        description_label: "Opis",
        description_description:
          "To jest opis instrukcji systemowej. Użyj tego, aby opisać cel instrukcji systemowej.",
        tags_label: "Tagi",
        tags_description:
          "Tagi służą do oznaczania instrukcji systemowych w celu łatwiejszego wyszukiwania. Można dodać wiele tagów. Maksymalnie 5 tagów. Maksymalnie 20 znaków na tag.",
        tags_placeholder: "Wpisz i naciśnij Enter, aby dodać tagi",
        visibility_label: "Widoczność",
        public_description:
          "Publiczne instrukcje systemowe są widoczne dla wszystkich.",
        private_description:
          "Prywatne instrukcje systemowe są widoczne tylko dla użytkownika.",
        publish_button: "Opublikuj w Community Hub",
        submitting: "Publikacja...",
        submit: "Opublikuj w Community Hub",
        prompt_label: "Prompt",
        prompt_description:
          "Jest to rzeczywista instrukcja systemowa, która będzie używana do kierowania LLM.",
        prompt_placeholder: "Wprowadź tutaj instrukcję systemową...",
      },
      agent_flow: {
        public_description:
          "Przepływy agentów publicznych są widoczne dla wszystkich.",
        private_description:
          "Przepływy prywatnych agentów są widoczne tylko dla użytkownika.",
        success_title: "Sukces!",
        success_description:
          "Twój Agent Flow został opublikowany w Community Hub!",
        success_thank_you: "Dziękujemy za udostępnienie społeczności!",
        view_on_hub: "Zobacz w Community Hub",
        modal_title: "Publikowanie przepływu agenta",
        name_label: "Nazwa",
        name_description: "Jest to wyświetlana nazwa przepływu agenta.",
        name_placeholder: "Mój przepływ agenta",
        description_label: "Opis",
        description_description:
          "To jest opis przepływu agenta. Użyj tego, aby opisać cel przepływu agenta.",
        tags_label: "Tagi",
        tags_description:
          "Tagi służą do oznaczania przepływów agentów w celu łatwiejszego wyszukiwania. Można dodać wiele tagów. Maksymalnie 5 tagów. Maksymalnie 20 znaków na tag.",
        tags_placeholder: "Wpisz i naciśnij Enter, aby dodać tagi",
        visibility_label: "Widoczność",
        publish_button: "Opublikuj w Community Hub",
        submitting: "Publikacja...",
        submit: "Opublikuj w Community Hub",
        privacy_note:
          "Przepływy agenta są zawsze przesyłane jako prywatne, aby chronić wszelkie poufne dane. Widoczność można zmienić w Community Hub po opublikowaniu. Przed opublikowaniem upewnij się, że przepływ nie zawiera żadnych poufnych lub prywatnych informacji.",
      },
      slash_command: {
        success_title: "Sukces!",
        success_description:
          "Twoje polecenie slash zostało opublikowane w centrum społeczności!",
        success_thank_you: "Dziękujemy za udostępnienie społeczności!",
        view_on_hub: "Zobacz w Community Hub",
        modal_title: "Publikuj polecenie slash",
        name_label: "Nazwa",
        name_description: "Jest to wyświetlana nazwa polecenia slash.",
        name_placeholder: "Moje polecenie slash",
        description_label: "Opis",
        description_description:
          "To jest opis polecenia slash. Użyj tego, aby opisać cel polecenia slash.",
        command_label: "Polecenie",
        command_description:
          "Jest to polecenie slash, które użytkownicy będą wpisywać, aby uruchomić to ustawienie wstępne.",
        command_placeholder: "moje-polecenie",
        tags_label: "Tagi",
        tags_description:
          "Tagi są używane do oznaczania poleceń slash w celu łatwiejszego wyszukiwania. Można dodać wiele tagów. Maksymalnie 5 tagów. Maksymalnie 20 znaków na tag.",
        tags_placeholder: "Wpisz i naciśnij Enter, aby dodać tagi",
        visibility_label: "Widoczność",
        public_description:
          "Publiczne polecenia slash są widoczne dla wszystkich.",
        private_description:
          "Prywatne polecenia slash są widoczne tylko dla użytkownika.",
        publish_button: "Opublikuj w Community Hub",
        submitting: "Publikacja...",
        prompt_label: "Prompt",
        prompt_description:
          "Jest to tekst zachęty, który zostanie użyty po uruchomieniu polecenia slash.",
        prompt_placeholder: "Wprowadź tutaj swój prompt...",
      },
      generic: {
        unauthenticated: {
          title: "Wymagane uwierzytelnienie",
          description:
            "Przed opublikowaniem elementów należy uwierzytelnić się w centrum społeczności AnythingLLM.",
          button: "Połączenie z centrum społeczności",
        },
      },
    },
  },
};

export default TRANSLATIONS;
