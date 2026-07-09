const createFilesLib = require("../lib.js");
const {
  parseCSV,
  validateCSVData,
  detectDelimiter,
  inferCellType,
  autoFitColumns,
  applyHeaderStyle,
  applyZebraStriping,
  freezePanes,
  applyPremiumFormatting,
  applyTitleRow,
  applyGovernmentHeader,
  applySignatureBlock,
  applySmartNumberFormatting,
  applyPrintSetup,
  validateFormulaSheetRefs,
  adjustFormulaRows,
  mergeNativeCharts,
  CHART_ROW_PITCH,
} = require("./utils.js");
const { dedupeDataRows, dedupeSheets, sheetHasFormula } = require("./dedupe.js");
const XlsxChart = require("xlsx-chart");

// Color palettes (ARGB) applied across header, zebra rows, title accent and total row
const THEMES = {
  dark: {
    headerFill: "FF0F172A",
    headerFont: "FFFFFFFF",
    zebra: "FFF8FAFC",
    accent: "FF0EA5E9",
    totalFill: "FFF0F9FF",
    totalBorder: "FF0284C7",
  },
  // Default theme: chuẩn báo cáo hành chính (xanh đậm #1F4E78, trang nhã)
  blue: {
    headerFill: "FF1F4E78",
    headerFont: "FFFFFFFF",
    zebra: "FFEDF3FA",
    accent: "FF2E75B6",
    totalFill: "FFD9E5F1",
    totalBorder: "FF1F4E78",
  },
  green: {
    headerFill: "FF166534",
    headerFont: "FFFFFFFF",
    zebra: "FFF0FDF4",
    accent: "FF22C55E",
    totalFill: "FFDCFCE7",
    totalBorder: "FF15803D",
  },
  red: {
    headerFill: "FF991B1B",
    headerFont: "FFFFFFFF",
    zebra: "FFFEF2F2",
    accent: "FFEF4444",
    totalFill: "FFFEE2E2",
    totalBorder: "FFB91C1C",
  },
};

// Normalizes an agent-supplied colour ("#1F4E78", "1f4e78", "FF1F4E78", "#abc")
// to 8-digit ARGB. Returns null when the value is not a valid hex colour.
function toArgb(color) {
  if (typeof color !== "string") return null;
  const hex = color.trim().replace(/^#/, "").toUpperCase();
  if (/^[0-9A-F]{8}$/.test(hex)) return hex;
  if (/^[0-9A-F]{6}$/.test(hex)) return `FF${hex}`;
  if (/^[0-9A-F]{3}$/.test(hex))
    return `FF${hex.split("").map((c) => c + c).join("")}`;
  return null;
}

// Picks legible body text (near-black or white) for a given ARGB header fill
// so a custom header colour never leaves the title text unreadable.
function contrastFont(argb) {
  const hex = argb.slice(-6);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "FF1E293B" : "FFFFFFFF";
}

// Maps the tool's chart types to xlsx-chart template names.
// xlsx-chart's "column" is vertical bars (biểu đồ cột), its "bar" is horizontal.
// Multi-chart mode of xlsx-chart is never used - mixing chart types there
// crashes the process - each chart is generated standalone and merged manually.
const XLSX_CHART_TYPE = {
  bar: "column",
  column: "column",
  horizontalbar: "bar",
  line: "line",
  pie: "pie",
  doughnut: "pie",
  radar: "radar",
  area: "area",
  scatter: "scatter",
};

const chartSchemaItem = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Title of the chart. Do not leave blank.",
    },
    type: {
      type: "string",
      enum: [
        "bar",
        "column",
        "horizontalBar",
        "line",
        "pie",
        "doughnut",
        "radar",
        "area",
        "scatter",
      ],
      description:
        "The chart visualization style. 'bar'/'column' = biểu đồ cột đứng, 'horizontalBar' = biểu đồ thanh ngang, 'line' = đường, 'pie'/'doughnut' = tròn, 'area' = vùng, 'radar' = radar.",
    },
    labels: {
      type: "array",
      items: { type: "string" },
      description:
        "The category labels for the X-axis (e.g. ['Q1', 'Q2', 'Q3', 'Q4'] or ['Hà Nội', 'HCM']).",
    },
    sheet: {
      type: "string",
      description:
        "Tên sheet dữ liệu để ĐẶT biểu đồ ngay bên dưới bảng của sheet đó (ví dụ 'Thống kê', 'Tổng hợp'). Bỏ trống thì biểu đồ nằm trên một sheet riêng.",
    },
    datasets: {
      type: "array",
      description: "One or more datasets/series of values to plot.",
      items: {
        type: "object",
        properties: {
          label: {
            type: "string",
            description:
              "The name of this metric series (e.g. 'Doanh thu', 'Chi phí').",
          },
          data: {
            type: "array",
            items: { type: "number" },
            description: "The numeric data points corresponding to labels.",
          },
        },
        required: ["label", "data"],
      },
    },
  },
  required: ["title", "type", "labels", "datasets"],
};

/**
 * Nhiều mô hình yếu (ví dụ qwen flash) serialize tham số mảng/đối tượng thành
 * một CHUỖI JSON thay vì gửi JSON thật, ví dụ sheets = "[{...}]" hoặc
 * charts = "[{...}]". Nếu không khôi phục, cả khối JSON bị nhét vào 1 sheet làm
 * dòng tiêu đề khổng lồ, KHÔNG có dữ liệu. Hàm này: nếu value là chuỗi trông
 * giống JSON (bắt đầu bằng '[' hoặc '{') thì parse; ngược lại trả nguyên bản
 * (để chuỗi CSV thật vẫn được xử lý như csvData).
 * @param {*} value
 * @returns {*}
 */
function coerceJsonMaybe(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed || (trimmed[0] !== "[" && trimmed[0] !== "{")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

/**
 * Ensures every entry in a list of names is unique by suffixing " (n)".
 * @param {string[]} names
 * @returns {string[]}
 */
function dedupeNames(names) {
  const seen = new Map();
  return names.map((name) => {
    const key = name.toLowerCase();
    const count = seen.get(key) || 0;
    seen.set(key, count + 1);
    return count === 0 ? name : `${name} (${count + 1})`;
  });
}

/**
 * Validates and normalizes a chart definition coming from the LLM.
 * @param {object} chart
 * @returns {{title: string, type: string, labels: string[], datasets: {label: string, data: number[]}[]}|null}
 */
function normalizeChartDef(chart) {
  if (typeof chart === "string") chart = coerceJsonMaybe(chart);
  if (!chart || typeof chart !== "object") return null;
  // labels/datasets đôi khi bị model gửi dưới dạng chuỗi JSON — khôi phục trước.
  chart.labels = coerceJsonMaybe(chart.labels);
  chart.datasets = coerceJsonMaybe(chart.datasets);
  if (!Array.isArray(chart.labels) || chart.labels.length === 0) return null;
  if (!Array.isArray(chart.datasets) || chart.datasets.length === 0)
    return null;

  const labels = dedupeNames(
    chart.labels.map((l, i) => String(l ?? `Mục ${i + 1}`).trim() || `Mục ${i + 1}`)
  );
  const datasets = chart.datasets
    .map((ds) =>
      ds && typeof ds === "object"
        ? { ...ds, data: coerceJsonMaybe(ds.data) }
        : ds
    )
    .filter((ds) => ds && Array.isArray(ds.data))
    .map((ds, i) => ({
      label: String(ds.label ?? `Chuỗi ${i + 1}`).trim() || `Chuỗi ${i + 1}`,
      data: labels.map((_, j) => {
        const num = Number(ds.data[j]);
        return Number.isFinite(num) ? num : 0;
      }),
    }));
  if (datasets.length === 0) return null;

  const dedupedDsNames = dedupeNames(datasets.map((d) => d.label));
  datasets.forEach((ds, i) => (ds.label = dedupedDsNames[i]));

  return {
    title: String(chart.title || "Biểu đồ").trim() || "Biểu đồ",
    type: String(chart.type || "column").toLowerCase(),
    labels,
    datasets,
    // Requested placement: a data sheet name, or the sheet the chart was
    // nested inside (charts defined per-sheet default onto their own sheet)
    sheet:
      typeof chart.sheet === "string" && chart.sheet.trim()
        ? chart.sheet.trim()
        : null,
    ownerIdx: Number.isInteger(chart.__ownerIdx) ? chart.__ownerIdx : null,
  };
}

/**
 * Generates a single native chart workbook with xlsx-chart (single-chart mode only).
 * @param {ReturnType<typeof normalizeChartDef>} chart
 * @returns {Promise<Buffer>}
 */
function generateNativeChartBuffer(chart) {
  return new Promise((resolve, reject) => {
    try {
      const opts = {
        chart: XLSX_CHART_TYPE[chart.type] || "column",
        titles: chart.datasets.map((d) => d.label),
        fields: chart.labels,
        data: {},
        chartTitle: chart.title,
      };
      chart.datasets.forEach((ds) => {
        opts.data[ds.label] = {};
        chart.labels.forEach((label, idx) => {
          opts.data[ds.label][label] = ds.data[idx];
        });
      });
      new XlsxChart().generate(opts, (err, data) => {
        if (err) return reject(err instanceof Error ? err : new Error(String(err)));
        resolve(Buffer.from(data, "base64"));
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports.CreateExcelFile = {
  name: "create-excel-file",
  plugin: function () {
    return {
      name: "create-excel-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "QUAN TRỌNG: Gom TẤT CẢ dữ liệu cần đưa vào Excel vào MỘT lần gọi tool duy nhất — nhiều bảng/nhiều nội dung thì dùng tham số 'sheets' (mỗi bảng một sheet). TUYỆT ĐỐI KHÔNG gọi tool này nhiều lần cho cùng một yêu cầu, và không lặp lại cùng nội dung ở nhiều sheet. " +
            "KHI NGƯỜI DÙNG TẢI LÊN NHIỀU FILE và yêu cầu xuất Excel: chỉ tạo DUY NHẤT 1 file .xlsx gộp toàn bộ nội dung — MỖI file/tài liệu nguồn là 1 sheet riêng (đặt tên sheet theo tên tài liệu nguồn); nếu cần so sánh giữa các file thì thêm 1 sheet 'Tổng hợp' dùng công thức liên kết. TUYỆT ĐỐI KHÔNG xếp nhiều bảng chồng lên nhau trong CÙNG một sheet, KHÔNG tạo file thứ hai, KHÔNG lặp lại cùng một bảng ở nhiều sheet. " +
            "Create a professional multi-sheet Excel report (.xlsx) from CSV data with REAL Excel formulas and REAL native, editable charts. " +
            "ALL styling is AUTOMATIC: header row đậm chữ căn giữa (màu nền tự chọn hợp tài liệu qua 'headerColor', chữ tự đổi trắng/đen cho dễ đọc), kẻ border đầy đủ mọi ô, zebra striping, freeze dòng tiêu đề, " +
            "auto-fit độ rộng cột, số căn phải với dấu phân cách nghìn, phát hiện dòng Tổng, font Times New Roman 11 thống nhất, khổ in A4 fit ngang. " +
            "CÔNG THỨC EXCEL THẬT: ghi trực tiếp vào ô CSV, bắt đầu bằng '=' (SUM, AVERAGE, COUNTIF, COUNTIFS, SUMIF, IF...). " +
            "Hỗ trợ tham chiếu liên sheet: ='Tên Sheet'!B2. LUÔN viết địa chỉ ô theo đúng lưới CSV (dòng tiêu đề cột = dòng 1, dòng dữ liệu đầu = dòng 2) — " +
            "tool TỰ ĐỘNG dịch chuyển địa chỉ khi chèn Quốc hiệu/tiêu đề. " +
            "Ô công thức CHỨA DẤU PHẨY phải bọc trong ngoặc kép CSV và nhân đôi ngoặc kép bên trong, ví dụ: \"=COUNTIF(C2:C10,\"\"Giỏi\"\")\". " +
            "BÁO CÁO NHIỀU SHEET: dùng 'sheets'. Cấu trúc khuyến nghị: sheet 'Tổng quan' (thông tin văn bản: số hiệu, ngày, cơ quan, mục đích) → các sheet chi tiết → " +
            "sheet 'Thống kê'/'Tổng hợp' CUỐI CÙNG dùng công thức tham chiếu các sheet trước, KHÔNG gõ lại số liệu đã có. " +
            "BIỂU ĐỒ (BẮT BUỘC khi dữ liệu có số liệu so sánh/cơ cấu/xu hướng): khai báo trong 'charts'. " +
            "Đặt thuộc tính sheet='<tên sheet dữ liệu>' để biểu đồ nằm NGAY DƯỚI bảng của sheet đó — khuyến nghị cho sheet Thống kê/Tổng hợp: ít nhất 1 biểu đồ 'column' so sánh + 1 'pie' cơ cấu (pie tự hiện nhãn %); thêm 'line' nếu có yếu tố thời gian. " +
            "Bỏ trống 'sheet' thì biểu đồ nằm trên sheet riêng. Labels/datasets phải khớp chính xác số liệu trong bảng. " +
            "TEMPLATE HÀNH CHÍNH: template='government' tạo mẫu văn bản hành chính Việt Nam chuẩn Nghị định 30/2020/NĐ-CP " +
            "(Quốc hiệu/Tiêu ngữ, tên cơ quan, ngày tháng, khối chữ ký) — phù hợp cho cán bộ, giáo viên, cơ quan nhà nước. " +
            "CSV data quality: dòng 1 là tiêu đề cột rõ nghĩa; đủ MỌI cột từ dữ liệu gốc; thêm cột 'STT' khi liệt kê; " +
            "số liệu tiền tệ ghi số thuần; dòng tổng bắt đầu bằng 'Tổng' để được tự động làm nổi bật.",
          examples: [
            {
              prompt:
                "Tạo file Excel báo cáo doanh số 4 quý năm 2025 của 3 chi nhánh, vẽ biểu đồ cột so sánh doanh số và biểu đồ tròn cơ cấu doanh số cả năm",
              call: JSON.stringify({
                filename: "doanh-so-2025.xlsx",
                title: "BÁO CÁO DOANH SỐ CÁC CHI NHÁNH NĂM 2025",
                csvData:
                  "Chi nhánh,Quý 1,Quý 2,Quý 3,Quý 4,Tổng cộng\n" +
                  "Chi nhánh Hà Nội,450000000,520000000,480000000,610000000,=SUM(B2:E2)\n" +
                  "Chi nhánh TP.HCM,600000000,580000000,650000000,720000000,=SUM(B3:E3)\n" +
                  "Chi nhánh Đà Nẵng,250000000,280000000,310000000,340000000,=SUM(B4:E4)\n" +
                  "Tổng cộng,=SUM(B2:B4),=SUM(C2:C4),=SUM(D2:D4),=SUM(E2:E4),=SUM(F2:F4)",
                charts: [
                  {
                    title: "So sánh Doanh số Quý giữa các Chi nhánh",
                    type: "column",
                    sheet: "Dữ liệu",
                    labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
                    datasets: [
                      {
                        label: "Hà Nội",
                        data: [450000000, 520000000, 480000000, 610000000],
                      },
                      {
                        label: "TP.HCM",
                        data: [600000000, 580000000, 650000000, 720000000],
                      },
                      {
                        label: "Đà Nẵng",
                        data: [250000000, 280000000, 310000000, 340000000],
                      },
                    ],
                  },
                  {
                    title: "Cơ cấu Doanh số cả năm theo Chi nhánh",
                    type: "pie",
                    sheet: "Dữ liệu",
                    labels: ["Hà Nội", "TP.HCM", "Đà Nẵng"],
                    datasets: [
                      {
                        label: "Doanh số 2025",
                        data: [2060000000, 2550000000, 1180000000],
                      },
                    ],
                  },
                ],
              }),
            },
            {
              prompt:
                "Lập danh sách học sinh giỏi học kỳ 1 của trường theo mẫu văn bản hành chính, có chữ ký giáo viên chủ nhiệm",
              call: JSON.stringify({
                filename: "danh-sach-hoc-sinh-gioi.xlsx",
                title: "DANH SÁCH HỌC SINH GIỎI HỌC KỲ I NĂM HỌC 2025-2026",
                template: "government",
                parentOrganization: "PHÒNG GD&ĐT QUẬN BA ĐÌNH",
                organization: "TRƯỜNG THCS NGUYỄN TRÃI",
                place: "Hà Nội",
                signerTitle: "GIÁO VIÊN CHỦ NHIỆM",
                csvData:
                  "STT,Họ và tên,Lớp,Điểm TB,Xếp loại\n" +
                  "1,Nguyễn Văn An,9A1,9.2,Giỏi\n" +
                  "2,Trần Thị Bình,9A2,8.9,Giỏi\n" +
                  "3,Lê Minh Châu,9A1,8.7,Giỏi",
              }),
            },
            {
              prompt:
                "Tạo báo cáo Excel nhiều sheet từ kế hoạch phân công: danh sách phân công và sheet tổng hợp dùng công thức liên kết, có biểu đồ trên sheet tổng hợp",
              call: JSON.stringify({
                filename: "bao-cao-phan-cong.xlsx",
                sheets: [
                  {
                    name: "Phân công",
                    title: "BẢNG PHÂN CÔNG NHIỆM VỤ",
                    csvData:
                      "STT,Họ và tên,Chức vụ,Số việc\n" +
                      "1,Nguyễn Văn A,Trưởng ban,5\n" +
                      "2,Trần Thị B,Ủy viên,3\n" +
                      "3,Lê Văn C,Ủy viên,4",
                  },
                  {
                    name: "Tổng hợp",
                    title: "TỔNG HỢP",
                    csvData:
                      "Chỉ tiêu,Giá trị\n" +
                      "Tổng số việc,=SUM('Phân công'!D2:D4)\n" +
                      "Số Ủy viên,\"=COUNTIF('Phân công'!C2:C4,\"\"Ủy viên\"\")\"",
                    charts: [
                      {
                        title: "Số việc theo cán bộ",
                        type: "column",
                        sheet: "Tổng hợp",
                        labels: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
                        datasets: [{ label: "Số việc", data: [5, 3, 4] }],
                      },
                    ],
                  },
                ],
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
                  "The filename for the Excel file. The .xlsx extension will be added automatically if not provided.",
              },
              title: {
                type: "string",
                description:
                  "Optional title displayed as a large merged header row at the top of the sheet. " +
                  "Use for report titles like 'DANH SÁCH VĂN BẢN NĂM 2026'.",
              },
              csvData: {
                type: "string",
                description:
                  "CSV data for a single-sheet workbook. MUST include a header row as the first line. " +
                  "Supports REAL Excel formulas: start a cell with '=' (e.g. '=B2-C2', '=SUM(B2:B10)', \"='Sheet khác'!B2\"). " +
                  "Viết địa chỉ ô theo lưới CSV (dòng tiêu đề = dòng 1) — tool tự dịch địa chỉ khi chèn tiêu đề/Quốc hiệu. " +
                  "Công thức chứa dấu phẩy phải bọc trong ngoặc kép CSV: \"=COUNTIF(C2:C10,\"\"Giỏi\"\")\".",
              },
              charts: {
                type: "array",
                description:
                  "CRITICAL BẮT BUỘC: Nếu dữ liệu mang tính chất thống kê, báo cáo doanh thu, số lượng, hoặc so sánh, bạn PHẢI MẶC ĐỊNH cung cấp mảng 'charts' này để vẽ biểu đồ Native Excel. " +
                  "Có thể cung cấp NHIỀU biểu đồ với các loại khác nhau (column, pie, line, area, radar...). " +
                  "Đặt 'sheet' = tên sheet dữ liệu để biểu đồ nằm ngay dưới bảng của sheet đó (khuyến nghị: 1 'column' + 1 'pie' cho sheet Thống kê/Tổng hợp); bỏ trống thì biểu đồ nằm sheet riêng. " +
                  "Tuyệt đối không được bỏ qua nếu người dùng yêu cầu vẽ biểu đồ.",
                items: chartSchemaItem,
              },
              sheets: {
                type: "array",
                description:
                  "Array of sheet definitions for multi-sheet workbooks. Each sheet can also contain formulas (cells starting with '='), including cross-sheet references like ='Tên Sheet'!B2. " +
                  "Cấu trúc khuyến nghị cho báo cáo: 'Tổng quan' đầu tiên → các sheet chi tiết → 'Tổng hợp' cuối cùng dùng công thức tham chiếu các sheet trước.",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "The name of the worksheet (max 31 characters).",
                    },
                    csvData: {
                      type: "string",
                      description:
                        "The CSV data for this sheet (can include formulas starting with '=').",
                    },
                    title: {
                      type: "string",
                      description: "Optional title row for this sheet.",
                    },
                    charts: {
                      type: "array",
                      description:
                        "Biểu đồ của riêng sheet này — mặc định được neo ngay dưới bảng của chính sheet.",
                      items: chartSchemaItem,
                    },
                  },
                  required: ["name", "csvData"],
                },
              },
              template: {
                type: "string",
                enum: ["default", "government"],
                description:
                  "Document template. 'government' tạo mẫu văn bản hành chính Việt Nam: Quốc hiệu 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', Tiêu ngữ, tên cơ quan, dòng ngày tháng và khối chữ ký cuối bảng. Dùng cho báo cáo, danh sách, tờ trình của cơ quan nhà nước, trường học.",
              },
              parentOrganization: {
                type: "string",
                description:
                  "Tên cơ quan chủ quản cấp trên (dòng 1 góc trái, ví dụ 'UBND THÀNH PHỐ HÀ NỘI' hoặc 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'). Chỉ dùng với template='government'.",
              },
              organization: {
                type: "string",
                description:
                  "Tên cơ quan/đơn vị ban hành (dòng 2 góc trái, in đậm, ví dụ 'TRƯỜNG THPT CHU VĂN AN'). Chỉ dùng với template='government'.",
              },
              place: {
                type: "string",
                description:
                  "Địa danh cho dòng ngày tháng (ví dụ 'Hà Nội' → 'Hà Nội, ngày … tháng … năm …'). Chỉ dùng với template='government'.",
              },
              signerTitle: {
                type: "string",
                description:
                  "Chức danh người ký ở khối chữ ký cuối bảng (ví dụ 'NGƯỜI LẬP BIỂU', 'HIỆU TRƯỞNG', 'TRƯỞNG PHÒNG'). Chỉ dùng với template='government'.",
              },
              theme: {
                type: "string",
                enum: ["blue", "dark", "green", "red"],
                description:
                  "Color theme for the table styling (header fill, stripes, accents). Default 'blue' (xanh đậm, trang nhã, chuẩn báo cáo nhà nước). 'dark' hiện đại, 'green' tươi sáng, 'red' nổi bật.",
              },
              headerColor: {
                type: "string",
                description:
                  "TÙY CHỌN — mã màu hex cho nền hàng tiêu đề để hợp với NỘI DUNG tài liệu (chữ tự đổi trắng/đen cho dễ đọc). Hãy TỰ CHỌN tông phù hợp chủ đề: hành chính/tổng hợp → xanh navy '#1F4E78' hoặc xanh công sở '#305496'; tài chính/ngân sách → xanh đậm '#1F3864'; giáo dục/đào tạo → xanh dương '#2E75B6'; môi trường/nông nghiệp/y tế dự phòng → xanh lá '#2E7D32'; cảnh báo/khẩn/vi phạm → đỏ đô '#9C1C1C'; sang trọng/trung tính → xanh xám '#44546A'. Bỏ trống thì dùng màu theo 'theme'. Có thể đặt theo màu thương hiệu cơ quan.",
              },
              fontFamily: {
                type: "string",
                enum: ["Times New Roman", "Arial"],
                description:
                  "Font chữ thống nhất cho toàn bảng (nội dung cỡ 11, tiêu đề cột cỡ 12). Mặc định 'Times New Roman' (chuẩn văn bản hành chính).",
              },
            },
            required: ["filename"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "spreadsheet.xlsx",
            title = null,
            csvData = null,
            charts = null,
            sheets = null,
            template = "default",
            parentOrganization = null,
            organization = null,
            place = null,
            signerTitle = null,
            theme = "blue",
            headerColor = null,
            fontFamily = "Times New Roman",
          }) {
            try {
              this.super.handlerProps.log(`Using the create-excel-file tool.`);

              // Guard against the agent looping on file creation: if an Excel file was
              // already produced in this same turn, return it instead of generating another
              // near-identical duplicate (mirrors create-docx-file).
              const alreadyCreated = createFilesLib.findPendingOutput(
                this.super,
                "ExcelFileDownload"
              );
              if (alreadyCreated) {
                this.super.handlerProps.log(
                  `create-excel-file: An Excel file was already created this turn (${alreadyCreated.storageFilename}); skipping duplicate generation.`
                );
                // KẾT THÚC lượt ngay để tránh model gọi lại tool lặp vô hạn với
                // payload lớn (làm treo provider stream → lượt không bao giờ được
                // lưu → không xem trước/tải xuống được). Trả kết quả trực tiếp
                // làm câu trả lời cuối cùng, không chạy thêm tool nào nữa.
                this.super.skipHandleExecution = true;
                return `✅ File Excel **"${alreadyCreated.filename}"** đã được tạo xong ở bước trước trong lượt này (chỉ tạo DUY NHẤT 1 file). Bạn có thể bấm **Xem trước** hoặc **Tải xuống** ngay trên thẻ file phía trên. Nếu cần bổ sung dữ liệu/sheet hoặc chỉnh sửa, hãy nêu rõ thay đổi để tôi tạo lại trong một lượt mới.`;
              }

              // Strip XML 1.0 illegal control characters from inputs
              csvData = createFilesLib.stripInvalidXmlChars(csvData);
              sheets = createFilesLib.stripInvalidXmlChars(sheets);
              title = createFilesLib.stripInvalidXmlChars(title);
              charts = createFilesLib.stripInvalidXmlChars(charts);
              parentOrganization = createFilesLib.stripInvalidXmlChars(parentOrganization);
              organization = createFilesLib.stripInvalidXmlChars(organization);
              place = createFilesLib.stripInvalidXmlChars(place);
              signerTitle = createFilesLib.stripInvalidXmlChars(signerTitle);

              const hasExtension = /\.xlsx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.xlsx`;

              // Khôi phục tham số bị model serialize nhầm thành CHUỖI JSON
              // (sheets/charts = "[{...}]"). Nếu không, cả khối JSON bị nhét vào
              // 1 sheet làm dòng tiêu đề khổng lồ và MẤT TOÀN BỘ dữ liệu.
              sheets = coerceJsonMaybe(sheets);
              charts = coerceJsonMaybe(charts);

              // Chỉ khi sheets thực sự là chuỗi CSV (không phải JSON) mới coi là
              // dữ liệu cho một sheet đơn.
              if (sheets && typeof sheets === "string") {
                if (!csvData) csvData = sheets;
                sheets = null;
              }

              if (
                !csvData &&
                (!sheets || !Array.isArray(sheets) || sheets.length === 0)
              ) {
                return "Error: You must provide either 'csvData' (string) for a single sheet or 'sheets' (array of objects) for multiple sheets.";
              }

              const allWarnings = [];
              const themeColors = THEMES[theme] || THEMES.blue;
              // Effective palette: an explicit headerColor (chosen by the agent to
              // fit the document, or blank) overrides the theme's header fill and
              // derives a legible font + matching accent/total-row border.
              const customHeader = toArgb(headerColor);
              const palette = customHeader
                ? {
                    ...themeColors,
                    headerFill: customHeader,
                    headerFont: contrastFont(customHeader),
                    accent: customHeader,
                    totalBorder: customHeader,
                  }
                : themeColors;
              const isGovernment = template === "government";
              const fontName =
                fontFamily === "Arial" ? "Arial" : "Times New Roman";

              // --- Normalize data sheet definitions ---
              let dataSheets =
                sheets && Array.isArray(sheets) && sheets.length > 0
                  ? sheets.map((s, i) =>
                      typeof s === "string"
                        ? { name: `Sheet${i + 1}`, csvData: s }
                        : { ...s }
                    )
                  : [{ name: "Dữ liệu", csvData, title: title || null }];

              for (let i = 0; i < dataSheets.length; i++) {
                const sheet = dataSheets[i];
                const actualCsvData =
                  sheet.csvData || sheet.data || sheet.content || sheet.text;
                if (
                  !actualCsvData ||
                  typeof actualCsvData !== "string" ||
                  actualCsvData.trim() === ""
                ) {
                  return `Error: Sheet "${sheet.name || `Sheet${i + 1}`}" has no CSV data.`;
                }
                sheet.csvData = actualCsvData;
                // Biểu đồ của sheet cũng có thể bị serialize thành chuỗi JSON.
                if (sheet.charts) sheet.charts = coerceJsonMaybe(sheet.charts);
              }

              // --- Gộp nhiều file về MỘT workbook gọn gàng ---
              // Khi người dùng tải nhiều file, model đôi khi lặp lại cùng một
              // bảng ở nhiều sheet ("ra 3 bảng"). Chỉ giữ 1 sheet cho mỗi nội
              // dung trùng hệt; charts của bản sao được gộp vào sheet giữ lại
              // và các biểu đồ trỏ theo tên sheet được ánh xạ lại qua sheetAliases.
              let sheetAliases = new Map();
              if (dataSheets.length > 1) {
                const dd = dedupeSheets(dataSheets);
                if (dd.removed > 0) {
                  dataSheets = dd.sheets;
                  sheetAliases = dd.aliases;
                  allWarnings.push(
                    `Đã gộp ${dd.removed} sheet trùng nội dung để chỉ còn 1 bảng duy nhất (tránh lặp lại cùng một bảng).`
                  );
                }
              }

              // --- Collect and validate chart definitions ---
              // Charts nested inside a sheet default onto that sheet.
              const rawCharts = [
                ...(Array.isArray(charts) ? charts : []).map((c) =>
                  c && typeof c === "object" ? { ...c } : c
                ),
                ...dataSheets.flatMap((s, idx) =>
                  (Array.isArray(s.charts) ? s.charts : []).map((c) =>
                    c && typeof c === "object" ? { ...c, __ownerIdx: idx } : c
                  )
                ),
              ];
              const chartDefs = [];
              for (const raw of rawCharts) {
                const normalized = normalizeChartDef(raw);
                if (normalized) chartDefs.push(normalized);
                else
                  allWarnings.push(
                    `Bỏ qua một biểu đồ không hợp lệ (thiếu labels hoặc datasets).`
                  );
              }

              this.super.introspect(
                `${this.caller}: Creating Excel file "${filename}" with ${dataSheets.length} data sheet(s) and ${chartDefs.length} chart(s)`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: {
                    filename,
                    sheetCount: dataSheets.length,
                    sheetNames: dataSheets.map((s) => s.name),
                    chartCount: chartDefs.length,
                  },
                  description: `Create Excel spreadsheet "${filename}" with ${dataSheets.length} sheet(s) and ${chartDefs.length} chart(s)`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              // --- Parse every sheet's CSV up-front and fix final sheet names ---
              const usedNames = new Set(
                chartDefs.map((_, i) => `chartdata${i + 1}`)
              );
              const uniqueSheetName = (base) => {
                let name = String(base || "Sheet")
                  .replace(/[*?:\\/[\]]/g, "_")
                  .substring(0, 31)
                  .trim() || "Sheet";
                let candidate = name;
                let counter = 2;
                while (usedNames.has(candidate.toLowerCase())) {
                  const suffix = ` (${counter++})`;
                  candidate = name.substring(0, 31 - suffix.length) + suffix;
                }
                usedNames.add(candidate.toLowerCase());
                return candidate;
              };

              const parsedSheets = [];
              for (let i = 0; i < dataSheets.length; i++) {
                const sheetDef = dataSheets[i];
                const delimiter = detectDelimiter(sheetDef.csvData);
                const parsed = parseCSV(sheetDef.csvData, delimiter);
                const validation = validateCSVData(parsed);
                if (!validation.valid)
                  return `Error: Sheet "${sheetDef.name || `Sheet${i + 1}`}": ${validation.error}`;
                if (validation.warnings)
                  allWarnings.push(
                    ...validation.warnings.map((w) => `${sheetDef.name}: ${w}`)
                  );

                // Khử trùng dòng dữ liệu lặp (chỉ khi sheet không có công thức,
                // vì công thức tham chiếu theo vị trí dòng của lưới CSV).
                let finalParsed = parsed;
                if (!sheetHasFormula(parsed)) {
                  const deduped = dedupeDataRows(parsed);
                  finalParsed = deduped.rows;
                  if (deduped.removed > 0)
                    allWarnings.push(
                      `Sheet "${sheetDef.name}": đã loại ${deduped.removed} dòng trùng lặp.`
                    );
                }

                parsedSheets.push({
                  name: uniqueSheetName(sheetDef.name),
                  parsed: finalParsed,
                  title: sheetDef.title || null,
                  formulaCount: 0,
                });
              }

              // --- Validate formula sheet references before building anything ---
              const validSheetNames = new Set(
                parsedSheets.map((s) => s.name.toLowerCase())
              );
              for (const s of parsedSheets) {
                for (let r = 1; r < s.parsed.length; r++) {
                  for (const cellRaw of s.parsed[r]) {
                    if (
                      typeof cellRaw !== "string" ||
                      !cellRaw.startsWith("=") ||
                      cellRaw.length < 2
                    )
                      continue;
                    s.formulaCount++;
                    const badRef = validateFormulaSheetRefs(
                      cellRaw,
                      validSheetNames
                    );
                    if (badRef)
                      return (
                        `Error: Công thức "${cellRaw}" trên sheet "${s.name}" tham chiếu sheet không tồn tại: "${badRef}". ` +
                        `Các sheet hợp lệ: ${parsedSheets.map((x) => `'${x.name}'`).join(", ")}. ` +
                        `Hãy sửa lại tham chiếu và gọi lại tool.`
                      );
                  }
                }
              }

              // Row offsets per sheet: government header + title push the CSV
              // grid down. Formulas are written against the raw CSV grid
              // (header = row 1) and shifted automatically to final positions.
              const sheetRowOffset = new Map(
                parsedSheets.map((s) => [
                  s.name.toLowerCase(),
                  (isGovernment ? 4 : 0) + (s.title ? 1 : 0),
                ])
              );

              // --- Resolve chart placement onto data sheets ---
              const nameByLower = new Map(
                parsedSheets.map((s) => [s.name.toLowerCase(), s.name])
              );
              for (const def of chartDefs) {
                let target = null;
                if (def.sheet) {
                  // Trỏ lại về sheet giữ lại nếu sheet gốc đã bị gộp vì trùng
                  const aliased = sheetAliases.get(def.sheet.toLowerCase());
                  const wanted = aliased || def.sheet;
                  target = nameByLower.get(wanted.toLowerCase()) || null;
                  if (!target)
                    allWarnings.push(
                      `Biểu đồ "${def.title}": sheet "${def.sheet}" không tồn tại nên biểu đồ được đặt trên sheet riêng.`
                    );
                }
                if (!target && def.ownerIdx != null && parsedSheets[def.ownerIdx])
                  target = parsedSheets[def.ownerIdx].name;
                def.targetSheetName = target;
              }

              // --- Generate each native chart standalone (multi/mixed mode of xlsx-chart crashes) ---
              const chartJobs = [];
              for (const chartDef of chartDefs) {
                try {
                  chartJobs.push({
                    buffer: await generateNativeChartBuffer(chartDef),
                    def: chartDef,
                    targetSheetName: chartDef.targetSheetName,
                    placeholderName: null,
                    anchorFromRow: 0,
                  });
                } catch (chartErr) {
                  allWarnings.push(
                    `Không thể vẽ biểu đồ "${chartDef.title}": ${chartErr.message}`
                  );
                }
              }
              let placeholderCount = 0;
              for (const job of chartJobs) {
                if (job.targetSheetName) continue;
                placeholderCount++;
                job.placeholderName = uniqueSheetName(
                  placeholderCount === 1
                    ? "Biểu đồ"
                    : `Biểu đồ ${placeholderCount}`
                );
              }

              const ExcelJS = await import("exceljs");

              /**
               * Builds the styled workbook. Chart placeholder sheets come first
               * (so their sheetN.xml files are replaced during the merge), then
               * the styled data sheets, then hidden ChartData sheets holding
               * each chart's source matrix.
               */
              const buildWorkbook = async (jobs) => {
                const workbook = new ExcelJS.default.Workbook();
                workbook.created = new Date();
                workbook.modified = new Date();
                // Formulas carry no cached values - force a recalc on open
                workbook.calcProperties = {
                  ...(workbook.calcProperties || {}),
                  fullCalcOnLoad: true,
                };

                const summaries = [];
                const sheetMeta = {};

                // 1. Chart placeholder sheets (replaced by real chart sheets
                //    in the merge); charts targeting a data sheet need none.
                for (const job of jobs) {
                  if (!job.targetSheetName) {
                    workbook.addWorksheet(job.placeholderName);
                    summaries.push({
                      kind: "chart",
                      name: job.placeholderName,
                      chartTitle: job.def.title,
                      chartType: job.def.type,
                      onDataSheet: false,
                    });
                  } else {
                    summaries.push({
                      kind: "chart",
                      name: job.targetSheetName,
                      chartTitle: job.def.title,
                      chartType: job.def.type,
                      onDataSheet: true,
                    });
                  }
                }

                // 2. Styled data sheets
                for (const s of parsedSheets) {
                  const parsedData = s.parsed;
                  const worksheet = workbook.addWorksheet(s.name);
                  const rowOffset =
                    sheetRowOffset.get(s.name.toLowerCase()) || 0;

                  // Populate cells
                  for (let r = 0; r < parsedData.length; r++) {
                    const rowData = parsedData[r];
                    const row = worksheet.getRow(r + 1);
                    for (let c = 0; c < rowData.length; c++) {
                      const cellValue = rowData[c];
                      const cell = row.getCell(c + 1);
                      const typedValue =
                        r === 0 ? cellValue : inferCellType(cellValue);

                      // Shift formula references to their final row positions
                      if (
                        typedValue &&
                        typeof typedValue === "object" &&
                        typeof typedValue.formula === "string"
                      ) {
                        typedValue.formula = adjustFormulaRows(
                          typedValue.formula,
                          rowOffset,
                          sheetRowOffset
                        );
                      }
                      cell.value = typedValue;

                      if (typedValue instanceof Date) {
                        cell.numFmt = "dd/mm/yyyy";
                      } else if (
                        typeof typedValue === "number" &&
                        typeof cellValue === "string"
                      ) {
                        if (cellValue.includes("%")) {
                          cell.numFmt = "0.00%";
                        } else if (/^[$€£¥₹]/.test(cellValue.trim())) {
                          const symbol = cellValue.trim().charAt(0);
                          cell.numFmt = `"${symbol}"#,##0.00`;
                        } else if (/[0-9],[0-9]{3}/.test(cellValue)) {
                          cell.numFmt = "#,##0.00";
                        }
                      }
                    }
                    row.commit();
                  }

                  // Column widths from table data only (before headers/titles are inserted)
                  autoFitColumns(worksheet);

                  // Header block + title shift the table down
                  let dataStartRow = 1;
                  if (isGovernment) {
                    dataStartRow += applyGovernmentHeader(worksheet, {
                      parentOrganization,
                      organization,
                      place,
                    });
                  }
                  if (s.title) {
                    dataStartRow += applyTitleRow(worksheet, s.title, dataStartRow, {
                      accent: palette.accent,
                      fontName,
                      size: isGovernment ? 14 : 15,
                    });
                  }

                  const lastDataRow = dataStartRow + parsedData.length - 1;

                  applyHeaderStyle(
                    worksheet,
                    {
                      bold: true,
                      fill: palette.headerFill,
                      fontColor: palette.headerFont,
                      fontName,
                    },
                    dataStartRow
                  );
                  applyZebraStriping(
                    worksheet,
                    palette.zebra,
                    dataStartRow + 1
                  );
                  applySmartNumberFormatting(worksheet, dataStartRow);
                  applyPremiumFormatting(
                    worksheet,
                    dataStartRow,
                    {
                      totalFill: palette.totalFill,
                      totalBorder: palette.totalBorder,
                      fontName,
                    },
                    lastDataRow
                  );
                  freezePanes(worksheet, dataStartRow, 0);

                  if (isGovernment) {
                    applySignatureBlock(worksheet, {
                      signerTitle: signerTitle || "NGƯỜI LẬP BIỂU",
                    });
                  }

                  applyPrintSetup(worksheet, {
                    headerRow: dataStartRow,
                    columnCount: (parsedData[0] || []).length,
                  });

                  sheetMeta[s.name] = {
                    lastRow: worksheet.rowCount || lastDataRow,
                  };

                  const headers = parsedData[0] || [];
                  summaries.push({
                    kind: "data",
                    name: s.name,
                    title: s.title,
                    rows: parsedData.length - 1,
                    columns: headers.length,
                    headers: headers.slice(0, 10),
                    hasMore: headers.length > 10,
                    formulas: s.formulaCount,
                  });
                }

                // 3. Hidden ChartData sheets in the exact layout xlsx-chart references:
                //    row 1 = series names from column B, column A = labels from row 2
                jobs.forEach((job, i) => {
                  const ws = workbook.addWorksheet(`ChartData${i + 1}`);
                  ws.state = "hidden";
                  ws.addRow(["", ...job.def.datasets.map((d) => d.label)]);
                  job.def.labels.forEach((label, j) => {
                    ws.addRow([
                      label,
                      ...job.def.datasets.map((d) => d.data[j]),
                    ]);
                  });
                });

                const buffer = await workbook.xlsx.writeBuffer();
                return { buffer, summaries, sheetMeta };
              };

              let buffer, summaries;
              let embeddedCharts = chartJobs.map((j) => j.def);
              try {
                const built = await buildWorkbook(chartJobs);
                summaries = built.summaries;
                if (chartJobs.length > 0) {
                  // Stack each sheet's charts below its content (one blank row
                  // gap, then one chart every CHART_ROW_PITCH rows)
                  const perSheetIdx = new Map();
                  for (const job of chartJobs) {
                    if (!job.targetSheetName) continue;
                    const idx = perSheetIdx.get(job.targetSheetName) || 0;
                    perSheetIdx.set(job.targetSheetName, idx + 1);
                    const meta = built.sheetMeta[job.targetSheetName] || {
                      lastRow: 1,
                    };
                    job.anchorFromRow = meta.lastRow + 1 + idx * CHART_ROW_PITCH;
                  }
                  buffer = await mergeNativeCharts(built.buffer, chartJobs);
                } else {
                  buffer = built.buffer;
                }
              } catch (chartMergeErr) {
                if (chartJobs.length === 0) throw chartMergeErr;
                // Clean fallback: rebuild without chart/placeholder sheets
                allWarnings.push(
                  `Không thể nhúng biểu đồ native (${chartMergeErr.message}). File chỉ gồm bảng dữ liệu.`
                );
                embeddedCharts = [];
                ({ buffer, summaries } = await buildWorkbook([]));
              }

              const bufferSizeKB = (buffer.length / 1024).toFixed(2);
              const displayFilename = filename.split("/").pop();

              this.super.handlerProps.log(
                `create-excel-file: Generated buffer - size: ${bufferSizeKB}KB, sheets: ${summaries.length}, charts: ${embeddedCharts.length}`
              );

              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "xlsx",
                extension: "xlsx",
                buffer: Buffer.from(buffer),
                displayFilename,
                workspace: this.super.handlerProps?.invocation?.workspace,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(this.super, "ExcelFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created Excel file "${displayFilename}"`
              );

              // --- Build rich response ---
              const parts = [
                `✅ **Đã tạo thành công file Excel "${displayFilename}"** (${bufferSizeKB}KB)`,
                "",
              ];

              const chartSummaries = summaries.filter((s) => s.kind === "chart");
              const dataSummaries = summaries.filter((s) => s.kind === "data");

              if (chartSummaries.length > 0) {
                parts.push(`📈 **Biểu đồ (${chartSummaries.length}):**`);
                chartSummaries.forEach((s) => {
                  parts.push(
                    `- ✓ ${s.onDataSheet ? `Nằm ngay dưới bảng trên sheet "${s.name}"` : `Sheet riêng "${s.name}"`}: **${s.chartTitle}** (loại: ${s.chartType}, biểu đồ Excel gốc có thể chỉnh sửa, liên kết trực tiếp dữ liệu)`
                  );
                });
                parts.push("");
              }

              for (const s of dataSummaries) {
                parts.push(
                  `📊 **Sheet "${s.name}"**${s.title ? ` — ${s.title}` : ""}`
                );
                parts.push(`- Số dòng dữ liệu: ${s.rows}`);
                parts.push(`- Số cột: ${s.columns}`);
                if (s.headers.length > 0) {
                  parts.push(
                    `- Các cột: ${s.headers.join(", ")}${s.hasMore ? "..." : ""}`
                  );
                }
                if (s.formulas > 0)
                  parts.push(
                    `- Công thức Excel thật: ${s.formulas} ô (tự động tính khi mở file)`
                  );
                parts.push("");
              }

              parts.push("🎨 **Định dạng tự động đã áp dụng:**");
              parts.push(
                `- ✓ Header row (đậm, căn giữa, nền #${palette.headerFill.slice(-6)}${customHeader ? " — tự chọn hợp tài liệu" : ""}, chữ tương phản dễ đọc)`
              );
              parts.push(`- ✓ Font ${fontName} thống nhất (nội dung 11, tiêu đề cột 12)`);
              parts.push("- ✓ Kẻ border đầy đủ mọi ô + zebra striping");
              parts.push("- ✓ Auto-fit column widths");
              parts.push("- ✓ Frozen header row (không dùng bộ lọc/auto-filter)");
              parts.push("- ✓ Smart number formatting (số căn phải, dấu phân cách hàng nghìn, ngày dd/mm/yyyy)");
              parts.push("- ✓ Total row detection (tự động highlight dòng tổng)");
              parts.push("- ✓ Khổ in A4 fit ngang, lặp lại dòng tiêu đề mỗi trang in");
              if (dataSummaries.some((s) => s.title))
                parts.push("- ✓ Title row (tiêu đề lớn merge cells)");
              if (isGovernment)
                parts.push(
                  "- ✓ Mẫu văn bản hành chính: Quốc hiệu/Tiêu ngữ, tên cơ quan, dòng ngày tháng, khối chữ ký"
                );
              if (embeddedCharts.some((c) => c.type === "pie" || c.type === "doughnut"))
                parts.push("- ✓ Biểu đồ tròn hiển thị nhãn phần trăm (%)");
              if (embeddedCharts.length > 0)
                parts.push(
                  "- ✓ Biểu đồ Native Excel (mở bằng Excel/LibreOffice chỉnh sửa được trực tiếp)"
                );

              if (allWarnings.length > 0) {
                parts.push("");
                parts.push(`⚠️ **Lưu ý:**`);
                allWarnings.forEach((w) => parts.push(`- ${w}`));
              }

              return parts.join("\n");
            } catch (e) {
              this.super.handlerProps.log(
                `create-excel-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Excel file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
