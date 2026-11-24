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
      howManyUsers: "Bu kurulumu kaç kişi kullanacak?",
      justMe: "Sadece ben",
      myTeam: "Ekibim",
      instancePassword: "Kurulum Parolası",
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
    saved: "Kaydedildi",
    save: "Değişiklikleri Kaydet",
    previous: "Önceki Sayfa",
    next: "Sonraki Sayfa",
    optional: "İsteğe bağlı",
    yes: "Evet",
    no: "Hayır",
    search: "Ara",
    username_requirements:
      "Kullanıcı adı 2-64 karakter uzunluğunda olmalı, küçük harfle başlamalı ve yalnızca küçük harfler, rakamlar, alt çizgiler, tireler ve noktalar içermelidir.",
    on: "Açık",
    none: "Yok",
    stopped: "Durdu",
    loading: "Yükleniyor",
    refresh: "Yenile",
    noResults: "Hiçbir sonuç bulunamadı",
  },
  settings: {
    title: "Kurulum Ayarları",
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
    "system-prompt-variables": "Sistem İstemi Değişkenleri",
    interface: "Arayüz Tercihleri",
    branding: "Marka & Beyaz Etiketleme",
    chat: "Sohbet",
    "mobile-app": "AnythingLLM Mobil",
    "community-hub": {
      title: "Topluluk Merkezi",
      trending: "Popüler olanları keşfedin",
      "your-account": "Hesabınız",
      "import-item": "Öğe İçe Aktar",
    },
    channels: "Kanallar",
    "available-channels": {
      telegram: "Telegram",
    },
    "scheduled-jobs": "Zamanlanmış Görevler",
    "model-router": "Model Yönlendirici",
    "image-generation": "Görsel Oluşturma",
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
          "LLM'nin genel bilgisi <b>ve</b> bulunan belge bağlamıyla yanıt verir.<br />Araçları kullanmak için @agent komutunu kullanmanız gerekir.",
      },
      query: {
        title: "Sorgu",
        description:
          "<b>Yalnızca</b> belge bağlamı bulunduğunda yanıt verir.<br />Araçları kullanmak için @agent komutunu kullanmanız gerekir.",
      },
      automatic: {
        description:
          "Model ve sağlayıcı yerleşik araç çağırmayı destekliyorsa araçları otomatik olarak kullanır.<br />Yerleşik araç çağırma desteklenmiyorsa araçları kullanmak için @agent komutunu kullanmanız gerekir.",
        title: "Ajan",
      },
    },
    history: {
      title: "Sohbet Geçmişi",
      "desc-start":
        "Yanıta dahil edilecek önceki sohbetlerin sayısı (kısa süreli hafıza).",
      recommend: "20 önerilir. ",
    },
    prompt: {
      title: "İstem",
      description:
        "Bu çalışma alanında kullanılacak istem. Yapay zekânın yanıt üretirken kullanacağı bağlamı ve talimatları tanımlayın. Uygun ve doğru yanıtlar için isteminizi özenle hazırlayın.",
      history: {
        title: "Sistem İstemi Geçmişi",
        clearAll: "Tümünü Temizle",
        noHistory: "Sistem istemi geçmişi yok",
        restore: "Geri Yükle",
        delete: "Sil",
        deleteConfirm: "Bu geçmiş öğesini silmek istediğinizden emin misiniz?",
        clearAllConfirm:
          "Tüm geçmişi temizlemek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
        expand: "Genişlet",
        publish: "Topluluk Merkezinde Yayımla",
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
      "desc-end":
        "Sayı yükseldikçe yaratıcı yanıtlar artar. Bazı modeller için bu değer çok yüksek ayarlandığında anlamsız yanıtlar ortaya çıkabilir.",
      placeholder: "Sağlayıcı varsayılanı",
    },
    reasoning_effort: {
      title: "Akıl Yürütme Düzeyi",
      default: "Sağlayıcı varsayılanı",
      cannot_disable: "Bu model akıl yürütmeyi kapatamaz.",
      levels: {
        off: "Kapalı",
        on: "Açık",
        minimal: "Minimum",
        low: "Düşük",
        medium: "Orta",
        high: "Yüksek",
        xhigh: "Çok yüksek",
        max: "Maksimum",
      },
    },
    token_limit_reached:
      "Cevap, maksimum çıktı token limitine ulaştı. Modelin maksimum çıktı token sayısını artırarak daha uzun cevaplar almayı sağlayın.",
    no_response: "Model yanıt veremedi.",
    agent_session_exited: "Ajan oturumunu sonlandırdınız.",
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
          "Dosya sistemine erişim tehlikeli olabilir, çünkü dosyaları değiştirebilir veya silebilir. Bu özelliği etkinleştirmeden önce lütfen <a>belgelendirme</a>'i inceleyin.",
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
          "write-text-file": {
            title: "Metin dosyası oluştur",
            description:
              "Yeni metin dosyaları oluşturun veya mevcut metin dosyalarını üzerine yazın.",
          },
        },
      },
      createFiles: {
        title: "Belge Oluşturma",
        description:
          "Temsilcinizin, PowerPoint sunumları, Excel tabloları, Word belgeleri ve PDF dosyaları gibi ikili belge formatları oluşturmasına olanak tanıyın. Dosyalar doğrudan sohbet penceresinden indirilebilir.",
        configuration: "Mevcut Belgeler Türleri",
        skills: {
          "create-text-file": {
            title: "Metin dosyaları",
            description:
              "Herhangi bir içerik ve uzantıyla (örneğin .txt, .md, .json, .csv vb.) metin dosyaları oluşturun.",
          },
          "create-pptx": {
            title: "PowerPoint sunumları",
            description:
              "Yeni PowerPoint sunumları oluşturun, slaytlar, başlıklar ve madde işaretleri ekleyin.",
          },
          "create-pdf": {
            title: "PDF belgeleri",
            description:
              "Temel stillerle markdown veya düz metinlerden PDF belgeleri oluşturun.",
          },
          "create-xlsx": {
            title: "Excel elektronik tabloları",
            description:
              "Tablo formatındaki veriler için, sayfalar ve stil özellikleriyle Excel belgeleri oluşturun.",
          },
          "create-docx": {
            title: "Kelime belgeleri",
            description:
              "Temel stil ve biçimlendirme ile Word belgeleri oluşturun.",
          },
        },
      },
      gmail: {
        title: "GMail Bağlantısı",
        description:
          "Ajantınızın Gmail ile etkileşim kurmasını sağlayın: e-postaları aratın, sohbetleri okuyun, taslaklar oluşturun, e-postalar gönderin ve posta kutunuzu yönetin. <a>Dokümantasyonu okuyun</a>.",
        multiUserWarning:
          "Gmail entegrasyonu, güvenlik nedenlerinden dolayı çoklu kullanıcı modunda mevcut değildir. Bu özelliği kullanmak için lütfen çoklu kullanıcı modunu devre dışı bırakın.",
        configuration: "Gmail Yapılandırma",
        deploymentId: "Dağıtım Kimliği",
        deploymentIdHelp:
          "Google Apps Script web uygulamanızın uygulama kimliği",
        apiKey: "API Anahtarı",
        apiKeyHelp:
          "Google Apps Script kurulumunuzda yapılandırdığınız API anahtarı",
        configurationRequired:
          "Lütfen Dağıtım Kimliğini ve API Anahtarını yapılandırarak Gmail yeteneklerini etkinleştirin.",
        configured: "Yapılandırılmış",
        searchSkills: "Arama becerileri...",
        noSkillsFound:
          "Belirttiğiniz kriterlere uyan herhangi bir sonuç bulunamadı.",
        categories: {
          search: {
            title: "E-postaları arayın ve okuyun",
            description: "Gmail hesabınızdaki e-postaları arayın ve okuyun.",
          },
          drafts: {
            title: "Taslak E-postalar",
            description:
              "E-posta taslaklarını oluşturun, düzenleyin ve yönetin.",
          },
          send: {
            title: "E-postaları gönderme ve yanıt verme",
            description:
              "E-postalar gönderin ve tartışmalara anında yanıt verin.",
          },
          threads: {
            title: "E-posta dizilerini yönetin",
            description:
              "E-posta dizilerini yönetin - okundu/okunmadı olarak işaretleme, arşivleme, çöp kutusuna gönderme",
          },
          account: {
            title: "Entegrasyon İstatistikleri",
            description:
              "Post kutunuzdaki istatistikleri ve hesap bilgilerinizi görüntüleyin.",
          },
        },
        skills: {
          search: {
            title: "E-postaları arayın",
            description: "Gmail sorgu sözdizimi kullanarak e-postaları arayın",
          },
          readThread: {
            title: "Makaleyi oku",
            description:
              "ID numarasına göre, e-posta iletişimin bütününü okuyun.",
          },
          createDraft: {
            title: "Taslak Oluştur",
            description: "Yeni bir e-posta taslağı oluşturun",
          },
          createDraftReply: {
            title: "Taslak Yanıt Oluştur",
            description:
              "Mevcut bir tartışma başlığına yönelik bir yanıt taslağı oluşturun.",
          },
          updateDraft: {
            title: "Taslak Güncelleme",
            description: "Mevcut bir e-posta taslağını güncelleyin",
          },
          getDraft: {
            title: "Taslakları görüntüle",
            description: "Belirli bir taslağı, ID numarası ile alın",
          },
          listDrafts: {
            title: "Taslaklar",
            description: "Tüm taslak e-postaları listele",
          },
          deleteDraft: {
            title: "Taslağı Sil",
            description: "Bir taslak e-postayı sil",
          },
          sendDraft: {
            title: "Taslak Gönder",
            description: "Mevcut bir e-posta taslağını gönderin",
          },
          sendEmail: {
            title: "E-posta gönder",
            description: "Hemen bir e-posta gönderin",
          },
          replyToThread: {
            title: "Konuya Cevap Ver",
            description: "Bir e-posta dizisine anında yanıt verin",
          },
          markRead: {
            title: "মার্ক रीड",
            description: "Bir konuyla ilgili mesajları okundu olarak işaretle.",
          },
          markUnread: {
            title: "Okunmadı olarak işaretle",
            description: 'Bir gönderiyi "okunmamış" olarak işaretle.',
          },
          moveToTrash: {
            title: "Çöp kutusuna taşı",
            description: "Bir başlığı çöp kutusuna taşı.",
          },
          moveToArchive: {
            title: "Arşiv",
            description: "Bir konuyu arşivle",
          },
          moveToInbox: {
            title: "Gelen kutusuna taşı",
            description:
              "Bir konuyla ilgili mesajları ana posta kutusuna taşı.",
          },
          getMailboxStats: {
            title: "Posta Kutusu İstatistikleri",
            description:
              "Okunmamış mesaj sayılarını ve posta kutusu istatistiklerini görüntüleyin.",
          },
          getInbox: {
            title: "Gelen kutusuna eriş",
            description:
              "Gmail'den gelen e-postaları hızlı ve kolay bir şekilde görüntüleme yolu.",
          },
        },
      },
      outlook: {
        title: "Outlook Bağlayıcı",
        description:
          "Ajanınızın Microsoft Outlook ile etkileşim kurmasını sağlayın: e-postaları arayın, yazışmaları okuyun, taslaklar oluşturun, e-posta gönderin ve Microsoft Graph API aracılığıyla gelen kutunuzu yönetin. <a>Belgeleri okuyun</a>.",
        multiUserWarning:
          "Outlook entegrasyonu, güvenlik nedenleriyle çoklu kullanıcı modunda mevcut değildir. Bu özelliği kullanmak için lütfen çoklu kullanıcı modunu devre dışı bırakın.",
        configuration: "Outlook Yapılandırması",
        authType: "Hesap Türü",
        authTypeHelp:
          'Hangi tür Microsoft hesaplarının kimlik doğrulamasına izin verileceğini seçin. "Tüm hesaplar" hem kişisel hem de iş/okul hesaplarını destekler. "Sadece kişisel hesaplar" yalnızca kişisel Microsoft hesaplarını kısıtlar. "Sadece kuruluş hesapları" belirli bir Azure AD kiracısından iş/okul hesaplarını kısıtlar.',
        authTypeCommon: "Tüm hesaplar (kişisel ve iş/okul)",
        authTypeConsumers: "Sadece bireysel Microsoft hesapları",
        authTypeOrganization:
          "Sadece kuruluş hesapları (Kira sahibi kimlik numarası gerektirir)",
        clientId: "Uygulama (Müşteri) Kimliği",
        clientIdHelp:
          "Azure AD uygulamanızın kaydından elde ettiğiniz Uygulama (Müşteri) Kimliği",
        tenantId: "Kiralık Konut Kimlik No",
        tenantIdHelp:
          "Azure AD uygulamanızın kayıt bilgilerinden elde edilen (Kiralık Alan) Kimliği. Sadece kuruluş içi kimlik doğrulama için gereklidir.",
        clientSecret: "Müşteri sırrı",
        clientSecretHelp:
          "Azure AD uygulamanızın kaydından elde edilen istemci sır değeri",
        configurationRequired:
          "Lütfen, Outlook işlevlerini etkinleştirmek için Client ID ve Client Secret değerlerini yapılandırın.",
        authRequired:
          "Öncelikle kimlik bilgilerinizi kaydedin, ardından kurulumu tamamlamak için Microsoft ile kimliğinizi doğrulayın.",
        authenticateWithMicrosoft: "Microsoft ile kimliğinizi doğrulayın",
        authenticated:
          "Microsoft Outlook ile başarılı bir şekilde kimlik doğrulaması tamamlandı.",
        revokeAccess: "Erişi İptal Et",
        configured: "Yapılandırılmış",
        searchSkills: "Arama becerileri...",
        noSkillsFound:
          "Belirttiğiniz kriterlere uyan herhangi bir sonuç bulunamadı.",
        categories: {
          search: {
            title: "E-postaları arayın ve okuyun",
            description:
              "Outlook posta kutunuzdan e-postaları arayın ve okuyun.",
          },
          drafts: {
            title: "Örnek E-postalar",
            description: "E-posta taslaklarını oluştur, düzenle ve yönet",
          },
          send: {
            title: "E-posta gönderme",
            description:
              "Yeni e-postalar gönderin veya mesajlara anında cevap verin.",
          },
          account: {
            title: "Entegrasyon İstatistikleri",
            description:
              "Post kutunuzdaki istatistikleri ve hesap bilgilerinizi görüntüleyin.",
          },
        },
        skills: {
          getInbox: {
            title: "Gelen kutusuna eriş",
            description:
              "En son gelen e-postalarınızı Outlook posta kutunuzdan alın.",
          },
          search: {
            title: "E-postaları arayın",
            description:
              "Microsoft arama sözdizimi kullanarak e-postaları arayın",
          },
          readThread: {
            title: "Sohbeti okuyun",
            description: "Tam bir e-posta konuşma dizisini okuyun.",
          },
          createDraft: {
            title: "Taslak Oluştur",
            description:
              "Yeni bir e-posta taslağı oluşturun veya mevcut bir mesajın yanıtını taslağına ekleyin.",
          },
          updateDraft: {
            title: "Taslak Güncelleme",
            description: "Mevcut bir e-posta taslağını güncelleyin",
          },
          listDrafts: {
            title: "Taslaklar",
            description: "Tüm taslak e-postaları listele",
          },
          deleteDraft: {
            title: "Taslak Sil",
            description: "Bir taslak e-postayı sil",
          },
          sendDraft: {
            title: "Taslak Gönder",
            description: "Mevcut bir e-posta taslağını gönderin",
          },
          sendEmail: {
            title: "E-posta gönder",
            description:
              "Yeni bir e-posta gönderin veya mevcut bir mesajı hemen yanıtlayın.",
          },
          getMailboxStats: {
            title: "Post kutusu istatistikleri",
            description:
              "Klasörlerin ve posta kutusu istatistiklerinin sayısını alın.",
          },
        },
      },
      googleCalendar: {
        title: "Google Takvim Bağlayıcı",
        description:
          "Ajanınızın Google Takvim ile etkileşim kurmasını sağlayın: takvimleri görüntüleyin, etkinlikleri alın, oluşturun ve güncelleyin; katılım yanıtlarını yönetin. <a>Belgeleri okuyun</a>.",
        multiUserWarning:
          "Google Takvim entegrasyonu, güvenlik nedeniyle çok kullanıcılı modda kullanılamaz. Bu özelliği kullanmak için çok kullanıcılı modu devre dışı bırakın.",
        configuration: "Google Takvim Yapılandırması",
        deploymentId: "Dağıtım Kimliği",
        deploymentIdHelp:
          "Google Apps Script web uygulamanızın dağıtım kimliği",
        apiKey: "API Anahtarı",
        apiKeyHelp:
          "Google Apps Script dağıtımınızda yapılandırdığınız API anahtarı",
        configurationRequired:
          "Lütfen Dağıtım Kimliğini ve API Anahtarını yapılandırarak Google Takvim özelliklerini etkinleştirin.",
        configured: "Yapılandırılmış",
        searchSkills: "Arama becerileri...",
        noSkillsFound:
          "Arama sonuçlarınızda eşleşen herhangi bir beceri bulunmamaktadır.",
        categories: {
          calendars: {
            title: "Takvimler",
            description: "Google Takvimlerinizi görüntüleyin ve yönetin",
          },
          readEvents: {
            title: "Etkinlikleri oku",
            description: "Takvimdeki etkinlikleri görüntüleyin ve arayın",
          },
          writeEvents: {
            title: "Etkinlikleri Oluştur ve Güncelle",
            description:
              "Yeni etkinlikler oluşturun ve mevcut olanları değiştirin.",
          },
          rsvp: {
            title: "Katılım Yönetimi",
            description: "Etkinliklere ilişkin yanıt durumunuzu yönetin",
          },
        },
        skills: {
          listCalendars: {
            title: "Takvim Listeleri",
            description:
              "Sahip olduğunuz veya abonelik yaptığınız tüm takvimleri listeleyin.",
          },
          getCalendar: {
            title: "Takvim Detaylarını Al",
            description: "Belirli bir takvim hakkında ayrıntılı bilgi edinin.",
          },
          getEvent: {
            title: "Etkinliği Bul",
            description: "Belirli bir etkinlikle ilgili ayrıntılı bilgi edinin",
          },
          getEventsForDay: {
            title: "Gün İçindeki Etkinlikleri Öğren",
            description:
              "Belirli bir güne ait tüm planlanan etkinlikleri görüntüleyin.",
          },
          getEvents: {
            title: "Etkinlikleri (Tarih Aralığı) görüntüle",
            description: "Belirli bir tarih aralığındaki etkinlikleri alın",
          },
          getUpcomingEvents: {
            title: "Yaklaşan Etkinlikleri Görüntüleyin",
            description:
              "Bugün, bu hafta veya bu ay için etkinlikleri, basit anahtar kelimeler kullanarak bulun.",
          },
          quickAdd: {
            title: "Hızlı Etkinlik Ekle",
            description:
              'Doğal dilden bir etkinlik oluşturun (örneğin, "Yarın saat 15:00\'te bir toplantı")',
          },
          createEvent: {
            title: "Etkinlik Oluştur",
            description:
              "Tüm özellikler üzerinde tam kontrol sağlayarak yeni bir etkinlik oluşturun.",
          },
          updateEvent: {
            title: "Etkinliği Güncelle",
            description: "Mevcut bir takvim olayını güncelleyin",
          },
          setMyStatus: {
            title: "Katılım Yanıtını Ayarla",
            description:
              "Bir etkinliğe katılımı kabul edin, reddedin veya geçici olarak kabul edin.",
          },
        },
      },
      scheduledJob: {
        title: "Zamanlanmış görev oluştur",
        description:
          'Ajanın sohbetten otomatik yinelenen görevler oluşturmasına izin verin (ör. "her hafta içi saat 09:00\'da gelen kutumu özetle ve bana e-postayla gönder"). Yalnızca tek kullanıcılı modda kullanılabilir.',
      },
      generateImage: {
        title: "Görseller oluştur",
        description:
          "Ajanın, yapılandırılmış görsel üretim sağlayıcınızla sohbetten görsel oluşturmasına veya ekli görselleri düzenlemesine izin verin.",
      },
    },
    mcp: {
      title: "MCP Sunucuları",
      "loading-from-config":
        "MCP sunucuları yapılandırma dosyasından yükleniyor",
      "learn-more": "MCP sunucuları hakkında daha fazla bilgi edinin.",
      "no-servers-found": "Hiçbir MCP sunucusu bulunamadı.",
      "tool-warning":
        "En iyi performansı elde etmek için, gereksiz araçları devre dışı bırakarak bağlamı korumayı düşünebilirsiniz.",
      "stop-server": "MCP sunucusunu durdurun",
      "start-server": "MCP sunucusunu başlatın",
      "delete-server": "MCP sunucusunu sil",
      "tool-count-warning":
        "Bu MCP sunucusunda <b>{{count}} araç etkin</b> ve bu araçlar her sohbette bağlam tüketir.<br />Bağlamı korumak için istenmeyen araçları devre dışı bırakmayı düşünebilirsiniz.",
      "startup-command": "Başlangıç Komutu",
      command: "Komut",
      arguments: "Bağımsız değişkenler",
      "not-running-warning":
        "Bu MCP sunucusu çalışmıyor; durdurulmuş veya başlatılırken hata vermiş olabilir.",
      "tool-call-arguments": "Araç çağrısı bağımsız değişkenleri",
      "tools-enabled": "araç etkin",
    },
    settings: {
      title: "Ajan Becerisi Ayarları",
      "max-tool-calls": {
        title: "Her yanıt için maksimum araç çağrı sayısı",
        description:
          "Bir ajanın tek bir yanıt için art arda çağırabileceği en fazla araç sayısı. Kontrolsüz araç çağrılarını ve sonsuz döngüleri önler.",
      },
      "intelligent-skill-selection": {
        title: "Akıllı Beceri Seçimi",
        description:
          "Sorgu başına token kullanımını %80'e kadar azaltırken sınırsız araç etkinleştirin. AnythingLLM her istek için uygun becerileri otomatik seçer.",
        "max-tools": {
          title: "En Fazla Araç",
          description:
            "Her sorgu için seçilebilecek maksimum araç sayısı. Daha büyük bağlam modelleri için bu değeri daha yüksek bir değere ayarlamayı öneririz.",
        },
      },
      "clarifying-questions": {
        title: "Ajanın açıklayıcı sorular sormasına izin ver",
        "beta-badge": "BETA",
        description:
          "Etkinleştirildiğinde ajan, talimatınız belirsizse kısa açıklayıcı sorular sormak için durabilir.",
        "max-per-turn": {
          title: "Her turda sorulabilecek maksimum soru sayısı",
          description:
            "Bir turda ajanın sorabileceği en fazla açıklayıcı soru sayısı.",
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
      prompt: "İstem",
      response: "Yanıt",
      at: "Gönderilme Zamanı",
    },
  },
  api: {
    title: "API anahtarları",
    description:
      "API anahtarları, bu AnythingLLM örneğine programatik olarak erişmeye ve yönetmeye olanak tanır.",
    link: "API dokümantasyonunu okuyun",
    generate: "Yeni API Anahtarı Oluştur",
    empty: "API anahtarları bulunamadı",
    actions: "İşlemler",
    messages: {
      error: "Hata: {{error}}",
    },
    modal: {
      title: "Yeni API anahtarı oluştur",
      cancel: "İptal",
      close: "Kapat",
      create: "API anahtarı oluştur",
      helper:
        "Oluşturulduktan sonra API anahtarı, bu AnythingLLM örneğine programatik olarak erişmek ve onu yapılandırmak için kullanılabilir.",
      name: {
        label: "Ad",
        placeholder: "Üretim entegrasyonu",
        helper:
          "İsteğe bağlıdır. Bu anahtarı daha sonra kolayca tanıyabilmek için açıklayıcı bir ad kullanın.",
      },
    },
    row: {
      copy: "API anahtarını kopyala",
      copied: "Kopyalandı",
      unnamed: "--",
      deleteConfirm:
        "Bu API anahtarını devre dışı bırakmak istediğinizden emin misiniz?\nBunu yaptıktan sonra artık kullanılamaz.\n\nBu işlem geri alınamaz.",
    },
    table: {
      name: "Ad",
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
        agent_api: "Ajan API'si",
        agent_api_tooltip:
          "Ajan çağrıları için kullanılan API. Dağıtımınız Responses API gerektirmiyorsa (ör. araçlarla GPT-6) Chat Completions'ı koruyun. Her model veya bölge Responses API'yi desteklemez.",
        chat_completions: "Chat Completions",
        responses: "Responses API",
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
      feedback: "Geri bildirim",
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
        " olmadan GitHub API'si, hız sınırları nedeniyle toplanabilecek dosya sayısını sınırlayabilir. Bu sorunu önlemek için ",
      token_explained_link2: "geçici bir erişim tokeni oluşturabilirsiniz",
      token_explained_end: ".",
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
        " olmadan GitLab API'si, hız sınırları nedeniyle toplanabilecek dosya sayısını sınırlayabilir. Bu sorunu önlemek için ",
      token_explained_link2: "geçici bir erişim tokeni oluşturabilirsiniz",
      token_explained_end: ".",
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
      save_embed: "Kaydet ve Göm",
      "total-documents_one": "{{count}} belge",
      "total-documents_other": "{{count}} belge",
      "search-results_one": "{{count}} sonuç",
      "search-results_other": "{{count}} sonuç",
      "in-workspace": "Çalışma alanında",
      "upload-files": "Dosyaları yükle",
      "add-link": "Bağlantıyı ekle",
      "selected-count_one": "{{count}} seçildi",
      "selected-count_other": "{{count}} seçildi",
      "move-to-folder": "Klasöre taşı",
      "ready-to-embed_one": "{{count}} dosya gömme için hazır",
      "ready-to-embed_other": "{{count}} dosya gömme için hazır",
      "add-to-queue": "Kuyruğa ekle",
      staged: "Gömme için hazır",
      pinned: "Sabitlendi",
      watching: "İzleniyor",
      pin: "Çalışma alanına sabitle",
      unpin: "Sabitlemeyi kaldır",
      watch: "Değişiklikleri izle",
      unwatch: "Değişiklikleri izlemeyi durdur",
      "remove-from-workspace": "Çalışma alanından çıkarın",
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
    gitea: {
      name: "Gitea Deposu",
      description:
        "Herhangi bir Gitea örneğinden, kamu veya özel bir depoyu tek tıklamayla içe aktarın.",
      URL: "Gitea Depo URL'si",
      URL_explained:
        "Gitea örneğinizde toplamak istediğiniz deponun URL'si – kendi barındırdığınız örnekler de desteklenmektedir.",
      token: "Gitea Erişim Tokenı",
      optional: "isteğe bağlı",
      token_explained:
        "Özel depoları veya kimlik doğrulama gerektiren sunuculardaki depoları toplamak için erişim token'ına ihtiyaç vardır.",
      token_explained_start: "Bir ",
      token_explained_link1: "Erişim Tokenı",
      token_explained_end:
        " olmadan yalnızca Gitea kurulumunuzdaki herkese açık depolardan veri toplanabilir.",
      ignores: "Yok Sayılacak Dosyalar",
      git_ignore:
        "`.gitignore` formatında belirli dosyaların toplanma sırasında göz ardı edilmesini sağlamak için bir liste oluşturun. Kaydetmek istediğiniz her girişte Enter tuşuna basın.",
      task_explained:
        "İşlemler tamamlandıktan sonra, tüm dosyalar doküman seçici aracında çalışma alanlarına entegre etmek için kullanılabilir olacaktır.",
      branch: "Dosyaların alınacağı dal.",
      branch_loading: "-- mevcut dallar yükleniyor --",
      branch_explained: "Dosyaların alınacağı dal.",
      token_information:
        "<b>Gitea Erişim Tokenı</b> girilmezse bu veri bağlayıcısı yalnızca Gitea kurulumunuzdaki <b>herkese açık</b> depoların dosyalarını toplayabilir.",
    },
  },
  chat_window: {
    send_message: "Mesaj gönderin",
    attach_file: "Bu sohbete bir dosya ekleyin",
    text_size: "Metin boyutunu değiştirin.",
    microphone: "İsteminizi sesli söyleyin",
    send: "Çalışma alanına istem gönder",
    attachments_processing: "Ekler işleniyor. Lütfen bekleyin...",
    tts_speak_message: "TTS Mesajı Seslendir",
    copy: "Kopyala",
    regenerate: "Yeniden Oluştur",
    regenerate_response: "Yanıtı yeniden oluştur",
    good_response: "İyi yanıt",
    more_actions: "Daha fazla eylem",
    fork: "Dallandır",
    delete: "Sil",
    cancel: "İptal",
    edit_prompt: "İstemi düzenle",
    edit_response: "Yanıtı düzenle",
    preset_reset_description:
      "Sohbet geçmişinizi temizleyin ve yeni bir sohbet başlatın",
    add_new_preset: " Yeni Ön Ayar Ekle",
    command: "Komut",
    your_command: "sizin-komutunuz",
    placeholder_prompt: "İsteminizin başına eklenecek içerik.",
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
    similarity_match: "eşleşme",
    source_count_one: "{{count}} kaynak",
    source_count_other: "{{count}} kaynak",
    add_new: "Yeni ekle",
    edit: "Düzenle",
    publish: "Yayınla",
    stop_generating: "Yanıt üretmeyi durdurun",
    slash_commands: "Eğik Çizgi Komutları",
    agent_skills: "Ajan Becerileri",
    manage_agent_skills: "Ajan becerilerini yönet",
    agent_skills_disabled_in_session:
      "Aktif bir ajan oturumunda becerileri değiştirilemez. İlk olarak /exit komutunu kullanarak oturumu sonlandırın.",
    start_agent_session: "Ajan Oturumu Başlat",
    use_agent_session_to_use_tools:
      'Sohbette araç kullanmak için isteminizin başına "@agent" yazarak ajan oturumu başlatın.',
    agent_invocation: {
      model_wants_to_call: "Model şu aracı çağırmak istiyor",
      approve: "Onayla",
      reject: "Reddet",
      always_allow: "{{skillName}} için her zaman izin ver",
      tool_call_was_approved: "Araç talebi onaylandı.",
      tool_call_was_rejected: "Araç çağrısı reddedildi.",
      clarifying_skip: "Ajan karar versin",
      clarifying_submit: "Gönder",
      clarifying_skipped: "Karar ajana bırakıldı.",
      clarifying_timeout: "Zamanında yanıt alınamadı.",
      clarifying_pagination: "{{current}} / {{total}}",
      clarifying_prev_aria: "Önceki soru",
      clarifying_next_aria: "Bir sonraki soru",
      clarifying_close_aria: "Kapat ve atla",
      clarifying_other: "Diğer",
      clarifying_other_placeholder: "Cevabınızı yazın",
      batch_progress: "{{total}} sorudan {{answered}} tanesi yanıtlandı.",
      batch_skip_this: "Bu soruyu atla",
      batch_submit_all: "Tümünü gönder",
      batch_next: "İleri",
      answer_skipped: "[Kullanıcı atladı]",
      email: {
        send_title: "E-posta gönder",
        reply_title: "Yanıt gönder",
        draft_title: "Taslak oluştur",
        draft_reply_title: "Yanıt taslağı oluştur",
        update_draft_title: "Taslağı güncelle",
        send_draft_title: "Taslağı gönder",
        via_provider: "{{provider}} üzerinden",
        to: "Kime:",
        subject: "Konu:",
        add_recipient: "Alıcı ekle",
        remove_recipient: "{{email}} adresini kaldır",
        edit: "Düzenle",
        done: "Bitti",
        deny: "Reddet",
        sent_to: "Kime: {{recipients}}",
        sent: "Gönderildi",
        saved_to: "Taslak kaydedildi · Kime: {{recipients}}",
        saved: "Taslak kaydedildi",
        attachment_one: "{{count}} ek",
        attachment_other: "{{count}} ek",
        not_sent_denied: "Gönderilmedi · ajana durması söylendi",
        not_sent_timeout: "Gönderilmedi · zamanında yanıt verilmedi",
        not_saved_denied: "Kaydedilmedi · ajana durması söylendi",
        not_saved_timeout: "Kaydedilmedi · zamanında yanıt verilmedi",
        show_preview: "E-postayı göster",
        hide_preview: "E-postayı gizle",
      },
    },
    custom_skills: "Özel Beceri",
    agent_flows: "Ajan Akışları",
    no_tools_found: "Uyumlu herhangi bir araç bulunamadı",
    loading_mcp_servers: "MCP sunucuları yükleniyor...",
    app_integrations: "Uygulama Entegrasyonları",
    sub_skills: "Alt beceriler",
    memories: {
      title: "Anılar",
      empty:
        "Şimdilik herhangi bir anı oluşmadı. Chatbot ile etkileşiminiz arttıkça, daha fazla anı oluşacaktır.",
      empty_cta: "yeni bir anı yarat",
      tab_workspace: "Çalışma alanı",
      tab_global: "Genel",
      toggle: {
        label: "Kişiselleştirme özelliğini etkinleştirin",
        description:
          "Asistanınızın, sizin veya bu çalışma ortamıyla ilgili bilgileri hatırlamasını ve bunları konuşmalarda kullanmasını sağlayın.",
      },
      auto_extraction: {
        label: "Otomatik Anılar",
        description:
          "Yardımcınızın, arka planda otomatik olarak anıları kaydetmesini sağlayın.",
      },
      menu: {
        edit: "Düzenle",
        delete: "Sil",
        move_to_global: "Genel belleğe taşı",
        move_to_workspace: "Çalışma alanı belleğine taşı",
      },
      modal: {
        create_title: "Anı Oluştur",
        edit_title: "Anıyı Düzenle",
        create_description:
          'Anılar, tek ve öz bir ifade şeklinde olmalıdır. Örneğin: "Kullanıcı, JavaScript yerine Python\'ı tercih ediyor"',
        edit_description: "Bu anının içeriğini güncelleyin.",
        label: "Anı",
        placeholder:
          "Örneğin, kullanıcının adı Joe, kullanıcı AnythingLLM üzerinde çalışıyor, vb.",
        create: "Oluştur",
        save: "Kaydet",
        cancel: "İptal et",
      },
    },
    stt_unsupported: "Bu tarayıcıda mikrofon erişimi desteklenmemektedir.",
    stt_mic_denied: "Mikrofona erişilemedi. Lütfen izin verip tekrar deneyin.",
    stt_transcription_failed: "Transkripsiyon başarısız: {{error}}",
    export: "Sohbeti dışa aktar",
    exporting: "Dışa aktarılıyor...",
    preset_img_description: "Bir metin isteminden bir görüntü oluşturun",
    generating_response: "Yanıt üretme",
    response_failed: "Mesaja cevap veremedim.",
    response_failed_reason: "Nedeni: {{reason}}",
    thought_in_progress: "Model düşünüyor...",
    thoughts: "Düşünceler",
    leave_generating: {
      title: "Yanıt üretmeyi durdurun?",
      description:
        "Şu anda bu sohbetten çıkıyorsunuz. Bu, modelin yanıt oluşturmasını durduracak ve bu durumun geri alınamayacağını ifade eder.",
      cancel: "İptal et",
      confirm: "Devam et",
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
      tabs: {
        identity: "Kimlik",
        colors: "Renkler",
        sidebar: "Kenar çubuğu",
        browser: "Tarayıcı",
      },
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
      "disable-auto-scroll": {
        title: "Otomatik kaydırma özelliğini devre dışı bırak",
        description:
          "Yeni mesajlar aldığınızda sohbetin otomatik olarak en alttaki bölüme kaydırmasını devre dışı bırakın.",
      },
      palette: {
        title: "Renk paleti",
        description:
          "Bir renk paleti seçin. Bu, hem açık hem de koyu mod için geçerlidir.",
        enforced: "Yöneticiniz bu örnek için renk paletini belirledi.",
        "default-badge": "Varsayılan",
      },
      "instance-palettes": {
        title: "Renk paletleri",
        description:
          "Bir paleti, bu örnekteki herkes için varsayılan yapmak üzere tıklayın. Özel paletler; arka planı, kenar çubuğunu ve içeriği renklendiren bir ana renk ile düğmeler ve bağlantılar için bir vurgu renginden oluşur.",
        new: "Yeni palet",
        edit: "Paleti düzenle",
        delete: "Paleti sil",
        name: "Palet adı",
        "name-required": "Palete bir ad verin.",
        colors: {
          main: "Ana renk",
          accent: "Vurgu rengi",
        },
        "preview-note":
          'Değişiklikler tüm uygulamada önizlenir ve "Tamam" düğmesine tıkladığınızda kaydedilir.',
        done: "Tamam",
        cancel: "İptal et",
        enforce: "Varsayılan renk paletini uygulayın",
        "enforce-description":
          "Bu örnekteki herkes varsayılan paleti kullanır ve değiştiremez.",
        "save-failed": "Renk paletleri kaydedilemedi: {{error}}",
      },
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Ajan oluştur",
      editWorkspace: "Çalışma Alanını Düzenle",
      uploadDocument: "Bir belge yükleyin",
    },
    greeting: "Bugün size nasıl yardımcı olabilirim?",
    greetings: {
      anytime: {
        working_on: "Ne üzerinde çalışıyoruz?",
        on_your_mind: "Aklınızda ne var?",
        where_to_start: "Nereden başlayalım?",
        ready: "Hazır olduğunuzda buradayım.",
        think_it_through: "Gelin, birlikte düşünelim.",
      },
      morning: {
        good_morning: "Günaydın",
        first_today: "Günaydın. Bugün ilk iş ne?",
        fresh_start: "Yeni bir başlangıç. Nereden başlayalım?",
      },
      afternoon: {
        good_afternoon: "İyi günler",
        tackling: "İyi günler. Neyi halledelim?",
        next_on_list: "Listede sırada ne var?",
        keep_moving: "Devam edelim.",
      },
      evening: {
        good_evening: "İyi akşamlar",
        finish_strong: "İyi akşamlar. Günü güçlü bitirelim.",
      },
      night: {
        midnight_oil: "Geç saatlere kadar mı çalışıyorsunuz?",
        late_one: "Uzun bir gece mi? Gelin, birlikte düşünelim.",
        still_up: "Hâlâ uyanık mısınız? Hazır olduğunuzda buradayım.",
      },
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
      "Her cihazdan çalışma alanlarınızla sohbet etmek için AnythingLLM kurulumunuzu Telegram'a bağlayın.",
    setup: {
      step1: {
        title: "1. Adım: Telegram botunuzu oluşturun",
        description:
          "Telegram uygulamasında @BotFather'ı açın, \"<code>/newbot</code>\" komutunu <code>@BotFather</code>'e gönderin, talimatları izleyin ve API anahtarını kopyalayın.",
        "open-botfather": "BotFather'ı aç",
        "instruction-1": "1. Bağlantıyı açın veya QR kodunu tarayın",
        "instruction-2":
          "2. <code>@BotFather</code> hesabına <code>/newbot</code> komutunu gönderin.",
        "instruction-3": "3. Botunuz için bir isim ve kullanıcı adı seçin",
        "instruction-4": "4. Alınan API token'ı kopyalayın",
      },
      step2: {
        title: "Adım 2: Botunuzu bağlayın",
        description:
          "Aldığınız API token'ı (@BotFather) kopyalayın ve botunuzun iletişim kuracağı varsayılan çalışma alanını seçin.",
        "bot-token": "Bot Token",
        connecting: "Bağlantı kuruluyor...",
        "connect-bot": "Botu Bağla",
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
      "toast-enter-token": "Lütfen bir bot tokenı girin.",
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
      "voice-always": "Her zaman sesli yanıt ver",
      "toast-disconnect-failed": "Bot'u ayırmada başarısız.",
      "toast-reconnect-failed": "Bot yeniden bağlantı kuramadı.",
      "toast-voice-failed": "Ses modunu güncelleme başarısız oldu.",
      "toast-approve-failed": "Kullanıcı onaylanamadı.",
      "toast-deny-failed": "Kullanıcı reddedilemedi.",
      "toast-revoke-failed": "Kullanıcının erişimi kaldırılamadı.",
    },
    users: {
      "pending-description":
        "Doğrulama işlemi bekleyen kullanıcılar. Burada gösterilen eşleştirme kodunu, Telegram sohbetlerinde görüntülenen kodla karşılaştırın.",
      unknown: "Bilinmiyor",
    },
  },
  scheduledJobs: {
    title: "Zamanlanmış Görevler",
    enableNotifications:
      "Görev sonuçları için tarayıcı bildirimlerini etkinleştirin",
    description:
      "Tekrarlayan yapay zeka görevlerini, belirli bir zaman çizelgesine göre otomatik olarak çalıştırın. Her görev, isteğe bağlı araçlarla birlikte bir sorguyu çalıştırır ve sonuçları inceleme için kaydeder.",
    newJob: "Yeni görev",
    loading: "Yükleniyor...",
    emptyTitle: "Henüz zamanlanmış görev yok.",
    emptySubtitle: "Başlamak için bir tane oluşturun.",
    table: {
      name: "Ad",
      schedule: "Zamanlama",
      status: "Durum",
      lastRun: "Son Çalıştırma",
      nextRun: "Sonraki Çalıştırma",
      actions: "Eylemler",
    },
    confirmDelete: "Bu planlanan görevi silmekten emin misiniz?",
    toast: {
      deleted: "Görev silindi",
      triggered: "Görev başlatıldı",
      triggerFailed: "Görev başlatılamadı",
      triggerSkipped: "Bu görev zaten çalışıyor",
      killed: "Görev durduruldu",
      killFailed: "Görev durdurulamadı",
    },
    row: {
      neverRun: "Henüz çalıştırılmadı",
      viewRuns: "Çalıştırma geçmişi",
      runNow: "Şimdi çalıştır",
      enable: "Etkinleştir",
      disable: "Devre dışı bırak",
      edit: "Düzenle",
      delete: "Sil",
    },
    modal: {
      titleEdit: "Zamanlanmış Görevi Düzenle",
      titleNew: "Yeni Zamanlanmış Görev",
      nameLabel: "Ad",
      namePlaceholder: "Örneğin, Günlük Haber Özeti",
      promptLabel: "İstem",
      promptPlaceholder: "Her çalıştırmada uygulanacak talimatlar...",
      scheduleLabel: "Zamanlama",
      modeBuilder: "Zamanlama Oluşturucu",
      modeCustom: "Özel",
      cronPlaceholder: "Cron ifadesi (örneğin, 0 9 * * *)",
      currentSchedule: "Geçerli zamanlama:",
      toolsLabel: "Araçlar (İsteğe Bağlı)",
      toolsDescription:
        "Bu iş için kullanılabilen ajan araçlarını seçin. Eğer hiçbir araç seçilmezse, iş herhangi bir araç olmadan çalışacaktır.",
      toolsSearch: "Arama",
      toolsNoResults: "Hiçbir araç bulunamadı",
      required: "Gereklidir",
      requiredFieldsBanner:
        "Görevi oluşturmak için tüm zorunlu alanları doldurun.",
      cancel: "İptal et",
      saving: "Kaydediliyor...",
      updateJob: "Görevi Güncelle",
      createJob: "Görev Oluştur",
      jobUpdated: "Görev güncellendi",
      jobCreated: "Görev oluşturuldu",
    },
    builder: {
      fallbackWarning:
        'Bu ifade görsel olarak düzenlenemez. Mevcut haliyle bırakmak için "Özel" seçeneğine geçin veya aşağıdaki herhangi bir alanı değiştirerek üzerine yazın.',
      run: "Çalıştır",
      frequency: {
        minute: "her dakika",
        hour: "saatlik",
        day: "günlük",
        week: "haftalık",
        month: "aylık",
      },
      every: "Her",
      minuteOne: "1 dakika",
      minuteOther: "{{count}} dakika",
      atMinute: "Dakika",
      pastEveryHour: "geçe, her saat",
      at: "Saat",
      on: "Gün",
      onDay: "Ayın günü",
      ofEveryMonth: "her ayın",
      weekdays: {
        sun: "Paz",
        mon: "Pzt",
        tue: "Sal",
        wed: "Çar",
        thu: "Per",
        fri: "Cum",
        sat: "Cmt",
      },
    },
    runHistory: {
      back: "Görevlere dön",
      title: "Çalıştırma Geçmişi: {{name}}",
      schedule: "Zamanlama:",
      emptyTitle: "Bu görev henüz çalıştırılmadı.",
      emptySubtitle: "Sonuçları görmek için şimdi çalıştırın.",
      runNow: "Şimdi çalıştır",
      table: {
        status: "Durum",
        started: "Başlangıç",
        duration: "Süre",
        error: "Hata",
      },
      stopJob: "Görevi durdur",
    },
    runDetail: {
      loading: "Çalıştırma ayrıntıları yükleniyor...",
      notFound: "Çalıştırma bulunamadı.",
      back: "Geri",
      unknownJob: "Bilinmeyen İş",
      runHeading: "{{name}} — Çalışma #{{id}}",
      duration: "Süre: {{value}}",
      creating: "Oluşturuluyor...",
      threadFailed: "Sohbet oluşturulamadı.",
      sections: {
        prompt: "İstem",
        error: "Hata",
        thinking: "Düşünceler ({{count}})",
        toolCalls: "Araç Çağrıları ({{count}})",
        files: "Dosyalar ({{count}})",
        response: "Cevap",
        metrics: "Ölçüm değerleri",
      },
      metrics: {
        promptTokens: "İstem tokenları:",
        completionTokens: "Yanıt tokenları:",
      },
      stopJob: "Görevi durdur",
      killing: "Durduruluyor...",
      continueInThread: "Sohbeti devam ettir",
    },
    toolCall: {
      arguments: "Bağımsız değişkenler:",
      showResult: "Sonuçları göster",
      hideResult: "Sonucu gizle",
    },
    file: {
      unknown: "Bilinmeyen dosya",
      download: "İndir",
      downloadFailed: "Dosya indirme işlemi başarısız oldu",
      types: {
        powerpoint: "PowerPoint",
        pdf: "PDF belgesi",
        word: "Word belgesi",
        spreadsheet: "Tablo",
        generic: "Dosya",
      },
    },
    status: {
      completed: "Tamamlandı",
      failed: "Başarısız",
      timed_out: "Zaman aşımı",
      running: "Çalışıyor",
      queued: "Sırada",
    },
  },
  "model-router": {
    title: "Model Yönlendiricileri",
    description:
      "Model yönlendiriciler, belirli koşullara göre sohbet mesajlarını otomatik olarak farklı LLM sağlayıcılarına ve modellere yönlendirmek için kurallar tanımlamanıza olanak tanır.",
    table: {
      name: "Ad",
      fallback: "Yedek hedef",
      rules: "Kurallar",
      workspaces: "Çalışma alanları",
    },
    "no-routers": "Şu anda herhangi bir model yönlendirici bulunmamaktadır.",
    "empty-description":
      "Henüz herhangi bir yönlendirici yapılandırılmamış. Başlamak için bir tane oluşturun.",
    "new-router-button": "Yeni Yönlendirici",
    "delete-confirm":
      '"{{name}}" yönlendiricisini silmek istediğinizden emin misiniz?\n\nTüm kuralları kaldırılacak ve bu yönlendiriciyi kullanan çalışma alanlarının bağlantısı kesilecek.\n\nBu işlem geri alınamaz.',
    "toast-deleted": "Yönlendirici silindi",
    "toast-delete-failed": "Yönlendirici silinemedi: {{error}}",
    "new-router": {
      title: "Yeni bir model yönlendirici oluşturun",
      name: "Ad",
      "name-placeholder": "Örneğin, Maliyet Optimizasyonu",
      description: "Açıklama",
      "description-placeholder": "İsteğe bağlı açıklama",
      "fallback-label": "Birincil Sağlayıcı ve Model",
      "fallback-description":
        "Hiçbir yönlendirme kuralı eşleşmediğinde kullanılır. LLM sınıflandırmalı kuralları değerlendirmek için de kullanılır.",
      "cooldown-label": "Önbellek Süresi (saniye)",
      "cooldown-help":
        "Yol seçimi kararı, kuralların yeniden değerlendirilmeden önce ne kadar süre boyunca önbelleğe alınır? Bu değeri 0 olarak ayarlamak, önbelleklemenin devre dışı kalmasını sağlar.",
      "name-required": "İsim zorunludur.",
      "fallback-required": "Birincil sağlayıcı ve model gereklidir.",
      cancel: "İptal et",
      create: "Yönlendirici oluştur",
    },
    "edit-router": {
      "back-to-routers": "Model yönlendiricilerine dön",
      title: "Yönlendiriciyi Düzenle: {{name}}",
      save: "Değişiklikleri Kaydet",
      "toast-update-failed": "Yönlendirici güncellenemedi",
    },
    rules: {
      title: "Yönlendirme Kuralları",
      "title-with-name": "Yönlendirme Kuralları: {{name}}",
      description:
        "Hangi mesajların hangi sağlayıcı ve modellere yönlendirileceğini belirleyen kuralları tanımlayın.",
      "add-rule": "Kuralı ekle",
      "delete-confirm": '"{{title}}" kuralını silmek mi?',
      "toast-delete-failed": "Kural silme işlemi başarısız oldu.",
      "toast-reorder-failed": "Kurallar yeniden sıralanamadı",
      "no-rules": "Henüz herhangi bir kural belirlenmemiş",
      "empty-description":
        "Belirli sağlayıcılara ve modellere mesajları yönlendirmeye başlamak için bir kural ekleyin.",
      "new-rule-button": "Yeni Kural",
      "calculated-section-label":
        "Hesaplanan kurallar — öncelik sırasına göre değerlendirilir",
      "llm-section-label":
        "LLM kuralları — eğer hiçbir hesaplanmış kural eşleşmiyorsa, toplu olarak değerlendirilir.",
      "llm-rule-body":
        '<desc>"{{description}}"</desc> ile eşleşirse rotayı <route>{{route}}</route> olarak belirle.',
      "calculated-no-conditions":
        "Şart yok — rotayı <route>{{route}}</route> olarak belirle",
      "calculated-single-condition":
        'Eğer <prop> {{property}} </prop> {{comparator}} <val> "{{value}}" </val> ise, rotayı <route> {{route}} </route> olarak belirle.',
      "calculated-multi-condition":
        "Eğer {{quantifier}} <cond>{{conditions}}</cond> ise, rotayı <route>{{route}}</route> olarak belirle.",
      "comparator-contains": "içerir",
      "comparator-matches": "eşleşir",
      "comparator-between": "arasında",
      "badge-llm": "Büyük Dil Modeli",
      "badge-calculated": "Hesaplanmış",
      "aria-drag-to-reorder": "Yeniden sıralamak için sürükleyin",
      "aria-edit-rule": "Kuralı düzenle",
      "aria-delete-rule": "Kuralı sil",
      "quantifier-any": "HERHANGİ",
      "quantifier-all": "TÜM",
    },
    "rule-form": {
      "title-label": "Başlık",
      "rule-type": "Kural Türü",
      "property-label": "Özellik",
      "property-select": "Seç",
      "comparator-label": "Karşılaştırma",
      "comparator-select": "Seç",
      "value-label": "Değer",
      "add-condition": "Koşul ekle",
      "remove-condition": "Koşulu ortadan kaldır",
      "conditions-incomplete":
        "Koşul {{index}} eksik — özellik, karşılaştırma ve değeri belirtin.",
      "match-description-label": "Eşleşme Açıklaması",
      "match-description-placeholder":
        "Örneğin, kullanıcı yasal konular, sözleşmeler veya uyumluluk hakkında bilgi almak istiyor.",
      "match-description-help":
        "Bu kuralın hangi durumda uygulanması gerektiğini açıklayın. Bu, LLM'iniz tarafından değerlendirilerek, kullanılıp kullanılmaması belirlenecektir.",
      "route-to-label": "Yönlendirilecek Sağlayıcı ve Model",
      "route-to-description":
        "Bu kural eşleştiğinde, bu sağlayıcıyı/modeli kullanın.",
      cancel: "İptal et",
      saving: "Kaydediliyor...",
      "update-rule": "Kuralı Güncelle",
      "create-rule": "Kural Oluştur",
      "title-required": "Başlık zorunludur",
      "toast-save-failed": "Kuralı kaydetme başarısız oldu",
      "type-calculated-label": "Hesaplanmış",
      "type-calculated-description":
        "Mesaj özelliklerine (içerik, token sayısı veya günün saati gibi) göre eşleştirme yapın.",
      "type-llm-label": "LLM ile Sınıflandırma",
      "type-llm-description":
        "Bir LLM (Büyük Dil Modeli) kullanarak, sağladığınız açıklamaya göre mesajı sınıflandırın.",
      "prop-prompt-content": "İçerik",
      "prop-token-count": "Konuşmadaki Token Sayısı",
      "prop-message-count": "Mesaj Sayısı",
      "prop-current-hour": "Mevcut Saat (0-23)",
      "prop-has-image": "Resim eklenmiş mi?",
      "cmp-contains": "içerir",
      "cmp-matches-regex": "eşleşir (düzenli ifade)",
      "cmp-equals": "eşittir",
      "cmp-not-equals": "eşit değildir",
      "cmp-greater-than": "daha büyük",
      "cmp-greater-than-or-equal": "büyük veya eşit",
      "cmp-less-than": "daha az",
      "cmp-less-than-or-equal": "daha az veya eşit",
      "cmp-between": "arasında (sınırlar dahil)",
      "placeholder-between-hour": "Ör. 9,17 (09:00–17:00)",
      "placeholder-between-numeric": "Örneğin: 10,50",
      "placeholder-hour": "Örneğin, 18 (0-23)",
      "placeholder-message-count": "Örneğin: 10",
      "placeholder-numeric": "Örneğin, 4000",
      "placeholder-contains": "örneğin, kod, Python, Rust",
      "placeholder-matches": "Örneğin: /\\bpython\\b/i",
      "placeholder-default": "Örneğin, kod",
      "help-contains":
        "Virgülle ayrılmış liste — Eğer sorgu içinde belirtilen değerlerden herhangi biri varsa eşleşir (büyük/küçük harf duyarlılığı olmadan).",
      "help-matches":
        "Düzenli ifade kalıbı. Büyük/küçük harf duyarlılığını belirtmek için `/pattern/flag`lerini kullanın (varsayılan olarak büyük/küçük harf duyarlılığı devre dışıdır).",
      "bool-true": "Doğru",
      "bool-false": "Yanlış",
    },
    "provider-picker": {
      "select-provider": "Sağlayıcı seçin",
      "setup-required": "(Kurulum gerektirir)",
      "loading-models": "Modeller yükleniyor...",
      "select-model": "Model seçin",
      "enter-model": "Model adını girin",
      "select-provider-first": "Öncelikle bir sağlayıcı seçin.",
      "configure-to-continue": "{{name}}'ı yapılandırarak devam et",
      "configure-provider": "{{name}}'ı yapılandırın",
      "setup-credentials":
        "Gerekli kimlik bilgilerini girerek {{name}}'ı yönlendirme hedefi olarak kullanın.",
      cancel: "İptal et",
      "save-settings": "Ayarları kaydet",
      "toast-save-failed": "Ayarlar kaydedilemedi: {{error}}",
    },
    "router-selection": {
      "loading-routers": "Model yönlendiricileri yükleniyor...",
      "no-routers-prefix-settings":
        "Henüz model yönlendiricisi yapılandırılmamış.",
      "no-routers-prefix-workspace":
        "Henüz model yönlendiricisi yapılandırılmamış.",
      "no-routers-link": "Model Yönlendirici ayarlarından bir tane oluşturun.",
      "model-router-label": "Model Yönlendirici",
      "select-router": "Bir yönlendirici seçin",
      "select-description":
        "Bu çalışma alanı için hangi yönlendiriciyi kullanacağınızı seçin.",
      "no-routers-chat":
        "Hiçbir yönlendirici yapılandırılmamış. Ayarlar > Yapay Zeka Sağlayıcıları > Model Yönlendirici bölümünde bir tane oluşturun.",
      "rule-count": "({{count}} kural)",
    },
    metrics: {
      "model-router-default": "Model Yönlendirici",
    },
    chat: {
      "select-router-error": "Bir yönlendirici seçin",
      "invalid-model": "Geçersiz model seçimi",
      "routed-to": "Yönlendirildi: <route> {{model}} </route>",
      "routed-to-rule":
        "<rule>{{ruleTitle}}</rule> kuralıyla <route>{{model}}</route> modeline yönlendirildi",
    },
  },
  imageGeneration: {
    title: "Görüntü Oluşturma Tercihi",
    description:
      "`/img` komutunu kullanarak görüntüler oluşturmak için kullanılan sağlayıcıyı yapılandırın.",
    provider: "Görüntü Üretim Sağlayıcısı",
    card: {
      "failed-to-load": "Görsel yüklenemedi",
      "alt-text": "Oluşturulan görüntü",
      edit: "Düzenle",
      download: "İndir",
    },
    pending: {
      heading: "Görseliniz oluşturuluyor…",
      description:
        "Bu işlem biraz zaman alabilir. Hazır olduğunda burada görüntülenecektir.",
      aborted: "Görsel oluşturma iptal edildi.",
    },
  },
};

export default TRANSLATIONS;
