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
      welcome: "Hoş geldiniz",
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
  },
  common: {
    "workspaces-name": "Çalışma Alanları Adı",
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
    on: "On",
    none: "Yok",
    stopped: "Durdu",
    loading: "Yükleniyor",
    refresh: "Tazelemek",
  },
  settings: {
    title: "Instance Ayarları",
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
    "community-hub": {
      title: "Topluluk Merkezi",
      trending: "Popüler olanları keşfedin",
      "your-account": "Hesabınız",
      "import-item": "İthal Edilen Ürün",
    },
    channels: "Kanalalar",
    "available-channels": {
      telegram: "Telegram",
    },
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
    },
    mode: {
      title: "Sohbet Modu",
      chat: {
        title: "Sohbet",
        description:
          'LLM\'nin genel bilgisi ve bulunan doküman bağlamıyla cevaplar sağlayacaktır. Araçları kullanmak için "@agent" komutunu kullanmanız gerekecektir.',
      },
      query: {
        title: "Sorgu",
        description:
          "yalnızca ilgili belgenin bağlamında yanıtlar sağlayacaktır.<b>Kullanılabilir araçları kullanmak için @agent komutunu kullanmanız gerekecektir.</b>",
      },
      automatic: {
        title: "Oto",
        description:
          "Model ve sağlayıcı tarafından desteklenen araçları otomatik olarak kullanacaktır. Eğer yerel araç çağırma desteklenmiyorsa, araçları kullanmak için @agent komutunu kullanmanız gerekecektir.",
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
        description:
          "Ajantınızın, web arama (SERP) sağlayıcısıyla bağlantı kurarak, sorularınızı yanıtlamak için web'i aramasını sağlayın.",
      },
      sql: {
        title: "SQL Bağlayıcı",
        description:
          "Temsilcinizin, çeşitli SQL veri tabanı sağlayıcılarına bağlanarak SQL'i kullanarak sorularınızı yanıtlamasına olanak tanıyın.",
      },
      default_skill:
        "Varsayılan olarak bu özellik etkinleştirilmiştir, ancak ajanın kullanmasına izin vermek istemiyorsanız, bu özelliği devre dışı bırakabilirsiniz.",
      filesystem: {
        title: "Dosya Sistemi Erişimi",
        description:
          "Temsilcinizin, belirli bir klasör içindeki dosyaları okuma, yazma, arama ve yönetme yeteneğini etkinleştirin. Dosya düzenleme, klasör gezinme ve içerik arama özelliklerini destekler.",
        learnMore:
          "Bu beceriye nasıl başlanacağını ve nasıl kullanılacağını daha detaylı bir şekilde öğrenin.",
        configuration: "Yapılandırma",
        readActions: "Okunmuş Eylemler",
        writeActions: "Yapılacak İşler",
        warning:
          "Dosya sistemine erişim tehlikeli olabilir, çünkü dosyaları değiştirebilir veya silebilir. Bu özelliği etkinleştirmeden önce lütfen <link>belgelendirme</link>'i inceleyin.",
        skills: {
          "read-text-file": {
            title: "Dosyayı aç",
            description:
              "Dosyalardaki içeriği okuyun (metin, kod, PDF, resimler vb.)",
          },
          "read-multiple-files": {
            title: "Birden fazla dosyayı okuyun",
            description: "Birden fazla dosyayı aynı anda okuyun",
          },
          "list-directory": {
            title: "Yönerge Listesi",
            description: "Bir klasördeki dosyaları ve dizinleri listeleyin.",
          },
          "search-files": {
            title: "Dosyaları Arayın",
            description: "Dosyaları adlarına veya içeriğine göre arayın",
          },
          "get-file-info": {
            title: "Dosya Hakkında Bilgi Al",
            description: "Dosyalara ilişkin ayrıntılı meta verileri elde edin.",
          },
          "write-file": {
            title: "Dosya Oluştur",
            description:
              "Yeni dosyalar oluşturun veya mevcut dosyaları üzerine yazın.",
          },
          "edit-file": {
            title: "Dosya Düzenle",
            description: "Metin dosyalarında satır bazlı değişiklikler yapın.",
          },
          "create-directory": {
            title: "Klasör Oluştur",
            description: "Yeni klasörler oluşturun",
          },
          "move-file": {
            title: "Dosya taşı/yeniden adlandır",
            description:
              "Dosyaları ve dizinleri taşıyın veya yeniden adlandırın.",
          },
          "copy-file": {
            title: "Dosyayı Kopyala",
            description: "Dosyaları ve dizinleri kopyala",
          },
        },
      },
    },
    mcp: {
      title: "MCP Sunucuları",
      "loading-from-config": "MCP sunarlarını yapılandırma dosyasından yükleme",
      "learn-more": "MCP sunucuları hakkında daha fazla bilgi edinin.",
      "no-servers-found": "Hiçbir MCP sunucusu bulunamadı.",
      "tool-warning":
        "En iyi performansı elde etmek için, gereksiz araçları devre dışı bırakarak bağlamı korumayı düşünebilirsiniz.",
      "stop-server": "MCP sunucusunu durdurun",
      "start-server": "MCP sunucusunu başlatın",
      "delete-server": "MCP sunucusunu sil",
      "tool-count-warning":
        "Bu MCP sunucusu, <b> özelliklerini etkinleştirmiş durumda ve bu özellikler her etkileşimde bağlamı tüketebilir. </b> Bağlamı korumak için istenmeyen özellikleri devre dışı bırakmayı düşünebilirsiniz.",
      "startup-command": "Başlangıç Komutu",
      command: "Emir",
      arguments: "Tartışmalar",
      "not-running-warning":
        "Bu MCP sunucusu çalışmıyor – olabilir ki durdurulmuş veya başlatma sırasında bir hata yaşıyor olabilir.",
      "tool-call-arguments": "Araç çağrı argümanları",
      "tools-enabled": "gerektiren araçlar etkinleştirildi",
    },
    settings: {
      title: "Ajant Yetenek Ayarları",
      "max-tool-calls": {
        title: "Her yanıt için maksimum araç çağrı sayısı",
        description:
          "Bir ajantın, tek bir yanıt oluşturmak için zincirlemesini kullanabileceği maksimum araç sayısı. Bu, araçların kontrolsüz bir şekilde çağrılmasını ve sonsuz döngülerin oluşmasını engeller.",
      },
      "intelligent-skill-selection": {
        title: "Akıllı Becerilerin Seçimi",
        "beta-badge": "Beta",
        description:
          'Her sorgu için sınırsız araç kullanımı ve "cut token" kullanımını %80\'e kadar azaltma imkanı sunar — AnythingLLM, her talep için doğru becerileri otomatik olarak seçer.',
        "max-tools": {
          title: "Max Araçları",
          description:
            "Her sorgu için seçilebilecek maksimum araç sayısı. Daha büyük bağlam modelleri için bu değeri daha yüksek bir değere ayarlamayı öneririz.",
        },
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
      "delete-confirmation":
        "Bu dosyaları ve klasörleri silmek istediğinizden emin misiniz?\nBu, dosyaları sistemden kaldıracak ve mevcut çalışma alanlarından otomatik olarak silecektir.\nBu işlem geri alınamaz.",
      "removing-message":
        "{{count}} belge ve {{folderCount}} klasör kaldırılıyor. Lütfen bekleyin.",
      "move-success": "{{count}} belge başarıyla taşındı.",
      no_docs: "Belge Yok",
      select_all: "Tümünü Seç",
      deselect_all: "Tümünün Seçimini Kaldır",
      remove_selected: "Seçilenleri Kaldır",
      costs: "*Gömmeler için tek seferlik maliyet",
      save_embed: "Kaydet ve Göm",
      "total-documents_one": "{{count}} belgesi",
      "total-documents_other": "{{count}} belgeleri",
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
    send_message: "Mesaj gönderin",
    attach_file: "Bu sohbete bir dosya ekleyin",
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
    fork: "Çatalla",
    delete: "Sil",
    cancel: "İptal",
    edit_prompt: "Promptu düzenle",
    edit_response: "Yanıtı düzenle",
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
    submit: "Gönder",
    edit_info_user:
      '"Gönder" seçeneği, yapay zeka yanıtını yeniden oluşturur. "Kaydet" seçeneği, yalnızca sizin mesajınızı günceller.',
    edit_info_assistant:
      "Yaptığınız değişiklikler doğrudan bu yanıtın içine kaydedilecektir.",
    see_less: "Daha az",
    see_more: "Daha Fazla",
    tools: "Araçlar",
    text_size_label: "Metin Boyutu",
    select_model: "Model Seçimi",
    sources: "Kaynaklar",
    document: "Belge",
    similarity_match: "maç",
    source_count_one: "{{count}} ile ilgili bilgi",
    source_count_other: "{{count}} referansları",
    preset_exit_description: "Mevcut ajan oturumunu durdurun",
    add_new: "Yeni ekle",
    edit: "Düzenle",
    publish: "Yayınla",
    stop_generating: "Yanıt üretmeyi durdurun",
    slash_commands: "Komut Satırı Komutları",
    agent_skills: "Ajansın Yetenekleri",
    manage_agent_skills: "Temsilcinin becerilerini yönetin",
    agent_skills_disabled_in_session:
      "Aktif bir ajan oturumunda becerileri değiştirilemez. İlk olarak /exit komutunu kullanarak oturumu sonlandırın.",
    start_agent_session: "Temsilci Oturumu Başlat",
    use_agent_session_to_use_tools:
      'Çatınızdaki araçları kullanmak için, isteminizin başında "@agent" ile bir ajan oturumu başlatabilirsiniz.',
    agent_invocation: {
      model_wants_to_call: "Model, arama yapmak istiyor",
      approve: "Onayla",
      reject: "Reddet",
      always_allow: "Her zaman {{skillName}}'ı sağlayın.",
      tool_call_was_approved: "Araç talebi onaylandı.",
      tool_call_was_rejected: "Ara çağrısı reddedildi.",
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
    quickActions: {
      createAgent: "Bir temsilci oluşturun",
      editWorkspace: "Çalışma Alanını Düzenle",
      uploadDocument: "Bir belge yükleyin",
    },
    greeting: "Bugün size nasıl yardımcı olabilirim?",
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
        prompt_label: "Prompt",
        prompt_description:
          "Bu, LLM'yi yönlendirmek için kullanılacak gerçek sistem promptudur.",
        prompt_placeholder: "Sistem promptunuzu buraya girin...",
      },
      agent_flow: {
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
  telegram: {
    title: "Telegram Bot'u",
    description:
      "AnythingLLM örneğinizi Telegram ile bağlantılandırarak, herhangi bir cihazdan çalışma alanlarınızla sohbet edebilmelisiniz.",
    setup: {
      step1: {
        title: "1. Adım: Telegram botunuzu oluşturun",
        description:
          "Telegram uygulamasında @BotFather'ı açın, \"<code>/newbot</code>\" komutunu <code>@BotFather</code>'e gönderin, talimatları izleyin ve API anahtarını kopyalayın.",
        "open-botfather": "BotFather'ı aç",
        "instruction-1": "1. Bağlantıyı açın veya QR kodunu tarayın",
        "instruction-2":
          "2. <code>/newbot</code> adresine <code>@BotFather</code>'e gönderin.",
        "instruction-3": "3. Botunuz için bir isim ve kullanıcı adı seçin",
        "instruction-4": "4. Alınan API token'ı kopyalayın",
      },
      step2: {
        title: "Adım 2: Botunuzu bağlayın",
        description:
          "Aldığınız API token'ı (@BotFather) kopyalayın ve botunuzun iletişim kuracağı varsayılan çalışma alanını seçin.",
        "bot-token": "Bot Token",
        "default-workspace": "Varsayılan Çalışma Alanı",
        "no-workspace":
          "Mevcut çalışma alanları bulunmamaktadır. Yeni bir çalışma alanı oluşturulacaktır.",
        connecting: "Bağlantı kuruluyor...",
        "connect-bot": "Bağlantı Botu",
      },
      security: {
        title: "Önerilen Güvenlik Ayarları",
        description:
          "Ek güvenlik için, bu ayarları @BotFather üzerinden yapılandırın.",
        "disable-groups": "— Gruplara bot eklenmesini engelleme",
        "disable-inline":
          "— Bot'un, arama çubuklarında kullanılmasını engellemek",
        "obscure-username":
          "Daha az bilinen bir bot kullanıcı adı kullanarak görünürlüğünü azaltın.",
      },
      "toast-enter-token": "Lütfen bir bot belirteci girin.",
      "toast-connect-failed": "Bot ile bağlantı kurulamadı.",
    },
    connected: {
      status: "Bağlı",
      "status-disconnected":
        "Bağlantı kesildi — belirteç geçersiz veya süresi dolmuş olabilir",
      "placeholder-token": "Yeni bot token'ı yapıştırın...",
      reconnect: "Yeniden bağlantı kur",
      workspace: "Çalışma alanı",
      "bot-link": "Bot bağlantısı",
      "voice-response": "Sesle etkileşim",
      disconnecting: "Bağlantıyı kesiyorum...",
      disconnect: "Bağlantıyı kes",
      "voice-text-only": "Sadece metin",
      "voice-mirror":
        "Sesli yanıt (kullanıcı ses gönderdiğinde, sesli yanıtla cevaplayın)",
      "voice-always": "Her yanıtla birlikte sesli (sesli yanıt gönderme)",
      "toast-disconnect-failed": "Bot'u ayırmada başarısız.",
      "toast-reconnect-failed": "Bot yeniden bağlantı kuramadı.",
      "toast-voice-failed": "Ses modunu güncelleme başarısız oldu.",
      "toast-approve-failed": "Kullanıcıın onaylanması başarısız oldu.",
      "toast-deny-failed": "Kullanıcıyı reddetmeyi başaramadı.",
      "toast-revoke-failed": "Kullanıcıyı silme işlemi başarısız oldu.",
    },
    users: {
      "pending-title": "Onay Bekliyor",
      "pending-description":
        "Doğrulama işlemi bekleyen kullanıcılar. Burada gösterilen eşleştirme kodunu, Telegram sohbetlerinde görüntülenen kodla karşılaştırın.",
      "approved-title": "Onaylanmış Kullanıcılar",
      "approved-description":
        "Botunuzla sohbet etmeye yetkili olan kullanıcılar.",
      user: "Kullanıcı",
      "pairing-code": "Eşleştirme Kodu",
      "no-pending": "Henüz tamamlanmamış herhangi bir istek bulunmamaktadır.",
      "no-approved": "Onaylanmış kullanıcı bulunmamaktadır",
      unknown: "Bilinmiyor",
      approve: "Onayla",
      deny: "İnkar",
      revoke: "İptal et",
    },
  },
};

export default TRANSLATIONS;
