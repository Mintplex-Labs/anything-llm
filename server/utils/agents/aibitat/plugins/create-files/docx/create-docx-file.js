const {
  getDeploymentVersion,
} = require("../../../../../../endpoints/utils.js");
const createFilesLib = require("../lib.js");
const {
  getTheme,
  getMargins,
  loadLibraries,
  htmlToDocxElements,
  createCoverPageSection,
  createRunningHeader,
  createRunningFooter,
  DEFAULT_NUMBERING_CONFIG,
} = require("./utils.js");

module.exports.CreateDocxFile = {
  name: "create-docx-file",
  plugin: function () {
    return {
      name: "create-docx-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a Microsoft Word document (.docx) from markdown or plain text content. Supports professional styling with color themes, title pages, and running headers/footers. " +
            "If you need to include visual charts/graphs (e.g. sales, budgets, progress), you MUST generate a QuickChart image URL using Chart.js format (e.g. https://quickchart.io/chart?c={...}&w=500&h=300) and insert it as a standard markdown image: ![Chart Title](https://quickchart.io/chart?c={...}). It will be automatically fetched and embedded. " +
            "Use this tool for 'tài liệu' (reports, notes, proposals, guides, technical documents). " +
            "DO NOT use this tool for Vietnamese administrative documents (văn bản hành chính, nghị định 30 của bộ nội vụ). For those, you MUST use the 'create-vn-admin-docx' tool instead. " +
            "ĐẶC BIỆT: nếu yêu cầu của user chứa cụm 'soạn thảo văn bản' hoặc 'soan thao van ban' (không dấu), TUYỆT ĐỐI KHÔNG dùng tool này — phải dùng 'create-vn-admin-docx'.",
          examples: [
            {
              prompt: "Create a Word document with meeting notes and a chart",
              call: JSON.stringify({
                filename: "meeting-notes.docx",
                content:
                  "# Meeting Notes - Q1 Planning\n\n## Sales Performance\nHere is the sales performance of Q1:\n\n![Sales Chart](https://quickchart.io/chart?c={type:'bar',data:{labels:['Jan','Feb','Mar'],datasets:[{label:'Sales',data:[120,150,180]}]}}&w=500&h=300)\n\n## Action Items\n- Mike: Follow up on leads",
              }),
            },
            {
              prompt:
                "Create a professional project proposal with a title page",
              call: JSON.stringify({
                filename: "project-proposal.docx",
                title: "Project Alpha Proposal",
                subtitle: "Strategic Initiative for Q2 2024",
                author: "Product Team",
                theme: "blue",
                includeTitlePage: true,
                content:
                  "## Executive Summary\nThis proposal outlines the development of **Project Alpha**.\n\n## Projected Growth\n![Growth](https://quickchart.io/chart?c={type:'line',data:{labels:['Y1','Y2','Y3'],datasets:[{label:'Growth',data:[50,120,280]}]}}&w=500&h=300)\n\nTotal estimated budget: **$150,000**",
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
                  "The filename for the Word document. Will automatically add .docx extension if not present.",
              },
              title: {
                type: "string",
                description:
                  "Document title for metadata and title page. If not provided, will be extracted from content or use filename.",
              },
              subtitle: {
                type: "string",
                description:
                  "Optional subtitle displayed on the title page below the main title.",
              },
              author: {
                type: "string",
                description:
                  "Optional author name displayed on the title page.",
              },
              content: {
                type: "string",
                description:
                  "The content to convert to a Word document. Fully supports markdown formatting. " +
                  "To include charts, use markdown image tags with QuickChart URLs, e.g., ![Revenue Chart](https://quickchart.io/chart?c={type:'bar',data:{labels:['Q1','Q2'],datasets:[{label:'Revenue',data:[100,150]}]}}&w=500&h=300)",
              },
              theme: {
                type: "string",
                enum: ["neutral", "blue", "warm"],
                description:
                  "Color theme for the document. 'neutral' (slate/grey), 'blue' (corporate blue), or 'warm' (earthy tones). Defaults to neutral.",
              },
              margins: {
                type: "string",
                enum: ["normal", "narrow", "wide"],
                description:
                  "Page margin preset. 'normal' (standard), 'narrow' (data-heavy docs), or 'wide' (letters/memos). Defaults to normal.",
              },
              includeTitlePage: {
                type: "boolean",
                description:
                  "Include a professional title page with centered title, subtitle, author, and date. Content starts on page 2 with running headers/footers.",
              },
            },
            required: ["filename", "content"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "document.docx",
            title = null,
            subtitle = null,
            author = null,
            content = "",
            theme = "neutral",
            margins = "normal",
            includeTitlePage = false,
          }) {
            try {
              this.super.handlerProps.log(`Using the create-docx-file tool.`);

              // Guard against the agent looping on file creation: if a Word file
              // was already produced in this same turn, return it instead of
              // generating another near-identical duplicate.
              const alreadyCreated = createFilesLib.findPendingOutput(
                this.super,
                "DocxFileDownload"
              );
              if (alreadyCreated) {
                this.super.handlerProps.log(
                  `create-docx-file: A Word file was already created this turn (${alreadyCreated.storageFilename}); skipping duplicate generation.`
                );
                // KẾT THÚC lượt ngay để tránh model gọi lại tool lặp vô hạn với
                // payload lớn (làm treo provider stream → lượt không bao giờ được
                // lưu → không xem trước/tải xuống được).
                this.super.skipHandleExecution = true;
                return `✅ Văn bản Word **"${alreadyCreated.filename}"** đã được tạo xong ở bước trước trong lượt này (chỉ tạo DUY NHẤT 1 file). Bạn có thể bấm **Xem trước** hoặc **Tải xuống** ngay trên thẻ file phía trên. Nếu cần chỉnh sửa, hãy nêu rõ thay đổi để tôi tạo lại trong một lượt mới.`;
              }

              // Strip XML 1.0 illegal control characters (e.g. the form feed a
              // LaTeX `\frac` decodes to) so Word can open the generated file.
              content = createFilesLib.stripInvalidXmlChars(content);
              title = createFilesLib.stripInvalidXmlChars(title);
              subtitle = createFilesLib.stripInvalidXmlChars(subtitle);
              author = createFilesLib.stripInvalidXmlChars(author);

              const hasExtension = /\.docx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.docx`;
              const displayFilename = filename.split("/").pop();

              const documentTitle =
                title ||
                content.match(/^#\s+(.+)$/m)?.[1] ||
                displayFilename.replace(/\.docx$/i, "");

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { filename: displayFilename, title: documentTitle },
                  description: `Create Word document "${displayFilename}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating Word document "${displayFilename}"${includeTitlePage ? " with title page" : ""}`
              );

              const libs = await loadLibraries();
              const { marked, docx } = libs;
              const { Document, Packer, Paragraph, TextRun } = docx;
              marked.setOptions({
                gfm: true,
                breaks: true,
              });

              const themeColors = getTheme(theme);
              const marginConfig = getMargins(margins);

              const html = marked.parse(content);
              this.super.handlerProps.log(
                `create-docx-file: Parsed markdown to HTML (${html.length} chars), theme: ${theme}, margins: ${margins}`
              );

              let logoBuffer = null;
              let logoType = "png";
              try {
                const fs = require("fs");
                const path = require("path");
                const logoPath = path.join(__dirname, "../assets/gov-ai-vn168-logo.png");
                if (fs.existsSync(logoPath)) {
                  logoBuffer = fs.readFileSync(logoPath);
                }
              } catch (err) {
                this.super.handlerProps.log(`Failed to read local Gov AI logo: ${err.message}`);
              }

              // Fallback to online fetch if buffer is empty
              if (!logoBuffer) {
                try {
                  const response = await fetch("https://ai.aiha.vn/logo.png");
                  if (response.ok) {
                    const ab = await response.arrayBuffer();
                    logoBuffer = Buffer.from(ab);
                  }
                } catch (fetchError) {
                  this.super.handlerProps.log(`Failed to fetch online Gov AI logo: ${fetchError.message}`);
                }
              }

              // Ultimate fallback to default system logo
              if (!logoBuffer) {
                await createFilesLib.initializeLogo();
                logoBuffer = createFilesLib.getLogo({
                  forDarkBackground: false,
                  format: "buffer",
                });
                logoType = createFilesLib.getLogoType();
              }

              const docElements = await htmlToDocxElements(
                html,
                libs,
                this.super.handlerProps.log,
                themeColors
              );

              if (docElements.length === 0) {
                docElements.push(
                  new Paragraph({
                    children: [new TextRun({ text: content })],
                  })
                );
              }

              const sections = [];

              if (includeTitlePage) {
                const currentDate = new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                sections.push(
                  createCoverPageSection(docx, {
                    title: documentTitle,
                    subtitle,
                    author,
                    date: currentDate,
                    theme: themeColors,
                    margins: marginConfig,
                    logoBuffer,
                    logoType,
                  })
                );

                sections.push({
                  properties: {
                    page: {
                      margin: marginConfig,
                    },
                  },
                  children: docElements,
                  headers: {
                    default: createRunningHeader(
                      docx,
                      documentTitle,
                      themeColors
                    ),
                  },
                  footers: {
                    default: createRunningFooter(docx, logoBuffer, themeColors, logoType),
                  },
                });
              } else {
                sections.push({
                  properties: {
                    page: {
                      margin: marginConfig,
                    },
                  },
                  children: docElements,
                  footers: {
                    default: createRunningFooter(docx, logoBuffer, themeColors, logoType),
                  },
                });
              }

              const doc = new Document({
                title: documentTitle,
                creator: `AnythingLLM ${getDeploymentVersion()}`,
                description: `Word Document generated by AnythingLLM ${getDeploymentVersion()}`,
                numbering: DEFAULT_NUMBERING_CONFIG,
                sections,
              });

              const buffer = await Packer.toBuffer(doc);
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);

              this.super.handlerProps.log(
                `create-docx-file: Generated buffer - size: ${bufferSizeKB}KB, title: "${documentTitle}", theme: ${theme}`
              );

              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "docx",
                extension: "docx",
                buffer,
                displayFilename,
                workspace: this.super.handlerProps?.invocation?.workspace,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(this.super, "DocxFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created Word document "${displayFilename}"`
              );

              const styleInfo = [
                theme !== "neutral" ? `${theme} theme` : null,
                margins !== "normal" ? `${margins} margins` : null,
                includeTitlePage ? "title page" : null,
              ].filter(Boolean);

              const styleDesc =
                styleInfo.length > 0 ? ` with ${styleInfo.join(", ")}` : "";

              return `Successfully created Word document "${displayFilename}" (${bufferSizeKB}KB)${styleDesc}. The document includes formatted content with tables, images, Page X of Y footer, and professional styling.`;
            } catch (e) {
              this.super.handlerProps.log(
                `create-docx-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Word document: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
