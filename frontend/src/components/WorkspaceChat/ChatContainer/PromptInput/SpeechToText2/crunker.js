/**
 * @typedef {Object} CrunkerConstructorOptions
 * @property {number} [sampleRate=44100] - Sample rate for Crunker's internal audio context.
 * @property {number} [concurrentNetworkRequests=200] - Maximum number of concurrent network requests to use while fetching audio.
 */

/**
 * @typedef {string|File|Blob} CrunkerInputTypes
 */

/**
 * @typedef {Object} ExportedCrunkerAudio
 * @property {Blob} blob - The audio data as a Blob.
 * @property {string} url - The URL of the audio data.
 * @property {HTMLAudioElement} element - An audio element containing the audio data.
 */

/**
 * Crunker is the simple way to merge, concatenate, play, export and download audio files using the Web Audio API.
 */
export default class Crunker {
  /**
   * Creates a new instance of Crunker with the provided options.
   *
   * If `sampleRate` is not defined, it will auto-select an appropriate sample rate
   * for the device being used.
   * @param {Partial<CrunkerConstructorOptions>} [options={}]
   */
  constructor({ sampleRate, concurrentNetworkRequests = 200 } = {}) {
    this._context = this._createContext(sampleRate);
    this._sampleRate = sampleRate || this._context.sampleRate;
    this._concurrentNetworkRequests = concurrentNetworkRequests;
  }

  /**
   * Creates Crunker's internal AudioContext.
   * @param {number} [sampleRate=44100]
   * @returns {AudioContext}
   * @private
   */
  _createContext(sampleRate = 44100) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    return new AudioContext({ sampleRate });
  }

  /**
   * The internal AudioContext used by Crunker.
   * @returns {AudioContext}
   */
  get context() {
    return this._context;
  }

  /**
   * Asynchronously fetches multiple audio files and returns an array of AudioBuffers.
   *
   * Network requests are batched, and the size of these batches can be configured with the `concurrentNetworkRequests` option in the Crunker constructor.
   * @param {...CrunkerInputTypes} filepaths
   * @returns {Promise<AudioBuffer[]>}
   */
  async fetchAudio(...filepaths) {
    const buffers = [];
    const groups = Math.ceil(filepaths.length / this._concurrentNetworkRequests);

    for (let i = 0; i < groups; i++) {
      const group = filepaths.slice(i * this._concurrentNetworkRequests, (i + 1) * this._concurrentNetworkRequests);
      buffers.push(...(await this._fetchAudio(...group)));
    }

    return buffers;
  }

  /**
   * Asynchronously fetches multiple audio files and returns an array of AudioBuffers.
   * @param {...CrunkerInputTypes} filepaths
   * @returns {Promise<AudioBuffer[]>}
   * @private
   */
  async _fetchAudio(...filepaths) {
    return await Promise.all(
      filepaths.map(async (filepath) => {
        let buffer;

        if (filepath instanceof File || filepath instanceof Blob) {
          buffer = await filepath.arrayBuffer();
        } else {
          buffer = await fetch(filepath).then((response) => {
            if (response.headers.has('Content-Type') && !response.headers.get('Content-Type').includes('audio/')) {
              console.warn(
                `Crunker: Attempted to fetch an audio file, but its MIME type is \`${response.headers.get('Content-Type').split(';')[0]
                }\`. We'll try and continue anyway. (file: "${filepath}")`
              );
            }

            return response.arrayBuffer();
          });
        }

        return await this._context.decodeAudioData(buffer);
      })
    );
  }

  /**
   * Merges (layers) multiple AudioBuffers into a single AudioBuffer.
   * @param {AudioBuffer[]} buffers
   * @returns {AudioBuffer}
   */
  mergeAudio(buffers) {
    const output = this._context.createBuffer(
      this._maxNumberOfChannels(buffers),
      this._sampleRate * this._maxDuration(buffers),
      this._sampleRate
    );

    buffers.forEach((buffer) => {
      for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
        const outputData = output.getChannelData(channelNumber);
        const bufferData = buffer.getChannelData(channelNumber);

        for (let i = buffer.getChannelData(channelNumber).length - 1; i >= 0; i--) {
          outputData[i] += bufferData[i];
        }

        output.getChannelData(channelNumber).set(outputData);
      }
    });

    return output;
  }

  /**
   * Concat many audio blobs into one long blob
   * @param {Blob} audioBlobs 
   */
  async concatAudioBlobs(audioBlobs) {
    const arrayBuffers = await Promise.all(
      audioBlobs.map(blob => blob.arrayBuffer())
    );
    const audioBuffers = await Promise.all(
      arrayBuffers.map(buffer => new AudioContext({ sampleRate: this._sampleRate }).decodeAudioData(buffer))
    );
    const mergedAudioBuffer = this.concatAudio(audioBuffers);
    return this.export(mergedAudioBuffer, audioBlobs[0].type)
  }


  /**
   * Concatenates multiple AudioBuffers into a single AudioBuffer.
   * @param {AudioBuffer[]} buffers
   * @returns {AudioBuffer}
   */
  concatAudio(buffers) {
    const output = this._context.createBuffer(
      this._maxNumberOfChannels(buffers),
      this._totalLength(buffers),
      this._sampleRate
    );
    let offset = 0;

    buffers.forEach((buffer) => {
      for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
        output.getChannelData(channelNumber).set(buffer.getChannelData(channelNumber), offset);
      }

      offset += buffer.length;
    });

    return output;
  }

  /**
   * Pads a specified AudioBuffer with silence from a specified start time,
   * for a specified length of time.
   *
   * Accepts float values as well as whole integers.
   * @param {AudioBuffer} buffer - AudioBuffer to pad
   * @param {number} [padStart=0] - Time to start padding (in seconds)
   * @param {number} [seconds=0] - Duration to pad for (in seconds)
   * @returns {AudioBuffer}
   */
  padAudio(buffer, padStart = 0, seconds = 0) {
    if (seconds === 0) return buffer;

    if (padStart < 0) throw new Error('Crunker: Parameter "padStart" in padAudio must be positive');
    if (seconds < 0) throw new Error('Crunker: Parameter "seconds" in padAudio must be positive');

    const updatedBuffer = this._context.createBuffer(
      buffer.numberOfChannels,
      Math.ceil(buffer.length + seconds * buffer.sampleRate),
      buffer.sampleRate
    );

    for (let channelNumber = 0; channelNumber < buffer.numberOfChannels; channelNumber++) {
      const channelData = buffer.getChannelData(channelNumber);
      updatedBuffer
        .getChannelData(channelNumber)
        .set(channelData.subarray(0, Math.ceil(padStart * buffer.sampleRate) + 1), 0);

      updatedBuffer
        .getChannelData(channelNumber)
        .set(
          channelData.subarray(Math.ceil(padStart * buffer.sampleRate) + 2, updatedBuffer.length + 1),
          Math.ceil((padStart + seconds) * buffer.sampleRate)
        );
    }

    return updatedBuffer;
  }

  /**
   * Slices an AudioBuffer from the specified start time to the end time, with optional fade in and out.
   * @param {AudioBuffer} buffer - AudioBuffer to slice
   * @param {number} start - Start time (in seconds)
   * @param {number} end - End time (in seconds)
   * @param {number} [fadeIn=0] - Fade in duration (in seconds)
   * @param {number} [fadeOut=0] - Fade out duration (in seconds)
   * @returns {AudioBuffer}
   */
  sliceAudio(buffer, start, end, fadeIn = 0, fadeOut = 0) {
    if (start >= end) throw new Error('Crunker: "start" time should be less than "end" time in sliceAudio method');

    const length = Math.round((end - start) * this._sampleRate);
    const offset = Math.round(start * this._sampleRate);
    const newBuffer = this._context.createBuffer(buffer.numberOfChannels, length, this._sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel);
      const outputData = newBuffer.getChannelData(channel);

      for (let i = 0; i < length; i++) {
        outputData[i] = inputData[offset + i];

        // Apply fade in
        if (i < fadeIn * this._sampleRate) {
          outputData[i] *= i / (fadeIn * this._sampleRate);
        }

        // Apply fade out
        if (i > length - fadeOut * this._sampleRate) {
          outputData[i] *= (length - i) / (fadeOut * this._sampleRate);
        }
      }
    }

    return newBuffer;
  }

  /**
   * Plays the provided AudioBuffer in an AudioBufferSourceNode.
   * @param {AudioBuffer} buffer
   * @returns {AudioBufferSourceNode}
   */
  play(buffer) {
    const source = this._context.createBufferSource();

    source.buffer = buffer;
    source.connect(this._context.destination);
    source.start();

    return source;
  }

  /**
   * Exports the specified AudioBuffer to a Blob, Object URI and HTMLAudioElement.
   *
   * Note that changing the MIME type does not change the actual file format. The
   * file format will **always** be a WAVE file due to how audio is stored in the
   * browser.
   * @param {AudioBuffer} buffer - Buffer to export
   * @param {string} [type='audio/wav'] - MIME type
   * @returns {Blob}
   */
  export(buffer, type = 'audio/wav') {
    const recorded = this._interleave(buffer);
    const dataview = this._writeHeaders(recorded, buffer.numberOfChannels, buffer.sampleRate);
    const audioBlob = new Blob([dataview], { type });

    return audioBlob;
  }

  /**
   * Downloads the provided Blob.
   * @param {Blob} blob - Blob to download
   * @param {string} [filename='crunker'] - An optional file name to use for the download
   * @returns {HTMLAnchorElement}
   */
  download(blob, filename = 'crunker') {
    const a = document.createElement('a');

    a.style.display = 'none';
    a.href = this._renderURL(blob);
    a.download = `${filename}.${blob.type.split('/')[1]}`;
    a.click();

    return a;
  }

  /**
   * Executes a callback if the browser does not support the Web Audio API.
   *
   * Returns the result of the callback, or `undefined` if the Web Audio API is supported.
   * @template T
   * @param {() => T} callback - callback to run if the browser does not support the Web Audio API
   * @returns {T|undefined}
   */
  notSupported(callback) {
    return this._isSupported() ? undefined : callback();
  }

  /**
   * Closes Crunker's internal AudioContext.
   * @returns {this}
   */
  close() {
    this._context.close();
    return this;
  }

  /**
   * Returns the largest duration of the longest AudioBuffer.
   * @param {AudioBuffer[]} buffers
   * @returns {number}
   * @private
   */
  _maxDuration(buffers) {
    return Math.max(...buffers.map((buffer) => buffer.duration));
  }

  /**
   * Returns the largest number of channels in an array of AudioBuffers.
   * @param {AudioBuffer[]} buffers
   * @returns {number}
   * @private
   */
  _maxNumberOfChannels(buffers) {
    return Math.max(...buffers.map((buffer) => buffer.numberOfChannels));
  }

  /**
   * Returns the sum of the lengths of an array of AudioBuffers.
   * @param {AudioBuffer[]} buffers
   * @returns {number}
   * @private
   */
  _totalLength(buffers) {
    return buffers.map((buffer) => buffer.length).reduce((a, b) => a + b, 0);
  }

  /**
   * Returns whether the browser supports the Web Audio API.
   * @returns {boolean}
   * @private
   */
  _isSupported() {
    return 'AudioContext' in window || 'webkitAudioContext' in window || 'mozAudioContext' in window;
  }

  /**
   * Writes the WAV headers for the specified Float32Array.
   *
   * Returns a DataView containing the WAV headers and file content.
   * @param {Float32Array} buffer
   * @param {number} numOfChannels
   * @param {number} sampleRate
   * @returns {DataView}
   * @private
   */
  _writeHeaders(buffer, numOfChannels, sampleRate) {
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const sampleSize = numOfChannels * bytesPerSample;

    const fileHeaderSize = 8;
    const chunkHeaderSize = 36;
    const chunkDataSize = buffer.length * bytesPerSample;
    const chunkTotalSize = chunkHeaderSize + chunkDataSize;

    const arrayBuffer = new ArrayBuffer(fileHeaderSize + chunkTotalSize);
    const view = new DataView(arrayBuffer);

    this._writeString(view, 0, 'RIFF');
    view.setUint32(4, chunkTotalSize, true);
    this._writeString(view, 8, 'WAVE');
    this._writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * sampleSize, true);
    view.setUint16(32, sampleSize, true);
    view.setUint16(34, bitDepth, true);
    this._writeString(view, 36, 'data');
    view.setUint32(40, chunkDataSize, true);

    return this._floatTo16BitPCM(view, buffer, fileHeaderSize + chunkHeaderSize);
  }

  /**
   * Converts a Float32Array to 16-bit PCM.
   * @param {DataView} dataview
   * @param {Float32Array} buffer
   * @param {number} offset
   * @returns {DataView}
   * @private
   */
  _floatTo16BitPCM(dataview, buffer, offset) {
    for (let i = 0; i < buffer.length; i++, offset += 2) {
      const tmp = Math.max(-1, Math.min(1, buffer[i]));
      dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7fff, true);
    }

    return dataview;
  }

  /**
   * Writes a string to a DataView at the specified offset.
   * @param {DataView} dataview
   * @param {number} offset
   * @param {string} header
   * @private
   */
  _writeString(dataview, offset, header) {
    for (let i = 0; i < header.length; i++) {
      dataview.setUint8(offset + i, header.charCodeAt(i));
    }
  }

  /**
   * Converts an AudioBuffer to a Float32Array.
   * @param {AudioBuffer} input
   * @returns {Float32Array}
   * @private
   */
  _interleave(input) {
    if (input.numberOfChannels === 1) {
      return input.getChannelData(0);
    }
    const channels = [];
    for (let i = 0; i < input.numberOfChannels; i++) {
      channels.push(input.getChannelData(i));
    }
    const length = channels.reduce((prev, channelData) => prev + channelData.length, 0);
    const result = new Float32Array(length);

    let index = 0;
    let inputIndex = 0;

    while (index < length) {
      channels.forEach((channelData) => {
        result[index++] = channelData[inputIndex];
      });

      inputIndex++;
    }

    return result;
  }

  /**
   * Creates an HTMLAudioElement whose source is the specified Blob.
   * @param {Blob} blob
   * @returns {HTMLAudioElement}
   * @private
   */
  _renderAudioElement(blob) {
    const audio = document.createElement('audio');

    audio.controls = true;
    audio.src = this._renderURL(blob);

    return audio;
  }

  /**
   * Creates an Object URL for the specified Blob.
   * @param {Blob} blob
   * @returns {string}
   * @private
   */
  _renderURL(blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob);
  }
}