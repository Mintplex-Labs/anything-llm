/**
 * @typedef RecordedBlobResponse
 * @property {AudioBuffer} buffer - AudioBuffer of blob
 * @property {string} url - blob URL
 * @property {'recording'} source
 * @property {Blob['type']} mimeType - Mime of blob
 */

/**
 * @typedef WorkerTranscriptionResponse
 * @property {string|null} transcript - Full text transcript
 * @property {string|null} error - error message
 */

function padTime(time) {
  return String(time).padStart(2, "0");
}

export function formatAudioTimestamp(time) {
  const hours = (time / (60 * 60)) | 0;
  time -= hours * (60 * 60);
  const minutes = (time / 60) | 0;
  time -= minutes * 60;
  const seconds = time | 0;
  return `${hours ? padTime(hours) + ":" : ""}${padTime(minutes)}:${padTime(
    seconds
  )}`;
}

/*
 * There is a bug where `navigator.mediaDevices.getUserMedia` + `MediaRecorder`
 * creates WEBM files without duration metadata. See:
 * - https://bugs.chromium.org/p/chromium/issues/detail?id=642012
 * - https://stackoverflow.com/a/39971175/13989043
 *
 * This file contains a function that fixes the duration metadata of a WEBM file.
 *  - Answer found: https://stackoverflow.com/a/75218309/13989043
 *  - Code adapted from: https://github.com/mat-sz/webm-fix-duration
 *    (forked from https://github.com/yusitnikov/fix-webm-duration)
 */

/*
 * This is the list of possible WEBM file sections by their IDs.
 * Possible types: Container, Binary, Uint, Int, String, Float, Date
 */

const sections = {
  0xa45dfa3: { name: "EBML", type: "Container" },
  0x286: { name: "EBMLVersion", type: "Uint" },
  0x2f7: { name: "EBMLReadVersion", type: "Uint" },
  0x2f2: { name: "EBMLMaxIDLength", type: "Uint" },
  0x2f3: { name: "EBMLMaxSizeLength", type: "Uint" },
  0x282: { name: "DocType", type: "String" },
  0x287: { name: "DocTypeVersion", type: "Uint" },
  0x285: { name: "DocTypeReadVersion", type: "Uint" },
  0x6c: { name: "Void", type: "Binary" },
  0x3f: { name: "CRC-32", type: "Binary" },
  0xb538667: { name: "SignatureSlot", type: "Container" },
  0x3e8a: { name: "SignatureAlgo", type: "Uint" },
  0x3e9a: { name: "SignatureHash", type: "Uint" },
  0x3ea5: { name: "SignaturePublicKey", type: "Binary" },
  0x3eb5: { name: "Signature", type: "Binary" },
  0x3e5b: { name: "SignatureElements", type: "Container" },
  0x3e7b: { name: "SignatureElementList", type: "Container" },
  0x2532: { name: "SignedElement", type: "Binary" },
  0x8538067: { name: "Segment", type: "Container" },
  0x14d9b74: { name: "SeekHead", type: "Container" },
  0xdbb: { name: "Seek", type: "Container" },
  0x13ab: { name: "SeekID", type: "Binary" },
  0x13ac: { name: "SeekPosition", type: "Uint" },
  0x549a966: { name: "Info", type: "Container" },
  0x33a4: { name: "SegmentUID", type: "Binary" },
  0x3384: { name: "SegmentFilename", type: "String" },
  0x1cb923: { name: "PrevUID", type: "Binary" },
  0x1c83ab: { name: "PrevFilename", type: "String" },
  0x1eb923: { name: "NextUID", type: "Binary" },
  0x1e83bb: { name: "NextFilename", type: "String" },
  0x444: { name: "SegmentFamily", type: "Binary" },
  0x2924: { name: "ChapterTranslate", type: "Container" },
  0x29fc: { name: "ChapterTranslateEditionUID", type: "Uint" },
  0x29bf: { name: "ChapterTranslateCodec", type: "Uint" },
  0x29a5: { name: "ChapterTranslateID", type: "Binary" },
  0xad7b1: { name: "TimecodeScale", type: "Uint" },
  0x489: { name: "Duration", type: "Float" },
  0x461: { name: "DateUTC", type: "Date" },
  0x3ba9: { name: "Title", type: "String" },
  0xd80: { name: "MuxingApp", type: "String" },
  0x1741: { name: "WritingApp", type: "String" },
  // 0xf43b675: { name: 'Cluster', type: 'Container' },
  0x67: { name: "Timecode", type: "Uint" },
  0x1854: { name: "SilentTracks", type: "Container" },
  0x18d7: { name: "SilentTrackNumber", type: "Uint" },
  0x27: { name: "Position", type: "Uint" },
  0x2b: { name: "PrevSize", type: "Uint" },
  0x23: { name: "SimpleBlock", type: "Binary" },
  0x20: { name: "BlockGroup", type: "Container" },
  0x21: { name: "Block", type: "Binary" },
  0x22: { name: "BlockVirtual", type: "Binary" },
  0x35a1: { name: "BlockAdditions", type: "Container" },
  0x26: { name: "BlockMore", type: "Container" },
  0x6e: { name: "BlockAddID", type: "Uint" },
  0x25: { name: "BlockAdditional", type: "Binary" },
  0x1b: { name: "BlockDuration", type: "Uint" },
  0x7a: { name: "ReferencePriority", type: "Uint" },
  0x7b: { name: "ReferenceBlock", type: "Int" },
  0x7d: { name: "ReferenceVirtual", type: "Int" },
  0x24: { name: "CodecState", type: "Binary" },
  0x35a2: { name: "DiscardPadding", type: "Int" },
  0xe: { name: "Slices", type: "Container" },
  0x68: { name: "TimeSlice", type: "Container" },
  0x4c: { name: "LaceNumber", type: "Uint" },
  0x4d: { name: "FrameNumber", type: "Uint" },
  0x4b: { name: "BlockAdditionID", type: "Uint" },
  0x4e: { name: "Delay", type: "Uint" },
  0x4f: { name: "SliceDuration", type: "Uint" },
  0x48: { name: "ReferenceFrame", type: "Container" },
  0x49: { name: "ReferenceOffset", type: "Uint" },
  0x4a: { name: "ReferenceTimeCode", type: "Uint" },
  0x2f: { name: "EncryptedBlock", type: "Binary" },
  0x654ae6b: { name: "Tracks", type: "Container" },
  0x2e: { name: "TrackEntry", type: "Container" },
  0x57: { name: "TrackNumber", type: "Uint" },
  0x33c5: { name: "TrackUID", type: "Uint" },
  0x3: { name: "TrackType", type: "Uint" },
  0x39: { name: "FlagEnabled", type: "Uint" },
  0x8: { name: "FlagDefault", type: "Uint" },
  0x15aa: { name: "FlagForced", type: "Uint" },
  0x1c: { name: "FlagLacing", type: "Uint" },
  0x2de7: { name: "MinCache", type: "Uint" },
  0x2df8: { name: "MaxCache", type: "Uint" },
  0x3e383: { name: "DefaultDuration", type: "Uint" },
  0x34e7a: { name: "DefaultDecodedFieldDuration", type: "Uint" },
  0x3314f: { name: "TrackTimecodeScale", type: "Float" },
  0x137f: { name: "TrackOffset", type: "Int" },
  0x15ee: { name: "MaxBlockAdditionID", type: "Uint" },
  0x136e: { name: "Name", type: "String" },
  0x2b59c: { name: "Language", type: "String" },
  0x6: { name: "CodecID", type: "String" },
  0x23a2: { name: "CodecPrivate", type: "Binary" },
  0x58688: { name: "CodecName", type: "String" },
  0x3446: { name: "AttachmentLink", type: "Uint" },
  0x1a9697: { name: "CodecSettings", type: "String" },
  0x1b4040: { name: "CodecInfoURL", type: "String" },
  0x6b240: { name: "CodecDownloadURL", type: "String" },
  0x2a: { name: "CodecDecodeAll", type: "Uint" },
  0x2fab: { name: "TrackOverlay", type: "Uint" },
  0x16aa: { name: "CodecDelay", type: "Uint" },
  0x16bb: { name: "SeekPreRoll", type: "Uint" },
  0x2624: { name: "TrackTranslate", type: "Container" },
  0x26fc: { name: "TrackTranslateEditionUID", type: "Uint" },
  0x26bf: { name: "TrackTranslateCodec", type: "Uint" },
  0x26a5: { name: "TrackTranslateTrackID", type: "Binary" },
  0x60: { name: "Video", type: "Container" },
  0x1a: { name: "FlagInterlaced", type: "Uint" },
  0x13b8: { name: "StereoMode", type: "Uint" },
  0x13c0: { name: "AlphaMode", type: "Uint" },
  0x13b9: { name: "OldStereoMode", type: "Uint" },
  0x30: { name: "PixelWidth", type: "Uint" },
  0x3a: { name: "PixelHeight", type: "Uint" },
  0x14aa: { name: "PixelCropBottom", type: "Uint" },
  0x14bb: { name: "PixelCropTop", type: "Uint" },
  0x14cc: { name: "PixelCropLeft", type: "Uint" },
  0x14dd: { name: "PixelCropRight", type: "Uint" },
  0x14b0: { name: "DisplayWidth", type: "Uint" },
  0x14ba: { name: "DisplayHeight", type: "Uint" },
  0x14b2: { name: "DisplayUnit", type: "Uint" },
  0x14b3: { name: "AspectRatioType", type: "Uint" },
  0xeb524: { name: "ColourSpace", type: "Binary" },
  0xfb523: { name: "GammaValue", type: "Float" },
  0x383e3: { name: "FrameRate", type: "Float" },
  0x61: { name: "Audio", type: "Container" },
  0x35: { name: "SamplingFrequency", type: "Float" },
  0x38b5: { name: "OutputSamplingFrequency", type: "Float" },
  0x1f: { name: "Channels", type: "Uint" },
  0x3d7b: { name: "ChannelPositions", type: "Binary" },
  0x2264: { name: "BitDepth", type: "Uint" },
  0x62: { name: "TrackOperation", type: "Container" },
  0x63: { name: "TrackCombinePlanes", type: "Container" },
  0x64: { name: "TrackPlane", type: "Container" },
  0x65: { name: "TrackPlaneUID", type: "Uint" },
  0x66: { name: "TrackPlaneType", type: "Uint" },
  0x69: { name: "TrackJoinBlocks", type: "Container" },
  0x6d: { name: "TrackJoinUID", type: "Uint" },
  0x40: { name: "TrickTrackUID", type: "Uint" },
  0x41: { name: "TrickTrackSegmentUID", type: "Binary" },
  0x46: { name: "TrickTrackFlag", type: "Uint" },
  0x47: { name: "TrickMasterTrackUID", type: "Uint" },
  0x44: { name: "TrickMasterTrackSegmentUID", type: "Binary" },
  0x2d80: { name: "ContentEncodings", type: "Container" },
  0x2240: { name: "ContentEncoding", type: "Container" },
  0x1031: { name: "ContentEncodingOrder", type: "Uint" },
  0x1032: { name: "ContentEncodingScope", type: "Uint" },
  0x1033: { name: "ContentEncodingType", type: "Uint" },
  0x1034: { name: "ContentCompression", type: "Container" },
  0x254: { name: "ContentCompAlgo", type: "Uint" },
  0x255: { name: "ContentCompSettings", type: "Binary" },
  0x1035: { name: "ContentEncryption", type: "Container" },
  0x7e1: { name: "ContentEncAlgo", type: "Uint" },
  0x7e2: { name: "ContentEncKeyID", type: "Binary" },
  0x7e3: { name: "ContentSignature", type: "Binary" },
  0x7e4: { name: "ContentSigKeyID", type: "Binary" },
  0x7e5: { name: "ContentSigAlgo", type: "Uint" },
  0x7e6: { name: "ContentSigHashAlgo", type: "Uint" },
  0xc53bb6b: { name: "Cues", type: "Container" },
  0x3b: { name: "CuePoint", type: "Container" },
  0x33: { name: "CueTime", type: "Uint" },
  0x37: { name: "CueTrackPositions", type: "Container" },
  0x77: { name: "CueTrack", type: "Uint" },
  0x71: { name: "CueClusterPosition", type: "Uint" },
  0x70: { name: "CueRelativePosition", type: "Uint" },
  0x32: { name: "CueDuration", type: "Uint" },
  0x1378: { name: "CueBlockNumber", type: "Uint" },
  0x6a: { name: "CueCodecState", type: "Uint" },
  0x5b: { name: "CueReference", type: "Container" },
  0x16: { name: "CueRefTime", type: "Uint" },
  0x17: { name: "CueRefCluster", type: "Uint" },
  0x135f: { name: "CueRefNumber", type: "Uint" },
  0x6b: { name: "CueRefCodecState", type: "Uint" },
  0x941a469: { name: "Attachments", type: "Container" },
  0x21a7: { name: "AttachedFile", type: "Container" },
  0x67e: { name: "FileDescription", type: "String" },
  0x66e: { name: "FileName", type: "String" },
  0x660: { name: "FileMimeType", type: "String" },
  0x65c: { name: "FileData", type: "Binary" },
  0x6ae: { name: "FileUID", type: "Uint" },
  0x675: { name: "FileReferral", type: "Binary" },
  0x661: { name: "FileUsedStartTime", type: "Uint" },
  0x662: { name: "FileUsedEndTime", type: "Uint" },
  0x43a770: { name: "Chapters", type: "Container" },
  0x5b9: { name: "EditionEntry", type: "Container" },
  0x5bc: { name: "EditionUID", type: "Uint" },
  0x5bd: { name: "EditionFlagHidden", type: "Uint" },
  0x5db: { name: "EditionFlagDefault", type: "Uint" },
  0x5dd: { name: "EditionFlagOrdered", type: "Uint" },
  0x36: { name: "ChapterAtom", type: "Container" },
  0x33c4: { name: "ChapterUID", type: "Uint" },
  0x1654: { name: "ChapterStringUID", type: "String" },
  0x11: { name: "ChapterTimeStart", type: "Uint" },
  0x12: { name: "ChapterTimeEnd", type: "Uint" },
  0x18: { name: "ChapterFlagHidden", type: "Uint" },
  0x598: { name: "ChapterFlagEnabled", type: "Uint" },
  0x2e67: { name: "ChapterSegmentUID", type: "Binary" },
  0x2ebc: { name: "ChapterSegmentEditionUID", type: "Uint" },
  0x23c3: { name: "ChapterPhysicalEquiv", type: "Uint" },
  0xf: { name: "ChapterTrack", type: "Container" },
  0x9: { name: "ChapterTrackNumber", type: "Uint" },
  0x0: { name: "ChapterDisplay", type: "Container" },
  0x5: { name: "ChapString", type: "String" },
  0x37c: { name: "ChapLanguage", type: "String" },
  0x37e: { name: "ChapCountry", type: "String" },
  0x2944: { name: "ChapProcess", type: "Container" },
  0x2955: { name: "ChapProcessCodecID", type: "Uint" },
  0x50d: { name: "ChapProcessPrivate", type: "Binary" },
  0x2911: { name: "ChapProcessCommand", type: "Container" },
  0x2922: { name: "ChapProcessTime", type: "Uint" },
  0x2933: { name: "ChapProcessData", type: "Binary" },
  0x254c367: { name: "Tags", type: "Container" },
  0x3373: { name: "Tag", type: "Container" },
  0x23c0: { name: "Targets", type: "Container" },
  0x28ca: { name: "TargetTypeValue", type: "Uint" },
  0x23ca: { name: "TargetType", type: "String" },
  0x23c5: { name: "TagTrackUID", type: "Uint" },
  0x23c9: { name: "TagEditionUID", type: "Uint" },
  0x23c4: { name: "TagChapterUID", type: "Uint" },
  0x23c6: { name: "TagAttachmentUID", type: "Uint" },
  0x27c8: { name: "SimpleTag", type: "Container" },
  0x5a3: { name: "TagName", type: "String" },
  0x47a: { name: "TagLanguage", type: "String" },
  0x484: { name: "TagDefault", type: "Uint" },
  0x487: { name: "TagString", type: "String" },
  0x485: { name: "TagBinary", type: "Binary" },
};

class WebmBase {
  source;
  data;

  constructor(name = "Unknown", type = "Unknown") {}

  updateBySource() {}

  setSource(source) {
    this.source = source;
    this.updateBySource();
  }

  updateByData() {}

  setData(data) {
    this.data = data;
    this.updateByData();
  }
}

class WebmUint extends WebmBase {
  constructor(name, type) {
    super(name, type || "Uint");
  }

  updateBySource() {
    // use hex representation of a number instead of number value
    this.data = "";
    for (let i = 0; i < this.source.length; i++) {
      const hex = this.source[i].toString(16);
      this.data += padHex(hex);
    }
  }

  updateByData() {
    const length = this.data.length / 2;
    this.source = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      const hex = this.data.substr(i * 2, 2);
      this.source[i] = parseInt(hex, 16);
    }
  }

  getValue() {
    return parseInt(this.data, 16);
  }

  setValue(value) {
    this.setData(padHex(value.toString(16)));
  }
}

function padHex(hex) {
  return hex.length % 2 === 1 ? "0" + hex : hex;
}

class WebmFloat extends WebmBase {
  constructor(name, type) {
    super(name, type || "Float");
  }

  getFloatArrayType() {
    return this.source && this.source.length === 4
      ? Float32Array
      : Float64Array;
  }
  updateBySource() {
    const byteArray = this.source.reverse();
    const floatArrayType = this.getFloatArrayType();
    const floatArray = new floatArrayType(byteArray.buffer);
    this.data = floatArray[0];
  }
  updateByData() {
    const floatArrayType = this.getFloatArrayType();
    const floatArray = new floatArrayType([this.data]);
    const byteArray = new Uint8Array(floatArray.buffer);
    this.source = byteArray.reverse();
  }
  getValue() {
    return this.data;
  }
  setValue(value) {
    this.setData(value);
  }
}

class WebmContainer extends WebmBase {
  offset = 0;
  data = [];

  constructor(name, type) {
    super(name, type || "Container");
  }

  readByte() {
    return this.source[this.offset++];
  }
  readUint() {
    const firstByte = this.readByte();
    const bytes = 8 - firstByte.toString(2).length;
    let value = firstByte - (1 << (7 - bytes));
    for (let i = 0; i < bytes; i++) {
      // don't use bit operators to support x86
      value *= 256;
      value += this.readByte();
    }
    return value;
  }
  updateBySource() {
    let end = undefined;
    this.data = [];
    for (this.offset = 0; this.offset < this.source.length; this.offset = end) {
      const id = this.readUint();
      const len = this.readUint();
      end = Math.min(this.offset + len, this.source.length);
      const data = this.source.slice(this.offset, end);

      const info = sections[id] || { name: "Unknown", type: "Unknown" };
      let ctr = WebmBase;
      switch (info.type) {
        case "Container":
          ctr = WebmContainer;
          break;
        case "Uint":
          ctr = WebmUint;
          break;
        case "Float":
          ctr = WebmFloat;
          break;
      }
      const section = new ctr(info.name, info.type);
      section.setSource(data);
      this.data.push({
        id: id,
        idHex: id.toString(16),
        data: section,
      });
    }
  }
  writeUint(x, draft = false) {
    for (
      var bytes = 1, flag = 0x80;
      x >= flag && bytes < 8;
      bytes++, flag *= 0x80
    ) {}

    if (!draft) {
      let value = flag + x;
      for (let i = bytes - 1; i >= 0; i--) {
        // don't use bit operators to support x86
        const c = value % 256;
        this.source[this.offset + i] = c;
        value = (value - c) / 256;
      }
    }

    this.offset += bytes;
  }

  writeSections(draft = false) {
    this.offset = 0;
    for (let i = 0; i < this.data.length; i++) {
      const section = this.data[i],
        content = section.data.source,
        contentLength = content.length;
      this.writeUint(section.id, draft);
      this.writeUint(contentLength, draft);
      if (!draft) {
        this.source?.set(content, this.offset);
      }
      this.offset += contentLength;
    }
    return this.offset;
  }

  updateByData() {
    // run without accessing this.source to determine total length - need to know it to create Uint8Array
    const length = this.writeSections(true);
    this.source = new Uint8Array(length);
    // now really write data
    this.writeSections();
  }

  getSectionById(id) {
    for (let i = 0; i < this.data.length; i++) {
      const section = this.data[i];
      if (section.id === id) {
        return section.data;
      }
    }

    return undefined;
  }
}

class WebmFile extends WebmContainer {
  constructor(source) {
    super("File", "File");
    this.setSource(source);
  }

  fixDuration(duration) {
    const segmentSection = this.getSectionById(0x8538067);
    if (!segmentSection) {
      return false;
    }

    const infoSection = segmentSection.getSectionById(0x549a966);
    if (!infoSection) {
      return false;
    }

    const timeScaleSection = infoSection.getSectionById(0xad7b1);
    if (!timeScaleSection) {
      return false;
    }

    let durationSection = infoSection.getSectionById(0x489);
    if (durationSection) {
      if (durationSection.getValue() <= 0) {
        durationSection.setValue(duration);
      } else {
        return false;
      }
    } else {
      // append Duration section
      durationSection = new WebmFloat("Duration", "Float");
      durationSection.setValue(duration);
      infoSection.data.push({
        id: 0x489,
        data: durationSection,
      });
    }

    // set default time scale to 1 millisecond (1000000 nanoseconds)
    timeScaleSection.setValue(1000000);
    infoSection.updateByData();
    segmentSection.updateByData();
    this.updateByData();

    return true;
  }

  toBlob(type = "video/webm") {
    return new Blob([this.source?.buffer], { type });
  }
}

/**
 * Fixes duration on MediaRecorder output.
 * @param blob Input Blob with incorrect duration.
 * @param duration Correct duration (in milliseconds).
 * @param type Output blob mimetype (default: video/webm).
 * @returns
 */
export const webmFixDuration = (blob, duration, type = "video/webm") => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();

      reader.addEventListener("loadend", () => {
        try {
          const result = reader.result;
          const file = new WebmFile(new Uint8Array(result));
          if (file.fixDuration(duration)) {
            resolve(file.toBlob(type));
          } else {
            resolve(blob);
          }
        } catch (ex) {
          reject(ex);
        }
      });

      reader.addEventListener("error", () => reject());

      reader.readAsArrayBuffer(blob);
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * Appends a blob URL object to the body of the document.
 * @param {string} blobURL
 */
export function debugAudioBlobUrl(blobURL) {
  const audioEl = document.createElement("audio");
  audioEl.src = blobURL;
  audioEl.controls = "true";
  document.querySelector("body").appendChild(audioEl);
}

/**
 * Get supported Mimes for MediaRecorder
 * @returns {("audio/webm"|"audio/mp4"|"audio/ogg"| "audio/wav"|"audio/aac")|undefined}
 */
export function getMimeType() {
  const types = [
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) {
      return types[i];
    }
  }
  return undefined;
}
