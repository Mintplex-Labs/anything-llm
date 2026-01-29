// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: "E-posta adresiniz nedir?",
      useCase: "AnythingLLM'yi ne için kullanacaksınız?",
      useCaseWork: "İş için",
      useCasePersonal: "Kişisel kullanım için",
      useCaseOther: "Diğer",
      comment: "AnythingLLM'yi nasıl duydunuz?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube vb. - Bizi nasıl buldunuz?",
      skip: "Anketi Atla",
      thankYou: "Geri bildiriminiz için teşekkür ederiz!",
      title: "AnythingLLM'ye Hoş Geldiniz",
      description:
        "AnythingLLM'yi ihtiyaçlarınıza göre oluşturmamıza yardımcı olun. İsteğe bağlı.",
    },
    home: {
      title: "Hoş Geldiniz",
      getStarted: "Başla",
    },
    llm: {
      title: "LLM Tercihi",
      description:
        "AnythingLLM birçok LLM sağlayıcısıyla çalışabilir. Bu, sohbeti yöneten hizmet olacaktır.",
    },
    userSetup: {
      title: "Kullanıcı Kurulumu",
      description: "Kullanıcı ayarlarınızı yapılandırın.",
      howManyUsers: "Bu örneği kaç kişi kullanacak?",
      justMe: "Sadece ben",
      myTeam: "Ekibim",
      instancePassword: "Örnek Şifresi",
      setPassword: "Bir şifre belirlemek ister misiniz?",
      passwordReq: "Şifreler en az 8 karakter olmalıdır.",
      passwordWarn:
        "Kurtarma yöntemi olmadığı için bu şifreyi kaydetmeniz önemlidir.",
      adminUsername: "Yönetici hesap kullanıcı adı",
      adminPassword: "Yönetici hesap şifresi",
      adminPasswordReq: "Şifreler en az 8 karakter olmalıdır.",
      teamHint:
        "Varsayılan olarak tek yönetici siz olacaksınız. Kurulum tamamlandığında, diğer kişileri kullanıcı veya yönetici olarak davet edebilirsiniz. Yalnızca yöneticiler şifreleri sıfırlayabildiğinden şifrenizi kaybetmeyin.",
    },
    data: {
      title: "Veri İşleme & Gizlilik",
      description:
        "Kişisel verileriniz konusunda şeffaflık ve kontrol sağlamaya kararlıyız.",
      settingsHint:
        "Bu ayarlar istediğiniz zaman ayarlardan yeniden yapılandırılabilir.",
    },
    workspace: {
      title: "İlk çalışma alanınızı oluşturun",
      description:
        "İlk çalışma alanınızı oluşturun ve AnythingLLM ile başlayın.",
    },
  },
  common: {
    "workspaces-name": "Çalışma Alanları Adı",
    error: "hata",
    success: "başarı",
    user: "Kullanıcı",
    selection: "Model Seçimi",
    saving: "Kaydediliyor...",
    save: "Değişiklikleri Kaydet",
    previous: "Önceki Sayfa",
    next: "Sonraki Sayfa",
    optional: "İsteğe bağlı",
    yes: "Evet",
    no: "Hayır",
    search: "Ara",
    username_requirements:
      "Kullanıcı adı 2-32 karakter uzunluğunda olmalı, küçük harfle başlamalı ve yalnızca küçük harfler, rakamlar, alt çizgiler, tireler ve noktalar içermelidir.",
  },
  settings: {
    title: "Instance Ayarları",
    system: "Genel Ayarlar",
    invites: "Davetler",
    users: "Kullanıcılar",
    workspaces: "Çalışma Alanları",
    "workspace-chats": "Çalışma Alanı Sohbetleri",
    customization: "Özelleştirme",
    "api-keys": "Geliştirici API",
    llm: "LLM",
    transcription: "Transkripsiyon",
    embedder: "Gömme Aracı",
    "text-splitting": "Metin Bölme & Parçalama",
    "voice-speech": "Ses & Konuşma",
    "vector-database": "Vektör Veritabanı",
    embeds: "Sohbet Gömme",
    "embed-chats": "Gömme Sohbet Geçmişi",
    security: "Güvenlik",
    "event-logs": "Olay Kayıtları",
    privacy: "Gizlilik & Veri",
    "ai-providers": "Yapay Zeka Sağlayıcıları",
    "agent-skills": "Ajan Becerileri",
    admin: "Yönetici",
    tools: "Araçlar",
    "experimental-features": "Deneysel Özellikler",
    contact: "Destekle İletişime Geçin",
    "browser-extension": "Tarayıcı Uzantısı",
    "system-prompt-variables": "Sistem Prompt Değişkenleri",
    interface: "Arayüz Tercihleri",
    branding: "Marka & Beyaz Etiketleme",
    chat: "Sohbet",
    "mobile-app": "AnythingLLM Mobil",
  },
  login: {
    "multi-user": {
      welcome: "Hoş geldiniz",
      "placeholder-username": "Kullanıcı Adı",
      "placeholder-password": "Şifre",
      login: "Giriş Yap",
      validating: "Doğrulanıyor...",
      "forgot-pass": "Şifremi Unuttum",
      reset: "Sıfırla",
    },
    "sign-in": "{{appName}} hesabınıza giriş yapın.",
    "password-reset": {
      title: "Şifre Sıfırlama",
      description: "Şifrenizi sıfırlamak için gerekli bilgileri aşağıya girin.",
      "recovery-codes": "Kurtarma Kodları",
      "recovery-code": "Kurtarma Kodu {{index}}",
      "back-to-login": "Girişe Geri Dön",
    },
  },
  "new-workspace": {
    title: "Yeni Çalışma Alanı",
    placeholder: "Benim Çalışma Alanım",
  },
  "workspaces—settings": {
    general: "Genel Ayarlar",
    chat: "Sohbet Ayarları",
    vector: "Vektör Veritabanı",
    members: "Üyeler",
    agent: "Ajan Yapılandırması",
  },
  general: {
    vector: {
      title: "Vektör Sayısı",
      description: "Vektör veritabanınızdaki toplam vektör sayısı.",
    },
    names: {
      description:
        "Bu, yalnızca çalışma alanınızın görüntü adını değiştirecektir.",
    },
    message: {
      title: "Önerilen Sohbet Mesajları",
      description:
        "Çalışma alanı kullanıcılarınıza önerilecek sohbet mesajlarını özelleştirin.",
      add: "Yeni mesaj ekle",
      save: "Mesajları Kaydet",
      heading: "Bana açıkla",
      body: "AnythingLLM'nin faydalarını",
    },
    pfp: {
      title: "Asistan Profil Görseli",
      description:
        "Bu çalışma alanı için asistanın profil resmini özelleştirin.",
      image: "Çalışma Alanı Görseli",
      remove: "Çalışma Alanı Görselini Kaldır",
    },
    delete: {
      title: "Çalışma Alanını Sil",
      description:
        "Bu çalışma alanını ve tüm verilerini silin. Bu işlem, çalışma alanını tüm kullanıcılar için silecektir.",
      delete: "Çalışma Alanını Sil",
      deleting: "Çalışma Alanı Siliniyor...",
      "confirm-start": "Tüm çalışma alanınızı silmek üzeresiniz",
      "confirm-end":
        ". Bu, vektör veritabanınızdaki tüm vektör gömme verilerini kaldıracaktır.\n\nOrijinal kaynak dosyalar etkilenmeyecektir. Bu işlem geri alınamaz.",
    },
  },
  chat: {
    llm: {
      title: "Çalışma Alanı LLM Sağlayıcısı",
      description:
        "Bu çalışma alanı için kullanılacak belirli LLM sağlayıcısı ve modeli. Varsayılan olarak sistem LLM sağlayıcısı ve ayarları kullanılır.",
      search: "Tüm LLM sağlayıcılarını ara",
    },
    model: {
      title: "Çalışma Alanı Sohbet Modeli",
      description:
        "Bu çalışma alanı için kullanılacak belirli sohbet modeli. Boş bırakılırsa, sistem LLM tercihi kullanılacaktır.",
      wait: "-- modeller bekleniyor --",
    },
    mode: {
      title: "Sohbet Modu",
      chat: {
        title: "Sohbet",
        "desc-start": "LLM'nin genel bilgisiyle yanıtlar sunar",
        and: "ve",
        "desc-end": "bulunan belge bağlamını ekler.",
      },
      query: {
        title: "Sorgu",
        "desc-start": "yanıtları",
        only: "sadece",
        "desc-end": "belge bağlamı bulunduğunda sunar.",
      },
    },
    history: {
      title: "Sohbet Geçmişi",
      "desc-start":
        "Yanıta dahil edilecek önceki sohbetlerin sayısı (kısa süreli hafıza).",
      recommend: "20 önerilir. ",
      "desc-end":
        "45'ten fazlası, mesaj boyutuna göre sürekli sohbet hatalarına yol açabilir.",
    },
    prompt: {
      title: "Komut (Prompt)",
      description:
        "Bu çalışma alanında kullanılacak komut. Yapay zekanın yanıt üretmesi için bağlam ve talimatları tanımlayın. Uygun ve doğru yanıtlar almak için özenle hazırlanmış bir komut sağlamalısınız.",
      history: {
        title: "Sistem Prompt Geçmişi",
        clearAll: "Tümünü Temizle",
        noHistory: "Sistem prompt geçmişi mevcut değil",
        restore: "Geri Yükle",
        delete: "Sil",
        deleteConfirm: "Bu geçmiş öğesini silmek istediğinizden emin misiniz?",
        clearAllConfirm:
          "Tüm geçmişi temizlemek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
        expand: "Genişlet",
        publish: "Topluluk Hub'ına Yayınla",
      },
    },
    refusal: {
      title: "Sorgu Modu Ret Yanıtı",
      "desc-start": "Eğer",
      query: "sorgu",
      "desc-end":
        "modunda bağlam bulunamazsa, özel bir ret yanıtı döndürmek isteyebilirsiniz.",
      "tooltip-title": "Bunu neden görüyorum?",
      "tooltip-description":
        "Sorgu modundasınız; bu mod yalnızca belgelerinizdeki bilgileri kullanır. Daha esnek konuşmalar için sohbet moduna geçin veya sohbet modları hakkında daha fazla bilgi edinmek için belgelerimizi ziyaret etmek üzere buraya tıklayın.",
    },
    temperature: {
      title: "LLM Sıcaklığı",
      "desc-start":
        'Bu ayar, LLM yanıtlarının ne kadar "yaratıcı" olacağını kontrol eder.',
      "desc-end":
        "Sayı yükseldikçe yaratıcı yanıtlar artar. Bazı modeller için bu değer çok yüksek ayarlandığında anlamsız yanıtlar ortaya çıkabilir.",
      hint: "Çoğu LLM'in farklı kabul edilebilir değer aralıkları vardır. Ayrıntılar için LLM sağlayıcınıza danışın.",
    },
  },
  "vector-workspace": {
    identifier: "Vektör veritabanı tanımlayıcısı",
    snippets: {
      title: "Maksimum Bağlam Parçacıkları",
      description:
        "Bu ayar, sohbet veya sorgu başına LLM'e gönderilecek maksimum bağlam parçacığı sayısını kontrol eder.",
      recommend: "Önerilen: 4",
    },
    doc: {
      title: "Belge benzerlik eşiği",
      description:
        "Bir kaynağın sohbetle ilişkili sayılabilmesi için gereken minimum benzerlik puanı. Sayı yükseldikçe, kaynağın sohbete benzerliği de o kadar yüksek olmalıdır.",
      zero: "Kısıtlama yok",
      low: "Düşük (benzerlik puanı ≥ .25)",
      medium: "Orta (benzerlik puanı ≥ .50)",
      high: "Yüksek (benzerlik puanı ≥ .75)",
    },
    reset: {
      reset: "Vektör veritabanını sıfırla",
      resetting: "Vektörler temizleniyor...",
      confirm:
        "Bu çalışma alanının vektör veritabanını sıfırlamak üzeresiniz. Bu işlem, hâlihazırda gömülü olan tüm vektör verilerini kaldıracaktır.\n\nOrijinal kaynak dosyalar etkilenmeyecektir. Bu işlem geri alınamaz.",
      error: "Çalışma alanının vektör veritabanı sıfırlanamadı!",
      success: "Çalışma alanının vektör veritabanı sıfırlandı!",
    },
  },
  agent: {
    "performance-warning":
      "Araç çağırmayı açıkça desteklemeyen LLM'lerin performansı, modelin yetenekleri ve doğruluğuna büyük ölçüde bağlıdır. Bazı beceriler kısıtlı veya işlevsiz olabilir.",
    provider: {
      title: "Çalışma Alanı Ajan LLM Sağlayıcısı",
      description:
        "Bu çalışma alanındaki @agent ajanı için kullanılacak spesifik LLM sağlayıcısı ve modeli.",
    },
    mode: {
      chat: {
        title: "Çalışma Alanı Ajan Sohbet Modeli",
        description:
          "Bu çalışma alanındaki @agent ajanı için kullanılacak spesifik sohbet modeli.",
      },
      title: "Çalışma Alanı Ajan Modeli",
      description:
        "Bu çalışma alanındaki @agent ajanı için kullanılacak spesifik LLM modeli.",
      wait: "-- modeller bekleniyor --",
    },
    skill: {
      title: "Varsayılan ajan becerileri",
      description:
        "Varsayılan ajanın doğal yeteneklerini, hazır oluşturulmuş bu becerilerle geliştirin. Bu yapılandırma tüm çalışma alanları için geçerlidir.",
      rag: {
        title: "RAG ve uzun vadeli hafıza",
        description:
          'Ajana, yerel belgelerinizi kullanarak soruları yanıtlatma veya bazı içerikleri "hatırlaması" için uzun vadeli hafıza kullanma izni verin.',
      },
      view: {
        title: "Belgeleri görüntüleme & özetleme",
        description:
          "Ajana, çalışma alanında hâlihazırda gömülü olan dosyaları listeleyip özetleme izni verin.",
      },
      scrape: {
        title: "Web sitelerini tarama",
        description:
          "Ajana, web sitelerini ziyaret edip içeriklerini tarama izni verin.",
      },
      generate: {
        title: "Grafik oluşturma",
        description:
          "Varsayılan ajanın, sağlanan veya sohbette yer alan verilere göre çeşitli grafik türleri oluşturmasına izin verin.",
      },
      save: {
        title: "Tarayıcıya dosya oluştur & kaydet",
        description:
          "Varsayılan ajanın, oluşturduğu dosyaları kaydetmesine ve tarayıcıda indirilebilir hale getirmesine izin verin.",
      },
      web: {
        title: "Canlı web araması ve gezinme",
        "desc-start":
          "Ajanınızın, bir web arama (SERP) sağlayıcısına bağlanarak sorularınızı yanıtlamak için web üzerinde arama yapmasına izin verin.",
        "desc-end":
          "Ajan oturumlarında web araması, bu ayar etkinleştirilene kadar çalışmayacaktır.",
      },
    },
  },
  recorded: {
    title: "Çalışma Alanı Sohbetleri",
    description:
      "Bunlar, kullanıcılar tarafından gönderilen ve oluşturulma tarihlerine göre sıralanan tüm kayıtlı sohbetler ve mesajlardır.",
    export: "Dışa Aktar",
    table: {
      id: "Id",
      by: "Gönderen",
      workspace: "Çalışma Alanı",
      prompt: "Komut (Prompt)",
      response: "Yanıt",
      at: "Gönderilme Zamanı",
    },
  },
  api: {
    title: "API Anahtarları",
    description:
      "API anahtarları, bu AnythingLLM örneğine programatik olarak erişmeye ve yönetmeye olanak tanır.",
    link: "API dokümantasyonunu okuyun",
    generate: "Yeni API Anahtarı Oluştur",
    table: {
      key: "API Anahtarı",
      by: "Oluşturan",
      created: "Oluşturulma Tarihi",
    },
  },
  llm: {
    title: "LLM Tercihi",
    description:
      "Bu, tercih ettiğiniz LLM sohbet ve gömme sağlayıcısının kimlik bilgileri ile ayarlarıdır. Bu anahtarların güncel ve doğru olması önemlidir; aksi takdirde AnythingLLM doğru çalışmayacaktır.",
    provider: "LLM Sağlayıcısı",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Azure Hizmet Uç Noktası",
        api_key: "API Anahtarı",
        chat_deployment_name: "Sohbet Dağıtım Adı",
        chat_model_token_limit: "Sohbet Modeli Token Limiti",
        model_type: "Model Türü",
        default: "Varsayılan",
        reasoning: "Mantıksal",
        model_type_tooltip:
          'Dağıtımınız bir mantıksal model (o1, o1-mini, o3-mini vb.) kullanıyorsa, bunu "Mantıksal" olarak ayarlayın. Aksi takdirde sohbet istekleriniz başarısız olabilir.',
      },
    },
  },
  transcription: {
    title: "Transkripsiyon Model Tercihi",
    description:
      "Bu, tercih ettiğiniz transkripsiyon modeli sağlayıcısının kimlik bilgileri ve ayarlarıdır. Anahtarların güncel ve doğru olması önemlidir; aksi takdirde medya dosyaları ve sesler transkribe edilemez.",
    provider: "Transkripsiyon Sağlayıcısı",
    "warn-start":
      "Sınırlı RAM veya CPU'ya sahip makinelerde yerel Whisper modelini kullanmak, medya dosyalarını işlerken AnythingLLM'nin duraksamasına neden olabilir.",
    "warn-recommend":
      "En az 2GB RAM öneriyoruz ve 10MB üzerinde dosya yüklememeye dikkat edin.",
    "warn-end":
      "Yerleşik model, ilk kullanımda otomatik olarak indirilecektir.",
  },
  embedding: {
    title: "Gömme (Embedding) Tercihi",
    "desc-start":
      "Yerel olarak gömme mekanizmasını desteklemeyen bir LLM kullanıyorsanız, metinleri gömmek için ek kimlik bilgileri girmeniz gerekebilir.",
    "desc-end":
      "Gömme, metni vektörlere dönüştürme sürecidir. Dosyalarınızın ve komutlarınızın işlenebilmesi için AnythingLLM, bu kimlik bilgilerine ihtiyaç duyar.",
    provider: {
      title: "Embedding Sağlayıcısı",
    },
  },
  text: {
    title: "Metin Bölme & Parçalama Tercihleri",
    "desc-start":
      "Bazı durumlarda, yeni belgelerin vektör veritabanınıza eklenmeden önce hangi varsayılan yöntemle bölünüp parçalanacağını değiştirmek isteyebilirsiniz.",
    "desc-end":
      "Metin bölmenin nasıl çalıştığını ve olası yan etkilerini tam olarak bilmiyorsanız bu ayarı değiştirmemelisiniz.",
    size: {
      title: "Metin Parça Boyutu",
      description:
        "Tek bir vektörde bulunabilecek maksimum karakter uzunluğunu ifade eder.",
      recommend: "Gömme modelinin maksimum karakter uzunluğu",
    },
    overlap: {
      title: "Metin Parçalama Örtüşmesi",
      description:
        "İki bitişik metin parçası arasındaki, parçalama sırasında oluşabilecek maksimum karakter örtüşme miktarını belirtir.",
    },
  },
  vector: {
    title: "Vektör Veritabanı",
    description:
      "AnythingLLM örneğinizin nasıl çalışacağını belirleyen kimlik bilgileri ve ayarları burada bulunur. Bu anahtarların güncel ve doğru olması önemlidir.",
    provider: {
      title: "Vektör Veritabanı Sağlayıcısı",
      description: "LanceDB için ek bir yapılandırma gerekmez.",
    },
  },
  embeddable: {
    title: "Gömülebilir Sohbet Widget'ları",
    description:
      "Gömülebilir sohbet widget'ları, herkese açık olan ve tek bir çalışma alanına bağlı sohbet arayüzleridir. Bu sayede oluşturduğunuz çalışma alanlarını dünyaya açık hâle getirebilirsiniz.",
    create: "Gömme oluştur",
    table: {
      workspace: "Çalışma Alanı",
      chats: "Gönderilen Sohbetler",
      active: "Aktif Alan Adları",
      created: "Oluşturulma Tarihi",
    },
  },
  "embed-chats": {
    title: "Gömme Sohbetler",
    export: "Dışa Aktar",
    description:
      "Yayımladığınız herhangi bir gömme sohbetten gelen tüm kayıtlı sohbetler ve mesajlar burada bulunur.",
    table: {
      embed: "Gömme",
      sender: "Gönderen",
      message: "Mesaj",
      response: "Yanıt",
      at: "Gönderilme Zamanı",
    },
  },
  event: {
    title: "Olay Kayıtları",
    description:
      "Bu örnek üzerinde gerçekleşen tüm eylem ve olayları izlemek için görüntüleyin.",
    clear: "Olay Kayıtlarını Temizle",
    table: {
      type: "Olay Türü",
      user: "Kullanıcı",
      occurred: "Gerçekleşme Zamanı",
    },
  },
  privacy: {
    title: "Gizlilik & Veri İşleme",
    description:
      "Bağlantılı üçüncü taraf sağlayıcılarla ve AnythingLLM ile verilerinizin nasıl ele alındığını burada yapılandırabilirsiniz.",
    llm: "LLM Seçimi",
    embedding: "Gömme Tercihi",
    vector: "Vektör Veritabanı",
    anonymous: "Anonim Telemetri Etkin",
  },
  connectors: {
    "search-placeholder": "Veri bağlayıcılarını ara",
    "no-connectors": "Veri bağlayıcısı bulunamadı.",
    github: {
      name: "GitHub Deposu",
      description:
        "Tek tıklamayla tüm herkese açık veya özel GitHub deposunu içe aktarın.",
      URL: "GitHub Depo URL'si",
      URL_explained: "Toplamak istediğiniz GitHub deposunun URL'si.",
      token: "GitHub Erişim Tokeni",
      optional: "isteğe bağlı",
      token_explained: "Hız sınırlamasını önlemek için erişim tokeni.",
      token_explained_start: "Bir ",
      token_explained_link1: "Kişisel Erişim Tokeni",
      token_explained_middle:
        " olmadan GitHub API'si, hız sınırları nedeniyle toplanabilecek dosya sayısını sınırlayabilir. ",
      token_explained_link2: "Geçici bir Erişim Tokeni oluşturabilirsiniz",
      token_explained_end: " bu sorunu önlemek için.",
      ignores: "Dosya Yoksaymaları",
      git_ignore:
        "Toplama sırasında belirli dosyaları yoksaymak için .gitignore formatında liste. Kaydetmek istediğiniz her girişten sonra enter tuşuna basın.",
      task_explained:
        "Tamamlandığında, tüm dosyalar belge seçicide çalışma alanlarına gömülmeye hazır olacaktır.",
      branch: "Dosyaları toplamak istediğiniz dal.",
      branch_loading: "-- mevcut dallar yükleniyor --",
      branch_explained: "Dosyaları toplamak istediğiniz dal.",
      token_information:
        "<b>GitHub Erişim Tokeni</b> doldurulmadan bu veri bağlayıcısı, GitHub'ın herkese açık API hız sınırları nedeniyle yalnızca deponun <b>üst düzey</b> dosyalarını toplayabilecektir.",
      token_personal:
        "Buradan ücretsiz bir Kişisel Erişim Tokeni alabilirsiniz.",
    },
    gitlab: {
      name: "GitLab Deposu",
      description:
        "Tek tıklamayla tüm herkese açık veya özel GitLab deposunu içe aktarın.",
      URL: "GitLab Depo URL'si",
      URL_explained: "Toplamak istediğiniz GitLab deposunun URL'si.",
      token: "GitLab Erişim Tokeni",
      optional: "isteğe bağlı",
      token_explained: "Hız sınırlamasını önlemek için erişim tokeni.",
      token_description: "GitLab API'sinden alınacak ek varlıkları seçin.",
      token_explained_start: "Bir ",
      token_explained_link1: "Kişisel Erişim Tokeni",
      token_explained_middle:
        " olmadan GitLab API'si, hız sınırları nedeniyle toplanabilecek dosya sayısını sınırlayabilir. ",
      token_explained_link2: "Geçici bir Erişim Tokeni oluşturabilirsiniz",
      token_explained_end: " bu sorunu önlemek için.",
      fetch_issues: "Sorunları Belge Olarak Al",
      ignores: "Dosya Yoksaymaları",
      git_ignore:
        "Toplama sırasında belirli dosyaları yoksaymak için .gitignore formatında liste. Kaydetmek istediğiniz her girişten sonra enter tuşuna basın.",
      task_explained:
        "Tamamlandığında, tüm dosyalar belge seçicide çalışma alanlarına gömülmeye hazır olacaktır.",
      branch: "Dosyaları toplamak istediğiniz dal",
      branch_loading: "-- mevcut dallar yükleniyor --",
      branch_explained: "Dosyaları toplamak istediğiniz dal.",
      token_information:
        "<b>GitLab Erişim Tokeni</b> doldurulmadan bu veri bağlayıcısı, GitLab'ın herkese açık API hız sınırları nedeniyle yalnızca deponun <b>üst düzey</b> dosyalarını toplayabilecektir.",
      token_personal:
        "Buradan ücretsiz bir Kişisel Erişim Tokeni alabilirsiniz.",
    },
    youtube: {
      name: "YouTube Transkripti",
      description:
        "Bir bağlantıdan tüm YouTube videosunun transkriptini içe aktarın.",
      URL: "YouTube Video URL'si",
      URL_explained_start:
        "Transkriptini almak için herhangi bir YouTube videosunun URL'sini girin. Videonun ",
      URL_explained_link: "altyazıları",
      URL_explained_end: " mevcut olmalıdır.",
      task_explained:
        "Tamamlandığında, transkript belge seçicide çalışma alanlarına gömülmeye hazır olacaktır.",
      language: "Transkript Dili",
      language_explained: "Toplamak istediğiniz transkriptin dilini seçin.",
      loading_languages: "-- mevcut diller yükleniyor --",
    },
    "website-depth": {
      name: "Toplu Bağlantı Kazıyıcı",
      description:
        "Bir web sitesini ve alt bağlantılarını belirli bir derinliğe kadar kazıyın.",
      URL: "Web Sitesi URL'si",
      URL_explained: "Kazımak istediğiniz web sitesinin URL'si.",
      depth: "Tarama Derinliği",
      depth_explained:
        "Bu, çalışanın kaynak URL'den takip edeceği alt bağlantı sayısıdır.",
      max_pages: "Maksimum Sayfa",
      max_pages_explained: "Kazınacak maksimum bağlantı sayısı.",
      task_explained:
        "Tamamlandığında, tüm kazınan içerik belge seçicide çalışma alanlarına gömülmeye hazır olacaktır.",
    },
    confluence: {
      name: "Confluence",
      description: "Tek tıklamayla tüm Confluence sayfasını içe aktarın.",
      deployment_type: "Confluence dağıtım türü",
      deployment_type_explained:
        "Confluence örneğinizin Atlassian bulutunda mı yoksa kendi sunucunuzda mı barındırıldığını belirleyin.",
      base_url: "Confluence temel URL'si",
      base_url_explained: "Bu, Confluence alanınızın temel URL'sidir.",
      space_key: "Confluence alan anahtarı",
      space_key_explained:
        "Bu, kullanılacak confluence örneğinizin alan anahtarıdır. Genellikle ~ ile başlar",
      username: "Confluence Kullanıcı Adı",
      username_explained: "Confluence kullanıcı adınız",
      auth_type: "Confluence Kimlik Doğrulama Türü",
      auth_type_explained:
        "Confluence sayfalarınıza erişmek için kullanmak istediğiniz kimlik doğrulama türünü seçin.",
      auth_type_username: "Kullanıcı Adı ve Erişim Tokeni",
      auth_type_personal: "Kişisel Erişim Tokeni",
      token: "Confluence Erişim Tokeni",
      token_explained_start:
        "Kimlik doğrulama için bir erişim tokeni sağlamanız gerekiyor. ",
      token_explained_link: "Buradan",
      token_desc: "Kimlik doğrulama için erişim tokeni",
      pat_token: "Confluence Kişisel Erişim Tokeni",
      pat_token_explained: "Confluence kişisel erişim tokeniniz.",
      task_explained:
        "Tamamlandığında, sayfa içeriği belge seçicide çalışma alanlarına gömülmeye hazır olacaktır.",
      bypass_ssl: "SSL Sertifika Doğrulamasını Atla",
      bypass_ssl_explained:
        "Kendinden imzalı sertifikaya sahip kendi sunucunuzda barındırılan confluence örnekleri için SSL sertifika doğrulamasını atlamak için bu seçeneği etkinleştirin",
    },
    manage: {
      documents: "Belgeler",
      "data-connectors": "Veri Bağlayıcıları",
      "desktop-only":
        "Bu ayarları düzenlemek yalnızca masaüstü cihazda mümkündür. Devam etmek için lütfen bu sayfaya masaüstünüzden erişin.",
      dismiss: "Kapat",
      editing: "Düzenleniyor",
    },
    directory: {
      "my-documents": "Belgelerim",
      "new-folder": "Yeni Klasör",
      "search-document": "Belge ara",
      "no-documents": "Belge Yok",
      "move-workspace": "Çalışma Alanına Taşı",
      name: "Ad",
      "delete-confirmation":
        "Bu dosyaları ve klasörleri silmek istediğinizden emin misiniz?\nBu, dosyaları sistemden kaldıracak ve mevcut çalışma alanlarından otomatik olarak silecektir.\nBu işlem geri alınamaz.",
      "removing-message":
        "{{count}} belge ve {{folderCount}} klasör kaldırılıyor. Lütfen bekleyin.",
      "move-success": "{{count}} belge başarıyla taşındı.",
      date: "Tarih",
      type: "Tür",
      no_docs: "Belge Yok",
      select_all: "Tümünü Seç",
      deselect_all: "Tümünün Seçimini Kaldır",
      remove_selected: "Seçilenleri Kaldır",
      costs: "*Gömmeler için tek seferlik maliyet",
      save_embed: "Kaydet ve Göm",
    },
    upload: {
      "processor-offline": "Belge İşleyici Kullanılamıyor",
      "processor-offline-desc":
        "Belge işleyici çevrimdışı olduğu için şu anda dosyalarınızı yükleyemiyoruz. Lütfen daha sonra tekrar deneyin.",
      "click-upload": "Yüklemek için tıklayın veya sürükleyip bırakın",
      "file-types":
        "metin dosyaları, csv'ler, elektronik tablolar, ses dosyaları ve daha fazlasını destekler!",
      "or-submit-link": "veya bir bağlantı gönderin",
      "placeholder-link": "https://ornek.com",
      fetching: "Alınıyor...",
      "fetch-website": "Web sitesini al",
      "privacy-notice":
        "Bu dosyalar, bu AnythingLLM örneğinde çalışan belge işleyiciye yüklenecektir. Bu dosyalar üçüncü taraflarla paylaşılmaz.",
    },
    pinning: {
      what_pinning: "Belge sabitleme nedir?",
      pin_explained_block1:
        "AnythingLLM'de bir belgeyi <b>sabitlediğinizde</b>, belgenin tüm içeriğini LLM'nin tam olarak anlaması için prompt pencerenize enjekte ederiz.",
      pin_explained_block2:
        "Bu, <b>büyük bağlam modelleri</b> veya bilgi tabanı için kritik olan küçük dosyalarla en iyi şekilde çalışır.",
      pin_explained_block3:
        "AnythingLLM'den varsayılan olarak istediğiniz yanıtları alamıyorsanız, sabitleme tek tıklamayla daha yüksek kaliteli yanıtlar almanın harika bir yoludur.",
      accept: "Tamam, anladım",
    },
    watching: {
      what_watching: "Bir belgeyi izlemek ne yapar?",
      watch_explained_block1:
        "AnythingLLM'de bir belgeyi <b>izlediğinizde</b>, belge içeriğinizi orijinal kaynağından düzenli aralıklarla <i>otomatik olarak</i> senkronize ederiz. Bu, dosyanın yönetildiği her çalışma alanında içeriği otomatik olarak günceller.",
      watch_explained_block2:
        "Bu özellik şu anda yalnızca çevrimiçi tabanlı içeriği desteklemektedir ve manuel olarak yüklenen belgeler için kullanılamayacaktır.",
      watch_explained_block3_start: "Hangi belgelerin izlendiğini ",
      watch_explained_block3_link: "Dosya yöneticisi",
      watch_explained_block3_end: " yönetici görünümünden yönetebilirsiniz.",
      accept: "Tamam, anladım",
    },
    obsidian: {
      name: "Obsidian",
      description: "Obsidian kasasını tek tıklamayla içe aktarın.",
      vault_location: "Kasa Konumu",
      vault_description:
        "Tüm notları ve bağlantılarını içe aktarmak için Obsidian kasa klasörünüzü seçin.",
      selected_files: "{{count}} markdown dosyası bulundu",
      importing: "Kasa içe aktarılıyor...",
      import_vault: "Kasayı İçe Aktar",
      processing_time:
        "Bu işlem kasanızın boyutuna bağlı olarak biraz zaman alabilir.",
      vault_warning:
        "Herhangi bir çakışmayı önlemek için Obsidian kasanızın şu anda açık olmadığından emin olun.",
    },
  },
  chat_window: {
    welcome: "Yeni çalışma alanınıza hoş geldiniz.",
    get_started: "Başlamak için",
    get_started_default: "Başlamak için",
    upload: "bir belge yükleyin",
    or: "veya",
    send_chat: "bir sohbet gönderin.",
    send_message: "Mesaj gönderin",
    attach_file: "Bu sohbete bir dosya ekleyin",
    slash: "Sohbet için mevcut tüm eğik çizgi komutlarını görüntüleyin.",
    agents: "Sohbet için kullanabileceğiniz tüm ajanları görüntüleyin.",
    text_size: "Metin boyutunu değiştirin.",
    microphone: "Promptunuzu söyleyin.",
    send: "Çalışma alanına prompt mesajı gönderin",
    attachments_processing: "Ekler işleniyor. Lütfen bekleyin...",
    tts_speak_message: "TTS Mesajı Seslendir",
    copy: "Kopyala",
    regenerate: "Yeniden Oluştur",
    regenerate_response: "Yanıtı yeniden oluştur",
    good_response: "İyi yanıt",
    more_actions: "Daha fazla eylem",
    hide_citations: "Alıntıları gizle",
    show_citations: "Alıntıları göster",
    pause_tts_speech_message: "TTS mesaj konuşmasını duraklat",
    fork: "Çatalla",
    delete: "Sil",
    save_submit: "Kaydet & Gönder",
    cancel: "İptal",
    edit_prompt: "Promptu düzenle",
    edit_response: "Yanıtı düzenle",
    at_agent: "@agent",
    default_agent_description: " - bu çalışma alanının varsayılan ajanı.",
    custom_agents_coming_soon: "özel ajanlar yakında!",
    slash_reset: "/reset",
    preset_reset_description:
      "Sohbet geçmişinizi temizleyin ve yeni bir sohbet başlatın",
    add_new_preset: " Yeni Ön Ayar Ekle",
    command: "Komut",
    your_command: "sizin-komutunuz",
    placeholder_prompt: "Bu, promptunuzun önüne enjekte edilecek içeriktir.",
    description: "Açıklama",
    placeholder_description: "LLM'ler hakkında bir şiirle yanıt verir.",
    save: "Kaydet",
    small: "Küçük",
    normal: "Normal",
    large: "Büyük",
    workspace_llm_manager: {
      search: "LLM sağlayıcılarını ara",
      loading_workspace_settings: "Çalışma alanı ayarları yükleniyor...",
      available_models: "{{provider}} için Mevcut Modeller",
      available_models_description:
        "Bu çalışma alanı için kullanılacak bir model seçin.",
      save: "Bu modeli kullan",
      saving: "Model çalışma alanı varsayılanı olarak ayarlanıyor...",
      missing_credentials: "Bu sağlayıcının kimlik bilgileri eksik!",
      missing_credentials_description:
        "Kimlik bilgilerini ayarlamak için tıklayın",
    },
  },
  profile_settings: {
    edit_account: "Hesabı Düzenle",
    profile_picture: "Profil Resmi",
    remove_profile_picture: "Profil Resmini Kaldır",
    username: "Kullanıcı Adı",
    new_password: "Yeni Şifre",
    password_description: "Şifre en az 8 karakter uzunluğunda olmalıdır",
    cancel: "İptal",
    update_account: "Hesabı Güncelle",
    theme: "Tema Tercihi",
    language: "Tercih edilen dil",
    failed_upload: "Profil resmi yüklenemedi: {{error}}",
    upload_success: "Profil resmi yüklendi.",
    failed_remove: "Profil resmi kaldırılamadı: {{error}}",
    profile_updated: "Profil güncellendi.",
    failed_update_user: "Kullanıcı güncellenemedi: {{error}}",
    account: "Hesap",
    support: "Destek",
    signout: "Çıkış Yap",
  },
  customization: {
    interface: {
      title: "Arayüz Tercihleri",
      description: "AnythingLLM için arayüz tercihlerinizi ayarlayın.",
    },
    branding: {
      title: "Marka & Beyaz Etiketleme",
      description:
        "AnythingLLM örneğinizi özel markalamayla beyaz etiketleyin.",
    },
    chat: {
      title: "Sohbet",
      description: "AnythingLLM için sohbet tercihlerinizi ayarlayın.",
      auto_submit: {
        title: "Konuşma Girişini Otomatik Gönder",
        description:
          "Bir sessizlik süresinden sonra konuşma girişini otomatik olarak gönderin",
      },
      auto_speak: {
        title: "Yanıtları Otomatik Seslendir",
        description: "AI yanıtlarını otomatik olarak seslendirin",
      },
      spellcheck: {
        title: "Yazım Denetimini Etkinleştir",
        description:
          "Sohbet giriş alanında yazım denetimini etkinleştirin veya devre dışı bırakın",
      },
    },
    items: {
      theme: {
        title: "Tema",
        description: "Uygulama için tercih ettiğiniz renk temasını seçin.",
      },
      "show-scrollbar": {
        title: "Kaydırma Çubuğunu Göster",
        description:
          "Sohbet penceresinde kaydırma çubuğunu etkinleştirin veya devre dışı bırakın.",
      },
      "support-email": {
        title: "Destek E-postası",
        description:
          "Kullanıcıların yardıma ihtiyaç duyduğunda erişebilecekleri destek e-posta adresini ayarlayın.",
      },
      "app-name": {
        title: "Ad",
        description:
          "Giriş sayfasında tüm kullanıcılara gösterilen bir ad ayarlayın.",
      },
      "chat-message-alignment": {
        title: "Sohbet Mesajı Hizalaması",
        description:
          "Sohbet arayüzünü kullanırken mesaj hizalama modunu seçin.",
      },
      "display-language": {
        title: "Görüntüleme Dili",
        description:
          "AnythingLLM'nin kullanıcı arayüzünü görüntülemek için tercih edilen dili seçin - çeviriler mevcut olduğunda.",
      },
      logo: {
        title: "Marka Logosu",
        description: "Tüm sayfalarda göstermek için özel logonuzu yükleyin.",
        add: "Özel logo ekle",
        recommended: "Önerilen boyut: 800 x 200",
        remove: "Kaldır",
        replace: "Değiştir",
      },
      "welcome-messages": {
        title: "Karşılama Mesajları",
        description:
          "Kullanıcılarınıza gösterilen karşılama mesajlarını özelleştirin. Yalnızca yönetici olmayan kullanıcılar bu mesajları görecektir.",
        new: "Yeni",
        system: "sistem",
        user: "kullanıcı",
        message: "mesaj",
        assistant: "AnythingLLM Sohbet Asistanı",
        "double-click": "Düzenlemek için çift tıklayın...",
        save: "Mesajları Kaydet",
      },
      "browser-appearance": {
        title: "Tarayıcı Görünümü",
        description:
          "Uygulama açıkken tarayıcı sekmesinin ve başlığının görünümünü özelleştirin.",
        tab: {
          title: "Başlık",
          description:
            "Uygulama bir tarayıcıda açıkken özel bir sekme başlığı ayarlayın.",
        },
        favicon: {
          title: "Favicon",
          description: "Tarayıcı sekmesi için özel bir favicon kullanın.",
        },
      },
      "sidebar-footer": {
        title: "Kenar Çubuğu Alt Bilgi Öğeleri",
        description:
          "Kenar çubuğunun altında görüntülenen alt bilgi öğelerini özelleştirin.",
        icon: "Simge",
        link: "Bağlantı",
      },
      "render-html": {
        title: "Sohbette HTML Görüntüle",
        description:
          "Asistan yanıtlarında HTML yanıtlarını görüntüleyin.\nBu, çok daha yüksek kaliteli yanıt sağlayabilir, ancak potansiyel güvenlik risklerine de yol açabilir.",
      },
    },
  },
  "main-page": {
    noWorkspaceError:
      "Sohbete başlamadan önce lütfen bir çalışma alanı oluşturun.",
    checklist: {
      title: "Başlarken",
      tasksLeft: "kalan görev",
      completed: "AnythingLLM uzmanı olma yolundasınız!",
      dismiss: "kapat",
      tasks: {
        create_workspace: {
          title: "Bir çalışma alanı oluşturun",
          description: "Başlamak için ilk çalışma alanınızı oluşturun",
          action: "Oluştur",
        },
        send_chat: {
          title: "Bir sohbet gönderin",
          description: "AI asistanınızla bir konuşma başlatın",
          action: "Sohbet",
        },
        embed_document: {
          title: "Bir belge gömün",
          description: "Çalışma alanınıza ilk belgenizi ekleyin",
          action: "Göm",
        },
        setup_system_prompt: {
          title: "Bir sistem promptu ayarlayın",
          description: "AI asistanınızın davranışını yapılandırın",
          action: "Ayarla",
        },
        define_slash_command: {
          title: "Bir eğik çizgi komutu tanımlayın",
          description: "Asistanınız için özel komutlar oluşturun",
          action: "Tanımla",
        },
        visit_community: {
          title: "Topluluk Hub'ını Ziyaret Edin",
          description: "Topluluk kaynaklarını ve şablonları keşfedin",
          action: "Göz At",
        },
      },
    },
    quickLinks: {
      title: "Hızlı Bağlantılar",
      sendChat: "Sohbet Gönder",
      embedDocument: "Belge Göm",
      createWorkspace: "Çalışma Alanı Oluştur",
    },
    exploreMore: {
      title: "Daha fazla özellik keşfedin",
      features: {
        customAgents: {
          title: "Özel AI Ajanları",
          description:
            "Kod yazmadan güçlü AI Ajanları ve otomasyonlar oluşturun.",
          primaryAction: "@agent kullanarak sohbet et",
          secondaryAction: "Bir ajan akışı oluştur",
        },
        slashCommands: {
          title: "Eğik Çizgi Komutları",
          description:
            "Özel eğik çizgi komutları kullanarak zaman kazanın ve promptlar enjekte edin.",
          primaryAction: "Eğik Çizgi Komutu Oluştur",
          secondaryAction: "Hub'da Keşfet",
        },
        systemPrompts: {
          title: "Sistem Promptları",
          description:
            "Bir çalışma alanının AI yanıtlarını özelleştirmek için sistem promptunu değiştirin.",
          primaryAction: "Sistem Promptunu Değiştir",
          secondaryAction: "Prompt değişkenlerini yönet",
        },
      },
    },
    announcements: {
      title: "Güncellemeler & Duyurular",
    },
    resources: {
      title: "Kaynaklar",
      links: {
        docs: "Dokümantasyon",
        star: "Github'da Yıldızla",
      },
      keyboardShortcuts: "Klavye Kısayolları",
    },
  },
  "keyboard-shortcuts": {
    title: "Klavye Kısayolları",
    shortcuts: {
      settings: "Ayarları Aç",
      workspaceSettings: "Mevcut Çalışma Alanı Ayarlarını Aç",
      home: "Ana Sayfaya Git",
      workspaces: "Çalışma Alanlarını Yönet",
      apiKeys: "API Anahtarları Ayarları",
      llmPreferences: "LLM Tercihleri",
      chatSettings: "Sohbet Ayarları",
      help: "Klavye kısayolları yardımını göster",
      showLLMSelector: "Çalışma alanı LLM Seçicisini Göster",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Başarılı!",
        success_description: "Sistem Promptunuz Topluluk Hub'ına yayınlandı!",
        success_thank_you: "Topluluğa paylaştığınız için teşekkür ederiz!",
        view_on_hub: "Topluluk Hub'ında Görüntüle",
        modal_title: "Sistem Promptu Yayınla",
        name_label: "Ad",
        name_description: "Bu, sistem promptunuzun görüntü adıdır.",
        name_placeholder: "Sistem Promptum",
        description_label: "Açıklama",
        description_description:
          "Bu, sistem promptunuzun açıklamasıdır. Sistem promptunuzun amacını açıklamak için bunu kullanın.",
        tags_label: "Etiketler",
        tags_description:
          "Etiketler, sistem promptunuzu daha kolay aramak için etiketlemek amacıyla kullanılır. Birden fazla etiket ekleyebilirsiniz. Maksimum 5 etiket. Etiket başına maksimum 20 karakter.",
        tags_placeholder: "Yazın ve etiket eklemek için Enter'a basın",
        visibility_label: "Görünürlük",
        public_description: "Herkese açık sistem promptları herkese görünür.",
        private_description: "Özel sistem promptları yalnızca size görünür.",
        publish_button: "Topluluk Hub'ına Yayınla",
        submitting: "Yayınlanıyor...",
        submit: "Topluluk Hub'ına Yayınla",
        prompt_label: "Prompt",
        prompt_description:
          "Bu, LLM'yi yönlendirmek için kullanılacak gerçek sistem promptudur.",
        prompt_placeholder: "Sistem promptunuzu buraya girin...",
      },
      agent_flow: {
        public_description: "Herkese açık ajan akışları herkese görünür.",
        private_description: "Özel ajan akışları yalnızca size görünür.",
        success_title: "Başarılı!",
        success_description: "Ajan Akışınız Topluluk Hub'ına yayınlandı!",
        success_thank_you: "Topluluğa paylaştığınız için teşekkür ederiz!",
        view_on_hub: "Topluluk Hub'ında Görüntüle",
        modal_title: "Ajan Akışı Yayınla",
        name_label: "Ad",
        name_description: "Bu, ajan akışınızın görüntü adıdır.",
        name_placeholder: "Ajan Akışım",
        description_label: "Açıklama",
        description_description:
          "Bu, ajan akışınızın açıklamasıdır. Ajan akışınızın amacını açıklamak için bunu kullanın.",
        tags_label: "Etiketler",
        tags_description:
          "Etiketler, ajan akışınızı daha kolay aramak için etiketlemek amacıyla kullanılır. Birden fazla etiket ekleyebilirsiniz. Maksimum 5 etiket. Etiket başına maksimum 20 karakter.",
        tags_placeholder: "Yazın ve etiket eklemek için Enter'a basın",
        visibility_label: "Görünürlük",
        publish_button: "Topluluk Hub'ına Yayınla",
        submitting: "Yayınlanıyor...",
        submit: "Topluluk Hub'ına Yayınla",
        privacy_note:
          "Ajan akışları, hassas verileri korumak için her zaman özel olarak yüklenir. Yayınladıktan sonra Topluluk Hub'ında görünürlüğü değiştirebilirsiniz. Lütfen yayınlamadan önce akışınızın hassas veya özel bilgi içermediğini doğrulayın.",
      },
      slash_command: {
        success_title: "Başarılı!",
        success_description:
          "Eğik Çizgi Komutunuz Topluluk Hub'ına yayınlandı!",
        success_thank_you: "Topluluğa paylaştığınız için teşekkür ederiz!",
        view_on_hub: "Topluluk Hub'ında Görüntüle",
        modal_title: "Eğik Çizgi Komutu Yayınla",
        name_label: "Ad",
        name_description: "Bu, eğik çizgi komutunuzun görüntü adıdır.",
        name_placeholder: "Eğik Çizgi Komutum",
        description_label: "Açıklama",
        description_description:
          "Bu, eğik çizgi komutunuzun açıklamasıdır. Eğik çizgi komutunuzun amacını açıklamak için bunu kullanın.",
        command_label: "Komut",
        command_description:
          "Bu, kullanıcıların bu ön ayarı tetiklemek için yazacağı eğik çizgi komutudur.",
        command_placeholder: "komutum",
        tags_label: "Etiketler",
        tags_description:
          "Etiketler, eğik çizgi komutunuzu daha kolay aramak için etiketlemek amacıyla kullanılır. Birden fazla etiket ekleyebilirsiniz. Maksimum 5 etiket. Etiket başına maksimum 20 karakter.",
        tags_placeholder: "Yazın ve etiket eklemek için Enter'a basın",
        visibility_label: "Görünürlük",
        public_description:
          "Herkese açık eğik çizgi komutları herkese görünür.",
        private_description: "Özel eğik çizgi komutları yalnızca size görünür.",
        publish_button: "Topluluk Hub'ına Yayınla",
        submitting: "Yayınlanıyor...",
        prompt_label: "Prompt",
        prompt_description:
          "Bu, eğik çizgi komutu tetiklendiğinde kullanılacak prompttur.",
        prompt_placeholder: "Promptunuzu buraya girin...",
      },
      generic: {
        unauthenticated: {
          title: "Kimlik Doğrulama Gerekli",
          description:
            "Öğeleri yayınlamadan önce AnythingLLM Topluluk Hub'ına kimlik doğrulaması yapmanız gerekir.",
          button: "Topluluk Hub'ına Bağlan",
        },
      },
    },
  },
  security: {
    title: "Güvenlik",
    multiuser: {
      title: "Çoklu Kullanıcı Modu",
      description:
        "Takımınızı desteklemek için örneğinizi yapılandırın ve Çoklu Kullanıcı Modunu etkinleştirin.",
      enable: {
        "is-enable": "Çoklu Kullanıcı Modu Etkin",
        enable: "Çoklu Kullanıcı Modunu Etkinleştir",
        description:
          "Varsayılan olarak tek yönetici sizsiniz. Yönetici olarak yeni kullanıcılar veya yöneticiler için hesap oluşturmanız gerekir. Şifrenizi kaybetmeyin çünkü yalnızca bir Yönetici kullanıcı şifreleri sıfırlayabilir.",
        username: "Yönetici hesap kullanıcı adı",
        password: "Yönetici hesap şifresi",
      },
    },
    password: {
      title: "Şifre Koruması",
      description:
        "AnythingLLM örneğinizi bir şifre ile koruyun. Bu şifreyi unutmanız hâlinde kurtarma yöntemi yoktur, bu yüzden mutlaka güvende saklayın.",
      "password-label": "Örnek şifresi",
    },
  },
  home: {
    welcome: "Hoşgeldiniz",
    chooseWorkspace: "Bir çalışma alanı seçerek sohbete başlayın!",
    notAssigned:
      "Şu anda hiçbir çalışma alanına atanmamışsınız.\nBir çalışma alanına erişmek için yöneticinize başvurun.",
    goToWorkspace: 'Çalışma alanına git "{{workspace}}"',
  },
};

export default TRANSLATIONS;
