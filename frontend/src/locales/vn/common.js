// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = {
  onboarding: {
    survey: {
      email: "Email của bạn là gì?",
      useCase: "Bạn sẽ sử dụng AnythingLLM để làm gì?",
      useCaseWork: "Cho công việc",
      useCasePersonal: "Cho mục đích cá nhân",
      useCaseOther: "Khác",
      comment: "Bạn biết đến AnythingLLM như thế nào?",
      commentPlaceholder:
        "Reddit, Twitter, GitHub, YouTube, v.v. - Hãy cho chúng tôi biết bạn tìm thấy chúng tôi như thế nào!",
      skip: "Bỏ qua Khảo sát",
      thankYou: "Cảm ơn phản hồi của bạn!",
      title: "Chào mừng đến với AnythingLLM",
      description:
        "Giúp chúng tôi xây dựng AnythingLLM phù hợp với nhu cầu của bạn. Tùy chọn.",
    },
    home: {
      title: "Chào mừng đến",
      getStarted: "Bắt đầu",
      welcome: "Chào mừng",
    },
    llm: {
      title: "Tùy chọn LLM",
      description:
        "AnythingLLM có thể hoạt động với nhiều nhà cung cấp LLM. Đây sẽ là dịch vụ xử lý trò chuyện.",
    },
    userSetup: {
      title: "Thiết lập Người dùng",
      description: "Cấu hình cài đặt người dùng của bạn.",
      howManyUsers: "Có bao nhiêu người sẽ sử dụng phiên bản này?",
      justMe: "Chỉ mình tôi",
      myTeam: "Nhóm của tôi",
      instancePassword: "Mật khẩu Phiên bản",
      setPassword: "Bạn có muốn thiết lập mật khẩu không?",
      passwordReq: "Mật khẩu phải có ít nhất 8 ký tự.",
      passwordWarn:
        "Điều quan trọng là phải lưu mật khẩu này vì không có phương pháp khôi phục.",
      adminUsername: "Tên người dùng tài khoản Quản trị viên",
      adminPassword: "Mật khẩu tài khoản Quản trị viên",
      adminPasswordReq: "Mật khẩu phải có ít nhất 8 ký tự.",
      teamHint:
        "Theo mặc định, bạn sẽ là quản trị viên duy nhất. Sau khi hoàn tất thiết lập, bạn có thể tạo và mời người khác làm người dùng hoặc quản trị viên. Không được mất mật khẩu vì chỉ quản trị viên mới có thể đặt lại mật khẩu.",
    },
    data: {
      title: "Xử lý Dữ liệu & Quyền riêng tư",
      description:
        "Chúng tôi cam kết minh bạch và kiểm soát khi liên quan đến dữ liệu cá nhân của bạn.",
      settingsHint:
        "Các cài đặt này có thể được cấu hình lại bất cứ lúc nào trong cài đặt.",
    },
  },
  common: {
    "workspaces-name": "Tên không gian làm việc",
    selection: "Lựa chọn mô hình",
    saving: "Đang lưu...",
    save: "Lưu thay đổi",
    previous: "Trang trước",
    next: "Trang tiếp theo",
    optional: "Tùy chọn",
    yes: "Có",
    no: "Không",
    search: "Tìm kiếm",
    username_requirements:
      "Tên người dùng phải có 2-32 ký tự, bắt đầu bằng chữ cái thường và chỉ chứa chữ cái thường, số, dấu gạch dưới, dấu gạch ngang và dấu chấm.",
    on: "Về",
    none: "Không",
    stopped: "Dừng",
    loading: "Đang tải",
    refresh: "Tái tạo",
  },
  settings: {
    title: "Cài đặt hệ thống",
    invites: "Lời mời",
    users: "Người dùng",
    workspaces: "Không gian làm việc",
    "workspace-chats": "Hội thoại không gian làm việc",
    customization: "Tùy chỉnh",
    "api-keys": "API nhà phát triển",
    llm: "LLM",
    transcription: "Chuyển đổi giọng nói",
    embedder: "Nhúng dữ liệu",
    "text-splitting": "Chia nhỏ & Tách văn bản",
    "voice-speech": "Giọng nói & Phát âm",
    "vector-database": "Cơ sở dữ liệu Vector",
    embeds: "Nhúng hội thoại",
    security: "Bảo mật",
    "event-logs": "Nhật ký sự kiện",
    privacy: "Quyền riêng tư & Dữ liệu",
    "ai-providers": "Nhà cung cấp AI",
    "agent-skills": "Kỹ năng của Agent",
    admin: "Quản trị viên",
    tools: "Công cụ",
    "experimental-features": "Tính năng thử nghiệm",
    contact: "Liên hệ hỗ trợ",
    "browser-extension": "Tiện ích trình duyệt",
    "system-prompt-variables": "Biến System Prompt",
    interface: "Tùy chọn Giao diện",
    branding: "Thương hiệu & Nhãn trắng",
    chat: "Trò chuyện",
    "mobile-app": "AnythingLLM Di động",
    "community-hub": {
      title: "Trung tâm cộng đồng",
      trending: "Khám phá các nội dung đang thịnh hành",
      "your-account": "Tài khoản của bạn",
      "import-item": "Nhập hàng",
    },
    channels: "Kênh",
    "available-channels": {
      telegram: "Telegram",
    },
  },
  login: {
    "multi-user": {
      welcome: "Chào mừng đến với",
      "placeholder-username": "Tên người dùng",
      "placeholder-password": "Mật khẩu",
      login: "Đăng nhập",
      validating: "Đang xác thực...",
      "forgot-pass": "Quên mật khẩu",
      reset: "Đặt lại",
    },
    "sign-in": "Đăng nhập vào {{appName}} tài khoản của bạn.",
    "password-reset": {
      title: "Đặt lại Mật khẩu",
      description: "Cung cấp thông tin cần thiết dưới đây để đặt lại mật khẩu.",
      "recovery-codes": "Mã khôi phục",
      "back-to-login": "Quay lại Đăng nhập",
    },
  },
  "new-workspace": {
    title: "Không gian làm việc mới",
    placeholder: "Không gian làm việc của tôi",
  },
  "workspaces—settings": {
    general: "Cài đặt chung",
    chat: "Cài đặt Trò chuyện",
    vector: "Cơ sở dữ liệu Vector",
    members: "Thành viên",
    agent: "Cấu hình Agent",
  },
  general: {
    vector: {
      title: "Số lượng Vector",
      description: "Tổng số vector trong cơ sở dữ liệu vector của bạn.",
    },
    names: {
      description:
        "Điều này chỉ thay đổi tên hiển thị của không gian làm việc.",
    },
    message: {
      title: "Tin nhắn trò chuyện được gợi ý",
      description:
        "Tùy chỉnh các tin nhắn sẽ được gợi ý cho người dùng không gian làm việc của bạn.",
      add: "Thêm tin nhắn mới",
      save: "Lưu Tin nhắn",
      heading: "Giải thích cho tôi",
      body: "các lợi ích của AnythingLLM",
    },
    delete: {
      title: "Xóa không gian làm việc",
      description:
        "Xóa không gian làm việc này và tất cả dữ liệu của nó. Điều này sẽ xóa không gian làm việc cho tất cả người dùng.",
      delete: "Xóa không gian làm việc",
      deleting: "Đang xóa Không gian làm việc...",
      "confirm-start": "Bạn sắp xóa toàn bộ",
      "confirm-end":
        "không gian làm việc. Điều này sẽ xóa tất cả vector embedding trong cơ sở dữ liệu vector của bạn.\n\nCác tệp nguồn gốc sẽ không bị ảnh hưởng. Hành động này không thể hoàn tác.",
    },
  },
  chat: {
    llm: {
      title: "Nhà cung cấp LLM Không gian làm việc",
      description:
        "Nhà cung cấp LLM và mô hình cụ thể sẽ được sử dụng cho không gian làm việc này. Theo mặc định, nó sử dụng nhà cung cấp LLM hệ thống và cài đặt.",
      search: "Tìm kiếm tất cả nhà cung cấp LLM",
    },
    model: {
      title: "Mô hình Trò chuyện Không gian làm việc",
      description:
        "Mô hình trò chuyện cụ thể sẽ được sử dụng cho không gian làm việc này. Nếu để trống, sẽ sử dụng tùy chọn LLM hệ thống.",
    },
    mode: {
      title: "Chế độ trò chuyện",
      chat: {
        title: "Trò chuyện",
        description:
          "sẽ cung cấp câu trả lời dựa trên kiến thức chung của LLM và ngữ cảnh tài liệu được cung cấp.<br />Bạn sẽ cần sử dụng lệnh @agent để sử dụng các công cụ.",
      },
      query: {
        title: "Truy vấn",
        description:
          "sẽ cung cấp câu trả lời <b>chỉ</b> nếu ngữ cảnh của tài liệu được tìm thấy.<br />Bạn sẽ cần sử dụng lệnh @agent để sử dụng các công cụ.",
      },
      automatic: {
        title: "Tự động",
        description:
          "sẽ tự động sử dụng các công cụ nếu mô hình và nhà cung cấp hỗ trợ gọi công cụ gốc. Nếu không hỗ trợ gọi công cụ gốc, bạn sẽ cần sử dụng lệnh `@agent` để sử dụng các công cụ.",
      },
    },
    history: {
      title: "Lịch sử Trò chuyện",
      "desc-start":
        "Số lượng cuộc trò chuyện trước đó sẽ được bao gồm trong bộ nhớ ngắn hạn của phản hồi.",
      recommend: "Khuyến nghị 20. ",
      "desc-end":
        "Bất kỳ số nào lớn hơn 45 có thể dẫn đến lỗi trò chuyện liên tục tùy thuộc vào kích thước tin nhắn.",
    },
    prompt: {
      title: "Prompt",
      description:
        "Nhập vào đây prompt cho không gian làm việc này. Định nghĩa ngữ cảnh và hướng dẫn cho AI để tạo ra một phản hồi liên quan và chính xác.",
      history: {
        title: "Lịch sử System Prompt",
        clearAll: "Xóa Tất cả",
        noHistory: "Không có lịch sử system prompt",
        restore: "Khôi phục",
        delete: "Xóa",
        deleteConfirm: "Bạn có chắc chắn muốn xóa mục lịch sử này?",
        clearAllConfirm:
          "Bạn có chắc chắn muốn xóa tất cả lịch sử? Hành động này không thể hoàn tác.",
        expand: "Mở rộng",
        publish: "Đăng lên Community Hub",
      },
    },
    refusal: {
      title: "Phản hồi từ chối chế độ truy vấn",
      "desc-start": "Khi ở chế độ",
      query: "truy vấn",
      "desc-end":
        ", bạn có thể muốn trả về phản hồi từ chối tùy chỉnh khi không tìm thấy ngữ cảnh.",
      "tooltip-title": "Tại sao tôi thấy điều này?",
      "tooltip-description":
        "Bạn đang ở chế độ truy vấn, chỉ sử dụng thông tin từ tài liệu của bạn. Chuyển sang chế độ trò chuyện để có cuộc trò chuyện linh hoạt hơn, hoặc nhấp vào đây để truy cập tài liệu của chúng tôi để tìm hiểu thêm về các chế độ trò chuyện.",
    },
    temperature: {
      title: "Nhiệt độ LLM",
      "desc-start": 'Cài đặt này kiểm soát mức độ "sáng tạo" của phản hồi LLM.',
      "desc-end":
        "Số càng cao thì càng sáng tạo. Đối với một số mô hình, điều này có thể dẫn đến phản hồi không mạch lạc khi đặt quá cao.",
      hint: "Hầu hết các LLM có các phạm vi giá trị hợp lệ khác nhau. Tham khảo nhà cung cấp LLM của bạn để biết thông tin đó.",
    },
  },
  "vector-workspace": {
    identifier: "Định danh cơ sở dữ liệu vector",
    snippets: {
      title: "Đoạn Ngữ cảnh Tối đa",
      description:
        "Cài đặt này kiểm soát số lượng đoạn ngữ cảnh tối đa sẽ được gửi đến LLM cho mỗi cuộc trò chuyện hoặc truy vấn.",
      recommend: "Khuyến nghị: 4",
    },
    doc: {
      title: "Ngưỡng tương đồng tài liệu",
      description:
        "Điểm tương đồng tối thiểu cần thiết để một nguồn được coi là liên quan đến cuộc trò chuyện. Số càng cao, nguồn phải càng tương tự với cuộc trò chuyện.",
      zero: "Không hạn chế",
      low: "Thấp (điểm tương đồng ≥ .25)",
      medium: "Trung bình (điểm tương đồng ≥ .50)",
      high: "Cao (điểm tương đồng ≥ .75)",
    },
    reset: {
      reset: "Đặt lại Cơ sở dữ liệu Vector",
      resetting: "Đang xóa vectors...",
      confirm:
        "Bạn sắp đặt lại cơ sở dữ liệu vector của không gian làm việc này. Điều này sẽ xóa tất cả vector embedding hiện đang được nhúng.\n\nCác tệp nguồn gốc sẽ không bị ảnh hưởng. Hành động này không thể hoàn tác.",
      error: "Không thể đặt lại cơ sở dữ liệu vector của không gian làm việc!",
      success: "Cơ sở dữ liệu vector của không gian làm việc đã được đặt lại!",
    },
  },
  agent: {
    "performance-warning":
      "Hiệu suất của các LLM không hỗ trợ rõ ràng việc gọi công cụ phụ thuộc rất nhiều vào khả năng và độ chính xác của mô hình. Một số khả năng có thể bị hạn chế hoặc không hoạt động.",
    provider: {
      title: "Nhà cung cấp LLM cho Agent Không gian làm việc",
      description:
        "Nhà cung cấp LLM & mô hình cụ thể sẽ được sử dụng cho @agent agent của không gian làm việc này.",
    },
    mode: {
      chat: {
        title: "Mô hình Trò chuyện cho Agent Không gian làm việc",
        description:
          "Mô hình trò chuyện cụ thể sẽ được sử dụng cho @agent agent của không gian làm việc này.",
      },
      title: "Mô hình Agent Không gian làm việc",
      description:
        "Mô hình LLM cụ thể sẽ được sử dụng cho @agent agent của không gian làm việc này.",
      wait: "-- đang chờ mô hình --",
    },
    skill: {
      rag: {
        title: "RAG & bộ nhớ dài hạn",
        description:
          'Cho phép agent sử dụng tài liệu cục bộ của bạn để trả lời truy vấn hoặc yêu cầu agent "ghi nhớ" các phần nội dung để truy xuất bộ nhớ dài hạn.',
      },
      view: {
        title: "Xem & tóm tắt tài liệu",
        description:
          "Cho phép agent liệt kê và tóm tắt nội dung của các tệp không gian làm việc hiện đang được nhúng.",
      },
      scrape: {
        title: "Thu thập dữ liệu website",
        description:
          "Cho phép agent truy cập và thu thập nội dung của các website.",
      },
      generate: {
        title: "Tạo biểu đồ",
        description:
          "Cho phép agent mặc định tạo các loại biểu đồ khác nhau từ dữ liệu được cung cấp hoặc đưa ra trong trò chuyện.",
      },
      save: {
        title: "Tạo & lưu tệp",
        description:
          "Cho phép agent mặc định tạo và ghi vào các tệp có thể lưu vào máy tính của bạn.",
      },
      web: {
        title: "Tìm kiếm web trực tiếp và duyệt web",
        description:
          "Cho phép đại lý của bạn tìm kiếm trên web để trả lời các câu hỏi của bạn bằng cách kết nối với nhà cung cấp dịch vụ tìm kiếm trên web (SERP).",
      },
      sql: {
        title: "Kết nối SQL",
        description:
          "Cho phép đại lý của bạn sử dụng SQL để trả lời các câu hỏi của bạn bằng cách kết nối với nhiều nhà cung cấp cơ sở dữ liệu SQL khác nhau.",
      },
      default_skill:
        "Theo mặc định, kỹ năng này được kích hoạt, nhưng bạn có thể tắt nó nếu không muốn nó được sử dụng bởi người đại diện.",
      filesystem: {
        title: "Quyền truy cập hệ thống tệp",
        description:
          "Cho phép đại lý của bạn đọc, ghi, tìm kiếm và quản lý các tệp tin trong một thư mục được chỉ định. Hỗ trợ chỉnh sửa tệp, điều hướng thư mục và tìm kiếm nội dung.",
        learnMore: "Tìm hiểu thêm về cách sử dụng kỹ năng này.",
        configuration: "Cấu hình",
        readActions: "Đọc hành động",
        writeActions: "Các hành động",
        warning:
          "Việc truy cập hệ thống tệp có thể gây nguy hiểm vì nó có thể sửa đổi hoặc xóa các tệp. Vui lòng tham khảo tài liệu <link> trước khi kích hoạt.",
        skills: {
          "read-text-file": {
            title: "Đọc tệp",
            description:
              "Đọc nội dung của các tệp (văn bản, mã, PDF, hình ảnh, v.v.)",
          },
          "read-multiple-files": {
            title: "Đọc nhiều tệp",
            description: "Đọc nhiều tệp tin cùng lúc.",
          },
          "list-directory": {
            title: "Danh sách",
            description: "Liệt kê các tệp tin và thư mục trong một thư mục.",
          },
          "search-files": {
            title: "Tìm kiếm tệp",
            description: "Tìm kiếm các tệp theo tên hoặc nội dung",
          },
          "get-file-info": {
            title: "Lấy thông tin tệp",
            description: "Lấy thông tin chi tiết về các tệp tin.",
          },
          "write-file": {
            title: "Tạo tệp",
            description: "Tạo các tệp mới hoặc ghi đè các tệp hiện có",
          },
          "edit-file": {
            title: "Chỉnh sửa tệp",
            description:
              "Thực hiện chỉnh sửa dựa trên dòng trong các tệp văn bản.",
          },
          "create-directory": {
            title: "Tạo thư mục",
            description: "Tạo thư mục mới",
          },
          "move-file": {
            title: "Di chuyển/Đổi tên tệp",
            description: "Di chuyển hoặc đổi tên các tệp và thư mục.",
          },
          "copy-file": {
            title: "Sao chép tệp",
            description: "Sao chép các tệp tin và thư mục",
          },
        },
      },
    },
    mcp: {
      title: "Máy chủ MCP",
      "loading-from-config": "Tải các máy chủ MCP từ tệp cấu hình",
      "learn-more": "Tìm hiểu thêm về máy chủ MCP.",
      "no-servers-found": "Không tìm thấy máy chủ MCP.",
      "tool-warning":
        "Để đạt hiệu suất tốt nhất, hãy cân nhắc việc tắt các công cụ không cần thiết để tiết kiệm tài nguyên.",
      "stop-server": "Tắt máy chủ MCP",
      "start-server": "Khởi động máy chủ MCP",
      "delete-server": "Xóa máy chủ MCP",
      "tool-count-warning":
        "Máy chủ MCP này có các công cụ <b> được kích hoạt, {{count}} và chúng sẽ tiêu thụ ngữ cảnh trong mọi cuộc trò chuyện.</b> Hãy cân nhắc việc tắt các công cụ không cần thiết để tiết kiệm ngữ cảnh.",
      "startup-command": "Lệnh khởi động",
      command: "Lệnh",
      arguments: "Luận điểm",
      "not-running-warning":
        "Máy chủ MCP này không hoạt động – có thể nó đã bị tắt hoặc đang gặp lỗi khi khởi động.",
      "tool-call-arguments": "Tham số khi gọi hàm/thao tác",
      "tools-enabled": "các công cụ đã được kích hoạt",
    },
    settings: {
      title: "Cài đặt kỹ năng của đại lý",
      "max-tool-calls": {
        title: "Số lượng lệnh gọi công cụ tối đa cho mỗi phản hồi",
        description:
          "Số lượng công cụ tối đa mà một người dùng có thể liên kết để tạo ra một phản hồi duy nhất. Điều này ngăn chặn việc gọi công cụ quá mức và tạo ra các vòng lặp vô hạn.",
      },
      "intelligent-skill-selection": {
        title: "Lựa chọn kỹ năng thông minh",
        "beta-badge": "Phiên bản thử nghiệm",
        description:
          "Cho phép sử dụng không giới hạn các công cụ và giảm mức sử dụng token lên đến 80% cho mỗi truy vấn – AnythingLLM tự động chọn các kỹ năng phù hợp nhất cho mỗi yêu cầu.",
        "max-tools": {
          title: "Công cụ Max",
          description:
            "Số lượng công cụ tối đa có thể chọn cho mỗi truy vấn. Chúng tôi khuyến nghị đặt giá trị này thành các giá trị lớn hơn đối với các mô hình có ngữ cảnh lớn hơn.",
        },
      },
    },
  },
  recorded: {
    title: "Hội thoại không gian làm việc",
    description:
      "Đây là tất cả các cuộc trò chuyện và tin nhắn đã được ghi lại được gửi bởi người dùng, sắp xếp theo ngày tạo.",
    export: "Xuất",
    table: {
      id: "Id",
      by: "Gửi bởi",
      workspace: "Không gian làm việc",
      prompt: "Prompt",
      response: "Phản hồi",
      at: "Gửi lúc",
    },
  },
  api: {
    title: "Khóa API",
    description:
      "Khóa API cho phép người sở hữu truy cập và quản lý phiên bản AnythingLLM này theo chương trình.",
    link: "Đọc tài liệu API",
    generate: "Tạo Khóa API Mới",
    table: {
      key: "Khóa API",
      by: "Tạo bởi",
      created: "Ngày tạo",
    },
  },
  llm: {
    title: "Tùy chọn LLM",
    description:
      "Đây là thông tin đăng nhập và cài đặt cho nhà cung cấp LLM trò chuyện & nhúng ưa thích của bạn. Điều quan trọng là các khóa này phải chính xác, nếu không AnythingLLM sẽ không hoạt động đúng.",
    provider: "Nhà cung cấp LLM",
    providers: {
      azure_openai: {
        azure_service_endpoint: "Điểm cuối Dịch vụ Azure",
        api_key: "Khóa API",
        chat_deployment_name: "Tên Triển khai Trò chuyện",
        chat_model_token_limit: "Giới hạn Token Mô hình Trò chuyện",
        model_type: "Loại Mô hình",
        default: "Mặc định",
        reasoning: "Lý luận",
        model_type_tooltip:
          'Nếu triển khai của bạn sử dụng mô hình lý luận (o1, o1-mini, o3-mini, v.v.), hãy đặt thành "Lý luận". Nếu không, yêu cầu trò chuyện của bạn có thể thất bại.',
      },
    },
  },
  transcription: {
    title: "Tùy chọn Mô hình Chuyển đổi giọng nói",
    description:
      "Đây là thông tin đăng nhập và cài đặt cho nhà cung cấp mô hình chuyển đổi giọng nói ưa thích của bạn. Điều quan trọng là các khóa này phải chính xác, nếu không tệp media và âm thanh sẽ không được chuyển đổi.",
    provider: "Nhà cung cấp Chuyển đổi giọng nói",
    "warn-start":
      "Sử dụng mô hình whisper cục bộ trên máy có RAM hoặc CPU hạn chế có thể làm AnythingLLM bị treo khi xử lý tệp media.",
    "warn-recommend":
      "Chúng tôi khuyến nghị ít nhất 2GB RAM và tải lên tệp <10Mb.",
    "warn-end": "Mô hình tích hợp sẽ tự động tải xuống khi sử dụng lần đầu.",
  },
  embedding: {
    title: "Tùy chọn nhúng",
    "desc-start":
      "Khi sử dụng LLM không hỗ trợ bộ máy nhúng nguyên bản - bạn có thể cần chỉ định thêm thông tin đăng nhập để nhúng văn bản.",
    "desc-end":
      "Nhúng là quá trình chuyển đổi văn bản thành vector. Thông tin đăng nhập này cần thiết để chuyển đổi tệp và prompt của bạn thành định dạng mà AnythingLLM có thể sử dụng để xử lý.",
    provider: {
      title: "Nhà cung cấp Nhúng",
    },
  },
  text: {
    title: "Tùy chọn chia nhỏ và tách văn bản",
    "desc-start":
      "Đôi khi, bạn có thể muốn thay đổi cách mặc định mà các tài liệu mới được chia nhỏ và tách trước khi được chèn vào cơ sở dữ liệu vector của bạn.",
    "desc-end":
      "Bạn chỉ nên sửa đổi cài đặt này nếu bạn hiểu cách chia văn bản hoạt động và các tác động phụ của nó.",
    size: {
      title: "Kích thước Đoạn Văn bản",
      description:
        "Đây là độ dài tối đa của các ký tự có thể có trong một vector đơn.",
      recommend: "Độ dài tối đa của mô hình nhúng là",
    },
    overlap: {
      title: "Độ Chồng lấp Đoạn Văn bản",
      description:
        "Đây là độ chồng lấp tối đa của các ký tự xảy ra trong quá trình tách giữa hai đoạn văn bản liền kề.",
    },
  },
  vector: {
    title: "Cơ sở dữ liệu Vector",
    description:
      "Đây là thông tin đăng nhập và cài đặt cho cách phiên bản AnythingLLM của bạn sẽ hoạt động. Điều quan trọng là các khóa này phải chính xác.",
    provider: {
      title: "Nhà cung cấp Cơ sở dữ liệu Vector",
      description: "Không cần cấu hình cho LanceDB.",
    },
  },
  embeddable: {
    title: "Tiện ích hội thoại nhúng",
    description:
      "Tiện ích trò chuyện nhúng là giao diện trò chuyện công khai được liên kết với một không gian làm việc duy nhất. Điều này cho phép bạn xây dựng không gian làm việc mà sau đó bạn có thể xuất bản ra thế giới.",
    create: "Tạo nhúng",
    table: {
      workspace: "Không gian làm việc",
      chats: "Trò chuyện đã gửi",
      active: "Tên miền Hoạt động",
      created: "Ngày tạo",
    },
  },
  "embed-chats": {
    title: "Lịch sử Nhúng Trò chuyện",
    export: "Xuất",
    description:
      "Đây là tất cả các cuộc trò chuyện và tin nhắn đã được ghi lại từ bất kỳ nhúng nào mà bạn đã xuất bản.",
    table: {
      embed: "Nhúng",
      sender: "Người gửi",
      message: "Tin nhắn",
      response: "Phản hồi",
      at: "Gửi lúc",
    },
  },
  event: {
    title: "Nhật ký sự kiện",
    description:
      "Xem tất cả các hành động và sự kiện đang xảy ra trên phiên bản này để giám sát.",
    clear: "Xóa Nhật ký sự kiện",
    table: {
      type: "Loại Sự kiện",
      user: "Người dùng",
      occurred: "Xảy ra lúc",
    },
  },
  privacy: {
    title: "Quyền riêng tư & Xử lý Dữ liệu",
    description:
      "Đây là cấu hình của bạn về cách các nhà cung cấp bên thứ ba được kết nối và AnythingLLM xử lý dữ liệu của bạn.",
    anonymous: "Đã Bật Telemetry Ẩn danh",
  },
  connectors: {
    "search-placeholder": "Tìm kiếm trình kết nối dữ liệu",
    "no-connectors": "Không tìm thấy trình kết nối dữ liệu.",
    github: {
      name: "Kho GitHub",
      description:
        "Nhập toàn bộ kho GitHub công khai hoặc riêng tư chỉ với một cú nhấp chuột.",
      URL: "URL Kho GitHub",
      URL_explained: "URL của kho GitHub bạn muốn thu thập.",
      token: "Token Truy cập GitHub",
      optional: "tùy chọn",
      token_explained: "Token truy cập để ngăn giới hạn tốc độ.",
      token_explained_start: "Nếu không có ",
      token_explained_link1: "Token Truy cập Cá nhân",
      token_explained_middle:
        ", API GitHub có thể giới hạn số lượng tệp có thể thu thập do giới hạn tốc độ. Bạn có thể ",
      token_explained_link2: "tạo Token Truy cập tạm thời",
      token_explained_end: " để tránh vấn đề này.",
      ignores: "Bỏ qua Tệp",
      git_ignore:
        "Danh sách theo định dạng .gitignore để bỏ qua các tệp cụ thể trong quá trình thu thập. Nhấn enter sau mỗi mục bạn muốn lưu.",
      task_explained:
        "Khi hoàn tất, tất cả các tệp sẽ có sẵn để nhúng vào không gian làm việc trong bộ chọn tài liệu.",
      branch: "Nhánh bạn muốn thu thập tệp.",
      branch_loading: "-- đang tải các nhánh có sẵn --",
      branch_explained: "Nhánh bạn muốn thu thập tệp.",
      token_information:
        "Nếu không điền <b>Token Truy cập GitHub</b>, trình kết nối dữ liệu này chỉ có thể thu thập các tệp <b>cấp cao nhất</b> của kho do giới hạn tốc độ API công khai của GitHub.",
      token_personal:
        "Nhận Token Truy cập Cá nhân miễn phí với tài khoản GitHub tại đây.",
    },
    gitlab: {
      name: "Kho GitLab",
      description:
        "Nhập toàn bộ kho GitLab công khai hoặc riêng tư chỉ với một cú nhấp chuột.",
      URL: "URL Kho GitLab",
      URL_explained: "URL của kho GitLab bạn muốn thu thập.",
      token: "Token Truy cập GitLab",
      optional: "tùy chọn",
      token_description: "Chọn các thực thể bổ sung để lấy từ API GitLab.",
      token_explained_start: "Nếu không có ",
      token_explained_link1: "Token Truy cập Cá nhân",
      token_explained_middle:
        ", API GitLab có thể giới hạn số lượng tệp có thể thu thập do giới hạn tốc độ. Bạn có thể ",
      token_explained_link2: "tạo Token Truy cập tạm thời",
      token_explained_end: " để tránh vấn đề này.",
      fetch_issues: "Lấy Issues dưới dạng Tài liệu",
      ignores: "Bỏ qua Tệp",
      git_ignore:
        "Danh sách theo định dạng .gitignore để bỏ qua các tệp cụ thể trong quá trình thu thập. Nhấn enter sau mỗi mục bạn muốn lưu.",
      task_explained:
        "Khi hoàn tất, tất cả các tệp sẽ có sẵn để nhúng vào không gian làm việc trong bộ chọn tài liệu.",
      branch: "Nhánh bạn muốn thu thập tệp",
      branch_loading: "-- đang tải các nhánh có sẵn --",
      branch_explained: "Nhánh bạn muốn thu thập tệp.",
      token_information:
        "Nếu không điền <b>Token Truy cập GitLab</b>, trình kết nối dữ liệu này chỉ có thể thu thập các tệp <b>cấp cao nhất</b> của kho do giới hạn tốc độ API công khai của GitLab.",
      token_personal:
        "Nhận Token Truy cập Cá nhân miễn phí với tài khoản GitLab tại đây.",
    },
    youtube: {
      name: "Bản ghi YouTube",
      description: "Nhập bản ghi của toàn bộ video YouTube từ một liên kết.",
      URL: "URL Video YouTube",
      URL_explained_start:
        "Nhập URL của bất kỳ video YouTube nào để lấy bản ghi. Video phải có ",
      URL_explained_link: "phụ đề đóng",
      URL_explained_end: " có sẵn.",
      task_explained:
        "Khi hoàn tất, bản ghi sẽ có sẵn để nhúng vào không gian làm việc trong bộ chọn tài liệu.",
    },
    "website-depth": {
      name: "Trình thu thập Liên kết Hàng loạt",
      description:
        "Thu thập một website và các liên kết con của nó đến một độ sâu nhất định.",
      URL: "URL Website",
      URL_explained: "URL của website bạn muốn thu thập.",
      depth: "Độ sâu Thu thập",
      depth_explained:
        "Đây là số lượng liên kết con mà worker sẽ theo dõi từ URL gốc.",
      max_pages: "Số trang Tối đa",
      max_pages_explained: "Số lượng liên kết tối đa để thu thập.",
      task_explained:
        "Khi hoàn tất, tất cả nội dung đã thu thập sẽ có sẵn để nhúng vào không gian làm việc trong bộ chọn tài liệu.",
    },
    confluence: {
      name: "Confluence",
      description: "Nhập toàn bộ trang Confluence chỉ với một cú nhấp chuột.",
      deployment_type: "Loại triển khai Confluence",
      deployment_type_explained:
        "Xác định phiên bản Confluence của bạn được lưu trữ trên đám mây Atlassian hay tự lưu trữ.",
      base_url: "URL cơ sở Confluence",
      base_url_explained: "Đây là URL cơ sở của không gian Confluence của bạn.",
      space_key: "Khóa không gian Confluence",
      space_key_explained:
        "Đây là khóa không gian của phiên bản confluence của bạn sẽ được sử dụng. Thường bắt đầu bằng ~",
      username: "Tên người dùng Confluence",
      username_explained: "Tên người dùng Confluence của bạn",
      auth_type: "Loại Xác thực Confluence",
      auth_type_explained:
        "Chọn loại xác thực bạn muốn sử dụng để truy cập các trang Confluence của mình.",
      auth_type_username: "Tên người dùng và Token Truy cập",
      auth_type_personal: "Token Truy cập Cá nhân",
      token: "Token Truy cập Confluence",
      token_explained_start:
        "Bạn cần cung cấp token truy cập để xác thực. Bạn có thể tạo token truy cập ",
      token_explained_link: "tại đây",
      token_desc: "Token truy cập để xác thực",
      pat_token: "Token Truy cập Cá nhân Confluence",
      pat_token_explained: "Token truy cập cá nhân Confluence của bạn.",
      task_explained:
        "Khi hoàn tất, nội dung trang sẽ có sẵn để nhúng vào không gian làm việc trong bộ chọn tài liệu.",
      bypass_ssl: "Bỏ qua Xác thực Chứng chỉ SSL",
      bypass_ssl_explained:
        "Bật tùy chọn này để bỏ qua xác thực chứng chỉ SSL cho các phiên bản confluence tự lưu trữ với chứng chỉ tự ký",
    },
    manage: {
      documents: "Tài liệu",
      "data-connectors": "Trình kết nối Dữ liệu",
      "desktop-only":
        "Chỉnh sửa các cài đặt này chỉ có sẵn trên thiết bị máy tính để bàn. Vui lòng truy cập trang này trên máy tính để bàn của bạn để tiếp tục.",
      dismiss: "Đóng",
      editing: "Đang chỉnh sửa",
    },
    directory: {
      "my-documents": "Tài liệu của tôi",
      "new-folder": "Thư mục Mới",
      "search-document": "Tìm kiếm tài liệu",
      "no-documents": "Không có Tài liệu",
      "move-workspace": "Di chuyển đến Không gian làm việc",
      "delete-confirmation":
        "Bạn có chắc chắn muốn xóa các tệp và thư mục này?\nĐiều này sẽ xóa các tệp khỏi hệ thống và tự động xóa chúng khỏi bất kỳ không gian làm việc hiện có nào.\nHành động này không thể hoàn tác.",
      "removing-message":
        "Đang xóa {{count}} tài liệu và {{folderCount}} thư mục. Vui lòng chờ.",
      "move-success": "Đã di chuyển thành công {{count}} tài liệu.",
      no_docs: "Không có Tài liệu",
      select_all: "Chọn Tất cả",
      deselect_all: "Bỏ chọn Tất cả",
      remove_selected: "Xóa Đã chọn",
      costs: "*Chi phí một lần cho việc nhúng",
      save_embed: "Lưu và Nhúng",
      "total-documents_one": "{{count}}",
      "total-documents_other": "{{count}}",
    },
    upload: {
      "processor-offline": "Trình xử lý Tài liệu Không khả dụng",
      "processor-offline-desc":
        "Chúng tôi không thể tải lên tệp của bạn ngay bây giờ vì trình xử lý tài liệu đang ngoại tuyến. Vui lòng thử lại sau.",
      "click-upload": "Nhấp để tải lên hoặc kéo và thả",
      "file-types":
        "hỗ trợ tệp văn bản, csv, bảng tính, tệp âm thanh và hơn thế nữa!",
      "or-submit-link": "hoặc gửi liên kết",
      "placeholder-link": "https://example.com",
      fetching: "Đang lấy...",
      "fetch-website": "Lấy website",
      "privacy-notice":
        "Các tệp này sẽ được tải lên trình xử lý tài liệu đang chạy trên phiên bản AnythingLLM này. Các tệp này không được gửi hoặc chia sẻ với bên thứ ba.",
    },
    pinning: {
      what_pinning: "Ghim tài liệu là gì?",
      pin_explained_block1:
        "Khi bạn <b>ghim</b> một tài liệu trong AnythingLLM, chúng tôi sẽ đưa toàn bộ nội dung của tài liệu vào cửa sổ prompt của bạn để LLM hiểu đầy đủ.",
      pin_explained_block2:
        "Điều này hoạt động tốt nhất với <b>mô hình ngữ cảnh lớn</b> hoặc các tệp nhỏ quan trọng với cơ sở kiến thức của nó.",
      pin_explained_block3:
        "Nếu bạn không nhận được câu trả lời mong muốn từ AnythingLLM theo mặc định, ghim là một cách tuyệt vời để có được câu trả lời chất lượng cao hơn chỉ với một cú nhấp chuột.",
      accept: "Ok, tôi hiểu rồi",
    },
    watching: {
      what_watching: "Theo dõi tài liệu làm gì?",
      watch_explained_block1:
        "Khi bạn <b>theo dõi</b> một tài liệu trong AnythingLLM, chúng tôi sẽ <i>tự động</i> đồng bộ nội dung tài liệu của bạn từ nguồn gốc theo các khoảng thời gian đều đặn. Điều này sẽ tự động cập nhật nội dung trong mọi không gian làm việc nơi tệp này được quản lý.",
      watch_explained_block2:
        "Tính năng này hiện chỉ hỗ trợ nội dung dựa trên trực tuyến và sẽ không khả dụng cho các tài liệu được tải lên thủ công.",
      watch_explained_block3_start:
        "Bạn có thể quản lý những tài liệu nào đang được theo dõi từ ",
      watch_explained_block3_link: "Trình quản lý tệp",
      watch_explained_block3_end: " chế độ xem quản trị.",
      accept: "Ok, tôi hiểu rồi",
    },
    obsidian: {
      vault_location: "Vị trí Kho",
      vault_description:
        "Chọn thư mục kho Obsidian của bạn để nhập tất cả ghi chú và kết nối của chúng.",
      selected_files: "Tìm thấy {{count}} tệp markdown",
      importing: "Đang nhập kho...",
      import_vault: "Nhập Kho",
      processing_time:
        "Điều này có thể mất một lúc tùy thuộc vào kích thước kho của bạn.",
      vault_warning:
        "Để tránh xung đột, hãy đảm bảo kho Obsidian của bạn hiện không mở.",
    },
  },
  chat_window: {
    send_message: "Gửi tin nhắn",
    attach_file: "Đính kèm tệp vào cuộc trò chuyện này",
    text_size: "Thay đổi kích thước văn bản.",
    microphone: "Nói prompt của bạn.",
    send: "Gửi tin nhắn prompt đến không gian làm việc",
    attachments_processing: "Đang xử lý tệp đính kèm. Vui lòng chờ...",
    tts_speak_message: "TTS Đọc tin nhắn",
    copy: "Sao chép",
    regenerate: "Tạo lại",
    regenerate_response: "Tạo lại phản hồi",
    good_response: "Phản hồi tốt",
    more_actions: "Thêm hành động",
    fork: "Rẽ nhánh",
    delete: "Xóa",
    cancel: "Hủy",
    edit_prompt: "Chỉnh sửa prompt",
    edit_response: "Chỉnh sửa phản hồi",
    preset_reset_description:
      "Xóa lịch sử trò chuyện và bắt đầu cuộc trò chuyện mới",
    add_new_preset: " Thêm Cài đặt sẵn Mới",
    command: "Lệnh",
    your_command: "lệnh-của-bạn",
    placeholder_prompt: "Đây là nội dung sẽ được đưa vào trước prompt của bạn.",
    description: "Mô tả",
    placeholder_description: "Phản hồi bằng một bài thơ về LLM.",
    save: "Lưu",
    small: "Nhỏ",
    normal: "Bình thường",
    large: "Lớn",
    workspace_llm_manager: {
      search: "Tìm kiếm nhà cung cấp LLM",
      loading_workspace_settings: "Đang tải cài đặt không gian làm việc...",
      available_models: "Mô hình Có sẵn cho {{provider}}",
      available_models_description:
        "Chọn một mô hình để sử dụng cho không gian làm việc này.",
      save: "Sử dụng mô hình này",
      saving: "Đang đặt mô hình làm mặc định không gian làm việc...",
      missing_credentials: "Nhà cung cấp này thiếu thông tin đăng nhập!",
      missing_credentials_description: "Nhấp để thiết lập thông tin đăng nhập",
    },
    submit: "Gửi",
    edit_info_user:
      '"Gửi" sẽ tạo lại phản hồi của AI. "Lưu" chỉ cập nhật tin nhắn của bạn.',
    edit_info_assistant:
      "Các thay đổi của bạn sẽ được lưu trực tiếp vào phản hồi này.",
    see_less: "Xem ít hơn",
    see_more: "Xem thêm",
    tools: "Dụng cụ",
    text_size_label: "Kích thước văn bản",
    select_model: "Chọn mẫu",
    sources: "Nguồn",
    document: "Tài liệu",
    similarity_match: "trận đấu",
    source_count_one: "{{count}} tham khảo",
    source_count_other: "{{count}} – Tham khảo",
    preset_exit_description: "Dừng lại phiên làm việc hiện tại",
    add_new: "Thêm mới",
    edit: "Chỉnh sửa",
    publish: "Đăng tải",
    stop_generating: "Dừng tạo ra phản hồi",
    slash_commands: "Lệnh tắt/bật",
    agent_skills: "Kỹ năng của đại lý",
    manage_agent_skills: "Quản lý kỹ năng của đại lý",
    agent_skills_disabled_in_session:
      "Không thể thay đổi kỹ năng trong khi đang tham gia phiên làm việc. Trước tiên, hãy sử dụng lệnh /exit để kết thúc phiên làm việc.",
    start_agent_session: "Bắt đầu phiên làm việc với đại lý",
    use_agent_session_to_use_tools:
      "Bạn có thể sử dụng các công cụ trong cuộc trò chuyện bằng cách bắt đầu một phiên với trợ lý bằng cách sử dụng '@agent' ở đầu yêu cầu của bạn.",
    agent_invocation: {
      model_wants_to_call: "Người mẫu muốn gọi",
      approve: "Chấp thuận",
      reject: "Từ chối",
      always_allow: "Luôn luôn đảm bảo {{skillName}}",
      tool_call_was_approved: "Đã được phê duyệt yêu cầu dụng cụ.",
      tool_call_was_rejected: "Yêu cầu gọi công cụ đã bị từ chối.",
    },
  },
  profile_settings: {
    edit_account: "Chỉnh sửa Tài khoản",
    profile_picture: "Ảnh Hồ sơ",
    remove_profile_picture: "Xóa Ảnh Hồ sơ",
    username: "Tên người dùng",
    new_password: "Mật khẩu Mới",
    password_description: "Mật khẩu phải có ít nhất 8 ký tự",
    cancel: "Hủy",
    update_account: "Cập nhật Tài khoản",
    theme: "Tùy chọn Giao diện",
    language: "Ngôn ngữ ưa thích",
    failed_upload: "Không thể tải lên ảnh hồ sơ: {{error}}",
    upload_success: "Đã tải lên ảnh hồ sơ.",
    failed_remove: "Không thể xóa ảnh hồ sơ: {{error}}",
    profile_updated: "Hồ sơ đã được cập nhật.",
    failed_update_user: "Không thể cập nhật người dùng: {{error}}",
    account: "Tài khoản",
    support: "Hỗ trợ",
    signout: "Đăng xuất",
  },
  customization: {
    interface: {
      title: "Tùy chọn Giao diện",
      description: "Đặt tùy chọn giao diện của bạn cho AnythingLLM.",
    },
    branding: {
      title: "Thương hiệu & Nhãn trắng",
      description:
        "Nhãn trắng phiên bản AnythingLLM của bạn với thương hiệu tùy chỉnh.",
    },
    chat: {
      title: "Trò chuyện",
      description: "Đặt tùy chọn trò chuyện của bạn cho AnythingLLM.",
      auto_submit: {
        title: "Tự động Gửi Đầu vào Giọng nói",
        description:
          "Tự động gửi đầu vào giọng nói sau một khoảng thời gian im lặng",
      },
      auto_speak: {
        title: "Tự động Đọc Phản hồi",
        description: "Tự động đọc phản hồi từ AI",
      },
      spellcheck: {
        title: "Bật Kiểm tra Chính tả",
        description:
          "Bật hoặc tắt kiểm tra chính tả trong trường nhập trò chuyện",
      },
    },
    items: {
      theme: {
        title: "Giao diện",
        description: "Chọn giao diện màu ưa thích của bạn cho ứng dụng.",
      },
      "show-scrollbar": {
        title: "Hiện Thanh cuộn",
        description: "Bật hoặc tắt thanh cuộn trong cửa sổ trò chuyện.",
      },
      "support-email": {
        title: "Email Hỗ trợ",
        description:
          "Đặt địa chỉ email hỗ trợ mà người dùng có thể truy cập khi họ cần trợ giúp.",
      },
      "app-name": {
        title: "Tên",
        description:
          "Đặt tên được hiển thị trên trang đăng nhập cho tất cả người dùng.",
      },
      "display-language": {
        title: "Ngôn ngữ Hiển thị",
        description:
          "Chọn ngôn ngữ ưa thích để hiển thị giao diện người dùng của AnythingLLM - khi bản dịch có sẵn.",
      },
      logo: {
        title: "Logo Thương hiệu",
        description:
          "Tải lên logo tùy chỉnh của bạn để hiển thị trên tất cả các trang.",
        add: "Thêm logo tùy chỉnh",
        recommended: "Kích thước khuyến nghị: 800 x 200",
        remove: "Xóa",
        replace: "Thay thế",
      },
      "browser-appearance": {
        title: "Giao diện Trình duyệt",
        description:
          "Tùy chỉnh giao diện của tab trình duyệt và tiêu đề khi ứng dụng đang mở.",
        tab: {
          title: "Tiêu đề",
          description:
            "Đặt tiêu đề tab tùy chỉnh khi ứng dụng đang mở trong trình duyệt.",
        },
        favicon: {
          title: "Favicon",
          description: "Sử dụng favicon tùy chỉnh cho tab trình duyệt.",
        },
      },
      "sidebar-footer": {
        title: "Mục Chân trang Thanh bên",
        description: "Tùy chỉnh các mục chân trang hiển thị ở cuối thanh bên.",
        icon: "Biểu tượng",
        link: "Liên kết",
      },
      "render-html": {
        title: "Hiển thị HTML trong trò chuyện",
        description:
          "Hiển thị phản hồi HTML trong các phản hồi của trợ lý.\nĐiều này có thể mang lại chất lượng phản hồi cao hơn nhiều, nhưng cũng có thể dẫn đến các rủi ro bảo mật tiềm ẩn.",
      },
    },
  },
  "main-page": {
    quickActions: {
      createAgent: "Tạo một đại lý",
      editWorkspace: "Chỉnh sửa không gian làm việc",
      uploadDocument: "Tải lên một tài liệu",
    },
    greeting: "Hôm nay tôi có thể giúp gì cho bạn?",
  },
  "keyboard-shortcuts": {
    title: "Phím tắt",
    shortcuts: {
      settings: "Mở Cài đặt",
      workspaceSettings: "Mở Cài đặt Không gian làm việc Hiện tại",
      home: "Đi đến Trang chủ",
      workspaces: "Quản lý Không gian làm việc",
      apiKeys: "Cài đặt Khóa API",
      llmPreferences: "Tùy chọn LLM",
      chatSettings: "Cài đặt Trò chuyện",
      help: "Hiện trợ giúp phím tắt",
      showLLMSelector: "Hiện Bộ chọn LLM không gian làm việc",
    },
  },
  community_hub: {
    publish: {
      system_prompt: {
        success_title: "Thành công!",
        success_description:
          "System Prompt của bạn đã được đăng lên Community Hub!",
        success_thank_you: "Cảm ơn bạn đã chia sẻ với Cộng đồng!",
        view_on_hub: "Xem trên Community Hub",
        modal_title: "Đăng System Prompt",
        name_label: "Tên",
        name_description: "Đây là tên hiển thị của system prompt của bạn.",
        name_placeholder: "System Prompt của tôi",
        description_label: "Mô tả",
        description_description:
          "Đây là mô tả của system prompt của bạn. Sử dụng điều này để mô tả mục đích của system prompt của bạn.",
        tags_label: "Thẻ",
        tags_description:
          "Thẻ được sử dụng để gắn nhãn system prompt của bạn để dễ tìm kiếm hơn. Bạn có thể thêm nhiều thẻ. Tối đa 5 thẻ. Tối đa 20 ký tự mỗi thẻ.",
        tags_placeholder: "Nhập và nhấn Enter để thêm thẻ",
        visibility_label: "Hiển thị",
        public_description:
          "System prompt công khai hiển thị cho tất cả mọi người.",
        private_description: "System prompt riêng tư chỉ hiển thị cho bạn.",
        publish_button: "Đăng lên Community Hub",
        submitting: "Đang đăng...",
        prompt_label: "Prompt",
        prompt_description:
          "Đây là system prompt thực tế sẽ được sử dụng để hướng dẫn LLM.",
        prompt_placeholder: "Nhập system prompt của bạn ở đây...",
      },
      agent_flow: {
        success_title: "Thành công!",
        success_description:
          "Luồng Agent của bạn đã được đăng lên Community Hub!",
        success_thank_you: "Cảm ơn bạn đã chia sẻ với Cộng đồng!",
        view_on_hub: "Xem trên Community Hub",
        modal_title: "Đăng Luồng Agent",
        name_label: "Tên",
        name_description: "Đây là tên hiển thị của luồng agent của bạn.",
        name_placeholder: "Luồng Agent của tôi",
        description_label: "Mô tả",
        description_description:
          "Đây là mô tả của luồng agent của bạn. Sử dụng điều này để mô tả mục đích của luồng agent của bạn.",
        tags_label: "Thẻ",
        tags_description:
          "Thẻ được sử dụng để gắn nhãn luồng agent của bạn để dễ tìm kiếm hơn. Bạn có thể thêm nhiều thẻ. Tối đa 5 thẻ. Tối đa 20 ký tự mỗi thẻ.",
        tags_placeholder: "Nhập và nhấn Enter để thêm thẻ",
        visibility_label: "Hiển thị",
        submitting: "Đang đăng...",
        submit: "Đăng lên Community Hub",
        privacy_note:
          "Luồng agent luôn được tải lên dưới dạng riêng tư để bảo vệ bất kỳ dữ liệu nhạy cảm nào. Bạn có thể thay đổi khả năng hiển thị trong Community Hub sau khi đăng. Vui lòng xác minh luồng của bạn không chứa bất kỳ thông tin nhạy cảm hoặc riêng tư nào trước khi đăng.",
      },
      slash_command: {
        success_title: "Thành công!",
        success_description:
          "Lệnh Gạch chéo của bạn đã được đăng lên Community Hub!",
        success_thank_you: "Cảm ơn bạn đã chia sẻ với Cộng đồng!",
        view_on_hub: "Xem trên Community Hub",
        modal_title: "Đăng Lệnh Gạch chéo",
        name_label: "Tên",
        name_description: "Đây là tên hiển thị của lệnh gạch chéo của bạn.",
        name_placeholder: "Lệnh Gạch chéo của tôi",
        description_label: "Mô tả",
        description_description:
          "Đây là mô tả của lệnh gạch chéo của bạn. Sử dụng điều này để mô tả mục đích của lệnh gạch chéo của bạn.",
        tags_label: "Thẻ",
        tags_description:
          "Thẻ được sử dụng để gắn nhãn lệnh gạch chéo của bạn để dễ tìm kiếm hơn. Bạn có thể thêm nhiều thẻ. Tối đa 5 thẻ. Tối đa 20 ký tự mỗi thẻ.",
        tags_placeholder: "Nhập và nhấn Enter để thêm thẻ",
        visibility_label: "Hiển thị",
        public_description:
          "Lệnh gạch chéo công khai hiển thị cho tất cả mọi người.",
        private_description: "Lệnh gạch chéo riêng tư chỉ hiển thị cho bạn.",
        publish_button: "Đăng lên Community Hub",
        submitting: "Đang đăng...",
        prompt_label: "Prompt",
        prompt_description:
          "Đây là prompt sẽ được sử dụng khi lệnh gạch chéo được kích hoạt.",
        prompt_placeholder: "Nhập prompt của bạn ở đây...",
      },
      generic: {
        unauthenticated: {
          title: "Yêu cầu Xác thực",
          description:
            "Bạn cần xác thực với AnythingLLM Community Hub trước khi đăng các mục.",
          button: "Kết nối với Community Hub",
        },
      },
    },
  },
  security: {
    title: "Bảo mật",
    multiuser: {
      title: "Chế độ Đa Người dùng",
      description:
        "Thiết lập phiên bản của bạn để hỗ trợ nhóm bằng cách kích hoạt Chế độ Đa Người dùng.",
      enable: {
        "is-enable": "Chế độ Đa Người dùng đã Được Bật",
        enable: "Bật Chế độ Đa Người dùng",
        description:
          "Theo mặc định, bạn sẽ là quản trị viên duy nhất. Với tư cách quản trị viên, bạn sẽ cần tạo tài khoản cho tất cả người dùng hoặc quản trị viên mới. Không được mất mật khẩu vì chỉ người dùng Quản trị viên mới có thể đặt lại mật khẩu.",
        username: "Tên người dùng tài khoản Quản trị viên",
        password: "Mật khẩu tài khoản Quản trị viên",
      },
    },
    password: {
      title: "Bảo vệ Mật khẩu",
      description:
        "Bảo vệ phiên bản AnythingLLM của bạn bằng mật khẩu. Nếu bạn quên mật khẩu này, không có phương pháp khôi phục nên hãy đảm bảo lưu mật khẩu này.",
      "password-label": "Mật khẩu của phiên bản",
    },
  },
  home: {
    welcome: "Chào mừng bạn",
    chooseWorkspace: "Chọn một khu vực làm việc để bắt đầu trò chuyện!",
    notAssigned:
      "Bạn hiện không được giao việc nào.\nLiên hệ với quản trị viên của bạn để yêu cầu truy cập vào khu vực làm việc.",
    goToWorkspace: 'Chuyển đến khu vực làm việc "{{workspace}}"',
  },
  telegram: {
    title: "Bot Telegram",
    description:
      "Kết nối phiên bản AnythingLLM của bạn với Telegram để bạn có thể trò chuyện với các không gian làm việc của mình từ bất kỳ thiết bị nào.",
    setup: {
      step1: {
        title: "Bước 1: Tạo bot Telegram của bạn",
        description:
          "Mở ứng dụng @BotFather trên Telegram, gửi lệnh <code>/newbot</code> đến tài khoản <code>@BotFather</code>, làm theo hướng dẫn và sao chép mã API.",
        "open-botfather": "Mở BotFather",
        "instruction-1": "1. Mở liên kết hoặc quét mã QR",
        "instruction-2":
          "2. Gửi <code>/newbot</code> đến <code>@BotFather</code>",
        "instruction-3": "3. Chọn tên và tên người dùng cho bot của bạn",
        "instruction-4": "4. Sao chép mã API mà bạn nhận được",
      },
      step2: {
        title: "Bước 2: Kết nối bot của bạn",
        description:
          "Dán mã API mà bạn nhận được từ @BotFather và chọn không gian làm việc mặc định để bot của bạn có thể trò chuyện.",
        "bot-token": "Token Bot",
        "default-workspace": "Không gian làm việc mặc định",
        "no-workspace":
          "Không có không gian làm việc nào khả dụng. Một không gian mới sẽ được tạo ra.",
        connecting: "Kết nối...",
        "connect-bot": "Bot kết nối",
      },
      security: {
        title: "Các cài đặt bảo mật được khuyến nghị",
        description:
          "Để tăng cường bảo mật, hãy cấu hình các cài đặt này trên tài khoản @BotFather.",
        "disable-groups": "— Ngăn chặn việc thêm bot vào các nhóm",
        "disable-inline":
          "— Ngăn chặn việc sử dụng bot trong tìm kiếm trực tiếp.",
        "obscure-username":
          "Sử dụng tên người dùng bot không phổ biến để giảm khả năng được tìm thấy.",
      },
      "toast-enter-token": "Vui lòng nhập mã token cho bot.",
      "toast-connect-failed": "Không thể kết nối với trợ lý.",
    },
    connected: {
      status: "Kết nối",
      "status-disconnected":
        "Không kết nối — mã token có thể đã hết hạn hoặc không hợp lệ",
      "placeholder-token": "Dán mã token mới cho bot...",
      reconnect: "Khôi phục kết nối",
      workspace: "Không gian làm việc",
      "bot-link": "Liên kết Bot",
      "voice-response": "Phản hồi bằng giọng nói",
      disconnecting: "Ngắt kết nối...",
      disconnect: "Ngắt kết nối",
      "voice-text-only": "Chỉ nội dung",
      "voice-mirror": "Trả lời bằng giọng nói (khi người dùng gửi giọng nói)",
      "voice-always":
        "Luôn luôn có thể gửi phản hồi bằng giọng nói (gửi kèm âm thanh trong mỗi phản hồi).",
      "toast-disconnect-failed": "Không thể ngắt kết nối bot.",
      "toast-reconnect-failed": "Không thể kết nối lại với trình bot.",
      "toast-voice-failed": "Không thể cập nhật chế độ giọng nói.",
      "toast-approve-failed": "Không thể xác nhận tài khoản người dùng.",
      "toast-deny-failed": "Không thể từ chối yêu cầu của người dùng.",
      "toast-revoke-failed": "Không thể thu hồi quyền truy cập cho người dùng.",
    },
    users: {
      "pending-title": "Chờ phê duyệt",
      "pending-description":
        "Người dùng đang chờ xác nhận. So sánh mã ghép đôi được hiển thị ở đây với mã hiển thị trong cuộc trò chuyện Telegram của họ.",
      "approved-title": "Người dùng đã được phê duyệt",
      "approved-description":
        "Người dùng đã được chấp thuận để trò chuyện với bot của bạn.",
      user: "Người dùng",
      "pairing-code": "Mã ghép",
      "no-pending": "Không có yêu cầu nào đang chờ xử lý.",
      "no-approved": "Không có người dùng được xác nhận",
      unknown: "Không xác định",
      approve: "Chấp thuận",
      deny: "Từ chối",
      revoke: "Thu hồi",
    },
  },
};

export default TRANSLATIONS;
