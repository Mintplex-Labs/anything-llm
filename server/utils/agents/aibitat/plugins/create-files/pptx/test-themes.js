#!/usr/bin/env node
/**
 * Test utility to generate sample presentations for all themes.
 * Run from the server directory: node utils/agents/aibitat/plugins/create-files/pptx/test-themes.js
 *
 * Output goes to: storage/generated-files/theme-previews/
 */

const path = require("path");
const fs = require("fs/promises");
const PptxGenJS = require("pptxgenjs");
const { THEMES, getAvailableThemes } = require("./themes.js");
const { addBranding } = require("./utils.js");

const OUTPUT_DIR = path.resolve(
  __dirname,
  "../../../../../../storage/generated-files/theme-previews"
);

const SAMPLE_SLIDES = [
  {
    layout: "content",
    title: "Introduction",
    content: [
      "Welcome to this presentation",
      "Here are some key points to cover",
      "We'll explore the main topics",
      "Questions are welcome at the end",
    ],
  },
  {
    layout: "section",
    title: "Section Break",
    subtitle: "Moving to the next topic",
  },
  {
    layout: "content",
    title: "Key Benefits",
    content: [
      "Improved efficiency and productivity",
      "Cost savings across the board",
      "Better user experience",
      "Scalable architecture",
    ],
  },
  {
    layout: "content",
    title: "Next Steps",
    content: [
      "Review the proposal",
      "Schedule follow-up meeting",
      "Gather feedback from stakeholders",
    ],
    notes: "Speaker notes appear here",
  },
];

/**
 * Apply layout style decorations to a content slide
 */
function applyLayoutStyle(pptx, slide, theme) {
  const style = theme.layoutStyle || "topbar";
  const margin = theme.margin || { x: 0.5, y: 0.5 };

  switch (style) {
    case "topbar":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: "100%",
        h: 0.08,
        fill: { color: theme.accentColor },
      });
      break;

    case "sidebar":
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 0.15,
        h: "100%",
        fill: { color: theme.accentColor },
      });
      break;

    case "underline":
      slide.addShape(pptx.ShapeType.rect, {
        x: margin.x,
        y: 1.1,
        w: "40%",
        h: 0.03,
        fill: { color: theme.accentColor },
      });
      break;

    case "card":
      slide.addShape(pptx.ShapeType.rect, {
        x: margin.x - 0.1,
        y: margin.y - 0.1,
        w: "96%",
        h: "92%",
        fill: { color: theme.background },
        line: { color: theme.accentColor, width: 2 },
        shadow: theme.shadow
          ? {
              type: theme.shadow.type,
              blur: theme.shadow.blur,
              offset: theme.shadow.offset,
              angle: theme.shadow.angle,
              color: theme.shadow.color,
              opacity: theme.shadow.opacity,
            }
          : undefined,
      });
      break;
  }
}

/**
 * Get content X position based on layout style
 */
function getContentX(theme) {
  const style = theme.layoutStyle || "topbar";
  const margin = theme.margin || { x: 0.5, y: 0.5 };

  if (style === "sidebar") {
    return margin.x + 0.3; // Extra offset for sidebar
  }
  return margin.x;
}

async function generateThemePreview(themeName, themeConfig) {
  const pptx = new PptxGenJS();
  const margin = themeConfig.margin || { x: 0.5, y: 0.5 };
  const contentY = themeConfig.contentY || 1.3;
  const fontTitle = themeConfig.fontTitle || "Calibri";
  const fontBody = themeConfig.fontBody || "Calibri";

  pptx.title = `${themeConfig.name} Theme Preview`;
  pptx.author = "AnythingLLM Theme Tester";
  pptx.company = "AnythingLLM";

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.background = {
    color: themeConfig.titleSlideBackground || themeConfig.background,
  };
  titleSlide.addText(`${themeConfig.name} Theme`, {
    x: 0.5,
    y: "28%",
    w: "90%",
    h: 1.5,
    fontSize: 44,
    fontFace: fontTitle,
    bold: true,
    color: themeConfig.titleSlideTitleColor || themeConfig.titleColor,
    align: "center",
  });
  titleSlide.addText(themeConfig.description, {
    x: 0.5,
    y: "46%",
    w: "90%",
    h: 0.5,
    fontSize: 18,
    fontFace: fontBody,
    color: themeConfig.titleSlideSubtitleColor || themeConfig.subtitleColor,
    align: "center",
  });

  // Accent line on title slide
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: "20%",
    y: "56%",
    w: "60%",
    h: 0.04,
    fill: { color: themeConfig.accentColor },
  });

  titleSlide.addText(
    `Layout: ${themeConfig.layoutStyle || "topbar"} | Fonts: ${fontTitle} / ${fontBody}`,
    {
      x: 0.5,
      y: "62%",
      w: "90%",
      h: 0.5,
      fontSize: 14,
      fontFace: fontBody,
      color: themeConfig.titleSlideSubtitleColor || themeConfig.subtitleColor,
      align: "center",
    }
  );

  // Add branding to title slide
  addBranding(titleSlide, {
    background: themeConfig.titleSlideBackground || themeConfig.background,
  });

  // Sample slides
  for (const slideData of SAMPLE_SLIDES) {
    const slide = pptx.addSlide();
    slide.background = { color: themeConfig.background };
    const layout = slideData.layout || "content";

    if (layout === "title" || layout === "section") {
      slide.background = {
        color: themeConfig.titleSlideBackground || themeConfig.background,
      };
      slide.addText(slideData.title || "", {
        x: 0.5,
        y: "35%",
        w: "90%",
        h: 1.5,
        fontSize: layout === "title" ? 44 : 36,
        fontFace: fontTitle,
        bold: true,
        color: themeConfig.titleSlideTitleColor || themeConfig.titleColor,
        align: "center",
      });

      if (slideData.subtitle) {
        slide.addText(slideData.subtitle, {
          x: 0.5,
          y: layout === "title" ? "55%" : "52%",
          w: "90%",
          h: 0.5,
          fontSize: 18,
          fontFace: fontBody,
          color:
            themeConfig.titleSlideSubtitleColor || themeConfig.subtitleColor,
          align: "center",
        });
      }
    } else if (layout === "blank") {
      // Blank slide
    } else {
      // Content slide - apply layout style
      applyLayoutStyle(pptx, slide, themeConfig);

      const contentX = getContentX(themeConfig);

      if (slideData.title) {
        slide.addText(slideData.title, {
          x: contentX,
          y: margin.y,
          w: "90%",
          h: 0.8,
          fontSize: 28,
          fontFace: fontTitle,
          bold: true,
          color: themeConfig.titleColor,
        });
      }

      if (
        slideData.content &&
        Array.isArray(slideData.content) &&
        slideData.content.length > 0
      ) {
        const bulletPoints = slideData.content.map((text) => ({
          text: text,
          options: {
            fontSize: 18,
            fontFace: fontBody,
            color: themeConfig.bodyColor,
            bullet: { type: "bullet", color: themeConfig.bulletColor },
            paraSpaceAfter: 8,
          },
        }));

        slide.addText(bulletPoints, {
          x: contentX,
          y: contentY,
          w: "85%",
          h: 4.5,
          valign: "top",
        });
      }
    }

    // Add branding to every slide
    const slideBg =
      layout === "title" || layout === "section"
        ? themeConfig.titleSlideBackground || themeConfig.background
        : themeConfig.background;
    addBranding(slide, { background: slideBg });

    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }
  }

  // Theme info slide
  const infoSlide = pptx.addSlide();
  infoSlide.background = { color: themeConfig.background };
  applyLayoutStyle(pptx, infoSlide, themeConfig);

  const infoX = getContentX(themeConfig);

  infoSlide.addText("Theme Configuration", {
    x: infoX,
    y: margin.y,
    w: "90%",
    h: 0.8,
    fontSize: 28,
    fontFace: fontTitle,
    bold: true,
    color: themeConfig.titleColor,
  });

  const configInfo = [
    `Layout Style: ${themeConfig.layoutStyle || "topbar"}`,
    `Title Font: ${fontTitle}`,
    `Body Font: ${fontBody}`,
    `Content Y Position: ${contentY}`,
    `Margins: x=${margin.x}, y=${margin.y}`,
    `Shadow: ${themeConfig.shadow ? "Yes" : "None"}`,
  ];

  const configText = configInfo.map((text) => ({
    text: text,
    options: {
      fontSize: 16,
      fontFace: fontBody,
      color: themeConfig.bodyColor,
      bullet: { type: "bullet", color: themeConfig.bulletColor },
      paraSpaceAfter: 6,
    },
  }));

  infoSlide.addText(configText, {
    x: infoX,
    y: contentY,
    w: "85%",
    h: 3,
    valign: "top",
  });

  addBranding(infoSlide, { background: themeConfig.background });

  // Color swatch slide showing theme colors
  const swatchSlide = pptx.addSlide();
  swatchSlide.background = { color: themeConfig.background };
  applyLayoutStyle(pptx, swatchSlide, themeConfig);

  const swatchX = getContentX(themeConfig);

  swatchSlide.addText("Color Palette", {
    x: swatchX,
    y: margin.y,
    w: "90%",
    h: 0.8,
    fontSize: 28,
    fontFace: fontTitle,
    bold: true,
    color: themeConfig.titleColor,
  });

  const colors = [
    { name: "Background", color: themeConfig.background },
    {
      name: "Title Slide BG",
      color: themeConfig.titleSlideBackground || themeConfig.background,
    },
    { name: "Title Color", color: themeConfig.titleColor },
    { name: "Body Color", color: themeConfig.bodyColor },
    { name: "Accent Color", color: themeConfig.accentColor },
    { name: "Bullet Color", color: themeConfig.bulletColor },
  ];

  colors.forEach((c, i) => {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = swatchX + col * 3.0;
    const y = contentY + row * 1.6;

    // Color swatch
    swatchSlide.addShape(pptx.ShapeType.rect, {
      x: x,
      y: y,
      w: 0.7,
      h: 0.7,
      fill: { color: c.color },
      line: { color: "CCCCCC", width: 1 },
    });

    // Label
    swatchSlide.addText(`${c.name}\n#${c.color}`, {
      x: x + 0.8,
      y: y,
      w: 2,
      h: 0.7,
      fontSize: 11,
      fontFace: fontBody,
      color: themeConfig.bodyColor,
      valign: "middle",
    });
  });

  addBranding(swatchSlide, { background: themeConfig.background });

  const buffer = await pptx.write({ outputType: "nodebuffer" });
  const filename = `theme-${themeName}.pptx`;
  const filepath = path.join(OUTPUT_DIR, filename);

  await fs.writeFile(filepath, buffer);
  return filepath;
}

async function main() {
  console.log("Theme Preview Generator");
  console.log("=======================\n");

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const themes = getAvailableThemes();
  console.log(`Generating previews for ${themes.length} themes...\n`);

  for (const themeName of themes) {
    const themeConfig = THEMES[themeName];
    try {
      const filepath = await generateThemePreview(themeName, themeConfig);
      const style = (themeConfig.layoutStyle || "topbar").padEnd(10);
      console.log(
        `✓ ${themeConfig.name.padEnd(12)} [${style}] → ${path.basename(filepath)}`
      );
    } catch (error) {
      console.error(
        `✗ ${themeConfig.name.padEnd(12)} → Error: ${error.message}`
      );
    }
  }

  console.log(`\n✅ Done! Files saved to: ${OUTPUT_DIR}`);
  console.log("\nOpen the .pptx files to preview each theme.");
}

main().catch(console.error);
