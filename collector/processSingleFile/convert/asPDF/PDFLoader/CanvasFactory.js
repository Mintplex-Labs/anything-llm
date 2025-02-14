
class NodeCanvasFactory {
  constructor() {
    this.Canvas = null;
  }

  async init() {
    this.Canvas = await import("canvas");
    this.Image = this.Canvas.Image;
  }

  create(
    width,
    height,
    transparent
  ) {
    const canvas = this.Canvas.createCanvas(width, height);
    const context = canvas.getContext("2d", { alpha: transparent });
    if (transparent) context.clearRect(0, 0, width, height);
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

module.exports = NodeCanvasFactory;