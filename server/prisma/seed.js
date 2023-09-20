const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.system_settings.upsert({
    where: { label: 'multi_user_mode' },
    update: { value: 'false' },
    create: { label: 'multi_user_mode', value: 'false' },
  })

  await prisma.system_settings.upsert({
    where: { label: 'users_can_delete_workspaces' },
    update: { value: 'false' },
    create: { label: 'users_can_delete_workspaces', value: 'false' },
  })

  await prisma.system_settings.upsert({
    where: { label: 'limit_user_messages' },
    update: { value: 'false' },
    create: { label: 'limit_user_messages', value: 'false' },
  })

  await prisma.system_settings.upsert({
    where: { label: 'message_limit' },
    update: { value: '25' },
    create: { label: 'message_limit', value: '25' },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
