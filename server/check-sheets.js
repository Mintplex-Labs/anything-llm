const fs = require('fs');
const XlsxChart = require('xlsx-chart');
const JSZip = require('jszip');

const xlsxChartOpts = {
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
xlsxChart.generate(xlsxChartOpts, async (err, data) => {
  const buf = Buffer.from(data, "base64");
  const zip = await JSZip.loadAsync(buf);
  console.log(Object.keys(zip.files));
  const wb = await zip.file("xl/workbook.xml").async("text");
  console.log(wb);
});
