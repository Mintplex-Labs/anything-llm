const { v4 } = require("uuid");
const fs = require("fs");
const { mboxParser } = require("mbox-parser");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

async function asMbox({
  fullFilePath = "",
  filename = "",
  options = {},
  metadata = {},
}) {
  console.log(`-- Working ${filename} --`);

  const mails = await mboxParser(fs.createReadStream(fullFilePath))
    .then((mails) => mails)
    .catch((error) => {
      console.log(`Could not parse mail items`, error);
      return [];
    });

  if (!mails.length) {
    console.error(`Resulting mail items was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No mail items found in ${filename}.`,
      documents: [],
    };
  }

  let item = 1;
  const documents = [];
  for (const mail of mails) {
    if (!mail.hasOwnProperty("text")) continue;

    const content = mail.text;
    if (!content) continue;
    console.log(
      `-- Working on message "${mail.subject || "Unknown subject"}" --`
    );

    const data = {
      id: v4(),
      url: "file://" + fullFilePath,
      title:
        metadata.title ||
        (mail?.subject
          ? slugify(mail?.subject?.replace(".", "")) + ".mbox"
          : `msg_${item}-${filename}`),
      docAuthor: metadata.docAuthor || mail?.from?.text,
      description: metadata.description || "No description found.",
      docSource:
        metadata.docSource || "Mbox message file uploaded by the user.",
      chunkSource: metadata.chunkSource || "",
      published: createdDate(fullFilePath),
      wordCount: content.split(" ").length,
      pageContent: content,
      token_count_estimate: tokenizeString(content),
    };

    item++;
    const document = writeToServerDocuments({
      data,
      filename: `${slugify(filename)}-${data.id}-msg-${item}`,
      options: { parseOnly: options.parseOnly },
    });
    documents.push(document);
  }

  trashFile(fullFilePath);
  console.log(
    `[SUCCESS]: ${filename} messages converted & ready for embedding.\n`
  );
  return { success: true, reason: null, documents };
}

module.exports = asMbox;
