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
  const transcriberPromise = new Promise((resolve) =>
    whisper.client().then((client) => resolve(client))
  );
  const audioDataPromise = new Promise((resolve) =>
    convertToWavAudioData(fullFilePath).then((audioData) => resolve(audioData))
  );
  const [audioData, transcriber] = await Promise.all([
    audioDataPromise,
    transcriberPromise,
  ]);

  if (!audioData) {
    console.error(`Failed to parse content from ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `Failed to parse content from ${filename}.`,
    };
  }

  console.log(`[Model Working]: Transcribing audio data to text`);
  const { text: content } = await transcriber(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
  });

  if (!content.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return { success: false, reason: `No text content found in ${filename}.` };
  }

  const data = {
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
  try {
    let buffer;
    const wavefile = require("wavefile");
    const ffmpeg = require("fluent-ffmpeg");
    const outFolder = path.resolve(__dirname, `../../storage/tmp`);
    if (!fs.existsSync(outFolder)) fs.mkdirSync(outFolder, { recursive: true });

    const fileExtension = path.extname(sourcePath).toLowerCase();
    if (fileExtension !== ".wav") {
      console.log(
        `[Conversion Required] ${fileExtension} file detected - converting to .wav`
      );
      const outputFile = path.resolve(outFolder, `${v4()}.wav`);
      const convert = new Promise((resolve) => {
        ffmpeg(sourcePath)
          .toFormat("wav")
          .on("error", (error) => {
            console.error(`[Conversion Error] ${error.message}`);
            resolve(false);
          })
          .on("progress", (progress) =>
            console.log(
              `[Conversion Processing]: ${progress.targetSize}KB converted`
            )
          )
          .on("end", () => {
            console.log("[Conversion Complete]: File converted to .wav!");
            resolve(true);
          })
          .save(outputFile);
      });
      const success = await convert;
      if (!success)
        throw new Error(
          "[Conversion Failed]: Could not convert file to .wav format!"
        );

      const chunks = [];
      const stream = fs.createReadStream(outputFile);
      for await (let chunk of stream) chunks.push(chunk);
      buffer = Buffer.concat(chunks);
      fs.rmSync(outputFile);
    } else {
      const chunks = [];
      const stream = fs.createReadStream(sourcePath);
      for await (let chunk of stream) chunks.push(chunk);
      buffer = Buffer.concat(chunks);
    }

    const wavFile = new wavefile.WaveFile(buffer);
    wavFile.toBitDepth("32f");
    wavFile.toSampleRate(16000);

    let audioData = wavFile.getSamples();
    if (Array.isArray(audioData)) {
      if (audioData.length > 1) {
        const SCALING_FACTOR = Math.sqrt(2);

        // Merge channels into first channel to save memory
        for (let i = 0; i < audioData[0].length; ++i) {
          audioData[0][i] =
            (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
        }
      }
      audioData = audioData[0];
    }

    return audioData;
  } catch (error) {
    console.error(`convertToWavAudioData`, error);
    return null;
  }
}

module.exports = asAudio;
