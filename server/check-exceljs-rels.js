const ExcelJS = require('exceljs');
const JSZip = require('jszip');
async function run() {
  const workbook = new ExcelJS.Workbook();
  const wsChart = workbook.addWorksheet('Chart');
  const wsData = workbook.addWorksheet('Table');
  wsData.addRow(['A']);
  const buf = await workbook.xlsx.writeBuffer();
  const zip = await JSZip.loadAsync(buf);
  console.log(await zip.file("xl/_rels/workbook.xml.rels").async("text"));
}
run();
