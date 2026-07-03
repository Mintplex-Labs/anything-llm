const fs = require('fs');
const XlsxChart = require('xlsx-chart');
const JSZip = require('jszip');
const xlsxChartOpts = { chart: 'bar', titles: ['Biểu đồ'], fields: ['T1'], data: {'D': {'T1': 1}} };
const xlsxChart = new XlsxChart();
xlsxChart.generate(xlsxChartOpts, async (err, data) => {
  const zip = await JSZip.loadAsync(Buffer.from(data, "base64"));
  const xml = await zip.file("[Content_Types].xml").async("text");
  console.log(xml);
});
