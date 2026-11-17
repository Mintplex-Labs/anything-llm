/**
 * Bakes a recorded slide (see createPreviewer in render.js) into a JPEG for
 * the chat UI's progress row, so the deck's progress shows as plain images
 * that no page style or theme can touch. Shapes, text, tables and charts
 * come from the same drawing code as the .pptx, so the image matches the
 * file.
 *
 * The slide is written as SVG and rasterized by sharp, which the server
 * already loads for local embeddings. sharp and node-canvas bundle
 * different builds of the same GLib DLLs, so on Windows whichever loads
 * second fails; using sharp alone avoids that. SVG does not wrap text, so
 * lines are broken here with the same average-glyph-width estimate the
 * renderer sizes text with.
 */

const { GLYPH_W } = require("./render.js");

const FRAME_W = 1920;
const FRAME_H = 1080;
// Large enough for the chat's lightbox; the row shows it scaled down.
const THUMB_W = 1024;
const JPEG_QUALITY = 80;
const LINE_H = 1.2;
// Aptos where it is installed; Liberation Sans ships in the Docker image.
const FONTS = {
  body: "Aptos, 'Segoe UI', 'Liberation Sans', Arial, sans-serif",
  heading:
    "'Aptos Display', Aptos, 'Segoe UI', 'Liberation Sans', Arial, sans-serif",
};

const hex = (color, fallback = "#000000") => (color ? `#${color}` : fallback);
const num = (n) => Math.round(n * 10) / 10;
const escape = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const textWidth = (text, size, bold) =>
  text.length * size * GLYPH_W[bold ? "bold" : "regular"];

function shape(item) {
  const fill = item.fill
    ? `fill="${hex(item.fill)}" fill-opacity="${item.opacity ?? 1}"`
    : 'fill="none"';
  const stroke = item.line
    ? ` stroke="${hex(item.line)}" stroke-width="2"`
    : "";
  if (item.kind === "ellipse")
    return `<ellipse cx="${num(item.x + item.w / 2)}" cy="${num(item.y + item.h / 2)}" rx="${num(item.w / 2)}" ry="${num(item.h / 2)}" ${fill}${stroke}/>`;
  const r = Math.max(0, Math.min(item.radius || 0, item.w / 2, item.h / 2));
  return `<rect x="${num(item.x)}" y="${num(item.y)}" width="${num(item.w)}" height="${num(item.h)}" rx="${num(r)}" ${fill}${stroke}/>`;
}

/**
 * Wraps runs of differently styled text into lines no wider than `width`,
 * breaking between words.
 * @returns {{text: string, bold: boolean, color: string, width: number}[][]}
 */
function wrapRuns(runs, width, item) {
  const lines = [[]];
  let used = 0;
  for (const run of runs) {
    const bold = run.bold ?? item.bold;
    const color = hex(run.color || item.color);
    for (const part of String(run.text).split(/(\s+)/)) {
      if (!part) continue;
      const space = /^\s+$/.test(part);
      if (space && used === 0) continue;
      const partWidth = textWidth(space ? " " : part, item.size, bold);
      if (!space && used > 0 && used + partWidth > width) {
        lines.push([]);
        used = 0;
      }
      lines[lines.length - 1].push({
        text: space ? " " : part,
        bold,
        color,
        width: partWidth,
      });
      used += partWidth;
    }
  }
  return lines.map((line) => {
    while (line.length && line[line.length - 1].text === " ") line.pop();
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

function text(item) {
  const lineH = item.size * LINE_H;
  const blocks = paragraphsOf(item.runs).map((runs) => {
    const indent = runs[0]?.bullet || 0;
    return {
      indent,
      gap: runs[0]?.gap || 0,
      bulletColor: hex(runs[0]?.color || item.color),
      lines: wrapRuns(runs, item.w - indent, item),
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
  const family = item.heading ? FONTS.heading : FONTS.body;
  const style = `font-family="${family}" font-size="${num(item.size)}"${item.italic ? ' font-style="italic"' : ""}`;
  const parts = [];
  for (const block of blocks) {
    if (block.indent) {
      const mark = item.size * 0.3;
      parts.push(
        `<rect x="${num(item.x)}" y="${num(y + lineH / 2 - mark / 2)}" width="${num(mark)}" height="${num(mark)}" fill="${block.bulletColor}"/>`
      );
    }
    for (const line of block.lines) {
      const left = item.x + block.indent;
      const room = item.w - block.indent;
      const [x, anchor] =
        item.align === "center"
          ? [left + room / 2, "middle"]
          : item.align === "right"
            ? [left + room, "end"]
            : [left, "start"];
      // The baseline sits a little below the middle of the line.
      const baseline = y + lineH / 2 + item.size * 0.35;
      const spans = line
        .map(
          (seg) =>
            `<tspan font-weight="${seg.bold ? 700 : 400}" fill="${seg.color}">${escape(seg.text)}</tspan>`
        )
        .join("");
      parts.push(
        `<text x="${num(x)}" y="${num(baseline)}" text-anchor="${anchor}" xml:space="preserve" ${style}>${spans}</text>`
      );
      y += lineH;
    }
    y += block.gap;
  }
  return `<g opacity="${item.opacity ?? 1}">${parts.join("")}</g>`;
}

function table(item) {
  const [padY, padX] = item.pad;
  const parts = [];
  let y = item.y;
  item.cells.forEach((row, r) => {
    const h = item.rowH[r];
    let x = item.x;
    row.forEach((cell, c) => {
      const w = item.colW[c];
      if (cell.fill)
        parts.push(
          `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" fill="${hex(cell.fill)}"/>`
        );
      parts.push(
        text({
          x: x + padX,
          y: y + padY,
          w: w - 2 * padX,
          h: h - 2 * padY,
          size: item.size,
          bold: cell.bold,
          color: cell.color,
          valign: "middle",
          runs: [{ text: cell.text }],
        })
      );
      x += w;
    });
    y += h;
  });
  return parts.join("");
}

/** A plain drawing of the chart: enough to recognize it in a thumbnail. */
function chart(item, background) {
  const { x, y, w, h, values, colors = [] } = item;
  const color = (i) => hex(colors[i % colors.length], "#64748b");

  if (item.type === "pie" || item.type === "doughnut") {
    const total = values.reduce((sum, v) => sum + Math.max(0, v), 0) || 1;
    const radius = Math.min(w, h) * 0.4;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const point = (angle) =>
      `${num(cx + radius * Math.cos(angle))} ${num(cy + radius * Math.sin(angle))}`;
    let start = -Math.PI / 2;
    const slices = values.map((v, i) => {
      const sweep = (Math.max(0, v) / total) * Math.PI * 2;
      const end = start + sweep;
      const slice =
        sweep >= Math.PI * 2 - 1e-6
          ? `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(radius)}" fill="${color(i)}"/>`
          : `<path d="M ${num(cx)} ${num(cy)} L ${point(start)} A ${num(radius)} ${num(radius)} 0 ${sweep > Math.PI ? 1 : 0} 1 ${point(end)} Z" fill="${color(i)}"/>`;
      start = end;
      return slice;
    });
    if (item.type === "doughnut")
      slices.push(
        `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(radius * 0.55)}" fill="${hex(background, "#ffffff")}"/>`
      );
    return slices.join("");
  }

  const pad = 60;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const valueY = (v) => y + pad + (h - 2 * pad) * (1 - (v - min) / range);
  const step = (w - 2 * pad) / values.length;
  if (item.type === "bar")
    return values
      .map((v, i) =>
        shape({
          kind: "roundRect",
          x: x + pad + i * step + step * 0.15,
          y: Math.min(valueY(v), valueY(0)),
          w: step * 0.7,
          h: Math.abs(valueY(0) - valueY(v)),
          radius: 6,
          fill: colors[i % colors.length] || "64748b",
        })
      )
      .join("");
  const points = values
    .map((v, i) => `${num(x + pad + i * step + step / 2)},${num(valueY(v))}`)
    .join(" ");
  return `<polyline points="${points}" fill="none" stroke="${color(0)}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>`;
}

/** A picture: "cover" crops it to its frame, "fill" stretches it to it. */
function image(item) {
  const aspect = item.fit === "cover" ? "xMidYMid slice" : "none";
  const id = `clip${Math.round(item.x)}_${Math.round(item.y)}`;
  return `<clipPath id="${id}"><rect x="${num(item.x)}" y="${num(item.y)}" width="${num(item.w)}" height="${num(item.h)}"/></clipPath><image clip-path="url(#${id})" x="${num(item.x)}" y="${num(item.y)}" width="${num(item.w)}" height="${num(item.h)}" preserveAspectRatio="${aspect}" href="${escape(item.data)}"/>`;
}

/**
 * A recorded slide as SVG markup in the 1920 × 1080 frame.
 * @param {{background: string, items: object[]}} slide - From createPreviewer
 * @returns {string}
 */
function slideSvg(slide) {
  const body = slide.items
    .map((item) =>
      item.kind === "text"
        ? text(item)
        : item.kind === "table"
          ? table(item)
          : item.kind === "chart"
            ? chart(item, slide.background)
            : item.kind === "image"
              ? image(item)
              : shape(item)
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${FRAME_W}" height="${FRAME_H}" viewBox="0 0 ${FRAME_W} ${FRAME_H}"><rect width="${FRAME_W}" height="${FRAME_H}" fill="${hex(slide.background, "#ffffff")}"/>${body}</svg>`;
}

/**
 * A recorded slide as a JPEG data URL.
 * @param {{background: string, items: object[]}} slide - From createPreviewer
 * @returns {Promise<string>} `data:image/jpeg;base64,...`
 */
async function slideThumbnail(slide) {
  const sharp = require("sharp");
  const jpeg = await sharp(Buffer.from(slideSvg(slide)))
    .resize(THUMB_W)
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

module.exports = { slideThumbnail, slideSvg };
