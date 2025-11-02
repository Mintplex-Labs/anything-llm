const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../server/.env") });
const { processSingleFile } = require("./index");

(async () => {
  try {
    console.log("=== Starting processSingleFile test ===");

    // Đường dẫn file trong collector/hotdir
    const fileName = "PO 240023-MTCO-JVPC 10166.pdf";

    const result = await processSingleFile(fileName);
    console.log("Result:", result);

    // Ghi kết quả ra file txt để xem chi tiết
    const outputPath = path.resolve(__dirname, "result.txt");
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf8");

    console.log(`✅ Kết quả đã được lưu tại: ${outputPath}`);
  } catch (e) {
    console.error("❌ Error caught:", e);
  }
})();
