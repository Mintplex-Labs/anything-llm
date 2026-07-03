const fs = require('fs');
const XlsxChart = require('xlsx-chart');
const ExcelJS = require('exceljs');
const JSZip = require('jszip');
const { mergeNativeChart } = require('./utils/agents/aibitat/plugins/create-files/xlsx/utils.js');

async function run() {
  try {
    const workbook = new ExcelJS.Workbook();
    const wsChart = workbook.addWorksheet('Chart');
    const wsData = workbook.addWorksheet('Table');
    wsData.addRow(['Tháng', 'Doanh thu']);
    wsData.addRow(['T1', 100]);
    wsData.addRow(['T2', 200]);
    const exceljsBuffer = await workbook.xlsx.writeBuffer();

    const xlsxChartOpts = {
      file: 'chart.xlsx',
      chart: 'bar',
      titles: ['Biểu đồ doanh thu'],
      fields: ['T1', 'T2'],
      data: {
        'Doanh thu': {
          'T1': 100,
          'T2': 200
        }
      }
    };
    const xlsxChart = new XlsxChart();
    const xlsxChartBuffer = await new Promise((resolve, reject) => {
      xlsxChart.generate(xlsxChartOpts, (err, data) => {
        if (err) return reject(err);
        resolve(Buffer.from(data, "base64"));
      });
    });

    const mergedBuffer = await mergeNativeChart(exceljsBuffer, xlsxChartBuffer);
    
    fs.writeFileSync('merged-output.xlsx', mergedBuffer);
    console.log("Merged file written to merged-output.xlsx");
  } catch (e) {
    console.error("Error:", e);
  }
}
run();
