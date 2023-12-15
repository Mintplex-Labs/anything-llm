const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");
const { LocalWhisper } = require("../../utils/WhisperProviders/localWhisper");

async function asAudio({ fullFilePath = "", filename = "" }) {
  const whisper = new LocalWhisper();

  console.log(`-- Working ${filename} --`);
  const transcriber = await whisper.client();
  const audioData = await convertToWavAudioData(fullFilePath);
  const { text: content } = await transcriber(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
  });

  if (!content.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return { success: false, reason: `No text content found in ${filename}.` };
  }

  data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor: "no author found",
    description: "No description found.",
    docSource: "pdf file uploaded by the user.",
    chunkSource: filename,
    published: createdDate(fullFilePath),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content).length,
  };

  writeToServerDocuments(data, `${slugify(filename)}-${data.id}`);
  trashFile(fullFilePath);
  console.log(
    `[SUCCESS]: ${filename} transcribed, converted & ready for embedding.\n`
  );
  return { success: true, reason: null };
}

async function convertToWavAudioData(sourcePath) {
  const wavefile = require("wavefile");
  const ffmpeg = require("fluent-ffmpeg");
  const outFolder = path.resolve(__dirname, `../../storage/tmp`);
  let buffer;
  if (!fs.existsSync(outFolder)) fs.mkdirSync(outFolder, { recursive: true });

  const fileExtension = path.extname(sourcePath).toLowerCase();
  if (fileExtension !== ".wav") {
    console.log(`${fileExtension} file detected - converting to .wav`);
    const outputFile = path.resolve(outFolder, `${v4()}.wav`);
    const convert = new Promise((resolve) => {
      ffmpeg(sourcePath)
        .toFormat("wav")
        .on("error", (err) => {
          console.log("An error occurred: " + err.message);
          resolve(false);
        })
        .on("progress", (progress) => {
          console.log("Processing: " + progress.targetSize + " KB converted");
        })
        .on("end", () => {
          console.log("Processing finished !");
          resolve(true);
        })
        .save(outputFile);
    });
    const success = await convert;
    if (!success) throw new Error("Could not convert file to parsable format!");
    buffer = Buffer.from(fs.readFileSync(outputFile));
    fs.rmSync(outputFile);
  } else {
    buffer = Buffer.from(fs.readFileSync(sourcePath));
  }

  const wavFile = new wavefile.WaveFile(buffer);
  wavFile.toBitDepth("32f");
  wavFile.toSampleRate(16000);

  let audioData = wavFile.getSamples();
  if (Array.isArray(audioData)) {
    if (audioData.length > 1) {
      const SCALING_FACTOR = Math.sqrt(2);

      // Merge channels (into first channel to save memory)
      for (let i = 0; i < audioData[0].length; ++i) {
        audioData[0][i] =
          (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
      }
    }
    audioData = audioData[0];
  }

  return audioData;
}

module.exports = asAudio;
