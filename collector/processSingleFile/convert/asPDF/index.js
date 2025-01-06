const { v4 } = require("uuid");
const fs = require("fs");
const FormData = require("form-data");
const axios = require('axios');
const path = require('path');
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../../utils/files");
const { tokenizeString } = require("../../../utils/tokenizer");
const { default: slugify } = require("slugify");
const PDFLoader = require("./PDFLoader");


async function extractTextFromApi(fullFilePath) {
  const endpoint = `${process.env.PRISM_OCR_ENDPOINT}${process.env.EXTRACT_API}`;
  console.log(endpoint);
  const token = `Bearer ${process.env.BEARER_TOKEN}`;
  const params = new URLSearchParams({
    output_format: process.env.OUTPUT_FORMAT,
    use_ocr: process.env.USE_OCR,
  });

  const formData = new FormData();
  formData.append("file", fs.createReadStream(fullFilePath), {
    contentType: "application/pdf",
    filename: path.basename(fullFilePath),
  });

  try {
    const response = await axios.post(`${endpoint}?${params.toString()}`, formData, {
      headers: {
        Authorization: token,
        ...formData.getHeaders(),
      },
    });

    if (response.status === 200) {
      console.log(`Text extraction successful for file: ${fullFilePath}`);
      return response.data; // Assuming the response contains the extracted text
    } else {
      console.error(
        `Failed to extract text. Status: ${response.status}, Data: ${response.data}`
      );
      throw new Error(
        `Text extraction failed with status: ${response.status}`
      );
    }
  } catch (error) {
    console.error(`Error during text extraction: ${error.message}`);
    throw error;
  }
}

async function extractTextNative(fullFilePath) {
  const pdfLoader = new PDFLoader(fullFilePath, {
    splitPages: true,
  });

  console.log(`-- Extracting text from: ${fullFilePath} --`);
  const pageContent = [];
  const docs = await pdfLoader.load();

  for (const doc of docs) {
    console.log(
      `-- Parsing content from page ${doc.metadata?.loc?.pageNumber || "unknown"} --`
    );
    if (!doc.pageContent || !doc.pageContent.length) continue;
    pageContent.push(doc.pageContent);
  }

  if (!pageContent.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  return {
    success: true,
    text: pageContent.join(""),
    docs, // Return docs array along with the text
  };
}

async function asPdf({ fullFilePath = "", filename = "" }) {
  const pdfLoader = new PDFLoader(fullFilePath, {
    splitPages: true,
  });

  console.log(`-- Working ${filename} --`);
  let content;
  let data;
  try {
    // Extract text using the external API
    if (process.env.PRISM_OCR_PARSER == 'true') {
      console.log(`using prism doc parser - external `);
      content = await extractTextFromApi(fullFilePath);
      data = {
        id: v4(),
        url: "file://" + fullFilePath,
        title: filename,
        docAuthor: "no author found",
        description: "No description found.",
        docSource: "pdf file uploaded by the user.",
        chunkSource: "",
        published: createdDate(fullFilePath),
        wordCount: content.split(" ").length,
        pageContent: content,
        token_count_estimate: tokenizeString(content).length,
      };
    } else {
      result = await extractTextNative(fullFilePath);
      content = result.text
      docs = result.docs
      data = {
        id: v4(),
        url: "file://" + fullFilePath,
        title: filename,
        docAuthor: docs[0]?.metadata?.pdf?.info?.Creator || "no author found",
        description: docs[0]?.metadata?.pdf?.info?.Title || "No description found.",
        docSource: "pdf file uploaded by the user.",
        chunkSource: "",
        published: createdDate(fullFilePath),
        wordCount: content.split(" ").length,
        pageContent: content,
        token_count_estimate: tokenizeString(content).length,
      };
    }
    
  } catch (error) {
    console.error(`Failed to extract text for ${filename}: ${error.message}`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `Failed to extract text for ${filename}: ${error.message}`,
      documents: [],
    };
  }

  if (!content) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }
  // const content = pageContent.join("");


  const document = writeToServerDocuments(
    data,
    `${slugify(filename)}-${data.id}`
  );
  trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

module.exports = asPdf;
