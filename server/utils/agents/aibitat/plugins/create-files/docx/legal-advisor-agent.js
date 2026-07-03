/**
 * Legal Advisor Sub-Agent for Vietnamese Administrative Documents.
 *
 * Spawns a focused child AIbitat agent that:
 * 1. Uses web-search to look up relevant Vietnamese laws/decrees
 * 2. Suggests legal bases (căn cứ pháp lý) for the document
 * 3. Reviews and advises on the document content
 * 4. Submits the advisory via a structured tool call
 *
 * Pattern follows the PPTX section-agent.js approach.
 */

const AIbitat = require("../../../index.js");

const LEGAL_ADVISOR_PROMPT = `Bạn là chuyên viên pháp chế Việt Nam, hỗ trợ soạn thảo văn bản hành chính.

NHIỆM VỤ:
1. Dựa trên thông tin văn bản được cung cấp, tra cứu internet tìm các văn bản pháp luật Việt Nam liên quan (Luật, Nghị định, Thông tư, Quyết định...).
2. Đề xuất danh sách "Căn cứ pháp lý" phù hợp cho văn bản.
3. Xem xét nội dung dự thảo và tham mưu chỉnh sửa/bổ sung nếu cần.
4. Đảm bảo nội dung tuân thủ quy định pháp luật hiện hành.

QUY TẮC CĂN CỨ PHÁP LÝ:
- Luôn sử dụng web search để tra cứu văn bản pháp luật MỚI NHẤT liên quan (lưu ý phải lấy cả các luật sửa đổi, bổ sung mới nhất tính đến thời điểm hiện tại).
- Mỗi mục căn cứ trong danh sách BẮT BUỘC phải bắt đầu bằng từ "Căn cứ " (không viết tắt, viết hoa chữ cái đầu).
- Căn cứ pháp lý phải ghi đầy đủ: Loại văn bản + Số/Ký hiệu + Ngày ban hành + Cơ quan ban hành + Tên văn bản. Nếu có luật sửa đổi, bổ sung thì phải ghi rõ.
  Ví dụ: "Căn cứ Luật Xây dựng ngày 18 tháng 6 năm 2014; và Luật sửa đổi, bổ sung một số điều của Luật Xây dựng ngày 17 tháng 6 năm 2020"
  Ví dụ: "Căn cứ Nghị định số 30/2020/NĐ-CP ngày 05 tháng 3 năm 2020 của Chính phủ về công tác văn thư"
- KHÔNG bịa đặt số hiệu văn bản pháp luật không có thật.

QUY TẮC VIẾT NỘI DUNG (revisedContent):
- Nội dung phải ĐẦY ĐỦ, CHI TIẾT, CHUYÊN NGHIỆP. Tối thiểu 500 chữ.
- ĐỊNH DẠNG ĐỀ MỤC TRONG NỘI DUNG:
  + Chương/Phần: Sử dụng Heading 1 (#) (ví dụ: \`# CHƯƠNG I. TÌNH HÌNH CHUNG\`)
  + Mục/Điều: Sử dụng Heading 2 (##) (ví dụ: \`## Điều 1. Phạm vi điều chỉnh\`)
  + Tiểu mục/Khoản: Sử dụng Heading 3 (###) (ví dụ: \`### 1. Về phía công ty\`)
  + Điểm/Chi tiết: Sử dụng Heading 4 (####) (ví dụ: \`#### a) Lĩnh vực kinh tế\`)
- TRÌNH BÀY DỮ LIỆU: BẮT BUỘC sử dụng bảng (Markdown Table) khi có danh sách phân loại, số liệu tài chính, phân công công việc hoặc so sánh dữ liệu chi tiết.
- VĂN PHONG HÀNH CHÍNH: Không dùng ngôi thứ nhất (tôi, chúng tôi), không dùng ngôn ngữ khẩu ngữ. Dùng câu bị động khi cần.
- MÀU SẮC & FONT: Toàn bộ văn bản chỉ sử dụng chữ màu đen thuần, không thêm mã màu hay màu chữ khác.
- KHÔNG đưa Tiêu đề chính (Tên loại văn bản, Trích yếu, Quốc hiệu, Tiêu ngữ, Số ký hiệu) vào revisedContent vì hệ thống đã tự động tạo.

Khi hoàn thành, BẮT BUỘC gọi tool submit-advisory với kết quả. Không trả lời bằng JSON thuần.`;

/**
 * Spawns a legal advisor sub-agent to research and advise on document content.
 *
 * @param {Object} options
 * @param {AIbitat} options.parentAibitat - The parent AIbitat instance
 * @param {string} options.documentType - Type of document (e.g., "cong-van", "to-trinh")
 * @param {string} options.documentTypeName - Full Vietnamese name (e.g., "CÔNG VĂN")
 * @param {string} options.title - Document title/summary
 * @param {string} options.content - Draft content
 * @param {string} options.issuingAgency - Issuing agency name
 * @param {string[]} [options.userLegalBasis] - User-provided legal bases (if any)
 * @returns {Promise<{legalBasis: string[], advisoryNotes: string, revisedContent: string|null, citations: Object[]}>}
 */
async function runLegalAdvisorAgent({
  parentAibitat,
  documentType,
  documentTypeName,
  title,
  content,
  issuingAgency,
  userLegalBasis = [],
}) {
  const log = parentAibitat.handlerProps?.log || console.log;

  const childAibitat = new AIbitat({
    provider: parentAibitat.defaultProvider.provider,
    model: parentAibitat.defaultProvider.model,
    chats: [],
    handlerProps: parentAibitat.handlerProps,
    maxToolCalls: 8,
  });

  // Share introspect so research activity streams to the frontend
  childAibitat.introspect = parentAibitat.introspect;

  // Filtered socket: suppress reportStreamEvent from sub-agent
  childAibitat.socket = {
    send: (type, content) => {
      if (type === "reportStreamEvent") return;
      parentAibitat.socket?.send(type, content);
    },
  };

  // Load web-search tools for legal research
  const { webBrowsing } = require("../../web-browsing.js");
  const { webScraping } = require("../../web-scraping.js");
  childAibitat.use(webBrowsing.plugin());
  childAibitat.use(webScraping.plugin());

  // Internal tool for submitting the advisory result
  childAibitat.function({
    super: childAibitat,
    name: "submit-advisory",
    description:
      "Submit your legal advisory results including suggested legal bases and content review. Call this when you have completed your research.",
    parameters: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        legalBasis: {
          type: "array",
          items: { type: "string" },
          description:
            'Array of legal basis strings. Each should be a full citation like "Căn cứ Luật ... ngày ... tháng ... năm ... của ..."',
        },
        advisoryNotes: {
          type: "string",
          description:
            "Your advisory notes about the document content - suggestions, corrections, or confirmation that the content is appropriate.",
        },
        revisedContent: {
          type: "string",
          description:
            "If you suggest changes to the body content, provide the revised version in markdown. If the original content is fine, leave this null/empty.",
        },
      },
      required: ["legalBasis", "advisoryNotes"],
      additionalProperties: false,
    },
    handler: function ({ legalBasis, advisoryNotes, revisedContent }) {
      this.super._advisoryResult = {
        legalBasis: legalBasis || [],
        advisoryNotes: advisoryNotes || "",
        revisedContent: revisedContent || null,
      };
      return "Advisory submitted successfully. Research complete.";
    },
  });

  // Build the user prompt
  const userPrompt = buildAdvisoryPrompt({
    documentType,
    documentTypeName,
    title,
    content,
    issuingAgency,
    userLegalBasis,
  });

  const functions = Array.from(childAibitat.functions.values());
  const messages = [
    { role: "system", content: LEGAL_ADVISOR_PROMPT },
    { role: "user", content: userPrompt },
  ];

  const provider = childAibitat.getProviderForConfig(
    childAibitat.defaultProvider
  );
  provider.attachHandlerProps(childAibitat.handlerProps);

  log(
    `[LegalAdvisor] Running sub-agent for ${documentTypeName}: "${title}" with ${functions.length} tools`
  );

  try {
    if (provider.supportsAgentStreaming) {
      await childAibitat.handleAsyncExecution(
        provider,
        messages,
        functions,
        "@legal-advisor"
      );
    } else {
      await childAibitat.handleExecution(
        provider,
        messages,
        functions,
        "@legal-advisor"
      );
    }
  } catch (error) {
    log(`[LegalAdvisor] Error: ${error.message}`);
    return {
      legalBasis: userLegalBasis,
      advisoryNotes: "Không thể thực hiện tham mưu pháp lý do lỗi kỹ thuật.",
      revisedContent: null,
      citations: [],
    };
  }

  // Collect citations from web research
  const citations = childAibitat._pendingCitations || [];

  // Retrieve advisory result
  const result = childAibitat._advisoryResult;
  if (!result) {
    log(`[LegalAdvisor] No advisory submitted, using defaults`);
    return {
      legalBasis: userLegalBasis,
      advisoryNotes: "Sub-agent không trả về kết quả tham mưu.",
      revisedContent: null,
      citations,
    };
  }

  // Merge user-provided legal basis with agent-suggested ones
  const mergedBasis = [
    ...new Set([...(userLegalBasis || []), ...(result.legalBasis || [])]),
  ];

  log(
    `[LegalAdvisor] Advisory complete: ${mergedBasis.length} legal bases, ${citations.length} citations`
  );

  return {
    legalBasis: mergedBasis,
    advisoryNotes: result.advisoryNotes,
    revisedContent: result.revisedContent,
    citations,
  };
}

/**
 * Builds the user prompt for the legal advisor sub-agent.
 */
function buildAdvisoryPrompt({
  documentType,
  documentTypeName,
  title,
  content,
  issuingAgency,
  userLegalBasis,
}) {
  const parts = [
    `Tôi cần soạn thảo văn bản hành chính:`,
    `\n**Loại văn bản:** ${documentTypeName} (${documentType})`,
    `**Cơ quan ban hành:** ${issuingAgency || "(chưa xác định)"}`,
    `**Trích yếu:** ${title}`,
  ];

  if (content) {
    parts.push(`\n**Nội dung dự thảo:**\n${content}`);
  }

  if (userLegalBasis && userLegalBasis.length > 0) {
    parts.push(
      `\n**Căn cứ pháp lý đã có:**\n${userLegalBasis.map((b) => `- ${b}`).join("\n")}`
    );
  }

  const currentYear = new Date().getFullYear();
  parts.push(
    `\nHãy thực hiện:`,
    `1. Tra cứu web tìm các văn bản pháp luật Việt Nam liên quan đến nội dung trên. ĐẢM BẢO cập nhật các văn bản sửa đổi, bổ sung mới nhất (tính đến năm ${currentYear}).`,
    `2. Đề xuất danh sách "Căn cứ pháp lý" đầy đủ cho văn bản này. Nếu văn bản pháp luật có sửa đổi bổ sung, phải hiển thị đầy đủ cả văn bản gốc và văn bản sửa đổi.`,
    `3. Xem xét và tham mưu về nội dung dự thảo (nếu cần chỉnh sửa, cung cấp bản sửa đổi).`,
    `4. Gọi tool submit-advisory với kết quả.`
  );

  return parts.join("\n");
}

module.exports = { runLegalAdvisorAgent };
