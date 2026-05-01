// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    home: {
      getStarted: "Rozpocznij",
      welcome: "Witaj",
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
  },
  common: {
    "workspaces-name": "Nazwa obszaru roboczego",
    selection: "Wybór modelu",
    saving: "Zapisywanie...",
    save: "Zapisz zmiany",
    previous: "Poprzednia strona",
    next: "Następna strona",
    optional: "Opcjonalnie",
    yes: "Tak",
    no: "Nie",
    search: "Wyszukaj",
    username_requirements:
      "Nazwa użytkownika musi mieć od 2 do 32 znaków, zaczynać się małą literą i zawierać tylko małe litery, cyfry, podkreślenia, myślniki i kropki.",
    on: "Na",
    none: "Brak",
    stopped: "Zatrzymano",
    loading: "Ładowanie",
    refresh: "Odświeżyć",
  },
  settings: {
    title: "Ustawienia instancji",
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
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Centrum Społeczności",
      trending: "Odkryj popularne",
      "your-account": "Twój profil",
      "import-item": "Importuj element",
    },
    channels: "Kanały",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Zaplanowane zadania",
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
    "sign-in": "Zaloguj się do {{appName}}.",
    "password-reset": {
      title: "Resetowanie hasła",
      description: "Podaj poniżej niezbędne informacje, aby zresetować hasło.",
      "recovery-codes": "Kody odzyskiwania",
      "back-to-login": "Powrót do logowania",
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Utwórz agenta",
      editWorkspace: "Edytuj przestrzeń roboczą",
      uploadDocument: "Załaduj dokument",
    },
    greeting: "W czym mogę Ci dzisiaj pomóc?",
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
    },
    mode: {
      title: "Tryb czatu",
      chat: {
        title: "Czat",
        description:
          "zapewni odpowiedzi oparte na ogólnym zasobie wiedzy LLM i kontekście dokumentu, który zostanie znaleziony. <br />Będziesz musiał użyć polecenia `@agent`, aby korzystać z narzędzi.",
      },
      query: {
        title: "Zapytanie (wyszukiwanie)",
        description:
          "będzie dostarczać odpowiedzi <b>tylko</b>, jeśli zostanie zidentyfikowany kontekst dokumentu.<br />Będziesz musiał użyć komendy @agent, aby korzystać z narzędzi.",
      },
      automatic: {
        description:
          "automatycznie będzie korzystać z narzędzi, jeśli model i dostawca obsługują natywne wywoływanie narzędzi. <br />Jeśli natywne wywoływanie narzędzi nie jest obsługiwane, konieczne będzie użycie komendy `@agent` w celu korzystania z narzędzi.",
        title: "Agencja",
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
      web: {
        title: "Wyszukiwanie i przeglądanie stron internetowych na żywo",
        description:
          "Pozwól swojemu agentowi na wyszukiwanie informacji w Internecie, aby odpowiadał na Twoje pytania, poprzez połączenie z dostawcą usług wyszukiwania (SERP).",
      },
      sql: {
        title: "Połączenie z bazą danych SQL",
        description:
          "Umożliw agentowi korzystanie z języka SQL, aby odpowiadał na Twoje pytania, poprzez połączenie z różnymi dostawcami baz danych SQL.",
      },
      default_skill:
        "Domyślnie, ta umiejętność jest włączona, ale można ją wyłączyć, jeśli nie chcemy, aby była dostępna dla agenta.",
      filesystem: {
        title: "Dostęp do systemu plików",
        description:
          "Pozwól swoim agentom na odczytywanie, zapisywanie, wyszukiwanie i zarządzanie plikami w określonym katalogu. Obsługuje edycję plików, nawigację po katalogach oraz wyszukiwanie zawartości.",
        learnMore:
          "Dowiedz się więcej na temat tego, jak wykorzystać tę umiejętność.",
        configuration: "Konfiguracja",
        readActions: "Czytać akcje",
        writeActions: "Działania",
        warning:
          "Dostęp do systemu plików może być niebezpieczny, ponieważ może modyfikować lub usuwać pliki. Prosimy o zapoznanie się z dokumentacją <a> przed włączeniem tej funkcji.",
        skills: {
          "read-text-file": {
            title: "Otwórz plik",
            description:
              "Otwórz i przeczytaj zawartość plików (tekst, kod, pliki PDF, obrazy itp.)",
          },
          "read-multiple-files": {
            title: "Odczytaj wiele plików",
            description: "Otwórz i przetwórz wiele plików jednocześnie.",
          },
          "list-directory": {
            title: "Lista kontaktów",
            description: "Wyświetl pliki i katalogi w określonym folderze.",
          },
          "search-files": {
            title: "Wyszukaj pliki",
            description: "Wyszukaj pliki według nazwy lub zawartości",
          },
          "get-file-info": {
            title: "Pobierz informacje o pliku",
            description: "Uzyskaj szczegółowe metadane dotyczące plików.",
          },
          "edit-file": {
            title: "Edytuj plik",
            description:
              "Wprowadzaj zmiany w plikach tekstowych, działając w oparciu o linie.",
          },
          "create-directory": {
            title: "Utwórz katalog",
            description: "Utwórz nowe katalogi",
          },
          "move-file": {
            title: "Przenieś/Przekształć nazwę pliku",
            description: "Przenieś lub zmień nazwę plików i katalogów",
          },
          "copy-file": {
            title: "Skopiuj plik",
            description: "Kopiuj pliki i katalogi",
          },
          "write-text-file": {
            title: "Utwórz plik tekstowy",
            description:
              "Utwórz nowe pliki tekstowe lub nadpisz istniejące pliki tekstowe.",
          },
        },
      },
      createFiles: {
        title: "Tworzenie dokumentów",
        description:
          "Pozwól swojemu agentowi tworzyć pliki w formatach binarnych, takich jak prezentacje PowerPoint, arkusze kalkulacyjne Excel, dokumenty Word i pliki PDF. Pliki można pobrać bezpośrednio z okna czatu.",
        configuration: "Dostępne typy dokumentów",
        skills: {
          "create-text-file": {
            title: "Pliki tekstowe",
            description:
              "Utwórz pliki tekstowe z dowolnym zawartością i rozszerzeniem (np. .txt, .md, .json, .csv).",
          },
          "create-pptx": {
            title: "Prezentacje w formacie PowerPoint",
            description:
              "Stwórz nowe prezentacje w formacie PowerPoint, zawierające slajdy, nagłówki i punkty.",
          },
          "create-pdf": {
            title: "Dokumenty w formacie PDF",
            description:
              "Tworzenie dokumentów PDF z plików w formacie Markdown lub zwykłego tekstu, z podstawowymi możliwościami stylizacji.",
          },
          "create-xlsx": {
            title: "Arkusze kalkulacyjne w programie Excel",
            description:
              "Stwórz arkusze kalkulacyjne w programie Excel, zawierające dane w formie tabel, z różnymi arkuszami i stylami.",
          },
          "create-docx": {
            title: "Dokumenty w formacie Word",
            description:
              "Stwórz dokumenty Word z podstawowymi stylami i formatowaniem.",
          },
        },
      },
      gmail: {
        title: "Połączenie z GMail",
        description:
          "Pozwól swojemu agentowi na interakcję z Gmail – wyszukiwanie wiadomości e-mail, czytanie wątków, tworzenie projektów, wysyłanie wiadomości e-mail oraz zarządzanie skrzynką odbiorczą. <a>Przeczytaj dokumentację</a>.",
        multiUserWarning:
          "Integracja z Gmailem nie jest dostępna w trybie wieloosobowym z powodów bezpieczeństwa. Aby korzystać z tej funkcji, należy wyłączyć tryb wieloosobowy.",
        configuration: "Konfiguracja Gmaila",
        deploymentId: "Identyfikator wdrażania",
        deploymentIdHelp:
          "ID aplikacji webowej z Google Apps Script, której używasz",
        apiKey: "Klucz API",
        apiKeyHelp:
          "Klucz API, który skonfigurowałeś w swoim projekcie Google Apps Script",
        configurationRequired:
          "Prosimy o skonfigurowanie identyfikatora wdrażania i klucza API, aby włączyć funkcje związane z Gmail.",
        configured: "Skonfigurowany",
        searchSkills: "Umiejętności wyszukiwania...",
        noSkillsFound:
          "Nie znaleziono żadnych kandydatów, którzy spełniałyby Twoje kryteria.",
        categories: {
          search: {
            title: "Wyszukaj i przeczytaj wiadomości e-mail",
            description:
              "Wyszukaj i przeczytaj e-maile z swojej skrzynki odbiorczej Gmail.",
          },
          drafts: {
            title: "Proponowane wiadomości e-mail",
            description: "Twórz, edytuj i zarządzaj wersjami e-maili.",
          },
          send: {
            title: "Wysyłanie i odpowiadanie na e-maile",
            description:
              "Wysyłaj e-maile i odpowiadaj na dyskusje natychmiast.",
          },
          threads: {
            title: "Zarządzaj wątkami wiadomości e-mail",
            description:
              "Zarządzaj wątkami e-maili – oznaczaj jako przeczytane/nieprzeczytane, archiwizuj, usuwaj",
          },
          account: {
            title: "Statystyki dotyczące integracji",
            description:
              "Przejrzyj statystyki skrzynki pocztowej oraz informacje dotyczące konta.",
          },
        },
        skills: {
          search: {
            title: "Wyszukaj wiadomości",
            description:
              "Wyszukaj wiadomości e-mail, używając składni zapytań w Gmail.",
          },
          readThread: {
            title: "Przeczytaj wątek",
            description:
              "Przeczytaj pełną sekcję korespondencji e-mail według identyfikatora.",
          },
          createDraft: {
            title: "Utwórz wersję roboczą",
            description: "Utwórz nowy projekt wiadomości e-mail",
          },
          createDraftReply: {
            title: "Stwórz wersję odpowiedzi",
            description: "Stwórz wstępną odpowiedź do istniejącego wątku.",
          },
          updateDraft: {
            title: "Aktualizacja wersji roboczej",
            description: "Zaktualizuj istniejący projekt e-maila",
          },
          getDraft: {
            title: "Otrzymaj wersję roboczą",
            description:
              "Pobierz konkretny wers dokumentu po jego identyfikatorze.",
          },
          listDrafts: {
            title: "Proponowane wersje",
            description: "Wyświetl wszystkie wersje e-maili.",
          },
          deleteDraft: {
            title: "Usuń wersję roboczą",
            description: "Usuń wersję roboczą wiadomości e-mail",
          },
          sendDraft: {
            title: "Wyślij wersję roboczą",
            description: "Wyślij istniejący projekt wiadomości e-mail",
          },
          sendEmail: {
            title: "Wyślij e-mail",
            description: "Wyślij e-mail natychmiast",
          },
          replyToThread: {
            title: "Odpowiedź na wątek",
            description: "Odpowiedz na wątek wiadomości e-mail natychmiast",
          },
          markRead: {
            title: "Mark Read",
            description: "Oznacz wątek jako przeczytany",
          },
          markUnread: {
            title: "Oznacz jako nieprzeczytane",
            description: "Oznacz wątek jako nieprzeczytany",
          },
          moveToTrash: {
            title: "Przenieś do kosza",
            description: "Przenieś wątek do kosza",
          },
          moveToArchive: {
            title: "Archiwum",
            description: "Zarchiwizuj wątek",
          },
          moveToInbox: {
            title: 'Przenieś do folderu "Otrzymane"',
            description: "Przenieś wątek do folderu „Ostatnie wiadomości”",
          },
          getMailboxStats: {
            title: "Statystyki skrzynki pocztowej",
            description:
              "Uzyskaj informacje o liczbie nieprzeczytanych wiadomości oraz statystyki dotyczące skrzynki pocztowej.",
          },
          getInbox: {
            title: "Otwórz skrzynkę odbiorczą",
            description:
              "Sprawne rozwiązanie, dzięki któremu można łatwo pobierać wiadomości z skrzynki odbiorczej z Gmaila.",
          },
        },
      },
      outlook: {
        title: "Łącznik Outlook",
        description:
          "Pozwól swojemu agentowi na interakcję z Microsoft Outlook – wyszukiwanie wiadomości e-mail, czytanie wątków, tworzenie projektów, wysyłanie wiadomości e-mail oraz zarządzanie skrzynką odbiorczą za pomocą Microsoft Graph API. <a>Przeczytaj dokumentację</a>.",
        multiUserWarning:
          "Integracja z Outlookiem nie jest dostępna w trybie wieloosobowym z powodów bezpieczeństwa. Aby skorzystać z tej funkcji, należy wyłączyć tryb wieloosobowy.",
        configuration: "Konfiguracja Outlooka",
        authType: "Typ konta",
        authTypeHelp:
          "Wybierz, które typy kont Microsoft mogą być używane do logowania. Opcja „Wszystkie konta” obsługuje zarówno konta osobiste, jak i konta związane z pracą/szkołą. Opcja „Tylko konta osobiste” ogranicza się do kont Microsoft stworzonych przez użytkowników. Opcja „Tylko konta organizacji” ogranicza się do kont z określonego tenanta Azure AD.",
        authTypeCommon: "Wszystkie konta (osobiste i związane z pracą/szkołą)",
        authTypeConsumers:
          "Tylko konta Microsoft dla pojedynczych użytkowników.",
        authTypeOrganization:
          "Konta tylko dla organizacji (wymaga identyfikatora najemcy)",
        clientId: "Identyfikator klienta (zwrócony przez aplikację)",
        clientIdHelp:
          "Identyfikator aplikacji (klienta) z rejestracji w Azure AD",
        tenantId: "Identyfikator (osoby wynajmującej)",
        tenantIdHelp:
          "Identyfikator (dla najemcy) z rejestracji aplikacji w Azure AD. Wymagany tylko w przypadku uwierzytelniania tylko dla danej organizacji.",
        clientSecret: "Klucz API",
        clientSecretHelp:
          "Wartość klienta, którą podali podczas rejestracji aplikacji w Azure AD",
        configurationRequired:
          "Prosimy o skonfigurowanie identyfikatora klienta i sekretu klienta, aby włączyć funkcje Outlook.",
        authRequired:
          "Najpierw zapisz swoje dane, a następnie zaloguj się przez Microsoft, aby dokończyć konfigurację.",
        authenticateWithMicrosoft: "Zaloguj się przy użyciu konta Microsoft",
        authenticated: "Pomyślnie uwierzytelniono w Microsoft Outlook.",
        revokeAccess: "Wydać uprawnienia",
        configured: "Skonfigurowany",
        searchSkills: "Umiejętności wyszukiwania...",
        noSkillsFound:
          "Nie znaleziono żadnych kandydatów, którzy spełniałyby Twoje kryteria.",
        categories: {
          search: {
            title: "Wyszukaj i przeczytaj wiadomości e-mail",
            description: "Wyszukuj i czytaj e-maile z swojej poczty Outlook.",
          },
          drafts: {
            title: "Proponowane wiadomości e-mail",
            description: "Twórz, edytuj i zarządzaj wersjami e-maili.",
          },
          send: {
            title: "Wysyłaj e-maile",
            description:
              "Wysyłaj nowe wiadomości e-mail lub odpowiadaj na wiadomości natychmiast.",
          },
          account: {
            title: "Statystyki dotyczące integracji",
            description:
              "Przejrzyj statystyki skrzynki pocztowej oraz informacje dotyczące konta.",
          },
        },
        skills: {
          getInbox: {
            title: "Otwórz skrzynkę odbiorczą",
            description:
              "Otrzymuj najnowsze wiadomości e-mail ze swojej poczty Outlook.",
          },
          search: {
            title: "Wyszukaj wiadomości",
            description:
              "Wyszukuj wiadomości e-mail, używając składni wyszukiwania Microsoft",
          },
          readThread: {
            title: "Przeczytaj rozmowę",
            description: "Przeczytaj pełną korespondencję mailową.",
          },
          createDraft: {
            title: "Stwórz wersję roboczą",
            description:
              "Utwórz nowy projekt wiadomości e-mail lub zaproponowany odpowiedź na istniejącą wiadomość.",
          },
          updateDraft: {
            title: "Aktualizacja wersji roboczej",
            description: "Zaktualizuj istniejący projekt wiadomości e-mail",
          },
          listDrafts: {
            title: "Proponowane wersje",
            description:
              "Wyświetl wszystkie wersje e-maili w trakcie tworzenia.",
          },
          deleteDraft: {
            title: "Usuń wersję roboczą",
            description: "Usuń wersję roboczą wiadomości e-mail",
          },
          sendDraft: {
            title: "Wyślij wersję roboczą",
            description: "Wyślij istniejący projekt wiadomości e-mail",
          },
          sendEmail: {
            title: "Wyślij e-mail",
            description:
              "Wyślij nową wiadomość e-mail lub odpowiedz na istniejącą wiadomość natychmiast.",
          },
          getMailboxStats: {
            title: "Statystyki skrzynki pocztowej",
            description:
              "Uzyskaj liczbę folderów oraz statystyki dotyczące skrzynki pocztowej.",
          },
        },
      },
      googleCalendar: {
        title: "Łącznik do Google Kalendarza",
        description:
          "Pozwól swojemu agentowi na interakcję z Google Calendar – przeglądaj kalendarze, sprawdzaj wydarzenia, twórz i aktualizuj wydarzenia oraz zarządzaj potwierdzeniami obecności. <a>Przeczytaj dokumentację</a>.",
        multiUserWarning:
          "Integracja z Google Calendar nie jest dostępna w trybie wieloosobowym z powodów bezpieczeństwa. Aby korzystać z tej funkcji, należy wyłączyć tryb wieloosobowy.",
        configuration: "Konfiguracja kalendarza Google",
        deploymentId: "Identyfikator wdrożenia",
        deploymentIdHelp:
          "ID aplikacji webowej z Google Apps Script, której używasz.",
        apiKey: "Klucz API",
        apiKeyHelp:
          "Klucz API, który skonfigurowałeś w swoim projekcie Google Apps Script",
        configurationRequired:
          "Prosimy o skonfigurowanie ID wdrażania i klucza API, aby włączyć funkcje związane z Google Calendar.",
        configured: "Skonfigurowane",
        searchSkills: "Umiejętności wyszukiwania...",
        noSkillsFound:
          "Nie znaleziono żadnych kandydatów, którzy spełniałyby Twoje kryteria.",
        categories: {
          calendars: {
            title: "Kalendarze",
            description: "Przeglądaj i zarządzaj swoimi kalendarzami Google.",
          },
          readEvents: {
            title: "Sprawdź wydarzenia",
            description: "Przeglądaj i wyszukuj wydarzenia w kalendarzu",
          },
          writeEvents: {
            title: "Tworzenie i aktualizacja wydarzeń",
            description: "Twórz nowe wydarzenia i modyfikuj istniejące.",
          },
          rsvp: {
            title: "Zarządzanie rezerwacjami",
            description: "Zarządzaj statusem odpowiedzi dla wydarzeń",
          },
        },
        skills: {
          listCalendars: {
            title: "Kalendarze",
            description:
              "Wypisz wszystkie kalendarze, które posiadasz lub do których subskrybujesz.",
          },
          getCalendar: {
            title: "Uzyskaj szczegółowe informacje o kalendarzu",
            description:
              "Uzyskaj szczegółowe informacje na temat konkretnego kalendarza.",
          },
          getEvent: {
            title: "Uzyskaj informacje o wydarzeniu",
            description:
              "Uzyskaj szczegółowe informacje na temat konkretnego wydarzenia",
          },
          getEventsForDay: {
            title: "Sprawdź wydarzenia na dany dzień",
            description:
              "Pobierz wszystkie wydarzenia zaplanowane na konkretny dzień.",
          },
          getEvents: {
            title: "Wyszukaj wydarzenia (zakres dat)",
            description: "Pobierz wydarzenia w określonym przedziale dat.",
          },
          getUpcomingEvents: {
            title: "Sprawdź nadchodzące wydarzenia",
            description:
              "Znajdź wydarzenia na dzisiaj, w tym tygodniu lub w tym miesiącu, używając prostych słów kluczowych.",
          },
          quickAdd: {
            title: "Szybkie dodanie wydarzenia",
            description:
              "Utwórz wydarzenie na podstawie opisu w języku naturalnym (np. „Spotkanie jutro o 15:00”)",
          },
          createEvent: {
            title: "Utwórz wydarzenie",
            description:
              "Utwórz nowe wydarzenie, mając pełną kontrolę nad wszystkimi jego właściwościami.",
          },
          updateEvent: {
            title: "Aktualizacja wydarzenia",
            description: "Zaktualizuj istniejącą wydarzenie w kalendarzu",
          },
          setMyStatus: {
            title: "Ustaw status odpowiedzi",
            description:
              "Przyjęć, odrzucić lub wyrazić wstępne zainteresowanie udziałem w wydarzeniu",
          },
        },
      },
    },
    mcp: {
      title: "Serwery MCP",
      "loading-from-config": "Ładowanie serwerów MCP z pliku konfiguracyjnego",
      "learn-more": "Dowiedz się więcej o serwerach MCP.",
      "no-servers-found": "Nie znaleziono serwerów MCP.",
      "tool-warning":
        "Aby uzyskać najlepsze wyniki, rozważ wyłączenie niepotrzebnych narzędzi, aby zminimalizować zakłócenia.",
      "stop-server": "Zatrzymaj serwer MCP",
      "start-server": "Uruchom serwer MCP",
      "delete-server": "Usuń serwer MCP",
      "tool-count-warning":
        "Ten serwer MCP ma włączone <b> narzędzia, które będą zużywać kontekst w każdej rozmowie.</b> Rozważ wyłączenie niepotrzebnych narzędzi, aby oszczędzać kontekst.",
      "startup-command": "Polecenie uruchamiające",
      command: "Rozkaz",
      arguments: "Argumenty",
      "not-running-warning":
        "Ten serwer MCP nie działa – może być zatrzymany lub może występować w nim błąd podczas uruchamiania.",
      "tool-call-arguments": "Argumenty wywoływania funkcji",
      "tools-enabled": "narzędzia są aktywne",
    },
    settings: {
      title: "Ustawienia umiejętności agenta",
      "max-tool-calls": {
        title: "Maksymalna liczba żądań narzędzi na odpowiedź",
        description:
          "Maksymalna liczba narzędzi, które agent może łączyć, aby wygenerować pojedynczą odpowiedź. Zapobiega to niekontrolowanemu wywoływaniu narzędzi i tworzeniu nieskończonych pętli.",
      },
      "intelligent-skill-selection": {
        title: "Inteligentny wybór umiejętności",
        "beta-badge": "Wersja beta",
        description:
          "Umożliwia korzystanie z nieograniczonej liczby narzędzi oraz redukcję zużycia tokenów o do 80% na każde zapytanie – EverythingLLM automatycznie wybiera odpowiednie umiejętności dla każdego zapytania.",
        "max-tools": {
          title: "Narzędzia Max",
          description:
            "Maksymalna liczba narzędzi, które można wybrać dla każdego zapytania. Zalecamy ustawienie tej wartości na wyższe poziomy dla modeli o większym kontekście.",
        },
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
      "render-html": {
        title: "Renderowanie HTML w czacie",
        description:
          "Wyświetlanie odpowiedzi w formacie HTML w odpowiedziach asystenta.\nMoże to prowadzić do znacznie wyższej jakości odpowiedzi, ale również wiąże się z potencjalnymi zagrożeniami bezpieczeństwa.",
      },
    },
  },
  api: {
    title: "Klucze API",
    description:
      "Klucze API umożliwiają dostęp do instancji AnythingLLM i zarządzanie nią.",
    link: "Przeczytaj dokumentację API",
    generate: "Generuj nowy klucz API",
    empty: "Nie znaleziono kluczy API",
    actions: "Akcje",
    messages: {
      error: "Błąd: {{error}}",
    },
    modal: {
      title: "Utwórz nowy klucz API",
      cancel: "Anuluj",
      close: "Zamknij",
      create: "Utwórz klucz API",
      helper:
        "Po utworzeniu klucz API może być używany do programowego dostępu do tej instancji AnythingLLM i jej konfiguracji.",
      name: {
        label: "Nazwa",
        placeholder: "Integracja produkcyjna",
        helper:
          "Opcjonalne. Użyj przyjaznej nazwy, aby później łatwo rozpoznać ten klucz.",
      },
    },
    row: {
      copy: "Kopiuj klucz API",
      copied: "Skopiowano",
      unnamed: "--",
      deleteConfirm:
        "Czy na pewno chcesz dezaktywować ten klucz API?\nPo tej operacji nie będzie już można go używać.\n\nTej akcji nie można cofnąć.",
    },
    table: {
      name: "Nazwa",
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
        model_type_tooltip:
          "Jeśli w Państwa systemie używany jest model rozumowania (np. o1, o1-mini, o3-mini), ustaw tę opcję na „Rozumowanie”. W przeciwnym razie, Państwa zapytania w czacie mogą nie działać.",
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
    },
  },
  text: {
    title: "Preferencje dot. podziału tekstu i dzielenia na fragmenty",
    "desc-start":
      "Czasami może zaistnieć potrzeba zmiany domyślnego sposobu, w jaki nowe dokumenty są dzielone i fragmentowane przed wstawieniem ich do wektorowej bazy danych.",
    "desc-end":
      "Powinieneś modyfikować to ustawienie tylko wtedy, gdy rozumiesz, jak działa dzielenie tekstu i jakie są jego skutki uboczne.",
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
    anonymous: "Włączona anonimowa telemetria",
  },
  connectors: {
    "search-placeholder": "Wyszukaj źródła danych",
    "no-connectors": "Nie znaleziono źródeł danych.",
    obsidian: {
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
      bypass_ssl: "Omijanie weryfikacji certyfikatu SSL",
      bypass_ssl_explained:
        "Włącz tę opcję, aby ominąć weryfikację certyfikatu SSL dla instancji Confluence, które są samodzielnie hostowane i posiadają certyfikat samodzielnie podpisany.",
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
      "delete-confirmation":
        "Czy na pewno chcesz usunąć te pliki i foldery? Spowoduje to usunięcie plików z systemu i automatyczne usunięcie ich z istniejących obszarów roboczych. Działanie to nie jest odwracalne.",
      "removing-message":
        "Usuwanie dokumentów {{count}} i folderów {{folderCount}}. Proszę czekać.",
      "move-success": "Pomyślnie przeniesiono {{count}} dokumentów.",
      no_docs: "Brak dokumentów",
      select_all: "Wybierz wszystko",
      deselect_all: "Odznacz wszystko",
      remove_selected: "Usuń wybrane",
      save_embed: "Zapisz",
      "total-documents_one": "{{count}} dokument",
      "total-documents_other": "{{count}} dokumenty",
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
    attachments_processing: "Załączniki są przetwarzane. Proszę czekać...",
    send_message: "Wyślij wiadomość",
    attach_file: "Dołącz plik do tego czatu",
    text_size: "Zmiana rozmiaru tekstu.",
    microphone: "Wypowiedz swoją prośbę.",
    send: "Wyślij wiadomość do obszaru roboczego",
    tts_speak_message: "Wypowiedz komunikat głosowo",
    copy: "Kopiuj",
    regenerate: "Generuj ponownie",
    regenerate_response: "Wygeneruj ponownie odpowiedź",
    good_response: "Dobra odpowiedź",
    more_actions: "Więcej działań",
    fork: "Utwórz rozgałęzienie",
    delete: "Usuń",
    cancel: "Anuluj",
    edit_prompt: "Edytuj prompt",
    edit_response: "Edytuj odpowiedź",
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
    submit: "Prześlij",
    edit_info_user:
      '"Wyślij" powoduje ponowne wygenerowanie odpowiedzi przez sztuczną inteligencję. "Zapisz" aktualizuje tylko Twoje wiadomości.',
    edit_info_assistant:
      "Twoje zmiany zostaną zapisane bezpośrednio w tej odpowiedzi.",
    see_less: "Zobacz mniej",
    see_more: "Zobacz więcej",
    tools: "Narzędzia",
    text_size_label: "Rozmiar czcionki",
    select_model: "Wybierz model",
    sources: "Źródła",
    document: "Dokument",
    similarity_match: "mecz",
    source_count_one: "{{count}} – odniesienie",
    source_count_other: "{{count}} – odnośniki",
    preset_exit_description: "Zakończ bieżącą sesję z przedstawicielem",
    add_new: "Dodaj nowe",
    edit: "Edytuj",
    publish: "Opublikować",
    stop_generating: "Przestań generować odpowiedź",
    slash_commands: "Polecenia skrótowe",
    agent_skills: "Umiejętności agenta",
    manage_agent_skills: "Zarządzanie umiejętnościami agentów",
    agent_skills_disabled_in_session:
      "Nie można modyfikować umiejętności podczas trwającej sesji. Aby zakończyć sesję, należy najpierw użyć komendy /exit.",
    start_agent_session: "Rozpocznij sesję dla agenta",
    use_agent_session_to_use_tools:
      "Możesz korzystać z narzędzi w czacie, inicjując sesję z agentem, wpisując '@agent' na początku swojego zapytania.",
    agent_invocation: {
      model_wants_to_call: "Model chce zadzwonić",
      approve: "Zaakceptować",
      reject: "Odrzucić",
      always_allow: "Zawsze należy uwzględnić {{skillName}}",
      tool_call_was_approved:
        "Zgłoszenie dotyczące narzędzia zostało zatwierdzone.",
      tool_call_was_rejected: "Żądanie użycia narzędzia zostało odrzucone.",
    },
    custom_skills: "Dostosowane umiejętności",
    agent_flows: "Przepływy agencji",
    no_tools_found: "Nie znaleziono odpowiadających narzędzi.",
    loading_mcp_servers: "Ładowanie serwerów MCP...",
    app_integrations: "Integracje z aplikacjami",
    sub_skills: "Specyficzne umiejętności",
  },
  profile_settings: {
    edit_account: "Edytuj konto",
    profile_picture: "Zdjęcie profilowe",
    remove_profile_picture: "Usuń zdjęcie profilowe",
    username: "Nazwa użytkownika",
    new_password: "Nowe hasło",
    password_description: "Hasz do 8 znaków.",
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
        prompt_label: "Prompt",
        prompt_description:
          "Jest to rzeczywista instrukcja systemowa, która będzie używana do kierowania LLM.",
        prompt_placeholder: "Wprowadź tutaj instrukcję systemową...",
      },
      agent_flow: {
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
  security: {
    title: "Bezpieczeństwo",
    multiuser: {
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
    },
    password: {
      title: "Ochrona hasłem",
      description:
        "Chroń swoją instancję AnythingLLM hasłem. Jeśli go zapomnisz, nie ma metody odzyskiwania, więc upewnij się, że zapisałeś to hasło.",
      "password-label": "Hasło instancji",
    },
  },
  home: {
    welcome: "Witamy",
    chooseWorkspace: "Wybierz obszar roboczy, aby rozpocząć czat!",
    notAssigned:
      "Nie jesteś przypisany do żadnego obszaru roboczego.\nSkontaktuj się z administratorem, aby poprosić o dostęp do obszaru roboczego.",
    goToWorkspace: 'Przejdź do obszaru roboczego "{{workspace}}"',
  },
  telegram: {
    title: "Bot na Telegramie",
    description:
      "Połącz swoją instancję AnythingLLM z Telegramem, aby móc rozmawiać z przestrzeniami roboczymi z dowolnego urządzenia.",
    setup: {
      step1: {
        title: "Krok 1: Utwórz swojego bota w Telegramie",
        description:
          "Otwórz aplikację @BotFather w Telegramie, wyślij wiadomość <code>/newbot</code> do <code>@BotFather</code>, postępuj zgodnie z instrukcjami i skopiuj token API.",
        "open-botfather": "Otwórz BotFather",
        "instruction-1": "1. Otwórz link lub zeskanuj kod QR",
        "instruction-2":
          "2. Wyślij <code>/newbot</code> na adres <code>@BotFather</code>",
        "instruction-3":
          "3. Wybierz nazwę i nazwę użytkownika dla swojego robota.",
        "instruction-4": "4. Skopiuj token API, który otrzymasz.",
      },
      step2: {
        title: "Krok 2: Połącz swojego robota",
        description:
          "Wklej token API, który otrzymałeś od @BotFather, i wybierz domyślny przestrzeń roboczą, z której Twój bot będzie mógł komunikować się.",
        "bot-token": "Token Bot",
        connecting: "Połączenie...",
        "connect-bot": "Bot łączący",
      },
      security: {
        title: "Zalecane ustawienia bezpieczeństwa",
        description:
          "W celu zwiększenia bezpieczeństwa, skonfiguruj te ustawienia w kanale @BotFather.",
        "disable-groups": "— Zapobiegaj dodawaniu botów do grup",
        "disable-inline":
          "— Zapobieg użyciu robota w wyszukiwaniach w czasie rzeczywistym.",
        "obscure-username":
          "Użyj nietypowej nazwy użytkownika dla bota, aby zmniejszyć jego widoczność.",
      },
      "toast-enter-token": "Prosimy o wprowadzenie tokena dla bota.",
      "toast-connect-failed": "Nie udało się nawiązać połączenia z botem.",
    },
    connected: {
      status: "Połączony",
      "status-disconnected":
        "Brak połączenia – token może być nieprawidłowy lub wygasł",
      "placeholder-token": "Wklej nowy token dla bota...",
      reconnect: "Ponowne połączenie",
      workspace: "Przestrzeń robocza",
      "bot-link": "Link do bota",
      "voice-response": "Reakcja na głos",
      disconnecting: "Odłączanie...",
      disconnect: "Odłączyć",
      "voice-text-only": "Tylko tekst",
      "voice-mirror":
        "Odbiór (odpowiedź za pomocą głosu, gdy użytkownik wysyła głos)",
      "voice-always":
        "Zawsze dołączaj nagranie (wysyłaj dźwięk wraz z każdą odpowiedzią)",
      "toast-disconnect-failed": "Nie udało się odłączyć bota.",
      "toast-reconnect-failed": "Nie udało się nawiązać połączenia z botem.",
      "toast-voice-failed": "Nie udało się zaktualizować trybu głosu.",
      "toast-approve-failed": "Nie udało się zatwierdzić użytkownika.",
      "toast-deny-failed": "Nie udało się odrzucić żądania użytkownika.",
      "toast-revoke-failed": "Nie udało się odwołać konta użytkownika.",
    },
    users: {
      "pending-description":
        "Użytkownicy, którzy czekają na weryfikację. Dopasuj kod parowania, który znajduje się tutaj, z tym, który widnieje w ich rozmowie na Telegramie.",
      unknown: "Nieznany",
    },
  },
  scheduledJobs: {
    title: "Zaplanowane zadania",
    enableNotifications:
      "Włącz powiadomienia w przeglądarce dotyczące wyników rekrutacji",
    description:
      "Stwórz powtarzalne zadania oparte na sztucznej inteligencji, które będą wykonywane według zadanego harmonogramu. Każde zadanie będzie zawierało zapytanie oraz opcjonalne narzędzia, a także zapisze wynik, który będzie można później przejrzeć.",
    newJob: "Nowa praca",
    loading: "Ładowanie...",
    emptyTitle: "Na razie nie ma zaplanowanych zadań.",
    emptySubtitle: "Stwórz jeden, aby zacząć.",
    table: {
      name: "Imię",
      schedule: "Harmonogram",
      status: "Stan",
      lastRun: "Ostatnia przejażdżka",
      nextRun: "Następna rozgrywka",
      actions: "Działania",
    },
    confirmDelete: "Czy na pewno chcesz usunąć tę zaplanowaną czynność?",
    toast: {
      deleted: "Usunięto pracę",
      triggered: "Zlecenie zostało pomyślnie uruchomione.",
      triggerFailed: "Nie udało się uruchomić zadania.",
      triggerSkipped: "Prace nad tym projektem są już w toku.",
      killed: "Praca została pomyślnie zakończona.",
      killFailed: "Nie udało się zatrzymać pracy",
    },
    row: {
      neverRun: "Nigdy nie należy jechać zbyt szybko.",
      viewRuns: "Wyświetlanie/Odtwarzanie",
      runNow: "Zacznij od razu",
      enable: "Włącz",
      disable: "Wyłączyć",
      edit: "Edytuj",
      delete: "Usuń",
    },
    modal: {
      titleEdit: "Edytuj zaplanowaną pracę",
      titleNew: "Nowe zaplanowane zadanie",
      nameLabel: "Imię",
      namePlaceholder: "np. Codzienne podsumowanie wiadomości",
      promptLabel: "Instrukcja",
      promptPlaceholder:
        "Instrukcja dotycząca uruchamiania w każdym przypadku...",
      scheduleLabel: "Harmonogram",
      modeBuilder: "Budowniczy",
      modeCustom: "Dostosowane",
      cronPlaceholder: "Wyrażenie crona (np. 0 9 * * *)",
      currentSchedule: "Obecny harmonogram:",
      toolsLabel: "Narzędzia (opcjonalne)",
      toolsDescription:
        "Wybierz, które narzędzia dla agentów mogą być używane w tym przypadku. Jeśli żadne narzędzia nie zostaną wybrane, praca będzie wykonywana bez żadnych narzędzi.",
      toolsSearch: "Wyszukaj",
      toolsNoResults: "Żaden z dostępnych narzędzi nie pasuje.",
      required: "Wymagane",
      requiredFieldsBanner:
        "Prosimy o wypełnienie wszystkich wymaganych pól, aby utworzyć ogłoszenie o pracę.",
      cancel: "Anuluj",
      saving: "Oszczędzanie...",
      updateJob: "Aktualizacja oferty pracy",
      createJob: "Utwórz ofertę pracy",
      jobUpdated: "Informacja o aktualizacji oferty pracy",
      jobCreated: "Utworzono stanowisko",
    },
    builder: {
      fallbackWarning:
        'To wyrażenie nie można edytować graficznie. Jeśli chcesz je zachować, przejdź do opcji "Custom". W przeciwnym razie możesz zmienić dowolne elementy poniżej, aby je zastąpić.',
      run: "Bieg",
      frequency: {
        minute: "co minutę",
        hour: "godzinne",
        day: "codzienny",
        week: "tygodniowy",
        month: "miesięczny",
      },
      every: "Każdy",
      minuteOne: "1 minuta",
      minuteOther: "{{count}} minut",
      atMinute: "W określonym momencie",
      pastEveryHour: "przeszłe, co godzinę",
      at: "W",
      on: "Na",
      onDay: "W dniu",
      ofEveryMonth: "każdego miesiąca",
      weekdays: {
        sun: "Słońce",
        mon: "Monety",
        tue: "Wtorek",
        wed: "Środa",
        thu: "Czwartek",
        fri: "Piątek",
        sat: "Sobota",
      },
    },
    runHistory: {
      back: "Powrót do ofert pracy",
      title: "Historia uruchomień: {{name}}",
      schedule: "Harmonogram:",
      emptyTitle: "Na razie nie udało się wykonać żadnych zadań.",
      emptySubtitle: "Uruchom teraz zadanie i sprawdź jego wyniki.",
      runNow: "Rozpocznij teraz",
      table: {
        status: "Stan",
        started: "Zaczęto",
        duration: "Czas trwania",
        error: "Błąd",
      },
      stopJob: "Zakończ pracę",
    },
    runDetail: {
      loading: "Wczytywanie szczegółów przebiegu...",
      notFound: "Nie znaleziono.",
      back: "Wstecz",
      unknownJob: "Nieznane stanowisko",
      runHeading: "{{name}} – Uruchom {{id}}",
      duration: "Czas trwania: {{value}}",
      creating: "Tworzenie...",
      threadFailed: "Nie udało się utworzyć wątku.",
      sections: {
        prompt: "Instrukcja",
        error: "Błąd",
        thinking: "Przemyślenia ({{count}})",
        toolCalls: "Wywoływanie narzędzi ({{count}})",
        files: "Pliki ({{count}})",
        response: "Odpowiedź",
        metrics: "Wskaźniki",
      },
      metrics: {
        promptTokens: "Słowa kluczowe:",
        completionTokens: "Tokeny zakończenia:",
      },
      stopJob: "Zakończ pracę",
      killing: "Przestań...",
      continueInThread: "Kontynuuj rozmowę",
    },
    toolCall: {
      arguments: "Argumenty:",
      showResult: "Wyświetl wynik",
      hideResult: "Ukryj wynik",
    },
    file: {
      unknown: "Nieznany plik",
      download: "Pobierz",
      downloadFailed: "Nie udało się pobrać pliku",
      types: {
        powerpoint: "Prezentacja w programie PowerPoint",
        pdf: "Dokument w formacie PDF",
        word: "Dokument w formacie Word",
        spreadsheet: "Arkusz kalkulacyjny",
        generic: "Plik",
      },
    },
    status: {
      completed: "Zakończone",
      failed: "Nie udało się",
      timed_out: "Czas wymarł",
      running: "Bieganie",
      queued: "W kolejce",
    },
  },
};

export default TRANSLATIONS;
