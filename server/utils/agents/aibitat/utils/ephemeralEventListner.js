const EventEmitter = require("node:events");
const { writeResponseChunk } = require("../../../helpers/chat/responses");

/**
 * This is a special EventEmitter specifically used in the Aibitat agent handler
 * that enables us to use HTTP to relay all .introspect and .send events back to an
 * http handler instead of websockets, like we do on the frontend. This interface is meant to
 * mock a websocket interface for the methods used and bind them to an HTTP method so that the developer
 * API can invoke agent calls.
 */
class EphemeralEventListener extends EventEmitter {
  messages = [];
  constructor() {
    super();
  }

  send(jsonData) {
    const data = JSON.parse(jsonData);
    this.messages.push(data);
    this.emit("chunk", data);
  }

  close() {
    this.emit("closed");
  }

  /**
   * Compacts all messages in class and returns them in a condensed format.
   * @returns {{thoughts: string[], textResponse: string}}
   */
  packMessages() {
    const thoughts = [];
    let textResponse = null;
    for (let msg of this.messages) {
      if (msg.type !== "statusResponse") {
        textResponse = msg.content;
      } else {
        thoughts.push(msg.content);
      }
    }
    return { thoughts, textResponse };
  }

  /**
   * Waits on the HTTP plugin to emit the 'closed' event from the agentHandler
   * so that we can compact and return all the messages in the current queue.
   * @returns {Promise<{thoughts: string[], textResponse: string}>}
   */
  async waitForClose() {
    return new Promise((resolve) => {
      this.once("closed", () => resolve(this.packMessages()));
    });
  }

  /**
   * Streams the events with `writeResponseChunk` over HTTP chunked encoding
   * and returns on the close event emission.
   * ----------
   * DevNote: Agents do not stream so in here we are simply
   * emitting the thoughts and text response as soon as we get them.
   * @param {import("express").Response} response
   * @param {string} uuid - Unique identifier that is the same across chunks.
   * @returns {Promise<{thoughts: string[], textResponse: string}>}
   */
  async streamAgentEvents(response, uuid) {
    const onChunkHandler = (data) => {
      if (data.type === "statusResponse") {
        return writeResponseChunk(response, {
          id: uuid,
          type: "agentThought",
          thought: data.content,
          sources: [],
          attachments: [],
          close: false,
          error: null,
        });
      }

      return writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse: data.content,
        sources: [],
        attachments: [],
        close: true,
        error: null,
      });
    };
    this.on("chunk", onChunkHandler);

    // Wait for close and after remove chunk listener
    return this.waitForClose().then((closedResponse) => {
      this.removeListener("chunk", onChunkHandler);
      return closedResponse;
    });
  }
}

module.exports.EphemeralEventListener = EphemeralEventListener;
