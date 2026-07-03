const JSZip = require('jszip');
const fs = require('fs');
async function run() {
  const buf = fs.readFileSync('merged-output.xlsx');
  const zip = await JSZip.loadAsync(buf);
  console.log("Sheet1 rels:", await zip.file("xl/worksheets/_rels/sheet1.xml.rels").async("text"));
  console.log("Drawing1 rels:", await zip.file("xl/drawings/_rels/drawing1.xml.rels").async("text"));
}
run();
