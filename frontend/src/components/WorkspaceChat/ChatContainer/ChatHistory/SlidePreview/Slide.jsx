import { memo } from "react";

// Slides are recorded on the server in px of this frame (see the pptx
// renderer's createPreviewer) and scaled down to fit here.
const FRAME_W = 1920;
const FRAME_H = 1080;
const BODY_FONT = 'Aptos, "Segoe UI", system-ui, sans-serif';
const HEADING_FONT =
  '"Aptos Display", Aptos, "Segoe UI", system-ui, sans-serif';
const VALIGN = { top: "flex-start", middle: "center", bottom: "flex-end" };

const hex = (color) => (color ? `#${color}` : undefined);

/** Text runs grouped into paragraphs, which end at a run with breakLine. */
function paragraphsOf(runs) {
  const paragraphs = [[]];
  runs.forEach((run, i) => {
    paragraphs[paragraphs.length - 1].push(run);
    if (run.breakLine && i < runs.length - 1) paragraphs.push([]);
  });
  return paragraphs;
}

function TextItem({ item }) {
  return (
    <div
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        display: "flex",
        flexDirection: "column",
        justifyContent: VALIGN[item.valign] || "flex-start",
        fontFamily: item.heading ? HEADING_FONT : BODY_FONT,
        fontSize: item.size,
        fontWeight: item.bold ? 700 : 400,
        fontStyle: item.italic ? "italic" : "normal",
        lineHeight: 1.2,
        color: hex(item.color),
        textAlign: item.align,
        opacity: item.opacity,
        overflowWrap: "break-word",
      }}
    >
      {paragraphsOf(item.runs).map((runs, i) => {
        const [first] = runs;
        return (
          <p
            key={i}
            style={{
              margin: 0,
              position: "relative",
              paddingLeft: first?.bullet || 0,
              marginBottom: first?.gap || 0,
            }}
          >
            {first?.bullet ? (
              <span style={{ position: "absolute", left: 0 }}>▪</span>
            ) : null}
            {runs.map((run, j) => (
              <span
                key={j}
                style={{
                  fontWeight:
                    run.bold === undefined ? undefined : run.bold ? 700 : 400,
                  color: hex(run.color),
                }}
              >
                {run.text}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function ShapeItem({ item }) {
  return (
    <div
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        background: hex(item.fill),
        opacity: item.opacity,
        borderRadius: item.kind === "ellipse" ? "50%" : item.radius,
        border: item.line ? `2px solid ${hex(item.line)}` : undefined,
        boxSizing: "border-box",
      }}
    />
  );
}

function TableItem({ item }) {
  const [padY, padX] = item.pad;
  return (
    <div style={{ position: "absolute", left: item.x, top: item.y }}>
      {item.cells.map((row, r) => (
        <div key={r} style={{ display: "flex", height: item.rowH[r] }}>
          {row.map((cell, c) => (
            <div
              key={c}
              style={{
                width: item.colW[c],
                padding: `${padY}px ${padX}px`,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                background: hex(cell.fill),
                color: hex(cell.color),
                fontFamily: BODY_FONT,
                fontSize: item.size,
                fontWeight: cell.bold ? 700 : 400,
                lineHeight: 1.2,
                overflow: "hidden",
              }}
            >
              {cell.text}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** A plain drawing of the chart: enough to recognize it in a thumbnail. */
function ChartItem({ item }) {
  const { w, h, values, colors = [] } = item;
  const color = (i) => hex(colors[i % colors.length]) || "#64748b";
  const box = {
    position: "absolute",
    left: item.x,
    top: item.y,
    width: w,
    height: h,
  };

  if (item.type === "pie" || item.type === "doughnut") {
    const total = values.reduce((sum, v) => sum + Math.max(0, v), 0) || 1;
    let start = 0;
    const stops = values.map((v, i) => {
      const end = start + (Math.max(0, v) / total) * 360;
      const stop = `${color(i)} ${start}deg ${end}deg`;
      start = end;
      return stop;
    });
    const size = Math.min(w, h) * 0.8;
    return (
      <div
        style={{
          ...box,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: `conic-gradient(${stops.join(", ")})`,
            WebkitMask:
              item.type === "doughnut"
                ? "radial-gradient(circle, transparent 45%, #000 46%)"
                : undefined,
            mask:
              item.type === "doughnut"
                ? "radial-gradient(circle, transparent 45%, #000 46%)"
                : undefined,
          }}
        />
      </div>
    );
  }

  const pad = 60;
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const y = (v) => pad + (h - 2 * pad) * (1 - (v - min) / range);
  const step = (w - 2 * pad) / values.length;
  if (item.type === "bar")
    return (
      <svg style={box} viewBox={`0 0 ${w} ${h}`}>
        {values.map((v, i) => (
          <rect
            key={i}
            x={pad + i * step + step * 0.15}
            y={Math.min(y(v), y(0))}
            width={step * 0.7}
            height={Math.abs(y(0) - y(v))}
            fill={color(i)}
            rx={6}
          />
        ))}
      </svg>
    );
  const points = values
    .map((v, i) => `${pad + i * step + step / 2},${y(v)}`)
    .join(" ");
  return (
    <svg style={box} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={points}
        fill="none"
        stroke={color(0)}
        strokeWidth={8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Item({ item }) {
  if (item.kind === "text") return <TextItem item={item} />;
  if (item.kind === "table") return <TableItem item={item} />;
  if (item.kind === "chart") return <ChartItem item={item} />;
  return <ShapeItem item={item} />;
}

/**
 * One slide preview, drawn from the shapes the server recorded and scaled
 * down to `width` px.
 * @param {{slide: {background: string, items: object[]}, width: number}} props
 */
function Slide({ slide, width }) {
  const scale = width / FRAME_W;
  return (
    <div
      style={{
        position: "relative",
        width,
        height: FRAME_H * scale,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: FRAME_W,
          height: FRAME_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: hex(slide.background),
        }}
      >
        {slide.items.map((item, i) => (
          <Item key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default memo(Slide);
