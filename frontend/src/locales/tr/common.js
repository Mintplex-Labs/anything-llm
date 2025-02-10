const TRANSLATIONS = {
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
  },

  // Setting Sidebar menu items.
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
  },

  // Page Definitions
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
    "sign-in": {
      start: "Hesabınıza",
      end: "giriş yapın.",
    },
    "password-reset": {
      title: "Şifre Sıfırlama",
      description: "Şifrenizi sıfırlamak için gerekli bilgileri aşağıya girin.",
      "recovery-codes": "Kurtarma Kodları",
      "recovery-code": "Kurtarma Kodu {{index}}",
      "back-to-login": "Girişe Geri Dön",
    },
  },

  welcomeMessage: {
    part1:
      "AnythingLLM'e hoş geldiniz. AnythingLLM, Mintplex Labs tarafından geliştirilen açık kaynaklı bir yapay zeka aracıdır ve her şeyi, sorgulayabileceğiniz ve sohbet edebileceğiniz eğitimli bir chatbota dönüştürür. AnythingLLM, BYOK (kendi anahtarlarınızı getirin) yazılımıdır; bu nedenle, kullanmak istediğiniz hizmetler dışında herhangi bir abonelik, ücret ya da ek masraf yoktur.",
    part2:
      "AnythingLLM, OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB ve benzeri güçlü yapay zeka ürünlerini zahmetsizce, düzenli bir paket içinde bir araya getirmenin en kolay yoludur; böylece verimliliğinizi 100 kat artırabilirsiniz.",
    part3:
      "AnythingLLM tamamen yerel olarak makinenizde çok az kaynakla çalışabilir—orada olduğunu bile fark etmezsiniz! GPU gerekmez. Bulut veya şirket içi (on-premises) kurulum da mevcuttur.\nYapay zeka araç ekosistemi her geçen gün daha da güçleniyor. AnythingLLM bu gücü kolayca kullanmanızı sağlar.",
    githubIssue: "Github'da bir sorun oluşturun",
    user1: "Nasıl başlarım?!",
    part4:
      "Bu çok basit. Tüm koleksiyonlar, 'Çalışma Alanları' (Workspaces) adını verdiğimiz gruplar halinde düzenlenir. Çalışma Alanları; dosyalar, belgeler, resimler, PDF'ler ve diğer dosyaların LLM'lerin anlayabileceği ve sohbette kullanabileceği biçime dönüştürüleceği gruplardır.\n\nİstediğiniz zaman dosya ekleyip kaldırabilirsiniz.",
    createWorkspace: "İlk çalışma alanınızı oluşturun",
    user2:
      "Bu bir tür yapay zeka Dropbox'ı gibi mi? Peki sohbet etmek nasıl? Bir chatbot değil mi?",
    part5:
      "AnythingLLM, sıradan bir Dropbox'tan çok daha fazlasıdır.\n\nAnythingLLM, verilerinizle etkileşime geçmenin iki yolunu sunar:\n\n<i>Sorgu (Query):</i> Sohbetleriniz, çalışma alanınızdaki belgelere erişip onlardan elde ettiği verileri veya çıkarımları size sunar. Çalışma Alanınıza daha fazla belge eklemek, onu daha akıllı hâle getirir!\n\n<i>Konuşma (Conversational):</i> Belgeleriniz ve devam eden sohbet geçmişiniz, aynı anda LLM'in bilgi tabanına katkıda bulunur. Bu, gerçek zamanlı metin bilgileri, düzeltmeler veya LLM'nin yanlış anlayabileceği noktaların düzeltilmesi için mükemmeldir.\n\nSohbet esnasında, <i>iki mod arasında istediğiniz an</i> geçiş yapabilirsiniz!",
    user3: "Vay, harika görünüyor. Hemen denemek istiyorum!",
    part6: "İyi eğlenceler!",
    starOnGithub: "GitHub'da Yıldız Verin",
    contact: "Mintplex Labs ile İletişime Geçin",
  },

  "new-workspace": {
    title: "Yeni Çalışma Alanı",
    placeholder: "Benim Çalışma Alanım",
  },

  // Workspace Settings menu items
  "workspaces—settings": {
    general: "Genel Ayarlar",
    chat: "Sohbet Ayarları",
    vector: "Vektör Veritabanı",
    members: "Üyeler",
    agent: "Ajan Yapılandırması",
  },

  // General Appearance
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

  // Chat Settings
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
    },
    refusal: {
      title: "Sorgu Modu Ret Yanıtı",
      "desc-start": "Eğer",
      query: "sorgu",
      "desc-end":
        "modunda bağlam bulunamazsa, özel bir ret yanıtı döndürmek isteyebilirsiniz.",
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

  // Vector Database
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

  // Agent Configuration
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

  // Workspace Chats
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

  // Appearance
  appearance: {
    title: "Görünüm",
    description: "Platformunuzun görünüm ayarlarını özelleştirin.",
    logo: {
      title: "Logoyu Özelleştir",
      description:
        "Özel bir logo yükleyerek chatbot'unuzu kendinize ait hale getirin.",
      add: "Özel bir logo ekle",
      recommended: "Önerilen boyut: 800 x 200",
      remove: "Kaldır",
      replace: "Değiştir",
    },
    message: {
      title: "Mesajları Özelleştir",
      description:
        "Kullanıcılarınıza gösterilen otomatik mesajları özelleştirin.",
      new: "Yeni",
      system: "sistem",
      user: "kullanıcı",
      message: "mesaj",
      assistant: "AnythingLLM Sohbet Asistanı",
      "double-click": "Düzenlemek için çift tıklayın...",
      save: "Mesajları Kaydet",
    },
    icons: {
      title: "Özel Altbilgi Simgeleri",
      description:
        "Kenar çubuğunun altında görüntülenen altbilgi simgelerini özelleştirin.",
      icon: "Simge",
      link: "Bağlantı",
    },
  },

  // API Keys
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
      description:
        "AnythingLLM'nin yerel gömme motoru kullanıldığında ek bir kurulum gerekmez.",
    },
  },

  // Text Splitting & Chunking Preferences
  text: {
    title: "Metin Bölme & Parçalama Tercihleri",
    "desc-start":
      "Bazı durumlarda, yeni belgelerin vektör veritabanınıza eklenmeden önce hangi varsayılan yöntemle bölünüp parçalanacağını değiştirmek isteyebilirsiniz.",
    "desc-end":
      "Metin bölmenin nasıl çalıştığını ve olası yan etkilerini tam olarak bilmiyorsanız bu ayarı değiştirmemelisiniz.",
    "warn-start": "Buradaki değişiklikler yalnızca",
    "warn-center": "yeni eklenen belgeler",
    "warn-end": "için geçerli olacak, mevcut belgelere uygulanmaz.",
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

  // Vector Database
  vector: {
    title: "Vektör Veritabanı",
    description:
      "AnythingLLM örneğinizin nasıl çalışacağını belirleyen kimlik bilgileri ve ayarları burada bulunur. Bu anahtarların güncel ve doğru olması önemlidir.",
    provider: {
      title: "Vektör Veritabanı Sağlayıcısı",
      description: "LanceDB için ek bir yapılandırma gerekmez.",
    },
  },

  // Embeddable Chat Widgets
  embeddable: {
    title: "Gömülebilir Sohbet Widget'ları",
    description:
      "Gömülebilir sohbet widget'ları, herkese açık olan ve tek bir çalışma alanına bağlı sohbet arayüzleridir. Bu sayede oluşturduğunuz çalışma alanlarını dünyaya açık hâle getirebilirsiniz.",
    create: "Gömme oluştur",
    table: {
      workspace: "Çalışma Alanı",
      chats: "Gönderilen Sohbetler",
      Active: "Aktif Alan Adları",
    },
  },

  // Embed Chats
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

  // Multi-User Mode
  multi: {
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
    password: {
      title: "Şifre Koruması",
      description:
        "AnythingLLM örneğinizi bir şifre ile koruyun. Bu şifreyi unutmanız hâlinde kurtarma yöntemi yoktur, bu yüzden mutlaka güvende saklayın.",
    },
    instance: {
      title: "Örneği Şifreyle Koru",
      description:
        "Varsayılan olarak tek yönetici sizsiniz. Yönetici olarak yeni kullanıcılar veya yöneticiler için hesap oluşturmanız gerekir. Şifrenizi kaybetmeyin çünkü yalnızca bir Yönetici kullanıcı şifreleri sıfırlayabilir.",
      password: "Örnek Şifresi",
    },
  },

  // Event Logs
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

  // Privacy & Data-Handling
  privacy: {
    title: "Gizlilik & Veri İşleme",
    description:
      "Bağlantılı üçüncü taraf sağlayıcılarla ve AnythingLLM ile verilerinizin nasıl ele alındığını burada yapılandırabilirsiniz.",
    llm: "LLM Seçimi",
    embedding: "Gömme Tercihi",
    vector: "Vektör Veritabanı",
    anonymous: "Anonim Telemetri Etkin",
  },
};

export default TRANSLATIONS;
