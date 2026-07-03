/**
 * Agent skill: Create Vietnamese Administrative Document (Văn bản hành chính Việt Nam)
 *
 * Generates .docx files conforming to Decree 30/2020/NĐ-CP formatting standards.
 * Uses a legal-advisor sub-agent with web-search to research and verify legal content.
 */
const {
  getDeploymentVersion,
} = require("../../../../../../endpoints/utils.js");
const createFilesLib = require("../lib.js");
const {
  getDocumentTypeKeys,
  getDocumentType,
  extractLegalBasisFromContent,
  buildVnAdminDocx,
} = require("./vn-admin-utils.js");
const { runLegalAdvisorAgent } = require("./legal-advisor-agent.js");
const { loadLibraries } = require("./utils.js");

module.exports.CreateVnAdminDocx = {
  name: "create-vn-admin-docx",
  plugin: function () {
    return {
      name: "create-vn-admin-docx",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Tạo văn bản hành chính Việt Nam (.docx) theo đúng văn phong, thể thức trình bày văn bản hành chính (Nghị định 30/2020/NĐ-CP của Bộ Nội vụ). " +
            "SỬ DỤNG TOOL NÀY NGAY LẬP TỨC nếu user nhắc đến 'Nghị định 30', 'văn bản hành chính', 'công văn', 'quyết định', hoặc yêu cầu 'thể thức Bộ Nội vụ'. " +
            "Tool sẽ tự động tạo file Word chuẩn chỉ với đầy đủ Quốc hiệu, Tiêu ngữ, số ký hiệu, nơi nhận... " +
            "Tool cũng sẽ tự động tra cứu internet để tìm căn cứ pháp lý và tham mưu nội dung. " +
            "Hỗ trợ tất cả 29 loại văn bản hành chính: Công văn, Quyết định, Tờ trình, Báo cáo, Kế hoạch, Thông báo, v.v. " +
            "BẮT BUỘC: Nội dung tạo ra (tham số content) phải đầy đủ, chi tiết, tuỳ theo thể loại văn bản. Không được viết ngắn gọn. " +
            "Tuyệt đối KHÔNG đưa Tiêu đề chính (Tên loại văn bản, Trích yếu, Số ký hiệu, Quốc hiệu, Tiêu ngữ) vào phần content vì hệ thống đã tự động xử lý. Chỉ bắt đầu content từ phần 'Kính gửi' hoặc 'Điều 1...' trở đi.",
          examples: [
            {
              prompt:
                "Tạo công văn đề nghị hỗ trợ kinh phí mua sắm thiết bị",
              call: JSON.stringify({
                filename: "cong-van-de-nghi-ho-tro.docx",
                documentType: "cong-van",
                issuingAgency: "Sở Giáo dục và Đào tạo",
                parentAgency: "Ủy ban nhân dân tỉnh",
                location: "Hà Nội",
                title:
                  "V/v đề nghị hỗ trợ kinh phí mua sắm thiết bị dạy học",
                content:
                  "Kính gửi: Ủy ban nhân dân tỉnh\n\nCăn cứ nhu cầu thực tế về thiết bị dạy học tại các trường trên địa bàn, Sở Giáo dục và Đào tạo kính đề nghị Ủy ban nhân dân tỉnh xem xét, hỗ trợ kinh phí mua sắm thiết bị dạy học năm 2024.\n\n## 1. Thực trạng\n\nHiện tại, nhiều trường học trên địa bàn tỉnh đang thiếu thiết bị dạy học cơ bản.\n\n## 2. Đề xuất\n\nKính đề nghị UBND tỉnh phân bổ kinh phí để mua sắm bổ sung thiết bị.",
                signerTitle: "Giám đốc",
                signerName: "Nguyễn Văn A",
                recipients: [
                  "UBND tỉnh",
                  "Sở Tài chính",
                  "Lưu: VT, KHTC",
                ],
              }),
            },
            {
              prompt: "Tạo quyết định thành lập hội đồng thi đua khen thưởng",
              call: JSON.stringify({
                filename: "quyet-dinh-thanh-lap-hoi-dong.docx",
                documentType: "quyet-dinh",
                issuingAgency: "Công ty TNHH ABC",
                documentNumber: "15",
                symbol: "2024/QĐ-ABC",
                location: "Hồ Chí Minh",
                title:
                  "Về việc thành lập Hội đồng Thi đua - Khen thưởng năm 2024",
                legalBasis: [
                  "Căn cứ Luật Thi đua, khen thưởng ngày 15 tháng 6 năm 2022",
                ],
                content:
                  "**Điều 1.** Thành lập Hội đồng Thi đua - Khen thưởng năm 2024 gồm các thành viên sau:\n\n1. Ông Trần Văn B - Giám đốc - Chủ tịch Hội đồng\n2. Bà Lê Thị C - Phó Giám đốc - Phó Chủ tịch\n3. Ông Phạm Văn D - Trưởng phòng HCNS - Thành viên\n\n**Điều 2.** Hội đồng có nhiệm vụ xem xét, đánh giá và đề xuất khen thưởng.\n\n**Điều 3.** Quyết định này có hiệu lực kể từ ngày ký.",
                signerTitle: "Giám đốc",
                signerName: "Trần Văn B",
                recipients: [
                  "Các thành viên Hội đồng",
                  "Phòng HCNS",
                  "Lưu: VT",
                ],
              }),
            },
            {
              prompt: "Create a Vietnamese government report document",
              call: JSON.stringify({
                filename: "bao-cao-tinh-hinh.docx",
                documentType: "bao-cao",
                issuingAgency: "Phòng Kinh tế",
                parentAgency: "UBND Quận 1",
                location: "Hồ Chí Minh",
                title: "Báo cáo tình hình kinh tế - xã hội 6 tháng đầu năm",
                content:
                  "## I. TÌNH HÌNH CHUNG\n\nTrong 6 tháng đầu năm, kinh tế quận tiếp tục phát triển ổn định.\n\n## II. KẾT QUẢ ĐẠT ĐƯỢC\n\n### 1. Lĩnh vực thương mại - dịch vụ\n\nTổng mức bán lẻ hàng hóa và doanh thu dịch vụ đạt 120% kế hoạch.\n\n### 2. Lĩnh vực đầu tư\n\nThu hút được 50 dự án đầu tư mới.\n\n## III. KIẾN NGHỊ\n\nKính đề nghị UBND Quận xem xét hỗ trợ các giải pháp thúc đẩy phát triển kinh tế.",
                signerTitle: "Trưởng phòng",
                signerName: "Lê Văn E",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              filename: {
                type: "string",
                description:
                  "Tên file .docx. Sẽ tự động thêm đuôi .docx nếu chưa có.",
              },
              documentType: {
                type: "string",
                enum: getDocumentTypeKeys(),
                description:
                  "Loại văn bản hành chính. Ví dụ: cong-van, quyet-dinh, to-trinh, bao-cao, ke-hoach, thong-bao, bien-ban, etc.",
              },
              issuingAgency: {
                type: "string",
                description:
                  "Tên cơ quan/tổ chức ban hành văn bản. Ví dụ: 'Sở Giáo dục và Đào tạo', 'Công ty TNHH ABC'.",
              },
              parentAgency: {
                type: "string",
                description:
                  "Tên cơ quan chủ quản cấp trên (nếu có). Ví dụ: 'Ủy ban nhân dân tỉnh', 'Bộ Giáo dục và Đào tạo'.",
              },
              documentNumber: {
                type: "string",
                description:
                  "Số văn bản. Ví dụ: '123', '05'. Nếu không cung cấp sẽ để trống.",
              },
              symbol: {
                type: "string",
                description:
                  "Ký hiệu văn bản. Ví dụ: '2024/QĐ-SGDDT'. Nếu không cung cấp sẽ tự sinh theo loại văn bản.",
              },
              location: {
                type: "string",
                description:
                  "Địa danh ban hành. Ví dụ: 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'.",
              },
              title: {
                type: "string",
                description:
                  "Trích yếu nội dung văn bản. Ví dụ: 'V/v đề nghị hỗ trợ kinh phí', 'Về việc thành lập Hội đồng'.",
              },
              legalBasis: {
                type: "array",
                items: { type: "string" },
                description:
                  'Danh sách căn cứ pháp lý (nếu biết). Mỗi mục là một dòng căn cứ. Ví dụ: ["Căn cứ Luật Giáo dục ngày 14/6/2019"]. Tool sẽ tự động bổ sung thêm qua tra cứu internet.',
              },
              content: {
                type: "string",
                description:
                  "Nội dung chính của văn bản (hỗ trợ markdown). BẮT BUỘC: Nội dung phải đầy đủ, chi tiết, chuyên nghiệp đúng văn phong hành chính. Tuyệt đối không đưa Tiêu đề chính (như Tên loại văn bản, Trích yếu) vào đầu content vì hệ thống đã tự sinh. Tool sẽ tự động review và tham mưu chỉnh sửa nếu cần.",
              },
              signerTitle: {
                type: "string",
                description: "Chức vụ người ký. Tương thích ngược, nên dùng 'signers' thay thế.",
              },
              signerName: {
                type: "string",
                description: "Họ tên người ký. Tương thích ngược, nên dùng 'signers' thay thế.",
              },
              signers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Chức vụ người ký" },
                    name: { type: "string", description: "Họ tên người ký" }
                  }
                },
                description: "Danh sách người ký. Hỗ trợ 1 hoặc nhiều bên ký. VD: [{title: 'Giám đốc', name: 'Nguyễn Văn A'}]",
              },
              recipients: {
                type: "array",
                items: { type: "string" },
                description:
                  'Danh sách nơi nhận. Ví dụ: ["UBND tỉnh", "Sở Tài chính", "Lưu: VT, KHTC"].',
              },
              skipLegalAdvisory: {
                type: "boolean",
                description:
                  "Bỏ qua bước tham mưu pháp lý (không tra cứu internet). Mặc định: false.",
              },
            },
            required: ["filename", "documentType", "content"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "van-ban.docx",
            documentType = "cong-van",
            issuingAgency = "",
            parentAgency = "",
            documentNumber = "",
            symbol = "",
            location = "",
            title = "",
            legalBasis = [],
            content = "",
            signerTitle = "",
            signerName = "",
            signers = [],
            recipients = [],
            skipLegalAdvisory = false,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the create-vn-admin-docx tool.`
              );

              // Sanitize inputs
              content = createFilesLib.stripInvalidXmlChars(content);
              title = createFilesLib.stripInvalidXmlChars(title);
              issuingAgency = createFilesLib.stripInvalidXmlChars(issuingAgency);
              parentAgency = createFilesLib.stripInvalidXmlChars(parentAgency);
              signerTitle = createFilesLib.stripInvalidXmlChars(signerTitle);
              signerName = createFilesLib.stripInvalidXmlChars(signerName);
              const finalSigners = signers && signers.length > 0 
                ? signers.map(s => ({ 
                    title: createFilesLib.stripInvalidXmlChars(s.title || ""), 
                    name: createFilesLib.stripInvalidXmlChars(s.name || "") 
                  }))
                : (signerTitle || signerName ? [{ title: signerTitle, name: signerName }] : []);

              const hasExtension = /\.docx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.docx`;
              const displayFilename = filename.split("/").pop();

              const docTypeInfo = getDocumentType(documentType);

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    filename: displayFilename,
                    documentType: docTypeInfo.name,
                    title,
                  },
                  description: `Tạo ${docTypeInfo.name}: "${displayFilename}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Đang tạo ${docTypeInfo.name} "${displayFilename}"...`
              );

              // --- Step 1: Legal advisory (unless skipped) ---
              const { cleanContent, extractedBases } = extractLegalBasisFromContent(content);
              let finalLegalBasis = [...new Set([...(legalBasis || []), ...extractedBases])];
              let advisoryNotes = "";
              let finalContent = cleanContent;
              let citations = [];

              if (!skipLegalAdvisory) {
                this.super.introspect(
                  `${this.caller}: 🔍 Đang tra cứu pháp luật và tham mưu nội dung...`
                );

                try {
                  const advisory = await runLegalAdvisorAgent({
                    parentAibitat: this.super,
                    documentType,
                    documentTypeName: docTypeInfo.name,
                    title,
                    content: finalContent,
                    issuingAgency,
                    userLegalBasis: finalLegalBasis,
                  });

                  finalLegalBasis = advisory.legalBasis;
                  advisoryNotes = advisory.advisoryNotes;
                  citations = advisory.citations || [];

                  if (advisory.revisedContent) {
                    finalContent = advisory.revisedContent;
                    this.super.introspect(
                      `${this.caller}: ✏️ Nội dung đã được tham mưu chỉnh sửa.`
                    );
                  }

                  if (finalLegalBasis.length > 0) {
                    this.super.introspect(
                      `${this.caller}: 📋 Đã tìm ${finalLegalBasis.length} căn cứ pháp lý.`
                    );
                  }
                } catch (advisoryError) {
                  this.super.handlerProps.log(
                    `create-vn-admin-docx: Legal advisory error: ${advisoryError.message}`
                  );
                  this.super.introspect(
                    `${this.caller}: ⚠️ Không thể tham mưu pháp lý, tiếp tục tạo văn bản với thông tin hiện có.`
                  );
                }
              }

              // --- Step 2: Build the DOCX ---
              this.super.introspect(
                `${this.caller}: 📄 Đang tạo file văn bản theo thể thức NĐ 30/2020/NĐ-CP...`
              );

              const libs = await loadLibraries();
              const { docx } = libs;
              const { Packer } = docx;

              const doc = await buildVnAdminDocx(
                docx,
                {
                  documentType,
                  issuingAgency,
                  parentAgency,
                  documentNumber,
                  symbol,
                  location,
                  title,
                  legalBasis: finalLegalBasis,
                  content: finalContent,
                  signers: finalSigners,
                  recipients,
                  date: new Date(),
                },
                libs,
                this.super.handlerProps.log
              );

              const buffer = await Packer.toBuffer(doc);
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);

              this.super.handlerProps.log(
                `create-vn-admin-docx: Generated buffer - size: ${bufferSizeKB}KB, type: ${docTypeInfo.name}`
              );

              // --- Step 3: Save and deliver ---
              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "docx",
                extension: "docx",
                buffer,
                displayFilename,
                workspace:
                  this.super.handlerProps?.invocation?.workspace,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(
                this.super,
                "DocxFileDownload",
                {
                  filename: savedFile.displayFilename,
                  storageFilename: savedFile.filename,
                  fileSize: savedFile.fileSize,
                }
              );

              // Register citations from legal research
              if (citations.length > 0) {
                for (const citation of citations) {
                  createFilesLib.registerOutput(
                    this.super,
                    "Citation",
                    citation
                  );
                }
              }

              this.super.introspect(
                `${this.caller}: ✅ Đã tạo thành công ${docTypeInfo.name} "${displayFilename}"`
              );

              // Build response summary
              const parts = [
                `Đã tạo thành công ${docTypeInfo.name} "${displayFilename}" (${bufferSizeKB}KB).`,
                `Thể thức: Nghị định 30/2020/NĐ-CP.`,
              ];

              if (finalLegalBasis.length > 0) {
                parts.push(
                  `Căn cứ pháp lý: ${finalLegalBasis.length} mục.`
                );
              }

              if (advisoryNotes) {
                parts.push(`\n📋 Tham mưu pháp lý:\n${advisoryNotes}`);
              }

              if (citations.length > 0) {
                parts.push(
                  `\n🔗 Nguồn tham khảo: ${citations.length} nguồn từ internet.`
                );
              }

              return parts.join("\n");
            } catch (e) {
              this.super.handlerProps.log(
                `create-vn-admin-docx error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Lỗi khi tạo văn bản hành chính: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
