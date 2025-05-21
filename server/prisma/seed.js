const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const settings = [
    { label: "multi_user_mode", value: "false" },
    { label: "logo_filename", value: "anything-llm.png" },
    { label: "hub_api_key", value: "YGDXDKJ-N67MF6C-KR8FKRS-QE812HM" },
  ];

  for (let setting of settings) {
    await prisma.system_settings.upsert({
      where: { label: setting.label },
      update: { value: setting.value },
      create: { label: setting.label, value: setting.value },
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
