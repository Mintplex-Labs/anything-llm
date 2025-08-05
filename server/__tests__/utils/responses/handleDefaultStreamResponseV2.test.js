/* eslint-env jest */
const { EventEmitter } = require('events');
const { handleDefaultStreamResponseV2 } = require('../../../utils/helpers/chat/responses');

class MockResponse extends EventEmitter {
  constructor() {
    super();
    this.write = jest.fn();
  }
}

function createStream() {
  return {
    [Symbol.asyncIterator]: async function* () {
      await new Promise(() => {});
    },
    endMeasurement: jest.fn(),
  };
}

describe('handleDefaultStreamResponseV2', () => {
  test('cleans up close listeners after aborted requests', async () => {
    const response = new MockResponse();

    const firstStream = createStream();
    const firstPromise = handleDefaultStreamResponseV2(response, firstStream, {});
    expect(response.listenerCount('close')).toBe(1);
    response.emit('close');
    await firstPromise;
    expect(response.listenerCount('close')).toBe(0);

    const secondStream = createStream();
    const secondPromise = handleDefaultStreamResponseV2(response, secondStream, {});
    expect(response.listenerCount('close')).toBe(1);
    response.emit('close');
    await secondPromise;
    expect(response.listenerCount('close')).toBe(0);
  });
});
