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
      getStarted: "Commencer",
      welcome: "Bienvenue",
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
  },
  common: {
    "workspaces-name": "Nom des espaces de travail",
    selection: "Sélection du modèle",
    saving: "Enregistrement...",
    save: "Enregistrer les modifications",
    previous: "Page précédente",
    next: "Page suivante",
    optional: "Optionnel",
    yes: "Oui",
    no: "Non",
    search: "Rechercher",
    username_requirements:
      "Le nom d'utilisateur doit comporter entre 2 et 32 caractères, commencer par une lettre minuscule et ne contenir que des lettres minuscules, des chiffres, des tirets bas, des tirets et des points.",
    on: "Sur",
    none: "Aucun",
    stopped: "Arrêté",
    loading: "Chargement",
    refresh: "Rafraîchir",
  },
  settings: {
    title: "Paramètres de l'instance",
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
    "mobile-app": "AnythingLLM Mobile",
    "community-hub": {
      title: "Centre communautaire",
      trending: "Découvrez les tendances",
      "your-account": "Votre compte",
      "import-item": "Importer",
    },
    channels: "Canaux",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Tâches planifiées",
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
    "sign-in": "Connectez-vous à votre compte {{appName}}.",
    "password-reset": {
      title: "Réinitialisation du mot de passe",
      description:
        "Fournissez les informations nécessaires ci-dessous pour réinitialiser votre mot de passe.",
      "recovery-codes": "Codes de récupération",
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
    },
    mode: {
      title: "Mode de chat",
      chat: {
        title: "Chat",
        description:
          'fournira des réponses en utilisant les connaissances générales de l\'LLM et le contexte du document, <b>et</b>. Vous devrez utiliser la commande "@agent" pour utiliser les outils.',
      },
      query: {
        title: "Requête",
        description:
          'fournira des réponses <b>uniquement</b> si le contexte du document est trouvé.<br />Vous devrez utiliser la commande "@agent" pour utiliser les outils.',
      },
      automatic: {
        description:
          "utilisera automatiquement les outils si le modèle et le fournisseur prennent en charge l'appel de fonctions natives. <br />Si l'utilisation de fonctions natives n'est pas prise en charge, vous devrez utiliser la commande \"@agent\" pour utiliser les outils.",
        title: "Agent",
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
      web: {
        title: "Recherche web en direct et navigation",
        description:
          "Permettez à votre agent de rechercher sur le web pour répondre à vos questions en vous connectant à un fournisseur de recherche web (SERP).",
      },
      sql: {
        title: "Connecteur SQL",
        description:
          "Permettez à votre agent d'utiliser SQL pour répondre à vos questions en lui fournissant un accès à divers fournisseurs de bases de données SQL.",
      },
      default_skill:
        "Par défaut, cette fonctionnalité est activée, mais vous pouvez la désactiver si vous ne souhaitez pas qu'elle soit disponible pour l'agent.",
      filesystem: {
        title: "Accès au système de fichiers",
        description:
          "Permettez à votre agent de lire, écrire, rechercher et gérer des fichiers dans un répertoire spécifié. Prend en charge la modification de fichiers, la navigation dans les répertoires et la recherche de contenu.",
        learnMore: "En savoir plus sur la manière d'utiliser cette compétence.",
        configuration: "Configuration",
        readActions: "Lire les actions",
        writeActions: "Actions à effectuer",
        warning:
          "L'accès au système de fichiers peut être dangereux, car il peut modifier ou supprimer des fichiers. Veuillez consulter la <a>documentation</a> avant de l'activer.",
        skills: {
          "read-text-file": {
            title: "Ouvrir le fichier",
            description:
              "Lire le contenu des fichiers (texte, code, PDF, images, etc.)",
          },
          "read-multiple-files": {
            title: "Lire plusieurs fichiers",
            description: "Lire plusieurs fichiers simultanément.",
          },
          "list-directory": {
            title: "Annuaire",
            description:
              "Énumérer les fichiers et les répertoires d'un dossier.",
          },
          "search-files": {
            title: "Rechercher des fichiers",
            description: "Rechercher des fichiers par nom ou par contenu",
          },
          "get-file-info": {
            title: "Obtenir des informations sur le fichier",
            description: "Obtenez des métadonnées détaillées sur les fichiers.",
          },
          "edit-file": {
            title: "Modifier le fichier",
            description:
              "Effectuez des modifications basées sur des lignes dans les fichiers de texte.",
          },
          "create-directory": {
            title: "Créer un répertoire",
            description: "Créer de nouveaux répertoires",
          },
          "move-file": {
            title: "Déplacer/Renommer le fichier",
            description:
              "Déplacez ou renommez des fichiers et des répertoires.",
          },
          "copy-file": {
            title: "Copier le fichier",
            description: "Copier des fichiers et des répertoires",
          },
          "write-text-file": {
            title: "Créer un fichier texte",
            description:
              "Créer de nouveaux fichiers texte ou remplacer des fichiers texte existants.",
          },
        },
      },
      createFiles: {
        title: "Création de documents",
        description:
          "Permettez à votre agent de créer des documents au format binaire, tels que des présentations PowerPoint, des feuilles de calcul Excel, des documents Word et des fichiers PDF. Les fichiers peuvent être téléchargés directement depuis la fenêtre de chat.",
        configuration: "Types de documents disponibles",
        skills: {
          "create-text-file": {
            title: "Fichiers de texte",
            description:
              "Créez des fichiers texte avec n'importe quel contenu et extension (par exemple, .txt, .md, .json, .csv, etc.)",
          },
          "create-pptx": {
            title: "Présentations PowerPoint",
            description:
              "Créez de nouvelles présentations PowerPoint avec des diapositives, des titres et des puces.",
          },
          "create-pdf": {
            title: "Documents au format PDF",
            description:
              "Créez des documents PDF à partir de fichiers Markdown ou de texte brut, avec un style de base.",
          },
          "create-xlsx": {
            title: "Feuilles de calcul Excel",
            description:
              "Créez des documents Excel pour les données tabulaires, avec des feuilles et un style.",
          },
          "create-docx": {
            title: "Documents au format Word",
            description:
              "Créez des documents Word avec un style et une mise en page de base.",
          },
        },
      },
      gmail: {
        title: "Connecteur GMail",
        description:
          "Permettez à votre agent d'interagir avec Gmail : rechercher des e-mails, lire les conversations, rédiger des brouillons, envoyer des e-mails et gérer votre boîte de réception. <a>Consultez la documentation</a>.",
        multiUserWarning:
          "L'intégration avec Gmail n'est pas disponible en mode multi-utilisateurs pour des raisons de sécurité. Veuillez désactiver le mode multi-utilisateurs pour utiliser cette fonctionnalité.",
        configuration: "Configuration de Gmail",
        deploymentId: "Identifiant de déploiement",
        deploymentIdHelp:
          "L'identifiant de déploiement de votre application web Google Apps Script",
        apiKey: "Clé API",
        apiKeyHelp:
          "La clé API que vous avez configurée lors de votre déploiement de Google Apps Script",
        configurationRequired:
          "Veuillez configurer l'ID de déploiement et la clé API pour activer les fonctionnalités de Gmail.",
        configured: "Configuré",
        searchSkills: "Compétences de recherche...",
        noSkillsFound: "Aucune compétence ne correspond à votre recherche.",
        categories: {
          search: {
            title: "Rechercher et lire des e-mails",
            description:
              "Recherchez et lisez vos e-mails dans votre boîte de réception Gmail.",
          },
          drafts: {
            title: "Modèles de courriels",
            description: "Créer, modifier et gérer des brouillons d'e-mails.",
          },
          send: {
            title: "Envoyer et répondre aux e-mails",
            description:
              "Envoyez des e-mails et répondez immédiatement aux discussions.",
          },
          threads: {
            title: "Gérer les conversations par e-mail",
            description:
              "Gérer les conversations par e-mail : marquer comme lu/non lu, archiver, supprimer",
          },
          account: {
            title: "Statistiques d'intégration",
            description:
              "Consultez les statistiques de votre boîte de réception et les informations de votre compte.",
          },
        },
        skills: {
          search: {
            title: "Rechercher dans les e-mails",
            description:
              "Rechercher des e-mails en utilisant la syntaxe de recherche de Gmail",
          },
          readThread: {
            title: "Lire le fil de discussion",
            description: "Lire l'intégralité d'une conversation par ID",
          },
          createDraft: {
            title: "Créer une version préliminaire",
            description: "Créez une nouvelle version de l'e-mail.",
          },
          createDraftReply: {
            title: "Créer une réponse brouillon",
            description:
              "Rédiger une réponse préliminaire à un fil de discussion existant.",
          },
          updateDraft: {
            title: "Mise à jour de la version préliminaire",
            description: "Mettre à jour un brouillon de courriel existant",
          },
          getDraft: {
            title: "Obtenir la version préliminaire",
            description:
              "Récupérer une version spécifique par son identifiant.",
          },
          listDrafts: {
            title: "Propositions/Brouillons",
            description: "Énumérer tous les courriels en brouillon.",
          },
          deleteDraft: {
            title: "Supprimer la version brouillon",
            description: "Supprimer une brouillon de courriel",
          },
          sendDraft: {
            title: "Envoyer une version préliminaire",
            description: "Envoyer une version existante d'un courriel",
          },
          sendEmail: {
            title: "Envoyer un e-mail",
            description: "Envoyez un courriel immédiatement.",
          },
          replyToThread: {
            title: "Répondre à la discussion",
            description:
              "Répondre immédiatement à une conversation par e-mail.",
          },
          markRead: {
            title: "Mark Read",
            description: "Indiquer qu'un fil de discussion a été lu",
          },
          markUnread: {
            title: "Signaler comme non lu",
            description: "Indiquer qu'un fil de discussion est non lu",
          },
          moveToTrash: {
            title: "Envoyer à la poubelle",
            description: "Déplacer un fil dans la corbeille d'ordures",
          },
          moveToArchive: {
            title: "Archives",
            description: "Archiver une discussion",
          },
          moveToInbox: {
            title: "Envoyer vers la boîte de réception",
            description:
              "Déplacer un fil de discussion dans la boîte de réception",
          },
          getMailboxStats: {
            title: "Statistiques de la boîte de réception",
            description:
              "Obtenez le nombre d'emails non lus et les statistiques de votre boîte de réception.",
          },
          getInbox: {
            title: "Accéder à la boîte de réception",
            description:
              "Une méthode simple et efficace pour récupérer les e-mails de votre boîte de réception Gmail.",
          },
        },
      },
      outlook: {
        title: "Connecteur Outlook",
        description:
          "Permettez à votre agent d'interagir avec Microsoft Outlook : rechercher des e-mails, lire les fils de discussion, rédiger des brouillons, envoyer des e-mails et gérer votre boîte de réception via l'API Microsoft Graph. <a>Consultez la documentation</a>.",
        multiUserWarning:
          "L'intégration avec Outlook n'est pas disponible en mode multi-utilisateurs pour des raisons de sécurité. Veuillez désactiver le mode multi-utilisateurs afin d'utiliser cette fonctionnalité.",
        configuration: "Configuration de Outlook",
        authType: "Type de compte",
        authTypeHelp:
          "Choisissez quels types de comptes Microsoft peuvent être utilisés pour l'authentification. « Tous les comptes » prend en charge à la fois les comptes personnels et les comptes professionnels/scolaires. « Seulement les comptes personnels » limite l'utilisation aux comptes Microsoft personnels. « Seulement les comptes professionnels/scolaires » limite l'utilisation aux comptes provenant d'un tenant Azure AD spécifique.",
        authTypeCommon:
          "Tous les comptes (personnels et professionnels/scolaires)",
        authTypeConsumers: "Seuls les comptes Microsoft personnels",
        authTypeOrganization:
          "Comptes d'organisations uniquement (nécessite l'identifiant du locataire)",
        clientId: "Identifiant (Client)",
        clientIdHelp:
          "L'identifiant de l'application (client) provenant de votre enregistrement d'application dans Azure AD.",
        tenantId: "Identifiant (locataire)",
        tenantIdHelp:
          "L'ID du répertoire (utilisateur) provenant de votre inscription d'application dans Azure AD. Nécessaire uniquement pour l'authentification au sein d'une seule organisation.",
        clientSecret: "Clé secrète",
        clientSecretHelp:
          "La valeur secrète du client provenant de l'enregistrement de votre application Azure AD.",
        configurationRequired:
          "Veuillez configurer l'ID client et le secret client afin d'activer les fonctionnalités Outlook.",
        authRequired:
          "Enregistrez d'abord vos informations d'identification, puis authentifiez-vous auprès de Microsoft pour finaliser la configuration.",
        authenticateWithMicrosoft: "S'authentifier auprès de Microsoft",
        authenticated: "Connexion réussie avec Microsoft Outlook.",
        revokeAccess: "Retirer l'accès",
        configured: "Configuré",
        searchSkills: "Compétences de recherche...",
        noSkillsFound: "Aucun résultat correspondant à votre recherche.",
        categories: {
          search: {
            title: "Rechercher et lire des e-mails",
            description:
              "Recherchez et lisez vos e-mails dans votre boîte de réception Outlook.",
          },
          drafts: {
            title: "Modèles de courriels",
            description:
              "Créer, modifier et gérer des brouillons de courriels.",
          },
          send: {
            title: "Envoyer des e-mails",
            description:
              "Envoyer de nouveaux courriels ou répondre immédiatement aux messages.",
          },
          account: {
            title: "Statistiques d'intégration",
            description:
              "Consultez les statistiques de votre boîte de réception et les informations de votre compte.",
          },
        },
        skills: {
          getInbox: {
            title: "Accéder à la boîte de réception",
            description:
              "Récupérez les e-mails récents de votre boîte de réception Outlook.",
          },
          search: {
            title: "Rechercher des e-mails",
            description:
              "Recherchez des e-mails à l'aide de la syntaxe de recherche de Microsoft.",
          },
          readThread: {
            title: "Lire la conversation",
            description: "Lire l'intégralité d'une conversation par e-mail.",
          },
          createDraft: {
            title: "Créer une version préliminaire",
            description:
              "Créez une nouvelle version d'un courriel ou une réponse à un courriel existant.",
          },
          updateDraft: {
            title: "Version actuelle",
            description: "Mettre à jour un brouillon de courriel existant",
          },
          listDrafts: {
            title: "Propositions préliminaires",
            description: "Énumérez tous les courriels en brouillon.",
          },
          deleteDraft: {
            title: "Supprimer la version brouillon",
            description: "Supprimer une brouillon de courriel",
          },
          sendDraft: {
            title: "Envoyer une version préliminaire",
            description: "Envoyer une version existante d'un e-mail",
          },
          sendEmail: {
            title: "Envoyer un e-mail",
            description:
              "Envoyez un nouvel e-mail ou répondez immédiatement à un message existant.",
          },
          getMailboxStats: {
            title: "Statistiques de la boîte de réception",
            description:
              "Obtenez le nombre de dossiers et les statistiques des boîtes aux lettres.",
          },
        },
      },
      googleCalendar: {
        title: "Connecteur Google Calendar",
        description:
          "Permettez à votre agent d'interagir avec Google Calendar : consulter les calendriers, afficher les événements, créer et modifier des événements, et gérer les confirmations de présence. <a>Consultez la documentation</a>.",
        multiUserWarning:
          "L'intégration avec Google Calendar n'est pas disponible en mode multi-utilisateurs pour des raisons de sécurité. Veuillez désactiver le mode multi-utilisateurs pour utiliser cette fonctionnalité.",
        configuration: "Configuration de Google Calendar",
        deploymentId: "ID de déploiement",
        deploymentIdHelp:
          "L'identifiant de déploiement de votre application web Google Apps Script",
        apiKey: "Clé API",
        apiKeyHelp:
          "La clé API que vous avez configurée dans votre déploiement de Google Apps Script",
        configurationRequired:
          "Veuillez configurer l'ID de déploiement et la clé API pour activer les fonctionnalités Google Calendar.",
        configured: "Configuré",
        searchSkills: "Compétences de recherche...",
        noSkillsFound: "Aucun résultat correspondant à votre recherche.",
        categories: {
          calendars: {
            title: "Calendriers",
            description: "Visualisez et gérez vos calendriers Google.",
          },
          readEvents: {
            title: "Lire les événements",
            description:
              "Visualiser et rechercher les événements du calendrier",
          },
          writeEvents: {
            title: "Créer et mettre à jour des événements",
            description:
              "Créer de nouveaux événements et modifier les événements existants.",
          },
          rsvp: {
            title: "Gestion des réponses",
            description: "Gérez votre statut de réponse pour les événements.",
          },
        },
        skills: {
          listCalendars: {
            title: "Calendriers",
            description:
              "Énumérez tous les calendriers que vous possédez ou auxquels vous êtes abonné.",
          },
          getCalendar: {
            title: "Obtenir les détails du calendrier",
            description:
              "Obtenez des informations détaillées sur un calendrier spécifique.",
          },
          getEvent: {
            title: "Obtenir l'événement",
            description:
              "Obtenez des informations détaillées sur un événement spécifique.",
          },
          getEventsForDay: {
            title: "Obtenir les événements pour la journée",
            description:
              "Consultez tous les événements prévus pour une date spécifique.",
          },
          getEvents: {
            title: "Événements (période)",
            description:
              "Récupérer des événements dans une plage de dates personnalisée",
          },
          getUpcomingEvents: {
            title: "Consulter les événements à venir",
            description:
              "Trouvez des événements pour aujourd'hui, cette semaine ou ce mois en utilisant des mots-clés simples.",
          },
          quickAdd: {
            title: "Ajouter un événement rapidement",
            description:
              "Créer un événement à partir d'une description en langage naturel (par exemple, « Réunion demain à 15h »)",
          },
          createEvent: {
            title: "Créer un événement",
            description:
              "Créez un nouvel événement avec un contrôle total sur toutes les propriétés.",
          },
          updateEvent: {
            title: "Mise à jour de l'événement",
            description:
              "Mettre à jour un événement existant dans le calendrier",
          },
          setMyStatus: {
            title: "Définir le statut de réponse",
            description:
              "Accepter, refuser ou accepter provisoirement un événement.",
          },
        },
      },
    },
    mcp: {
      title: "Serveurs MCP",
      "loading-from-config":
        "Chargement des serveurs MCP à partir du fichier de configuration",
      "learn-more": "En savoir plus sur les serveurs MCP.",
      "no-servers-found": "Aucun serveur MCP n'a été trouvé.",
      "tool-warning":
        "Pour obtenir les meilleures performances, envisagez de désactiver les outils inutiles afin de préserver le contexte.",
      "stop-server": "Arrêter le serveur MCP",
      "start-server": "Démarrer le serveur MCP",
      "delete-server": "Supprimer le serveur MCP",
      "tool-count-warning":
        "Ce serveur MCP a <b> des outils {{count}} activés</b> qui consommeront du contexte dans chaque conversation.<br /> Envisagez de désactiver les outils inutiles pour préserver le contexte.",
      "startup-command": "Commande de démarrage",
      command: "Ordre",
      arguments: "Arguments",
      "not-running-warning":
        "Ce serveur MCP n'est pas en cours de fonctionnement ; il peut être arrêté ou rencontrer une erreur lors du démarrage.",
      "tool-call-arguments": "Arguments des appels de fonctions/outils",
      "tools-enabled": "outils activés",
    },
    settings: {
      title: "Paramètres des compétences des agents",
      "max-tool-calls": {
        title: "Nombre maximal de requêtes Max Tool par réponse",
        description:
          "Le nombre maximal d'outils qu'un agent peut utiliser en chaîne pour générer une seule réponse. Cela empêche les appels excessifs aux outils et les boucles infinies.",
      },
      "intelligent-skill-selection": {
        title: "Sélection de compétences basée sur l'intelligence",
        "beta-badge": "Bêta",
        description:
          "Permettez l'utilisation illimitée d'outils et réduisez la consommation de jetons jusqu'à 80 % par requête – AnythingLLM sélectionne automatiquement les compétences appropriées pour chaque requête.",
        "max-tools": {
          title: "Max Tools",
          description:
            "Le nombre maximal d'outils à sélectionner pour chaque requête. Nous recommandons de définir cette valeur sur une valeur plus élevée pour les modèles de contexte plus importants.",
        },
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
    empty: "Aucune clé API trouvée",
    actions: "Actions",
    messages: {
      error: "Erreur : {{error}}",
    },
    modal: {
      title: "Créer une nouvelle clé API",
      cancel: "Annuler",
      close: "Fermer",
      create: "Créer une clé API",
      helper:
        "Une fois créée, la clé API peut être utilisée pour accéder à cette instance AnythingLLM et la configurer de manière programmatique.",
      name: {
        label: "Nom",
        placeholder: "Intégration de production",
        helper:
          "Facultatif. Utilisez un nom explicite pour pouvoir retrouver facilement cette clé plus tard.",
      },
    },
    row: {
      copy: "Copier la clé API",
      copied: "Copiée",
      unnamed: "--",
      deleteConfirm:
        "Voulez-vous vraiment désactiver cette clé API ?\nAprès cela, elle ne pourra plus être utilisée.\n\nCette action est irréversible.",
    },
    table: {
      name: "Nom",
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
        model_type_tooltip:
          "Si votre déploiement utilise un modèle de raisonnement (o1, o1-mini, o3-mini, etc.), veuillez définir cette option sur « Raisonnement ». Sinon, vos requêtes de conversation pourraient échouer.",
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
      "delete-confirmation":
        "Êtes-vous sûr de vouloir supprimer ces fichiers et dossiers ?\nCela supprimera les fichiers du système et les retirera automatiquement de tout espace de travail existant.\nCette action est irréversible.",
      "removing-message":
        "Suppression de {{count}} documents et dossiers. Veuillez patienter.",
      "move-success": "{{count}} documents déplacés avec succès.",
      no_docs: "Aucun document",
      select_all: "Tout sélectionner",
      deselect_all: "Tout désélectionner",
      remove_selected: "Supprimer la sélection",
      save_embed: "Sauvegarder et intégrer",
      "total-documents_one": "{{count}}",
      "total-documents_other": "{{count}} documents",
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
    send_message: "Envoyer un message",
    attach_file: "Joindre un fichier",
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
    fork: "Dupliquer",
    delete: "Supprimer",
    cancel: "Annuler",
    edit_prompt: "Modifier le prompt",
    edit_response: "Modifier la réponse",
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
    submit: "Soumettre",
    edit_info_user:
      '"Soumettre" permet de régénérer la réponse de l\'IA. "Enregistrer" met uniquement à jour votre message.',
    edit_info_assistant:
      "Vos modifications seront enregistrées directement dans cette réponse.",
    see_less: "Voir moins",
    see_more: "Voir plus",
    tools: "Outils",
    text_size_label: "Taille du texte",
    select_model: "Sélectionner le modèle",
    sources: "Sources",
    document: "Document",
    similarity_match: "match",
    source_count_one: "{{count}} référence",
    source_count_other: "Références à {{count}}",
    preset_exit_description: "Arrêter la session actuelle de l'agent",
    add_new: "Ajouter",
    edit: "Modifier",
    publish: "Publier",
    stop_generating: "Arrêtez de générer des réponses",
    slash_commands: "Commandes abrégées",
    agent_skills: "Compétences des agents",
    manage_agent_skills: "Gérer les compétences des agents",
    agent_skills_disabled_in_session:
      "Il n'est pas possible de modifier les compétences pendant une session avec un agent actif. Utilisez la commande `/exit` pour terminer la session en premier.",
    start_agent_session: "Démarrer la session de l'agent",
    use_agent_session_to_use_tools:
      'Vous pouvez utiliser des outils via le chat en lançant une session avec un agent en utilisant le préfixe "@agent" au début de votre requête.',
    agent_invocation: {
      model_wants_to_call: "Le modèle souhaite passer un appel.",
      approve: "Approuver",
      reject: "Refuser",
      always_allow: "Il est toujours important de {{skillName}}",
      tool_call_was_approved: "La demande d'outils a été approuvée.",
      tool_call_was_rejected:
        "La demande d'utilisation de l'outil a été rejetée.",
    },
    custom_skills: "Compétences spécifiques",
    agent_flows: "Flux des agents",
    no_tools_found: "Aucun outil correspondant n'a été trouvé.",
    loading_mcp_servers: "Chargement des serveurs MCP...",
    app_integrations: "Intégrations d'applications",
    sub_skills: "Compétences spécifiques",
  },
  profile_settings: {
    edit_account: "Modifier le compte",
    profile_picture: "Photo de profil",
    remove_profile_picture: "Supprimer la photo de profil",
    username: "Nom d'utilisateur",
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
    quickActions: {
      createAgent: "Créer un agent",
      editWorkspace: "Modifier l'espace de travail",
      uploadDocument: "Télécharger un document",
    },
    greeting: "Comment puis-je vous aider aujourd'hui ?",
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
        prompt_label: "Prompt",
        prompt_description: "Le contenu de votre prompt système.",
        prompt_placeholder: "Vous êtes un assistant IA utile...",
      },
      agent_flow: {
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
  telegram: {
    title: "Bot Telegram",
    description:
      "Connectez votre instance de AnythingLLM à Telegram afin de pouvoir communiquer avec vos espaces de travail depuis n'importe quel appareil.",
    setup: {
      step1: {
        title: "Étape 1 : Créez votre bot Telegram",
        description:
          "Ouvrez @BotFather sur Telegram, envoyez `/newbot` à <code>@BotFather</code>, suivez les instructions, et copiez le jeton API.",
        "open-botfather": "Ouvrir BotFather",
        "instruction-1": "1. Ouvrez le lien ou numérisez le code QR.",
        "instruction-2":
          "2. Envoyer <code>/newbot</code> à <code>@BotFather</code>",
        "instruction-3":
          "3. Choisissez un nom et un nom d'utilisateur pour votre bot.",
        "instruction-4": "4. Copiez le jeton API que vous recevez.",
      },
      step2: {
        title: "Étape 2 : Connectez votre bot",
        description:
          "Collez le jeton API que vous avez reçu de @BotFather et sélectionnez un espace de travail par défaut pour que votre bot puisse communiquer.",
        "bot-token": "Token Bot",
        connecting: "Connexion...",
        "connect-bot": "Bot de connexion",
      },
      security: {
        title: "Paramètres de sécurité recommandés",
        description:
          "Pour une sécurité supplémentaire, configurez ces paramètres via @BotFather.",
        "disable-groups": "— Empêcher l'ajout de bots aux groupes",
        "disable-inline":
          "— Empêcher l'utilisation de bots dans les recherches en ligne.",
        "obscure-username":
          "Utilisez un nom d'utilisateur de bot non évident pour réduire sa visibilité.",
      },
      "toast-enter-token": "Veuillez saisir un jeton de bot.",
      "toast-connect-failed": "Échec de la connexion du bot.",
    },
    connected: {
      status: "Connecté",
      "status-disconnected":
        "Non connecté – le jeton pourrait être expiré ou invalide.",
      "placeholder-token": "Coller le nouveau jeton de bot...",
      reconnect: "Reconnexion",
      workspace: "Espace de travail",
      "bot-link": "Lien vers le bot",
      "voice-response": "Réponse vocale",
      disconnecting: "Déconnexion...",
      disconnect: "Déconnecter",
      "voice-text-only": "Texte uniquement",
      "voice-mirror":
        "Écho (répondre par la voix lorsque l'utilisateur envoie une voix)",
      "voice-always":
        "Toujours inclure une voix (envoyer un enregistrement audio avec chaque réponse)",
      "toast-disconnect-failed": "Échec de la déconnexion du robot.",
      "toast-reconnect-failed": "Échec de la reconnexion du bot.",
      "toast-voice-failed": "Impossible de mettre à jour le mode vocal.",
      "toast-approve-failed": "Échec de la validation de l'utilisateur.",
      "toast-deny-failed": "Impossible de refuser l'accès à l'utilisateur.",
      "toast-revoke-failed": "Impossible de supprimer l'utilisateur.",
    },
    users: {
      "pending-description":
        "Utilisateurs en attente de vérification. Correspondez le code de correspondance affiché ici avec celui qui apparaît dans leur conversation Telegram.",
      unknown: "Inconnu",
    },
  },
  scheduledJobs: {
    title: "Tâches planifiées",
    enableNotifications:
      "Activer les notifications du navigateur pour les résultats de recherche d'emploi.",
    description:
      "Créez des tâches d'IA récurrentes qui s'exécutent selon un calendrier. Chaque tâche exécute une requête avec des outils optionnels et enregistre le résultat pour examen ultérieur.",
    newJob: "Nouvelle offre d'emploi",
    loading: "Chargement...",
    emptyTitle: "Aucune tâche planifiée pour le moment.",
    emptySubtitle: "Créez-en un pour commencer.",
    table: {
      name: "Nom",
      schedule: "Calendrier",
      status: "État",
      lastRun: "Dernière course",
      nextRun: "Prochaine course",
      actions: "Actions",
    },
    confirmDelete:
      "Êtes-vous certain de vouloir supprimer cette tâche planifiée ?",
    toast: {
      deleted: "Emploi supprimé",
      triggered: "La tâche a été exécutée avec succès.",
      triggerFailed: "N'a pas réussi à lancer la tâche",
      triggerSkipped: "Le projet est déjà en cours.",
      killed: "La tâche a été exécutée avec succès.",
      killFailed: "Impossible d'arrêter le travail.",
    },
    row: {
      neverRun: "Ne jamais courir",
      viewRuns: "Afficher les résultats",
      runNow: "Partons maintenant",
      enable: "Activer",
      disable: "Désactiver",
      edit: "Modifier",
      delete: "Supprimer",
    },
    modal: {
      titleEdit: "Modifier la tâche planifiée",
      titleNew: "Nouvelle tâche planifiée",
      nameLabel: "Nom",
      namePlaceholder: 'par exemple, "Résumé quotidien des actualités"',
      promptLabel: "Demande",
      promptPlaceholder: "L'instruction de s'exécuter à chaque exécution...",
      scheduleLabel: "Calendrier",
      modeBuilder: "Constructeur",
      modeCustom: "Personnalisé",
      cronPlaceholder: "Expression de temps (par exemple, 0 9 * * *)",
      currentSchedule: "Planning actuel :",
      toolsLabel: "Outils (facultatifs)",
      toolsDescription:
        "Sélectionnez les outils d'agent que cette tâche peut utiliser. Si aucun outil n'est sélectionné, la tâche s'exécutera sans aucun outil.",
      toolsSearch: "Rechercher",
      toolsNoResults: "Aucun outil ne correspond",
      required: "Nécessaire",
      requiredFieldsBanner:
        "Veuillez remplir tous les champs obligatoires afin de créer l'annonce.",
      cancel: "Annuler",
      saving: "Économiser...",
      updateJob: "Mettre à jour l'emploi",
      createJob: "Créer un emploi",
      jobUpdated: "Poste mis à jour",
      jobCreated: "Emploi créé",
    },
    builder: {
      fallbackWarning:
        'Cette expression ne peut pas être modifiée visuellement. Pour la conserver, passez en mode "Personnalisé". Sinon, modifiez tout ce qui se trouve en dessous pour la remplacer.',
      run: "Courir",
      frequency: {
        minute: "chaque minute",
        hour: "par heure",
        day: "quotidien",
        week: "hebdomadaire",
        month: "mensuel",
      },
      every: "Chaque",
      minuteOne: "1 minute",
      minuteOther: "{{count}} minutes",
      atMinute: "À la minute",
      pastEveryHour: "chaque heure",
      at: "À",
      on: "Sur",
      onDay: "Un jour",
      ofEveryMonth: "chaque mois",
      weekdays: {
        sun: "Soleil",
        mon: "Moi",
        tue: "Mardi",
        wed: "Mercredi",
        thu: "Jeudi",
        fri: "Vendredi",
        sat: "Samedi",
      },
    },
    runHistory: {
      back: "Retour à la liste des offres d'emploi",
      title: "Historique des exécutions : {{name}}",
      schedule: "Calendrier :",
      emptyTitle: "Aucun résultat pour cette tâche.",
      emptySubtitle:
        "Exécutez la tâche immédiatement et consultez les résultats.",
      runNow: "Partir maintenant",
      table: {
        status: "Statut",
        started: "Débuté",
        duration: "Durée",
        error: "Erreur",
      },
      stopJob: "Arrêter le travail",
    },
    runDetail: {
      loading: "Affichage des détails de la course...",
      notFound: "La commande n'a pas été trouvée.",
      back: "Retour",
      unknownJob: "Poste non spécifié",
      runHeading: "{{name}} — Exécution n°{{id}}",
      duration: "Durée : {{value}}",
      creating: "Créer...",
      threadFailed: "Impossible de créer le thread.",
      sections: {
        prompt: "Demande",
        error: "Erreur",
        thinking: "Pensées ({{count}})",
        toolCalls: "Appels aux outils ({{count}})",
        files: "Fichiers ({{count}})",
        response: "Réponse",
        metrics: "Indicateurs",
      },
      metrics: {
        promptTokens: "Mots-clés de requête:",
        completionTokens: "Jetons de complétion :",
      },
      stopJob: "Arrêter le travail",
      killing: "Arrêt...",
      continueInThread: "Continuer la conversation",
    },
    toolCall: {
      arguments: "Arguments:",
      showResult: "Afficher le résultat",
      hideResult: "Masquer le résultat",
    },
    file: {
      unknown: "Fichier inconnu",
      download: "Télécharger",
      downloadFailed: "Échec du téléchargement du fichier",
      types: {
        powerpoint: "PowerPoint",
        pdf: "Document au format PDF",
        word: "Document Word",
        spreadsheet: "Tableur",
        generic: "Fichier",
      },
    },
    status: {
      completed: "Terminé",
      failed: "Échoué",
      timed_out: "Temps écoulé",
      running: "Course à pied",
      queued: "En attente",
    },
  },
};

export default TRANSLATIONS;
