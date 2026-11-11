/**
 * Bakes a recorded slide (see createPreviewer in render.js) into a small JPEG
 * with node-canvas, so the chat UI can show the deck's progress as plain
 * images that no page style or theme can touch. Shapes, text, tables and
 * charts come from the same drawing code as the .pptx, so the thumbnail
 * matches the file; text is wrapped with the canvas's own font metrics.
 */

const FRAME_W = 1920;
const FRAME_H = 1080;
// Large enough for the chat's lightbox; the row shows it scaled down.
const THUMB_W = 1024;
const JPEG_QUALITY = 0.8;
const LINE_H = 1.2;
// Aptos where it is installed; Liberation Sans ships in the Docker image.
const FONTS = {
  body: 'Aptos, "Segoe UI", "Liberation Sans", Arial, sans-serif',
  heading:
    '"Aptos Display", Aptos, "Segoe UI", "Liberation Sans", Arial, sans-serif',
};

const hex = (color, fallback = "#000000") => (color ? `#${color}` : fallback);

function fontOf({ size, heading, italic }, bold) {
  return `${italic ? "italic " : ""}${bold ? "bold " : ""}${size}px ${heading ? FONTS.heading : FONTS.body}`;
}

/** Rectangle, rounded rectangle or ellipse path. */
function shapePath(ctx, { kind, x, y, w, h, radius = 0 }) {
  ctx.beginPath();
  if (kind === "ellipse") {
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
    return;
  }
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawShape(ctx, item) {
  shapePath(ctx, item);
  ctx.globalAlpha = item.opacity ?? 1;
  if (item.fill) {
    ctx.fillStyle = hex(item.fill);
    ctx.fill();
  }
  if (item.line) {
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.strokeStyle = hex(item.line);
    ctx.stroke();
  }
}

/**
 * Wraps runs of differently styled text into lines no wider than `width`,
 * breaking between words.
 * @returns {{text: string, font: string, color: string, width: number}[][]}
 */
function wrapRuns(ctx, runs, width, item) {
  const lines = [[]];
  let used = 0;
  for (const run of runs) {
    const font = fontOf(item, run.bold ?? item.bold);
    const color = hex(run.color || item.color);
    ctx.font = font;
    for (const part of String(run.text).split(/(\s+)/)) {
      if (!part) continue;
      const space = /^\s+$/.test(part);
      if (space && used === 0) continue;
      const partWidth = ctx.measureText(part).width;
      if (!space && used > 0 && used + partWidth > width) {
        lines.push([]);
        used = 0;
      }
      lines[lines.length - 1].push({
        text: part,
        font,
        color,
        width: partWidth,
      });
      used += partWidth;
    }
  }
  return lines.map((line) => {
    while (line.length && /^\s+$/.test(line[line.length - 1].text)) line.pop();
    return line;
  });
}

/** Runs grouped into paragraphs, which end at a run with breakLine. */
function paragraphsOf(runs) {
  const paragraphs = [[]];
  runs.forEach((run, i) => {
    paragraphs[paragraphs.length - 1].push(run);
    if (run.breakLine && i < runs.length - 1) paragraphs.push([]);
  });
  return paragraphs;
}

function drawText(ctx, item) {
  const lineH = item.size * LINE_H;
  const blocks = paragraphsOf(item.runs).map((runs) => {
    const indent = runs[0]?.bullet || 0;
    return {
      indent,
      gap: runs[0]?.gap || 0,
      bulletColor: hex(runs[0]?.color || item.color),
      lines: wrapRuns(ctx, runs, item.w - indent, item),
    };
  });
  const height = blocks.reduce(
    (sum, b) => sum + b.lines.length * lineH + b.gap,
    0
  );
  let y =
    item.valign === "bottom"
      ? item.y + item.h - height
      : item.valign === "middle"
        ? item.y + (item.h - height) / 2
        : item.y;

  ctx.globalAlpha = item.opacity ?? 1;
  ctx.textBaseline = "middle";
  for (const block of blocks) {
    if (block.indent) {
      const mark = item.size * 0.3;
      ctx.fillStyle = block.bulletColor;
      ctx.fillRect(item.x, y + lineH / 2 - mark / 2, mark, mark);
    }
    for (const line of block.lines) {
      const lineWidth = line.reduce((sum, seg) => sum + seg.width, 0);
      const room = item.w - block.indent;
      let x =
        item.x +
        block.indent +
        (item.align === "center"
          ? (room - lineWidth) / 2
          : item.align === "right"
            ? room - lineWidth
            : 0);
      for (const seg of line) {
        ctx.font = seg.font;
        ctx.fillStyle = seg.color;
        ctx.fillText(seg.text, x, y + lineH / 2);
        x += seg.width;
      }
      y += lineH;
    }
    y += block.gap;
  }
}

function drawTable(ctx, item) {
  const [padY, padX] = item.pad;
  let y = item.y;
  item.cells.forEach((row, r) => {
    const h = item.rowH[r];
    let x = item.x;
    row.forEach((cell, c) => {
      const w = item.colW[c];
      if (cell.fill) {
        ctx.fillStyle = hex(cell.fill);
        ctx.fillRect(x, y, w, h);
      }
      drawText(ctx, {
        x: x + padX,
        y: y + padY,
        w: w - 2 * padX,
        h: h - 2 * padY,
        size: item.size,
        bold: cell.bold,
        color: cell.color,
        valign: "middle",
        runs: [{ text: cell.text }],
      });
      x += w;
    });
    y += h;
  });
}

/** A plain drawing of the chart: enough to recognize it in a thumbnail. */
function drawChart(ctx, item) {
  const { x, y, w, h, values, colors = [] } = item;
  const color = (i) => hex(colors[i % colors.length], "#64748b");

  if (item.type === "pie" || item.type === "doughnut") {
    const total = values.reduce((sum, v) => sum + Math.max(0, v), 0) || 1;
    const radius = Math.min(w, h) * 0.4;
    const cx = x + w / 2;
    const cy = y + h / 2;
    let start = -Math.PI / 2;
    values.forEach((v, i) => {
      const end = start + (Math.max(0, v) / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = color(i);
      ctx.fill();
      start = end;
    });
    if (item.type === "doughnut") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  const pad = 60;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const valueY = (v) => y + pad + (h - 2 * pad) * (1 - (v - min) / range);
  const step = (w - 2 * pad) / values.length;
  if (item.type === "bar") {
    values.forEach((v, i) => {
      shapePath(ctx, {
        kind: "roundRect",
        x: x + pad + i * step + step * 0.15,
        y: Math.min(valueY(v), valueY(0)),
        w: step * 0.7,
        h: Math.abs(valueY(0) - valueY(v)),
        radius: 6,
      });
      ctx.fillStyle = color(i);
      ctx.fill();
    });
    return;
  }
  ctx.beginPath();
  values.forEach((v, i) => {
    const px = x + pad + i * step + step / 2;
    if (i === 0) ctx.moveTo(px, valueY(v));
    else ctx.lineTo(px, valueY(v));
  });
  ctx.strokeStyle = color(0);
  ctx.lineWidth = 8;
  ctx.lineJoin = "round";
  ctx.stroke();
}

const DRAW = {
  text: drawText,
  table: drawTable,
  chart: drawChart,
};

/**
 * A recorded slide as a JPEG data URL.
 * @param {{background: string, items: object[]}} slide - From createPreviewer
 * @returns {string} `data:image/jpeg;base64,...`
 */
function slideThumbnail(slide) {
  const { createCanvas } = require("canvas");
  const scale = THUMB_W / FRAME_W;
  const canvas = createCanvas(THUMB_W, Math.round(FRAME_H * scale));
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);
  ctx.fillStyle = hex(slide.background, "#ffffff");
  ctx.fillRect(0, 0, FRAME_W, FRAME_H);
  for (const item of slide.items) {
    ctx.save();
    (DRAW[item.kind] || drawShape)(ctx, item);
    ctx.restore();
  }
  const jpeg = canvas.toBuffer("image/jpeg", { quality: JPEG_QUALITY });
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

module.exports = { slideThumbnail };
