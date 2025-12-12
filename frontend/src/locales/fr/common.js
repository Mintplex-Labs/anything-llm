// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: "Adresse e-mail",
      useCase: "Pour quel usage utiliserez-vous AnythingLLM ?",
      useCaseWork: "Pour le travail",
      useCasePersonal: "Pour un usage personnel",
      useCaseOther: "Autre",
      comment: "Comment avez-vous découvert AnythingLLM ?",
      commentPlaceholder: "Recherche, recommandation, Twitter, YouTube, etc.",
      skip: "Ignorer l'enquête",
      thankYou: "Merci pour votre retour !",
      title: "Bienvenue",
      description:
        "Aidez-nous à améliorer AnythingLLM en répondant à quelques questions.",
    },
    home: {
      title: "Bienvenue",
      getStarted: "Commencer",
    },
    llm: {
      title: "Préférence LLM",
      description:
        "AnythingLLM peut fonctionner avec de nombreux fournisseurs LLM. Ce sera le service qui traitera vos discussions.",
    },
    userSetup: {
      title: "Configuration utilisateur",
      description: "Configurez votre accès utilisateur.",
      howManyUsers: "Combien de personnes utiliseront cette instance ?",
      justMe: "Juste moi",
      myTeam: "Mon équipe",
      instancePassword: "Mot de passe de l'instance",
      setPassword: "Définir un mot de passe",
      passwordReq: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordWarn:
        "Conservez ce mot de passe, il n'y a pas de récupération possible.",
      adminUsername: "Nom d'utilisateur administrateur",
      adminUsernameReq:
        "Le nom d'utilisateur doit contenir au moins 6 caractères.",
      adminPassword: "Mot de passe administrateur",
      adminPasswordReq: "Le mot de passe doit contenir au moins 8 caractères.",
      teamHint:
        "Vous pourrez ajouter d'autres utilisateurs après la configuration initiale.",
    },
    data: {
      title: "Gestion des données",
      description:
        "Configurez comment AnythingLLM stocke et traite vos données.",
      settingsHint:
        "Ces paramètres peuvent être modifiés ultérieurement dans les paramètres.",
    },
    workspace: {
      title: "Créer votre premier espace de travail",
      description:
        "Créez votre premier espace de travail pour commencer à utiliser AnythingLLM.",
    },
  },
  common: {
    "workspaces-name": "Nom des espaces de travail",
    error: "erreur",
    success: "succès",
    user: "Utilisateur",
    selection: "Sélection du modèle",
    saving: "Enregistrement...",
    save: "Enregistrer les modifications",
    previous: "Page précédente",
    next: "Page suivante",
    optional: "Optionnel",
    yes: "Oui",
    no: "Non",
    search: "Rechercher",
  },
  settings: {
    title: "Paramètres de l'instance",
    system: "Préférences système",
    invites: "Invitation",
    users: "Utilisateurs",
    workspaces: "Espaces de travail",
    "workspace-chats": "Chat de l'espace de travail",
    customization: "Apparence",
    "api-keys": "Clés API",
    llm: "Préférence LLM",
    transcription: "Modèle de transcription",
    embedder: "Préférences d'intégration",
    "text-splitting": "Diviseur de texte et découpage",
    "voice-speech": "Voix et Parole",
    "vector-database": "Base de données vectorielle",
    embeds: "Widgets de chat intégrés",
    "embed-chats": "Historique des chats intégrés",
    security: "Sécurité",
    "event-logs": "Journaux d'événements",
    privacy: "Confidentialité et données",
    "ai-providers": "Fournisseurs d'IA",
    "agent-skills": "Compétences de l'agent",
    admin: "Admin",
    tools: "Outils",
    "experimental-features": "Fonctionnalités Expérimentales",
    contact: "Contacter le Support",
    "browser-extension": "Extension de navigateur",
    "system-prompt-variables": "Variables de prompt système",
    interface: "Interface",
    branding: "Personnalisation",
    chat: "Chat",
  },
  login: {
    "multi-user": {
      welcome: "Bienvenue",
      "placeholder-username": "Nom d'utilisateur",
      "placeholder-password": "Mot de passe",
      login: "Connexion",
      validating: "Validation...",
      "forgot-pass": "Mot de passe oublié",
      reset: "Réinitialiser",
    },
    "sign-in": {
      start: "Connectez-vous à votre",
      end: "compte.",
    },
    "password-reset": {
      title: "Réinitialisation du mot de passe",
      description:
        "Fournissez les informations nécessaires ci-dessous pour réinitialiser votre mot de passe.",
      "recovery-codes": "Codes de récupération",
      "recovery-code": "Code de récupération {{index}}",
      "back-to-login": "Retour à la connexion",
    },
  },
  "new-workspace": {
    title: "Nouvel Espace de Travail",
    placeholder: "Mon Espace de Travail",
  },
  "workspaces—settings": {
    general: "Paramètres généraux",
    chat: "Paramètres du chat",
    vector: "Base de données vectorielle",
    members: "Membres",
    agent: "Configuration de l'agent",
  },
  general: {
    vector: {
      title: "Nombre de vecteurs",
      description:
        "Nombre total de vecteurs dans votre base de données vectorielle.",
    },
    names: {
      description:
        "Cela ne changera que le nom d'affichage de votre espace de travail.",
    },
    message: {
      title: "Messages de chat suggérés",
      description:
        "Personnalisez les messages qui seront suggérés aux utilisateurs de votre espace de travail.",
      add: "Ajouter un nouveau message",
      save: "Enregistrer les messages",
      heading: "Expliquez-moi",
      body: "les avantages de AnythingLLM",
    },
    pfp: {
      title: "Image de profil de l'assistant",
      description:
        "Personnalisez l'image de profil de l'assistant pour cet espace de travail.",
      image: "Image de l'espace de travail",
      remove: "Supprimer l'image de l'espace de travail",
    },
    delete: {
      title: "Supprimer l'Espace de Travail",
      description:
        "Supprimer cet espace de travail et toutes ses données. Cela supprimera l'espace de travail pour tous les utilisateurs.",
      delete: "Supprimer l'espace de travail",
      deleting: "Suppression de l'espace de travail...",
      "confirm-start": "Vous êtes sur le point de supprimer votre",
      "confirm-end":
        "espace de travail. Cela supprimera toutes les intégrations vectorielles dans votre base de données vectorielle.\n\nLes fichiers source originaux resteront intacts. Cette action est irréversible.",
    },
  },
  chat: {
    llm: {
      title: "Fournisseur LLM de l'espace de travail",
      description:
        "Le fournisseur et le modèle LLM spécifiques qui seront utilisés pour cet espace de travail. Par défaut, il utilise le fournisseur et les paramètres LLM du système.",
      search: "Rechercher tous les fournisseurs LLM",
    },
    model: {
      title: "Modèle de chat de l'espace de travail",
      description:
        "Le modèle de chat spécifique qui sera utilisé pour cet espace de travail. Si vide, utilisera la préférence LLM du système.",
      wait: "-- en attente des modèles --",
    },
    mode: {
      title: "Mode de chat",
      chat: {
        title: "Chat",
        "desc-start":
          "fournira des réponses avec les connaissances générales du LLM",
        and: "et",
        "desc-end": "le contexte du document trouvé.",
      },
      query: {
        title: "Requête",
        "desc-start": "fournira des réponses",
        only: "uniquement",
        "desc-end": "si un contexte de document est trouvé.",
      },
    },
    history: {
      title: "Historique des chats",
      "desc-start":
        "Le nombre de chats précédents qui seront inclus dans la mémoire à court terme de la réponse.",
      recommend: "Recommandé: 20.",
      "desc-end":
        "Tout nombre supérieur à 45 risque de provoquer des échecs de chat continus en fonction de la taille du message.",
    },
    prompt: {
      title: "Invite",
      description:
        "L'invite qui sera utilisée sur cet espace de travail. Définissez le contexte et les instructions pour que l'IA génère une réponse. Vous devez fournir une invite soigneusement conçue pour que l'IA puisse générer une réponse pertinente et précise.",
      history: {
        title: "Historique des prompts",
        clearAll: "Tout effacer",
        noHistory: "Aucun historique",
        restore: "Restaurer",
        delete: "Supprimer",
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce prompt ?",
        clearAllConfirm: "Êtes-vous sûr de vouloir effacer tout l'historique ?",
        expand: "Développer",
        publish: "Publier",
      },
    },
    refusal: {
      title: "Réponse de refus en mode requête",
      "desc-start": "En mode",
      query: "requête",
      "desc-end":
        ", vous pouvez souhaiter retourner une réponse de refus personnalisée lorsque aucun contexte n'est trouvé.",
      "tooltip-title": "Personnaliser la réponse de refus",
      "tooltip-description":
        "Personnalisez la réponse qui sera affichée lorsque aucun contexte pertinent n'est trouvé dans vos documents.",
    },
    temperature: {
      title: "Température LLM",
      "desc-start":
        "Ce paramètre contrôle le niveau de créativité des réponses de votre LLM.",
      "desc-end":
        "Plus le nombre est élevé, plus la réponse sera créative. Pour certains modèles, cela peut entraîner des réponses incohérentes si la valeur est trop élevée.",
      hint: "La plupart des LLM ont diverses plages acceptables de valeurs valides. Consultez votre fournisseur LLM pour cette information.",
    },
  },
  "vector-workspace": {
    identifier: "Identifiant de la base de données vectorielle",
    snippets: {
      title: "Nombre maximum de contextes",
      description:
        "Ce paramètre contrôle le nombre maximum de contextes qui seront envoyés au LLM par chat ou requête.",
      recommend: "Recommandé: 4",
    },
    doc: {
      title: "Seuil de similarité des documents",
      description:
        "Le score de similarité minimum requis pour qu'une source soit considérée comme liée au chat. Plus le nombre est élevé, plus la source doit être similaire au chat.",
      zero: "Aucune restriction",
      low: "Bas (score de similarité ≥ .25)",
      medium: "Moyen (score de similarité ≥ .50)",
      high: "Élevé (score de similarité ≥ .75)",
    },
    reset: {
      reset: "Réinitialiser la base de données vectorielle",
      resetting: "Effacement des vecteurs...",
      confirm:
        "Vous êtes sur le point de réinitialiser la base de données vectorielle de cet espace de travail. Cela supprimera toutes les intégrations vectorielles actuellement intégrées.\n\nLes fichiers source originaux resteront intacts. Cette action est irréversible.",
      error:
        "La base de données vectorielle de l'espace de travail n'a pas pu être réinitialisée !",
      success:
        "La base de données vectorielle de l'espace de travail a été réinitialisée !",
    },
  },
  agent: {
    "performance-warning":
      "La performance des LLM qui ne supportent pas explicitement l'appel d'outils dépend fortement des capacités et de la précision du modèle. Certaines capacités peuvent être limitées ou non fonctionnelles.",
    provider: {
      title: "Fournisseur LLM de l'agent de l'espace de travail",
      description:
        "Le fournisseur et le modèle LLM spécifiques qui seront utilisés pour l'agent @agent de cet espace de travail.",
    },
    mode: {
      chat: {
        title: "Modèle de chat de l'agent de l'espace de travail",
        description:
          "Le modèle de chat spécifique qui sera utilisé pour l'agent @agent de cet espace de travail.",
      },
      title: "Modèle de l'agent de l'espace de travail",
      description:
        "Le modèle LLM spécifique qui sera utilisé pour l'agent @agent de cet espace de travail.",
      wait: "-- en attente des modèles --",
    },
    skill: {
      title: "Compétences par défaut de l'agent",
      description:
        "Améliorez les capacités naturelles de l'agent par défaut avec ces compétences préconstruites. Cette configuration s'applique à tous les espaces de travail.",
      rag: {
        title: "RAG et mémoire à long terme",
        description:
          "Permettez à l'agent de s'appuyer sur vos documents locaux pour répondre à une requête ou demandez à l'agent de se souvenir de morceaux de contenu pour la récupération de mémoire à long terme.",
      },
      view: {
        title: "Voir et résumer des documents",
        description:
          "Permettez à l'agent de lister et de résumer le contenu des fichiers de l'espace de travail actuellement intégrés.",
      },
      scrape: {
        title: "Récupérer des sites web",
        description:
          "Permettez à l'agent de visiter et de récupérer le contenu des sites web.",
      },
      generate: {
        title: "Générer des graphiques",
        description:
          "Activez l'agent par défaut pour générer différents types de graphiques à partir des données fournies ou données dans le chat.",
      },
      save: {
        title: "Générer et sauvegarder des fichiers dans le navigateur",
        description:
          "Activez l'agent par défaut pour générer et écrire des fichiers qui peuvent être sauvegardés et téléchargés dans votre navigateur.",
      },
      web: {
        title: "Recherche web en direct et navigation",
        "desc-start":
          "Permettez à votre agent de rechercher sur le web pour répondre à vos questions en se connectant à un fournisseur de recherche web (SERP).",
        "desc-end":
          "La recherche web pendant les sessions d'agent ne fonctionnera pas tant que cela ne sera pas configuré.",
      },
    },
  },
  recorded: {
    title: "Chats de l'espace de travail",
    description:
      "Voici tous les chats et messages enregistrés qui ont été envoyés par les utilisateurs, classés par date de création.",
    export: "Exporter",
    table: {
      id: "Id",
      by: "Envoyé par",
      workspace: "Espace de travail",
      prompt: "Invite",
      response: "Réponse",
      at: "Envoyé à",
    },
  },
  api: {
    title: "Clés API",
    description:
      "Les clés API permettent au titulaire d'accéder et de gérer de manière programmatique cette instance AnythingLLM.",
    link: "Lisez la documentation de l'API",
    generate: "Générer une nouvelle clé API",
    table: {
      key: "Clé API",
      by: "Créé par",
      created: "Créé",
    },
  },
  llm: {
    title: "Préférence LLM",
    description:
      "Voici les identifiants et les paramètres de votre fournisseur LLM de chat et d'intégration préféré. Il est important que ces clés soient actuelles et correctes, sinon AnythingLLM ne fonctionnera pas correctement.",
    provider: "Fournisseur LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Point de terminaison du service Azure",
        api_key: "Clé API",
        chat_deployment_name: "Nom du déploiement de chat",
        chat_model_token_limit: "Limite de tokens du modèle de chat",
        model_type: "Type de modèle",
        default: "Par défaut",
        reasoning: "Raisonnement",
        model_type_tooltip: null,
      },
    },
  },
  transcription: {
    title: "Préférence du modèle de transcription",
    description:
      "Voici les identifiants et les paramètres de votre fournisseur de modèle de transcription préféré. Il est important que ces clés soient actuelles et correctes, sinon les fichiers multimédias et audio ne seront pas transcrits.",
    provider: "Fournisseur de transcription",
    "warn-start":
      "L'utilisation du modèle local whisper sur des machines avec une RAM ou un CPU limités peut bloquer AnythingLLM lors du traitement des fichiers multimédias.",
    "warn-recommend":
      "Nous recommandons au moins 2 Go de RAM et des fichiers téléchargés <10 Mo.",
    "warn-end":
      "Le modèle intégré se téléchargera automatiquement lors de la première utilisation.",
  },
  embedding: {
    title: "Préférence d'intégration",
    "desc-start":
      "Lorsque vous utilisez un LLM qui ne supporte pas nativement un moteur d'intégration - vous devrez peut-être spécifier en plus des identifiants pour intégrer le texte.",
    "desc-end":
      "L'intégration est le processus de transformation du texte en vecteurs. Ces identifiants sont nécessaires pour transformer vos fichiers et invites en un format que AnythingLLM peut utiliser pour traiter.",
    provider: {
      title: "Fournisseur d'intégration",
    },
  },
  text: {
    title: "Préférences de division et de découpage du texte",
    "desc-start":
      "Parfois, vous voudrez peut-être changer la façon dont les nouveaux documents sont divisés et découpés avant d'être insérés dans votre base de données vectorielle.",
    "desc-end":
      "Vous ne devez modifier ce paramètre que si vous comprenez comment fonctionne la division du texte et ses effets secondaires.",
    size: {
      title: "Taille des segments de texte",
      description:
        "C'est la longueur maximale de caractères pouvant être présents dans un seul vecteur.",
      recommend: "Longueur maximale du modèle d'intégration est",
    },
    overlap: {
      title: "Chevauchement des segments de texte",
      description:
        "C'est le chevauchement maximal de caractères qui se produit pendant le découpage entre deux segments de texte adjacents.",
    },
  },
  vector: {
    title: "Base de données vectorielle",
    description:
      "Voici les identifiants et les paramètres de fonctionnement de votre instance AnythingLLM. Il est important que ces clés soient actuelles et correctes.",
    provider: {
      title: "Fournisseur de base de données vectorielle",
      description: "Aucune configuration n'est nécessaire pour LanceDB.",
    },
  },
  embeddable: {
    title: "Widgets de chat intégrables",
    description:
      "Les widgets de chat intégrables sont des interfaces de chat publiques associées à un espace de travail unique. Ils vous permettent de créer des espaces de travail que vous pouvez ensuite publier dans le monde entier.",
    create: "Créer un widget intégré",
    table: {
      workspace: "Espace de travail",
      chats: "Chats envoyés",
      active: "Domaines actifs",
      created: "Créé le",
    },
  },
  "embed-chats": {
    title: "Chats intégrés",
    export: "Exporter",
    description:
      "Voici tous les chats et messages enregistrés de tout widget intégré que vous avez publié.",
    table: {
      embed: "Intégration",
      sender: "Expéditeur",
      message: "Message",
      response: "Réponse",
      at: "Envoyé à",
    },
  },
  event: {
    title: "Journaux d'événements",
    description:
      "Consultez toutes les actions et événements se produisant sur cette instance pour la surveillance.",
    clear: "Effacer les journaux d'événements",
    table: {
      type: "Type d'événement",
      user: "Utilisateur",
      occurred: "Survenu à",
    },
  },
  privacy: {
    title: "Confidentialité et gestion des données",
    description:
      "Voici votre configuration pour la gestion des données et des fournisseurs tiers connectés avec AnythingLLM.",
    llm: "Sélection LLM",
    embedding: "Préférence d'intégration",
    vector: "Base de données vectorielle",
    anonymous: "Télémétrie anonyme activée",
  },
  connectors: {
    "search-placeholder": "Rechercher des connecteurs de données",
    "no-connectors": "Aucun connecteur de données trouvé.",
    github: {
      name: "Dépôt GitHub",
      description: "Importez un dépôt GitHub entier en un seul clic.",
      URL: "URL du dépôt GitHub",
      URL_explained: "URL du dépôt GitHub que vous souhaitez collecter.",
      token: "Jeton d'accès GitHub",
      optional: "Optionnel",
      token_explained: "Jeton d'accès pour les dépôts privés.",
      token_explained_start:
        "Sans jeton d'accès, vous ne pourrez collecter que les dépôts publics. Vous pouvez",
      token_explained_link1: "créer un jeton d'accès temporaire",
      token_explained_middle: "ou",
      token_explained_link2: "en créer un ici",
      token_explained_end: "avec la portée 'repo'.",
      ignores: "Exclusions de fichiers",
      git_ignore:
        "Liste au format .gitignore pour exclure des fichiers de la collecte. Appuyez sur Entrée après chaque entrée.",
      task_explained:
        "Une fois terminé, tous les fichiers seront disponibles pour être intégrés dans les espaces de travail dans le menu de documents.",
      branch: "Branche",
      branch_loading: "-- chargement des branches disponibles --",
      branch_explained: "Branche à collecter.",
      token_information: "Informations sur le jeton",
      token_personal:
        "Créez un jeton d'accès personnel sur GitHub pour accéder aux dépôts privés.",
    },
    gitlab: {
      name: "Dépôt GitLab",
      description: "Importez un dépôt GitLab entier en un seul clic.",
      URL: "URL du dépôt GitLab",
      URL_explained: "URL du dépôt GitLab que vous souhaitez collecter.",
      token: "Jeton d'accès GitLab",
      optional: "Optionnel",
      token_explained: "Jeton d'accès pour les dépôts privés.",
      token_description:
        "Sélectionnez les portées d'accès au dépôt lors de la création du jeton.",
      token_explained_start:
        "Sans jeton d'accès, vous ne pourrez collecter que les dépôts publics. Vous pouvez",
      token_explained_link1: "créer un jeton d'accès temporaire",
      token_explained_middle: "ou",
      token_explained_link2: "en créer un ici",
      token_explained_end: "avec la portée 'read_repository'.",
      fetch_issues: "Récupérer les issues GitLab",
      ignores: "Exclusions de fichiers",
      git_ignore:
        "Liste au format .gitignore pour exclure des fichiers de la collecte. Appuyez sur Entrée après chaque entrée.",
      task_explained:
        "Une fois terminé, tous les fichiers seront disponibles pour être intégrés dans les espaces de travail dans le menu de documents.",
      branch: "Branche",
      branch_loading: "-- chargement des branches disponibles --",
      branch_explained: "Branche à collecter.",
      token_information: "Informations sur le jeton",
      token_personal:
        "Créez un jeton d'accès personnel sur GitLab pour accéder aux dépôts privés.",
    },
    youtube: {
      name: "Transcription YouTube",
      description:
        "Importez la transcription d'une vidéo YouTube à partir d'un lien.",
      URL: "URL de la vidéo YouTube",
      URL_explained_start:
        "Entrez l'URL d'une vidéo YouTube pour récupérer sa transcription. La vidéo doit avoir les",
      URL_explained_link: "sous-titres activés",
      URL_explained_end: ".",
      task_explained:
        "Une fois terminé, la transcription sera disponible pour être intégrée dans les espaces de travail dans le menu de documents.",
      language: "Langue de la transcription",
      language_explained:
        "Sélectionnez la langue de la transcription à récupérer.",
      loading_languages: "-- chargement des langues disponibles --",
    },
    "website-depth": {
      name: "Récupération de site web en masse",
      description:
        "Récupérez un site web et ses sous-liens jusqu'à une certaine profondeur.",
      URL: "URL du site web",
      URL_explained: "URL du site web que vous souhaitez récupérer.",
      depth: "Profondeur de récupération",
      depth_explained:
        "Nombre de niveaux de sous-liens à suivre à partir de l'URL de base.",
      max_pages: "Nombre maximum de pages",
      max_pages_explained: "Nombre maximum de pages à récupérer.",
      task_explained:
        "Une fois terminé, toutes les pages récupérées seront disponibles pour être intégrées dans les espaces de travail dans le menu de documents.",
    },
    confluence: {
      name: "Confluence",
      description: "Importez un espace Confluence entier en un seul clic.",
      deployment_type: "Type de déploiement Confluence",
      deployment_type_explained:
        "Choisissez si votre instance Confluence est hébergée dans le cloud ou sur serveur.",
      base_url: "URL de base Confluence",
      base_url_explained: "L'URL de base de votre instance Confluence.",
      space_key: "Clé de l'espace Confluence",
      space_key_explained:
        "La clé de l'espace que vous souhaitez importer. Se trouve généralement dans l'URL de l'espace.",
      username: "Nom d'utilisateur Confluence",
      username_explained:
        "Votre nom d'utilisateur ou adresse e-mail Confluence.",
      auth_type: "Type d'authentification",
      auth_type_explained:
        "Choisissez le type de jeton utilisé pour l'authentification.",
      auth_type_username: "Jeton API (nom d'utilisateur + jeton)",
      auth_type_personal: "Jeton d'accès personnel (PAT)",
      token: "Jeton API Confluence",
      token_explained_start:
        "Un jeton API est requis pour l'authentification. Vous pouvez",
      token_explained_link: "générer un jeton API ici",
      token_desc: "Jeton API pour l'authentification.",
      pat_token: "Jeton d'accès personnel",
      pat_token_explained:
        "Jeton d'accès personnel pour l'authentification sur les déploiements serveur.",
      task_explained:
        "Une fois terminé, toutes les pages de l'espace seront disponibles pour être intégrées dans les espaces de travail dans le menu de documents.",
      bypass_ssl: "Ignorer la vérification SSL",
      bypass_ssl_explained:
        "Ignorez la vérification des certificats SSL pour les instances auto-hébergées avec des certificats auto-signés.",
    },
    manage: {
      documents: "Documents",
      "data-connectors": "Connecteurs de données",
      "desktop-only":
        "Cette fonctionnalité n'est disponible que sur ordinateur de bureau.",
      dismiss: "Fermer",
      editing: "Modification",
    },
    directory: {
      "my-documents": "Mes documents",
      "new-folder": "Nouveau dossier",
      "search-document": "Rechercher un document",
      "no-documents": "Aucun document",
      "move-workspace": "Déplacer vers l'espace de travail",
      name: "Nom",
      "delete-confirmation":
        "Êtes-vous sûr de vouloir supprimer ces fichiers et dossiers ?\nCela supprimera les fichiers du système et les retirera automatiquement de tout espace de travail existant.\nCette action est irréversible.",
      "removing-message":
        "Suppression de {{count}} documents et dossiers. Veuillez patienter.",
      "move-success": "{{count}} documents déplacés avec succès.",
      date: "Date",
      type: "Type",
      no_docs: "Aucun document",
      select_all: "Tout sélectionner",
      deselect_all: "Tout désélectionner",
      remove_selected: "Supprimer la sélection",
      costs: "Coûts",
      save_embed: "Sauvegarder et intégrer",
    },
    upload: {
      "processor-offline": "Processeur de documents hors ligne",
      "processor-offline-desc":
        "Nous ne pouvons pas télécharger vos fichiers pour le moment. Veuillez réessayer plus tard.",
      "click-upload": "Cliquez pour télécharger ou glissez-déposez",
      "file-types":
        "prend en charge les fichiers texte, CSV, feuilles de calcul, fichiers audio, et plus encore !",
      "or-submit-link": "ou soumettre un lien",
      "placeholder-link": "https://exemple.com",
      fetching: "Récupération...",
      "fetch-website": "Récupérer le site web",
      "privacy-notice":
        "Ces fichiers seront téléchargés sur cette instance AnythingLLM uniquement.",
    },
    pinning: {
      what_pinning: "Qu'est-ce que l'épinglage de documents ?",
      pin_explained_block1:
        "Lorsque vous épinglez un document, AnythingLLM injectera le contenu intégral du document dans votre fenêtre de prompt comme contexte préalable pour chaque interaction.",
      pin_explained_block2:
        "Ceci est idéal pour les documents que vous souhaitez référencer fréquemment ou pour fournir un contexte constant à l'IA.",
      pin_explained_block3:
        "L'épinglage fonctionne mieux avec des documents plus petits. Les documents volumineux peuvent affecter les performances.",
      accept: "J'ai compris",
    },
    watching: {
      what_watching: "Qu'est-ce que la surveillance de documents ?",
      watch_explained_block1:
        "Lorsque vous surveillez un document, AnythingLLM re-synchronisera automatiquement le contenu du document depuis sa source de manière périodique.",
      watch_explained_block2:
        "Cela gardera le contenu à jour si le fichier source change.",
      watch_explained_block3_start:
        "Cette fonctionnalité est actuellement limitée à",
      watch_explained_block3_link: "certains types de fichiers",
      watch_explained_block3_end: ".",
      accept: "J'ai compris",
    },
    obsidian: {
      name: "Coffre Obsidian",
      description: "Importez un coffre Obsidian depuis votre machine locale.",
      vault_location: "Emplacement du coffre",
      vault_description:
        "Sélectionnez le dossier racine de votre coffre Obsidian.",
      selected_files: "fichiers sélectionnés",
      importing: "Importation...",
      import_vault: "Importer le coffre",
      processing_time:
        "Le traitement peut prendre quelques minutes selon la taille du coffre.",
      vault_warning:
        "Assurez-vous de sélectionner le dossier racine contenant le dossier .obsidian.",
    },
  },
  chat_window: {
    welcome: "Bienvenue dans votre nouvel espace de travail.",
    get_started: "Pour commencer, vous pouvez",
    get_started_default:
      "Pour commencer, envoyez un message ou téléchargez un document.",
    upload: "téléverser un document",
    or: "ou",
    send_chat: "envoyer un message",
    send_message: "Envoyer un message",
    attach_file: "Joindre un fichier",
    slash: "Voir les commandes slash disponibles",
    agents: "Voir les agents disponibles",
    text_size: "Modifier la taille du texte",
    microphone: "Enregistrer un message vocal",
    send: "Envoyer le message au chatbot",
    attachments_processing:
      "Les pièces jointes sont en cours de traitement. Veuillez attendre avant d'envoyer un autre message.",
    tts_speak_message: "Écouter le message",
    copy: "Copier",
    regenerate: "Régénérer",
    regenerate_response: "Régénérer la réponse",
    good_response: "Bonne réponse",
    more_actions: "Plus d'actions",
    hide_citations: "Masquer les citations",
    show_citations: "Afficher les citations",
    pause_tts_speech_message: "Mettre en pause la lecture vocale",
    fork: "Dupliquer",
    delete: "Supprimer",
    save_submit: "Sauvegarder et envoyer",
    cancel: "Annuler",
    edit_prompt: "Modifier le prompt",
    edit_response: "Modifier la réponse",
    at_agent:
      "Sélectionnez une compétence d'agent, un flux d'agent ou un serveur MCP",
    default_agent_description: "l'agent par défaut de cet espace de travail",
    custom_agents_coming_soon: "Agents personnalisés bientôt disponibles",
    slash_reset: "Effacer l'historique du chat",
    preset_reset_description:
      "Efface l'historique du chat actuel et commence une nouvelle conversation.",
    add_new_preset: "Ajouter une nouvelle commande preset",
    command: "Commande",
    your_command: "Votre commande",
    placeholder_prompt: "Quel est le prompt pour cette commande ?",
    description: "Description",
    placeholder_description: "Décrivez ce que fait cette commande",
    save: "Sauvegarder",
    small: "Petit",
    normal: "Normal",
    large: "Grand",
    workspace_llm_manager: {
      search: "Rechercher des modèles",
      loading_workspace_settings:
        "Chargement des paramètres de l'espace de travail...",
      available_models: "Modèles disponibles",
      available_models_description:
        "Sélectionnez un modèle à utiliser pour cet espace de travail.",
      save: "Sauvegarder",
      saving: "Sauvegarde...",
      missing_credentials: "Identifiants manquants",
      missing_credentials_description:
        "Vous devez configurer vos identifiants de fournisseur LLM avant de pouvoir sélectionner un modèle.",
    },
  },
  profile_settings: {
    edit_account: "Modifier le compte",
    profile_picture: "Photo de profil",
    remove_profile_picture: "Supprimer la photo de profil",
    username: "Nom d'utilisateur",
    username_description:
      "Le nom d'utilisateur doit contenir uniquement des lettres minuscules, des chiffres, des tirets bas et des tirets, sans espaces.",
    new_password: "Nouveau mot de passe",
    password_description:
      "Le mot de passe doit contenir au moins 8 caractères.",
    cancel: "Annuler",
    update_account: "Mettre à jour le compte",
    theme: "Thème",
    language: "Langue",
    failed_upload: "Échec du téléchargement de l'image.",
    upload_success: "Image téléchargée avec succès.",
    failed_remove: "Échec de la suppression de l'image.",
    profile_updated: "Profil mis à jour avec succès.",
    failed_update_user: "Échec de la mise à jour de l'utilisateur.",
    account: "Compte",
    support: "Support",
    signout: "Déconnexion",
  },
  customization: {
    interface: {
      title: "Interface",
      description: "Personnalisez l'apparence de l'interface utilisateur.",
    },
    branding: {
      title: "Personnalisation de la marque",
      description: "Personnalisez les éléments de marque de votre instance.",
    },
    chat: {
      title: "Chat",
      description: "Personnalisez le comportement du chat.",
      auto_submit: {
        title: "Soumission automatique",
        description:
          "Soumet automatiquement le message lorsque vous utilisez la reconnaissance vocale.",
      },
      auto_speak: {
        title: "Lecture automatique",
        description: "Lit automatiquement les réponses de l'IA à haute voix.",
      },
      spellcheck: {
        title: "Correction orthographique",
        description:
          "Active la correction orthographique dans la zone de saisie du chat.",
      },
    },
    items: {
      theme: {
        title: "Thème",
        description: "Sélectionnez votre thème d'interface préféré.",
      },
      "show-scrollbar": {
        title: "Afficher la barre de défilement",
        description: "Affiche la barre de défilement dans l'interface de chat.",
      },
      "support-email": {
        title: "E-mail de support",
        description:
          "Définissez l'adresse e-mail de support affichée aux utilisateurs.",
      },
      "app-name": {
        title: "Nom de l'application",
        description: "Définissez le nom affiché dans l'interface.",
      },
      "chat-message-alignment": {
        title: "Alignement des messages",
        description: "Choisissez l'alignement des messages dans le chat.",
      },
      "display-language": {
        title: "Langue d'affichage",
        description: "Sélectionnez la langue de l'interface utilisateur.",
      },
      logo: {
        title: "Logo",
        description: "Téléchargez votre logo personnalisé.",
        add: "Ajouter un logo personnalisé",
        recommended: "Taille recommandée : 800 x 200",
        remove: "Supprimer",
        replace: "Remplacer",
      },
      "welcome-messages": {
        title: "Messages de bienvenue",
        description:
          "Personnalisez les messages affichés aux nouveaux utilisateurs.",
        new: "Nouveau",
        system: "système",
        user: "utilisateur",
        message: "message",
        assistant: "assistant",
        "double-click": "Double-cliquez pour modifier.",
        save: "Sauvegarder les messages",
      },
      "browser-appearance": {
        title: "Apparence du navigateur",
        description: "Personnalisez l'apparence de l'onglet du navigateur.",
        tab: {
          title: "Titre de l'onglet",
          description:
            "Définissez le titre affiché dans l'onglet du navigateur.",
        },
        favicon: {
          title: "Favicon",
          description:
            "Définissez l'icône affichée dans l'onglet du navigateur.",
        },
      },
      "sidebar-footer": {
        title: "Pied de page de la barre latérale",
        description:
          "Ajoutez des icônes et des liens personnalisés au pied de page de la barre latérale.",
        icon: "URL de l'icône",
        link: "URL de destination",
      },
      "render-html": {
        title: "Rendu HTML",
        description:
          "Autorise le rendu du contenu HTML dans les réponses du chat.",
      },
    },
  },
  "main-page": {
    noWorkspaceError: "Veuillez créer un espace de travail pour commencer.",
    checklist: {
      title: "Liste de démarrage",
      tasksLeft: "tâches restantes",
      completed: "Terminé !",
      dismiss: "Fermer",
      tasks: {
        create_workspace: {
          title: "Créer un espace de travail",
          description:
            "Créez votre premier espace de travail pour organiser vos documents et conversations.",
          action: "Créer",
        },
        send_chat: {
          title: "Envoyer un message",
          description:
            "Démarrez une conversation avec l'IA dans votre espace de travail.",
          action: "Chatter",
        },
        embed_document: {
          title: "Intégrer un document",
          description:
            "Ajoutez des documents à votre espace de travail pour enrichir les réponses de l'IA.",
          action: "Télécharger",
        },
        setup_system_prompt: {
          title: "Configurer le prompt système",
          description:
            "Personnalisez les instructions de l'IA pour votre espace de travail.",
          action: "Configurer",
        },
        define_slash_command: {
          title: "Définir une commande slash",
          description:
            "Créez des raccourcis pour des prompts fréquemment utilisés.",
          action: "Créer",
        },
        visit_community: {
          title: "Visiter la communauté",
          description:
            "Rejoignez la communauté AnythingLLM pour obtenir de l'aide et partager vos expériences.",
          action: "Visiter",
        },
      },
    },
    quickLinks: {
      title: "Accès rapide",
      sendChat: "Envoyer un message",
      embedDocument: "Intégrer un document",
      createWorkspace: "Créer un espace de travail",
    },
    exploreMore: {
      title: "Explorer plus",
      features: {
        customAgents: {
          title: "Agents personnalisés",
          description:
            "Créez des agents IA spécialisés avec des compétences et des comportements personnalisés.",
          primaryAction: "Créer un agent",
          secondaryAction: "En savoir plus",
        },
        slashCommands: {
          title: "Commandes slash",
          description:
            "Créez des raccourcis pour des actions et des prompts fréquemment utilisés.",
          primaryAction: "Créer une commande",
          secondaryAction: "En savoir plus",
        },
        systemPrompts: {
          title: "Prompts système",
          description:
            "Personnalisez les instructions et le comportement de l'IA pour chaque espace de travail.",
          primaryAction: "Configurer",
          secondaryAction: "En savoir plus",
        },
      },
    },
    announcements: {
      title: "Annonces",
    },
    resources: {
      title: "Ressources",
      links: {
        docs: "Documentation",
        star: "Étoiler sur GitHub",
      },
      keyboardShortcuts: "Raccourcis clavier",
    },
  },
  "keyboard-shortcuts": {
    title: "Raccourcis clavier",
    shortcuts: {
      settings: "Ouvrir les paramètres",
      workspaceSettings: "Paramètres de l'espace de travail",
      home: "Retour à l'accueil",
      workspaces: "Afficher les espaces de travail",
      apiKeys: "Gérer les clés API",
      llmPreferences: "Préférences LLM",
      chatSettings: "Paramètres du chat",
      help: "Afficher l'aide",
      showLLMSelector: "Afficher le sélecteur de LLM",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Prompt publié avec succès !",
        success_description:
          "Votre prompt système a été publié sur le Community Hub.",
        success_thank_you: "Merci pour votre contribution !",
        view_on_hub: "Voir sur le Hub",
        modal_title: "Publier le prompt système",
        name_label: "Nom",
        name_description: "Un nom descriptif pour votre prompt.",
        name_placeholder: "Mon super prompt",
        description_label: "Description",
        description_description:
          "Décrivez ce que fait votre prompt et comment l'utiliser.",
        tags_label: "Tags",
        tags_description:
          "Ajoutez des tags pour aider les autres à trouver votre prompt.",
        tags_placeholder: "productivité, rédaction, code...",
        visibility_label: "Visibilité",
        public_description: "Visible par tous sur le Community Hub.",
        private_description: "Visible uniquement par vous.",
        publish_button: "Publier",
        submitting: "Publication...",
        submit: "Soumettre",
        prompt_label: "Prompt",
        prompt_description: "Le contenu de votre prompt système.",
        prompt_placeholder: "Vous êtes un assistant IA utile...",
      },
      agent_flow: {
        public_description: "Visible par tous sur le Community Hub.",
        private_description: "Visible uniquement par vous.",
        success_title: "Flux d'agent publié avec succès !",
        success_description:
          "Votre flux d'agent a été publié sur le Community Hub.",
        success_thank_you: "Merci pour votre contribution !",
        view_on_hub: "Voir sur le Hub",
        modal_title: "Publier le flux d'agent",
        name_label: "Nom",
        name_description: "Un nom descriptif pour votre flux d'agent.",
        name_placeholder: "Mon flux d'agent",
        description_label: "Description",
        description_description:
          "Décrivez ce que fait votre flux d'agent et comment l'utiliser.",
        tags_label: "Tags",
        tags_description:
          "Ajoutez des tags pour aider les autres à trouver votre flux.",
        tags_placeholder: "automatisation, productivité...",
        visibility_label: "Visibilité",
        publish_button: "Publier",
        submitting: "Publication...",
        submit: "Soumettre",
        privacy_note:
          "Les flux d'agents peuvent contenir des informations sensibles. Vérifiez le contenu avant de le rendre public.",
      },
      generic: {
        unauthenticated: {
          title: "Connexion requise",
          description:
            "Vous devez vous connecter à votre compte AnythingLLM pour publier sur le Community Hub.",
          button: "Se connecter",
        },
      },
      slash_command: {
        success_title: "Commande publiée avec succès !",
        success_description:
          "Votre commande slash a été publiée sur le Community Hub.",
        success_thank_you: "Merci pour votre contribution !",
        view_on_hub: "Voir sur le Hub",
        modal_title: "Publier la commande slash",
        name_label: "Nom",
        name_description: "Un nom descriptif pour votre commande.",
        name_placeholder: "Ma commande",
        description_label: "Description",
        description_description:
          "Décrivez ce que fait votre commande et comment l'utiliser.",
        command_label: "Commande",
        command_description: "La commande slash (sans le /).",
        command_placeholder: "resume",
        tags_label: "Tags",
        tags_description:
          "Ajoutez des tags pour aider les autres à trouver votre commande.",
        tags_placeholder: "productivité, résumé...",
        visibility_label: "Visibilité",
        public_description: "Visible par tous sur le Community Hub.",
        private_description: "Visible uniquement par vous.",
        publish_button: "Publier",
        submitting: "Publication...",
        prompt_label: "Prompt",
        prompt_description: "Le prompt exécuté par cette commande.",
        prompt_placeholder: "Résumez le texte suivant : {{input}}",
      },
    },
  },
  security: {
    title: "Sécurité",
    multiuser: {
      title: "Mode multi-utilisateurs",
      description:
        "Configurez votre instance pour prendre en charge votre équipe en activant le mode multi-utilisateurs.",
      enable: {
        "is-enable": "Le mode multi-utilisateurs est activé",
        enable: "Activer le mode multi-utilisateurs",
        description:
          "Par défaut, vous serez le seul administrateur. En tant qu'administrateur, vous devrez créer des comptes pour tous les nouveaux utilisateurs ou administrateurs. Ne perdez pas votre mot de passe car seul un utilisateur administrateur peut réinitialiser les mots de passe.",
        username: "Nom d'utilisateur du compte administrateur",
        password: "Mot de passe du compte administrateur",
      },
    },
    password: {
      title: "Protection par mot de passe",
      description:
        "Protégez votre instance AnythingLLM avec un mot de passe. Si vous oubliez ce mot de passe, il n'y a pas de méthode de récupération, donc assurez-vous de le sauvegarder.",
      "password-label": "Mot de passe de l'instance",
    },
  },
  home: {
    welcome: "Bienvenue",
    chooseWorkspace:
      "Choisissez un espace de travail pour commencer à chatter!",
    notAssigned:
      "Vous n'êtes actuellement pas affecté à aucun espace de travail.\nPour accéder à un espace de travail, veuillez contacter votre administrateur.",
    goToWorkspace: 'Aller à "{{workspace}}"',
  },
};

export default TRANSLATIONS;
