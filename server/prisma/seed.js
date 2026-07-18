const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();
const { SPARKY, getSparkyWorkspaceTemplate } = require("../utils/sparky");

async function main() {
  const settings = [
    { label: "multi_user_mode", value: "false" },
    { label: "logo_filename", value: "anything-llm.png" },
  ];

  for (let setting of settings) {
    const existing = await prisma.system_settings.findUnique({
      where: { label: setting.label },
    });

    // Only create the setting if it doesn't already exist
    if (!existing) {
      await prisma.system_settings.create({
        data: setting,
      });
    }
  }

  const sparkyTemplate = getSparkyWorkspaceTemplate();
  const sparkyPrompt = fs.readFileSync(SPARKY.systemPromptPath, "utf8");
  const existingSparky = await prisma.workspaces.findUnique({
    where: { slug: SPARKY.slug },
  });

  if (!existingSparky) {
    await prisma.workspaces.create({
      data: {
        name: sparkyTemplate.name,
        slug: sparkyTemplate.slug,
        chatMode: sparkyTemplate.chatMode,
        openAiPrompt: sparkyPrompt,
        pfpFilename: sparkyTemplate.pfpFilename,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
