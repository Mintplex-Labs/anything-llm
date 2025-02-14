/**
 * This is a factory for creating a canvas and context in Node.js
 * it is used to create a canvas and context for the PDFLoader for turning the PDF into an image
 * so we can later use the image to extract text from the PDF.
 */
class NodeCanvasFactory {
  constructor() {
    this.CanvasModule = null;
  }

  async init() {
    this.CanvasModule = await import("canvas");
    this.Image = this.CanvasModule.Image;
  }

  /**
   * Creates a canvas and context for the PDFLoader
   * @param {number} width - The width of the canvas
   * @param {number} height - The height of the canvas
   * @param {boolean} transparent - Whether the canvas is transparent
   * @returns {{canvas: HTMLCanvasElement, context: CanvasRenderingContext2D}} - The canvas and context
   */
  create(width, height, transparent = false) {
    const canvas = this.CanvasModule.createCanvas(width, height);
    const context = canvas.getContext("2d", { alpha: transparent });
    if (transparent) context.clearRect(0, 0, width, height);
    return {
      canvas,
      context,
    };
  }

  /**
   * Required for the PDFLoader pdfjs interation - do not remove or use directly.
   */
  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  /**
   * Required for the PDFLoader pdfjs interation - do not remove or use directly.
   */
  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

module.exports = NodeCanvasFactory;
