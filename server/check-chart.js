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
  const chartXml = await zip.file("xl/charts/chart1.xml").async("text");
  console.log(chartXml.substring(0, 1000));
  // check if it has cached strings
  const cached = chartXml.match(/<c:v>[^<]+<\/c:v>/g);
  console.log("Cached values:", cached);
});
