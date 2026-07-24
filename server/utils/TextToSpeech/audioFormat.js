const AUDIO_FORMATS = {
  flac: { mime: "audio/flac", extension: ".flac" },
  m4a: { mime: "audio/mp4", extension: ".m4a" },
  mp3: { mime: "audio/mpeg", extension: ".mp3" },
  ogg: { mime: "audio/ogg", extension: ".ogg" },
  wav: { mime: "audio/wav", extension: ".wav" },
  webm: { mime: "audio/webm", extension: ".webm" },
};

/**
 * Detect the container of an audio buffer from its file signature.
 * Defaults to MP3 to preserve the existing behavior for unknown data.
 * @param {Buffer} buffer
 * @returns {{mime: string, extension: string}}
 */
function getAudioFileInfo(buffer) {
  if (!Buffer.isBuffer(buffer)) return AUDIO_FORMATS.mp3;

  const signature = (start, end) => buffer.toString("ascii", start, end);

  if (
    buffer.length >= 12 &&
    ["RIFF", "RF64"].includes(signature(0, 4)) &&
    signature(8, 12) === "WAVE"
  )
    return AUDIO_FORMATS.wav;
  if (buffer.length >= 4 && signature(0, 4) === "OggS")
    return AUDIO_FORMATS.ogg;
  if (buffer.length >= 4 && signature(0, 4) === "fLaC")
    return AUDIO_FORMATS.flac;
  if (buffer.length >= 8 && signature(4, 8) === "ftyp")
    return AUDIO_FORMATS.m4a;
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  )
    return AUDIO_FORMATS.webm;
  if (
    (buffer.length >= 3 && signature(0, 3) === "ID3") ||
    (buffer.length >= 2 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
  )
    return AUDIO_FORMATS.mp3;

  return AUDIO_FORMATS.mp3;
}

module.exports = { getAudioFileInfo };
