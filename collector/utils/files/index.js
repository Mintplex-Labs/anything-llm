const fs = require('fs');
const path = require('path');

function trashFile(filepath) {
  if (!fs.existsSync(filepath)) return;
  fs.rmSync(filepath)
  return;
}

function createdDate(filepath) {
  try {
    const { birthtime } = fs.statSync(filepath)
    return birthtime.toLocaleString();
  } catch {
    return 'unknown'
  }
}

// def write_to_server_documents(data, filename, override_destination = None):
// destination = f"../server/storage/documents/custom-documents" if override_destination == None else override_destination
// if os.path.exists(destination) == False: os.makedirs(destination)
// with open(f"{destination}/{filename}.json", 'w', encoding='utf-8') as file:
//   json.dump(data, file, ensure_ascii=True, indent=4)

function writeToServerDocuments(data = {}, filename, destinationOverride = null) {
  const destination = destinationOverride ? path.resolve(destinationOverride) : path.resolve(__dirname, '../../../server/storage/documents/custom-documents')
  if (!fs.existsSync(destination)) fs.mkdirSync(destination, { recursive: true });
  const destinationFilePath = path.resolve(destination, filename);

  fs.writeFileSync(destinationFilePath, JSON.stringify(data, null, 4), { encoding: 'utf-8' })
  return;
}

module.exports = {
  trashFile,
  createdDate,
  writeToServerDocuments
}