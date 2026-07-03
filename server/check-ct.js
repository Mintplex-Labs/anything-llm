const JSZip = require('jszip');
const fs = require('fs');
async function run() {
  const buf = fs.readFileSync('merged-output.xlsx');
  const zip = await JSZip.loadAsync(buf);
  console.log(await zip.file("[Content_Types].xml").async("text"));
}
run();
