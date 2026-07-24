const TRANSLATIONS = {
  onboarding: {
    home: {
      welcome: "ຍິນດີຕ້ອນຮັບ",
      getStarted: "ເລີ່ມຕົ້ນໃຊ້ງານ",
    },
    llm: {
      title: "ການຕັ້ງຄ່າ LLM",
      description:
        "AnythingLLM ສາມາດເຮັດວຽກຮ່ວມກັບຜູ້ໃຫ້ບໍລິການ LLM ໄດ້ຫຼາຍແຫ່ງ. ນີ້ຈະເປັນບໍລິການທີ່ຈະຈັດການການສົນທະນາ.",
    },
    userSetup: {
      title: "ຕັ້ງຄ່າຜູ້ໃຊ້",
      description: "ຕັ້ງຄ່າຂໍ້ມູນຜູ້ໃຊ້ຂອງທ່ານ.",
      howManyUsers: "ຈະມີຜູ້ໃຊ້ຈັກຄົນໃນລະບົບນີ້?",
      justMe: "ແຕ່ຂ້ອຍຄົນດຽວ",
      myTeam: "ທີມງານຂອງຂ້ອຍ",
      instancePassword: "ລະຫັດຜ່ານລະບົບ",
      setPassword: "ທ່ານຕ້ອງການຕັ້ງລະຫັດຜ່ານບໍ່?",
      passwordReq: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ.",
      passwordWarn:
        "ມັນສຳຄັນຫຼາຍທີ່ຕ້ອງບັນທຶກລະຫັດຜ່ານນີ້ໄວ້ ເພາະບໍ່ມີວິທີການກູ້ຄືນ.",
      adminUsername: "ຊື່ຜູ້ໃຊ້ຜູ້ດູແລ (Admin)",
      adminPassword: "ລະຫັດຜ່ານຜູ້ດູແລ (Admin)",
      adminPasswordReq: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ.",
      teamHint:
        "ໂດຍເລີ່ມຕົ້ນ, ທ່ານຈະເປັນຜູ້ດູແລພຽງຄົນດຽວ. ເມື່ອຕັ້ງຄ່າສຳເລັດແລ້ວ ທ່ານສາມາດສ້າງ ແລະ ເຊີນຄົນອື່ນມາເປັນຜູ້ໃຊ້ ຫຼື ຜູ້ດູແລໄດ້. ຫ້າມເຮັດລະຫັດຜ່ານເສຍ ເພາະມີພຽງຜູ້ດູແລເທົ່ານັ້ນທີ່ສາມາດຕັ້ງລະຫັດຜ່ານໃໝ່ໄດ້.",
    },
    data: {
      title: "ການຈັດການຂໍ້ມູນ ແລະ ຄວາມເປັນສ່ວນຕົວ",
      description:
        "ພວກເຮົາໃຫ້ຄວາມສຳຄັນກັບຄວາມໂປ່ງໃສ ແລະ ການຄວບຄຸມຂໍ້ມູນສ່ວນຕົວຂອງທ່ານ.",
      settingsHint:
        "ການຕັ້ງຄ່າເຫຼົ່ານີ້ສາມາດປ່ຽນແປງໄດ້ທຸກເວລາໃນສ່ວນການຕັ້ງຄ່າ.",
    },
    survey: {
      title: "ຍິນດີຕ້ອນຮັບສູ່ AnythingLLM",
      description:
        "ຊ່ວຍພວກເຮົາປັບປຸງ AnythingLLM ໃຫ້ກົງກັບຄວາມຕ້ອງການຂອງທ່ານ. (ບໍ່ບັງຄັບ)",
      email: "ອີເມວຂອງທ່ານແມ່ນຫຍັງ?",
      useCase: "ທ່ານຈະໃຊ້ AnythingLLM ເພື່ອຫຍັງ?",
      useCaseWork: "ສຳລັບວຽກ",
      useCasePersonal: "ສຳລັບສ່ວນຕົວ",
      useCaseOther: "ອື່ນໆ",
      comment: "ທ່ານຮູ້ຈັກ AnythingLLM ໄດ້ແນວໃດ?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, ແລະ ອື່ນໆ - ບອກໃຫ້ພວກເຮົາຮູ້ວ່າທ່ານຫາພວກເຮົາເຫັນໄດ້ແນວໃດ!",
      skip: "ຂ້າມແບບສຳຫຼວດ",
      thankYou: "ຂອບໃຈສຳລັບຄຳຄິດເຫັນຂອງທ່ານ!",
    },
  },
  common: {
    "workspaces-name": "ຊື່ພື້ນທີ່ເຮັດວຽກ (Workspace)",
    selection: "ການເລືອກແບບຈຳລອງ",
    saving: "ກຳລັງບັນທຶກ...",
    save: "ບັນທຶກການປ່ຽນແປງ",
    previous: "ໜ້າກ່ອນໜ້າ",
    next: "ໜ້າຖັດໄປ",
    optional: "ບໍ່ບັງຄັບ",
    yes: "ແມ່ນ",
    no: "ບໍ່",
    on: "ເປີດ",
    none: "ບໍ່ມີ",
    stopped: "ຢຸດແລ້ວ",
    search: "ຄົ້ນຫາ",
    username_requirements:
      "ຊື່ຜູ້ໃຊ້ຕ້ອງມີ 2-64 ຕົວອັກສອນ, ເລີ່ມຕົ້ນດ້ວຍຕົວພິມນ້ອຍ, ແລະ ປະກອບມີຕົວພິມນ້ອຍ, ຕົວເລກ, ຂີດກ້ອງ (_), ຂີດຕໍ່ (-) ແລະ ຈ້ຳ (.) ເທົ່ານັ້ນ.",
    loading: "ກຳລັງໂຫຼດ",
    refresh: "ໂຫຼດໃໝ່",
  },
  home: {
    welcome: "ຍິນດີຕ້ອນຮັບ",
    chooseWorkspace: "ເລືອກພື້ນທີ່ເຮັດວຽກເພື່ອເລີ່ມການສົນທະນາ!",
    notAssigned:
      "ຕອນນີ້ທ່ານຍັງບໍ່ໄດ້ຖືກກຳນົດໃຫ້ເຂົ້າຫາພື້ນທີ່ເຮັດວຽກໃດໆ.\nກະລຸນາຕິດຕໍ່ຜູ້ດູແລລະບົບຂອງທ່ານເພື່ອຂໍສິດເຂົ້າໃຊ້ງານ.",
    goToWorkspace: 'ໄປທີ່ "{{workspace}}"',
  },
  settings: {
    title: "ການຕັ້ງຄ່າລະບົບ",
    invites: "ການເຊື້ອເຊີນ",
    users: "ຜູ້ໃຊ້",
    workspaces: "ພື້ນທີ່ເຮັດວຽກ",
    "workspace-chats": "ປະຫວັດການສົນທະນາ",
    customization: "ການປັບແຕ່ງ",
    interface: "ການຕັ້ງຄ່າ UI",
    branding: "ແບຣນດິງ & Whitelabeling",
    chat: "ການສົນທະນາ",
    "api-keys": "API ສຳລັບນັກພັດທະນາ",
    llm: "LLM",
    transcription: "ການຖອດຂໍ້ຄວາມ",
    embedder: "Embedder",
    "text-splitting": "ການແຍກຂໍ້ຄວາມ & Chunking",
    "voice-speech": "ສຽງ & ການເວົ້າ",
    "vector-database": "ຖານຂໍ້ມູນເວກເຕີ",
    embeds: "ການຝັງແຊັດ (Chat Embed)",
    security: "ຄວາມປອດໄພ",
    "event-logs": "ບັນທຶກເຫດການ (Event Logs)",
    "scheduled-jobs": "ວຽກທີ່ຕັ້ງເວລາໄວ້",
    privacy: "ຄວາມເປັນສ່ວນຕົວ & ຂໍ້ມູນ",
    "ai-providers": "ຜູ້ໃຫ້ບໍລິການ AI",
    "agent-skills": "ທັກສະເອເຈນ",
    "model-router": "ຕົວກຳນົດເສັ້ນທາງແບບຈຳລອງ (Model Router)",
    "community-hub": {
      title: "Community Hub",
      trending: "ສຳຫຼວດສິ່ງທີ່ກຳລັງມາແຮງ",
      "your-account": "ບັນຊີຂອງທ່ານ",
      "import-item": "ນຳເຂົ້າລາຍການ",
    },
    admin: "ຜູ້ດູແລ",
    tools: "ເຄື່ອງມື",
    "system-prompt-variables": "ຕົວປ່ຽນ System Prompt",
    "experimental-features": "ຟີເຈີທົດລອງ",
    contact: "ຕິດຕໍ່ຝ່າຍຊ່ວຍເຫຼືອ",
    "browser-extension": "ສ່ວນເສີມບຣາວເຊີ",
    "mobile-app": "AnythingLLM ມືຖື",
    channels: "ຊ່ອງທາງການຕິດຕໍ່",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "ຍິນດີຕ້ອນຮັບ",
      "placeholder-username": "ຊື່ຜູ້ໃຊ້",
      "placeholder-password": "ລະຫັດຜ່ານ",
      login: "ເຂົ້າສູ່ລະບົບ",
      validating: "ກຳລັງກວດສອບ...",
      "forgot-pass": "ລືມລະຫັດຜ່ານ",
      reset: "ຕັ້ງໃໝ່",
    },
    "sign-in":
      "ປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານຂອງທ່ານເພື່ອເຂົ້າໃຊ້ງານ {{appName}}.",
    "password-reset": {
      title: "ຕັ້ງລະຫັດຜ່ານໃໝ່",
      description: "ກະລຸນາໃຫ້ຂໍ້ມູນທີ່ຈຳເປັນລຸ່ມນີ້ເພື່ອຕັ້ງລະຫັດຜ່ານໃໝ່.",
      "recovery-codes": "ລະຫັດກູ້ຄືນ",
      "back-to-login": "ກັບໄປໜ້າເຂົ້າສູ່ລະບົບ",
    },
  },
  "main-page": {
    greeting: "ມື້ນີ້ມີຫຍັງໃຫ້ຂ້ອຍຊ່ວຍບໍ່?",
    quickActions: {
      createAgent: "ສ້າງເອເຈນ",
      editWorkspace: "ແກ້ໄຂພື້ນທີ່ເຮັດວຽກ",
      uploadDocument: "ອັບໂຫຼດເອກະສານ",
    },
  },
  "new-workspace": {
    title: "ສ້າງພື້ນທີ່ເຮັດວຽກໃໝ່",
    placeholder: "ພື້ນທີ່ເຮັດວຽກຂອງຂ້ອຍ",
  },
  "workspaces—settings": {
    general: "ການຕັ້ງຄ່າທົ່ວໄປ",
    chat: "ການຕັ້ງຄ່າການສົນທະນາ",
    vector: "ຖານຂໍ້ມູນເວກເຕີ",
    members: "ສະມາຊິກ",
    agent: "ການຕັ້ງຄ່າເອເຈນ",
  },
  general: {
    vector: {
      title: "ຈຳນວນເວກເຕີ",
      description: "ຈຳນວນເວກເຕີທັງໝົດໃນຖານຂໍ້ມູນຂອງທ່ານ.",
    },
    names: {
      description: "ສິ່ງນີ້ຈະປ່ຽນແປງສະເພາະຊື່ທີ່ສະແດງຂອງພື້ນທີ່ເຮັດວຽກຂອງທ່ານ.",
    },
    message: {
      title: "ຂໍ້ຄວາມແນະນຳໃນການສົນທະນາ",
      description:
        "ປັບແຕ່ງຂໍ້ຄວາມທີ່ຈະຖືກແນະນຳໃຫ້ກັບຜູ້ໃຊ້ໃນພື້ນທີ່ເຮັດວຽກຂອງທ່ານ.",
      add: "ເພີ່ມຂໍ້ຄວາມໃໝ່",
      save: "ບັນທຶກຂໍ້ຄວາມ",
      heading: "ອະທິບາຍໃຫ້ຂ້ອຍແນ່",
      body: "ຂໍ້ດີຂອງ AnythingLLM ແມ່ນຫຍັງ",
    },
    delete: {
      title: "ລຶບພື້ນທີ່ເຮັດວຽກ",
      description:
        "ລຶບພື້ນທີ່ເຮັດວຽກນີ້ ແລະ ຂໍ້ມູນທັງໝົດ. ສິ່ງນີ້ຈະລຶບພື້ນທີ່ເຮັດວຽກສຳລັບຜູ້ໃຊ້ທຸກຄົນ.",
      delete: "ລຶບພື້ນທີ່ເຮັດວຽກ",
      deleting: "ກຳລັງລຶບ...",
      "confirm-start": "ທ່ານກຳລັງຈະລຶບພື້ນທີ່ເຮັດວຽກ",
      "confirm-end":
        "ທັງໝົດ. ສິ່ງນີ້ຈະເອົາເວກເຕີທັງໝົດອອກຈາກຖານຂໍ້ມູນ.\n\nໄຟລ໌ຕົ້ນສະບັບຈະບໍ່ໄດ້ຮັບຜົນກະທົບ. ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.",
    },
  },
  chat: {
    llm: {
      title: "ຜູ້ໃຫ້ບໍລິການ LLM ຂອງພື້ນທີ່ເຮັດວຽກ",
      description:
        "ຜູ້ໃຫ້ບໍລິການ LLM ແລະ ແບບຈຳລອງສະເພາະທີ່ຈະໃຊ້ສຳລັບພື້ນທີ່ເຮັດວຽກນີ້. ໂດຍເລີ່ມຕົ້ນ, ມັນຈະໃຊ້ການຕັ້ງຄ່າລະບົບ.",
      search: "ຄົ້ນຫາຜູ້ໃຫ້ບໍລິການ LLM ທັງໝົດ",
    },
    model: {
      title: "ແບບຈຳລອງການສົນທະນາຂອງພື້ນທີ່ເຮັດວຽກ",
      description:
        "ແບບຈຳລອງການສົນທະນາສະເພາະທີ່ຈະໃຊ້ໃນພື້ນທີ່ນີ້. ຖ້າປະວ່າງໄວ້, ຈະໃຊ້ຄ່າເລີ່ມຕົ້ນຂອງລະບົບ.",
    },
    mode: {
      title: "ໂໝດການສົນທະນາ",
      automatic: {
        title: "ເອເຈນ (Agent)",
        description:
          "ຈະໃຊ້ເຄື່ອງມືໂດຍອັດຕະໂນມັດຖ້າແບບຈຳລອງ ແລະ ຜູ້ໃຫ້ບໍລິການຮອງຮັບ.<br />ຖ້າບໍ່ຮອງຮັບ, ທ່ານຕ້ອງໃຊ້ຄຳສັ່ງ @agent ເພື່ອໃຊ້ເຄື່ອງມື.",
      },
      chat: {
        title: "ສົນທະນາ (Chat)",
        description:
          "ຈະໃຫ້ຄຳຕອບໂດຍໃຊ້ຄວາມຮູ້ທົ່ວໄປຂອງ LLM <b>ແລະ</b> ຂໍ້ມູນຈາກເອກະສານທີ່ພົບ.<br />ທ່ານຕ້ອງໃຊ້ຄຳສັ່ງ @agent ເພື່ອໃຊ້ເຄື່ອງມື.",
      },
      query: {
        title: "ສອບຖາມ (Query)",
        description:
          "ຈະໃຫ້ຄຳຕອບ <b>ສະເພາະ</b> ເມື່ອພົບຂໍ້ມູນໃນເອກະສານເທົ່ານັ້ນ.<br />ທ່ານຕ້ອງໃຊ້ຄຳສັ່ງ @agent ເພື່ອໃຊ້ເຄື່ອງມື.",
      },
    },
    history: {
      title: "ປະຫວັດການສົນທະນາ",
      "desc-start":
        "ຈຳນວນການສົນທະນາກ່ອນໜ້າທີ່ຈະຖືກລວມເຂົ້າໃນຄວາມຈຳໄລຍະສັ້ນສຳລັບການຕອບໂຕ້.",
      recommend: "ແນະນຳແມ່ນ 20.",
    },
    prompt: {
      title: "System Prompt",
      description:
        "ຄຳສັ່ງຫຼັກທີ່ຈະໃຊ້ໃນພື້ນທີ່ເຮັດວຽກນີ້. ກຳນົດບໍລິບົດ ແລະ ຄຳແນະນຳໃຫ້ AI ສ້າງຄຳຕອບ. ທ່ານຄວນຂຽນຄຳສັ່ງຢ່າງລະອຽດເພື່ອໃຫ້ AI ສ້າງຄຳຕອບທີ່ກົງປະເດັນ ແລະ ຖືກຕ້ອງ.",
      history: {
        title: "ປະຫວັດ System Prompt",
        clearAll: "ລຶບທັງໝົດ",
        noHistory: "ບໍ່ມີປະຫວັດ System Prompt",
        restore: "ກູ້ຄືນ",
        delete: "ລຶບ",
        publish: "ເຜີຍແຜ່ໄປທີ່ Community Hub",
        deleteConfirm: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບລາຍການປະຫວັດນີ້?",
        clearAllConfirm:
          "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບປະຫວັດທັງໝົດ? ສິ່ງນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.",
        expand: "ຂະຫຍາຍ",
      },
    },
    refusal: {
      title: "ຄຳຕອບເມື່ອປະຕິເສດໃນໂໝດ Query",
      "desc-start": "ເມື່ອຢູ່ໃນໂໝດ",
      query: "ສອບຖາມ (query)",
      "desc-end": "ທ່ານອາດຈະຕ້ອງການໃຫ້ມີຄຳຕອບສະເພາະເມື່ອບໍ່ພົບຂໍ້ມູນໃນເອກະສານ.",
      "tooltip-title": "ເປັນຫຍັງຂ້ອຍຈຶ່ງເຫັນສິ່ງນີ້?",
      "tooltip-description":
        "ທ່ານຢູ່ໃນໂໝດ Query ເຊິ່ງໃຊ້ຂໍ້ມູນຈາກເອກະສານຂອງທ່ານເທົ່ານັ້ນ. ປ່ຽນເປັນໂໝດ Chat ເພື່ອການສົນທະນາທີ່ຍືດຫຍຸ່ນກວ່າ.",
    },
    temperature: {
      title: "LLM Temperature",
      "desc-end":
        "ຄ່າຍິ່ງສູງ ຄວາມຄິດສ້າງສັນຍິ່ງຫຼາຍ. ສຳລັບບາງແບບຈຳລອງ ຖ້າຕັ້ງສູງເກີນໄປອາດເຮັດໃຫ້ຄຳຕອບບໍ່ຕໍ່ເນື່ອງ.",
    },
  },
  "vector-workspace": {
    identifier: "ຕົວລະບຸຖານຂໍ້ມູນເວກເຕີ",
    snippets: {
      title: "ຈຳນວນຂໍ້ຄວາມບໍລິບົດສູງສຸດ",
      description:
        "ການຕັ້ງຄ່ານີ້ຄວບຄຸມຈຳນວນຂໍ້ຄວາມບໍລິບົດສູງສຸດທີ່ຈະສົ່ງໄປໃຫ້ LLM ໃນແຕ່ລະການສົນທະນາ.",
      recommend: "ແນະນຳ: 4",
    },
    doc: {
      title: "ເກນຄວາມຄືກັນຂອງເອກະສານ",
      description:
        "ຄະແນນຄວາມຄືກັນຂັ້ນຕ່ຳທີ່ຕ້ອງການເພື່ອໃຫ້ແຫຼ່ງຂໍ້ມູນຖືກພິຈາລະນາວ່າກ່ຽວຂ້ອງ. ຄ່າຍິ່ງສູງ ແຫຼ່ງຂໍ້ມູນຍິ່ງຕ້ອງຄືກັບຄຳຖາມຫຼາຍຂຶ້ນ.",
      zero: "ບໍ່ຈຳກັດ",
      low: "ຕ່ຳ (ຄວາມຄືກັນ ≥ .25)",
      medium: "ກາງ (ຄວາມຄືກັນ ≥ .50)",
      high: "ສູງ (ຄວາມຄືກັນ ≥ .75)",
    },
    reset: {
      reset: "ລ້າງຖານຂໍ້ມູນເວກເຕີ",
      resetting: "ກຳລັງລ້າງເວກເຕີ...",
      confirm:
        "ທ່ານກຳລັງຈະລ້າງຖານຂໍ້ມູນເວກເຕີຂອງພື້ນທີ່ນີ້. ສິ່ງນີ້ຈະເອົາເວກເຕີທັງໝົດອອກ.\n\nໄຟລ໌ຕົ້ນສະບັບຈະບໍ່ໄດ້ຮັບຜົນກະທົບ. ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.",
      error: "ບໍ່ສາມາດລ້າງຖານຂໍ້ມູນເວກເຕີໄດ້!",
      success: "ລ້າງຖານຂໍ້ມູນເວກເຕີສຳເລັດແລ້ວ!",
    },
  },
  agent: {
    "performance-warning":
      "ປະສິດທິພາບຂອງ LLM ທີ່ບໍ່ຮອງຮັບ tool-calling ໂດຍກົງ ແມ່ນຂຶ້ນກັບຄວາມສາມາດຂອງແບບຈຳລອງ. ບາງຄວາມສາມາດອາດຈະຖືກຈຳກັດ.",
    provider: {
      title: "ຜູ້ໃຫ້ບໍລິການ LLM ສຳລັບເອເຈນ",
      description:
        "ຜູ້ໃຫ້ບໍລິການ ແລະ ແບບຈຳລອງສະເພາະທີ່ຈະໃຊ້ສຳລັບ @agent ໃນພື້ນທີ່ເຮັດວຽກນີ້.",
    },
    mode: {
      chat: {
        title: "ແບບຈຳລອງການສົນທະນາຂອງເອເຈນ",
        description: "ແບບຈຳລອງສະເພາະທີ່ຈະໃຊ້ສຳລັບ @agent ໃນພື້ນທີ່ນີ້.",
      },
      title: "ແບບຈຳລອງຂອງເອເຈນ",
      description: "ແບບຈຳລອງ LLM ສະເພາະທີ່ຈະໃຊ້ສຳລັບ @agent.",
      wait: "-- ກຳລັງລໍຖ້າແບບຈຳລອງ --",
    },
    skill: {
      rag: {
        title: "RAG & ຄວາມຈຳໄລຍະຍາວ",
        description:
          'ໃຫ້ເອເຈນໃຊ້ເອກະສານໃນເຄື່ອງເພື່ອຕອບຄຳຖາມ ຫຼື ບອກໃຫ້ເອເຈນ "ຈົດຈຳ" ເນື້ອຫາໄວ້.',
      },
      view: {
        title: "ເບິ່ງ & ສະຫຼຸບເອກະສານ",
        description: "ໃຫ້ເອເຈນລາຍຊື່ ແລະ ສະຫຼຸບເນື້ອຫາຂອງໄຟລ໌ໃນພື້ນທີ່ເຮັດວຽກ.",
      },
      scrape: {
        title: "ດຶງຂໍ້ມູນເວັບໄຊ",
        description: "ໃຫ້ເອເຈນເຂົ້າເບິ່ງ ແລະ ດຶງເນື້ອຫາຈາກເວັບໄຊ.",
      },
      generate: {
        title: "ສ້າງແຜນພູມ",
        description: "ເປີດໃຫ້ເອເຈນສ້າງແຜນພູມປະເພດຕ່າງໆຈາກຂໍ້ມູນທີ່ມີ.",
      },
      web: {
        title: "ຄົ້ນຫາເວັບ",
        description: "ໃຫ້ເອເຈນຄົ້ນຫາຂໍ້ມູນຈາກອິນເຕີເນັດເພື່ອຕອບຄຳຖາມ.",
      },
      sql: {
        title: "ຕົວເຊື່ອມຕໍ່ SQL",
        description:
          "ໃຫ້ເອເຈນສາມາດໃຊ້ SQL ເພື່ອຕອບຄຳຖາມໂດຍການເຊື່ອມຕໍ່ກັບຖານຂໍ້ມູນ SQL ຕ່າງໆ.",
      },
      scheduledJob: {
        title: "ສ້າງວຽກທີ່ຕັ້ງເວລາ",
        description:
          'ໃຫ້ເອເຈນສ້າງວຽກທີ່ເຮັດຊ້ຳໄດ້ຈາກການແຊັດ (ເຊັ່ນ: "ທຸກໆມື້ເຮັດວຽກຕອນ 9 ໂມງເຊົ້າ ໃຫ້ສະຫຼຸບອີເມວແລ້ວສົ່ງໃຫ້ຂ້ອຍ"). ໃຊ້ໄດ້ສະເພາະໂໝດຜູ້ໃຊ້ດຽວ.',
      },
      filesystem: {
        title: "ການເຂົ້າເຖິງລະບົບໄຟລ໌",
        description:
          "ໃຫ້ເອເຈນ ອ່ານ, ຂຽນ, ຄົ້ນຫາ ແລະ ຈັດການໄຟລ໌ໃນໂຟນເດີທີ່ກຳນົດ.",
        learnMore: "ຮຽນຮູ້ເພີ່ມເຕີມກ່ຽວກັບການໃຊ້ທັກສະນີ້",
        configuration: "ການຕັ້ງຄ່າ",
        readActions: "ການອ່ານ",
        writeActions: "ການຂຽນ",
        warning:
          "ການເຂົ້າເຖິງລະບົບໄຟລ໌ອາດເປັນອັນຕະລາຍ ເພາະມັນສາມາດແກ້ໄຂ ຫຼື ລຶບໄຟລ໌ໄດ້. ກະລຸນາອ່ານ <a>ຄູ່ມື</a> ກ່ອນເປີດໃຊ້ງານ.",
        skills: {
          "read-text-file": {
            title: "ອ່ານໄຟລ໌",
            description:
              "ອ່ານເນື້ອຫາໃນໄຟລ໌ (ຂໍ້ຄວາມ, ໂຄ້ດ, PDF, ຮູບພາບ, ແລະ ອື່ນໆ)",
          },
          "read-multiple-files": {
            title: "ອ່ານຫຼາຍໄຟລ໌",
            description: "ອ່ານຫຼາຍໄຟລ໌ພ້ອມກັນ",
          },
          "list-directory": {
            title: "ລາຍຊື່ໄຟລ໌ໃນໂຟນເດີ",
            description: "ເບິ່ງລາຍຊື່ໄຟລ໌ ແລະ ໂຟນເດີ",
          },
          "search-files": {
            title: "ຄົ້ນຫາໄຟລ໌",
            description: "ຄົ້ນຫາໄຟລ໌ດ້ວຍຊື່ ຫຼື ເນື້ອຫາ",
          },
          "get-file-info": {
            title: "ຂໍ້ມູນໄຟລ໌",
            description: "ເບິ່ງຂໍ້ມູນ Metadata ຂອງໄຟລ໌",
          },
          "write-text-file": {
            title: "ຂຽນໄຟລ໌ຂໍ້ຄວາມ",
            description: "ສ້າງໄຟລ໌ຂໍ້ຄວາມໃໝ່ ຫຼື ຂຽນທັບໄຟລ໌ທີ່ມີຢູ່",
          },
          "edit-file": {
            title: "ແກ້ໄຂໄຟລ໌",
            description: "ແກ້ໄຂຂໍ້ຄວາມເປັນແຖວ",
          },
          "create-directory": {
            title: "ສ້າງໂຟນເດີ",
            description: "ສ້າງໂຟນເດີໃໝ່",
          },
          "copy-file": {
            title: "ກັອບປີ້ໄຟລ໌",
            description: "ກັອບປີ້ໄຟລ໌ ແລະ ໂຟນເດີ",
          },
          "move-file": {
            title: "ຍ້າຍ/ປ່ຽນຊື່ໄຟລ໌",
            description: "ຍ້າຍ ຫຼື ປ່ຽນຊື່ໄຟລ໌ ແລະ ໂຟນເດີ",
          },
        },
      },
      createFiles: {
        title: "ການສ້າງເອກະສານ",
        description:
          "ໃຫ້ເອເຈນສ້າງເອກະສານເຊັ່ນ PowerPoint, Excel, Word ແລະ PDF ໄດ້.",
        configuration: "ປະເພດເອກະສານທີ່ມີ",
        skills: {
          "create-text-file": {
            title: "ໄຟລ໌ຂໍ້ຄວາມ",
            description: "ສ້າງໄຟລ໌ຂໍ້ຄວາມ (.txt, .md, .json, .csv, ແລະ ອື່ນໆ)",
          },
          "create-pptx": {
            title: "PowerPoint",
            description: "ສ້າງພຣີເຊັນເທຊັນ PowerPoint ໃໝ່",
          },
          "create-pdf": {
            title: "PDF",
            description: "ສ້າງເອກະສານ PDF ຈາກ markdown ຫຼື ຂໍ້ຄວາມທົ່ວໄປ",
          },
          "create-xlsx": {
            title: "Excel",
            description: "ສ້າງເອກະສານ Excel ສຳລັບຂໍ້ມູນຕາຕະລາງ",
          },
          "create-docx": {
            title: "Word",
            description: "ສ້າງເອກະສານ Word ພ້ອມການຈັດຮູບແບບ",
          },
        },
      },
      gmail: {
        title: "GMail",
        description:
          "ໃຫ້ເອເຈນເຮັດວຽກກັບ Gmail - ຄົ້ນຫາອີເມວ, ອ່ານຂໍ້ຄວາມ, ຂຽນສະບັບຮ່າງ ແລະ ສົ່ງອີເມວ. <a>ອ່ານຄູ່ມື</a>.",
        multiUserWarning:
          "ການເຊື່ອມຕໍ່ Gmail ບໍ່ສາມາດໃຊ້ໄດ້ໃນໂໝດຫຼາຍຜູ້ໃຊ້ເພື່ອຄວາມປອດໄພ.",
        configuration: "ການຕັ້ງຄ່າ Gmail",
        deploymentId: "Deployment ID",
        deploymentIdHelp:
          "Deployment ID ຈາກ Google Apps Script web app ຂອງທ່ານ",
        apiKey: "API Key",
        apiKeyHelp: "API key ທີ່ທ່ານຕັ້ງຄ່າໄວ້ໃນ Google Apps Script",
        configurationRequired:
          "ກະລຸນາຕັ້ງຄ່າ Deployment ID ແລະ API Key ເພື່ອເປີດໃຊ້ງານ Gmail.",
        configured: "ຕັ້ງຄ່າແລ້ວ",
        searchSkills: "ຄົ້ນຫາທັກສະ...",
        noSkillsFound: "ບໍ່ພົບທັກສະທີ່ຄົ້ນຫາ.",
        categories: {
          search: {
            title: "ຄົ້ນຫາ & ອ່ານອີເມວ",
            description: "ຄົ້ນຫາ ແລະ ອ່ານອີເມວຈາກ Gmail",
          },
          drafts: {
            title: "ອີເມວສະບັບຮ່າງ",
            description: "ສ້າງ, ແກ້ໄຂ ແລະ ຈັດການອີເມວສະບັບຮ່າງ",
          },
          send: {
            title: "ສົ່ງ & ຕອບກັບອີເມວ",
            description: "ສົ່ງອີເມວ ແລະ ຕອບກັບທັນທີ",
          },
          threads: {
            title: "ຈັດການຂໍ້ຄວາມ",
            description: "ຈັດການ - ໝາຍວ່າອ່ານແລ້ວ, ເກັບເຂົ້າຄັງ, ລຶບ",
          },
          account: {
            title: "ສະຖິຕິການເຊື່ອມຕໍ່",
            description: "ເບິ່ງສະຖິຕິຂອງກ່ອງຈົດໝາຍ ແລະ ຂໍ້ມູນບັນຊີ",
          },
        },
        skills: {
          getInbox: {
            title: "ເບິ່ງກ່ອງຈົດໝາຍ",
            description: "ວິທີທີ່ງ່າຍໃນການເບິ່ງອີເມວໃນກ່ອງຈົດໝາຍ",
          },
          search: {
            title: "ຄົ້ນຫາອີເມວ",
            description: "ຄົ້ນຫາອີເມວໂດຍໃຊ້ Gmail query syntax",
          },
          readThread: {
            title: "ອ່ານຂໍ້ຄວາມທັງໝົດ",
            description: "ອ່ານຂໍ້ຄວາມທັງໝົດໃນ Thread ດ້ວຍ ID",
          },
          createDraft: {
            title: "ສ້າງສະບັບຮ່າງ",
            description: "ສ້າງອີເມວສະບັບຮ່າງໃໝ່",
          },
          createDraftReply: {
            title: "ສ້າງສະບັບຮ່າງຕອບກັບ",
            description: "ສ້າງສະບັບຮ່າງເພື່ອຕອບກັບ",
          },
          updateDraft: {
            title: "ອັບເດດສະບັບຮ່າງ",
            description: "ແກ້ໄຂອີເມວສະບັບຮ່າງທີ່ມີຢູ່",
          },
          getDraft: {
            title: "ເບິ່ງສະບັບຮ່າງ",
            description: "ດຶງຂໍ້ມູນສະບັບຮ່າງດ້ວຍ ID",
          },
          listDrafts: {
            title: "ລາຍຊື່ສະບັບຮ່າງ",
            description: "ເບິ່ງລາຍຊື່ສະບັບຮ່າງທັງໝົດ",
          },
          deleteDraft: {
            title: "ລຶບສະບັບຮ່າງ",
            description: "ລຶບອີເມວສະບັບຮ່າງ",
          },
          sendDraft: {
            title: "ສົ່ງສະບັບຮ່າງ",
            description: "ສົ່ງອີເມວສະບັບຮ່າງທີ່ມີຢູ່",
          },
          sendEmail: {
            title: "ສົ່ງອີເມວ",
            description: "ສົ່ງອີເມວທັນທີ",
          },
          replyToThread: {
            title: "ຕອບກັບ",
            description: "ຕອບກັບອີເມວທັນທີ",
          },
          markRead: {
            title: "ໝາຍວ່າອ່ານແລ້ວ",
            description: "ໝາຍວ່າອ່ານແລ້ວ",
          },
          markUnread: {
            title: "ໝາຍວ່າຍັງບໍ່ໄດ້ອ່ານ",
            description: "ໝາຍວ່າຍັງບໍ່ໄດ້ອ່ານ",
          },
          moveToTrash: {
            title: "ຍ້າຍໄປຖັງຂີ້ເຫຍື້ອ",
            description: "ຍ້າຍໄປຖັງຂີ້ເຫຍື້ອ",
          },
          moveToArchive: {
            title: "ເກັບເຂົ້າຄັງ",
            description: "ເກັບເຂົ້າຄັງ",
          },
          moveToInbox: {
            title: "ຍ້າຍໄປກ່ອງຈົດໝາຍ",
            description: "ຍ້າຍໄປກ່ອງຈົດໝາຍ",
          },
          getMailboxStats: {
            title: "ສະຖິຕິຈົດໝາຍ",
            description: "ເບິ່ງຈຳນວນຈົດໝາຍທີ່ຍັງບໍ່ໄດ້ອ່ານ",
          },
        },
      },
      googleCalendar: {
        title: "Google Calendar",
        description:
          "ໃຫ້ເອເຈນເຮັດວຽກກັບ Google Calendar - ເບິ່ງປະຕິທິນ, ເຫດການ, ສ້າງ ແລະ ອັບເດດເຫດການ. <a>ອ່ານຄູ່ມື</a>.",
        multiUserWarning:
          "ການເຊື່ອມຕໍ່ Google Calendar ບໍ່ສາມາດໃຊ້ໄດ້ໃນໂໝດຫຼາຍຜູ້ໃຊ້.",
        configuration: "ການຕັ້ງຄ່າ Google Calendar",
        deploymentId: "Deployment ID",
        deploymentIdHelp: "Deployment ID ຈາກ Google Apps Script ຂອງທ່ານ",
        apiKey: "API Key",
        apiKeyHelp: "API key ທີ່ຕັ້ງຄ່າໄວ້",
        configurationRequired:
          "ກະລຸນາຕັ້ງຄ່າ Deployment ID ແລະ API Key ເພື່ອໃຊ້ງານ.",
        configured: "ຕັ້ງຄ່າແລ້ວ",
        searchSkills: "ຄົ້ນຫາທັກສະ...",
        noSkillsFound: "ບໍ່ພົບທັກສະ.",
        categories: {
          calendars: {
            title: "ປະຕິທິນ",
            description: "ເບິ່ງ ແລະ ຈັດການປະຕິທິນຂອງທ່ານ",
          },
          readEvents: {
            title: "ອ່ານເຫດການ",
            description: "ເບິ່ງ ແລະ ຄົ້ນຫາເຫດການໃນປະຕິທິນ",
          },
          writeEvents: {
            title: "ສ້າງ & ອັບເດດເຫດການ",
            description: "ສ້າງເຫດການໃໝ່ ແລະ ແກ້ໄຂເຫດການທີ່ມີຢູ່",
          },
          rsvp: {
            title: "ຈັດການການຕອບຮັບ (RSVP)",
            description: "ຈັດການສະຖານະການຕອບຮັບຂອງທ່ານ",
          },
        },
        skills: {
          listCalendars: {
            title: "ລາຍຊື່ປະຕິທິນ",
            description: "ເບິ່ງປະຕິທິນທັງໝົດຂອງທ່ານ",
          },
          getCalendar: {
            title: "ລາຍລະອຽດປະຕິທິນ",
            description: "ເບິ່ງຂໍ້ມູນລະອຽດຂອງປະຕິທິນ",
          },
          getEvent: {
            title: "ລາຍລະອຽດເຫດການ",
            description: "ເບິ່ງຂໍ້ມູນລະອຽດຂອງເຫດການ",
          },
          getEventsForDay: {
            title: "ເຫດການໃນມື້ນີ້",
            description: "ເບິ່ງເຫດການທັງໝົດໃນມື້ທີ່ກຳນົດ",
          },
          getEvents: {
            title: "ເຫດການ (ຕາມຊ່ວງເວລາ)",
            description: "ເບິ່ງເຫດການໃນຊ່ວງວັນທີທີ່ກຳນົດ",
          },
          getUpcomingEvents: {
            title: "ເຫດການທີ່ກຳລັງຈະມາ",
            description: "ເບິ່ງເຫດການໃນມື້ນີ້, ອາທິດນີ້ ຫຼື ເດືອນນີ້",
          },
          quickAdd: {
            title: "ເພີ່ມເຫດການດ່ວນ",
            description:
              "ສ້າງເຫດການຈາກພາສາທຳມະຊາດ (ເຊັ່ນ: 'ປະຊຸມມື້ອື່ນຕອນ 3 ໂມງແລງ')",
          },
          createEvent: {
            title: "ສ້າງເຫດການ",
            description: "ສ້າງເຫດການໃໝ່ພ້ອມການຕັ້ງຄ່າທັງໝົດ",
          },
          updateEvent: {
            title: "ອັບເດດເຫດການ",
            description: "ແກ້ໄຂເຫດການທີ່ມີຢູ່",
          },
          setMyStatus: {
            title: "ຕັ້ງສະຖານະ RSVP",
            description: "ຕອບຮັບ, ປະຕິເສດ ຫຼື ຍັງບໍ່ແນ່ໃຈ",
          },
        },
      },
      outlook: {
        title: "Outlook",
        description:
          "ໃຫ້ເອເຈນເຮັດວຽກກັບ Microsoft Outlook - ຄົ້ນຫາອີເມວ, ອ່ານຂໍ້ຄວາມ, ສົ່ງອີເມວ ຜ່ານ Microsoft Graph API. <a>ອ່ານຄູ່ມື</a>.",
        multiUserWarning: "ການເຊື່ອມຕໍ່ Outlook ບໍ່ສາມາດໃຊ້ໄດ້ໃນໂໝດຫຼາຍຜູ້ໃຊ້.",
        configuration: "ການຕັ້ງຄ່າ Outlook",
        authType: "ປະເພດບັນຊີ",
        authTypeHelp: "ເລືອກປະເພດບັນຊີ Microsoft ທີ່ຈະໃຊ້.",
        authTypeCommon: "ທຸກບັນຊີ (ສ່ວນຕົວ & ວຽກ/ໂຮງຮຽນ)",
        authTypeConsumers: "ບັນຊີສ່ວນຕົວເທົ່ານັ້ນ",
        authTypeOrganization: "ບັນຊີອົງກອນເທົ່ານັ້ນ",
        clientId: "Application (Client) ID",
        clientIdHelp: "Client ID ຈາກ Azure AD ຂອງທ່ານ",
        tenantId: "Directory (Tenant) ID",
        tenantIdHelp: "Tenant ID ຈາກ Azure AD (ສຳລັບອົງກອນ)",
        clientSecret: "Client Secret",
        clientSecretHelp: "Client Secret ຈາກ Azure AD",
        configurationRequired: "ກະລຸນາຕັ້ງຄ່າ Client ID ແລະ Client Secret.",
        authRequired: "ບັນທຶກຂໍ້ມູນກ່ອນ, ຈາກນັ້ນຢືນຢັນຕົວຕົນກັບ Microsoft.",
        authenticateWithMicrosoft: "ຢືນຢັນຕົວຕົນກັບ Microsoft",
        authenticated: "ຢືນຢັນຕົວຕົນກັບ Microsoft Outlook ສຳເລັດແລ້ວ.",
        revokeAccess: "ຍົກເລີກການເຂົ້າເຖິງ",
        configured: "ຕັ້ງຄ່າແລ້ວ",
        searchSkills: "ຄົ້ນຫາທັກສະ...",
        noSkillsFound: "ບໍ່ພົບທັກສະ.",
        categories: {
          search: {
            title: "ຄົ້ນຫາ & ອ່ານອີເມວ",
            description: "ຄົ້ນຫາ ແລະ ອ່ານອີເມວຈາກ Outlook",
          },
          drafts: {
            title: "ອີເມວສະບັບຮ່າງ",
            description: "ຈັດການອີເມວສະບັບຮ່າງ",
          },
          send: {
            title: "ສົ່ງອີເມວ",
            description: "ສົ່ງອີເມວໃໝ່ ຫຼື ຕອບກັບທັນທີ",
          },
          account: {
            title: "ສະຖິຕິ",
            description: "ເບິ່ງສະຖິຕິຂອງກ່ອງຈົດໝາຍ",
          },
        },
        skills: {
          getInbox: {
            title: "ເບິ່ງກ່ອງຈົດໝາຍ",
            description: "ເບິ່ງອີເມວຫຼ້າສຸດ",
          },
          search: {
            title: "ຄົ້ນຫາອີເມວ",
            description: "ຄົ້ນຫາອີເມວໂດຍໃຊ້ Microsoft Search syntax",
          },
          readThread: {
            title: "ອ່ານການສົນທະນາ",
            description: "ອ່ານຂໍ້ຄວາມທັງໝົດໃນການສົນທະນາ",
          },
          createDraft: {
            title: "ສ້າງສະບັບຮ່າງ",
            description: "ສ້າງອີເມວສະບັບຮ່າງໃໝ່",
          },
          updateDraft: {
            title: "ອັບເດດສະບັບຮ່າງ",
            description: "ແກ້ໄຂສະບັບຮ່າງ",
          },
          listDrafts: {
            title: "ລາຍຊື່ສະບັບຮ່າງ",
            description: "ເບິ່ງລາຍຊື່ສະບັບຮ່າງ",
          },
          deleteDraft: {
            title: "ລຶບສະບັບຮ່າງ",
            description: "ລຶບສະບັບຮ່າງ",
          },
          sendDraft: {
            title: "ສົ່ງສະບັບຮ່າງ",
            description: "ສົ່ງສະບັບຮ່າງທີ່ມີຢູ່",
          },
          sendEmail: {
            title: "ສົ່ງອີເມວ",
            description: "ສົ່ງອີເມວໃໝ່ທັນທີ",
          },
          getMailboxStats: {
            title: "ສະຖິຕິຈົດໝາຍ",
            description: "ເບິ່ງສະຖິຕິກ່ອງຈົດໝາຍ",
          },
        },
      },
      default_skill:
        "ໂດຍເລີ່ມຕົ້ນ ທັກສະນີ້ຈະຖືກເປີດໃຊ້ງານ, ແຕ່ທ່ານສາມາດປິດມັນໄດ້ຖ້າບໍ່ຕ້ອງການໃຫ້ເອເຈນໃຊ້.",
    },
    mcp: {
      title: "ເຊີບເວີ MCP",
      "loading-from-config": "ກຳລັງໂຫຼດເຊີບເວີ MCP ຈາກໄຟລ໌ການຕັ້ງຄ່າ",
      "learn-more": "ຮຽນຮູ້ເພີ່ມເຕີມກ່ຽວກັບ MCP Servers.",
      "no-servers-found": "ບໍ່ພົບເຊີບເວີ MCP",
      "tool-warning":
        "ເພື່ອປະສິດທິພາບທີ່ດີທີ່ສຸດ, ໃຫ້ປິດເຄື່ອງມືທີ່ບໍ່ຈຳເປັນເພື່ອປະຢັດ context.",
      "tools-enabled": "ເຄື່ອງມືທີ່ເປີດໃຊ້ງານ",
      "stop-server": "ຢຸດເຊີບເວີ MCP",
      "start-server": "ເລີ່ມເຊີບເວີ MCP",
      "delete-server": "ລຶບເຊີບເວີ MCP",
      "tool-count-warning":
        "ເຊີບເວີ MCP ນີ້ມີ <b>{{count}} ເຄື່ອງມືທີ່ເປີດໃຊ້</b> ເຊິ່ງຈະໃຊ້ context ໃນທຸກໆການແຊັດ.<br />ໃຫ້ປິດເຄື່ອງມືທີ່ບໍ່ຈຳເປັນ.",
      "startup-command": "ຄຳສັ່ງເລີ່ມຕົ້ນ",
      command: "ຄຳສັ່ງ",
      arguments: "ອາຄິວເມນ (Arguments)",
      "not-running-warning":
        "ເຊີບເວີ MCP ນີ້ບໍ່ໄດ້ເຮັດວຽກ - ມັນອາດຈະຖືກຢຸດ ຫຼື ມີຂໍ້ຜິດພາດຕອນເລີ່ມຕົ້ນ.",
      "tool-call-arguments": "ອາຄິວເມນຂອງການເອີ້ນໃຊ້ເຄື່ອງມື",
    },
    settings: {
      title: "ການຕັ້ງຄ່າທັກສະເອເຈນ",
      "max-tool-calls": {
        title: "ຈຳນວນການເອີ້ນໃຊ້ເຄື່ອງມືສູງສຸດຕໍ່ການຕອບໂຕ້",
        description:
          "ຈຳນວນເຄື່ອງມືສູງສຸດທີ່ເອເຈນສາມາດໃຊ້ຕໍ່ເນື່ອງກັນເພື່ອສ້າງຄຳຕອບດຽວ. ສິ່ງນີ້ຊ່ວຍປ້ອງກັນການເຮັດວຽກທີ່ບໍ່ມີວັນສິ້ນສຸດ.",
      },
      "intelligent-skill-selection": {
        title: "ການເລືອກທັກສະແບບອັດສະລິຍະ",
        description:
          "ເປີດໃຊ້ເຄື່ອງມືແບບບໍ່ຈຳກັດ ແລະ ຫຼຸດການໃຊ້ token ໄດ້ເຖິງ 80% — AnythingLLM ຈະເລືອກທັກສະທີ່ເໝາະສົມໃຫ້ໂດຍອັດຕະໂນມັດ.",
        "max-tools": {
          title: "ຈຳນວນເຄື່ອງມືສູງສຸດ",
          description: "ຈຳນວນເຄື່ອງມືສູງສຸດທີ່ຈະເລືອກໃນແຕ່ລະການສອບຖາມ.",
        },
      },
      "clarifying-questions": {
        title: "ໃຫ້ເອເຈນຖາມຄຳຖາມເພື່ອຄວາມຊັດເຈນ",
        "beta-badge": "BETA",
        description:
          "ເມື່ອເປີດໃຊ້ງານ, ເອເຈນສາມາດຢຸດເພື່ອຖາມຄຳຖາມສັ້ນໆ ຖ້າຄຳສັ່ງຂອງທ່ານບໍ່ຊັດເຈນ.",
        "max-per-turn": {
          title: "ຄຳຖາມສູງສຸດຕໍ່ຮອບ",
          description: "ເອເຈນສາມາດຖາມໄດ້ຈັກຄຳຖາມໃນໜຶ່ງຮອບ.",
        },
      },
    },
  },
  recorded: {
    title: "ປະຫວັດການສົນທະນາ",
    description:
      "ນີ້ແມ່ນບັນທຶກການສົນທະນາ ແລະ ຂໍ້ຄວາມທັງໝົດທີ່ຖືກສົ່ງໂດຍຜູ້ໃຊ້ ຈັດລຽງຕາມວັນທີ.",
    export: "ສົ່ງອອກ",
    table: {
      id: "ID",
      by: "ສົ່ງໂດຍ",
      workspace: "ພື້ນທີ່ເຮັດວຽກ",
      prompt: "ຄຳສັ່ງ (Prompt)",
      response: "ຄຳຕອບ",
      at: "ສົ່ງເມື່ອ",
    },
  },
  customization: {
    interface: {
      title: "ການຕັ້ງຄ່າ UI",
      description: "ຕັ້ງຄ່າ UI ຂອງທ່ານສຳລັບ AnythingLLM.",
    },
    branding: {
      title: "ແບຣນດິງ & Whitelabeling",
      description: "ປັບແຕ່ງແບຣນຂອງທ່ານເອງໃນ AnythingLLM.",
    },
    chat: {
      title: "ການສົນທະນາ",
      description: "ຕັ້ງຄ່າການສົນທະນາສຳລັບ AnythingLLM.",
      auto_submit: {
        title: "ສົ່ງສຽງອັດຕະໂນມັດ",
        description: "ສົ່ງຂໍ້ມູນສຽງໂດຍອັດຕະໂນມັດຫຼັງຈາກທີ່ມິດໄປໄລຍະໜຶ່ງ",
      },
      auto_speak: {
        title: "ເວົ້າຄຳຕອບອັດຕະໂນມັດ",
        description: "ໃຫ້ AI ເວົ້າຄຳຕອບໂດຍອັດຕະໂນມັດ",
      },
      spellcheck: {
        title: "ເປີດໃຊ້ການກວດຄຳຜິດ",
        description: "ເປີດ ຫຼື ປິດການກວດຄຳຜິດໃນຊ່ອງປ້ອນຂໍ້ຄວາມ",
      },
    },
    items: {
      theme: {
        title: "ທີມ (Theme)",
        description: "ເລືອກໂທນສີທີ່ທ່ານມັກ.",
      },
      "show-scrollbar": {
        title: "ສະແດງແຖບເລື່ອນ (Scrollbar)",
        description: "ເປີດ ຫຼື ປິດແຖບເລື່ອນໃນໜ້າຕ່າງແຊັດ.",
      },
      "support-email": {
        title: "ອີເມວຊ່ວຍເຫຼືອ",
        description:
          "ຕັ້ງອີເມວຊ່ວຍເຫຼືອເພື່ອໃຫ້ຜູ້ໃຊ້ຕິດຕໍ່ເມື່ອຕ້ອງການຄວາມຊ່ວຍເຫຼືອ.",
      },
      "app-name": {
        title: "ຊື່ແອັບ",
        description: "ຕັ້ງຊື່ທີ່ຈະສະແດງໃນໜ້າເຂົ້າສູ່ລະບົບໃຫ້ຜູ້ໃຊ້ທຸກຄົນເຫັນ.",
      },
      "display-language": {
        title: "ພາສາທີ່ສະແດງ",
        description:
          "ເລືອກພາສາທີ່ຈະໃຊ້ໃນ UI ຂອງ AnythingLLM (ເມື່ອມີພາສານັ້ນໃຫ້ເລືອກ).",
      },
      logo: {
        title: "ໂລໂກ້ແບຣນ",
        description: "ອັບໂຫຼດໂລໂກ້ຂອງທ່ານເອງເພື່ອສະແດງໃນທຸກໜ້າ.",
        add: "ເພີ່ມໂລໂກ້",
        recommended: "ຂະໜາດທີ່ແນະນຳ: 800 x 200",
        remove: "ເອົາອອກ",
        replace: "ປ່ຽນໃໝ່",
      },
      "browser-appearance": {
        title: "ລັກສະນະໃນບຣາວເຊີ",
        description: "ປັບແຕ່ງແຖບບຣາວເຊີ ແລະ ຊື່ເມື່ອເປີດແອັບ.",
        tab: {
          title: "ຊື່ແຖບ (Title)",
          description: "ຕັ້ງຊື່ແຖບເມື່ອເປີດແອັບໃນບຣາວເຊີ.",
        },
        favicon: {
          title: "Favicon",
          description: "ໃຊ້ Favicon ຂອງທ່ານເອງ.",
        },
      },
      "sidebar-footer": {
        title: "ລາຍການທ້າຍແຖບດ້ານຂ້າງ",
        description: "ປັບແຕ່ງລາຍການທີ່ຈະສະແດງຢູ່ທາງລຸ່ມຂອງແຖບດ້ານຂ້າງ.",
        icon: "ໄອຄອນ",
        link: "ລິ້ງ",
      },
      "render-html": {
        title: "ສະແດງ HTML ໃນແຊັດ",
        description:
          "ສະແດງຜົນ HTML ໃນຄຳຕອບຂອງ AI.\nສິ່ງນີ້ອາດເຮັດໃຫ້ຄຳຕອບເບິ່ງດີຂຶ້ນ ແຕ່ກໍອາດມີຄວາມສ່ຽງດ້ານຄວາມປອດໄພ.",
      },
    },
  },
  api: {
    title: "API Keys",
    description:
      "API keys ອະນຸຍາດໃຫ້ເຂົ້າເຖິງ ແລະ ຈັດການ AnythingLLM ຜ່ານການຂຽນໂປຣແກຣມ.",
    link: "ອ່ານຄູ່ມື API",
    generate: "ສ້າງ API Key ໃໝ່",
    empty: "ບໍ່ພົບ API keys",
    actions: "ການດຳເນີນການ",
    messages: {
      error: "ຂໍ້ຜິດພາດ: {{error}}",
    },
    modal: {
      title: "ສ້າງ API key ໃໝ່",
      cancel: "ຍົກເລີກ",
      close: "ປິດ",
      create: "ສ້າງ API Key",
      helper:
        "ເມື່ອສ້າງແລ້ວ ສາມາດໃຊ້ API key ເພື່ອເຂົ້າເຖິງລະບົບ AnythingLLM ນີ້ໄດ້.",
      name: {
        label: "ຊື່",
        placeholder: "ຕົວຢ່າງ: ການເຊື່ອມຕໍ່ລະບົບຈິງ",
        helper: "ບໍ່ບັງຄັບ. ຕັ້ງຊື່ເພື່ອໃຫ້ທ່ານຈື່ໄດ້ໃນພາຍຫຼັງ.",
      },
    },
    row: {
      copy: "ກັອບປີ້ API Key",
      copied: "ກັອບປີ້ແລ້ວ",
      unnamed: "--",
      deleteConfirm:
        "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການປິດໃຊ້ງານ API key ນີ້?\nຫຼັງຈາກນີ້ມັນຈະໃຊ້ງານບໍ່ໄດ້ອີກ.\n\nການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.",
    },
    table: {
      name: "ຊື່",
      key: "API Key",
      by: "ສ້າງໂດຍ",
      created: "ສ້າງເມື່ອ",
    },
  },
  llm: {
    title: "ການຕັ້ງຄ່າ LLM",
    description:
      "ນີ້ແມ່ນຂໍ້ມູນ ແລະ ການຕັ້ງຄ່າສຳລັບຜູ້ໃຫ້ບໍລິການ LLM ແລະ embedding ທີ່ທ່ານເລືອກ. ມັນສຳຄັນຫຼາຍທີ່ຂໍ້ມູນເຫຼົ່ານີ້ຕ້ອງຖືກຕ້ອງ ບໍ່ດັ່ງນັ້ນ AnythingLLM ຈະເຮັດວຽກບໍ່ໄດ້.",
    provider: "ຜູ້ໃຫ້ບໍລິການ LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure Service Endpoint",
        api_key: "API Key",
        chat_deployment_name: "ຊື່ Chat Deployment",
        chat_model_token_limit: "ຂີດຈຳກັດ Token ຂອງແບບຈຳລອງ",
        model_type: "ປະເພດແບບຈຳລອງ",
        model_type_tooltip:
          "ຖ້າ Deployment ຂອງທ່ານໃຊ້ແບບຈຳລອງແບບໃຫ້ເຫດຜົນ (o1, o1-mini, o3-mini, ແລະ ອື່ນໆ), ໃຫ້ຕັ້ງເປັນ “Reasoning”. ບໍ່ດັ່ງນັ້ນການແຊັດອາດຈະລົ້ມເຫຼວ.",
        default: "ຄ່າເລີ່ມຕົ້ນ",
        reasoning: "ການໃຫ້ເຫດຜົນ (Reasoning)",
      },
    },
  },
  "model-router": {
    title: "Model Routers",
    description:
      "Model routers ຊ່ວຍໃຫ້ທ່ານກຳນົດກົດເກນເພື່ອສົ່ງຂໍ້ຄວາມໄປຫາຜູ້ໃຫ້ບໍລິການ LLM ແລະ ແບບຈຳລອງທີ່ແຕກຕ່າງກັນໂດຍອັດຕະໂນມັດຕາມເງື່ອນໄຂ.",
    table: {
      name: "ຊື່",
      fallback: "ແບບຈຳລອງສຳຮອງ",
      rules: "ກົດເກນ",
      workspaces: "ພື້ນທີ່ເຮັດວຽກ",
    },
    "no-routers": "ຍັງບໍ່ມີ model router",
    "empty-description":
      "ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ model router. ສ້າງອັນໃໝ່ເພື່ອເລີ່ມຕົ້ນ.",
    "new-router-button": "ສ້າງ Router ໃໝ່",
    "delete-confirm":
      'ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ router "{{name}}"?\nສິ່ງນີ້ຈະເອົາກົດເກນທັງໝົດອອກ ແລະ ຍົກເລີກການເຊື່ອມຕໍ່ກັບພື້ນທີ່ເຮັດວຽກທີ່ໃຊ້ມັນຢູ່.\n\nການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.',
    "toast-deleted": "ລຶບ Router ແລ້ວ",
    "toast-delete-failed": "ລຶບ Router ບໍ່ສຳເລັດ: {{error}}",
    "new-router": {
      title: "ສ້າງ Model Router ໃໝ່",
      name: "ຊື່",
      "name-placeholder": "ເຊັ່ນ: ຕົວຈັດການຕົ້ນທຶນ",
      description: "ຄຳອະທິບາຍ",
      "description-placeholder": "ຄຳອະທິບາຍ (ບໍ່ບັງຄັບ)",
      "fallback-label": "ຜູ້ໃຫ້ບໍລິການ & ແບບຈຳລອງຫຼັກ",
      "fallback-description": "ໃຊ້ເມື່ອບໍ່ມີກົດເກນໃດກົງກັບເງື່ອນໄຂ.",
      "cooldown-label": "ໄລຍະເວລາລໍຖ້າແຄຊ໌ (ວິນາທີ)",
      "cooldown-help":
        "ໄລຍະເວລາທີ່ຈະເກັບການຕັດສິນໃຈໄວ້ກ່ອນຈະກວດສອບກົດເກນໃໝ່. ຕັ້ງເປັນ 0 ເພື່ອປິດການແຄຊ໌.",
      "name-required": "ຈຳເປັນຕ້ອງມີຊື່.",
      "fallback-required": "ຈຳເປັນຕ້ອງມີຜູ້ໃຫ້ບໍລິການ ແລະ ແບບຈຳລອງຫຼັກ.",
      cancel: "ຍົກເລີກ",
      create: "ສ້າງ Router",
    },
    "edit-router": {
      "back-to-routers": "ກັບໄປໜ້າ Model Routers",
      title: "ແກ້ໄຂ Router: {{name}}",
      save: "ບັນທຶກການປ່ຽນແປງ",
      "toast-update-failed": "ອັບເດດ router ບໍ່ສຳເລັດ",
    },
    rules: {
      title: "ກົດເກນການກຳນົດເສັ້ນທາງ",
      "title-with-name": "ກົດເກນຂອງ Router: {{name}}",
      description:
        "ກຳນົດກົດເກນເພື່ອເລືອກວ່າຂໍ້ຄວາມໃດຄວນໄປຫາຜູ້ໃຫ້ບໍລິການ ແລະ ແບບຈຳລອງໃດ.",
      "add-rule": "ເພີ່ມກົດເກນ",
      "delete-confirm": 'ລຶບກົດເກນ "{{title}}"?',
      "toast-delete-failed": "ລຶບກົດເກນບໍ່ສຳເລັດ",
      "toast-reorder-failed": "ຈັດລຽງກົດເກນບໍ່ສຳເລັດ",
      "no-rules": "ຍັງບໍ່ມີກົດເກນ",
      "empty-description":
        "ເພີ່ມກົດເກນເພື່ອເລີ່ມສົ່ງຂໍ້ຄວາມໄປຫາແບບຈຳລອງທີ່ຕ້ອງການ.",
      "new-rule-button": "ກົດເກນໃໝ່",
      "calculated-section-label":
        "ກົດເກນແບບຄຳນວນ — ກວດສອບກ່ອນ, ຕາມລຳດັບຄວາມສຳຄັນ",
      "llm-section-label": "ກົດເກນແບບ LLM — ກວດສອບຖ້າບໍ່ມີກົດເກນແບບຄຳນວນໃດກົງ",
      "llm-rule-body":
        'ຖ້າກົງກັບ <desc>"{{description}}"</desc> ໃຫ້ສົ່ງໄປທີ່ <route>{{route}}</route>',
      "calculated-no-conditions":
        "ບໍ່ມີເງື່ອນໄຂ — ສົ່ງໄປທີ່ <route>{{route}}</route>",
      "calculated-single-condition":
        'ຖ້າ <prop>{{property}}</prop> {{comparator}} <val>"{{value}}"</val> ໃຫ້ສົ່ງໄປທີ່ <route>{{route}}</route>',
      "calculated-multi-condition":
        "ຖ້າ {{quantifier}} ຂອງ <cond>{{conditions}}</cond> ໃຫ້ສົ່ງໄປທີ່ <route>{{route}}</route>",
      "comparator-contains": "ປະກອບມີ",
      "comparator-matches": "ກົງກັບ",
      "comparator-between": "ຢູ່ລະຫວ່າງ",
      "badge-llm": "LLM",
      "badge-calculated": "ຄຳນວນ",
      "aria-drag-to-reorder": "ລາກເພື່ອຈັດລຽງ",
      "aria-edit-rule": "ແກ້ໄຂກົດເກນ",
      "aria-delete-rule": "ລຶບກົດເກນ",
      "quantifier-any": "ອັນໃດອັນໜຶ່ງ",
      "quantifier-all": "ທັງໝົດ",
    },
    "rule-form": {
      "title-label": "ຫົວຂໍ້",
      "rule-type": "ປະເພດກົດເກນ",
      "property-label": "ຄຸນສົມບັດ",
      "property-select": "ເລືອກ",
      "comparator-label": "ຕົວປຽບທຽບ",
      "comparator-select": "ເລືອກ",
      "value-label": "ຄ່າ",
      "add-condition": "ເພີ່ມເງື່ອນໄຂ",
      "remove-condition": "ເອົາເງື່ອນໄຂອອກ",
      "conditions-incomplete":
        "ເງື່ອນໄຂທີ {{index}} ບໍ່ສົມບູນ — ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ.",
      "match-description-label": "ຄຳອະທິບາຍການຈັບຄູ່",
      "match-description-placeholder":
        "ເຊັ່ນ: ຜູ້ໃຊ້ຖາມກ່ຽວກັບກົດໝາຍ, ສັນຍາ ຫຼື ຂໍ້ກຳນົດ",
      "match-description-help":
        "ອະທິບາຍສະຖານະການທີ່ທ່ານຕ້ອງການໃຫ້ກົດເກນນີ້ເຮັດວຽກ. LLM ຈະເປັນຜູ້ຕັດສິນ.",
      "route-to-label": "ສົ່ງໄປຫາຜູ້ໃຫ້ບໍລິການ & ແບບຈຳລອງ",
      "route-to-description": "ເມື່ອກົດເກນນີ້ກົງ, ໃຫ້ໃຊ້ແບບຈຳລອງນີ້",
      cancel: "ຍົກເລີກ",
      saving: "ກຳລັງບັນທຶກ...",
      "update-rule": "ອັບເດດກົດເກນ",
      "create-rule": "ສ້າງກົດເກນ",
      "title-required": "ຈຳເປັນຕ້ອງມີຫົວຂໍ້",
      "toast-save-failed": "ບັນທຶກກົດເກນບໍ່ສຳເລັດ",
      "type-calculated-label": "ຄຳນວນ (Calculated)",
      "type-calculated-description":
        "ຈັບຄູ່ຕາມຄຸນສົມບັດຂອງຂໍ້ຄວາມ ເຊັ່ນ ເນື້ອຫາ, ຈຳນວນ token ຫຼື ເວລາ.",
      "type-llm-label": "ຈຳແນກໂດຍ LLM",
      "type-llm-description":
        "ໃຊ້ LLM ເພື່ອແຍກປະເພດຂໍ້ຄວາມຕາມຄຳອະທິບາຍທີ່ທ່ານກຳນົດ.",
      "prop-prompt-content": "ເນື້ອຫາຂອງ Prompt",
      "prop-token-count": "ຈຳນວນ Token ໃນການສົນທະນາ",
      "prop-message-count": "ຈຳນວນຂໍ້ຄວາມໃນການສົນທະນາ",
      "prop-current-hour": "ຊົ່ວໂມງປັດຈຸບັນ (0-23)",
      "prop-has-image": "ມີຮູບພາບແນບມາ",
      "cmp-contains": "ປະກອບມີ",
      "cmp-matches-regex": "ກົງກັບ (regex)",
      "cmp-equals": "ເທົ່າກັບ",
      "cmp-not-equals": "ບໍ່ເທົ່າກັບ",
      "cmp-greater-than": "ຫຼາຍກວ່າ",
      "cmp-greater-than-or-equal": "ຫຼາຍກວ່າ ຫຼື ເທົ່າກັບ",
      "cmp-less-than": "ໜ້ອຍກວ່າ",
      "cmp-less-than-or-equal": "ໜ້ອຍກວ່າ ຫຼື ເທົ່າກັບ",
      "cmp-between": "ຢູ່ລະຫວ່າງ (ລວມ)",
      "placeholder-between-hour": "ເຊັ່ນ: 9,17 (9 ໂມງເຊົ້າ ຫາ 5 ໂມງແລງ)",
      "placeholder-between-numeric": "ເຊັ່ນ: 10,50",
      "placeholder-hour": "ເຊັ່ນ: 18 (0-23)",
      "placeholder-message-count": "ເຊັ່ນ: 10",
      "placeholder-numeric": "ເຊັ່ນ: 4000",
      "placeholder-contains": "ເຊັ່ນ: code, python, rust",
      "placeholder-matches": "ເຊັ່ນ: /\\bpython\\b/i",
      "placeholder-default": "ເຊັ່ນ: code",
      "help-contains":
        "ລາຍການທີ່ຂັ້ນດ້ວຍຈ້ຳ (,) — ຈະເຮັດວຽກຖ້າ prompt ມີຄຳໃດຄຳໜຶ່ງ (ບໍ່ສົນໃຈຕົວພິມໃຫຍ່ນ້ອຍ).",
      "help-matches": "ຮູບແບບ Regex.",
      "bool-true": "ຈິງ",
      "bool-false": "ເທັດ",
    },
    "provider-picker": {
      "select-provider": "ເລືອກຜູ້ໃຫ້ບໍລິການ",
      "setup-required": "(ຕ້ອງຕັ້ງຄ່າກ່ອນ)",
      "loading-models": "ກຳລັງໂຫຼດແບບຈຳລອງ...",
      "select-model": "ເລືອກແບບຈຳລອງ",
      "enter-model": "ປ້ອນຊື່ແບບຈຳລອງ",
      "select-provider-first": "ເລືອກຜູ້ໃຫ້ບໍລິການກ່ອນ",
      "configure-to-continue": "ຕັ້ງຄ່າ {{name}} ເພື່ອດຳເນີນການຕໍ່",
      "configure-provider": "ຕັ້ງຄ່າ {{name}}",
      "setup-credentials": "ປ້ອນຂໍ້ມູນທີ່ຈຳເປັນເພື່ອໃຊ້ {{name}}.",
      cancel: "ຍົກເລີກ",
      "save-settings": "ບັນທຶກການຕັ້ງຄ່າ",
      "toast-save-failed": "ບັນທຶກການຕັ້ງຄ່າບໍ່ສຳເລັດ: {{error}}",
    },
    "router-selection": {
      "loading-routers": "ກຳລັງໂຫຼດ router...",
      "no-routers-prefix-settings": "ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ model router.",
      "no-routers-prefix-workspace": "ບໍ່ມີ model router ທີ່ຕັ້ງຄ່າໄວ້.",
      "no-routers-link": "ສ້າງໃໝ່ໃນການຕັ້ງຄ່າ Model Router",
      "model-router-label": "Model Router",
      "select-router": "ເລືອກ router",
      "select-description": "ເລືອກ router ທີ່ຈະໃຊ້ສຳລັບພື້ນທີ່ນີ້.",
      "no-routers-chat":
        "ບໍ່ມີ router. ສ້າງໄດ້ທີ່ Settings > AI Providers > Model Router.",
      "rule-count": "({{count}} ກົດເກນ)",
    },
    metrics: {
      "model-router-default": "Model Router",
    },
    chat: {
      "select-router-error": "ກະລຸນາເລືອກ router",
      "invalid-model": "ການເລືອກແບບຈຳລອງບໍ່ຖືກຕ້ອງ",
      "routed-to": "ສົ່ງໄປຫາ <route>{{model}}</route>",
      "routed-to-rule":
        "ສົ່ງໄປຫາ <route>{{model}}</route> ຜ່ານກົດເກນ <rule>{{ruleTitle}}</rule>",
    },
  },
  transcription: {
    title: "ການຕັ້ງຄ່າແບບຈຳລອງຖອດຂໍ້ຄວາມ",
    description:
      "ນີ້ແມ່ນຂໍ້ມູນສຳລັບຜູ້ໃຫ້ບໍລິການແບບຈຳລອງຖອດຂໍ້ຄວາມ. ຂໍ້ມູນເຫຼົ່ານີ້ຕ້ອງຖືກຕ້ອງເພື່ອໃຫ້ສາມາດຖອດຂໍ້ຄວາມຈາກໄຟລ໌ສື່ ແລະ ສຽງໄດ້.",
    provider: "ຜູ້ໃຫ້ບໍລິການຖອດຂໍ້ຄວາມ",
    "warn-start":
      "ການໃຊ້ແບບຈຳລອງ whisper ໃນເຄື່ອງທີ່ມີ RAM ຫຼື CPU ຈຳກັດ ອາດເຮັດໃຫ້ AnythingLLM ເຮັດວຽກຊ້າລົງ.",
    "warn-recommend":
      "ແນະນຳໃຫ້ມີ RAM ຢ່າງໜ້ອຍ 2GB ແລະ ອັບໂຫຼດໄຟລ໌ທີ່ມີຂະໜາດ <10Mb.",
    "warn-end": "ແບບຈຳລອງໃນຕົວຈະຖືກດາວໂຫຼດໂດຍອັດຕະໂນມັດເມື່ອໃຊ້ງານຄັ້ງທຳອິດ.",
  },
  embedding: {
    title: "ການຕັ້ງຄ່າ Embedding",
    "desc-start":
      "ເມື່ອໃຊ້ LLM ທີ່ບໍ່ຮອງຮັບ embedding engine ໃນຕົວ - ທ່ານອາດຈະຕ້ອງລະບຸຂໍ້ມູນສຳລັບການ embedding ຂໍ້ຄວາມເພີ່ມເຕີມ.",
    "desc-end":
      "Embedding ແມ່ນຂະບວນການປ່ຽນຂໍ້ຄວາມໃຫ້ເປັນເວກເຕີ. ຂໍ້ມູນເຫຼົ່ານີ້ຈຳເປັນເພື່ອປ່ຽນໄຟລ໌ ແລະ prompt ໃຫ້ເປັນຮູບແບບທີ່ AnythingLLM ສາມາດປະມວນຜົນໄດ້.",
    provider: {
      title: "ຜູ້ໃຫ້ບໍລິການ Embedding",
    },
  },
  text: {
    title: "ການຕັ້ງຄ່າການແຍກຂໍ້ຄວາມ (Text splitting & Chunking)",
    "desc-start":
      "ບາງຄັ້ງ ທ່ານອາດຕ້ອງການປ່ຽນວິທີການແຍກ ແລະ ແບ່ງຂໍ້ຄວາມກ່ອນຈະນຳເຂົ້າຖານຂໍ້ມູນເວກເຕີ.",
    "desc-end":
      "ທ່ານຄວນປ່ຽນການຕັ້ງຄ່ານີ້ກໍຕໍ່ເມື່ອທ່ານເຂົ້າໃຈວິທີການເຮັດວຽກ ແລະ ຜົນກະທົບຂອງມັນເທົ່ານັ້ນ.",
    size: {
      title: "ຂະໜາດຂອງ Chunk ຂໍ້ຄວາມ",
      description: "ນີ້ແມ່ນຄວາມຍາວສູງສຸດຂອງຕົວອັກສອນໃນໜຶ່ງເວກເຕີ.",
      recommend: "ຄວາມຍາວສູງສຸດຂອງແບບຈຳລອງ embed ແມ່ນ",
    },
    overlap: {
      title: "ການຊ້ອນກັນຂອງ Chunk ຂໍ້ຄວາມ (Overlap)",
      description:
        "ນີ້ແມ່ນຈຳນວນຕົວອັກສອນທີ່ໃຫ້ຊ້ອນກັນລະຫວ່າງສອງ chunk ທີ່ຢູ່ຕິດກັນ.",
    },
  },
  vector: {
    title: "ຖານຂໍ້ມູນເວກເຕີ",
    description:
      "ນີ້ແມ່ນຂໍ້ມູນ ແລະ ການຕັ້ງຄ່າສຳລັບຖານຂໍ້ມູນເວກເຕີ. ມັນສຳຄັນຫຼາຍທີ່ຂໍ້ມູນເຫຼົ່ານີ້ຕ້ອງຖືກຕ້ອງ.",
    provider: {
      title: "ຜູ້ໃຫ້ບໍລິການຖານຂໍ້ມູນເວກເຕີ",
      description: "ບໍ່ຈຳເປັນຕ້ອງຕັ້ງຄ່າສຳລັບ LanceDB.",
    },
  },
  embeddable: {
    title: "Chat Widgets ທີ່ຝັງໄດ້",
    description:
      "Chat widgets ແມ່ນອິນເຕີເຟດການສົນທະນາທີ່ເປີດໃຫ້ສາທາລະນະ ເຊິ່ງເຊື່ອມຕໍ່ກັບພື້ນທີ່ເຮັດວຽກດຽວ. ສິ່ງນີ້ຊ່ວຍໃຫ້ທ່ານສ້າງພື້ນທີ່ເຮັດວຽກແລ້ວເຜີຍແຜ່ໃຫ້ໂລກເຫັນໄດ້.",
    create: "ສ້າງ widget ຝັງ",
    table: {
      workspace: "ພື້ນທີ່ເຮັດວຽກ",
      chats: "ຈຳນວນການແຊັດ",
      active: "ໂດເມນທີ່ໃຊ້ງານ",
      created: "ສ້າງເມື່ອ",
    },
  },
  "embed-chats": {
    title: "ປະຫວັດການແຊັດຈາກ widget ຝັງ",
    export: "ສົ່ງອອກ",
    description:
      "ນີ້ແມ່ນບັນທຶກການສົນທະນາທັງໝົດຈາກ widget ຝັງທີ່ທ່ານໄດ້ເຜີຍແຜ່.",
    table: {
      embed: "Widget ຝັງ",
      sender: "ຜູ້ສົ່ງ",
      message: "ຂໍ້ຄວາມ",
      response: "ຄຳຕອບ",
      at: "ສົ່ງເມື່ອ",
    },
  },
  telegram: {
    title: "Telegram Bot",
    description:
      "ເຊື່ອມຕໍ່ AnythingLLM ກັບ Telegram ເພື່ອໃຫ້ທ່ານສາມາດສົນທະນາກັບພື້ນທີ່ເຮັດວຽກໄດ້ຈາກທຸກອຸປະກອນ.",
    setup: {
      step1: {
        title: "ຂັ້ນຕອນທີ 1: ສ້າງ Telegram bot ຂອງທ່ານ",
        description:
          "ເປີດ @BotFather ໃນ Telegram, ສົ່ງ <code>/newbot</code> ຫາ <code>@BotFather</code>, ເຮັດຕາມຂັ້ນຕອນ, ແລ້ວກັອບປີ້ API token ມາ.",
        "open-botfather": "ເປີດ BotFather",
        "instruction-1": "1. ເປີດລິ້ງ ຫຼື ສະແກນ QR code",
        "instruction-2":
          "2. ສົ່ງ <code>/newbot</code> ຫາ <code>@BotFather</code>",
        "instruction-3": "3. ຕັ້ງຊື່ ແລະ ຊື່ຜູ້ໃຊ້ (username) ໃຫ້ bot ຂອງທ່ານ",
        "instruction-4": "4. ກັອບປີ້ API token ທີ່ໄດ້ຮັບ",
      },
      step2: {
        title: "ຂັ້ນຕອນທີ 2: ເຊື່ອມຕໍ່ bot ຂອງທ່ານ",
        description: "ວາງ API token ທີ່ໄດ້ຈາກ @BotFather ເພື່ອເຊື່ອມຕໍ່.",
        "bot-token": "Bot Token",
        connecting: "ກຳລັງເຊື່ອມຕໍ່...",
        "connect-bot": "ເຊື່ອມຕໍ່ Bot",
      },
      security: {
        title: "ການຕັ້ງຄ່າຄວາມປອດໄພທີ່ແນະນຳ",
        description:
          "ເພື່ອຄວາມປອດໄພເພີ່ມເຕີມ, ໃຫ້ຕັ້ງຄ່າເຫຼົ່ານີ້ໃນ @BotFather.",
        "disable-groups": "— ປ້ອງກັນການດຶງ bot ເຂົ້າກຸ່ມ",
        "disable-inline": "— ປ້ອງກັນການໃຊ້ bot ໃນ inline search",
        "obscure-username":
          "ໃຊ້ຊື່ຜູ້ໃຊ້ bot ທີ່ເດົາໄດ້ຍາກເພື່ອຫຼຸດການຖືກຄົ້ນຫາ",
      },
      "toast-enter-token": "ກະລຸນາປ້ອນ bot token.",
      "toast-connect-failed": "ເຊື່ອມຕໍ່ bot ບໍ່ສຳເລັດ.",
    },
    connected: {
      status: "ເຊື່ອມຕໍ່ແລ້ວ",
      "status-disconnected":
        "ຕັດການເຊື່ອມຕໍ່ — token ອາດໝົດອາຍຸ ຫຼື ບໍ່ຖືກຕ້ອງ",
      "placeholder-token": "ວາງ bot token ໃໝ່...",
      reconnect: "ເຊື່ອມຕໍ່ຄືນໃໝ່",
      workspace: "ພື້ນທີ່ເຮັດວຽກ",
      "bot-link": "ລິ້ງຂອງ Bot",
      "voice-response": "ການຕອບໂຕ້ດ້ວຍສຽງ",
      disconnecting: "ກຳລັງຕັດການເຊື່ອມຕໍ່...",
      disconnect: "ຕັດການເຊື່ອມຕໍ່",
      "voice-text-only": "ຂໍ້ຄວາມເທົ່ານັ້ນ",
      "voice-mirror": "ສະທ້ອນ (ຕອບດ້ວຍສຽງເມື່ອຜູ້ໃຊ້ສົ່ງສຽງ)",
      "voice-always": "ສຽງຕະຫຼອດ (ສົ່ງສຽງໃນທຸກຄຳຕອບ)",
      "toast-disconnect-failed": "ຕັດການເຊື່ອມຕໍ່ບໍ່ສຳເລັດ.",
      "toast-reconnect-failed": "ເຊື່ອມຕໍ່ຄືນໃໝ່ບໍ່ສຳເລັດ.",
      "toast-voice-failed": "ອັບເດດໂໝດສຽງບໍ່ສຳເລັດ.",
      "toast-approve-failed": "ອະນຸມັດຜູ້ໃຊ້ບໍ່ສຳເລັດ.",
      "toast-deny-failed": "ປະຕິເສດຜູ້ໃຊ້ບໍ່ສຳເລັດ.",
      "toast-revoke-failed": "ຖອນສິດຜູ້ໃຊ້ບໍ່ສຳເລັດ.",
    },
    users: {
      "pending-description":
        "ຜູ້ໃຊ້ທີ່ລໍຖ້າການຢືນຢັນ. ໃຫ້ກວດເບິ່ງລະຫັດຄູ່ (pairing code) ໃຫ້ກົງກັບທີ່ສະແດງໃນ Telegram ຂອງເຂົາເຈົ້າ.",
      unknown: "ບໍ່ຮູ້ຈັກ",
    },
  },
  security: {
    title: "ຄວາມປອດໄພ",
    multiuser: {
      title: "ໂໝດຫຼາຍຜູ້ໃຊ້ (Multi-User Mode)",
      description: "ຕັ້ງຄ່າລະບົບຂອງທ່ານໃຫ້ຮອງຮັບທີມງານໂດຍການເປີດໂໝດຫຼາຍຜູ້ໃຊ້.",
      enable: {
        "is-enable": "ໂໝດຫຼາຍຜູ້ໃຊ້ຖືກເປີດແລ້ວ",
        enable: "ເປີດໂໝດຫຼາຍຜູ້ໃຊ້",
        description:
          "ໂດຍເລີ່ມຕົ້ນ ທ່ານຈະເປັນຜູ້ດູແລພຽງຄົນດຽວ. ໃນຖານະຜູ້ດູແລ ທ່ານຕ້ອງສ້າງບັນຊີໃຫ້ຜູ້ໃຊ້ໃໝ່. ຫ້າມເຮັດລະຫັດຜ່ານເສຍ ເພາະມີພຽງຜູ້ດູແລເທົ່ານັ້ນທີ່ຕັ້ງລະຫັດໃໝ່ໄດ້.",
        username: "ຊື່ຜູ້ໃຊ້ຜູ້ດູແລ (Admin)",
        password: "ລະຫັດຜ່ານຜູ້ດູແລ (Admin)",
      },
    },
    password: {
      title: "ການປ້ອງກັນດ້ວຍລະຫັດຜ່ານ",
      description:
        "ປົກປ້ອງ AnythingLLM ຂອງທ່ານດ້ວຍລະຫັດຜ່ານ. ຖ້າທ່ານລືມ ຈະບໍ່ມີວິທີກູ້ຄືນ ດັ່ງນັ້ນກະລຸນາບັນທຶກໄວ້ໃຫ້ດີ.",
      "password-label": "ລະຫັດຜ່ານລະບົບ",
    },
  },
  event: {
    title: "ບັນທຶກເຫດການ (Event Logs)",
    description:
      "ເບິ່ງການດຳເນີນການ ແລະ ເຫດການທັງໝົດທີ່ເກີດຂຶ້ນໃນລະບົບເພື່ອການກວດສອບ.",
    clear: "ລ້າງບັນທຶກເຫດການ",
    table: {
      type: "ປະເພດເຫດການ",
      user: "ຜູ້ໃຊ້",
      occurred: "ເກີດຂຶ້ນເມື່ອ",
    },
  },
  privacy: {
    title: "ຄວາມເປັນສ່ວນຕົວ & ການຈັດການຂໍ້ມູນ",
    description:
      "ນີ້ແມ່ນການຕັ້ງຄ່າວິທີທີ່ຜູ້ໃຫ້ບໍລິການພາຍນອກ ແລະ AnythingLLM ຈັດການຂໍ້ມູນຂອງທ່ານ.",
    anonymous: "ເປີດການສົ່ງຂໍ້ມູນການໃຊ້ງານແບບບໍ່ລະບຸຕົວຕົນ (Telemetry)",
  },
  connectors: {
    "search-placeholder": "ຄົ້ນຫາຕົວເຊື່ອມຕໍ່ຂໍ້ມູນ",
    "no-connectors": "ບໍ່ພົບຕົວເຊື່ອມຕໍ່ຂໍ້ມູນ.",
    obsidian: {
      vault_location: "ຕຳແໜ່ງ Vault",
      vault_description:
        "ເລືອກໂຟນເດີ Obsidian vault ຂອງທ່ານເພື່ອການນຳເຂົ້າໂນ້ດທັງໝົດ.",
      selected_files: "ພົບໄຟລ໌ markdown {{count}} ໄຟລ໌",
      importing: "ກຳລັງນຳເຂົ້າ vault...",
      import_vault: "ນຳເຂົ້າ Vault",
      processing_time: "ສິ່ງນີ້ອາດໃຊ້ເວລາຄາວໜຶ່ງ ຂຶ້ນກັບຂະໜາດ vault ຂອງທ່ານ.",
      vault_warning:
        "ເພື່ອຫຼີກລ່ຽງຂໍ້ຜິດພາດ, ໃຫ້ແນ່ໃຈວ່າທ່ານບໍ່ໄດ້ເປີດ Obsidian vault ຢູ່.",
    },
    github: {
      name: "GitHub Repo",
      description:
        "ນຳເຂົ້າຄັງເກັບໂຄ້ດ (Repository) ຈາກ GitHub ທັງໝົດໃນຄລິກດຽວ.",
      URL: "ລິ້ງ GitHub Repo URL",
      URL_explained: "URL ຂອງ GitHub repo ທີ່ທ່ານຕ້ອງການ.",
      token: "GitHub Access Token",
      optional: "ບໍ່ບັງຄັບ",
      token_explained: "Access Token ເພື່ອປ້ອງກັນການຕິດ Rate limit.",
      token_explained_start: "ຖ້າບໍ່ມີ ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle:
        ", GitHub API ອາດຈະຈຳກັດຈຳນວນໄຟລ໌ທີ່ສາມາດດຶງໄດ້. ທ່ານສາມາດ ",
      token_explained_link2: "ສ້າງ Access Token ຊົ່ວຄາວ",
      token_explained_end: " ເພື່ອຫຼີກລ່ຽງບັນຫານີ້.",
      ignores: "ໄຟລ໌ທີ່ໃຫ້ຂ້າມ",
      git_ignore:
        "ລາຍຊື່ໄຟລ໌ທີ່ບໍ່ຕ້ອງການໃນຮູບແບບ .gitignore. ກົດ Enter ຫຼັງຈາກປ້ອນແຕ່ລະລາຍການ.",
      task_explained:
        "ເມື່ອສຳເລັດແລ້ວ, ໄຟລ໌ທັງໝົດຈະພ້ອມໃຫ້ເລືອກໃນໜ້າຈັດການເອກະສານ.",
      branch: "Branch ທີ່ຕ້ອງການດຶງຂໍ້ມູນ.",
      branch_loading: "-- ກຳລັງໂຫຼດ branch --",
      branch_explained: "Branch ທີ່ຕ້ອງການດຶງໄຟລ໌.",
      token_information:
        "ຖ້າບໍ່ປ້ອນ <b>GitHub Access Token</b> ຈະສາມາດດຶງໄດ້ສະເພາະໄຟລ໌ໃນ <b>ຊັ້ນເທິງສຸດ</b> ເທົ່ານັ້ນ.",
      token_personal: "ສ້າງ Personal Access Token ຟຣີໄດ້ທີ່ນີ້.",
    },
    gitlab: {
      name: "GitLab Repo",
      description: "ນຳເຂົ້າ Repository ຈາກ GitLab ທັງໝົດໃນຄລິກດຽວ.",
      URL: "GitLab Repo URL",
      URL_explained: "URL ຂອງ GitLab repo.",
      token: "GitLab Access Token",
      optional: "ບໍ່ບັງຄັບ",
      token_description: "ເລືອກຂໍ້ມູນເພີ່ມເຕີມທີ່ຈະດຶງຈາກ GitLab API.",
      token_explained_start: "ຖ້າບໍ່ມີ ",
      token_explained_link1: "Personal Access Token",
      token_explained_middle: ", GitLab API ອາດຈະຈຳກັດການດຶງຂໍ້ມູນ. ທ່ານສາມາດ ",
      token_explained_link2: "ສ້າງ Access Token ຊົ່ວຄາວ",
      token_explained_end: " ໄດ້.",
      fetch_issues: "ດຶງຂໍ້ມູນ Issues ມາເປັນເອກະສານ",
      ignores: "ໄຟລ໌ທີ່ໃຫ້ຂ້າມ",
      git_ignore: "ລາຍຊື່ໃນຮູບແບບ .gitignore. ກົດ Enter ຫຼັງຈາກແຕ່ລະລາຍການ.",
      task_explained: "ເມື່ອສຳເລັດ, ໄຟລ໌ຈະພ້ອມໃຫ້ໃຊ້ໃນພື້ນທີ່ເຮັດວຽກ.",
      branch: "Branch ທີ່ຕ້ອງການດຶງໄຟລ໌",
      branch_loading: "-- ກຳລັງໂຫຼດ branch --",
      branch_explained: "Branch ທີ່ຕ້ອງການດຶງຂໍ້ມູນ.",
      token_information:
        "ຖ້າບໍ່ມີ <b>GitLab Access Token</b> ຈະດຶງໄດ້ສະເພາະໄຟລ໌ <b>ຊັ້ນເທິງສຸດ</b>.",
      token_personal: "ສ້າງ Personal Access Token ຟຣີໄດ້ທີ່ນີ້.",
    },
    youtube: {
      name: "YouTube Transcript",
      description: "ນຳເຂົ້າຄຳບັນຍາຍ (Transcript) ຈາກວິດີໂອ YouTube ດ້ວຍລິ້ງ.",
      URL: "ລິ້ງວິດີໂອ YouTube",
      URL_explained_start:
        "ປ້ອນ URL ວິດີໂອ YouTube ເພື່ອດຶງຄຳບັນຍາຍ. ວິດີໂອຕ້ອງມີ ",
      URL_explained_link: "Closed Captions",
      URL_explained_end: " ໃຫ້ບໍລິການ.",
      task_explained: "ເມື່ອສຳເລັດ, ຄຳບັນຍາຍຈະພ້ອມໃຫ້ໃຊ້ງານ.",
    },
    "website-depth": {
      name: "ດຶງຂໍ້ມູນເວັບໄຊຫຼາຍລິ້ງ (Bulk Link Scraper)",
      description: "ດຶງຂໍ້ມູນຈາກເວັບໄຊ ແລະ ລິ້ງຍ່ອຍຕາມຄວາມເລິກທີ່ກຳນົດ.",
      URL: "URL ຂອງເວັບໄຊ",
      URL_explained: "URL ເວັບໄຊທີ່ຕ້ອງການດຶງຂໍ້ມູນ.",
      depth: "ຄວາມເລິກໃນການດຶງ (Crawl Depth)",
      depth_explained: "ຈຳນວນລິ້ງລູກທີ່ຈະຕິດຕາມຈາກ URL ຕົ້ນທາງ.",
      max_pages: "ຈຳນວນໜ້າສູງສຸດ",
      max_pages_explained: "ຈຳນວນລິ້ງສູງສຸດທີ່ຈະດຶງຂໍ້ມູນ.",
      task_explained: "ເມື່ອສຳເລັດ, ເນື້ອຫາທັງໝົດຈະພ້ອມໃຫ້ໃຊ້ງານ.",
    },
    confluence: {
      name: "Confluence",
      description: "ນຳເຂົ້າໜ້າ Confluence ທັງໝົດໃນຄລິກດຽວ.",
      deployment_type: "ປະເພດການຕິດຕັ້ງ Confluence",
      deployment_type_explained:
        "ເລືອກວ່າ Confluence ຂອງທ່ານເປັນແບບ Cloud ຫຼື ຕິດຕັ້ງເອງ (Self-hosted).",
      base_url: "Confluence Base URL",
      base_url_explained: "URL ຫຼັກຂອງ Confluence ຂອງທ່ານ.",
      space_key: "Confluence Space Key",
      space_key_explained: "Space key ທີ່ຈະໃຊ້. ປົກກະຕິຈະເລີ່ມດ້ວຍ ~",
      username: "ຊື່ຜູ້ໃຊ້ Confluence",
      username_explained: "ຊື່ຜູ້ໃຊ້ຂອງທ່ານ",
      auth_type: "ປະເພດການຢືນຢັນຕົວຕົນ",
      auth_type_explained: "ເລືອກວິທີເຂົ້າເຖິງໜ້າ Confluence.",
      auth_type_username: "ຊື່ຜູ້ໃຊ້ ແລະ Access Token",
      auth_type_personal: "Personal Access Token",
      token: "Confluence Access Token",
      token_explained_start: "ທ່ານຕ້ອງໃຫ້ Access token. ສາມາດສ້າງໄດ້",
      token_explained_link: "ທີ່ນີ້",
      token_desc: "Access token ສຳລັບການຢືນຢັນຕົວຕົນ",
      pat_token: "Confluence Personal Access Token",
      pat_token_explained: "Personal access token ຂອງທ່ານ.",
      bypass_ssl: "ຂ້າມການກວດສອບ SSL Certificate",
      bypass_ssl_explained:
        "ເປີດໃຊ້ເພື່ອຂ້າມການກວດສອບ SSL ສຳລັບເຊີບເວີທີ່ຕິດຕັ້ງເອງ.",
      task_explained: "ເມື່ອສຳເລັດ, ເນື້ອຫາຈະພ້ອມໃຫ້ໃຊ້ງານ.",
    },
    manage: {
      documents: "ເອກະສານ",
      "data-connectors": "ຕົວເຊື່ອມຕໍ່ຂໍ້ມູນ",
      "desktop-only":
        "ການແກ້ໄຂການຕັ້ງຄ່າເຫຼົ່ານີ້ສາມາດເຮັດໄດ້ໃນຄອມພິວເຕີເທົ່ານັ້ນ.",
      dismiss: "ຍົກເລີກ",
      editing: "ກຳລັງແກ້ໄຂ",
    },
    directory: {
      "my-documents": "ເອກະສານຂອງຂ້ອຍ",
      "new-folder": "ໂຟນເດີໃໝ່",
      "total-documents_one": "{{count}} ເອກະສານ",
      "total-documents_other": "{{count}} ເອກະສານ",
      "search-document": "ຄົ້ນຫາເອກະສານ",
      "no-documents": "ບໍ່ມີເອກະສານ",
      "move-workspace": "ຍ້າຍໄປພື້ນທີ່ເຮັດວຽກ",
      "delete-confirmation":
        "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໄຟລ໌ ແລະ ໂຟນເດີເຫຼົ່ານີ້?\nສິ່ງນີ້ຈະເອົາໄຟລ໌ອອກຈາກລະບົບ ແລະ ພື້ນທີ່ເຮັດວຽກທັງໝົດໂດຍອັດຕະໂນມັດ.\nການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.",
      "removing-message":
        "ກຳລັງລຶບ {{count}} ເອກະສານ ແລະ {{folderCount}} ໂຟນເດີ. ກະລຸນາລໍຖ້າ.",
      "move-success": "ຍ້າຍ {{count}} ເອກະສານສຳເລັດແລ້ວ.",
      no_docs: "ບໍ່ມີເອກະສານ",
      select_all: "ເລືອກທັງໝົດ",
      deselect_all: "ຍົກເລີກການເລືອກ",
      remove_selected: "ລຶບລາຍການທີ່ເລືອກ",
      save_embed: "ບັນທຶກ ແລະ ຝັງ (Embed)",
    },
    upload: {
      "processor-offline": "ຕົວປະມວນຜົນເອກະສານບໍ່ພ້ອມໃຊ້ງານ",
      "processor-offline-desc":
        "ບໍ່ສາມາດອັບໂຫຼດໄຟລ໌ໄດ້ໃນຕອນນີ້ ເພາະຕົວປະມວນຜົນອອບລາຍຢູ່. ກະລຸນາລອງໃໝ່ພາຍຫຼັງ.",
      "click-upload": "ຄລິກເພື່ອອັບໂຫຼດ ຫຼື ລາກໄຟລ໌ມາທີ່ນີ້",
      "file-types": "ຮອງຮັບໄຟລ໌ຂໍ້ຄວາມ, csv, ຕາຕະລາງ, ສຽງ ແລະ ອື່ນໆ!",
      "or-submit-link": "ຫຼື ສົ່ງລິ້ງ",
      "placeholder-link": "https://example.com",
      fetching: "ກຳລັງດຶງຂໍ້ມູນ...",
      "fetch-website": "ດຶງຂໍ້ມູນເວັບໄຊ",
      "privacy-notice":
        "ໄຟລ໌ເຫຼົ່ານີ້ຈະຖືກອັບໂຫຼດໄປທີ່ຕົວປະມວນຜົນໃນ AnythingLLM ນີ້. ຂໍ້ມູນຈະບໍ່ຖືກສົ່ງໃຫ້ບຸກຄົນພາຍນອກ.",
    },
    pinning: {
      what_pinning: "ການປັກໝຸດເອກະສານແມ່ນຫຍັງ?",
      pin_explained_block1:
        "ເມື່ອທ່ານ <b>ປັກໝຸດ</b> ເອກະສານໃນ AnythingLLM ພວກເຮົາຈະໃສ່ເນື້ອຫາທັງໝົດຂອງເອກະສານເຂົ້າໃນ prompt ເພື່ອໃຫ້ LLM ເຂົ້າໃຈໄດ້ຢ່າງຄົບຖ້ວນ.",
      pin_explained_block2:
        "ສິ່ງນີ້ຈະເຮັດວຽກໄດ້ດີທີ່ສຸດກັບ <b>ແບບຈຳລອງທີ່ມີ context ຂະໜາດໃຫຍ່</b> ຫຼື ໄຟລ໌ນ້ອຍໆທີ່ສຳຄັນ.",
      pin_explained_block3:
        "ຖ້າທ່ານບໍ່ໄດ້ຄຳຕອບທີ່ພໍໃຈ ການປັກໝຸດແມ່ນວິທີທີ່ດີໃນການເພີ່ມຄຸນນະພາບຄຳຕອບ.",
      accept: "ຕົກລົງ, ເຂົ້າໃຈແລ້ວ",
    },
    watching: {
      what_watching: "ການຕິດຕາມ (Watch) ເອກະສານເຮັດຫຍັງໄດ້?",
      watch_explained_block1:
        "ເມື່ອທ່ານ <b>ຕິດຕາມ</b> ເອກະສານ ພວກເຮົາຈະ <i>ຊິ້ງ</i> ເນື້ອຫາຈາກແຫຼ່ງຕົ້ນສະບັບໂດຍອັດຕະໂນມັດຕາມໄລຍະເວລາ. ສິ່ງນີ້ຈະອັບເດດເນື້ອຫາໃນທຸກພື້ນທີ່ເຮັດວຽກທີ່ໃຊ້ໄຟລ໌ນີ້.",
      watch_explained_block2:
        "ຟີເຈີນີ້ຮອງຮັບສະເພາະເນື້ອຫາອອນລາຍ ແລະ ບໍ່ຮອງຮັບໄຟລ໌ທີ່ອັບໂຫຼດເອງ.",
      watch_explained_block3_start: "ທ່ານສາມາດຈັດການເອກະສານທີ່ຕິດຕາມໄດ້ຈາກ ",
      watch_explained_block3_link: "File manager",
      watch_explained_block3_end: " ໃນໜ້າຜູ້ດູແລ.",
      accept: "ຕົກລົງ, ເຂົ້າໃຈແລ້ວ",
    },
  },
  chat_window: {
    attachments_processing: "ກຳລັງປະມວນຜົນໄຟລ໌ແນບ. ກະລຸນາລໍຖ້າ...",
    send_message: "ສົ່ງຂໍ້ຄວາມ",
    attach_file: "ແນບໄຟລ໌ໃນແຊັດນີ້",
    text_size: "ປ່ຽນຂະໜາດຕົວອັກສອນ.",
    export: "ສົ່ງອອກແຊັດເປັນ...",
    exporting: "ກຳລັງສົ່ງອອກ...",
    microphone: "ເວົ້າເພື່ອປ້ອນຄຳສັ່ງ.",
    stt_unsupported: "ບຣາວເຊີນີ້ບໍ່ຮອງຮັບການເຂົ້າເຖິງໄມໂຄຣໂຟນ.",
    stt_mic_denied: "ບໍ່ສາມາດເຂົ້າເຖິງໄມໂຄຣໂຟນໄດ້. ກະລຸນາອະນຸຍາດແລ້ວລອງໃໝ່.",
    stt_transcription_failed: "ການຖອດຂໍ້ຄວາມຜິດພາດ: {{error}}",
    send: "ສົ່ງຄຳສັ່ງໄປຫາພື້ນທີ່ເຮັດວຽກ",
    tts_speak_message: "ໃຫ້ TTS ເວົ້າຂໍ້ຄວາມ",
    copy: "ກັອບປີ້",
    regenerate: "ສ້າງໃໝ່",
    regenerate_response: "ສ້າງຄຳຕອບໃໝ່",
    good_response: "ຄຳຕອບທີ່ດີ",
    more_actions: "ການດຳເນີນການເພີ່ມເຕີມ",
    sources: "ແຫຼ່ງຂໍ້ມູນ",
    source_count_one: "{{count}} ແຫຼ່ງອ້າງອີງ",
    source_count_other: "{{count}} ແຫຼ່ງອ້າງອີງ",
    document: "ເອກະສານ",
    similarity_match: "ຄ່າຄວາມຄືກັນ",
    fork: "ແຍກ (Fork)",
    delete: "ລຶບ",
    cancel: "ຍົກເລີກ",
    submit: "ສົ່ງ",
    edit_prompt: "ແກ້ໄຂຄຳສັ່ງ",
    edit_response: "ແກ້ໄຂຄຳຕອບ",
    edit_info_user:
      '"ສົ່ງ" ຈະສ້າງຄຳຕອບ AI ໃໝ່. "ບັນທຶກ" ຈະອັບເດດສະເພາະຂໍ້ຄວາມຂອງທ່ານ.',
    edit_info_assistant: "ການປ່ຽນແປງຂອງທ່ານຈະຖືກບັນທຶກເຂົ້າໃນຄຳຕອບນີ້ໂດຍກົງ.",
    see_less: "ເບິ່ງໜ້ອຍລົງ",
    see_more: "ເບິ່ງເພີ່ມເຕີມ",
    preset_reset_description: "ລ້າງປະຫວັດການແຊັດ ແລະ ເລີ່ມການສົນທະນາໃໝ່",
    add_new_preset: " ເພີ່ມ Preset ໃໝ່",
    add_new: "ເພີ່ມໃໝ່",
    edit: "ແກ້ໄຂ",
    publish: "ເຜີຍແຜ່",
    stop_generating: "ຢຸດສ້າງຄຳຕອບ",
    command: "ຄຳສັ່ງ",
    your_command: "ຄຳສັ່ງຂອງທ່ານ",
    placeholder_prompt: "ນີ້ແມ່ນເນື້ອຫາທີ່ຈະຖືກໃສ່ໄວ້ທາງໜ້າຄຳສັ່ງຂອງທ່ານ.",
    description: "ຄຳອະທິບາຍ",
    placeholder_description: "ຕອບກັບດ້ວຍບົດກອນກ່ຽວກັບ LLM.",
    save: "ບັນທຶກ",
    small: "ນ້ອຍ",
    normal: "ປົກກະຕິ",
    large: "ໃຫຍ່",
    tools: "ເຄື່ອງມື",
    text_size_label: "ຂະໜາດຕົວອັກສອນ",
    select_model: "ເລືອກແບບຈຳລອງ",
    slash_commands: "ຄຳສັ່ງ Slash",
    agent_skills: "ທັກສະເອເຈນ",
    manage_agent_skills: "ຈັດການທັກສະເອເຈນ",
    app_integrations: "ການເຊື່ອມຕໍ່ແອັບ",
    custom_skills: "ທັກສະທີ່ປັບແຕ່ງເອງ",
    agent_flows: "Agent Flows",
    sub_skills: "ທັກສະຍ່ອຍ",
    no_tools_found: "ບໍ່ພົບເຄື່ອງມືທີ່ກົງກັນ",
    loading_mcp_servers: "ກຳລັງໂຫຼດເຊີບເວີ MCP...",
    start_agent_session: "ເລີ່ມ Agent Session",
    agent_skills_disabled_in_session:
      "ບໍ່ສາມາດແກ້ໄຂທັກສະໄດ້ໃນຂະນະທີ່ເອເຈນກຳລັງເຮັດວຽກ. ໃຊ້ /exit ເພື່ອຈົບກ່ອນ.",
    use_agent_session_to_use_tools:
      "ທ່ານສາມາດໃຊ້ເຄື່ອງມືໃນແຊັດໄດ້ໂດຍການເລີ່ມຕົ້ນດ້ວຍ '@agent' ທາງໜ້າຄຳສັ່ງ.",
    workspace_llm_manager: {
      search: "ຄົ້ນຫາ",
      loading_workspace_settings: "ກຳລັງໂຫຼດການຕັ້ງຄ່າ...",
      available_models: "ແບບຈຳລອງທີ່ມີສຳລັບ {{provider}}",
      available_models_description: "ເລືອກແບບຈຳລອງທີ່ຈະໃຊ້ໃນພື້ນທີ່ນີ້.",
      save: "ໃຊ້ແບບຈຳລອງນີ້",
      saving: "ກຳລັງຕັ້ງຄ່າແບບຈຳລອງຫຼັກ...",
      missing_credentials: "ຜູ້ໃຫ້ບໍລິການນີ້ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ!",
      missing_credentials_description: "ຕັ້ງຄ່າດຽວນີ້",
    },
    agent_invocation: {
      model_wants_to_call: "ແບບຈຳລອງຕ້ອງການເອີ້ນໃຊ້",
      approve: "ອະນຸມັດ",
      reject: "ປະຕິເສດ",
      always_allow: "ອະນຸຍາດ {{skillName}} ສະເໝີ",
      tool_call_was_approved: "ອະນຸມັດການໃຊ້ເຄື່ອງມືແລ້ວ",
      tool_call_was_rejected: "ປະຕິເສດການໃຊ້ເຄື່ອງມືແລ້ວ",
      clarifying_skip: "ໃຫ້ເອເຈນຕັດສິນໃຈ",
      clarifying_submit: "ສົ່ງ",
      clarifying_skipped: "ທ່ານໃຫ້ເອເຈນຕັດສິນໃຈ.",
      clarifying_timeout: "ບໍ່ມີການຕອບກັບໃນເວລາທີ່ກຳນົດ.",
      clarifying_pagination: "{{current}} ຈາກ {{total}}",
      clarifying_prev_aria: "ຄຳຖາມກ່ອນໜ້າ",
      clarifying_next_aria: "ຄຳຖາມຖັດໄປ",
      clarifying_close_aria: "ປິດ ແລະ ຂ້າມ",
      clarifying_other: "ອື່ນໆ",
      clarifying_other_placeholder: "ພິມຄຳຕອບຂອງທ່ານ",
      batch_progress: "ຕອບແລ້ວ {{answered}} ຈາກ {{total}}",
      batch_skip_this: "ຂ້າມ",
      batch_submit_all: "ສົ່ງທັງໝົດ",
      batch_next: "ຖັດໄປ",
      answer_skipped: "[ຜູ້ໃຊ້ຂ້າມ]",
    },
    memories: {
      title: "ຄວາມຈຳ (Memories)",
      empty:
        "ຍັງບໍ່ມີຄວາມຈຳ. ເມື່ອທ່ານສົນທະນາກັບ AI ຫຼາຍຂຶ້ນ ຄວາມຈຳຈະຖືກບັນທຶກ ຫຼື",
      empty_cta: "ສ້າງຄວາມຈຳໃໝ່",
      tab_workspace: "ພື້ນທີ່ເຮັດວຽກ",
      tab_global: "ທົ່ວໂລກ",
      toggle: {
        label: "ເປີດໃຊ້ການປັບແຕ່ງສ່ວນຕົວ",
        description:
          "ໃຫ້ເອເຈນຈື່ຂໍ້ເທັດຈິງກ່ຽວກັບທ່ານ ຫຼື ພື້ນທີ່ນີ້ເພື່ອໃຊ້ໃນການສົນທະນາ",
      },
      auto_extraction: {
        label: "ຄວາມຈຳອັດຕະໂນມັດ",
        description: "ໃຫ້ເອເຈນສ້າງຄວາມຈຳໂດຍອັດຕະໂນມັດໃນເບື້ອງຫຼັງ",
      },
      menu: {
        edit: "ແກ້ໄຂ",
        delete: "ລຶບ",
        move_to_global: "ຍ້າຍໄປສ່ວນທົ່ວໂລກ",
        move_to_workspace: "ຍ້າຍໄປສ່ວນພື້ນທີ່ເຮັດວຽກ",
      },
      modal: {
        create_title: "ສ້າງຄວາມຈຳ",
        edit_title: "ແກ້ໄຂຄວາມຈຳ",
        create_description:
          'ຄວາມຈຳຄວນເປັນຂໍ້ຄວາມສັ້ນໆ ເຊັ່ນ: "ຜູ້ໃຊ້ມັກ Python ຫຼາຍກວ່າ JavaScript"',
        edit_description: "ອັບເດດເນື້ອຫາຄວາມຈຳນີ້.",
        label: "ຄວາມຈຳ",
        placeholder:
          "ເຊັ່ນ: ຜູ້ໃຊ້ຊື່ ສົມໄຊ, ຜູ້ໃຊ້ເຮັດວຽກກ່ຽວກັບ AnythingLLM, ແລະ ອື່ນໆ.",
        create: "ສ້າງ",
        save: "ບັນທຶກ",
        cancel: "ຍົກເລີກ",
      },
    },
  },
  profile_settings: {
    edit_account: "ແກ້ໄຂບັນຊີ",
    profile_picture: "ຮູບໂປຣໄຟລ໌",
    remove_profile_picture: "ເອົາຮູບໂປຣໄຟລ໌ອອກ",
    username: "ຊື່ຜູ້ໃຊ້",
    new_password: "ລະຫັດຜ່ານໃໝ່",
    password_description: "ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 8 ຕົວອັກສອນ",
    cancel: "ຍົກເລີກ",
    update_account: "ອັບເດດບັນຊີ",
    theme: "ທີມທີ່ຕ້ອງການ",
    language: "ພາສາທີ່ຕ້ອງການ",
    failed_upload: "ອັບໂຫຼດຮູບບໍ່ສຳເລັດ: {{error}}",
    upload_success: "ອັບໂຫຼດຮູບໂປຣໄຟລ໌ແລ້ວ.",
    failed_remove: "ເອົາຮູບອອກບໍ່ສຳເລັດ: {{error}}",
    profile_updated: "ອັບເດດໂປຣໄຟລ໌ແລ້ວ.",
    failed_update_user: "ອັບເດດຜູ້ໃຊ້ບໍ່ສຳເລັດ: {{error}}",
    account: "ບັນຊີ",
    support: "ຊ່ວຍເຫຼືອ",
    signout: "ອອກຈາກລະບົບ",
  },
  "keyboard-shortcuts": {
    title: "ຄີລັດ (Keyboard Shortcuts)",
    shortcuts: {
      settings: "ເປີດການຕັ້ງຄ່າ",
      workspaceSettings: "ເປີດການຕັ້ງຄ່າພື້ນທີ່ປັດຈຸບັນ",
      home: "ໄປໜ້າຫຼັກ",
      workspaces: "ຈັດການພື້ນທີ່ເຮັດວຽກ",
      apiKeys: "ການຕັ້ງຄ່າ API Keys",
      llmPreferences: "ການຕັ້ງຄ່າ LLM",
      chatSettings: "ການຕັ້ງຄ່າການສົນທະນາ",
      help: "ສະແດງວິທີໃຊ້ຄີລັດ",
      showLLMSelector: "ສະແດງຕົວເລືອກ LLM ຂອງພື້ນທີ່",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "ສຳເລັດ!",
        success_description:
          "System Prompt ຂອງທ່ານຖືກເຜີຍແຜ່ໄປທີ່ Community Hub ແລ້ວ!",
        success_thank_you: "ຂອບໃຈທີ່ແບ່ງປັນໃຫ້ຊຸມຊົນ!",
        view_on_hub: "ເບິ່ງໃນ Community Hub",
        modal_title: "ເຜີຍແຜ່ System Prompt",
        name_label: "ຊື່",
        name_description: "ຊື່ທີ່ຈະສະແດງຂອງ system prompt ຂອງທ່ານ.",
        name_placeholder: "System Prompt ຂອງຂ້ອຍ",
        description_label: "ຄຳອະທິບາຍ",
        description_description: "ອະທິບາຍຈຸດປະສົງຂອງ system prompt ນີ້.",
        tags_label: "ແທັກ (Tags)",
        tags_description:
          "ໃຊ້ເພື່ອຊ່ວຍໃນການຄົ້ນຫາ. ເພີ່ມໄດ້ສູງສຸດ 5 ແທັກ. ແທັກລະບໍ່ເກີນ 20 ຕົວອັກສອນ.",
        tags_placeholder: "ພິມແລ້ວກົດ Enter ເພື່ອເພີ່ມ",
        visibility_label: "ຄວາມເປັນສ່ວນຕົວ",
        public_description: "ສາທາລະນະ (ທຸກຄົນເຫັນໄດ້).",
        private_description: "ສ່ວນຕົວ (ເຫັນສະເພາະທ່ານ).",
        publish_button: "ເຜີຍແຜ່ໄປທີ່ Community Hub",
        submitting: "ກຳລັງເຜີຍແຜ່...",
        prompt_label: "Prompt",
        prompt_description: "ນີ້ແມ່ນ system prompt ຕົວຈິງທີ່ຈະໃຊ້ແນະນຳ LLM.",
        prompt_placeholder: "ປ້ອນ system prompt ຂອງທ່ານທີ່ນີ້...",
      },
      agent_flow: {
        success_title: "ສຳເລັດ!",
        success_description: "Agent Flow ຂອງທ່ານຖືກເຜີຍແຜ່ແລ້ວ!",
        success_thank_you: "ຂອບໃຈທີ່ແບ່ງປັນ!",
        view_on_hub: "ເບິ່ງໃນ Community Hub",
        modal_title: "ເຜີຍແຜ່ Agent Flow",
        name_label: "ຊື່",
        name_description: "ຊື່ທີ່ສະແດງຂອງ agent flow.",
        name_placeholder: "Agent Flow ຂອງຂ້ອຍ",
        description_label: "ຄຳອະທິບາຍ",
        description_description: "ອະທິບາຍຈຸດປະສົງຂອງ flow ນີ້.",
        tags_label: "ແທັກ",
        tags_description: "ເພີ່ມໄດ້ສູງສຸດ 5 ແທັກ.",
        tags_placeholder: "ພິມແລ້ວກົດ Enter",
        visibility_label: "ຄວາມເປັນສ່ວນຕົວ",
        submitting: "ກຳລັງເຜີຍແຜ່...",
        submit: "ເຜີຍແຜ່ໄປທີ່ Community Hub",
        privacy_note:
          "Agent flows ຈະຖືກອັບໂຫຼດເປັນແບບສ່ວນຕົວສະເໝີເພື່ອຄວາມປອດໄພ. ທ່ານສາມາດປ່ຽນເປັນສາທາລະນະໄດ້ໃນພາຍຫຼັງ.",
      },
      slash_command: {
        success_title: "ສຳເລັດ!",
        success_description: "Slash Command ຂອງທ່ານຖືກເຜີຍແຜ່ແລ້ວ!",
        success_thank_you: "ຂອບໃຈທີ່ແບ່ງປັນ!",
        view_on_hub: "ເບິ່ງໃນ Community Hub",
        modal_title: "ເຜີຍແຜ່ Slash Command",
        name_label: "ຊື່",
        name_description: "ຊື່ຂອງ slash command.",
        name_placeholder: "Slash Command ຂອງຂ້ອຍ",
        description_label: "ຄຳອະທິບາຍ",
        description_description: "ອະທິບາຍຈຸດປະສົງ.",
        tags_label: "ແທັກ",
        tags_description: "ເພີ່ມໄດ້ສູງສຸດ 5 ແທັກ.",
        tags_placeholder: "ພິມແລ້ວກົດ Enter",
        visibility_label: "ຄວາມເປັນສ່ວນຕົວ",
        public_description: "ສາທາລະນະ.",
        private_description: "ສ່ວນຕົວ.",
        publish_button: "ເຜີຍແຜ່ໄປທີ່ Community Hub",
        submitting: "ກຳລັງເຜີຍແຜ່...",
        prompt_label: "Prompt",
        prompt_description:
          "ຄຳສັ່ງທີ່ຈະເຮັດວຽກເມື່ອເອີ້ນໃຊ້ slash command ນີ້.",
        prompt_placeholder: "ປ້ອນຄຳສັ່ງທີ່ນີ້...",
      },
      generic: {
        unauthenticated: {
          title: "ຕ້ອງຢືນຢັນຕົວຕົນ",
          description:
            "ທ່ານຕ້ອງເຊື່ອມຕໍ່ກັບ AnythingLLM Community Hub ກ່ອນຈະເຜີຍແຜ່ລາຍການໄດ້.",
          button: "ເຊື່ອມຕໍ່ກັບ Community Hub",
        },
      },
    },
  },
  scheduledJobs: {
    title: "ວຽກທີ່ຕັ້ງເວລາ (Scheduled Jobs)",
    enableNotifications: "ເປີດການແຈ້ງເຕືອນບຣາວເຊີສຳລັບຜົນຂອງວຽກ",
    description:
      "ສ້າງວຽກ AI ທີ່ເຮັດຊ້ຳຕາມກຳນົດເວລາ. ແຕ່ລະວຽກຈະໃຊ້ຄຳສັ່ງພ້ອມເຄື່ອງມືທີ່ເລືອກ ແລະ ບັນທຶກຜົນໄວ້ໃຫ້ກວດສອບ.",
    newJob: "ວຽກໃໝ່",
    loading: "ກຳລັງໂຫຼດ...",
    emptyTitle: "ຍັງບໍ່ມີວຽກທີ່ຕັ້ງເວລາ",
    emptySubtitle: "ສ້າງໃໝ່ເພື່ອເລີ່ມຕົ້ນ.",
    table: {
      name: "ຊື່",
      schedule: "ກຳນົດເວລາ",
      status: "ສະຖານະ",
      lastRun: "ເຮັດວຽກຫຼ້າສຸດ",
      nextRun: "ເຮັດວຽກຄັ້ງຖັດໄປ",
      actions: "ການດຳເນີນການ",
    },
    confirmDelete: "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບວຽກທີ່ຕັ້ງເວລານີ້?",
    status: {
      completed: "ສຳເລັດ",
      failed: "ລົ້ມເຫຼວ",
      timed_out: "ໝົດເວລາ",
      running: "ກຳລັງເຮັດວຽກ",
      queued: "ຢູ່ໃນຄິວ",
    },
    toast: {
      deleted: "ລຶບວຽກແລ້ວ",
      triggered: "ເລີ່ມເຮັດວຽກສຳເລັດ",
      triggerFailed: "ເລີ່ມເຮັດວຽກບໍ່ສຳເລັດ",
      triggerSkipped: "ວຽກກຳລັງເຮັດວຽກຢູ່ແລ້ວ",
      killed: "ຢຸດວຽກສຳເລັດແລ້ວ",
      killFailed: "ຢຸດວຽກບໍ່ສຳເລັດ",
    },
    row: {
      neverRun: "ຍັງບໍ່ເຄີຍເຮັດວຽກ",
      viewRuns: "ເບິ່ງປະຫວັດ",
      runNow: "ເລີ່ມດຽວນີ້",
      enable: "ເປີດໃຊ້",
      disable: "ປິດໃຊ້",
      edit: "ແກ້ໄຂ",
      delete: "ລຶບ",
    },
    modal: {
      titleEdit: "ແກ້ໄຂວຽກທີ່ຕັ້ງເວລາ",
      titleNew: "ວຽກທີ່ຕັ້ງເວລາໃໝ່",
      nameLabel: "ຊື່",
      namePlaceholder: "ເຊັ່ນ: ສະຫຼຸບຂ່າວປະຈຳວັນ",
      promptLabel: "ຄຳສັ່ງ (Prompt)",
      promptPlaceholder: "ຄຳແນະນຳທີ່ຈະໃຫ້ເຮັດວຽກໃນແຕ່ລະຮອບ...",
      scheduleLabel: "ກຳນົດເວລາ",
      modeBuilder: "ຕົວສ້າງ",
      modeCustom: "ກຳນົດເອງ",
      cronPlaceholder: "Cron expression (ເຊັ່ນ: 0 9 * * *)",
      currentSchedule: "ກຳນົດເວລາປັດຈຸບັນ:",
      toolsLabel: "ເຄື່ອງມື (ບໍ່ບັງຄັບ)",
      toolsDescription:
        "ເລືອກເຄື່ອງມືເອເຈນທີ່ຈະໃຫ້ວຽກນີ້ໃຊ້. ຖ້າບໍ່ເລືອກ ວຽກຈະເຮັດວຽກໂດຍບໍ່ມີເຄື່ອງມື.",
      toolsSearch: "ຄົ້ນຫາ",
      toolsNoResults: "ບໍ່ພົບເຄື່ອງມື",
      required: "ຈຳເປັນ",
      requiredFieldsBanner: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບເພື່ອສ້າງວຽກ.",
      cancel: "ຍົກເລີກ",
      saving: "ກຳລັງບັນທຶກ...",
      updateJob: "ອັບເດດວຽກ",
      createJob: "ສ້າງວຽກ",
      jobUpdated: "ອັບເດດວຽກແລ້ວ",
      jobCreated: "ສ້າງວຽກແລ້ວ",
    },
    builder: {
      fallbackWarning:
        "ຮູບແບບນີ້ບໍ່ສາມາດແກ້ໄຂຜ່ານຕົວສ້າງໄດ້. ໃຫ້ປ່ຽນເປັນແບບ 'ກຳນົດເອງ' ຫຼື ປ່ຽນຂໍ້ມູນຂ້າງລຸ່ມເພື່ອຂຽນທັບ.",
      run: "ເຮັດວຽກ",
      frequency: {
        minute: "ທຸກໆນາທີ",
        hour: "ທຸກໆຊົ່ວໂມງ",
        day: "ທຸກໆມື້",
        week: "ທຸກໆອາທິດ",
        month: "ທຸກໆເດືອນ",
      },
      every: "ທຸກໆ",
      minuteOne: "1 ນາທີ",
      minuteOther: "{{count}} ນາທີ",
      atMinute: "ໃນນາທີທີ",
      pastEveryHour: "ຂອງທຸກໆຊົ່ວໂມງ",
      at: "ເວລາ",
      on: "ໃນວັນ",
      onDay: "ໃນວັນທີ",
      ofEveryMonth: "ຂອງທຸກໆເດືອນ",
      weekdays: {
        sun: "ອາທິດ",
        mon: "ຈັນ",
        tue: "ອັງຄານ",
        wed: "ພຸດ",
        thu: "ພະຫັດ",
        fri: "ສຸກ",
        sat: "ເສົາ",
      },
    },
    runHistory: {
      back: "ກັບໄປໜ້າວຽກ",
      title: "ປະຫວັດການເຮັດວຽກ: {{name}}",
      schedule: "ກຳນົດເວລາ:",
      emptyTitle: "ຍັງບໍ່ມີປະຫວັດການເຮັດວຽກ",
      emptySubtitle: "ເລີ່ມວຽກດຽວນີ້ເພື່ອເບິ່ງຜົນ.",
      runNow: "ເລີ່ມດຽວນີ້",
      stopJob: "ຢຸດວຽກ",
      table: {
        status: "ສະຖານະ",
        started: "ເລີ່ມເມື່ອ",
        duration: "ໄລຍະເວລາ",
        error: "ຂໍ້ຜິດພາດ",
      },
    },
    runDetail: {
      loading: "ກຳລັງໂຫຼດລາຍລະອຽດ...",
      notFound: "ບໍ່ພົບປະຫວັດການເຮັດວຽກ.",
      back: "ກັບຄືນ",
      unknownJob: "ວຽກທີ່ບໍ່ຮູ້ຈັກ",
      runHeading: "{{name}} — ຮອບທີ #{{id}}",
      duration: "ໄລຍະເວລາ: {{value}}",
      continueInThread: "ສົນທະນາຕໍ່ໃນແຊັດ",
      creating: "ກຳລັງສ້າງ...",
      threadFailed: "ສ້າງ Thread ບໍ່ສຳເລັດ",
      stopJob: "ຢຸດວຽກ",
      killing: "ກຳລັງຢຸດ...",
      sections: {
        prompt: "ຄຳສັ່ງ",
        error: "ຂໍ້ຜິດພາດ",
        thinking: "ຄວາມຄິດ ({{count}})",
        toolCalls: "ການໃຊ້ເຄື່ອງມື ({{count}})",
        files: "ໄຟລ໌ ({{count}})",
        response: "ຄຳຕອບ",
        metrics: "ສະຖິຕິ",
      },
      metrics: {
        promptTokens: "Prompt tokens:",
        completionTokens: "Completion tokens:",
      },
    },
    toolCall: {
      arguments: "ອາຄິວເມນ:",
      showResult: "ສະແດງຜົນ",
      hideResult: "ເຊື່ອງຜົນ",
    },
    file: {
      unknown: "ໄຟລ໌ທີ່ບໍ່ຮູ້ຈັກ",
      download: "ດາວໂຫຼດ",
      downloadFailed: "ດາວໂຫຼດໄຟລ໌ບໍ່ສຳເລັດ",
      types: {
        powerpoint: "PowerPoint",
        pdf: "ເອກະສານ PDF",
        word: "ເອກະສານ Word",
        spreadsheet: "ຕາຕະລາງ (Spreadsheet)",
        generic: "ໄຟລ໌",
      },
    },
  },
};

export default TRANSLATIONS;
