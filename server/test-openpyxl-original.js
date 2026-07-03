const fs = require('fs');
const XlsxChart = require('xlsx-chart');

const xlsxChartOpts = {
  chart: 'bar', titles: ['Biểu đồ'], fields: ['T1'], data: {'D': {'T1': 1}}
};
const xlsxChart = new XlsxChart();
xlsxChart.generate(xlsxChartOpts, (err, data) => {
  fs.writeFileSync('original-chart.xlsx', Buffer.from(data, "base64"));
});
