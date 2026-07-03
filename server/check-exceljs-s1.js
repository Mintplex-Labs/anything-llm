const ExcelJS = require('exceljs');
const JSZip = require('jszip');
async function run() {
  const workbook = new ExcelJS.Workbook();
  const wsChart = workbook.addWorksheet('Chart');
  const buf = await workbook.xlsx.writeBuffer();
  const zip = await JSZip.loadAsync(buf);
  console.log(await zip.file("xl/worksheets/sheet1.xml").async("text"));
}
run();
