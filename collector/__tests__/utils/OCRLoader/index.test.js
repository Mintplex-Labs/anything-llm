/* eslint-env jest, node */
const OCRLoader = require("../../../utils/OCRLoader");

describe("toSharpRawInput", () => {
  test("expands packed 1-bit DeviceGray so Sharp gets integer channels", () => {
    const packed = Buffer.from([0b10101010]);
    const raw = OCRLoader.toSharpRawInput({
      width: 8,
      height: 1,
      data: packed,
      kind: 1,
    });
    expect(raw.channels).toBe(1);
    expect(raw.data).toEqual(Buffer.from([255, 0, 255, 0, 255, 0, 255, 0]));
  });

  test("handles widths that are not a multiple of 8 (row padding bits)", () => {
    // width 10 -> rowBytes = 2, last 6 bits of each row are padding.
    // Row 0: 1111111111 (padding 000000), row 1: 0000000000 (padding 111111)
    const packed = Buffer.from([0b11111111, 0b11000000, 0b00000000, 0b00111111]);
    const raw = OCRLoader.toSharpRawInput({
      width: 10,
      height: 2,
      data: packed,
      kind: 1,
    });
    expect(raw.channels).toBe(1);
    expect(raw.data.length).toBe(20);
    expect(raw.data).toEqual(
      Buffer.from([...Array(10).fill(255), ...Array(10).fill(0)])
    );
  });

  test("detects packed 1-bit by buffer length when kind is omitted", () => {
    const width = 2480;
    const height = 2;
    const packed = Buffer.alloc(Math.ceil(width / 8) * height, 0xff);
    const raw = OCRLoader.toSharpRawInput({ width, height, data: packed });
    expect(raw.channels).toBe(1);
    expect(raw.data.length).toBe(width * height);
    expect(raw.data[0]).toBe(255);
  });

  test("passes through 8-bit gray and copies the buffer", () => {
    const data = Buffer.from([1, 2, 3, 4]);
    const raw = OCRLoader.toSharpRawInput({ width: 2, height: 2, data });
    expect(raw.channels).toBe(1);
    data[0] = 99;
    expect(raw.data[0]).toBe(1);
  });

  test("passes through RGB", () => {
    const data = Buffer.alloc(2 * 2 * 3, 128);
    const raw = OCRLoader.toSharpRawInput({ width: 2, height: 2, data });
    expect(raw.channels).toBe(3);
    expect(raw.data.length).toBe(12);
  });

  test("returns null for empty or mismatched buffers", () => {
    expect(OCRLoader.toSharpRawInput(null)).toBeNull();
    expect(
      OCRLoader.toSharpRawInput({
        width: 8,
        height: 1,
        data: Buffer.from([1, 2]),
      })
    ).toBeNull();
  });
});
